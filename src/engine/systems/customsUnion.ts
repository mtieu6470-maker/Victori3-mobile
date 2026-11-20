import type { Country, GameState } from '../types';

/**
 * Keep the denormalized Country.customsUnion pointer and Treaty.members in sync.
 * Passing null removes a country from every customs union; passing an existing
 * union ID transfers it there and repairs stale/missing leadership deterministically.
 *
 * Returns the active treaty leader after a join, or undefined after a leave/invalid
 * request. The caller owns eligibility checks and user-facing logging.
 */
export function setCustomsUnionMembership(
  st: GameState,
  countryId: string,
  unionId: string | null,
): Country | undefined {
  const country = st.countries[countryId];
  if (!country) return undefined;

  const target = unionId
    ? st.treaties.find((treaty) => treaty.id === unionId && treaty.type === 'customs_union')
    : undefined;
  if (unionId && !target) return undefined;

  for (const treaty of st.treaties) {
    if (treaty.type !== 'customs_union') continue;

    if (treaty.id === unionId) {
      if (!treaty.members.includes(countryId)) treaty.members.push(countryId);
    } else {
      treaty.members = treaty.members.filter((memberId) => memberId !== countryId);
    }

    const leader = treaty.leader ? st.countries[treaty.leader] : undefined;
    if (!leader?.alive || !treaty.members.includes(treaty.leader!)) {
      const replacement = treaty.members.find((memberId) => st.countries[memberId]?.alive)
        ?? treaty.members[0];
      if (replacement) treaty.leader = replacement;
      else delete treaty.leader;
    }
  }

  // A union with no remaining members has no economic market to govern.
  st.treaties = st.treaties.filter(
    (treaty) => treaty.type !== 'customs_union' || treaty.members.length > 0,
  );

  country.customsUnion = unionId;
  if (!unionId) return undefined;

  const updated = st.treaties.find(
    (treaty) => treaty.id === unionId && treaty.type === 'customs_union',
  );
  const leaderId = updated?.leader;
  return leaderId ? st.countries[leaderId] : undefined;
}
