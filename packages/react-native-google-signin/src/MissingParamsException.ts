export class MissingParamsException extends Error {
  constructor(param: string) {
    super(
      `Missing param "${param}" on the "@config-plugins/react-native-google-signin" plugin`,
    );
  }
}
