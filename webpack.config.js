const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === "development"

const config = {
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist/')
    },
    module: {
        rules: [
            { test: /\.vue$/, use: 'vue-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.less$/, use: ['style-loader', {
                    loader: 'css-laoder', options: {
                        modules: true,
                    },
                }, "less-loader"]
            },
            { test: /\.jsx/, use: ["babel-loader"] },
            { test: /\.(gif|jpg|jpeg|png|svg)$/, use: [{ loader: 'url-loader', options: { limit: 1024, name: '[name]-wenmu.[ext]' } }] }
        ]
    },
    plugins: [
        // 定义在js中可以访问的全局变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLWebpackPlugin()
    ]
}

if (isDev) {
    config.devtool = "#cheap-module-eval-source-map";
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        hot: true
    }
}

module.exports = config;