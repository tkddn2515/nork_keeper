import React from 'react';
import styles from './MainFooter.module.css';

const MainFooter = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.title}>CONTACT</div>
        <div className={styles.mail}>contact@nork.so</div>
      </div>
    </>
  )
}

export default MainFooter;