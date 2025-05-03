import path from "path";
import fs from "fs";

type FixtureFileName =
  | "AppDelegate.mm"
  | "app-build.gradle"
  | "build.gradle"
  | "Podfile"
  | "MainActivity.java"
  | "MainApplication.java"
  | "MainActivity.kt"
  | "MainApplication.kt";

export function getFixture(
  name: FixtureFileName,
): string {
  const filepath = path.join(__dirname, name);
  return fs.readFileSync(filepath, "utf8");
}
