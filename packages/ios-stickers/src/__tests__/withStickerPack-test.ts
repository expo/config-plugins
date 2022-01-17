import withStickerPack from "../withStickerPack";

const exp = { name: "foo", slug: "bar" };
describe(withStickerPack, () => {
  it("should not throw when options are valid", () => {
    expect(() =>
      withStickerPack(exp, {
        name: "test",
        stickers: [{ image: "test.png" }],
        columns: 2,
        icon: "test.png",
      })
    ).not.toThrow();
  });
  it("should not throw when no options are provided", () => {
    expect(() => withStickerPack(exp, {})).not.toThrow();
  });
  it("should throw if columns is not a number", () => {
    expect(() => {
      withStickerPack(exp, {
        stickers: [],
        icon: "",
        name: "",
        columns: "3",
      } as any);
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. @config-plugins/ios-stickers has been initialized using an options object that does not match the API schema.
       - options.columns should be one of these:
         2 | 3 | 4"
    `);
  });
});
