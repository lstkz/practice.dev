import webpack from 'webpack';
import Server from 'webpack-dev-server';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';
import Path from 'path';
import { getChallengeRoots } from '../helper';

const styledComponentsTransformer = createStyledComponentsTransformer({
  getDisplayName: (filename: string, bindingName: string) => {
    const name = Path.basename(filename).split('.')[0];
    return `${name}_${bindingName || ''}`;
  },
});

export interface BuildSourcesOptions {
  basedir: string;
  type: 'challenge' | 'projects';
  projectId?: number;
  challengeId: number;
}

function createEntry(basedir: string, componentPath: string) {
  fs.writeFileSync(
    Path.join(basedir, 'demo-entry.tsx'),
    `
import { Details } from '${componentPath}';

render(Details);

if (module.hot) {
  module.hot.accept('${componentPath}', () => {
    render(require('${componentPath}').Details);
  });
}

  `
  );
}

export async function demo(options: BuildSourcesOptions) {
  const { basedir, type, challengeId } = options;

  if (type === 'challenge') {
    const roots = getChallengeRoots(basedir);
    for (const name of roots) {
      const exec = /^\d+/.exec(name);
      if (exec && Number(exec[0]) === challengeId) {
        const componentPath = `./${name}/details/demo.tsx`;
        createEntry(basedir, componentPath);
        break;
      }
    }
  } else {
    throw new Error('todo');
  }

  const webpackConfig = webpack({
    context: basedir,
    name: 'client',
    target: 'web',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    },
    entry: {
      app: ['./demo-entry.tsx'],
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
    stats: 'errors-only',
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
      libraryTarget: 'var',
      path: Path.join(__dirname, './dist'),
      publicPath: '/',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new HtmlWebpackPlugin({
        template: Path.join(__dirname, './index.ejs'),
        hash: false,
        filename: 'index.html',
        inject: false,
        minify: {
          collapseWhitespace: false,
        },
        title: 'Demo',
      }),
      new webpack.HotModuleReplacementPlugin(),
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
  });
  const server = new Server(webpackConfig, {
    hot: true,
    contentBase: './dist',
    quiet: true,
  });
  const port = Number(process.env.PORT || 8011);
  server.listen(port, '0.0.0.0', err => {
    if (err) {
      throw err;
    }
    console.log(`listening on http://localhost:${port}`);
  });
}
