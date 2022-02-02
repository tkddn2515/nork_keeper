import React, { memo, useState } from 'react';
import store, { Term_CONTAINERS } from '../../store';

import styles from './MainListDate.module.css';

const MainListDate = () => {

  const term = store.getState().containersSetting.term;
  
  const [start, setStart] = useState(term.length > 0 ? term[0] : '');
  const [end, setEnd] = useState(term.length > 1 ? term[0] : '');

  const onChangeStart = (e) => {
    setStart(e.target.value);
  }

  const onChangeEnd = (e) => {
    setEnd(e.target.value);
  }

  const onClickBtnSet = () => {
    if(new Date(start) > new Date(end)){
      setEnd(start);
    }
    
    if(start && end) {
     
      store.dispatch(Term_CONTAINERS([start, end]));
    }
  }

  const onClickBtnDel = () => {
    setStart('');
    setEnd('');
    store.dispatch(Term_CONTAINERS([]));
  }

  return (
    <>
    {/* <div className={styles.background}> */}
      <div className={styles.container}>
        <input type="date" className={styles.start} value={start} onChange={onChangeStart}></input>
        <input type="date" className={styles.end} value={end} onChange={onChangeEnd}></input>
        <div className={styles.btns}>
          <button className={styles.setting} onClick={onClickBtnSet}>설정</button>
          <button className={styles.delete} onClick={onClickBtnDel}>삭제</button>
        </div>
      </div>
    {/* </div> */}
    </>
  )
}

export default MainListDate;