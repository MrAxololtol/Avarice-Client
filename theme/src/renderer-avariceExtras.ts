/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Avarice Client contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "./settings";

const RAW = "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/";

// Cosmetic badges only. Trust badges (Staff, Partner, Moderator, Bug Hunter...) are left out on purpose.
export const AVARICE_NITRO_BADGES = [
    {
        id: "nitro-bronze",
        name: "Nitro Bronze",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAg8SURBVHja7Zv5UxNnGMcXPLiya4QYEERBgSCagBoUqVR0VBRF01K1KhYKWqpOB61OW8cDxvGoCOJ0qB2rU6y2g3KIcogglnqgVlBAq61WB1tr+2P+hLf7LN24iTn2eHOA+535zmScmGQ/Ptf77EoQsmTJkiVLlixZsmTJkiVL1huuCzOJvpYlXsjT3ZrhZWxZ7NV9aYlXe0uGd1nLUiK7KZ1IcDvAqhiirkZHoOY0z4do1Yu9ja0Z3hUXFxEG9wDUEAVnYwjUmqpAjzaN8zj/9kkEerx1Anq6XYOe7tCgx59HoZ5Noagji0JthmHmMDO8+gBms4GIcBnAyigiFQDWxQ/1GGB/bItGfTvj0N97E9C/xXq77tsdh+7mB6P2TF+LlHcRyLoIQgkAwQ/yw90C7MnWKAbYiz3xDoHZM0TonTyVCWLzoiGoWk8VuaIOdgPA28vVrgO2QzowW/5zj44BWZccgGoSKVQ7neqrS/J1XjSejSbKAGDbPMop0LjA/vlymlOgWXPPxmjUMDuQgQimo3Gzc+pgLJEDABtn+GID9mx7rMuBWa2RhfHoamYYF2KRMwBGAMCaOG9RwB5vmcAA+6tI63ZgtnwnJ9K5EOk6aASIPblhDoH9XhDJAHu+e7LHAnM5xKpooh0Adryjsgrs6WeaAQeMB8TNTmkk0ClZYC/3Tx3QwBxANFYlBuA5DtLwDACwaab/oAMGhsx5vnsSevZFLJNRF+f2d+fqRKob+0D9Yu+UQQEMmhoLzLIsPcgfi84ljeifE/VUIZ4o1BB9P2q80TczAwX5eHIgurshBsuFP96lQ81Z49CphWpU/pYS7df5o1I9ybw+u3Q0+ilvPPMeq8DoARqAwVTAZ3q4vTrUlMoVCUqlZICnYodUlGkVqERH8fLheAqdmEqh+tQgyeA6C2IZSNsjhzr0QY0Pql8agh5um8gAe/JplOiZlU1lLFF4IFYZcVirmM3XVXrKCF/euylGUsTxBQfeMX4o+irO1+TquUp0N2+MaICdazFHIV/VJpI58MWNEqIPoq4o1oc3PPCeqOFmAMHfTg2QBBFrFPIV/YXdUqLvxoZoQeBYl9DALQFKhciphX3Su3ESEQF7NHuum6VIhS88n6xEL/ZNFZW2QiMPvHP8MKvwuBDv091VKEBuR67WK1KlpaaOKHO03r+U7o1qk0h0bfkYQeBe7p/C7P2gs4qJPmvpa+nKt0eIisK2RSo8aQybmaqJBF3b7EOEZeWjLRqHwGB4hVMNO4s1LFPxglUYPRydSKFQ5YKRjI8mKdCRSX4OAYI71owWDPDmypD+NNaT7Vg2M7WTh0ie9q390L1xPg7BnVussvp379E1rjFd5RDg6WThe83edeGmboxtM/N8l1bStG/plky1XXj76IvvzHXcCNroz3EEUUwtZOtgU7LvOCybmZ71kZKnfa6Pz6LsAmxYNor3ZzWmB9kFeGnpKMG/r2H2SAbguUTFbCybmesGtQmYlGmfdbHO1270Cfms+/nh6KjOdk2soQdsob+vZX5QfxpPI7OxbGbqpw3Hem/EXvR9L+KCodbZAlgxXSG6E9Mu8MhbnbjSl/X5BYE2AR6nZ0K3jTLsZgYAdq4OwQZwH91hD8b4mBlOFuDL76oHF8AzMUQFALyWEYgNoL2aBTCEpzCJbZR5uHEsak0LxJPCznpmBuoSrguGc6+UEwkAe5AfirpzVehuthJ1ZilQw9sUnibirGdm7KUc+OrKEGxjzJVMtUNglq6fReEZY9hGwg7UuBpJx+rRdi/6KH1G5rNRucJjkIZTCwDryRvFAOtaS1qFxjV7tw7bXtAZz8zYq4MsxDYbDQVOF44iD3xyhh8vYFx3LFfgO8pxB2q4R2JrzX89K0wwQD4A2NUU1DF4P6Q+vHYE35S+hgBB8MDtGSSeZYLlZqZ8kp/NeyIXlgRjbyZSXZniLxgeuGkOia8Dc1Uy0Xfca9ZRBQDwuxRxIw7UJ77RJMTHEvzQjRXC4f2y6lX9q0xw4mNwrMroIksDNIpNY74bFVfA46ZvtR7TTXY+KtVRZQCwcr5KdEP5eYWauXB3wgOfT8Y4//HVocmKVLYWdq0L5z3t3/9otNksBhd+crp4iNWp/ujWKvHwrhko0w0ll6SvWX3Uku32opDP8Goq4ukBzPjBFxy8V0y3tRV9tXpFIeFqcaMQaqEQYLYMEVmfFoB+SPZjIB2b0m94XZnix4CWEnFWRxd3RJ+pFmoVTC08lqREt1aTWC7MFb65aoR7ap+1jnxIR/UBxDNzPRdg1wcUkxm964OZTIERrDyBLj84B2ccqVyXRnoQsCATMLOlxhI181vhH/5ArJtS9zWIOmozC/GywQ3A6LMvA2ydGj3cYHsqYOGBD2pJA+FJYuvhkSkUas90AbAPAx0CswWvdLIbui6/0YY66Yx05gL79WPhp58BAc8yEsHV80jRwO7ljGSAwWgk9rTTmz8WnZoTNHDgmSDSP5T90eXT6DlxhWuAcX19TSj6OlHJwjOWTArIJgaSoDuzIw475nBBAjAYLQCYZaeU4q68cLOo86huK+axYbouVnCjsWp+IOrKHYP9PzVCxFXOU5ntLCETCiNc+Oius1Qcp0xgz86sT9NR0vpeCFOnpNS4JkMwMxibLXzp7xqwUWdP8HA6fXF1ltttAFCzcBQD4/qaMHQ7O4xJRRYSvAa3vx/KvAcWGJz69qrOackK+A5isAtSu1hL5lhGpQgb//+MgkGRqmIEF35YSy4r1VGFTHTSQEo5zcdUz/r/rBuiDIBBpL2x0GTJkiVLlixZsmTJkiVLliwX6T/XavjNSjOCnwAAAABJRU5ErkJggg=="
    },
    {
        id: "nitro-silver",
        name: "Nitro Silver",
        icon: "data:image/png;base64,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"
    },
    {
        id: "nitro-gold",
        name: "Nitro Gold",
        icon: "data:image/png;base64,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"
    },
    {
        id: "nitro-platinum",
        name: "Nitro Platinum",
        icon: "data:image/png;base64,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"
    },
    {
        id: "nitro-diamond",
        name: "Nitro Diamond",
        icon: "data:image/png;base64,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"
    },
    {
        id: "nitro-emerald",
        name: "Nitro Emerald",
        icon: "data:image/png;base64,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"
    },
    {
        id: "nitro-ruby",
        name: "Nitro Ruby",
        icon: "data:image/png;base64,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"
    },
    {
        id: "nitro-opal",
        name: "Nitro Opal",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAoESURBVHja7duNUxN3Ggdw/wT/gsp4502vM53a3tnzOh4sOGoLBYOtqBSFqrVivYNB67ViQXu2FscerdWeVcdoW0GLCvIitliQNxHIC3kh4T2AAgJKQEAhb8/ts2FjEpLdTbIhod1n5juDAlny4ffy7C9hwQKhhBJKKKGEEkoooYQSSiihhPqdl/zQFZ2lqhDmQfSW6iI5VBdVQFVhNtRcT4TakqUBBxRH5OQXbLoEjwuvwzyBdMh4WZHeXFUoJlFFgQEkLqWcC8+Bki9qoN38NCije6Kncm+kH/qGeuChTg2Timow3bnhBHpdR2FW5IfMGeAZ4gcCAXM2FQQtoHNaTFPQ+NQA1RMmuN03Ch3Napi4e8sBc84gxYR4IQJitGOPgxZMNmUF+3nUAtcfgcvU9A5Dj1JuQxwqKoEtosaDfkck8eQIeLe6K2jAmqanKbCyMbNbMOf8OGyB/w2a4dS9cZDJZfD57jskoASjSxLVhfhxFOZkI+DNb+oDClY7afQY7PSQGY4OmOAQmYx+x6RdG4Kt25Q0ImwWNab6CfBiEgJeTf1lztAQ7O4TAwVWNGLhBJb70Ar25QPXYK6yX/UEdma22xD9MqXFRG4IAn4fnec3MJVhymOwn2bAvvIAzD4f9ZkhvssMr7dbIPTrfv8ikoB6RFT3P+IFTGO0gpU/NnkEdm7I4hNYUrcVbKnGAouU4BC/IpJ4FQhYU9riE1jlOHewq3Zgh70E29FjBXtVOxvMVewReV0TPd1IEAx7MQS7oecOdoEEO/HA7BNYTAd3MBZEfbyogZ/bwbNEjggBL79Xwtq8egN2xAswDIK93WmmwJaowGs0KnKA5+6QuQkQ814rjSj3S0Nt37x6AoatBYId9RJsd69/wJ4rIHPxWRafN0H8evkMojSTH8TwHN1xIg/WxSkger2Sc2LjlLD3ypBXC3/afSvYihYr2OKKKXghewBeSuuAV7Y0w7IoGfzlbQX18YvpOnj+1BD1NYxgZTNguY5oznn1s4e2qZwkki/0GfAYcVUcFVYHYWESTgknJLD2dQkkbVXCgY5pj8Ai2hxH2JK8MQpp+fI61kQSMgj/uBf+XPrEClbODYzOkgILLJeaYGWnATana/gbhQQhDwkPl4VxTcJaiR4vjh0/Exj2Ygj2gnr2wr+4fIozHOa1v9+F9auUthDJvbDku2lGsMU/WWBZnRXsrYkpiIentryj4nkUcq3NImkSXhhvldw1r67A7PPHkkn4W0QjZzzMyn80OgBiYmK1Dog0GKGdDeYqvI5CroW7F15099VhW/PKBuYrHiYmQj4LkEYMu/0E1o6wgznnnV9tbY3O9yP+zPwQqGPOkd11BF4wfqMc/tBg8nh3xGnrDd6K1+pd4tmSoIX48UnOcNstj+FTcw+UjNbAzvh6CjFB1Ej4BFiceDmb7Xh/oqwY0rbchdWHdF61Frizeornbvo6Jy6zkxUszyQBlbEUxgy5YDR8TyX7cAU/0xhPZn58Ixe6T19jRBwqLoEVBSPcerHqmV7sKsDzB4a4bRarGmDVp63wxhkdlZX7NBATrWAFxGxSjNjQEOy8WTELjI5p6iKYhouh9Ieamds7SQUvJzPfRl7hvXnFLFslY4WLutTrehRNTMKGC32sgO/u0TCDjZAz7H45WNoaAFQqKsNVtnNDPW8nMy/dnuAOVuYazKH/yhpjxYvrH2Nduzb+PMiKOKa/+Axs9JoVrKPOBuYqOzdKKcRt62SLeDmZiTnT6RLNk27fvnn96x4dI2B0cR8r3r8sD6kpeeJ8LSNgsfgOK5h9LDINHNghs07jWFkYLyczOw5Kn4F50e3TzWucwdpaEMkq9ztsrNTtwv+tWQPlxioYMF6xTcVRcoQliuRuAU/uVzKDyZvBdKcVDLc7YfpmN0yV9sB/U2zTOJGXk5nPN9zgDMalecUp6g5wTXaHA1ixsc4BzGEdI6ek+UEpZO2TuAX8MEnpGqyywwbmnFP7VDRgCm8nM38SG9yCvVzJvdvHME3frMJa6DQWugYbz6PALLoagOYmG4r4P+6n8K4NSjDVz4CVuQZzD8jDHQmezCBg6LFBG9iLt8wUmDfdPmZ1qAQiCalDosk7C0xZSdEzsMlLVrCeSgcw5zABJr+l5oTmP0AiV4yAySebIWpw2isw5+aVac0SZ1ezgjlMSYUaslJVbh8vY6vGB0Afp7D9e2YOZ1R6jOau29/7fj3jlGMDM0u0YKhuh+nyLrh3SQeJb7oH/CJZ6zHg4WQFP5uI/XtmTm4q4ATG2u2Tzeu5o8z3sg05s8GMtW0UmPOTzfmklfGxyo61ewy4f1sTP20MvZF8F2rdSLYMjjqAfWQZoMDqjbfcg9HNq123r85XMT7ppBglDNxoocDc7ZQYxGFrpO9f1nkMSL9ax9u5IP2emY+rWygw7MVYwVia18QY5ieO0/IXN6NnpKCbdeR5sv5N53eD8WwXmL7ugO4PNfzdytk31PgaSVxULcTF1c2K7NYMGNeFn+z2C49pOR0I4C56ZKcGcjJaqRxP1TKuefaRk3dQLsGKusEgtoJZDrUB7G+1pWqXmp/DBOeTmQTittvXRMRZTdy6fafm9ZN3NZwgvMnx1JbZYCdmgznnq81N/O3A9hURIVvkHIKQpCBgynbZbLB65m4fg+sT19HkSXaJ1NB/stMK9hkzmH0m/91iW/82+vNtcHYvPi0kAfWI2HdzprXg2O3TkZ/u5BeP/IUM7W3hjOZq+vL2Ijs3RGk2Ap5N97xhpdN6oQt2kWtdIPEwaeul/PV/3AEbCQSMWiOFRwXdXiPidPZlTTwa10xNQW/xNCnNtheU5mT62hcJWOHrKLTv7TyBPEiO3OZ/ar2Gcx59CXP5kiafo3A6b6YX+5Jc+DPaqKlYvF1Djiw1HFyngg/etAY/PrlJTX3OlxHnZu2b+9FHV2ioZ2uhffOKYHxAeJPBvdrArH2ud2SpDhE1Fzpdgtma1wCCOSclWg5rVpJtSzSPjbOvUzkuRgaPrnBvXgMVcYKSvhnQEUSApq6LqZyJP9SR9YqgRHOBB+QNgWhBMBW9HuIPGex4+AsPyj+fJX+r54MRcV7gOY/E9HVNML6vJaBweH38OeYNnvOauGGNDAb2BAZR/kEzbFgtpfH0oaEBbFe8352tLQ5uLnMFOZCmJa/XZH/0Fjy7rTdvGyYIqZh+Mv6EbE/RwDcbFRC1UuowZbFXXTDfK3JVw1L63pk6SyQb2dLtap8xcY3LS1JRj+d04Fsxb0cdU+Gb08knl2//ZLdFyiA9tomCqH6/mVq7BvZoHTYg/DcGP49fhyMNv88JDc8oxXiNBb/1sk5t6mS7guufVTCkAh/rNzFVvb2fJrOWXCszZ0annN58HEP9nxxHGYLhSPvdogkllFBCCSWUUEIJJZRQQgkl1BzV/wEWpsGG5lim+QAAAABJRU5ErkJggg=="
    }
] as const;

