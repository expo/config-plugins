"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var config_plugins_1 = require("@expo/config-plugins");
var image_utils_1 = require("@expo/image-utils");
var fs_1 = require("fs");
var path_1 = require("path");
var folderName = "DynamicAppIcons";
var size = 60;
var scales = [2, 3];
function arrayToImages(images) {
    return images.reduce(function (prev, curr, i) {
        var _a;
        return (__assign(__assign({}, prev), (_a = {}, _a[i] = { image: curr }, _a)));
    }, {});
}
var withDynamicIcon = function (config, props) {
    if (props === void 0) { props = {}; }
    var _props = props || {};
    var prepped = {};
    if (Array.isArray(_props)) {
        prepped = arrayToImages(_props);
    }
    else if (_props) {
        prepped = _props;
    }
    config = withIconXcodeProject(config, { icons: prepped });
    config = withIconInfoPlist(config, { icons: prepped });
    config = withIconImages(config, { icons: prepped });
    return config;
};
function getIconName(name, size, scale) {
    var fileName = name + "-Icon-" + size + "x" + size;
    if (scale != null) {
        return fileName + "@" + scale + "x.png";
    }
    return fileName;
}
// @ts-ignore
var pbxFile_1 = require("xcode/lib/pbxFile");
var withIconXcodeProject = function (config, _a) {
    var icons = _a.icons;
    return config_plugins_1.withXcodeProject(config, function (config) { return __awaiter(void 0, void 0, void 0, function () {
        var groupPath, group, project, opt, groupId, variantGroupId, children, _i, _a, child, file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    groupPath = config.modRequest.projectName + "/" + folderName;
                    group = config_plugins_1.IOSConfig.XcodeUtils.ensureGroupRecursively(config.modResults, groupPath);
                    project = config.modResults;
                    opt = {};
                    groupId = Object.keys(project.hash.project.objects["PBXGroup"]).find(function (id) {
                        var _group = project.hash.project.objects["PBXGroup"][id];
                        return _group.name === group.name;
                    });
                    if (!project.hash.project.objects["PBXVariantGroup"]) {
                        project.hash.project.objects["PBXVariantGroup"] = {};
                    }
                    variantGroupId = Object.keys(project.hash.project.objects["PBXVariantGroup"]).find(function (id) {
                        var _group = project.hash.project.objects["PBXVariantGroup"][id];
                        return _group.name === group.name;
                    });
                    children = __spreadArray([], (group.children || []));
                    for (_i = 0, _a = children; _i < _a.length; _i++) {
                        child = _a[_i];
                        file = new pbxFile_1["default"](path_1["default"].join(group.name, child.comment), opt);
                        file.target = opt ? opt.target : undefined;
                        project.removeFromPbxBuildFileSection(file); // PBXBuildFile
                        project.removeFromPbxFileReferenceSection(file); // PBXFileReference
                        if (group) {
                            if (groupId) {
                                project.removeFromPbxGroup(file, groupId); //Group other than Resources (i.e. 'splash')
                            }
                            else if (variantGroupId) {
                                project.removeFromPbxVariantGroup(file, variantGroupId); // PBXVariantGroup
                            }
                        }
                        project.removeFromPbxResourcesBuildPhase(file); // PBXResourcesBuildPhase
                    }
                    // Link new assets
                    return [4 /*yield*/, iterateIconsAsync({ icons: icons }, function (key, icon, index) { return __awaiter(void 0, void 0, void 0, function () {
                            var _loop_1, _i, scales_1, scale;
                            return __generator(this, function (_a) {
                                _loop_1 = function (scale) {
                                    var iconFileName = getIconName(key, size, scale);
                                    if (!(group === null || group === void 0 ? void 0 : group.children.some(function (_a) {
                                        var comment = _a.comment;
                                        return comment === iconFileName;
                                    }))) {
                                        // Only write the file if it doesn't already exist.
                                        config.modResults = config_plugins_1.IOSConfig.XcodeUtils.addResourceFileToGroup({
                                            filepath: path_1["default"].join(groupPath, iconFileName),
                                            groupName: groupPath,
                                            project: config.modResults,
                                            isBuildFile: true,
                                            verbose: true
                                        });
                                    }
                                    else {
                                        console.log("Skipping duplicate: ", iconFileName);
                                    }
                                };
                                for (_i = 0, scales_1 = scales; _i < scales_1.length; _i++) {
                                    scale = scales_1[_i];
                                    _loop_1(scale);
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    // Link new assets
                    _b.sent();
                    return [2 /*return*/, config];
            }
        });
    }); });
};
var withIconInfoPlist = function (config, _a) {
    var icons = _a.icons;
    return config_plugins_1.withInfoPlist(config, function (config) { return __awaiter(void 0, void 0, void 0, function () {
        function applyToPlist(key) {
            if (typeof config.modResults[key] !== "object" ||
                Array.isArray(config.modResults[key]) ||
                !config.modResults[key]) {
                config.modResults[key] = {};
            }
            // @ts-expect-error
            config.modResults[key].CFBundleAlternateIcons = altIcons;
            // @ts-expect-error
            config.modResults[key].CFBundlePrimaryIcon = {
                CFBundleIconFiles: ["AppIcon"]
            };
        }
        var altIcons;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    altIcons = {};
                    return [4 /*yield*/, iterateIconsAsync({ icons: icons }, function (key, icon) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                altIcons[key] = {
                                    CFBundleIconFiles: [
                                        // Must be a file path relative to the source root (not a icon set it seems).
                                        // i.e. `Bacon-Icon-60x60` when the image is `ios/somn/appIcons/Bacon-Icon-60x60@2x.png`
                                        getIconName(key, size),
                                    ],
                                    UIPrerenderedIcon: !!icon.prerendered
                                };
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    // Apply for both tablet and phone support
                    applyToPlist("CFBundleIcons");
                    applyToPlist("CFBundleIcons~ipad");
                    return [2 /*return*/, config];
            }
        });
    }); });
};
var withIconImages = function (config, props) {
    return config_plugins_1.withDangerousMod(config, [
        "ios",
        function (config) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createIconsAsync(config, props)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, config];
                }
            });
        }); },
    ]);
};
function createIconsAsync(config, _a) {
    var icons = _a.icons;
    return __awaiter(this, void 0, void 0, function () {
        var iosRoot;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    iosRoot = path_1["default"].join(config.modRequest.platformProjectRoot, config.modRequest.projectName);
                    // Delete all existing assets
                    return [4 /*yield*/, fs_1["default"].promises.rmdir(path_1["default"].join(iosRoot, folderName), { recursive: true })];
                case 1:
                    // Delete all existing assets
                    _b.sent();
                    // Ensure directory exists
                    return [4 /*yield*/, fs_1["default"].promises.mkdir(path_1["default"].join(iosRoot, folderName), { recursive: true })];
                case 2:
                    // Ensure directory exists
                    _b.sent();
                    // Generate new assets
                    return [4 /*yield*/, iterateIconsAsync({ icons: icons }, function (key, icon) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, scales_2, scale, iconFileName, fileName, outputPath, scaledSize, source;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _i = 0, scales_2 = scales;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < scales_2.length)) return [3 /*break*/, 5];
                                        scale = scales_2[_i];
                                        iconFileName = getIconName(key, size, scale);
                                        fileName = path_1["default"].join(folderName, iconFileName);
                                        outputPath = path_1["default"].join(iosRoot, fileName);
                                        scaledSize = scale * size;
                                        return [4 /*yield*/, image_utils_1.generateImageAsync({
                                                projectRoot: config.modRequest.projectRoot,
                                                cacheType: "react-native-dynamic-app-icon"
                                            }, {
                                                name: iconFileName,
                                                src: icon.image,
                                                removeTransparency: true,
                                                backgroundColor: "#ffffff",
                                                resizeMode: "cover",
                                                width: scaledSize,
                                                height: scaledSize
                                            })];
                                    case 2:
                                        source = (_a.sent()).source;
                                        return [4 /*yield*/, fs_1["default"].promises.writeFile(outputPath, source)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    // Generate new assets
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function iterateIconsAsync(_a, callback) {
    var icons = _a.icons;
    return __awaiter(this, void 0, void 0, function () {
        var entries, i, _b, key, val;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    entries = Object.entries(icons);
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < entries.length)) return [3 /*break*/, 4];
                    _b = entries[i], key = _b[0], val = _b[1];
                    return [4 /*yield*/, callback(key, val, i)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = withDynamicIcon;
//# sourceMappingURL=index.js.map