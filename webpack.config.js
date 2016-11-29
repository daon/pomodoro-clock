var path = require('path');

var HtmlPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        pomodoro: path.resolve(__dirname, 'src/main.js')
    },  
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        sourceMapFilename: '[name].[hash].map',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style', 'css')
            }
        ]
    },
    plugins: [
        new CleanPlugin([path.resolve(__dirname, 'dist')]),
        new ExtractTextPlugin('[name].[hash].css'),
        new HtmlPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            path: path.resolve(__dirname, 'dist'),
            inject: false
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 9000
    }
}