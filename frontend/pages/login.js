import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Link from 'next/link';
import styles from '../styles/Login.module.css';

export default function Login() {
  // 현재 단계에서는 백엔드 API 호출 없이 form 기본 제출 동작만 막음
  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 나중에 backend/routes 안의 로그인 API와 연결
    console.log('로그인 form 제출');
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <div className={styles.header}>
          <h1>Rocket Factory</h1>
          <p>계정에 로그인하세요</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="emailOrUsername">아이디 또는 이메일</label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              placeholder="아이디 또는 이메일을 입력하세요"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button className={styles.submitButton} type="submit">
            로그인
          </button>
        </form>

        <div className={styles.footer}>
          <p>아직 계정이 없으신가요?</p>
          <Link href="/register">회원가입하러 가기</Link>
        </div>
      </main>
    </div>
  );
}