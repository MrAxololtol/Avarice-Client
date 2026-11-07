/*
 * Avarice Client - turns the Avarice theme on once, if it was picked on the setup screen.
 * Goes through Vencord's own settings so nothing gets overwritten.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "./settings";

const THEME = "avarice.theme.css";

try {
    const s = Settings.store as any;
    if (s.avariceTheme === "pending") {
        const vs = (window as any).Vencord?.Settings;
        if (vs) {
            const enabled: string[] = Array.isArray(vs.enabledThemes) ? vs.enabledThemes : [];
            if (!enabled.includes(THEME)) vs.enabledThemes = [...enabled, THEME];
            s.avariceTheme = "applied";
        }
    }
} catch (e) {
    console.error("[Avarice] Failed to enable theme:", e);
}
