/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  "csui/lib/marionette",
  'i18n!conws/controls/inlineforms/workspace/impl/nls/lang',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/inlineform/impl/inlineform.view',
  "hbs!conws/controls/inlineforms/workspace/impl/workspace",
  "css!conws/controls/inlineforms/workspace/impl/workspace"
], function ($, _, Marionette, lang, inlineFormViewRegistry, InlineFormView, template) {

  var InlineFormWorkspaceView = InlineFormView.extend({

        className: function () {
          var className = "conws-inlineform-workspace";
          if (InlineFormView.prototype.className) {
            className += ' ' + _.result(InlineFormView.prototype, 'className');
          }
          return className;
        },

        template: template,

        templateHelpers: function () {
          var dataFromInlineFormView = this._templateHelpers();
          var data = _.extend(dataFromInlineFormView, {
            namePlaceholder: lang.NewWorkspacePlaceholder
          });
          return data;
        },

        ui: {},

        events: {},

        constructor: function InlineFormWorkspaceView(options) {
          this.options = options || {};
          this.ui = _.extend({}, this.ui, InlineFormView.prototype.ui);
          this.events = _.extend({}, this.events, InlineFormView.prototype.events);

          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        onDomRefresh: function () {
          this.ui.inputFieldName.select();
        },

        _saveIfOk: function () {
          this._viewToModelData();
          var name = this.model.get('name');
          if (name.length > 0) {
            this._save({name: name});
          }
        }

      },
      {
        CSSubType: 848  // Content Server Subtype of Workspace is 848
      }
  );

  inlineFormViewRegistry.registerByAddableType(
      InlineFormWorkspaceView.CSSubType,
      InlineFormWorkspaceView);

  return InlineFormWorkspaceView;
});
