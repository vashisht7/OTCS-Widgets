# OpenNodePerspective Command

Provides a base class for commands that open a node perspective. Implements an execution that triggers the perspective navigation. The inherited command has to provide its signature and means of enabling.

## Example

```js
var OpenNode = OpenNodePerspectiveCommand.extend({
  defaults: {
    signature: "OpenNode",
    command_key: ['open'],
    openable: true,
    scope: "single"
  }
});
```
