const path = require('path');
const fs = require('fs');
const glob = require("glob");

const ROOT_PATH = path.resolve(__dirname, '..');
const APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
const BUILD_PATH = path.resolve(ROOT_PATH, './dist'); //发布文件所存放的目录
const isProduction = process.env.NODE_ENV == 'production';

//生成的html页面标题
var titleMap = {
    index: '首页'
}

//给生成的html页面添加viewport，其他默认不添加，使用rem布局生成的viewport
var viewportMap = {
    // index: true,
}

module.exports = {
    ROOT_PATH: ROOT_PATH,
    APP_PATH: APP_PATH,
    BUILD_PATH: BUILD_PATH,
    isProduction: isProduction,
    titleMap: titleMap,
    viewportMap: viewportMap,
    getEntryPoints: function() {
        var base = path.resolve(APP_PATH, 'entry');
        return glob.sync("**/*.jsx", { cwd: base }).map(function(file) {
            return file.split('.')[0];
        });
    }
}
