/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/widgets/metadata/impl/header/metadata.header.view',
  'csui/widgets/metadata/impl/metadata.dropdowntab.view',
  'csui/utils/contexts/factories/node',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/mixins/view.state/metadata.view.state.mixin',
  'csui/widgets/metadata/impl/metadata.controller',
  'csui/controls/progressblocker/blocker', 'csui/utils/commandhelper',
  'csui/widgets/permissions/permissions.view',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/utils/contexts/factories/next.node',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/impl/metadata'
], function (module, _, $, Marionette, base, MetadataHeaderView, MetadataDropdownTabView,
    NodeModelFactory, ViewEventsPropagationMixin, MetadataViewStateMixin, MetadataController, BlockingView,
    CommandHelper, PermissionsView, ModalAlert, MetadataModelFactory, NextNodeModelFactory, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    showExtraRightActionBar: false
  });

  var MetadataView = Marionette.ItemView.extend({
    className: 'cs-metadata',

    template: false,

    constructor: function MetadataView(options) {
      var self = this;
      options || (options = {});
      options.data || (options.data = {});
      this.options = options;
      this.options.showExtraRightActionBar = this.options.showPermissionView || config.showExtraRightActionBar;
      this.targetView = options.targetView;
      this.context = options.context;
      this.thumbnailViewState = options.originatingView &&
                                options.originatingView.thumbnailViewState;
      this.disableViewState = options.disableViewState;
      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
      }

      if (this._isViewStateModelEnabled()) {
        if (!this.isMetadataNavigation()) {
          this.options.showBackIcon = true;
          this.listenTo(this, 'metadata:close', this._backToPreviousPerspective);
        }
      }
      options.model.unset('initialPanel', {silent: true});
      if (options.data.initialPanel) {
        options.model.set('initialPanel', options.data.initialPanel, {silent: true});
      }

      this.options.showShortcutSwitch = true;
      this.options.showRequiredFieldsSwitch = true;
      if (this.options.model.get('type') === 1 || !!this.options.model.get('shortcutNode')) {  // shortcut
        if (!!this.options.model.get('shortcutNode') && this.options.model.get('type') !== 1) {
          this.options.shortcutNode = this.options.model.get('shortcutNode');
        } else {
          this.options.model.connector.assignTo(this.options.model.original); //TODO: have to do this?
          this.options.shortcutNode = this.options.model;
          var shortcutResourceScope = this.options.shortcutNode.getResourceScope();
          this.options.model.original.setResourceScope(shortcutResourceScope);
          this.options.model = this.options.model.original;
          this.options.model.set('shortcutNode', this.options.shortcutNode, {silent: true});
        }
        this.options.actionsPromise = this._ensureCompleteNode();
      } else {
        this.options.actionsPromise = $.Deferred().resolve().promise();
      }
      if (!!this.options.originatingView && !!this.options.originatingView.supportOriginatingView) {
        this.options.baseOriginatingView = this.options.originatingView;
        this.options.originatingView = this;
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);

      this.options.showDropdownMenu = true;
      this.options.originatingView = this.options.originatingView || this;
      this.metadataHeaderView = new MetadataHeaderView(_.extend({
        metadataScenario: true,
        originatingView: this
      }, this.options));
      this.listenTo(this.metadataHeaderView, "metadata:item:name:save", this._saveItemName)
          .listenTo(this.metadataHeaderView, 'metadata:item:before:delete',
              function (args) {
                self.trigger('metadata:item:before:delete', args);
              })
          .listenTo(this.metadataHeaderView, 'metadata:item:before:move',
              function (args) {
                self.trigger('metadata:item:before:move', args);
              })
          .listenTo(this.metadataHeaderView, 'metadata:item:deleted', function (args) {
            self.trigger('metadata:item:deleted', args);
          })
          .listenTo(this.metadataHeaderView, "shortcut:switch", function (view) {
            self.options.model = view.node;
            self.options.model.set('shortcutNode', self.model.get('shortcutNode'), {silent: true});
            this._ensureCompleteNode()
                .always(function () {
                  !!self.metadataTabView && self.metadataTabView.destroy();
                  if (!!self.options.showPermissionView) {
                    self.metadataTabView = new PermissionsView({
                      model: self.options.model,
                      originatingView: self.options.originatingView,
                      context: self.options.context,
                      showCloseIcon: self.options.originatingView ? false : true,
                      showBackIcon: self.options.originatingView ? true : false,
                      selectedTab: status.selectedTab,
                      selectedProperty: self.options.selectedProperty
                    });

                  } else {
                    self.metadataTabView = new MetadataDropdownTabView({
                      context: self.options.context,
                      node: self.options.model,
                      containerCollection: self.options.containerCollection,
                      originatingView: self.options.originatingView,
                      metadataView: self,
                      activeTab: self.options.activeTab,
                      delayTabContent: self.options.delayTabContent
                    });
                  }

                  self.$el.append(self.metadataTabView.render().$el);
                  self.propagateEventsToViews(self.metadataTabView);
                });
          })
          .listenTo(this.metadataHeaderView, "metadata:close", function () {
            self.trigger("metadata:close");
          })
          .listenTo(this.options.context, 'retain:perspective', function () {
            self._closeMetadata();
          });

      var tabOptions = {
        context: this.options.context,
        node: this.options.model,
        containerCollection: this.options.containerCollection,
        originatingView: this.options.originatingView,
        metadataView: this,
        blockingParentView: this,
        activeTab: this.options.activeTab,
        selectedTab: this.options.selectedTab || this.getViewStateDropdown(),
        selectedProperty: this.options.selectedProperty,
        delayTabContent: self.options.delayTabContent
      };

      if (this.options.showPermissionView) {
        this.options.actionsPromise.always(function () {
          self.metadataTabView = new PermissionsView({
            model: self.options.model,
            originatingView: self.options.originatingView,
            context: self.options.context,
            showCloseIcon: self.options.originatingView ? false : true,
            showBackIcon: self.options.originatingView ? true : false,
            selectedTab: status.selectedTab,
            selectedProperty: self.options.selectedProperty
          });
          self.propagateEventsToViews(self.metadataTabView, self.metadataHeaderView);
        });
      } else {
        this.metadataTabView = new MetadataDropdownTabView(tabOptions);
        this.propagateEventsToViews(this.metadataTabView, this.metadataHeaderView);
      }

      if (this._isViewStateModelEnabled()) {
        this.listenTo(this.context.viewStateModel, 'change:state', this.onViewStateChanged);
      }
    },

    onRender: function () {
      var fetching = this.options.model.fetching;
      if (fetching) {
        return fetching.always(_.bind(this.render, this));
      }

      var mhv = this.metadataHeaderView.render();
      var mdv = this.metadataTabView.render();

      Marionette.triggerMethodOn(mhv, 'before:show', mhv, this);
      Marionette.triggerMethodOn(mdv, 'before:show', mdv, this);

      this.$el.append(mhv.el);
      this.$el.append(mdv.el);

      Marionette.triggerMethodOn(mhv, 'show', mhv, this);
      Marionette.triggerMethodOn(mdv, 'show', mdv, this);

      if (this._isViewStateModelEnabled() && !this.showPermissionView) {
        this._listenToDropdownSelection();
      }
    },

    _isViewStateModelEnabled: function () {
      var viewStateModel = this.context && this.context.viewStateModel;
      return !this.disableViewState && viewStateModel && viewStateModel.get('enabled');
    },

    onViewStateChanged: function() {
      var selection = this.getViewStateDropdown() || this.getDefaultViewStateDropdown(),
          tabLinks = this.metadataTabView.tabLinks;
      if (tabLinks && tabLinks.selected) {
        if (selection && tabLinks.selected.get('name') !== selection) {
          tabLinks.activateDropdownTab(selection, true);
        }
      }
    },

    _listenToDropdownSelection: function() {
      var tabLinks = this.metadataTabView.tabLinks;
      if (tabLinks && tabLinks.selected) {
        var dropDownName = this.getViewStateDropdown();
        if (dropDownName !== tabLinks.selected.get('name')) {
          this.setViewStateDropdown(tabLinks.selected.get('name'), {default: !dropDownName, title: tabLinks.selected.get('title')});
        }
        this.listenTo(tabLinks.selected, 'change', this._onDropDownSelectionChanged);
      }
    },

    _onDropDownSelectionChanged: function (model) {
      this.setViewStateDropdown(model.get('name'), {title: model.get('title')});
    },

    onBeforeDestroy: function () {
      this.cancelEventsToViewsPropagation(this.metadataTabView, this.metadataHeaderView);
      this.metadataHeaderView.destroy();
      this.metadataTabView.destroy();
      if (this.targetView && this.thumbnailViewState) {
          this.targetView.thumbnail.resultsView.triggerMethod("metadata:close");
      }
    },

    _saveItemName: function (args) {
      var self = this;
      var itemName = args.sender.getValue();
      var data = {'name': itemName};
      var metadataController = new MetadataController();
      var node = this.options.model;
      var collection = this.options.collection;
      var shortcutOriginal;
      if (this.options.shortcutNode && this.options.shortcutNode.original === node) {
        var originalNodeInCollection = this.options.collection.findWhere(
            {id: node.get('id')});
        if (originalNodeInCollection) {
          shortcutOriginal = node;
          node = originalNodeInCollection;
        } else {
          collection = undefined;
        }
      }

      var contextualNode = self.context.getModel(NodeModelFactory);
      if( contextualNode) {
        contextualNode.set('name', itemName);
      }


      self._blockActions();
      metadataController.save(node, data)
          .done(function () {
            return node.fetch()
                .then(function () {
                  if (shortcutOriginal) {
                    shortcutOriginal.set(node.attributes);
                  }
                  args.success && args.success();
                  self._unblockActions();
                  if (self.options.originatingView &&
                      _.isFunction(self.options.originatingView.unblockActions)) {
                    self.options.originatingView.unblockActions();
                  }
                 });
          })
          .fail(function (error) {
            self._unblockActions();
            var errorMsg = CommandHelper._getErrorMessageFromResponse(error);
            errorMsg === undefined && (errorMsg = lang.failedToSaveName);
            args.error && args.error(errorMsg);
          });
    },

    _ensureCompleteVersionNode: function () {
      this._blockActions();
      return this.options.model.fetch()
          .always(_.bind(this._unblockActions, this))
          .fail(function (request) {
            var error = new base.Error(request);
            ModalAlert.showError(error.message);
          });
    },

    _ensureCompleteNode: function () {
      var node = this.options.model;

      function checkExpansion(property) {
        var value = node.get(property + '_id');
        if (value && !_.isObject(value) && !_.isObject(node.get(property + '_id_expand'))) {
          node.setExpand('properties', property);
          return true;
        }
      }

      var expandable = _.invoke(['original', 'parent', 'create_user',
        'modify_user', 'owner_user', 'reserved_user'], checkExpansion);
      expandable = _.contains(expandable, true);

      var actionsNeeded = node.actions.length <= 1;

      if (expandable || actionsNeeded) {
        this._blockActions();
        return node.fetch()
            .always(_.bind(this._unblockActions, this))
            .fail(_.bind(function (request) {
              var error = new base.Error(request);
              ModalAlert.showError(error.message);
            }, this));
      }
      return $.Deferred().resolve().promise();
    },

    _backToPreviousPerspective: function () {
      if (this.metadataTabView instanceof MetadataDropdownTabView) {
        if (this._isViewStateModelEnabled()) {
          this.context.viewStateModel.restoreLastRouter();
        } else {
          this._setNextNodeModelFactory(this.options.model.get('id'));
        }
      }
    },

    _setNextNodeModelFactory: function(id) {
      if (this.context && id !== undefined) {
        var nextNode = this.context.getModel(NextNodeModelFactory);
        if (nextNode) {
          if (nextNode.get('id') === id) {
            nextNode.unset('id', {silent: true});
          }
          nextNode.set('id', id);
        }
      }
    },

    _closeMetadata: function () {
      var node = this.options.model;
      if (node.get('type') === 1 && node.original && node.original.get('type') === 0) {
        this.trigger("metadata:close");
      } else {
        this.trigger('metadata:close:without:animation');
      }
    },

    _blockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.blockActions && origView.blockActions();
    },

    _unblockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.unblockActions && origView.unblockActions();
    }
  });

  _.extend(MetadataView.prototype, ViewEventsPropagationMixin);
  _.extend(MetadataView.prototype, MetadataViewStateMixin);

  return MetadataView;
});