export const AVARICE_BADGES = [
    ...AVARICE_NITRO_BADGES,
    {
        id: "avarice",
        name: "Avarice Client",
        icon: "data:image/png;base64,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"
    },
    { id: "nitro", name: "Discord Nitro", icon: RAW + "discord-nitro.svg" },
    { id: "boost", name: "Server Booster", icon: RAW + "boosts/discord-boost-9.svg" },
    { id: "early", name: "Early Supporter", icon: RAW + "discord-early-supporter.svg" },
    { id: "bravery", name: "HypeSquad Bravery", icon: RAW + "hype-squad-bravery.svg" },
    { id: "brilliance", name: "HypeSquad Brilliance", icon: RAW + "hype-squad-brilliance.svg" },
    { id: "balance", name: "HypeSquad Balance", icon: RAW + "hype-squad-balance.svg" },
    { id: "activedev", name: "Active Developer", icon: RAW + "active-developer.svg" },
    { id: "quest", name: "Completed a Quest", icon: RAW + "quest.png" },
    { id: "legacy", name: "Originally known as", icon: RAW + "username.png" }
] as const;

export function getCustomBadges(): Array<{ id: string; name: string; icon: string }> {
    const badges = S().avariceCustomBadges;
    return Array.isArray(badges)
        ? badges
              .filter(
                  b =>
                      b &&
                      typeof b.id === "string" &&
                      typeof b.name === "string" &&
                      typeof b.icon === "string" &&
                      /^https:\/\//i.test(b.icon)
              )
              .slice(0, 50)
        : [];
}

