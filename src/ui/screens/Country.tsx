// Country window. Overview = a two-column ledger of the country's current simulated state (identity, headline
// figures with yearly trend, government, economy & society, foreign affairs, world standing, territory, recent
// events). Historical dossier = the 1836 research record and its completeness, kept apart from performance.
import { leaderTitle } from '../../engine/systems/politics';
import { titleVi } from '../i18n/vi';
import type { GameState } from '../../engine/types';
import { IGS } from '../../engine/types';
import { data } from '../../engine/data/db';
import { rankings } from '../../engine/metrics';
import { rivals, infamyTier } from '../../engine/systems/diplomacy';
import { techCost } from '../../engine/systems/technology';
import { Sec, Metric, LineChart, QualityMark, HBars, Donut, details } from '../components/ui';
import { Icon } from '../components/icons';
import { govVi, lawVi, fmt, pct, money, compact, techName, SUBJECT_VI, IG_VI, LOG_TYPE_VI, GROUP_VI } from '../i18n/vi';
import { fullName, shortName } from '../game/names';
import { ui } from '../game/ui';
import { Flag, CountryLink, YoY, IG_COL, LOG_ICON, focusRegion, regionName, leaderName } from './common';
import { useContent, entityContent, symbolFor, characterByName, charactersOf, asset, type ContentCharacter } from '../game/content';
import { AssetImg, SourcedText, AssetCredit } from '../components/identity';

const SEC_VI: Record<string, string> = { political: 'Chính trị', territory: 'Lãnh thổ', economy: 'Kinh tế', society: 'Xã hội', diplomacy: 'Ngoại giao', military: 'Quân sự', technology: 'Khoa học – công nghệ', historical_ai: 'Ưu tiên lịch sử & tính cách AI' };
const STATUS_VI: Record<string, string> = { complete: 'Đầy đủ', partial: 'Một phần', missing: 'Thiếu' };

const INFAMY_VI = { none: '', infamous: 'Khét tiếng', notorious: 'Tai tiếng lớn', pariah: 'Bị cô lập' } as const;

