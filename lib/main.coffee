{CompositeDisposable} = require 'atom'
LineEndingRegExp = /(?:\n|\r\n)$/

CommandPrefix = 'vim-mode-plus-user'
module.exports =
  config:
    registerToSelectList:
      description: 'Register as member of transformers for TransformStringBySelectList at Atom startup'
      type: 'boolean'
      default: false

  activate: ->
    @subscriptions = new CompositeDisposable

  deactivate: ->
    @subscriptions?.dispose()
    @subscriptions = {}

  subscribe: (args...) ->
    @subscriptions.add args...

  consumeVim: ({Base}) ->
    TransformStringByExternalCommand = Base.getClass('TransformStringByExternalCommand')

    class ReplaceWithExecution extends TransformStringByExternalCommand
      @commandPrefix: CommandPrefix

      getCommand: (selection) ->
        text = selection.getText()
        return null unless text = text?.trim()
        [command, args...] = text.split(/\s+/)
        args = args.filter((arg) -> arg.length)
        {command, args}

      getStdin: (selection) ->
        null

      getNewText: (text, selection) ->
        stdout = @getStdout(selection)
        if LineEndingRegExp.test(text)
          stdout
        else
          stdout.replace(LineEndingRegExp, '')

    class ReplaceWithExecutionKeepOriginalText extends ReplaceWithExecution
      @commandPrefix: CommandPrefix
      getNewText: (text, selection) ->
        stdout = super
        stdout = "\n" + stdout unless LineEndingRegExp.test(text)
        text + stdout

    @subscribe(
      ReplaceWithExecution.registerCommand()
      ReplaceWithExecutionKeepOriginalText.registerCommand()
    )
    if atom.config.get('vim-mode-plus-replace-with-execution.registerToSelectList')
      TransformStringBySelectList = Base.getClass('TransformStringBySelectList')
      TransformStringBySelectList::transformers.push(ReplaceWithExecution)
      TransformStringBySelectList::transformers.push(ReplaceWithExecutionKeepOriginalText)
