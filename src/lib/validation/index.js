// lib/validation/index.js
// =======================
// Minimal validation plugin for SmarkForm.
//
// Usage:
//   import SmarkForm from 'smarkform';
//   const validation = SmarkForm.createValidation(myForm, {
//     providers: [myProvider],
//     debounce: 300,
//     blockExportOnErrors: true,
//   });
//
// Provider signature:
//   async (ctx) => ({ issues: [...] })
//   ctx = { root, data, reason, changedPaths?, signal? }
//
// Issue shape:
//   { id?, level, paths, code, message, source, details? }
//   Default id: `${source}:${code}:${paths.join('|')}`

/**
 * Normalize a raw issue object, filling in defaults and generating a stable id.
 * @param {object} raw
 * @returns {object} normalized issue
 */
function normalizeIssue(raw) {
    const source = raw.source || 'unknown';
    const code = raw.code || 'unknown';
    const paths = (
        Array.isArray(raw.paths) ? raw.paths
        : (raw.path ? [raw.path] : ['/'])
    );
    const id = raw.id || `${source}:${code}:${paths.join('|')}`;
    return {
        id,
        level: raw.level || 'error',
        paths,
        code,
        message: raw.message || '',
        source,
        details: raw.details,
    };
};

/**
 * Create a validation controller for a SmarkForm root instance.
 *
 * @param {object} root - SmarkForm root instance.
 * @param {object} [options]
 * @param {Array}  [options.providers=[]]           - Validation provider functions.
 * @param {number} [options.debounce=300]           - Debounce delay (ms) for change-triggered validation.
 * @param {boolean}[options.blockExportOnErrors=true] - Prevent export when errors exist.
 * @param {boolean}[options.applyA11y=true]          - Apply aria-invalid side effects.
 * @returns {{ validate, getState, destroy }}
 */
