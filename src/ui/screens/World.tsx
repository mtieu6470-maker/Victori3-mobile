// World ledger (sortable rankings, world totals) and the system window (save, load, files, new game, credits).
import { useContent, contentFailed } from '../game/content';
import { AssetCredit } from '../components/identity';
import { useEffect, useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { rankings } from '../../engine/metrics';
import { isGameOver, GAME_END_YEAR } from '../../engine/simulation';
import { Sec, Metric, modals, useWidth, useSort, details } from '../components/ui';
import { fmt, compact, money } from '../i18n/vi';
import { shortName } from '../game/names';
import { Flag } from './common';
import { ui } from '../game/ui';
import { game } from '../game/controller';
import { saveSlot, loadSlot, listSlots } from '../game/storage';
import { loadPreferences, savePreferences, type AutoPauseKey } from '../game/preferences';

export function WorldScreen({ st }: { st: GameState }) {
  const rk = rankings(st); const [ref, w] = useWidth<HTMLDivElement>();
  const { s, th } = useSort<'power' | 'gdp' | 'pop' | 'pc' | 'regions'>('power');
  const regionsOf = new Map<string, number>(); for (const r of st.regions) regionsOf.set(r.owner, (regionsOf.get(r.owner) ?? 0) + 1);
  const rows = rk.map((r, i) => ({ ...r, rank: i + 1, pc: r.gdp / Math.max(1, r.pop), regions: regionsOf.get(r.id) ?? 0 })).sort((a, b) => (a[s.k] - b[s.k]) * s.dir).slice(0, 80);
  const worldPop = rk.reduce((t, r) => t + r.pop, 0), worldGdp = rk.reduce((t, r) => t + r.gdp, 0);
  const followed = st.player ?? ui.get().follow;
  const beyondCampaign = st.date.y > GAME_END_YEAR || st.tick > ((GAME_END_YEAR - 1836) * 12);
  return (
    <div class="pad" ref={ref}>
      {isGameOver(st) && <div class="banner">
        <div class="grow">
          <b>{beyondCampaign ? 'Bản lưu đã vượt niên đại chiến dịch' : 'Đã kết thúc chiến dịch 1836–2026'}</b>
          <div class="s">{beyondCampaign
            ? `Tệp lưu này đã chạy qua mốc chiến dịch ${GAME_END_YEAR - 1}. Không thể dựng ngược sự kiện vào giữa ván; hãy tạo ván mới để dùng đầy đủ mốc kết thúc mới.`
            : 'Ngày 01/01/2027 là mốc kết thúc sau khi đã mô phỏng trọn năm 2026. Ván mới có thể bắt đầu ở chế độ Lịch sử hoặc Lịch sử thay thế.'}</div>
        </div>
        <button class="btn sm" onClick={() => { game.setPaused(true); ui.set({ started: false, camera: null, region: null, screen: 'map' }); }}>Ván mới</button>
      </div>}
      <div class="metrics">
        <Metric label="Quốc gia" icon="flag" value={fmt(rk.length)} />
        <Metric label="Dân số thế giới" icon="population" value={compact(worldPop)} />
        <Metric label="GDP thế giới" icon="gdp" value={money(worldGdp)} />
        <Metric label="Chiến tranh" icon="military" value={fmt(st.wars.length)} d={<span class="dim">{fmt(st.territoryLog.length)} lần đổi chủ lãnh thổ</span>} />
      </div>
      <table class="dt" style="margin-top:8px">
        <thead><tr><th class="r">#</th><th>Quốc gia</th>{th('power', 'Sức mạnh', 'r')}{w >= 430 && th('gdp', 'GDP', 'r')}{w >= 470 && th('pop', 'Dân số', 'r')}{w >= 560 && th('pc', 'GDP/người', 'r')}{w >= 640 && th('regions', 'Vùng', 'r')}</tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id} class={r.id === followed ? 'on' : ''} onClick={() => ui.set({ country: r.id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' }, ...(st.player ? {} : { follow: r.id }) })}>
            <td class="r num dim">{r.rank}</td><td><span class="cell-ic"><Flag c={st.countries[r.id]} sm /><span><div class="nm">{shortName(st, r.id)}</div>{w < 430 && <div class="sub num">GDP {money(r.gdp)} · {compact(r.pop)} dân</div>}</span></span></td>
            <td class="r num">{fmt(r.power)}</td>{w >= 430 && <td class="r num">{money(r.gdp)}</td>}{w >= 470 && <td class="r num">{compact(r.pop)}</td>}{w >= 560 && <td class="r num">{fmt(r.pc, 1)}</td>}{w >= 640 && <td class="r num">{r.regions}</td>}
          </tr>))}</tbody>
      </table>
      {!st.player && <div class="note">Chế độ quan sát: chạm một quốc gia để theo dõi số liệu của nước đó trên thanh trên cùng.</div>}
    </div>
  );
}

