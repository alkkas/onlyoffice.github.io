const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const port = process.env.PORT || 3000

module.exports = merge(common, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    host: 'localhost',
    static: './dist',
    port: port,
    historyApiFallback: true,
    open: true,
  },
})
