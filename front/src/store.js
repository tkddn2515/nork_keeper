import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  member: {
    id: -1,
    code: '',
    view_code: '',
    createtime: ''
  },
  containers: []
}

const slice = createSlice({
  name: 'keeper',
  initialState,
  reducers: {
    SET_MEMBER: (state, action) => { return { ...state, member: action.payload } },
    SET_CONTAINERS: (state, action) => { return {...state, containers: action.payload.map(v => {return {...v, imgs: v.imgs.split(','), tags: v.tags.split(',')}}) }},
    ADD_CONTAINERS: (state, action) => { return {...state, containers: [...state.containers, action.payload] }},
  },
})

export const { SET_MEMBER, SET_CONTAINERS, ADD_CONTAINERS } = slice.actions;

export default configureStore({reducer: slice.reducer});