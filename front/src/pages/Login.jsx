import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import LoginDes from '../components/LoginDes';
import LoginForm from '../components/LoginForm';

const Login = memo(({ member }) => {
  const [loginAbout, setLoginAbount] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if(member.id >= 0) {
      console.log('로그인이다.');
      navigate("/main");
    }
  }, [member])


  return (
    <>
      <LoginForm setLoginAbount={setLoginAbount}/>
      <LoginDes loginAbout={loginAbout}/>
    </>
  )
})

const mapStateToProps = (state) => {
  return {
    member: state.member
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);