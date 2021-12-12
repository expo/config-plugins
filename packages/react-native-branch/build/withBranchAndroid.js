"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchAndroid = exports.setBranchApiKey = exports.getBranchApiKey = exports.addBranchOnNewIntent = exports.addBranchInitSession = exports.addBranchMainActivityImport = exports.addBranchGetAutoInstance = exports.addBranchMainApplicationImport = exports.editProguardRules = exports.editMainApplication = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const assert_1 = __importDefault(require("assert"));
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow, removeMetaDataItemFromMainApplication, } = config_plugins_1.AndroidConfig.Manifest;
const META_BRANCH_KEY = "io.branch.sdk.BranchKey";
async function readFileAsync(path) {
    return fs.promises.readFile(path, "utf8");
}
async function saveFileAsync(path, content) {
    return fs.promises.writeFile(path, content, "utf8");
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
    const mainApplicationPath = path.join(config.modRequest.platformProjectRoot, "app", "src", "main", "java", ...packageName.split("."), "MainApplication.java");
    try {
        const mainApplication = action(await readFileAsync(mainApplicationPath));
        return await saveFileAsync(mainApplicationPath, mainApplication);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningAndroid("@config-plugins/react-native-branch", `Couldn't modify MainApplication.java - ${e}.`);
    }
}
exports.editMainApplication = editMainApplication;
async function editProguardRules(config, action) {
    const proguardRulesPath = path.join(config.modRequest.platformProjectRoot, "app", "proguard-rules.pro");
    try {
        const proguardRules = action(await readFileAsync(proguardRulesPath));
        return await saveFileAsync(proguardRulesPath, proguardRules);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningAndroid("@config-plugins/react-native-branch", `Couldn't modify proguard-rules.pro - ${e}.`);
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
function getBranchApiKey(config) {
    var _a, _b, _c, _d;
    return (_d = (_c = (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.branch) === null || _c === void 0 ? void 0 : _c.apiKey) !== null && _d !== void 0 ? _d : null;
}
exports.getBranchApiKey = getBranchApiKey;
function setBranchApiKey(apiKey, androidManifest) {
    const mainApplication = getMainApplicationOrThrow(androidManifest);
    if (apiKey) {
        // If the item exists, add it back
        addMetaDataItemToMainApplication(mainApplication, META_BRANCH_KEY, apiKey);
    }
    else {
        // Remove any existing item
        removeMetaDataItemFromMainApplication(mainApplication, META_BRANCH_KEY);
    }
    return androidManifest;
}
exports.setBranchApiKey = setBranchApiKey;
const withBranchAndroid = (config, data) => {
    var _a;
    const apiKey = (_a = data.apiKey) !== null && _a !== void 0 ? _a : getBranchApiKey(config);
    if (!apiKey) {
        throw new Error("Branch API key is required");
    }
    config = config_plugins_1.withAndroidManifest(config, (config) => {
        config.modResults = setBranchApiKey(apiKey, config.modResults);
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
