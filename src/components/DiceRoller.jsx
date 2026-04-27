import { useState, useRef, useEffect } from 'react';

const PIPS = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 22], [70, 22], [30, 50], [70, 50], [30, 78], [70, 78]],
};

export default function DiceRoller({ onRoll, disabled, neededFaces = [] }) {
  const [face, setFace] = useState(null);
  const [rolling, setRolling] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const roll = () => {
    if (rolling || disabled) return;
    setRolling(true);

    let ticks = 0;
    const total = 14;
    intervalRef.current = setInterval(() => {
      setFace(Math.floor(Math.random() * 6) + 1);
      ticks++;
      if (ticks >= total) {
        clearInterval(intervalRef.current);
        let result;
        if (neededFaces.length > 0 && Math.random() < 0.95) {
          result = neededFaces[Math.floor(Math.random() * neededFaces.length)];
        } else {
          result = Math.floor(Math.random() * 6) + 1;
        }
        setFace(result);
        setRolling(false);
        onRoll(result);
      }
    }, 80);
  };

  const isWind = face === 6 && !rolling;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <button
        onClick={roll}
        disabled={rolling || disabled}
        className={`dice-btn ${rolling ? 'rolling' : ''}`}
        aria-label="Roll dice"
      >
        {face ? (
          <svg viewBox="0 0 100 100" width="90" height="90">
            <rect
              x="5" y="5" width="90" height="90" rx="16"
              fill={isWind ? '#c8e8ff' : 'white'}
              stroke={isWind ? '#4a8fba' : '#333'}
              strokeWidth="3"
            />
            {isWind ? (
              <text x="50" y="63" textAnchor="middle" fontSize="40">💨</text>
            ) : (
              PIPS[face].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="8" fill="#2C2C2C" />
              ))
            )}
          </svg>
        ) : (
          <svg viewBox="0 0 100 100" width="90" height="90">
            <rect x="5" y="5" width="90" height="90" rx="16" fill="white" stroke="#333" strokeWidth="3" />
            <text x="50" y="63" textAnchor="middle" fontSize="48">🎲</text>
          </svg>
        )}
      </button>
      <span className="dice-label">
        {rolling ? '굴리는 중...' : disabled ? '상대방 차례' : '주사위 굴리기!'}
      </span>
    </div>
  );
}
