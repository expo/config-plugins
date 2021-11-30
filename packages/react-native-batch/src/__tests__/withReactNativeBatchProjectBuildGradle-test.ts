import { modifyBuildScript } from "../withReactNativeBatchProjectBuildGradle";
import {
  projectBuildGradleExpectedFixture,
  projectBuildGradleFixture,
} from "./fixtures/projectBuildGradle";

describe("modifyBuildScript", () => {
  it("should modify the build script in the ProjetGradle file", () => {
    const result = modifyBuildScript(projectBuildGradleFixture);

    expect(result).toEqual(projectBuildGradleExpectedFixture);
  });
});
