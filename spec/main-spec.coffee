requireFrom = (pack, path) ->
  packPath = atom.packages.resolvePackagePath(pack)
  require "#{packPath}/#{path}"

{getVimState} = requireFrom 'vim-mode-plus', 'spec/spec-helper'

describe "vim-mode-plus-replace-with-execution", ->
  [set, ensure, keystroke, editor, editorElement, vimState] = []

  beforeEach ->
    atom.keymaps.add "test",
      'atom-text-editor.vim-mode-plus.normal-mode, atom-text-editor.vim-mode-plus.visual-mode':
        'ctrl-r': 'vim-mode-plus-user:replace-with-execution'
        'ctrl-R': 'vim-mode-plus-user:replace-with-execution-keep-original-text'
      , 100

    waitsForPromise ->
      atom.packages.activatePackage('vim-mode-plus-replace-with-execution')

  describe "replace-with-execution", ->
    beforeEach ->
      getVimState (state, vim) ->
        vimState = state
        {editor, editorElement} = state
        {set, ensure, keystroke} = vim

      runs ->
        set
          text: """
          echo ABC\n
          """
          cursor: [0, 0]

    fit "replace with execution", ->
      keystroke ['V', {ctrl: 'r'}], waitsForFinish: true
      runs ->
        ensure text: "ABC\n"

    fit "replace with execution and keeping keep original text", ->
      keystroke ['V', {ctrl: 'R'}], waitsForFinish: true
      runs ->
        ensure text: "echo ABC\nABC\n"
