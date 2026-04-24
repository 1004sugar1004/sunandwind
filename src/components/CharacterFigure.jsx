const SKIN = '#FDBCB4';
const SKIN_BORDER = '#E8A87C';

export default function CharacterFigure({ items = [], size = 180, windEffect = false }) {
  const has = (item) => items.includes(item);
  const height = Math.round(size * (300 / 160));

  return (
    <svg
      viewBox="0 0 160 300"
      width={size}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: 'all 0.4s ease',
        filter: windEffect ? 'drop-shadow(0 0 8px #7eb4d4)' : 'none',
        transform: windEffect ? 'rotate(-5deg)' : 'none',
      }}
    >
      {/* ── Base skin (drawn first, clothing layers on top) ── */}
      <rect x="49" y="170" width="28" height="95" rx="5" fill={SKIN} />
      <rect x="83" y="170" width="28" height="95" rx="5" fill={SKIN} />
      <rect x="44" y="93" width="72" height="82" rx="5" fill={SKIN} stroke={SKIN_BORDER} strokeWidth="1" />
      <rect x="10" y="93" width="34" height="20" rx="10" fill={SKIN} stroke={SKIN_BORDER} strokeWidth="1" />
      <rect x="116" y="93" width="34" height="20" rx="10" fill={SKIN} stroke={SKIN_BORDER} strokeWidth="1" />

      {/* ── BOOTS ── */}
      {has('boots') && (
        <g>
          <rect x="44" y="247" width="38" height="22" rx="5" fill="#8B4513" stroke="#6B3410" strokeWidth="1" />
          <rect x="82" y="247" width="38" height="22" rx="5" fill="#8B4513" stroke="#6B3410" strokeWidth="1" />
          <rect x="40" y="255" width="46" height="14" rx="5" fill="#7A3A11" />
          <rect x="78" y="255" width="46" height="14" rx="5" fill="#7A3A11" />
        </g>
      )}

      {/* ── JEANS ── */}
      {has('jeans') && (
        <g>
          <rect x="47" y="168" width="31" height="82" rx="4" fill="#4169E1" />
          <rect x="82" y="168" width="31" height="82" rx="4" fill="#4169E1" />
          <rect x="46" y="163" width="68" height="13" rx="3" fill="#3259C1" />
        </g>
      )}

      {/* ── SWEATER ── */}
      {has('sweater') && (
        <g>
          <rect x="42" y="90" width="76" height="83" rx="6" fill="#DC143C" />
          <rect x="8" y="90" width="34" height="22" rx="11" fill="#DC143C" />
          <rect x="118" y="90" width="34" height="22" rx="11" fill="#DC143C" />
          <rect x="65" y="74" width="30" height="22" rx="5" fill="#DC143C" />
        </g>
      )}

      {/* ── COAT ── */}
      {has('coat') && (
        <g>
          <rect x="36" y="86" width="88" height="90" rx="7" fill="#2C2C2C" />
          <rect x="4" y="86" width="32" height="25" rx="12" fill="#2C2C2C" />
          <rect x="124" y="86" width="32" height="25" rx="12" fill="#2C2C2C" />
          <rect x="62" y="70" width="36" height="23" rx="5" fill="#2C2C2C" />
          <line x1="80" y1="93" x2="80" y2="176" stroke="#3A3A3A" strokeWidth="1.5" />
          <circle cx="80" cy="113" r="2.5" fill="#555" />
          <circle cx="80" cy="133" r="2.5" fill="#555" />
          <circle cx="80" cy="153" r="2.5" fill="#555" />
        </g>
      )}

      {/* ── HEAD (drawn after clothing so face is always on top) ── */}
      <circle cx="80" cy="46" r="34" fill={SKIN} stroke={SKIN_BORDER} strokeWidth="1.5" />
      <ellipse cx="46" cy="50" rx="7" ry="11" fill={SKIN} stroke={SKIN_BORDER} strokeWidth="1.5" />
      <ellipse cx="114" cy="50" rx="7" ry="11" fill={SKIN} stroke={SKIN_BORDER} strokeWidth="1.5" />
      <rect x="72" y="78" width="16" height="20" fill={SKIN} />

      {/* Eyes */}
      <circle cx="70" cy="44" r="4" fill="#2C1810" />
      <circle cx="90" cy="44" r="4" fill="#2C1810" />
      <circle cx="71.5" cy="43" r="1.5" fill="white" />
      <circle cx="91.5" cy="43" r="1.5" fill="white" />
      {/* Eyebrows */}
      <path d="M 63 37 Q 70 33 77 37" fill="none" stroke="#5A3A2A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 83 37 Q 90 33 97 37" fill="none" stroke="#5A3A2A" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <circle cx="80" cy="52" r="2.5" fill={SKIN_BORDER} />
      {/* Mouth */}
      <path d="M 73 60 Q 80 67 87 60" fill="none" stroke="#C08870" strokeWidth="2" strokeLinecap="round" />

      {/* ── HAIR ── */}
      {has('hair') && (
        <g fill="#8B4513">
          <ellipse cx="80" cy="16" rx="35" ry="17" />
          <ellipse cx="47" cy="40" rx="12" ry="19" />
          <ellipse cx="113" cy="40" rx="12" ry="19" />
        </g>
      )}
    </svg>
  );
}
