#!/usr/bin/env bash
# bash / test-setup.sh / linux / x86_64 / Linux rolling / Avarice Client test launcher
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Closing Avarice Client if it's running..."
pkill -f avarice-client || true
pkill -f "Avarice Client" || true
sleep 1

echo "Rebuilding (test build, unpacked directory)..."
export AVARICE_TEST=1
"$SCRIPT_DIR/build.sh" "$@"

OUT="dist"
if [ -f "$SCRIPT_DIR/last-build-folder.txt" ]; then
    OUT="$(cat "$SCRIPT_DIR/last-build-folder.txt" | tr -d '\r\n')"
fi

TEST="$SCRIPT_DIR/../Vesktop/$OUT/linux-unpacked"
DATA="$TEST/Data"

if [ -d "$DATA" ]; then
    echo "Resetting test data folder..."
    rm -rf "$DATA"
fi
mkdir -p "$DATA"

echo "Launching fresh test copy (setup screen will show)..."
VENCORD_USER_DATA_DIR="$DATA" "$TEST/avarice-client" &
