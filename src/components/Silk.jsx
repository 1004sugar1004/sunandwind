import { useEffect, useRef } from 'react';

const VERT = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uNoiseIntensity;
  uniform float uRotation;
  uniform vec3  uColor;
  uniform vec2  uResolution;

  mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.35));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = rot2(0.45);
    for (int i = 0; i < 6; i++) {
      v += a * vnoise(p);
      p  = r * p * 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    uv = rot2(uRotation) * uv * uScale;

    float t  = uTime * uSpeed * 0.05;
    float n1 = fbm(uv + t * 0.4);
    float n2 = fbm(uv + uNoiseIntensity * n1 + vec2(t * 0.3, t * 0.2));
    float n3 = fbm(uv + uNoiseIntensity * n2 * 0.8 + vec2(-t * 0.15, t * 0.1));

    vec3 dark   = uColor * 0.35;
    vec3 mid    = uColor;
    vec3 bright = min(uColor * 1.7 + 0.08, vec3(1.0));

    vec3 col = mix(dark, mid, n3);
    col = mix(col, bright, n2 * n2 * 0.45);

    float sheen = pow(abs(sin(uv.x * 9.0 + n1 * 3.5 + t)), 10.0) * 0.28;
    col += sheen * (bright - mid);

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

export default function Silk({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  style = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const u = (name) => gl.getUniformLocation(prog, name);
    const rgb = hexToRgb(color);

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const t0 = performance.now();
    let raf;
    const render = () => {
      const t = (performance.now() - t0) / 1000;
      gl.uniform1f(u('uTime'), t);
      gl.uniform1f(u('uSpeed'), speed);
      gl.uniform1f(u('uScale'), scale);
      gl.uniform1f(u('uNoiseIntensity'), noiseIntensity);
      gl.uniform1f(u('uRotation'), (rotation * Math.PI) / 180);
      gl.uniform3fv(u('uColor'), rgb);
      gl.uniform2f(u('uResolution'), canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
    };
  }, [speed, scale, color, noiseIntensity, rotation]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  );
}
