import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  member: {
    id: -1,
    code: '',
    view_code: '',
    createtime: ''
  },
  containers: [],
  containersSetting: {
    sort: 0, // 0 : 최신 순, 1 : 오래된 순
    term: [], // 컨테이너 등록 기간에 해당하는것만 가져올 시 ex) [2022-01-23, 2022-02-23] 이면 이떄에 해당하는 컨테이너만 가져오기
    page: 1,
    limit: 10,
    total: 0
  },
}

const slice = createSlice({
  name: 'keeper',
  initialState,
  reducers: {
    // 멤버 설정
    SET_MEMBER: (state, action) => { return { ...state, member: action.payload } },
    // 컨테이너 설정
    SET_CONTAINERS: (state, action) => { return {...state, 
      containers: action.payload.results.map(v => {return {...v, imgs: v.imgs.split(','), tags: v.tags.split(',')}}),
      containersSetting: {...state.containersSetting, total: action.payload.count}
    }},
    // 컨테이너 추가, Sort가 최신순일 시 무조건 추가, 오래된 순일 시 현재 페이지에 컨테이너가 limit 개 이하면 맨앞에 추가
    ADD_CONTAINERS: (state, action) => { return {...state, containers: [...state.containers, action.payload] }},
    SORT_CONTAINERS: (state, action) => { 
      if(action.payload === 0){
        return {...state, containersSetting: {...state.containersSetting, sort: 0}} 
      } else if (action.payload === 1) {
        return {...state, containersSetting: {...state.containersSetting, sort: 1}} 
      }
    },
    PAGE_CONTAINERS: (state, action) => { return {...state, containersSetting: {...state.containersSetting, page: action.payload}} },
    Term_CONTAINERS: (state, action) => { return {...state, containersSetting: {...state.containersSetting, term: action.payload}}}
  },
})

export const { SET_MEMBER, SET_CONTAINERS, ADD_CONTAINERS, SORT_CONTAINERS, PAGE_CONTAINERS, Term_CONTAINERS } = slice.actions;

export default configureStore({reducer: slice.reducer});