const V = () => (window as any).Vencord;
const S = () => Settings.store as any;

// ---------- one-time: turn on the "Nitro" plugins picked on the setup screen ----------
function enableNitroPlugins() {
    if (S().avariceNitro !== "pending") return;
    const plugins = V()?.Settings?.plugins;
    if (!plugins) return;

    plugins.FakeNitro ??= {};
    Object.assign(plugins.FakeNitro, {
        enabled: true,
        enableEmojiBypass: true,
        enableStickerBypass: true,
        enableStreamQualityBypass: true
    });
    plugins.USRBG ??= {};
    plugins.USRBG.enabled = true;

    S().avariceNitro = "applied";
    // plugins patch Discord at startup, so reload once to activate them
    setTimeout(() => location.reload(), 800);
}

// ---------- client-side name override ----------
const ORIG = Symbol("avariceOriginal");

export function applyAvariceIdentity() {
    const UserStore = V()?.Webpack?.Common?.UserStore;
    const user = UserStore?.getCurrentUser?.();
    if (!user) return;

    const display = (S().avariceDisplayName ?? "").trim();
    const uname = (S().avariceUsername ?? "").trim();

    override(user, "globalName", display || undefined);
    override(user, "username", uname || undefined);

    // nudge the UI to redraw names
    try {
        UserStore.emitChange?.();
    } catch {}
}

