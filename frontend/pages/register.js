import React from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import styles from '../styles/Register.module.css';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost');

export default function Register() {
    // 아이디 중복확인 버튼 클릭 이벤트
    const handleUserIdCheck = () => {
      // TODO: 나중에 backend/routes/user.js의 아이디 중복확인 API와 연결
      console.log('아이디 중복확인 버튼 클릭');
    };
  
    // 이메일 중복확인 버튼 클릭 이벤트
    const handleEmailCheck = () => {
      // TODO: 나중에 backend/routes/user.js의 이메일 중복확인 API와 연결
      console.log('이메일 중복확인 버튼 클릭');
    };
  
    // 회원가입 form 제출 이벤트
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // TODO: 나중에 backend/routes/user.js의 회원가입 API와 연결
      console.log('회원가입 form 제출');
    };
  
    return (
      <div className={styles.container}>
        <main className={styles.card}>
          <div className={styles.header}>
            <h1>Rocket Factory</h1>
            <p>새 계정을 생성하세요</p>
          </div>
  
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="UserId">아이디</label>
  
              <div className={styles.inputWithButton}>
                <input
                  id="UserId"
                  name="UserId"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  required
                />
  
                <button
                  className={styles.checkButton}
                  type="button"
                  onClick={handleUserIdCheck}
                >
                  중복확인
                </button>
              </div>
            </div>
  
            <div className={styles.inputGroup}>
              <label htmlFor="Email">이메일</label>
  
              <div className={styles.inputWithButton}>
                <input
                  id="Email"
                  name="Email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  required
                />
  
                <button
                  className={styles.checkButton}
                  type="button"
                  onClick={handleEmailCheck}
                >
                  중복확인
                </button>
              </div>
            </div>
  
            <div className={styles.inputGroup}>
              <label htmlFor="Nickname">닉네임</label>
              <input
                id="Nickname"
                name="Nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>
  
            <div className={styles.inputGroup}>
              <label htmlFor="Password">비밀번호</label>
              <input
                id="Password"
                name="Password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
  
            <div className={styles.inputGroup}>
              <label htmlFor="PasswordConfirm">비밀번호 확인</label>
              <input
                id="PasswordConfirm"
                name="PasswordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>
  
            <button className={styles.submitButton} type="submit">
              회원가입
            </button>
          </form>
  
          <div className={styles.footer}>
            <p>이미 계정이 있으신가요?</p>
            <Link href="/login">로그인하러 가기</Link>
          </div>
        </main>
      </div>
    );
  }