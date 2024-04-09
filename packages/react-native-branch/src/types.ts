export type ConfigData = {
  apiKey?: string;
  testApiKey?: string;
  iosAppDomain?: string;
  iosUniversalLinkDomains?: string[];
  enableTestEnvironment?: boolean;
};

export type BranchKeys = {
  apiKey: string;
  testApiKey?: string;
};
