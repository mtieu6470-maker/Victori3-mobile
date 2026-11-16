// Identity views built on the content pack: period-correct flag / arms, portraits with credits, sourced texts.
// Every element degrades to the generated emblem / monogram when the pack is not loaded or has no item.
import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { asset, bestText, useContent, type ContentAsset, type ContentText } from '../game/content';
import { details, Tip } from './ui';

const LIC_VI = (l: string) => (/public domain|^pd/i.test(l) ? 'Phạm vi công cộng' : l);

/** Credit block for one image (author, licence, source file). */
export function AssetCredit({ a }: { a: ContentAsset }) {
  return (
    <div class="credit">
      <div><b>{a.name}</b></div>
      {a.author && <div>Tác giả: {a.author}</div>}
      {a.date && <div>Niên đại: {a.date}</div>}
      <div>Giấy phép: {a.license_url ? <a href={a.license_url} target="_blank" rel="noopener">{LIC_VI(a.license)}</a> : LIC_VI(a.license)}</div>
      <div>Nguồn: <a href={a.source} target="_blank" rel="noopener">Wikimedia Commons — {a.file}</a></div>
      <div class="dim">Liên kết dữ liệu: {a.statement.replace('wikidata:', 'Wikidata ')}{a.period.from || a.period.to ? ` · áp dụng ${a.period.from ?? '…'}–${a.period.to ?? '…'}` : ''}{a.quality === 'uncertain' ? ' · thời kỳ suy ra từ tuổi thọ chính thể' : ''}</div>
    </div>
  );
}

/** An image from the pack with a tap/hover credit; renders `fallback` when missing or broken. */
export function AssetImg({ id, cls, fallback, alt }: { id: string | null | undefined; cls: string; fallback?: ComponentChildren; alt?: string }) {
  useContent();
  const [broken, setBroken] = useState(false);
  const a = asset(id);
  if (!a || broken) return <>{fallback ?? null}</>;
  return (
    <Tip c={{ title: a.name, lines: [[a.author ? 'Tác giả' : 'Nguồn', a.author ?? 'Wikimedia Commons'], ['Giấy phép', LIC_VI(a.license)]], note: 'Chạm giữ hoặc mở "Nguồn ảnh" để xem đầy đủ.' }}>
      <img class={cls} src={a.path} width={a.w} height={a.h} alt={alt ?? a.name} loading="lazy" decoding="async" onError={() => setBroken(true)} />
    </Tip>
  );
}

/** Wikipedia lead with attribution; collapsed to a few lines with a toggle. */
export function SourcedText({ texts, lines = 6 }: { texts: ContentText[] | undefined; lines?: number }) {
  const [open, setOpen] = useState(false);
  const t = bestText(texts);
  if (!t) return null;
  const other = texts!.find((x) => x !== t);
  return (
    <div class="srctext">
      <p class={open ? '' : 'clamp'} style={open ? '' : `-webkit-line-clamp:${lines}`} lang={t.lang}>{t.text}</p>
      <div class="srcline">
        <button class="linkbtn" onClick={() => setOpen(!open)}>{open ? 'Thu gọn' : 'Đọc thêm'}</button>
        <span class="dim">
          {t.lang === 'en' ? 'Tiếng Anh · ' : ''}Trích phần mở đầu <a href={t.url} target="_blank" rel="noopener">Wikipedia {t.lang === 'vi' ? 'tiếng Việt' : 'tiếng Anh'} — {t.article}</a>{t.truncated ? ' (rút gọn)' : ''}, bản sửa {t.revid}, {t.license}.
          {other && <> Có cả <a href={other.url} target="_blank" rel="noopener">bản {other.lang === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}</a>.</>}
        </span>
      </div>
    </div>
  );
}

/** Opens a detail panel with the credit of an asset. */
export function openCredit(a: ContentAsset) { details.open({ key: 'credit:' + a.id, title: 'Nguồn ảnh', ctx: a.name, body: () => <AssetCredit a={a} /> }); }
