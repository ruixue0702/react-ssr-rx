import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getIndexList } from '../store/index'
// 函数式组件
function Index(props) {
    const [count, setCount] = useState(1)
    // useEffect(() => {
    //     异步数据首页显示
    //     将这一步改成server端渲染
    //     props.getIndexList()
    // }, [])    
    useEffect(() => {
        // 异步数据首页显示
        // 客户端获取数据(首次渲染时，不是该页面，无法从server端中获取数据)
        // 判断需要的异步数据是否为空，为空时从client端获取数据
        if (!props.list.length) { 
            props.getIndexList()
        }
    }, [])    
    return (<div>
            <h1>hello {props.title} !!! {count}</h1>
            <button onClick={()=>setCount(count+1)}>累加</button>
            <hr/>
            <ul>{props.list.map(item => {return <li key={item.id}>{item.name}</li>})}</ul>
        </div>)
}
// 模仿 nuxt 接口的形式，在当前组件设置一个 loadData 的方法，
// loadData 等于一个函数，
// 通过这个函数，发起异步请求，直接填充 store，
// 因此要有个参数 store
Index.loadData = (store) => {
    return store.dispatch(getIndexList())
}
export default connect(
    state => ({ list: state.index.list }),
    { getIndexList }
)(Index)