/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/contexts/factories/user',
  'conws/widgets/team/impl/participants.columns',
  'esoc/widgets/userwidget/userwidget',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/name/impl/name',
  'css!conws/widgets/team/impl/cells/name/impl/name'
], function (TemplatedCellView, cellViewRegistry, UserModelFactory,
    ParticipantsTableColumnCollection, UserWidget, lang, template) {

  var NameCellView = TemplatedCellView.extend({

        className: 'csui-truncate',
        template: template,

        ui: {
          userProfileName: '.csui-name'
        },

        events: {
          'dragstart @ui.userProfileName': 'onDrag',
          'keydown': 'onKeyDown'
        },

        onKeyDown: function (e) {
          if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            this.$('.esoc-user-profile-link').click();
          }
        },

        onRender: function () {
          if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
            var loggedUser        = this.options.context.getModel(UserModelFactory),
                userWidgetOptions = {
                  connector: this.model.connector,
                  userid: this.model.get('id'),
                  model: this.model,
                  context: this.options.context,
                  placeholder: this.$el.find(this.ui.userProfileName),
                  showUserProfileLink: true,
                  showMiniProfile: true,
                  loggedUserId: loggedUser.get('id')
                };
            UserWidget.getUser(userWidgetOptions);
          }
        },

        onDrag: function (e) {
          return false;
        },

        getValueData: function () {
          var value = this.model.get('display_name');
          return {
            value: value,
            formattedValue: value,
            isUser: this.model.get('type') === 0
          };
        }
      }
  );
  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.name,
      NameCellView);

  return NameCellView;
});

