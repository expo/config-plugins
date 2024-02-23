import { MissingParamsException } from "../MissingParamsException";
import {
  setupGoogleSigninIos,
  withGoogleSigninIos,
} from "../withGoogleSigninIos";

function fakeExportedConfig(plist?: Record<string, any>): any {
  return { ios: { infoPlist: plist } };
}

describe(withGoogleSigninIos, () => {
  it(`add "iosClientId" and "iosUrlScheme" to Info.plist`, () => {
    const config = setupGoogleSigninIos(fakeExportedConfig(), {
      iosClientId: "iosClientId",
      iosUrlScheme: "iosUrlScheme",
    });
    expect(config).toEqual(
      fakeExportedConfig({
        GIDClientID: "iosClientId",
        CFBundleURLTypes: [{ CFBundleURLSchemes: ["iosUrlScheme"] }],
      }),
    );
  });

  it(`should throw error missing "iosClientId" param`, () => {
    expect(() =>
      setupGoogleSigninIos(fakeExportedConfig(), { iosUrlScheme: "xx" }),
    ).toThrow(MissingParamsException);
  });

  it(`should throw error missing "iosUrlScheme" param`, () => {
    expect(() =>
      setupGoogleSigninIos(fakeExportedConfig(), { iosClientId: "xx" }),
    ).toThrow(MissingParamsException);
  });

  it(`should not throw mission param error when android only`, () => {
    expect(() => setupGoogleSigninIos({ android: {} } as any, {})).not.toThrow(
      MissingParamsException,
    );
  });
});
