/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/utils/url',
  'csui/controls/listitem/listitemstandard.view',
  'csui/utils/contexts/factories/user',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'esoc/widgets/userwidget/userwidget',
  'hbs!conws/widgets/team/impl/controls/listitem/impl/listitemteammember',
  'hbs!conws/widgets/team/impl/controls/listitem/impl/listitemteamrole',
  'css!conws/widgets/team/impl/controls/listitem/impl/listitemteammember'
], function ($, Url, StandardListItem, UserModelFactory, Avatar, UserWidget, memberTemplate,
    roleTemplate) {

  var TeamMemberListItem = StandardListItem.extend({

    tagName: 'div',

    className: 'conws-item-member ' + StandardListItem.prototype.className,

    events: {
      'keydown': 'onKeyDown'
    },

    triggers: {
      'click': 'click:item',
      'click @ui.userAvatar': 'click:profile',
      'click @ui.userProfileName': 'click:profile'
    },

    ui: {
      userProfileName: '.cs-name',
      userAvatar: '.conws-user-avatar'
    },

    constructor: function TeamMemberListItem(options) {
      options || (options = {});
      options.miniProfile = (options.miniProfile === undefined) ? true : false;
      options.context || (options.context = options.model.collection.context);
      StandardListItem.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    },

    getTemplate: function () {
      if (this.model.memberType === 'member') {
        return memberTemplate;
      } else {
        return roleTemplate;
      }
    },

    initialize: function () {
      this.avatar = new Avatar({model: this.model});
    },

    onRender: function () {
      if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
        var loggedUser            = this.options.context.getModel(UserModelFactory),
            defaultOptions        = {
              connector: this.model.connector,
              model: this.model,
              userid: this.model.get('id'),
              context: this.options.context,
              showUserProfileLink: true,
              showMiniProfile: this.options.miniProfile,
              loggedUserId: loggedUser.get('id')
            },
            userProfilePicOptions = $.extend({
              placeholder: this.$el.find(this.ui.userAvatar),
              showUserWidgetFor: 'profilepic'
            }, defaultOptions);
        UserWidget.getUser(userProfilePicOptions);

        var userWidgetOptions = $.extend({
          placeholder: this.$el.find(this.ui.userProfileName)
        }, defaultOptions);
        UserWidget.getUser(userWidgetOptions);
      }
      else {
        this.$el.find(this.ui.userAvatar).append(this.avatar.render().$el);
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.$('a').click();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  return TeamMemberListItem;
});
