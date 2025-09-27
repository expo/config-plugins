import {
  withDangerousMod,
  ConfigPlugin,
  createRunOncePlugin,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import fs from "fs";
import path from "path";

const withReactNativePermissions: ConfigPlugin<{ pods: string[] }> = (
  config,
  { pods }
) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );

      const contents = fs.readFileSync(filePath, "utf-8");

      const result = mergeContents({
        tag: "react-native-permissions",
        src: contents,
        newSrc: getPodfileContent(pods),
        anchor: /use_native_modules/,
        offset: 0,
        comment: "#",
      });

      fs.writeFileSync(filePath, result.contents);

      return config;
    },
  ]);
};

function getPodfileContent(pods: string[]) {
  return `
  permissions_path = '../node_modules/react-native-permissions/ios'
  ${pods
    .map(
      (pod) => `pod 'Permission-${pod}', :path => "#{permissions_path}/${pod}"`
    )
    .join("\n  ")}
`;
}

export default createRunOncePlugin(
  withReactNativePermissions,
  "react-native-permissions"
);
