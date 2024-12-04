import {
    AndroidConfig,
    createRunOncePlugin,
    IOSConfig,
    withXcodeProject,
    withAppBuildGradle,
    withProjectBuildGradle,
    withPlugins,
    ConfigPlugin,
    withGradleProperties,
  } from "@expo/config-plugins";
  import { mergeContents, MergeResults, createGeneratedHeaderComment, removeGeneratedContents, } from "@expo/config-plugins/build/utils/generateCode";
  
  const gradleMaven = [
    `allprojects {
      repositories {
          jcenter()
          maven {
              url 'https://jitpack.io'
              credentials { username authToken }
          }
      }
  }`,
  ].join("\n");
  
  const gradleClasspathFirebase = [
    `buildscript {
      dependencies {
           classpath 'com.google.gms:google-services:4.3.10'
      }
  }`,
  ].join("\n");
  
  
  //Add authToken Property in gradle.properties
  
  const modifyGradlePropertyFlyy: ConfigPlugin = (config) => {
    return withGradleProperties(config, (config) => {
      config.modResults.push({
        type: 'property',
        key: 'authToken',
        value: "jp_9lured1djkqj83p7vaqhes4img",
    })
      return config;
    });
  };
  
  //Add apply-plugin for firebase
  
  const addApplyPlugin = (src: string) => {
    const newSrc = [];
    newSrc.push("apply plugin: \"com.google.gms.google-services\" ");
    return mergeContents({
      tag: "apply-plugin-google-services",
      src,
      newSrc: newSrc.join("\n"),
      anchor: /apply plugin/,
      // Inside the dependencies block.
      offset: 1,
      comment: "//",
    });
  };
  
  const withGradlePluginApply: ConfigPlugin = (config) => {
    return withAppBuildGradle(config, (config) => {
      if (config.modResults.language === "groovy") {
        config.modResults.contents = addApplyPlugin(
          config.modResults.contents
        ).contents;
      } else {
        throw new Error(
          "Cannot add Play Services maven gradle because the project build.gradle is not groovy"
        );
      }
      return config;
    });
  };
  
  //Add ClassPath for Firebase
   function addFirebaseClasspath(src: string): MergeResults {
    return appendContents({
      tag: "google-services-classpath",
      src,
      newSrc: gradleClasspathFirebase,
      comment: "//",
    });
  }
  
  const withGradleFirebaseClasspath: ConfigPlugin = (config) => {
    return withProjectBuildGradle(config, (config) => {
      if (config.modResults.language === "groovy") {
        config.modResults.contents = addFirebaseClasspath(
          config.modResults.contents
        ).contents;
      } else {
        throw new Error(
          "Cannot add Play Services maven gradle because the project build.gradle is not groovy"
        );
      }
      return config;
    });
  };
  
  
  //Add Flyy required Maven()
  
   function addGardleMaven(src: string): MergeResults {
    return appendContents({
      tag: "flyy-maven-jitpack",
      src,
      newSrc: gradleMaven,
      comment: "//",
    });
  }
  
  const withGradleFlyy: ConfigPlugin = (config) => {
    return withProjectBuildGradle(config, (config) => {
      if (config.modResults.language === "groovy") {
        config.modResults.contents = addGardleMaven(
          config.modResults.contents
        ).contents;
      } else {
        throw new Error(
          "Cannot add Play Services maven gradle because the project build.gradle is not groovy"
        );
      }
      return config;
    });
  };
  
  function appendContents({
    src,
    newSrc,
    tag,
    comment,
  }: {
    src: string;
    newSrc: string;
    tag: string;
    comment: string;
  }): MergeResults {
    const header = createGeneratedHeaderComment(newSrc, tag, comment);
    if (!src.includes(header)) {
      // Ensure the old generated contents are removed.
      const sanitizedTarget = removeGeneratedContents(src, tag);
      const contentsToAdd = [
        // @something
        header,
        // contents
        newSrc,
        // @end
        `${comment} @generated end ${tag}`,
      ].join("\n");
  
      return {
        contents: sanitizedTarget ?? src + contentsToAdd,
        didMerge: true,
        didClear: !!sanitizedTarget,
      };
    }
    return { contents: src, didClear: false, didMerge: false };
  }
  
  const withFlyyPlugin: ConfigPlugin<void> = (
    config,
    _props
  ) => withPlugins(config, [
    modifyGradlePropertyFlyy,
    withGradleFlyy,
    withGradleFirebaseClasspath,
    withGradlePluginApply
  ]);
  
  const pkg = {
    // Prevent this plugin from being run more than once.
    // This pattern enables users to safely migrate off of this
    // out-of-tree `@config-plugins/react-native-flyy` to a future
    // upstream plugin in `react-native-flyy`
    name: "react-native-flyy",
    // Indicates that this plugin is dangerously linked to a module,
    // and might not work with the latest version of that module.
    version: "2.0.0",
  };
  
  export default createRunOncePlugin(withFlyyPlugin, pkg.name, pkg.version);
  