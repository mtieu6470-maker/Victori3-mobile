// New campaign: mode (Historical / Sandbox), role (country / Observer), country choice, seed.
import { useEffect, useState } from 'preact/hooks';
import { data } from '../../engine/data/db';
import { CAMPAIGN_END_YEAR, CAMPAIGN_START_YEAR } from '../../engine/core';
import type { GameMode } from '../../engine/types';
import { game } from '../game/controller';
import { ui } from '../game/ui';
import { compact, pct, govVi } from '../i18n/vi';
import { QualityMark } from '../components/ui';
import { listSlots, loadSlot } from '../game/storage';

const TIER_VI: Record<string, string> = { A: 'Cường quốc', B: 'Cường quốc khu vực', C: 'Quốc gia nhỏ', D: 'Chưa nghiên cứu riêng' };
export function Setup() {
  const ents = data().db.entities.filter((e) => e.model === 'playable').sort((a, b) => ((b.population as any).value ?? 0) - ((a.population as any).value ?? 0));
  const [mode, setMode] = useState<GameMode>('historical');
  const [observer, setObserver] = useState(false);
  const [q, setQ] = useState('');
  const [pick, setPick] = useState('GBR');
  const [seed, setSeed] = useState(1);
  const [slots, setSlots] = useState<string[]>([]);
  useEffect(() => { listSlots().then(setSlots).catch(() => setSlots([])); }, []);
  const list = ents.filter((e) => !q || e.vi.toLowerCase().includes(q.toLowerCase()) || e.en.toLowerCase().includes(q.toLowerCase())).slice(0, 120);
  const sel = data().entity.get(pick);
  const start = async () => { try { await game.newGame({ mode, seed, player: observer ? null : pick }); } catch (e) { game.toast(`Không tạo được ván mới: ${(e as Error).message}`, 'error'); return; } ui.set({ started: true, screen: 'map', camera: null, region: null, follow: observer ? null : null, country: null }); };
  const cont = async (name: string) => { const t = await loadSlot(name); if (t) { try { await game.load(t); } catch (e) { game.toast(`Không tải được: ${(e as Error).message}`, 'error'); return; } ui.set({ started: true, screen: 'map', camera: null, region: null }); } };
  return (
    <div class="setup">
      <div class="inner">
        <h1>Dòng chảy Lịch sử</h1>
        <div class="tag2">Đại chiến lược {CAMPAIGN_START_YEAR}–{CAMPAIGN_END_YEAR} — trên bản đồ thế giới thật</div>
        {slots.length > 0 && <section class="sec"><h4 class="sec-t">Tiếp tục ván đã lưu</h4><div class="btns">{slots.slice(0, 3).map((s) => <button class="btn sm" key={s} onClick={() => cont(s)}>{s}</button>)}</div></section>}
        <h4 class="sec-t" style="margin-top:16px">Chế độ thế giới</h4>
        <div class="modecards">
          <button class={`modecard${mode === 'historical' ? ' on' : ''}`} onClick={() => setMode('historical')}><h3>Lịch sử</h3><p>Dữ liệu 1836 có nguồn và nhãn độ tin cậy. Các quốc gia theo đuổi ưu tiên lịch sử và gặp cửa sổ quyết định đúng thời điểm — nhưng không bị ép: lịch sử có thể rẽ nhánh.</p></button>
          <button class={`modecard${mode === 'sandbox' ? ' on' : ''}`} onClick={() => setMode('sandbox')}><h3>Sandbox – Lịch sử thay thế</h3><p>Cùng thế giới xuất phát và cùng hệ thống mô phỏng, không có sự kiện lịch sử định sẵn. AI giữ tính cách từ dữ liệu lịch sử nhưng tự do tạo ra thế giới khác.</p></button>
        </div>
        <h4 class="sec-t" style="margin-top:16px">Vai trò</h4>
        <div class="seg"><button class={!observer ? 'on' : ''} onClick={() => setObserver(false)}>Chơi một quốc gia</button><button class={observer ? 'on' : ''} onClick={() => setObserver(true)}>Quan sát thế giới</button></div>
        {!observer && <>
          <h4 class="sec-t" style="margin-top:16px">Quốc gia <span class="x">{ents.length} chính thể</span></h4>
          <input class="field" placeholder="Tìm theo tên tiếng Việt hoặc tiếng Anh…" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
          <div class="scrollbox" style="max-height:44vh;margin-top:6px">
            <table class="dt">
              <thead><tr><th>Quốc gia</th><th class="r">Dân số 1836</th><th class="r">Hồ sơ</th></tr></thead>
              <tbody>{list.map((e) => (
                <tr key={e.id} class={pick === e.id ? 'on' : ''} onClick={() => setPick(e.id)}>
                  <td><span class="cell-ic"><span class="flag sm" style={`background:${e.color}`} /><span class="nm" style="white-space:normal">{e.vi}</span></span></td>
                  <td class="r num">{compact((e.population as any).value ?? 0)} <QualityMark quality={e.population.quality} sources={e.population.sources as any} method={e.population.method} /></td>
                  <td class="r num dim">{pct(e.research_completeness)}</td>
                </tr>))}</tbody>
            </table>
          </div>
          {sel && <div class="note">{sel.vi} — {govVi((sel as any).government ?? '')} · {TIER_VI[sel.tier] ?? sel.tier}. “Hồ sơ” là mức hoàn thiện nghiên cứu dữ liệu 1836 của quốc gia, không phải độ mạnh.</div>}
        </>}
        <h4 class="sec-t" style="margin-top:16px">Hạt giống ngẫu nhiên</h4>
        <div style="display:flex;gap:8px"><input class="field num" type="number" value={seed} onInput={(e) => setSeed(Math.max(1, Number((e.target as HTMLInputElement).value) || 1))} /><button class="btn" onClick={() => setSeed(1 + Math.floor(Math.random() * 99999))}>Ngẫu nhiên</button></div>
      </div>
      <div class="startbar">
        <div style="flex:1 1 auto;min-width:0"><div class="serif ellipsis" style="font-size:17px;font-weight:600">{observer ? 'Quan sát thế giới' : sel?.vi}</div><div class="muted" style="font-size:12.5px">{mode === 'historical' ? 'Chế độ Lịch sử' : 'Chế độ Sandbox'} · 1 tháng 1, {CAMPAIGN_START_YEAR} · đến tháng 12, {CAMPAIGN_END_YEAR}</div></div>
        <button class="btn primary" style="min-width:140px" onClick={start}>Bắt đầu</button>
      </div>
    </div>
  );
}
