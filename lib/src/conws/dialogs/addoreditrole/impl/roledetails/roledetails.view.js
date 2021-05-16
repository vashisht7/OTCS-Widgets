/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/models/form',
  'conws/dialogs/addoreditrole/impl/tabbable.form.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/dialogs/addoreditrole/impl/roleheader/roleheader.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/roledetails/impl/roledetails',
  'css!conws/dialogs/addoreditrole/impl/roledetails/impl/roledetails'
], function (_, $, Marionette, FormModel, TabbableFormView, LayoutViewEventsPropagationMixin, RoleHeaderView, TabableRegionBehavior, lang, template) {

  var RoleDetailsView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      HeaderRegion: '.conws-addoreditrole-roledetails-header',
      LeftRegion: '.conws-addoreditrole-roledetails-left',
      RightRegion: '.conws-addoreditrole-roledetails-right'
    },

    templateHelpers: {
    },

    triggers: {
      'keyup input': {
        event : 'required:field:changed',
        preventDefault: false,
        stopPropagation: false
      }
    },

    _createHeaderControl: function () {
      var roleHeaderView = new RoleHeaderView({
        headerViewoptions: this.options,
        currentStep: 'step1'
      });
      return roleHeaderView;
    },

    constructor: function RoleDetailsView(options) {
      options || (options = {});

      this.context = options.context;
      this.connector = options.connector;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'set:initial:focus', this.onSetInitialFocus);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var roleNameAndDescForm = {
        "data": {
          "role_name": this.options.addrole ? "" : this.options.name,
          "role_description": this.options.addrole ? "" : this.options.description
        },
        "options": {
          "fields": {
            "role_name": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.RoleName,
              "placeholder": lang.RoleNamePlaceholder,
              "readonly": false,
              "type": "text"
            },
            "role_description": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.RoleDesc,
              "placeholder": lang.RoleDescPlaceholder,
              "readonly": false,
              "type": "textarea"
            }
          },
          "label": ""
        },
        "schema": {
          "properties": {
            "role_name": {
              "maxLength": 42,
              "readonly": false,
              "required": true,
              "title": lang.RoleName,
              "type": "string"
            },
            "role_description": {
              "readonly": false,
              "required": false,
              "title": lang.RoleDesc,
              "type": "string",
              "maxLength": 450
            }
          },
          "type": "object"
        }
      },
        team_lead = this.options.addrole ? (this.options.isFirstRole ? true : false) : this.options.team_lead,
        TeamLeadForm = {
          "data": {
            "team_lead": team_lead
          },
          "options": {
            "fields": {
              "team_lead": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": lang.TeamLead,
                "readonly": team_lead ? true : false,
                "type": "checkbox"
              }
            },
            "label": ""
          },
          "schema": {
            "properties": {
              "team_lead": {
                "readonly": team_lead ? true : false,
                "required": false,
                "title": lang.TeamLead,
                "type": "boolean"
              }
            },
            "type": "object"
          }
        },
        roleNameAndDescFormView = new TabbableFormView({
          mode: 'create',
          model: new FormModel(roleNameAndDescForm)
        }),
        TeamLeadFormView = new TabbableFormView({
          mode: 'create',
          model: new FormModel(TeamLeadForm)
        });

      this.HeaderRegion.show(this._createHeaderControl());
      this.LeftRegion.show(roleNameAndDescFormView);
      this.RightRegion.show(TeamLeadFormView);

    },

    onAfterShow: function(){
     this.onSetInitialFocus();
    },

    onSetInitialFocus: function(){
      this.LeftRegion.currentView.$el.find("[data-alpaca-container-item-name='role_name'] input[type='text']").focus();
    }
  });
  _.extend(RoleDetailsView.prototype, LayoutViewEventsPropagationMixin);
  return RoleDetailsView;
});