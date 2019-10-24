module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://oa.huimin.dev.cq1080.com/",
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
