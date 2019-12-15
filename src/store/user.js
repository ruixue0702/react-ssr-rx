// 首页的逻辑
// import axios from 'axios'
import { http } from "../utils/axios";
// actionType
const USER_INFO = 'INDEX/USER_INFO'
// actionCreator
const changeUserInfo = data => ({
    type: USER_INFO,
    data
})
export const getUserInfo = server => {
    return (dispatch, getState, axiosInstance) => {
        return http.get('/api/user/info')
            .then(res => {
                const { data } = res.data
                dispatch(changeUserInfo(data))
            })
            .catch(err=>console.log('getUserInfo err',err))
    }
}
const defaultState = {
    userinfo: {}
}
export default (state = defaultState, action) => {
    switch(action.type) {
        case USER_INFO:
            const newState = {
                ...state,
                userinfo: action.data
            }
            return newState
        default:
            return state
    }
}