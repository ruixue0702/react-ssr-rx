#### 前端性能优化：
- 如何能更快更少地加载文件
- 如何能更高效更快速地执行代码
- 前端领域特有的优化措施 - react ssr
- 服务端渲染或同构应用是但也应用做性能优化和seo比较常用的解决方案之一

#### vue cli / create react app —— csr 应用：直接渲染到浏览器
打开浏览器 -> 先加载 js -> 通过 js 执行路由 -> 之后页面才能渲染 -> 性能上首屏会比较慢，无法做 SEO 优化

#### 白屏时间过长：
- 新用户不爱用
- 老用户易流失

**从用户在浏览器里输入 url 后，直到页面完全显示出来到底发生了什么？**

**ssr 缺点**：对服务器会有额外的性能的损耗，用户量过大时可临时放弃ssr，切换入口

#### 简单的 react ssr
react-dom 提供了 server 的渲染 api renderToString，负责把 react 组件解析成 html，这里 vue 的 ssr 多了一个细节，就是 node 是不支持 jsx 的，所以需要 babel 的支持，而且我们之前 vue ssr 的学习，我们知道，一个同构应用，需要两个入口，分别编译 client 和 server 的代码。

`webpack.client.js -> client bundle`
`webpack.server.js -> server bundle` 

### 注意事项：

- 针对服务端渲染代码，可以剔除 node_modules，从而大幅减少服务端代码生成耗时
- 使用 babel-loader，在 node 层面解析 jsx

#### concurrently 提升开发体验 合并执行命令
```
"start": "concurrently \"npm run dev:client\" \"npm run dev:server\" \"npm run dev:start\""
```
#### 使用 StaticRouter 支持多页面 ssr
```js
// App.js
import { Route } from 'react-router-dom'
<Route path="/" exact component={Index}></Route>
```
```js
// client index.js
import { BrowserRouter } from 'react-router-dom'
const Page = <BrowserRouter>{App}</BrowserRouter>
ReactDom.hydrate(Page, document.getElementById('root'))
```
```js
// server index.js
import { StaticRouter } from 'react-router-dom'
const content = renderToString(
    <StaticRouter location={req.url}>{App}</StaticRouter>
)
```

#### 异步数据获取 client 层 Vs server 层
client层实现数据获取：`Component -> didMount (ajax data) -> client store -> props -> 渲染`

server层实现数据获取：`Component.loadData (redux store.dispatch) -> node server(get data) -> server store -> window.__context=${JSON.stringify(store.getState())} -> props -> 渲染`

```js
container Index.js
Index.loadData = (store) => {
    return store.dispatch(getIndexList())
}
export default connect(
    state => ({ list: state.index.list }),
    { getIndexList }
)(Index)
```

```js
// client index.js
import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import routes from '../src/App'
import { getClientStore } from '../src/store/store'
// 注水 客户端入口 client-entry => client bundle
const Page = (
    <Provider store={getClientStore()}>
        <BrowserRouter>
            {routes.map(route => <Route {...route}></Route>)}
        </BrowserRouter>
    </Provider>
)
ReactDom.hydrate(Page, document.getElementById('root'))
```
#### 客户端获取context数据渲染
- 通过 redux 的 createStore, applyMiddleware, combineReducers 将 server 端 store 转成 client 端的 store
- 再通过 redux 的 Provider 将 store 传到组件中
- 在组件中通过 props 进行渲染

#### 前后端统一数据请求
前端封装请求到 node server（9093端口），再通过 node server 统一代理到 mock server （9090）
```js
// utils axios.js
axios.create({
    timeout: 5000,
    // 前缀
    // baseURL: 'http://localhost:9090'
    baseURL: 'http://localhost:9093'
})
```

```js
// server index.js
import proxy from 'http-proxy-middleware'
const mockPath = "http://localhost:9090";
const option = {
     target: mockPath,
     changeOrigin: true,
     ws: true
};
app.get('/api/*', proxy(option))
```

#### 页面多个数据获取报错处理
- 接口错误时，降级渲染 
- 在 server StaticRouter 层级进行降级处理，但需要在 promise.all().catch() 再次返回模板
- 在 promise 层级进行降级处理，需要在 promises.all() 中进行 promise 的 map 循环，对每一个 promise 做 catch 的错误处理

