const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/cases", to: "cases" },
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    ]
  }
};
