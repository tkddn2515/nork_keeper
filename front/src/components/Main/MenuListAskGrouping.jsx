import styles from './MenuListAskGrouping.module.css';

const MenuListAskGrouping = ({uploadContainer}) => {

  const onClickYes = () => {
    uploadContainer(true);
  }

  const onClickNo = () => {
    uploadContainer(false);
  }

  return (
    <>
      <div className={`${styles.background} center`}>
        <div className={`${styles.container} center`}>
          <div className={styles.img}>!</div>
          <div className={styles.content}>그룹핑(grouping)<br />하시겠습니까?</div>
          <div className={styles.btns}>
            <span className={styles.btn} onClick={onClickYes}>YES</span>
            <span className={styles.btn} onClick={onClickNo}>NO</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuListAskGrouping;