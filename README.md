# vim-mode-plus-replace-with-execution

This is operator plugin for [vim-mode-plus](https://atom.io/packages/vim-mode-plus).  

Replace selected text with the result of stdout of execution.

## keymap example

No keymap by default. Set following keymap to in your `keymap.cson`.  

```coffeescipt
'atom-text-editor.vim-mode-plus.normal-mode, atom-text-editor.vim-mode-plus.visual-mode':
  'f5': 'vim-mode-plus-user:replace-with-execution'
  'shift-f5': 'vim-mode-plus-user:replace-with-execution-keep-original-text
```

or For specific grammar

- Github markdown
```coffeescipt
'atom-text-editor.vim-mode-plus.normal-mode[data-grammar="source gfm"],
  atom-text-editor.vim-mode-plus.visual-mode[data-grammar="source gfm"]':
    'f5': 'vim-mode-plus-user:replace-with-execution'
    'shift-f5': 'vim-mode-plus-user:replace-with-execution-keep-original-text'
```
