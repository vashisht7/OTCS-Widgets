/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/url',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles',
  'css!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles'
], function (_, $, Marionette, TabableRegionBehavior, Url, ListKeyboardBehavior, lang,
    childTemplate) {

  var ParticipantRolesItemView = Marionette.ItemView.extend({

    tagName: 'li',

    template: childTemplate,

    templateHelpers: function () {
      return {
        removeRole: lang.rolesDialogRemoveRole,
        name: this.model.get('name'),
        id: this.model.get('id')
      };
    },

    events: {
      'click .remove': 'onRemoveOnClick',
      'keydown .binf-alert': 'onRemoveOnKeyDown'
    },

    constructor: function ParticipantRoleView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRemoveOnClick: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.triggerMethod('remove:role', {model: this.model});
    },

    onRemoveOnKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 46) {
        e.preventDefault();
        e.stopPropagation();
        this.triggerMethod('remove:role', {model: this.model});
      }
    }
  });

  var ParticipantRolesListView = Marionette.CollectionView.extend({

    tagName: 'ul',

    childView: ParticipantRolesItemView,
    events: {
      'keydown': 'onKeyDown'
    },
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior,
        currentlyFocusedElementSelector: 'li:nth-child({0}) .binf-alert'
      }
    },

    constructor: function ParticipantRolesListView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    onAddChild: function () {
      this.triggerMethod('refresh:tabindexes');
    },

    onRemoveChild: function () {
      this.triggerMethod('refresh:tabindexes');
    }
  });
  return ParticipantRolesListView;
});