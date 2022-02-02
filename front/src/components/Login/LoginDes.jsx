import React, { memo, useState, useRef, useEffect, useCallback } from 'react'
import styles from './LoginDes.module.css';
import store from '../../store';

const LoginDes = memo(({loginAbout})=> {

  const aboutForm = useRef(null);

  useEffect(()=> {
    
    window.addEventListener("resize", displayWindowSize);
    return () => {
      window.removeEventListener("resize", displayWindowSize);
    }
  }, []);

  useEffect(() => {
    if(loginAbout) {
      onClickAboutKeeper();
    }
  }, [loginAbout])

  const displayWindowSize = () => {
    
  }

  // about keeper 눌렀을 시
  const onClickAboutKeeper = useCallback(async () => {
    if(!aboutForm) {
      return;
    }
    aboutForm.current.style.display= "block";
    setTimeout(() => {
      aboutForm.current.style.marginTop = "108px";
    }, 10)
  },[])

  return (
    <div className={styles.about}  ref={aboutForm}>
      {/* 1. Des */}
      <div className={styles.des_form}>
        <img className={styles.des_back} alt=''/>
        <img className={styles.des_front} alt=''/>
        <div className='center'>
          <div className={styles.des_text_title}>KEEPER</div>
          <div className={styles.des_text_content}>
            키퍼(KEEPER)는,<br/>
            사진을 사랑하는 사람들이 만든 공간입니다.<br/>
            고화질 사진을 코드 하나로 관리해보세요.<br/>
          </div>
        </div>
      </div>
      {/* 2. Promise */}
      <div className={styles.promise_form}>
        <img className={styles.promise_back} alt=''></img>
        <div className={`styles.promise_center center`}>
          <div  className={styles.promise_title}>
            /<br />
            KEEPER<br />
            3가지 약속<br />
          </div>
          <div className={styles.promise_contents}>
            <div className={styles.promise_content}>
              누구나<br />
              코드를<br />
              만들 수 있습니다.
            </div>
            <div className={styles.promise_content}>
              어디서든<br />
              자신의 이미지를<br />
              저장할 수 있습니다.
            </div>
            <div className={styles.promise_content}>
              링크로<br />
              누구에게나<br />
              공유할 수 있습니다.
            </div>
          </div>
        </div>
        
      </div>
      {/* 3. Use Case */}
      <div className={styles.usecase_form}>
        <div className={styles.usecase_title}>
          /<br />
          KEEPER<br />
          USECASE
        </div>
        {/* case content 1 */}
        <div className={styles.usecase_content}>
          <div className={styles.usecase_content_title}>
            기록의 자유
          </div>
          <div className={styles.usecase_content_des}>
            특정 플랫폼에 가입하지 않아도, 일상을 기록할 수 있습니다.
          </div>
          <div className={styles.usecase_content_imgs}>
            <img src='./assets/img/usecase_1-1.jpg' alt=''/>
            <img src='./assets/img/usecase_1-2.jpg' alt=''/>
          </div>
        </div>
        {/* case content 2 */}
        <div className={styles.usecase_content}>
          <div className={styles.usecase_content_title}>
            태그 관리
          </div>
          <div className={styles.usecase_content_des}>
            폴더를 생성하지 않아도, 태그 하나로 여러 사진을 관리할 수 있습니다.
          </div>
          <div className={styles.usecase_content_imgs}>
            <img src='./assets/img/usecase_2-1.jpg' alt=''/>
            <img src='./assets/img/usecase_2-2.jpg' alt=''/>
          </div>
        </div>
        {/* case content 3 */}
        <div className={styles.usecase_content}>
          <div className={styles.usecase_content_title}>
            드래그 이동
          </div>
          <div className={styles.usecase_content_des}>
            드래그를 통해 손쉽게 이미지를 이동할 수 있습니다.
          </div>
          <div className={styles.usecase_content_imgs}>
            <img src='./assets/img/usecase_3-1.jpg' alt=''/>
            <img src='./assets/img/usecase_3-2.jpg' alt=''/>
          </div>
        </div>
      </div>
      {/* 4. Start */}
      <div className={styles.start_form}>
        <div className={styles.start_line}></div>
        <div className={`${styles.start_title} center`}>
          /<br />
          KEEPER<br />
          시작해보세요.
        </div>
      </div>
      {/* 5. Footer */}
      <footer>
        <span className={styles.footer_title}>CONTACT</span>
        <span className={styles.footer_content}>contact@nork.so</span>
      </footer>
    </div>
  )
})

export default LoginDes;