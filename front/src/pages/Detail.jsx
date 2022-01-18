import styles from './Detail.module.css';

const Detail = () => {
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
      </div>
    </>
  )
}

export default Detail;