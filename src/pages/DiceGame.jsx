import { useState, useCallback } from 'react';
import CharacterFigure from '../components/CharacterFigure';
import DiceRoller from '../components/DiceRoller';
import { DICE_DATA, ITEMS, ITEM_LABELS, ITEM_COLORS } from '../data/gameData';
import { speak } from '../utils/speak';

const RPS_OPTIONS = [
  { label: '✊', name: 'Rock (바위)' },
  { label: '✋', name: 'Paper (보)' },
  { label: '✌️', name: 'Scissors (가위)' },
];

function getRPSWinner(a, b) {
  if (a === b) return -1;
  if ((a === 0 && b === 2) || (a === 2 && b === 1) || (a === 1 && b === 0)) return 0;
  return 1;
}

function RPSPhase({ onDone }) {
  const [step, setStep] = useState('p1');
  const [p1, setP1] = useState(null);

  const handleP1Pick = (i) => { setP1(i); setStep('transit'); };

  const handleP2Pick = (i) => {
    const winner = getRPSWinner(p1, i);
    setStep('result_' + p1 + '_' + i + '_' + winner);
    setTimeout(() => {
      if (winner === -1) {
        setP1(null);
        setStep('p1');
      } else {
        onDone(winner);
      }
    }, 2000);
  };

  if (step === 'p1') return (
    <div className="rps-phase">
      <div className="rps-cloud">🌬️</div>
      <h2>가위바위보!</h2>
      <p className="rps-hint"><strong>Player 1</strong>, 선택하세요 (상대방은 보지 마세요!)</p>
      <div className="rps-btns">
        {RPS_OPTIONS.map((o, i) => (
          <button key={i} className="rps-btn" onClick={() => handleP1Pick(i)}>
            <span className="rps-emoji">{o.label}</span>
            <span className="rps-name">{o.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (step === 'transit') return (
    <div className="rps-phase">
      <div className="rps-cloud">✅</div>
      <h2>Player 1 선택 완료!</h2>
      <p className="rps-hint"><strong>Player 2</strong>에게 기기를 넘겨주세요</p>
      <button className="primary-btn" onClick={() => setStep('p2')}>Player 2 준비 완료!</button>
    </div>
  );

  if (step === 'p2') return (
    <div className="rps-phase">
      <div className="rps-cloud">🌬️</div>
      <h2>가위바위보!</h2>
      <p className="rps-hint"><strong>Player 2</strong>, 선택하세요</p>
      <div className="rps-btns">
        {RPS_OPTIONS.map((o, i) => (
          <button key={i} className="rps-btn" onClick={() => handleP2Pick(i)}>
            <span className="rps-emoji">{o.label}</span>
            <span className="rps-name">{o.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const parts = step.split('_');
  const rA = parseInt(parts[1]);
  const rB = parseInt(parts[2]);
  const rW = parseInt(parts[3]);
  return (
    <div className="rps-phase">
      <div className="rps-reveal">
        <div className="rps-result-box" style={{ borderColor: 'var(--p1)' }}>
          <div className="rps-result-emoji">{RPS_OPTIONS[rA].label}</div>
          <div>Player 1</div>
        </div>
        <div className="rps-vs">VS</div>
        <div className="rps-result-box" style={{ borderColor: 'var(--p2)' }}>
          <div className="rps-result-emoji">{RPS_OPTIONS[rB].label}</div>
          <div>Player 2</div>
        </div>
      </div>
      {rW === -1
        ? <p className="rps-outcome">🤝 비겼어요! 다시 해요!</p>
        : <p className="rps-outcome">🎉 Player {rW + 1} 선공!</p>
      }
    </div>
  );
}

function ItemChecklist({ items }) {
  return (
    <div className="item-checklist">
      {ITEMS.map(item => (
        <span
          key={item}
          className="check-chip"
          style={{ background: items.includes(item) ? ITEM_COLORS[item] : '#ddd', color: items.includes(item) ? 'white' : '#999' }}
        >
          {items.includes(item) ? '✓' : '○'} {ITEM_LABELS[item]}
        </span>
      ))}
    </div>
  );
}

export default function DiceGame({ onNavigate }) {
  const [phase, setPhase] = useState('rps');
  const [currentTurn, setCurrentTurn] = useState(0);
  const [totalRolls, setTotalRolls] = useState(0);
  const [players, setPlayers] = useState([
    { name: 'Player 1', items: [] },
    { name: 'Player 2', items: [] },
  ]);
  const [lastAction, setLastAction] = useState(null);
  const [windTarget, setWindTarget] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleRoll = useCallback((face) => {
    const data = DICE_DATA[face - 1];
    speak(data.sentence);
    setWaiting(true);

    const nextTotalRolls = totalRolls + 1;
    const newPlayers = players.map(p => ({ ...p, items: [...p.items] }));
    let action;
    let isWin = false;
    let nextTurn = 1 - currentTurn;

    if (data.item === 'wind') {
      const pItems = newPlayers[currentTurn].items;
      if (pItems.length > 0) {
        const idx = Math.floor(Math.random() * pItems.length);
        const removed = pItems[idx];
        newPlayers[currentTurn].items.splice(idx, 1);
        action = { type: 'wind', item: removed, sentence: data.sentence };
        setWindTarget(currentTurn);
      } else {
        action = { type: 'wind_empty', item: null, sentence: data.sentence };
        setWindTarget(currentTurn);
      }
    } else {
      const item = data.item;
      const pItems = newPlayers[currentTurn].items;
      if (pItems.includes(item)) {
        action = { type: 'pass', item, sentence: data.sentence };
      } else {
        pItems.push(item);
        action = { type: 'add', item, sentence: data.sentence };
        isWin = ITEMS.every(i => pItems.includes(i));
        if (isWin) nextTurn = currentTurn;
      }
    }

    setLastAction(action);
    setPlayers(newPlayers);
    setTotalRolls(nextTotalRolls);

    const isEndRound = nextTotalRolls >= 30 && nextTotalRolls % 2 === 0;
    const p1Score = newPlayers[0].items.length;
    const p2Score = newPlayers[1].items.length;

    if (isWin) {
      setWinner(currentTurn);
      setTimeout(() => { setPhase('finished'); setWaiting(false); }, 2500);
    } else if (isEndRound && p1Score !== p2Score) {
      setWinner(p1Score > p2Score ? 0 : 1);
      setTimeout(() => { setPhase('finished'); setWaiting(false); }, 2500);
    } else {
      setTimeout(() => {
        setCurrentTurn(nextTurn);
        setLastAction(null);
        setWindTarget(null);
        setWaiting(false);
      }, 2500);
    }
  }, [players, currentTurn, totalRolls]);

  const resetGame = () => {
    setPhase('rps');
    setCurrentTurn(0);
    setTotalRolls(0);
    setPlayers([{ name: 'Player 1', items: [] }, { name: 'Player 2', items: [] }]);
    setLastAction(null);
    setWindTarget(null);
    setWaiting(false);
    setWinner(null);
  };

  if (phase === 'rps') return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← 뒤로</button>
        <h2>🎲 주사위 게임</h2>
      </div>
      <RPSPhase onDone={(firstPlayer) => { setCurrentTurn(firstPlayer); setPhase('playing'); }} />
    </div>
  );

  if (phase === 'finished') return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← 홈으로</button>
        <h2>🏆 게임 종료!</h2>
      </div>
      <div className="finished-screen">
        <div className="winner-banner">
          🎉 {players[winner].name} 승리! {players[winner].items.length < 5 ? '(판정승)' : ''} 🎉
        </div>
        <div className="finish-figures">
          {players.map((p, i) => (
            <div key={i} className={`finish-player ${i === winner ? 'winner' : ''}`}>
              <div className="player-label" style={{ color: i === 0 ? 'var(--p1)' : 'var(--p2)' }}>{p.name}</div>
              <CharacterFigure items={p.items} size={150} />
              <ItemChecklist items={p.items} />
            </div>
          ))}
        </div>
        <div className="finish-btns">
          <button className="primary-btn" onClick={resetGame}>🔄 다시 하기</button>
          <button className="secondary-btn" onClick={() => onNavigate('sentence')}>✏️ 문장 완성하기</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← 뒤로</button>
        <h2>🎲 주사위 게임</h2>
      </div>

      <div className="turn-banner" style={{ background: currentTurn === 0 ? 'var(--p1)' : 'var(--p2)' }}>
        {players[currentTurn].name}의 차례!
      </div>

      {lastAction && (
        <div className={`action-banner ${lastAction.type}`}>
          {lastAction.type === 'wind' && <>💨 바람이 불었어요! <strong>{ITEM_LABELS[lastAction.item]}</strong>이(가) 날아갔어요!</>}
          {lastAction.type === 'wind_empty' && <>💨 바람이 불었어요! 하지만 날아갈 아이템이 없어요.</>}
          {lastAction.type === 'add' && <>✅ <strong>{lastAction.sentence}</strong></>}
          {lastAction.type === 'pass' && <>➡️ 이미 있어요! <strong>PASS!</strong></>}
        </div>
      )}

      <div className="game-field">
        {players.map((player, i) => (
          <div
            key={i}
            className={`player-zone ${i === currentTurn ? 'active-player' : ''}`}
            style={{ borderColor: i === 0 ? 'var(--p1)' : 'var(--p2)' }}
          >
            <div className="player-label" style={{ color: i === 0 ? 'var(--p1)' : 'var(--p2)' }}>
              {player.name}
            </div>
            <CharacterFigure
              items={player.items}
              size={140}
              windEffect={windTarget === i}
            />
            <ItemChecklist items={player.items} />
            <div className="item-count">
              {player.items.length} / {ITEMS.length}
            </div>
          </div>
        ))}
      </div>

      <div className="dice-area">
        <DiceRoller onRoll={handleRoll} disabled={waiting} />
      </div>

      <div className="rules-hint">
        <span>💡 주사위 6: <strong>바람이 불어 아이템이 날아가요!</strong></span>
        <span> · 이미 있는 아이템: <strong>PASS!</strong></span>
        <span> · 5개 먼저 모으면 승리! (진행: {totalRolls >= 30 ? '연장전' : `${Math.floor(totalRolls / 2) + 1}턴/15턴`})</span>
      </div>
    </div>
  );
}
