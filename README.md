# Travel Monkey

![Travel Monkey — reis verder dan de gebaande paden](public/images/og-travel-monkey.jpg)

Een complete, speelse reisblog over Bali. Met een interactieve kaart, een
dag-tot-dag route, twee reisverhalen en foto's die je zelf kunt vervangen.

Deze README loopt je stap voor stap door **de enige route die je nodig hebt:
van je computer naar GitHub en daarna naar Vercel**. Je hebt geen server, geen
FTP, geen terminal en geen creditcard nodig.

---

## 1. Wat je gaat doen

Je zet deze kant-en-klare website online met behulp van GitHub en Vercel. GitHub
is de plek waar je bestanden veilig worden bewaard; Vercel bouwt die bestanden
automatisch om tot een echte website met een gratis webadres. Na ongeveer 15
minuten heb je een link die je met iedereen kunt delen.

**Wat je nodig hebt**

- Een computer met een browser (Chrome, Safari, Edge of Firefox).
- Een e-mailadres.
- Ongeveer 15 minuten rust.
- De map `travel-monkey` die je hebt ontvangen. Als die in een zip-bestand
  zit, pak je hem eerst uit. Uitpakken betekent: met de rechtermuisknop op het
  zip-bestand klikken en kiezen voor "Alles uitpakken" (Windows) of dubbelklikken
  (Mac).

### Kleine woordenlijst

Je hoeft deze woorden niet uit je hoofd te leren. Ze komen hierna steeds terug.

| Woord | Wat het in één zin betekent |
| --- | --- |
| **GitHub** | Een website waar je projectbestanden online bewaart, zoals een online map. |
| **Repository** | De online map van jouw project op GitHub. |
| **Commit** | Een opgeslagen versie van je bestanden, met een kort briefje erbij. |
| **Vercel** | De dienst die jouw bestanden automatisch omzet in een website en die online zet. |
| **Terminal** | Een venster waarin je tekstcommando's typt; hier heb je er geen nodig. |
| **FTP** | Een oude methode om bestanden naar een server te kopiëren; hier niet nodig. |
| **Node.js** | De techniek waarop Next.js draait; Vercel zet dit automatisch aan, jij hoeft niets te installeren. |
| **npm** | De hulpmiddelenbeheerder die de benodigde softwarepakketten ophaalt; Vercel doet dit automatisch. |
| **Deployen** | Je website publiceren, zodat bezoekers hem kunnen openen. |
| **Framework** | Een bouwpakket voor websites; Next.js is het framework dat dit project gebruikt. |
| **Environment variable** | Een geheime instelling voor een website; die heb je hier **niet** nodig. |
| **API-sleutel** | Een geheim wachtwoord waarmee een website een externe dienst mag gebruiken; hier is er geen nodig. |
| **Domein** | Een eigen webadres, bijvoorbeeld `travelmonkey.nl`. |
| **DNS** | Het adressenboek van het internet, dat een domein naar de juiste website verwijst. |

### Wat zit er in de map?

- `app` — alle pagina's van de site.
- `components` — herbruikbare onderdelen, zoals de kaarten en het menu.
- `data` — de teksten en routes. Hier pas je later het makkelijkst dingen aan.
- `lib` — code die de content inleest.
- `public` — alle foto's die de site gebruikt.
- `package.json` — de lijst met software die Vercel nodig heeft.
- `README.md` — dit bestand.

Een uitgebreide uitleg per map staat in
[PROJECTSTRUCTUUR.md](PROJECTSTRUCTUUR.md). De foto's komen van Unsplash; de
herkomst staat in [public/images/CREDITS.md](public/images/CREDITS.md).

> **Let op:** je hoeft niets te installeren. Je hebt geen Node.js, npm, terminal
> of code-editor nodig. Vercel regelt alle techniek automatisch. Er zijn in deze
> versie ook **geen API-sleutels of environment variables** nodig, en de kaart
> werkt zonder account bij een kaartdienst.

