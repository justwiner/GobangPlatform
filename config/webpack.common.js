const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const theme = require('../package.json').theme;

module.exports = {
    entry: {
        app: './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),   //根目录
            verbose:  true,        　　　　　　　　　//开启在控制台输出信息
        }),
        new HtmlWebpackPlugin({
            title: 'React Webpack',
            filename: 'index.html',
            template: path.join(__dirname, '../template/index.html')
        }),
        new HtmlWebpackPlugin({
            filename: 'favicon.ico',
            template: path.join(__dirname, '../template/favicon.ico')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    },
    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.join(__dirname, '../src')
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                      ident: 'postcss',
                      plugins: [
                        require('postcss-cssnext')(),
                        require('cssnano')(),
                        require('postcss-pxtorem')({
                          rootValue: 100,
                          propWhiteList: []
                        })
                      ]
                    }
                }
            ]
        },{
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                      ident: 'postcss',
                      plugins: [
                        require('postcss-cssnext')(),
                        require('cssnano')(),
                        require('postcss-pxtorem')({
                          rootValue: 100,
                          propWhiteList: []
                        })
                      ]
                    }
                },
                {loader: 'less-loader', options: {modifyVars: theme}}
            ],
            include: /node_modules/,
        },{
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                      ident: 'postcss',
                      plugins: [
                        require('postcss-cssnext')(),
                        require('cssnano')(),
                        require('postcss-pxtorem')({
                          rootValue: 100,
                          propWhiteList: []
                        })
                      ]
                    }
                },'sass-loader']
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            use: [{
                loader: 'file-loader'
            }]
        }]
    }
};