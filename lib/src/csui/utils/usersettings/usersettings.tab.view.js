/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/handlebars',
    'csui/lib/marionette',
    'csui/models/form',
    'csui/models/forms',
    'csui/controls/form/form.view',
    'csui/utils/contexts/page/page.context',
    'csui/utils/usersettings/impl/usersettings.model',
    'i18n!csui/utils/usersettings/impl/nls/lang',
    'css!csui/utils/usersettings/impl/usersettingstab'
  ],
  function ($, _, Handlebars, Marionette, FormModel, FormCollection, FormView, PageContext, UserSettingsModel, lang) {
    "use strict";

    var UserSettingsTabView = Marionette.ItemView.extend({

      constructor: function (options) {
        this.model = new UserSettingsModel(options);
        Marionette.ItemView.prototype.constructor.apply(this);
        this.accessibleModeChanged = false;
      },

      tagName: 'div',
      template: false,

      getRawFormsData: function (state) {
        return {
          "forms": [{
            "data": {
              "accessibleMode": state
            },
            "options": {
              "fields": {
                "accessibleMode": {
                  "hidden": false,
                  "label": lang.accModeLabel,
                  "type": "checkbox",
                  "helper": lang.accModeText
                }
              }
            },
            "schema": {
              "properties": {
                "accessibleMode": {
                  "readonly": false,
                  "required": false,
                  "type": "boolean"
                }
              },
              "title": lang.accHeader,
              "type": "object"
            }
          }
          ]
        };
      },

      onRender: function () {
        this.model.fetch({
          prepare: false,
          async: false
        }); // TODO is sync the recommend way to do this?
        var accModeCheckedState = this.model.get('accessibleMode');
        var formModels = new FormCollection();
        formModels.reset(formModels.parse(this.getRawFormsData(accModeCheckedState)));

        var singleModel = new FormModel(formModels.models[0].attributes.forms[0]);

        var contentRegion = new Marionette.Region({
          el: this.el
        });

        var formView = new FormView({
          context: new PageContext(),
          model: singleModel,
          mode: "create"
        });

        formView.on("change:field", function (event) {
          this.model.set('accessibleMode', event.value);
          this.model.save();

          this.accessibleModeChanged = !this.accessibleModeChanged;
          var suw_view = this.$el.parents('div.esoc-simple-user-widget-view')[0];
          $(suw_view).toggleClass('csui-dialog-page-reload', this.accessibleModeChanged);
        }, this);

        contentRegion.show(formView);
      }

    });

    return UserSettingsTabView;

  });