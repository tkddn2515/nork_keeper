import React, { memo } from "react";
import styles from './MenuListItem.module.css';
import Tag from './Tag';

const MenuListItem = memo(({container}) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.thumbnail_container}>
          <img className={`${styles.thumbnail_back} center`} src={container.thumb} alt=""/>
          <img className={`${styles.thumbnail} center`} src={container.thumb} alt=""/>
        </div>
        <div className={styles.createtime}>{container.createtime.slice(0, 10)}</div>
        <img className={styles.download} alt="" />
        <div className={styles.title}>{container.name}</div>
        {container.tags.map((v, idx) => <Tag tag={v} key={idx}/>)}
        <Tag tag='+'/>
      </div>
    </>
  )
});

export default MenuListItem;