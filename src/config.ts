type Config = {
  env?: string;
  isDev?: boolean;
  apiUrl?: string;
  baseUrl?: string;
};

const env = process.env.NODE_ENV || 'development';

const config: {
  [key: string]: Config;
} = {
  all: {
    env,
    isDev: env === 'development',
    apiUrl: 'http://192.168.0.6:5000/senti-ee110/us-central1/graphql',
  },
  development: {
    apiUrl: 'http://192.168.0.6:5000/senti-ee110/us-central1/graphql',
  },
  production: {
    apiUrl: 'https://us-central1-senti-ee110.cloudfunctions.net/graphql',
  },
};

export default {
  ...config.all,
  ...config[config.all.env || 'development'],
};
