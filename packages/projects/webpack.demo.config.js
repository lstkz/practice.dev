'use strict';

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

if (!process.env.C) {
  console.log(`Missing challenge configuration.
  Set env variable "C".
  For example:
  C=1.3
  will run project 1 challenge 3
`);
  process.exit(1);
}

const [projectId, challengeId] = process.env.C.split('.').map(n => Number(n));
if (challengeId == null) {
  console.log('Invalid or incomplete "C" value');
  process.exit(1);
}

function getEntry() {
  const projectPrefix = projectId.toString().padStart(3, '0') + '-';
  const dir = fs.readdirSync(__dirname);
  const realName = dir.find(name => {
    const stats = fs.statSync(path.join(__dirname, name));
    return stats.isDirectory() && name.startsWith(projectPrefix);
  });

  return `./${realName}/challenge-${challengeId}/details/demo.tsx`;
}

const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;

const styledComponentsTransformer = createStyledComponentsTransformer({
  getDisplayName: (filename, bindingName) => {
    const name = path.basename(filename).split('.')[0];
    return `${name}_${bindingName || ''}`;
  },
});

/**
 * @param {any[]} array
 */
const compact =
  /**
   * @param {any} x
   */
  array => array.filter(x => x);

module.exports = {
  name: 'client',
  target: 'web',
  mode: 'development',

  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
  },
  entry: {
    app: [getEntry()],
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
