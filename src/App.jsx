import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Copy, Printer, FileText, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

// ===== PRIJEVODI ZA DOKUMENT (PDF izlaz) =====
const T = {
  bs: {
    quoteTitle: "Ponuda",
    quoteNumber: "Ponuda Br.",
    date: "Datum",
    validUntil: "Ponuda važi do",
    customer: "Kupac",
    intro: `Zahvaljujemo vam na interesovanju za našu liniju proizvoda izrađenih od visokokvalitetnih PVC profila „Deceuninck".

Naša PVC stolarija proizvodi se od profila klase A, koje razvija i proizvodi Deceuninck, jedan od vodećih i tehnološki najnaprednijih proizvođača u Njemačkoj. Svi profili su dodatno ojačani pocinčanim čeličnim elementima, čime se osigurava izuzetna stabilnost, dugotrajnost i otpornost konstrukcije.

Za izradu naših prozora i vrata koristimo okove renomiranih njemačkih proizvođača „ROTO" i „Siegenia", poznatih po pouzdanosti, funkcionalnosti i dugom vijeku trajanja.`,
    pos: "Poz.", qty: "Kol.", desc: "Opis", uPrice: "Cijena", lTotal: "Ukupno",
    system: "Sistem", element: "Element", dims: "Građevinske dimenzije",
    fitting: "Okov", color: "Boja", opening: "Otvaranje", glass: "Staklo",
    frameProf: "Profil rama", sashProf: "Profil krila", accessories: "Dodatni profili / pribor",
    notesTitle: "NAPOMENE",
    notes: [
      "Ponuda se odnosi na standardnu boju: unutrašnja strana bijela, vanjska strana antracit.",
      "Isporuka i montaža su uključene u cijenu.",
      "Demontaža i odvoz starih elemenata nisu uključeni u ponudu.",
      "Zadržavamo pravo na izmjene.",
      "Dodatni ili naknadno naručeni radovi naplaćuju se posebno. Pismena potvrda narudžbe je obavezna.",
      "Rok isporuke: približno 4–5 sedmica nakon usaglašavanja svih tehničkih detalja."
    ],
    paymentT: "Uslovi plaćanja",
    pay70: "70 % avansno plaćanje",
    pay30: "30 % pri isporuci robe",
    net: "Neto", vat: "PDV (17%)", gross: "Bruto",
    montage: "Montaža", transport: "Transport", yes: "Da",
    deliveryT: "Uslovi isporuke", payMethod: "Način plaćanja", cash: "Gotovinski",
    pieces: "kom", width: "širina", height: "visina",
    frameDepth: "dubina rama", sashDepth: "dubina krila",
    closing: "Nadamo se da naša ponuda ispunjava vaša očekivanja. Radujemo se mogućnosti realizacije vaše narudžbe.",
    regards: "S poštovanjem,",
  },
  de: {
    quoteTitle: "Angebot",
    quoteNumber: "Angebot Nr.",
    date: "Datum",
    validUntil: "Angebot gültig bis",
    customer: "Kunde",
    intro: `Vielen Dank für Ihr Interesse an unserer Produktlinie aus hochwertigen PVC-Profilen „Deceuninck".

Unsere PVC-Fenster und -Türen werden aus Profilen der Klasse A gefertigt, die von Deceuninck, einem der führenden und technologisch fortschrittlichsten Hersteller in Deutschland, entwickelt und produziert werden. Alle Profile sind zusätzlich mit verzinkten Stahlelementen verstärkt, was außergewöhnliche Stabilität, Langlebigkeit und Widerstandsfähigkeit gewährleistet.

Für unsere Fenster und Türen verwenden wir Beschläge der renommierten deutschen Hersteller „ROTO" und „Siegenia", bekannt für Zuverlässigkeit, Funktionalität und lange Lebensdauer.`,
    pos: "Pos.", qty: "Menge", desc: "Beschreibung", uPrice: "Einzelpreis", lTotal: "Gesamt",
    system: "System", element: "Element", dims: "Bauabmessungen",
    fitting: "Beschlag", color: "Farbe", opening: "Öffnung", glass: "Glas",
    frameProf: "Rahmenprofil", sashProf: "Flügelprofil", accessories: "Zusätzliche Profile / Zubehör",
    notesTitle: "ANMERKUNGEN",
    notes: [
      "Das Angebot gilt für die Standardfarbe: Innen weiß, Außen anthrazit.",
      "Lieferung und Montage sind im Preis enthalten.",
      "Demontage und Entsorgung der alten Elemente sind nicht im Angebot enthalten.",
      "Änderungen vorbehalten.",
      "Zusätzliche oder nachträglich bestellte Arbeiten werden separat berechnet. Eine schriftliche Auftragsbestätigung ist erforderlich.",
      "Lieferzeit: ca. 4–5 Wochen nach Abstimmung aller technischen Details."
    ],
    paymentT: "Zahlungsbedingungen",
    pay70: "70 % Anzahlung",
    pay30: "30 % bei Lieferung",
    net: "Netto", vat: "MwSt. (17%)", gross: "Brutto",
    montage: "Montage", transport: "Transport", yes: "Ja",
    deliveryT: "Lieferbedingungen", payMethod: "Zahlungsart", cash: "Bar",
    pieces: "Stk.", width: "Breite", height: "Höhe",
    frameDepth: "Rahmentiefe", sashDepth: "Flügeltiefe",
    closing: "Wir hoffen, dass unser Angebot Ihren Erwartungen entspricht und freuen uns auf Ihren Auftrag.",
    regards: "Mit freundlichen Grüßen,",
  }
};

