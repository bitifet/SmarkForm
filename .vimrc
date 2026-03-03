" Project-level Vim settings for SmarkForm
" Requires 'set exrc' in your ~/.vimrc (or ~/.config/nvim/init.vim) to take effect.
" Optionally add 'set secure' to sandbox what project vimrc files can do.

" This project uses {{{ / }}} fold markers in both source and documentation.
set foldmethod=marker

" Start with all folds open so files are fully readable by default.
" Use 'zm' / 'zM' to close folds, 'zr' / 'zR' to open them.
set foldlevel=99
