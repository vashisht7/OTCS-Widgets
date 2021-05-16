/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/url', 'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/user.avatar.color',
  'esoc/widgets/userwidget/userprofile',
  'esoc/widgets/userwidget/util',
  'esoc/widgets/utils/chat/chat.view',
  'csui-ext!esoc/widgets/userprofile/tab.extension',
  'hbs!esoc/widgets/userwidget/impl/userprofile',
  'hbs!esoc/widgets/userwidget/impl/customchatbtn',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'css!esoc/widgets/userwidget/impl/userwidget.css'
], function (module, require, $, _, Handlebars, Marionette, Url, TabLinksScrollMixin, TabablesBehavior,
    TabableRegionBehavior, LayoutViewEventsPropagationMixin, UserAvatarColor, UserProfile, Util, ChatView, extraTabs,
    UserProfileTemplate, CustomChatBtnTemplate, lang) {
  var config = module.config();
  
  var self = null;
  var UserProfileTabContentCollectionView, UserProfileTabPanelView, UserProfileTabLinkCollectionView;
  var loadItems = function () {
    var deferred = $.Deferred();
    if (!!UserProfileTabContentCollectionView && !!UserProfileTabPanelView &&
        !!UserProfileTabLinkCollectionView) {
      deferred.resolve();
    } else {
      require(['csui/controls/tab.panel/tab.panel.view',
            'csui/controls/tab.panel/impl/tab.contents.view',
            'csui/controls/tab.panel/impl/tab.links.view'],
          function (TabPanelView, TabContentCollectionView,
              TabLinkCollectionView) {
            UserProfileTabContentCollectionView = TabContentCollectionView.extend({
              className: 'esoc-userprofile-widget',
              constructor: function UserProfileTabContentCollectionView(options) {
                options || (options = {});
                _.defaults(options, {
                  toolbar: true,
                  searchTabContentForTabableElements: true
                });
                TabContentCollectionView.prototype.constructor.apply(this, arguments);
              }
            });
            UserProfileTabPanelView = TabPanelView.extend({
              className: 'esoc-userprofile-widget',
              constructor: function UserProfileTabPanelView(options) {
                options || (options = {});
                _.defaults(options, {
                  toolbar: true,
                  searchTabContentForTabableElements: true
                });
                TabPanelView.prototype.constructor.apply(this, arguments);

              },
              behaviors: {
                TabableRegionBehavior: {
                  behaviorClass: TabableRegionBehavior
                }
              },
              currentlyFocusedElement: function (event) {
                var element = this.options.focusedElement;
                if (!event || !event.shiftKey) {
                  return this.$el.find("[data-cstabindex=0]")[0];
                } else if (element && $(element).length) {
                  return element;
                }
              },
              onLastTabElement: function (shiftTab) {
                var tabItems = this.$('[data-cstabindex=0]').filter(":visible"),
                    lastItem = tabItems.length - 1;
                if (tabItems.length) {
                  var focusElement = shiftTab ? tabItems[0] : tabItems[lastItem];
                  return $(focusElement).hasClass(TabableRegionBehavior.accessibilityActiveElementClass);
                }
                return true;
              }
            });
            UserProfileTabLinkCollectionView = TabLinkCollectionView.extend({
              className: 'esoc-userprofile-widget',
              constructor: function UserProfileTabLinkCollectionView(options) {
                options || (options = {});
                _.defaults(options, {
                  toolbar: true,
                  searchTabContentForTabableElements: true
                });
                TabLinkCollectionView.prototype.constructor.apply(this, arguments);
              }
            });
            deferred.resolve();
          }, deferred.reject);
    }
    return deferred.promise();
  };

  var UserProfileView = Marionette.ItemView.extend({
    className: 'esoc-userprofile-widget',
    template: UserProfileTemplate,
    util: Util,
    templateHelpers: function () {
              this.util.changeRelationsCounts(response.data.user);
            }
            else {
              if (miniprofileview.model.attributes.id === this.model.attributes.id) {
                this.model.attributes.following = miniprofileview.model.attributes.following;
                if (miniprofileview.model.attributes.following) {
                  $(".esoc-userprofile-following-action").html(lang.unfollow);
                  $(".esoc-userprofile-following-action").attr('title', lang.unfollow);
                } else {
                  $(".esoc-userprofile-following-action").html(lang.follow);
                  $(".esoc-userprofile-following-action").attr('title', lang.follow);
                }
                var ajaxParams = {
                  "itemview": self,
                  "url": self.userPulseInfoUrl,
                  "type": "GET",
                  "requestType": "pulseInfo"
                };
                self.util.updateAjaxCall(ajaxParams);
              }
            }
          });
    },
    events: {
      'click .esoc-user-profile-tab': 'showTab',
      'click .esoc-userprofile-following-action': 'followUnFollowAction',
      'click .esoc-update-profilepic': 'updateProfilePicAction',
      'touchend .esoc-update-profilepic': 'updateProfilePicAction',
      'click .esoc-full-profile-avatar-update': 'updateProfilePicAction',
      'keydown .esoc-full-profile-avatar-update': 'updateProfilePicAction',
      'touchend .esoc-full-profile-avatar-update': 'updateProfilePicAction'
    },
    constructor: function UserProfileView(options) {
      options = options || {};
      _.defaults(options, {
        toolbar: true,
        tabClickedOnce: false,
        initialActivationWeight: 0
      });
      this.options = options;
      this.listenToOnce(this, 'before:hide', TabablesBehavior.popTabableHandler);
      Marionette.ItemView.prototype.constructor.call(this, options);
      $(window).on('resize', _.bind(this._onWindowResize, this));
    },
    errorHandle: function (model, response) {
    },
    onDestroy: function () {
      var element = this.options.targetEle;
      if (element && $(element).is(':visible')) {
        $(element).trigger('focus');
      } else if (!element) {
        element = $('.nav-profile');
        if (element && element.length) {
          $(element).trigger('focus');
        }
      }
      $(window).off('resize', this._onWindowResize);
    },
    _onWindowResize: function () {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(_.bind(function () {
        this._enableToolbarState();
      }, this), 200);
    },
    _initializeOthers: function () {
      var options = {
        gotoPreviousTooltip: lang.previous,
        gotoNextTooltip: lang.next
      };
      this._initializeToolbars(options);
      this._listenToTabEvent();
      setTimeout(_.bind(this._enableToolbarState, this), 300);
    },
    onRender: function (e) {
      var that = this;
      that.options.userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      loadItems().done(function () {
        that.propagateEventsToRegions();
        var UserProfileTabPanelViewClass = new UserProfileTabPanelView(_.extend(that));
        UserProfileTabPanelViewClass.tabLinks = new UserProfileTabLinkCollectionView(_.extend(
            that));
        UserProfileTabPanelViewClass.tabContent = new UserProfileTabContentCollectionView(_.extend(
            that));
        UserProfileTabPanelViewClass.options = that.options;
        $.extend(that, UserProfileTabPanelViewClass);
        that.on("userprofileview.show.user.dialog", function (e) {
          that.options.userWidgetView.trigger('userwidgetview.show.user.dialog', e);
        });
        that._initializeOthers();
      });
    },

    tabItemsFocus: function (event) {
      this.options.focusedElement && this.options.focusedElement.removeClass(
          TabableRegionBehavior.accessibilityActiveElementClass);
      var target = $(event.target);
      target.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
      this.options.focusedElement = target;
      if (target.attr("type") === "radio") {
        target[0].checked = true;
      }
    },

    setTabIndexForTabs: function () {
      this.$el.find("a[href][title],*[tabindex] *[data-cstabindex]").filter(":visible").filter(
          ":not(a:empty)").attr("tabindex", "0").attr(
          "data-cstabindex", "0");
    },

    onAfterShow: function (e) {
      var self = this;
      this._initializeOthers();
      this.$el.find("#esoc-user-profile-general-tab").trigger('click');
      var userId                = !!this.model.id ? this.model.id : this.options.userid,
          userProfilePicOptions = {
            userid: userId,
            context: self.options.context,
            photoElement: self.$el.find(".esoc-userprofile-img-" + Util.escapeSelector(userId)),
            defaultPhotElement: self.$el.find(".esoc-user-default-avatar-" + Util.escapeSelector(userId)),
            userbackgroundcolor: this.options.userbackgroundcolor,
            parentView: this,
            viewShownEvent: true
          }
      self.util.commonUtil.setProfilePic(userProfilePicOptions);
      self.util.commonUtil.setUserColor(userProfilePicOptions); 
      if (this.options.model.attributes.otherUser && !this.options.model.attributes.deleted &&
          !!this.options.model.attributes.chatSettings &&
          !!this.options.model.attributes.chatSettings.chatEnabled) {
        var contentparams = {
          chat: lang.chat,
          labeltext: _.str.sformat(lang.chatlabeltext, this.options.model.attributes.name)
        };
        var contentRegion = new Marionette.Region({el: '#esoc-userprofile-chat-action'}),
            chatOptions   = {
              context: this.options.context,
              tguser: this.options.model.attributes.name,
              customtemplate: CustomChatBtnTemplate(contentparams),
              domain: this.options.model.attributes.chatSettings.chatDomain
            },
            chatView      = new ChatView(chatOptions);
        contentRegion.show(chatView);
      }
    },
    showTab: function (e) {
      UserProfile.showTab(e.currentTarget.id, "esoc-user-profile-tab-content",
          self.options, this);
    },

    followUnFollowAction: function (e) {
      var formData = new FormData();
      var followUnfollowAction = !this.model.attributes.following ?
                                 Util.commonUtil.globalConstants.FOLLOW :
                                 Util.commonUtil.globalConstants.UNFOLLOW;
      formData.append(Util.commonUtil.globalConstants.ACTION, followUnfollowAction);
      var args = {
        "itemview": this,
        "url": this.userProfileFollowingUrl,
        "type": "POST",
        "data": formData,
        "requestType": "userProfileFollowingAction",
        "targetElement": $(e.target)
      };
      this.util.updateAjaxCall(args);
    },
    updateProfilePicAction: function (e) {
      if (this.processKeyEvent(e)) {
        return;
      }
      var that            = this,
          profilepicInput = this.$el.find("#esoc-profilepic-desktop-attachment");
      profilepicInput.off("change").on("change", function (e) {
        if (profilepicInput.val().length > 0) {
          var formData = new FormData(),
              photo    = profilepicInput[0].files[0];
          if (photo) {
            formData.append("photo", photo);
          }
          that.$el.find(".esoc-userprofile-actions .esoc-full-profile-avatar").addClass(
              "esoc-profile-opacity");
          that.$el.find(".esoc-userprofile-actions .esoc-profile-img-load-container").addClass(
              "esoc-progress-display");
          var v2url      = that.options.connector.connection.url.replace('/v1', '/v2'),
              ajaxParams = {
                "itemview": that,
                "url": Url.combine(v2url,
                    that.util.commonUtil.REST_URLS.updatePhotoUrl),
                "type": "POST",
                "requestType": "updatePhoto",
                "data": formData,
                "targetElement": e.target,
                "connector": that.options.connector
              };
          that.util.commonUtil.updateAjaxCall(ajaxParams);
        }
      });
      e.preventDefault();
      profilepicInput.trigger("click");
    },
    processKeyEvent: function (e) {
      if (e.type === "keydown") {
        var keyCode = e.keyCode || e.which;
        if (keyCode !== 32 && keyCode !== 13) {
          return true;
        }
      }
      return false;
    },
    getExtraTabs: function (extraTabs) {
      var that = this;
      extraTabs = _.flatten(extraTabs, true);
      _.each(extraTabs, function (tab) {
        if (!!tab.tabCount) {
          tab.tabCount.count = tab.tabCount.getItemCount(that.model, that.options);
        }
        tab.show = true;
        if (!!tab.showTab) {
          tab.show = tab.showTab(that.model, that.options);
        }
      });
      return extraTabs;
    }
  });
  _.extend(UserProfileView.prototype, TabLinksScrollMixin);
  _.extend(UserProfileView.prototype, LayoutViewEventsPropagationMixin);
  return UserProfileView;
});