export function CountryScreen({ st, id, tab }: { st: GameState; id: string; tab: string }) {
  const c = st.countries[id]; if (!c) return <div class="empty">Quốc gia không tồn tại.</div>;
  if (tab === 'dossier') return <Dossier st={st} id={id} />;
  if (tab === 'stats') return <YearStats st={st} id={id} />;
  if (tab === 'people') return <People st={st} id={id} />;
  const h = st.history[id] ?? []; const ser = (k: 'gdp' | 'pop' | 'literacy' | 'legitimacy' | 'army') => h.map((x) => x[k]);
  const rk = rankings(st); const rank = rk.findIndex((r) => r.id === id) + 1;
  const regs = st.regions.filter((r) => r.owner === id); const area = regs.reduce((s, r) => s + r.area, 0);
  const allies = st.treaties.filter((x) => x.type === 'alliance' && x.members.includes(id)).flatMap((x) => x.members).filter((m, i, a) => m !== id && a.indexOf(m) === i);
  const riv = Object.keys(st.countries).filter((o) => o !== id && st.countries[o].alive && rivals(st, id, o));
  const wars = st.wars.filter((w) => w.attackers.members.includes(id) || w.defenders.members.includes(id));
  const subjects = Object.values(st.countries).filter((x) => x.alive && x.overlord === id).map((x) => x.id);
  const bal = c.income - c.expense; const gdppc = c.gdp / Math.max(1, c.stats.pop);
  const igs = [...IGS].sort((a, b) => c.igs[b].clout - c.igs[a].clout);
  const top = rk.slice(0, 6); const inTop = top.some((r) => r.id === id);
  const powRows = (inTop ? top : [...top.slice(0, 5), rk[rank - 1]]).filter(Boolean).map((r) => ({ label: <span>{rk.indexOf(r) + 1}. {shortName(st, r.id)}</span>, v: r.power, hl: r.id === id, key: r.id }));
  const events = st.log.filter((l) => l.actors.includes(id)).slice(-7).reverse();
  const research = c.research.current ? Math.min(1, c.research.progress / techCost(st, c, c.research.current)) : null;
  return (
    <div class="pad">
      <IdentityHeader st={st} id={id} rank={rank} />
      <div class="metrics">
        <Metric label="GDP / năm" icon="gdp" value={money(c.gdp)} d={<YoY h={h} k="gdp" />} spark={ser('gdp')} tip={{ title: 'GDP / năm', lines: [['GDP / người', `¤ ${fmt(gdppc, 1)}`], ['Công nghiệp hóa', pct(c.stats.industry, 1)]], note: 'Giá trị gia tăng một năm theo giá thị trường của mô phỏng (thang ¤ ≈ GK$ 1990).' }} />
        <Metric label="Dân số" icon="population" value={compact(c.stats.pop)} d={<YoY h={h} k="pop" />} spark={ser('pop')} />
        <Metric label="Biết chữ" icon="literacy" value={pct(c.stats.literacy)} d={<YoY h={h} k="literacy" />} spark={ser('literacy')} />
        <Metric label="Chính danh" icon="legitimacy" value={fmt(c.legitimacy)} d={<span class="dim">cực đoan {pct(c.radicalism)}</span>} spark={ser('legitimacy')} />
        <Metric label="Ngân khố" icon="treasury" value={money(c.treasury)} d={<span class={bal >= 0 ? 'pos' : 'neg'}>{bal >= 0 ? '+' : '−'}{compact(Math.abs(bal))}/tháng</span>} onClick={() => ui.go('economy', 'budget')} />
        <Metric label="Lục quân" icon="army" value={compact(c.army.manpower)} d={<span class="dim">{fmt(c.navy.strength)} tàu</span>} spark={ser('army')} onClick={() => ui.go('military', 'forces')} />
      </div>
      <div class="cols c2">
        <div>
          <Sec title="Chính quyền" icon="politics" go={() => ui.go('politics', 'gov')}>
            <div class="kv"><span class="k">Chính thể</span><span class="v">{lawVi(c.laws.governance)} · {lawVi(c.laws.power)}</span></div>
            <div class="kv"><span class="k">Nguyên thủ</span><span class="v">{leaderName(c.leader.name)}</span></div>
            {c.heir && <div class="kv"><span class="k">Người kế vị</span><span class="v">{c.heir.name}</span></div>}
            <div class="kv"><span class="k">Cải cách</span><span class="v">{c.reform ? `${GROUP_VI[c.reform.group]} → ${lawVi(c.reform.value)} (${pct(c.reform.progress)})` : 'Không có'}</span></div>
            <div style="margin-top:10px"><div class="sub-t">Ảnh hưởng nhóm lợi ích</div>
              <Donut parts={igs.map((g) => ({ label: IG_VI[g], v: c.igs[g].clout, c: IG_COL[g] }))} size={104} center={pct(c.igs[igs[0]].clout)} sub="LỚN NHẤT" max={5} /></div>
          </Sec>
          <Sec title="Kinh tế & xã hội" icon="economy" go={() => ui.go('economy', 'overview')}>
            <div class="kv"><span class="k">GDP / người</span><span class="v num">¤ {fmt(gdppc, 1)}</span></div>
            <div class="kv"><span class="k">Luật kinh tế · thương mại</span><span class="v">{lawVi(c.laws.economy)} · {lawVi(c.laws.trade)}</span></div>
            <div class="kv"><span class="k">Thuế suất</span><span class="v num">{pct(c.taxRate, 1)}</span></div>
            <div class="kv"><span class="k">Lao động</span><span class="v">{lawVi(c.laws.labor)}</span></div>
            <div class="kv"><span class="k">Mức sống trung bình</span><span class="v num">{fmt(c.stats.sol, 2)}</span></div>
            {c.famine > 0.01 && <div class="kv"><span class="k">Thiếu lương thực</span><span class="v num neg">{pct(c.famine)}</span></div>}
            <div class="kv"><span class="k">Nghiên cứu</span><span class="v">{c.research.current ? `${techName(c.research.current)} · ${pct(research ?? 0)}` : 'Chưa chọn'}</span></div>
          </Sec>
        </div>
        <div>
          <Sec title="Đối ngoại" icon="diplomacy" go={() => ui.go('diplomacy', 'relations')}>
            <div class="kv"><span class="k">Đồng minh</span><span class="v links">{allies.length ? allies.slice(0, 4).map((a) => <CountryLink key={a} st={st} id={a} />) : '—'}{allies.length > 4 ? ` +${allies.length - 4}` : ''}</span></div>
            <div class="kv"><span class="k">Đối thủ</span><span class="v links">{riv.length ? riv.slice(0, 4).map((a) => <CountryLink key={a} st={st} id={a} />) : '—'}</span></div>
            <div class="kv"><span class="k">Chư hầu</span><span class="v">{subjects.length ? fmt(subjects.length) : '—'}</span></div>
            <div class="kv"><span class="k">Chiến tranh</span><span class="v">{wars.length ? wars.map((w) => w.name).join('; ') : 'Hòa bình'}</span></div>
            <div class="kv"><span class="k">Uy tín · tiếng xấu</span><span class="v num">{fmt(c.prestige)} · {fmt(c.infamy)}{infamyTier(c) !== 'none' && <span class={`chip infamy ${infamyTier(c)}`}>{INFAMY_VI[infamyTier(c)]}</span>}</span></div>
          </Sec>
          <Sec title="Vị thế thế giới" icon="prestige" x="điểm sức mạnh" go={() => ui.go('world')}>
            <HBars rows={powRows} fmtV={(v) => fmt(v)} />
          </Sec>
          <Sec title="Lãnh thổ" icon="map" x={`${regs.length} vùng · ${compact(area)} km²`} go={() => ui.go('society', 'regions')}>
            {[...regs].sort((a, b) => b.pop - a.pop).slice(0, 5).map((r) => (
              <div class="row tap" key={r.id} onClick={() => focusRegion(r.id)}>
                <div class="grow"><div class="t sm">{regionName(r.id)}{r.id === c.capital && <span class="dim"> · thủ đô</span>}</div></div>
                <span class="num">{compact(r.pop)}</span>
              </div>
            ))}
          </Sec>
        </div>
      </div>
      <Background id={id} />
      <Sec title="Sự kiện gần đây" icon="journal" go={() => ui.go('chronicle', 'log')}>
        {events.length ? events.map((l, i) => <div class="logline" key={i}><span class="dt">{l.date.slice(0, 7)}</span><span title={LOG_TYPE_VI[l.type] ?? l.type}><Icon name={LOG_ICON[l.type] ?? 'scroll'} /></span><span>{l.textVi ?? l.text}{l.divergence && <span class="warn" title="Khác với lịch sử thực"> ⑂</span>}</span></div>) : <div class="empty sm">Chưa có sự kiện nào liên quan.</div>}
      </Sec>
    </div>
  );
}

