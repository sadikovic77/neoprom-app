import React, { useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { fmt } from '../utils/format';

function QuoteListItem({ quote, isActive, onSelect, onDelete, onDuplicate }) {
  const [confirm, setConfirm] = useState(false);
  const total = quote.positions.reduce((s, p) => s + (p.unitPrice || 0) * (p.quantity || 1), 0);
  return (
    <div onClick={onSelect} className="px-3 py-2.5 border-b cursor-pointer"
      style={{ borderColor: '#e5e5e0', background: isActive ? '#eff6ff' : 'white' }}>
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate"
            style={{ color: isActive ? '#1f3a5f' : '#1a1a1a', fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
            {quote.number}
          </div>
          <div className="text-xs truncate text-stone-600">{quote.customer.name || '—'}</div>
          <div className="text-[10px] text-stone-400 mt-0.5"
            style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
            {quote.date} · {total > 0 ? fmt(total, 'KM') : '—'}
          </div>
        </div>
        <div className="shrink-0 pt-0.5">
          {confirm ? (
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              <button onClick={onDelete} className="text-[10px] text-red-600 px-1 hover:underline">Da</button>
              <button onClick={() => setConfirm(false)} className="text-[10px] text-stone-400 px-1">Ne</button>
            </div>
          ) : (
            <div className="flex gap-0.5">
              <button onClick={e => { e.stopPropagation(); onDuplicate(); }}
                className="text-stone-300 hover:text-stone-600 p-0.5">
                <Copy size={12} />
              </button>
              <button onClick={e => { e.stopPropagation(); setConfirm(true); }}
                className="text-stone-300 hover:text-red-500 p-0.5">
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuotesList({ quotes, currentId, onSelect, onNew, onDelete, onDuplicate }) {
  const [search, setSearch] = useState('');
  const sorted = [...quotes].sort((a, b) => b.updatedAt - a.updatedAt);
  const filtered = sorted.filter(q =>
    q.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    q.number.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col border-r overflow-hidden h-full" style={{ borderColor: '#e5e5e0', background: 'white' }}>
      <div className="p-3 border-b" style={{ borderColor: '#e5e5e0' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] uppercase tracking-wider text-stone-500">Sve ponude</div>
          <button onClick={onNew} className="flex items-center gap-1 text-xs px-2 py-1 text-white"
            style={{ background: '#1f3a5f' }}>
            <Plus size={11} /> Nova
          </button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Pretraga..." className="w-full px-2 py-1.5 border text-xs"
          style={{ borderColor: '#d4d4cf' }} />
      </div>
      <div className="overflow-y-auto flex-1">
        {filtered.length === 0 && (
          <div className="text-xs text-stone-400 text-center py-6">Nema rezultata</div>
        )}
        {filtered.map(q => (
          <QuoteListItem key={q.id} quote={q} isActive={q.id === currentId}
            onSelect={() => onSelect(q.id)} onDelete={() => onDelete(q.id)} onDuplicate={() => onDuplicate(q.id)} />
        ))}
      </div>
    </div>
  );
}
