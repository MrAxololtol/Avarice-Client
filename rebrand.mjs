// Avarice Client - rebrands Vesktop (Vencord's desktop app) into your own client.
//
// Usage, from INSIDE your cloned Vesktop folder:
//   node ../avarice-client/rebrand.mjs                 (uses the bundled logo.png)
//   node ../avarice-client/rebrand.mjs my-logo.png     (uses your own logo)
//
// Logo: square PNG, 1024x1024 recommended (minimum 512x512).
// Safe to run more than once.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const NAME = "Avarice Client";
const SLUG = "avarice-client";
const APP_ID = "dev.avarice.client";

const root = process.cwd();
const kitDir = path.dirname(fileURLToPath(import.meta.url));
const logo = path.resolve(process.argv[2] ?? path.join(kitDir, "logo.png"));
const p = (...a) => path.join(root, ...a);

if (!fs.existsSync(p("package.json")) || !fs.existsSync(p("src", "main"))) {
    console.error("Run this from inside the Vesktop folder (the one with package.json and src/).");
    process.exit(1);
}
if (!fs.existsSync(logo)) {
    console.error(`Logo not found: ${logo}`);
    process.exit(1);
}

// ---------- 1. package.json: name, app id, icons ----------
const pkg = JSON.parse(fs.readFileSync(p("package.json"), "utf8"));
pkg.name = SLUG;
pkg.productName = NAME;
pkg.description = NAME; // shown as the exe's name in Windows search / Task Manager

const b = (pkg.build ??= {});
b.appId = APP_ID;
b.productName = NAME;
b.executableName = NAME; // "Avarice Client.exe" on Windows
delete b.publish; // don't try to publish releases to Vencord's GitHub

fs.copyFileSync(logo, p("build", "avarice.png"));
// electron-builder turns this PNG into .ico (Windows) and .icns (macOS) itself
(b.win ??= {}).icon = "build/avarice.png";
(b.linux ??= {}).icon = "build/avarice.png";
b.linux.executableName = SLUG; // no spaces on Linux
(b.mac ??= {}).icon = "build/avarice.png";
if (b.dmg) b.dmg.icon = "build/avarice.png";

// macOS: drop Vesktop's compiled Assets.car icon so ours is used, and no Apple notarizing
if (b.mac.extendInfo) delete b.mac.extendInfo.CFBundleIconName;
b.mac.notarize = false;

const entry = b.linux.desktop?.entry;
if (entry) {
    entry.Name = NAME;
    entry.StartupWMClass = SLUG;
}
if (b.linux.maintainer) b.linux.maintainer = "Avarice Client";

fs.writeFileSync(p("package.json"), JSON.stringify(pkg, null, 4) + "\n");
console.log("✓ package.json rebranded");

// macOS build step that copies Assets.car - make it a no-op
const carScript = p("scripts", "build", "addAssetsCar.mjs");
if (fs.existsSync(carScript)) {
    let s = fs.readFileSync(carScript, "utf8");
    if (!s.includes("AVARICE")) {
        s = s.replace(/await copyFile\("build\/Assets\.car"[^;]*;/, "/* AVARICE: Vesktop Assets.car skipped */");
        fs.writeFileSync(carScript, s);
    }
}

// ---------- 2. Windows installer folder ----------
const nsh = p("build", "installer.nsh");
if (fs.existsSync(nsh)) {
    fs.writeFileSync(nsh, fs.readFileSync(nsh, "utf8").replace(/\$LocalAppData\\vesktop/g, `$LocalAppData\\${SLUG}`));
    console.log("✓ Windows installer path updated");
}

// ---------- 3. In-app icons: tray + splash ----------
// Uses the kit's tray.png / trayUnread.png (cropped head, unread dot) when present
// and no custom logo was given; otherwise falls back to the main logo.
const customLogo = Boolean(process.argv[2]);
const kitTray = path.join(kitDir, "tray.png");
const kitUnread = path.join(kitDir, "trayUnread.png");
const trayIcon = !customLogo && fs.existsSync(kitTray) ? kitTray : logo;
const unreadIcon = !customLogo && fs.existsSync(kitUnread) ? kitUnread : trayIcon;
for (const [f, src] of [["tray.png", trayIcon], ["trayTemplate.png", trayIcon], ["trayUnread.png", unreadIcon]]) {
    const t = p("static", "tray", f);
    if (fs.existsSync(t)) fs.copyFileSync(src, t);
}
// splash.html shows this at 128x128 and Chromium reads the PNG fine under the .webp name
if (fs.existsSync(p("static", "splash.webp"))) fs.copyFileSync(logo, p("static", "splash.webp"));
console.log("✓ tray + splash icons replaced");

// Tray loads the image at full size; shrink it so a 1024px logo fits the tray
const trayTs = p("src", "main", "tray.ts");
if (fs.existsSync(trayTs)) {
    let s = fs.readFileSync(trayTs, "utf8");
    if (!s.includes("avariceTrayImage")) {
        s = s.replace(/import \{([^}]*)\bTray\b([^}]*)\} from "electron";/, (m, a, z) =>
            m.includes("nativeImage") ? m : `import {${a}nativeImage, Tray${z}} from "electron";`);
        s = s.replace(/resolveAssetPath\(trayVariant\)/g, "avariceTrayImage(trayVariant)");
        s += `
async function avariceTrayImage(variant: Parameters<typeof resolveAssetPath>[0]) {
    const img = nativeImage.createFromPath(await resolveAssetPath(variant));
    if (img.getSize().width <= 64) return img;
    const size = process.platform === "darwin" ? 22 : 32;
    return img.resize({ width: size, height: size, quality: "best" });
}
`;
        fs.writeFileSync(trayTs, s);
        console.log("✓ tray icon auto-resize added");
    }
}

