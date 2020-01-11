/* eslint import/no-commonjs: 0, strict: 0, no-param-reassign: 0, global-require: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');

const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const styledComponentsTransformer = createStyledComponentsTransformer({
  getDisplayName: (filename, bindingName) => {
    const name = path.basename(filename).split('.')[0];
    return `${name}_${bindingName || ''}`;
  },
});

module.exports = {
  name: 'client',
  target: 'web',
  mode: 'production',

  devtool: false,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
  },
  entry: {
    '001-counter': ['./001-counter/details/index.tsx'],
  },
  externals: {
    react: 'root React',
    'react-dom': 'root ReactDom',
    'styled-components': 'root StyledComponents',
    ui: 'root ui',
  },
  output: {
    library: 'ChallengeJSONP',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
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
              getCustomTransformers: () => ({
                before: [styledComponentsTransformer],
              }),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
