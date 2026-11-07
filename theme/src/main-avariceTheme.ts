/*
 * Avarice Client - keeps the bundled Avarice theme in Vencord's themes folder.
 * Copied on every launch so app updates also update the theme.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

import { STATIC_DIR } from "shared/paths";

import { VENCORD_THEMES_DIR } from "./constants";

export const AVARICE_THEME_FILE = "avarice.theme.css";

try {
    mkdirSync(VENCORD_THEMES_DIR, { recursive: true });
    copyFileSync(join(STATIC_DIR, "avarice", AVARICE_THEME_FILE), join(VENCORD_THEMES_DIR, AVARICE_THEME_FILE));
} catch (e) {
    console.error("[Avarice] Failed to install theme:", e);
}
