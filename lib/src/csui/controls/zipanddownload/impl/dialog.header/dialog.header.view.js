/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/dialog/impl/header.view', 'csui/utils/base',
      'i18n!csui/controls/zipanddownload/impl/nls/lang',
      'hbs!csui/controls/zipanddownload/impl/dialog.header/impl/dialog.header',
      'css!csui/controls/zipanddownload/impl/dialog.header/impl/dialog.header'],
    function (_, DialogHeaderView, base, lang, template) {
      var HeaderView = DialogHeaderView.extend({
        template: template,
        templateHelpers: function () {
          return {
            title: this.options.title,
            itemCountExists: this.options.hasOwnProperty('itemsCount') &&
                             this.options.itemsCount > 0,
            itemsCount: this.options.hasOwnProperty('itemsCount') ?
                        _.str.sformat(
                            (this.options.itemsCount === 1 ? lang.itemCount : lang.itemsCount),
                            this.options.itemsCount): "",
            size: this.options.size ? base.formatFriendlyFileSize(this.options.size * 1024) : ''
          };
        },
        constructor: function HeaderView(options) {
          DialogHeaderView.prototype.constructor.call(this, options);
        }
      });
      return HeaderView;
    });