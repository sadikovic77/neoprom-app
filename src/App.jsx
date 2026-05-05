import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Trash2, Copy, Printer, FileText, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import CustomersManager from './CustomersManager';
import { getCustomers, saveCustomer } from './utils/customers';

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
    net: "Neto", vat: (r) => `PDV (${r}%)`, gross: "Bruto", total: "Ukupno",
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
    net: "Netto", vat: (r) => `MwSt. (${r}%)`, gross: "Brutto", total: "Gesamt",
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
    rightSlide: "Klizno desno",
    leftOpen: "Lijevo (samo otv)",
    rightOpen: "Desno (samo otv)",
    bottomHung: "Donja kip",
    topHung: "Gornja kip (padajući)"
  },
  de: {
    fixed: "Fest",
    leftTT: "Links (Dreh-Kipp)",
    rightTT: "Rechts (Dreh-Kipp)",
    bothTT: "Links-Rechts (beide Dreh-Kipp)",
    tilt: "Nur Kipp",
    leftSlide: "Schiebe links",
    rightSlide: "Schiebe rechts",
    leftOpen: "Links (nur Drehen)",
    rightOpen: "Rechts (nur Drehen)",
    bottomHung: "Klappöffnung unten",
    topHung: "Klappöffnung oben"
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
  { id: 'triple', name: 'Trokrilni prozor', nameDe: 'Dreiflügeliges Fenster' },
  { id: 'doubleDoor', name: 'Dvokrilna balkonska vrata', nameDe: 'Zweiflügelige Balkontür' },
  { id: 'entryDoor', name: 'Ulazna vrata', nameDe: 'Eingangstür' },
  { id: 'sliding3', name: 'Klizna stijena 3-djelna', nameDe: 'Schiebewand 3-teilig' },
  { id: 'panelCombo', name: 'Kombinovani panel', nameDe: 'Kombi-Element mit Paneel' },
  { id: 'sideLight', name: 'Prozor sa bočnim svjetlom', nameDe: 'Fenster mit Seitenteil' },
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
    customDescription: "",
    hasShutter: false,
    shutterBoxHeight: 200,
    shutterBoxType: 'outside',
    shutterControl: 'belt',
    hasMosquitoNet: false,
    mosquitoNetType: 'harmo',
  };
  switch (type) {
    case 'single': return { ...base, opening: 'rightTT' };
    case 'double': return { ...base, width: 1500, opening: 'bothTT', divisionRatio: 0.5, panelOpenings: ['leftTT', 'rightTT'] };
    case 'door': return { ...base, width: 900, height: 2100, opening: 'rightTT' };
    case 'windowDoor': return { ...base, width: 1800, height: 2100, opening: 'rightTT', divisionRatio: 0.6, panelOpenings: ['leftTT', 'rightTT'] };
    case 'sliding': return { ...base, width: 3000, height: 2400, opening: 'rightSlide', divisionRatio: 0.5, sashDepth: 104 };
    case 'fixed': return { ...base, opening: 'fixed' };
    case 'transom': return { ...base, height: 1800, opening: 'rightTT', transomHeight: 400 };
    case 'triple': return { ...base, width: 2100, height: 1400, opening: 'rightTT', divisions: [0.33, 0.33, 0.34], panelOpenings: ['leftTT', 'fixed', 'rightTT'] };
    case 'doubleDoor': return { ...base, width: 1800, height: 2100, opening: 'bothTT', divisionRatio: 0.5, panelOpenings: ['leftTT', 'rightTT'] };
    case 'entryDoor': return { ...base, width: 1000, height: 2100, opening: 'rightDoor', doorPanel: 'fullPanel', hasGlassPanel: false, glassPanelHeight: 600 };
    case 'sliding3': return { ...base, width: 4500, height: 2400, opening: 'centerSlide', divisions: [0.33, 0.34, 0.33], sashDepth: 104 };
    case 'panelCombo': return { ...base, width: 1500, height: 2000, opening: 'rightTT', panelHeight: 900 };
    case 'sideLight': return { ...base, width: 1800, height: 2100, opening: 'rightTT', sideLightPosition: 'right', sideLightWidth: 500, panelOpenings: ['rightTT', 'fixed'] };
    default: return base;
  }
};

