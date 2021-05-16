/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette',
  'csui/utils/thumbnail/thumbnail.object',
  'hbs!csui/utils/thumbnail/loading.thumbnail',
  'hbs!csui/utils/thumbnail/no.thumbnail',
  'hbs!csui/utils/thumbnail/thumbnail',
  'i18n!csui/utils/impl/nls/lang',
  'css!csui/utils/thumbnail/thumbnail'
], function (Marionette, Thumbnail,
    loadingThumbnail, noThumbnail, thumbnail, lang) {
  'use strict';

  var ThumbnailView = Marionette.ItemView.extend({

    className: 'csui-thumbnail',

    getTemplate: function () {
      var imgUrl = this.thumbnail.imgUrl;
      return imgUrl === undefined ? loadingThumbnail({loading: lang.Loading}) :
             imgUrl ? thumbnail : noThumbnail({notAvailable: lang.NotAvailalbe});
    },

    constructor: function ThumbnailView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.thumbnail = this.options.thumbnail || new Thumbnail({
        node: this.options.node
      });
      this.listenTo(this.thumbnail, 'loadUrl', this.render);
      this.listenTo(this.thumbnail, 'error', this.render);
      this.listenTo(this, 'render', function () {
        this.thumbnail.imgUrl === undefined && this.thumbnail.loadUrl();
      });
      this.listenTo(this, 'destroy', function () {
        this.thumbnail.destroy();
      });
    },

    serializeData: function () {
      return {
        imgUrl: this.thumbnail.imgUrl
      };
    }

  });

  return ThumbnailView;

});
