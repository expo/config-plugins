import { XcodeProject } from "@expo/config-plugins";
import path from "path";
import util from "util";
// @ts-ignore
import pbxFile from "xcode/lib/pbxFile";

export function getMainPBXGroup(proj: XcodeProject) {
  const project = proj.pbxProjectSection()[proj.getFirstProject().uuid];

  if (!project || !project.mainGroup) {
    return null;
  }

  const groupObj = proj.hash.project.objects.PBXGroup[project.mainGroup];
  if (!groupObj) {
    return null;
  }
  return { id: project.mainGroup, obj: groupObj };
}

export function addStickerResourceFile(
  proj: XcodeProject,
  path: string,
  rootFolderName: string
) {
  const opt: Record<string, any> = {};

  let file = new pbxFile(path, opt);
  if (proj.hasFile(file.path)) {
    return false;
  }

  file.uuid = proj.generateUuid();
  file.target = opt ? opt.target : undefined;

  correctForResourcesPath(file, proj);
  file.fileRef = proj.generateUuid();

  // create stickers group
  const stickersKey = proj.pbxCreateGroup(
    // Without quotes, this breaks the xcode project
    `"${rootFolderName}"`,
    `"${rootFolderName}"`
  );

  proj.addToPbxBuildFileSection(file); // PBXBuildFile
  // proj.addToPbxResourcesBuildPhase(file); // PBXResourcesBuildPhase
  // ^ the above was written as a shortcut, I guess nobody expected there to be another BuildPhase
  //   var self = proj;
  const addToPbxStickersBuildPhase = function (file: any) {
    // use the name Stickers instead of Resources to identify the new BuildPhase
    const sources = proj.buildPhaseObject(
      "PBXResourcesBuildPhase",
      // "Resources",
      rootFolderName,
      // Resources,
      file.target
    );
    sources.files.push(pbxBuildPhaseObj(file));
  };

  addToPbxStickersBuildPhase(file);

  // PBXFileReference
  proj.addToPbxFileReferenceSection(file);
  proj.addToPbxGroup(file, stickersKey);

  // Push the Stickers Info.plist
  file = new pbxFile("Info.plist", opt);
  if (proj.hasFile(file.path)) {
    return false;
  }
  file.uuid = proj.generateUuid();
  correctForResourcesPath(file, proj, rootFolderName);
  file.fileRef = proj.generateUuid();
  // PBXFileReference
  proj.addToPbxFileReferenceSection(file);
  proj.addToPbxGroup(file, stickersKey);

  return stickersKey;
}

const isaXCBuildConfiguration = "XCBuildConfiguration";
const pbxTargetDependency = "PBXTargetDependency";
const pbxContainerItemProxy = "PBXContainerItemProxy";

