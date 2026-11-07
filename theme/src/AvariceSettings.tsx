/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Avarice Client contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Modal, openModal, useState, useMemo, createRoot, UserStore } from "@vencord/types/webpack/common";
import { palettes, performanceModes } from "renderer/avariceAppearance";
import {
    applyAvariceAura,
    applyAvariceCosmetics,
    applyAvariceIdentity,
    AVARICE_NITRO_BADGES,
    AVARICE_AURAS,
    AVARICE_BADGES,
    avariceShopDebug,
    loadAvariceShop,
    getCustomBadges,
    getAvariceCatalog,
    clearAvariceGradient
} from "renderer/avariceExtras";
import { useSettings } from "renderer/settings";

const row = { display: "flex", alignItems: "center", gap: "10px", margin: "6px 0" };
const input = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid var(--border-subtle, rgb(255 255 255 / 0.1))",
    background: "var(--input-background-default, rgb(0 0 0 / 0.3))",
    color: "var(--text-default, #fff)",
    font: "inherit",
    marginTop: "6px"
};
const label = {
    display: "block",
    color: "var(--header-primary, #fff)",
    fontWeight: 600,
    marginBottom: "14px"
};
const hint = { color: "var(--text-muted, #888)", fontSize: "12px", fontWeight: 400 };

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))",
    gap: "8px",
    maxHeight: "320px",
    overflowY: "auto" as const,
    paddingRight: "4px"
};
const tile = (selected: boolean) => ({
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    height: "104px",
    padding: "8px 6px",
    borderRadius: "10px",
    cursor: "pointer",
    background: selected ? "rgb(255 255 255 / 0.1)" : "rgb(255 255 255 / 0.03)",
    border: selected ? "1px solid #e9e9ec" : "1px solid var(--border-subtle, rgb(255 255 255 / 0.08))",
    color: "var(--text-default, #fff)",
    font: "inherit"
});
const tileImg = { width: "60px", height: "60px", objectFit: "contain" as const };
const tileName = {
    fontSize: "11px",
    lineHeight: "13px",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    color: "var(--text-muted, #999)"
};

