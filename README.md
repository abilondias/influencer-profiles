# Influencer Profiles

## Running the application

### Versions

- **node**: >= v22.10.0
- **npm**: >= v11.0.0

### Running locally

Clone the repository

```sh
git clone https://github.com/abilondias/influencer-profiles.git
cd influencer-profiles
```

Install dependencies

```sh
npm i
```

Create the database

```sh
npm run db:create
```

Start development server

```sh
npm run dev
```

Access at: http://localhost:3000

## Running local Playwright tests

Requires the server to be running at `http://localhost:3000`.

Run Playwright tests

```sh
npm run test
```

Run Playwright tests with trace enabled

```sh
npm run test:trace
```
