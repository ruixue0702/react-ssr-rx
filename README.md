#### npm install
#### npm run dev:server
#### npm run dev:start
#### npm run dev:client

#### npm start 代替以上三条命令

#### 把 react 组件 jsx 解析成 html
react-dom/server 中的 api renderToString 把 react 组件解析成 html
```
import App from '../src/App' // 公共组件 App
import { renderToString } from 'react-dom/server'
const content = renderToString(App)
```
#### 注水 客户端入口 client-entry => client bundle
```
ReactDom.hydrate(App, document.getElementById('root'))
```
#### 设置静态资源目录
```
app.use(express.static('public'))
```
## **同构 = ssr + csr**
首次渲染时，client 端 html 结构已经渲染出来，把 html 内容 + dom 交互、事件交互、网络请求在 server bundle 层面做，用户所有交互在 client bundle 层面做
#### ssr：在 server 层面把页面渲染出来
#### csr：在 client 层面把所有交互注水