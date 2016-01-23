# vim-mode-plus-replace-with-execution


This is operator plugin for [vim-mode-plus](https://atom.io/packages/vim-mode-plus).  

Replace selected text with the result of stdout of execution.  
So, **you have to careful enough every time you use this command**.  
Don't set keymap if you are working in critical environment to avoid unwanted invocation.

Pipe(`|`) is not supported.  

![](https://raw.githubusercontent.com/t9md/t9md/eabb959026d79c19956a6d5d3569a47e8849989c/img/replace-with-execution.gif)

## Configuration

### registerToSelectList: (default false)

Register as member of transformers for `TransformStringBySelectList`.  
You have to restart Atom to make change take effect.

### Invocation

Three kinds of invocation.

 - Keymap
 - Command palette
 - From select-list prompted by  `vim-mode-plus:transform-string-by-select-list` command

## Keymap example

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
