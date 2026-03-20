#!/usr/bin/env bash

PIDFILE="${TMPDIR:-/tmp}/smarkform_dev_${USER}.pid"
PIDFILE_MARKER="SMARKFORM_DEV"

# Ensure we run as our own process-group leader so that
# `kill -- -$$` reliably terminates all spawned child processes.
[ -z "$SMARKFORM_DEV_SETSID" ] && exec env SMARKFORM_DEV_SETSID=1 setsid "$0" "$@"

# Stop any already-running instance before starting a new one.
# This allows seamless switching between git worktrees without having
# to manually kill the previous dev server.
if [ -f "$PIDFILE" ]; then
    OLD_PID=$(head -1 "$PIDFILE")
    OLD_MARKER=$(tail -1 "$PIDFILE")
    # Only kill if the PID file belongs to a SmarkForm dev server
    # (guards against accidental kill if a PID was recycled by an unrelated process).
    if [ "$OLD_MARKER" = "$PIDFILE_MARKER" ] && kill -0 "$OLD_PID" 2>/dev/null; then
        echo "Stopping existing dev server (PID: $OLD_PID)..."
        kill -- -"$OLD_PID" 2>/dev/null || true
        # Wait for up to 5 s for the old process group to terminate.
        for _ in {1..10}; do
            kill -0 "$OLD_PID" 2>/dev/null || break
            sleep 0.5
        done
    fi
    rm -f "$PIDFILE"
fi

# Record our PID (== PGID since we are the process-group leader via setsid)
# and a magic marker so we can verify ownership on the next startup.
printf '%s\n%s\n' "$$" "$PIDFILE_MARKER" > "$PIDFILE"

# Remove the PID file when this process exits for any reason.
trap 'rm -f "$PIDFILE"' EXIT

# Initial build ensures all output files exist before Jekyll starts.
# Without this, a fresh checkout requires restarting `npm run dev` after
# the first rollup build completes.
npm run build && \
npx concurrently \
    -n rollup,site \
    "npm run watch" \
    "npm run servedoc" \
;
