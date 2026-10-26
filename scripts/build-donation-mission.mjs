/**
 * Generates public/donations/donation-mission.html from
 *   scripts/donation-mission.template.html
 * using the shared mission config in src/data/missions.js.
 *
 * EVERYTHING the main Donate page shows per mission / per sub-tab is
 * derived here from the ONE shared config the mission pages use:
 *   - header title + subtitle + icon
 *   - sub-tab names, icons and order
 *   - donation amount chips (first 6 price-row amounts, ascending)
 *   - default amount (first price row of the tab)
 *   - info box: title, tagline, description / services list,
 *     2 price cards (first + last price row), item note
 *
 * Run:  npm run build:donation
 */
import fs from 'node:fs';
import path from 'node:path';
import { missions, rowLabel, QUANTITIES, KEY_TO_SLUG } from '../src/data/missions.js';

const ROOT = path.resolve(process.cwd());
const TEMPLATE_FILE = path.join(ROOT, 'scripts', 'donation-mission.template.html');
const OUT_FILE = path.join(ROOT, 'public', 'donations', 'donation-mission.html');

// Same icon map as src/components/MissionDonate.jsx (config icon -> font-awesome)
const ICON_MAP = {
  basket: 'fa-shopping-basket',
  cookie: 'fa-cookie',
  utensils: 'fa-utensils',
  'bread-slice': 'fa-bread-slice',
  school: 'fa-school',
  'first-aid': 'fa-first-aid',
  laptop: 'fa-laptop',
  book: 'fa-book',
  robot: 'fa-robot',
  female: 'fa-female',
  'graduation-cap': 'fa-graduation-cap',
  'shield-heart': 'fa-shield-heart',
  heartbeat: 'fa-heartbeat',
  paw: 'fa-paw',
  dog: 'fa-dog',
  bone: 'fa-bone',
  cross: 'fa-cross',
  hammer: 'fa-hammer',
  'sewing-machine': 'fa-sewing-machine',
  briefcase: 'fa-briefcase',
  handshake: 'fa-handshake',
  hospital: 'fa-hospital',
  pills: 'fa-pills',
  'kidney-heart': 'fa-kidney-heart',
  headset: 'fa-headset',
  'shopping-bag': 'fa-shopping-bag',
  ambulance: 'fa-ambulance',
  'file-signature': 'fa-file-signature',
  tree: 'fa-tree',
  recycle: 'fa-recycle',
  dropleaf: 'fa-dropleaf',
  store: 'fa-store',
  cog: 'fa-cog',
  bicycle: 'fa-bicycle',
  'hand-pointer': 'fa-hand-pointer',
  eye: 'fa-eye',
  'umbrella-beach': 'fa-umbrella-beach',
};

// Mission header icons (same icons the main Donate page tabs already use)
const MISSION_ICONS = {
  annapurna: 'fa-utensils',
  vidhya: 'fa-graduation-cap',
  aurat: 'fa-fist-raised',
  bezubaan: 'fa-paw',
  atmanirbhar: 'fa-hand-holding-heart',
  arogya: 'fa-heartbeat',
  sevakSevaKendra: 'fa-home',
  ecoWarriors: 'fa-leaf',
};

// Every mission the main Donate page embeds (all entries of the shared config)
const MISSIONS = [
  'annapurna',
  'vidhya',
  'aurat',
  'bezubaan',
  'atmanirbhar',
  'arogya',
  'sevakSevaKendra',
  'ecoWarriors',
];

/**
 * The tab's price rows, in the exact order the mission page lists them:
 * items first, then quantity rows (same as MissionDonate.jsx chipRows).
 */
function rowsFor(tab) {
  const rows = [];
  if (tab.items && tab.items.length) {
    tab.items.forEach((item) => {
      rows.push({
        amount: item.amount,
        label: item.name + (item.weight ? ' ' + item.weight : ''),
      });
    });
  }
  if (tab.quantities && tab.quantities.length) {
    const up = tab.unitPrice || 0;
    tab.quantities.forEach((q) => {
      rows.push({
        amount: q * up,
        label: rowLabel(tab, q).replace(/^Donate\s+/i, ''),
      });
    });
  }
  // Tabs without explicit rows (config only has a unit price) fall back to the
  // shared default quantity list, exactly like the Quick Donate page does.
  if (!rows.length && tab.unitPrice) {
    QUANTITIES.forEach((q) => {
      rows.push({
        amount: q * tab.unitPrice,
        label: rowLabel(tab, q).replace(/^Donate\s+/i, ''),
      });
    });
  }
  return rows;
}

const config = {};
MISSIONS.forEach((key) => {
  const m = missions[key];
  if (!m) return;
  config[key] = {
    key,
    slug: KEY_TO_SLUG[key] || key,
    title: m.name,
    subtitle: m.subtitle,
    icon: MISSION_ICONS[key] || 'fa-heart',
    tabs: m.tabs.map((t) => {
      const rows = rowsFor(t);
      const amounts = rows.map((r) => r.amount).sort((a, b) => a - b);
      return {
        id: t.id,
        label: t.name,
        icon: ICON_MAP[t.icon] || 'fa-gift',
        title: t.name,
        desc: t.info || '',
        tagline: t.tagline || '',
        services: t.services || null,
        itemNote: t.itemNote || '',
        rows,
        // Donation Amount chips: first 6 price-row amounts, ascending
        chipAmounts: amounts.slice(0, 6),
        // Default amount: the first price row of the tab
        defaultAmount: rows.length ? rows[0].amount : (t.unitPrice || 1),
        // Info box price cards: first and last price row of the tab
        cards: rows.length
          ? [rows[0], rows[rows.length - 1]]
          : [],
      };
    }),
  };
});

const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
const out = template.replace('__MISSION_CONFIG__', JSON.stringify(config, null, 2));

fs.writeFileSync(OUT_FILE, out, 'utf8');
console.log('Generated ' + path.relative(ROOT, OUT_FILE) + ' for: ' + MISSIONS.join(', '));
