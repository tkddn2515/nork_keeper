import React, { memo, useEffect, useRef, useState, useCallback }  from "react";
import styles from './Tag.module.css';

const Tag = memo(({tag, idx, isBtn, onTagInsert, isSelect}) => {
  const [txt, setTxt] = useState(tag);
  const [readOnly, setReadOnly] = useState(tag !== '');
  const inputRef = useRef(null);
  let keyUp = useRef(null);

  // useEffect(() => {
  //   if(!readOnly) {
  //     addEvent();
  //   }
  // }, [])

  // const addEvent = () => {
  //   inputRef.current.addEventListener('focusout', (event) => {
  //     onTagInsert();
  //   });
  // }

  const onChangeTag = (e) => {
    if(e.target.value.includes(',')) {
      return;
    }
    setTxt(e.target.value);
  }

  const onKeyUpTag = useCallback(async (e) => {
    if(e.code === "Enter"){
      if(keyUp != null) {
      clearTimeout(keyUp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    keyUp = setTimeout(() => {
        onTagInsert(inputRef.current.value, idx);
      }, 10);
    }
   
  }, [])

  return (
    <>
      <div className={`${isSelect ? styles.selectContainer : styles.container}`}>
        <span className={styles.txt}>{txt}</span>
        <input onKeyUpCapture={onKeyUpTag}
          className={`${isSelect ? styles.selectInput : styles.input}`} 
          type="text" 
          ref={inputRef} 
          value={txt} 
          onChange={onChangeTag} 
          maxLength={20} 
          readOnly={readOnly} 
          placeholder="태그 입력"
          style={isBtn ? {cursor: "pointer"} : {}
          } />
      </div>
    </>
  )
})

export default Tag;