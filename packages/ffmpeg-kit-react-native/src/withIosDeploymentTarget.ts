// Copied from https://github.com/expo/expo-cli/blob/main/packages/install-expo-modules/src/plugins/ios/withIosDeploymentTarget.ts
import {
  type ConfigPlugin,
  withPodfileProperties,
  withXcodeProject,
  XcodeProject,
} from "expo/config-plugins";
import semver from "semver";

type IosDeploymentTargetConfigPlugin = ConfigPlugin<{
  deploymentTarget: string;
}>;

export const withIosDeploymentTarget: IosDeploymentTargetConfigPlugin = (
  config,
  props,
) => {
  config = withIosDeploymentTargetPodfile(config, props);
  config = withIosDeploymentTargetXcodeProject(config, props);
  return config;
};

const withIosDeploymentTargetPodfile: IosDeploymentTargetConfigPlugin = (
  config,
  props,
) => {
  return withPodfileProperties(config, async (config) => {
    const existing = config.modResults["ios.deploymentTarget"];
    if (
      typeof existing !== "string" ||
      semver.lt(toSemVer(existing), toSemVer(props.deploymentTarget))
    ) {
      config.modResults["ios.deploymentTarget"] = props.deploymentTarget;
    }
    return config;
  });
};

const withIosDeploymentTargetXcodeProject: IosDeploymentTargetConfigPlugin = (
  config,
  props,
) => {
  return withXcodeProject(config, (config) => {
    config.modResults = updateDeploymentTargetXcodeProject(
      config.modResults,
      props.deploymentTarget,
    );
    return config;
  });
};

export function updateDeploymentTargetXcodeProject(
  project: XcodeProject,
  deploymentTarget: string,
): XcodeProject {
  const configurations = project.pbxXCBuildConfigurationSection();
  // @ts-ignore
  for (const { buildSettings } of Object.values(configurations ?? {})) {
    const currDeploymentTarget = buildSettings?.IPHONEOS_DEPLOYMENT_TARGET;
    if (
      currDeploymentTarget &&
      semver.lt(toSemVer(currDeploymentTarget), toSemVer(deploymentTarget))
    ) {
      buildSettings.IPHONEOS_DEPLOYMENT_TARGET = deploymentTarget;
    }
  }
  return project;
}

function toSemVer(version: string): semver.SemVer {
  return semver.coerce(version) ?? new semver.SemVer("0.0.0");
}
