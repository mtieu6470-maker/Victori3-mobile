// WebGL map renderer — 19th-century atlas style (original): pale engraved sea with a graticule, pastel
// "watercolour" land, national borders in a darker shade of the country's own colour plus an ink line,
// faint internal state borders, a procedural paper grain, and a hatch pattern for occupied regions.
// Region-index texture + per-region palette texture; a categorical bilinear filter smooths the raster
// into clean boundaries at any zoom. Redraws only when the camera or palette changes.
import type { MapGrid } from './mapData';

export const PAL_W = 1024; // ≥ number of regions + 1
const VS = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uGrid; uniform sampler2D uPal;
uniform vec2 uGridSize; uniform vec3 uView; uniform vec2 uRes; uniform float uDpr;
uniform vec3 uSea; uniform vec3 uSeaDeep; uniform vec3 uInk; uniform vec3 uSelect; uniform vec3 uPaper;
uniform float uInternal; uniform float uGridStep; uniform float uCpd; uniform float uLat0;
float idxAt(vec2 c){
  if (c.y < 0.0 || c.y >= uGridSize.y) return 0.0;
  c.x = mod(c.x, uGridSize.x);
  vec4 t = texture2D(uGrid, (c + 0.5) / uGridSize);
  return floor(t.r * 255.0 + 0.5) + floor(t.g * 255.0 + 0.5) * 256.0;
}
float regionAt(vec2 p){
  vec2 u = p - 0.5; vec2 i0 = floor(u); vec2 f = u - i0;
  float a = idxAt(i0); float b = idxAt(i0 + vec2(1.0, 0.0)); float c = idxAt(i0 + vec2(0.0, 1.0)); float d = idxAt(i0 + vec2(1.0, 1.0));
  float wa = (1.0 - f.x) * (1.0 - f.y); float wb = f.x * (1.0 - f.y); float wc = (1.0 - f.x) * f.y; float wd = f.x * f.y;
  float sa = wa + (b == a ? wb : 0.0) + (c == a ? wc : 0.0) + (d == a ? wd : 0.0);
  float sb = wb + (a == b ? wa : 0.0) + (c == b ? wc : 0.0) + (d == b ? wd : 0.0);
  float sc = wc + (a == c ? wa : 0.0) + (b == c ? wb : 0.0) + (d == c ? wd : 0.0);
  float sd = wd + (a == d ? wa : 0.0) + (b == d ? wb : 0.0) + (c == d ? wd : 0.0);
  float best = a; float bw = sa;
  if (sb > bw) { best = b; bw = sb; }
  if (sc > bw) { best = c; bw = sc; }
  if (sd > bw) { best = d; }
  return best;
}
vec4 pal(float idx, float row){ return texture2D(uPal, vec2((idx + 0.5) / ${PAL_W}.0, (row + 0.5) / 4.0)); }
float ownerOf(float idx){ vec4 o = pal(idx, 1.0); return floor(o.r * 255.0 + 0.5) + floor(o.g * 255.0 + 0.5) * 256.0; }
float flagsOf(float idx){ return floor(pal(idx, 1.0).b * 255.0 + 0.5); }
bool bit(float flags, float b){ return mod(floor(flags / b), 2.0) >= 1.0; }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
void main(){
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 p = uView.xy + frag * uView.z;
  float px = uView.z * uDpr;                       // grid cells per CSS pixel
  float grain = noise(p * 1.7) * 0.6 + noise(p * 9.0) * 0.4; // paper fibre, fixed to the map
  float r = regionAt(p);
  float e = px * 0.75;
  float r1 = regionAt(p + vec2(e, 0.0)); float r2 = regionAt(p - vec2(e, 0.0));
  float r3 = regionAt(p + vec2(0.0, e)); float r4 = regionAt(p - vec2(0.0, e));
  if (r == 0.0) {
    // engraved sea: tone by latitude, graticule, shore line
    float lat = uLat0 - p.y / uCpd;
    vec3 col = mix(uSea, uSeaDeep, smoothstep(10.0, 70.0, abs(lat)) * 0.35);
    col *= 0.97 + grain * 0.05;
    vec2 g = mod(p, uGridStep); float gw = px * 0.7;
    if (g.x < gw || g.y < gw) col = mix(col, uInk, 0.16);
    bool shore = r1 > 0.0 || r2 > 0.0 || r3 > 0.0 || r4 > 0.0;
    if (shore) col = mix(col, uInk, 0.55);
    else {
      // soft ripple band along coasts
      float near = max(max(regionAt(p + vec2(px * 3.0, 0.0)), regionAt(p - vec2(px * 3.0, 0.0))), max(regionAt(p + vec2(0.0, px * 3.0)), regionAt(p - vec2(0.0, px * 3.0))));
      if (near > 0.0) col = mix(col, uSeaDeep, 0.22);
    }
    gl_FragColor = vec4(col, 1.0);
    return;
  }
  vec3 col = pal(r, 0.0).rgb;
  vec3 borderTint = pal(r, 3.0).rgb;                // darker shade of the owner's colour
  float own = ownerOf(r); float fl = flagsOf(r);
  bool sel = bit(fl, 1.0);
  if (bit(fl, 2.0)) col = mix(col, vec3(1.0), 0.16);
  if (bit(fl, 4.0)) { float h = mod((frag.x + frag.y) / uDpr, 8.0); if (h < 2.5) col = pal(r, 2.0).rgb; }
  col *= 0.95 + grain * 0.08;
  // inner colour band along national borders (watercolour edge)
  float w2 = px * 3.0;
  bool natNear = ownerOf(regionAt(p + vec2(w2, 0.0))) != own || ownerOf(regionAt(p - vec2(w2, 0.0))) != own || ownerOf(regionAt(p + vec2(0.0, w2))) != own || ownerOf(regionAt(p - vec2(0.0, w2))) != own;
  if (natNear) col = mix(col, borderTint, 0.42);
  if (sel) col = mix(col, vec3(1.0), 0.28);
  bool coast = r1 == 0.0 || r2 == 0.0 || r3 == 0.0 || r4 == 0.0;
  bool nat = (r1 > 0.0 && ownerOf(r1) != own) || (r2 > 0.0 && ownerOf(r2) != own) || (r3 > 0.0 && ownerOf(r3) != own) || (r4 > 0.0 && ownerOf(r4) != own);
  bool inner = (r1 != r || r2 != r || r3 != r || r4 != r);
  bool selEdge = sel && (r1 != r || r2 != r || r3 != r || r4 != r);
  if (selEdge) col = uSelect;
  else if (nat) col = mix(borderTint, uInk, 0.55);
  else if (coast) col = mix(col, uInk, 0.6);
  else if (inner) col = mix(col, borderTint, uInternal);
  gl_FragColor = vec4(col, 1.0);
}`;

export interface Camera { x0: number; y0: number; scale: number } // top-left in grid cells, grid cells per CSS px

const hex3 = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];

export class MapRenderer {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private palTex: WebGLTexture;
  private u: Record<string, WebGLUniformLocation | null> = {};
  constructor(private canvas: HTMLCanvasElement, private grid: MapGrid) {
    const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true, alpha: false });
    if (!gl) throw new Error('Thiết bị không hỗ trợ WebGL');
    this.gl = gl;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader'); return s; };
    const p = gl.createProgram()!; gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
    this.prog = p; gl.useProgram(p);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uGrid', 'uPal', 'uGridSize', 'uView', 'uRes', 'uDpr', 'uSea', 'uSeaDeep', 'uInk', 'uSelect', 'uPaper', 'uInternal', 'uGridStep', 'uCpd', 'uLat0']) this.u[n] = gl.getUniformLocation(p, n);
    const rgba = new Uint8Array(grid.W * grid.H * 4);
    for (let i = 0; i < grid.idx.length; i++) { const v = grid.idx[i]; rgba[i * 4] = v & 255; rgba[i * 4 + 1] = v >> 8; rgba[i * 4 + 3] = 255; }
    const tex = (unit: number) => { const t = gl.createTexture()!; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.NEAREST], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); return t; };
    tex(0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, grid.W, grid.H, 0, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    this.palTex = tex(1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PAL_W, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(PAL_W * 4 * 4));
    gl.uniform1i(this.u.uGrid, 0); gl.uniform1i(this.u.uPal, 1);
    gl.uniform2f(this.u.uGridSize, grid.W, grid.H);
    gl.uniform1f(this.u.uCpd, grid.cpd); gl.uniform1f(this.u.uLat0, grid.lat0);
    const css = getComputedStyle(document.documentElement);
    const tok = (n: string, d: string) => (css.getPropertyValue(n).trim() || d);
    gl.uniform3fv(this.u.uSea, hex3(tok('--map-sea', '#b7cbc6')));
    gl.uniform3fv(this.u.uSeaDeep, hex3(tok('--map-sea-deep', '#8fb0b0')));
    gl.uniform3fv(this.u.uInk, hex3(tok('--map-ink', '#2c3a3c')));
    gl.uniform3fv(this.u.uSelect, hex3(tok('--map-select', '#fff8e6')));
    gl.uniform3fv(this.u.uPaper, hex3(tok('--map-paper', '#e8dfc8')));
  }
  /** Palette rows: 0 fill, 1 owner code (R,G) + flags (B: 1 selected region, 2 selected country, 4 hatched), 2 hatch colour, 3 border shade. */
  setPalette(pal: Uint8Array) {
    const gl = this.gl; gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.palTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, PAL_W, 4, gl.RGBA, gl.UNSIGNED_BYTE, pal);
  }
  draw(cam: Camera, cssW: number, cssH: number, dpr: number) {
    const gl = this.gl; const w = Math.round(cssW * dpr), h = Math.round(cssH * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.useProgram(this.prog);
    gl.uniform3f(this.u.uView, cam.x0, cam.y0, cam.scale / dpr);
    gl.uniform2f(this.u.uRes, w, h); gl.uniform1f(this.u.uDpr, dpr);
    gl.uniform1f(this.u.uInternal, cam.scale < 0.1 ? 0.55 : cam.scale < 0.2 ? 0.4 : cam.scale < 0.35 ? 0.22 : 0.0);
    gl.uniform1f(this.u.uGridStep, (cam.scale < 0.12 ? 5 : 10) * this.grid.cpd);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
