const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new UglifyJSPlugin()
    ],
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: './'
    },
});