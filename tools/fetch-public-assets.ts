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
  const response = await fetch(asset.url, {
    headers: { Accept: 'image/gif', 'User-Agent': 'Victori3MobileAssetBuilder/1.0' },
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error('Asset download failed (' + response.status + '): ' + asset.url);
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
