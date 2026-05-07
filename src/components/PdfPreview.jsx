import React, { useMemo } from 'react';
import { T, OPENING_LABEL } from '../translations';
import { fmt, getElementName } from '../utils/format';
import { getPanelShutters, getPanelCount } from '../elementTypes';
import WindowDrawing from './WindowDrawing';

export default function PdfPreview({ doc, lang, currency, showPrices }) {
  const t = T[lang];
  const opLabel = OPENING_LABEL[lang];

  const totalNet = useMemo(
    () => doc.positions.reduce((s, p) => s + (p.unitPrice || 0) * (p.quantity || 1), 0),
    [doc.positions]
  );
  const explicitNet = doc.netOverride && doc.netOverride > 0 ? doc.netOverride : null;
  const finalNet = explicitNet || totalNet;
  const vatRate = doc.vatRate ?? 17;
  const vatEnabled = doc.vatEnabled ?? true;
  const vat = vatEnabled ? finalNet * vatRate / 100 : 0;
  const gross = finalNet + vat;

  return (
    <div id="pdf-area" style={{ fontFamily: 'Geist, system-ui, sans-serif', color: '#1a1a1a', background: 'white' }} className="text-[11px] leading-relaxed">
      {/* HEADER STRANICA 1 */}
      <div className="px-12 pt-12 pb-8 print-page">
        <div className="flex justify-between items-start mb-8">
          <div>
            <img src="/neoprom-logo.svg" alt="Neoprom Engineering" style={{ height: '100px', display: 'block' }} />
          </div>
          <div className="text-right text-[10px] leading-snug">
            <div className="font-semibold text-[12px] mb-1">Neoprom Engineering Bugojno</div>
            <div className="text-stone-600">70230 Bugojno ul. Gaj 6/13</div>
            <div className="mt-2 space-y-0.5" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: '9px' }}>
              <div><span className="text-stone-500">Mob:</span> +38761154406</div>
              <div><span className="text-stone-500">E-Mail:</span> neopromengineering@gmail.com</div>
              <div><span className="text-stone-500">Tel/Fax:</span> 030254442</div>
              <div><span className="text-stone-500">IBAN:</span> BA391414355310018180</div>
              <div><span className="text-stone-500">ID:</span> 4338101210001</div>
            </div>
          </div>
        </div>

        {/* CUSTOMER + NUMBER */}
        <div className="flex justify-between items-end mb-8 pb-4 border-b-2" style={{ borderColor: '#1a1a1a' }}>
          <div className="border p-3 max-w-[260px] flex-1" style={{ borderColor: '#d4d4cf' }}>
            <div className="text-[9px] uppercase tracking-wider text-stone-500 mb-1">{t.customer}</div>
            <div className="font-medium">{doc.customer.name || '—'}</div>
            <div className="text-[10px] text-stone-600 whitespace-pre-line">{doc.customer.address}</div>
          </div>
          <div className="text-right ml-6">
            <div className="text-[9px] uppercase tracking-wider text-stone-500">{t.quoteNumber}</div>
            <div className="text-2xl font-medium" style={{ fontFamily: 'Instrument Serif, serif' }}>{doc.number}</div>
            <div className="text-[10px] text-stone-600 mt-1" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>{doc.date}</div>
          </div>
        </div>

        {/* INTRO TEKST */}
        <div className="whitespace-pre-line text-[10.5px] leading-relaxed text-stone-700 mb-6">
          {t.intro}
        </div>

        <div className="text-[10.5px]">
          <div>{t.regards}</div>
          <div className="font-medium italic mt-1">Esad Sadiković</div>
        </div>
      </div>

      {/* POZICIJE */}
      <div className="px-12 py-8 print-page">
        <div className="flex gap-4 mb-4 pb-2 border-b-2 text-[9px] uppercase tracking-wider text-stone-500" style={{ borderColor: '#1a1a1a' }}>
          <div className="w-12 shrink-0">{t.pos}</div>
          <div className="w-56 shrink-0"></div>
          <div className="flex-1 min-w-0">{t.desc}</div>
          <div className="w-12 shrink-0 text-center">{t.qty}</div>
          {showPrices && <div className="w-20 shrink-0 text-right">{t.uPrice}</div>}
          {showPrices && <div className="w-24 shrink-0 text-right">{t.lTotal}</div>}
        </div>

        {doc.positions.map((p, i) => (
          <div key={p.id} className="flex gap-4 py-4 border-b avoid-break" style={{ borderColor: '#e5e5e0' }}>
            <div className="w-12 shrink-0">
              <div className="text-2xl font-medium" style={{ fontFamily: 'Instrument Serif, serif' }}>{i + 1}</div>
            </div>
            <div className="w-56 shrink-0">
              <div className="aspect-square">
                <WindowDrawing pos={p} size={220} />
              </div>
            </div>
            <div className="flex-1 min-w-0 text-[10px] leading-relaxed">
              <div><span className="font-semibold">{t.system}:</span> {p.systemName}</div>
              <div><span className="font-semibold">{t.element}:</span> {getElementName(p.type, lang)}</div>
              <div><span className="font-semibold">{t.dims}:</span> {t.width} {p.width} mm × {t.height} {p.height} mm</div>
              <div><span className="font-semibold">{t.fitting}:</span> {p.fitting}</div>
              <div><span className="font-semibold">{t.color}:</span> {p.color}</div>
              <div><span className="font-semibold">{t.opening}:</span> {opLabel[p.opening] || p.opening}</div>
              <div><span className="font-semibold">{t.glass}:</span> {p.glass}</div>
              <div><span className="font-semibold">{t.frameProf}:</span> {p.frameProfile}, {t.frameDepth} {p.frameDepth} mm</div>
              <div><span className="font-semibold">{t.sashProf}:</span> {p.sashProfile}, {t.sashDepth} {p.sashDepth} mm</div>
              {(() => {
                const autoLines = [];
                if (p.hasMosquitoNet && !p.accessories.some(a => a.toLowerCase().includes('mreža') || a.toLowerCase().includes('insekt'))) {
                  const netLabel = { harmo: t.mosquitoNetHarmo, roller: t.mosquitoNetRoller, fixed: t.mosquitoNetFixed }[p.mosquitoNetType || 'harmo'];
                  autoLines.push(`${t.mosquitoNetLabel}: ${netLabel}`);
                }
                const panelShutters = getPanelShutters(p);
                const anyShutter = panelShutters.some(Boolean);
                if (anyShutter && !p.accessories.some(a => a.toLowerCase().includes('roletna') || a.toLowerCase().includes('rollladen'))) {
                  const shutterType = p.shutterBoxType === 'inside' ? t.shutterInside : t.shutterOutside;
                  const ctrl = { belt: t.shutterBelt, crank: t.shutterCrank, motor: t.shutterMotor }[p.shutterControl || 'belt'];
                  const bh = p.shutterBoxHeight || 200;
                  const count = getPanelCount(p.type);
                  const panelLabels = count === 2 ? ['L', 'D'] : count === 3 ? ['L', 'M', 'D'] : null;
                  const shutterDesc = panelLabels && !panelShutters.every(Boolean)
                    ? panelShutters.map((s, i) => s ? panelLabels[i] : null).filter(Boolean).join(', ')
                    : null;
                  autoLines.push(`${t.shutterLabel}${shutterDesc ? ` (${shutterDesc})` : ''}: ${shutterType} ${t.shutterAlu}, ${bh}×${bh}`);
                  autoLines.push(`${t.shutterControlLabel}: ${ctrl}`);
                }
                const all = [...p.accessories, ...autoLines];
                return all.length > 0 ? (
                  <div className="mt-1.5">
                    <div className="font-semibold">{t.accessories}:</div>
                    <ul className="ml-3">{all.map((a, idx) => <li key={idx}>· {a}</li>)}</ul>
                  </div>
                ) : null;
              })()}
            </div>
            <div className="w-12 shrink-0 text-center pt-1" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
              {p.quantity}
            </div>
            {showPrices && (
              <>
                <div className="w-20 shrink-0 text-right pt-1" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
                  {p.unitPrice ? fmt(p.unitPrice, currency) : '—'}
                </div>
                <div className="w-24 shrink-0 text-right pt-1 font-medium" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
                  {p.unitPrice ? fmt(p.unitPrice * p.quantity, currency) : '—'}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* NAPOMENE I TOTALI */}
      <div className="px-12 py-8 print-page">
        <div className="text-sm font-semibold mb-3 tracking-wider">{t.notesTitle}:</div>
        <ul className="space-y-1 text-[10px] mb-6">
          {(doc.docNotes ?? t.notes).map((n, i) => n.trim() && <li key={i}>· {n}</li>)}
        </ul>

        {(() => { const terms = doc.docPayTerms ?? [t.pay70, t.pay30]; return terms.length > 0 && (
          <>
            <div className="text-sm font-semibold mb-2">{t.paymentT}:</div>
            <ul className="space-y-1 text-[10px] mb-6">
              {terms.map((n, i) => n.trim() && <li key={i}>· {n}</li>)}
            </ul>
          </>
        ); })()}

        <div className="text-[10px] text-stone-600 mb-8 italic">{t.closing}</div>

        {/* TOTALI */}
        <div className="border-t-2 pt-4" style={{ borderColor: '#1a1a1a' }}>
          <div className="flex justify-between items-end">
            <div className="text-[10px] space-y-1">
              {(doc.showMontage ?? true) && <div><span className="font-semibold">{t.montage}:</span> {t.yes}</div>}
              {(doc.showTransport ?? true) && <div><span className="font-semibold">{t.transport}:</span> {t.yes}</div>}
              <div><span className="font-semibold">{t.deliveryT}:</span> {doc.deliveryText ?? 'Franco Bugojno'}</div>
              <div><span className="font-semibold">{t.payMethod}:</span> {doc.paymentMethodText ?? t.cash}</div>
            </div>
            <div className="text-right">
              <table style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }} className="text-[11px]">
                <tbody>
                  {vatEnabled ? (
                    <>
                      <tr><td className="pr-6 text-stone-600">{t.net}:</td><td className="text-right">{fmt(finalNet, currency)}</td></tr>
                      <tr><td className="pr-6 text-stone-600">{t.vat(vatRate)}:</td><td className="text-right">{fmt(vat, currency)}</td></tr>
                      <tr className="text-base font-semibold border-t" style={{ borderColor: '#1a1a1a' }}><td className="pr-6 pt-1">{t.gross}:</td><td className="text-right pt-1">{fmt(gross, currency)}</td></tr>
                    </>
                  ) : (
                    <tr className="text-base font-semibold"><td className="pr-6">{t.total}:</td><td className="text-right">{fmt(finalNet, currency)}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
