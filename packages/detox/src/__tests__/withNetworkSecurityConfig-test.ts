import {
  getTemplateFile,
  withNetworkSecurityConfigManifest,
} from "../withNetworkSecurityConfig";

describe(getTemplateFile, () => {
  it(`returns only base-config when subdomains is '*'`, () => {
    const content = getTemplateFile("*");
    expect(content).toMatchSnapshot();
    expect(content).toMatch(/base\-config/);
    expect(content).not.toMatch(/domain\-config/);
  });
  it(`returns domain-config when subdomains is an array`, () => {
    const content = getTemplateFile(["localhost"]);
    expect(content).toMatchSnapshot();
    expect(content).toMatch(/domain\-config/);
    expect(content).toMatch(/localhost/);
  });
});

const exp = { name: "foo", slug: "bar" };

describe(withNetworkSecurityConfigManifest, () => {
  it(`doesn't modify config if subdomains is an empty array`, () => {
    const applied = withNetworkSecurityConfigManifest(exp, {
      subdomains: [],
    });
    expect(applied).toMatchSnapshot();
    expect(applied).toMatchObject(exp);
  });
  it(`modifies config if subdomains is not empty`, () => {
    const applied = withNetworkSecurityConfigManifest(exp, {
      subdomains: ["10.0.2.2"],
    });
    expect(applied).toMatchSnapshot();
    expect(applied).toHaveProperty("mods.android");
  });
});
