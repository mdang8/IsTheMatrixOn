const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/client'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './src/client/build')
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /(\.css|.scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jsx|js)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['react', 'es2015']
            }
          }
        ]
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          limit: 8000,
          name: '/src/client/images/[name].[ext]'
        }
      }
    ],
  }
};
