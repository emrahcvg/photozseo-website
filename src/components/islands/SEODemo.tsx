import { useEffect, useRef, useState } from 'react';

const FIELD_IDS = ['title', 'slug', 'filename', 'category', 'meta', 'description', 'alt', 'tag1', 'tag2', 'tag3', 'tag4', 'keywords', 'barcode'] as const;
type FieldId = typeof FIELD_IDS[number];

// Soft limit per field (chars). 0 = no counter shown.
const FIELD_LIMITS: Partial<Record<FieldId, number>> = {
  title: 70,
  meta: 160,
  description: 320,
  alt: 125,
};

interface Preset {
  product: string;
  fields: Record<FieldId, string>;
}

const PRESETS: Preset[] = [
  {
    product: 'Genuine Leather Crossbody Bag',
    fields: {
      title: 'Genuine Leather Crossbody Bag — Handcrafted in Italy',
      slug: 'genuine-leather-crossbody-bag',
      filename: 'genuine-leather-crossbody-bag-amazon.webp',
      category: 'Bags & Purses › Crossbody Bags',
      meta: 'Handcrafted Italian leather crossbody bag. Adjustable strap, 4 interior pockets. Free worldwide shipping.',
      description: 'Hand-cut full-grain Italian leather, stitched in Florence. Adjustable 120 cm strap, 4 interior pockets including one zipped. Brass hardware, soft suede lining. Fits a 7-inch tablet. Each bag develops a unique patina over time.',
      alt: 'Brown genuine leather crossbody bag with adjustable strap, photographed on white background',
      tag1: 'leather bag',
      tag2: 'crossbody',
      tag3: 'italian leather',
      tag4: 'handmade',
      keywords: 'leather crossbody bag, italian leather purse, handmade leather bag, gift for her',
      barcode: '8 690000 123456',
    },
  },
  {
    product: 'Organic Lavender Soy Candle',
    fields: {
      title: 'Organic Lavender Soy Candle — 40h Burn · Hand-Poured',
      slug: 'organic-lavender-soy-candle',
      filename: 'organic-lavender-soy-candle-etsy.webp',
      category: 'Home & Living › Candles',
      meta: 'Hand-poured soy candle infused with pure lavender essential oil. 40-hour burn time. Vegan, eco-friendly.',
      description: '100% organic soy wax hand-poured in small batches. Infused with pure French lavender essential oil for a calming, sleep-supporting aroma. 220 g, 40-hour clean burn, cotton wick. Reusable amber glass jar. Vegan, cruelty-free, no parabens.',
      alt: 'Hand-poured organic lavender soy candle in amber glass jar with cotton wick',
      tag1: 'soy candle',
      tag2: 'lavender',
      tag3: 'organic',
      tag4: 'aromatherapy',
      keywords: 'organic soy candle, lavender aromatherapy candle, hand-poured candle, vegan candle gift',
      barcode: '8 690000 234567',
    },
  },
  {
    product: 'Vintage Brass Pocket Watch',
    fields: {
      title: 'Vintage Brass Pocket Watch — Engraved · Gift Box Included',
      slug: 'vintage-brass-pocket-watch',
      filename: 'vintage-brass-pocket-watch-shopify.webp',
      category: 'Jewelry & Watches › Pocket Watches',
      meta: 'Mechanical brass pocket watch with engraved case. 18-jewel movement. Comes in a wooden gift box.',
      description: 'Solid brass case with hand-engraved scrollwork. 18-jewel mechanical movement, no battery required. Roman numeral dial, hinged glass cover, 35 cm chain. Free personalized engraving on the back. Packaged in a wooden gift box ready for groomsmen, fathers, and graduates.',
      alt: 'Vintage style brass pocket watch with engraved case, open showing roman numeral dial',
      tag1: 'pocket watch',
      tag2: 'vintage',
      tag3: 'brass',
      tag4: 'mechanical',
      keywords: 'vintage pocket watch, brass mechanical watch, groomsmen gift, engraved pocket watch',
      barcode: '8 690000 345678',
    },
  },
];

interface SEODemoContent {
  kicker: string;
  title: string;
  sub: string;
  inputLabel: string;
  inputPlaceholder: string;
  btnIdle: string;
  btnBusy: string;
  note: string;
  copyHint?: string;
  copiedToast?: string;
  fieldLabels: Record<FieldId, string>;
}

interface SEODemoProps { content?: SEODemoContent }

const DEFAULT_CONTENT: SEODemoContent = {
  kicker: 'Interactive · Live',
  title: 'Watch the AI fill 13 SEO fields.',
  sub: 'Pick a product. Watch photoZseo write every field your marketplace needs — title, slug, filename, category, meta, full description, alt text, tags, keywords and barcode. Tap any field to copy.',
  inputLabel: 'Product name',
  inputPlaceholder: 'Type a product name…',
  btnIdle: '✨ Auto-fill 13 SEO fields',
  btnBusy: 'Generating…',
  note: 'On-device · 100% private · 12 languages',
  copyHint: 'Click to copy',
  copiedToast: 'Copied',
  fieldLabels: {
    title: 'SEO Title', slug: 'Slug', filename: 'Filename (URL)',
    category: 'Category', meta: 'Meta Desc',
    description: 'Description', alt: 'Alt Text',
    tag1: 'Tag 1', tag2: 'Tag 2', tag3: 'Tag 3', tag4: 'Tag 4',
    keywords: 'Keywords', barcode: 'Barcode',
  },
};

