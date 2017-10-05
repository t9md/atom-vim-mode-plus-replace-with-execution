const {CompositeDisposable} = require("atom")

module.exports = {
  config: {
    registerToSelectList: {
      description: "Register as member of transformers for TransformStringBySelectList at Atom startup",
      type: "boolean",
      default: false,
    },
  },

  activate() {
    this.subscriptions = new CompositeDisposable()
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  consumeVim({Base, registerCommandFromSpec}) {
    const vimCommands = require("./replace-with-execution")(Base)
    const spec = {
      commandPrefix: "vim-mode-plus-user",
      getClass(name) {
        return vimCommands[name]
      },
    }

    if (atom.config.get("vim-mode-plus-replace-with-execution.registerToSelectList")) {
      for (const name in vimCommands) {
        vimCommands[name].registerToSelectList()
      }
    }

    this.subscriptions.add(
      registerCommandFromSpec("ReplaceWithExecution", spec),
      registerCommandFromSpec("ReplaceWithExecutionKeepOriginalText", spec)
    )
  },
}
