const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
const util = require('./util.js');

const baseConfig = require('./base.js');

module.exports = webpackMerge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    // devtool: 'source-map',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({filename: 'css/[name].css', allChunks: true }),
        new webpack.optimize.CommonsChunkPlugin({name: "common", filename: "js/common.bundle.js"})
        // new BundleAnalyzerPlugin()
    ]
});
