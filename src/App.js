import React, { useState } from 'react'

// 函数式组件
function App(props) {
    const [count, setCount] = useState(1)
    // JSX <h1>ruixue0702飘雪的季节</h1>
return (
    <div>
        <h1>hello {props.title} !!! {count}</h1>
        <button onClick={()=>setCount(count+1)}>累加</button>
    </div>
)

}

export default <App title="ruixue0702"></App>