/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'i18n!csui/widgets/search.results/controls/sorting/impl/nls/localized.strings',
  'hbs!csui/widgets/search.results/controls/sorting/impl/sort.menu',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/lib/binf/js/binf'
], function (module, require, $, _, Backbone, Marionette, log, lang, template,
    PerfectScrollingBehavior, TabableRegionBehavior) {

  var SearchSortingView = Marionette.ItemView.extend({

    className: 'cs-sort-links',
    template: template,
    templateHelpers: function () {
      var messages = {
        sortBy: lang.sortBy
      };
      var selectedTitle = this.selected.get('title') ? this.selected.get('title') :
                          this.constants.DEFAULT_SORT;
      return {
        messages: messages,
        sortEnable: this.collection.models.length && !!this.collection.sorting &&
                    this.options.enableSorting,
        id: _.uniqueId('sortButton'),
        sortButtonAria: lang.sortOptionsAria,
        listAria: lang.sortOptionsAria
      };
    },

    constants: {
      SORT_ASC: "asc",
      SORT_DESC: "desc",
      DEFAULT_SORT: "relevance"
    },

    events: {
      'click .binf-dropdown-menu > li > a': 'onSortOptionClick',
      'click a.search-sort-btn': 'onSortOrderClick',
      "keydown": "onKeyInView"
    },

    ui: {
      toggle: '>.csui-search-sort-options>.binf-dropdown-toggle',
      selectedLabel: '>.csui-search-sort-options>.binf-dropdown-toggle >.cs-label',
      selectedIcon: '>.csui-search-sort-options>.binf-dropdown-toggle >.cs-icon',
      sortOrderBtn: 'a.search-sort-btn'
    },

    constructor: function SearchSortingView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);

      this.config = this.options.config || {};

      this.selected = new Backbone.Model();
      if (this.collection) {
        var orderBy = this.options.orderBy || this.collection.orderBy;
        this.collection.setOrder(orderBy, false);
        this.listenTo(this.collection, 'reset', this.render); // render after reset of collection
      }
      this.listenTo(this.collection, 'change', this._refreshSelection);
      this.listenTo(this.selected, 'change', this._updateSelection);
    },

    onRender: function () {
      this.ui.toggle.binf_dropdown();
      this.ui.sortOrderBtn.hide();
      if (this.collection.sorting !== undefined
          && this.collection.sorting.links !== undefined) {
        if (this.collection.sorting.sort &&
            this.collection.sorting.sort[0] !== this.constants.DEFAULT_SORT) {
          this._setSelection(this.collection.sorting.links[this.collection.sorting.sort]);
          this._addDropdownItems($.extend({}, this.collection.sorting.links),
              this.collection.sorting.sort[0]);
          this.ui.sortOrderBtn.show();
        } else {
          this._setSelection(this.collection.sorting.links[this.constants.DEFAULT_SORT]);
          this._addDropdownItems($.extend({}, this.collection.sorting.links), "");
          this.$el.find(".binf-dropdown-menu > :first-child").addClass("binf-active");
          this.$el.find(".binf-dropdown-menu > :first-child a.csui-sort-option").attr("aria-checked", "true");
          this.$el.find(".binf-dropdown-menu > :first-child .cs-icon").addClass(
              "icon-listview-checkmark");
          this.ui.sortOrderBtn.hide();
        }
        this.ui.selectedLabel.text(this.selected.get('title'));
        if (this.selected.get("order") === this.constants.SORT_ASC) {
          this.ui.sortOrderBtn.removeClass("icon-sortArrowDown");
          this.ui.sortOrderBtn.addClass("icon-sortArrowUp");
          var titleD = _.str.sformat(lang.descending, this.selected.get('title'));
          this.ui.sortOrderBtn.attr('title', titleD).attr('aria-label', titleD);
        } else {
          this.ui.sortOrderBtn.removeClass("icon-sortArrowUp");
          this.ui.sortOrderBtn.addClass("icon-sortArrowDown");
          var titleA = _.str.sformat(lang.ascending, this.selected.get('title'));
          this.ui.sortOrderBtn.attr('title', titleA).attr('aria-label', titleA);
        }
      }
    },
    onKeyInView: function (event) {
      if (event.keyCode === 9) {
        !!this.$el.find('.binf-open') && this.$el.find('.binf-open').removeClass('binf-open');
      }

    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.binf-dropdown-menu',
        suppressScrollX: true
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        if (this.orderClicked) {
          return this.ui.sortOrderBtn;
        } else {
          return $(tabElements[0]);
        }
      }
    },

    _setSelection: function (model) {
      var sortObj = {};
      if (this.collection.sorting.sort) {
        if (this.collection.sorting.sort[0].indexOf(this.constants.SORT_DESC) === 0) {
          sortObj.id = this.collection.sorting.sort[0].replace(/desc_/g, '');
          sortObj.order = this.constants.SORT_DESC;
        }
        if (this.collection.sorting.sort[0].indexOf(this.constants.SORT_ASC) === 0) {
          sortObj.id = this.collection.sorting.sort[0].replace(/asc_/g, '');
          sortObj.order = this.constants.SORT_ASC;
        }
      } else {
        sortObj.id = "";
        sortObj.order = this.constants.SORT_DESC;
      }
      sortObj.title = _.str.trim((model && model.name) ? this.trimSortOptionName(model.name) :
                                 "empty");
      var titleVal = _.str.sformat(lang.sortByThis, sortObj.title);
      this.$el.find('.csui-search-sort-options 	.binf-dropdown-toggle').attr('title', titleVal);
      this.selected.set(sortObj);
    },

    _updateSelection: function () {
      this.ui.selectedLabel.text(this.selected.get('title'));
    },

    _refreshSelection: function (model) {
      if (!!(model.collection && model.collection.inMetadataNavigationView)) {
        model.collection.isSortOptionSelected = true;
      }
      if (model.get('id') === this.selected.get('id')) {
        this._setSelection(model);
      }
    },

    resetCollection: function (filter, autoFetch) {
      this.collection.setOrder(filter, true);
    },

    sortPage: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var orderBy = [];
      var idVal = $(e.currentTarget).attr('data-csui-sortoption-id');
      if (idVal !== undefined) {
        orderBy.push(idVal + " " + this.constants.SORT_DESC);
      } else {
        orderBy.push("");
      }
      this.resetCollection(orderBy.join(), true);
    },

    _addDropdownItems: function (sorting, activeOption) {
      var jqUl = this.$el.find('.binf-dropdown-menu'),
        self = this;
      if (sorting[this.constants.DEFAULT_SORT]) {
        var name = self.trimSortOptionName(sorting[self.constants.DEFAULT_SORT].name);
        jqUl.append(
          '<li role="presentation"><a role="menuitemradio" aria-checked="false" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon"></span><span class="cs-label" title="' +
           name + '">' + name + '</span></a></li>');
        delete sorting[self.constants.DEFAULT_SORT];
      }

      for (var sort in sorting) {
        if (sort.search("asc_") === 0) {
          delete sorting[sort];
        } else {
          var id2Use = sort.replace(/desc_/g, '');
          var nam = self.trimSortOptionName(sorting[sort].name);
          if (activeOption.split(/_(.+)/, 2)[1] === sort.split(/_(.+)/, 2)[1]) {
            jqUl.append('<li role="presentation" class="binf-active"><a role="menuitemradio" aria-checked="true" data-csui-sortoption-id="' +
              id2Use +
              '" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon icon-listview-checkmark"></span><span class="cs-label" title="' +
              nam + '">' + nam + '</span></a></li>');
          } else {
            jqUl.append('<li role="presentation"><a role="menuitemradio" aria-checked="false" data-csui-sortoption-id="' +
              id2Use +
              '" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon"></span><span class="cs-label" title="' +
              nam + '">' + nam + '</span></a></li>');
          }
        }
      }
    },

    activate: function (element) {
      if (this.$el.find("li").hasClass("binf-active") === true) {
        this.$el.find("li").removeClass("binf-active");
        this.$el.find("li a.csui-sort-option").attr('aria-checked', 'false');
        this.$el.find("li .cs-icon").removeClass("icon-listview-checkmark");
      }
      $(element.parentElement).addClass("binf-active");
      $(element).find("a.csui-sort-option").attr('aria-checked', 'true');
      $(element).find("span.cs-icon").addClass("icon-listview-checkmark");
    },

    resetSelection: function (id, name) {
      var sortObj = {};
      sortObj.id = id;
      sortObj.title = _.str.trim(name);
      sortObj.order = this.constants.SORT_DESC;
      this.selected.set(sortObj);
    },

    onSortOptionClick: function (event) {
      this.collection.isSortOptionSelected = true;
      event.preventDefault();
      event.stopPropagation();
      if (event.currentTarget.children[1].innerHTML.toLowerCase() === this.constants.DEFAULT_SORT) {
        this.ui.sortOrderBtn.hide();
      }
      this.orderClicked = false;
      this.activate(event.currentTarget);
      var id2Use = $(event.currentTarget).attr('data-csui-sortoption-id');
      if (id2Use === undefined) {
        id2Use = "";
      }
      this.resetSelection(id2Use, event.currentTarget.children[1].innerHTML);
      this.sortPage(event);
      this.ui.toggle.binf_dropdown('toggle');
      this.trigger("change:sortOrder");
    },

    onSortOrderClick: function (event) {
      this.collection.isSortOptionSelected = true;
      event.preventDefault();
      event.stopPropagation();
      this.orderClicked = true;
      var orderBy = [];
      if (this.ui.sortOrderBtn.hasClass("icon-sortArrowDown")) {
        this.ui.sortOrderBtn.removeClass("icon-sortArrowDown");
        this.ui.sortOrderBtn.addClass("icon-sortArrowUp");
        orderBy.push(this.selected.id + " " + this.constants.SORT_ASC);
      } else {
        this.ui.sortOrderBtn.removeClass("icon-sortArrowUp");
        this.ui.sortOrderBtn.addClass("icon-sortArrowDown");
        orderBy.push(this.selected.id + " " + this.constants.SORT_DESC);
      }
      this.collection.setOrder(orderBy.join(), true);
    },

    trimSortOptionName: function (name) {
      return name.replace(/\(([;\s\w\"\=\,\:\.\/\~\{\}\?\!\-\%\&\#\$\^\(\)]*?)\)/g, "");
    }

  });

  return SearchSortingView;
});
