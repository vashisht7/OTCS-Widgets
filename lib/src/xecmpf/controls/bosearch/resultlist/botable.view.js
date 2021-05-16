/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/log',
  "csui/lib/backbone", 'csui/lib/marionette',
  'csui/controls/table/table.view',
  "csui/lib/jquery.dataTables.tableTools/js/dataTables.tableTools",
  'xecmpf/controls/bosearch/resultlist/boresult.collection',
  'i18n!xecmpf/controls/bosearch/impl/nls/lang'
], function (require, $, _, log,
    Backbone, Marionette,
    TableView,
    TableTools,
    BoResultCollection,
    lang
) {

  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  var InfiniteTableScrollingBehavior = Marionette.Behavior.extend({

    defaults: {
      content: null,
      contentParent: null,
      fetchMoreItemsThreshold: 95
    },

    constructor: function InfiniteTableScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      view.infiniteScrollingBehavior = this;
      this.listenTo(view, 'render', this._bindScrollingEvents);
      this.listenTo(view, 'before:destroy', this._unbindScrollingEvents);
    },

    _scrollToPosition: function (scrollPosition,where) {
      var contentParent = getOption.call(this, 'contentParent'),
          parentHeight = this._contentParent.height(),
          content = getOption.call(this, 'content'),
          contentEl = content ? this.view.$(content) :
                      contentParent ? this._contentParent.children().first() :
                      this.view.$el,
          contentHeight = _.reduce(contentEl, function(sum,el){return sum+$(el).height()},0);
      if (contentHeight<parentHeight) {
        scrollPosition = 0
      } else {
        if (where==="middle") {
          scrollPosition = scrollPosition - parentHeight / 2;
        } else if (where==="bottom") {
          scrollPosition =  scrollPosition - parentHeight;
        }
        scrollPosition =  Math.floor(scrollPosition);
        if (scrollPosition < 0) {
          scrollPosition = 0
        } else {
          var fetchMoreItemsThreshold = getOption.call(this, 'fetchMoreItemsThreshold'),
              scrollableHeight = Math.floor((contentHeight-parentHeight)*(fetchMoreItemsThreshold/100.0));
          if (scrollPosition>=scrollableHeight) {
            scrollPosition = scrollableHeight-1; // ensure, that no fetch is triggered
          }
        }
      }
      this._contentParent.scrollTop(scrollPosition);
    },

    scrollTop: function (scrollPosition) {
      this._scrollToPosition(scrollPosition,"top");
    },

    scrollMiddle: function (scrollPosition) {
      this._scrollToPosition(scrollPosition,"middle");
    },

    scrollBottom: function (scrollPosition) {
      this._scrollToPosition(scrollPosition,"bottom");
    },

    _bindScrollingEvents: function () {
      this._unbindScrollingEvents();
      var contentParent = getOption.call(this, 'contentParent');
      this._contentParent = contentParent ? this.view.$(contentParent) : this.view.$el;
      this._contentParent.on('scroll.' + this.view.cid, _.bind(this._checkScrollPosition, this));
    },

    _checkScrollPosition: function () {
      var contentParent = getOption.call(this, 'contentParent'),
          content = getOption.call(this, 'content'),
          contentEl = content ? this.view.$(content) :
                      contentParent ? this._contentParent.children().first() :
                      this.view.$el,
          fetchMoreItemsThreshold = getOption.call(this, 'fetchMoreItemsThreshold'),
          contentHeight = _.reduce(contentEl, function(sum,el){return sum+$(el).height()},0),
          scrollableHeight = contentHeight - this._contentParent.height(),
          lastScrollPosition = this._contentParent.scrollTop(),
          scrollablePercentage = lastScrollPosition * 100 / scrollableHeight;
      this.view.lastScrollPosition = lastScrollPosition;
      if (scrollablePercentage >= fetchMoreItemsThreshold) {
        this._checkScrollPositionFetch();
      }
    },

    _checkScrollPositionFetch: function () {
      var collection = this.view.collection;
      if (collection.length < collection.totalCount && !collection.fetching &&
          collection.skipCount < collection.length) {
        log.debug('fetching from {0}', collection.length) && console.log(log.last);
        var oldSkip = collection.skipCount;
        collection.setSkip(collection.length, false);
        var contentParent = getOption.call(this, 'contentParent');
        this.$(".ps-scrollbar-y-rail").trigger("mouseup");
        collection.fetch({
          reset: false,
          remove: false,
          merge: false,
          silent: true,
          success: _.bind(function () {
            if (collection.errorMessage && collection.errorMessage===BoResultCollection.ERR_COLUMNS_CHANGED) {
              collection.setSkip(oldSkip,false);
              if (this.view.lastScrollPosition>0) {
                this.view.$(contentParent).scrollTop(this.view.lastScrollPosition-1);
              }
            } else {
              this.view.render();
            }
          }, this)
        });
      }
    },

    _unbindScrollingEvents: function () {
      if (this._contentParent) {
        this._contentParent.off('scroll.' + this.view.cid);
      }
    }

  });

  var InfiniteScrollingTableView = TableView.extend({

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: _.defaults({
          InfiniteScrolling: {
            behaviorClass: InfiniteTableScrollingBehavior,
            contentParent: 'tbody',
            content: 'tbody>tr:visible',
            fetchMoreItemsThreshold: 100
          }
        },
        TableView.prototype.behaviors),

    constructor: function InfiniteScrollingTableView() {
      TableView.prototype.constructor.apply(this, arguments);
      this.listenTo(this,"clicked:cell", this._clickedCell);
      if (this.options.disableItemsWithWorkspace){
          this.listenTo(this, "tableRowRendered", this._disableRow);  
      }

      this.listenTo(this.collection, "request", function(model,xhr,options) {
        if (options.reset) {
          delete this.lastScrollPosition;
        }
      });
    },

    _disableRow: function(event){
        var eventTarget = event.target;
        var node = event.node;
        if (node.get("has_workspace")){
            var row = $(eventTarget); 
            row.addClass("conws-boresulttable-disabled-row");
            row.off("pointerenter"); //disable pointer events to avoid highlighting the rows
            row.off("pointerleave");
            row.find("td").not('.csui-table-cell-_toggledetails').off("click"); // disable cell click except for the expand/collapse details button.
        }
   },

    onKeyDown: function (event) {
      if (this.options && this.options.selectRows === 'single') {
        if (event.keyCode === 32 || event.keyCode === 13) {
          var btoggleDetails = event.target.classList.contains('csui-table-cell-_toggledetails');
          if (!btoggleDetails) { // it's  not a toggle cell
            event.preventDefault();
            event.stopPropagation();
            event.target.click();
          }
        }
      }
    },

    _clickedCell: function(cellEventInfo) {
      if (!this.ignoreSelectEvents) {
        var selectedRow = {
          model: cellEventInfo.model,
          target: this.table.row(cellEventInfo.rowIndex).node()
        };
        this.lastSelectedRow = selectedRow;
        this.trigger("row:selected",selectedRow);
      }
    },

    setSelection: function(selectedNodesById,selected) {

      this.ignoreSelectEvents = true;

      selected = selected || selected===undefined;
      function getTableTools() {
        return this.tableTools ||
               (this.tableTools = TableTools.fnGetInstance(this.table.table().node()));
      }
      function selectRowsByNodeIds(selectedNodesById) {
        if (this.table && selectedNodesById) {
          _.each(selectedNodesById,function(id) {
            var node = this.collection.get(id),
                position = this.collection.indexOf(node),
                tt = getTableTools.call(this),
                trNode = this.table.row(position).node();
            if (selected) {
              tt.fnSelect(trNode);
            } else {
              tt.fnDeselect(trNode);
            }
          },this);
        }
      }
      selectRowsByNodeIds.call(this,selectedNodesById);
      delete this.lastSelectedRow;
      if (this.table && selectedNodesById && selectedNodesById.length>0 && selected) {
        var id = selectedNodesById[0],
            node = this.collection.get(id),
            position = this.collection.indexOf(node),
            trNode = this.table.row(position).node();
        this.lastSelectedRow = {
          model: node,
          target: $(trNode)
        };
      }

      if (this.lastSelectedRow && this.infiniteScrollingBehavior) {
        var lastSelectedMiddle = this.lastSelectedRow.target.position().top + this.lastSelectedRow.target.height()/2;
        this.infiniteScrollingBehavior.scrollMiddle(lastSelectedMiddle);
      }

      delete this.ignoreSelectEvents;

    },

    clearSelection: function() {

      this.ignoreSelectEvents = true;
      delete this.lastSelectedRow;
      this.clearChildrenSelection();

      if (this.lastScrollPosition!==undefined && this.infiniteScrollingBehavior) {
        this.infiniteScrollingBehavior.scrollTop(this.lastScrollPosition);
      }

      delete this.ignoreSelectEvents;

    }

  });

  return InfiniteScrollingTableView;
});
