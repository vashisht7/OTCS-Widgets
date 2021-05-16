/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/error/error.view',
  'i18n!csui/behaviors/item.error/impl/nls/lang',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, ErrorView, lang) {
  'use strict';

  var ItemErrorBehavior = Marionette.Behavior.extend({

    constructor: function ItemErrorBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;
      var model = getBehaviorOption.call(this, 'model') ||
                  view.model || view.options.model;
      this._setupErrorHandling(model);

      var errorView = this.getOption('errorView');
      if (_.isFunction(errorView) &&
          !(errorView.prototype instanceof Backbone.View)) {
        errorView = errorView.call(view);
      }
      errorView || (errorView = ErrorView);
      var getTemplate = view.getTemplate,
          self        = this;
      view.getTemplate = function () {
        if (this.model && this.model.error) {
          var el = getBehaviorOption.call(self, 'el');
          if (typeof el !== 'string') {
            if (!getBehaviorOption.call(self, 'region')) {
              return false;
            }
          }
        }
        return getTemplate.apply(view, arguments);
      };

      var errorRegion;
      this.listenTo(view, 'render', function () {
        var error = this.model && this.model.error;
        if (error) {
          if (errorRegion) {
            errorRegion.empty();
          }
          errorRegion = getBehaviorOption.call(this, 'region');
          if (!errorRegion) {
            var el = getBehaviorOption.call(this, 'el') || view.el;
            if (typeof el === 'string') {
              el = view.$(el);
            }
            errorRegion = new Marionette.Region({el: el});
          }
          errorRegion.show(new errorView(
              _.extend({
                model: new Backbone.Model({
                  message: lang.itemCannotBeAccessed,
                  title: error.message
                })
              }, getBehaviorOption.call(this, 'errorViewOptions'))
          ));
        }
      })
          .listenTo(view, 'before:destroy', function () {
            if (errorRegion) {
              errorRegion.empty();
            }
          })
          .listenTo(view, 'update:model', this._setupErrorHandling);
    },

    _setupErrorHandling: function (model) {
      this.model && this.stopListening(this.model);
      this.model = model;
      this.listenTo(this.model, 'error', function () {
        this.view.render();
      });
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return ItemErrorBehavior;
});
