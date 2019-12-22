// 首页的逻辑
// import axios from 'axios'
// import { http } from "../utils/axios";
// actionType
const GET_LIST = 'INDEX/GET_LIST'
// actionCreator
const changeList = data => ({
    type: GET_LIST,
    data
})
export const getIndexList = server => {
    return (dispatch, getState, $axios) => {
        // return http.get('/api/course/list')
        return $axios.get('/api/course/list')
            .then(res => {
                const { data } = res.data
                console.log('list信息', data)
                dispatch(changeList(data))
            })
            .catch(err=>console.log('getIndexList err',err))
    }
}
const defaultState = {
    list: []
}
export default (state = defaultState, action) => {
    switch(action.type) {
        case GET_LIST:
            const newState = {
                ...state,
                list: action.data
            }
            // console.log('newList',newState)
            return newState
        default:
            // console.log('List',state)
            return state
    }
}