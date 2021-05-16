/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.readonly.list',
  'css!conws/widgets/team/impl/cells/roles/impl/roles'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, ListKeyboardBehavior,
    lang, template) {

  var RolesReadOnlyList = Marionette.LayoutView.extend({

    template: template,

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior
      }
    },
    constructor: function RolesReadOnlyList(options) {
      this.selectedIndex = 0;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },
    templateHelpers: function () {
      return {
        roles: this.model.toJSON()
      }
    }
  });

  return RolesReadOnlyList;
});