export function createValidation(root, options = {}) {
    const {
        providers = [],
        debounce: debounceDelay = 300,
        blockExportOnErrors = true,
        applyA11y = true,
    } = options;

    // --- internal state ---
    let previousIssues = new Map();  // id -> normalized issue (last run)
    let currentIssues  = new Map();  // id -> normalized issue (latest)
    let pendingDebounce = null;
    let abortController = null;
    let destroyed = false;

    // --- core validate ---
    async function validate(reason) {
        // Cancel any previous in-flight validation.
        if (abortController) abortController.abort();
        abortController = new AbortController();
        const signal = abortController.signal;

        // Export current form data (silent so no extra events fire).
        let data = null;
        try {
            data = await root.actions.export(null, { silent: true });
        } catch (_e) {
            // Export may fail during rendering; continue with null.
        }
        if (signal.aborted) return null;

        // Run all providers and collect raw issues.
        const rawIssues = [];
        for (const provider of providers) {
            try {
                const result = await provider({ root, data, reason, signal });
                if (signal.aborted) return null;
                if (result && Array.isArray(result.issues)) {
                    rawIssues.push(...result.issues);
                }
            } catch (e) {
                if (e && e.name === 'AbortError') return null;
                console.warn('[SmarkForm validation] Provider error:', e);
            }
        }
        if (signal.aborted) return null;

        // Build new issues map.
        const newIssuesMap = new Map();
        for (const raw of rawIssues) {
            const issue = normalizeIssue(raw);
            newIssuesMap.set(issue.id, issue);
        }

        // Diff the new run against the current state (before this run).
        // `currentIssues` holds what the last completed run produced.
        const newIssues        = [];
        const solvedIssues     = [];
        const persistingIssues = [];
        for (const [id, issue] of newIssuesMap) {
            if (currentIssues.has(id)) {
                persistingIssues.push(issue);
            } else {
                newIssues.push(issue);
            }
        }
        for (const [id, issue] of currentIssues) {
            if (!newIssuesMap.has(id)) solvedIssues.push(issue);
        }

        // Advance state.
        previousIssues = currentIssues;
        currentIssues  = newIssuesMap;

        const allIssues  = [...currentIssues.values()];
        const hasErrors  = allIssues.some(i => i.level === 'error');
        const hasWarnings = allIssues.some(i => i.level === 'warning');
        const hasChanges  = newIssues.length > 0 || solvedIssues.length > 0;

        const state = {
            issues: allIssues,
            hasErrors,
            hasWarnings,
            newIssues,
            solvedIssues,
            persistingIssues,
        };

        // Emit ValidationStateChanged (always).
        await root.emit('ValidationStateChanged', { ...state, reason });

        // Emit ValidationIssuesChanged (only when issues changed).
        if (hasChanges) {
            await root.emit('ValidationIssuesChanged', { ...state, reason });
        }

        // Apply ARIA side effects (preventable).
        if (applyA11y) {
            await applyA11yEffects(state);
        }

        return state;
    };

    // --- ARIA side effects ---
    async function applyA11yEffects({ newIssues, solvedIssues }) {
        // Set aria-invalid for new error paths.
        for (const issue of newIssues) {
            if (issue.level !== 'error') continue;
            for (const path of issue.paths) {
                const allowed = await root.emit('BeforeValidationA11yApply', {
                    issue,
                    path,
                    action: 'set',
                });
                if (!allowed) continue;
                const comp = root.find(path);
                if (!comp) continue;
                const node = comp.targetFieldNode || comp.targetNode;
                if (node) node.setAttribute('aria-invalid', 'true');
            }
        }

        // Remove aria-invalid for solved error paths (if no other error remains).
        for (const issue of solvedIssues) {
            if (issue.level !== 'error') continue;
            for (const path of issue.paths) {
                // Check whether another active error still targets this path.
                const stillHasError = [...currentIssues.values()].some(
                    i => i.level === 'error' && i.paths.includes(path)
                );
                if (stillHasError) continue;
                const allowed = await root.emit('BeforeValidationA11yApply', {
                    issue,
                    path,
                    action: 'remove',
                });
                if (!allowed) continue;
                const comp = root.find(path);
                if (!comp) continue;
                const node = comp.targetFieldNode || comp.targetNode;
                if (node) node.removeAttribute('aria-invalid');
            }
        }
    };

    // --- debounced scheduling ---
    function scheduleValidation(reason) {
        if (pendingDebounce !== null) clearTimeout(pendingDebounce);
        pendingDebounce = setTimeout(() => {
            pendingDebounce = null;
            if (!destroyed) validate(reason);
        }, debounceDelay);
    };

    // --- event handlers ---
    function onChangeHandler(/* ev */) {
        if (destroyed) return;
        scheduleValidation('change');
    };

    async function onBeforeExportHandler(ev) {
        if (destroyed || !blockExportOnErrors) return;
        // Run validation immediately (not debounced) before deciding.
        // Cancel any pending debounced run first.
        if (pendingDebounce !== null) {
            clearTimeout(pendingDebounce);
            pendingDebounce = null;
        }
        const state = await validate('export');
        if (state && state.hasErrors) {
            ev.preventDefault();
        }
    };

    // Attach listeners.
    root.on('change', onChangeHandler);
    root.on('BeforeAction_export', onBeforeExportHandler);

    // --- public API ---
    return {
        /**
         * Force an immediate validation run (bypasses debounce).
         * @param {string} [reason='manual']
         * @returns {Promise<object>} validation state
         */
        validate(reason) {
            if (destroyed) return Promise.resolve(null);
            if (pendingDebounce !== null) {
                clearTimeout(pendingDebounce);
                pendingDebounce = null;
            }
            return validate(reason || 'manual');
        },

        /**
         * Return the current validation state (synchronous snapshot).
         * @returns {{ issues, hasErrors, hasWarnings }}
         */
        getState() {
            const issues = [...currentIssues.values()];
            return {
                issues,
                hasErrors:  issues.some(i => i.level === 'error'),
                hasWarnings: issues.some(i => i.level === 'warning'),
            };
        },

        /**
         * Remove listeners and cancel pending work.
         * The object is unusable after destroy().
         */
        destroy() {
            destroyed = true;
            if (pendingDebounce !== null) {
                clearTimeout(pendingDebounce);
                pendingDebounce = null;
            }
            if (abortController) {
                abortController.abort();
                abortController = null;
            }
        },
    };
};
