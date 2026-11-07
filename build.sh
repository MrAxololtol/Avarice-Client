#!/usr/bin/env bash
# bash / build.sh / linux / x86_64 / Linux rolling / Avarice Client builder
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo " === Avarice Client builder (Linux) ==="
echo ""

# ---- Git ----
if ! command -v git &>/dev/null; then
    echo "[X] Git is missing. Install it with your package manager (e.g. pacman -S git or apt install git)."
    exit 1
fi

# ---- Node.js ----
if ! command -v node &>/dev/null; then
    echo "[X] Node.js is missing. Install Node.js LTS (e.g. pacman -S nodejs or see https://nodejs.org)."
    exit 1
fi

# ---- pnpm ----
if ! command -v pnpm &>/dev/null; then
    echo "Installing pnpm..."
    npm install -g --prefix ~/.local pnpm || {
        echo "[X] Could not install pnpm."
        exit 1
    }
    export PATH="$HOME/.local/bin:$PATH"
fi

# ---- Vesktop source ----
VESKTOP_DIR="$SCRIPT_DIR/../Vesktop"
if [ ! -d "$VESKTOP_DIR" ]; then
    echo "Downloading Vesktop..."
    git clone https://github.com/Vencord/Vesktop "$VESKTOP_DIR"
else
    echo "Updating Vesktop..."
    git -C "$VESKTOP_DIR" checkout -- .
    git -C "$VESKTOP_DIR" pull
fi

cd "$VESKTOP_DIR"

echo ""
echo "Rebranding to Avarice Client..."
if [ -z "$1" ]; then
    node "$SCRIPT_DIR/rebrand.mjs"
else
    node "$SCRIPT_DIR/rebrand.mjs" "$1"
fi

echo ""
echo "Installing dependencies..."
pnpm i --reporter=append-only

echo ""
echo "Closing any running Avarice Client so its files can be replaced..."
pkill -f avarice-client || true
pkill -f "Avarice Client" || true
sleep 1

OUT="dist"
rm -rf "$VESKTOP_DIR/$OUT/linux-unpacked" "$VESKTOP_DIR/$OUT"/*.AppImage "$VESKTOP_DIR/$OUT"/*.tar.gz 2>/dev/null || true
echo "$OUT" > "$SCRIPT_DIR/last-build-folder.txt"

echo ""
echo "Building the application..."
pnpm build

echo ""
echo "Packaging (Linux x64)..."
TARGETS="AppImage tar.gz"
EXTRA=""

if [ -n "$AVARICE_QUICK" ]; then
    TARGETS="AppImage"
    EXTRA="-c.compression=store"
fi

if [ -n "$AVARICE_TEST" ]; then
    TARGETS="dir"
    EXTRA=""
fi

pnpm exec electron-builder --linux $TARGETS --x64 --publish never $EXTRA -c.directories.output="$OUT"

echo ""
echo " === Done! ==="
echo " Output is in: $VESKTOP_DIR/$OUT"
