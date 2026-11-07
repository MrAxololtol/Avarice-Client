#!/usr/bin/env bash
# bash / quick-build.sh / linux / x86_64 / Linux rolling / Avarice Client quick builder
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export AVARICE_QUICK=1
exec "$SCRIPT_DIR/build.sh" "$@"
