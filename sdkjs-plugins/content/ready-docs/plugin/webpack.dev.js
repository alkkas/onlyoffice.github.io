const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const port = process.env.PORT || 5000

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    hot: true,
    host: 'localhost',
    static: './dist',
    port: port,
    historyApiFallback: true,
    open: true,
  },

  plugins: [new ReactRefreshPlugin()],
})
