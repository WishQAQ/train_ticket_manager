module.exports = {
  chainWebpack: config =>{
    config.plugins.delete('prefetch')
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: false,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  devServer: {
    disableHostCheck:true,
    proxy: {
      "/api": {
        target: "http://oa.huimin.dev.cq1080.com",
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启跨域
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    overlay: {
      errors: true,
      warnings: true
    }
  }
};
