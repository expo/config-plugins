"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureHeaderSearchPath = void 0;
const COMMENT_KEY = /_comment$/;
function unquote(str) {
    if (str)
        return str.replace(/^"(.*)"$/, "$1");
}
function nonComments(obj) {
    const keys = Object.keys(obj);
    const newObj = {};
    for (let i = 0; i < keys.length; i++) {
        if (!COMMENT_KEY.test(keys[i])) {
            newObj[keys[i]] = obj[keys[i]];
        }
    }
    return newObj;
}
function ensureHeaderSearchPath(project, file) {
    const configurations = nonComments(project.pbxXCBuildConfigurationSection());
    const INHERITED = '"$(inherited)"';
    for (const config in configurations) {
        const buildSettings = configurations[config].buildSettings;
        if (unquote(buildSettings["PRODUCT_NAME"]) !== project.productName)
            continue;
        if (!buildSettings["HEADER_SEARCH_PATHS"]) {
            buildSettings["HEADER_SEARCH_PATHS"] = [INHERITED];
        }
        if (!buildSettings.HEADER_SEARCH_PATHS.includes(file)) {
            buildSettings["HEADER_SEARCH_PATHS"].push(file);
        }
    }
}
exports.ensureHeaderSearchPath = ensureHeaderSearchPath;
