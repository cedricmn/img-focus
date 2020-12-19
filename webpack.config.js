"use strict";

const webpack = require("webpack");
const path = require("path");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

let config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "img-focus.js",
    iife: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader",
            options: {
              emitError: true,
              emitWarning: true,
              failOnWarning: true,
              failOnError: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "css-hot-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader?exportAsEs6Default",
            options: {
              minimize: true,
            },
          },
          {
            loader: "htmlhint-loader",
            options: {
              configFile: ".htmlhintrc",
              failOnError: true,
              failOnWarning: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new StyleLintPlugin({
      failOnError: false,
      files: "**/*.less",
      syntax: "less",
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    historyApiFallback: true,
    hot: true,
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  devtool: "source-map",
};

module.exports = config;
