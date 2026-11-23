// PB-03a: Diplomacy → "Chư hầu & đối thủ": subject types table, each subject's liberty desire (with its factors),
// monthly payment and the overlord's actions; for a subject, its own liberty desire and independence. Reads engine
// state; every action is an engine command.
import { useState } from 'preact/hooks';
import type { Country, GameState } from '../../engine/types';
import { SUBJECT, SUBJECT_TYPES, libertyParts, pactOf, paymentRate, subjectActionBlocker, type SubjectAction } from '../../engine/systems/subjects';
import { Sec } from '../components/ui';
import { SUBJECT_VI, fmt, money } from '../i18n/vi';
const d2 = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(2).replace('.', ',')}`;
import { shortName } from '../game/names';
import { CountryLink, canCommand, send } from './common';

const TYPE_VI: Record<string, string> = { ...SUBJECT_VI, princely_state: 'Phiên vương', autonomous_vassal: 'Chư hầu tự trị' };
const AUTONOMY_VI = ['thấp', 'vừa', 'cao'];
const PART_VI: Record<string, string> = {
  base: 'Mặc định', relations: 'Quan hệ với tông chủ', payments: 'Mức cống nạp đã điều chỉnh', power: 'Sức mạnh so với tông chủ',
  culture: 'Văn hóa (cùng/khác tông chủ)', infamy: 'Tai tiếng của tông chủ', market: 'Chung thị trường', pacts: 'Hiệp ước (tri thức, miễn quân dịch, hỗ trợ)',
  bloc: 'Khối quyền lực của tông chủ', era: 'Thời đại phi thực dân hóa',
};
const ACTIONS: [SubjectAction, string, string][] = [
  ['raise_pay', 'Tăng cống nạp', `+10% thu nhập của chư hầu; mong muốn tự do +${SUBJECT.raisedPay * 0.1}/tháng`],
  ['reduce_pay', 'Giảm cống nạp', `−10%; mong muốn tự do −${SUBJECT.reducedPay * 0.1}/tháng`],
  ['knowledge', 'Chia sẻ tri thức', `chư hầu tiếp thu công nghệ +10%; mong muốn tự do ${SUBJECT.knowledge}/tháng`],
  ['exempt', 'Miễn nghĩa vụ quân sự', `chư hầu không theo bạn vào chiến tranh; mong muốn tự do ${SUBJECT.exempt}/tháng`],
  ['support', 'Hỗ trợ chính quyền', `bạn trả ${SUBJECT.supportCost * 100}% thu nhập của họ mỗi tháng; mong muốn tự do ${SUBJECT.support}/tháng`],
  ['more_autonomy', 'Tăng tự trị', 'lên loại tự trị hơn; mong muốn tự do −30'],
  ['less_autonomy', 'Giảm tự trị', `xuống loại ít tự trị hơn (cần mong muốn tự do < ${SUBJECT.reduceBelow}); +15`],
  ['annex', 'Sáp nhập', `cần mong muốn tự do thấp; các chư hầu khác +${SUBJECT.annexOthers}`],
  ['release', 'Trao độc lập', 'chư hầu thành nước độc lập'],
];
const libertyLabel = (l: number) => l >= SUBJECT.requestAt ? ['Cao', 'neg'] : l >= 25 ? ['Vừa', 'warn'] : ['Thấp', 'pos'];

function LibertyBar({ v }: { v: number }) {
  const [label, cls] = libertyLabel(v);
  return <div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:8px;border-radius:4px;background:var(--line,#444);overflow:hidden"><div style={`width:${v}%;height:100%;background:${v >= 75 ? '#c0504d' : v >= 25 ? '#d4a03c' : '#5a9a5a'}`} /></div><span class={cls}>{label} ({fmt(v)})</span></div>;
}
function LibertyBreakdown({ st, c }: { st: GameState; c: Country }) {
  const parts = libertyParts(st, c); const p = pactOf(st, c);
  if (!parts) return null;
  return <div style="margin:4px 0 6px 12px">
    <div class="s">Thay đổi mỗi tháng: <b class={(p.change ?? 0) > 0 ? 'neg' : 'pos'}>{d2(p.change ?? 0)}</b> (càng gần hai đầu thang càng chậm)</div>
    {Object.entries(parts).filter(([, v]) => v).map(([k, v]) => <div class="kv" key={k}><span class="k s">{PART_VI[k]}</span><span class={`v ${v > 0 ? 'neg' : 'pos'}`}>{d2(v)}</span></div>)}
  </div>;
}

export function SubjectTypesTable() {
  return <table class="dt"><thead><tr><th>Loại</th><th>Tự trị</th><th>Ngoại giao riêng</th><th class="r">Nộp</th><th>Sáp nhập được</th></tr></thead><tbody>
    {Object.entries(SUBJECT_TYPES).map(([k, t]) => <tr key={k}><td>{TYPE_VI[k] ?? k}</td><td class="muted">{AUTONOMY_VI[t.autonomy]}</td><td>{t.diplomacy ? 'có' : 'không'}</td><td class="r num">{Math.round(t.pay * 100)}%</td><td>{t.annexable ? 'có' : 'không'}</td></tr>)}
  </tbody></table>;
}

/** Overlord view: one row per subject with liberty, payment and actions. */
export function OverlordSubjects({ st, id }: { st: GameState; id: string }) {
  const mine = canCommand(st, id);
  const subs = Object.values(st.countries).filter((c) => c.alive && c.overlord === id);
  const [open, setOpen] = useState<string | null>(null);
  const total = subs.reduce((s, c) => s + (c.subjectPact?.paid ?? 0), 0);
  return <Sec title="Chư hầu" x={`${subs.length} · nhận ${money(total)}/tháng`}>
    {!subs.length && <div class="empty sm">Không có.</div>}
    {subs.map((c) => {
      const p = pactOf(st, c); const t = SUBJECT_TYPES[c.subjectType ?? ''];
      return <div class="option" key={c.id}>
        <div class="oh" style="cursor:pointer" onClick={() => setOpen(open === c.id ? null : c.id)}><span class="ot"><CountryLink st={st} id={c.id} /> · {TYPE_VI[c.subjectType ?? ''] ?? c.subjectType}</span><span class="tag flat">nộp {Math.round(paymentRate(st, c) * 100)}% · {money(p.paid ?? 0)}/tháng</span></div>
        <LibertyBar v={p.liberty} />
        <div class="s">{[p.payAdj > 0 ? 'đang tăng cống nạp' : p.payAdj < 0 ? 'đang giảm cống nạp' : '', p.knowledge ? 'chia sẻ tri thức' : '', p.exempt ? 'miễn quân dịch' : '', p.support ? 'hỗ trợ chính quyền' : ''].filter(Boolean).join(' · ') || 'chưa có hiệp ước'}{t ? ` · tự trị ${AUTONOMY_VI[t.autonomy]}` : ''}</div>
        {open === c.id && <>
          <LibertyBreakdown st={st} c={c} />
          {mine && <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin-top:6px">
            {ACTIONS.map(([a, label, sub]) => {
              const why = subjectActionBlocker(st, id, c.id, a);
              const on = (a === 'knowledge' && p.knowledge) || (a === 'exempt' && p.exempt) || (a === 'support' && p.support);
              return <button key={a} class={`btn sm${a === 'annex' || a === 'release' ? ' danger' : ''}`} disabled={!!why} title={why ?? sub} style="text-align:left;white-space:normal" onClick={() => send({ type: 'subject_pact', target: c.id, action: a }, `${label}: ${shortName(st, c.id)}`)}>
                <b>{on ? `Bỏ ${label.toLowerCase()}` : label}</b><br /><span class="s">{why ?? sub}</span>
              </button>;
            })}
          </div>}
        </>}
      </div>;
    })}
  </Sec>;
}

/** Subject view: my liberty desire toward my overlord, and independence. */
export function MySubjectStatus({ st, id }: { st: GameState; id: string }) {
  const c = st.countries[id]; if (!c.overlord) return null;
  const p = pactOf(st, c); const mine = canCommand(st, id);
  return <Sec title="Quan hệ lệ thuộc">
    <div class="kv"><span class="k">{TYPE_VI[c.subjectType ?? ''] ?? 'Chư hầu'} của</span><span class="v"><CountryLink st={st} id={c.overlord} /></span></div>
    <div class="kv"><span class="k">Nộp cho tông chủ</span><span class="v">{Math.round(paymentRate(st, c) * 100)}% thu nhập · {money(p.paid ?? 0)}/tháng</span></div>
    <div class="s" style="margin-top:4px">Mong muốn tự do:</div>
    <LibertyBar v={p.liberty} />
    <LibertyBreakdown st={st} c={c} />
    {mine && <button class="btn sm danger" disabled={p.liberty < SUBJECT.requestAt} title={p.liberty < SUBJECT.requestAt ? `Cần mong muốn tự do ≥ ${SUBJECT.requestAt}` : ''} onClick={() => send({ type: 'subject_independence' }, `Giành độc lập khỏi ${shortName(st, c.overlord!)}`)}>Tuyên chiến giành độc lập</button>}
  </Sec>;
}
