'use strict';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  name: 'client',
  target: 'node',
  mode: 'development',

  devtool: false,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
  },
  entry: {
    '001-counter': ['./001-counter/test-case.ts'],
  },
  output: {
    filename: '[name].[hash].js',
    libraryTarget: 'commonjs',
    path: path.join(__dirname, './dist/tests'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['dist/details'], {
      root: __dirname,
      verbose: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
