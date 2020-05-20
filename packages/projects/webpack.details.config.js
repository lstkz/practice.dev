'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
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
        entry[`${name}/${challengeId}`] = [
          `./${name}/${subName}/details/index.tsx`,
        ];
      }
    });
  });

module.exports = {
  name: 'client',
  target: 'web',
  mode: 'production',

  devtool: false,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
  },
  entry: entry,
  externals: {
    react: 'root React',
    'react-dom': 'root ReactDom',
    'styled-components': 'root StyledComponents',
    ui: 'root ui',
  },
  output: {
    library: 'ChallengeJSONP',
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'jsonp',
    path: path.join(__dirname, './dist/details'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['dist/details'], {
      root: __dirname,
      verbose: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(html|css)$/i,
        use: 'raw-loader',
      },
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
