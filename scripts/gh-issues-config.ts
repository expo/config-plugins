#!/usr/bin/env ts-node
import JsonFile, { JSONObject, JSONValue } from "@expo/json-file";
import spawnAsync from "@expo/spawn-async";
import * as fs from "fs/promises";
import { sync as globSync } from "glob";
import * as yaml from "js-yaml";
import * as path from "path";

async function npmViewAsync(...props: string[]): Promise<JSONValue> {
  const cmd = ["view", ...props, "--json"];
  const results = (await spawnAsync("npm", cmd)).stdout?.trim();
  const cmdString = `npm ${cmd.join(" ")}`;
  console.debug("Run:", cmdString);
  if (!results) {
    return null;
  }
  try {
    return JSON.parse(results);
  } catch (error: any) {
    throw new Error(
      `Could not parse JSON returned from "${cmdString}".\n\n${results}\n\nError: ${error.message}`
    );
  }
}

async function getAllPackageJsonFiles(root: string): Promise<JSONObject[]> {
  // "upstreamPackage": "react-native-webrtc"
  const packageJsonFiles = globSync("packages/*/package.json", {
    absolute: true,
    cwd: root,
  });

  return await Promise.all(
    packageJsonFiles.map((value) => JsonFile.readAsync(value))
  );
}

async function updateBugReportTemplateAsync(
  root: string,
  configPluginNames: string[]
) {
  const bugReportFilePath = path.resolve(
    root,
    ".github/ISSUE_TEMPLATE/bug_report.yml"
  );

  const data = await fs.readFile(bugReportFilePath, "utf-8");

  const input = yaml.load(data) as {
    body: {
      type: string;
      attributes: { label?: string; options?: string[] };
    }[];
  };

  input.body.forEach((element) => {
    if (element.attributes.label === "Config Plugin") {
      element.attributes.options = configPluginNames;
    }
    console.log(element.attributes);
  });

  await fs.writeFile(bugReportFilePath, yaml.dump(input));
}

(async () => {
  const root = path.join(__dirname, "../");
  const packageJsons = await getAllPackageJsonFiles(root);

  await updateBugReportTemplateAsync(
    root,
    packageJsons.map((value) => value.name) as string[]
  );

  // Only get the packages that reference an upstream package.
  const pkgWithUpstream = packageJsons.filter((pkg) => pkg.upstreamPackage);

  const upstreamInfos = await Promise.all(
    pkgWithUpstream
      .map(async (pkg) => {
        if (typeof pkg.upstreamPackage === "string") {
          try {
            return await npmViewAsync(pkg.upstreamPackage);
          } catch (error) {
            console.error(
              "Failed to get info for package: " + pkg.upstreamPackage
            );
            console.error(error);
          }
        }
        return null;
      })
      .filter(Boolean) as Promise<JSONObject & { name: string }>[]
  );

  const config: {
    blank_issues_enabled: false;
    contact_links: { about: string; name: string; url: string }[];
  } = {
    blank_issues_enabled: false,
    contact_links: [],
  };

  for (const pkg of upstreamInfos.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  })) {
    // @ts-ignore
    const redirect = pkg.bugs?.url ?? pkg.homepage;

    if (!redirect) {
      console.warn("No redirect URL found for package:", pkg.name);
    }

    config.contact_links.push({
      about: `Issues with ${pkg.name} -- ${pkg.description}`,
      name: `📦 ${pkg.name}`,
      url: redirect,
    });
  }

  const issuesConfigFilePath = path.join(
    root,
    ".github/ISSUE_TEMPLATE/config.yml"
  );

  const results = yaml.dump(config);

  console.log("Results:\n", results);
  console.log("");
  console.log("Writing to:", issuesConfigFilePath);
  await fs.writeFile(issuesConfigFilePath, "---\n" + results);
})();
