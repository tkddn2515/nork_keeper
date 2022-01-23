import { useCallback } from 'react';
import {useDropzone} from 'react-dropzone'
import styles from './MainDrop.module.css';
import { post } from '../api/axios';
import store from '../store';

const MainDrop = ({ setFiles, setShowAskGrouping, uploadContainer}) => {
  
  const onDrop = useCallback(acceptedFiles => {
    if(acceptedFiles.length === 0) {
      return;
    }
    uploadFiles(acceptedFiles);
  }, [])

  const uploadFiles = async (files) => {
    const formData = new FormData();
    formData.append("mid", store.getState().member.id);
    files.forEach(v=> { formData.append("files", v)});
    const res = await post("/main/dropimage", formData);
    console.log(res);
    setFiles(res);
    if(res.length === 1) {
      //한개일 시 바로 등록
      uploadContainer(true);
    } else {
      // 여러개일시 그룹인지 물어보기
      setShowAskGrouping(true);
    }
  }

  
  const onClickInput = (e) => {
    e.preventDefault();
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <>
      <div className={styles.inputdiv} {...getRootProps()}>
        <input className={styles.dragfiles} {...getInputProps()} onClick={onClickInput}/>
      </div>
    </>
  )
}

export default MainDrop;