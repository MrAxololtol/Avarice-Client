# Avarice Client — handoff notes

Avarice Client = **Vesktop** (Vencord's Electron desktop app) rebranded, with a custom theme, setup screen and client-side extras.
Nothing is a fork you have to maintain by hand: `rebrand.mjs` applies every change to a fresh Vesktop checkout, so updating = pull Vesktop + rerun the script.

## Folder layout (Desktop)

```
avarice-client/              <- the kit (this is "the source")
  build.bat                  full build: installer + portable zip (slow, compressed)
  quick-build.bat            installer only, no compression (faster, bigger)
  test-setup.bat             app only, wipes the test copy's data, launches it (use this while developing)
  rebrand.mjs                applies ALL changes to ../Vesktop (safe to rerun)
  logo.png / tray.png / trayUnread.png
  theme/
    first-launch.html        the glass setup screen with the animated contour lines
    badges/*.ico             taskbar unread badges (1-9, 10 = "9+", 11 = dot)
    discord/avarice.theme.css   the Discord theme (knobs at the top of the file)
    src/main-avariceTheme.ts        -> src/main/avariceTheme.ts   (copies theme into Vencord's themes dir every launch)
    src/renderer-avariceTheme.ts    -> src/renderer/avariceTheme.ts (enables the theme once if picked on setup)
    src/renderer-avariceExtras.ts   -> src/renderer/avariceExtras.ts (Nitro plugins, name/badges/aura/shop cosmetics)
    src/AvariceSettings.tsx         -> src/renderer/components/settings/AvariceSettings.tsx (the "Avarice" settings section)
Vesktop/                     <- build workspace (git clone of Vencord/Vesktop, rewritten by rebrand.mjs)
  dist/ or dist-NNNNN/       build output (see "Known issues")
```

Build needs Git + Node.js LTS (build.bat installs them via winget if missing) and pnpm.

## What rebrand.mjs does

- Name/app id/exe: "Avarice Client", `dev.avarice.client`, `Avarice Client.exe` (Linux: `avarice-client`)
- Icons everywhere (app, installer, tray with auto-resize, splash, taskbar badges)
- Replaces visible "Vesktop" strings (skips URLs and `src/renderer/patches` — those names are internal to Vencord, don't rename)
- Setup screen: frameless transparent window (620x710) + new html; adds `avariceTheme` / `avariceNitro` choices
- Bundles the theme and hooks the extras + settings section into main.ts / renderer/index.ts / Settings.tsx

## Status

| Feature | Status |
|---|---|
| Rebrand, icons, installer, portable zip | Working (Windows: NSIS/Zip, Linux: AppImage/tar.gz/unpacked) |
| Setup screen (glass + moving lines, monotone) | Working |
| Avarice theme | Working (confirmed in Shop screenshot) |
| Taskbar badges (smaller, black ring, Inter font) | Built, not confirmed by user |
| FakeNitro + USRBG auto-enable on setup | Built, not confirmed (check Settings > Vencord > Plugins) |
| Client-side display name / username | Built, not confirmed |
| Client-side badges | Built, not confirmed |
| Profile aura (glow around own avatar) | Built, not confirmed |
| Profile theme colours (client-side) | Built, not confirmed |
| Shop cosmetics picker (decorations / effects / nameplates) | **Patched: snake_case sku_id + prototype getters implemented** |
| Nitro app themes (gradient presets in Appearance > Preview Theme) | Built, not confirmed: non-Nitro only gets a preview, so `watchGradient()` in renderer-avariceExtras.ts records the Flux action that turned the preset on (`avariceGradientAction`) and replays it when Discord clears it and on launch. Settings > Avarice > Remove app theme clears it. Theme CSS drops its backgrounds while `html.avarice-gradient` is set; upsell banner/button hidden by text match |

## Current bug: shop catalog = 0

Debug output (Settings > Avarice > Copy debug info):
```
lastLoad=/collectibles-categories:ok(+0) /collectibles-shop:ok(+0) /collectibles-categories/v2:ok(+0)
stores=565 shopLike=7  (CollectiblesCategoryStore, CollectiblesShopStore, ... found)
```

1. **REST responses are snake_case.** The API calls succeed but `findProducts()` only matches items with `skuId`.
   Raw API JSON uses `sku_id` (and `store_listing`, etc.). Accept both spellings in `findProducts()` and
   `ingestCategories()` (`item.skuId ?? item.sku_id`, `product.skuId ?? product.sku_id`). Likely fixes it on its own.
2. **Store data isn't in own properties.** `Object.keys(store)` only shows base Flux fields. Data is behind prototype
   methods/getters. In `refreshAvariceCatalog()`, list `Object.getOwnPropertyNames(Object.getPrototypeOf(store))`
   and call the zero-arg getters (e.g. `getCategories`, `getProducts`, `categories`) before scanning.
3. After the catalog fills: verify the **field names used to apply items** in `applyAvariceCosmetics()`
   (`avatarDecorationData`/`avatarDecoration`, `collectibles.nameplate`, `profileEffect`/`profileEffectId` on the
   UserProfileStore profile). These were taken from public sources, not tested live. Profile effects are the most likely to need changes.
   Preview image URLs in `previewFor()` are also guesses for effects and nameplates.

Debugging tip: Ctrl+Shift+I opens DevTools in the app (if not, enable it in Avarice settings > Developer options).
`Vencord.Webpack.findStore("CollectiblesCategoryStore")` in the console lets you inspect the store directly.

## Known issues / gotchas

- **Locked build folder (EBUSY):** if any program has `dist\win-unpacked\resources\app.asar` open (the Claude desktop app
  does this if it browsed that folder; also a running Avarice), the build can't delete it. build.bat then builds into
  `dist-NNNNN` and writes the folder name to `last-build-folder.txt`. Quit the locking app to clean up old folders.
- Don't click inside the build terminal: Windows "select mode" pauses it (press Esc).
- The 7-Zip / installer steps print nothing for a few minutes — normal.
- `pnpm 12.16.1 vs 12.18.0` warning and `missing optional dependency @vencord/venmic` are harmless.
- Windows search may show stale `avarice-client.exe` entries from older builds until it re-indexes.
- The setup screen only shows on first launch. `test-setup.bat` resets the test copy's data; for an installed copy,
  delete `%APPDATA%\Avarice Client` (logs you out).

## Intentional decisions (keep them)

- Client-side badges exclude trust badges (Discord Staff, Partner, Certified Moderator, Bug Hunter) so the client
  can't be used to fake official-looking screenshots.
- All cosmetics are client-side only; only FakeNitro's emoji/sticker links and HD streaming are visible to others.
- Monotone palette, red only for mentions/unread/danger.

## To do

1. Fix the shop catalog (above), then test applying each cosmetic type.
2. Confirm the untested features in the Status table.
3. Optional: display name styles (glowing font) and animated avatar, client-side.
4. Optional: style the rest of the app (settings page, splash) to match the setup screen.

## Legal / sharing

- Vesktop and Vencord are GPL-3.0: if you share builds, publish your source (this kit + the Vesktop tag it was built from) and keep LICENSE.
- Client mods break Discord's ToS; FakeNitro more directly than themes. Bans are rare but possible.
