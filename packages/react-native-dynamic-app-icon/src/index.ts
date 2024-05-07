import type { ExpoConfig } from "@expo/config";
import { generateImageAsync } from "@expo/image-utils";
import {
  type ConfigPlugin,
  IOSConfig,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
} from "expo/config-plugins";
import fs from "fs";
import path from "path";
// @ts-ignore
import pbxFile from "xcode/lib/pbxFile";

/** The default icon folder name to export to */
const ICON_FOLDER_NAME = "DynamicAppIcons";

/**
 * The default icon dimensions to export.
 *
 * @see https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS-app-icon-sizes
 */
const ICON_DIMENSIONS: IconDimensions[] = [
  // iPhone, iPad, MacOS, ...
  { scale: 2, size: 60 * 2 },
  { scale: 3, size: 60 * 3 },
  // iPad only
  { scale: 2, size: 152, target: "ipad" },
  { scale: 3, size: 167, target: "ipad" },
];

type IconDimensions = {
  /** The scale of the icon itself, only affects exported file name */
  scale: number;
  /** Both width and height of the icon */
  size: number;
  /** Special target of the icon dimension, if any */
  target?: "ipad";
};

type IconSet = Record<string, IconSetProps>;
type IconSetProps = { image: string; prerendered?: boolean };

type Props = {
  icons: Record<string, { image: string; prerendered?: boolean }>;
  dimensions: IconDimensions[];
};

const withDynamicIcon: ConfigPlugin<string[] | IconSet | void> = (
  config,
  props = {},
) => {
  const icons = resolveIcons(props);
  const dimensions = resolveIconDimensions(config);

  config = withIconXcodeProject(config, { icons, dimensions });
  config = withIconInfoPlist(config, { icons, dimensions });
  config = withIconImages(config, { icons, dimensions });

  return config;
};

const withIconXcodeProject: ConfigPlugin<Props> = (
  config,
  { icons, dimensions },
) => {
  return withXcodeProject(config, async (config) => {
    const groupPath = `${config.modRequest.projectName!}/${ICON_FOLDER_NAME}`;
    const group = IOSConfig.XcodeUtils.ensureGroupRecursively(
      config.modResults,
      groupPath,
    );
    const project = config.modResults;
    const opt: any = {};

    // Unlink old assets

    const groupId = Object.keys(project.hash.project.objects["PBXGroup"]).find(
      (id) => {
        const _group = project.hash.project.objects["PBXGroup"][id];
        return _group.name === group.name;
      },
    );
    if (!project.hash.project.objects["PBXVariantGroup"]) {
      project.hash.project.objects["PBXVariantGroup"] = {};
    }
    const variantGroupId = Object.keys(
      project.hash.project.objects["PBXVariantGroup"],
    ).find((id) => {
      const _group = project.hash.project.objects["PBXVariantGroup"][id];
      return _group.name === group.name;
    });

    const children = [...(group.children || [])];

    for (const child of children as {
      comment: string;
      value: string;
    }[]) {
      const file = new pbxFile(path.join(group.name, child.comment), opt);
      file.target = opt ? opt.target : undefined;

      project.removeFromPbxBuildFileSection(file); // PBXBuildFile
      project.removeFromPbxFileReferenceSection(file); // PBXFileReference
      if (group) {
        if (groupId) {
          project.removeFromPbxGroup(file, groupId); //Group other than Resources (i.e. 'splash')
        } else if (variantGroupId) {
          project.removeFromPbxVariantGroup(file, variantGroupId); // PBXVariantGroup
        }
      }
      project.removeFromPbxResourcesBuildPhase(file); // PBXResourcesBuildPhase
    }

    // Link new assets

    await iterateIconsAndDimensionsAsync(
      { icons, dimensions },
      async (key, { dimension }) => {
        const iconFileName = getIconFileName(key, dimension);

        if (
          !group?.children.some(
            ({ comment }: { comment: string }) => comment === iconFileName,
          )
        ) {
          // Only write the file if it doesn't already exist.
          config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
            filepath: path.join(groupPath, iconFileName),
            groupName: groupPath,
            project: config.modResults,
            isBuildFile: true,
            verbose: true,
          });
        } else {
          console.log("Skipping duplicate: ", iconFileName);
        }
      },
    );

    return config;
  });
};

