// 这里的 node 代码，会用 babel 处理
import React from 'react'
// react-dom/server 中的 api renderToString 把 react 组件解析成 html
import { renderToString } from 'react-dom/server'
// node server
import express from 'express'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../src/store/store'

import App from '../src/App'

const app = express()
// 设置静态资源目录
app.use(express.static('public'))
// * 在服务端监听所有的路由，以避免404的错误
app.get('*', (req, res) => {
    // const Page = <App title="ruixue0702"></App>
    // 把 react 组件，解析成 html
    // const content = renderToString(Page)
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url}>
                {App}
            </StaticRouter>
        </Provider>
        
    )
    // 字符串模板
    res.send(`
        <html>
            <head>
                <meta charset="utf-8">
                <title>REACT SSR</title>
            </head>
            <body>
                <div id="root">${content}</div>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `)
})
app.listen(9093,()=>{
    console.log('ssr listen')
})