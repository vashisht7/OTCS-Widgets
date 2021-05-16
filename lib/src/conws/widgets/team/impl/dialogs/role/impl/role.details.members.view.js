/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'conws/widgets/team/impl/dialogs/role/impl/role.details.member.view',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, ListKeyboardBehavior, MemberView,
    lang) {

  var RoleDetailsMembersList = Marionette.CollectionView.extend({
    className: 'conws-role-details-members-list',
    childView: MemberView,
    tagName: 'ul',

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
    filterModel: {},
    constructor: function RoleDetailsMembersList(options) {
      options || (options = {});
      this.collection = options.model;
      this.filterModel = options.filterModel;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    initialize: function () {
      this.listenTo(this.filterModel, 'change', this.render);
      this.listenTo(this.filterModel, 'change:filter', function () {
        this.selectedIndex = 0;
      });
    },

    addChild: function (child, ChildView, index) {
      if (!_.isUndefined(this.filterModel)) {
        var filter = this.filterModel.get('filter');
        if (!_.isUndefined(filter) && filter.length > 0) {
          var name = child.displayName().toLowerCase();
          if (name.indexOf(filter.toLowerCase()) < 0) {
            return; // do not render this item
          }
        }
      }
      Marionette.CollectionView.prototype.addChild.apply(this, arguments);
    }
  });

  return RoleDetailsMembersList;
});
