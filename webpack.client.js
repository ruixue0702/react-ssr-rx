const path = require('path')
// npm install html-webpack-plugin --D
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 客户端的webpack
module.exports = {
    mode: 'development',
    // 客户端入口
    entry: './client/index.js',
    // 客户端输出
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    // 
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.csr.html',
            template: 'src/index.csr.html',
            inject: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                // 支持 import 支持 JSX   loader: 'babel-loader'
                loader: 'babel-loader',
                exclude: /node_modules/,
                // babel 配置 options
                options: {
                    presets: ['@babel/preset-react', ['@babel/preset-env']]
                }
            },
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'],
                // css模块化
                // loader: "style-loader!css-loader?modules"
                // loader: "style-loader!css-loader?modules&localIdentName=[name]__[local]!sass?sourceMap=true"
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }]
            }
        ]
    }
}