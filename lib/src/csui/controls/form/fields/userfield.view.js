/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'csui/controls/form/fields/base/csformfield.view',
  'csui/controls/form/fields/typeaheadfield.view.mixin',
  'csui/controls/userpicker/userpicker.view',
  'i18n!csui/controls/form/impl/nls/lang',
  'css!csui/controls/form/impl/fields/userfield/userfield'
], function (require, _, $, base,
    FormFieldView, TypeaheadFieldViewMixin,
    UserPickerView,
    lang) {

  var UserFieldView = FormFieldView.extend({

    constructor: function UserFieldView(options) {

      $.extend(true,options||{}, {
        css: {
          root: 'cs-formfield cs-userfield',
          itemName: 'esoc-user-container cs-user-container-no-hover csui-hovering esoc-user-mini-profile',
          customImage: 'user-photo binf-img-circle',
          defaultIcon: 'user-default-image csui-icon image_user_placeholder csui-initials'
        },
        lang: {
          fieldReadOnlyAria: lang.userFieldReadOnlyAria,
          emptyFieldReadOnlyAria: lang.emptyUserFieldReadOnlyAria,
          noItem: lang.noOwner
        },
        noId: -3
      });

      options.createItemWidgetView = this.createUserWidgetView;
      options.TypeaheadPickerView = UserPickerView;

      FormFieldView.apply(this, arguments);
      this.makeTypeaheadFieldView(this.options);
    }

  });

  TypeaheadFieldViewMixin.mixin(UserFieldView.prototype);

  var original = _.extend({},UserFieldView.prototype);
  _.extend(UserFieldView.prototype, {

    onRender: function () {

      var data = this.model.get('data');
      this.onlyUsers = this.model.get("schema").type === "otcs_user_picker";
      
      var memberFilter = this.onlyUsers ? [0] : [0, 1];
      if (this.options.alpaca) {
        var typeControl = this.options.alpaca.options.type_control;
        if (_.has(typeControl, data.id)) {
          typeControl = this.options.alpaca.options.type_control[data.id];
        } else if (_.has(typeControl, '?')) {
          typeControl = this.options.alpaca.options.type_control['?'];
        }
        if (typeControl) {
          if (_.has(typeControl, 'parameters')) {
            memberFilter = typeControl.parameters.select_types;
          }
        }
      }

      $.extend(true,this.options, {
        lang: {
          alpacaPlaceholder: this.onlyUsers ? lang.alpacaPlaceholderOTUserPicker : lang.alpacaPlaceholderOTUserGroupPicker
        },
        pickerOptions: {
          memberFilter: { type: memberFilter }
        }
      });
      
      this.isGroup = (data.type === 1);
      this.ui.itemName.attr("title",this.isGroup ? this.ui.itemName.text().trim() : null);
      this._isUserWidgetEnabled = false; // is this really needed???

      original.onRender.apply(this,arguments);

    },

    _setCustomImage: function() {
      if (this.isGroup) {
        return;
      }
      original._setCustomImage.apply(this,arguments);
    },

    removeUnderline: function (e) {
      if (this.isGroup || this.data.id === -3) {
        return;
      }
      this.ui.customImage.removeClass("cs-user-photo-hover");
      this.ui.defaultIcon.removeClass("cs-user-photo-hover");
      this.ui.itemName.removeClass("cs-user-container-hover").addClass(
          "cs-user-container-no-hover");
    },

    showItemProfileDialog: function() {
      if (this.isGroup || this.data.id === -3) {
        return;
      }
      original.showItemProfileDialog.apply(this,arguments);
    },

    showItemProfileDialogWidget: function(e) {
      this.ui.customImage.addClass("cs-user-photo-hover");
      this.ui.defaultIcon.addClass("cs-user-photo-hover");
      this.ui.itemName.removeClass("cs-user-container-no-hover").addClass(
          "cs-user-container-hover");
      $('.esoc-mini-profile-popover').binf_popover('hide');
      this.getItemWidget().showUserProfileDialog(e);
    },

    showItemInfoPopup: function() {
      if (this.isGroup || this.data.id === -3) {
        return;
      }
      original.showItemInfoPopup.apply(this,arguments);
    },

    showItemInfoPopupWidget: function(e) {
      this.ui.customImage.addClass("cs-user-photo-hover");
      this.ui.defaultIcon.addClass("cs-user-photo-hover");
      this.ui.itemName.removeClass("cs-user-container-no-hover").addClass(
          "cs-user-container-hover");
      this.getItemWidget().showMiniProfilePopup(e);
    },

    createUserWidgetView: function (callback) {
      require(['esoc/controls/userwidget/userwidget.view'], _.bind(function (UserWidgetView) {
        var userWidgetView = new UserWidgetView({
          userid: this.data.id,
          context: this.options.context,
          baseElement: this.ui.membername,
          showUserProfileLink: true,
          showMiniProfile: true,
          loggedUserId: this.data.id,
          connector: this.connector
        });
        callback(userWidgetView);
      }, this));
    },

    _setDefaultIcon: function () {
      this.ui.customImage.addClass("esoc-userprofile-img-" + this.data.id);
      this.ui.defaultIcon.addClass("esoc-user-default-avatar-" + this.data.id);
      if (this.isGroup) {
        this._renderDefaultIcon('user-default-image csui-icon image_group_placeholder');
      } else {
        this._renderDefaultIcon('user-default-image csui-icon image_user_placeholder csui-initials');
      }
    }

  });
  var wrappee = _.extend({},UserFieldView.prototype);
  var old2new = {'showUserProfileDialog':'showItemProfileDialog','showMiniProfilePopup':'showItemInfoPopup'};
  var new2old = _.invert(old2new);
  _.extend(UserFieldView.prototype, {
    setUserWidget: function (methodName, e) {
      old2new[methodName] && wrappee.createItemWidget.call(this,old2new[methodName],e);
    },
    createItemWidget: function (methodName, e) {
      new2old[methodName] && this.setUserWidget(new2old[methodName],e);
    },
    setItemWidget: function(view) { this.userWidgetView = view; },
    getItemWidget: function() { return this.userWidgetView; },
    setItemPicked: function(state) { this.userPicked = state; },
    getItemPicked: function() { return this.userPicked; },
    className: 'cs-formfield cs-userfield',
    _setDefaultProfilePicture: function() { return wrappee._setDefaultIcon.apply(this,arguments); },
    _setDefaultIcon: function() { return this._setDefaultProfilePicture.apply(this,arguments); },
    _resolvePhoto: function() { return wrappee._resolveImage.apply(this,arguments); },
    _resolveImage: function() { return this._resolvePhoto.apply(this,arguments); },
    onUserPickerOpen: function() { return wrappee.onItemPickerOpen.apply(this,arguments); },
    onItemPickerOpen: function() { return this.onUserPickerOpen.apply(this,arguments); },
    onUserPickerClose: function() { return wrappee.onItemPickerClose.apply(this,arguments); },
    onItemPickerClose: function() { return this.onUserPickerClose.apply(this,arguments); },
    showUserProfileDialog: function() { return wrappee.showItemProfileDialog.apply(this,arguments); },
    showItemProfileDialog: function() { return this.showUserProfileDialog.apply(this,arguments); },
    showMiniProfilePopup: function() { return wrappee.showItemInfoPopup.apply(this,arguments); },
    showItemInfoPopup: function() { return this.showMiniProfilePopup.apply(this,arguments); }
  });

  return UserFieldView;
});