---

## 2. Stap 1: GitHub account maken

GitHub is gratis. Je gebruikt het alleen als bewaarplaats voor de bestanden.

1. Ga in je browser naar **github.com**.
2. Klik rechtsboven op **Sign up**.
3. Vul je e-mailadres, een wachtwoord en een gebruikersnaam in.
   - Je gebruikersnaam komt in de link naar je GitHub-repository terecht.
     Iets als `mila-reist` is prima.
   - Je hoeft je echte naam niet te gebruiken.
4. Doorloop de controle (meestal een puzzeltje) en klik op **Create account**.
5. Open de e-mail van GitHub en typ de code die je hebt gekregen.
6. Kies bij de vraag naar je ervaring gerust voor **Just me** en **Student** of
   **Hobby**. Je kunt alles overslaan; je hebt geen betaald abonnement nodig.

> 🖼️ **Wat je ziet (screenshot-beschrijving)**
> Na het inloggen kom je op een pagina met bovenaan een zoekbalk en rechtsboven
> je ronde profielfoto. Links staat een lijst met "Top repositories". Rechts
> zie je een groene knop met **New**. Als je die ziet, ben je klaar voor stap 2.

**Even goed om te weten:** GitHub is niet je website. Het is alleen de
opslagplek. Vercel pakt de bestanden later op en maakt er de echte site van.

---

## 3. Stap 2: Een nieuwe repository maken

Een repository is de online map waarin alle bestanden van Travel Monkey komen.

1. Klik op de groene knop **New** (of op de **+** rechtsboven en daarna op
   **New repository**).
2. Vul bij **Repository name** precies dit in:

   `travel-monkey`

   Gebruik kleine letters en een streepje. Een spatie is niet handig.
3. Bij **Description** mag je invullen: `Mijn reisblog over Bali`. Dit is
   optioneel.
4. Kies **Public**. Openbaar betekent hier alleen dat anderen de bestanden
   mogen bekijken; je wachtwoord en e-mailadres blijven privé.
5. Laat deze drie vakjes **leeg**:
   - Add a README file
   - Add .gitignore
   - Choose a license
6. Klik op de groene knop **Create repository**.

> 🖼️ **Wat je ziet (screenshot-beschrijving)**
> Je komt nu op een bijna lege pagina. Bovenaan staat je repositorynaam
> `travel-monkey`. In het midden staat "Quick setup" en een link met de tekst
> **uploading an existing file**. Die link heb je in de volgende stap nodig.
> Zie je die link niet? Klik dan op **Add file** en daarna op **Upload files**.

---

## 4. Stap 3: Bestanden uploaden via de GitHub website

Je gebruikt hier geen terminal en geen FTP. Je sleept de bestanden gewoon in je
browser.

### 4.1 Open de juiste map op je computer

Open de uitgepakte map `travel-monkey` op je computer. Je ziet daarin onder
andere:

```text
app
components
data
lib
public
package.json
package-lock.json
next.config.mjs
tailwind.config.ts
postcss.config.mjs
tsconfig.json
```

Je gaat zo **de inhoud van deze map** uploaden, niet de map zelf.

> **Belangrijk:** sleep niet de map `travel-monkey` als geheel naar GitHub.
> Dan komt alles in een extra submap terecht en werkt de site niet. Je moet de
> bestanden en mappen *binnen* `travel-monkey` selecteren en uploaden.

### 4.2 Uploaden

1. Ga terug naar je lege repository op GitHub.
2. Klik op **uploading an existing file**. Je kunt ook op **Add file** en
   daarna op **Upload files** klikken.
3. Open op je computer de map `travel-monkey`.
4. Selecteer alles wat **in** de map zit:
   - Op Windows: `Ctrl + A`.
   - Op Mac: `Cmd + A`.
   - Of sleep met je muis een selectie om alle bestanden en mappen heen.
