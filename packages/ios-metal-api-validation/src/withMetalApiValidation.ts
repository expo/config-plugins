import { ConfigPlugin, IOSConfig, withDangerousMod } from "expo/config-plugins";
import { promises as fs } from "fs";

export type Props = {
  /**
   * Whether Metal API validation should be enabled in the generated Xcode
   * scheme. Defaults to `false` (validation disabled), which is the reason
   * to add this plugin, e.g. to run `react-native-webgpu` on the iOS
   * Simulator.
   */
  apiValidation?: boolean;
};

/**
 * Set the Metal API validation mode on the `LaunchAction` of an Xcode scheme.
 *
 * Xcode omits the `enableGPUValidationMode` attribute when validation is
 * enabled (the default) and writes `enableGPUValidationMode = "1"` when it is
 * disabled (Product > Scheme > Edit Scheme > Run > Diagnostics > Metal
 * Validation).
 */
export function setMetalApiValidation(
  xcscheme: string,
  enabled: boolean
): string {
  const stripped = xcscheme.replace(
    /\s*enableGPUValidationMode\s*=\s*"[^"]*"/g,
    ""
  );
  if (enabled) {
    return stripped;
  }
  return stripped.replace(
    /<LaunchAction\b/,
    '<LaunchAction\n      enableGPUValidationMode = "1"'
  );
}

const withMetalApiValidation: ConfigPlugin<Props | void> = (config, props) => {
  const apiValidation = props?.apiValidation ?? false;
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const schemePaths = IOSConfig.Paths.findSchemePaths(
        config.modRequest.projectRoot
      );
      await Promise.all(
        schemePaths.map(async (schemePath) => {
          const contents = await fs.readFile(schemePath, "utf8");
          await fs.writeFile(
            schemePath,
            setMetalApiValidation(contents, apiValidation)
          );
        })
      );
      return config;
    },
  ]);
};

export default withMetalApiValidation;
