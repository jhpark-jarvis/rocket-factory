import io from 'socket.io-client';

/**
 * WebSocket 테스트 스크립트
 * Socket.io를 사용하여 메시지 송수신 테스트
 * 
 * 사용법:
 * node ./backend/sockets/test.js
 */

const SERVER_URL = 'http://localhost:3001';

// 클라이언트 설정
const socket = io(SERVER_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

/**
 * 연결 이벤트
 */
socket.on('connect', () => {
  console.log('[SUCCESS] 서버에 연결되었습니다.');
  console.log(`Socket ID: ${socket.id}\n`);

  // 테스트 메시지 송신
  testMessages();
});

/**
 * 메시지 수신 이벤트
 */
socket.on('message', (data) => {
  console.log('[RECEIVED] 메시지 수신:', data);
});

/**
 * 연결 해제 이벤트
 */
socket.on('disconnect', () => {
  console.log('[INFO] 서버 연결이 해제되었습니다.');
});

/**
 * 에러 이벤트
 */
socket.on('connect_error', (error) => {
  console.error('[ERROR] 연결 오류:', error.message);
});

/**
 * 테스트 메시지 송신 함수
 */
function testMessages() {
  console.log('[TEST] 테스트 메시지 송신 시작\n');

  // Test 1: 간단한 텍스트 메시지
  setTimeout(() => {
    const testMessage1 = 'Hello Server! This is test message 1';
    console.log(`[SEND] 메시지 1: "${testMessage1}"`);
    socket.emit('message', testMessage1);
  }, 1000);

  // Test 2: JSON 객체 메시지
  setTimeout(() => {
    const testMessage2 = {
      type: 'greeting',
      text: 'Hello from WebSocket client',
      timestamp: new Date().toISOString()
    };
    console.log(`[SEND] 메시지 2:`, testMessage2);
    socket.emit('message', testMessage2);
  }, 2000);

  // Test 3: 숫자 데이터
  setTimeout(() => {
    const testMessage3 = {
      action: 'ping',
      value: Math.random() * 100
    };
    console.log(`[SEND] 메시지 3:`, testMessage3);
    socket.emit('message', testMessage3);
  }, 3000);

  // Test 4: 배열 데이터
  setTimeout(() => {
    const testMessage4 = {
      items: ['apple', 'banana', 'cherry'],
      count: 3
    };
    console.log(`[SEND] 메시지 4:`, testMessage4);
    socket.emit('message', testMessage4);
  }, 4000);

  // 5초 후 연결 종료
  setTimeout(() => {
    console.log('\n[INFO] 테스트 완료. 연결을 종료합니다.');
    socket.disconnect();
    process.exit(0);
  }, 5000);
}

/**
 * 프로세스 종료 핸들러
 */
process.on('SIGINT', () => {
  console.log('\n[INFO] 프로세스가 종료됩니다.');
  socket.disconnect();
  process.exit(0);
});
