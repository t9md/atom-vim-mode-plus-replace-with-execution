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
    let vimCommands

    const spec = {
      commandPrefix: "vim-mode-plus-user",
      getClass(name) {
        if (!vimCommands) vimCommands = require("./replace-with-execution")(Base)
        return vimCommands[name]
      },
    }

    if (atom.config.get("vim-mode-plus-replace-with-execution.registerToSelectList ")) {
      ReplaceWithExecution.registerToSelectList()
      ReplaceWithExecutionKeepOriginalText.registerToSelectList
    }

    this.subscriptions.add(
      registerCommandFromSpec("ReplaceWithExecution", spec),
      registerCommandFromSpec("ReplaceWithExecutionKeepOriginalText", spec)
    )
  },
}
