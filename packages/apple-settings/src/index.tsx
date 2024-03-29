import { withStaticSettings, StaticSettings, AppleLocale } from "./static";

export {
  ChildPane,
  Group,
  RadioGroup,
  Slider,
  Switch,
  TextField,
  Title,
  MultiValue,
} from "./models";

export { StaticSettings, AppleLocale };

export * from "./schema/SettingsPlist";

export default withStaticSettings;
