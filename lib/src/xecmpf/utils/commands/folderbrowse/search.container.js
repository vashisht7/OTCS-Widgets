/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/models/command',
  'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, require, _, $, Marionette, CommandModel, lang) {
  var SearchWorkspace = CommandModel.extend({

    defaults: {
      signature: 'SearchFromHere',
      name: lang.SearchWorkspace
    },
    enabled: function (status, options) {
      var config = _.extend({
        enabled: false
      }, module.config());
      return config.enabled;
    },

    execute: function (status, options) {
      var config = _.extend({
        pageWidget: false
      }, module.config());

      var self         = this;
      var deferred = $.Deferred();
      require(['xecmpf/widgets/integration/folderbrowse/search.box.view',
        'xecmpf/controls/search.textbox/search.textbox.view',
        'csui/widgets/search.results/search.results.view',
        'csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/next.node',
        'csui/utils/contexts/factories/search.query.factory',
        this.get('commands')
      ], function (SearchBoxView, HeaderSearchBoxView, SearchResultsView, NodeModelFactory,
          NextNodeModelFactory, SearchQueryModelFactory, commands) {
        var searchIconHolder = status.originatingView.$el.find('.csui-search-button');
        if (!searchIconHolder.find('div.csui-searchbox-holder').length) {
          searchIconHolder.append("<div class='csui-searchbox-holder'></div>");
        }
        var  searchRegion = new Marionette.Region({
              el: options.el ? options.el : searchIconHolder.find('div.csui-searchbox-holder')
            }),
            context      = status.originatingView && status.originatingView.context ? status.originatingView.context :
                           options && options.context,
            node         = !!context ? context.getModel(NodeModelFactory) : null,
            nodeId       = !!node ? node.get("id") : 0,
            wkspNodeId   = (status.originatingView && status.originatingView.options && status.originatingView.options.workspaceContext && status.originatingView.options.workspaceContext.wkspid && status.originatingView.options.workspaceContext.wkspid.get("id")) ? status.originatingView.options.workspaceContext.wkspid.get("id") : 0;
        if (!config.pageWidget) { // No need to delete the the factory in case of page widget as
          delete context._factories["searchQuery"];
        }
        var searchInCommand = false;
        var searchView = wkspNodeId === 0 ? SearchBoxView : HeaderSearchBoxView;
        searchInCommand = wkspNodeId === 0 ? false : true;
        self.searchBoxView = new searchView({
            context: context,
            originatingView: status.originatingView,
            data: {
              nodeId: wkspNodeId === 0 ? nodeId : wkspNodeId
            }
        });

        self.originatingViewElement = status.originatingView.$el;
        self.listenTo(self.searchBoxView, "hide:searchbar", function () {
          self.searchBoxView.destroy();
          self.originatingViewElement.find("a.csui-toolitem").show();
          self.originatingViewElement.find("a.csui-toolitem").trigger("focus");
        });
        self.listenTo(self.searchBoxView, "show", function () {
          setTimeout(function () {
              var inputBoxClass = !!searchInCommand ? '.xecmpf-input' : '.csui-input';
              self.originatingViewElement.find(inputBoxClass).trigger("focus");
          }, 25);
        });
        
        status.originatingView.$el.find('.csui-search-button > a.csui-toolitem').hide();
        searchRegion.show(self.searchBoxView);
        if (!config.pageWidget || searchInCommand) {
          if (status.originatingView) {
            var _searchQuery = context.getModel(SearchQueryModelFactory);
            var _viewName, _triggerViewName, _eventName;
            if (searchInCommand) {
              _viewName = self.searchBoxView,
              _triggerViewName = self.searchBoxView,
              _eventName = 'search:results'
            } else {
              _viewName = status.originatingView,
              _triggerViewName = _searchQuery,
              _eventName = 'change'
           }

            _viewName.listenTo(_triggerViewName, _eventName, function () {
              delete context._factories["searchResults"];
              var searchResultsView = new SearchResultsView({
                container: status.container,
                originatingView: status.originatingView,
                context: context,
                commands: commands,
                enableBackButton: true,
                backButtonToolTip: _.str.sformat(lang.SearchBackTooltip,
                    status.container.get("name"))
              });

              var _showOriginatingView, $csSearchResults;
              var originatingViewParent = self.originatingViewElement.parent();
              originatingViewParent.find('.cs-search-results-wrapper').remove();
              originatingViewParent.append("<div class='cs-search-results-wrapper'></div>");

              self.$csSearchResults = $(
                  originatingViewParent.find('.cs-search-results-wrapper')[0]);
              self.$csSearchResults.hide();
              searchResultsView.render();
              if (searchInCommand) {
                searchResultsView.collection.fetch();
              } else {
                context.fetch();
              }
              Marionette.triggerMethodOn(searchResultsView, 'before:show');
              self.$csSearchResults.append(searchResultsView.el);
              if (searchInCommand) {
                self.originatingViewElement.hide();
              } else {
                self.originatingViewElement.hide('blind', {
                  direction: 'left',
                  complete: function () {
                    self.$csSearchResults.show('blind',
                        {
                          direction: 'right',
                          complete: function () {
                            Marionette.triggerMethodOn(searchResultsView, 'show');
                          }
                        },
                        100);
                  }
                }, 100);
              }
              
              _showOriginatingView = function () {

                self.$csSearchResults.hide('blind', {
                  direction: 'right',
                  complete: function () {
                    self.originatingViewElement.show('blind',
                        {
                          direction: 'left',
                          complete: function () {
                            delete context._factories["searchResults"];
                            delete context._factories["searchFacets"];
                            status.originatingView.triggerMethod('dom:refresh');
                          }
                        },
                        100);
                    searchResultsView.destroy();
                    self.$csSearchResults.remove();
                  }
                }, 100);
              };
              self._nextNode = context.getModel(NextNodeModelFactory);
              self.listenToOnce(self._nextNode, 'change:id', _.bind(_showOriginatingView, self));
              self.listenToOnce(searchResultsView, 'go:back', _.bind(_showOriginatingView, self));

            });
          }
        }
        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    }
  });

  return SearchWorkspace;
});