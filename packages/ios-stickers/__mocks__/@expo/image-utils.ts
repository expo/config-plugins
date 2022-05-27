export const generateImageAsync = jest.fn(async (input: any, { src }) => {
  const fs = require("fs");
  return { source: fs.readFileSync(src) };
});

export const compositeImagesAsync = jest.fn(async ({ foreground }) => {
  return foreground;
});
