import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from '../store/user'
// 函数式组件
function User(props) {
    useEffect(() => {
        // 异步数据首页显示
        // 客户端获取数据(首次渲染时，不是该页面，无法从server端中获取数据)
        // 判断需要的异步数据是否为空，为空时从client端获取数据
        if (JSON.stringify(props.userinfo) === "{}") { 
            props.getUserInfo()
        }
    }, []) 
    return (
        <div>
            <h1>
                你好{props.userinfo.title}, 
                你们最棒的人是 {props.userinfo.best}
            </h1>
        </div>
    )
}
User.loadData = (store) => {
    return store.dispatch(getUserInfo())
}
export default connect(
    // state => ({ userinfo: state.user.userinfo }),
    state => {
        return {
            userinfo: state.user.userinfo
        }
    },
    { getUserInfo }
)(User)