// Custom taskbar unread badges (1-9, 10 = "9+", 11 = dot)
const badgeDir = path.join(kitDir, "theme", "badges");
if (fs.existsSync(badgeDir) && fs.existsSync(p("static", "badges"))) {
    for (const f of fs.readdirSync(badgeDir)) {
        if (f.endsWith(".ico")) fs.copyFileSync(path.join(badgeDir, f), p("static", "badges", f));
    }
    console.log("✓ taskbar badges replaced");
}

// ---------- 3b. Custom first-launch screen (glass window, animated waves) ----------
const themeFL = path.join(kitDir, "theme", "first-launch.html");
if (fs.existsSync(themeFL)) {
    fs.copyFileSync(themeFL, p("static", "views", "first-launch.html"));
    const flTs = p("src", "main", "firstLaunch.ts");
    if (fs.existsSync(flTs)) {
        let s = fs.readFileSync(flTs, "utf8");
        if (!s.includes("AVARICE")) {
            s = s.replace(
                /transparent:\s*false,(\r?\n\s*)frame:\s*true,/,
                "transparent: true, // AVARICE: see-through glass window$1frame: false,$1alwaysOnTop: false,$1backgroundColor: \"#00000000\","
            );
            s = s.replace(/height:\s*550,(\r?\n\s*)width:\s*600/, "height: 710,$1width: 620");
            fs.writeFileSync(flTs, s);
        }
    }
    console.log("✓ custom first-launch screen installed");
}

