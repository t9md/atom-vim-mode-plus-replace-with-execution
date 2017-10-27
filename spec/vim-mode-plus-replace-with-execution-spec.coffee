requireFrom = (pack, path) ->
  packPath = atom.packages.resolvePackagePath(pack)
  require "#{packPath}/#{path}"

{getVimState} = requireFrom 'vim-mode-plus', 'spec/spec-helper'

describe "vim-mode-plus-replace-with-execution", ->
  [set, ensure, ensureWait, editor, editorElement, vimState] = []

  beforeEach ->
    atom.keymaps.add "test",
      'atom-text-editor.vim-mode-plus.normal-mode, atom-text-editor.vim-mode-plus.visual-mode':
        'ctrl-r': 'vim-mode-plus-user:replace-with-execution'
        'ctrl-R': 'vim-mode-plus-user:replace-with-execution-keep-original-text'
      , 100

    waitsForPromise ->
      atom.packages.activatePackage('vim-mode-plus-replace-with-execution')

  describe "ReplaceWithExecution", ->
    beforeEach ->
      getVimState (state, vim) ->
        vimState = state
        {editor, editorElement} = state
        {set, ensure, ensureWait} = vim

      runs ->
        set textC: "|echo ABC\n"

    describe "replace with execution result", ->
      it "normal", -> ensureWait 'ctrl-r $', text: "ABC\n", mode: 'normal'
      it "visual", -> ensureWait 'V ctrl-r', text: "ABC\n", mode: 'normal'

    describe "replace with execution result with keep original text", ->
      it "normal", -> ensureWait 'ctrl-R $', text: "echo ABC\nABC\n", mode: 'normal'
      it "visual", -> ensureWait 'V ctrl-R', text: "echo ABC\nABC\n", mode: 'normal'
