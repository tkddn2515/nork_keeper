import React, { useCallback, useEffect } from 'react';
import styles from './MainHeader.module.css';
import store, { SET_TAGS, Tag_CONTAINERS } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { get } from '../../api/axios';
import Tag from './Tag';

const MainHeader = () => {
  const tags = useSelector(state => state.tags);
  const selectTags = useSelector(state => state.containersSetting.tag);
  const dispatch = useDispatch();
  useEffect(() => {
    getTags();
  }, [])

  const getTags  = useCallback(async () => {
    const data = {
      mid: store.getState().member.id
    }
    const res = await get("/tag", data);
    if(res.length > 0) {
      const tags = res.map(v => v.name);
      dispatch(SET_TAGS(tags));
    }
  }, [])

  const onClickTag = (v) => {
    const newSelectTags = [...selectTags];
    if(selectTags.includes(v)) {
      const idx = newSelectTags.indexOf(v);
      newSelectTags.splice(idx, 1);
    } else {
      newSelectTags.push(v);
    }
    dispatch(Tag_CONTAINERS(newSelectTags))
  }

  return (
    <div className={styles.header}>
      <div className={styles.title}>KEEPER</div>
      <img className={styles.title_share} alt='공유'/>
      <div className={styles.title_code}>{store.getState().member.code}</div>
      <div className={styles.tags}>
        {tags.map((v, idx) => <button className={styles.tag} key={idx} onClick={()=>{onClickTag(v);}}><Tag tag={v} isBtn={true} isSelect={selectTags.includes(v)} /></button>)}
      </div>
    </div>
  )
}

export default MainHeader;