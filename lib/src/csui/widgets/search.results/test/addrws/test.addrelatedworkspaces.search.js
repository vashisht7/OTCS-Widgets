/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([ 'csui/lib/jquery',
    'csui/lib/marionette',
    'csui/lib/handlebars',
    'csui/controls/toolbar/toolitems.factory',
    'csui/widgets/search.results/search.results.view',
    './test.relatedworkspaces.searchresult.model.js',
    './test.relatedworkspaces.searchform.model.js',
    'csui/utils/contexts/factories/search.query.factory',
    './test.relatedworkspaces.lang.js'
], function ( $, Marionette,
    Handlebars,
    ToolItemsFactory,
    SearchResultsView,
    RelatedWorkspacesSearchResultModel,
    RelatedWorkspacesSearchFormModel,
    SearchQueryModelFactory,
    lang
) {
    'use strict';

    var AddRelatedWorkspacesSearch = Marionette.Controller.extend({
    
        constructor: function AddRelatedWorkspacesSearch() {
          Marionette.Controller.prototype.constructor.apply(this, arguments);

          var status = this.options.status;
          var query = $.extend(true, {}, status.collection.options.query);
          query.where_workspace_type_ids = encodeURIComponent("{"+query.where_workspace_type_id+"}");
          query.where_rel_type = query.where_relationtype;
          delete query.where_workspace_type_id;
          delete query.where_relationtype;

          var searchquery = (new SearchQueryModelFactory(status.context)).property;

          var searchResultCollection = new RelatedWorkspacesSearchResultModel([], {
              node: status.collection.node,
              query: query,
              search: searchquery,
              connector: status.collection.connector,
              autofetch:true,
              autoreset:true,
              stateEnabled: true,
              columns: status.collection.columns,
              workspace: status.collection.workspace,
              orderBy: status.collection.orderBy
          });

          var searchFormModel = new RelatedWorkspacesSearchFormModel({},{
            columns: searchResultCollection.columns
          });

          var toolItemsFactory = new ToolItemsFactory({
            main: [{
              signature: this.options.signature,
              commandData: { submit: true },
              name: lang.ToolbarItemAddRelationSubmit
              }]
            }, {
            maxItemsShown: 1,
            dropDownText: lang.ToolbarItemMore,
            dropDownIcon: 'icon icon-toolbar-more',
            dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
            addGroupSeparators: false
          });

          var toolbarItems = {
            otherToolbar: toolItemsFactory,
            inlineToolbar: [],
            tableHeaderToolbar: toolItemsFactory
          };

          var titleView = new Marionette.ItemView({
            tagName: 'div',
            template: Handlebars.compile('<span><h2 class="csui-custom-search-title">{{title}}</h2></span>')({
              title: this.options.title
            })
          });
  
          var tableColumns = status.originatingView.tableColumns && status.originatingView.tableColumns.deepClone();
          
          var searchView = new SearchResultsView({
            enableBackButton: true,
            enableSearchSettings: false,
            showFacetPanel: false,
            context: status.context,
            query: searchquery,
            collection: searchResultCollection,
            customSearchViewModel: searchFormModel,
            toolbarItems: toolbarItems,
            titleView: titleView,
            tableColumns: tableColumns
          });

          searchView.on("render",function() {
            searchView.$el.addClass('conws-searchview');
          });
          
          this.searchView = searchView;
        }

      });
    
      return AddRelatedWorkspacesSearch;
    

});
    