# Avarice Client — setup from zero

Follow this top to bottom on a Linux or Windows PC. Takes about 5–15 minutes the first time.

## 1. Put the source in place

1. Unpack `Avarice Client Source.zip` into `avarice-client`.
2. The build scripts clone/update a sibling folder called **`Vesktop`** next to it:
```
Desktop/ (or any working directory)
  avarice-client/   <- this source
  Vesktop/          <- created by the build (Vencord's Vesktop source, rebranded automatically)
```

## 2. Tools you need

### Linux
- **Git**, **Node.js LTS**, and **pnpm** (installed via package manager or `npm install -g --prefix ~/.local pnpm`).
- Optional: Python 3 + `pip install pillow` (for `tools/`).

### Windows
- `build.bat` installs **Git** and **Node.js LTS** by itself through `winget` if missing.
- pnpm is installed automatically by the script.

## 3. First build (test copy)

### On Linux:
Run:
```bash
./test-setup.sh
```
It:
1. Closes any running Avarice Client,
2. Clones Vesktop into `../Vesktop` (first time) or updates it,
3. Runs `rebrand.mjs` (applies every Avarice change),
4. Installs dependencies and compiles the app into `dist/linux-unpacked/`,
5. Launches a test instance with an isolated test data folder so the setup screen shows.

### On Windows:
Double-click **`test-setup.bat`**.

On the setup screen keep **Avarice Theme** and **Nitro Perks** on, click **Let's go**, log in to Discord.
The app reloads once by itself (that's the Nitro plugins switching on).

## 4. Making a release for other people

| Linux Script | Windows Script | Output (in `../Vesktop/dist`) | Use |
|---|---|---|---|
| `./build.sh` | `build.bat` | `Avarice Client-x.y.z.AppImage` + `.tar.gz` (Win: Setup `.exe` + `.zip`) | sharing / release |
| `./quick-build.sh` | `quick-build.bat` | AppImage only (Win: uncompressed installer) | fast build for yourself |
| `./test-setup.sh` | `test-setup.bat` | `linux-unpacked/` (Win: `win-unpacked/`), launches fresh | development |

To share: zip the Setup `.exe` (browsers and file hosts often block raw `.exe` downloads) and upload it to
Google Drive / Mega / MediaFire. People get a "Windows protected your PC" warning: **More info -> Run anyway**
(the app isn't code-signed).

Custom logo: drag a square PNG (1024x1024) onto `build.bat`, or replace `logo.png` (+ `tray.png`, `trayUnread.png`).

## 5. Developing

- All changes live in **this folder**. Never edit `../Vesktop` by hand: every build resets it and reapplies `rebrand.mjs`.
- Workflow: edit files here -> `test-setup.bat` -> check -> repeat.
- DevTools inside the app: `Ctrl+Shift+I` (or Avarice Client settings -> Developer options).
  Useful console calls: `Vencord.Webpack.findStore("CollectiblesCategoryStore")`, `Vencord.Settings.plugins.FakeNitro`.
- Where things go (see `HANDOFF.md` for the full map):
  - Discord theme: `theme/discord/avarice.src.css`, then `python tools/build_theme_css.py`
  - Setup screen: `theme/first-launch.html`
  - Client-side features: `theme/src/renderer-avariceExtras.ts` + `theme/src/AvariceSettings.tsx`
  - Anything else in Vesktop: add a step to `rebrand.mjs` (keep each step idempotent — safe to run twice).

## 6. Version pinning (recommended before sharing builds)

`build.bat` currently builds Vesktop's **latest `main`**, so a Vesktop update can change things underneath you.
To pin, change the clone line in `build.bat` to a release tag, e.g.:
```
git clone --branch v1.6.9 --depth 1 https://github.com/Vencord/Vesktop "..\Vesktop"
```
and replace `git pull` with nothing (or `git fetch --tags && git checkout <tag>` when you choose to update).

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| `EBUSY: resource busy or locked ... app.asar` | Something has the old build open (Avarice running, or an app that browsed the folder). The script builds into `dist-NNNNN` instead; close the other app to clean up. |
| Build window looks frozen | Packing steps print nothing for minutes. If you clicked in it, press Esc. |
| `pnpm ... configured to use 12.16.1` warning | Harmless. |
| `missing optional dependencies @vencord/venmic` | Harmless on Windows (Linux screen-share audio only). |
| Setup screen doesn't appear | It only shows on first launch. `test-setup.bat` resets the test copy. For an installed copy delete `%APPDATA%\Avarice Client` (logs you out). |
| Theme missing | Discord settings -> Vencord -> Themes -> enable `avarice.theme.css`. |
| `winget` not found | Install Git + Node.js by hand (step 2). |

## 8. Open work & fixed items

- **Fixed:** Shop cosmetics picker now supports Discord's REST snake_case `sku_id` schema and scans store prototype getters/methods.
- Remaining work: test applying specific profile effect animations live on Discord's latest canary/stable builds. See **HANDOFF.md**.

## 9. License

Vesktop and Vencord are GPL-3.0 (see `LICENSE`). If you distribute builds, you must also publish this source
(and say which Vesktop version it was built from). Client mods break Discord's Terms of Service.
