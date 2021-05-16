/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/thumbnail/content/overview/overview.content',
  'csui/models/utils/v1tov2',
  'csui/controls/thumbnail/content/content.view',
  'csui/controls/thumbnail/content/name/name.view',
  'csui/controls/thumbnail/content/properties/properties.view',
  'csui/controls/thumbnail/content/node.state/node.state.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/controls/thumbnail/content/overview/impl/nls/localized.strings',
  'hbs!csui/controls/thumbnail/content/overview/impl/properties.overview'
], function (module, _, $, Backbone, Marionette, OverviewContent, v1tov2, DefaultContentView,
    NameView, PropertiesView, NodeStateView, PerfectScrollingBehavior, lang, template) {
  'use strict';
  var PropertiesOverview = Marionette.LayoutView.extend({
    className: 'csui-overview-container',
    template: template,
    templateHelpers: function () {
      return {
        columns: this.columnModels
      };
    },
    regions: {
      nameRegion: '.csui-thumbnail-overview-name',
      propertiesRegion: '.csui-thumbnail-overview-properties',
      nodeStateRegion: '.csui-thumbnail-overview-reserved'
    },
    events: {
      'keydown': 'onKeyInView'
    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-thumbnail-metadata-name-container',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    initialize: function () {
      this.propertiesCollection = this.getColumns();
      if (this.model.collection && this.model.collection.filters &&
          this.model.collection.filters.facet && this.model.collection.filters.facet.length &&
          !!this.model.get("parent_id_expand")) {
        this._showOrHideLocationColumn(true);
      } else {
        this._showOrHideLocationColumn();
      }
      var self = this, columnModels = [];
      if (this.propertiesCollection && this.propertiesCollection.models) {
        _.each(this.propertiesCollection.models, function (model, index) {
          var region = model.get("key");
          if (region === 'size') {
            !!self.getSizeValue(region) && columnModels.push(model);
          } else {
            self.model.get(region) !== undefined && columnModels.push(model);
          }
        });
      }
      this.columnModels = columnModels;
    },

    constructor: function PropertiesOverview(options) {
      options || (options = {});
      this.options = options;
      Marionette.LayoutView.prototype.constructor.call(this, options);
      var self = this;
      if (this.columnModels) {
        _.each(this.columnModels, function (model, index) {
          var region  = index,
              content = options.ContentFactory.getContentView(model);
          if (content) {
            self.addRegion(region, ".csui-thumbnail-overview-" + region);
          } else {
            self.addRegion(region, ".csui-thumbnail-overview-" + region);
          }
        }, this);
      }
    },

    getSizeValue: function (region) {
      var size_formatted = this.model.get(region + "_formatted");
      return size_formatted && size_formatted.split(" ")[0] != 0 ? size_formatted : 0;
    },

    getColumns: function () {
      var self = this,
          cols = [],
          properties;
      if (OverviewContent && OverviewContent.models) {
        this.fixedContent = OverviewContent.fixedOrRemovedOverviewContent;
        properties = OverviewContent.deepClone(); // use fresh collection every time
        properties.remove(
            properties.findWhere({key: 'properties'}));
        var columnModelsByKey = {}, clientNamingKey, serverNamingKey;
        this.options.columns.each(function (nodeColumnModel) {
          var key   = nodeColumnModel.get("column_key"),
              name  = nodeColumnModel.get("name"),
              order = nodeColumnModel.get("definitions_order");
          if (nodeColumnModel.get("isNaming") === true) {
            serverNamingKey = key;
          }
          columnModelsByKey[key] = nodeColumnModel;
          if (nodeColumnModel.get("type") && order) {
            var tableColumnToMergeWithServerColumn = properties.findWhere({key: key});
            if (tableColumnToMergeWithServerColumn) {
              if (tableColumnToMergeWithServerColumn.get('isNaming') === true) {
                clientNamingKey = tableColumnToMergeWithServerColumn.get("key");
              }
              var sequence = tableColumnToMergeWithServerColumn.get('sequence');
              var mergedColumnAttributes = _.extend({sequence: sequence},
                  nodeColumnModel.attributes);
              tableColumnToMergeWithServerColumn.set(mergedColumnAttributes);
            } else {
              nodeColumnModel.attributes.sequence = order;
              properties.add(nodeColumnModel.attributes);
            }
          }
          if (self.fixedContent.indexOf(key) >= 0) {
            properties.remove(
                properties.findWhere({key: key}));
          }
        }, this);
      }
      

      return properties;
    },

    _showOrHideLocationColumn: function (show) {
      var subType = this.options.collection && this.options.collection.node &&
                    this.options.collection.node.get('type');
      show = !!show || (!!subType && (subType === 899 || subType === 298));
      this.showParent = show;

      if (show) {
        if (!this.propertiesCollection.get('parent_id')) {
          this.propertiesCollection.add(
              {
                key: 'parent_id',
                title: lang.columnTitleLocation,
                column_key: "parent_id",
                name: lang.columnTitleLocation,
                displayLabel: true,
                displayIcon: true,
                sequence: 500
              }
              , {at: this.propertiesCollection.length});
        }
      } else {
        this.propertiesCollection.remove('parent_id');
      }
    },

    currentlyFocusedElement: function (event) {
      return this.$el.find(":focusable")[0];
    },

    onKeyInView: function (event) {
      if (event && event.keyCode === 27) {
        event.preventDefault();
        event.stopPropagation();
        var popoverTarget = this.$el.parents('body').find('.binf-popover');
        popoverTarget.parent().trigger('click');
      }
    },

    onRender: function (e) {
      var thumbnailHeaderView = this.options.originatingView &&
                                this.options.originatingView.thumbnail &&
                                this.options.originatingView.thumbnail.thumbnailHeaderView,
          self = this,
          popoverNameColumn = self.options.columns.where({isNaming: true}),
          nameValue = popoverNameColumn[0] ? popoverNameColumn[0].get("key") :
                      thumbnailHeaderView.getName();

      var nameView = new NameView({
        model: self.model,
        context: self.options.context,
        column: {name: nameValue, defaultAction: false},
        displayIcon: true
      });
      this.nameRegion.show(nameView);
      var modelsWithoutNamingKey = _.filter(this.columnModels,
          function (model) { return model.get("key") !== nameValue;});
      this.columnModels = modelsWithoutNamingKey;
      if (this.columnModels) {
        _.each(this.columnModels, function (model, index) {
          var content = this.options.ContentFactory.getContentView(model);
          content = content ? content : DefaultContentView;
          if (content) {
            var region       = index,
                displayLabel = true,
                displayIcon  = model.get("displayIcon"),
                column       = model.toJSON();
            column.title = column.name;
            column.name = column.key;
            var contentView = new content({
              tagName: 'DIV',
              contentModel: model,
              model: self.model,
              context: self.options.context,
              column: column,
              displayLabel: displayLabel,
              displayIcon: displayIcon
            });
            self[region].show(contentView);
            if (contentView.$el.find(".csui-thumbnail-value p").length > 0 &&
                contentView.$el.find(".csui-thumbnail-value p")[0].innerHTML === "") {
              contentView.$el.parent().addClass("binf-hidden");
            }
            self.listenTo(contentView, 'clicked:content', function (event) {
              self.trigger('clicked:content', {
                contentView: contentView,
                rowIndex: self._index,
                colIndex: index,
                model: self.model
              });
            });
          }
        }, this);
      }
      var propertiesView = new PropertiesView({
        model: self.model,
        context: self.options.context,
        column: {name: 'properties', defaultAction: true},
        displayIcon: true,
        selectedChildren: self.options.selectedChildren,
        collection: self.options.collection,
        originatingView: self.options.originatingView
      });
      this.propertiesRegion.show(propertiesView);
      var nodeStateView = new NodeStateView({
        model: self.model,
        context: self.options.context,
        column: {name: 'reserved', defaultAction: true},
        displayTitle: false,
        selectedChildren: self.options.selectedChildren,
        collection: self.options.collection,
        originatingView: self.options.originatingView,
        targetView: this
      });
      this.nodeStateRegion.show(nodeStateView);
    }

  });
  return PropertiesOverview;
});