function Dossier({ st, id }: { st: GameState; id: string }) {
  const e = data().entity.get(id);
  if (!e) return <div class="pad"><div class="empty">Quốc gia này hình thành trong ván chơi nên không có hồ sơ nghiên cứu năm 1836.</div></div>;
  const prof = (e as any).profile ?? {};
  const fact = (f: any) => (f && typeof f === 'object' && 'quality' in f ? f : null);
  const facts: [string, any, (v: any) => string][] = [['Dân số 1836', e.population, (v) => compact(v ?? 0)], ['Biết chữ', fact((e as any).literacy), (v) => pct(v)], ['Quân số', fact((e as any).army), (v) => compact(v)], ['Chính thể khởi đầu', e.laws, (v) => lawVi(v?.governance ?? '')]];
  const done = e.profile_sections.filter((s) => s.status === 'complete').length;
  return (
    <div class="pad">
      <div class="idblock">
        <Flag c={st.countries[id]} lg />
        <div style="min-width:0"><h3>{e.vi}</h3><div class="meta">{e.en} · dữ liệu tại {prof.as_of ?? '1836-01-01'}</div></div>
      </div>
      <div class="metrics">
        <Metric label="Mức hoàn thiện hồ sơ" value={pct(e.research_completeness)} d={<span class="dim">{done}/{e.profile_sections.length} mục đầy đủ</span>} tip={{ title: 'Mức hoàn thiện nghiên cứu', note: 'Chất lượng dữ liệu lịch sử của quốc gia — không phải chỉ số sức mạnh trong ván chơi.' }} />
        <Metric label="Hạng nghiên cứu" value={e.tier} d={<span class="dim">A = cường quốc · D = chưa nghiên cứu riêng</span>} />
      </div>
      <Sec title="Dữ liệu khởi đầu có nguồn">
        <table class="dt"><thead><tr><th>Dữ kiện</th><th class="r">Giá trị</th><th class="r">Nguồn</th></tr></thead>
          <tbody>{facts.filter(([, f]) => f).map(([label, f, show]) => <tr key={label} style="cursor:default"><td>{label}</td><td class="r num">{show(f.value)}</td><td class="r"><QualityMark quality={f.quality} sources={f.sources} method={f.method} /></td></tr>)}</tbody></table>
      </Sec>
      <Sec title="Các mục hồ sơ" x="chạm để xem dữ kiện">
        {e.profile_sections.map((s) => (
          <div class="row tap" key={s.section} onClick={() => details.toggle({ key: `dossier:${id}:${s.section}`, title: SEC_VI[s.section] ?? s.section, ctx: e.vi, body: () => <SectionFacts sec={prof[s.section]} status={s.status} /> })}>
            <span class="ic" style={`color:${s.status === 'complete' ? 'var(--pos)' : s.status === 'partial' ? 'var(--warn)' : 'var(--text-3)'}`}><Icon name={s.status === 'complete' ? 'check' : s.status === 'partial' ? 'scroll' : 'warning'} /></span>
            <div class="grow"><div class="t sm">{SEC_VI[s.section] ?? s.section}</div><div class="s">{STATUS_VI[s.status] ?? s.status} · {s.facts} dữ kiện</div></div>
            {s.worst_quality && <QualityMark quality={s.worst_quality} />}
          </div>
        ))}
      </Sec>
    </div>
  );
}
function SectionFacts({ sec, status }: { sec: any; status: string }) {
  if (!sec || typeof sec !== 'object' || !Object.keys(sec).length) return <div class="empty">Mục này {status === 'missing' ? 'chưa được nghiên cứu' : 'chưa có dữ kiện chi tiết'} trong cơ sở dữ liệu.</div>;
  return (
    <div>
      {Object.entries(sec).map(([k, f]: [string, any]) => {
        const v = f?.value; const txt = v === undefined ? JSON.stringify(f) : typeof v === 'object' ? Object.entries(v).map(([a, b]) => `${a}: ${typeof b === 'object' ? JSON.stringify(b) : b}`).join(' · ') : String(v);
        return <div class="row" key={k} style="align-items:flex-start"><div class="grow"><div class="s">{k.replace(/_/g, ' ')}</div><div style="font-size:14px">{txt}</div>{f?.note && <div class="s">{f.note}</div>}</div>{f?.quality && <QualityMark quality={f.quality} sources={f.sources} method={f.method} />}</div>;
      })}
    </div>
  );
}

