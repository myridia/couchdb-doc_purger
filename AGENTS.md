# AGENTS.md — couchdb-doc_purger

## What this is
Node.js npm module that fully purges deleted CouchDB documents (including tombstones) across databases and/or servers.

## Stack
- Node.js
- CouchDB HTTP API
- xmlhttprequest

## Build
```bash
npm install
```

## Run
```js
var i = require('couchdb-doc_purger');
i.dbs['foo-db'] = { 'http://host:5984' : { user: 'foo', pass: 'bar' } };
i.purge_dbs();
i.purge_servers();
```
```bash
node example.js
```

## Structure
- `index.js` — main module (purge logic)
- `example.js` — usage example
- `package.json` — npm metadata/deps

## Conventions
- No comments in code unless asked.
- No credentials in committed files.
- Verify: `node -c index.js`