/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/utils/base',
  'csui/utils/url',
  'csui/utils/nodesprites',
  'csui/utils/user.avatar.color',
  'hbs!csui/controls/typeaheadpicker/impl/typeaheaditem',
  'css!csui/controls/typeaheadpicker/impl/typeaheadpicker'
], function (_, $, Marionette, Handlebars, base, Url, nodeSpriteCollection, UserAvatarColor, template) {

  var TypeaheadItemView = Marionette.ItemView.extend({

    template: template,

    tagName: 'div',

    className: 'csui-typeaheadpicker-item',

    ui: {
      customImage: '.item-picture .csui-custom-image',
      defaultIcon: '.item-picture .csui-default-icon'
    },

    templateHelpers: function () {
      var moreHtml;
      if (this.options.hbs && this.options.hbs.itemMoreTemplate) {
        var moreData = this.options.hbs.itemMoreHelper ? this.options.hbs.itemMoreHelper.call(this) : this.model.attributes;
        moreHtml = this.options.hbs.itemMoreTemplate(moreData);
      }
      return {
        'name': this.formatItemName(this.model),
        'moreHtml': moreHtml,
        'disabled': this.model.get('disabled'),
        'disabled-message': this.options.disabledMessage,
        'lightWeight': !!this.options.lightWeight,
        'imageUrl': "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        cssItemName: this.options.css && this.options.css.itemName || 'name',
        cssCustomImage: this.options.css && this.options.css.customImage || 'csui-icon binf-img-circle',
        cssDefaultIcon: this.options.css && this.options.css.defaultIcon || 'csui-icon csui-initials image_typeahead_placeholder'
      };
    },

    formatItemName: function(model) {
      return this.options.formatItemName ? this.options.formatItemName(model) : base.formatMemberName(model);
    },

    constructor: function TypeaheadItemView(options) {
      options || (options = {});
      options.disabledMessage || (options.disabledMessage = '');

      if (options.css && options.css.root) {
        this.className = options.css.root;
      }
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      if (!this.options.lightWeight) {
        this._displayProfileImage();
      }
    },

    onDestroy: function () {
      this._releaseImageUrl();
    },

    _displayProfileImage: function () {
      this.ui.customImage.addClass("csui-typeahead-image-" + this.model.get('id'));
      var imageUrl  = this.model.get(this.model.imageAttribute||'image_url');
      if (imageUrl && imageUrl.indexOf('?') > 0) {
        var connection = this.options.connector.connection,
        cgiUrl = new Url(connection.url).getCgiScript();
        imageUrl = Url.combine(cgiUrl, imageUrl);
        var getImageOptions = {
          url: imageUrl,
          dataType: 'binary'
        };
        this._releaseImageUrl();
        this.options.connector.makeAjaxCall(getImageOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                this._releaseImageUrl();
                this._imageUrl = URL.createObjectURL(response);
                this.ui.customImage.attr("src", this._imageUrl);
                this.ui.defaultIcon.addClass('binf-hidden');
                this.ui.customImage.removeClass('binf-hidden');
          
              } else {
                this._releaseImageUrl();
                this._renderDefaultIcon(this.options.css && this.options.css.defaultIcon);
              }
            }, this));

      } else if (imageUrl && imageUrl.startsWith('data:image/')) {
        this.ui.customImage.attr("src", imageUrl);
        this.ui.defaultIcon.addClass('binf-hidden');
        this.ui.customImage.removeClass('binf-hidden');
  
      } else {
        this._releaseImageUrl();
        this._renderDefaultIcon(this.options.css && this.options.css.defaultIcon);
      }
    },

    _renderDefaultIcon: function (iconClass) {
      this.ui.defaultIcon.attr('class','csui-default-icon');
      this.ui.defaultIcon.addClass(iconClass||'csui-icon csui-initials image_typeahead_placeholder');
      if(this.ui.defaultIcon.hasClass('csui-initials')) {
        var initials = this.model.attributes.initials;
        var backgroundcolor;
        if (initials) {
          backgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
        } else {
          var name = this.model.attributes[this.model.nameAttribute||'name']||'';
          var ii = name.trim().indexOf(' ');
          initials = ii>0 ? name[0]+name[ii+1] : name.substring(0,2);
          backgroundcolor = UserAvatarColor.getUserAvatarColor({initials:initials});
        }
        this.ui.defaultIcon.text(initials);
        this.ui.defaultIcon.css("background-color", backgroundcolor);
      } else if (this.ui.defaultIcon.hasClass('csui-nodesprites')) {
        var exactNodeSprite = nodeSpriteCollection.findByNode(this.model);
        var exactClassName = exactNodeSprite && exactNodeSprite.get('className') || '';
        this.ui.defaultIcon.addClass(exactClassName);
        this.ui.defaultIcon.text('');
        this.ui.defaultIcon.css("background-color", '');
      } else {
        this.ui.defaultIcon.text('');
        this.ui.defaultIcon.css("background-color", '');
      }
      this.ui.customImage.addClass('binf-hidden');
      this.ui.customImage.attr("src","data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=");
    },

    _releaseImageUrl: function () {
      if (this._imageUrl) {
        URL.revokeObjectURL(this._imageUrl);
        this._imageUrl = undefined;
      }
    }

  });

  return TypeaheadItemView;
});
