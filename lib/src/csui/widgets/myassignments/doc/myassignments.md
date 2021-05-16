# MyAssignmentsView

The MyAssignmentsView provides a list of assignments as given through the page context. 
It allows for filtering the assignments by opening a search field and entering filter criteria. 
The assignments are filtered by name and sorted alphabetically ascending. Clicking a single assignment 
opens the page's default action for the node behind. Clicking the expanded icon shows the expanded 
My Assignments view with more columns.


### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(), // holds the model
          assignmentsView = new MyAssignmentsView({context: pageContext});

      contentRegion.show(assignmentsView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new MyAssignmentsView.

#### Parameters:
* `options` - *Object*. The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String*. URL to authenticate against.
* `options.connection.supportPath` - *String*. Support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [MyAssignmentsView](#) object for an example.

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title
* `searchPlaceholder` - for the search field placeholder


