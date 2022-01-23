import React, { memo, useCallback, useEffect, useState } from 'react';
import styles from './Main.module.css';
import store from '../store';
import { post } from '../api/axios';
import MainDrop from '../components/MainDrop';
import MainHeader from '../components/MainHeader';
import MainList from '../components/MainList';
import MainFooter from '../components/MainFooter';
import { ADD_CONTAINERS } from '../store';

const Main = () => {

  const [files, setFiles] = useState([]);
  const [showAskGrouping, setShowAskGrouping] = useState(false);

  const uploadContainer = async (isGrouping) => {
    const data = {
      mid: store.getState().member.id,
      files
    }
    const res = await post("/container", data);
    console.log(res);

    store.dispatch(ADD_CONTAINERS({
      id: res.insert_id,
      mid: store.getState().member.id,
      thumb: files[0],
      imgs: files.join(','),
      tags: '',
      createtime: '2022-01-23 11:11:11'
    }))

    setFiles([]);
    setShowAskGrouping(false);
  }
  
  return (
    <>
      <MainDrop setFiles={setFiles} setShowAskGrouping={setShowAskGrouping} uploadContainer={uploadContainer}/>
      <MainHeader />
      <MainList showAskGrouping={showAskGrouping} uploadContainer={uploadContainer}/>
      <MainFooter />
    </>
  )
}
export default Main;