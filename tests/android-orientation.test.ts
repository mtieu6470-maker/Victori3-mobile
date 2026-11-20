import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Android game orientation', () => {
  const manifest = readFileSync(
    new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url),
    'utf8',
  );

  it('locks the launcher activity to landscape for the primary game experience', () => {
    const mainActivity = manifest.match(
      /<activity\\b(?=[^>]*android:name=["']\\.MainActivity["'])[^>]*>[\\s\\S]*?<\\/activity>/,
    );

    expect(mainActivity).not.toBeNull();
    expect(mainActivity?.[0]).toMatch(/android:screenOrientation=["']landscape["']/);
    expect(mainActivity?.[0]).toMatch(/android.intent.action.MAIN/);
    expect(mainActivity?.[0]).toMatch(/android.intent.category.LAUNCHER/);
  });
});
