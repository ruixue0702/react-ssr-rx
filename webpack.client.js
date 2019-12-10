const path = require('path')

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
            }
        ]
    }
}