5. Sleep de selectie naar het grote uploadvak in je browser.
6. Wacht tot alle bestanden in de lijst staan. Dit kan bij de foto's een minuut
   of twee duren. De mapstructuur blijft automatisch bewaard.
7. Scroll naar beneden. Onder **Commit changes** staat een invulveld. Laat daar
   iets staan als `Eerste versie van Travel Monkey`.
8. Klik op de groene knop **Commit changes**.

> 🖼️ **Wat je ziet (screenshot-beschrijving)**
> Tijdens het uploaden zie je een lange lijst met bestandsnamen en groene
> vinkjes. Na het opslaan kom je op de pagina van je repository. Daar moeten
> bovenaan de mappen `app`, `components`, `data`, `lib` en `public` staan, én
> het losse bestand `package.json`. Staat alles in een mapje met de naam
> `travel-monkey`? Dan heb je per ongeluk de bovenliggende map geüpload. Zie
> sectie 9 voor de oplossing.

**Wat je vooral niet uploadt**

- `node_modules` — een enorme map met software. Vercel haalt die zelf op.
- `.next` — een tijdelijke bouwmap. Die hoort niet op GitHub.
- `.npm-cache` — een tijdelijke downloadmap.
- `.DS_Store` — een onzichtbaar bestand van Mac. Niet nodig.

Als je deze mappen in je projectmap ziet staan: sla ze over. De ontvangen map is
al schoon, dus in de normale situatie zie je ze niet.

**Gaat het uploaden in delen?** GitHub kan bij veel bestanden vragen om het in
meerdere keren te doen. Dat is niet erg. Upload de rest, klik opnieuw op
**Commit changes** en ga door. De bestanden komen allemaal in dezelfde
repository terecht.

**Wat is een commit?** Een commit is een opgeslagen momentopname. Je hoeft dit
maar één keer per upload te doen; daarna is je versie opgeslagen.

---

## 5. Stap 4: Vercel account maken en koppelen aan GitHub

Vercel is de dienst die je website bouwt en online zet.

1. Ga naar **vercel.com**.
2. Klik op **Sign Up**.
3. Kies **Continue with GitHub**. Dit is het makkelijkst: je hoeft dan geen
   nieuw wachtwoord te bedenken.
4. Klik op **Authorize Vercel** als GitHub om toestemming vraagt.
5. Kies bij de vraag welk plan je wilt voor het **Hobby**-plan. Dat is gratis
   en vraagt geen creditcard.
6. Vul eventueel je naam in en klik de vragenlijst weg. Je hoeft geen team aan
   te maken.

> 🖼️ **Wat je ziet (screenshot-beschrijving)**
> Je komt op het Vercel-dashboard. Links staan "Overview" en "Projects".
> Rechtsboven zie je je profiel. In het midden staat een knop **Add New...**
> met daarnaast een plusje. Als je die ziet, ben je klaar voor de volgende stap.

**Wat is Vercel precies?** Vercel is de plek waar je website draait. Het leest
je GitHub-bestanden, bouwt de site en zet hem op een gratis webadres. Je hoeft
zelf geen server aan te zetten.

---

## 6. Stap 5: Je project deployen op Vercel

"Deployen" betekent: je website voor het eerst publiceren.

1. Klik in Vercel op **Add New...** en daarna op **Project**.
2. Je ziet nu een lijst met GitHub-repositories. Zoek **travel-monkey** en klik
   op **Import**.
   - Staat je repository er niet bij? Klik op **Adjust GitHub App
     Permissions**, geef Vercel toegang tot je repository en kom terug.
3. Op het volgende scherm laat je alles staan zoals het is:
   - **Framework Preset:** Next.js (Vercel herkent dit zelf).
   - **Root Directory:** leeg of `./`.
   - **Build and Output Settings:** standaard.
   - **Environment Variables:** niets invullen. Er zijn geen sleutels nodig.
