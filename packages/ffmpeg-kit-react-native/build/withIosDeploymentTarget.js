"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeploymentTargetXcodeProject = exports.withIosDeploymentTarget = void 0;
// Copied from https://github.com/expo/expo-cli/blob/main/packages/install-expo-modules/src/plugins/ios/withIosDeploymentTarget.ts
const config_plugins_1 = require("@expo/config-plugins");
const semver_1 = __importDefault(require("semver"));
const withIosDeploymentTarget = (config, props) => {
    config = withIosDeploymentTargetPodfile(config, props);
    config = withIosDeploymentTargetXcodeProject(config, props);
    return config;
};
exports.withIosDeploymentTarget = withIosDeploymentTarget;
const withIosDeploymentTargetPodfile = (config, props) => {
    return config_plugins_1.withPodfileProperties(config, async (config) => {
        const existing = config.modResults["ios.deploymentTarget"];
        if (typeof existing !== "string" ||
            semver_1.default.lt(toSemVer(existing), toSemVer(props.deploymentTarget))) {
            config.modResults["ios.deploymentTarget"] = props.deploymentTarget;
        }
        return config;
    });
};
const withIosDeploymentTargetXcodeProject = (config, props) => {
    return config_plugins_1.withXcodeProject(config, (config) => {
        config.modResults = updateDeploymentTargetXcodeProject(config.modResults, props.deploymentTarget);
        return config;
    });
};
function updateDeploymentTargetXcodeProject(project, deploymentTarget) {
    const configurations = project.pbxXCBuildConfigurationSection();
    // @ts-ignore
    for (const { buildSettings } of Object.values(configurations !== null && configurations !== void 0 ? configurations : {})) {
        const currDeploymentTarget = buildSettings === null || buildSettings === void 0 ? void 0 : buildSettings.IPHONEOS_DEPLOYMENT_TARGET;
        if (currDeploymentTarget &&
            semver_1.default.lt(toSemVer(currDeploymentTarget), toSemVer(deploymentTarget))) {
            buildSettings.IPHONEOS_DEPLOYMENT_TARGET = deploymentTarget;
        }
    }
    return project;
}
exports.updateDeploymentTargetXcodeProject = updateDeploymentTargetXcodeProject;
function toSemVer(version) {
    var _a;
    return (_a = semver_1.default.coerce(version)) !== null && _a !== void 0 ? _a : new semver_1.default.SemVer("0.0.0");
}
