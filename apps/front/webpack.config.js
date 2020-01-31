const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dotenv = require('dotenv');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;

const __DEV__ = process.env.NODE_ENV === 'development';

const title = 'Practice.dev';

dotenv.config({
  path: '../../.env',
});

const styledComponentsTransformer = createStyledComponentsTransformer({
  getDisplayName: (filename, bindingName) => {
    const name = path.basename(filename).split('.')[0];
    return `${name}_${bindingName || ''}`;
  },
});

module.exports = {
  name: 'client',
  target: 'web',
  mode: __DEV__ ? 'development' : 'production',
  entry: {
    app: './src/main.tsx',
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true,
    stats: 'errors-only',
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    alias: {
      src: path.join(__dirname, './src'),
    },
  },
  optimization: __DEV__
    ? {
        // minimize: false,
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    : undefined,
  // optimization: {
  //   namedModules: true,
  //   namedChunks: true,
  //   splitChunks: { cacheGroups: { default: false } },
  // },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.join(__dirname, './build'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: __dirname,
      verbose: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.ejs'),
      hash: false,
      filename: 'index.html',
      inject: false,
      minify: {
        collapseWhitespace: false,
      },
      title,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        GITHUB_CLIENT_ID: JSON.stringify(process.env.GITHUB_CLIENT_ID),
        GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID),
        API_URL: JSON.stringify(
          process.env.API_URL || 'http://localhost:3100/api'
        ),
        BUNDLE_BASE_URL: JSON.stringify(
          process.env.BUNDLE_BASE_URL || 'http://localhost:3000/'
        ),
      },
    }),
    // new BundleAnalyzerPlugin(),
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
              getCustomTransformers: () => ({
                before: [styledComponentsTransformer],
              }),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // {
      //   test: /\.m?js$/,
      //   exclude: /(node_modules)/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       plugins: [
      //         [
      //           'babel-plugin-styled-components',
      //           {
      //             ssr: false,
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};
