//const sassLintPlugin = require('sasslint-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    'index': ['./src/js/entry.js']
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    publicPath: '/'
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
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
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
    // new sassLintPlugin({
    //   glob: 'src/css/**/*.s?(a|c)ss',
    //   ignorePlugins: ['extract-text-webpack-plugin']
    // }),
    new htmlWebpackPlugin({
      template: 'src/html/index.pug',
      inject: false
    }),
    new VueLoaderPlugin()
  ]
};
