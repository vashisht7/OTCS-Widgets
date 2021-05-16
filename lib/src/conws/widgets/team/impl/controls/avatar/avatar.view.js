/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/url',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/controls/avatar/impl/avatar',
  'css!conws/widgets/team/impl/controls/avatar/impl/avatar'
], function (_, $, Marionette, Url, lang, template) {

  var AvatarView = Marionette.LayoutView.extend({

    template: template,

    templateHelpers: function () {
      return {
        type: this.model.getMemberType()
      };
    },

    ui: {
      profileImage: '.participant-picture > img',
      profileImageDefault: '.participant-picture > span'
    },
    constructor: function AvatarView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      this._displayProfileImage();
    },

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      this.ui.profileImage.addClass("esoc-userprofile-img-" + this.model.get('id'));
      if (photoUrl) {
        var getPhotoOptions = this.model.connector.extendAjaxOptions({
          url: photoUrl,
          dataType: 'binary'
        });
        this._releasePhotoUrl();
        this.model.connector.makeAjaxCall(getPhotoOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                this.photoUrl = URL.createObjectURL(response);
                this.ui.profileImage.attr("src", this.photoUrl);
                this.ui.profileImageDefault.remove();
              } else {
                this.ui.profileImage.remove();
                this.ui.profileImageDefault.addClass(this._getPlaceholderImageClass());
              }
            }, this));
      } else {
        this.ui.profileImage.remove();
        this.ui.profileImageDefault.addClass(this._getPlaceholderImageClass());
      }
    },

    _getUserPhotoUrl: function () {
      var connection = this.model.connector.connection,
          cgiUrl     = new Url(connection.url).getCgiScript(),
          memberId   = this.model.get('id'),
          photoId    = this.model.get('photo_id');
      if (photoId) {
        var photoPath = _.str.sformat('api/v1/members/{0}/photo?v={1}', memberId, photoId);
        return Url.combine(cgiUrl, photoPath);
      }
    },

    _getPlaceholderImageClass: function () {
      return (this.model.getMemberType() === 'user')
          ? 'conws-avatar-user-placeholder'
          : (this.model.getMemberType() === 'group')
                 ? 'conws-avatar-group-placeholder'
                 : 'conws-avatar-role-placeholder';
    },

    _releasePhotoUrl: function () {
      if (this.photoUrl) {
        URL.revokeObjectURL(this.photoUrl);
      }
    }
  });

  return AvatarView;

});
