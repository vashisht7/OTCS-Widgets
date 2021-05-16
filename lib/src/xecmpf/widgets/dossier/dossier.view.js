/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/node', 'conws/models/workspacecontext/workspacecontext.factory',
  'xecmpf/widgets/dossier/impl/dossier.factory',
  'csui/controls/tile/behaviors/blocking.behavior', 'csui/behaviors/limiting/limiting.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'xecmpf/behaviors/scroll.controls/scroll.controls.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/list/list.view', 'xecmpf/widgets/dossier/impl/documentslist/documentslist.view',
  'xecmpf/controls/dropdown/dropdown.view',
  'xecmpf/widgets/dossier/impl/dropdown.items',
  'i18n!xecmpf/widgets/dossier/impl/nls/lang',
  'css!xecmpf/widgets/dossier/impl/dossier'
], function (_, $, Backbone, Marionette,
    NodeModelFactory, WorkspaceContextFactory, DossierFactory,
    BlockingBehavior, LimitingBehavior, PerfectScrollingBehavior,
    ScrollControlsBehavior, ListViewKeyboardBehavior, ModalAlert,
    ListView, DocumentsListView, DropdownView,
    dropdownMenuItems, lang) {

  var DossierView;

  DossierView = ListView.extend({

    id: 'xecmpf-dossier',

    constructor: function DossierView(options) {
      options || (options = {});
      options = options.data ? _.extend(options, options.data) : options;
      if (!options.workspaceContext) {
        if (options.context) {
          options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        } else {
          throw new Error('Context is missing in the constructor options!');
        }
      }
      options.workspaceContext.setWorkspaceSpecific(DossierFactory);
      ListView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.completeCollection, 'request', this.blockActions)
          .listenTo(this.completeCollection, 'error', this.unblockActions)
          .listenTo(this.completeCollection, 'sync', this.onCompleteCollectionSync);

      this.synced = false;
    },

    templateHelpers: function () {
      return {
        icon: undefined,
        title: undefined,
        searchPlaceholder: lang.searchPlaceholder
      };
    },

    events: {
      'focus span[title="Search"]': function () {
        var dropdown = this.$el.find('.xecmpf-dropdown');
        dropdown.removeClass('binf-open');
      },

      'keydown .clearer': function () {
        var searchInput = this.$('.search');
        searchInput.val('');
        searchInput.trigger("focus");
        this.filterChanged();
      },

      'keydown li.dropdown-menu-item': function () {
        if (event.keyCode === 13 || event.keyCode === 32) {
          $('.dropdown-menu-item').trigger("click");
          var dropdown = this.$el.find('.xecmpf-dropdown');
          dropdown.removeClass('binf-open');
        }
      },
      'keydown .dossier-dropdown': 'getDossierViewFilter',
      'keydown .tile-header span[title="Search"]': function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
          $('.tile-header span[title="Search"]').trigger("click");
        }
      },
      'keydown .tile-header input[class="search"]': function (event) {
        if (event.keyCode === 27) {
          $('.tile-header span[title="Hide"]').trigger("click");
          $('.tile-header span[title="Hide"]').trigger("focus");
        }
      }
    },
    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        limit: undefined,
        completeCollection: function () {
          this.nodeModel = this.options.workspaceContext.getObject(NodeModelFactory);
          this.groupBy = this.options.groupBy;

          (function (metadata, ctx) {
            metadata || (metadata = []);
            ctx.metadata_categories = '';
            ctx.catsAndAttrs = [];
            if (metadata.length > 0) {
              var categories = '', catsAndAttrs = [];
              metadata.forEach(function (item) {
                if (item.attributeId) {
                  categories += item.categoryId + ',';
                  catsAndAttrs.push(item.categoryId + '_' + item.attributeId);
                } else if (item.categoryId) {
                  categories += item.categoryId + ',';
                  catsAndAttrs.push(item.categoryId);
                }
              });
              ctx.metadata_categories = categories.substr(0, categories.length - 1);
              ctx.catsAndAttrs = catsAndAttrs;
            }
          })(this.options.metadata, this);
          return this.options.workspaceContext.getCollection(DossierFactory, {
            options: {
              nodeModel: this.nodeModel,
              query: {
                group_by: this.groupBy,
                metadata_categories: this.metadata_categories
              }
            }
          });
        }
      },

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        scrollingDisabled: true
      },

      ScrollControls: {
        behaviorClass: ScrollControlsBehavior,
        controlsContainer: '>.tile-content',
        contentParent: '>.tile-content>.binf-list-group',
        animateDuration: 500, //ms
        scrollableWidth: function () { //px
          var contentParentWidth = this.$('>.tile-content').innerWidth(),
              tileWidth          = this.$('>.tile-content>.binf-list-group>.tile').outerWidth(true),
              tilesInView        = Math.floor(contentParentWidth / tileWidth),
              scrollableWidth    = (tilesInView * tileWidth) || tileWidth;
          return scrollableWidth;
        },
        leftControlIconClass: 'caret-left',
        rightControlIconClass: 'caret-right'
      },

      Blocking: {
        behaviorClass: BlockingBehavior
      }

    },

    getDossierViewFilter: function (e) {
      switch (e.keyCode) {
      case 13:  // enter

      case 32:  // space

        var dropdown = this.$el.find('.xecmpf-dropdown');
        dropdown.hasClass('binf-open') ? dropdown.removeClass('binf-open') :
        dropdown.addClass('binf-open');

        break;
      }
    },

    childView: DocumentsListView,

    childViewOptions: function () {
      return {
        context: this.options.context,
        workspaceContext: this.options.workspaceContext,
        nodeModel: this.nodeModel,
        hideMetadata: this.options.hideMetadata,
        hideEmptyFields: this.options.hideEmptyFields,
        metadata_categories: this.metadata_categories,
        hideFavorite: this.options.hideFavorite,
        catsAndAttrs: this.catsAndAttrs
      }
    },

    onRenderTemplate: function () {
      if (this.options.hideGroupByCriterionDropdown !== true) {
        this._renderGroupByDropdownView();
      }
      this._renderDossierProperties();
    },

    onRenderCollection: function () {
      this.triggerMethod('update:scroll:controls');
    },

    onCompleteCollectionSync: function () {
      this.synced = true;
      this._updateDossierProperties();
      this.unblockActions();
    },

    isEmpty: function () {
      return (this.synced === true) && (this.collection.models.length === 0);
    },

    emptyViewOptions: {
      text: lang.emptyListText || "No documents."
    },

    _renderGroupByDropdownView: function () {
      var $dropdownEl = $('<div></div>')
          .addClass('dossier-dropdown-wrapper');
      var $dropdownLabel = $('<span></span>')
          .addClass('dossier-dropdown-label')
          .text(lang.groupByLabel);
      var $dropdown = $('<div></div>')
          .addClass('dossier-dropdown');
      $dropdownEl
          .append($dropdownLabel)
          .append($dropdown);

      this.$('>.tile-header>.tile-controls').prepend($dropdownEl);

      var dropdownRegion = new Marionette.Region({el: $dropdown});

      this.groupBydropdownView = new DropdownView({
        label: this._getGroupByDropdownLabel(dropdownMenuItems),
        collection: dropdownMenuItems
      });

      this.listenTo(this.groupBydropdownView, 'change:dropdown:item', function (args) {
        var value = args.newModel.get('value'),
            that  = this;
        this.synced = false;
        this.completeCollection
            .fetch({
              query: {
                group_by: value,
                metadata_categories: this.metadata_categories
              }
            })
            .done(function (response, status, jqXHR) {
              that.groupBy = value;
              that.groupBydropdownView.updateLabel(that._getGroupByDropdownLabel(args.newModel));
              var $scrollEl = that.$('>.tile-content>.binf-list-group');
              $scrollEl.scrollLeft(0);
              that.triggerMethod('update:scroll:controls');
              that._setGroupByDropdownModelActive(that.groupBydropdownView.collection);
            })
            .fail(function (jqXHR, status, error) {
              var errMsg = jqXHR.responseJSON ? jqXHR.responseJSON.error :
                           'Internal Server Error!';
              ModalAlert
                  .showError(errMsg)
                  .always(function () {
                    that._setGroupByDropdownModelActive(args.currModel);
                  });
            });
      });
      dropdownRegion.show(this.groupBydropdownView);
      this._setGroupByDropdownModelActive(dropdownMenuItems);
    },

    _getGroupByDropdownLabel: function (arg) {
      var label = /*lang.groupByLabelPrefix +*/ ' ',
          dropdownActiveModel;
      if (arg instanceof Backbone.Model) {
        dropdownActiveModel = arg;
      } else if (arg instanceof Backbone.Collection) {
        dropdownActiveModel = this._getGroupByDropdownActiveModel(arg);
      }

      if (dropdownActiveModel) {
        label += dropdownActiveModel.get('name');
      }
      return label;
    },

    _getGroupByDropdownActiveModel: function (collection) {
      if (collection instanceof Backbone.Collection) {
        return collection.find($.proxy(function (model) {
          return model.get('value') === this.groupBy;
        }, this));
      }
    },

    _setGroupByDropdownModelActive: function (arg) {
      var activeModel;
      if (arg instanceof Backbone.Model) {
        activeModel = arg;
      } else if (arg instanceof Backbone.Collection) {
        activeModel = this._getGroupByDropdownActiveModel(arg);
      }

      if (activeModel) {
        this.groupBydropdownView.setModelActive(activeModel);
      }
    },

    _renderDossierProperties: function () {
      var tilesCount = this.completeCollection.length || '0',
          docsCount  = this.completeCollection.total_documents || '0',
          $dossierPropEl, $tilesCountLabel, $docsCountLabel;

      this.$tilesCountEl = $('<span></span>')
          .addClass('count tiles-count')
          .text(tilesCount);
      $tilesCountLabel = $('<span></span>')
          .addClass('count-label')
          .text(lang.tilesLabel || 'group(s)');

      this.$docsCountEl = $('<span></span>')
          .addClass('count docs-count')
          .text(docsCount);
      $docsCountLabel = $('<span></span>')
          .addClass('count-label')
          .text(lang.documentsLabel || 'document(s)');

      $dossierPropEl = $('<div></div>')
          .addClass('dossier-properties')
          .append(this.$tilesCountEl).append($tilesCountLabel)
          .append(this.$docsCountEl).append($docsCountLabel);

      var _dropdownElement = this.$('.dossier-dropdown .csui-acc-focusable').get(0);
      _dropdownElement.setAttribute('tabindex', '0');
      var groupBy = this.groupBy;
      var toolTop
      if (groupBy === 'create_date') {
        toolTop = lang.selectByClassificationLabel;
      } else {
        toolTop = lang.selectByCreatedateLabel;
      }
      _dropdownElement.setAttribute('aria-label', toolTop);
      this.$('>.tile-header>.tile-title').remove();
      this.$('>.tile-header').prepend($dossierPropEl);

      var searchButton = this.$('>.tile-header span[title="Search"]');
      $(searchButton).addClass('csui-acc-focusable');
      $(searchButton).attr('tabindex', '0');

    },

    _updateDossierProperties: function () {
      var activeTiles = _.filter(this.completeCollection.models, function (model) {
        return model.attributes.documents;
      });
      var tilesCount = activeTiles.length,
          docsCount  = this.completeCollection.total_documents;
      this.$tilesCountEl.text(tilesCount);
      this.$docsCountEl.text(docsCount);
    }
  });

  return DossierView;
});
