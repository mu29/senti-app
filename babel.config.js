module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['module-resolver', {
      root: ['./src'],
      alias: {
        'components': './src/components',
        'constants': './src/constants',
        'containers': './src/containers',
        'services': './src/services',
        'graphqls': './src/graphqls',
        'utils': './src/utils',
      },
    }],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
