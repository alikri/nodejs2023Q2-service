# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## In order to perform a cross-check review, please follow the steps:

### Downloading:
```
git clone https://github.com/alikri/nodejs2023Q2-service.git
```
### Navigation to the correct folder:
```
cd nodejs2023Q2-service
```
### Navigation to the correct branch:
```
git checkout library-part2
```
### Installing NPM modules
```
npm install
```
### Creating local vartiables from example file:
```
cp .env.example .env
```
### Run docker-compose:
```
npm run up
```
### Run Database Migrations:
```
npm run seed:migrations
```
### Run tests:
```
npm run test
```
### Run vulnerability scan:
```
npm run vuln-scan
```
### Shut Down Docker Containers
```
npm run down
```


### to open swagger follow the link:  [http://localhost:4000/doc/](http://localhost:4000/doc/) 

### Check for lint errors:
```
npm run lint
```
