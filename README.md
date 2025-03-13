## Veff2-Hopverkefni1

## Setja upp verkefni
**Hlaða niður helstu pökkum:**

npm install

**Setja upp prisma:**

npx prisma init

## Til að seeda database:
Hreinsa fyrst (ef þarf) = npx prisma migrate reset

Keyra: node prisma/seed.js

**Keyra test:**

npm run test

**Keyra einfaldan framenda:**

npm start

## Admin aðgangur:
username: admin
email: admin@admin.com
password: admin


## Til að seeda database:
Hreinsa fyrst (ef þarf) = npx prisma migrate reset
Keyra: node prisma/seed.js

# Til að komast interactive í database:
psql -h localhost -d hopverkefni -U oli


## Tól notuð:
 
Express framework fyrir REST API endpoints

PostgreSQL fyrir gagnagrunn með hjálp frá Prisma

Cloudinary fyrir myndir

Jest fyrir prófanir

ESLint

Faker til að generatea gögn

## Einfaldur framendi coverage:

**Authentication:**

Staðfestir að hægt sé að stofna aðgang og logga sig inn með þeim aðgang.

**Products.js:**

Sýnir hvernig cloudinary tengir saman myndir með gögnum sem generateuð eru með Faker, sýnir einnig hvernig listi af vörum og flokkar þeirra eru geymd.

## Testing coverage

### auth.test.js
**Notendaskráning:**
- Prófar að notandi geti skráð sig með öllum nauðsynlegum upplýsingum (notandanafn, netfang, lykilorð).
- Sannreynir að skráning mistakist með 400 villu ef reitir vantar.

**Notendainnskráning:**
- Tryggir að nýskráður notandi geti skráð sig inn með réttum upplýsingum.
- sannreynir að gildu JWT token sé skilað við innskráningu.

**Aðgangsstýring fyrir admin-routes:**
- Athugar að notandi sem ekki er admin fái 401 villu við aðgang að admin-routes (t.d. GET /admin).

### orders.test.js
**Notendainnskráning fyrir pantanir:**
- Sannreynir að notandi geti skráð sig inn og fengið gilt token til að framkvæma pöntunaraðgerðir.

**Búa til pöntun:**
- Prófar hvort hægt sé að búa til pöntun þegar gildar vörur eru til staðar og að pöntunin skili réttum gögnum (eins og pöntunarnúmer og pöntunareiningum).
- Staðfestir að lageruppfærslur verði framkvæmdar eftir pöntun.

**Villumeðhöndlun:**
- Tryggir að pöntun án vara skili 400 villu með skilaboðum "No items provided".

### products.test.js

**Public product listar:**
- Sannreynir að GET /products endapunkturinn skili síuðum listum af vörum ásamt flokkaupplýsingum.

**Aðgangsstýring fyrir product POST:**
- Prófar að notandi sem ekki er admin geti ekki búið til vöru (skilar 401 villu með skilaboðinu "Not authorized").
- Sannreynir að admin geti búið til nýja vöru og að 201 status og vara-ID verði skilað.

### reviews.test.js
**Public review listar:**
- Sannreynir að GET /reviews skili síuðum listum af umsögnum ásamt tengdum vörum og notendum.

**Review sköpun auðkenningu:**
- Athugar að að reyna að búa til umsögn án gilt token skili 401 villu.
- Sannreynir að auðkennt notandi geti búið til umsögn.

**Uppfærslur á reviews:**
- Staðfestir að umsagnahafi geti uppfært sína umsögn (t.d. breytt einkunn og athugasemd).
- Prófar að notandi sem ekki er umsagnahafi (og ekki admin) geti ekki uppfært umsögn annarra (skilar 401 villu).
- Sannreynir að admin geti uppfært hvaða umsögn sem er.

**Deletion á reviews:**
- Prófar að aðeins umsagnahafi eða admin geti eytt umsögn.
- Sannreynir að admin geti eytt umsögn og skili árangurs skilaboðum.

**Til að runna frontend:**
npx prisma migrate reset --þetta er til að eyða úr databasei því annars kemur eh ves með unique bla

npm run dev


## Hvað á eftir að gera:

1. Seeda 50 raðir í heildina í database = Óli gerði þetta og notaði faker til að búa til gögn
2. Finna út úr cloudinary/imgix/mux myndum
3. Setja upp ESLint = Óli setti upp ESLint en á eftir að kanna villurnar sem það sendir inn
4. Skrifa Tests = Óli setti upp test fyrir 4 endpoint með jest (gæti vantað fleira)
5. Runna tests og debugga API = Test suites ættu núna bara að skila passes
6. Klára magn af pull requests
7. Hýsa með databaseinum
8. Skrifa Readme
9. Laga hvaða týpur af myndum eru leyfilegar!!
