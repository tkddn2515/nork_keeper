import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import styles from './MainList.module.css';
import MenuListAdd from './MenuListAdd';
import MenuListAskGrouping from './MenuListAskGrouping';
import MenuListItem from './MenuListItem';
import { get, post } from '../../api/axios';
import store, { SET_CONTAINERS, SORT_CONTAINERS, PAGE_CONTAINERS } from '../../store';
import { useNavigate } from 'react-router';
import MainListDate from './MainListDate';

const MainList = ({ member, containers, containersSetting, showAskGrouping, setContainers, sortContainers, pageContainers, uploadContainer }) => {

  const [showDate, setShowDate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(member.id === -1) {
      navigate("/");
    }

    getContainers();
  }, [containersSetting.page, containersSetting.total, containersSetting.sort, containersSetting.term, containersSetting.limit, containersSetting.tag])

  const getContainers = async () => {
    if(member.id === -1) {
      return;
    }

    const data = {
      id: member.id,
      page: containersSetting.page,
      limit: containersSetting.limit,
      sort: containersSetting.sort,
      term: containersSetting.term.join(','),
      tag: containersSetting.tag.join(',¡¿'),
    }
    const res = await get("/container", data);
    setContainers(res);
  }

  const onClickSortLatest = useCallback(() => {
    sortContainers(0);
  }, [])

  const onClickSortOlder = useCallback(() => {
    sortContainers(1);
  }, [])

  const onClickBtnPrevPage = useCallback(() => {
    const curPage = containersSetting.page;
    const div = curPage % 4;
    let goPage = curPage - div + (div === 0 ? -3 : 1);
    pageContainers(goPage - 1);
  }, [containersSetting.page])

  const onClickGoPage = useCallback((v) => {
    if(v === containersSetting.page) {
      return;
    }
    pageContainers(v);
  }, [containersSetting.page])

  const onClickBtnNextPage = useCallback(() => {
    const curPage = containersSetting.page;
    const div = curPage % 4;
    let goPage = curPage - div + (div === 0 ? -3 : 1);
    pageContainers(goPage + 4);
  }, [containersSetting.page])
  
  const pages = useCallback(() => {

    if(member.id === -1) {
      return; 
    }

    if(containers.length === 0) {
      return;
    }

    const curPage = containersSetting.page;
    const totalPage = Math.ceil(containersSetting.total / containersSetting.limit);
    
    const isStartPages = [1, 2, 3, 4].includes(containersSetting.page);
    let lastStart = totalPage - totalPage % 4 + 1;
    const lastPages = Array(totalPage % 4).fill().map(v => lastStart++);
    const isLastPages = lastPages.includes(containersSetting.page)

    // 현재 페이지들 < 1 2 3 4 > 이거
    const div = curPage % 4;
    let curStart = curPage - div + (div === 0 ? -3 : 1);
    const curPages = isLastPages ? lastPages : Array(4).fill().map(v => curStart++);

    return <>
      <div className={`${styles.pages}`}>
          {containersSetting.total > 4 && !isStartPages && <img className={styles.prevBtn} alt='' onClick={onClickBtnPrevPage} />}
          {curPages.map((v, idx) => <div key={idx} className={`${styles.page} ${v === curPage ? styles.selectPage : ''}`} onClick={() => { onClickGoPage(v) }}>{v}</div>)}
          {containersSetting.total > 4 && !isLastPages && <img className={styles.nextBtn} alt='' onClick={onClickBtnNextPage} />}
      </div>
    </>
  }, [containersSetting])

  const onClickBtnDate = () => {
    setShowDate(!showDate);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.menu}>
          <span className={`${styles.menu_young} ${containersSetting.sort === 0 ? styles.select : ''}`} onClick={onClickSortLatest}>최신순</span>
          <span className={`${styles.menu_old}  ${containersSetting.sort === 1? styles.select : ''}`} onClick={onClickSortOlder}>오래된순</span>
          <span className={styles.menu_date_container}>
            <img className={styles.menu_date} alt='날짜' onClick={onClickBtnDate}/>
            {showDate && <MainListDate />}
          </span>
        </div>
        <div className={styles.items}>
          {containers.length > 0 && containers.map((v, idx) => <MenuListItem key={v.id} container={v}/>)}
        </div>
        {pages()}
        { containers.length === 0 && <MenuListAdd /> }
        { showAskGrouping && <MenuListAskGrouping uploadContainer={uploadContainer}/> }
      </div>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    member: state.member,
    containers: state.containers,
    containersSetting: state.containersSetting,
    showAskGrouping: ownProps.showAskGrouping,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setContainers: data => dispatch(SET_CONTAINERS(data)),
    sortContainers: data => dispatch(SORT_CONTAINERS(data)),
    pageContainers: data => dispatch(PAGE_CONTAINERS(data)),
    uploadContainer: ownProps.uploadContainer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainList);