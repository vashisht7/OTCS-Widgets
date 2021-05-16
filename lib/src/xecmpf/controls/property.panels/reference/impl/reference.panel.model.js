/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'i18n!xecmpf/controls/property.panels/reference/impl/nls/lang'
], function (_, $, Backbone, lang) {
  'use strict';

  var ReferencePanelModel = Backbone.Model.extend({

    constructor: function ReferencePanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.set('id', 'conws-reference');
      this.set('title', lang.referenceTabTitle);
      
    }
    
  });

  return ReferencePanelModel;

});