export function addStickersTarget(
  proj: XcodeProject,
  name: string,
  bundleId: string,
  subfolder: string
) {
  // Setup uuid and name of new target
  const targetUuid = proj.generateUuid();
  const targetType = "app_extension_messages_sticker_pack";
  const targetName = name.trim();
  const bundleName = subfolder.trim().split(" ").join("-");

  // Check type against list of allowed target types
  if (!targetName) {
    throw new Error("Target name missing.");
  }

  // Check type against list of allowed target types
  if (!targetType) {
    throw new Error("Target type missing.");
  }

  // Check type against list of allowed target types
  if (!producttypeForTargettype(targetType)) {
    throw new Error("Target type invalid: " + targetType);
  }

  const PRODUCT_BUNDLE_IDENTIFIER = `"${bundleId}.${bundleName}"`;
  const INFOPLIST_FILE = `"${subfolder}/Info.plist"`;

  const commonBuildSettings = {
    ASSETCATALOG_COMPILER_APPICON_NAME: '"iMessage App Icon"',
    CLANG_ANALYZER_NONNULL: "YES",
    CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION: "YES_AGGRESSIVE",
    CLANG_CXX_LANGUAGE_STANDARD: '"gnu++14"',
    CLANG_ENABLE_OBJC_WEAK: "YES",
    CLANG_WARN_DOCUMENTATION_COMMENTS: "YES",
    CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER: "YES",
    CLANG_WARN_UNGUARDED_AVAILABILITY: "YES_AGGRESSIVE",
    CODE_SIGN_STYLE: "Automatic",
    DEBUG_INFORMATION_FORMAT: "dwarf",
    GCC_C_LANGUAGE_STANDARD: "gnu11",
    INFOPLIST_FILE,
    IPHONEOS_DEPLOYMENT_TARGET: "14.5",
    MTL_FAST_MATH: "YES",
    PRODUCT_BUNDLE_IDENTIFIER,
    PRODUCT_NAME: `"$(TARGET_NAME)"`,
    SKIP_INSTALL: "YES",
    TARGETED_DEVICE_FAMILY: `"1,2"`,
  };
  // Build Configuration: Create
  const buildConfigurationsList = [
    {
      name: "Debug",
      isa: isaXCBuildConfiguration,
      buildSettings: {
        ...commonBuildSettings,
        MTL_ENABLE_DEBUG_INFO: "INCLUDE_SOURCE",
      },
    },
    {
      name: "Release",
      isa: isaXCBuildConfiguration,
      buildSettings: {
        ...commonBuildSettings,
        COPY_PHASE_STRIP: "NO",
      },
    },
  ];

  const existing = proj.hash.project.objects[isaXCBuildConfiguration];

  for (const [, config] of Object.entries(existing)) {
    if (typeof config === "string") continue;

    if (
      (config as any).buildSettings.ASSETCATALOG_COMPILER_APPICON_NAME &&
      (config as any).buildSettings.ASSETCATALOG_COMPILER_APPICON_NAME.match(
        /iMessage App Icon/
      )
    ) {
      // Has existing setup...
      // TODO: sync old values with potentially new values...
      return false;
    }
  }

  // Build Configuration: Add
  const buildConfigurations = proj.addXCConfigurationList(
    buildConfigurationsList,
    "Release",
    `Build configuration list for PBXNativeTarget ${quoted(targetName)} `
  );

  // Product: Create
  const productName = targetName;
  const productType = producttypeForTargettype(targetType);
  const productFileType = filetypeForProducttype(productType);
  const productFile = proj.addProductFile(productName, {
    group: "Embed App Extensions",
    target: targetUuid,
    explicitFileType: productFileType,
  });

  // stickers
  productFile.settings = productFile.settings || {};
  productFile.settings.ATTRIBUTES = ["RemoveHeadersOnCopy"];

  // Product: Add to build file list
  proj.addToPbxBuildFileSection(productFile);

  const strippedTargetName = path.basename(targetName, ".appex").trim();
  const quotedTargetName = quoted(strippedTargetName);

  // Target: Create
  const target = {
    uuid: targetUuid,
    pbxNativeTarget: {
      isa: "PBXNativeTarget",
      name: quotedTargetName,
      productName: quotedTargetName,
      productReference: productFile.fileRef,
      productType: quoted(producttypeForTargettype(targetType)),
      buildConfigurationList: buildConfigurations.uuid,
      buildPhases: [],
      buildRules: [],
      dependencies: [],
    },
  };

  // Target: Add to PBXNativeTarget section
  proj.addToPbxNativeTargetSection(target);

  // Product: Embed (only for "extension"-type targets)
  // Create CopyFiles phase in first target
  const { buildPhase } = proj.addBuildPhase(
    [],
    "PBXCopyFilesBuildPhase",
    "Embed App Extensions",
    proj.getFirstTarget().uuid,
    // targetType,
    "app_extension"
  );

  // TODO: Add to https://github.com/apache/cordova-node-xcode/blob/8b98cabc5978359db88dc9ff2d4c015cba40f150/lib/pbxProject.js#L1604
  buildPhase.dstSubfolderSpec = 13;

  addToPbxCopyfilesBuildPhase(proj, productFile, "Embed App Extensions");

  // need to add another buildphase
  // filePathsArray, buildPhaseType, comment, target
  proj.addBuildPhase([], "PBXResourcesBuildPhase", subfolder, targetUuid);

  // Target: Add uuid to root project
  proj.addToPbxProjectSection(target);

  // const pbxTargetDependencySection = proj.hash.project.objects[pbxTargetDependency];
  // These need to be defined in projects that don't have them already
  if (!proj.hash.project.objects[pbxTargetDependency]) {
    proj.hash.project.objects[pbxTargetDependency] = {};
  }
  if (!proj.hash.project.objects[pbxContainerItemProxy]) {
    proj.hash.project.objects[pbxContainerItemProxy] = {};
  }

  proj.addTargetDependency(proj.getFirstTarget().uuid, [target.uuid]);

  // Set the creation tools and provisioning....
  if (
    !proj.pbxProjectSection()[proj.getFirstProject().uuid].attributes
      .TargetAttributes
  ) {
    proj.pbxProjectSection()[
      proj.getFirstProject().uuid
    ].attributes.TargetAttributes = {};
  }
  proj.pbxProjectSection()[
    proj.getFirstProject().uuid
  ].attributes.TargetAttributes[target.uuid] = {
    CreatedOnToolsVersion: "12.5",
    ProvisioningStyle: "Automatic",
  };

  return target;
}

