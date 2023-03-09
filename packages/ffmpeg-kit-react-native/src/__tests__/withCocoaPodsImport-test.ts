import { getFixture } from "../../../../fixtures/getFixtures";
import { addCocoaPodsImport } from "../withCocoaPodsImport";

describe(addCocoaPodsImport, () => {
  it(`adds import`, () => {
    expect(addCocoaPodsImport(getFixture("Podfile"))).toMatchSnapshot();
  });
});
