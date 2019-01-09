const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const util = require('./util.js');
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// var lodash = require('lodash')
// lodash.templateSettings.interpolate = /<%=([\s\S]+?)%>/g//设置模板变量匹配变量

const ROOT_PATH = util.ROOT_PATH;

const baseConfig = require('./base.js');

module.exports = webpackMerge(baseConfig, {
    output: {
        filename: 'js/[name]-[chunkhash:8].js',
        chunkFilename: 'js/[name]-[chunkhash:8].js'
    },
    performance: {
        hints: "warning", // 枚举
        maxAssetSize: 100000, // 入口起点的最大体积:整数类型（以字节为单位）
        maxEntrypointSize: 100000, // webpack生成的任何文件:整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
          // 提供资源文件名的断言函数
          return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist/js', 'dist/css', 'dist/image'], {
            root: ROOT_PATH,
            verbose: true,
            dry: false,
            //exclude: ['shared.js']
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            // 最紧凑的输出
            beautify: false,
            output: {
                comments: false, // remove all comments （移除所有注释）
            },
            compress: {          // 压缩
                warnings: false,
                // 删除所有的 `console` 语句
                drop_console: true
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(), //Scope Hoisting
        new webpack.HashedModuleIdsPlugin(), //固化 module id
        new webpack.NamedChunksPlugin(), //固化 runtime 内以及在使用动态加载时分离出的 chunk 的 chunk id
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "js/common-[chunkhash:8].bundle.js",
            children: false,
            minChunks: (module, count) => {
                if(module.resource && (/^.*\.(css|scss)$/).test(module.resource) && count >= 6) {
                    return true;
                }
                return module.resource && /node_modules|src\/util/.test(module.resource) && count >= 3;
            }
        }),
       // new webpack.optimize.CommonsChunkPlugin({
       //    name: 'manifest',
       //    minChunks: Infinity,
       //  }),
       //  new InlineManifestWebpackPlugin(),
        new ExtractTextPlugin({filename: 'css/[name]-[contenthash:8].css', allChunks: true}),
        // new BundleAnalyzerPlugin()
        // new CompressionWebpackPlugin({ //gzip 压缩
        //     asset: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: new RegExp(
        //         '\\.(js|css)$'    //压缩 js 与 css
        //     ),
        //     threshold: 10240,
        //     minRatio: 0.8
        // }),
    ]
});
