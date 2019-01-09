const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const util = require('./util.js');

const isProduction = util.isProduction;
//定义地址
const ROOT_PATH = util.ROOT_PATH;
const APP_PATH = util.APP_PATH; //__dirname 中的src目录，以此类推
const BUILD_PATH = util.BUILD_PATH; //发布文件所存放的目录

var output = {
    publicPath: '/dist', //编译好的文件，在服务器的路径,域名会自动添加到前面
    path: BUILD_PATH, //编译到当前目录
    filename: '[name].bundle.js', //编译后的文件名字
    library: '[name]'
}

var plugins = [
    new webpack.DllPlugin({
        path: path.resolve(BUILD_PATH, '[name]-manifest.json'),
        name: '[name]',
        context: ROOT_PATH
    }),
    new CleanWebpackPlugin(['dist'], {
        root: path.resolve(ROOT_PATH, '..'),
        verbose: true,
        dry: false,
    }),
    function () { //stats记录了打包信息和相应的hash值，参考http://www.weicon9.com/2016/11/Loading-Webpack-Bundles-With-Hash-Value/
        this.plugin('done', function (stats) {
           var htmlPath = path.resolve(ROOT_PATH, 'template/temp.html');
           var htmlContent = fs.readFileSync(htmlPath, 'utf8');
           var htmlOutput = htmlContent.replace(/vendor(.*?)\.js/g, stats.toJson().assetsByChunkName['vendor']);
           fs.writeFileSync(htmlPath, htmlOutput);
        });
    }
    // new BundleAnalyzerPlugin(),
];

if(isProduction) {
    output.filename = '[name]-[chunkhash:8].bundle.js'

    plugins = plugins.concat([
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          output: {
            comments: false
          },
          compress: {
            warnings: false,
          }
        })
    ]);
}

module.exports = {
    entry: {
      vendor: [
            // "preact",
            // 'preact-compat',
            "react",
            'react-dom',
      ]
    },
    output: output,
    plugins: plugins
}
