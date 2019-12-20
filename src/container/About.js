import React from 'react'
import classNames from './About.css'
import styles from './AboutStyle'
// 函数式组件
function About(props) {
    console.log('styles.Header', styles.Header)
    return (
        <div>
        <h1 className={classNames.title}>关于页面</h1>
        <h1 style={styles.Header}>Header</h1>
        <h1 style={{padding: "10px 20px", textAlign: "center", color: "blue", fontSize: "55px"}}>Header</h1>
        </div>
    )
}
export default About