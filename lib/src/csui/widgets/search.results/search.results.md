# SearchResultsView

Shows full-text search results with additional functionality to load batches
of results on demand if there are a lot of them, or change sorting.

A control setting the search query is expected to be placed on the page,
otherwise the search results would have no query to use.

### Example

```javascript
var queryRegion = new Marionette.Region({el: '#query'}),
    resultsRegion = new Marionette.Region({el: '#results'}),
    pageContext = new PageContext(),
    searchBoxView = new SearchBoxView({context: pageContext}),
    searchResultsView = new SearchResultsView({context: pageContext});

queryRegion.show(searchBoxView);
resultsRegion.show(searchResultsView);
```

To extend the language bundle for pagination:
 1. Create module specific pagination file like:
     <module name>/localization/search/nls/lang:
        EmailLinkSubject: 'I want to share the following links with you',
        EmailLinkDesktop: "Link for Desktop and Android",
        EmailAppleLinkFormat: "Link for iOS Mobile"

 2. Add lang file in their bundles file:

     <module name>/bundles/<module>-all:
        ...,
        '<module name>/localization/search/nls/lang'

 3. Map it to csui pagination public language bundle in the config file:

     /app:
         require.config({
           map: {
             '*': {
                'csui/widgets/search.results/nls/lang': '<module name>/localization/search/nls/lang'
             }
           }
         });

To extend search results metadata override server.adator.mixin and search.metadata.mixin of search
.metadata.model (csui/models/widget/search.results/search.metadata).

#### Parameters:
* `config.enableBreadcrumb` - *Boolean* flag to hide location breadcrumb within searchResultsView. This affects  all instances.
Default: true.

* `config.enableSearchSettings` - *Boolean* flag to hide search settings button. This affects all instances.
Default: true.

* `options.enableSearchSettings` - *Boolean* flag to hide search settings button. This can be set in the constructor options and controls the single instance only, winning over the global setting.
Default: true.

### Newer developments:
Added new feature in the search results i.e. Tabular view of search results.
For this we have introduced two new toolbar items one is tableHeaderToolbar for showing bulk
actions and tabularInlineToolbar for inline actions in the toolbaritems.

### Future release updates
In the future release, tableHeaderToolbar & tabularInlineToolbar will be depricated and there will be no speperate configuration required for toolbar items in tabular view. 
All toolbar items configured in the otherToolbar will be shown in Header toolbar for both standard and tabular view.
All toolbar items configured in the inlineToolbar will be shown in Inline toolbar for both standard and tabular view.