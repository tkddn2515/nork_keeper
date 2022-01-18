import React from 'react';
import styles from './MainHeader.module.css';
import store from '../store';

const MainHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>KEEPER</div>
      <img className={styles.title_share} alt='공유'/>
      <div className={styles.title_code}>{store.getState().member.code}</div>
    </div>
  )
}

export default MainHeader;