# File-Access Error Handling — Agent Knowledge

This document describes how agents should handle file-read, file-write, and path-resolution errors before reporting them to the user or asking for permission.

## When This Applies

Any tool call that accesses the filesystem (`read`, `write`, `glob`, `bash` with file paths) may fail with errors like:

- `ENOENT` / `File not found`
- `EACCES` / `Permission denied`
- `ENOTDIR` / `Not a directory`
- `EISDIR` / `Is a directory`

Before escalating the error to the user, always run the diagnostic checklist below.

## Diagnostic Checklist

1. **Check for typos.** Re-read the exact path character by character. Common mistakes: trailing/leading slashes, misspelled directory names, `.md` vs `.html` extensions.

2. **Verify the correct worktree.** The project may have multiple git worktrees (`wt/fileField/`, `wt/pr-145/`, etc.). Ensure you are targeting the intended worktree's copy of the file, not the main tree's.

3. **Resolve `~` / `$HOME` paths.** If a path begins with `~`, confirm the user's home directory (`$HOME` or `/home/<username>`). Do not assume.

4. **Check case sensitivity.** Linux filesystems are case-sensitive. `README.md` ≠ `readme.md`.

5. **Follow symlinks.** If a path includes a symlink component, use `ls -la` to confirm the target exists.

6. **Check relative vs absolute paths.** A `read` call in `wt/fileField/` with a relative `docs/foo.md` resolves to `wt/fileField/docs/foo.md`, not the main tree's `docs/foo.md`.

7. **If the file is in `node_modules/` or `dist/`.** Verify the dependency is installed (`npm install`) or the project is built (`npm run build`) before assuming the file should exist.

## After Running the Checklist

- If the path is corrected, proceed with the corrected path and note the correction in your response.
- If the path is genuinely missing, report the failure clearly to the user with the exact command that failed and the corrected path (if you found one), and ask whether the file needs to be created.
