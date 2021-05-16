/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/perspective.manage/impl/options.form.view',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'csui/models/widget/widget.collection',
  'hbs!csui/perspective.manage/impl/widget.item',
  'hbs!csui/perspective.manage/impl/widget.drag.template'
], function (module, _, $, Backbone, Marionette, base, PerfectScrollingBehavior,
    WidgetOptionsFormView, Lang,
    WidgetCollection,
    WidgetItemTemplate, WidgetDragTemplate) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    dragImageOffsetTop: 50,
    dragImageOffsetLeft: 50,
  });

  var WidgetItemView = Marionette.ItemView.extend({

    constructor: function WidgetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    className: 'csui-module-group',

    template: WidgetItemTemplate,

    templateHelpers: function () {
      var widgetCollection = new Backbone.Collection(this.model.attributes.widgets);
      var dndContainer = $('.perspective-editing .csui-dnd-container');
      var draggable = dndContainer.length === 0;
      return {
        widgets: widgetCollection.models,
        draggable: draggable
      }
    },

    ui: {
      accordionHeader: '.csui-accordion-header',
      accordionContent: '.csui-accordion-content',
      accordionHeaderIcon: '.csui-accordion-header .cs-icon',
      widget: '.csui-widget-item'
    },

    events: {
      'click @ui.accordionHeader': "toggle",
      'dragstart @ui.widget': 'onDragStart',
      'dragend @ui.widget': 'onDragEnd'
    },

    toggle: function () {
      var isClosed = this.ui.accordionHeader.hasClass('csui-accordion-expand');
      this.ui.accordionHeader.toggleClass("csui-accordion-expand");
      this.options.parentView.$el.find(".csui-module-group").removeClass('csui-accordion-visible')
          .find('.csui-accordion-header').removeClass('csui-accordion-expand');
      if (!isClosed) {
        this.$el.addClass("csui-accordion-visible");
        this.ui.accordionHeader.addClass("csui-accordion-expand");
      }

      base.onTransitionEnd(this.ui.accordionContent, function () {
        this.trigger('widgets:expanded');
      }, this);
    },

    onRender: function () {
      var dndContainer = $('.perspective-editing .csui-dnd-container');
      if (dndContainer.length) {
        this._makeWidgetSortable();
      } else {
        var hasDragDropNative = (typeof document.createElement("span").dragDrop === "function");
        if (!this._hasNativeDragImageSupport() && hasDragDropNative) {
          this.ui.widget.on("mousedown", this._handleDragImageForIE.bind(this));
        }
      }
    },

    _makeWidgetSortable: function () {
      var self = this;
      var widgetEls = this.$el.find('.csui-widget-item').parent();
      widgetEls.data('pman.widget', this.model.get('widgets'));
      widgetEls.sortable({
        connectWith: [".perspective-editing .csui-dnd-container",
          ".perspective-editing .pman-trash-area"],
        containment: ".perspective-editing ",
        helper: function (event, ui) {
          var widgetModel = ui.parent().index();
          self.widgetDragTemplate = new widgetDragTemplateView({
            title: self.model.get("widgets")[widgetModel].get('title'),
            newWidget: self.model.get("widgets")[widgetModel]
          });
          self.widgetDragTemplate.render();
          self.widgetDragTemplate.$el.width('220px');
          self.widgetDragTemplate.$el.height('220px');
          self.widgetDragTemplate.$el.css({opacity: 0.75});
          self.widgetDragTemplate.$el.appendTo(
              self.options.parentView.$el.closest('.pman-pannel-wrapper'));
          return self.widgetDragTemplate.$el;
        },     
        tolerance: 'pointer',
        cursorAt: {top: config.dragImageOffsetTop, left: config.dragImageOffsetLeft},
        start: function (event, ui) {
          ui.item.css('display', 'block');
          ui.placeholder.css('display', 'block');
          self.dragStart();
        },
        stop: function () {
          self.dragEnd();
        }
      });
    },

    _handleDragImageForIE: function (e) {
      var originalEvent = e.originalEvent,
          $img          = $('.csui-template-wrapper').clone(),
          widget        = this.model.get("widgets")[$(e.currentTarget).parent().index()];
      $img.find(".csui-template-header").text(widget.get("title"));
      $img.css({
        "top": Math.max(0, originalEvent.pageY - config.dragImageOffsetTop) + "px",
        "left": Math.max(0, originalEvent.pageX - config.dragImageOffsetLeft) + "px",
        "position": "absolute",
        "pointerEvents": "none"
      }).appendTo(document.body);

      setTimeout(function () {
        $img.remove();
      });
      $img.on('dragstart', _.bind(function (event) {
        var widget       = this.model.get("widgets")[$(e.currentTarget).parent().index()],
            dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setData("text", JSON.stringify(widget.toJSON()));
        this.dragStart();
      }, this));
      $img.on('dragend', _.bind(function (event) {
        this.dragEnd();
      }, this));
      $img[0].dragDrop();
    },

    onDragStart: function (event) {
      var widget       = this.model.get("widgets")[$(event.currentTarget).parent().index()],
          dataTransfer = event.originalEvent.dataTransfer;
      var template = $('.csui-template-wrapper');
      template.find(".csui-template-header").text(widget.get("title"));
      if (this._hasNativeDragImageSupport()) {
        dataTransfer.setData("text", JSON.stringify(widget.toJSON()));
        dataTransfer.setDragImage(template[0], config.dragImageOffsetLeft,
            config.dragImageOffsetTop);
      }
      this.dragStart();
    },

    _hasNativeDragImageSupport: function () {
      var dataTransfer = window.DataTransfer || window.Clipboard;
      return ("setDragImage" in dataTransfer.prototype);
    },

    onDragEnd: function (event) {
      this.dragEnd();
    },

    dragStart: function () {
      this.$el.closest(".csui-pman-panel").addClass("csui-pman-drag-start");
      $(document.body).addClass('csui-pman-dnd-active');
    },

    dragEnd: function () {
      this.$el.closest(".csui-pman-panel").removeClass("csui-pman-drag-start");
      $(document.body).removeClass('csui-pman-dnd-active');
    }

  });

  var widgetDragTemplateView = Marionette.ItemView.extend({
    constructor: function WidgetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    className: 'csui-template-wrapper',

    template: WidgetDragTemplate,

    templateHelpers: function () {
      return {
        header: this.options && this.options.title,
        body: Lang.templateMessage

      }
    },
    onRender: function () {
      this.$el.data('pman.widget', this.options.newWidget);
    }
  });

  var WidgetListView = Marionette.ItemView.extend({
    tagName: 'div',

    template: WidgetItemTemplate,

    constructor: function WidgetListView(options) {
      options || (options = {});
      options.data || (options.data = {});

      Marionette.ItemView.call(this, options);

      var self = this;
      this.allWidgets = new WidgetCollection();
      this.allWidgets.fetch().done(function () {
        self.collection = self._groupWidgetsByModule();
        self.render();
        self.trigger("items:fetched");
      });
    },

    initialize: function () {
      _.bindAll(this, "renderItem");
    },

    className: 'cs-module-list',

    render: function () {
      this.collection && this.collection.each(this.renderItem);
    },

    renderItem: function (model) {
      var parentView = this;
      var itemView = new WidgetItemView({model: model, parentView: parentView});
      itemView.render();
      this.listenTo(itemView, 'widgets:expanded', _.bind(this.trigger, this, 'dom:refresh', this));
      $(this.el).append(itemView.el);
    },

    _groupWidgetsByModule: function () {
      var moduleCollection = new Backbone.Collection();
      var widgets = this.allWidgets.filter(function (widget) {
        var manifest = widget.get('manifest');
        if (!manifest || !_.has(manifest, 'title') || !_.has(manifest, 'description') ||
            manifest.deprecated) {
          return false;
        }
        var schema        = JSON.parse(JSON.stringify(manifest.schema || {})),
            options       = JSON.parse(JSON.stringify(manifest.options || {})),
            isValidSchema = WidgetOptionsFormView._normalizeOptions(
                schema.properties, options.fields || {}, {});
        if (!isValidSchema) {
          return false;
        }
        return true;
      });
      _.each(widgets, function (widget) {
        var manifest = widget.get('manifest')
        widget.set("title", (manifest && manifest.title) || Lang.noTitle);
      });

      _.each(_.groupBy(widgets, function (widget) {
        return widget.serverModule.id;
      }), function (val, key) {
        var title = _.first(val).serverModule.get('title');
        title = title ? title.replace(/OpenText /, '') : Lang.noTitle; // remove superfluous OpenText prefix
        moduleCollection.add({
          id: key,
          title: title,
          widgets: val
        })
      });
      return moduleCollection;
    },

    _sanitiseWidgetLibrary: function () {
    },

    onInitWidgets: function () {
      this.$el.empty(); // FIXME Make this ItemView as CollectionView 
      this.render();
    },

  });

  return WidgetListView;

});
