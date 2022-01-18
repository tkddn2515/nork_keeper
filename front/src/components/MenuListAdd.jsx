import React from 'react';
import styles from './MenuListAdd.module.css';

const MenuListAdd = () => {
  return (
    <>
    <div className={`${styles.add} center`}>
      <img className={styles.add_img} alt='사진을 드래그 해보세요.'/>
      <div className={styles.add_text}>사진을 드래그 해보세요.</div>
    </div>
    </>
  )
}

export default MenuListAdd