/* eslint import/no-commonjs: 0, strict: 0, no-param-reassign: 0, global-require: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;

const styledComponentsTransformer = createStyledComponentsTransformer({
  getDisplayName: (filename, bindingName) => {
    const name = path.basename(filename).split('.')[0];
    return `${name}_${bindingName || ''}`;
  },
});

const compact = array => array.filter(x => x);

module.exports = {
  name: 'client',
  target: 'web',
  mode: 'development',

  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
  },
  entry: {
    app: ['./001-counter/details/demo.tsx'],
  },
  devServer: {
    hot: true,
    contentBase: './dist',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    libraryTarget: 'var',
    path: path.join(__dirname, './dist'),
    publicPath: '/',
  },
  plugins: compact([
    // new CleanWebpackPlugin(['dist'], {
    //   root: __dirname,
    //   verbose: false,
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.ejs'),
      hash: false,
      filename: 'index.html',
      inject: false,
      minify: {
        collapseWhitespace: false,
      },
      title: 'Demo',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]),
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
