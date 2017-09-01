const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
  entry: [
    path.join(__dirname, './src'),
  ],
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'dist/index.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [],
  resolve: {
    extensions: ['.js'],
  },
  target: 'node',
  externals: [nodeExternals({
    //whitelist: ['query-string'],
  })],
};
