import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Eye, EyeOff } from 'lucide-react';
import CustomersManager from './CustomersManager';
import { saveCustomer } from './utils/customers';
import { getTemplates, deleteTemplate } from './utils/templates';
import { ELEMENT_TYPES, newPosition } from './elementTypes';
import PositionEditor from './components/PositionEditor';
import PdfPreview from './components/PdfPreview';
import QuotesList from './components/QuotesList';
import CustomerAutocomplete from './components/CustomerAutocomplete';
import NotesEditor from './components/NotesEditor';

const QUOTES_KEY = 'quotes';
const CURRENT_ID_KEY = 'current-quote-id';

const nextQuoteNumber = (quotes = []) => {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  const max = quotes
    .filter(q => q.number?.startsWith(prefix))
    .map(q => parseInt(q.number.slice(prefix.length), 10) || 0)
    .reduce((a, b) => Math.max(a, b), 0);
  return `${year}-${String(max + 1).padStart(4, '0')}`;
};

const createEmptyDoc = (quotes = []) => ({
  id: crypto.randomUUID(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  number: nextQuoteNumber(quotes),
  date: new Date().toLocaleDateString('de-DE'),
  customer: { name: '', address: '' },
  customerId: null,
  positions: [],
  netOverride: 0,
  vatRate: 17,
  vatEnabled: true,
  customNotes: '',
  advanceRate: 70,
  descFields: null,
  docNotes: null,
  docPayTerms: null,
  showMontage: true,
  showTransport: true,
  deliveryText: null,
  paymentMethodText: null,
});

const loadStorage = () => {
  try {
    const old = localStorage.getItem('current-quote');
    if (old) {
      const parsed = JSON.parse(old);
      const now = Date.now();
      const doc = { ...parsed, id: parsed.id || crypto.randomUUID(), createdAt: now, updatedAt: now };
      localStorage.setItem(QUOTES_KEY, JSON.stringify([doc]));
      localStorage.setItem(CURRENT_ID_KEY, doc.id);
      localStorage.removeItem('current-quote');
      return { quotes: [doc], currentId: doc.id };
    }
    const raw = localStorage.getItem(QUOTES_KEY);
    const currentId = localStorage.getItem(CURRENT_ID_KEY);
    if (raw) {
      const quotes = JSON.parse(raw);
      return { quotes, currentId: currentId || quotes[0]?.id };
    }
  } catch {}
  const doc = createEmptyDoc();
  return { quotes: [doc], currentId: doc.id };
};

export default function App() {
  const [quotes, setQuotes] = useState(() => loadStorage().quotes);
  const [currentId, setCurrentId] = useState(() => loadStorage().currentId);
  const doc = quotes.find(q => q.id === currentId) ?? quotes[0];
  const setDoc = (newDoc) =>
    setQuotes(prev => prev.map(q => q.id === newDoc.id ? { ...newDoc, updatedAt: Date.now() } : q));

  const [saveStatus, setSaveStatus] = useState('saved');

  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
        localStorage.setItem(CURRENT_ID_KEY, currentId);
      } catch {}
      setSaveStatus('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [quotes, currentId]);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dark-mode') === 'true');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

  const [lang, setLang] = useState('bs');
  const [currency, setCurrency] = useState('KM');

  const FIELD_TRANSLATIONS = {
    color: { "bijela / antracit": "weiß / anthrazit", "weiß / anthrazit": "bijela / antracit" },
    glass: {
      "troslojno, 44 mm (4/16/4/18/4) LOW-E Argon (Ug = 0,6)": "dreifach, 44 mm (4/16/4/18/4) LOW-E Argon (Ug = 0,6)",
      "dreifach, 44 mm (4/16/4/18/4) LOW-E Argon (Ug = 0,6)": "troslojno, 44 mm (4/16/4/18/4) LOW-E Argon (Ug = 0,6)",
    },
    systemName: {
      "Deceuninck Elegant 76 MD ili ekvivalentan model": "Deceuninck Elegant 76 MD oder gleichwertiges Modell",
      "Deceuninck Elegant 76 MD oder gleichwertiges Modell": "Deceuninck Elegant 76 MD ili ekvivalentan model",
    },
    accessories: {
      "Zaštita od insekata: (sistem Harmo)": "Insektenschutz: (System Harmo)",
      "Insektenschutz: (System Harmo)": "Zaštita od insekata: (sistem Harmo)",
    },
  };

  const translatePositions = (positions) => positions.map(p => {
    const updated = { ...p };
    for (const field of ['color', 'glass', 'systemName']) {
      const map = FIELD_TRANSLATIONS[field];
      if (map && map[p[field]]) updated[field] = map[p[field]];
    }
    if (Array.isArray(p.accessories)) {
      updated.accessories = p.accessories.map(a => FIELD_TRANSLATIONS.accessories[a] ?? a);
    }
    return updated;
  });

  const translateDoc = (d, newLang) => {
    const oldT = T[newLang === 'de' ? 'bs' : 'de'];
    const newT = T[newLang];
    const arrEq = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
    const updated = { ...d, positions: translatePositions(d.positions) };
    if (arrEq(d.docNotes, oldT.notes) || d.docNotes === null) updated.docNotes = null;
    if (arrEq(d.docPayTerms, [oldT.pay70, oldT.pay30]) || d.docPayTerms === null) updated.docPayTerms = null;
    if (d.paymentMethodText === oldT.cash) updated.paymentMethodText = newT.cash;
    return updated;
  };
  const [showPrices, setShowPrices] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [view, setView] = useState('split');
  const [currentView, setCurrentView] = useState('quotes');
  const [customerSavedToast, setCustomerSavedToast] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [confirmDeleteTpl, setConfirmDeleteTpl] = useState(null);

  const updatePos = (id, newPos) => {
    setDoc({ ...doc, positions: doc.positions.map(p => p.id === id ? newPos : p) });
  };

  const addPos = (type) => {
    setDoc({ ...doc, positions: [...doc.positions, newPosition(type, lang)] });
    setShowAddMenu(false);
  };

  const deletePos = (id) => {
    setDoc({ ...doc, positions: doc.positions.filter(p => p.id !== id) });
  };

  const duplicatePos = (id) => {
    const original = doc.positions.find(p => p.id === id);
    if (!original) return;
    const copy = { ...original, id: crypto.randomUUID() };
    const idx = doc.positions.findIndex(p => p.id === id);
    const newPositions = [...doc.positions];
    newPositions.splice(idx + 1, 0, copy);
    setDoc({ ...doc, positions: newPositions });
  };

  const movePos = (id, dir) => {
    const idx = doc.positions.findIndex(p => p.id === id);
    if (idx === -1) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= doc.positions.length) return;
    const newPositions = [...doc.positions];
    [newPositions[idx], newPositions[newIdx]] = [newPositions[newIdx], newPositions[idx]];
    setDoc({ ...doc, positions: newPositions });
  };

  const addPosFromTemplate = (tpl) => {
    const pos = { ...tpl.position, id: crypto.randomUUID() };
    setDoc({ ...doc, positions: [...doc.positions, pos] });
    setShowTemplateMenu(false);
    setConfirmDeleteTpl(null);
  };

  const newQuote = () => {
    const q = createEmptyDoc(quotes);
    setQuotes(prev => [q, ...prev]);
    setCurrentId(q.id);
  };

  const duplicateQuote = (id) => {
    const original = quotes.find(q => q.id === id);
    if (!original) return;
    const now = Date.now();
    const copy = {
      ...original,
      id: crypto.randomUUID(),
      number: nextQuoteNumber(quotes),
      date: new Date().toLocaleDateString('de-DE'),
      createdAt: now,
      updatedAt: now,
    };
    setQuotes(prev => [copy, ...prev]);
    setCurrentId(copy.id);
  };

  const selectQuote = (id) => setCurrentId(id);

  const deleteQuote = (id) => {
    setQuotes(prev => {
      const next = prev.filter(q => q.id !== id);
      if (next.length === 0) {
        const q = createEmptyDoc();
        setCurrentId(q.id);
        return [q];
      }
      if (id === currentId) setCurrentId(next[0].id);
      return next;
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        @media print {
          body * { visibility: hidden; }
          #pdf-area, #pdf-area * { visibility: visible; }
          #pdf-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print-page { page-break-after: always; }
          .avoid-break { page-break-inside: avoid; }
          @page { size: A4; margin: 0; }
        }
        body { background: var(--app-bg); }
      `}</style>

      <div className="h-screen flex flex-col" style={{ background: 'var(--app-bg)', fontFamily: 'Geist, system-ui, sans-serif', color: 'var(--text)' }}>
        {/* TOP BAR */}
        <div className="border-b shrink-0 z-10" style={{ background: 'var(--app-bg)', borderColor: 'var(--border)', printColorAdjust: 'exact' }}>
          <div className="px-6 py-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <img src="/neoprom-icon.svg" alt="Neoprom" style={{ height: '28px', display: 'block' }} />
              <div className="font-medium tracking-tight" style={{ color: 'var(--text)' }}>Generator ponuda <span className="text-xs ml-1" style={{ color: 'var(--text-subtle)' }}>v1.0</span></div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              {[['quotes', 'Ponude'], ['customers', 'Kupci']].map(([v, label]) => (
                <button key={v} onClick={() => setCurrentView(v)}
                  className="px-3 py-1 text-xs font-medium"
                  style={{
                    color: currentView === v ? 'var(--navy)' : 'var(--text-muted)',
                    borderBottom: `2px solid ${currentView === v ? 'var(--navy)' : 'transparent'}`
                  }}>
                  {label}
                </button>
              ))}
            </div>
            <div className="h-5 w-px mx-1" style={{ background: 'var(--border)' }}></div>

            {/* Jezik */}
            <div className="flex items-center gap-1 text-xs">
              <span className="mr-1" style={{ color: 'var(--text-muted)' }}>Jezik:</span>
              {['bs', 'de'].map(l => (
                <button key={l} onClick={() => { if (l !== lang) { setLang(l); setDoc(translateDoc(doc, l)); } }} className="px-2 py-1 uppercase tracking-wider" style={{ background: lang === l ? 'var(--navy)' : 'transparent', color: lang === l ? 'white' : 'var(--text-muted)' }}>{l}</button>
              ))}
            </div>

            {/* Valuta */}
            <div className="flex items-center gap-1 text-xs">
              <span className="mr-1" style={{ color: 'var(--text-muted)' }}>Valuta:</span>
              {['KM', 'EUR'].map(c => (
                <button key={c} onClick={() => setCurrency(c)} className="px-2 py-1" style={{ background: currency === c ? 'var(--navy)' : 'transparent', color: currency === c ? 'white' : 'var(--text-muted)' }}>{c}</button>
              ))}
            </div>

            {/* Cijene */}
            <button onClick={() => setShowPrices(!showPrices)} className="flex items-center gap-1.5 text-xs px-2 py-1 border" style={{ borderColor: 'var(--input-border)', color: showPrices ? 'var(--navy)' : 'var(--text-muted)' }}>
              {showPrices ? <Eye size={13} /> : <EyeOff size={13} />}
              Cijene po poziciji
            </button>

            {/* Dark mode */}
            <button onClick={() => setDarkMode(!darkMode)} className="text-xs px-2 py-1 border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              {darkMode ? '☀ Light' : '☾ Dark'}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span style={{ fontSize: '11px', color: saveStatus === 'saved' ? '#16a34a' : '#ca8a04' }}>
                {saveStatus === 'saved' ? '✓ Spremljeno' : '⏳ Spremam...'}
              </span>
              <button onClick={() => setView(view === 'split' ? 'preview' : 'split')} className="text-xs px-3 py-1.5 border" style={{ borderColor: 'var(--input-border)', color: 'var(--text)' }}>
                {view === 'split' ? 'Samo preview' : 'Editor + preview'}
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-white" style={{ background: 'var(--navy)' }}>
                <Printer size={13} /> Štampaj / PDF
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOMERS VIEW */}
        {currentView === 'customers' && <div className="flex-1 overflow-y-auto"><CustomersManager /></div>}

        {/* MAIN GRID */}
        {currentView === 'quotes' && <div className={view === 'split' ? "flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[240px_420px_1fr]" : "flex-1 overflow-y-auto p-6"}>

          {/* QUOTES LIST SIDEBAR */}
          {view === 'split' && (
            <QuotesList
              quotes={quotes}
              currentId={currentId}
              onSelect={selectQuote}
              onNew={newQuote}
              onDelete={deleteQuote}
              onDuplicate={duplicateQuote}
            />
          )}

          {/* EDITOR PANEL */}
          {view === 'split' && (
            <div className="space-y-4 p-6 border-r overflow-y-auto h-full" style={{ borderColor: 'var(--border)', background: 'var(--app-bg)' }}>
              {/* Header info */}
              <div className="border p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs uppercase tracking-wider text-stone-500 mb-3">Podaci o ponudi</div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Broj ponude</label>
                      <input value={doc.number} onChange={e => setDoc({ ...doc, number: e.target.value })} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: 'var(--input-border)', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Datum</label>
                      <input value={doc.date} onChange={e => setDoc({ ...doc, date: e.target.value })} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: 'var(--input-border)', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500">Kupac</label>
                      {doc.customerId && (
                        <button onClick={() => setCurrentView('customers')}
                          className="text-[10px] px-1.5 py-0.5 flex items-center gap-1"
                          style={{ color: '#1f3a5f', background: '#eff6ff' }}>
                          ✓ Iz baze
                        </button>
                      )}
                    </div>
                    <CustomerAutocomplete
                      value={doc.customer.name}
                      onChange={name => setDoc({ ...doc, customer: { ...doc.customer, name }, customerId: null })}
                      onSelect={c => {
                        setDoc({ ...doc, customer: { name: c.name, address: c.address }, customerId: c.id });
                        if (c.language && c.language !== lang) { setLang(c.language); setDoc(translateDoc(doc, c.language)); } else if (c.language) setLang(c.language);
                        if (c.currency) setCurrency(c.currency);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Adresa</label>
                    <textarea value={doc.customer.address} onChange={e => setDoc({ ...doc, customer: { ...doc.customer, address: e.target.value } })} rows="2" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: 'var(--input-border)' }} />
                    {doc.customer.name && !doc.customerId && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <button onClick={() => {
                          const saved = saveCustomer({
                            name: doc.customer.name, address: doc.customer.address,
                            phone: '', email: '', language: lang, currency: currency,
                            vatPayer: false, notes: '',
                          });
                          setDoc({ ...doc, customerId: saved.id });
                          setCustomerSavedToast(true);
                          setTimeout(() => setCustomerSavedToast(false), 2500);
                        }} className="text-[10px] text-stone-500 hover:text-stone-800">
                          + Sačuvaj kao novog kupca
                        </button>
                        {customerSavedToast && (
                          <span className="text-[10px]" style={{ color: '#16a34a' }}>Kupac sačuvan u bazu ✓</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pozicije */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase tracking-wider text-stone-500">Pozicije ({doc.positions.length})</div>
                  <div className="flex items-center gap-1">
                    {/* Iz template-a */}
                    <div className="relative">
                      <button onClick={() => { setTemplates(getTemplates()); setShowTemplateMenu(!showTemplateMenu); setConfirmDeleteTpl(null); }}
                        className="text-xs px-2 py-1 border" style={{ borderColor: 'var(--input-border)', color: 'var(--text-muted)' }}>
                        Iz template-a
                      </button>
                      {showTemplateMenu && (
                        <div className="absolute right-0 top-full mt-1 border shadow-lg z-20 w-56" style={{ borderColor: 'var(--input-border)', background: 'var(--panel-bg)', color: 'var(--text)' }}>
                          {templates.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-stone-400">Nema spremljenih template-a</div>
                          ) : (
                            templates.map(tpl => (
                              <div key={tpl.id} className="flex items-center px-3 py-2 border-b hover:bg-stone-50" style={{ borderColor: '#f0f0ec' }}>
                                <button className="flex-1 text-left text-xs truncate" onClick={() => addPosFromTemplate(tpl)}>
                                  {tpl.name}
                                </button>
                                {confirmDeleteTpl === tpl.id ? (
                                  <div className="flex gap-1 ml-2 shrink-0" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => { deleteTemplate(tpl.id); setTemplates(getTemplates()); setConfirmDeleteTpl(null); }}
                                      className="text-[10px] text-red-600 hover:underline">Da</button>
                                    <button onClick={() => setConfirmDeleteTpl(null)}
                                      className="text-[10px] text-stone-400 hover:underline">Ne</button>
                                  </div>
                                ) : (
                                  <button onClick={e => { e.stopPropagation(); setConfirmDeleteTpl(tpl.id); }}
                                    className="ml-2 shrink-0 text-stone-300 hover:text-red-500">
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {/* Dodaj */}
                    <div className="relative">
                      <button onClick={() => setShowAddMenu(!showAddMenu)} className="flex items-center gap-1 text-xs px-2 py-1 text-white" style={{ background: '#1f3a5f' }}>
                        <Plus size={12} /> Dodaj
                      </button>
                      {showAddMenu && (
                        <div className="absolute right-0 top-full mt-1 border shadow-lg z-20" style={{ borderColor: 'var(--input-border)', background: 'var(--panel-bg)', color: 'var(--text)' }}>
                          {ELEMENT_TYPES.map(t => (
                            <button key={t.id} onClick={() => addPos(t.id)} className="block w-full text-left px-3 py-2 text-xs hover:bg-stone-50 whitespace-nowrap" style={{ color: 'var(--text)' }}>{t.name}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {doc.positions.map((p, idx) => (
                    <PositionEditor
                      key={p.id}
                      pos={p}
                      index={idx}
                      lang={lang}
                      expanded={expandedId === p.id}
                      onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      onChange={np => updatePos(p.id, np)}
                      onDelete={() => deletePos(p.id)}
                      onDuplicate={() => duplicatePos(p.id)}
                      onMoveUp={() => movePos(p.id, -1)}
                      onMoveDown={() => movePos(p.id, 1)}
                    />
                  ))}
                </div>
              </div>

              {/* Override neta */}
              <details className="border" style={{ borderColor: 'var(--border)' }}>
                <summary className="px-4 py-3 cursor-pointer text-[10px] uppercase tracking-wider text-stone-500 select-none">Neto override</summary>
                <div className="px-4 pb-4">
                  <input type="number" value={doc.netOverride || ''} onChange={e => setDoc({ ...doc, netOverride: +e.target.value })} placeholder="Auto-zbroj iz pozicija" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: 'var(--input-border)', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                </div>
              </details>

              {/* PDV */}
              <details className="border" style={{ borderColor: 'var(--border)' }}>
                <summary className="px-4 py-3 cursor-pointer text-[10px] uppercase tracking-wider text-stone-500 select-none">PDV</summary>
                <div className="px-4 pb-4 space-y-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input type="checkbox" checked={doc.vatEnabled ?? true}
                      onChange={e => setDoc({ ...doc, vatEnabled: e.target.checked })} />
                    Obračunaj PDV
                  </label>
                  {(doc.vatEnabled ?? true) && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Stopa PDV-a (%)</label>
                      <input type="number" value={doc.vatRate ?? 17}
                        onChange={e => setDoc({ ...doc, vatRate: +e.target.value })}
                        min="0" max="30" step="0.5"
                        className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: 'var(--input-border)', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                    </div>
                  )}
                </div>
              </details>

              {/* Avans */}
              <details className="border" style={{ borderColor: 'var(--border)' }}>
                <summary className="px-4 py-3 cursor-pointer text-[10px] uppercase tracking-wider text-stone-500 select-none">Avans</summary>
                <div className="px-4 pb-4">
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Avans (%)</label>
                  <input type="number" value={doc.advanceRate ?? 70}
                    onChange={e => setDoc({ ...doc, advanceRate: +e.target.value })}
                    min="0" max="100" step="5"
                    className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: 'var(--input-border)', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                </div>
              </details>

              {/* Polja opisa */}
              {(() => {
                const df = doc.descFields ?? {};
                const g = (k) => df[k] ?? true;
                const s = (k, v) => setDoc({ ...doc, descFields: { ...df, [k]: v } });
                const fields = [
                  ['system', 'Sistem'], ['element', 'Tip elementa'], ['dims', 'Dimenzije'],
                  ['fitting', 'Okov'], ['color', 'Boja'], ['opening', 'Otvaranje'],
                  ['glass', 'Staklo'], ['frameProf', 'Profil rama'], ['sashProf', 'Profil krila'],
                  ['accessories', 'Dodaci / pribor'],
                ];
                return (
                  <details className="border" style={{ borderColor: 'var(--border)' }}>
                    <summary className="px-4 py-3 cursor-pointer text-[10px] uppercase tracking-wider text-stone-500 select-none">Polja opisa u PDF-u</summary>
                    <div className="px-4 pb-4 grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
                      {fields.map(([k, label]) => (
                        <label key={k} className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="checkbox" checked={g(k)} onChange={e => s(k, e.target.checked)} />
                          {label}
                        </label>
                      ))}
                    </div>
                  </details>
                );
              })()}

              {/* Napomene */}
              <NotesEditor doc={doc} setDoc={setDoc} lang={lang} />
            </div>
          )}

          {/* PREVIEW PANEL */}
          <div className="p-4 lg:p-8 overflow-auto h-full" style={{ background: 'var(--panel-bg-alt)' }}>
            <div className="mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm', background: 'white', color: '#1a1a1a' }}>
              <PdfPreview doc={doc} lang={lang} currency={currency} showPrices={showPrices} />
            </div>
          </div>
        </div>}

        <div className="shrink-0 text-center text-[10px] text-stone-400 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          Neoprom Engineering · Generator ponuda v1.0
        </div>
      </div>
    </>
  );
}
