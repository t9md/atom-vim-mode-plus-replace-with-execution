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

  consumeVim(service) {
    const commands = loadVmpCommands(service)
    for (const command of Object.values(commands)) {
      command.commandPrefix = "vim-mode-plus-user"
      if (atom.config.get("vim-mode-plus-replace-with-execution.registerToSelectList")) {
        command.registerToSelectList()
      }
      this.subscriptions.add(command.registerCommand())
    }
  },
}

function loadVmpCommands(service) {
  const LineEndingRegExp = /(?:\n|\r\n)$/
  const TransformStringByExternalCommand = service.getClass("TransformStringByExternalCommand")

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
