const path = require('path')
const nodeExternals = require('webpack-node-externals');

// 服务端的webpack
module.exports = {
    // node 环境
    target: 'node',
    mode: 'development',
    // 服务端入口
    entry: './server/index.js',
    // 规避 node 层面 node_modules 的一些代码
    externals: [nodeExternals()],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
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
            },
            {
                test: /\.css$/,
                // 服务端同构 style isomorphic-style-loader
                use: ['isomorphic-style-loader', 'css-loader']
            }
        ]
    }
}