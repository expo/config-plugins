import { AppRestriction } from "./appRestrictionTypes";

export const generateAppRestrictionsContent = (
  restrictions: AppRestriction[]
): string => {
  const content = getConfigContent(restrictions);
  return `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
${content}
</restrictions>`;
};

const getConfigContent = (restrictions: AppRestriction[]) => {
  return restrictions.map(createAppRestrictionXML).join("\n");
};

const createAppRestrictionXML = (restriction: AppRestriction): string => {
  let xml = `<restriction
    android:key="${restriction.key}"
    android:title="${restriction.title.replaceAll('"', "&quot;")}"
    android:restrictionType="${restriction.restrictionType}"`;

  if (restriction.description) {
    xml += `
    android:description="${restriction.description.replaceAll('"', "&quot;")}"`;
  }

  // Special handling for defaultValue based on restriction type and structure.
  if (restriction.defaultValue !== undefined) {
    if (Array.isArray(restriction.defaultValue)) {
      // Join array values with '|' for multi-select defaults.
      xml += `
    android:defaultValue="${restriction.defaultValue.join("|").replaceAll('"', "&quot;")}"`;
    } else {
      const defaultValueString =
        typeof restriction.defaultValue === "boolean" ||
        typeof restriction.defaultValue === "number"
          ? restriction.defaultValue.toString()
          : restriction.defaultValue;
      xml += `
    android:defaultValue="${defaultValueString.replaceAll('"', "&quot;")}"`;
    }
  }
  if ("entries" in restriction && "entryValues" in restriction) {
    xml += `
    android:entries="${restriction.entries.join("|").replaceAll('"', "&quot;")}"
    android:entryValues="${restriction.entryValues.join("|").replaceAll('"', "&quot;")}"`;
  }

  if (
    restriction.restrictionType === "bundle" ||
    restriction.restrictionType === "bundle_array"
  ) {
    xml += ">";
    xml += "\n" + getConfigContent(restriction.restrictions) + "\n";
    xml += "</restriction>";
  } else {
    xml += "/>";
  }

  return xml;
};