function YearStats({ st, id }: { st: GameState; id: string }) {
  const h = st.history[id] ?? []; const years = h.map((x) => x.y);
  return (
    <div class="pad">
      <div class="cols c2">
        <Sec title="Dân số"><LineChart years={years} series={[{ name: 'Dân số', color: '#d9bd7c', values: h.map((x) => x.pop) }]} fmtY={compact} height={130} /></Sec>
        <Sec title="GDP / năm"><LineChart years={years} series={[{ name: 'GDP', color: '#93c47a', values: h.map((x) => x.gdp) }]} fmtY={compact} height={130} /></Sec>
        <Sec title="Biết chữ"><LineChart years={years} series={[{ name: 'Biết chữ', color: '#93bad6', values: h.map((x) => x.literacy) }]} fmtY={(v) => pct(v)} height={130} /></Sec>
        <Sec title="Chính danh"><LineChart years={years} series={[{ name: 'Chính danh', color: '#e3806a', values: h.map((x) => x.legitimacy) }]} fmtY={(v) => fmt(v)} height={130} /></Sec>
        <Sec title="Điểm sức mạnh"><LineChart years={years} series={[{ name: 'Sức mạnh', color: '#c3a05c', values: h.map((x) => x.power) }]} fmtY={(v) => fmt(v)} height={130} /></Sec>
        <Sec title="Lục quân"><LineChart years={years} series={[{ name: 'Lục quân', color: '#b98a7a', values: h.map((x) => x.army) }]} fmtY={compact} height={130} /></Sec>
      </div>
      <div class="note">Mỗi điểm là số liệu ngày 1 tháng 1 hằng năm do mô phỏng ghi lại.</div>
    </div>
  );
}
export const COUNTRY_TABS: [string, string][] = [['overview', 'Tổng quan'], ['people', 'Nhân vật'], ['dossier', 'Hồ sơ lịch sử'], ['stats', 'Chỉ số năm']];
export { Flag };

