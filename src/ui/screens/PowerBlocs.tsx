// PB-01b: Diplomacy → "Khối quyền lực" tab. Reads engine state; every action is an engine command.
import { useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { BLOC, BLOC_IDENTITIES, PRINCIPLES, blocOf, canFound, leverage, maxPrincipleLevel, principleLevel, principleSlots, wouldJoin, type BlocIdentity, type PowerBloc } from '../../engine/systems/powerBlocs';
import { Sec, Metric } from '../components/ui';
import { fmt } from '../i18n/vi';
import { shortName } from '../game/names';
import { CountryLink, viewedId, canCommand, send } from './common';

export const IDENTITY_VI: Record<BlocIdentity, [string, string]> = {
  trade_league: ['Liên minh thương mại', 'Gắn kết nhờ thị trường chung; có thể hợp nhất thị trường các thành viên.'],
  sovereign_empire: ['Đế chế chủ quyền', 'Gắn kết nhờ các chư hầu; có thể thu cống nạp từ thành viên.'],
  ideological_union: ['Liên minh ý thức hệ', 'Gắn kết nhờ cùng thể chế và kinh tế; kéo luật của thành viên theo nước đứng đầu.'],
  military_treaty: ['Tổ chức hiệp ước quân sự', 'Gắn kết nhờ có chung đối thủ; phòng thủ chung.'],
  religious_convocation: ['Hội đồng tôn giáo', 'Gắn kết nhờ cùng tôn giáo; giới tăng lữ ủng hộ.'],
};
export const PRINCIPLE_VI: Record<string, [string, string]> = {
  market_unification: ['Hợp nhất thị trường', 'C1: thành viên hướng về liên minh thuế quan của nước đứng đầu · C2: có thể mời vào · C3: mọi thành viên chung một thị trường'],
  internal_trade: ['Thương mại nội khối', 'Năng lực thương mại +5% mỗi cấp'],
  advanced_research: ['Nghiên cứu tiên tiến', 'Tiếp thu công nghệ từ bên ngoài +10% mỗi cấp'],
  defensive_cooperation: ['Hợp tác phòng thủ', 'C1: thành viên sẵn sàng giúp nhau · C2: liên minh phòng thủ chung · C3: chất lượng lục quân +5%'],
  creative_legislature: ['Lập pháp sáng tạo', 'Tiến độ cải cách luật +0,01/tháng mỗi cấp'],
  police_coordination: ['Phối hợp cảnh sát', 'Dân cực đoan −5% mỗi cấp'],
  exploit_members: ['Khai thác thành viên', 'Nhận 2% thu nhập của mỗi thành viên mỗi cấp'],
  ideological_alignment: ['Đồng bộ ý thức hệ', 'Thành viên ưu tiên cải cách theo luật của nước đứng đầu'],
  sacred_civics: ['Công dân thiêng liêng', 'Giới tăng lữ ở các nước thành viên ủng hộ hơn'],
};

const LEVEL_VI = ['—', 'Cấp 1', 'Cấp 2', 'Cấp 3'];

export function PowerBlocsTab({ st }: { st: GameState }) {
  const id = viewedId(st); const mine = canCommand(st, id);
  const b = blocOf(st, id);
  const others = Object.values(st.powerBlocs ?? {}).filter((x) => x.id !== b?.id);
  return (
    <div class="pad">
      <div class="note" style="margin-top:0">Khối quyền lực: một cường quốc lập khối với một bản sắc và các nguyên tắc. Các nước gia nhập khi đòn bẩy của nước đứng đầu đủ mạnh so với các khối khác. Độ gắn kết quyết định số nguyên tắc có hiệu lực và cấp của chúng; gắn kết thấp thì thành viên bỏ đi.</div>
      {b ? <BlocCard st={st} b={b} me={id} mine={mine} /> : <FoundCard st={st} id={id} mine={mine} />}
      {others.length > 0 && <Sec title="Các khối khác" x={`${others.length}`}>
        {others.map((o) => <div class="kv" key={o.id}><span class="k">{o.name} · <CountryLink st={st} id={o.leader} /></span><span class="v">{IDENTITY_VI[o.identity][0]} · {o.members.length} nước · gắn kết {fmt(o.cohesion)}</span></div>)}
      </Sec>}
    </div>
  );
}

function FoundCard({ st, id, mine }: { st: GameState; id: string; mine: boolean }) {
  const why = canFound(st, id);
  const [name, setName] = useState(`Khối ${shortName(st, id)}`);
  const [identity, setIdentity] = useState<BlocIdentity>('trade_league');
  const [principle, setPrinciple] = useState<string>('internal_trade');
  const allowed = Object.keys(PRINCIPLES).filter((g) => !PRINCIPLES[g].identity || PRINCIPLES[g].identity === identity);
  return (
    <Sec title="Lập khối quyền lực">
      {why ? <div class="note">Chưa thể lập khối: {why === 'Only a great power can found a bloc' ? `chỉ cường quốc (top ${BLOC.foundRank} sức mạnh) mới lập được khối.` : why === 'Already in a bloc' ? 'nước này đang ở trong một khối.' : 'nước này không có chủ quyền đầy đủ.'}</div> : mine && <>
        <div class="kv"><span class="k">Tên khối</span><span class="v"><input value={name} maxLength={48} onInput={(e) => setName((e.target as HTMLInputElement).value)} /></span></div>
        <div class="s" style="margin:6px 0">Bản sắc:</div>
        {BLOC_IDENTITIES.map((k) => <div class={`option${identity === k ? ' cur' : ''}`} key={k} onClick={() => { setIdentity(k); if (PRINCIPLES[principle].identity && PRINCIPLES[principle].identity !== k) setPrinciple('internal_trade'); }} style="cursor:pointer"><div class="oh"><span class="ot">{IDENTITY_VI[k][0]}</span></div><div class="s">{IDENTITY_VI[k][1]}</div></div>)}
        <div class="s" style="margin:6px 0">Nguyên tắc đầu tiên:</div>
        {allowed.map((g) => <div class={`option${principle === g ? ' cur' : ''}`} key={g} onClick={() => setPrinciple(g)} style="cursor:pointer"><div class="oh"><span class="ot">{PRINCIPLE_VI[g][0]}</span></div><div class="s">{PRINCIPLE_VI[g][1]}</div></div>)}
        <div style="margin-top:8px"><button class="btn" onClick={() => send({ type: 'found_bloc', name, identity, principle }, `Lập ${name}`)}>Lập khối</button></div>
      </>}
    </Sec>
  );
}

function BlocCard({ st, b, me, mine }: { st: GameState; b: PowerBloc; me: string; mine: boolean }) {
  const leader = b.leader === me;
  const slots = principleSlots(b); const maxL = maxPrincipleLevel(b);
  const cooldown = Math.max(0, BLOC.principleCooldownMonths - (st.tick - b.lastPrincipleChange));
  const candidates = Object.values(st.countries).filter((c) => c.alive && !c.decentralized && !b.members.includes(c.id))
    .map((c) => ({ id: c.id, lev: leverage(st, b.leader, c.id), ok: c.id === st.player || wouldJoin(st, b, c.id) }))
    .sort((x, y) => y.lev - x.lev).slice(0, 12);
  const free = Object.keys(PRINCIPLES).filter((g) => !(g in b.principles) && (!PRINCIPLES[g].identity || PRINCIPLES[g].identity === b.identity));
  return (
    <>
      <div class="metrics">
        <Metric label={b.name} icon="diplomacy" value={IDENTITY_VI[b.identity][0]} d={<span class="dim">đứng đầu: {shortName(st, b.leader)}</span>} />
        <Metric label="Độ gắn kết" icon="legitimacy" value={fmt(b.cohesion)} d={<span class={b.cohesion < BLOC.lowCohesion ? 'neg' : 'dim'}>{b.cohesion < BLOC.lowCohesion ? 'thấp: thành viên có thể bỏ đi' : `cấp tối đa ${maxL}`}</span>} />
        <Metric label="Thành viên" icon="people" value={fmt(b.members.length)} d={<span class="dim">ô nguyên tắc {Object.keys(b.principles).length}/{slots}</span>} />
      </div>
      <Sec title="Nguyên tắc" x={cooldown ? `đổi lại sau ${cooldown} tháng` : 'có thể thay đổi'}>
        {Object.keys(b.principles).map((g) => {
          const work = principleLevel(b, g);
          return (
            <div class="option" key={g}>
              <div class="oh"><span class="ot">{PRINCIPLE_VI[g][0]} — {LEVEL_VI[b.principles[g]]}</span><span class={`tag ${work ? 'up' : 'flat'}`}>{work ? `hiệu lực ${LEVEL_VI[work]}` : 'chưa hiệu lực'}</span></div>
              <div class="s">{PRINCIPLE_VI[g][1]}</div>
              {mine && leader && !cooldown && <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                {[1, 2, 3].filter((l) => l !== b.principles[g] && l <= maxL).map((l) => <button key={l} class="btn sm" onClick={() => send({ type: 'bloc_principle', group: g, level: l }, `${PRINCIPLE_VI[g][0]}: ${LEVEL_VI[l]}`)}>{LEVEL_VI[l]}</button>)}
                <button class="btn sm" onClick={() => send({ type: 'bloc_principle', group: g, level: 0 }, `Bỏ ${PRINCIPLE_VI[g][0]}`)}>Bỏ</button>
              </div>}
            </div>
          );
        })}
        {mine && leader && !cooldown && Object.keys(b.principles).length < slots && free.map((g) => <div class="option" key={g}><div class="oh"><span class="ot">{PRINCIPLE_VI[g][0]}</span><button class="btn sm" onClick={() => send({ type: 'bloc_principle', group: g, level: 1 }, `Thêm ${PRINCIPLE_VI[g][0]}`)}>Thêm</button></div><div class="s">{PRINCIPLE_VI[g][1]}</div></div>)}
      </Sec>
      <Sec title="Thành viên" x={`${b.members.length}`}>
        {b.members.map((m) => <div class="kv" key={m}><span class="k"><CountryLink st={st} id={m} />{m === b.leader ? ' (đứng đầu)' : ''}</span><span class="v">{m === b.leader ? '' : `đòn bẩy ${fmt(leverage(st, b.leader, m))}`}{mine && leader && m !== b.leader && <button class="btn sm" style="margin-left:8px" onClick={() => send({ type: 'bloc_expel', target: m }, `Trục xuất ${shortName(st, m)}`)}>Trục xuất</button>}</span></div>)}
      </Sec>
      {mine && leader && <Sec title="Mời gia nhập" x="đòn bẩy cao nhất">
        <div class="note" style="margin-top:0">Đòn bẩy đến từ sức mạnh tương đối, quan hệ, chung thị trường, chư hầu, liên minh, láng giềng, cùng văn hóa/tôn giáo và công ty của bạn ở nước đó. Nước được mời so với đòn bẩy của các khối khác.</div>
        {candidates.map((c) => <div class="kv" key={c.id}><span class="k"><CountryLink st={st} id={c.id} /></span><span class="v">đòn bẩy {fmt(c.lev)} · <span class={c.ok ? 'pos' : 'neg'}>{c.id === st.player ? 'người chơi' : c.ok ? 'sẽ nhận lời' : 'sẽ từ chối'}</span><button class="btn sm" style="margin-left:8px" disabled={!c.ok} onClick={() => send({ type: 'bloc_invite', target: c.id }, `Mời ${shortName(st, c.id)}`)}>Mời</button></span></div>)}
      </Sec>}
      {mine && <div style="margin-top:8px"><button class="btn sm" onClick={() => send({ type: 'bloc_leave' }, leader ? `Giải tán ${b.name}` : `Rời ${b.name}`)}>{leader ? 'Giải tán khối' : 'Rời khối'}</button></div>}
    </>
  );
}
