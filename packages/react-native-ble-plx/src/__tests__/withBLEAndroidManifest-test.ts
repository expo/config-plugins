import { AndroidConfig, XML } from "@expo/config-plugins";
import { resolve } from "path";

import {
  addAdminBluetoothPermissionToManifest,
  addBLEHardwareFeatureToManifest,
  addConnectBluetoothPermissionToManifest,
  addLocationPermissionToManifest,
  addScanBluetoothPermissionToManifest,
} from "../withBLEAndroidManifest";

const { readAndroidManifestAsync } = AndroidConfig.Manifest;

const sampleManifestPath = resolve(__dirname, "fixtures/AndroidManifest.xml");

describe("addLocationPermissionToManifest", () => {
  it(`adds elements`, async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addLocationPermissionToManifest(androidManifest, false);

    expect(androidManifest.manifest["uses-permission"]).toContainEqual({
      $: {
        "android:name": "android.permission.ACCESS_FINE_LOCATION",
      },
    });

    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission android:name="android\.permission\.ACCESS_FINE_LOCATION"\/>/
    );
  });

  it(`adds elements with SDK limit`, async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addLocationPermissionToManifest(androidManifest, true);

    expect(androidManifest.manifest["uses-permission"]).toContainEqual({
      $: {
        "android:name": "android.permission.ACCESS_FINE_LOCATION",
        "android:maxSdkVersion": "30",
      },
    });

    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission android:name="android\.permission\.ACCESS_FINE_LOCATION" android:maxSdkVersion="30"\/>/
    );
  });
});

describe("addConnectionPermissionToManifest", () => {
  it(`adds element`, async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addConnectBluetoothPermissionToManifest(androidManifest);

    expect(androidManifest.manifest["uses-permission"]).toContainEqual({
      $: {
        "android:name": "android.permission.BLUETOOTH_CONNECT",
      },
    });

    // Sanity
    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission android:name="android\.permission\.BLUETOOTH_CONNECT"\/>/
    );
  });
});

describe("addScanPermissionToManifest", () => {
  it(`adds element`, async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addScanBluetoothPermissionToManifest(
      androidManifest,
      false
    );

    expect(androidManifest.manifest["uses-permission"]).toContainEqual({
      $: {
        "android:name": "android.permission.BLUETOOTH_SCAN",
        "tools:targetApi": "31",
      },
    });

    // Sanity
    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission android:name="android\.permission\.BLUETOOTH_SCAN" tools:targetApi="31"\/>/
    );
  });

  it(`adds element neverForLocation`, async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addScanBluetoothPermissionToManifest(
      androidManifest,
      true
    );

    expect(androidManifest.manifest["uses-permission"]).toContainEqual({
      $: {
        "android:name": "android.permission.BLUETOOTH_SCAN",
        "android:usesPermissionFlags": "neverForLocation",
        "tools:targetApi": "31",
      },
    });

    // Sanity
    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission android:name="android\.permission\.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" tools:targetApi="31"\/>/
    );
  });
});

describe("addAdminPermissionToManifest", () => {
  it(`adds element`, async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addAdminBluetoothPermissionToManifest(
      androidManifest,
      false
    );

    expect(androidManifest.manifest["uses-permission"]).toContainEqual({
      $: {
        "android:name": "android.permission.BLUETOOTH_ADMIN",
        "android:maxSdkVersion": "30",
      },
    });

    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission android:name="android\.permission\.BLUETOOTH_ADMIN" android:maxSdkVersion="30"\/>/
    );
  });

  it("adds elmeent with canDiscover = true", async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addAdminBluetoothPermissionToManifest(
      androidManifest,
      true
    );

    expect(androidManifest.manifest["uses-permission"]).toContainEqual({
      $: {
        "android:name": "android.permission.BLUETOOTH_ADMIN",
      },
    });

    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission android:name="android\.permission\.BLUETOOTH_ADMIN"\/>/
    );
  });
});

describe("addBLEHardwareFeatureToManifest", () => {
  it(`adds element`, async () => {
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath);
    androidManifest = addBLEHardwareFeatureToManifest(androidManifest);

    expect(androidManifest.manifest["uses-feature"]).toStrictEqual([
      {
        $: {
          "android:name": "android.hardware.bluetooth_le",
          "android:required": "true",
        },
      },
    ]);
    // Sanity
    expect(XML.format(androidManifest)).toMatch(
      /<uses-feature android:name="android\.hardware\.bluetooth_le" android:required="true"\/>/
    );
  });
});
