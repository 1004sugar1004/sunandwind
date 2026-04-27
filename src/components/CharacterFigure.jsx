const LAYERS = ['boots', 'jeans', 'sweater', 'coat', 'hair'];

export default function CharacterFigure({ items = [], size = 180, windEffect = false }) {
  const width  = size;
  const height = Math.round(size * (900 / 480));

  return (
    /* 바깥 wrapper: wind 효과만 담당 */
    <div
      style={{
        flexShrink: 0,
        transition: 'transform 0.4s ease, filter 0.4s ease',
        filter:    windEffect ? 'drop-shadow(0 0 10px #7eb4d4)' : 'none',
        transform: windEffect ? 'rotate(-5deg)' : 'none',
      }}
    >
      {/*
        isolation: isolate  → mix-blend-mode 가 이 박스 안에서만 동작, 실크 배경 투과 차단
        background: white   → 흰 배경 보장, multiply 가 의도대로 동작
      */}
      <div
        style={{
          position: 'relative',
          width,
          height,
          background: 'white',
          isolation: 'isolate',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Base character */}
        <img
          src="/images/char_base.png"
          alt="character"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
          }}
        />

        {/* Clothing layers */}
        {LAYERS.map((item) => {
          if (!items.includes(item)) return null;

          // 기본 스타일 (기존 전체 덮기)
          const baseStyle = {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            mixBlendMode: 'multiply',
            transition: 'opacity 0.35s ease',
          };

          // 청바지(jeans) 전용 위치/크기 조정
          const overrideStyle = item === 'jeans' ? {
            inset: 'auto',
            top: '52.4%',       // 허리선 (716px)
            left: '0',
            width: '100%',
            height: '40.4%',    // 허리~발목 길이 (552px)
            objectPosition: 'center top', // 이미지의 위쪽을 허리선에 맞춤
          } : {};

          return (
            <img
              key={item}
              src={`/images/char_${item}.png`}
              alt={item}
              style={{ ...baseStyle, ...overrideStyle }}
            />
          );
        })}
      </div>
    </div>
  );
}
