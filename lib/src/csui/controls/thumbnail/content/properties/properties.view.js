/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/thumbnail/content/content.registry',
  'csui/utils/commands/properties',
  'csui/models/nodes',
  'hbs!csui/controls/thumbnail/content/properties/impl/properties',
  'i18n!csui/controls/thumbnail/content/properties/impl/nls/localized.strings'
], function ($, _, Marionette, ContentRegistry, PropertiesCommand, NodeCollection, template, lang) {
  'use strict';

  var ThumbnailPropertiesView = Marionette.LayoutView.extend({
    template: template,
    templateHelpers: function () {
      return {
        propertiesTitle: lang.propertiesTitle
      };
    },
    className: 'csui-thumbnail-properties-container',

    regions: {
      propertiesRegion: '.csui-thumbnail-properties'
    },

    ui: {
      propertiesButton: '.csui-btn-metadata'
    },

    events: {
      'click @ui.propertiesButton': 'showMetadataForm',
      'keydown': 'onKeyInView'
    },

    onKeyInView: function (event) {
      if (event.keyCode === 27) { //esc key
        event.preventDefault();
        event.stopPropagation();
        var $container = this.$el.parents('.binf-popover');
        $container.trigger('close:popover');
      }
    },

    constructor: function ThumbnailPropertiesView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    showMetadataForm: function (event) {
      if (this.ui.propertiesButton.hasClass('binf-disabled')) {
        return;
      }
      var nodes = new NodeCollection([this.model]);
      var status = {
        nodes: nodes,
        data: {},
        container: this.options.collection.node,
        context: this.options.context,
        collection: this.options.collection,
        showThumbnails: true
      };
      var self = this;
      this.ui.propertiesButton.addClass('binf-disabled');
      status = _.extend(status, {originatingView: this.options.originatingView});
      var propertiesCmd = new PropertiesCommand();
      propertiesCmd.execute(status, this.options)
          .always(function (args) {
            self.ui.propertiesButton.removeClass('binf-disabled');
            $('body').addClass('csui-apply-zero-zindex');
          });
          $('body').removeClass('csui-apply-zero-zindex');
    },

    cancel: function (options) {
      options || (options = {});
      this.destroy();
    }

  });
  ContentRegistry.registerByKey('properties', ThumbnailPropertiesView);
  return ThumbnailPropertiesView;
});