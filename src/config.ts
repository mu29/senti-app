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
  },
  development: {
    apiUrl: 'http://localhost:5000/senti-development/us-central1/graphql',
  },
  staging: {
    apiUrl: 'https://us-central1-senti-development.cloudfunctions.net/graphql',
  },
  production: {
    apiUrl: 'https://api.senti.in',
  },
};

export default {
  ...config.all,
  ...config[config.all.env || 'development'],
};
