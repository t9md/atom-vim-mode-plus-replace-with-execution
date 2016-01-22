{CompositeDisposable} = require 'atom'

Config =
  registerToSelectList:
    description: 'register as member of transformers for TransformStringBySelectList'
    type: 'boolean'
    default: true

CommandPrefix = 'vim-mode-plus-user'
module.exports =
  config: Config

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
      autoIndent: true

      getCommand: (selection) ->
        text = selection.getText()
        return null unless text = text?.trim()
        [command, args...] = text.split(/\s+/)
        args = args.filter((arg) -> arg.length)
        {command, args}

    class ReplaceWithExecutionKeepOriginalText extends ReplaceWithExecution
      @commandPrefix: CommandPrefix
      getNewText: (text) ->
        text + "\n" + @input.shift()

    @subscribe(
      ReplaceWithExecution.registerCommand()
      ReplaceWithExecutionKeepOriginalText.registerCommand()
    )
    TransformStringBySelectList = Base.getClass('TransformStringBySelectList')
    TransformStringBySelectList::transformers.push(ReplaceWithExecution)
    TransformStringBySelectList::transformers.push(ReplaceWithExecutionKeepOriginalText)
