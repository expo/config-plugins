import path from "path";
import fs from "fs";

export function getFixture(
  name: "AppDelegate.mm" | "app-build.gradle" | "build.gradle" | "Podfile"
): string {
  const filepath = path.join(__dirname, name);
  return fs.readFileSync(filepath, "utf8");
}
