const MiniCssExtract = require("mini-css-extract-plugin");
const FixStyleOnlyEntries = require("webpack-fix-style-only-entries");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const files = {
  script: './src/es/main.js',
  style: './src/scss/main.scss',
}

module.exports = [{
  mode: 'development',
  devtool: 'source-map',
  entry: files,
  output: {
    path: `${__dirname}/docs`,
    filename: 'js/[name].js',
  },
  module: {
    rules: [{
      test: /\.pug$/,
      use: {
        loader: "pug-loader",
        options: {
          pretty: true
        }
      },
    },{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: './babel.config.json',
        }
      }]
    }, {
      test: /\.scss$/,
      use: [
        MiniCssExtract.loader,
        {
          loader: "css-loader",
          options: {
            url: false,
          }
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            postcssOptions:{
              plugins: [
                ["autoprefixer", { grid: true }],
              ],
            },
          },
        },
        "sass-loader",
      ]
    }]
  },
  plugins: [
    new FixStyleOnlyEntries(),
    new MiniCssExtract({
      filename: "css/[name].css"
    }),
    new HtmlWebpackPlugin({
      template: "src/pug/main.pug",
      filename: "index.html",
      inject: false,
      minify: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${__dirname}/src/image/*`,
          to: `${__dirname}/docs`,
          context: `${__dirname}/src`,
        },
        {
          from: `${__dirname}/src/json/*.json`,
          to: `${__dirname}/docs`,
          context: `${__dirname}/src`,
        },
      ],
    }),
  ]
}, {
  mode: 'production',
  entry: files,
  output: {
    path: `${__dirname}/docs`,
    filename: 'js/[name].min.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: './babel.config.json',
        }
      }]
    }, {
      test: /\.scss$/,
      use: [
        MiniCssExtract.loader,
        {
          loader: "css-loader",
          options: {
            url: false,
          }
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            postcssOptions:{
              plugins: [
                ["autoprefixer", { grid: true }],
              ],
            },
          },
        },
        "sass-loader",
      ]
    }]
  },
  plugins: [
    new FixStyleOnlyEntries(),
    new MiniCssExtract({
      filename: "css/[name].min.css"
    }),
  ]
}];
