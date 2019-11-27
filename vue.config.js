// const cdn = {
//   // 开发环境
//   dev: {
//     css: [
//       'https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css',
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css',
//     ],
//     js: [
//       'https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js',
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/line.min.js',
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/histogram.min.js',
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/pie.min.js',
//
//       'https://cdn.bootcss.com/element-ui/2.12.0/index.js',
//
//       'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
//       'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
//       'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
//       'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js'
//     ]
//   },
//   // 生产环境
//   build: {
//     css: [
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css',
//
//       'https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css'
//     ],
//     js: [
//       'https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js',
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/line.min.js',
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/histogram.min.js',
//       'https://cdn.jsdelivr.net/npm/v-charts/lib/pie.min.js',
//
//       'https://cdn.bootcss.com/element-ui/2.12.0/index.js'
//     ]
//   }
// }
//
// cdn预加载使用
// const externals = {
//   'vue': 'Vue',
//   'vue-router': 'VueRouter',
//   'router': 'router',
//   'vuex': 'Vuex',
//   'axios': 'axios',
//   'element-ui': 'Element',
// }

module.exports = {
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');

    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    // config.plugin('html').tap(args => {
    //   if (process.env.NODE_ENV === 'production') {
    //     args[0].cdn = cdn.build
    //   }
    //   if (process.env.NODE_ENV === 'development') {
    //     args[0].cdn = cdn.dev
    //   }
    //   return args
    // })
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
  },

  // 代码压缩配置
  configureWebpack: config => {
    let myConfig = {}

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.plugins.push(
          //生产环境自动删除console
          // new UglifyJsPlugin({
          //   uglifyOptions: {
          //     compress: {
          //       warnings: false,
          //       drop_debugger: true,
          //       drop_console: true,
          //     },
          //   },
          //   sourceMap: false,
          //   parallel: true,
          // })
      );

      // myConfig.externals = externals
    }
    // return myConfig
  },
};