// ===== SVG CRTEŽ PROZORA =====
// Ovo je srž aplikacije - automatski generiše tehnički crtež s kotama
function WindowDrawing({ pos, size = 360 }) {
  const PAD_LEFT = 60, PAD_RIGHT = 30, PAD_TOP = 20, PAD_BOTTOM = 50;
  const drawW = size - PAD_LEFT - PAD_RIGHT;
  const drawH = size - PAD_TOP - PAD_BOTTOM;

  // Skalira na ono što više stane (uzima u obzir roletnu ako postoji)
  const shutterBoxH = pos.hasShutter ? (pos.shutterBoxHeight || 200) : 0;
  const scale = Math.min(drawW / pos.width, drawH / (pos.height + shutterBoxH));
  const w = pos.width * scale;
  const h = pos.height * scale;
  const shutterH = shutterBoxH * scale;
  const x0 = PAD_LEFT + (drawW - w) / 2;
  const y0 = PAD_TOP + (drawH - (h + shutterH)) / 2; // vrh roletne (ili prozora)
  const winY0 = y0 + shutterH;                        // vrh prozorskog rama

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
    } else if (opening === 'leftOpen') {
      lines.push(`M ${innerR} ${innerT} L ${innerL} ${cy} L ${innerR} ${innerB}`);
    } else if (opening === 'rightOpen') {
      lines.push(`M ${innerL} ${innerT} L ${innerR} ${cy} L ${innerL} ${innerB}`);
    } else if (opening === 'bottomHung') {
      lines.push(`M ${innerL} ${innerB} L ${cx} ${innerT} L ${innerR} ${innerB}`);
    } else if (opening === 'topHung') {
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
        {pos.hasMosquitoNet && (
          <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="url(#mosquito-mesh)" opacity="0.4" />
        )}
        {/* ručka */}
        {!isSlide && opening !== 'fixed' && opening !== 'tilt' && (
          <circle
            cx={opening === 'leftTT' || opening === 'leftOpen' ? panelX + panelW - sashF / 2 : panelX + sashF / 2}
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

  // roletna kutija (iznad prozora)
  if (pos.hasShutter) {
    elements.push(
      <g key="shutter-box">
        <rect x={x0} y={y0} width={w} height={shutterH}
          fill={pos.shutterBoxType === 'inside' ? '#f0f0f0' : 'white'}
          stroke="#1a1a1a" strokeWidth="1.2" />
        <line x1={x0} y1={y0 + shutterH / 2} x2={x0 + w} y2={y0 + shutterH / 2}
          stroke="#1a1a1a" strokeWidth="0.4" strokeDasharray="3,2" />
        <text x={x0 + w / 2} y={y0 + shutterH / 2 + 2.5}
          textAnchor="middle" fontSize="7" fill="#1a1a1a">ROLETNA</text>
      </g>
    );
  }

  // vanjski ram
  elements.push(
    <rect key="frame" x={x0} y={winY0} width={w} height={h} fill="white" stroke="#1a1a1a" strokeWidth="1.2" />
  );
  // unutarnji rub rama
  elements.push(
    <rect key="frame-in" x={x0 + f} y={winY0 + f} width={w - 2 * f} height={h - 2 * f} fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
  );

  const innerW = w - 2 * f;
  const innerH = h - 2 * f;
  const innerX = x0 + f;
  const innerY = winY0 + f;

  if (pos.type === 'single' || pos.type === 'door' || pos.type === 'fixed') {
    elements.push(drawSash(innerX, innerY, innerW, innerH, pos.opening, 'panel'));
  } else if (pos.type === 'double') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    const po = pos.panelOpenings || ['leftTT', 'rightTT'];
    elements.push(drawSash(innerX, innerY, w1, innerH, po[0], 'p1'));
    elements.push(drawSash(innerX + w1, innerY, w2, innerH, po[1], 'p2'));
  } else if (pos.type === 'doubleDoor') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    const sashF = 50 * scale;
    const cx = innerX + w1;
    const po = pos.panelOpenings || ['leftTT', 'rightTT'];
    elements.push(drawSash(innerX, innerY, w1, innerH, po[0], 'dd-l'));
    elements.push(drawSash(cx, innerY, w2, innerH, po[1], 'dd-r'));
    // tanka linija umjesto stuba: precrta centar bijelim, pa crta tanku liniju
    elements.push(
      <g key="dd-center">
        <rect x={cx - sashF} y={innerY} width={sashF * 2} height={innerH} fill="white" />
        <line x1={cx} y1={innerY} x2={cx} y2={innerY + innerH} stroke="#1a1a1a" strokeWidth="0.7" />
      </g>
    );
  } else if (pos.type === 'windowDoor') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    const po = pos.panelOpenings || ['leftTT', pos.opening];
    elements.push(drawSash(innerX, innerY, w1, innerH, po[0], 'p1'));
    elements.push(drawSash(innerX + w1, innerY, w2, innerH, po[1], 'p2'));
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
  } else if (pos.type === 'triple') {
    const divs = pos.divisions || [0.33, 0.33, 0.34];
    const wx1 = innerW * divs[0];
    const wx2 = innerW * divs[1];
    const wx3 = innerW * divs[2];
    const defaultPO = pos.opening === 'allTT' ? ['leftTT', 'rightTT', 'rightTT'] : ['leftTT', 'fixed', 'rightTT'];
    const po = pos.panelOpenings || defaultPO;
    elements.push(drawSash(innerX,             innerY, wx1, innerH, po[0],          'tp1'));
    elements.push(drawSash(innerX + wx1,       innerY, wx2, innerH, po[1],          'tp2'));
    elements.push(drawSash(innerX + wx1 + wx2, innerY, wx3, innerH, po[2] || 'rightTT', 'tp3'));
  } else if (pos.type === 'sideLight') {
    const slW = Math.min((pos.sideLightWidth || 500) * scale, innerW - 10 * scale);
    const mainW = innerW - slW;
    const isRight = (pos.sideLightPosition || 'right') === 'right';
    const defaultPO = isRight ? [pos.opening, 'fixed'] : ['fixed', pos.opening];
    const po = pos.panelOpenings || defaultPO;
    // po[0] = lijevi panel, po[1] = desni panel
    if (isRight) {
      elements.push(drawSash(innerX,          innerY, mainW, innerH, po[0], 'sl-p1'));
      elements.push(drawSash(innerX + mainW,  innerY, slW,   innerH, po[1], 'sl-p2'));
    } else {
      elements.push(drawSash(innerX,          innerY, slW,   innerH, po[0], 'sl-p1'));
      elements.push(drawSash(innerX + slW,    innerY, mainW, innerH, po[1], 'sl-p2'));
    }
  } else if (pos.type === 'panelCombo') {
    const pH = (pos.panelHeight || 900) * scale;          // visina panela u px
    const glassH = innerH - pH;                           // visina stakla u px
    const glassY = innerY;                                 // staklo gore
    const panelY = innerY + glassH;                        // panel dolje
    // ostakljeno krilo (gornji dio)
    elements.push(drawSash(innerX, glassY, innerW, glassH, pos.opening, 'pc-glass'));
    // PVC panel (donji dio)
    elements.push(
      <g key="pc-panel">
        <rect x={innerX} y={panelY} width={innerW} height={pH} fill="#e8e4dc" stroke="#1a1a1a" strokeWidth="0.7" />
        <line x1={innerX} y1={panelY} x2={innerX + innerW} y2={panelY} stroke="#1a1a1a" strokeWidth="0.9" />
      </g>
    );
  } else if (pos.type === 'sliding3') {
    const divs = pos.divisions || [0.33, 0.34, 0.33];
    const wx1 = innerW * divs[0];
    const wx2 = innerW * divs[1];
    const wx3 = innerW * divs[2];
    const op = pos.opening || 'centerSlide';
    elements.push(drawSash(innerX,             innerY, wx1, innerH, op === 'leftSlide'   ? 'leftSlide'  : 'fixed', 's3p1', op === 'leftSlide'));
    elements.push(drawSash(innerX + wx1,       innerY, wx2, innerH, 'fixed',                                        's3p2', false));
    elements.push(drawSash(innerX + wx1 + wx2, innerY, wx3, innerH, op === 'rightSlide'  ? 'rightSlide' : 'fixed', 's3p3', op === 'rightSlide'));
    // bidirekcijska strelica za klizni panel
    const slideCx = op === 'leftSlide'  ? innerX + wx1 / 2
                  : op === 'rightSlide' ? innerX + wx1 + wx2 + wx3 / 2
                  : innerX + wx1 + wx2 / 2;
    const slideCy = innerY + innerH / 2;
    elements.push(
      <g key="s3-arr" stroke="#1a1a1a" strokeWidth="1" fill="none">
        <line x1={slideCx - 15} y1={slideCy} x2={slideCx + 15} y2={slideCy} />
        <polyline points={`${slideCx - 10},${slideCy - 4} ${slideCx - 15},${slideCy} ${slideCx - 10},${slideCy + 4}`} />
        <polyline points={`${slideCx + 10},${slideCy - 4} ${slideCx + 15},${slideCy} ${slideCx + 10},${slideCy + 4}`} />
      </g>
    );
  } else if (pos.type === 'entryDoor') {
    const sashF = 50 * scale;
    const doorPanel = pos.doorPanel || 'fullPanel';
    const gx = innerX + sashF;
    const gy = innerY + sashF;
    const gw = innerW - 2 * sashF;
    const gh = innerH - 2 * sashF;
    // sash outline
    elements.push(<rect key="ed-frame" x={innerX} y={innerY} width={innerW} height={innerH} fill="none" stroke="#1a1a1a" strokeWidth="0.7" />);
    if (doorPanel === 'fullPanel') {
      elements.push(<rect key="ed-fill" x={gx} y={gy} width={gw} height={gh} fill="#e8e4dc" stroke="#1a1a1a" strokeWidth="0.4" />);
    } else if (doorPanel === 'glassFull') {
      elements.push(<rect key="ed-fill" x={gx} y={gy} width={gw} height={gh} fill="#dbeafe" stroke="#1a1a1a" strokeWidth="0.4" opacity="0.8" />);
    } else if (doorPanel === 'panelGlass') {
      const glassH = Math.min((pos.glassPanelHeight || 600) * scale, gh - 10 * scale);
      elements.push(<rect key="ed-glass" x={gx} y={gy} width={gw} height={glassH} fill="#dbeafe" stroke="#1a1a1a" strokeWidth="0.4" opacity="0.8" />);
      elements.push(<rect key="ed-panel" x={gx} y={gy + glassH} width={gw} height={gh - glassH} fill="#e8e4dc" stroke="#1a1a1a" strokeWidth="0.4" />);
      elements.push(<line key="ed-div" x1={gx} y1={gy + glassH} x2={gx + gw} y2={gy + glassH} stroke="#1a1a1a" strokeWidth="0.7" />);
    }
    // knob: 60×10mm at 1050mm from bottom
    const knobY = winY0 + h - 1050 * scale;
    const knobW = 60 * scale;
    const knobH = 10 * scale;
    const knobX = (pos.opening || 'rightDoor') === 'rightDoor' ? innerX + innerW - knobW : innerX;
    elements.push(<rect key="ed-knob" x={knobX} y={knobY - knobH / 2} width={knobW} height={knobH} fill="#1a1a1a" rx="1" />);
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
      <defs>
        <pattern id="mosquito-mesh" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 8 0" fill="none" stroke="#4a4a4a" strokeWidth="0.5" />
          <path d="M 0 0 L 0 8" fill="none" stroke="#4a4a4a" strokeWidth="0.5" />
        </pattern>
      </defs>
      {/* drawing */}
      {elements}

      {/* horizontalna kota (širina) */}
      <g stroke="#1a1a1a" strokeWidth="0.4">
        <line x1={x0} y1={winY0 + h + dimOffsetY - 6} x2={x0} y2={winY0 + h + dimOffsetY + 6} />
        <line x1={x0 + w} y1={winY0 + h + dimOffsetY - 6} x2={x0 + w} y2={winY0 + h + dimOffsetY + 6} />
        <line x1={x0} y1={winY0 + h + dimOffsetY} x2={x0 + w} y2={winY0 + h + dimOffsetY} />
        <polygon points={`${x0},${winY0 + h + dimOffsetY} ${x0 + 5},${winY0 + h + dimOffsetY - 2} ${x0 + 5},${winY0 + h + dimOffsetY + 2}`} fill="#1a1a1a" />
        <polygon points={`${x0 + w},${winY0 + h + dimOffsetY} ${x0 + w - 5},${winY0 + h + dimOffsetY - 2} ${x0 + w - 5},${winY0 + h + dimOffsetY + 2}`} fill="#1a1a1a" />
      </g>
      <text x={x0 + w / 2} y={winY0 + h + dimOffsetY + 14} textAnchor="middle" fill="#1a1a1a">{pos.width}</text>

      {/* vertikalna kota (ukupna visina: roletna + prozor) */}
      <g stroke="#1a1a1a" strokeWidth="0.4">
        <line x1={x0 - dimOffsetX - 6} y1={y0} x2={x0 - dimOffsetX + 6} y2={y0} />
        <line x1={x0 - dimOffsetX - 6} y1={winY0 + h} x2={x0 - dimOffsetX + 6} y2={winY0 + h} />
        <line x1={x0 - dimOffsetX} y1={y0} x2={x0 - dimOffsetX} y2={winY0 + h} />
        <polygon points={`${x0 - dimOffsetX},${y0} ${x0 - dimOffsetX - 2},${y0 + 5} ${x0 - dimOffsetX + 2},${y0 + 5}`} fill="#1a1a1a" />
        <polygon points={`${x0 - dimOffsetX},${winY0 + h} ${x0 - dimOffsetX - 2},${winY0 + h - 5} ${x0 - dimOffsetX + 2},${winY0 + h - 5}`} fill="#1a1a1a" />
      </g>
      <text x={x0 - dimOffsetX - 8} y={y0 + (shutterH + h) / 2} textAnchor="middle" fill="#1a1a1a" transform={`rotate(-90, ${x0 - dimOffsetX - 8}, ${y0 + (shutterH + h) / 2})`}>{pos.height + shutterBoxH}</text>

      {/* sub-kote za triple i sliding3 */}
      {(pos.type === 'triple' || pos.type === 'sliding3') && (() => {
        const divs = pos.divisions || [0.33, 0.33, 0.34];
        const w1mm = Math.round(pos.width * divs[0]);
        const w2mm = Math.round(pos.width * divs[1]);
        const w3mm = pos.width - w1mm - w2mm;
        const subY = winY0 + h + dimOffsetY - 16;
        const x1 = x0 + w * divs[0];
        const x2 = x0 + w * (divs[0] + divs[1]);
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={x0} y1={subY - 6} x2={x0} y2={subY + 2} />
            <line x1={x1} y1={subY - 6} x2={x1} y2={subY + 2} />
            <line x1={x2} y1={subY - 6} x2={x2} y2={subY + 2} />
            <line x1={x0 + w} y1={subY - 6} x2={x0 + w} y2={subY + 2} />
            <text x={x0 + w * divs[0] / 2} y={subY} textAnchor="middle" fontSize="8">{w1mm}</text>
            <text x={x1 + w * divs[1] / 2} y={subY} textAnchor="middle" fontSize="8">{w2mm}</text>
            <text x={x2 + w * divs[2] / 2} y={subY} textAnchor="middle" fontSize="8">{w3mm}</text>
          </g>
        );
      })()}

      {/* sub-kote za podjelu (dvokrilni / klizna / windowDoor) */}
      {(pos.type === 'double' || pos.type === 'sliding' || pos.type === 'windowDoor' || pos.type === 'doubleDoor') && (() => {
        const ratio = pos.divisionRatio || 0.5;
        const w1mm = Math.round(pos.width * ratio);
        const w2mm = pos.width - w1mm;
        const subY = winY0 + h + dimOffsetY - 16;
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
            <line x1={subX - 4} y1={winY0 + f} x2={subX + 2} y2={winY0 + f} />
            <line x1={subX - 4} y1={winY0 + f + tHscaled} x2={subX + 2} y2={winY0 + f + tHscaled} />
            <text x={subX - 2} y={winY0 + f + tHscaled / 2 + 3} textAnchor="end" fontSize="8">{tH}</text>
            <text x={subX - 2} y={winY0 + f + tHscaled + (h - 2 * f - tHscaled) / 2 + 3} textAnchor="end" fontSize="8">{Math.round((pos.height - 2 * 70 - tH))}</text>
          </g>
        );
      })()}

      {/* sub-kota za panelCombo */}
      {pos.type === 'panelCombo' && (() => {
        const pHmm = pos.panelHeight || 900;
        const pHscaled = pHmm * scale;
        const glassHmm = pos.height - 140 - pHmm;
        const subX = x0 - dimOffsetX + 14;
        const topY = winY0 + f;
        const midY = winY0 + f + innerH - pHscaled;
        const botY = winY0 + f + innerH;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={subX - 4} y1={topY} x2={subX + 2} y2={topY} />
            <line x1={subX - 4} y1={midY} x2={subX + 2} y2={midY} />
            <line x1={subX - 4} y1={botY} x2={subX + 2} y2={botY} />
            <text x={subX - 2} y={topY + (midY - topY) / 2 + 3} textAnchor="end" fontSize="8">{glassHmm}</text>
            <text x={subX - 2} y={midY + pHscaled / 2 + 3} textAnchor="end" fontSize="8">{pHmm}</text>
          </g>
        );
      })()}

      {/* sub-kote za sideLight */}
      {pos.type === 'sideLight' && (() => {
        const slWmm  = pos.sideLightWidth || 500;
        const mainWmm = pos.width - slWmm;
        const isRight = (pos.sideLightPosition || 'right') === 'right';
        const subY = winY0 + h + dimOffsetY - 16;
        const divPx = isRight ? x0 + mainWmm * scale : x0 + slWmm * scale;
        const leftWmm  = isRight ? mainWmm : slWmm;
        const rightWmm = isRight ? slWmm   : mainWmm;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={x0}     y1={subY - 6} x2={x0}     y2={subY + 2} />
            <line x1={divPx}  y1={subY - 6} x2={divPx}  y2={subY + 2} />
            <line x1={x0 + w} y1={subY - 6} x2={x0 + w} y2={subY + 2} />
            <text x={(x0 + divPx) / 2}        y={subY} textAnchor="middle" fontSize="8">{leftWmm}</text>
            <text x={(divPx + x0 + w) / 2}    y={subY} textAnchor="middle" fontSize="8">{rightWmm}</text>
          </g>
        );
      })()}

      {/* sub-kota za roletnu */}
      {pos.hasShutter && shutterH > 0 && (
        <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
          <line x1={x0 - dimOffsetX + 8} y1={y0}    x2={x0 - dimOffsetX + 14} y2={y0} />
          <line x1={x0 - dimOffsetX + 8} y1={winY0} x2={x0 - dimOffsetX + 14} y2={winY0} />
          <text x={x0 - dimOffsetX + 6} y={y0 + shutterH / 2 + 3} textAnchor="end" fontSize="8">{shutterBoxH}</text>
        </g>
      )}
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
        <div className="w-28 h-28 shrink-0 bg-stone-50 border" style={{ borderColor: '#e5e5e0' }}>
          <WindowDrawing pos={pos} size={110} />
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
              {pos.hasShutter && (
                <div className="text-[10px] text-stone-400 mt-1">
                  Ukupna vanjska visina: {pos.height + (pos.shutterBoxHeight || 200)} mm
                </div>
              )}
            </div>
          </div>

          {/* Otvaranje */}
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

          {/* Podjela (ako ima 2 panela) */}
          {(pos.type === 'double' || pos.type === 'sliding' || pos.type === 'windowDoor' || pos.type === 'doubleDoor') && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                Podjela: {Math.round(pos.width * (pos.divisionRatio || 0.5))} / {pos.width - Math.round(pos.width * (pos.divisionRatio || 0.5))} mm
              </label>
              <input type="range" min="0.2" max="0.8" step="0.01" value={pos.divisionRatio || 0.5} onChange={e => update('divisionRatio', +e.target.value)} className="w-full" />
            </div>
          )}

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

          {/* Bočno svjetlo za sideLight */}
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

          {/* Visina panela za panelCombo */}
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
            <div className="w-56 shrink-0">
              <div className="aspect-square">
                <WindowDrawing pos={p} size={220} />
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
              {(() => {
                const autoLines = [];
                if (p.hasMosquitoNet && !p.accessories.some(a => a.toLowerCase().includes('mreža'))) {
                  const netLabel = { harmo: 'Harmo plisirana', roller: 'Roletna mreža', fixed: 'Fiksna mreža' }[p.mosquitoNetType || 'harmo'];
                  autoLines.push(`Mreža protiv insekata: ${netLabel}`);
                }
                if (p.hasShutter && !p.accessories.some(a => a.toLowerCase().includes('roletna'))) {
                  const type = p.shutterBoxType === 'inside' ? 'unutarnja' : 'vanjska';
                  const ctrl = { belt: 'traka (gurtna)', crank: 'ručica', motor: 'motor' }[p.shutterControl || 'belt'];
                  const bh = p.shutterBoxHeight || 200;
                  autoLines.push(`Roletna: ${type} ALU termoizolaciona, ${bh}×${bh}`);
                  autoLines.push(`Upravljanje: ${ctrl}`);
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

// ===== CUSTOMER AUTOCOMPLETE =====
function CustomerAutocomplete({ value, onChange, onSelect }) {
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

// ===== GLAVNA APLIKACIJA =====
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

function QuotesList({ quotes, currentId, onSelect, onNew, onDelete, onDuplicate }) {
  const [search, setSearch] = useState('');
  const sorted = [...quotes].sort((a, b) => b.updatedAt - a.updatedAt);
  const filtered = sorted.filter(q =>
    q.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    q.number.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col border-r overflow-hidden" style={{ borderColor: '#e5e5e0', background: 'white' }}>
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

  const [lang, setLang] = useState('bs');
  const [currency, setCurrency] = useState('KM');
  const [showPrices, setShowPrices] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [view, setView] = useState('split'); // 'split' | 'preview'
  const [currentView, setCurrentView] = useState('quotes'); // 'quotes' | 'customers'
  const [customerSavedToast, setCustomerSavedToast] = useState(false);

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
        body { background: #f5f5f0; }
      `}</style>

      <div className="min-h-screen" style={{ background: '#fafaf7', fontFamily: 'Geist, system-ui, sans-serif', color: '#1a1a1a' }}>
        {/* TOP BAR - hidden in print */}
        <div className="border-b sticky top-0 z-10" style={{ background: '#fafaf7', borderColor: '#e5e5e0', printColorAdjust: 'exact' }}>
          <div className="px-6 py-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <img src="/neoprom-icon.svg" alt="Neoprom" style={{ height: '28px', display: 'block' }} />
              <div className="font-medium tracking-tight">Generator ponuda <span className="text-stone-400 text-xs ml-1">v0.1</span></div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              {[['quotes', 'Ponude'], ['customers', 'Kupci']].map(([v, label]) => (
                <button key={v} onClick={() => setCurrentView(v)}
                  className="px-3 py-1 text-xs font-medium"
                  style={{
                    color: currentView === v ? '#1f3a5f' : '#6b6b6b',
                    borderBottom: `2px solid ${currentView === v ? '#1f3a5f' : 'transparent'}`
                  }}>
                  {label}
                </button>
              ))}
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
              <span style={{ fontSize: '11px', color: saveStatus === 'saved' ? '#16a34a' : '#ca8a04' }}>
                {saveStatus === 'saved' ? '✓ Spremljeno' : '⏳ Spremam...'}
              </span>
              <button onClick={() => setView(view === 'split' ? 'preview' : 'split')} className="text-xs px-3 py-1.5 border" style={{ borderColor: '#d4d4cf' }}>
                {view === 'split' ? 'Samo preview' : 'Editor + preview'}
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-white" style={{ background: '#1f3a5f' }}>
                <Printer size={13} /> Štampaj / PDF
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOMERS VIEW */}
        {currentView === 'customers' && <CustomersManager />}

        {/* MAIN GRID */}
        {currentView === 'quotes' && <div className={view === 'split' ? "grid grid-cols-1 lg:grid-cols-[240px_420px_1fr]" : "p-6"}>

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
            <div className="space-y-4 p-6 border-r overflow-y-auto" style={{ borderColor: '#e5e5e0' }}>
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
                        if (c.language) setLang(c.language);
                        if (c.currency) setCurrency(c.currency);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Adresa</label>
                    <textarea value={doc.customer.address} onChange={e => setDoc({ ...doc, customer: { ...doc.customer, address: e.target.value } })} rows="2" className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf' }} />
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

              {/* PDV */}
              <div className="bg-white border p-4" style={{ borderColor: '#e5e5e0' }}>
                <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">PDV</div>
                <label className="flex items-center gap-2 text-xs mb-2 cursor-pointer">
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
                      className="w-full px-2 py-1.5 border text-sm" style={{ borderColor: '#d4d4cf', fontFamily: 'Geist Mono, ui-monospace, monospace' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PREVIEW PANEL */}
          <div className="bg-stone-200 p-4 lg:p-8 overflow-auto">
            <div className="mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm', background: 'white' }}>
              <PdfPreview doc={doc} lang={lang} currency={currency} showPrices={showPrices} />
            </div>
          </div>
        </div>}

        <div className="text-center text-[10px] text-stone-400 py-4 border-t" style={{ borderColor: '#e5e5e0' }}>
          Demo · Neoprom Engineering · Generator ponuda v0.1
        </div>
      </div>
    </>
  );
}
