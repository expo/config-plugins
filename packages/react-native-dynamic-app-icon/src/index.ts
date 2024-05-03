import { generateImageAsync } from "@expo/image-utils";
import {
  ConfigPlugin,
  ExportedConfigWithProps,
  IOSConfig,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
} from "expo/config-plugins";
import fs from "fs";
import path from "path";
// @ts-ignore
import pbxFile from "xcode/lib/pbxFile";

const folderName = "DynamicAppIcons";
const size = 60;
const scales = [2, 3];

type IconSet = Record<string, { image: string; prerendered?: boolean }>;

type Props = {
  icons: Record<string, { image: string; prerendered?: boolean }>;
};

function arrayToImages(images: string[]) {
  return images.reduce(
    (prev, curr, i) => ({ ...prev, [i]: { image: curr } }),
    {},
  );
}

const withDynamicIcon: ConfigPlugin<string[] | IconSet | void> = (
  config,
  props = {},
) => {
  const _props = props || {};

  let prepped: Props["icons"] = {};

  if (Array.isArray(_props)) {
    prepped = arrayToImages(_props);
  } else if (_props) {
    prepped = _props;
  }

  config = withIconXcodeProject(config, { icons: prepped });
  config = withIconInfoPlist(config, { icons: prepped });
  config = withIconImages(config, { icons: prepped });
  return config;
};

function getIconName(name: string, size: number, scale?: number, ipad = false) {
  const fileName = `${name}-Icon-${size}x${size}`;

  if (scale != null) {
    // TODO(cedric): clean this up and merge into existing scale API
    return ipad
      ? `${fileName}@${scale}x~ipad.png`
      : `${fileName}@${scale}x.png`;
  }
  return fileName;
}

const withIconXcodeProject: ConfigPlugin<Props> = (config, { icons }) => {
  return withXcodeProject(config, async (config) => {
    const groupPath = `${config.modRequest.projectName!}/${folderName}`;
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

    await iterateIconsAsync({ icons }, async (key, icon, index) => {
      for (const scale of scales) {
        const iconFileName = getIconName(key, size, scale);

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
      }

      // Temporary ipad sizes to check if Apple accepts these sizes
      // TODO(cedric): clean this up and merge into existing scale API
      const ipadx2FileName = getIconName(key, size, 2, true);
      if (
        !group?.children.some(
          ({ comment }: { comment: string }) => comment === ipadx2FileName,
        )
      ) {
        // Only write the file if it doesn't already exist.
        config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
          filepath: path.join(groupPath, ipadx2FileName),
          groupName: groupPath,
          project: config.modResults,
          isBuildFile: true,
          verbose: true,
        });
      } else {
        console.log("Skipping duplicate: ", ipadx2FileName);
      }
      const ipadx3FileName = getIconName(key, size, 3, true);
      if (
        !group?.children.some(
          ({ comment }: { comment: string }) => comment === ipadx3FileName,
        )
      ) {
        // Only write the file if it doesn't already exist.
        config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
          filepath: path.join(groupPath, ipadx3FileName),
          groupName: groupPath,
          project: config.modResults,
          isBuildFile: true,
          verbose: true,
        });
      } else {
        console.log("Skipping duplicate: ", ipadx3FileName);
      }
    });

    return config;
  });
};

const withIconInfoPlist: ConfigPlugin<Props> = (config, { icons }) => {
  return withInfoPlist(config, async (config) => {
    const altIcons: Record<
      string,
      { CFBundleIconFiles: string[]; UIPrerenderedIcon: boolean }
    > = {};

    await iterateIconsAsync({ icons }, async (key, icon) => {
      altIcons[key] = {
        CFBundleIconFiles: [
          // Must be a file path relative to the source root (not a icon set it seems).
          // i.e. `Bacon-Icon-60x60` when the image is `ios/somn/appIcons/Bacon-Icon-60x60@2x.png`
          getIconName(key, size),
        ],
        UIPrerenderedIcon: !!icon.prerendered,
      };
    });

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

const withIconImages: ConfigPlugin<Props> = (config, props) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      await createIconsAsync(config, props);
      return config;
    },
  ]);
};

async function createIconsAsync(
  config: ExportedConfigWithProps,
  { icons }: Props,
) {
  const iosRoot = path.join(
    config.modRequest.platformProjectRoot,
    config.modRequest.projectName!,
  );

  // Delete all existing assets
  await fs.promises
    .rm(path.join(iosRoot, folderName), { recursive: true, force: true })
    .catch(() => null);
  // Ensure directory exists
  await fs.promises.mkdir(path.join(iosRoot, folderName), { recursive: true });
  // Generate new assets
  await iterateIconsAsync({ icons }, async (key, icon) => {
    for (const scale of scales) {
      const iconFileName = getIconName(key, size, scale);
      const fileName = path.join(folderName, iconFileName);
      const outputPath = path.join(iosRoot, fileName);

      const scaledSize = scale * size;
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
          width: scaledSize,
          height: scaledSize,
        },
      );

      await fs.promises.writeFile(outputPath, source);
    }

    // Temporary ipad sizes to check if Apple accepts these sizes
    // TODO(cedric): clean this up and merge into existing scale API
    const { source: ipadx2 } = await generateImageAsync(
      {
        projectRoot: config.modRequest.projectRoot,
        cacheType: "react-native-dynamic-app-icon",
      },
      {
        name: getIconName(key, size, 2, true),
        src: icon.image,
        removeTransparency: true,
        backgroundColor: "#ffffff",
        resizeMode: "cover",
        width: 152, // See: https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS-app-icon-sizes
        height: 152, // See: https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS-app-icon-sizes
      },
    );
    const { source: ipadx3 } = await generateImageAsync(
      {
        projectRoot: config.modRequest.projectRoot,
        cacheType: "react-native-dynamic-app-icon",
      },
      {
        name: getIconName(key, size, 3, true),
        src: icon.image,
        removeTransparency: true,
        backgroundColor: "#ffffff",
        resizeMode: "cover",
        width: 167, // See: https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS-app-icon-sizes
        height: 167, // See: https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS-app-icon-sizes
      },
    );
    await Promise.all([
      fs.promises.writeFile(
        path.join(
          iosRoot,
          path.join(folderName, getIconName(key, size, 2, true)),
        ),
        ipadx2,
      ),
      fs.promises.writeFile(
        path.join(
          iosRoot,
          path.join(folderName, getIconName(key, size, 3, true)),
        ),
        ipadx3,
      ),
    ]);
  });
}

async function iterateIconsAsync(
  { icons }: Props,
  callback: (
    key: string,
    icon: { image: string; prerendered?: boolean },
    index: number,
  ) => Promise<void>,
) {
  const entries = Object.entries(icons);
  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i];

    await callback(key, val, i);
  }
}

export default withDynamicIcon;
