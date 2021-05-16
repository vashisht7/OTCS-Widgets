/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/controls/settings/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/settings/available.columns/available.columns.view',
  'csui/controls/table/table.view',
  'hbs!csui/controls/settings/selected.columns/impl/selected.columns',
  'hbs!csui/controls/settings/selected.columns/impl/selected.column'
], function ($, _, Backbone, Marionette, base, PerfectScrollingBehavior, lang, TabableRegionBehavior,
  AvailableColumnsView, TableView, SelectedColumnsTemplate, SelectedColumnTemplate) {
  'use strict';

  var SelectedColumnItemView = Marionette.View.extend({

    template: SelectedColumnTemplate,

    className: function () {
      return 'column-item' + (this.model.get('isNew') ? ' csui-new-column-item' : '');
    },

    attributes: {
      'data-value': 'column',
      'role': 'menuitem'
    },

    ui: {
      removeBtn: '.remove-button'
    },

    triggers: {
      'keydown': { event: "keydown:item", stopPropagation: false, preventDefault: false },
      'click @ui.removeBtn': { event: "column:remove", stopPropagation: false, preventDefault: false }
    },

    templateContext: function () {
      var nonRemovable = ['OTName', 'OTMIMEType'],
        key = this.model.get('key');
      return {
        name: this.model.get('name'),
        label: key,
        isRemovable: nonRemovable.indexOf(key) > -1 ? false : true,
        removeColumn: _.str.sformat(lang.removeColumn, this.model.get('name')),
        removeColumnAria: _.str.sformat(lang.removeColumnAria, this.model.get('name'))
      };
    },

    constructor: function SelectedColumnItemView(options) {
      Marionette.View.apply(this, arguments);
      if (options && options.isTabularView) {
        this.$el.attr('draggable', true);
      }
      this.model.set('sequence',
        this.model && this.model.collection && this.model.collection.findIndex(this.model));
    }
  });

  var SelectedColumnsCollectionView = Marionette.CollectionView.extend({
    className: 'csui-selected-column',

    childView: SelectedColumnItemView,

    childViewOptions: function () {
      return {
        isTabularView: this.options && this.options.isTabularView
      };
    },

    childViewEvents: {
      'column:remove': 'onColumnRemove',
      'keydown:item': 'onChildViewKeydown'
    },

    constructor: function SelectedColumnsCollectionView(options) {
      options || (options = {});
      this.options = options;
      this.focusIndex = 0;
      Marionette.CollectionView.apply(this, options);
    },

    onColumnRemove: function (view) {
      this.options.availableColumnsCollection.add(this.options.collection.remove(view.model));
      this.options.settingsView.$el.css('height', this.options.settingsView.currentCard.outerHeight());
      this.options.settingsView.options.data.display_regions =
        "{" +
        this.collection
          .pluck('key')
          .map(function (key) {
            return "'" + key + "'";
          })
          .join(",")
        + "}";
    },

    attachHtml: function (collectionView, childView, index) {
      Marionette.CollectionView.prototype.attachHtml.call(this, collectionView, childView, index);
      if (!this.options.isTabularView || childView.model.get('key') === 'OTName' ||
        childView.model.get('key') === 'OTMIMEType') {
        childView.$el.addClass('drag-disabled');
        childView.$el.removeAttr("draggable");
      } else {
        this.attachDragListeners(childView);
      }
    },

    _getItemKey: function (el) {
      return el.find('[data-csui-key]').attr('data-csui-key');
    },

    attachDragListeners: function (childView) {
      var me = this,
        subItem = childView.$el,
        removeDragline = function () {
          me.$el.find('.csui-dragline').remove();
          delete me._dropAfter;
        };

      subItem.on('dragstart', function (event) {
        me._dragData = {
          sourceKey: me._getItemKey($(event.currentTarget))
        };
        event.originalEvent.dataTransfer.setData('text', '');
      });

      subItem.on('dragover', function (event) {
        if (!me._dragData || me._dragData.sourceKey === undefined) {
          return;
        }
        event.preventDefault();

        var dragline = $('<div class="csui-dragline">');
        var h = $(event.currentTarget).height();
        if (event.offsetY > (h / 2)) {
          if (me._dropAfter === undefined || me._dropAfter === false) {
            removeDragline();
            $(event.currentTarget).after(dragline);
            me._dropAfter = true;
          }
        } else {
          if (me._dropAfter === undefined || me._dropAfter === true) {
            removeDragline();
            $(event.currentTarget).before(dragline);
            me._dropAfter = false;
          }
        }
      });

      subItem.on('drop', _.bind(function (event) {
        if (!me._dragData || me._dragData.sourceKey === undefined) {
          return;
        }
        this.onSubItemDrop(me, event);
      }, this));

      subItem.on('dragleave', function (/*event*/) {
        removeDragline();
      });

      subItem.on('dragend', function (event) {
        event.preventDefault();
        removeDragline();
        delete me._dragData;
      });
    },
    onSubItemDrop: function (scope, event) {
      var me = scope;
      var sourceKey = me._dragData && me._dragData.sourceKey || me.keyDragSource || null,
        targetKey = me._getItemKey($(event.currentTarget)),
        sourceModel = me.collection.findWhere({ key: sourceKey }),
        targetModel = me.collection.findWhere({ key: targetKey }),
        sourceIndex = me.collection.indexOf(sourceModel),
        targetIndex = me.collection.indexOf(targetModel);
      event.preventDefault();

      if (sourceIndex === targetIndex || !sourceIndex) {
        return;
      }

      if (me._dropAfter === true) {
        targetIndex++;
      }

      if (sourceIndex < targetIndex) {
        targetIndex--;
      }

      me.collection.remove(sourceModel);
      me.collection.add(sourceModel, { at: targetIndex });
      me.$el.find('.csui-dragline').remove();
      if (me.keyDragSource) {
        me.$el.find('.active').removeClass('active');
        $(me.$el.children()[targetIndex]).addClass('active');
        me.$el.find('.active > *[tabindex]').trigger('focus');
      }
      me.triggerMethod('reorder', sourceModel);

      if (me._dragData && me._dragData.sourceKey) {
        delete me._dropAfter;
      }

      this.options.settingsView.isChanged = true;
      this.options.settingsView.options.data.display_regions =
        "{" +
        this.collection
          .pluck('key')
          .map(function (key) {
            return "'" + key + "'";
          })
          .join(",")
        + "}";
    },
    onSubItemPaste: function (scope, event) {
      var me = scope;
      var dragline = $('<div class="csui-dragline">');
      me.$el.find('.csui-dragline').remove();
      if (event.keyCode === 40) {
        $(event.currentTarget).after(dragline);
      }
      else {
        $(event.currentTarget).siblings('.active').before(dragline);
      }
    },
    onChildViewKeydown: function (childView, event) {
      var isMac = base.isMacintosh(),
        keyCode = event.keyCode,
        focusables = this.$el.find('*[tabindex]'),
        addButton;
        if ( this.options.isTabularView &&(isMac && event.metaKey && !event.ctrlKey || !isMac && !event.metaKey &&
          event.ctrlKey) ) {

        event.preventDefault();
        event.stopPropagation();

        if (keyCode === 88) {
          this.keyDragSource = this._getItemKey($(event.currentTarget));
        }
        else if (keyCode === 86) {
          this.onSubItemDrop(this, event);
          this.keyDragSource = undefined;
        }
      }
      else if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (keyCode === 13 || keyCode === 32) {
        this.onColumnRemove(childView, event);
        event.stopPropagation();
        (focusables.length - 1) === this.focusIndex ? --this.focusIndex : '';
        focusables = this.$el.find('*[tabindex]');
        if (focusables.length === 0) {
          addButton = this.$el.parents(".selected-columns-container").find(
            '.add-button');
          addButton.trigger('focus');
        } else {
          $(focusables[this.focusIndex]).closest('.column-item').addClass('active');
          $(focusables[this.focusIndex]).trigger('focus');
        }
      } else if (focusables.length) {
        if (keyCode === 38 || keyCode === 40) {
          $(focusables[this.focusIndex]).closest('.column-item').removeClass('active');
          if (keyCode === 38) { //up arrow
            this.focusIndex > 0 && --this.focusIndex;
          }
          else {//down arrow
            this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          }
          $(focusables[this.focusIndex]).closest('.column-item').addClass('active');
          $(focusables[this.focusIndex]).trigger('focus');
          if (this.keyDragSource && this.focusIndex >= 0) {
            this.onSubItemPaste(this,event);
          }
          event.stopPropagation();
          event.preventDefault();
        }
        if (event.keyCode === 9) {
          $(focusables[this.focusIndex]).closest('.column-item').removeClass('active');
          if (event.shiftKey && this.options.availableColumnsCollection.length) {
            addButton = this.$el.parents(".selected-columns-container").find(
              '.add-button');
            addButton.trigger('focus');
          } else {
            var backButton = this.$el.parents(".selected-columns-container").
              find('.arrow_back');
            backButton.trigger('focus');
          }
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  });

  var SelectedColumnsView = Marionette.View.extend({
    constructor: function SelectedColumnView(options) {
      Marionette.View.apply(this, arguments);
    },

    template: SelectedColumnsTemplate,

    templateContext: {
      label: lang.columnSettingsTitle,
      backButtonTitle: lang.SearchBackToolTip,
      backButtonAria: lang.SearchBackAria,
      addAvailableColumns: lang.addAvailableColumns,
      addColumnsAria: lang.addColumnsAria
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.columns-list',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    regions: {
      columnsList: '.columns-list'
    },

    ui: {
      backArrow: '.arrow_back',
      addButton: ".add-button"
    },

    events: {
      'click @ui.backArrow': 'showSettingsView',
      'keydown @ui.backArrow': 'onKeydownBackArrow',
      'click @ui.addButton': 'showAvailableColumns',
      "keydown": "onKeyInView"
    },

    onKeydownBackArrow: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32 || keyCode === 37) {
        this.showSettingsView(event);
        event.preventDefault();
        event.stopPropagation();
      }
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode,
        focusables = this.$el.find('.add-button'),
        focusIndex = 0;
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (focusables.length) {
        if (keyCode === 9) { // tab
          if (event.shiftKey) {
            if ($(document.activeElement).hasClass('arrow_back')) {
              focusables = this.$el.find('.circle_delete');
              focusIndex = this.selectedColumnsCollectionView.focusIndex = focusables.length - 1;
              $(focusables[focusIndex]).closest('.column-item').addClass('active');
              $(focusables[focusIndex]).trigger('focus');
            } else {
              this.$el.find('.arrow_back').trigger('focus');
            }
          } else {
            focusIndex = 0;
            if ($(document.activeElement).hasClass('arrow_back') && this.options
              .availableColumnsCollection.length) {
              $(focusables[focusIndex]).trigger('focus');
            } else {
              focusables = this.$el.find('.circle_delete');
              this.selectedColumnsCollectionView.focusIndex = 0;
              $(focusables[focusIndex]).closest('.column-item').addClass('active');
              $(focusables[focusIndex]).trigger('focus');
            }
          }
          event.preventDefault();
          event.stopPropagation();
        } else if (keyCode === 13 || keyCode === 32) {
          this.showAvailableColumns(event);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },

    showSettingsView: function (event) {
      this.options.settingsView.showSettings("settingsDropDownContainer", this.options.settingsView.settingsDropDownView);
    },

    showAvailableColumns: function () {
      var searchSettingsModel = this.options.settings && this.options.settings.get('display'),
        availableColumnsCollection, selectedColumnsCollection;
      if (searchSettingsModel && searchSettingsModel.display_regions) {
        availableColumnsCollection = searchSettingsModel.display_regions.available;
        selectedColumnsCollection = searchSettingsModel.display_regions.selected;
      }
      this.options.settingsView.showSettings("availableColumnsContainer",
        new AvailableColumnsView({
          selectedColumnView: this,
          settingsView: this.options.settingsView,
          tableCollection: this.options.tableCollection,
          collection: availableColumnsCollection,
          selectedColumnsCollection: selectedColumnsCollection,
          settings: this.options.settings
        }));
    },

    onRender: function () {
      if (!this.options.availableColumnsCollection.length) {
        this.ui.addButton.addClass('binf-hidden');
      }
      this.selectedColumnsCollectionView = new SelectedColumnsCollectionView(this.options);
      this.showChildView('columnsList', this.selectedColumnsCollectionView);
      this.listenTo(this.options.availableColumnsCollection, 'update', _.bind(function () {
        if (!this.options.availableColumnsCollection.length) {
          this.ui.addButton.addClass('binf-hidden');
        } else {
          this.ui.addButton.removeClass('binf-hidden');
        }
      }, this));
    }
  });
  return SelectedColumnsView;
});
