type BaseRestriction = {
  key: string;
  title: string;
  description?: string;
  defaultValue?: boolean | number | string | string[]; // Adjust based on restrictionType requirements
};

type BooleanRestriction = BaseRestriction & {
  restrictionType: "bool";
  defaultValue?: boolean;
};

type StringRestriction = BaseRestriction & {
  restrictionType: "string";
  defaultValue?: string;
};

type IntegerRestriction = BaseRestriction & {
  restrictionType: "integer";
  defaultValue?: number;
};

type BundleRestriction = BaseRestriction & {
  restrictionType: "bundle" | "bundle_array";
  restrictions: AppRestriction[];
};

type ChoiceRestriction = BaseRestriction & {
  restrictionType: "choice";
  entries: string[];
  entryValues: string[];
  defaultValue?: string;
};

type MultiSelectRestriction = BaseRestriction & {
  restrictionType: "multi-select";
  entries: string[];
  entryValues: string[];
  defaultValue?: string[];
};

type HiddenRestriction = BaseRestriction & {
  restrictionType: "hidden";
  defaultValue: boolean | number | string; // Hidden must have a defaultValue
};

export type AppRestriction =
  | BooleanRestriction
  | StringRestriction
  | IntegerRestriction
  | ChoiceRestriction
  | MultiSelectRestriction
  | HiddenRestriction
  | BundleRestriction;
