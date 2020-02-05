module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? './'
  : '/',
  
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        // ws : true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    port: 80,
    disableHostCheck: true,
  },
  configureWebpack: {
    externals: {
      "BMap": "BMap"
    }
  },
}