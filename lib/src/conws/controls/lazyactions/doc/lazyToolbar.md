# LazyToolbarView (controls/lazyactions/lazyToolbar.view)

LazyToolbar view renders the Toolbar in delayed mode when the user clicks on the show-more button. 
It renders the delayed toolbar items from unpromotedactions (/lazy actions) by making an actions call.

# Example

    var contentRegion = new Marionette.Region({el: "body"}),
       var delayedToolbarViewOptions = {
         context: context,
         container: node,
         toolbarItems: testToolbar,
         node: node, 
         originatingView: this,
         toolbarItemsMask: toolbarItemsMask,          
         toolbarItems: toolbarItems,
         commands: AllCommands
        };

    var lazyToolbarView = new LazyToolbarView(delayedToolbarViewOptions);
    contentRegion.show(lazyToolbarView);
