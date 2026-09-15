import plist from '@expo/plist';
import type { ExpoConfig } from 'expo/config';
import { compileModsAsync, IOSConfig, withInfoPlist } from 'expo/config-plugins';
import fs from 'fs';
import { vol } from 'memfs';
import path from 'path';

import withExpoUIScene, { type ExpoUIScenePluginOptions } from '..';
import getSdk57Project from './fixtures/sdk57Project';

jest.mock('fs');

const projectRoot = '/app';
const appDelegatePath = '/app/ios/HelloWorld/AppDelegate.swift';
const infoPlistPath = '/app/ios/HelloWorld/Info.plist';
const projectPath = '/app/ios/HelloWorld.xcodeproj/project.pbxproj';
const generatedDirectory = '/app/ios/HelloWorld/ExpoUIScene';

type ProjectMutation = (files: Record<string, string | Buffer>) => void;

function loadProject(mutate?: ProjectMutation) {
  const files = getSdk57Project();
  mutate?.(files);
  vol.fromJSON(files, projectRoot);
}

async function runPlugin(
  options?: ExpoUIScenePluginOptions,
  {
    sdkVersion = '57.0.0',
    infoPlist,
  }: { sdkVersion?: string; infoPlist?: Record<string, unknown> } = {}
) {
  let config: ExpoConfig = {
    name: 'HelloWorld',
    slug: 'hello-world',
    sdkVersion,
    ios: { bundleIdentifier: 'dev.expo.HelloWorld', infoPlist },
    _internal: { projectRoot },
  };

  config = withExpoUIScene(config, options);
  return compileModsAsync(config, {
    projectRoot,
    platforms: ['ios'],
    assertMissingModProviders: false,
  });
}

async function runDisabledPluginWithLaterInfoPlist() {
  let config: ExpoConfig = {
    name: 'HelloWorld',
    slug: 'hello-world',
    sdkVersion: '57.0.0',
    ios: { bundleIdentifier: 'dev.expo.HelloWorld' },
    _internal: { projectRoot },
  };

  config = withExpoUIScene(config, { enabled: false });
  config = withInfoPlist(config, (config) => {
    const applicationScenes =
      config.modResults.UIApplicationSceneManifest.UISceneConfigurations
        .UIWindowSceneSessionRoleApplication;
    applicationScenes.push({
      UISceneConfigurationName: 'Later Plugin Scene',
    });
    return config;
  });

  return compileModsAsync(config, {
    projectRoot,
    platforms: ['ios'],
    assertMissingModProviders: false,
  });
}

async function runEnabledPluginWithLaterInfoPlist() {
  let config: ExpoConfig = {
    name: 'HelloWorld',
    slug: 'hello-world',
    sdkVersion: '57.0.0',
    ios: { bundleIdentifier: 'dev.expo.HelloWorld' },
    _internal: { projectRoot },
  };

  config = withExpoUIScene(config);
  config = withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: true,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Later Plugin Scene',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).UserSceneDelegate',
          },
        ],
      },
    };
    return config;
  });

  return compileModsAsync(config, {
    projectRoot,
    platforms: ['ios'],
    assertMissingModProviders: false,
  });
}

async function runEnabledPluginWithEarlierInfoPlist() {
  let config: ExpoConfig = {
    name: 'HelloWorld',
    slug: 'hello-world',
    sdkVersion: '57.0.0',
    ios: { bundleIdentifier: 'dev.expo.HelloWorld' },
    _internal: { projectRoot },
  };

  config = withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0].UISceneDelegateClassName =
      '$(PRODUCT_MODULE_NAME).UserSceneDelegate';
    return config;
  });
  config = withExpoUIScene(config);

  return compileModsAsync(config, {
    projectRoot,
    platforms: ['ios'],
    assertMissingModProviders: false,
  });
}

function addDebugInfoPlistWithGeneratedDelegate() {
  const debugInfoPlistPath = '/app/ios/HelloWorld/Info-Debug.plist';
  fs.writeFileSync(debugInfoPlistPath, fs.readFileSync(infoPlistPath));

  setDebugInfoPlistBuildSetting('HelloWorld/Info-Debug.plist');
  return debugInfoPlistPath;
}

