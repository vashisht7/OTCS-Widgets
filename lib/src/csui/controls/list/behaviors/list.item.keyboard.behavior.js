/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return Marionette.Behavior.extend({

    ui: {
      titleName: '.list-item-title',
      moreActions: '.csui-tileview-more-btn'
    },

    events: function() {
      var events = {
        'keydown @ui.titleName': '_doDefaultAction'
      };
      if (this.view.showInlineActionBar) {
        events = _.extend(events, {
          'keydown': '_handleInlineKeyDown'
        });
      } else {
        events = _.extend(events, {
          'keydown': '_doDefaultAction'
        });
      }
      return events;
    },

    constructor: function ListItemKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
    },

    _doDefaultAction: function (e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        e.stopPropagation();
        this.view.trigger("click:item", {target: this.view.model});
      }
    },

    _handleInlineKeyDown: function (e) {
      var $target = $(e.target);
      switch (e.keyCode) {
      case 13: // enter
        this.view.onShowInlineMenu(e);
        this.ui.titleName.prop('tabindex', -1).trigger("focus");
        stopEvent(e);
        break;
      case 27: //escape
        var hasInlineMenu = this.view.onHideInlineMenu();
        if (hasInlineMenu) {
          this.$el.trigger("focus");
          stopEvent(e);
        }
        break;
      case 37: // arrow left
          if ((this.ui.moreActions.is($target) || this.ui.moreActions.has($target).length)) {
            this.ui.titleName.prop('tabindex', -1).trigger("focus");
            stopEvent(e);
          } else if (this.ui.titleName.is($target)) {
            stopEvent(e);
          }
        break;
      case 39: // arrow right
        if (this.ui.titleName.is($target)) {
          this.view._inlineMenuView.acquireFocus();
          stopEvent(e);
        }
        break;
      default:
        if ((this.ui.moreActions.is($target) || this.ui.moreActions.has($target).length) ||
            this.ui.titleName.is($target)) {
          stopEvent(e);
        }
      }
    },

  });

});
