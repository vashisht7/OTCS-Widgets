/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone", "csui/lib/marionette",
  'csui/utils/log', 'csui/controls/toolbar/toolitem.view', 'csui/controls/progressblocker/blocker',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model', 'csui/utils/commands',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'hbs!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',
  'csui/lib/binf/js/binf'
], function (module, $, _, Backbone, Marionette, log, ToolItemView, BlockingView,
    NodeCollection, FilteredToolItemsCollection, commands, DropdownMenuBehavior,
    template, lang) {
  'use strict';

  log = log(module.id);
  var AddPropertiesDropdownMenuView = Marionette.CompositeView.extend({

    className: "metadata-add-properties",

    template: template,
    templateHelpers: function () {
      return {
        btnId: _.uniqueId('addPropertiesButton'),
        addTitleTooltip: (this.collection.length === 1 ?
                          this.collection.at(0).get('name') : lang.addNewProperties)
      };
    },

    childView: ToolItemView,
    childViewContainer: "ul.binf-dropdown-menu",
    childViewOptions: function (model) {
      return {
        role: 'menuitem'
      };
    },

    behaviors: {
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    constructor: function AddPropertiesDropdownMenuView(options) {
      options || (options = {});
      this.context = options.context;
      this.commands = options.commands || commands;
      this.node = options.node;
      this.container = options.container;
      this.formCollection = options.collection;
      this.originalFormCollection = options.formCollection;
      this.listenTo(this.formCollection, "reset", this._updateMenuItems);

      this.originatingView = options.originatingView;
      if (options.blockingParentView) {
        BlockingView.delegate(this, options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      var status = {
        nodes: new NodeCollection([options.node]),
        container: options.container,
        formCollection: this.formCollection,
        originalFormCollection: this.originalFormCollection,
        context: options.context
      };

      var toolbarName = 'addPropertiesToolbar';
      var toolItemFactory = options.toolbarItems[toolbarName];
      options.collection = new FilteredToolItemsCollection(
          toolItemFactory, {
            status: status,
            commands: this.commands,
            delayedActions: options.containerCollection &&
                            options.containerCollection.delayedActions,
            mask: options.toolbarItemsMask
          });

      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }

      this.listenTo(this, "childview:toolitem:action", this._triggerMenuItemAction)
          .listenTo(this.node.actions, 'sync update', this._reRender)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);

      if (options.containerCollection && options.containerCollection.delayedActions) {
        this.listenTo(options.containerCollection.delayedActions, 'sync', this._reRender);
      }

      this.listenTo(this.node, 'sync change', function () {
        this.node.set('csuiAddPropertiesActionsRetrieved', false, {silent: true});
      });
    },

    _updateMenuItems: function () {
      this.collection.refilter();
    },

    _reRender: function () {
      if (this._isRendered && !this._isRendering && !this.isDestroyed) {
        this._updateMenuItems();
        this.render();
      }
    },

    onRender: function () {
      if (this._isRendering) {
        return;
      }
      this._isRendering = true;
      this._ensureLazyActionsRetrieved().always(_.bind(function () {
        this._isRendering = false;
      }, this)).done(_.bind(function () {
        var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
        if (this.collection.length < 1 || this.options.suppressAddProperties === true) {
          this.$el.addClass('binf-hidden');
          dropdownToggleEl.attr('data-cstabindex', '-1');
        } else {
          this.$el.find('.binf-dropdown').removeClass('binf-hidden');
          this.$el.removeClass('binf-hidden');
          dropdownToggleEl.attr('data-cstabindex', '0');
          if (this.collection.length === 1) {
            var addNewCat = this.collection.at(0).get('name');
            dropdownToggleEl.attr({
              'aria-haspopup': false,
              'aria-label': addNewCat,
              'title': addNewCat
            });
            dropdownToggleEl.find('.icon-toolbarAdd').attr('title', addNewCat);
          }
        }

        if (this.collection.length > 1) {
          dropdownToggleEl.binf_dropdown();
        }

        this.$el.find('.binf-dropdown').off('click.' + this.cid).on('click.' + this.cid,
            _.bind(this._onClickAddButton, this));
        dropdownToggleEl.off('click.' + this.cid).on('click.' + this.cid,
            _.bind(this._onClickAddButton, this));

        var self = this;
        setTimeout(function () {
          var event = $.Event('tab:content:render');
          self.$el.trigger(event);
        }, 200);

      }, this)).fail(_.bind(function () {
        this.$el.addClass('binf-hidden');
        this.$el.find('.binf-dropdown-toggle').attr('data-cstabindex', '-1');
      }, this));

    },

    _closeToggle: function () {
      if (this.options.suppressAddProperties !== true) {
        var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
        if (dropdownToggleEl.parent().hasClass('binf-open')) {
          dropdownToggleEl.binf_dropdown('toggle', false);
        }
      }
    },

    _onClickAddButton: function (event) {
      if (this.collection.length === 1) {
        Backbone.trigger('closeToggleAction');
        event.preventDefault();
        event.stopPropagation();
        this._executeAction(this.collection.at(0));
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');  // close the dropdown menu before triggering the event

      this._executeAction(args.toolItem);
    },

    _executeAction: function (toolItem) {
      var signature = toolItem.get('signature');
      var command = this.commands.get(signature);

      var executeOptions = {
        action: this.options.action,
        node: this.options.node,
        collection: this.formCollection,
        container: this.options.container,
        inheritance: this.options.inheritance,
        context: this.options.context,
        parentView: this.options.parentView,  // use for blocking view and callback
        addPropertiesCallback: this.options.addPropertiesCallback
      };

      var status = {
        context: this.options.context,
        nodes: new NodeCollection([this.node]),
        container: this.options.container,
        formCollection: this.formCollection,
        originalFormCollection: this.originalFormCollection,
        originatingView: this.originatingView
      };

      try {
        if (!command) {
          throw new Error('Command "' + signature + '" not found.');
        }

        var el = this.$el.find('.binf-dropdown');
        el.addClass("binf-disabled");
        command.execute(status, executeOptions)
            .done(_.bind(function (resp) {
              el.removeClass("binf-disabled");
              el.closest('.tab-links').find('.tab-links-bar ul li.binf-active a').trigger('focus');
            }, this))
            .fail(function (error) {
              el.removeClass("binf-disabled");
              if (error && error.cancelled) {
                el.find(".binf-btn.binf-dropdown-toggle").trigger('focus');
              }
            });
      } catch (error) {
        log.warn('Executing the command "{0}" failed.\n{1}',
            command.get('signature'), error.message) && console.warn(log.last);
      }
    },

    _ensureLazyActionsRetrieved: function () {
      var deferred                         = $.Deferred(),
          node                             = this.options.node,
          lazyActionsAreRetrieved          = !!node.get('csuiLazyActionsRetrieved'),
          addPropertiesActionsAreRetrieved = !!node.get('csuiAddPropertiesActionsRetrieved'),
          isNodeLocallyCreated             = !node.get('id'),
          nonPromotedCommands              = node.nonPromotedActionCommands;
      var actionsCommands,
          actionsAreRetrieved = lazyActionsAreRetrieved && addPropertiesActionsAreRetrieved;
      if (this.options.toolbarItems && nonPromotedCommands) {
        if (!lazyActionsAreRetrieved) {
          var additionalPropertiesCommands = commands.getSignatures(this.options.toolbarItems);
          if (additionalPropertiesCommands.length) {
            actionsCommands = nonPromotedCommands = node.nonPromotedActionCommands =
                _.union(additionalPropertiesCommands, node.nonPromotedActionCommands);
          }
        } else if (!addPropertiesActionsAreRetrieved) {
          actionsCommands = commands.getSignatures(this.options.toolbarItems);
        }
      }

      function fetchActionsCommands() {
        if (!lazyActionsAreRetrieved) {
          return node.setEnabledLazyActionCommands(true);
        } else if (!addPropertiesActionsAreRetrieved) {
          return node.getAdditionalActionCommands(
              actionsCommands, 'csuiAddPropertiesActionsRetrieved');
        } else {
          return $.Deferred().reject().promise();
        }
      }

      if (!!node && !isNodeLocallyCreated && !actionsAreRetrieved && actionsCommands &&
          actionsCommands.length) {
        var self = this;
        this.$el.find('.binf-dropdown').addClass('binf-hidden');
        this.$el.find('.csui-loading-parent-wrapper').removeClass('binf-hidden');
        fetchActionsCommands()
            .done(function () {
              setTimeout(function () {
                self.$el.find('.csui-loading-parent-wrapper').addClass('binf-hidden');
                self._updateMenuItems();
                deferred.resolve();
              }, 300);
            })
            .fail(function () {
              self.$el.find('.binf-dropdown').removeClass('binf-hidden');
              deferred.reject();
            });
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    }

  });

  return AddPropertiesDropdownMenuView;
});
