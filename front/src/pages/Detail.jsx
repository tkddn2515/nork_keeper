import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from './Detail.module.css';
import store, { SET_CONTAINERS_DIRECT, SET_TAGS, SELECT_CONTAINER } from '../store';
import { useSelector } from "react-redux";
import { patch, post } from '../api/axios';
import Tag from '../components/Main/Tag';
import MainFooter from '../components/Main/MainFooter'
import {useDropzone} from 'react-dropzone'
import { useLocation, useNavigate } from "react-router-dom";

import { encrypt, decrypt } from "../crypto";

// function useQuery() {
//   const { search } = useLocation();
//   return React.useMemo(() => new URLSearchParams(search), [search]);
// }

const Detail = () => {

  const navigate = useNavigate();
  const container = useSelector(state => state.selectContainer);
  // let query = useQuery();

  const [plusTag, setPlusTag] = useState([]);
  const [name, setName] = useState(container.name);
  const [concept, setConcept] = useState(container.concept);
  const selectTags = useSelector(state => state.containersSetting.tag);
  const [selectImg, setSelectImg] = useState(container.thumb);
  const conceptRef = useRef(null);

  useEffect(() => {
    getContainer();

    conceptRef.current.addEventListener('focusout', (event) => {
      onEndEditConcept();
    });
  }, [])

  useEffect(()=>{
    console.log("container", container.imgs);
  }, [container.imgs])

  const getContainer = () => {
    const check = setTimeout(() => {
      if(!container) {
        navigate("/main");
      }
    }, 1000)
    
    return(() => {
      clearTimeout(check);
    })
  }

  const getImagePath = (name, type) => {
    let arr = name.split(".");
    // return `https://nork.kr.object.ncloudstorage.com/keeper/member/${store.getState().member.id}/${arr[0]}_${type}.${arr[1]}`;
    return `../iu.jpg`;
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
        store.dispatch(SELECT_CONTAINER({...container, tags: newTags}));
      }
    }
  }

  const removePlusTag = (idx) => {
    const newPlusTag = [...plusTag];
    newPlusTag.splice(idx, 1);
    setPlusTag(newPlusTag);
  }


  const onChangeConcept = (e) => {
    setConcept(e.target.value);
  }

  const onClickImg = (v) => {
    setSelectImg(v);
  }

  const onDrop = useCallback(acceptedFiles => {
    console.log("acceptedFiles", acceptedFiles);
    if(acceptedFiles.length === 0) {
      return;
    }
    uploadFiles(acceptedFiles);
  }, [])

  const uploadFiles = useCallback(async (files) => {
    const formData = new FormData();
    formData.append("mid", store.getState().member.id);
    files.forEach(v=> { formData.append("files", v)});
    const res = await post("/detail/dropimage", formData);
    let newContainer = null;
    const containers = store.getState().containers.map(v => {
      if (v.id === container.id) {
        newContainer = {...v, imgs: v.imgs.concat(res)};
        return newContainer;
      } else{
        return v;
      }
    });
    console.log("container", newContainer.imgs);
    const data = {
      id: container.id,
      imgs: newContainer.imgs
    }
    await patch("/container/imgs", data);
    
    store.dispatch(SET_CONTAINERS_DIRECT(containers));
    store.dispatch(SELECT_CONTAINER(newContainer));
  }, [container])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  const onClickInput = (e) => {
    e.preventDefault();
  }

  const onChangeName = (e) => {
    setName(e.target.value);
  }

  const onEndEditConcept = () => {
    const data = {
      id: container.id,
      concept: conceptRef.current.value
    }
    const res = patch("/container/concept", data);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.toptime}>
          <span className={styles.createtime}>{container.createtime.slice(0, 10)}</span>
          <img alt="" className={styles.download} />
        </div>
        <div className={styles.toptitle}>
          <div className={styles.line}></div>
          <input className={styles.title} value={name} onChange={onChangeName}/>
        </div>
        <div className={styles.mainImgContainer}>
          <img className={`${styles.mainImg_back} center`} src={getImagePath(selectImg, 0)} alt=''/>
          <img className={`${styles.mainImg} center`} src={getImagePath(selectImg, 0)} alt=''/>
        </div>
        <div className={styles.detail}>
          <div className={styles.tagContainer}>
            <div className={styles.tagTitle}>
              Tag
            </div>
            <div className={styles.tags}>
              {container.tags.map((v, idx) => <Tag tag={v} key={'containerTag' + idx} isSelect={selectTags.includes(v)}/>)}
              {plusTag.map((v, idx) => <Tag tag={v} key={'plusTag' + idx} idx={idx}  isBtn={false} onTagInsert={onTagInsert} />)}
              <button className={styles.tagPlus} onClick={onClickTagPlus}><Tag tag='+' isBtn={true}/></button>
            </div>
          </div>
          <div className={styles.conceptContainer}>
            <div className={styles.conceptTitle}>
              CONCEPT
            </div>
            <div className={styles.concept}>
              <textarea className={styles.conceptInput} placeholder='텍스트를 입력해주세요.' value={concept} onChange={onChangeConcept} ref={conceptRef} maxLength={60}> </textarea>
            </div>
          </div>
        </div>
        <div className={styles.imgs}>
          {container.imgs.map((v, idx) => 
          <button className={`${styles.imgBtn} ${selectImg === v && styles.imgSelect}`} key={idx} onClick={() => onClickImg(v)}>
            <img className={`${styles.mainImg_back} center`} src={getImagePath(v, 1)} alt=""/>
            <img className={`${styles.mainImg} center`} src={getImagePath(v, 1)} alt=""/>
          </button>)}
          <button className={styles.imgAdd}>
            <div className={styles.inputdiv} {...getRootProps()}>
              <input className={styles.dragfiles} {...getInputProps()} onClick={onClickInput}/>
              <span className={`${styles.dragDes}`}>
                이미지를<br />
                드래그 하세요.
              </span>
            </div>
          </button>
        </div>
      </div>
      <MainFooter />
    </>
  )
}

export default Detail;