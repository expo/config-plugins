export function replaceIfNotFound(
  originalString: string,
  stringToBeReplaced: string,
  newStringToReplace: string
) {
  // Make sure the original does not contain the new string
  if (!originalString.includes(newStringToReplace)) {
    return originalString.replace(stringToBeReplaced, newStringToReplace);
  }

  return originalString;
}
