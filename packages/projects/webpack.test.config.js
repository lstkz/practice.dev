'use strict';

const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**@type {any} */
const entry = {};
const dir = fs.readdirSync(__dirname);

dir
  .filter(name => {
    const stats = fs.statSync(path.join(__dirname, name));
    return stats.isDirectory() && /^\d\d\d\-/.test(name);
  })
  .forEach(name => {
    const dir = fs.readdirSync(path.join(__dirname, name));
    dir.forEach(subName => {
      const exec = /challenge-(\d+)/.exec(subName);
      if (exec) {
        const challengeId = exec[1];
        entry[`${name}/${challengeId}`] = [`./${name}/${subName}/test-case.ts`];
      }
    });
  });

module.exports = {
  name: 'client',
  target: 'node',
  mode: 'development',

  devtool: false,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
  },
  entry: entry,
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: path.join(__dirname, './dist/tests'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['dist/tests'], {
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
