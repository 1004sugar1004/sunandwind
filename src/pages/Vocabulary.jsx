import { useState } from 'react';
import { VOCAB_WORDS } from '../data/gameData';
import { speak } from '../utils/speak';

const ITEM_ICONS = {
  coat: (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <rect x="20" y="25" width="40" height="42" rx="4" fill="#2C2C2C" />
      <rect x="4" y="25" width="16" height="18" rx="8" fill="#2C2C2C" />
      <rect x="60" y="25" width="16" height="18" rx="8" fill="#2C2C2C" />
      <rect x="28" y="16" width="24" height="14" rx="4" fill="#2C2C2C" />
      <line x1="40" y1="30" x2="40" y2="67" stroke="#444" strokeWidth="1.5" />
      <circle cx="40" cy="38" r="2" fill="#555" />
      <circle cx="40" cy="48" r="2" fill="#555" />
      <circle cx="40" cy="58" r="2" fill="#555" />
    </svg>
  ),
  sweater: (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <rect x="20" y="28" width="40" height="40" rx="4" fill="#DC143C" />
      <rect x="4" y="28" width="16" height="18" rx="8" fill="#DC143C" />
      <rect x="60" y="28" width="16" height="18" rx="8" fill="#DC143C" />
      <rect x="28" y="18" width="24" height="16" rx="4" fill="#DC143C" />
      <ellipse cx="40" cy="19" rx="10" ry="6" fill="none" stroke="#B00000" strokeWidth="2" />
    </svg>
  ),
  jeans: (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <rect x="16" y="15" width="48" height="12" rx="3" fill="#3259C1" />
      <rect x="16" y="25" width="22" height="48" rx="4" fill="#4169E1" />
      <rect x="42" y="25" width="22" height="48" rx="4" fill="#4169E1" />
      <rect x="16" y="15" width="48" height="10" rx="3" fill="#3259C1" />
      <rect x="33" y="16" width="14" height="8" rx="2" fill="#2848A8" />
    </svg>
  ),
  boots: (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <rect x="22" y="15" width="18" height="38" rx="4" fill="#8B4513" />
      <rect x="16" y="46" width="30" height="18" rx="5" fill="#8B4513" />
      <rect x="12" y="56" width="38" height="12" rx="5" fill="#7A3A11" />
      <rect x="42" y="15" width="18" height="38" rx="4" fill="#8B4513" />
      <rect x="36" y="46" width="30" height="18" rx="5" fill="#8B4513" />
      <rect x="32" y="56" width="38" height="12" rx="5" fill="#7A3A11" />
    </svg>
  ),
};

export default function Vocabulary({ onNavigate }) {
  const [active, setActive] = useState(null);

  const handleCard = (word) => {
    setActive(word);
    const found = VOCAB_WORDS.find(v => v.word === word);
    if (found) speak(found.sentence);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← 뒤로</button>
        <h2>📚 단어 학습</h2>
      </div>

      <p className="page-hint">카드를 눌러 발음을 들어보세요!</p>

      <div className="vocab-grid">
        {VOCAB_WORDS.map(({ word, color, colorKo, korWord, sentence }) => (
          <button
            key={word}
            className={`vocab-card-item ${active === word ? 'active' : ''}`}
            onClick={() => handleCard(word)}
          >
            <div className="vocab-icon">{ITEM_ICONS[word]}</div>
            <div className="vocab-word">{word}</div>
            <div className="vocab-kor">{korWord}</div>
            <div className="vocab-color-badge" style={{ background: color === 'black' ? '#333' : color === 'red' ? '#DC143C' : color === 'blue' ? '#4169E1' : '#8B4513' }}>
              {colorKo}
            </div>
            {active === word && (
              <div className="vocab-sentence">🔊 {sentence}</div>
            )}
          </button>
        ))}
      </div>

      <div className="vocab-sentences">
        <h3>📖 문장으로 익혀요</h3>
        {VOCAB_WORDS.map(({ word, sentence }) => (
          <button
            key={word}
            className="sentence-row"
            onClick={() => speak(sentence)}
          >
            <span className="sentence-num">🔊</span>
            <span>{sentence}</span>
          </button>
        ))}
      </div>

      <button className="primary-btn" onClick={() => onNavigate('game')}>
        🎲 게임 시작하기!
      </button>
    </div>
  );
}
