import type { CapacitorConfig } from '@capacitor/cli';

// Android packaging of the offline web build (dist/). No network access is required at runtime.
const config: CapacitorConfig = {
  appId: 'vn.dongchaylichsu.game',
  appName: 'Dòng chảy Lịch sử',
  webDir: 'dist',
  backgroundColor: '#0b1215',
  android: { allowMixedContent: false },
};
export default config;
