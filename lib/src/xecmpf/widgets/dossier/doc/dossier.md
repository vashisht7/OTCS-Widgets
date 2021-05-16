# Dossier (widgets/dossier)

The Dossier view lists all documents in the employee workspace as thumbnails displaying the first page of the document. If customized accordingly, you can sort the list by classification or creation date, view document metadata and include a document in your favorites widget.

#Filter

1. In Dossier view, thumbnails can be filtered by two ways, ie, group by "create date" or "Classification". Select one of the options from the drop-down list.

2. You can view the metadata attached to the document. In the Perspective Manager, you can configure that all metadata or only the empty fields should be hidden.

###Example


      var contentRegion = new Marionette.Region({el: "#content"}),
          pageContext   = new PageContext(),
          options       = {
            "context": pageContext,
            data: {
              //"groupBy": "create_date",
              "groupBy": "classification",
              "hideGroupByCriterionDropdown": false,
              "hideMetadata": false,
              "metadata": [
                {
                  "type": "category",
                  "categoryId": 15064
                }
              ],
              "hideEmptyFields": true,
              "hideFavorite": false
            }
          },
          dossierView   = new DossierView(options);

      contentRegion.show(dossierView);
      pageContext.fetch();

### Parameters

## options

`context`: The page context

`data`: The common widget configuration
