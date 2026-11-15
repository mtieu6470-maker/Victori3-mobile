// WebGL map renderer — fills only. Lines (coasts, borders, rivers) and names are vectors drawn on the overlay canvas.
// Inputs: region-index grid (8192×3868, two bytes per texel), a combined relief texture (land: shaded relief,
// water: ocean-bottom relief; Natural Earth, public domain), a coast-distance field for engraved water lines, and a
// per-region palette. The fragment shader picks the region with a categorical bilinear filter (smooth shapes at any
// zoom), tints it with relief and a paper grain, adds a watercolour band inside national borders, hatches occupied
// regions, and paints the sea by depth with water lines along the coasts and a graticule.
import type { MapGrid } from './mapData';

export const PAL_W = 1024; // ≥ number of regions + 2; slot 1023 = land without a region
export const NO_REGION = 1023;
const VS = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uGrid; uniform sampler2D uPal; uniform sampler2D uRelief; uniform sampler2D uDist;
uniform vec2 uGridSize; uniform vec2 uTexSize; uniform vec3 uView; uniform vec2 uRes; uniform float uDpr;
uniform vec3 uSeaShallow; uniform vec3 uSeaDeep; uniform vec3 uInk; uniform vec3 uNoRegion;
uniform float uGridStep; uniform float uCpd; uniform float uLat0; uniform float uBand; uniform float uLines;
float idxAt(vec2 c){
  if (c.y < 0.0 || c.y >= uTexSize.y) return 0.0;
  c.x = mod(c.x, uTexSize.x);
  vec4 t = texture2D(uGrid, (c + 0.5) / uTexSize);
  return floor(t.r * 255.0 + 0.5) + floor(t.a * 255.0 + 0.5) * 256.0;
}
float regionAt(vec2 p){
  p *= uTexSize.x / uGridSize.x;
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
  return best > 65534.0 ? ${NO_REGION}.0 : best;
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
  float px = uView.z * uDpr; // grid cells per CSS pixel
  vec2 uv = vec2(mod(p.x, uGridSize.x), p.y) / uGridSize;
  float relief = texture2D(uRelief, uv).r;
  float grain = noise(p * 0.35) * 0.55 + noise(p * 2.3) * 0.45;
  float r = regionAt(p);
  if (r == 0.0) {
    float depth = clamp((relief - 0.35) / 0.42, 0.0, 1.0);          // ocean-bottom relief: brighter = shallower
    vec3 col = mix(uSeaDeep, uSeaShallow, smoothstep(0.15, 0.95, depth));
    col *= 0.975 + grain * 0.045;
    float dist = texture2D(uDist, uv).r * 63.75;                      // Euclidean distance to land, in 4096-wide field cells
    float cellPx = (uGridSize.x / 4096.0) / px;                       // CSS px per field cell
    if (uLines > 0.5 && cellPx > 0.7) {
      float w = 0.5 / cellPx;
      float fade = smoothstep(0.7, 1.6, cellPx);
      for (int i = 1; i <= 3; i++) { float d0 = float(i) * 1.6 + float(i * i) * 0.55; if (abs(dist - d0) < w) col = mix(col, uInk, (0.17 - float(i) * 0.035) * fade); }
    }
    vec2 g = mod(p, uGridStep); float gw = px * 0.6;
    if (g.x < gw || g.y < gw) col = mix(col, uInk, 0.13);
    gl_FragColor = vec4(col, 1.0);
    return;
  }
  vec3 col = r == ${NO_REGION}.0 ? uNoRegion : pal(r, 0.0).rgb;
  vec3 tint = pal(r, 3.0).rgb;
  float own = ownerOf(r); float fl = flagsOf(r);
  if (bit(fl, 2.0)) col = mix(col, vec3(1.0), 0.16);
  if (bit(fl, 4.0)) { float h = mod((frag.x + frag.y) / uDpr, 8.0); if (h < 2.4) col = pal(r, 2.0).rgb; }
  if (bit(fl, 1.0)) col = mix(col, vec3(1.0), 0.26);
  // watercolour band: deepen the colour just inside national borders
  if (uBand > 0.0) {
    float w2 = px * uBand;
    float n1 = regionAt(p + vec2(w2, 0.0)); float n2 = regionAt(p - vec2(w2, 0.0)); float n3 = regionAt(p + vec2(0.0, w2)); float n4 = regionAt(p - vec2(0.0, w2));
    bool edge = (n1 > 0.0 && ownerOf(n1) != own) || (n2 > 0.0 && ownerOf(n2) != own) || (n3 > 0.0 && ownerOf(n3) != own) || (n4 > 0.0 && ownerOf(n4) != own);
    if (edge) col = mix(col, tint, 0.34);
  }
  float shade = clamp(1.0 + (relief - 0.82) * 1.05, 0.66, 1.1);
  col *= shade * (0.955 + grain * 0.07);
  gl_FragColor = vec4(col, 1.0);
}`;

export interface Camera { x0: number; y0: number; scale: number } // top-left in grid cells, grid cells per CSS px
const hex3 = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];

export class MapRenderer {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private palTex: WebGLTexture;
  private reliefTex: WebGLTexture;
  private u: Record<string, WebGLUniformLocation | null> = {};
  readonly texW: number;
  constructor(private canvas: HTMLCanvasElement, private grid: MapGrid, relief: HTMLImageElement | null, coastDist: HTMLImageElement | null) {
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
    for (const n of ['uGrid', 'uPal', 'uRelief', 'uDist', 'uGridSize', 'uTexSize', 'uView', 'uRes', 'uDpr', 'uSeaShallow', 'uSeaDeep', 'uInk', 'uNoRegion', 'uGridStep', 'uCpd', 'uLat0', 'uBand', 'uLines']) this.u[n] = gl.getUniformLocation(p, n);
    const tex = (unit: number, linear = false) => { const t = gl.createTexture()!; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); const f = linear ? gl.LINEAR : gl.NEAREST; for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, f], [gl.TEXTURE_MAG_FILTER, f], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); return t; };
    // region grid: two bytes per texel (luminance = low byte, alpha = high byte); halve it on GPUs limited to 4096
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    let tw = grid.W, th = grid.H, bytes = new Uint8Array(grid.idx.buffer, grid.idx.byteOffset, grid.idx.byteLength);
    if (maxTex < grid.W) {
      const f = Math.ceil(grid.W / maxTex); tw = Math.floor(grid.W / f); th = Math.floor(grid.H / f);
      const small = new Uint16Array(tw * th); for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) small[y * tw + x] = grid.idx[y * f * grid.W + x * f];
      bytes = new Uint8Array(small.buffer);
    }
    this.texW = tw;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    tex(0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, tw, th, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, bytes);
    this.palTex = tex(1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PAL_W, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(PAL_W * 4 * 4));
    this.reliefTex = tex(2, true);
    if (relief) gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, relief);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([200]));
    tex(3, true);
    if (coastDist) gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, coastDist);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([255]));
    gl.uniform1i(this.u.uGrid, 0); gl.uniform1i(this.u.uPal, 1); gl.uniform1i(this.u.uRelief, 2); gl.uniform1i(this.u.uDist, 3);
    gl.uniform2f(this.u.uGridSize, grid.W, grid.H); gl.uniform2f(this.u.uTexSize, tw, th);
    gl.uniform1f(this.u.uCpd, grid.cpd); gl.uniform1f(this.u.uLat0, grid.lat0);
    const css = getComputedStyle(document.documentElement); const tok = (n: string, d: string) => (css.getPropertyValue(n).trim() || d);
    gl.uniform3fv(this.u.uSeaShallow, hex3(tok('--map-sea', '#bccfc8')));
    gl.uniform3fv(this.u.uSeaDeep, hex3(tok('--map-sea-deep', '#7f9fa3')));
    gl.uniform3fv(this.u.uInk, hex3(tok('--map-ink', '#2f3c3c')));
    gl.uniform3fv(this.u.uNoRegion, hex3(tok('--map-noregion', '#e4dcc8')));
    void this.reliefTex;
  }
  /** Palette rows: 0 fill, 1 owner code (R,G) + flags (B: 1 selected region, 2 selected country, 4 hatched), 2 hatch colour, 3 border tint. */
  setPalette(pal: Uint8Array) {
    const gl = this.gl; gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.palTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, PAL_W, 4, gl.RGBA, gl.UNSIGNED_BYTE, pal);
  }
  draw(cam: Camera, cssW: number, cssH: number, dpr: number, opts: { band: boolean; lines: boolean }) {
    const gl = this.gl; const w = Math.round(cssW * dpr), h = Math.round(cssH * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    gl.viewport(0, 0, w, h); gl.useProgram(this.prog);
    gl.uniform3f(this.u.uView, cam.x0, cam.y0, cam.scale / dpr);
    gl.uniform2f(this.u.uRes, w, h); gl.uniform1f(this.u.uDpr, dpr);
    gl.uniform1f(this.u.uBand, opts.band ? 3.2 : 0);
    gl.uniform1f(this.u.uLines, opts.lines ? 1 : 0);
    const deg = cam.scale / this.grid.cpd; // degrees per CSS px
    gl.uniform1f(this.u.uGridStep, (deg < 0.02 ? 5 : deg < 0.12 ? 10 : 30) * this.grid.cpd);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
