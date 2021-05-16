/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'hbs!conws/controls/description/impl/description',
  'i18n!conws/controls/description/impl/nls/lang',
  'css!conws/controls/description/impl/description'
], function (_, $, Marionette, base, TabableRegionBehavior, PerfectScrollingBehavior, template,
    lang) {

  var heightToSet = 0;
  var DescriptionView = Marionette.ItemView.extend({

    className: 'conws-description',

    template: template,

    initialize: function () {
      this.shortDescMode = true;
      this.has_more_desc = false;
      this.hideShowLess = false;
      this.collapsedHeightIsOneLine = false;
    },

    templateHelpers: function () {
      return {
        complete_description: this.options.complete_desc,
        current_description: this.options.complete_desc,
        more_description: this.has_more_desc && !this.hideShowLess,
        showmore_tooltip: lang.showmore,
        showmore_aria: lang.showmoreAria,
        showless_tooltip: lang.showless,
        showless_aria: lang.showlessAria,
        show_expandedView: this.expandDescription,
      };
    },

    ui: {
      description: '.description',
      readMore: '.description-readmore',
      showLess: '.description-showless',
      caretDiv: '.description-caret-div'
    },

    events: {
      'keydown @ui.readMore': 'readMoreClicked',
      'keydown @ui.showLess': 'showLessClicked',
      'click @ui.readMore': 'readMoreClicked',
      'click @ui.showLess': 'showLessClicked'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.description',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    constructor: function DescriptionView(options) {
      this.options = options || {};
      this.expandDescription = options.expandDescription === undefined ? true : options.expandDescription;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.hideShowLess = false;

      this.listenTo(this, 'dom:refresh', this._truncateIfNecessary);

      this.listenTo(this.options.view, 'dom:refresh', function () {
        this.triggerMethod('dom:refresh');
      });
    },

    currentlyFocusedElement: function () {
      if (this.has_more_desc) {
        if (this.shortDescMode) {
          return this.ui.readMore;
        } else {
          return this.ui.showLess;
        }
      } else {
        return $();
      }
    },

    onDestroy: function () {
      heightToSet = 0;
      if (this.renderTimer) {
        clearTimeout(this.renderTimer);
      }
    },

    _setTimer: function () {
      if (this.renderTimer) {
        clearTimeout(this.renderTimer);
      }
      this.renderTimer = setTimeout(_.bind(function () {
        this._truncateIfNecessary();
      }, this), 200);
    },

    onRender: function () {
      this._setTimer();
    },

    _updateDescriptionAndCaret: function () {
      this._enableCaretState();
      if (this.shortDescMode && this.has_more_desc) {
        this.$el.addClass('conws-description-collapsed');
      } else {
        this.$el.removeClass('conws-description-collapsed');
      }
    },

    _truncateIfNecessary: function () {
	    if (!!this.ui.description && typeof(this.ui.description) === "object") {
        var actualHeight = this.getActualHeight();
        var maxHeight;

        if (actualHeight && actualHeight !== 0) {
          if (heightToSet < actualHeight) {
            heightToSet = actualHeight;
          }
          this.$el.removeClass("description-height-threeline description-height-twoline");
          if(this.expandDescription === true) {
            this.$el.addClass('description-expanded-view');
            maxHeight = this.getMaxHeight();
            if (heightToSet === maxHeight) {
              this.$el.addClass('description-height-oneline');
            } else {
              heightToSet > maxHeight * 2 ? this.$el.addClass('description-height-threeline') : this.$el.addClass('description-height-twoline');
            }
          } else {
            this.$el.removeClass('description-expanded-view');
            maxHeight = this.getMaxHeight();
            if (actualHeight > maxHeight) {
              this.has_more_desc = true;
            }
            this._enableCaretState();
            this.$el.addClass("description-height-oneline");
          }
        }
      }
    },

    getActualHeight: function () {
      return this.ui.description.height();
    },

    getMaxHeight: function () {
      return parseFloat(this.ui.description.css("line-height"));
    },

    readMoreClicked: function (event) {
      if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();

        this.shortDescMode = false;
        this._truncateIfNecessary();
        this.$el.removeClass("description-height-oneline");
        var maxHeight = this.getMaxHeight();
        heightToSet > maxHeight * 2 ? this.$el.addClass('description-height-threeline') : this.$el.addClass('description-height-twoline');
        heightToSet > maxHeight * 2 ? this.ui.caretDiv.addClass("description-height-threeline") : this.ui.caretDiv.addClass("description-height-twoline");
        this.ui.showLess.focus();
        this.trigger("show:more:description");
      }
    },

    showLessClicked: function (event) {
      if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();

        this.$el.find(".description").scrollTop(0);
        this.shortDescMode = true;
        this._truncateIfNecessary();
        this.$el.removeClass("description-height-threeline description-height-twoline");
        this.ui.caretDiv.removeClass("description-height-threeline description-height-twoline");
        this.ui.readMore.focus();
        this.trigger("show:less:description");
      }
    },

    _enableCaretState: function () {
      if (this.has_more_desc) {
        this.ui.readMore.toggleClass('caret-hide', this.shortDescMode ? false : true);
        this.ui.showLess.toggleClass('caret-hide', this.shortDescMode ? true : false);
      } else {
        this.ui.readMore.addClass('caret-hide');
        this.ui.showLess.addClass('caret-hide');
      }
    }

  });

  return DescriptionView;

});
