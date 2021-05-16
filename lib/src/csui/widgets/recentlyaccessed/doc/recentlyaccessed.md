# RecentlyAccessedView

   The Recently Accessed view provides a list of recently accessed
   items as given through the page context. It allows for filtering the items by opening a
    search field and entering filter criteria. The items are filtered by name and sorted
    by age ascending. Clicking a single item opens the page's default action for
    the node behind. Clicking the expanded icon shows the expanded Recently Accessed view 
    with more columns.

### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(), // holds the model
          recentlyAccessedView = new RecentlyAccessedView({context: pageContext});

      contentRegion.show(recentlyAccessedView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new RecentlyAccessedView.

#### Parameters:
* `options` - *Object*. The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String*. URL to authenticate against.
* `options.connection.supportPath` - *String*. Support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [RecentlyAccessedView](#) object for an example.

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title
* `searchPlaceholder` - for the search field placeholder


