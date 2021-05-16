/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'css!conws/utils/overlay/impl/conwsoverlay'
], function ($, _,
    Marionette
) {

  var ConwsOverlay = Marionette.Controller.extend({
    
    constructor: function ConwsOverlay() {
      Marionette.Controller.prototype.constructor.apply(this, arguments);
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
    ),

    _hidePresentationView : function() {
      if (this.options.onHidePresentationView) {
        this.options.onHidePresentationView(this.modalContent);
      }

      this.modalWrapper.detach();
      this.presentationView.$el.detach();
      this.presentationView.$el.removeClass('conws-overlay-panel');
      this.modalContent.removeClass('conws-overlay-showing');
    },

    _showOtherView: function() {
      this.modalContent.find(">:not(.conws-overlay-wrapper)").show();
      if (this.options.onShowOtherView) {
        this.options.onShowOtherView(this.modalContent);
      }
    },

    _hideOtherView: function () {
      if (this.options.onHideOtherView) {
        this.options.onHideOtherView(this.modalContent);
      }
      this.modalContent.find(">:not(.conws-overlay-wrapper)").hide();
    },

    _showPresentationView : function() {
      
      this.modalContent = $(this.options.presentationRoot);
      this.modalContent.addClass('conws-overlay-beforeshow');
      if (!this.presentationView) {
        this.presentationView = this.options.presentationView;
        this.presentationView.render();
      }

      this.presentationView.$el.addClass("conws-overlay-panel");

      this.modalWrapper = $('<div class="conws-overlay-wrapper"></div>');
      this.modalContent.append(this.modalWrapper);
      this.modalWrapper.append(this.presentationView.$el);

      if (this.options.onShowPresentationView) {
        this.options.onShowPresentationView(this.modalContent);
      }
      this.presentationView.$el.position();

      this.presentationView.triggerMethod('dom:refresh');

      var that = this;
      this.presentationView.$el.one(this._transitionEnd(), function () {
        that.modalContent.removeClass("conws-overlay-animating");
        that.modalContent.addClass('conws-overlay-showing');
        that._hideOtherView();
      });
      this.modalContent.addClass('conws-overlay-animating');
      this.modalContent.removeClass('conws-overlay-beforeshow');
    },

    show: function() {
      this._showPresentationView();
    },

    close: function() {
      this._showOtherView();
      this._hidePresentationView();
    }

  });

  return ConwsOverlay;
});
