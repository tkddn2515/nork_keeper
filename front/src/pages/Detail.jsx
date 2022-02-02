import React, { useState, useCallback, useEffect } from 'react';
import styles from './Detail.module.css';
import store, { SET_CONTAINERS_DIRECT, SET_TAGS } from '../store';
import { useSelector } from "react-redux";
import { patch } from '../api/axios';
import Tag from '../components/Main/Tag';
import MainFooter from '../components/Main/MainFooter'
import {useDropzone} from 'react-dropzone'
import { useLocation } from "react-router-dom";
function useQuery() {
  const { search } = useLocation();
  console.log("search", search);
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Detail = ({container}) => {

  let query = useQuery();

  container = {
    id: 9,
    mid: 1,
    name: "adqs",
    concept: "fuck",
    thumb: "20220123003213_000.jpg",
    imgs: ["20220123003213_000.jpg","20220123003213_001.jpg"],
    tags: ["123","15","....................","bfszxc","lvjn","한상우","심예은","사랑해","끼얏호우"],
    createtime: "2022-01-24 00:26:14"
  };

  const [plusTag, setPlusTag] = useState([]);
  const [concept, setConcept] = useState(container.concept);
  const selectTags = useSelector(state => state.containersSetting.tag);
  useEffect(() => {
    console.log("query", query.get("name"));
  }, [])

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
      }
    }
  }

  const removePlusTag = (idx) => {
    const newPlusTag = [...plusTag];
    newPlusTag.splice(idx, 1);
    setPlusTag(newPlusTag);
  }

  const [selectImg, setSelectImg] = useState(container.thumb);

  const onChangeConcept = (e) => {
    setConcept(e.target.value);
  }


  const onDrop = useCallback(acceptedFiles => {
    console.log("acceptedFiles", acceptedFiles);
    if(acceptedFiles.length === 0) {
      return;
    }
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  const onClickInput = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.toptime}>
          <span className={styles.createtime}>2021-11-11</span>
          <img alt="" className={styles.download} />
        </div>
        <div className={styles.toptitle}>
          <div className={styles.line}></div>
          <div className={styles.title}>방이샤브샤브 종암점 후기</div>
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
              <textarea className={styles.conceptInput} placeholder='텍스트를 입력해주세요.' value={concept} onChange={onChangeConcept}> </textarea>
            </div>
          </div>
        </div>
        <div className={styles.imgs}>
          {container.imgs.map((v, idx) => 
          <button className={`${styles.imgBtn} ${false && styles.imgSelect}`} key={idx}>
            <img className={`${styles.mainImg_back} center`} src={getImagePath(v, 2)} alt=""/>
            <img className={`${styles.mainImg} center`} src={getImagePath(v, 2)} alt=""/>
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