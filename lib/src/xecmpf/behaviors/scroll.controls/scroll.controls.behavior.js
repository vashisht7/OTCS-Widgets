/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!xecmpf/behaviors/scroll.controls/impl/scroll.controls',
  'css!xecmpf/behaviors/scroll.controls/impl/scroll.controls'
], function (_, $, Marionette, template, css) {
  "use strict";

  var ScrollControlsBehavior;

  ScrollControlsBehavior = Marionette.Behavior.extend({

    defaults: {
      contentParent: null,
      controlsContainer: null,
      scrollableWidth: null, //px
      animateDuration: 400 //ms
    },

    ui: {
      leftControl: '.cs-scroll-control-left',
      rightControl: '.cs-scroll-control-right'
    },

    triggers: {
      'mousedown @ui.leftControl': 'scroll:left',
      'mousedown @ui.rightControl': 'scroll:right'
    },

    constructor: function ScrollControlsBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._renderControls)
          .listenTo(view, 'dom:refresh', this._updateScrollControls)
          .listenTo(view, 'update:scroll:controls', this._updateScrollControls)
          .listenTo(view, 'scroll:left', this._scrollLeft)
          .listenTo(view, 'scroll:right', this._scrollRight)
          .listenTo(view, 'before:destroy', this._unbindUpdateControlsEvents);
    },

    _renderControls: function () {
      var controlsContainerSelector = getOption.call(this, 'controlsContainer');
      this._controlsContainer = controlsContainerSelector ?
                                this.view.$(controlsContainerSelector) : this.view.$el;

      var contentParentSelector = getOption.call(this, 'contentParent');
      this._contentParent = contentParentSelector ?
                            this.view.$(contentParentSelector) : this.view.$el;
      this._bindControlsUpdatingEvents();

      this.animateDuration = getOption.call(this, 'animateDuration');

      var data = {
        leftControlIconClass: getOption.call(this, 'leftControlIconClass'),
        rightControlIconClass: getOption.call(this, 'rightControlIconClass')
      };

      this._controlsContainer.append(template(data));
      this.view._bindUIElements.call(this);
    },

    _updateScrollControls: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        var currentPos         = this._contentParent.scrollLeft(),
            scrollWidth        = this._contentParent.get(0).scrollWidth,
            contentParentWidth = this._contentParent.width();
        currentPos === 0 ? this.ui.leftControl.hide(100) : this.ui.leftControl.show(100);
        currentPos === (scrollWidth - contentParentWidth) ?
        this.ui.rightControl.hide(100) : this.ui.rightControl.show(100);
      }
    },

    _scrollLeft: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        var scrollableWidth = getOption.call(this, 'scrollableWidth') ||
                              this._contentParent.innerWidth();
        var currentPos = this._contentParent.scrollLeft();
        this._contentParent
            .trigger("focus")
            .filter(':not(:animated)')
            .animate({scrollLeft: currentPos - scrollableWidth}, this.animateDuration, 'swing',
                $.proxy(function () {this.view.triggerMethod('update:scroll:controls')}, this));
      }
    },

    _scrollRight: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        var scrollableWidth = getOption.call(this, 'scrollableWidth') ||
                              this._contentParent.innerWidth();
        var currentPos = this._contentParent.scrollLeft();
        this._contentParent
            .trigger("focus")
            .filter(':not(:animated)')
            .animate({scrollLeft: currentPos + scrollableWidth}, this.animateDuration, 'swing',
                $.proxy(function () {this.view.triggerMethod('update:scroll:controls')}, this));
      }
    },

    _bindControlsUpdatingEvents: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        this._contentParent.attr('tabindex', 1);
        this._contentParent.on('keydown', $.proxy(function (e) {
          switch (e.which) {
          case 37:  // left arrow key
            this.view.triggerMethod('scroll:left');
            break;
          case 39:  // right arrow key
            this.view.triggerMethod('scroll:right');
            break;
          }
        }, this));

        $(window).on('resize', $.proxy(function () {this._updateScrollControls();}, this));
      }
    },

    _unbindUpdateControlsEvents: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        this._contentParent.off('keydown');
        $(window).off('resize');
      }
    }
  });

  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ScrollControlsBehavior;
});
