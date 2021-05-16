/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/base', 'csui/utils/node.links/node.links',
  'hbs!csui/controls/table/cells/name/impl/name',
  'i18n!csui/controls/table/impl/nls/lang',
  'css!csui/controls/table/cells/name/impl/name'
], function (_, TemplatedCellView, cellViewRegistry, base, nodeLinks, template, lang) {
  'use strict';

  var NameCellView = TemplatedCellView.extend({
        template: template,
        className: function () {
          var c = 'csui-truncate';
          if (base.isIE11()) {
            c += " csui-on-IE11";
          } else {
            c += " csui-not-on-IE11";
          }
          return c;
        },

        constructor: function NameCellView(options) {
          TemplatedCellView.prototype.constructor.apply(this, arguments);
          this.listenTo(this, 'before:render', function () {
            this.needsAriaLabel = !(this.options.column.defaultAction &&
                                    !this.model.get('inactive'));
          });
        },

        getValueData: function () {
          if (this.model && this.model.changed && this.model.changed.name) {
            this.model.set({OTName: this.model.changed['name']});
          }
          var column           = this.options.column,
              node             = this.model,
              name             = node.get(column.name),
              promoted         = this.model.get("bestbet") || this.model.get("nickname"),
              defaultActionUrl = nodeLinks.getUrl(node);
          return {
            defaultAction: column.defaultAction,
            defaultActionUrl: defaultActionUrl,
            contextualMenu: column.contextualMenu,
            name: name,
            nameAria: _.str.sformat(lang.nameAria, name),
            nameNoOpenAria: _.str.sformat(lang.nameNoOpenAria, name),
            inactive: node.get('inactive'),
            promoted: promoted && promoted.length > 0,
            promotedLabel: lang.promotedLabel
          };
        }
      },
      {
        widthFactor: 1.0,
        columnClassName: 'csui-table-cell-name',
        permanentColumn: true // don't wrap column due to responsiveness into details row
      }
  );

  cellViewRegistry.registerByColumnKey('OTName', NameCellView);
  return NameCellView;
});
