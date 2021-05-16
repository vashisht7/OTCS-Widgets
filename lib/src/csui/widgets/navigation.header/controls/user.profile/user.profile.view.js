/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/url',
  'csui/utils/log', 'csui/utils/base', 'csui/utils/commands',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/user',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolitem.view',
  'csui/widgets/navigation.header/profile.menuitems',
  'csui/widgets/navigation.header/profile.menuitems.mask',
  'csui/utils/user.avatar.color',
  'csui/controls/globalmessage/globalmessage',
  'hbs!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',
  'csui-ext!csui/widgets/navigation.header/controls/user.profile/user.profile.view',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',
  'csui/lib/jquery.binary.ajax'
], function (module, _, $, Backbone, Marionette, Url, log, base,
    commands, ConnectorFactory, UserModelFactory, TabableRegionBehavior,
    FilteredToolItemsCollection, ToolItemView, menuItems, MenuItemsMask, UserAvatarColor,
    GlobalMessage, template, menuHandlers, lang) {
  'use strict';

  log = log(module.id);

  var ProfileView = Marionette.CompositeView.extend({
    classname: 'binf-dropdown',

    template: template,

    templateHelpers: function () {
      var username = base.formatMemberName(this.model);

      return {
        profileMenuTitle: lang.profileMenuTitle,
        profileMenuAria: _.str.sformat(lang.profileMenuAria, username),
        profileImageAlt: _.str.sformat(lang.profileImageAlt, username),
        imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        initials: this.options.model.attributes.initials
      };
    },

    serializeData: function () {
      return {
        items: this.collection.toJSON()
      };
    },

    childView: ToolItemView,

    childViewContainer: '> .csui-profile-dropdown',

    ui: {
      userProfileMenu: '> .csui-profile-dropdown',
      userProfileMenuHandle: '> a',
      personalizedImage: '.csui-profile-image',
      defaultImage: '.csui-profile-default-image',
      profileDropdownToggler: '> .nav-profile'
    },

    events: {
      'keydown @ui.profileDropdownToggler': '_showDropdown',
      'keydown @ui.userProfileMenu': '_showDropdown',
      'focusout @ui.profileDropdownToggler': '_toggleDropdown',
      'focusout @ui.userProfileMenu': '_toggleDropdown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: '> .csui-acc-focusable',

    constructor: function ProfileView(options) {
      options || (options = {});
      this._ensureModels(options);

      Marionette.CompositeView.prototype.constructor.call(this, options);

      this.connector = this.options.context.getModel(ConnectorFactory);
      this.listenTo(this.model, 'change', this._refreshUser)
          .listenTo(options.context, 'sync error', this._refreshActions)
          .listenTo(this, 'render', this._displayUser)
          .listenTo(this, 'destroy', this._releasePhotoUrl)
          .listenTo(this, 'childview:toolitem:action', this._triggerMenuItemAction)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);
    },

    _ensureModels: function (options) {
      var context = options.context,
          user    = context.getModel(UserModelFactory);

      this.username = "ensured";

      this.staticMenuItems = menuItems.profileMenu.collection.toJSON();
      options.model = user;

      options.collection = new FilteredToolItemsCollection(
          menuItems.profileMenu, {
            status: {context: context},
            commands: commands,
            mask: new MenuItemsMask()
          });
    },

    _refreshUser: function () {
      if (this._isRendered && !this.isDestroyed) {
        this.render();
      }
    },

    _refreshActions: function () {
      if (this._isRendered && !this.isDestroyed) {
        if (menuHandlers) {
          var options  = {context: this.options.context},
              promises = _.chain(menuHandlers)
                  .flatten(true)
                  .map(function (menuHandler) {
                    return menuHandler(options);
                  })
                  .value(),
              self     = this;
          $.whenAll
              .apply($, promises)
              .always(function (dynamicMenuItems) {
                var mask = new MenuItemsMask();
                dynamicMenuItems = _.chain(dynamicMenuItems)
                    .flatten()
                    .pluck('profileMenu')
                    .flatten()
                    .value();
                dynamicMenuItems = self.staticMenuItems.concat(dynamicMenuItems);
                dynamicMenuItems = mask.maskItems(dynamicMenuItems);
                menuItems.profileMenu.reset(dynamicMenuItems);
              });
        } else {
          this.collection.refilter();
        }
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      this.ui.profileDropdownToggler.binf_dropdown('toggle');
      this._executeAction(args.toolItem);
    },

    _executeAction: function (toolItem) {
      var signature = toolItem.get('signature'),
          command   = commands.findWhere({signature: signature}),
          context   = this.options.context,
          status    = {
            context: context,
            toolItem: toolItem,
            data: toolItem.get('commandData')
          },
          self      = this;
      try {
        if (!command) {
          throw new Error('Command "' + signature + '" not found.');
        }

        this.$el.addClass('binf-disabled');
        command.execute(status)
            .done(function (item) {
            })
            .fail(function (error) {
              if (error) {
                error = new base.Error(error);
                GlobalMessage.showMessage('error', error.message,
                    error.errorDetails);
              }
            })
            .always(function () {
              self.$el.removeClass('binf-disabled');
            });
      } catch (error) {
        log.warn('Executing the command "{0}" failed.\n{1}',
            command.get('signature'), error.message) && console.warn(log.last);
      }
    },

    _displayUser: function () {
      if (this.model.get('id')) {
        this._displayProfileImage();
        this._assignUserColor();
      }
    },

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      if (photoUrl) {
        var getPhotoOptions = {
          url: photoUrl,
          dataType: 'binary'
        };
        this.connector.makeAjaxCall(getPhotoOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                this._showPersonalizedImage(response);
              } else {
                this._showDefaultImage();
              }
            }, this));
      } else {
        this._showDefaultImage();
      }
    },

    _getUserPhotoUrl: function () {
      var connection = this.connector.connection,
          cgiUrl     = new Url(connection.url).getCgiScript(),
          photoPath  = this.model.get('photo_url');
      if (photoPath && photoPath.indexOf('?') > 0) {
        return Url.combine(cgiUrl, photoPath);
      }
    },

    _showPersonalizedImage: function (imageContent) {
      this._releasePhotoUrl();
      this._photoUrl = URL.createObjectURL(imageContent);
      this.ui.defaultImage.addClass('binf-hidden');
      this.ui.personalizedImage.attr('src', this._photoUrl)
          .removeClass('binf-hidden');
      this.$el.parents().find('.esoc-userprofile-pic-actions img').length &&
      this.$el.parents().find('.esoc-userprofile-pic-actions img').trigger('focus');
    },

    _showDefaultImage: function (imageContent) {
      this._releasePhotoUrl();
      this.ui.personalizedImage.addClass('binf-hidden');
      this.ui.defaultImage[0].innerText = this.options.model.attributes.initials;
      this.ui.defaultImage.removeClass('binf-hidden');
      this.$el.parents().find(' span.esoc-full-profile-avatar-cursor').length &&
      this.$el.parents().find(' span.esoc-full-profile-avatar-cursor').trigger('focus');
    },

    _releasePhotoUrl: function () {
      if (this._photoUrl) {
        URL.revokeObjectURL(this._photoUrl);
        this._photoUrl = undefined;
      }
    },

    _closeToggle: function () {
      if (this.$el.hasClass('binf-open')) {
        this.ui.userProfileMenuHandle.trigger('click');
      }
    },

    _showDropdown: function (event) {
      var elms          = this.ui.userProfileMenu.find('> li > a'),
          index         = 0,
          activeElement = this.$el.find(document.activeElement);
      if (activeElement.length > 0) {
        index = elms.index(activeElement[0]);
        if (event.keyCode === 38 || event.keyCode === 40) {
          event.preventDefault();
          if (event.keyCode === 38) { // up arrow key
            index = index === -1 ? (elms.length - 1) : index - 1;
          }
          if (event.keyCode === 40) { // down arrow key
            index = index === (elms.length - 1) ? -1 : index + 1;
          }
          if (index === -1) {
            this.ui.profileDropdownToggler.trigger('focus');
          } else {
            $(elms[index]).trigger('focus');
          }
        } else if (event.keyCode === 27 &&
                   $(activeElement).closest('ul').is('.csui-profile-dropdown')) {
          event.stopPropagation();
          this.ui.profileDropdownToggler.trigger('click').trigger('focus');
        } else if (event.keyCode === 32 || event.keyCode === 13) {
          event.preventDefault();
          event.stopPropagation();
          $(activeElement).trigger('click');
        }
      }
    },

    _toggleDropdown: function (event) {
      var that = this;
      setTimeout(function () {
        if (!!document.activeElement.offsetParent &&
            !document.activeElement.offsetParent.classList.contains(
                'csui-profile-dropdown') &&
            document.activeElement !== that.ui.profileDropdownToggler[0] &&
            that.ui.userProfileMenu.is(':visible')) {
          $(that.ui.profileDropdownToggler).trigger('click');
        }
      }, 100);
    },

    _assignUserColor: function () {
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      this.ui.defaultImage.css("background", userbackgroundcolor);
    }
  });

  return ProfileView;
});
