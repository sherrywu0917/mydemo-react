const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
const HtmlWebpackPlugin = require('html-webpack-plugin');
const util = require('./util.js');

const isProduction = util.isProduction;
//定义地址
const ROOT_PATH = util.ROOT_PATH;
const APP_PATH = util.APP_PATH; //__dirname 中的src目录，以此类推
const BUILD_PATH = util.BUILD_PATH; //发布文件所存放的目录

function resolveWebpackEntry() {
    var base = path.resolve(APP_PATH, 'entry');
    return util.getEntryPoints().reduce(function(obj, file) {
        obj[file] = path.join(base, file + '.jsx');
        return obj;
    }, {});
}

function getMultiHtmlWebpackPlugin() {
    var titleMap = util.titleMap;
    var viewportMap = util.viewportMap;
    return util.getEntryPoints().map(function(item) {
        var option = {
            inject: false,
            chunks: [item, 'common'],
            template: path.resolve(ROOT_PATH, 'template/temp.html'),
            filename: path.resolve(BUILD_PATH, 'views/' + item + '.html'),
            key: item,
            title: titleMap[item] || '',
            showVconsole: ['index'].indexOf(item) > -1,  //是否显示VConsole
            // minify: isProduction && {    //压缩HTML文件
            //     removeComments:true,    //移除HTML中的注释
            //     collapseWhitespace:true    //删除空白符与换行符
            // }
        }
        viewportMap[item] && (option.viewport = true);
        return (new HtmlWebpackPlugin(option))
    })
}

var rules = [{
    test: /\.(js|jsx)$/,
    include: APP_PATH,
    use: isProduction ? ['babel-loader'] : ['babel-loader', 'eslint-loader']
}, {
    test: /\.css$/,
    include: APP_PATH,
    use: ExtractTextPlugin.extract({
        fallback: 'style',
        use: [{ loader: 'css', options: { minimize: isProduction } }, { loader: 'autoprefixer' }]
    })
}, {
    //     test: /\.css$/,
    //     include: path.resolve(ROOT_PATH, 'node_modules/common-modules'),
    //     use: ExtractTextPlugin.extract({
    //         fallback: 'style',
    //         use: [{
    //             loader: 'css',
    //             options: {
    //                 modules: true,
    //                 camelCase: true,
    //                 minimize: isProduction,
    //                 localIdentName: '[path][name]__[local]--[hash:base64:5]'
    //             }}]
    //     })
    // }, {
    test: /\.s?css$/,
    //include: APP_PATH,
    use: ExtractTextPlugin.extract({
        fallback: 'style',
        use: [{ loader: 'css', options: { minimize: isProduction } },
            {
                loader: 'postcss',
                options: {
                    plugins: function() {
                        return [
                            require('autoprefixer')
                        ];
                    }
                }
            },
            { loader: 'sass' }
        ]
    })
}, {
    test: /\.(png|jpg|gif)$/,
    include: APP_PATH,
    use: isProduction ? [{
        loader: 'url-loader',
        options: {
            limit: 8192,
            name: 'image/[hash:8].[name].[ext]'
        }
    }, {
        loader: 'image-webpack-loader',
        options: {
            mozjpeg: {
                progressive: true,
                quality: 65
            },
            pngquant: {
                quality: '65-90',
                speed: 3
            }
        }
    }] : [{
        loader: 'url-loader',
        options: {
            limit: 8192,
            name: 'image/[hash:8].[name].[ext]'
        }
    }]
    //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图，都启用hash，可以防止同名图片
}]

module.exports = {
    entry: resolveWebpackEntry(),
    output: {
        publicPath: '/dist/', //编译好的文件，在服务器的路径,域名会自动添加到前面
        path: BUILD_PATH, //编译到当前目录
        filename: 'js/[name].js', //编译后的文件名字
        chunkFilename: 'js/[name].js',
        hashDigestLength: 8
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.scss', '.css'],//后缀名自动补全
        enforceExtension: false,
        alias: {
            '@': APP_PATH,
            // 'react': 'preact-compat',
            // 'react-dom': 'preact-compat'
        },
        modules: [
            path.resolve(ROOT_PATH, 'src/component'),
            path.resolve(ROOT_PATH, 'src/style'),
            path.resolve(ROOT_PATH, 'src/util'),
            path.resolve(ROOT_PATH, "node_modules")
        ]
    },
    resolveLoader: {
        moduleExtensions: ["-loader"]
    },
    module: {
        rules: rules
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(BUILD_PATH, 'vendor-manifest.json'),
            context: ROOT_PATH
        })
    ].concat(getMultiHtmlWebpackPlugin())
};
