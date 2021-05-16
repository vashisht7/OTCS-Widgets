/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/utils/url',
  'csui/utils/base',
  'csui/utils/contexts/factories/user',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'esoc/widgets/userwidget/userwidget',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/role/impl/role.details.member',
  'css!conws/widgets/team/impl/dialogs/role/impl/role.details.member'
], function (_, $, Marionette, Handlebars, Url, Base, UserModelFactory, Avatar, UserWidget, lang,
    template) {

  var RoleDetailsMember = Marionette.ItemView.extend({

    template: template,

    tagName: 'li',

    className: 'conws-role-details-member',

    region: {
      avatar: '.conws-role-details-avatar'
    },

    ui: {
      userProfileName: '.member-name',
      userProfileImg: '.conws-role-details-avatar'
    },

    events: {
      'keydown': 'onKeyDown',
      'touchstart @ui.userProfileName': 'onTouchProfileName'
    },

    onKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        e.stopPropagation();
        this.$('.esoc-user-profile-link').click();
      }
    },

    onTouchProfileName: function (e) {
      this.$('.esoc-user-profile-link').click();
    },
    constructor: function RoleDetailsMember(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    initialize: function () {
      this.avatar = new Avatar({model: this.model});
    },

    onRender: function () {
      if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
        var loggedUser            = this.model.collection.context.getModel(UserModelFactory),
            defaultOptions        = {
              connector: this.model.connector,
              model: this.model,
              userid: this.model.get('id'),
              context: this.model.collection.context,
              showUserProfileLink: true,
              showMiniProfile: Base.isTouchBrowser() ? false : true,
              loggedUserId: loggedUser.get('id')
            },
            userProfilePicOptions = $.extend({
              placeholder: this.$el.find(this.ui.userProfileImg),
              showUserWidgetFor: 'profilepic'
            }, defaultOptions);
        UserWidget.getUser(userProfilePicOptions);

        var userWidgetOptions = $.extend({
          placeholder: this.$el.find(this.ui.userProfileName)
        }, defaultOptions);
        UserWidget.getUser(userWidgetOptions);
      }
      else {
        this.$('.conws-role-details-avatar').append(this.avatar.render().$el);
      }
    },
    templateHelpers: function () {
      var self = this;
      return {
        displayName: this.model.displayName(),
        email: this.model.displayEmail(),
        isUser: this.model.get('type') === 0
      };
    }
  });

  return RoleDetailsMember;
});
