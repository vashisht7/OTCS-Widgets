/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  'csui/lib/marionette',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'hbs!csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu',
  'csui/lib/binf/js/binf'
], function ($, _, Backbone, Marionette, DropdownMenuBehavior, lang, Template) {
  'use strict';

  var DropdownMenuView = Marionette.ItemView.extend({

    className: "cs-dropdown-menu",
    template: Template,

    templateHelpers: function () {
      return {
        hasCommands: true,
        btnId: 123,
        showMoreTooltip: lang.showMore,
        showMoreAria: lang.showMoreAria
      };
    },
    regions: {
      contentRegion: ".binf-widgets"
    },

    ui: {
      dropdownToggle: '.binf-dropdown-toggle',
      dropdownMenu: '.binf-dropdown-menu',
      loadingIconsDiv: '.csui-loading-parent-wrapper'
    },

    behaviors: [
      {
        behaviorClass: DropdownMenuBehavior
      }
    ]
  });

  var dropdown = new DropdownMenuView({collection: new Backbone.Collection()});
  dropdown.render();
  $(document.body).append(dropdown.$el);
  var list = dropdown.$el.find('ul');
  list.append("<li>html</li>");
  list.append("<li>javascript</li>");
  list.append("<li>CSS</li>");

});