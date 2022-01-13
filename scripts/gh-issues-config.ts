#!/usr/bin/env ts-node

import assert from "assert";
import * as fs from "fs";
import * as path from "path";
import prompts from "prompts";
// @ts-ignore
import replaceAll from "string.prototype.replaceall";
import * as PackageManager from "@expo/package-manager";
const packagesDir = path.join(__dirname, "../packages");
const templateDir = path.join(__dirname, "./template");
import { sync as globSync } from "glob";

import spawnAsync from "@expo/spawn-async";
import JsonFile, { JSONValue, JSONObject } from "@expo/json-file";

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
  const packageJsonFiles = globSync("packages/**/package.json", {
    absolute: true,
    cwd: root,
  });

  return await Promise.all(
    packageJsonFiles.map((value) => JsonFile.readAsync(value))
  );
}

(async () => {
  const root = path.join(__dirname, "../");
  const packageJsons = await getAllPackageJsonFiles(root);

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
    // console.log(pkg.name + " -- " + redirect);
  }

  // Add the issues for the actual repo
  //   config.contact_links.push({
  //     about: `Issues with a particular config plugin`,
  //     name: `Other...`,
  //     url: redirect,
  //   });

  const issuesConfigFilePath = path.join(
    root,
    ".github/ISSUE_TEMPLATE/config.yml"
  );

  const results = yaml.dump(config);

  console.log("Results:\n", results);
  console.log("");
  console.log("Writing to:", issuesConfigFilePath);
  fs.writeFileSync(issuesConfigFilePath, "---\n" + results);
})();

import * as yaml from "js-yaml";
