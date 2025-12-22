module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
        ],
        alias: {
          '@app': './src/app',
          '@api': './src/api',
          '@features': './src/features',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@assets': './src/assets',
          '@types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};