import React, { memo, useState, useRef, useMemo } from 'react'
import styles from './LoginForm.module.css';
import { SET_MEMBER } from '../store';
import { get, post } from '../api/axios';
import { connect } from 'react-redux';

const PageType = {
  Login: "Login",
  About: "About",
  Create: "Create"
};

const LoginForm = ({ member, setLoginAbount, setMember }) => {
  const [codeInput, setCodeInput] = useState('');
  const [pageType, setPageType] = useState(PageType.Login);
  const [createCodeMessage, setCreateCodeMessage] = useState("");
  const [created, setCreated] = useState(false);
  const loginForm = useRef(null);

  // 로그인 버튼 클릭 시
  const onSubmitLogin = (e) => {
    e.preventDefault();
    onClickLogin();
  }

  // about keeper 눌렀을 시
  const onClickAboutKeeper = () => {
    setPageType(PageType.About);
    const form_div = loginForm.current.children[0];
    const form_input = loginForm.current.children[1];
    const form_btn = loginForm.current.children[2];
    const form_span = loginForm.current.children[3];

    loginForm.current.style.top = "0%";
    loginForm.current.style.height= "108px";
    loginForm.current.style.paddingTop= "30px";
    loginForm.current.style.marginTop= "0";
    loginForm.current.style.transform= "translate(-50%, 0%)";

    form_div.style.display = "none";

    form_input.style.display = "inline-block";

    form_btn.style.display = "inline-block";
    form_btn.style.width = "122px";
    form_btn.style.height = "44px";
    form_btn.style.margin = "0 16px";

    form_span.style.verticalAlign= "bottom";

    setLoginAbount(true);
  };

  // input값 변경시
  const onChangeCodeInput = (e) => {
    setCodeInput(e.target.value);
  };

  const onClickLogin = async () => {
    if(pageType === PageType.Login || pageType === PageType.About) {
      // 로그인
      login();

    } else {
      if(!created) {
        // 계정 생성
        const data = {
          "code": codeInput
        };
        const res = await post('/member/join', data);
        console.log(res);
        if(res) {
          setCreateCodeMessage("코드가\n생성되었습니다.");
          setCreated(true);
          setMember({ id: res.id, code: codeInput });
        } else {
          setCreateCodeMessage("이미 존재하는\n코드입니다.");
        }
      } else {
        login();
      }
      
    }
  };

  const login = async () => {
    const data = { code : codeInput };
    const res = await get('/member/login', data);
    if(res) {
      setMember({ id: res.id, code: codeInput });
    } else {
      setCreateCodeMessage("존재하지 않는 코드입니다.");
    }
  };

  // create 버튼 누를 시
  const onClickCreateCode = () => {
    setPageType(PageType.Create);
    setCreateCodeMessage("영소문자, 특수문자( . _ ), 숫자를\n조합할 수 있습니다.");
  };

  return (
    <>
      <form className={styles.center} ref={loginForm} onSubmit={onSubmitLogin}>
        {pageType === PageType.Login && <div className={styles.aboutKeeper} onClick={onClickAboutKeeper}>About KEEPER</div>}
        {createCodeMessage && <div className={styles.createCodeMessage}>{createCodeMessage}</div>}
        <input className={styles.codeInput} value={codeInput} onChange={onChangeCodeInput} placeholder='코드입력' maxLength={255}/>
        <button className={styles.btn}>{pageType === PageType.Create && !created ? "Create Code" : "ENTER"}</button>
        {(pageType === PageType.Login || pageType === PageType.About) && <span className={styles.btn_createcode} onClick={onClickCreateCode} >CREATE CODE</span>}
      </form>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    member: state.member
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setLoginAbount: ownProps.setLoginAbount,
    setMember: data => dispatch(SET_MEMBER(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);