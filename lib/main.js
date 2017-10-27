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
    this.notifyDeprecation()
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  notifyDeprecation() {
    const link = "https://github.com/t9md/atom-vim-mode-plus/blob/bundle-replace-with-execution/CHANGELOG.md#1140"
    const message = [
      "vim-mode-plus-replace-with-execution",
      "- This package feature is now bundled in vim-mode-plus(>= v1.14.0) itself.",
      "- Please uninstall. Will be unpublished from package registory soon",
      `- See vim-mode-plus's [CHANGELOG](${link})`,
    ].join("\n")
    atom.notifications.addWarning(message, { dismissable: true})
  },

  consumeVim({Base, registerCommandFromSpec}) {
    const vimCommands = loadVmpCommands(Base)
    const spec = {
      commandPrefix: "vim-mode-plus-user",
      getClass(name) {
        return vimCommands[name]
      },
    }

    for (const name in vimCommands) {
      if (atom.config.get("vim-mode-plus-replace-with-execution.registerToSelectList")) {
        vimCommands[name].registerToSelectList()
      }
      this.subscriptions.add(registerCommandFromSpec(name, spec))
    }
  },
}

function loadVmpCommands(Base) {
  const LineEndingRegExp = /(?:\n|\r\n)$/
  const TransformStringByExternalCommand = Base.getClass("TransformStringByExternalCommand")

  class ReplaceWithExecution extends TransformStringByExternalCommand {
    getCommand(selection) {
      const text = selection.getText().trim()
      if (text) {
        const [command, ...args] = text.split(/\s+/)
        return {command, args: args.filter(arg => arg)}
      }
    }

    getStdin(selection) {
      return null
    }

    getNewText(text, selection) {
      return LineEndingRegExp.test(selection.getText()) ? text : text.replace(LineEndingRegExp, "")
    }
  }

  // date
  class ReplaceWithExecutionKeepOriginalText extends ReplaceWithExecution {
    getNewText(text, selection) {
      const selectedText = selection.getText()
      return selectedText + (LineEndingRegExp.test(selectedText) ? text : "\n" + text)
    }
  }

  return {ReplaceWithExecution, ReplaceWithExecutionKeepOriginalText}
}
