import { generateImageAsync } from "@expo/image-utils";
import fs from "fs";
import { vol } from "memfs";
import path from "path";

import { generateImessageIconsAsync } from "../generateImessageIconsAsync";

const fsReal = jest.requireActual("fs") as typeof fs;

describe(generateImessageIconsAsync, () => {
  it(`should generate imessage icons`, async () => {
    vol.fromJSON({}, "/");
    await fs.promises.writeFile(
      "/icon.png",
      await fsReal.promises.readFile(path.join(__dirname, "fixtures/icon.png"))
    );
    const contents = await generateImessageIconsAsync(
      "/",
      "/icon.png",
      "/output"
    );

    expect(generateImageAsync).toHaveBeenCalledTimes(13);

    expect(contents).toEqual([
      {
        filename: "App-Icon-iphone-29x29@2x.png",
        idiom: "iphone",
        scale: "2x",
        size: "29x29",
      },
      {
        filename: "App-Icon-iphone-29x29@3x.png",
        idiom: "iphone",
        scale: "3x",
        size: "29x29",
      },
      {
        filename: "App-Icon-iphone-60x45@2x.png",
        idiom: "iphone",
        scale: "2x",
        size: "60x45",
      },
      {
        filename: "App-Icon-iphone-60x45@3x.png",
        idiom: "iphone",
        scale: "3x",
        size: "60x45",
      },
      {
        filename: "App-Icon-ipad-29x29@2x.png",
        idiom: "ipad",
        scale: "2x",
        size: "29x29",
      },
      {
        filename: "App-Icon-ipad-67x50@2x.png",
        idiom: "ipad",
        scale: "2x",
        size: "67x50",
      },
      {
        filename: "App-Icon-ipad-74x55@2x.png",
        idiom: "ipad",
        scale: "2x",
        size: "74x55",
      },
      {
        filename: "App-Icon-universal-27x20@2x.png",
        idiom: "universal",
        platform: "ios",
        scale: "2x",
        size: "27x20",
      },
      {
        filename: "App-Icon-universal-27x20@3x.png",
        idiom: "universal",
        platform: "ios",
        scale: "3x",
        size: "27x20",
      },
      {
        filename: "App-Icon-universal-32x24@2x.png",
        idiom: "universal",
        platform: "ios",
        scale: "2x",
        size: "32x24",
      },
      {
        filename: "App-Icon-universal-32x24@3x.png",
        idiom: "universal",
        platform: "ios",
        scale: "3x",
        size: "32x24",
      },
      {
        filename: "App-Icon-ios-marketing-1024x1024@1x.png",
        idiom: "ios-marketing",
        scale: "1x",
        size: "1024x1024",
      },
      {
        filename: "App-Icon-ios-marketing-1024x768@1x.png",
        idiom: "ios-marketing",
        platform: "ios",
        scale: "1x",
        size: "1024x768",
      },
    ]);
  });
});
