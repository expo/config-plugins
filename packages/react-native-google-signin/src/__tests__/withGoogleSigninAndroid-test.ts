import { MissingParamsException } from "../MissingParamsException";
import {
  setupGoogleSigninAndroid,
  withGoogleSigninAndroid,
} from "../withGoogleSigninAndroid";

type XML = { $: { name: string }; _: string };

function fakeExportedConfig(string?: XML[]): any {
  return { android: {}, modResults: { resources: { string } } };
}

describe(withGoogleSigninAndroid, () => {
  it("add serverClientId to strings.xml", () => {
    const config = setupGoogleSigninAndroid(fakeExportedConfig(), {
      serverClientId: "xxx",
    });
    expect(config).toEqual(
      fakeExportedConfig([{ $: { name: "server_client_id" }, _: "xxx" }]),
    );
  });

  it(`should throw error missing "serverClientId" param`, () => {
    expect(() =>
      setupGoogleSigninAndroid(fakeExportedConfig(), { serverClientId: "" }),
    ).toThrow(MissingParamsException);
  });

  it(`should not throw mission param error when ios only`, () => {
    expect(() => setupGoogleSigninAndroid({ ios: {} } as any, {})).not.toThrow(
      MissingParamsException,
    );
  });
});