const LANG_VI: Record<string, string> = { lzh: 'chữ Hán', mnc: 'tiếng Mãn', vi: 'tiếng Việt', en: 'tiếng Anh', fr: 'tiếng Pháp', de: 'tiếng Đức', es: 'tiếng Tây Ban Nha', pt: 'tiếng Bồ Đào Nha', it: 'tiếng Ý', ru: 'tiếng Nga', ota: 'tiếng Ottoman', tr: 'tiếng Thổ', fa: 'tiếng Ba Tư', ar: 'tiếng Ả Rập', zh: 'tiếng Hán', 'zh-hant': 'chữ Hán phồn thể', ja: 'tiếng Nhật', ko: 'tiếng Triều Tiên', th: 'tiếng Thái', my: 'tiếng Miến', nl: 'tiếng Hà Lan', da: 'tiếng Đan Mạch', sv: 'tiếng Thụy Điển', nb: 'tiếng Na Uy', no: 'tiếng Na Uy', pl: 'tiếng Ba Lan', el: 'tiếng Hy Lạp', sr: 'tiếng Serbia', ro: 'tiếng Romania', hu: 'tiếng Hungary', la: 'tiếng Latinh', haw: 'tiếng Hawaii', mi: 'tiếng Māori', am: 'tiếng Amhara', sw: 'tiếng Swahili', ha: 'tiếng Hausa', ur: 'tiếng Urdu', hi: 'tiếng Hindi', pa: 'tiếng Punjab', ne: 'tiếng Nepal', bo: 'tiếng Tạng', mn: 'tiếng Mông Cổ', ms: 'tiếng Mã Lai', id: 'tiếng Indonesia', tl: 'tiếng Tagalog', km: 'tiếng Khmer', lo: 'tiếng Lào', ka: 'tiếng Gruzia', hy: 'tiếng Armenia', ps: 'tiếng Pashto', uz: 'tiếng Uzbek' };
const ROLE_VI: Record<string, string> = { head_of_state: 'Nguyên thủ', head_of_government: 'Đứng đầu chính phủ', heir: 'Người kế vị' };
const yr = (s: string | null | undefined) => (s ? s.slice(0, 4) : '?');
const life = (c: ContentCharacter) => `${yr(c.born ?? c.wd_born)}–${c.died || c.wd_died ? yr(c.died ?? c.wd_died) : ''}`;
const display = (c: ContentCharacter) => c.label_vi && c.label_vi !== c.name ? c.label_vi : c.name;

function Monogram({ name, lg }: { name: string; lg?: boolean }) {
  const init = name.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter((w) => /^[A-ZÀ-Ỹ]/.test(w)).slice(0, 2).map((w) => w[0]).join('') || name[0];
  return <span class={`monogram${lg ? ' lg' : ''}`} aria-hidden="true">{init}</span>;
}

