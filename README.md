# playground
Let's Play

Development
-
Install dependencies and run the dev server (Vite):

```bash
npm install
npm run dev
```

Local API mock functions are under `functions/api/devices/index.js` (Pages Functions). To run Cloudflare Pages locally with functions and D1 you'll need `wrangler` configured and an account; see `wrangler.toml`.

Using D1 (Cloudflare SQLite)

- Schema and seed SQL are in `db/schema.sql` and `db/seed.sql`.
- Create a D1 database in your Cloudflare account (dashboard or `wrangler d1 create`) and set the `binding`/`account_id` in `wrangler.toml`.
- To run Pages locally with functions (requires `wrangler`):

```bash
npm install
# run Vite dev for static frontend
npm run dev

# or run Pages with functions locally (requires wrangler login + Pages setup):
npm run dev:pages
```

To apply schema/seed to a D1 database, you can use `wrangler d1` commands or the Cloudflare dashboard. Example (may require adjustment for your wrangler version):

```bash
# create database (one-time)
wrangler d1 create PLAYGROUND_DB --project playground

# execute schema / seed
wrangler d1 execute --database PLAYGROUND_DB --file db/schema.sql
wrangler d1 execute --database PLAYGROUND_DB --file db/seed.sql
```

The Pages Function at `functions/api/devices/index.js` now queries the bound D1 instance (`D1`) instead of returning mock data.

Next steps:
- Design D1 schema (if you want fields changed) and implement additional API endpoints (search, filters).
- Implement SAP Fiori styling with UI5 Web Components in the UI. (deferred)

Static frontend

- The app now serves static HTML pages: `index.html` (device list) and `device.html` (device detail).
- Shared client script: `static/app.js` — fetches `/api/devices` and renders the pages.

To run locally (serves static files and functions):

```bash
npm run dev
# or run Pages locally with wrangler if you prefer functions-based routing:
npm run dev:pages
```

Local D1 created by `wrangler`:

- I ran `wrangler d1 create` and applied `db/schema.sql` + `db/seed.sql` locally. The created local database id is `9ae96eb1-4c3d-4a02-b026-c041f866e780` and is referenced in `wrangler.toml`.
- If you want the database created in your Cloudflare account (remote), run the same `wrangler d1 create` without `--local`/with account context and set `account_id` in `wrangler.toml`.


