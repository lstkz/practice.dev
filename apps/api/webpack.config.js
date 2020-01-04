const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  mode: 'none',
  devtool: false,
  entry: path.join(__dirname, './src/lambda/entry.ts'),
  optimization: {
    namedModules: false,
    namedChunks: true,
    nodeEnv: 'production',
    flagIncludedChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    splitChunks: {
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
    },
    noEmitOnErrors: true,
    minimize: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app-lambda.js',
    libraryTarget: 'commonjs',
  },
  externals: [
    function(context, request, callback) {
      if (
        /^aws-sdk|^chrome-aws-lambda|^puppeteer-core|^puppeteer/.test(request)
      ) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.api-build.json'),
          transpileOnly: true,
        },
      },
    ],
  },
};
