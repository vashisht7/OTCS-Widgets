/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

define(['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/children2',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'xecmpf/controls/savedquery.node.picker/impl/search.query.factory',
  'csui/models/form', 'csui/controls/form/form.view',
  'csui/widgets/search.custom/search.custom.view',
  'hbs!xecmpf/controls/savedquery.node.picker/impl/savedquery.form',
  'i18n!xecmpf/controls/savedquery.node.picker/impl/nls/lang',
  'css!xecmpf/controls/savedquery.node.picker/impl/savedquery.form'
], function (module, require, _, $, Marionette, NodeModel, ConnectorFactory,
    Children2CollectionFactory, TabablesBehavior, SearchQueryModelFactory,
    FormModel, FormView, CustomSearchView,
    template, lang) {

  var config = _.extend({
    csSubTypes: {
      queryVolume: 860,
      query: 258
    }
  }, module.config());

  var SavedQueryFormView = Marionette.LayoutView.extend({

    className: 'xecmpf-savedquery-form',

    template: template,

    regions: {
      querySelectRegion: '.xecmpf-sq-select-container',
      customSearchRegion: '.xecmpf-custom-search-container'
    },

    constructor: function SavedQueryFormView(options) {
      options || (options = {});
      options.query || (options.query = options.context.getModel(SearchQueryModelFactory));

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    initialize: function (options) {
      this.query = options.query;
    },

    setQuerySelectField: function () {
      var deferred = $.Deferred();
      this._getQueryCollection()
          .then(function (searchQueryCollection) {
            var map = {};
            searchQueryCollection.each(function (node) {
              map[node.get('name')] = node.get('id');
            });

            this.query.set('query_id', map[_.keys(map)[0]] || '', {
              silent: true
            });

            var that = this;
            this.querySelectForm = new FormView({
              mode: 'create',
              model: new FormModel({
                data: {
                  searchQueryId: this.query.get('query_id')
                },
                schema: {
                  properties: {
                    searchQueryId: {
                      enum: _.values(map)
                    }
                  }
                },
                options: {
                  fields: {
                    searchQueryId: {
                      label: lang.selectQuery,
                      name: 'searchQueryId',
                      type: 'select',
                      optionLabels: _.keys(map),
                      removeDefaultNone: true,
                      onFieldChange: function () {
                        that.onChangeSavedQuerySelectField(this.getValue());
                      }
                    }
                  }
                }
              })
            });
            deferred.resolve();
          }.bind(this), deferred.reject);

      return deferred;
    },

    onChangeSavedQuerySelectField: function (queryId) {
      this.query.clear({
        silent: true
      }).set('query_id', queryId, {
        silent: true
      });

      this.setCustomSearchView()
          .then(function () {
            this.showChildView('customSearchRegion', this.customSearchView);
          }.bind(this), function (err) {
            console.error('Unable to set custom search form view.');
          });
    },

    _getQueryCollection: function () {
      var searchQueryCollection = this.options.context.getCollection(Children2CollectionFactory, {
        options: {
          node: new NodeModel({
            id: config.queryVolumeId,
            type: config.csSubTypes.queryVolume
          }, {
            connector: this.options.context.getObject(ConnectorFactory)
          }),
          filter: {
            type: config.csSubTypes.query // fetch only first level queries not query folders
          }
        },
        attributes: {
          id: config.queryVolumeId
        }
      });

      var deferred = $.Deferred();

      searchQueryCollection
          .ensureFetched()
          .then(function () {
            deferred.resolve(searchQueryCollection);
          }, deferred.reject);

      return deferred;
    },

    setCustomSearchView: function () {
      var deferred = $.Deferred();
      require(['csui/widgets/search.custom/impl/search.object.view'], function (SearchObjectView) {
        this.customSearchView && this.customSearchView.destroy();
        var queryId = this.query.get('query_id');
        this.customSearchView = queryId ?
                                new SearchObjectView({
                                  context: this.options.context,
                                  query: this.options.query,
                                  savedSearchQueryId: queryId
                                }) : new Marionette.View();
        this.customSearchView.model && this.customSearchView.model.ensureFetched();
        deferred.resolve();
      }.bind(this), deferred.reject);
      return deferred;
    },

    onRender: function () {
      this.setQuerySelectField()
          .then(function () {
            this.showChildView('querySelectRegion', this.querySelectForm);
            this.setCustomSearchView()
                .then(function () {
                  this.showChildView('customSearchRegion', this.customSearchView);
                }.bind(this), function (err) {
                  console.error('Unable to set custom search form view.');
                });
          }.bind(this), function (err) {
            console.error('Unable to set saved queries select field.');
          });
    },

    onBeforeDestroy: function () {
      this.customSearchView && this.customSearchView.destroy();
    }

  });

  return SavedQueryFormView;
});