// World ledger (rankings, wars) and the system menu (save, load, new game, credits).
import { useEffect, useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { rankings } from '../../engine/metrics';
import { Section, modals } from '../components/ui';
import { fmt, compact, money } from '../i18n/vi';
import { shortName } from '../game/names';
import { Flag } from './common';
import { ui } from '../game/ui';
import { game } from '../game/controller';
import { saveSlot, loadSlot, listSlots } from '../game/storage';

export function WorldScreen({ st }: { st: GameState }) {
  const rk = rankings(st);
  const [by, setBy] = useState<'power' | 'gdp' | 'pop'>('power');
  const rows = [...rk].sort((a, b) => b[by] - a[by]).slice(0, 60);
  return (
    <div>
      <div class="plates c3">
        <div class="plate stat"><div class="k">Quốc gia</div><div class="v num">{fmt(rk.length)}</div></div>
        <div class="plate stat"><div class="k">Chiến tranh</div><div class="v num">{fmt(st.wars.length)}</div></div>
        <div class="plate stat"><div class="k">Đổi chủ lãnh thổ</div><div class="v num">{fmt(st.territoryLog.length)}</div></div>
      </div>
      <div class="seg" style="margin:6px 0">{([['power', 'Sức mạnh'], ['gdp', 'GDP'], ['pop', 'Dân số']] as const).map(([k, l]) => <button class={by === k ? 'on' : ''} onClick={() => setBy(k)}>{l}</button>)}</div>
      <div class="tbl-wrap"><table class="ledger">
        <thead><tr><th class="r">#</th><th>Quốc gia</th><th class="r">Sức mạnh</th><th class="r">GDP</th><th class="r">Dân số</th></tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={r.id} class={r.id === (st.player ?? ui.get().follow) ? 'on' : ''} onClick={() => ui.set({ country: r.id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' }, ...(st.player ? {} : { follow: r.id }) })}>
            <td class="r num dim">{i + 1}</td><td><span class="gi"><Flag c={st.countries[r.id]} sm /><span class="nm">{shortName(st, r.id)}</span></span></td>
            <td class="r num">{fmt(r.power)}</td><td class="r num">{money(r.gdp)}</td><td class="r num">{compact(r.pop)}</td>
          </tr>))}</tbody>
      </table></div>
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
    <div>
      <Section title="Ván chơi">
        <div class="rowline"><span class="grow">Chế độ</span><b class="serif">{st.mode === 'historical' ? 'Lịch sử' : 'Sandbox – Lịch sử thay thế'}</b></div>
        <div class="rowline"><span class="grow">Vai trò</span><b class="serif">{st.player ? shortName(st, st.player) : 'Quan sát (AI điều khiển tất cả)'}</b></div>
        <div class="rowline"><span class="grow">Hạt giống ngẫu nhiên</span><b class="num">{st.seed}</b></div>
      </Section>
      <Section title="Lưu trên thiết bị">
        <div class="btns" style="margin-bottom:6px"><button class="btn primary" onClick={() => doSave('Bản lưu nhanh')}>Lưu nhanh</button><button class="btn" onClick={() => doSave(`${shortName(st, st.player ?? 'GBR')} ${st.date.y}-${String(st.date.m).padStart(2, '0')}`)}>Lưu bản mới</button></div>
        {slots?.length ? slots.map((s) => <div class="rowline" key={s}><span class="grow serif" style="font-size:15px">{s}</span><button class="btn sm" onClick={() => doLoad(s)}>Tải</button></div>) : <div class="empty">{slots === null ? 'Đang đọc…' : 'Chưa có bản lưu.'}</div>}
      </Section>
      <Section title="Tệp">
        <div class="btns"><button class="btn" onClick={exportFile}>Xuất tệp</button><button class="btn" onClick={importFile}>Nhập tệp</button></div>
      </Section>
      <Section title="Ván mới">
        <div class="btns"><button class="btn danger" onClick={() => { game.setPaused(true); ui.set({ started: false, camera: null, region: null, screen: 'map' }); }}>Về màn hình chọn ván</button></div>
      </Section>
      <Section title="Ghi công">
        <div class="note">Phông chữ EB Garamond và Source Sans 3 (SIL Open Font License 1.1). Đường bờ biển: Natural Earth (phạm vi công cộng). Số liệu lịch sử: Correlates of War, Maddison Project và các nguồn ghi trong hồ sơ từng quốc gia. Biểu tượng, bản đồ và giao diện được thiết kế riêng cho dự án.</div>
      </Section>
    </div>
  );
}
