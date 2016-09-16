{CompositeDisposable} = require 'atom'
LineEndingRegExp = /(?:\n|\r\n)$/

settings =
  registerToSelectList:
    description: 'Register as member of transformers for TransformStringBySelectList at Atom startup'
    type: 'boolean'
    default: false

module.exports =
  config: settings

  activate: ->
    @subscriptions = new CompositeDisposable

  deactivate: ->
    @subscriptions?.dispose()
    [@subscriptions] = []

  subscribe: (args...) ->
    @subscriptions.add args...

  consumeVim: ({Base}) ->
    TransformStringByExternalCommand = Base.getClass('TransformStringByExternalCommand')

    class ReplaceWithExecution extends TransformStringByExternalCommand
      @commandPrefix: 'vim-mode-plus-user'

      # Extract command to use from selected texxt
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
      @commandPrefix: 'vim-mode-plus-user'
      getNewText: (text, selection) ->
        stdout = super
        stdout = "\n" + stdout unless LineEndingRegExp.test(text)
        text + stdout

    if settings.registerToSelectList
      ReplaceWithExecution.registerToSelectList()
      ReplaceWithExecutionKeepOriginalText.registerToSelectList

    @subscribe(
      ReplaceWithExecution.registerCommand()
      ReplaceWithExecutionKeepOriginalText.registerCommand()
    )
