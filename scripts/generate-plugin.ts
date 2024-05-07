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

// Style like DT: @foo/bar -> foo__bar
function convertOrgName(name: string) {
  const match = name.match(/^@(\w+)\/(\w+)/gi);
  if (match?.length === 3) {
    return [match[1], match[2]].join("__");
  }
  return name;
}

(async () => {
  const { name } = await prompts({
    initial: process.argv[2],
    type: "text",
    name: "name",
    message: "Package to extend, ex: react-native-reanimated",
    validate: (value) =>
      /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value),
  });

  assert(name, "name must be defined");
  const pluginName = convertOrgName(name);

  const packageName = `@config-plugins/${pluginName}`;

  console.log(`Using name: ${packageName}`);

  const outputDir = path.join(packagesDir, pluginName);

  //   assert(!fs.existsSync(outputDir), `package already exists at: ${outputDir}`);

  if (fs.existsSync(outputDir)) {
    if (
      (
        await prompts({
          type: "confirm",
          message: "overwrite existing module?",
          initial: true,
          name: "value",
        })
      ).value
    ) {
      // Nuke
      fs.rmSync(outputDir, { recursive: true });
    } else {
      return;
    }
  }

  const moduleName = camelize(["with", name].join("-"));

  const settings: Props = {
    MODULE_NAME: moduleName,
    CONFIG_PLUGIN: pluginName,

    SDK_VERSION: "51",
    NPM_MODULE: name,
  };
  console.log(`Module name: ${moduleName}`);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "package.json"),
    JSON.stringify(getPackageJson(settings), null, 2)
  );

  fs.copyFileSync(
    path.join(templateDir, "tsconfig.json"),
    path.join(outputDir, "tsconfig.json")
  );

  const srcFolder = path.join(outputDir, "src");
  fs.mkdirSync(srcFolder, { recursive: true });

  fs.writeFileSync(
    path.join(srcFolder, `${moduleName}.ts`),
    createTemplatePlugin(settings)
  );

  fs.writeFileSync(
    path.join(outputDir, `README.md`),
    createTemplateREADME(settings)
  );
  fs.writeFileSync(
    path.join(outputDir, "app.plugin.js"),
    `module.exports = require("./build/${moduleName}");`
  );

  const manager = new PackageManager.YarnPackageManager({
    cwd: outputDir,
    silent: false,
  });
  await manager.installAsync();
})();

function camelize(str: string) {
  const arr = str.split("-");
  const capital = arr.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  );
  return capital.join("");
}

type Props = {
  NPM_MODULE: string;
  SDK_VERSION: string;
  MODULE_NAME: string;
  CONFIG_PLUGIN: string;
};

function createTemplatePlugin({
  MODULE_NAME,
  SDK_VERSION,
  CONFIG_PLUGIN,
  NPM_MODULE,
}: Props) {
  let template = fs.readFileSync(path.join(templateDir, "index.ts"), "utf8");

  template = replaceAll(template, /%NPM_MODULE%/g, NPM_MODULE);
  template = replaceAll(template, /%CONFIG_PLUGIN%/g, CONFIG_PLUGIN);
  template = replaceAll(template, /_MODULE_NAME_/g, MODULE_NAME);
  template = replaceAll(template, /%SDK_VERSION%/g, SDK_VERSION);

  return template;
}

function createTemplateREADME({
  MODULE_NAME,
  SDK_VERSION,
  CONFIG_PLUGIN,
  NPM_MODULE,
}: Props) {
  let template = fs.readFileSync(path.join(templateDir, "README.md"), "utf8");

  template = replaceAll(template, /%NPM_MODULE%/g, NPM_MODULE);
  template = replaceAll(template, /%CONFIG_PLUGIN%/g, CONFIG_PLUGIN);
  template = replaceAll(template, /%MODULE_NAME%/g, MODULE_NAME);
  template = replaceAll(template, /%SDK_VERSION%/g, SDK_VERSION);

  return template;
}

function getPackageJson({
  MODULE_NAME,
  SDK_VERSION,
  CONFIG_PLUGIN,
  NPM_MODULE,
}: Props) {
  const templatePackageJson = JSON.parse(
    fs.readFileSync(path.join(templateDir, "package.json"), "utf8")
  );

  templatePackageJson.name = `@config-plugins/${CONFIG_PLUGIN}`;
  templatePackageJson.repository.directory = `packages/${CONFIG_PLUGIN}`;
  templatePackageJson.description = `Config plugin for ${NPM_MODULE} package`;
  templatePackageJson.main = `build/${MODULE_NAME}.js`;
  templatePackageJson.types = `build/${MODULE_NAME}.d.ts`;
  templatePackageJson.keywords.push(NPM_MODULE, `expo-${SDK_VERSION}`);
  return templatePackageJson;
}
