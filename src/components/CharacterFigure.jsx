const LAYERS = ['boots', 'jeans', 'sweater', 'coat', 'hair'];

export default function CharacterFigure({ items = [], size = 180, windEffect = false }) {
  const width  = size;
  const height = Math.round(size * (900 / 480));

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        flexShrink: 0,
        transition: 'transform 0.4s ease, filter 0.4s ease',
        filter:    windEffect ? 'drop-shadow(0 0 10px #7eb4d4)' : 'none',
        transform: windEffect ? 'rotate(-5deg)' : 'none',
      }}
    >
      {/* Base character */}
      <img
        src="/images/char_base.png"
        alt="character"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />

      {/* Clothing layers — rendered in correct order */}
      {LAYERS.map((item) =>
        items.includes(item) ? (
          <img
            key={item}
            src={`/images/char_${item}.png`}
            alt={item}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'opacity 0.35s ease',
              opacity: 1,
            }}
          />
        ) : null
      )}
    </div>
  );
}
