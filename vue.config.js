// const config = require("./config");
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  devServer: {
    disableHostCheck:true,
    proxy: {
      "/api": {
        target: "http://oa.huimin.dev.cq1080.com/",
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启跨域
        pathRewrite: {
          '^/api': ''
        }
      },
      // [config.ROOT]: {
      //   target: config.PROXYROOT,
      //   ws: true, // 是否启用websockets
      //   changOrigin: true, // 开启跨域
      //   pathRewrite: {
      //     [`^${config.ROOT}`]: ''
      //   }
      // },
    },
    overlay: {
      errors: true,
      warnings: true
    }
  }
};
