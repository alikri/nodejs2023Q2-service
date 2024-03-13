# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## In order to perform a cross-check review, please follow the steps:

```
git clone https://github.com/alikri/nodejs2023Q2-service.git
```
```
git checkout library-part1
```
```
npm install
```
```
cp .env.example .env
```
```
npm run start
```
```
npm run test
```

to open swagger follow the link:  [http://localhost:4000/doc/](http://localhost:4000/doc/) 

to check for lint errors:
```
npm run lint
```

to generate migrations:
npx ts-node ./node_modules/typeorm/cli.js migration:generate -d ./src/data-source.ts ./src/migrations/InitialMigrationTable

to run migrations:

npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts


docker run --name postgres-container -e POSTGRES_USER=Iamuser -e POSTGRES_PASSWORD=Iampassword -e POSTGRES_DB=Iamdatabase -p 5432:5432 -d postgres