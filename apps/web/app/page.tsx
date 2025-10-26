export default function Page() {
  return (
    <section>
      <h2>시작하기</h2>
      <p>문서 폴더는 <code>docs/</code>에 있습니다. API는 로컬에서 <code>http://localhost:4000</code>으로 기동됩니다.</p>
      <ul>
        <li><a href="/">홈</a></li>
        <li><a href="http://localhost:4000/health" target="_blank">API Health (로컬)</a></li>
      </ul>
    </section>
  );
}
