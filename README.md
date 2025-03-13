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


## Hvað á eftir að gera:

1. Seeda 50 raðir í heildina í database = Óli gerði þetta og notaði faker til að búa til gögn
2. Finna út úr cloudinary/imgix/mux myndum
3. Setja upp ESLint = Óli setti upp ESLint en á eftir að kanna villurnar sem það sendir inn
4. Skrifa Tests = Óli setti upp test fyrir 4 endpoint með jest
5. Runna tests og debugga API = þetta er ennþá allt í böggi og þarf að laga
6. Klára magn af pull requests
7. Hýsa með databaseinum
8. Skrifa Readme