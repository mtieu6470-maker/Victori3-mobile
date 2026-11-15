// World ledger (sortable rankings, world totals) and the system window (save, load, files, new game, credits).
import { useEffect, useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { rankings } from '../../engine/metrics';
import { Sec, Metric, modals, useWidth, useSort } from '../components/ui';
import { fmt, compact, money } from '../i18n/vi';
import { shortName } from '../game/names';
import { Flag } from './common';
import { ui } from '../game/ui';
import { game } from '../game/controller';
import { saveSlot, loadSlot, listSlots } from '../game/storage';

export function WorldScreen({ st }: { st: GameState }) {
  const rk = rankings(st); const [ref, w] = useWidth<HTMLDivElement>();
  const { s, th } = useSort<'power' | 'gdp' | 'pop' | 'pc' | 'regions'>('power');
  const regionsOf = new Map<string, number>(); for (const r of st.regions) regionsOf.set(r.owner, (regionsOf.get(r.owner) ?? 0) + 1);
  const rows = rk.map((r, i) => ({ ...r, rank: i + 1, pc: r.gdp / Math.max(1, r.pop), regions: regionsOf.get(r.id) ?? 0 })).sort((a, b) => (a[s.k] - b[s.k]) * s.dir).slice(0, 80);
  const worldPop = rk.reduce((t, r) => t + r.pop, 0), worldGdp = rk.reduce((t, r) => t + r.gdp, 0);
  const followed = st.player ?? ui.get().follow;
  return (
    <div class="pad" ref={ref}>
      <div class="metrics">
        <Metric label="Quốc gia" icon="flag" value={fmt(rk.length)} />
        <Metric label="Dân số thế giới" icon="population" value={compact(worldPop)} />
        <Metric label="GDP thế giới" icon="gdp" value={money(worldGdp)} />
        <Metric label="Chiến tranh" icon="military" value={fmt(st.wars.length)} d={<span class="dim">{fmt(st.territoryLog.length)} lần đổi chủ lãnh thổ</span>} />
      </div>
      <table class="dt" style="margin-top:8px">
        <thead><tr><th class="r">#</th><th>Quốc gia</th>{th('power', 'Sức mạnh', 'r')}{th('gdp', 'GDP', 'r')}{w >= 470 && th('pop', 'Dân số', 'r')}{w >= 560 && th('pc', 'GDP/người', 'r')}{w >= 640 && th('regions', 'Vùng', 'r')}</tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id} class={r.id === followed ? 'on' : ''} onClick={() => ui.set({ country: r.id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' }, ...(st.player ? {} : { follow: r.id }) })}>
            <td class="r num dim">{r.rank}</td><td><span class="cell-ic"><Flag c={st.countries[r.id]} sm /><span class="nm">{shortName(st, r.id)}</span></span></td>
            <td class="r num">{fmt(r.power)}</td><td class="r num">{money(r.gdp)}</td>{w >= 470 && <td class="r num">{compact(r.pop)}</td>}{w >= 560 && <td class="r num">{fmt(r.pc, 1)}</td>}{w >= 640 && <td class="r num">{r.regions}</td>}
          </tr>))}</tbody>
      </table>
      {!st.player && <div class="note">Chế độ quan sát: chạm một quốc gia để theo dõi số liệu của nước đó trên thanh trên cùng.</div>}
    </div>
  );
}

export function SystemScreen({ st }: { st: GameState }) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const refresh = () => listSlots().then(setSlots).catch(() => setSlots([]));
  useEffect(() => { refresh(); }, []);
  const doSave = async (name: string) => { try { await saveSlot(name, game.save()); game.toast(`Đã lưu "${name}"`, 'ok'); refresh(); } catch (e) { game.toast(`Lưu thất bại: ${(e as Error).message}`, 'error'); } };
  const doLoad = async (name: string) => { try { const t = await loadSlot(name); if (!t) throw new Error('không tìm thấy'); game.load(t); modals.close(); ui.set({ camera: null, region: null }); game.toast(`Đã tải "${name}"`, 'ok'); } catch (e) { game.toast(`Không tải được: ${(e as Error).message}`, 'error'); } };
  const exportFile = () => { const blob = new Blob([game.save()], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ban-luu-${st.date.y}-${String(st.date.m).padStart(2, '0')}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  const importFile = () => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json'; i.onchange = async () => { const f = i.files?.[0]; if (!f) return; try { game.load(await f.text()); ui.set({ camera: null, region: null }); game.toast('Đã nhập bản lưu', 'ok'); } catch (e) { game.toast(`Tệp không hợp lệ: ${(e as Error).message}`, 'error'); } }; i.click(); };
  return (
    <div class="pad">
      <div class="cols c2">
        <Sec title="Ván chơi">
          <div class="kv"><span class="k">Chế độ</span><span class="v">{st.mode === 'historical' ? 'Lịch sử' : 'Sandbox – Lịch sử thay thế'}</span></div>
          <div class="kv"><span class="k">Vai trò</span><span class="v">{st.player ? shortName(st, st.player) : 'Quan sát (AI điều khiển tất cả)'}</span></div>
          <div class="kv"><span class="k">Ngày</span><span class="v num">{st.date.m}/{st.date.y} · tháng thứ {st.tick}</span></div>
          <div class="kv"><span class="k">Hạt giống ngẫu nhiên</span><span class="v num">{st.seed}</span></div>
        </Sec>
        <Sec title="Lưu trên thiết bị">
          <div class="btns" style="margin-bottom:6px"><button class="btn primary sm" onClick={() => doSave('Bản lưu nhanh')}>Lưu nhanh</button><button class="btn sm" onClick={() => doSave(`${shortName(st, st.player ?? 'GBR')} ${st.date.y}-${String(st.date.m).padStart(2, '0')}`)}>Lưu bản mới</button></div>
          {slots?.length ? slots.map((s) => <div class="row" key={s}><div class="grow"><div class="t sm">{s}</div></div><button class="btn sm" onClick={() => doLoad(s)}>Tải</button></div>) : <div class="empty sm">{slots === null ? 'Đang đọc…' : 'Chưa có bản lưu.'}</div>}
        </Sec>
      </div>
      <Sec title="Tệp"><div class="btns"><button class="btn sm" onClick={exportFile}>Xuất tệp</button><button class="btn sm" onClick={importFile}>Nhập tệp</button></div></Sec>
      <Sec title="Ván mới"><div class="btns"><button class="btn danger sm" onClick={() => { game.setPaused(true); ui.set({ started: false, camera: null, region: null, screen: 'map' }); }}>Về màn hình chọn ván</button></div></Sec>
      <Sec title="Ghi công">
        <div class="note" style="margin-top:0">Phông chữ EB Garamond và Source Sans 3 (SIL Open Font License 1.1). Địa lý: Natural Earth 1:10m (ranh giới hành chính cấp 1, sông, hồ) và ảnh nổi địa hình Natural Earth 1:50m — phạm vi công cộng; ranh giới hiện đại được dùng làm xấp xỉ cho địa lý năm 1836. Số liệu lịch sử: Correlates of War, Maddison Project và các nguồn ghi trong hồ sơ từng quốc gia. Biểu tượng, bản đồ và giao diện được thiết kế riêng cho dự án.</div>
      </Sec>
    </div>
  );
}
