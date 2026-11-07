# Avarice Client

A Discord desktop client: **Vesktop** (Vencord's desktop app) rebranded, with a black-glass monotone theme,
an animated glass setup screen, custom tray/taskbar badges and client-side profile extras.

- **New here? Start with [SETUP.md](SETUP.md)** — from zero to a running build.
- **Picking up the project? Read [HANDOFF.md](HANDOFF.md)** — file map, status, current bug, to-do list.

## Contents

```
build.sh / build.bat            full release build (Linux: AppImage + tar.gz / Win: installer + zip)
quick-build.sh / quick-build.bat  fast build (Linux: AppImage / Win: uncompressed installer)
test-setup.sh / test-setup.bat    dev build: unpacked app only, launched fresh with isolated data
rebrand.mjs                     applies every Avarice change to a clean Vesktop checkout
logo.png, tray.png, trayUnread.png
theme/
  first-launch.html  setup screen
  badges/            taskbar unread badges (.ico)
  discord/           Discord theme (avarice.src.css -> avarice.theme.css) + line pattern
  src/               TypeScript/TSX injected into Vesktop (theme install, extras, settings section)
tools/               generators for the line pattern, badges and theme CSS (Python)
LICENSE              GPL-3.0 (inherited from Vesktop/Vencord)
```

Based on [Vesktop](https://github.com/Vencord/Vesktop) and [Vencord](https://github.com/Vendicated/Vencord) (GPL-3.0).
