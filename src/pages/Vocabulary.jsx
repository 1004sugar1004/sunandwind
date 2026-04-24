import { useState } from 'react';
import { VOCAB_WORDS } from '../data/gameData';
import { speak } from '../utils/speak';

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
            <div className="vocab-icon">
              <img
                src={`/images/icon_${word}.png`}
                alt={word}
                width={70}
                height={70}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="vocab-word">{word}</div>
            <div className="vocab-kor">{korWord}</div>
            <div
              className="vocab-color-badge"
              style={{
                background:
                  color === 'black' ? '#333' :
                  color === 'red'   ? '#DC143C' :
                  color === 'blue'  ? '#4169E1' : '#8B4513',
              }}
            >
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
