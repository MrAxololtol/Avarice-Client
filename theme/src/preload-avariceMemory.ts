/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Avarice Client contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webFrame } from "electron/renderer";

import { VesktopNative } from "./VesktopNative";

let timer: ReturnType<typeof setTimeout> | undefined;
function onVisibilityChange() {
    clearTimeout(timer);
    if (!document.hidden) return;
    timer = setTimeout(() => {
        if (!document.hidden || (VesktopNative.settings.get() as any).avaricePerformance !== "ultrafast") return;
        const unused = Object.values(webFrame.getResourceUsage()).reduce(
            (sum, entry) => sum + entry.size - entry.liveSize,
            0
        );
        if (unused >= 32 * 1024 * 1024) webFrame.clearCache();
    }, 60_000);
}

document.addEventListener("visibilitychange", onVisibilityChange);
window.addEventListener(
    "pagehide",
    () => {
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
    },
    { once: true }
);
