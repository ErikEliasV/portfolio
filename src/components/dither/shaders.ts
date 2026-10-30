// WebGL 1 / GLSL ES 1.00. Um triângulo de tela cheia + um fragment shader que
// desenha o campo de ondas e o planeta com dither ordenado (Bayer 8×8).

export const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPos;

void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;   // px do alvo de render
uniform float uTime;        // s
uniform vec4 uPlanet;       // x, y (a partir do topo), radius (fração da altura), opacity
uniform vec3 uMouse;        // x, y em [0, 1] a partir do canto superior esquerdo, força 0..1
uniform float uBayer[64];
uniform vec3 uWave[4];
uniform vec3 uPlanetPal[8]; // oceanDeep, oceanMid, shallows, landDark, landMid, landLight, cloud, rim

// Índices dinâmicos só via índice de loop (garantido em GLSL ES 1.00)
float bayerAt(vec2 cell) {
  int idx = int(mod(cell.y, 8.0)) * 8 + int(mod(cell.x, 8.0));
  float v = 0.0;
  for (int i = 0; i < 64; i++) {
    if (i == idx) v = uBayer[i];
  }
  return v;
}

vec3 waveColor(int i) {
  vec3 c = uWave[0];
  for (int k = 1; k < 4; k++) {
    if (k == i) c = uWave[k];
  }
  return c;
}

vec3 planetColor(int i) {
  vec3 c = uPlanetPal[0];
  for (int k = 1; k < 8; k++) {
    if (k == i) c = uPlanetPal[k];
  }
  return c;
}

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return v;
}

// Gira em torno do eixo vertical (longitude += ang)
vec3 spin(vec3 n, float ang) {
  float c = cos(ang);
  float s = sin(ang);
  return vec3(n.x * c + n.z * s, n.y, -n.x * s + n.z * c);
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float th = bayerAt(cell);
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
  vec2 p = vec2(uv.x * aspect, uv.y); // em unidades da altura
  float t = uTime;

  // 1. Ondas: majoritariamente escuro, cristas verde-limão ocasionais
  float w = sin(p.x * 5.0 + t * 0.6) + sin(p.y * 6.0 - t * 0.45 + p.x) + sin((p.x + p.y) * 3.4 + t * 0.3);
  w = pow((w + 3.0) / 6.0, 3.4) * 2.6;
  vec2 dm = vec2((uv.x - uMouse.x) * aspect, uv.y - uMouse.y);
  w += uMouse.z * exp(-dot(dm, dm) / 0.015) * 1.4;
  w = clamp(w, 0.0, 3.0);
  float lo = floor(w);
  int wi = int(lo) + (w - lo > th ? 1 : 0);
  vec3 color = waveColor(wi);

  // 2. Planeta
  float r = uPlanet.z;
  if (uPlanet.w > 0.0 && r > 0.0) {
    vec2 d = (p - vec2(uPlanet.x * aspect, uPlanet.y)) / r;
    float d2 = dot(d, d);
    // A opacidade vira um fade "dithered" pelo mesmo limiar
    if (d2 <= 1.0 && uPlanet.w > th) {
      vec3 n = vec3(d.x, d.y, sqrt(1.0 - d2)); // y para baixo
      float light = clamp(dot(n, normalize(vec3(-0.55, -0.55, 0.62))), 0.0, 1.0);

      float h = fbm(spin(n, t * 0.25) * 1.8 + vec3(3.1, 1.7, 5.3));
      float sea = 0.5;
      int ia;
      int ib;
      float f;
      if (h < sea) {
        if (h > sea - 0.03) {
          ia = 1; ib = 2; f = light * 1.6 - 0.1;                 // rasos
        } else {
          ia = 0; ib = 1; f = light * 1.5 - 0.5 + (h - 0.3) * 2.0; // fundo → médio
        }
      } else {
        float lv = light * 1.9 + (h - sea) / 0.35 * 0.9 - 0.25;
        if (lv < 1.0) {
          ia = 3; ib = 4; f = lv;
        } else {
          ia = 4; ib = 5; f = lv - 1.0;
        }
      }

      // Nuvens em aglomerados, girando um pouco mais rápido
      float cl = fbm(spin(n, t * 0.32) * 2.6 + vec3(11.0, 4.0, 7.0));
      if (cl > 0.6) {
        ia = 2; ib = 6; f = light * 1.6 - 0.1 + (cl - 0.6) * 3.0;
      }

      vec3 pc = planetColor(clamp(f, 0.0, 1.0) > th ? ib : ia);

      // Lado noturno some no fundo
      if (clamp(light / 0.16, 0.0, 1.0) < th) pc = uWave[0];

      // Borda de atmosfera no lado iluminado
      if (d2 > 0.9 && light > 0.22) pc = uPlanetPal[7];

      color = pc;
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`;
