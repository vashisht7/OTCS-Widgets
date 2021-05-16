/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/tile/behaviors/blocking.behavior',
  'csui/controls/tile/tile.view',
  'csui/controls/list/emptylist.view',
  'xecmpf/widgets/dossier/impl/documentslist/impl/documents.model',
  'xecmpf/widgets/dossier/impl/documentslistitem/documentslistitem.view',
  'i18n!xecmpf/widgets/dossier/impl/nls/lang',
  'hbs!xecmpf/widgets/dossier/impl/documentslist/impl/documentslist',
  'css!xecmpf/widgets/dossier/impl/documentslist/impl/documentslist'
], function ($, _, Backbone, Marionette,
    InfiniteScrollingBehavior, PerfectScrollingBehavior, BlockingBehavior,
    TileView, EmptyListView, DocumentsCollection, DocumentsListItem,
    lang, template) {

  var DocumentsListView, DocumentsTileView;

  DocumentsListView = Marionette.CompositeView.extend({

    className: 'list-group-container',

    constructor: function DocumentsListView(options) {
      options || (options = {});
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    template: template,

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },

      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior,
        content: '>ul.xecmpf-document-list-group',
        fetchMoreItemsThreshold: 80
      }
    },

    childViewContainer: '>ul.xecmpf-document-list-group',

    childView: DocumentsListItem,

    childViewOptions: function () {
      return {
        context: this.options.context,
        workspaceContext: this.options.workspaceContext,
        nodeModel: this.options.nodeModel,
        hideMetadata: this.options.hideMetadata,
        hideEmptyFields: this.options.hideEmptyFields,
        hideFavorite: this.options.hideFavorite,
        catsAndAttrs: this.options.catsAndAttrs
      }
    },

    emptyView: EmptyListView,

    emptyViewOptions: {
      text: lang.emptyListText || 'No documents.'
    },

    onRender: function () {
      this.$el.one('mouseenter', $.proxy(function () {
        this.triggerMethod("dom:refresh");
      }, this))
    }
  });

  DocumentsTileView = TileView.extend({

    className: function () {
      var className       = 'xecmpf-documents-tile',
          parentClassName = _.result(TileView.prototype, 'className');
      if (parentClassName) {
        className += ' ' + parentClassName;
      }
      return className;
    },
    _focusedChild: undefined,
    _activeChild: undefined,
    constructor: function DocumentsTileView(options) {
      options || (options = {});
      TileView.prototype.constructor.apply(this, arguments);
      this.childrens = DocumentsListView
    },

    templateHelpers: function () {
      var title = this.model && this.model.get('name');
      return {
        title: title,
        icon: false
      };
    },

    behaviors: {
      Blocking: {
        behaviorClass: BlockingBehavior
      }
    },
    _accSelector: '.thumbnail_not_loaded',

    currentlyFocusedElement: function () {
      return this.$(this._accSelector);
    },

    getActiveChild: function () {
      return this._activeChild;
    },
    toggleFocus: function (on) {
      this.ui.listItem.prop('tabindex', on === true ? '0' : '-1'); // set or remove tabstop
      if (on) {
        this.ui.listItem.trigger("focus"); // if tabstop then set focus too
      }
    },
    contentView: DocumentsListView,

    contentViewOptions: function () {
      var queryParams = _.extend(this.options.model && this.options.model.get('query_params'), {
            metadata_categories: this.options.metadata_categories
          }),
          models      = this.options.model && this.options.model.get('documents'),
          paging      = this.options.model && this.options.model.get('paging');

      var collection = new DocumentsCollection(models, {
        nodeModel: this.options.nodeModel,
        query: queryParams,
        paging: paging
      });
      this.listenTo(collection, "request", this.blockActions)
          .listenTo(collection, "sync", this.unblockActions)
          .listenTo(collection, "error", this.unblockActions);

      return {
        collection: collection,
        context: this.options.context,
        workspaceContext: this.options.workspaceContext,
        nodeModel: this.options.nodeModel,
        hideMetadata: this.options.hideMetadata,
        hideEmptyFields: this.options.hideEmptyFields,
        hideFavorite: this.options.hideFavorite,
        catsAndAttrs: this.options.catsAndAttrs
      }
    },

    _renderTileProperties: function () {
      var docsCount = (this.model && this.model.get('paging').total_count) || '0',
          $tilePropEl, $docsCountLabel;

      this.$docsCountEl = $('<span></span>')
          .addClass('count docs-count')
          .text(docsCount);
      $docsCountLabel = $('<span></span>')
          .addClass('count-label')
          .text(lang.documentsLabel || 'document(s)');

      $tilePropEl = $('<div></div>')
          .addClass('tile-properties')
          .append(this.$docsCountEl).append($docsCountLabel);

      this.$('>.tile-header').append($tilePropEl);
    },

    onRender: function () {
      this._renderTileProperties();
    },

    onBeforeShow: function () {
      this.listenTo(this.contentView, 'execute:defaultAction', function (node) {
        this.triggerMethod('execute:defaultAction', node);
      });
    }
  });

  return DocumentsTileView;
});