// Otvaranje - prijevodi za PDF
const OPENING_LABEL = {
  bs: {
    fixed: "Fiksno",
    leftTT: "Lijevo (kip+otv)",
    rightTT: "Desno (kip+otv)",
    bothTT: "Lijevo-desno (kip oba)",
    tilt: "Samo kip",
    leftSlide: "Klizno lijevo",
    rightSlide: "Klizno desno"
  },
  de: {
    fixed: "Fest",
    leftTT: "Links (Dreh-Kipp)",
    rightTT: "Rechts (Dreh-Kipp)",
    bothTT: "Links-Rechts (beide Dreh-Kipp)",
    tilt: "Nur Kipp",
    leftSlide: "Schiebe links",
    rightSlide: "Schiebe rechts"
  }
};

// ===== TIPOVI ELEMENATA - templates =====
const ELEMENT_TYPES = [
  { id: 'single', name: 'Jednokrilni prozor', nameDe: 'Einflügeliges Fenster' },
  { id: 'double', name: 'Dvokrilni prozor', nameDe: 'Zweiflügeliges Fenster' },
  { id: 'door', name: 'Balkonska vrata', nameDe: 'Balkontür' },
  { id: 'windowDoor', name: 'Prozor + balkonska vrata', nameDe: 'Fenster + Balkontür' },
  { id: 'sliding', name: 'Klizna stijena', nameDe: 'Schiebewand' },
  { id: 'fixed', name: 'Fiksni element', nameDe: 'Festelement' },
  { id: 'transom', name: 'Prozor sa nadsvjetlom', nameDe: 'Fenster mit Oberlicht' },
];

// Default vrijednosti za novu poziciju (najčešći case za 80% ponuda)
const newPosition = (type = 'single') => {
  const base = {
    id: crypto.randomUUID(),
    type,
    width: 1200,
    height: 1500,
    quantity: 1,
    unitPrice: 0,
    color: "bijela / antracit",
    glass: "troslojno, 44 mm (4/16/4/18/4) LOW-E Argon (Ug = 0,6)",
    fitting: "Siegenia Titan AF RC 2",
    frameProfile: "88172",
    frameDepth: 76,
    sashProfile: "88271",
    sashDepth: 78,
    accessories: ["Zaštita od insekata: (sistem Harmo)"],
    systemName: "Deceuninck Elegant 76 MD ili ekvivalentan model",
    customDescription: ""
  };
  switch (type) {
    case 'single': return { ...base, opening: 'rightTT' };
    case 'double': return { ...base, width: 1500, opening: 'bothTT', divisionRatio: 0.5 };
    case 'door': return { ...base, width: 900, height: 2100, opening: 'rightTT' };
    case 'windowDoor': return { ...base, width: 1800, height: 2100, opening: 'rightTT', divisionRatio: 0.6 };
    case 'sliding': return { ...base, width: 3000, height: 2400, opening: 'rightSlide', divisionRatio: 0.5, sashDepth: 104 };
    case 'fixed': return { ...base, opening: 'fixed' };
    case 'transom': return { ...base, height: 1800, opening: 'rightTT', transomHeight: 400 };
    default: return base;
  }
};

