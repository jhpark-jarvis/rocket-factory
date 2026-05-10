import { useEffect, useState } from 'react';
import styles from '../styles/DbTest.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function DbTestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDbTest() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE_URL}/db-test`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'DB 테스트 API 호출에 실패했습니다.');
        }

        if (!ignore) setData(result);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDbTest();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <h1>DB 연결 테스트</h1>
        <p>백엔드 API에서 MariaDB 연결 상태와 게시글 데이터를 조회합니다.</p>
      </section>

      <section className={styles.statusPanel}>
        {loading && <p className={styles.muted}>불러오는 중...</p>}
        {error && <p className={styles.error}>테스트 실패: {error}</p>}
        {data && (
          <div className={styles.statusGrid}>
            <div>
              <span>상태</span>
              <strong>{data.connected ? '연결 성공' : '연결 실패'}</strong>
            </div>
            <div>
              <span>Database</span>
              <strong>{data.database}</strong>
            </div>
            <div>
              <span>Users</span>
              <strong>{data.counts.users}</strong>
            </div>
            <div>
              <span>Posts</span>
              <strong>{data.counts.posts}</strong>
            </div>
          </div>
        )}
      </section>

      <section className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>작성자</th>
              <th>제목</th>
              <th>조회수</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {data?.posts.map((post) => (
              <tr key={post.PostIdx}>
                <td>{post.PostIdx}</td>
                <td>{post.Nickname || post.UserName || '-'}</td>
                <td>{post.Title}</td>
                <td>{post.ViewCount}</td>
                <td>{new Date(post.RegDT).toLocaleString('ko-KR')}</td>
              </tr>
            ))}
            {!loading && !data?.posts.length && (
              <tr>
                <td colSpan="5" className={styles.empty}>
                  조회된 게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
