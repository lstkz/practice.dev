import webpack from 'webpack';
import Path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { getEntryForChallenges, execWebpack, getWebpackModule } from './helper';

export interface BuildSourcesOptions {
  basedir: string;
  type: 'challenge' | 'projects';
}

export async function buildSources(options: BuildSourcesOptions) {
  const { basedir } = options;
  const detailsDir = Path.join(basedir, 'dist/details');

  await execWebpack({
    context: basedir,
    name: 'client',
    target: 'web',
    mode: 'production',
    devtool: false,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    },
    entry: getEntryForChallenges(basedir, 'details'),
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
      path: detailsDir,
      publicPath: '/',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
    module: getWebpackModule(),
  });
}