type PBXFile = any;

// Copied over from xcode package for public

function correctForResourcesPath(
  file: PBXFile,
  project: XcodeProject,
  name: string = "Resources"
) {
  return correctForPath(file, project, name);
}

function correctForPath(file: PBXFile, project: XcodeProject, group: string) {
  const r_group_dir = new RegExp("^" + group + "[\\\\/]");

  const _group = project.pbxGroupByName(group);
  if (_group && _group.path) {
    file.path = file.path.replace(r_group_dir, "");
  }

  return file;
}

function addToPbxCopyfilesBuildPhase(
  proj: XcodeProject,
  file: PBXFile,
  name: string
) {
  const sources = proj.buildPhaseObject(
    "PBXCopyFilesBuildPhase",
    name || "Copy Files",
    file.target
  );
  sources.files.push(pbxBuildPhaseObj(file));
}

function producttypeForTargettype(targetType: string): string {
  const PRODUCTTYPE_BY_TARGETTYPE: Record<string, string> = {
    application: "com.apple.product-type.application",
    app_extension: "com.apple.product-type.app-extension",
    bundle: "com.apple.product-type.bundle",
    command_line_tool: "com.apple.product-type.tool",
    dynamic_library: "com.apple.product-type.library.dynamic",
    framework: "com.apple.product-type.framework",
    static_library: "com.apple.product-type.library.static",
    unit_test_bundle: "com.apple.product-type.bundle.unit-test",
    watch_app: "com.apple.product-type.application.watchapp",
    watch2_app: "com.apple.product-type.application.watchapp2",
    watch_extension: "com.apple.product-type.watchkit-extension",
    watch2_extension: "com.apple.product-type.watchkit2-extension",
    // Custom
    app_extension_messages_sticker_pack:
      "com.apple.product-type.app-extension.messages-sticker-pack",
  };

  return PRODUCTTYPE_BY_TARGETTYPE[targetType];
}

function filetypeForProducttype(productType: string) {
  const FILETYPE_BY_PRODUCTTYPE: Record<string, string> = {
    "com.apple.product-type.application": '"wrapper.application"',
    "com.apple.product-type.app-extension": '"wrapper.app-extension"',
    "com.apple.product-type.bundle": '"wrapper.plug-in"',
    "com.apple.product-type.tool": '"compiled.mach-o.dylib"',
    "com.apple.product-type.library.dynamic": '"compiled.mach-o.dylib"',
    "com.apple.product-type.framework": '"wrapper.framework"',
    "com.apple.product-type.library.static": '"archive.ar"',
    "com.apple.product-type.bundle.unit-test": '"wrapper.cfbundle"',
    "com.apple.product-type.application.watchapp": '"wrapper.application"',
    "com.apple.product-type.application.watchapp2": '"wrapper.application"',
    "com.apple.product-type.watchkit-extension": '"wrapper.app-extension"',
    "com.apple.product-type.watchkit2-extension": '"wrapper.app-extension"',
    // Custom
    "com.apple.product-type.app-extension.messages-sticker-pack":
      '"wrapper.app-extension"',
  };

  return FILETYPE_BY_PRODUCTTYPE[productType];
}

function pbxBuildPhaseObj(file: PBXFile) {
  const obj = Object.create(null);

  obj.value = file.uuid;
  obj.comment = longComment(file);

  return obj;
}

function longComment(file: PBXFile) {
  return util.format("%s in %s", file.basename, file.group);
}

function quoted(str: string) {
  return util.format(`"%s"`, str);
}
