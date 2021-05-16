/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/controls/settings/impl/nls/lang',
  'hbs!csui/controls/settings/available.columns/impl/available.columns',
  'hbs!csui/controls/settings/available.columns/impl/available.column'
], function ($, _, Backbone, Marionette, PerfectScrollingBehavior, lang, AvailableColumnsTemplate,
  AvailableColumnTemplate) {
  'use strict';

  var AvailableColumnsItemView = Marionette.View.extend({
    template: AvailableColumnTemplate,

    attributes: {
      tabindex: '0',
      role: 'checkbox',
      'aria-checked': 'false'
    },

    className: 'column-item',
    triggers: {
      'click': 'column:add',
      'keydown': {event: "keydown:item", stopPropagation : false, preventDefault: false}
    },

    constructor: function AvailableColumnsItemView (options) {
      Marionette.View.apply(this, arguments);
    }
  });

  var AvailableColumnsCollectionView = Marionette.CollectionView.extend({
    childView: AvailableColumnsItemView,

    childViewEvents: {
      'column:add': 'onColumnAdd',
      'keydown:item': 'onChildViewKeydown'
    },
    constructor: function AvailableColumnsCollectionView (options) {
      Marionette.CollectionView.apply(this, arguments);
      this.focusIndex = 0;
    },

    onColumnAdd: function (view) {
      view.$el.toggleClass('selected');
      var selectedItem = view.$el.hasClass('selected');
      selectedItem ? view.$el.attr('aria-checked',true) : view.$el.attr('aria-checked',false);
      if (!!selectedItem) {
        view.model.set({
          isNew: true
        });
        this.options.availableSelectedColumnsCollection.add(view.model);
        if (view.model.get('key') === "OTName") {
          if (!this.options.selectedColumnsCollection.findWhere({key:'OTMIMEType'})) {
            this.options.selectedColumnsCollection.add(view.model, {at:0});
          } else {
            this.options.selectedColumnsCollection.add(view.model, {at:1});
          }
        } else if (view.model.get('key') === "OTMIMEType") {
          this.options.selectedColumnsCollection.add(view.model, {at:0});
        } else {
          this.options.selectedColumnsCollection.add(view.model);
        }
      } else {
        view.model.set({
          isNew: false
        });
        this.options.availableSelectedColumnsCollection.remove(view.model);
        this.options.selectedColumnsCollection.remove(view.model);
      }

      this.options.settingsView.options.data.display_regions = 
        "{" +
        this.options.selectedColumnsCollection
          .pluck('key')
          .map(function (key) {
            return "'" + key + "'";
          })
          .join(",")
        + "}";
    },

    onBeforeDestroy: function () {
      if (this.options.availableSelectedColumnsCollection) {
        this.collection.remove(this.options.availableSelectedColumnsCollection.models);
        this.options.availableSelectedColumnsCollection.reset();
      }
    },

    onChildViewKeydown: function (childView, event) {
      var focusables = this.$el.find('*[tabindex]');
      switch (event.which) {
        case 27:
          this.$el.closest(".csui-search-settings").trigger('focus');
          this.options.settingsView.triggerMethod('close:menu', event);
          break;
        case 13:
        case 32:
          this.onColumnAdd(childView);
          event.preventDefault();
          event.stopPropagation();
          break;
        case 38:
          this.focusIndex > 0 && --this.focusIndex;
          $(focusables[this.focusIndex]).trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
        case 40:
          this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          $(focusables[this.focusIndex]).trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
        case 9:
          this.$el.parents(".available-columns-container").
                              find('.arrow_back').trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    }
  });

  var SelectedColumnsCountView = Marionette.View.extend({

    constructor: function SelectedColumnsCountView () {
      Marionette.View.apply(this, arguments);
      this.listenTo(this.options.availableSelectedColumnsCollection,
        'update', this.render);
    },

    templateContext: function () {
      return {
        count: this.options.availableSelectedColumnsCollection.length || '',
        label : lang.selected
      };
    },

    template: _.template("<span title='<%=label%> <%=count%>'><%=count%></span>")
  });

  var AvailableColumnsView = Marionette.View.extend({
    className: 'csui-available-column',

    template: AvailableColumnsTemplate,

    templateContext: function () {
      return {
        label: lang.selectColumns,
        available: this.options.availableColumns,
        backToButtonTitle: _.str.sformat(lang.searchBackToTooltip, lang.columnSettingsTitle),
        backToButtonAria: _.str.sformat(lang.searchBackToAria, lang.columnSettingsTitle),
      };
    },

    regions: {
      columnsList: '.columns-list',
      selectedColumnsCountView: '.selected-column-count'
    },

    ui: {
      backArrow: '.arrow_back'
    },

    events: {
      'keydown @ui.backArrow': 'onKeyDownArrow',
      'click @ui.backArrow': 'showSelectedColumns',
      "keydown": "onKeyInView"
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.columns-list',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    onKeyDownArrow: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32 || keyCode === 37) {
        this.showSelectedColumns(event);
        event.preventDefault();
        event.stopPropagation();
      }
    },

    onKeyInView: function (event) {
      var focusables = this.$el.find('.column-item*[tabindex]'),
          focusIndex = 0;
      switch (event.which) {
        case 27:
          this.$el.closest(".csui-search-settings").trigger('focus');
          this.options.settingsView.triggerMethod('close:menu', event); 
          break; 
        case 9:
          this.availableColumnsCollectionView.focusIndex = 0;
          $(focusables[focusIndex]).trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    },

    constructor: function AvailableColumnsView (options) {
      Marionette.View.apply(this, arguments);
      this.options.availableSelectedColumnsCollection = new Backbone.Collection();
    },

    showSelectedColumns: function (event) {
      if (this.options.selectedColumnsCollection) {
        this.options.selectedColumnsCollection.add(this.options.collection.remove(this.options
          .availableSelectedColumnsCollection.models));
        this.options.availableSelectedColumnsCollection.reset();
      } 
      this.options.settingsView.showSettings("selectedColumnsContainer", this.options
        .selectedColumnView);
    },

    onRender: function () {
      this.availableColumnsCollectionView = new AvailableColumnsCollectionView(this.options);
      this.showChildView('columnsList', this.availableColumnsCollectionView);
      this.showChildView('selectedColumnsCountView', new SelectedColumnsCountView({
        availableSelectedColumnsCollection: this.options.availableSelectedColumnsCollection
      }));
    }

  });
  return AvailableColumnsView;
});