import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './MainList.module.css';
import MenuListAdd from './MenuListAdd';
import MenuListAskGrouping from './MenuListAskGrouping';
import MenuListItem from './MenuListItem';
import { get, post } from '../api/axios';
import { SET_CONTAINERS } from '../store';
import { useNavigate } from 'react-router';

const MainList = ({ member, containers, setContainers }) => {

  const navigate = useNavigate();

  const [showAdd, setShowAdd] = useState(false);
  const [showAskGrouping, setShowAskGrouping] = useState(false);

  useEffect(() => {
    if(member.id == -1) {
      navigate("/");
    }

    getContainers();
  }, [])

  const getContainers = async () => {
    const data = {
      id: member.id
    }
    const res = await get("/container", data);
    setContainers(res);
  }
  
  return (
    <>
    <div className={styles.container}>
      <div className={styles.menu}>
        <span className={styles.menu_young}>최신순</span>
        <span className={styles.menu_old}>오래된순</span>
        <img className={styles.menu_date} alt='날짜'/>
      </div>
      <div className={styles.items}>
        {containers.length > 0 && containers.map((v, idx) => <MenuListItem key={v.id} container={v}/>)}
      </div>
      { showAdd && <MenuListAdd /> }
      { showAskGrouping && <MenuListAskGrouping /> }
    </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    member: state.member,
    containers: state.containers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setContainers: data => dispatch(SET_CONTAINERS(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainList);