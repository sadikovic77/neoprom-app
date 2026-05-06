# NEOPROM Engineering - Aplikacija za ponude PVC stolarije

Jednokorisnička desktop web aplikacija (lokalni Vite dev server) za generisanje ponuda i potvrda avansa za PVC stolariju. Koristi je vlasnik firme za zamjenu Canva workflow-a.

## Tech stack

- **React 18** + **Vite** (dev server na :5173)
- **Tailwind CSS v3** (config u `tailwind.config.js`, `postcss.config.cjs`)
- **lucide-react** za ikone
- **localStorage** za sav storage (nema backend, nema baze)
- **Browser print** za PDF eksport (`window.print()` + CSS `@media print`)
- **SVG** za sve crteže prozora (programatski, ne raster)
- **Git + GitHub** za verzioniranje

## Struktura projekta

```
src/
├── App.jsx                          - Glavna komponenta, state, layout
├── CustomersManager.jsx             - Tab za upravljanje kupcima
├── translations.js                  - BS/DE prevodi (T, OPENING_LABEL)
├── elementTypes.js                  - ELEMENT_TYPES array, newPosition()
├── components/
│   ├── WindowDrawing.jsx            - SVG generator crteža (najveći fajl)
│   ├── PositionEditor.jsx           - Editor pojedinačne pozicije
│   ├── PdfPreview.jsx               - A4 preview ponude
│   ├── QuotesList.jsx               - Sidebar lista ponuda
│   └── CustomerAutocomplete.jsx     - Combobox za kupce
└── utils/
    ├── format.js                    - fmt() number formatter, getElementName()
    ├── customers.js                 - CRUD za kupce u localStorage
    └── templates.js                 - CRUD za position templates
```

## Domena i jezik

- **Aplikacija je dvojezična** - BS (bosanski) i DE (njemački)
- **Valuta** - KM (BAM) ili EUR
- **Lokalitet** - Bugojno, BiH. PDV stopa 17% (BiH default).
- **Kupci** - dijelom domaći (BS, KM), dijelom strani (DE, EUR)
- **Sva UI/komentari u kodu na bs ili en su OK**, ali korisnički vidljivi tekstovi idu kroz `T` translations

## Storage struktura (localStorage)

- `quotes` - array svih ponuda
- `current-quote-id` - ID trenutno otvorene ponude
- `customers` - array kupaca
- `position-templates` - array template-a pozicija

Svaka ponuda (`doc`) ima: `id`, `number`, `date`, `customer` (snapshot ime/adresa), `customerId` (referenca u customers), `positions` (array), `netOverride`, `vatRate`, `vatEnabled`, `createdAt`, `updatedAt`.

Svaki kupac: `id`, `name`, `address`, `phone`, `email`, `language` (bs/de), `currency` (KM/EUR), `vatPayer`, `notes`, `createdAt`, `updatedAt`.

Svaka pozicija: `id`, `type`, `width`, `height`, `quantity`, `unitPrice`, `opening` ili `panelOpenings[]`, `divisionRatio` ili `divisions[]`, `systemName`, `fitting`, `color`, `glass`, `frameProfile`, `frameDepth`, `sashProfile`, `sashDepth`, `accessories[]`, `hasShutter`, `shutterBoxHeight`, `shutterBoxType`, `shutterControl`, `hasMosquitoNet`, `mosquitoNetType`, plus type-specific polja (`transomHeight`, `panelHeight`, `sideLightWidth`, itd.).

## Tipovi elemenata (ELEMENT_TYPES)

`single`, `double`, `triple`, `door`, `doubleDoor`, `entryDoor`, `windowDoor`, `sliding`, `sliding3`, `fixed`, `transom`, `panelCombo`, `sideLight`.

Smjerovi otvaranja: `leftTT`, `rightTT`, `bothTT`, `tilt`, `fixed`, `leftOpen`, `rightOpen`, `bottomHung`, `topHung`, plus klizni: `leftSlide`, `rightSlide`, `centerSlide`, plus vrata: `leftDoor`, `rightDoor`.

## Konvencije

- **Komponente** - PascalCase, jedna komponenta = jedan fajl
- **Funkcije/varijable** - camelCase
- **Storage keys** - kebab-case stringovi
- **Boje** (Tailwind/CSS): primarna navy `#1f3a5f`, pozadinska `#fafaf7`, border `#e5e5e0`, akcent crna `#1a1a1a`
- **Font** - Geist (sans), Geist Mono (mono), Instrument Serif (display - brojevi ponuda)
- **Stilizacija** - inline style za boje koje nisu Tailwind preset, Tailwind klase za layout/spacing
- **Crteži** - SVG, sa kotama (mjernim linijama) sa lijeve i donje strane, sub-kote za podjele

## Pravila kod izmjena

1. **Ne mijenjati storage strukturu bez migracije.** Ako se mijenja shape postojećih objekata, dodaj migraciju koja prebacuje stare format u novi.
2. **Backward compatible defaults.** Ako se dodaje novo polje, mora imati default vrijednost (npr. `hasShutter ?? false`) jer postoje postojeći podaci.
3. **Ne diraj komponente koje nisu u zadatku.** Eksplicitno reci "ne diraj X, Y" u promptu.
4. **WindowDrawing je central.** Svaka izmjena tipa elementa mijenja samo dispatch logiku za taj tip; ne mijenja shared funkcije (openingSymbol, drawSash) bez razloga.
5. **Translations.** Svaki novi user-facing tekst ide u `T` (BS i DE).
6. **Ne koristi `localStorage.clear()`** ili bilo šta destruktivno bez eksplicitnog zahtjeva.

## Workflow

- `npm run dev` u VS Code terminalu pokreće dev server (port 5173)
- Vita ima HMR - izmjene se vide odmah u browseru
- Print to PDF: Ctrl+P → "Save as PDF" iz browser print dijaloga
- Git: prije svake veće izmjene `git commit -m "..."` da bude checkpoint
- Backup: `git push` na GitHub privatni repo

## Tipični zadaci

**Dodavanje novog tipa elementa:**
1. `elementTypes.js` - dodaj u ELEMENT_TYPES, dodaj case u newPosition()
2. `components/WindowDrawing.jsx` - dodaj rendering logiku za type
3. `components/PositionEditor.jsx` - ako tip ima specifična polja, dodaj UI
4. `translations.js` - prevodi za labele

**Dodavanje opcije na poziciju (kao roletna, mreža):**
1. `elementTypes.js` newPosition() - dodaj polja sa defaultima
2. `components/PositionEditor.jsx` - novi `<details>` collapsible odjeljak
3. `components/WindowDrawing.jsx` - vizuelni prikaz na crtežu
4. `components/PdfPreview.jsx` - auto stavka u accessories listi

**Mijenjanje storage modela:**
1. Definiši migraciju u relevantnom utils/ fajlu
2. Pokreni migraciju pri load-u u App.jsx ili komponenti koja prva čita podatke
3. Backward compatible read - tolerantno čitanje starih i novih formata

## Šta NE raditi bez pitanja

- Ne brisati postojeće funkcije ili komponente
- Ne mijenjati arhitekturu (ne uvoditi Redux, Zustand, React Router osim ako se eksplicitno traži)
- Ne dodavati nove dependencies bez potvrde
- Ne praviti ireverzibilne migracije podataka
- Ne mijenjati postojeće UUID-e ili ID polja u storage-u
