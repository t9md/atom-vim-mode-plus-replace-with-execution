describe "test", ->
  pack = 'language-coffee-script'
  beforeEach ->
    waitsForPromise ->
      atom.packages.activatePackage(pack)

    getVimState 'sample-spec.coffee', (state, vim) ->
      vimState = state
      {editor, editorElement} = state
      {set, ensure, keystroke} = vim

    waitsForPromise ->
      atom.packages.activatePackage('vim-mode-plus-move-to-symbols')

    runs ->
      set cursor: [0, 0]

  afterEach ->
    atom.packages.deactivatePackage(pack)

  it "test", ->
    ensureMoveToSymbols ')', cursor: [1, 2]
    ensureMoveToSymbols ')', cursor: [3, 2]
    ensureMoveToSymbols ')', cursor: [5, 2]
    ensureMoveToSymbols ')', cursor: [7, 0]
