/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/jquery', 'csui/utils/commandhelper',
  'csui/models/command', 'i18n!csui/utils/commands/nls/localized.strings'
], function (require, $, CommandHelper, CommandModel, lang) {
  'use strict';

  var ExecuteSavedQueryCommand = CommandModel.extend({
    defaults: {
      signature: 'ExecuteSavedQuery',
      scope: 'single'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 258
             && node.get('openable') !== false;
    },

    execute: function (status, options) {
      var node    = CommandHelper.getJustOneNode(status),
          context = status.context || options && options.context;
      if (node.get('custom_view_search')) {
        return this._openFormInSidepanel(node, context);
      } else {
        this._triggerSearchResults(node, context);
      }
    },

    _triggerSearchResults: function (node, context) {
      var deferred = $.Deferred();
      require([
        'csui/utils/contexts/factories/search.query.factory'
      ], function (SearchQueryModelFactory) {
        var searchQuery = context.getModel(SearchQueryModelFactory);
        searchQuery.clear({silent: true});
        searchQuery.set('query_id', node.get('id'));
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise();
    },

    _openFormInSidepanel: function (node, context) {
      var deferred = $.Deferred();
      require(
          ['csui/controls/side.panel/side.panel.view',
            'csui/widgets/search.custom/impl/search.object.view',
            'csui/widgets/search.custom/impl/search.customquery.factory'],
          function (SidePanelView, SearchCustomObjectView, SearchCustomQueryFactory) {
            var savedQuery = context.getCollection(SearchCustomQueryFactory, {
              attributes: {
                id: node.get('id')
              }
            });
            savedQuery.ensureFetched().then(function () {
              var schema = savedQuery.get('schema'),
                  title  = schema.title ? schema.title : node.get('name');

              var customSearchForm = new SearchCustomObjectView({
                context: context,
                model: savedQuery,
                savedSearchQueryId: node.get('id'),
                hideSearchButton: true,
                showInSearchResultsNewPerspective: true
              });

              var sidePanel = new SidePanelView({
                slides: [{
                  title: title,
                  content: customSearchForm,
                  footer: {
                    buttons: [{
                      label: lang.searchButtonMessage,
                      type: 'action',
                      id: 'search-btn',
                      className: 'binf-btn binf-btn-primary',
                      disabled: false
                    }]
                  }
                }],
                sidePanelClassName: 'cvs-in-sidepanel'
              });
              customSearchForm.listenTo(customSearchForm, 'render:form', function() {
                sidePanel.triggerMethod('set:focus');
              });
              sidePanel.show();
              sidePanel.listenTo(customSearchForm, "button:click", function (actionButton) {
                if (actionButton.id === 'search-btn') {
                  customSearchForm.loadCustomSearch();
                }
                sidePanel.hide();
              });

              sidePanel.listenTo(customSearchForm, 'enable:search', function (isSearchEnabled) {
                customSearchForm.trigger("update:button", "search-btn", {
                  disabled: !isSearchEnabled
                });
              });

              sidePanel.listenTo(customSearchForm, 'click:search', function () {
                sidePanel.hide();
              });
              deferred.resolve();
            })
                .fail(function () {
                  deferred.reject();
                });
          }, deferred.reject);
      return deferred.promise();
    }
  });

  return ExecuteSavedQueryCommand;
});
