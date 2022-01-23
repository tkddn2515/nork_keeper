import React, { memo, useEffect } from "react";
import store from '../store';
import styles from './MenuListItem.module.css';
import Tag from './Tag';

const MenuListItem = memo(({container}) => {

  const getImagePath = (name, type) => {
    let arr = name.split(".");
    //return `https://nork.kr.object.ncloudstorage.com/keeper/member/${store.getState().member.id}/${arr[0]}_${type}.${arr[1]}`;
    return `../iu.jpg`;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.thumbnail_container}>
          <img className={`${styles.thumbnail_back} center`} src={getImagePath(container.thumb, 2)} alt=""/>
          <img className={`${styles.thumbnail} center`} src={getImagePath(container.thumb, 2)} alt=""/>
        </div>
        <div className={styles.createtime}>{container.createtime.slice(0, 10)}</div>
        <img className={styles.download} alt="" />
        <div className={styles.title}>{container.name}</div>
        {/* <div className={styles.tags}>
          {container.tags.map((v, idx) => <Tag tag={v} key={idx}/>)}
          <Tag tag='+'/>
        </div> */}
      </div>
    </>
  )
});

export default MenuListItem;