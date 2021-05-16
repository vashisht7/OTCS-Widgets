# OpenDocument Command

Opens a document by delegating this operation to another command. Accepts object types with content. Automatically resolves shortcuts and generations to their target document or version. The commands to delegate the operation to can be customized by ordered rules ([`OpenDocumentDelegateCollection`]).

## Example

```js
var document = new NodeModel({ id: 123, type: 144, openable: true }, { connector });
var options = { nodes: new Backbone.Collection([ document ]) };
var openDocument = commands.get('OpenDocument');
if (openDocument.enabled(options)) {
   openDocument
     .execute(options)
     .then(undefined, function (error) { ... });
}
```

[`OpenDocumentDelegateCollection`]: ./delegates/open.document.delegates.md#opendocumentdelegatecollection
