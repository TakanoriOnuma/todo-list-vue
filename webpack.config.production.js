const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].css'
    })
  ]
});

config.module.rules.push({
  test: /\.(sass|scss)$/,
  use: [
    MiniCSSExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        url: false,
        minimize: true
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
          })
        ]
      }
    },
    {
      loader: 'sass-loader',
      options: {
        includePaths: [__dirname + '/node_modules/']
      }
    }
  ]
});

module.exports = config;
