import Path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { getEntryForChallenges, execWebpack, getWebpackModule } from './helper';

export interface BuildTestsOptions {
  basedir: string;
  type: 'challenge' | 'projects';
}

export async function buildTests(options: BuildTestsOptions) {
  const { basedir } = options;
  const testsDir = Path.join(basedir, 'dist/tests');

  await execWebpack({
    context: basedir,
    name: 'client',
    target: 'node',
    mode: 'development',
    devtool: false,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    },
    entry: getEntryForChallenges(basedir, 'tests'),
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs',
      path: testsDir,
      publicPath: '/',
    },
    plugins: [new CleanWebpackPlugin()],
    module: getWebpackModule(),
  });
}
