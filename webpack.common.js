const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/SentryWorkflow.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
            options: {
              transpileOnly: false
            }
        }],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    // filename: 'sentry-workflow.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new CleanWebpackPlugin('./dist'),
  ]
};