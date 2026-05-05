export const ELEMENT_TYPES = [
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

export const newPosition = (type = 'single') => {
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
