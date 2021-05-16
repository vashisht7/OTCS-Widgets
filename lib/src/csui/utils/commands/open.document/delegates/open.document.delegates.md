# OpenDocumentDelegateCollection

Chooses a command that will perform "opening of a document". Includes rules that decide the best fitting command using global command preferences and and permissions specific for the particular command. The first command satisfying both will be chosen.

Delegates implemented in this module can be found in [`csui/utils/commands/open.document/csui.open.document.delegates`].

## Methods

### findByNode(node, status, options) : command

Finds the best fitting command by the iterating over the rules. If a rule matches but the command is not enabled for te particular node, further rules will be tested.

## Example

```js
define([
  'csui/utils/commands/open.document/delegates/open.document.delegates'
], function (openDocumentDelegates) {
  'use strict';

  function chooseDelegatedCommand (document) {
    // Prepare a minimum command execution context for evaluating the delegated commands.
    var options = { nodes: new Backbone.Collection([ document ]) };
    return node && openDocumentDelegates.findByNode(document, status, options);
  }
});
```

## Customization

If navigating to the document perspective is enforced over opening the document content, allow the content of just PDFs to be still viewed.

```js
csui.define('myext/always.open.pdf.content', [
  'csui/utils/commands/open'
], function (OpenDocumentContentCommand) {
  'use strict';

  return [
    {
      command: OpenDocumentContentCommand,
      equalsNoCase: {
        mime_type: [
          'application/vnd.pdf',
          'application/x-pdf',
          'application/pdf'
        ]
      }
    }
  ];
});

csui.require.config({
  config: {
    'csui/utils/commands/open.document/delegates/open.document.delegates': {
      extensions: {
        myext: ['myext/always.open.pdf.content']
      }
    }
  }
});
```

[`csui/utils/commands/open.document/csui.open.document.delegates`]: ../csui.open.document.delegates.md#local-open-document-command-delegates