function IdentityHeader({ st, id, rank }: { st: GameState; id: string; rank: number }) {
  useContent();
  const c = st.countries[id]; const y = st.date.y; const ec = entityContent(id);
  const arms = symbolFor(id, 'coat_of_arms', y);
  const names = (ec?.names ?? []).filter((n) => (n.from == null || n.from <= y) && (n.to == null || n.to >= y) && n.lang !== 'en').slice(0, 3);
  const ruler = characterByName(id, c.leader.name);
  return (
    <div class="identity" style={`--bc:${c.color}`}>
      <div class="id-symbols"><Flag c={c} lg />{arms && <AssetImg id={arms.id} cls="arms" />}</div>
      <div class="id-main">
        <h3>{fullName(st, id)}</h3>
        {names.length > 0 && <div class="names">{names.map((n) => <span key={n.text} lang={n.lang}>{n.text}<i>{LANG_VI[n.lang] ?? n.lang}</i></span>)}</div>}
        <div class="meta">{govVi(c.govLabel)} · thủ đô {regionName(c.capital)}</div>
        <div class="meta dim">Hạng sức mạnh #{rank || '—'}{c.overlord ? <> · {SUBJECT_VI[c.subjectType ?? ''] ?? 'Chư hầu'} của <CountryLink st={st} id={c.overlord} /></> : ''}</div>
      </div>
      <button class="ruler" onClick={() => ruler && openCharacter(st, ruler)} disabled={!ruler} aria-label={`Nguyên thủ: ${leaderName(c.leader.name)}`}>
        <AssetImg id={ruler?.portrait} cls="portrait" fallback={<Monogram name={c.leader.name} />} />
        <span class="rt">
          <span class="lbl">{c.leader.titleVi ?? titleVi(leaderTitle(c))}</span>
          <b>{ruler ? display(ruler) : leaderName(c.leader.name)}</b>
          <span class="s">{ruler?.title ? `${ruler.title} · ` : ''}từ {c.leader.since}{c.leader.historical ? '' : ' · nhân vật mô phỏng'}</span>
        </span>
      </button>
    </div>
  );
}

function Background({ id }: { id: string }) {
  useContent();
  const ec = entityContent(id);
  if (!ec?.texts?.length) return null;
  const note = ec.kind === 'people' ? 'Bài viết về cộng đồng dân cư của vùng — chính thể này trong game là tập hợp các cộng đồng tự trị.'
    : ec.kind === 'region' ? 'Bài viết về vùng lịch sử mà chính thể này đại diện.'
    : ec.kind === 'future' ? 'Quốc gia này chỉ có thể hình thành trong quá trình mô phỏng; bài viết mô tả hình thức lịch sử của nó.'
    : ec.desc_override ? 'Bài viết về thời kỳ của quốc gia (bài về quốc gia mô tả chủ yếu thời hiện đại).' : null;
  return (
    <Sec title="Bối cảnh lịch sử" icon="scroll">
      {note && <div class="s" style="margin-bottom:6px">{note}</div>}
      <SourcedText texts={ec.texts} />
    </Sec>
  );
}

function status(st: GameState, id: string, ch: ContentCharacter): { t: string; cls: string } {
  const c = st.countries[id]; const now = `${st.date.y}-${String(st.date.m).padStart(2, '0')}`;
  if (c && characterByName(id, c.leader.name)?.id === ch.id) return { t: 'Đang tại vị', cls: 'pos' };
  const t = ch.terms.find((x) => x.role === 'head_of_state');
  if (ch.died && ch.died.slice(0, 7) < now) return { t: 'Đã mất', cls: 'dim' };
  if (t && t.from.slice(0, 7) > now) return { t: st.mode === 'historical' ? `Lịch sử: lên ngôi ${t.from.slice(0, 4)}` : `Lịch sử: ${t.from.slice(0, 4)}`, cls: 'dim' };
  return { t: ch.roles.map((r) => ROLE_VI[r] ?? r).join(', '), cls: 'dim' };
}

function People({ st, id }: { st: GameState; id: string }) {
  const pack = useContent();
  const list = charactersOf(id);
  if (!pack) return <div class="pad"><div class="empty">Đang tải gói nội dung nhân vật…</div></div>;
  if (!list.length) return <div class="pad"><div class="empty">Chưa có nhân vật lịch sử nào được nghiên cứu cho quốc gia này. Nguyên thủ trong ván chơi: {leaderName(st.countries[id]?.leader.name ?? '—')}.</div></div>;
  const groups: [string, ContentCharacter[]][] = [['head_of_state', list.filter((c) => c.roles.includes('head_of_state'))], ['head_of_government', list.filter((c) => c.roles.includes('head_of_government') && !c.roles.includes('head_of_state'))], ['heir', list.filter((c) => c.roles.length === 1 && c.roles[0] === 'heir')]];
  const withPortrait = list.filter((c) => c.portrait).length; const linked = list.filter((c) => c.qid).length;
  return (
    <div class="pad">
      <div class="note" style="margin-top:0">{list.length} nhân vật · {linked} đã đối chiếu Wikidata (khớp năm sinh/mất) · {withPortrait} có chân dung được cấp phép. Nguyên thủ kế vị theo lịch sử chỉ được áp dụng ở chế độ Lịch sử khi điều kiện mô phỏng phù hợp.</div>
      {groups.filter(([, l]) => l.length).map(([role, l]) => (
        <Sec key={role} title={ROLE_VI[role]} x={`${l.length}`}>
          <div class="people">
            {l.map((ch) => { const s = status(st, id, ch); const t = ch.terms.find((x) => x.role === role) ?? ch.terms[0]; return (
              <button class="person" key={ch.id} onClick={() => openCharacter(st, ch)}>
                <AssetImg id={ch.portrait} cls="portrait sm" fallback={<Monogram name={ch.name} />} />
                <span class="grow">
                  <span class="t sm">{display(ch)}</span>
                  <span class="s">{ch.title ? `${ch.title} · ` : ''}{life(ch)}{t ? ` · ${t.from.slice(0, 4)}–${t.to ? t.to.slice(0, 4) : ''}` : ''}</span>
                  <span class={`s ${s.cls}`}>{s.t}</span>
                </span>
              </button>
            ); })}
          </div>
        </Sec>
      ))}
    </div>
  );
}

