/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/handlebars',
  'csui/lib/marionette'
], function (Handlebars, Marionette) {

  TitleView = Marionette.ItemView.extend({

    template: Handlebars.compile('{{title}}'),

    templateHelpers: function () {
      return {
        title: this.model.get('title')
      }
    },
    constructor: function TitleView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }
  });

  return TitleView;
});