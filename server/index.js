// 这里的 node 代码，会用 babel 处理
import React from 'react'
// react-dom/server 中的 api renderToString 把 react 组件解析成 html
import { renderToString } from 'react-dom/server'
// node server
import express from 'express'
import { StaticRouter, matchPath, Route } from 'react-router-dom'
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
const mockPath = "http://localhost:9090";
const option = {
     target: mockPath,
     changeOrigin: true,
     ws: true
};
app.get('/api/*', proxy(option))
// * 在服务端监听所有的路由，以避免404的错误
app.get('*', (req, res) => {
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
                promises.push(loadData(store))
            }
        }
    })
    // 接口报错降级处理
    // promise 接口容错处理 
    // Promise.all(promises.map(promise => {return promiseCatch(promise)}))
    const promiseCatch = (promise) => {
        promise.catch( err => {
            console.log('promise.catch err', err)
        })
    }
    // 等待所有网络请求结束再渲染
    // 这里的app 已经不是组件了，而是一个函数
    Promise.all(promises.map(promise => {
        return promiseCatch(promise)
    })).then((v) => {
        // 渲染逻辑放到promise.all内执行
        const content = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url}>
                    <Header/>
                    {routes.map(route => <Route {...route}></Route>)}
                </StaticRouter>
            </Provider>
        )
        // const content = renderToString(
        //     <Provider store={store}>
        //         <StaticRouter location={req.url}>
        //             {/* {Header ? <Header/> : ''}
        //             {routes.map(route => {{route ? <Route {...route}></Route> : ''}})} */}
                    
        //             {/* 测试解决这个警告 Warning: Expected server HTML to contain a matching <div> in <div>. */}
        //             {/* {routes.map(route => {{return route ? <Route {...route}></Route> : ''}})} */}
        //             {/* {routes.map(route => {
        //                 if (route) {
        //                     return <Route {...route}></Route>
        //                 } else {
        //                     return ''
        //                 }
        //             })} */}
        //         </StaticRouter>
        //     </Provider>
        // )
        // 字符串模板
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>REACT SSR1</title>
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
        // res.send(`
        //     <!DOCTYPE html>
        //     <html lang="en">
        //         <head>
        //             <meta charset="utf-8">
        //             <title>REACT SSR</title>
        //         </head>
        //         <body>
        //             <div id="root">${content}</div>
        //             <script>
        //                 window.__context=${JSON.stringify(store.getState())}
        //             </script>
        //             <script src="/bundle.js"></script>
        //         </body>
        //     </html>
        // `)
    })

    // routes.some(route => {
    //     // use `matchPath` here
    //     const match = matchPath(req.path, route);
    //     if (match) promises.push(route.loadData(match));
    //     return match;
    // });

    // const content = renderToString(
    //     <Provider store={store}>
    //         <StaticRouter location={req.url}>
    //             {App}
    //         </StaticRouter>
    //     </Provider>
        
    // )
    // // 字符串模板
    // res.send(`
    //     <html>
    //         <head>
    //             <meta charset="utf-8">
    //             <title>REACT SSR</title>
    //         </head>
    //         <body>
    //             <div id="root">${content}</div>
    //             <script src="/bundle.js"></script>
    //         </body>
    //     </html>
    // `)
})
app.listen(9093,()=>{
    console.log('ssr listen', '监听完毕')
})