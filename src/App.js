import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import Index from './container/Index'
import About from './container/About'
import User from './container/User'

// 组件的配置
// export default (
//     <div>
//         <Route path="/" exact component={Index}></Route>
//         <Route path="/about" exact component={About}></Route>
//     </div>
// )

// 组件的配置改成动态 js 配置 才能获取组件
export default [
    {
        path: "/",
        component: Index,
        // 也可以在这里直接设置 loadData
        // loadData: Index.loadData,
        // 是否精确匹配path
        // exact: true,
        key: "index"
    },
    {
        path: "/about",
        component: About,
        exact: true,
        key: "about"
    },
    {
        path: "/user",
        component: User,
        exact: true,
        key: "user"
    },
]
