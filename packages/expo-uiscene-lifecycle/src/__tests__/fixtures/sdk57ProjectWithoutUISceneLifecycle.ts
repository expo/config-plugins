import path from "path";

const fs = jest.requireActual("fs") as typeof import("fs");
const projectRoot = path.join(
  __dirname,
  "sdk57-project-without-uiscene-lifecycle",
);

export default function getSdk57ProjectWithoutUISceneLifecycle(): Record<
  string,
  string
> {
  const files: Record<string, string> = {};

  function readEntry(relativePath: string) {
    const absolutePath = path.join(projectRoot, relativePath);
    if (fs.statSync(absolutePath).isDirectory()) {
      for (const child of fs.readdirSync(absolutePath)) {
        readEntry(path.join(relativePath, child));
      }
      return;
    }
    files[relativePath] = fs.readFileSync(absolutePath, "utf8");
  }

  readEntry("ios");

  return files;
}