4. Klik op **Deploy**.
5. Wacht ongeveer één tot drie minuten. Je ziet een logboek langslopen met
   regels als "Compiling", "Generating static pages" en "Build Completed".
6. Als het klaar is, verschijnt **Congratulations!** met een knop **Visit**.

> 🖼️ **Wat je ziet (screenshot-beschrijving)**
> Tijdens het bouwen zie je een zwart scherm met groene en witte regels tekst.
> Dat is normaal: Vercel installeert de benodigde software (npm-pakketten) en
> bouwt de pagina's. Je hoeft niets in te typen. Onderaan verschijnt een groene
> knop **Visit** zodra alles gelukt is.

**Wat doet Vercel automatisch?** Vercel installeert de software die in
`package.json` staat (dat is wat npm normaal doet), bouwt de Next.js-site en zet
hem online. Daarom hoef jij geen terminal te openen.

**Geen environment variables?** Klopt. De kaart gebruikt OpenStreetMap, de
foto's staan in de projectmap en er is geen database of API-sleutel nodig.

---

## 7. Stap 6: Je site bekijken

1. Klik op **Visit**.
2. Je site opent in een nieuw tabblad.
3. Je krijgt een gratis adres dat eindigt op `.vercel.app`, bijvoorbeeld:

   `travel-monkey.vercel.app`

   Is die naam al door iemand anders gebruikt? Dan plakt Vercel er soms een
   paar extra tekens achter, zoals `travel-monkey-abc123.vercel.app`. Dat is
   normaal. Je kunt de naam later aanpassen bij **Settings → General → Project
   Name**.
4. Scroll op de homepage naar beneden. Bij de wereldkaart kun je op de ronde
   cluster met **3 plekken** klikken. Kies daarna **Zoom in op de pins** om de
   losse plekken te zien.
5. Open de route via **Reizen → 3 weken Bali** en klik op een genummerde pin.
6. Bewaar je webadres in je favorieten of deel het met iemand.

> 🖼️ **Wat je ziet (screenshot-beschrijving)**
> Bovenaan je eigen site staat het bruine logo met het aapje, de naam Travel
> Monkey en het menu Reizen, Tips, Verhalen en Over ons. Daaronder begint de grote
> titel "Reis verder dan de gebaande paden." Je bent klaar: dit is jouw live
> website.

> **De site lijkt nog oud of ververst niet?**
> Wacht een minuutje en ververs de pagina met `Ctrl + R` (Windows) of
> `Cmd + Shift + R` (Mac). Vercel doet soms heel even over een nieuwe versie.

### Later iets aanpassen

Je kunt teksten later wijzigen zonder code te schrijven:

1. Ga naar je repository op GitHub.
2. Open `data` → `routes` → `bali-3-weken.json`.
3. Klik rechtsboven op het potloodje.
4. Pas bijvoorbeeld een prijs of een tip aan.
5. Scroll naar beneden en klik op **Commit changes**.
6. Vercel merkt de wijziging automatisch op en bouwt de site opnieuw. Na een
   minuut staat je aanpassing online.

Hetzelfde werkt voor de blogs in `data` → `blog` en voor de kaartpunten in
`data/locations.json`. Let op de aanhalingstekens en komma's: die moeten blijven
staan. Twijfel je? Wijzig alleen de tekst tussen de aanhalingstekens.

---

## 8. Later: eigen domein koppelen

Dit is optioneel. Je site werkt al zonder eigen domein.

1. Koop een domein bij een provider, bijvoorbeeld `travelmonkey.nl`. Reken op
   ongeveer €10 tot €15 per jaar.
2. Ga in Vercel naar je project en klik op **Settings** → **Domains**.
3. Typ je domein in en klik op **Add**.
4. Vercel laat zien welke gegevens je bij je domeinprovider moet invullen. Dat
   zijn meestal een paar regels met de naam **DNS**. DNS is het adressenboek
   van het internet: daarmee vertel je dat jouw domein naar Vercel moet wijzen.
