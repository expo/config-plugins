"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeploymentTargetXcodeProject = exports.updateDeploymentTargetPodfile = exports.withIosDeploymentTarget = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const semver_1 = __importDefault(require("semver"));
const withIosDeploymentTarget = (config, props) => {
    config = withIosDeploymentTargetPodfile(config, props);
    config = withIosDeploymentTargetXcodeProject(config, props);
    return config;
};
exports.withIosDeploymentTarget = withIosDeploymentTarget;
const withIosDeploymentTargetPodfile = (config, props) => {
    return config_plugins_1.withDangerousMod(config, [
        "ios",
        async (config) => {
            const podfile = path_1.default.join(config.modRequest.platformProjectRoot, "Podfile");
            let contents = await fs_1.default.promises.readFile(podfile, "utf8");
            contents = updateDeploymentTargetPodfile(contents, props.deploymentTarget);
            await fs_1.default.promises.writeFile(podfile, contents);
            return config;
        },
    ]);
};
function updateDeploymentTargetPodfile(contents, deploymentTarget) {
    return contents.replace(/^(\s*platform :ios, ['"])([\d.]+)(['"])/gm, (match, prefix, version, suffix) => {
        if (semver_1.default.lt(toSemVer(version), toSemVer(deploymentTarget))) {
            return `${prefix}${deploymentTarget}${suffix}`;
        }
        return match;
    });
}
exports.updateDeploymentTargetPodfile = updateDeploymentTargetPodfile;
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