const cleanups: Array<() => void> = [];
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
function scheduleRefresh() {
    if (refreshTimer !== undefined) return;
    refreshTimer = setTimeout(() => {
        refreshTimer = undefined;
        for (const apply of [applyAvariceIdentity, applyAvariceCosmetics, applyAvariceAura]) {
            try {
                apply();
            } catch (error) {
                console.error("[Avarice] refresh failed", error);
            }
        }
    }, 0);
}

function watchIdentity() {
    const Flux = V()?.Webpack?.Common?.FluxDispatcher;
    for (const event of ["CONNECTION_OPEN", "CURRENT_USER_UPDATE", "USER_UPDATE", "USER_PROFILE_FETCH_SUCCESS"]) {
        Flux?.subscribe(event, scheduleRefresh);
        cleanups.push(() => Flux?.unsubscribe(event, scheduleRefresh));
    }
    const changed = (_: unknown, path: string) => {
        if (!path || path.startsWith("avarice")) scheduleRefresh();
    };
    Settings.addGlobalChangeListener(changed);
    cleanups.push(() => Settings.removeGlobalChangeListener(changed));
    scheduleRefresh();
}

// ---------- client-side profile aura (glow around your own avatar, everywhere) ----------
export const AVARICE_AURAS = [
    { id: "off", name: "Off" },
    { id: "silver", name: "Silver mist" },
    { id: "blood", name: "Blood" },
    { id: "void", name: "Void (dark smoke)" }
] as const;

