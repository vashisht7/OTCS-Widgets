/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette', 'i18n',
  'hbs!csui/controls/globalmessage/impl/loaderpanel/impl/loaderpanel',
  'css!csui/controls/globalmessage/impl/loaderpanel/impl/loaderpanel'
], function (_, $, Backbone, Marionette, i18n, template) {
  var LoaderPanelView = Marionette.ItemView.extend({
    template: template,
    templateHelpers: function () {
      return {label: this.options.label};
    },

    ui: {
      cancel: '.csui-loader-cancel'
    },  

    events: {
      'click @ui.cancel': 'cancelAndHide'
    },

    constructor: function LoaderPanelView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    cancelAndHide: function(event) {
      if (this.options.xhr && this.options.xhr.abort) {
        this.options.xhr.abort();   
      }      
      this.destroy(false);
    },

    doShow: function (relatedView, parentView, xhr) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
      this.doResize();
      this.$el.trigger('globalmessage.shown', this);
      this.ui.cancel.trigger('focus');
      this.updateXHRReference(xhr);
    },

    updateXHRReference: function(xhr) {
      if (xhr) {        
        this.options.xhr && this.options.xhr.abort();
        this.options.xhr = xhr;
      }
    },

    doResize: function () {
      if (this.options.sizeToParentContainer) {
        var minWidth = parseInt(this.$el.css('min-width'), 10);
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        this.uncompressedMinWidth || (this.uncompressedMinWidth = minWidth);
        if (this.uncompressedMinWidth > parentWidth) {
          this.$el.addClass('compressed');
        }
        else {
          this.$el.removeClass('compressed');
        }
        var newWidth = this.$el.width();
        var translateX = (parentWidth - newWidth) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    }
  });
  return LoaderPanelView;
});