import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import store, { SET_CONTAINERS_DIRECT, SET_TAGS, SELECT_CONTAINER } from '../../store';
import styles from './MenuListItem.module.css';
import Tag from './Tag';
import { patch } from '../../api/axios';
import JSZip from "jszip";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const MenuListItem = memo(({container}) => {

  const navigate = useNavigate();

  const [name, setName] = useState(container.name);
  const [readOnly, setReadOnly] = useState(container.name.length > 0)
  const [plusTag, setPlusTag] = useState([]);
  const selectTags = useSelector(state => state.containersSetting.tag);
  let onKeyUp = useRef(null);

  const getImagePath = (name, type) => {
    let arr = name.split(".");
    // return `https://nork.kr.object.ncloudstorage.com/keeper/member/${store.getState().member.id}/${arr[0]}_${type}.${arr[1]}`;
    return `../iu.jpg`;
  }

  const onClickItem = () => {
    store.dispatch(SELECT_CONTAINER(container));
    navigate("/detail");
  }

  const onChangeName = (e) => {
    setName(e.target.value);
  }

  const onKeyUpName = useCallback( async (e) => {
    
    if(e.code === "Enter"){
      if(onKeyUp != null) {
        clearTimeout(onKeyUp);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
      onKeyUp = setTimeout(async() => {
        if(name.length === 0) {
          return;
        }
  
        const data = {
          id: container.id,
          name
        }
  
        await patch('/container/name', data);
        setReadOnly(true)
      }, 10)
    }
  }, [name])

  const onClickBtnDownload = async () => {
    const imgs = container.imgs;
    if(imgs.length === 0) {
      return;
    }
    var zip = new JSZip();
    for await(const v of imgs){
      console.log(getImagePath(v, 0));
      let binary = await fetch(getImagePath(v, 0)).then(r => r.blob());
      zip.file(v, binary);
    }
    zip.generateAsync({type:"blob"})
    .then(function(content) {   
      console.log(container.name);
      const url = URL.createObjectURL(content); //객체 URL 생성
      const aTag = document.createElement('a');
      aTag.download = container.name ? `keeper ${container.name}` : `keeper container`; //저장될 파일 이름
      aTag.href= url;
      aTag.click();
    });
  }

  const onClickTagPlus = () => {
    if(plusTag.length >= 1) {
      return;
    }
    const tmpPlusTag = [...plusTag, ''];
    setPlusTag(tmpPlusTag);
  }

  const hasTag = (v) => {
    console.log(v);
    if(!v) {
      return true;
    }
    console.log()
    if(container.tags.includes(v)) {
      return true;
    }
    return false;    
  }

  const onTagInsert = async (v, idx) => {
    if(hasTag(v)) {
      alert("이미 존재하는 태그입니다.");
    } else {
      const newTags = [...container.tags, v];
      const data = {
        id: container.id,
        mid: store.getState().member.id,
        tags: newTags.join(",")
      }

      const res = await patch("/container/tags", data);

      const containers = store.getState().containers.map(v => {
        if (v.id === container.id) {
          return {...v, tags: newTags};
        } else{
          return v;
        }
      });
      store.dispatch(SET_CONTAINERS_DIRECT(containers));

      removePlusTag(idx);

      // 태그 리스트에 추가
      const tags = store.getState().tags;
      if(!tags.includes(v)){
        store.dispatch(SET_TAGS([...tags, v]));
      }
    }
  }

  const removePlusTag = (idx) => {
    const newPlusTag = [...plusTag];
    newPlusTag.splice(idx, 1);
    setPlusTag(newPlusTag);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.thumbnail_container} onClick={onClickItem}>
          <img className={`${styles.thumbnail_back} center`} src={getImagePath(container.thumb, 2)} alt=""/>
          <img className={`${styles.thumbnail} center`} src={getImagePath(container.thumb, 2)} alt=""/>
        </div>
        <div className={styles.createtime}>{container.createtime.slice(0, 10)}</div>
        <img className={styles.download} alt="" onClick={onClickBtnDownload} />
        <input className={styles.title} value={name} onChange={onChangeName} placeholder="제목을 입력하세요." maxLength={20} onKeyUpCapture={onKeyUpName} readOnly={readOnly} />
        <div className={styles.tags}>
          {container.tags.map((v, idx) => <Tag tag={v} key={'containerTag' + idx} isSelect={selectTags.includes(v)}/>)}
          {plusTag.map((v, idx) => <Tag tag={v} key={'plusTag' + idx} idx={idx}  isBtn={false} onTagInsert={onTagInsert} />)}
          <button className={styles.tagPlus} onClick={onClickTagPlus}><Tag tag='+' isBtn={true}/></button>
        </div>
      </div>
    </>
  )
});

export default MenuListItem;