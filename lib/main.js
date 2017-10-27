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
      text = text.replace(LineEndingRegExp, "")
      return LineEndingRegExp.test(selection.getText()) ? text + "\n" : text
    }
  }

  class ReplaceWithExecutionKeepOriginalText extends ReplaceWithExecution {
    getNewText(text, selection) {
      text = text.replace(LineEndingRegExp, "")
      const endRow = selection.getBufferRowRange()[1]
      selection.cursor.setBufferPosition([endRow, Infinity])
      return "\n" + text
    }
  }
  return {ReplaceWithExecution, ReplaceWithExecutionKeepOriginalText}
}
