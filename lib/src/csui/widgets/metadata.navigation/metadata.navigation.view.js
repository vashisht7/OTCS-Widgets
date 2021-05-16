/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module','csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/progressblocker/blocker', 'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/children', 'csui/utils/contexts/factories/children2',
  'csui/widgets/nodestable/nodestable.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
  'csui/behaviors/default.action/impl/defaultaction', 'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/utils/contexts/perspective/plugins/node/node.extra.data',
  'i18n!csui/widgets/metadata.navigation/impl/nls/lang',
  'css!csui/widgets/metadata.navigation/impl/metadata.navigation'
], function (module, _, $, Backbone, Marionette, base, BlockingView, NodeModelFactory,
    ChildrenCollectionFactory, Children2CollectionFactory, NodesTableView,
    ViewEventsPropagationMixin, MetadataNavigationViewImpl, DefaultActionController,
    ModalAlert, MetadataModelFactory, nodeExtraData, lang) {
  'use strict';

  var config = module.config();
  if (NodesTableView.useV2RestApi) {
    ChildrenCollectionFactory = Children2CollectionFactory;
  }
  var MetadataNavigationView = Marionette.ItemView.extend({

    className: 'cs-metadata-navigation-wrapper',

    template: false,

    constructor: function MetadataNavigationView(options) {
      options = _.defaults(options, config);
      options.data || (options.data = {});
      options.showCloseIcon = false;
      this.options = options;
      this.defaultActionController = new DefaultActionController();
      if (!!this.options.originatingView && !!this.options.originatingView.supportOriginatingView) {
        this.options.baseOriginatingView = this.options.originatingView;
        this.options.originatingView = this;
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);
    },

    onRender: function () {
      var fetching = this._ensureCompleteData();
      if (fetching) {
        return fetching.done(_.bind(this.render, this));
      }

      this.metadataNavigationView && this.metadataNavigationView.destroy();
      var mnv = this.metadataNavigationView = new MetadataNavigationViewImpl(this.options);
      this.propagateEventsToViews(this.metadataNavigationView);

      this.metadataNavigationView.render();
      Marionette.triggerMethodOn(mnv, 'before:show', mnv, this);
      this.$el.append(mnv.el);
      Marionette.triggerMethodOn(mnv, 'show', mnv, this);
    },

    onBeforeDestroy: function () {
      if (this.metadataNavigationView) {
        this.cancelEventsToViewsPropagation(this.metadataNavigationView);
        this.metadataNavigationView.destroy();
      }
    },

    _ensureCompleteData: function () {
      var options = this.options;
      if (options.model && options.collection && options.containerCollection) {
        return;  // return nothing (undefined) for synchronous code flow in onRender
      }
      return this._loadingDataByMetadata();
    },

    _loadingDataByMetadata: function () {
      var self = this;
      var deferred;
      var options = this.options;
      if (!options.model || (!options.collection && !options.containerCollection)) {
        deferred = $.Deferred();
      }

      function loadCollectionAfterModel() {
        self._loadCollection()
            .always(function () {
              self.unblockActions();
            })
            .done(function (response) {
              deferred && deferred.resolve(response);
            })
            .fail(function (error) {
              deferred && deferred.reject(error);
            });
      }
      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
        options.selected = options.model;
        self.blockActions();
        loadCollectionAfterModel();
      } else if (!options.collection || !options.containerCollection) {
        options.selected = options.model;
        self.blockActions();
        loadCollectionAfterModel();
      }

      return deferred && deferred.promise();
    },

    _loadCollection: function () {
      var self = this;
      var deferred = $.Deferred();
      var options = this.options;
      var collection = options.collection || options.containerCollection;

      function ensureModelInCollection() {
        if (!collection.findWhere({id: options.model.get('id')})) {
          collection.add(options.model, {at: 0, silent: true});
        }
      }

      function setCollectionToOptions() {
        options.collection || (options.collection = collection);
        options.containerCollection || (options.containerCollection = collection);
      }

      if (!collection) {
        var metadataModel = options.context.getModel(MetadataModelFactory);
        if (metadataModel) {
          var metadataInfo = metadataModel.get('metadata_info'),
              contextCollection = metadataInfo && metadataInfo.collection;
          if (contextCollection && contextCollection.length > 0) {
            collection = contextCollection;
            ensureModelInCollection();
            setCollectionToOptions();
            delete options.context.viewStateModel.get('state').collection;
            return deferred.resolve().promise();
          }
        }
      }

      if (!collection) {
        options.model.ensureFetched()
            .done(function (response) {
              options.model.set('csuiLazyActionsRetrieved', true, {silent: true});
              options.model.set('csuiAddPropertiesActionsRetrieved', true, {silent: true});
              options.container = options.context.getModel(NodeModelFactory, {
                attributes: {id: options.model.get('parent_id')},
                temporary: true
              });
              options.container.ensureFetched()
                  .done(function (response) {
                    collection = options.context.getCollection(
                        ChildrenCollectionFactory, {
                          options: {
                            node: options.container,
                            commands: self.defaultActionController.commands,
                            defaultActionCommands: self.defaultActionController.actionItems.getAllCommandSignatures(
                                self.defaultActionController.commands),
                            delayRestCommands: !!options.delayRestCommands
                          }

                        });
                    collection.setFields(nodeExtraData.getModelFields());
                    collection.ensureFetched()
                        .done(function (response2) {
                          collection.forEach(function (model) {
                            model.set('csuiLazyActionsRetrieved', true, {silent: true});
                            model.set('csuiAddPropertiesActionsRetrieved', true, {silent: true});
                          });
                          ensureModelInCollection();
                          setCollectionToOptions();
                          deferred.resolve(response2);
                        })
                        .fail(function (error2) {
                          self._showFetchNodeFailMessage(error2, options.container.get("id"));
                          deferred.reject(error2);
                        });
                  })
                  .fail(function (error) {
                    self._showFetchNodeFailMessage(error, options.container.get("id"));
                    deferred.reject(error);
                  });
            })
            .fail(function (error) {
              self.unblockActions();
              self._showFetchNodeFailMessage(error, options.model.get("id"));
              deferred && deferred.reject(error);
            });

        return deferred.promise();
      }

      return deferred.resolve().promise();
    },

    _showFetchNodeFailMessage: function (error, nodeId) {
      var errorObj = new base.Error(error);
      var title = lang.FetchNodeFailTitle;
      var message = _.str.sformat(lang.FetchNodeFailMessage, nodeId, errorObj.message);
      ModalAlert.showError(message, title);
    }

  });

  _.extend(MetadataNavigationView.prototype, ViewEventsPropagationMixin);

  return MetadataNavigationView;

});
