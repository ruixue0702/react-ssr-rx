// 存储入口
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import indexReducer from './index'
import userReducer from './user'
const reducer = combineReducers({
    index: indexReducer,
    user: userReducer
})

// 创建 store
// const store = createStore(reducer, applyMiddleware(thunk))
// export default store

export const getServerStore = () => {
    // 服务端用的
    // 通过 server 的 dispatch 来获取和充实
    return createStore(reducer, applyMiddleware(thunk))
}
export const getClientStore = () => {
    // 浏览器端
    // 通过 window.__context 来获取数据
    const defaultState = window.__context ? window.__context : {}
    return createStore(reducer, defaultState, applyMiddleware(thunk))
}