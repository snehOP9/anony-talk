# Local development

The repository root already contains the `server` and `client` applications, so contributors do not need to create or move into another project directory after cloning.

## Install everything

From the repository root:

```bash
npm run install-all
```

## Start both applications

```bash
npm run dev
```

The root script starts the backend and frontend together. The backend uses port `5000` by default and the Vite client uses port `5173`.

## Start one side only

Backend:

```bash
npm run server
```

Frontend:

```bash
npm run client
```

## Environment files

Keep secrets in local `.env` files and never commit API keys, JWT secrets, database files, or production credentials. Use the existing README configuration as the reference for local variables.
