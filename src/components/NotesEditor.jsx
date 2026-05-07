import React from 'react';
import { T } from '../translations';

export default function NotesEditor({ doc, setDoc, lang }) {
  const t = T[lang];
  const notes = doc.docNotes ?? t.notes;
  const payTerms = doc.docPayTerms ?? [t.pay70, t.pay30];

  const updateNote = (i, val) => { const n = [...notes]; n[i] = val; setDoc({ ...doc, docNotes: n }); };
  const removeNote = (i) => setDoc({ ...doc, docNotes: notes.filter((_, j) => j !== i) });
  const addNote = () => setDoc({ ...doc, docNotes: [...notes, ''] });
  const moveNote = (i, dir) => {
    const n = [...notes];
    const ni = i + dir;
    if (ni < 0 || ni >= n.length) return;
    [n[i], n[ni]] = [n[ni], n[i]];
    setDoc({ ...doc, docNotes: n });
  };

  const updatePayTerm = (i, val) => { const n = [...payTerms]; n[i] = val; setDoc({ ...doc, docPayTerms: n }); };
  const removePayTerm = (i) => setDoc({ ...doc, docPayTerms: payTerms.filter((_, j) => j !== i) });
  const addPayTerm = () => setDoc({ ...doc, docPayTerms: [...payTerms, ''] });
  const movePayTerm = (i, dir) => {
    const n = [...payTerms];
    const ni = i + dir;
    if (ni < 0 || ni >= n.length) return;
    [n[i], n[ni]] = [n[ni], n[i]];
    setDoc({ ...doc, docPayTerms: n });
  };

  return (
    <details className="border" style={{ borderColor: 'var(--border)' }}>
      <summary className="px-4 py-3 cursor-pointer text-[10px] uppercase tracking-wider text-stone-500 select-none">
        Napomene i uslovi
      </summary>
      <div className="px-4 pb-4 space-y-4">
        {/* Napomene lista */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Napomene</span>
            <button onClick={addNote} className="text-[10px] px-2 py-0.5 text-white" style={{ background: '#1f3a5f' }}>+ Dodaj</button>
          </div>
          <div className="space-y-1">
            {notes.map((n, i) => (
              <div key={i} className="flex gap-1 items-start">
                <div className="flex flex-col shrink-0 mt-1">
                  <button onClick={() => moveNote(i, -1)} disabled={i === 0} className="text-stone-300 hover:text-stone-600 disabled:opacity-20 leading-none">▲</button>
                  <button onClick={() => moveNote(i, 1)} disabled={i === notes.length - 1} className="text-stone-300 hover:text-stone-600 disabled:opacity-20 leading-none">▼</button>
                </div>
                <textarea value={n} onChange={e => updateNote(i, e.target.value)} rows={2}
                  className="flex-1 px-2 py-1 border text-xs resize-y" style={{ borderColor: 'var(--input-border)' }} />
                <button onClick={() => removeNote(i)} className="text-stone-300 hover:text-red-500 mt-1 shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Uslovi plaćanja */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Uslovi plaćanja</span>
            <button onClick={addPayTerm} className="text-[10px] px-2 py-0.5 text-white" style={{ background: '#1f3a5f' }}>+ Dodaj</button>
          </div>
          <div className="space-y-1">
            {payTerms.map((n, i) => (
              <div key={i} className="flex gap-1 items-center">
                <div className="flex flex-col shrink-0">
                  <button onClick={() => movePayTerm(i, -1)} disabled={i === 0} className="text-stone-300 hover:text-stone-600 disabled:opacity-20 leading-none">▲</button>
                  <button onClick={() => movePayTerm(i, 1)} disabled={i === payTerms.length - 1} className="text-stone-300 hover:text-stone-600 disabled:opacity-20 leading-none">▼</button>
                </div>
                <input value={n} onChange={e => updatePayTerm(i, e.target.value)}
                  className="flex-1 px-2 py-1 border text-xs" style={{ borderColor: 'var(--input-border)' }} />
                <button onClick={() => removePayTerm(i)} className="text-stone-300 hover:text-red-500 shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Montaža / Transport */}
        {[['montageValue', 'showMontage', 'Montaža'], ['transportValue', 'showTransport', 'Transport']].map(([valKey, showKey, label]) => {
          const val = doc[valKey] ?? (doc[showKey] === false ? 'hidden' : 'da');
          return (
            <div key={valKey} className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0" style={{ color: 'var(--text-muted)' }}>{label}:</span>
              {['da', 'ne', 'hidden'].map(opt => (
                <button key={opt} onClick={() => setDoc({ ...doc, [valKey]: opt })}
                  className="px-2 py-0.5 text-[10px] border"
                  style={{
                    borderColor: 'var(--input-border)',
                    background: val === opt ? 'var(--navy)' : 'transparent',
                    color: val === opt ? 'white' : 'var(--text-muted)',
                  }}>
                  {opt === 'hidden' ? '—' : opt === 'da' ? 'Da' : 'Ne'}
                </button>
              ))}
            </div>
          );
        })}

        {/* Način plaćanja */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-16 shrink-0" style={{ color: 'var(--text-muted)' }}>Plaćanje:</span>
          {[['cash', 'Gotovina'], ['transfer', 'Virman'], ['card', 'Kartica'], ['hidden', '—']].map(([opt, lbl]) => {
            const val = doc.paymentMethod ?? (doc.showPaymentMethod === false ? 'hidden' : 'cash');
            return (
              <button key={opt} onClick={() => setDoc({ ...doc, paymentMethod: opt })}
                className="px-2 py-0.5 text-[10px] border"
                style={{
                  borderColor: 'var(--input-border)',
                  background: val === opt ? 'var(--navy)' : 'transparent',
                  color: val === opt ? 'white' : 'var(--text-muted)',
                }}>
                {lbl}
              </button>
            );
          })}
        </div>

        {/* Uslovi isporuke */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-16 shrink-0" style={{ color: 'var(--text-muted)' }}>Isporuka:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={doc.showDelivery ?? true}
              onChange={e => setDoc({ ...doc, showDelivery: e.target.checked })} />
            <span style={{ color: 'var(--text-muted)' }}>Prikaži</span>
          </label>
        </div>
        {(doc.showDelivery ?? true) && (
          <input value={doc.deliveryText ?? 'Franco Bugojno'}
            onChange={e => setDoc({ ...doc, deliveryText: e.target.value })}
            className="w-full px-2 py-1 border text-xs" style={{ borderColor: 'var(--input-border)' }} />
        )}
      </div>
    </details>
  );
}