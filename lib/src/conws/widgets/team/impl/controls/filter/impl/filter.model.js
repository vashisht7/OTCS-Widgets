/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone'
], function ($, _, Backbone) {

  var FilterModel = Backbone.Model.extend({

    defaults: {
      caption: '',
      tooltip: '',
      filter: '',
      active: true,
      showSearch: false
    },

    constructor: function FilterModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });
  return FilterModel;

});

