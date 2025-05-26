# mm-shop

> MM Shop

<img src="logo_mm.jpg" alt="Michael's Machines" width="100" height="auto" />

## Description

**MM Shop** e-commerce store built with `MERN` stack, and utilized 3rd-party APIs.

- Buyers browse the store categories, products and brands
- Sellers or Merchants manage their own brand components
- Admins manage and control the entire store components

### Features:

- `Node.js` provides the backend environment
- `Express` middleware is used to handle requests, routes
- `Mongoose` schemas to model the application data
- `React` for displaying UI components
- `Redux` to manage application's state
- `Redux Thunk` middleware to handle asynchronous redux actions

## Prerequisites

```yaml
# from Docker requirements
node.js: ^16.20.2

npm: 8.19.4
```

## Getting Started

### Docker Guide (Optional)

To run this project locally you **_can use docker compose_** in the repo.

Edit the **dockercompose.yml** file and update the the values for `MONGO_URI` and `JWT_SECRET`.

Then simply start the docker compose:

```bash
$ docker-compose build
$ docker-compose up
```

> #### We Don't Use Docker here ! ! !

### Database Seed

- The seed command will create an **admin** user in the database
- The `email` and `password` are passed with the command as arguments
- Like the command below, replace brackets with email and password.
- For more info, see code [here](server/utils/seed.js)

```bash
$ cd server
# This is just an example
$ npm run seed:db [your_admin@email.com] [your_admin_password]
```

### Env variables

Create `.env` file for both **client** and **server**. See examples:

- [Frontend ENV](client/.env.example)

- [Backend ENV](server/.env.example)

### Google Auth (OAuth2.0) `JSON` file

Create `client_secret_xxx_.json` file for **server**. See examples:

- [Google Auth JSON file](server/client_secret.apps.googleusercontent.com.json.example)

### Apple `AuthKey` file - `*.p8`

Create `.p8` file for **server**. See examples:

- [Apple AuthKey P8 file](server/AuthKey_8MWT8952R5.p8.example)

### Vercel Deployment (Optional Yet)

Both **frontend** and **backend** can be deployed on `Vercel` from the same repository.

When deploying on Vercel, make sure to specifiy the root directory as `client` and `server` when importing the repository.

See [client vercel.json](client/vercel.json) and [server vercel.json](server/vercel.json).

### Start Development

```bash
# install dependencies
$ npm install

# run local dev servers
$ npm run dev
```

Refer to [package.json](package.json):

```json

  "scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "postinstall": "npm-run-all --parallel install:*",
    "install:client": "cd client && npm install",
    "install:server": "cd server && npm install",
    "prestart": "cd client && npm run build",
    "start": "cd server && npm start",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

```

### Start Staging Server

```bash
# install dependencies
$ npm install

# run server
$ npm start
```

![Michael's Machines](logo_mm_names.gif)

---

&copy; 2014 - 2024 Michael's Machines, All Right Reserved.
