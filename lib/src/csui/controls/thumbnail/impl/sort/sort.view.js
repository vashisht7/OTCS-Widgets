/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'i18n!csui/controls/thumbnail/impl/nls/lang',
  'hbs!csui/controls/thumbnail/impl/sort/impl/sort.menu',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/view.state/node.view.state.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/lib/binf/js/binf'
], function (module, require, $, _, Backbone, Marionette, log, lang, template,
    PerfectScrollingBehavior, NodeViewStateMixin, TabableRegionBehavior) {
  var SortingView = Marionette.ItemView.extend({

    className: 'cs-sort-links',
    template: template,

    constants: {
      SORT_ASC: "asc",
      SORT_DESC: "desc"
    },

    templateHelpers: function () {
      var self = this;
      var isfound = _.any(this.sortMenu, function (a) {
        return (a.value === self.actualValue) ? a.selected = true : a.selected = false;
      }, self);

      return {
        id: _.uniqueId('sortButton'),
        selectedValue: self.selectedValue,
        sortListArray: this.sortMenu,
        sortByTooltip: lang.sortBy,
        sortByAria: _.str.sformat(lang.sortByAria, self.selectedValue),
        selectedArrowClass: self.selectedArrow,
        selectedArrowTooltip: self.selectedArrow === "icon-sortArrowUp" ?
                              lang.sortDescending : lang.sortAscending,
        selectedArrowAria: self.selectedArrow === "icon-sortArrowUp" ?
                            _.str.sformat(lang.sortDescendingAria, self.selectedValue) :
                            _.str.sformat(lang.sortAscendingAria, self.selectedValue)
      };
    },

    ui: {
      sortOrderBtn: '.csui-search-sort-options span.csui-sort-arrow'
    },

    events: {
      'click .binf-dropdown-menu > li > a': 'onSortOptionClick',
      'click @ui.sortOrderBtn': 'onSortOrderClick',
      'keydown @ui.sortOrderBtn': 'onKeyInView'
    },

    constructor: function SortingView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
      var sortOptions   = {},
          sortListArray = [];
      this.context = this.options.resultView.options.context;
      var state_order = this.collection.orderBy ? this.collection.orderBy.split(' ')[0] : 
         (this.context.viewStateModel.getViewState('order_by') && this.context.viewStateModel.getViewState('order_by').split('_')[0]);
      var setLableName = state_order ? state_order : lang.name;
      setLableName = setLableName.toLowerCase();
      if (Object.keys(sortOptions).length === 0) {
        _.each(this.options.resultView.options.allColumns, function (col) {
          if (col.attributes && col.attributes.sort === true) {
            sortOptions[col.attributes.key] = col.attributes.name;
          }
        }),
            _.each(sortOptions, function (key, val) {
              sortListArray.push({key: val, value: key, selected: false});
            });
      }
      this.sortMenu = sortListArray;
      var labelName = this.OverlapDisplayText(sortOptions[setLableName]);
      this.selectedValue = labelName;
      this.actualValue = this.options.collection.sortname ? this.options.collection.sortname :
                         lang.name;
      this.selectedArrow = this.collection.orderBy ? this.options.collection.orderstate : "icon-sortArrowUp";
      this.selectedId = state_order ? state_order : "name";
      this.config = this.options.config || {};
    },

    onSortOptionClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.$el.find(".csui-search-sort-options li>a").removeClass("binf-active");
      this.$el.find(".csui-search-sort-options li>a>span").removeClass("icon-listview-checkmark");
      this.$(event.currentTarget).addClass('binf-active');
      this.resetSelection($(event.currentTarget.children[1]).attr('data-sortbyid'),
          event.currentTarget.children[1].innerHTML.trim());
    },

    resetSelection: function (id, name) {
      this.collection.setOrder(id + " " + this.constants.SORT_ASC);
      var orderBy = [];
      orderBy.push(id + " " + this.constants.SORT_ASC);
      this.setDefaultOrderBy();
      this.selectedValue = name;
      this.actualValue = name;
      this.selectedArrow = "icon-sortArrowUp";
      this.options.collection.selectedId = id;
      this.options.collection.sortname = name;
      this.options.collection.state = id + " " + this.constants.SORT_ASC;
      this.options.collection.orderstate = this.selectedArrow;
      this.options.collection.sort_state = this.options.collection.orderBy;
      var self = this;
      this.options.collection.fetch({silent: true})
          .then(function () {
            self.trigger('render:sortmenu', self.options.collection.state);
            self.$el.find('.binf-dropdown-toggle >span.cs-label').innerText = name;
            self.$el.find('.csui-sort-option.binf-active >span.cs-icon').addClass('icon-listview-checkmark');
            var labelName = self.OverlapDisplayText(name);
            self.$el.find('.binf-dropdown-toggle >span.cs-label').html(labelName);
            self.$el.find('.csui-search-sort-options').removeClass('binf-open');
          }, self);
    },

    OverlapDisplayText: function (displayname) {
      var labelName = displayname;
      return labelName;
    },

    onKeyInView: function (event) {
      if ((event.keyCode === 13 || event.keyCode === 32)) {
        this.onSortOrderClick();
      }
    },

    onSortOrderClick: function (event) {
      if (this.ui.sortOrderBtn.hasClass("icon-sortArrowDown")) {
        this.resetSelection(this.selectedId, this.selectedValue);
      } else {
        var arrowState = this.getViewStateOrderBy() ? this.getViewStateOrderBy().split(' ')[0] : this.selectedValue.toLowerCase();
        this.collection.setOrder(arrowState + " " + this.constants.SORT_DESC);
        var orderBy = [];
        orderBy.push(arrowState + " " + this.constants.SORT_DESC);
        this.setDefaultOrderBy();
        this.options.collection.sort_state = arrowState + " " + this.constants.SORT_DESC;
        this.options.collection.selectedId = arrowState;
        this.selectedArrow = "icon-sortArrowDown";
        this.options.collection.orderstate = this.selectedArrow;
        this.OverlapDisplayText(this.sortMenu[arrowState]);
      }
    },

    setDefaultOrderBy: function () {
      log.debug("Setting default view state order");
      var enableViewState = this.context && this.context.viewStateModel.get('enabled');
      if (enableViewState) {
        var orderBy = this.collection.orderBy;
        var makeItDefault = false;
        if (!this.getViewStateOrderBy()) {
          makeItDefault = true;
        }
        if (orderBy.length > 0 && this.setViewStateOrderBy([orderBy], {default: makeItDefault})) {
          return true;
        }
      }
    },

    onRender: function () {
      var self = this;
      self.$el.find('.csui-search-sort-options li>a span.cs-label').each(function () {
        if ($(this).text().trim() === self.selectedValue) {
          self.$el.find(".csui-search-sort-options li>a>span").removeClass("icon-listview-checkmark");
          $(this).siblings().addClass("icon-listview-checkmark");
        }
      }, self);
    }
  });
  _.extend(SortingView.prototype, NodeViewStateMixin);
  return SortingView;
});
