export interface Config {
  aws: {
    accessKey: string;
    secretKey: string;
    region: string;
    bucket: string;
    prefix: string;
  };
  openai: {
    apiKey: string;
    projectId: string;
  };
}

export const defaultConfig: Config = {
  aws: {
    accessKey: '',
    secretKey: '',
    region: '',
    bucket: '',
    prefix: '',
  },
  openai: {
    apiKey: '',
    projectId: '',
  },
};
