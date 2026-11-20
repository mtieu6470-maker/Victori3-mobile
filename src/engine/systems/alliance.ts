import type { GameState, Treaty } from '../types';

/**
 * The historical source stores some alliance pacts as multi-country groups,
 * while the live game contract is bilateral. Expand each group to unique country
 * pairs so alliance capacity, withdrawal and calls-to-arms operate per partner.
 *
 * This operation is idempotent and also migrates old saves that still contain
 * a treaty with more than two members. Source IDs are retained for provenance.
 */
export function normalizeAllianceTreaties(st: GameState): void {
  const nonAlliance: Treaty[] = [];
  const pairs = new Map<string, Treaty>();

  for (const treaty of st.treaties) {
    if (treaty.type !== 'alliance') {
      nonAlliance.push(treaty);
      continue;
    }

    const members = [...new Set(
      treaty.members.filter((id) => st.countries[id]?.alive),
    )].sort();

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const left = members[i];
        const right = members[j];
        const key = `${left}\u0000${right}`;
        const sourceId = treaty.source ?? treaty.id;
        const existing = pairs.get(key);

        if (existing) {
          const sourceIds = new Set((existing.source ?? '').split(';').filter(Boolean));
          sourceIds.add(sourceId);
          existing.source = [...sourceIds].join(';');
          existing.start = Math.min(existing.start, treaty.start);
          continue;
        }

        pairs.set(key, {
          id: `alliance:${left}:${right}`,
          type: 'alliance',
          members: [left, right],
          start: treaty.start,
          source: sourceId,
        });
      }
    }
  }

  st.treaties = [...nonAlliance, ...pairs.values()];
}
