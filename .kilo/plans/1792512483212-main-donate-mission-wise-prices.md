# Plan: Main Donate page reads tab data from shared mission config, UI unchanged

## Goal
`src/pages/Donation2.jsx` (`/donate` main page) must show **updated mission data** (title, subtitle, description, icon) read from `src/data/missions.js` — the same source used by mission pages and QuickDonate — instead of hard-coded values. The UI/layout/colors/sizes/behavior stay **exactly as they are**: tabs switcher, project cards (icon/title/desc), iframe donation card, BankDetails, 80G tax box. Only the data source changes so updated mission data propagates automatically.

## Current state
- `src/pages/Donation2.jsx` hard-codes the `tabs` array inline (label/icon/title/desc/src).
- Each tab loads a static iframe (`public/donations/donation-<slug>.html`).
- `src/pages/QuickDonate.jsx` already reads prices live from `src/data/missions.js`.
- `src/data/missions.js` holds `missions`, `KEY_TO_SLUG`, `MISSION_IMAGES`, etc.

## Decision (resolved)
Keep Donation2.jsx UI exactly as-is. Only change data sourcing:
- Import `missions`, `KEY_TO_SLUG` from `../data/missions.js`.
- Build `tabs` array from `missions`: `label`/`title` from `cfg.name`, `desc` from `cfg.subtitle`, `icon` from first tab's icon, `src` kept as existing per-mission iframe path.
- Do NOT remove iframes (UI unchanged). Keep the postMessage iframe-height handler.
- Do NOT add chips/amount-input/info-box/total-form to Donation2.jsx (that UI lives in QuickDonate.jsx which already reads config).
- Map tabs to config keys; flag any without entries.

## Affected files
- `src/pages/Donation2.jsx` — primary change: import from `src/data/missions.js`, derive `tabs` from config, keep all CSS/structure/behavior identical.
- No changes to `src/data/missions.js`, `src/pages/QuickDonate.jsx`, mission pages, `BankDetails.jsx`, `public/donations/*.html`.

## Tab → config key mapping
| Main-page tab | Config key | Notes |
|---|---|---|
| Mission Annapurna | annapurna | matched |
| Mission Vidya | vidhya | matched |
| Mission Aurat | aurat | matched |
| Mission Bezubaan | bezubaan | matched |
| Mission Atmanirbhar | atmanirbhar | matched |
| Mission Arogya | arogya | matched |
| Mission Eco Warriors | ecoWarriors | matched |
| Sevak Nivas | sevakSevaKendra | mapped (name differs; config/mission pages say "Sevak Seva Kendra") |

All tabs have a config entry; none unmatched.

## Validation
- `npx vite build` passes.
- `npx oxlint` introduces no new errors in `src/pages/Donation2.jsx`.
- Open `/donate`: each mission tab title/subtitle/description/icon matches `src/data/missions.js`; iframe still loads per mission; switching tabs updates card content from config.
- No hard-coded `label`/`title`/`desc`/`icon` remain for missions (only iframe `src` strings kept as-is).

## Out of scope
- Removing/replacing iframes (UI must stay unchanged).
- Adding chips/amount-input/info-box/total-form to Donation2.jsx (does not exist here; QuickDonate.jsx already has it).
- Regenerating `public/donations/*.html`.
