export const T = {
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

export const OPENING_LABEL = {
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
    topHung: "Gornja kip (padajući)",
    leftDoor: "Otvaranje u lijevo",
    rightDoor: "Otvaranje u desno"
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
    topHung: "Klappöffnung oben",
    leftDoor: "Öffnung nach links",
    rightDoor: "Öffnung nach rechts"
  }
};
