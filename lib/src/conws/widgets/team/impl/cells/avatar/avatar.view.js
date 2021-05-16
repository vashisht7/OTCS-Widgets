/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/url',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/contexts/factories/user',
  'esoc/widgets/userwidget/userwidget',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/roles.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/avatar/impl/avatar',
  'css!conws/widgets/team/impl/cells/avatar/impl/avatar'
], function (Url, TemplatedCellView, cellViewRegistry, UserModelFactory, UserWidget, Avatar, ParticipantsTableColumnCollection,
    RolesTableColumnCollection, lang, template) {

  var AvatarCellView = TemplatedCellView.extend({

        template: template,

        events: {
          'keydown': 'onKeyDown'
        },

        onKeyDown: function (e) {
          if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            this.$('.esoc-user-profile-link').click();
          }
        },

        constructor: function AvatarCellView() {
          TemplatedCellView.apply(this, arguments);
          this.listenTo(this.model, 'change', this.render);
        },

        initialize: function () {
          this.avatar = new Avatar({model: this.model});
        },

        onRender: function () {
          if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
            var loggedUser            = this.model.collection.workspaceContext.getModel(UserModelFactory),
                userProfilePicOptions = {
                  connector: this.model.connector,
                  model: this.model,
                  userid: this.model.get('id'),
                  context: this.model.collection.workspaceContext,
                  showUserProfileLink: true,
                  showMiniProfile: true,
                  loggedUserId: loggedUser.get('id'),
                  placeholder: this.$el.find('.conws-avatar'),
                  showUserWidgetFor: 'profilepic'
                };
            UserWidget.getUser(userProfilePicOptions);
          }
          else {
            this.$('.conws-avatar').append(this.avatar.render().$el);
          }
        },

        getValueData: function () {
          return {
            participantStatus: lang.participantStateNew,
            type: this.model.getMemberType(),
            inherited: this.model.get('inherited_from_id') ? true : false,
            isNew: this.model.get('isNew') ? true : false
          };
        }

      },
      {
        hasFixedWidth: true,
        columnClassName: 'team-table-cell-avatar',
        noTitleInHeader: true
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.avatar,
      AvatarCellView);
  cellViewRegistry.registerByColumnKey(RolesTableColumnCollection.columnNames.avatar,
      AvatarCellView);

  return AvatarCellView;
});

