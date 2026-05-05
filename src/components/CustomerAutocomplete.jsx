import React, { useState, useEffect, useRef } from 'react';
import { getCustomers } from '../utils/customers';

export default function CustomerAutocomplete({ value, onChange, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const suggestions = open && value.trim()
    ? getCustomers()
        .filter(c => c.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full px-2 py-1.5 border text-sm"
        style={{ borderColor: '#d4d4cf' }}
      />
      {suggestions.length > 0 && (
        <div className="absolute z-30 w-full bg-white border shadow-md mt-0.5"
          style={{ borderColor: '#d4d4cf' }}>
          {suggestions.map(c => (
            <div key={c.id}
              onMouseDown={e => { e.preventDefault(); onSelect(c); setOpen(false); }}
              className="px-3 py-2 cursor-pointer hover:bg-stone-50 border-b last:border-0"
              style={{ borderColor: '#f0f0ec' }}>
              <div className="text-xs font-medium text-stone-800">{c.name}</div>
              <div className="text-[10px] text-stone-400 truncate">{c.address?.split('\n')[0]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