```js
// 接口报错降级处理1 需在promise.all().catch(()=>res.send(``))再次send模板 （该方法较冗余）
const content = renderToString(
    <Provider store={store}>
        <StaticRouter location={req.url}>
            {/* 接口报错降级处理 */}
            {Header ? <Header/> : ''}
            {routes.map(route => {{route ? <Route {...route}></Route> : ''}})}
        </StaticRouter>
    </Provider>
)

```
```js
// 在 promise 层级进行降级处理 需要在 promises.all() 中进行 promise 的 map 循环，对每一个 promise 做 catch 的错误处理 
const promiseCatch = (promise) => {
    promise.catch( err => {
        console.log('promise.catch err', err)
    })
}
Promise.all(promises.map(promise => {
    return promiseCatch(promise)
}))
```


### 遗留问题
#### Warning: Expected server HTML to contain a matching <div> 
注：client 和 server 的 staticRouter 内的 代码不同就会出现这个报错
- 在 promise 层级做容错处理，client BrowserRouter 和 server staticRouter 中的 代码是相同的，就不会出现这样的问题了



**=============x========> (跨域)**

**浏览器 ==> ssrnode ==> 数据接口(mock java php)**

### **Promise**
```js
// Promise.allSettled(promises)  Promise.allSettled 新的API  node babel 环境中才可使用
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
```

```js
// 包装后
// 规避报错 可以考虑加日志
const promise = new Promise((resolve, reject) => {
    loadData(store).then(resolve).catch((err) => {
        console.log(`${req.path} err`)
        resolve
    })
})
promises.push(promise)

Promise.all(promises)
```
#### **axios**
```js
// server index.js
import proxy from 'http-proxy-middleware'
app.use(
    '/api',
    proxy({ target: 'http://localhost:9090', changeOrigin: true })
)

```
```js
// store store.js
const serverAxios = axios.create({
    baseURL: 'http://localhost:9090/'
})
const clientAxios = axios.create({
    baseURL: '/'
})
// 服务端用的
// 通过 server 的 dispatch 来获取和充实
// thunk.withExtraArgument() 同 thunk  但可传参数（axios）
// 
export const getServerStore = () => {
    return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)))
}
export const getClientStore = () => {
    const defaultState = window.__context ? window.__context : {}
    return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)))
}
```
```js
// store index.js
// $axios thunk.withExtraArgument(clientAxios) thunk.withExtraArgument(serverAxios)
export const getIndexList = server => {
    return (dispatch, getState, $axios) => {
        // return http.get('/api/course/list')
        return $axios.get('/api/course/list')
            .then(res => {
                const { data } = res.data
                console.log('list信息', data)
                dispatch(changeList(data))
            })
            .catch(err=>console.log('getIndexList err',err))
    }
}
```
### **favoicon**
pulic 文件加下

### **Notfound**
```js
// App.js
{
    component: Notfound,
    key: "Notfound"
}
```
### **css**
`npm install isomorphic-style-loader css-loader style-loader --D`
```js
// App.js
import './App.css'
```
```js
// webpack.client.js
{
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
}
```
```js
// webpack.server.js
{
    test: /\.css$/,
    // 服务端同构 style isomorphic-style-loader
    use: ['isomorphic-style-loader', 'css-loader']
}
```


### **局部样式**
https://www.jianshu.com/p/850031db7ac5
#### Modules CSS模块化
```js
// webpack.client.js
loader: "style-loader!css-loader?modules"
```
```js
// webpack.server.js
loader: "isomorphic-style-loader!css-loader?modules"
```
```css
// About.css
.title {
    color: green;
}
```
```js
// About.js
import style from './About.css'
<h1 className={style.title}>关于页面</h1>
```
#### 行内样式
```js
// webpack.client.js
use: ['style-loader', 'css-loader']"
```
```js
// webpack.server.js
use: ['isomorphic-style-loader', 'css-loader']"
```
```js
// 直接写入
<h1 style={{padding: "10px 20px",textAlign: "center",color: "blue",fontSize: "55px"}}>Header</h1>
```
```js
// 多组件共享style对象 写入单独 js 文件 AboutStyle.js
const Header = {
    padding: "10px 20px",
    textAlign: "center",
    color: "blue",
    fontSize: "22px"
}
const styles = {
    Header: Header,
}
export default styles
// About.js
import styles from './AboutStyle.js'
<h1 style={styles.Header}>Header</h1>
```
#### 使用Styled components 
创建带有样式的组件
npm install --save styled-components
```js
import styled from 'styled-components'
// 创建了一个具有样式的组件
const TodoComponent = styled.div`
    background-color: #44014C;
    width: 300px;
    min-height: 200px;
    margin: 30px auto;
    box-sizing: border-box;
