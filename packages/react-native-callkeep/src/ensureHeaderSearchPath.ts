import { XcodeProject } from "expo/config-plugins";

const COMMENT_KEY = /_comment$/;

function unquote(str: string) {
  if (str) return str.replace(/^"(.*)"$/, "$1");
  return str;
}
function nonComments(obj: Record<string, any>) {
  const newObj: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    if (!COMMENT_KEY.test(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

export function ensureHeaderSearchPath(project: XcodeProject, file: string) {
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