function openCharacter(st: GameState, ch: ContentCharacter) {
  details.open({ key: 'char:' + ch.id, title: display(ch), ctx: shortNameOf(st, ch.entity), body: () => <CharacterDetail st={st} ch={ch} /> });
}
const shortNameOf = (st: GameState, id: string) => (st.countries[id] ? fullName(st, id) : id);

function CharacterDetail({ st, ch }: { st: GameState; ch: ContentCharacter }) {
  useContent();
  const p = asset(ch.portrait); const s = status(st, ch.entity, ch);
  const dbBorn = ch.born?.slice(0, 4), wdBorn = ch.wd_born?.slice(0, 4), dbDied = ch.died?.slice(0, 4), wdDied = ch.wd_died?.slice(0, 4);
  return (
    <div>
      <div class="char-head">
        <AssetImg id={ch.portrait} cls="portrait lg" fallback={<Monogram name={ch.name} lg />} />
        <div style="min-width:0">
          <div class="t">{display(ch)}</div>
          {ch.label_vi && ch.label_vi !== ch.name && <div class="s">{ch.name}</div>}
          <div class="s">{ch.title ?? ch.roles.map((r) => ROLE_VI[r] ?? r).join(', ')} · {life(ch)}</div>
          <div class={`s ${s.cls}`}>{s.t}</div>
          {(ch.description_vi || ch.description_en) && <div class="s" style="margin-top:4px">{ch.description_vi ?? ch.description_en}</div>}
        </div>
      </div>
      <div class="sub-t">Nhiệm kỳ trong cơ sở dữ liệu</div>
      {ch.terms.length ? ch.terms.map((t, i) => <div class="kv" key={i}><span class="k">{ROLE_VI[t.role] ?? t.role}</span><span class="v num">{t.from}{t.to ? ` → ${t.to}` : ''}</span></div>) : <div class="s">Không có nhiệm kỳ ghi nhận.</div>}
      <div class="kv"><span class="k">Năm sinh · mất (CSDL)</span><span class="v num">{dbBorn ?? '?'} · {dbDied ?? '—'}</span></div>
      {ch.qid && <div class="kv"><span class="k">Năm sinh · mất (Wikidata)</span><span class="v num">{wdBorn ?? '?'} · {wdDied ?? '—'}{(dbBorn && wdBorn && dbBorn !== wdBorn) || (dbDied && wdDied && dbDied !== wdDied) ? <span class="warn"> lệch</span> : ''}</span></div>}
      <div class="kv"><span class="k">Đối chiếu danh tính</span><span class="v">{ch.match === 'strong' ? 'khớp năm sinh/mất' : ch.match === 'weak' ? 'khớp yếu (chưa có ngày trong CSDL)' : 'chưa đối chiếu'}{ch.qid && <> · <a href={`https://www.wikidata.org/wiki/${ch.qid}`} target="_blank" rel="noopener">{ch.qid}</a></>}</span></div>
      {ch.texts.length > 0 && <><div class="sub-t">Tiểu sử</div><SourcedText texts={ch.texts} lines={8} /></>}
      {p && <><div class="sub-t">Nguồn chân dung</div><AssetCredit a={p} /></>}
    </div>
  );
}
