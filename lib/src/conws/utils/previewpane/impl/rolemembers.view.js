/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/list/emptylist.view',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/teamtables.view',
  'csui/utils/nodesprites',
  'conws/widgets/team/impl/controls/listitem/listitemteammember.view',
  'i18n!conws/utils/previewpane/impl/nls/previewpane.lang',
  'hbs!conws/utils/previewpane/impl/rolemembers.empty',
  'css!conws/utils/previewpane/impl/previewpane'
], function (_, $, Marionette, ListView, EmptyView, LimitingBehavior, ExpandingBehavior,
    HeaderModelFactory, TeamCollectionFactory,
    TeamTablesView, NodeSpriteCollection, ListItem, lang, RoleMembersEmptyTemplate) {
  var RoleMembersEmptyView = Marionette.ItemView.extend({

    constructor: function RoleMembersEmptyView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: RoleMembersEmptyTemplate
  });
  var RoleMembersView = Marionette.CollectionView.extend({

    constructor: function RoleMembersView(options) {
      options || (options = {});
      options.data || (options.data = {});
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    getEmptyView: function () {
      return EmptyView;
    },

    emptyViewOptions: function () {
      return {
        templateHelpers: {
          text: this.options.noRoleMembersMessage
        }
      }
    },

    childView: ListItem,

    childViewOptions: function () {
      return {
        templateHelpers: function () {
          return {
            name: this.model.get('display_name'),
            email: this.model.get('business_email'),
            isUser: this.model.get('type') === 0,
            stage: {
              value: this.model.getLeadingRole(),
              label: this.model.getRolesIndicator()
            }
          }
        },
        context: this.options.context,
        miniProfile: false
      }
    },

    childEvents: {
      'click:profile': 'onClickProfile'
    },

    onClickProfile: function (view, data) {
      this.triggerMethod('click:member', data);
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    }
  });

  return RoleMembersView;

})
;
