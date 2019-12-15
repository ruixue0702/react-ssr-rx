import axios from 'axios'
let service = axios.create({
    timeout: 5000,
    // 前缀
    // baseURL: 'http://localhost:9090'
    baseURL: 'http://localhost:9093'
})
// console.log('utils axios http://localhost:9093')
export default ({store, redirect}) => {
    // 请求拦截
    service.interceptors.request.use(
        config => {
            return config
        },
        err => {
            return Promise.reject(err)
        }
    )
    // 响应拦截
    service.interceptors.response.use(
        async response => {
            console.log('utils axios.js response',response)
            let { data, config } = response;
            return response;
        },
        err => {
            console.log('utils axios.js err',err)
            return Promise.reject(err)
        }
    )
}
export const http = service