import React, { memo }  from "react";
import styles from './Tag.module.css';

const Tag = memo(({tag}) => {
  return (
    <>
      <span className={styles.container}>
        {tag}
      </span>
    </>
  )
})

export default Tag;