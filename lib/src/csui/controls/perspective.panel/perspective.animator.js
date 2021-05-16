/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery'
], function (module, _, $) {
  'use strict';

  var config = _.extend({
    effect: 'none'
  }, module.config());
  var effect = config;

  function PerspectiveAnimator(perspectivePanelView) {
    this.perspectivePanelView = perspectivePanelView;
  }

  PerspectiveAnimator.prototype = {
    startAnimation: function (perspectiveView) {
      if (effect === 'slide') {
        var perspectivePanel = this.perspectivePanelView;

        perspectivePanel.$el
          .redraw()
          .addClass('csui-in-transition');

        perspectiveView.$el.addClass('cs-on-stage-right');
        perspectiveView.triggerMethod('before:show');
        this.perspectivePanelView.$el.append(perspectiveView.el);
      } else if (effect === 'fade') {
        perspectiveView.$el.addClass('csui-fading');
      }
    },

    swapPerspective: function (currentPerspectiveView, upcomingPerspectiveView) {
      var deferred = $.Deferred();
      if (effect === 'slide') {
        currentPerspectiveView.$el.addClass('cs-on-stage-left');
      } else {
        currentPerspectiveView.remove();
      }

      if (effect === 'fade') {
        this.perspectivePanelView.$el.addClass('csui-in-transition');
      }
      this._insertPerspective(upcomingPerspectiveView);

      if (effect === 'slide' || effect === 'fade') {
        upcomingPerspectiveView.$el
            .one(this._transitionEnd(), deferred.resolve)
            .redraw()
            .removeClass(effect === 'slide' ? 'cs-on-stage-right' : 'csui-faded-out');
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    showPerspective: function (perspectiveView) {
      var deferred = $.Deferred();
      this._insertPerspective(perspectiveView);
      if (effect === 'slide' || effect === 'fade') {
        perspectiveView.$el
            .one(this._transitionEnd(), deferred.resolve)
            .redraw()
            .removeClass(effect === 'slide' ? 'cs-on-stage-right' : 'csui-faded-out');
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    finishAnimation: function () {
      if (effect === 'slide' || effect === 'fade') {
        this.perspectivePanelView.$el.removeClass('csui-in-transition');
      }
    },

    _insertPerspective: function (perspectiveView) {
      if (effect === 'fade') {
        perspectiveView.$el.addClass('csui-faded-out');
      }
      perspectiveView.triggerMethod('before:show');
      this.perspectivePanelView.$el.append(perspectiveView.el);
      perspectiveView.triggerMethod('show');
    },

    _transitionEnd: _.once(
      function () {
        var transitions = {
              transition: 'transitionend',
              WebkitTransition: 'webkitTransitionEnd',
              MozTransition: 'transitionend',
              OTransition: 'oTransitionEnd otransitionend'
            },
            element = document.createElement('div'),
            transition;
        for (transition in transitions) {
          if (typeof element.style[transition] !== 'undefined') {
            return transitions[transition];
          }
        }
      }
    )
  };

  return PerspectiveAnimator;
});

