# Wessland

Ny hemsida för Wessland Resort (Bolstan 102, Västland, Tierp). Statisk sida i ren HTML, CSS och lite JavaScript, utan byggsteg.

Innehållet kommer från wessland.se (startsidan, Konferens, Konst på väg, Filmproduktion, Upplevelser, Kontakt). Typsnitt: Poppins.

## Köra lokalt

```bash
python3 -m http.server 8000
# öppna http://localhost:8000
```

## Publicera

Funkar som den är på GitHub Pages, Netlify, Cloudflare Pages eller vilken statisk hosting som helst. På GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Struktur

```
index.html            Startsida med hero-film
konferens.html
konstpavag.html
filmproduktion.html
upplevelser.html
kontakt.html          Kontaktformulär (öppnar mejl till info@wessland.se)
assets/style.css
assets/main.js        Meny, reveal, YouTube-hero, formulär
```

## Hero-filmen

Videon `-3Vx2rEhS84` ("Renovering av Västlands kyrktorn", Tierps pastorat, bildspel och film av Kristin Schyllner) spelas tyst i loop som bakgrund via YouTube IFrame API. Byt film genom att ändra `data-video` på `#hero-player` i `index.html`. Sidan visar ett stillbild-poster först och hoppar över videon vid `prefers-reduced-motion` och data saver. Det finns en pausknapp.

## Att göra innan lansering

- **Bilder:** alla bilder pekar än så länge på Wesslands befintliga Squarespace-CDN. Ladda ner dem till en `images/`-mapp och byt länkarna, så fungerar sidan även när det gamla Squarespace-kontot sägs upp.
- **Filmen:** fråga Tierps pastorat att det är okej att använda deras film som bakgrund, och behåll krediten i hero.
- **Konst på väg:** sidan beskriver utställningen påsken 2025. Uppdatera när nästa tillfälle är bestämt.
- **Bagarstugan:** originalsajtens sida `/pagebo` gick inte att hämta, så den finns inte med här. Länkarna går till den gamla sajten tills sidan är skriven.
- **Karta:** kartbilden är inte hämtad, kartlänkarna går till Google Maps.
