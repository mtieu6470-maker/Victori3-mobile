// MEDIA-ILL-01: a captioned illustration for a game subject. Renders nothing until the content pack has an
// image for it, so screens stay correct with or without media installed. Credit and licence are always shown.
import { illustrationFor, useContent, assetUrl } from '../game/content';

export function Illustration({ kind, subject, compact = false }: { kind: 'tech' | 'company' | 'good' | 'building' | 'event' | 'era'; subject: string; compact?: boolean }) {
  useContent();
  const a = illustrationFor(kind, subject);
  if (!a) return null;
  const credit = a.provenance ? `Minh họa gốc của dự án (${a.provenance.method === 'ai_generated' ? 'tạo bằng AI' : a.provenance.method === 'code_generated' ? 'vẽ bằng mã' : 'vẽ tay'})` : [a.author, a.license].filter(Boolean).join(' · ');
  return (
    <figure class={`illu${compact ? ' compact' : ''}`}>
      <img src={assetUrl(a)} alt={a.name} loading="lazy" decoding="async" width={a.w} height={a.h} />
      <figcaption>{a.name}{credit ? <span class="dim"> — {credit}</span> : null}</figcaption>
    </figure>
  );
}