const withIconInfoPlist: ConfigPlugin<Props> = (
  config,
  { icons, dimensions },
) => {
  return withInfoPlist(config, async (config) => {
    const altIcons: Record<
      string,
      { CFBundleIconFiles: string[]; UIPrerenderedIcon: boolean }
    > = {};

    await iterateIconsAndDimensionsAsync(
      { icons, dimensions },
      async (key, { icon, dimension }) => {
        altIcons[key] = {
          CFBundleIconFiles: [
            // Must be a file path relative to the source root (not a icon set it seems).
            // i.e. `Bacon-Icon-60x60` when the image is `ios/somn/appIcons/Bacon-Icon-60x60@2x.png`
            getIconFileName(key, dimension),
          ],
          UIPrerenderedIcon: !!icon.prerendered,
        };
      },
    );

    function applyToPlist(key: string) {
      if (
        typeof config.modResults[key] !== "object" ||
        Array.isArray(config.modResults[key]) ||
        !config.modResults[key]
      ) {
        config.modResults[key] = {};
      }

      // @ts-expect-error
      config.modResults[key].CFBundleAlternateIcons = altIcons;

      // @ts-expect-error
      config.modResults[key].CFBundlePrimaryIcon = {
        CFBundleIconFiles: ["AppIcon"],
      };
    }

    // Apply for both tablet and phone support
    applyToPlist("CFBundleIcons");
    applyToPlist("CFBundleIcons~ipad");

    return config;
  });
};

const withIconImages: ConfigPlugin<Props> = (config, { icons, dimensions }) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const iosRoot = path.join(
        config.modRequest.platformProjectRoot,
        config.modRequest.projectName!,
      );

      // Delete all existing assets
      await fs.promises
        .rm(path.join(iosRoot, ICON_FOLDER_NAME), {
          recursive: true,
          force: true,
        })
        .catch(() => null);

      // Ensure directory exists
      await fs.promises.mkdir(path.join(iosRoot, ICON_FOLDER_NAME), {
        recursive: true,
      });

      // Generate new assets
      await iterateIconsAndDimensionsAsync(
        { icons, dimensions },
        async (key, { icon, dimension }) => {
          const iconFileName = getIconFileName(key, dimension);
          const fileName = path.join(ICON_FOLDER_NAME, iconFileName);
          const outputPath = path.join(iosRoot, fileName);

          const { source } = await generateImageAsync(
            {
              projectRoot: config.modRequest.projectRoot,
              cacheType: "react-native-dynamic-app-icon",
            },
            {
              name: iconFileName,
              src: icon.image,
              removeTransparency: true,
              backgroundColor: "#ffffff",
              resizeMode: "cover",
              width: dimension.size,
              height: dimension.size,
            },
          );

          await fs.promises.writeFile(outputPath, source);
        },
      );

      return config;
    },
  ]);
};

/** Resolve and sanitize the icon set from config plugin props. */
function resolveIcons(props: string[] | IconSet | void): Props["icons"] {
  let icons: Props["icons"] = {};

  if (Array.isArray(props)) {
    icons = props.reduce(
      (prev, curr, i) => ({ ...prev, [i]: { image: curr } }),
      {},
    );
  } else if (props) {
    icons = props;
  }

  return icons;
}

/** Resolve the required icon dimension/target based on the app config. */
function resolveIconDimensions(config: ExpoConfig) {
  const targets: NonNullable<IconDimensions["target"]>[] = [];

  if (config.ios?.supportsTablet) {
    targets.push("ipad");
  }

  return ICON_DIMENSIONS.filter(
    (dimension) => !dimension.target || targets.includes(dimension.target),
  );
}

/** Get the icon file name based on name and dimensions  */
function getIconFileName(name: string, dimension: IconDimensions) {
  const { size, scale } = dimension;
  const target = dimension.target ? `~${dimension.target}` : "";

  return `${name}-Icon-${size}x${size}@${scale}x${target}.png`;
}

/** Iterate all combinations of icons and dimensions to export */
async function iterateIconsAndDimensionsAsync(
  { icons, dimensions }: Props,
  callback: (
    iconKey: string,
    iconAndDimension: { icon: IconSetProps; dimension: IconDimensions },
  ) => Promise<void>,
) {
  for (const [iconKey, icon] of Object.entries(icons)) {
    for (const dimension of dimensions) {
      await callback(iconKey, { icon, dimension });
    }
  }
}

export default withDynamicIcon;
