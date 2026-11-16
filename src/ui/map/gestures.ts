/** Touch/pen long-press classification shared by the map interaction layer and tests. */
export const LONG_PRESS_MS = 520;
export const LONG_PRESS_SLOP_PX = 8;

export interface PressStart {
  downAt: number;
  sx: number;
  sy: number;
  pointerType: string;
}

/** A stationary touch/pen hold; mouse interactions remain tap/double-click only. */
export function isLongPress(
  press: PressStart,
  releasedAt: number,
  x: number,
  y: number,
): boolean {
  if (press.pointerType === 'mouse' || releasedAt - press.downAt < LONG_PRESS_MS) return false;
  return Math.hypot(x - press.sx, y - press.sy) <= LONG_PRESS_SLOP_PX;
}