function setDebugInfoPlistBuildSetting(value: string | undefined) {
  const project = IOSConfig.XcodeUtils.getPbxproj(projectRoot);
  const objects = project.hash.project.objects;
  const { target } = readApplicationProject();
  const configurationList = objects.XCConfigurationList[target.buildConfigurationList];
  const debugConfigurationId = configurationList.buildConfigurations.find(
    ({ comment }: { comment?: string }) => comment === 'Debug'
  )?.value;
  expect(debugConfigurationId).toBeDefined();
  if (value === undefined) {
    delete objects.XCBuildConfiguration[debugConfigurationId].buildSettings.INFOPLIST_FILE;
  } else {
    objects.XCBuildConfiguration[debugConfigurationId].buildSettings.INFOPLIST_FILE = value;
  }
  fs.writeFileSync(projectPath, project.writeSync());
}

function addMisleadingExtensionInfoPlist() {
  const extensionInfoPlistPath = '/app/ios/X/Info.plist';
  fs.mkdirSync(path.dirname(extensionInfoPlistPath), { recursive: true });
  fs.writeFileSync(
    extensionInfoPlistPath,
    plist.build({ CFBundleIdentifier: 'dev.expo.HelloWorld.extension' })
  );

  const project = IOSConfig.XcodeUtils.getPbxproj(projectRoot);
  const extensionTarget = project.addTarget('HelloWorldExtension', 'app_extension', 'X');
  const objects = project.hash.project.objects;
  const configurationList =
    objects.XCConfigurationList[extensionTarget.pbxNativeTarget.buildConfigurationList];
  for (const { value: configurationId } of configurationList.buildConfigurations) {
    objects.XCBuildConfiguration[configurationId].buildSettings.INFOPLIST_FILE = 'X/Info.plist';
  }
  fs.writeFileSync(projectPath, project.writeSync());
}

function readGeneratedSwiftSources() {
  return fs
    .readdirSync(generatedDirectory)
    .filter((file) => file.endsWith('.swift'))
    .map((file) => ({
      file,
      contents: fs.readFileSync(path.join(generatedDirectory, file), 'utf8'),
    }));
}

function unquote(value: string) {
  return value.replace(/^"|"$/g, '');
}

function manifestReferencesDelegate(value: unknown, className: string): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => manifestReferencesDelegate(item, className));
  }
  if (value !== null && typeof value === 'object') {
    return Object.values(value).some((item) => manifestReferencesDelegate(item, className));
  }
  return typeof value === 'string' && value.endsWith(`.${className}`);
}

function readApplicationProject() {
  const project = IOSConfig.XcodeUtils.getPbxproj(projectRoot);
  const objects = project.hash.project.objects;
  const { firstProject } = project.getFirstProject();
  const targets = firstProject.targets
    .map(({ value }) => ({ id: value, target: objects.PBXNativeTarget[value] }))
    .filter(({ target }) => unquote(target.productType) === 'com.apple.product-type.application');
  expect(targets).toHaveLength(1);
  const { id: targetId, target } = targets[0];
  const filePaths = new Map<string, string>();

  function visitGroup(groupId: string, parentPath: string) {
    const group = objects.PBXGroup[groupId];
    const groupPath = path.resolve(parentPath, unquote(group.path ?? ''));
    for (const { value: childId } of group.children) {
      if (objects.PBXGroup[childId]) {
        visitGroup(childId, groupPath);
      } else if (objects.PBXFileReference[childId]) {
        const file = objects.PBXFileReference[childId];
        const basePath =
          unquote(file.sourceTree) === 'SOURCE_ROOT' ? path.join(projectRoot, 'ios') : groupPath;
        filePaths.set(childId, path.resolve(basePath, unquote(file.path)));
      }
    }
  }

  visitGroup(firstProject.mainGroup, path.join(projectRoot, 'ios'));
  const sources = target.buildPhases.flatMap(({ value: phaseId }) => {
    const phase = objects.PBXSourcesBuildPhase[phaseId];
    if (!phase) return [];
    return phase.files.map(({ value: buildFileId }) => {
      const buildFile = objects.PBXBuildFile[buildFileId];
      expect(buildFile).toBeDefined();
      const file = objects.PBXFileReference[buildFile.fileRef];
      expect(file).toBeDefined();
      return {
        buildFileId,
        buildFile,
        file,
        absolutePath: filePaths.get(buildFile.fileRef),
      };
    });
  });

  return { project, objects, targetId, target, sources };
}