export default function SEODemo({ content = DEFAULT_CONTENT }: SEODemoProps) {
  const c = content;
  const [activePreset, setActivePreset] = useState(0);
  const [productInput, setProductInput] = useState(PRESETS[0].product);
  const [filled, setFilled] = useState<Partial<Record<FieldId, string>>>({});
  const [generating, setGenerating] = useState(false);
  const cancelRef = useRef<{ cancel: boolean }>({ cancel: false });

  const generate = async (preset: number) => {
    cancelRef.current.cancel = true;
    const myToken = { cancel: false };
    cancelRef.current = myToken;
    setFilled({});
    setGenerating(true);

    await new Promise((r) => setTimeout(r, 600));
    if (myToken.cancel) return;

    const fields = PRESETS[preset].fields;
    for (const id of FIELD_IDS) {
      const value = fields[id];
      for (let i = 1; i <= value.length; i++) {
        if (myToken.cancel) return;
        setFilled((prev) => ({ ...prev, [id]: value.slice(0, i) }));
        await new Promise((r) => setTimeout(r, 6));
      }
      await new Promise((r) => setTimeout(r, 80));
    }
    setGenerating(false);
  };

  useEffect(() => {
    const el = document.getElementById('seo-demo-trigger');
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && Object.keys(filled).length === 0 && !generating) {
            generate(0);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickPreset = (i: number) => {
    setActivePreset(i);
    setProductInput(PRESETS[i].product);
    generate(i);
  };

  const [copiedId, setCopiedId] = useState<FieldId | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const handleCopy = async (id: FieldId, value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopiedId(null), 1400);
  };

  return (
    <div id="seo-demo-trigger" className="seodemo">
      <div className="seodemo-head">
        <span className="kicker">{c.kicker}</span>
        <h2>{c.title}</h2>
        <p>{c.sub}</p>
      </div>

      <div className="seodemo-presets" role="tablist" aria-label="Product examples">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activePreset === i}
            className={`seodemo-preset ${activePreset === i ? 'active' : ''}`}
            onClick={() => pickPreset(i)}
          >
            {p.product}
          </button>
        ))}
      </div>

      <div className="seodemo-grid">
        <div className="seodemo-input">
          <label>
            <span>{c.inputLabel}</span>
            <input
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              placeholder={c.inputPlaceholder}
              aria-label={c.inputLabel}
            />
          </label>
          <button
            className="seodemo-go"
            onClick={() => generate(activePreset)}
            disabled={generating}
          >
            {generating ? (
              <><span className="spinner"/> {c.btnBusy}</>
            ) : (
              <>{c.btnIdle}</>
            )}
          </button>
          <div className="seodemo-note">
            <span className="ok-dot"/> {c.note}
          </div>
        </div>

        <div className="seodemo-fields">
          {FIELD_IDS.map((id) => {
            const target = PRESETS[activePreset].fields[id];
            const current = filled[id] ?? '';
            const isTyping = generating && current && current.length < target.length;
            const isDone = current === target;
            const limit = FIELD_LIMITS[id];
            const len = current.length;
            const overLimit = limit ? len > limit : false;
            const isCopied = copiedId === id;
            const canCopy = isDone && !!current;
            return (
              <button
                key={id}
                type="button"
                className={`seo-field ${isDone ? 'done' : ''} ${isTyping ? 'typing' : ''} ${isCopied ? 'copied' : ''}`}
                onClick={() => handleCopy(id, current)}
                disabled={!canCopy}
                aria-label={`${c.fieldLabels[id]}${canCopy ? ` — ${c.copyHint ?? 'Click to copy'}` : ''}`}
              >
                <div className="seo-field-label">
                  <span>{c.fieldLabels[id]}</span>
                  {limit && isDone && (
                    <span className={`seo-field-count ${overLimit ? 'over' : ''}`}>{len}/{limit}</span>
                  )}
                </div>
                <div className="seo-field-value">
                  <span className="seo-field-reserve" aria-hidden="true">{target}</span>
                  <span className="seo-field-current">
                    {current || <span className="placeholder">—</span>}
                    {isTyping && <span className="caret"/>}
                  </span>
                </div>
                {canCopy && (
                  <span className="seo-field-copy" aria-hidden="true">
                    {isCopied ? (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {c.copiedToast ?? 'Copied'}
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        {c.copyHint ?? 'Copy'}
                      </>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .seodemo { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }
        .seodemo-head { text-align: center; margin-bottom: 32px; }
        .seodemo-head h2 { font-size: clamp(28px, 4.5vw, 44px); letter-spacing: -0.02em; line-height: 1.1; margin: 14px 0 10px; }
        .seodemo-head p { color: var(--text-muted); font-size: 17px; max-width: 560px; margin: 0 auto; }
        .seodemo-presets { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; }
        .seodemo-preset {
          padding: 10px 16px; border-radius: 999px; cursor: pointer;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10);
          color: var(--text-muted); font-size: 13px; font-weight: 500;
          transition: all .15s ease;
        }
        .seodemo-preset:hover { color: var(--text); border-color: rgba(255,255,255,0.20); }
        .seodemo-preset.active { background: rgba(79,209,197,0.14); border-color: rgba(79,209,197,0.40); color: var(--accent); }

        .seodemo-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 28px; }
        .seodemo-input {
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.08); border-radius: 20px;
          padding: 28px; display: flex; flex-direction: column; gap: 18px;
          backdrop-filter: blur(12px); height: fit-content;
        }
        .seodemo-input label { display: flex; flex-direction: column; gap: 8px; }
        .seodemo-input label span { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .seodemo-input input {
          padding: 14px 16px; border-radius: 12px;
          background: rgba(0,0,0,0.35); color: var(--text);
          border: 1px solid rgba(255,255,255,0.12);
          font-size: 16px; font-family: inherit;
          transition: border-color .15s ease;
        }
        .seodemo-input input:focus { outline: none; border-color: var(--accent); }
        .seodemo-go {
          padding: 14px 16px; border-radius: 12px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #0B0E1A; font-weight: 600; font-size: 15px; border: 0; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform .15s ease, opacity .15s ease;
        }
        .seodemo-go:hover:not(:disabled) { transform: translateY(-2px); }
        .seodemo-go:disabled { cursor: wait; opacity: 0.7; }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(11,14,26,0.3); border-top-color: #0B0E1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .seodemo-note { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-dim); }
        .ok-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981; }

        .seodemo-fields { display: grid; gap: 8px; }
        .seo-field {
          appearance: none;
          font-family: inherit; font-size: inherit; text-align: left;
          padding: 12px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          display: grid; grid-template-columns: 130px 1fr auto; gap: 14px; align-items: center;
          color: inherit; cursor: pointer; width: 100%; position: relative;
          transition: border-color .2s ease, background .2s ease, transform .15s ease;
        }
        .seo-field:disabled { cursor: default; }
        .seo-field:not(:disabled):hover {
          background: rgba(79,209,197,0.06);
          border-color: rgba(79,209,197,0.32);
        }
        .seo-field:not(:disabled):active { transform: scale(0.995); }
        .seo-field:focus-visible {
          outline: 2px solid var(--accent); outline-offset: 2px;
        }
        .seo-field.typing { border-color: rgba(79,209,197,0.40); background: rgba(79,209,197,0.04); }
        .seo-field.done { border-color: rgba(16,185,129,0.28); }
        .seo-field.copied { border-color: rgba(16,185,129,0.60); background: rgba(16,185,129,0.08); }

        .seo-field-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--text-dim);
          display: flex; flex-direction: column; gap: 4px; align-items: flex-start;
        }
        .seo-field-count {
          font-size: 10px; font-weight: 600; letter-spacing: 0;
          font-family: 'SF Mono', ui-monospace, Menlo, monospace;
          color: var(--text-dim); text-transform: none;
          padding: 1px 6px; border-radius: 4px;
          background: rgba(255,255,255,0.04);
        }
        .seo-field-count.over { color: #fb7185; background: rgba(251,113,133,0.10); }

        .seo-field-value {
          font-family: 'SF Mono', ui-monospace, Menlo, monospace;
          font-size: 13.5px; line-height: 1.5; word-break: break-word;
          display: grid; min-height: 1em;
        }
        .seo-field-value > * { grid-area: 1 / 1; }
        .seo-field-reserve {
          visibility: hidden;
          user-select: none;
          white-space: pre-wrap;
          pointer-events: none;
        }
        .seo-field-current { color: var(--text); white-space: pre-wrap; }
        .seo-field-value .placeholder { color: var(--text-dim); }
        .seo-field-value .caret {
          display: inline-block; width: 2px; height: 16px; vertical-align: text-bottom;
          background: var(--accent); margin-left: 2px; animation: blink 1s steps(2) infinite;
        }
        @keyframes blink { 0%,50% { opacity: 1; } 50.01%,100% { opacity: 0; } }

        .seo-field-copy {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
          color: var(--text-dim); opacity: 0;
          transition: opacity .15s ease, color .15s ease;
          padding: 4px 8px; border-radius: 6px;
          background: rgba(255,255,255,0.04);
          white-space: nowrap;
        }
        .seo-field:hover .seo-field-copy,
        .seo-field:focus-visible .seo-field-copy { opacity: 1; color: var(--accent); }
        .seo-field.copied .seo-field-copy { opacity: 1; color: #10B981; background: rgba(16,185,129,0.12); }

        @media (max-width: 800px) {
          .seodemo-grid { grid-template-columns: 1fr; }
          .seodemo-input { position: static; }
          .seo-field {
            grid-template-columns: 1fr auto; gap: 8px;
            grid-template-areas: "label copy" "value value";
          }
          .seo-field-label { grid-area: label; flex-direction: row; align-items: center; gap: 10px; }
          .seo-field-value { grid-area: value; }
          .seo-field-copy { grid-area: copy; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