const AURA_COLORS: Record<string, [string, string]> = {
    silver: ["rgb(235 235 240 / 0.75)", "rgb(235 235 240 / 0.25)"],
    blood: ["rgb(229 57 60 / 0.85)", "rgb(229 57 60 / 0.3)"],
    void: ["rgb(0 0 0 / 0.95)", "rgb(120 120 130 / 0.35)"]
};

export function applyAvariceAura() {
    const me = V()?.Webpack?.Common?.UserStore?.getCurrentUser?.()?.id;
    let el = document.getElementById("avarice-aura") as HTMLStyleElement | null;
    const mode = S().avariceAura ?? "off";
    if (!me || mode === "off" || !AURA_COLORS[mode]) {
        el?.remove();
        return;
    }
    const [a, b] = AURA_COLORS[mode];
    // your avatar images always contain your user id in their URL
    const mine = `img[src*="/avatars/${me}/"]`;
    const css = `
@keyframes avarice-aura {
    0%, 100% { filter: drop-shadow(0 0 3px ${a}) drop-shadow(0 0 8px ${b}); }
    50%      { filter: drop-shadow(0 0 6px ${a}) drop-shadow(0 0 16px ${b}); }
}
/* avatars sit inside an SVG mask, so glow the element just outside the <svg> */
:has(> svg ${mine}),
:not(foreignObject):has(> ${mine}) {
    animation: avarice-aura 3.2s ease-in-out infinite;
    overflow: visible !important;
}`;
    if (!el) {
        el = document.createElement("style");
        el.id = "avarice-aura";
        document.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
}

// ---------- client-side shop cosmetics (decorations, profile effects, nameplates) ----------
// The catalog is captured from Discord's own Shop data the first time you open the Shop.
export type AvariceItem = {
    kind: "decoration" | "effect" | "nameplate";
    name: string;
    skuId: string;
    data: any;
};
const CATALOG_KEY = "avariceShopCatalog";

let catalogCache: AvariceItem[] | undefined;
export function getAvariceCatalog(): AvariceItem[] {
    if (catalogCache) return catalogCache;
    try {
        const stored = JSON.parse(localStorage.getItem(CATALOG_KEY) || "[]");
        catalogCache = Array.isArray(stored)
            ? stored
                  .filter(
                      i =>
                          i &&
                          ["decoration", "effect", "nameplate"].includes(i.kind) &&
                          typeof i.skuId === "string" &&
                          typeof i.name === "string" &&
                          i.data &&
                          typeof i.data === "object"
                  )
                  .slice(-1500)
            : [];
    } catch {
        catalogCache = [];
    }
    return catalogCache!;
}

const CDN = "https://cdn.discordapp.com";
function previewFor(kind: AvariceItem["kind"], item: any, product: any): string | undefined {
    try {
        const asset = item.asset ?? item.id;
        if (kind === "decoration" && asset)
            return `${CDN}/avatar-decoration-presets/${asset}.png?size=96&passthrough=false`;
        if (kind === "effect")
            return (
                item.thumbnailPreviewSrc ??
                item.config?.thumbnailPreviewSrc ??
                item.staticFrameSrc ??
                product?.thumbnailPreviewSrc ??
                (item.asset ? `${CDN}/assets/collectibles/${item.asset}static.png` : undefined)
            );
        if (kind === "nameplate" && item.asset) return `${CDN}/assets/collectibles/${item.asset}static.png`;
    } catch {}
    return undefined;
}

function classify(product: any, item: any): AvariceItem["kind"] | null {
    if (item?.palette !== undefined) return "nameplate";
    // Discord collectible item types: 0 = avatar decoration, 1 = profile effect, 2 = nameplate
    switch (item?.type ?? product?.type) {
        case 0:
            return "decoration";
        case 1:
            return "effect";
        case 2:
            return "nameplate";
    }
    return (item?.asset ?? item?.id) ? "decoration" : null;
}

// Walks any data shape and collects things that look like shop products: { skuId/sku_id, items: [{ skuId/sku_id, ... }] }
function findProducts(root: any, out: any[] = [], seen = new Set<any>(), depth = 0): any[] {
    if (!root || typeof root !== "object" || seen.has(root) || depth > 7 || seen.size > 30000) return out;
    seen.add(root);
    if (
        Array.isArray(root?.items) &&
        root.items.some((i: any) => i && typeof i === "object" && ("skuId" in i || "sku_id" in i))
    ) {
        out.push(root);
    }
    const values = root instanceof Map ? [...root.values()] : Array.isArray(root) ? root : Object.values(root);
    for (const v of values) if (v && typeof v === "object") findProducts(v, out, seen, depth + 1);
    return out;
}

function ingestCategories(source: any): number {
    const products = findProducts(source);
    if (!products.length) return 0;
    const seen = new Map(getAvariceCatalog().map(i => [i.kind + i.skuId, i]));
    const before = seen.size;
    for (const product of products) {
        for (const item of product.items ?? []) {
            const kind = classify(product, item);
            if (!kind) continue;
            const skuId = item.skuId ?? item.sku_id ?? product.skuId ?? product.sku_id;
            if (!skuId) continue;
            seen.set(kind + skuId, {
                kind,
                skuId,
                name: product.name ?? item.label ?? item.name ?? skuId,
                data: {
                    asset: item.asset ?? item.id,
                    skuId,
                    id: item.id ?? skuId,
                    palette: item.palette,
                    label: item.label ?? product.name,
                    preview: previewFor(kind, item, product)
                }
            });
        }
    }
    try {
        const next = [...seen.values()].slice(-1500);
        const serialized = JSON.stringify(next);
        if (serialized !== JSON.stringify(getAvariceCatalog())) {
            catalogCache = next;
            localStorage.setItem(CATALOG_KEY, serialized);
        }
    } catch {}
    return seen.size - before;
}

// every Flux store we can reach, by three independent methods
function storeName(st: any): string | undefined {
    try {
        return st?.getName?.() ?? st?.constructor?.displayName ?? st?.constructor?.name;
    } catch {
        return undefined;
    }
}
function isStore(x: any) {
    return x && typeof x === "object" && typeof x.getName === "function" && "_dispatchToken" in x;
}
function allStores(): Array<{ name: string; store: any }> {
    const found = new Map<any, string>();
    const add = (st: any) => {
        if (isStore(st) && !found.has(st)) found.set(st, storeName(st) ?? "?");
    };
    // 1) Flux.Store.getAll()
    try {
        const Flux = V()?.Webpack?.Common?.Flux;
        for (const st of Flux?.Store?.getAll?.() ?? []) add(st);
    } catch {}
    // 2) dispatcher dependency graph (store instances by name)
    try {
        const nodes = V()?.Webpack?.Common?.FluxDispatcher?._actionHandlers?._dependencyGraph?.nodes ?? {};
        for (const n of Object.values<any>(nodes)) {
            try {
                add(V()?.Webpack?.findStore?.(n?.name));
            } catch {}
        }
    } catch {}
    // 3) scan webpack module exports for store-shaped objects
    try {
        const cache = V()?.Webpack?.cache ?? V()?.Webpack?.wreq?.c ?? {};
        for (const mod of Object.values<any>(cache)) {
            const ex = mod?.exports;
            if (!ex || typeof ex !== "object") continue;
            add(ex);
            for (const k in ex) {
                try {
                    add(ex[k]);
                } catch {}
            }
        }
    } catch {}
    return [...found].map(([store, name]) => ({ name, store }));
}

const SHOPPY = /collectib|shop|product|profileeffect|decoration|nameplate/i;

export function avariceShopDebug(): string {
    const v = V();
    const common = v?.Webpack?.Common ?? {};
    const all = allStores();
    const shoppy = all.filter(s => SHOPPY.test(s.name));
    const lines = [
        `catalog=${getAvariceCatalog().length} lastLoad=${lastLoadInfo}`,
        `vencord=${!!v} webpack=${!!v?.Webpack} common=[${Object.keys(common).length} keys]`,
        `FluxDispatcher=${!!common.FluxDispatcher} hooked=${!!common.FluxDispatcher?.__avariceHooked} RestAPI=${!!common.RestAPI}`,
        `Flux.Store.getAll=${typeof common.Flux?.Store?.getAll} webpackCache=${Object.keys(v?.Webpack?.cache ?? {}).length}`,
        `stores=${all.length} shopLike=${shoppy.length}`,
        ...shoppy.slice(0, 15).map(({ name, store }) => {
            let keys = "";
            try {
                keys = Object.keys(store ?? {})
                    .slice(0, 10)
                    .join(",");
            } catch {}
            return `  ${name}: [${keys}]`;
        })
    ];
    return lines.join("\n");
}

// ---- load the shop list straight from Discord's API (same request the Shop page makes) ----
let lastLoadInfo = "never";
export async function loadAvariceShop(): Promise<number> {
    const Rest = V()?.Webpack?.Common?.RestAPI;
    if (!Rest?.get) {
        lastLoadInfo = "no RestAPI";
        return 0;
    }
    let added = 0;
    const results: string[] = [];
    for (const url of ["/collectibles-categories", "/collectibles-shop", "/collectibles-categories/v2"]) {
        try {
            const res = await Rest.get({
                url,
                query: { include_bundles: true, include_unpublished: false }
            });
            const n = ingestCategories(res?.body ?? res);
            added += n;
            results.push(`${url}:ok(+${n})`);
        } catch (e: any) {
            results.push(`${url}:${e?.status ?? "err"}`);
        }
    }
    lastLoadInfo = results.join(" ");
    return added;
}

export function refreshAvariceCatalog() {
    for (const { name, store } of allStores()) {
        if (!SHOPPY.test(name) || !store) continue;
        try {
            ingestCategories(store);
            const candidates = ["getCategories", "getProducts", "getAllProducts", "categories", "products"];
            for (const fn of candidates) {
                if (typeof (store as any)[fn] === "function") {
                    try {
                        ingestCategories((store as any)[fn]());
                    } catch {}
                } else if ((store as any)[fn]) {
                    try {
                        ingestCategories((store as any)[fn]);
                    } catch {}
                }
            }
        } catch {}
    }
    return getAvariceCatalog();
}

function captureCatalog() {
    const Flux = V()?.Webpack?.Common?.FluxDispatcher;
    if (Flux && !Flux.__avariceHooked) {
        Flux.__avariceHooked = true;
        const orig = Flux.dispatch;
        const wrapped = (action: any) => {
            try {
                if (
                    typeof action?.type === "string" &&
                    /COLLECTIBLE|SHOP|PRODUCT|SKU|PROFILE_EFFECT|DECORATION/.test(action.type)
                ) {
                    ingestCategories(action);
                }
            } catch {}
            return orig.call(Flux, action);
        };
        Flux.dispatch = wrapped;
        cleanups.push(() => {
            if (Flux.dispatch === wrapped) Flux.dispatch = orig;
            delete Flux.__avariceHooked;
        });
    }
}

function pickedItem(kind: AvariceItem["kind"]): AvariceItem | undefined {
    const sku = S()["avarice_" + kind];
    if (!sku) return undefined;
    return getAvariceCatalog().find(i => i.kind === kind && i.skuId === sku);
}

function override(obj: any, key: string, value: any) {
    if (!obj) return;
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor && !descriptor.configurable) return;
    const originals = (obj[ORIG] ??= {});
    if (!(key in originals)) {
        if (value === undefined) return;
        originals[key] = obj[key];
    }
    if (value === undefined) {
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: originals[key]
        });
        delete originals[key];
        return;
    }
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: descriptor?.enumerable ?? true,
        get: () => value,
        set: v => {
            originals[key] = v;
        }
    });
}

