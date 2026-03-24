import path from "path";
import fs from "fs";

export function getFixture(
  name:
    | "AppDelegate.mm"
    | "AppDelegate.swift"
    | "MainApplication.kt"
    | "app-build.gradle"
    | "build.gradle"
    | "Podfile"
    | "app-Bridging-Header.h"
): string {
  const filepath = path.join(__dirname, name);
  return fs.readFileSync(filepath, "utf8");
}
