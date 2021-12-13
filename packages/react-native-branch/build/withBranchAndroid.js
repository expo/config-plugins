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
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchAndroid = exports.modifyMainActivity = exports.setBranchApiKey = exports.getBranchApiKey = exports.addBranchOnNewIntent = exports.addBranchInitSession = exports.modifyMainApplication = exports.editProguardRules = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const codeMod_1 = require("@expo/config-plugins/build/android/codeMod");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
function addGetAutoInstanceIfNeeded(mainApplication, isJava) {
    if (mainApplication.match(/\s+RNBranchModule\.getAutoInstance\(/m)) {
        return mainApplication;
    }
    const semicolon = isJava ? ";" : "";
    return codeMod_1.appendContentsInsideDeclarationBlock(mainApplication, "onCreate", `  RNBranchModule.getAutoInstance(this)${semicolon}\n  `);
}
function modifyMainApplication(mainApplication, language) {
    const isJava = language === "java";
    mainApplication = codeMod_1.addImports(mainApplication, ["io.branch.rnbranch.RNBranchModule"], isJava);
    mainApplication = addGetAutoInstanceIfNeeded(mainApplication, isJava);
    return mainApplication;
}
exports.modifyMainApplication = modifyMainApplication;
function addBranchInitSession(src) {
    const tag = "react-native-branch-init-session";
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
    const tag = "react-native-branch-on-new-intent";
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
const modifyMainActivity = (mainActivity, language) => {
    const isJava = language === "java";
    mainActivity = codeMod_1.addImports(mainActivity, ["android.content.Intent", "io.branch.rnbranch.*"], isJava);
    mainActivity = addBranchInitSession(mainActivity).contents;
    mainActivity = addBranchOnNewIntent(mainActivity).contents;
    return mainActivity;
};
exports.modifyMainActivity = modifyMainActivity;
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
    config = config_plugins_1.withMainApplication(config, (config) => {
        config.modResults.contents = modifyMainApplication(config.modResults.contents, config.modResults.language);
        return config;
    });
    config = config_plugins_1.withMainActivity(config, (config) => {
        config.modResults.contents = exports.modifyMainActivity(config.modResults.contents, config.modResults.language);
        return config;
    });
    // Update proguard rules directly
    config = config_plugins_1.withDangerousMod(config, [
        "android",
        async (config) => {
            await editProguardRules(config, (proguardRules) => {
                return appendContents({
                    tag: "react-native-branch-dont-warn",
                    src: proguardRules,
                    newSrc: ["-dontwarn io.branch.**"].join("\n"),
                    comment: "#",
                }).contents;
            });
            return config;
        },
    ]);
    return config;
};
exports.withBranchAndroid = withBranchAndroid;