export function applyAvariceCosmetics() {
    const me = V()?.Webpack?.Common?.UserStore?.getCurrentUser?.();
    if (!me) return;

    const deco = pickedItem("decoration");
    const decoVal = deco ? { asset: deco.data.asset, skuId: deco.skuId } : undefined;
    override(me, "avatarDecorationData", decoVal);
    override(me, "avatarDecoration", decoVal);

    const plate = pickedItem("nameplate");
    const orig = me[ORIG]?.collectibles ?? me.collectibles;
    override(
        me,
        "collectibles",
        plate
            ? {
                  ...(orig ?? {}),
                  nameplate: {
                      asset: plate.data.asset,
                      palette: plate.data.palette,
                      skuId: plate.skuId,
                      label: plate.data.label
                  }
              }
            : undefined
    );

    const fx = pickedItem("effect");
    try {
        const ProfileStore = V()?.Webpack?.findStore?.("UserProfileStore");
        const profile = ProfileStore?.getUserProfile?.(me.id);
        if (profile) {
            const effectId = fx?.data?.id ?? fx?.skuId;
            override(profile, "profileEffect", fx ? { id: effectId, skuId: fx.skuId } : undefined);
            override(profile, "profileEffectId", fx ? effectId : undefined);

            const c1 = S().avariceThemePrimary,
                c2 = S().avariceThemeAccent;
            const hex = (c: string) => parseInt(c.replace("#", ""), 16);
            const colors = c1 && c2 ? [hex(c1), hex(c2)] : undefined;
            override(profile, "themeColors", colors);
            // Discord only draws profile themes for Nitro profiles
            override(profile, "premiumType", colors ? 2 : undefined);
        }
    } catch {}
}

