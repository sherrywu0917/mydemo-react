const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
const util = require('./util.js');

//定义地址
const ROOT_PATH = util.ROOT_PATH;
const APP_PATH = util.APP_PATH; //__dirname 中的src目录，以此类推
const BUILD_PATH = util.BUILD_PATH; //发布文件所存放的目录

const baseConfig = require('./base.js');

for (var prop in baseConfig.entry) {
    [].concat(baseConfig.entry[prop]).unshift(
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
    );
}

module.exports = webpackMerge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            //process.argv：当前进程的命令行参数数组。
            //process.env：指向当前shell的环境变量，比如process.env.HOME。
            'process.env': {
                NODE_ENV: JSON.stringify('development') //定义编译环境
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({filename: 'css/[name].css'}),
        new webpack.optimize.CommonsChunkPlugin({name: "common", filename: "js/common.bundle.js"}),

    ]
});
