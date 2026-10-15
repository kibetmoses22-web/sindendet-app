#!/usr/bin/env node
// Copies ALL site data (submissions, media, roster, settings, activity) from
// one Netlify site to another. Run on your own computer — see MIGRATION.md.
//
//   OLD_SITE_ID=... OLD_TOKEN=... NEW_SITE_ID=... NEW_TOKEN=... node scripts/migrate-blobs.js
//   (add --dry-run to only count what would be copied)
//
// Safe to re-run: items already present in the new site are skipped, so if it
// stops halfway (network drop, laptop sleeps) just run it again.
const { getStore } = require('@netlify/blobs');

const STORES = ['submissions', 'media', 'roster', 'settings', 'activity'];
const { OLD_SITE_ID, OLD_TOKEN, NEW_SITE_ID, NEW_TOKEN } = process.env;
const DRY = process.argv.includes('--dry-run');

if (!OLD_SITE_ID || !OLD_TOKEN || !NEW_SITE_ID || !NEW_TOKEN) {
  console.error('Missing OLD_SITE_ID, OLD_TOKEN, NEW_SITE_ID or NEW_TOKEN — see MIGRATION.md');
  process.exit(1);
}
if (OLD_SITE_ID === NEW_SITE_ID) {
  console.error('OLD_SITE_ID and NEW_SITE_ID are the same — nothing to do.');
  process.exit(1);
}

async function listAll(store) {
  const keys = [];
  for await (const page of store.list({ paginate: true })) {
    for (const b of page.blobs) keys.push(b.key);
  }
  return keys;
}

(async () => {
  let copied = 0, skipped = 0, failed = 0;
  for (const name of STORES) {
    const from = getStore({ name, siteID: OLD_SITE_ID, token: OLD_TOKEN });
    const to = getStore({ name, siteID: NEW_SITE_ID, token: NEW_TOKEN });
    const keys = await listAll(from);
    console.log(`\n[${name}] ${keys.length} item(s) found`);
    if (DRY) continue;
    const existing = new Set(await listAll(to));
    let i = 0;
    for (const key of keys) {
      i++;
      if (existing.has(key)) { skipped++; continue; }
      try {
        const entry = await from.getWithMetadata(key, { type: 'arrayBuffer' });
        if (!entry) { failed++; console.log(`  ! ${key} vanished, skipped`); continue; }
        await to.set(key, entry.data, { metadata: entry.metadata || {} });
        copied++;
        if (i % 25 === 0 || name === 'media') console.log(`  ${name}: ${i}/${keys.length}  ${key}`);
      } catch (err) {
        failed++;
        console.log(`  ! ${key} failed: ${err.message}`);
      }
    }
  }
  console.log(`\nDone. Copied ${copied}, already there ${skipped}, failed ${failed}.`);
  if (failed) { console.log('Re-run the same command to retry the failed ones.'); process.exitCode = 2; }
})();
