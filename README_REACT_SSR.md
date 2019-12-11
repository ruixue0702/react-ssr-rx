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