// ---------- 3c. Avarice Discord theme (bundled, auto-installed, opt-in on setup screen) ----------
const themeCss = path.join(kitDir, "theme", "discord", "avarice.theme.css");
const srcDir2 = path.join(kitDir, "theme", "src");
if (fs.existsSync(themeCss)) {
    fs.mkdirSync(p("static", "avarice"), { recursive: true });
    fs.copyFileSync(themeCss, p("static", "avarice", "avarice.theme.css"));
    fs.copyFileSync(path.join(srcDir2, "main-avariceTheme.ts"), p("src", "main", "avariceTheme.ts"));
    fs.copyFileSync(path.join(srcDir2, "renderer-avariceTheme.ts"), p("src", "renderer", "avariceTheme.ts"));

    const inject = (file, after, line) => {
        let s = fs.readFileSync(file, "utf8");
        if (s.includes(line)) return true;
        const nl = s.includes("\r\n") ? "\r\n" : "\n";
        if (!s.includes(after)) return false;
        fs.writeFileSync(file, s.replace(after, after + nl + line));
        return true;
    };
    const ok1 = inject(p("src", "main", "main.ts"), 'import "./vesktopProtocol";', 'import "./avariceTheme";');
    const ok2 = inject(p("src", "renderer", "index.ts"), 'import "./rpc";', 'import "./avariceTheme";');

    // setup screen: remember the choice so the renderer can enable it
    const flTs = p("src", "main", "firstLaunch.ts");
    let s = fs.readFileSync(flTs, "utf8");
    if (!s.includes("avariceTheme")) {
        s = s.replace(/richPresence\?: "on";/, 'richPresence?: "on";\n    avariceTheme?: "on";');
        s = s.replace(
            /Settings\.store\.arRPC = !!data\.richPresence;/,
            'Settings.store.arRPC = !!data.richPresence;\n        (Settings.store as any).avariceTheme = data.avariceTheme ? "pending" : "off";'
        );
        fs.writeFileSync(flTs, s);
    }

    // ---- extras: Nitro plugins, client-side name / badges / aura, settings section ----
    fs.copyFileSync(path.join(srcDir2, "renderer-avariceAppearance.ts"), p("src", "renderer", "avariceAppearance.ts"));
    fs.copyFileSync(path.join(srcDir2, "preload-avariceMemory.ts"), p("src", "preload", "avariceMemory.ts"));
    if (!inject(p("src", "preload", "index.ts"), 'import { VesktopNative } from "./VesktopNative";', 'import "./avariceMemory";'))
        throw new Error("Cannot locate the preload entry point for Avarice memory settings");
    const windowFile = p("src", "main", "mainWindow.ts");
    const oldWindow = fs.readFileSync(windowFile, "utf8");
    const glassCondition = "if (transparent || (Settings.store as any).avariceSeeThrough === true)";
    if (!oldWindow.includes(glassCondition)) {
        if (!oldWindow.includes("if (transparent) {")) throw new Error("Cannot locate the main window transparency setting");
        fs.writeFileSync(windowFile, oldWindow.replace("if (transparent) {", glassCondition + " {"));
    }
    fs.copyFileSync(path.join(srcDir2, "renderer-avariceExtras.ts"), p("src", "renderer", "avariceExtras.ts"));
    fs.copyFileSync(
        path.join(srcDir2, "AvariceSettings.tsx"),
        p("src", "renderer", "components", "settings", "AvariceSettings.tsx")
    );
    inject(p("src", "renderer", "index.ts"), 'import "./avariceTheme";', 'import "./avariceExtras";');

    const setTsx = p("src", "renderer", "components", "settings", "Settings.tsx");
    inject(setTsx, 'import { WindowsTransparencyControls } from "./WindowsTransparencyControls";',
        'import { AvariceSettings } from "./AvariceSettings";');
    let st = fs.readFileSync(setTsx, "utf8");
    if (!st.includes('"Avarice": [AvariceSettings]')) {
        st = st.replace(/(const SettingsOptions[^=]*=\s*\{)/, '$1\n    "Avarice": [AvariceSettings],');
        fs.writeFileSync(setTsx, st);
    }

    s = fs.readFileSync(flTs, "utf8");
    if (!s.includes("avariceNitro")) {
        s = s.replace(/avariceTheme\?: "on";/, 'avariceTheme?: "on";\n    avariceNitro?: "on";');
        s = s.replace(
            /(\(Settings\.store as any\)\.avariceTheme = [^;]*;)/,
            '$1\n        (Settings.store as any).avariceNitro = data.avariceNitro ? "pending" : "off";'
        );
        fs.writeFileSync(flTs, s);
    }
    if (!fs.readFileSync(setTsx, "utf8").includes("AvariceSettings") || !s.includes("avariceNitro"))
        console.warn("! Avarice extras: some hooks not found");
    const ok3 = s.includes("avariceTheme");
    if (!(ok1 && ok2 && ok3)) console.warn("! Avarice theme: some hooks not found, theme may need enabling by hand");
    console.log("✓ Avarice theme bundled");
}

// ---------- 4. Visible "Vesktop" text -> "Avarice Client" ----------
// Only inside string literals, skips URLs and Vencord's internal patch names.
const SKIP = [path.join("src", "renderer", "patches")];
let changed = 0;
const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        const rel = path.relative(root, full);
        if (SKIP.some(s => rel.startsWith(s))) continue;
        if (e.isDirectory()) walk(full);
        else if (/\.(ts|tsx|js|mjs|html)$/.test(e.name)) {
            const src = fs.readFileSync(full, "utf8");
            const out = src.replace(/(["'`])([^"'`\n]*?)\bVesktop\b([^"'`\n]*?)\1/g, (m, q, a, z) =>
                m.includes("://") ? m : `${q}${a}${NAME}${z}${q}`.replace(/\bVesktop\b/g, NAME));
            if (out !== src) {
                fs.writeFileSync(full, out);
                changed++;
            }
        }
    }
};
walk(p("src"));
walk(p("static", "views"));
// HTML <title> tags etc.
for (const f of fs.readdirSync(p("static", "views"))) {
    const full = p("static", "views", f);
    if (f.endsWith(".html")) {
        const s = fs.readFileSync(full, "utf8");
        const out = s.replace(/>([^<]*?)\bVesktop\b([^<]*?)</g, (_m, a, z) => `>${a}${NAME}${z}<`);
        if (out !== s) fs.writeFileSync(full, out);
    }
}
console.log(`✓ UI text updated in ${changed} file(s)`);

console.log(`
Avarice Client is ready. Next:
  pnpm i          install dependencies
  pnpm start      run it to test
  pnpm package    build the installer (output in dist/)
`);