// ===== SVG CRTEŽ PROZORA =====
// Ovo je srž aplikacije - automatski generiše tehnički crtež s kotama
function WindowDrawing({ pos, size = 360 }) {
  const PAD_LEFT = 60, PAD_RIGHT = 30, PAD_TOP = 20, PAD_BOTTOM = 50;
  const drawW = size - PAD_LEFT - PAD_RIGHT;
  const drawH = size - PAD_TOP - PAD_BOTTOM;

  // Skalira na ono što više stane
  const scale = Math.min(drawW / pos.width, drawH / pos.height);
  const w = pos.width * scale;
  const h = pos.height * scale;
  const x0 = PAD_LEFT + (drawW - w) / 2;
  const y0 = PAD_TOP + (drawH - h) / 2;

  // Debljina rama u skali (70mm stvarno)
  const FRAME_MM = 70;
  const f = FRAME_MM * scale;

  // === Funkcije za crtanje simbola otvaranja ===
  // Konvencija: simbol pokazuje šarke (vrh trougla = strana šarki)
  const openingSymbol = (cx, cy, panelW, panelH, opening) => {
    if (opening === 'fixed') return null;
    const lines = [];
    const innerL = cx - panelW / 2;
    const innerR = cx + panelW / 2;
    const innerT = cy - panelH / 2;
    const innerB = cy + panelH / 2;

    // Lijevo otv (šarka lijevo): linije od top-desno i bottom-desno → mid-lijevo
    if (opening === 'leftTT') {
      lines.push(`M ${innerR} ${innerT} L ${innerL} ${cy} L ${innerR} ${innerB}`);
      // kip: linije od top-lijevo i top-desno → bottom-mid (apex prema dolje = kip ima šarke gore? - konvencija varira; koristimo apex bottom-mid)
      lines.push(`M ${innerL} ${innerT} L ${cx} ${innerB} L ${innerR} ${innerT}`);
    } else if (opening === 'rightTT') {
      lines.push(`M ${innerL} ${innerT} L ${innerR} ${cy} L ${innerL} ${innerB}`);
      lines.push(`M ${innerL} ${innerT} L ${cx} ${innerB} L ${innerR} ${innerT}`);
    } else if (opening === 'tilt') {
      lines.push(`M ${innerL} ${innerT} L ${cx} ${innerB} L ${innerR} ${innerT}`);
    }
    return lines;
  };

  // === Crtanje krila (panel) sa simbolom ===
  const drawSash = (panelX, panelY, panelW, panelH, opening, key, isSlide = false) => {
    const sashF = 50 * scale; // krilo ima profil ~50mm
    const innerX = panelX + sashF;
    const innerY = panelY + sashF;
    const innerW = panelW - 2 * sashF;
    const innerH = panelH - 2 * sashF;
    const cx = panelX + panelW / 2;
    const cy = panelY + panelH / 2;
    const symbols = openingSymbol(cx, cy, innerW * 0.85, innerH * 0.85, opening);

    return (
      <g key={key}>
        {/* okvir krila */}
        <rect x={panelX} y={panelY} width={panelW} height={panelH} fill="none" stroke="#1a1a1a" strokeWidth="0.7" />
        <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="#dbeafe" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.8" />
        {/* ručka */}
        {!isSlide && opening !== 'fixed' && opening !== 'tilt' && (
          <circle
            cx={opening === 'leftTT' ? panelX + panelW - sashF / 2 : panelX + sashF / 2}
            cy={cy}
            r="2.5"
            fill="#1a1a1a"
          />
        )}
        {/* simboli otvaranja */}
        {symbols && symbols.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
        ))}
        {/* strelica za klizno */}
        {isSlide && opening === 'leftSlide' && (
          <g stroke="#1a1a1a" strokeWidth="1" fill="none">
            <line x1={cx + 15} y1={cy} x2={cx - 15} y2={cy} />
            <polyline points={`${cx - 10},${cy - 4} ${cx - 15},${cy} ${cx - 10},${cy + 4}`} />
          </g>
        )}
        {isSlide && opening === 'rightSlide' && (
          <g stroke="#1a1a1a" strokeWidth="1" fill="none">
            <line x1={cx - 15} y1={cy} x2={cx + 15} y2={cy} />
            <polyline points={`${cx + 10},${cy - 4} ${cx + 15},${cy} ${cx + 10},${cy + 4}`} />
          </g>
        )}
      </g>
    );
  };

  // === Sastavljanje na osnovu tipa ===
  const elements = [];
  // vanjski ram
  elements.push(
    <rect key="frame" x={x0} y={y0} width={w} height={h} fill="white" stroke="#1a1a1a" strokeWidth="1.2" />
  );
  // unutarnji rub rama
  elements.push(
    <rect key="frame-in" x={x0 + f} y={y0 + f} width={w - 2 * f} height={h - 2 * f} fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
  );

  const innerW = w - 2 * f;
  const innerH = h - 2 * f;
  const innerX = x0 + f;
  const innerY = y0 + f;

  if (pos.type === 'single' || pos.type === 'door' || pos.type === 'fixed') {
    elements.push(drawSash(innerX, innerY, innerW, innerH, pos.opening, 'panel'));
  } else if (pos.type === 'double') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    elements.push(drawSash(innerX, innerY, w1, innerH, 'leftTT', 'p1'));
    elements.push(drawSash(innerX + w1, innerY, w2, innerH, 'rightTT', 'p2'));
  } else if (pos.type === 'windowDoor') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    elements.push(drawSash(innerX, innerY, w1, innerH, 'leftTT', 'p1'));
    elements.push(drawSash(innerX + w1, innerY, w2, innerH, pos.opening, 'p2'));
  } else if (pos.type === 'sliding') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    if (pos.opening === 'leftSlide') {
      elements.push(drawSash(innerX, innerY, w1, innerH, 'leftSlide', 'p1', true));
      elements.push(drawSash(innerX + w1, innerY, w2, innerH, 'fixed', 'p2'));
    } else {
      elements.push(drawSash(innerX, innerY, w1, innerH, 'fixed', 'p1'));
      elements.push(drawSash(innerX + w1, innerY, w2, innerH, 'rightSlide', 'p2', true));
    }
  } else if (pos.type === 'transom') {
    const tH = (pos.transomHeight || 400) * scale;
    elements.push(
      <line key="trans" x1={innerX} y1={innerY + tH} x2={innerX + innerW} y2={innerY + tH} stroke="#1a1a1a" strokeWidth="0.7" />
    );
    elements.push(drawSash(innerX, innerY, innerW, tH, 'fixed', 'tr-top'));
    elements.push(drawSash(innerX, innerY + tH, innerW, innerH - tH, pos.opening, 'tr-bot'));
  }

  // === Mjerne linije (kote) ===
  const dimX = x0 + w / 2;
  const dimY = y0 + h / 2;
  const dimOffsetX = 32; // pomak kote od crteža
  const dimOffsetY = 28;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: '10px' }}>
      {/* drawing */}
      {elements}

      {/* horizontalna kota (širina) */}
      <g stroke="#1a1a1a" strokeWidth="0.4">
        <line x1={x0} y1={y0 + h + dimOffsetY - 6} x2={x0} y2={y0 + h + dimOffsetY + 6} />
        <line x1={x0 + w} y1={y0 + h + dimOffsetY - 6} x2={x0 + w} y2={y0 + h + dimOffsetY + 6} />
        <line x1={x0} y1={y0 + h + dimOffsetY} x2={x0 + w} y2={y0 + h + dimOffsetY} />
        <polygon points={`${x0},${y0 + h + dimOffsetY} ${x0 + 5},${y0 + h + dimOffsetY - 2} ${x0 + 5},${y0 + h + dimOffsetY + 2}`} fill="#1a1a1a" />
        <polygon points={`${x0 + w},${y0 + h + dimOffsetY} ${x0 + w - 5},${y0 + h + dimOffsetY - 2} ${x0 + w - 5},${y0 + h + dimOffsetY + 2}`} fill="#1a1a1a" />
      </g>
      <text x={x0 + w / 2} y={y0 + h + dimOffsetY + 14} textAnchor="middle" fill="#1a1a1a">{pos.width}</text>

      {/* vertikalna kota (visina) */}
      <g stroke="#1a1a1a" strokeWidth="0.4">
        <line x1={x0 - dimOffsetX - 6} y1={y0} x2={x0 - dimOffsetX + 6} y2={y0} />
        <line x1={x0 - dimOffsetX - 6} y1={y0 + h} x2={x0 - dimOffsetX + 6} y2={y0 + h} />
        <line x1={x0 - dimOffsetX} y1={y0} x2={x0 - dimOffsetX} y2={y0 + h} />
        <polygon points={`${x0 - dimOffsetX},${y0} ${x0 - dimOffsetX - 2},${y0 + 5} ${x0 - dimOffsetX + 2},${y0 + 5}`} fill="#1a1a1a" />
        <polygon points={`${x0 - dimOffsetX},${y0 + h} ${x0 - dimOffsetX - 2},${y0 + h - 5} ${x0 - dimOffsetX + 2},${y0 + h - 5}`} fill="#1a1a1a" />
      </g>
      <text x={x0 - dimOffsetX - 8} y={y0 + h / 2} textAnchor="middle" fill="#1a1a1a" transform={`rotate(-90, ${x0 - dimOffsetX - 8}, ${y0 + h / 2})`}>{pos.height}</text>

      {/* sub-kote za podjelu (dvokrilni / klizna / windowDoor) */}
      {(pos.type === 'double' || pos.type === 'sliding' || pos.type === 'windowDoor') && (() => {
        const ratio = pos.divisionRatio || 0.5;
        const w1mm = Math.round(pos.width * ratio);
        const w2mm = pos.width - w1mm;
        const subY = y0 + h + dimOffsetY - 16;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={x0} y1={subY - 6} x2={x0} y2={subY + 2} />
            <line x1={x0 + w * ratio} y1={subY - 6} x2={x0 + w * ratio} y2={subY + 2} />
            <line x1={x0 + w} y1={subY - 6} x2={x0 + w} y2={subY + 2} />
            <text x={x0 + (w * ratio) / 2} y={subY} textAnchor="middle" fontSize="8">{w1mm}</text>
            <text x={x0 + w * ratio + (w - w * ratio) / 2} y={subY} textAnchor="middle" fontSize="8">{w2mm}</text>
          </g>
        );
      })()}

      {/* sub-kota za nadsvjetlo */}
      {pos.type === 'transom' && (() => {
        const tH = pos.transomHeight || 400;
        const subX = x0 - dimOffsetX + 14;
        const tHscaled = tH * scale;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={subX - 4} y1={y0 + f} x2={subX + 2} y2={y0 + f} />
            <line x1={subX - 4} y1={y0 + f + tHscaled} x2={subX + 2} y2={y0 + f + tHscaled} />
            <text x={subX - 2} y={y0 + f + tHscaled / 2 + 3} textAnchor="end" fontSize="8">{tH}</text>
            <text x={subX - 2} y={y0 + f + tHscaled + (h - 2 * f - tHscaled) / 2 + 3} textAnchor="end" fontSize="8">{Math.round((pos.height - 2 * 70 - tH))}</text>
          </g>
        );
      })()}
    </svg>
  );
}