// ---------- client-side badges ----------
function registerBadges() {
    const Badges = V()?.Api?.Badges;
    if (!Badges?.addProfileBadge) return;
    const badge = {
        id: "avarice-client-badges",
        position: 0, // start of the badge row
        getBadges: ({ userId }: { userId: string }) => {
            const me = V()?.Webpack?.Common?.UserStore?.getCurrentUser?.()?.id;
            if (!me || userId !== me) return [];
            const picked: string[] = S().avariceBadges ?? ["avarice"];
            return [...AVARICE_BADGES.filter(b => picked.includes(b.id)), ...getCustomBadges()]
                .filter(b => !(S().avariceHiddenBadges ?? []).includes(b.id))
                .map(b => ({
                    id: "avarice-" + b.id,
                    description: b.name,
                    iconSrc: b.icon
                }));
        }
    };
    Badges.addProfileBadge(badge);
    cleanups.push(() => Badges.removeProfileBadge?.(badge));
}

// ---------- Nitro app themes (the gradient presets in "Preview Theme"), client-side ----------
// Without Nitro, Discord only *previews* a preset and drops it when the picker closes. Previews are
// applied locally by a Flux action, so Avarice records the action that turned a preset on, replays it
// whenever Discord clears the preset again, and replays it on every launch. Also, while a gradient is
// showing, <html> gets .avarice-gradient so the Avarice CSS stops painting backgrounds over it.
const GRADIENT_CLASS = "avarice-gradient";
let replaying = false;

function findStoreSafe(name: string): any {
    try {
        return V()?.Webpack?.findStore?.(name);
    } catch {
        return undefined;
    }
}

