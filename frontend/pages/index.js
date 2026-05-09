import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from '../styles/Home.module.css';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost');

export default function Home() {
  const [status, setStatus] = useState('연결 중...');

  useEffect(() => {
    socket.on('connect', () => {
      setStatus('연결됨');
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setStatus('연결 끊김');
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      setStatus(`오류: ${error}`);
      console.error('Socket error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1>Rocket Factory</h1>
      <h2>히히 로켓발싸-!</h2>
      <p>Socket 상태: {status}</p>
      <p>Next.js + Socket.io 프론트엔드</p>
    </div>
  );
}
