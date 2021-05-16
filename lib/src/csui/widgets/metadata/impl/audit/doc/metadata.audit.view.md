# MetadataAuditView

MetadataAuditView shows a table with audit information of a node, offering rich functionality for sorting and filtering. The audit contains the following information:

* `Action` - The action that the user has performed on the node.
* `Date` - The date on which the action was performed.
* `User` - The user who performed the action.

'Action' and 'User' columns are provided with filtering functionality.

Pagination functionality is also provided for the table.

### Example
```
      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext   = new PageContext(), // holds the model
          currentNode   = pageContext.getModel(NodeModelFactory, {attributes: {id: 11111}});
          auditView = new MetadataAuditView({context: pageContext, node: currentNode});

      contentRegion.show(metaDataView);
```
## Constructor Summary

It creates a new instance of AuditCollection passing options like the node model for which the audit information to be shown and also calls 'fetch' on the collection to make a call to the REST_API and populate the audit data of the given node.

### Constructor (options)

  Creates a new `MetadataAuditView`.

#### Parameters:

* `options` - *Object* The view's options object.
* `options.context` - *Context* The current application's context.
* `options.node` - *Node* The node to show audit information of.
* `options.pageSize` - *pageSize* Maximum number of children (rows) shown on a page in the table. Other rows will be accessible by
pagination. ( integer, 30 by default )
* `options.pageSizes` - *pageSizes* Available page sizes to choose from. If `pageSize` is not explicitly included, it will be added automatically. (array of integers, [30, 50, 100] by default)

## Methods

### getUserSearchboxOptions ()

  Returns an object containing the necessary user search options for the user column to support typeahead filtering.


### getEventSearchboxOptions ()

  Returns an object containing the necessary event search options for the user column to support typeahead filtering.