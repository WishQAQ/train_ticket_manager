module.exports = {
  publicPath: '/',
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      "/api": {
        target: "http://oa.huimin.dev.cq1080.com/",
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启跨域
        pathRewrite: {
          '^/api': '/'
        }
      },
    },
  }
};