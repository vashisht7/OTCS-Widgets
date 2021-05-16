/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'hbs!xecmpf/controls/dropdown/impl/dropdownitem'
], function (_, $, Backbone, Marionette,
    template) {

  var DropdownItemView;

  DropdownItemView = Marionette.ItemView.extend({

    className: 'dropdown-menu-item',

    tagName: 'li',

    constructor: function DropdownItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: template,

    triggers: {
      'click': 'click:item'
    },

    modelEvents: {
      'change': 'render'
    }
  });

  return DropdownItemView;
});
