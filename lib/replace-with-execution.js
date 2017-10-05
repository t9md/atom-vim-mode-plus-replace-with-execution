const LineEndingRegExp = /(?:\n|\r\n)$/

module.exports = function loadVmpCommands(Base) {
  const TransformStringByExternalCommand = Base.getClass("TransformStringByExternalCommand")

  class ReplaceWithExecution extends TransformStringByExternalCommand {
    // Extract command to use from selected texxt
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
      const newText = super.getNewText(text, selection)
      return LineEndingRegExp.test(text) ? newText : newText.replace(LineEndingRegExp, "")
    }
  }

  class ReplaceWithExecutionKeepOriginalText extends ReplaceWithExecution {
    getNewText(text, selection) {
      const newText = super.getNewText(text, selection)
      return text + (LineEndingRegExp.test(text) ? newText : "\n" + newText)
    }
  }

  return {ReplaceWithExecution, ReplaceWithExecutionKeepOriginalText}
}
