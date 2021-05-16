/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/list/emptylist.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior', 'i18n',
  'hbs!csui/controls/list/impl/list', 'i18n!csui/controls/list/impl/nls/lang',
  'css!csui/controls/list/impl/list', 'csui/lib/jquery.ui/js/jquery-ui'
], function (_, $, Marionette, base, EmptyListView,
    PerfectScrollingBehavior, i18n, listTemplate, lang) {

  var ListItemView = Marionette.ItemView.extend({

    constructor: function ListItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }

  });

  var ListView = Marionette.CompositeView.extend({

    direction: !!i18n.settings.rtl ? 'left' : 'right',

    constructor: function ListView(options) {
      options || (options = {});
      _.defaults(options, {
        filterValue: ''
      });
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
        return behavior.behaviorClass === PerfectScrollingBehavior;
      }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '> .tile-content',
            suppressScrollX: true,
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.prototype.constructor.call(this, options);
      var currentListTitle = !!this.templateHelpers() && !!this.templateHelpers().title ?
                             ' ' + this.templateHelpers().title.toLowerCase() : '',
          messages         = {
            'expandTitle': _.str.sformat(lang.expandView, currentListTitle),
            'expandAria': lang.expandAria,
            'searchTooltip': _.str.sformat(lang.searchView, currentListTitle),
            'collapseSearchTooltip': lang.collapseSearch,
            'openPerspectiveAria': lang.openPerspective,
            'openPerspectiveTooltip': lang.openPerspectiveTooltip
          };
      this.templateHelpers = _.defaults(this.templateHelpers(), lang, messages);
    },

    templateHelpers: function () {
    },

    setValidator: function () {
      this.validator = setInterval(_.bind(this.validateInput, this), 10);
    },

    unsetValidator: function () {
      clearInterval(this.validator);
    },

    className: 'cs-list tile content-tile',
    template: listTemplate,

    childViewContainer: '.binf-list-group',
    childView: ListItemView,
    childViewOptions: function () {
      return {
        template: this.options.childViewTemplate
      };
    },

    emptyView: EmptyListView,

    ui: {
      placeholderSearchIcon: '.icon-search-placeholder',
      headerTitle: '.tile-title',
      searchIcon: '.cs-search-icon',
      searchButton: '.cs-search-button',
      searchBox: '.search-box',
      searchInput: '.search',
      clearer: '.clearer',
      tileExpand: '.tile-expand',
      fadeout: '.fadeout',
      tileHeader: '.tile-header',
      openPerspectiveButton: '.cs-open-perspective-button',
      openPerspectiveIcon: '.icon-perspective-open'
    },

    events: {
      'keydown': 'onKeyDown'
    },

    triggers: {
      'click .tile-header': 'click:header',
      'click @ui.openPerspectiveButton': 'click:open:perspective'
    },
    onKeyDown: function (event) {
    },

    onRender: function () {
      this.ui.placeholderSearchIcon.hide();
      this.ui.searchInput.hide();
      this.ui.clearer.toggle(false);

      this.ui.placeholderSearchIcon.on('click', _.bind(this.placeholderSearchIconClicked, this));
      this.ui.searchButton.on('click', _.bind(this.searchClicked, this));
      this.ui.searchBox.on('click', _.bind(this.searchBoxClicked, this));
      this.ui.clearer.on('click', _.bind(this.searchFieldClearerClicked, this));
      this.ui.searchInput.on('input', _.bind(this.searchInput, this));

      this.srOnly = this.$el.find('.tile-content .binf-sr-only');
      this.tileHeader = this.$el.find('.tile-header');

      this.titleId = _.uniqueId("dlgTitle");
      this.$(this.ui.headerTitle).find('.csui-heading').attr('id', this.titleId);
      this.$(this.tileHeader).parent().attr('role', 'region').attr('aria-labelledby', this.titleId);
      this.$el.find('.tile-content').attr('aria-labelledby', this.titleId);
      this.$el.on('focusin', _.bind(this.focusinAria, this));
      this.$el.on('focusout', _.bind(this.focusoutAria, this));

      base.isAppleMobile() === false && this._enableOpenPerspective && this._addActivationEventHandlers();
    },

    _addActivationEventHandlers: function () {
      var el = this.$el;
      el.addClass('cs-no-expanding');
      el.on('mouseover', function () {el.addClass('cs-hover')})
          .on('mouseleave', function () {el.removeClass('cs-hover cs-mousedown')})
          .on('mousedown', function () {el.addClass('cs-mousedown')})
          .on('mouseup', function () {el.removeClass('cs-mousedown')})
          .on('focusin', function () {el.addClass('cs-has-focus')})
          .on('focusout', function () {el.removeClass('cs-has-focus')});

      this.ui.tileHeader.on('mouseover', function () {el.addClass('cs-tile-header-hover')})
          .on('mouseleave', function () {el.removeClass('cs-tile-header-hover')});

    },

    focusOutHandle: undefined,

    focusinAria: function () {
      if (this.focusOutHandle) {
        clearTimeout(this.focusOutHandle.handle);
        this.focusOutHandle = undefined;
      } else {
        this.srOnly.attr('aria-live', 'polite');
        this.setElementsVisibleAria();
      }
    },

    focusoutAria: function () {
      var that = this;
      this.focusOutHandle = setTimeout(function() {
          that.srOnly.attr('aria-live', 'off');
          that.srOnly.html('');
          that.focusOutHandle = undefined;
      }, 25);
    },

    searchBoxClicked: function (event) {
      event.stopPropagation();
    },

    searchFieldClearerClicked: function () {
      this.ui.searchInput.val('');
      this.filterChanged();
      this.ui.searchInput.trigger('focus');
    },

    placeholderSearchIconClicked: function () {
      this.ui.searchInput.trigger('focus');
    },

    isSearchOpen: function () {
      return this.ui.searchInput.is && this.ui.searchInput.is(":visible");
    },

    searchClicked: function (event) {
      this.ui.searchInput.val('');
      this.ui.clearer.toggle(false);

      this.ui.headerTitle.toggle('fade', _.bind(function () {
        this._resetFilter();
      }, this));
      if (this.isSearchOpen()) {
        this.ui.placeholderSearchIcon.hide();
      }

      this.ui.searchInput.toggle('blind', {direction: this.direction}, 200, _.bind(function () {
        if (this.isSearchOpen()) {
          this.setValidator();
          this.ui.searchInput.prop('tabindex', '0');
          this.ui.searchInput.trigger('focus');
          this.ui.placeholderSearchIcon.show();
          this.ui.fadeout.show();
          this.iconsAriaLabel = this.$(this.ui.searchButton).attr("aria-label");
          this.$(this.ui.searchButton).attr("title", lang.collapseSearch).attr("aria-expanded",
              "true").attr("aria-label", lang.collapseAria);
          this.$(this.ui.searchIcon).addClass('icon-search-hide');
        } else {
          this.unsetValidator();
          this.ui.fadeout.hide();
          this.$(this.ui.searchButton).attr("title", this.templateHelpers.searchTooltip).attr(
              "aria-expanded", "false").attr("aria-label", this.iconsAriaLabel);
          this.$(this.ui.searchIcon).removeClass('icon-search-hide');
        }

      }, this));

      event && event.stopPropagation();
    },

    validateInput: function () {
      if (!this.ui.searchInput.val) {
        return;
      }
      var bIsFilled = this.ui.searchInput.val && !!this.ui.searchInput.val().length;
      this.ui.clearer.toggle(bIsFilled);
      this.ui.clearer.prop('tabindex', bIsFilled ? '0' : '-1');
    },

    searchInput: function (event) {
      if (this.keyInputTimer) {
        clearTimeout(this.keyInputTimer);
      }
      this.keyInputTimer = setTimeout(_.bind(function () {
        this.keyInputTimer = undefined;
        this.filterChanged();
      }, this), 300);
    },

    filterChanged: function () {
      this.options.filterValue = this.ui.searchInput.val();
      this.trigger('change:filterValue');
      this.setElementsVisibleAria();
    },

    setElementsVisibleAria: function () {
      var numElements = this.collection ? this.collection.size() : '0';
      this.srOnly.html(_.str.sformat(lang.elementsVisibleAria, numElements, this.templateHelpers.title));
    },

    _resetFilter: function () {
      this.ui.searchInput.val('');
      this.filterChanged();
    },
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var targetEle   = this.showInlineActionBar ? 'div.csui-item-standard:nth-child({0})' :
                        'div a:nth-child({0})',
          nthChildSel = _.str.sformat(targetEle, index + 1),
          $item       = this.$(nthChildSel);
      if ($item.length === 0) {
        $item = this._lookForElementToTabTo(index, ['[role="option"] > div:not(.binf-hidden)', '[role="option"]']);
      }
      if ($item) {
        return $($item[0]);
      }
    },

    _lookForElementToTabTo: function (index, selectors) {
      var $item, listElement = this.el;
      selectors && selectors.some(function (selector) {
        var elements = listElement.querySelectorAll(selector);
        if (elements && elements.length > index) {
          return ($item = $(elements[index]));
        }
      });
      return $item;
    }

  });

  return ListView;

});
