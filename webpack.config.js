const path = require('path');

module.exports = {
  entry: './src/sdate.js',
  output: {
    path: path.resolve('dist'),
    filename: 'sdate.min.js',
    libraryTarget: 'umd',
    library: 'sdate',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },
};
