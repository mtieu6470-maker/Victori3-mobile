import { describe, expect, it } from 'vitest';
import { characterHoldsRoleOnDate, historicalDateBoundary, type ContentCharacter } from '../src/ui/game/content';

const person = (from: string, to: string | null, role = 'head_of_state'): Pick<ContentCharacter, 'terms'> => ({
  terms: [{ role, from, to, source: 'test fixture' }],
});

describe('date-bounded historical ruler terms', () => {
  it('keeps Minh Mạng in office in November 1838 and excludes later emperors', () => {
    const minhMang = person('1820-02-14', '1841-01-20');
    const thieuTri = person('1841-02-11', '1847-11-04');
    const tuDuc = person('1847-11-10', '1883-07-19');
    expect(characterHoldsRoleOnDate(minhMang, '1838-11-20')).toBe(true);
    expect(characterHoldsRoleOnDate(thieuTri, '1838-11-20')).toBe(false);
    expect(characterHoldsRoleOnDate(tuDuc, '1838-11-20')).toBe(false);
    expect(characterHoldsRoleOnDate(thieuTri, '1841-02-11')).toBe(true);
    expect(characterHoldsRoleOnDate(tuDuc, '1847-11-09')).toBe(false);
    expect(characterHoldsRoleOnDate(tuDuc, '1847-11-10')).toBe(true);
  });
  it('treats sourced office-term endpoints as inclusive', () => {
    const minhMang = person('1820-02-14', '1841-01-20');
    expect(characterHoldsRoleOnDate(minhMang, '1820-02-14')).toBe(true);
    expect(characterHoldsRoleOnDate(minhMang, '1841-01-20')).toBe(true);
    expect(characterHoldsRoleOnDate(minhMang, '1820-02-13')).toBe(false);
    expect(characterHoldsRoleOnDate(minhMang, '1841-01-21')).toBe(false);
  });
  it('uses full inclusive bounds for year-only and month-only source dates', () => {
    expect(characterHoldsRoleOnDate(person('1838', '1840'), '1838-11-20')).toBe(true);
    expect(characterHoldsRoleOnDate(person('1838-05', '1838-09'), '1838-05-01')).toBe(true);
    expect(characterHoldsRoleOnDate(person('1838-05', '1838-09'), '1838-09-30')).toBe(true);
    expect(characterHoldsRoleOnDate(person('1838-05', '1838-09'), '1838-10-01')).toBe(false);
  });
  it('rejects malformed dates, impossible leap days and unrelated roles', () => {
    expect(characterHoldsRoleOnDate(person('bad-date', null), '1841-02-01')).toBe(false);
    expect(characterHoldsRoleOnDate(person('1841-02-30', null), '1841-03-01')).toBe(false);
    expect(characterHoldsRoleOnDate(person('1841-02-11', null, 'head_of_government'), '1841-02-12')).toBe(false);
    expect(characterHoldsRoleOnDate(person('1820-02-14', null), 'not-a-date')).toBe(false);
  });
  it('validates Gregorian leap-day boundaries', () => {
    expect(historicalDateBoundary('1840-02', 'end')).toBe('1840-02-29');
    expect(historicalDateBoundary('1900-02', 'end')).toBe('1900-02-28');
    expect(historicalDateBoundary('2000-02', 'end')).toBe('2000-02-29');
    expect(historicalDateBoundary('1838', 'start')).toBe('1838-01-01');
    expect(historicalDateBoundary('1838', 'end')).toBe('1838-12-31');
    expect(historicalDateBoundary('1838-13', 'end')).toBeNull();
  });
});
