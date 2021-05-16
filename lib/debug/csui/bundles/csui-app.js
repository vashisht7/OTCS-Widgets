csui.define('csui/behaviors/dropdown.menu/dropdown.menu.behavior',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/base'
], function ($, _, Marionette, base) {
  'use strict';

  var DropdownMenuBehavior = Marionette.Behavior.extend({

    ui: {
      dropdownMenu: '.binf-dropdown',
    },

    events: {
      'show.binf.dropdown': 'onShowDropdownRefilterMenuItems',
      'keydown': 'onKeyInMenuView',
      'keyup': 'onKeyUpMenuView'
    },

    constructor: function DropdownMenuBehavior(options, view) {
      options = _.defaults(options, {refilterOnShow: true});
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      this.view.dropdownMenuBehavior = this;
      this.listenTo(this, 'refresh:dropdown', this.onDomRefresh);
    },

    onRender: function() {
      this.onDomRefresh();
    },

    onDomRefresh: function() {
      this.$dropdown = this.$el;
      if (this.options.dropdownSelector) {
        this.$dropdown = this.$el.find(this.options.dropdownSelector);
      }
      this.$dropdownToggle = this.$dropdown.find('.binf-dropdown-toggle');
    },

    onShowDropdownRefilterMenuItems: function () {
      this.options.refilterOnShow && this.view.options.collection.refilter && this.view.options.collection.refilter();
    },

    onKeyUpMenuView: function (event) {
      // Firefox: a known issue that Space key may not work correctly.
      // Our Bootstrap version is old. Link below discusses the problem and suggests moving to v4:
      //  https://github.com/twbs/bootstrap/issues/20303
      // Bootstrap v4 fix: https://github.com/twbs/bootstrap/issues/21159
      // Fix link: https://github.com/twbs/bootstrap/pull/21535
      // Code diff link: https://github.com/twbs/bootstrap/pull/21535/files
      // V4 dropdown code is too different to backport the fix.
      if (base.isFirefox()) {
        // We are still using the older Bootstrap code in our Binf.
        // Suppress extra event on Space keyup for Firefox (Chrome and IE11 don't fire extra event).
        if (event.keyCode === 32) {
          event.preventDefault();
          event.stopPropagation();
        }
      }

      // Modal dialog view is listening to 'keyup' event, close the menu but not Modal dialog
      if (event.keyCode === 27) {
        this._closeMenu(event);
      }
    },

    onKeyInMenuView: function (event) {
      // note: arrow up/down is handled by Bootstrap dropdown::keydown() with role=menu
      switch (event.keyCode) {
      case 9: // tab
        this._closeMenu();  // just close menu and don't pass in event so that focus can move on
        break;
      case 13:  // enter
      case 32:  // space
        event.preventDefault();
        event.stopPropagation();
        $(event.target).trigger('click');
        break;
      case 27:  // escape
        // menu is checked for open and will be closed in the 'keyup' event method above
        if (this.$dropdown.hasClass('binf-open') || this.ui.dropdownMenu.hasClass('binf-open')) {
          // if menu is open, stop the event so that parent views do not get this keydown event
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      }
    },

    _closeMenu: function (event) {
      if (this.$dropdown.hasClass('binf-open') || this.ui.dropdownMenu.hasClass('binf-open')) {
        // the event is handled here for closing the menu, prevent default and stop propagating the
        // event to parents
        event && event.preventDefault();
        event && event.stopPropagation();
        this.$dropdownToggle.binf_dropdown('toggle');
        this.$dropdownToggle.trigger('focus');
      }
    }

  });

  return DropdownMenuBehavior;

});

// Expands the limited view by showing the full one in a modal dialog
csui.define('csui/behaviors/expanding/expanding.behavior',['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette'
], function (require, _, Backbone, Marionette) {

  var ExpandingBehavior = Marionette.Behavior.extend({

    constructor: function ExpandingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      // The perspective begins to change with an animation before the
      // previous one is destroyed; the expanded view should be hidden
      // previous one is.
      var destroyWithAnimation = _.bind(this._destroyExpandedView, this, false),
          destroyImmediately   = _.bind(this._destroyExpandedView, this, true),
          context              = view.options && view.options.context;
      this.listenTo(this, 'before:destroy', destroyWithAnimation);
      if (context) {
        // The hiding animation finishes before the context is fetched
        // and the page is re-rendered.  If it becomes problem, use
        // destroyImmediately here.
        this.listenTo(context, 'request', destroyWithAnimation)
            .listenTo(context, 'request:perspective', destroyWithAnimation);
      }
    },

    onExpand: function () {
      // If the expanding event is triggered multiple times, it should be
      // handled just once by showing the expanded view; it is likely, that
      // the expanding button was clicked quickly twice
      if (this.expanded) {
        return;
      }
      // Do not use the later initialized this.dialog property; loading
      // the modules with the expanded view below may take some time.
      this.expanded = true;

      var self = this;
      // TODO: remove completeCollection and limiting behavior.  Both
      // client- and server-side browsable collections should provide
      // the same interface and use the according mixins.
      var collection = this.view.completeCollection ?
                       this.view.completeCollection.clone() :
                       this.view.collection.clone();

      // pass filter from the collapsed tile to the expanded table
      if (this.view.currentFilter !== undefined) {
        collection.setFilter(this.view.currentFilter, {fetch: false});
      }
      // close and clear the filter in the collapsed tile
      this.view.isSearchOpen() && this.view.searchClicked();

      var expandedViewValue = self.getOption('expandedView');
      var expandedViewClass = expandedViewValue;
      if (_.isString(expandedViewValue) !== true) {
        expandedViewClass = expandedViewValue.prototype instanceof Backbone.View ?
                            expandedViewValue :
                            expandedViewValue.call(self.view);
      }
      var requiredModules = ['csui/controls/dialog/dialog.view'];
      if (_.isString(expandedViewClass)) {
        requiredModules.push(expandedViewClass);
      }
      require(requiredModules, function (DialogView) {
        if (_.isString(expandedViewClass)) {
          expandedViewClass = arguments[1];
        }
        var expandedViewOptions = getOption(self.options, 'expandedViewOptions', self.view);
        self.expandedView = new expandedViewClass(_.extend({
          context: self.view.options.context,
          collection: collection,
          orderBy: getOption(self.options, 'orderBy', self.view),
          filterBy: self.view.currentFilter,
          limited: false,
          isExpandedView: true
        }, expandedViewOptions));
        self.dialog = new DialogView({
          iconLeft: getOption(self.options, 'titleBarIcon', self.view) ||
                    getOption(self.view.options, 'titleBarIcon', self.view),
          actionIconLeft: getOption(self.options, 'actionTitleBarIcon', self.view) ||
                             getOption(self.view.options, 'actionTitleBarIcon', self.view),
          imageLeftUrl: getOption(self.options, 'titleBarImageUrl', self.view),
          imageLeftClass: getOption(self.options, 'titleBarImageClass', self.view),
          title: getOption(self.options, 'dialogTitle', self.view),
          iconRight: getOption(self.options, 'dialogTitleIconRight', self.view),
          className: getClassName(self.options, 'dialogClassName', self.view),
          largeSize: true,
          view: self.expandedView,
          headerView: getOption(self.options, 'headerView', self.view)
        });
        self.listenTo(self.dialog, 'before:hide', self._expandOtherView)
            .listenTo(self.dialog, 'destroy', self._enableExpandingAgain);
        self._expandOtherView(false);
        self.dialog.show();
      }, function (error) {
        // If the module from the csui base cannot be loaded, something is so
        // rotten, that it does not make sense trying to load other module to
        // show the error message.
        // There will be more information on the browser console.
        self.expanded = false;
      });
    },

    _destroyExpandedView: function (immediately) {
      if (this.dialog) {
        var method = immediately ? 'kill' : 'destroy';
        this.dialog[method]();
        this.dialog = undefined;
      }
    },

    _expandOtherView: function (expand) {
      this.options.collapsedView && this.options.collapsedView.triggerMethod(
          expand === false ? 'go:away' : 'go:back');
    },

    _enableExpandingAgain: function () {
      this.expanded = false;
      if (this.view.tabableRegionBehavior) {
        var navigationBehavior = this.view.tabableRegionBehavior,
            targetElement      = this.view.ui.tileExpand;
        navigationBehavior.currentlyFocusedElement &&
        navigationBehavior.currentlyFocusedElement.prop('tabindex', -1);
        targetElement && targetElement.prop('tabindex', 0);
        targetElement.trigger('focus');
        navigationBehavior.setInitialTabIndex();
        this.view.currentTabPosition = 2;
      }
    }

  });

  // TODO: Expose this functionality and make it generic for functiona objects too.
  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  function getClassName(options, property, context) {
    var className = getOption(options, property, context);
    if (className) {
      className += ' csui-expanded';
    } else {
      className = 'csui-expanded';
    }
    return className;
  }

  return ExpandingBehavior;

});

csui.define('csui/behaviors/item.error/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/behaviors/item.error/impl/nls/root/lang',{
  itemCannotBeAccessed : 'Item cannot be accessed.'
});


csui.define('csui/behaviors/item.error/item.error.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/error/error.view',
  'i18n!csui/behaviors/item.error/impl/nls/lang',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, ErrorView, lang) {
  'use strict';

  var ItemErrorBehavior = Marionette.Behavior.extend({

    constructor: function ItemErrorBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;

      // Behaviors are created before the model is stored in the view
      var model = getBehaviorOption.call(this, 'model') ||
                  view.model || view.options.model;
      this._setupErrorHandling(model);

      var errorView = this.getOption('errorView');
      if (_.isFunction(errorView) &&
          !(errorView.prototype instanceof Backbone.View)) {
        errorView = errorView.call(view);
      }
      errorView || (errorView = ErrorView);

      // Disable the view's template and content, if fetching the model
      // failed and the error should not be placed in part of the view
      var getTemplate = view.getTemplate,
          self        = this;
      view.getTemplate = function () {
        if (this.model && this.model.error) {
          // A string selector would point to a part of the view's content
          // rendered using the view's template
          var el = getBehaviorOption.call(self, 'el');
          if (typeof el !== 'string') {
            if (!getBehaviorOption.call(self, 'region')) {
              return false;
            }
          }
        }
        return getTemplate.apply(view, arguments);
      };

      var errorRegion;
      this.listenTo(view, 'render', function () {
        // Render an inner error control, if fetching the data failed
        var error = this.model && this.model.error;
        if (error) {
          if (errorRegion) {
            errorRegion.empty();
          }
          errorRegion = getBehaviorOption.call(this, 'region');
          if (!errorRegion) {
            var el = getBehaviorOption.call(this, 'el') || view.el;
            if (typeof el === 'string') {
              el = view.$(el);
            }
            errorRegion = new Marionette.Region({el: el});
          }
          errorRegion.show(new errorView(
              _.extend({
                model: new Backbone.Model({
                  message: lang.itemCannotBeAccessed,
                  title: error.message
                })
              }, getBehaviorOption.call(this, 'errorViewOptions'))
          ));
        }
      })
          .listenTo(view, 'before:destroy', function () {
            // Destroy the inner error control
            if (errorRegion) {
              errorRegion.empty();
            }
          })
          .listenTo(view, 'update:model', this._setupErrorHandling);
    },

    _setupErrorHandling: function (model) {
      this.model && this.stopListening(this.model);
      this.model = model;
      this.listenTo(this.model, 'error', function () {
        // Re-render the view, if fetching the data failed
        this.view.render();
      });
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return ItemErrorBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/behaviors/item.state/impl/item.state',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\r\n";
}});
Handlebars.registerPartial('csui_behaviors_item.state_impl_item.state', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/behaviors/item.state/item.state.view',[
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/behaviors/item.state/impl/item.state'
], function (_, Marionette, template) {
  'use strict';

  var ItemStateView = Marionette.ItemView.extend({

    className: 'csui-item-state',

    template: template,

    constructor: function ItemStateView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change:state', this.render)
          .listenTo(this, 'render', this._updateClasses);
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), {
        // empty, loading, failed
        message: this.options.stateMessages[this.model.get('state')]
      });
    },

    _updateClasses: function () {
      this.$el
          .removeClass('csui-state-loading csui-state-failed')
          .addClass('csui-state-' + this.model.get('state'));
    }

  });

  return ItemStateView;
});

csui.define('csui/behaviors/item.state/item.state.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/item.state/item.state.view'
], function (_, Backbone, Marionette, ItemStateView) {
  'use strict';

  var ItemStateBehavior = Marionette.Behavior.extend({

    constructor: function ItemStateBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;

      // Behaviors are created before the model is stored in the view
      var model = getBehaviorOption.call(this, 'model') ||
                  view.model || view.options.model;
      this.listenTo(model, 'request', this._fetchingCollectionStarted)
          .listenTo(model, 'sync', this._fetchingCollectionSucceeded)
          .listenTo(model, 'error', this._fetchingCollectionFailed);

      this.itemState = new Backbone.Model({
        state: model.fetching ? 'loading' :
               model.error ? 'failed' : 'loaded'
      });

      var stateView = this.getOption('stateView');
      if (_.isFunction(stateView) &&
          !(stateView.prototype instanceof Backbone.View)) {
        stateView = stateView.call(view);
      }
      this.stateView = stateView || ItemStateView;

      // Disable the view's template and content, if fetching the model
      // failed and the error should not be placed in part of the view
      var getTemplate = view.getTemplate,
          self = this;
      view.getTemplate = function () {
        if (!model.fetched) {
          // A string selector would point to a part of the view's content
          // rendered using the view's template
          var el = getBehaviorOption.call(self, 'el');
          if (typeof el !== 'string') {
            if (!getBehaviorOption.call(self, 'region')) {
              return false;
            }
          }
        }
        return getTemplate.apply(view, arguments);
      };

      var stateRegion;
      this.listenTo(view, 'render', function () {
            if (!model.fetched) {
              if (stateRegion) {
                stateRegion.empty();
              }
              stateRegion = getBehaviorOption.call(this, 'region');
              if (!stateRegion) {
                var el = getBehaviorOption.call(this, 'el') || view.el;
                if (typeof el === 'string') {
                  el = view.$(el);
                }
                stateRegion = new Marionette.Region({el: el});
              }
              stateRegion.show(new this.stateView(
                  _.extend({
                    model: this.itemState,
                    stateMessages: getBehaviorOption.call(this, 'stateMessages') || {}
                  }, getBehaviorOption.call(this, 'stateViewOptions'))
              ));
            }
          })
          .listenTo(view, 'before:destroy', function () {
            // Destroy the inner error control
            if (stateRegion) {
              stateRegion.empty();
            }
          });
    },

    _fetchingCollectionStarted: function () {
      this.itemState.set('state', 'loading');
      this.view.render();
      this.view.blockWithoutIndicator && this.view.blockWithoutIndicator();
    },

    _fetchingCollectionSucceeded: function (model) {
      this.itemState.set('state', 'loaded');
      this.view.unblockActions && this.view.unblockActions();
    },

    _fetchingCollectionFailed: function () {
      this.itemState.set('state', 'failed');
      this.view.unblockActions && this.view.unblockActions();
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return ItemStateBehavior;
});

// Limits the rendered collection length with a More link to expand it
csui.define('csui/behaviors/limiting/limiting.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette'
], function (_, Backbone, Marionette) {
  "use strict";

  var LimitingBehavior = Marionette.Behavior.extend({
    defaults: {
      limit: 6,
      filterByProperty: 'name'
    },

    collectionEvents: {'reset': 'enableMoreLink'},

    events: {
      'click .cs-more': 'onMoreLinkClick',
      'click .tile-expand': 'onMoreLinkClick',
    },

    ui: {moreLink: '.cs-more'},

    constructor: function LimitingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
    },

    // Initialize is called after the constructor of the parent view, which
    // assigns the collection and which we need here.  The collection
    // assignment cannot be delayed till the before:render is triggered.
    initialize: function (options, view) {
      if (view.options.limited !== false) {
        var completeCollection = view.collection,
            completeCollectionOptions;
        if (!completeCollection) {
          completeCollection = this.getOption('completeCollection');
          if (!(completeCollection instanceof Backbone.Collection)) {
            completeCollectionOptions = this.getOption('completeCollectionOptions');
            if (completeCollection.prototype instanceof Backbone.Collection) {
              completeCollection = new completeCollection(undefined, completeCollectionOptions);
            } else {
              completeCollection = completeCollection.call(view);
              if (!(completeCollection instanceof Backbone.Collection)) {
                completeCollection = new completeCollection(undefined, completeCollectionOptions);
              }
            }
          }
        }
        if (view.options.orderBy) {
          completeCollection.setOrder(view.options.orderBy, false);
        }

        this.listenTo(completeCollection, 'add', this._addItem)
            .listenTo(completeCollection, 'remove', this._removeItem)
            .listenTo(completeCollection, 'reset', this.enableMoreLink)
            .listenTo(completeCollection, 'sync', function (object) {
              if (object instanceof Backbone.Collection) {
                this.synchronizeCollections();
              }
            });
        view.completeCollection = completeCollection;
        var ViewCollection = Backbone.Collection.extend(
            completeCollection ? {model: completeCollection.model} : {}
        );
        view.collection = new ViewCollection();
        this.synchronizeCollections();
        this.listenTo(view, 'change:filterValue', this.synchronizeCollections);
      }
    },

    synchronizeCollections: function () {
      var models;
      // search has value
      if (this.view.options.filterValue && this.view.options.filterValue.length > 0) {
        var keywords = this.view.options.filterValue.toLowerCase().split(' ');
        var filterByProperty = getOption(this.options, 'filterByProperty', this.view);

        this.view.currentFilter = {};
        this.view.currentFilter[filterByProperty] = this.view.options.filterValue.toLowerCase();

        models = this.view.completeCollection.filter(function (item) {
          var name = item.get(filterByProperty),
              isMatch;
          if (name) {
            // FIXME: Apply collation rules
            name = name.trim().toLowerCase();
            isMatch = _.reduce(keywords, function (result, keyword) {
              return result && name.indexOf(keyword) >= 0;
            }, true);
          }
          return isMatch;
        });
      } else {
        // no filtering
        this.view.currentFilter = undefined;
        models = this.view.completeCollection.models;
      }
      this.view.collection.reset(models);
    },

    enableMoreLink: function () {
      var limit  = getOption(this.options, 'limit', this.view),
          enable = this.view.completeCollection &&
                   this.view.completeCollection.length > limit;
      this.ui.moreLink[enable ? 'removeClass' : 'addClass']('binf-hidden');
    },

    onMoreLinkClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      // TODO this is actually required to make the expanding behaviour work!?
      this.view.triggerMethod('expand');
    },

    _addItem: function (model) {
      var index = this.view.completeCollection.indexOf(model);
      this.view.collection.add(model, { at: index });
    },

    _removeItem: function (model) {
      this.view.collection.remove(model);
    }
  });

  // TODO: Expose this functionality and make it generic for functional objects too.
  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  return LimitingBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tile/behaviors/impl/expanding.behavior',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"cs-more tile-expand\">\r\n  <div class=\"icon circular icon-tileExpand\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.expandIconTitle || (depth0 != null ? depth0.expandIconTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandIconTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.expandIconAria || (depth0 != null ? depth0.expandIconAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandIconAria","hash":{}}) : helper)))
    + "\" role=\"button\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_tile_behaviors_impl_expanding.behavior', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tile/behaviors/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/tile/behaviors/impl/nls/root/lang',{
  expandIconTooltip: 'Expand',
  expandIconAria: 'Expand {0} widget'

});


csui.define('csui/controls/tile/behaviors/expanding.behavior',['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!csui/controls/tile/behaviors/impl/expanding.behavior',
  'i18n!csui/controls/tile/behaviors/impl/nls/lang'
], function (require, _, Backbone, Marionette, template, lang) {
  "use strict";

  var ExpandingBehavior = Marionette.Behavior.extend({

    defaults: {
      expandButton: '.tile-footer'
    },

    triggers: {
      'click .cs-more': 'expand',
      'click .tile-header': 'expand'
    },

    constructor: function ExpandingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._renderExpandButton);
      this.listenTo(view, 'expand', this._expand);
      // The perspective begins to change with an animation before the
      // previous one is destroyed; the expanded view should be hidden
      // previous one is.
      var destroyWithAnimation = _.bind(this._destroyExpandedView, this, false),
          destroyImmediately   = _.bind(this._destroyExpandedView, this, true),
          context              = view.options && view.options.context;
      this.listenTo(this, 'before:destroy', destroyWithAnimation);
      if (context) {
        // The hiding animation finishes before the context is fetched
        // and the page is re-rendered.  If it becomes problem, use
        // destroyImmediately here.
        this.listenTo(context, 'request', destroyWithAnimation)
            .listenTo(context, 'request:perspective', destroyWithAnimation);
      }
    },

    _renderExpandButton: function () {
      var expandButtonSelector = getOption.call(this, 'expandButton'),
          expandButton         = this.view.$(expandButtonSelector),
          iconTitle = getOption.call(this, 'expandIconTitle'),
          expandIconTitle = iconTitle ? iconTitle : lang.expandIconTooltip,
          dialogTitle = getOption.call(this, 'dialogTitle'),
          iconAria = getOption.call(this, 'expandIconAria'),
          expandIconAria = iconAria ? iconAria : _.str.sformat(lang.expandIconAria, dialogTitle),
          data                 = { expandIconTitle: expandIconTitle,
                                   expandIconAria: expandIconAria};
      expandButton.html(template(data));
    },

    _expand: function () {
      if (this.expanded) {
        return;
      }
      this.expanded = true;
      var expandedViewValue = this.getOption('expandedView'),
          expandedViewClass = expandedViewValue.prototype instanceof Backbone.View ?
                              expandedViewValue : expandedViewValue.call(this.view),
          requiredModules   = ['csui/controls/dialog/dialog.view'],
          self              = this;
      if (_.isString(expandedViewClass)) {
        requiredModules.push(expandedViewClass);
      }
      require(requiredModules, function (DialogView) {
        if (_.isString(expandedViewClass)) {
          expandedViewClass = arguments[1];
        }
        var expandedViewOptions = getOption.call(self, 'expandedViewOptions'),
            expandedView        = new expandedViewClass(expandedViewOptions);
        self._dialog = new DialogView({
          iconLeft: getOption.call(self, 'titleBarIcon'),
          imageLeftUrl: getOption.call(self, 'titleBarImageUrl'),
          imageLeftClass: getOption.call(self, 'titleBarImageClass'),
          title: getOption.call(self, 'dialogTitle'),
          iconRight: getOption.call(self, 'dialogTitleIconRight'),
          className: 'cs-expanded ' + (getOption.call(self, 'dialogClassName') || ''),
          largeSize: true,
          view: expandedView
        });
        self.listenTo(self._dialog, 'hide', function () {
          self.triggerMethod('collapse');
        }).listenTo(self._dialog, 'destroy', self._enableExpandingAgain);
        self._dialog.show();
      });
    },

    _enableExpandingAgain: function () {
      this.expanded = false;
    },

    _destroyExpandedView: function () {
      if (this._dialog) {
        this._dialog.destroy();
        this._dialog = undefined;
      }
    }

  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ExpandingBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tile/impl/tile',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"tile-type-icon\">\r\n      <span class=\"icon title-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></span>\r\n    </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageUrl : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"tile-type-image "
    + this.escapeExpression(((helper = (helper = helpers.imageClass || (depth0 != null ? depth0.imageClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageClass","hash":{}}) : helper)))
    + "\">\r\n        <span class=\"tile-type-icon tile-type-icon-img\"><img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imageUrl || (depth0 != null ? depth0.imageUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageUrl","hash":{}}) : helper)))
    + "\" alt=\"\" aria-hidden=\"true\"></span>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"tile-header\">\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n  <div class=\"tile-title\" >\r\n    <h2 class=\"csui-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n\r\n  <div class=\"tile-controls\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>\r\n\r\n</div>\r\n\r\n<div class=\"tile-content\"></div>\r\n\r\n<div class=\"tile-footer\"></div>\r\n";
}});
Handlebars.registerPartial('csui_controls_tile_impl_tile', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/tile/impl/tile',[],function(){});
csui.define('csui/controls/tile/tile.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/controls/tile/impl/tile',
  /* FIXME: Merge this with the list control */
  'css!csui/controls/list/impl/list',
  'css!csui/controls/tile/impl/tile'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin, template) {

  var TileView = Marionette.LayoutView.extend({

    className: 'cs-tile cs-list tile content-tile',

    template: template,

    regions: {
      headerControls: '.tile-controls',
      content: '.tile-content',
      footer: '.tile-footer'
    },

    constructor: function TileView() {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'render', this._renderContentView);
    },

    serializeData: function () {
      return _.reduce(['icon', 'imageUrl', 'imageClass', 'title'],
          function (result, property) {
            result[property] = getOption.call(this, property);
            return result;
          }, {}, this);
    },

    _renderContentView: function () {
      var ContentView = getOption.call(this, 'contentView');
      if (!ContentView) {
        throw new Marionette.Error({
          name: 'NoContentViewError',
          message: 'A "contentView" must be specified'
        });
      }
      var contentViewOptions = getOption.call(this, 'contentViewOptions');
      this.contentView = new ContentView(contentViewOptions);
      this.propagateEventsToViews(this.contentView);
      this.content.show(this.contentView);
    }

  });

  _.extend(TileView.prototype, ViewEventsPropagationMixin);

  // TODO: Expose this functionality and make it generic for other views too
  function getOption(property, source) {
    var value;
    if (source) {
      value = source[property];
    } else {
      value = getOption.call(this, property, this.options || {});
      if (value === undefined) {
        value = this[property];
      }
    }
    return _.isFunction(value) && !(value.prototype instanceof Backbone.View) ?
           value.call(this) : value;
  }

  return TileView;

});

csui.define('csui/controls/iconpreload/icon.preload.view',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/non-emptying.region/non-emptying.region', 'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, NonEmptyingRegion) {
  'use strict';

  var iconClasses = module.config().iconClasses || {};
  iconClasses = Array.prototype.concat.apply([], _.values(iconClasses));

  var IconPreloadView = Marionette.ItemView.extend({
    id: 'csui-icon-preload',
    template: false,

    onRender: function () {
      this._preloadIcons();
    },

    constructor: function IconPreloadView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    _preloadIcons: function () {
      _.each(iconClasses, function (icon) {
        this.$el.append('<span class="csui-icon ' + icon +
                        '" style="position:fixed;top:-100px;left:-100px;"></span>');
      }, this);
    }
  });

  IconPreloadView.ensureOnThePage = function () {
    //if (base.isIE11()) {
      if (!$("#csui-icon-preload").length) {
        var iconPreloadView = new IconPreloadView(),
            binfContainer   = $.fn.binf_modal.getDefaultContainer(),
            region          = new NonEmptyingRegion({el: binfContainer});
        region.show(iconPreloadView);
      }
    //}
  };

  return IconPreloadView;
});
csui.define('csui/widgets/html.editor/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/html.editor/impl/nls/root/lang',{
  ConfirmQuestionMessage: 'Are you sure to leave this page?',
  ConfirmQuestionTitle: 'Cancel edits?',
  CancelConfirmMessage: 'Are you sure you want to cancel?',
  cancelTitle: "Cancel",
  cancelAria: "Cancel edit",
  saveTitle: "Save",
  saveAria: "Save contents",
  moreActionsAria: "{0} actions menu",
  PageDefaultContent: 'your content goes here',
  noWikiPageFound: 'This content no longer exists',
  RestoreDialogMessage: "You have unsaved changes. Do you want to restore changes and continue" +
                        " editing?",
  RestoreDiaglogTitle: "Restore changes",
  reservedBy: 'Reserved by {0}\n{1}',
  more: 'more',
  properties: 'Properties',
  permissions: 'View permissions',
  Edit: 'Edit',
  unreserve: 'Unreserve',
  Continue: 'Continue',
  Discard: 'Discard',
  insertContentServerLink: 'Insert Content Server Link',
  contentServerLink: 'Content Server Link',
  versionDifferenceConfirmMessage: 'Another user has saved an alternate version of this' +
                                   ' page. Do you still want to add a new version?',
  versionDifferenceConfirmTitle: 'Intermediate version added',
  brokenLinkMessage: "Sorry, the item you requested could not be accessed. Either it does not" +
                     " exist, or you do not have permission to access it. If you were sent a" +
                     " link to this item, please contact the sender for assistance.",
  goToTooltip: "go to {0}",
  previewUnavailable: "Preview Unavailable",
  cannotFindObject: "Cannot find object"
});

csui.define('csui/controls/rich.text.editor/impl/rich.text.util',["csui/lib/underscore", "csui/lib/jquery", "csui/utils/url", 'csui/models/node/node.model',
  'csui/utils/base', 'csui/utils/commands', 'i18n!csui/widgets/html.editor/impl/nls/lang',
  'csui/utils/log'
], function (_, $, Url, NodeModel, base, commands, lang, log) {

  var RichTextEditorUtils = {
    isEmptyContentElement: function (el) {
      return $.trim($(el).text());
    },

    checkDomain: function (view, event) {

      var domainUrl = view.connector.connection.url,
          link      = event.target.href;
      //checks the similarity of links after the domain name.
      view.options.isSameDomain = link.search(new RegExp(domainUrl.split('/api')[0], 'i')) !== -1;
      return view.options.isSameDomain;
    },

    getUrl: function (view, event) {
      var deferred = $.Deferred();
      if (!!event.target.href) {
        var smartLink    = event.target.href.match(/^.*\/app\/(.+)$/i),
            absolute     = new Url(event.target.href).isAbsolute(),
            isSameDomain = absolute ? this.checkDomain(view, event) : true,
            wikiUrl      = event.target.href.match(/^.*\/wiki\/(.+)$/i),
            nodeUrl      = event.target.href.match(/^.*\/open\/(.+)$/i) ||
                           event.target.href.match(/^.*\/nodes\/(.+)$/i),
            objid        = event.target.href.match(/^.*objId\=(.+)$/i), id,
            self         = this;
        if (!smartLink && isSameDomain) { // classic urls of same domain
          if (wikiUrl || objid) { //  urls containing "wiki" or "objId" words
            self.renderLinks({
              event: event,
              connector: view.connector,
              callingViewInstance: view
            }).done(function () {
              deferred.resolve();
            });
          } else if (nodeUrl) { // classic url containing open or nodes of samedomain
            id = nodeUrl[1];
            this.updateLink(event, id);
            deferred.resolve();
          }
          else { // classic url of samedomain that doesnt contain  wiki or nodes or objid or not proper
            deferred.resolve();
          }
        } else {  // smart url or (or) and different domain url
          deferred.resolve();
        }

      }
      return deferred.promise();
    },

    renderLinks: function (args) {
      var node, deferred = $.Deferred();
      var target = !!args.event.target.href ? $(args.event.target) :
                   $(args.event.target).parents('a'),
          that   = args.callingViewInstance,
          self   = this;
      args.event.target = target[0];
      if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+\/(.+)$/i) ||
          !!args.event.target.href.match(/^.*\/wiki\/[0-9]+$/i)) {
        args.event.stopPropagation();
        args.event.preventDefault();
        if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+\/(.+)$/i)) {
          node = args.event.target.href.match(/^.*\/wiki\/(.+)\/(.+)$/i);
          node = parseInt(node[1]);
          self._getWikiPageId(args, node, args.event.target.href).done(function (res, node) {
            self.id = res;
            if (!!node) {
              self.updateLink(args.event, node.id);
            } else {
              log.info(lang.brokenLinkMessage);
            }
            deferred.resolve();
          });
        } else if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+$/i)) {
          node = args.event.target.href.match(/^.*\/wiki\/(.+)$/i);
          node = parseInt(node[1]);
          self.updateLink(args.event, node);
          deferred.resolve();
        }

      }
      else if (!!args.event.target.href.match(/^.*objId\=(.+)$/)) {
        args.event.stopPropagation();
        args.event.preventDefault();
        var objIdIndex = args.event.target.href.match(/^.*objId\=(.+)$/)[1];
        if (objIdIndex !== -1) {
          node = this.getNewNodeModel({
            attributes: {
              id: parseInt(objIdIndex)
            },
            connector: args.connector
          });
          self.updateLink(args.event, node.attributes.id);
        }
        deferred.resolve();
      }
      return deferred.promise();
    },

    getNewNodeModel: function (options) {
      return new NodeModel(options.attributes, {
        connector: options.connector,
        commands: commands.getAllSignatures(),
        fields: options.fields || {},
        expand: options.expand || {}
      });
    },

    updateLink: function (el, nodeId) {
      var cslinkPattern = /^.*\/(cs\.\w{3}|livelink\.\w{3}|llisapi\.\w{3}|llisapi|cs|livelink).*$/,
          id            = !!nodeId && nodeId,
          cslink        = el.target.href.match(cslinkPattern),
          newHref       = !!cslink && cslink.length && el.target.href.substring(0,
              el.target.href.indexOf("/".concat(cslink[1])) + "/".concat(cslink[1]).length);
      el.target.href = !!newHref && newHref.length ?
                       newHref.concat("/app/nodes/", id) : el.target.href;
    },

    _getWikiPageId: function (self, wikiId, targetHref) {
      var $wikiPageName  = decodeURIComponent(targetHref.substring(
          targetHref.lastIndexOf("/") + 1, targetHref.length)),
          dfd            = $.Deferred(),
          connector      = self.connector,
          collectOptions = {
            url: this._getWikiContainerUrl(self, wikiId),
            type: 'GET'
          };

      connector.makeAjaxCall(collectOptions).done(function (resp) {
        resp.targetWikiPageNode = resp.results.find(function (element) {
          if (element.name === $wikiPageName) {
            return element;
          }
        });
        if (!!resp.targetWikiPageNode && !!resp.targetWikiPageNode.id) {
          dfd.resolve(resp.targetWikiPageNode.id, resp.targetWikiPageNode);
        } else {
          dfd.resolve(-1);
        }
      }).fail(function (resp) {
        dfd.reject(resp);
      });
      return dfd.promise();
    },

    _getWikiContainerUrl: function (self, wikiContainerId) {
      return Url.combine(self.connector.getConnectionUrl().getApiBase('v2') , '/wiki/' + wikiContainerId +
             "/wikipages");
    },

    _getNicknameId: function (self, nickName) {
      var deferred       = $.Deferred(),
          collectOptions = {
            url: Url.combine(self.connector.getConnectionUrl().getApiBase('v2') ,
                 "/wiki/nickname/" + nickName + "?actions=open"),
            requestType: "nickname",
            view: this,
            type: "GET"
          };
      nickName && self.connector.makeAjaxCall(collectOptions).done(function (response) {
        deferred.resolve(response);
      }).fail(function(){
        deferred.reject();
      });
      return deferred.promise();
    }
  };
  return RichTextEditorUtils;

});


csui.define('css!csui/widgets/html.editor/impl/html.editor',[],function(){});

csui.define('css!csui/lib/ckeditor/plugins/cssyntaxhighlight/styles/shCoreDefault',[],function(){});
csui.define('csui/controls/rich.text.editor/rich.text.editor',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/ckeditor/ckeditor',
      'csui/controls/rich.text.editor/impl/rich.text.util',
      'css!csui/widgets/html.editor/impl/html.editor',
      'css!csui/lib/ckeditor/plugins/cssyntaxhighlight/styles/shCoreDefault'
    ],
    function ($, _, Backbone, ckeditor, RichTextEditorUtils) {
      'use strict';

      var getCSSName = function (part) {
        // code from ckeditor to get the stylesheet name based on the browser type.
        var uas = window.CKEDITOR.skin['ua_' + part],
            env = window.CKEDITOR.env;
        if (uas) {
          uas = uas.split(',').sort(function (a, b) {
            return a > b ? -1 : 1;
          });
          for (var i = 0, ua; i < uas.length; i++) {
            ua = uas[i];

            if (env.ie) {
              if ((ua.replace(/^ie/, '') == env.version) || (env.quirks && ua == 'iequirks')) {
                ua = 'ie';
              }
            }

            if (env[ua]) {
              part += '_' + uas[i];
              break;
            }
          }
        }
        return part + '.css';
      };

      var getRichTextEditor = function (config) {
        config = config || {};
        _.each(ckeditor.instances, function (ckInstance) {
          ckInstance.destroy();
        });

        var csuiDefaults = {
          custcsuiimage_imageExtensions: 'gif|jpeg|jpg|png',
          skin: 'otskin',
          format_tags: 'p;h1;h2;h3;h4;h5',
          allowedContent: true,
          disableAutoInline: true,
          autoHideToolbar: false,
          title: false,
          cs_syntaxhighlight_hideGutter: true,
          enterMode: ckeditor.ENTER_P,
          extraPlugins: 'filebrowser,find,panelbutton,colorbutton,font,selectall,smiley,dialog,' +
                        'sourcedialog,print,preview,justify,otsave,cancel,cssyntaxhighlight,cslink',
          toolbar: [
            ['Undo', 'Redo', '-', 'Font', 'FontSize', '-', 'Styles', 'Format', 'TextColor'],
            '/',
            ['Bold', 'Italic', 'Blockquote', '-', 'Replace', '-', 'NumberedList',
              'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
              'JustifyRight', '-', 'Link', 'cslink', '-', 'Image', 'Table', 'Sourcedialog']
          ]
        };

        if (config.externalPlugins) {
          if (!_.isArray(config.externalPlugins)) {
            throw TypeError('externalPlugins must be array type');
          } else {
            if (config.externalPluginsBasePath &&
                typeof config.externalPluginsBasePath === 'string') {
              if (config.externalPluginsBasePath.charAt(
                      config.externalPluginsBasePath.length - 1) !== '/') {
                config.externalPluginsBasePath += '/';
              }
              var extraPlugins = [];
              config.externalPlugins.map(function (pluginName) {
                ckeditor.plugins.addExternal(pluginName,
                    config.externalPluginsBasePath + pluginName + '/', 'plugin.js');
                extraPlugins.push(pluginName);
              });
              // delete to avoid conflicts if any
              delete config.externalPlugins;
              delete config.externalPluginsBasePath;
              extraPlugins = extraPlugins.join();
              if (!!config.extraPlugins) {
                if (config.extraPlugins.length) {
                  extraPlugins = config.externalPlugins + ',' + extraPlugins;
                }
                config.extraPlugins = extraPlugins;
              } else {
                csuiDefaults.extraPlugins += ',' + extraPlugins;
              }
            } else {
              throw Error('externalPluginsBasePath option missing or is not a string');
            }
          }
        }

        config = _.defaults(config, csuiDefaults, ckeditor.config);
        ckeditor.config = config;
        ckeditor.on("dialogDefinition", function (event) {
          var dialogName = event.data.name,
              dialogDefinition = event.data.definition;

          // add one unique classname for all ckeditor dialogs.
          event.data.definition.dialog.getElement().addClass('csui-ckeditor-control-dialog');
          event.data.definition.dialog.getElement().addClass('csui-ckeditor-dialog-' + dialogName);

          if (dialogName == 'link') {
            //if upload dialog has to be enabled pass the value true to config.linkShowUploadTab
            if (!config.linkShowUploadTab) {
              var uploadTab = dialogDefinition.getContents('upload');
              uploadTab.hidden = true;
            }
          }
        });
        // FIX ME: find best way to remove stylesheets from head and script
        // remove existing stylesheet, for now don't remove script src.
        // @ESOC-Kaveri: 
        //     - for march update, let's go with this workaround, created jira LPAD- to address it properly for june update.
        //     - once other module's specs finalized, then look and feel will be same
        var skin   = config.skin.split(','),	//skin[0] = skin name, skin[1] = skin path
            dialog = getCSSName('dialog'),
            editor = getCSSName('editor');
        $('head link[href*="ckeditor/skins/' + skin[0] + '/' + editor +
          '"], head link[href*="ckeditor/skins/' + skin[0] + '/' + dialog + '"]').remove();
        // for now it is mandatory to provide the path of skin name to remove conflicts of css
        window.CKEDITOR.document.appendStyleSheet(skin[1] + editor);
        window.CKEDITOR.document.appendStyleSheet(skin[1] + dialog);
        return ckeditor;
      };

      var getRichTextEditorUtils = function getRichTextEditorUtils() {
        return RichTextEditorUtils;
      };

      var isEmptyContent = function (content) {
        // as there are only three entermode in ckeditor DIV, P, BR. checking for them, along with the any empty spaces.
        return !!content &&
               content.getData().replace(/<\/div>|<div>|<\/p>|<p>|&nbsp;|<br \/>|\s/g, '');
      };

      return {
        getRichTextEditor: getRichTextEditor,
        getRichTextEditorUtils: getRichTextEditorUtils,
        isEmptyContent: isEmptyContent
      };
    });

/* START_TEMPLATE */
csui.define('hbs!csui/controls/selected.count/impl/selected.count',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-selected-counter-region\">\r\n  <button type=\"button\" class=\"binf-btn binf-btn-primary\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.selectedLabel || (depth0 != null ? depth0.selectedLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectedLabel","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.selectedCount || (depth0 != null ? depth0.selectedCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectedCount","hash":{}}) : helper)))
    + "\"\r\n          title=\""
    + this.escapeExpression(((helper = (helper = helpers.selectedLabel || (depth0 != null ? depth0.selectedLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectedLabel","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.selectedCount || (depth0 != null ? depth0.selectedCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectedCount","hash":{}}) : helper)))
    + "\"><span\r\n      class=\"csui-selected-counter-label\">"
    + this.escapeExpression(((helper = (helper = helpers.selectedLabel || (depth0 != null ? depth0.selectedLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectedLabel","hash":{}}) : helper)))
    + "</span><span\r\n      class=\"binf-badge binf-badge-light csui-selected-counter-value\">"
    + this.escapeExpression(((helper = (helper = helpers.selectedCount || (depth0 != null ? depth0.selectedCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectedCount","hash":{}}) : helper)))
    + "</span>\r\n  </button>\r\n</div>\r\n<div class=\"csui-dropmenu-container\">\r\n  <span class=\"csui-selected-count-clearall binf-hidden\"><span\r\n      class=\"csui-selected-count-clearall-label\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.clearall || (depth0 != null ? depth0.clearall : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearall","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.clearall || (depth0 != null ? depth0.clearall : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearall","hash":{}}) : helper)))
    + "\"\r\n      role=\"button\" tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.clearall || (depth0 != null ? depth0.clearall : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearall","hash":{}}) : helper)))
    + "</span></span>\r\n\r\n  <ul class=\"csui-selected-items-dropdown\" role=\"menu\"></ul>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_selected.count_impl_selected.count', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/selected.count/impl/selected.list.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-selected-list-item-icon  csui-type-icon\" />\r\n<div class=\"csui-selected-list-item-name-wrapper\">\r\n    <span class=\"csui-selected-list-item-name\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"\r\n          title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"csui-icon formfield_clear csui-deselcted-icon\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.clearItem || (depth0 != null ? depth0.clearItem : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearItem","hash":{}}) : helper)))
    + "\"\r\n  title=\""
    + this.escapeExpression(((helper = (helper = helpers.clearItem || (depth0 != null ? depth0.clearItem : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearItem","hash":{}}) : helper)))
    + "\" />\r\n  </span>\r\n</div>";
}});
Handlebars.registerPartial('csui_controls_selected.count_impl_selected.list.item', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/selected.count/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/selected.count/impl/nls/root/lang',{
  clearall: "Clear all",
  selectedLabel: "Selected",
  selectedTitle: "Selected {0}",
  clearItem: "Clear item",
  dialogTitle: "Clear all",
  dialogTemplate: "Do you want to clear your selection?",
  parentName: "/{0}"
});



csui.define('css!csui/controls/selected.count/impl/selected.count',[],function(){});
csui.define('csui/controls/selected.count/selected.count.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/dialogs/modal.alert/modal.alert',
  "csui/utils/base",
  'hbs!csui/controls/selected.count/impl/selected.count',
  'hbs!csui/controls/selected.count/impl/selected.list.item',
  'i18n!csui/controls/selected.count/impl/nls/lang',
  'css!csui/controls/selected.count/impl/selected.count'
], function (_, $, Backbone, Marionette, NodeTypeIconView,
    PerfectScrollingBehavior, TabableRegionBehavior, ModalAlert,
    base, selectedCountTemplate, selectedListItemTemplate, lang) {
  'use strict';

  var SelectedNodeItemView = Marionette.ItemView.extend({
    className: 'csui-selected-item',
    template: selectedListItemTemplate,
    tagName: 'li',
    events: {
      'keydown': 'onKeyInView'
    },

    modelEvents: {
      'change': 'onModelChange'
    },

    triggers: {
      'click .csui-deselcted-icon': 'remove:selected:item'
    },

    templateHelpers: function () {
      return {
        name: this.options.model.get('name'),
        clearItem: lang.clearItem
      };
    },

    constructor: function SelectedNodeItemView(options) {
      this.model = options.model;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();
      this.$el.attr('tabindex', "-1");
      this.$el.attr('role', 'menuitem');
    },

    onModelChange: function () {
      this.render();
    },

    onKeyInView: function (event) {
      this.trigger('keydown:item', event);
    }
  });

  var SelectedCountView = Marionette.CompositeView.extend({

    className: 'csui-selected-count',
    template: selectedCountTemplate,
    templateHelpers: function () {
      var selectedCount = this.collection && this.collection.length;
      return {
        selectedCount: selectedCount,
        clearall: lang.clearall,
        selectedLabel: lang.selectedLabel
      };
    },
    childViewContainer: ".csui-selected-items-dropdown",
    childView: SelectedNodeItemView,
    childEvents: {
      'remove:selected:item': 'onRemoveSelectedItem',
      'keydown:item': 'onKeydownItem'
    },

    ui: {
      selectedCountButton: '.csui-selected-counter-region button',
      selectedCountValue: '.csui-selected-counter-region .csui-selected-counter-value',
      dropdownContainer: '.csui-dropmenu-container',
      clearAll: '.csui-selected-count-clearall',
      ClearAllButton: '.csui-selected-count-clearall > span'
    },
    events: {
      'click @ui.selectedCountButton': 'onClickSelectedCount',
      'click @ui.ClearAllButton': 'onClickClearAll',
      'mouseenter @ui.selectedCountButton': 'onMouseEnterSelectedCounterView',
      'mouseleave @ui.selectedCountButton': 'onMouseLeaveSelectedCounterView',
      'mouseenter @ui.dropdownContainer': 'onMouseEnterSelectedCounterView',
      'mouseleave @ui.dropdownContainer': 'onMouseLeaveSelectedCounterView',
      'mouseup @ui.clearAll': 'onMouseUpClearAll',
      'blur  @ui.selectedCountButton': 'onBlurSelectedCountButton',
      'blur @ui.dropdownContainer': 'onBlurSelectedCounterView',
      'keydown': 'onKeydownSelectedCount',
      'keyup': 'onKeyupItem'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-selected-items-dropdown',
        suppressScrollX: true,
        scrollYMarginOffset: 5
      }
    },

    currentlyFocusedElement: function () {
      return this.ui.selectedCountButton;
    },

    constructor: function SelectedCountView(options) {
      this.collection = options.collection;
      Marionette.CompositeView.prototype.constructor.apply(this, options);
      this.showClearAll = false;
      this.selectedItemInFocus = false;
      this.scrollableParent = options.scrollableParent;
      this.listenTo(this.collection, "reset remove add", function () {
        !this.isDestroyed && this.onCollectionUpdate();
      });
      this.selectedCount = this.collection.length;
      if (!!this.scrollableParent) {
        this.windowResizeHandler = _.bind(this.setDropdownCss, this);
        $(window).on('resize', this.windowResizeHandler);
      }
    },

    onRender: function () {
      if (!this.selectedCount) {
        this.$el.addClass('binf-hidden');
      } else {
        this.ui.dropdownContainer.addClass('binf-hidden');
        $(document).off("mouseup.csui.select.count");
      }
    },

    onDestroy: function () {
      // stopListening is needed here, because only the event listeners on this (view) are stopped
      // automatically during destroying of the view
      this.stopListening(this.collection, 'reset remove add');
      if (!!this.windowResizeHandler) {
        $(window).off('resize', this.windowResizeHandler);
      }
    },

    onClickClearAll: function (event) {
      this.selectedItemInFocus = true;
      ModalAlert.confirmQuestion(
          _.str.sformat(lang.dialogTemplate, lang.dialogTitle), lang.dialogTitle, {})
          .always(_.bind(function (result) {
            if (result) {
              this.collection.reset([]);
            } else {
              // setFocus back to Clear all(Keyboard)
              this.ui.ClearAllButton.trigger('focus');
              this._moveTabindexToFocusedElement();
            }
            this.selectedItemInFocus = false;
          }, this));
    },

    onMouseUpClearAll: function (event) {
      //On clicking clearall parent , we should set focus to the clear all button.
      event.preventDefault();
      event.stopPropagation();
      this.ui.ClearAllButton.trigger('focus');
    },

    isDDOpen: function () {
      return this.ui.dropdownContainer.is(":visible");
    },

    _focusOnSelectedCountButton: function () {
      this.ui.selectedCountButton.trigger('focus');
      this.selectedCountViewInFocus = true;
    },

    onMouseEnterSelectedCounterView: function () {
      this.selectedCountViewInFocus = true;
    },

    onMouseLeaveSelectedCounterView: function () {
      //Don't update this.selectedCountViewInFocus if any item in view has focus
      if (this.selectedItemInFocus === false) {
        this.selectedCountViewInFocus = false;
      }
    },

    onClickSelectedCount: function (event) {
      event.preventDefault();
      event.stopPropagation();
      // close all the open dropdowns with 'binf-open' class, before opening select counter view.
      var toggleDropdown = $('.binf-open>.binf-dropdown-toggle');
      if (toggleDropdown.length > 0) {
        toggleDropdown.binf_dropdown('toggle');
      }
      if (this.ui.dropdownContainer.hasClass('binf-hidden')) {
        this._showItemView();
      } else {
        this._hideItemView();
      }
    },

    _showItemView: function () {
      this.selectedCountViewInFocus = true;
      this.ui.dropdownContainer.removeClass('binf-hidden');
      this.ui.selectedCountButton.addClass('binf-open');
      this.ui.selectedCountButton.attr('aria-expanded', 'true');
      if (this.selectedCount > 4) {
        this.showClearAll = true;
        this.ui.clearAll.removeClass('binf-hidden');
      }
      if (!!this.scrollableParent) {
        this.setDropdownCss();
      }
      if (!this.perfectScrollingEnabled) {
        this.triggerMethod("ensure:scrollbar");  // for perfect scrollbar
        this.perfectScrollingEnabled = true;
      }
      if (this.ui.clearAll.hasClass('binf-hidden')) {
        this.ui.dropdownContainer.find('.csui-selected-item:first').trigger('focus');
      } else {
        this.ui.clearAll.find('.csui-selected-count-clearall-label').trigger('focus');
      }
      $(document).on("mouseup.csui.select.count", _.bind(this.onDocumentClick, this));
    },

    onDocumentClick: function (event) {
      //Check the target element lies inside or outside of Dropdown
      //When click on clear all and press 'no' drop-down menu should not close
      if (this.$el[0] !== event.target && !(this.$el).has(event.target).length &&
          !this.selectedItemInFocus) {
        this._hideItemView();
      }
    },

    setDropdownCss: function () {
      var dropdownEle      = this.ui.dropdownContainer.find(".csui-selected-items-dropdown"),
          scrollableParent = $(this.scrollableParent),
          offsetDiff, scrollableParentHeight, elementSetBacks;
      if (!!scrollableParent && scrollableParent.length > 0) {
        scrollableParentHeight = scrollableParent.height();
        elementSetBacks = parseInt(scrollableParent.css("margin-top")) +
                          parseInt(scrollableParent.css("margin-bottom"));
        offsetDiff = dropdownEle.offset().top - scrollableParent.offset().top;
        // check whether dropdown menu overlaps on it's parent scrollable element.
        // reducing 24px to set some gap between scrollable parent's bottom and dropdown height.
        // dropdownEle.offset().top should be same as scrollableparent.offset().top then only we can compare the height of dropdown.
        // offsetDiff -> difference between two elements start (top) position.
        var heightOfDD = Math.abs(scrollableParentHeight - elementSetBacks);
        dropdownEle.css({
          "max-height": heightOfDD - (24 + offsetDiff) + "px"
        });
        //bug with perfect-scrollbar that does not show bar for the first time
        this.trigger("dom:refresh");
      }
    },

    _hideItemView: function (event) {
      this.selectedCountViewInFocus = false;
      this.ui.dropdownContainer.addClass('binf-hidden');
      this.ui.selectedCountButton.removeClass('binf-open');
      this.ui.selectedCountButton.attr('aria-expanded', 'false');
      $(document).off("mouseup.csui.select.count");
    },

    onRemoveSelectedItem: function (view) {
      //maintaing index value as view getting chnaged after removing the model
      var currentIndex = view._index, itemViews;
      this.selectedCountViewInFocus = true;
      this.collection.remove(view.model);
      itemViews = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop;
      if (currentIndex === this.selectedCount) { //if last element
        itemViews[currentIndex - 1] &&
        itemViews[currentIndex - 1].$el.trigger('focus');
      } else {
        itemViews[currentIndex] &&
        itemViews[currentIndex].$el.trigger('focus');
      }
    },

    onCollectionUpdate: function () {
      //update selected Counter
      this.selectedCount = this.collection.length;
      if (this.selectedCount && !this.isDDOpen()) {
        this.$el.removeClass('binf-hidden');
        this.ui.dropdownContainer.addClass('binf-hidden');
        this.trigger('show:counter', true);
      } else if (!this.selectedCount) {
        this.ui.selectedCountButton.removeClass('binf-open');
        this.$el.addClass('binf-hidden');
        $(document).off("mouseup.csui.select.count");
        this.trigger('show:counter', false);
      }
      //dont rerender entire view, update dom elements
      this.ui.selectedCountValue.text(this.selectedCount);
      var titleText = _.str.sformat(lang.selectedTitle, this.selectedCount);
      this.ui.selectedCountButton.attr('aria-label', titleText);
      this.ui.selectedCountButton.attr('title', titleText);
      //showing clear all based on selected count
      if (!this.showClearAll && this.selectedCount > 4) {
        this.showClearAll = true;
        this.ui.clearAll.removeClass('binf-hidden');
      } else if (this.selectedCount <= 4 && this.showClearAll) {
        this.showClearAll = false;
        this.ui.clearAll.addClass('binf-hidden');
      }
      if (this.selectedCount > 0) {
        this._moveTabindexToFocusedElement();
      }
    },

    _moveTabindexToFocusedElement: function () {
      this._focusableElements = base.findFocusables(this.el);
      for (var i = 0; i < this._focusableElements.length; i++) {
        this._focusableElements[i].setAttribute('tabindex', '0');
      }
    },

    onBlurSelectedCountButton: function (event) {
      if (!this.selectedCountViewInFocus) {
        this._hideItemView();
      }
    },

    onBlurSelectedCounterView: function (event) {
      if (!this.selectedCountViewInFocus) {
        this._hideItemView();
      }
    },

    onKeydownSelectedCount: function (event) {
      switch (event.keyCode) {
      case 9:  //tab
        if (this.ui.selectedCountButton.is(':not(:focus)')) {
          event.preventDefault();
          event.stopPropagation();
        }
        this.selectedCountViewInFocus = false;
        this.ui.selectedCountButton.trigger('focus');
        break;
      case 13: //Enter
      case 32: //Space
        if (this.ui.selectedCountButton.is(':focus')) {
          this.selectedCountViewInFocus = true;
          this.onClickSelectedCount(event);
        }
        break;
      case 46: //Delete
        if (this.ui.ClearAllButton.is(':focus')) {
          this.selectedCountViewInFocus = true;
          this.onClickClearAll(event);
        }
        break;
      case 40: //arrow down
        var itemViews = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop;
        this.selectedCountViewInFocus = true;
        event.preventDefault();
        if (this.ui.ClearAllButton.is(':focus')) {
          itemViews[0].$el.trigger('focus');
        }
        break;
      case 37: //arrow left
        event.stopPropagation();
        break;
      case 39: //arrow right
        event.stopPropagation();
        break;

      }
    },

    onKeydownItem: function (view, event) {
      //other than these keys are handled in the onKeydownSelectedCount as event is propagated.
      var itemViews = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop;
      event.preventDefault();
      switch (event.keyCode) {
      case 46: //Delete
        this.onRemoveSelectedItem(view);
        event.stopPropagation();
        break;
      case 40: //arrow down
        this.selectedCountViewInFocus = true;
        view._index === (this.selectedCount - 1) ?
        itemViews[view._index].$el.trigger('focus') :
        itemViews[view._index + 1].$el.trigger('focus');
        event.stopPropagation();
        break;
      case 38: //arrow up
        this.selectedCountViewInFocus = true;
        view._index ? itemViews[view._index - 1].$el.trigger('focus') :
        this.ui.ClearAllButton.trigger('focus');
        event.stopPropagation();
        break;
      case 37: //arrow left
        event.stopPropagation();
        break;
      case 39: //arrow right
        event.stopPropagation();
        break;
      }
    },

    onKeyupItem: function (event) {
      if (event.keyCode === 27 && this.isDDOpen()) { //Esc on select counter view should close Drop-down first
        event.preventDefault();
        event.stopPropagation();
        this._hideItemView();
        this._focusOnSelectedCountButton();
      }
    }

  });
  return SelectedCountView;

});

/*! jQuery Mockjax
 * A Plugin providing simple and flexible mocking of ajax requests and responses
 * 
 * Version: 2.2.1
 * Home: https://github.com/jakerella/jquery-mockjax
 * Copyright (c) 2016 Jordan Kasper, formerly appendTo;
 * NOTE: This repository was taken over by Jordan Kasper (@jakerella) October, 2014
 * 
 * Dual licensed under the MIT or GPL licenses.
 * http://opensource.org/licenses/MIT OR http://www.gnu.org/licenses/gpl-2.0.html
 */

// [OT] Modifications done:
//
// * Replace UMD with csui AMD at the top and bottom of the file
// * Use requirejs module settings for initialization
// * Add publishHandlers temporarily for compatibility

// [OT] Declare a csui module
csui.define('csui/lib/jquery.mockjax',['module', 'csui/lib/jquery'], function(module, $) {
	'use strict';

	var _ajax = $.ajax,
		mockHandlers = [],
		mockedAjaxCalls = [],
		unmockedAjaxCalls = [],
		CALLBACK_REGEX = /=\?(&|$)/,
		jsc = (new Date()).getTime(),
		DEFAULT_RESPONSE_TIME = 500;

	// Parse the given XML string.
	function parseXML(xml) {
		if ( window.DOMParser === undefined && window.ActiveXObject ) {
			window.DOMParser = function() { };
			DOMParser.prototype.parseFromString = function( xmlString ) {
				var doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML( xmlString );
				return doc;
			};
		}

		try {
			var xmlDoc = ( new DOMParser() ).parseFromString( xml, 'text/xml' );
			if ( $.isXMLDoc( xmlDoc ) ) {
				var err = $('parsererror', xmlDoc);
				if ( err.length === 1 ) {
					throw new Error('Error: ' + $(xmlDoc).text() );
				}
			} else {
				throw new Error('Unable to parse XML');
			}
			return xmlDoc;
		} catch( e ) {
			var msg = ( e.name === undefined ? e : e.name + ': ' + e.message );
			$(document).trigger('xmlParseError', [ msg ]);
			return undefined;
		}
	}

	// Check if the data field on the mock handler and the request match. This
	// can be used to restrict a mock handler to being used only when a certain
	// set of data is passed to it.
	function isMockDataEqual( mock, live ) {
		logger.debug( mock, ['Checking mock data against request data', mock, live] );
		var identical = true;

		if ( $.isFunction(mock) ) {
			return !!mock(live);
		}

		// Test for situations where the data is a querystring (not an object)
		if (typeof live === 'string') {
			// Querystring may be a regex
			if ($.isFunction( mock.test )) {
				return mock.test(live);
			} else if (typeof mock === 'object') {
				live = getQueryParams(live);
			} else {
				return mock === live;
			}
		}

		$.each(mock, function(k) {
			if ( live[k] === undefined ) {
				identical = false;
				return identical;
			} else {
				if ( typeof live[k] === 'object' && live[k] !== null ) {
					if ( identical && $.isArray( live[k] ) ) {
						identical = $.isArray( mock[k] ) && live[k].length === mock[k].length;
					}
					identical = identical && isMockDataEqual(mock[k], live[k]);
				} else {
					if ( mock[k] && $.isFunction( mock[k].test ) ) {
						identical = identical && mock[k].test(live[k]);
					} else {
						identical = identical && ( mock[k] === live[k] );
					}
				}
			}
		});

		return identical;
	}

	function getQueryParams(queryString) {
		var i, l, param, tmp,
			paramsObj = {},
			params = String(queryString).split(/&/);

		for (i=0, l=params.length; i<l; ++i) {
			param = params[i];
			try {
				param = decodeURIComponent(param.replace(/\+/g, ' '));
				param = param.split(/=/);
			} catch(e) {
				// Can't parse this one, so let it go?
				continue;
			}

			if (paramsObj[param[0]]) {
				// this is an array query param (more than one entry in query)
				if (!paramsObj[param[0]].splice) {
					// if not already an array, make it one
					tmp = paramsObj[param[0]];
					paramsObj[param[0]] = [];
					paramsObj[param[0]].push(tmp);
				}
				paramsObj[param[0]].push(param[1]);
			} else {
				paramsObj[param[0]] = param[1];
			}
		}

		logger.debug( null, ['Getting query params from string', queryString, paramsObj] );

		return paramsObj;
	}

	// See if a mock handler property matches the default settings
	function isDefaultSetting(handler, property) {
		return handler[property] === $.mockjaxSettings[property];
	}

	// Check the given handler should mock the given request
	function getMockForRequest( handler, requestSettings ) {
		// If the mock was registered with a function, let the function decide if we
		// want to mock this request
		if ( $.isFunction(handler) ) {
			return handler( requestSettings );
		}

		// Inspect the URL of the request and check if the mock handler's url
		// matches the url for this ajax request
		if ( $.isFunction(handler.url.test) ) {
			// The user provided a regex for the url, test it
			if ( !handler.url.test( requestSettings.url ) ) {
				return null;
			}
		} else {

			// Apply namespace prefix to the mock handler's url.
			var namespace = handler.namespace || $.mockjaxSettings.namespace;
			if (!!namespace) {
				var namespacedUrl = [namespace, handler.url].join('/');
				namespacedUrl = namespacedUrl.replace(/(\/+)/g, '/');
				handler.url = namespacedUrl;
			}

			// Look for a simple wildcard '*' or a direct URL match
			var star = handler.url.indexOf('*');
			if (handler.url !== requestSettings.url && star === -1 ||
					!new RegExp(handler.url.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/\*/g, '.+')).test(requestSettings.url)) {
				return null;
			}
		}

		// Inspect the request headers submitted
		if ( handler.requestHeaders ) {
			//No expectation for headers, do not mock this request
			if (requestSettings.headers === undefined) {
				return null;
			} else {
				var headersMismatch = false;
				$.each(handler.requestHeaders, function(key, value) {
					var v = requestSettings.headers[key];
					if(v !== value) {
						headersMismatch = true;
						return false;
					}
				});
				//Headers do not match, do not mock this request
				if (headersMismatch) {
					return null;
				}
			}
		}

		// Inspect the data submitted in the request (either POST body or GET query string)
		if ( handler.data ) {
			if ( !requestSettings.data || !isMockDataEqual(handler.data, requestSettings.data) ) {
				// They're not identical, do not mock this request
				return null;
			}
		}
		// Inspect the request type
		if ( handler && handler.type &&
				handler.type.toLowerCase() !== requestSettings.type.toLowerCase() ) {
			// The request type doesn't match (GET vs. POST)
			return null;
		}

		return handler;
	}

	function isPosNum(value) {
		return typeof value === 'number' && value >= 0;
	}

	function parseResponseTimeOpt(responseTime) {
		if ($.isArray(responseTime) && responseTime.length === 2) {
			var min = responseTime[0];
			var max = responseTime[1];
			if(isPosNum(min) && isPosNum(max)) {
				return Math.floor(Math.random() * (max - min)) + min;
			}
		} else if(isPosNum(responseTime)) {
			return responseTime;
		}
		return DEFAULT_RESPONSE_TIME;
	}

	// Process the xhr objects send operation
	function _xhrSend(mockHandler, requestSettings, origSettings) {
		logger.debug( mockHandler, ['Sending fake XHR request', mockHandler, requestSettings, origSettings] );

		// This is a substitute for < 1.4 which lacks $.proxy
		var process = (function(that) {
			return function() {
				return (function() {
					// The request has returned
					this.status = mockHandler.status;
					this.statusText = mockHandler.statusText;
					this.readyState	= 1;

					var finishRequest = function () {
						this.readyState	= 4;

						var onReady;
						// Copy over our mock to our xhr object before passing control back to
						// jQuery's onreadystatechange callback
						if ( requestSettings.dataType === 'json' && ( typeof mockHandler.responseText === 'object' ) ) {
							this.responseText = JSON.stringify(mockHandler.responseText);
						} else if ( requestSettings.dataType === 'xml' ) {
							if ( typeof mockHandler.responseXML === 'string' ) {
								this.responseXML = parseXML(mockHandler.responseXML);
								//in jQuery 1.9.1+, responseXML is processed differently and relies on responseText
								this.responseText = mockHandler.responseXML;
							} else {
								this.responseXML = mockHandler.responseXML;
							}
						} else if (typeof mockHandler.responseText === 'object' && mockHandler.responseText !== null) {
							// since jQuery 1.9 responseText type has to match contentType
							mockHandler.contentType = 'application/json';
							this.responseText = JSON.stringify(mockHandler.responseText);
						} else {
							this.responseText = mockHandler.responseText;
						}
						if( typeof mockHandler.status === 'number' || typeof mockHandler.status === 'string' ) {
							this.status = mockHandler.status;
						}
						if( typeof mockHandler.statusText === 'string') {
							this.statusText = mockHandler.statusText;
						}
						// jQuery 2.0 renamed onreadystatechange to onload
						onReady = this.onload || this.onreadystatechange;

						// jQuery < 1.4 doesn't have onreadystate change for xhr
						if ( $.isFunction( onReady ) ) {
							if( mockHandler.isTimeout) {
								this.status = -1;
							}
							onReady.call( this, mockHandler.isTimeout ? 'timeout' : undefined );
						} else if ( mockHandler.isTimeout ) {
							// Fix for 1.3.2 timeout to keep success from firing.
							this.status = -1;
						}
					};

					// We have an executable function, call it to give
					// the mock handler a chance to update it's data
					if ( $.isFunction(mockHandler.response) ) {
						// Wait for it to finish
						if ( mockHandler.response.length === 2 ) {
							mockHandler.response(origSettings, function () {
								finishRequest.call(that);
							});
							return;
						} else {
							mockHandler.response(origSettings);
						}
					}

					finishRequest.call(that);
				}).apply(that);
			};
		})(this);

		if ( mockHandler.proxy ) {
			logger.info( mockHandler, ['Retrieving proxy file: ' + mockHandler.proxy, mockHandler] );
			// We're proxying this request and loading in an external file instead
			_ajax({
				global: false,
				url: mockHandler.proxy,
				type: mockHandler.proxyType,
				data: mockHandler.data,
				async: requestSettings.async,
				dataType: requestSettings.dataType === 'script' ? 'text/plain' : requestSettings.dataType,
				complete: function(xhr) {
					// Fix for bug #105
					// jQuery will convert the text to XML for us, and if we use the actual responseXML here
					// then some other things don't happen, resulting in no data given to the 'success' cb
					mockHandler.responseXML = mockHandler.responseText = xhr.responseText;

					// Don't override the handler status/statusText if it's specified by the config
					if (isDefaultSetting(mockHandler, 'status')) {
						mockHandler.status = xhr.status;
					}
					if (isDefaultSetting(mockHandler, 'statusText')) {
						mockHandler.statusText = xhr.statusText;
					}

					if ( requestSettings.async === false ) {
						// TODO: Blocking delay
						process();
					} else {
						this.responseTimer = setTimeout(process, parseResponseTimeOpt(mockHandler.responseTime));
					}
				}
			});
		} else {
			// type === 'POST' || 'GET' || 'DELETE'
			if ( requestSettings.async === false ) {
				// TODO: Blocking delay
				process();
			} else {
				this.responseTimer = setTimeout(process, parseResponseTimeOpt(mockHandler.responseTime));
			}
		}

	}

	// Construct a mocked XHR Object
	function xhr(mockHandler, requestSettings, origSettings, origHandler) {
		logger.debug( mockHandler, ['Creating new mock XHR object', mockHandler, requestSettings, origSettings, origHandler] );

		// Extend with our default mockjax settings
		mockHandler = $.extend(true, {}, $.mockjaxSettings, mockHandler);

		if (typeof mockHandler.headers === 'undefined') {
			mockHandler.headers = {};
		}
		if (typeof requestSettings.headers === 'undefined') {
			requestSettings.headers = {};
		}
		if ( mockHandler.contentType ) {
			mockHandler.headers['content-type'] = mockHandler.contentType;
		}

		return {
			status: mockHandler.status,
			statusText: mockHandler.statusText,
			readyState: 1,
			open: function() { },
			send: function() {
				origHandler.fired = true;
				_xhrSend.call(this, mockHandler, requestSettings, origSettings);
			},
			abort: function() {
				clearTimeout(this.responseTimer);
			},
			setRequestHeader: function(header, value) {
				requestSettings.headers[header] = value;
			},
			getResponseHeader: function(header) {
				// 'Last-modified', 'Etag', 'content-type' are all checked by jQuery
				if ( mockHandler.headers && mockHandler.headers[header] ) {
					// Return arbitrary headers
					return mockHandler.headers[header];
				} else if ( header.toLowerCase() === 'last-modified' ) {
					return mockHandler.lastModified || (new Date()).toString();
				} else if ( header.toLowerCase() === 'etag' ) {
					return mockHandler.etag || '';
				} else if ( header.toLowerCase() === 'content-type' ) {
					return mockHandler.contentType || 'text/plain';
				}
			},
			getAllResponseHeaders: function() {
				var headers = '';
				// since jQuery 1.9 responseText type has to match contentType
				if (mockHandler.contentType) {
					mockHandler.headers['Content-Type'] = mockHandler.contentType;
				}
				$.each(mockHandler.headers, function(k, v) {
					headers += k + ': ' + v + '\n';
				});
				return headers;
			}
		};
	}

	// Process a JSONP mock request.
	function processJsonpMock( requestSettings, mockHandler, origSettings ) {
		// Handle JSONP Parameter Callbacks, we need to replicate some of the jQuery core here
		// because there isn't an easy hook for the cross domain script tag of jsonp

		processJsonpUrl( requestSettings );

		requestSettings.dataType = 'json';
		if(requestSettings.data && CALLBACK_REGEX.test(requestSettings.data) || CALLBACK_REGEX.test(requestSettings.url)) {
			createJsonpCallback(requestSettings, mockHandler, origSettings);

			// We need to make sure
			// that a JSONP style response is executed properly

			var rurl = /^(\w+:)?\/\/([^\/?#]+)/,
				parts = rurl.exec( requestSettings.url ),
				remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

			requestSettings.dataType = 'script';
			if(requestSettings.type.toUpperCase() === 'GET' && remote ) {
				var newMockReturn = processJsonpRequest( requestSettings, mockHandler, origSettings );

				// Check if we are supposed to return a Deferred back to the mock call, or just
				// signal success
				if(newMockReturn) {
					return newMockReturn;
				} else {
					return true;
				}
			}
		}
		return null;
	}

	// Append the required callback parameter to the end of the request URL, for a JSONP request
	function processJsonpUrl( requestSettings ) {
		if ( requestSettings.type.toUpperCase() === 'GET' ) {
			if ( !CALLBACK_REGEX.test( requestSettings.url ) ) {
				requestSettings.url += (/\?/.test( requestSettings.url ) ? '&' : '?') +
					(requestSettings.jsonp || 'callback') + '=?';
			}
		} else if ( !requestSettings.data || !CALLBACK_REGEX.test(requestSettings.data) ) {
			requestSettings.data = (requestSettings.data ? requestSettings.data + '&' : '') + (requestSettings.jsonp || 'callback') + '=?';
		}
	}

	// Process a JSONP request by evaluating the mocked response text
	function processJsonpRequest( requestSettings, mockHandler, origSettings ) {
		logger.debug( mockHandler, ['Performing JSONP request', mockHandler, requestSettings, origSettings] );

		// Synthesize the mock request for adding a script tag
		var callbackContext = origSettings && origSettings.context || requestSettings,
			// If we are running under jQuery 1.5+, return a deferred object
			newMock = ($.Deferred) ? (new $.Deferred()) : null;

		// If the response handler on the moock is a function, call it
		if ( mockHandler.response && $.isFunction(mockHandler.response) ) {

			mockHandler.response(origSettings);


		} else if ( typeof mockHandler.responseText === 'object' ) {
			// Evaluate the responseText javascript in a global context
			$.globalEval( '(' + JSON.stringify( mockHandler.responseText ) + ')');

		} else if (mockHandler.proxy) {
			logger.info( mockHandler, ['Performing JSONP proxy request: ' + mockHandler.proxy, mockHandler] );

			// This handles the unique case where we have a remote URL, but want to proxy the JSONP
			// response to another file (not the same URL as the mock matching)
			_ajax({
				global: false,
				url: mockHandler.proxy,
				type: mockHandler.proxyType,
				data: mockHandler.data,
				dataType: requestSettings.dataType === 'script' ? 'text/plain' : requestSettings.dataType,
				complete: function(xhr) {
					$.globalEval( '(' + xhr.responseText + ')');
					completeJsonpCall( requestSettings, mockHandler, callbackContext, newMock );
				}
			});

			return newMock;

		} else {
			$.globalEval( '(' +
				((typeof mockHandler.responseText === 'string') ?
					('"' + mockHandler.responseText + '"') : mockHandler.responseText) +
			')');
		}

		completeJsonpCall( requestSettings, mockHandler, callbackContext, newMock );

		return newMock;
	}

	function completeJsonpCall( requestSettings, mockHandler, callbackContext, newMock ) {
		var json;

		// Successful response
		setTimeout(function() {
			jsonpSuccess( requestSettings, callbackContext, mockHandler );
			jsonpComplete( requestSettings, callbackContext );

			if ( newMock ) {
				try {
					json = $.parseJSON( mockHandler.responseText );
				} catch (err) { /* just checking... */ }

				newMock.resolveWith( callbackContext, [json || mockHandler.responseText] );
				logger.log( mockHandler, ['JSONP mock call complete', mockHandler, newMock] );
			}
		}, parseResponseTimeOpt( mockHandler.responseTime ));
	}


	// Create the required JSONP callback function for the request
	function createJsonpCallback( requestSettings, mockHandler, origSettings ) {
		var callbackContext = origSettings && origSettings.context || requestSettings;
		var jsonp = (typeof requestSettings.jsonpCallback === 'string' && requestSettings.jsonpCallback) || ('jsonp' + jsc++);

		// Replace the =? sequence both in the query string and the data
		if ( requestSettings.data ) {
			requestSettings.data = (requestSettings.data + '').replace(CALLBACK_REGEX, '=' + jsonp + '$1');
		}

		requestSettings.url = requestSettings.url.replace(CALLBACK_REGEX, '=' + jsonp + '$1');


		// Handle JSONP-style loading
		window[ jsonp ] = window[ jsonp ] || function() {
			jsonpSuccess( requestSettings, callbackContext, mockHandler );
			jsonpComplete( requestSettings, callbackContext );
			// Garbage collect
			window[ jsonp ] = undefined;

			try {
				delete window[ jsonp ];
			} catch(e) {}
		};
		requestSettings.jsonpCallback = jsonp;
	}

	// The JSONP request was successful
	function jsonpSuccess(requestSettings, callbackContext, mockHandler) {
		// If a local callback was specified, fire it and pass it the data
		if ( requestSettings.success ) {
			requestSettings.success.call( callbackContext, mockHandler.responseText || '', 'success', {} );
		}

		// Fire the global callback
		if ( requestSettings.global ) {
			(requestSettings.context ? $(requestSettings.context) : $.event).trigger('ajaxSuccess', [{}, requestSettings]);
		}
	}

	// The JSONP request was completed
	function jsonpComplete(requestSettings, callbackContext) {
		if ( requestSettings.complete ) {
			requestSettings.complete.call( callbackContext, {
				statusText: 'success',
				status: 200
			} , 'success' );
		}

		// The request was completed
		if ( requestSettings.global ) {
			(requestSettings.context ? $(requestSettings.context) : $.event).trigger('ajaxComplete', [{}, requestSettings]);
		}

		// Handle the global AJAX counter
		if ( requestSettings.global && ! --$.active ) {
			$.event.trigger( 'ajaxStop' );
		}
	}


	// The core $.ajax replacement.
	function handleAjax( url, origSettings ) {
		var mockRequest, requestSettings, mockHandler, overrideCallback;

		logger.debug( null, ['Ajax call intercepted', url, origSettings] );

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === 'object' ) {
			origSettings = url;
			url = undefined;
		} else {
			// work around to support 1.5 signature
			origSettings = origSettings || {};
			origSettings.url = url || origSettings.url;
		}

		// Extend the original settings for the request
		requestSettings = $.ajaxSetup({}, origSettings);
		requestSettings.type = requestSettings.method = requestSettings.method || requestSettings.type;

		// Generic function to override callback methods for use with
		// callback options (onAfterSuccess, onAfterError, onAfterComplete)
		overrideCallback = function(action, mockHandler) {
			var origHandler = origSettings[action.toLowerCase()];
			return function() {
				if ( $.isFunction(origHandler) ) {
					origHandler.apply(this, [].slice.call(arguments));
				}
				mockHandler['onAfter' + action]();
			};
		};

		// Iterate over our mock handlers (in registration order) until we find
		// one that is willing to intercept the request
		for(var k = 0; k < mockHandlers.length; k++) {
			if ( !mockHandlers[k] ) {
				continue;
			}

			mockHandler = getMockForRequest( mockHandlers[k], requestSettings );
			if(!mockHandler) {
				logger.debug( mockHandlers[k], ['Mock does not match request', url, requestSettings] );
				// No valid mock found for this request
				continue;
			}

			if ($.mockjaxSettings.retainAjaxCalls) {
				mockedAjaxCalls.push(requestSettings);
			}

			// If logging is enabled, log the mock to the console
			logger.info( mockHandler, [
				'MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url,
				$.ajaxSetup({}, requestSettings)
			] );


			if ( requestSettings.dataType && requestSettings.dataType.toUpperCase() === 'JSONP' ) {
				if ((mockRequest = processJsonpMock( requestSettings, mockHandler, origSettings ))) {
					// This mock will handle the JSONP request
					return mockRequest;
				}
			}

			// We are mocking, so there will be no cross domain request, however, jQuery
			// aggressively pursues this if the domains don't match, so we need to
			// explicitly disallow it. (See #136)
			origSettings.crossDomain = false;

			// Removed to fix #54 - keep the mocking data object intact
			//mockHandler.data = requestSettings.data;

			mockHandler.cache = requestSettings.cache;
			mockHandler.timeout = requestSettings.timeout;
			mockHandler.global = requestSettings.global;

			// In the case of a timeout, we just need to ensure
			// an actual jQuery timeout (That is, our reponse won't)
			// return faster than the timeout setting.
			if ( mockHandler.isTimeout ) {
				if ( mockHandler.responseTime > 1 ) {
					origSettings.timeout = mockHandler.responseTime - 1;
				} else {
					mockHandler.responseTime = 2;
					origSettings.timeout = 1;
				}
			}

			// Set up onAfter[X] callback functions
			if ( $.isFunction( mockHandler.onAfterSuccess ) ) {
				origSettings.success = overrideCallback('Success', mockHandler);
			}
			if ( $.isFunction( mockHandler.onAfterError ) ) {
				origSettings.error = overrideCallback('Error', mockHandler);
			}
			if ( $.isFunction( mockHandler.onAfterComplete ) ) {
				origSettings.complete = overrideCallback('Complete', mockHandler);
			}

			copyUrlParameters(mockHandler, origSettings);

			/* jshint loopfunc:true */
			(function(mockHandler, requestSettings, origSettings, origHandler) {

				mockRequest = _ajax.call($, $.extend(true, {}, origSettings, {
					// Mock the XHR object
					xhr: function() { return xhr( mockHandler, requestSettings, origSettings, origHandler ); }
				}));
			})(mockHandler, requestSettings, origSettings, mockHandlers[k]);
			/* jshint loopfunc:false */

			return mockRequest;
		}
		// We don't have a mock request
		logger.log( null, ['No mock matched to request', url, origSettings] );
		if ($.mockjaxSettings.retainAjaxCalls) {
			unmockedAjaxCalls.push(origSettings);
		}
		if($.mockjaxSettings.throwUnmocked === true) {
			console.error('AJAX not mocked: ' + origSettings.url + ' Stack: ' + new Error().stack);
			throw new Error('AJAX call failed: ' + origSettings.url);
		}
		else { // trigger a normal request
			return _ajax.apply($, [origSettings]);
		}
	}

	/**
	* Copies URL parameter values if they were captured by a regular expression
	* @param {Object} mockHandler
	* @param {Object} origSettings
	*/
	function copyUrlParameters(mockHandler, origSettings) {
		//parameters aren't captured if the URL isn't a RegExp
		if (!(mockHandler.url instanceof RegExp)) {
			return;
		}
		//if no URL params were defined on the handler, don't attempt a capture
		if (!mockHandler.hasOwnProperty('urlParams')) {
			return;
		}
		var captures = mockHandler.url.exec(origSettings.url);
		//the whole RegExp match is always the first value in the capture results
		if (captures.length === 1) {
			return;
		}
		captures.shift();
		//use handler params as keys and capture resuts as values
		var i = 0,
		capturesLength = captures.length,
		paramsLength = mockHandler.urlParams.length,
		//in case the number of params specified is less than actual captures
		maxIterations = Math.min(capturesLength, paramsLength),
		paramValues = {};
		for (i; i < maxIterations; i++) {
			var key = mockHandler.urlParams[i];
			paramValues[key] = captures[i];
		}
		origSettings.urlParams = paramValues;
	}

	/**
	 * Clears handlers that mock given url
	 * @param url
	 * @returns {Array}
	 */
	function clearByUrl(url) {
		var i, len,
			handler,
			results = [],
			match=url instanceof RegExp ?
				function(testUrl) { return url.test(testUrl); } :
				function(testUrl) { return url === testUrl; };
		for (i=0, len=mockHandlers.length; i<len; i++) {
			handler = mockHandlers[i];
			if (!match(handler.url)) {
				results.push(handler);
			} else {
				logger.log( handler, [
					'Clearing mock: ' + (handler && handler.url),
					handler
				] );
			}
		}
		return results;
	}


	// Public

	$.extend({
		ajax: handleAjax
	});

	var logger = {
		_log: function logger( mockHandler, args, level ) {
			var loggerLevel = $.mockjaxSettings.logging;
			if (mockHandler && typeof mockHandler.logging !== 'undefined') {
				loggerLevel = mockHandler.logging;
			}
			level = ( level === 0 ) ? level : ( level || logLevels.LOG );
			args = (args.splice) ? args : [ args ];

			// Is logging turned off for this mock or mockjax as a whole?
			// Or is this log message above the desired log level?
			if ( loggerLevel === false || loggerLevel < level ) {
				return;
			}

			if ( $.mockjaxSettings.log ) {
				return $.mockjaxSettings.log( mockHandler, args[1] || args[0] );
			} else if ( $.mockjaxSettings.logger && $.mockjaxSettings.logger[$.mockjaxSettings.logLevelMethods[level]] ) {
				return $.mockjaxSettings.logger[$.mockjaxSettings.logLevelMethods[level]].apply( $.mockjaxSettings.logger, args );
			}
		},
		/**
		 * Convenience method for logging a DEBUG level message
		 * @param  {Object} m  The mock handler in question
		 * @param  {Array|String|Object} a  The items to log
		 * @return {?}  Will return whatever the $.mockjaxSettings.logger method for this level would return (generally 'undefined')
		 */
		debug: function(m,a) { return logger._log(m,a,logLevels.DEBUG); },
		/**
		 * @see logger.debug
		 */
		log: function(m,a) { return logger._log(m,a,logLevels.LOG); },
		/**
		 * @see logger.debug
		 */
		info: function(m,a) { return logger._log(m,a,logLevels.INFO); },
		/**
		 * @see logger.debug
		 */
		warn: function(m,a) { return logger._log(m,a,logLevels.WARN); },
		/**
		 * @see logger.debug
		 */
		error: function(m,a) { return logger._log(m,a,logLevels.ERROR); }
	};

	var logLevels = {
		DEBUG: 4,
		LOG: 3,
		INFO: 2,
		WARN: 1,
		ERROR: 0
	};

	/**
	 * Default settings for mockjax. Some of these are used for defaults of
	 * individual mock handlers, and some are for the library as a whole.
	 * For individual mock handler settings, please see the README on the repo:
	 * https://github.com/jakerella/jquery-mockjax#api-methods
	 *
	 * @type {Object}
	 */
	$.mockjaxSettings = {
		log:				null, // this is only here for historical purposes... use $.mockjaxSettings.logger
		logger:				window.console,
		logging:			2,
		logLevelMethods:	['error', 'warn', 'info', 'log', 'debug'],
		namespace:			null,
		status:				200,
		statusText:			'OK',
		responseTime:		DEFAULT_RESPONSE_TIME,
		isTimeout:			false,
		throwUnmocked:		false,
		retainAjaxCalls:	true,
		contentType:		'text/plain',
		response:			'',
		responseText:		'',
		responseXML:		'',
		proxy:				'',
		proxyType:			'GET',

		lastModified:		null,
		etag:				'',
		headers:			{
								etag: 'IJF@H#@923uf8023hFO@I#H#',
								'content-type' : 'text/plain'
							}
	};

	/**
	 * Create a new mock Ajax handler. When a mock handler is matched during a
	 * $.ajax() call this library will intercept that request and fake a response
	 * using the data and methods in the mock. You can see all settings in the
	 * README of the main repository:
	 * https://github.com/jakerella/jquery-mockjax#api-methods
	 *
	 * @param  {Object} settings The mock handelr settings: https://github.com/jakerella/jquery-mockjax#api-methods
	 * @return {Number}		  The id (index) of the mock handler suitable for clearing (see $.mockjax.clear())
	 */
	$.mockjax = function(settings) {
		// Multiple mocks.
		if ( $.isArray(settings) ) {
			return $.map(settings, function(s) {
				return $.mockjax(s);
			});
		}

		var i = mockHandlers.length;
		mockHandlers[i] = settings;
		logger.log( settings, ['Created new mock handler', settings] );
		return i;
	};

	$.mockjax._logger = logger;

	/**
	 * Remove an Ajax mock from those held in memory. This will prevent any
	 * future Ajax request mocking for matched requests.
	 * NOTE: Clearing a mock will not prevent the resolution of in progress requests
	 *
	 * @param  {Number|String|RegExp} i  OPTIONAL The mock to clear. If not provided, all mocks are cleared,
	 *                                   if a number it is the index in the in-memory cache. If a string or
	 *                                   RegExp, find a mock that matches that URL and clear it.
	 * @return {void}
	 */
	$.mockjax.clear = function(i) {
		if ( typeof i === 'string' || i instanceof RegExp) {
			mockHandlers = clearByUrl(i);
		} else if ( i || i === 0 ) {
			logger.log( mockHandlers[i], [
				'Clearing mock: ' + (mockHandlers[i] && mockHandlers[i].url),
				mockHandlers[i]
			] );
			mockHandlers[i] = null;
		} else {
			logger.log( null, 'Clearing all mocks' );
			mockHandlers = [];
		}
		mockedAjaxCalls = [];
		unmockedAjaxCalls = [];
	};

	/**
	 * By default all Ajax requests performed after loading Mockjax are recorded
	 * so that we can see which requests were mocked and which were not. This
	 * method allows the developer to clear those retained requests.
	 *
	 * @return {void}
	 */
	$.mockjax.clearRetainedAjaxCalls = function() {
		mockedAjaxCalls = [];
		unmockedAjaxCalls = [];
		logger.debug( null, 'Cleared retained ajax calls' );
	};

	/**
	 * Retrive the mock handler with the given id (index).
	 *
	 * @param  {Number} i  The id (index) to retrieve
	 * @return {Object}	The mock handler settings
	 */
	$.mockjax.handler = function(i) {
		if ( arguments.length === 1 ) {
			return mockHandlers[i];
		}
	};

	/**
	 * Retrieve all Ajax calls that have been mocked by this library during the
	 * current session (in other words, only since you last loaded this file).
	 *
	 * @return {Array}  The mocked Ajax calls (request settings)
	 */
	$.mockjax.mockedAjaxCalls = function() {
		return mockedAjaxCalls;
	};

	/**
	 * Return all mock handlers that have NOT been matched against Ajax requests
	 *
	 * @return {Array}  The mock handlers
	 */
	$.mockjax.unfiredHandlers = function() {
		var results = [];
		for (var i=0, len=mockHandlers.length; i<len; i++) {
			var handler = mockHandlers[i];
			if (handler !== null && !handler.fired) {
				results.push(handler);
			}
		}
		return results;
	};

	/**
	 * Retrieve all Ajax calls that have NOT been mocked by this library during
	 * the current session (in other words, only since you last loaded this file).
	 *
	 * @return {Array}  The mocked Ajax calls (request settings)
	 */
	$.mockjax.unmockedAjaxCalls = function() {
		return unmockedAjaxCalls;
	};

	// [OT] TODO: Remove this as soon as it is disused
	$.mockjax.publishHandlers = function(){
		for (var i=0, len=mockHandlers.length; i<len; i++) {
			var handler = mockHandlers[i];
			if (handler) {
			 // var response = handler.response || handler.responseText;
			  var message = 'Handler ' + handler.name + ':\nurl' + handler.url;
			  console.log( message);
			}
		}
	};

	// [OT] Initialize mockjx using require.config module settings
	$.extend(true, $.mockjaxSettings, module.config().settings);

	return $.mockjax;

});

/*!
 * jQuery Simulate v0.0.1 - simulate browser mouse and keyboard events
 * https://github.com/jquery/jquery-simulate
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Sun Dec 9 12:15:33 2012 -0500
 */

csui.define('csui/lib/jquery.simulate',['module', 'csui/lib/jquery'
], function (module, jQuery) {


    ;
    (function ($, undefined) {
        "use strict";

        var rkeyEvent = /^key/,
            rmouseEvent = /^(?:mouse|contextmenu)|click/,
            rdocument = /\[object (?:HTML)?Document\]/;

        function isDocument(ele) {
            return rdocument.test(Object.prototype.toString.call(ele));
        }

        function windowOfDocument(doc) {
            for (var i = 0; i < window.frames.length; i += 1) {
                if (window.frames[i] && window.frames[i].document === doc) {
                    return window.frames[i];
                }
            }
            return window;
        }

        $.fn.simulate = function (type, options) {
            return this.each(function () {
                new $.simulate(this, type, options);
            });
        };

        $.simulate = function (elem, type, options) {
            var method = $.camelCase("simulate-" + type);

            this.target = elem;
            this.options = options || {};

            if (this[method]) {
                this[method]();
            } else {
                this.simulateEvent(elem, type, this.options);
            }
        };

        $.extend($.simulate, {

            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            },

            buttonCode: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
            }
        });

        $.extend($.simulate.prototype, {

            simulateEvent: function (elem, type, options) {
                var event = this.createEvent(type, options);
                this.dispatchEvent(elem, type, event, options);
            },

            createEvent: function (type, options) {
                if (rkeyEvent.test(type)) {
                    return this.keyEvent(type, options);
                }

                if (rmouseEvent.test(type)) {
                    return this.mouseEvent(type, options);
                }
            },

            mouseEvent: function (type, options) {
                var event,
                    eventDoc,
                    doc = isDocument(this.target) ? this.target : (this.target.ownerDocument || document),
                    docEle,
                    body;


                options = $.extend({
                    bubbles: true,
                    cancelable: (type !== "mousemove"),
                    view: windowOfDocument(doc),
                    detail: 0,
                    screenX: 0,
                    screenY: 0,
                    clientX: 1,
                    clientY: 1,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button: 0,
                    relatedTarget: undefined
                }, options);


                if (doc.createEvent) {
                    event = doc.createEvent("MouseEvents");
                    event.initMouseEvent(type, options.bubbles, options.cancelable,
                        options.view, options.detail,
                        options.screenX, options.screenY, options.clientX, options.clientY,
                        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                        options.button, options.relatedTarget || doc.body.parentNode);

                    // IE 9+ creates events with pageX and pageY set to 0.
                    // Trying to modify the properties throws an error,
                    // so we define getters to return the correct values.
                    if (event.pageX === 0 && event.pageY === 0 && Object.defineProperty) {
                        eventDoc = isDocument(event.relatedTarget) ? event.relatedTarget : (event.relatedTarget.ownerDocument || document);
                        docEle = eventDoc.documentElement;
                        body = eventDoc.body;

                        Object.defineProperty(event, "pageX", {
                            get: function () {
                                return options.clientX +
                                    ( docEle && docEle.scrollLeft || body && body.scrollLeft || 0 ) -
                                    ( docEle && docEle.clientLeft || body && body.clientLeft || 0 );
                            }
                        });
                        Object.defineProperty(event, "pageY", {
                            get: function () {
                                return options.clientY +
                                    ( docEle && docEle.scrollTop || body && body.scrollTop || 0 ) -
                                    ( docEle && docEle.clientTop || body && body.clientTop || 0 );
                            }
                        });
                    }
                } else if (doc.createEventObject) {
                    event = doc.createEventObject();
                    $.extend(event, options);
                    // standards event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ff974877(v=vs.85).aspx
                    // old IE event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ms533544(v=vs.85).aspx
                    // so we actually need to map the standard back to oldIE
                    event.button = {
                            0: 1,
                            1: 4,
                            2: 2
                        }[event.button] || event.button;
                }

                return event;
            },

            keyEvent: function (type, options) {
                var event, doc;
                options = $.extend({
                    bubbles: true,
                    cancelable: true,
                    view: windowOfDocument(doc),
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    keyCode: 0,
                    charCode: undefined
                }, options);

                doc = isDocument(this.target) ? this.target : (this.target.ownerDocument || document);
                if (doc.createEvent) {
                    try {
                        event = doc.createEvent("KeyEvents");
                        event.initKeyEvent(type, options.bubbles, options.cancelable, options.view,
                            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                            options.keyCode, options.charCode);
                        // initKeyEvent throws an exception in WebKit
                        // see: http://stackoverflow.com/questions/6406784/initkeyevent-keypress-only-works-in-firefox-need-a-cross-browser-solution
                        // and also https://bugs.webkit.org/show_bug.cgi?id=13368
                        // fall back to a generic event until we decide to implement initKeyboardEvent
                    } catch (err) {
                        event = doc.createEvent("Events");
                        event.initEvent(type, options.bubbles, options.cancelable);
                        $.extend(event, {
                            view: options.view,
                            ctrlKey: options.ctrlKey,
                            altKey: options.altKey,
                            shiftKey: options.shiftKey,
                            metaKey: options.metaKey,
                            keyCode: options.keyCode,
                            charCode: options.charCode
                        });
                    }
                } else if (doc.createEventObject) {
                    event = doc.createEventObject();
                    $.extend(event, options);
                }

                if (!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) || (({}).toString.call(window.opera) === "[object Opera]")) {
                    event.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
                    event.charCode = undefined;
                }

                return event;
            },

            dispatchEvent: function (elem, type, event, options) {
                if (options.jQueryTrigger === true) {
                    $(elem).trigger($.extend({}, event, options, {type: type}));
                }
                else if (elem.dispatchEvent) {
                    elem.dispatchEvent(event);
                } else if (elem.fireEvent) {
                    elem.fireEvent("on" + type, event);
                }
            },

            simulateFocus: function () {
                var focusinEvent,
                    triggered = false,
                    $element = $(this.target);

                function trigger() {
                    triggered = true;
                }

                $element.on('focus', trigger);
                $element.first().trigger('focus');

                if (!triggered) {
                    focusinEvent = $.Event("focusin");
                    focusinEvent.preventDefault();
                    $element.trigger(focusinEvent);
                    $element.triggerHandler("focus");
                }
                $element.unbind("focus", trigger);
            },

            simulateBlur: function () {
                var focusoutEvent,
                    triggered = false,
                    $element = $(this.target);

                function trigger() {
                    triggered = true;
                }

                $element.on('blur', trigger);
                $element.first().trigger('blur');

                // blur events are async in IE
                setTimeout(function () {
                    // IE won't let the blur occur if the window is inactive
                    if ($element[0].ownerDocument.activeElement === $element[0]) {
                        $($element[0].ownerDocument.body).trigger('focus');
                    }

                    // Firefox won't trigger events if the window is inactive
                    // IE doesn't trigger events if we had to manually focus the body
                    if (!triggered) {
                        focusoutEvent = $.Event("focusout");
                        focusoutEvent.preventDefault();
                        $element.trigger(focusoutEvent);
                        $element.triggerHandler("blur");
                    }
                    $element.off("blur", trigger);
                }, 1);
            }
        });


        /** complex events **/

        function findCenter(elem) {
            var offset,
                $document,
                $elem = $(elem);

            if (isDocument($elem[0])) {
                $document = $elem;
                offset = {left: 0, top: 0};
            }
            else {
                $document = $($elem[0].ownerDocument || document);
                offset = $elem.offset();
            }

            return {
                x: offset.left + $elem.outerWidth() / 2 - $document.scrollLeft(),
                y: offset.top + $elem.outerHeight() / 2 - $document.scrollTop()
            };
        }

        function findCorner(elem) {
            var offset,
                $document,
                $elem = $(elem);

            if (isDocument($elem[0])) {
                $document = $elem;
                offset = {left: 0, top: 0};
            }
            else {
                $document = $($elem[0].ownerDocument || document);
                offset = $elem.offset();
            }

            return {
                x: offset.left - document.scrollLeft(),
                y: offset.top - document.scrollTop()
            };
        }

        $.extend($.simulate.prototype, {
            simulateDrag: function () {
                var i = 0,
                    target = this.target,
                    options = this.options,
                    center = options.handle === "corner" ? findCorner(target) : findCenter(target),
                    x = Math.floor(center.x),
                    y = Math.floor(center.y),
                    coord = {clientX: x, clientY: y},
                    dx = options.dx || ( options.x !== undefined ? options.x - x : 0 ),
                    dy = options.dy || ( options.y !== undefined ? options.y - y : 0 ),
                    moves = options.moves || 3;

                this.simulateEvent(target, "mousedown", coord);

                for (; i < moves; i++) {
                    x += dx / moves;
                    y += dy / moves;

                    coord = {
                        clientX: Math.round(x),
                        clientY: Math.round(y)
                    };

                    this.simulateEvent(target.ownerDocument, "mousemove", coord);
                }

                if ($.contains(document, target)) {
                    this.simulateEvent(target, "mouseup", coord);
                    this.simulateEvent(target, "click", coord);
                } else {
                    this.simulateEvent(document, "mouseup", coord);
                }
            }
        });

    })(jQuery);

});

csui.define('csui/lib/othelp',['module'], function(module) {
/* (c) Copyright Open Text Corporation 2016. Version 16.4.0.46 */ 
var OTHHUrlBuilder=function(t){var u="product",A="version",w="http://docsapi.opentext.com/mapperpi",y={tboolean:"touch bookmarks toc bookmarkEntries sectionNumbers caseSensitive highContrast".split(" "),nameValuePair:{find:["anyWord","allWords","exactWord"],search:["allModules","document","section","page"],sort:["match","divisions"]},tstring:"query"};Array.isArray||(Array.isArray=function(a){return a instanceof Array});"undefined"==typeof String.prototype.endsWith&&(String.prototype.endsWith=function(a){return this.lastIndexOf(a)==
this.length-a.length});"undefined"==typeof debug&&(debug=!1);"undefined"==typeof trace&&(trace=!1);t&&(u=t.product||u,A=t.version||A,w=t.urlRoot||w);try{console||(console={error:function(){},log:function(){},warn:function(){}})}catch(a){console={error:function(){},log:function(){},warn:function(){}}}return{buildHelpUrl:function(a,b,c){if(!a||!b)return console.error("Please specify 'locale' and 'context'"),"";if("string"==typeof a&&0>a.indexOf(",")&&"string"==typeof b)return this._.generateSixParam(a,
b,c);var d=null,d="string"==typeof a&&-1<a.indexOf(",")?a.split(","):"string"==typeof a?[a]:a;return this._.generateComplexParam(d,b,c)},optionConstants:y,_:{generateComplexParam:function(a,b,c){var d,f=[],p,m,g=[],e=null,e=!1,n=[],l=[],h,q,t,u,k,z,r,v,x;if(!a||!b)return console.error("Missing parameter!, Please specify 'locale', and 'context', not:",a,b,c),"";if("object"!=typeof a||"object"!=typeof b||c&&"object"!=typeof c)return console.error("Invalid parameter!:",a,b,c,"are not objects. Parameter order should be ([],{},{})"),
"";q=c?c.tenant:null;t=c?c.type||"ofh1":"ofh1";u=function(a,b){if(a){z=!1;for(r in b)z|=b[r]==a;z||b.push(a)}};d="";for(h in b.documents)k=b.documents[h],k.active&&!0===k.active&&(e&&delete k.active,e=!0),!0===k.exclude&&f.push(k),this.fixApp(k),u(k.version,l),k.err||n.push(k);if("object"==typeof c&&c.options){debug&&console.log("Complex params options: ",c.options);e={find:1,search:10,sort:100};k=0;v=1;for(h in y.tboolean)r=y.tboolean[h],r=c.options[r],"boolean"==typeof r&&(k+=r?v:0),v*=2;k=k.toString(16);
"0"!=k&&(d+=2>k.length?"0"+k:k);k=0;for(h in c.options)if(r=y.nameValuePair[h])for(v=c.options[h],x=0;x<r.length;x++)if(r[x]==v){k+=(x+1)*e[h];break}0<k&&121!=k&&(k=k.toString(16),d+=(0===d.length?"00":"")+(2>k.length?"0"+k:k));"string"==typeof c.options.query&&(d+="S"+encodeURI(c.options.query));c.options.flags&&(p=(""+c.options.flags).replace(/[^a-zA-Z0-9]/g,""));if(c.options.custom)for(k in m="",c.options.custom)0<=",ml,t,o,f,key,type,".indexOf(","+k+",")||(r=""+k.replace(/[^a-zA-Z0-9]/g,"")+"="+
encodeURIComponent(c.options.custom[k]),m+="&"+r)}debug&&console.log("Complex params: ",q,t,JSON.stringify(n),d);c=w+"?ml=";c+=this.altArray(a);1==l.length&&(c=c+","+l[0]);for(h=0;h<n.length;h++)e=n[h].module,n[h].version&&(e+=n[h].version),n[h].release&&(e+="-"+n[h].release),n[h].help&&(e+="-"+n[h].help),n[h].docType&&(e+="-"+n[h].docType),n[h].locale&&(e+="-"+n[h].locale),n[h].PageID&&(e+="."+n[h].PageID),n[h].exclude&&(e+="_"),n[h].active&&(e+="~"),u(e,g);debug&&(console.log("Complex params: ",
l,c,JSON.stringify(f)),console.log("Compressable: ",JSON.stringify(g)));e=this.compress({docs:g,preserve:b.preserve,locale:a},a[0]);debug&&console.log("Compressed:",e);q&&(e+="&t="+encodeURIComponent(q));d&&(0<parseInt(d,16)||0<=d.indexOf("S"))&&(e+="&o="+d);p&&(e+="&f="+p);m&&(e+=m);a=this.generateKey();return w+"?type="+t+"&ml="+(e+("&key="+a))},compress:function(a,b){var c=a.locale,d,f;d=null;var p=[],m,g="NotAPossibleValue",e=g,n=!0,l=g,h=!0,q;c||(c=b);c&&null!==c||(c="en");d=a.docs;!0!==a.preserve&&
(d=d.sort());f=this.altArray(c);p=[];m=null;e=g="NotAPossibleValue";n=!0;l=g;h=!0;for(q in d)m=this.parseRevnum(d[q]),p.push(m),n&&e!=m.help&&(e==g?e=m.help:e!=m.help&&(n=!1)),h&&l!=m.release&&(l==g?l=m.release:l!=m.release&&(h=!1));2>d.length&&(h=n=!1);h&&null!==l&&(f=f+"-"+l.toUpperCase());n&&null!==e&&(f+="-",f+=e);e=g=q=null;for(m in p){d=p[m];null===q||q!=d.product?(f+="$",q=d.product,g=e=null,f+=q):f+=",";l=d.version;h||null===d.release||d.release&&(l+="-"+d.release.toUpperCase());if(null===
g||g!=l)f+=l,g=l,e=null;l="";d.docType&&(l+=d.docType);null!==d.locale&&c!=d.locale&&(l+="-",l+=d.locale);null!==d.PageID&&0<d.PageID.length&&(l+=".",l+=window.encodeURIComponent(d.PageID));if(null===e||e!=l)null!==e&&","!=f.substring(f.length-1)&&(f+=","),e=l,n||null===d.help||(f+=d.help,f+="-"),f+=e;null!==d.flag&&(f+=d.flag)}return f},fixApp:function(a){var b=null,c;if(a){a.version||(b=this.parseRevnum(a.module),a.module=b.product,a.version=b.version&&0<b.version.length?b.version:"0",a.release=
b.release&&0<b.release.length?b.release:null,a.docType=b.docType,a.help=b.help,a.err=b.err);"v"==a.version[0]&&(a.version=a.version.substring(1));if(-1<a.module.indexOf("-")){b=a.module.split(/(?=-)/);b[0]=b[0].split(/\d+$/)[0];a.module=b[0]+a.version;for(c=1;c<b.length;c++)a.module+=b[c];b=this.parseRevnum(a.module);a.module=b.product;a.version=b.version;a.release=b.release;a.docType=b.docType;a.help=b.help;a.err=b.err}b||(b=this.parseRevnum(a.module));a.locale=b.locale&&0<b.locale.length&&!a.locale?
b.locale:a.locale;a.PageID=b.PageID&&0<b.PageID.length&&!a.topic?b.PageID:a.topic;a.module=a.module.split(/\d+$/)[0]}},generateSixParam:function(a,b,c){var d=null,f=null,p=null,m=null,g;c&&(d=c.product,f=c.version,p=c.module,m=c.type);"string"==typeof m&&0===m.length&&(m=null);c=this.generateKey();d=d||u;f=f||A;g=w;"string"!=typeof p&&"string"!=typeof m&&0<g.indexOf("mapperpi")&&(g=g.substring(0,g.length-2));g=g+"?"+("product="+encodeURIComponent(d));g+="&version="+encodeURIComponent(f);g+="&locale="+
encodeURIComponent(a);g+="&context="+encodeURIComponent(b);if("string"==typeof p&&"string"==typeof m)g+="&module="+encodeURIComponent(p),g+="&type="+encodeURIComponent(m);else if(!p&&m||!m&&p)return console.error("'module' and 'type' need to be either BOTH or NEITHER defined"),"";g+="&key="+c;debug&&console.log(g);return g},generateKey:function(){var a=this.generatePassPhrase();return this.encryptByDES("Vignette",a)},parseRevnum:function(a){var b=null,c;if(b=a.match(/^([a-zA-Z]+)(\d+(-\d+\w*)?)((-[a-z])?)(-[a-z]+)?(-[_a-z]+)?(-\d+)?(\.([a-zA-Z0-9#.\_\-]+))?([\_\~])?$/i)){a=
b[2];b[3]&&"-"==b[3][0]&&(a=a.substring(0,a.length-b[3].length));b={product:b[1],version:a,release:b[3],help:b[4],docType:b[6],locale:b[7],revision:b[8],PageID:b[10],flag:b[11]};for(c in b)b[c]&&"-"==b[c][0]?b[c]=b[c].substring(1):b[c]||(b[c]=null);null!==b.PageID&&null===b.flag&&b.PageID.endsWith("_")&&(b.flag="_",b.PageID=b.PageID.substring(0,b.PageID.length-1))}else b={product:a,version:null,release:null,help:null,docType:null,locale:null,revision:null,PageID:null,flag:null,err:!0};return b},generatePassPhrase:function(){var a=
new Date,b=a.getFullYear(),c=a.getMonth(),a=a.getDate(),d=""+c,f=""+a;10>c&&(d="0"+d);10>a&&(f="0"+f);return b+d+f},encryptByDES:function(a,b){var c;c=CryptoJS.enc.Utf8.parse(b);var d=CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse("ruhulio!").toString(CryptoJS.enc.Hex));trace&&(console.log(CryptoJS.enc.Utf8.stringify(c),CryptoJS.enc.Hex.stringify(c)),console.log(CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(b).toString(CryptoJS.enc.Hex))));c=CryptoJS.DES.encrypt(a,c,{iv:d,mode:CryptoJS.mode.CBC,
padding:CryptoJS.pad.Pkcs7});trace&&(console.log("encrypted.toString()  -> base64(ciphertext)  :",c.toString()),console.log("base64(ciphertext)    <- encrypted.toString():",c.ciphertext.toString(CryptoJS.enc.Base64)),console.log("ciphertext.toString() -> ciphertext hex      :",c.ciphertext.toString()));return c.ciphertext.toString()},altArray:function(a){var b="",c,d;if(Array.isArray(a)){for(c=0;c<a.length;c++)d=a[c],b=0===c%2?b+d.toLowerCase():b+d.toUpperCase();return b}return a}}}};

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,l){var d={},n=d.lib={},p=function(){},s=n.Base={extend:function(a){p.prototype=this;var c=new p;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=n.WordArray=s.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,m=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var t=0;t<a;t++)c[f+t>>>2]|=(m[t>>>2]>>>24-8*(t%4)&255)<<24-8*((f+t)%4);else if(65535<m.length)for(t=0;t<a;t+=4)c[f+t>>>2]=m[t>>>2];else c.push.apply(c,m);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=s.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],m=0;m<a;m+=4)c.push(4294967296*u.random()|0);return new q.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++){var t=c[f>>>2]>>>24-8*(f%4)&255;m.push((t>>>4).toString(16));m.push((t&15).toString(16))}return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f+=2)m[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new q.init(m,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++)m.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f++)m[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new q.init(m,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
r=n.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,m=c.words,f=c.sigBytes,t=this.blockSize,b=f/(4*t),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*t;f=u.min(4*a,f);if(a){for(var e=0;e<a;e+=t)this._doProcessBlock(m,e);e=m.splice(0,a);c.sigBytes-=f}return new q.init(e,f)},clone:function(){var a=s.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});n.Hasher=r.extend({cfg:s.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,m){return(new a.init(m)).finalize(c)}},_createHmacHelper:function(a){return function(c,m){return(new e.HMAC.init(a,
m)).finalize(c)}}});var e=d.algo={};return d}(Math);
(function(){var u=CryptoJS,l=u.lib.WordArray;u.enc.Base64={stringify:function(d){var n=d.words,l=d.sigBytes,s=this._map;d.clamp();d=[];for(var q=0;q<l;q+=3)for(var w=(n[q>>>2]>>>24-8*(q%4)&255)<<16|(n[q+1>>>2]>>>24-8*((q+1)%4)&255)<<8|n[q+2>>>2]>>>24-8*((q+2)%4)&255,v=0;4>v&&q+0.75*v<l;v++)d.push(s.charAt(w>>>6*(3-v)&63));if(n=s.charAt(64))for(;d.length%4;)d.push(n);return d.join("")},parse:function(d){var n=d.length,p=this._map,s=p.charAt(64);s&&(s=d.indexOf(s),-1!=s&&(n=s));for(var s=[],q=0,w=0;w<
n;w++)if(w%4){var v=p.indexOf(d.charAt(w-1))<<2*(w%4),b=p.indexOf(d.charAt(w))>>>6-2*(w%4);s[q>>>2]|=(v|b)<<24-8*(q%4);q++}return l.create(s,q)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function l(b,e,a,c,m,f,t){b=b+(e&a|~e&c)+m+t;return(b<<f|b>>>32-f)+e}function d(b,e,a,c,m,f,t){b=b+(e&c|a&~c)+m+t;return(b<<f|b>>>32-f)+e}function n(b,e,a,c,m,f,t){b=b+(e^a^c)+m+t;return(b<<f|b>>>32-f)+e}function p(b,e,a,c,m,f,t){b=b+(a^(e|~c))+m+t;return(b<<f|b>>>32-f)+e}for(var s=CryptoJS,q=s.lib,w=q.WordArray,v=q.Hasher,q=s.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;q=q.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(r,e){for(var a=0;16>a;a++){var c=e+a,m=r[c];r[c]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360}var a=this._hash.words,c=r[e+0],m=r[e+1],f=r[e+2],t=r[e+3],y=r[e+4],q=r[e+5],s=r[e+6],w=r[e+7],v=r[e+8],u=r[e+9],x=r[e+10],z=r[e+11],A=r[e+12],B=r[e+13],C=r[e+14],D=r[e+15],g=a[0],h=a[1],j=a[2],k=a[3],g=l(g,h,j,k,c,7,b[0]),k=l(k,g,h,j,m,12,b[1]),j=l(j,k,g,h,f,17,b[2]),h=l(h,j,k,g,t,22,b[3]),g=l(g,h,j,k,y,7,b[4]),k=l(k,g,h,j,q,12,b[5]),j=l(j,k,g,h,s,17,b[6]),h=l(h,j,k,g,w,22,b[7]),
g=l(g,h,j,k,v,7,b[8]),k=l(k,g,h,j,u,12,b[9]),j=l(j,k,g,h,x,17,b[10]),h=l(h,j,k,g,z,22,b[11]),g=l(g,h,j,k,A,7,b[12]),k=l(k,g,h,j,B,12,b[13]),j=l(j,k,g,h,C,17,b[14]),h=l(h,j,k,g,D,22,b[15]),g=d(g,h,j,k,m,5,b[16]),k=d(k,g,h,j,s,9,b[17]),j=d(j,k,g,h,z,14,b[18]),h=d(h,j,k,g,c,20,b[19]),g=d(g,h,j,k,q,5,b[20]),k=d(k,g,h,j,x,9,b[21]),j=d(j,k,g,h,D,14,b[22]),h=d(h,j,k,g,y,20,b[23]),g=d(g,h,j,k,u,5,b[24]),k=d(k,g,h,j,C,9,b[25]),j=d(j,k,g,h,t,14,b[26]),h=d(h,j,k,g,v,20,b[27]),g=d(g,h,j,k,B,5,b[28]),k=d(k,g,
h,j,f,9,b[29]),j=d(j,k,g,h,w,14,b[30]),h=d(h,j,k,g,A,20,b[31]),g=n(g,h,j,k,q,4,b[32]),k=n(k,g,h,j,v,11,b[33]),j=n(j,k,g,h,z,16,b[34]),h=n(h,j,k,g,C,23,b[35]),g=n(g,h,j,k,m,4,b[36]),k=n(k,g,h,j,y,11,b[37]),j=n(j,k,g,h,w,16,b[38]),h=n(h,j,k,g,x,23,b[39]),g=n(g,h,j,k,B,4,b[40]),k=n(k,g,h,j,c,11,b[41]),j=n(j,k,g,h,t,16,b[42]),h=n(h,j,k,g,s,23,b[43]),g=n(g,h,j,k,u,4,b[44]),k=n(k,g,h,j,A,11,b[45]),j=n(j,k,g,h,D,16,b[46]),h=n(h,j,k,g,f,23,b[47]),g=p(g,h,j,k,c,6,b[48]),k=p(k,g,h,j,w,10,b[49]),j=p(j,k,g,h,
C,15,b[50]),h=p(h,j,k,g,q,21,b[51]),g=p(g,h,j,k,A,6,b[52]),k=p(k,g,h,j,t,10,b[53]),j=p(j,k,g,h,x,15,b[54]),h=p(h,j,k,g,m,21,b[55]),g=p(g,h,j,k,v,6,b[56]),k=p(k,g,h,j,D,10,b[57]),j=p(j,k,g,h,s,15,b[58]),h=p(h,j,k,g,B,21,b[59]),g=p(g,h,j,k,y,6,b[60]),k=p(k,g,h,j,z,10,b[61]),j=p(j,k,g,h,f,15,b[62]),h=p(h,j,k,g,u,21,b[63]);a[0]=a[0]+g|0;a[1]=a[1]+h|0;a[2]=a[2]+j|0;a[3]=a[3]+k|0},_doFinalize:function(){var b=this._data,e=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;e[c>>>5]|=128<<24-c%32;var m=u.floor(a/
4294967296);e[(c+64>>>9<<4)+15]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360;e[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(e.length+1);this._process();b=this._hash;e=b.words;for(a=0;4>a;a++)c=e[a],e[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});s.MD5=v._createHelper(q);s.HmacMD5=v._createHmacHelper(q)})(Math);
(function(){var u=CryptoJS,l=u.lib,d=l.Base,n=l.WordArray,l=u.algo,p=l.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:l.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,l){for(var p=this.cfg,v=p.hasher.create(),b=n.create(),u=b.words,r=p.keySize,p=p.iterations;u.length<r;){e&&v.update(e);var e=v.update(d).finalize(l);v.reset();for(var a=1;a<p;a++)e=v.finalize(e),v.reset();b.concat(e)}b.sigBytes=4*r;return b}});u.EvpKDF=function(d,l,n){return p.create(n).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var l=CryptoJS,d=l.lib,n=d.Base,p=d.WordArray,s=d.BufferedBlockAlgorithm,q=l.enc.Base64,w=l.algo.EvpKDF,v=d.Cipher=s.extend({cfg:n.extend(),createEncryptor:function(m,a){return this.create(this._ENC_XFORM_MODE,m,a)},createDecryptor:function(m,a){return this.create(this._DEC_XFORM_MODE,m,a)},init:function(m,a,b){this.cfg=this.cfg.extend(b);this._xformMode=m;this._key=a;this.reset()},reset:function(){s.reset.call(this);this._doReset()},process:function(a){this._append(a);return this._process()},
finalize:function(a){a&&this._append(a);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(m){return{encrypt:function(f,b,e){return("string"==typeof b?c:a).encrypt(m,f,b,e)},decrypt:function(f,b,e){return("string"==typeof b?c:a).decrypt(m,f,b,e)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=l.mode={},x=function(a,f,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var e=0;e<b;e++)a[f+e]^=
c[e]},r=(d.BlockCipherMode=n.extend({createEncryptor:function(a,f){return this.Encryptor.create(a,f)},createDecryptor:function(a,f){return this.Decryptor.create(a,f)},init:function(a,f){this._cipher=a;this._iv=f}})).extend();r.Encryptor=r.extend({processBlock:function(a,f){var b=this._cipher,c=b.blockSize;x.call(this,a,f,c);b.encryptBlock(a,f);this._prevBlock=a.slice(f,f+c)}});r.Decryptor=r.extend({processBlock:function(a,b){var c=this._cipher,e=c.blockSize,d=a.slice(b,b+e);c.decryptBlock(a,b);x.call(this,
a,b,e);this._prevBlock=d}});b=b.CBC=r;r=(l.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,e=c<<24|c<<16|c<<8|c,d=[],l=0;l<c;l+=4)d.push(e);c=p.create(d,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:r}),reset:function(){v.reset.call(this);var a=this.cfg,c=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var b=a.createEncryptor;else b=a.createDecryptor,this._minBufferSize=1;this._mode=b.call(a,
this,c&&c.words)},_doProcessBlock:function(a,c){this._mode.processBlock(a,c)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var c=this._process(!0)}else c=this._process(!0),a.unpad(c);return c},blockSize:4});var e=d.CipherParams=n.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(l.format={}).OpenSSL={stringify:function(a){var c=a.ciphertext;a=a.salt;return(a?p.create([1398893684,
1701076831]).concat(a).concat(c):c).toString(q)},parse:function(a){a=q.parse(a);var c=a.words;if(1398893684==c[0]&&1701076831==c[1]){var b=p.create(c.slice(2,4));c.splice(0,4);a.sigBytes-=16}return e.create({ciphertext:a,salt:b})}},a=d.SerializableCipher=n.extend({cfg:n.extend({format:b}),encrypt:function(a,c,b,d){d=this.cfg.extend(d);var l=a.createEncryptor(b,d);c=l.finalize(c);l=l.cfg;return e.create({ciphertext:c,key:b,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,c,b,e){e=this.cfg.extend(e);c=this._parse(c,e.format);return a.createDecryptor(b,e).finalize(c.ciphertext)},_parse:function(a,c){return"string"==typeof a?c.parse(a,this):a}}),l=(l.kdf={}).OpenSSL={execute:function(a,c,b,d){d||(d=p.random(8));a=w.create({keySize:c+b}).compute(a,d);b=p.create(a.words.slice(c),4*b);a.sigBytes=4*c;return e.create({key:a,iv:b,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:l}),encrypt:function(c,b,e,d){d=this.cfg.extend(d);e=d.kdf.execute(e,
c.keySize,c.ivSize);d.iv=e.iv;c=a.encrypt.call(this,c,b,e.key,d);c.mixIn(e);return c},decrypt:function(c,b,e,d){d=this.cfg.extend(d);b=this._parse(b,d.format);e=d.kdf.execute(e,c.keySize,c.ivSize,b.salt);d.iv=e.iv;return a.decrypt.call(this,c,b,e.key,d)}})}();
(function(){function u(b,a){var c=(this._lBlock>>>b^this._rBlock)&a;this._rBlock^=c;this._lBlock^=c<<b}function l(b,a){var c=(this._rBlock>>>b^this._lBlock)&a;this._lBlock^=c;this._rBlock^=c<<b}var d=CryptoJS,n=d.lib,p=n.WordArray,n=n.BlockCipher,s=d.algo,q=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],w=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,
55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],v=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],b=[{"0":8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,
2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,
1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{"0":1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,
75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,
276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{"0":260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,
14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,
17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{"0":2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,
98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,
1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{"0":128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,
10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,
83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{"0":268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,
2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{"0":1048576,
16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,
496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{"0":134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,
2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,
2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],x=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],r=s.DES=n.extend({_doReset:function(){for(var b=this._key.words,a=[],c=0;56>c;c++){var d=q[c]-1;a[c]=b[d>>>5]>>>31-d%32&1}b=this._subKeys=[];for(d=0;16>d;d++){for(var f=b[d]=[],l=v[d],c=0;24>c;c++)f[c/6|0]|=a[(w[c]-1+l)%28]<<31-c%6,f[4+(c/6|0)]|=a[28+(w[c+24]-1+l)%28]<<31-c%6;f[0]=f[0]<<1|f[0]>>>31;for(c=1;7>c;c++)f[c]>>>=
4*(c-1)+3;f[7]=f[7]<<5|f[7]>>>27}a=this._invSubKeys=[];for(c=0;16>c;c++)a[c]=b[15-c]},encryptBlock:function(b,a){this._doCryptBlock(b,a,this._subKeys)},decryptBlock:function(b,a){this._doCryptBlock(b,a,this._invSubKeys)},_doCryptBlock:function(e,a,c){this._lBlock=e[a];this._rBlock=e[a+1];u.call(this,4,252645135);u.call(this,16,65535);l.call(this,2,858993459);l.call(this,8,16711935);u.call(this,1,1431655765);for(var d=0;16>d;d++){for(var f=c[d],n=this._lBlock,p=this._rBlock,q=0,r=0;8>r;r++)q|=b[r][((p^
f[r])&x[r])>>>0];this._lBlock=p;this._rBlock=n^q}c=this._lBlock;this._lBlock=this._rBlock;this._rBlock=c;u.call(this,1,1431655765);l.call(this,8,16711935);l.call(this,2,858993459);u.call(this,16,65535);u.call(this,4,252645135);e[a]=this._lBlock;e[a+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});d.DES=n._createHelper(r);s=s.TripleDES=n.extend({_doReset:function(){var b=this._key.words;this._des1=r.createEncryptor(p.create(b.slice(0,2)));this._des2=r.createEncryptor(p.create(b.slice(2,4)));this._des3=
r.createEncryptor(p.create(b.slice(4,6)))},encryptBlock:function(b,a){this._des1.encryptBlock(b,a);this._des2.decryptBlock(b,a);this._des3.encryptBlock(b,a)},decryptBlock:function(b,a){this._des3.decryptBlock(b,a);this._des2.encryptBlock(b,a);this._des1.decryptBlock(b,a)},keySize:6,ivSize:2,blockSize:2});d.TripleDES=n._createHelper(s)})();

return OTHHUrlBuilder;
});

csui.define('csui/models/expandable',['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function ExpandableModel(ParentModel) {
    var prototype = {

      makeExpandable: function (options) {
        // log.warn('Module "csui/models/expandable" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/expandable/expandable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        var expand = options && options.expand;
        if (typeof expand === 'string') {
          expand = expand.split(',');
        }
        this.expand = expand || [];
        return this;
      },

      setExpand: function (name) {
        if (!_.isArray(name)) {
          name = name.split(",");
        }
        _.each(name, function (name) {
          if (!_.contains(this.expand, name)) {
            this.expand.push(name);
          }
        }, this);
      },

      resetExpand: function (name) {
        if (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            var index = _.indexOf(this.expand, name);
            if (index >= 0) {
              this.expand.splice(index, 1);
            }
          }, this);
        } else {
          this.expand = [];
        }
      },

      getExpandableResourcesUrlQuery: function () {
        return {expand: this.expand};
      }

    };
    prototype.Expandable = _.clone(prototype);

    return prototype;
  }

  return ExpandableModel;

});


csui.define('css!csui/widgets/navigation.header/impl/navigation.header.controls',[],function(){});
csui.define('csui/widgets/navigation.header/navigation.header.controls',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'css!csui/widgets/navigation.header/impl/navigation.header.controls'
], function (module, _, Backbone) {
  'use strict';

  var config = module.config();

  var logo = new Backbone.Model(_.extend({
    location: 'center'
  }, config.logo));

  var leftSide = new Backbone.Collection([
    {
      id: 'csui/widgets/navigation.header/controls/help/help.view',
      sequence: 100,
      parentClassName: 'csui-help'
    },
    {
      id: 'csui/widgets/navigation.header/controls/home/home.view',
      sequence: 200,
      parentClassName: 'csui-home-item'
    },
    {
      id: 'csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',
      sequence: 300,
      parentClassName: 'tile-breadcrumb'
    }
  ], {
    comparator: 'sequence'
  });

  var rightSide = new Backbone.Collection([
    {
      id: 'csui/widgets/navigation.header/controls/progressbar.maximize/progressbar.maximize.view',
      sequence: 100,
      parentClassName: 'csui-progressbar-maximize'
    },
    {
      id: 'csui/widgets/navigation.header/controls/search/search.view',
      sequence: 100,
      parentClassName: 'csui-search'
    },
    {
      id: 'csui/widgets/navigation.header/controls/favorites/favorites.view',
      sequence: 200,
      parentClassName: 'csui-favorites'
    },
    {
      id: 'csui/widgets/navigation.header/controls/user.profile/user.profile.view',
      sequence: 300,
      parentClassName: 'csui-profile'
    }
  ], {
    comparator: 'sequence'
  });

  var masks = _.reduce(_.values(config.masks || {}), function (result, mask) {
    return {
      blacklist: result.blacklist.concat(mask.blacklist || []),
      whitelist: result.whitelist.concat(mask.whitelist || [])
    };
  }, {
    blacklist: [],
    whitelist: []
  });
  masks = {
    blacklist: _.unique(masks.blacklist),
    whitelist: _.unique(masks.whitelist)
  };

  function filterComponentByMask(component) {
    return !_.contains(masks.blacklist, component.id) &&
           (!masks.whitelist.length ||
            _.contains(masks.whitelist, component.id));
  }

  leftSide.remove(leftSide.reject(filterComponentByMask));
  rightSide.remove(rightSide.reject(filterComponentByMask));

  return {
    logo: logo,
    leftSide: leftSide,
    rightSide: rightSide
  };
});


/* START_TEMPLATE */
csui.define('hbs!csui/pages/start/impl/navigationheader/impl/navigationheader',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-global-message\"></div>\r\n<nav class=\"csui-navbar binf-navbar binf-navbar-default zero-gutter\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.mainNavigationAria || (depth0 != null ? depth0.mainNavigationAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mainNavigationAria","hash":{}}) : helper)))
    + "\">\r\n  <div class=\"binf-container-fluid\" role=\"menubar\">\r\n    <span class=\"binf-navbar-brand binf-collapse binf-navbar-collapse\">\r\n      <span class=\"csui-logo binf-hidden-xs\">\r\n        <span class=\"csui-logo-image\"></span>\r\n      </span>\r\n    </span>\r\n    <div class=\"binf-nav binf-navbar-nav binf-navbar-left\"></div>\r\n    <div class=\"binf-nav binf-navbar-nav binf-navbar-right\" ></div>\r\n    <div class=\"binf-nav binf-navbar-nav csui-navbar-message\"></div>\r\n  </div>\r\n</nav>\r\n";
}});
Handlebars.registerPartial('csui_pages_start_impl_navigationheader_impl_navigationheader', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/pages/start/impl/navigationheader/impl/navigationheader',[],function(){});
csui.define('csui/pages/start/impl/navigationheader/navigationheader.view',[
  'require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/globalmessage/globalmessage',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/navigation.header/navigation.header.controls',
  'hbs!csui/pages/start/impl/navigationheader/impl/navigationheader',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!csui/pages/start/impl/navigationheader/impl/navigationheader',
  'csui/lib/jquery.when.all'
], function (require, module, _, $, Backbone, Marionette, GlobalMessage,
    LayoutViewEventsPropagationMixin, controls, template, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    enableMinimiseButtonOnProgressPanel: true
  });

  var NavigationHeaderView = Marionette.LayoutView.extend({
    template: template,

    regions: {
      messageRegion: '.csui-navbar-message'
    },

    ui: {
      branding: '.binf-navbar-brand',
      logo: '.csui-logo',
      left: '.binf-navbar-left',
      right: '.binf-navbar-right'
    },

    templateHelpers: function() {
      return {
        mainNavigationAria: lang.mainNavigationAria
      };
    },

    constructor: function NavigationHeaderView(options) {
      Marionette.LayoutView.call(this, options);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var context = this.options.context,
          self = this;

      GlobalMessage.setMessageRegionView(this, {
        classes: "csui-global-message", 
        enableMinimiseButtonOnProgressPanel: config.enableMinimiseButtonOnProgressPanel
      });

      var logoLocation = controls.logo.get('location');
      if (logoLocation === 'none') {
        this.ui.logo.addClass('binf-hidden');
      } else {
        this.ui.branding.addClass('csui-logo-' + logoLocation);
      }

      this._resolveComponents()
          .done(function () {
            self.trigger('before:render:controls', self);
            controls.leftSide.each(createControls.bind(self, self.ui.left));
            controls.rightSide.each(createControls.bind(self, self.ui.right));
            self.trigger('render:controls', self);
          });

      function createControls(target, control) {
        var View = control.get('view');
        if (View) {
          var el = $('<div>').addClass(control.get('parentClassName'))
                            .appendTo(target).attr('role', 'menuitem'),
              region = self.addRegion(_.uniqueId('csui:navigation.header.control'), {selector: el}),
              view = new View({
                context: context,
                parentView: self
              });
          region.show(view);
        }
      }
    },

    _resolveComponents: function () {
      if (this._controlsResolved) {
        return this._controlsResolved;
      }

      function resolveControl(name) {
        var deferred = $.Deferred();
        require([name], deferred.resolve, deferred.reject);
        return deferred.promise();
      }

      var allComponents = controls.leftSide.models.concat(controls.rightSide.models),
          promises = allComponents.map(function (control) {
                                    return resolveControl(control.id);
                                  }),
          deferred = $.Deferred();
      $.whenAll.apply($, promises)
               .always(function (views) {
                 views.forEach(function (view, index) {
                   allComponents[index].set('view', view);
                 });
                 deferred.resolve();
               });
      this._controlsResolved = deferred.promise();
      return this._controlsResolved;
    }
  });

  _.extend(NavigationHeaderView.prototype, LayoutViewEventsPropagationMixin);

  return NavigationHeaderView;
});


csui.define('css!csui/pages/start/impl/start.page',[],function(){});
// Places navigation bar and the perspective pane to the page body
csui.define('csui/pages/start/start.page.view',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/routing',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/connector',
  'csui/pages/start/perspective.routing', 'csui/utils/base',
  'csui/pages/start/impl/navigationheader/navigationheader.view',
  'csui/controls/perspective.panel/perspective.panel.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/non-attaching.region/non-attaching.region',
  'csui/utils/page.leaving.blocker', 'csui/controls/iconpreload/icon.preload.view',
  'css!csui/pages/start/impl/start.page'
], function (module, _, $, Marionette, routing,
    PerspectiveContext, ConnectorFactory,
    PerspectiveRouting, base, NavigationHeaderView, PerspectivePanelView,
    ViewEventsPropagationMixin, TabablesBehavior, TabableRegionBehavior, NonEmptyingRegion,
    NonAttachingRegion, PageLeavingBlocker, IconPreloadView) {

  var config = _.extend({
    signInPageUrl: 'signin.html',
    redirectToSignInPage: !routing.routesWithSlashes()
  }, module.config());

  var StartPageView = Marionette.ItemView.extend({

    template: false,

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior
      }
    },

    constructor: function StartPageView(options) {
      options || (options = {});
      options.el = document.body;

      Marionette.View.prototype.constructor.call(this, options);

      // Create application context for this page
      var context   = new PerspectiveContext(),
          connector = context.getObject(ConnectorFactory);

      // Check if the page has authentication information
      // Use Basic Authentication (known credentials)
      if (!connector.connection.credentials &&
          // Use pre-authenticated session (session.ticket)
          !connector.authenticator.isAuthenticated() &&
          // Try pre-authenticated session from session storage
          !connector.authenticator.syncStorage().isAuthenticated() &&
          // Try pre-authenticated session from session storage
          !connector.authenticator.interactive) {
        this._navigateToSignIn();
        return;
      }

      // If some call fails with an expired session, redirect to sign-in
      connector.authenticator.on('loggedOut', function (args) {
        // User's intentional logging out is followed by a redirect to the
        // logout page; do not change the location here too.
        if (args.reason === 'failed') {
          this._navigateToSignIn();
        }
        context.viewStateModel && context.viewStateModel.clean();
      }, this);

      // Create child views
      this.navigationHeader = new NavigationHeaderView({
        context: context,
        signInPageUrl: this.options.signInPageUrl
      });

      this.context = context;

      this.perspectivePanel = new PerspectivePanelView({
        context: context
      });

      this.propagateEventsToViews(this.navigationHeader, this.perspectivePanel);

      var routing = PerspectiveRouting.getInstance({
        context: context
      });
      // Initialize URL routing and fetch the first perspective
      routing.start();

      // Namespace for binf widgets
      this.$el.addClass('binf-widgets');

      // Enable styling workarounds for Safari on iPad.  We might want to
      // put them to a separate CSS file loaded dynamically, instead of
      // having them in the same file identified by this class, if the size
      // of the workaround styles grows too much.
      if (base.isAppleMobile()) {
        this.$el.addClass('csui-on-ipad');
      }

      // Workaround for the back-forward cache in Safari, which ignores the
      // no-store cache control flag and loads the page from cache, when the
      // back button is clicked.  As long as logging out does not invalidate
      // the LLCookie/OTCSTicket and we write the ticket to the /app, going
      // back would allow the logged-out user working with the REST API again.
      //
      // http://madhatted.com/2013/6/16/you-do-not-understand-browser-history
      // http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/
      $(window).on('unload', function () {});
    },

    onRender: function () {
      if (this._redirecting) {
        return this;
      }

      IconPreloadView.ensureOnThePage();

      this._appendView(this.navigationHeader);
      $(this.$el.children()[0]).attr('role', 'banner');
      this._appendView(this.perspectivePanel);
      $(this.$el.children()[2]).attr('role', 'main');

      // Do not send showing events before triggering the first render event
      setTimeout(_.bind(function () {
        var bodyRegion = new NonAttachingRegion({el: this.el});
        bodyRegion.show(this, {render: false});
      }, this));

      // Listen to global message show event to make it tababable.
      // Note: Doing it from here since messagepanel.view is bundled with csui-data
      this.$el.on('globalmessage.shown', function (event, view) {
        var messageTabable = new TabableRegionBehavior(view.options, view);
      });
    },

    onBeforeDestroy: function () {
      this.navigationHeader && this.navigationHeader.destroy();
      this.perspectivePanel && this.perspectivePanel.destroy();
    },

    _appendView: function (view) {
      var region = new NonEmptyingRegion({el: this.el});
      region.show(view);
    },

    _navigateToSignIn: function () {
      // The development HTML pages do not use OTDS login page
      if (!config.redirectToSignInPage) {
        // If the session expires or is not available, reload the /app page;
        // authentication should be performed by the server redirecting to
        // the OTDS login page
        PageLeavingBlocker.forceDisable();
        location.reload();
      } else {
        var signInPageUrl = this.options.signInPageUrl || config.signInPageUrl,
            query         = location.search;
        query += query ? '&' : '?';
        query += 'nextUrl=' + encodeURIComponent(location.pathname);
        location.href = signInPageUrl + query + location.hash;
      }
      // The REST of the view rendering continues, until the context
      // is switched, and the page would quickly show its content
      // before the location change finally kicks in.
      // before the location change finally kicks in.
      this._redirecting = true;
    }

  });

  _.extend(StartPageView.prototype, ViewEventsPropagationMixin);

  return StartPageView;

});

csui.define('csui/widgets/navigation.header/controls/help/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/help/impl/nls/root/localized.strings',{
  HelpIconTitle: 'Help',
  HelpIconAria: 'Help pages'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/help/impl/help',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"icon-help\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_help_impl_help', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/navigation.header/controls/help/help.view',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/help/impl/nls/localized.strings',
  'i18n', 'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/server.module/server.module.collection', 'csui/lib/othelp',
  'hbs!csui/widgets/navigation.header/controls/help/impl/help'
], function (module, _, $, Marionette, localizedStrings, i18n, TabableRegionBehavior,
    ServerModuleCollection, OTHHUrlBuilder, template) {
  'use strict';

  // Read configuration from the original place for compatibility.
  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/pages/start/impl/navigationheader/navigationheader.view'] || {};
  _.extend(config, module.config());
  config.help || (config.help = {});
  _.defaults(config.help, {
    language: i18n.settings.locale.replace(/[-_]\w+$/, ''),
    preserve: true
  });

  //Make sure the value provide by CS is not an empty string.
  //The othhURLBuilder does not account for empty strings, only
  //undefined values.
  if (config.help.urlRoot === '') {
    config.help.urlRoot = undefined;
  }
  if (config.help.tenant === '') {
    config.help.tenant = undefined;
  }
  if (config.help.type === '') {
    config.help.type = undefined;
  }

  var HelpView = Marionette.ItemView.extend({
    tagName: 'a',

    attributes: {
      href: '#',
      title: localizedStrings.HelpIconTitle,
      'aria-label': localizedStrings.HelpIconAria
    },

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.HelpIconTitle
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 50
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function HelpView(options) {
      Marionette.ItemView.call(this, options);
      this.listenTo(this, 'click:help', this._onClick);
    },

    onRender: function () {
      var self = this;
      this.$el.on('click', function () {
        self.triggerMethod('click:help');
      });
      this.$el.on('keydown', function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
          self.triggerMethod('click:help');
        }
      });
    },

    _onClick: function () {
      var serverModules = new ServerModuleCollection();

      serverModules
          .fetch()
          .then(function () {
            var modulesWithHelp;
            var urlBuilder;
            var documentsOptions;
            var helpURL;
            var browserTab;

            modulesWithHelp = serverModules.filter(function (serverModule) {
              return !!serverModule.get('helpDocId');
            });

            urlBuilder = new OTHHUrlBuilder({
              urlRoot: config.help.urlRoot
            });

            documentsOptions = {
              preserve: config.help.preserve,
              documents: []
            };
            _.each(modulesWithHelp, function (serverModule, index) {
              var currmodule = serverModule.get('helpDocId');
              documentsOptions.documents.push({
                module: currmodule,
                active: (index === 0),
                topic: (currmodule.indexOf('cssui') === 0 ? 'sui-overview-bg' : undefined)
              });
            });

            helpURL = urlBuilder.buildHelpUrl(config.help.language,
                documentsOptions, {
                  tenant: config.help.tenant,
                  type: config.help.type,
                  options: { search: 'allModules' }
            });

            browserTab = window.open(helpURL, '_blank');
            browserTab.focus();
	}, function (error) {
		console.error(error);
	});
    }
  });

  return HelpView;
});

csui.define('csui/widgets/navigation.header/controls/home/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/home/impl/nls/root/localized.strings',{
  HomeIconTitle: 'Home',
  HomeIconAria: 'Home page'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/home/impl/home',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-icon-home\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_home_impl_home', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/navigation.header/controls/home/home.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/home/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/application.scope.factory',
  'hbs!csui/widgets/navigation.header/controls/home/impl/home'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior,
    ApplicationScopeModelFactory, template) {
  'use strict';

  var HomeView = Marionette.ItemView.extend({
    tagName: 'a',

    className: 'csui-home binf-hidden',

    attributes: {
      href: '#',
      title: localizedStrings.HomeIconTitle,
      'aria-label': localizedStrings.HomeIconAria
    },

    ui: {
      homeButton: '.csui-icon-home'
    },

    events: {
      'click .csui-icon-home': 'onClickHomeIcon'
    },

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.HomeIconTitle
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function HomeView(options) {
      Marionette.ItemView.call(this, options);
      this.listenTo(options.context, 'sync error', this._toggleVisibility);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this, 'click:home', this._onClick);
    },

    onRender: function () {
      var self = this;
      this.$el.on('click', function () {
        self.triggerMethod('click:home');
      });
      this.$el.on('keydown', function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
          self.triggerMethod('click:home');
        }
      });

    },

    onClickHomeIcon: function (e) {
      e.preventDefault();
    },

    _toggleVisibility: function () {
      if (this._isRendered) {
        // Detect the user landing page.
        if (!this.applicationScope.id) {
          this.$el.addClass('binf-hidden');
        } else {
          this.$el.removeClass('binf-hidden');
        }
      }
    },

    _onClick: function () {
      this.applicationScope.set('id', '');
    }
  });

  return HomeView;
});

csui.define('csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/root/localized.strings',{
  ShowBreadcrumbs: 'Show Breadcrumbs',
  HideBreadcrumbs: 'Hide Breadcrumbs'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<button type=\"button\" class=\"binf-btn csui-breadcrumb-handle-caret caret-show-breadcrumb\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showBreadcrumbsAria || (depth0 != null ? depth0.showBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showBreadcrumbsAria","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"csui-button-icon icon-expandArrowDown\"></span>\r\n</button>\r\n<button type=\"button\" class=\"binf-btn csui-breadcrumb-handle-caret caret-hide-breadcrumb\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.hideBreadcrumbsAria || (depth0 != null ? depth0.hideBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideBreadcrumbsAria","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"csui-button-icon icon-expandArrowUp\"></span>\r\n</button>\r\n<button type=\"button\" class=\"binf-btn binf-btn-default csui-breadcrumb-handle-btn\r\nbtn-show-breadcrumb\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showBreadcrumbsAria || (depth0 != null ? depth0.showBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showBreadcrumbsAria","hash":{}}) : helper)))
    + "\" aria-pressed=\"false\">\r\n  <span class=\"csui-button-icon icon-expandArrowDown\"></span> "
    + this.escapeExpression(((helper = (helper = helpers.showBreadcrumbs || (depth0 != null ? depth0.showBreadcrumbs : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showBreadcrumbs","hash":{}}) : helper)))
    + "\r\n</button>\r\n<button type=\"button\" class=\"binf-btn binf-btn-default csui-breadcrumb-handle-btn\r\nbtn-hide-breadcrumb\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.hideBreadcrumbsAria || (depth0 != null ? depth0.hideBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideBreadcrumbsAria","hash":{}}) : helper)))
    + "\" aria-pressed=\"true\">\r\n  <span class=\"csui-button-icon icon-expandArrowUp\"></span> "
    + this.escapeExpression(((helper = (helper = helpers.hideBreadcrumbs || (depth0 != null ? depth0.hideBreadcrumbs : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideBreadcrumbs","hash":{}}) : helper)))
    + "\r\n</button>\r\n";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_breadcrumbs_impl_breadcrumbs', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs',[],function(){});
csui.define('csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/application.scope.factory',
  'hbs!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs',
  'css!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior,
    AncestorCollectionFactory, ApplicationScopeModelFactory,
    template) {
  'use strict';

  var BreadcrumbsView = Marionette.ItemView.extend({
    tagName: 'div',

    className: 'breadcrumbs-handle',

    ui: {
      caretShowBreadcrumbs: '.caret-show-breadcrumb',
      btnShowBreadcrumbs: '.btn-show-breadcrumb',
      caretHideBreadcrumbs: '.caret-hide-breadcrumb',
      btnHideBreadcrumbs: '.btn-hide-breadcrumb'
    },

    serializeData: function () {
      return {
        showBreadcrumbs: localizedStrings.ShowBreadcrumbs,
        showBreadcrumbsAria: localizedStrings.ShowBreadcrumbs,
        hideBreadcrumbs: localizedStrings.HideBreadcrumbs,
        hideBreadcrumbsAria: localizedStrings.HideBreadcrumbs
      };
    },

    template: template,

    events: {
      'keydown': 'onKeyInView',
      'click @ui.caretShowBreadcrumbs': '_showBreadcrumbs',
      'click @ui.btnShowBreadcrumbs': '_showBreadcrumbs',
      'click @ui.caretHideBreadcrumbs': '_hideBreadcrumbs',
      'click @ui.btnHideBreadcrumbs': '_hideBreadcrumbs'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (this._breadcrumbsVisible) {
        return this.$el;
      }
      return undefined;
    },
    
    onRender: function () {
      if (matchMedia) {
        this._mq = window.matchMedia("(max-width: 1024px)");
        this._mq.addListener(_.bind(this._windowsWidthChange, this));
        this._windowsWidthChange(this._mq);
      }
    },
    
    constructor: function BreadcrumbsView(options) {
      Marionette.ItemView.call(this, options);

      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:breadcrumbsVisible',
          this._breadcrumbVisibilityChanged);
      this.listenTo(this.applicationScope, 'change:breadcrumbsAvailable',
          this._breadcrumbAvailabilityChanged);
      this._breadcrumbVisibilityChanged();
      this._breadcrumbAvailabilityChanged();
    },

    _breadcrumbVisibilityChanged: function () {
      this._breadcrumbsVisible = this.applicationScope.get('breadcrumbsVisible');
      if (this._breadcrumbsVisible) {
        this.$el.removeClass('csui-breadcrumbs-hidden');
        this.triggerMethod('refresh:tabindexes');
      } else {
        this.$el.addClass('csui-breadcrumbs-hidden');
      }
    },

    _breadcrumbAvailabilityChanged: function () {
      this._breadcrumbsAvailable = this.applicationScope.get('breadcrumbsAvailable');
      if (this._breadcrumbsAvailable) {
        this.$el.removeClass('csui-breadcrumbs-not-available');
        this.triggerMethod('refresh:tabindexes');
      } else {
        this.$el.addClass('csui-breadcrumbs-not-available');
      }
    },

    _showBreadcrumbs: function () {
      this.applicationScope.set('breadcrumbsVisible', true);
    },

    _hideBreadcrumbs: function () {
      this.applicationScope.set('breadcrumbsVisible', false);
    },

    _windowsWidthChange: function(mq) {
      if (mq.matches) {
        this._previousBreadcrumbState =  this.applicationScope.get('breadcrumbsVisible');
        this.applicationScope.set('breadcrumbsVisible', true);
      } else {
        this.applicationScope.set('breadcrumbsVisible', this._previousBreadcrumbState);
      }  
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 9:
        // tab
        this.ignoreFocusBlur = false;
        break;
      case 13:
      case 32:
        // enter or space key
        this.ignoreFocusBlur = false;
        this.applicationScope.set('breadcrumbsVisible', !this._breadcrumbsVisible);
        break;
      }
    }

  });

  return BreadcrumbsView;
});

csui.define('csui/widgets/search.box/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.box/impl/nls/root/lang',{
  placeholder: 'Search',
  clearerTitle: 'Clear keywords',
  searchBoxTitle: 'Enter your search term',
  searchOptionsTitle: 'Show search options',
  searchOptionsHideTitle: 'Hide search options',
  searchFromHere: 'Search from here',
  searchIconTitle: 'Search',
  searchIconAria: 'Search in Content Server',
  searchOptionTooltip: 'Select: {0}',
  startSearch: 'Start search',
  searchLandmarkAria: 'Global content search'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.box/impl/search.box',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button type=\"button\" class=\"icon-expandArrowDown csui-search-box-slice-popover\"\r\n              data-binf-toggle=\"popover\" data-placement=\"bottom\"\r\n              title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchOptionsTitle : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchOptionsTitle : stack1), depth0))
    + "\"\r\n              aria-haspopup=\"true\" aria-expanded=\"false\"></button>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "        <div class=\"csui-search-options-dropdown binf-hidden\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"search-bar\" role=\"dialog\">\r\n  <div class=\"search-bar-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.showOptionsDropDown : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    <div class=\"csui-search-input-container\">\r\n      <input type=\"search\" class=\"csui-input\" placeholder=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"\r\n             title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBoxTitle : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBoxTitle : stack1), depth0))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.showOptionsDropDown : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n    <span class=\"csui-clearer formfield_clear\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.clearerTitle : stack1), depth0))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.clearerTitle : stack1), depth0))
    + "\" role=\"button\"></span>\r\n  </div>\r\n</div>\r\n<div role=\"search\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchLandmarkAria : stack1), depth0))
    + "\" class=\"search-icon\">\r\n  <a href=\"javascript:void(0);\"\r\n     class=\"icon icon-global-search icon-header-search csui-header-search-icon csui-acc-focusable\"\r\n     title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchIconTitle : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchIconAria : stack1), depth0))
    + "\"\r\n     aria-expanded=\"false\"></a>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_search.box_impl_search.box', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.box/impl/search.slices.popover',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "    <div class=\"csui-search-popover-row\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceTooltip : depth0), depth0))
    + "\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\">\r\n      <div class=\"csui-search-popover-row-body\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\">\r\n        <div class=\"csui-search-popover-checked\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\" id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\"></div>\r\n        <div class=\"csui-search-popover-label\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceDisplayName : depth0), depth0))
    + "</div>\r\n      </div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-search-slice-container\" role=\"radiogroup\">\r\n  <div class=\"csui-search-slice-container-first\" role=\"presentation\"></div>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.slices : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <div class=\"csui-search-slice-container-last\" role=\"presentation\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.box_impl_search.slices.popover', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.box/impl/search.slice.dropdown',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " icon-checkbox-selected ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-selected-checkbox csui-slice-checkbox csui-checkbox-primary\">\r\n  <input type=\"checkbox\" "
    + this.escapeExpression(((helper = (helper = helpers.checked || (depth0 != null ? depth0.checked : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"checked","hash":{}}) : helper)))
    + " class=\"csui-searchbox-option\" name=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeId : depth0), depth0))
    + "\" id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeIdSO : depth0), depth0))
    + "\"\r\n         value=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeId : depth0), depth0))
    + "\">\r\n  <label class=\"csui-search-slice-name csui-selectlabel\" for=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeIdSO : depth0), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.fromHere : depth0), depth0))
    + " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeName : depth0), depth0))
    + "\">\r\n          <span role=\"checkbox\" aria-checked=\"true\" class=\"csui-control\">\r\n            <span class=\"csui-icon icon-checkbox"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.checked : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\"></span>\r\n          </span>\r\n          <span class=\"cs-ellipsis\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.fromHere : depth0), depth0))
    + " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeName : depth0), depth0))
    + "</span>\r\n  </label>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.box_impl_search.slice.dropdown', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/search.box/impl/search.box',[],function(){});
csui.define('csui/widgets/search.box/search.box.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/models/node/node.model', 'csui/utils/contexts/factories/search.box.factory',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/widgets/search.box/impl/nls/lang',
  'csui/utils/namedsessionstorage',
  'hbs!csui/widgets/search.box/impl/search.box',
  'hbs!csui/widgets/search.box/impl/search.slices.popover',
  'hbs!csui/widgets/search.box/impl/search.slice.dropdown', 'i18n', 'csui/utils/base',
  'css!csui/widgets/search.box/impl/search.box',
  'csui/lib/jquery.ui/js/jquery-ui', 'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, NodeModel, SearchBoxFactory,
    SearchQueryModelFactory, ApplicationScopeModelFactory, TabableRegionBehavior, lang,
    NamedSessionStorage, template,
    SlicePopOverTemplate, SliceDropDownTemplate, i18n, base) {
  "use strict";

  var config = _.defaults({}, module.config(), {
    showOptionsDropDown: true,
    showSearchInput: false,
    showInput: false,
    inputValue: '',
    slice: '',
    nodeId: '',
    nodeName: '',
    searchFromHere: true,
    customSearchIconClass: "icon-header-search",
    customSearchIconNoHoverClass: "icon-header-search-nohover",
    customSearchIconEnabledClass: "icon-header-search_enabled"
  });

  var SearchBoxView = Marionette.ItemView.extend({
    className: 'csui-search-box',
    template: template,
    templateHelpers: function () {
      var messages = {
        showOptionsDropDown: this.options.data.showOptionsDropDown,
        placeholder: this.options.data.placeholder || lang.placeholder,
        clearerTitle: lang.clearerTitle,
        searchIconTitle: lang.searchIconTitle,
        searchIconAria: lang.searchIconAria,
        searchBoxTitle: lang.searchBoxTitle,
        searchOptionsTitle: lang.searchOptionsTitle,
        startSearch: lang.startSearch,
        searchLandmarkAria: lang.searchLandmarkAria
      };
      return {
        messages: messages
      };
    },
    slicePopOverTemplate: SlicePopOverTemplate,
    sliceDropDownTemplate: SliceDropDownTemplate,
    namedSessionStorage: new NamedSessionStorage(),
    ui: {
      input: '.csui-input',
      clearer: '.csui-clearer',
      searchIcon: '.csui-header-search-icon',
      downCaret: '.csui-search-box-slice-popover',
      dropDown: '.csui-search-options-dropdown'
    },
    events: {
      'click @ui.searchIcon': 'searchIconClicked',
      'keydown .csui-header-search-icon': 'searchIconKeyPressed',
      'click @ui.input': 'hidePopover',
      'keydown @ui.input': 'inputTyped',
      'keyup @ui.input': 'inputChanged',
      'paste @ui.input': 'inputChanged',
      'change @ui.input': 'inputChanged',
      'click @ui.clearer': 'clearerClicked',
      'keydown @ui.clearer': 'keyDownOnClear',
      'click .csui-search-popover-row': 'setSlices',
      'click .csui-searchbox-option': 'selectSearchOption',
      'click .csui-search-box-slice-popover': 'prepareSlicepopover',
      'focusout .csui-search-box-slice-popover': 'focusOutSlicePopover',
      'keydown .csui-search-box-slice-popover': 'accessibility',
      'keydown .csui-search-popover-row': 'accessibility',
      'focusout @ui.input': 'hideSearchOptionsDropDown',
      'focusout .csui-search-popover-row': 'focusOutSlicePopoverRow',
      'mouseup .csui-search-popover-row': 'togglePopover',
      'touchend .csui-search-popover-row': 'togglePopover',
      'focusout .csui-searchbox-option': 'hideSearchOptionsDropDown',
      'mouseleave @ui.dropDown': 'hideSearchOptionsDropDown'
    },

    currentlyFocusedElement: 'a.csui-acc-focusable',

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function SearchBoxView(options) {
      options || (options = {});
      options.data = _.defaults({}, options.data, config);
      this.direction = i18n.settings.rtl ? 'left' : 'right';

      var context = options.context;
      if (!options.model) {
        options.model = context.getModel(SearchQueryModelFactory);
      }
      this.applicationScope = context.getModel(ApplicationScopeModelFactory);

      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'change:where', this._updateInput);
      if (this.options.data.showOptionsDropDown) {
        // Enable pre-fetching from /app, which sets the initial
        // response via the context model factory.
        this.searchBoxFactory = context.getFactory(SearchBoxFactory);
        this.searchboxModel = this.searchBoxFactory.property;
        this.listenTo(context, 'sync:perspective', this._perspectiveSynced);
        this.listenTo(context, 'sync error', this._dataSynced);
        this.listenTo(context, 'change:current:node', this._currentNodeChanged);
        this.listenTo(this.searchboxModel, "change", this.prepareSlicepopover);
        this.listenTo(this.searchboxModel, "change", this.prepareOptionsdropdown);
        this.listenTo(this.searchboxModel, "change", this.searchIconToggle);
      }
      if (!!this.model.get("where") || this.options.data.showSearchInput) {
        $(document).on('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      }
      $(document).on('keydown.' + this.cid, this, this._shortcutToQuery);
    },

    _shortcutToQuery: function (event) {
      // CTRL+F3: shortcut to Query/Search
      if (event.ctrlKey && event.keyCode == 114) {
        var self = event.data;
        if (self.isSearchInputVisible()) {
          self.ui.input.trigger('focus');
        } else {
          self.searchIconClicked();
        }
      }
    },

    onBeforeDestroy: function () {
      $(document).off('click.' + this.cid).off('keydown.' + this.cid);
    },

    isSearchbarVisible: function () {
      return this.$('.search-bar').is(':visible');
    },

    isSearchInputVisible: function () {
      return this.$('.csui-input').is(':visible');
    },

    focusOutSlicePopover: function (event) {
      if (this.$(".binf-popover").find(event.relatedTarget).length === 0) {
        this.$el.find('.csui-search-box-slice-popover').binf_popover('hide');
      }
      this.toggleIcon(event);
    },

    focusOutSlicePopoverRow: function (event) {
      if (this.$(".binf-popover").find(event.relatedTarget).length === 0) {
        if (event.relatedTarget &&
            !event.relatedTarget.classList.contains("csui-search-box-slice-popover")) {
          this.$el.find('.csui-search-box-slice-popover').binf_popover('hide');
        }
      }
    },

    _perspectiveSynced: function (context, perspectiveSource) {
      this._currentNodeChanged(perspectiveSource);
    },

    _currentNodeChanged: function (currentNode) {
      if (currentNode instanceof NodeModel &&
          currentNode.get('container')) {
        this.searchboxModel.nodeId = currentNode.get('id');
        this.searchboxModel.nodeName = currentNode.get('name');
        this.namedSessionStorage.set(this.searchboxModel.nodeId, this.searchboxModel.nodeName);
        this.searchboxModel.trigger("change");
      } else {
        this.searchboxModel.nodeId = undefined;
        this.searchboxModel.nodeName = undefined;
        this.searchboxModel.trigger("change");
      }
    },

    _dataSynced: function (context, perspectiveSource) {
      if (!this.searchboxModel.fetched) {
        this.searchBoxFactory.fetch();
      }
    },

    onRender: function (event) {
      if (this.options.data.showSearchInput) {
        this.$el.find(".search-bar").show();
        this.searchIconToggle();
      }
      var value = this.options.data.inputValue || this.model.get('where');
      this.slice = this.options.data.slice || this.model.get('slice');
      if (value) {
        this._setInputValue(value);
        this.$el.find(".search-bar").show();
      }
      if (this.options.data.showInput || value) {
        this.triggerMethod('before:show:input', this);
        this.ui.input.show();
        this.triggerMethod('show:input', this);
      }

      if (event && event.data) {
        this.$el.find('.csui-search-box .csui-header-search-icon').removeClass(
            event.data.options.data.customSearchIconEnabledClass).addClass(
            event.data.options.data.customSearchIconClass);
      }

    },

    prepareSlicepopover: function (e) {
      if (this.options.data.showOptionsDropDown) {
        if (this.searchboxModel.attributes.slices) {
          for (var slice in this.searchboxModel.attributes.slices) {
            if (this.searchboxModel.attributes.slices.hasOwnProperty(slice)) {
              var sliceDisplayName = this.searchboxModel.attributes.slices[slice].sliceDisplayName;
              this.searchboxModel.attributes.slices[slice].sliceTooltip = _.str.sformat(lang.searchOptionTooltip, sliceDisplayName);
            }
          }
          this.$el.find('.csui-search-box-slice-popover').binf_popover({
            content: this.slicePopOverTemplate(this.searchboxModel.attributes),
            html: true
          });
          var titleVal = this.$el.find('.csui-search-box-slice-popover').attr('data-original-title');
          if (!titleVal) { // TODO why is this needed to get a stable title? There is a data-binf-original-title used in esoc code...
            titleVal = lang.searchOptionsTitle;
          }
          this.$el.find('.csui-search-box-slice-popover').attr('title', titleVal);
          if (!this.slice && this.options.model && this.options.model.get("slice")) {
            this.slice = this.options.model.get("slice");
            this.options.sliceString = this.slice;
          }
          if (this.slice) {
            this._setSliceValue(this.slice);
          }
        }
        if ($('.search-bar').is(':visible')) {
          $(".binf-navbar-brand").removeClass("binf-navbar-collapse");
        }
      }
      this.toggleIcon(e); //toggle the 'downcart' based on if popover is open or not.

    },

    toggleIcon: function (e, isToggle) {
      if (!!e && e.type === "click" && this.ui.downCaret.hasClass('dropup') ||
          (!!e && e.type === "focusout" &&
           this.$(".binf-popover").find(e.relatedTarget).length === 0) || !!isToggle) {//handle click and focusout.
        this.ui.downCaret.removeClass('dropup');
        this.ui.downCaret.attr('aria-expanded', 'false');
        this.ui.downCaret.attr('title', lang.searchOptionsTitle);
      } else if ($('.search-bar-content .binf-popover').is(":visible")) {
        this.ui.downCaret.addClass('dropup');
        this.ui.downCaret.attr('aria-expanded', 'true');
        this.ui.downCaret.attr('title', lang.searchOptionsHideTitle);
      }
    },

    accessibility: function (event) {
      var e     = this.$el.find('.csui-search-slice-container'),
          elms  = e.children('.csui-search-popover-row'),
          index = elms.index(elms.filter('.active'));

      if (event.keyCode === 13 && $(elms[index]).hasClass('active')) {
        $(elms[index]).trigger('click');
        this.togglePopover(event);
      } else if (event.keyCode === 32 &&
                 this.$el.find(document.activeElement).is('.csui-search-box-slice-popover')) {
        event.preventDefault();
        this.ui.downCaret.trigger('click');
      } else if (event.keyCode === 9 || event.keyCode === 27) {
        $('.csui-search-box-slice-popover').binf_popover('hide');
        this.ui.downCaret.trigger('focus');
        this.toggleIcon(event, true);
      } else {
        if (event.keyCode === 38 || event.keyCode === 40) {
          $(elms).removeClass('active');
          event.preventDefault();
          if (event.keyCode === 38) { // up arrow key
            index = index === -1 ? (elms.length - 1) : index - 1;
          }
          if (event.keyCode === 40) { // down arrow key
            index = index === (elms.length - 1) ? -1 : index + 1;
          }
          if (index === -1) {
            this.ui.downCaret.trigger('focus');
          } else {
            $(elms[index]).addClass('active').trigger('focus');
          }
        }
      }

    },

    togglePopover: function (event) {
      var that = this;
      setTimeout(function () {
        var canHidePopover         = that.$el.find(document.activeElement).is(
            '.csui-search-popover-row,.csui-search-box-slice-popover'),
            canSetFocusOnDownCaret = (event.keyCode === 13 || event.type === 'mouseup' ||
                                      event.type === 'touchend');
        if (canHidePopover || canSetFocusOnDownCaret) {
          $('.csui-search-box-slice-popover').binf_popover('hide');
        }
        if (canSetFocusOnDownCaret) {
          that.ui.downCaret.trigger('focus');
        }
      }, 100);
      this.toggleIcon(event, true); //always show drop-down icon. therefore, send "true" flag.
    },

    hidePopover: function (event) {
      if (this.options.data.showOptionsDropDown) {
        if ($('.csui-search-box-slice-popover').css("display") !== "none") {
          $('.csui-search-box-slice-popover').binf_popover('hide');
        }
        this.showOptionsDropdown(event);
      }
    },

    resetPageDefaults: function (event) {
      this.model.resetDefaults = true;
    },

    searchIconKeyPressed: function (event) {
      if (event.keyCode === 32) {
        event.preventDefault();
        this.searchIconClicked(event);
      }
    },

    searchIconClicked: function (event) {
     this.$el.parent().addClass("search-input-open");
      this.ui.searchIcon.attr('aria-expanded', 'true');
      // TODO: Need to handle click events on csui controls.
      $(document).on('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      this.resetPageDefaults(event);
      if (this.options.data.showOptionsDropDown) {
        this.searchboxModel.nodeId !== undefined ?
        (this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere) :
        "";
      }
      if ($('.search-bar').is(':visible')) {
        var value = this.ui.input.val().trim();
        if (!!value) {
          this._setInputValue(value);
          $(event.currentTarget).attr("title", lang.startSearch);
          this.trigger("hide:breadcrumbspanel");
        }
        var searchOption = "",
            _selOption   = this.$el.find(".csui-searchbox-option:checked");
        if (this.options.data.showOptionsDropDown) {
          if (!!_selOption) {
            searchOption = _selOption.val();
          }
        } else {
          searchOption = this.options.data.nodeId;
        }

        if (!!history.state && !!history.state.search) {
          this.previousState = history.state.search;
        }
        if (!!value) {
          this._setSearchQuery(value, this.options.sliceString, searchOption, event);
          this._updateInput();
          if (!this.options.data.searchFromHere) {
            this.destroyOptionspopover();
          }
          this.options.data.searchFromHere = true;
        }
        if (!!this.previousState) {
          this.model["prevSearchState"] = this.previousState;
        }
      } else {
        var that = this;
        this.$el.addClass('csui-search-expanded');
        base.onTransitionEnd(this.$el.parent(), function () {
          if (this.isDestroyed) {
            return;
          }
          that.ui.input.trigger('focus');
          that.ui.input.prop('tabindex', 0);
          that.ui.downCaret.prop('tabindex', 0);
          that.$el.addClass('csui-searchbox-ready');
        }, this);
        this._updateInput();
        $(".binf-navbar-brand").removeClass("binf-navbar-collapse");
        if (this.options.data.showOptionsDropDown) {
          this.prepareSlicepopover();
        }
        if (this.model.attributes.where === "") {
          event.currentTarget.title = "";
          $(event.currentTarget).addClass(this.options.data.customSearchIconNoHoverClass);
        }
      }

    },

    _setSliceValue: function (sliceVal) {
      if ($('[id^="popover"]').css("display") !== "none") {
        if (!!sliceVal && sliceVal !== "{}") {
          this.$el.find("#" + sliceVal.substring(1, sliceVal.length - 1)).addClass("icon-listview-checkmark")
            .parents('.csui-search-popover-row').attr('aria-checked', 'true');
        }
      }
    },

    inputTyped: function (event) {
      var value = this.ui.input.val().trim();
      if (event.which === 13) {
        event.preventDefault();
        event.stopPropagation();
        this._setInputValue(value);
        if (!!value) {
          this.searchIconClicked(event);
        }
        if (this.previousValue != value) {
          this.previousValue = value;
        }
      }
      else {
        if (event.which === 40 && this.ui.dropDown.is(':visible')) {
          this.$el.find('.csui-searchbox-option').trigger('focus');
        }
        else {
          this.inputChanged(event);
        }
      }
    },

    inputChanged: function (event) {
      var value = this.ui.input.val();
      this.ui.clearer.prop('tabindex', value !== '' ? 0 : -1);
      this.searchIconToggle();
      this.ui.clearer.toggle(!!value.length);
      if (this.options.data.showOptionsDropDown) {
        this.showOptionsDropdown(event);
      }
    },

    showOptionsDropdown: function (event) {
      if (this.options.data.showOptionsDropDown) {
        var _e = event || window.event;
        // If node is available, then show "search from here" dropdown.
        // If searching inside a container, show dropdown.
        if (this.searchboxModel.nodeId && _e.keyCode !== 27 &&
            (this.applicationScope.get('id') !== 'search' || this.model.get('location_id1'))) {
          this.ui.dropDown.removeClass('binf-hidden');
          this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere;
        }
      }
    },

    prepareOptionsdropdown: function (e) {
      if (this.options.data.showOptionsDropDown) {
        if (!this.searchboxModel.nodeId && this.model.get('location_id1')) {
          this.searchboxModel.nodeId = this.model.get('location_id1');
          if (!!this.namedSessionStorage.get(this.searchboxModel.nodeId)) {
            this.searchboxModel.nodeName = this.namedSessionStorage.get(this.searchboxModel.nodeId);
          }
        }
        if (this.searchboxModel.nodeId) {
          this.searchOptions = {};
          this.searchOptions.nodeId = this.searchboxModel.nodeId;
          this.searchOptions.nodeIdSO = _.uniqueId('csui-so-' + this.searchboxModel.nodeId);
          if (!this.searchboxModel.nodeName && this.options.data.nodeName) {
            this.searchboxModel.nodeName = this.options.data.nodeName;
          }
          if (this.searchboxModel.nodeName) {
            this.searchOptions.nodeName = " (" + this.searchboxModel.nodeName + ")";
          }
          this.searchOptions.select = lang.searchOptionsSelect;
          this.searchOptions.fromHere = lang.searchFromHere;
          this.searchOptions.checked = this.options.data.searchFromHere ? 'checked' : '';
          var content = this.sliceDropDownTemplate(this.searchOptions);
          this.ui.dropDown.html(content);
          this.hideSearchOptionsDropDown();
        } else {
          this.destroyOptionspopover();
        }
      }
    },

    destroyOptionspopover: function (e) {
      // if node is not available destroy the search options dropdown
      this.ui.dropDown.html("");
      this.ui.dropDown.addClass('binf-hidden');
    },

    selectSearchOption: function (e) {
      var _selEle = this.$el.find(".csui-searchbox-option:checked");
      if (_selEle.length > 0) {
        this.options.data.searchFromHere = true;
        this.$el.find('.csui-icon').addClass('icon-checkbox-selected');
      } else {
        this.options.data.searchFromHere = false;
        this.$el.find('.csui-icon').removeClass('icon-checkbox-selected');
      }
    },

    hideSearchOptionsDropDown: function () {
      var that = this;
      setTimeout(function () {
        if (that.$el.find('.csui-searchbox-option')[0] === document.activeElement) {
          return false;
        } else if (that.options.data.showOptionsDropDown) {
          var self = that;
          if (that.popoverTimer) {
            clearTimeout(that.popoverTimer);
          }
          that.popoverTimer = setTimeout(function () {
            self.showSearchOptionDropDown();
          }, 800);
          return true;
        }
      }, 100);
    },

    showSearchOptionDropDown: function () {
      if (this.options.data.showOptionsDropDown) {
        if (!this.ui.dropDown.is(":hover")) {
          this.ui.dropDown.addClass('binf-hidden');
        } else {
          if (this.popoverTimer) {
            clearTimeout(this.popoverTimer);
          }
        }
      }
    },

    keyDownOnClear: function (event) {
      if (event.keyCode === 13) {
        this.clearerClicked(event);
      }
    },
    clearerClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this._setInputValue('');
      this.ui.searchIcon.removeClass(this.options.data.customSearchIconEnabledClass).addClass(
          this.options.data.customSearchIconClass);
      this.hidePopover(event);
      this.ui.input.trigger('focus');
    },

    _setSearchQuery: function (value, sliceString, searchOption, event) {
      this.model.clear({silent: true});
      var params = {};
      if (!!sliceString) {
        params['slice'] = sliceString;
      }
      if (!!searchOption) {
        params['location_id1'] = searchOption;
      }
      if (value) {
        params['where'] = value;
      }
      this.model.set(params);
      this.hidePopover(event);
    },

    setSlices: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var sliceId           = $(e.target).data("sliceid"),
          _checkedEle       = this.$el.find(".csui-search-popover-checked"),
          _toggleCurrentEle = this.$el.find(".icon-listview-checkmark"),
          _isCurrentEle     = _toggleCurrentEle.length > 0 &&
                              _toggleCurrentEle.attr("id") === $(e.target).data("sliceid") + "";
      this.options.sliceString = "";
      $(_checkedEle).removeClass("icon-listview-checkmark").parents('.csui-search-popover-row').attr('aria-checked', 'false');
      if (!_isCurrentEle) {
        $("#" + sliceId).addClass("icon-listview-checkmark").parents('.csui-search-popover-row').attr('aria-checked', 'true');
        this.options.sliceString = "{" + sliceId + "}";
      }
      this.slice = this.options.sliceString;
    },

    _hideSearchBar: function (event) {
      var _e  = event || window.event,
          ele = $('.search-bar'),
          self = event.data,
          searchContainer = self.$el.parent();
      if (ele.is(':visible')) {
        if ((_e.type === 'keydown' && (_e.keyCode === 27 || _e.which === 27) &&
             !$('.search-bar-content .binf-popover').is(":visible")) ||
            (!$(_e.target).closest(ele).length &&
            _e.type === 'click') && !$(_e.target).closest('.csui-header-search-icon').length &&
            !$(_e.target).closest('.esoc-activityfeed-invisiblebutton').length) {
          $(this).find("." + event.data.options.data.customSearchIconNoHoverClass).removeClass(
              event.data.options.data.customSearchIconNoHoverClass);
         $(this).find('.csui-input').val('');
         searchContainer.removeClass('search-input-open');
          base.onTransitionEnd(searchContainer, function () {
            if (this.isDestroyed) {
              return;
            }
            $(".binf-navbar-brand").addClass("binf-navbar-collapse");  
            self.$el.removeClass('csui-searchbox-ready').removeClass('csui-search-expanded');
          }, this);   
          
          $(this).find('.csui-search-box-slice-popover').binf_popover('hide');
          $(this).find('.csui-search-box .csui-header-search-icon')[0].title = lang.searchIconTitle;
          $($(this).find('.csui-search-box .csui-header-search-icon')[0]).attr("aria-expanded",
              'false');
          event.data.slice = event.data.model.get('slice');
          event.data.options.data.searchFromHere = true;
          event.data.ui.dropDown.addClass('binf-hidden');
          $(this).find('.csui-search-box .csui-header-search-icon').removeClass(
              event.data.options.data.customSearchIconEnabledClass).addClass(
              event.data.options.data.customSearchIconClass);

          $(document).off('click.' + this.cid + ' keydown.' + this.cid);

          var view = event.data;
          view.trigger("hide:searchbar");
          $('.csui-search-box-slice-popover').prop('tabindex', -1);
          $('.csui-input').prop('tabindex', -1);

        }
      }
    },

    _updateInput: function () {
      if (this._isRendered) {
        var value = this.model.get('where') || '';
        this._setInputValue(value);
      }
    },
    _setInputValue: function (value) {
      this.ui.input.val(value);
      this.ui.clearer.toggle(!!value.length);
      this.searchIconToggle();
      if (this.options.data.showOptionsDropDown) {
        this.options.data.nodeName = this.searchboxModel.nodeName;
      }
    },
    searchIconToggle: function () {
      var value = this.ui.input.val().trim();
      if (!!value) {
        this.ui.searchIcon.removeClass(this.options.data.customSearchIconClass).addClass(
            this.options.data.customSearchIconEnabledClass);
        this.ui.input.addClass("csui-input-focus");
        $(this.ui.searchIcon).attr("title", lang.startSearch);
        $(this.ui.searchIcon).removeClass(this.options.data.customSearchIconNoHoverClass);
      } else {
        this.ui.searchIcon.removeClass(this.options.data.customSearchIconEnabledClass).addClass(
            this.options.data.customSearchIconClass);
        this.ui.input.removeClass("csui-input-focus");
        if ($('.search-bar').is(':visible')) {
          $(this.ui.searchIcon).attr("title", lang.searchBoxTitle).addClass(
              this.options.data.customSearchIconNoHoverClass);
        }
      }
    }

  });

  return SearchBoxView;

});

csui.define('csui/widgets/navigation.header/controls/search/search.view',[
  'csui/widgets/search.box/search.box.view',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/controls/globalmessage/globalmessage'
], function (SearchBoxView, SearchQueryModelFactory, GlobalMessage) {
  'use strict';

  var SearchView = SearchBoxView.extend({
    constructor: function SearchView(options) {
      SearchBoxView.call(this, options);
      this.searchQuery = options.context.getModel(SearchQueryModelFactory);
    },

    onRender: function () {
      var resizetrigger = function () { GlobalMessage.trigger('resize'); };
      this.listenTo(this, 'hide:input', resizetrigger);
      this.listenTo(this, 'show:input', resizetrigger);
    }

  });

  return SearchView;
});

csui.define('csui/widgets/navigation.header/controls/favorites/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/favorites/impl/nls/root/localized.strings',{
  FavoritesIconTitle: 'Favorites',
  FavoritesTitleAria: 'Content Server Favorites'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/favorites/impl/favorites',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-favorites-icon-container\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.favoritesTitleAria || (depth0 != null ? depth0.favoritesTitleAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"favoritesTitleAria","hash":{}}) : helper)))
    + "\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n  <span class=\"csui-icon-favorites favorite_header_icon\"></span>\r\n</div>\r\n<div class=\"csui-favorites-view-container\"></div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_favorites_impl_favorites', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tabletoolbar/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/tabletoolbar/impl/nls/root/localized.strings',{

  ToolbarAria: 'Table toolbar',

  // controls/tabletoolbar
  ToolbarItemFilter: 'Show filters',
  ToolbarItemFilterAria: 'Show filter panel',
  ToolbarItemOpen: 'Open',
  ToolbarItemDownload: 'Download',
  ToolbarItemBrowse: 'Browse',
  ToolbarItemCopy: 'Copy',
  ToolbarItemEmailLink: 'Mail as link',
  ToolbarItemEmailLinkShort: 'Mail as link',
  ToolbarItemPaste: 'Paste',
  ToolbarItemMove: 'Move',
  ToolbarItemShare: 'Share',
  ToolbarItemSendTo: 'Send to',
  ToolbarItemNavigate: 'Visit',
  ToolbarItemViewProperties: 'Properties',
  ToolbarItemVersionHistory: 'Version history',
  ToolbarItemDelete: 'Delete',
  ToolbarItemReserve: 'Reserve',
  ToolbarItemUnreserve: 'Unreserve',
  ToolbarItemEdit: 'Edit',
  ToolbarItemRename: 'Rename',
  ToolbarItemRenameFavorite: 'Rename Favorite',
  ToolbarItemOpenSavedQuery: 'Open',
  ToolbarItemExecuteSavedQuery: 'Execute',
  ToolbarItemInfo: 'Properties',
  ToolbarItemTimeline: 'Timeline',
  ToolbarItemToggleTableLayout: 'Toggle layout',
  ToolbarItemSettings: 'Settings',
  ToolbarItemAddFolder: 'Folder',
  ToolbarItemAddDocument: 'Document',
  ToolbarItemAdd: 'Add',
  ToolbarItemAddItem: 'Add Item',
  ToolbarItemAddVersion: 'Add version',
  ToolbarItemAddCategories: 'Add Categories',
  ToolbarItemMore: 'More actions',
  ToolbarItemPrint: 'Print',
  ToolbarItemOriginalEdit: 'Edit original',
  ToolbarItemOriginalShare: 'Share original',
  ToolbarItemOriginalReserve: 'Reserve original',
  ToolbarItemOriginalUnreserve: 'Unreserve original',
  ToolbarItemOriginalCopy: 'Copy original',
  ToolbarItemOriginalMove: 'Move original',
  ToolbarItemOriginalDownload: 'Download original',
  ToolbarItemOriginalDelete: 'Delete original',
  ToolbarItemCopyLink: 'Copy link',
  ToolbarItemOriginalCopyLink: 'Copy link original',
  ToolbarItemPermissions: 'View permissions',
  ToolbarItemDeletePermission: 'Remove from list',
  ToolbarItemEditPermission: 'Edit permissions',
  ToolbarItemApplyPermission: 'Apply permissions to sub-items',
  ToolbarItemChangeOwnerPermission: 'Change owner',
  ToolbarItemRemoveCollectionItems: 'Remove from collection',
  ToolbarItemInformation: 'Properties',
  ToolbarGoToLocation:'Go to location',
  ToolbarCollect:'Collect',
  ToolbarItemZipAndDownload: 'Download',

  // dropdown menu in table header caption
  MenuItemUploadFile: 'Upload file',
  MenuItemAddNewFolder: 'Add new Folder',
  MenuItemZipAndDownload: 'Download',
  MenuItemCopy: 'Copy',
  MenuItemMove: 'Move',
  MenuItemEmailLink: 'Email link',
  MenuItemShare: 'Share',
  MenuItemReserve: 'Reserve',
  MenuItemUnreserve: 'Unreserve',
  MenuItemDelete: 'Delete',
  MenuItemSendToDevice: 'Send to device',
  MenuItemRename: 'Rename',
  MenuItemTimeline: 'Timeline',
  MenuItemInformation: 'Properties',
  MenuItemCopyLink: 'Copy link',

  // right toolbar
  ToolbarItemComment: 'Comment',
  ToolbarItemShowDescription: 'Show description',
  ToolbarItemConfiguration: 'Configuration',
  ToolbarItemMaximizeWidgetView: 'Maximize widget view',
  ToolbarItemRestoreWidgetViewSize: 'Restore widget view size',

  // permission dropdown command names

  AddUserOrGroups: 'Add user or groups',
  AddOwnerOrGroup: 'Add owner or owner group',
  RestorePublicAccess: 'Restore public access',

  //Title for add toolbar items as 'add folder'
  AddToolbarItemsTitle: 'Add {0}',
  ToolbarItemThumbnail: "Grid view",
  ToolbarItemListView: "List view",
  ThumbnailTitle: "Grid view",
  ListViewTitle: "List view"
});



csui.define('csui/widgets/favorites/tileview.toolbaritems',['csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/recentlyaccessed/tileview.toolbaritems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraToolItems) {
  'use strict';
  var toolbarItems = {

    // inline action bar
    inlineActionbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties", name: lang.ToolbarItemInfo,
              commandData: {dialogView: true}
            }
          ],
          share: [
            {
              signature: "CopyLink", name: lang.ToolbarItemCopyLink
            },

          ],
          edit: [
            {signature: "Edit", name: lang.ToolbarItemEdit}
          ],
          other: [
            {
              signature: "Download", name: lang.ToolbarItemDownload
            },
            {
              signature: "goToLocation", name: lang.ToolbarGoToLocation
            }
          ]
        },
        {
          maxItemsShown: 1,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
        })
  };

  if (extraToolItems) {
    addExtraToolItems(extraToolItems);
  }

  function addExtraToolItems(extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return toolbarItems;

});

csui.define('csui/widgets/favorites/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/favorites/impl/nls/root/lang',{
  dialogTitle: 'Favorites',
  searchTitle: 'Search Favorites',
  searchPlaceholder: 'Favorites',
  searchAria: 'Search for favorites',
  expandAria: 'Expand the Favorites widget',
  emptyGroupDefaultText: 'This group is empty.',
  emptyListText: 'There are no items to display.',
  loadingListText: 'Loading results...',
  failedListText: 'Loading results failed.',
  favoritesGroupAria: '{0}, Favorites Group',
  favoritesEmptyGroupAria: '{0}, Empty Favorites Group',
  addFav: 'Add Favorite',
  removeFav: 'Remove Favorite',
  addFavoriteNameLabel: 'Favorite name',
  addFavoriteNamePlaceHolder: 'Enter name',
  addFavoriteGroupLabel: 'Group',
  addFavoriteAddButtonLabel: 'Add',
  addFavoriteCancelButtonLabel: 'Cancel',
  nameErrorMaxLengthExceed: 'Name cannot be longer than 248 characters.',
  nameErrorContainSemiColon: 'Name cannot contain a colon.',
  updateFavoriteFailMessage: 'Failed to update Favorite for node "{0}". \n\n{1}',
  openFavoritesView: 'Open favorites view'
});





csui.define('css!csui/widgets/favorites/impl/favorites.view',[],function(){});
// Shows a list of links to favorite nodes
csui.define('csui/widgets/favorites/favorites.view',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/contexts/factories/favorites2',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/listitem/simpletreelistitem.view',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/models/favorites2', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'csui/widgets/favorites/tileview.toolbaritems',
  'csui/utils/commands',
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'i18n!csui/controls/listitem/impl/nls/lang',
  'css!csui/widgets/favorites/impl/favorites.view'
], function (module, $, _, Backbone, Marionette,
    Favorite2CollectionFactory, ListView, StandardListItem, SimpleTreeListView,
    ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    Favorite2GroupsCollectionFactory, ApplicationScopeModelFactory,
    Favorite2Collection, NodeTypeIconView, BlockingView, tileViewToolbarItems, commands,
    lang, listItemLang) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    openInPerspective: true
  });

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var FavoritesView = ListView.extend({

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchTitle: lang.searchTitle,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria,
        openPerspectiveAria: lang.openFavoritesView,
        openPerspectiveTooltip: lang.openFavoritesView,
        enableOpenPerspective: this._enableOpenPerspective
        // "hideSearch: true" could be used to get get rid of the search option
      };
    },

    events: {
      'click .tile-expand': 'onMoreLinkClick'
    },

    behaviors: {
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/favorites2.table/favorites2.table.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: 'icon-tileCollapse',
        dialogClassName: 'favorites'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    getChildView: function (item) {
      if (this.showFlatList) {
        return StandardListItem;
      } else {
        return SimpleTreeListView;
      }
    },

    childViewOptions: function () {
      return {
        templateHelpers: function () {
          if (this instanceof StandardListItem) {
            return {
              name: this.model.get('favorite_name'),
              enableIcon: true,
              showInlineActionBar: this.showInlineActionBar,
              itemLabel: _.str.sformat(listItemLang.itemTitleLabel, this.model.get('favorite_name'))
            };
          } else {
            var ariaName;
            var name = this.model.get('name');
            if (this.model.childrenCollection && this.model.childrenCollection.length === 0) {
              ariaName = _.str.sformat(lang.favoritesEmptyGroupAria, name);
            } else {
              ariaName = _.str.sformat(lang.favoritesGroupAria, name);
            }
            return {
              icon: 'mime_fav_group32',
              name: name,
              ariaName: ariaName,
              expand: this.model.searchMode
            };
          }
        },

        childViewTemplateHelpers: function () {
          return {
            icon: this.model.get('icon'),
            name: this.model.get('favorite_name'),
            text: lang.emptyGroupDefaultText,
            showInlineActionBar: this.showInlineActionBar,
            itemLabel: _.str.sformat(listItemLang.itemTitleLabel, this.model.get('favorite_name'))
          };
        },
        checkDefaultAction: true,
        context: this.context,
        //Set these values inorder to disaply Inline Actions
        toolbarData: this.toolbarData

      };
    },

    childEvents: {
      'click:item': '_onClickItem',  // event for flat list
      'click:tree:item': '_onClickTreeItem',
      'click:tree:header': '_onClickTreeHeader',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem',
      'changed:focus': 'onChangedfocus'
    },

    constructor: function FavoritesView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'favorite_name asc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-favourites';

      var nonPromotedActionCommands = commands.getSignatures(tileViewToolbarItems);

      this.completeCollection = options.collection ||
                                options.context.getCollection(
                                    Favorite2GroupsCollectionFactory,
                                    {
                                      detached: true,
                                      permanent: true,
                                      favorites: {
                                        options: {
                                          promotedActionCommands: [],
                                          nonPromotedActionCommands: nonPromotedActionCommands
                                        }
                                      }
                                    }
                                );
      var limitedRS = Favorite2CollectionFactory.getLimitedResourceScope();
      this.completeCollection.favorites.setResourceScope(limitedRS);

      var ViewCollection = Backbone.Collection.extend({
        model: this.completeCollection.model
      });
      options.collection = new ViewCollection();
      this.showInlineActionBar = options.showInlineActionBar === false ?
                                 options.showInlineActionBar : true;

      var context        = options.context,
          viewStateModel = context && context.viewStateModel;
      this._enableOpenPerspective = config.openInPerspective &&
                                    viewStateModel && viewStateModel.get('history');

      ListView.prototype.constructor.apply(this, arguments);

      BlockingView.imbue(this);

      // TODO: Set up collection parameters here to get the best performance;
      // set up both this.completeCollection and this.completeCollection.favorites
      // Node: must listen for sync to update when new model was successfully saved, otherwise
      // it would show up empty.
      this.listenTo(this.completeCollection, 'update sync',
          _.bind(this._synchronizeCollections, this));

      this._synchronizeCollections();

      this.listenTo(this, 'render', this._onRender);
      this.listenTo(this, 'change:filterValue', this._synchronizeCollections);

      if (this.showInlineActionBar) {
        options.tileViewToolbarItems = tileViewToolbarItems;
        this.context = context;
        this.toolbarData = {
          toolbaritems: tileViewToolbarItems,
          collection: this.completeCollection.favorites
        };
      }

      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
    },

    _onRender: function () {
      this.$el.addClass('cs-favorites');
      this.completeCollection.ensureFetched();
      this.$el.on('keydown', _.bind(this.onKeyDown, this));
      // the parent view is always rendered first with its current collection
      this._updateAccAttributes();
    },

    _updateAccAttributes: function () {
      // remove existing attributes first
      this.$el.find('.tile-content').removeAttr('role aria-expanded');
      this.$el.find('.tile-content > .binf-list-group').removeAttr('role');

      // set attributes
      if (this.showFlatList) {  // flat list
        this.$el.find('.tile-content > .binf-list-group').attr('role', 'listbox');
      } else {  // tree list
        this.$el.find('.tile-content > .binf-list-group').attr('role', 'tree');
      }
    },

    onRenderCollection: function () {
      // the collection can optionally be synced later, needs to update accessibility attributes
      this._updateAccAttributes();
    },

    onRenderItem: function (childView) {
      if (this.showFlatList) {
        childView._nodeIconView = new NodeTypeIconView({
          el: childView.$('.csui-type-icon').get(0),
          node: childView.model
        });
        childView._nodeIconView.render();
        childView.$el.attr('role', 'option');
        childView.$el.attr('aria-label',
            _.str.sformat(listItemLang.typeAndNameAria, childView._nodeIconView.model.get('title'),
                childView.model.get('favorite_name')));
      } // for tree view the role is set in the simpletreelistitem
    },

    onBeforeDestroyItem: function (childView) {
      if (this.showFlatList && childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    onChangedfocus: function () {
      this.trigger('changed:focus');
    },

    _onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    _onClickTreeItem: function (target, src) {
      this.triggerMethod('execute:defaultAction', src.model);
    },

    _onClickTreeHeader: function (target) {
      // tree list view expands or collapses, update the scrollbar
      this.trigger('update:scrollbar');
    },

    onClickHeader: function (target) {
      if (this.options.avoidOpenPerspectiveOnHeader) {
        return;
      }
      this.onClickOpenPerspective(target);
    },

    onClickOpenPerspective: function (target) {
      this.applicationScope.set('id', 'favorites');
      this.trigger('open:favorites:perspective');
    },

    onMoreLinkClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.triggerMethod('expand');
    },

    _synchronizeCollections: function () {
      var favoritesCollection,
          self = this,
          firstGroup = this.completeCollection.at(0),
          options = {
            connector: this.completeCollection.connector
          },
          filterObj = {
            favorite_name: this.options.filterValue
          };

      if (this.completeCollection.length === 1 && firstGroup.get('tab_id') === -1) {

        // there is only the Unsorted group (tab_id = -1), show a flat list as UX requested
        this.showFlatList = true;
        favoritesCollection = new Favorite2Collection(undefined, options);
        favoritesCollection.reset(firstGroup.favorites && firstGroup.favorites.models || []);
        favoritesCollection.setFilter(filterObj);
        // if not searching or search still has empty value, set it to all models
        if (!self.options.filterValue || self.options.filterValue.length === 0) {
          self.collection.reset(favoritesCollection.models);
        } else {
          // setFilter is now asynchronous, listen to sync event to update the collection
          self.listenTo(favoritesCollection, 'sync', function () {
            self.collection.reset(favoritesCollection.models);
          });
        }

      } else {

        // show favorite groups and items in a tree list
        self.showFlatList = false;
        var searchMode = this.isSearchOpen();
        var groups = new Backbone.Collection();
        var promises = [];

        _.each(this.completeCollection.models, function (group) {
          favoritesCollection = new Favorite2Collection(undefined, options);
          favoritesCollection.reset(group.favorites.models);
          favoritesCollection.setFilter(filterObj);

          var groupModel = new Backbone.Model(group.attributes);
          groupModel.childrenCollection = favoritesCollection;
          groupModel.searchMode = searchMode;
          // flatten the unsorted Favorites group
          (groupModel.get('tab_id') === -1) && groupModel.set('flatten', true);
          groups.add(groupModel);

          // searching with some non-empty string, wait for the setFilter() asynchronous call
          if (self.options.filterValue && self.options.filterValue.length > 0) {
            var deferred = $.Deferred();
            promises.push(deferred.promise());
            // setFilter is now asynchronous, listen to sync event to update the collection
            self.listenTo(favoritesCollection, 'sync', function () {
              // UX specs: don't show empty groups during search
              if (groupModel.childrenCollection.length === 0) {
                groups.remove(groupModel);
              }
              deferred.resolve();
            });
          }

        });

        // searching with some non-empty string, wait for all promises done then set collection
        if (self.options.filterValue && self.options.filterValue.length > 0) {
          $.when.apply($, promises).then(function () {
            self.collection.reset(groups.models);
          });
        } else {
          // set models to collection when not in the progress of searching or empty string search
          self.collection.reset(groups.models);
        }

      }
    },

    // Override the ListView::getElementByIndex method.
    // Return the jQuery list item element by index for keyboard navigation use
    getElementByIndex: function (index, event) {
      if (this.showFlatList) {
        return ListView.prototype.getElementByIndex.call(this, index);
      }

      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var childView = this.children.findByIndex(index);
      if (childView && childView.currentlyFocusedElement) {
        return childView.currentlyFocusedElement(event);
      } else {
        return null;
      }
    }

  });

  return FavoritesView;

});


csui.define('css!csui/widgets/navigation.header/controls/favorites/impl/favorites',[],function(){});
csui.define('csui/widgets/navigation.header/controls/favorites/favorites.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/favorites/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/navigation.header/controls/favorites/impl/favorites',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/favorites/favorites.view', 'csui/utils/contexts/factories/favorites2',
  'css!csui/widgets/navigation.header/controls/favorites/impl/favorites'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior, template,
    LayoutViewEventsPropagationMixin, FavoritesView) {
  'use strict';

  var FavoritesButtonView = Marionette.LayoutView.extend({
    className: 'csui-favorites-view',

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.FavoritesIconTitle,
        favoritesTitleAria: localizedStrings.FavoritesTitleAria
      };
    },

    regions: {
      favoritesViewContainerRegion: '.csui-favorites-view-container'
    },

    ui: {
      favoritesButtonContainer: '.csui-favorites-icon-container',
      favoritesViewContainer: '.csui-favorites-view-container'
    },

    events: {
      'dragenter': '_hideFavoritesView',
      'keydown': 'onKeyInView',
      'mouseenter .csui-favorites-view-container': 'onMouseEnterFavoritesView',
      'mouseenter .csui-favorites-icon-container': 'onMouseEnterFavoritesView',
      'mouseleave .csui-favorites-view-container': 'onMouseLeaveFavoritesView',
      'mouseleave .csui-favorites-icon-container': 'onMouseLeaveFavoritesView',
      'mouseenter .clicked-no-hover': 'onMouseEnterClickedNoHoverItem',
      'focus .csui-favorites-icon-container': 'onFocusButton',
      'blur .csui-favorites-icon-container': 'onBlurButton',
      'blur .csui-favorites-view-container': 'onBlurFavoritesViewContainer',
      'click .csui-favorites-icon-container': 'onClickFavoritesIcon'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var $favoriteSearch = this.ui.favoritesViewContainer.find(
        '.content-tile .cs-search-button');
      if (event.shiftKey && $favoriteSearch .length > 0) {
        return this.favoritesView._focusSearchButton();
      } else {
        return this.ui.favoritesButtonContainer;
      }
    },

    constructor: function FavoritesButtonView(options) {
      Marionette.LayoutView.call(this, options);
      
      this.propagateEventsToRegions();
      this.listenTo(options.context, 'change:perspective', this._hideFavoritesView);
    },

    onBeforeDestroy: function () {
      this.favoritesView && this.favoritesView.destroy();
    },

    onRender: function () {
      this.ui.favoritesViewContainer.addClass('binf-hidden');
    },

    onFocusButton: function () {
      this.$el.find('.csui-icon-favorites').addClass('fav_header42_mo');
    },

    onBlurButton: function () {
      this.$el.find('.csui-icon-favorites').removeClass('fav_header42_mo');
      if (this.favoritesViewInFocus !== true &&
          document.activeElement !== this.ui.favoritesButtonContainer[0]) {
        this._hideFavoritesView();
      }
    },

    onBlurFavoritesViewContainer: function (event) {
      if (this.favoritesViewInFocus !== true && this.keyboardAction !== true) {
        this._hideFavoritesView();
      }
    },

    onMouseEnterFavoritesView: function () {
      this.favoritesViewInFocus = true;
    },

    onMouseLeaveFavoritesView: function () {
      this.favoritesViewInFocus = false;
    },

    onMouseEnterClickedNoHoverItem: function (event) {
      event && event.target && $(event.target).removeClass('clicked-no-hover');
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 9:  // tab
        var favoritesButtonInFocus = this.ui.favoritesButtonContainer.is(':focus');
        if (favoritesButtonInFocus && event.shiftKey !== true &&
            !this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
          // move to the favorites list
          this._focusOnFavoriteSearch(event);
        } else if (!favoritesButtonInFocus && event.shiftKey) {
          // move to the favorites button
          event.preventDefault();
          event.stopPropagation();
          this._focusOnFavoriteButton();
        } else if (!$(event.target).closest('.tile-header').length){
          this._hideFavoritesView();
        }
        break;
      case 13:  // enter
      case 32:  // space
        if (!$(event.target).closest('.tile-header').length) {
        this.triggerMethod('click:favorites:icon', event);
          if (!this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
            this._focusOnFavoriteSearch(event);
          }
        }
        break;
      case 40:  // arrow down
        if (!this.favoritesView || this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
          this.triggerMethod('click:favorites:icon', event);
          this._focusOnFavoriteSearch(event);
        } else if (this.favoritesViewInFocus !== true) {
          this._focusOnFavoriteSearch(event);
        }
        break;
      case 27:  // escape
        this._focusOnFavoriteButton();
        this._hideFavoritesView();
        break;
      }
    },

    _focusOnFavoriteButton: function () {
      this.ui.favoritesButtonContainer.trigger('focus');
      this.favoritesViewInFocus = false;
    },

    _focusOnFavoriteSearch: function (event) {
      var $favoriteSearch = this.ui.favoritesViewContainer.find(
        '.content-tile .cs-search-button');
      if ($favoriteSearch.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        this.favoritesViewInFocus = true;
        this.favoritesView._moveTo(event, this.favoritesView._focusSearchButton());
      }
    },

    _focusOnFavoriteList: function (event) {
      var $favorites     = this.ui.favoritesViewContainer.find(
          '> .content-tile > .tile-content > .binf-list-group'),
          $favoriteItems = this.favoritesView.showFlatList ?
                           $favorites.find('> .binf-list-group-item') :
                           $favorites.find('> .cs-simpletreelistitem');
      if ($favoriteItems.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        this.favoritesViewInFocus = true;
        this.favoritesView._moveTo(event, this.favoritesView._focusList());
      }
    },

    _handleClickEvent: function (event) {
      // check to see if the click is NOT on the popover
      if (!$(event.target).parents('.csui-favorites-view-container').length &&
          !$(event.target).parents('.csui-favorites-icon-container').length) {
        this._hideFavoritesView();
      }
    },

    _toggleFavoritesView: function () {
      if (this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
        this._showFavoritesView();
      } else {
        this._hideFavoritesView();
      }
    },

    _showFavoritesView: function () {
      this.ui.favoritesViewContainer.removeClass('binf-hidden');
      this.ui.favoritesButtonContainer.attr('aria-expanded', 'true');
      this.$el.addClass('showing-favorites-view');
      this.favoritesViewContainerRegion.show(this.favoritesView);
      $(document).off('click.' + this.cid).on('click.' + this.cid,
          _.bind(this._handleClickEvent, this));
    },

    _hideFavoritesView: function () {
      $(document).off('click.' + this.cid);
      if (this.favoritesView && this.favoritesView.isSearchOpen()) {
        this.favoritesView.searchClicked(event); // reset search to default
      }
      this.favoritesViewInFocus = false;
      this.ui.favoritesViewContainer.addClass('binf-hidden');
      this.ui.favoritesButtonContainer.attr('aria-expanded', 'false');
      this.$el.removeClass('showing-favorites-view');
    },

    onClickFavoritesIcon: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var toggleDropdown = $('.binf-open>.binf-dropdown-toggle');
      if (toggleDropdown.length > 0) {
        toggleDropdown.binf_dropdown('toggle');
      }
      this._ensureFavoritesView();
      this._toggleFavoritesView();
      this._focusOnFavoriteSearch(event);
    },

    _ensureFavoritesView: function () {
      if (!this.favoritesView) {
        var self = this;
        var options = _.extend(this.options, {showInlineActionBar: true, avoidOpenPerspectiveOnHeader: true});
        this.favoritesView = new FavoritesView(options);
        this.listenTo(this.favoritesView, 'childview:click:tree:item', function (target, src) {
          src.$el && src.$el.addClass('clicked-no-hover');
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView, 'childview:click:item', function (src) {
          src.$el && src.$el.addClass('clicked-no-hover');
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView, 'childview:before:execute:command', function (src) {
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView,
            'before:keyboard:change:focus childview:before:keyboard:change:focus', function () {
              self.keyboardAction = true;
            });
        this.listenTo(this.favoritesView,
            'after:keyboard:change:focus childview:after:keyboard:change:focus', function () {
              self.keyboardAction = false;
            });

        this.listenTo(this.favoritesView, 'open:favorites:perspective', function() {
          this._hideFavoritesView();
        });
      }
    }
  });

  _.extend(FavoritesButtonView.prototype, LayoutViewEventsPropagationMixin);

  return FavoritesButtonView;
});

csui.define('csui/widgets/navigation.header/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/impl/nls/root/lang',{
  profileMenuItemLabel: 'Profile',
  switchToClassicMenuItemLabel: 'Classic View',
  signOutMenuItemLabel: 'Sign out',
  EditPerspective: "Edit page",
  CreatePerspective: "Edit page",
  personalizePage: "Personalize page"
});



csui.define('csui/widgets/navigation.header/profile.menuitems',['csui/lib/underscore',
  'i18n!csui/widgets/navigation.header/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items from the previous module location
  'csui-ext!csui/widgets/navigation.header/profile.menuitems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraToolItems) {
  'use strict';

  var menuItems = {
    profileMenu: new ToolItemsFactory({
        profile: [
          {signature: 'UserProfile', name: lang.profileMenuItemLabel}
        ],
        others: [
          {signature: 'SwitchToClassic', name: lang.switchToClassicMenuItemLabel},
          {signature: 'EditPerspective', name: lang.EditPerspective}
       ],
        signout: [
          {signature: 'SignOut', name: lang.signOutMenuItemLabel}
        ]
      },
      {
        maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
        dropDownIcon: 'icon icon-expandArrowDown',
        dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_caret_down32"
      }
    )
  };

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = menuItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return menuItems;
});

csui.define('csui/widgets/navigation.header/profile.menuitems.mask',[
  'module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';

  var ProfileMenuItemsMask = ToolItemMask.extend({

    constructor: function ProfileMenuItemsMask() {
      var config = module.config(),
          globalMask = new GlobalMenuItemsMask();
      ToolItemMask.prototype.constructor.call(this, globalMask, {normalize: false});
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        this.extendMask(source);
      }, this);
      // Enable restoring the mask to its initial state
      this.storeMask();
    }

  });

  return ProfileMenuItemsMask;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#\" data-binf-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\" aria-haspopup=\"true\"\r\n   class=\"binf-dropdown-toggle nav-profile csui-navbar-icons csui-acc-focusable\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.profileMenuTitle || (depth0 != null ? depth0.profileMenuTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"profileMenuTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.profileMenuAria || (depth0 != null ? depth0.profileMenuAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"profileMenuAria","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"csui-profile-default-image image_user_placeholder\">"
    + this.escapeExpression(((helper = (helper = helpers.initials || (depth0 != null ? depth0.initials : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"initials","hash":{}}) : helper)))
    + "</span>\r\n  <img class=\"csui-profile-image binf-img-circle binf-hidden\" role=\"presentation\" alt=\""
    + this.escapeExpression(((helper = (helper = helpers.profileImageAlt || (depth0 != null ? depth0.profileImageAlt : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"profileImageAlt","hash":{}}) : helper)))
    + "\" src=\""
    + this.escapeExpression(((helper = (helper = helpers.imgSrc || (depth0 != null ? depth0.imgSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imgSrc","hash":{}}) : helper)))
    + "\">\r\n</a>\r\n<ul class=\"binf-dropdown-menu csui-profile-dropdown\" role=\"menu\"></ul>";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_user.profile_impl_user.profile', t);
return t;
});
/* END_TEMPLATE */
;


csui.define('css!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',[],function(){});
csui.define('csui/widgets/navigation.header/controls/user.profile/user.profile.view',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/url',
  'csui/utils/log', 'csui/utils/base', 'csui/utils/commands',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/user',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolitem.view',
  'csui/widgets/navigation.header/profile.menuitems',
  'csui/widgets/navigation.header/profile.menuitems.mask',
  'csui/utils/user.avatar.color',
  'csui/controls/globalmessage/globalmessage',
  'hbs!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',
  'csui-ext!csui/widgets/navigation.header/controls/user.profile/user.profile.view',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',
  'csui/lib/jquery.binary.ajax'
], function (module, _, $, Backbone, Marionette, Url, log, base,
    commands, ConnectorFactory, UserModelFactory, TabableRegionBehavior,
    FilteredToolItemsCollection, ToolItemView, menuItems, MenuItemsMask, UserAvatarColor,
    GlobalMessage, template, menuHandlers, lang) {
  'use strict';

  log = log(module.id);

  var ProfileView = Marionette.CompositeView.extend({
    classname: 'binf-dropdown',

    template: template,

    templateHelpers: function () {
      var username = base.formatMemberName(this.model);

      return {
        profileMenuTitle: lang.profileMenuTitle,
        profileMenuAria: _.str.sformat(lang.profileMenuAria, username),
        profileImageAlt: _.str.sformat(lang.profileImageAlt, username),
        // a 1x1 transparent gif, to avoid an empty src tag
        imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        initials: this.options.model.attributes.initials
      };
    },

    serializeData: function () {
      return {
        items: this.collection.toJSON()
      };
    },

    childView: ToolItemView,

    childViewContainer: '> .csui-profile-dropdown',

    ui: {
      userProfileMenu: '> .csui-profile-dropdown',
      userProfileMenuHandle: '> a',
      personalizedImage: '.csui-profile-image',
      defaultImage: '.csui-profile-default-image',
      profileDropdownToggler: '> .nav-profile'
    },

    events: {
      'keydown @ui.profileDropdownToggler': '_showDropdown',
      'keydown @ui.userProfileMenu': '_showDropdown',
      'focusout @ui.profileDropdownToggler': '_toggleDropdown',
      'focusout @ui.userProfileMenu': '_toggleDropdown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: '> .csui-acc-focusable',

    constructor: function ProfileView(options) {
      options || (options = {});
      this._ensureModels(options);

      Marionette.CompositeView.prototype.constructor.call(this, options);

      this.connector = this.options.context.getModel(ConnectorFactory);
      this.listenTo(this.model, 'change', this._refreshUser)
          .listenTo(options.context, 'sync error', this._refreshActions)
          .listenTo(this, 'render', this._displayUser)
          .listenTo(this, 'destroy', this._releasePhotoUrl)
          .listenTo(this, 'childview:toolitem:action', this._triggerMenuItemAction)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);
    },

    _ensureModels: function (options) {
      var context = options.context,
          user    = context.getModel(UserModelFactory);

      this.username = "ensured";

      this.staticMenuItems = menuItems.profileMenu.collection.toJSON();
      options.model = user;

      options.collection = new FilteredToolItemsCollection(
          menuItems.profileMenu, {
            status: {context: context},
            commands: commands,
            mask: new MenuItemsMask()
          });
    },

    _refreshUser: function () {
      // Properties is being destroyed on changing the context node. Both destroyer
      // and a sub-view refreshed are listening on node changes. Although listening
      // is stopped during the destruction, already registered handlers will be
      // triggered nevertheless.
      if (this._isRendered && !this.isDestroyed) {
        this.render();
      }
    },

    _refreshActions: function () {
      // Properties is being destroyed on changing the context node. Both destroyer
      // and a sub-view refreshed are listening on node changes. Although listening
      // is stopped during the destruction, already registered handlers will be
      // triggered nevertheless.
      if (this._isRendered && !this.isDestroyed) {
        if (menuHandlers) {
          var options  = {context: this.options.context},
              promises = _.chain(menuHandlers)
                  .flatten(true)
                  .map(function (menuHandler) {
                    return menuHandler(options);
                  })
                  .value(),
              self     = this;
          $.whenAll
              .apply($, promises)
              .always(function (dynamicMenuItems) {
                var mask = new MenuItemsMask();
                dynamicMenuItems = _.chain(dynamicMenuItems)
                    .flatten()
                    .pluck('profileMenu')
                    .flatten()
                    .value();
                dynamicMenuItems = self.staticMenuItems.concat(dynamicMenuItems);
                dynamicMenuItems = mask.maskItems(dynamicMenuItems);
                menuItems.profileMenu.reset(dynamicMenuItems);
              });
        } else {
          this.collection.refilter();
        }
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      // close the dropdown menu before triggering the event
      this.ui.profileDropdownToggler.binf_dropdown('toggle');
      this._executeAction(args.toolItem);
    },

    _executeAction: function (toolItem) {
      var signature = toolItem.get('signature'),
          command   = commands.findWhere({signature: signature}),
          context   = this.options.context,
          status    = {
            context: context,
            toolItem: toolItem,
            data: toolItem.get('commandData')
          },
          self      = this;
      try {
        // If the command was not found and the toolitem is executable, it is
        // a developer's mistake.
        if (!command) {
          throw new Error('Command "' + signature + '" not found.');
        }

        this.$el.addClass('binf-disabled');
        command.execute(status)
            .done(function (item) {
              // TODO: Add success reporting; do not build the sentence
              // from separate verbs and subjects; the command has to
              // return the full sentence
            })
            .fail(function (error) {
              if (error) {
                error = new base.Error(error);
                GlobalMessage.showMessage('error', error.message,
                    error.errorDetails);
              }
            })
            .always(function () {
              self.$el.removeClass('binf-disabled');
            });
      } catch (error) {
        log.warn('Executing the command "{0}" failed.\n{1}',
            command.get('signature'), error.message) && console.warn(log.last);
      }
    },

    _displayUser: function () {
      if (this.model.get('id')) {
        this._displayProfileImage();
        this._assignUserColor();
      }
    },

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      if (photoUrl) {
        var getPhotoOptions = {
          url: photoUrl,
          dataType: 'binary'
        };
        this.connector.makeAjaxCall(getPhotoOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                this._showPersonalizedImage(response);
              } else {
                this._showDefaultImage();
              }
            }, this));
      } else {
        this._showDefaultImage();
      }
    },

    _getUserPhotoUrl: function () {
      var connection = this.connector.connection,
          cgiUrl     = new Url(connection.url).getCgiScript(),
          photoPath  = this.model.get('photo_url');
      // If the URL does not contain the cache-busting parameter derived from
      // the picture's latest change, there was a problem retrieving it.  It
      // does not make sense to try it once more from the client side, waste
      // time and server resources and litter the log by 404 errors.
      if (photoPath && photoPath.indexOf('?') > 0) {
        return Url.combine(cgiUrl, photoPath);
      }
    },

    _showPersonalizedImage: function (imageContent) {
      this._releasePhotoUrl();
      this._photoUrl = URL.createObjectURL(imageContent);
      this.ui.defaultImage.addClass('binf-hidden');
      this.ui.personalizedImage.attr('src', this._photoUrl)
          .removeClass('binf-hidden');
      // after coming from keyboard once update the profile put focus to the resp. image.
      this.$el.parents().find('.esoc-userprofile-pic-actions img').length &&
      this.$el.parents().find('.esoc-userprofile-pic-actions img').trigger('focus');
    },

    _showDefaultImage: function (imageContent) {
      this._releasePhotoUrl();
      this.ui.personalizedImage.addClass('binf-hidden');
      this.ui.defaultImage[0].innerText = this.options.model.attributes.initials;
      this.ui.defaultImage.removeClass('binf-hidden');
      this.$el.parents().find(' span.esoc-full-profile-avatar-cursor').length &&
      this.$el.parents().find(' span.esoc-full-profile-avatar-cursor').trigger('focus');
    },

    _releasePhotoUrl: function () {
      if (this._photoUrl) {
        URL.revokeObjectURL(this._photoUrl);
        this._photoUrl = undefined;
      }
    },

    _closeToggle: function () {
      if (this.$el.hasClass('binf-open')) {
        this.ui.userProfileMenuHandle.trigger('click');
      }
    },

    _showDropdown: function (event) {
      var elms          = this.ui.userProfileMenu.find('> li > a'),
          index         = 0,
          activeElement = this.$el.find(document.activeElement);
      if (activeElement.length > 0) {
        index = elms.index(activeElement[0]);
        if (event.keyCode === 38 || event.keyCode === 40) {
          event.preventDefault();
          if (event.keyCode === 38) { // up arrow key
            index = index === -1 ? (elms.length - 1) : index - 1;
          }
          if (event.keyCode === 40) { // down arrow key
            index = index === (elms.length - 1) ? -1 : index + 1;
          }
          if (index === -1) {
            this.ui.profileDropdownToggler.trigger('focus');
          } else {
            $(elms[index]).trigger('focus');
          }
        } else if (event.keyCode === 27 &&
                   $(activeElement).closest('ul').is('.csui-profile-dropdown')) {
          event.stopPropagation();
          this.ui.profileDropdownToggler.trigger('click').trigger('focus');
        } else if (event.keyCode === 32 || event.keyCode === 13) {
          event.preventDefault();
          event.stopPropagation();
          $(activeElement).trigger('click');
        }
      }
    },

    _toggleDropdown: function (event) {
      var that = this;
      setTimeout(function () {
        if (!!document.activeElement.offsetParent &&
            !document.activeElement.offsetParent.classList.contains(
                'csui-profile-dropdown') &&
            document.activeElement !== that.ui.profileDropdownToggler[0] &&
            that.ui.userProfileMenu.is(':visible')) {
          // closes the menu when keyboard moves focus out of the profile area
          $(that.ui.profileDropdownToggler).trigger('click');
        }
      }, 100);
    },

    _assignUserColor: function () {
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      this.ui.defaultImage.css("background", userbackgroundcolor);
    }
  });

  return ProfileView;
});

// Lists explicit locale mappings and fallbacks

csui.define('csui/widgets/navigation.header/controls/progressbar.maximize/impl/nls/progressbar-maximize.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/progressbar.maximize/impl/nls/root/progressbar-maximize.lang',{
  // minimize
  maximize: 'Show message banner',
  maximizeAria: 'Show message banner'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/progressbar.maximize/impl/progressbar.maximize',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-maximize\">\r\n<div class=\"icon-progresspanel-pending csui-button-icon binf-btn-default\"\r\n    aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.maximizeAria || (depth0 != null ? depth0.maximizeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"maximizeAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.maximize || (depth0 != null ? depth0.maximize : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"maximize","hash":{}}) : helper)))
    + "\" tabindex=\"0\">\r\n    <div class=\"csui-progressbar-animation\">\r\n    <!--<span class=\"icon-progresspanel-maximize-arrow binf-glyphicon binf-glyphicon-open\"></span>-->\r\n      <div class=\"csui-progressbar-pie-wrapper progress progressbar\">\r\n        <div class=\"csui-progressbar-pie\">\r\n          <div class=\"csui-progressbar-left-side csui-progressbar-half-circle\"></div>\r\n          <div class=\"csui-progressbar-right-side csui-progressbar-half-circle\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_progressbar.maximize_impl_progressbar.maximize', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/navigation.header/controls/progressbar.maximize/impl/progressbar-maximize',[],function(){});
csui.define('csui/widgets/navigation.header/controls/progressbar.maximize/progressbar.maximize.view',[
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
    'csui/controls/globalmessage/globalmessage',
    'i18n!csui/widgets/navigation.header/controls/progressbar.maximize/impl/nls/progressbar-maximize.lang',  // Use localizable texts
    'hbs!csui/widgets/navigation.header/controls/progressbar.maximize/impl/progressbar.maximize',
    'css!csui/widgets/navigation.header/controls/progressbar.maximize/impl/progressbar-maximize',
], function (_, $, Marionette, GlobalMessage, lang, template) {
    'use strict';

    var ProgressbarMaximizeView = Marionette.ItemView.extend({
        className: 'csui-progressbar-maximize-view binf-hidden',

        template: template,

        templateHelpers: function () {
            return {
                maximize: lang.maximize,
                maximizeAria: lang.maximizeAria
            };
        },

        ui: {
            favoritesButtonContainer: '.csui-favorites-icon-container',
            favoritesViewContainer: '.csui-favorites-view-container',
            progresspanelMaximize: '.csui-maximize .csui-button-icon',
            progressRight : '.csui-progressbar-pie .csui-progressbar-right-side',
            progressLeft : '.csui-progressbar-pie .csui-progressbar-left-side',
            wrapper: '.csui-progressbar-pie-wrapper.progress .csui-progressbar-pie'
        },

        events: {
            'click': '_onClick',
            'keydown @ui.progresspanelMaximize': 'onKeyInView',
        },

        constructor: function ProgressbarMaximizeView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.listenTo(options.parentView, "processbar:minimize", this._doProcessbarMaximize);
            this.listenTo(options.parentView, "processbar:update", this._doProgressbarAnimation);
            this.listenTo(options.parentView, "processbar:finished", this._doFinishedProgressbar);
            this.listenTo(options.parentView, "processing:completed", this._onClick); //Open progres panel automatically once upload is 100% completed
            this.listenTo(options.parentView, "processing:error", this._doFailedProgressbar);
        },

        _doProcessbarMaximize: function () {
            this.$el.removeClass('binf-hidden');
            this.$el.find('.csui-progressbar-animation').removeClass('binf-hidden');
            this.ui.progresspanelMaximize.removeClass('icon-progresspanel-success');
            this.ui.progresspanelMaximize.removeClass('icon-progresspanel-error');
            this.ui.progresspanelMaximize.trigger("focus");
        },

        onKeyInView: function (event) {
            if (event.keyCode === 13 || event.keyCode === 32) {
                // enter key(13) or space(32)
                this._onClick();
                return false;
            }
        },

        _doFailedProgressbar: function(){
            this.ui.progresspanelMaximize.addClass('icon-progresspanel-error');
            this.ui.progresspanelMaximize.removeClass('icon-progresspanel-success');
        },
        
        _doFinishedProgressbar: function () {
            this.ui.wrapper.css('clip', 'rect(0, 1em, 1em, 0.5em)');
            this.ui.progressLeft.css('transform', 'rotate(' + 360 + 'deg)');
            this.ui.progressRight.css('transform', 'rotate(' + 0 + 'deg)');
            this.$el.addClass('binf-hidden');
        },

        _doProgressbarAnimation: function (progressPercent) {
            // Calculation to convert horizontal progress bar(100%) to circular progress bar(360 deg) 
            var calc = Math.round(3.6 * progressPercent);
            if (progressPercent <= 50) {
                this.ui.wrapper.css('clip', 'rect(0, 1em, 1em, 0.5em)');
                this.ui.progressLeft.css('transform', 'rotate(' + 360 + 'deg)');
                this.ui.progressRight.css('transform', 'rotate(' + calc + 'deg)');
            }
            if (progressPercent >= 50 && progressPercent <= 100) {
                this.ui.wrapper.css('clip', 'rect(auto, auto, auto, auto)');
                this.ui.progressRight.css('transform', 'rotate(' + 180 + 'deg)');
                this.ui.progressLeft.css('transform', 'rotate(' + calc + 'deg)');
            }
        },

        _onClick: function () {
            this.$el.addClass('binf-hidden');
            this.options.parentView.trigger('processbar:maximize');
        },

        onRender: function () {

        }

    });


    return ProgressbarMaximizeView;
});


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/error.global.json',{
  "type": "grid",
  "options": {
    "rows": [
      {
        "columns": [
          {
            "sizes": {
              "md": 12
            },
            "heights": {
              "xs": "full"
            },
            "widget": {
              "type": "csui/widgets/error.global",
              "options": {
              }
            }
          }
        ]
      }
    ]
  }
}
);


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/error.global/impl/error.global',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return " aria-describedby=\""
    + this.escapeExpression(((helper = (helper = helpers.msgId || (depth0 != null ? depth0.msgId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"msgId","hash":{}}) : helper)))
    + "\" ";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "        <div class='server-error-message-wrapper'>\r\n          <div class='server-error-message horizontal-center-align'>\r\n            <span id=\""
    + this.escapeExpression(((helper = (helper = helpers.msgId || (depth0 != null ? depth0.msgId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"msgId","hash":{}}) : helper)))
    + "\" class='csui-acc-focusable'>"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</span>\r\n          </div>\r\n        </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class='main-area-container'>\r\n  <div class='main-area-group'>\r\n    <div class='error-message-area'>\r\n      <div class='error-message-wrapper'>\r\n        <h2 class='error-message horizontal-center-align' "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " >\r\n          <span class='csui-acc-focusable'>"
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "</span>\r\n        </h2>\r\n      </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n\r\n    <div class='navigation-area horizontal-center-align'>\r\n      <div class='navigation-control-container'>\r\n        <a class='go-back-button circle-border horizontal-center-align' href=\"#\"\r\n          title='"
    + this.escapeExpression(((helper = (helper = helpers.backTooltip || (depth0 != null ? depth0.backTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTooltip","hash":{}}) : helper)))
    + "' aria-label='"
    + this.escapeExpression(((helper = (helper = helpers.backTooltip || (depth0 != null ? depth0.backTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTooltip","hash":{}}) : helper)))
    + "' class='csui-acc-focusable'>\r\n            <span class='icon icon-back'></span>\r\n        </a>\r\n        <div class='go-back-text button-text horizontal-center-align' title='"
    + this.escapeExpression(((helper = (helper = helpers.backTooltip || (depth0 != null ? depth0.backTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTooltip","hash":{}}) : helper)))
    + "'>\r\n            <span>"
    + this.escapeExpression(((helper = (helper = helpers.backText || (depth0 != null ? depth0.backText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backText","hash":{}}) : helper)))
    + "</span>\r\n        </div>\r\n      </div>\r\n      <div class='navigation-control-container'>\r\n        <a class='go-home-button circle-border horizontal-center-align' href=\"#\"\r\n          title='"
    + this.escapeExpression(((helper = (helper = helpers.homeTooltip || (depth0 != null ? depth0.homeTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeTooltip","hash":{}}) : helper)))
    + "' aria-label='"
    + this.escapeExpression(((helper = (helper = helpers.homeTooltip || (depth0 != null ? depth0.homeTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeTooltip","hash":{}}) : helper)))
    + "' class='csui-acc-focusable'>\r\n            <span class='icon icon-home'></span>\r\n        </a>\r\n        <div class='go-home-text button-text horizontal-center-align' title='"
    + this.escapeExpression(((helper = (helper = helpers.homeTooltip || (depth0 != null ? depth0.homeTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeTooltip","hash":{}}) : helper)))
    + "'>\r\n            <span>"
    + this.escapeExpression(((helper = (helper = helpers.homeText || (depth0 != null ? depth0.homeText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeText","hash":{}}) : helper)))
    + "</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_error.global_impl_error.global', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/error.global/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/error.global/impl/nls/root/lang',{

  errorMessage: 'There was a problem serving the requested page.',
  backText: 'Go back',
  backTooltip: 'Navigate back to previous URL',
  homeText: 'Home',
  homeTooltip: 'Navigate to landing page'

});



csui.define('css!csui/widgets/error.global/impl/error.global',[],function(){});
csui.define('csui/widgets/error.global/error.global.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/utils/contexts/factories/global.error', 'csui/utils/contexts/factories/application.scope.factory',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/error.global/impl/error.global',
  'i18n!csui/widgets/error.global/impl/nls/lang',
  'css!csui/widgets/error.global/impl/error.global'
], function (_, $, Marionette, base, GlobalErrorModelFactory,
    ApplicationScopeModelFactory, TabableRegionBehavior, template, lang) {
  'use strict';

  var GlobalErrorView = Marionette.ItemView.extend({
    className: 'csui-global-error',

    template: template,
    templateHelpers: function () {
      return {
        errorMessage: lang.errorMessage,
        backText: lang.backText,
        backTooltip: lang.backTooltip,
        homeText: lang.homeText,
        homeTooltip: lang.homeTooltip,
        msgId: _.uniqueId('msg')
      };
    },

    TabableRegion: {
      behaviorClass: TabableRegionBehavior,
      initialActivationWeight: 100
    },

    ui: {
      errorMessage: '.error-message > span'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .go-home-button': 'onClickHome',
      'click .go-home-text': 'onClickHome',
      'click .go-back-button': 'onClickBack',
      'click .go-back-text': 'onClickBack'
    },

    constructor: function GlobalErrorView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      if (!this.model) {
        this.model = options.context.getModel(GlobalErrorModelFactory, options);
      }
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);

      // IE11 fails to update CSS center styling correctly on window resize
      if (base.isIE11()) {
        var self = this;
        var resizeHandler = function () {
          self.render();
        };
        $(window).on('resize', resizeHandler);
        this.once('before:destroy', function () {
          $(window).off('resize', resizeHandler);
        });
      }
    },

    currentlyFocusedElement: function (event) {
      return this.ui.errorMessage;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space(32) or enter(13)
        event.preventDefault();
        event.stopPropagation();
        $(event.target).trigger('click');
      }
    },

    onClickHome: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.applicationScope && this.applicationScope.set('id', '');
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.history.back();
    }

  });

  return GlobalErrorView;
});

csui.define('csui/widgets/myassignments/myassignments.columns',["csui/lib/backbone"], function (Backbone) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  // Fixed (system) columns have sequence number < 100, dynamic columns
  // have sequence number > 1000

  var MyAssignmentsTableColumns = new TableColumnCollection([
    {
      key: 'type',
      titleIconInHeader: 'mime_type',
      sequence: 10
    },
    {
      key: 'name',
      sequence: 20
    },
    {
      key: 'location_id',
      sequence: 30
    },
    {
      key: 'date_due',
      sequence: 40
    },
    {
      key: 'priority',
      sequence: 50
    },
    {
      key: 'status',
      sequence: 60
    },
    {
      key: 'from_user_name',
      sequence: 70
    }
  ]);

  return MyAssignmentsTableColumns;

});

csui.define('csui/widgets/myassignments/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/myassignments/impl/nls/root/lang',{
  dialogTitle: 'My Assignments',
  searchTitle: 'Search My Assignments',
  searchPlaceholder: 'My Assignments',
  searchAria: 'Search for assignments',
  expandAria: 'Expand the My Assignments widget',
  emptyListText: 'No item to display.',
  loadingListText: 'Loading results...',
  failedListText: 'Loading results failed.',
  openMyAssignmentsView: 'Open my assignments view'

  // Note: column titles are defined on the module
  // Note: use the exact 'column_key' for the client-side column titles
});



csui.define('css!csui/widgets/myassignments/impl/myassignments',[],function(){});
// Shows a list of links to current user's assignments
csui.define('csui/widgets/myassignments/myassignments.view',['module', 'csui/lib/underscore',
  'csui/utils/base',
  'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstateful.view',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/myassignments',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'i18n!csui/widgets/myassignments/impl/nls/lang',
  'css!csui/widgets/myassignments/impl/myassignments'
], function (module, _, base, Marionette, ListView, ExpandedListitem, LimitingBehavior,
    ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    MyAssignmentCollectionFactory, ApplicationScopeModelFactory, NodeTypeIconView, BlockingView, lang) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    openInPerspective: true
  });

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var MyAssignmentsView = ListView.extend({

    constructor: function MyAssignmentsView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'date_due asc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-assignments';

      var context = options.context,
          viewStateModel = context && context.viewStateModel;
      this._enableOpenPerspective = config.openInPerspective &&
                                    viewStateModel && viewStateModel.get('history');

      ListView.prototype.constructor.apply(this, arguments);
      BlockingView.imbue(this);
      this.context = context;
      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchTitle: lang.searchTitle,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria,
        openPerspectiveAria: lang.openMyAssignmentsView,
        openPerspectiveTooltip: lang.openMyAssignmentsView,
        enableOpenPerspective: this._enableOpenPerspective
      };
    },

    childView: ExpandedListitem,

    childViewOptions: {
      templateHelpers: function () {

        var dueDate = this.model.get('date_due');
        var dateValue = new Date(dueDate);
        var currentDate = new Date();
        var infoState = dateValue < currentDate ? 'Warning' : 'Success';
        var info = base.formatFriendlyDate(dueDate);
        var description = this.model.get('description');
        var type_name = this.model.get('location_name') || this.model.get('type_name');
        type_name || (type_name = "Workflow");
        description || (description = type_name);

        return {
          name: this.model.get('short_name'),
          enableIcon: true,
          description: description,
          info: info,
          infoState: infoState,
          type: type_name
        };
      },
      checkDefaultAction: true
    },

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          var collection = this.options.collection ||
                           this.options.context.getCollection(MyAssignmentCollectionFactory);
          // Limit the scope of the response
          collection.excludeResources();
          collection.resetFields();
          collection.setFields({assignments: []});
          collection.resetExpand();
          return collection;
        },
        limit: 0
      },
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/myassignmentstable/myassignmentstable.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'assignments'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    onRender: function () {
      ListView.prototype.onRender.apply(this, arguments);
      this.$el.addClass('cs-assignments');
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();

      childView.$el.attr('role', 'option');
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onClickHeader: function (target) {
      this.onClickOpenPerspective(target);
    },

    onClickOpenPerspective: function (target) {
      this.applicationScope.set('id','myassignments');
      this.trigger('open:myassignments:perspective');
    }

  });

  return MyAssignmentsView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/placeholder/impl/placeholder',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\r\n";
}});
Handlebars.registerPartial('csui_widgets_placeholder_impl_placeholder', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/placeholder/impl/placeholder',[],function(){});
csui.define('csui/widgets/placeholder/placeholder.view',['csui/lib/backbone', 'csui/lib/marionette',
  'hbs!./impl/placeholder', 'css!./impl/placeholder'
], function (Backbone, Marionette, placeholderTemplate) {

  var PlaceholderView = Marionette.ItemView.extend({

    className: 'cs-placeholder tile',
    template: placeholderTemplate,

    constructor: function PlaceholderView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = new Backbone.Model({
          label: options.data.label,
          bgcolor: options.data.bgcolor,
          color: options.data.color
        });
      }
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      this.$el.css({
        color: this.model.get('color'),
        backgroundColor: this.model.get('bgcolor')
      });
    }

  });

  return PlaceholderView;
});

csui.define('csui/widgets/recentlyaccessed/recentlyaccessed.columns',["csui/lib/backbone"], function (Backbone) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  // Fixed (system) columns have sequence number < 100, dynamic columns
  // have sequence number > 1000

  var RecentlyAccessedTableColumns = new TableColumnCollection([
    {
      key: 'type',
      titleIconInHeader: 'mime_type',
      sequence: 10
    },
    {
      key: 'name',
      sequence: 20
    },
    {
      key: 'reserved',
      sequence: 30,
      noTitleInHeader: true // don't display a column header
    },
    {
      key: 'parent_id',
      sequence: 40
    },
    {
      key: 'access_date_last',
      sequence: 50
    },
    {
      key: 'size',
      sequence: 60
    },
    {
      key: 'modify_date',
      sequence: 70
    },
    {
      key: 'favorite',
      sequence: 910,
      noTitleInHeader: true, // don't display a column header
      permanentColumn: true // don't wrap column due to responsiveness into details row
    }
  ]);

  return RecentlyAccessedTableColumns;

});

csui.define('csui/widgets/recentlyaccessed/tileview.toolbaritems',['csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/recentlyaccessed/tileview.toolbaritems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraToolItems) {
  'use strict';
  var toolbarItems = {

    // inline action bar
    inlineActionbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              commandData: {dialogView: true}
            }
          ],
          share: [
            {
              signature: "CopyLink", name: lang.ToolbarItemCopyLink
            }
          ],
          edit: [
            {signature: "Edit", name: lang.ToolbarItemEdit}
          ],
          other: [
            {
              signature: "Download", name: lang.ToolbarItemDownload
            },
            {
              signature: "goToLocation", name: lang.ToolbarGoToLocation
            }
          ]
        },
        {
          maxItemsShown: 1,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32"
        })
  };

  if (extraToolItems) {
    addExtraToolItems(extraToolItems);
  }

  function addExtraToolItems(extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return toolbarItems;

});

csui.define('csui/widgets/recentlyaccessed/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/recentlyaccessed/impl/nls/root/lang',{
  dialogTitle: 'Recently Accessed',
  searchTitle: 'Search Recently Accessed',
  searchPlaceholder: 'Recently Accessed',
  searchAria: 'Search for recently accessed objects',
  expandAria: 'Expand the Recently Accessed widget',
  emptyListText: 'There are no items to display.',
  loadingListText: 'Loading results...',
  failedListText: 'Loading results failed.',
  // Note: use the exact 'column_key' for the client-side column titles
  access_date_last: 'Last Accessed',
  parent_id: 'Location',
  openRecentlyAccessedView: 'Open recently accessed view'
});



csui.define('css!csui/widgets/recentlyaccessed/impl/recentlyaccessed',[],function(){});
// Shows a list of links to current user's recently accessed nodes
csui.define('csui/widgets/recentlyaccessed/recentlyaccessed.view',['module', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstandard.view',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/commands',
  'csui/widgets/recentlyaccessed/tileview.toolbaritems',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/base',
  'i18n!csui/widgets/recentlyaccessed/impl/nls/lang',
  'i18n!csui/controls/listitem/impl/nls/lang',
  'css!csui/widgets/recentlyaccessed/impl/recentlyaccessed'
], function (module, _, Marionette, ListView, ListItemStandard,
    LimitingBehavior, ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    RecentlyAccessedCollectionFactory, NodeTypeIconView, BlockingView, ApplicationScopeModelFactory,
    commands, tileViewToolbarItems, GlobalMessage, base, lang, listItemLang) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    openInPerspective: true
  });

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var RecentlyAccessedView = ListView.extend({

    constructor: function RecentlyAccessedView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'access_date_last desc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-recentlyaccessed';

      options.tileViewToolbarItems = tileViewToolbarItems;
      this.context = options.context;
      this.showInlineActionBar = options.showInlineActionBar === false ?
                                 options.showInlineActionBar : true;

      var context        = options.context,
          viewStateModel = context && context.viewStateModel;
      this._enableOpenPerspective = config.openInPerspective &&
                                    viewStateModel && viewStateModel.get('history');

      ListView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchTitle: lang.searchTitle,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria,
        openPerspectiveAria: lang.openRecentlyAccessedView,
        openPerspectiveTooltip: lang.openRecentlyAccessedView,
        enableOpenPerspective: this._enableOpenPerspective
      };
    },

    childView: ListItemStandard,

    childViewOptions: function () {
      var toolbarData = this.showInlineActionBar ? {
        toolbaritems: this.options.tileViewToolbarItems,
        collection: this.completeCollection
      } : undefined;

      return {
        templateHelpers: function () {
          return {
            name: this.model.get('short_name'),
            enableIcon: true,
            showInlineActionBar: this.showInlineActionBar,
            itemLabel: _.str.sformat(listItemLang.itemTitleLabel, this.model.get('short_name'))
          };
        },
        context: this.context,
        checkDefaultAction: true,
        // Set these values in order to display Inline Actions
        toolbarData: toolbarData
      };
    },

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          var nonPromotedActionCommands = commands.getSignatures(tileViewToolbarItems);
          var collection = this.options.collection ||
                           this.options.context.getCollection(RecentlyAccessedCollectionFactory, {
                             options: {
                               promotedActionCommands: [],
                               nonPromotedActionCommands: nonPromotedActionCommands
                             }
                           });
          var limitedRS = RecentlyAccessedCollectionFactory.getLimitedResourceScope();
          collection.setResourceScope(limitedRS);
          collection.setEnabledDelayRestCommands(false);
          collection.setEnabledLazyActionCommands(false);
          return collection;
        },
        limit: 0
      },
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/recentlyaccessedtable/recentlyaccessedtable.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'recentlyaccessed'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    onRender: function () {
      ListView.prototype.onRender.apply(this, arguments);
      this.$el.addClass('cs-recentlyaccessed');

      if (this.completeCollection.delayedActions) {
        this.listenTo(this.completeCollection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();

      childView.$el.attr('role', 'option');
      childView.$el.attr('aria-label',
          _.str.sformat(listItemLang.typeAndNameAria, childView._nodeIconView.model.get('title'),
              childView.model.get('short_name')));
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onClickHeader: function (target) {
      this.onClickOpenPerspective(target);
    },

    onClickOpenPerspective: function (target) {
      this.applicationScope.set('id', 'recentlyaccessed');
      this.trigger('open:recentlyaccessed:perspective');
    }

  });

  return RecentlyAccessedView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcut/impl/shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"tile-header\">\r\n  <div class=\"tile-title\">\r\n    <h2 class=\"csui-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.short_name || (depth0 != null ? depth0.short_name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"short_name","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"tile-icon\">\r\n  <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcut_impl_shortcut', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/shortcut/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcut/impl/nls/root/lang',{
  loadingText: 'Loading...'
});



csui.define('css!csui/widgets/shortcut/impl/shortcut',[],function(){});
// Shows the Shortcut widget of a specific node
csui.define('csui/widgets/shortcut/shortcut.view',[
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/utils/contexts/factories/node', 'csui/utils/node.links/node.links',
  'csui/utils/defaultactionitems', 'csui/utils/commands',
  'hbs!csui/widgets/shortcut/impl/shortcut',
  'i18n!csui/widgets/shortcut/impl/nls/lang',
  'css!csui/widgets/shortcut/impl/shortcut',
], function (Backbone, Marionette, DefaultActionBehavior, TabableRegionBehavior,
    ItemErrorBehavior, NodeModelFactory, nodeLinks, defaultActionItems, commands,
    shortcutTemplate, lang) {
  'use strict';

  //
  // Constructor options:
  // - node.id: The object (node) ID.  Either node.id or node.type is mandatory.
  // - node.type: The object type for known volumes (e.g. type=141 for Enterprise Workspace)
  // - icon: css icon class
  // - background: css background class
  //
  var ShortcutView = Marionette.ItemView.extend({
    tagName: 'a',

    attributes: {
      href: '#'
    },

    className: function () {
      var background = this.options.data.background || 'cs-tile-background-default';
      return 'cs-shortcut tile ' + background;
    },

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click': 'click:link'
    },

    template: shortcutTemplate,

    templateHelpers: function () {
      var name, short_name, first_space;
      if (this.model.fetched) {
        name = this.getName();
        short_name = name.length > 38 ? name.substr(0, 38) + '...' : name;
        first_space = short_name.indexOf(' ');
        if (short_name.length >= 20 && (first_space < 0 || first_space > 20)) {
          short_name = short_name.substr(0, 18) + '...';
        }
      } else {
        short_name = lang.loadingText;
      }
      return {
        short_name: short_name,
        icon: this.options.data.icon || "icon-folder",
        title: name
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ItemError: {
        behaviorClass: ItemErrorBehavior
      }
    },

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {
      return this.$el;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space(32) or enter(13)
        event.preventDefault();
        event.stopPropagation();
        this.triggerMethod("click:link");
      }
    },

    constructor: function ShortcutView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: {
            id: options.data.id || 'volume',
            type: options.data.type
          }
        });
      }

      Marionette.ItemView.prototype.constructor.call(this, options);

      // Limit the scope of the response
      this.model.excludeResources();
      this.model.resetFields();
      this.model.setFields({
        'properties': ['container', 'id', 'name', 'original_id', 'type'],
        'versions.element(0)': ['mime_type']
      });
      this.model.resetExpand();
      this.model.setExpand({
        properties: ['original_id']
      });
      this.model.resetCommands();
      this.model.setCommands(defaultActionItems.getAllCommandSignatures(commands));
    },

    onRender: function () {
      var disabled = !this.model.fetched ||
                     !this.defaultActionController.hasAction(this.model);
      this.$el[disabled ? 'addClass' : 'removeClass']('csui-disabled');
      this.$el.attr('href', nodeLinks.getUrl(this.model) || '#');
    },

    getName: function() {
      if(( this.options.data.displayName || "" ).trim().length > 0) {
        return this.options.data.displayName;
      } else {
        return this.model.get('name') || '';
      }
    },

    onClickLink: function () {
      this.triggerMethod('execute:defaultAction', this.model);
    }
  });

  return ShortcutView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-details\">\r\n    <div class=\"tile-icon\">\r\n        <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></div>\r\n    </div>\r\n\r\n    <div class=\"tile-title\">\r\n        <span class=\"csui-heading\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.shortcutAria || (depth0 != null ? depth0.shortcutAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shortcutAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcuts_impl_shortcut_impl_small.shortcut', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-details\">\r\n    <div class=\"tile-icon\">\r\n        <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></div>\r\n    </div>\r\n\r\n    <div class=\"tile-title\">\r\n        <span class=\"csui-heading\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.shortcutAria || (depth0 != null ? depth0.shortcutAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shortcutAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcuts_impl_shortcut_impl_medium.shortcut', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"tile-group\">\r\n    <div class=\"tile-icon\">\r\n        <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></div>\r\n    </div>\r\n    <div class=\"tile-title\">\r\n        <span class=\"csui-heading\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.shortcutAria || (depth0 != null ? depth0.shortcutAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shortcutAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcuts_impl_shortcut_impl_large.shortcut', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/shortcuts/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcuts/impl/nls/root/lang',{
  loadingText: 'Loading...',
  shortcutPrefixAria: 'Shortcut to',
  addShortcut: 'Add shortcut',
  removeShortcut: 'Remove shortcut',
  removeShortcutCnfrmMsg: 'Shortcut will be removed from the group.',
  groupAria: 'Shortcut Group'
});



csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/shortcut',[],function(){});

csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',[],function(){});

csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',[],function(){});

csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',[],function(){});
// Shows the Shortcuts widget of specific nodes
csui.define('csui/widgets/shortcuts/impl/shortcut/shortcut.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/utils/contexts/factories/node',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'csui/utils/node.links/node.links',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut'
], function (
    _,
    $,
    Backbone,
    Marionette,
    base,
    DefaultActionBehavior,
    ItemErrorBehavior,
    NodeModelFactory,
    defaultActionItems,
    commands,
    nodeLinks,
    smallShortcutTemplate,
    mediumShortcutTemplate,
    largeShortcutTemplate,
    lang) {

  'use strict';

  //
  // Constructor options:
  // - node.id: The object (node) ID.  Either node.id or node.type is mandatory.
  // - node.type: The object type for known volumes (e.g. type=141 for Enterprise Workspace)
  // - icon: css icon class
  // - theme: css theme class
  //
  var ShortcutView = Marionette.ItemView.extend({

    constructor: function MiniShortcutView(options) {
      options || (options = {});
      options.model = options.model || new Backbone.Model();
      options.model.set(_.defaults(options.model.attributes, {
        icon: ShortcutView.DEFAULT_ICON,
        theme: 'csui-shortcut-theme-grey-shade1',
        layout: 'small',
        id: '',
        displayName: ''
      }));

      Marionette.ItemView.prototype.constructor.call(this, options);
      this.node = this.model.get('node');
      if (!this.node) {
        this._ensureNode();
      }
      this._ensureNodeFetched();
      $(window).on('resize.' + this.cid, this._applyEllipsis.bind(this));
    },

    tagName: 'a',

    className: function () {
      var classArr = [];

      classArr.push('csui-shortcut-item');
      classArr.push('csui-acc-focusable');
      classArr.push(this.model.get('theme'));
      classArr.push('csui-' + this.model.get('layout'));

      return classArr.join(' ');
    },

    getTemplate: function () {
      switch (this.model.get('layout')) {
      case 'small':
        return smallShortcutTemplate;
      case 'medium':
        return mediumShortcutTemplate;
      default:
        return largeShortcutTemplate;
      }
    },

    templateHelpers: function () {
      var favName = this.getName();
      return {
        icon: this.model.get('icon') || ShortcutView.DEFAULT_ICON,
        name: favName,
        shortcutAria: lang.shortcutPrefixAria + " " + favName
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      ItemError: {
        behaviorClass: ItemErrorBehavior,
        model: function () {
          return this.options.model.get('node');
        },
        errorViewOptions: function () {
          return {
            low: this.model.get('layout') === 'small'
          };
        }
      }
    },

    modelEvents: {
      change: 'render',
      'change:shortcutTheme': '_onThemeChange',
      'change:id': '_ensureNode',
      'change:type': '_ensureNode'
    },

    events: {
      'click': 'onClicked'
    },

    onRender: function () {
      this._updateElement();
      this._updateNodeState();
    },

    _updateElement: function() {
      if (!!this.node) {
        this.$el.attr('href', nodeLinks.getUrl(this.node));
      }
      this.$el.attr("class", _.result(this, 'className'));
    },

    onDomRefresh: function () {
      this._applyEllipsis();
    },

    _applyEllipsis: function () {
      var name = this.$el.find('.tile-title');
      base.applyEllipsis(name, 2);
    },

    onDestroy: function () {
      $(window).off('resize.' + this.cid, this._applyEllipsis.bind(this));
    },

    _onThemeChange: function () {
      this.trigger('change:shortcutTheme');
    },

    onClicked: function (event) {
      event.preventDefault();
      this.triggerMethod('execute:defaultAction', this.node);
    },

    getName: function () {
      if ((this.model.get('displayName') || "").trim().length > 0) {
        return this.model.get('displayName');
      } else {
        return this.node.fetched ? this.node.get('name') : lang.loadingText;
      }
    },

    _ensureNode: function () {
      this.node = this.options.context.getModel(NodeModelFactory, {
        attributes: {
          id: this.options.model.get('id') || 'volume',
          type: this.options.model.get('type') || 141
        }
      });
      ShortcutView.prepareModelToFetch(this.node);
      this.model.set('node', this.node, {silent: true});
      this.trigger('update:model', this.node);
      this._ensureNodeFetched();
    },

    _ensureNodeFetched: function () {
      this.listenToOnce(this.node, 'change', this.render);
      this.node.ensureFetched({suppressError: true});
    },
    _updateErrorState: function () {
      if (this.node.error) {
        this.$el.addClass('csui-failed');
      } else {
        this.$el.removeClass('csui-failed');
      }
    },
    _updateNodeState: function () {
      if (this.node.fetched && this.defaultActionController.hasAction(this.node)) {
        this.$el.removeClass('csui-disabled');
      } else {
        this.$el.addClass('csui-disabled');
      }
      this._updateErrorState();
    },

  }, {
    prepareModelToFetch: function (model) {
      // Limit the scope of the response
      model.excludeResources();
      model.resetFields();
      model.setFields({
        'properties': ['container', 'id', 'name', 'original_id', 'type', 'custom_view_search'],
        'versions.element(0)': ['mime_type']
      });
      model.resetExpand();
      model.setExpand({
        properties: ['original_id']
      });
      model.resetCommands();
      model.setCommands(defaultActionItems.getAllCommandSignatures(commands));
    },
    DEFAULT_ICON: 'icon-folder'
  });

  return ShortcutView;

});

csui.define('csui/widgets/shortcuts/impl/nls/shortcuts.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcuts/impl/nls/root/shortcuts.manifest',{
  "widgetTitle": "Shortcut Group",
  "shortcutWidgetTitle": "Shortcut",
  "widgetDescription": "Tile representing a hyperlink to an object; it navigates to its page when clicked",
  "shortcutItemsTitle": "Shortcut Items",
  "shortcutItemsDescription": "Shortcut Items description",
  "idTitle": "Target object",
  "idDescription": "An object to open by this shortcut",
  "typeTitle": "Volume fallback",
  "typeDescription": "Sub-type number of a global volume to open by this shortcut if no object has been selected",
  "displayNameTitle": "Display name",
  "shortcutThemeTitle": "Theme",
  "shortcutThemeDescription": "Styling of the shortcuts",
  "typeEnterpriseVolume": "Enterprise",
  "typePersonalVolume": "Personal",
  "typeCategoryVolume": "Categories",
  "shortcutThemeStone1": "Stone Group 1",
  "shortcutThemeStone2": "Stone Group 2",
  "shortcutThemeTeal1": "Teal Group 1",
  "shortcutThemeTeal2": "Teal Group 2",
  "shortcutThemePink1": "Pink Group 1",
  "shortcutThemePink2": "Pink Group 2",
  "shortcutThemeIndigo1": "Indigo Group 1",
  "shortcutThemeIndigo2": "Indigo Group 2"
});



csui.define('json!csui/widgets/shortcuts/impl/shortcut/shortcut.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{shortcutWidgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {
      "shortcutTheme": {
        "title": "{{shortcutThemeTitle}}",
        "description": "{{shortcutThemeDescription}}",
        "type": "string",
        "enum": [
          "csui-shortcut-theme-stone1",
          "csui-shortcut-theme-stone2",
          "csui-shortcut-theme-teal1",
          "csui-shortcut-theme-teal2",
          "csui-shortcut-theme-pink1",
          "csui-shortcut-theme-pink2",
          "csui-shortcut-theme-indigo1",
          "csui-shortcut-theme-indigo2"
        ]
      },
      "id": {
        "title": "{{idTitle}}",
        "description": "{{idDescription}}",
        "type": "integer"
      },
      "type": {
        "title": "{{typeTitle}}",
        "description": "{{typeDescription}}",
        "type": "integer",
        "enum": [
          141,
          142,
          133
        ]
      },
      "displayName": {
        "title": "{{displayNameTitle}}",
        "type": "string"
      }
    }
  },
  "options": {
    "fields": {
      "shortcutTheme": {
        "type": "select",
        "optionLabels": [
          "{{shortcutThemeStone1}}",
          "{{shortcutThemeStone2}}",
          "{{shortcutThemeTeal1}}",
          "{{shortcutThemeTeal2}}",
          "{{shortcutThemePink1}}",
          "{{shortcutThemePink2}}",
          "{{shortcutThemeIndigo1}}",
          "{{shortcutThemeIndigo2}}"
        ]
      },
      "id": {
        "type": "otcs_node_picker",
        "type_control": {
          "parameters": {
            "select_types": []
          }
        }
      },
      "type": {
        "type": "select",
        "optionLabels": [
          "{{typeEnterpriseVolume}}",
          "{{typePersonalVolume}}",
          "{{typeCategoryVolume}}"
        ]
      }
    }
  }
});

// Shows the Shortcuts widget of specific nodes
csui.define('csui/widgets/shortcuts/impl/shortcut/editable.shortcut.view',[
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/widgets/shortcuts/impl/shortcut/shortcut.view',
  'csui/models/widget/widget.model',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  'i18n!csui/widgets/shortcuts/impl/nls/shortcuts.manifest',
  'json!csui/widgets/shortcuts/impl/shortcut/shortcut.manifest.json',
], function (require, _,
    $,
    Backbone,
    Marionette,
    MiniShortcutView,
    WidgetModel,
    lang,
    manifestLang,
    shortcutManifest) {

  'use strict';

  // Resolve translations.
  shortcutManifest = WidgetModel.resolveLocalizedManifest('shortcut.manifest', shortcutManifest,
      manifestLang);

  /**
   * To be used when shortcutview in editmode to provide configuration capability
   */
  var EditableMiniShortcutView = MiniShortcutView.extend({

    constructor: function EditableMiniShortcutView(options) {
      options || (options = {});
      options.model = options.model || new Backbone.Model();
      this._injectConfigurationBehaviour(options);
      if (options.container.options.data.___pman_isdropped &&
          options.collection.getShortcuts().length === 0) {
        options.model.set('___pman_opencallout', true, {silent: true});
      }
      MiniShortcutView.prototype.constructor.apply(this, arguments);
      this._registerEventHandlers();
    },

    // Use DIV as container, since Anchor shouldn't have focusable elements childrens.
    // Also In EditMode, this shortcut item container, is not required to be a link
    tagName: 'div', 

    modelEvents: _.defaults({
      'refresh:mask': 'onRefreshMask',
    }, _.result(MiniShortcutView.prototype, 'modelEvents')),

    onRefreshMask: function () {
      var configOptions = this._getDefaultWidgetConfig();
      this.trigger('refresh:mask', configOptions);
    },

    /**
   *  Keep the masking element attached to the DOM to keep flyout open if the shortcut has a popover flyout
   */
    attachElContent: function (html) {
      var flyoutConfig = this.$el.find('.csui-configure-perspective-widget .pman-widget-popover');
      if (flyoutConfig.length) {
        this.$el.children().not('.csui-configure-perspective-widget').remove();
        this.$el.prepend($(html));
      } else {
        this.$el.html(html);
      }
      return true;
    },

    _getDefaultWidgetConfig: function (options) {
      options || (options = this.options);
      var configOptions = {
        allowReplace: false,
        notifyUpdatesImmediatly: true
      };
      if (options.collection.getShortcuts().length > 1) {
        configOptions = _.extend(configOptions, {
          removeConfirmTitle: lang.removeShortcut,
          removeConfirmMsg: lang.removeShortcutCnfrmMsg,
          confirmOnRemove: false
        });
      }
      return configOptions;
    },

    _injectConfigurationBehaviour: function (options) {
      var configOptions = this._getDefaultWidgetConfig(options);
      this.behaviors = _.defaults({
        PerspectiveWidgetConfig: _.extend({ // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          widgetConfig: function () {
            return {
              options: options.model.attributes
            };
          },
          manifest: shortcutManifest
        }, configOptions)
      }, this.behaviors);
    },

    isShortcutValid: function (options) {
      var isValid = true;
      if (this.collection.getShortcuts().length === 0 && this.options.perspectiveMode === "edit") {
        isValid = this.isOptionsValid(options);
      }
      return isValid;
    },

    validateConfiguration: function (options) {
      var isValid = this.isShortcutValid(options);
      var action = !isValid ? 'addClass' : 'removeClass';
      this.$el.find(".tile-group")[action]('binf-hidden');
      this.$el[action]('csui-pman-shortcut-error');
      return isValid;
    },

    isOptionsValid: function (options) {
      return (!!options.id || !!options.type);
    },

    _updateShortcut: function (args) {
      if (this.isShortcutValid(args.options)) {
        this.$el.find('.csui-configure-perspective-widget').removeClass(
            'binf-perspective-has-error');
      }
    },

    _registerEventHandlers: function () {
      this.listenTo(this, 'delete:widget', function () {
        delete this.options.container.options.data.___pman_opencallout;
      });
      this.listenTo(this, 'update:widget:options', this._updateShortcut);
    },

    // START of Overriden functions from MiniShortcutView
    _updateElement: function () {
      // Since DIV is being used as container, this doesn't need HREF attribute
      this.$el.attr("class", _.result(this, 'className'));
    },

    _ensureNode: function () {
      if (!this._isNewPlaceholder()) {
        MiniShortcutView.prototype._ensureNode.apply(this, arguments);
      } else {
        // Dummy placeholder node
        this.node = new Backbone.Model();
      }
    },

    _ensureNodeFetched: function () {
      if (!this._isNewPlaceholder()) {
        this.isUpdating = true;
        MiniShortcutView.prototype._ensureNodeFetched.apply(this, arguments);
        delete this.isUpdating;
      }
    },

    _updateNodeState: function () {
      if (!this._isNewPlaceholder()) {
        MiniShortcutView.prototype._updateErrorState.apply(this, arguments);
      }
    },

    getName: function () {
      if (!this._isNewPlaceholder()) {
        return MiniShortcutView.prototype.getName.apply(this, arguments);
      } else {
        return lang.addShortcut;
      }
    },

    onRender: function () {
      MiniShortcutView.prototype.onRender.apply(this, arguments);
      if (this._isNewPlaceholder()) {
        this.$el.addClass('csui-pman-shortcut-new');
      }
      this.$el.addClass('csui-pman-editable-widget');
    },

    onClicked: function (event) {
      event.preventDefault();
      if (!this.$el.find('.pman-widget-popover').has(event.target).length) {
        event.stopPropagation();
      }
    },

    _isNewPlaceholder: function (options) {
      return (options || this.options).model.isAddShortcut();
    }
  });

  return EditableMiniShortcutView;

});


csui.define('css!csui/widgets/shortcuts/impl/shortcuts',[],function(){});
// Shows the Shortcuts widget of specific nodes
csui.define('csui/widgets/shortcuts/shortcuts.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/shortcuts/impl/shortcut/shortcut.view',
  'csui/widgets/shortcuts/impl/shortcut/editable.shortcut.view',
  'csui/utils/contexts/factories/node',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/utils/perspective/perspective.util',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  "css!csui/widgets/shortcuts/impl/shortcuts"
], function (_,
    $,
    Backbone,
    Marionette,
    TabableRegionBehavior,
    MiniShortcutView,
    EditableShortcutView,
    NodeModelFactory,
    ViewEventsPropagationMixin,
    PerspectiveUtil,
    lang) {

  'use strict';

  var THEME_SUFFIX = ["shade1", "shade2", "shade3", "shade4"];

  var ShortcutModel = Backbone.Model.extend({
    idAttribute: 'shortcutItemId',

    isAddShortcut: function () {
      return this.get('isAddNew') === true;
    }
  });

  var ShortcutsCollection = Backbone.Collection.extend({

    constructor: function (models, options) {
      options || (options = {});
      _.defaults(options, {
        model: ShortcutModel,
        comparator: function (a, b) {
          if (b.get('isAddNew')) {
            return -1;
          }
          return 0;
        }
      });
      this.options = options;
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    getShortcuts: function () {
      return this.filter(function (model) {
        return !model.isAddShortcut();
      });
    },

    evaluateAddNewExistence: function () {
      var widgetId = this.options[PerspectiveUtil.KEY_WIDGET_ID];
      if (this.options.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE &&
          (widgetId && !PerspectiveUtil.isPersonalWidgetId(widgetId))) {
        return;
      }
      var newItem = this.where(function (model) {
        return model.isAddShortcut();
      });
      if (this.length < 4 && newItem.length === 0) {
        this.add({
          id: '',
          isAddNew: true,
          icon: 'icon-new',
          displayName: ''
        });
        return true;
      } else if (this.length > 4 && newItem.length > 0) {
        this.remove(newItem);
        return true;
      }
      return false;
    }
  });

  //
  // Constructor options:
  // - shortcutItems: Array
  //    - 
  // - node.id: The object (node) ID.  Either node.id or node.type is mandatory.
  // - node.type: The object type for known volumes (e.g. type=141 for Enterprise Workspace)
  // - icon: css icon class
  // - shortcutTheme: css theme class
  //
  var ShortcutsView = Marionette.CollectionView.extend({

    constructor: function ShortcutsView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options = _.defaults(options, {
        reorderOnSort: true,
        widgetContainer: this
      });
      options.data = this._normalizeData(options.data);

      options.collection = options.collection || new ShortcutsCollection([],
          _.pick(options, 'perspectiveMode', PerspectiveUtil.KEY_WIDGET_ID));
      Marionette.CollectionView.prototype.constructor.call(this, options);
    },

    tagName: 'div',

    className: "csui-shortcut-container tile csui-shortcut-group-container",

    attributes: {
      role: 'navigation',
      "aria-label": lang.groupAria
    },

    regions: {
      "shortcut0": ".shortcut-region-0",
      "shortcut1": ".shortcut-region-1",
      "shortcut2": ".shortcut-region-2",
      "shortcut3": ".shortcut-region-3"
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: function () {
      var evts = {
        "keydown": "onKeyInView"
      };

      if (this._isInlineEditMode()) {
        evts = _.extend(evts, {
          "drop": "onDrop",
          "dragover": "onDragOver",
          "dragenter": "onDragEnter"
        });
      }

      return evts;
    },

    childView: MiniShortcutView,
    childEvents: {
      'change:shortcutTheme': '_onChangeTheme',
      'add:shortcut': '_onAddShortcut',
      'delete:widget': '_onRemoveShortcut',
      'update:widget:options': '_updateShortcutOptions'
    },
    childViewOptions: function (model, index) {
      return {
        context: this.options.context,
        collection: this.options.collection,
        container: this,
        perspectiveMode: this.options.perspectiveMode
      };
    },

    buildChildView: function (child, ChildViewClass, childViewOptions) {
      if (this._isInlineEditMode()) {
        ChildViewClass = EditableShortcutView;
      } else {
        ChildViewClass = MiniShortcutView;
      }
      return Marionette.CollectionView.prototype.buildChildView.call(this, child, ChildViewClass,
          childViewOptions);
    },

    _normalizeData: function (data) {
      data || (data = {shortcutItems: []});
      data.shortcutTheme || (data.shortcutTheme = '');
      return data;
    },

    initialize: function () {
      this.listenTo(this.collection, 'add', this._onCollectionChange)
          .listenTo(this.collection, 'remove', this._onCollectionChange)
          .listenTo(this.collection, 'reset', this._onCollectionChange);

      if (this._isInlineEditMode()) {
        this.listenTo(this.collection, 'add', this._onCollectionInlineAdd)
            .listenTo(this.collection, 'remove', this._onCollectionInlineRemove);
      }

      var shortcutItems = _.map(_.first(this.options.data.shortcutItems || [], 4), _.clone);
      // Fetch all models before rendering tiles.
      this._fetchModels(shortcutItems).always(_.bind(function () {
        this._setupCollection(shortcutItems);
      }, this));
      this._currentShortcutIndex = 0;
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
    },

    _fetchModels: function (shortcutItems) {
      var seft = this;
      var models = _.map(shortcutItems, function (item) {
        item.id = item.id || item.launchButtonID;
        var model = seft.options.context.getModel(NodeModelFactory, {
          attributes: {
            id: (item.id || item.launchButtonID) || 'volume',
            type: item.type
          }
        });
        MiniShortcutView.prepareModelToFetch(model);
        return model;
      });

      var modelPromises = _.map(models, function (model) {
        return model.fetch({suppressError: true});
      });

      var result = $.whenAll.apply($, modelPromises);
      result.always(function () {
        _.each(shortcutItems, function (item, index) {
          item.node = models[index];
        });
      });
      return result;
    },

    _setupCollection: function (shortcutItems) {
      if (!this._isInlineEditMode()) {
        // Remove invalid / unknow nodes.
        var validShortcuts = _.filter(shortcutItems, function (item) {
          return !item.node.error;
        });
        if (validShortcuts.length > 0) {
          shortcutItems = validShortcuts;
        } else {
          // When all nodes are invalid, keep first to show "error" message / tile.
          shortcutItems = _.first(shortcutItems, 1);
        }
      }
      shortcutItems = shortcutItems || [];
      this.collection.reset(shortcutItems);
    },

    _isInlineEditMode: function () {
      return !!this.options.perspectiveMode;
    },

    _onCollectionChange: function () {
      if (this._isInlineEditMode()) {
        this.collection.evaluateAddNewExistence();
      }
      this._updateShortcutStyles();
    },

    _onCollectionInlineAdd: function () {
      this.collection.each(function (model) {
        model.trigger('refresh:mask');
      });
    },

    _onCollectionInlineRemove: function () {
      this.collection.each(function (model) {
        model.trigger('refresh:mask');
      });
    },

    _getLayout: function (size) {
      var layout = "small";
      if (size === 1) {
        layout = "large";
      } else if (size === 2) {
        layout = "medium";
      }
      return layout;
    },

    _getShortcutTheme: function (itemIndex, numberOfItems) {
      var theme = this.options.data.shortcutTheme ? this.options.data.shortcutTheme :
                  "csui-shortcut-theme-grey";
      if (numberOfItems > 1) {
        itemIndex += (4 - numberOfItems);
        theme += "-" + THEME_SUFFIX[itemIndex];
      }

      return theme;
    },

    _updateShortcutOptions: function (shortcutItemView, args) {
      var itemModel = shortcutItemView.model;
      if (itemModel.get('isAddNew')) {
        if (args.softUpdate) {
          return;
        }
        if (!args.isValid || !shortcutItemView.isOptionsValid(args.options)) {
          if (this.options.perspectiveMode === "edit") {
            this._notifyOptionsChange(!shortcutItemView.isShortcutValid(args.options));
          }
          return;
        }
        itemModel.set({'isAddNew': undefined, displayName: undefined, icon: undefined},
            {silent: true, unset: true});
      }
      shortcutItemView.isUpdating = true;
      itemModel.set(args.options);
      this._notifyOptionsChange();
      var isCollChanged = this.collection.evaluateAddNewExistence();
      delete shortcutItemView.isUpdating;
      if (!isCollChanged) {
        this._updateShortcutStyles();
        shortcutItemView.model.trigger('refresh:mask');
      }
    },

    _onRemoveShortcut: function (shortcutItemView) {
      this.collection.remove(shortcutItemView.model);
      var shortcutItems = this.collection.getShortcuts();
      if (shortcutItems.length === 0) {
        // No shortcuts left in the group. Hence remove widget
        this.options.widgetContainer.trigger('remove:widget');
      } else {
        // Otherwise, notify to update options
        this._notifyOptionsChange();
      }
    },

    _notifyOptionsChange: function (isInvalid) {
      var shortcutItems = this.collection.getShortcuts().map(function (model) {
        return {
          id: model.get('id'),
          type: model.get('type'),
          displayName: model.get('displayName')
        };
      });
      this.options.widgetContainer.trigger('update:widget:options', {
        shortcutTheme: this.collection.first().get('shortcutTheme'),
        shortcutItems: shortcutItems,
        isValid: !isInvalid
      });
    },

    _onChangeTheme: function (childView) {
      this.options.data.shortcutTheme = childView.model.get('shortcutTheme');
      this._updateShortcutStyles();
    },

    _onAddShortcut: function (childView, model) {
      this.collection.add({
        id: '',
        icon: '',
        displayName: '',
        type: 141,
        shortcutTheme: this.options.data.shortcutTheme
      }, {at: this.collection.length - 1});
      this.collection.sort();
      this._notifyOptionsChange();
    },

    _updateShortcutStyles: function () {
      var shortcutTheme = this.options.data.shortcutTheme,
          layout        = this._getLayout(this.collection.length);
      this.collection.each(function (model, index) {
        var totalShortcuts = !this._isInlineEditMode() ? this.collection.length :
                             this.collection.getShortcuts().length,
            theme          = this._getShortcutTheme(index, totalShortcuts);
        model.set({
          layout: layout,
          theme: theme,
          shortcutTheme: shortcutTheme
        });
      }, this);
    },

    onDrop: function (event) {
      this.options.widgetContainer.trigger('replace:widget', event);
    },

    onDragOver: function (event) {
      event.preventDefault();
    },

    onDragEnter: function (event) {
      event.preventDefault();
    },

    /** START: KN handling */
    currentlyFocusedElement: function () {
      var currentItem = this.children.findByIndex(this._currentShortcutIndex);
      return currentItem && currentItem.$el;
    },

    onKeyInView: function (event) {
      if (this._isInlineEditMode()) {
        return;
      }
      if (event.keyCode === 38) {
        this._selectPreviousShortcut();
      }
      else if (event.keyCode === 40) {
        this._selectNextShortcut();
      }
      else if (event.keyCode === 32 || event.keyCode === 13) {
        this.currentlyFocusedElement().trigger('click');
      }
    },

    _selectNextShortcut: function () {
      var index = Math.min(this._currentShortcutIndex + 1, this.collection.length - 1);
      this._selectShortcut(index);
    },

    _selectPreviousShortcut: function () {
      var index = Math.max(this._currentShortcutIndex - 1, 0);
      this._selectShortcut(index);
    },

    _selectShortcut: function (index) {
      if (index !== this._currentShortcutIndex) {
        this._currentShortcutIndex = index;
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().trigger('focus');
      }
    }
    /** END: KN handling */
  }, {
    migrateSingleShortcut: function (options) {
      var shortcutTheme;
      switch (options.background) {
      case 'cs-tile-background1':
        shortcutTheme = 'csui-shortcut-theme-stone1';
        break;
      case 'cs-tile-background2':
        shortcutTheme = 'csui-shortcut-theme-teal2';
        break;
      case 'cs-tile-background3':
        shortcutTheme = 'csui-shortcut-theme-pink1';
        break;
      }
      return {shortcutItems: [options], shortcutTheme: shortcutTheme};
    },

    migrateData: function (widgetType, options) {
      switch (widgetType) {
      case 'shortcut':
      case 'csui/widgets/shortcut':
        return ShortcutsView.migrateSingleShortcut(options);
      default:
        return options;
      }
    }
  });

  _.extend(ShortcutsView.prototype, ViewEventsPropagationMixin);

  return ShortcutsView;

});

csui.define('csui/widgets/welcome.placeholder/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/welcome.placeholder/impl/nls/root/lang',{
  greetingWithName: 'Hello {0}',
  greetingWithoutName: 'Hello',
  greetingMorning: 'Good morning, {0}!',
  greetingAfternoon: 'Good afternoon, {0}!',
  greetingEvening: 'Good evening, {0}!',
  videoLabel: 'Smart UI introduction video',
  videoSrc: '//sunnyside.vidavee.com/opentext/rest/file/GetFileAsset/EBC85A92D0C5DE3A272CC1C165E85A78/introVideo_2020.mp4',
  videoPoster: '//sunnyside.vidavee.com/opentext/rest/file/GetFileThumbnail/EBC85A92D0C5DE3A272CC1C165E85A78/thumbnail.jpg',
  message: 'As a foundational technology in the Digital Workplace, OpenText Content Suite will pave the way to personal productivity, seamless collaboration, and integration with business processes.'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n  <div class=\"binf-modal-dialog\">\r\n    <div class=\"binf-modal-content csui-video\">\r\n      <video  preload=\"none\"\r\n             poster=\""
    + this.escapeExpression(((helper = (helper = helpers.videoPoster || (depth0 != null ? depth0.videoPoster : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"videoPoster","hash":{}}) : helper)))
    + "\"\r\n             controls=\"controls\">\r\n        <source\r\n          src=\""
    + this.escapeExpression(((helper = (helper = helpers.videoSrc || (depth0 != null ? depth0.videoSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"videoSrc","hash":{}}) : helper)))
    + "\"\r\n          type=\"video/mp4\">\r\n        </source>\r\n      </video>\r\n\r\n    </div>\r\n  </div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_welcome.placeholder_impl_welcome.video_welcome.video', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',[],function(){});
csui.define('csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', "csui/utils/url", 'csui/utils/contexts/factories/node',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',
  'css!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, base, Url, NodeModelFactory, lang,
  TabablesBehavior, TabableRegionBehavior, template) {

  var WelcomeVideo = Marionette.ItemView.extend({

    _dataDefaults:{
      videoSrc: lang.videoSrc,
      videoPoster: lang.videoPoster
    },

    className: 'cs-dialog welcome-video binf-modal binf-fade',

    template: template,

    events: {
      'hide.binf.modal': 'onDestroy',
      'hidden.binf.modal': 'onDestroy',
      'keydown video' : 'onKeyDown',
      'shown.binf.modal': 'onShown'
    },

    templateHelpers: function(){
      var optionsData = this.options.data;
      return {
        videoSrc: optionsData.videoSrc,
        videoPoster: optionsData.videoPoster
      };
    },

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function WelcomeVideo(options) {
      options || (options = {});
      options.data || (options.data = {});
      _.each(this._dataDefaults, function(value,key){
        var serverValue = options.data[key];
        if (!serverValue){
          options.data[key] = value;
        }
      });
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.connection = options.context.getModel(NodeModelFactory).connector.connection;
    },

    onKeyDown: function(event) {
      if(event.keyCode === 27) {
        this.destroy();
      }
    },

    onDestroy: function(){
      TabablesBehavior.popTabableHandler();
      this.$el.remove();
    },


    show: function () {
      this.render();
      if (base.isAppleMobile()){
        this.$el.addClass('mobile');
      }
      this.$el.binf_modal('show');
    },

    onShown: function () {
    this.$('video').trigger('focus');
   }



  });

  return WelcomeVideo;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/welcome.placeholder/impl/welcome.placeholder',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <button class=\"csui-videoButton\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.videoLabel || (depth0 != null ? depth0.videoLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"videoLabel","hash":{}}) : helper)))
    + "\"></button>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"csui-message\">\r\n      <p title=\""
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</p>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "\r\n<div class=\"csui-hero-tile\">\r\n  <div class=\"csui-hero-left\">\r\n    <div class=\"csui-greeting\">"
    + this.escapeExpression(((helper = (helper = helpers.greeting || (depth0 != null ? depth0.greeting : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"greeting","hash":{}}) : helper)))
    + "</div>\r\n    <span class=\"csui-date\">"
    + this.escapeExpression(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"date","hash":{}}) : helper)))
    + "</span>\r\n  </div>\r\n    <div class=\"csui-hero-right\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.includeVideo : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.includeMessage : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_welcome.placeholder_impl_welcome.placeholder', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/welcome.placeholder/impl/welcome.placeholder',[],function(){});
csui.define('csui/widgets/welcome.placeholder/welcome.placeholder.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/contexts/factories/user',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video.view',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/lang',
  'hbs!csui/widgets/welcome.placeholder/impl/welcome.placeholder',
  'css!csui/widgets/welcome.placeholder/impl/welcome.placeholder'
], function ($,
    _,
    Marionette,
    base,
    UserModelFactory,
    TabableRegionBehavior,
    WelcomeVideo,
    lang,
    placeholderTemplate) {

  var WelcomeView = Marionette.ItemView.extend({

    _dataDefaults: {
      includeMessage: true,
      includeVideo: true,
      message: lang.message
    },

    className: 'tile hero',

    template: placeholderTemplate,

    ui: {
      welcomeMessageContainer: '> .csui-hero-tile .csui-message',
      welcomeMessage: '> .csui-hero-tile .csui-message > p'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    triggers: {
      'click .csui-hero-tile': 'show:video'
    },

    templateHelpers: function () {
      var optionsData = this.options.data,
          firstName   = this.user.get('first_name'),
          date        = new Date(),
          hour        = date.getHours(),
          greeting    = hour < 12 ? lang.greetingMorning :
                        hour < 18 ? lang.greetingAfternoon : lang.greetingEvening;

      // TODO the no-firstname-case will fail with some localized language files, where the expected format , {0} was not kept by translators.
      greeting = firstName ? _.str.sformat(greeting, firstName) : greeting.replace(/, |\{0\}/g, '');

      return {
        videoSrc: optionsData.videoSrc,
        videoPoster: optionsData.videoPoster,
        includeMessage: optionsData.includeMessage,
        includeVideo: optionsData.includeVideo,
        greeting: greeting,
        message: optionsData.message,
        videoLabel: lang.videoLabel,
        date: date.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      };
    },

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {
      return this.$el;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space(32) or enter(13)
        event.preventDefault();
        event.stopPropagation();
        this.triggerMethod("show:video");
      }
    },

    constructor: function WelcomeView(options) {
      options || (options = {});
      options.data || (options.data = {});
      _.each(this._dataDefaults, function(value,key){
        var serverValue = options.data[key];
        if (serverValue == null || serverValue === ''){
          options.data[key] = value;
        }
      });
      Marionette.ItemView.call(this, options);
      this.user = options.context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change', this._displayUsername);
      $(window).on("resize.app", this.render);
      this.listenTo(this, 'dom:refresh', this._setTextEllipse);
    },

    onRender: function() {
      var helpers = this.templateHelpers();
      if (helpers.includeVideo) {
        this.$el.attr('aria-label', helpers.greeting + " " + helpers.videoLabel);
      }
    },

    onDestroy: function () {
      $(window).off("resize.app", this.render);
    },

    onShowVideo: function () {
      var welcomeVideo = new WelcomeVideo(this.options);
      welcomeVideo.show();
    },

    _setTextEllipse: function () {
      var welcomeMessage  = this.ui.welcomeMessage,
          containerHeight = this.ui.welcomeMessageContainer.height(),
          lineHeight      = parseInt(welcomeMessage.css('line-height'), 10) + 2;

      if (lineHeight < containerHeight) {
        while (welcomeMessage.outerHeight() > containerHeight) {
          var text = welcomeMessage.text();
          var shortenedText = text.replace(/\W*\s(\S)*$/, '...');
          if (shortenedText.length < text.length) {
            welcomeMessage.text(shortenedText);
          } else {
            break;
          }
        }
        this.ui.welcomeMessageContainer.removeClass('binf-hidden');
      }
      else {
        this.ui.welcomeMessageContainer.addClass('binf-hidden');
      }
    }
  });

  return WelcomeView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/cslink.preview/cslink.preview',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "      <div id=\"cs-link-content\" class=\"cs-link-content\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <div id=\"cs-link-image\" class=\"cs-link-image\">"
    + ((stack1 = ((helper = (helper = helpers.LinkPreviewImage || (depth0 != null ? depth0.LinkPreviewImage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"LinkPreviewImage","hash":{}}) : helper))) != null ? stack1 : "")
    + "</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div id=\"cs-link\" class=\"cs-link\">\r\n  <div class=\"cs-link-popoverhead\">\r\n    <div id=\"cs-link-heading\" class=\"cs-link-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.LinkHeading || (depth0 != null ? depth0.LinkHeading : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"LinkHeading","hash":{}}) : helper)))
    + "</div>\r\n    <div id=\"cs-link-expand\" class=\"cs-link-expand cs-link-expand-icon\"></div>\r\n  </div>\r\n  <div class=\"cs-link-preview-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPreviewContent : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isLinkPreviewImage : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_cslink.preview_cslink.preview', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/html.editor/impl/cslink.preview/cslink.preview',[],function(){});
csui.define(
    'csui/widgets/html.editor/impl/cslink.preview/cslink.preview.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
      'csui/behaviors/default.action/default.action.behavior',
      'csui/controls/rich.text.editor/impl/rich.text.util',
      'csui/models/node/node.model', 'csui/utils/commands', 'csui/utils/url',
      'hbs!csui/widgets/html.editor/impl/cslink.preview/cslink.preview',
      'i18n!csui/widgets/html.editor/impl/nls/lang',
      'css!csui/widgets/html.editor/impl/cslink.preview/cslink.preview'
    ], function ($, _, Backbone, Marionette, DefaultActionBehavior, Utils, NodeModel,
        commands, Url, linkTemplate, lang) {

      var CSLinkPreview = Marionette.ItemView.extend({
        template: linkTemplate,
        className: 'cs-link',
        behaviors: {
          DefaultAction: {
            behaviorClass: DefaultActionBehavior
          }
        },
        subTypeName: 'wiki',
        constructor: function CSLinkPreview(options) {
          options || (options = {});
          Marionette.ItemView.prototype.constructor.call(this, options);
          this.options = options;
          this.subTypeName = options.subTypeName || this.subTypeName;
          this.modelFetched = false;
          this.linkPreviewContent = null;
          this.linkPreviewImage = null;
          var that = this;
          this._obtainId().done(function () {
            that._executeProcess();
          });
        },

        _obtainId: function () {
          this.id = this.options.objId || -1;
          var targetEle  = this.options.targetEle,
              targetHref = targetEle.href || targetEle.closest('a').href;
          var hrefMatcher = targetHref.match(/^.*\/open\/(.+)$/i) ||
                            targetHref.match(/^.*\/nodes\/(.+)$/i),
              deferred    = $.Deferred(),
              that        = this,
              canResolve  = true;

          if (this.options.isSameDomain) {  // if link is of same domain
            if (!!hrefMatcher) {  // if the links contain nodes
              if (isNaN(parseInt(hrefMatcher[1]))) {    // if nodeid in link is not a number
                canResolve = false;
                var nickName = this.options.targetEle.href &&
                               this.options.targetEle.href.substring(
                                   this.options.targetEle.href.lastIndexOf("/") + 1,
                                   this.options.targetEle.href.length),
                    node;
                Utils._getNicknameId(that.options, nickName).done(function (response) {
                  node = Utils.getNewNodeModel({}, {connector: that.options.connector});
                  node.attributes = node.parse(response);
                  node = Utils.getNewNodeModel({attributes: node.attributes},
                      {connector: that.options.connector});
                  that.model = node;
                  that.id = that.model.get("id");
                  deferred.resolve();
                }).fail(function(){
                  $(that.options.targetEle).attr("title", lang.cannotFindObject);
                });
              } else {   // if nodeid is a number
                this.id = hrefMatcher[1];
              }
            }
          }
          if (!!canResolve) {
            deferred.resolve();
          }
          return deferred.promise();
        },

        _executeProcess: function () {
          if (this.id !== -1) {
            this.model = new NodeModel({
              id: this.id
            }, {
              connector: this.options.connector,
              commands: commands.getAllSignatures(),
              fields: this.options.fields || {},
              expand: this.options.expand || {}
            });

            this.model.fetch().fail(_.bind(function () {
              $(this.options.targetEle).attr("title", lang.cannotFindObject);
            }, this));
            this.listenTo(this.model, 'sync', function (e) {
              this.linkHeading = this.model.attributes.name;
              var that    = this,
                  promise = this._getContent();
              promise.done(function (res) {
                if (that.model.get('type') === 5574) {
                  that._callbackExecuteProcess(res);
                }
                else {
                  $(that.options.targetEle).attr("title",
                      _.str.sformat(lang.goToTooltip, that.model.get("name")));
                }
              });
            });
          }
          else {
            $(this.options.targetEle).attr("title", lang.previewUnavailable);
          }
        },

        _getContent: function () {
          var deferred       = $.Deferred(),
              connector      = this.options.connector,
              collectOptions = {
                url: this._getUrl(),
                type: 'GET'
              };

          connector.makeAjaxCall(collectOptions).done(function (resp) {
            deferred.resolve(resp);
          }).fail(function (resp) {
            deferred.reject(resp);
          });
          return deferred.promise();
        },

        _getUrl: function () {
          return Url.combine(this.options.connector.getConnectionUrl().getApiBase('v2'), '/' +
                 this.subTypeName +
                 '/' + this.id + "/previewcontent");
        },

        _callbackExecuteProcess: function (res) {
          this.modelFetched = true;
          this.linkPreviewImage = res.results.data.firstImage;
          this.linkPreviewContent = res.results.data.previewContent;
          var content = $("<div>" + this.linkPreviewContent + "</div>").find("*").text().trim();
          this.isEmptyContent = (content === "" || content === lang.pageDefaultContent);
          if (!this.isDestroyed) {
            $(this.options.targetEle).attr({"title":"","data-binf-original-title":""});
            if ((this.linkPreviewContent !== null && !this.isEmptyContent) ||
                this.linkPreviewImage !== null) {
              this.render();
              $(this.options.targetEle).binf_popover('show');
              if (this.linkPreviewContent !== null && !this.isEmptyContent) {
                $('.cs-link-content').html(this.linkPreviewContent);
              }
              else {
                $('.cs-link-preview-content').addClass('cs-link-image-only');
              }
              this.eventHandlers();
            } else {
              $(this.options.targetEle).attr("title",
                  _.str.sformat(lang.goToTooltip, this.model.get("name")));
            }
          }
        },

        onDestroy: function () {
          this.hidePopover();
        },
        eventHandlers: function () {
          var that = this;
          $('.cs-link-popover').on("mouseleave", function (e) {
            if ($("#" + e.target.id).attr("aria-describedby") !==
                $(that.options.targetEle).attr("aria-describedby")) {
              that.hidePopover();
            }
          });
          $('.cs-link-expand').on('click', function (e) {
            that.expandLinkView();
          });
        },
        hidePopover: function () {
          $(this.options.targetEle).binf_popover('hide');
          $(this.options.targetEle).binf_popover('destroy');
        },
        expandLinkView: function () {
          this.triggerMethod("execute:defaultAction", this.model);
        },
        onRender: function () {
          var that = this;
          if (this.modelFetched) {
            var targetEle = this.options.targetEle;
            var contentparams = {
                  "LinkHeading": this.linkHeading,
                  "isLinkPreviewImage": this.linkPreviewImage !== null ? true : false,
                  "LinkPreviewImage": this.linkPreviewImage,
                  "isPreviewContent": !this.isEmptyContent,
                  "linkPreviewContent": this.linkPreviewContent
                },
                content       = this.template(contentparams);

            $(targetEle).binf_popover({
              html: true,
              trigger: "manual",
              content: content,
              container: $.fn.binf_modal.getDefaultContainer(),
              placement: function (context) {
                $(context).addClass("cs-link-popover");
                var _tempElement = $('<div/>')
                    .attr("style", "display:none")
                    .addClass("cs-link-popover binf-popover cs-link-popover-temp-div")
                    .append(linkTemplate);
                $(targetEle).append(_tempElement);
                if (that.linkPreviewImage === null ||
                    (that.linkPreviewContent === null || that.isEmptyContent)) {
                  $(context).addClass('cs-link-preview-width');
                }
                var popOverMaxHeight = $(".cs-link-popover-temp-div").height() + 40,
                    popOverMaxWidth  = $(".cs-link-popover-temp-div").width() + 40;
                _tempElement.remove();
                var popOverSource = $(targetEle),
                    offset        = popOverSource.offset(),
                    window_left   = offset.left,
                    window_top    = offset.top,
                    window_right  = (($(window).width()) -
                                     (window_left + popOverSource.outerWidth())),
                    window_bottom = (($(window).height()) -
                                     (window_top + popOverSource.outerHeight(true)));
                if (window_bottom > popOverMaxHeight) {
                  that.popoverPosition = "bottom";
                  return "bottom";
                } else if (window_top > popOverMaxHeight) {
                  that.popoverPosition = "top";
                  return "top";
                } else if (window_right > popOverMaxWidth) {
                  that.popoverPosition = "right";
                  return "right";
                } else if (window_left > popOverMaxWidth) {
                  that.popoverPosition = "left";
                  return "left";
                } else {
                  that.popoverPosition = "auto";
                  return "auto";
                }
              }
            });
          }
          $("*").one('scroll', function () {
            that.destroy();
          });
          $(this.options.targetEle).one("remove", function () {
            that.destroy();
          });
          // hide the popover on mouseleave of target element
          $(this.options.targetEle).off("mouseleave").on("mouseleave", function (e) {
            setTimeout(function () {
              if ($(".cs-link-popover:hover").length === 0) {
                that.destroy();
              }
            }, 10);
          });
        }
      });
      return CSLinkPreview;
    });

csui.define('csui/widgets/html.editor/impl/html.editor.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node/node.model'
], function (_, $, Backbone, Url, NodeModel) {
  "use strict";

  var HtmlEditorModel = NodeModel.extend({

    constructor: function HtmlEditorModel(options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, options);
      //this.options.connector.assignTo(this);
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  _.extend(HtmlEditorModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    },

    url: function () {
      var url = Url.combine(this.options.connector.connection.url,
          "nodes/" + this.options.id + "/content");
      return url;
    },

    parse: function (response) {
      return {
        'data': response,
        'oldData': response //old Data required on cancel after updating data with autosaved
      };
    }
  });

  return HtmlEditorModel;

});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/html.editor',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class='csui-richtext-message-wrapper'>\r\n  <div id=\"csui-richtext-content-body-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" class=\"csui-richtext-message\"\r\n       contentEditable=\"false\" data-placeholder = \""
    + this.escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholder","hash":{}}) : helper)))
    + "\">\r\n    "
    + ((stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"data","hash":{}}) : helper))) != null ? stack1 : "")
    + "\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_html.editor', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"binf-dropdown\">\r\n    <a tabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)))
    + "\" class=\"binf-dropdown-toggle csui-html-editor-control\"\r\n       href=\"#\" data-binf-toggle=\"dropdown\" role=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.moreActionsAria || (depth0 != null ? depth0.moreActionsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"moreActionsAria","hash":{}}) : helper)))
    + "\"\r\n       aria-expanded=\"false\">\r\n      <span class=\"csui-icon "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.reserved : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " "
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\">\r\n      </span>\r\n    </a>\r\n    <ul class=\"binf-dropdown-menu\" role=\"menu\"></ul>\r\n  </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return " csui-html-editor-reserved-icon ";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.reserved : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"csui-icon csui-html-editor-reserved-readonly "
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)))
    + "\">\r\n    </span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.haveEditPermission : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_dropdown.menu_dropdown.menu', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.option',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a tabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.actionName || (depth0 != null ? depth0.actionName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionName","hash":{}}) : helper)))
    + "\">\r\n  "
    + this.escapeExpression(((helper = (helper = helpers.actionName || (depth0 != null ? depth0.actionName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionName","hash":{}}) : helper)))
    + "\r\n</a>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_dropdown.menu_dropdown.option', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
      'csui/lib/marionette', 'csui/models/nodes', 'csui/utils/commands',
      'csui/utils/contexts/factories/member',
      'csui/utils/base',
      'i18n!csui/widgets/html.editor/impl/nls/lang',
      'hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu',
      'hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.option'],
    function (module, _, $, Backbone, Marionette, NodeCollection, commands,
        MemberModelFactory, base, lang, TemplateDropdownMenu, TemplateDropdownOption) {
      'use strict';

      var DropdownOption = Marionette.ItemView.extend({
        tagName: 'li',
        template: TemplateDropdownOption,
        events: {
          'click a': '_executeAction',
          'keyup a': 'onKeyUp'
        },
        templateHelpers: function () {
          return {
            actionName: lang[this.model.get('signature') || this.model.get('name')]
          };
        },
        constructor: function (options) {
          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },
        _executeAction: function () {
          if (this.options.openForEdit) {
            this.options.openForEdit();
          } else {
            var cmdExe = this.options.command.execute(this.options.status);
            cmdExe.always(_.bind(function () {
              this.trigger('csui.command.executed', cmdExe);
            }, this));
          }
        },

        onKeyUp: function (event) {
          if ([13, 32].indexOf(event.keyCode) !== -1) { // enter, space
            this._executeAction();
          }
        }
      });

      var DropdownMenuView = Marionette.CompositeView.extend({
        className: "csui-html-editor-dropdown",
        template: TemplateDropdownMenu,
        childView: DropdownOption,
        childViewContainer: "ul.binf-dropdown-menu",
        childEvents: {
          'csui.command.executed': 'afterCommandExecution'
        },
        ui: {
          'dropdownMenu': '.binf-dropdown-menu'
        },
        childViewOptions: function (actionModel) {
          var signature = !!actionModel.get('openForEdit') ? 'HTMLEdit' :
                          actionModel.get('signature');
          //from restapi actionModel getting all small
          //but command signature is first cap in actual
          //signature = signature.charAt(0).toUpperCase() + signature.substring(1);
          var options = {
            status: this.status,
            node: this.options.node
          };
          if (signature === 'HTMLEdit') {
            options.openForEdit = this.options.openForEdit;
          } else {
            if (signature === 'properties') {
              //signature of properties command starts with Capital char
              //deviation from other this.model signature.
              signature = "Properties";
            } else if (['reserve', 'unreserve'].indexOf(signature) !== -1) {
              if (signature === 'unreserve') {
                signature = "Unreserve";
              } else {
                signature = "Reserve";
              }
              signature += 'Doc';
            }
            options.command = commands.get(signature);
          }
        
        
          return options;
        },
        templateHelpers: function () {
          var helpers = {
            haveEditPermission: this.haveEditPermissions,
            tooltip: lang.more,
            iconClass: 'icon-html-edit-toolbar-more',
            reserved: this.node.get('reserved'),
            moreActionsAria: _.str.sformat(lang.moreActionsAria,
                !!this.parentView.options.title ? this.parentView.options.title : '')
          };
          if (helpers.reserved) {
            var selfReserved = this.node.get('reserved_user_id') === this.user.get(
                    'id');
            if (!selfReserved) {
              helpers.tooltip = _.str.sformat(lang.reservedBy, this.node.get('reserved_user_id'),
                  base.formatExactDate((
                      this.node.get('reserved_date'))));
            }
            helpers.iconClass = selfReserved ? 'icon-html-editor-reserved-owned' :
                                'icon-html-editor-reserved_other';
          }
          return helpers;
        },

        constructor: function DropdownMenuView(options) {
          this.parentView = options.parentView;
          this.node = options.node;
          this.user = options.user;
          this.haveEditPermissions = !!(options.node.actions.get('reserve') || options.node.actions
              .get('unreserve'));
          options.collection = this.buildCollection();
          Marionette.CompositeView.prototype.constructor.apply(this, arguments);
          this.listenTo(this.options.node, 'change', this.updateActionCollection);
          this.status = {
            context: this.options.context,
            container: this.options.node,
            nodes: new NodeCollection([this.options.node])
          };
          if (this.node.get('reserved') &&
              this.node.get('reserved_user_id') !== this.user.get('id')) {
            this.reservedByUserModel = this.options.context.getModel(MemberModelFactory, {
              attributes: {
                id: this.node.get('reserved_user_id')
              }
            });
          }
        },

        buildCollection: function () {
          // it should be better if we manipulate the collection rather than creating new
          // but for now let it be this way
          var collection = new Backbone.Collection();
          if (this.haveEditPermissions) {
            if (!this.node.get('reserved') ||
                this.node.get('reserved_user_id') === this.user.get('id')) {
              collection.add(new Backbone.Model({
                openForEdit: true,
                name: 'Edit'
              }));
            }
            var action, supportedActions = ['properties', 'permissions', 'unreserve'],
                self                     = this;
            supportedActions.map(function (action) {
              action = self.node.actions.get(action);
              action && collection.add(action);
            });
          }
          return collection;
        },

        updateActionCollection: function () {
          this.haveEditPermissions = !!(this.options.node.actions.get('reserve') ||
                                        this.options.node.actions.get('unreserve'));
          this.collection = this.buildCollection();
          this.render();
        },

        afterCommandExecution: function (childView, promise) {
          promise.fail(_.bind(function () {
            // add fail callbacks here
            if (childView.model.get('name') === 'Unreserve') {
              // concurrent scenerio where unreserve is shown
              // but item has been unreserved already
              this.node.fetch();
            }
          }, this));
        },
        adjustDropdownMenu: function () {
          if (document.dir === 'rtl') {
            return false;
          }
          this.ui.dropdownMenu.removeClass("csui-html-editor-floating-dd-menu");
          var dropdownLeftOffset   = this.ui.dropdownMenu.offset().left,
              dropdownWidth        = this.ui.dropdownMenu.outerWidth(),
              originatingViewWidth = document.body.scrollWidth,
              ddMenuOverlaps       = dropdownLeftOffset + (2 * dropdownWidth) <=
                                     originatingViewWidth;
          if (ddMenuOverlaps) {
            this.ui.dropdownMenu.addClass("csui-html-editor-floating-dd-menu");
          }
        },
        onRender: function () {
          var dropDown = this.$el.find('.binf-dropdown');
          dropDown.on('binf.dropdown.before.show', _.bind(function () {
            dropDown.on('binf.dropdown.after.show', this.adjustDropdownMenu.bind(this));
            $(window).on('resize.html.editor.dropdown.menu', this.adjustDropdownMenu.bind(
                this));
          }, this));
          dropDown.on('hide.binf.dropdown', _.bind(function () {
            dropDown.off('binf.dropdown.after.show');
            $(window).off('resize.html.editor.dropdown.menu');
          }));
          if (!!this.reservedByUserModel && !this.reservedByUserModel.fetched) {
            this.reservedByUserModel.fetch().done(_.bind(function (response) {
              this.$el.find('.binf-dropdown-toggle.csui-html-editor-control,' +
                            ' .csui-html-editor-reserved-readonly').attr('title',
                  _.str.sformat(lang.reservedBy, response.data.display_name,
                      base.formatExactDate((
                          this.node.get('reserved_date')))));
            }, this));
          }
        }
      });
      return DropdownMenuView;
    });


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/edit.icon',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-rich-text-edit-icon-wrapper csui-rich-text-edit-icon-wrapper-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">\r\n  <span title=\""
    + this.escapeExpression(((helper = (helper = helpers.editLable || (depth0 != null ? depth0.editLable : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"editLable","hash":{}}) : helper)))
    + "\" class=\"icon icon-edit icon-edit-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"></span>\r\n</span>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_edit.icon', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/html.editor.action.buttons',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-html-editor-action-buttons\">\r\n  <button type=\"button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.saveLabel || (depth0 != null ? depth0.saveLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveLabel","hash":{}}) : helper)))
    + "\" role=\"button\" data-cstabindex=\"-1\" tabindex=\"-1\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.saveAria || (depth0 != null ? depth0.saveAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveAria","hash":{}}) : helper)))
    + "\"\r\n          class=\"icon circular csui-html-edit-icon csui-html-edit-save\"></button>\r\n  <button type=\"button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelLabel || (depth0 != null ? depth0.cancelLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelLabel","hash":{}}) : helper)))
    + "\" role=\"button\" data-cstabindex=\"-1\" tabindex=\"-1\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\"\r\n          class=\"icon circular csui-html-edit-icon csui-html-edit-cancel\"></button>\r\n</div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_html.editor.action.buttons', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/html.editor/impl/html.editor.content.view',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/utils/url',
  'csui/utils/base',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/user',
  'csui/widgets/html.editor/impl/html.editor.model',
  'hbs!csui/widgets/html.editor/impl/html.editor', 'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/progressblocker/blocker',
  'csui/controls/error/error.view',
  'csui/widgets/html.editor/impl/cslink.preview/cslink.preview.view',
  'csui/controls/rich.text.editor/rich.text.editor',
  'csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu.view',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/node.links/node.links',
  'i18n!csui/widgets/html.editor/impl/nls/lang',
  'hbs!csui/widgets/html.editor/impl/edit.icon',
  'hbs!csui/widgets/html.editor/impl/html.editor.action.buttons',
  'css!csui/widgets/html.editor/impl/html.editor'
], function ($, _, Backbone, Marionette, ConnectorFactory, Url, base, NodeModel, UserModelFactory,
    HtmlEditorModel, htmlEditorTemplate, ModalAlert,
    BlockingView, ErrorView,
    LinkPreview, RichTextEditor, DropdownMenu, GlobalMessage, NodeLinks, lang, template,
    htmlEditorButtonsTemplate) {

  'use strict';
  var HtmlEditorContentView = Marionette.ItemView.extend({

    className: 'csui-html-editor-wrapper',

    modelEvents: {
      'change': 'render',
      'error': 'render'
    },

    ui: {
      richText: '.csui-richtext-message'
    },

    events: {
      'mouseenter .csui-richtext-message[contenteditable="false"] a': '_showPreview',
      'focusin .csui-richtext-message[contenteditable="true"]': '_actionButtonsPositionInEdge',
      'focusin .csui-richtext-message[contenteditable="false"] a': '_updateUrl',
      'keyup': '_validateState'
    },

    getTemplate: function () {
      return this.model.error ? false : htmlEditorTemplate;
    },

    templateHelpers: function () {
      return {
        'placeholder': lang.PageDefaultContent,
        'id': this.model.get('id'),
        'data': this.model.get('data')
      };
    },

    constructor: function HtmlEditorContentView(options) {
      options || (options = {});
      options.id = options.wikiPageId;
      options = _.extend(options, (options.data = {}));
      this.parentView = options.parentView;
      this.ui.richTextEle = '#csui-richtext-content-body' + options.id;
      BlockingView.imbue(this);
      this.context = options.context;
      this.connector = this.context.getObject(ConnectorFactory);
      //wiki page node model
      this.node = new NodeModel({
        id: options.id
      }, {
        connector: this.connector,
        expand: {
          properties: ['original_id', 'parent_id'], //parent_id -> we need image_folder_id
        },
        commands: ['permissions', 'properties', 'reserve', 'unreserve',
          'addcategory']
      });
      this.user = this.context.getModel(UserModelFactory);
      if (!options.model) {
        //model for html content
        options.model = new HtmlEditorModel({
          connector: this.connector,
          context: this.context,
          id: options.id
        });
        var url = Url.combine(this.connector.connection.url,
            "nodes/" + options.id + "/content");
        options.model.fetch({
          url: url,
          success: options.model.fetchSuccess,
          error: options.model.fetchError,
          dataType: "text"
        }).done(_.bind(function (htmlContent) {
          //fetch the latest version
          this._getLatestVersion().done(_.bind(function () {
            this.oldVersion = this.model.get('version');
          }, this));
        }, this));
      }

      options.richTextElementId = 'csui-richtext-content-body-' + options.id;

      Marionette.ItemView.prototype.constructor.call(this, options);

      this._errorRegion = new Marionette.Region({
        el: this.el
      });

      this.listenTo(this.model, 'sync', _.bind(function () {
        if (!this.model.error) {
          this.user.ensureFetched().done(this._renderActionsDropdown.bind(this));
        }
      }, this));

      this.mode = 'read';
      //RichText Util class That contain utility methods
      this.utils = RichTextEditor.getRichTextEditorUtils();
      this.enableSaveButton = false;
    },

    onRender: function () {
      var error = this.model.error;
      this.$el[error ? 'addClass' : 'removeClass']('csui-disabled');
      // If fetching the node failed, render error widget over this one.
      if (error) {
        this._errorRegion.show(new ErrorView({
          model: new Backbone.Model({
            message: lang.noWikiPageFound
          })
        }));
      }
      this.$el.addClass(this.options.header ? '' : 'csui-html-editor-no-header');
      this.$el.parent().addClass(this.options.header || error ? '' : 'tile');
      this.filterHtmlContent();
      this.refreshTabableElements();
    },

    /**
     * This method filters below obsolete data from html content.
     * Attributes:
     *  border, cellspacing, cellpadding from table element.
     * Elements:
     *  big.
     */
    filterHtmlContent: function () {
      this.$el.find('table').each(function (index, table) {
        $(table).css({
          'border': table.getAttribute('border') + 'px solid',
          'borderSpacing': table.getAttribute('cellspacing') + 'px',
          'text-align': table.getAttribute('align')
        }).removeAttr('cellpadding cellspacing border align');
        $(table).find('th,td').css('padding', table.getAttribute('cellpadding') + 'px');
      });
      this.$el.find('big').each(function (index, bigEle) {
        //TODO: add attributes if any.
        $(bigEle).replaceWith('<span class="csui-big">' + $(bigEle).html() + '</span>');
      });
    },

    refreshTabableElements: function () {
      if (this.mode === 'read') {
        this.tabableElements = this.$el.find('a').toArray();
      } else {
        this.tabableElements = [];
        this.tabableElements.push(this.editorInstance.element.$);
        this.tabableElements = this.tabableElements.concat(
            $('#cke_' + this.options.richTextElementId +
              ' .csui-html-editor-action-buttons > button:not([disabled])').toArray());
      }
      this.currentlyFocusedElementIndex = -1;
    },

    moveTab: function (event) {
      this.currentlyFocusedElementIndex = this.tabableElements.indexOf(event.target);
       // if element is not tabable then return false. (for eg. - 'cs-link-dialog').
      if(this.currentlyFocusedElementIndex === -1) {
        return false;
      }
      var currentFocus  = $(this.tabableElements[this.currentlyFocusedElementIndex]),
          resetTabIndex = false;
      if (event.keyCode === 9) {
        if (event.shiftKey) {
          if (this.currentlyFocusedElementIndex > 0) {
            this.currentlyFocusedElementIndex -= 1;
            $(this.tabableElements[this.currentlyFocusedElementIndex]).trigger('focus');
            event.stopPropagation();
            event.preventDefault();
          } else {
            resetTabIndex = true;
          }
        } else {
          if (this.currentlyFocusedElementIndex < this.tabableElements.length - 1) {
            this.currentlyFocusedElementIndex += 1;
            $(this.tabableElements[this.currentlyFocusedElementIndex]).prop('tabindex', 0).trigger('focus');
            event.stopPropagation();
            event.preventDefault();
          } else {
            resetTabIndex = true;
          }
        }
        if (resetTabIndex) {
          if (this.mode === 'write') {
            if (event.shiftKey) {
              this.currentlyFocusedElementIndex = this.tabableElements.length - 1;
            } else {
              this.currentlyFocusedElementIndex = 0;
            }
            $(this.tabableElements[this.currentlyFocusedElementIndex]).trigger('focus');
          } else {
            currentFocus.on('focusout', _.bind(function () {
              currentFocus.off('focusout');
              this.currentlyFocusedElementIndex = -1;
            }, this));
          }
        }
        if (this.mode === 'write') {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    },

    _showPreview: function (event) {
      this.utils.getUrl(this, event).done(_.bind(function () {
        this.options.targetEle = event.target;
        this.options.connector = this.connector;
        var linkPreview = new LinkPreview(this.options);
        linkPreview.render();
      }, this));

    },

    _updateUrl: function (event) {
      this.utils.getUrl(this, event);
    },

    _renderActionsDropdown: function () {
      this.node.fetch().done(_.bind(function (response) {
        this.dropdownMenu = new DropdownMenu({
          openForEdit: this._openForEdit.bind(this),
          node: this.node,
          user: this.user,
          context: this.options.context,
          parentView: this
        });
        new Marionette.Region({
          el: this.parentView.$el.find(".tile-controls")
        }).show(this.dropdownMenu);

        this.grandParentEle = this.$el.closest('.csui-html-editor-grand-parent');

        this.listenTo(this.dropdownMenu, 'render', _.bind(function () {
          this.refreshTabableElements();
          this.trigger('refresh:tabindexes');
        }, this));

        this.editIconEle = this.parentView.$el.find(".tile-controls");
        if (!!this.options.header) {
          var tileHeaderEleTitle = this.options.titlefield || '';
          this.editIconEle.closest('.tile-header').attr({
            'title': tileHeaderEleTitle,
            'aria-label': tileHeaderEleTitle
          });
        }
      }, this));
    },

    editModeAccessibility: function () {
      $(document).on('keydown.html.editor', _.bind(function (event) {
        if (!$.contains($('#cke_' + this.options.richTextElementId +
                          '.csui-rich-text-editor-toolbar .cke_inner')[0], event.target)) {
          if (event.keyCode === 9) {
            this.moveTab(event);
          } else if ([13, 32].indexOf(event.keyCode) !== -1 &&
                     $(event.target).hasClass('csui-html-edit-icon')) {
            $(event.target).trigger('click');
            event.preventDefault();
          }
        }
      }, this));
    },

    removeEditModeAccessibility: function () {
      $(document).off('keydown.html.editor');
    },

    _openForEdit: function () {
      this.editModeAccessibility();
      this.blockActions();
      this._getLatestVersion().done(_.bind(function () {
        this._toggleReserve(true).done(_.bind(function () {
          if (this.oldVersion === this.model.get('version')) {
            this._getLatestContent().done(_.bind(function () {
              this._editContent();
            }, this));

          } else {
            //Mean while new version get added, inform same to user through modal dialog
            ModalAlert.confirmQuestion(_.bind(function (result) {

              if (result) {
                //dontGetLatestcontent
                this._editContent();
                this.enableSaveButton = true;
              } else {
                //GetTheLatestContent
                this._getLatestContent().done(_.bind(function () {
                  this._editContent();
                  this.oldVersion = this.model.get('version');
                  this.enableSaveButton = false;
                }, this));
              }

              this.alreadyTriggered = true;

            }, this), lang.versionDifferenceConfirmMessage, lang.versionDifferenceConfirmTitle);

          }
        }, this)).fail(this.unblockActions.bind(this));
      }, this)).fail(this.unblockActions.bind(this));
      if (base.isAppleMobile()) {
        this.$el.find(".csui-richtext-message").attr("contenteditable", true).trigger('focus');
      }
    },

    _editContent: function () {
      var self            = this,
          url             = this.connector.connection.url,
          ckeditorConfig  = {
            'skin': 'otskin,' + this.connector.connection.supportPath +
                    '/csui/lib/ckeditor/skins/otskin/',
            'custcsuiimage_imageExtensions': 'gif|jpeg|jpg|png',
            'filebrowserUploadUrl': url.substring(0, url.indexOf('api')),
            'floatingWrapper': this.grandParentEle,
            'extraPlugins': 'csfloatingspace,filebrowser,custimage,custcsuiimage,find,panelbutton,colorbutton,' +
                            'font,selectall,smiley,dialog,sourcedialog,print,preview,justify,' +
                            'otsave,cancel,cssyntaxhighlight,cslink',
            'removePlugins': 'image,floatingspace',
            'cancel': {
              label: 'Cancel',
              onCancel: function (e) {
                self.blockActions();
                var contentDiv       = self.editorInstance,
                    isContentChanged = e.getData().length ?
                                       contentDiv.checkDirty() :
                                       self.model.get('data') !== lang.PageDefaultContent;

                if (isContentChanged) {
                  ModalAlert.confirmQuestion(function (result) {
                    if (result) {
                      self._getLatestVersion().done(function () {
                        if (self.oldVersion !== self.model.get('version')) {
                          self._getLatestContent().done(_.bind(function () {
                            self.oldVersion = this.model.get('version');
                            e.setData(self.model.get('oldData'));
                          }, self));
                        } else {
                          e.setData(self.model.get('oldData'));
                        }
                        self.trigger('updateScrollbar');
                        destroyCKEditor(e);
                        self.autoSaved && self.deleteAutoSavedContent({
                          connector: self.connector,
                          wikiId: self.node.get('parent_id'),
                          pageId: self.model.get('id')
                        });
                        self._toggleReserve();
                      });
                    } else {
                      $(self.options.richTextElementId).trigger('focus');
                      self.unblockActions();
                    }
                  }, lang.CancelConfirmMessage, lang.cancelTitle);
                } else {
                  self._getLatestVersion().done(function () {
                    if (self.oldVersion !== self.model.get('version')) {
                      self._getLatestContent().done(_.bind(function () {
                        self.oldVersion = this.model.get('version');
                        e.setData(self.model.get('oldData'));
                      }, self));
                    } else {
                      e.setData(self.model.get('oldData'));
                    }
                    destroyCKEditor(e);
                    self._toggleReserve();
                  });


                }

              }
            },
            'otsave': {
              label: 'Save',
              url: self.connector.connection.url + '/nodes/' + self.options.id,
              type: "PUT",
              useJSON: false,
              ticket: self.connector.connection.session.ticket,
              postData: function (editor) {
                return {
                  TextField: editor.getData()
                };
              },
              onSave: function (editor) {
                self.blockActions();
                self._getLatestVersion().done(function () {
                  if (!!self.alreadyTriggered || self.oldVersion === self.model.get('version')) {
                    self.enableSaveButton = false;
                    self.alreadyTriggered = false;
                    self._saveContent(editor);
                  } else {
                    ModalAlert.confirmQuestion(function (result) {
                          if (result) {
                            self.enableSaveButton = false;
                            self._saveContent(editor);
                          } else {

                            $(self.options.richTextElementId).trigger('focus');
                            self.unblockActions();
                          }
                        }, lang.versionDifferenceConfirmMessage,
                        lang.versionDifferenceConfirmTitle);
                  }
                });
              },
              onSuccess: function (editor, data) {
                //upon success, reset the model with latest data.
                self.model.set({
                  'data': editor.getData(),
                  'oldData': editor.getData()
                });
                self._getLatestVersion().done(function () {
                  self.oldVersion = self.model.get('version');
                  destroyCKEditor(editor);
                });

              },
              onFailure: function (editor, status, request) {
                destroyCKEditor(editor);
                self.render();
                self.trigger('updateScrollbar');
              }
            },
            'image': {
              url: self.connector.connection.url.replace("/api/v1", "")
            },
            'addimage': {
              url: function () {
                return url + "/nodes";
              },
              imageBrowseEnabled: function () {
                return self.node.get('parent_id_expand').imagebrowseenabled;
              },
              parent_id: self.node.get('parent_id_expand').image_folder_id,
              type: "POST",
              documentType: 144,
              ticket: self.connector.connection.session.ticket
            }
          },
          ckeditor        = RichTextEditor.getRichTextEditor(ckeditorConfig),
          destroyCKEditor = function (CKEditor) {
            $(".csui-rich-text-mask").remove();
            $(".csui-html-editor-zindex").removeClass('csui-html-editor-zindex');
            $("#csui-richtext-sharedspace").remove();
            $(".cui-rich-editor-widget-wrapper").removeAttr('style');
            self.editIconEle.removeClass('binf-hidden');
            self.$el.find(".csui-richtext-message").attr("contenteditable", false);
            CKEditor.destroy();
            self.unblockActions();
            self._unbindEvents();
            self.parentView.$el.find(".csui-html-editor-action-buttons").remove();
            $(window).off('resize');
            self.removeEditModeAccessibility();
            self.mode = 'read';
            self.refreshTabableElements();
            $('.csui-html-editor-zero-zindex').removeClass('csui-html-editor-zero-zindex');
          };

      var $rteEle = self.$("#" + this.options.richTextElementId);
      $rteEle.attr("contenteditable", true);

      this.editIconEle.addClass('binf-hidden');
      var rteMask          = document.createElement('div'),
          rteBodyMask      = document.createElement('div'),
          defaultContainer = $.fn.binf_modal.getDefaultContainer();

      rteMask.className = 'csui-rich-text-mask';
      rteBodyMask.className = 'csui-rich-text-mask csui-rich-text-body-mask';

      self.grandParentEle.before(rteMask);
      $(defaultContainer).append(rteBodyMask);

      if (base.isMSBrowser()) {
        // breadcrumb's z-index is more than the perspective container, so let's degrade it's z-index.
        !!$('#breadcrumb-wrap') &&
        $('#breadcrumb-wrap').addClass('csui-html-editor-zero-zindex');
      }

      var $rteMask     = $(rteMask),
          $rteBodyMask = $(rteBodyMask),
          // tile view with header, tile-header height is 70px, and it's padding-top is 10px, so reduce it.
          $maskOfffset = this.grandParentEle.find('.csui-html-editor-no-header').length > 0 ?
                         5 :
                         80,
          resetMasking = function () {
            $rteEle.closest('.ps-container').scrollTop(0);
            $rteBodyMask.css("height", "0px");
            $rteMask.css("top", "0px");

            var rteMaskTop        = ($rteEle.offset().top - $(rteMask).offset().top -
                                     $maskOfffset),
                rteBodyMaskHeight = $rteEle.offset().top - $maskOfffset;

            rteBodyMaskHeight = rteMaskTop < 0 ? rteBodyMaskHeight + -rteMaskTop :
                                rteBodyMaskHeight;
            rteMaskTop = rteMaskTop < 0 ? 0 : rteMaskTop;

            $rteBodyMask.css("height", rteBodyMaskHeight + "px");
            $rteMask.css({
              "height": document.body.scrollHeight - rteBodyMask.offsetHeight,
              "top": rteMaskTop
            });

            $(rteMask).parent().addClass('csui-html-editor-zindex');
          };

      resetMasking();
      $(window).on('resize', resetMasking);
      $('.csui-richtext-message').on('change', resetMasking);

      window.onbeforeunload = function (e) {
        return false;
      };

      csui.require(['csui/dialogs/node.picker/node.picker'], function (NodePicker) {
        ckeditor.config.csLink = {
          lang: {
            insertContentServerLink: lang.insertContentServerLink
          },
          nodeLink: NodeLinks,
          nodePicker: function () {
            return new NodePicker({
              connector: self.connector,
              dialogTitle: lang.contentServerLink,
              context: self.options.context,
              resolveShortcuts: true,
              resultOriginalNode: false,
              currentUser: self.options.context.getModel(UserModelFactory)
            });
          },
          enableSaveButton: function () {
            self._enableSaveButton();
          }
        };
      });

      self.editorInstance = ckeditor.inline(this.options.richTextElementId, {
        toolbar: [
          ['Undo', 'Redo', '-', 'FontSize', '-', 'Styles', 'Format', 'TextColor', '-', 'Bold',
            'Italic'],
          '/',
          ['Replace', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-',
            'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Link', 'cslink', '-',
            'addImage', 'Table', 'Sourcedialog']
        ]
      });

      ckeditor.once('instanceReady', function (event) {
        if (self.ui.richText.text().trim() === lang.PageDefaultContent) {
          self.ui.richText.empty();
        }
        self.mode = 'write';
        $("#cke_" + self.options.richTextElementId).addClass(
            'csui-rich-text-editor-toolbar');
        self.unblockActions();
        self._appendActionButtons();
        $(event.editor).trigger('focus');
        self.$el.find('.csui-richtext-message').trigger('focus');
        self.editorInstance.on('change', _.throttle(function () {
          self._autoSaveContent(ckeditor);
        }, self.options.autosaveInterval, {
          leading: false
        }));
        self.editorInstance.on('change', function () {
          self._validateState();
        });
        self._actionButtonsPosition();
        self._actionButtonsPositionInEdge();
        self.refreshTabableElements();

        if (!!self.autoSaved) {
          self.deleteAutoSavedContent({
            connector: self.connector,
            wikiId: self.node.get('parent_id'),
            pageId: self.model.get('id')
          });
        }
      });

    },

    _saveContent: function (editor) {
      editor.config.otsave.request.send(editor.config.otsave.json);
      this.autoSaved && this.deleteAutoSavedContent({
        connector: this.connector,
        wikiId: this.node.get('parent_id'),
        pageId: this.model.get('id')
      });
      this._toggleReserve();
    },

    _disableSaveButton: function () {
      var toolbar    = $("#cke_csui-richtext-content-body-" + this.id),
          saveButton = toolbar.find(".csui-html-edit-save");
      if (saveButton.length) {
        saveButton[0].disabled = true;
      }

    },
    _enableSaveButton: function () {
      var toolbar    = $("#cke_csui-richtext-content-body-" + this.id),
          saveButton = toolbar.find(".csui-html-edit-save");
      if (saveButton.length) {
        saveButton[0].disabled = false;
      }

    },

    _toggleReserve: function (toEditMode) {
      var deferred = $.Deferred();
      if (!!toEditMode && this.node.get('reserved')) {
        if (this.node.get('reserved_user_id') === this.user.get('id')) {
          // no need to reserve again if current user has reserved
          deferred.resolve();
          return deferred;
        }
      }
      var contentUrl = this.connector.connection.url + '/nodes/' + this.node.get('id'),
          self       = this,
          formData   = new FormData();
      if (!!toEditMode) {
        !this.node.get('reserved') && formData.append('reserved_user_id', this.user.get('id'));
      } else {
        this.node.get('reserved') && formData.append('reserved_user_id', null);
      }
      this.updateAjaxCall({
        url: contentUrl,
        connector: this.connector,
        data: formData,
        type: 'PUT'
      }).done(function () {
        deferred.resolve();
      }).fail(function (xhr) {
        //GlobalMessage.showMessage("error", xhr.responseJSON.errorDetail);
        deferred.reject();
      }).always(function () {
        // refreshing node actions for concurrent case
        self.node.fetch();
      });
      return deferred;
    },

    _autoSaveContent: function (ckeditor) {
      var contentDiv = this.editorInstance;
      if (!!contentDiv && contentDiv.checkDirty()) {
        contentDiv.resetDirty();
        var source   = contentDiv.getData(),
            formData = new FormData();
        formData.append("wikiId", this.node.get('parent_id'));
        formData.append("pageId", this.model.get('id'));
        formData.append("source", source);

        this.updateAjaxCall({
          connector: this.connector,
          url: Url.combine(this.connector.getConnectionUrl().getApiBase('v2'),
               "/wiki/autosave"),
          type: "POST",
          data: formData,
          view: this
        });
        this.autoSaved = true;
      }
    },

    _getLatestContent: function () {
      var ajaxParams = {
        "url": Url.combine(this.connector.getConnectionUrl().getApiBase('v2') , "/wiki/" +
               this.model.get('id') + "/autosave"),
        "type": "GET",
        "requestType": "getContent",
        "connector": this.connector,
        "view": this
      };
      return this.updateAjaxCall(ajaxParams);
    },

    _getLatestVersion: function () {
      var ajaxParams = {
        "url": Url.combine(this.connector.getConnectionUrl().getApiBase('v2') , "/nodes/" +
               this.model.get('id')),
        "type": "GET",
        "requestType": "versions-reserve",
        "connector": this.connector,
        "view": this
      };
      return this.updateAjaxCall(ajaxParams);
    },

    _validateState: function () {
      this.utils = this.utils || RichTextEditor.getRichTextEditorUtils();

          // as there are only three entermode in ckeditor DIV, P, BR. checking for them, along with the any empty spaces.
        var  editorText=  RichTextEditor.isEmptyContent(this.editorInstance);

       if (!!this.editorInstance && this.editorInstance.checkDirty() &&
          !(editorText === lang.PageDefaultContent || editorText.length === 0)) {
        this._enableSaveButton();
        this.refreshTabableElements();
      } else {
        this._disableSaveButton();
        this.refreshTabableElements();
      }
    },
    /**
     * this method adds action buttons (save and cancel) to html editor view.
     *
     * @private
     */
    _appendActionButtons: function () {
      var toolbar = $("#cke_csui-richtext-content-body-" + this.id),
          data    = {
            'saveLabel': lang.saveTitle,
            'cancelLabel': lang.cancelTitle,
            'cancelAria': lang.cancelAria,
            'saveAria': lang.saveAria
          };

      toolbar.append(htmlEditorButtonsTemplate(data));

      toolbar.find(".csui-html-edit-save").on("click", _.bind(function () {
        this.editorInstance.execCommand('otsave');
      }, this));

      toolbar.find(".csui-html-edit-cancel").on("click", _.bind(function () {
        this.editorInstance.execCommand('cancel');
      }, this));
    },

    _actionButtonsPosition: function () {
      if (!!this.enableSaveButton) {
        this._enableSaveButton();
        this.refreshTabableElements();
      } else {
        this._disableSaveButton();
        this.refreshTabableElements();
      }
    },

    _actionButtonsPositionInEdge: function () {
      // only for edge browser actions buttons are mis-aligned, handling it here.
      var toolbar = $("#cke_csui-richtext-content-body-" + this.id);
      if (base.isEdge() && toolbar.attr("style").indexOf('right') !== -1) {
        toolbar.find('.cke_inner').css('float', 'right');
      }
    },

    _unbindEvents: function () {
      window.onbeforeunload = null;
    },

    updateAjaxCall: function (args) {
      var deferred    = $.Deferred(),
          url         = args.url,
          data        = args.data,
          type        = args.type,
          connector   = args.connector,
          self        = args.view,
          requestType = args.requestType;
      connector.makeAjaxCall({
        url: url,
        type: type,
        data: data,
        contentType: false,
        crossDomain: true,
        processData: false,
        success: function (response, status, jXHR) {
          switch (requestType) {
          case "getContent":
            if (!!response.results.data.autoSaved) {
              self.autoSaved = true;
              ModalAlert.confirmQuestion(function (result) {
                    var content = response.results.data.content;
                    if (result) {
                      content = response.results.data.autoSaved;
                      self.enableSaveButton = true;
                    } else {
                      self.enableSaveButton = false;
                    }
                    self.model.set({
                      'data': content
                    });
                    deferred.resolve();
                  }, lang.RestoreDialogMessage, lang.RestoreDiaglogTitle,
                  ModalAlert.buttonLabels.Yes = lang.Continue,
                  ModalAlert.buttonLabels.No = lang.Discard);
            } else {
              self.model.set({
                'data': response.results.data.content,
                'oldData': response.results.data.content
              });
              deferred.resolve();
            }
            break;
          case 'versions-reserve':
            self.model.attributes.version = response.results.data.versions.length;
            self.node.set({
              'reserved': response.results.data.properties.reserved,
              'reserved_user_id': response.results.data.properties.reserved_user_id
            });

            deferred.resolve();
            break;
          default:
            deferred.resolve(response);
          }
        },
        error: function (xhr, status, text) {
          deferred.reject(xhr);
        }
      });
      return deferred.promise();
    },

    deleteAutoSavedContent: function (args) {
      if (this.autoSaved) {
        args.type = "DELETE";
        args.url = Url.combine(args.connector.getConnectionUrl().getApiBase('v2') , "/wiki/" +
                   args.wikiId + "/autosave/" + args.pageId);
        this.updateAjaxCall(args);
        this.autoSaved = false;
      }
      window.clearInterval(this.intervalId);
    }
  });

  return HtmlEditorContentView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/html.editor.wrapper.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-html-editor-tile-controls tile-controls\"></div>\r\n<div class=\"csui-html-editor-wrapper-parent cui-rich-editor-widget-wrapper\r\ncsui-html-editor-wrapper-parent-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_html.editor.wrapper.template', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/html.editor/html.editor.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/controls/tile/tile.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/html.editor/impl/html.editor.content.view',
  'hbs!csui/widgets/html.editor/impl/html.editor.wrapper.template',
  'i18n!csui/widgets/html.editor/impl/nls/lang'
], function (_, $, Handlebars, Marionette, TileView, PerfectScrollingBehavior,
    TabableRegionBehavior, HtmlEditorContentView, template, lang) {

  var HtmlEditorTileView = TileView.extend({

    constructor: function HtmlEditorTileView(options) {
      options || (options = {});
      options.icon = 'cs-wiki-icon-wiki';
      this.context = options.context;
      options.id = 'csui-html-tile-wrapper-' + options.wikiPageId;

      TileView.prototype.constructor.call(this, options);

      options = options.data ? _.extend(options, options.data) : options;
      this.options = options;
      this.options.parentView = this;
      this.contentViewOptions = this.options;
    },

    contentView: HtmlEditorContentView,
    contentViewOptions: function () {
      _.extend(this.options, {parentView: this});
    },

    onShow: function () {
      this.$el.addClass(
          'cui-rich-editor-widget-wrapper cui-rich-editor-widget-wrapper-' +
          this.options.wikiPageId);
    }

  });

  var HtmlEditorWidgetView = Marionette.CompositeView.extend({
    tagName: 'div',

    className: 'csui-html-editor-grand-parent',

    templateHelpers: function () {
      return {};
    },

    template: template,

    ui: {
      editIcon: '.tile-controls'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    constructor: function HtmlEditorWidgetView(options) {
      options = options || {};
      options.data || (options.data = {});
      _.extend(options, options.data);
      options.wikiPageId = options.wikipageid || options.id;
      options.id = "csui-html-editor-grand-parent-" + options.wikiPageId;
      options.title = options.titlefield || options.title;
      options.header = !!options.title;
      options.scrollableParent = !!options.header ? '.tile-content' :
                                 '.csui-html-editor-wrapper-parent';
      this.context = options.context;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: function () {
          return this.options.scrollableParent;
        },
        suppressScrollX: true
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (!!this.htmlEditorContentView.dropdownMenu &&
          !this.htmlEditorContentView.dropdownMenu.haveEditPermissions) {
        return this.htmlEditorContentView.$el.find('a:first');
      } else {
        return this.$el.find('.csui-html-editor-dropdown .csui-html-editor-control');
      }
    },

    onKeyInView: function (event) {
      if (this.htmlEditorContentView.mode === 'read') {
        this.htmlEditorContentView.moveTab(event);
      }
    },

    onRender: function (e) {
      var _htmlView;
      this.options.autosaveInterval = 60000;
      if (this.options.header === undefined || this.options.header) { // with header
        _htmlView = new HtmlEditorTileView(this.options);
        this.listenToOnce(_htmlView, 'show', _.bind(function () {
          this.htmlEditorContentView = _htmlView.getChildView('content');
        }, this));
      } else { // without header
        this.options.parentView = this;
        _htmlView = new HtmlEditorContentView(this.options);
        this.htmlEditorContentView = _htmlView;
      }

      new Marionette.Region({
        el: this.$el.find(".csui-html-editor-wrapper-parent")
      }).show(_htmlView);
      this._triggerView = this;

      this
          .listenTo(this.htmlEditorContentView, 'refresh:tabindexes', _.bind(function () {
            this.trigger('refresh:tabindexes');
          }, this))
          .listenTo(this.htmlEditorContentView, 'updateScrollbar', _.bind(function () {
            this.trigger('dom:refresh');
          }, this));
    }
  });
  return HtmlEditorWidgetView;
});


csui.define('json!csui/widgets/error.global/error.global.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "fullpage",
  "schema": {
    "type": "object",
    "properties": {
      "serverError": {
        "title": "{{serverErrorTitle}}",
        "description": "{{serverErrorDescription}}",
        "type": "string"
      }
    }
  },
  "options": {
  }
}
);


csui.define('json!csui/widgets/favorites/favorites.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  },
  "actions": [
    {
      "toolItems": "csui/widgets/favorites2.table/toolbaritems",
      "toolItemMasks": "csui/widgets/favorites2.table/toolbaritems.masks",
      "toolbars": [
        {
          "id": "tableHeaderToolbar",
          "title": "{{tableHeaderToolbarTitle}}",
          "description": "{{tableHeaderToolbarDescription}}"
        },
        {
          "id": "inlineActionbar",
          "title": "{{inlineActionbarTitle}}",
          "description": "{{inlineActionbarDescription}}"
        }
      ]
    }
  ]
}
);


csui.define('json!csui/widgets/myassignments/myassignments.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  }
}
);


csui.define('json!csui/widgets/placeholder/placeholder.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "supportedKinds": ["tile", "header", "fullpage"],
  "schema": {
    "type": "object",
    "properties": {
      "label": {
        "title": "{{labelTitle}}",
        "description": "{{labelDescription}}",
        "type": "string"
      },
      "color": {
        "title": "{{foregroundColorTitle}}",
        "description": "{{foregroundColorDescription}}",
        "type": "string"
      },
      "bgcolor": {
        "title": "{{backgroundColorTitle}}",
        "description": "{{backgroundColorDescription}}",
        "type": "string"
      }
    }
  }
}
);


csui.define('json!csui/widgets/recentlyaccessed/recentlyaccessed.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  },
  "actions": [
    {
      "toolItems": "csui/widgets/recentlyaccessedtable/toolbaritems",
      "toolItemMasks": "csui/widgets/recentlyaccessedtable/toolbaritems.masks",
      "toolbars": [
        {
          "id": "tableHeaderToolbar",
          "title": "{{tableHeaderToolbarTitle}}",
          "description": "{{tableHeaderToolbarDescription}}"
        },
        {
          "id": "inlineActionbar",
          "title": "{{inlineActionbarTitle}}",
          "description": "{{inlineActionbarDescription}}"
        }
      ]
    }
  ]
}
);


csui.define('json!csui/widgets/shortcut/shortcut.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "deprecated": true,
  "useInstead": "csui/widgets/shortcuts",
  "schema": {
    "type": "object",
    "properties": {
      "id": {
        "title": "{{idTitle}}",
        "description": "{{idDescription}}",
        "type": "integer"
      },
      "type": {
        "title": "{{typeTitle}}",
        "description": "{{typeDescription}}",
        "type": "integer",
        "enum": [141, 142, 133],
        "default": 141
      },
      "background": {
        "title": "{{backgroundTitle}}",
        "description": "{{backgroundDescription}}",
        "type": "string",
        "enum": [
          "cs-tile-background1",
          "cs-tile-background2",
          "cs-tile-background3"
        ]
      },
      "displayName": {
        "title": "{{displayNameTitle}}",
        "type": "string"
      }
    },
    "oneOf": [{
      "required": ["id"]
    }, {
      "required": ["type"]
    }]
  },
  "options": {
    "fields": {
      "id": {
        "type": "otcs_node_picker",
        "type_control": {
          "parameters": {
            "select_types": []
          }
        }
      },
      "type": {
        "type": "select",
        "optionLabels": [
          "{{typeEnterpriseVolume}}",
          "{{typePersonalVolume}}",
          "{{typeCategoryVolume}}"
        ]
      },
      "background": {
        "type": "select",
        "optionLabels": [
          "{{backgroundGrey}}",
          "{{backgroundGreen}}",
          "{{backgroundOrange}}"
        ]
      }
    }
  }
}
);


csui.define('json!csui/widgets/shortcuts/shortcuts.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "selfConfigurable": true,
  "schema": {
    "type": "object",
    "properties": {
      "shortcutTheme": {
        "title": "{{shortcutThemeTitle}}",
        "description": "{{shortcutThemeDescription}}",
        "type": "string",
        "enum": [
          "csui-shortcut-theme-stone1",
          "csui-shortcut-theme-stone2",
          "csui-shortcut-theme-teal1",
          "csui-shortcut-theme-teal2",
          "csui-shortcut-theme-pink1",
          "csui-shortcut-theme-pink2",
          "csui-shortcut-theme-indigo1",
          "csui-shortcut-theme-indigo2"
        ]
      },
      "shortcutItems": {
        "title": "{{shortcutItemsTitle}}",
        "description": "{{shortcutItemsDescription}}",
        "type": "array",
        "minItems": 1,
        "maxItems": 4,
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "title": "{{idTitle}}",
              "description": "{{idDescription}}",
              "type": "integer"
            },
            "type": {
              "title": "{{typeTitle}}",
              "description": "{{typeDescription}}",
              "type": "integer",
              "enum": [141, 142, 133]
            },
            "displayName": {
              "title": "{{displayNameTitle}}",
              "type": "string"
            }
          },
          "oneOf": [{
            "required": ["id"]
          }, {
            "required": ["type"]
          }]
        }
      }
    }
  },
  "options": {
    "fields": {
      "shortcutItems": {
        "items": {
          "fields": {
            "id": {
              "type": "otcs_node_picker",
              "type_control": {
                "parameters": {
                  "select_types": []
                }
              }
            },
            "type": {
              "type": "select",
              "optionLabels": [
                "{{typeEnterpriseVolume}}",
                "{{typePersonalVolume}}",
                "{{typeCategoryVolume}}"
              ]
            }
          }
        }
      },
      "shortcutTheme": {
        "type": "select",
        "optionLabels": [
          "{{shortcutThemeStone1}}",
          "{{shortcutThemeStone2}}",
          "{{shortcutThemeTeal1}}",
          "{{shortcutThemeTeal2}}",
          "{{shortcutThemePink1}}",
          "{{shortcutThemePink2}}",
          "{{shortcutThemeIndigo1}}",
          "{{shortcutThemeIndigo2}}"
        ]
      }
    }
  }
}
);


csui.define('json!csui/widgets/welcome.placeholder/welcome.placeholder.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "header",
  "schema": {
    "type": "object",
    "properties": {
      "message": {
        "title": "{{messageTitle}}",
        "description": "{{messageDescription}}",
        "type": "string"
      },
      "videoPoster": {
        "title": "{{videoPosterTitle}}",
        "description": "{{videoPosterDescription}}",
        "type": "string"
      },
      "videoSrc": {
        "title": "{{videoSourceTitle}}",
        "description": "{{videoSourceDescription}}",
        "type": "string"
      }
    }
  }
}
);


csui.define('json!csui/widgets/html.editor/html.editor.manifest.json',{
	"$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
	"title": "{{title}}",
	"description": "{{description}}",
	"kind": "tile",
	"supportedKinds": ["tile", "header", "fullpage"],
	"schema": {
		"type": "object",
		"properties": {
			"titlefield": {
				"title": "{{titleLabel}}",
				"description": "{{titleDesc}}",
				"type": "string",
				"default": ""
			},
			"wikicontainerid": {
				"title": "{{wikiContainerID}}",
				"description": "{{wikiContainerIDDesc}}",
				"type": "integer"
			},
			"wikitemplateid": {
				"title": "{{wikiTemplateID}}",
				"description": "{{wikiTemplateIDDesc}}",
				"type": "integer"
			},
			"wikiid": {
				"title": "{{wikiContainerID}}",
				"description": "{{wikiContainerIDDesc}}",
				"type": "integer"
			},
			"wikipageid": {
				"title": "{{wikiTemplateID}}",
				"description": "{{wikiTemplateIDDesc}}",
				"type": "integer"
			}
		}
	},
	"options": {
		"fields": {
			"wikicontainerid": {
				"type": "otcs_node_picker",
				"type_control": {
					"parameters": {
						"select_types": [
							5573
						]
					}
				}
			},
			"wikitemplateid": {
				"type": "otcs_node_picker",
				"type_control": {
					"parameters": {
						"select_types": [
							5574
						],
						"startLocation": "csui/dialogs/node.picker/start.locations/perspective.assets.volume"
					}
				}
			},
			"wikipageid": {
				"type": "otcs_node_picker",
				"hidden": true,
				"type_control": {
					"parameters": {
						"select_types": [
							5574
						]
					}
				}
			},
			"wikiid": {
				"type": "otcs_node_picker",
				"hidden": true,
				"type_control": {
					"parameters": {
						"select_types": [
							5573
						]
					}
				}
			},
			"width": {
				"type": "select",
				"optionLabels": [
					"{{default}}",
					"{{full}}",
					"{{half}}",
					"{{quarter}}"
				]
			}
		}
	},
	"callback": "wiki/callbacks/wikiHookCallback"
}
);

csui.define('csui/widgets/favorites/impl/nls/favorites.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/favorites/impl/nls/root/favorites.manifest',{
  "title": "Favorites",
  "description": "Shows favorite objects of the current user.",
  "tableHeaderToolbarTitle": "Table Header Toolbar",
  "tableHeaderToolbarDescription": "Toolbar, which is activated in the table header, once a table row is selected.",
  "inlineActionbarTitle": "Inline Action Bar",
  "inlineActionbarDescription": "Toolbar, which is displayed inside a table row, when the mouse cursor is moving above it."
});

csui.define('csui/widgets/myassignments/impl/nls/myassignments.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/myassignments/impl/nls/root/myassignments.manifest',{
  "title": "My Assignments",
  "description": "Shows personal assignments of the current user."
});

csui.define('csui/widgets/placeholder/impl/nls/placeholder.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/placeholder/impl/nls/root/placeholder.manifest',{
  "widgetTitle": "Placeholder",
  "widgetDescription": "Shows a colorful tile taking the space instead of a real widget.",
  "labelTitle": "Label",
  "labelDescription": "Label of the tile",
  "foregroundColorTitle": "Foreground color",
  "foregroundColorDescription": "Color for the label of the tile",
  "backgroundColorTitle": "Background color",
  "backgroundColorDescription": "Color for the background of the tile"
});


csui.define('csui/widgets/recentlyaccessed/impl/nls/recentlyaccessed.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/recentlyaccessed/impl/nls/root/recentlyaccessed.manifest',{
  "title": "Recently Accessed",
  "description": "Shows documents accessed recently by the current user.",
  "tableHeaderToolbarTitle": "Table Header Toolbar",
  "tableHeaderToolbarDescription": "Toolbar, which is activated in the table header, once a table row is selected.",
  "inlineActionbarTitle": "Inline Action Bar",
  "inlineActionbarDescription": "Toolbar, which is displayed inside a table row, when the mouse cursor is moving above it."
});


csui.define('csui/widgets/shortcut/impl/nls/shortcut.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcut/impl/nls/root/shortcut.manifest',{
  "widgetTitle": "Single Shortcut",
  "widgetDescription": "Tile representing a hyperlink to an object; it navigates to its page when clicked",
  "idTitle": "Target object",
  "idDescription": "An object to open by this shortcut",
  "typeTitle": "Volume fallback",
  "typeDescription": "Sub-type number of a global volume to open by this shortcut if no object has been selected",
  "backgroundTitle": "Background",
  "backgroundDescription": "Styling of the background below the shortcut tile",
  "typeEnterpriseVolume": "Enterprise",
  "typePersonalVolume": "Personal",
  "typeCategoryVolume": "Categories",
  "displayNameTitle": "Display name",
  "backgroundGrey": "Grey",
  "backgroundGreen": "Green",
  "backgroundOrange": "Orange"
});


csui.define('csui/widgets/welcome.placeholder/impl/nls/welcome.placeholder.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/welcome.placeholder/impl/nls/root/welcome.placeholder.manifest',{
  "widgetTitle": "Welcome Header",
  "widgetDescription": "Shows a wide widget with initial information for the user home page.",
  "messageTitle": "Display message",
  "messageDescription": "Message to be displayed at the bottom of the tile",
  "videoPosterTitle": "Video thumbnail",
  "videoPosterDescription": "Web address of the poster to show when the video is not playing",
  "videoSourceTitle": "Video location",
  "videoSourceDescription": "Web address of the video to play"
});


csui.define('csui/widgets/html.editor/impl/nls/html.editor.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/html.editor/impl/nls/root/html.editor.manifest',{
	'title': 'HTML Tile',
	'description': 'Returns the HTML output of an object and inserts it into a tile.',
	'widthLabel': 'Width',
	'widthDesc': 'The maximum width on the largest screen-size.',
	'default': 'Default',
	'full': 'Full',
	'half': 'Half',
	'quarter': 'Quarter',
	'titleLabel': 'Title',
	'titleDesc': 'Title for the tile',
	'objIdLabel': 'Object ID',
	'objIdDesc': 'Object ID for which we have to render and allow users to edit rich text content.',
	'wikiContainerID': 'Target wiki for HTML Content (optional)',
	'wikiTemplateID': 'Template wiki page (optional)',
	'wikiContainerIDDesc': 'If not specified, a target wiki will be created automatically in perspective asset volume',
	'wikiTemplateIDDesc': 'If not specified, a target wiki template will be pointed automatically from perspective asset folder'
});


csui.define('bundles/csui-app',[
  // Behaviours
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/behaviors/item.state/item.state.behavior',
  'csui/behaviors/item.state/item.state.view',
  'csui/behaviors/limiting/limiting.behavior',

  // Controls
  'csui/controls/tile/behaviors/expanding.behavior',
  'csui/controls/tile/tile.view',
  'csui/controls/iconpreload/icon.preload.view',
  'csui/controls/rich.text.editor/rich.text.editor',
  'csui/controls/selected.count/selected.count.view',

  // Control behaviours

  // 3rd-party libraries

  // TODO: Remove this as long as we mock only for testing purposes;
  // currently we do it a lot to present our features and we need
  // the mockjax in the production output
  'csui/lib/jquery.mockjax',
  'csui/lib/jquery.simulate',
  'csui/lib/othelp',

  // Models
  'csui/models/expandable',

  // Model mixins

  // Pages
  'csui/pages/start/start.page.view',

  // Navigation Header
  'csui/widgets/navigation.header/controls/help/help.view',
  'csui/widgets/navigation.header/controls/home/home.view',
  'csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',
  'csui/widgets/navigation.header/controls/search/search.view',
  'csui/widgets/navigation.header/controls/favorites/favorites.view',
  'csui/widgets/navigation.header/controls/user.profile/user.profile.view',
  'csui/widgets/navigation.header/controls/progressbar.maximize/progressbar.maximize.view',

  // Routers

  // Utilities

  // Commands
  // FIXME: Create a public module instead of this private one.
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/tabletoolbar/impl/nls/localized.strings',

  // Contexts and factories
  // Client-side perspectives
  'json!csui/utils/contexts/perspective/impl/perspectives/error.global.json',

  // Application widgets
  'csui/widgets/error.global/error.global.view',
  'csui/widgets/favorites/favorites.view',
  'csui/widgets/favorites/tileview.toolbaritems',
  'csui/widgets/myassignments/myassignments.columns',
  'csui/widgets/myassignments/myassignments.view',
  'csui/widgets/navigation.header/profile.menuitems',
  'csui/widgets/navigation.header/profile.menuitems.mask',
  'csui/widgets/placeholder/placeholder.view',
  'csui/widgets/recentlyaccessed/recentlyaccessed.columns',
  'csui/widgets/recentlyaccessed/recentlyaccessed.view',
  'csui/widgets/recentlyaccessed/tileview.toolbaritems',
  'csui/widgets/search.box/search.box.view',
  'csui/widgets/shortcut/shortcut.view',
  'csui/widgets/shortcuts/shortcuts.view',
  'csui/widgets/welcome.placeholder/welcome.placeholder.view',

  'csui/widgets/html.editor/impl/cslink.preview/cslink.preview.view',
  'csui/widgets/html.editor/html.editor.view',

  // Application widgets manifests
  'json!csui/widgets/error.global/error.global.manifest.json',
  'json!csui/widgets/favorites/favorites.manifest.json',
  'json!csui/widgets/myassignments/myassignments.manifest.json',
  'json!csui/widgets/placeholder/placeholder.manifest.json',
  'json!csui/widgets/recentlyaccessed/recentlyaccessed.manifest.json',
  'json!csui/widgets/shortcut/shortcut.manifest.json',
  'json!csui/widgets/shortcuts/shortcuts.manifest.json',
  'json!csui/widgets/welcome.placeholder/welcome.placeholder.manifest.json',

  'json!csui/widgets/html.editor/html.editor.manifest.json',

  'i18n!csui/widgets/favorites/impl/nls/favorites.manifest',
  'i18n!csui/widgets/myassignments/impl/nls/myassignments.manifest',
  'i18n!csui/widgets/placeholder/impl/nls/placeholder.manifest',
  'i18n!csui/widgets/recentlyaccessed/impl/nls/recentlyaccessed.manifest',
  'i18n!csui/widgets/shortcut/impl/nls/shortcut.manifest',
  'i18n!csui/widgets/shortcuts/impl/nls/shortcuts.manifest',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/welcome.placeholder.manifest',

  'i18n!csui/widgets/html.editor/impl/nls/html.editor.manifest',

  // Shared for favoritestable from csui-browse
  'i18n!csui/widgets/favorites/impl/nls/lang',
  // Shared for myassignmentstable from csui-browse
  'i18n!csui/widgets/myassignments/impl/nls/lang',
  // Shared for recentlyaccessedtable from csui-browse
  'i18n!csui/widgets/recentlyaccessed/impl/nls/lang',
], {});

csui.require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-app', true);
});