5. Vul die gegevens in op de website van je domeinprovider. Kopieer ze precies.
6. Wacht tot het groene vinkje in Vercel verschijnt. Dat kan enkele minuten
   duren, soms een paar uur.
7. Vercel regelt ook gratis de beveiliging met het slotje (HTTPS).

Je hoeft geen oude website of server over te zetten. Als je nog geen eigen
domein hebt, sla je deze stap gewoon over.

---

## 9. Als iets niet werkt

Hieronder staan de drie fouten die het vaakst voorkomen. Lees rustig en
verander steeds maar één ding.

### Fout 1: Ik krijg een 404 of "There is nothing here yet"

**Wat je ziet:** De site opent wel, maar toont "404", "This page could not be
found" of "There is nothing here yet". Of Vercel zegt dat het geen `app`-map
kan vinden.

**Wat er waarschijnlijk mis is:** De bestanden staan in een extra submap. Op
GitHub moet je bovenaan `app`, `components`, `data`, `lib`, `public` en
`package.json` zien. Zie je eerst een map met de naam `travel-monkey` en pas
daarin de rest? Dan zit alles één laag te diep.

**Oplossing:**

1. Verwijder de repository op GitHub: ga naar **Settings**, scroll helemaal
   naar beneden en kies **Delete this repository**.
2. Maak een nieuwe repository met dezelfde naam (stap 2).
3. Upload opnieuw, maar sleep nu de **inhoud** van de map `travel-monkey` naar
   GitHub, niet de map zelf (stap 3).
4. Vercel pakt de nieuwe repository automatisch op, of importeer hem opnieuw
   via **Add New... → Project**.

### Fout 2: De deploy mislukt

**Wat je ziet:** Het logboek in Vercel stopt met een rode melding, bijvoorbeeld
"Build Failed" of "Module not found".

**Wat er waarschijnlijk mis is:** `package.json` staat niet in de hoofdmap, of
er is per ongeluk een map `node_modules` of `.next` geüpload. Die twee mappen
horen niet op GitHub en kunnen de bouw verstoren.

**Oplossing:**

1. Controleer bovenaan je repository of `package.json` er los tussen staat.
2. Staan `node_modules` of `.next` er wél? Maak dan een nieuwe repository en
   upload alleen de bronmappen `app`, `components`, `data`, `lib`, `public` en
   de losse bestanden `package.json`, `package-lock.json`, `next.config.mjs`,
   `tailwind.config.ts`, `tsconfig.json` en `postcss.config.mjs`.
3. Klik in Vercel bij het project op **Deployments** en daarna op **Redeploy**
   zodra de bestanden goed staan.
4. Blijft het misgaan? Kopieer de laatste rode regel uit het logboek en vraag
   iemand om hulp. Bewerk niets in de code als je niet zeker weet wat het doet.

### Fout 3: De kaart blijft leeg of grijs

**Wat je ziet:** De rest van de pagina werkt, maar het kaartvlak is leeg, grijs
of blijft laden.

**Wat er waarschijnlijk mis is:** Een adblocker of privacy-extensie blokkeert de
kaarttegels, of je internetverbinding is tijdelijk traag. De kaart heeft geen
API-sleutel nodig, maar haalt wel kaarttegels van OpenStreetMap op.

**Oplossing:**

1. Open je site in een incognito- of privévenster.
2. Schakel tijdelijk je adblocker uit voor jouw `.vercel.app`-adres.
3. Wacht tien seconden en ververs de pagina.
4. Probeer het op een ander netwerk, bijvoorbeeld je mobiele internet.
5. Werkt de rest van de site wel en de kaart niet? Dan is je website verder in
   orde. De kaart vult zich zodra de tegels kunnen laden.

### Nog steeds vast?

Je hoeft niets te weten van code om hulp te vragen. Stuur deze drie dingen mee:

