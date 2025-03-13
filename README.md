## Veff2-Hopverkefni1

## npm pakkar:
npm install express
npm install dotenv
npm install pg
npm install jsonwebtoken
npm install bcryptjs
npm install cloudinary multer
npm install --save-dev nodemon
npm install --save-dev jest supertest
npm install --save-dev eslint
npx eslint --init
npm install prisma @prisma/client
npx prisma init
npm install @faker-js/faker
npm install --save-dev jest supertest



## Til að seeda database:
Hreinsa fyrst (ef þarf) = npm prisma migrate reset
Keyra: node prisma/seed.js

# Til að komast interactive í database:
psql -h localhost -d hopverkefni -U oli


## Tól notuð:
 
Express framework fyrir REST API endpoints

PostgreSQL fyrir gagnagrunn, Kannski nota ORM til að einfalda SQL query?

Cloudinary fyrir myndir

Jest fyrir prófanir

ESLint?

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


## Hvað á eftir að gera:

1. Seeda 50 raðir í heildina í database = Óli gerði þetta og notaði faker til að búa til gögn
2. Finna út úr cloudinary/imgix/mux myndum
3. Setja upp ESLint = Óli setti upp ESLint en á eftir að kanna villurnar sem það sendir inn
4. Skrifa Tests = Óli setti upp test fyrir 4 endpoint með jest (gæti vantað fleira)
5. Runna tests og debugga API = Test suites ættu núna bara að skila passes
6. Klára magn af pull requests
7. Hýsa með databaseinum
8. Skrifa Readme