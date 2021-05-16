/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/underscore', 'csui/lib/marionette',
      'csui/utils/contexts/factories/connector', 'csui/utils/contexts/factories/node',
      'csui/controls/progressblocker/blocker',
      'csui/controls/table/table.view',
      'xecmpf/models/eac/eventactionplans.factory',
      'xecmpf/models/eac/node.facet.factory',
      'csui/controls/facet.bar/facet.bar.view',
      'xecmpf/controls/dialogheader/dialogheader.view',
      'xecmpf/controls/title/title.view',
      'xecmpf/widgets/eac/impl/eac.table.columns',
      'xecmpf/controls/headertoolbar/headertoolbar.view',
      'xecmpf/widgets/eac/impl/toolbaritems',
      'csui/utils/commands',
      'csui/controls/facet.panel/facet.panel.view',
      'csui/utils/contexts/factories/node',
      'xecmpf/models/eac/eventactionplans.model',
      'csui/controls/toolbar/toolbar.command.controller',
      'hbs!xecmpf/widgets/eac/impl/eac',
      'i18n!xecmpf/widgets/eac/impl/nls/lang',
      'css!xecmpf/widgets/eac/impl/eac',
    ],
    function (require, module, _, Marionette,
        ConnectorFactory, NodeModelFactory,
        BlockingView,
        TableView,
        EACEventActionPlansFactory,
        EACFacetFactory,
        FacetBarView,
        HeaderView,
        TitleView,
        eacTableColumns,
        HeaderToolbarView,
        toolbarItems,
        commands,
        FacetPanelView,
        NodeFactory,
        EACEventActionPlans,
        ToolbarCommandController,
        template, lang) {

      var config = module.config();
      _.defaults(config, {
        defaultPageSize: 30
      });

      var EACView = Marionette.LayoutView.extend({

        className: 'xecmpf-eac csui-nodestable',

        template: template,

        ui: {
          facetView: '.csui-table-facetview'
        },

        regions: {
          toolbarRegion: '#xecmpf-eac-toolbar',
          facetRegion: '#xecmpf-eac-facet',
          facetBarRegion: '#xecmpf-eac-facet-bar',
          tableRegion: '#xecmpf-eac-table-contents',
          paginationRegion: '#xecmpf-eac-pagination'
        },

        events: {
          'click li[data-csui-command="eacback"]': function (event) {
            if (history.state) {
              history.back();
            }
          }
        },

        constructor: function EACView(options) {
          options || (options = {});
          options = options.data ? _.extend(options, options.data) : options;
          _.defaults(options, {
            pageSize: config.defaultPageSize
          });

          if (!options.context) {
            throw new Error('Context is missing in the constructor options');
          }

          BlockingView.imbue(this);
          Marionette.LayoutView.prototype.constructor.apply(this, arguments);
          this.connector = options.connector || options.context.getObject(ConnectorFactory);
        },

        initialize: function (options) {
          this.node = options.context.getModel(NodeModelFactory, options);
          this.collection = options.context.getCollection(EACEventActionPlansFactory, options);
          this.commands = options.commands || commands;

          this.commandController = new ToolbarCommandController({
            commands: this.commands
          });
          this.listenTo(this.commandController, 'after:execute:command',
              this._toolbarActionTriggered);

          this.setHeaderView();
          this.setFacetView();
          this.setFacetBarView();
          this.setTableView();
        },

        setFacetView: function () {
          this.facetFilters = this.options.facetFilters ||
                              this.options.context.getCollection(EACFacetFactory, {
                                options: {
                                  node: this.node
                                },
                                attributes: this.options.data.containerId ?
                                    {id: this.options.data.containerId} : undefined,
                                detached: true
                              });
          this.listenToOnce(this.options.context, 'request', function () {
            this.facetFilters.fetch();
          });

          this.facetView = new FacetPanelView({
            collection: this.facetFilters,
            blockingLocal: true
          });

          this.listenTo(this.facetView, {
            'remove:filter': this._removeFacetFilter,
            'remove:all': this._removeAll,
            'apply:filter': this._addToFacetFilter,
            'apply:all': this._setFacetFilter
          });
        },

        setFacetBarView: function () {
          this.facetBarView = new FacetBarView({
            collection: this.facetFilters,
            context: this.options.context,
            showSaveFilter: false
          });
          this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
              .listenTo(this.facetBarView, 'remove:all', this._removeAll)
              .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
              .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
        },

        setHeaderView: function () {
          var leftToolbar = new HeaderToolbarView({
            commands: commands,
            originatingView: this,
            context: this.options.context,
            collection: this.collection,
            toolbarItems: toolbarItems.leftToolbar,
            container: this.node,
            commandController: this.commandController
          });

          var titleView = new TitleView({title: lang.dialogTitle});

          var rightToolbar = new HeaderToolbarView({
            commands: commands,
            originatingView: this,
            context: this.options.context,
            collection: this.collection,
            toolbarItems: toolbarItems.rightToolbar,
            container: this.node,
            commandController: this.commandController
          });

          this.headerView = new HeaderView({
            leftView: leftToolbar,
            centerView: titleView,
            hideDialogClose: true,
            rightView: rightToolbar
          });
        },

        setTableView: function () {
          this.tableView = new TableView({
            context: this.options.context,
            connector: this.connector,
            collection: this.collection,
            columns: this.collection.columns,
            tableColumns: eacTableColumns.clone(),
            pageSize: this.options.pageSize,
            originatingView: this,
            columnsWithSearch: ['event_name'],
            orderBy: this.options.data.orderBy || this.options.orderBy || this.collection.orderBy ||
                     'event_name asc',
            blockingParentView: this,
            parentView: this,
            selectColumn: false,
            selectRows: 'none',
            tableTexts: {
              zeroRecords: lang.emptyTableText || 'No results found'
            },
            haveToggleAllDetailsRows: false,
            haveDetailsRowExpandCollapseColumn: false,
          });

        },

        onRender: function () {

          if (!history.state) {
            var backbutton = this.$el.find('li[data-csui-command="eacback"]');
            backbutton.css({"display": "none"});
          }
          this.listenTo(this.collection, 'sync', function () {
            this.setTableView();
            this.showChildView('tableRegion', this.tableView);
            this.showChildView('toolbarRegion', this.headerView);
            this.showChildView('facetRegion', this.facetView);
            this.showChildView('facetBarRegion', this.facetBarView);
            var that = this;
            waitUntilElementVisible({
              $el: that.tableView.$el,
              success: function () {
                that.tableView.triggerMethod('dom:refresh');
              }
            });
          });
        },

        _handleFacetBarVisible: function () {
          this.facetBarView.$el.find(
              "#xecmpf-eac-facet-bar .csui-facet-list-bar .csui-facet-item:last a").trigger("focus");
        },

        _handleFacetBarHidden: function () { },

        _setFacetPanelView: function () {
          this.facetView = new FacetPanelView({
            collection: this.facetFilters,
            blockingLocal: true
          });
          this.listenTo(this.facetView, {
            'remove:filter': this._removeFacetFilter,
            'remove:all': this._removeAll,
            'apply:filter': this._addToFacetFilter,
            'apply:all': this._setFacetFilter
          })
        },

        _filterArray: function (facetValues) {
          return facetValues.reduce(function (memo, facetValue) {
            var temp = facetValue.split(':');
            memo[temp[0]] = temp[1].split("|");
            return memo;
          }, {});
        },

        _addToFacetFilter: function (filter) {
          this.facetFilters.addFilter(filter);
          var facetValues = this.facetFilters.getFilterQueryValue();
          this.collection.setFilter(this._filterArray(facetValues));
        },

        _setFacetFilter: function (filter) {
          this.facetFilters.setFilter(filter);
          var facetValues = this.facetFilters.getFilterQueryValue();
          this.collection.setFilter(this._filterArray(facetValues));
        },

        _removeFacetFilter: function (filter) {
          this.facetFilters.removeFilter(filter);
          var facetValues = this.facetFilters.getFilterQueryValue();
          if (facetValues.length === 0) {
            this._removeAll();
          } else {
            this.collection.setFilter(this._filterArray(facetValues));
          }
        },

        _removeAll: function () {
          this.facetFilters.clearFilter();
          this.collection.reset(this.collection.allModels);
        },

        _toolbarActionTriggered: function (toolbarActionContext) {
          switch (toolbarActionContext.commandSignature) {
          case 'EACBack':
            break;
          case 'Filter':
            this._completeFilterCommand();
            break;
          case 'EACRefresh':
            break;
          }
        },

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

        _completeFilterCommand: function () {
          var that = this;
          this.showFilter = !this.showFilter;
          if (this.showFilter) {
            this._ensureFacetPanelViewDisplayed();
            this.ui.facetView.removeClass('csui-facetview-visibility');
            this.ui.facetView.one(this._transitionEnd(), function () {
              that.tableView.triggerMethod('dom:refresh');
            }).removeClass('csui-facetview-hidden');
          } else {
            this.ui.facetView.one(this._transitionEnd(), function () {
              that.tableView.triggerMethod('dom:refresh');
              that.ui.facetView.hasClass('csui-facetview-hidden') &&
              that.ui.facetView.addClass('csui-facetview-visibility');
              that._removeFacetPanelView();
            }).addClass('csui-facetview-hidden');
          }
        },

        _ensureFacetPanelViewDisplayed: function () {
          if (this.facetView === undefined) {
            this._setFacetPanelView();
            this.facetRegion.show(this.facetView);
          }
        },

        _removeFacetPanelView: function () {
          this.facetRegion.empty();
          this.facetView = undefined;
        }
      });

      function waitUntilElementVisible(options) {
        if (options.$el.is(':visible')) {

          options.success();
          return;
        }
        options.count || (options.count = 'noLimit');
        options.interval || (options.interval = 200);
        setTimeout(function () {
          if (options.count === 0) {
            if (options.error !== undefined) {
              options.error();
            }
          } else {
            if (typeof options.count === 'number') {
              options.count--;
            }
            waitUntilElementVisible(options);
          }
        }, options.interval);
      }

      return EACView;
    });
