# NodesPaginationView (controls/pagination)

  NodesPaginationView creates a pagination toolbar located at the bottom of a nodes table.
  Pagination has a few configuration parameters that are hard coded into the view.

     this.config = {
        maxRowsPerPage: 100,
        minRowsPerPage: 30,
        ddItemsList: [ 30, 50, 100 ]},   //dropdown page size selection
      };

To include pagination:

 * Provide a div container in which to place it. The ID or class of the div container does not affect the pagination bar.
 
    ### Example:
```	
        <div class="csui-nodestable">
          <div id="tabletoolbar"></div>
          <div id="tableview"></div>
          <div id="paginationview"></div>
        </div>
```

 * Provide the pageSize and collection you used to create the table.

    ###Example:
```
        this.paginationView = new PaginationView({
            collection: collection,
            pageSize: this.options.pageSize
        });
```    

To extend the language bundle for pagination:

 * Create module specific pagination file like:
 
```    
      <module name>/localization/pagination/nls/root/lang:
          PageNavBarTotalItems: "{1} items"
```		

  *	Add language file to their bundles:

```     
      <module name>/bundles/<module>-all:
            ...,
            '<module name>/localization/pagination/nls/root/lang'
```		

 * Map pagination file to csui pagination public language bundle in the config file:

```    
      /app:
            require.config({
              map: {
                '*': {
                  'csui/controls/pagination/nls/localized.strings':
                  '<module>/localization/pagination/nls/lang'
                }
              }
            });
```
