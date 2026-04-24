export default function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="sun-icon">☀️</div>
        <h1>The North Wind<br />and the Sun</h1>
        <p className="home-subtitle">천재(함) 6학년 6단원 · 외모와 옷차림 묘사하기</p>
      </div>

      <div className="home-cards">
        <button className="home-card vocab-card" onClick={() => onNavigate('vocabulary')}>
          <span className="card-emoji">📚</span>
          <span className="card-title">단어 학습</span>
          <span className="card-desc">옷차림 단어를 배워보자!</span>
        </button>

        <button className="home-card game-card" onClick={() => onNavigate('game')}>
          <span className="card-emoji">🎲</span>
          <span className="card-title">주사위 게임</span>
          <span className="card-desc">2인 대전 · 나그네를 완성하라!</span>
        </button>

        <button className="home-card sentence-card" onClick={() => onNavigate('sentence')}>
          <span className="card-emoji">✏️</span>
          <span className="card-title">문장 완성</span>
          <span className="card-desc">나와 친구를 영어로 표현해봐!</span>
        </button>
      </div>

      <div className="home-cloud">🌬️</div>
    </div>
  );
}