// ===== POMOĆNE FUNKCIJE =====
const fmt = (num, currency) => {
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
  return `${formatted} ${currency}`;
};

const getElementName = (type, lang) => {
  const t = ELEMENT_TYPES.find(e => e.id === type);
  return t ? (lang === 'de' ? t.nameDe : t.name) : type;
};

// ===== EDITOR ZA POJEDINAČNU POZICIJU =====
function PositionEditor({ pos, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, expanded, onToggle, index, lang }) {
  const update = (field, val) => onChange({ ...pos, [field]: val });
  const t = T[lang];

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
        <div className="w-20 h-20 shrink-0 bg-stone-50 border" style={{ borderColor: '#e5e5e0' }}>
          <WindowDrawing pos={pos} size={80} />
        </div>
        {expanded ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
      </div>

      {expanded && (
        <div className="p-4 border-t space-y-3" style={{ borderColor: '#e5e5e0' }}>
          {/* Tip */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Tip elementa</label>
            <select value={pos.type} onChange={e => onChange({ ...newPosition(e.target.value), id: pos.id, quantity: pos.quantity, unitPrice: pos.unitPrice })} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }}>
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
            </div>
          </div>

          {/* Otvaranje */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Otvaranje</label>
            <select value={pos.opening} onChange={e => update('opening', e.target.value)} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }}>
              {pos.type === 'sliding' ? (
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
                  <option value="fixed">Fiksno</option>
                </>
              )}
            </select>
          </div>

          {/* Podjela (ako ima 2 panela) */}
          {(pos.type === 'double' || pos.type === 'sliding' || pos.type === 'windowDoor') && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                Podjela: {Math.round(pos.width * (pos.divisionRatio || 0.5))} / {pos.width - Math.round(pos.width * (pos.divisionRatio || 0.5))} mm
              </label>
              <input type="range" min="0.2" max="0.8" step="0.01" value={pos.divisionRatio || 0.5} onChange={e => update('divisionRatio', +e.target.value)} className="w-full" />
            </div>
          )}

          {/* Visina nadsvjetla */}
          {pos.type === 'transom' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Visina nadsvjetla (mm)</label>
              <input type="number" value={pos.transomHeight || 400} onChange={e => update('transomHeight', +e.target.value)} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
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

          {/* Akcije */}
          <div className="flex gap-2 pt-2 border-t" style={{ borderColor: '#e5e5e0' }}>
            <button onClick={onDuplicate} className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2 py-1">
              <Copy size={12} /> Dupliciraj
            </button>
            <button onClick={onDelete} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 px-2 py-1">
              <Trash2 size={12} /> Obriši
            </button>
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

// ===== PDF PREVIEW (sve što ide u štampu) =====
function PdfPreview({ doc, lang, currency, showPrices }) {
  const t = T[lang];
  const opLabel = OPENING_LABEL[lang];

  const totalNet = useMemo(
    () => doc.positions.reduce((s, p) => s + (p.unitPrice || 0) * (p.quantity || 1), 0),
    [doc.positions]
  );
  const explicitNet = doc.netOverride && doc.netOverride > 0 ? doc.netOverride : null;
  const finalNet = explicitNet || totalNet;
  const vat = finalNet * 0.17;
  const gross = finalNet + vat;

  return (
    <div id="pdf-area" style={{ fontFamily: 'Geist, system-ui, sans-serif', color: '#1a1a1a', background: 'white' }} className="text-[11px] leading-relaxed">
      {/* HEADER STRANICA 1 */}
      <div className="px-12 pt-12 pb-8 print-page">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="w-20 h-20 mb-2 flex items-center justify-center" style={{ background: '#1f3a5f' }}>
              <span style={{ color: 'white', fontFamily: 'Instrument Serif, serif', fontSize: '32px' }}>N</span>
            </div>
            <div className="text-[9px] tracking-[0.25em] font-semibold" style={{ color: '#1f3a5f' }}>NEOPROM ENGINEERING</div>
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

      {/* POZICIJE - svaka 2-3 po stranici */}
      <div className="px-12 py-8 print-page">
        <div className="flex justify-between items-baseline mb-4 pb-2 border-b-2" style={{ borderColor: '#1a1a1a' }}>
          <div className="grid grid-cols-12 gap-2 w-full text-[9px] uppercase tracking-wider text-stone-500">
            <div className="col-span-1">{t.pos}</div>
            <div className="col-span-1">{t.qty}</div>
            <div className="col-span-6">{t.desc}</div>
            {showPrices && <div className="col-span-2 text-right">{t.uPrice}</div>}
            {showPrices && <div className="col-span-2 text-right">{t.lTotal}</div>}
            {!showPrices && <div className="col-span-4"></div>}
          </div>
        </div>

        {doc.positions.map((p, i) => (
          <div key={p.id} className="flex gap-4 py-4 border-b avoid-break" style={{ borderColor: '#e5e5e0' }}>
            <div className="w-12 shrink-0">
              <div className="text-2xl font-medium" style={{ fontFamily: 'Instrument Serif, serif' }}>{i + 1}</div>
            </div>
            <div className="w-32 shrink-0">
              <div className="aspect-square">
                <WindowDrawing pos={p} size={130} />
              </div>
            </div>
            <div className="flex-1 text-[10px] leading-relaxed">
              <div><span className="font-semibold">{t.system}:</span> {p.systemName}</div>
              <div><span className="font-semibold">{t.element}:</span> {getElementName(p.type, lang)}</div>
              <div><span className="font-semibold">{t.dims}:</span> {t.width} {p.width} mm × {t.height} {p.height} mm</div>
              <div><span className="font-semibold">{t.fitting}:</span> {p.fitting}</div>
              <div><span className="font-semibold">{t.color}:</span> {p.color}</div>
              <div><span className="font-semibold">{t.opening}:</span> {opLabel[p.opening] || p.opening}</div>
              <div><span className="font-semibold">{t.glass}:</span> {p.glass}</div>
              <div><span className="font-semibold">{t.frameProf}:</span> {p.frameProfile}, {t.frameDepth} {p.frameDepth} mm</div>
              <div><span className="font-semibold">{t.sashProf}:</span> {p.sashProfile}, {t.sashDepth} {p.sashDepth} mm</div>
              {p.accessories.length > 0 && (
                <div className="mt-1.5">
                  <div className="font-semibold">{t.accessories}:</div>
                  <ul className="ml-3">
                    {p.accessories.map((a, idx) => <li key={idx}>· {a}</li>)}
                  </ul>
                </div>
              )}
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
          {t.notes.map((n, i) => <li key={i}>· {n}</li>)}
        </ul>

        <div className="text-sm font-semibold mb-2">{t.paymentT}:</div>
        <ul className="space-y-1 text-[10px] mb-6">
          <li>· {t.pay70}</li>
          <li>· {t.pay30}</li>
        </ul>

        <div className="text-[10px] text-stone-600 mb-8 italic">{t.closing}</div>

        {/* TOTALI */}
        <div className="border-t-2 pt-4" style={{ borderColor: '#1a1a1a' }}>
          <div className="flex justify-between items-end">
            <div className="text-[10px] space-y-1">
              <div><span className="font-semibold">{t.montage}:</span> {t.yes}</div>
              <div><span className="font-semibold">{t.transport}:</span> {t.yes}</div>
              <div><span className="font-semibold">{t.deliveryT}:</span> Franco Bugojno</div>
              <div><span className="font-semibold">{t.payMethod}:</span> {t.cash}</div>
            </div>
            <div className="text-right">
              <table style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }} className="text-[11px]">
                <tbody>
                  <tr><td className="pr-6 text-stone-600">{t.net}:</td><td className="text-right">{fmt(finalNet, currency)}</td></tr>
                  <tr><td className="pr-6 text-stone-600">{t.vat}:</td><td className="text-right">{fmt(vat, currency)}</td></tr>
                  <tr className="text-base font-semibold border-t" style={{ borderColor: '#1a1a1a' }}><td className="pr-6 pt-1">{t.gross}:</td><td className="text-right pt-1">{fmt(gross, currency)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== GLAVNA APLIKACIJA =====
export default function App() {
  const [doc, setDoc] = useState({
    number: `${new Date().getFullYear()}-0001`,
    date: new Date().toLocaleDateString('de-DE'),
    customer: { name: 'Dr. Kemal Karabeg', address: 'Nugle II 4B/12\n70230 Bugojno' },
    positions: [
      { ...newPosition('double'), width: 1500, height: 1200, quantity: 2, unitPrice: 480 },
      { ...newPosition('windowDoor'), width: 1800, height: 2100, quantity: 1, unitPrice: 950 },
      { ...newPosition('single'), width: 800, height: 1400, quantity: 3, unitPrice: 320 },
    ],
    netOverride: 0
  });
  const [lang, setLang] = useState('bs');
  const [currency, setCurrency] = useState('KM');
  const [showPrices, setShowPrices] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [view, setView] = useState('split'); // 'split' | 'preview'

  const updatePos = (id, newPos) => {
    setDoc({ ...doc, positions: doc.positions.map(p => p.id === id ? newPos : p) });
  };

  const addPos = (type) => {
    setDoc({ ...doc, positions: [...doc.positions, newPosition(type)] });
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
        body { background: #f5f5f0; }
      `}</style>

      <div className="min-h-screen" style={{ background: '#fafaf7', fontFamily: 'Geist, system-ui, sans-serif', color: '#1a1a1a' }}>
        {/* TOP BAR - hidden in print */}
        <div className="border-b sticky top-0 z-10" style={{ background: '#fafaf7', borderColor: '#e5e5e0', printColorAdjust: 'exact' }}>
          <div className="px-6 py-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7" style={{ background: '#1f3a5f' }}></div>
              <div className="font-medium tracking-tight">Generator ponuda <span className="text-stone-400 text-xs ml-1">v0.1</span></div>
            </div>
            <div className="h-5 w-px bg-stone-300 mx-1"></div>

            {/* Jezik */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-stone-500 mr-1">Jezik:</span>
              {['bs', 'de'].map(l => (
                <button key={l} onClick={() => setLang(l)} className="px-2 py-1 uppercase tracking-wider" style={{ background: lang === l ? '#1f3a5f' : 'transparent', color: lang === l ? 'white' : '#6b6b6b' }}>{l}</button>
              ))}
            </div>

            {/* Valuta */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-stone-500 mr-1">Valuta:</span>
              {['KM', 'EUR'].map(c => (
                <button key={c} onClick={() => setCurrency(c)} className="px-2 py-1" style={{ background: currency === c ? '#1f3a5f' : 'transparent', color: currency === c ? 'white' : '#6b6b6b' }}>{c}</button>
              ))}
            </div>

            {/* Cijene */}
            <button onClick={() => setShowPrices(!showPrices)} className="flex items-center gap-1.5 text-xs px-2 py-1 border" style={{ borderColor: '#d4d4cf', color: showPrices ? '#1f3a5f' : '#6b6b6b' }}>
              {showPrices ? <Eye size={13} /> : <EyeOff size={13} />}
              Cijene po poziciji
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setView(view === 'split' ? 'preview' : 'split')} className="text-xs px-3 py-1.5 border" style={{ borderColor: '#d4d4cf' }}>
                {view === 'split' ? 'Samo preview' : 'Editor + preview'}
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-white" style={{ background: '#1f3a5f' }}>
                <Printer size={13} /> Štampaj / PDF
              </button>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className={view === 'split' ? "grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 p-6" : "p-6"}>

          {/* EDITOR PANEL */}
          {view === 'split' && (
            <div className="space-y-4">
              {/* Header info */}
              <div className="bg-white border p-4" style={{ borderColor: '#e5e5e0' }}>
                <div className="text-xs uppercase tracking-wider text-stone-500 mb-3">Podaci o ponudi</div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Broj ponude</label>
                      <input value={doc.number} onChange={e => setDoc({ ...doc, number: e.target.value })} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Datum</label>
                      <input value={doc.date} onChange={e => setDoc({ ...doc, date: e.target.value })} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Kupac</label>
                    <input value={doc.customer.name} onChange={e => setDoc({ ...doc, customer: { ...doc.customer, name: e.target.value } })} className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Adresa</label>
                    <textarea value={doc.customer.address} onChange={e => setDoc({ ...doc, customer: { ...doc.customer, address: e.target.value } })} rows="2" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
                  </div>
                </div>
              </div>

              {/* Pozicije */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase tracking-wider text-stone-500">Pozicije ({doc.positions.length})</div>
                  <div className="relative">
                    <button onClick={() => setShowAddMenu(!showAddMenu)} className="flex items-center gap-1 text-xs px-2 py-1 text-white" style={{ background: '#1f3a5f' }}>
                      <Plus size={12} /> Dodaj
                    </button>
                    {showAddMenu && (
                      <div className="absolute right-0 top-full mt-1 bg-white border shadow-lg z-20" style={{ borderColor: '#d4d4cf' }}>
                        {ELEMENT_TYPES.map(t => (
                          <button key={t.id} onClick={() => addPos(t.id)} className="block w-full text-left px-3 py-2 text-xs hover:bg-stone-50 whitespace-nowrap">{t.name}</button>
                        ))}
                      </div>
                    )}
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
              <div className="bg-white border p-4" style={{ borderColor: '#e5e5e0' }}>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Neto override (ostavi prazno za auto)</label>
                <input type="number" value={doc.netOverride || ''} onChange={e => setDoc({ ...doc, netOverride: +e.target.value })} placeholder="Auto-zbroj iz pozicija" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
              </div>
            </div>
          )}

          {/* PREVIEW PANEL */}
          <div className="bg-stone-200 p-4 lg:p-8 overflow-auto">
            <div className="mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm', background: 'white' }}>
              <PdfPreview doc={doc} lang={lang} currency={currency} showPrices={showPrices} />
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-stone-400 py-4 border-t" style={{ borderColor: '#e5e5e0' }}>
          Demo · Neoprom Engineering · Generator ponuda v0.1
        </div>
      </div>
    </>
  );
}
