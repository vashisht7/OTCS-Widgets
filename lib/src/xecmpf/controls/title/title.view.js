/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'hbs!xecmpf/controls/title/impl/title',
  'css!xecmpf/controls/title/impl/title'
], function (_, $, Backbone, Marionette, template) {

  var TitleView = Marionette.ItemView.extend({

    className: 'title-wrapper',
    template: template,

    templateHelpers: function () {
      return {
        icon: this.options.icon,
        imageUrl: this.options.imageUrl,
        imageClass: this.options.imageClass,
        title: this.options.title
      }
    },

    constructor: function TitleView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }

  });

  return TitleView;

});

