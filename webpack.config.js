import StyleLintPlugin from "stylelint-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

export default () => {
  const config = {
    entry: "./src/index.js",
    output: {
      filename: "img-focus.js",
      iife: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          resolve: {
            fullySpecified: false,
          },
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
              loader: "html-loader",
              options: {
                minimize: true,
              },
            },
            {
              loader: "htmlhint-loader",
              options: {
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
        failOnError: true,
        failOnWarning: true,
        files: "**/*.less",
        customSyntax: "postcss-less",
      }),
      new ESLintPlugin({
        emitError: true,
        emitWarning: true,
        failOnWarning: true,
        failOnError: true,
      }),
    ],
    optimization: {
      minimizer: [new TerserPlugin()],
    },
    resolve: { fallback: { url: false } },
  };

  if (process.env.NODE_ENV === "development") {
    config.devtool = "source-map";
  }

  return config;
};
