import { useState, useEffect } from 'react';
import Silk from '../components/Silk';

export default function Intro({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="intro-root">
      {/* Silk background */}
      <div className="intro-silk">
        <Silk speed={5} scale={1} color="#7B7481" noiseIntensity={1.5} rotation={0} />
      </div>

      {/* Overlay gradient */}
      <div className="intro-overlay" />

      {/* Content */}
      <div className={`intro-content ${visible ? 'intro-visible' : ''}`}>
        <div className="intro-badge">
          <span>☀️</span>
          <span>천재(함) 6학년 6단원</span>
        </div>

        <h1 className="intro-title">
          The North Wind<br />and the Sun
        </h1>

        <p className="intro-sub">나그네의 외투를 벗겨라! 🧥💨</p>

        <button className="intro-btn" onClick={onStart}>
          <span>시작하기</span>
          <span className="intro-arrow">→</span>
        </button>

        <div className="intro-footer">
          옷차림 묘사하기 · 주사위 게임 · 2인 대전
        </div>
      </div>

      {/* Floating decorations */}
      <div className="intro-deco intro-deco-sun">☀️</div>
      <div className="intro-deco intro-deco-cloud">🌬️</div>
    </div>
  );
}
