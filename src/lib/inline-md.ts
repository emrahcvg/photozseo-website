const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** **kalın**, [metin](url) ve `kod` destekleyen güvenli satır içi biçimleyici. */
export function inlineMd(src: string): string {
  let out = esc(src);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, url) => {
    const external = /^https?:\/\//.test(url) && !url.startsWith('https://photozseo.com');
    const rel = external ? ' rel="noopener" target="_blank"' : '';
    return `<a href="${url}"${rel}>${text}</a>`;
  });
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}

/** Düz metin (JSON-LD için): biçim işaretlerini kaldırır. */
export function plainMd(src: string): string {
  return src.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
}
