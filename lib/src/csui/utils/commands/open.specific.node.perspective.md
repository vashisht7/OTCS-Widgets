# OpenSpecificNodePerspective Command

Navigates to the perspective assigned to a node. Wraps the navigation to a node perspective in an envelope of a command, so that it can be used on links, toolbars or in menus. It requires the node registered in [`SmartNodeCollection`].

## Example

```js
var folder = new NodeModel({ id: 123, container: true }, { connector });
var options = { nodes: new Backbone.Collection([ folder ]) };
var navigateToNode = commands.get('OpenSpecificNodePerspective');
if (navigateToNode.enabled(options)) {
   navigateToNode
     .execute(options)
     .then(undefined, function (error) { ... });
}
```

[`SmartNodeCollection`]: ../smart.nodes/smart.nodes.md#smartnodecollection
