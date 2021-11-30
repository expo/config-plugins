import { AndroidConfig, XML } from '@expo/config-plugins'

import withReactNativeBatch from '../withReactNativeBatch'
import {buildGradleFixture} from "../__tests__/fixtures/buildGradle"


const { readAndroidManifestAsync } = AndroidConfig.Manifest



describe('addFineControlPermissionToManifest', () => {
  it(`adds element`, async () => {
    const result = withReactNativeBatch(buildGradleFixture, {})
    let gradle = ;
    let androidManifest = await readAndroidManifestAsync(sampleManifestPath)
    androidManifest = await addFineControlPermissionToManifest(androidManifest)
    expect(androidManifest.manifest['uses-permission-sdk-23']).toStrictEqual([
      { $: { 'android:name': 'android.permission.ACCESS_FINE_LOCATION' } }
    ])
    // Sanity
    expect(XML.format(androidManifest)).toMatch(
      /<uses-permission-sdk-23 android:name="android\.permission\.ACCESS_FINE_LOCATION"\/>/
    )
  })
})

