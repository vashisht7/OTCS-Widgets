/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
      'csui/utils/perspective/perspective.util'],
    function (module, _, Backbone, PerspectiveUtil) {

      var DeltaResolver = function (options) {
        this.delta = options.delta;
        this.perspective = options.perspective;
        if (this.perspective instanceof Backbone.Model) {
          this.perspective = this.perspective.toJSON();
        }
      };

      _.extend(DeltaResolver.prototype, {

        resolveFlowPerspective: function (result) {
          var widgetOrder        = this.delta.order,
              personalWidgets    = this.delta.personalWidgets,
              hiddenWidgetIds    = this.delta.hidden,
              perspectiveWidgets = this.perspective.options.widgets;

          var personalWidgetsById = _.indexBy(personalWidgets, PerspectiveUtil.KEY_WIDGET_ID);
          var perspectiveWidgetsById = _.indexBy(perspectiveWidgets, PerspectiveUtil.KEY_WIDGET_ID);

          widgetOrder = _.filter(widgetOrder, function (widgetId) {
            return _.has(perspectiveWidgetsById, widgetId) || _.has(personalWidgetsById, widgetId);
          });

          hiddenWidgetIds = _.filter(hiddenWidgetIds, function (widgetId) {
            return _.has(perspectiveWidgetsById, widgetId) || _.has(personalWidgetsById, widgetId);
          });

          var newPerspectiveWidgets = _.filter(perspectiveWidgets, function (widget) {
            var widgetId = widget[PerspectiveUtil.KEY_WIDGET_ID];
            return !_.contains(widgetOrder, widgetId) && !_.contains(hiddenWidgetIds, widgetId);
          });

          var allActiveWidgets = _.map(widgetOrder, function (widgetId) {
            if (PerspectiveUtil.isPersonalWidgetId(widgetId)) {
              return personalWidgetsById[widgetId];
            } else {
              return perspectiveWidgetsById[widgetId];
            }
          });
          var hiddenWidgets = _.map(hiddenWidgetIds, function (widgetId) {
            var widget = _.clone(perspectiveWidgetsById[widgetId]);
            PerspectiveUtil.setWidgetHidden(widget, true);
            return widget;
          });
          var allWidgets = _.union(allActiveWidgets, newPerspectiveWidgets, hiddenWidgets);
          _.extend(result, {
            options: {widgets: allWidgets},
            personalizations: this.delta
          });
          return result;
        },

        canMergeDelta: function () {
          return this.perspective.perspectiveId === this.delta.perspectiveId &&
                 this.perspective.type === this.delta.type;
        },

        getPersonalization: function () {
          if (!this.canMergeDelta()) {
            return this.perspective;
          }
          var result = _.clone(this.perspective);
          switch (this.delta.type) {
          case 'flow':
            return this.resolveFlowPerspective(result);
          default:
            return result;
          }
        }
      });

      return DeltaResolver;

    });