`;
```
```js
// ToDoApp.js
class ToDoApp extends React.Component {
  // ...
  render() {
    return (
      <TodoComponent>
        <h2>ToDo</h2>
      </TodoComponent>
    )
  }
}
```


### **服务层面性能优化**
高并发 —— 负载均衡
       —— 暂时放弃 SEO 优化

#### 放弃seo的降级渲染实现优化
webpack 开启 CSR - Nginx
                 - Node

#### 降级渲染 —— 生成完整 CSR 应用
```js
// webpack.client.js
// npm install html-webpack-plugin --D
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // ...
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.csr.html',
            template: 'src/index.csr.html',
            inject: true
        })
    ]
    // ...
}
```
```html
<!-- src index.csr.html -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>REACT SSR1</title>
    </head>
    <body>
        <!-- 客户端渲染模板 -->
        <div id="root"></div>
    </body>
</html>
```
```js
// client index.js
if (window.__context) {
    // 服务端渲染 hydrate
    ReactDom.hydrate(Page, document.getElementById('root'))
} else {
    // 客户端渲染 csr降级渲染 render
    ReactDom.render(Page, document.getElementById('root'))
}
```
```js
// server index.js
// csr 渲染
import path from 'path'
import fs from 'fs' // 文件系统
// ...
function csrRender(res) {
    // 读取 csr 文件 返回
    const filename = path.resolve(process.cwd(), 'public/index.csr.html')
    const html = fs.readFileSync(filename, 'utf-8')
    return res.send(html)
}
app.get('*', (req, res) => {
    // console.log('req.query._mode', req.query._mode)
    if (req.query._mode=='csr') {
        console.log('参数开启 csr 降级')
        // 开启 csr
        return csrRender(res)
    }
    // 配置开关开启 csr

    // 服务器负载过高 开启 csr
    // ...
}

```




### **css 优化细节**
```css
// container Index.css
.list { 
    background: pink;
    padding: 10px 15px;
    color: #fff;
    font-weight: bold;
    margin-bottom: 15px;
    border-radius: 4px;
    box-shadow: 0 0 8px 0  #eee;
}
```
```js
// container Index.js
import styles from './Index.css'
// server 端特有 styles._getCss()
// console.log('Index.js styles._getCss()', classNames._getCss())
function Index(props) {
    if (props.staticContext) {
        props.staticContext.css.push(classNames._getCss())
    }
    // ...
    return (<div>
            <ul>{props.list.map(item => {return <li key={item.id} className= {classNames.list}>{item.name}</li>})}</ul>
        </div>)
}
```
```js
// webpack.server.js
module.exports = {
    // ...
    module: {
        rules: [
            // ...
            {
                test: /\.css$/,
                use: ['isomorphic-style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }]
            }
        ]
    }
}
```
```js
// webpack.client.js
module.exports = {
    // ...
    module: {
        rules: [
            // ...
            {
                test: /\.css$/,
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
```
```js
// server index.js
Promise.all(promises).then(() => {
    const context = {
        css: []
    }
    // ...
    const css = context.css.join('\n')
    res.send(`
        // ...
                <style>
                    ${css}
                </style>
            </head>
        // ...
    `)
}
```

### **高阶组件优化 css**
```js
// withStyle.js
import React from 'react'
function withStyle(Comp, styles) {
    return function(props) {
        if (props.staticContext) {
            props.staticContext.css.push(styles._getCss())
        }
        return <Comp {...props} />
    }
}
export default withStyle
```
```js
// container Index.js
import withStyle from '../withStyle'
export default connect(
    state => ({ list: state.index.list }),
    { getIndexList }
)(withStyle(Index, classNames))
```
### **遗留问题**
1. 通过高阶组件进行 css 优化，首屏数据不是服务端渲染的
2. css 优化，在服务端渲染 css，会在 head 中生成两段相同的 style 代码片段
3. 不在服务端渲染 css，也可以在页面中显示 css module
4. 为什么一定要在服务端进行 css 渲染呢？