const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    'index': [path.resolve('./src/javascripts/entry.js')]
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./dist')
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postLoaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        oneOf: [
          // vueから呼ばれる場合
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          // その他（htmlWebpackPluginからとか）
          {
            use: [{
              loader: 'pug-loader',
              options: {
                pretty: true
              }
            }]
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new StyleLintPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('./src/html/index.pug'),
      hash: true,
      inject: true
    }),
    new VueLoaderPlugin()
  ]
};
