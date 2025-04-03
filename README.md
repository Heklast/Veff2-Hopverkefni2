# Veff2-Hopverkefni1

## Keyra verkefni

**Builda verkefni:**

```bash
npm build
```

**Seeda database**

```bash
npx prisma migrate reset

node prisma/seed.js
```

**Keyra test:**

```bash
npm run test
```

**Keyra framenda og bakenda í dev:**

Hér er seeding líka, passa að hreinsa fyrst ef búið að seeda áður

´´´bash

frontend/npm run dev

npm run dev
```

### Admin aðgangur:

username: admin
email: admin@admin.com
password: admin

## Route í vefþjónustu og viðkomandi aðgerð:

**admin.js:**

GET /

Lýsing: Sækir allar notendur úr gagnagrunninum.
Öryggisathuganir: Krefst þess að notandi sé innskráður og hafi admin réttindi.
Svar: Skilar JSON fylki með öllum notendum.

**auth.js:**

POST /register

Lýsing: Skráir nýjan notanda í kerfið.
Inntak:
username (notandanafn)
email (netfang)
password (lykilorð)
Svar: Skilar staðfestingu um að aðgangur hafi verið búinn til og upplýsingum um nýskráðan notanda.

POST /login

Lýsing: Innskráning notanda.
Inntak:
email og
password
Svar: Skilar JWT tokeni ásamt notandanafni ef innskráningin gengur vel. Ef ekki, skilar villuskilaboðum um ógilt netfang eða lykilorð.

**categories.js:**

GET /categories

Lýsing: Sækir lista yfir flokka.
Parameters:
page (síða, sjálfgefið 1)
limit (fjöldi atriða á síðu, sjálfgefið 10)
Svar: Skilar JSON hlut sem inniheldur:
data: Fylki af flokkum
currentPage: Núverandi síða
totalPages: Heildarfjöldi síða
totalCount: Heildarfjöldi flokka

GET /categories/:id

Lýsing: Sækir einn flokk með tilteknu ID.
Svar: Ef flokkurinn finnst, skilar hann sem JSON; annars skilar 404 villu með skilaboðum um að flokkurinn hafi ekki verið fundinn.

POST /categories

Lýsing: Býr til nýjan flokk.
Inntak:
name (nafn á flokki, skylda)
description (lýsing, valfrjálst)
Öryggisathuganir: Krefst þess að notandi sé innskráður og hafi admin réttindi.
Svar: Skilar nýja flokknum ef búið er að búa hann til.

PUT /categories/:id

Lýsing: Uppfærir upplýsingar um flokk eftir ID.
Inntak:
name og/eða description
Öryggisathuganir: Krefst admin réttinda.
Svar: Skilar uppfærðum flokki eða villuskilaboðum ef flokkurinn finnst ekki.

DELETE /categories/:id

Lýsing: Eyðir flokki með tilteknu ID.
Öryggisathuganir: Krefst admin réttinda.
Svar: Skilar staðfestingu á eyðingu eða villuskilaboðum ef flokkurinn finnst ekki.

**orders.js:**

GET /orders

Lýsing: Sækir pöntunarskrár.
Athugasemd:
Ef notandi er admin, eru allar pöntunarskrár sóttar.
Ef ekki, þá eru aðeins þeirra eigin pöntunarskrár sóttar.
Parameters:
page (síða, sjálfgefið 1)
limit (fjöldi á síðu, sjálfgefið 10)
Svar: Skilar JSON hlut með:
data: Fylki af pöntunum
currentPage, totalPages og totalCount

GET /orders/:id

Lýsing: Sækir eina pöntun með tilteknu ID.
Öryggisathuganir:
Admin getur sótt hvaða pöntun sem er.
Annars má aðeins sækja eigin pöntun.
Svar: Skilar pöntuninni eða villuskilaboðum ef ekki heimilað aðgang.

POST /orders

Lýsing: Býr til nýja pöntun fyrir innskráðan notanda.
Inntak:
items: Fylki af hlutum þar sem hver hlut inniheldur:
productId
quantity
Aðgerðir:
Sannprófun á birgðum og útreikning á heildarverði.
Uppfærir einnig birgðamagn vörunnar í gagnagrunninum.
Svar: Skilar nýju pöntuninni ef búið er að búa hana til.

PUT /orders/:id

Lýsing: Uppfærir stöðu pöntunar, til dæmis:
Admin getur breytt stöðu (t.d. úr "Pending" í "Shipped").
Notandi getur hætt við sína pöntun ef hún er enn "Pending".
Öryggisathuganir: Notandi þarf að vera admin eða eigandi pöntunarinnar.
Svar: Skilar uppfærðri pöntun eða villuskilaboðum ef ekki heimilað aðgang.

DELETE /orders/:id

Lýsing: Eyðir pöntun með tilteknu ID.
Öryggisathuganir: Notandi þarf að vera admin eða eigandi pöntunarinnar.
Svar: Skilar staðfestingu á eyðingu eða villuskilaboðum ef ekki heimilað aðgang.

**products.js:**

GET /products

Lýsing: Sækir lista yfir vörur.
Parameters:
page (síða, sjálfgefið 1)
limit (fjöldi á síðu, sjálfgefið 10)
Svar: Skilar JSON hlut með vörunum og síða upplýsingu.

GET /products/:id

Lýsing: Sækir eina vöru með tilteknu ID ásamt flokksupplýsingum.
Svar: Skilar upplýsingum um vöru eða villuskilaboðum ef vöru finnst ekki.

POST /products

Lýsing: Býr til nýja vöru.
Inntak:
name, description, price, stock, categoryId
Öryggisathuganir: Krefst þess að notandi sé innskráður og hafi admin réttindi.
Svar: Skilar nýrri vöru ef búið er að búa hana til.

PUT /products/:id

Lýsing: Uppfærir upplýsingar um vöru eftir ID.
Inntak:
name, description, price, stock, categoryId
Öryggisathuganir: Krefst admin réttinda.
Svar: Skilar uppfærðri vöru eða villuskilaboðum ef vöru finnst ekki.

DELETE /products/:id

Lýsing: Eyðir vöru með tilteknu ID.
Öryggisathuganir: Krefst admin réttinda.
Svar: Skilar staðfestingu á eyðingu eða villuskilaboðum ef vöru finnst ekki.

POST /products/:id/image

Lýsing: Hleður upp mynd fyrir tiltekna vöru.
Inntak:
Myndaskrá (multipart/form-data)
Aðgerðir:
Myndin er staðfest með multer (leyfilegar eru aðeins JPG og PNG).
Myndin er síðan hlaðin á Cloudinary og vöruupplýsingar uppfærðar með slóð á myndina.
Öryggisathuganir: Krefst innskráningar og admin réttinda.
Svar: Skilar uppfærðri vöru með nýju myndinni eða villuskilaboðum ef upphleðsla mistókst.

**reviews.js:**

GET /reviews

Lýsing: Sækir lista yfir umsagnir.
Parameters:
page (síða, sjálfgefið 1)
limit (fjöldi á síðu, sjálfgefið 10)
Svar: Skilar JSON hlut sem inniheldur:
data: Fylki af umsögnum
currentPage, totalPages og totalCount

POST /reviews

Lýsing: Býr til nýja umsögn fyrir vöru.
Inntak:
productId (vöruauðkenni)
rating (mat á vöru, skylda)
comment (athugasemd, valfrjálst)
Öryggisathuganir: Notandi verður að vera innskráður.
Svar: Skilar nýrri umsögn ef búið er að búa hana til.

PUT /reviews/:id

Lýsing: Uppfærir umsögn eftir tilteknu ID.
Inntak:
rating og/eða comment
Öryggisathuganir:
Eigandi umsagnarinnar eða admin getur uppfært umsögnina.
Svar: Skilar uppfærðri umsögn eða villuskilaboðum ef ekki heimilað aðgang.

DELETE /reviews/:id

Lýsing: Eyðir umsögn með tilteknu ID.
Öryggisathuganir:
Eigandi umsagnarinnar eða admin getur eytt umsögninni.
Svar: Skilar staðfestingu á eyðingu eða villuskilaboðum ef ekki heimilað aðgang.

## Dæmi um kall í vefþjónustu m.v. test gögn:

**Dæmi 1: Innskráning (POST /login)**

Kall til að skrá sig inn sem admin (test gögnin gera admin notanda með tölvupóst "admin@admin.com" og lykilorðið "admin"):

```bash
curl --location --request POST 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@admin.com",
    "password": "admin"
}'
```

**Dæmi 2: sækja lista yfir vörur (GET /Products):**
```bash
curl --location --request POST 'http://localhost:3000/orders' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data-raw '{
    "items": [
        {"productId": 1, "quantity": 2},
        {"productId": 3, "quantity": 1}
    ]
}'

```

## Tól notuð:
 
Express framework fyrir REST API endapunkta

PostgreSQL fyrir gagnagrunn með hjálp frá Prisma

Cloudinary fyrir myndir

Jest fyrir prófanir

ESLint skrá og Github actions

Faker til að generatea gögn

bcrypt og JWT token fyrir auðkenningu

React app router fyrir framenda

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


## Nöfn og notendanöfn allra í hóp:

Ólafur Marel Árnason - olimarel

Hekla Scheving Thorsteinsson - heklast

