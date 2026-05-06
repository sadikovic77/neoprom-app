import React, { useState } from 'react';
import { Copy, Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { T } from '../translations';
import { ELEMENT_TYPES, newPosition } from '../elementTypes';
import { getElementName } from '../utils/format';
import { saveTemplate } from '../utils/templates';
import WindowDrawing from './WindowDrawing';

export default function PositionEditor({ pos, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, expanded, onToggle, index, lang }) {
  const update = (field, val) => onChange({ ...pos, [field]: val });
  const t = T[lang];
  const [showSaveTpl, setShowSaveTpl] = useState(false);
  const [tplName, setTplName] = useState('');

  return (
    <div style={{ borderColor: '#e5e5e0' }} className="border bg-white">
      {/* Compact header */}
      <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-stone-50" onClick={onToggle}>
        <div className="w-8 h-8 flex items-center justify-center text-sm font-medium" style={{ background: '#1f3a5f', color: 'white', fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: '#1a1a1a' }}>
            {getElementName(pos.type, lang)}
          </div>
          <div className="text-xs text-stone-500" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
            {pos.width} × {pos.height} mm · {pos.quantity} {t.pieces}
          </div>
        </div>
        <div className="shrink-0 bg-stone-50 border" style={{ borderColor: '#e5e5e0', width: 112, height: 112 }}>
          <WindowDrawing pos={pos} size={112} showDims={false} />
        </div>
        {expanded ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
      </div>

      {expanded && (
        <div className="p-4 border-t space-y-3" style={{ borderColor: '#e5e5e0' }}>
          {/* Tip */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Tip elementa</label>
            <select value={pos.type} onChange={e => onChange({ ...newPosition(e.target.value, lang), id: pos.id, quantity: pos.quantity, unitPrice: pos.unitPrice })} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }}>
              {ELEMENT_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Dimenzije */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Širina (mm)</label>
              <input type="number" value={pos.width} onChange={e => update('width', +e.target.value)} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Visina (mm)</label>
              <input type="number" value={pos.height} onChange={e => update('height', +e.target.value)} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
              {pos.hasShutter && (
                <div className="text-[10px] text-stone-400 mt-1">
                  Ukupna vanjska visina: {pos.height + (pos.shutterBoxHeight || 200)} mm
                </div>
              )}
            </div>
          </div>

          {/* Otvaranje */}
          {['double', 'doubleDoor', 'windowDoor', 'triple', 'sideLight'].includes(pos.type) ? (() => {
            const panelCount = { double: 2, doubleDoor: 2, windowDoor: 2, triple: 3, sideLight: 2 }[pos.type];
            const defaultPO = {
              double: ['leftTT', 'rightTT'],
              doubleDoor: ['leftTT', 'rightTT'],
              windowDoor: ['leftTT', 'rightTT'],
              triple: ['leftTT', 'fixed', 'rightTT'],
              sideLight: (pos.sideLightPosition || 'right') === 'right' ? ['rightTT', 'fixed'] : ['fixed', 'rightTT'],
            }[pos.type];
            const po = (pos.panelOpenings && pos.panelOpenings.length === panelCount)
              ? pos.panelOpenings : defaultPO;
            const updatePO = (i, val) => { const next = [...po]; next[i] = val; update('panelOpenings', next); };
            return (
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-stone-500">Otvaranje po panelima</label>
                {po.map((op, i) => (
                  <div key={i}>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Panel {i + 1}</label>
                    <select value={op} onChange={e => updatePO(i, e.target.value)}
                      className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }}>
                      <option value="leftTT">Lijevo (kip+otv)</option>
                      <option value="rightTT">Desno (kip+otv)</option>
                      <option value="leftOpen">Lijevo (samo otv)</option>
                      <option value="rightOpen">Desno (samo otv)</option>
                      <option value="tilt">Samo kip</option>
                      <option value="bottomHung">Donja kip</option>
                      <option value="topHung">Gornja kip (padajući)</option>
                      <option value="fixed">Fiksno</option>
                    </select>
                  </div>
                ))}
              </div>
            );
          })() : (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Otvaranje</label>
              <select value={pos.opening} onChange={e => update('opening', e.target.value)} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }}>
                {pos.type === 'entryDoor' ? (
                  <>
                    <option value="rightDoor">Otvaranje desno (šarke lijevo)</option>
                    <option value="leftDoor">Otvaranje lijevo (šarke desno)</option>
                  </>
                ) : pos.type === 'sliding3' ? (
                  <>
                    <option value="centerSlide">Klizi sredina</option>
                    <option value="leftSlide">Klizi lijevo</option>
                    <option value="rightSlide">Klizi desno</option>
                  </>
                ) : pos.type === 'sliding' ? (
                  <>
                    <option value="leftSlide">Klizno lijevo</option>
                    <option value="rightSlide">Klizno desno</option>
                  </>
                ) : (
                  <>
                    <option value="leftTT">Lijevo (kip+otv)</option>
                    <option value="rightTT">Desno (kip+otv)</option>
                    <option value="bothTT">Lijevo-desno (kip oba)</option>
                    <option value="tilt">Samo kip</option>
                    <option value="bottomHung">Donja kip</option>
                    <option value="topHung">Gornja kip (padajući)</option>
                    <option value="fixed">Fiksno</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Podjela (2 panela) */}
          {(pos.type === 'double' || pos.type === 'sliding' || pos.type === 'windowDoor' || pos.type === 'doubleDoor') && (() => {
            const ratio = pos.divisionRatio || 0.5;
            const w1 = Math.round(pos.width * ratio);
            const w2 = pos.width - w1;
            const setMm = (mm) => {
              const clamped = Math.max(Math.round(pos.width * 0.2), Math.min(Math.round(pos.width * 0.8), mm));
              update('divisionRatio', clamped / pos.width);
            };
            return (
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                  Podjela: {w1} / {w2} mm
                </label>
                <div className="flex items-center gap-2">
                  <input type="range" min="0.2" max="0.8" step={1 / pos.width}
                    value={ratio} onChange={e => update('divisionRatio', +e.target.value)} className="flex-1" />
                  <input type="number" value={w1} onChange={e => setMm(+e.target.value)}
                    min={Math.round(pos.width * 0.2)} max={Math.round(pos.width * 0.8)}
                    className="w-20 px-2 py-1 border text-sm text-right shrink-0"
                    style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                </div>
              </div>
            );
          })()}

          {/* Podjela za trokrilni i sliding3 */}
          {(pos.type === 'triple' || pos.type === 'sliding3') && (() => {
            const divs = pos.divisions || [0.33, 0.33, 0.34];
            const w1 = Math.round(pos.width * divs[0]);
            const w2 = Math.round(pos.width * divs[1]);
            const w3 = pos.width - w1 - w2;
            const split = divs[1] / ((divs[1] + divs[2]) || 1);
            const setDiv0 = (val) => {
              const d0 = +val;
              const rem = 1 - d0;
              const sp = divs[1] / ((divs[1] + divs[2]) || 1);
              update('divisions', [d0, sp * rem, (1 - sp) * rem]);
            };
            const setDiv1Split = (val) => {
              const rem = 1 - divs[0];
              update('divisions', [divs[0], +val * rem, (1 - +val) * rem]);
            };
            return (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                    Prva podjela: {w1} / {w2 + w3} mm
                  </label>
                  <input type="range" min="0.1" max="0.8" step="0.01"
                    value={divs[0]} onChange={e => setDiv0(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                    Druga podjela: {w2} / {w3} mm
                  </label>
                  <input type="range" min="0.1" max="0.9" step="0.01"
                    value={split} onChange={e => setDiv1Split(e.target.value)} className="w-full" />
                </div>
                <div className="text-[10px] text-stone-400" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
                  Š1 {w1} / Š2 {w2} / Š3 {w3} mm
                </div>
              </div>
            );
          })()}

          {/* Visina nadsvjetla */}
          {pos.type === 'transom' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Visina nadsvjetla (mm)</label>
              <input type="number" value={pos.transomHeight || 400} onChange={e => update('transomHeight', +e.target.value)} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
            </div>
          )}

          {/* Bočno svjetlo */}
          {pos.type === 'sideLight' && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Bočno svjetlo</label>
                <div className="flex gap-4">
                  {[['right', 'Desno'], ['left', 'Lijevo']].map(([v, label]) => (
                    <label key={v} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input type="radio" name={`sl-${pos.id}`} value={v}
                        checked={(pos.sideLightPosition || 'right') === v}
                        onChange={() => update('sideLightPosition', v)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Širina bočnog svjetla (mm)</label>
                <input type="number" value={pos.sideLightWidth || 500}
                  onChange={e => update('sideLightWidth', +e.target.value)}
                  min="300" max="1000"
                  className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
              </div>
            </div>
          )}

          {/* Visina panela */}
          {pos.type === 'panelCombo' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Visina panela (mm)</label>
              <input type="number" value={pos.panelHeight || 900} onChange={e => update('panelHeight', +e.target.value)}
                min="300" max="1500"
                className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
            </div>
          )}

          {/* Panel ulaznih vrata */}
          {pos.type === 'entryDoor' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Panel vrata</label>
              <div className="space-y-1">
                {[
                  ['fullPanel', 'Puni PVC panel'],
                  ['panelGlass', 'Panel + staklo'],
                  ['glassFull', 'Staklo cijelom visinom'],
                ].map(([v, label]) => (
                  <label key={v} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input type="radio" name={`dp-${pos.id}`} value={v}
                      checked={(pos.doorPanel || 'fullPanel') === v}
                      onChange={() => update('doorPanel', v)} />
                    {label}
                  </label>
                ))}
              </div>
              {(pos.doorPanel || 'fullPanel') === 'panelGlass' && (
                <div className="mt-2">
                  <label className="block text-xs text-stone-500 mb-1">Visina staklenog dijela (mm)</label>
                  <input type="number" value={pos.glassPanelHeight || 600}
                    onChange={e => update('glassPanelHeight', +e.target.value)}
                    className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                </div>
              )}
            </div>
          )}

          {/* Količina i cijena */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Količina</label>
              <input type="number" value={pos.quantity} onChange={e => update('quantity', +e.target.value)} min="1" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Cijena/kom</label>
              <input type="number" value={pos.unitPrice} onChange={e => update('unitPrice', +e.target.value)} step="0.01" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
            </div>
          </div>

          {/* Detalji */}
          <details className="text-xs">
            <summary className="cursor-pointer text-stone-500 uppercase tracking-wider">Detalji proizvoda (sistem, okov, staklo...)</summary>
            <div className="space-y-2 mt-2">
              <input value={pos.systemName} onChange={e => update('systemName', e.target.value)} placeholder="Sistem" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              <input value={pos.fitting} onChange={e => update('fitting', e.target.value)} placeholder="Okov" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              <input value={pos.color} onChange={e => update('color', e.target.value)} placeholder="Boja" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              <input value={pos.glass} onChange={e => update('glass', e.target.value)} placeholder="Staklo" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              <div className="grid grid-cols-2 gap-2">
                <input value={pos.frameProfile} onChange={e => update('frameProfile', e.target.value)} placeholder="Profil rama" className="px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                <input type="number" value={pos.frameDepth} onChange={e => update('frameDepth', +e.target.value)} placeholder="Dubina rama" className="px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                <input value={pos.sashProfile} onChange={e => update('sashProfile', e.target.value)} placeholder="Profil krila" className="px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                <input type="number" value={pos.sashDepth} onChange={e => update('sashDepth', +e.target.value)} placeholder="Dubina krila" className="px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
              </div>
              <textarea value={pos.accessories.join('\n')} onChange={e => update('accessories', e.target.value.split('\n').filter(Boolean))} placeholder="Dodatni profili / pribor (jedna stavka po liniji)" rows="3" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
            </div>
          </details>

          {/* Roletna */}
          <details className="text-xs">
            <summary className="cursor-pointer text-stone-500 uppercase tracking-wider">Roletna</summary>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={pos.hasShutter || false}
                  onChange={e => update('hasShutter', e.target.checked)} />
                Postavi roletnu
              </label>
              {pos.hasShutter && (<>
                <div>
                  <label className="block text-stone-400 mb-1">Visina kutije (mm)</label>
                  <input type="number" value={pos.shutterBoxHeight || 200}
                    onChange={e => update('shutterBoxHeight', +e.target.value)}
                    min="100" max="300" step="5"
                    className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                </div>
                <div className="flex gap-4">
                  {[['outside', 'Vanjska kutija'], ['inside', 'Unutarnja kutija']].map(([v, label]) => (
                    <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name={`sht-${pos.id}`} value={v}
                        checked={(pos.shutterBoxType || 'outside') === v}
                        onChange={() => update('shutterBoxType', v)} />
                      {label}
                    </label>
                  ))}
                </div>
                <select value={pos.shutterControl || 'belt'}
                  onChange={e => update('shutterControl', e.target.value)}
                  className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }}>
                  <option value="belt">Upravljanje: Traka (gurtna)</option>
                  <option value="crank">Upravljanje: Ručica</option>
                  <option value="motor">Upravljanje: Motor</option>
                </select>
              </>)}
            </div>
          </details>

          {/* Mreža protiv insekata */}
          <details className="text-xs">
            <summary className="cursor-pointer text-stone-500 uppercase tracking-wider">Mreža protiv insekata</summary>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={pos.hasMosquitoNet || false}
                  onChange={e => update('hasMosquitoNet', e.target.checked)} />
                Postavi mrežu
              </label>
              {pos.hasMosquitoNet && (
                <select value={pos.mosquitoNetType || 'harmo'}
                  onChange={e => update('mosquitoNetType', e.target.value)}
                  className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }}>
                  <option value="harmo">Harmo (plisirana)</option>
                  <option value="roller">Roletna mreža</option>
                  <option value="fixed">Fiksna mreža</option>
                </select>
              )}
            </div>
          </details>

          {/* Akcije */}
          <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: '#e5e5e0' }}>
            <button onClick={onDuplicate} className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2 py-1">
              <Copy size={12} /> Dupliciraj
            </button>
            <button onClick={onDelete} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 px-2 py-1">
              <Trash2 size={12} /> Obriši
            </button>
            {showSaveTpl ? (
              <div className="flex items-center gap-1 w-full mt-1">
                <input autoFocus value={tplName} onChange={e => setTplName(e.target.value)}
                  placeholder="Ime template-a"
                  className="flex-1 px-2 py-1 border text-xs" style={{ borderColor: '#d4d4cf' }} />
                <button onClick={() => { if (tplName.trim()) { saveTemplate(tplName.trim(), pos); } setShowSaveTpl(false); setTplName(''); }}
                  className="text-xs px-2 py-1 text-white" style={{ background: '#1f3a5f' }}>OK</button>
                <button onClick={() => { setShowSaveTpl(false); setTplName(''); }}
                  className="text-xs px-2 py-1 text-stone-400">✕</button>
              </div>
            ) : (
              <button onClick={() => { setTplName(`${getElementName(pos.type, lang)} ${pos.width}×${pos.height}`); setShowSaveTpl(true); }}
                className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2 py-1">
                <FileText size={12} /> Template
              </button>
            )}
            <div className="ml-auto flex gap-1">
              <button onClick={onMoveUp} className="text-xs px-2 py-1 text-stone-500 hover:text-stone-900">↑</button>
              <button onClick={onMoveDown} className="text-xs px-2 py-1 text-stone-500 hover:text-stone-900">↓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
