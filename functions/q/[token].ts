/**
 * GET /q/<token> — Müşteriye gösterilen public teklif onay sayfası (#11 web).
 * Teklif özeti + Onayla / Reddet / Revizyon iste + parmakla imza. Karar zaten
 * verilmişse salt-okunur durum gösterir. Storefront render'a bağımlı değil
 * (kendi içinde minimal HTML) — mevcut dosyalara dokunmaz.
 */
import { htmlResponse } from '../_lib/html-response';
import { getApproval, isExpired, type QuoteApprovalRecord, type QuoteApprovalStatus } from '../_lib/quote-approvals';
import type { D1Like } from '../_lib/buyer';

interface Env { MARKET_DB: D1Like; }
type Ctx = { request: Request; env: Env; params: { token: string } };

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function money(n: number, sym: string): string {
  return `${(Math.round(n * 100) / 100).toFixed(2)} ${esc(sym)}`;
}

const STATUS_LABEL: Record<QuoteApprovalStatus, string> = {
  sent: 'Awaiting your decision',
  approved: 'Approved',
  rejected: 'Rejected',
  revisionRequested: 'Revision requested',
};

function page(rec: QuoteApprovalRecord, token: string, expired: boolean): string {
  const q = rec.quote;
  const decided = rec.status !== 'sent';
  const rows = q.lines.map((l) => `
    <tr>
      <td>${esc(l.title)}</td>
      <td class="num">${esc(l.qty)}${l.unit ? ' ' + esc(l.unit) : ''}</td>
      <td class="num">${money(l.unitPrice, q.currencySymbol)}</td>
      <td class="num">${money(l.lineTotal, q.currencySymbol)}</td>
    </tr>`).join('');

  const docTitle = q.documentType === 'proforma' ? 'Proforma Invoice' : 'Quote';

  // Karar verilmişse / süresi dolmuşsa salt-okunur banner; aksi halde aksiyon UI.
  const actionBlock = (decided || expired) ? `
    <div class="banner ${expired && !decided ? 'expired' : rec.status}">
      ${expired && !decided ? 'This quote link has expired.' : STATUS_LABEL[rec.status]}
      ${rec.signed_at ? `<div class="muted">on ${esc(rec.signed_at.slice(0, 10))}${rec.customer_signed_name ? ' · ' + esc(rec.customer_signed_name) : ''}</div>` : ''}
      ${rec.revision_note ? `<div class="note">“${esc(rec.revision_note)}”</div>` : ''}
    </div>` : `
    <form id="decisionForm">
      <label class="fld">Your name (optional)
        <input type="text" id="name" maxlength="200" autocomplete="name" />
      </label>
      <div class="sig">
        <div class="sig-label">Signature (optional)</div>
        <canvas id="sig" width="600" height="180"></canvas>
        <button type="button" id="clearSig" class="link">Clear</button>
      </div>
      <textarea id="note" placeholder="Add a note or revision request (optional)" maxlength="2000"></textarea>
      <div class="actions">
        <button type="button" class="btn approve" data-action="approve">Approve</button>
        <button type="button" class="btn revision" data-action="revision">Request revision</button>
        <button type="button" class="btn reject" data-action="reject">Reject</button>
      </div>
      <p id="msg" class="msg"></p>
    </form>`;

  const script = (decided || expired) ? '' : `
  <script>
  (function(){
    var c=document.getElementById('sig'),x=c.getContext('2d'),drawing=false,dirty=false;
    x.lineWidth=2.5;x.lineCap='round';x.strokeStyle='#111';
    function pos(e){var r=c.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return {x:(t.clientX-r.left)*(c.width/r.width),y:(t.clientY-r.top)*(c.height/r.height)};}
    function down(e){drawing=true;dirty=true;var p=pos(e);x.beginPath();x.moveTo(p.x,p.y);e.preventDefault();}
    function move(e){if(!drawing)return;var p=pos(e);x.lineTo(p.x,p.y);x.stroke();e.preventDefault();}
    function up(){drawing=false;}
    c.addEventListener('mousedown',down);c.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
    c.addEventListener('touchstart',down,{passive:false});c.addEventListener('touchmove',move,{passive:false});c.addEventListener('touchend',up);
    document.getElementById('clearSig').onclick=function(){x.clearRect(0,0,c.width,c.height);dirty=false;};
    var busy=false;
    document.querySelectorAll('.btn').forEach(function(b){b.onclick=async function(){
      if(busy)return;
      var action=b.getAttribute('data-action');
      if(action==='reject'&&!confirm('Reject this ${esc(docTitle.toLowerCase())}?'))return;
      busy=true;var msg=document.getElementById('msg');msg.textContent='Submitting…';
      var sig=dirty?c.toDataURL('image/png'):undefined;
      try{
        var r=await fetch('/api/quote/${esc(token)}/decision',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:action,name:document.getElementById('name').value,note:document.getElementById('note').value,signature:sig})});
        var j=await r.json();
        if(r.ok){location.reload();}
        else if(r.status===409){msg.textContent='This quote was already '+(j.status||'decided')+'.';}
        else{msg.textContent=j.error||'Something went wrong.';busy=false;}
      }catch(_){msg.textContent='Network error. Please retry.';busy=false;}
    };});
  })();
  </script>`;

  return `<!doctype html><html lang="en"><head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="robots" content="noindex"/>
  <title>${esc(docTitle)} ${esc(q.quoteNumber)}</title>
  <style>
    *{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;background:#f5f5f7;color:#1d1d1f}
    .wrap{max-width:680px;margin:0 auto;padding:24px 16px 64px}
    .card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.06);margin-bottom:16px}
    h1{font-size:20px;margin:0 0 4px}.sub{color:#6e6e73;font-size:14px;margin:0 0 16px}
    table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:8px 6px;border-bottom:1px solid #eee}
    th{color:#6e6e73;font-weight:600;font-size:12px;text-transform:uppercase}.num{text-align:right;font-variant-numeric:tabular-nums}
    .total{display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-top:14px}
    .fld{display:block;font-size:13px;color:#6e6e73;margin:14px 0 4px}.fld input,textarea{width:100%;font-size:16px;padding:10px;border:1px solid #d2d2d7;border-radius:10px;margin-top:4px;font-family:inherit}
    textarea{min-height:64px;margin-top:14px}
    .sig{margin-top:14px}.sig-label{font-size:13px;color:#6e6e73;margin-bottom:4px}
    canvas{width:100%;height:180px;border:1px dashed #c7c7cc;border-radius:10px;background:#fff;touch-action:none}
    .link{background:none;border:none;color:#0071e3;font-size:13px;padding:6px 0;cursor:pointer}
    .actions{display:flex;gap:8px;margin-top:18px;flex-wrap:wrap}
    .btn{flex:1;min-width:120px;padding:13px;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;color:#fff}
    .approve{background:#34c759}.revision{background:#ff9500}.reject{background:#ff3b30}
    .banner{padding:16px;border-radius:12px;font-weight:600;text-align:center}
    .banner.approved{background:#e7f8ec;color:#1c8c3c}.banner.rejected{background:#fdecea;color:#c0271c}
    .banner.revisionRequested{background:#fff4e5;color:#b35a00}.banner.expired{background:#f0f0f2;color:#6e6e73}
    .muted{font-weight:400;font-size:13px;color:#6e6e73;margin-top:4px}.note{font-weight:400;font-style:italic;margin-top:6px}
    .msg{color:#c0271c;font-size:14px;min-height:18px;margin-top:8px}
  </style></head><body><div class="wrap">
    <div class="card">
      <h1>${esc(docTitle)} ${esc(q.quoteNumber)}</h1>
      <p class="sub">${q.sellerName ? esc(q.sellerName) + ' → ' : ''}${esc(q.customerCompany || q.customerContact || '')}</p>
      <table>
        <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Unit</th><th class="num">Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="total"><span>Total</span><span>${money(q.total, q.currencySymbol)}</span></div>
      ${q.validityDays ? `<p class="sub" style="margin-top:12px">Valid for ${esc(q.validityDays)} days${q.deliveryPeriod ? ' · Delivery: ' + esc(q.deliveryPeriod) : ''}</p>` : ''}
    </div>
    <div class="card">${actionBlock}</div>
  </div>${script}</body></html>`;
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.MARKET_DB) return htmlResponse('<p style="padding:2rem;text-align:center">Service unavailable.</p>', 503);
  const rec = await getApproval(ctx.env.MARKET_DB, ctx.params.token);
  if (!rec) return htmlResponse('<p style="padding:2rem;text-align:center">This quote link is invalid or has been removed.</p>', 404);

  const expired = isExpired(rec, new Date().toISOString());
  const html = page(rec, ctx.params.token, expired);
  // Müşteriye özel + karar-durumu → cache'leme.
  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store' },
  });
}
