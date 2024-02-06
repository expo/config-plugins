import {
  PBXFileReference,
  PBXResourcesBuildPhase,
  PBXNativeTarget,
  XcodeProject,
} from "@bacons/xcode";
import { ConfigPlugin } from "@expo/config-plugins";
import path from "path";

import { withXcodeProjectBeta } from "./base-mods/withXcparse";

function getMainAppTarget(project: XcodeProject): PBXNativeTarget {
  const mainAppTarget = project.rootObject.props.targets.filter((target) => {
    if (
      PBXNativeTarget.is(target) &&
      target.props.productType === "com.apple.product-type.application"
    ) {
      return !(
        "WATCHOS_DEPLOYMENT_TARGET" in
        // @ts-expect-error
        getDefaultBuildConfigurationForTarget(target)?.props?.buildSettings
      );
    }
    return false;
  }) as PBXNativeTarget[];

  if (mainAppTarget.length > 1) {
    console.warn(
      `Multiple main app targets found, using first one: ${mainAppTarget
        .map((t) => t.getDisplayName())
        .join(", ")}}`,
    );
  }

  return mainAppTarget[0];
}

function getDefaultBuildConfigurationForTarget(target: PBXNativeTarget) {
  return target.props.buildConfigurationList.props.buildConfigurations.find(
    (config) =>
      config.props.name ===
      target.props.buildConfigurationList.props.defaultConfigurationName,
  );
}

export const withLinkedSettingsBundle: ConfigPlugin = (config) => {
  return withXcodeProjectBeta(config, (config) => {
    applyXcodeChanges(config.modResults, {
      projectName: config.modRequest.projectName!,
    });
    return config;
  });
};

async function applyXcodeChanges(
  project: XcodeProject,
  props: { projectName: string },
) {
  const mainAppTarget = getMainAppTarget(project);
  const mainResourceBuildPhase = mainAppTarget.getBuildPhase(
    PBXResourcesBuildPhase,
  );

  // Prevent duplicate.
  if (
    mainResourceBuildPhase?.props.files.find(
      (file) => file.props.fileRef.props.name === "Settings.bundle",
    )
  ) {
    return project;
  }

  const ref = PBXFileReference.create(project, {
    lastKnownFileType: "wrapper.plug-in",
    name: "Settings.bundle",
    path: path.join(props.projectName, "Settings.bundle"),
    sourceTree: "<group>",
  });

  mainResourceBuildPhase?.createFile({
    fileRef: ref,
  });

  // Add Setting.bundle to the project display.
  project.rootObject.props.mainGroup.props.children.push(ref);

  return project;
}
