import {
  setupGoogleSigninAndroid,
  withGoogleSigninAndroid,
} from "../withGoogleSigninAndroid";

describe(withGoogleSigninAndroid, () => {
  it("add serverClientId to strings.xml", () => {
    const config: any = setupGoogleSigninAndroid([], "xxx");
    expect(config).toEqual([{ $: { name: "server_client_id" }, _: "xxx" }]);
  });
});
