//项目域名地址
const url = 'http://oa.huimin.dev.cq1080.com';

let ROOT;
if (process.env.NODE_ENV === 'development') {
  ROOT = "/api"
} else {
  //生产环境下的地址
  ROOT = url;
}

exports.PROXYROOT = url;
exports.ROOT = ROOT;