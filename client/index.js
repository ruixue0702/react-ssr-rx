import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
// import App from '../src/App'
import routes from '../src/App'
// import store from '../src/store/store'
import { getClientStore } from '../src/store/store'

import Header from '../src/component/Header'

// 注水 客户端入口 client-entry => client bundle
const Page = (
    <Provider store={getClientStore()}>
        <BrowserRouter>
            <Header/>
            <Switch>
                {routes.map(route => <Route {...route}></Route>)}
            </Switch>
        </BrowserRouter>
    </Provider>
)
// const Page = (
//     <Provider store={store}>
//         <BrowserRouter>
//             {App}
//         </BrowserRouter>
//     </Provider>
// )

if (window.__context) {
    // 服务端渲染 hydrate
    ReactDom.hydrate(Page, document.getElementById('root'))
} else {
    // 客户端渲染 csr降级渲染 render
    ReactDom.render(Page, document.getElementById('root'))
}
