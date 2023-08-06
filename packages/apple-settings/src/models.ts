import {
  AnyPreferenceSpecifier,
  PSChildPaneSpecifier,
  PSGroupSpecifier,
  PSMultiValueSpecifier,
  PSRadioGroupSpecifier,
  PSSliderSpecifier,
  PSTextFieldSpecifier,
  PSTitleValueSpecifier,
  PSToggleSwitchSpecifier,
  ScalarType,
  SettingsPlist,
  UserInterfaceIdiom,
} from "./schema/SettingsPlist";

export function page(specs: AnyPreferenceSpecifier[]): { page: SettingsPlist } {
  return {
    page: {
      PreferenceSpecifiers: specs,
    },
  };
}

export function ChildPane({
  title,
  file,
  idioms,
}: {
  title: string;
  file?: string;
  idioms?: UserInterfaceIdiom[];
}): PSChildPaneSpecifier {
  const obj: PSChildPaneSpecifier = {
    Type: "PSChildPaneSpecifier",
    Title: title,
    File: file ?? title,
  };

  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}

export function Title({
  title,
  value,
  key,
  items,
  idioms,
}: {
  title: string;
  value: string;
  key: string;
  idioms?: UserInterfaceIdiom[];
  // Use a tuple to preserve order and length
  items?: { title: string; value: string }[];
}): PSTitleValueSpecifier {
  const obj: PSTitleValueSpecifier = {
    Type: "PSTitleValueSpecifier",
    Title: title,
    DefaultValue: value,
    Key: key,
  };
  if (items) {
    obj.Titles = items.map(({ title }) => title);
    obj.Values = items.map(({ value }) => value);
  }
  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}

export function Group({
  title,
  footerText,
  idioms,
}: {
  title: string;
  footerText?: string;
  idioms?: UserInterfaceIdiom[];
}): PSGroupSpecifier {
  const obj: PSGroupSpecifier = {
    Type: "PSGroupSpecifier",
    Title: title,
    FooterText: footerText,
  };

  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}

export function TextField({
  title,
  key,
  value,
  idioms,
  secure,
  autoCapitalize,
  keyboardType,
  autoCorrect,
}: {
  secure?: boolean;
  title?: string;
  key: string;
  value?: string;
  keyboardType?: PSTextFieldSpecifier["KeyboardType"];
  autoCapitalize?: PSTextFieldSpecifier["AutocapitalizationType"];
  autoCorrect?: PSTextFieldSpecifier["AutocorrectionType"];
  idioms?: UserInterfaceIdiom[];
}): PSTextFieldSpecifier {
  const obj: PSTextFieldSpecifier = {
    Type: "PSTextFieldSpecifier",
    Title: title,
    Key: key,
    DefaultValue: value,
    IsSecure: secure,
    KeyboardType: keyboardType,
    AutocapitalizationType: autoCapitalize,
    AutocorrectionType: autoCorrect,
  };

  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}

export function Slider({
  key,
  value = 0,
  maximumValue = 1,
  minimumValue = 0,
  maximumTrackImage,
  minimumTrackImage,
  idioms,
}: {
  key: string;
  value?: number;
  maximumValue?: number;
  minimumValue?: number;
  maximumTrackImage?: string;
  minimumTrackImage?: string;
  idioms?: UserInterfaceIdiom[];
}): PSSliderSpecifier {
  const obj: PSSliderSpecifier = {
    Type: "PSSliderSpecifier",
    DefaultValue: value,
    MaximumValue: maximumValue,
    MinimumValue: minimumValue,
    MaximumValueImage: maximumTrackImage,
    MinimumValueImage: minimumTrackImage,
    Key: key,
  };

  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}

export function Switch({
  title,
  key,
  value = false,
  idioms,
}: {
  title: string;
  key: string;
  value?: boolean;
  idioms?: UserInterfaceIdiom[];
}): PSToggleSwitchSpecifier {
  const obj: PSToggleSwitchSpecifier = {
    Type: "PSToggleSwitchSpecifier",
    Title: title,
    Key: key,
    DefaultValue: value,
    FalseValue: false,
    TrueValue: true,
  };

  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}

export function RadioGroup({
  title,
  key,
  value,
  idioms,
  items,
  footerText,
  displaySortedByTitle,
}: {
  title?: string;
  key: string;
  value: string;
  idioms?: UserInterfaceIdiom[];
  // Use a tuple to preserve order and length
  items: { title: string; value: string }[];
  footerText?: string;
  displaySortedByTitle?: boolean;
}): PSRadioGroupSpecifier {
  const obj: PSRadioGroupSpecifier = {
    Type: "PSRadioGroupSpecifier",
    Title: title,
    Key: key,
    FooterText: footerText,
    DisplaySortedByTitle: displaySortedByTitle,
    DefaultValue: value,
    Titles: items.map(({ title }) => title),
    Values: items.map(({ value }) => value),
  };

  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}
export function MultiValue({
  title,
  key,
  value,
  idioms,
  items,
  displaySortedByTitle,
}: {
  title: string;
  key: string;
  value: ScalarType;
  // Use a tuple to preserve order and length
  items: { title: string; short?: string; value: ScalarType }[];
  displaySortedByTitle?: boolean;
  idioms?: UserInterfaceIdiom[];
}): PSMultiValueSpecifier {
  const obj: PSMultiValueSpecifier = {
    Type: "PSMultiValueSpecifier",
    Title: title,
    Key: key,
    DisplaySortedByTitle: displaySortedByTitle,
    DefaultValue: value,
    Titles: items.map(({ title }) => title),
    Values: items.map(({ value }) => value),
    ShortTitles: items.map(({ short }) => short ?? ""),
  };

  if (idioms) {
    obj.SupportedUserInterfaceIdioms = idioms;
  }
  return obj;
}
