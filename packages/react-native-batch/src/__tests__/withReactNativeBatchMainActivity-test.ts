import { modifyMainActivity } from "../withReactNativeBatchMainActivity";
import {
  mainActivityExpectedFixture,
  mainActivityFixture,
} from "./fixtures/mainActivity";

describe("modifyMainActivity", () => {
  it("should push depedencies in the ProjetGradle file", () => {
    const result = modifyMainActivity(mainActivityFixture);

    expect(result).toEqual(mainActivityExpectedFixture);
  });
});
