const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? './'
  : '/',

  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://api.fang.ddnd.cn',
  //       // ws : true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   },
  //   port: 80,
  //   disableHostCheck: true,
  // },
  configureWebpack: {
    // module同目录加上此配置，打包的时候忽略这些
    externals: {
      "BMap": "BMap",
      // "vue": "vue",
      // "vue-router": "vue-router",
      // 'axios': 'axios',
      // 'element-ui': 'element-ui',
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      
      // 下面是下载的插件的配置
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5, 
        minChunkSize: 100
      })
    ]
  },
}