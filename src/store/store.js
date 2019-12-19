// 存储入口
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import indexReducer from './index'
import userReducer from './user'
const reducer = combineReducers({
    index: indexReducer,
    user: userReducer
})
const serverAxios = axios.create({
    baseURL: 'http://localhost:9090/'
})
const clientAxios = axios.create({
    baseURL: '/'
})
// 创建 store
// const store = createStore(reducer, applyMiddleware(thunk))
// export default store

export const getServerStore = () => {
    // 服务端用的
    // 通过 server 的 dispatch 来获取和充实
    // return createStore(reducer, applyMiddleware(thunk))
    // thunk.withExtraArgument() 同 thunk 
    // 
    return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)))
}
export const getClientStore = () => {
    // 浏览器端
    // 通过 window.__context 来获取数据
    const defaultState = window.__context ? window.__context : {}
    // return createStore(reducer, defaultState, applyMiddleware(thunk))
    return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)))
}