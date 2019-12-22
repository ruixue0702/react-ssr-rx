// 这里的 node 代码，会用 babel 处理
import path from 'path'
import fs from 'fs' // 文件系统
import React from 'react'
// react-dom/server 中的 api renderToString 把 react 组件解析成 html
import { renderToString } from 'react-dom/server'
// node server
import express from 'express'
import { StaticRouter, matchPath, Route, Switch } from 'react-router-dom'
// Switch: 只渲染第一个匹配到的<路由组件>或<重定向组件>
import { Provider } from 'react-redux'
// import store from '../src/store/store'
import { getServerStore } from '../src/store/store'
import { http } from '../src/utils/axios'

// import App from '../src/App'
import routes from '../src/App'
import Header from '../src/component/Header'
import proxy from 'http-proxy-middleware'
const store = getServerStore()

const app = express()
// 设置静态资源目录
app.use(express.static('public'))
// 服务端添加代理到 http://localhost:9090
// const mockPath = "http://localhost:9090";
// const option = {
//      target: mockPath,
//      changeOrigin: true,
//      ws: true
// };
// app.get('/api/*', proxy(option))
app.use(
    '/api',
    proxy({ target: 'http://localhost:9090', changeOrigin: true })
)

// csr 渲染
function csrRender(res) {
    // 读取 csr 文件 返回
    const filename = path.resolve(process.cwd(), 'public/index.csr.html')
    const html = fs.readFileSync(filename, 'utf-8')
    return res.send(html)
}
// * 在服务端监听所有的路由，以避免404的错误
// app.get('*') 监听所有的路由
app.get('*', (req, res) => {
    // console.log('req.query._mode', req.query._mode)
    if (req.query._mode=='csr') {
        console.log('参数开启 csr 降级')
        // 开启 csr
        return csrRender(res)
    }
    // 配置开关开启 csr

    // 服务器负载过高 开启 csr


    // 获取根据路由渲染出的组件，并且拿到 loadData 方法 获取数据



    // 全局 最简单的写法 面条式代码
    // if (req.url.startsWith('/api/')) {
    //     // 不渲染页面，使用 axios 转发 axios.get
    // }

    // 把 react 组件，解析成 html

    // const Page = <App title="ruixue0702"></App>
    // const content = renderToString(Page)

    // 获取根据路由渲染出的组件，并且拿到 loadData 方法 获取数据
    
    // inside a request 存储网络请求
    const promises = [];
    // use `some` to imitate `<Switch>` behavior of selecting only
    // the first to match

    // routes.some 判定当前组件，先匹配到每个路由，
    // 再通过 matchPath 来匹配当前路由和req.path 是否匹配
    // 如果匹配 就要把route.loadData的数据返回
    routes.some(route => {
        const match = matchPath(req.path, route)
        if (match) {
            const { loadData } = route.component
            if (loadData) {
                // 包装后
                // 规避报错 可以考虑加日志
                const promise = new Promise((resolve, reject) => {
                    loadData(store).then(resolve).catch((err) => {
                        console.log(`${req.path} err`)
                        resolve
                    })
                })
                promises.push(promise)
                // promises.push(loadData(store))
            }
        }
    })
    // 接口报错降级处理
    // promise 接口容错处理 
    // Promise.all(promises.map(promise => {return promiseCatch(promise)}))
    // const promiseCatch = (promise) => {
    //     promise.catch( err => {
    //         console.log('promise.catch err', err)
    //     })
    // }

    // 等待所有网络请求结束再渲染
    // 这里的app 已经不是组件了，而是一个函数
    // Promise.allSettled(promises)  Promise.allSettled 新的API  node babel 环境中才可使用
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
    Promise.all(promises).then(() => {
        const context = {
            css: []
        }
    // Promise.all(promises.map(promise => {
    //     return promiseCatch(promise)
    // })).then(() => {
        // 渲染逻辑放到promise.all内执行
        const content = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <Header/>
                    <Switch>
                        {routes.map(route => <Route {...route}></Route>)}
                    </Switch>
                </StaticRouter>
            </Provider>
        )
        const css = context.css.join('\n')
        // 字符串模板
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>REACT SSR1</title>
                    <style>
                        ${css}
                    </style>
                </head>
                <body>
                    <div id="root">${content}</div>
                    <script>
                        window.__context=${JSON.stringify(store.getState())}
                    </script>
                    <script src="/bundle.js"></script>
                </body>
            </html>
        `)
    })
    .catch(() => {
        res.send(`500 Internal Server Error`)
    })
})
app.listen(9093,()=>{
    console.log('ssr listen', '监听完毕')
})