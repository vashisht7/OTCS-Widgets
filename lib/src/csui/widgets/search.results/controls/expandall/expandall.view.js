/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/widgets/search.results/controls/expandall/impl/expandall',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'css!csui/widgets/search.results/controls/expandall/impl/expandall'
], function ($, Marionette, template, lang) {

  var expandAllView = Marionette.ItemView.extend({

    template: template,
    templateHelpers: function () {
      var messages = {
        expandAll: lang.expandAll
      };
      return {
        messages: messages
      };
    },

    events: {
      'click @ui.expandAllSelector': 'expandAll'
    },

    ui: {
      expandAllSelector: '.csui-search-header-expand-all',
      expandIcon: '.icon',
      expandAllLabelText: '.csui-search-expandall-text'
    },

    expandAll: function (event) {
      if (this.collection.length > 0) {
        var that = this;
        if (this._isExpanded) {
          this._isExpanded = false;

          this.ui.expandAllLabelText.html(lang.expandAll);
          this.ui.expandAllLabelText.attr('title', lang.expandAll);
          $(".csui-expand-all").addClass("csui-collapse-all");
          this.ui.expandIcon.removeClass('icon-expandArrowUp');
          this.ui.expandIcon.addClass('icon-expandArrowDown');
          this.ui.expandIcon.attr('title', lang.expandAll);
          this.ui.expandAllSelector.attr('title', lang.expandAll).attr('aria-pressed', 'true').attr('aria-label', lang.expandAll);
          this.options.view.$el.find("." + this.options._eleCollapse).trigger('click');
        } else {
          this._isExpanded = true;

          this.ui.expandAllLabelText.html(lang.collapseAll);
          this.ui.expandAllLabelText.attr('title', lang.collapseAll);
          $(".csui-expand-all").removeClass("csui-collapse-all");
          this.ui.expandIcon.removeClass('icon-expandArrowDown');
          this.ui.expandIcon.addClass('icon-expandArrowUp');
          this.ui.expandIcon.attr('title', lang.collapseAll);
          this.ui.expandAllSelector.attr('title', lang.collapseAll).attr('aria-pressed', 'false').attr('aria-label', lang.collapseAll);
          this.options.view.$el.find("." + this.options._eleExpand).trigger('click');
        }

          if (this.options.view.options.layoutView) {
            this.options.view.options.layoutView.updateScrollbar();
          }
        event.preventDefault();
        event.stopPropagation();
      }
    },

    pageChange: function () {
      if (this.ui.expandIcon instanceof Object &&
          this.ui.expandIcon[0].classList.contains(this.options._eleCollapse)) {
        this.ui.expandIcon.removeClass(this.options._eleCollapse).addClass(
            this.options._eleExpand).attr('title', lang.expandAll);
            this.ui.expandAllLabelText.html(lang.expandAll);
            this.ui.expandAllLabelText.attr('title', lang.expandAll);
            this.ui.expandAllSelector.attr('title', lang.expandAll).attr('aria-pressed', 'false').attr('aria-label', lang.expandAll);
      }
    }

  });

  return expandAllView;

});
