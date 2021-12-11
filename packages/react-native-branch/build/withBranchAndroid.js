"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchAndroid = exports.setCustomConfigAsync = exports.addBranchOnNewIntent = exports.addBranchInitSession = exports.addBranchMainActivityImport = exports.addBranchGetAutoInstance = exports.addBranchMainApplicationImport = exports.editProguardRules = exports.editMainApplication = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const assert_1 = __importDefault(require("assert"));
async function readFileAsync(path) {
    return fs_1.default.promises.readFile(path, "utf8");
}
async function saveFileAsync(path, content) {
    return fs_1.default.promises.writeFile(path, content, "utf8");
}
// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
function appendContents({ src, newSrc, tag, comment, }) {
    const header = generateCode_1.createGeneratedHeaderComment(newSrc, tag, comment);
    if (!src.includes(header)) {
        // Ensure the old generated contents are removed.
        const sanitizedTarget = generateCode_1.removeGeneratedContents(src, tag);
        const contentsToAdd = [
            // @something
            header,
            // contents
            newSrc,
            // @end
            `${comment} @generated end ${tag}`,
        ].join("\n");
        return {
            contents: (sanitizedTarget !== null && sanitizedTarget !== void 0 ? sanitizedTarget : src) + contentsToAdd,
            didMerge: true,
            didClear: !!sanitizedTarget,
        };
    }
    return { contents: src, didClear: false, didMerge: false };
}
async function editMainApplication(config, action) {
    var _a;
    const packageName = (_a = config.android) === null || _a === void 0 ? void 0 : _a.package;
    assert_1.default(packageName, "android.package must be defined");
    const mainApplicationPath = path_1.default.join(config.modRequest.platformProjectRoot, "app", "src", "main", "java", ...packageName.split("."), "MainApplication.java");
    try {
        const mainApplication = action(await readFileAsync(mainApplicationPath));
        return await saveFileAsync(mainApplicationPath, mainApplication);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningAndroid("rn-branch-plugin", `Couldn't modify MainApplication.java - ${e}.`);
    }
}
exports.editMainApplication = editMainApplication;
async function editProguardRules(config, action) {
    const proguardRulesPath = path_1.default.join(config.modRequest.platformProjectRoot, "app", "proguard-rules.pro");
    try {
        const proguardRules = action(await readFileAsync(proguardRulesPath));
        return await saveFileAsync(proguardRulesPath, proguardRules);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningAndroid("rn-branch-plugin", `Couldn't modify proguard-rules.pro - ${e}.`);
    }
}
exports.editProguardRules = editProguardRules;
function addBranchMainApplicationImport(src, packageId) {
    const newSrc = ["import io.branch.rnbranch.RNBranchModule;"];
    return generateCode_1.mergeContents({
        tag: "rn-branch-import",
        src,
        newSrc: newSrc.join("\n"),
        anchor: `package ${packageId};`,
        offset: 1,
        comment: "//",
    });
}
exports.addBranchMainApplicationImport = addBranchMainApplicationImport;
function addBranchGetAutoInstance(src) {
    const newSrc = ["    RNBranchModule.getAutoInstance(this);"];
    return generateCode_1.mergeContents({
        tag: "rn-branch-auto-instance",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /super\.onCreate\(\);/,
        offset: 1,
        comment: "//",
    });
}
exports.addBranchGetAutoInstance = addBranchGetAutoInstance;
function addBranchMainActivityImport(src, packageId) {
    const newSrc = [
        "import android.content.Intent;",
        "import io.branch.rnbranch.*;",
    ];
    return generateCode_1.mergeContents({
        tag: "rn-branch-import",
        src,
        newSrc: newSrc.join("\n"),
        anchor: `package ${packageId};`,
        offset: 1,
        comment: "//",
    });
}
exports.addBranchMainActivityImport = addBranchMainActivityImport;
function addBranchInitSession(src) {
    const tag = "rn-branch-init-session";
    try {
        const newSrc = [
            "    RNBranchModule.initSession(getIntent().getData(), this);",
        ];
        return generateCode_1.mergeContents({
            tag,
            src,
            newSrc: newSrc.join("\n"),
            anchor: /super\.onStart\(\);/,
            offset: 1,
            comment: "//",
        });
    }
    catch (err) {
        if (err.code !== "ERR_NO_MATCH") {
            throw err;
        }
    }
    const newSrc = [
        "  @Override",
        "  protected void onStart() {",
        "    super.onStart();",
        "    RNBranchModule.initSession(getIntent().getData(), this);",
        "  }",
    ];
    return generateCode_1.mergeContents({
        tag,
        src,
        newSrc: newSrc.join("\n"),
        anchor: `getMainComponentName`,
        offset: 3,
        comment: "//",
    });
}
exports.addBranchInitSession = addBranchInitSession;
function addBranchOnNewIntent(src) {
    const tag = "rn-branch-on-new-intent";
    try {
        const newSrc = ["    RNBranchModule.onNewIntent(intent);"];
        return generateCode_1.mergeContents({
            tag,
            src,
            newSrc: newSrc.join("\n"),
            anchor: /super\.onNewIntent\(intent\);/,
            offset: 1,
            comment: "//",
        });
    }
    catch (err) {
        if (err.code !== "ERR_NO_MATCH") {
            throw err;
        }
    }
    const newSrc = [
        "  @Override",
        "  public void onNewIntent(Intent intent) {",
        "    super.onNewIntent(intent);",
        "    RNBranchModule.onNewIntent(intent);",
        "  }",
    ];
    return generateCode_1.mergeContents({
        tag,
        src,
        newSrc: newSrc.join("\n"),
        anchor: `getMainComponentName`,
        offset: 3,
        comment: "//",
    });
}
exports.addBranchOnNewIntent = addBranchOnNewIntent;
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = config_plugins_1.AndroidConfig.Manifest;
// Splitting this function out of the mod makes it easier to test.
async function setCustomConfigAsync(config, androidManifest, branchApiKey) {
    // Get the <application /> tag and assert if it doesn't exist.
    const mainApplication = getMainApplicationOrThrow(androidManifest);
    addMetaDataItemToMainApplication(mainApplication, 
    // value for `android:name`
    "io.branch.sdk.BranchKey", 
    // value for `android:value`
    branchApiKey);
    return androidManifest;
}
exports.setCustomConfigAsync = setCustomConfigAsync;
const withBranchAndroid = (config, data) => {
    // Insert the branch_key into the AndroidManifest
    config = config_plugins_1.withAndroidManifest(config, async (config) => {
        // Modifiers can be async, but try to keep them fast.
        config.modResults = await setCustomConfigAsync(config, config.modResults, data.apiKey);
        return config;
    });
    // Directly edit MainApplication.java
    config = config_plugins_1.withDangerousMod(config, [
        "android",
        async (config) => {
            var _a;
            const packageName = (_a = config.android) === null || _a === void 0 ? void 0 : _a.package;
            assert_1.default(packageName, "android.package must be defined");
            await editMainApplication(config, (mainApplication) => {
                mainApplication = addBranchMainApplicationImport(mainApplication, packageName).contents;
                mainApplication = addBranchGetAutoInstance(mainApplication).contents;
                return mainApplication;
            });
            return config;
        },
    ]);
    // Update proguard rules directly
    config = config_plugins_1.withDangerousMod(config, [
        "android",
        async (config) => {
            await editProguardRules(config, (proguardRules) => {
                return appendContents({
                    tag: "rn-branch-dont-warn",
                    src: proguardRules,
                    newSrc: ["-dontwarn io.branch.**"].join("\n"),
                    comment: "#",
                }).contents;
            });
            return config;
        },
    ]);
    // Insert the required Branch code into MainActivity.java
    config = config_plugins_1.withMainActivity(config, (config) => {
        var _a;
        const packageName = (_a = config.android) === null || _a === void 0 ? void 0 : _a.package;
        assert_1.default(packageName, "android.package must be defined");
        config.modResults.contents = addBranchMainActivityImport(config.modResults.contents, packageName).contents;
        config.modResults.contents = addBranchInitSession(config.modResults.contents).contents;
        config.modResults.contents = addBranchOnNewIntent(config.modResults.contents).contents;
        return config;
    });
    return config;
};
exports.withBranchAndroid = withBranchAndroid;