export function SystemScreen({ st }: { st: GameState }) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [preferences, setPreferences] = useState(loadPreferences);
  const toggleAutoPause = (key: AutoPauseKey) => setPreferences((current) => savePreferences({
    ...current,
    autoPause: { ...current.autoPause, [key]: !current.autoPause[key] },
  }));
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
          <div class="kv"><span class="k">Khung chiến dịch</span><span class="v">1836–{GAME_END_YEAR - 1}</span></div>
          {isGameOver(st) && <div class="note">Mô phỏng đã dừng; không thể tiếp tục sau năm {GAME_END_YEAR - 1} trong bản chuẩn.</div>}
          <div class="kv"><span class="k">Hạt giống ngẫu nhiên</span><span class="v num">{st.seed}</span></div>
        </Sec>
        <Sec title="Lưu trên thiết bị">
          <div class="btns" style="margin-bottom:6px"><button class="btn primary sm" onClick={() => doSave('Bản lưu nhanh')}>Lưu nhanh</button><button class="btn sm" onClick={() => doSave(`${shortName(st, st.player ?? 'GBR')} ${st.date.y}-${String(st.date.m).padStart(2, '0')}`)}>Lưu bản mới</button></div>
          {slots?.length ? slots.map((s) => <div class="row" key={s}><div class="grow"><div class="t sm">{s}</div></div><button class="btn sm" onClick={() => doLoad(s)}>Tải</button></div>) : <div class="empty sm">{slots === null ? 'Đang đọc…' : 'Chưa có bản lưu.'}</div>}
        </Sec>
      </div>
      <Sec title="Tạm dừng tự động" x="Lưu trên thiết bị">
        <div class="note" style="margin-top:0">Tự dừng mô phỏng khi có sự kiện quan trọng liên quan đến nước bạn đang điều khiển hoặc theo dõi. Cài đặt này chỉ lưu trên điện thoại, không nằm trong tệp bản lưu.</div>
        {([
          ['decisions', 'Quyết định đang chờ', 'Dừng khi có quyết định lịch sử cần người chơi chọn.'],
          ['wars', 'Chiến tranh', 'Dừng khi quốc gia đang theo dõi tuyên chiến hoặc chiến tranh kết thúc.'],
          ['revolutions', 'Cách mạng', 'Dừng khi cách mạng nổ ra hoặc bị dập tắt tại quốc gia đang theo dõi.'],
          ['disasters', 'Thiên tai và dịch bệnh', 'Dừng khi thiên tai hoặc dịch bệnh tác động đến lãnh thổ đang theo dõi.'],
        ] as const).map(([key, title, note]) => (
          <div class="row" key={key} style="min-height:48px;gap:10px">
            <div class="grow"><div class="t sm">{title}</div><div class="s">{note}</div></div>
            <button class={`btn sm ${preferences.autoPause[key] ? 'primary' : ''}`} aria-pressed={preferences.autoPause[key]} onClick={() => toggleAutoPause(key)}>{preferences.autoPause[key] ? 'Đang bật' : 'Đã tắt'}</button>
          </div>
        ))}
      </Sec>
      <Sec title="Tệp"><div class="btns"><button class="btn sm" onClick={exportFile}>Xuất tệp</button><button class="btn sm" onClick={importFile}>Nhập tệp</button></div></Sec>
      <Sec title="Ván mới"><div class="btns"><button class="btn danger sm" onClick={() => { game.setPaused(true); ui.set({ started: false, camera: null, region: null, screen: 'map' }); }}>Về màn hình chọn ván</button></div></Sec>
      <ContentCredits />
      <Sec title="Ghi công">
        <div class="note" style="margin-top:0">Phông chữ EB Garamond và Source Sans 3 (SIL Open Font License 1.1). Địa lý: Natural Earth 1:10m (ranh giới hành chính cấp 1, sông, hồ) và ảnh nổi địa hình Natural Earth 1:50m — phạm vi công cộng; ranh giới hiện đại được dùng làm xấp xỉ cho địa lý năm 1836. Số liệu lịch sử: Correlates of War, Maddison Project và các nguồn ghi trong hồ sơ từng quốc gia. Biểu tượng, bản đồ và giao diện được thiết kế riêng cho dự án.</div>
      </Sec>
    </div>
  );
}

/** Identity content pack: what is shipped and the attribution every licence requires. */
function ContentCredits() {
  const pack = useContent();
  if (!pack) return <Sec title="Gói nội dung bản sắc"><div class="empty sm">{contentFailed() ? 'Không tải được gói nội dung (game vẫn chạy với huy hiệu do game tạo).' : 'Đang tải…'}</div></Sec>;
  const n = pack.counts;
  const open = (type: string, title: string) => details.open({ key: 'credits:' + type, title, ctx: 'Nguồn và giấy phép', body: () => (
    <div>{pack.assets.filter((a) => a.type === type).map((a) => <div key={a.id} style="padding:6px 0;border-bottom:1px solid var(--line)"><AssetCredit a={a} /></div>)}</div>
  ) });
  return (
    <Sec title="Gói nội dung bản sắc" x={`${(n.bytes / 1048576).toFixed(1)} MB`}>
      <div class="kv"><span class="k">Quốc kỳ theo thời kỳ</span><span class="v num">{n.flags}</span></div>
      <div class="kv"><span class="k">Huy hiệu</span><span class="v num">{n.arms}</span></div>
      <div class="kv"><span class="k">Chân dung nhân vật</span><span class="v num">{n.portraits}</span></div>
      <div class="kv"><span class="k">Thực thể liên kết Wikidata</span><span class="v num">{n.entities_linked}</span></div>
      <div class="kv"><span class="k">Mô tả có trích dẫn</span><span class="v num">{n.entity_texts}</span></div>
      <div class="kv"><span class="k">Nhân vật (đối chiếu được)</span><span class="v num">{n.characters} ({n.characters_linked})</span></div>
      <div class="btns credits" style="margin-top:6px"><button class="btn sm" onClick={() => open('flag', 'Nguồn quốc kỳ')}>Nguồn quốc kỳ</button><button class="btn sm" onClick={() => open('coat_of_arms', 'Nguồn huy hiệu')}>Nguồn huy hiệu</button><button class="btn sm" onClick={() => open('portrait', 'Nguồn chân dung')}>Nguồn chân dung</button></div>
      <div class="note">{pack.licence_note} Mỗi hình ảnh ghi tác giả, giấy phép và tệp gốc; văn bản ghi bài viết và bản sửa.</div>
    </Sec>
  );
}