function activeGradientId(): number | null {
    const bg = findStoreSafe("ClientThemesBackgroundStore");
    const preset = bg?.gradientPreset ?? bg?.getGradientPreset?.();
    if (preset?.id != null) return preset.id;
    const proto = findStoreSafe("UserSettingsProtoStore");
    const id = proto?.settings?.appearance?.clientThemeSettings?.backgroundGradientPresetId?.value;
    return id ?? null;
}

function syncGradientClass() {
    const html = document.documentElement;
    const discordFlag = [...html.classList].some(c => c !== GRADIENT_CLASS && /custom-theme/i.test(c));
    html.classList.toggle(GRADIENT_CLASS, activeGradientId() != null || discordFlag);
}

function replayGradient() {
    const raw = S().avariceGradientAction;
    if (!raw || activeGradientId() === S().avariceGradientId) return;
    const Flux = V()?.Webpack?.Common?.FluxDispatcher;
    if (!Flux) return;
    replaying = true;
    try {
        Flux.dispatch(JSON.parse(raw));
    } catch (e) {
        console.warn("[Avarice] couldn't re-apply app theme:", e);
    } finally {
        replaying = false;
    }
    syncGradientClass();
}

/** Called from Avarice settings: forget the picked app theme. */
export function clearAvariceGradient() {
    S().avariceGradientId = undefined;
    S().avariceGradientAction = undefined;
    location.reload();
}

function watchGradient() {
    const Flux = V()?.Webpack?.Common?.FluxDispatcher;
    if (Flux) {
        const orig = Flux.dispatch;
        const wrapped = function (this: any, action: any) {
            const before = activeGradientId();
            const result = orig.call(Flux, action);
            const check = () => {
                const after = activeGradientId();
                if (after === before || replaying) return;
                if (after != null) {
                    // a preset was turned on (clicked in the picker): remember the exact action
                    try {
                        S().avariceGradientId = after;
                        S().avariceGradientAction = JSON.stringify(action);
                        console.info("[Avarice] app theme saved:", after, action?.type);
                    } catch {}
                } else if (before === S().avariceGradientId) {
                    // Discord cleared it (picker closed / preview ended): put it back
                    setTimeout(replayGradient, 0);
                }
                syncGradientClass();
            };
            check();
            if (result && typeof result.then === "function") result.then(check, () => {});
            return result;
        };
        Flux.dispatch = wrapped;
        cleanups.push(() => {
            if (Flux.dispatch === wrapped) Flux.dispatch = orig;
        });
    }
    const mo = new MutationObserver(syncGradientClass);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    cleanups.push(() => mo.disconnect());
    replayGradient();
    syncGradientClass();
}

// Hide the Nitro upsells in the app theme picker (banner + "Try 1 month" button). Text-based because
// Discord's class names change every build. English UI only.
const UPSELL_TEXT = /free trial|try \d+ (month|day|week)s? for|new theme colors/i;
const PANEL_TEXT = /preview theme|create your own theme|app theme/i;
function hideUpsellsIn(root: Node) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hits: Element[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (UPSELL_TEXT.test(n.textContent ?? "") && n.parentElement) hits.push(n.parentElement);
    }
    for (const el of hits) {
        if (el.closest("[data-avarice-hidden]")) continue;
        // only inside the theme picker
        let panel: Element | null = el.parentElement;
        while (panel && !PANEL_TEXT.test(panel.textContent ?? "")) panel = panel.parentElement;
        if (!panel || panel === document.body) continue;
        // the "Try 1 month" button: hide just the button, keep the heart next to it
        let target: Element = el.closest("button,[role='button']") ?? el;
        if (!target.matches("button,[role='button']")) {
            // the banner: climb to the whole card, stopping before the picker itself
            while (
                target.parentElement &&
                target.parentElement !== panel &&
                !PANEL_TEXT.test(target.parentElement.textContent ?? "") &&
                (target.parentElement.textContent?.length ?? 0) < 220
            )
                target = target.parentElement;
        }
        (target as HTMLElement).style.display = "none";
        target.setAttribute("data-avarice-hidden", "upsell");
    }
}

function watchThemeUpsells() {
    const mo = new MutationObserver(records => {
        for (const r of records)
            for (const node of r.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.parentElement) hideUpsellsIn(node.parentElement);
                } else if (node instanceof Element && UPSELL_TEXT.test(node.textContent ?? "")) hideUpsellsIn(node);
            }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => mo.disconnect());
    hideUpsellsIn(document.body);
}

async function init() {
    try {
        enableNitroPlugins();
        const ready = V()?.Webpack?.onceReady;
        if (ready) await ready;
        registerBadges();
        watchIdentity();
        captureCatalog();
        applyAvariceCosmetics();
        applyAvariceAura();
        watchGradient();
        watchThemeUpsells();
    } catch (e) {
        console.error("[Avarice] extras failed:", e);
    }
}

window.addEventListener(
    "pagehide",
    () => {
        if (refreshTimer !== undefined) clearTimeout(refreshTimer);
        for (const cleanup of cleanups.splice(0)) cleanup();
    },
    { once: true }
);

init();