function seedUserOwnedState() {
  const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
  infoPlist.UserFeatureSettings = { enabled: true, label: 'Keep me' };
  infoPlist.CFBundleURLTypes = [
    { CFBundleURLName: 'user-feature', CFBundleURLSchemes: ['user-feature'] },
  ];
  fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
  fs.writeFileSync('/app/ios/HelloWorld/UserFeature.swift', 'struct UserFeature {}\n');

  const { project, objects, targetId } = readApplicationProject();
  const groupId = project.findPBXGroupKey({ name: 'HelloWorld' });
  project.addSourceFile('HelloWorld/UserFeature.swift', { target: targetId }, groupId);
  for (const configuration of Object.values(objects.XCBuildConfiguration)) {
    if (typeof configuration === 'object') {
      configuration.buildSettings.USER_FEATURE_FLAG = 'PRESERVE_ME';
    }
  }
  fs.writeFileSync(projectPath, project.writeSync());
}

function snapshotOwnedState() {
  const generated = fs.existsSync(generatedDirectory)
    ? Object.fromEntries(readGeneratedSwiftSources().map(({ file, contents }) => [file, contents]))
    : null;

  return {
    appDelegate: fs.readFileSync(appDelegatePath, 'utf8'),
    infoPlist: fs.readFileSync(infoPlistPath, 'utf8'),
    project: fs.readFileSync(projectPath, 'utf8'),
    generated,
  };
}

