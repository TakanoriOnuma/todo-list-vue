const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'production',
  output: {
    // HTMLにinjectionするパスを相対パスで設定する
    publicPath: './'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
});

config.module.rules.push({
  test: /\.(sass|scss)$/,
  use: [
    // CSSをextractする
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        url: false,
        // 0 => no loaders (default);
        // 1 => postcss-loader;
        // 2 => postcss-loader, sass-loader
        importLoaders: 2
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          autoprefixer({
            browsers: [
              'last 2 version',
              'IE 11'
            ]
          }),
          cssnano()
        ]
      }
    },
    {
      loader: 'sass-loader',
      options: {
        includePaths: [path.resolve('./node_modules/')]
      }
    }
  ]
});

module.exports = config;
