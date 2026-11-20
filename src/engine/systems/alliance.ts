import { data } from '../data/db';
import { dateToTick } from '../core';
import type { AllianceSeed } from '../data/dbTypes';
import type { GameState, Treaty, TreatyTerms, TreatyType } from '../types';

export function treatyTypeFromSeed(
  seed: Pick<AllianceSeed, 'type' | 'defense' | 'entente' | 'neutrality' | 'nonaggression'>,
): TreatyType {
  const sourceType = seed.type.toLowerCase();
  if (sourceType.includes('non-aggression')) return 'non_aggression_pact';
  if (sourceType.includes('neutrality')) return 'neutrality_pact';
  if (sourceType.includes('entente')) return 'entente';
  if (sourceType.includes('defense pact')) return 'defensive_pact';

  // Defensive fallbacks support older/generic source rows whose type label
  // did not identify the legal category.
  if (seed.defense) return 'defensive_pact';
  if (seed.nonaggression) return 'non_aggression_pact';
  if (seed.neutrality) return 'neutrality_pact';
  if (seed.entente) return 'entente';
  return 'historical_pact';
}

export function treatyTermsFromSeed(seed: AllianceSeed): TreatyTerms {
  return {
    defense: seed.defense,
    entente: seed.entente,
    neutrality: seed.neutrality,
    nonaggression: seed.nonaggression,
    sourceType: seed.type,
  };
}

function aliveMembersInOrder(st: GameState, ids: readonly string[]): string[] {
  return [...new Set(ids.filter((id) => st.countries[id]?.alive))];
}

function aliveMembersSorted(st: GameState, ids: readonly string[]): string[] {
  return aliveMembersInOrder(st, ids).sort();
}

function appendBilateralPairs(
  output: Treaty[],
  seenIds: Set<string>,
  original: Treaty,
  members: readonly string[],
  sourceId: string | null,
  seed?: AllianceSeed,
): void {
  const pairMembers = [...new Set(members)].sort();
  for (let i = 0; i < pairMembers.length; i++) {
    for (let j = i + 1; j < pairMembers.length; j++) {
      const left = pairMembers[i];
      const right = pairMembers[j];
      const id = seed
        ? `historical:${seed.id}:${left}:${right}`
        : sourceId
          ? `legacy:${sourceId}:${left}:${right}`
          : `alliance:${left}:${right}`;
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      output.push({
        ...original,
        id,
        type: seed ? treatyTypeFromSeed(seed) : original.type,
        members: [left, right],
        start: seed ? dateToTick(seed.start) : original.start,
        end: seed ? (seed.end ? dateToTick(seed.end) : null) : original.end,
        source: seed?.id ?? sourceId ?? original.source,
        terms: seed ? treatyTermsFromSeed(seed) : original.terms,
      });
    }
  }
}

/**
 * Expand historical source agreements into bilateral country-pair records.
 * Identity is source agreement + unordered pair, never pair alone. Overlapping
 * but distinct historical agreements therefore remain distinct.
 *
 * Older saves may carry semicolon-collapsed source IDs from the previous
 * pair-only normalizer. Reconstruct known IDs from the source registry and
 * preserve unknown legacy IDs instead of dropping them.
 */
export function normalizeHistoricalTreaties(st: GameState): void {
  const seeds = new Map(data().db.alliances.map((seed) => [seed.id, seed]));
  const output: Treaty[] = [];
  const seenIds = new Set<string>();
  const push = (treaty: Treaty) => {
    if (seenIds.has(treaty.id)) return;
    seenIds.add(treaty.id);
    output.push(treaty);
  };

  for (const treaty of st.treaties) {
    // Customs unions are economic markets with a leader, not military pacts.
    if (treaty.type === 'customs_union' || treaty.members.length < 2) {
      push(treaty);
      continue;
    }

    // Preserve member order for directional/bilateral articles such as
    // Guarantee Independence. Only historical source pacts are symmetric.
    const members = aliveMembersInOrder(st, treaty.members);
    if (members.length < 2) continue;
    const sourceIds = (treaty.source ?? '')
      .split(';')
      .map((value) => value.trim())
      .filter(Boolean);

    if (!sourceIds.length) {
      if (members.length > 2) appendBilateralPairs(output, seenIds, treaty, members, null);
      else push({ ...treaty, members });
      continue;
    }

    let sourceWasRebuilt = false;
    for (const sourceId of sourceIds) {
      const seed = seeds.get(sourceId);
      if (!seed) {
        // Unknown source IDs may belong to directional/legacy treaty records.
        // Preserve bilateral ordering; expand only genuinely grouped rows.
        if (members.length > 2) {
          appendBilateralPairs(output, seenIds, treaty, members, sourceId);
        } else {
          push({
            ...treaty,
            id: `legacy:${sourceId}:${members[0]}:${members[1]}`,
            members,
            source: sourceId,
          });
        }
        sourceWasRebuilt = true;
        continue;
      }

      const seedMembers = aliveMembersSorted(st, seed.members);
      const sourcePairMembers = members.length === 2
        ? members.filter((id) => seedMembers.includes(id))
        : seedMembers.filter((id) => members.includes(id));

      if (sourcePairMembers.length >= 2) {
        appendBilateralPairs(output, seenIds, treaty, sourcePairMembers, sourceId, seed);
      } else if (members.length > 2) {
        appendBilateralPairs(output, seenIds, treaty, members, sourceId);
      } else {
        // The current registry cannot explain this old row. Preserve the pair
        // and its original member direction instead of silently dropping it.
        push({
          ...treaty,
          id: `legacy-source:${sourceId}:${members[0]}:${members[1]}`,
          members,
          source: sourceId,
        });
      }
      sourceWasRebuilt = true;
    }
    if (sourceWasRebuilt) continue;

    if (members.length > 2) appendBilateralPairs(output, seenIds, treaty, members, null);
    else push({ ...treaty, members });
  }

  st.treaties = output;
}

/** Backward-compatible name used by earlier callers and save fixtures. */
export const normalizeAllianceTreaties = normalizeHistoricalTreaties;
