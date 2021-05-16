/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/widgets/metadata/metadata.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'xecmpf/controls/bosearch/searchform/bosearchform.view',
  'xecmpf/controls/bosearch/resultlist/boresultlist.view',
  'hbs!xecmpf/controls/bosearch/impl/bosearch',
  'css!xecmpf/controls/bosearch/impl/bosearch'
], function (require, $, _,
    Marionette,
    MetadataView /* load metadata.css to have the styles and the same load order always */,
    LayoutViewEventsPropagationMixin,
    BoSearchFormView,
    BoResultListView,
    template
) {

  var BusinessObjectSearchView = Marionette.LayoutView.extend({

    className: 'conws-bosearch csui-metadata-overlay',
    template: template,

    regions: {
      searchRegion: '.conws-bosearch-form',
      resultRegion: '.conws-bosearch-result'
    },

    constructor: function BusinessObjectSearchView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
      this.listenTo(this.model,"reference:search",this._referenceSearchOpen);
    },

    templateHelpers: function () {
      return {
        bosearch_title: this.options.title
      };
    },

    onRender: function () {
      this.searchView = new BoSearchFormView({model: this.model, context: this.options.context});
      this.resultView = new BoResultListView({
        model: this.model, context: this.options.context,
        multipleSelect: this.options.multipleSelect,
        enableSorting:  false,
        disableItemsWithWorkspace: this.options.disableItemsWithWorkspace
      });

       if (this.options.title){
         this.$el.addClass("display-title");
       }

      this.searchRegion.show(this.searchView);
      this.resultRegion.show(this.resultView);
    },

    _referenceSearchOpen: function() {
      var bosearchview = this;
      if (bosearchview.searchView && bosearchview.searchView.searchForm) {
        bosearchview.searchView.searchForm.$el.hide();
        var old_id = bosearchview.searchView.searchForm.model.get("id"),
            new_id = bosearchview.searchView.model.get("bo_type_id");
        if (old_id!==new_id) {
          if (bosearchview.resultView && bosearchview.resultView.collection) {
            delete bosearchview.resultView.collection;
            bosearchview.resultView.render();
          }
        }
        bosearchview.searchView.searchForm.model.set({
          "id": new_id,
          "name": bosearchview.searchView.model.get("bo_type_name")
        });
        bosearchview.searchView.searchForm.model
            .fetch({reset:true,silent:true})
            .then(function() {
              if (bosearchview.resultView
                  && bosearchview.resultView.collection
                  && bosearchview.resultView.collection.searchedParams) {
                var searchData = bosearchview.searchView.searchForm.model.get("data"),
                    keysSearchData = _.keys(searchData),
                    searchedParams = bosearchview.resultView.collection.searchedParams,
                    nsearchData = keysSearchData.length,
                    nsearchedParams = _.keys(searchedParams).length,
                    matchKeyCount = _.reduce(searchData,function(count,val,key){
                      return (key in searchedParams) ? count + 1 : count;
                    },0);
                if (( matchKeyCount>0 && matchKeyCount>=keysSearchData.length/2 ) || ( nsearchData === nsearchedParams) ) {
                  _.extend(searchData,_.pick(searchedParams,keysSearchData));
                  if (bosearchview.resultView.resultTable) {
                    var row_id = bosearchview.model.get("row_id");
                    if (row_id && bosearchview.resultView.resultTable.collection.get(row_id)) {
                      bosearchview.resultView.resultTable.setSelection([row_id]);
                    } else {
                      bosearchview.resultView.resultTable.clearSelection();
                    }
                  }
                } else {
                     var oColl = bosearchview.resultView.collection;
                     delete bosearchview.resultView.collection;
                     if (oColl){
                       oColl.stopListening();
                       bosearchview.resultView.stopListening(oColl);
                     }
                  bosearchview.resultView.render();
                }
              }
              bosearchview.searchView.searchForm.render();
              bosearchview.searchView.searchForm.$el.show();
            }, function() {
              bosearchview.searchView.searchForm.$el.show();
            });
      }
    }

  });

  _.extend(BusinessObjectSearchView.prototype, LayoutViewEventsPropagationMixin);

  return BusinessObjectSearchView;
});



