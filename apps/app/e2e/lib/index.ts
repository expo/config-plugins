import { device } from "detox";
import * as fs from "fs";
import * as path from "path";
import { setStatusBar } from "./setStatusBar";

export function getOutputDir(projectRoot: string, locale: string) {
  const store = device.getPlatform() === "ios" ? "apple" : "google";
  return path.resolve(projectRoot, `merch/${store}/preview/${locale}/`);
}

function resolveName(str: string) {
  if (str && device.getPlatform() === "ios" && typeof str === "string") {
    // Convert a name like: `E9EA2214-6B88-4223-9872-8232168088FB {"type":"iPhone 12 Pro Max"}`
    // to `iPhone 12 Pro Max`
    // Name is important for screenshot sorting
    const match = str.match(/"type"\s?:\s?"(.*)"}/i)?.[1];
    return match || str;
  }
  return str;
}

export async function takeScreenshotAsync({
  info,
  projectRoot,
  index,
  locale,
}: {
  projectRoot: string;
  locale: string;
  info?: string;
  index?: number;
}) {
  const outputDir = getOutputDir(projectRoot, locale);
  fs.mkdirSync(outputDir, { recursive: true });

  if (index == null) {
    index = fs.readdirSync(outputDir).length;
  }
  const deviceName = resolveName(device.name);

  const name = `APP_${deviceName}-${index}`;
  const imgPath = path.resolve(outputDir, `${name}.png`);
  const imagePath = await device.takeScreenshot(name);
  await fs.promises.copyFile(imagePath, imgPath);
}

export function createCapture({
  projectRoot,
  locale,
}: {
  locale: string;
  projectRoot: string;
}) {
  const captureAsync = () =>
    takeScreenshotAsync({
      projectRoot,
      locale,
    });

  const clearAsync = async () => {
    // Clear old screen shots
    const outputDir = getOutputDir(projectRoot, locale);
    await fs.promises.rmdir(outputDir, { recursive: true }).catch(() => null);
  };

  return {
    captureAsync,
    clearAsync,
    async resetAppAsync() {
      // Clear old screen shots
      // await clearAsync();
      // configure status bars

      setStatusBar();

      // reset expo-localization which doesn't account for simulators dynamically updating without resetting the phone.
      await device.terminateApp();

      // launch with lang
      await device.launchApp({
        languageAndLocale: { locale, language: locale },
        launchArgs: { locale },
      });
    },
  };
}
