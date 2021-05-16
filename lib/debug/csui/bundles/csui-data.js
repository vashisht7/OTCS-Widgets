csui.define('csui/utils/contexts/factories/factory',['csui/lib/marionette'], function (Marionette) {

  // These class is usually consumed under names ObjectFactory, ModelFactory or CollectionFactory,
  // depending on the descendant object (see Context.getObject for more information)
  var Factory = Marionette.Controller.extend({

    constructor: function Factory(context, options) {
      this.context = context;
      this.options = options || {};
    },

    // Descendants must set a string ID, which will uniquely identify the model in the context
    propertyPrefix: null

  });

  return Factory;

});

csui.define('csui/utils/contexts/factories/connector',['module', 'csui/lib/underscore', 'csui/utils/contexts/factories/factory',
  'csui/utils/connector'
], function (module, _, ObjectFactory, Connector) {

  var ConnectorFactory = ObjectFactory.extend({

    propertyPrefix: 'connector',

    constructor: function ConnectorFactory(context, options) {
      ObjectFactory.prototype.constructor.apply(this, arguments);

      var connector = this.options.connector || {};
      if (!(connector instanceof Connector)) {
        var config = module.config(),
            // The single connection object is used to share authentication
            // among contexts if stored in config; it cannot be cloned
            // TODO: Clone the connection. Modifying the global configuration
            // makes it accessible globally and sensive data easier to steal.
            connection = connector.connection || config.connection || {};
        // The connection object can be merged from multiple sources, which
        // may define connection and authentication parameters separately
        _.defaults(connection, connector.connection, config.connection);
        connector = new Connector(_.defaults({
          connection: connection
        }, connector, config));
      }
      this.property = connector;
    }

  });

  return ConnectorFactory;

});

csui.define('csui/utils/contexts/factories/next.node',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/utils/commands'
], function (module, _, $, Backbone, ModelFactory, ConnectorFactory,
    NodeModel, commands) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var NextNodeModelFactory = ModelFactory.extend({
    propertyPrefix: 'nextNode',

    constructor: function NextNodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var nextNode = this.options.nextNode || {},
          config   = module.config();
      if (prefetch) {
        this.initialResponse = nextNode.initialResponse || config.initialResponse;
      }
      if (!(nextNode instanceof Backbone.Model)) {
        var fields  = {
              properties: [],
              'versions.element(0)': ['owner_id']
            },
            expands = {
              properties: ['original_id']
            };
        if (nextNode.options) {
          // merge 'fields'
          _.mapObject(nextNode.options.fields, function (val, key) {
            fields[key] = _.union(fields[key], val);
          });
          // merge 'expand'
          _.mapObject(nextNode.options.expand, function (val, key) {
            expands[key] = _.union(expands[key], val);
          });
        }

        var connector       = context.getObject(ConnectorFactory, options),
            creationOptions = $.extend(true, {
              connector: connector,
              // Do not waste server resources; it returns all it can by default
              fields: fields,
              // Command enabling for shortcuts needs the original node info
              expand: expands,
              // Make sure, that the metadata token is returned for nodes
              // requesated via this factory, because they are supposed to
              // be shared and may be the subject of changes.
              stateEnabled: true,
              // Command enabling needs permitted actions
              commands: commands.getAllSignatures()
            }, config.options, nextNode.options);
        // Next node can be fetshed just like node; keep their defaults in sync
        nextNode = new NodeModel(nextNode.attributes || config.attributes,
            creationOptions);
      }
      this.property = nextNode;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return NextNodeModelFactory;
});

csui.define('csui/utils/contexts/factories/search.query.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var SearchQueryModel = Backbone.Model.extend({

    constructor: function SearchQueryModel(attributes, options) {
      SearchQueryModel.__super__.constructor.apply(this, arguments);
    },

    toJSON: function () {
      return SearchQueryModel.__super__.toJSON.apply(this, arguments);
    }

  });

  var SearchQueryModelFactory = ModelFactory.extend({

    propertyPrefix: 'searchQuery',

    constructor: function SearchQueryModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var searchQuery = this.options.searchQuery || {};
      if (!(searchQuery instanceof Backbone.Model)) {
        var config = module.config();
        searchQuery = new SearchQueryModel(searchQuery.models, _.extend({},
            searchQuery.options, config.options));
      }
      this.property = searchQuery;
    }

  });

  return SearchQueryModelFactory;

});


csui.define('css!csui/controls/tile/behaviors/impl/perfect.scrolling',[],function(){});
csui.define('csui/controls/tile/behaviors/perfect.scrolling.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/base', 'csui/utils/accessibility',
  'csui/lib/perfect-scrollbar',
  'css!csui/controls/tile/behaviors/impl/perfect.scrolling'
], function (module, _, $, Marionette, base, Accessibility) {
  'use strict';

  // Default static options for the behaviour object
  var config = module.config();
  _.defaults(config, {
    usePerfectScrollbar: false
  });
  if (Accessibility.isAccessibleMode()) {
    config.usePerfectScrollbar = false;
  }

  // Default options for the perfect scrollbar plugin to be created with
  var defaultPluginOptions = {
    minScrollbarLength: 32,
    stopPropagationOnClick: false
  };

  var PerfectScrollingRegion = Marionette.Region.extend({
    constructor: function PerfectScrollingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
      // Set when before:swapOut is triggered and reset when its finishing
      // counterpart is triggered to optimize the event handlers for view
      // swapping in the region
      this._swapping = false;

      // Support scrollbar updates on populating and emptying regions
      this
          .listenTo(this, 'before:swapOut', function () {
            this._swapping = true;
          })
          .listenTo(this, 'swapOut', function () {
            this._swapping = false;
          })
          .listenTo(this, 'show', function () {
            this._requestScrollbarUpdate();
          })
          .listenTo(this, 'empty', function () {
            if (!this._swapping) {
              this._requestScrollbarUpdate();
            }
          });
    },

    _requestScrollbarUpdate: function () {
      // {this.region}.{owning region manager}.{owning layout view}
      this._parent._parent.trigger('update:scrollbar');
    }
  });

  var PerfectScrollingBehavior = Marionette.Behavior.extend({
    defaults: {
      contentParent: null
    },

    constructor: function PerfectScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.listenTo(view, 'render', this._applyClasses);

      if (this._useScrollbar() && this._usePerfectScrollbar()) {
        var updateOnWindowResize = getOption.call(this, 'updateOnWindowResize');
        // Increase when before:render and before:render:collection events
        // are triggered and decrease, when their finishing counterparts are
        // triggered to optimize the event handlers for single view adding
        // or removal
        this._renderState = 0;

        this
        // Bubbling from a child view with ParentScrollbarUpdatingBehavior
        // and window resizing (if the view resizes itself by CSS only)
            .listenToOnce(view, 'render', function () {
              this.view.$el.on('csui:update:scrollbar.' + view.cid,
                  _.bind(this._updateScrollbarFromPropagation, this));
              if (updateOnWindowResize !== false) {
                $(window).on('resize.' + view.cid, _.bind(this._updateScrollbar, this));
              }
            })
            .listenToOnce(view, 'before:destroy', function () {
              this.view.$el.off('csui:update:scrollbar.' + view.cid);
              if (updateOnWindowResize !== false) {
                $(window).off('resize.' + view.cid);
              }
            })
            // Maintain the rendering state for the events triggered between
            // before:render and render
            .listenTo(view, 'before:render', function () {
              this._renderState = 1;
              // console.log('Perfect scrollbar expects render event',
              //     Object.getPrototypeOf(this.view).constructor.name);
            })
            .listenTo(view, 'render', function () {
              this._renderState = 0;
            })
            // Create and destroy the perfect scrollbar plugin
            .listenTo(view, 'dom:refresh', this._ensureScrollbar)
            .listenTo(view, 'ensure:scrollbar', this._ensureScrollbar)
            .listenTo(view, 'before:render', this._destroyScrollbar)
            .listenTo(view, 'before:destroy', this._destroyScrollbar)
            // Listen to requests for an explicit scrollbar update
            .listenTo(view, 'update:scrollbar', this._refreshScrollbar)
            // Delay listening to the collection events; the collection may
            // not be present in the view or its options yet
            .listenToOnce(view, 'before:render', function () {
              // Support optimized adding and removing child views
              // in CollectionView, which does not call render
              if (view instanceof Marionette.CollectionView && view.collection) {
                this
                    .listenTo(view.collection, 'reset', function () {
                      this._resetTriggered = true;
                      // console.log('Perfect scrollbar expects reset event processed',
                      //     Object.getPrototypeOf(this.view).constructor.name);
                    })
                    .listenTo(view, 'before:render:collection', function () {
                      ++this._renderState;
                      // console.log('Perfect scrollbar expects render:collection event',
                      //     Object.getPrototypeOf(this.view).constructor.name);
                    })
                    .listenTo(view, 'render:collection', function () {
                      this._resetTriggered = false;
                      --this._renderState;
                      // console.log('Perfect scrollbar received render:collection event',
                      //     Object.getPrototypeOf(this.view).constructor.name);
                      // If the collection was re-rendered after catching the
                      // 'reset' event, single child view updates were skipped
                      if (!this._renderState) {
                        // console.log('Perfect scrollbar got update from children reset');
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'render:empty', function () {
                      // If the collection was re-rendered after catching the
                      // 'reset' event, no child view updates were performed
                      if (this._resetTriggered || !this._renderState) {
                        // console.log('Perfect scrollbar got update from children emptied');
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'add:child', function () {
                      // If a child view was added alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._renderState) {
                        // console.log('Perfect scrollbar got update from child add');
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'remove:child', function () {
                      // If a child view was removed alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._resetTriggered && !this._renderState) {
                        // console.log('Perfect scrollbar got update from child remove');
                        this._updateScrollbar();
                      }
                    });
              }
            });
      }
    },

    _applyClasses: function () {
      // console.log('Perfect scrollbar got render in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      var classes;
      this._contentParent = this._getContentParent();
      if (this._useScrollbar()) {
        if (this._usePerfectScrollbar()) {
          classes = 'csui-perfect-scrolling';
        } else {
          var suppressScrollX = getOption.call(this, 'suppressScrollX'),
              suppressScrollY = getOption.call(this, 'suppressScrollY');
          classes = 'csui-normal-scrolling';
          if (suppressScrollX) {
            classes += ' csui-no-scroll-x';
          }
          if (suppressScrollY) {
            classes += ' csui-no-scroll-y';
          }
        }
      } else {
        classes = 'csui-no-scrolling';
      }
      this._contentParent.addClass(classes);
    },

    _ensureScrollbar: function () {
      // obtain content parent from options if it is available.
      this._contentParent = !!this._contentParent ? this._contentParent : this._getContentParent();
      // console.log('Perfect scrollbar got dom:refresh in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (!this._contentParent) {
        throw new Error('The "dom:refresh"" event was triggered earlier ' +
                        'than the "render" event in view ' + this.view.cid +
                        '(' + Object.getPrototypeOf(this.view).constructor.name + ')');
      }
      if (this._perfectScrollbar) {
        //if (!this._contentParent.data('perfect-scrollbar')) { // 'ps-id' for 0.6.7
        //  throw new Error('Uninitialized perfect-scrollbar in view ' + this.view.cid +
        //                  '(' + Object.getPrototypeOf(this.view).constructor.name + ')');
        //}
        this._contentParent.perfectScrollbar('update');
      } else {
        var options = _.reduce(['suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
          'scrollYMarginOffset', 'maxScrollbarLength', 'minScrollbarLength', 'includePadding'
        ], function (result, property) {
          result[property] = getOption.call(this, property);
          return result;
        }, {}, this);
        _.defaults(options, defaultPluginOptions);
        this._contentParent.perfectScrollbar(options);
        this._perfectScrollbar = true;

        //Keep focus on scroll rail if focus was removed due to an inline click event.
        this._setClickEventFocus();
      }
    },

    _setClickEventFocus: function () {
      var yRail = this._contentParent.find('.ps-scrollbar-y-rail');
      var xRail = this._contentParent.find('.ps-scrollbar-x-rail');

      //For chrome only, when you click within a rail to scroll, a mouseleave event is
      //triggered removing focus and hover from the rail. To maintain hover status, a
      //class is added to the scroll rail
      if (base.isChrome()) {
        this._setClickEventRailFocus(yRail);
        this._setClickEventRailFocus(xRail);
      }
      //For FF and IE, when you click to drag a scrollbar, a mouseleave event is
      //triggered removing focus and hover from the rail. To maintain hover status, a
      //class is added to the scroll rail
      else {
        var yScrollBar = this._contentParent.find('.ps-scrollbar-y');
        var xScrollBar = this._contentParent.find('.ps-scrollbar-x');
        this._setClickEventBarFocus(yScrollBar, yRail);
        this._setClickEventBarFocus(xScrollBar, xRail);
      }
    },

    _setClickEventBarFocus: function (xyBar, xyRail) {
      var self = this;
      xyBar.on('mousedown', function (e) {
        self.addXYFocus = true;
        xyRail.addClass('binf-focus');
      });
      xyRail.on('mouseout', function (e) {
        if (!self.addXYFocus) {
          xyRail.removeClass('binf-focus');
          xyRail.blur();
        }
        self.addXYFocus = false;
      });
    },

    _setClickEventRailFocus: function (xyRail) {
      var self = this;
      if (xyRail.length > 0) {
        xyRail.on('mouseup', function (e) {
          $(this).addClass('binf-focus');
          self.addXYFocus = true;
        });
        xyRail.on('mouseleave', function (e) {
          if (!self.addXYFocus) {
            $(this).removeClass('binf-focus');
          }
          self.addXYFocus = false;
        });
      }
    },

    _refreshScrollbar: function () {
      // console.log('Perfect scrollbar was refreshed in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (this._contentParent && this._perfectScrollbar) {
        // Workaround for broken views, which re-render their content
        // but do not trigger the render event, like table view.
        if (!(this._contentParent.find('.ps-scrollbar-y-rail').length ||
            this._contentParent.find('.ps-scrollbar-x-rail').length)) {
          this._destroyScrollbar();
          this._ensureScrollbar();
        } else {
          this._updateScrollbar();
        }
      }
    },

    _updateScrollbar: function () {
      // console.log('Perfect scrollbar got update in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (this._perfectScrollbar) {
        this._contentParent.perfectScrollbar('update');
      }
    },

    _updateScrollbarFromPropagation: function (event) {
      // console.log('Perfect scrollbar got update from a child in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      event.stopPropagation();
      this._updateScrollbar();
    },

    _destroyScrollbar: function () {
      // console.log('Perfect scrollbar got destroy or re-render in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (this._perfectScrollbar) {
        this._contentParent.perfectScrollbar('destroy');
        this._contentParent.find('.ps-scrollbar-y-rail').off();
        this._contentParent.find('.ps-scrollbar-x-rail').off();
        this._perfectScrollbar = false;
      }
    },

    _getContentParent: function () {
      var contentParent = getOption.call(this, 'contentParent');
      if (contentParent) {
        if (contentParent.insertAfter) { // check for a jQuery object
          return contentParent;
        }
        if (_.isElement(contentParent)) { // check for a HTML element
          return $(contentParent);
        }
        return this.view.$(contentParent); // DOM selector
      }
      return this.view.$el; // use the view root element by default
    },

    _useScrollbar: function () {
      var scrollingDisabled = getOption.call(this, 'scrollingDisabled') ||
                              getOption.call(this, 'scrollingDisabled', this.view.options);
      return !scrollingDisabled;
    },

    _usePerfectScrollbar: function () {
      return PerfectScrollingBehavior.usePerfectScrollbar();
    }
  }, {
    // Support showing and emptying regions in LayoutView,
    // which does not call render
    Region: PerfectScrollingRegion,

    usePerfectScrollbar: function () {
      return config.usePerfectScrollbar &&
             !(base.isTouchBrowser() || base.isIE11() || base.isEdge());
    }
  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return PerfectScrollingBehavior;
});

csui.define('csui/behaviors/keyboard.navigation/tabables.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base'
], function (module, _, $, Marionette, log, base) {
  'use strict';

  log = log(module.id);

  // Default static options for the behaviour object
  var config = module.config();

  var accessibilityRegionClass = 'csui-acc-tab-region';
  var accessibilityActiveRegionClass = 'csui-acc-tab-region-active';

  // FIXME: deprecated - Remove this behavior class.
  // FIXME: deprecated - Remove this behavior class.
  // FIXME: deprecated - Remove this behavior class.

  // This behavior implements a controller for one or more views with the tabable.region.behavior
  // applied.
  var TabablesBehavior = Marionette.Behavior.extend({

        constructor: function TabablesBehavior(options, view) {
          Marionette.Behavior.prototype.constructor.apply(this, arguments);

          var self = this;

          this.view = view;
          this._pushTabableHandler();

          this.tabableRegions = [];
          this.mustSortTabableRegions = false;

          // Backbone/Marionette events (are removed in destroy)
          this.listenTo(view, 'render', this._registerEventHandlers);
          this.listenTo(view, 'destroy', this._popTabableHandler);
          this.listenTo(view, 'dom:refresh', this.setFocusInActiveTabableRegion);

          //In order to prevent tab from going outside a contained area (i.e. dialog),
          //keydown is monitored on the behavioral view. The event listener will only prevent
          //tab outside the behavior view if paramater "containTabFocus' is set to true.
          // LPAD-54770, Make sure that keydown event is registered only once after view creation
          setTimeout(function () {
            view.$el.on('keydown.csui-tabables', function (event) {
              if (event.keyCode === 9 && getOption.call(self, 'containTabFocus')) {
                return self._maintainTabFocus(event);
              }
            });
          });

          //Used for cases where focus should be removed from the active behavior region
          //and placed in the text focusable region. For example when 'escape' is used to
          //to move focus outside of a textbox area to the next tabable region.
          this.listenTo(view, 'changed:focus', this._setFocusToNextRegion);
        }, // constructor

        registerTabableRegion: function (tabableRegion) {
          if ($.contains(this.view.el, tabableRegion.view.el)) {
            this.unregisterTabableRegionBehavior(tabableRegion);
            this.tabableRegions.push(tabableRegion);
            this.mustSortTabableRegions = true;
            return true;
          } else {
            log.debug('registerTabableRegion: not registering non descendant view ' +
                      tabableRegion.view.constructor.name) &&
            console.log(log.last);
            return false;
          }
        },

        unregisterTabableRegionBehavior: function (tabableRegion) {
          if (tabableRegion) {
            if (_.contains(this.tabableRegions, tabableRegion)) {
              // remove that tabableRegionBehavior from the tabableRegions array
              log.debug('unregisterTabableRegion ' + tabableRegion.view.constructor.name) &&
              console.log(log.last);

              this.tabableRegions = _.reject(this.tabableRegions,
                  function (trb) { return trb === tabableRegion; });

              // log.debug("Unsorted tabable regions:") && console.log(log.last);
              // _.each(this.tabableRegions, function (tabableRegionBehavior) {
              //   log.debug(" " + tabableRegionBehavior.view.constructor.name) &&
              //   console.log(log.last);
              // });

            }
          }
        },

        _pushTabableHandler: function () {
          log.debug('_pushTabableHandler in view ' + this.view.constructor.name) &&
          console.log(log.last);
          if (TabablesBehavior.tabablesHandlers.length > 0) {
            var topTabablesHandler = _.last(TabablesBehavior.tabablesHandlers);

            /*
                        var activeIdx = this._getActiveIndex();
                        if (activeIdx !== undefined) {
                          this.activeTabableRegionIndexBeforePush = activeIdx;
                          var activeTabableRegion = this.tabableRegions[activeIdx];
                          this.focusedElementBeforePush = activeTabableRegion.getCurrentlyFocusedElementFromView();
                        } else {
                          delete this.focusedElementBeforePush;
                          delete this.activeTabableRegionIndexBeforePush;
                        }
            */

            // invalidate all tabindexes in the current tabable regions before adding the new
            // "layer" of tabable regions at the top of the stack.
            // This prevents navigating by tab to any of this tabable regions.
            _.each(topTabablesHandler.tabableRegions, function (tabableRegion) {
              tabableRegion._unregisterEventHandlers.call(tabableRegion);
              topTabablesHandler._clearTabIndexes.call(topTabablesHandler, tabableRegion.view);
            }, this);

          }
          TabablesBehavior.tabablesHandlers.push(this);

          // log.debug("Tabables after Push:");
          // _.each(TabablesBehavior.tabablesHandlers, function (tabableHandler) {
          //   log.debug("    TabablesBehavior of view " + tabableHandler.view.constructor.name);
          // });
        },

        _popTabableHandler: function () {
          if (TabablesBehavior.tabablesHandlers.length > 0) {

            var tabableHandlerToPop = _.last(TabablesBehavior.tabablesHandlers);

            log.debug('_popTabableHandler in view ' + tabableHandlerToPop.view.constructor.name) &&
            console.log(log.last);

            _.each(tabableHandlerToPop.tabableRegions, function (tabableRegion) {
              tabableRegion._unregisterEventHandlers.call(tabableRegion);
            });

            // LPAD-54770. Remove keydown listener
            tabableHandlerToPop.view.$el.off('keydown.csui-tabables');

            tabableHandlerToPop.stopListening(tabableHandlerToPop.view);
            TabablesBehavior.tabablesHandlers.pop();

            // after removing the tabables handler from the stack let the tabable regions, that
            // are now on top of the stack re-set its tabindex values to make it keyboard
            // navigable again
            if (TabablesBehavior.tabablesHandlers.length > 0) {
              var topTabableHandler = _.last(TabablesBehavior.tabablesHandlers);
              _.each(topTabableHandler.tabableRegions, function (tabableRegion) {
                tabableRegion.setInitialTabIndex.call(tabableRegion);
                tabableRegion._registerEventHandlers.call(tabableRegion);
              });

              topTabableHandler._setFocusInActiveTabableRegion();
            }
          }
          // log.debug("Tabables after Pop:") && console.log(log.last);
          // _.each(TabablesBehavior.tabablesHandlers, function (tabableHandler) {
          //   log.debug("    TabablesBehavior of view " + tabableHandler.view.constructor.name) &&
          //   console.log(log.last);
          // });
        },

        _sortTabableRegions: function () {
          var tabableRegions = this.tabableRegions;
          var sortedTabableRegions = [];
          var tabableRegionElements = this.view.$el.find('.' + accessibilityRegionClass);
          tabableRegionElements.each(function (index, el) {
            var trb = _.find(tabableRegions, function (tabableRegion) {
              return tabableRegion.view.el === el;
            });
            if (trb) {
              sortedTabableRegions.push(trb);
            }
          });
          this.tabableRegions = sortedTabableRegions;
          this.mustSortTabableRegions = false;

          // log.debug("Sorted tabable regions:") && console.log(log.last);
          // _.each(this.tabableRegions, function (tabableRegion) {
          //   log.debug("    " + tabableRegion.view.constructor.name) && console.log(log.last);
          // });
        },

        //Get the next tabable region with an accessible focusable element.
        _getNextActiveRegion: function (shiftTab, recursiveNavigate) {
          var regions = this.tabableRegions, i, tabableRegion;

          // don't select regions for tabable which are hidden.
          regions = _.filter(regions, function (region) {
            return !region.$el.hasClass('binf-hidden');
          });

          var lastIndex   = regions.length - 1,
              activeIndex = this._getActiveIndex(regions);

          if (recursiveNavigate) {
            i = shiftTab ? (activeIndex === 0 ? lastIndex : activeIndex - 1) :
                (activeIndex === lastIndex ? 0 : activeIndex + 1);
          } else {
            i = shiftTab ? (activeIndex === 0 ? 0 : activeIndex - 1) :
                (activeIndex === lastIndex ? lastIndex : activeIndex + 1);
          }

          // return tabableRegion if it has only one tabable element.
          if (regions.length === 1) {
            tabableRegion = regions[0];
            return tabableRegion;
          }

          while (i != activeIndex) {
            tabableRegion = regions[i];
            var elToFocus = tabableRegion.getCurrentlyFocusedElementFromView(shiftTab);
            if (tabableRegion.view.isTabable() && elToFocus &&
                base.isVisibleInWindowViewport(elToFocus)) {
              // Do not focus elements out of the visible viewport rectangle;
              // it brings them to the visible screen, ignoring the absolute
              // positioning or transforms, if they were applied earlier
              return tabableRegion;
            }

            if (shiftTab) {
              if (i === 0) {
                i = recursiveNavigate ? lastIndex : activeIndex;
              }
              else if (i > 0) {
                --i;
              }
            }
            else {
              if (i === lastIndex) {
                i = recursiveNavigate ? 0 : activeIndex;
              }
              else if (i < lastIndex) {
                ++i;
              }
            }
          }
        },
        //Due to cases (like the target browser where regions are added and removed throughout a dialog
        //display) where regions may be placed out of order due to views being dynamically added and removed
        //throughout the life cycle of the parent container, sort order is reset on every index request.
        _getActiveIndex: function (regions) {
          if (this.currentlyActiveTabableRegion) {
            this._sortTabableRegions();
            var currentlyActive = this.currentlyActiveTabableRegion,
              tabableRegions  = this.tabableRegions;
            if (!!regions) {
              tabableRegions = regions;
            }
            for (var i = 0; i < tabableRegions.length; i++) {
              if (currentlyActive.view.cid === tabableRegions[i].view.cid) {
                return i;
              }
            }
          }
        },

        _deactivateCurrentActiveTabableRegion: function () {
          var activeIdx = this._getActiveIndex();

          if (activeIdx !== undefined && !!this.tabableRegions[activeIdx]) {
            var activeView = this.tabableRegions[activeIdx].view;
            var tabRegionEl = activeView.$el;

            tabRegionEl.removeClass(accessibilityActiveRegionClass);
            delete this.currentlyActiveTabableRegion;
            if (activeView.accDeactivateTabableRegion) {
              log.debug('deactivating tabable region ' + activeView.constructor.name) &&
              console.log(log.last);

              this.tabableRegions[activeIdx].ignoreFocusEvents = true;
              activeView.accDeactivateTabableRegion.call(activeView);
              this.tabableRegions[activeIdx].ignoreFocusEvents = false;
            }
          }
          return activeIdx;
        },

        _setTabableRegionActive: function (tabableRegion, shiftTab) {
          log.debug('activating ' + tabableRegion.view.constructor.name + ' as active tabable' +
                    ' region') && console.log(log.last);

          this._deactivateCurrentActiveTabableRegion();
          tabableRegion.view.$el.addClass(accessibilityActiveRegionClass);
          this.currentlyActiveTabableRegion = tabableRegion;
          if (tabableRegion.view.accActivateTabableRegion) {
            tabableRegion.ignoreFocusEvents = true;
            tabableRegion.view.accActivateTabableRegion.call(tabableRegion.view, shiftTab);
            tabableRegion.ignoreFocusEvents = false;
          }
        },

        _setFocusInActiveTabableRegion: function (shiftTab) {
          if (this.currentlyActiveTabableRegion) {
            // this._setTabableRegionActive(this.currentlyActiveTabableRegion);
            this.currentlyActiveTabableRegion.setFocus(shiftTab);
          } else {
            // try to focus on a preferred region if no one is known as the active region, but
            // don't store it as the currently active one. This must be actively done by a
            // tabable region.
            var tabableRegionsByWeight = _.sortBy(this.tabableRegions, function (tabableRegion) {
              return tabableRegion.view.options.initialActivationWeight;
            });
            var preferredRegion = _.last(tabableRegionsByWeight);
            if (preferredRegion && preferredRegion.view.options.initialActivationWeight > 0) {
              log.debug("setFocus: " + preferredRegion.view.constructor.name) &&
              console.log(log.last);
              preferredRegion.setFocus(shiftTab);
            }
          }
        },

        _clearTabIndexes: function (view) {
          // log.debug('_clearTabIndexes in view ' + view.constructor.name) && console.log(log.last);
          // find tabable/focusable elements including the view.$el element
          var focusables = view.$el.find(TabablesBehavior.focusablesSelector).addBack(
              TabablesBehavior.focusablesSelector);
          if (focusables.length) {
            focusables.prop('tabindex', -1);
          } else {
            log.debug('_clearTabIndexes: no focusables found in ' + view.constructor.name) &&
            console.log(log.last);
          }
        },

        _maintainTabFocus: function (event) {
          var shiftTab    = event.shiftKey,
              activeIndex = this._getActiveIndex();
          //If an activeIndex is not available it is because regional focus has not
          //been set yet and this is the first tab request.
          if (activeIndex !== undefined) {
            var activeRegion = this.tabableRegions[activeIndex];
            var recursiveNavigate = getOption.call(this, 'recursiveNavigation');
            if (!!activeRegion && activeRegion.onlastTabElement(shiftTab, event)) {
              var nextActiveRegion = this._getNextActiveRegion(shiftTab, false);
              if (!nextActiveRegion) {
                nextActiveRegion = this._getNextActiveRegion(shiftTab, recursiveNavigate);

              }
              if (nextActiveRegion) {
                this._setTabableRegionActive(nextActiveRegion, shiftTab);
                this._setFocusInActiveTabableRegion(shiftTab);
              }
              return false;
            }
          }
          return true;
        },

        _setFocusToNextRegion: function setFocusToNextRegion(shiftTab) {
          var recursiveNavigate = getOption.call(this, 'recursiveNavigation');
          var nextActiveRegion = this._getNextActiveRegion(shiftTab, recursiveNavigate);
          if (nextActiveRegion) {
            this._setTabableRegionActive(nextActiveRegion);
            this._setFocusInActiveTabableRegion();
          }
        }
      },
      {
        // array with all TabablesBehavior instances
        tabablesHandlers: [],

        focusablesSelector: 'a[href], area[href], input, select, textarea, button,' +
                            ' iframe, object, embed, *[tabindex], *[contenteditable]',

        clearTabIndexes: function (view) {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior && $.contains(tabablesBehavior.view.el, view.el)) {
            tabablesBehavior._clearTabIndexes.call(tabablesBehavior, view);
          }
        },

        setTabableRegionActive: function (tabableRegion) {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior && $.contains(tabablesBehavior.view.el, tabableRegion.view.el)) {
            tabablesBehavior._setTabableRegionActive.call(tabablesBehavior, tabableRegion);
          }
        },

        registerTabableRegion: function (tabableRegion) {
          log.debug('registerTabableRegion for view ' + tabableRegion.view.constructor.name) &&
          console.log(log.last);

          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            return tabablesBehavior.registerTabableRegion.call(tabablesBehavior, tabableRegion);
          }
        },

        unregisterTabableRegion: function (tabableRegion) {
          if (tabableRegion) {
            // make it simple: don't search for the tabables behavior instance. Just remove it
            // from everyone.
            _.each(TabablesBehavior.tabablesHandlers, function (tabablesBehavior) {
              tabablesBehavior.unregisterTabableRegionBehavior.call(tabablesBehavior,
                  tabableRegion);
            });
          }
        },

        // Activate (set focus) of the region that has the highest weight value in the tabable
        // region behavior options.
        //  This should be called when regions are actually shown in the dom.
        //  If a region is already active, skip initial activation.

        setFocusInActiveTabableRegion: function activateInitialTabableRegion() {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            tabablesBehavior._setFocusInActiveTabableRegion.call(tabablesBehavior);
          }
        },

        popTabableHandler: function () {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            tabablesBehavior._popTabableHandler();
          }
        }

      });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return TabablesBehavior;
});

csui.define('csui/behaviors/keyboard.navigation/tabable.region.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'csui/behaviors/keyboard.navigation/tabables.behavior'
], function (module, _, $, Marionette, log, base, TabablesBehavior) {
  'use strict';


  // FIXME: deprecated - Remove this behavior class.
  // FIXME: deprecated - Remove this behavior class.
  // FIXME: deprecated - Remove this behavior class.

  var TabableRegionBehavior = Marionette.Behavior.extend({

      defaults: {
        initialActivationWeight: 0
      },

      constructor: function TabableRegionBehavior(options, view) {
        Marionette.Behavior.prototype.constructor.apply(this, arguments);

        this.view = view;
        view.tabableRegionBehavior = this;

        // merge behavior defaults into view
        _.extend(view, this.defaults);

        // add default implementation to view if it does not have one
        _.defaults(view, {
            // TODO remove use of isTabable because there is no code that gets called when the user
            // presses the tab key
            isTabable: function () {
              return true;  // default: this view can be reached by tab
            },
            onLastTabElement: function () {
              return true;  //most regions will only have one tab, with further navigation handled through arrow keys
            }
          }
        );

        if (view.options && !view.options.initialActivationWeight) {
          view.options.initialActivationWeight = this.options.initialActivationWeight;
        }

        this._registerEventHandlers();

      },

      _registerEventHandlers: function () {
        if (!this._eventsRegistered) {
          var view = this.view;
          var self = this;

          // log.debug('_registerEventHandlers ' + view.constructor.name) && console.log(log.last);

          this.listenTo(view, 'render', this._applyClasses);
          this.listenTo(view, 'dom:refresh', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (TabablesBehavior.registerTabableRegion(this)) {
              self.isRegistered = true;
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });
          this.listenTo(view, 'refresh:tabindexes', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (self.isRegistered) {
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });

          this.listenTo(view, 'destroy', function () {
            TabablesBehavior.unregisterTabableRegion(this);
            TabablesBehavior.clearTabIndexes(view);
            self.isRegistered = false;
          });
          this.listenTo(view, 'tabable', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (TabablesBehavior.registerTabableRegion(this)) {
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });
          this.listenTo(view, 'tabable:not', function () {
            TabablesBehavior.unregisterTabableRegion(this);
            TabablesBehavior.clearTabIndexes(view);
            this.isRegistered = false;
          });

          this.listenTo(view, 'changed:focus', function () {
            if (self.isRegistered) {
              this.moveTabIndex();
            }
          });

          this.listenTo(view, 'escaped:focus', function () {
            TabablesBehavior.setFocusInActiveTabableRegion();
          });
          this._eventsRegistered = true;
        }
      },

      _unregisterEventHandlers: function () {
        var view = this.view;
        // log.debug('_unregisterEventHandlers ' + view.constructor.name) && console.log(log.last);

        this.stopListening(view);
        this._eventsRegistered = false;
      },

      getCurrentlyFocusedElementFromView: function (shiftTab) {
        if (_.isFunction(this.view.currentlyFocusedElement)) {
          var focusEl = this.view.currentlyFocusedElement({shiftKey: shiftTab});
          return (focusEl instanceof $ ? focusEl : $(focusEl));
        } else {
          if (_.isString(this.view.currentlyFocusedElement)) {
            return this.view.$(this.view.currentlyFocusedElement);
          } else {
            log.debug('setInitialTabIndex: ' + this.view.constructor.name + ' does not have' +
              ' currentlyFocusedElement -> not setting tabindex in that view ') &&
            console.log(log.last);
            return $();
          }
        }
      },

      onlastTabElement: function (shiftTab, event) {
        return this.view.onLastTabElement(shiftTab, event);
      },

      setFocus: function (shiftTab) {
        // Not set focus if the view is requested so that the behavior is not stealing the focus.
        // After rendering, the view is setting focus on element at same location by itself.
        if (this.options.notSetFocus) {
          return;
        }

        var elToFocus = this.getCurrentlyFocusedElementFromView(shiftTab);
        // Do not focus elements out of the visible viewport rectangle;
        // it brings them to the visible screen, ignoring the absolute
        // positioning or transforms, if they were applied earlier
        if (elToFocus && base.isVisibleInWindowViewport(elToFocus)) {
          this.ignoreFocusEvents = true;
          elToFocus.trigger('focus');
          this.ignoreFocusEvents = false;
        }
      },

      setInitialTabIndex: function () {
        // TabablesBehavior.clearTabIndexes(this.view);
        if (this.currentlyFocusedElement) {
          this.currentlyFocusedElement.off('focus.' + this.view.cid);
        }
        if (this.view.isTabable()) {
          try {
            this.currentlyFocusedElement = this.getCurrentlyFocusedElementFromView();
            if (this.currentlyFocusedElement && this.currentlyFocusedElement.length > 0) {
              var self = this;
              this.currentlyFocusedElement.prop('tabindex', 0);
              this.currentlyFocusedElement.addClass(
                TabableRegionBehavior.accessibilityActiveElementClass);
              this.currentlyFocusedElement.on('focus.' + this.view.cid, function () {
                if (!self.ignoreFocusEvents) {
                  TabablesBehavior.setTabableRegionActive(self);
                }
              });
            }
          } catch (e) {
            console.warn('Could not set as active element: ', this.view.cid, e.message);
          }

        } else {
          this.currentlyFocusedElement = $();
        }
      },

      moveTabIndex: function () {
        var self = this;
        if (this.currentlyFocusedElement) {
          this.currentlyFocusedElement.off('focus.' + this.view.cid);
          this.currentlyFocusedElement.prop('tabindex', -1);
          this.currentlyFocusedElement.removeClass(
            TabableRegionBehavior.accessibilityActiveElementClass);
          this.currentlyFocusedElement = $();

        }
        var newlyFocusedElement = this.getCurrentlyFocusedElementFromView();
        newlyFocusedElement.prop('tabindex', 0);
        this.currentlyFocusedElement = newlyFocusedElement;
        this.currentlyFocusedElement.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.currentlyFocusedElement.on('focus.' + this.view.cid, function () {
          if (!self.ignoreFocusEvents) {
            TabablesBehavior.setTabableRegionActive(self);
          }
        });
      },

      _applyClasses: function () {
        this.$el.addClass(TabableRegionBehavior.accessibilityRegionClass);
      }
    },
    {
      accessibilityRegionClass: 'csui-acc-tab-region',
      accessibilityActiveRegionClass: 'csui-acc-tab-region-active',
      accessibilityFocusableClass: 'csui-acc-focusable',
      accessibilityActiveElementClass: 'csui-acc-focusable-active'
    }
  );

  return TabableRegionBehavior;
});

// Lists explicit locale mappings and fallbacks

csui.define('csui/controls/globalmessage/impl/progresspanel/impl/nls/progresspanel.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/globalmessage/impl/progresspanel/impl/nls/root/progresspanel.lang',{
  // Upload
  BytesOfSize: '{0} of {1}',
  UploadingItems: 'Uploading {0} items',
  UploadingOneItem: 'Uploading item',
  UploadingSomeItems: 'Uploading {0} items',
  UploadOneItemSuccessMessage: '"{0}" uploaded',
  UploadManyItemsSuccessMessage: "Uploaded {0} items",
  UploadOneItemFailMessage: '"{0}" failed to upload',
  UploadSomeItemsFailMessage: "{0} items failed to upload",
  UploadManyItemsFailMessage: "{0} items failed to upload",
  UploadSomeItemsFailMessage2: "{2} items failed to upload",   // {2} !!
  UploadManyItemsFailMessage2: "{2} items failed to upload",   // {2} !!
  UploadingSingleItem: 'Uploading "{0}"',
  FinalizingSingleItem: 'Finalizing "{0}"',
  UploadingOneItemStopped: '"{0}" stopped',
  UploadingAllItemsStopped: "{0} items stopped",
  UploadSomeItemsStopped: "Upload completed",

  // states
  State_pending: 'Waiting',
  State_processing: 'Processing',
  State_resolved: 'Done',
  State_rejected: 'Failed',
  State_aborted: 'Cancelled',
  State_stopped: 'Stopped',
  State_stopping: 'Stopping',
  State_finalizing: 'Finalizing',
  StateAction_pending: 'Waiting',
  StateAction_processing: 'Stop',
  StateAction_resolved: 'Done',
  StateAction_rejected: 'Done',
  StateAction_aborted: 'Done',
  Cancel: 'Cancel',
  CancelAria: 'Cancel upload of {0} item',
  StateAction_all_pending: 'Waiting for upload of all items',
  StateAction_all_processing: 'Stop upload of all items',
  StateAction_all_resolved: 'All items uploaded',
  StateAction_all_rejected: 'All items rejected to upload',
  StateAction_all_aborted: 'All items aborted to upload',
  Expand: 'Expand details',
  Collapse: 'Collapse details',
  Close: 'Close',
  CloseAria: 'Close the progress panel',
  minimize: 'Hide message banner ',
  minimizeAria: 'Hide message banner',
  UploadingLocation: 'Uploading to "{0}"',
  UploadedLocation: 'Uploaded to "{0}"',
  Retry: 'Retry',
  RetryAll: 'Retry all',
  GotoLocationLinkLabel: "Go to location"
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"csui-stateaction csui-progresscell\">\r\n        <button type=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.stateaction_all_pending || (depth0 != null ? depth0.stateaction_all_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_all_pending","hash":{}}) : helper)))
    + "\"\r\n                class=\"csui-stateaction-pending\r\n        csui-icon-like-btn binf-btn binf-btn-default\">"
    + this.escapeExpression(((helper = (helper = helpers.stateaction_pending || (depth0 != null ? depth0.stateaction_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_pending","hash":{}}) : helper)))
    + "</button>\r\n        <button type=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.stateaction_all_processing || (depth0 != null ? depth0.stateaction_all_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_all_processing","hash":{}}) : helper)))
    + "\"\r\n                class=\"csui-stateaction-processing csui-icon-like-binf-btn binf-hidden binf-btn binf-btn-default\">\r\n            "
    + this.escapeExpression(((helper = (helper = helpers.stateaction_processing || (depth0 != null ? depth0.stateaction_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_processing","hash":{}}) : helper)))
    + "</button>\r\n      </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "        <div class=\"csui-show-retryAll binf-hidden\">\r\n          <button type=\"button\" class=\"csui-retry-all\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.retryAll || (depth0 != null ? depth0.retryAll : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"retryAll","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.retryAll || (depth0 != null ? depth0.retryAll : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"retryAll","hash":{}}) : helper)))
    + "\" tabindex='0'>"
    + this.escapeExpression(((helper = (helper = helpers.retryAll || (depth0 != null ? depth0.retryAll : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"retryAll","hash":{}}) : helper)))
    + "</button>\r\n        </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "binf-hidden";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"csui-minimize csui-minimizecell\">\r\n        <button type=\"button\" class=\"icon-progresspanel-minimize binf-btn binf-btn-default\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.minimizeAria || (depth0 != null ? depth0.minimizeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"minimizeAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.minimize || (depth0 != null ? depth0.minimize : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"minimize","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></button>\r\n      </div>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "  <a class=\"csui-gotolocation-url binf-hidden\" href=\""
    + this.escapeExpression(((helper = (helper = helpers.targetLocationUrl || (depth0 != null ? depth0.targetLocationUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"targetLocationUrl","hash":{}}) : helper)))
    + "\" role=\"button\">"
    + this.escapeExpression(((helper = (helper = helpers.gotoLocation || (depth0 != null ? depth0.gotoLocation : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"gotoLocation","hash":{}}) : helper)))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-header\">\r\n  <div class=\"csui-progressrow csui-height-target\">\r\n    <div class=\"csui-names-progress\">\r\n      <div class=\"csui-names csui-progresscell\">\r\n        <div class=\"csui-header-icon csui-icon binf-hidden\"></div>\r\n        <div class=\"csui-title\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.progressTitleId || (depth0 != null ? depth0.progressTitleId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"progressTitleId","hash":{}}) : helper)))
    + "\">\r\n          "
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\r\n        </div>\r\n      </div>\r\n      <div class=\"csui-progress csui-progresscell\">\r\n        <div class=\"csui-progress-dynamic binf-hidden\">\r\n          <div class=\"csui-progress-textbar\">\r\n            <div class=\"binf-progress\">\r\n              <div class=\"binf-progress-bar\" role=\"progressbar\" aria-valuenow=\""
    + this.escapeExpression(((helper = (helper = helpers.percentage || (depth0 != null ? depth0.percentage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"percentage","hash":{}}) : helper)))
    + "\"\r\n                   aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:"
    + this.escapeExpression(((helper = (helper = helpers.percentage || (depth0 != null ? depth0.percentage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"percentage","hash":{}}) : helper)))
    + "%\">\r\n              </div>\r\n            </div>\r\n            <div class=\"loading-dots\">\r\n                <div class=\"csui-loading-parent-wrapper binf-disabled csui-disbaled\">\r\n                    <span class=\"csui-loading-dots-wrapper\">\r\n                        <span class=\"csui-loading-dot\"></span>\r\n                        <span class=\"csui-loading-dot\"></span>\r\n                        <span class=\"csui-loading-dot\"></span>\r\n                    </span>\r\n                </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"csui-progress-static\" aria-hidden=\"true\">\r\n          <div class=\"csui-progress-textbar\">\r\n            <div class=\"csui-progress-static-pending\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_pending || (depth0 != null ? depth0.state_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_pending","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_pending || (depth0 != null ? depth0.state_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_pending","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-processing binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_processing || (depth0 != null ? depth0.state_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_processing","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_processing || (depth0 != null ? depth0.state_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_processing","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-resolved binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_resolved || (depth0 != null ? depth0.state_resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_resolved","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_resolved || (depth0 != null ? depth0.state_resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_resolved","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-rejected binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_rejected || (depth0 != null ? depth0.state_rejected : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_rejected","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_rejected || (depth0 != null ? depth0.state_rejected : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_rejected","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-aborted binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_aborted || (depth0 != null ? depth0.state_aborted : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_aborted","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_aborted || (depth0 != null ? depth0.state_aborted : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_aborted","hash":{}}) : helper)))
    + "</div>\r\n          </div>\r\n          <div class=\"csui-percent\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-states-actions\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCancel : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableRetry : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      <div class=\"csui-expand csui-progresscell "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.singleItem : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n        <button type=\"button\" class=\"csui-expand-down binf-btn binf-btn-default\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.expand || (depth0 != null ? depth0.expand : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expand","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.expand || (depth0 != null ? depth0.expand : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expand","hash":{}}) : helper)))
    + "\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n          <span class=\"icon csui-icon icon-expandArrowDown\" /></button>\r\n          <button type=\"button\" class=\"csui-expand-up binf-hidden binf-btn binf-btn-default\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.collapse || (depth0 != null ? depth0.collapse : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"collapse","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.collapse || (depth0 != null ? depth0.collapse : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"collapse","hash":{}}) : helper)))
    + "\" aria-haspopup=\"true\" aria-expanded=\"true\">\r\n            <span class=\"icon csui-icon icon-expandArrowUp\" /></button>\r\n      </div>\r\n      <div class=\"csui-close csui-progresscell binf-hidden\">\r\n        <button type=\"button\" class=\"binf-btn binf-btn-default\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeAria || (depth0 != null ? depth0.closeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.close || (depth0 != null ? depth0.close : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"close","hash":{}}) : helper)))
    + "\" >\r\n          <span class=\"csui-action-close csui-icon\" /></button>\r\n      </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableMinimiseButton : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n  </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.targetLocationUrl : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n<div class=\"csui-items-wrapper\">\r\n  <div class=\"csui-items\" role=\"list\">\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_controls_globalmessage_impl_progresspanel_impl_progresspanel', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/globalmessage/impl/progresspanel/impl/progressbar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-progressbar csui-progressrow\" style=\"height:48px;\">\r\n  <div class=\"csui-name-status\" role=\"listitem\"  aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"  tabindex=\"-1\">\r\n    <div class=\"csui-names-progress "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.singleItem : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n      <div class=\"csui-names csui-progresscell\">\r\n        <div class=\"csui-name csui-progresscell\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n          "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n        </div>\r\n      </div>\r\n      <div class=\"csui-states-actions\">\r\n        <div class=\"csui-stateaction csui-progresscell "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.singleItem : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCancel : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          <div\r\n               class=\"csui-stateaction-resolved binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-success\" />\r\n          <div\r\n               class=\"csui-stateaction-rejected binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-error\" />\r\n          <div class=\"csui-stateaction-aborted binf-hidden\" />\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "binf-hidden";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "          <button type=\"button\" class=\"csui-stateaction-pending binf-btn binf-btn-default icon csui-icon\r\n                                       circle_delete\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" />\r\n          <button type=\"button\" class=\"csui-stateaction-processing binf-hidden binf-btn binf-btn-default icon\r\n                                       csui-icon circle_delete\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" />\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.bundleDivider : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "<div class=\"csui-name-status\" role=\"listitem\"  aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" tabindex=\"-1\">\r\n  <div class=\"csui-names-progress "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.singleItem : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n    <div class=\"csui-names csui-progresscell\">\r\n      <div class=\"csui-type "
    + this.escapeExpression(((helper = (helper = helpers.type_icon_class || (depth0 != null ? depth0.type_icon_class : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type_icon_class","hash":{}}) : helper)))
    + "\">\r\n      </div>\r\n      <div class=\"csui-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"csui-states-actions\">\r\n    <div class=\"csui-stateaction csui-progresscell "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.singleItem : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n      <div class=\"csui-stateaction-resolved binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-success\" />\r\n      <div class=\"csui-stateaction-rejected binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-error\" />\r\n      <div class=\"csui-stateaction-aborted binf-hidden\" />\r\n    </div>\r\n    <div class=\"csui-progress csui-progresscell\">\r\n      <div class=\"csui-progress-dynamic binf-hidden\" aria-hidden=\"true\">\r\n        <div class=\"csui-loading-parent-wrapper binf-disabled csui-disbaled\">\r\n          <span class=\"csui-loading-dots-wrapper\">\r\n            <span class=\"csui-loading-dot\">\r\n            </span>\r\n            <span class=\"csui-loading-dot\">\r\n            </span>\r\n            <span class=\"csui-loading-dot\">\r\n            </span>\r\n          </span>\r\n        </div>\r\n      </div>\r\n      <div class=\"csui-progress-static\"  aria-hidden=\"true\">\r\n        <div class=\"csui-progress-textbar\">\r\n          <div class=\"csui-progress-static-pending\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_pending || (depth0 != null ? depth0.state_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_pending","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_pending || (depth0 != null ? depth0.state_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_pending","hash":{}}) : helper)))
    + "\r\n          </div>\r\n          <div class=\"csui-progress-static-processing binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_processing || (depth0 != null ? depth0.state_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_processing","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_processing || (depth0 != null ? depth0.state_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_processing","hash":{}}) : helper)))
    + "\r\n          </div>\r\n          <div class=\"csui-progress-static-resolved binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_resolved || (depth0 != null ? depth0.state_resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_resolved","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_resolved || (depth0 != null ? depth0.state_resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_resolved","hash":{}}) : helper)))
    + "\r\n          </div>\r\n          <div class=\"csui-progress-static-rejected binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "\r\n          </div>\r\n          <div class=\"csui-progress-static-aborted binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_aborted || (depth0 != null ? depth0.state_aborted : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_aborted","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_aborted || (depth0 != null ? depth0.state_aborted : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_aborted","hash":{}}) : helper)))
    + "\r\n          </div>\r\n          <div class=\"csui-progress-static-stopped binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_stopped || (depth0 != null ? depth0.state_stopped : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_stopped","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_stopped || (depth0 != null ? depth0.state_stopped : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_stopped","hash":{}}) : helper)))
    + "\r\n          </div>\r\n          <div class=\"csui-progress-static-stopping binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_stopping || (depth0 != null ? depth0.state_stopping : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_stopping","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_stopping || (depth0 != null ? depth0.state_stopping : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_stopping","hash":{}}) : helper)))
    + "\r\n          </div>\r\n          <div class=\"csui-progress-static-finalizing binf-hidden\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.state_finalizing || (depth0 != null ? depth0.state_finalizing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_finalizing","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.state_finalizing || (depth0 != null ? depth0.state_finalizing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_finalizing","hash":{}}) : helper)))
    + "\r\n          </div>\r\n        </div>\r\n        <div class=\"csui-percent\">\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"Error-message binf-hidden\">\r\n      <div class=\"csui-error\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"error","hash":{}}) : helper)))
    + "\">\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"error","hash":{}}) : helper)))
    + "\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-stateaction csui-progress-cancel\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCancel : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableRetry : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  </div>\r\n</div>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-progresspanel-divider\">\r\n  "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.location : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.targetLocationUrl : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " \r\n</div>\r\n";
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return " <span class=\"csui-progresspanel-location binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"location","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"location","hash":{}}) : helper)))
    + "</span>";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "<a class=\"csui-gotolocation-url binf-hidden binf-pull-right\" href=\""
    + this.escapeExpression(((helper = (helper = helpers.targetLocationUrl || (depth0 != null ? depth0.targetLocationUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"targetLocationUrl","hash":{}}) : helper)))
    + "\" role=\"button\">"
    + this.escapeExpression(((helper = (helper = helpers.gotoLocation || (depth0 != null ? depth0.gotoLocation : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"gotoLocation","hash":{}}) : helper)))
    + "</a>";
},"12":function(depth0,helpers,partials,data) {
    var helper;

  return "      <button type=\"button\" class=\"csui-stateaction-pending binf-btn binf-btn-default icon csui-icon\r\n                                   circle_delete\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" tabindex=\"-1\"/>\r\n      <button type=\"button\" class=\"csui-stateaction-processing binf-hidden binf-btn binf-btn-default icon\r\n                                   csui-icon circle_delete\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" tabindex=\"-1\" />\r\n      <div class=\"csui-stateaction-stopped binf-hidden\"></div>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"csui-show-retry binf-hidden\">\r\n        <button type=\"button\" class=\"csui-showRetry\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.retry || (depth0 != null ? depth0.retry : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"retry","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.retry || (depth0 != null ? depth0.retry : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"retry","hash":{}}) : helper)))
    + "\" tabindex='-1'>"
    + this.escapeExpression(((helper = (helper = helpers.retry || (depth0 != null ? depth0.retry : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"retry","hash":{}}) : helper)))
    + "</button>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.commandName : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(6, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_globalmessage_impl_progresspanel_impl_progressbar', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',[],function(){});

csui.define('css!csui/controls/globalmessage/globalmessage_icons',[],function(){});
// An application widget is exposed via a RequireJS module
csui.define('csui/controls/globalmessage/impl/progresspanel/progresspanel.view',[
  'csui/lib/underscore',                             // Cross-browser utility belt
  'csui/lib/jquery',
  'csui/lib/marionette',                             // MVC application support
  'csui/utils/nodesprites',
  'i18n',
  'module',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/controls/globalmessage/impl/progresspanel/impl/nls/progresspanel.lang',  // Use localizable texts
  'hbs!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',     // Template to render the HTML
  'hbs!csui/controls/globalmessage/impl/progresspanel/impl/progressbar',       // Template to render the HTML
  'css!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',            // Stylesheet needed for this view
  'css!csui/controls/globalmessage/globalmessage_icons'
],  function (_, $, Marionette, NodeSprites, i18n, module, Base, PerfectScrollingBehavior, TabableRegionBehavior,
   lang, panelTemplate, barTemplate) {
  'use strict';

  var config = _.defaults({
    panelRefreshThrottle : 400 // This delay is calculated considering slide-in animation delay of progress panel list view
  }, module.config().csui);

  var BarStateValues = ["pending", "processing", "rejected", "resolved", "aborted", "stopped", "stopping", "finalizing"];
  
  var updateProgressArea = function (elem, info) {
    var errorElem = elem.find(".csui-progress-static-rejected");
    // update progress indicator
    if (info.dynamic === undefined ? info.state === "processing" : info.dynamic) {
      var progressBar = elem.find(".binf-progress-bar");
      this.options.messageHelper.switchField(elem, ".csui-progress", "dynamic",
          ["static", "dynamic"]);
      // update progressbar
      var bytesOfSize = _.str.sformat(lang.BytesOfSize,
          Base.getReadableFileSizeString(info.count),
          Base.getReadableFileSizeString(info.total));
      elem.find(".csui-progress-text").text(bytesOfSize);
      progressBar.attr("aria-valuenow", info.percentage);
      progressBar.css("width", _.str.sformat("{0}%", info.percentage));

      // update percent field
      elem.find(".csui-progress-dynamic .csui-percent").text(
          _.str.sformat("{0}%", info.percentage));
      elem.find('.csui-title').attr('aria-label',
          _.str.sformat("{0} {1}%", info.label, info.percentage));

    } else {
      this.options.messageHelper.switchField(elem, ".csui-progress", "static",
          ["static", "dynamic"]);
      // update state field
      this.options.messageHelper.switchField(elem, ".csui-progress-static", info.state,
          BarStateValues);
      var stateAriaLabel = _.str.sformat("{0} {1}", info.label,
          lang["State_" + info.state]);
      elem.find('.csui-title')
          .attr('aria-label', stateAriaLabel);
    }
    
    errorElem.text(info.errorMessage);
    errorElem.attr("title", info.errorMessage);
    if (info.errorMessage) {
      elem.addClass('csui-error');
    }

    // update action field
    this.options.messageHelper.switchField(elem, ".csui-stateaction", info.state,
        BarStateValues);

  };

  var getContainerName = function (model) {
    var container = model.uploadContainer || model.container;
    return container && container.get('name');
  };

  // Returns true if the action (upload/copy/move/etc,.) performed on models have different container
  var isMultiContainer = function (models) {
    var firstFolder = getContainerName(models[0]),
    lastFolder = getContainerName(models.reduce(function(currentModel, nextmodel) {
      return (getContainerName(currentModel) === getContainerName(nextmodel)) ? currentModel : !nextmodel;
    }));
    return firstFolder !== lastFolder;
  };

  var ProgressBarView = Marionette.ItemView.extend({

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function ProgressBarView(options) {

      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.ItemView.prototype.constructor.call(this, options);

      // TODO: Make the progressbar a reusable component; do not
      // misuse the file-upload-progressbar for other scenarios.
      // For upload, the model has the MIME type set from the file
      // object available. For copy, delete and move commnds
      // the model does not have it set and the node is complete
      // by fetching it from the server.
      var model = this.model;
      if (!!model.node && model.node.get('mime_type') === undefined) {
        model.node.set({
          container: false,
          // obtain type from model, which contains the actual type from /validations REST API response
          // and keep the hardcoded existence sub-type (ie., 144)) in it's abscense to maintain backward compatibility.
          type: model.node.get('type') || 144,
          mime_type: model.get('mime_type') || model.get('type')
        }, {silent: true});
      }

      // Whenever properties of the model change, re-render the view with throttle of 1 Sec
      this.listenTo(this.model, 'change',  _.throttle(this._updateItem, config.panelRefreshThrottle));
      this.listenTo(this.model, 'change:state', this._updateItem); //Update immediatly when state is changed
    },

    _updateItem: function () {
      var info = this._computeProgress(),
          elem = this.$el;
      updateProgressArea.call(this, elem, info);
    },

    _computeProgress: function () {
      var count      = this.model.get('count'),
          total      = this.model.get('total'),
          state      = this.model.get("state"),
          percentage = (total > 0 && count >= 0) ? Math.floor(count / total * 100) : 0;
      // 100% will be reached, when the file gets uploaded, but then
      // the server will start saving the document.  Do not show the
      // end-user 100%, when they still need to wait.
      if (percentage === 100 && state === 'processing') {
        state = 'finalizing';
        this.model.set({state : state});
        if (this.$el.find('.csui-name-status button').not(".binf-hidden").is(':focus')) {
          this.ui.itemRow.trigger('focus');
        }
        this.$el.find(".csui-stateaction-processing").addClass('binf-hidden');
      }
      return {
        count: count,
        total: total,
        percentage: percentage,
        state: state,
        errorMessage: this.model.get("errorMessage"),
        label: _.str.sformat("{0} {1}", this.options.oneFilePending, this.getItemLabel())
      };
    },

    className: "csui-progressbar csui-progressrow",

    template : barTemplate,
    
    getItemLabel: function () {
      return this.model.get('newName') || this.model.get('name');
    },

    templateHelpers: function () {
      var info        = this._computeProgress(),
          model       = this.model,
          singleItem  = this.collection.length === 1,
          name        = this.getItemLabel(),
          cancelAria  = _.str.sformat(lang.CancelAria, name),
          commandName = !!model.get('commandName') || model.get('commandName'),
          targetLocation = !this.options.hideGotoLocationMultiSet && 
                            !!model.get('location') ? model.get('targetLocation') : undefined;
      info.name = name;
      info.enableCancel = this.options.enableCancel;
      info.type_icon_class = this.model.node ? NodeSprites.findClassByNode(this.model.node) : "";
      BarStateValues.forEach(function (value) {
        info["state_" + value] = lang["State_" + value];
      });
      info.cancel = lang.Cancel;
      info.cancelAria = cancelAria;
      info.expand = lang.Expand;
      info.collapse = lang.Collapse;
      info.close = lang.Close;
      info.singleItem = singleItem;
      info.minimize = lang.minimize;
      info.minimizeAria = lang.minimizeAria;
      info.retry = lang.Retry;
      info.gotoLocation = lang.GotoLocationLinkLabel;
      info.targetLocationUrl = targetLocation ? targetLocation.url : undefined;
      info.enableRetry = config.enableRetry;
      return info;
    },

    onRender: function () {
      this._updateItem();
    },

    ui: {
      pendingAction: '.csui-stateaction-pending',
      processingAction: '.csui-stateaction-processing',
      error: '.csui-error',
      retryContainer: '.csui-show-retry',
      retryButton: '.csui-showRetry',
      gotoLocationElem: '.csui-gotolocation-url',
      cancelButton : '.csui-name-status button',
      itemRow : '.csui-name-status'
    },

    events: {
      'click @ui.pendingAction': 'doCancel',
      'click @ui.processingAction': 'doCancel',
      'keydown @ui.pendingAction': 'handleKeydownOnCancel',
      'keydown @ui.processingAction': 'handleKeydownOnCancel',
      'click @ui.retryButton': 'processRetry',
      'keydown @ui.retryButton': 'processRetry',
      'click @ui.gotoLocationElem' : 'hanldleClickGotoLocation',
      'keydown' : 'handleKeydownEvent'
    },

    setFocus: function () {
      this.$el.addClass('focused-row');
      var button = this.$el.find('button').not(".binf-hidden");
      if (button.length !== 0) {
        button.trigger('focus');
        return button;
      } else {
        this.ui.itemRow.trigger('focus');
        return this.ui.itemRow;
      }
    },

    removeFocus: function () {
      this.$el.removeClass('focused-row');
    },

    doCancel: function () {
      this.model.abort();
    },

    handleKeydownOnCancel: function (event) {
      if ((event.keyCode === 32 || event.keyCode === 13) && this.ui.cancelButton.not(".binf-hidden").is(':focus')) {
        this.ui.itemRow.trigger('focus');
        this.doCancel();
      }
    },

    processRetry: function (event) {
      if ((event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) || (event.type === 'click')) {
       this.model.trigger("try:again");
      }
    },

    showGotoLocationElem: function () {
      this.ui.gotoLocationElem && this.ui.gotoLocationElem.removeClass("binf-hidden");
    },

    showRetryElem: function () {
      if (config.enableRetry && !!this.model.get('serverFailure')) {
        this.ui.retryContainer.removeClass("binf-hidden");
      }
    },

    handleKeydownEvent: function (event) {
      if (event.keyCode === 38 || event.keyCode === 40) {
        this.trigger("keydown:item", event);
      }
    },

    hanldleClickGotoLocation: function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.trigger("click:gotolocation");
    },

    handleProgressComplete : function () {
      this.showGotoLocationElem();
      this.showRetryElem();
    }

  });

  var ProgressPanelView = Marionette.CompositeView.extend({

    
    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function ProgressPanelView(options) {
      options || (options = {});
      this.focusChildIndex = -1;
      this.currentFocusIndex = 0;
      this.loadingCount = 0;
      _.defaults(options, {
        oneFileSuccess: lang.UploadOneItemSuccessMessage,
        multiFileSuccess: lang.UploadManyItemsSuccessMessage,
        oneFilePending: lang.UploadingSingleItem,
        oneFileFinalizing: lang.FinalizingSingleItem,
        multiFilePending: lang.UploadingItems,
        oneFileFailure: lang.UploadOneItemFailMessage,
        multiFileFailure: lang.UploadManyItemsFailMessage,
        someFileSuccess: lang.UploadSomeItemsSuccessMessage,
        someFilePending: lang.UploadingSomeItems,
        someFileFailure: lang.UploadSomeItemsFailMessage2,
        oneItemStopped: lang.UploadingOneItemStopped,
        allItemsStopped: lang.UploadingAllItemsStopped,
        someItemsStopped: lang.UploadSomeItemsStopped,
        locationLabelPending : lang.UploadingLocation,
        locationLabelCompleted: lang.UploadedLocation,
        enableCancel: true,
        isLoadTimeAvailable: false,
        stoppingLabel : lang.State_stopping
      });
      if (options.enableCancel) {
        this.panelStateValues = ["resolved", "rejected", "aborted", "processing"];
      }
      else {
        this.panelStateValues = ["resolved", "rejected", "aborted"];
      }



      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.CompositeView.prototype.constructor.call(this, options);

      if (options.context && options.nextNodeModelFactory) {
        this._nextNode = options.context.getModel(options.nextNodeModelFactory);
      }

      // Whenever properties of the model change, re-render the view
      this.listenTo(this.collection, 'change',  this._updateHeader);
      this.listenTo(this.collection, 'sort', this.setLocationName);
      this.originatingView = options.originatingView;
      if (!!this.originatingView) {
        this.originatingView.trigger('global.alert.inprogress');
      }
      this.isMultiContainer = isMultiContainer(this.collection.models);
      this.setLocationName();
    },

    onDestroy: function () {
      this.handleProgressComplete();
      this.focusChildIndex = -1;
      this.focusingOnList = false;
      this.currentFocusIndex = 0;
      this.trigger('tabable:not');
    },

    handleProgressComplete: function (allFailures) {
      this.originatingView && this.originatingView.trigger('global.alert.completed');
      this.parentView && this.parentView.trigger('processing:completed');
      if (!allFailures) {
        //For single set, Gotolocation element is shown on parent view
        this.ui.gotoLocationElem && this.ui.gotoLocationElem.removeClass('binf-hidden');
        //For multiple sets, Gotolocation elemnt is shown for each set seperatly on child view
        this.children.invoke('showGotoLocationElem');
      }
      this.children.invoke('handleProgressComplete');
      setTimeout(_.bind(function () {
         $(this.$el).trigger('focus');
      }, this), 10);
      
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '> .csui-items-wrapper',
        suppressScrollX: true
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    isProgressFailed: function () {
      return $.inArray(this.state, ['rejected']) !== -1;
    },

    isProgressCompleted: function () {
      return $.inArray(this.state, ['resolved', 'rejected', 'aborted', 'stopped', 'stopping']) !== -1;
    },

    isProgressFinalizing: function () {
      return $.inArray(this.state, ['stopping']) !== -1;
    },

    getLocalizedLocation: function(model) {
      var langForStatus = this.isProgressCompleted() ? this.options.locationLabelCompleted : this.options.locationLabelPending;
      return _.str.sformat(langForStatus, getContainerName(model));
    },

    setLocationName: function() {
      var bundleNumber, location, currentLocation,
      self = this;
      this.collection.forEach(function(model) {
        if (model.get('bundleNumber') === bundleNumber) {
          model.unset('location');
          model.unset('bundleDivider');
        } else {
          model.set({bundleDivider : true},{silent: true}); // Show seperation between every bundle
          bundleNumber = model.get('bundleNumber');
          currentLocation = getContainerName(model);
          if (currentLocation === location) {
            model.unset('location');
          } else {
            self.isMultiContainer && model.set({location : self.getLocalizedLocation(model)}, {silent: true}); //Location is shown only when upload is happening from multiple folder
            location = currentLocation;
          }
        }
      });
      this.collection.reset(this.collection.models);
    },

    updateProgressPanel: function (failedCount) {
      var notificationIcon, allFailures;      
      if (this.isProgressFailed()) {
        this.parentView && this.parentView.trigger('processing:error');
        notificationIcon = 'csui-global-error';
        allFailures = failedCount === this.collection.length;
      } else {
        notificationIcon = 'csui-global-success';
      }
      this.$el.addClass(notificationIcon);
      this.ui.processingAction.addClass('binf-hidden');
      this.ui.closeAction.parent('.csui-close').removeClass('binf-hidden');
      this.ui.header.find('.csui-minimize').addClass('binf-hidden');
      this.ui.header.find('.csui-progress').addClass('binf-hidden');
      this._isRendered && this.collection.sort();
      this.handleProgressComplete(allFailures);
      this.showretryAll();
      this.currentlyFocusedElement().trigger('focus');
    },

    showretryAll: function () {
      if (config.enableRetry && this.showretryAllElem) {
        this.ui.retryAll.removeClass('binf-hidden');
      }
    },

    showProgressBar: function (show) {
      // switch between progress bar / loading dots
      if(show) {
        this.ui.progressBar.removeClass('binf-hidden');
        this.ui.loadingDots.addClass('binf-hidden');
      } else {
        this.ui.progressBar.addClass('binf-hidden');
        this.ui.loadingDots.removeClass('binf-hidden');
      }
    },

    _updateHeader: function () {
      var info = this._computeProgress(),
      options = this.options;
      this.state = info.state;
      this.showProgressBar(info.isLoadTimeAvailable);
      // update title based on state
      switch (info.state) {
        case 'pending': 
        case 'processing':
          info.label = this._getFormatString(options.oneFilePending, options.multiFilePending, this.collection.length);
          break;
        case 'resolved':
          info.label = this._getFormatString(options.oneFileSuccess, options.multiFileSuccess, this.collection.length);
          break;
        case 'stopping':
          info.label = options.stoppingLabel;
          break;
        case 'stopped':
          info.label = this._getFormatString(options.oneItemStopped, options.someItemsStopped);
          break;
        case 'aborted':
          info.label = this._getFormatString(options.oneItemStopped, options.allItemsStopped, this.collection.length);
          break;
        case 'finalizing':
          info.label = this._getFormatString(options.oneFileFinalizing, options.multiFilePending, this.collection.length);
          break;
        default:
          info.label = this._getFormatString(options.oneFileFailure, options.multiFileFailure, info.failed);
      }
      if (info.dynamic === undefined ? info.state === "processing" : info.dynamic) {
        if (info.state === "processing") {
         this.$el.attr('aria-label', _.str.sformat("{0} {1}%", info.label, info.percentage));
        } else {
          this.$el.attr('aria-label', info.label);
        }
      } else {
        var stateAriaLabel = _.str.sformat("{0} {1}", info.label,
        lang["State_" + info.state]);
        this.$el.attr('aria-label', stateAriaLabel);
      }
      this.ui.header.find(".csui-title").text(info.label);
      !this.isProgressFinalizing() && this.isProgressCompleted() && this.updateProgressPanel(info.failed); // Apply styles for progressPanel progress completion
      updateProgressArea.call(this, this.ui.header, info);
      
      if(this.collection.length === 1 && info.state === "rejected") {
        this.ui.expandIcon.removeClass('binf-hidden');
      } else {
        this.$el.find(".csui-items-wrapper .csui-names-progress").removeClass('binf-hidden');
      }
    
      if (!this.options.allowMultipleInstances) {
        this.ui.minimizeButton.parent(".csui-minimize").addClass('binf-hidden');
      } else {
        if(this.parentView) {
          this.parentView.trigger('processbar:update', info.percentage);
        }
        if (info.state === 'processing') {
          this.ui.minimizeButton.parent(".csui-minimize").removeClass('binf-hidden');
        }
      }
      
      // update collapse/expand
      if (!this.stateExpandCollapse) {
        // only on initial rendering collapse/expand and take state from template
        var arrow = this.ui.header.find(".csui-expand").find(":not(.binf-hidden)");
        if (arrow.hasClass("csui-expand-up")) {
          this.doExpand(false);
        } else if (arrow.hasClass("csui-expand-down")) {
          this.doCollapse(false);
        }
      }

      // and for better layout possibilities, mark empty panel
      var isempty = !this.collection || this.collection.length === 0;
      if (this.$el.hasClass("csui-empty")) {
        if (!isempty) {
          this.$el.removeClass("csui-empty");
        }
      } else {
        if (isempty) {
          this.$el.addClass("csui-empty");
        }
      }
    },

    _getFormatString: function (str1, str2, count) {
      var formattedString, fileName;
      if (this.collection.length === 1) {
        fileName = this.collection.models[0].get('newName') || this.collection.models[0].get('name');
        formattedString = _.str.sformat(str1, fileName);
      } else {
        formattedString = _.str.sformat(str2, count);
      }
      return formattedString;
    },

    _computeProgress: function () {
      var allDone    = true,
          processing = false,
          allAborted = true,
          stopped    = false,
          finalizing = false,
          failed     = 0,
          aborted    = 0,
          count      = 0,
          total      = 0;
      var self = this;
      this.collection.forEach(function (item) {
        count += item.get('count');
        total += item.get('total');
        
        if (item.get("state") === "stopped") {
          stopped = true;
        }
        if (item.get("state") === "aborted") {
          ++aborted;
        }
        if (item.get("state") === "processing") {
          self.loadingCount += item.get('count');
        }
        if (item.get("state") === "pending" || item.get("state") === "processing" || item.get("state") === "finalizing") {
          allDone = false;
        }
        if (item.get("state") !== "pending") {
          processing = true;
        }
        if (item.get("state") === "rejected") {
          ++failed;
          item.set({sequence : 2}, {silent: true});
          self.showretryAllElem = !!item.get('serverFailure'); 
        }
        if (item.get("state") === "resolved" || item.get("state") === "rejected") {
          allAborted = false;
        }
      });
      
      var percentage = (total > 0) ? Math.floor(count / total * 100) : 0;
      // 100% will be reached, when the file gets uploaded, but then
      // the server will start saving the document.  Do not show the
      // end-user 100%, when they still need to wait.
      if (percentage === 100 && !allDone) {
        percentage = 99;
        finalizing = true;
      }
      var state   = allDone ? failed ? "rejected" : stopped || aborted ? allAborted ? "aborted" : "stopped" : "resolved" :
                    stopped ? "stopping" : finalizing ? "finalizing" : processing ? "processing" : "pending",
          dynamic = state !== "pending";
      return {
        count: count,
        total: total,
        failed: failed,
        percentage: percentage,
        state: state,
        dynamic: dynamic,
        isLoadTimeAvailable : this.loadingCount > 0
      };
    },

    // Outermost parent element should contain a unique widget-specific class
    className: 'csui-progresspanel',

    childView: ProgressBarView,
    childViewContainer: ".csui-items",
    childEvents: {
      'click:gotolocation': 'navigateToLocation',
      'keydown:item': 'onChildViewKeydown'
    },
    childViewOptions: function () {
      return _.extend(this.options, {
        enableCancel: this.options.enableCancel,
        messageHelper: this.options.messageHelper,
        reorderOnSort : true,
        parentView: this
      });
    },

    // Template method rendering the HTML for the view
    template: panelTemplate,

    templateHelpers: function () {
      var targetLocation, 
      targetLocationUrl,
      info = this._computeProgress(),
      singleItem = this.collection.length === 1;
      if (!this.options.hideGotoLocationSingleSet && !this.isMultiContainer) {
        targetLocation = this.collection.models[0].get('targetLocation');
        targetLocationUrl = targetLocation && targetLocation.url;
      }
      BarStateValues.forEach(function (value) {
        info["state_" + value] = lang["State_" + value];
      });
      this.panelStateValues.forEach(function (value) {
        info["stateaction_" + value] = lang["StateAction_" + value];
        info["stateaction_all_" + value] = lang["StateAction_all_" + value];
      });
      info.cancel = lang.Cancel;
      info.enableCancel = this.options.enableCancel,
      info.expand = lang.Expand;
      info.collapse = lang.Collapse;
      info.close = lang.Close;
      info.closeAria = lang.CloseAria;
      info.processing = (info.state === "processing") ? true : false;
      info.progressTitleId = _.uniqueId("progressTitle");
      info.singleItem = singleItem;
      info.enableMinimiseButton = this.options.enableMinimiseButton;
      info.minimize = lang.minimize;
      info.minimizeAria = lang.minimizeAria;
      info.gotoLocation = lang.GotoLocationLinkLabel;
      info.retryAll = lang.RetryAll;
      info.enableRetry = config.enableRetry;
      return _.extend(info, {
        targetLocationUrl: targetLocationUrl
      });
    },

    onRender: function () {
      this.$el.attr('tabindex','0');
      this.$el.attr('role', 'dialog');
      this.currentlyFocusedElement();
      this._updateHeader();
      this.collection.comparator = function (currentModel , nextModel) {
        if(currentModel.get('bundleNumber') === nextModel.get('bundleNumber')) {
          return nextModel.get('sequence') - currentModel.get('sequence');
        }
      };
    },

    ui: {
      header: '.csui-header',
      progressBar : '.csui-header .binf-progress',
      loadingDots : '.csui-header .loading-dots',
      pendingAction: '.csui-header .csui-stateaction-pending',
      processingAction: '.csui-header .csui-stateaction-processing',
      closeAction: '.csui-header .csui-close button',
      collapseAction: '.csui-header .csui-expand-up',
      expandAction: '.csui-header .csui-expand-down',
      minimizeButton: '.csui-header .csui-minimize .icon-progresspanel-minimize',
      expandIcon: '.csui-header .csui-expand',
      gotoLocationElem : '.csui-gotolocation-url',
      retryAll: '.csui-show-retryAll',
      childContainer: '.csui-items'
    },

    events: {
      'click @ui.pendingAction': 'doCancel',
      'click @ui.processingAction': 'doCancel',
      'click @ui.closeAction': 'doClose',
      'keydown @ui.closeAction': 'handleKeydownOnClose',
      'click @ui.collapseAction': 'doCollapse',
      'click @ui.expandAction': 'doExpand',
      'keydown @ui.expandAction': 'handleKeydownOnExpand',
      'click @ui.minimizeButton': '_doProcessbarMinimize',
      'keydown @ui.minimizeButton': 'onKeyInViewMinimize',  
      'click @ui.gotoLocationElem': 'handleGotoLocationClick',
      'keydown @ui.gotoLocationElem': 'handleGotoLocationClick',
      'click @ui.retryAll': 'processRetryAll',
      'keydown @ui.retryAll': 'processRetryAll',
      'keydown': 'onKeyInParentView'
    },

    doCancel: function () {
      //Set state to 'stopped' when aborted progress using stop button
      this.collection.abort('stopped');
      this.ui.processingAction.addClass('binf-hidden');
    },

    doCollapse: function (animated) {
      this.$el.removeClass('csui-expanded');
      animated = (animated === false) ? false : true;
      var items = this.$el.find(".csui-items");
      items.find('.focused-row').removeClass('focused-row');
      this.options.messageHelper.switchField(this.$el.find(".csui-header"),
        ".csui-expand", "down",
        ["up", "down"]);
      this.options.messageHelper.collapsePanel(this, items, items, animated);
      this.stateExpandCollapse = "collapsed";
      this.$el.find('.csui-expand-down').trigger('focus');
      this.focusChildIndex = -1;
      this.focusingOnList = false;
    },

    doExpand: function (animated) {
      var items = this.$el.find(".csui-items"),
        event = animated,
        self = this;
      animated = (animated === false) ? false : true;
      this.options.messageHelper.switchField(this.$el.find(".csui-header"),
        ".csui-expand", "up",
        ["up", "down"]);
      this.options.messageHelper.expandPanel(this, items, items, animated);
      this.stateExpandCollapse = "expanded";
      this.$el.one(this.options.messageHelper.transitionEnd(), function () {
        // TODO: DOM refresh will remove focusable of progress element by setting tabindex -1
        // self.trigger('dom:refresh');
        // event to ensure perfect scrollbar after 'dom:refresh' event is commented out above
        self.trigger('ensure:scrollbar');
        self.$el.addClass('csui-expanded');
      });
      if (event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) {
        items.find('.focused-row').removeClass('focused-row');
        setTimeout(function() {
          self.children.findByIndex(0).setFocus();
        });
        this.focusChildIndex = 0;
        this.focusingOnList = true;
      } else {
        this.ui.collapseAction.trigger('focus');
      }
    },

    handleKeydownOnExpand: function (event) {
      if(event.type === "keydown" && (event.keyCode === 13 || event.keyCode === 32)) {
        this.doExpand(event);
      }
    },

    handleKeydownOnCollapse: function (event) {
      if(event.type === "keydown" && (event.keyCode === 13 || event.keyCode === 32)) {
        this.doCollapse(event);
      }
    },

    onKeyInViewMinimize: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        // enter key(13) or space(32)
        this._doProcessbarMinimize();
      }
    },

    onKeyInParentView: function(event) {
      var focusChanged = false;
      switch(event.keyCode) {
        case 9: // TAB
        var allFocusableElements = this._getAllFocusableElements(),
        activeElement = this.currentlyFocusedElem.length > 0 ? this.currentlyFocusedElem : document.activeElement;
        if(activeElement === allFocusableElements[0][0]) {
          this.currentFocusIndex = 0;
        }
        if (this.ui.childContainer.has(event.target).length) {
          if (event.shiftKey) {
            this.currentFocusIndex = allFocusableElements.length - 1;
            this.focusingOnList = false;
            focusChanged = true;
          }
        } else {
          var nextFocus = this.currentFocusIndex;
          if (event.shiftKey) {
            nextFocus -- ;
          } else {
            nextFocus ++ ;
          }
          if (nextFocus >= 0 && nextFocus < allFocusableElements.length) {
            this.currentFocusIndex = nextFocus;
            focusChanged = true;
          } else if (nextFocus === allFocusableElements.length && this.focusChildIndex >= 0) {
            focusChanged = true;
            this.focusingOnList = true;
          }
        }
        break;
      }

      if (focusChanged) {
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement();
        $(this.currentlyFocusedElem).trigger('focus');
        this.$el.find('.focused-row') && this.$el.find('.focused-row').removeClass('focused-row');
        return false;
      }
    },

    onChildViewKeydown: function (childview, event) {
      var nextFocusIndex = this.focusChildIndex;
      switch (event.keyCode) {
        case 40: //arrow down
        nextFocusIndex < (this.children.length - 1) && ++nextFocusIndex;
          break;
        case 38: //arrow up
          nextFocusIndex > 0 && --nextFocusIndex;          
          break;
      }
      if (nextFocusIndex < 0 || nextFocusIndex >= this.children.length) {
        return;
      }
      if (this.focusChildIndex >= 0 ){
        this.children.findByIndex(this.focusChildIndex).removeFocus();
      }
      this.focusChildIndex = nextFocusIndex;
      this.children.findByIndex(this.focusChildIndex).setFocus();
      this.trigger('changed:focus', this);
      return false;
    },

    _doProcessbarMinimize: function () {
      this.$el.addClass('binf-hidden');
      this.parentView.trigger('processbar:minimize');
    },

    doShow: function (relatedView, parentView) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
      this.parentView = parentView;
      this.parentView.trigger('processbar:finished');
      this.listenTo(this.parentView, 'processbar:maximize', function () {
        if (!this.isDestroyed) {
          this.$el.removeClass('binf-hidden');
          this.ui.minimizeButton.trigger("focus");
        }
      });
      this.doResize();
      this.$el.trigger('globalmessage.shown', this);
      this.trigger('dom:refresh');
      this.$el.trigger('focus');
    },

    currentlyFocusedElement: function () {
        if(this.isDestroyed){
          return $();
        }
        if (this.focusingOnList && this.focusChildIndex >= 0) {
          this.currentlyFocusedElem = this.children.findByIndex(this.focusChildIndex).setFocus();
        } else  {
          var allFocusableElements = this._getAllFocusableElements();
          this.currentlyFocusedElem = $(allFocusableElements[this.currentFocusIndex]);
        } 
        return this.currentlyFocusedElem;
      },

    _getAllFocusableElements: function() {
      var allFocusableElements = this.ui.header.find("*[tabindex]:visible").toArray();
       allFocusableElements.unshift(this.$el);
       return allFocusableElements;
    },

    doClose: function () {
      var self = this, panel = _.extend({
        csuiAfterHide: function () {
          self.destroy();
          // Set focus back to origin view only when progress failed.
          // Otherwise, Success message will be showing and it will take care of preserving focus.
          if (self.isProgressFailed()) {
            // Set focus back to Origin element which trigger the alert
            self.trigger('escaped:focus');
          }
          this.parentView.trigger('processbar:finished');
        }
      }, this);
      this.options.messageHelper.fadeoutPanel(panel);
    },

    handleKeydownOnClose: function () {
      if(event.type === "keydown" && (event.keyCode === 13 || event.keyCode === 32)) {
        this.doClose(event);
      }
    },

    doResize: function () {
      if (this.options.sizeToParentContainer) {
        var minWidth = parseInt(this.$el.css('min-width'), 10);
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        this.uncompressedMinWidth || (this.uncompressedMinWidth = minWidth);
        if (this.uncompressedMinWidth > parentWidth) {
          this.$el.addClass('compressed');
        }
        else {
          this.$el.removeClass('compressed');
        }
        var newWidth = this.$el.width();
        var translateX = (parentWidth - newWidth) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    },

    handleGotoLocationClick: function(event) {
      if ((event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) || (event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();
        this.navigateToLocation();
      }
    },

    navigateToLocation: function (chidlView) {
      var model = chidlView ? chidlView.model : this.collection.models[0];
      var targetLocation = model.get('targetLocation');
      if (targetLocation && this._nextNode) {
        this._nextNode.set('id', targetLocation.id);
      }
      this.doCollapse();
    },
    processRetryAll: function (event) {
      if ((event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) || (event.type === 'click')) {
        this.trigger('retry:all');
      }
    }
  });
  return ProgressPanelView;

});

// Lists explicit locale mappings and fallbacks

csui.define('csui/controls/globalmessage/impl/nls/globalmessage.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/globalmessage/impl/nls/root/globalmessage.lang',{
  FewerDetails: "Fewer details",
  MoreDetails: "More details...",
  GotoLocationLinkLabel: "Go to location",
  CloseDialog: "Close",
  closeDialogAria: "Close message dialog"
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/globalmessage/impl/messagedialog',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-message-link-div\">\r\n    <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.link_url || (depth0 != null ? depth0.link_url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"link_url","hash":{}}) : helper)))
    + "\" class=\"csui-message-link\">"
    + this.escapeExpression(((helper = (helper = helpers.link_label || (depth0 != null ? depth0.link_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"link_label","hash":{}}) : helper)))
    + "</a>\r\n  </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-details-wrapper\">\r\n  <div id=\"csui-message-details\" class=\"csui-details csui-minheight\">\r\n    <div class=\"csui-text binf-hidden\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.detailsId || (depth0 != null ? depth0.detailsId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"detailsId","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.details_text || (depth0 != null ? depth0.details_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"details_text","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"csui-action csui-message-details-heightsource\">\r\n      <a href=\"javascript:void(0);\" class=\"csui-action-moredetails\">"
    + this.escapeExpression(((helper = (helper = helpers.action_moredetails || (depth0 != null ? depth0.action_moredetails : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"action_moredetails","hash":{}}) : helper)))
    + "</a>\r\n      <a href=\"javascript:void(0);\" class=\"csui-action-fewerdetails binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.action_fewerdetails || (depth0 != null ? depth0.action_fewerdetails : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"action_fewerdetails","hash":{}}) : helper)))
    + "</a>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-header csui-height-target\">\r\n    <div class=\"csui-state\">\r\n        <span class=\"csui-state-icon csui-icon\"></span>\r\n    </div>\r\n    <div class=\"csui-text\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.headerId || (depth0 != null ? depth0.headerId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerId","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.header_text || (depth0 != null ? depth0.header_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"header_text","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.header_text || (depth0 != null ? depth0.header_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"header_text","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"csui-action\">\r\n        <button type=\"button\" class=\"csui-action-close binf-btn binf-btn-default csui-icon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.closeDialog || (depth0 != null ? depth0.closeDialog : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeDialog","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeDialogAria || (depth0 != null ? depth0.closeDialogAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeDialogAria","hash":{}}) : helper)))
    + "\"/>\r\n    </div>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message_with_link : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.details_text : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_globalmessage_impl_messagedialog', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/globalmessage/impl/messagedialog',[],function(){});
csui.define('csui/controls/globalmessage/impl/messagedialog.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'i18n',
  'i18n!csui/controls/globalmessage/impl/nls/globalmessage.lang',
  'hbs!csui/controls/globalmessage/impl/messagedialog',
  'css!csui/controls/globalmessage/impl/messagedialog',
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (_, $, Marionette, i18n, lang, template, css) {
  'use strict';

  var messageClassMap = {
    info: "csui-info",
    success: "csui-success",
    success_with_link: "csui-success-with-link",
    warning: "csui-warning",
    error: "csui-error",
    processing: "csui-processing",
    none: "csui-none"
  };

  var stateIconClassMap = {
    info: "csui-icon-notification-information-white",
    success: "csui-icon-notification-success-white",
    success_with_link: "csui-icon-notification-success-white",
    warning: "csui-icon-notification-warning-white",
    error: "csui-icon-notification-error-white",
    processing: null,
    none: null
  };

  var closeIconClassMap = {
    info: "csui-icon-dismiss-white",
    success: "csui-icon-dismiss-white",
    success_with_link: "csui-icon-dismiss-white",
    warning: "csui-icon-dismiss-white",
    error: "csui-icon-dismiss-white",
    processing: null,
    none: "csui-icon-dismiss"
  };

  var className = "csui-messagepanel";

  var View = Marionette.ItemView.extend({

    constructor: function MessageDialog(options) {
      this.css = css;
      options.info || (options.info = "info");
      this.className = className + " " + messageClassMap[options.info];

      if (options.context && options.nextNodeModelFactory) {
        this._nextNode = options.context.getModel(options.nextNodeModelFactory);
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    className: className + " " + messageClassMap["info"],
    template: template,

    ui: {
      closeAction: '.csui-header .csui-action-close',
      collapseAction: '.csui-details .csui-action-fewerdetails',
      expandAction: '.csui-details .csui-action-moredetails',
      stateIcon: '.csui-state-icon',
      closeIcon: '.csui-action-close',
      messageLink: '.csui-message-link'
    },

    events: {
      'click @ui.closeAction': 'doClose',
      'click @ui.collapseAction': 'doCollapse',
      'click @ui.expandAction': 'doExpand',
      'click @ui.messageLink': 'onClickLink',
      'focusout @ui.closeIcon': 'replaceDummyBackImg'
    },

    doResize: function () {
      var header = this.$el.find(".csui-header");
      var details = this.$el.find(".csui-details");
      details.width(header.width());
      if (this.options.sizeToParentContainer) {
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        var translateX = (parentWidth - width) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    },

    doCollapse: function (animated) {
      this._clearTimeout();
      animated = (animated === false) ? false : true;
      var details = this.$el.find(".csui-details");
      var detailsText = details.find(".csui-text");
      this.options.messageHelper.switchField(details, ".csui-action", "moredetails",
          ["moredetails", "fewerdetails"]);
      var panel = _.extend({csuiAfterHide: function () { details.css("width", ""); }},
          this);
      this.options.messageHelper.collapsePanel(panel, details, detailsText, animated);
      this.stateExpandCollapse = "collapsed";
    },

    doExpand: function (animated) {
      this._clearTimeout();
      animated = (animated === false) ? false : true;
      var details = this.$el.find(".csui-details");
      var detailsText = details.find(".csui-text");
      this.options.messageHelper.switchField(details, ".csui-action", "fewerdetails",
          ["moredetails", "fewerdetails"]);
      details.css("width", this.$el.find(".csui-header").width());
      this.options.messageHelper.expandPanel(this, details, detailsText, animated);
      this.stateExpandCollapse = "expanded";
    },

    doShow: function (relatedView, parentView) {
      var existingDialogs = parentView.$el.find('.csui-global-message.position-show');
      if (existingDialogs.length) {
        var latestDialog        = existingDialogs.last().find('.csui-header'),
            existingDialogCount = existingDialogs.length,
            currentDialogHeader = this.$el.find('.csui-header');
        currentDialogHeader.css({
          'top': 4 * existingDialogCount + 'px',
          'margin': '0 ' + (-8 * existingDialogCount) + 'px'
        });
        var currentDialogDetailsWrapper = this.$el.find('.csui-details-wrapper');
        if (currentDialogDetailsWrapper.length) {
          currentDialogDetailsWrapper.css({
            'margin-right': (-8 * existingDialogCount) + (-5) + 'px',
            'margin-left': (-8 * existingDialogCount) + (-5) + 'px'
          });
        }
      }
      if (this.options.info === "success") {
        var self = this;
        var panel = _.extend({
          csuiAfterShow: function () {
            self.doResize();
            self._setTimeout();
          }
        }, this);
        this.options.messageHelper.showPanel(panel, relatedView, parentView);
      } else {
        this.options.messageHelper.showPanel(this, relatedView, parentView);
      }
      this.doResize();

      // Fire message show to make this message dialog tabbale
      this.$el.trigger('globalmessage.shown', this);
      this.$el.find('.csui-action-close').trigger('focus');
    },

    doClose: function () {
      this._clearTimeout();
      var self = this, panel = _.extend({
        csuiAfterHide: function () {
          self.destroy();
          // Set focus back to Origin element which trigger the alert
          self.trigger('escaped:focus');
        }
      }, this);
      this.options.messageHelper.fadeoutPanel(panel);
    },

    _setTimeout: function () {
      var self = this;
      if (!this.options.enablePermanentHeaderMessages) {
        // at least the fixed timeout can be deactivated, to comply with BITV 2.2.1a, configurable time limits
        this.options.timeout = window.setTimeout(function () {
          self.doClose();
        }, 5000);
      }
    },

    _clearTimeout: function () {
      if (this.options.timeout) {
        window.clearTimeout(this.options.timeout);
        this.options.timeout = undefined;
      }
    },

    headerId: undefined,
    detailsId: undefined,

    templateHelpers: function () {
      var closeAria = lang.closeDialogAria;
      if (!this.headerId) {
        this.headerId = _.uniqueId('header');
      }
      if (!this.detailsId) {
        this.detailsId = this.options.details ? _.uniqueId('details') : undefined;
      }

      var info = {
        header_text: this.options.message,
        headerId: this.headerId,
        details_text: this.options.details,
        detailsId: this.detailsId,
        action_moredetails: lang.MoreDetails,
        action_fewerdetails: lang.FewerDetails,
        closeDialog: lang.CloseDialog,
        closeDialogAria: closeAria
      };

      if (this.options.link_url && this.options.targetFolder) {
        info = _.extend(info, {
          message_with_link: true,
          link_label: lang.GotoLocationLinkLabel,
          link_url: this.options.link_url
        });
      }

      return info;
    },

    onClickLink: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.doClose();
      if (this.options.targetFolder && this._nextNode) {
        this._nextNode.set('id', this.options.targetFolder.get('id'));
      }
    },

    onRender: function () {
      // Set proper role and related fields
      this.$el.attr('role', 'alertdialog');
      this.$el.attr('aria-labelledby', this.headerId);
      if (this.detailsId) {
        this.$el.attr('aria-describedby', this.detailsId);
      }

      // Apply the right state icon
      var stateClass = stateIconClassMap[this.options.info];
      if (stateClass) {
        this.ui.stateIcon.addClass(stateClass);
      } else {
        this.$el.addClass('csui-no-icon');
      }

      // Apply the right close icon
      var closeClass = closeIconClassMap[this.options.info];
      if (closeClass) {
        this.ui.closeIcon.addClass(closeClass);
      }

      // Update collapse/expand
      if (!this.stateExpandCollapse) {
        // only on initial rendering collapse/expand and take state from template
        var arrow = this.$el.find(".csui-details .csui-action").find(
            ":not(.binf-hidden)");
        if (arrow.hasClass("csui-action-fewerdetails")) {
          this.doExpand(false);
        } else if (arrow.hasClass("csui-action-moredetails")) {
          this.doCollapse(false);
        }
      }
    },

    replaceDummyBackImg: function(){
      this.ui.closeIcon.addClass('csui-action-close-replace-dummy');
    }

  });

  return View;

});

csui.define('csui/controls/globalmessage/impl/custom.wrapper.view',[
  'csui/lib/backbone', 'csui/lib/marionette',
  'css!csui/controls/globalmessage/impl/messagedialog',
], function (Backbone, Marionette) {
  'use strict';

  var CustomWrapperView = Marionette.ItemView.extend({

    constructor: function CustomWrapperView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);

      var contentView = this.getOption('contentView');
      if (!(contentView instanceof Backbone.View)) {
        contentView = contentView.call(this);
      }
      this.view = contentView;

      this.listenTo(contentView, 'destroy', this.destroy);
      this.region = new Marionette.Region({el: this.el});
    },

    className: 'csui-messagepanel',

    template: false,

    onRender: function () {
      this.region.show(this.view);
    },

    onDestroy: function () {
      this.region.empty();
    },

    doShow: function (relatedView, parentView) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
    }

  });

  return CustomWrapperView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/globalmessage/impl/loaderpanel/impl/loaderpanel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-loaderpanel\">\r\n  <div class=\"binf-row\">\r\n    <div class=\"binf-col-sm-6\" id=\"csui-zipanddownload-stage\">\r\n      "
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\r\n    </div>\r\n    <div class=\"binf-col-sm-4\">\r\n      <div class=\"csui-loaderpanel-inner\"></div>\r\n    </div>\r\n    <div class=\"binf-col-sm-2 bin-pull-right\">\r\n      <a class=\"binf-pull-right csui-loader-cancel\">Cancel</a>\r\n    </div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_controls_globalmessage_impl_loaderpanel_impl_loaderpanel', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/globalmessage/impl/loaderpanel/impl/loaderpanel',[],function(){});
csui.define('csui/controls/globalmessage/impl/loaderpanel/loaderpanel.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette', 'i18n',
  'hbs!csui/controls/globalmessage/impl/loaderpanel/impl/loaderpanel',
  'css!csui/controls/globalmessage/impl/loaderpanel/impl/loaderpanel'
], function (_, $, Backbone, Marionette, i18n, template) {
  var LoaderPanelView = Marionette.ItemView.extend({
    template: template,
    templateHelpers: function () {
      return {label: this.options.label};
    },

    ui: {
      cancel: '.csui-loader-cancel'
    },  

    events: {
      'click @ui.cancel': 'cancelAndHide'
    },

    constructor: function LoaderPanelView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    cancelAndHide: function(event) {
      // view will be destroyed in xhr.always callback of globalmessage's showLoader
      if (this.options.xhr && this.options.xhr.abort) {
        this.options.xhr.abort();   
      }      
      this.destroy(false);
    },

    doShow: function (relatedView, parentView, xhr) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
      this.doResize();
      this.$el.trigger('globalmessage.shown', this);
      // Set focus to close button if visible. Otherwise, first focusable element
      this.ui.cancel.trigger('focus');
      this.updateXHRReference(xhr);
    },

    updateXHRReference: function(xhr) {
      if (xhr) {        
        this.options.xhr && this.options.xhr.abort();
        this.options.xhr = xhr;
      }
    },

    doResize: function () {
      if (this.options.sizeToParentContainer) {
        var minWidth = parseInt(this.$el.css('min-width'), 10);
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        this.uncompressedMinWidth || (this.uncompressedMinWidth = minWidth);
        if (this.uncompressedMinWidth > parentWidth) {
          this.$el.addClass('compressed');
        }
        else {
          this.$el.removeClass('compressed');
        }
        var newWidth = this.$el.width();
        var translateX = (parentWidth - newWidth) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    }
  });
  return LoaderPanelView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/dialogs/modal.alert/impl/modal.alert',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  class=\"binf-modal-dialog binf-modal-"
    + this.escapeExpression(((helper = (helper = helpers.dialogSize || (depth0 != null ? depth0.dialogSize : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dialogSize","hash":{}}) : helper)))
    + "\"\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  class=\"binf-modal-dialog\"\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "       aria-labelledby=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgTitleId || (depth0 != null ? depth0.dlgTitleId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgTitleId","hash":{}}) : helper)))
    + "\"\r\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "       aria-describedby=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgMsgId || (depth0 != null ? depth0.dlgMsgId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgMsgId","hash":{}}) : helper)))
    + "\"\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <div class=\"binf-modal-header "
    + this.escapeExpression(((helper = (helper = helpers.headerClass || (depth0 != null ? depth0.headerClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerClass","hash":{}}) : helper)))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showTitleCloseButton : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <h4 class=\"binf-modal-title\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showTitleIcon : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          <span class=\"title-text\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgTitleId || (depth0 != null ? depth0.dlgTitleId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgTitleId","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n        </h4>\r\n      </div>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "          <button type=\"button\" class=\"binf-close\" data-binf-dismiss=\"modal\"\r\n                  aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeButtonAria || (depth0 != null ? depth0.closeButtonAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeButtonAria","hash":{}}) : helper)))
    + "\" tabindex=\"0\">\r\n            <span class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.titleCloseIcon || (depth0 != null ? depth0.titleCloseIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleCloseIcon","hash":{}}) : helper)))
    + "\"></span>\r\n          </button>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var helper;

  return "            <span class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.titleIcon || (depth0 != null ? depth0.titleIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleIcon","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"binf-modal-body\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgMsgId || (depth0 != null ? depth0.dlgMsgId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgMsgId","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</div>\r\n";
},"16":function(depth0,helpers,partials,data) {
    return "    <div class=\"binf-modal-footer\">\r\n";
},"18":function(depth0,helpers,partials,data) {
    return "    <div class=\"binf-modal-footer csui-no-body\">\r\n";
},"20":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button type=\"button\" class=\"binf-btn binf-btn-primary csui-yes csui-default\" tabindex=\"0\"\r\n              data-binf-dismiss=\"modal\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelYes : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelYes : stack1), depth0))
    + "</button>\r\n";
},"22":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button type=\"button\" class=\"binf-btn binf-btn-default csui-no\" tabindex=\"0\"\r\n              data-binf-dismiss=\"modal\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelNo : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelNo : stack1), depth0))
    + "</button>\r\n";
},"24":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button class=\"binf-btn binf-btn-default csui-cancel\" tabindex=\"0\"\r\n              data-binf-dismiss=\"modal\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelCancel : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelCancel : stack1), depth0))
    + "</button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div role=\"alertdialog\"\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.dialogSize : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showHeader : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ">\r\n  <div class=\"binf-modal-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showHeader : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.program(18, data, 0)})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.showYes : stack1),{"name":"if","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.showNo : stack1),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.showCancel : stack1),{"name":"if","hash":{},"fn":this.program(24, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n  </div>\r\n  </div>\r\n\r\n";
}});
Handlebars.registerPartial('csui_dialogs_modal.alert_impl_modal.alert', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/dialogs/modal.alert/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/dialogs/modal.alert/impl/nls/root/lang',{
  YesButtonLabel: "Yes",
  NoButtonLabel: "No",
  OkButtonLabel: "OK",
  CancelButtonLabel: "Cancel",
  CloseButtonLabel: "Close",
  CloseButtonAria: "Close dialog",
  DefaultWarningTitle: "Warning",
  DefaultInfoTitle: "Information",
  DefaultErrorTitle: "Error",
  DefaultSuccessTitle: "Success",
  DefaultMessageTitle: "Message",
  DefaultQuestionTitle: "Question"
});


csui.define('csui/behaviors/keyboard.navigation/tabkey.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/log',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabables.behavior'
], function (module, _, $,
    log,
    Marionette,
    TabablesBehavior) {
  'use strict';

  // FIXME: deprecated - Remove this behavior class.
  // FIXME: deprecated - Remove this behavior class.
  // FIXME: deprecated - Remove this behavior class.

  var TabKeyBehavior = TabablesBehavior.extend({

        constructor: function TabKeyBehavior(options, view) {
          TabablesBehavior.prototype.constructor.apply(this, arguments);

        },
    
        _clearTabIndexes: function (view) {
          log.debug('_clearTabIndexes of TabKeyBehavior for view ' + view.constructor.name) &&
          console.log(log.last);
        }

      },
      {}
  );

  return TabKeyBehavior;
});


csui.define('css!csui/dialogs/modal.alert/impl/modal.alert',[],function(){});
csui.define('csui/dialogs/modal.alert/modal.alert',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'hbs!csui/dialogs/modal.alert/impl/modal.alert',
  'i18n!csui/dialogs/modal.alert/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabkey.behavior',
  'csui/lib/binf/js/binf',
  'css!csui/dialogs/modal.alert/impl/modal.alert',
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (module, _, $, Marionette, log, base, template, lang, TabKeyBehavior) {

  log = log(module.id);

  var ModalAlertView = Marionette.ItemView.extend({

    className: function () {
      var className = 'csui-alert cs-dialog binf-modal binf-fade';
      if (this.options.modalClass) {
        className += ' ' + this.options.modalClass;
      }
      return className;
    },

    template: template,

    ui: {
      defaultButton: '.binf-modal-footer > .csui-default'
    },

    triggers: {
      'click .csui-yes': 'click:yes',
      'click .csui-no': 'click:no'
    },

    events: {
      'shown.binf.modal': 'onShown',
      'hide.binf.modal': 'onHiding',
      'hidden.binf.modal': 'onHidden',
      'keydown': 'onKeyDown'
    },
    behaviors: {
      TabKeyBehavior: {
        behaviorClass: TabKeyBehavior,
        recursiveNavigation: true
      }
    },

    constructor: function ModalAlertView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      options = this.options;
      // Make keys like 'labelYes' from 'Yes' to be able to merge them into options.buttons
      var buttonLabels = _.reduce(ModalAlertView.buttonLabels, function (result, value, key) {
        result['label' + key] = value;
        return result;
      }, {});
      // Show just the close button if no buttons were specified; ensure all button labels
      options.buttons = _.defaults({}, _.isEmpty(options.buttons) ?
                                       ModalAlertView.buttons.Close :
                                       options.buttons, buttonLabels);
      // Show an information alert if no styling was specified
      _.defaults(options, ModalAlertView.defaultOptions.Information, {
        // Center vertically by default
        centerVertically: true,
        // If an empty title was provided, turn off the dialog header
        showHeader: options.title !== ''
      });
      this._deferred = $.Deferred();
    },

    templateHelpers: function () {
      var templateVals = _(this.options).clone();
      templateVals.dlgTitleId = _.uniqueId('dlgTitle'); //
      templateVals.dlgMsgId = _.uniqueId('dlgMsg');
      return templateVals;
    },

    show: function () {
      this.render();
      this.$el.attr('tabindex', 0);
      if (this.options.centerVertically) {
        this.centerVertically();
      }
      this.$el.binf_modal('show');
      this.triggerMethod('show');
      var promise = this._deferred.promise(),
          self    = this;
      // TODO: Added only for testing purposes.  How to make modal alert
      // testable without this on the public interface?
      promise.close = function () {
        self.$el.binf_modal('hide');
        return promise;
      };
      return promise;
    },

    centerVertically: function () {
      var $clone;
      var top;

      // add clone of modalAlert to document
      $clone = this.$el.clone();
      $clone.css('display', 'block');
      $clone.appendTo($.fn.binf_modal.getDefaultContainer());

      // calculate top of centered position
      top = Math.round(($clone.height() - $clone.find('.binf-modal-content').height()) / 2);
      top = top > 0 ? top : 0;

      $clone.remove();

      // set top of modalAlert
      this.$el.find('.binf-modal-content').css("margin-top", top);
    },

    onShown: function () {
      this._deferred.notify({state: 'shown'});
      this._setTabFocus(false);
    },

    onHiding: function () {
      this._deferred.notify({state: 'hiding'});
    },

    onHidden: function (event) {
      this.destroy();
      // Trigger callbacks and promises when the hiding animation ended
      if (this.options.callback) {
        this.options.callback(this._result);
      }
      if (this._result) {
        this._deferred.resolve(this._result);
      } else {
        this._deferred.reject(this._result);
      }
    },

    onKeyDown: function (event) {
      var keyCode = event.keyCode;
      switch (keyCode) {
      case 13:
        // Click the default button by Enter if no sub-control is focused
        if (event.target === this.el) {
          this.ui.defaultButton.trigger('click');
        }
        else {
          $(event.target).trigger('click');
        }
        break;
          //Tab
      case 9:
        return this._setTabFocus(event.shiftKey);
      }
    },

    onClickYes: function () {
      this._result = true;
    },

    onClickNo: function () {
      this._result = false;
    },
    _setTabFocus: function (tabShift) {
      var tabElements = this.$('*[tabindex=0]'),
          lastIndex   = tabElements.length - 1,
          i           = this._getStartIndex(lastIndex, tabShift, tabElements);
      if (lastIndex > -1) {
        var activeIndex = ( this.activeIndex !== undefined ) ? this.activeIndex :
                          (tabShift ? 0 : lastIndex);
        do {
          var $tabElem = $(tabElements[i]);
          if (base.isVisibleInWindowViewport($tabElem)) {
            this.activeIndex = i;
            $tabElem.trigger('focus');
            break;
          }
          if (tabShift) {
            i = (i === 0) ? lastIndex : i - 1;
          }
          else {
            i = ( i === lastIndex) ? 0 : i + 1;
          }
        }
        while (i != activeIndex);
      }
      return false;
    },
    _getStartIndex: function (lastIndex, tabShift) {
      var startIndex  = 0,
          activeIndex = this.activeIndex;
      if (tabShift) {
        startIndex = lastIndex;
        if (activeIndex !== undefined && activeIndex > 0) {
          startIndex = this.activeIndex - 1;
        }
      }
      else {
        if (activeIndex !== undefined && activeIndex < lastIndex) {
          startIndex = activeIndex + 1;
        }
      }
      return startIndex;
    }

  }, {

    defaultOptions: {
      Success: {
        title: lang.DefaultSuccessTitle,
        titleIcon: 'csui-icon-notification-success-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'success-header'
      },
      Information: {
        title: lang.DefaultInfoTitle,
        titleIcon: 'csui-icon-notification-information-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'info-header'
      },
      Warning: {
        title: lang.DefaultWarningTitle,
        titleIcon: 'csui-icon-notification-warning-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'warning-header'
      },
      Error: {
        title: lang.DefaultErrorTitle,
        titleIcon: 'csui-icon-notification-error-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'error-header'
      },
      Message: {
        title: lang.DefaultMessageTitle,
        titleIcon: '',
        showTitleIcon: false,
        titleCloseIcon: 'csui-icon-dismiss',
        showTitleCloseButton: false,
        headerClass: 'message-header'
      },
      Question: {
        title: lang.DefaultQuestionTitle,
        titleIcon: 'csui-icon-notification-confirmation-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'question-header'
      }
    },

    buttons: {
      YesNoCancel: {
        showYes: true,
        showNo: true,
        showCancel: true
      },
      YesNo: {
        showYes: true,
        showNo: true,
        showCancel: false
      },
      OkCancel: {
        showYes: true,
        labelYes: lang.OkButtonLabel,
        showNo: false,
        showCancel: true
      },
      Ok: {
        showYes: true,
        labelYes: lang.OkButtonLabel,
        showNo: false,
        showCancel: false
      },
      Cancel: {
        showYes: false,
        showNo: false,
        showCancel: true
      },
      Close: {
        showYes: false,
        showNo: false,
        showCancel: true,
        labelCancel: lang.CloseButtonLabel
      }
    },

    buttonLabels: {
      Yes: lang.YesButtonLabel,
      No: lang.NoButtonLabel,
      Ok: lang.OkButtonLabel,
      Cancel: lang.CancelButtonLabel,
      Close: lang.CloseButtonLabel
    },

    showSuccess: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Success,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showInfo: function (callback, message, title, options) {
      // log.warn('The method \'showInfo\' has been deprecated and will be removed.' +
      //          '  Use \'showInformation\' instead.') && console.warn(log.last);
      // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
      this.showInformation.apply(this, arguments);
    },

    showInformation: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Information,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showWarning: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Warning,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showError: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Error,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showMessage: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Message,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    confirmSuccess: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Success,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmInfo: function (callback, message, title, options) {
      // FIXME: Remove this method.
      log.warn('The method \'configInfo\' has been deprecated and will be removed.' +
               '  Use \'configInformation\' instead.') && console.warn(log.last);
      log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
      this.confirmInformation.apply(this, arguments);
    },

    confirmInformation: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Information,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmWarning: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Warning,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmError: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Error,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmQuestion: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Question,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmMessage: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Message,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    _makeOptions: function (parameters, defaultOptions, defaultButtons) {
      var callback = parameters[0],
          message  = parameters[1],
          title    = parameters[2],
          options  = parameters[3];
      // If callback was not provided as the first parameter, shift the others
      if (typeof callback !== 'function') {
        options = title;
        title = message;
        message = callback;
        callback = undefined;
      }
      if (typeof message === 'object') {
        // If only options object was passed in, use it
        options = _.clone(message);
      } else if (typeof title === 'object') {
        // If options object was passed in after the message, use it
        options = _.defaults({message: message}, title);
      } else {
        // If options object was passed in after the message and title, use it
        options = _.defaults({
          message: message,
          title: title
        }, options);
      }
      options.buttons = _.defaults({}, options.buttons, defaultButtons);
      options.callback = callback;
      defaultOptions.closeButtonAria = lang.CloseButtonAria;
      return _.defaults(options, defaultOptions);
    },

    _show: function (options) {
      var alert = new ModalAlertView(options);
      return alert.show();
    }

  });

  return ModalAlertView;

});

csui.define('csui/controls/globalmessage/globalmessage',['module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/messagehelper', 'csui/utils/accessibility',
  'csui/controls/globalmessage/impl/progresspanel/progresspanel.view',
  'csui/controls/globalmessage/impl/messagedialog.view',
  'csui/controls/globalmessage/impl/custom.wrapper.view',
  'csui/controls/globalmessage/impl/loaderpanel/loaderpanel.view',
  'csui/dialogs/modal.alert/modal.alert'
], function (module, _, $, Backbone, MessageHelper, Accessibility, ProgressPanelView,
   MessageView, CustomWrapperView, LoaderPanelView, ModalAlert) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    enablePermanentHeaderMessages: false
  });

  if (Accessibility.isAccessibleMode()) {
    config.enablePermanentHeaderMessages = true;
  }

  var messageHelper = new MessageHelper(),
      globals       = {},
      hasDefaultRegion;

  var GlobalMessage = {

    setMessageRegionView: function (messageRegionView, options) {
      this._cleanupPreviousMessageRegion();
      // Global messages span over the entire view height without these options
      options = _.defaults({}, options, {
        useClass: true,
        sizeToParentContainer: true
      });
      options.classes && (globals.classNames = options.classes);
      options.enableMinimiseButtonOnProgressPanel && (globals.enableMinimiseButtonOnProgressPanel = options.enableMinimiseButtonOnProgressPanel);
      globals.relatedView = options.useClass ? undefined : messageRegionView;
      //Size to parent container instead of browser view port. This is needed for cases where the
      //global messaging and progress bar are to display within a widget.
      globals.sizeToParentContainer = options.sizeToParentContainer;
      globals.messageRegionView = messageRegionView;
      if (globals.messageRegionView && globals.fileUploadCollection &&
          globals.progressPanel) {
        globals.progressPanel = this._makeProgressPanel();
      }
    },

    setFileUploadCollection: function (fileUploadCollection) {
      globals.fileUploadCollection = fileUploadCollection;
      if (globals.progressPanel) {
        if (globals.fileUploadCollection) {
          globals.progressPanel = this._makeProgressPanel();
        } else {
          this.hideFileUploadProgress();
        }
      }
    },

    hideFileUploadProgress: function () {
      if (globals.progressPanel) {
        globals.progressPanel.doClose();
        globals.progressPanel.destroy();
        globals.progressPanel = undefined;
      }
    },

    showFileUploadProgress: function (fileUploadCollection, options) {
      //TODO (Sunil): remove this method in june update build, as the name itself mis-leading
      // the actual functinoality, so for better naming convention replacing this method name.
      console.warn('this method has been deprecated! please use showProgressPanel.');
      this.showProgressPanel(fileUploadCollection, options);
    },

    showProgressPanel: function (fileUploadCollection, options) {
      if (fileUploadCollection) {
        if (!globals.fileUploadCollection) {
          globals.fileUploadCollection = fileUploadCollection;
        }

        if (globals.progressPanel && 
          globals.progressPanel.options.actionType === options.actionType &&
          !globals.progressPanel.isProgressCompleted()) {
          globals.fileUploadCollection.add(fileUploadCollection.models);
        } else {
          this.hideFileUploadProgress();
          globals.fileUploadCollection = fileUploadCollection;
        }

        globals.progressPanel = this._makeProgressPanel(_.extend(options, {
          enableMinimiseButton : globals.enableMinimiseButtonOnProgressPanel
        }));
        globals.progressPanel.doShow(globals.relativeView, globals.messageRegionView);
      }
    },

    isActionInProgress : function (actionType, message, title) {
      var inProgress = false, status;
      if (globals.progressPanel &&
        !globals.progressPanel.isProgressCompleted() &&
        globals.progressPanel.options.actionType !== actionType) {
          inProgress = true;
          ModalAlert.showError(message, title);
      }
      return inProgress;
    },

    showPermissionApplyingProgress: function (permissionAppliedCollection, options) {
      if (permissionAppliedCollection) {
        globals.permissionAppliedCollection = permissionAppliedCollection;
        globals.progressPanel = this.__makePermissionProgressPanel(options);
      }

      if (!globals.progressPanel || permissionAppliedCollection) {
        globals.progressPanel = this._makeProgressPanel(options);
      }
      if (globals.progressPanel) {
        globals.progressPanel.doShow(globals.relativeView, globals.messageRegionView);
      }
    },

    showLoader: function (xhr, options) {
      this.hideFileUploadProgress();
      if (!globals.loaderPanel) {
        globals.loaderPanel = this._makeLoaderPanel(_.extend({xhr: xhr}, options));
      } else {
        globals.loaderPanel.doShow(globals.relativeView, globals.messageRegionView, xhr);
      }
      globals.loaderPanel.listenTo(globals.loaderPanel, 'destroy', function (args) {
        options.onDestroy && options.onDestroy(args);
        globals.loaderPanel = undefined;
      });
      xhr && xhr.always(function (resp) {
        globals.loaderPanel && globals.loaderPanel.destroy();
        options.onDestroy && options.onDestroy(resp);
        globals.loaderPanel = undefined;
      });
    },

    changeLoaderMessage: function (message, xhr) {
      if (globals.loaderPanel) {
        globals.loaderPanel.$el.find("#csui-zipanddownload-stage").text(message);
        globals.loaderPanel.updateXHRReference(xhr);
      }
    },

    /* Shows an error message in the global message location.
      @Params:
        - info - the type of the message:
          - "info" (default)
          - "success"
          - "success_with_link"
          - "warning"
          - "error"
          - "processing"
          - "none"
        - text - the message text
        - details - a detailed message text
        - options - object containing other options
     */
    showMessage: function (info, text, details, options) {
      return this._showMessageView(MessageView,
          _.extend({
            info: info,
            message: text,
            details: details,
            messageHelper: messageHelper,
            sizeToParentContainer: globals.sizeToParentContainer,
            enablePermanentHeaderMessages: config.enablePermanentHeaderMessages
          }, options)
      );
    },

    showCustomView: function (customView) {
      return this._showMessageView(CustomWrapperView, {
        contentView: customView,
        messageHelper: messageHelper
      });
    },

    _showMessageView: function (View, options) {
      this._ensureMessageRegion();
      var messageView = messageHelper.activatePanel(
          messageHelper.createPanel(globals, View, options),
          globals.relatedView, globals.messageRegionView);
      this._addEventHandlers(messageView);
      return messageView;
    },

    _makeProgressPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        collection: globals.fileUploadCollection,
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var progressPanel = messageHelper.activatePanel(
        messageHelper.createPanel(globals, ProgressPanelView, options,
            globals.progressPanel),
        globals.relatedView, globals.messageRegionView, globals.progressPanel);
      this._addEventHandlers(progressPanel);
      return progressPanel;
    },

    __makePermissionProgressPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        collection: globals.permissionAppliedCollection,
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var progressPanel = messageHelper.activatePanel(
        messageHelper.createPanel(globals, ProgressPanelView, options,
            globals.progressPanel),
        globals.relatedView, globals.messageRegionView, globals.progressPanel);
      this._addEventHandlers(progressPanel);
      return progressPanel;
    },

    _makeLoaderPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var loaderPanel = messageHelper.activatePanel(
          messageHelper.createPanel(globals, LoaderPanelView, options, globals.progressPanel),
          globals.relatedView, globals.messageRegionView, globals.progressPanel
      );
      this._addEventHandlers(loaderPanel);
      return loaderPanel;
    },

    _addEventHandlers: function (view) {
      // should listen to resize of region (only), but as this does not fire
      // we have to listen to window as well :-(.
      var resizeHandler = function () {
        messageHelper.resizePanel(view, globals.relatedView);
      };
      $(window).on('resize', resizeHandler);
      view.listenTo(globals.messageRegionView, 'resize', resizeHandler);
      view.once('before:destroy', function () {
        $(window).off('resize', resizeHandler);
        view.stopListening(globals.messageRegionView, 'resize', resizeHandler);
      });
    },

    _ensureMessageRegion: function () {
      if (globals.messageRegionView) {
        return;
      }

      // Reserve a view as big as the screen for high panels like
      // the progress panel.  No width - this is no modal backdrop.
      var modalContainer   = $.fn.binf_modal.getDefaultContainer(),
          messageContainer = $('<div>', {
            'style': 'position:absolute; top: 0; left: 0; width: 0; height: 100vh;'
          }).appendTo(modalContainer);
      globals.messageRegionView = new Backbone.View({el: messageContainer});
      hasDefaultRegion = true;
    },

    _cleanupPreviousMessageRegion: function () {
      if (hasDefaultRegion) {
        globals.messageRegionView.remove();
        hasDefaultRegion = false;
      }
      if (globals.progressPanel) {
        globals.progressPanel.destroy();
      }
      globals = {};
    }

  };

  return GlobalMessage;

});

csui.define('csui/behaviors/default.action/impl/command',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/commands', 'csui/controls/globalmessage/globalmessage',
  'csui/utils/commandhelper'
], function (module, _, $, Backbone, log, commands, GlobalMessage, CommandHelper) {
  'use strict';

  log = log(module.id);

  function CommandController(options) {
    options || (options = {});
    this.commands = options.commands || commands;
  }

  _.extend(CommandController.prototype, {

    executeAction: function (action, status, options) {
      var signature = action.get("signature"),
          command   = this.commands.findWhere({signature: signature});
      try {
        if (!command) {
          throw new Error('Invalid command: ' + signature);
        }
        var promises = command.execute(status, options);
        if (!_.isArray(promises)) {
          promises = [promises];
        }
        return $.when
            .apply($, promises)
            .fail(function (error) {
              if (error) {
                if (!CommandHelper.showOfflineMessage(error)) {
                  GlobalMessage.showMessage('error', error.message);
                }
              }
            });
      } catch (error) {
        log.warn('Executing the command "{0}" failed.\n{1}',
        !!command && command.get('signature'), error.message) && console.warn(log.last);
      }
    }
  });

  CommandController.extend = Backbone.View.extend;

  return CommandController;

});

csui.define('csui/behaviors/default.action/impl/defaultaction',[
  'module', 'csui/lib/underscore', 'csui/behaviors/default.action/impl/command',
  'csui/models/nodes', 'csui/utils/defaultactionitems', 'csui/utils/log'
], function (module, _, CommandController, NodeCollection, defaultActionItems, log) {
  'use strict';

  log = log(module.id);

  var DefaultActionController = CommandController.extend({

    constructor: function DefaultActionController(options) {
      CommandController.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.actionItems = options.actionItems || defaultActionItems;
    },

    executeAction: function (node, options) {
      // Apply the default action always to the shortcut target;
      // the original node reference must be expanded.
      var shortcut, fakedActions;
      if (node.original && node.original.get('id') > 0) {
        shortcut = node;
        fakedActions = this._fakeActions(node.original);
        // Do not switch to original for generations. Commands have to
        // handle them themselves, until we support them properly.
        if (node.get('type') === 1) {
          node = node.original;
        }
      }
      var action = this.getAction(node),
          status = {
            nodes: new NodeCollection([node]),
            shortcut: shortcut
          };
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return action && CommandController.prototype.executeAction.call(
              this, action, status, options);
    },

    getAction: function (node) {
      // Check the default action always against the shortcut or generation
      // target; the original node reference must be expanded.
      // TODO: Support for Generations (type 2) has not yet been added in
      // the mobile app, so they are disabled for now. This is why we
      // currently do not enter the if clause if node is a Generation
      // and window.csui.mobile is true.
      var type = node.get('type'),
          shortcut, fakedActions;
      if ((type === 1 || ((!window.csui || !window.csui.mobile) && type === 2))
          && node.original && node.original.get('id') > 0) {
        shortcut = node;
        node = node.original;
        fakedActions = this._fakeActions(node);
      }
      var status = {
            nodes: new NodeCollection([node]),
            shortcut: shortcut
          },
          // Do not search for the first action, which is assigned
          // to the object and its command is enabled; as soon as
          // the first action for the object is found, the result
          // of its command enabling is returned.
          // TODO: Reconsider using the first enabled command again.
          // Disabling a node shoudl be done by a special feature
          // and not by disabling all default actions.
          enabled = false,
          action = this.actionItems.find(function (actionItem) {
            if (actionItem.enabled(node)) {
              var command = this.commands.findWhere({
                signature: actionItem.get("signature")
              });
              try {
                enabled = command && command.enabled(status);
              } catch (error) {
                log.warn('Evaluating the command "{0}" failed.\n{1}',
                    command.get('signature'), error.message) && console.warn(log.last);
              }
              // Stop enumeration after the first action was found,
              // which can handle the specified node
              return true;
            }
          }, this);
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return enabled && action;
    },

    hasAction: function (node) {
      return !!this.getAction(node);
    },

    // Core REST API does not provide permitted actions for shortcut
    // originals. We always allow clicks on them and let the user
    // watch how the operation fails, when they have no permission.

    _fakeActions: function (node) {
      if (!node.actions.length) {
        var actions = _.map(
            this.actionItems.getAllCommandSignatures(this.commands),
            function (signature) {
              return {signature: signature};
            });
        node.actions.reset(actions, {silent: true});
        return true;
      }
    },

    _resetFakedActions: function (node) {
      node.actions.reset([], {silent: true});
    }

  });

  DefaultActionController.version = "1.0";

  return DefaultActionController;

});

// Loads widgets and exposes a promise with the result status on the view
csui.define('csui/behaviors/default.action/default.action.behavior',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/url', 'csui/utils/log',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/utils/node.links/node.links'
], function (module, _, $, Backbone, Marionette, Url, log,
    NextNodeModelFactory, SearchQueryModelFactory, DefaultActionController,
    nodeLinks) {
  'use strict';

  log = log(module.id);

  var DefaultActionBehavior = Marionette.Behavior.extend({
    constructor: function DefaultActionBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      var context = view.options.context;
      this.view = view;
      this._nextNode = context && context.getModel(NextNodeModelFactory);
      this._searchQuery = context && context.getModel(SearchQueryModelFactory);
      view.defaultActionController = this.options.defaultActionController ||
                                     new DefaultActionController();
    },

    onExecuteDefaultAction: function (node) {
      // Support triggering by the `triggers` object, where the view is
      // passed by Marionette as the first parameter and there are no options
      if (node instanceof Backbone.View) {
        node = node.model;
      }
      var action = this.view.defaultActionController.getAction(node);
      if (action) {
        this.view.defaultActionController.executeAction(node, {
          context: this.view.options.context,
          originatingView: this.view
        });
      } else {
        log.can('WARN') && log.warn('No default action was enabled for {0}.',
            JSON.stringify(_.pick(node.attributes, 'name', 'id', 'type'))) &&
        console.warn(log.last);
      }
    }
  }, {
    // TODO: Deprecate this method.
    getDefaultActionNodeUrl: function (node) {
      var url = nodeLinks.getUrl(node),
          hash = url.lastIndexOf('#');
      // This disallows using the hash part, when the slash-based routing is enabled.
      // But it shoudl be no problem, because this method is not used in new scenaros
      // any more and it didn't offer such contract forn the older ones.
      if (hash >= 0) {
        return url.substr(hash);
      }
      return url;
    }
  });

  return DefaultActionBehavior;
});

csui.define('csui/behaviors/keyboard.navigation/retainfocus.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/log',
  'csui/lib/marionette'
], function (module, _, $,
    log,
    Marionette) {
  'use strict';

  var RetainFocusBehavior = Marionette.Behavior.extend({

        ui: {
          control: '.csui-control'
        },

        events: {
          'mousedown @ui.control': '_startActive',
          'focusout @ui.control': '_stopActive',
          'keydown @ui.control': '_stopActive'
        },

        constructor: function RetainFocusBehavior(options, view) {
          Marionette.Behavior.prototype.constructor.apply(this, arguments);

          this._isFocused = false;

          this.listenTo(view, 'before:render', function () {
            this._isRendering = true;
            if (view.isRendered) {
              // check focus only when re-rendered
              var controlEl = this.ui.control[0];
              this._isFocused = document.activeElement === controlEl;
            }
          });

          this.listenTo(view, 'render', function () {
            this._isRendering = false;
          });

          this.listenTo(view, 'dom:refresh', function () {
            this._reApplyFocus();
          });

        },

        _reApplyFocus: function () {
          if (this._isActive) {
            this.ui.control.addClass('csui-control-active');
          } else {
            this.ui.control.removeClass('csui-control-active');
          }
          if (this._isFocused) {
            this.ui.control.trigger('focus');
          }
        },

        _startActive: function () {
          this._isActive = true;
          this.ui.control.addClass('csui-control-active');
        },

        _stopActive: function () {
          if (!this._isRendering) {
            this.ui.control.removeClass('csui-control-active');
            this._isActive = false;
          }
        }

      },
      {
        // static methods:
      }
  );

  return RetainFocusBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/error/impl/error',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-suggestion\">"
    + this.escapeExpression(((helper = (helper = helpers.suggestion || (depth0 != null ? depth0.suggestion : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"suggestion","hash":{}}) : helper)))
    + "</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-error-icon-div\">\r\n  <div class=\"csui-error-icon-parent\">\r\n    <div class=\"csui-error-icon notification_error\"></div>\r\n  </div>\r\n\r\n</div>\r\n<div class=\"csui-message\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.suggestion : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_error_impl_error', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/error/impl/error',[],function(){});
csui.define('csui/controls/error/error.view',[
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/controls/error/impl/error',
  'css!csui/controls/error/impl/error'
], function ($, Marionette, template) {
  'use strict';

  var ErrorView = Marionette.ItemView.extend({

    className: function () {
      var className = 'csui-error content-tile csui-error-container';
      if (this.options.low) {
        className += ' csui-low';
      }
      return className;
    },

    template: template,

    modelEvents: {
      change: 'render'
    },

    ui: {
      messageArea: '.csui-message'
    },

    events: {
      "mouseenter": 'showPopover',
      "mouseleave": 'hidePopover'
    },

    constructor: function ErrorView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    canShowPopover: function () {
      return (!!this.options.model.get('title'));
    },

    onShow: function () {
      if (this.canShowPopover()) {
        var that = this;
        this.$el.closest('.csui-disabled').removeClass('csui-disabled');
        this.ui.messageArea.binf_popover({
          content: this.options.model.get('title'),
          html: true,
          placement: function () {
            var popOverSource = that.ui.messageArea,
                maxWidth      = popOverSource.width(),
                maxHeight     = popOverSource.height(),
                offset        = popOverSource.offset(),
                window_left   = offset.left,
                window_top    = offset.top,
                window_right  = (($(window).width()) - (window_left + popOverSource.outerWidth(true))),
                window_bottom = (($(window).height()) - (window_top + popOverSource.outerHeight(true)));
            if (window_right > maxWidth) {
              return "right";
            } else if (window_left > maxWidth) {
              return "left";
            } else if (window_bottom > maxHeight) {
              return "bottom";
            } else {
              return "top";
            }
          }
        });
      }
    },

    showPopover: function (e) {
      if (this.canShowPopover()) {
        e.preventDefault();
        e.stopPropagation();
        this.ui.messageArea.binf_popover('show');
      }
    },

    hidePopover: function (e) {
      if (this.canShowPopover()) {
        e.preventDefault();
        e.stopPropagation();
        this.ui.messageArea.binf_popover('hide');
      }
    }

  });

  return ErrorView;

});

csui.define('csui/widgets/error/error.view',[
  'csui/lib/underscore','csui/lib/backbone', 'csui/controls/error/error.view'
], function (_, Backbone, ErrorControlView) {
  'use strict';

  var ErrorWidgetView = ErrorControlView.extend({

    className: function () {
      var cvclass = ErrorControlView.prototype.className;
      if( _.isFunction(cvclass)) {
        cvclass = cvclass.call(this);
      }
      return 'csui-error-widget ' + cvclass;
    },

    constructor: function ErrorWidgetView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = new Backbone.Model({
          message: options.data.message,
          suggestion: options.data.suggestion
        });
      }

      ErrorControlView.prototype.constructor.call(this, options);
    }

  });

  return ErrorWidgetView;

});

csui.define('csui/behaviors/widget.container/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/behaviors/widget.container/impl/nls/root/lang',{

  loadingWidgetFailedMessage: '"{0}" failed to load.',
  loadingWidgetFailedSuggestion: 'Please try again later or contact support.'

});


// Loads widgets and exposes a promise with the result status on the view
csui.define('csui/behaviors/widget.container/widget.container.behavior',['require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/widgets/error/error.view',
  'csui/utils/log', 'i18n!csui/behaviors/widget.container/impl/nls/lang',
  'csui/lib/jquery.when.all'
], function (require, _, $, Marionette, ErrorView, log, lang) {
  'use strict';

  var WidgetContainerBehavior = Marionette.Behavior.extend({

    constructor: function WidgetContainerBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      this.view.widgetsResolved = this._resolveWidgets();
    },

    _resolveWidgets: function () {
      var promises = [];
      if (!this.view.enumerateWidgets) {
        throw new Marionette.Error({
          name: 'UndefinedEnumerateWidgets',
          message: 'Undefined enumerateWidgets method'
        });
      }
      this.view.enumerateWidgets(_.bind(function (widget) {
        promises.push($.when(widget).then(WidgetContainerBehavior.resolveWidget));
      }, this));
      return $.whenAll.apply($, promises);
    }

  }, {

    getErrorWidget: function (widget, error) {
      return {
        type: 'csui/widgets/error',
        options: {
          message: _.str.sformat(lang.loadingWidgetFailedMessage, widget.type),
          suggestion: lang.loadingWidgetFailedSuggestion,
          originalWidget: _.extend({}, widget)
        },
        view: ErrorView,
        error: error
      };
    },

    resolveWidget: function (widget) {
      if (!widget.view) {
        var promise = WidgetContainerBehavior._loadWidget(widget.type)
            .then(function (Widget) {
              widget.view = Widget;
              // TODO: Remove the deprecated property
              widget['class'] = Widget;
              return widget;
            }, function (error) {
              log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
              && console.warn(log.last);
              log.warn('Occurred ' + log.getStackTrace()) && console.warn(log.last);
              _.extend(widget, WidgetContainerBehavior.getErrorWidget(widget, error));
            });
        return promise;
      }
      return $.Deferred().resolve().promise();
    },

    _loadWidget: function (name) {
      var deferred  = $.Deferred(),
          path,
          lastSlash = name.lastIndexOf('/');
      // Enable widget names without the module path for the core widgets;
      // compatibility for early perspectives, which did not use full paths
      if (lastSlash < 0) {
        path = 'csui/widgets/' + name;
      } else {
        path = name;
        name = name.substring(lastSlash + 1);
      }
      require([path + '/' + name + '.view'],
          function (Widget) {
            deferred.resolve(Widget);
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    }

  });

  return WidgetContainerBehavior;

});

csui.define('csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',['csui/lib/underscore', 'csui/lib/marionette'
], function (_, Marionette) {
  'use strict';

  var ViewEventsPropagationMixin = {

    propagateEventsToViews: function () {
      var views = Array.prototype.slice.call(arguments);
      _.each(this._eventsToPropagateToViews,
          _.bind(this._propagateEventToViews, this, views));
    },

    cancelEventsToViewsPropagation: function () {
      var views = Array.prototype.slice.call(arguments);
      _.each(this._eventsToPropagateToViews,
          _.bind(this._cancelEventToViewsPropagation, this, views));
    },

    _propagateEventToViews: function (views, name) {
      _.each(views, function (view) {
        //console.log('Propagating', name,
        //    'from', Object.getPrototypeOf(this).constructor.name,
        //    'to', Object.getPrototypeOf(view).constructor.name);
        //var parentView = this;
        var childView = view;
        view.listenTo(this, name, function () {
          //console.log('Triggering', name,
          //    'from', Object.getPrototypeOf(parentView).constructor.name,
          //    'to', Object.getPrototypeOf(childView).constructor.name);
          // Check if the view has already triggered render and show events
          // and if the view element has been added to the document.
          if ((childView._isShown || childView._isAttached) && childView._isRendered &&
              Marionette.isNodeAttached(childView.el)) {
            var parameters = Array.prototype.slice.call(arguments);
            parameters.unshift(childView, name);
            Marionette.triggerMethodOn.apply(Marionette, parameters);
          }
          // context provided to be able to stop listening
        }, this);
      }, this);
    },

    _cancelEventToViewsPropagation: function (views, name) {
      _.each(views, function (view) {
        //console.log('Cancelling propagation', name,
        //    'from', Object.getPrototypeOf(this).constructor.name,
        //    'to', Object.getPrototypeOf(view).constructor.name);
        // context provided to identify this origin as registrator
        view.stopListening(this, name, undefined, this);
      }, this);
    },

    _eventsToPropagateToViews: ['dom:refresh']

  };

  return ViewEventsPropagationMixin;

});

csui.define('csui/controls/grid/grid.view',['require', 'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin', 'csui/utils/log'
], function (require, module, _, Backbone, Marionette, ViewEventsPropagationMixin, log) {

  log = log(module.id);

  var ColumnView = Marionette.ItemView.extend({

    className: function () {
      var classNames = [];
      if (!!this.model.get('className')) {
        // Apply additional classes from model
        classNames.push(this.model.get('className'));
      }
      this._addSizeClasses(classNames);
      // TODO: Decide if we need it or not.  Or if we want just moves=pushes+pulls.
      // Experimental features for testing: you can define offsets, pulls and pushes
      // together with sizes for a grid column.  They will convert to binf-col-offset-*,
      // binf-col-push-* and binf-col-pull classes respectively.
      this._addOffsetClasses(classNames);
      this._addPullClasses(classNames);
      this._addPushClasses(classNames);
      this._addHeightClasses(classNames);
      return _.unique(classNames).join(' ');
    },

    attributes: function () {
      var tmpAttributes;

      if (this.model.get('widget') !== undefined) {
        var widgetType = this.model.get('widget').type;
        var lastSlash = widgetType.lastIndexOf('/');
        if (lastSlash > 0) {
          widgetType = widgetType.substring(lastSlash + 1);
        }
        // FIXME: use full path for widget type

        tmpAttributes = {
          'data-csui-widget_type': widgetType,
          'data-csui-cell_address': this.model.get('widget').cellAddress
        };
      }
      else {
        tmpAttributes = {};
      }

      return tmpAttributes;
    },

    constructor: function ColumnView(options) {
      if (!!options.cellBehaviours) {
        this.behaviors = _.extend(options.cellBehaviours, this.behaviors);
      }
      this._init(options);
    },

    _init: function (options) {
      Marionette.ItemView.prototype.constructor.call(this, _.extend({template: false}, options));
      if (this.collection) {
        this._createRows();
      } else {
        this._registerModelEvents();
        this._createCell();
      }
      this.propagateEventsToViews(this.cell || this.rows);
    },

    _registerModelEvents: function () {
      this.listenTo(this.model, 'change:widget', this._updateWidget);
      this.listenTo(this.model, 'change:sizes', this._updateSizes);
      this.listenTo(this.model, 'change:heights', this._updateSizes);
    },

    _updateSizes: function () {
      var className = _.result(this, 'className');
      this.$el.attr('class', className);
    },

    /**
     * Replace and re-render cell with new widget
     */
    _updateWidget: function (newWidget) {
      newWidget.cellAddress = this.model.get('widget').cellAddress;

      // Create Cell for new widget
      this._createCell();

      // Update Attributes
      var attrs = _.result(this, 'attributes');
      if (this.id) { attrs.id = _.result(this, 'id'); }
      if (this.className) { attrs['class'] = _.result(this, 'className');}
      this.$el.attr(attrs);

      // Finally, render
      this.render();
    },

    onRender: function () {
      try {
        this._renderContent();
      } catch (error) {
        log.warn('Widget render failed.\n{0}', error.message) && console.warn(log.last);
        var cellConstructionFailed = this.options.grid.getOption('cellConstructionFailed');
        _.isFunction(cellConstructionFailed) &&
        cellConstructionFailed.call(this.options.grid, this.model, error);
      }
    },

    onBeforeDestroy: function () {
      this._destroyContent();
    },

    _addSizeClasses: function (classNames) {
      var sizes = this.model.get('sizes');
      if (sizes) {
        sizes.xs != null && classNames.push('binf-col-xs-' + sizes.xs);
        sizes.sm != null && classNames.push('binf-col-sm-' + sizes.sm);
        sizes.md != null && classNames.push('binf-col-md-' + sizes.md);
        sizes.lg != null && classNames.push('binf-col-lg-' + sizes.lg);
        sizes.xl != null && classNames.push('binf-col-xl-' + sizes.xl);
        sizes.xxl != null && classNames.push('binf-col-xxl-' + sizes.xxl);
      }
    },

    _addOffsetClasses: function (classNames) {
      var offset = this.model.get('offsets');
      if (offset) {
        offset.xs != null && classNames.push('binf-col-xs-offset-' + offset.xs);
        offset.sm != null && classNames.push('binf-col-sm-offset-' + offset.sm);
        offset.md != null && classNames.push('binf-col-md-offset-' + offset.md);
        offset.lg != null && classNames.push('binf-col-lg-offset-' + offset.lg);
        offset.xl != null && classNames.push('binf-col-xl-offset-' + offset.xl);
        offset.xxl != null && classNames.push('binf-col-xxl-offset-' + offset.xxl);
      }
    },

    _addPullClasses: function (classNames) {
      var pulls = this.model.get('pulls');
      if (pulls) {
        pulls.xs != null && classNames.push('binf-col-xs-pull-' + pulls.xs);
        pulls.sm != null && classNames.push('binf-col-sm-pull-' + pulls.sm);
        pulls.md != null && classNames.push('binf-col-md-pull-' + pulls.md);
        pulls.lg != null && classNames.push('binf-col-lg-pull-' + pulls.lg);
        pulls.xl != null && classNames.push('binf-col-xl-pull-' + pulls.xl);
        pulls.xxl != null && classNames.push('binf-col-xxl-pull-' + pulls.xxl);
      }
    },

    _addPushClasses: function (classNames) {
      var pushes = this.model.get('pushes');
      if (pushes) {
        pushes.xs != null && classNames.push('binf-col-xs-push-' + pushes.xs);
        pushes.sm != null && classNames.push('binf-col-sm-push-' + pushes.sm);
        pushes.md != null && classNames.push('binf-col-md-push-' + pushes.md);
        pushes.lg != null && classNames.push('binf-col-lg-push-' + pushes.lg);
        pushes.xl != null && classNames.push('binf-col-xl-push-' + pushes.xl);
        pushes.xxl != null && classNames.push('binf-col-xxl-push-' + pushes.xxl);
      }
    },

    _addHeightClasses: function (classNames) {
      var heights = this.model.get('heights');
      if (heights) {
        heights.xs != null && classNames.push('row-xs-' + heights.xs);
        heights.sm != null && classNames.push('row-sm-' + heights.sm);
        heights.md != null && classNames.push('row-md-' + heights.md);
        heights.lg != null && classNames.push('row-lg-' + heights.lg);
        heights.xl != null && classNames.push('row-xl-' + heights.xl);
        heights.xxl != null && classNames.push('row-xxl-' + heights.xxl);
      }
    },

    _createRows: function () {
      this.rows = new RowsView({
        el: this.el,
        grid: this.options.grid,
        collection: this.collection
      });
    },

    _createCell: function () {
      var CellView        = this._getCellView(),
          cellViewOptions = this._getCellViewOptions(),
          fullOptions     = _.extend({model: this.model}, cellViewOptions);
      if (!!this.cell) {
        // Destroy existing cell (if any)
        this.cell.destroy();
      }

      try {
        this.cell = new CellView(fullOptions);
      } catch (error) {
        log.warn('Widget initialization failed.\n{0}', error.message) && console.warn(log.last);
        var cellConstructionFailed = this.options.grid.getOption('cellConstructionFailed');
        _.isFunction(cellConstructionFailed) &&
        cellConstructionFailed.call(this.options.grid, this.model, error);
      }
    },

    _getCellView: function () {
      var cellView = this.options.grid.getOption('cellView');
      if (cellView && !(cellView.prototype instanceof Backbone.View)) {
        cellView = cellView.call(this.options.grid, this.model);
      }
      if (!cellView) {
        throw new Marionette.Error({
          name: 'NoCellViewError',
          message: 'A "cellView" must be specified'
        });
      }
      return cellView;
    },

    _getCellViewOptions: function () {
      var cellViewOptions = this.options.grid.getOption('cellViewOptions');
      if (_.isFunction(cellViewOptions)) {
        cellViewOptions = cellViewOptions.call(this.options.grid, this.model, this);
      }
      return cellViewOptions;
    },

    _renderContent: function () {
      if (this.cell) {
        var region = new Marionette.Region({el: this.el});
        region.show(this.cell);
      } else {
        // If the grid is nested, nest also the height setting container class
        if (this.options.grid.$el.hasClass('grid-rows')) {
          this.$el.addClass('grid-rows');
        }
        this.rows.render();
      }
    },

    _destroyContent: function () {
      this.cell && this.cell.destroy();
      this.rows && this.rows.destroy();
    }

  });

  _.extend(ColumnView.prototype, ViewEventsPropagationMixin);

  var RowView = Marionette.CollectionView.extend({

    className: 'binf-row',

    childView: ColumnView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        collection: child.rows,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function RowView(options) {
      if (!!options.rowBehaviours) {
        this.behaviors = _.extend(options.rowBehaviours, this.behaviors);
      }
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
      // FIXME: implement stopListening in ViewEventsPropagationMixin on 'remove:child'
    }

  });

  _.extend(RowView.prototype, ViewEventsPropagationMixin);

  var RowsView = Marionette.CollectionView.extend({

    childView: RowView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        collection: child.columns,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours,
        reorderOnSort: this.options.reorderOnSort
      };
    },

    constructor: function RowsView() {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
      // FIXME: implement stopListening in ViewEventsPropagationMixin on 'remove:child'
    }

  });

  _.extend(RowsView.prototype, ViewEventsPropagationMixin);

  var GridRowView = RowView.extend({

    childView: ColumnView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function GridRowView(options) {
      options || (options = {});
      options.grid = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      RowView.prototype.constructor.call(this, options);
    },

    _convertCollection: function (options) {
      return new Backbone.Collection(options.columns);
    }

  });

  var GridView = RowsView.extend({

    className: 'cs-grid binf-container-fluid',

    constructor: function GridView(options) {
      options || (options = {});
      options.grid = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      RowsView.prototype.constructor.call(this, options);
    },

    _convertCollection: function (options) {
      return this._convertRows(options.rows, 'grid0');
    },

    _convertRows: function (rows, addressPrefix) {
      rows = new Backbone.Collection(rows);
      rows.each(function (row, rowIndex) {
        var columns = row.get('columns');
        row.cellAddress = addressPrefix + ':r' + rowIndex;
        row.columns = this._convertColumns(columns, row.cellAddress);
      }, this);
      return rows;
    },

    _convertColumns: function (columns, addressPrefix) {
      columns = new Backbone.Collection(columns);
      columns.each(function (column, colIndex) {
        var rows = column.get('rows');
        column.cellAddress = addressPrefix + ':c' + colIndex;
        if (column.get('widget') !== undefined) {
          column.get('widget').cellAddress = column.cellAddress;
        }
        if (rows) {
          column.rows = this._convertRows(rows, column.cellAddress);
        }
      }, this);
      return columns;
    }

  }, {

    RowView: GridRowView,
    CellView: ColumnView

  });

  return GridView;

});

csui.define('csui/controls/node-type.icon/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/node-type.icon/impl/nls/root/lang',{

  shortcutTypeLabel: 'Shortcut to {0}',
  nodeTypeUnknown: 'Unknown'

});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/node-type.icon/node-type.icon',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imageUrl || (depth0 != null ? depth0.imageUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageUrl","hash":{}}) : helper)))
    + "\" class=\"csui-icon\" alt=\"\" aria-hidden=\"true\">\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.mainSvgId : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0)})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "    <svg class=\"csui-icon csui-svg-icon\" focusable=\"false\">\r\n      <use xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#"
    + this.escapeExpression(((helper = (helper = helpers.mainSvgId || (depth0 != null ? depth0.mainSvgId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mainSvgId","hash":{}}) : helper)))
    + "\"></use>\r\n    </svg>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\""
    + this.escapeExpression(((helper = (helper = helpers.mainClassName || (depth0 != null ? depth0.mainClassName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mainClassName","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"8":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.overlaySvgIds : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0, blockParams, depths),"inverse":this.noop})) != null ? stack1 : "");
},"9":function(depth0,helpers,partials,data,blockParams,depths) {
    return "    <svg class=\"csui-icon csui-svg-icon\" focusable=\"false\">\r\n      <use xlink:href=\""
    + this.escapeExpression(this.lambda((depths[1] != null ? depths[1].spritePath : depths[1]), depth0))
    + "#"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></use>\r\n    </svg>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.overlayClassNames : depth0),{"name":"each","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"12":function(depth0,helpers,partials,data) {
    return "    <span class=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageUrl : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.program(3, data, 0, blockParams, depths)})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.overlaySvgIds : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.program(11, data, 0, blockParams, depths)})) != null ? stack1 : "");
},"useDepths":true});
Handlebars.registerPartial('csui_controls_node-type.icon_node-type.icon', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/node-type.icon/node-type.icon.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/nodesprites',
  'i18n!csui/controls/node-type.icon/impl/nls/lang',
  'hbs!csui/controls/node-type.icon/node-type.icon',
  'csui/themes/carbonfiber/svg_sprites/symbol/sprite'
], function (_, $, Backbone, Marionette, nodeSpriteCollection,
    lang, template, sprite) {
  'use strict';

  var NodeTypeIconModel = Backbone.Model.extend({
    constructor: function NodeTypeIconModel(attributes, options) {
      this.node = options.node;
      attributes = this._getAttributesFromNode();

      NodeTypeIconModel.__super__.constructor.call(this, attributes, options);

      this
          .listenTo(this.node, 'change:id', this._updateModelFromNode)
          .listenTo(this.node, 'change:type', this._updateModelFromNode)
          .listenTo(this.node, 'change:image_url', this._updateModelFromNode);
    },

    _getAttributesFromNode: function () {
      var node              = this.node,
          original          = node.original,
          exactNodeSprite   = nodeSpriteCollection.findByNode(node) || {},
          exactClassName    = exactNodeSprite.get('className'),
          exactSvgId        = exactNodeSprite.get('svgId'),
          mainClassName     = exactClassName,
          mainSvgId         = exactSvgId,
          overlayClassNames = [],
          overlaySvgIds = [];
      var mimeTypeFromNodeSprite;
      if (exactNodeSprite.attributes) {
        mimeTypeFromNodeSprite = exactNodeSprite.get('mimeType');
      }
      // prefer the title mapped by mimetype entries in nodeSpriteCollection
      var title = mimeTypeFromNodeSprite || node.get("type_name") || node.get("type");

      // If the node is shortcut, find the icon data for the original node
      // and add append an overlay CSS class for a small arrow icon.

      // Note: For MicroPost(Comments and Replies), do not consider
      // original node, show their respective icon

      // Note2: since the RestAPI at the moment does not return the document version, showing the
      // latest document mime-type icon with the shortcut overlay is incorrect.  Use the
      // generation icon  for now.  When the RestAPI and UI supports Generation, switch this to
      // generation-overlay.

      if (original && original.get('id') && node.get("type") !== 1281 && node.get("type") !== 2) {
        var originalNodeSprite = nodeSpriteCollection.findByNode(original) || {};
        mainClassName = originalNodeSprite.get('className');
        mainSvgId = originalNodeSprite.get('svgId');
        overlayClassNames.push('csui-icon csui-icon-shortcut-overlay');
        overlaySvgIds.push('themes--carbonfiber--image--icons--shortcut-overlay');
        title = _.str.sformat(lang.shortcutTypeLabel,
            originalNodeSprite.get('mimeType') || original.get("type_name") ||
            lang.nodeTypeUnknown);
      }

      var attributes = {
        imageUrl: node.get("image_url"),
        title: title
      };
      // prefer SVGs from sprite
      if (exactSvgId) {
        attributes.spritePath = sprite.getSpritePath();
        attributes.svgId = exactSvgId;
        attributes.mainSvgId = mainSvgId;
        attributes.overlaySvgIds = overlaySvgIds;
      } else {
        attributes.className = exactClassName;
        attributes.mainClassName = mainClassName;
        attributes.overlayClassNames = overlayClassNames;
      }
      return attributes;
    },

    _updateModelFromNode: function () {
      var attributes = this._getAttributesFromNode();
      this.clear({silent: true});
      this.set(attributes);
    }
  });

  var NodeTypeIconView = Marionette.ItemView.extend({
    tagName: 'span',

    attributes: function () {
      var title = this.model.get('title');
      return {
        'class': 'csui-icon-group',
        'title': title,
        'aria-label': title
      };
    },

    template: template,

    constructor: function NodeTypeIconView(options) {
      options || (options = {});
      if (!options.model) {
        this.ownModel = true;
        options.model = new NodeTypeIconModel(undefined, {node: options.node});
      }

      NodeTypeIconView.__super__.constructor.call(this, options);

      // Passing the el to the ctor prevents creating an own el, including
      // setting its attributes.  The caller must ensure the right tag.
      if (options.el) {
        $(options.el).attr(_.result(this, 'attributes'));
      }

      this.listenTo(this.model, 'change', this.render);
    },

    onRender: function () {
      this._updateTitle();
    },

    onDestroy: function(){
      if (this.ownModel){
        this.model.stopListening();
      }
    },

    _updateTitle: function () {
      var title = this.model.get('title');
      this.$el
          .attr('title', title)
          .attr('aria-label', title);
    }
  });

  return NodeTypeIconView;
});

csui.define('csui/controls/progressblocker/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/progressblocker/impl/nls/root/lang',{
  loadingText: "Loading data, please wait."
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/progressblocker/impl/blocker',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"outer-border\">\r\n  <div class=\"loader\">\r\n  </div>\r\n  <div class=\"binf-sr-only\" aria-live=\"polite\" aria-busy=\"true\">\r\n      "
    + this.escapeExpression(((helper = (helper = helpers.loadingText || (depth0 != null ? depth0.loadingText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"loadingText","hash":{}}) : helper)))
    + "\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_progressblocker_impl_blocker', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/progressblocker/impl/blocker',[],function(){});
csui.define('csui/controls/progressblocker/blocker',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log',
  'i18n!csui/controls/progressblocker/impl/nls/lang',
  'hbs!csui/controls/progressblocker/impl/blocker',
  'css!csui/controls/progressblocker/impl/blocker'
], function (module, _, $, Marionette, log, lang, template) {
  'use strict';

  log = log(module.id);

  var config = module.config();
  _.defaults(config, {
    delay: 10,
    disableDelay: 10,
    globalOnly: false
  });
  var enableDelay = config.delay,
      disableDelay = config.disableDelay,
      globalOnly = config.globalOnly,
      suppressedViews = [],
      globalBlockingView, detachableBlockingView;

  var BlockingView = Marionette.ItemView.extend({
    className: 'load-container binf-hidden',
    template: template,

    constructor: function BlockingView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.parentView = options.parentView;
      this.counter = 0;
    },

    serializeData: function () {
      return {
        loadingText: lang.loadingText
      };
    },

    enable: function () {
      if (!this.options.local) {
        var blockingView = this._getGlobalBlockingView();
        if (blockingView) {
          log.debug(
              'Blocking view delegates global enabling by {0} ({1}) to {2} ({3}), counter: {4}.',
              log.getObjectName(this.parentView), this.parentView.cid,
              log.getObjectName(blockingView.parentView), blockingView.parentView.cid,
              blockingView.counter) && console.log(log.last);
          if (detachableBlockingView) {
            suppressBlockingView(this);
          } else {
            return blockingView.enable();
          }
        }
      }
      // guard against multiple enabling calls
      if (this.counter) {
        ++this.counter;
      } else {
        this.counter = 1;
        if (this.disableTimeout) {
          clearTimeout(this.disableTimeout);
          this.disableTimeout = undefined;
        } else {
          // delay the actual display by the configured time period
          this.enableTimeout = setTimeout(_.bind(function () {
            this.enableTimeout = undefined;
            this._show();
            log.debug('Blocking view enabled by {0} ({1}).',
                log.getObjectName(this.parentView), this.parentView.cid)
            && console.log(log.last);
            Marionette.triggerMethodOn(this.parentView, 'enable:blocking', this);
          }, this), enableDelay);
        }
      }
    },

    disable: function () {
      if (!this.options.local) {
        var blockingView = this._getGlobalBlockingView();
        if (blockingView) {
          log.debug(
              'Blocking view delegates global disabling by {0} ({1}) to {2} ({3}), counter: {4}.',
              log.getObjectName(this.parentView), this.parentView.cid,
              log.getObjectName(blockingView.parentView), blockingView.parentView.cid,
              blockingView.counter) && console.log(log.last);
          if (!detachableBlockingView) {
            return blockingView.disable();
          }
        }
      }
      // guard against multiple disabling calls
      if (this.counter > 1) {
        --this.counter;
      } else if (this.counter === 0) {
        log.debug('Blocking view has been already disabled by {0} ({1}).',
            log.getObjectName(this.parentView), this.parentView.cid)
        && console.log(log.last);
      } else {
        this.counter = 0;
        // if the showing delay hasn't ended yet just cancel the display
        if (this.enableTimeout) {
          clearTimeout(this.enableTimeout);
          this.enableTimeout = undefined;
          releaseBlockingViews(this);
        } else {
          // delay the actual hiding in case another showing should come quickly
          this.disableTimeout = setTimeout(_.bind(function () {
            this.disableTimeout = undefined;
            this._hide();
            log.debug('Blocking view disabled by {0} ({1}).',
                log.getObjectName(this.parentView), this.parentView.cid)
            && console.log(log.last);
            releaseBlockingViews(this);
            Marionette.triggerMethodOn(this.parentView, 'disable:blocking', this);
          }, this), disableDelay);
        }
      }
    },

    onBeforeDestroy: function () {
      this._clearTimeouts();
      this._resetGlobalBlockingView();
    },

    makeGlobal: function (detachable) {
      // The outermost view, which usually means the first view, should win
      if (!globalBlockingView) {
        detachableBlockingView = !!detachable;
        globalBlockingView = this;
        this.$el.addClass('csui-global');
      }
    },

    _getGlobalBlockingView: function () {
      // If this view is the global view, return false; otherwise and endless recursion
      // would occur constantly delegating the operation to the global view
      if (globalBlockingView && globalBlockingView !== this &&
          // Join the global blocking view, if using just the global one was forced,
          // or if the global one is enabled; otherwise let the local one work
          (globalOnly || globalBlockingView.counter)) {
        return globalBlockingView;
      }
    },

    _resetGlobalBlockingView: function () {
      if (globalBlockingView === this) {
        globalBlockingView = undefined;
        this.$el.removeClass('csui-global');
      }
    },

    _clearTimeouts: function () {
      if (this.enableTimeout) {
        clearTimeout(this.enableTimeout);
      }
      if (this.disableTimeout) {
        clearTimeout(this.disableTimeout);
      }
    },

    _show: function () {
      this.$el.removeClass('binf-hidden');
    },

    _hide: function () {
      this.$el.addClass('binf-hidden');
    }
  });

  var ParentWithBlockingView = {
    blockActions: function () {
      logParentBlockActions.call(this, true);
      showImage(this.blockingView.$el);
      this.blockingView.enable();
      ++this._blockingCounter;
      return this;
    },

    blockWithoutIndicator: function () {
      logParentBlockActions.call(this, false);
      hideImage(this.blockingView.$el);
      this.blockingView.enable();
      ++this._blockingCounter;
      return this;
    },

    unblockActions: function () {
      if (this === this.blockingView.parentView) {
        log.debug('Blocking view asked for disabling for {0} ({1}), counter: {2}.',
            log.getObjectName(this), this.cid, this.blockingView.counter)
        && console.log(log.last);
      } else {
        log.debug(
            'Blocking view asked for disabling for {0} ({1}) by {2} ({3}), counter: {4}.',
            log.getObjectName(this), this.cid,
            log.getObjectName(this.blockingView.parentView),
            this.blockingView.parentView.cid, this.blockingView.counter)
        && console.log(log.last);
      }
      this.blockingView.disable();
      if (this._blockingCounter) {
        --this._blockingCounter;
      }
      return this;
    },

    showBlockingView: function () {
      log.debug('Blocking view is showing for {0} ({1}).',
          log.getObjectName(this), this.cid) && console.log(log.last);
      this.blockingView.render();
      this.blockingView.parentView.$el.append(this.blockingView.el);
    },

    destroyBlockingView: function () {
      log.debug('Blocking view is destroying for {0} ({1}).',
          log.getObjectName(this), this.cid) && console.log(log.last);
      if (this._blockingCounter) {
        log.debug('Blocking view needs cleanup for {0} ({1}), counter: {2}.',
            log.getObjectName(this), this.cid, this._blockingCounter)
        && console.log(log.last);
      }
      while (this._blockingCounter) {
        this.unblockActions();
      }
      this.blockingView.destroy();
    }
  };

  function suppressBlockingView(view) {
    log.debug('Blocking view is suppressing {0} ({1}).',
        log.getObjectName(view.parentView), view.parentView.cid)
    && console.log(log.last);
    hideImage(view.$el);
    suppressedViews.push(view);
  }

  function releaseBlockingViews(view) {
    if (view === globalBlockingView) {
      suppressedViews.forEach(function (view) {
        log.debug('Blocking view is releasing {0} ({1}).',
            log.getObjectName(view.parentView), view.parentView.cid)
        && console.log(log.last);
        showImage(view.$el);
      });
      suppressedViews = [];
    }
  }

  function showImage(element) {
    element.find('.outer-border').removeClass('binf-hidden');
  }

  function hideImage(element) {
    element.find('.outer-border').addClass('binf-hidden');
  }

  function logParentBlockActions(indicator) {
    indicator = indicator ? 'with' : 'without';
    if (this === this.blockingView.parentView) {
      log.debug(
          'Blocking view asked for enabling {0} indicator for {1} ({2}), counter: {3}.',
          indicator, log.getObjectName(this), this.cid, this.blockingView.counter)
      && console.log(log.last);
    } else {
      log.debug(
          'Blocking view asked for enabling for {0} indicator for {0} ({1}) by {2} ({3}), counter: {4}.',
          indicator, log.getObjectName(this), this.cid,
          log.getObjectName(this.blockingView.parentView),
          this.blockingView.parentView.cid, this.blockingView.counter)
      && console.log(log.last);
    }
  }

  BlockingView.imbue = function (parent, parentView) {
    var options;
    if (Object.getPrototypeOf(parent) === Object.prototype) {
      options = parent;
      parent = options.parent;
      parentView = options.parentView;
    } else {
      options = {};
    }
    parentView || (parentView = parent);
    var blockingView = new BlockingView({
      parentView: parentView,
      local: options.local
    });
    parent.blockingView = blockingView;
    parent.blockingPrototype = ParentWithBlockingView;
    _.extend(parent, ParentWithBlockingView);
    parent._blockingCounter = 0;
    parent.listenTo(parentView, 'render', parent.showBlockingView)
          .listenTo(parentView, 'before:destroy', parent.destroyBlockingView);
  };

  var ChildWithBlockingView = {

    blockActions: function () {
      logChildBlockActions.call(this);
      this.childWithBlockingView.blockActions();
      return this;
    },

    blockWithoutIndicator: function () {
      logChildBlockActions.call(this);
      this.childWithBlockingView.blockWithoutIndicator();
      return this;
    },

    unblockActions: function () {
      log.debug('Blocking view delegates disabling for {0} ({1}) to {2} ({3}).',
          log.getObjectName(this), this.cid,
          log.getObjectName(this.childWithBlockingView),
          this.childWithBlockingView.cid) && console.log(log.last);
      this.childWithBlockingView.unblockActions();
      return this;
    }
  };

  function logChildBlockActions() {
    log.debug('Blocking view delegates enabling for {0} ({1}) to {2} ({3}).',
        log.getObjectName(this), this.cid, log.getObjectName(this.childWithBlockingView),
        this.childWithBlockingView.cid) && console.log(log.last);
  }

  function toggleSuppression (suppress) {
    // TODO: Find a way how to mark the outermost element for the local widgets.
    var method = suppress ? 'addClass' : 'removeClass';
    $('.binf-widgets .load-container')[method]('csui-no-blocking');
  }

  BlockingView.suppressAll = function () {
    toggleSuppression(true);
  };

  BlockingView.resumeAll = function () {
    toggleSuppression(false);
  };

  BlockingView.delegate = function (parent, child) {
    if (Object.getPrototypeOf(parent) === Object.prototype) {
      var options = parent;
      parent = options.parent;
      child = options.child;
    }
    parent.childWithBlockingView = child;
    parent.childWithBlockingViewPrototype = ChildWithBlockingView;
    _.extend(parent, ChildWithBlockingView);
  };

  return BlockingView;
});

csui.define('csui/controls/perspective.panel/perspective.animator',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery'
], function (module, _, $) {
  'use strict';

  var config = _.extend({
    effect: 'none'
  }, module.config());
  var effect = config;

  function PerspectiveAnimator(perspectivePanelView) {
    this.perspectivePanelView = perspectivePanelView;
  }

  PerspectiveAnimator.prototype = {
    startAnimation: function (perspectiveView) {
      if (effect === 'slide') {
        var perspectivePanel = this.perspectivePanelView;

        perspectivePanel.$el
        // Flush the DOM redraw to separate hiding of the
        // blocking view from the perspective change animation
          .redraw()
          .addClass('csui-in-transition');

        perspectiveView.$el.addClass('cs-on-stage-right');
        perspectiveView.triggerMethod('before:show');
        this.perspectivePanelView.$el.append(perspectiveView.el);
      } else if (effect === 'fade') {
        perspectiveView.$el.addClass('csui-fading');
      }
    },

    swapPerspective: function (currentPerspectiveView, upcomingPerspectiveView) {
      var deferred = $.Deferred();
      if (effect === 'slide') {
        currentPerspectiveView.$el.addClass('cs-on-stage-left');
      } else {
        currentPerspectiveView.remove();
      }

      if (effect === 'fade') {
        this.perspectivePanelView.$el.addClass('csui-in-transition');
      }
      this._insertPerspective(upcomingPerspectiveView);

      if (effect === 'slide' || effect === 'fade') {
        upcomingPerspectiveView.$el
            .one(this._transitionEnd(), deferred.resolve)
            // Do not let the browser "optimize away" the transition
            // after appending by accessing some DOM property which
            // needs the element rendered.
            .redraw()
            .removeClass(effect === 'slide' ? 'cs-on-stage-right' : 'csui-faded-out');
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    showPerspective: function (perspectiveView) {
      var deferred = $.Deferred();
      this._insertPerspective(perspectiveView);
      if (effect === 'slide' || effect === 'fade') {
        perspectiveView.$el
            .one(this._transitionEnd(), deferred.resolve)
            // Do not let the browser "optimize away" the transition
            // after appending by accessing some DOM property which
            // needs the element rendered.
            .redraw()
            .removeClass(effect === 'slide' ? 'cs-on-stage-right' : 'csui-faded-out');
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    finishAnimation: function () {
      if (effect === 'slide' || effect === 'fade') {
        this.perspectivePanelView.$el.removeClass('csui-in-transition');
      }
    },

    _insertPerspective: function (perspectiveView) {
      if (effect === 'fade') {
        perspectiveView.$el.addClass('csui-faded-out');
      }
      perspectiveView.triggerMethod('before:show');
      this.perspectivePanelView.$el.append(perspectiveView.el);
      perspectiveView.triggerMethod('show');
    },

    _transitionEnd: _.once(
      function () {
        var transitions = {
              transition: 'transitionend',
              WebkitTransition: 'webkitTransitionEnd',
              MozTransition: 'transitionend',
              OTransition: 'oTransitionEnd otransitionend'
            },
            element = document.createElement('div'),
            transition;
        for (transition in transitions) {
          if (typeof element.style[transition] !== 'undefined') {
            return transitions[transition];
          }
        }
      }
    )
  };

  return PerspectiveAnimator;
});


csui.define('csui/controls/perspective.panel/perspective.factory',['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (require, _, $, Backbone) {

  function PerspectiveFactory(options) {
    this.options = options || {};
  }

  _.extend(PerspectiveFactory.prototype, {

    createPerspective: function (model) {
      var self = this;
      return this
          ._loadPerspective(model.get('type'))
          .then(function (PerspectiveView) {
            return new PerspectiveView(_.extend({
              context: self.options.context
            }, model.get('options')));
          });
    },

    _loadPerspective: function (type) {
      var deferred  = $.Deferred(),
          path,
          lastSlash = type.lastIndexOf('/');
      // Enable perspective types without the module path for the core perspectives;
      // compatibility for early perspectives, which did not use the full paths
      if (lastSlash < 0) {
        path = 'csui/perspectives/' + type;
      } else {
        path = type;
        type = type.substring(lastSlash + 1);
      }
      require([path + '/' + type + '.perspective.view'],
          function (PerspectiveView) {
            deferred.resolve(PerspectiveView);
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    }

  });

  PerspectiveFactory.extend = Backbone.View.extend;

  return PerspectiveFactory;
});

csui.define('csui/utils/contexts/factories/user',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector', 'csui/models/authenticated.user'
], function (module, _, $, Backbone, ModelFactory, ConnectorFactory,
    AuthenticatedUserModel) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var UserModelFactory = ModelFactory.extend({
    propertyPrefix: 'user',

    constructor: function UserModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var user = this.options.authentication || this.options.user || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = user.initialResponse || config.initialResponse;
      }
      if (!(user instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options);
        user = new AuthenticatedUserModel(user.attributes || config.attributes,
            _.defaults({
              connector: connector
            }, user.options, config.options));
      }
      this.property = user;
    },

    fetch: function (options) {
      var promise;
      if (this.initialResponse && !initialResourceFetched) {
        promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
      } else {
        promise = this.property.fetch(options);
      }

      // set the userId on the authenticator
      promise.done(_.bind(function() {
        this.property.connector.authenticator.setUserId(this.property.get('id'));
      }, this));

      return promise;
    }
  });

  return UserModelFactory;
});

csui.define('csui/utils/contexts/factories/application.scope.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var ApplicationScopeModel = Backbone.Model.extend({});

  var ApplicationScopeModelFactory = ModelFactory.extend({

    propertyPrefix: 'applicationScope',

    constructor: function ApplicationScopeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var applicationScope = this.options.applicationScope || {};
      if (!(applicationScope instanceof Backbone.Model)) {
        var config = module.config();
        applicationScope = new ApplicationScopeModel(applicationScope.models, _.extend({},
            applicationScope.options, config.options));
      }
      this.property = applicationScope;
    }

  });

  return ApplicationScopeModelFactory;

});

csui.define('csui/utils/contexts/factories/node',[
  'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model', 'csui/utils/commands'
], function (module, $, Backbone, ModelFactory, ConnectorFactory,
    NodeModel, commands) {
  'use strict';

  var NodeModelFactory = ModelFactory.extend({
    propertyPrefix: 'node',

    constructor: function NodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var node = this.options.node || {},
          config = module.config();
      if (!(node instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            creationOptions = $.extend(true, {
              connector: connector,
              // Do not waste server resources and request only common
              // properties at start; it returns all what it can by default.
              fields: {
                properties: [],
                'versions.element(0)': ['owner_id']
              },
              // Command enabling for shortcuts needs the original node info
              expand: {
                properties: ['original_id']
              },
              // Make sure, that the metadata token is returned for nodes
              // requesated via this factory, because they are supposed to
              // be shared and may be the subject of changes.
              stateEnabled: true,
              // Command enabling needs permitted actions
              commands: commands.getAllSignatures()
            }, config.options, node.options);
        // Next node can be fetshed just like node; keep their defaults in sync
        node = new NodeModel(node.attributes || config.attributes,
            creationOptions);
      }
      this.property = node;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return NodeModelFactory;
});

csui.define('csui/utils/contexts/factories/ancestors',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/nodeancestors'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeAncestorCollection) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var AncestorCollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'ancestors',

    constructor: function AncestorsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var config = module.config();
      var ancestors = this.options.ancestors || {};
      if (prefetch) {
        this.initialResponse = ancestors.initialResponse || config.initialResponse;
      }
      if (!(ancestors instanceof Backbone.Collection)) {
        var node = context.getModel(NodeModelFactory);
        ancestors = new NodeAncestorCollection(ancestors.models,
          _.defaults({
            // Breadcrumb panel listens only to the 'reset' event.
            autoreset: true,
            node: node
          }, ancestors.options, config.options));
      }
      this.property = ancestors;

      // Listen to renaming of the contextual node, which we assume to be
      // the last ancestor, as the collection is constructed by default.
      this.listenTo(this.property.node, 'change:name', function () {
        if (this.property.length > 0) {
          this.property.last().set('name', node.get('name'));
        }
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        // If you want to avoid the server call by updating the ancestors
        // only on the client side, inspect the earlier code in Perforce.
        return this.property.fetch(options);
      }
    }
  });

  return AncestorCollectionFactory;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/breadcrumbs/impl/breadcrumb/impl/breadcrumb',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"url","hash":{}}) : helper)))
    + "\" class=\"binf-dropdown-toggle csui-subcrumb csui-acc-focusable\"\r\n     data-binf-toggle=\"dropdown\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.subcrumbTooltip || (depth0 != null ? depth0.subcrumbTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"subcrumbTooltip","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n  <ul class=\"binf-dropdown-menu\" role=\"menu\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.subcrumbs : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </ul>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.inactive : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0)})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    return "        <li role=\"menuitem\"><a data-id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</a>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "        <li role=\"menuitem\"><a class='csui-breadcrumb csui-acc-focusable' href=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.url : depth0), depth0))
    + "\"\r\n               data-id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</a>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.inactive : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.program(10, data, 0)})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "    "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "    <a class='csui-breadcrumb csui-acc-focusable' href=\""
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"url","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"\r\n       title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasSubCrumbs : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(7, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_breadcrumbs_impl_breadcrumb_impl_breadcrumb', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/root/lang',{
  subcrumbTooltip: 'Show full path',
  breadcrumbAria: 'Breadcrumb'

});


csui.define('csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/node.links/node.links',
  'hbs!csui/controls/breadcrumbs/impl/breadcrumb/impl/breadcrumb',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang'
], function (_, $, Marionette, nodeLinks, template, lang) {
  'use strict';

  var BreadcrumbItemView = Marionette.ItemView.extend({
    tagName: 'li',

    template: template,

    modelEvents: {
      change: 'render'
    },

    events: {
      'click a.csui-breadcrumb': 'onClickLink'
    },

    onClickLink: function (e) {
      e.preventDefault();
      e.stopPropagation();

      var model = this.model;
      if (model.get('subcrumbs').length > 0) {
        var id = $(e.target).data('id');
        model = this._getModel(id);
      }
      this.triggerMethod('click:ancestor', model);
    },

    className: function () {
      var cname,
          // Constructor of this object has not been finished yet;
          // subcrumbs as an array have not been ensured yet
          subCrumbs = this.model.get('subcrumbs');

      if (this.options.isLastChild) {
        cname = 'binf-active';
      } else if (subCrumbs && subCrumbs.length > 0) {
        cname = 'binf-dropdown';
      } else {
        cname = 'tail';
      }

      return cname;
    },

    templateHelpers: function () {
      // If the ancestor points to a real node, which is connected
      // to a server, set href of the link to the open the container
      // perspective of the ancestor
      function getAncestorUrl(crumb) {
        var connector = crumb.connector || crumb.collection.connector;
        return crumb.get('id') > 0 && (connector) &&
               nodeLinks.getUrl(crumb, {connector: connector}) || '#';
      }

      var options   = this.options,
          subCrumbs = _.map(this.model.get('subcrumbs'), function (crumb) {
            return _.extend(crumb.toJSON(), {url: getAncestorUrl(crumb)});
          });
      return {
        inactive: this.model.get('inactive') || options.isLastChild,
        hasSubCrumbs: subCrumbs.length > 0,
        subcrumbs: subCrumbs,
        name: this.model.attributes.displayName || this.model.attributes.name_formatted ||
              this.model.attributes.name,
        url: getAncestorUrl(this.model),
        subcrumbTooltip: lang.subcrumbTooltip
      };
    },

    onRender: function () {
      // aria-current can not be set on the last/active element as that is not a link. html validity issue.
      // TODO the inactive/informational last element is counted by the screenreader but can not be reached
    },

    constructor: function BreadcrumbItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      // Make using the view-model easier in this view
      if (!this.model.has('subcrumbs')) {
        this.model.set('subcrumbs', [], {silent: true});
      }
    },

    _getModel: function (id) {
      var subCrumbs = this.model.get('subcrumbs'),
          model     = null;

      for (var i = 0; i < subCrumbs.length; i++) {
        if (subCrumbs[i].get('id') === id) {
          model = subCrumbs[i];
          break;
        }
      }
      return model;
    }
  });

  return BreadcrumbItemView;
});

csui.define('csui/controls/breadcrumbs/breadcrumbs.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',
  'csui/utils/contexts/factories/next.node',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior'
], function (_,
    $,
    Backbone,
    Marionette,
    BreadCrumbItemView,
    NextNodeModelFactory,
    TabableRegionBehavior) {

  var BreadCrumbCollectionView = Marionette.CollectionView.extend({

    tagName: 'ol',

    className: 'binf-breadcrumb',

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    childView: BreadCrumbItemView,

    childViewOptions: function (model, index) {
      return {
        childIndex: index,
        isLastChild: index === (model.get("showAsLink") ? this.collection.size() :
                                this.collection.size() - 1)
      };
    },

    constructor: function BreadcrumbCollectionView(options) {
      options || (options = {});
      this.completeCollection = options.collection;
      options.collection = new Backbone.Collection();

      Marionette.CollectionView.call(this, options);
    },

    initialize: function (options) {

      this.listenTo(this.completeCollection, 'update reset', this.synchronizeCollections);

      var context = this.context = this.options.context;
      this._nextNode = options.node || context.getModel(NextNodeModelFactory);
      this.stop = this.options.stop || {};
      this.options.noOfItemsToShow = parseInt(this.options.noOfItemsToShow, 10);
      this._startSubCrumbs = this.options.startSubCrumbs !== undefined ?
                             parseInt(this.options.startSubCrumbs, 10) : 1;
      this._subCrumbsLength = 0;

      this.accLastBreadcrumbElementFocused = true;
      this.accNthBreadcrumbElementFocused = 0;

      this.resizeTimer = undefined;
      $(window).on('resize.' + this.cid, {view: this}, this._onWindowResize);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        // optimization for rapid mouse movement and redraw when mouse movement slows down or stop
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function () {
          self._adjustToFit();
        }, 200);
      }
    },

    events: {'keydown': 'onKeyInView'},

    _breadcrumbSelector: 'a.csui-acc-focusable:visible',

    isTabable: function () {
      return this.collection.models.length > 1;
    },

    currentlyFocusedElement: function () {
      if (this.isTabable()) {
        if (this.accLastBreadcrumbElementFocused) {
          return this.$(this._breadcrumbSelector + ':last');
        } else {
          var breadcrumbElements = this.$(this._breadcrumbSelector);
          return $(breadcrumbElements[this.accNthBreadcrumbElementFocused]);
        }
      } else {
        return $();
      }
    },

    onKeyInView: function (event) {
      var allBreadcrumbElements;

      switch (event.keyCode) {
      case 37:
      case 38:
        // left arrow key
        // up arrow key

        allBreadcrumbElements = this.$(this._breadcrumbSelector);
        if (this.accLastBreadcrumbElementFocused) {
          if (allBreadcrumbElements.length > 1) {
            this.accLastBreadcrumbElementFocused = false;
            this.accNthBreadcrumbElementFocused = allBreadcrumbElements.length - 2;
          }
        } else {
          if (this.accNthBreadcrumbElementFocused > 0) {
            this.accNthBreadcrumbElementFocused--;
          }
        }
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().trigger('focus');

        break;
      case 39:
      case 40:
        // right arrow key
        // down arrow key

        if (!this.accLastBreadcrumbElementFocused) {
          allBreadcrumbElements = this.$(this._breadcrumbSelector);
          if (this.accNthBreadcrumbElementFocused < allBreadcrumbElements.length - 1) {
            this.accNthBreadcrumbElementFocused++;
            this.trigger('changed:focus', this);
            this.currentlyFocusedElement().trigger('focus');
          }
        }
        break;
      }
    },

    synchronizeCollections: function (skipAdjustToFit) {
      var excerpt = this.completeCollection.last(this.completeCollection.length) || [];
      if (this.stop && this.stop.id) {
        this._removeAncestorsFromStopPoint(excerpt, this.stop.id);
      }
      this._removeAncestorsToNumItemsToShow(excerpt);
      this._subCrumbsLength = 0;
      this._refreshBreadCrumbsDisplay();
      // execute _adjustToFit if and only if the parent has added all breadcrumbs elements to DOM.
      if (typeof skipAdjustToFit === 'boolean') {
        if (!skipAdjustToFit) {
          this._adjustToFit();
        }
      } else {
        this._adjustToFit();
      }
      this.trigger('after:synchronized');
    },

    _refreshBreadCrumbsDisplay: function () {
      var subCrumbs,
          subCrumbsMenu,
          displayArr = this.completeCollection.last(this.completeCollection.length) || [];
      if (this.stop && this.stop.id) {
        this._removeAncestorsFromStopPoint(displayArr, this.stop.id);
      }
      this._removeAncestorsToNumItemsToShow(displayArr);
      if (this._subCrumbsLength > 0) {
        subCrumbs = _.range(this._startSubCrumbs, this._startSubCrumbs + this._subCrumbsLength).map(
            function (rangeVal) {
              return displayArr[rangeVal];
            }
        );
        subCrumbsMenu = {
          id: -1,
          name: '...',
          subcrumbs: subCrumbs
        };
        displayArr.splice(this._startSubCrumbs, this._subCrumbsLength, subCrumbsMenu);
      }

      this.collection.reset(displayArr);
    },

    refresh: function () {
      this._adjustToFit();
    },

    _adjustToFit: function () {
      var maxDisplayWidth = this._getMaxDisplayWidth(),
          eleWidth        = this._getDisplayWidth();
      if (eleWidth > maxDisplayWidth) {
        this._shrinkToFit(maxDisplayWidth);
      } else if (this._getDisplayWidth() < maxDisplayWidth) {
        this._expandToFit(maxDisplayWidth);
      }
      var tabEvent = $.Event('tab:content:field:changed');
      this.trigger(tabEvent);
    },

    _shrinkToFit: function (maxDisplayWidth) {
      var shrinkableItems = this.collection.length - this._startSubCrumbs - 2;
      if (maxDisplayWidth > 0) {
        if (this._getDisplayWidth() > maxDisplayWidth && (shrinkableItems > 0 ||
                                                          shrinkableItems === 0 &&
                                                          window.devicePixelRatio === 2 &&
                                                          this._subCrumbsLength === 0)) {
          this._adjustSubCrumbsLengthBy(1);
          this._shrinkToFit(maxDisplayWidth);
        }
      }
    },

    _expandToFit: function (maxDisplayWidth) {
      var shrinkableItems = this.collection.size() - this._startSubCrumbs - 2;
      if (maxDisplayWidth > 0) {
        if (this._subCrumbsLength > 0 && this._getDisplayWidth() < maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(-1);
          this._expandToFit(maxDisplayWidth);
        } else if (shrinkableItems > 0 && this._getDisplayWidth() > maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(1);
        }
      }
    },

    _adjustSubCrumbsLengthBy: function (amt) {
      this._subCrumbsLength += amt;
      this._subCrumbsLength = Math.min(this._subCrumbsLength,
          this.completeCollection.size() - this._startSubCrumbs);
      this._refreshBreadCrumbsDisplay();
    },

    _getMaxDisplayWidth: function () {
      return (this.el.offsetWidth * 0.9);
    },

    _getDisplayWidth: function () {
      var childs       = this.el.children,
          displayWidth = 0;
      for (var i = 0; i < childs.length; i++) {
        displayWidth += childs[i].offsetWidth;
      }
      return displayWidth;
    },

    childEvents: {
      'click:ancestor': 'onClickAncestor'
    },

    onClickAncestor: function (model, node) {
      var args = {node: node};
      this.trigger('before:defaultAction', args);
      if (!args.cancel) {
        var nodeId = node.get('id');
        if (this._nextNode.get('id') === nodeId) {
          // when id is same as nextNode's id, nextNode.set(id) event is not triggered
          this._nextNode.unset('id', {silent: true});
        }

        var viewStateModel = this.context && this.context.viewStateModel;
        var viewState = viewStateModel && viewStateModel.get('state');
        if (viewState) {
          this.context.viewStateModel.set('state', _.omit(viewState, 'filter'), {silent: true});
        }

        // The nodestable uses this event to remove the order_by from the viewStateModel
        this._nextNode.trigger('before:change:id', nodeId);
        viewStateModel && viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.breadcrumbs);
        this._nextNode.set('id', nodeId);
      }

      this.$el.trigger('setCurrentTabFocus');
    },

    hide: function (hideBreadcrumb) {
      if (hideBreadcrumb) {
        this.el.classList.add('binf-hidden');
      } else {
        this.el.classList.remove('binf-hidden');
      }
      return true;
    },

    hideSubCrumbs: function () {
      var $subCrumb = this.$el.find('li.binf-dropdown');
      if ($subCrumb && $subCrumb.hasClass('binf-open')) {
        this.$el.find('.csui-subcrumb').trigger('click');
      }
    },

    updateStopId: function (newId) {
      this.stop.id = newId;
    },

    _removeAncestorsFromStopPoint: function (collection, stopId) {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].get('id') === stopId) {
          collection.splice(0, i);
          break;
        }
      }
    },

    _removeAncestorsToNumItemsToShow: function (collection) {
      if (this.options.noOfItemsToShow && this.options.noOfItemsToShow >= 0) {
        var limit = (this.options.noOfItemsToShow >= collection.length) ? 0 :
                    collection.length - this.options.noOfItemsToShow;
        collection.splice(0, limit);
      }
    },

    onBeforeDestroy: function () {
      $(window).off('resize.' + this.cid, this._onWindowResize);
    }

  });

  return BreadCrumbCollectionView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-row\">\r\n  <div class=\"binf-item binf-col-xs-12\">\r\n    <div class=\"breadcrumb-inner breadcrumb-inner-header\" role=\"navigation\"\r\n         aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.breadcrumbAria || (depth0 != null ? depth0.breadcrumbAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"breadcrumbAria","hash":{}}) : helper)))
    + "\"></div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_breadcrumbspanel_impl_breadcrumbspanel', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',[],function(){});
csui.define('csui/controls/breadcrumbspanel/breadcrumbspanel.view',['csui/lib/marionette', 'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'hbs!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang',
  'css!csui/controls/breadcrumbspanel/impl/breadcrumbspanel'
], function (Marionette, AncestorCollectionFactory, ApplicationScopeModelFactory, BreadcrumbsView,
    BreadcrumbsPanelTemplate, lang) {
  'use strict';

  var BreadcrumbsPanelView = Marionette.LayoutView.extend({

    attributes: {id: 'breadcrumb-wrap'},

    className: 'binf-container-fluid',

    template: BreadcrumbsPanelTemplate,

    ui: {
      tileBreadcrumb: '.tile-breadcrumb',
      breadcrumbsWrap: '#breadcrumb-wrap'
    },

    regions: {
      breadcrumbsInner: '.breadcrumb-inner'
    },

    templateHelpers: function () {
      return {
        breadcrumbAria: lang.breadcrumbAria
      };
    },

    constructor: function BreadcrumbsPanelView(options) {

      Marionette.LayoutView.apply(this, arguments);

      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:breadcrumbsVisible',
          this._showOrHideBreadcrumbs);

      this.ancestors = this.options.context.getCollection(AncestorCollectionFactory);

      this.listenTo(this, 'dom:refresh', function () {
        if (this.breadcrumbs) {
          this.breadcrumbs.refresh(); // calls _adjustToFit
        }
      });
    },

    onRender: function () {
      this._showOrHideBreadcrumbs();
    },

    _showOrHideBreadcrumbs: function () {
      this._breadcrumbsVisible = this.applicationScope.get('breadcrumbsVisible');
      this._breadcrumbsAvailable = this.ancestors.isFetchable();
      if (this._breadcrumbsVisible && this._breadcrumbsAvailable) {
        if (!this.breadcrumbs) {
          this.breadcrumbs = new BreadcrumbsView({
            context: this.options.context,
            collection: this.ancestors,
            fetchOnCollectionUpdate: false
          });
          this.breadcrumbsInner.show(this.breadcrumbs);
          this.breadcrumbs.synchronizeCollections();
          this.$el.addClass('breadcrumb-wrap-visible');
          this.triggerMethod("tabable", this);
          this.breadcrumbs.triggerMethod("refresh:tabindexes");
        }
      } else {
        if (this.breadcrumbs) {
          this.$el.removeClass('breadcrumb-wrap-visible');
          this.breadcrumbsInner.empty();
          delete this.breadcrumbs;
        }
      }
    },

    hideBreadcrumbs: function () {
      if (this.breadcrumbs) {
        this.breadcrumbs.hideSubCrumbs();
      }
      this.$el.removeClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable:not", this);
      // the tabable region reacts to the isVisible state, so we use an explicit hide to prevent it from still being tabable
      this.$el.hide();
    },

    showBreadcrumbs: function () {
      this.$el.addClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable", this);
      this.$el.show();
      this.breadcrumbs && this.breadcrumbs.triggerMethod("refresh:tabindexes");
    },

    isTabable: function () {
      if (this.breadcrumbs) {
        return this.ancestors.size() > 1;
      } else {
        return false;
      }
    }

  });

  return BreadcrumbsPanelView;
});

csui.define('csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',['csui/lib/underscore', 'csui/lib/marionette'
], function (_, Marionette) {
  'use strict';

  var LayoutViewEventsPropagationMixin = {

    propagateEventsToRegions: function () {
      _.each(this._eventsToPropagateToRegions,
          _.bind(this._propagateEventToRegions, this));
    },

    _propagateEventToRegions: function (name) {
      //console.log('Propagating', name,
      //    'within', Object.getPrototypeOf(this).constructor.name);
      this.listenTo(this, name, function () {
        var regions;
        if (this.regionManager) {
          regions = this.regionManager.getRegions();
        } else {
          regions = this.getRegions();
        }

        _.each(regions, function (region) {
          var view = region.currentView;
          // Check if the region contains a view, if the view has already
          // triggered render and show events and if the view element has
          // been added to the document.
          if (view && (view._isShown || view._isAttached) && view._isRendered &&
              Marionette.isNodeAttached(view.el)) {
            //console.log('Triggering', name,
            //    'from', Object.getPrototypeOf(this).constructor.name,
            //    'to', Object.getPrototypeOf(region.currentView).constructor.name);
            var parameters = Array.prototype.slice.call(arguments);
            parameters.unshift(region.currentView, name);
            Marionette.triggerMethodOn.apply(Marionette, parameters);
          }
        }, this);
      });
    },

    _eventsToPropagateToRegions: ['dom:refresh']

  };

  return LayoutViewEventsPropagationMixin;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/perspective.panel/impl/perspective.with.breadcrumb',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-perspective-breadcrumb\"></div>\r\n<div class=\"csui-perspective-view\"></div>";
}});
Handlebars.registerPartial('csui_controls_perspective.panel_impl_perspective.with.breadcrumb', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/perspective.panel/impl/perspective.with.breadcrumb.view',[
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/namedlocalstorage',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/controls/breadcrumbspanel/breadcrumbspanel.view',
  'csui/utils/contexts/factories/ancestors',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'hbs!csui/controls/perspective.panel/impl/perspective.with.breadcrumb'
], function (_, Marionette,
    NamedLocalStorage,
    UserModelFactory,
    ApplicationScopeModelFactory,
    BreadcrumbsPanelView,
    AncestorCollectionFactory,
    LayoutViewEventsPropagationMixin,
    template) {
  'use strict';

  var PerspectiveWithBreadcrumbView = Marionette.LayoutView.extend({
    className: 'cs-perspective-with-breadcrumb-view',

    template: template,

    regions: {
      breadcrumbRegion: '.csui-perspective-breadcrumb',
      perspectiveRegion: '.csui-perspective-view'
    },

    constructor: function PerspectiveWithBreadcrumbView(options) {
      options || (options = {});
      this.perspectiveView = options.perspectiveView;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.propagateEventsToRegions(); // propagate dom:refresh to child views

      // "proxy" some attributes/functions from the perspectiveView to this wrapper view
      this._supportMaximizeWidget = this.perspectiveView._supportMaximizeWidget;
      this._supportMaximizeWidgetOnDisplay = this.perspectiveView._supportMaximizeWidgetOnDisplay;
      if (_.isFunction(this.perspectiveView.serializePerspective)) {
        this.serializePerspective = function (perspectiveModel) {
          return this.perspectiveView.serializePerspective.apply(
              this.perspectiveView, arguments);
        };
      }
      this.widgetsResolved = this.perspectiveView.widgetsResolved;

      var perspectiveType = this.options.context.perspective.get('type');
      var perspectiveMarginClass;

      switch (perspectiveType) {
      case 'left-center-right':
        perspectiveMarginClass = 'cs_perspective_no_left_right_margin';
        break;
      default:
        perspectiveMarginClass = 'cs_perspective_with_left_right_margin';
      }

      this.$el.addClass(perspectiveMarginClass);

      this.user = this.options.context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change', this.updateUserPreferences);
      this.applicationScope = this.options.context.getModel(ApplicationScopeModelFactory);

      this.listenTo(this.applicationScope, 'change:breadcrumbsVisible',
          this._showOrHideBreadcrumbs);
    },

    onRender: function () {
      var ancestors = this.options.context.getCollection(AncestorCollectionFactory);
      var breadcrumbsAvailable = ancestors.isFetchable();

      // inform the whole application that there are no breadcrumbs available
      this.applicationScope.set('breadcrumbsAvailable', breadcrumbsAvailable);

      // only if breadcrumbs are available, render and show the breadcrumbs
      if (breadcrumbsAvailable) {
        var breadcrumbsPanel = new BreadcrumbsPanelView({
          context: this.options.context
        });
        this.breadcrumbRegion.show(breadcrumbsPanel);
      }

      this.perspectiveRegion.show(this.perspectiveView);
    },

    onDomRefresh: function () {
      this.updateUserPreferences();
    },

    updateUserPreferences: function () {
      var userId = this.user.get('id');
      this.userPreferences = userId ? new NamedLocalStorage(
          'userPreferences:' + userId) : undefined;
      if (this._isRendered && this.userPreferences) {
        var prefVisible = this.userPreferences.get('breadcrumbs-visible');
        if (prefVisible === undefined) {
          prefVisible = true;
        }
        this._setBreadcrumbsVisibility(prefVisible);
      } else {
        this._setBreadcrumbsVisibility(false);
      }
    },

    _showOrHideBreadcrumbs: function (args1, args2) {
      var breadcrumbsVisible = this.applicationScope.get('breadcrumbsVisible');
      this._setBreadcrumbsVisibility(breadcrumbsVisible);
    },

    _setBreadcrumbsVisibility: function (visible) {
      var breadcrumbsAvailable = this.applicationScope.get('breadcrumbsAvailable');
      if (visible && breadcrumbsAvailable) {
        this.$el.addClass('csui-breadcrumbs-visible');
        this.perspectiveView.$el.addClass('csui-breadcrumbs-visible');
      } else {
        this.$el.removeClass('csui-breadcrumbs-visible');
        this.perspectiveView.$el.removeClass('csui-breadcrumbs-visible');
      }
      if (this.userPreferences) {
        this.userPreferences.set('breadcrumbs-visible', visible);
      }
      this.applicationScope.set('breadcrumbsVisible', visible);
    }
  });

  _.extend(PerspectiveWithBreadcrumbView.prototype, LayoutViewEventsPropagationMixin);

  return PerspectiveWithBreadcrumbView;
});

csui.define('csui/controls/perspective.panel/perspective.with.breadcrumb.factory',['require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/perspective.panel/perspective.factory',
  'csui/controls/perspective.panel/impl/perspective.with.breadcrumb.view'
], function (require, _, $, PerspectiveFactory, PerspectiveWithBreadcrumbView) {

  var PerspectiveWithBreadcrumbFactory = PerspectiveFactory.extend({

    constructor: function PerspectiveWithBreadcrumbFactory(options) {
      PerspectiveWithBreadcrumbFactory.__super__.constructor.apply(this, arguments);
      this.options = options || {};
    },

    createPerspective: function (model) {
      var self = this;
      return PerspectiveFactory.prototype.createPerspective.call(this, model)
          .then(function (perspectiveView) {

            return new PerspectiveWithBreadcrumbView({
              context: self.options.context,
              perspectiveView: perspectiveView,
              supportMaximizeWidget: perspectiveView._supportMaximizeWidget
            });
          });
    }

  });

  return PerspectiveWithBreadcrumbFactory;
});


csui.define('css!csui/controls/perspective.panel/impl/perspective.panel',[],function(){});
csui.define('csui/controls/perspective.panel/perspective.panel.view',['require', 'module', 'csui/lib/jquery',
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/perspective.panel/perspective.with.breadcrumb.factory',
  'csui/controls/progressblocker/blocker',
  'csui/utils/commandhelper',
  'csui/controls/perspective.panel/perspective.animator',
  'css!csui/controls/perspective.panel/impl/perspective.panel',
  'csui/lib/jquery.redraw', 'csui/lib/jquery.scrollbarwidth'
], function (require, module, $, _, Marionette, base, PerspectiveWithBreadcrumbFactory,
    BlockingView, CommandHelper, PerspectiveAnimator) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    progressWheel: true,
    waitForData: true,
    // May improve smoothness of animation, if some widgets render asynchronously
    perspectiveShowDelay: 0,
    limitTimeToWaitForData: true,
    maximumTimeToWaitForData: 1000,
    detachableBlockingView: true
  });

  if (!config.waitForData) {
    config.perspectiveShowDelay = 0;
  }

  var pageUnloading = false;
  $(window).on('beforeunload.' + module.id, function (event) {
    pageUnloading = true;
  });

  var PerspectivePanelView = Marionette.ItemView.extend({
    className: 'cs-perspective-panel',

    template: false,

    constructor: function PerspectivePanelView() {
      Marionette.View.prototype.constructor.apply(this, arguments);
      _.defaults(this.options, {
        progressWheel: config.progressWheel,
        waitForData: config.waitForData,
        perspectiveShowDelay: config.perspectiveShowDelay,
        limitTimeToWaitForData: config.limitTimeToWaitForData,
        maximumTimeToWaitForData: config.maximumTimeToWaitForData,
        detachableBlockingView: config.detachableBlockingView
      });
      var context = this.options.context;
      this.perspectiveFactory = this.options.perspectiveFactory ||
                                new PerspectiveWithBreadcrumbFactory({
                                  context: context
                                });
      this.perspectiveAnimator = new PerspectiveAnimator(this);
      BlockingView.imbue(this);
      this.blockingView.makeGlobal(this.options.detachableBlockingView);

      this.listenTo(context, "maximize:widget", this._addMaximizedWidget);
      this.listenTo(context, "restore:widget:size", this._removeMaximizedWidget);

      this.listenTo(context, 'change:perspective', this.onChangePerspective);

      this.listenTo(context, 'enter:edit:perspective', this.onEnterEditPerspective);
      this.listenTo(context, 'exit:edit:perspective', this.onExitEditPerspective);
      this.listenTo(context, 'serialize:perspective', this.onSerializePerspective);

      // Context change start with requesting the perspective and then
      // either by changing it and rebuilding the context, or just by re-fetching
      // the context, of the perspective does not change.  Use the
      // perspective request for blocking and context sync, which comes always
      // at last, for unblocking.
      if (this.options.progressWheel) {
        var fetchTimeout;
        this
            // Perspective is fetched at the beginning of navigation. It may
            // happen twice, if the perspective target is overridden. It may
            // not happen at all, if the perspective is fixed on the client.
            .listenTo(context, 'request:perspective', this._startPerspectiveLoading)
            .listenTo(context, 'error:perspective', this._finishPerspectiveLoading)
            // Data is fetched after the perspective has been fetched or become
            // known to the client. It can also be fetched without loading a
            // new perspective; the perspective can be reused.
            .listenTo(context, 'request', function () {
              // Do not block the perspective panel if the perspective will
              // be shown right away without waiting for the data.
              if (this.options.waitForData) {
                this._startPerspectiveLoading();
              }
              // If the data were not loaded quickly enough, unblock the
              // perspective panel and let the user start with ready widgets.
              if (this.options.limitTimeToWaitForData) {
                fetchTimeout = setTimeout(function () {
                  fetchTimeout = undefined;
                  this._finishPerspectiveLoading();
                }.bind(this), this.options.maximumTimeToWaitForData);
              }
            })
            .listenTo(context, 'sync error', function () {
              if (fetchTimeout) {
                clearTimeout(fetchTimeout);
                fetchTimeout = undefined;
              }
              this._finishPerspectiveLoading();
            });
      }
      this.listenTo(this, 'render', this.onRendered);

      this._maximizedWidgets = {};
      this._currentPespectiveStack = [];
      this._currentPerspectiveSignature = undefined;
    },

    _startPerspectiveLoading: function () {
      // If actions were blocked when "request:perspective" was caught,
      // do not do it again when another "request:perspective" was caught, or
      // when eventually "request" was caught. Blocking view were disabled and
      // enabled in a short time, which would cause its flickering on the page.
      if (!this.actionsBlocked) {
        this.actionsBlocked = true;
        this.blockActions();
      }
    },

    _finishPerspectiveLoading: function () {
      // This method mey be called twice if the perspective showing handler
      // timed out and the perspective was shown before the data were loaded.
      if (this.actionsBlocked) {
        this.actionsBlocked = false;
        this.unblockActions();
      }
    },

    onEnterEditPerspective: function (perspectiveToEdit) {
      this.blockActions();
      this.isSwitchingEditMode = true; // To bypass animation
      this.doChangePerspective(perspectiveToEdit)
          .always(function () {
            this.isSwitchingEditMode = false;
            this.unblockActions();
            this.options.context.trigger('finish:enter:edit:perspective');
          }.bind(this));
    },

    /**
     * Serialize perspective configuration and Trigger back to save perspective
     */
    onSerializePerspective: function (perspectiveModel) {
      this.blockActions();
      if (_.isFunction(this.currentPerspectiveView.serializePerspective)) {
        var self = this;
        this.currentPerspectiveView.serializePerspective(perspectiveModel)
            .done(function (perspective) {
              self.options.context.trigger('save:perspective', perspective);
            })
            .fail(function (error) {
              self.options.context.trigger('save:perspective', {error: error});
              self._showModalError({message: error});
            })
            .always(function () {
              self.unblockActions();
            });
      }
    },

    onExitEditPerspective: function (perspectiveToEdit) {
      this.blockActions();
      this.isSwitchingEditMode = true; // To bypass animation
      this.doChangePerspective(this.options.context.perspective)
          .always(function () {
            this.isSwitchingEditMode = false;
            this.unblockActions();
            this.options.context.trigger('finish:exit:edit:perspective');
          }.bind(this));
    },

    onRendered: function () {
      //Check if the perspective model is populated when the view rendered
      // for he first time. If it is, load the perspective and show it.
      if (this.options.context.perspective.get('type')) {
        this.onChangePerspective();
      }
    },

    onChangePerspective: function (targetPerspective, sourceModel) {
      this.doChangePerspective(targetPerspective, sourceModel);
    },

    doChangePerspective: function (targetPerspective, sourceModel) {
      if (this._isRendered) {
        var context     = this.options.context,
            self        = this,
            perspective = targetPerspective || this.options.context.perspective,
            deferred    = $.Deferred();
        // If we caught unload event earlier and now we change to another
        // perspective, let's assume, that page unloading was cancelled
        pageUnloading = false;
        // Actions will be unblocked in _swapPerspective to cover loading
        // of perspective view and widgets and their initial rendering.
        if (this.options.progressWheel) {
          this.blockActions();
        }
        this.triggerMethod('before:create:perspective', this, {
          perspective: perspective
        });
        this.perspectiveFactory.createPerspective(perspective)
            .done(function (perspectiveView) {
              self.triggerMethod('create:perspective', this, {
                perspective: perspective,
                perspectiveView: perspectiveView
              });
              self._currentPespectiveStack.push(perspectiveView);
              perspectiveView.widgetsResolved.always(function (res) {
                self.triggerMethod('resolve:widgets', this, {
                  perspective: perspective,
                  perspectiveView: perspectiveView
                });
                context.clear();
                // Prevent failed widgets to be slided to the perspective
                if (!pageUnloading) {
                  var enableMaximizeButton = res.length > 1;
                  self._setSupportMaximizeWidget(perspectiveView, perspective,
                      enableMaximizeButton);
                  self._swapPerspective(perspectiveView, perspective, sourceModel)
                      .always(function () {
                        deferred.resolve(perspectiveView);
                      });
                } else {
                  deferred.resolve(perspectiveView);
                }
                self._currentPespectiveStack.splice(0,
                    self._currentPespectiveStack.indexOf(perspectiveView));
              });
              self._currentPespectiveStack.splice(0,
                  self._currentPespectiveStack.indexOf(perspectiveView));
            })
            .fail(function (error) {
              if (self.options.progressWheel) {
                self.unblockActions();
              }
              // Prevent error box about perspective failure showing up
              if (!pageUnloading) {
                self._showError(error);
              }
              deferred.reject(error);
            });
        return deferred.promise();
      }
      return $.Deferred().resolve().promise();
    },

    _isInPerspectiveEditMode: function (perspective) {
      var perspectiveOptions = perspective && perspective.get('options') ?
                               perspective.get('options') : {};
      return perspectiveOptions.perspectiveMode === 'edit';
    },

    _setSupportMaximizeWidget: function (perspectiveView, perspective, enableMaximizeButton) {
      if (this._isInPerspectiveEditMode(perspective) ||  // Maximize not allowed in Edit Perspective
          // mode
          perspectiveView._supportMaximizeWidget !== true || !enableMaximizeButton) {
        $("body").removeClass("csui-support-maximize-widget");
      } else {
        $("body").addClass("csui-support-maximize-widget");
      }
    },

    _triggerDomRefreshOnCurrentPerspective: function () {
      if (this.currentPerspectiveView) {
        this.currentPerspectiveView.triggerMethod('dom:refresh');
      }
    },

    _setShowingMaximizedWidget: function (showingMaximizedWidget) {
      if (showingMaximizedWidget) {
        $("body").addClass("csui-maximized-widget-mode");
      } else {
        $("body").removeClass("csui-maximized-widget-mode");
      }
    },

    _addMaximizedWidget: function (ev) {
      if (this._isInPerspectiveEditMode(this.currentPerspective)) {
        // Maximize not allowed in Edit Perspective mode
        return;
      }
      if (this._maximizedWidgets[this._getCurrentPerspectiveSignature()] === undefined) {
        var maximizedWidgetInfo = {
          perspectiveSignature: this._getCurrentPerspectiveSignature(),
          cellAddress: this.getCellAddress(ev)
        };
        this._maximizedWidgets[maximizedWidgetInfo.perspectiveSignature] = maximizedWidgetInfo;
        this._maximizeWidgetView(maximizedWidgetInfo.cellAddress);
      }
      this._triggerDomRefreshOnCurrentPerspective();
    },

    getCellAddress: function (ev) {
      return (ev.widgetView ? ev.widgetView.$el.parent().attr("data-csui-cell_address") :
              ev.currentPerspectiveView.$el.find(".binf-row").children().attr(
                  "data-csui-cell_address"));
    },

    _removeMaximizedWidget: function (ev) {
      delete this._maximizedWidgets[this._getCurrentPerspectiveSignature()];
      this._restoreWidgetViewSize(ev.widgetView);
    },

    _getPerspectiveViewEl: function () {
      var perspectiveViewEl;
      if (this.currentPerspectiveView.$el.hasClass('csui-perspective-view')) {
        perspectiveViewEl = this.currentPerspectiveView.$el;
      } else {
        perspectiveViewEl = this.currentPerspectiveView.$el.find('.csui-perspective-view');
      }
      return perspectiveViewEl;
    },

    _maximizeWidgetView: function (cellAddress) {
      var perspectiveViewEl = this._getPerspectiveViewEl();
      perspectiveViewEl.find(".binf-row > div").each(function () {
        $(this).attr("data-csui-mwv-old-class", $(this).attr("class"));
        if ($(this).attr("data-csui-cell_address") === cellAddress) {
          $(this).parent().addClass("csui-maximized-row");
          $(this).attr("class", "binf-col-xs-12 csui-maximized-column");
        } else {
          $(this).attr("class", "binf-hidden-xs binf-hidden-sm binf-hidden-md binf-hidden-lg");
        }
      });

      this._setShowingMaximizedWidget(true);
    },

    _restoreWidgetViewSize: function (widgetView) {
      var $widgetRow = widgetView.$el.parent().parent();

      $widgetRow.removeClass("csui-maximized-row");
      var perspectiveViewEl = this._getPerspectiveViewEl();
      perspectiveViewEl.find(".binf-row > div").each(function () {
        $(this).attr("class", $(this).attr("data-csui-mwv-old-class"));
      });

      this._setShowingMaximizedWidget(false);
      this._triggerDomRefreshOnCurrentPerspective();
    },

    _getCurrentPerspectiveSignature: function () {
      if (this._currentPerspectiveSignature === undefined) {
        var cellSignatures = [];
        !!this.currentPerspectiveView &&
        this.currentPerspectiveView.$el.find(".binf-row > div").each(function () {
          var address = $(this).attr("data-csui-cell_address");
          var widgetType = $(this).attr("data-csui-widget_type");
          var classNames = $(this).attr("class");

          if (address === undefined) {
            address = "";
          }

          cellSignatures.push([address, widgetType, classNames].join(","));
        });

        this._currentPerspectiveSignature = cellSignatures.join("|");
      }

      return this._currentPerspectiveSignature;
    },

    _resetWidgetMaximization: function () {
      this._setShowingMaximizedWidget(false);
      this._maximizedWidgets = {};
    },

    _swapPerspective: function (perspectiveView, perspective, sourceModel) {
      var deferred = $.Deferred();
      var self = this;
      var showTimeout;
      var perspectiveShown;

      var scopeId = window.location.href;
      scopeId = scopeId.substr(scopeId.indexOf('#'));

      function showPerspective() {
        if (showTimeout) {
          clearTimeout(showTimeout);
        }
        // If the perspective-loading timeout called this callback, the
        // context fetch will follow, once its models have all been done.
        if (perspectiveShown) {
          return;
        }
        perspectiveShown = true;
        // Generic waiting until the widgets and other components
        // re-render their contents after they received fresh data
        // would be complicated.
        _.delay(function () {
          // Prevent widgets showing errors to be slided to the perspective
          if (!pageUnloading) {
            self._showPerspective(perspectiveView, perspective, deferred);
          }
        }, self.options.perspectiveShowDelay);
      }

      function fetchData() {
        self.options.context
            .fetch()
            .fail(function (error) {
              // Prevent error box about context failure showing up, if the
              // current action has been aborted and other page gets loaded
              if (!pageUnloading) {
                if (window.csui && window.csui.mobile) {
                  // LPAD-59873: (this code is only run in mobile and doesn't affect smart UI) On mobile, we would like to
                  // render the perspective upon error code 500. We do this because we would still like to use the app even
                  // if we don't have access to certain shortcut tile widgets on the home page
                  if (error.statusCode === 500 && (window.location.href.indexOf('#') === -1 ||
                                                   window.location.href.indexOf('#home') !== -1)) {
                    showPerspective();
                    return;
                  } else if (error.statusCode === 0) {
                    CommandHelper.showOfflineMessage(error);
                  } else {
                    self._showModalError(error);
                    self.options.context.trigger('reject:perspective', error);
                  }

                  perspectiveView.destroy();
                } else {
                  showPerspective();
                }
              }
            })
            .done(showPerspective);
      }

      this._resetWidgetMaximization();

      // make rendering of perspective view asynchronous
      // this speeds up fetch of node children in node.perspective.plugin
      setTimeout(function () {
        perspectiveView.render();
        // Actions were blocked in doChangePerspective, where the process
        // of loading the perspective view and widgets has started.
        if (this.options.progressWheel) {
          this.unblockActions();
        }
        if (this.options.waitForData) {
          fetchData();
          if (this.options.limitTimeToWaitForData) {
            showTimeout = setTimeout(showPerspective, this.options.maximumTimeToWaitForData);
          }
        } else {
          var eventName = this.currentPerspectiveView ?
                          'swap:perspective' : 'show:perspective';
          this.once(eventName, fetchData);
          showPerspective();
        }
      }.bind(this));

      return deferred;
    },

    /**
     * Perspective show / transition for enter, exit from edit mode
     */
    _showPerspectiveForEditMode: function (perspectiveView, perspective) {
      this.currentPerspectiveView.destroy();

      this.currentPerspectiveView = perspectiveView;
      this.currentPerspective = perspective;
      this._currentPerspectiveSignature = undefined;

      perspectiveView.triggerMethod('before:show');
      this.$el.append(perspectiveView.el);
      perspectiveView.triggerMethod('show');
    },

    _showPerspective: function (perspectiveView, perspective, deferred) {
      var body = $(document.body),
          self = this;
      var perViewIndex = this._currentPespectiveStack.indexOf(perspectiveView);
      if (perViewIndex === -1) {
        // this perspectiveView is no longer required to show, since perspective(s) after this are displayed.
        return;
      }
      // Invalidate all perspective before current perspective to stop them from displaying.
      this._currentPespectiveStack.splice(0, perViewIndex);

      function finishShowingPerspective(perspectiveView) {
        body.scrollTop(0);
        self.perspectiveAnimator.finishAnimation();
        self.currentPerspectiveView = perspectiveView;
        self.currentPerspectiveView.triggerMethod('dom:refresh');
        self.currentPerspective = perspective;
        deferred.resolve(perspectiveView);
      }

      if (!!this.isSwitchingEditMode) {
        // Switching in / out of Edit mode, no swap animation required.
        this._showPerspectiveForEditMode(perspectiveView, perspective);
        deferred.resolve(perspectiveView);
        return;
      }

      // Setting a fixed size to the perspective panel solves two
      // problems, which cause disturbance in the transition:
      //
      // * Scrollbar appears on the page, when the old perspective is still
      //   visible, if the new perspective is taller than the viewport and
      //   the old one was not.
      //
      // * Safari on on iOS 9 zooms out, when the new perspective is added
      //   to the perspective panel, so that both perspectives can be seen
      //   anz zooms in again, when the old perspective is destroyed.
      // Suppress the scrollbar only if the current perspective
      // did not need it
      this.perspectiveAnimator.startAnimation(perspectiveView);

      if (this.currentPerspectiveView) {
        this.triggerMethod('before:swap:perspective', this, {
          oldPerspectiveView: this.currentPerspectiveView,
          newPerspectiveView: perspectiveView
        });
        this.perspectiveAnimator.swapPerspective(this.currentPerspectiveView, perspectiveView)
            .done(function () {
              var oldPerspectiveView = self.currentPerspectiveView;
              self.currentPerspectiveView.destroy();
              finishShowingPerspective(perspectiveView);
              self.triggerMethod('swap:perspective', self, {
                oldPerspectiveView: oldPerspectiveView,
                newPerspectiveView: perspectiveView
              });
            });
      } else {
        this.triggerMethod('before:show:perspective', this, {
          newPerspectiveView: perspectiveView
        });
        this.perspectiveAnimator.showPerspective(perspectiveView)
            .done(function () {
              finishShowingPerspective(perspectiveView);
              self.triggerMethod('show:perspective', self, {
                newPerspectiveView: perspectiveView
              });
            });

      }
    },

    _showError: function (error) {
      csui.require(['csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        GlobalMessage.showMessage('error', error.message);
      });
    },

    _showModalError: function (error, options) {
      csui.require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.message, options);
      });
    }
  });

  return PerspectivePanelView;
});

csui.define('csui/controls/form/pub.sub',['csui/lib/underscore', 'csui/lib/backbone'], function (_, Backbone) {
  'use strict';
  //const PubSub = _.extend({}, Backbone.Events);
  return _.extend({}, Backbone.Events);
});
csui.define('csui/controls/mixins/keyboard.navigation/modal.keyboard.navigation.mixin',['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base'], function (_, $, base) {
  'use strict';

  //
  // Mixin for a modal View to trap keyboard navigation.
  //
  // Note: for completeness, also do the following in your View code
  // - capture the in-focus element before opening your modal view
  // - set focus on the first focusable element after your modal is shown after animation
  // - set focus back to the prior in-focus element after closing your modal view
  //
  var ModalKeyboardNavigationMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {

        _rebuildFocusableElements: function () {
          this.focusableElements = base.findFocusables(this._focusHolder);
        },

        /**
         * Calling this on DOM changes will allow re-building of focusable elements
         */
        refreshFocusEngage: function () {
          this._rebuildFocusableElements();
        },

        /**
         * Maintains the tab focus on the provided element to trap KN
         */
        _maintainTabFocus: function (modalElement) {
          this._focusHolder = modalElement;
          this._rebuildFocusableElements();

          var self = this;
          modalElement.on('keydown', function (e) {
            var currentIndex   = self.focusableElements.index(e.target),
                focusableCount = self.focusableElements.length,
                cancelEvent    = false;
            if (currentIndex === -1) {
              // Unknown element. Element could be created after engage.
              // Calling 'dom:refresh' is recommended on DOM changes 
              return;
            }
            if (e.keyCode === 9) {
              if (!e.shiftKey && currentIndex === focusableCount - 1) {
                // Tab on last focusable element
                self.focusableElements.first().trigger('focus');
                cancelEvent = true;
              } else if (e.shiftKey && currentIndex === 0) {
                // Shift tab on first focusable element
                self.focusableElements.last().trigger('focus');
                cancelEvent = true;
              }
            }
            cancelEvent && e.preventDefault();
            e.stopPropagation();
          });

          this.listenTo(this, 'dom:refresh', function () {
            this.refreshFocusEngage();
          });

          var disengage = function disengage() {
            modalElement.off('keydown');
          };
          return {
            disengage: disengage
          };
        },

        // Params:
        // - modalElement : optional; the modal element. Default is the view's el.
        engageModalKeyboardFocusOnOpen: function (modalElement) {
          this._allyHandles || (this._allyHandles = []);
          modalElement = $(modalElement || this.el);

          // make sure Tab key (also Shift-Tab) controlled focus is trapped within tabsequence
          this._allyHandles.push(this._maintainTabFocus(modalElement));
        },

        disengageModalKeyboardFocusOnClose: function () {
          if (this._allyHandles) {
            while (this._allyHandles.length > 0) {
              // ally handles have a common API method disengage()
              this._allyHandles.pop().disengage();
            }
          }
        },

        hasEngagedModalKeyboardFocus: function () {
          return this._allyHandles && this._allyHandles.length;
        }
      });
    }
  };

  return ModalKeyboardNavigationMixin;
});

/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.links',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<ul class=\"binf-nav "
    + this.escapeExpression(((helper = (helper = helpers.tab_type || (depth0 != null ? depth0.tab_type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tab_type","hash":{}}) : helper)))
    + "\" role=\"tablist\"></ul>\r\n";
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.links', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.link',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.linkId || (depth0 != null ? depth0.linkId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linkId","hash":{}}) : helper)))
    + "\" role=\"tab\" aria-selected=\""
    + this.escapeExpression(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selected","hash":{}}) : helper)))
    + "\" aria-controls=\""
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" data-binf-toggle=\"tab\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "</a>\r\n";
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.link', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/utils/handlebars/l10n',['csui/lib/handlebars', 'csui/utils/base'
], function (Handlebars, base) {

  Handlebars.registerHelper('csui-l10n', function (value) {
    return base.getClosestLocalizedString(value);
  });

  return Handlebars.helpers['csui-l10n'];

});

csui.define('csui/controls/tab.panel/impl/tab.link.view',['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/tab.panel/impl/tab.link',
  'csui/lib/binf/js/binf',
  'csui/utils/handlebars/l10n' // support {{csui-l10n ...}}
], function (_, Marionette, tabLinkTemplate) {
  'use strict';

  var TabLinkView = Marionette.ItemView.extend({

    tagName: 'li',

    className: function () {
      return this._isOptionActiveTab() ? 'binf-active' : '';
    },

    attributes: function () {
      return {
        role: 'presentation'
      };
    },

    template: tabLinkTemplate,

    templateHelpers: function() {
      var uniqueTabId = this.model.get('uniqueTabId');
      return {
        linkId: 'tablink-' + uniqueTabId,
        selected: this._isOptionActiveTab()
      };
    },

    events: {
      'show.binf.tab > a': 'onShowingTab',
      'shown.binf.tab > a': 'onShownTab'
    },

    ui: {
      link: '>a'
    },

    constructor: function TabLinkView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    _isOptionActiveTab: function () {
      var active = false;
      var activeTabIndex = 0;
      if (this.options.activeTab && this.options.activeTab.get('tabIndex') !== undefined) {
        activeTabIndex = this.options.activeTab.get('tabIndex');
      }
      // in case of -1: set to 0; otherwise, Backbone.collection.at would return the last model.
      activeTabIndex = Math.max(0, activeTabIndex);
      this.model === this.model.collection.at(activeTabIndex) && (active = true);
      return active;
    },

    activate: function (setFocus) {
      this.$el.removeClass("binf-active");
      var $a = this.$el.find(">a");
      $a.removeAttr('aria-selected');
      this.ui.link.binf_tab('show');
      setFocus && this.ui.link.trigger('focus');
    },

    isActive: function () {
      return this.$el.hasClass('binf-active');
    },

    onShowingTab: function (event) {
      this.triggerMethod('before:activate:tab', this);
    },

    onShownTab: function (event) {
      var index = this.model.collection.indexOf(this.model);
      this.options.activeTab && this.options.activeTab.set('tabIndex', index);
      this.triggerMethod('activate:tab', this);
    }

  });

  return TabLinkView;

});

csui.define('csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log'
], function (module, _, $, log) {
  'use strict';

  var KeyboardBehaviorMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        // start <integer> : starting index
        // optional reverseDirection <boolean>: true/false
        _findNextFocusableElementIndex: function (start, reverseDirection) {
          var tabElemId = start;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength === 0) {
            return -1;
          }

          if (tabElemId < 0 || tabElemId >= elemsLength) {
            return tabElemId;
          }

          var $currentElem = $(this.keyboardBehavior.tabableElements[tabElemId]);
          while (this.closestTabable($currentElem) === false) {
            tabElemId = reverseDirection === true ? tabElemId - 1 : tabElemId + 1;
            if (tabElemId < 0 || tabElemId >= elemsLength) {
              tabElemId = -1;
              break;
            }
            $currentElem = $(this.keyboardBehavior.tabableElements[tabElemId]);
          }
          return tabElemId;
        },

        // This function has a valid check on top of the _findNextFocusableElementIndex() call.
        // If the element is no longer valid, refresh the tabable element lists.
        _findNextValidFocusableElementIndex: function (start, reverseDirection) {
          var tabElemId = this._findNextFocusableElementIndex (start, reverseDirection);
          /* TODO: revisit this algorithm ...
          if (tabElemId >= 0 && tabElemId < this.keyboardBehavior.tabableElements.length) {
            // does the view contain target element?
            var $elem = $(this.keyboardBehavior.tabableElements[tabElemId]);
            if (this.$el.find($elem).length === 0 && this.keyboardBehavior.refreshTabableElements) {
              this.keyboardBehavior.refreshTabableElements(this);
              tabElemId = this._findNextFocusableElementIndex (start, reverseDirection);
            }
          }
          */
          return tabElemId;
        },

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          var tabElemId;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength === 0) {
            return;
          }
          // first element
          tabElemId = 0;
          tabElemId = this._findNextValidFocusableElementIndex (tabElemId);
          if (tabElemId >= 0 && tabElemId < elemsLength) {
            $(this.keyboardBehavior.tabableElements[tabElemId]).prop('tabindex', '0');
          }
          // last element
          tabElemId = this.keyboardBehavior.tabableElements.length - 1;
          tabElemId = this._findNextValidFocusableElementIndex (tabElemId, true);
          if (tabElemId >= 0 && tabElemId < elemsLength) {
            $(this.keyboardBehavior.tabableElements[tabElemId]).prop('tabindex', '0');
          }
        },

        currentlyFocusedElement: function (event) {
          return this.currentlyFocusedElementInternal(event);
        },

        currentlyFocusedElementInternal: function (event) {
          // log.debug(this.constructor.name + '::currentlyFocusedElement ') && console.log(log.last);

          this._setFirstAndLastFocusable(event);

          var tabElemId = -1;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            var reverseDirection = event && event.shiftKey;
            tabElemId = event.elementCursor || (reverseDirection ? elemsLength - 1 : 0);

            // tab is being activated, return the tab to the global tabable behavior
            if (this.options.tabPanel && this.options.tabPanel.activatingTab) {
              var curPos = this.currentTabPosition;
              if (curPos >= 0 && curPos < elemsLength) {
                tabElemId = curPos;
              }
            }

            // only focus on editable and focusable field
            tabElemId = this._findNextValidFocusableElementIndex (tabElemId, reverseDirection);
          }

          if (tabElemId >= 0 && tabElemId < elemsLength) {
            this.currentTabPosition = tabElemId;
            var $elem = $(this.keyboardBehavior.tabableElements[tabElemId]);
            // tabLink can be invisible, autoScroll until it is visible
            this._autoScrollUntilElemIsVisible && this._autoScrollUntilElemIsVisible($elem);
            return $elem;
          } else {
            return undefined;
          }
        },

        _accSetFocusToPreviousOrNextElement: function (previous) {
          // log.debug(this.constructor.name + '::_accSetFocusToPreviousOrNextElement. previous: ' +
          //           previous) && console.log(log.last);

          var newTabbedElement = -1;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            if (this.currentTabPosition < 0) {
              newTabbedElement = 0;
            } else {
              if (previous) {
                if (this.currentTabPosition > 0) {
                  newTabbedElement = this.currentTabPosition - 1;
                }
              } else {
                if (this.currentTabPosition < elemsLength - 1) {
                  newTabbedElement = this.currentTabPosition + 1;
                }
              }
              // only focus on editable and focusable field
              newTabbedElement = this._findNextValidFocusableElementIndex (newTabbedElement,
                  previous);
            }
          }
          if (newTabbedElement >= 0 && newTabbedElement !== this.currentTabPosition) {
            this.currentTabPosition = newTabbedElement;
            return $(this.keyboardBehavior.tabableElements[newTabbedElement]);
          }
          this.currentTabPosition = -1;
          return undefined;
        },

        containTargetElement: function (event) {
          // does the view contain target element?
          var contain = this.$el.find(event.target).length > 0 ? true : false;
          // try to determine the position accurately
          if (contain) {
            var pos, elem;
            for (pos = 0; pos < this.keyboardBehavior.tabableElements.length; pos++) {
              elem = this.keyboardBehavior.tabableElements[pos];
              // fallback: match the parent container for nested alpaca form field
              if ($(elem).parents('.alpaca-control').find(event.target).length > 0) {
                this.currentTabPosition = pos;
              }
              // accurate case
              // note: FireFox removed isSameNode in some versions
              if (elem.isSameNode && elem.isSameNode(event.target)) {
                this.currentTabPosition = pos;
                break;
              } else if (elem === event.target) {
                this.currentTabPosition = pos;
                break;
              }
            }
          }
          return contain;
        },

        numberOfTabableElements: function (event) {
          return this.keyboardBehavior.tabableElements.length;
        },

        closestTabable: function ($el) {
          var tabable = true;
          var $currentElem = $el;
          // note: for efficiency, only traverse up to 10 ancestors including itself
          var i;
          for (i = 0; i < 10; i++) {
            if ($currentElem &&
                ($currentElem.attr("data-cstabindex") === "-1" || $currentElem.attr("disabled"))) {
              tabable = false;
              break;
            }
            $currentElem = $currentElem.parent();
          }
          return tabable;
        }

      });
    }
  };

  return KeyboardBehaviorMixin;

});

csui.define('csui/controls/tab.panel/behaviors/tab.links.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, base, KeyboardBehaviorMixin) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabLinksKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabLinksKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            // first element
            var $elem = $(this.keyboardBehavior.tabableElements[0]).prop('tabindex', '0');
            // last element: for tabLinks, the last element could be the add button, so search
            // for the last a[href] and set it focusable too
            var lastElemIndex = this.keyboardBehavior.tabableElements.length - 1;
            if ($elem.is('a')) {
              $elem = $(this.keyboardBehavior.tabableElements[lastElemIndex]);
              $elem.prop('tabindex', '0');
              while (!$elem.is('a') && lastElemIndex > 0) {
                lastElemIndex--;
                $elem = $(this.keyboardBehavior.tabableElements[lastElemIndex]);
              }
              $elem.prop('tabindex', '0');
            }
          }
        },

        // Automatically scroll until the tabLink $elem is visible.
        // Note: this function stores a Deferred in $elem.csuiPromise that can be used
        // for ansynchronous check to unset 'skipAutoScroll' and run subsequent code.
        _autoScrollUntilElemIsVisible: function ($elem) {
          var $tabLink = $elem;
          // if $elem is the tablink delete icon, get the sibbling tablink element for scrolling
          if ($tabLink && $tabLink.hasClass('cs-delete-icon')) {
            $tabLink = $elem.parent().parent().find('.cs-tablink');
          }

          if ($tabLink && $tabLink.is('a') && $tabLink.hasClass('cs-tablink')) {
            var tabPanel = this.options && this.options.tabPanel;
            var tabID = $tabLink.attr('href');
            tabID[0] === '#' && (tabID = tabID.substr(1));
            if (tabPanel && tabPanel._isTablinkVisibleInParents($tabLink) === false) {
              var tabIndex = tabPanel._findTabIndexByID ? tabPanel._findTabIndexByID(tabID) : -1;
              if (tabIndex >= 0) {
                var deferred = $.Deferred();
                tabPanel.skipAutoScroll = true;  // unset this after the deferred is done
                $tabLink.csuiPromise = deferred.promise();
                var options = {animationOff: true};
                tabPanel._autoScrollTabTo && tabPanel._autoScrollTabTo(tabIndex, options)
                    .done(function () {
                      tabPanel.skipAutoScroll = false;
                      deferred.resolve();
                    });
              }
            }
          }
        },

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.tabableElements.length === 0) {
            // don't handle keystrokes at all if no elements were found for keyboard navigation
            return ret;
          }

          this.keyboardBehavior.keyboardActionDeleteTabPosition = undefined;
          var self = this;
          var _focusOnTabContent = function (e) {
            var hrefElem = self.keyboardBehavior.tabableElements[self.currentTabPosition];
            var $hrefElem = hrefElem && $(hrefElem);
            if ($hrefElem && $hrefElem.is(":focus")) {
              e.preventDefault();
              e.stopPropagation();
              var tabPanel = self.options && self.options.tabPanel;
              tabPanel && (tabPanel.skipAutoScroll = true);
              if ($hrefElem.hasClass('cs-delete-icon')) {
                // when focus is on the delete icon: move back two positions
                self.keyboardBehavior.keyboardActionDeleteTabPosition = self.currentTabPosition - 2;
              }
              // trigger the click event
              $hrefElem.trigger('click');
              // focus is on tablink (not delete icon): move to the first focusable field
              if (self.keyboardBehavior.keyboardActionDeleteTabPosition === undefined) {
                setTimeout(function () {
                  // let tabContents know to focus on 1st editable field of activating tabContent
                  var href = $hrefElem.attr('href');
                  var focusEvent = $.Event('tab:content:focus', {tabId: href});
                  self.$el.trigger(focusEvent);
                  tabPanel && (tabPanel.skipAutoScroll = false);
                }, 100);
              }
            }
          };

          if (event.keyCode === 9) {  // tab
            // log.debug('TabLinksKeyboardBehavior::onKeyInView ' + view.constructor.name) &&
            // console.log(log.last);

            var leftScroll = event.shiftKey;
            var $elem = this._accSetFocusToPreviousOrNextElement(leftScroll);

            // if the scroll-to element is a tab, auto-scroll for it to be visible
            this._autoScrollUntilElemIsVisible($elem);

            ret = $elem;
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            // space key(32) or enter key(13)
            _focusOnTabContent.call(this, event);
          } else if (event.keyCode === 46) {
            // delete key
            var hrefElem = this.keyboardBehavior.tabableElements[this.currentTabPosition];
            if (hrefElem && $(hrefElem).is(":focus")) {
              event.preventDefault();
              event.stopPropagation();
              // when focus is on the tablink: move back one position
              this.keyboardBehavior.keyboardActionDeleteTabPosition = this.currentTabPosition - 1;

              // let tabLinks know to delete the tab
              var href = $(hrefElem).attr('href');
              var deleteEvent = $.Event('tab:link:delete', {tabId: href});
              this.$el.trigger(deleteEvent);
            }
          }
          return ret;
        }
      });

    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      // tab can be hidden, so don't filter by ':visible'
      this.tabableElements = view.$el.find('a[href], *[tabindex], *[data-cstabindex]');
      // remove elements with data-cstabindex=-1
      var i;
      for (i = this.tabableElements.length - 1; i >= 0; i--) {
        if ($(this.tabableElements[i]).attr('data-cstabindex') === '-1') {
          this.tabableElements.splice(i, 1);
        }
      }

      this.view.currentTabPosition = -1;
      // if delete a tab by keyboard, put focus on the previous tab afterwards
      if (this.keyboardActionDeleteTabPosition !== undefined) {
        var $elem = $(this.tabableElements[this.keyboardActionDeleteTabPosition]);
        if ($elem && $elem.length > 0) {
          this.view.currentTabPosition = this.keyboardActionDeleteTabPosition;
          // if the scroll-to element is a tab, auto-scroll for it to be visible
          this.view._autoScrollUntilElemIsVisible($elem);
          $elem.trigger('focus');
        }
        this.keyboardActionDeleteTabPosition = undefined;
      }

      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);

      // log.debug('TabLinksKeyboardBehavior::refreshTabableElements ' + view.constructor.name +
      //           ': found ' + this.tabableElements.length + ' tabable elements') &&
      // console.log(log.last);
    }

  });

  return TabLinksKeyboardBehavior;

});

// Renders s tab panel made of links and content
csui.define('csui/controls/tab.panel/impl/tab.links.view',['csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/base',
  'hbs!csui/controls/tab.panel/impl/tab.links',
  'csui/controls/tab.panel/impl/tab.link.view',
  'csui/controls/tab.panel/behaviors/tab.links.keyboard.behavior',
  'csui/lib/binf/js/binf'
], function (_, Marionette, base, tabLinksTemplate, TabLinkView,
    TabLinksKeyboardBehavior) {
  'use strict';

  var TabLinkCollectionView = Marionette.CompositeView.extend({

    className: function () {
      var ret = 'tab-links';
      if (this.options.mode === 'spy') {
        ret += ' scrollspy';
      }
      return ret;
    },

    childViewOptions: function (model, index) {
      return _.extend(this.options, {
        index: index,
        activeTab: this.options.activeTab
      });
    },

    template: tabLinksTemplate,
    templateHelpers: function () {
      return {
        tab_type: this.tabType
      };
    },

    childView: TabLinkView,
    childViewContainer: function () {
      return '>.' + this.tabType;
    },

    behaviors: {
      TabLinksKeyboardBehavior: {
        behaviorClass: TabLinksKeyboardBehavior
      }
    },

    constructor: function TabLinkCollectionView(options) {
      this.tabType = options.tabType || 'binf-nav-tabs';
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.options.activeTab, 'change:tabIndex', this._updateActiveTab);
    },

    onChildviewActivateTab: function (childView) {
      // clear the aria-selected on the previous tabLink and set it on the activated tabLink
      this.children.each(function (view) {
        var $link = view.$el.find('a');
        if ($link.attr('aria-selected') !== undefined) {
          $link.attr('aria-selected', 'false');
        }
      });
      childView.$el.find('a').attr('aria-selected', 'true');
    },

    _updateActiveTab: function () {
      var tabIndex = this.options.activeTab.get('tabIndex'),
          linkView = this.children.findByIndex(tabIndex);
      if (linkView) {
        if (tabIndex === linkView._index) {
          if (!linkView.isActive()) {
            linkView.activate();
          }
        }
      } else {
        // Set the currently active tab index to the activeTab model
        // to overwrite the wrong value which sombody set there
        tabIndex = 0;
        this.children.find(function (linkView, index) {
          if (linkView.isActive()) {
            tabIndex = index;
            return true;
          }
        });
        this.options.activeTab.set('tabIndex', tabIndex);
      }
    },

    // Options: {
    //  - levels <integer> : search up to number of levels.  Default: 3.
    //  - percentX <integer> : X visibility percentage.  Default: 100%.
    //  - percentY <integer> : Y visibility percentage.  Default: 100%.
    // }
    _isTablinkVisibleInParents: function ($el, options) {
      var levels = options && options.levels || 3;
      var percentX = options && options.percentX || 100;
      var percentY = options && options.percentY || 100;
      return base.isElementVisibleInParents($el, levels, percentX, percentY);
    },

    // base class method: leave empty!
    deleteTabById: function (tabId) {
      // don't add anything here. The method is meant to be overriden.
      return;
    }

  });

  return TabLinkCollectionView;

});

csui.define('csui/controls/tab.panel/impl/tab.content.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, log, ViewEventsPropagationMixin) {
  'use strict';

  var TabContentView = Marionette.View.extend({

    constructor: function TabContentView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.contentRegion = new Marionette.Region({el: this.el});
      // Tab content creation cannot be delayed if scrollspy is used or if this
      // is tab is active immediately and thus does not get the activation event
      if (!this.options.delayTabContent || this.options.mode === 'spy' ||
          this._isActive()) {
        this._createContent(options);
      } else {
        this.listenTo(this.options.tabPanel, 'before:activate:tab', this._ensureContent);
      }
    },

    className: function () {
      var classes = '';
      if (!this.options.mode) {
        classes = 'binf-tab-pane binf-fade';
        if (this._isActive()) {
          classes += ' binf-in binf-active';
        }
      }
      return classes;
    },

    attributes: function () {
      var uTabId = this.model.get('uniqueTabId');
      if (!uTabId) {
        log.warn('Missing unique tab ID in the TabPanel UI component. Please report.')
        && console.warn(log.last);
      }
      return {
        role: 'tabpanel',
        id: uTabId,
        'aria-labelledby': 'tablink-' + uTabId
      };
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderContent();
      this.triggerMethod('render', this);
      return this;
    },

    onBeforeDestroy: function () {
      this._destroyContent();
    },

    _isActive: function () {
      var activeTabIndex = Math.max(0, this.options.activeTab.get('tabIndex'));
      return this.model === this.model.collection.at(activeTabIndex);
    },

    _ensureContent: function (tabContent, tabPane, tabLink) {
      if (tabPane === this) {
        if (!this.content) {
          this._createContent(this.options);
          if (this._isRendered) {
            this.render();
          }
        }
      }
    },

    _createContent: function (options) {
      var ContentView        = this._getContentView(),
          contentViewOptions = this._getContentViewOptions(),
          fullOptions        = _.extend({
                model: this.model,
                containerCollection: options.containerCollection,
                index: options.index
              },
              contentViewOptions);
      this.content = new ContentView(fullOptions);
      this.propagateEventsToViews(this.content);
    },

    _getContentView: function () {
      var contentView = this.model.get("contentView") ||
                        this.options.tabPanel.getOption('contentView');
      if (contentView && !(contentView.prototype instanceof Backbone.View)) {
        contentView = contentView.call(this.options.tabPanel, this.model);
      }
      if (!contentView) {
        throw new Marionette.Error({
          name: 'NoContentViewError',
          message: 'A "contentView" must be specified'
        });
      }
      return contentView;
    },

    _getContentViewOptions: function () {
      var contentViewOptions = this.options.tabPanel.getOption('contentViewOptions');
      if (_.isFunction(contentViewOptions)) {
        contentViewOptions = contentViewOptions.call(this.options.tabPanel,
            this.model);
      }
      return contentViewOptions;
    },

    _renderContent: function () {
      if (this.content) {
        this.contentRegion.show(this.content);
      }
    },

    _destroyContent: function () {
      if (this.content) {
        this.cancelEventsToViewsPropagation(this.content);
        this.contentRegion.reset();
        this.content = undefined;
      }
    }

  });

  _.extend(TabContentView.prototype, ViewEventsPropagationMixin);

  return TabContentView;

});

csui.define('csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, KeyboardBehaviorMixin) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabContentKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabContentKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        this.alreadyRefreshedTabableElements = false;
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'render', function () {
        // must listen to async render of forms in children, to get all tabable elements
        view.children && view.children.each(function (child) {
          child.content && self.listenTo(child.content, 'render', function () {
            this.alreadyRefreshedTabableElements = false;
            self.refreshTabableElements(view);
          });
        });
        // jQuery event (removed in destroy)
        view.$el.on('tab:content:field:changed', function () {
          this.alreadyRefreshedTabableElements = false;
          if (this.keyboardAction) {
            // triggered by keyboard
            self.refreshTabableElementsAndSetFocus(view);
          } else {
            // triggered by mouse
            self.refreshTabableElements(view);
          }
          this.keyboardAction = false;
        });
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.alreadyRefreshedTabableElements !== true) {
            this.keyboardBehavior.refreshTabableElements(this);
          }
          if (this.keyboardBehavior.tabableElements.length === 0) {
            // don't handle keystrokes at all if no elements were found for keyboard navigation
            return ret;
          }
          var elem, elemsLength, focusPos;
          elemsLength = this.keyboardBehavior.tabableElements.length;
          focusPos = 0;
          if (event.keyCode === 9) {  // tab

            while (focusPos < elemsLength) {
              elem = this.keyboardBehavior.tabableElements[focusPos];
              if (elem && $(elem).is(event.target)) {
                break;
              }
              focusPos++;
            }
            if (focusPos >= 0 && focusPos < elemsLength) {
              this.currentTabPosition = focusPos;
            }

            // event.shiftKey: shift tab -> activate previous region
            ret = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            // space key(32) or enter key(13)
            var $elem = $(this.keyboardBehavior.tabableElements[this.currentTabPosition]);
            if ($elem && $elem.is(':focus') && $elem.hasClass('binf-hidden') === false &&
                $elem.closest('.cs-field-write').length === 0) {
              event.preventDefault();
              event.stopPropagation();
              this.keyboardBehavior.keyboardAction = true;  // triggered by keyboard, not mouse
              // trigger the click event
              $elem.trigger('click');
            }

            while (focusPos < elemsLength) {
              elem = this.keyboardBehavior.tabableElements[focusPos];
              if (elem && $(elem).is(event.target)) {
                break;
              }
              focusPos++;
            }
            var foundFocusable = focusPos >= 0 && focusPos < elemsLength;
            if (foundFocusable) {
              this.currentTabPosition = focusPos;
            }

            $elem = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
            if ($elem !== undefined) {
              $elem.prop("tabindex", "0");
            }

            if (!!event.activeTabContent && !!event.activeTabContent.alpaca &&
                event.activeTabContent.alpaca.data.type === 140 && foundFocusable) {
              var urlelem = this.keyboardBehavior.tabableElements[focusPos];
                  urlelem.click();
            }

          }
          return ret;
        }

      });
    }, // constructor

    onBeforeDestroy: function () {
      this.view.$el.off('tab:content:field:changed');
    },

    refreshTabableElements: function (view) {
      this.tabableElements = view.options.searchTabContentForTabableElements ?
                             view.$el.find(view.options.tabContentAccSelectors).filter(':visible') :
          [];

      // remove elements with data-cstabindex=-1
      var i;
      for (i = this.tabableElements.length - 1; i >= 0; i--) {
        if (view.closestTabable && view.closestTabable($(this.tabableElements[i])) === false) {
          this.tabableElements.splice(i, 1);
        }
      }
      this.view.currentTabPosition = -1;
      this.alreadyRefreshedTabableElements = true;
      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);

      // log.debug('TabContentKeyboardBehavior::refreshTabableElements ' + view.constructor.name +
      //           ': found ' + this.tabableElements.length + ' tabable elements') &&
      // console.log(log.last);
    },

    refreshTabableElementsAndSetFocus: function (view) {
      // after the content is changed, refresh the elements and try best to keep the same focus
      var currentTabPos = this.view.currentTabPosition;
      this.refreshTabableElements(view);
      $(this.tabableElements[currentTabPos]).prop("tabindex", "0");
      $(this.tabableElements[currentTabPos]).trigger('focus');
      this.view.currentTabPosition = currentTabPos;
    },

    updateCurrentTabPosition: function () {
      var i;
      for (i = 0; i < this.tabableElements.length; i++) {
        if ($(this.tabableElements[i]).is(':focus')) {
          this.view.currentTabPosition = i;
          break;
        }
      }
    }

  });

  return TabContentKeyboardBehavior;

});

csui.define('csui/controls/tab.panel/behaviors/tab.contents.proxy.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  // This behavior is a proxy to delegate tab contents keyboard navigation to the child view.

  var TabContentProxyKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabContentProxyKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      _.extend(view, {

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView._setFirstAndLastFocusable) {
            event.activeTabContent.childTabPanelView._setFirstAndLastFocusable(event);
          }
        },

        currentlyFocusedElement: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.currentlyFocusedElement) {
            return event.activeTabContent.childTabPanelView.currentlyFocusedElement(event);
          }
          return undefined;
        },

        _accSetFocusToPreviousOrNextElement: function (previous) {
          if (this.tabPanel && this.tabPanel.activeTabContent &&
              this.tabPanel.activeTabContent.childTabPanelView &&
              this.tabPanel.activeTabContent.childTabPanelView._accSetFocusToPreviousOrNextElement) {
            return this.tabPanel.activeTabContent.childTabPanelView._accSetFocusToPreviousOrNextElement(
                previous);
          }
          return undefined;
        },

        containTargetElement: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.containTargetElement) {
            return event.activeTabContent.childTabPanelView.containTargetElement(event);
          }
          return false;
        },

        onKeyInView: function (event) {
          // let the child view handle the keypress
          if (event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.onKeyInView) {
            return event.activeTabContent.childTabPanelView.onKeyInView(event);
          }
          return undefined;
        },

        numberOfTabableElements: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.numberOfTabableElements) {
            return event.activeTabContent.childTabPanelView.numberOfTabableElements(event);
          }
          return 0;
        }

      });
    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      // log.debug('TabContentProxyKeyboardBehavior::refreshTabableElements ' + view.constructor.name)
      // && console.log(log.last);

      view.tabPanel = tabPanel;
      if (tabPanel && tabPanel.activeTabContent && tabPanel.activeTabContent.childTabPanelView) {
        var childTabPanel = tabPanel.activeTabContent.childTabPanelView;
        childTabPanel.refreshTabableElements && childTabPanel.refreshTabableElements(childTabPanel);
        var e = {activeTabLink: tabPanel.activeTabLink, activeTabContent: tabPanel.activeTabContent};
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }
    }

  });

  return TabContentProxyKeyboardBehavior;

});

csui.define('csui/controls/tab.panel/impl/tab.contents.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tab.panel/impl/tab.content.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',
  'csui/controls/tab.panel/behaviors/tab.contents.proxy.keyboard.behavior',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, TabContentView, ViewEventsPropagationMixin,
    TabContentKeyboardBehavior, TabContentProxyKeyboardBehavior) {
  "use strict";

  var TabContentCollectionView = Marionette.CollectionView.extend({

    className: 'binf-tab-content',

    childView: TabContentView,
    childViewOptions: function (model, index) {
      return _.extend(this.options, {
        index: index,
        activeTab: this.options.activeTab
      });
    },

    // add behaviors here
    behaviors: {},

    defaults: {
      implementTabContentsDefaultKeyboardHandling: true,
      tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                              ' select:not([disabled]), textarea:not([disabled]),' +
                              ' button:not([disabled]), iframe, object, embed,' +
                              ' *[tabindex], *[data-cstabindex], *[contenteditable]'
    },

    constructor: function TabContentCollectionView(options) {
      _.defaults(options, this.defaults);
      if (options.implementTabContentsDefaultKeyboardHandling) {
        this.behaviors = _.extend({
          TabContentKeyboardBehavior: {
            behaviorClass: TabContentKeyboardBehavior
          }
        }, this.behaviors);
      } else if (options.implementTabContentsDefaultKeyboardHandling === false) {
        // in order to use proxy behavior, childTabPanelView must be defined and have keyboard behavior
        this.behaviors = _.extend({
          TabContentProxyKeyboardBehavior: {
            behaviorClass: TabContentProxyKeyboardBehavior
          }
        }, this.behaviors);
      }

      Marionette.CollectionView.prototype.constructor.apply(this, arguments);

      // Only react to child add/remove event after the view is rendered and before destroyed.
      // Otherwise, don't waste time and performance to set the last tab event on every add/remove
      // before the view is fully rendered or when the view is being destroyed.
      this.reactToChildEvent = false;

      this.listenTo(this, 'add:child', this.propagateEventsToViews);
      // FIXME: implement stopListening in ViewEventsPropagationMixin on 'remove:child'
    },

    onBeforeDestroy: function () {
      // Note: during debug find that child views are destroyed before this method is called.
      // Just leave it here for now so other developer can be aware that this is not needed
      // and don't waste time to add it.
      this.reactToChildEvent = false;
    },

    onRender: function () {
      this.reactToChildEvent = true;
      this._setLastTabCssClass();
      if (this.options.mode === 'spy') {
        var targetSelector = '.tab-links.scrollspy';
        // make the ScrollSpy's target selector unique to the particular TabPanel so that ScrollSpy
        // code does not cause scrolling in other TabPanel
        if (this.options && this.options.tabPanel && this.options.tabPanel.$el) {
          var id = this.options.tabPanel.$el.attr('id');
          if (id !== undefined) {
            targetSelector = '#' + id + ' ' + targetSelector;
          }
        }
        this.$el.binf_scrollspy({target: targetSelector});
      }
    },

    onReorder: function () {
      this._setLastTabCssClass();
    },

    onAddChild: function (childView) {
      this._setLastTabCssClass();
    },

    onRemoveChild: function (childView) {
      this._setLastTabCssClass();
    },

    _setLastTabCssClass: function () {
      if (this.reactToChildEvent !== true) {
        return;
      }

      var cssClass = 'last-tab-panel';

      // find and remove the last tab css class
      this.children.each(function (view) {
        if (view.$el.hasClass(cssClass)) {
          view.$el.removeClass(cssClass);
        }
      });

      // add the last tab css class to the last *visible* tab, first tab is not needed
      if (this.children.length > 1) {
        // Use collection to find the last model because the collection is sorted by title (not
        // views collection).
        var lastChildView = this.getLastVisibleChild(this.collection.length - 1);
        lastChildView && lastChildView.$el.addClass(cssClass);
      }
    },

    // recursively find-out the last visible tab content element.
    getLastVisibleChild: function (index) {
      var lastModel = this.collection.at(index);
      if (lastModel) {
        var lastChildView = this.children.findByModel(lastModel);
        if (lastChildView && !lastChildView.$el.hasClass('binf-hidden')) {
          return lastChildView;
        } else {
          return this.getLastVisibleChild(index - 1);
        }
      }
      return;
    },

    getTabContentFirstFocusableELement: function (tabId) {
      var ret;
      if (tabId === undefined || this.options.searchTabContentForTabableElements !== true) {
        return ret;
      }

      // focus on 1st editable field of activating tabContent
      var uTabId = tabId.charAt(0) === '#' ? tabId.slice(1) : tabId;
      var model = this.collection.findWhere({uniqueTabId: uTabId});
      if (model) {
        var tabPane = this.children.findByModel(model);
        var tabContent = tabPane.content;
        var tabElemId = 0;
        var elems = tabContent.$el.find(this.options.tabContentAccSelectors).filter(':visible');
        if (elems.length > 0) {
          var $currentElem = $(elems[tabElemId]);
          while (this.closestTabable && this.closestTabable($currentElem) === false) {
            tabElemId++;
            if (tabElemId >= elems.length) {
              tabElemId = -1;
              break;
            }
            $currentElem = $(elems[tabElemId]);
          }
          if (tabElemId >= 0 && tabElemId < elems.length) {
            ret = $currentElem;
          }
        }
      }
      return ret;
    }

  });

  _.extend(TabContentCollectionView.prototype, ViewEventsPropagationMixin);

  return TabContentCollectionView;

});

csui.define('csui/controls/tab.panel/behaviors/tab.panel.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', "csui/utils/base",
  'csui/lib/marionette'
], function (module, _, $, log, base, Marionette) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabPanelKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabPanelKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      view.currentTabPosition = options.currentTabPosition || 0;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'render', function () {
        self.refreshTabableElements(view);

        // if tab content is rendered later such as with Alpaca form rendering,
        // then watch for this custom event and refresh tabable elements again
        // jQuery event (removed in destroy)
        view.$el.on('tab:content:render', function () {
          self.refreshTabableElements(view);
        });
      });
      this.listenTo(view, 'activate:tab', function (tabContent, tabPane, tabLink) {
        var tabLinkHref = tabLink && tabLink.$el.find('>a')[0];
        if (tabLinkHref) {
          var event = {target: tabLinkHref};
          var tabLinks = this.tabableElements[this.tabLinksIndex];
          if (tabLinks && tabLinks.containTargetElement && tabLinks.containTargetElement(event)) {
            var tabContents = this.tabableElements[this.tabContentIndex];
            if (tabContents && tabContents.options.searchTabContentForTabableElements !== true) {
              var $elem = $(tabLinks.keyboardBehavior.tabableElements[tabLinks.currentTabPosition]);
              // overcome dom:refresh that triggers the global tabable behavior sets focus elsewhere
              setTimeout(_.bind(function () {
                this.view._focusOnElement($elem);
              }, this), 500);
            }
          }
        }
      });

      _.extend(view, {

        // When TabPanelView is not used for form rendering, there is no content rendered event.
        // Thus, check and refresh tabable elements if needed in case the view render event was
        // called before animation is done or the view is still loading, not fully visible.
        _checkAndRefreshTabableElements: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            // only need to check the tabLinks, tabContents can be empty
            var tabLinks = this.keyboardBehavior.tabableElements[this.keyboardBehavior.tabLinksIndex];
            if (tabLinks.numberOfTabableElements && tabLinks.numberOfTabableElements(event) === 0) {
              tabLinks.keyboardBehavior.refreshTabableElements(tabLinks);
            }
          }
        },

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            // first element
            var elem = this.keyboardBehavior.tabableElements[0];
            elem && elem._setFirstAndLastFocusable && elem._setFirstAndLastFocusable(event);
            // last element
            var lastElemIndex = this.keyboardBehavior.tabableElements.length - 1;
            elem = this.keyboardBehavior.tabableElements[lastElemIndex];
            elem && elem._setFirstAndLastFocusable && elem._setFirstAndLastFocusable(event);
          }
        },

        currentlyFocusedElement: function (event) {
          // log.debug('TabPanelKeyboardBehavior::currentlyFocusedElement ' +
          //           this.constructor.name) && console.log(log.last);

          var e = _.extend(
              {activeTabLink: this.activeTabLink, activeTabContent: this.activeTabContent},
              event);

          this._checkAndRefreshTabableElements(e);
          this._setFirstAndLastFocusable(e);

          var $focusElem;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            var curPos = this.currentTabPosition;
            if (curPos < 0 || curPos > elemsLength - 1) {
              curPos = this.currentTabPosition = e.shiftKey ? elemsLength - 1 : 0;
            }
            // on ShiftTab: use last element
            e.shiftKey && (curPos = this.currentTabPosition = elemsLength - 1);
            var elem = this.keyboardBehavior.tabableElements[curPos];
            if (elem.currentlyFocusedElement) {
              $focusElem = elem.currentlyFocusedElement(e);
              if ($focusElem !== undefined) {
                $focusElem.prop("tabindex", "0");
                // The form field at the bottom may not be visitble, and the global TabablesBehavior
                // has a check base.isVisibleInWindowViewport(elToFocus) on line 198 that
                // ignores the region.
                // So as a workaround as usual to the limitation of the weak code elsewhere without
                // touching it, handle it here.  Set the focus on the form field element so that it
                // would scroll into the view and become visible.
                if (this.currentTabPosition === this.tabContentIndex) {
                  self.skipAutoScroll = true;
                  this._focusOnElement($focusElem);
                  self.skipAutoScroll = false;
                }
              }
            }
          }
          return $focusElem;
        },

        accActivateTabableRegion: function (shiftTab) {
          if (shiftTab) {
            this.currentTabPosition = -1;
          }
          var $focusElem = this.currentlyFocusedElement({shiftKey: shiftTab});
          this._focusOnElement($focusElem);
        },

        _focusOnElement: function ($elem) {
          if ($elem && $elem instanceof $) {
            this.tabableRegionBehavior && (this.tabableRegionBehavior.ignoreFocusEvents = true);
            $elem.trigger('focus');
            this.tabableRegionBehavior && (this.tabableRegionBehavior.ignoreFocusEvents = false);
          }
        },

        _moveTo: function (event, $elem) {
          event.preventDefault();
          event.stopPropagation();
          // this.trigger('changed:focus', this);
          var self = this;
          if ($elem.csuiPromise) {
            $elem.csuiPromise.done(function () {
              $elem.prop("tabindex", "0");
              self._focusOnElement($elem);
              setTimeout(function () {
                self.skipAutoScroll = false;
              }, 600);
            });
          } else {
            $elem.prop("tabindex", "0");
            self._focusOnElement($elem);
            setTimeout(function () {
              self.skipAutoScroll = false;
            }, 600);
          }
        },

        onKeyInView: function (event) {
          // handle tab, space, enter, delete only
          if (event.keyCode !== 9 && event.keyCode !== 32 && event.keyCode !== 13 &&
              event.keyCode !== 46) {
            return;
          }

          event.activeTabLink = this.activeTabLink;
          event.activeTabContent = this.activeTabContent;

          var elem, $focusingElem;
          var curPos = this.currentTabPosition;
          var elemsLength = this.keyboardBehavior.tabableElements.length;

          // if the focus is already in the region, find the view containing currently focused element
          var focusPos = 0;
          while (focusPos < elemsLength) {
            elem = this.keyboardBehavior.tabableElements[focusPos];
            if (elem && elem.containTargetElement && elem.containTargetElement(event)) {
              // if the region contains target elememt but has no tabable element, just return and
              // let the global Tabable behavior handle the keypress
              if (elem.numberOfTabableElements() === 0) {
                this.currentTabPosition = -1;
                return;
              }
              break;
            }
            focusPos++;
          }
          if (focusPos >= 0 && focusPos < elemsLength) {
            curPos = this.currentTabPosition = focusPos;
          }

          // let the child view handle the keypress first
          if (curPos >= 0 && curPos < elemsLength) {
            elem = this.keyboardBehavior.tabableElements[curPos];
            if (elem.onKeyInView) {
              // skip autoScroll if the focusing area is TabLink (index = 0)
              curPos === 0 && (this.skipAutoScroll = true);
              $focusingElem = elem.onKeyInView(event);
              if ($focusingElem !== undefined) {
                this._moveTo(event, $focusingElem);
                return;
              }
            }
          }

          // if the child did not handle the keypress
          if (event.keyCode === 9) {  // tab
            if (curPos >= 0 && curPos < elemsLength) {
              // log.debug('TabPanelKeyboardBehavior::onKeyInView ' + this.constructor.name) &&
              // console.log(log.last);

              var newTabbedElement = -1;
              if (event.shiftKey) {  // shift tab -> activate previous region
                if (this.currentTabPosition > 0) {
                  newTabbedElement = this.currentTabPosition - 1;
                }
              } else {
                if (this.currentTabPosition < elemsLength - 1) {
                  newTabbedElement = this.currentTabPosition + 1;
                }
              }

              // check and move to a region with focusable element
              while (newTabbedElement >= 0 && newTabbedElement < elemsLength) {
                elem = this.keyboardBehavior.tabableElements[newTabbedElement];
                if (elem.currentlyFocusedElement) {
                  $focusingElem = elem.currentlyFocusedElement(event);
                  if ($focusingElem !== undefined) {
                    break;
                  }
                }
                // move to the next one to check
                if (event.shiftKey) {  // shift tab -> activate previous region
                  newTabbedElement = newTabbedElement - 1;
                } else {
                  newTabbedElement = newTabbedElement + 1;
                }
              }

              if (newTabbedElement >= 0 && newTabbedElement < elemsLength &&
                  newTabbedElement !== this.currentTabPosition) {
                // skip autoScroll if the focusing area is TabLink
                newTabbedElement === this.tabLinksIndex && (this.skipAutoScroll = true);
                this.currentTabPosition = newTabbedElement;
                this._moveTo(event, $focusingElem);
              } else {
                // FireFox quirky: need to blur
                // for versions,activity tab $(event.target) is not working in IE.
                if (base.isMSBrowser()) {
                  $(event.srcElement).blur();
                } else {
                  $(event.target).blur();
                }
                this.currentTabPosition = -1;
              }
            }
          }
        }
      });

    }, // constructor

    onBeforeDestroy: function () {
      this.view.$el.off('tab:content:render');
    },

    refreshTabableElements: function (view) {
      // log.debug('TabPanelKeyboardBehavior::refreshTabableElements ' + view.constructor.name) &&
      // console.log(log.last);

      view.tabLinks.triggerMethod('refresh:tabable:elements', view);
      view.tabContent.triggerMethod('refresh:tabable:elements', view);

      // tabLinks
      this.tabLinksIndex = 0;
      this.tabableElements[this.tabLinksIndex] = view.tabLinks;

      // tabContentHeader if defined
      this.tabContentHeaderIndex = -1;
      if (view.tabContentHeader) {
        this.tabContentHeaderIndex = 1;
        this.tabableElements[this.tabContentHeaderIndex] = view.tabContentHeader;
      }

      // tabContent
      this.tabContentIndex = view.tabContentHeader ? 2 : 1;
      this.tabableElements[this.tabContentIndex] = view.tabContent;

      this.view.currentTabPosition = -1;
      this.view.triggerMethod("refresh:tabindexes");
    }

  });

  return TabPanelKeyboardBehavior;

});
csui.define('csui/utils/non-emptying.region/non-emptying.region',['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var NonEmptyingRegion = Marionette.Region.extend({

    constructor: function NonEmptyingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {
      if (this.options && this.options.prependChild) {
        this.el.insertBefore(view.el, this.el.childNodes[0]);
      } else if (this.options && this.options.index >= 0) {
        this.el.insertBefore(view.el, this.el.childNodes[this.options.index]);
      } else {
        this.el.appendChild(view.el);
      }
    },

    empty: function (options) {
      var view = this.currentView;
      if (view) {
        view.off('destroy', this.empty, this);
        this.triggerMethod('before:empty', view);
        if (!(options && options.preventDestroy)) {
          this._destroyView();
        }
        this.triggerMethod('empty', view);
        delete this.currentView;
      }
      return this;
    },

    _destroyView: function () {
      var view = this.currentView;
      if (view.isDestroyed === true || view._isDestroyed) {
        return;
      }

      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'before:destroy', view);
      }
      if (view.destroy) {
        view.destroy();
      } else {
        view.remove();
        if (typeof view.isDestroyed === 'function') {
          view._isDestroyed = true;
        } else {
          view.isDestroyed = true;
        }
      }
      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'destroy', view);
      }
    }

  });

  return NonEmptyingRegion;

});

// Renders tab panel made of links and content
csui.define('csui/controls/tab.panel/tab.panel.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tab.panel/impl/tab.links.view',
  'csui/controls/tab.panel/impl/tab.contents.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/models/version',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tab.panel/behaviors/tab.panel.keyboard.behavior',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/controls/form/pub.sub',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, base, TabLinkCollectionView,
    TabContentCollectionView, ViewEventsPropagationMixin, VersionModel,
    TabableRegionBehavior, TabPanelKeyboardBehavior, NonEmptyingRegion, PubSub) {
  'use strict';

  var TabPanelView = Marionette.View.extend({

    className: 'cs-tabpanel tab-panel',
    attributes: function () {
      var id = this.id || _.uniqueId('cs-tab');
      var attrs = {id: id};
      return attrs;
    },

    events: {"keydown": "onKeyInView"},

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        notSetFocus: true,
        initialActivationWeight: 100
      },
      TabPanelKeyboardBehavior: {
        behaviorClass: TabPanelKeyboardBehavior
      }
    },

    constructor: function TabPanelView(options) {
      options || (options = {});
      options.tabPanel = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      // generate unique internal Tab ID
      this._generateUniqueTabId(options);
      if (options.node) {
        var initialPanel = options.node.get('initialPanel');
        if (initialPanel) {
          var initialTabIndex = options.collection.findIndex({name: initialPanel});
          if (initialTabIndex >= 0 && initialTabIndex < options.collection.length) {
            var initialPanelModel = options.collection.at(initialTabIndex);
            options.activeTab = new Backbone.Model(initialPanelModel.attributes);
            options.activeTab.set('tabIndex', initialTabIndex);
            options.selectedTab = new Backbone.Model(initialPanelModel.attributes);
          }
        }
      }
      if (!options.activeTab) {
        options.activeTab = new Backbone.Model({tabIndex: 0});
      }

      Marionette.View.prototype.constructor.apply(this, arguments);

      this.linksRegion = new NonEmptyingRegion({el: this.el});
      this.contentRegion = new NonEmptyingRegion({el: this.el});

      // Fix the active tab index if it exceeds the tab count
      this.activeTab = options.activeTab;
      var tabIndex = this.activeTab.get('tabIndex');
      if (tabIndex >= this.collection.length) {
        this.activeTab.set('tabIndex', this.collection.length - 1);
      }

      // scenarios such as Properties page: the categories tabs are asynchorously loaded later
      this.listenTo(this.collection, 'reset', this._generateUniqueTabId);
      // scenarios such as Properties page: add a new category or RM inserts their tabs
      this.listenTo(this.collection, 'add', this._setModelUniqueTabId);

      this.listenTo(this, 'activate:tab', this._scrollToActiveTab);
      this.listenTo(this, 'before:destroy', this._destroyContent);
    },

    _scrollToActiveTab: function (tabContent, tabPane, tabLink) {
      this.activeTabLink = tabLink;
      this.activeTabContent = tabContent;
      if (this.options.mode) {
        var href           = tabLink.$el.find('>a').attr('href'),
            extraTopOffset = this.getOption('extraScrollTopOffset') || 0;
        href[0] === '#' && (href = href.substr(1));
        var hrefElems = this.$el.find("div[id='" + href + "']");
        if (hrefElems.length > 0) {
          var tabPosTop = hrefElems[0].offsetTop + extraTopOffset;
          if (this.options.mode === 'spy') {
            // Update scrollspy with newly created tab
            var scrollspy = this.tabContent.$el.data('binf.scrollspy');
            scrollspy && scrollspy.refresh();
          }
          this.tabContent.$el.animate({
            scrollTop: tabPosTop
          }, 300);

          // change the title of sticky header.
          var newTabHeaderText = tabLink.$el.find(".cs-tablink-text").html(),
              pubsubPostFix    = (this.options.node instanceof VersionModel ? 'v' : 'p') +
                                 this.options.node.get('id'),
              objPubSubId      = 'pubsub:tab:contents:header:view:change:tab:title:' +
                                 pubsubPostFix;

          PubSub.trigger(objPubSubId, newTabHeaderText);
        }
      }
    },

    render: function () {
      this._ensureViewIsIntact();
      Marionette.triggerMethodOn(this, 'before:render', this);
      this._destroyContent();
      this._renderContent();
      this._bindingToEvents();
      Marionette.triggerMethodOn(this, 'render', this);
      return this;
    },

    _renderContent: function () {
      // Initialize the tab link and content sub-views
      var TabLinkCollectionViewClass = this.options.TabLinkCollectionViewClass ||
                                       TabLinkCollectionView;
      this.tabLinks = new TabLinkCollectionViewClass(this.options);
      var TabContentCollectionViewClass = this.options.TabContentCollectionViewClass ||
                                          TabContentCollectionView;
      this.tabContent = new TabContentCollectionViewClass(this.options);
      this.propagateEventsToViews(this.tabLinks, this.tabContent);
      this.linksRegion.show(this.tabLinks);
      this.contentRegion.show(this.tabContent);

      // Propagate the tab activating event to the listeners outside
      var self = this;
      this.listenTo(this.tabLinks, 'childview:before:activate:tab',
          function (tabLink) {
            var tabPane    = this.tabContent.children.findByModel(tabLink.model),
                tabContent = tabPane.content;
            // when the tab is activating by mouse click for example,
            // let the _autoScrolling know not to scroll
            this.activatingTab = true;
            Marionette.triggerMethodOn(this, 'before:activate:tab', tabContent, tabPane, tabLink);
          });
      this.listenTo(this.tabLinks, 'childview:activate:tab',
          function (tabLink) {
            var tabPane    = this.tabContent.children.findByModel(tabLink.model),
                tabContent = tabPane.content;
            // give this a bit more time than _autoScrolling's timeout
            setTimeout(function () {
              self.activatingTab = false;
            }, 600);
            Marionette.triggerMethodOn(this, 'activate:tab', tabContent, tabPane, tabLink);
            // Trigger the dom:show event once more.  Some operations can be
            // performedonly when the view is both in DOM and visible.
            Marionette.triggerMethodOn(tabContent, 'dom:refresh');
          });

      var tabIndex = 0;
      if (this.activeTab && this.activeTab.get('tabIndex') >= 0 &&
          this.activeTab.get('tabIndex') < this.collection.length) {
        tabIndex = this.activeTab.get('tabIndex');
      }
      this.activeTabLink = this.tabLinks.children.findByIndex(tabIndex);
      // Tab control can be empty
      if (this.activeTabLink) {
        this.activeTabContent = this.tabContent.children.findByIndex(tabIndex).content;
      }
    },

    _destroyContent: function () {
      this.$el.off('tab:content:focus');
      this.$el.off('tab:link:delete');
      if (this.tabLinks) {
        this.cancelEventsToViewsPropagation(this.tabLinks, this.tabContent);
        this.stopListening(this.tabLinks)
            .stopListening(this.tabContent);
        this.linksRegion.empty();
        this.contentRegion.empty();
      }
    },

    _bindingToEvents: function () {
      var self = this;
      this.$el.on('tab:content:focus',
          function (event) {
            var $elem = self.tabContent.getTabContentFirstFocusableELement(event.tabId);
            if ($elem) {
              self.currentTabPosition = this.keyboardBehavior ?
                                        this.keyboardBehavior.tabContentIndex : -1;
              self._moveTo && self._moveTo(event, $elem);
              self.tabContent.keyboardBehavior &&
              self.tabContent.keyboardBehavior.updateCurrentTabPosition();
            }
          });
      this.$el.on('tab:link:delete',
          function (event) {
            event.preventDefault();
            event.stopPropagation();
            self.tabLinks.deleteTabById(event.tabId);
          });
    },

    _convertCollection: function (options) {
      var tabs = new Backbone.Collection(options.tabs);
      tabs.each(function (tab) {
        tab.set('id', _.uniqueId('cs-tab'));
      });
      return tabs;
    },

    _generateUniqueTabId: function (options) {
      // This method ensures unique internal tab ID for each tablink-tabcontent pair in entire page.
      // Cannot use model's 'id' as tab ID because it can be duplicated if the same model is being
      // used in multiple places on the page.
      var collection = options instanceof Backbone.Collection ? options :
                       (options.collection || this.collection);
      if (collection) {
        collection.each(_.bind(function (tab) {
          this._setModelUniqueTabId(tab);
        }, this));
      }
    },

    _setModelUniqueTabId: function (model) {
      model && model.set('uniqueTabId', _.uniqueId('cstab-uid-'), {silent: true});
    },

    _isTablinkVisibleInParents: function ($el, options) {
      return this.tabLinks._isTablinkVisibleInParents($el, options);
    }

  });

  _.extend(TabPanelView.prototype, ViewEventsPropagationMixin);

  return TabPanelView;

});

csui.define('csui/controls/tab.panel/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/tab.panel/impl/nls/root/lang',{
  deleteTooltip: 'Delete',
  deleteTabAria: 'Delete {0}',
  gotoNextTooltip: 'Show next tab',
  gotoPreviousTooltip: 'Show previous tab',
  requiredTooltip: 'Required',
  showMore: 'Show more'
});


csui.define('csui/controls/tab.panel/tab.links.ext.scroll.mixin',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/models/version',
  'i18n!csui/controls/tab.panel/impl/nls/lang', 'csui/controls/form/pub.sub'
], function (_, $, Backbone, VersionModel, lang, PubSub) {

  //
  // TabLinks Mixin is to provide the additional tab overflow scrolling functionality to the
  // TabLinksExtView object.
  // Define the following in the main Tab Panel View constructor:
  // - this.options = {
  //     toolbar: true,
  //   }
  // Add this mixin to your main Tab View implementation and make the appropriate calls.
  // Also add your own css styling to achieve the correct entity location and layout.
  // For detailed example, see 'src/widgets/metadata/impl/metadata.properties.view.js'.
  //
  var TabLinksScrollMixin = {

    _initializeToolbars: function (options) {
      options = options || {};
      this.tabsSelector = '> ul li';
      this.tablinksToolbar = $(this.$el.find('.tab-links .tab-links-bar')[0]);

      var tooltip;
      this.leftToolbar = $(this.$el.find('.tab-links .left-toolbar')[0]);
      if (this.leftToolbar && this.leftToolbar.find('>div.goto_previous_div').length === 0) {
        tooltip = options.gotoPreviousTooltip || lang.gotoPreviousTooltip;
        this.leftToolbar.append(
            "<div class='goto_previous_div' title='" + tooltip +
            "'><span class='icon goto_previous_page'></span></div>"
        );
        this.gotoPreviousPage = $(this.$el.find('.tab-links .goto_previous_div')[0]);
        this.gotoPreviousPage.on('click', _.bind(this._gotoPreviousTabClick, this));
      }
      this._hideLeftToolbar();

      this.rightToolbar = $(this.$el.find('.tab-links .right-toolbar')[0]);
      if (this.rightToolbar && this.rightToolbar.find('>div.goto_next_div').length === 0) {
        tooltip = options.gotoNextTooltip || lang.gotoNextTooltip;
        this.rightToolbar.append(
            "<div class='goto_next_div' title='" + tooltip +
            "'><span class='icon goto_next_page'></span></div>"
        );
        this.gotoNextPage = $(this.$el.find('.tab-links div.goto_next_div')[0]);
        this.gotoNextPage.on('click', _.bind(this._gotoNextTabClick, this));
      } else {
        this.gotoNextPage = $(this.$el.find('.tab-links div.goto_next_div')[0]);
      }
      this.gotoNextPage && this.gotoNextPage.hide();
    },

    _listenToTabEvent: function () {
      var i;
      var tabs = this.tablinksToolbar.find(this.tabsSelector);
      for (i = 0; i < tabs.length; i++) {
        this._listenToTabIdEvent(i, tabs);
      }
    },

    _listenToTabIdEvent: function (index, iTabs) {
      var self = this;
      var tabs = iTabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : iTabs;

      $(tabs[index]).off('activate.binf.scrollspy')
          .on('activate.binf.scrollspy', function () {
            var tabID    = $(this).find('a').attr('href'),
                tabIndex = 0;
            if (tabID) {
              tabID[0] === '#' && (tabID = tabID.substr(1));
              tabIndex = self._findTabIndexByID(tabID);
              if (!!self.tabContentHeader) {
                var newTabHeaderText = $(tabs).parent().find(
                    "li.binf-active .cs-tablink-text").html(),
                    pubsubPostFix    = (self.options.node instanceof VersionModel ? 'v' : 'p') +
                                       self.options.node.get('id'),
                    objPubSubId      = 'pubsub:tab:contents:header:view:change:tab:title:' +
                                       pubsubPostFix;

                PubSub.trigger(objPubSubId, newTabHeaderText);
              }
            }
            // skip scrolling for faster performance
            if (self.activatingTab === true || self.skipAutoScroll === true ||
                (self.scrollspyActivatingTab === true && self.scrollspyActivatingTabId ===
                 tabIndex)) {
              return;
            }
            if (tabID) {
              if (tabIndex >= 0 && !self._isTablinkVisibleInParents($(tabs[tabIndex]))) {
                // while scrolling, skip extra scrollspy events on the same tab
                self.scrollspyActivatingTab = true;
                self.scrollspyActivatingTabId = tabIndex;
                self._autoScrollTabTo(tabIndex)
                    .done(function () {
                      self.scrollspyActivatingTab = false;
                      self.scrollspyActivatingTabId = -1;
                    });
              }
            }
          });
    },

    _beginTabHidden: function (iTabs) {
      var tabHidden = false;
      var tabs = iTabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          var tabVisible = this._isTablinkVisibleInParents($(tabs[i]));
          // as soon as see first visible tab, there is no beginning hidden tab
          if (tabVisible) {
            break;
          }
          // tab is not visible and must not be hidden by the 'Only required fields' switch
          if (!tabVisible && !($(tabs[i]).hasClass('hidden-by-switch'))) {
            tabHidden = true;
            break;
          }
        }
      }
      return tabHidden;
    },

    _trailingTabHidden: function (iTabs) {
      var tabHidden = false;
      var tabs = iTabs === undefined ? this.tablinksToolbar &&  this.tablinksToolbar.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = tabs.length - 1; i >= 0; i--) {
          var tabVisible = this._isTablinkVisibleInParents($(tabs[i]));
          // as soon as see first visible tab, there is no trailing hidden tab
          if (tabVisible) {
            break;
          }
          // tab is not visible and must not be hidden by the 'Only required fields' switch
          if (!tabVisible && !($(tabs[i]).hasClass('hidden-by-switch'))) {
            tabHidden = true;
            break;
          }
        }
      }
      return tabHidden;
    },

    _findTabIndexByID: function (tabID) {
      var tabIndex = -1;
      var tabs = this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector);
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          var href = $(tabs[i]).find('>a').attr('href');
          href[0] === '#' && (href = href.substr(1));
          if (tabID === href) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _firstVisibleTabIndex: function (iTabs) {
      var tabIndex = -1;
      var tabs = iTabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          if (this._isTablinkVisibleInParents($(tabs[i]))) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _lastVisibleTabIndex: function (iTabs) {
      var tabIndex = -1;
      var tabs = iTabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = tabs.length - 1; i >= 0; i--) {
          if (this._isTablinkVisibleInParents($(tabs[i]))) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _showLeftToolbar: function () {
      this.leftToolbar && this.leftToolbar.show();
      this.tablinksToolbar && this.tablinksToolbar.addClass("with-left-toolbar");
    },

    _hideLeftToolbar: function () {
      this.leftToolbar && this.leftToolbar.hide();
      this.tablinksToolbar && this.tablinksToolbar.removeClass("with-left-toolbar");
    },

    _hideTabLinkByRequiredSwitch: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.addClass('binf-hidden hidden-by-switch');
        this._hideTab($tab);
        // keyboard navigation support
        $tab.find('a').attr('data-cstabindex', '-1');
        var tabDeleteIcon = $tab.find('.cs-delete-icon');
        if (tabDeleteIcon.attr('data-cstabindex') !== undefined) {
          tabDeleteIcon.attr('data-cstabindex', '-1');
        }
      }
    },

    _showTabLinkByRequiredSwitch: function ($tab, removeable) {
      if ($tab && $tab instanceof $) {
        $tab.removeClass('binf-hidden hidden-by-switch');
        this._showTab($tab);
        // keyboard navigation support
        $tab.find('a').removeAttr('data-cstabindex');
        removeable === true && $tab.find('.cs-delete-icon').attr('data-cstabindex', '0');
      }
    },

    _hideTab: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.css('width', '');
        $tab.css('text-overflow', 'clip');
        $tab.hide();
      }
    },

    _showTab: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.css('width', '');
        $tab.css('text-overflow', 'ellipsis');
        $tab.show();
      }
    },

    _showLastTab: function (iTabs) {
      var tabs = iTabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : iTabs;
      var i;
      for (i = tabs.length - 1; i >= 0; i--) {
        var $tab = $(tabs[i]);
        if (!this._isTablinkVisibleInParents($tab) && !($tab.hasClass('hidden-by-switch'))) {
          this._showTab($tab);
          break;
        }
      }
    },

    _enableToolbarState: function (iTabs) {
      var tabs = iTabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : iTabs;
      if (tabs && this.$el.is(':visible')) {
        this._beginTabHidden(tabs) ? this._showLeftToolbar() : this._hideLeftToolbar();
        this.gotoNextPage && this.gotoNextPage.toggle(this._trailingTabHidden(tabs));
      }
    },

    _gotoPreviousTabClick: function (event) {
      Backbone.trigger('closeToggleAction');
      this._gotoPreviousTab({event: event});
    },

    _gotoNextTabClick: function (event) {
      Backbone.trigger('closeToggleAction');
      var deferred = $.Deferred();
      var tabs = this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector);
      var visibleIndex = this._lastVisibleTabIndex(tabs);

      // scroll until the next tab is visible (sometimes 2 or more tabs)
      if (visibleIndex >= 0 && visibleIndex < tabs.length) {
        // find the next hidden tab (exclude the ones hidden by 'See required only' switch)
        var i, nextIndex = -1;
        for (i = visibleIndex + 1; i < tabs.length; i++) {
          var $tab = $(tabs[i]);
          if (!($tab.hasClass('hidden-by-switch')) && !this._isTablinkVisibleInParents($tab)) {
            nextIndex = i;
            break;
          }
        }
        if (nextIndex >= 0 && nextIndex < tabs.length) {
          return this._gotoNextTab({tabs: tabs, visibleTabIndex: nextIndex});
        }
      }
      return $.Deferred().resolve();
    },

    // Params:
    // - options <object>: {
    //     event <event>: optional event
    //     tabs <elements>: optional tabs for performance without lookup
    //     visibleTabIndex <integer>: optional for the tab index to scroll until it is visible
    //     deferred <jQuery Deferred>: optional for asynchronous
    //     animationOff <boolean>: true/false
    //   }
    // Return: jQuery Deferred
    _gotoPreviousTab: function (options) {
      options || (options = {});
      options.event && options.event.preventDefault();
      options.event && options.event.stopPropagation();

      var deferred = options.deferred ? options.deferred : $.Deferred();
      var tabs = options.tabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : options.tabs;
      var i, lastTabIndex = tabs.length - 1;

      var visibleTabIndex = options.visibleTabIndex;
      if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
          visibleTabIndex <= lastTabIndex) {
        if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex]))) {
          return deferred.resolve();
        }
      }

      var defBeingHandled = false;
      for (i = 0; i <= lastTabIndex; i++) {
        // find the visible tab
        var $tab2 = $(tabs[i]);
        if (this._isTablinkVisibleInParents($tab2)) {
          if (i === 0) {
            this._hideLeftToolbar();
          }

          // find the previous hidden tab (exclude the ones hidden by 'See required only' switch)
          var j;
          for (j = i - 1; j >= 0; j--) {
            var $tab1 = $(tabs[j]);
            if ($tab1 && !this._isTablinkVisibleInParents($tab1) &&
                !($tab1.hasClass('hidden-by-switch'))) {
              // find the real width to animate
              $tab1.css('visibility', 'binf-hidden');
              $tab1.css('width', '');
              $tab1.show();
              var width = $tab1.width();
              $tab1.css('text-overflow', 'clip');
              $tab1.width(0);
              $tab1.css('visibility', '');

              defBeingHandled = true;
              var duration = options.animationOff === true ? 0 : 'fast';
              $tab1.animate({"width": "+=" + width}, duration,
                  _.bind(function () {
                    $tab1.css('width', '');
                    $tab1.css('text-overflow', 'ellipsis');
                    var recurse = false;
                    if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
                        visibleTabIndex <= lastTabIndex) {
                      if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex])) === false) {
                        recurse = true;
                      }
                    }
                    if (recurse) {
                      var opts = {tabs: tabs, deferred: deferred};
                      options.event && (opts.event = options.event);
                      (visibleTabIndex !== undefined) && (opts.visibleTabIndex = visibleTabIndex);
                      (options.animationOff !== undefined) &&
                      (opts.animationOff = options.animationOff);
                      this._gotoPreviousTab(opts);
                    } else {
                      this._enableToolbarState(tabs);
                      this.autoScrollingLastTab = false;
                      deferred.resolve();
                    }
                  }, this));

              break;  // j loop
            }
          }
          break;  // i loop
        }
        // exception case when there is no visible tab found: show the last tab
        if (i === lastTabIndex) {
          this._showLastTab(tabs);
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }
      }

      if (defBeingHandled === false) {
        return deferred.resolve();
      }
      if (options.deferred === undefined) {
        return deferred.promise();
      }
    },

    // Params:
    // - options <object>: {
    //     event <event>: optional event
    //     tabs <elements>: optional tabs for performance without lookup
    //     visibleTabIndex <integer>: optional for the tab index to scroll until it is visible
    //     deferred <jQuery Deferred>: optional for asynchronous
    //     animationOff <boolean>: true/false
    //   }
    // Return: jQuery Deferred
    _gotoNextTab: function (options) {
      options || (options = {});
      options.event && options.event.preventDefault();
      options.event && options.event.stopPropagation();

      var deferred = options.deferred ? options.deferred : $.Deferred();
      var tabs = options.tabs === undefined ? this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector) : options.tabs;
      var i, lastTabIndex = tabs.length - 1;

      var visibleTabIndex = options.visibleTabIndex;
      if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
          visibleTabIndex <= lastTabIndex) {
        if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex]))) {
          return deferred.resolve();
        }
      }

      var defBeingHandled = false;
      for (i = 0; i <= lastTabIndex; i++) {
        var $tab = $(tabs[i]);
        if (this._isTablinkVisibleInParents($tab)) {
          if (this.leftToolbar.is(':hidden')) {
            this._showLeftToolbar();
          }

          if ($tab) {
            defBeingHandled = true;
            var duration = options.animationOff === true ? 0 : 'fast';
            $tab.animate({"width": "-=" + $tab.width()}, duration,
                _.bind(function () {
                  $tab.hide();
                  $tab.css('width', '');
                  var recurse = false;
                  if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
                      visibleTabIndex <= lastTabIndex) {
                    if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex])) === false) {
                      recurse = true;
                    }
                  }
                  if (recurse) {
                    var opts = {tabs: tabs, deferred: deferred};
                    options.event && (opts.event = options.event);
                    (visibleTabIndex !== undefined) && (opts.visibleTabIndex = visibleTabIndex);
                    (options.animationOff !== undefined) &&
                    (opts.animationOff = options.animationOff);
                    this._gotoNextTab(opts);
                  } else {
                    this._enableToolbarState(tabs);
                    this.autoScrollingLastTab = false;
                    deferred.resolve();
                  }
                }, this));
          }
          break;
        }
        // exception case when there is no visible tab found: show the last tab
        if (i === lastTabIndex) {
          this._showLastTab(tabs);
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }
      }

      if (defBeingHandled === false) {
        return deferred.resolve();
      }
      if (options.deferred === undefined) {
        return deferred.promise();
      }
    },

    _autoScrollLastTab: function () {
      this.autoScrollingLastTab = true;
      var tabs = this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector);
      var deferred = this._gotoNextTab({tabs: tabs, visibleTabIndex: tabs.length - 1});
      deferred.done(_.bind(function () {
        this.autoScrollingLastTab = false;
      }, this));
      return deferred;
    },

    _autoScrollFirstTabAsync: function ($tab0, tabs, iteration, iDeferred) {
      var iter = iteration === undefined ? 0 : iteration;
      if (iter < 0 && iter >= tabs.length) {
        if (iDeferred) {
          iDeferred.resolve();
          return;
        } else {
          return $.Deferred().resolve();
        }
      }

      var deferred = iDeferred ? iDeferred : $.Deferred();
      this._gotoPreviousTab({tabs: tabs}).done(_.bind(function () {
        if (this._isTablinkVisibleInParents($tab0)) {
          deferred.resolve();
        } else {
          iter++;
          this._autoScrollFirstTabAsync($tab0, tabs, iter, deferred);
        }
      }, this));

      if (iDeferred === undefined) {
        return deferred;
      }
    },

    _autoScrollFirstTab: function () {
      var deferred = $.Deferred();
      this.autoScrollingLastTab = true;
      var tabs = this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector);
      var $tab0 = $(tabs[0]);
      if (!this._isTablinkVisibleInParents($tab0) && tabs.length > 0) {
        this._autoScrollFirstTabAsync($tab0, tabs).done(_.bind(function () {
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }, this));
      } else {
        this.autoScrollingLastTab = false;
      }
      return deferred.promise();
    },

    _autoScrollTabTo: function (index, options) {
      options || (options = {});
      var tabs = this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector);
      var scrollOptions = _.extend({visibleTabIndex: index}, options, {tabs: tabs});
      var firstVisibleIndex = this._firstVisibleTabIndex(tabs);
      var lastVisibleIndex = this._lastVisibleTabIndex(tabs);

      if (firstVisibleIndex >= 0 && firstVisibleIndex < tabs.length &&
          lastVisibleIndex >= 0 && lastVisibleIndex < tabs.length &&
          index >= 0 && index < tabs.length) {
        this.autoScrollingLastTab = true;
        var deferred;
        if (index < firstVisibleIndex) {
          deferred = this._gotoPreviousTab(scrollOptions);
        } else if (index > lastVisibleIndex) {
          deferred = this._gotoNextTab(scrollOptions);
        } else {
          this.autoScrollingLastTab = false;
          return $.Deferred().resolve();
        }
        deferred.done(_.bind(function () {
          this.autoScrollingLastTab = false;
        }, this));
        return deferred;
      } else {
        return $.Deferred().resolve();
      }
    },

    _autoScrolling: function () {
      if (this.autoScrollingLastTab || this.activatingTab === true ||
          this.skipAutoScroll === true) {
        return $.Deferred().resolve();
      }

      var i, iActive = -1;
      var tabs = this.tablinksToolbar && this.tablinksToolbar.find(this.tabsSelector);
      var tabHidden = false;
      for (i = 0; i < tabs.length; i++) {
        var $tab = $(tabs[i]);
        if (iActive === -1 && $tab.hasClass('binf-active')) {
          if (this._isTablinkVisibleInParents($tab) === false) {
            tabHidden = true;
          }
          iActive = i;
          break;
        }
      }

      if (tabHidden) {
        return this._autoScrollTabTo(iActive);
      }
      return $.Deferred().resolve();
    }

  };

  return TabLinksScrollMixin;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.links.ext',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <div class=\"left-toolbar\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <div class=\"right-toolbar\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<div class=\"tab-links-bar\">\r\n  <span class=\"fadeout\"></span>\r\n  <ul class=\"binf-nav "
    + this.escapeExpression(((helper = (helper = helpers.tab_type || (depth0 != null ? depth0.tab_type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tab_type","hash":{}}) : helper)))
    + "\" role=\"tablist\"></ul>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.links.ext', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.link.ext',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"cs-icon-required category_required\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.required_tooltip || (depth0 != null ? depth0.required_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"required_tooltip","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"cs-tablink-delete\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.delete_tooltip || (depth0 != null ? depth0.delete_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"delete_tooltip","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.delete_icon || (depth0 != null ? depth0.delete_icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"delete_icon","hash":{}}) : helper)))
    + " cs-delete-icon\" role=\"button\"\r\n          "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.removeable : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.deleteTabAria || (depth0 != null ? depth0.deleteTabAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"deleteTabAria","hash":{}}) : helper)))
    + "\"></span>\r\n  </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "data-cstabindex=\"0\"";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.linkId || (depth0 != null ? depth0.linkId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linkId","hash":{}}) : helper)))
    + "\" role=\"tab\" aria-selected=\""
    + this.escapeExpression(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selected","hash":{}}) : helper)))
    + "\" aria-controls="
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + " class=\"cs-tablink\" data-binf-toggle=\"tab\" title=\""
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.required : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <span class=\"cs-tablink-text\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "</span>\r\n</a>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.allow_delete : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.link.ext', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tab.panel/impl/tab.link.ext.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/controls/tab.panel/impl/tab.link.ext',
  'i18n!csui/controls/tab.panel/impl/nls/lang',
  'csui/lib/binf/js/binf'
], function (_, TabLinkView, tabLinkExtTemplate, lang) {
  "use strict";

  var TabLinkViewExt = TabLinkView.extend({

    template: tabLinkExtTemplate,
    templateHelpers: function () {
      var uniqueTabId = this.model.get('uniqueTabId');
      return {
        linkId: 'tablink-' + uniqueTabId,
        selected: this._isOptionActiveTab(),
        required_tooltip: lang.requiredTooltip,
        delete_icon: this.options.delete_icon || 'circle_delete',
        delete_tooltip: this.options.delete_tooltip || lang.deleteTooltip,
        deleteTabAria: _.str.sformat(lang.deleteTabAria, this.model.get('title'))
      };
    },

    events: {
      'show.binf.tab > a': 'onShowingTab',
      'shown.binf.tab > a': 'onShownTab',
      'focus .cs-delete-icon': 'onFocusDeleteIcon',
      'blur .cs-delete-icon': 'onBlurDeleteIcon',
      'click .cs-tablink-delete': 'onDelete'
    },

    ui: {
      link: '>a',
      deleteIcon: '.cs-delete-icon',
      deleteIconParent: '.cs-tablink-delete'
    },

    constructor: function TabLinkViewExt(options) {
      this.options = options || {};
      TabLinkView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'action:updated', function () {
        this._setRemoveable();
      });
    },

    onRender: function () {
      this._setRemoveable();
    },

    _setRemoveable: function () {
      if (!!this.model.get('removeable')) {
        this.ui.deleteIcon.addClass('removeable');
        this.ui.deleteIcon.attr('data-cstabindex', '0');
        this.ui.deleteIconParent.removeClass('binf-hidden');
      } else {
        this.ui.deleteIcon.removeClass('removeable');
        this.ui.deleteIcon.removeAttr('data-cstabindex');
        this.ui.deleteIconParent.addClass('binf-hidden');
      }
    },

    onFocusDeleteIcon: function () {
      this.ui.deleteIconParent.addClass('focused');
    },

    onBlurDeleteIcon: function () {
      this.ui.deleteIconParent.removeClass('focused');
    },

    onDelete: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.deleteCurrentTab();
    },

    deleteCurrentTab: function () {
      //
      // Technical note on the 'allow_delete' and 'removeable':
      // 1) Why there are two, not just one?
      //    Answer: 'allow_delete' is for the View to create with or  without the delete icon
      //            element.
      // 2) What 'removeable' is for and why have it?
      //    Answer: 'removeable' is the Model state to determine if the delete icon should be
      //             active and visible or not. In some scenarios, the Model commands are
      //             delayed fetched.  The 'removeable' attribute would be updated asynchronously.
      //             At the intialization the value would be false, but could be true/false later.
      // The code combines both values and also uses CSS to show/hide the icon on mouse hover
      // or touch focus on mobile device without additional JavaScript code.
      // Thoughts were put into it.  Otherwise, the simple one attribute was an obvious easy choice
      // that everyone would go for it first.
      //
      if (this.model.get('allow_delete') === true && this.model.get('removeable') === true) {
        this.triggerMethod('delete:tab');
      }
    }

  });

  return TabLinkViewExt;

});

csui.define('csui/controls/tab.panel/tab.links.ext.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.links.view',
  'hbs!csui/controls/tab.panel/impl/tab.links.ext',
  'csui/controls/tab.panel/impl/tab.link.ext.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/lib/binf/js/binf'
], function (_, TabLinkCollectionView, tabLinksTemplate, TabLinkViewExt,
    ViewEventsPropagationMixin) {
  "use strict";

  var TabLinkCollectionViewExt = TabLinkCollectionView.extend({

    template: tabLinksTemplate,
    templateHelpers: function () {
      return {
        tab_type: this.options.tabType || 'binf-nav-tabs',
        toolbar: this.options.toolbar ? true : false
      };
    },

    events: {
      'click .left-toolbar': 'onToolbarClicked',
      'click .right-toolbar': 'onToolbarClicked'
    },

    childView: TabLinkViewExt,
    childViewContainer: function () {
      return '.tab-links-bar >.' + this.tabType;
    },
    childViewOptions: function (model, index) {
      return _.extend(this.options, {});
    },

    constructor: function TabLinkCollectionViewExt(options) {
      this.options = options || {};
      TabLinkCollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'metadata:schema:updated', function (model) {
        // Re-Render model specific tab to reflect model changes - ex: required
        this.children.findByModel(model).render();
      }, this);
    },

    onToolbarClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    deleteTabById: function (tabId) {
      var ret = false;
      if (tabId === undefined) {
        return ret;
      }

      var uTabId = tabId.charAt(0) === '#' ? tabId.slice(1) : tabId;
      var model = this.collection.findWhere({uniqueTabId: uTabId});
      if (model) {
        var tabLink = this.children.findByModel(model);
        if (tabLink) {
          tabLink.deleteCurrentTab();
          ret = true;
        }
      }
      return ret;
    }

  });

  _.extend(TabLinkCollectionViewExt.prototype, ViewEventsPropagationMixin);

  return TabLinkCollectionViewExt;

});

csui.define('csui/controls/tab.panel/behaviors/tab.links.dropdown.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, KeyboardBehaviorMixin) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabLinksDropdownKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabLinksDropdownKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.tabableElements.length === 0) {
            // don't handle keystrokes at all if no elements were found for keyboard navigation
            return ret;
          }
          if (event.keyCode === 9) {  // tab
            // log.debug('TabLinksDropdownKeyboardBehavior::onKeyInView ' + this.constructor.name)
            // && console.log(log.last);

            // event.shiftKey: shift tab -> activate previous region
            ret = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
          }
          return ret;
        }
      });

    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      this.tabableElements = view.$el.find('button:not([disabled])').filter(':visible');
      this.view.currentTabPosition = -1;
      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);

      // log.debug('TabLinksDropdownKeyboardBehavior::refreshTabableElements ' +
      //           view.constructor.name + ': found ' + this.tabableElements.length + ' tabable' +
      //           ' elements') && console.log(log.last);
    }

  });

  return TabLinksDropdownKeyboardBehavior;

});

csui.define('csui/controls/mixins/global.alert/global.alert.mixin',[], function () {
  'use strict';
  var GlobalAlertMixin = {
    prepareForGlobalAlert: function () {
      this.listenTo(this, 'global.alert.inprogress', this.handleAlertInProgress);
      this.listenTo(this, 'global.alert.completed', this.handleAlertComplete);
    },

    handleAlertInProgress: function () {
      if (this.currentlyFocusedElement !== this.disableCurrentFocusElementHandler) {
        this.originalCurrentlyFocusedElement = this.currentlyFocusedElement;
      }
      this.currentlyFocusedElement = this.disableCurrentFocusElementHandler;
    },

    disableCurrentFocusElementHandler: function () {
      // console.log('Disabled current focus for ', this.constructor.name);
    },

    handleAlertComplete: function () {
      if (this.originalCurrentlyFocusedElement != null) {
        // console.log('Rolling back to original currentlyFocusedElement.', this.constructor.name);
        this.currentlyFocusedElement = this.originalCurrentlyFocusedElement;
        this.originalCurrentlyFocusedElement = undefined;
      }
    }
  };
  return GlobalAlertMixin;
});
csui.define('csui/utils/contexts/factories/metadata.factory',['module',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var MetadataModel = Backbone.Model.extend({});

  // MetadataModelFactory
  return ModelFactory.extend({

    MetadataModelPrefix: 'MetadataModel',
    propertyPrefix: 'MetadataModel',

    constructor: function PropertiesModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var metadataModel = this.options.MetadataModel || {};
      if (!(metadataModel instanceof Backbone.Model)) {
        var config = module.config();
        metadataModel = new MetadataModel(metadataModel.models, _.extend({},
            metadataModel.options, config.options));
      }
      this.property = metadataModel;
    }
  });
});

csui.define('csui/controls/mixins/view.state/metadata.view.state.mixin',['module', 'csui/lib/underscore', 'csui/lib/marionette',
          'csui/utils/contexts/factories/metadata.factory'
], function (module, _, Marionette, MetadataModelFactory) {
  'use strict';

  return {

    getViewStateDropdown: function () {
      return this.context && this.context.viewStateModel.getViewState('dropdown');
    },

    getDefaultViewStateDropdown: function () {
      return this.context && this.context.viewStateModel.getDefaultViewState('dropdown');
    },

    setViewStateDropdown: function (value, options) {
      var viewStateModel = this.context && this.context.viewStateModel;
      if (options) {
        if (options.default) {
          viewStateModel.setDefaultViewState('dropdown', value);
        }
        if (options.title) {
          viewStateModel.setViewState('dropdownTitle', options.title);
        }
      }
      return viewStateModel.setViewState('dropdown', value);
    },

    setViewStateId: function (id, options) {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      var metadataInfo = _.clone(metadataModel.get('metadata_info'));
      if (metadataInfo) {
        metadataInfo.id = id;
        metadataInfo.model = options.model;
        metadataModel.set('metadata_info', metadataInfo, options);
      }
    },

    getViewStateId: function (id) {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      var metadataInfo = _.clone(metadataModel.get('metadata_info'));
      if (metadataInfo) {
        return metadataInfo.id;
      }
    },

    isMetadataNavigation: function () {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      if (metadataModel) {
        var metadataInfo = metadataModel.get('metadata_info');
        if (metadataInfo) {
          return metadataInfo.navigator;
        }
      }
      return true;
    },

    getThumbnailViewState: function () {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      if (metadataModel) {
        var metadataInfo = metadataModel.get('metadata_info');
        if (metadataInfo) {
          return metadataInfo.isThumbnailView;
        }
      }
    },

    getViewStateSelectedProperty: function () {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      if (metadataModel) {
        var metadataInfo = metadataModel.get('metadata_info');
        if (metadataInfo) {
          return metadataInfo.selectedProperty;
        }
      }
    }

  };

});

csui.define('csui/controls/mixins/view.state/node.view.state.mixin',['module', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/log'
], function (module, _, Marionette, log) {
  'use strict';

  log = log(module.id);

  return {

    getViewStatePage: function () {
      return this._parsePageInfo(this.context.viewStateModel.getViewState('page'));
    },

    getDefaultViewStatePage: function () {
      return this._parsePageInfo(this.context.viewStateModel.getDefaultViewState('page'));
    },

    _parsePageInfo: function (page) {
      if (page) {
        page = page.split('_');
        if (page.length > 1) {
          try {
            return {
              top: parseInt(page[0]),
              skip: parseInt(page[1])
            };
          } catch (error) {
            log.error('invalid page info in url.');
          }
        }
      }
    },

    setViewStatePage: function (top, skip, options) {
      var viewStateModel = this.context.viewStateModel;
      top = top > 50 ? 100 : top;
      if (options && options.default) {
        viewStateModel.setDefaultViewState('page', top + '_' + skip, options);
      }
      return viewStateModel.setViewState('page', top + '_' + skip, options);
    },

    getViewStateOrderBy: function (uiState) {
      var orderBy = uiState ? uiState.order_by : this.context.viewStateModel.getViewState('order_by');
      return this._formatOrderBy(orderBy);
    },

    _formatOrderBy: function (orderBy) {
      return orderBy && orderBy.replace(/_desc/g, ' desc').replace(/_asc/g, ' asc');
    },

    getDefaultViewStateOrderBy: function() {
      var orderBy = this.context.viewStateModel.getDefaultViewState('order_by');
      return this._formatOrderBy(orderBy);
    },

    setViewStateOrderBy: function (orderBy, options) {
      var viewStateModel = this.context.viewStateModel;
      if (orderBy && orderBy.length) {
        var stateOrderBy = viewStateModel.getViewState('order_by'),
            order_by     = orderBy.join();
        if (order_by !== stateOrderBy) {
          // all ui state params must be saved in the ui state model as a url param ready to be
          // used as a url parameter.
          order_by = order_by.replace(/ /g, '_');
          if (options && options.default) {
            viewStateModel.setDefaultViewState('order_by', order_by, _.omit(options, 'default'));
          }
          return viewStateModel.setViewState('order_by', order_by, options);
        }
      } else {
        return viewStateModel.setViewState('order_by', undefined, options);
      }
    },

    getViewStateFilter: function () {
      // make sure to decode the filter
      return this.context.viewStateModel.getViewState('filter', true);
    },

    setViewStateFilter: function (filtersString, options) {
      if (this.getViewStateFilter() !== filtersString) {
        var viewStateModel = this.context.viewStateModel;
        options || (options = {});
        options.encode = true;
        if (options && options.default) {
          viewStateModel.setDefaultViewState('filter', filtersString, options);
        }
        return viewStateModel.setViewState('filter', filtersString, options);
      }
    },

    getViewStateTabIndex: function () {
      var tabIndex = this.context.viewStateModel.getViewState('tab');
      if (tabIndex) {
          try {
            tabIndex = parseInt(tabIndex);
          } catch (error) {
            log.error('invalid tab info in url.');
          }
      }
      return tabIndex;
    },

    setViewStateTabIndex: function (tabIndex, options) {
      var viewStateModel = this.context.viewStateModel;
      if (options && options.default) {
        viewStateModel.setDefaultViewState('tab', tabIndex, options);
      }
      return viewStateModel.setViewState('tab', tabIndex, options);
    }

  };

});

csui.define('csui/controls/tile/behaviors/blocking.behavior',['csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/progressblocker/blocker'
], function (_, Marionette, BlockingView) {
  'use strict';

  var BlockingBehavior = Marionette.Behavior.extend({

    constructor: function BlockingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      var blockingParentView = getOption.call(this, 'blockingParentView', options);
      if (blockingParentView) {
        BlockingView.delegate(view, blockingParentView);
      } else {
        BlockingView.imbue(view);
      }

      if (this.collection) {
        view.listenTo(view.collection, "request", view.blockActions)
            .listenTo(view.collection, "sync", view.unblockActions)
          // TODO: Find a better workaround for model.destroy relaying request
          // event to the collection but not the sync and error events
            .listenTo(view.collection, "destroy", view.unblockActions)
            .listenTo(view.collection, "error", view.unblockActions);
      }
      if (view.model) {
        view.listenTo(view.collection, "request", view.blockActions)
            .listenTo(view.collection, "sync", view.unblockActions)
            .listenTo(view.collection, "error", view.unblockActions);
      }
    }

  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, options) {
    options = this.options || options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return BlockingBehavior;

});

csui.define('csui/controls/tile/behaviors/infinite.scrolling.behavior',['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette'
], function (require, $, _, Marionette) {
  "use strict";

  var InfiniteScrollingBehavior = Marionette.Behavior.extend({

    defaults: {
      content: null,
      contentParent: null,
      fetchMoreItemsThreshold: 95
    },

    constructor: function ScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._bindScrollingEvents);
      this.listenTo(view, 'before:destroy', this._unbindScrollingEvents);
    },

    _bindScrollingEvents: function () {
      var contentParent = getOption.call(this, 'contentParent');
      this._contentParent = contentParent ? this.view.$(contentParent) : this.view.$el;
      this._contentParent.on('scroll.' + this.view.cid, _.bind(this._checkScrollPosition, this));
      var content = getOption.call(this, 'content');
      this._content = content ? this.view.$(content) :
                      contentParent ? this._contentParent.children().first() : this.view.$el;
    },

    _checkScrollPosition: function () {
      var fetchMoreItemsThreshold = getOption.call(this, 'fetchMoreItemsThreshold');
      var contentH;
      if (this._content.length === 1) {
        contentH = this._content.height();
      } else {
        contentH = _.reduce(this._content, function (sum, el) {return sum + $(el).height()}, 0);
      }
      var scrollableHeight     = contentH - this._contentParent.height(),
          scrollablePercentage = this._contentParent.scrollTop() * 100 / scrollableHeight;
      if (scrollablePercentage >= fetchMoreItemsThreshold) {
        this._checkScrollPositionFetch();
      }
    },

    _checkScrollPositionFetch: function () {
      var collection = this.view.collection;
      if (collection.length < collection.totalCount && !collection.fetching &&
          collection.skipCount < collection.length) {
        // console.log('fetching from', collection.length);
        var self = this;
        this.view.trigger('before:collection:scroll:fetch');
        collection.setSkip(collection.length, false);
        collection.fetch({
          reset: false,
          remove: false,
          merge: false,
          success: function () {
            self.view.trigger('collection:scroll:fetch');
          }
        });
      }
    },

    _unbindScrollingEvents: function () {
      if (this._contentParent) {
        this._contentParent.off('scroll.' + this.view.cid);
      }
    }

  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return InfiniteScrollingBehavior;

});

csui.define('csui/controls/tile/behaviors/parent.scrollbar.updating.behavior',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior'
], function (_, $, Marionette, PerfectScrollingBehavior) {
  'use strict';

  var ParentScrollbarUpdatingRegion = Marionette.Region.extend({

    constructor: function ParentScrollbarUpdatingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
      // Set when before:swapOut is triggered and reset when its finishing
      // counterpart is triggered to optimize the event handlers for view
      // swapping in the region
      this._swapping = false;
      
      // Support scrollbar updates on populating and emptying regions
      this
          .listenTo(this, 'before:swapOut', function () {
            this._swapping = true;
          })
          .listenTo(this, 'swapOut', function () {
            this._swapping = false;
          })
          .listenTo(this, 'show', function () {
            this._requestScrollbarUpdate();
          })
          .listenTo(this, 'empty', function () {
            if (!this._swapping) {
              this._requestScrollbarUpdate();
            }
          });
    },

    _requestScrollbarUpdate: function () {
      // There is no connection from the current view in the region to the layout
      // view, which could be used for event triggering.  Use DOM event bubbling
      // as a workaround to reach the parent views.
      // {this.region}.{owning region manager}.{owning layout view}
      triggerScrollbarUpdate(this._parent._parent);
    }

  });

  var ParentScrollbarUpdatingBehavior = Marionette.Behavior.extend({

    constructor: function ParentScrollbarUpdatingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      if (PerfectScrollingBehavior.usePerfectScrollbar()) {
        var updateOnWindowResize = getOption.call(this, 'updateOnWindowResize');
        // Increase when before:render and before:render:collection events
        // are triggered and decrease, when their finishing counterparts are
        // triggered to optimize the event handlers for single view adding
        // or removal
        this._renderState = 0;
        
        this
        // Maintain the rendering state for the events triggered between
        // before:render and render
            .listenTo(view, 'before:render', function () {
              this._renderState = 1;
            })
            .listenTo(view, 'render', function () {
              this._renderState = 0;
              this._requestScrollbarUpdate();
            })
            // Listen to requests for an explicit scrollbar update
            .listenTo(view, 'update:scrollbar', this._requestScrollbarUpdate)
            // Delay listening to the collection events; the collection may
            // not be present in the view or its options yet
            .listenToOnce(view, 'before:render', function () {
              if (updateOnWindowResize) {
                $(window).on('resize.' + view.cid, _.bind(this._updateScrollbar, this));
                this.listenToOnce(view, 'before:destroy', function () {
                  $(window).off('resize.' + view.cid);
                });
              }
              // Support optimized adding and removing child views
              // in CollectionView, which does not call render
              if (view instanceof Marionette.CollectionView && view.collection) {
                this
                    .listenTo(view.collection, 'reset', function () {
                      this._resetTriggered = true;
                    })
                    .listenTo(view, 'before:render:collection', function () {
                      ++this._renderState;
                    })
                    .listenTo(view, 'render:collection', function () {
                      this._resetTriggered = false;
                      --this._renderState;
                      // If the collection was re-rendered after catching the
                      // 'reset' event, single child view updates were skipped
                      if (!this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'render:empty', function () {
                      // If the collection was re-rendered after catching the
                      // 'reset' event, no child view updates were performed
                      if (this._resetTriggered || !this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'add:child', function () {
                      // If a child view was added alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'remove:child', function () {
                      // If a child view was removed alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._resetTriggered && !this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    });
              }
            });
      }
    },

    _requestScrollbarUpdate: function () {
      // ChildView should proxy all events to its parent with the 'childview:'
      // prefix, but this concept supports only CollectionView.  Use DOM event
      // bubbling as a workaround to reach the parent views.
      triggerScrollbarUpdate(this.view);
    }

  }, {

    // Support showing and emptying regions in LayoutView,
    // which does not call render
    Region: ParentScrollbarUpdatingRegion

  });

  function triggerScrollbarUpdate(view) {
    // console.log('Updating parent scrollbar requested in',
    //     Object.getPrototypeOf(view).constructor.name);
    $.event.trigger('csui:update:scrollbar', {view: view}, view.el, false);
  }

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ParentScrollbarUpdatingBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tile/behaviors/impl/searching.behavior',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<form class=\"search-box binf-hidden\">\r\n  <input class=\"search\" type=\"search\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.searchPlaceholder || (depth0 != null ? depth0.searchPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchPlaceholder","hash":{}}) : helper)))
    + "\" style=\"display: none\">\r\n  <span class=\"clearer csui-icon formfield_clear\"></span>\r\n</form><span class=\"icon icon-search\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchIconTitle || (depth0 != null ? depth0.searchIconTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchIconTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.searchIconAria || (depth0 != null ? depth0.searchIconAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchIconAria","hash":{}}) : helper)))
    + "\" role=\"button\"></span>\r\n";
}});
Handlebars.registerPartial('csui_controls_tile_behaviors_impl_searching.behavior', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tile/behaviors/searching.behavior',['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/tile/behaviors/impl/searching.behavior',
  'csui/lib/jquery.ui/js/jquery-ui'
], function (_, Marionette, template) {
  "use strict";

  var SearchingBehavior = Marionette.Behavior.extend({

    defaults: {
      searchPlaceholder: 'Type to filter',
      headerTitle: '.tile-title',
      searchButton: '.tile-controls'
    },

    ui: function () {
      var headerTitle = getOption.call(this, 'headerTitle');
      return {
        headerTitle: headerTitle,
        searchBox: '.search-box',
        searchInput: '.search',
        clearer: '.clearer'
      };
    },

    triggers: {
      'click .icon-search': 'toggle:search'
    },

    constructor: function SearchingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._renderSearchButton);
      this.listenTo(view, 'toggle:search', this._toggleSearching);
    },

    _renderSearchButton: function () {
      var searchButtonSelector = getOption.call(this, 'searchButton'),
          searchButton         = this.view.$(searchButtonSelector),
          searchPlaceholder    = getOption.call(this, 'searchPlaceholder'),
          iconTitle = getOption.call(this, 'searchIconTitle'),
          searchIconTitle = iconTitle ? iconTitle : 'Search',
          iconAria = getOption.call(this, 'searchIconAria'),
          searchIconAria = iconAria ? iconAria : searchIconTitle,
          data                 = {
            searchPlaceholder: searchPlaceholder,
            searchIconTitle: searchIconTitle,
            searchIconAria: searchIconAria
          };
      searchButton.html(template(data));
      this.view._bindUIElements.call(this);
    },

    _toggleSearching: function () {
      var self = this;
      this.ui.searchInput.val('');
      this.ui.clearer.toggle(false);
      this.ui.headerTitle.toggle('fade');
      this.ui.searchBox.removeClass('binf-hidden');
      this.ui.searchInput.toggle('blind', {direction: 'right'}, 200, function () {
        if (self.ui.searchInput.is(":visible")) {
          self.ui.searchInput.trigger('focus');
        }
      });
    }

  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return SearchingBehavior;

});

/**
 * Behaviour applied to draggable item, works along with dnd.container.behaviour.js
 */
csui.define('csui/behaviors/drag.drop/dnd.item.behaviour',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone'
], function (_, $, Marionette, Backbone) {

  var DragAndDropItemBehaviour = Marionette.Behavior.extend({
    constructor: function DragAndDropItemBehaviour(options, view) {
      this.view = view;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this._registerListeners();
    },

    _registerListeners: function () {
      this.listenTo(this.view, 'render', this._initDnD);
    },

    _initDnD: function () {
      this.$el.addClass(DragAndDropItemBehaviour.DRAGGABLE_CLASSNAME);
      this.$el.attr(DragAndDropItemBehaviour.DRAGGABLE_DATA_ATTR, this.view.model.cid);
    }
  }, {
    DRAGGABLE_CLASSNAME: 'csui-draggable-item',
    DRAGGABLE_DATA_ATTR: 'data-csui-draggable-item'
  });

  return DragAndDropItemBehaviour;
});
csui.define('csui/behaviors/drag.drop/dnd.container.behaviour',['require', 'i18n', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone', 'csui/behaviors/drag.drop/dnd.item.behaviour',
  'csui/lib/jquery.ui/js/jquery-ui'
], function (require, i18n, _, $, Marionette, Backbone, DnDItemBehaviour) {

  var DragAndDropContainerBehaviour = Marionette.Behavior.extend({

    defaults: {
      placeholder: undefined, // a class or function. Undefined represents close of original element
      handle: undefined, // Restricts sort start click to the specified element.
      draggableItem: '.' + DnDItemBehaviour.DRAGGABLE_CLASSNAME,
      disableDraggable: '.csui-draggable-item-disable',
      over: false,
      receive: false,
      helper: "original" // Use original element as drag image
    },

    constructor: function DragAndDropContainerBehaviour(options, view) {
      this.view = view;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(this.view, 'render', this._initSorting);
    },

    _getPlaceholder: function (currentItem) {
      var placeholder = this.options.placeholder;
      if (!placeholder || _.isString(placeholder)) {
        var className = placeholder;
        placeholder = function () {
          var nodeName = currentItem[0].nodeName.toLowerCase(),
              element  = $("<" + nodeName + ">");

          element.addClass("ui-sortable-placeholder")
              .addClass(className || currentItem[0].className)
              .removeClass("ui-sortable-helper");
          return element;
        };
      }
      return placeholder.call(this, currentItem);
    },

    _initSorting: function () {
      var self = this;
      this.view.$el.addClass('csui-dnd-container');
      this.$el.sortable({
        items: this.options.draggableItem,
        cancel: this.options.disableDraggable,
        handle: this.options.handle,
        placeholder: {
          element: this._getPlaceholder.bind(this),
          update: function () {}
        },
        helper: this.options.helper,
        start: this._onSortStart.bind(this),
        stop: this._onSortStop.bind(this),
        over: this.options.over,
        out: this.options.out,
        receive: this.options.receive
      });
    },

    _onSortStart: function (event, ui) {
      this.$el.addClass('csui-drag-start');
      this.options.start && this.options.start(event, ui);
    },

    /**
     * Update respective Backbone colleciton on DOM changes
     */
    _onSortStop: function (event, ui) {
      this.$el.removeClass('csui-drag-start');
      var dragItemId = ui.item.attr(DnDItemBehaviour.DRAGGABLE_DATA_ATTR);
      var model = this.view.collection.get(dragItemId);
      var modelIndex = this.view.collection.indexOf(model);
      var updatedIndex = this.$el.find('[data-csui-draggable-item=' + dragItemId + ']').index();
      if (modelIndex === updatedIndex) {
        // DOM placement not changes.. no collection update required.
        return;
      }
      this.view.collection.remove(model, {silent: true});
      this.view.collection.add(model, {at: updatedIndex, silent: true});
      // Trigger sort to let CollectionView reorder views according to collection order modifications.
      this.view.collection.trigger('sort');
      this.options.stop && this.options.stop(event, ui);
    }
  });

  return DragAndDropContainerBehaviour;
});

csui.define('csui/perspectives/impl/nls/lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
  });
  
csui.define('csui/perspectives/impl/nls/root/lang',{
  invalidWidgetOptions: 'Some widgets have options that require values before the perspective can be saved. Please click on each of the highlighted widgets and check for any required options that have missing values.',
  invalidWidget: 'Some widgets are not configurable. Please remove these widgets to save.',
  widgetsMigrated: 'Single shortcut widgets were converted to shortcut group widgets.',
  widgetValidationFailed: 'Validation failed for some of the widgets.'
});

csui.define(
    'csui/perspectives/mixins/perspective.edit.mixin',['require', 'csui/lib/underscore', 'csui/lib/jquery', "csui/utils/log",
      'i18n!csui/perspectives/impl/nls/lang', 'csui/models/node/node.model',
      'csui/models/widget/widget.model',
      'csui/utils/contexts/factories/connector', 'csui/utils/perspective/perspective.util'],
    function (require, _, $, log, lang, NodeModel, WidgetModel, ConnectorFactory, PerspectiveUtil) {
      'use strict';
      /**
       * Mix provides supported functionality required for Perspective Inline Editing
       */
          // used for constant extraction, fields which when specified must be replaced with constants
          // when perspective is transported
      var CONSTANT_FIELD_TYPES = ['otcs_node_picker', 'otconws_workspacetype_id',
            'otcs_user_picker', 'otconws_metadata'];

      var PerspectiveEditMixin = {
        mixin: function (prototype) {
          return _.extend(prototype, {

            /**
             * Get prepare for perspective edit. Add required event listeners
             */
            prepareForEditMode: function () {
              this.listenTo(this, 'update:widget:options',
                  function (config) {
                    var widget = config.widgetView.model.get('widget');
                    if (widget.type === 'csui/perspective.manage/widgets/perspective.widget') {
                      widget = widget.options;
                    }
                    widget.options = config.options;
                    config.widgetView.model.set('hasValidOptions', config.isValid, {
                      silent: true
                    });
                  });
            },

            _notifyAboutWidgetMigrations: function () {
              csui.require([
                'csui/controls/globalmessage/globalmessage'
              ], function (GlobalMessage) {
                // Perspective save success
                GlobalMessage.showMessage("info", lang.widgetsMigrated);
              });
            },

            /**
             * Loads View and Manifest of the widgets provided
             *
             * @param {Array<{type: ""}>} widgets
             */
            _resolveWidgets: function (widgets) {
              var self          = this,
                  deferred      = $.Deferred(),
                  uniqueWidgets = _.chain(widgets)
                      .pluck('type')
                      .unique()
                      .map(function (id) {
                        return {id: id};
                      })
                      .value(),
                  allWidgets    = _.map(uniqueWidgets, function (w) {
                    return self._resolveWidget(w, true);
                  });

              function resolveDeprecates(widgetModel, widget) {
                if (widgetModel.useInstead) {
                  var migratedView = widgetModel.useInstead.get('view');
                  if (_.isFunction(migratedView.migrateData)) {
                    // Migrate data also to new widget
                    widget.options = migratedView.migrateData(widget.type, widget.options);
                  }
                  widget.type = widgetModel.useInstead.id;
                  widget.view = migratedView;
                  return resolveDeprecates(widgetModel.useInstead, widget);
                }
                return widgetModel;
              }

              $.whenAll.apply($, allWidgets).always(function (resolvedWidgets) {
                var foundDeprecatedWidgets = false,
                    byId                   = {};
                _.each(uniqueWidgets, function (w, index) {
                  byId[w.id] = resolvedWidgets[index];
                });

                var result = _.map(widgets, function (widget) {
                  var widgetModel = byId[widget.type];
                  var finalWidget = resolveDeprecates(widgetModel, widget);
                  if (widgetModel !== finalWidget) {
                    // Migrated
                    foundDeprecatedWidgets = true;
                  }
                  return finalWidget;
                });
                if (foundDeprecatedWidgets) {
                  self._notifyAboutWidgetMigrations();
                }
                deferred.resolve(result);
              });
              return deferred;
            },

            _resolveWidget: function (widget, supressError) {
              var self            = this,
                  deferred        = $.Deferred(),
                  _errorHandler   = function (error) {
                    if (supressError) {
                      deferred.resolve(widgetModel);
                    } else {
                      deferred.reject(error);
                    }
                  },
                  _successHandler = function () {
                    var manifest = widgetModel.get('manifest');
                    if (manifest.deprecated && manifest.useInstead) {
                      widgetModel.deprecated = manifest.deprecated;
                      self._resolveWidget({id: manifest.useInstead}).then(function (userInstead) {
                        widget.view = userInstead.view;
                        widgetModel.useInstead = userInstead;
                        deferred.resolve(widgetModel);
                      }, _errorHandler);
                    } else {
                      widget.view = widgetModel.get('view');
                      deferred.resolve(widgetModel);
                    }
                  };
              var widgetModel = new WidgetModel({id: widget.id || widget.type});
              widgetModel.fetch().then(_successHandler, _errorHandler);
              return deferred.promise();
            },

            /**
             * Serialize widget options
             */
            serializeWidget: function (model, constantsDataSeed) {//constantsDataSeed: path for constant extraction
              var deferred = $.Deferred();
              var widget = model.get('widget');
              if (widget.type === 'csui/widgets/error') {
                // Error widget indicates, original cannot load / initial widget. Respoective module might be uninstalled later.
                // Hence cannot be configurated. So retain configuration of original widget.
                widget = widget.options.originalWidget;
                // TODO Take care of constant data as it cannot be evaluated now since widget is not available.
                widget = _.pick(widget, 'type', 'kind', 'options',
                    PerspectiveUtil.getExtraWidgetKeys());
                deferred.resolve({
                  widget: widget,
                });
                return deferred.promise();
              }
              if (model.get('hasValidOptions') !== false) {
                // Has valid form options
                var type    = widget.type,
                    options = widget.options;
                delete options.___pman_opencallout;
                if (type === 'csui/perspective.manage/widgets/perspective.widget') {
                  type = options.widget.id;
                  widget.type = type;
                  options = options.options;
                }
                options = PerspectiveEditMixin.removeNullsInObject(options);
                //Fetch widget model for the widget
                this._resolveWidget(widget).done(_.bind(function (widgetModel) {
                  var widgetManifest = widgetModel ? widgetModel.get('manifest') :
                      {},
                      properties     = widgetManifest && widgetManifest.options ?
                                       widgetManifest.options : {};
                  var constantsData = [];
                  this.collectionConstantData(options, properties, constantsData,
                      constantsDataSeed + '/options');
                  widget = _.pick(widget, 'type', 'kind', PerspectiveUtil.getExtraWidgetKeys());
                  widget.options = options;
                  deferred.resolve({
                    widget: widget,
                    constantsData: constantsData
                  });
                }, this)).fail(function (error) {
                  deferred.reject({
                    error: lang.invalidWidget
                  });
                });
              } else {
                // Invalid options form
                deferred.reject({
                  error: lang.invalidWidgetOptions
                });
              }
              return deferred.promise();
            },

            //Collect attributes if any, which are needed to be replaced with constants
            collectionConstantData: function (data, options, constants, seed) {
              if (_.isEmpty(options)) {
                return;
              }
              if (_.isArray(data)) {
                //data contains items which are to be traversed
                _.each(data, function (value, key) {
                  this.collectionConstantData(value, options.items, constants, seed + '/' + key);
                }, this);
              } else if (_.isObject(data)) {
                //data contains fields which are to be traversed
                _.each(data, function (value, key) {
                  if (!!options.fields && !!options.fields[key]) {
                    this.collectionConstantData(value, options.fields[key], constants,
                        seed + '/' + key);
                  }
                }, this);
              } else if (CONSTANT_FIELD_TYPES.indexOf(options.type) !== -1) {
                //attribute which constant generation
                constants.push({
                  type: options.type,
                  path: seed
                });
              }
            },

            /**
             * Execute callbacks if any, once for each widget type in current perspective
             */
            executeCallbacks: function (models, perspectiveModel, context) {
              // Avoid executing callbacks in "Personalize" mode
              if (this.options.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE) {
                // Executing callbacks in "Personalize" mode is not required 
                // since only widget that can be created / configurated in personalize mode is shortcuts 
                // which doesn't need to callback execution.
                return $.Deferred().resolve().promise();
              }
              this.perspectiveWidgets = models;
              var deferred = $.Deferred();
              models = _.filter(models, function (config) {
                return config.widget.type !== 'csui/widgets/error';
              });
              this.loadCallbacks(models).then(_.bind(function (widgetsWithCallback) {
                var promises = _.map(widgetsWithCallback,
                    _.bind(function (widgetWithCallback) {
                      return this.initializeWidget(widgetWithCallback, perspectiveModel, context);
                    }, this));
                $.whenAll.apply($, promises)
                    .then(function () {
                      deferred.resolve();
                    }, function (error) {
                      deferred.reject(error);
                    });
              }, this));
              return deferred.promise();
            },

            loadCallbacks: function (models) {
              var self     = this,
                  deferred = $.Deferred(),
                  promises = _.chain(models)
                      .groupBy(function (model) {
                        return model.widget.type;
                      })
                      .map(function (widgetType) {
                        var deferredEach = $.Deferred();
                        self._resolveWidget(_.pick(widgetType[0].widget, 'type')).done(
                            function (widgetModel) {
                              var widgetManifest = widgetModel ? widgetModel.get('manifest') :
                                                   false,
                                  widgetCallback = widgetManifest ? widgetManifest.callback : false;
                              if (widgetCallback) {
                                require([widgetCallback], function (callback) {
                                  if (callback && _.isFunction(callback)) {
                                    widgetModel.type = widgetModel.id;
                                    deferredEach.resolve(_.extend(widgetModel, new callback()));
                                  } else {
                                    deferredEach.reject();
                                  }
                                }, function (error) {
                                  log.warn('Failed to load callback. {0}', error);
                                  deferredEach.reject(error);
                                });
                              } else {
                                deferredEach.resolve();
                              }
                            }).fail(function () {
                          // Ingore errors here since those were handled while serializing widget. For ex, Error Widget etc.,
                          deferredEach.resolve();
                        });
                        return deferredEach.promise();
                      })
                      .compact()
                      .value();
              $.whenAll.apply($, promises)
                  .then(function (results) {
                    deferred.resolve(_.compact(results));
                  });
              return deferred.promise();
            },

            initializeWidget: function (widgetWithCallback, perspectiveModel, context) {
              var deferred   = $.Deferred(),
                  widgets    = _.filter(this.perspectiveWidgets, function (widget) {
                    return widget.widget.type === widgetWithCallback.type;
                  }),
                  mode       = perspectiveModel.get('id') ? 'update' :
                               'create',
                  settings   = {
                    priority: parseInt(perspectiveModel.get('priority')) || undefined,
                    title: perspectiveModel.get('title') || '',
                    overrideType: perspectiveModel.get('overrideType'),
                    scope: perspectiveModel.get('scope') || '',
                    containerType: parseInt(perspectiveModel.get('containerType')) ||
                                   undefined,
                    perspectiveParentId: parseInt(perspectiveModel.get('override_id')) ||
                                         parseInt(perspectiveModel.get('perspectivesVolId')) ||
                                         undefined,
                    overrideObjId: parseInt(perspectiveModel.get('node')) || undefined,
                    assetContainerId: perspectiveModel.get('assetContainerId') || undefined
                  },
                  parameters = {
                    mode: mode,
                    widgets: widgets,
                    settings: settings,
                    connector: context.getObject(ConnectorFactory)
                  };
              if (mode == 'update') {
                //TODO implement getPreviousWidgets for all perspectives other than flow perspective
                var previousPerspectiveWidgets = this.getPreviousWidgets &&
                                                 this.getPreviousWidgets(perspectiveModel);
                parameters.previousWidgets = _.filter(previousPerspectiveWidgets,
                    function (widget) {
                      return widget.widget.type === widgetWithCallback.type;
                    });
              }
              var callbackPromise = this.getHiddenWidgetOptions(widgetWithCallback, parameters,
                  perspectiveModel),
                  that            = this;
              $.when(callbackPromise)
                  .done(_.bind(function (responseParameters) {
                    //TODO refactor the execution of retrieving and validating new widget options
                    /*var responseWidgets = (_.has(responseParameters, 'widgets')) ?
                                               responseParameters.widgets : [];

                        // iterate the returned widgets array to get new options
                        _.each(responseWidgets, _.bind(function (item) {
                          if (_.has(item, 'newOptions') && _.isObject(item.newOptions)) {
                            //TODO refactor with appropriate attributes
                            var existingObjPath = 'perspective' +
                                                  this.convertJSONPointerToPath(item.widgetBaseLocation),
                                existingObj     = this.getDeepProperty(perspectiveModel,
                                    existingObjPath);

                            // options before changes
                            item.oldOptions = _.deepClone(item.widget.options);
                            // iterate the widget options and remove any bogus properties that have not been defined in the widget's manifest
                            _.each(item.newOptions, function (value, key) {
                              var manifest=widgetWithCallback.get('manifest');
                              if (!_.has(manifest.schema.properties, key) ||
                                  !_.has(manifest.options.fields[key], 'hidden') ||
                                  !manifest.options.fields[key].hidden) {
                                delete(item.newOptions[key]);
                              }
                            });
                            // update the options
                            _.deepExtend(existingObj, item.newOptions);
                          }
                      }, this));*/
                    deferred.resolve();
                  }, this))
                  .fail(function (error) {
                    deferred.reject(error[0] || error);
                  });
              return deferred.promise();
            },

            getHiddenWidgetOptions: function (widgetWithCallback, parameters, perspectiveModel) {
              var deferredOptions        = $.Deferred(),
                  deferredContainer      = $.Deferred(),
                  widgetPromises         = [],
                  errors                 = [],
                  ensureContainerPromise = deferredContainer.promise(), // note: no response argument - i.e. an empty promise
                  useOverrideContainer   = false;

              // check that the callback object is valid
              if (!widgetWithCallback || !_.has(widgetWithCallback, 'defineWidgetOptionsCommon') ||
                  !_.has(widgetWithCallback, 'defineWidgetOptionsEach')) {
                deferredOptions.reject();
                return deferredOptions.promise();
              }

              // the callback should have an ensureContainer() function that returns a promise
              if (_.has(widgetWithCallback, 'ensureContainer') &&
                  _.isFunction(widgetWithCallback.ensureContainer)) {
                // call ensureContainer() function to create a container in the assets volume
                if (widgetWithCallback.ensureContainer(parameters)) {
                  ensureContainerPromise = this.ensureContainer(parameters);
                } else {
                  useOverrideContainer = true;
                }
              } else {
                useOverrideContainer = true;
              }

              if (useOverrideContainer) {
                // no need to call ensureContainer(), so resolve with an empty promise
                deferredContainer.resolve();
              }

              $.when(ensureContainerPromise).done(function (response) {
                // when asset container is known to exist

                if (!_.has(parameters.settings, 'assetContainerId') ||
                    _.isUndefined(parameters.settings.assetContainerId)) {
                  // the assetContainerId is the id of where the asset will be added. e.g. either in the Perspective Assets Volume, or the container that the perspective overrides
                  var id = (response) ? response.id : parameters.settings.overrideObjId, // no response if ensureContainer was an empty promise
                      ac = {assetContainerId: id};

                  _.extend(parameters.settings, ac); // the containerId is required by the callback
                  perspectiveModel.set(ac);
                }

                var promiseBefore = widgetWithCallback.defineWidgetOptionsCommon(parameters);

                // check callback returns something that looks like a promise
                if (!promiseBefore || typeof promiseBefore != 'object' ||
                    !_.has(promiseBefore, 'state')) {
                  // looks like the callback didn't return a promise, so reject the deferred and return from this function immediately
                  deferredOptions.reject();
                  return deferredOptions.promise();
                }

                // when common options have been processed
                $.when(promiseBefore).done(function (commonOptions) {
                  if (_.has(parameters, 'widgets') && _.isArray(parameters.widgets)) {

                    _.each(parameters.widgets, function (item, index) {
                      // first add any common option properties

                      if (!_.has(item, 'newOptions')) {
                        item.newOptions = {};
                      }

                      _.extend(item.newOptions, commonOptions);

                      // next apply any widget-specific options
                      widgetPromises.push(widgetWithCallback.defineWidgetOptionsEach(item,
                          parameters));
                      $.when(widgetPromises[index])
                          .done(function (newOptions) {
                            _.extend(item.newOptions, newOptions);
                          })
                          .fail(function (errorMsg) {
                            errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                          });
                    });

                    // when all widgets have been processed
                    $.when.apply(this, widgetPromises)
                        .done(function () {
                          // all done
                          deferredOptions.resolve(parameters);
                        })
                        .fail(function (errorMsg) {
                          errors.push(errorMsg);
                          deferredOptions.reject(errors); // errors array returned to perspective manager
                        });
                  }

                })
                    .fail(function (errorMsg) {
                      errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                      deferredOptions.reject(errors);
                    });
              })
                  .fail(function (error) {
                    deferredContainer.reject(error);
                    // Also reject the deferredOptions promise so the error is reported
                    deferredOptions.reject([error]);
                  });

              return deferredOptions.promise();
            },

            ensureContainer: function (parameters) {
              // ensures that a container exists for perspective assets created by callbacks.

              var deferredContainer = $.Deferred();

              function uniqueId() {
                // using a timestamp alone does not guard against 2 users near-simultaneously attempting to create an asset container with the same name, whereas combination of timestamp and ~16 digit random suffix makes it practically impossible (1 in 1e+32)
                return _.now() + Math.random().toString().substring(2);
              }

              //TODO: update scenario: need to identify if an assetcontainer exists and what it's ID is (it might not, if e.g. the perspective didn't previously contain a wiki tile)
              if (_.has(parameters.settings, 'assetContainerId') &&
                  !isNaN(parseInt(parameters.settings.assetContainerId))) {
                // assetContainerId already exists, nothing to do
                // this is the case if there are more than one wiki tiles
                deferredContainer.resolve(false);
              } else {
                this.perspectiveAssetsVolume = new NodeModel(
                    {
                      id: 'volume',
                      type: 954
                    },
                    {
                      connector: parameters.connector
                    });
                this.perspectiveAssetsVolume.fetch().then(_.bind(function () {
                  var collectOptions = {
                    url: parameters.connector.connection.url + '/nodes',
                    type: 'POST',
                    data: {
                      type: 955,
                      parent_id: this.perspectiveAssetsVolume.get('id'),
                      name: 'assets_' + uniqueId()
                    },
                    success: function (response) {
                      deferredContainer.resolve(response);
                    },
                    error: function (error) {
                      deferredContainer.reject(error.responseJSON);
                    }
                  };

                  parameters.connector.makeAjaxCall(collectOptions).done(function (resp) {
                    deferredContainer.resolve(resp);
                  }).fail(function (resp) {
                    deferredContainer.reject(resp);
                  });
                }, this));
              }

              return deferredContainer.promise();
            },

            /*convertJSONPointerToPath: function (jpath) {
              // converts JSONPointer path notation to standard JS dotted/bracketed notation
              if (jpath) {
                var path = jpath.split('/');
                path = path.reduce(function (memo, item) {
                  if (Number(item)) {
                    return memo + '[' + item + ']';
                  } else {
                    return memo + '.' + item;
                  }
                });
                return path;
              }
            },

            getDeepProperty: function (obj, path) {
              // gets properties deep within an object, by passing in a path string 'key' in dotted form e.g. 'foo.bar.thing'
              var keys  = path.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./,
                      '').split('.'),
                  value = false;

              for (var i = 0, n = keys.length; i < n; i++) {
                var property = keys[i];
                if (property in obj) {
                  obj = obj[property];
                } else {
                  return;
                }
              }
              return obj;

            }*/
            getEmptyPlaceholderWidget: function (options) {
              options || (options = this.options);
              return {
                type: PerspectiveUtil.getEmptyPlaceholderWidgetType(options.perspectiveMode),
                className: 'csui-draggable-item-disable',
                __isPlacehoder: true, // To differentiate this from general shortcutgroup widget
                options: {}
              };
            },

            isEmptyPlaceholder: function (widget) {
              return PerspectiveUtil.isEmptyPlaceholder(widget, this.options.perspectiveMode);
            },

            /**
             * Validate the existance and uniqueness IDs to widgets.
             * Also generates unique IDs to new widgets.
             *
             * @param {*} widgets
             * @returns {Boolean} True if all widgets are valid, false otherwise.
             */
            validateAndGenerateWidgetId: function (widgets) {
              _.each(widgets, function (w, index) {
                if (!PerspectiveUtil.hasWidgetId(w)) {
                  // No widget Id yet, generate one
                  w[PerspectiveUtil.KEY_WIDGET_ID] = PerspectiveUtil.generateWidgetId(
                      this.options.perspectiveMode) + index;
                }
              }, this);

              var widgetIds = _.pluck(widgets, PerspectiveUtil.KEY_WIDGET_ID);
              if (widgetIds.length !== _.uniq(widgetIds).length) {
                // Has duplicate Ids
                log.warn('Found duplicate widget IDs: {0}', widgetIds) && console.warn(log.last);
                return false;
              }
              var allWidgetsHasIds = _.every(widgets, PerspectiveUtil.hasWidgetId);
              if (!allWidgetsHasIds) {
                // Few widgets has no widget ID assigned to it
                log.warn('Found widgets with No Ids: {0}', widgets) && console.warn(log.last);
                return false;
              }
              return true;
            }
          });
        },

        //remove null and undefined objects from options form
        removeNullsInObject: function (obj) {

          function _checkAndRemove(value, key) {
            if (typeof value === 'object' || _.isArray(value)) {
              PerspectiveEditMixin.removeNullsInObject(value);
            }
            if (_.isNull(value) || _.isUndefined(value) || value.length === 0 ||
                (_.isObject(value) && _.isEmpty(value))) {
              if (_.isArray(obj)) {
                obj.splice(key, 1);
              } else {
                delete obj[key];
              }
            }
          }

          if (_.isArray(obj)) {
            for (var i = obj.length - 1; i >= 0; i--) {
              _checkAndRemove(obj[i], i);
            }
          } else {
            _.each(obj, _checkAndRemove);
          }
          return obj;
        }
      };

      return PerspectiveEditMixin;
    });

csui.define('csui/perspectives/flow/impl/nls/lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
  });
  
csui.define('csui/perspectives/flow/impl/nls/root/lang',{
    tileLabel: 'Single Width',
    headerLabel: 'Double Width',
    fullpageLabel: 'Full Page'
  });
  


csui.define('css!csui/perspectives/impl/perspective',[],function(){});

csui.define('css!csui/perspectives/flow/impl/flow.perspective',[],function(){});
// Loads widgets and renders them in a single row of grid cells
csui.define('csui/perspectives/flow/flow.perspective.view',['require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/models/widget/widget.collection',
  'csui/utils/base',
  'csui/controls/grid/grid.view', 'csui/utils/log',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/behaviors/drag.drop/dnd.item.behaviour',
  'csui/behaviors/drag.drop/dnd.container.behaviour',
  'csui/perspectives/mixins/perspective.edit.mixin',
  'csui/utils/perspective/perspective.util',
  'i18n!csui/perspectives/flow/impl/nls/lang',
  'i18n!csui/perspectives/impl/nls/lang',
  'css!csui/perspectives/impl/perspective',
  'css!csui/perspectives/flow/impl/flow.perspective'
], function (require, module, _, $, Backbone, Marionette, WidgetCollection, base, GridView,
    log, WidgetContainerBehavior, DnDItemBehaviour, DnDContainerBehaviour, PerspectiveEditMixin,
    PerspectiveUtil,
    lang, commonLang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultWidgetKind: 'tile',
    widgetSizes: {
      fullpage: {
        widths: {
          xs: 12
        },
        heights: {
          xs: 'full'
        }
      },
      header: {
        widths: {
          xs: 12,
          md: 8,
          xl: 6
        }
      },
      widetile: {
        widths: {
          xs: 12,
          lg: 6
        }
      },
      tile: {
        widths: {
          xs: 12,
          sm: 6,
          md: 4,
          xl: 3
        }
      }
    }
  });

  var FlowPerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-flow-perspective grid-rows',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        if (!widget.view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved:' +
                     widget['error']
          });
        }
        return widget.view;
      }
    },

    cellViewOptions: function (model, cellView) {
      var widget = model.get('widget');
      var cellOptions = {
        context: this.options.context,
        data: widget && widget.options || {},
        // widgets in the grid should create their own model instead
        // of using the grid cell model
        model: undefined,
        perspectiveMode: this.options.perspectiveMode,
        widgetContainer: cellView
      };
      cellOptions[PerspectiveUtil.KEY_WIDGET_ID] = widget[PerspectiveUtil.KEY_WIDGET_ID];
      return cellOptions;
    },

    cellConstructionFailed: function (model, error) {
      var widget = model.get('widget');
      if (widget) {
        var errorWidget = WidgetContainerBehavior.getErrorWidget(widget, error.message);
        model.set('widget', _.defaults(errorWidget, widget.attributes));
      }
    },

    constructor: function FlowPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      this._preInitialize(options);
      GridView.prototype.constructor.call(this, options);
      this._postInitialize();
    },

    _preInitialize: function (options) {
      options.widgets || (options.widgets = []);
      if (!!options.perspectiveMode) {
        this._prepareOptionsForEditMode(options);
        this.prepareForEditMode();
      } else {
        options.widgets = _.reject(options.widgets, PerspectiveUtil.isHiddenWidget, this);
      }
      if (!options.collection) {
        var extWidgets = _.chain(config)
            .pick(function (value, key) {
              return key.indexOf('-widgets') >= 0;
            })
            .values()
            .flatten();

        if (extWidgets && extWidgets._wrapped && extWidgets._wrapped.length > 0) {
          options.widgets = _.filter(options.widgets, function (widget) {
            return _.contains(extWidgets._wrapped, widget.type);
          });
        }
        options.widgets = _.filter(options.widgets, function (widget) {
          return base.filterUnSupportedWidgets(widget, config) != undefined;
        });

        options.collection = this._createCollection(options);
      }
    },

    _postInitialize: function () {
      if (!!this.options.perspectiveMode) {
        this._registerEditEvents();
      }
    },

    /**
     * Tasks:
     *  - Add a empty placeholder to the widgets based on `perspectiveMode`
     *  - Enable widget configuration to all cells of the group by adding respective behaviors
     *  - Allow dragging of cells to reorder
     *  - Enable DnD to entire row for re-ordering.
     *
     */
    _prepareOptionsForEditMode: function (options) {
      var self = this;
      // Insert Empty Placeholder widget before hidden widgets
      var firstHiddenIdx = _.findIndex(options.widgets, PerspectiveUtil.isHiddenWidget, this);
      if (firstHiddenIdx === -1) {
        // No Hidden widget, add placeholder to last
        firstHiddenIdx = options.widgets.length;
      }
      options.widgets.splice(firstHiddenIdx, 0, this.getEmptyPlaceholderWidget(options));

      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this,
          perspectiveMode: options.perspectiveMode
        },
        DnDItemBehaviour: { // For DnD widget
          behaviorClass: DnDItemBehaviour
        }
      };

      this._createDnDPlaceholderWidget();

      function addCell(widgetConfig, index) {
        var newCell = self._prepareGridCell(widgetConfig, index);
        var cells = self.collection.at(0).columns;
        cells.add(newCell, {at: index});
        self.options.context.fetch();
      }

      options.reorderOnSort = true; // To let reorder views on collection reorder (DnD reorder)
      options.rowBehaviours = {
        DnDContainerBehaviour: {
          behaviorClass: DnDContainerBehaviour,
          placeholder: this._getDnDPlaceholder.bind(this),
          handle: '.csui-pman-widget-masking', // Limit re-ordering to mask (avoids callout popover),
          helper: 'clone', // Use clone of the original element as drag image to preserve styles of original element as it is.
          start: function (event, ui) {
            //hiding popover on drag start
            var popoverTarget = self.$el.find(".binf-popover");
            if (popoverTarget.length) {
              popoverTarget.removeClass("pman-ms-popover");
              popoverTarget.hide();
              popoverTarget.binf_popover('destroy');
            }
          },
          over: _.bind(function (event, ui) {
            var placeholderWidget = this._getDnDPlaceholder(ui.helper);
            var placeholder = ui.placeholder;
            placeholder.show();
            // Update DnD placeholder with widget styles
            placeholder.attr('class', placeholderWidget.attr('class'));
            placeholder.html(placeholderWidget.html());
            placeholder.css('visibility', 'visible');
            // FIXME: Remove transfer data to placeholder. Instead set data to ui.item
            placeholder.data('pman.widget', ui.helper.data('pman.widget'));
            placeholder.removeData('isBeyondLayout');
            if (!!ui.helper.data('pman.widget')) { // "pman.widget" is not available when reorder within flow
              // Preload widget's view which is going to be drop to get ready with manifest etc., to avoid delay in placing widget immeditly on drop
              this._resolveWidget({
                type: ui.helper.data('pman.widget').id
              }).done(
                  function (resolvedWidget) {
                    placeholder.data('pman.widget.view', resolvedWidget);
                  });
            }
          }, this),
          out: function (event, ui) {
            ui.placeholder.hide();
            ui.placeholder.data('isBeyondLayout', true);
          },
          receive: _.bind(function (event, ui) {
            if (ui.placeholder.data('isBeyondLayout') === true ||
                !ui.placeholder.data("pman.widget.view")) {
              // Dropped outside the placeholder.
              ui.sender.sortable("cancel");
              return;
            }
            if (ui.position.top > 0) {
              var newWidget = ui.placeholder.data('pman.widget'),
                  index     = ui.item.index(), // this.$el.find('.binf-row >div').index(ui.item);
                  manifest  = newWidget.get('manifest');

              var widget,
                  preloadedWidgetView = ui.placeholder.data("pman.widget.view");
              if (PerspectiveUtil.isEligibleForLiveWidget(manifest)) {
                widget = {
                  type: newWidget.id,
                  kind: manifest.kind,
                  view: preloadedWidgetView.get('view')
                };
              } else {
                widget = {
                  type: 'csui/perspective.manage/widgets/perspective.widget',
                  kind: manifest.kind,
                  options: {
                    options: {}, // To be used and filled by callout form
                    widget: newWidget
                  },
                  view: (preloadedWidgetView = this.pespectiveWidgetView)
                };
              }
              widget.options = _.extend({___pman_isdropped: true}, widget.options);

              if (!preloadedWidgetView) {
                // Widget's view is not loaded yet, load view to attach new cell
                this._resolveWidget(widget).done(function (resolvedWidget) {
                  addCell(widget, index);
                });
              } else {
                // Widget's view preloaded on, ready to attach the cell.
                addCell(widget, index);
              }
            }
            // Move Placeholder widget to last
            this._ensurePlaceholder();

            // Cancel sort event since placing widget manually here.
            ui.sender.sortable("cancel");
          }, this),
          stop: _.bind(function () {
            this._ensurePlaceholder();
          }, this)
        }
      };
    },

    /**
     * Make sure placeholder exist, and at right position based on perspectiveMode.
     * If `edit` - placeholder must be at the end.
     * If `personalization` - placeholder must be between enabled and hidden widgets.
     *
     */
    _ensurePlaceholder: function () {
      var cells = this.collection.at(0).columns,
          self  = this;
      var placeholderCell = cells.find(function (cell) {
        return this.isEmptyPlaceholder(cell.get("widget"));
      }, this);
      if (!placeholderCell) {
        // No placeholder. Hence create a new one
        var placeholderWidget = this.getEmptyPlaceholderWidget();
        this._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
          var newCell = self._createCell(placeholderWidget, resolvedWidget, cells.length);
          var position = self._getPlaceholderIdealIndex();
          cells.add(newCell, {at: position + 1});
        });
      } else {
        // Placeholder exist, check if it is at the right position.
        var currentIndex = cells.indexOf(placeholderCell),
            idealIndex   = this._getPlaceholderIdealIndex(currentIndex);
        if (currentIndex !== idealIndex) {
          cells.remove(placeholderCell);
          cells.add(placeholderCell, {at: idealIndex});
        }
      }
    },

    _getPlaceholderIdealIndex: function (currentPlaceIndex) {
      var cells    = this.collection.at(0).columns,
          position = cells.length;
      currentPlaceIndex = currentPlaceIndex || -1;
      switch (this.options.perspectiveMode) {
      case PerspectiveUtil.MODE_PERSONALIZE:
        // Keep the placeholder widget after last active element.
        while (position-- > currentPlaceIndex) {
          if (!PerspectiveUtil.isHiddenWidget(cells.at(position).get('widget'))) {
            break;
          }
        }
        return position;
      case PerspectiveUtil.MODE_EDIT_PERSPECTIVE:
        return position - 1;
      default:
        return currentPlaceIndex;
      }
    },

    /**
     * Create a empty placeholder widget to be used to show as DnD watermark placeholder
     */
    _createDnDPlaceholderWidget: function () {
      var self              = this,
          placeholderWidget = {
            type: 'csui/perspective.manage/widgets/perspective.placeholder',
          };
      this._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
        var cellOptions = self._createCell(placeholderWidget, resolvedWidget, 0);
        cellOptions.className = "pman-dnd-hover-placeholder";
        self.dndPlaceholderCell = new GridView.CellView({
          grid: self,
          model: new Backbone.Model(cellOptions)
        });
        self.dndPlaceholderCell.render();
      });

      this._resolveWidget({
        type: 'csui/perspective.manage/widgets/perspective.widget'
      }).done(function (resolvedWidget) {
        self.pespectiveWidgetView = resolvedWidget.get('view');
      });
    },

    /**
     * Prepare placeholder watermark for widget currently dropping
     */
    _getDnDPlaceholder: function (dragEl) {
      var widget = dragEl.data('pman.widget');
      if (!!widget) {
        var kind = widget.attributes.manifest.kind;
        if (!kind) {
          kind = config.defaultWidgetKind;
        }
        var sizes = config.widgetSizes[kind];
        // Update watermark widget with current droping widget sizes
        this.dndPlaceholderCell.model.set({
          sizes: sizes.widths,
          heights: sizes.heights
        });
      }
      return this.dndPlaceholderCell.$el;
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        var cells = self.collection.at(0).columns;
        var model = widgetView.model;
        cells.remove(model);
      });

      this.listenTo(this, 'update:widget:size', function (widgetView, kind) {
        var sizes  = config.widgetSizes[kind],
            widget = widgetView.model.get('widget');
        widget.kind = kind;
        widgetView.model.set({
          sizes: sizes.widths,
          heights: sizes.heights,
          widget: widget
        });
      });

      this.listenTo(this, 'replace:widget', this._replaceWidget);
      this.listenTo(this, 'hide:widget show:widget', function (cell) {
        this._ensurePlaceholder();
      });
      if (this.options.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE) {
        // Since shortcut group is being used as placeholder, 
        // a new empty placeholder (shortcuts) needs to be created on configurating it.
        // Hence, listen to options update, if shortcut group which is acting as placeholder is update, 
        // Create a new shortcut group to act as placeholder widget.
        this.listenTo(this, 'update:widget:options', function (config) {
          var cell   = config.widgetView,
              widget = cell.model.get('widget');
          if (this.isEmptyPlaceholder(widget)) {
            delete widget.__isPlacehoder;
            // Remove "drag disabling" to this shortcut can now be reorderable
            cell.model.unset('className', {silent: true});
            cell.$el.removeClass('csui-draggable-item-disable');
            this._ensurePlaceholder();
          }
        });
      }
    },

    _replaceWidget: function (currentWidget, widgetToReplace) {
      if (!this.getPManPlaceholderWidget) {
        // 'getPManPlaceholderWidget' Provided by pman.config.behaviour
        return;
      }
      var self = this;
      var cells = this.collection.at(0).columns;
      // Load new widget
      this._resolveWidget(widgetToReplace).done(function () {
        // Replace current widget with new widget
        if (!self.isEmptyPlaceholder(currentWidget.model.get('widget'))) {
          // Preserve widget kind if dropping on existing widget
          widgetToReplace.kind = currentWidget.model.get('widget').kind;
        }
        var widgetUpdates = self._prepareGridCell(widgetToReplace,
            cells.indexOf(currentWidget.model));
        self.options.context.clear();
        currentWidget.model.set(widgetUpdates);
        self.options.context.fetch();
        // Check if has any placeholders, otherwise add new placeholder widget
        self._ensurePlaceholder();
      });
    },

    _createCollection: function (options) {
      var self = this,
          rows = new Backbone.Collection();

      if (!!options.perspectiveMode) {
        this.widgetsResolved = this._resolveWidgets(options.widgets)
            .always(function (resolvedWidgets) {
              var firstRow = rows.add({});
              var columns = _.map(options.widgets, function (widget, index) {
                return self._createCell(widget, resolvedWidgets[index], index);
              });
              firstRow.columns = new Backbone.Collection(columns);
              return resolvedWidgets;
            });
      } else {
        var uniqueWidgets = _.chain(options.widgets)
            .pluck('type')
            .unique()
            .map(function (id) {
              return {id: id};
            })
            .value();
        var resolvedWidgets = new WidgetCollection(uniqueWidgets);
        this.widgetsResolved = resolvedWidgets
            .fetch()
            .then(function () {
              var firstRow = rows.add({});
              firstRow.columns = self._createColumns(options.widgets, resolvedWidgets);
              return resolvedWidgets;
            });
      }
      return rows;
    },

    _createColumns: function (widgets, resolvedWidgets) {
      var columns = _.map(widgets, function (widget, columnIndex) {
        var resolvedWidget = resolvedWidgets.get(widget.type);
        return this._createCell(widget, resolvedWidget, columnIndex);
      }.bind(this));
      return new Backbone.Collection(columns);
    },

    _prepareGridCell: function (widgetConfig, columnIndex) {
      var kind = widgetConfig.kind;
      if (!kind) {
        kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[kind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        className: widgetConfig.className,
        widget: _.defaults({kind: kind, cellAddress: 'grid0:r0:c' + columnIndex}, widgetConfig)
      };
    },

    _createCell: function (widget, resolvedWidget, columnIndex) {
      var widgetView     = resolvedWidget.get('view'),
          manifest       = resolvedWidget.get('manifest') || {},
          supportedKinds = manifest.supportedKinds,
          kind           = widget.kind;
      if (!kind || !supportedKinds || !_.contains(supportedKinds, kind)) {
        kind = manifest.kind;
      }
      widget.kind = kind;
      if (widgetView) {
        widget.view = widgetView;
        return this._prepareGridCell(widget, columnIndex);
      }
      var error = resolvedWidget.get('error');
      log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
      && console.warn(log.last);
      var sizes = config.widgetSizes[config.defaultWidgetKind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        widget: WidgetContainerBehavior.getErrorWidget(widget, error)
      };
    },

    /**
     * Returns supported widgets sizes(kinds) for given widget
     */
    getSupportedWidgetSizes: function (manifest, widget) {
      return _.map(manifest.supportedKinds, function (suppKind) {
        return {
          kind: suppKind,
          label: lang[suppKind + 'Label'],
          selected: widget.model.get('widget').kind === suppKind
        };
      });
    },

    serializePerspective: function (perspectiveModel) {
      var self         = this,
          deferred     = $.Deferred(),
          cells        = this.collection.at(0).columns,
          widgetModels = cells.filter(function (cell) {
            return !this.isEmptyPlaceholder(cell.get('widget'));
          }, this);

      var widgetPromises = widgetModels.map(function (widget, index) {
        return self.serializeWidget(widget, '/options/widgets/' + index);
      });
      $.whenAll.apply($, widgetPromises).done(function (results) {
        self.executeCallbacks(results, perspectiveModel, self.options.context).done(function () {
          var widgets           = _.pluck(results, 'widget'),
              constant_data     = _.flatten(_.pluck(results, 'constantsData')),
              perspectiveResult = {
                perspective: {
                  type: 'flow',
                  options: {widgets: widgets}
                },
                constant_data: constant_data,
                constant_extraction_mode: 1
              };
          var isAllWidgetsValid = self.validateAndGenerateWidgetId(widgets);
          if (!isAllWidgetsValid) {
            deferred.reject(commonLang.widgetValidationFailed);
          } else {
            deferred.resolve(perspectiveResult);
          }
        }).fail(function (results) {
          // TODO Group errors
          results = _.filter(results, function (result) {return !!result.error});
          deferred.reject(results[0].error);
        });
      }, this).fail(function (results) {
        // TODO Group errors
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });
      return deferred.promise();
    },

    getPreviousWidgets: function (perspectiveModel) {
      var perspective     = perspectiveModel.getPerspective(),
          previousWidgets = perspective &&
                            perspective.options ?
                            perspective.options.widgets :
              {};
      previousWidgets = _.map(previousWidgets, function (widget) {
        return {widget: widget};
      });
      return previousWidgets;
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  // TODO add mixin dynamically for edit mode only
  PerspectiveEditMixin.mixin(FlowPerspectiveView.prototype);
  return FlowPerspectiveView;

});

// Loads widgets and renders them in a grid
csui.define('csui/perspectives/grid/grid.perspective.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'css!csui/perspectives/impl/perspective'
], function (module, _, $, Marionette,
    base,
    GridView,
    WidgetContainerBehavior) {

  var config = module.config();

  var GridPerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-grid-perspective grid-rows',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        // widgets in the grid should create their own model instead
        // of using the grid cell model
        model: undefined
      };
    },

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    constructor: function GridPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      var rows = options.rows;
      if (rows && rows.length > 0 && config.supportedWidgets) {
        var columns = rows[0].columns;
        rows[0].columns = _.filter(columns, function (column) {
          return _.contains(config.supportedWidgets, column.widget.type);
        });

        if (columns.length > 1 && config.widgetSizes) {
          _.each(columns, function (column) {
            column.sizes = config.widgetSizes;
            column.heights = {};
          });
        }
      }

      _.each(rows, function (row) {
        row.columns = _.filter(row.columns, function (column) {
          return base.filterUnSupportedWidgets(column.widget, config) != undefined;
        });
      });

      GridView.prototype.constructor.call(this, options);
    },

    enumerateWidgets: function (callback) {
      this._enumerateWidgetRow(this.options.collection, callback);
    },

    _enumerateWidgetRow: function (rows, callback) {
      rows.each(function (row) {
        row.columns.each(function (column) {
          var widget = column.get('widget');
          widget && callback(widget);
          if (column.rows) {
            this._enumerateWidgetRow(column.rows, callback);
          }
        }, this);
      }, this);
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  return GridPerspectiveView;

});


csui.define('css!csui/perspectives/zone/impl/zone.perspective',[],function(){});
// Base for perspectives placing widgets to named grid cells - zones
csui.define('csui/perspectives/zone/zone.perspective.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/perspectives/mixins/perspective.edit.mixin',
  'css!csui/perspectives/impl/perspective',
  'css!csui/perspectives/zone/impl/zone.perspective'
], function (module, _, $, Backbone, Marionette, base, GridView, WidgetContainerBehavior,
    PerspectiveEditMixin) {

  var config = module.config();

  var ZonePerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-zone-perspective grid-rows ',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model, cellView) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        // widgets in the grid should create their own model instead
        // of using the grid cell model
        model: undefined,
        perspectiveMode: this.options.perspectiveMode,
        widgetContainer: cellView
      };
    },

    cellConstructionFailed: function (model, error) {
      var widget = model.get('widget');
      if (widget) {
        var errorWidget = WidgetContainerBehavior.getErrorWidget(widget, error.message);
        model.set('widget', _.defaults(errorWidget, widget.attributes));
      }
    },

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    constructor: function ZonePerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (!options.collection) {
        options.collection = this._createCollection(options);
      }
      options.collection.each(function (row, rowIndex) {
        row.columns.each(function (column, colIndex) {
          column.get('widget').cellAddress = 'grid0:r' + rowIndex + ':c' + colIndex;
        });
      });
      if (options.perspectiveMode === 'edit') {
        this.prepareForEditMode();
      }
      GridView.prototype.constructor.call(this, options);
    },

    _createCollection: function (options) {
      var rows      = new Backbone.Collection(),
          zoneNames = getOption.call(this, 'zoneNames');
      _.extend(config, {'unSupportedWidgets': getOption.call(this, 'unSupportedWidgets')});
      _.mapObject(options, function (val, key) {
        if (_.contains(zoneNames, key)) {
          if (!base.filterUnSupportedWidgets(val, config)) {
            options[key] = undefined;
          }
        }
      });

      var layoutName = this._getLayoutName(options);

      if (layoutName) {
        var zoneLayouts = getOption.call(this, 'zoneLayouts'),
            zoneLayout  = zoneLayouts[layoutName];
        if (zoneLayout) {
          var row     = rows.add({}),
              columns = _.map(zoneLayout.zoneOrder, function (zone) {
                var zoneConfig = _.defaults({
                  widget: options[zone]
                }, zoneLayout.zoneSizes[zone]);
                if (options[zone].className) {
                  zoneConfig.className = (zoneConfig.className || '') + ' ' + options[zone].className;
                }
                return zoneConfig;
              });

          row.columns = new Backbone.Collection(columns);
        } else {
          throw new Marionette.Error({
            name: 'InvalidLayoutContentError',
            message: 'Missing widget in the important perspective zone'
          });
        }
      }
      return rows;
    },

    /**
     * Calculates and returns layout to use based on the options configured
     */
    _getLayoutName: function (options) {
      var zoneNames = getOption.call(this, 'zoneNames');
      return _.reduce(zoneNames, function (result, zone) {
        if (options[zone] && !_.isEmpty(options[zone])) {
          result && (result += '-');
          result += zone;
        }
        return result;
      }, '');
    },

    enumerateWidgets: function (callback) {
      var zoneNames = getOption.call(this, 'zoneNames'),
          widgets   = _.compact(_.map(zoneNames, function (zone) {
            var zoneContent = this.options[zone];
            return !_.isEmpty(zoneContent) && zoneContent;
          }, this));

      if (this.options.perspectiveMode === 'edit') {
        var deferreds = _.map(widgets, function () {
          var deferred = $.Deferred();
          callback(deferred);
          return deferred;
        });
        this._resolveWidgets(widgets).then(function (widgetModel) {
          _.each(widgets, function (widget, index) {
            deferreds[index].resolve(widget);
          });
        });
      } else {
        _.each(widgets, callback, this);
      }
    },

    /**
     * Serilize Zone options to save
     */
    serializeOptions: function (perspectiveModel) {
      var self        = this,
          deferred    = $.Deferred(),
          layoutName  = this._getLayoutName(this.options),
          zoneLayouts = getOption.call(this, 'zoneLayouts'),
          zoneLayout  = zoneLayouts[layoutName],
          cells       = this.collection.at(0).columns;
      var widgetPromises = _.map(zoneLayout.zoneOrder, function (zone, index) {
        if (cells.at(index).get('widget').type ===
            'csui/perspective.manage/widgets/perspective.placeholder') {
          // Placeholder, no widget placed on this zone. Hence empty options
          return $.Deferred().resolve({
            zone: zone,
            config: {widget: {}}
          });
        }
        // Resolve and Serialize widget options
        return self.serializeWidget(cells.at(index), '/options/' + zone).then(function (result) {
          return {
            zone: zone,
            config: result
          };
        });
      });

      $.whenAll.apply($, widgetPromises).done(function (results) {
        var widgets = _.map(_.filter(results, function (layout) {
          return layout.config && layout.config.widget && !_.isEmpty(layout.config.widget);
        }), function (layout) {
          return layout.config;
        });
        self.executeCallbacks(widgets, perspectiveModel, self.options.context).done(function () {
          // Resolve promise with options
          deferred.resolve(results);
        }).fail(function (results) {
          results = _.filter(results, function (result) {return !!result.error});
          deferred.reject(results[0].error);
        });
      }).fail(function (results) {
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });

      return deferred.promise();
    },

    getPreviousWidgets: function (perspectiveModel) {
      var perspective     = perspectiveModel.get('perspective'),
          layoutName      = this._getLayoutName(this.options),
          zoneLayouts     = getOption.call(this, 'zoneLayouts'),
          zoneLayout      = zoneLayouts[layoutName],
          previousWidgets = {};

      if (zoneLayout && zoneLayout.zoneOrder) {
        previousWidgets = _.map(_.filter(zoneLayout.zoneOrder, function (zone) {
          return perspective && perspective.options && !_.isEmpty(perspective.options[zone]);
        }), function (zone) {
          return {widget: perspective.options[zone]};
        });
      }

      return previousWidgets;
    }

  });

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
    return _.isFunction(value) ? value.call(this) : value;
  }

  // TODO add mixin dynamically for edit mode only
  PerspectiveEditMixin.mixin(ZonePerspectiveView.prototype);

  return ZonePerspectiveView;

});

// Loads widgets and renders them in a left-center-right zone layout
csui.define('csui/perspectives/left-center-right/left-center-right.perspective.view',['require', 'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/perspectives/zone/zone.perspective.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'i18n!csui/perspectives/impl/nls/lang',
], function (require, module, $, _, ZonePerspectiveView, WidgetContainerBehavior, commonLang) {

  var config = module.config();
  _.defaults(config, {
    zoneNames: ['left', 'center', 'right'],
    zoneLayouts: {
      'center': {
        zoneOrder: ['center'],
        zoneSizes: {
          center: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left': {
        zoneOrder: ['left'],
        zoneSizes: {
          left: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'right': {
        zoneOrder: ['right'],
        zoneSizes: {
          right: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-center': {
        zoneOrder: ['center', 'left'],
        zoneSizes: {
          left: {
            sizes: {
              "md": 4,
              "xl": 3
            },
            "pulls": {
              "md": 8,
              "xl": 9
            },
            heights: {
              xs: 'full'
            }
          },
          center: {
            sizes: {
              "md": 8,
              "xl": 9
            },
            "pushes": {
              "md": 4,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'center-right': {
        zoneOrder: ['center', 'right'],
        zoneSizes: {
          center: {
            sizes: {
              "md": 8,
              "xl": 9
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "md": 4,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-right': {
        zoneOrder: ['left', 'right'],
        zoneSizes: {
          left: {
            sizes: {
              "md": 6
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "md": 6
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-center-right': {
        zoneOrder: ['center', 'left', 'right'],
        zoneSizes: {
          left: {
            sizes: {
              "sm": 6,
              "md": 6,
              "lg": 3,
              "xl": 3
            },
            "pulls": {
              "lg": 6,
              "xl": 6
            },
            heights: {
              xs: 'full'
            }
          },
          center: {
            sizes: {
              "sm": 12,
              "md": 12,
              "lg": 6,
              "xl": 6
            },
            "pushes": {
              "lg": 3,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "sm": 6,
              "md": 6,
              "lg": 3,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      }
    }
  });

  var LeftCenterRightPerspectiveView = ZonePerspectiveView.extend({

    className: function () {
      var className       = 'cs-left-center-right-perspective',
          parentClassName = _.result(ZonePerspectiveView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    zoneNames: config.zoneNames,
    zoneLayouts: config.zoneLayouts,
    unSupportedWidgets: config.unSupportedWidgets,

    constructor: function LeftCenterRightPerspectiveView(options) {
      if (!!options && options.perspectiveMode === 'edit') {
        this._prepareForEditMode(options);
      }
      ZonePerspectiveView.prototype.constructor.apply(this, arguments);
      if (!!options && options.perspectiveMode === 'edit') {
        this._registerEditEvents();
      }
    },

    /**
     * Fill placeholders in empty zones
     */
    _prepareForEditMode: function (options) {
      if (!options.left || _.isEmpty(options.left.type)) {
        options.left = {
          kind: 'tile',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }
      if (!options.center || _.isEmpty(options.center.type)) {
        options.center = {
          kind: 'fullpage',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }
      if (!options.right || _.isEmpty(options.right.type)) {
        options.right = {
          kind: 'tile',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }

      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this
        }
      };
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widget) {
        if (self.getPManPlaceholderWidget) { // Provided by pman.config.behaviour
          var newWidget = self.getPManPlaceholderWidget();
          this._resolveWidget(newWidget).done(function () {
            widget.model.set('widget', newWidget);
          });
        }
      });
      this.listenTo(this, 'replace:widget', function (widgetView, widgetToReplace) {
        var self = this;
        this._resolveWidget(widgetToReplace).done(function () {
          self.options.context.clear();
          widgetView.model.set('widget', widgetToReplace);
          self.options.context.fetch();
        });
      }.bind(this));
    },

    /**
     * Serializes the widget configuration to save the perspective.
     */
    serializePerspective: function (perspectiveModel) {
      var self     = this,
          deferred = $.Deferred();
      var optionsPromise = this.serializeOptions(perspectiveModel);
      optionsPromise.then(function (results) {
        var constant_data     = _.flatten(results.map(function (result) {
              return result.config.constantsData || [];
            })),
            options           = _.reduce(results, function (seed, result) {
              seed[result.zone] = result.config.widget;
              return seed;
            }, {}),
            perspectiveResult = {
              perspective: {
                type: 'left-center-right',
                options: options
              },
              constant_data: constant_data,
              constant_extraction_mode: 1
            };
        var allWidgets = _.reject(_.values(options), _.isEmpty);
        var isAllWidgetsValid = self.validateAndGenerateWidgetId(allWidgets);
        if (!isAllWidgetsValid) {
          deferred.reject(commonLang.widgetValidationFailed);
        } else {
          deferred.resolve(perspectiveResult);
        }
      }, deferred.reject);
      return deferred.promise();
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  return LeftCenterRightPerspectiveView;

});

// Loads a widget and renders it in a full-page zone layout
csui.define('csui/perspectives/single/single.perspective.view',['module', 'csui/lib/underscore', 'csui/perspectives/zone/zone.perspective.view'
], function (module, _, ZonePerspectiveView) {

  var config = module.config();
  _.defaults(config, {
    zoneNames: ['widget'],
    zoneLayouts: {
      'widget': {
        zoneOrder: ['widget'],
        zoneSizes: {
          widget: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      }
    }
  });

  var SinglePerspectiveView = ZonePerspectiveView.extend({

    className: function () {
      var className       = 'cs-single-perspective',
          parentClassName = _.result(ZonePerspectiveView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    zoneNames: config.zoneNames,
    zoneLayouts: config.zoneLayouts,
	unSupportedWidgets: config.unSupportedWidgets,

    constructor: function SinglePerspectiveView(options) {
      ZonePerspectiveView.prototype.constructor.apply(this, arguments);
    }

  });

  return SinglePerspectiveView;

});

csui.define('csui/utils/contexts/factories/active.tab.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var ActiveTabModel = Backbone.Model.extend({

    defaults: {
      tabIndex: 0
    }

  });

  var ActiveTabModelFactory = ModelFactory.extend({

    propertyPrefix: 'activeTab',

    constructor: function ActiveTabModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var activeTab = this.options.activeTab || {};
      if (!(activeTab instanceof Backbone.Model)) {
        var config = module.config();
        activeTab = new ActiveTabModel(activeTab.attributes, _.extend({},
            activeTab.options, config.options));
      }
      this.property = activeTab;
    }

  });

  return ActiveTabModelFactory;

});

csui.define('csui/perspectives/tabbed/behaviors/tab.extensions.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/non-emptying.region/non-emptying.region'
], function (module, _, $, Marionette, NonEmptyingRegion) {
  'use strict';

  var TabExtensionsBehavior = Marionette.Behavior.extend({

    constructor: function TabExtensionsBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this.renderExtension);
      this.listenTo(view, 'before:destroy', this.destroyExtension);
      this.listenTo(view, 'dom:refresh', this.refreshTab);
    },

    renderExtension: function () {
      var options                         = this.view.options,
          tabBarLeftExtensionViewClass    = options.tabBarLeftExtensionViewClass,
          tabBarLeftExtensionViewOptions  = options.tabBarLeftExtensionViewOptions,
          tabBarRightExtensionViewClass   = options.tabBarRightExtensionViewClass,
          tabBarRightExtensionViewOptions = options.tabBarRightExtensionViewOptions,
          // tabpanel ==> 'left extension', 'tablinks', 'right extension','tabcontent'
          tabLeftExtensionIndex           = 0, // left extension if present, index is 0
          tabRightExtensionIndex;//right extension if present,index can be either 1(no left extension or 2( with left extension)

      this.tabBarLeftExtensionsRegion = this.showExtension(tabBarLeftExtensionViewClass,
          tabBarLeftExtensionViewOptions, tabLeftExtensionIndex);
      tabRightExtensionIndex = !!this.tabBarLeftExtensionsRegion ? 2 : 1;
      this.tabBarRightExtensionsRegion = this.showExtension(tabBarRightExtensionViewClass,
          tabBarRightExtensionViewOptions, tabRightExtensionIndex);
      this.view._initializeToolbars();
    },

    showExtension: function (viewClass, viewOptions, index) {
      var viewRegion;
      if (!!viewClass) {
        if (typeof (viewClass) === "function") {
          this.tabBarExtensionView = new viewClass(viewOptions);
          this.tabBarExtensionView.$el.addClass("tab-extension");
          if (!!viewOptions.customClass) {
            this.tabBarExtensionView.$el.addClass(viewOptions.customClass);
          }
          viewRegion = new NonEmptyingRegion({
            el: this.view.el,
            index: index
          });
          viewRegion.show(this.tabBarExtensionView);
        }
      }
      return viewRegion;
    },

    refreshTab: function () {
      this.view._enableToolbarState();

      if(this.tabBarExtensionView){
        this.tabBarExtensionView.triggerMethod("dom:refresh");
      }
    },

    destroyExtension: function () {
      if (!!this.tabBarLeftExtensionsRegion) {
        this.tabBarLeftExtensionsRegion.empty();
      }
      if (!!this.tabBarRightExtensionsRegion) {
        this.tabBarRightExtensionsRegion.empty();
      }
    }
  });

  return TabExtensionsBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!csui/perspectives/tabbed/impl/tabbed.perspective',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"cs-header\"></div>\r\n<div class=\"cs-content\"></div>\r\n";
}});
Handlebars.registerPartial('csui_perspectives_tabbed_impl_tabbed.perspective', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspectives/tabbed/impl/tabbed.perspective',[],function(){});
csui.define('csui/perspectives/tabbed/tabbed.perspective.view',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/tab.panel/tab.panel.view', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/active.tab.factory',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/perspectives/tabbed/behaviors/tab.extensions.behavior',
  'csui/controls/mixins/view.state/node.view.state.mixin',
  'csui/utils/contexts/factories/next.node',
  'hbs!csui/perspectives/tabbed/impl/tabbed.perspective',
  'css!csui/perspectives/impl/perspective',
  'css!csui/perspectives/tabbed/impl/tabbed.perspective'
], function (module, _, Backbone, $, Marionette, base, TabPanelView, GridView, WidgetContainerBehavior,
    LayoutViewEventsPropagationMixin, ActiveTabModelFactory, TabLinksScrollMixin,
    TabLinkCollectionViewExt, TabExtensionsBehavior, NodeViewStateMixin, NextNodeModelFactory, perspectiveTemplate) {
  'use strict';
  var config = module.config();

  var NODE_TYPES_TO_RESET_TAB = ['Business Workspace'];

  var GridRowWidgetContainerView = GridView.RowView.extend({

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        // Widgets in the tab panel should create their own model instead
        // of using the grid cell model
        model: undefined
      };
    },

    constructor: function GridRowWidgetContainerView() {
      GridView.RowView.prototype.constructor.apply(this, arguments);
    }

  });

  var TabWidgetContainerView = TabPanelView.extend({

    contentView: GridRowWidgetContainerView,

    contentViewOptions: function (model) {
      return {
        context: this.options.context,
        columns: model.get('columns')
      };
    },

    constructor: function TabWidgetContainerView(options) {
      options || (options = {});
      _.defaults(options, {
        // Perspective can fetch all data, only if all widgets
        // are created; including on non-activated tabes
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        tabBarLeftExtensionViewClass: options.tabBarLeftExtensionViewClass,
        tabBarLeftExtensionViewOptions: options.tabBarLeftExtensionViewOptions,
        tabBarRightExtensionViewClass: options.tabBarRightExtensionViewClass,
        tabBarRightExtensionViewOptions: options.tabBarRightExtensionViewOptions
      });

      if (options.tabs) {
        _.each(options.tabs, function (tab, tabIndex) {
          _.each(tab.columns, function (col, columnIndex) {
            col.widget.cellAddress = 'tab' + tabIndex + ':r0:c' + columnIndex;
          });
        });
      }
      this.behaviors = _.extend({
        TabExtensionsBehavior: {
          behaviorClass: TabExtensionsBehavior
        }
      }, this.behaviors);

      $(window).on('resize', {view: this}, this._onWindowResize);
      TabPanelView.prototype.constructor.call(this, options);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        event.data.view._enableToolbarState();
      }
    }

  });

  _.extend(TabWidgetContainerView.prototype, TabLinksScrollMixin);

  var TabbedPerspectiveView = Marionette.LayoutView.extend({

    className: 'cs-tabbed-perspective cs-perspective binf-container-fluid',
    template: perspectiveTemplate,

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    regions: {
      headerRegion: '> .cs-header',
      contentRegion: '> .cs-content'
    },

    constructor: function TabbedPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      
      this.context = options.context;
      
      this.activeTab =  this._initActiveTabFromViewState();
      var viewStateModel = this.context && this.context.viewStateModel;
      viewStateModel && viewStateModel.set(viewStateModel.CONSTANTS.ALLOW_WIDGET_URL_PARAMS, false);
      viewStateModel && viewStateModel.addUrlParameters(['tab'], this.context);
      
      var widget = options && options.header && options.header.widget;
      if (widget) {
        options.header.widget = base.filterUnSupportedWidgets(widget, config);
      }
      if (options.tabs) {
        options.tabs = _.each(options.tabs, function (tab, tabIndex) {
          tab.columns = _.filter(tab.columns, function (col, columnIndex) {
			return base.filterUnSupportedWidgets(col.widget, config) != undefined;
          });
        });
      }

      Marionette.LayoutView.prototype.constructor.call(this, options);

      // The current tab may be wanted to be remembered when the perspective
      // is switched again.  The following model from the context does it.
      //this.activeTab = this.options.context.getModel(ActiveTabModelFactory);

      this.listenTo(this.context.viewStateModel, 'change:state', this.onViewStateChanged);

      this.nextNode = this.context.getModel(NextNodeModelFactory);
      this.listenTo(this.nextNode, 'change:id', this._resetTab);
      this.listenTo(this.context, 'retain:perspective', this._onPerspectiveRetainedOrChanged);
      this.listenTo(this.context, 'change:perspective', this._onPerspectiveRetainedOrChanged);
      
      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.navigationHeader = this.options.header.widget ?
                              this._createWidget(this.options.header.widget) : {};
      this.tabPanel = new TabWidgetContainerView(_.extend({
        activeTab: this.activeTab,
        delayTabContent: this.options.delayTabContent,
        tabBarLeftExtensionViewClass: this.navigationHeader.tabBarLeftExtensionView,
        tabBarLeftExtensionViewOptions: this.navigationHeader.tabBarLeftExtensionViewOptions,
        tabBarRightExtensionViewClass: this.navigationHeader.tabBarRightExtensionView,
        tabBarRightExtensionViewOptions: this.navigationHeader.tabBarRightExtensionViewOptions,
        disableExtensionOnFirstTab: this.navigationHeader.disableExtensionOnFirstTab,
        disableExtensionOnOtherTabs: this.navigationHeader.disableExtensionOnOtherTabs
      }, this.options));
      this._updateToggleHeaderState();
      this.listenTo(this.tabPanel, 'activate:tab', this._onActiveTab);
      if (!_.isEmpty(this.navigationHeader)) {
        this.headerRegion.show(this.navigationHeader);
      }
      this.contentRegion.show(this.tabPanel);
      this.headerRegion.$el.on(this._transitionEnd(), _.bind(function (event) {
        if (event.target === this.headerRegion.el) {
          this.$el.removeClass('cs-toggling');
          this.triggerMethod('dom:refresh');
        }
      }, this));

      var viewStateModel = this.context.viewStateModel;
      viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.none);
    },

    _onActiveTab: function(tabContent, tabPane, tabLink){
      this._updateToggleHeaderState(tabContent, tabPane, tabLink);
      this._notifyHeader();
    },

    _notifyHeader: function(tabContent, tabPane, tabLink){
      var tabIndex = this.tabPanel.activeTab.get('tabIndex');
      var isCollapsed = this.tabPanel.activeTab.get('isCollapsed');
      this.navigationHeader.triggerMethod("active:tab", {'tabIndex':tabIndex, 'isCollapsed': isCollapsed});
    },

    onBeforeRender: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    onBeforeDestroy: function () {
      this.setViewStateTabIndex(0, {default: true});
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    enumerateWidgets: function (callback) {
      var widget = this.options && this.options.header && this.options.header.widget;
      widget && callback(widget);
      _.each(this.options.tabs, function (tab) {
        _.each(tab.columns || [], function (column) {
          column.widget && callback(column.widget);
        });
      });
    },

    _createWidget: function (widget) {
      var Widget = widget.view;
      if (!Widget) {
        throw new Marionette.Error({
          name: 'UnresolvedWidgetError',
          message: 'Widget not resolved: "' + widget.type + '"'
        });
      }
      return new Widget({
        context: this.options.context,
        data: widget.options || {}
      });
    },

    _updateToggleHeaderState: function (tabContent, tabPane, tabLink) {
      // If this handler is triggered by before:activate:tab, the activeTab
      // model has not been updated yet
      var tabIndex    = tabLink ? tabLink.model.collection.indexOf(tabLink.model) :
                        this.activeTab && this.activeTab.get('tabIndex') || 0,
          method      = tabIndex === 0 ? 'removeClass' : 'addClass',
          isCollapsed = this.$el.hasClass('cs-collapse');
      if (method === 'removeClass' && isCollapsed ||
          method === 'addClass' && !isCollapsed) {
        this.$el.addClass('cs-toggling');
        this.$el[method]('cs-collapse');
      }
      this.tabPanel.activeTab.set('isCollapsed', (tabIndex > 0) );

      if (this.tabPanel && this.tabPanel.tabLinks) {
        this.setViewStateTabIndex(tabIndex);
      }
    },

    onDomRefresh: function () {
      this.onViewStateChanged();
    },

    _initActiveTabFromViewState: function () {
      var tabIndex = this.getViewStateTabIndex();
      if (tabIndex) {
        return new Backbone.Model({tabIndex: tabIndex});
      }
    },

    onViewStateChanged: function (forceActivation) {
      var tabIndex = this.getViewStateTabIndex() || 0,
          tabPanel = this.tabPanel,
          tabLinks = tabPanel && this.tabPanel.tabLinks,
          self     = this;

      // todo: Remove all all this stuff from here. This is a last minute fix before the 16.2.10
      // release and did not know how to fix it any other way.
      function isTabContentCreated(index) {
        var tabPanels = tabPanel.el.querySelectorAll('[role=tabpanel]');
        if (tabPanels && tabPanels.length > index) {
          return $(tabPanels[index]).height() > 0;
        }
      }

      function activateTabWhenReady(tab, tabIndex) {
        if (isTabContentCreated(tabIndex)) {
          tab.activate();
        } else {
          setTimeout(activateTabWhenReady.bind(self, tab, tabIndex), 50);
        }
      }

      if (tabLinks) {
        var tab = tabLinks.children.findByIndex(tabIndex);
        if (tab && !tab.isActive()) {
          activateTabWhenReady(tab, tabIndex);
        }
      }
    },

    _onPerspectiveRetainedOrChanged: function (/*perspective, sourceModel*/) {
      var viewStateModel = this.context.viewStateModel;
      // Reset the tab if we are navigating to a node of one of the types in NODE_TYPES_TO_RESET_TAB.
      // Except if we are navigating from a breadcrumb then let the nodestable display the content of the
      // node.
      if (NODE_TYPES_TO_RESET_TAB.indexOf(this.nextNode.get('type_name')) !== -1) {
        if (viewStateModel.get('browsing') !== viewStateModel.BROWSING_TYPE.breadcrumbs) {
          this.setViewStateTabIndex(0, {default: true});
        }
        viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.none);
      }
    },

    _resetTab: function () {
      var viewStateModel = this.context.viewStateModel;
      if (viewStateModel.get('browsing')) {
        if (viewStateModel.get('browsing') !== viewStateModel.BROWSING_TYPE.breadcrumbs) {
          viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.none);
        }
        return;
      }
      this.setViewStateTabIndex(0, {default: true});
    },

    // TODO: Make a common method for this or remove it,
    // if all browsers support it.
    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _supportMaximizeWidget: true

  });

  _.extend(TabbedPerspectiveView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(TabbedPerspectiveView.prototype, NodeViewStateMixin);

  return TabbedPerspectiveView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <div class=\"left-toolbar\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <div class=\"right-toolbar\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<div class=\"tab-links-bar\">\r\n  <span class=\"fadeout\"></span>\r\n  <ul class=\"binf-nav "
    + this.escapeExpression(((helper = (helper = helpers.tab_type || (depth0 != null ? depth0.tab_type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tab_type","hash":{}}) : helper)))
    + "\" role=\"tablist\"></ul>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<div class=\"csui-pman-add-newtab\">\r\n  <button class=\"icon icon-action-add\" title=\"Add tab\"></button>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_perspectives_tabbed-flow_impl_edit.perspective_tab.links', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" class=\"cs-tablink\" data-binf-toggle=\"tab\" title=\""
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "\">\r\n  <span class=\"cs-tablink-text\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "</span>\r\n  <input class=\"csui-pman-editinput binf-hidden\" tabindex=\"-1\">\r\n</a>\r\n<div class=\"cs-tablink-delete\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeTab || (depth0 != null ? depth0.removeTab : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeTab","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"icon clear-icon-white cs-delete-icon\" role=\"button\" data-cstabindex=\"0\"></span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_perspectives_tabbed-flow_impl_edit.perspective_tab.link', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/perspectives/tabbed-flow/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspectives/tabbed-flow/impl/nls/root/lang',{
  deleteConfirmTitle: 'Remove Tab',
  deleteConfirmMsg: 'Are you sure, you want to remove Tab?',
  removeTab: 'Remove Tab',
  newTabTitle: 'Tab',
  newTabInput: 'Add tab label'
});



csui.define('css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',[],function(){});
csui.define('csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',
  'i18n!csui/perspectives/tabbed-flow/impl/nls/lang',
  'csui/lib/binf/js/binf',
  'css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',
], function (_, TabLinkView, tabLinkTemplate, lang) {
  var EditPerspectiveTabLink = TabLinkView.extend({
    template: tabLinkTemplate,

    templateHelpers: function () {
      return {
        removeTab: lang.removeTab
      };
    },

    className: function () {
      return this._isOptionActiveTab() ? 'pman-edit-tab binf-active' : 'pman-edit-tab';
    },

    events: function () {
      return _.extend(TabLinkView.prototype.events, {
        'click @ui.link': '_onShowTab',
        'dblclick @ui.tabLink': '_onTabClick',
        'keydown @ui.editInput': '_onInputKeydown',
        'keyup @ui.editInput': '_onInputKeyup',
        'focusout @ui.editInput': '_onInputFocusOut',
        'click @ui.tabRemove': '_onTabRemove'
      });
    },

    ui: function () {
      return _.extend(TabLinkView.prototype.ui, {
        'editInput': '.csui-pman-editinput',
        'tabLink': '.cs-tablink-text',
        'tabRemove': '.cs-delete-icon'
      });
    },

    _onShowTab: function (event) {
      //prevent activating new tab with no title
      if (!this.model.get('title')) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    _onTabRemove: function () {
      var self = this;
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmQuestion(lang.deleteConfirmMsg, lang.deleteConfirmTitle)
            .done(function (yes) {
              if (yes) {
                self._doRemoveTab();
              }
            });
      });
    },

    _doRemoveTab: function () {
      if (!this.model.get('title')) {
        this.trigger('enable:addTab');
      }
      this.trigger('remove:tab', this.model);
    },

    _onTabClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this._editTab();
    },

    _editTab: function () {
      var text;
      if (this.ui.tabLink.text()) {
        text = this.ui.tabLink.text();
        this.ui.editInput.val(text);
      }
      else {
        this.ui.editInput.attr('placeholder', lang.newTabInput);
      }
      this._setEdit(true);
    },

    _setEdit: function (isEdit) {
      if (isEdit) {
        //prevent edit for double click on non active tab as it is still activating
        if (this.options && this.options.tabPanel && this.options.tabPanel.activatingTab) {
          return;
        }
        this.trigger('disable:addTab');
        this.ui.tabRemove.addClass('binf-hidden');
        this.ui.editInput.removeClass('binf-hidden');
        this.ui.tabLink.addClass('binf-hidden');
        //Trigger event so that the parent view will scroll until input field is visible
        //and set focus
        this.trigger('before:edit', this);
      } else {
        this.ui.tabLink.removeClass('binf-hidden');
        this.ui.editInput.addClass('binf-hidden');
        this.activate();
        this.ui.link.trigger('focus');
      }
    },

    _onInputFocusOut: function () {
      if (!this.ui.tabLink.text()) {
        this._doRemoveTab();
        return;
      }
      this._setEdit(false);
      this.ui.tabRemove.removeClass('binf-hidden');
      this.trigger('enable:addTab');
    },

    _onInputKeydown: function (event) {
      var value = event.target.value;
      if (event.which == 32) {
        //disable space if no text
        (!value) && event.preventDefault();
        //space key is is disabled for tabs by jquery to differentiate from links
        //but enabling it as per requirement by preventing disable
        event.stopPropagation();
      }
    },
    _onInputKeyup: function (event) {
      var value = event.target.value;
      if ((!value || value.length === 0) && (event.which == 13 || event.which == 27)) {
        this._doRemoveTab();
        return;
      }
      switch (event.which) {
      case 13:
        this._setTabTitle(value);
        break;
      case 27:
        this._setEdit(false);
        break;
      }
    },

    _setTabTitle: function (newTitle) {
      this.ui.tabLink.text(newTitle);
      this._setEdit(false);
      //Remove edit mode before model 'change' which triggers tab adjustment
      this.model.set('title', newTitle);
    },

    onShow: function () {
      if (!this.model.get('title')) {
        this._editTab();
      }
    },

    constructor: function EditPerspectiveTabLink() {
      TabLinkView.prototype.constructor.apply(this, arguments);
    }
  });
  return EditPerspectiveTabLink;
});

csui.define('css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links',[],function(){});
csui.define('csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links.view',['csui/lib/underscore', 'csui/controls/tab.panel/tab.links.ext.view',
  'hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links',
  'csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'i18n!csui/perspectives/tabbed-flow/impl/nls/lang',
  'csui/lib/binf/js/binf',
  'css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links'
], function (_, TabLinkCollectionView, tabLinksTemplate, TabLinkViewExt,
    ViewEventsPropagationMixin, lang) {

  var EditPerspectiveTabLinks = TabLinkCollectionView.extend({
    template: tabLinksTemplate,

    childView: TabLinkViewExt,

    childViewContainer: function () {
      return '.' + this.tabType;
    },

    ui: {
      'addNewTab': '.csui-pman-add-newtab'
    },

    triggers: {
      'before:edit': 'before:edit'
    },

    events: {
      'click @ui.addNewTab': '_onAddNewTab'
    },

    childViewOptions: function (model, index) {
      return _.extend(this.options, {});
    },

    childEvents: {
      'remove:tab': '_onRemoveTab',
      'enable:addTab': 'enableAddTab',
      'disable:addTab': 'disableAddTab',
      'before:edit': 'onBeforeEditTab'
    },

    constructor: function EditPerspectiveTabLinks() {
      TabLinkCollectionView.prototype.constructor.apply(this, arguments);
    },

    _onRemoveTab: function (tabView) {
      var isDeletingActive = tabView.isActive(),
          tabIndex         = this.collection.indexOf(tabView.model);
      this.collection.remove(tabView.model);
      if (!isDeletingActive) {
        return;
      }
      if (tabIndex >= this.collection.length) {
        tabIndex = this.collection.length - 1;
      }
      if (tabIndex < 0) {
        // No Tabs left
        return;
      }
      var tabToActivate = this.collection.at(tabIndex);
      this.children.findByModel(tabToActivate).activate();
    },

    _onAddNewTab: function () {
      if (this.ui.addNewTab.hasClass("csui-pman-disable-newtab")) {
        return;
      }
      var newTab = {
        title: ""
      };
      this.options.tabPanel.collection.add(newTab);
    },

    enableAddTab: function () {
      this.ui.addNewTab.removeClass("csui-pman-disable-newtab");
      //Refresh keyboard behavior when tab is added
      this.keyboardBehavior.refreshTabableElements(this);
    },

    disableAddTab: function () {
      this.ui.addNewTab.addClass("csui-pman-disable-newtab");
    },

    onBeforeEditTab: function (tab) {
      this.trigger('before:edit', tab);
    }
  });
  return EditPerspectiveTabLinks;
});
csui.define('csui/perspectives/tabbed-flow/tabbed-flow.perspective.view',['require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette','csui/utils/base',
  'csui/models/widget/widget.collection',
  'csui/models/widget/widget.model',
  'csui/controls/tab.panel/tab.panel.view', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/active.tab.factory',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/perspectives/tabbed/behaviors/tab.extensions.behavior',
  'csui/utils/log',
  'csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links.view',
  'hbs!csui/perspectives/tabbed/impl/tabbed.perspective',
  'css!csui/perspectives/impl/perspective',
  'css!csui/perspectives/tabbed/impl/tabbed.perspective'
], function (require, module, _, $, Backbone, Marionette, base, WidgetCollection, WidgetModel,
    TabPanelView, GridView, WidgetContainerBehavior, LayoutViewEventsPropagationMixin,
    ActiveTabModelFactory, TabLinksScrollMixin,
    TabLinkCollectionViewExt, TabExtensionsBehavior, log, EditPerspectiveTabLinks,
    perspectiveTemplate) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultWidgetKind: 'tile',
    widgetSizes: {
      fullpage: {
        widths: {
          xs: 12
        }
      },
      tile: {
        widths: {
          md: 6,
          xl: 4
        }
      },
      header: {
        widths: {
          xs: 12,
          md: 8,
          xl: 6
        }
      }
    }
  });

  var GridRowWidgetContainerView = GridView.RowView.extend({

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        if (!widget.view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved:' +
                     widget['error']
          });
        }
        return widget.view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        // Widgets in the tab panel should create their own model instead
        // of using the grid cell model
        model: undefined
      };
    },

    constructor: function GridRowWidgetContainerView(options) {
      if (!!options && options.perspectiveMode === 'edit') {
        this._prepareForEditMode(options);
      }
      GridView.RowView.prototype.constructor.apply(this, arguments);
      if (this.options.perspectiveMode === 'edit') {
        this._initEditMode();
        this._registerEditEvents();
      }
    },

    _prepareForEditMode: function (options) {
      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this,
          perspectiveSelector: '.perspective-editing .cs-perspective #' + options.tabId
        }
      };
    },

    _initEditMode: function () {
      var self         = this,
          placeholderW = {
            type: 'csui/perspective.manage/widgets/perspective.placeholder'
          };
      TabbedFlowPerspectiveView._resolveWidget(placeholderW).done(function (resolvedWidget) {
        var newCell = TabbedFlowPerspectiveView._createCell(placeholderW, resolvedWidget);
        self.options.collection.add(newCell);
      });
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        var model = widgetView.model;
        self.collection.remove(model);
        // TODO Add a new placeholder when all cells removed
      });

      this.listenTo(this, 'replace:widget', this._replaceWidget);
    },

    _replaceWidget: function (currentWidget, widgetToReplace) {
      if (!this.getPManPlaceholderWidget) {
        // 'getPManPlaceholderWidget' Provided by pman.config.behaviour
        return;
      }
      var self = this;
      // Load new widget
      TabbedFlowPerspectiveView._resolveWidget(widgetToReplace).done(function () {
        // update current widget with new widget
        if (currentWidget.model.get('widget').type !== self.getPManPlaceholderWidget().type) {
          // Preserve widget kind if dropping on existing widget
          widgetToReplace.kind = currentWidget.model.get('widget').kind;
        }
        var widgetUpdates = TabbedFlowPerspectiveView._prepareCell(widgetToReplace);
        currentWidget.model.set(widgetUpdates);
        // Check if last widget of flow is replacing, then add new placeholder widget
        var placeholderWidget = self.getPManPlaceholderWidget(),
            cells             = self.collection,
            hasPlaceholders   = cells.filter(function (w) {
              return w.get('widget').type === placeholderWidget.type;
            }).length > 0;
        if (!hasPlaceholders) {
          // Create a placeholder wiget to be able to drop new widgets
          TabbedFlowPerspectiveView._resolveWidget(placeholderWidget).done(
              function (resolvedWidget) {
                var newCell = TabbedFlowPerspectiveView._createCell(placeholderWidget,
                    resolvedWidget, cells.length);
                cells.add(newCell);
              });
        }
      });
    }

  });

  var TabWidgetContainerView = TabPanelView.extend({

    contentView: GridRowWidgetContainerView,

    contentViewOptions: function (model) {
      return {
        context: this.options.context,
        columns: model.get('columns'),
        perspectiveMode: this.options.perspectiveMode,
        tabId: model.get('uniqueTabId')
      };
    },

    constructor: function TabWidgetContainerView(options) {
      options || (options = {});
      _.defaults(options, {
        // Perspective can fetch all data, only if all widgets
        // are created; including on non-activated tabes
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        tabBarExtensionViewClass: options.tabBarExtensionViewClass,
        tabBarExtensionViewOptions: options.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: options.enableExtensionOnFirstTab
      });
      if (options.perspectiveMode === 'edit') {
        _.extend(options, {
          TabLinkCollectionViewClass: EditPerspectiveTabLinks
        });
      }

      this.behaviors = _.extend({
        TabExtensionsBehavior: {
          behaviorClass: TabExtensionsBehavior
        }
      }, this.behaviors);

      $(window).on('resize', {view: this}, this._onWindowResize);
      TabPanelView.prototype.constructor.call(this, options);
    },

    render: function () {
      TabPanelView.prototype.render.apply(this);
      this.listenTo(this.collection, 'change reset remove', _.bind(function (event) {
        this._enableToolbarState();
        //adjust the tab position after rename or removal
        this.activatingTab = false;
        this.skipAutoScroll = false;
        this._autoScrolling();
      }, this));
      this.listenTo(this.tabLinks, 'before:edit', function (tab) {
        this.skipAutoScroll = false;
        //refreshing the tabs if any new tab is added
        this.tabsSelector = $(this.$el.find('.tab-links .tab-links-bar')[0]).find('> ul li');
        this.tablinksToolbar = $(this.$el.find('.tab-links .tab-links-bar')[0]);
        //Scroll to the last if it is a new tab or
        // scroll until the input field of current tab is visible completely
        var scroll = tab && tab.model.get('title') ? '_autoScrolling' : '_autoScrollLastTab';
        this[scroll]().done(_.bind(function () {
          //update the toolbar after scroll
          this._enableToolbarState();
          //set focus only when the tab is completely visible
          tab && tab.ui && tab.ui.editInput.trigger('focus');
        }, this));
      });
      return this;
    },

    onDomRefresh: function () {
      this._enableToolbarState();
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        event.data.view._enableToolbarState();
      }
    }
  });

  _.extend(TabWidgetContainerView.prototype, TabLinksScrollMixin);

  /**
   * Header view to hold Navigation header of the Tabbed perspective.
   */
  var HeaderView = Marionette.ItemView.extend({
    className: 'cs-tabbed-perspective-header',
    constructor: function HeaderView(options) {
      options || (options = {});
      if (!options.header) {
        options.header = {};
      }
      if (options.perspectiveMode === 'edit') {
        var PerspectiveWidgetConfigBehaviour = require(
            'csui/perspective.manage/behaviours/pman.widget.config.behaviour');
        this.behaviors = _.extend({
          PerspectiveWidgetConfig: {
            behaviorClass: PerspectiveWidgetConfigBehaviour,
            perspectiveView: this
          }
        }, this.behaviors);
      }
      Marionette.ItemView.call(this, _.extend({template: false}, options));
      if (this.options.perspectiveMode === 'edit') {
        this._initEditMode(options);
        this._registerEditEvents();
      }
    },

    _initEditMode: function (options) {
      if (!this.options.header.widget && this.getPManPlaceholderWidget) {
        this._handleReplaceWidget(this, this.getPManPlaceholderWidget());
      }
    },

    _ensureRegion: function () {
      if (!this.headerContainer) {
        this.headerContainer = new Marionette.Region({
          el: this.el
        });
      }
      return this.headerContainer;
    },

    onRender: function () {
      if (!!this.options.header.widget) {
        this.navigationHeader = this._createWidget(this.options.header.widget);
        var region = this._ensureRegion();
        region.show(this.navigationHeader);
      }
    },

    _createWidget: function (widget) {
      var Widget = widget.view;
      if (!Widget) {
        throw new Marionette.Error({
          name: 'UnresolvedWidgetError',
          message: 'Widget not resolved: "' + widget.type + '"'
        });
      }
      return new Widget({
        context: this.options.context,
        data: widget.options || {}
      });
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        if (self.getPManPlaceholderWidget) {
          var placeholder = self.getPManPlaceholderWidget();
          TabbedFlowPerspectiveView._resolveWidget(placeholder).done(function () {
            self._replaceWidget(placeholder);
          });
        }
      });
      this.listenTo(this, 'replace:widget', this._handleReplaceWidget);
    },

    _replaceWidget: function (widgetToReplace) {
      this.options.header.widget = widgetToReplace;
      this.render();
    },

    _handleReplaceWidget: function (currentWidget, widgetToReplace) {
      var self = this;
      // Load new widget
      TabbedFlowPerspectiveView._resolveWidget(widgetToReplace).done(function () {
        // Replace current widget with new widget
        self._replaceWidget(widgetToReplace);
      });
    },

    /**
     * Provide header widget configuration to perspective manager
     */
    getPManWidgetConfig: function () {
      return this.options.header.widget;
    }
  });

  var TabbedFlowPerspectiveView = Marionette.LayoutView.extend({

    className: 'cs-tabbed-perspective cs-perspective binf-container-fluid cs-tabbed-flow-perspective',
    template: perspectiveTemplate,

    regions: {
      headerRegion: '> .cs-header',
      contentRegion: '> .cs-content'
    },

    constructor: function TabbedFlowPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (!options.collection) {
        options.collection = this._createCollection(options);
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);

      // The current tab may be wanted to be remembered when the perspective
      // is switched again.  The following model from the context does it.
      //this.activeTab = this.options.context.getModel(ActiveTabModelFactory);

      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.headerView = new HeaderView(this.options);
      this.headerRegion.show(this.headerView);
      this.tabPanel = new TabWidgetContainerView(_.extend({
        activeTab: this.activeTab,
        delayTabContent: this.options.delayTabContent,
        tabBarExtensionViewClass: this.headerView.navigationHeader.tabBarExtensionView,
        tabBarExtensionViewOptions: this.headerView.navigationHeader.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: this.headerView.navigationHeader.enableExtensionOnFirstTab
      }, this.options));
      this._updateToggleHeaderState();
      this.listenTo(this.tabPanel, 'activate:tab', this._updateToggleHeaderState);
      this.contentRegion.show(this.tabPanel);
      this.headerRegion.$el.on(this._transitionEnd(), _.bind(function (event) {
        if (event.target === this.headerRegion.el) {
          this.$el.removeClass('cs-toggling');
          this.triggerMethod('dom:refresh');
        }
      }, this));
    },

    onBeforeRender: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    onBeforeDestroy: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    _updateToggleHeaderState: function (tabContent, tabPane, tabLink) {
      if (this.options.perspectiveMode === 'edit') {
        // Ignore Tab header update for edit perspective mode.
        return;
      }
      // If this handler is triggered by before:activate:tab, the activeTab
      // model has not been updated yet
      var tabIndex    = tabLink ? tabLink.model.collection.indexOf(tabLink.model) :
                        this.activeTab && this.activeTab.get('tabIndex') || 0,
          method      = tabIndex === 0 ? 'removeClass' : 'addClass',
          isCollapsed = this.$el.hasClass('cs-collapse');
      if (method === 'removeClass' && isCollapsed ||
          method === 'addClass' && !isCollapsed) {
        this.$el.addClass('cs-toggling');
        this.$el[method]('cs-collapse');
      }
    },

    // TODO: Make a common method for this or remove it,
    // if all browsers support it.
    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _createCollection: function (options) {

      if (options.tabs) {
        options.tabs = _.each(options.tabs, function (tab) {
          tab.widgets = _.filter(tab.widgets, function (widget) {
            return base.filterUnSupportedWidgets(widget, config) != undefined;
          });
        });
      }
		
      var tabs            = new Backbone.Collection(options.tabs),
          uniqueWidgets   = _.chain(options.tabs)
              .map(function (tab) {
                return tab.widgets;
              })
              .flatten()
              .pluck('type')
              .unique()
              .map(function (id) {
                return {id: id};
              })
              .value(),
          headerWidget = options.header && options.header.widget &&
                         base.filterUnSupportedWidgets(options.header.widget, config),
          resolvedWidgets = new WidgetCollection(uniqueWidgets),
          self            = this;
      if (headerWidget) {
        resolvedWidgets.add({id: headerWidget.type});
      }
      tabs.each(function (tab) {
        tab.set('id', _.uniqueId('cs-tab'));
      });
      this.widgetsResolved = resolvedWidgets
          .fetch()
          .then(function () {
            if (headerWidget) {
              var resolvedWidget = resolvedWidgets.get(headerWidget.type),
                  widgetView     = resolvedWidget.get('view');
              if (widgetView) {
                _.extend(headerWidget, {view: widgetView});
              } else {
                var error = resolvedWidget.get('error');
                log.warn('Loading widget "{0}" failed. {1}', headerWidget.type, error)
                && console.warn(log.last);
                _.extend(headerWidget, WidgetContainerBehavior.getErrorWidget(
                    headerWidget, error));
              }
            }
            tabs.each(function (tab) {
              tab.set('columns', self._createColumns(tab.get('widgets'), resolvedWidgets));
            });
            return resolvedWidgets; /* this will be used later when the promise is resolved */
          });
      return tabs;
    },

    _createColumns: function (widgets, resolvedWidgets) {
      return _.map(widgets, function (widget) {
        var resolvedWidget = resolvedWidgets.get(widget.type);
        return TabbedFlowPerspectiveView._createCell(widget, resolvedWidget);
      }.bind(this));
    }

  }, {

    _prepareCell: function (widgetConfig) {
      if (!widgetConfig.kind) {
        widgetConfig.kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[widgetConfig.kind] || {};
      return {
        sizes: sizes.widths,
        widget: {
          type: widgetConfig.type,
          options: widgetConfig.options,
          view: widgetConfig.view
        }
      };
    },

    _createCell: function (widget, resolvedWidget) {
      var widgetView     = resolvedWidget.get('view'),
          manifest       = resolvedWidget.get('manifest') || {},
          supportedKinds = manifest.supportedKinds,
          kind           = widget.kind;
      if (!kind || !supportedKinds || !_.contains(supportedKinds, kind)) {
        kind = manifest.kind;
      }
      widget.kind = kind;
      if (!kind) {
        kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[kind] || {};
      if (widgetView) {
        widget.view = widgetView;
        return TabbedFlowPerspectiveView._prepareCell(widget);
      }
      var error = resolvedWidget.get('error');
      log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
      && console.warn(log.last);
      return {
        sizes: config.widgetSizes[config.defaultWidgetKind].widths,
        widget: WidgetContainerBehavior.getErrorWidget(widget, error)
      };
    },

    _resolveWidget: function (widget) {
      var deferred = $.Deferred();
      var widgetModel = new WidgetModel({id: widget.type});
      widgetModel.fetch().then(function () {
        widget.view = widgetModel.get('view');
        deferred.resolve(widgetModel);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },
  });

  _.extend(TabbedFlowPerspectiveView.prototype, LayoutViewEventsPropagationMixin);

  return TabbedFlowPerspectiveView;

});

csui.define('csui/pages/start/impl/location',[], function () {
  return {
    get search() {
      return location.search;
    },
    get href() {
      return location.href;
    },
    get hash() {
      return location.hash;
    }
  };
});

csui.define('csui/pages/start/perspective.router',[
  'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/pages/start/impl/location',
  'csui/utils/url'
], function (Backbone, $, _, ApplicationScopeModelFactory, location, Url) {
  'use strict';

  var activeRouter, previousRouter;

  var PerspectiveRouter = Backbone.Router.extend({
    constructor: function PerspectiveRouter(options) {
      Backbone.Router.prototype.constructor.apply(this, arguments);

      // Save common options for descended routers
      this.context = options.context;
      this._routeWithSlashes = options.routeWithSlashes;

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      // Allow this router to react, before another router routes
      this.listenTo(this, 'other:route', this.onOtherRoute);
    },

    execute: function (callback, args) {
      // Inform the routing container, that a router is about to route
      this.trigger('before:route', this);
      this._restoreUrlParamsFromViewState();
      return Backbone.Router.prototype.execute.apply(this, arguments);
    },

    _restoreUrlParamsFromViewState: function () {
      if (!this.urlParams || this.urlParams.length === 0) {
        var viewStateModel = this.context.viewStateModel;
        var urlParams = viewStateModel.get(viewStateModel.CONSTANTS.URL_PARAMS);
        urlParams && _.isString(urlParams) && (urlParams = JSON.parse(urlParams)) && (this.urlParams = urlParams.slice());
      }
    },

    getUrlParametersList: function() {
      return this.urlParams;
    },

    addUrlParameters: function(urlParameters) {
      var urlParams = this.getUrlParametersList() || [];
      this.urlParams = _.unique(urlParams.concat(urlParameters));

      var viewStateModel = this.context.viewStateModel;
      viewStateModel.set(viewStateModel.CONSTANTS.URL_PARAMS, this.urlParams);
      
      // remove from the viewStateModel any entry that is not listed in the urlParams
      this._clearViewStateModel(this.urlParams);
    } ,

    _clearViewStateModel: function (keys) {
      var viewStateModel = this.context.viewStateModel,
          modified;
      var state = viewStateModel.get('state');
      _.keys(state).forEach(function (key) {
        if (keys.indexOf(key) === -1) {
          delete state[key];
          modified = true;
        }
      });
      if (modified) {
        viewStateModel.unset('state', {silent: true});
        viewStateModel.set('state', state);
      }
    },

    getActiveRouter : function() {
      return activeRouter;
    },

    getPreviousRouter : function() {
      return previousRouter;
    },

    onViewStateChanged:function() {
    },

    getInitialViewState: function () {
      return {};
    },

    activate: function (setDefault) {
      if (activeRouter !== this) {
        previousRouter = activeRouter;
        activeRouter = this;
        var urlParams = this.getUrlParametersList();
        if (previousRouter && !this.restoring && urlParams && urlParams.length > 0) {
          urlParams.length = 0;
        }
        
        this._activeRouterChanged();
      }

      var viewStateModel = this.context.viewStateModel;

      viewStateModel.set('enabled', this.isViewStateModelSupported());

      // initialize the UI state with the defaults of this router.
      if (setDefault) {
        this._initializeViewState();
      }
    },

    _initializeViewState:function() {
      var viewStateModel = this.context.viewStateModel;
      var state = viewStateModel.get('state');
      if (state && _.keys(state).length === 0) {
        viewStateModel.unset('state', {silent: true});
      }
      viewStateModel.set('state', this.getInitialViewState(), {silent: true});
    },

    _activeRouterChanged: function () {
      var viewStateModel = this.context.viewStateModel;

      if (activeRouter === this) {
        viewStateModel.set('activeRouterInstance', this);
        this.listenTo(viewStateModel, 'change:state', this.onViewStateChanged);
        if (previousRouter) {
          previousRouter.stopListening(viewStateModel, 'change:state', previousRouter.onViewStateChanged);
        }
      } 
    },

    // The order of the url params needs to be consistent. otherwise when we
    // construct the url when we hit the back button and we build a url with a different
    // url parameters the history gets updated as if its a new url.
    buildUrlParams: function () {
      var urlParams = this.urlParams,
          context = this.context,
          viewStateModel = context && context.viewStateModel,
          viewState = viewStateModel && viewStateModel.get('state'),
          defaultViewState = viewStateModel.get('default_state');
      var paramsArray = [];

      var initialUrlParams = viewStateModel && viewStateModel.get('initialUrlParams');
      if (initialUrlParams && initialUrlParams.length) {
        paramsArray = paramsArray.concat(initialUrlParams);
        paramsArray.forEach(function (entry) {
          viewState[entry.name] = entry.value;
          urlParams = urlParams || [];
          urlParams.push(entry.name);
        });
      }

      if (urlParams && viewState) {
        urlParams.forEach(function (param) {
          var value        = viewState[param],
              defaultValue = defaultViewState && defaultViewState[param];
          if (value && value !== defaultValue) {
            this._addToParamsArray(paramsArray, {
              name: param,
              value: value
            });
          }
        }.bind(this));
      }

      paramsArray = paramsArray || [];
      _.keys(viewState).forEach(function (key) {

        // only if the param in the url params list
        if (paramsArray.indexOf(key) !== -1) {
          if (defaultViewState && defaultViewState[key] === viewState[key]) {
            return true;
          }
          this._addToParamsArray(paramsArray, {
            name: key,
            value: viewState[key]
          });
        }

      }.bind(this));

      return $.param(paramsArray);
    },

    _addToParamsArray: function(paramsArray, object) {
        if (object && object.name) {
          var found = false;
          paramsArray.some(function(entry) {
            if (entry.name === object.name) {
              found = true;
              return true;
            }
          });
          if (!found) {
            paramsArray.push(object);
            return true;
          }
        }
    },

    restore: function (routerInfo) {

      var viewStateModel = this.context.viewStateModel,
          fragment       = routerInfo.fragment,
          applicationScopeId = routerInfo.scopeId;

      if (viewStateModel) {
        this.restoring = true;
        viewStateModel.set(viewStateModel.CONSTANTS.URL_PARAMS, routerInfo.urlParam);
        if (viewStateModel.get(viewStateModel.CONSTANTS.CURRENT_ROUTER) ===
            viewStateModel.get(viewStateModel.CONSTANTS.LAST_ROUTER)) {
          this.applicationScope.set('id', '');
        } else {
          if (viewStateModel.get('enabled')) {
            applicationScopeId ? this.applicationScope.set('id', applicationScopeId ) :
            this.applicationScope.set('id', '');
          } else {
            fragment && Backbone.Router.prototype.navigate.call(this, fragment, {trigger: true});
          }
        }
      } else {
        window.history.back();
      }

    },

    initSessionViewState: function () {
      var viewStateModel = this.context && this.context.viewStateModel;
      viewStateModel && viewStateModel.set(viewStateModel.CONSTANTS.SESSION_STATE, {});
    },

    initDefaultViewState: function () {
      if (!this.restoring) {
        var viewStateModel = this.context && this.context.viewStateModel;
        viewStateModel && viewStateModel.set(viewStateModel.CONSTANTS.DEFAULT_STATE, {});
      }
    },

    getUrlParamsNotInFragment: function (fragment) {
      var notInFragment = [],
          inUrl = _.keys(Url.urlParams(fragment));
      var allRoutersUrlParams = this.getUrlParametersList();
      allRoutersUrlParams && allRoutersUrlParams.forEach(function (param) {
        if (inUrl.indexOf(param) === -1) {
          notInFragment.push(param);
        }
      });
      return notInFragment;
    },

    initViewStateFromUrlParams: function (query_string, silent) {
      var viewState,
          viewStateModel = this.context && this.context.viewStateModel;

      if (_.isString(query_string)) {
        var urlParams = this.getUrlParametersList();
        if (!urlParams) {
          viewState = $.parseParams(query_string);
        } else {
          viewState = _.pick($.parseParams(query_string), this.getUrlParametersList());
        }
        
        // Get the default current view state and merge it with whatever in the url, we could have loaded
        // the view state from storage.
        var defaultViewState = this.context.viewStateModel.get('default_state');
        if (defaultViewState) {
          var original = {};
          _.extend(original, viewState);
          _.extend(viewState, defaultViewState);
          _.extend(viewState, original);
        }

        // to make sure the change event gets triggered.
      } else {
        viewState = query_string;
      }

      viewStateModel &&
      viewStateModel.unset('state', {silent: true}) &&
      viewStateModel.set('state', viewState, {silent: silent});
    },

    isViewStateModelSupported: function() {
      return false;
    },

    navigate: function (fragment, options) {

      var params = this.buildUrlParams(),
          originalFragment = fragment;
          
      if (params) {
        fragment += '?' + params;
      }

      if (this !== activeRouter) {
        this.activate(true);
      }

      this.trigger('before:route', this);
      
      // Preserve query (carries application settings) and hash parts (carries
      // inside-page location); perspective routers use path only
      // With the routing support you can use params with the fragment
      if (this._routeWithSlashes) {
        var excludeUrlParams = previousRouter ? previousRouter.getUrlParametersList() : [];
        excludeUrlParams = excludeUrlParams || [];
        var urlParamsNotInfragment = this.getUrlParamsNotInFragment(fragment);
        if (urlParamsNotInfragment) {
          excludeUrlParams = excludeUrlParams.concat(urlParamsNotInfragment);
        }
        fragment = Url.appendQuery(fragment, Url.mergeUrlParams(fragment, location.search, excludeUrlParams));
        fragment += location.hash;
      }

      var viewStateModel = this.context.viewStateModel,
          ViewStateConstants = viewStateModel.CONSTANTS,
          viewStateCurrentRouter = viewStateModel.get(ViewStateConstants.CURRENT_ROUTER);

      if (this.name !== viewStateCurrentRouter) {
        var newRouterInfo = {
          'router': this.name,
          'fragment': originalFragment,
          'scopeId': this.applicationScope,
          'navigateOptions': options,
          'state': viewStateModel.get(ViewStateConstants.STATE),
          'sessionState': viewStateModel.get(ViewStateConstants.SESSION_STATE),
          'defaultState': viewStateModel.get(ViewStateConstants.DEFAULT_STATE)
        };

        viewStateModel.updateRoutingHistory(newRouterInfo);
      }

      // Widgets can set the initial url parameters for the routers by setting the initialUrlParams
      // i.e. viewStateModel.set('initialUrlParams', [{name: 'widgetName', value: 'D2Widget'}]);
      viewStateModel.set('initialUrlParams', undefined);

      var navigate = Backbone.Router.prototype.navigate.call(this, fragment, options);

      this.initSessionViewState();

      if (viewStateModel.get(ViewStateConstants.CURRENT_ROUTER) !== this.name) {
        viewStateModel.set(ViewStateConstants.CURRENT_ROUTER, this.name);

        this.initDefaultViewState();
      }

      // save the
      viewStateModel.set(ViewStateConstants.CURRENT_ROUTER_FRAGMENT, originalFragment);
      viewStateModel.set(ViewStateConstants.CURRENT_ROUTER_NAVIGATE_OPTIONS, options);
      this.applicationScope ?
        viewStateModel.set(ViewStateConstants.CURRENT_ROUTER_SCOPE_ID, this.applicationScope.get('id')) :
        viewStateModel.unset(ViewStateConstants.CURRENT_ROUTER_SCOPE_ID);

      this.restoring = false;

      return navigate;
    }
  });

  return PerspectiveRouter;
});


// Route hash-based URLs to contextual object changes and the other way round
csui.define('csui/pages/start/perspective.routing',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/utils/routing',
  // Load external routers working with perspective context
  'csui-ext!csui/pages/start/perspective.routing'
], function (module, _, Backbone, Url, routing, extraRouters) {
  'use strict';
  var instance;
  var config = _.extend({
    handlerUrlPathSuffix: '/app',
    rootUrlPath: null
  }, module.config());

  function PerspectiveRouting(options) {
    // Later added routers override the earlier ones;
    // put the landing page router to the front
    var DefaultRouters = [];
    var Routers = _
            .chain(extraRouters)
            .flatten(true)
            .filter(function (Router) {
              if (Router.isDefault) {
                DefaultRouters.push(Router);
              } else {
                return true;
              }
            })
            .concat(DefaultRouters)
            .unique()
            .reverse()
            .value(),
        routeWithSlashes = routing.routesWithSlashes();
    this._routers = _.map(Routers, function (Router, index) {
      var router = new Router(_.extend({
        routeWithSlashes: routeWithSlashes
      }, options));
      if (!router.name) {
        router.name = index;
      }
      router.on('before:route', _.bind(this._informOthers, this));
      return router;
    }, this);

    this._context = options.context;
    this._originalHistoryLength = history.length;
  }

  _.extend(PerspectiveRouting.prototype, Backbone.Events, {
    start: function () {
      // Start the client application URL router
      var historyOptions;
      if (routing.routesWithSlashes()) {
        historyOptions = {
          pushState: true,
          // The application should configure root of their slash-based path.
          // Otherwise it will be inferred from the current location, which
          // will be handled as an OTCS CGI URL.
          root: config.rootUrlPath != null && config.rootUrlPath ||
                Url.combine(
                    new Url(new Url(location.pathname).getCgiScript()).getPath(),
                    config.handlerUrlPathSuffix)
        };
      } else {
        // The current location path is the default root. However, the
        // Backbone.history.atRoot() returns true, only if the root is
        // set explicitly.  Probably a Backbone bug.
		    var rootPath = Backbone.history.decodeFragment(location.pathname);
        historyOptions = {
          root: rootPath
        };
      }
      Backbone.history.start(historyOptions);
      this._context && this._context.viewStateModel.set('history', true);
    },

    hasRouted: function () {
      return history.length > this._originalHistoryLength;
    },

    addUrlParameters: function (name, urlParameters) {
      this._routers.some(function (router) {
        if (router.name === name) {
          router.addUrlParameters(urlParameters);
          return true;
        }
      });
    },

    restoreRouter: function (lastRouterInfo) {
      this._routers.some(function (router) {
        if (router.name === lastRouterInfo.router) {
          router.restoring = true;
          router.restore(lastRouterInfo);
          return true;
        }
      });
    },

    _informOthers: function (activeRouter) {
      _.each(this._routers, function (router) {
        if (router !== activeRouter) {
          router.trigger('other:route', router, activeRouter);
        }
      });
    }
  });

  PerspectiveRouting.routesWithSlashes = routing.routesWithSlashes;

  return {
    //The is made singleton as the "hasRouted()" functionality will be helpful for widgets
    //to verify whether to display back button or not (Eg:SearchResultsHeaderView)
    getInstance: function (options) {
      if (!instance) {
        instance = new PerspectiveRouting(options);
      }
      return instance;
    },
    // TODO: Deprecate this method, use csui/utils/routing
    routesWithSlashes: routing.routesWithSlashes
  };
});

csui.define('csui/pages/start/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/pages/start/nls/root/lang',{
  // Used as a parameter in other patterns below
  ProductName: "OpenText Content Server",

  // Example: "John Smith - OpenText Content Server"
  // Pattern: "{0} - {1}"
  // {0} is the title of the metadata panel
  // {1} is the name of the product
  UserTitle: "{1}",

  // Example: "Folder CarbonFibre - OpenText Content Server"
  // Pattern: "{1} {0} - {2}",
  // {0} is the name of the node
  // {1} is the type of the node
  // {2} is the name of the product
  NodeTitle: "{1} {0} - {2}",

  // Example: "Properties of CarbonFibre - OpenText Content Server"
  // Pattern: "{0} of {1} - {2}",
  // {0} is the title of the metadata panel
  // {1} is the name of the node
  // {2} is the name of the product
  MetadataTitle:  "{0} of {1} - {2}",

  // Example: "Permissions of CarbonFibre - John Smith"
  // Pattern: "Permissions of {0} - {1}",
  // {0} is the name of the node
  // {1} is the name of the user
  PermissionsTitle:  "Permissions of {0} - {1}",

  // Example: "Searching for \"test\""
  // Pattern: "Searching for \"{0}\"",
  // {0} are the search terms
  SearchTitle:    "Searching for \"{0}\"",

  // Example: "Favorites - OpenText Content Server"
  // Pattern: "Favorites - {0}"
  // {0} is the name of the product
  FavoritesTitle: "Favorites - {0}",

  // Example: "My Assignments - OpenText Content Server"
  // Pattern: "My Assignments - {0}"
  // {0} is the name of the product
  MyAssignmentsTitle: "My Assignments - {0}",

  // Example: "Recently Accessed - OpenText Content Server"
  // Pattern: "Recently Accessed - {0}"
  // {0} is the name of the product
  RecentlyAccessedTitle: "Recently Accessed - {0}"
});


csui.define('csui/pages/start/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/pages/start/impl/nls/root/lang',{
  UserLoadingTitle: "Loading current user...",
  NodeLoadingTitle: "Loading {0}...",
  Home: 'Home',
  mainNavigationAria: 'Main navigation',
  profileMenuTitle: 'Profile Menu',
  profileMenuAria: 'Profile Menu of {0}',
  profileImageAlt: 'Profile Menu of {0}'
});


csui.define('csui/pages/start/impl/landing.perspective.router',['csui/lib/underscore', 'csui/utils/base',
  'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/user', 'i18n!csui/pages/start/nls/lang',
  'i18n!csui/pages/start/impl/nls/lang'
], function (_, base, PerspectiveRouter, ApplicationScopeModelFactory,
    UserModelFactory, publicLang, lang) {
  'use strict';

  var LandingPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      '*other': 'openLandingPerspective'
    },

    name: 'Landing',

    constructor: function LandingPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:id', this._updateHomeUrl);

      this.user = this.context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change:id', this._updatePageTitle);
    },

    openLandingPerspective: function (/*viewState*/) {
      this._updatePageTitle();
      this.applicationScope.set('id', '');
    },

    onViewStateChanged: function () {
      this._updateHomeUrl();
    },

    restore: function (viewState/*, sessionViewState*/) {
      this.openLandingPerspective(viewState);
    },

    _updateHomeUrl: function () {
      // Empty scope means landing page
      if (this.applicationScope.id) {
        return;
      }

      if (this !== this.getActiveRouter()) {
        this.activate(true);
      }

      this._updatePageTitle();
      this.navigate('');
    },

    _updatePageTitle: function () {
      if (this.applicationScope.id === "") {
        document.title = !this.user.has('name') ? lang.UserLoadingTitle :
                         _.str.sformat(publicLang.UserTitle, base.formatMemberName(this.user), publicLang.ProductName);
      }
    }
  }, {
    isDefault: true
  });

  return LandingPerspectiveRouter;
});

csui.define('csui/pages/start/impl/node.perspective.router',['module', 'csui/lib/jquery',
  'csui/lib/underscore', 'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/next.node', 'csui/models/node/node.model',
  'i18n!csui/pages/start/nls/lang', 'i18n!csui/pages/start/impl/nls/lang'
], function (module, $, _, PerspectiveRouter, NextNodeModelFactory, NodeModel, publicLang, lang) {
  'use strict';

  var NodePerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'nodes/:id': 'openNodePerspective',
      'nodes/:id(?*query_string)': 'openNodePerspective'
    },

    name: 'Node',

    constructor: function NodePerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.nextNode = this.context.getModel(NextNodeModelFactory);

      this.listenTo(this.nextNode, 'change:id', this._updateNodeUrl);
      this.listenTo(this.nextNode, 'change:id', this._updatePageTitle);

      // As long as perspective context fetches nextNode directly, it is
      // easier to listen to its changes, than for the contextual node
      this.listenTo(this.nextNode, 'change:name', this._updatePageTitle);
    },

    openNodePerspective: function (id, query_string) {

      if (NodeModel.usesIntegerId) {
        id = parseInt(id);
      }

      var setId = id && id !== this.nextNode.get('id');

      // if the id is changing we will make sure the viewStateModel does not trigger
      // changing the url until the id is updated.
      if (!this.restoring) {
        this.initViewStateFromUrlParams(query_string, setId);
      }

      this.activate(false);

      var context = this.context,
          viewStateModel = context.viewStateModel;

      if (setId) {
        // This is to make sure we do not reset the tab. When we go back we should not
        // reset the tab. (see tabbed.perspective.view. The whole tab resetting needs to be re-done.
        this.nextNode.get('id') && viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.navigation);
        this.nextNode.set('id', id);
      }


      // todo: remove this.
      setTimeout(function () {
        if (setId) {
          if (viewStateModel && viewStateModel.get('state') &&
              viewStateModel.get('state').filter) {
            viewStateModel.trigger('change:state');
          }
        }
      }, 1000);

    },

    onOtherRoute: function (/*thisRouter, activeRouter*/) {
      this.nextNode.clear({silent: true});
    },

    isViewStateModelSupported: function () {
      return true;
    },

    onViewStateChanged: function () {
      if (this.nextNode.get('id')) {
        this._updateNodeUrl();
      }
    },

    restore: function (routerInfo) {
      this.openNodePerspective(routerInfo.sessionState.id, routerInfo.state);
    },

    _updateNodeUrl: function () {
      var nextNode   = this.nextNode,
          nextNodeId = nextNode.get('id'),
          uri        = 'nodes/' + encodeURIComponent(nextNodeId);

      if (this !== this.getActiveRouter()) {
        this.activate(true);
      }

      this.navigate(uri);

    },

    initSessionViewState: function () {
      this._updateSessionState();
    },

    _updateSessionState: function () {
      // Update the session view state model with the node id we are navigating to.
      // Do this after the router has been activated.
      var nextNode       = this.nextNode,
          nextNodeId     = nextNode && nextNode.get('id'),
          viewStateModel = this.context && this.context.viewStateModel;

      // The sessionViewState keeps variables like the selected nodes and maybe the scroll position in the future.
      // If we are restoring, we will keep this information otherwise we will just reset it and the widgets will load
      // without this initialization.
      if (viewStateModel && nextNodeId) {
        var newSessionState = {};
        _.extend(newSessionState, viewStateModel.get(viewStateModel.CONSTANTS.SESSION_STATE));
        _.extend(newSessionState, {id: nextNodeId});
        viewStateModel.unset(viewStateModel.CONSTANTS.SESSION_STATE, {silent: true});
        viewStateModel.set(viewStateModel.CONSTANTS.SESSION_STATE, newSessionState);
      }
    },

    _updatePageTitle: function () {
      if (!this.nextNode.has('name')) {
        document.title = _.str.sformat(lang.NodeLoadingTitle, this.nextNode.get('id'));
      } else {
        document.title =  _.str.sformat(publicLang.NodeTitle, this.nextNode.get('name'), this.nextNode.get('type_name'), publicLang.ProductName);
      }
    }
  });

  return NodePerspectiveRouter;
});

csui.define('csui/pages/start/impl/search.perspective.router',[
  'module', 'csui/lib/underscore', 'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/user',
  'i18n!csui/pages/start/nls/lang', 'i18n!csui/pages/start/impl/nls/lang'
], function (module, _, PerspectiveRouter, SearchQueryModelFactory,
    UserModelFactory, publicLang, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    // TODO: Remove this parameters. Private modules must not have public
    // configuration. Introduce a public localization string, if you need
    // to override the page title.
    showTitle: true
  });

  var SearchPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'search/*path': 'openSearchPerspective'
    },

    constructor: function SearchPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.searchQuery = this.context.getModel(SearchQueryModelFactory);
      this.listenTo(this.searchQuery, 'change', this._updateSearchUrl);
    },

    openSearchPerspective: function (path) {
      // convert the path made of 'name/value' pairs to {name; value} map
      var name,
          parameters = _.reduce(path.split('/'), function (result, item) {
            if (name) {
              result[name] = item != null ? decodeURIComponent(item).trim() : '';
              name = undefined;
            } else {
              name = decodeURIComponent(item);
            }
            return result;
          }, {});
      this._updatePageTitle();

      var user = this.context.getModel(UserModelFactory);
      user.ensureFetched().then(_.bind(function () {
        // if context is coming from CVS then do 'silent:true' otherwise keep it false , to avoid
        // double call to _fetchSearchPerspective().
        this.searchQuery.set(parameters, {silent: !!this.searchQuery.get('query_id')});
      }, this));
    },

    onOtherRoute: function () {
      this.searchQuery.clear({silent: true});
    },

    routerURL: function (searchQuery) {
      var url = _.reduce(searchQuery.attributes, function (result, value, name) {
        if (value) {
          result += '/' + encodeURIComponent(name) + '/' + encodeURIComponent(value);
        } else {
          result += '/' + encodeURIComponent(name) + '/' + '%20';
        }
        return result;
      }, 'search');
      return url;
    },

    _updateSearchUrl: function () {
      if (this !== this.getActiveRouter()) {
        this.activate(true);
      }
      // format the path using the {name; value} map to 'name/value' pairs
      var url = this.routerURL(this.searchQuery);
      this._updatePageTitle();
      this.navigate(url);
    },

    _updatePageTitle: function () {
      if (config.showTitle) {
        document.title = _.str.sformat(publicLang.SearchTitle, this.searchQuery.get('where'));
      }
    },

    // TODO: Remove this. URLs have to be properly encoded and decoded.
    // Overriding this to pass the encoded url fragment to the 'openSearchPerspective' .
    // This is to ensure correct functionality even in the case of the search value containing '/' symbols.
    _extractParameters: function (route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function (param, i) {
        return param ? param : null;
      });
    }
  });

  return SearchPerspectiveRouter;
});

csui.define('csui/pages/start/impl/metadata.perspective.router',['module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/models/node/node.model',
  'i18n!csui/pages/start/nls/lang',
  'i18n!csui/pages/start/impl/nls/lang'
], function (module, $, _, Backbone, PerspectiveRouter, MetadataFactory, NodeModel, publicLang, lang) {
  'use strict';

  var MetadataPerspectiveRouter = PerspectiveRouter.extend({

    routes: {
      'nodes/:node_id/metadata': 'openMetadata',
      'nodes/:node_id/metadata(?*query_string)': 'openMetadata',
      'nodes/:node_id/metadata/navigator': 'openMetadataNavigator',
      'nodes/:node_id/metadata/navigator(?*query_string)': 'openMetadataNavigator'
    },

    name: "Metadata",

    constructor: function MetadataPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.metadataModel = this.context.getModel(MetadataFactory);

      this.listenTo(this.metadataModel, 'change:metadata_info', this._updateUrl);
      this.listenTo(this.metadataModel, 'change:metadata_info', this._updatePageTitle);
    },

    openMetadata: function (id, query_string) {
      this._open(id, query_string, false);
    },

    openMetadataNavigator: function (id, query_string) {
      this._open(id, query_string, true);
    },

    isViewStateModelSupported: function() {
      return true;
    },

    getInitialViewState: function () {
      var metadata_info = this.metadataModel && this.metadataModel.get('metadata_info');
      if (metadata_info && metadata_info.selectedTab) {
        var selectedTab = metadata_info.selectedTab;
        if (_.isString(selectedTab)) {
          return {dropdown: selectedTab};
        } else if (selectedTab instanceof Backbone.Model) {
          var name = selectedTab.get('name'), title = selectedTab.get('title');
          return {dropdown: name || title};
        }
      }
      return {};
    },

    _open: function (id, query_string, navigator) {

      if (NodeModel.usesIntegerId) {
        id = parseInt(id);
      }

      var metadata_info = this.metadataModel.get('metadata_info');

      var setId = !metadata_info || (id && id !== metadata_info.id);

      // if the id is changing we will make sure the viewStateModel does not trigger
      // changing the url until the id is updated.
      this.initViewStateFromUrlParams(query_string, setId);
      this.activate(false);

      if (setId) {
        this.metadataModel.set('metadata_info', {id: id, navigator: navigator});
      }
    },

    onOtherRoute: function () {
      this.metadataModel.clear({silent: true});
      var viewStateModel = this.context.viewStateModel;
      viewStateModel.unset(viewStateModel.CONSTANTS.METADATA_CONTAINER);
      viewStateModel.unset('displayBreadcrumbUpToParentOnly');
    },

    onViewStateChanged:function() {
      var metadata_info = this.metadataModel.get('metadata_info');
      if (metadata_info && metadata_info.id) {
        this._updateUrl();
      }

      var dropdownTitle = this.context.viewStateModel.getViewState("dropdownTitle");
      if (metadata_info && metadata_info.model && dropdownTitle) {
        this._updatePageTitle();
      }
    },

    _updateUrl: function () {

      if (this !== this.getActiveRouter()) {
        this.activate(true);
      }

      var metadata_info = this.metadataModel.get('metadata_info'),
          id = metadata_info.id,
          uri      = 'nodes/' + encodeURIComponent(id) + '/metadata';

      if (metadata_info.navigator) {
        uri += '/navigator';
        this.context.viewStateModel.set('displayBreadcrumbUpToParentOnly', true);
      }
      this.navigate(uri);
    },

    _updatePageTitle: function () {
      var metadata_info = this.metadataModel.get('metadata_info');
      if (metadata_info.model) {
        var modelTitle;

        if (this.context.viewStateModel) {
          modelTitle = this.context.viewStateModel.getViewState("dropdownTitle");
        }

        document.title = (!metadata_info.model.has('name') || !modelTitle) ?
                         _.str.sformat(lang.NodeLoadingTitle, metadata_info.model.get('id')) :
                         _.str.sformat(publicLang.MetadataTitle, modelTitle, metadata_info.model.get('name'), publicLang.ProductName);
      }
    }
  });

  return MetadataPerspectiveRouter;

});

csui.define('csui/pages/start/impl/root.perspective.router',['csui/lib/underscore',
  'csui/pages/start/perspective.router',
  'i18n!csui/pages/start/nls/lang'
], function (_, PerspectiveRouter, publicLang) {
  'use strict';

  var applicationScopes = {
    myassignments: _.str.sformat(publicLang.MyAssignmentsTitle, publicLang.ProductName),
    recentlyaccessed: _.str.sformat(publicLang.RecentlyAccessedTitle, publicLang.ProductName),
    favorites: _.str.sformat(publicLang.FavoritesTitle, publicLang.ProductName)
  };

  var RootPerspectiveRouter = PerspectiveRouter.extend({

    name: 'Root',

    routes: {
      'myassignments': 'openMyAssignmentsPerspective',
      'myassignments(?*query_string)': 'openMyAssignmentsPerspective',
      'recentlyaccessed': 'openRecentlyAccessedPerspective',
      'recentlyaccessed(?*query_string)': 'openRecentlyAccessedPerspective',
      'favorites': 'openFavoritesPerspective',
      'favorites(?*query_string)': 'openFavoritesPerspective'
    },

    constructor: function RootPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.listenTo(this.applicationScope, 'change:id', this._updateUrl);
    },

    openRecentlyAccessedPerspective: function(query_string) {
      this.openApplicationScope('recentlyaccessed', query_string);
    },

    openMyAssignmentsPerspective: function(query_string) {
      this.openApplicationScope('myassignments', query_string);
    },

    openFavoritesPerspective: function(query_string) {
      this.openApplicationScope('favorites', query_string);
    },

    openApplicationScope: function (scope, query_string) {
      this.initViewStateFromUrlParams(query_string);
      this.activate(false);
      this._updatePageTitle();
      this.applicationScope.set('id', scope);
    },

    isViewStateModelSupported: function () {
      return true;
    },

    onViewStateChanged: function () {
      this._updateUrl();
    },

    _updateUrl: function () {

      // Skip scopes handled by other routers
      var scope = this.applicationScope.id;

      // if (scope !== 'tasks' && scope !== 'recent' && scope !== 'favorites' && scope !== 'search')
      if (applicationScopes[scope]){

        if (this !== this.getActiveRouter()) {
          this.activate(true);
        }

        this._updatePageTitle();
        this.navigate(scope);
      }
    },

    _updatePageTitle: function () {
      document.title = applicationScopes[this.applicationScope.id];
    }

  });

  return RootPerspectiveRouter;

});

csui.define('csui/utils/classic.nodes/impl/core.classic.nodes',[],function () {
  'use strict';

  return [
    // Discussion
    {
      equals: {type: 215},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'view',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Discussion Topic or Reply
    {
      equals: {type: [130, 134]},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'view',
          objId: node.get('id'),
          show: 1,
          nexturl: location.href
        };
      }
    },
    // Task
    {
      equals: {type: 206},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTask',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Task List
    {
      equals: {type: 204},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTaskList',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Task Group
    {
      equals: {type: 205},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTaskGroup',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Milestone
    {
      equals: {type: 212},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseMilestone',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Channel
    {
      equals: {type: 207},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ViewChannel',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // News
    {
      equals: {type: 208},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ViewNews',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Poll
    {
      equals: {type: 218},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'OpenPoll',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // LiveReport
    {
      equals: {type: 299},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'RunReport',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Prospector
    {
      equals: {type: 384},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ProspectorBrowse',
          objId: node.get('id'),
          order: '-SCORE',
          summaries: 1,
          nexturl: location.href
        };
      }
    },
    // follow up
    {
      equals: {type: 31214},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'addresubmission',
          RS_FUNCTION: 'Edit',
          RSID: node.get('followup_id'),
          objId: node.get('location_id'),
          nexturl: location.href
        };
      }
    }
  ];
});

csui.define('csui/utils/content.helper',[
  'csui/utils/url', 'csui/models/version'
], function (Url, VersionModel) {
  'use strict';

  function getContentPageUrl (node) {
    var cgiUrl = new Url(node.connector.connection.url).getCgiScript();
    var urlQuery = {
      func: 'doc.fetchcsui',
      nodeid: node.get('id')
    };
    if (node instanceof VersionModel || node.get('version_number')) {
      urlQuery.vernum = node.get('version_number');
    }
    return Url.appendQuery(cgiUrl, Url.combineQueryString(urlQuery));
  }

  return {
    getContentPageUrl: getContentPageUrl
  };
});

csui.define('csui/utils/impl/core.defaultactionitems',[
  'csui/utils/classic.nodes/classic.nodes',
  'csui/utils/smart.nodes/smart.nodes'
], function (classicNodes, smartNodes) {
  'use strict';

  return [
    // Document and Generation
    // TODO: Move E-mail to its module
    {
      equals: {type: [144, 736, 2]},
      signature: 'OpenDocument',
      sequence: 10
    },
    // URL
    {
      type: 140,
      signature: 'Navigate',
      sequence: 30
    },
    // Saved Search Query
    {
      type: 258,
      signature: 'ExecuteSavedQuery',
      sequence: 30
    },
    // Nodes forced to be opened in Classic UI
    {
      signature: 'OpenSpecificClassicPage',
      sequence: 600,
      decides: function (node) {
        return classicNodes.isForced(node);
      }
    },
    // Containers (supported in Smart UI, but need a permission check)
    // THis fallback rule comes after the "OpenSpecificClassicPage" command,
    // because some containers may want to get redirected to Classic UI.
    {
      equals: {container: true},
      signature: 'Browse',
      sequence: 700
    },
    // Nodes, which should have just their perspective open in Smart UI
    {
      signature: 'OpenSpecificNodePerspective',
      sequence: 800,
      decides: function (node) {
        return smartNodes.isSupported(node);
      }
    }
  ];
});

csui.define('csui/utils/non-attaching.region/non-attaching.region',['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var NonAttachingRegion = Marionette.Region.extend({

    constructor: function NonAttachingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {}

  });

  return NonAttachingRegion;

});

csui.define('csui/utils/script-executing.region/script-executing.region',['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var ScriptExecutingRegion = Marionette.Region.extend({

    constructor: function ScriptExecutingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function(view) {
      this.$el
          .html('')
          .append(view.el);
    }

  });

  return ScriptExecutingRegion;

});

csui.define('csui/utils/node.links/impl/core.node.links',[
  'csui/utils/url'
], function (Url) {
  'use strict';

  return [
    {
      equals: {
        type: 140
      },
      getUrl: function (node) {
        return node.get('url');
      }
    },
    {
      equals: {
        type: 258
      },
      getUrl: function (node) {
        return Url.combine('search/query_id/', node.get('id'));
      }
    },
    {
      sequence: 1000,
      getUrl: function (node) {
        return Url.combine('nodes/', node.get('id'));
      }
    }
  ];
});

csui.define('csui/utils/open.authenticated.page',[
  'csui/lib/jquery', 'csui/utils/url'
], function ($, Url) {
  'use strict';

  function openAuthenticatedPage (connector, url, options) {
    var cgiUrl = new Url(connector.connection.url).getCgiScript();
    var ticket = connector.connection.session.ticket;

    var contentDocument = createWindowDocument();
    var form = createForm();
    createField('func', 'csui.authenticate');
    createField('otcsticket', ticket);
    createField('nexturl', url);
    form.submit();

    return $.Deferred().resolve().promise();

    function createWindowDocument() {
      options || (options = {});
      var content = options.window || (options.openInNewTab === false ?
          window : window.open('', '_blank'));
      return content.document;
    }

    function createForm() {
      var form = contentDocument.createElement('form');
      form.setAttribute('method', 'post');
      form.setAttribute('action', cgiUrl);
      contentDocument.body.appendChild(form);
      return form;
    }

    function createField(name, value) {
      var field = contentDocument.createElement('input');
      field.setAttribute('name', name);
      field.setAttribute('value', value);
      field.setAttribute('type', 'hidden');
      form.appendChild(field);
    }
  }

  return openAuthenticatedPage;
});

csui.define('csui/utils/smart.nodes/impl/core.smart.nodes',[],function () {
  'use strict';

  return [
    // Document and Generation
    // TODO: Move E-mail to its module
    {
      equals: {type: [144, 736, 2]},
    },
    // Containers - browse children by default
    {
      equals: {container: true},
      sequence: 1000
    }
  ];
});

csui.define('csui/utils/taskqueue',['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log'
], function (module, $, _, Backbone, log) {
  'use strict';

  log = log(module.id);

  var Task = Backbone.Model.extend({

    constructor: function Task(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.deferred = $.Deferred();
    },

    promise: function () {
      return this.deferred.promise();
    }

  });

  var TaskCollection = Backbone.Collection.extend({model: Task});

  function TaskQueue(options) {
    this.parallelism = options && options.parallelism || Infinity;
    this.pending = new TaskCollection(undefined, {model: Task});
    this.pending.on("add", this.dequeue, this);
    this.active = new TaskCollection(undefined, {model: Task});
  }

  _.extend(TaskQueue.prototype, {

    dequeue: function () {
      var task;
      log.debug(
          'Pending queue {0} contains {1} tasks, active queue {0} contains {1} tasks.',
          this.pending.cid, this.pending.length, this.active.cid, this.active.length)
      && console.log(log.last);
      if (this.active.length < this.parallelism &&
          (task = this.pending.shift())) {
        this.execute(task);
        this.dequeue();
      }
    },

    execute: function (task) {
      log.debug('Executing task {0}...', task.cid)
      && console.log(log.last);
      this.active.add(task);
      task.get("worker")()
          .done(task.deferred.done)
          .fail(task.deferred.fail)
          .always(_.bind(function () {
            this.active.remove(task);
            this.dequeue();
          }, this));
    }

  });

  TaskQueue.Task = Task;
  TaskQueue.TaskCollection = TaskCollection;
  TaskQueue.version = "1.0";

  return TaskQueue;

});

csui.define('csui/models/node/node.addable.type.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.addable.type.collection'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeAddableTypeCollection) {

  var AddableTypeCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'addableTypes',

    constructor: function AddableTypeCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var addableTypes = this.options.addableTypes || {};
      if (!(addableTypes instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
            config = module.config();
        addableTypes = new NodeAddableTypeCollection(addableTypes.models,
            _.defaults(
                {
                  // Prefer refreshing the entire collection after re-fetching it
                  // to improve rendering performance
                  autoreset: true
                },
                addableTypes.options,
                config.options,
                // node is intentionally listed at the end to give previous options preference
                {node: node}
            ));
      }
      this.property = addableTypes;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return AddableTypeCollectionFactory;

});

csui.define('csui/utils/contexts/context',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base', 'csui/utils/log', 'csui/models/view.state.model'
], function (_, $, Backbone, Marionette, base, log, viewStateModel) {
  'use strict';

  var Context = Marionette.Controller.extend({

    constructor: function Context(options) {
      this.cid = _.uniqueId('context');
      Marionette.Controller.prototype.constructor.apply(this, arguments);
      this._factories = {};
      // Prevent pre-set attributes to take part in unique object prefixes;
      // global options passed to all factories are only for initializing
      _.each(this.options.factories, function (object, key) {
        object.internal = true;
      });

      this.viewStateModel = viewStateModel;
    },

    // Offer an intuitive interface; when a model is needed, use getModel, when a collection
    // is needed, use getCollection, and when other object is needed, use getObject
    getModel: getObject,      // NodeModel, e.g.
    getCollection: getObject, // FavoriteCollection, e.g.
    getObject: getObject,     // Connector, e.g.

    // Offer an intuitive interface; when a model is needed, use hasModel, when a collection
    // is needed, use hasCollection, and when other object is needed, use hasObject
    hasModel: hasObject,      // NodeModel, e.g.
    hasCollection: hasObject, // FavoriteCollection, e.g.
    hasObject: hasObject,     // Connector, e.g.

    getFactory: function (Factory, options) {
      return this._getFactory(Factory, options, true);
    },

    clear: function (options) {
      log.info('Clearing the context started.') && console.log(log.last);
      this.triggerMethod('before:clear', this);
      if (options && options.all) {
        this._destroyAllFactories();
      } else {
        this._destroyNonPermanentFactories();
      }
      log.info('Clearing the context succeeded.') && console.log(log.last);
      this.triggerMethod('clear', this);
      return this;
    },

    fetch: function (options) {
      log.info('Fetching the context started.') && console.log(log.last);
      this.triggerMethod('request', this);
      this._destroyTemporaryFactories();
      var self = this,
          promises = _.chain(this._factories)
              .filter(function (factory) {
                return self._isFetchable(factory);
              })
              .map(function (factory) {
                var clonedOptions = options ? _.clone(options) : {};
                return factory.fetch(clonedOptions);
              })
              .compact()
              .value();
      return $.when
          .apply($, promises)
          .then(function () {
            log.info('Fetching the context succeeded.') && console.log(log.last);
            self.triggerMethod('sync', self);
          }, function (request, statusText, messageText) {
            var error = new base.Error(request);
            log.error('Fetching the context failed: {0}', error) &&
            console.error(log.last);
            self.triggerMethod('error', error);
            return $.Deferred().reject(error);
          });
    },

    _isFetchable: function (factory) {
      if (factory.options.detached) {
        return false;
      }
      if (factory.isFetchable) {
        return factory.isFetchable();
      }
      return !!factory.fetch;
    },

    _destroyTemporaryFactories: function () {
      this._factories = _.pick(this._factories, function (factory) {
        if (factory.options.temporary) {
          factory.destroy();
        } else {
          return true;
        }
      }, this);
    },

    _destroyNonPermanentFactories: function () {
      this._factories = _.pick(this._factories, function (factory) {
        if (factory.options && factory.options.permanent) {
          return true;
        } else {
          factory.destroy();
        }
      }, this);
    },

    _destroyAllFactories: function () {
      _.each(this._factories, function (factory) {
        factory.destroy();
      });
      this._factories = {};
    },

    _getPropertyName: function (Factory, options) {
      options || (options = {});
      // Pre-initializing the model with its type or id will make it unique in the context
      var attributes = options.attributes || {};

      // Stamp globally unique factory names by an artificial attribute
      if (options.unique) {
        attributes = _.extend({
          stamp: _.uniqueId()
        }, attributes);
      }
      return _.reduce(attributes, function (result, value, key) {
        if (value == null) {
          return result;
        }
        if(result !== null) {
          return result + '-' + key + '-' + value;
        }
        return key + '-' + value;
      }, Factory.prototype.propertyPrefix);
    },

    _getFactory: function (Factory, options, createIfNotFound) {
      // Support getting objects by the factory name, if the factory object
      // cannot be required as a dependency
      if (typeof Factory === 'string') {
        return this._factories[Factory];
      }
      options || (options = {});
      // Factories expect their options in a property named with their prefix; options for all
      // factories are together to allow passing options to nested factories
      var propertyPrefix = Factory.prototype.propertyPrefix,
          globalOptions = this.options.factories || {},
          objectOptions, nameOptions, factoryOptions;
      // Calls outside the factories can pass options.  Further calls to nested factories include
      // options from the context constructor already; do not extend the options in that case.
      if (options.internal) {
        objectOptions = options[propertyPrefix];
        // It is not possible to use the pre-initializing of the factory
        // properties for nested factories.  It works only on the first
        // level - for the caller outside the context constructor.
        if (objectOptions && !objectOptions.internal &&
            !(objectOptions instanceof Backbone.Model)) {
          // Limit the parameters to the only object useful for the _getPropertyName
          nameOptions = {
            attributes: objectOptions.attributes,
            unique: objectOptions.unique
          };
        }
      } else {
        // The caller outside the factories does not need to wrap the options in the factory
        // prefix key; we do it here for their convenience
        objectOptions = options[propertyPrefix];
        // If no factory options were passed in, let the context ctor options merge in
        if (objectOptions === undefined && !_.isEmpty(options)) {
          // Merge this factory options from context constructor with getObject arguments
          factoryOptions = _.omit(options,
              'detached', 'permanent', 'temporary', 'unique');
          if (!_.isEmpty(factoryOptions)) {
            options[propertyPrefix] = _.defaults(factoryOptions, globalOptions[propertyPrefix]);
          }
        }
        _.defaults(options, {
          internal: true
        }, globalOptions);
        // Prefer the attributes passed to the getObject method directly
        // to the attributes passed via the factory-specific options.
        // If the factory-specific options are a Backbone model, it is
        // the scenario pre-initializing the factory properties and the
        // explicit attributes are mandatory then.
        nameOptions = {
          attributes: options.attributes,
          unique: options.unique
        };
        if (!nameOptions.attributes && objectOptions && !objectOptions.internal &&
            !(objectOptions instanceof Backbone.Model)) {
          // Limit the parameters to the only object useful for the _getPropertyName
          nameOptions = {
            attributes: objectOptions.attributes,
            unique: objectOptions.unique
          };
        }
      }
      // The property name for the factory is computed just from its options
      var propertyName = this._getPropertyName(Factory, nameOptions),
          factory = this._factories[propertyName];
      if (!factory && createIfNotFound) {
        options.factoryName = propertyName;
        factory = new Factory(this, options);
        this._factories[propertyName] = factory;
      }
      return factory;
    }

  });

  function getObject(Factory, options) {
    var factory = this._getFactory(Factory, options, true);
    return factory.property;
  }

  function hasObject(Factory, options) {
    return !!this._getFactory(Factory, options, false);
  }

  return Context;

});

csui.define('csui/utils/contexts/context.plugin',[
  'csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';

  function ContextPlugin(options) {
    this.context = options.context;
  }

  _.extend(ContextPlugin.prototype, Backbone.Events, {
    // Called when a factory is questioned if it is fetchable; it will be
    // considered fetchable, unless this method returns false
    isFetchable: function (factory) {}
  });

  ContextPlugin.extend = Backbone.Model.extend;

  return ContextPlugin;
});

csui.define('csui/utils/contexts/impl/node.opening.context',[
  'csui/utils/contexts/context',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/node.links/node.links',
  'csui/utils/contexts/factories/user'
], function (Context, ConnectorFactory, NextNodeModelFactory,
    nodeLinks, UserModelFactory) {
  'use strict';

  // FIXME: Copied from node perspective context plugin.
  var nodeOptions = {
    fields: {
      properties: [],
      columns: [],
      'versions.element(0)': ['mime_type']
    },
    includeResources: ['metadata', 'perspective']
  };

  var NodeOpeningContext = Context.extend({
    constructor: function NodeOpeningContext(options) {
      Context.prototype.constructor.apply(this, arguments);

      this.connector = this.getObject(ConnectorFactory, {
        permanent: true,
        detached: true
      });
      this.user = this.getModel(UserModelFactory, {
        permanent: true
      });
      this.nextNode = this.getModel(
          NextNodeModelFactory, {
            options: nodeOptions,
            permanent: true,
            detached: true
          })
          .on('change:id', this.onNextNodeChanged, this);
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             // The user model should be fetched only at the beginning
             (factory.property !== this.user || !this.user.get('id'));
    },

    openNodePage: function (node) {
      this.triggerMethod('before:open:page', this, this.nextNode);
      window.open(nodeLinks.getUrl(node));
    }
  });

  return NodeOpeningContext;
});

csui.define('csui/utils/contexts/factories/previous.node',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model'
], function (module, _, Backbone, ModelFactory, ConnectorFactory, NodeModel) {
  'use strict';

  var PreviousNodeModelFactory = ModelFactory.extend({

    propertyPrefix: 'previousNode',

    constructor: function PreviousNodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var connector = context.getObject(ConnectorFactory, options),
          config = module.config();
      this.property = new NodeModel(undefined,
          _.defaults({
            connector: connector
          }, config.options));
    }

  });

  return PreviousNodeModelFactory;

});

csui.define('csui/utils/contexts/impl/delayed.actions.for.node',[
  'csui/utils/commands', 'csui/utils/defaultactionitems'
], function (commands, defaultActionItems) {
  'use strict';

  function delayCommands (node) {
    node.resetCommands();
    node.resetDefaultActionCommands();
    node.setCommands(commands.getAllSignatures());
    node.setDefaultActionCommands(defaultActionItems.getAllCommandSignatures(commands));
    node.setEnabledDelayRestCommands(true, false);
  }

  function relayActionEvents (context) {
    if (context.nextNode.delayRestCommands) {
      context.nextNode.delayedActions
          .on('request', relayRequestNodeActions, context)
          .on('sync', relaySyncNodeActions, context)
          .on('error', relayErrorNodeActions, context);
      context.nextNode.actions
          .on('reset update', relayUpdateNodeActions, context);
      resumeRelayingActionEvents(context);
    }
  }

  function relayRequestNodeActions () {
    if (this.relayingActionEvents) {
      var delayedActions = this.node.delayedActions;
      delayedActions._fetchStarted();
      delayedActions.trigger('request', delayedActions, {}, {});
      delayedActions.fetching = this.nextNode.delayedActions.fetching;
    }
  }

  function relaySyncNodeActions () {
    if (this.relayingActionEvents) {
      var delayedActions = this.node.delayedActions;
      delayedActions._fetchSucceeded();
      delayedActions.trigger('sync', delayedActions, {}, {});
    }
  }

  function relayErrorNodeActions () {
    if (this.relayingActionEvents) {
      var delayedActions = this.node.delayedActions;
      delayedActions._fetchFailed();
      delayedActions.trigger('error', delayedActions, {}, {});
    }
  }

  function relayUpdateNodeActions () {
    if (this.relayingActionEvents) {
      updateNodeActions(this);
    }
  }

  function suppressRelayingActionEvents (context) {
    if (context.nextNode.delayRestCommands) {
      context.relayingActionEvents = false;
    }
  }

  function resumeRelayingActionEvents (context) {
    if (context.nextNode.delayRestCommands) {
      context.relayingActionEvents = true;
    }
  }

  function updateNodeActions(context) {
    if (context.nextNode.delayRestCommands) {
      context.node.actions.reset(context.nextNode.actions.models);
    }
  }

  return {
    delayCommands: delayCommands,
    relayActionEvents: relayActionEvents,
    suppressRelayingActionEvents: suppressRelayingActionEvents,
    resumeRelayingActionEvents: resumeRelayingActionEvents,
    updateNodeActions: updateNodeActions
  };
});


csui.define('csui/utils/contexts/browsing/browsing.context',[
  'require', 'csui/lib/underscore',
  'csui/utils/contexts/impl/node.opening.context',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/impl/delayed.actions.for.node',
  'csui-ext!csui/utils/contexts/browsing/browsing.context'
], function (require, _, NodeOpeningContext, NodeModelFactory,
    PreviousNodeModelFactory, delayedActions, contextPlugins) {
  'use strict';

  // FIXME: Copied from node perspective context plugin.
  var nodeOptions = {
    fields: {
      properties: [],
      columns: []
    },
    includeResources: ['metadata', 'perspective']
  };

  var BrowsingContext = NodeOpeningContext.extend({
    constructor: function BrowsingContext(options) {
      NodeOpeningContext.prototype.constructor.apply(this, arguments);

      this.on('request', this._changeNode, this);

      this.previousNode = this.getModel(PreviousNodeModelFactory, {
        permanent: true,
        detached: true
      });
      // TODO: Re-enable delayed actions once views can handle them properly.
      // delayedActions.delayCommands(this.nextNode);
      delayedActions.relayActionEvents(this);
      this.node = this.getModel(NodeModelFactory, {
        options: nodeOptions,
        permanent: true,
        detached: true
      });
      // TODO: Re-enable delayed actions once views can handle them properly.
      // delayedActions.delayCommands(this.node);

      // Keep the same order as in perspective context
      var Plugins = _
          .chain(options && options.plugins || contextPlugins)
          .flatten(true)
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
      _.invoke(this._plugins, 'onCreate');
    },

    _isFetchable: function (factory) {
      return NodeOpeningContext.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    onNextNodeChanged: function () {
      // Setting just node ID to nextNode will try to drill down;
      // non-containers are handled by opening a new window, but
      // need passing more node attributes to nextNode
      if (this.nextNode.get('container') !== false) {
        this.enterContainer();
      } else {
        this.openNewNodePage();
      }
    },

    openNewNodePage: function () {
      this.openNodePage(this.nextNode);
      this.nextNode.clear({silent: true});
    },

    enterContainer: function () {
      this.triggerMethod('before:enter:container', this, this.nextNode);
      this.nextNode
          .fetch()
          .then(function () {
            this._enteringContainer = true;
            return this.fetch();
          }.bind(this))
          .fail(function (error) {
            csui.require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
              ModalAlert.showError(error.toString());
            });
          });
    },

    _changeNode: function () {
      if (this._enteringContainer) {
        this.previousNode.clear({silent: true});
        this.previousNode.set(this.node.attributes);
        this.node.clear({silent: true});
        this.node.set(this.nextNode.attributes);
        delayedActions.updateNodeActions(this);
        this.nextNode.clear({silent: true});
        this._enteringContainer = false;
      }
    },

    fetch: function () {
      var parameters = Array.prototype.slice.apply(arguments),
          self = this;

      function continueFetching () {
        NodeOpeningContext.prototype.fetch.apply(self, parameters);
      }

      if (!this._enteringContainer && this.node.isFetchable()) {
        this.triggerMethod('before:enter:container', this, this.node);
        return this.node
            .fetch()
            .then(continueFetching);
      }
      return continueFetching();
    }
  });

  return BrowsingContext;
});


csui.define('csui/utils/contexts/page/page.context',[
  'csui/lib/underscore', 'csui/utils/contexts/context',
  'csui-ext!csui/utils/contexts/page/page.context'
], function (_, Context, contextPlugins) {
  'use strict';

  var PageContext = Context.extend({
    constructor: function PageContext() {
      Context.prototype.constructor.apply(this, arguments);

      // Keep the same order as in perspective context
      var Plugins = _
          .chain(contextPlugins)
          .flatten(true)
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    }
  });

  return PageContext;
});


csui.define('csui/utils/contexts/portal/portal.context',[
  'csui/lib/underscore', 'csui/utils/contexts/impl/node.opening.context',
  'csui-ext!csui/utils/contexts/portal/portal.context'
], function (_, NodeOpeningContext, contextPlugins) {
  'use strict';

  var PortalContext = NodeOpeningContext.extend({
    constructor: function PortalContext(options) {
      NodeOpeningContext.prototype.constructor.apply(this, arguments);

      // Keep the same order as in perspective context
      var Plugins = _
          .chain(options && options.plugins || contextPlugins)
          .flatten(true)
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
      _.invoke(this._plugins, 'onCreate');
    },

    _isFetchable: function (factory) {
      return NodeOpeningContext.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    onNextNodeChanged: function () {
      this.openNewNodePage();
    },

    openNewNodePage: function () {
      this.openNodePage(this.nextNode);
      this.nextNode.clear({silent: true});
    }
  });

  return PortalContext;
});

csui.define('csui/utils/contexts/perspective/perspective.context.plugin',[
  'csui/utils/contexts/context.plugin'
], function (ContextPlugin) {
  'use strict';

  var PerspectiveContextPlugin = ContextPlugin.extend({
    // Called when the context and all plugins are constructed.
    onCreate: function () {},

    // Called when the perspective was fetched, but it was not applied yet.
    // If it returns `true` the original perspective will not be applied; the
    // plugin si expected to apply an alternative one.
    onApply: function () {},

    // Called when the context is cleared, when a new perspective is loading
    onClear: function () {},

    // Called when the context is going to be re-fetched, because the current
    // perspective did not change
    onRefresh: function () {},
  });

  return PerspectiveContextPlugin;
});


csui.define('csui/utils/contexts/perspective/landing.perspectives',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external perspectives
  'csui-ext!csui/utils/contexts/perspective/landing.perspectives'
], function (_, Backbone, RulesMatchingMixin, extraPerspectives) {

  var UserPerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      important: false,
      module: null
    },

    constructor: function UserPerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(UserPerspectiveModel.prototype);

  var UserPerspectiveCollection = Backbone.Collection.extend({

    model: UserPerspectiveModel,
    comparator: "sequence",

    constructor: function UserPerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByUser: function (user) {
      return this.find(function (item) {
        return item.matchRules(user, item.attributes);
      });
    }

  });

  var userPerspectives = new UserPerspectiveCollection([
    {
      // default landing page
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/user.json',
      sequence: 10000
    }
  ]);

  if (extraPerspectives) {
    userPerspectives.add(_.flatten(extraPerspectives, true));
  }

  return userPerspectives;

});

csui.define('csui/utils/contexts/perspective/impl/landing.perspective.context.plugin',['csui/lib/underscore', 'csui/utils/log',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/landing.perspectives',
  'csui/models/perspective/personalization.model',
], function (_, log, UserModelFactory, ApplicationScopeModelFactory,
    PerspectiveContextPlugin, landingPerspectives, PersonalizationModel) {
  'use strict';

  var LandingPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function LandingPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory)
          .on('change:id', this._fetchLandingPerspective, this);
      this.userFactory = this.context.getFactory(UserModelFactory);
      this.user = this.userFactory.property;
    },

    _fetchLandingPerspective: function () {
      // Empty scope means landing page
      if (this.applicationScope.id) {
        return;
      }
      this.context.triggerMethod('request:perspective', this);
      // Use the factory to allow pre-fetching data from the page.
      this.userFactory.fetch({
        success: _.bind(this._onUserFetchSuccess, this, this.user),
        error: _.bind(this.context.rejectPerspective, this.context)
      });
    },

    _onUserFetchSuccess: function (user) {
      // TODO Reconsider having this function to fetch personalization once REST API is ready.
      var that = this;
      PersonalizationModel.loadPersonalization(user, this.context)
          .then(
              _.bind(this._changePerspective, this, user),
              _.bind(this.context.rejectPerspective, this.context));
    },

    _changePerspective: function (sourceModel, personalization) {
      var perspectiveModule,
          perspective = landingPerspectives.findByUser(sourceModel);

      // Let override landing page on the client side
      if ((_.isEmpty(sourceModel.get('perspective')) && _.isEmpty(personalization)) ||
          perspective.get('important')) {
        perspectiveModule = perspective.get('module');
      }
      if (perspectiveModule) {
        return this.context.overridePerspective(sourceModel, perspectiveModule);
      }
      this.context.applyPerspective(sourceModel, false, personalization);
    }

  });

  return LandingPerspectiveContextPlugin;

});


csui.define('csui/utils/contexts/perspective/node.perspectives',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external perspectives
  'csui-ext!csui/utils/contexts/perspective/node.perspectives'
], function (_, Backbone, RulesMatchingMixin, extraPerspectives) {

  var NodePerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      important: false,
      module: null
    },

    constructor: function NodePerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(NodePerspectiveModel.prototype);

  var NodePerspectiveCollection = Backbone.Collection.extend({

    model: NodePerspectiveModel,
    comparator: "sequence",

    constructor: function NodePerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }

  });

  var nodePerspectives = new NodePerspectiveCollection([
    {
      // saved search query
      equals: {type: 258},
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/saved.query.json',
      sequence: 100
    },
    {
      // document
      equals: {type: 144},
      important: true,
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/document.overview.json',
      sequence: 100
    },
    {
      // node container
      equals: {container: true},
      persist: true,
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/container.json',
      sequence: 1000
    },
    {
      // default node
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/metadata.json',
      sequence: 10000
    }
  ]);

  if (extraPerspectives) {
    nodePerspectives.add(_.flatten(extraPerspectives, true));
  }

  return nodePerspectives;

});


csui.define('csui/utils/contexts/perspective/plugins/node/node.extra.data',[
  'csui/lib/underscore',
  // Load external extra node data
  'csui-ext!csui/utils/contexts/perspective/plugins/node/node.extra.data'
], function (_, extraNodeData) {
  'use strict';

  return {
    getModelFields: function (options) {
      var modelFields = {};
      if (extraNodeData) {
        _.each(extraNodeData, function (nodeData) {
          if (nodeData.getModelFields) {
            _.mapObject(nodeData.getModelFields(options), function (val, key) {
              modelFields[key] = _.union(modelFields[key], val);
            });
          }
        });
      }
      return modelFields;
    },

    getModelExpand: function (options) {
      var modelExpands = {};
      if (extraNodeData) {
        _.each(extraNodeData, function (nodeData) {
          if (nodeData.getModelExpand) {
            _.mapObject(nodeData.getModelExpand(options), function (val, key) {
              modelExpands[key] = _.union(modelExpands[key], val);
            });
          }
        });
      }
      return modelExpands;
    }
  };

});

csui.define('csui/utils/contexts/perspective/plugins/node/node.perspective.context.plugin',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/node.perspectives',
  'csui/utils/classic.nodes/classic.nodes',
  'csui/utils/contexts/impl/delayed.actions.for.node',
  'csui/utils/contexts/perspective/plugins/node/node.extra.data',
  'csui/models/perspective/personalization.model'
], function (module, _, Backbone, NodeModelFactory, NextNodeModelFactory,
    PreviousNodeModelFactory, ApplicationScopeModelFactory,
    PerspectiveContextPlugin, nodePerspectives, classicNodes,
    delayedActions, nodeExtraData, PersonalizationModel) {
  'use strict';

  var config = module.config();
  var sendOriginParams  = config.sendOriginParams;

  var nodeOptions = {
    fields: nodeExtraData.getModelFields(),
    expand: nodeExtraData.getModelExpand(),
    includeResources: ['metadata', 'perspective']
  };

  var NodePerspectiveContextPlugin = PerspectiveContextPlugin.extend({
    constructor: function NodePerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory);

      this.nextNodeFactory = this.context.getFactory(NextNodeModelFactory, {
        options: nodeOptions,
        permanent: true,
        detached: true
      });
      this.nextNode = this.nextNodeFactory.property;
      // TODO: Re-enable delayed actions once views can handle them properly.
      // delayedActions.delayCommands(this.nextNode);
      delayedActions.relayActionEvents(this);
      this.nextNode.on('change:id', this._fetchNodePerspective, this);

      // TODO: Remove previousNode. Nobody should use it.
      this.previousNode = this.context
          .getModel(PreviousNodeModelFactory, {
            permanent: true,
            detached: true
          });

      // Move the contextual node out of permanent factories; it cannot be
      // retained, because when the perspective switches, other models could
      // be listening on it and would waist a fetch, because their views are
      // going to be destroyed with the old perspective. Create the node right
      // away, though, to ensure, that the expected factory options will be set.
      createNodeModel.call(this);
    },

    onClear: function () {
      this._clearModels(true);
    },

    onRefresh: function () {
      this._clearModels(false);
    },

    isFetchable: function (factory) {
      // The contextual node is fetched by fetchPerspective already.
      return factory.property !== this.node;
    },

    _clearModels: function (recreateNode) {
      // Reset the next-node model on navigating to other than node perspective.
      // Allow navigation to the previously visited node from that perspective.
      if (this.applicationScope.id !== 'node') {
        clearCurrentNode.call(this);
        return this.nextNode.clear({silent: true});
      }

      clearCurrentNode.call(this);
      // Do not trigger change events, when the node was recreated. Nobody had a chance
      // to subscribe to change events on the node created right above.
      var delayChangeEvents = !recreateNode && (
          // If there are no children used on the page do not delay the events.
          // Delaying the events is a dirty hack only to make the nodestable widget
          // feel rendering smoother. It does not help much anyway.
          this.context.hasCollection('children') ||
          this.context.hasCollection('children2'));
      // Initialize the contextual node. It needs to be complete, so that widget
      // can use it to ask for their models. It should not trigger events, if the
      // container model is used together with children. csui renders very slowly
      // and triggering the change events together with children will make the
      // rendering appear less busy.
      this.node.set(this.nextNode.attributes, {silent: delayChangeEvents});

      if (delayChangeEvents) {
        var children = this.context.hasCollection('children') &&
                       this.context.getCollection('children') ||
                       this.context.hasCollection('children2') &&
                       this.context.getCollection('children2');
        children.once('reset update', function () {
          this.node.triggerAllChanges();
          delayedActions.updateNodeActions(this);
          // Resume updating actions on the current node suppressed during the navigation.
          delayedActions.resumeRelayingActionEvents(this);
        }, this);
      } else {
        delayedActions.updateNodeActions(this);
        // Resume updating actions on the current node suppressed during the navigation.
        delayedActions.resumeRelayingActionEvents(this);
      }

      function clearCurrentNode() {
        // TODO: Remove previousNode. Nobody should use it.
        // make these operations silently as we do not need views react on this
        this.previousNode.clear({silent: true});
        this.previousNode.set(this.node.attributes, {silent: true});

        // Create the new model if it has not existed yet (the node perspective
        // is navigated to for the first time), or if thi navigation is not
        // a drill down and a new model has to be added to prevent changes
        // on the current perspective, which is going to be destroyed.
        if (recreateNode) {
          createNodeModel.call(this);
        } else {
          this.node.clear({silent: true});
        }
      }
    },

    _fetchNodePerspective: function () {
      Backbone.trigger('closeToggleAction');
      // Compatibility with the early way how to go to the landing page
      var nextNodeId = this.nextNode.get('id');
      if (nextNodeId == null || nextNodeId <= 0) {
        return;
      }
      this.context.triggerMethod('request:perspective', this);
      this.applicationScope.set('id', 'node');
      // Do not update actions on the current node; a new node will be created soon.
      delayedActions.suppressRelayingActionEvents(this);
      // Use the factory to allow pre-fetching data from the page.
      var options = {
        success: _.bind(this._onNodeFetchSuccess, this, this.nextNode),
        error: _.bind(this.context.rejectPerspective, this.context)
      };
      if (sendOriginParams) {
        options.headers = { 'X-OriginParams': location.search };
      }
      this.nextNodeFactory.fetch(options);
    },

    _onNodeFetchSuccess: function (node) {
      // TODO Reconsider having this function to fetch personalization once REST API is ready.
      var that = this;
      PersonalizationModel.loadPersonalization(node, this.context)
          .then(
              _.bind(this._changePerspective, this, node),
              _.bind(this.context.rejectPerspective, this.context));
    },

    _changePerspective: function (sourceModel, personalization) {
      // Check if the node is forced to be opened in Classic UI
      var classicUrl = classicNodes.getUrl(sourceModel);
      if (classicUrl) {
        window.location.replace(classicUrl);
        return;
      }

      var perspectiveModule,
          perspective = nodePerspectives.findByNode(sourceModel);
      // Avoid opening a non-container in the children-browse perspective
      // and prefer important client-side perspectives too
      if ((_.isEmpty(sourceModel.get('perspective')) && _.isEmpty(personalization)) ||
          !sourceModel.get('container') ||
          perspective.get('important')) {
        perspectiveModule = perspective.get('module');
      }
      if (perspective) {
        sourceModel.set({"persist": perspective.get("persist")}, {silent: true});
      }
      if (perspectiveModule) {
        return this.context.overridePerspective(sourceModel, perspectiveModule);
      }

      this.context.applyPerspective(sourceModel, false, personalization);
    }
  });

  function createNodeModel() {
    this.node = this.context
        .getModel(NodeModelFactory, {
          options: nodeOptions
        });
    // TODO: Re-enable delayed actions once views can handle them properly.
    // delayedActions.delayCommands(this.node);
  }

  return NodePerspectiveContextPlugin;
});


csui.define('csui/utils/contexts/perspective/search.perspectives',['module',
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external perspectives
  'csui-ext!csui/utils/contexts/perspective/search.perspectives'
], function (module, _, Backbone, RulesMatchingMixin, extraPerspectives) {

  var config = module.config();
  _.defaults(config, {
    perspectiveCollection:[{
      // default search
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/search.json',
      sequence: 10000
    }]
  });

  var SearchPerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      module: null
    },

    constructor: function SearchPerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(SearchPerspectiveModel.prototype);

  var SearchPerspectiveCollection = Backbone.Collection.extend({

    model: SearchPerspectiveModel,
    comparator: "sequence",

    constructor: function SearchPerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByQuery: function (query) {
      return this.find(function (item) {
        return item.matchRules(query, item.attributes);
      });
    }

  });

  var searchPerspectives = new SearchPerspectiveCollection(config.perspectiveCollection);

  if (extraPerspectives) {
    searchPerspectives.add(_.flatten(extraPerspectives, true));
  }

  return searchPerspectives;

});

csui.define('csui/utils/contexts/perspective/impl/search.perspective.context.plugin',['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/search.perspectives'
], function (require, _, Backbone, log, SearchQueryModelFactory,
    ApplicationScopeModelFactory, PerspectiveContextPlugin,
    searchPerspectives) {
  'use strict';

  var SearchPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function SearchPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory);
      this.searchQuery = this.context
          .getModel(SearchQueryModelFactory, {
            permanent: true,
            detached: true
          })
          .on('change', this._fetchSearchPerspective, this);
    },

    _fetchSearchPerspective: function () {
      if (this.applicationScope.get('id') === 'search') {
        // Not necessary to update perspective, since currently showing search.
        return;
      }
      var perspective            = searchPerspectives.findByQuery(this.searchQuery),
          // Search results should be displayed in new perspective when someone requred for it or navigating between location search and CVS
          forcePerspectiveChange = this.searchQuery.get('forcePerspectiveChange');
      this.applicationScope.set('id', 'search'); // set application view state
      this.context.loadPerspective(perspective.get('module'), forcePerspectiveChange);
      this.listenToOnce(this.context, 'sync:perspective', function () {
        this.searchQuery.unset('forcePerspectiveChange', {silent: true});
      });
    },

  });

  return SearchPerspectiveContextPlugin;

});

csui.define('csui/utils/contexts/perspective/impl/metadata.perspective.context.plugin',['module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/log',
  'csui/models/node/node.model'
], function (module, _, Backbone, Marionette, $, ApplicationScopeModelFactory,
    MetadataModelFactory, PerspectiveContextPlugin, NodeModelFactory, NextNodeModelFactory, log) {
  'use strict';

  log = log(module.id);

  var MetadataPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function MetadataPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.metadataModel = this.context
          .getModel(MetadataModelFactory, {
            permanent: true,
            detached: true
          })
          .on('change:metadata_info', this._fetchMetadataPerspective, this);

      this.listenTo(this.context, "clear", this._prepareContext);
    },

    _prepareContext: function () {
      if (this.applicationScope.get('id') === 'properties') {

        this.node = this.context.getModel(NodeModelFactory);
        var nodeId = this.metadataModel.get('metadata_info').id;
        this.node.set('id', nodeId);

        var metadata_info = this.metadataModel.get('metadata_info'),
            contextSync = false;

        if (this.containerNode && this.containerNode.get('id')) {
          this._syncContextToNode(this.containerNode);
          contextSync = true;
        }

        if (!metadata_info.navigator) {
          this.node.fetch({
            success: function() {
              if (!contextSync) {
                this._syncContextToNode(this.node);
              }
            }.bind(this),
            error: _.bind(this._errorFetchingNode, this, this.node)
          });
        } else {
          if (!contextSync) {
            this.node.fetch({
              success: _.bind(this._doneFetchingNode, this, this.node),
              error: _.bind(this._errorFetchingNode, this, this.node)
            });
          }
        }

        this.listenTo(this.node, "change:id", this._contextNodeIdChanged);
      }
    },

    _doneFetchingNode: function() {
      var parentNode = this.node.clone();
      this._contextNodeIdChanged();
      parentNode.set('id', this.node.get('parent_id'));
      parentNode.fetch({
        success: _.bind(this._syncContextToNode, this, parentNode),
        error: _.bind(this._errorFetchingNode, this, parentNode)
      });
    },

    _syncContextToNode: function (node) {
      var context = this.context,
          viewStateModel = context.viewStateModel;

      context.triggerMethod('sync:perspective', this.context, node);
      viewStateModel.set(viewStateModel.CONSTANTS.METADATA_CONTAINER, {
        id: node.get('id'),
        name: node.get('name')
      });
    },

    _errorFetchingNode: function (node) {
      log.error('Unable to fetch node {%0}. ', this.node.get('id'));
    },

    _contextNodeIdChanged: function () {
      var metadata_info = _.clone(this.metadataModel.get('metadata_info'));
      metadata_info.id = this.node.get('id');
      metadata_info.model = this.node;
      this.metadataModel.set('metadata_info', metadata_info);
    },

    _fetchMetadataPerspective: function () {
      var metadata_info = this.metadataModel.get('metadata_info');
      var model = metadata_info.model;
      if (this.applicationScope.get('id') === 'properties') {
        if (model) {
          this.node.set( model.attributes);
        } else {
          var node = this.context.getModel(NodeModelFactory);
          node.set('id', metadata_info.id);
          node.fetch({
            success: function () {
              this.node = node.clone();
               metadata_info.model = this.node;
            }.bind(this),
            error: _.bind(this._errorFetchingNode, this, node)
          });
        }
        return;
      }

      // save the container node if we came from the nodes table.
      this.containerNode = this.context.getFactory(NextNodeModelFactory).property;
      if (this.containerNode && this.containerNode.get('id')) {
        this.containerNode = this.containerNode.clone();
      }

      this.applicationScope.set('id', 'properties');

      var perspectivePath = 'json!csui/utils/contexts/perspective/impl/perspectives/',
          perspectiveName;
      if (metadata_info.navigator) {
        perspectiveName = 'metadata.navigation.json';
      } else {
        perspectiveName = 'metadata.json';
      }

      this.context.loadPerspective(perspectivePath + perspectiveName);
    }

  });

  return MetadataPerspectiveContextPlugin;

});

csui.define('csui/utils/contexts/perspective/impl/root.perspective.context.plugin',['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin'
], function (_, Backbone, ApplicationScopeModelFactory,
    PerspectiveContextPlugin) {
  'use strict';

  var supportedPerspectives = {
    myassignments: 'myassignmentstable',
    recentlyaccessed: 'recentlyaccessedtable',
    favorites: 'favorites2.table'
  };

  var RootPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function RootPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory)
          .on('change', this._fetchRootPerspective, this);
    },

    _fetchRootPerspective: function () {
      // Skip scopes handled by other plugins
      var scope = this.applicationScope.id;

      // Two perspective driving models used above can generate two change
      // events quickly after each other; process only the first one
      if (!supportedPerspectives[scope] || this.loadingPerspective){
        return;
      }

      this.context.loadPerspective('json!csui/utils/contexts/perspective/impl/perspectives/' +
        supportedPerspectives[scope] + '.json');
    }

  });

  return RootPerspectiveContextPlugin;

});

csui.define('csui/utils/contexts/perspective/plugins/node/impl/node.extra.data',[], function () {
  'use strict';

  return {
    getModelFields: function (options) {
      return {
        properties: [],
        columns: []
      };
    },

    getModelExpand: function (options) {
      return {
        properties: ['reserved_user_id']
      };
    }
  };

});

csui.define('csui/utils/contexts/factories/global.error',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {
  'use strict';

  var GlobalError = Backbone.Model.extend({
    defaults: {
      message: null,
      details: null
    }
  });

  var GlobalErrorFactory = ModelFactory.extend({
    propertyPrefix: 'globalError',

    constructor: function GlobalErrorModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var globalError = this.options.globalError || {};
      if (!(globalError instanceof Backbone.Model)) {
        var config = module.config();
        globalError = new GlobalError(globalError.attributes, _.extend({},
            globalError.options, config.options));
        // The default global error model should be permanent to
        // survive a perspective switch to the error perspective.
        this.options.permanent = true;
      }
      this.property = globalError;
    }
  });

  return GlobalErrorFactory;
});

csui.define('csui/utils/contexts/perspective/perspective.guide',['csui/lib/underscore'], function (_) {

  function PerspectiveGuide() {
  }

  PerspectiveGuide.prototype = {
    isNew: function (oldPerspective, newPerspective) {
      //In case of widget maximize mode we are setting showWidgetInMaxMode attribute, we need to
      // omit this atrribute for perspective comparison
      var attributeA = sortKeys( _.omit(newPerspective, ['showWidgetInMaxMode', 'id', 'canEditPerspective']) );
      var attributeB = sortKeys( _.omit(oldPerspective, ['showWidgetInMaxMode', 'id', 'canEditPerspective']) );      
      return !_.isEqual(attributeA,attributeB);       
    }   
  };

  function sortKeys(a){
    var keysA = Object.keys(a).sort();        
    return keysA.reduce(function(result, item){
      result[item] = a[item];
      return result;
    }, {});
  }

  return PerspectiveGuide;

});


csui.define('csui/utils/contexts/perspective/perspective.context',[
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/log', 'csui/utils/contexts/context',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/global.error',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/impl/landing.perspective.context.plugin',
  'csui/utils/contexts/perspective/perspective.guide',
  // Load external plugins to drivw perspective switches
  'csui-ext!csui/utils/contexts/perspective/perspective.context'
], function (require, _, $, Backbone, base, log, Context,
    UserModelFactory, GlobalErrorModelFactory, ApplicationScopeModelFactory,
    LandingPerspectiveContextPlugin, PerspectiveGuide, contextPlugins) {
  'use strict';

  var PerspectiveContext = Context.extend({
    constructor: function PerspectiveContext(options) {
      Context.prototype.constructor.apply(this, arguments);

      _.defaults(this.options, {online: true});

      this.perspective = new Backbone.Model();
      this.perspectiveGuide = new PerspectiveGuide();

      // Automatically initialized context models
      this._applicationScope = this.getModel(ApplicationScopeModelFactory, {
        permanent: true,
        detached: true
      });

      if (this.options.online) {
        this._user = this.getModel(UserModelFactory, {
          options: {
            includeResources: ['perspective']
          },
          permanent: true
        });
      }

      // Keep the same order as for perspective routers
      var Plugins = _
          .chain(options && options.plugins || contextPlugins)
          .flatten(true)
          .concat([LandingPerspectiveContextPlugin])
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
      _.invoke(this._plugins, 'onCreate');
    },

    // TODO: Deprecate this function, force empty URL to route
    fetchPerspective: function () {
      var landingPerspectivePlugin = _.find(this._plugins, function (plugin) {
        return plugin instanceof LandingPerspectiveContextPlugin;
      });
      landingPerspectivePlugin._fetchLandingPerspective();
      return this;
    },

    _destroyNonPermanentFactories: function () {
      Context.prototype._destroyNonPermanentFactories.apply(this, arguments);
      _.invoke(this._plugins, 'onClear');
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             // The user model should be fetched only at the beginning
             (factory.property !== this._user || !this._user.get('id')) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    loadPerspective: function (perspectiveModule, forceChange) {
      var deferred = $.Deferred(),
          self     = this;
      log.debug('Using perspective from "{0}".', perspectiveModule) &&
      console.log(log.last);
      this.triggerMethod('request:perspective', this.context);
      this.loadingPerspective = deferred.promise();
      require([perspectiveModule], function (perspective) {
        var wrapperModel = new Backbone.Model({perspective: perspective});
        self.loadingPerspective = false;
        self.applyPerspective(wrapperModel, forceChange);
      }, function (error) {
        self.loadingPerspective = false;
        self.rejectPerspective(error);
      });
    },

    overridePerspective: function (sourceModel, perspectiveModule) {
      var self = this;
      log.debug('Overriding the perspective in {0} with "{1}".',
          log.getObjectName(sourceModel), perspectiveModule) &&
      console.log(log.last);
      return require([perspectiveModule], function (perspective) {
        sourceModel.set('perspective', perspective);
        self.applyPerspective(sourceModel);
      }, _.bind(this.rejectPerspective, this));
    },

    /**
     *
     * @param {Backbone.Model} sourceModel Model changing the perspective.
     * @param {Boolean} forceChange Default to FALSE. Force the persepctive to change, even though current and new perspectives are same
     * @param {JSON} perspective Optional. Perspective to use to render. If not provided, sourceModel.perspective will be used.
     */
    applyPerspective: function (sourceModel, forceChange, perspective) {
      this.triggerMethod('sync:perspective', this, sourceModel);
      this._interceptApplyPerspective(sourceModel, forceChange)
          .done(this._continueApplyingPerspective.bind(this, sourceModel, forceChange, perspective))
          .fail(function (error) {
            if (error) {
              this.rejectPerspective(error);
            }
          }.bind(this));
    },

    _continueApplyingPerspective: function (sourceModel, forceChange, perspective) {
      var newPerspective = perspective || sourceModel.get('perspective') || {};
      if (forceChange || this.perspectiveGuide.isNew(this.perspective.attributes, newPerspective)) {
        var viewStateModel = this.viewStateModel;
        viewStateModel && viewStateModel.set(viewStateModel.CONSTANTS.ALLOW_WIDGET_URL_PARAMS, true);
        this.triggerMethod('before:change:perspective', this, sourceModel);
        log.info('Perspective has changed') && console.log(log.last);
        this.perspective.clear();
        this.perspective.set(newPerspective);
        this.triggerMethod('change:perspective', this.perspective, sourceModel);
        // The context will be fetched by the owner, after it resolves the widgets
        // and renders them to get the context filled by models.
      } else {
        var self = this;
        log.info('Perspective has not changed') && console.log(log.last);
        this._destroyTemporaryFactories();
        _.invoke(this._plugins, 'onRefresh');
        // The current perspective stays, just the widgets may need refresh.
        this.triggerMethod('retain:perspective', this, sourceModel);
        this.fetch();
      }
    },

    rejectPerspective: function (sourceModel, error) {
      var self = this;

      if (!error) {
        error = sourceModel;
      }
      if (!(error instanceof Error)) {
        error = new base.Error(error);
      }
      this.triggerMethod('error:perspective', this, error);

      function informFailure() {
        self._informFailure(error)
            .then(function () {
              self.trigger('reject:perspective');
            });
      }

      if (sourceModel && sourceModel instanceof Backbone.Model) {
        //Set nextNode id to '-1' so a user can re-attempt to open it.
        sourceModel.set('id', -1, {silent: true});

        // trigger event to update breadcrumbs
        self.trigger('current:folder:changed', sourceModel);

        csui.require([
          'json!csui/utils/contexts/perspective/impl/perspectives/error.global.json'
        ], function (perspective) {
          log.debug('Showing error perspective for {0}.',
              log.getObjectName(sourceModel)) &&
          console.log(log.last);

          sourceModel.set('perspective', perspective, {silent: true});
          var globalError = self.getModel(GlobalErrorModelFactory);
          globalError.set({
            message: error.message,
            details: error.errorDetails
          });

          self.applyPerspective(sourceModel);
        }, function () {
          informFailure();
        });
      } else {
        informFailure();
      }
    },

    _interceptApplyPerspective: function (sourceModel, forceChange) {
      // The first plugin, which intercepts the perspective application
      // will abort the currently running one.
      return this._plugins.reduce(function (promise, plugin) {
        return promise.then(function () {
          if (_.isFunction(plugin.onApply)) {
            var result = plugin.onApply(sourceModel, forceChange);
            return result === false ? $.Deferred().reject() : result;
          }
        });
      }, $.Deferred().resolve());
    },

    _informFailure: function (error) {
      var errorHandled = false,
          deferred     = $.Deferred();

      //If offline is supported, then let the plugin handle the network error
      if (error.statusCode === 0) {
        errorHandled = _.find(this._plugins, function (plugin) {
          if (plugin.offlineErrorHandler) {
            return plugin.offlineErrorHandler(error);
          }
        });
      }

      if (!errorHandled) {
        csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.showError(error.toString())
              .always(deferred.resolve);
        });
      }
      return deferred.promise();
    }
  });

  return PerspectiveContext;
});

csui.define('csui/utils/contexts/factories/appcontainer',[
  'csui/utils/contexts/factories/factory',
  'csui/models/mixins/appcontainer/appcontainer.mixin',
  'csui/utils/contexts/factories/ancestors',
  'csui/utils/url', 'csui/lib/jquery', 'csui/lib/underscore'
], function (Factory, AppContainerMixin, NodeAncestorsFactory, Url, $, _) {
  'use strict';

  var AppContainerFactory = Factory.extend({
    propertyPrefix: 'appcontainer',

    constructor: function AppContainerFactory(context, options) {
      Factory.prototype.constructor.call(this, context, options);

      var models = this.options.models;
      this.node = models.container;
      this.addableTypes = models.addableTypes;
      this.children = models.children;
      this.connector = this.node.connector;

      var ancestorFactory = context.getFactory(NodeAncestorsFactory);
      this.ancestors = ancestorFactory.property;
      // TODO: Introduce an interface to control factory options like
      // "detached" after construction. The detached flag is not used
      // by the factory itself; it is checked by the context.
      this.listenTo(context, 'request', function () {
        ancestorFactory.options.detached = true;
      });

      this.property = {};

      this.makeAppContainer(options);
    },

    isFetchable: function () {
      return this.node.isFetchable();
    },

    fetch: function (options) {
      var queryparams = this.children.getResourceFieldsUrlQuery();
      var query = Url.combineQueryString(this.children.getBrowsableUrlQuery(),
        { fields: _.without(queryparams.fields, 'properties')});
      var baseUrl = new Url(this.connector.connection.url).getApiBase(2);
      var appUrl = Url.combine(baseUrl, 'app/container', this.node.get('id'));
      var url = Url.appendQuery(appUrl, query);
      var prefetchedModels = [this.children, this.ancestors, this.addableTypes];
      var self = this;

      // TODO: Extract the AJAX call from here to a AppContainerModel with a custom
      // sync method. This error-prone event triggering could be removed then.
      relayEvent(prefetchedModels, 'request', {}, options);
      return this.connector
        .makeAjaxCall({
          url: url
        })
        .then(function (response, textStatus, request) {
          var results = response.results;
          // Do not trigger the request/sync event pairs once more, because
          // they are triggered outside the batch callback. However, the reset
          // event has to be triggered explicitly about the change of contents.
          var prefetchOptions = {silent: true};

          // Populate the children at first and then the other models.
          // Usually it would be irrelevant, but the nodestable widget
          // is so slow, that the children appeared to render much later,
          // than the rest of the page. Reordering the change events like
          // this is a fragile and dirty hack. It does not help on more
          // complicated perspectives anyway.

          var nodes = results.contents.map(function (props) {
            return self.massageResponse(props);
          });
          var childrenPromise = self.children.prefetch({
            collection: response.collection,
            links: response.links,
            results: nodes
          }, prefetchOptions);

          var ancestorsPromise = self.ancestors.prefetch({
            ancestors: results.ancestors
          }, prefetchOptions);

          var addableTypesPromise;
          var addMenu = results.add_menu;
          if (addMenu) {
            addMenu = results.add_menu.map(adaptAddableType);
            addableTypesPromise = self.addableTypes.prefetch(addMenu, {
              parse: false,
              silent: true
            });
          } else {
            var addableTypes = results.addable_node_types;
            if (addableTypes) {
              addableTypesPromise = self.addableTypes.prefetch(addableTypes, prefetchOptions);
            }
          }

          return $
              .when(ancestorsPromise, addableTypesPromise, childrenPromise)
              .then (function () {
                relayEvent(prefetchedModels, 'reset', response, options);
                relayEvent(prefetchedModels, 'sync', response, options);
                return $.Deferred().resolve(response, textStatus, request);
              });
        }, function (request, textStatus, errorThrown) {
          relayEvent(prefetchedModels, 'error', request, options);
          return $.Deferred().reject(request, textStatus, errorThrown);
        });
    }
  });

  function adaptAddableType (ancestor) {
    ancestor.type_name = ancestor.name;
    delete ancestor.name;
    return ancestor;
  }

  function relayEvent(models, event, object, options) {
    models.forEach(function (model) {
      model.trigger(event, model, object, options);
    });
  }

  AppContainerMixin.mixin(AppContainerFactory.prototype);

  return AppContainerFactory;
});

csui.define('csui/utils/contexts/factories/children',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/nodechildren', 'csui/utils/commands'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeChildrenCollection, allCommands) {
  'use strict';

  var ChildrenCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'children',

    constructor: function ChildrenCollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var children = this.options.children || {},
          commands = children.options && children.options.commands ||
                     allCommands;
      if (!(children instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
          config = module.config();
        children = new NodeChildrenCollection(children.models,
          _.defaults({
              // Prefer refreshing the entire table to rendering one row after another.
              autoreset: true,
              // Minimize the response information; the server adds information with
              // every update and UI would get slower
              fields: {
                properties: []
              },
              // Shortcut information needs to be resolved to support UI and actions.
              expand: {
                properties: ['original_id']
              },
              // Ask the server to check for permitted actions V2
              commands: commands.getAllSignatures()
            },
            config.options,
            children.options,
            // node is intentionally listed at the end to give previous options preference
            {node: node}
          ));
      }
      this.property = children;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return ChildrenCollectionFactory;

});

csui.define('csui/utils/contexts/factories/children2',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node.children2/node.children2', 'csui/utils/commands'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeChildren2Collection, allCommands) {
  'use strict';

  var Children2CollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'children2',

    constructor: function Children2CollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var children = this.options.children2 || {},
          commands = children.options && children.options.commands ||
                     allCommands;
      if (!(children instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
            config = module.config();
        children = new NodeChildren2Collection(children.models,
            _.defaults({
                  // Prefer refreshing the entire table to rendering one row after another.
                  autoreset: true,
                  // Minimize the response information; the server adds information with
                  // every update and UI would get slower
                  fields: {
                    properties: []
                  },
                  // Shortcut information needs to be resolved to support UI and actions.
                  expand: {
                    properties: ['original_id']
                  },
                  // Make sure, that the metadata token is returned for nodes
                  // requesated via this factory, because they are supposed to
                  // be shared and may be the subject of changes.
                  stateEnabled: true,
                  // Ask the server to check for permitted actions V2
                  commands: commands.getAllSignatures()
                },
                config.options,
                children.options,
                {useSpecialPaging: options.useSpecialPaging},
                // node is intentionally listed at the end to give previous options preference
                {node: node}
            ));
      }
      this.property = children;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return Children2CollectionFactory;
});

csui.define('csui/utils/contexts/factories/columns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/children'
], function (module, _, Backbone, CollectionFactory, NodeChildrenFactory) {

  var ColumnCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'columns',

    constructor: function ColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getModel(NodeChildrenFactory, options),
            config = module.config();
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return ColumnCollectionFactory;

});

csui.define('csui/utils/contexts/factories/columns2',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/node', 'csui/models/node.columns2',
  'csui/utils/log'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeColumn2Collection, log) {
  'use strict';

  log = log(module.id);

  var Column2CollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'columns2',

    constructor: function Column2CollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns2 || {};
      if (!(columns instanceof Backbone.Collection)) {
        var node = columns.options && columns.options.node ||
                   context.getModel(NodeModelFactory, options);
        this.property = new NodeColumn2Collection();
        this.node = node;
        node.columns.on('reset', this._resetColumns, this);
        this._resetColumns();
      } else {
        this.property = columns;
      }
    },

    _resetColumns: function () {
      var node          = this.node,
          definitionMap = {},
          definitions   = completeDefinitions(node.definitions, definitionMap);
      node.columns.each(markDisplayableColumn.bind(null, definitionMap));
      if (areDifferent(this.property, definitions)) {
        this.property.reset(definitions);
      } else {
        this.property.trigger('remain', this.property);
      }
    }
  });

  function completeDefinitions(definitions, definitionMap) {
    return definitions.map(function (definition) {
      definition = definition.toJSON();
      var key = definition.key;
      definition.column_key = key;
      switch (key) {
      case 'name':
        definition.default_action = true;
        definition.contextual_menu = false;
        definition.editable = true;
        definition.filter_key = key;
        break;
      case 'type':
        definition.default_action = true;
        break;
      case 'modify_date':
        definition.initialSortingDescending = true;
        break;
      }
      definitionMap[key] = definition;
      if (definition.sort_key) {
        definition.sort = true;
        delete definition.sort_key;
      }
      return definition;
    });
  }

  function markDisplayableColumn(definitionMap, column, index) {
    var columnKey      = column.get('key'),
        formattedIndex = columnKey.lastIndexOf('_formatted'),
        order          = 500 + index,
        definition;
    // Update the real value-carrying column, which does not end with
    // "_formatted", if only the "_formatted" one is present and not
    // the real one. "_formatted"  columns should not be used, because
    // they do not provide the real value for sorting, filtering, saving
    // or other scenarios, where it is needed. Also the right formatting
    // is specified in Smart UI. "_formatted" columns are for AJAX calls
    // from Classic UI, because they for at according to its design.
    if (formattedIndex >= 0) {
      var realColumnKey = columnKey.substr(0, columnKey.length - 10);
      definition = definitionMap[realColumnKey];
      if (definition) {
        definition.definitions_order = order;
        return;
      }
    }
    definition = definitionMap[columnKey];
    if (definition) {
      definition.definitions_order = order;
    } else {
      log.warn('No definition found for the column "{0}".', columnKey);
    }
  }

  var columnProperties = [
    'description', 'key', 'multi_value', 'name', 'type', 'type_name'];

  function areDifferent(collection, objects) {
    return collection.length !== objects.length ||
           collection.some(function (model, index) {
             var expected = _.pick(objects[index], columnProperties),
                 actual = _.pick(model.attributes, columnProperties);
             return !_.isEqual(expected, actual);
           });
  }

  return Column2CollectionFactory;
});

csui.define('csui/utils/contexts/factories/usernodepermission',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/connector', 'csui/models/authenticated.user.node.permission'
], function (module, _, $, Backbone, ModelFactory, UserModelFactory, ConnectorFactory,
    AuthenticatedUserNodePermissionModel) {
  'use strict';

  var UserNodePermissionModelFactory = ModelFactory.extend({
    propertyPrefix: 'userNodePermission',

    constructor: function UserNodePermissionModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var userNodePermission = this.options.userNodePermission || {},
          config = module.config();
      if (!(userNodePermission instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            user      = context.getModel(UserModelFactory);
        userNodePermission = new AuthenticatedUserNodePermissionModel(
            userNodePermission.attributes,
            _.defaults({
                  connector: connector,
                  user: user,
                  node: this.options.node
                }, userNodePermission.options, config.options
            )
        );
      }
      this.property = userNodePermission;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return UserNodePermissionModelFactory;
});

csui.define('csui/utils/contexts/factories/volume',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.model'
], function (module, _, Backbone, ModelFactory, NodeModelFactory, NodeModel) {

  var VolumeModelFactory = ModelFactory.extend({

    propertyPrefix: 'volume',

    constructor: function VolumeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var volume = this.options.volume || {};
      if (!(volume instanceof Backbone.Model)) {
        var node = context.getModel(NodeModelFactory, options),
            config = module.config();

        // Make sure that the volume info is returned with the node info
        node.setExpand('properties', 'volume_id');

        // Create an empty node model to fill with the volume info
        // as soon as it is fetched with the node info
        volume = new NodeModel(
            _.extend({}, node.get('volume_id'), volume.attributes || config.attributes),
            _.extend({
              connector: node.connector
            }, volume.options, config.options));

        this.listenTo(node, 'change:volume_id', function () {
          volume.set(node.get('volume_id'));
        });
      }
      this.property = volume;
    }

  });

  return VolumeModelFactory;

});

csui.define('csui/models/widget/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/models/widget/nls/root/lang',{
  searchResults: "Search Results",

  ra_access_date_last: 'Last Accessed',
  ra_parent_id: 'Location',
  ra_size: 'Size',

  ma_type: "Type",
  ma_name: "Name",
  ma_location_name: "Location",
  ma_date_due: "Due Date",
  ma_priority: "Priority",
  ma_status: "Status",
  ma_from_user_name: "From",

  fav_parent_id: 'Location',
  fav_size: 'Size',

  owner: "Owner",
  created: "Created",
  createdBy: "Created by",
  modified: "Modified",
  size: "Size",
  type: "Type"

});


csui.define('csui/models/widget/favorites.model',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'csui/models/node/node.model', 'i18n!csui/models/widget/nls/lang',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, CommandableV2Mixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, lang) {
  'use strict';

  var FavoriteColumnModel = NodeChildrenColumnModel.extend({

    constructor: function FavoriteColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'fav_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var FavoriteColumnCollection = NodeChildrenColumnCollection.extend({

    model: FavoriteColumnModel,

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'modify_date' ||
            columnKey === 'parent_id' || columnKey == 'size') {
          column.sort = true;
        }
      });
      return columns;
    }

  });

  var FavoriteModel = NodeModel.extend({

    parse: function (response, options) {
      var fav, fav_version;
      if (response.data && response.data.properties) {
        fav = response.data.properties;
        fav_version = response.data.versions;
      } else {
        fav = response;
        fav_version = response.versions;
      }
      fav.short_name = fav.name; // fav.name.length > 20 ? fav.name.substr(0, 20) + '...' : fav.name;
      if (!fav.size) {
        if (fav.container) {
          fav.size = fav.container_size;
        } else if (fav_version) {
          fav.size = fav_version.file_size;
        }
      }
      if (!fav.mime_type && fav_version && fav_version.mime_type) {
        fav.mime_type = fav_version.mime_type;
      }
      return NodeModel.prototype.parse.call(this, response, options);
    }

  });

  var FavoriteCollection = Backbone.Collection.extend({

    model: FavoriteModel,

    constructor: function FavoriteCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);

      this.columns = new FavoriteColumnCollection();
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, this.options);
      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    url: function () {
      var url = this.connector.getConnectionUrl().getApiBase('v2'),
          query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery(),
              this.getBrowsableUrlQuery()
          );
      url = Url.combine(url, '/members/favorites');
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      this.parseBrowsedState(response, options);
      this.columns && this.columns.resetColumnsV2(response, this.options);
      return this.parseBrowsedItems(response, options);
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
    }

  });

  ClientSideBrowsableMixin.mixin(FavoriteCollection.prototype);
  BrowsableV2ResponseMixin.mixin(FavoriteCollection.prototype);
  ConnectableMixin.mixin(FavoriteCollection.prototype);
  FetchableMixin.mixin(FavoriteCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(FavoriteCollection.prototype);
  FieldsV2Mixin.mixin(FavoriteCollection.prototype);
  ExpandableV2Mixin.mixin(FavoriteCollection.prototype);
  CommandableV2Mixin.mixin(FavoriteCollection.prototype);

  return FavoriteCollection;

});

csui.define('csui/utils/contexts/factories/favorites',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/favorites.model', 'csui/utils/commands',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, FavoritesCollection,
    commands) {
  'use strict';

  var FavoriteCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites',

    constructor: function FavoritesCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favorites = this.options.favorites || {};
      if (!(favorites instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        favorites = new FavoritesCollection(favorites.models, _.extend(
            {connector: connector}, favorites.options, config.options,
            FavoritesCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = favorites;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        // The latest version properties can be considered common properties
        // too (the MIME type is there, for example)
        fields: {
          properties: [],
          'versions.element(0)': []
        },
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: ['metadata'],
        // Ask the server to check for permitted actions V2
        commands: commands.getAllSignatures()
      });
    }

  });

  return FavoriteCollectionFactory;

});

csui.define('csui/utils/contexts/factories/favoritescolumns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/favorites'
], function (module, _, Backbone, CollectionFactory, FavoriteCollectionFactory) {

  var FavoritesColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites_columns',

    constructor: function FavoritesColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(FavoriteCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return FavoritesColumnsCollectionFactory;

});

csui.define('csui/utils/contexts/factories/favorites2',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/models/favorites2', 'csui/utils/defaultactionitems',
  'csui/utils/commands', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    Favorites2Collection, defaultActionItems, commands) {
  'use strict';

  var Favorite2CollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites2',

    constructor: function Favorite2CollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favorites = this.options.favorites || {};

      if (!(favorites instanceof Backbone.Collection)) {

        var connector = context.getObject(ConnectorFactory, options);
        var config = module.config();

        favorites = new Favorites2Collection(favorites.models,
            _.extend({
                  connector: connector,
                  autoreset: true
                },
                favorites.options,
                config.options,
                Favorite2CollectionFactory.getDefaultResourceScope()
            )
        );
      }
      this.property = favorites;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: [],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': ['mime_type', 'owner_id']
        },
        expand: {
          properties: ['original_id', 'parent_id', 'reserved_user_id', 'custom_view_search']
        },
        // Make sure, that the metadata token is returned for nodes
        // requesated via this factory, because they are supposed to
        // be shared and may be the subject of changes.
        stateEnabled: true,
        // no need for metadata to include, because column definitions are created fully client side
        includeResources: [],
        // Ask the server to check for permitted actions V2
        commands: commands.getAllSignatures()
      });
    },

    getLimitedResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: ['container', 'id', 'name', 'original_id', 'type', 'type_name', 'parent_id',
            'container', 'custom_view_search', 'version_number'],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': ['mime_type']
        },
        expand: {
          properties: ['original_id']
        },
        // Make sure, that the metadata token is returned for nodes
        // requesated via this factory, because they are supposed to
        // be shared and may be the subject of changes.
        stateEnabled: true,
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: [],
        // Ask the server to check for permitted actions V2 - only default actions
        commands: defaultActionItems.getAllCommandSignatures(commands)
      });
    },

    getDefaultsOnlyResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: [],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': []
        },
        expand: {
          properties: ['original_id', 'parent_id', 'reserved_user_id']
        },
        // Make sure, that the metadata token is returned for nodes
        // requesated via this factory, because they are supposed to
        // be shared and may be the subject of changes.
        stateEnabled: true,
        // no need for metadata to include, because column definitions are created fully client side
        includeResources: [],
        // Ask the server to check for permitted actions V2
        commands: defaultActionItems.getAllCommandSignatures(commands)
      });
    }

  });

  return Favorite2CollectionFactory;
});

csui.define('csui/utils/contexts/factories/favorite2groups',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/favorites2',
  'csui/models/favorite2groups', 'csui/utils/commands',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    Favorite2CollectionFactory, Favorite2GroupsCollection, commands) {
  'use strict';

  var Favorite2GroupsCollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'favorites2groups',

    constructor: function Favorite2GroupsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favoriteGroups = this.options.favoriteGroups || {};

      if (!(favoriteGroups instanceof Backbone.Collection)) {

        var config = module.config();
        var connector = context.getObject(ConnectorFactory, options);
        var favorites = context.getCollection(Favorite2CollectionFactory, options);

        favoriteGroups = new Favorite2GroupsCollection(favoriteGroups.models,
            _.extend({
                  favorites: favorites,
                  connector: connector,
                  autoreset: true,
                  commands: commands.getAllSignatures()
                },
                favoriteGroups.options,
                config.options,
                Favorite2GroupsCollectionFactory.getDefaultResourceScope()
            )
        );
      }
      this.property = favoriteGroups;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  }, {
    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: []
        }
      });
    }
  });

  return Favorite2GroupsCollectionFactory;
});

csui.define('csui/utils/contexts/factories/favorite2columns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/favorites2'
], function (module, _, Backbone, CollectionFactory, Favorite2CollectionFactory) {

  var Favorite2ColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites2_columns',

    constructor: function Favorite2ColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(Favorite2CollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return Favorite2ColumnsCollectionFactory;
});

csui.define('csui/models/widget/myassignments.model',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/state.requestor/state.requestor.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'csui/models/node/node.model', 'i18n!csui/models/widget/nls/lang',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, StateRequestorMixin,
    CommandableV2Mixin, ClientSideBrowsableMixin, BrowsableV2ResponseMixin,
    NodeChildrenColumnModel, NodeChildrenColumnCollection, NodeModel, lang) {
  'use strict';

  var MyAssignmentColumnModel = NodeChildrenColumnModel.extend({

    constructor: function MyAssignmentColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'ma_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var MyAssignmentColumnCollection = NodeChildrenColumnCollection.extend({

    model: MyAssignmentColumnModel,

    constructor: function MyAssignmentColumnCollection(models, options) {
      if (!models) {
        models = [
          {
            key: 'type',
            type: 2,
            sort: true,
            default_action: true,
            name: 'Type'
          },
          {
            key: 'name',
            type: -1,
            sort: true,
            default_action: true,
            contextual_menu: false,
            editable: true,
            filter_key: 'name',
            name: 'Name'
          },
          {
            key: 'location_id',
            type: 2,
            sort: true,
            name: 'Location'
          },
          {
            key: 'date_due',
            type: -7,
            sort: true,
            name: 'Due Date'
          },
          {
            key: 'priority',
            type: 2,
            sort: true,
            name: 'Priority'
          },
          {
            key: 'status',
            type: 2,
            sort: true,
            initialSortingDescending: true,
            name: 'Status'
          },
          {
            key: 'from_user_name',
            type: -1,
            sort: true,
            name: 'From'
          }
        ];

        models.forEach(function (column, index) {
          column.definitions_order = index + 100;
          column.column_key = column.key;
        });
      }
      NodeChildrenColumnCollection.prototype.constructor.call(this, models, options);
    },

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'location_id' ||
            columnKey === 'date_due' || columnKey === 'priority' || columnKey === 'status' ||
            columnKey === 'from_user_name') {
          column.sort = true;
          if (columnKey === 'location_id') {
            column.sort_key = 'location_name';
          }
        }
      });
      return columns;
    },

    // private: convert v2 'metadata' to v1 'definitions' for backward code compatibility and
    //          reuse purpose
    getV2Columns: function (response) {

      // Note: from a long discussion with the server developer, use the common 'metadata' (or
      // called 'definitions' in v1) in the first element. Elements in the collection can have
      // different extended metadata (definitions).  If a business case arises that
      // extended definitions are needed, will discuss again with them and add that support.

      var definitions = (response.results && response.results[0] &&
                         response.results[0].metadata &&
                         response.results[0].metadata.assignments) || {};

      // TODO: the server is currently missing the metadata output for expanded fields.
      // Remove this temporary hard-coded code after the server properly outputs metadata.
      // Watch for LPAD-43411.
      if (!definitions.location_id_expand && definitions.name) {
        definitions.location_id_expand = _.clone(definitions.name);
        definitions.location_id_expand.key = 'location_id_expand';
        definitions.location_id_expand.name = 'Location';
      }
      if (!definitions.from_user_id_expand && definitions.name) {
        definitions.from_user_id_expand = _.clone(definitions.name);
        definitions.from_user_id_expand.key = 'from_user_id_expand';
        definitions.from_user_id_expand.name = 'From';
      }

      // client-side sub-field column
      if (!definitions.location_name && definitions.name) {
        definitions.location_name = _.clone(definitions.name);
        definitions.location_name.key = 'location_name';
        definitions.location_name.name = 'Location Name';
      }
      if (!definitions.from_user_name && definitions.name) {
        definitions.from_user_name = _.clone(definitions.name);
        definitions.from_user_name.key = 'from_user_name';
        definitions.from_user_name.name = 'From';
      }

      var columnKeys = _.keys(definitions);

      return this.getColumnModels(columnKeys, definitions);
    }

  });

  var MyAssignmentModel = NodeModel.extend({

    parse: function (response, options) {
      var assignments = response.data.assignments;
      assignments.short_name = assignments.name;

      var from_user_id_expand = assignments.from_user_id_expand || {};
      var name = from_user_id_expand.first_name || '';
      name = name + ' ' + (from_user_id_expand.last_name || '');
      if (!name.length || (name.length === 1 && name === ' ')) {
        name = from_user_id_expand.name;
      }
      assignments.from_user_name = name;

      if (response.data && response.data.assignments) {
        response.data.properties = response.data.assignments;
      }

      var node = NodeModel.prototype.parse.call(this, response, options);
      return node;
    }

  });

  var MyAssignmentCollection = Backbone.Collection.extend({

    model: MyAssignmentModel,

    constructor: function MyAssignmentCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeStateRequestor(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);

      this.columns = new MyAssignmentColumnCollection();
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, this.options);
      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    url: function () {
      var url   = this.connector.getConnectionUrl().getApiBase('v2'),
          query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getStateEnablingUrlQuery(),
              this.getRequestedCommandsUrlQuery()
          );
      url = Url.combine(url, '/members/assignments');
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      // filter out pstage items
      response.results = _.filter(response.results, function (item) {
        return item.data.assignments.type != 398; //pstage
      });

      this.parseBrowsedState(response, options);
      // don't parse columns here, because they are hardcoded in the constructor
      return this.parseBrowsedItems(response, options);
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
    }

  });

  ClientSideBrowsableMixin.mixin(MyAssignmentCollection.prototype);
  // when due_date is null, put the record at the bottom for ascending sort as PM and CWS request
  var originalCompareValues = MyAssignmentCollection.prototype._compareValues;
  MyAssignmentCollection.prototype._compareValues = function (property, left, right) {
    if (property.indexOf('date') >= 0) {
      if (left === null) {
        return 1;
      }
      if (right === null) {
        return -1;
      }
    }
    return originalCompareValues.apply(this, arguments);
  };

  BrowsableV2ResponseMixin.mixin(MyAssignmentCollection.prototype);
  ConnectableMixin.mixin(MyAssignmentCollection.prototype);
  FetchableMixin.mixin(MyAssignmentCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(MyAssignmentCollection.prototype);
  FieldsV2Mixin.mixin(MyAssignmentCollection.prototype);
  ExpandableV2Mixin.mixin(MyAssignmentCollection.prototype);
  StateRequestorMixin.mixin(MyAssignmentCollection.prototype);
  CommandableV2Mixin.mixin(MyAssignmentCollection.prototype);

  return MyAssignmentCollection;

});

csui.define('csui/utils/contexts/factories/myassignments',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/myassignments.model',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, MyAssignmentCollection) {
  'use strict';

  var MyAssignmentCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'myassignments',

    constructor: function MyAssignmentCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var myassignments = this.options.myassignments || {};
      if (!(myassignments instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        myassignments = new MyAssignmentCollection(myassignments.models, _.extend(
            {connector: connector}, myassignments.options, config.options,
            MyAssignmentCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = myassignments;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    },

    isFetchable: function(){
      if (window.csui && window.csui.mobile) {
        return !this.property.fetched;
      }
      return true;
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        // So far, all properties are includes in the assignments fields
        fields: {
          assignments: []
        },
        // Make sure, that the metadata token is returned for nodes
        // requesated via this factory, because they are supposed to
        // be shared and may be the subject of changes.
        stateEnabled: true,
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: ['metadata']
      });
    }

  });

  return MyAssignmentCollectionFactory;

});

csui.define('csui/utils/contexts/factories/myassignmentscolumns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/myassignments'
], function (module, _, Backbone, CollectionFactory, MyAssignmentsCollectionFactory) {

  var MyAssignmentsColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'myassignments_columns',

    constructor: function MyAssignmentsColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(MyAssignmentsCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return MyAssignmentsColumnsCollectionFactory;

});

csui.define('csui/models/widget/recentlyaccessed/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var url   = this.connector.getConnectionUrl().getApiBase('v2'),
              query = Url.combineQueryString(
                  this.getAdditionalResourcesUrlQuery(),
                  this.getResourceFieldsUrlQuery(),
                  this.getExpandableResourcesUrlQuery(),
                  this.getStateEnablingUrlQuery(),
                  this.getRequestedCommandsUrlQuery(),
                  this._getSubtypesUrlQuery()
              );
          url = Url.combine(url, '/members/accessed');
          return query ? url + '?' + query : url;
        },

        parse: function (response, options) {
          this.parseBrowsedState(response, options);
          // don't parse columns here, because they are hardcoded in the constructor of RecentlyAccessedColumnCollection
          return this.parseBrowsedItems(response, options);
        },

        _getSubtypesUrlQuery: function () {
          var where_types = "";

          if (this.options.recentlyAccessedSubtypes) {
            for (var i = 0; i < this.options.recentlyAccessedSubtypes.length; i++) {
              where_types = where_types.concat("where_type=",
                  this.options.recentlyAccessedSubtypes[i],
                  "&");
            }
          }
          return where_types;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/recentlyaccessed.model',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/mixins/state.requestor/state.requestor.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'csui/models/node/node.model', 'i18n!csui/models/widget/nls/lang',
  'csui/models/widget/recentlyaccessed/server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, StateRequestorMixin,
    CommandableV2Mixin, DelayedCommandableV2Mixin, ClientSideBrowsableMixin,
    BrowsableV2ResponseMixin, NodeChildrenColumnModel, NodeChildrenColumnCollection,
    NodeModel, lang, ServerAdaptorMixin) {
  'use strict';

  var RecentlyAccessedColumnModel = NodeChildrenColumnModel.extend({

    constructor: function RecentlyAccessedColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'ra_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var RecentlyAccessedColumnCollection = NodeChildrenColumnCollection.extend({

    model: RecentlyAccessedColumnModel,

    constructor: function RecentlyAccessedColumnCollection(models, options) {
      if (!models) {
        models = [
          {
            key: 'type',
            type: 2,
            sort: true,
            default_action: true,
            name: 'Type'
          },
          {
            key: 'name',
            type: -1,
            sort: true,
            default_action: true,
            contextual_menu: false,
            editable: true,
            filter_key: 'name',
            name: 'Name'
          },
          {
            key: 'reserved',
            type: 5,
            name: 'Reserved'
          },
          {
            key: 'parent_id',
            type: 15,
            sort: true,
            name: 'Parent ID'
          },
          {
            key: 'access_date_last',
            type: -7,
            sort: true,
            name: 'Last Accessed'
          },
          {
            key: 'size',
            type: 2,
            sort: true,
            name: 'Size'
          },
          {
            key: 'modify_date',
            type: -7,
            sort: true,
            initialSortingDescending: true,
            name: 'Modified'
          },
          {
            key: 'favorite',
            type: 5,
            name: 'Favorite'
          }
        ];

        models.forEach(function (column, index) {
          column.definitions_order = index + 100;
          column.column_key = column.key;
        });
      }
      NodeChildrenColumnCollection.prototype.constructor.call(this, models, options);
    },

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'access_date_last' ||
            columnKey === 'modify_date' || columnKey === 'parent_id' || columnKey === 'size') {
          column.sort = true;
          if (columnKey === 'parent_id') {
            column.sort_key = 'parent_name';
          }
        }
      });
      return columns;
    },

    // private
    getV2Columns: function (response) {
      var definitions = (response.results &&
                         response.results[0] &&
                         response.results[0].metadata &&
                         response.results[0].metadata.properties) || {};

      // TODO: sadly the server is again missing the metadata output for access_date_last field.
      // Remove this temporary hard-coded code after the server properly outputs this metadata.
      if (!definitions.access_date_last && definitions.modify_date) {
        definitions.access_date_last = _.clone(definitions.modify_date);
        definitions.access_date_last.key = 'access_date_last';
        definitions.access_date_last.name = 'Last Accessed';
      }

      // client-side sub-field column
      if (!definitions.parent_name && definitions.name) {
        definitions.parent_name = _.clone(definitions.name);
        definitions.parent_name.key = 'parent_name';
        definitions.parent_name.name = 'Location Name';  // no i18n needed, server has it in EN
      }

      return NodeChildrenColumnCollection.prototype.getV2Columns.call(this, response);
    }

  });

  var RecentlyAccessedModel = NodeModel.extend({

    parse: function (response, options) {
      var ra, ra_version, ra_propertiesUser, ra_parentIdExpanded;
      if (response.data && response.data.properties) {
        ra = response.data.properties;
        ra_version = response.data.versions;
        ra_propertiesUser = response.data.properties_user;
        ra_parentIdExpanded = response.data.properties.parent_id_expand;
      } else {
        ra = response;
        ra_version = response.versions;
        ra_propertiesUser = response.properties_user;
        ra_parentIdExpanded = response.parent_id_expanded;
      }

      ra.short_name = ra.name; //ra.name.length > 20 ? ra.name.substr(0, 20) + '...' : ra.name;

      if (!ra.size) {
        if (ra.container) {
          ra.size = ra.container_size;
        } else if (ra_version) {
          ra.size = ra_version.file_size;
        }
      }

      if (!ra.mime_type && ra_version && ra_version.mime_type) {
        ra.mime_type = ra_version.mime_type;
      }

      if (!ra.access_date_last && ra_propertiesUser && ra_propertiesUser.access_date_last) {
        ra.access_date_last = ra_propertiesUser.access_date_last;
      }

      ra.parent_name = '';
      if (!ra.parent_name && ra_parentIdExpanded && ra_parentIdExpanded.name) {
        ra.parent_name = ra_parentIdExpanded.name;
      }

      return NodeModel.prototype.parse.call(this, response, options);
    }

  });

  var RecentlyAccessedCollection = Backbone.Collection.extend({

    model: RecentlyAccessedModel,

    constructor: function RecentlyAccessedCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands', 'recentlyAccessedSubtypes']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeStateRequestor(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options)
          .makeDelayedCommandableV2(options)
          .makeServerAdaptor(options);

      this.columns = new RecentlyAccessedColumnCollection();
    },

    _prepareModel: function (attrs, options) {
      options || (options = {});
      options.promotedActionCommands = this.promotedActionCommands;
      options.nonPromotedActionCommands = this.nonPromotedActionCommands;
      return Backbone.Collection.prototype._prepareModel.call(this, attrs, options);
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, this.options);
      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount;
      clone.skipCount = this.skipCount;
      clone.topCount = this.topCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      clone.filters = _.deepClone(this.filters);
      clone.orderBy = this.orderBy;
      clone.expand = _.clone(this.expand);
      clone.includeActions = this.includeActions;
      clone.includeCommands = _.clone(this.includeCommands);
      clone.defaultActionCommands = _.clone(this.defaultActionCommands);
      clone.commands = _.clone(this.commands);
      //clone.delayRestCommands = this.delayRestCommands; //cloning of this attribute doesnot
      // required since to enable delayedRestCommands on new cloned collection

      return clone;
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    },

  });

  ClientSideBrowsableMixin.mixin(RecentlyAccessedCollection.prototype);
  BrowsableV2ResponseMixin.mixin(RecentlyAccessedCollection.prototype);
  ConnectableMixin.mixin(RecentlyAccessedCollection.prototype);
  FetchableMixin.mixin(RecentlyAccessedCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  FieldsV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  ExpandableV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  StateRequestorMixin.mixin(RecentlyAccessedCollection.prototype);
  CommandableV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  DelayedCommandableV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  ServerAdaptorMixin.mixin(RecentlyAccessedCollection.prototype);

  return RecentlyAccessedCollection;

});

csui.define('csui/utils/contexts/factories/recentlyaccessed',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/recentlyaccessed.model', 'csui/utils/commands',
  'csui/utils/defaultactionitems',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    RecentlyAccessedCollection, commands, defaultActionItems) {
  'use strict';

  var RecentlyAccessedCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'recentlyaccessed',

    constructor: function RecentlyAccessedCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var recentlyAccessed = this.options.recentlyaccessed || {};
      if (!(recentlyAccessed instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        recentlyAccessed = new RecentlyAccessedCollection(recentlyAccessed.models, _.extend(
            {connector: connector, recentlyAccessedSubtypes: config.recentlyAccessedSubtypes},
            recentlyAccessed.options, config.options,
            RecentlyAccessedCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = recentlyAccessed;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        // The latest version properties can be considered common properties
        // too (the MIME type is there, for example)
        fields: {
          properties: [],
          'versions.element(0)': []
        },
        // Make sure, that the metadata token is returned for nodes
        // requesated via this factory, because they are supposed to
        // be shared and may be the subject of changes.
        stateEnabled: true,
        // Get property definitions to support table columns
        includeResources: ['metadata'],
        // Ask the server to check for permitted actions
        commands: commands.getAllSignatures()
      });
    },

    getLimitedResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: ['container', 'id', 'name', 'original_id', 'type', 'type_name', 'parent_id',
            'reserved', 'custom_view_search', 'version_number'],
          'versions.element(0)': ['mime_type']
        },
        expand: {
          properties: ['parent_id', 'reserved_user_id']
        },
        // Make sure, that the metadata token is returned for nodes
        // requesated via this factory, because they are supposed to
        // be shared and may be the subject of changes.
        stateEnabled: true,
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: [],
        // Ask the server to check for permitted actions V2 - only default actions
        commands: defaultActionItems.getAllCommandSignatures(commands)
      });
    }

  });

  return RecentlyAccessedCollectionFactory;

});

csui.define('csui/utils/contexts/factories/recentlyaccessedcolumns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/recentlyaccessed'
], function (module, _, Backbone, CollectionFactory, RecentlyAccessedCollectionFactory) {

  var RecentlyAccessedColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'recentlyaccessed_columns',

    constructor: function RecentlyAccessedColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(RecentlyAccessedCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return RecentlyAccessedColumnsCollectionFactory;

});

csui.define('csui/utils/contexts/factories/member',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/member'
], function (module, _, Backbone, ModelFactory, ConnectorFactory, MemberModel) {
  'use strict';

  var MemberModelFactory = ModelFactory.extend({

    propertyPrefix: 'member',

    constructor: function MemberModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var member = this.options.member || {};
      if (!(member instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        member = new MemberModel(member.attributes || config.attributes, _.defaults({
          connector: connector
        }, member.options, config.options));
      }
      this.property = member;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return MemberModelFactory;

});

csui.define('csui/models/widget/search.results/search.metadata/search.metadata.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (_, $, Backbone) {
  'use strict';

  var SearchMetadataMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeSearchMetadataResponse: function (options) {
          return this;
        },

        parseSearchMetadataResponse: function (resp, options) {
          return resp;
        }
      });
    }
  };

  return SearchMetadataMixin;
});

csui.define('csui/models/widget/search.results/search.metadata/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (_, $, Backbone) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        sync: function (method, model, options) {
          var deferred = $.Deferred();
          options = _.defaults({parse: true}, options);
          this.trigger('request', this, {}, options);
          setTimeout(function () {
            options.success.call(options.context, {}, 'success', {});
            deferred.resolve();
          }.bind(this));
          return deferred.promise();
        },

        parse: function (response, options) {
          return this.parseSearchMetadataResponse(response, options);
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/search.results/search.metadata/search.metadata.model',['csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone",
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/widget/search.results/search.metadata/search.metadata.mixin',
  'csui/models/widget/search.results/search.metadata/server.adaptor.mixin'
], function ($, _, Backbone, ConnectableMixin, FetchableMixin, SearchMetadataMixin,
    ServerAdaptorMixin) {
  "use strict";

  var SearchMetadataItemModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var SearchMetadataItemsCollection = Backbone.Collection.extend({

    model: SearchMetadataItemModel,
    comparator: "sequence",

    constructor: function SearchMetadataItemsCollection(attributes, options) {
      SearchMetadataItemsCollection.__super__.constructor.apply(this, arguments);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeSearchMetadataResponse(options)
          .makeServerAdaptor(options);
    },

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new SearchMetadataItemsCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }
  });

  ConnectableMixin.mixin(SearchMetadataItemsCollection.prototype);
  FetchableMixin.mixin(SearchMetadataItemsCollection.prototype);
  SearchMetadataMixin.mixin(SearchMetadataItemsCollection.prototype);
  ServerAdaptorMixin.mixin(SearchMetadataItemsCollection.prototype);

  return SearchMetadataItemsCollection;
});
csui.define('csui/utils/contexts/factories/search.metadata.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/models/widget/search.results/search.metadata/search.metadata.model'
], function (module, _, Backbone, CollectionFactory, SearchMetadataModel) {

  var SearchMetadataModelFactory = CollectionFactory.extend({

    propertyPrefix: 'searchMetadata',

    constructor: function SearchMetadataModelFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var metadata = this.options.metadata || {};
      if (!(metadata instanceof Backbone.Collection)) {
        var config = module.config();
        metadata = new SearchMetadataModel(metadata.models, _.extend({},
            metadata.options, config.options));
      }
      this.property = metadata;
    },
    isFetchable: function () {
      return !!this.options;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return SearchMetadataModelFactory;
});
csui.define('csui/utils/contexts/factories/task.queue.factory',[
  "module",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/utils/contexts/factories/factory",
  "csui/utils/taskqueue"
], function(module, _, Backbone, ModelFactory, TaskQueue) {
  var TaskQueueFactory = ModelFactory.extend({
    propertyPrefix: "taskQueue",

    constructor: function TaskQueueFactory(options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var taskQueue = this.options.taskQueue || {};
      if (!(taskQueue instanceof TaskQueue)) {
        var config = module.config();
        taskQueue = new TaskQueue(
          _.extend({}, taskQueue.options, config.options)
        );
      }
      this.property = taskQueue;
    }
  });
  return TaskQueueFactory;
});


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/document.overview.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "type": "csui/widgets/document.overview"
    }
  }
}
);


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/favorites2.table.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "type": "csui/widgets/favorites2.table"
    }
  }
});


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/container.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "type": "csui/widgets/nodestable"
    }
  }
}
);


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/metadata.json',{
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
              "type": "csui/widgets/metadata",
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


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/metadata.navigation.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "type": "csui/widgets/metadata.navigation"
    }
  }
}
);


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/myassignmentstable.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "type": "csui/widgets/myassignmentstable"
    }
  }
});


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/recentlyaccessedtable.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "type": "csui/widgets/recentlyaccessedtable"
    }
  }
});


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/search.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "type": "csui/widgets/search.results",
      "className": "search-results-container"
    }
  }
}
);


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/saved.query.json',{
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
              "xs": "half"
            },
            "widget": {
              "type": "csui/widgets/placeholder",
              "options": {
                "label": "Saved Query",
                "color": "#fff",
                "bgcolor": "#cccc88"
              }
            }
          },
          {
            "sizes": {
              "md": 12
            },
            "heights": {
              "xs": "full"
            },
            "widget": {
              "type": "csui/widgets/search.results",
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

csui.define('csui/models/widget/search.box/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url'
], function (_, $, Url) {
  'use strict';

  var ServerAdaptorMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.connector.connection.url, "searchbar?enterprise_slices=true");
        },

        parse: function (response, options) {
          var sliceLabels = response.options.fields.slice.optionLabels,
            sliceIds = response.schema.properties.slice.enum,
            returnData = {};
          returnData.slices = [];
          $.each(sliceIds, function (sliceIdx) {
            returnData.slices.push({
              sliceId: sliceIds[sliceIdx],
              sliceDisplayName: sliceLabels[sliceIdx]
            });
          });
          return returnData;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/search.box.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/widget/search.box/server.adaptor.mixin'
], function (_, $, Backbone, Url, ConnectableMixin, FetchableMixin, ServerAdaptorMixin) {
  "use strict";

  var SearchBoxModel = Backbone.Model.extend({

    constructor: function SearchBoxModel(models, options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, models, options);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeServerAdaptor(options);
    }
  });

  ConnectableMixin.mixin(SearchBoxModel.prototype);
  FetchableMixin.mixin(SearchBoxModel.prototype);
  ServerAdaptorMixin.mixin(SearchBoxModel.prototype);

  _.extend(SearchBoxModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    }

  });

  return SearchBoxModel;

});
csui.define('csui/utils/contexts/factories/search.box.factory',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.box.model'
], function (module, _, $, Backbone, CollectionFactory, ConnectorFactory,
    SearchBoxModel) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var SearchBoxFactory = CollectionFactory.extend({
    propertyPrefix: 'searchBox',

    constructor: function SearchBoxFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchBox = this.options.searchBox || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = searchBox.initialResponse || config.initialResponse;
      }
      if (!(searchBox instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options);
        searchBox = new SearchBoxModel(searchBox.attributes || config.attributes,
          _.defaults({
            connector: connector
          }, searchBox.options, config.options, {
            autofetch: true
          }));
      }
      this.property = searchBox;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return SearchBoxFactory;
});

csui.define('csui/temporary/activeviews/icons/icons',[],function () {
  'use strict';

  return [
    {
      // ActiveView
      equals: {type: 30309},
      className: 'csui-icon mime_active_view',
      // ActiveView has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence: 30
    },
    {
      // web report
      equals:    {type: 30303},
      className: 'csui-icon mime_web_report',
      // Web Report has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence:  30
    }
  ];

});

csui.define('csui/temporary/appearances/icons/icons',[],function () {
  'use strict';

  return [
    {
      // Appearance
      equals: {type: 480},
      className: 'csui-icon mime_appearance',
      // Appearance has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence: 30
    }
  ];

});


csui.define('css!csui/temporary/cop/icons/icons',[],function(){});
csui.define('csui/temporary/cop/icons/icons',['css!csui/temporary/cop/icons/icons'
], function () {
  'use strict';

  return [
    // Blog, FAQ, Forum, Wiki and their entries have a MIME type,
    // which would decide the icon otherwise; the MIME type icons
    // have the sequence number 50 in common
    {
      // blog
      equals:    {type: 356},
      className: 'csui-icon csui-temporary-cop-blog',
      sequence:  30
    },
    {
      // blog entry
      equals:    {type: 357},
      className: 'csui-icon mime_blog_entry',
      sequence:  30
    },
    {
      // collaborative place
      equals:    {type: 1257},
      className: 'csui-icon mime_collaborative_place',
      sequence:  30
    },
    {
      // faq
      equals:    {type: 123475},
      className: 'csui-icon mime_faq',
      sequence:  30
    },
    {
      // faq entry
      equals:    {type: 123476},
      className: 'csui-icon mime_faq_entry',
      sequence:  30
    },
    {
      // forum
      equals:    {type: 123469},
      className: 'csui-icon mime_forum',
      sequence:  30
    },
    {
      // forum topics and replies
      equals:    {type: 123470},
      className: 'csui-icon mime_forum_topics_replies',
      sequence:  30
    },
    {
      // topic
      equals:    {type: 130},
      className: 'csui-icon mime_topic',
      sequence:  30
    },
    {
      // wiki
      equals:    {type: 5573},
      className: 'csui-icon mime_wiki',
      sequence:  30
    },
    {
      // wiki page
      equals:    {type: 5574},
      className: 'csui-icon mime_wiki_page',
      sequence:  30
    },
    {
      // community
      equals:    {type: 3030202},
      className: 'csui-icon mime_community',
      sequence:  30
    }
  ];

});

csui.define('bundles/csui-data',[
  // Behaviours
  'csui/behaviors/default.action/default.action.behavior',
  // The controller using the commands is loaded dynamically
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/behaviors/keyboard.navigation/retainfocus.behavior',
  'csui/behaviors/keyboard.navigation/tabkey.behavior',
  'csui/behaviors/widget.container/widget.container.behavior',

  // Controls
  'csui/controls/error/error.view',
  'csui/controls/globalmessage/globalmessage',
  'css!csui/controls/globalmessage/globalmessage_icons',
  'csui/controls/grid/grid.view',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'csui/controls/globalmessage/impl/progresspanel/progresspanel.view',
  'i18n!csui/controls/globalmessage/impl/nls/globalmessage.lang',
  'csui/controls/perspective.panel/perspective.animator',
  'csui/controls/perspective.panel/perspective.panel.view',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'csui/controls/form/pub.sub',
  'csui/controls/mixins/keyboard.navigation/modal.keyboard.navigation.mixin',
  'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/controls/tab.panel/impl/tab.link.ext.view',
  'csui/controls/tab.panel/impl/tab.contents.view',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin',
  'csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',
  'csui/controls/tab.panel/behaviors/tab.contents.proxy.keyboard.behavior',
  'csui/controls/tab.panel/behaviors/tab.links.dropdown.keyboard.behavior',
  'csui/controls/tab.panel/behaviors/tab.links.keyboard.behavior',
  'csui/controls/tab.panel/behaviors/tab.panel.keyboard.behavior',
  // Used in tab.link.dropdown.view from csui-forms
  'csui/controls/tab.panel/impl/tab.link.view',
  // Used in tab.links.ext.view from csui-forms
  'csui/controls/tab.panel/impl/tab.links.view',
  //Shared for metadataproperties from cs-metadata
  'i18n!csui/controls/tab.panel/impl/nls/lang',

  // Control mixins
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/mixins/global.alert/global.alert.mixin',
  'csui/controls/mixins/view.state/metadata.view.state.mixin',
  'csui/controls/mixins/view.state/node.view.state.mixin',

  // Control behaviours
  'csui/controls/tile/behaviors/blocking.behavior',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/controls/tile/behaviors/parent.scrollbar.updating.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/tile/behaviors/searching.behavior',

  // Dialogs
  'csui/dialogs/modal.alert/modal.alert',

  // Perspectives
  'csui/perspectives/flow/flow.perspective.view',
  'csui/perspectives/grid/grid.perspective.view',
  'csui/perspectives/left-center-right/left-center-right.perspective.view',
  'csui/perspectives/single/single.perspective.view',
  'csui/perspectives/tabbed/tabbed.perspective.view',
  'csui/perspectives/tabbed-flow/tabbed-flow.perspective.view',
  'csui/perspectives/zone/zone.perspective.view',
  'csui/perspectives/mixins/perspective.edit.mixin',

  // Routers
  'csui/pages/start/perspective.router',
  'csui/pages/start/perspective.routing',
  'csui/pages/start/impl/landing.perspective.router',
  'csui/pages/start/impl/node.perspective.router',
  'csui/pages/start/impl/search.perspective.router',
  'csui/pages/start/impl/metadata.perspective.router',
  'csui/pages/start/impl/root.perspective.router',
  'i18n!csui/pages/start/impl/nls/lang',

  // Utilities
  'csui/utils/classic.nodes/impl/core.classic.nodes',
  'csui/utils/content.helper',
  'csui/utils/handlebars/l10n',
  'csui/utils/impl/core.defaultactionitems',
  'csui/utils/non-attaching.region/non-attaching.region',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/script-executing.region/script-executing.region',
  'csui/utils/node.links/impl/core.node.links',
  'csui/utils/open.authenticated.page',
  'csui/utils/smart.nodes/impl/core.smart.nodes',
  'csui/utils/taskqueue',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',

  // Contexts and factories
  'csui/models/node/node.addable.type.factory',
  'csui/controls/perspective.panel/perspective.factory',
  'csui/utils/contexts/context',
  'csui/utils/contexts/context.plugin',
  'csui/utils/contexts/browsing/browsing.context',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/portal/portal.context',
  'csui/utils/contexts/perspective/impl/landing.perspective.context.plugin',
  'csui/utils/contexts/perspective/plugins/node/node.perspective.context.plugin',
  'csui/utils/contexts/perspective/impl/search.perspective.context.plugin',
  'csui/utils/contexts/perspective/impl/metadata.perspective.context.plugin',
  'csui/utils/contexts/perspective/impl/root.perspective.context.plugin',
  'csui/utils/contexts/perspective/plugins/node/node.extra.data',
  'csui/utils/contexts/perspective/plugins/node/impl/node.extra.data',
  'csui/utils/contexts/perspective/landing.perspectives',
  'csui/utils/contexts/perspective/node.perspectives',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/perspective/perspective.guide',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/search.perspectives',
  'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/appcontainer',
  'csui/utils/contexts/factories/children',
  'csui/utils/contexts/factories/children2',
  'csui/utils/contexts/factories/columns',
  'csui/utils/contexts/factories/columns2',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/global.error',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/usernodepermission',
  'csui/utils/contexts/factories/volume',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/favoritescolumns',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/utils/contexts/factories/favorites',
  'csui/utils/contexts/factories/favorites2',
  'csui/utils/contexts/factories/favorite2columns',
  'csui/utils/contexts/factories/myassignmentscolumns',
  'csui/utils/contexts/factories/myassignments',
  'csui/utils/contexts/factories/recentlyaccessedcolumns',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/utils/contexts/factories/member',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.metadata.factory',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/utils/contexts/factories/task.queue.factory',

  // helper code to make the routing code testable
  'csui/pages/start/impl/location',

  // Client-side perspectives
  'json!csui/utils/contexts/perspective/impl/perspectives/document.overview.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/favorites2.table.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/container.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/metadata.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/metadata.navigation.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/myassignmentstable.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/recentlyaccessedtable.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/search.json',
  'json!csui/utils/contexts/perspective/impl/perspectives/saved.query.json',

  // Application widgets
  'csui/widgets/error/error.view',

  // Application widgets manifests

  // TODO: Remove the need for this impl by implementing search results
  // for a saved template by a contextual node perspective
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.box.factory',

  // TODO: Remove this, as long as the module owners take over
  // the icons
  'csui/temporary/activeviews/icons/icons',
  'csui/temporary/appearances/icons/icons',
  'csui/temporary/cop/icons/icons',

  // TODO: Remove this module from public area. Localization has to
  // be private  for its module.
  'i18n!csui/models/widget/nls/lang'
], {});

csui.require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-data', true);
});

csui.define('csui/pages/start/impl/perspective.factory',[
  'csui/controls/perspective.panel/perspective.factory'
], function (PerspectiveFactory) {
  'use strict';

  console.warn('DEPRECATED: depend on the module "csui/controls/perspective.panel/perspective.factory" instead.');

  return PerspectiveFactory;
});
csui.define('csui/pages/start/impl/perspective.router',[
  'csui/utils/routing'
], function (routing) {
  'use strict';

  // TODO: Deprecate this module, use csui/utils/routing

  function PerspectiveRouter() {}

  PerspectiveRouter.routesWithSlashes = routing.routesWithSlashes;

  return PerspectiveRouter;
});

csui.define('csui/pages/start/impl/perspective.panel/perspective.animator',[
  'csui/controls/perspective.panel/perspective.animator'
], function (PerspectiveAnimator) {
  'use strict';

  console.warn('DEPRECATED: depend on the module "csui/controls/perspective.panel/perspective.animator" instead.');

  return PerspectiveAnimator;
});
csui.define('csui/pages/start/impl/perspective.panel/perspective.panel.view',[
  'csui/controls/perspective.panel/perspective.panel.view'
], function (PerspectivePanelView) {
  'use strict';

  console.warn('DEPRECATED: depend on the module "csui/controls/perspective.panel/perspective.panel.view" instead.');

  return PerspectivePanelView;
});