export function AvariceSettings({ settings, profileOnly = false }: { settings: any; profileOnly?: boolean }) {
    const s = settings as any;
    const picked: string[] = s.avariceBadges ?? ["avarice"];
    const [catalog, setCatalog] = useState<ReturnType<typeof getAvariceCatalog> | null>(null);
    const [pages, setPages] = useState<Record<string, number>>({});
    const sorted = useMemo(() => (catalog ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)), [catalog]);
    const [tint, setTint] = useState<number>(s.avariceGlassTint ?? 55);
    const [restartNeeded, setRestartNeeded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [badgeName, setBadgeName] = useState("");
    const [badgeIcon, setBadgeIcon] = useState("");

    const [displayName, setDisplayName] = useState<string>(s.avariceDisplayName ?? "");
    const [username, setUsername] = useState<string>(s.avariceUsername ?? "");
    const [saved, setSaved] = useState(false);
    const saveNames = () => {
        s.avariceDisplayName = displayName.trim();
        s.avariceUsername = username.trim();
        applyAvariceIdentity();
        setSaved(true);
    };

    const toggleBadge = (id: string, on: boolean) => {
        s.avariceBadges = on ? [...picked.filter(x => x !== id), id] : picked.filter(x => x !== id);
    };

    return (
        <div>
            {!profileOnly && (
                <>
                    <label style={label}>
                        Performance preset
                        <select
                            style={input}
                            value={s.avaricePerformance ?? "mid"}
                            onChange={e => {
                                s.avaricePerformance = e.currentTarget.value;
                            }}
                        >
                            {Object.entries(performanceModes).map(([id, title]) => (
                                <option key={id} value={id}>
                                    {title}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label style={label}>
                        Theme preset
                        <select
                            style={input}
                            value={s.avaricePalette ?? "original"}
                            onChange={e => {
                                s.avaricePalette = e.currentTarget.value;
                            }}
                        >
                            {Object.entries(palettes).map(([id, [title]]) => (
                                <option key={id} value={id}>
                                    {title}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label style={label}>
                        <input
                            type="checkbox"
                            checked={!!s.avariceSeeThrough}
                            onChange={e => {
                                s.avariceSeeThrough = e.currentTarget.checked;
                                setRestartNeeded(true);
                            }}
                        />{" "}
                        See-through window
                    </label>
                    {s.avariceSeeThrough && (
                        <label style={label}>
                            Background tint · {tint}%
                            <input
                                style={input}
                                type="range"
                                min={0}
                                max={85}
                                value={tint}
                                onChange={e => {
                                    const value = Number(e.currentTarget.value);
                                    setTint(value);
                                    document.documentElement.style.setProperty("--av-tint", String(value / 100));
                                }}
                                onBlur={() => {
                                    s.avariceGlassTint = tint;
                                }}
                                onPointerUp={() => {
                                    s.avariceGlassTint = tint;
                                }}
                                onKeyUp={() => {
                                    s.avariceGlassTint = tint;
                                }}
                            />
                            <span style={hint}>0% gives a clear background. Increase tint for easier reading.</span>
                        </label>
                    )}
                    {restartNeeded && (
                        <button type="button" style={input} onClick={() => VesktopNative.app.relaunch()}>
                            Restart to apply window transparency
                        </button>
                    )}
                </>
            )}
            {!profileOnly && (
                <button style={input} onClick={openAvariceProfileEditor}>
                    Edit badges & username
                </button>
            )}
            <p style={hint}>Everything here is client-side: only you see it. Your real account doesn't change.</p>

            <label style={label}>
                Display name
                <input
                    style={input}
                    value={displayName}
                    placeholder="Empty = your real display name"
                    onChange={e => {
                        setDisplayName(e.currentTarget.value);
                        setSaved(false);
                    }}
                />
            </label>

            <label style={label}>
                Username
                <input
                    style={input}
                    value={username}
                    placeholder="Empty = your real username"
                    onChange={e => {
                        setUsername(e.currentTarget.value);
                        setSaved(false);
                    }}
                />
            </label>

            <button type="button" style={input} onClick={saveNames}>
                Save names
            </button>
            <p role="status" style={hint}>
                {saved
                    ? "Names saved locally. Close and reopen your profile to refresh its preview."
                    : "Enter any local name, then save. Leave a field empty to restore your account name."}
            </p>
            {!profileOnly && (
                <>
                    <label style={label}>
                        Profile aura <span style={hint}>(glow around your avatar)</span>
                        <select
                            style={input}
                            value={s.avariceAura ?? "off"}
                            onChange={(e: any) => {
                                s.avariceAura = e.currentTarget.value;
                                applyAvariceAura();
                            }}
                        >
                            {AVARICE_AURAS.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div style={label}>
                        Shop cosmetics{" "}
                        <span style={hint}>
                            (all unlocked, client-side.{" "}
                            {catalog?.length
                                ? `${catalog.length} items loaded`
                                : "Open Discord's Shop once to load them"}
                            )
                        </span>
                    </div>
                    <div style={{ ...row, marginBottom: "14px" }}>
                        <button
                            style={input}
                            onClick={() => {
                                setCatalog(catalog ? null : getAvariceCatalog());
                                setPages({});
                            }}
                        >
                            {catalog ? "Close catalog" : "Browse cached items"}
                        </button>
                        <button
                            style={{ ...tile(false), width: "auto", height: "auto", padding: "6px 12px" }}
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await loadAvariceShop();
                                    setCatalog(getAvariceCatalog());
                                    setPages({});
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {loading ? "Loading…" : "Load shop items"}
                        </button>
                        <button
                            style={{ ...tile(false), width: "auto", height: "auto", padding: "6px 12px" }}
                            onClick={() => {
                                const info = avariceShopDebug();
                                try {
                                    navigator.clipboard.writeText(info);
                                } catch {}
                                alert("Copied debug info - paste it to Claude:\n\n" + info.slice(0, 900));
                            }}
                        >
                            Copy debug info
                        </button>
                    </div>
                    {catalog &&
                        (
                            [
                                ["decoration", "Avatar decorations"],
                                ["effect", "Profile effects"],
                                ["nameplate", "Nameplates"]
                            ] as const
                        ).map(([kind, title]) => {
                            const items = sorted.filter(i => i.kind === kind);
                            const pageSize = 12;
                            const lastPage = Math.max(0, Math.ceil(items.length / pageSize) - 1);
                            const page = Math.min(pages[kind] ?? 0, lastPage);
                            const go = (next: number) => setPages(previous => ({ ...previous, [kind]: next }));
                            const current = s["avarice_" + kind] ?? "";
                            const pick = (sku: string) => {
                                s["avarice_" + kind] = sku || undefined;
                                applyAvariceCosmetics();
                            };
                            return (
                                <div key={kind} style={{ marginBottom: "18px" }}>
                                    <div style={{ ...hint, marginBottom: "8px", fontWeight: 600 }}>
                                        {title} ({items.length})
                                    </div>
                                    <div style={gridStyle}>
                                        <button style={tile(current === "")} onClick={() => pick("")} title="None">
                                            <span style={{ fontSize: "22px", opacity: 0.6 }}>⊘</span>
                                            <span style={tileName}>None</span>
                                        </button>
                                        {items.slice(page * pageSize, (page + 1) * pageSize).map(i => (
                                            <button
                                                key={i.skuId}
                                                style={tile(current === i.skuId)}
                                                onClick={() => pick(i.skuId)}
                                                title={i.name}
                                            >
                                                {i.data?.preview ? (
                                                    <img src={i.data.preview} alt="" style={tileImg} loading="lazy" />
                                                ) : (
                                                    <span style={{ fontSize: "20px", opacity: 0.5 }}>✦</span>
                                                )}
                                                <span style={tileName}>{i.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {lastPage > 0 && (
                                        <div style={row}>
                                            <button disabled={page === 0} onClick={() => go(page - 1)}>
                                                Previous
                                            </button>
                                            <span style={hint}>
                                                {page + 1} / {lastPage + 1}
                                            </span>
                                            <button disabled={page === lastPage} onClick={() => go(page + 1)}>
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    <div style={label}>
                        Profile theme colours <span style={hint}>(the Nitro profile gradient, client-side)</span>
                    </div>
                    <div style={{ ...row, marginBottom: "18px" }}>
                        <input
                            type="color"
                            value={s.avariceThemePrimary ?? "#111114"}
                            onChange={(e: any) => {
                                s.avariceThemePrimary = e.currentTarget.value;
                                s.avariceThemeAccent ??= "#3a3a40";
                                applyAvariceCosmetics();
                            }}
                        />
                        <input
                            type="color"
                            value={s.avariceThemeAccent ?? "#3a3a40"}
                            onChange={(e: any) => {
                                s.avariceThemeAccent = e.currentTarget.value;
                                s.avariceThemePrimary ??= "#111114";
                                applyAvariceCosmetics();
                            }}
                        />
                        <button
                            style={{
                                ...tile(false),
                                width: "auto",
                                height: "auto",
                                padding: "6px 12px",
                                flexDirection: "row"
                            }}
                            onClick={() => {
                                s.avariceThemePrimary = undefined;
                                s.avariceThemeAccent = undefined;
                                applyAvariceCosmetics();
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </>
            )}
            <div style={label}>
                App theme <span style={hint}>(pick one in Appearance; it stays on after the preview closes)</span>
            </div>
            <div style={{ ...row, marginBottom: "18px" }}>
                <button
                    style={{ ...tile(false), width: "auto", height: "auto", padding: "6px 12px", flexDirection: "row" }}
                    disabled={s.avariceGradientId == null}
                    onClick={() => clearAvariceGradient()}
                >
                    {s.avariceGradientId == null ? "No app theme picked" : "Remove app theme (reloads)"}
                </button>
            </div>
            <div style={label}>
                Profile badges <span style={hint}>(open your profile to see them)</span>
            </div>
            <label style={label}>
                Nitro badge tier
                <select
                    style={input}
                    value={AVARICE_NITRO_BADGES.find(b => picked.includes(b.id))?.id ?? ""}
                    onChange={e => {
                        const next = picked.filter(
                            id => id !== "nitro" && !AVARICE_NITRO_BADGES.some(b => b.id === id)
                        );
                        s.avariceBadges = e.currentTarget.value ? [...next, e.currentTarget.value] : next;
                    }}
                >
                    <option value="">No added Nitro tier</option>
                    {AVARICE_NITRO_BADGES.map(b => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </label>
            {AVARICE_NITRO_BADGES.filter(b => picked.includes(b.id)).map(b => (
                <div key={b.id} style={row}>
                    <img src={b.icon} width={32} height={32} alt="" />
                    <span>{b.name} selected · saved locally</span>
                </div>
            ))}
            <label style={label}>
                Custom badge name
                <input
                    style={input}
                    maxLength={80}
                    value={badgeName}
                    onChange={e => setBadgeName(e.currentTarget.value)}
                />
            </label>
            <label style={label}>
                Badge image URL (HTTPS)
                <input style={input} type="url" value={badgeIcon} onChange={e => setBadgeIcon(e.currentTarget.value)} />
            </label>
            <button
                style={input}
                disabled={!badgeName.trim() || !/^https:\/\//i.test(badgeIcon) || getCustomBadges().length >= 50}
                onClick={() => {
                    try {
                        if (new URL(badgeIcon).protocol !== "https:") return;
                    } catch {
                        return;
                    }
                    s.avariceCustomBadges = [
                        ...getCustomBadges(),
                        { id: crypto.randomUUID(), name: badgeName.trim(), icon: badgeIcon }
                    ];
                    setBadgeName("");
                    setBadgeIcon("");
                }}
            >
                Add custom badge
            </button>
            {getCustomBadges().map(b => (
                <div key={b.id} style={row}>
                    <img src={b.icon} width={20} height={20} alt="" loading="lazy" />
                    {b.name}
                    <button
                        onClick={() => {
                            s.avariceCustomBadges = getCustomBadges().filter(x => x.id !== b.id);
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}
            {AVARICE_BADGES.filter(b => !AVARICE_NITRO_BADGES.some(tier => tier.id === b.id)).map(b => (
                <label key={b.id} style={{ ...row, cursor: "pointer", color: "var(--text-default, #fff)" }}>
                    <input
                        type="checkbox"
                        checked={picked.includes(b.id)}
                        onChange={(e: any) => toggleBadge(b.id, e.currentTarget.checked)}
                    />
                    <img src={b.icon} width={20} height={20} alt="" />
                    {b.name}
                </label>
            ))}
        </div>
    );
}

function ProfileEditor() {
    return <AvariceSettings settings={useSettings()} profileOnly />;
}

export function openAvariceProfileEditor() {
    openModal(props => (
        <Modal {...props} size="lg" title="Edit badges & username">
            <ProfileEditor />
        </Modal>
    ));
}

export function InlineProfileBadges() {
    const settings = useSettings() as any;
    const [manage, setManage] = useState(false);
    const badges = [...AVARICE_BADGES, ...getCustomBadges()];
    const hidden: string[] = settings.avariceHiddenBadges ?? [];
    const picked: string[] = settings.avariceBadges ?? ["avarice"];
    return (
        <section aria-label="Avarice profile badges" style={{ padding: "16px", color: "var(--text-default, #fff)" }}>
            <h3>Avarice · All badges ({badges.length})</h3>
            <p style={hint}>Pick badges for your local profile. Only you see these changes.</p>
            <button type="button" style={input} onClick={() => setManage(!manage)}>
                {manage ? "Done managing badges" : "Edit available badges"}
            </button>
            <button
                type="button"
                style={input}
                onClick={() => {
                    settings.avariceHiddenBadges = [];
                }}
            >
                Make all badges available
            </button>
            <button type="button" style={input} onClick={openUsernameEditor}>
                Edit username (@{settings.avariceUsername || UserStore.getCurrentUser()?.username})
            </button>
            <div style={{ ...gridStyle, marginTop: "12px" }}>
                {badges
                    .filter(b => manage || !hidden.includes(b.id))
                    .map(b => {
                        const custom = !AVARICE_BADGES.some(preset => preset.id === b.id);
                        const active = manage
                            ? !hidden.includes(b.id)
                            : custom
                              ? !hidden.includes(b.id)
                              : picked.includes(b.id);
                        return (
                            <button
                                type="button"
                                key={b.id}
                                title={b.name}
                                aria-label={b.name}
                                aria-pressed={active}
                                style={tile(active)}
                                onClick={() => {
                                    if (manage || custom) {
                                        settings.avariceHiddenBadges = hidden.includes(b.id)
                                            ? hidden.filter(id => id !== b.id)
                                            : [...hidden, b.id];
                                    } else {
                                        settings.avariceBadges = picked.includes(b.id)
                                            ? picked.filter(id => id !== b.id)
                                            : [...picked, b.id];
                                    }
                                }}
                            >
                                <img src={b.icon} width={32} height={32} alt="" loading="lazy" />
                                <span style={tileName}>{b.name}</span>
                                <span style={hint}>
                                    {manage ? (active ? "Available" : "Hidden") : active ? "Selected" : "Select"}
                                </span>
                            </button>
                        );
                    })}
            </div>
            <button type="button" style={input} onClick={openAvariceProfileEditor}>
                Add custom badges / more options
            </button>
        </section>
    );
}

export function UsernameEditor() {
    const settings = useSettings() as any;
    const [name, setName] = useState<string>(settings.avariceUsername ?? UserStore.getCurrentUser()?.username ?? "");
    const [saved, setSaved] = useState(false);
    return (
        <div>
            <label style={label}>
                Local username
                <input
                    autoFocus
                    style={input}
                    value={name}
                    placeholder="Empty restores your account name"
                    onChange={e => {
                        setName(e.currentTarget.value);
                        setSaved(false);
                    }}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            settings.avariceUsername = name.trim();
                            applyAvariceIdentity();
                            setSaved(true);
                        }
                    }}
                />
            </label>
            <button
                type="button"
                style={input}
                onClick={() => {
                    settings.avariceUsername = name.trim();
                    applyAvariceIdentity();
                    setSaved(true);
                }}
            >
                Save username
            </button>
            <p role="status" style={hint}>
                {saved ? "Username saved. Reopen your profile to refresh the preview." : "Only you see this username."}
            </p>
        </div>
    );
}

function openUsernameEditor() {
    openModal(props => (
        <Modal {...props} title="Edit local username">
            <UsernameEditor />
        </Modal>
    ));
}

const profileSelector =
    '[class*="profileCustomization"], [class*="profileSettings"], [class*="userProfile"], [class*="outer_"], [role="dialog"], [class*="contentColumn"]';
const nameSelector =
    'h1,h2,h3,[role="heading"],[class*="globalName"],[class*="displayName"],[class*="nickname"],[class*="username"]';
const roots = new Map<Element, ReturnType<typeof createRoot>>();
let profileFrame = 0;
export function isOwnProfile(panel: Element) {
    const user = UserStore?.getCurrentUser?.();
    if (!user) return false;
    const avatar = panel.querySelector(`img[src*="/avatars/${user.id}/"], [data-user-id="${user.id}"]`);
    const names = [user.globalName, user.username].filter(Boolean);
    return (
        !!avatar && [...panel.querySelectorAll(nameSelector)].some(el => names.includes(el.textContent?.trim() ?? ""))
    );
}
export function isProfileEditor(panel: Element) {
    if (
        panel.matches(
            '[class*="profileCustomization_"], [class*="profileCustomizationTab_"], [class*="profileSettings_"]'
        )
    )
        return true;
    const labels = [...panel.querySelectorAll('h1,h2,h3,label,button,[role="button"]')]
        .filter(el => !el.closest("[data-avarice-profile]"))
        .map(el => el.textContent?.trim() ?? "");
    if (labels.some(text => /^(customi[sz]e|edit|manage|select|reorder) (your |profile )?badges$/i.test(text)))
        return true;
    return (
        labels.some(text => /^(edit (user |server )?profile|profiles|user profile)$/i.test(text)) &&
        labels.some(text => /^(display name|change avatar|avatar|change banner)$/i.test(text))
    );
}
const pendingPanels = new Set<Element>();
let rescanProfiles = true;
const updateProfileEditors = () => {
    profileFrame = 0;
    for (const [host, root] of roots) {
        if (!host.isConnected) {
            root.unmount();
            roots.delete(host);
        }
    }
    const panels = rescanProfiles ? document.querySelectorAll(profileSelector) : pendingPanels;
    const eligible = [...panels].filter(
        panel =>
            panel.isConnected &&
            !panel.closest("[data-avarice-profile]") &&
            !panel.querySelector("[data-avarice-profile]") &&
            isProfileEditor(panel)
    );
    pendingPanels.clear();
    rescanProfiles = false;
    for (const panel of eligible) {
        if (eligible.some(child => child !== panel && panel.contains(child))) continue;
        if (panel.querySelector("[data-avarice-profile]")) continue;
        const host = document.createElement("div");
        host.dataset.avariceProfile = "true";
        panel.prepend(host);
        const root = createRoot(host);
        console.info("[Avarice Profile] mounted badge picker");
        roots.set(host, root);
        root.render(<InlineProfileBadges />);
    }
};
function editProfileName(event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
    const { target } = event;
    if (
        !(target instanceof Element) ||
        target.closest('input,textarea,[contenteditable="true"],[data-avarice-profile]')
    )
        return;
    const name =
        target.closest(nameSelector) ??
        (target.textContent?.trim() === UserStore.getCurrentUser()?.username ? target : null);
    if (!name) return;
    let panel = target.closest(profileSelector);
    while (panel && !isOwnProfile(panel)) panel = panel.parentElement?.closest(profileSelector) ?? null;
    if (!panel) return;
    const user = UserStore.getCurrentUser();
    if (user?.username !== name?.textContent?.trim()) return;
    event.preventDefault();
    event.stopPropagation();
    openUsernameEditor();
}
const profileObserver = new MutationObserver(records => {
    for (const record of records) {
        if (rescanProfiles) break;
        if (!(record.target instanceof Element) || record.target.closest("[data-avarice-profile]")) continue;
        let parent = record.target.closest(profileSelector);
        while (parent) {
            pendingPanels.add(parent);
            parent = parent.parentElement?.closest(profileSelector) ?? null;
        }
        for (const node of record.addedNodes) {
            if (!(node instanceof Element)) continue;
            if (node.matches(profileSelector)) pendingPanels.add(node);
            for (const panel of node.querySelectorAll(profileSelector)) pendingPanels.add(panel);
        }
        if (pendingPanels.size > 64) {
            pendingPanels.clear();
            rescanProfiles = true;
        }
    }
    if (!profileFrame && (rescanProfiles || pendingPanels.size || [...roots.keys()].some(host => !host.isConnected))) {
        profileFrame = requestAnimationFrame(updateProfileEditors);
    }
});
export async function startAvariceProfileEditor() {
    try {
        if (!document.body)
            await new Promise<void>(resolve =>
                document.addEventListener("DOMContentLoaded", () => resolve(), { once: true })
            );
        const ready = (window as any).Vencord?.Webpack?.onceReady;
        if (ready) await ready;
        profileObserver.observe(document.body, { childList: true, subtree: true });
        document.addEventListener("click", editProfileName, true);
        document.addEventListener("keydown", editProfileName, true);
        updateProfileEditors();
        console.info("[Avarice Profile] editor ready");
    } catch (error) {
        console.error("[Avarice Profile] initialization failed", error);
    }
}
startAvariceProfileEditor();
window.addEventListener(
    "pagehide",
    () => {
        profileObserver.disconnect();
        cancelAnimationFrame(profileFrame);
        document.removeEventListener("click", editProfileName, true);
        document.removeEventListener("keydown", editProfileName, true);
        for (const root of roots.values()) root.unmount();
        roots.clear();
        pendingPanels.clear();
    },
    { once: true }
);
