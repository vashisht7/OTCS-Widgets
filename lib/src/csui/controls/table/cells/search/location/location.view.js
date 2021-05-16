/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry', 'csui/models/node/node.model',
  'csui/utils/base', 'csui/utils/node.links/node.links',
  'csui/controls/node-type.icon/node-type.icon.view',
  'hbs!csui/controls/table/cells/search/location/impl/location',
  'i18n!csui/controls/table/impl/nls/lang',
  'csui/utils/defaultactionitems', 'csui/utils/commands',
  'csui/controls/table/cells/parent/impl/parent.with.icon.view',
  'csui/models/nodeancestors',
  'css!csui/controls/table/cells/search/location/impl/location'
], function ($, _, Backbone, Marionette, TemplatedCellView, cellViewRegistry, NodeModel, base,
    nodeLinks, NodeTypeIconView, template, lang, defaultActionItems, commands, ParentIconView,
    NodeAncestorCollection) {
  'use strict';

  var LocationCellView = TemplatedCellView.extend({
        template: template,
        className: 'csui-truncate',

        ui: {
          mimeType: '.csui-icon-type',
          location: '.csui-table-cell-location-div'
        },

        events: {
          'keydown': 'onKeyInView',
          'click @ui.location': 'onClickLocationItem'
        },

        constructor: function LocationCellView(options) {
          TemplatedCellView.prototype.constructor.apply(this, arguments);
          var self = this;
          this.listenTo(this, 'render', this._createNodeTypeIcon);
          this.listenTo(this, 'before:render', function () {
            this.needsAriaLabel = !(this.options.column.defaultAction && !this.model.get('inactive'));
          });
          this.listenTo(this.model, 'change:ancestors', function (args) {
            var name = self.getDisplayName(args),
                data = {
                  defaultAction: this.options.column.defaultAction,
                  defaultActionUrl: nodeLinks.getUrl(args),
                  location: name,
                  showLocation: true,
                  locationAria: _.str.sformat(lang.nameAria, name)
                },
                html = data ? self.template(data) : '';
            self.$el.html(html);
            self.parentNode = self.getParent(args);
            if (self.parentNode) {
              var iconView = new NodeTypeIconView({node: self.parentNode});
              if (self.$el.find(".csui-icon-type").length === 1) {
                self.cellRegion = new Marionette.Region({el: self.$el.find(".csui-icon-type")});
                self.cellRegion.show(iconView);
              }
            }
          });
          if (this.hasPromoted() && !this.model.get("ancestors")) {
            if (this.model.parent.get('id') > 0) {
              if (!this.model.attributes.ancestors ||
                  (this.model.attributes.ancestors && this.model.attributes.ancestors.length === 0)) {
                this.getAncestors(this.options, this.model).fetch().done(_.bind(function (response) {
                  this.model.attributes.ancestors = response.ancestors;
                  this.model.trigger("change:ancestors", this.model);
                }, this));
              }
            }
          }
        },

        hasBestBet: function () {
          return !!this.model.get('bestbet') && !!this.model.get('bestbet').length;
        },

        hasNickName: function () {
          return !!this.model.get('nickname') && !!this.model.get('nickname').length;
        },

        hasPromoted: function () {
          return !!this.hasBestBet() || !!this.hasNickName();
        },

        getAncestors: function (opts, model) {
          var node            = model,
              ancestorOptions = {node: node.parent, autofetch: false},
              newAncestors    = new NodeAncestorCollection(undefined, ancestorOptions);
          return newAncestors;
        },

        _createNodeTypeIcon: function () {
          if (this.parentNode && this.parentNode.get("id") >= 0) {
            var iconView = new NodeTypeIconView({node: this.parentNode});
            if (this.ui.mimeType && this.ui.mimeType.length > 0) {
              this.cellRegion = new Marionette.Region({el: this.ui.mimeType});
              this.cellRegion.show(iconView);
            }
          }
        },

        getValueData: function () {
          var column, name, node, defaultActionUrl;
          this.parentNode = this.getParent(this.model);
          column = this.options.column;
          name = this.getDisplayName(this.model);
          node = this.parentNode;
          defaultActionUrl = nodeLinks.getUrl(node);
          if (!!name) {
            this.model = this.parentNode;
          } else {
            this.parentNode = undefined;
          }
          return {
            defaultAction: column.defaultAction,
            defaultActionUrl: defaultActionUrl,
            location: name,
            showLocation: true,
            locationAria: _.str.sformat(lang.nameAria, name)
          };
        },

        getParent: function (model) {
          var parentExpand = model.get("parent_id_expand"),
              name         = this.getDisplayName(model),
              parentNode   = new NodeModel({
                id: !!parentExpand ? parentExpand.id : model.get("parent_id"),
                type: !!parentExpand ? parentExpand.type : this.getType(model),
                type_name: !!parentExpand ? parentExpand.type_name : this.getTypeName(model),
                mime_type: !!parentExpand ? parentExpand.mime_type : null,
                container: !!parentExpand ? parentExpand.container : this.isContainer(model),
                name: (name) ? name : ''
              }, {connector: model.connector});
          return parentNode;
        },

        getType: function (model) {
          var type = 0;
          if (model.get('ancestors') && model.get('ancestors').length) {
            type = model.get('ancestors')[model.get('ancestors').length - 1].type !== undefined ?
                   model.get('ancestors')[model.get('ancestors').length - 1].type :
                   model.get('ancestors')[model.get('ancestors').length - 1].get("type");
          }
          return type;
        },

        getTypeName: function (model) {
          var typeName = "";
          if (model.get('ancestors') && model.get('ancestors').length) {
            typeName = model.get('ancestors')[model.get('ancestors').length - 1].type_name ||
                       model.get('ancestors')[model.get('ancestors').length - 1].get(
                           "type_name");
          }
          return typeName;
        },

        isContainer: function (model) {
          var container = true;
          if (model.get('ancestors') && model.get('ancestors').length) {
            container = model.get('ancestors')[model.get('ancestors').length - 1].container ||
                        model.get('ancestors')[model.get('ancestors').length - 1].get(
                            "container");
          }
          return container;
        },

        getDisplayName: function (model) {
          var displayName = "";
          if (model.get('ancestors') && model.get('ancestors').length) {
            displayName = model.get('ancestors')[model.get('ancestors').length - 1].name ||
                          model.get('ancestors')[model.get('ancestors').length - 1].get(
                              "name");
          } else {
            displayName = base.formatMemberName(model.get("parent_id_expand"));
          }
          return displayName;
        },

        getValueText: function () {
          return this.getDisplayName(this.model);
        },

        getContentView: function () {
          if (!this.parentNode) {
            this.parentNode = this.getParent(this.model);
          }
          var iconView = new ParentIconView({
            model: this.parentNode,
            context: this.options.context
          });
          return iconView;
        },

        onClickLocationItem: function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (this.parentNode && this.parentNode.actions.length > 0) {
            this.options.tableView.triggerMethod('execute:defaultAction', this.parentNode);
          } else if (this.parentNode) {
            this.parentNode.resetCommands();
            this.parentNode.setCommands(defaultActionItems.getAllCommandSignatures(commands));
            var self = this;
            this.parentNode && this.parentNode.fetch().done(function () {
              self.options.tableView.triggerMethod('execute:defaultAction', self.parentNode);
            }).fail(function () {
              self.options.tableView.triggerMethod('execute:defaultAction',
                  self.options.model.parent);
            });
          }
        }
      },
      {
        columnClassName: 'csui-table-cell-location',
        permanentColumn: false // don't wrap column due to responsiveness into details row
      }
  );

  cellViewRegistry.registerByColumnKey('OTLocation', LocationCellView);

  return LocationCellView;
});