- de link naar je site;
- de link naar je GitHub-repository;
- de laatste rode regel uit het Vercel-logboek, of een screenshot van wat je
  ziet.

Daarmee kan iemand je meestal binnen een paar minuten verder helpen.

---

**Klaar?** Dan heb je nu een echte website, een GitHub-repository en een gratis
Vercel-adres. Je kunt de site vanaf nu delen, en later teksten of foto's
aanpassen zonder opnieuw te hoeven beginnen.

---

## 10. Automatisch nieuwe artikelen (elke dag)

Vanaf nu kan de site zichzelf vullen: elke dag komen er vijf nieuwe artikelen
bij, zonder dat je computer aan hoeft te staan.

**Zo werkt het**

1. Vercel start elke dag om 05:00 UTC de GitHub-workflow via `/api/cron/content`
   (06:00 of 07:00 Nederlandse tijd).
2. Het script `scripts/generate.mjs` schrijft vijf complete reisroutes,
   verspreid over de zeven werelddelen.
3. Elke route krijgt vaste stops met een dagindeling, twee of drie
   activiteiten met een prijs, praktische informatie en een paklijst.
4. Bij elke route zoekt het script een omslagfoto en een foto per stop via
   Pixabay, downloadt die, verkleint hem en slaat hem op in
   `public/images/posts`. De fotograaf komt onder de omslagfoto te staan.
5. De routes worden als JSON in `data/routes` gezet en gecommit, samen met de
   foto's. Vercel bouwt de site automatisch opnieuw.

Je hoeft dus niets te doen: geen laptop aan, geen knop indrukken.

### Eenmalig instellen (ongeveer 20 minuten)

**A. De planning (Vercel)**

GitHub-planners zijn op nieuwe repositories onbetrouwbaar: de cron vuren daar
soms helemaal niet. Daarom start Vercel de workflows. Voeg in Vercel
(**Settings → Environment Variables**) twee variabelen toe:

- `CRON_SECRET` — een zelfverzonnen lange tekst, bijvoorbeeld 32 willekeurige
  tekens. Vercel stuurt die mee als wachtwoord.
- `GITHUB_DISPATCH_TOKEN` — een *fine-grained* GitHub-token met alleen
  **Actions: Read and write** voor deze repository.
- `GITHUB_REPO` — optioneel, standaard `jorismulkens/travel-monkey`.

Na een nieuwe deploy staan de crons in `vercel.json` en starten ze de workflows
op de ingestelde tijden. Handmatig starten via **Actions** blijft werken.

**B. De inhoud**

1. Zorg dat je project in een GitHub-repository staat (stap 2 en 3 hierboven).
2. Maak een OpenAI-sleutel op **platform.openai.com** → *API keys* →
   *Create new secret key*. Stel bij *Limits* een maandbedrag in, bijvoorbeeld
   5 dollar. Dat is ruim genoeg.
2. Maak een gratis Pixabay-sleutel: log in op **pixabay.com** en ga naar
   **pixabay.com/api/docs**. Bovenaan de pagina staat jouw sleutel.
3. Ga in GitHub naar **Settings → Secrets and variables → Actions** en voeg
   twee secrets toe:
   - `OPENAI_API_KEY`
   - `PIXABAY_API_KEY`
4. Ga naar **Settings → Actions → General → Workflow permissions** en kies
   **Read and write permissions**. Zonder dit mag de bot niets committen.
5. Test het één keer met de hand: **Actions → Nieuwe reisverhalen →
   Run workflow**.

### Wat het ongeveer kost

Een paar artikelen per dag met het standaardmodel (`gpt-4o-mini`) kost
ongeveer een paar dollar per maand. Pixabay en GitHub Actions zijn gratis.

Twee praktische dingen over de foto's:

- Pixabay staat niet toe dat je hun afbeeldingen blijft hotlinken. Daarom
  downloadt het script elke foto en zet hem in `public/images/posts`. Een route
  heeft een omslagfoto plus een foto per stop: reken op ongeveer 300 KB per
  route, dus zo'n 45 MB per maand.
