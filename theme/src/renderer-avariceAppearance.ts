/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Avarice Client contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "./settings";

export const performanceModes = {
    ultrafast: "Ultrafast — no UI motion or blur",
    mid: "Mid — CSS animations at 12 fps",
    full: "Full — original motion and effects"
} as const;

export const palettes = {
    original: ["Original", "", "", ""],
    slate: ["Blue slate", "#101925", "#192738", "#a8caff"],
    forest: ["Pine", "#0c1a17", "#173028", "#95dac0"],
    violet: ["Black iris", "#171222", "#282036", "#cfb5f9"],
    ember: ["Ember", "#201512", "#352322", "#ffb69e"]
} as const;

const styleText = `
:root[data-av-palette] :is(.theme-dark,.theme-light,.theme-midnight,.theme-darker,.visual-refresh),
:root[data-av-palette] {
    --av-chat: var(--av-tone) !important; --av-base: var(--av-panel) !important;
    --av-void: color-mix(in srgb,var(--av-tone) 80%,black) !important;
    --av-raise: var(--av-panel) !important; --av-raise-2: color-mix(in srgb,var(--av-panel) 88%,white) !important;
    --background-base-lowest: var(--av-void) !important; --app-frame-background: var(--av-void) !important;
    --background-base-low: var(--av-base) !important; --background-base-lower: var(--av-base) !important;
    --chat-background-default: var(--av-chat) !important; --background-primary: var(--av-chat) !important;
    --background-secondary: var(--av-base) !important; --background-tertiary: var(--av-void) !important;
    --background-surface-high: var(--av-raise) !important; --background-floating: var(--av-raise) !important;
    --text-link: var(--av-accent) !important; --header-primary: #fff !important; --text-normal: #eceff3 !important;
    --text-default: #eceff3 !important; --text-muted: #abb2be !important; color-scheme: dark;
}
:root[data-av-glass], :root[data-av-glass] :is(#app-mount,[class*="appMount_"],[class*="app_"]) {
    background: transparent !important;
}
:root[data-av-glass], :root[data-av-glass] :is(.theme-dark,.theme-light,.theme-midnight,.theme-darker,.visual-refresh) {
    --av-void: transparent !important; --av-base: transparent !important; --av-chat: transparent !important;
    --background-base-lowest: transparent !important; --background-base-lower: transparent !important;
    --background-base-low: transparent !important; --app-frame-background: transparent !important;
    --background-primary: transparent !important; --background-secondary: transparent !important;
    --background-secondary-alt: transparent !important; --background-tertiary: transparent !important;
    --chat-background-default: transparent !important; --bg-overlay-chat: transparent !important;
    --bg-overlay-app-frame: transparent !important; --home-background: transparent !important;
    --av-raise: var(--av-panel,#17202b) !important; --modal-background: var(--av-raise) !important;
    --background-floating: var(--av-raise) !important; --input-background-default: var(--av-raise) !important;
    --text-default: #f4f5f7 !important; --text-normal: #f4f5f7 !important; --text-muted: #c4c9d2 !important;
}
:root[data-av-glass] body { background: rgb(9 12 17 / var(--av-tint,0.55)) !important; }
:root[data-av-glass] :is([class*="messageContent_"],[class*="name_"]) { text-shadow: 0 1px 3px #000; }
:root[data-av-glass] :is([role="dialog"],[role="menu"]) { background-color: var(--av-panel,#17202b) !important; }
:root[data-av-speed="ultrafast"] *, :root[data-av-speed="ultrafast"] *::before, :root[data-av-speed="ultrafast"] *::after {
    animation-duration: .001ms !important; animation-delay: 0s !important; animation-iteration-count: 1 !important;
    transition-duration: 0s !important; transition-delay: 0s !important; scroll-behavior: auto !important;
    backdrop-filter: none !important;
}
:root[data-av-speed="ultrafast"] #app-mount::after { content: none !important; }
`;

const originalEasings = new WeakMap<AnimationEffect, string>();
function sampleAnimation(animation: Animation) {
    const { effect } = animation;
    if (!(animation instanceof CSSAnimation) || !effect) return;
    const timing = effect.getTiming();
    if (typeof timing.duration !== "number" || timing.duration <= 0) return;
    if (!originalEasings.has(effect)) originalEasings.set(effect, timing.easing ?? "linear");
    effect.updateTiming({ easing: `steps(${Math.max(1, Math.round((timing.duration * 12) / 1000))}, end)` });
}

function startAppearance() {
    const style = document.createElement("style");
    style.textContent = styleText;
    document.head.append(style);
    const root = document.documentElement;
    const changeMotion = (event: AnimationEvent) => {
        if (root.dataset.avSpeed === "mid" && event.target instanceof Element)
            event.target.getAnimations().forEach(sampleAnimation);
    };
    const apply = () => {
        const settings = Settings.store as any;
        const mode = Object.hasOwn(performanceModes, settings.avaricePerformance) ? settings.avaricePerformance : "mid";
        if (root.dataset.avSpeed !== mode) {
            root.dataset.avSpeed = mode;
            for (const animation of document.getAnimations()) {
                if (mode === "mid") sampleAnimation(animation);
                else if (animation.effect && originalEasings.has(animation.effect)) {
                    animation.effect.updateTiming({ easing: originalEasings.get(animation.effect) });
                    originalEasings.delete(animation.effect);
                }
            }
        }
        const palette = palettes[settings.avaricePalette as keyof typeof palettes];
        if (palette?.[1]) {
            root.dataset.avPalette = settings.avaricePalette;
            root.style.setProperty("--av-tone", palette[1]);
            root.style.setProperty("--av-panel", palette[2]);
            root.style.setProperty("--av-accent", palette[3]);
        } else {
            delete root.dataset.avPalette;
            for (const key of ["--av-tone", "--av-panel", "--av-accent"]) root.style.removeProperty(key);
        }
        root.toggleAttribute("data-av-glass", settings.avariceSeeThrough === true);
        root.style.setProperty("--av-tint", String(Math.min(85, Math.max(0, settings.avariceGlassTint ?? 55)) / 100));
    };
    const keys = ["avaricePerformance", "avaricePalette", "avariceSeeThrough", "avariceGlassTint"];
    const changed = (_: unknown, path: string) => {
        if (!path || keys.includes(path)) apply();
    };
    Settings.addGlobalChangeListener(changed);
    document.addEventListener("animationstart", changeMotion, true);
    apply();
    window.addEventListener(
        "pagehide",
        () => {
            Settings.removeGlobalChangeListener(changed);
            document.removeEventListener("animationstart", changeMotion, true);
            style.remove();
        },
        { once: true }
    );
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startAppearance, { once: true });
else startAppearance();
