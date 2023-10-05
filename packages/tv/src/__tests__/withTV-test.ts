import { AndroidConfig } from "@expo/config-plugins";
import { resolve } from "path";

import {
  removePortraitOrientation,
  setLeanBackLauncherIntent,
} from "../withTVAndroidManifest";
import {
  addTVPodfileModifications,
  removeTVPodfileModifications,
} from "../withTVPodfile";
import {
  addTVSplashScreenModifications,
  removeTVSplashScreenModifications,
} from "../withTVSplashScreen";

const { readAndroidManifestAsync } = AndroidConfig.Manifest;

const sampleManifestPath = resolve(
  __dirname,
  "./fixtures",
  "react-native-AndroidManifest.xml"
);

const sampleManifestWithNoMainIntentPath = resolve(
  __dirname,
  "./fixtures",
  "react-native-AndroidManifestWithNoMainIntent.xml"
);

const originalPodfile = `
require 'json'
podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}

platform :ios, '13.4'

target 'Test' do
end
`;

const originalSplashScreen = `
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="16096" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="EXPO-VIEWCONTROLLER-1">
    <device id="retina5_5" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="16087"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <scene sceneID="EXPO-SCENE-1">
            <objects>
                <viewController storyboardIdentifier="SplashScreenViewController" id="EXPO-VIEWCONTROLLER-1" sceneMemberID="viewController">
                    <view key="view" userInteractionEnabled="NO" contentMode="scaleToFill" insetsLayoutMarginsFromSafeArea="NO" id="EXPO-ContainerView" userLabel="ContainerView">
                        <rect key="frame" x="0.0" y="0.0" width="414" height="736"/>
                        <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
                        <subviews>
                            <imageView userInteractionEnabled="NO" contentMode="scaleAspectFill" horizontalHuggingPriority="251" verticalHuggingPriority="251" insetsLayoutMarginsFromSafeArea="NO" image="SplashScreenBackground" translatesAutoresizingMaskIntoConstraints="NO" id="EXPO-SplashScreenBackground" userLabel="SplashScreenBackground">
                                <rect key="frame" x="0.0" y="0.0" width="414" height="736"/>
                            </imageView>
                            <imageView id="EXPO-SplashScreen" userLabel="SplashScreen" image="SplashScreen" contentMode="scaleAspectFit" horizontalHuggingPriority="251" verticalHuggingPriority="251" clipsSubviews="true" userInteractionEnabled="false" translatesAutoresizingMaskIntoConstraints="false">
                                <rect key="frame" x="0" y="0" width="414" height="736"/>
                            </imageView>
                        </subviews>
                        <viewLayoutGuide key="safeArea" id="Rmq-lb-GrQ"/>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="EXPO-PLACEHOLDER-1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="140.625" y="129.4921875"/>
        </scene>
    </scenes>
    <resources>
        <image name="SplashScreenBackground" width="1" height="1"/>
        <image name="SplashScreen" width="414" height="736"/>
    </resources>
</document>
`;

describe("withTV iOS/tvOS tests", () => {
  test("Add TV Podfile changes", () => {
    const modifiedPodfile = addTVPodfileModifications(originalPodfile);
    expect(modifiedPodfile).toMatchSnapshot();
  });
  test("Revert TV podfile changes", () => {
    const modifiedPodfile = addTVPodfileModifications(originalPodfile);
    const revertedPodfile = removeTVPodfileModifications(modifiedPodfile);
    expect(revertedPodfile).toEqual(originalPodfile);
  });
  test("Add TV splash screen changes", () => {
    const modifiedSplashScreen =
      addTVSplashScreenModifications(originalSplashScreen);
    expect(modifiedSplashScreen).toMatchSnapshot();
  });
  test("Revert TV splash screen changes", () => {
    const modifiedSplashScreen =
      addTVSplashScreenModifications(originalSplashScreen);
    const revertedSplashScreen =
      removeTVSplashScreenModifications(modifiedSplashScreen);
    expect(revertedSplashScreen).toEqual(originalSplashScreen);
  });
});

describe("with TV Android tests", () => {
  test("Adds leanback launcher intent category for TV builds", async () => {
    const originalManifest = await readAndroidManifestAsync(sampleManifestPath);
    const modifiedManifest = setLeanBackLauncherIntent(
      {},
      originalManifest,
      false
    );
    expect(JSON.stringify(modifiedManifest).indexOf("LEANBACK")).not.toEqual(
      -1
    );
  });
  test("Throws if manifest has no main intent", async () => {
    const originalManifest = await readAndroidManifestAsync(
      sampleManifestWithNoMainIntentPath
    );
    try {
      setLeanBackLauncherIntent({}, originalManifest, false);
      // Should not reach this line
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain(
        "no main intent in main activity of Android manifest"
      );
    }
  });
  test("Removes orientation from activity metadata for TV builds", async () => {
    const originalManifest = await readAndroidManifestAsync(sampleManifestPath);
    const modifiedManifest = await removePortraitOrientation(
      {},
      originalManifest,
      false
    );
    expect(
      JSON.stringify(modifiedManifest).indexOf("screenOrientation")
    ).toEqual(-1);
  });
});
