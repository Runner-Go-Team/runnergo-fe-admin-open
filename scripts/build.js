const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config');

const mode = process?.env?.NODE_ENV || 'production';
const webpackConfig = {
  entry: {
    index: path.resolve(__dirname, '../src/index.jsx'),
    vendors: ['react', 'classnames'],
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name]-[contenthash:8].js',
    publicPath: '/',
    clean: true,
  },
  mode,
  // devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      publicPath: '.',
      title: 'Apipost-基于协作，不止于API文档、调试、Mock、自动化测试',
      filename: path.resolve(__dirname, '../build/index.html'),
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, '../public'), to: '../build' }],
    }),
  ],
};

module.exports = merge(webpackConfig, common);
