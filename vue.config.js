// 去除console
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 压缩css、js
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 要压缩的文件
const productionGzipExtensions = ['js', 'css'];
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const env = process.env.NODE_ENV;

module.exports = {
  // 针对请求数进行优化
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');
  },
  // 代码压缩 console移除
  configureWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
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
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    disableHostCheck:true,
    proxy: 'http://oa.huimin.dev.cq1080.com',
    // changeOrigin: true,
    // overlay: {
    //   errors: true,
    //   warnings: true
    // }
  }
}
