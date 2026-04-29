import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getCustomers, saveCustomer, deleteCustomer } from './utils/customers';

const EMPTY_FORM = {
  name: '', address: '', phone: '', email: '',
  language: 'bs', currency: 'KM', vatPayer: false, notes: '',
};

const fmtDate = (ts) => ts
  ? new Date(ts).toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit', year: 'numeric' })
  : '—';

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const refresh = useCallback(() => setCustomers(getCustomers()), []);

  useEffect(() => { refresh(); }, [refresh]);

  const sorted = [...customers].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', 'bs')
  );

  const filtered = sorted.filter(c => {
    const q = search.toLowerCase();
    return !q ||
      c.name?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q);
  });

  const selectCustomer = (c) => {
    setSelectedId(c.id);
    setForm({ ...c });
    setConfirmDelete(false);
  };

  const startNew = () => {
    setSelectedId(null);
    setForm({ ...EMPTY_FORM });
    setConfirmDelete(false);
  };

  const handleSave = () => {
    const saved = saveCustomer(form);
    refresh();
    setSelectedId(saved.id);
    setForm({ ...saved });
    setToast('Sačuvano ✓');
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = () => {
    deleteCustomer(selectedId);
    refresh();
    setSelectedId(null);
    setForm(null);
    setConfirmDelete(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]"
      style={{ minHeight: 'calc(100vh - 57px)', fontFamily: 'Geist, system-ui, sans-serif' }}>

      {/* LIJEVI PANEL */}
      <div className="border-r flex flex-col" style={{ borderColor: '#e5e5e0', background: 'white' }}>
        <div className="p-4 border-b" style={{ borderColor: '#e5e5e0' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider text-stone-500">
              Kupci ({customers.length})
            </div>
            <button onClick={startNew}
              className="flex items-center gap-1 text-xs px-2 py-1 text-white"
              style={{ background: '#1f3a5f' }}>
              <Plus size={11} /> Novi kupac
            </button>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pretraga..."
            className="w-full px-2 py-1.5 border text-xs"
            style={{ borderColor: '#d4d4cf' }}
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 && (
            <div className="text-xs text-stone-400 text-center py-8">
              {customers.length === 0 ? 'Nema kupaca' : 'Nema rezultata'}
            </div>
          )}
          {filtered.map(c => (
            <div key={c.id} onClick={() => selectCustomer(c)}
              className="px-4 py-3 border-b cursor-pointer"
              style={{ borderColor: '#e5e5e0', background: c.id === selectedId ? '#eff6ff' : 'white' }}>
              <div className="text-sm font-medium truncate"
                style={{ color: c.id === selectedId ? '#1f3a5f' : '#1a1a1a' }}>
                {c.name || '—'}
              </div>
              <div className="text-xs text-stone-400 truncate mt-0.5">
                {c.address?.split('\n')[0] || ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESNI PANEL */}
      <div className="p-6 overflow-y-auto" style={{ background: '#fafaf7' }}>
        {!form ? (
          <div className="h-64 flex items-center justify-center text-stone-400 text-sm">
            Odaberite kupca iz liste ili kreirajte novog
          </div>
        ) : (
          <div className="max-w-lg">
            <div className="bg-white border p-5 space-y-4" style={{ borderColor: '#e5e5e0' }}>

              {/* Ime */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Ime *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              </div>

              {/* Adresa */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Adresa</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  rows={3} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              </div>

              {/* Telefon + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Telefon</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                </div>
              </div>

              {/* Jezik + Valuta + PDV */}
              <div className="grid grid-cols-3 gap-3 items-start">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Jezik komunikacije</label>
                  <div className="flex gap-3">
                    {['bs', 'de'].map(l => (
                      <label key={l} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input type="radio" name="cm-lang" value={l}
                          checked={form.language === l}
                          onChange={() => setForm({ ...form, language: l })} />
                        {l.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Valuta</label>
                  <div className="flex gap-3">
                    {['KM', 'EUR'].map(v => (
                      <label key={v} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input type="radio" name="cm-currency" value={v}
                          checked={form.currency === v}
                          onChange={() => setForm({ ...form, currency: v })} />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">PDV</label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" checked={form.vatPayer}
                      onChange={e => setForm({ ...form, vatPayer: e.target.checked })} />
                    Obveznik
                  </label>
                </div>
              </div>

              {/* Napomene */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                  Napomene{' '}
                  <span className="normal-case font-normal text-stone-400">(samo interno — ne vidi se na ponudi)</span>
                </label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={3} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              </div>

              {/* Akcije */}
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: '#e5e5e0' }}>
                <button onClick={handleSave}
                  className="px-4 py-1.5 text-xs text-white"
                  style={{ background: '#1f3a5f' }}>
                  Sačuvaj
                </button>

                {selectedId && !confirmDelete && (
                  <button onClick={() => setConfirmDelete(true)}
                    className="px-4 py-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50">
                    Obriši
                  </button>
                )}

                {confirmDelete && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">
                      Sigurno obrisati <strong>{form.name}</strong>?
                    </span>
                    <button onClick={handleDelete} className="text-xs text-red-600 hover:underline">Da</button>
                    <button onClick={() => setConfirmDelete(false)} className="text-xs text-stone-400 hover:underline">Ne</button>
                  </div>
                )}

                {toast && (
                  <span className="ml-auto text-xs" style={{ color: '#16a34a' }}>{toast}</span>
                )}
              </div>

              {/* Timestamps */}
              {(form.createdAt || form.updatedAt) && (
                <div className="text-[10px] text-stone-400 space-y-0.5"
                  style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
                  {form.createdAt && <div>Kreiran: {fmtDate(form.createdAt)}</div>}
                  {form.updatedAt && <div>Ažuriran: {fmtDate(form.updatedAt)}</div>}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}