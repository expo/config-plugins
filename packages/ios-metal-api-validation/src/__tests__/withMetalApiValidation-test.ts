import { readFileSync } from "fs";
import { join } from "path";

import withMetalApiValidation, {
  setMetalApiValidation,
} from "../withMetalApiValidation";

const fixture = readFileSync(
  join(__dirname, "fixtures/HelloWorld.xcscheme"),
  "utf8"
);

describe(setMetalApiValidation, () => {
  it(`disables Metal API validation on the LaunchAction`, () => {
    const result = setMetalApiValidation(fixture, false);
    expect(result).toContain(
      '<LaunchAction\n      enableGPUValidationMode = "1"'
    );
    // Only the LaunchAction is modified.
    expect(result.match(/enableGPUValidationMode/g)).toHaveLength(1);
  });

  it(`is idempotent`, () => {
    const once = setMetalApiValidation(fixture, false);
    expect(setMetalApiValidation(once, false)).toBe(once);
  });

  it(`replaces an existing validation mode`, () => {
    const extended = fixture.replace(
      /<LaunchAction\b/,
      '<LaunchAction\n      enableGPUValidationMode = "2"'
    );
    const result = setMetalApiValidation(extended, false);
    expect(result).toContain('enableGPUValidationMode = "1"');
    expect(result).not.toContain('enableGPUValidationMode = "2"');
  });

  it(`restores the Xcode default when enabled`, () => {
    const disabled = setMetalApiValidation(fixture, false);
    expect(setMetalApiValidation(disabled, true)).toBe(fixture);
  });
});

describe(withMetalApiValidation, () => {
  it(`evaluates without props`, () => {
    expect(() =>
      withMetalApiValidation({ name: "example", slug: "example" })
    ).not.toThrow();
  });
});
