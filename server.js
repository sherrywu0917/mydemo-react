var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser());
var dataJson = require('./mock.json');

app.use(express.static(__dirname))

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/template/index.html')
});

var server = app.listen(8088, function () {
	console.log('正常打开8088端口');
})
