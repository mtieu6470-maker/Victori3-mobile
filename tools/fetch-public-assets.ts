// Fetch and verify public-domain source portraits at build time only.
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ASSETS = [{
  path: 'public/content/portraits/VNM_minh_mang_1828.gif',
  url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Minh_Mang.gif',
  bytes: 1_198_951,
  sha1: '3697504f480e65b64a8fb5dd179e3f22c08f695e',
}] as const;

const digest = (bytes: Uint8Array) => createHash('sha1').update(bytes).digest('hex');
for (const asset of ASSETS) {
  const destination = resolve(asset.path);
  try {
    const cached = await readFile(destination);
    if (cached.byteLength === asset.bytes && digest(cached) === asset.sha1) {
      console.log('Verified cached public-domain asset: ' + asset.path);
      continue;
    }
  } catch { /* fetch the pinned asset below */ }

  console.log('Downloading pinned public-domain asset: ' + asset.url);
  let response: Response | undefined;
  for (let attempt = 0; attempt < 4; attempt++) {
    response = await fetch(asset.url, {
      headers: {
        Accept: 'image/gif',
        'User-Agent': 'Victori3MobileAssetBuilder/1.0 (https://github.com/mtieu6470-maker/Victori3-mobile)',
      },
      signal: AbortSignal.timeout(45_000),
    });
    if (response.ok) break;
    if (response.status !== 429 && response.status !== 503) {
      throw new Error('Asset download failed (' + response.status + '): ' + asset.url);
    }
    if (attempt === 3) break;
    const retryAfter = Number(response.headers.get('retry-after'));
    const delayMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, 60_000)
      : 5_000 * (attempt + 1);
    console.warn('Wikimedia rate limit (' + response.status + '); waiting ' + delayMs + 'ms before retry ' + (attempt + 2) + '/4');
    await new Promise((resolveWait) => setTimeout(resolveWait, delayMs));
  }
  if (!response?.ok) {
    throw new Error('Asset download failed after rate-limit retries (' + response?.status + '): ' + asset.url);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  const sha1 = digest(bytes);
  if (bytes.byteLength !== asset.bytes || sha1 !== asset.sha1) {
    throw new Error('Asset integrity mismatch for ' + asset.path + ': bytes=' + bytes.byteLength + ', sha1=' + sha1);
  }
  await mkdir(dirname(destination), { recursive: true });
  const temporary = destination + '.verified.tmp';
  await writeFile(temporary, bytes, { flag: 'w' });
  await rename(temporary, destination);
  console.log('Installed ' + asset.path + ' (' + bytes.byteLength + ' bytes; SHA-1 ' + sha1 + ')');
}
