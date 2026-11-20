import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { joinCustomsUnion } from '../src/engine/systems/diplomacy';
import { killCountry } from '../src/engine/world';

function activeCountries(state: ReturnType<typeof fresh>) {
  return Object.values(state.countries).filter((country) => country.alive);
}

describe('customs-union membership lifecycle', () => {
  it('transfers a country out of its old union and repairs the old leader', () => {
    const state = fresh('historical', 171, 'GBR');
    const [joining, oldSuccessor, newLeader] = activeCountries(state);
    const oldUnionId = 'test-old-customs-union';
    const newUnionId = 'test-new-customs-union';

    state.treaties.push(
      {
        id: oldUnionId,
        type: 'customs_union',
        members: [joining.id, oldSuccessor.id],
        leader: joining.id,
        start: state.tick,
      },
      {
        id: newUnionId,
        type: 'customs_union',
        members: [newLeader.id],
        leader: newLeader.id,
        start: state.tick,
      },
    );
    joining.customsUnion = oldUnionId;
    oldSuccessor.customsUnion = oldUnionId;
    newLeader.customsUnion = newUnionId;

    expect(joinCustomsUnion(state, joining, newUnionId)).toBe(true);

    const oldUnion = state.treaties.find((treaty) => treaty.id === oldUnionId)!;
    const newUnion = state.treaties.find((treaty) => treaty.id === newUnionId)!;
    expect(oldUnion.members).toEqual([oldSuccessor.id]);
    expect(oldUnion.leader).toBe(oldSuccessor.id);
    expect(newUnion.members).toEqual([newLeader.id, joining.id]);
    expect(newUnion.leader).toBe(newLeader.id);
    expect(joining.customsUnion).toBe(newUnionId);
    expect(state.treaties.filter(
      (treaty) => treaty.type === 'customs_union' && treaty.members.includes(joining.id),
    )).toHaveLength(1);
  });

  it('removes a dissolved country and transfers customs-union leadership to a living member', () => {
    const state = fresh('historical', 172, 'GBR');
    const [formerLeader, successor, otherMember] = activeCountries(state);
    const unionId = 'test-customs-union-leader-removal';
    state.treaties.push({
      id: unionId,
      type: 'customs_union',
      members: [formerLeader.id, successor.id, otherMember.id],
      leader: formerLeader.id,
      start: state.tick,
    });
    formerLeader.customsUnion = unionId;
    successor.customsUnion = unionId;
    otherMember.customsUnion = unionId;

    killCountry(state, formerLeader.id, 'test dissolution');

    const union = state.treaties.find((treaty) => treaty.id === unionId)!;
    expect(formerLeader.alive).toBe(false);
    expect(formerLeader.customsUnion).toBeNull();
    expect(union.members).toEqual([successor.id, otherMember.id]);
    expect(union.leader).toBe(successor.id);
    expect(successor.customsUnion).toBe(unionId);
    expect(otherMember.customsUnion).toBe(unionId);
  });

  it('removes an empty customs union when its final member is dissolved', () => {
    const state = fresh('historical', 173, 'GBR');
    const [lastMember] = activeCountries(state);
    const unionId = 'test-customs-union-final-member';
    state.treaties.push({
      id: unionId,
      type: 'customs_union',
      members: [lastMember.id],
      leader: lastMember.id,
      start: state.tick,
    });
    lastMember.customsUnion = unionId;

    killCountry(state, lastMember.id, 'test dissolution');

    expect(lastMember.customsUnion).toBeNull();
    expect(state.treaties.some((treaty) => treaty.id === unionId)).toBe(false);
  });

  it('rejects nonexistent unions and inactive countries without changing membership', () => {
    const state = fresh('historical', 174, 'GBR');
    const [joining, leader] = activeCountries(state);
    const unionId = 'test-customs-union-valid';
    state.treaties.push({
      id: unionId,
      type: 'customs_union',
      members: [leader.id],
      leader: leader.id,
      start: state.tick,
    });

    expect(joinCustomsUnion(state, joining, 'missing-union')).toBe(false);
    joining.alive = false;
    expect(joinCustomsUnion(state, joining, unionId)).toBe(false);
    expect(joining.customsUnion).toBeNull();
    expect(state.treaties.find((treaty) => treaty.id === unionId)?.members).toEqual([leader.id]);
  });
});
