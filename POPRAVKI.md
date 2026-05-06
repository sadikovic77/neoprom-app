# NEOPROM App - Lista popravki

## Status

Lista zadataka iz korisnikovog Word dokumenta, grupisana i prioritizovana za rad. Sve sa originalnim brojevima radi reference.

## Prvi val - bugovi (brzo)

### #17 - Tekst otvaranja vrata na bs

leftDoor/rightDoor se prikazuje tako u UI-u i PDF-u. Treba prevod: "Otvaranje u lijevo" / "Otvaranje u desno" (bs), "Öffnung nach links" / "Öffnung nach rechts" (de).

### #5 - Nedostajući prevodi BS→DE

Stavke koje ostaju na bosanskom kad se jezik prebaci na DE:
- "Zaštita od insekata: (sistem Harmo)" → treba "Insektenschutz: (System Harmo)"
- "bijela / antracit" → treba "weiß / anthrazit"
Provjeriti sve hardkodirane stringove u accessories i color poljima.

### #8 - Sve fiksno ali crtež pokazuje otvaranje

Kad je opening "fixed" (Sve fiksno), crtež i dalje pokazuje TT linije i ručku. Treba potpuno prazno staklo, bez simbola otvaranja.

### #15 - Dvokrilna balkonska vrata - kipanje se ne odražava

Mijenjanje smjera otvaranja po krilu (panelOpenings) kod doubleDoor tipa ne mijenja crtež. Crtež ostaje statičan dok se polja u editoru mijenjaju.

### #20 - Kombinovani panel - kote izgledaju loše

Brojke (kote) na panelCombo crtežu su preblizu, preklapaju se. Sub-kote za visinu panela / visinu staklenog dijela.

## Drugi val - PDF preview izgled

### #1 - Opis sa cijenama loše složen (PDF)

Kad je showPrices=true u PDF-u, opis pozicije i kolone cijena se preklapaju. Tekst i broj idu jedno preko drugog.

### #2 i #3 - Labeli kolona nisu poravnani

"Kol." i "Opis" labeli iznad pozicija u PDF-u nisu iznad svojih kolona - "Opis" je iznad slike umjesto iznad teksta opisa.

### #21 - Sortiranje tipova elemenata

ELEMENT_TYPES dropdown sad je u random redoslijedu (jednokrilni, dvokrilni, balkonska vrata, prozor+balkonska, klizna stijena, fiksni, prozor sa nadsvjetlom, trokrilni, dvokrilna balkonska, ulazna vrata, klizna 3-djelna, kombinovani panel, prozor sa bočnim svjetlom).

Treba logički poredak (predloženo):
1. Jednokrilni prozor
2. Dvokrilni prozor
3. Trokrilni prozor
4. Fiksni element
5. Prozor sa nadsvjetlom
6. Prozor sa bočnim svjetlom
7. Kombinovani panel
8. Balkonska vrata
9. Dvokrilna balkonska vrata
10. Prozor + balkonska vrata
11. Ulazna vrata
12. Klizna stijena
13. Klizna stijena 3-djelna

### #6 i #10 - Veći crteži

Crteži u listi pozicija (sidebar editora) i u PDF preview-u trebaju biti veći i jasniji. Trenutno su mali, ne vide se detalji.

## Treći val - značajan UX

### #14 - Sticky scroll editor/sidebar

Kad PDF preview ima puno pozicija (skroluješ desno), lijevi editor i sidebar se "izgube" sa ekrana. Treba da editor ostane fiksan/sticky dok skroluješ PDF, ili da svaki ima zaseban scroll.

### #9 - Precizan slider podjele

Slideri za podjelu (divisionRatio, divisions[]) treba da imaju:
a) Number input pored slidera za unos tačnog broja u mm
b) Precizniji slider (sad je teško tačno pogoditi)

### #22 - Roletna razdvajanje po krilu

Sad hasShutter ide na cijeli element. Za multi-panel tipove (double, triple, doubleDoor, itd.) treba mogućnost: lijeva roletna posebno, desna posebno, obje, nijedna. Kao niz hasShutter[] ili objekt.

### #13 - Opcioni dijelovi opisa

Nekad u opisu pozicije ne treba: dubina rama, profil rama, staklo (ako je panel), itd. Treba toggle za svaki dio specifikacije - prikaži ili sakrij u PDF-u.

## Četvrti val - dodaci

### #18 - Roletna manuelni unos + cijena

Trenutno: visina kutije je fiksni input. Treba dodati i širinu (manuelno). Plus posebno polje "Cijena roletne" - dodaje se na cijenu pozicije zasebno.

### #16 - Varijante panela

Više vrsta panela u smislu oblika:
- Puni PVC panel
- Panel + staklo (gornji dio staklo, donji panel) - već postoji kao panelCombo
- Panel sa staklenim dijelom u sredini
- Različiti uzorci/teksture panela

### #12 - Manuelne napomene

Korisnik unosi vlastite tekstualne napomene u ponudu - npr. dodatne uslove, custom dogovore. Trenutne napomene su hardkodirane.

### #11 - Roletna popraviti izgled

Trenutni vizuelni prikaz roletne (kutija + lamele) treba doraditi - kote, proporcije, vidljivost.

### #4 - Kote novih elemenata

Kod novih tipova (triple, doubleDoor, sliding3, panelCombo, sideLight) kote nisu uvijek lijepo postavljene - sub-kote, razmaci, font.

## Peti val - polish

### #19 - Dark mode

Toggle za dark/light theme. Tailwind dark: prefiks. Boje invertovane, ali PDF preview ostaje light (papir je bijel).

### #7 - Cijena/kom polje 0

Number input ne dozvoljava brisanje 0 - mora se overwrite. Treba moći obrisati pa ostaviti prazno (interpretira se kao null/0).
