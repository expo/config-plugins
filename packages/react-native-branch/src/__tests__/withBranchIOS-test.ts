import {
  setBranchApiKeys,
  enableBranchTestEnvironment,
} from "../withBranchIOS";

describe(setBranchApiKeys, () => {
  it(`sets branch_key.live if the api key is given`, () => {
    expect(setBranchApiKeys({ apiKey: "LIVE-API-KEY" }, {})).toMatchObject({
      branch_key: {
        live: "LIVE-API-KEY",
      },
    });
  });

  it(`sets branch_key.test if the test api key is given`, () => {
    expect(
      setBranchApiKeys(
        { apiKey: "LIVE-API-KEY", testApiKey: "TEST-API-KEY" },
        {}
      )
    ).toMatchObject({
      branch_key: {
        live: "LIVE-API-KEY",
        test: "TEST-API-KEY",
      },
    });
  });
});

describe(enableBranchTestEnvironment, () => {
  it(`must assign the passed boolean value into branch_key.branch_test_mode`, () => {
    expect(enableBranchTestEnvironment(true, {})).toMatchObject({
      branch_test_environment: true,
    });
  });
});