describe(withExpoUIScene, () => {
  afterEach(() => vol.reset());

  it.each([
    ['omitted options', undefined],
    ['enabled explicitly', { enabled: true }],
  ] as const)('enables scene lifecycle with %s', async (_label, options) => {
    loadProject();
    const originalAppDelegate = fs.readFileSync(appDelegatePath, 'utf8');

    await runPlugin(options);

    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    expect(infoPlist.UIApplicationSceneManifest).toEqual({
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: expect.stringMatching(/^\$\(PRODUCT_MODULE_NAME\)\.\w+$/),
          },
        ],
      },
    });

    const sources = readGeneratedSwiftSources();
    expect(sources.length).toBeGreaterThan(0);
    const sceneDelegateClass =
      infoPlist.UIApplicationSceneManifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0].UISceneDelegateClassName.split(
        '.'
      ).pop();
    const generatedSource = sources.map(({ contents }) => contents).join('\n');
    expect(generatedSource).toContain(`class ${sceneDelegateClass}`);
    expect(generatedSource).toContain('internal import Expo');
    expect(generatedSource).not.toContain('\nimport Expo\n');
    expect(generatedSource).toContain(
      ') -> [AnyHashable: Any]? {\n    var launchOptions: [AnyHashable: Any] = [:]'
    );

    expect(generatedSource).toContain('var launchOptions = request.launchOptions ?? [:]');
    expect(generatedSource).toContain('for (key, value) in Self.launchOptions(from: options) ?? [:] {');
    expect(generatedSource).toContain('launchOptions[key] = value');
    expect(generatedSource).toContain('launchOptions: launchOptions.isEmpty ? nil : launchOptions');

    const { sources: applicationSources } = readApplicationProject();
    for (const { file } of sources) {
      expect(
        applicationSources.filter(
          ({ absolutePath }) => absolutePath === path.join(generatedDirectory, file)
        )
      ).toHaveLength(1);
    }

    const appDelegate = fs.readFileSync(appDelegatePath, 'utf8');
    expect(appDelegate).toContain('factory.startReactNative(');
    expect(appDelegate).toContain('ExpoReactNativeFactoryProvider');
    const factoryClass = appDelegate.match(/let factory = (\w+)\(delegate: delegate\)/)?.[1];
    expect(factoryClass).toBeDefined();
    expect(factoryClass).not.toBe('ExpoReactNativeFactory');
    expect(generatedSource).toContain(`class ${factoryClass}`);
    expect(generatedSource).toContain(`class ${factoryClass}: RCTReactNativeFactory`);
    expect(generatedSource).toContain('super.init(delegate: delegate, releaseLevel: releaseLevel)');
    expect(appDelegate).not.toContain(sceneDelegateClass);
    expect(generatedSource).toContain('if let shortcutItem = connectionOptions.shortcutItem');
    expect(generatedSource).toMatch(/performActionFor:\s*shortcutItem,[\s\S]*completionHandler:/);
    expect(generatedSource).not.toContain('deferredStart = nil');
    expect(
      appDelegate
        .replace(', ExpoReactNativeFactoryProvider', '')
        .replace(
          `${factoryClass}(delegate: delegate)`,
          'ExpoReactNativeFactory(delegate: delegate)'
        )
    ).toBe(originalAppDelegate);
  });

  it('composes the owned manifest with config.ios.infoPlist', async () => {
    loadProject();

    await runPlugin(undefined, {
      infoPlist: {
        UserConfiguredValue: 'preserved',
      },
    });

    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    expect(infoPlist.UserConfiguredValue).toBe('preserved');
    expect(infoPlist.UIApplicationSceneManifest).toBeDefined();
  });

  it('rejects a scene manifest supplied through config.ios.infoPlist', async () => {
    loadProject();

    await expect(
      runPlugin(undefined, {
        infoPlist: {
          UIApplicationSceneManifest: {
            UIApplicationSupportsMultipleScenes: true,
          },
        },
      })
    ).rejects.toThrow(/expo-uiscene.*UIApplicationSceneManifest/i);
  });

  it('atomically rejects a scene manifest supplied by a later Info.plist plugin', async () => {
    loadProject();
    const beforeEnable = snapshotOwnedState();

    await expect(runEnabledPluginWithLaterInfoPlist()).rejects.toThrow(
      /expo-uiscene.*UIApplicationSceneManifest/i
    );

    const afterEnable = snapshotOwnedState();
    expect(afterEnable.generated).toBeNull();
    expect(afterEnable.appDelegate).toBe(beforeEnable.appDelegate);
    expect(afterEnable.project).toBe(beforeEnable.project);
  });

  it('atomically rejects an in-place manifest mutation by an earlier Info.plist plugin', async () => {
    loadProject();
    const beforeEnable = snapshotOwnedState();

    await expect(runEnabledPluginWithEarlierInfoPlist()).rejects.toThrow(
      /expo-uiscene.*UIApplicationSceneManifest/i
    );

    const afterEnable = snapshotOwnedState();
    expect(afterEnable.generated).toBeNull();
    expect(afterEnable.appDelegate).toBe(beforeEnable.appDelegate);
    expect(afterEnable.project).toBe(beforeEnable.project);
  });

  it('rejects an unmarked collision at the generated source path', async () => {
    loadProject();
    fs.mkdirSync(generatedDirectory, { recursive: true });
    fs.writeFileSync(path.join(generatedDirectory, 'ExpoUIScene.swift'), '// User-owned source\n');

    await expect(runPlugin()).rejects.toThrow(/expo-uiscene.*generated source.*already exists/i);
    expect(fs.readFileSync(path.join(generatedDirectory, 'ExpoUIScene.swift'), 'utf8')).toBe(
      '// User-owned source\n'
    );
  });

  it('removes only plugin-owned integration when disabled', async () => {
    loadProject();
    seedUserOwnedState();
    const originalAppDelegate = fs.readFileSync(appDelegatePath, 'utf8');
    const originalInfoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    const originalProject = readApplicationProject();
    expect(originalProject.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          absolutePath: '/app/ios/HelloWorld/UserFeature.swift',
        }),
      ])
    );

    await runPlugin({ enabled: true });
    expect(fs.existsSync(generatedDirectory)).toBe(true);
    expect(readGeneratedSwiftSources().length).toBeGreaterThan(0);
    await runPlugin({ enabled: false });

    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    expect(infoPlist.UIApplicationSceneManifest).toBeUndefined();
    expect(infoPlist).toEqual(originalInfoPlist);
    expect(fs.existsSync(generatedDirectory)).toBe(false);
    expect(fs.readFileSync(projectPath, 'utf8')).not.toContain('ExpoUIScene');
    const restoredProject = readApplicationProject();
    expect(restoredProject.sources).toEqual(originalProject.sources);
    expect(restoredProject.objects.XCBuildConfiguration).toEqual(
      originalProject.objects.XCBuildConfiguration
    );
    expect(fs.readFileSync('/app/ios/HelloWorld/UserFeature.swift', 'utf8')).toBe(
      'struct UserFeature {}\n'
    );

    const appDelegate = fs.readFileSync(appDelegatePath, 'utf8');
    expect(appDelegate).toBe(originalAppDelegate);
    expect(appDelegate).toContain('factory.startReactNative(');
    expect(appDelegate).not.toContain('ExpoReactNativeFactoryProvider');
    expect(appDelegate).not.toContain('ExpoUISceneReactNativeFactory');
  });

  it('removes plugin-owned integration when manifest key order changes', async () => {
    loadProject();
    await runPlugin({ enabled: true });

    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    const manifest = infoPlist.UIApplicationSceneManifest;
    infoPlist.UIApplicationSceneManifest = {
      UISceneConfigurations: manifest.UISceneConfigurations,
      UIApplicationSupportsMultipleScenes: manifest.UIApplicationSupportsMultipleScenes,
    };
    fs.writeFileSync(infoPlistPath, plist.build(infoPlist));

    await runPlugin({ enabled: false });

    expect(fs.existsSync(generatedDirectory)).toBe(false);
    expect(
      plist.parse(fs.readFileSync(infoPlistPath, 'utf8')).UIApplicationSceneManifest
    ).toBeUndefined();
  });

  it('preserves all owned integration when disable finds a modified owned manifest', async () => {
    loadProject();
    await runPlugin({ enabled: true });

    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    infoPlist.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes = true;
    fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
    const beforeDisable = snapshotOwnedState();

    await expect(runPlugin({ enabled: false })).rejects.toThrow(
      /expo-uiscene.*modified.*UIApplicationSceneManifest/i
    );
    expect(snapshotOwnedState()).toEqual(beforeDisable);
  });

  it('preserves all owned integration when the generated AppDelegate anchors were edited', async () => {
    loadProject();
    await runPlugin({ enabled: true });

    const generatedAppDelegate = fs.readFileSync(appDelegatePath, 'utf8');
    const appDelegate = `// class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {\n${generatedAppDelegate.replace(
      'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider',
      'class AppDelegate: ExpoAppDelegate, SomeUserProtocol, ExpoReactNativeFactoryProvider'
    )}`;
    fs.writeFileSync(appDelegatePath, appDelegate);
    const beforeDisable = snapshotOwnedState();

    await expect(runPlugin({ enabled: false })).rejects.toThrow(
      /expo-uiscene.*AppDelegate.*generated.*anchors/i
    );
    expect(snapshotOwnedState()).toEqual(beforeDisable);
  });

  it('does not remove generated support before a later Info.plist modifier finishes', async () => {
    loadProject();
    await runPlugin({ enabled: true });

    await expect(runDisabledPluginWithLaterInfoPlist()).rejects.toThrow(
      /expo-uiscene.*modified.*UIApplicationSceneManifest/i
    );

    const manifest = plist.parse(fs.readFileSync(infoPlistPath, 'utf8')).UIApplicationSceneManifest;
    expect(manifestReferencesDelegate(manifest, 'ExpoUISceneSceneDelegate')).toBe(true);
    expect(manifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          UISceneConfigurationName: 'Later Plugin Scene',
        }),
      ])
    );
    expect(fs.existsSync(generatedDirectory)).toBe(true);
    expect(fs.readFileSync(appDelegatePath, 'utf8')).toContain('ExpoUISceneReactNativeFactory');
    expect(fs.readFileSync(projectPath, 'utf8')).toContain('ExpoUIScene.swift');
  });

  it('validates the application target Info.plist when an extension plist is the shorter glob match', async () => {
    loadProject();
    await runPlugin({ enabled: true });
    addMisleadingExtensionInfoPlist();
    const beforeDisable = snapshotOwnedState();

    await expect(runDisabledPluginWithLaterInfoPlist()).rejects.toThrow(
      /expo-uiscene.*modified.*UIApplicationSceneManifest/i
    );

    const afterDisable = snapshotOwnedState();
    expect(afterDisable.appDelegate).toBe(beforeDisable.appDelegate);
    expect(afterDisable.project).toBe(beforeDisable.project);
    expect(afterDisable.generated).toEqual(beforeDisable.generated);
    expect(
      manifestReferencesDelegate(
        plist.parse(afterDisable.infoPlist).UIApplicationSceneManifest,
        'ExpoUISceneSceneDelegate'
      )
    ).toBe(true);
    expect(
      plist.parse(fs.readFileSync('/app/ios/X/Info.plist', 'utf8')).UIApplicationSceneManifest
    ).toBeUndefined();
  });

  it('atomically rejects disable when Debug uses a distinct plist that retains the generated delegate', async () => {
    loadProject();
    await runPlugin({ enabled: true });
    const debugInfoPlistPath = addDebugInfoPlistWithGeneratedDelegate();
    const beforeDisable = snapshotOwnedState();

    await expect(runPlugin({ enabled: false })).rejects.toThrow(
      /expo-uiscene.*Info-Debug\.plist.*scene delegate/i
    );

    const afterDisable = snapshotOwnedState();
    expect(afterDisable.appDelegate).toBe(beforeDisable.appDelegate);
    expect(afterDisable.project).toBe(beforeDisable.project);
    expect(afterDisable.generated).toEqual(beforeDisable.generated);
    expect(
      manifestReferencesDelegate(
        plist.parse(fs.readFileSync(debugInfoPlistPath, 'utf8')).UIApplicationSceneManifest,
        'ExpoUISceneSceneDelegate'
      )
    ).toBe(true);
  });

  it.each([
    ['has no INFOPLIST_FILE', undefined, /INFOPLIST_FILE.*Debug/i],
    [
      'references a missing plist',
      'HelloWorld/Missing-Debug.plist',
      /Debug.*Missing-Debug\.plist/i,
    ],
  ])('atomically rejects disable when Debug %s', async (_label, buildSetting, expectedError) => {
    loadProject();
    await runPlugin({ enabled: true });
    setDebugInfoPlistBuildSetting(buildSetting);
    const beforeDisable = snapshotOwnedState();

    await expect(runPlugin({ enabled: false })).rejects.toThrow(expectedError);

    const afterDisable = snapshotOwnedState();
    expect(afterDisable.appDelegate).toBe(beforeDisable.appDelegate);
    expect(afterDisable.project).toBe(beforeDisable.project);
    expect(afterDisable.generated).toEqual(beforeDisable.generated);
  });

  it.each([
    '${PRODUCT_MODULE_NAME}.ExpoUISceneSceneDelegate',
    '$(PRODUCT_MODULE_NAME).ExpoUISceneSceneDelegate',
    'HelloWorld.ExpoUISceneSceneDelegate',
  ])('atomically rejects disable when the final manifest uses %s', async (delegateReference) => {
    loadProject();
    await runPlugin({ enabled: true });

    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    infoPlist.UIApplicationSceneManifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0].UISceneDelegateClassName =
      delegateReference;
    infoPlist.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes = true;
    fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
    const beforeDisable = snapshotOwnedState();

    await expect(runPlugin({ enabled: false })).rejects.toThrow(
      /expo-uiscene.*modified.*UIApplicationSceneManifest/i
    );
    expect(snapshotOwnedState()).toEqual(beforeDisable);
  });

  it.each([
    ['enabled', { enabled: true }],
    ['disabled', { enabled: false }],
  ] as const)('is idempotent when %s', async (_label, options) => {
    loadProject();

    await runPlugin(options);
    const once = snapshotOwnedState();
    await runPlugin(options);

    expect(snapshotOwnedState()).toEqual(once);
  });

  it.each(['56.0.0', '58.0.0'])('rejects SDK %s with an actionable error', async (sdkVersion) => {
    loadProject();

    await expect(runPlugin(undefined, { sdkVersion })).rejects.toThrow(/expo-uiscene.*SDK 57/i);
  });

  it('preserves a user scene manifest and project state when disabled', async () => {
    loadProject((files) => {
      const infoPlist = plist.parse(files['ios/HelloWorld/Info.plist'].toString());
      infoPlist.UIApplicationSceneManifest = {
        UIApplicationSupportsMultipleScenes: true,
        UISceneConfigurations: {
          UIWindowSceneSessionRoleApplication: [
            {
              UISceneConfigurationName: 'User Scene',
              UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).UserSceneDelegate',
            },
          ],
        },
      };
      files['ios/HelloWorld/Info.plist'] = plist.build(infoPlist);
    });
    seedUserOwnedState();
    const original = snapshotOwnedState();

    await runPlugin({ enabled: false });

    expect(snapshotOwnedState()).toEqual(original);
  });

  it('rejects a non-Swift AppDelegate with an actionable error', async () => {
    loadProject((files) => {
      files['ios/HelloWorld/AppDelegate.mm'] = files['ios/HelloWorld/AppDelegate.swift'];
      delete files['ios/HelloWorld/AppDelegate.swift'];
      files['ios/HelloWorld.xcodeproj/project.pbxproj'] = files[
        'ios/HelloWorld.xcodeproj/project.pbxproj'
      ]
        .toString()
        .replaceAll('AppDelegate.swift', 'AppDelegate.mm')
        .replaceAll('sourcecode.swift', 'sourcecode.cpp.objcpp');
    });

    await expect(runPlugin()).rejects.toThrow(/expo-uiscene.*Swift AppDelegate/i);
  });

  it('rejects projects that already declare a scene manifest', async () => {
    loadProject((files) => {
      const infoPlist = plist.parse(files['ios/HelloWorld/Info.plist'].toString());
      infoPlist.UIApplicationSceneManifest = {
        UIApplicationSupportsMultipleScenes: true,
      };
      files['ios/HelloWorld/Info.plist'] = plist.build(infoPlist);
    });

    await expect(runPlugin()).rejects.toThrow(/expo-uiscene.*UIApplicationSceneManifest/i);
  });

  it('rejects an unrecognized Swift AppDelegate shape', async () => {
    loadProject((files) => {
      files['ios/HelloWorld/AppDelegate.swift'] = files['ios/HelloWorld/AppDelegate.swift']
        .toString()
        .replace('class AppDelegate: ExpoAppDelegate', 'class AppDelegate: UIApplicationDelegate');
    });

    await expect(runPlugin()).rejects.toThrow(/expo-uiscene.*AppDelegate.*shape/i);
  });

  it.each([
    [
      'factory assignment',
      (contents: string) =>
        contents.replace('reactNativeFactory = factory', '// assignment removed'),
    ],
    [
      'real startup call',
      (contents: string) =>
        contents
          .replace('factory.startReactNative(', 'factory.startReactNativeCustom(')
          .concat('\n// factory.startReactNative(\n'),
    ],
  ])('rejects a template missing the standard %s structure', async (_label, mutate) => {
    loadProject((files) => {
      files['ios/HelloWorld/AppDelegate.swift'] = mutate(
        files['ios/HelloWorld/AppDelegate.swift'].toString()
      );
    });

    await expect(runPlugin()).rejects.toThrow(/expo-uiscene.*AppDelegate.*shape/i);
  });
});
