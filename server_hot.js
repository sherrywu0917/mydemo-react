var webpack = require('webpack');
var express = require('express');
// var bodyParser = require('body-parser');
// var bs = require('browser-sync').create();
var fs = require('fs');
var path = require('path');
var app = express();

var config = require('./config/hot');
var compiler = webpack(config);

// 创建 application/x-www-form-urlencoded 编码解析
// var urlencodedParser = bodyParser.urlencoded({ extended: true });
// app.use(bodyParser());

var proxyMiddleware = require('http-proxy-middleware')
var proxyTable = ['/']

app.use(require('webpack-dev-middleware')(compiler, {
	publicPath: config.output.publicPath,
	hot: true,
	historyApiFallback: true,
	inline: true,
	progress: false,
	stats: {
	   colors: true
	},
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(function (req, res, next) {
  let data = {}
  try {
      let content = fs.readFileSync(path.resolve(__dirname, './mock.json'))
      data = JSON.parse(content.toString())
  }   catch (err) {
    console.log(err);
  }
  for (let reg in data) {
      if (isMatch(reg, req.url)) {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          })
          res.end(JSON.stringify(data[reg]))
          console.log(`mock:${req.url}`)
          return
      }
  }
  next()

  function isMatch (reg, url) {
    let res = new RegExp(reg).test(url)
    return res
  }
})

app.use(express.static(path.resolve(__dirname, '..')))
let templateMap = {
    '/search': 'search.html',
    '/search/book': 'search.html',
    '/index': 'index.html',
    '/history': 'history.html',
    '/rank': 'rank.html',
    '/home/more': 'more.html',
    '/category': 'category.html',
    '/info': 'info.html',
    '/detail': 'detail.html',
    '/book/reader': 'reader.html',
    '/recharge': 'recharge.html',
    '/catalog': 'catalog.html',
    '/batchBuy': 'batchBuy.html',
    '/hongbao': 'hongbao.html',
    '/balance': 'balance.html',
    '/qrCode': 'qrCode.html',
    '/singleRecharge': 'singleRecharge.html',
    '/singleQrCodeRecharge': 'singleQrCodeRecharge.html'
}

for (let mapItem in templateMap) {
    app.get(mapItem, function(req, res) {
        res.sendFile(path.resolve(__dirname, '../dist/views/' + templateMap[mapItem]));
    });
}

/**
* 将其他路由，返回服务器端处理
*/
proxyTable.forEach(function (context) {
  var options = { target: 'http://pay.kuxuanbook.yuedu.163.com', headers: {host: 'pay.kuxuanbook.yuedu.163.com'}}
  app.use(proxyMiddleware(context, options))
})

app.listen(3000, function() {
	console.log('正常打开3000端口');
	// 支持多平台更新
    // bs.init({
	// 	open: false,
	// 	ui: false,
	// 	notify: false,
    //  port: 8080,
	// 	proxy: 'localhost:3000',
	// 	files: ['**/*.scss', '**/*.css', '**/*.jsx', '**/*.js', '**/*.html'],
	// });
});
