import type { GameState, Treaty } from '../types';

/** Historical seed treaties without a status field are treated as active legacy agreements. */
export function treatyIsActive(st: Pick<GameState, 'calendar'>, treaty: Treaty): boolean {
  if ((treaty.status ?? 'active') !== 'active') return false;
  const step = st.calendar?.stepIndex ?? 0;
  return treaty.endStep == null || step < treaty.endStep;
}

/** Most-favoured tariff reduction granted by an active bilateral trade agreement, capped at 50%. */
export function treatyTariffReduction(st: GameState, countryId: string): number {
  let reduction = 0;
  for (const treaty of st.treaties) {
    if (treaty.type !== 'trade_agreement' || !treaty.members.includes(countryId) || !treatyIsActive(st, treaty)) continue;
    for (const clause of treaty.clauses ?? []) {
      if (clause.kind === 'tariff_reduction' && Number.isFinite(clause.value)) {
        reduction = Math.max(reduction, Math.max(0, Math.min(0.5, clause.value!)));
      }
    }
  }
  return reduction;
}
