import React, { memo } from 'react';
import styles from './Main.module.css';
import store from '../store';
import MainHeader from '../components/MainHeader';
import MainList from '../components/MainList';
import MainFooter from '../components/MainFooter';

const Main = () => {
  return (
    <div>
      <MainHeader />
      <MainList />
      <MainFooter />
    </div>
  )
}
export default Main;