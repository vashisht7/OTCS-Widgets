/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/controls/list/behaviors/list.item.keyboard.behavior',
  'csui/utils/node.links/node.links',
  'csui/controls/listitem/impl/inline.menu/inline.menu.view',
  'csui/utils/accessibility',
  'hbs!csui/controls/listitem/impl/listitemstandard',
  'css!csui/controls/listitem/impl/listitemstandard'
], function (_, $, Marionette, DefaultActionBehavior, ListItemKeyboardBehavior, nodeLinks,
    InlineMenuView, Accessibility,
    itemTemplate) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var StandardListItem = Marionette.ItemView.extend({

    tagName: function () {
      return this.showInlineActionBar ? 'div' : 'a';
    },
    className: 'csui-item-standard binf-list-group-item',

    triggers: {
      'click': 'click:item'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      ListItemKeyboardBehavior: {
        behaviorClass: ListItemKeyboardBehavior
      }
    },

    template: itemTemplate,
    templateHelpers: function () {
      return _.reduce(this.options, function (result, name, key) {
        if (typeof name === 'string') {
          var value = this._getValue(name);
          if (key === 'icon') {
            value = 'csui-icon ' + value;
            result.enableIcon = true;
          }
          result[key] = value;
        }
        return result;
      }, {}, this);
    },

    constructor: function StandardListItem(options) {
      options || (options = {});
      if (!!options.toolbarData) {
        this._setInlineActions(options);
      }
      this.context = options.context;
      Marionette.ItemView.call(this, options);
    },

    _setInlineActions: function (options) {
      this.showInlineActionBar = true;
      this.tileViewToolbarItems = options.toolbarData.toolbaritems;
      this.triggers = {
        'click': 'click:item'
      };
      this.ui = {
        titleName: '.list-item-title',
        icon: '.csui-icon-group'
      };
      if (!accessibleTable) {
        this.events = {
          'mouseenter': 'onShowInlineMenu',
          'mouseleave': 'onHideInlineMenu',
          'wheel': 'onWheelEvent'
        };
      }

    },
    cascadeDestroy: function () {
      return false;
    },

    setElementData: function () {
      var elementData;
      if (this.showInlineActionBar) {
        elementData = this.$el.find("a");
      } else {
        elementData = this.$el;
        elementData.prop('tabindex', '-1');
      }
      return elementData;
    },

    onRender: function () {
      var id = this.model && this.model.get('id');
      this.eleData = this.setElementData();
      if (id != null) {
        this.eleData.attr('href', nodeLinks.getUrl(this.model));
      }

      if (this.model && this.options && this.options.checkDefaultAction) {
        var disabled = this.model.fetched === false ||
                       !this.defaultActionController.hasAction(this.model);
        this.$el[disabled ? 'addClass' : 'removeClass']('inactive');
      }
      this.$el.removeAttr('role'); // these roles on the <a are not valid html
    },

    _getValue: function (name) {
      if (name.indexOf('{') === 0) {
        var names = name.substring(1, name.length - 1).split('.'),
            value = this.model.attributes;
        _.find(names, function (name) {
          value = value[name];
          if (value === undefined) {
            return true;
          }
        });
        return value;
      }
      return name;
    },

    onShowInlineMenu: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.$el.addClass('csui-tile-with-more-btn');
      this._inlineMenuView = new InlineMenuView({
        context: this.options.context,
        originatingView: this,
        commands: this.defaultActionController.commands,
        model: this.model,
        tileViewToolbarItems: this.tileViewToolbarItems
      });

      var inlineBarElem = this.$el.find('.csui-tileview-more-btn'),
          inlineBarRegion = new Marionette.Region({el: inlineBarElem});
      inlineBarRegion.show(this._inlineMenuView);
      this.listenTo(this._inlineMenuView, 'before:execute:command', function(args){
        this.trigger('before:execute:command', args);
      });
      this.listenTo(this._inlineMenuView, 'after:execute:command', this.onHideInlineMenu);
    },

    onHideInlineMenu: function (event) {
      this.$el.removeClass('csui-tile-with-more-btn');
      if (this._inlineMenuView) {
        this._inlineMenuView.destroy();
        this._inlineMenuView = undefined;
        return true;
      }
    },

    onWheelEvent: function (event) {
      this._inlineMenuView && this._inlineMenuView.closeDropdownMenuIfOpen();
    }

  });

  return StandardListItem;
});

