/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
      'csui/utils/perspective/perspective.util'],
    function (module, _, Backbone, PerspectiveUtil) {

      var DeltaGenerator = function (options) {
        this.personalization = options.personalization;
        this.perspective = options.perspective;
        if (this.perspective instanceof Backbone.Model) {
          this.perspective = this.perspective.toJSON();
        }
      };

      _.extend(DeltaGenerator.prototype, {
        getDeltaOfFlowPerspective: function (result) {
          var allPerspectiveWidgets = this.perspective.options.widgets,
              allPersonalWidgets    = this.personalization.options.widgets;

          allPerspectiveWidgets = _.reject(allPerspectiveWidgets, PerspectiveUtil.isPersonalWidget);
          var perspectiveWidgetIds = _.pluck(allPerspectiveWidgets, PerspectiveUtil.KEY_WIDGET_ID);
          var personalWidgets = _.filter(allPersonalWidgets, PerspectiveUtil.isPersonalWidget);
          var personalParts = _.partition(allPersonalWidgets, PerspectiveUtil.isHiddenWidget);
          var personalActiveWidgets = _.pluck(personalParts[1], PerspectiveUtil.KEY_WIDGET_ID);
          var personalHiddenWidgets = _.pluck(personalParts[0], PerspectiveUtil.KEY_WIDGET_ID);
          _.extend(result, {
            perspectiveWidgets: perspectiveWidgetIds,
            personalWidgets: personalWidgets,
            order: personalActiveWidgets,
            hidden: personalHiddenWidgets
          });
          return result;
        },

        getDelta: function () {
          var result = _.pick(this.perspective, 'type', 'perspective_id', 'perspective_version');
          result.perspective_id = result.perspective_id || this.perspective.id;
          if (this.perspective.override) {
            _.extend(result,
                _.pick(this.perspective.override, 'perspective_id', 'perspective_version'));
          } else {
            result.perspective_version = result.perspective_version || 1;
          }
          switch (this.personalization.type) {
          case 'flow':
            return this.getDeltaOfFlowPerspective(result);
          default:
            throw new Error('Personalization not supported.');
          }
        }
      });
      return DeltaGenerator;

    });