- De Pixabay-licentie vraagt geen naamsvermelding, maar we zetten de fotograaf
  toch onder elk artikel.

### Kwaliteit en eerlijkheid

De generator schrijft als **Redactie**, niet als Mila, en zet onder elk
automatisch artikel een regel dat het automatisch is samengesteld. Het script
krijgt de opdracht geen hotels of restaurants te verzinnen, geen exacte prijzen
te noemen en geen visa-eisen te beweren. Lees de eerste week toch even mee: AI
is niet altijd betrouwbaar.

### Aanpassen

| Wat | Waar |
| --- | --- |
| Aantal per dag | `POSTS_PER_DAY` in de workflow, of het invoerveld bij handmatig starten |
| Aantal stops | `SYSTEM_PROMPT` in `scripts/generate.mjs` |
| Model | GitHub → Settings → Variables → `OPENAI_MODEL` |
| Onderwerpen | `data/topics.json` — voeg bestemmingen of tips-onderwerpen toe |
| Stoppen | GitHub → Actions → de workflow → *Disable workflow* |
| Toon of regels | `SYSTEM_PROMPT` in `scripts/generate.mjs` |

### Lokaal testen

```bash
npm run generate:mock   # offline, maakt vijf voorbeeldartikelen
npm run generate:dry    # echte API, maar schrijft niets weg
npm run generate        # echte run
```

### Grenzen

- De lijst met onderwerpen raakt een keer op. Breid `data/topics.json` dan uit.
- De site wordt trager om te bouwen naarmate er meer artikelen bijkomen.
- Controleer af en toe of de feiten nog kloppen, zeker bij prijzen en regels.

---

## 11. Automatisch op TikTok

De nieuwste routes kunnen automatisch als TikTok-fotocarrousel worden
geplaatst. Dat gebeurt via [upload-post.com](https://www.upload-post.com).

**Zo werkt het**

1. Vercel start elke dag om 06:30 UTC de social-workflow via `/api/cron/social`.
   Die pakt de nieuwste routes die nog niet gepost zijn.
2. Per route worden zeven slides gebouwd:
   - een kaart met genummerde stops,
   - een slide per stop met daglabel, titel, korte tekst en prijs,
   - een slotslide met de link naar de route.
3. Upload-post plaatst de slides als TikTok-foto-post met caption en hashtags.
4. In `data/social-posted.json` staat welke routes al gepost zijn, zodat niets
   twee keer langskomt.

**Eenmalig instellen**

1. Maak een account op **upload-post.com**. Let op: TikTok-posten vereist een
   betaald plan (vanaf ongeveer 24 dollar per maand).
2. Koppel je TikTok-account in het dashboard en maak een **profiel** aan,
   bijvoorbeeld `travelmonkey`.
3. Maak een **API key** aan onder *API Keys*.
4. Zet in GitHub twee dingen klaar:
   - secret `UPLOAD_POST_API_KEY` met de API key;
   - variable `UPLOAD_POST_PROFILE` met de profielnaam.
5. Test het: **Actions → Social media → Run workflow**. Zet `dry_run` op
   `true` om alleen de slides te bouwen, daarna een keer zonder.

**Aanpassen**

| Wat | Waar |
| --- | --- |
| Aantal posts per dag | `SOCIAL_POSTS_PER_DAY`, standaard 2 |
| Eén specifieke route | invoerveld `slug` bij handmatige run |
| Slides ontwerpen | `scripts/social/render.mjs` |
| Caption en hashtags | `caption()` in `scripts/social/render.mjs` |
| Stoppen | GitHub → Actions → Social media → *Disable workflow* |

**Lokaal testen**

```bash
npm run social:dry                      # slides bouwen + caption tonen
npm run social:render -- --route <slug> # alleen de slides
```

