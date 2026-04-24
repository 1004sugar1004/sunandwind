import { useState } from 'react';
import CharacterFigure from '../components/CharacterFigure';
import { speak } from '../utils/speak';
import { ITEMS } from '../data/gameData';

const HAIR_OPTIONS = ['short', 'long', 'curly', 'straight'];
const CLOTHING_OPTIONS = ['a black coat', 'a red sweater', 'blue jeans', 'brown boots', 'a white shirt', 'black pants'];

function SentenceSection({ title, pronoun, hairPronoun, color }) {
  const [hair, setHair] = useState('');
  const [clothing, setClothing] = useState('');
  const [figureItems, setFigureItems] = useState([]);

  const hairSentence = hair ? `${pronoun === 'I' ? 'I have' : `${pronoun} has`} ${hair} hair.` : '';
  const clothingSentence = clothing ? `${pronoun === 'I' ? 'I am wearing' : `${pronoun} is wearing`} ${clothing}.` : '';

  const speakAll = () => {
    if (!hairSentence && !clothingSentence) return;
    const text = [hairSentence, clothingSentence].filter(Boolean).join(' ');
    speak(text);
  };

  const toggleFigureItem = (item) => {
    setFigureItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="builder-section" style={{ borderTop: `4px solid ${color}` }}>
      <h3 style={{ color }}>{title}</h3>

      <div className="builder-body">
        <div className="builder-figure">
          <CharacterFigure items={figureItems} size={130} />
          <div className="figure-toggles">
            {ITEMS.map(item => (
              <button
                key={item}
                className={`toggle-item ${figureItems.includes(item) ? 'on' : ''}`}
                onClick={() => toggleFigureItem(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="builder-inputs">
          <label className="input-label">
            <span>{pronoun === 'I' ? 'I have' : `${pronoun} has`}</span>
            <select value={hair} onChange={e => setHair(e.target.value)} className="select-input">
              <option value="">___ hair</option>
              {HAIR_OPTIONS.map(h => (
                <option key={h} value={h}>{h} hair</option>
              ))}
            </select>
          </label>

          <label className="input-label">
            <span>{pronoun === 'I' ? 'I am wearing' : `${pronoun} is wearing`}</span>
            <select value={clothing} onChange={e => setClothing(e.target.value)} className="select-input">
              <option value="">___</option>
              {CLOTHING_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          {(hairSentence || clothingSentence) && (
            <div className="sentence-preview">
              {hairSentence && <p>✏️ {hairSentence}</p>}
              {clothingSentence && <p>✏️ {clothingSentence}</p>}
              <button className="speak-btn" onClick={speakAll}>🔊 읽어보기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SentenceBuilder({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← 뒤로</button>
        <h2>✏️ 문장 완성</h2>
      </div>
      <p className="page-hint">나와 친구의 외모와 옷차림을 영어로 표현해봐요!</p>

      <SentenceSection
        title="나 (Me)"
        pronoun="I"
        color="var(--p1)"
      />
      <SentenceSection
        title="친구 (Friend)"
        pronoun="He/She"
        color="var(--p2)"
      />

      <button className="primary-btn" onClick={() => onNavigate('game')}>
        🎲 게임 하러 가기
      </button>
    </div>
  );
}
