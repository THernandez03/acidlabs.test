import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

import { __PROD__, __STAGE__, __LOCAL__ } from './envs';
import { __TARGET__, __NODE__ } from './targets';
import { __SERVER__, __APP__ } from './types';
import { assets, url } from './globals';

const [, port = 4000] = /:([0-9]+)/gim.exec(assets) || [];
export { port };

const config = {
  target: __TARGET__,
  node: { fs: __NODE__ },
  entry: {},
  watch: __LOCAL__,
  externals: (__NODE__) ? ['debug', nodeExternals()] : [],
  resolve: { extensions: ['.js', '.jsx'] },
  output: {
    filename: '[name].js',
    publicPath: `${assets}/`,
  },
  module: {
    strictThisContextOnImports: true,
    rules: [{
      use: [{
        loader: 'babel-loader',
        options: { cacheDirectory: false },
      }],
      test: /\.jsx?$/,
      exclude: /node_modules/,
    }, {
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          hash: 'sha512',
          digest: 'hex',
          name: '[name]-[hash].[ext]',
        },
      }],
      test: /\.(png|gif|jpe?g|webp|woff2?|ttf|eot|otf|mp4|webm|wav|mp3|m4a|aac|3gp|og[av])(\?.*)?$/i,
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.ProvidePlugin({
      fetch: 'fetch-everywhere',
      FormData: 'isomorphic-form-data',
    }),
  ],
};

if(__PROD__ || __STAGE__){
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.UglifyJsPlugin(),
  ];
}

({
  [__SERVER__]: () => {
    config.entry.main = './private/server/entry.js';
    config.output.path = path.resolve(process.cwd(), './public/server/');
  },
  [__APP__]: () => {
    config.entry.main = './private/app/entry.js';
    config.output.path = path.resolve(process.cwd(), './public/app/');
    config.plugins = [
      ...config.plugins,
      new HtmlWebpackPlugin({
        filename: '../server/views/index.html',
        template: './private/app/views/index.ejs',
        inject: true,
        hash: true,
        cache: true,
        xhtml: true,
        alwaysWriteToDisk: true,
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          html5: true,
          ignoreCustomComments: [],
          ignoreCustomFragments: [/<%=?.*?%>/],
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
        },
        data: {
          title: 'Acid Labs - Test',
          description: '',
          keywords: '',
          siteName: 'acid.cl',
          color: '#39b549',
          image: '',
          assets,
          url,
        },
      }),
      new FaviconsWebpackPlugin({
        logo: './private/app/assets/favicon.png',
        tatsFilename: 'stats-[hash].json',
        prefix: 'favicons/',
        persistentCache: true,
        inject: true,
        background: 'transparent',
        title: 'Acid Labs - Test',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          favicons: true,
          firefox: true,
          twitter: true,
        },
      }),
      new HtmlWebpackHarddiskPlugin(),
      new PreloadWebpackPlugin({
        rel: 'prefetch',
        as: 'script',
        include: 'all',
      }),
    ];
    if(__LOCAL__){
      config.devtool = 'eval';
      config.module.rules[0].use = [{
        loader: 'react-hot-loader/webpack',
      }, ...config.module.rules[0].use];
      config.plugins = [
        ...config.plugins,
        new webpack.LoaderOptionsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
      ];
      config.entry = [
        'react-hot-loader/patch',
        `webpack-dev-server/client?${assets}`,
        'webpack/hot/only-dev-server',
        config.entry.main,
      ];
    }
  },
}).true();

export { config };
