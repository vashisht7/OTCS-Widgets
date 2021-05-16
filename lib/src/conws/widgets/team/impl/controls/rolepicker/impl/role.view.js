/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!conws/widgets/team/impl/controls/rolepicker/impl/role'
], function (_, $, Marionette, template) {

  var RoleView = Marionette.ItemView.extend({

    tagName: 'span',

    template: template,

    templateHelpers: function () {
      return {
        'name': this.model.get('name')
      };
    },

    constructor: function RoleView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });

  return RoleView;
});

