
csui.define('css!conws/utils/icons/icons',[],function(){});
/**
 * Register custom icons
 */
csui.define('conws/utils/icons/icons',[
  'css!conws/utils/icons/icons'
], function (nodeSprites) {

  return [
    {
      equals: {type: 848},
      className: 'csui-icon conws-mime_workspace'
    },
    {
      equals: {type: 854},
      className: 'csui-icon conws-mime_related_workspace'
    },
    {
      equals: {type: 20541},
      className: 'csui-icon conws-doctemplates_volume'
    }
  ];
});
csui.define('conws/controls/inlineforms/workspace/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/controls/inlineforms/workspace/impl/nls/root/lang',{
  NewWorkspacePlaceholder: 'Enter new workspace name'
});



/* START_TEMPLATE */
csui.define('hbs!conws/controls/inlineforms/workspace/impl/workspace',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-inlineform-group csui-inlineform-group-error\">\r\n    <div class=\"binf-text-danger\">"
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-inlineform-group conws-inlineform-group-workspace-name\">\r\n  <input type=\"text\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.namePlaceholder || (depth0 != null ? depth0.namePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"namePlaceholder","hash":{}}) : helper)))
    + "\"\r\n         class=\"binf-form-control csui-inlineform-input-name\">\r\n  <button class=\"csui-btn-metadata binf-btn\"><span class=\"csui-icon icon-metadata\"></span></button>\r\n  <button class=\"csui-btn-save csui-btn binf-btn\">"
    + this.escapeExpression(((helper = (helper = helpers.SaveButtonLabel || (depth0 != null ? depth0.SaveButtonLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"SaveButtonLabel","hash":{}}) : helper)))
    + "</button>\r\n  <button class=\"csui-btn-cancel csui-btn binf-btn\">"
    + this.escapeExpression(((helper = (helper = helpers.CancelButtonLabel || (depth0 != null ? depth0.CancelButtonLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"CancelButtonLabel","hash":{}}) : helper)))
    + "</button>\r\n</div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.haveErrorMessage : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('conws_controls_inlineforms_workspace_impl_workspace', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/controls/inlineforms/workspace/impl/workspace',[],function(){});
/**
 * Created by stefang on 09.10.2015.
 */
csui.define('conws/controls/inlineforms/workspace/workspace.view',[
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

          // extend the base class ui and events hashes
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

csui.define('conws/controls/inlineforms/conwstemplate/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/controls/inlineforms/conwstemplate/impl/nls/root/lang',{
  NamePlaceholder: 'Enter name',
  WSTypePlaceholder: 'Select Workspace Type'
});


csui.define('conws/models/workspacetypes/workspacetype.model',[
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/utils/url'
  ], function (_, $, Backbone, Url) {
    
  
    var WSTypeModel = Backbone.Model.extend({
  
      constructor: function WSTypeModel(attributes, options) {
        Backbone.Model.prototype.constructor.apply(this, arguments);
        // Enable this model for communication with the CS REST API
        if (options && options.connector) {
          options.connector.assignTo(this);
        }
      },
  
      url: function () {
        var baseUrl = this.connector.connection.url.replace('/v1', '/v2'),
            getUrl  = Url.combine(baseUrl, 'businessworkspacetypes');
        return getUrl;
  
      },
  
      parse: function (response) {
        this.fetched = true;
        return {wstypes: response.results};
      },
  
      isFetchable: function () {
        return true;
      }
    });
  
    return WSTypeModel;
  
  }); 
  
csui.define('conws/models/workspacetypes/workspacetype.factory',[
    'module', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
    'conws/models/workspacetypes/workspacetype.model', 'csui/utils/commands'
  ], function (module, $, Backbone, ModelFactory, ConnectorFactory,
      wstypeModel, commands) {
    
  
    var WsTypeFactory = ModelFactory.extend({
      propertyPrefix: 'workspacetypes',
  
      constructor: function WsTypeFactory(context, options) {
        ModelFactory.prototype.constructor.apply(this, arguments);
  
        // Obtain the server connector from the application context to share
        // the server connection with the rest of the application; include
        // the options, which can contain settings for dependent factories
        var connector = context.getObject(ConnectorFactory, options);
        this.context = context;
        // Expose the model instance in the `property` key on this factory
        // instance to be used by the context
        this.property = new wstypeModel(options, {
          connector: connector
        });
      },
  
      isFetchable: function () {
        return this.property.isFetchable();
      },
  
      fetch: function (options) {
        return this.property.fetch(options);
      }
    });
  
    return WsTypeFactory;
  });
  

/* START_TEMPLATE */
csui.define('hbs!conws/controls/inlineforms/conwstemplate/impl/conwstemplate',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "hasError";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "    <select type=\"text\" value=\"\" class=\"binf-hidden-xs binf-hidden-sm binf-form-control conws-inlineform-input-wstype\">\r\n      <option value=\"\">"
    + this.escapeExpression(((helper = (helper = helpers.wsTypePlaceholder || (depth0 != null ? depth0.wsTypePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"wsTypePlaceholder","hash":{}}) : helper)))
    + "</option>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.wstypes : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </select>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <option value=\""
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.wksp_type_id : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.wksp_type_name : stack1), depth0))
    + "</option>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return " ";
},"8":function(depth0,helpers,partials,data) {
    return "binf-btn-default ";
},"10":function(depth0,helpers,partials,data) {
    return " disabled ";
},"12":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "    <select type=\"text\" value=\"\" class=\" binf-form-control conws-inlineform-input-wstype\">\r\n      <option value=\"\">"
    + this.escapeExpression(((helper = (helper = helpers.wsTypePlaceholder || (depth0 != null ? depth0.wsTypePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"wsTypePlaceholder","hash":{}}) : helper)))
    + "</option>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.wstypes : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </select>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-inlineform-group csui-inlineform-group-error\" role=\"alert\">\r\n  <div class=\"binf-text-danger\">"
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "</div>\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<form>\r\n  <div class=\"binf-hidden-md binf-hidden-lg hidden-xl hidden-xxl\r\n       conws-inlineform-vertical-spacer\"></div>\r\n  <div class=\"csui-inlineform-group csui-inlineform-group-conwstemplate\">\r\n\r\n    <input type=\"text\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.namePlaceholder || (depth0 != null ? depth0.namePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"namePlaceholder","hash":{}}) : helper)))
    + "\" class=\"binf-form-control csui-inlineform-input-name "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.validationFailed_Name : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n    \r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.createMode : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n    <button type=\"button\" class=\"binf-hidden-xs\r\n    binf-hidden-sm csui-btn-metadata binf-btn\">\r\n      <span class=\"icon icon-toolbar-metadata\"></span>\r\n    </button>\r\n    <button type=\"submit\" class=\"binf-hidden-xs\r\n    binf-hidden-sm csui-btn-save csui-btn binf-btn\r\n            "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disableSavebtn : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0)})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disableSavebtn : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.SaveButtonLabel || (depth0 != null ? depth0.SaveButtonLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"SaveButtonLabel","hash":{}}) : helper)))
    + "</button>\r\n    <button type=\"button\" class=\"binf-hidden-xs binf-hidden-sm csui-btn-cancel csui-btn binf-btn\r\n            binf-btn-default\">"
    + this.escapeExpression(((helper = (helper = helpers.CancelButtonLabel || (depth0 != null ? depth0.CancelButtonLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"CancelButtonLabel","hash":{}}) : helper)))
    + "</button>\r\n\r\n  </div>\r\n\r\n  <div class=\"binf-hidden-md binf-hidden-lg hidden-xl hidden-xxl\r\n       conws-inlineform-vertical-spacer\"></div>\r\n\r\n  <div class=\"binf-hidden-md binf-hidden-lg hidden-xl hidden-xxl csui-inlineform-group\r\ncsui-inlineform-group-conwstemplate-wrapped\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.createMode : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    <button type=\"button\" class=\"csui-btn-metadata binf-btn\">\r\n      <span class=\"icon icon-toolbar-metadata\"></span>\r\n    </button>\r\n    <button type=\"submit\" class=\"csui-btn-save csui-btn binf-btn\r\n            "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disableSavebtn : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0)})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disableSavebtn : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.SaveButtonLabel || (depth0 != null ? depth0.SaveButtonLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"SaveButtonLabel","hash":{}}) : helper)))
    + "</button>\r\n    <button type=\"button\" class=\"csui-btn-cancel csui-btn binf-btn binf-btn-default\">"
    + this.escapeExpression(((helper = (helper = helpers.CancelButtonLabel || (depth0 != null ? depth0.CancelButtonLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"CancelButtonLabel","hash":{}}) : helper)))
    + "</button>\r\n  </div>\r\n  <div class=\"binf-hidden-md binf-hidden-lg hidden-xl hidden-xxl\r\n       conws-inlineform-vertical-spacer\"></div>\r\n</form>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.haveErrorMessage : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('conws_controls_inlineforms_conwstemplate_impl_conwstemplate', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/controls/inlineforms/conwstemplate/impl/conwstemplate',[],function(){});
csui.define('conws/controls/inlineforms/conwstemplate/conwstemplate.view',[
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!conws/controls/inlineforms/conwstemplate/impl/nls/lang',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/inlineform/impl/inlineform.view',
  'conws/models/workspacetypes/workspacetype.factory',
  "hbs!conws/controls/inlineforms/conwstemplate/impl/conwstemplate",
  "css!conws/controls/inlineforms/conwstemplate/impl/conwstemplate"
], function (require, $, _, Marionette, lang, inlineFormViewRegistry, InlineFormView, WorkspaceTypeFactory, template) {

  var InlineFormConwsTemplateView = InlineFormView.extend({

    className: function () {
      var className = "conws-template-csui-inlineform";
      if (InlineFormView.prototype.className) {
        className += ' ' + _.result(InlineFormView.prototype, 'className');
      }
      return className;
    },

    template: template,

    templateHelpers: function () {
      var inlineFormViewData = this._templateHelpers();
      var data = _.extend(inlineFormViewData, {
        wstypes: this.wstypes ? this.wstypes.get('wstypes') : "",
        namePlaceholder: lang.NamePlaceholder,
        wsTypePlaceholder: lang.WSTypePlaceholder,
        createMode: this.createMode
      });
      return data;
    },

    ui: {
      wsTypeField: '.conws-inlineform-input-wstype'
    },

    events: {
      'change @ui.wsTypeField': 'keyReleased'
    },

    constructor: function InlineFormConwsTemplateView(options) {
      this.options = options || {};

      // extend the base class ui and events hashes
      this.ui = _.extend({}, this.ui, InlineFormView.prototype.ui);
      this.events = _.extend({}, this.events, InlineFormView.prototype.events);

      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.createMode = this.options.model.get("name") === "" ? true : false;

      if (this.createMode) {

        var wstypesfactory = this.options.context.getFactory("workspacetypes");
        // get the workspace types
        if (wstypesfactory && wstypesfactory.property && wstypesfactory.property.fetched) {
          this.wstypes = wstypesfactory.property;
        } else {
          this.wstypes = this.options.context.getModel(WorkspaceTypeFactory, {});
          this.wstypes.fetch();
          this.listenTo(this.wstypes, 'sync', this.render);
        }

      }
    },

    // Override base method to set additional model attribute(s)
    _viewToModelDataExtended: function () {
      if (this.createMode) {
        // setting additional attribute(s)
        this.model.set('reference_type', this._getWSTypeID(), { silent: true });
      }
    },

    toggleButton: function (event) {
      if (this.ui.saveButton.length) {
        var currentInputElementVal = this.ui.inputFieldName.val().trim(),
          enableAddButton = false;

        // check the name field.
        enableAddButton = currentInputElementVal.length !== 0;

        if (this.createMode) {
          // if applicable, check the workspacetype field.
          var wsTypeFieldInputElement = !!this.ui.wsTypeField ? this.ui.wsTypeField[0] : undefined;
          if (enableAddButton && !!wsTypeFieldInputElement) {
            var wstypeID = this._getWSTypeID();
            enableAddButton = wstypeID.length !== 0;
          }
        }

        if (enableAddButton) {
          this.ui.saveButton.prop("disabled", false).addClass("binf-btn-default");
        } else {
          this.ui.saveButton.attr("disabled", "disabled").removeClass("binf-btn-default");
        }
      }
      this.refershTabableElements();
    },

    _getWSTypeID: function () {
      var elInput = this.ui.wsTypeField;
      return $(elInput).val();
    },

    _saveIfOk: function () {
      this._viewToModelData();
      var name = this.model.get('name'),
        data = {},
        isValid = false;

      if (name.length > 0) {
        data.name = name;
        isValid = true;
      }
      if (this.createMode && isValid) {
        var wstypeID = this._getWSTypeID();

        if (wstypeID.length > 0) {
          data.reference_type = wstypeID;
        } else {
          isValid = false;
        }
      }
      if (isValid) {
        this._save(data);
      }
    }
  },
    {
      CSSubType: 848
    }
  );

  inlineFormViewRegistry.registerByAddableType(InlineFormConwsTemplateView.CSSubType, InlineFormConwsTemplateView);
  return InlineFormConwsTemplateView;
});

csui.define('conws/controls/form/fields/referencefield.states.behavior',[
    'csui/controls/form/impl/fields/csformfield.states.behavior'
], function (FormFieldStatesBehavior) {

    var ReferenceFieldStatesBehavior = FormFieldStatesBehavior.extend({

        constructor: function ReferenceFieldStatesBehavior(options, view) {
            FormFieldStatesBehavior.apply(this, arguments);

        },

        // Reference Field is Readonly field
        isReadOnly: function () {
            return true;
        }

    });

    return ReferenceFieldStatesBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!conws/controls/form/impl/fields/reference/reference',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasValue : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0)})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "			 <div class=\"btn-container reference-field-data\">\r\n				<button aria-labelledby=\""
    + this.escapeExpression(((helper = (helper = helpers.idBtnLabel || (depth0 != null ? depth0.idBtnLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idBtnLabel","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.refDataId || (depth0 != null ? depth0.refDataId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"refDataId","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"data","hash":{}}) : helper)))
    + "\">\r\n					<span id=\""
    + this.escapeExpression(((helper = (helper = helpers.refDataId || (depth0 != null ? depth0.refDataId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"refDataId","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"data","hash":{}}) : helper)))
    + "</span>\r\n				</button>\r\n			 </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "		<div class=\"reference-field-generate "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.generateReference : depth0),{"name":"if","hash":{},"fn":this.noop,"inverse":this.program(5, data, 0)})) != null ? stack1 : "")
    + "\">\r\n			<button id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.btnDesc || (depth0 != null ? depth0.btnDesc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"btnDesc","hash":{}}) : helper)))
    + "\" class=\"binf-btn binf-btn-primary reference-generate-number "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.generateReference : depth0),{"name":"if","hash":{},"fn":this.noop,"inverse":this.program(7, data, 0)})) != null ? stack1 : "")
    + "\" \r\n					title=\""
    + this.escapeExpression(((helper = (helper = helpers.genRefNumber || (depth0 != null ? depth0.genRefNumber : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"genRefNumber","hash":{}}) : helper)))
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.generateReference : depth0),{"name":"if","hash":{},"fn":this.noop,"inverse":this.program(9, data, 0)})) != null ? stack1 : "")
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.genRefNumber || (depth0 != null ? depth0.genRefNumber : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"genRefNumber","hash":{}}) : helper)))
    + "\r\n			</button>\r\n		</div>\r\n		<div class=\"reference-field-generate-read\">\r\n			<div class=\"reference-field-generate-text\">"
    + this.escapeExpression(((helper = (helper = helpers.depInlineText || (depth0 != null ? depth0.depInlineText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"depInlineText","hash":{}}) : helper)))
    + " </div>\r\n		</div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return " cursor-disabled ";
},"7":function(depth0,helpers,partials,data) {
    return " reference-generate-number-disabled ";
},"9":function(depth0,helpers,partials,data) {
    return " aria-disabled=\"true\" ";
},"11":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "   <div class=\"cs-field-read\">\r\n        <div class=\"cs-field-read-inner\">\r\n            <div class=\"btn-container\">\r\n				<button aria-labelledby=\""
    + this.escapeExpression(((helper = (helper = helpers.idBtnLabel || (depth0 != null ? depth0.idBtnLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idBtnLabel","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.refDataId || (depth0 != null ? depth0.refDataId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"refDataId","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"data","hash":{}}) : helper)))
    + "\">\r\n					<span id=\""
    + this.escapeExpression(((helper = (helper = helpers.refDataId || (depth0 != null ? depth0.refDataId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"refDataId","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"data","hash":{}}) : helper)))
    + "</span>\r\n				</button>\r\n            </div>\r\n        </div>\r\n    </div>   \r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.readOnly : depth0),{"name":"if","hash":{},"fn":this.noop,"inverse":this.program(12, data, 0)})) != null ? stack1 : "");
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.canRegenerateReference : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"13":function(depth0,helpers,partials,data) {
    var helper;

  return "			<div class=\"reference-field-generate-read\">\r\n				<button id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.btnDesc || (depth0 != null ? depth0.btnDesc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"btnDesc","hash":{}}) : helper)))
    + "\" class=\"binf-btn binf-btn-primary reference-generate-number\"\r\n						title=\""
    + this.escapeExpression(((helper = (helper = helpers.reGenRefNumber || (depth0 != null ? depth0.reGenRefNumber : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"reGenRefNumber","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.reGenRefNumber || (depth0 != null ? depth0.reGenRefNumber : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"reGenRefNumber","hash":{}}) : helper)))
    + "\r\n				</button>\r\n			</div>\r\n			<div class=\"reference-field-generate-read\">\r\n				<div class=\"reference-field-generate-text\">"
    + this.escapeExpression(((helper = (helper = helpers.depInlineText || (depth0 != null ? depth0.depInlineText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"depInlineText","hash":{}}) : helper)))
    + " </div>\r\n			</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"reference-field\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.create : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(11, data, 0)})) != null ? stack1 : "")
    + "</div>\r\n\r\n";
}});
Handlebars.registerPartial('conws_controls_form_impl_fields_reference_reference', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/controls/form/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/controls/form/impl/nls/root/lang',{
  genRefNumber: "Generate reference",
  reGenRefNumber: "Re-generate reference",
  depFieldsText: "Value can be generated automatically and depends on",
  rmClassificationText : "RM Classification",
  rmClassificationNameText : "Following RM classification will be used in reference generation:",
  independentFieldsText: "Value can be generated automatically"
});




csui.define('css!conws/controls/form/impl/fields/reference/reference',[],function(){});
csui.define('conws/controls/form/fields/reference.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/utils/url',
  'csui/controls/form/impl/fields/csformfield.editable.behavior',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/form/pub.sub',
  'conws/controls/form/fields/referencefield.states.behavior',
  'hbs!conws/controls/form/impl/fields/reference/reference',
  'i18n!conws/controls/form/impl/nls/lang',
  'css!conws/controls/form/impl/fields/reference/reference'
], function (_, $, Backbone, Marionette, FormFieldView, Url,
    FormFieldEditable2Behavior, ModalAlert, PubSub, ReferenceFieldStatesBehavior, template, lang) {
  

  var ReferenceFieldView = FormFieldView.extend({

    constructor: function ReferenceFieldView(options) {
      FormFieldView.apply(this, arguments);
      this.create = this.options.mode === "create" ? true : false;
      this.catId = this.options.dataId.split("_")[0];
      this.formView = this.options.alpacaField.connector.config.formView;
      this.node = !!this.formView.node ? this.formView.node:this.formView.model.node;
      this.connector = this.node.connector;
      this.generatereference = false;
      this.regenerateReference = false;
      this.parentsAttrDataChanged = false;
      this.parentattrIds = [];
      this.parentsattrData = [];
      this.canRegenerateReference = this.alpacaField.schema.canRegenerateReference;
      this.rmClassificationUsed = this.alpacaField.schema.rmClassificationUsed;
      this.rmClassificationsAttached = true;
      if (!!this.alpacaField.schema.oldReferenceAttributeID) {
          this.oldReferenceAttributeID = this.alpacaField.schema.oldReferenceAttributeID;
      }
      if( this.create ){
		  this.listenTo(this.formView, 'invalid:field', this.invalidFieldChange );
      }
      var attr;
      this.hasValue = this.alpacaField.data === null || this.alpacaField.data === undefined ||
                      this.alpacaField.data === "" ? false : true;
      if(!!this.alpacaField.schema.depattrlist) {
        _.each(this.options.alpaca.schema.depattrlist, function (parent) {
          this.parentattrIds.push(parent);
          attr = {id: parent, data: this.getAttrData(parent)};
          this.parentsattrData.push(attr);

          //We need to listen to parent events only when we are adding a category
		  //In the metadata page once the category is added, we don't need to listen to dependent attributes
		  if( this.create ) {
				this.listenTo(PubSub, parent + 'dependentattrchanged', this.parentChange);
		  }
		  
        }, this);
      }
      if (this.parentattrIds.length > 0) {
        this.checkReadyForGenerateReference();
      } else {
        if (!this.hasValue) {
          this.generatereference = true;
        }
      }

	  //We have to listen to RM model changes only when we are adding a category
      if (this.create && this.rmClassificationUsed && this.formView.model.collection) {
        this.listenTo(this.formView.model.collection, 'add',
            this.rmClassificationChange);
        this.listenTo(this.formView.model.collection, 'remove',
            this.rmClassificationChange);
        if (!this.formView.model.collection.get("recordsDetails")) {
          this.rmClassificationsAttached = false;
          this.generatereference = false;
          this.regenerateReference = false;
        }
      }
	  //If we are in metadata page, always enable re-generate reference
	  if( this.create === false ) {
		  this.regenerateReference = true;
	  }
	  this.idBtnLabel = this.options.labelId ? this.options.labelId : "";
	  this.refDataId = _.uniqueId('referenceData');
	  this.depFieldsText = this.getDependencyInlineText();
	  this.btnDesc = this.alpacaField.options.label + ", " + (this.hasValue ? lang.reGenRefNumber : lang.genRefNumber) + ", " + (this.canRegenerateReference ? this.depFieldsText : "");
    },
    className: 'cs-formfield cs-referencefield',
    template: template,
    templateHelpers: function () {
      return {
        create: this.create,
        generateReference: this.generatereference,
        data: this.curVal,
        hasValue: this.hasValue,
        readOnly: this.alpacaField.schema.readonly,
        depInlineText: this.depFieldsText,
        id: this.model && this.model.get('id') ? this.model.get('id') : _.uniqueId("button"),
        genRefNumber: lang.genRefNumber,
        reGenRefNumber: lang.reGenRefNumber,
        canRegenerateReference : this.canRegenerateReference,
		idBtnLabel: this.idBtnLabel,
		refDataId: this.refDataId,
		btnDesc: this.btnDesc
      };
    },
    behaviors: {
      FormFieldEditable: {
        behaviorClass: FormFieldEditable2Behavior
      },
      FormFieldStates: {
        behaviorClass: ReferenceFieldStatesBehavior
      }
    },
    events: {
      'click button.reference-generate-number': 'generateReferenceNumber'
    },
      getDependencyInlineText: function () {
          var dependencyInlineText = '';
          var rmClassName = '';
		  var rmClassData;
          if ( this.rmClassificationUsed && this.rmClassificationsAttached && this.formView.model.collection ) {
              if ( this.formView.model.collection.get("recordsDetails").options.className ) {
                  rmClassName = this.formView.model.collection.get("recordsDetails").options.className;
              } else if( this.formView.model.collection.get("recordsDetails").get("data")) {
				  rmClassData = this.formView.model.collection.get("recordsDetails").get("data");
				  if ( rmClassData.name ) {
					  rmClassName = this.formView.model.collection.get("recordsDetails").get("data").name;
				  } else if ( rmClassData.inherited_rmclassification_name ) {
						rmClassName = rmClassData.inherited_rmclassification_name[0];
				  }
				  // Enable below lines once LPU-9026 is resolved
				  //elseif(rmClassData.default_rmclassification_name) {
				  //  rmClassName = rmClassData.inherited_rmclassification_name[0];
				  //} 
              }
          }
          if (this.parentattrIds.length > 0) {
              dependencyInlineText = lang.depFieldsText + " " + this.alpacaField.schema.depattrtext;
              if (this.rmClassificationUsed) {
                  dependencyInlineText = dependencyInlineText + ", " + lang.rmClassificationText;
                  if (this.rmClassificationsAttached) {
                      dependencyInlineText = dependencyInlineText + ". " + lang.rmClassificationNameText + " " +
                          rmClassName;
                  }
              }
          } else if (this.rmClassificationUsed) {
              dependencyInlineText = lang.depFieldsText + " " + lang.rmClassificationText;
              if (this.rmClassificationsAttached) {
                  dependencyInlineText = dependencyInlineText + ". " + lang.rmClassificationNameText + " " +
                      rmClassName;
              }
          } else {
              dependencyInlineText = lang.independentFieldsText;
          }
          return dependencyInlineText;
      },
    generateReferenceNumber: function (event) {
      if (this.$el.find('button.reference-generate-number').attr('aria-disabled') === 'true') {
		return event.preventDefault();
	  }
	  var fullUrl;
      var connector = this.node.connector;
      var url = this.getV2Url(connector.connection.url);
      var self = this;
      var formData = this.getFormData();
      fullUrl = Url.combine(
          url + '/refnumbers');

      var ajaxOptions = {
        type: 'POST',
        url: fullUrl,
        data: formData,
        success: function (response, status, jXHR) {
          if (response.results.errMsg) {
            ModalAlert.showError(response.results.errMsg);
          }
          else {
            if (self.regenerateReference && !!self.oldReferenceAttributeID) {
              var oldReferenceElement = self.getAttrElement(self.oldReferenceAttributeID);
              /*
               * in case no oldReferenceElement is added to the widget,
               * oldReferenceElement will be undefined, so no UI change necessary.
               */
              if ( typeof oldReferenceElement !== 'undefined' ) {
                oldReferenceElement.setValue(self.curVal);
                oldReferenceElement.refresh();
              }
            }
            self.options.alpacaField.setValue(response.results.referenceNumber);
            self.hasValue = true;
            self.curVal = self.options.alpacaField.getValue();
            self.generatereference = false;
            //If we are in metadata page, always enable re-generate reference
            if (self.create === false) {
              self.regenerateReference = true;
            }
            self.parentsAttrDataChanged = false;
            if (!self.create) {
              var ele = self.$el.find('.reference-field .btn-container button');
              ele.find('span').text(self.curVal);
              ele.focus();
            } else {
              if (self.render(self.$el.find('.reference-field-data button').length > 0)) {
                self.$el.find('.reference-field-data button').focus();
              }
            }

            //Currently name re-generation is supported only for business workspaces
            if (!self.create && self.node.get("type") === 848) {
              if (self.formView.options.metadataView) {
                self.formView.options.metadataView.metadataHeaderView.metadataItemNameView.model.set(
                  "name", response.results.nodeName);
              } else {
                self.formView.options.node.set("name", response.results.nodeName)
              }
            }

          }
        },
        error: function (xhr, status, text) {
          var errorContent = xhr.responseJSON ?
                             ( xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                               xhr.responseJSON.error) : lang.defaultErrorGenerateNumber;
          ModalAlert.showError(errorContent);
        }
      };
      connector.extendAjaxOptions(ajaxOptions);
      connector.makeAjaxCall(ajaxOptions);
    },
    getV2Url: function (url) {
      return url.replace('/v1', '/v2');
    },
    invalidFieldChange: function(event) {

        var fieldId = document.getElementById(event.target.id).closest('.alpaca-container-item').getAttribute('data-alpaca-container-item-name');
        var self = this;

        _.each(this.options.alpaca.schema.depattrlist, function (depattr) {
            if (depattr === fieldId) {
                _.each(self.parentsattrData, function (element) {
                    if (element.id === fieldId) {
                        element.data = null;
                    }
                });
            }
        });

        var beforeChange = this.generatereference;

        this.checkReadyForGenerateReference();

        if (this.create) {
            this.regenerateReference = false;
        } else if (!this.hasValue) {
            this.generatereference = true;
        } else {
            this.generatereference = false;
        }

        if (beforeChange !== this.generatereference) {
            if (this.generatereference) {
                this.$el.find('button.reference-generate-number').removeClass('reference-generate-number-disabled').attr('aria-disabled', 'false');
            } else {
                this.$el.find('.reference-field-generate').addClass('cursor-disabled');
                this.$el.find('button.reference-generate-number').addClass('reference-generate-number-disabled').attr('aria-disabled', 'true');
            }
        }
    },
    parentChange: function (parent) {
      var that = parent;
	  var beforeParentChange = this.generatereference;
	  var afterParentChange;
      if (that !== this) {
        this.insertParentAttrData(parent);
        this.checkReadyForGenerateReference();
        if (this.create) {
          this.regenerateReference = false;
        } else if (!this.hasValue) {
          this.generatereference = true;
        } else {
          this.generatereference = false;
        }
		afterParentChange = this.generatereference;
		if ( beforeParentChange !== afterParentChange ) {
			if( this.generatereference ) {
				this.$el.find('button.reference-generate-number').removeClass('reference-generate-number-disabled').attr('aria-disabled', 'false');
			}else {
				this.$el.find('.reference-field-generate').addClass('cursor-disabled');
				this.$el.find('button.reference-generate-number').addClass('reference-generate-number-disabled').attr('aria-disabled', 'true');
			}
		}
      }

    },
    rmClassificationChange: function () {
	  var beforeParentChange = this.generatereference;
	  var afterParentChange;
      if (this.formView.model.collection && this.formView.model.collection.get("recordsDetails")) {
        this.rmClassificationsAttached = true;
        if (this.create) {
          this.generatereference = true;
        } else {
          this.regenerateReference = true;
        }
      } else {
        this.rmClassificationsAttached = false;
        this.generatereference = false;
        this.regenerateReference = false;
      }
	  this.checkReadyForGenerateReference();
	  var depFieldsText = this.getDependencyInlineText();
	  var btnDesc = this.alpacaField.options.label + ", " + (this.hasValue ? lang.reGenRefNumber : lang.genRefNumber) + ", " 
					+ (this.canRegenerateReference ? depFieldsText : "");
	  this.$el.find('.reference-field .reference-field-generate-read .reference-field-generate-text').text(depFieldsText);
	  this.$el.find('button.reference-generate-number').attr('aria-label',btnDesc);
      afterParentChange = this.generatereference;
	  if ( beforeParentChange !== afterParentChange ) {
		if( this.generatereference ) {
			this.$el.find('.reference-field-generate').removeClass('cursor-disabled');
			this.$el.find('button.reference-generate-number').removeClass('reference-generate-number-disabled').attr('aria-disabled', 'false');
		}else {
			this.$el.find('.reference-field-generate').addClass('cursor-disabled');
			this.$el.find('button.reference-generate-number').addClass('reference-generate-number-disabled').attr('aria-disabled', 'true');
		}
	  }
    },
    checkReadyForGenerateReference: function () {
      var count = 0;
      _.each(this.parentsattrData, function (attr) {
        if (attr.data !== undefined && attr.data !== null && attr.data !== "") {
          count++;
        }
      });
        if (count === this.parentsattrData.length) {
            if (this.create && this.hasValue) {
                this.generatereference = false;
                this.regenerateReference = false;
            } else {
                if (this.rmClassificationsAttached) {
                    if (this.create) {
                        this.generatereference = true;
                        this.regenerateReference = false;
                    }
                    else if (this.parentsAttrDataChanged) {
                        this.regenerateReference = true;
                    } else {
                        this.generatereference = true;
                    }
                } else {
                    this.generatereference = false;
                    this.regenerateReference = false;
                }
            }
        }
      else {
        this.generatereference = false;
        this.regenerateReference = false;
      }

    },
    insertParentAttrData: function (parent) {
      var self = this;
      var parentData = parent.curVal;
      _.each(self.parentsattrData, function (attr) {
        if (attr.id === parent.options.dataId) {
          if (typeof parent.curVal === 'object') {
            parentData = parent.curVal.id;
          }
          if (String(attr.data) !== parentData) {
            attr.data = parentData;
            self.generatereference = true;
            self.regenerateReference = true;
            self.parentsAttrDataChanged = true;
          }
        }
      });
    },
    getAttrData: function (field) {
      var attrData, setData, setID, attrID;
      var str = field.split("_");
      var catID = str[0];
      var i = 0;
      if (str.length > 3) {
        if (str.length === 6) {
          setID = str[0] + "_" + str[1];
          setData = this.formView.alpaca.data[setID];
          attrID = field.replace(setID + "_", "");
          if (typeof setData !== 'undefined') {
            attrData = setData[attrID];
          }
          else {
            if (this.formView.metadataview.formViewList.length > 1) {
              for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
                if (typeof this.formView.metadataview.formViewList[i].alpaca.data[attrID] !==
                    'undefined') {
                  attrData = this.formView.metadataview.formViewList[i].alpaca.data[attrID];
                  break;
                }
              }
            }
          }
        } else if (str.length === 7) {
          if (str[2] === catID) {
            setID = str[0] + "_" + str[1];
            setData = this.formView.alpaca.data[setID];
            attrID = str[2] + "_" + str[3] + "_" + str[4] + "_" + str[5];
            attrData = setData[attrID][0];
          } else {
            setID = str[0] + "_" + str[1];
            setData = this.formView.alpaca.data[setID][0];
            attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
            attrData = setData[attrID];
          }

        } else {
          setID = str[0] + "_" + str[1];
          setData = this.formView.alpaca.data[setID][0];
          attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
          attrData = setData[attrID][0];
        }
      }
      else {
        field = str[0] + "_" + str[1];
        attrData = this.formView.alpaca.data[field];
        /*
         * if the element is 'undefined' and more than one formView exists, then all the formviews are searched to update the dependent element value if at all element exists.
         */
        if (typeof attrData === 'undefined' && this.formView.metadataview.formViewList.length > 1) {
          for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
            if (typeof this.formView.metadataview.formViewList[i].alpaca.data[field] !==
                'undefined') {
              attrData = this.formView.metadataview.formViewList[i].alpaca.data[field];
              break;
            }
          }
        }
        if (str.length === 3) {
          attrData = attrData[0];
        }
      }
      return attrData;

    },
    getAttrElement: function (field) {
      var element, setID, attrID;
      var str = field.split("_");
      var catID = str[0];
      var i = 0;
      if (str.length > 3) {
        if (str.length === 6) {
          setID = str[0] + "_" + str[1];
          element = this.formView.$el.alpaca().childrenByPropertyId[setID];
          attrID = field.replace(setID + "_", "");
          if (typeof element !== 'undefined') {
            element = element.childrenByPropertyId[attrID];
          }
          else {
            if (this.formView.metadataview.formViewList.length > 1) {
              for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
                if (typeof this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[attrID] !==
                    'undefined') {
                  element = this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[attrID];
                  break;
                }
              }
            }
          }
        } else if (str.length === 7) {
          if (str[2] === catID) {
            setID = str[0] + "_" + str[1];
            element = this.formView.$el.alpaca().childrenByPropertyId[setID];
            attrID = str[2] + "_" + str[3] + "_" + str[4] + "_" + str[5];
            element = element.childrenByPropertyId[attrID].children[0];
          } else {
            setID = str[0] + "_" + str[1];
            element = this.formView.$el.alpaca().childrenByPropertyId[setID].children[0];
            attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
            element = element.childrenByPropertyId[attrID];
          }

        } else {
          setID = str[0] + "_" + str[1];
          element = this.formView.$el.alpaca().childrenByPropertyId[setID].children[0];
          attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
          element = element.childrenByPropertyId[attrID].children[0];
        }

      }
      else {
        field = str[0] + "_" + str[1];
        element = this.formView.$el.alpaca().childrenByPropertyId[field];
        /*
         * if the element is 'undefined' and more than one formView exists, then all the formviews are searched to update the dependent element value if at all element exists.
         */
        if (typeof element === 'undefined' && this.formView.metadataview.formViewList.length > 1) {
          for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
            if (typeof this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[field] !==
                'undefined') {
              element = this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[field];
              break;
            }
          }
        }
        if (str.length === 3) {
          element = element.children[0];
        }
      }
      return element;

    },
    allowEditOnClickReadArea: function () {
      return false;
    },
    getFormData: function () {
      var urlParameters = "";
      var formData = {};
      var create = this.create;
      var node_id = this.node.attributes.id;
      var parent_id = this.node.attributes.parent_id;
      var category_id = this.catId;
      var attribute_keys ="";
      var attribute_values = "";
      var count = 0;
      var cache_id = this.options.alpaca.schema.cacheId;
	  var rmClassData;
      if (create !== undefined) {
        formData.create = create;
      }
      if (!create) {
        if (node_id !== undefined) {
          formData.node_id = node_id;
        }
        return formData;
      }
      if (cache_id !== undefined) {
        formData.cache_id = cache_id;
      }
      if (parent_id !== undefined) {
        if (typeof parent_id === 'object') {
          parent_id = parent_id.id;
        }
        formData.parent_id = parent_id;
      }
      if (category_id !== undefined) {
        formData.category_id = category_id;
      }
	  if (this.formView.model.collection.get("recordsDetails")) {
		  rmClassData = this.formView.model.collection.get("recordsDetails").get("data")
		  if( rmClassData.rmclassification_id && rmClassData.rmclassification_id[0] !== 0 ) {
			  formData.rm_class_ids = rmClassData.rmclassification_id[0];
		  } else if( rmClassData.inherited_rmclassification_id ){
			  formData.rm_class_ids = rmClassData.inherited_rmclassification_id[0];
		  }
		  // Enable below lines once LPU-9026 is resolved
		  // else if( rmClassData.default_rmclassification_id ){
			  //formData.rm_class_ids = rmClassData.default_rmclassification_id[0];
		  //}
	  }      
      if (this.parentattrIds.length > 0) {
        var length = this.parentsattrData.length;
        _.each(this.parentsattrData, function (attr) {
          count++;
          if (count !== length) {
            attribute_keys = "" + attribute_keys + "'" + attr.id + "',";
            attribute_values = "" + attribute_values + "'" + attr.data + "',";
          } else {
            attribute_keys = attribute_keys + "'" + attr.id + "'";
            attribute_values = attribute_values + "'" + attr.data + "'";
          }
        });

        if (attribute_values !== undefined && attribute_keys !== undefined ) {
          formData.attribute_keys = attribute_keys.toString();
          formData.attribute_values = attribute_values.toString();
        }

      }

      return formData;
    }

  });

  return ReferenceFieldView;
})
;

csui.define('conws/controls/form/fields/alpaca/referencefield',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca', 'csui/models/form',
  'conws/controls/form/fields/reference.view',
  'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, FormModel, ReferenceFieldView, base) {

  Alpaca.Fields.ReferenceField = Alpaca.Fields.TextField.extend({

    constructor: function ReferenceField(container, data, options, schema, view, connector,
        onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'reference';
    },
    postRender: function (callback) {
      this.base(callback);
      this.showField();
    },
    showField: function () {
      var id = this.id;

	   this.options.id = "lbl" + _.uniqueId(id);
	  
	  // add an id to the <label> element like alpaca23Label
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length === 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }

      // our field
      this.fieldView = new ReferenceFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
        }),
         id: _.uniqueId(id),
        alpacaField: this,
		labelId: id4Label,
        value: this.data,
        readonly: true,
        mode: this.options.mode,
        dataId: this.name,
        path: this.path,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        }
      });

      // replace alpaca control with empty div having same classes as control
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);

      // show our field in div
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);

      return;
    },
    focus: function () {
      this.fieldView.setFocus();
    },
    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }
  });

  Alpaca.registerFieldClass('reference', Alpaca.Fields.ReferenceField, 'bootstrap-csui');

  return $.alpaca.Fields.ReferenceField;
});


/* START_TEMPLATE */
csui.define('hbs!conws/controls/description/impl/description',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <span class=\"description "
    + this.escapeExpression(((helper = (helper = helpers.truncate_fade_class || (depth0 != null ? depth0.truncate_fade_class : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"truncate_fade_class","hash":{}}) : helper)))
    + "\"\r\n        title=\""
    + this.escapeExpression(((helper = (helper = helpers.complete_description || (depth0 != null ? depth0.complete_description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"complete_description","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.current_description || (depth0 != null ? depth0.current_description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"current_description","hash":{}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.show_expandedView : depth0),{"name":"unless","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"description-caret-div\">\r\n    <span class=\"description-readmore icon-expandArrowDownWhite\" role=\"button\" aria-expanded=\"false\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showmore_tooltip || (depth0 != null ? depth0.showmore_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showmore_tooltip","hash":{}}) : helper)))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showmore_aria || (depth0 != null ? depth0.showmore_aria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showmore_aria","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></span>\r\n    <span class=\"description-showless icon-expandArrowUpWhite\" role=\"button\" aria-expanded=\"true\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showless_tooltip || (depth0 != null ? depth0.showless_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showless_tooltip","hash":{}}) : helper)))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showless_aria || (depth0 != null ? depth0.showless_aria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showless_aria","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></span>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.current_description : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('conws_controls_description_impl_description', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/controls/description/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/controls/description/impl/nls/root/lang',{
  showmore: 'Show more',
  showmoreAria: 'Show more description',
  showless: 'Show less',
  showlessAria: 'Show less description'
});



csui.define('css!conws/controls/description/impl/description',[],function(){});
csui.define('conws/controls/description/description.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'hbs!conws/controls/description/impl/description',
  'i18n!conws/controls/description/impl/nls/lang',
  'css!conws/controls/description/impl/description'
], function (_, $, Marionette, base, TabableRegionBehavior, PerfectScrollingBehavior, template,
    lang) {

  var heightToSet = 0;
  var DescriptionView = Marionette.ItemView.extend({

    className: 'conws-description',

    template: template,

    initialize: function () {
      this.shortDescMode = true;
      this.has_more_desc = false;
      this.hideShowLess = false;
      this.collapsedHeightIsOneLine = false;
    },

    templateHelpers: function () {
      return {
        complete_description: this.options.complete_desc,
        current_description: this.options.complete_desc,
        more_description: this.has_more_desc && !this.hideShowLess,
        showmore_tooltip: lang.showmore,
        showmore_aria: lang.showmoreAria,
        showless_tooltip: lang.showless,
        showless_aria: lang.showlessAria,
        show_expandedView: this.expandDescription,
      };
    },

    ui: {
      description: '.description',
      readMore: '.description-readmore',
      showLess: '.description-showless',
      caretDiv: '.description-caret-div'
    },

    events: {
      'keydown @ui.readMore': 'readMoreClicked',
      'keydown @ui.showLess': 'showLessClicked',
      'click @ui.readMore': 'readMoreClicked',
      'click @ui.showLess': 'showLessClicked'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.description',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    constructor: function DescriptionView(options) {
      this.options = options || {};
      this.expandDescription = options.expandDescription === undefined ? true : options.expandDescription;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.hideShowLess = false;

      this.listenTo(this, 'dom:refresh', this._truncateIfNecessary);

      this.listenTo(this.options.view, 'dom:refresh', function () {
        this.triggerMethod('dom:refresh');
      });
    },

    currentlyFocusedElement: function () {
      if (this.has_more_desc) {
        if (this.shortDescMode) {
          return this.ui.readMore;
        } else {
          return this.ui.showLess;
        }
      } else {
        return $();
      }
    },

    onDestroy: function () {
      heightToSet = 0;
      if (this.renderTimer) {
        clearTimeout(this.renderTimer);
      }
    },

    _setTimer: function () {
      if (this.renderTimer) {
        clearTimeout(this.renderTimer);
      }
      this.renderTimer = setTimeout(_.bind(function () {
        this._truncateIfNecessary();
      }, this), 200);
    },

    onRender: function () {
      this._setTimer();
    },

    _updateDescriptionAndCaret: function () {
      this._enableCaretState();
      if (this.shortDescMode && this.has_more_desc) {
        this.$el.addClass('conws-description-collapsed');
      } else {
        this.$el.removeClass('conws-description-collapsed');
      }
    },

    _truncateIfNecessary: function () {
	    if (!!this.ui.description && typeof(this.ui.description) === "object") {
        var actualHeight = this.getActualHeight();
        var maxHeight;

        if (actualHeight && actualHeight !== 0) {
          if (heightToSet < actualHeight) {
            heightToSet = actualHeight;
          }
          this.$el.removeClass("description-height-threeline description-height-twoline");
          if(this.expandDescription === true) {
            this.$el.addClass('description-expanded-view');
            maxHeight = this.getMaxHeight();
            if (heightToSet === maxHeight) {
              this.$el.addClass('description-height-oneline');
            } else {
              heightToSet > maxHeight * 2 ? this.$el.addClass('description-height-threeline') : this.$el.addClass('description-height-twoline');
            }
          } else {
            this.$el.removeClass('description-expanded-view');
            maxHeight = this.getMaxHeight();
            if (actualHeight > maxHeight) {
              this.has_more_desc = true;
            }
            this._enableCaretState();
            this.$el.addClass("description-height-oneline");
          }
        }
      }
    },

    getActualHeight: function () {
      return this.ui.description.height();
    },

    getMaxHeight: function () {
      return parseFloat(this.ui.description.css("line-height"));
    },

    readMoreClicked: function (event) {
      if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();

        this.shortDescMode = false;
        this._truncateIfNecessary();

        //If description is 2 lines then less-caret icon should take 2 line height otherwise 3 line height.
        this.$el.removeClass("description-height-oneline");
        var maxHeight = this.getMaxHeight();
        heightToSet > maxHeight * 2 ? this.$el.addClass('description-height-threeline') : this.$el.addClass('description-height-twoline');
        heightToSet > maxHeight * 2 ? this.ui.caretDiv.addClass("description-height-threeline") : this.ui.caretDiv.addClass("description-height-twoline");
        this.ui.showLess.focus();
        this.trigger("show:more:description");
      }
    },

    showLessClicked: function (event) {
      if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();

        this.$el.find(".description").scrollTop(0);
        this.shortDescMode = true;
        this._truncateIfNecessary();
        this.$el.removeClass("description-height-threeline description-height-twoline");
        this.ui.caretDiv.removeClass("description-height-threeline description-height-twoline");
        this.ui.readMore.focus();
        this.trigger("show:less:description");
      }
    },

    _enableCaretState: function () {
      if (this.has_more_desc) {
        this.ui.readMore.toggleClass('caret-hide', this.shortDescMode ? false : true);
        this.ui.showLess.toggleClass('caret-hide', this.shortDescMode ? true : false);
      } else {
        // text is not truncated -> no need for readMore or showLess caret to display
        this.ui.readMore.addClass('caret-hide');
        this.ui.showLess.addClass('caret-hide');
      }
    }

  });

  return DescriptionView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/controls/lazyactions/impl/lazy.loading.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<li role=\"menuitem\" class=\"csui-loading-parent-wrapper binf-disabled csui-disbaled\">\r\n  <span class=\"csui-loading-dots-wrapper\">\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n  </span>\r\n</li>";
}});
Handlebars.registerPartial('conws_controls_lazyactions_impl_lazy.loading.template', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/controls/lazyactions/lazyToolbar.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',  
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model',  
  'csui/utils/commands',   
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!conws/controls/lazyactions/impl/lazy.loading.template'
], function (module, _, $, Backbone,   NodeCollection,
  FilteredToolItemsCollection,   commands,
  DelayedToolbarView, ToolbarCommandController, lazyLoadingTemplate) {
    

    var LazyToolbarView = DelayedToolbarView.extend({

      constructor: function LazyToolbarView(options) {

        options = options || {};
        var node = options.node;

        if (!options.nodes) {
          var nodes = new NodeCollection(node);
          nodes.connector = node.connector;
          options.nodes = nodes;
        }

        this.connector = options.connector || options.nodes.connector || node.connector;

        if (!options.status) {
          options.status = {
            context: options.context,
            nodes: options.nodes,
            container: options.container,
            originatingView: options.originatingView
          };
        }
        this.status = options.status;

        this.commandController = options.commandController ||
          new ToolbarCommandController({
            commands: options.commands || commands
          });

        if (!options.collection) {

          options.collection = new FilteredToolItemsCollection(
            options.toolbarItems, {
              status: this.status,
              commands: this.commandController.commands,
              delayedActions: node.delayedActions,
              mask: options.toolbarItemsMask
            });
        }
        this.collection = options.collection;

        DelayedToolbarView.prototype.constructor.apply(this, arguments);
        
        this.listenTo(this, 'delayed:toolbar:refresh', this._refreshLazyToolbar);
        this.listenTo(this, 'childview:toolitem:action', this._toolbarItemClicked);
      },
      
      events: {
        'show.binf.dropdown': 'onBeforeShowDropDown'
       },

      onBeforeShowDropDown: function (obj) {
        var selectedNodes;
        var lazyActionsRetrieved, isLocallyCreatedNode;
        var nonPromotedActionCommands = [];

        if (this.lazyActionsRetrieved) {
          return;
        }

        this.$el.find(".csui-more-dropdown-menu").append(lazyLoadingTemplate);

        if (this.status.nodes instanceof NodeCollection) {
          selectedNodes = this.status.nodes;
        } else {
          if (this.status.nodes instanceof Backbone.Collection) {
            selectedNodes = new NodeCollection(this.status.nodes.models);
          } else {
            if (_.isArray(this.status.nodes)) {
              selectedNodes = new NodeCollection(this.status.nodes);
            } else {
              selectedNodes = new NodeCollection();
            }
          }
        }
        if (!selectedNodes.connector) {
          selectedNodes.connector = this.connector;
        }

        selectedNodes.each(function (selectedNode) {
          lazyActionsRetrieved = lazyActionsRetrieved &&
            selectedNode.get('csuiLazyActionsRetrieved');
          isLocallyCreatedNode = isLocallyCreatedNode && selectedNode.isLocallyCreated;
          nonPromotedActionCommands = nonPromotedActionCommands.length ?
            nonPromotedActionCommands :
            selectedNode.nonPromotedActionCommands;
        });

        selectedNodes.nonPromotedActionCommands = nonPromotedActionCommands;
        selectedNodes.lazyActionsRetrieved = lazyActionsRetrieved;

        if (!lazyActionsRetrieved && !isLocallyCreatedNode &&
          nonPromotedActionCommands.length) { 
          selectedNodes.lazyActionsRetrieved = this.lazyActionsRetrieved;
          //TODO: _renderLazyActions is a private method of the toolbarview and should not be used.
          // Please refactor the following once LPAD-77768 is addressed.
          this._renderLazyActions(selectedNodes);     
        }
        this.lazyActionsRetrieved = true;        
      },

      _onDomRefresh: function(){ 
        //do nothing .. suppress toolbar adjust from here
      },

      _refreshLazyToolbar: function(){
        DelayedToolbarView.prototype._onDomRefresh.call(this);
      },

      _toolbarItemClicked: function (toolItemView, args) {
        this.commandController.toolitemClicked(args.toolItem, this.options);
      },

    })
    return LazyToolbarView;
  });
csui.define('conws/controls/selectedmetadataform/selectedmetadataform.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base', 'csui/utils/url',
  'csui/controls/form/form.view','csui/controls/globalmessage/globalmessage'
], function (_, $, base, Url, FormView, GlobalMessage) {

  function getSelectorPath(root,node) {
    var path;
    while (node.length) {
      if ($(node).is(root)) {
        return path ? '>' + path : '';
      }
      var realNode = node[0], name = realNode.localName;
      if (!name) { break; }
      name = name.toLowerCase();

      var parent = node.parent();

      var allSiblings = parent.children();
      var index = allSiblings.index(realNode) + 1;
      name += ':nth-child(' + index + ')';

      path = name + (path ? '>' + path : '');
      node = parent;
    }
    return root ? undefined : path;
  }

  function getFocusInfo(view) {
    var focusPath;
    var focused = view.$el.find(":focus");
    if (focused.length) {
      var control = focused;
      while (control && control.length && !control.attr("data-alpaca-field-id")) {
        control = control.parent();
      }
      if (control.length) {
        focusPath = getSelectorPath(view.$el,control)
      }
    }
    var scrolltop = view.$el.parent().parent().scrollTop();
    return {focused:focused,focusPath:focusPath,scrolltop:scrolltop};
  }

  function restoreFocus(view,focusInfo) {
    if (focusInfo.scrolltop>=0) {
      view.$el.parent().parent().scrollTop(focusInfo.scrolltop);
    }
    var focused = view.$el.find(":focus");
    if (!focused.is(focusInfo.focused)) {
      if (focusInfo.focusPath) {
        var control = view.$el.find(focusInfo.focusPath),
            tofocus = control.find(".alpaca-control .cs-field-read button");
        tofocus.click();
      }
    }
  }

  // call given function if callback has been called the specified count of times
  function CallOnCount(count,fct) {
    this.count = count;
    this.fct = fct;
    this.callback = function callback () {
      if (this.count>0) {
        this.count = this.count - 1;
        if (this.count===0) {
          this.fct.call();
        }
      }
    }
  }

  function makeCountCallback(count,fct) {
    // set timeout to 0, just causes, that code is called after current thread execution
    // we need this, so setting focus and scroll position is done after field layout
    var coc = new CallOnCount(count,function(){setTimeout(fct,0);});
    return _.bind(coc.callback,coc);
  }

  // due to lack in csui, setting an array value with different length runs into error.
  // to avoid this we add/remove required items.
  function adaptChildrenLength(el,val) {
    var ii;
    if (el.children && el.children.length) {
      if (val && val.length) {
        if (val.length>el.children.length) {
          for (ii = el.children.length; ii<val.length; ii++) {
            var data = val[ii];
            var options = _.extend({},el.children[0].options);
            var schema = _.extend({},el.children[0].schema);
            el.addItem(ii,schema,options,data,function(){});
          }
        } else if (val.length<el.children.length) {
          for (ii = el.children.length-1; ii >= val.length; ii--) {
            el.removeItem(ii,function(){});
          }
        }
      }
    }
  }

  // determine all fields displaying the changed attribute, except the one identified by path.
  // on error only the one identified by path.
  function getRefreshFields(children,changes,path,iserror) {
    var fields = [];
    for (var ii=0; ii<children.length; ii++) {
      var el = children[ii];
      if (el.propertyId && changes.hasOwnProperty(el.propertyId)) {
        if (iserror ? el.path===path : el.path!==path) {
          fields.push(el);
        }
      } else if (el.children) {
        fields = fields.concat(getRefreshFields(el.children,changes,path,iserror));
      }
    }
    return fields;
  }

  // refresh fields if same attribute is displayed in different fields
  // and on error this function is used to restore old values
  // also restores scroll position and focus field
  function refreshFields(view,focus,changes,path,iserror) {
    // to improve: find scroll parent better.
    var fields = getRefreshFields(view.form.children,changes,path,iserror);
    if (fields.length) {
      var callback = makeCountCallback(fields.length,function(){
        restoreFocus(view,focus);
      });
      fields.forEach(function(el){
        adaptChildrenLength(el,changes[el.propertyId]);
        el.setValue(changes[el.propertyId]);
        el.refresh(callback);
      });
    }
  }

  var SelectedMetadataFormView = FormView.extend({

    constructor: function SelectedMetadataFormView(options) {
      FormView.prototype.constructor.call(this, options);

      this.node = this.options.node;
      this.listenTo(this, 'change:field', function(args){
		  this._saveField(args);
	  });
    },

    _saveField: function (args) {
      // must search for changed property, as in the rest call only attributes from one single
      // category can be changed and it runs into an error, if other attributes are passed.
	  if(this._hasDependentFields(args)){
		this._saveDependentFields(args.fieldView);
	  }
	  else{
        var property = this.form.getControlByPath(args.path[0]==='/'?args.path.substring(1):args.path);
        this._saveChanges(property.propertyId,args.value,property.path,true);
	  }
    },

	/*
	 * To check if the category attribute has any children/dependent attributes 
	 * returns true if category attribute has dependent attributes
	 * else false
	*/
	_hasDependentFields: function(args){
	  if(typeof args.fieldView !== 'undefined'){
	    if(typeof args.fieldView.isTKLField !== 'undefined'){
		  if(args.fieldView.isTKLField){
			if(args.fieldView.children.length > 0){
			  return true;
			}
			else{
 			  return false;
			}
		  }
		  else{
			return false;
		  }
		}
		else{
	      return false;
		}
	  }
	  else{
		return false;
	  }
	},

	/*
	 *  To find and save all the dependent tkl attributes
	 *  Saves the tkl attributes and its depencent category attributes in synchronized fashion to allow concurrency 
	*/
	_saveDependentFields: function(fieldView){
	  this._saveChanges(fieldView.alpacaField.propertyId,fieldView.getEditValue(),fieldView.alpacaField.path,false);
	  if(fieldView.children.length>0){
	    for(var i=0;i<fieldView.children.length;i++){
		  this._saveDependentFields(fieldView.children[i])
	    }
	  }
	},

    // Save change of a single category attribute to the server
	/*
	 * New variable is defined in the function signature - isInSync (takes boolean)
	 * Introduced isInSync to save dependent tkl values synchronously
	 * if no dependent tkl's are provided async is restored
	*/
    _saveChanges: function (propertyId,value,path,isInSync) {
      var change = {},
          changes = {};
      var values = this.getValues();
      var segpath = path[0]==='/' ? path.substring(1) : path;
      var segments = segpath.split('/');
      for (var ii=0; ii<segments.length-1; ii++) {
        if (values) {
          values = values[segments[ii]];
        }
      }
      if (values) {
        _.each(values,function(val,id){
          if (id === propertyId) {
			change[id] = val;
            changes[id] = val;
          }
        },changes);
      }
      // if --> when attributes from multivalued set are added in PMan, 
	  //Previously, In this case we are using PUT without Multivalued set Id, so adding the Set Id to the Changed property.
	  // changed the implementation as we have some issues while saving in this scenario
	  if(propertyId.search("x") > 0){
		var temp={},
			parentPropertyId;
	    temp[propertyId] = changes[propertyId];
		delete changes[propertyId];
		delete change[propertyId];
		parentPropertyId = propertyId.substring( 0, propertyId.indexOf("x")-1 );
		changes[parentPropertyId] = [temp];
		change[parentPropertyId] = [temp];
	  }
      if (!this.node) {
        throw new Error('Missing node to save the categories to.');
      }
      if (this._validate(change)) {
        var focus = getFocusInfo(this);
        this._blockActions();
        return this.node.connector.makeAjaxCall(this.node.connector.extendAjaxOptions({
              type: 'PUT',
              url: Url.combine(this.node.urlBase(), 'categories', propertyId.split('_')[0]),
              // proper formating is done in makeAjaxCall
              data: changes,
			  async: isInSync
            }))
            .done(_.bind(function () {
              this.model.updateData(change);
              refreshFields(this,focus,change,path,false);
              this.trigger('forms:sync');
              // event for keyboard navigation
              var event = $.Event('tab:content:field:changed');
              this.$el.trigger(event);
            }, this))
            .fail(_.bind(function (jqxhr) {
              var restore = this.model.restoreData(change);
              refreshFields(this,focus,restore,path,true);
              var error = new base.Error(jqxhr);
              GlobalMessage.showMessage('error', error.message);
              this.trigger('forms:error');
            }, this))
            .always(_.bind(function () {
              this._unblockActions();
            }, this));
      }
      return $.Deferred().reject().promise();
    }
  });

  return SelectedMetadataFormView;
});

csui.define('conws/utils/commands/permissions/permissions.util',[
    'csui/utils/url'
], function (Url) {
    
    var PermissionsUtil = {
        getUrl: function (nodeRolePermissionModel) {
            var nodeId = nodeRolePermissionModel.nodeId,
                url = nodeRolePermissionModel.connector.connection.url.replace('/v1', '/v2');
            url = Url.combine(url, 'businessworkspaces', nodeId, 'roles');

            if (!!nodeRolePermissionModel.action) {
                var roleId;
                if (nodeRolePermissionModel.action === "delete" || nodeRolePermissionModel.action === "editperms") {
                    roleId = nodeRolePermissionModel.get("right_id");
                    url = Url.combine(url, roleId);
                }
                else if (nodeRolePermissionModel.action === "fetch" || nodeRolePermissionModel.action === "update") {
                    roleId = nodeRolePermissionModel.get("right_id");
                    var queryparameters = Url.combineQueryString({
                        fields: "members"
                    });
                    url = Url.combine(url, roleId);
                    url = url + "?" + queryparameters;
                }
            }
            return url;
        },

        isWorkspaceRole: function (model) {
            var isWorkspaceRole, right_id_expand = model.get('right_id_expand');
            if (!!right_id_expand) {
                //if model is NodePermissionModel
                isWorkspaceRole = !!right_id_expand.type && (right_id_expand.type === 848);
            }
            else {
                //if model is MemberModel
                isWorkspaceRole = !!model.get('type') && (model.get('type') === 848);
            }
            return isWorkspaceRole;
        },

        isLeaderRole: function (nodeModel, model) {
            var isLeaderRole, isInheritedRole = this.isInheritedRole(nodeModel, model),
            right_id_expand = model.get('right_id_expand');
            if (!!right_id_expand) {
                //if model is NodePermissionModel
                isLeaderRole = !isInheritedRole && !!right_id_expand.id && !!right_id_expand.leader_id && (right_id_expand.id === right_id_expand.leader_id);   
            }
            else{
                 //if model is MemberModel
                isLeaderRole = !isInheritedRole && !!model.get("id") && !!model.get("leader_id") && (model.get("id") === model.get("leader_id"));   
            }
             
            return isLeaderRole;
        },

        isInheritedRole: function (nodeModel, model) {
            var isInheritedRole, right_id_expand = model.get('right_id_expand');
            if (!!right_id_expand) {
                //if model is NodePermissionModel
                isInheritedRole = !!right_id_expand.node_id &&
                    !!nodeModel && !!nodeModel.get("id") &&
                    (right_id_expand.node_id !== nodeModel.get("id"));
            }
            else {
                //if model is MemberModel
                isInheritedRole = !!model.get('node_id') &&
                    !!nodeModel && !!nodeModel.get("id") &&
                    (model.get('node_id') !== nodeModel.get("id"));
            }
            return isInheritedRole;

        },

        isWorkspace: function (nodeModel) {
            return !!nodeModel && !!nodeModel.get("type") && (nodeModel.get("type") === 848);
        }
    };
    return PermissionsUtil;

});

/* START_TEMPLATE */
csui.define('hbs!conws/controls/table/cells/role/impl/role',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " binf-disabled";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.addOwnerOrGroup : depth0),{"name":"unless","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\""
    + this.escapeExpression(((helper = (helper = helpers.inlineToolBarPlaceholderClass || (depth0 != null ? depth0.inlineToolBarPlaceholderClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"inlineToolBarPlaceholderClass","hash":{}}) : helper)))
    + " binf-hidden\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-user-container\">\r\n  <div class=\"csui-profileimg binf-pull-left\">\r\n    <span class=\"csui-icon-paceholder csui-icon conws-mime_roles\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaUserLabel || (depth0 != null ? depth0.ariaUserLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaUserLabel","hash":{}}) : helper)))
    + "\"></span>\r\n  </div>\r\n  <div class=\"member-info csui-fadeout"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " \">\r\n    <div class=\"\">\r\n      <span class=\"csui-user-display-name csui-role\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaUserLabel || (depth0 != null ? depth0.ariaUserLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaUserLabel","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n  </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.includeInlineToolBarPlaceholder : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>";
}});
Handlebars.registerPartial('conws_controls_table_cells_role_impl_role', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/controls/table/cells/role/impl/role',[],function(){});
csui.define('conws/controls/table/cells/role/role.view',[
  'csui/lib/underscore',
  'csui/controls/table/cells/user/user.view',
  'csui/controls/table/cells/cell.registry',
  'csui/models/member',
  'conws/utils/commands/permissions/permissions.util',
  'hbs!conws/controls/table/cells/role/impl/role',
  'css!conws/controls/table/cells/role/impl/role'
], function (_, UserCellView, cellViewRegistry, MemberModel, PermissionsUtil, roleTemplate) {

  var RoleCellView = UserCellView.extend({

    renderValue: function () {
      var data = this.getValueData(),
        template = this.getTemplate(),
        // Making the entire data object undefined renders nothing; if the object
        // contains defined value the template should be prepared for it
        html = data ? template(data) : '';
      this.$el.html(html);
    },

    getTemplate: function () {
      var template;
      if (!!this.isWorkspaceRole && this.isWorkspaceRole) {
        template = roleTemplate;
      }
      else {
        // In this case load the user.view template
        template = this.template;
      }
      return template;
    },

    getValueData: function () {
      return _.extend(RoleCellView.__super__.getValueData.apply(this, arguments), {
        isWorkspaceRole: this.isWorkspaceRole
      })
    },

    constructor: function RoleCellView(options) {
      RoleCellView.__super__.constructor.apply(this, arguments);

      if (!!this.model && !!this.model.collection) {

        this.isWorkspaceRole = PermissionsUtil.isWorkspaceRole(this.model);

        if (!this.model.collection.extraMemberModels) {
          this.model.collection.extraMemberModels = [];
        }
        if (this.isWorkspaceRole) {
          var isModelExist = this.model.collection.extraMemberModels.some(function (memberModel) {
            return memberModel.get("id") === this.model.get("right_id_expand").id
          }, this);
          // only add to extraMemberModels if it doesnot exist.
          if (!isModelExist) {
            var memberModel = new MemberModel(this.model.get("right_id_expand"))
            memberModel.nodeModel = this.options.nodeModel;
            this.model.collection.extraMemberModels.push(memberModel);
          }
        }
      }
    }
  });
  cellViewRegistry.registerByColumnKey('right_id', RoleCellView);
  return RoleCellView;
});

csui.define('conws/controls/table/cells/permission/role.permission.level.view',['csui/lib/jquery', 'csui/lib/underscore',
    'csui/controls/table/cells/permission/permission.level.view',
    'csui/utils/commands',
    'csui/controls/table/cells/cell.registry',
    'conws/utils/commands/permissions/permissions.util'
], function ($, _, PermissionLevelCellView, commands, cellViewRegistry, PermissionsUtil) {
    

    var RolePermissionLevelCellView = PermissionLevelCellView.extend({

        constructor: function RolePermissionLevelCellView(options) {
            RolePermissionLevelCellView.__super__.constructor.apply(this, arguments);
            this.$ = $;
        },

        // overriden this function from PermissionLevelCellView to trigger
        // EditRolePermission command for business workspace roles.
        onClickPermissionLevel: function (e) {
            var command,
                isWorkspaceRole = PermissionsUtil.isWorkspaceRole(this.options.model),
                membersTypeSupport = [0, 1, 848];
            if (membersTypeSupport.indexOf(
                this.options.model.get("right_id_expand") &&
                this.options.model.get("right_id_expand").type) < 0 &&
                this.options.model.get("type") === "custom") {
                this._handlePermissionLevelFocus({ cellView: this });
            } else {
                command = isWorkspaceRole ? commands.get('EditRolePermission') : commands.get('EditPermission');
                this._handlePermissionLevelClicked({ cellView: this, command: command });
                this.trigger("cell:content:clicked", this);
            }
        }
    });

    cellViewRegistry.registerByColumnKey('permissions', RolePermissionLevelCellView);

    return RolePermissionLevelCellView;
});
// Lists explicit locale mappings and fallbacks
csui.define('conws/controls/userpicker/nls/role.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/controls/userpicker/nls/root/role.lang',{
  roleViewGroupTitle: 'Business Workspace Role',
  roleViewLeaderTitle: 'Leader Role',
  inheritedrole:'Inherited Role'
});


/* START_TEMPLATE */
csui.define('hbs!conws/controls/userpicker/role',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"member-info"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " binf-pull-left\">\r\n  <span class=\"name binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return " binf-disabled";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"member-picture"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " binf-pull-left\">\r\n  <span class=\"csui-icon conws-mime_roles\"></span>\r\n</div>\r\n<div class=\"member-info"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " binf-pull-left\">\r\n  <span class=\"name binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"group-title binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers['role-title'] || (depth0 != null ? depth0['role-title'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"role-title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers['role-title'] || (depth0 != null ? depth0['role-title'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"role-title","hash":{}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isWorkspace : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.leader : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isInheritedRole : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"leader-title binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers['leader-title'] || (depth0 != null ? depth0['leader-title'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"leader-title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers['leader-title'] || (depth0 != null ? depth0['leader-title'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"leader-title","hash":{}}) : helper)))
    + "</span>\r\n";
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"leader-title binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers['isInheritedRole-title'] || (depth0 != null ? depth0['isInheritedRole-title'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"isInheritedRole-title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers['isInheritedRole-title'] || (depth0 != null ? depth0['isInheritedRole-title'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"isInheritedRole-title","hash":{}}) : helper)))
    + "</span>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"message binf-pull-left\">"
    + this.escapeExpression(((helper = (helper = helpers['disabled-message'] || (depth0 != null ? depth0['disabled-message'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"disabled-message","hash":{}}) : helper)))
    + "</span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.lightWeight : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('conws_controls_userpicker_role', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/controls/userpicker/role.view',[
  'csui/utils/base',
  'csui/controls/userpicker/impl/group.view',
  'conws/utils/commands/permissions/permissions.util',
  'i18n!conws/controls/userpicker/nls/role.lang',
  'hbs!conws/controls/userpicker/role'
], function (Base, GroupView, PermissionsUtil, lang, roleTemplate) {

  var RoleView = GroupView.extend({

    getTemplate: function () {
      var template;
      if (!!this.isWorkspaceRole && this.isWorkspaceRole) {
        template = roleTemplate;
      }
      else {
        // In this case load the group.view template
        template = this.template;
      }
      return template;
    },

    templateHelpers: function () {
      return {
        'name': Base.formatMemberName(this.model),
        'role-title': lang.roleViewGroupTitle,
        'isWorkspace': this.isWorkspace,
        'leader': this.isLeaderRole,
        'leader-title': lang.roleViewLeaderTitle,
        'isInheritedRole': this.isInheritedRole,
        'isInheritedRole-title': lang.inheritedrole,
        'disabled': this.model.get('disabled'),
        'disabled-message': this.options.disabledMessage,
        'lightWeight': !!this.options.lightWeight
      };
    },

    constructor: function RoleView(options) {
      // apply properties to parent
      GroupView.prototype.constructor.call(this, options);
      if (!!this.model && !!this.model.nodeModel) {
        this.isWorkspace = PermissionsUtil.isWorkspace(this.model.nodeModel);
        this.isWorkspaceRole = PermissionsUtil.isWorkspaceRole(this.model);
        this.isLeaderRole = PermissionsUtil.isLeaderRole(this.model.nodeModel, this.model);
        this.isInheritedRole = PermissionsUtil.isInheritedRole(this.model.nodeModel, this.model)
      }

    }

  });

  return RoleView;
});

csui.define('conws/dialogs/addoreditrole/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/dialogs/addoreditrole/impl/nls/root/lang',{
  dialogTitle: "View role membership",
  missingConnector: 'Missing connector information!',
  AddRole: 'Add role',
  EditRole: 'Edit role',
  doneButtonLabel: 'Save',
  nextButtonLabel: 'Next',
  cancelButtonLabel: "Cancel",
  RoleStepName: 'Role',
  PermissionsStepName: 'Permissions',
  ParticipantsStepName: 'Participants',
  RoleName: 'Role name',
  RoleNamePlaceholder: 'Enter name',
  RoleDesc: 'Role Description',
  RoleDescPlaceholder: 'Add Description',
  TeamLead: 'Team Lead',
  SubItemsInherit: 'Apply to sub-items',
  backButtonTooltip: 'Go back',
  backButtonAria: 'Go back',
  selectPermissionLevel: 'Select permission level',
  simplePermissionSelection: 'Simple Permission Selection',
  rolePartcipantsWithNoparticipantsMessage: 'No participants have been added.',
  participantsTitle: 'Participants',
  addParticipantTitle: 'Add Participant',
  roleParticipantsUserPickerPlaceholder: 'Add participants',
  roleParticipantsDisabledMemberMessage: 'Is already a participant.',
  roleParticipantsSearchAria: 'Search for participants'
});


csui.define('conws/controls/wizard/step/impl/footer.view',['csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/wizard/step/impl/footer.view'
], function (Marionette, TabableRegion, WizardStepFooterView) {

  var ConwsButtonView = Marionette.ItemView.extend({

    tagName: 'button',

    className: 'binf-btn',

    template: false,

    triggers: {
      'click': 'click'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    constructor: function ButtonView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    isTabable: function () {
      return this.$el.is(':not(:disabled)') && this.$el.is(':not(:hidden)');
    },
    currentlyFocusedElement: function () {
      if (this.$el.prop('tabindex') === -1) {
        this.$el.prop('tabindex', 0);
      }
      return this.$el;
    },

    onRender: function () {
      var button = this.$el,
        attributes = this.model.attributes;
      if (typeof attributes.isButton === 'undefined') {
        button.text(attributes.label);
        button.addClass('binf-btn');
        button.addClass(
          attributes['default'] ? 'binf-btn-primary cs-add-button' : 'binf-btn-default');
        if (attributes.toolTip) {
          button.attr('title', attributes.toolTip);
        }
        if (attributes.separate) {
          button.addClass('cs-separate');
        }
      }
      else {
        button.addClass('arrow_back button_image');
        if (attributes.toolTip) {
          button.attr({ 'title': attributes.toolTip, 'aria-label': attributes.toolTip, 'role': 'link' });
        }
        if (attributes.id === 'next') {
          button.addClass("button_image_next");
        }
      }
      this.updateButton(attributes);
    },

    updateButton: function (attributes) {
      var $button = this.$el;

      attributes || (attributes = {});
      if (attributes.hidden !== undefined) {
        if (attributes.hidden) {
          $button.addClass('binf-hidden');
        } else {
          $button.removeClass('binf-hidden');
        }
      }
      if (attributes.disabled !== undefined) {
        $button.prop('disabled', attributes.disabled);
      }
    }
  });

  var ConwsWizardStepFooterView = WizardStepFooterView.extend({

    childView: ConwsButtonView,

    constructor: function ConwsWizardStepFooterView(options) {
      WizardStepFooterView.prototype.constructor.apply(this, arguments);
    }
  });

  return ConwsWizardStepFooterView;
});


// Renders a view in a modal dialog and waits for the user to close it
csui.define('conws/controls/wizard/step/wizard.step.view',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/wizard/step/wizard.step.view',
  'conws/controls/wizard/step/impl/footer.view',
  'csui/utils/log',
  'i18n!csui/controls/wizard/impl/nls/lang'
], function (module, _, Backbone, LayoutViewEventsPropagationMixin,
  WizardStepView, ConwsWizardStepFooterView, log, lang) {

    log = log(module.id);

    var ConwsWizardStepView = WizardStepView.extend({

      constructor: function ConwsWizardStepView() {
        WizardStepView.prototype.constructor.apply(this, arguments);
        this.listenTo(this,'set:initial:focus', this.setViewInitialFocus);
      },

      setViewInitialFocus: function(){
        this.options.view.trigger('set:initial:focus');
      },

      // overriden the footer to support next and back images instead of showcasing as buttons.
      _renderFooter: function () {
        var footerView = this.footerView = this.options.footerView;
        if (footerView) {
          this.ui.footer.removeClass('binf-hidden');
          this.footer.show(footerView);
        } else {
          var defaultButtons = [];
          if (!this.options.isFirstStep) {
            // Previous button
            defaultButtons.push({
              id: 'previous',
              label: this.options.previousButtonLabel || lang.back,
              toolTip: this.options.previousButtonLabel || lang.back,
              'default': false,
              disabled: false,
              isButton: false,
              separate: this.options.seperatePrevious || false,
              click: _.bind(this.onClickPreviousButton, this)
            });
          }
          var nextButton = {
            id: 'next',
            label: this.options.nextButtonLabel || lang.next,
            toolTip: this.options.nextButtonLabel || lang.next,
            'default': true,
            disabled: (this.options.disableNext === undefined) ? true : this.options.disableNext,
            separate: this.options.seperateNext || false,
            isButton: false,
            click: _.bind(this.onClickNextButton, this)
          },
            doneButton = {
              id: 'done',
              label: this.options.doneButtonLabel || lang.done,
              toolTip: this.options.doneButtonLabel || lang.done,
              'default': true,
              disabled: (this.options.disableDone === undefined) ? true : this.options.disableDone,
              separate: this.options.seperateDone || true,
              click: _.bind(this.onClickDoneButton, this)
            };
          // If both are needed then both both buttons are added as default buttons
          // else either next or done button is added to the defaultbuttons list.
          if (this.options.nextButton && this.options.doneButton) {
            defaultButtons.push(nextButton);
            defaultButtons.push(doneButton);
          }
          else if (this.options.nextButton) {
            defaultButtons.push(nextButton);
          } else if (this.options.doneButton) {
            defaultButtons.push(doneButton);
          }
          // Cancel button
          defaultButtons.push(
            {
              id: 'cancel',
              label: lang.cancel,
              toolTip: lang.cancel,
              separate: this.options.seperateCancel || true,
              close: true
            });

          var buttons = this.options.buttons || defaultButtons;

          if (buttons.length) {
            this.ui.footer.removeClass('binf-hidden');
          }
          footerView = this.footerView = new ConwsWizardStepFooterView({
            collection: new Backbone.Collection(buttons),
            wizardView: this,
            el: this.ui.footer[0]
          });
          this.listenTo(footerView, 'childview:click', this.onClickButton);
          footerView.render();
          this.footer.attachView(footerView);
        }
      }
    });

    _.extend(ConwsWizardStepView.prototype, LayoutViewEventsPropagationMixin);

    return ConwsWizardStepView;

  });


csui.define('css!conws/controls/wizard/impl/wizard',[],function(){});
csui.define('conws/controls/wizard/wizard.view',['csui/lib/underscore',
  'csui/controls/wizard/wizard.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/controls/wizard/step/wizard.step.view',
  'css!conws/controls/wizard/impl/wizard'
], function (_, WizardView, LayoutViewEventsPropagationMixin, ConwsWizardStepView) {

  var ConwsWizardView = WizardView.extend({

    constructor: function ConwsWizardView(options) {
      options || (options = {});
      WizardView.prototype.constructor.apply(this, arguments);
    },

    // overriden and updated this function to call ConwsWizardStepView so as to customize the wizard step footer
    getCurrentView: function () {
      if (this.currentStep < this.stepViews.length) {
        return this.stepViews[this.currentStep];
      } else {
        var stepNum = this.currentStep;
        var view = new ConwsWizardStepView(_.extend(this.options.steps[stepNum],
          { wizard: this, isFirstStep: this.isFirstStep(), isLastStep: this.isLastStep() }));
        this.stepViews.push(view);
        this.listenTo(view, 'next:clicked', this.nextStep)
          .listenTo(view, 'previous:clicked', this.prevStep)
          .listenTo(view, 'done:clicked', this.save)
          .listenTo(view, 'close:wizard', this.closeWizard);
        return view;
      }
    },

    showCurrentView: function () {
      //TODO: uncomment below line to get the steps in slide transition
      //this.addDirection();
      this.currentView.$el.removeClass('binf-hidden');
      this.currentView.triggerMethod('set:initial:focus');
    }
  });

  _.extend(ConwsWizardView.prototype, LayoutViewEventsPropagationMixin);

  return ConwsWizardView;

});
csui.define('conws/dialogs/addoreditrole/impl/tabbable.form.view',[
    'csui/lib/jquery',
    'csui/controls/form/form.view',
    'csui/behaviors/keyboard.navigation/tabable.region.behavior',
], function ($, FormView, TabableRegionBehavior) {

    var TabbableFormView = FormView.extend({

        behaviors: {
            TabablesBehavior: {
                behaviorClass: TabableRegionBehavior,
                recursiveNavigation: true,
                containTabFocus: true
            }
        },

        events: {
            'keydown': 'onKeyInView'
        },

        isTabable: function () {
            return this.$('*[tabindex]').length > 0;
        },

        currentlyFocusedElement: function (event) {
            var readonly = !!this.$form && this.$form.find('.alpaca-readonly button'),
                tabElements = this.$('*[tabindex]:visible');
            if (tabElements.length) {
                tabElements.prop('tabindex', 0);
                if (readonly.length) {
                    readonly.attr('tabindex', -1)
                }
            }
            this.tabableElements = tabElements;
            return $(tabElements[0]);
        },

        onKeyInView: function (event) {
            var tabableEleLength = this.tabableElements.length;
            if (tabableEleLength > 0 && event.keyCode === 9) {
                if (event.shiftKey) {
                    var index = this.tabableElements.index(event.target);
                    var target = --index;
                    if (target >= 0) {
                        this._setFocus(event, target);
                    }
                } else {
                    var index = this.tabableElements.index(event.target);
                    var target = ++index;
                    if (target < tabableEleLength) {
                        this._setFocus(event, target);
                    }
                }
            }
        },

        _setFocus: function (event, target) {
            this.tabableElements.eq(target).focus();
            event.stopPropagation();
            event.preventDefault();
        }
    });

    // return view
    return TabbableFormView;
});      

/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/addoreditrole/impl/roleheader/impl/roleheader.view',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"dashed-border\"></div>\r\n<div class=\"conws-addoreditrole-wizardstep-header\">\r\n    <span class=\"conws-addoreditrole-wizardstep1\">"
    + this.escapeExpression(((helper = (helper = helpers.Step1 || (depth0 != null ? depth0.Step1 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"Step1","hash":{}}) : helper)))
    + "</span>\r\n    <span class=\"conws-addoreditrole-wizardstep2\">"
    + this.escapeExpression(((helper = (helper = helpers.Step2 || (depth0 != null ? depth0.Step2 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"Step2","hash":{}}) : helper)))
    + "</span>\r\n    <span class=\"conws-addoreditrole-wizardstep3\">"
    + this.escapeExpression(((helper = (helper = helpers.Step3 || (depth0 != null ? depth0.Step3 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"Step3","hash":{}}) : helper)))
    + "</span>\r\n</div>";
}});
Handlebars.registerPartial('conws_dialogs_addoreditrole_impl_roleheader_impl_roleheader.view', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/dialogs/addoreditrole/impl/roleheader/impl/roleheader.view',[],function(){});
csui.define('conws/dialogs/addoreditrole/impl/roleheader/roleheader.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/roleheader/impl/roleheader.view',
  'css!conws/dialogs/addoreditrole/impl/roleheader/impl/roleheader.view'
], function (_, Marionette, lang, template) {

  var RoleHeaderView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      StepHeaderRegion: '.conws-addoreditrole-wizardstep-header',
    },

    templateHelpers: {
      Step1: lang.RoleStepName,
      Step2: lang.PermissionsStepName,
      Step3: lang.ParticipantsStepName
    },

    constructor: function RoleHeaderView(options) {
      options || (options = {});

      this.context = options.context;
      this.connector = options.connector;

      if (!!options.currentStep) {
        this.listenTo(this, 'render', this._updateClasses);
        _.bind(this._updateClasses, options);
      }

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    _updateClasses: function (self) {

      switch (self.options.currentStep) {
        case "step1":
          this.$el.find('.conws-addoreditrole-wizardstep1').addClass('conws-addoreditrole-wizardstep-header-active');
          break;
        case "step2":
          this.$el.find('.conws-addoreditrole-wizardstep2').addClass('conws-addoreditrole-wizardstep-header-active');
          break;
        case "step3":
          this.$el.find('.conws-addoreditrole-wizardstep3').addClass('conws-addoreditrole-wizardstep-header-active');
          break;
        default:
        //nothing
      }
    }

  });
  // return view
  return RoleHeaderView;
});

/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/addoreditrole/impl/roledetails/impl/roledetails',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"conws-addoreditrole-roledetails\">\r\n    <div class=\"conws-addoreditrole-roledetails-header\">\r\n    </div>\r\n    <div class=\"conws-addoreditrole-roledetails-body\">\r\n        <div class=\"conws-addoreditrole-roledetails-left\">\r\n        </div>\r\n        <div class=\"conws-addoreditrole-roledetails-right\">\r\n        </div>\r\n    </div>\r\n</div>";
}});
Handlebars.registerPartial('conws_dialogs_addoreditrole_impl_roledetails_impl_roledetails', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/dialogs/addoreditrole/impl/roledetails/impl/roledetails',[],function(){});
csui.define('conws/dialogs/addoreditrole/impl/roledetails/roledetails.view',[
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

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      //Listen to events that are triggered from wizard.step.view
      this.listenTo(this, 'set:initial:focus', this.onSetInitialFocus);

      // propagate events to regions
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
      //set initial focus on this element
      this.LeftRegion.currentView.$el.find("[data-alpaca-container-item-name='role_name'] input[type='text']").focus();
    }
  });

  // add mixin
  _.extend(RoleDetailsView.prototype, LayoutViewEventsPropagationMixin);
  // return view
  return RoleDetailsView;
});
csui.define('conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions.title.view',[
  'csui/lib/handlebars',
  'csui/lib/marionette'
], function (Handlebars, Marionette) {

  TitleView = Marionette.ItemView.extend({

    template: Handlebars.compile('{{title}}'),

    templateHelpers: function () {
      return {
        title: this.model.get('title')
      }
    },
    constructor: function TitleView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }
  });

  return TitleView;
});

/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"conws-addoreditrole-rolepermissions\">\r\n    <div class=\"conws-addoreditrole-rolepermissions-header\"></div>\r\n    <div class=\"conws-addoreditrole-rolepermissions-picker-header\">\r\n        <div class=\"conws-addoreditrole-rolepermissions-left\">\r\n            <div class=\"conws-addoreditrole-rolepermissions-back\"></div>\r\n            <div class=\"conws-addoreditrole-rolepermissions-title\"></div>\r\n        </div>\r\n        <div class=\"conws-addoreditrole-rolepermissions-right\">\r\n        </div>\r\n    </div>\r\n    <div class=\"conws-addoreditrole-rolepermissions-picker\"></div>\r\n</div>";
}});
Handlebars.registerPartial('conws_dialogs_addoreditrole_impl_rolepermissions_impl_rolepermissions', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions',[],function(){});
csui.define('conws/dialogs/addoreditrole/impl/rolepermissions/rolepermissions.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/models/form',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/dialogs/addoreditrole/impl/tabbable.form.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/permissions/impl/edit/permission.level.selector/permission.level.selector.view',
  'csui/widgets/permissions/impl/edit/permission.attributes/permission.attributes.view',
  'csui/models/permission/nodepermission.model',
  'conws/dialogs/addoreditrole/impl/roleheader/roleheader.view',
  'conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions.title.view',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions',
  'css!conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions', 'i18n'
], function (_, $, Backbone, Marionette, FormModel, TabableRegionBehavior, TabbableFormView, LayoutViewEventsPropagationMixin,
  PermissionLevelSelectorView, PermissionAttributesView, NodePermissionModel, RoleHeaderView, TitleView, lang, template, i18n) {

    var BackButtonView = Marionette.ItemView.extend({

      template: false,

      tagName: 'div',

      className: 'conws-addoreditrole-rolepermissions-backbtn icon circular arrow_back cs-go-back binf-hidden',

      attributes: {
        title: lang.backButtonTooltip,
        'aria-label': lang.backButtonAria,
        role: 'link'
      },

      constructor: function BackButtonView(options) {
        Marionette.View.prototype.constructor.apply(this, arguments);
      },

      behaviors: {
        TabableRegion: {
          behaviorClass: TabableRegionBehavior
        }
      },

      currentlyFocusedElement: function () {
        return this.$el;
      }
    });

    var RolePermissionsView = Marionette.LayoutView.extend({

      template: template,

      regions: {
        HeaderRegion: '.conws-addoreditrole-rolepermissions-header',
        PickerRegion: '.conws-addoreditrole-rolepermissions-picker',
        TitleRegion: '.conws-addoreditrole-rolepermissions-title',
        RightRegion: '.conws-addoreditrole-rolepermissions-right',
        BackButtonRegion: '.conws-addoreditrole-rolepermissions-back'
      },

      templateHelpers: {
        'title': lang.selectPermissionLevel,
        'backButtonTooltip': lang.backButtonTooltip,
        'backButtonAria': lang.backButtonAria
      },

      events: {
        'click .conws-addoreditrole-rolepermissions-back': 'onBackSelection',
        'keydown .conws-addoreditrole-rolepermissions-back': 'onBackKeySelection'
      },

      _createHeaderControl: function () {
        var roleHeaderView = new RoleHeaderView({
          headerViewoptions: this.options,
          currentStep: 'step2'
        });
        return roleHeaderView;
      },

      constructor: function RolePermissionsView(options) {
        options || (options = {});

        this.context = options.context;
        this.connector = options.connector;

        // apply properties to parent
        Marionette.LayoutView.prototype.constructor.apply(this, arguments);

        //Listen to events that are triggered from wizard.step.view
        this.listenTo(this, 'set:initial:focus', this.onSetInitialFocus);

        // propagate events to regions
        this.propagateEventsToRegions();
      },

      onRender: function () {

        var SubItemsInheritForm = {
          "data": {
            "subitems_inherit": true
          },
          "options": {
            "fields": {
              "subitems_inherit": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": lang.SubItemsInherit,
                "readonly": false,
                "type": "checkbox"
              }
            },
            "label": ""
          },
          "schema": {
            "properties": {
              "subitems_inherit": {
                "readonly": false,
                "required": false,
                "title": lang.SubItemsInherit,
                "type": "boolean"
              }
            },
            "type": "object"
          }
        },

          permissionLevelView = new PermissionLevelSelectorView({
            selected: this.options.addrole ? 1 : this.options.model.getPermissionLevel(),
            isContainer: this.options.isContainer,
            nodeModel: this.options.nodeModel,
            permissionModel: this.options.model
          }),

          SubItemsInheritFormView = new TabbableFormView({
            model: new FormModel(SubItemsInheritForm),
            mode: "create"
          });

        this.titleView = new TitleView({
          model: new Backbone.Model({
            title: lang.selectPermissionLevel
          })
        });

        if (!this.options.addrole) {
          this.lastSelectedPermLevel = this.options.model.getPermissionLevel();
          if (this.options.model.getPermissionLevel() === NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
            this.lastSelectedCustomPermissions = this.options.model.get('permissions');
          }
        }

        permissionLevelView.on('permission:level:selected', this.onPermissionLevelSelection, this);
        this.HeaderRegion.show(this._createHeaderControl());
        this.PickerRegion.show(permissionLevelView);
        this.RightRegion.show(SubItemsInheritFormView);
        this.TitleRegion.show(this.titleView);
        this.BackButtonRegion.show(new BackButtonView());
      },

      onPermissionLevelSelection: function () {
        var view = this.PickerRegion.currentView;
        if (view && view.selected === NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
          //Replace current view with custom permission view
          var customPermissionView = new PermissionAttributesView({
            permissions: !!this.lastSelectedCustomPermissions ? this.lastSelectedCustomPermissions : [],
            readonly: false,
            showButtons: false,
            node: this.options.nodeModel
          });

          this.titleView.model.set('title', lang.simplePermissionSelection);
          this.$el.find('.conws-addoreditrole-rolepermissions-backbtn').removeClass('binf-hidden').focus();
          this.BackButtonRegion.currentView.trigger("dom:refresh");
          this.PickerRegion.show(customPermissionView);
          this.isCustom = true;

          // adjusting split bar and separator positions
          var $treeViewDiv = customPermissionView.$el.find('.csui-permission-attribute-tree'),
            adjustSplitsHeight,
            adjustSplitsRight,
            adjustSplitsSeparator,
            adjustSplits = $treeViewDiv.find(".csui-tree-split");

          for (var i = adjustSplits.length - 1, j = 0; i >= 0, j < adjustSplits.length; i-- , j++) {
            adjustSplitsRight = $(adjustSplits[i]).width() * j;
            adjustSplitsSeparator = $(adjustSplits[i]).closest(".csui-tree-child").find(
              '.csui-separator');
            if (adjustSplits[i] === adjustSplits[adjustSplits.length - 1]) {
              adjustSplitsHeight = $treeViewDiv.outerHeight();
            } else {
              adjustSplitsHeight = Math.round(($(adjustSplits[i]).closest("li").position().top) +
                $(adjustSplits[i]).closest(
                  ".csui-tree-child").outerHeight());
              adjustSplitsRight = adjustSplitsRight + j;
            }
            if (i18n && i18n.settings.rtl) {
              $(adjustSplits[i]).css({ 'height': adjustSplitsHeight, 'left': adjustSplitsRight });
              adjustSplitsSeparator.css({
                'width': ($treeViewDiv.find('.csui-tree-container').width()),
                'left': adjustSplitsRight
              });
              $(adjustSplits[i]).closest('.csui-tree-child').css(
                { 'padding-left': adjustSplitsRight + $(adjustSplits[i]).width() });
            } else {
              $(adjustSplits[i]).css({ 'height': adjustSplitsHeight, 'right': adjustSplitsRight });
              adjustSplitsSeparator.css({
                'width': ($treeViewDiv.find('.csui-tree-container').width()),
                'right': adjustSplitsRight
              });
              $(adjustSplits[i]).closest('.csui-tree-child').css(
                { 'padding-right': adjustSplitsRight + $(adjustSplits[i]).width() });
            }
          }
        }
        else {
          this.lastSelectedPermLevel = view.selected;
        }
      },

      onBackSelection: function () {
        this.lastSelectedCustomPermissions = this.PickerRegion.currentView.getSelectedPermissions();
        this.titleView.model.set('title', lang.selectPermissionLevel);
        this.$el.find('.conws-addoreditrole-rolepermissions-backbtn').addClass('binf-hidden');
        this.BackButtonRegion.currentView.trigger("dom:refresh");
        var permissionLevelView = new PermissionLevelSelectorView({
          selected: !!this.lastSelectedPermLevel ? this.lastSelectedPermLevel : 1,
          isContainer: this.options.isContainer,
          nodeModel: this.options.nodeModel
        })
        this.PickerRegion.show(permissionLevelView);
        permissionLevelView.on('permission:level:selected', this.onPermissionLevelSelection, this);

        // On back selection, set the focus on custom permission level
        this.PickerRegion.currentView.$el.find("li[data-optionid='" + NodePermissionModel.PERMISSION_LEVEL_NONE + "'] a").focus();
      },

      onBackKeySelection: function (event) {
        if (event.keyCode === 13) {
          this.onBackSelection();
        }
      },

      onAfterShow: function () {
        this.onSetInitialFocus();
      },

      onSetInitialFocus: function () {
        //set initial focus on this element
        this.RightRegion.currentView.$el.find("[data-alpaca-container-item-name='subitems_inherit'] input[type='checkbox']").focus();
      }

    });
    // add mixin
    _.extend(RolePermissionsView.prototype, LayoutViewEventsPropagationMixin);
    // return view
    return RolePermissionsView;
  });

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/avatar/impl/avatar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"participant-picture\">\r\n  <span class=\"csui-icon binf-img-circle\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.display_name || (depth0 != null ? depth0.display_name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"display_name","hash":{}}) : helper)))
    + "\"/>\r\n  <img class=\"csui-icon binf-img-circle\" alt=\""
    + this.escapeExpression(((helper = (helper = helpers.display_name || (depth0 != null ? depth0.display_name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"display_name","hash":{}}) : helper)))
    + "\">\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_avatar_impl_avatar', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/controls/avatar/impl/avatar',[],function(){});
csui.define('conws/widgets/team/impl/controls/avatar/avatar.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/url',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/controls/avatar/impl/avatar',
  'css!conws/widgets/team/impl/controls/avatar/impl/avatar'
], function (_, $, Marionette, Url, lang, template) {

  var AvatarView = Marionette.LayoutView.extend({

    template: template,

    templateHelpers: function () {
      return {
        type: this.model.getMemberType()
      };
    },

    ui: {
      profileImage: '.participant-picture > img',
      profileImageDefault: '.participant-picture > span'
    },

    // constructor for the 'add participant' listitem
    constructor: function AvatarView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      // render profile image
      this._displayProfileImage();
    },

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      // esoc-userprofile-img-{userid} - the common class for all profile pictures of given userid
      this.ui.profileImage.addClass("esoc-userprofile-img-" + this.model.get('id'));
      if (photoUrl) {
        var getPhotoOptions = this.model.connector.extendAjaxOptions({
          url: photoUrl,
          dataType: 'binary'
        });
        this._releasePhotoUrl();
        this.model.connector.makeAjaxCall(getPhotoOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                this.photoUrl = URL.createObjectURL(response);
                this.ui.profileImage.attr("src", this.photoUrl);
                this.ui.profileImageDefault.remove();
              } else {
                this.ui.profileImage.remove();
                this.ui.profileImageDefault.addClass(this._getPlaceholderImageClass());
              }
            }, this));
      } else {
        this.ui.profileImage.remove();
        this.ui.profileImageDefault.addClass(this._getPlaceholderImageClass());
      }
    },

    _getUserPhotoUrl: function () {
      var connection = this.model.connector.connection,
          cgiUrl     = new Url(connection.url).getCgiScript(),
          memberId   = this.model.get('id'),
          photoId    = this.model.get('photo_id');
      // If the photo id is not set, there was a problem retrieving it. It
      // does not make sense to try it once more from the client side, waste
      // time and server resources and litter the log by 404 errors.
      if (photoId) {
        // constant REST api path, because the service is not returning the photo_url
        var photoPath = _.str.sformat('api/v1/members/{0}/photo?v={1}', memberId, photoId);
        return Url.combine(cgiUrl, photoPath);
      }
    },

    _getPlaceholderImageClass: function () {
      return (this.model.getMemberType() === 'user')
          ? 'conws-avatar-user-placeholder'
          : (this.model.getMemberType() === 'group')
                 ? 'conws-avatar-group-placeholder'
                 : 'conws-avatar-role-placeholder';
    },

    _releasePhotoUrl: function () {
      if (this.photoUrl) {
        URL.revokeObjectURL(this.photoUrl);
      }
    }
  });

  return AvatarView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"participant-content binf-pull-left\"></div>\r\n<div class=\"participant-delete binf-pull-right\"></div>";
}});
Handlebars.registerPartial('conws_dialogs_addoreditrole_impl_roleparticipants_impl_participant.listitem', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.details',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"participant-picture binf-pull-left\"></div>\r\n<div class=\"participant-info binf-pull-left\">\r\n  <span class=\"name binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"email binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"email","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"email","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"title binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"department binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.department || (depth0 != null ? depth0.department : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"department","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.department || (depth0 != null ? depth0.department : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"department","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"office binf-pull-left\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.office || (depth0 != null ? depth0.office : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"office","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.office || (depth0 != null ? depth0.office : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"office","hash":{}}) : helper)))
    + "</span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_addparticipants_impl_participant.listitem.details', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem.delete',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"remove csui-icon conws-icon-cross\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeParticipant || (depth0 != null ? depth0.removeParticipant : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeParticipant","hash":{}}) : helper)))
    + "\"\r\n    aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.removeParticipantAria || (depth0 != null ? depth0.removeParticipantAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeParticipantAria","hash":{}}) : helper)))
    + "\"></span>";
}});
Handlebars.registerPartial('conws_dialogs_addoreditrole_impl_roleparticipants_impl_participant.listitem.delete', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem',[],function(){});
csui.define('conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/user',
  'esoc/widgets/userwidget/userwidget',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.details',
  'hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem.delete',
  'css!conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem'
], function (_, $, Marionette, TabableRegionBehavior, LayoutViewEventsPropagationMixin,
  UserModelFactory, UserWidget, Avatar, lang, itemTemplate, detailsTemplate,
  deleteTemplate) {

    var ParticipantPropertiesView = Marionette.ItemView.extend({

      template: detailsTemplate,

      templateHelpers: function () {
        return {
          type: this.model.getMemberType(),
          name: this.model.displayName(),
          email: this.model.displayEmail(),
          title: this.model.displayTitle(),
          department: this.model.displayDepartment(),
          office: this.model.displayOffice()
        };
      },

      ui: {
        personalizedImage: '.csui-icon-user',
        defaultImage: '.csui-icon-paceholder'
      },

      // constructor for the 'add participant' listitem
      constructor: function ParticipantPropertiesView(options) {
        options || (options = {});

        // apply properties to parent
        Marionette.ItemView.prototype.constructor.apply(this, arguments);
      },

      initialize: function () {
        this.avatar = new Avatar({ model: this.model });
      },

      onRender: function () {
        // render profile image
        if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
          var loggedUser = this.model.collection.context.getModel(UserModelFactory),
            userProfilePicOptions = {
              connector: this.model.connector,
              model: this.model,
              userid: this.model.get('id'),
              context: this.model.collection.context,
              showUserProfileLink: true,
              showMiniProfile: true,
              loggedUserId: loggedUser.get('id'),
              placeholder: this.$el.find('.participant-picture'),
              showUserWidgetFor: 'profilepic'
            };
          UserWidget.getUser(userProfilePicOptions);
        }
        else {
          this.$('.participant-picture').append(this.avatar.render().$el);
        }
      }
    });

    var ParticipantDeleteView = Marionette.ItemView.extend({

      template: deleteTemplate,

      templateHelpers: function () {
        return {
          removeParticipant: lang.addParticipantsRemove,
          removeParticipantAria: _.str.sformat(lang.removeParticipantAria, this.model.displayName())           
        };
      },

      events: {
        'click .remove': 'onRemoveOnClick',
        'keydown .remove': 'onRemoveOnKeyDown'
      },

      behaviors: {
        TabableRegion: {
          behaviorClass: TabableRegionBehavior
        }
      },

      constructor: function ParticipantDeleteView(options) {
        options || (options = {});

        // apply properties to parent
        Marionette.ItemView.prototype.constructor.apply(this, arguments);
      },

      onRemoveOnClick: function (e) {
        // stop propagation
        e.preventDefault();
        e.stopPropagation();
        // remove participant
        this.model.collection.remove(this.model);
      },

      onRemoveOnKeyDown: function (e) {
        // Enter, Space or DEL?
        if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 46) {
          // stop propagation
          e.preventDefault();
          e.stopPropagation();
          // remove participant
          this.model.collection.remove(this.model);
        }
      },

      // delete button is focused
      currentlyFocusedElement: function () {
        return this.$('.remove');
      }
    });

    var ParticipantListItemView = Marionette.LayoutView.extend({

      template: itemTemplate,

      tagName: 'li',

      className: 'binf-list-group-item conws-participant',

      regions: {
        content: '.participant-content',
        delete: '.participant-delete'
      },

      // constructor for the 'add participant' listitem
      constructor: function ParticipantListItemView(options) {
        options || (options = {});

        // apply properties to parent
        Marionette.LayoutView.prototype.constructor.apply(this, arguments);

        // listen to the change of the model
        this.listenTo(this.model, 'remove', this.onParticipantRemove);

        // propagate events to regions
        this.propagateEventsToRegions();
      },

      onRender: function () {
        // render content
        this.content.show(
          new ParticipantPropertiesView({
            model: this.model
          }));
        // render remove button
        this.delete.show(
          new ParticipantDeleteView({
            model: this.model
          }));
      },

      onParticipantRemove: function () {
        this._parent.selectedIndex = this._index;
      }
    });

    // add mixin
    _.extend(ParticipantListItemView.prototype, LayoutViewEventsPropagationMixin);

    // return view
    return ParticipantListItemView;
  });


/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/empty.roleparticipants',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-addoreditrole-emptyroleparticipants\">\r\n    <div class=\"conws-addoreditrole-emptyroleparticipants conws-empty_team\"></div>\r\n    <div class=\"conws-addoreditrole-emptyroleparticipants-msg\">\r\n        <p>"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</p>\r\n    </div>\r\n</div>";
}});
Handlebars.registerPartial('conws_dialogs_addoreditrole_impl_roleparticipants_impl_empty.roleparticipants', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/dialogs/addoreditrole/impl/roleparticipants/impl/empty.roleparticipants',[],function(){});
csui.define('conws/dialogs/addoreditrole/impl/roleparticipants/impl/empty.roleparticipants.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/empty.roleparticipants',
  'css!conws/dialogs/addoreditrole/impl/roleparticipants/impl/empty.roleparticipants'
], function (_, Marionette, lang, template) {

  var EmptyRoleParticipantsView = Marionette.LayoutView.extend({

    template: template,

    templateHelpers: {
      message: lang.rolePartcipantsWithNoparticipantsMessage
    },

    constructor: function EmptyRoleParticipantsView(options) {
      options || (options = {});

      this.context = options.context;
      this.connector = options.connector;

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    }

  });
  // return view
  return EmptyRoleParticipantsView;
});

/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/roleparticipants',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-addoreditrole-roleparticipants\">\r\n  <div class=\"conws-addoreditrole-roleparticipants-header\"></div>\r\n  <div class=\"conws-addoreditrole-roleparticipants-body\">\r\n    <div class=\"conws-addoreditrole-roleparticipants-left\">\r\n      <div class=\"conws-addoreditrole-roleparticipants-userpicker-title\">\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\r\n      </div>\r\n    </div>\r\n    <div class=\"conws-addoreditrole-roleparticipants-right\">\r\n      <div class=\"conws-addoreditrole-roleparticipants-search\">\r\n        <div class=\"conws-addoreditrole-roleparticipants-userpicker\">\r\n          <!-- user picker region -->\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"conws-addoreditrole-roleparticipants-members-body\">\r\n    <div class=\"conws-addoreditrole-roleparticipants-members\">\r\n    </div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('conws_dialogs_addoreditrole_impl_roleparticipants_impl_roleparticipants', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/dialogs/addoreditrole/impl/roleparticipants/impl/roleparticipants',[],function(){});
csui.define('conws/dialogs/addoreditrole/impl/roleparticipants/roleparticipants.view',[
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'conws/widgets/team/impl/participant.model',
  'conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem.view',
  'conws/dialogs/addoreditrole/impl/roleheader/roleheader.view',
  'conws/dialogs/addoreditrole/impl/roleparticipants/impl/empty.roleparticipants.view',
  'csui/controls/userpicker/userpicker.view',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/roleparticipants',
  'css!conws/dialogs/addoreditrole/impl/roleparticipants/impl/roleparticipants'
], function (_, Backbone, Marionette, base,
  LayoutViewEventsPropagationMixin, PerfectScrollingBehavior, Participant,
  ParticipantListItemView, RoleHeaderView, EmptyRoleParticipantsView, UserPicker, lang, template) {

    var ParticipantsListCollectionView = Marionette.CollectionView.extend({

      tagName: 'ul',

      className: 'binf-list-group',

      childView: ParticipantListItemView,

      constructor: function ParticipantsListCollectionView(options) {
        Marionette.CollectionView.call(this, options);
      },

      onRemoveChild: function (childView) {
        //listen to change the focus
        this.moveTabIndex(childView);
      },

      moveTabIndex: function (childView) {
        var numberOfChildren = this.children && this.children.length;
        if (numberOfChildren) {
          var targetIndex = this.selectedIndex;
          if (targetIndex === numberOfChildren) {
            targetIndex = targetIndex - 1;
          }
          var newFocus = this.children.findByModel(this.collection.at(targetIndex));
          newFocus && newFocus.$el.find('.participant-delete .conws-icon-cross').focus();
        }
      }
    });

    var RoleParticipantsView = Marionette.LayoutView.extend({

      template: template,

      regions: {
        HeaderRegion: '.conws-addoreditrole-roleparticipants-header',
        userPickerRegion: '.conws-addoreditrole-roleparticipants-userpicker',
        participantsRegion: '.conws-addoreditrole-roleparticipants-members'
      },

      behaviors: {
        PerfectScrolling: {
          behaviorClass: PerfectScrollingBehavior,
          contentParent: '.conws-addoreditrole-roleparticipants-members',
          suppressScrollX: true
        }
      },

      templateHelpers: {
        'title': lang.participantsTitle
      },

      _createHeaderControl: function () {
        var roleHeaderView = new RoleHeaderView({
          headerViewoptions: this.options,
          currentStep: 'step3'
        });
        return roleHeaderView;
      },

      _createEmptyRoleParticipantsView: function () {
        var emptyRoleParticipantsView = new EmptyRoleParticipantsView({
          options: this.options
        });
        return emptyRoleParticipantsView;
      },

      _createParticipantsListCollectionView: function () {
        var participantsListCollectionView = new ParticipantsListCollectionView({
          context: this.context,
          collection: _.extend(new Backbone.Collection(), {
            context: this.context,
            node: this.options.nodeModel,
            comparator: function (left, right) {
              return base.localeCompareString(left.get('display_name'), right.get('display_name'));
            }
          })
        });
        return participantsListCollectionView;
      },

      constructor: function RoleParticipantsView(options) {
        options || (options = {});

        this.context = options.context;
        this.connector = options.connector;

        // apply properties to parent
        Marionette.LayoutView.prototype.constructor.apply(this, arguments);

        //Listen to events that are triggered from wizard.step.view
        this.listenTo(this, 'set:initial:focus', this.onSetInitialFocus);

        // propagate events to regions
        this.propagateEventsToRegions();
      },

      onRender: function () {
        // user picker
        var user = new UserPicker({
          context: this.context,
          limit: 20,
          clearOnSelect: true,
          placeholder: lang.roleParticipantsUserPickerPlaceholder,
          disabledMessage: lang.roleParticipantsDisabledMemberMessage,
          onRetrieveMembers: _.bind(this.retrieveMembersCallback, this),
          prettyScrolling: true,
          initialActivationWeight: 100
        });
        this.HeaderRegion.show(this._createHeaderControl());
        this.userPickerRegion.show(user);
        user.$(".cs-search-icon").attr("aria-label", lang.roleParticipantsSearchAria);
        this.listenTo(user, 'item:change', this.onUserItemChanged);

        // participants list
        var participants = this._createParticipantsListCollectionView();

        // On edit role page. show existing participants while rendering
        if (!this.options.addrole && this.options.model) {
          _.each(this.options.model.get("members"), function (member) {
            var participant = new Participant(member, {
              connector: this.connector,
              collection: this.participants
            });
            participants.collection.add(participant);
          }, this)
        }

        // participants collection
        this.participants = participants.collection;
        this.participantView = participants;
        this.listenTo(this.participants, 'reset add change', this.onParticipantsChanged);
        this.listenTo(this.participants, 'remove', this.onParticipantsRemove);

        if (participants.collection.length === 0) {
          this.participantsRegion.show(this._createEmptyRoleParticipantsView());
        } else {
          this.participantsRegion.show(participants);
          this.participantsRegion.$el.addClass("conws-addoreditrole-roleparticipants-members-exist");
        }
      },

      onAfterShow: function () {
        _.each(this.participantView.children._views, function (view) {
          view.delete && view.delete.currentView && view.delete.currentView.trigger("dom:refresh");
        }, this)
        this.onSetInitialFocus();
      },

      onSetInitialFocus: function () {
        //set initial focus on this element
        this.userPickerRegion.currentView.$el.find("[class='csui-control-userpicker'] input[type='text']").focus();
      },

      onUserItemChanged: function (e) {
        // if member is disabled prevent from being added
        if (e.item.get('disabled')) {
          return;
        }
        // otherwise create participant and ...
        var attributes = _.extend(e.item.attributes, {
          display_name: e.item.get('name_formatted')
        });
        var participant = new Participant(attributes, {
          connector: this.connector,
          collection: this.participants
        });
        // ... add to participants list
        if (this.participants.length === 0) {
          this.participantsRegion.$el.addClass("conws-addoreditrole-roleparticipants-members-exist");
          var participants = this._createParticipantsListCollectionView();
          participants.collection = this.participants;
          participants.collection.add(participant);
          this.participantsRegion.show(participants);
          this.listenTo(participants.collection, 'reset add change', this.onParticipantsChanged);
          this.listenTo(participants.collection, 'remove', this.onParticipantsRemove);
          this.trigger('update:scrollbar');
        } else {
          this.participants.add(participant);
        }
      },

      retrieveMembersCallback: function (args) {
        var self = this;

        // check team members and dialog members and if the
        // participant is found disable it in the results.
        args.collection.each(function (current) {
          var exists = false;
          if (self.participants.findWhere({ id: current.get('id') })) {
            exists = true;
          }
          current.set('disabled', exists);
        });
      },

      onParticipantsRemove: function () {
        this.onParticipantsChanged();
        if (this.participants && this.participants.length === 0) {
          this.userPickerRegion.currentView.currentlyFocusedElement().focus();
          // when there are no participants show emptyRoleParticipantsView
          this.participantsRegion.$el.removeClass("conws-addoreditrole-roleparticipants-members-exist");
          this.participantsRegion.show(this._createEmptyRoleParticipantsView());
        }
      },

      onParticipantsChanged: function () {
        // whenever the participants change, update the perfect scrollbar
        this.trigger('update:scrollbar');
      }
    });

    // add mixin
    _.extend(RoleParticipantsView.prototype, LayoutViewEventsPropagationMixin);

    // return view
    return RoleParticipantsView;
  });

csui.define('conws/dialogs/addoreditrole/addoreditrole.wizard',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/contexts/factories/connector',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'csui/utils/log',
  'csui/controls/progressblocker/blocker',
  'csui/models/permission/nodepermission.model',
  'conws/controls/wizard/wizard.view',
  'conws/dialogs/addoreditrole/impl/roledetails/roledetails.view',
  'conws/dialogs/addoreditrole/impl/rolepermissions/rolepermissions.view',
  'conws/dialogs/addoreditrole/impl/roleparticipants/roleparticipants.view',
], function (_, $, ConnectorFactory, lang, log, BlockingView, NodePermissionModel, WizardView, RoleDetailsView, RolePermissionsView, RoleParticipantsView) {
  

  var defaultOptions = {
    initialSelection: [],
    dialogTitle: lang.dialogTitle
  };

  function addOrEditRoleWizard(options) {
    options || (options = {});
    this.options = _.defaults(options, defaultOptions);
    this.options.connector || (this.options.connector = this._getConnector(this.options));

    if (!this.options.connector) {
      var msg = lang.missingConnector;
      log.error(msg) && console.error(msg);
      throw new Error(msg);
    }
  }

  _.extend(addOrEditRoleWizard.prototype, {

    show: function () {
      this._showWizard();
      this._deferred = $.Deferred();
      return this._deferred.promise();
    },

    _showWizard: function () {
      this._steps = this._createWizardSteps();
      this._wizard = new WizardView({ steps: this._steps });
      BlockingView.imbue(this._wizard);
      this._wizard.show(this._wizard.options);
      this._wizard.on('save:result', this.onClickFinishButton, this);
      this._wizard.on('closing:wizard', this.onClickCancelButton, this);
    },

    _RoleDetailsView: function () {
      var roleDetailsView = new RoleDetailsView({
        addrole: this.options.addrole,
        teamLead: true,
        isFirstRole: this.options.isFirstRole
      });
      if (!this.options.addrole && this.options.model && this.options.model.get("right_id_expand")) {
        roleDetailsView.options.name = this.options.model.get("right_id_expand").name,
          roleDetailsView.options.description = this.options.model.get("right_id_expand").description,
          roleDetailsView.options.team_lead = this.options.model.get("right_id_expand").team_lead
      }
      roleDetailsView.on('required:field:changed', function () {
        var rolename_length = roleDetailsView.LeftRegion.currentView.$el.find("div[data-alpaca-container-item-name='role_name']").find("input[type='text']").val().length;
        if (rolename_length) {
          this._wizard.currentView.updateButton('next', { disabled: false });
          this._wizard.currentView.updateButton('done', { disabled: false });
        } else {
          this._wizard.currentView.updateButton('next', { disabled: true });
          this._wizard.currentView.updateButton('done', { disabled: true });
        }
      }, this);
      return roleDetailsView;
    },

    _RolePermissionsView: function () {
      var rolePermissionsView = new RolePermissionsView({
        addrole: this.options.addrole,
        model: this.options.model,
        isContainer: this.options.nodeModel ? this.options.nodeModel.get('container') : true,
        nodeModel: this.options.nodeModel
      });
      return rolePermissionsView;
    },

    _RoleParticipantsView: function () {
      var roleParticipantsView = new RoleParticipantsView(this.options);
      return roleParticipantsView;
    },

    dialogClassName: function () {
      var className = 'target-browse';
      if (this.options && this.options.userClassName) {
        className = className + " " + this.options.userClassName;
      }
      return className;
    },

    _createWizardSteps: function () {
      var options = this.options,
        rolePickerTitleId = 'rolePickerHeader',
        permissionLevelDescId = _.uniqueId('permissionLevel'),
        step1, step2, step3;
      step1 = {
        title: options.dialogTitle,
        view: this._RoleDetailsView(),
        className: this.dialogClassName() + ' csui-permissions-level conws-addoreditrole-dialog',
        nextButton: true,
        disableNext: this.options.addrole ? true : false,
        doneButtonLabel: lang.doneButtonLabel,
        disableDone: this.options.addrole ? true : false,
        doneButton: true,
        largeSize: true,
        attributes: { 'aria-labelledby': rolePickerTitleId }
      };
      step2 = {
        title: options.dialogTitle,
        nextButtonLabel: lang.nextButtonLabel,
        nextButton: true,
        disableNext: false,
        doneButtonLabel: lang.doneButtonLabel,
        disableDone: false,
        doneButton: true,
        largeSize: true,
        view: this._RolePermissionsView(),
        className: this.dialogClassName() + ' csui-permissions-level conws-addoreditrole-dialog',
        attributes: {
          'aria-labelledby': rolePickerTitleId,
          'aria-describedby': permissionLevelDescId
        }
      };
      step3 = {
        title: options.dialogTitle,
        doneButtonLabel: lang.doneButtonLabel,
        disableDone: false,
        doneButton: true,
        largeSize: true,
        view: this._RoleParticipantsView(),
        className: this.dialogClassName() + ' csui-permissions-level conws-addoreditrole-dialog',
        attributes: { 'aria-labelledby': rolePickerTitleId }
      };
      return [step1, step2, step3];
    },

    onHideDialog: function () {
      if (this._deferred) {
        if (this._result) {
          this._deferred.resolve(this._result);
        } else if (this._deferred.state() === 'pending') {
          // When the dialog is cancelled, reject the promise without error
          this._deferred.reject({ cancelled: true });
        }
      }
    },

    onClickCancelButton: function () {
      this.onHideDialog();
    },

    onClickFinishButton: function () {
      var role_name, role_description, team_lead, permissions, applyToSubItems, isContainer, participants;
      if (this) {
        var roleDetailsView = this.getRoleDetailsView(),
          rolePermissionsView = this.getPermissionsView();
        if (roleDetailsView.LeftRegion && roleDetailsView.LeftRegion.currentView) {
          role_name = roleDetailsView.LeftRegion.currentView.getValues().role_name;
          role_description = roleDetailsView.LeftRegion.currentView.getValues().role_description;
        }
        team_lead = roleDetailsView.RightRegion && roleDetailsView.RightRegion.currentView &&
          roleDetailsView.RightRegion.currentView.getValues().team_lead;

        // if we directly save from first dialog then permissions view may not be defined
        if (rolePermissionsView.PickerRegion && rolePermissionsView.PickerRegion.currentView) {
          permissions = rolePermissionsView.PickerRegion.currentView.getSelectedPermissions();
          if (permissions === null && !!rolePermissionsView.lastSelectedPermLevel &&
            rolePermissionsView.lastSelectedPermLevel === NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
            permissions = rolePermissionsView.lastSelectedCustomPermissions;
          }
          isContainer = (this.options.nodeModel && this.options.nodeModel.get("container")) ? true : false;
          if (rolePermissionsView.RightRegion && rolePermissionsView.RightRegion.currentView) {
            // 0 - This item, 1 - Subitems, 2 - This Item and Subitems, 3 - This Item and Immediate Subitems
            applyToSubItems = 0;
            if (isContainer) {
              applyToSubItems = rolePermissionsView.RightRegion.currentView.getValues().subitems_inherit ? 2 : 0;
            }
          }
        }
        // if we directly save from first or second dialog then participants view may not be defined
        if (this.getParticipantsView().participants) {
          participants = [];
          _.each(this.getParticipantsView().participants.models, function (participantModel) {
            participants.push(participantModel.get("id"));
          })
        }
        this._result = {
          role_name: role_name,
          role_description: role_description,
          team_lead: team_lead,
          permissions: permissions,
          apply_to: applyToSubItems,
          participants: participants
        };
        this._wizard.destroy();
        this.onHideDialog();
      }
      else {
        this._wizard.currentView.updateButton('next', { disabled: true });
      }
    },

    //Private function with assumes either container or nodes exists.
    _getConnector: function (options) {
      var connector;
      if (options.context) {
        connector = options.context.getObject(ConnectorFactory);
      } else if (options.initialSelection || options.initialContainer) {
        var initalSelection = options.initialSelection,
          nodes = initalSelection ? (_.isArray(initalSelection) ? initalSelection :
            initalSelection.models) : undefined,
          node = options.initialContainer || nodes[0];
        connector = node && node.connector;
      }
      return connector;
    },

    getRoleDetailsView: function () {
      return this._steps[0].view;
    },

    getPermissionsView: function () {
      return this._steps[1].view;
    },

    getParticipantsView: function () {
      return this._steps[2].view;
    }

  });

  return addOrEditRoleWizard;

});

csui.define('conws/dialogs/applyrolepermissions/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/dialogs/applyrolepermissions/impl/nls/root/lang',{
  applyRolePermissionHeaderTitle: 'Apply permissions',
  deleteRolePermissionHeaderTitle: 'Delete {0}',
  removeRolePermissionHeaderTitle: 'Remove {0}',
  SubItemsInherit: 'Apply to sub-items',
  applyToItem: 'Permissions will be applied to all items in {0}.',
  deleteToItem: '{0} will be deleted and permissions will be removed from all items in {1}',
  removeToItem: 'Permissions will be removed from all items in {0}'
});



/* START_TEMPLATE */
csui.define('hbs!conws/dialogs/applyrolepermissions/impl/apply.role.permissions',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"conws-apply-role-permission-content\">\r\n  <span class=\"conws-apply-role-permission-message\"></span>\r\n</div>\r\n<div class=\"conws-apply-role-permission-switch\">\r\n</div>";
}});
Handlebars.registerPartial('conws_dialogs_applyrolepermissions_impl_apply.role.permissions', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/dialogs/applyrolepermissions/impl/apply.role.permissions',[],function(){});
csui.define('conws/dialogs/applyrolepermissions/apply.role.permissions.view',[
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/models/form',
    'conws/dialogs/addoreditrole/impl/tabbable.form.view',
    'i18n!conws/dialogs/applyrolepermissions/impl/nls/lang',
    'hbs!conws/dialogs/applyrolepermissions/impl/apply.role.permissions',
    'css!conws/dialogs/applyrolepermissions/impl/apply.role.permissions'
], function (_, Marionette, FormModel, TabbableFormView, lang, template) {

    ApplyRolePermissionsView = Marionette.LayoutView.extend({

        template: template,

        ui: {
            applyRolePermissionMsg: '.conws-apply-role-permission-message'
        },

        regions: {
            ContentRegion: '.conws-apply-role-permission-switch'
        },

        templateHelpers: function () {
            return {
                title: this.model.get('title')
            }
        },

        constructor: function ApplyRolePermissionsView(options) {
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            this.listenTo(this.model, 'change', this.render);
        },

        onRender: function () {

            var message = "";
            if (this.options.removePermission) {
                if (!!this.options.permissionModel && this.options.permissionModel.isRoleDelete !== undefined && !this.options.permissionModel.isRoleDelete) {
                    message = _.str.sformat(lang.removeToItem, this.options.model.get("name"));
                } else {
                    var roleName = this.options.permissionModel.get("right_id_expand") &&
                        this.options.permissionModel.get("right_id_expand").name_formatted;
                    message = _.str.sformat(lang.deleteToItem, roleName, this.options.model.get("name"));
                }
            }
            else {
                message = _.str.sformat(lang.applyToItem, this.options.model.get("name"));
            }
            this.ui.applyRolePermissionMsg.html(message);

            var SubItemsInheritForm = {
                "data": {
                    "subitems_inherit": true
                },
                "options": {
                    "fields": {
                        "subitems_inherit": {
                            "hidden": false,
                            "hideInitValidationError": true,
                            "label": lang.SubItemsInherit,
                            "readonly": false,
                            "type": "checkbox"
                        }
                    },
                    "label": ""
                },
                "schema": {
                    "properties": {
                        "subitems_inherit": {
                            "readonly": false,
                            "required": false,
                            "title": lang.SubItemsInherit,
                            "type": "boolean"
                        }
                    },
                    "type": "object"
                }
            },

                SubItemsInheritFormView = new TabbableFormView({
                    model: new FormModel(SubItemsInheritForm),
                    mode: "create"
                });

            if (this.options.removePermission) {
                // for permission deletion based on below conditions, we need to show the apply to subitems checkbox in the dialog
                if (!!this.options.permissionModel && this.options.permissionModel.isRoleDelete !== undefined && !this.options.permissionModel.isRoleDelete) {
                    this.ContentRegion.show(SubItemsInheritFormView);
                }
            } else {
                // for permission updation we need to always showcase the checkbox in the dialog
                this.ContentRegion.show(SubItemsInheritFormView);
            }
        }
    });

    return ApplyRolePermissionsView;
});
csui.define('conws/dialogs/applyrolepermissions/impl/header/apply.role.permissions.header.view',[
    'csui/lib/underscore',
    'csui/widgets/permissions/impl/edit/apply.permission/impl/header/apply.permission.header.view',
    'i18n!conws/dialogs/applyrolepermissions/impl/nls/lang'
], function (_, ApplyPermissionHeaderView,
    lang) {
        

        var ApplyRolePermissionHeaderView = ApplyPermissionHeaderView.extend({

            templateHelpers: function () {
                var headerTitle = "";
                if (this.options.removePermission && this.options.permissionModel) {
                    var memberName = this.options.permissionModel.get("right_id_expand") &&
                        this.options.permissionModel.get("right_id_expand").name_formatted;
                    if (this.options.permissionModel.isRoleDelete) {
                        headerTitle = _.str.sformat(lang.deleteRolePermissionHeaderTitle, memberName);
                    } else {
                        headerTitle = _.str.sformat(lang.removeRolePermissionHeaderTitle, memberName);
                    }
                } else {
                    headerTitle = lang.applyRolePermissionHeaderTitle;
                }
                return {
                    title: headerTitle
                };
            },

            constructor: function ApplyRolePermissionHeaderView(options) {
                options || (options = {});
                ApplyPermissionHeaderView.prototype.constructor.apply(this, arguments);
            }
        });

        return ApplyRolePermissionHeaderView;
    });
// Lists explicit locale mappings and fallbacks
csui.define('conws/utils/commands/nls/commands.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


// Defines localizable strings in the default language (English)
csui.define('conws/utils/commands/nls/root/commands.lang',{
  CommandNameEmail: 'Send e-mail',
  CommandNameExport: 'Download',
  CommandNameAddParticipant: 'Add participants',
  CommandNameExportParticipants: 'Download list of participants',
  CommandNamePrintParticipants: 'Print list of participants',
  CommandNameShowRoles: 'Show roles',
  CommandNameRemoveParticipant: 'Remove from team',
  CommandNameAddRole: 'Add role',
  CommandNameEditRole: 'Edit role',
  CommandNamePrintRoles: 'Print list of roles',
  CommandNameExportRoles: 'Download list of roles',
  CommandNameShowDetails: 'Show details',
  CommandNameDeleteRole: 'Delete',
  CommandNameAddConnectedWorkspace: 'Add business workspace',
  RemoveParticipantTitleSingle: 'Remove participant',
  RemoveParticipantTitleMultiple: 'Remove participants',
  RemoveParticipantMessage: 'Removing participants from the team will also remove them from their roles.',
  RemoveParticipantErrorMessageDefault: 'Cannot remove one or more participants.',
  DeleteRoleTitleSingle: 'Delete role',
  DeleteRoleTitleMultiple: 'Delete roles',
  DeleteRoleMessageNoParticipantsAffected: 'When you delete this role, no participant will be removed from the team: The role is empty or all participants of this role are members of other team roles.',
  DeleteRoleMessageParticipantsAffectedSingle: 'When you delete this role, 1 participant will be removed from the team.',
  DeleteRoleMessageParticipantsAffectedMultiple: 'When you delete this role, {0} participants will be removed from the team.',
  ErrorLoadingAddItemMenu: 'Cannot load workspace types to the Add menu.',
  AddConwsMetadataDialogTitle: 'Create {0}',
  BusinessWorkspace: 'business workspace',
  AddConwsMetadataDialogAddButtonTitle: 'Save',
  BusinessWorkspaceTypeName: 'Business Workspace',
  BusinessWorkspaceSuccessfullyCreated: '{0} was successfully created.',
  nameIsGeneratedAutomatically : 'Workspace name is generated automatically.',
  errorGettingCreateForm: 'Error getting form for workspace creation.',
  CommandNameAddCONWSTemplate: 'Add business workspace template',
  ErrorAddingSubfolderToNodesTable: 'Failed to add subfolder to the nodestable',

  ServerCommandNameDeleteRelatedItem: 'Remove related item',
  CommandNameDeleteRelatedItem: 'Remove relationships',
  CommandVerbDeleteRelatedItem: 'remove',
  DeleteRelatedItemsNoneMessage: "No relationship removed.",
  DeleteOneRelatedItemSuccessMessage: "One relationship successfully removed.",
  DeleteSomeRelatedItemsSuccessMessage: "{0} relationships successfully removed.",
  DeleteManyRelatedItemsSuccessMessage: "{0} relationships successfully removed.",
  DeleteOneRelatedItemConfirmMessage: "Do you want to remove the relationship to '{1}'?",
  DeleteSomeRelatedItemsConfirmMessage: "Do you want to remove {0} relationships?",
  DeleteManyRelatedItemsConfirmMessage: "Do you want to remove {0} relationships?",

  CommandNameAddRelatedItem: 'Add relationships',
  CommandVerbAddRelatedItem: 'add',
  AddRelatedItemsNoneMessage: "No relationship added.",
  AddOneRelatedItemSuccessMessage: "One relationship successfully added.",
  AddSomeRelatedItemsSuccessMessage: "{0} relationships successfully added.",
  AddManyRelatedItemsSuccessMessage: "{0} relationships successfully added.",

  AddRoleSuccess: '{0} added successfully',
  EditRoleSuccess: '{0} updated successfully',
  BusinessWorkspaceRole: 'Business Workspace Role',
  DeletePermissionCommandForSubItems: 'Remove role',
  ToolbarItemEditRolePermission: 'Edit role permissions',
  DeleteRoleCommandSuccessMessage: "{0} was deleted successfully",
  DeleteRoleCommandFailMessage: "Failed to delete {0}."
});


/**
 * Created by stefang on 11.09.2015.
 */

csui.define( 'conws/utils/commands/tabletoolbar.extension',[
  "csui/lib/jquery", "csui/lib/underscore", "csui/utils/url",
  "csui/controls/globalmessage/globalmessage",
  'csui/controls/toolbar/toolitem.model',
  'i18n!conws/utils/commands/nls/commands.lang',
  'csui/utils/base'
], function ($, _, Url, GlobalMessage, ToolItemModel, lang, base) {

  function ToolbarExtension () {}

  _.extend(ToolbarExtension.prototype,{

    _addMenuItems: function (toolbarItems,businessWorkspaceTypes) {
      var toolItems = [];
      businessWorkspaceTypes.forEach(function(bwtype) {
        // note: signature of toolbar item must match with a command or indicates entry as separator
        if (bwtype.templates.length>0) {
          bwtype.templates.forEach(function(tmpl){
            // TODO: setting the sub type name for the sub type 848 to Business Workspace, this should be returned with the businessworkspacetypes REST call.
            var subTypeName = tmpl.subType === 848 ? lang.BusinessWorkspaceTypeName : '';
            var toolItem = new ToolItemModel({
              signature: "AddConnectedWorkspace",
              name: tmpl.name,
              type: tmpl.subType,
              group: 'conws',
              commandData: { wsType: bwtype, subType: tmpl.subType, subTypeName: subTypeName, template: tmpl }
            });
            toolItems.push(toolItem);
          });
        }
      });
      if (toolItems.length>0) {
        toolItems.sort(function(a,b) {
          var aname = a.get("name"),
              bname = b.get("name"),
              result = base.localeCompareString(aname,bname,{usage:"sort"});
          return result;
        });
        toolItems.forEach(function(toolItem){
          toolbarItems.push(toolItem);
        });
      }
    },

    OnUpdateToolbar: function (args) {
      var done = args.async(),
        //context = args.context,
          container = args.container,
        //addableTypes = args.addableTypes,
          toolbarItems = args.toolbarItems,
          conwsTemplateToolItem = _.find(toolbarItems, function (toolItem) {
            if (toolItem.attributes.type === 848) {
              return toolItem;
            }
          });

      if (!!conwsTemplateToolItem) {
        conwsTemplateToolItem.set("signature", "AddCONWSTemplate");
        conwsTemplateToolItem.set("group", "conws");
      }

	  // first get all addable wstypes for this container
      // URL is like: http://vmstg-dev4/OTCS/cs.exe/api/v1/nodes/{id}/businessworkspacetypes
      var deferred = $.Deferred();
      var getWsTypesUrl = Url.combine(container.urlBase(), 'businessworkspacetypes');
      var ajaxOptions = container.connector.extendAjaxOptions({
        type: 'GET',
        url: getWsTypesUrl
      });

      var that = this;
      container.connector.makeAjaxCall(ajaxOptions)
          .done(function (response, statusText, jqxhr) {

            if (response && response.businessworkspacetypes && response.businessworkspacetypes.length>0) {
              that._addMenuItems(toolbarItems,response.businessworkspacetypes);
            }

            deferred.resolve.apply(deferred, arguments);
            done();
          })
          .fail(function (jqXHR, statusText, error) {

            // show failure message
            var linesep = "\r\n",
                lines = [];
            if (statusText!=="error") {
              lines.push(statusText);
            }
            if (jqXHR.responseText) {
              var respObj = JSON.parse(jqXHR.responseText);
              if (respObj && respObj.error) {
                lines.push(respObj.error);
              }
            }
            if (error) {
              lines.push(error);
            }
            var errmsg = lines.length>0 ? lines.join(linesep) : undefined;
            GlobalMessage.showMessage("error",lang.ErrorLoadingAddItemMenu,errmsg);
            deferred.reject.apply(deferred, arguments);
            done();
          });

    }
  });

  return function (tableToolbarView) {

    //tableToolbarView.on('before:updateAddToolbar', _.bind(ToolbarExtension.OnUpdateToolbar,ToolbarExtension) );
    var extension = new ToolbarExtension();
    //tableToolbarView.on('before:updateAddToolbar', extension.OnUpdateToolbar.bind(this) );
    //tableToolbarView.on('before:updateAddToolbar', _.bind(extension.OnUpdateToolbar,extension) );
    tableToolbarView.on('before:updateAddToolbar', function() { extension.OnUpdateToolbar.apply(extension,arguments);} );

  };

});
csui.define('conws/utils/commands/permissions/permissions.dropdown.menu.items.extension',['i18n!conws/utils/commands/nls/commands.lang'
], function (lang) {
    
    return {
        dropdownMenuList: [
            {
                signature: 'AddOrEditRole',
                name: lang.CommandNameAddRole
            }
        ]
    };

});
csui.define('conws/utils/commands/permissions/permissions.list.toolbaritems.extension',['i18n!conws/utils/commands/nls/commands.lang'
], function (lang) {
    
    return {
        inlineToolbar: [
            {
                signature: "AddOrEditRole",
                name: lang.CommandNameEditRole,
                icon: "icon icon-toolbar-edit-role",
                svgId: "themes--carbonfiber--image--generated_icons--action_view_column32"
            },
            {
                signature: "DeleteRole",
                name: lang.DeleteRoleTitleSingle,
                icon: "icon icon-toolbar-delete",
                svgId: "themes--carbonfiber--image--generated_icons--action_delete32"
            },
            {
                signature: "EditRolePermission",
                name: lang.ToolbarItemEditRolePermission,
                icon: "icon icon-toolbar-edit",
                svgId: "themes--carbonfiber--image--generated_icons--action_edit32"
            }
        ]
    };

});
csui.define('conws/widgets/header/impl/headertoolbaritems.masks',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  

  // Keep the keys in sync with conws/widgets/header/impl/headertoolbaritems
  var toolbars = ['rightToolbar','delayedActionsToolbar'];

  function ToolbarItemsMasks(options) {
    var globalMask;    
    
    // Create and populate masks for every toolbar
    this.toolbars = _.reduce(toolbars, function (toolbars, toolbar) {
      globalMask = toolbars[toolbar];

      if (!globalMask) {
        globalMask = new GlobalMenuItemsMask();			
      }

      var mask = new ToolItemMask(globalMask, { normalize: false }),
        source = options[toolbar];
      if (source) {
        mask.extendMask(source);
      }
      // Enable restoring the mask to its initial state
      mask.storeMask();
      toolbars[toolbar] = mask;
      return toolbars;
    }, {});
  }

  ToolbarItemsMasks.toolbars = toolbars;

  return ToolbarItemsMasks;

});

/**
 * Created by stefang on 14.09.2015.
 */
csui.define('conws/utils/commands/addconws',['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/base',
  'csui/utils/log',
  'csui/models/command',
  'csui/models/node/node.model',
  'i18n!conws/utils/commands/nls/commands.lang',
  // style conws-initializing and conws-add-workspace
  //'css!xecmpf/controls/property.panels/reference/impl/reference.panel'
], function (require, $, _, base, log,
    CommandModel,
    NodeModel,
    lang) {

  var forwardToTable = false;

  var AddWorkspaceCommand = CommandModel.extend({

    defaults:{
      signature: 'AddConnectedWorkspace',
      name: lang.CommandNameAddConnectedWorkspace,
      verb: "create",//lang.CommandVerbCopy,
      doneVerb: "created",//lang.CommandDoneVerbCopy,
      scope: 'single'
    },

    enabled: function(status){
      return true;
    },

    execute: function (status, options) {

      var deferred = $.Deferred(),
          data = status.data || {},
          container = status.container || {},
          wsType = data.wsType || {},
          template = data.template || {},
          subType = data.subType,
          subTypeName = data.subTypeName,
          newNode = new NodeModel({
            "type": subType, //options.addableType,
            "type_name": subTypeName,
            "container": true,
            "name": "", // start with empty name
            "parent_id": container.attributes.id,
            "rm_enabled": wsType.rm_enabled,
            "sub_folder_id": 0
          }, {
            connector: status.container.connector
          });

      //status.container.cmdContainer = "AddConwsContainer";
      //newNode.cmdNode = "AddConwsNode";

      if (forwardToTable) {
        status.forwardToTable = true;
        deferred.resolve(newNode);
      }
      else {
        status.suppressSuccessMessage = true;
        csui.require(['csui/models/nodes',
          'csui/utils/commandhelper',
          'csui/widgets/metadata/metadata.add.item.controller',
          'csui/dialogs/modal.alert/modal.alert',
          'csui/controls/globalmessage/globalmessage',
          'conws/models/workspacecreateforms',
          'conws/models/metadata.controller',
          'csui/behaviors/default.action/default.action.behavior',
          'csui/utils/contexts/factories/next.node'
        ], function (NodeCollection,
            CommandHelper,
            MetadataAddItemController,
            ModalAlert,
            GlobalMessage,
            WorkspaceCreateFormCollection,
            WorkspaceMetadataController,
            DefaultActionBehavior,
            NextNodeModelFactory
        ) {

          var metadataAddItemController = new MetadataAddItemController();
          options.dialogTitle = _.str.sformat(lang.AddConwsMetadataDialogTitle,template.name||lang.BusinessWorkspace);
          options.addButtonTitle = lang.AddConwsMetadataDialogAddButtonTitle;
          // substitute nodes list, so we do not change the selection!
          status.nodes = new NodeCollection([newNode]);

          //status.cmdStatus = "AddConwsStatus";
          //status.nodes.cmdNodes = "AddConwsNodes";
          //options.cmdOptions = "AddConwsOptions";

          // Override the default form source for the creation dialog
          // and the default controller to create the new object
          options = _.extend({
            formCollection: new WorkspaceCreateFormCollection(undefined, {
              metadataAddItemController : metadataAddItemController,
              node: status.container,
              type: subType, //options.addableType
              wsType: wsType,
              template: template
            }),
            metadataController: new WorkspaceMetadataController(undefined, {
              type: subType,
              wsType: wsType,
              template: template,
              collection: status.collection
            })
          }, options);

          var formCollection = options.formCollection;

          // methods for handling of name field: set readonly style and placeholder in name field.
          function hideNameAndView() {
            // hide initial place holder as we don't have the read-only information from the server
            var dialog = metadataAddItemController.dialog;
            if (dialog && dialog.$el) {
              dialog.$el.addClass("conws-initializing");
              formCollection.off(null,hideNameAndView);
            }
          }
          function unhideNameAndView() {
            // make name field visible again.
            var dialog = metadataAddItemController.dialog;
            if (dialog && dialog.$el) {
              dialog.$el.removeClass("conws-initializing");
              formCollection.off(null,unhideNameAndView);
            }
          }

          function successWithLinkMessage() {
            var message = _.str.sformat(lang.BusinessWorkspaceSuccessfullyCreated, newNode.get('name'));
            var msgOptions = {
              context: status.context,
              nextNodeModelFactory: NextNodeModelFactory,
              link_url: DefaultActionBehavior.getDefaultActionNodeUrl(newNode),
              targetFolder: newNode
            };
            GlobalMessage.showMessage('success_with_link', message, undefined, msgOptions);
          }

          // show node in table or show success message
          function showNodeOrMessage() {
            var update = false;
            status.collection.forEach(function (item) {
              if (item.get("id") === newNode.get("id")) {
                item.set(newNode.attributes);
                update = true;
              }
            });
            if (!update) {
              var folder_id = status.collection.node.get('id'),
                  parent_id = newNode.get('parent_id'),
                  sub_folder_id = newNode.get('sub_folder_id');
              if (folder_id === parent_id || folder_id === -parent_id) {
                  status.collection.add(newNode, {at: 0});
              } else {
                if ( folder_id !== sub_folder_id && sub_folder_id !== 0 ) { //CWS-5155
                  var sub_folder = new NodeModel( {id: sub_folder_id }, { connector: status.container.connector, collection: status.collection });
                  sub_folder.fetch( { success: function () {
                    if ( sub_folder.get('parent_id') === folder_id ) {
                      if (status.collection.findWhere({id: sub_folder.get("id")}) === undefined) {
                        sub_folder.isLocallyCreated = true;
                        status.collection.add(sub_folder, {at: 0});
                      }
                    }
                    // as the workspace got created at different place
                    // show message after subFolder added to the nodes table
                    successWithLinkMessage();
                  }, error: function(err) {
                    ModalAlert.showError(lang.ErrorAddingSubfolderToNodesTable);
                    successWithLinkMessage();
                  }});
                } else {
                  // simply show message If the workspace got created
                  // in target location (XYZ folder) but created from (ABC folder)
                  successWithLinkMessage();
                }
              }
            }
          }

          // set special class on the dialog, so we can give our own styles on the dialog
          formCollection.on("request",function() {
            var dialog = metadataAddItemController.dialog;
            if (dialog && dialog.$el) {
              dialog.$el.addClass("conws-add-workspace");
            }
          });

          formCollection.once("request",hideNameAndView); // hide when forms is fetched first time
          formCollection.once("sync",unhideNameAndView); // unhide when forms have been fetched
          formCollection.once("error",unhideNameAndView); // unhide also in error case
          formCollection.on("sync",function(){ updateNameAndView(newNode,formCollection,metadataAddItemController);});
          formCollection.on("error",function(model, response, options){
              var errmsg = response && (new base.Error(response)).message || lang.errorGettingCreateForm;
              log.error("Fetching the create forms failed: {0}",errmsg) && console.error(log.last);
              ModalAlert.showError(errmsg);
          });

          metadataAddItemController
              .displayForm(status, options)
              .then(function () {
                newNode.isLocallyCreated = true;
                showNodeOrMessage();
                deferred.resolve.apply(deferred, arguments);
              })
              .fail(function (error) {
                if (error instanceof Error) {
                  deferred.reject(error);
                } else {
                  // cancel clicked or escape pressed
                  deferred.reject();
                }
              });
          // set controller, so unit tests can get the view and wait for end of rendering.
          status.metadataAddItemController = metadataAddItemController;
        }, function (error) {
          deferred.reject(error);
        });
      }

      return deferred.promise();
    }
  });

  function updateNameAndView (nodeModel, formCollection, metadataAddItemController) {
    // we have special behavior for the name field, depending on the forms result.
    // so we put the code here, where we have access to the name field in the dialog header.
    var general = formCollection.at(0);
    if (!nodeModel.get("id")) {
      // due to LPAD-50061, the form collection is fetched after save.
      // to avoid CWS-1140, we change the name only if id is not set.
      var data = general.get("data");
      if (data) {
        var name = data.name;
        log.debug("name fetched and used: {0}",name) && console.log(log.last);
        nodeModel.set("name",name);
      } else {
        // if no server data object is set, then we set an empty name.
        log.debug("name set to empty.") && console.log(log.last);
        nodeModel.set("name","");
      }
    }
    var metadataView = metadataAddItemController.metadataAddItemPropView,
        headerView = metadataView && metadataView.metadataHeaderView,
        nameView = headerView && headerView.metadataItemNameView;
    if (nameView) {
      var gs = general.get("schema"),
          isReadOnly = (gs && gs.properties && gs.properties.name && gs.properties.name.readonly) ? true : false,
          placeHolder = isReadOnly ? lang.nameIsGeneratedAutomatically : undefined;
      nameView.setPlaceHolder(placeHolder);
      if (isReadOnly && metadataView && metadataView.metadataPropertiesView) {
        metadataView.metadataPropertiesView.once("render:forms",function() {
		  //If read only, remove the role for the place holder text
          this.options.metadataView.metadataHeaderView.metadataItemNameView.$el.find('span.title').removeAttr("role");
		  var focusEl = this.currentlyFocusedElement();
          if (focusEl) {
            focusEl.trigger('focus');
          }
        });
      }
    }
  }

  return AddWorkspaceCommand;
});

csui.define('conws/utils/commands/addconwstemplate',['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/base',
  'csui/utils/log',
  'csui/models/command',
  'csui/models/node/node.model',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (require, $, _, base, log,
  CommandModel,
  NodeModel,
  lang) {

    var DocTemplateVolumeType = 20541;

    var AddWorkspaceTemplateCommand = CommandModel.extend({

      defaults: {
        signature: 'AddCONWSTemplate',
        name: lang.CommandNameAddCONWSTemplate,
        scope: 'single'
      },

      enabled: function (status) {
        var container = status.container || {}
        return container.get("type") === DocTemplateVolumeType ? true : false;
      },

      execute: function (status, options) {

        var deferred = $.Deferred(),
          subType = options.addableType,
          subTypeName = options.addableTypeName,
          newNode = new NodeModel({
            "type": subType,
            "type_name": subTypeName,
            "container": true,
            "name": "",
            "parent_id": status.container.attributes.id,
            "is_doctemplate": true
          }, {
              connector: status.container.connector
            });

        status.forwardToTable = true;
        deferred.resolve(newNode);
        return deferred.promise();
      }
    });

    return AddWorkspaceTemplateCommand;
  });




csui.define('conws/utils/commands/delete',[
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commands/delete'
], function ($, _, DeleteCommand, lang) {
    // SAPRM-8700 Default DeleteCommand extended for related workspaces where
    // delete must be disabled
    var origEnabled = DeleteCommand.prototype.enabled;
    var DeleteCommandRelatedWorkspaceCheck = DeleteCommand.extend({
        enabled: function (status) {
            if (status.container === undefined ||
                status.container.get("type") !== 854) {
                return origEnabled.call(this, status);
            } else {
                return false;
            }
        }
    });
    DeleteCommand.prototype = DeleteCommandRelatedWorkspaceCheck.prototype;
    return DeleteCommand;
});
csui.define('conws/utils/commands/permissions/addoreditrole',[
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/models/command',
  'conws/utils/commands/permissions/permissions.util',
  'i18n!conws/utils/commands/nls/commands.lang',

], function (require, _, $, base, CommandModel, PermissionsUtil, lang) {
  

  // Dependencies loaded in the execute method first
  var GlobalMessage;

  var AddOrEditRoleCommand = CommandModel.extend({
    defaults: {
      signature: "AddOrEditRole",
      name: lang.CommandNameAddRole
    },

    enabled: function (status) {
      var nodeModel = status.nodeModel || (status.originatingView && status.originatingView.model);
      if (PermissionsUtil.isWorkspace(nodeModel)) {
        // Add role
        if (status.nodeModel) {
          return true;
        }
        //edit role - only if the role belogs to this node
        else if (!status.nodeModel && !!status.model && PermissionsUtil.isWorkspaceRole(status.model) &&
          !PermissionsUtil.isInheritedRole(nodeModel, status.model)) {
          return true;
        } else {
          return false;
        }
      }
      else {
        return false;
      }
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      status.addrole = !!status.nodeModel
      status.suppressSuccessMessage = true;
      csui.require(['csui/models/permission/nodepermission.model',
        'csui/controls/globalmessage/globalmessage'
      ], function (NodePermissionModel) {
        GlobalMessage = arguments[1];

        if (!status.addrole && status.model) {

          // fetch the role details using roles restapi
          status.model.action = "fetch";
          status.model.nodeId = status.originatingView && status.originatingView.model && status.originatingView.model.get("id");
          var url = PermissionsUtil.getUrl(status.model);
          status.model.fetch({
            url: url
          }).done(function () {
            if (status.model.get("results") && status.model.get("results").data &&
              status.model.get("results").data.members && status.model.get("results").data.properties) {
              status.model.set("members", status.model.get("results").data.members);
              status.model.get("right_id_expand").name = status.model.get("results").data.properties.name;
              status.model.get("right_id_expand").description = status.model.get("results").data.properties.description;
              status.model.get("right_id_expand").team_lead = status.model.get("results").data.properties.leader;
            }
            status.model.unset('links');
            status.model.unset('results');
            status.model.unset('addEmptyAttribute');

            self._selectAddOrEditRoleOptions(status, options)
              .done(function (selectedOptions) {
                var roleModelData = {
                  name: selectedOptions.role_name,
                  description: selectedOptions.role_description,
                  leader: selectedOptions.team_lead
                }
                // if we don`t open the permissions and participants page, then we should not override the details from those views
                if (!!selectedOptions.permissions) {
                  roleModelData.permissions = selectedOptions.permissions;
                  roleModelData.apply_to = selectedOptions.apply_to;
                  roleModelData.include_sub_types = selectedOptions.apply_to > 0 ? [204, 207, 215, 298, 3030202] : []
                }
                if (!!selectedOptions.participants) {
                  roleModelData.members = selectedOptions.participants;
                }
                // update the user provided details from addoreditrole dialog
                status.model.action = "update";
                url = PermissionsUtil.getUrl(status.model);
                status.model.save(roleModelData, {
                  url: url,
                  patch: true,
                  wait: true,
                  silent: true
                }).done(function () {

                  var right_id_expand = status.model.get("right_id_expand");

                  // update the corresponding extraMemberModel, if the name is updated
                  if( right_id_expand.name !== selectedOptions.role_name ){
                    var memberModel = _.find(status.model.collection.extraMemberModels, { id: status.model.get("right_id") });
                    if( memberModel ){
                      memberModel.set("name", selectedOptions.role_name);
                      memberModel.set("name_formatted", selectedOptions.role_name);
                    }
                  }

                  right_id_expand.name = selectedOptions.role_name;
                  right_id_expand.name_formatted = selectedOptions.role_name;
                  right_id_expand.description = selectedOptions.role_description;
                  right_id_expand.team_lead = selectedOptions.team_lead;

                  //update the leader_id if user selected this role as leader.
                  if (selectedOptions.team_lead) {
                    var nodeModel = status.nodeModel || (status.originatingView && status.originatingView.model);
                    // update all nodepermission models with new leader_id
                    $.each(status.model.collection.models, function (index, model) {
                      PermissionsUtil.isWorkspaceRole(model) &&
                        !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                        (model.get("right_id_expand").leader_id = right_id_expand.id);
                    });
                    right_id_expand.leader_id = right_id_expand.id;

                    // update all member models that is used in userpicker with new leader_id
                    $.each(status.model.collection.extraMemberModels, function (index, model) {
                      PermissionsUtil.isWorkspaceRole(model) &&
                        !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                        model.set("leader_id", right_id_expand.id);
                    });
                  }

                  //if we don`t open the permissions and participants page, then we should not update the ui as well
                  if (!!selectedOptions.permissions && !!selectedOptions.apply_to) {
                    right_id_expand.permissions = selectedOptions.permissions;
                    status.model.set("permissions", selectedOptions.permissions);
                    right_id_expand.apply_to = selectedOptions.apply_to;
                  }
                  if (!!selectedOptions.participants && selectedOptions.participants.length > 0) {
                    right_id_expand.members = selectedOptions.participants;
                    status.model.set("members", selectedOptions.participants);
                  }

                  // update the model with the user provided details
                  status.model.set({
                    right_id_expand: right_id_expand,
                    type: 'custom'
                  }, { silent: true });

                  GlobalMessage.showMessage('success', self._getMessageWithRoleName(status.model));
                  if (status.originatingView && status.originatingView.unblockActions) {
                    status.originatingView.unblockActions();
                  }
                  if (status.originatingView && status.originatingView.permissionsContentView &&
                    status.originatingView.permissionsContentView.permissionsListView) {
                    status.originatingView.permissionsContentView.permissionsListView.trigger("update:table", status.model);
                  }
                  deferred.resolve(status.model);
                }).fail(function (response) {
                  var error = new base.Error(response);
                  if (status.originatingView && status.originatingView.unblockActions) {
                    status.originatingView.unblockActions();
                  }
                  GlobalMessage.showMessage('error', error);
                  deferred.reject(status.model, error);
                });
              }).fail(function (error) {
                deferred.reject(error);
              });
          }).fail(function (error) {
            deferred.reject(error);
          });
        }
        else {

          // Idenitfy whether atleast one workspace role exists
          status.isWorkspaceRoleExists = status.permissionCollection.models.some(function (model) {
            return PermissionsUtil.isWorkspaceRole(model) && !PermissionsUtil.isInheritedRole(status.nodeModel, model);
          }, this);

          self._selectAddOrEditRoleOptions(status, options)
            .done(function (selectedOptions) {
              var apply_to = (selectedOptions.apply_to !== undefined) ? selectedOptions.apply_to : 2,
              roleModelData = {
                name: selectedOptions.role_name,
                description: selectedOptions.role_description,
                leader: selectedOptions.team_lead,
                members: selectedOptions.participants,
                permissions: (selectedOptions.permissions !== undefined) ? selectedOptions.permissions : NodePermissionModel.getReadPermissions(),
                apply_to: apply_to,
                include_sub_types: apply_to > 0 ? [204, 207, 215, 298, 3030202] : []
              },
                nodeRolePermissionModel = new NodePermissionModel(roleModelData, status);
              nodeRolePermissionModel.unset('addEmptyAttribute');
              nodeRolePermissionModel.action = "create";
              nodeRolePermissionModel.nodeId = status.nodeId;
              if (status.originatingView && status.originatingView.blockActions) {
                status.originatingView.blockActions();
              }
              var url = PermissionsUtil.getUrl(nodeRolePermissionModel);
              nodeRolePermissionModel.save(roleModelData, {
                url: url,
                silent: true,
                wait: true
              }).done(function (response) {
                var currentLeaderId, properties = response.results && response.results.data && response.results.data.properties,
                  right_id = properties && properties.id,
                  isLeader = properties && properties.leader,
                  nodeModel = status.nodeModel || (status.originatingView && status.originatingView.model);

                //update the leader_id based on user selection.
                if (isLeader) {
                  // update all nodepermission models with new leader_id
                  $.each(status.permissionCollection.models, function (index, model) {
                    PermissionsUtil.isWorkspaceRole(model) &&
                      !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                      (model.get("right_id_expand").leader_id = right_id);
                  });

                  // update all member models that is used in userpicker with new leader_id
                  $.each(status.permissionCollection.extraMemberModels, function (index, model) {
                    PermissionsUtil.isWorkspaceRole(model) &&
                      !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                      model.set("leader_id", right_id);
                  });
                } else {
                  var filteredModels = _.filter(status.permissionCollection.models, function (model) {
                    return PermissionsUtil.isWorkspaceRole(model) && PermissionsUtil.isLeaderRole(nodeModel, model);
                  });
                  currentLeaderId = filteredModels.length && filteredModels[0].get("right_id_expand").leader_id;
                }

                nodeRolePermissionModel.set({
                  // set the newly added role details
                  right_id_expand: {
                    id: right_id,
                    initials: selectedOptions.role_name[0],
                    leader_id: isLeader ? right_id : currentLeaderId,
                    name: selectedOptions.role_name,
                    name_formatted: selectedOptions.role_name,
                    type: 848,
                    node_id: status.nodeId,
                    type_name: lang.BusinessWorkspaceRole
                  },
                  type: 'custom',
                  right_id: right_id
                },
                  { silent: true });
                GlobalMessage.showMessage('success',
                  self._getMessageWithRoleName(nodeRolePermissionModel));
                if (status.originatingView && status.originatingView.unblockActions) {
                  status.originatingView.unblockActions();
                }
                deferred.resolve(nodeRolePermissionModel);
              }).fail(function (response) {
                var error = new base.Error(response);
                if (status.originatingView && status.originatingView.unblockActions) {
                  status.originatingView.unblockActions();
                }
                GlobalMessage.showMessage('error', error);
                deferred.reject(nodeRolePermissionModel, error);
              });
            })
            .fail(function (error) {
              deferred.reject(error);
            });
        }
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _selectAddOrEditRoleOptions: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      csui.require(['conws/dialogs/addoreditrole/addoreditrole.wizard'],
        function (AddOrEditRoleWizard) {
          var addOrEditRoleWizard = new AddOrEditRoleWizard({
            command: 'addoreditrole',
            context: status.context,
            connector: status.connector,
            dialogClass: 'cs-permission-role-picker',
            displayName: status.addrole ? lang.CommandNameAddRole : lang.CommandNameEditRole,
            dialogTitle: status.addrole ? lang.CommandNameAddRole : lang.CommandNameEditRole,
            addrole: status.addrole,
            nodeModel: status.addrole ? status.nodeModel : status.originatingView.model,
            model: status.model,
            addButtonLabel: lang.AddButtonLabel,
            availablePermissions: status.addrole ? status.permissionCollection.availablePermissions : status.originatingView.collection,
            applyTo: status.applyTo,
            isFirstRole: !status.isWorkspaceRoleExists
          });

          addOrEditRoleWizard
            .show()
            .done(function () {
              deferred.resolve.apply(deferred, arguments);
            }).fail(function (error) {
              deferred.reject.apply(deferred, arguments);
            });
        }, function (error) {
          deferred.reject(error);
        });
      return deferred.promise();
    },

    _getMessageWithRoleName: function (permissionModel) {
      var msg, displayName;
      if (permissionModel.get("right_id_expand")) {
        displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
      }
      if (!!permissionModel.action && permissionModel.action === "update") {
        msg = _.str.sformat(lang.EditRoleSuccess, displayName);
      }
      else {
        msg = _.str.sformat(lang.AddRoleSuccess, displayName);
      }

      return msg;
    }
  });

  return AddOrEditRoleCommand;
});
csui.define('conws/utils/workspaces/busyindicator',[], function () {
  

  /**
   * helper class to switch on and off the busy indicator 
   * over the view, which triggered command execution.
   * 
   */
  function BusyIndicator (on_fct,off_fct) {
    this.on_fct = on_fct;
    this.off_fct = off_fct;
  }

  function OnOff(status,onoff) {
      if (status.busyIndicator) {
        status.busyIndicator[onoff]();
      } else {
        var view = status.originatingView;
        if (view && view.blockActions && view.unblockActions) {
          status.busyIndicator = new BusyIndicator(
            function(){ view.blockActions(); },
            function(){ view.unblockActions(); }
          );
          status.busyIndicator[onoff]();
        }
      }
  }

  BusyIndicator.on = function(status) { OnOff(status,"on"); };
  BusyIndicator.off = function(status) { OnOff(status,"off"); };

  BusyIndicator.prototype.on = function() {
    if (!this.busy) { this.busy = true; this.on_fct(); }
  };
  BusyIndicator.prototype.off = function() {
    if (this.busy) { this.busy = false; this.off_fct(); }
  };

  return BusyIndicator;

});

csui.define('conws/utils/commands/addrelateditem',[
  'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!conws/utils/commands/nls/commands.lang',
  'csui/models/action',
  'csui/models/command', 'conws/utils/workspaces/busyindicator'
], function (require, _, $, lang, ActionModel, CommandModel, BusyIndicator ) {
  

  function getAction(status) {
    var model = status.collection && status.collection.workspace;
    var action;
    if (model && model.actions) {
      action = model.actions.get ? model.actions.get("add-relitem") : model.actions["add-relitem"];
    }
    return action;
  }

    var AddRelationCommand = CommandModel.extend({
  
      defaults: {
        signature: "AddRelation",
        command_key: ['add-relitem'],
        scope: "multiple",
        name: lang.CommandNameAddRelatedItem,
        verb: lang.CommandVerbAddRelatedItem,
        successMessages: {
          formatForNone: lang.AddRelatedItemsNoneMessage,
          formatForOne: lang.AddOneRelatedItemSuccessMessage,
          formatForTwo: lang.AddSomeRelatedItemsSuccessMessage,
          formatForFive: lang.AddManyRelatedItemsSuccessMessage
        }
      },

      enabled: function(status) {
        var enabled = false;
        if (status.data && status.data.submit) {
          if (status.nodes && status.nodes.length) {
            enabled = !!getAction(status);
          }
        } else {
          enabled = !!getAction(status);
        }
        return enabled;
      },

      execute: function(status, options) {
        status.suppressSuccessMessage = true;
        if (status.data && status.data.submit) {
          return this.submitNodes(status,options);
        } else {
          return this.openSearch(status,options);
        }
      },

      submitNodes: function(status,options) {
        var self = this;
        var deferred = $.Deferred();
        status.suppressSuccessMessage = true;
        BusyIndicator.on(status);
        deferred.always(function(){
         BusyIndicator.off(status);
        });
        csui.require([ 'csui/lib/underscore', 'csui/utils/base', 'csui/utils/url',
          'csui/controls/globalmessage/globalmessage'
        ], function ( _, base, Url, GlobalMessage) {
  
          function buildCallData(status) {
            var nodes = status.nodes;
            var connector, name, data;
            var calls = [];
            var action = getAction(status);
            if (nodes && action) {
              nodes.each(function (node) {
                  connector = node.connector;
                  name = node.get("name");
                  var href = action.href || action.get('href')/*href: "/api/v2/businessworkspaces/98015/relateditems"*/;
                  // get api version and url without anchor and params from href.
                  var match = href.match(/^\/?api\/v([0-9\.])+\/([^?#]+)/i);
                  var requestArgs = _.extend(Url.urlParams(href),{
                    rel_bw_id: node.get("id"),
                    rel_type: node.get("rel_type")
                  });
                  var call = {
                    apiCall: (match && match.length>=3) ? match[2] : href,
                    params: {
                      fRequestArgs: requestArgs,
                      fVersionNumber: (match && match.length>=2) ? parseInt(match[1]) : 2,
                      fParamTicket: "",
                      fParamMethod: action.method || action.get('method')/*method: "POST"*/,
                      fCallName: href
                    }
                  };
                  calls.push(call);
              });
            }
            if (connector) {
              var connectionUrl = connector.getConnectionUrl();
              var baseUrl = connectionUrl.getCgiScript();
              var url = Url.combine(baseUrl,"/api/v1/csui/batch");
              var formData = new FormData();
              formData.append('body', JSON.stringify({
                exitOnError: true,
                calls: calls
              }));
              data = {
                url: url,
                method: "POST",
                data: formData,
                contentType: false,
                processData: false
              }
            }
            return {connector: connector, name: name, data: data, count: calls.length};
          }
  
          var callData = buildCallData(status);
          if (callData.count) {
            callData.connector.makeAjaxCall(callData.data)
            .done(function(response) {
              // As we have set exitOnError to true we always have all succeeded here.
              var successmsg = base.formatMessage(response.calls.length, self.get("successMessages"), callData.name);
              deferred.resolve(status.nodes);
              GlobalMessage.showMessage("success",successmsg);
              status.originatingView && status.originatingView.trigger("cmd:success", self.get("signature"), status.nodes );
            }).fail(function(request) {
              // As we have set exitOnError to true we always have only one error here.
              var errormsg = request.responseJSON ? request.responseJSON.error : request.statusText;
              var error = new Error(errormsg);
              error.suppressFailMessage = true;
              deferred.reject(error);
              GlobalMessage.showMessage("error",errormsg);
              status.originatingView && status.originatingView.trigger("cmd:failure", self.get("signature"), error );
            });
          } else {
            deferred.resolve();
          }
        }, deferred.reject );
        return deferred.promise();
      },

      openSearch: function(status,options) {
        var self = this;
        var deferred = $.Deferred();
        status.suppressSuccessMessage = true;
        var action = getAction(status);
        if (action) {
          csui.require(['conws/widgets/relatedworkspaces/addrelatedworkspaces.search'
          ], function (
            AddRelatedWorkspacesSearch
          ) {
            var addWkspSearch = new AddRelatedWorkspacesSearch({
              title: self.get("name"),
              signature: self.get("signature"),
              status: status
            });

            var lasterror;
            addWkspSearch.searchView.on("go:back", function() {
              if (lasterror) {
                lasterror.suppressFailMessage = true;
                deferred.reject(lasterror);
              } else {
                deferred.resolve();
              }
            });
            addWkspSearch.searchView.on("cmd:success", function(sig,result) {
              if (sig===self.get("signature")) {
                lasterror = undefined;
                addWkspSearch.close();
                result.each(function(node){
                  // convert each node so it can be used in the relateditems collection.
                  // set deleterelateditem action in each node.
                  var rel_source = node.get("rel_source");
                  var rel_target = node.get("id");
                  var rel_type = node.get("rel_type");
                  var href = _.str.sformat("/api/v2/businessworkspaces/{0}/relateditems/{1}?rel_type={2}", rel_source, rel_target, rel_type);
                  var del_action = new ActionModel({
                    body: "",
                    content_type: "",
                    form_href: "",
                    href: href,
                    method: "DELETE",
                    name: lang.ServerCommandNameDeleteRelatedItem/*"Remove related item"*/,
                    signature: "deleterelateditem"
                  },{
                    connector: node.connector
                  });
                  node.actions.add(del_action);
                });
                deferred.resolve(result.models);
              }
            });
            addWkspSearch.searchView.on("cmd:failure", function(sig,error) {
              if (sig===self.get("signature")) {
                lasterror = error;
              }
            });
  
            addWkspSearch.show();

          }, deferred.reject );
        }
        else {
          deferred.resolve();
        }

        return deferred.promise();
      }


    });

    return AddRelationCommand;
  
  });
  
csui.define('conws/utils/commands/deleterelateditem',[
  'require', 'csui/lib/jquery',
  'i18n!conws/utils/commands/nls/commands.lang',
  'csui/models/command', 'conws/utils/workspaces/busyindicator'
], function (require, $, lang, CommandModel, BusyIndicator) {
  

  var RemoveRelationCommand = CommandModel.extend({

    defaults: {
      signature: "RemoveRelation",
      command_key: ['deleterelateditem'],
      scope: 'multiple',
      name: lang.CommandNameDeleteRelatedItem,
      verb: lang.CommandVerbDeleteRelatedItem,
      confirmMessages: {
        formatForOne: lang.DeleteOneRelatedItemConfirmMessage,
        formatForTwo: lang.DeleteSomeRelatedItemsConfirmMessage,
        formatForFive: lang.DeleteManyRelatedItemsConfirmMessage
      },
      successMessages: {
        formatForNone: lang.DeleteRelatedItemsNoneMessage,
        formatForOne: lang.DeleteOneRelatedItemSuccessMessage,
        formatForTwo: lang.DeleteSomeRelatedItemsSuccessMessage,
        formatForFive: lang.DeleteManyRelatedItemsSuccessMessage
      }
    },

    enabled: function(status) {
      if (status.nodes && status.nodes.length) {
        var node = status.nodes.find(function(node){
          if (!(node.actions && node.actions.get("deleterelateditem"))) {
            return node;
          }
        });
        return !node;
      }
      return false;
    },

    execute: function(status, options) {
      var self = this;
      var deferred = $.Deferred();
      status.suppressSuccessMessage = true;
      BusyIndicator.on(status);
      deferred.always(function(){
        BusyIndicator.off(status);
      });
      csui.require([ 'csui/lib/underscore', 'csui/utils/base', 'csui/utils/url',
        'csui/dialogs/modal.alert/modal.alert',
        'csui/controls/globalmessage/globalmessage'
      ], function (_, base, Url, ModalAlert, GlobalMessage) {

        function buildCallData(status) {
          var nodes = status.nodes;
          var connector, name, data;
          var calls = [];
          if (nodes) {
            nodes.each(function (node) {
              var action = node.actions.get('deleterelateditem');
              if (action) {
                connector = node.connector;
                name = node.get("name");
                var href = action.get('href')/*href: "/api/v2/businessworkspaces/98015/relateditems/125892?rel_type=child"*/;
                // get api version and url without anchor and params from href.
                var match = href.match(/^\/?api\/v([0-9\.])+\/([^?#]+)/i);
                var call = {
                  apiCall: (match && match.length>=3) ? match[2] : href,
                  params: {
                    fRequestArgs: Url.urlParams(href),
                    fVersionNumber: (match && match.length>=2) ? parseInt(match[1]) : 2,
                    fParamTicket: "",
                    fParamMethod: action.get('method')/*method: "DELETE"*/,
                    fCallName: href
                  }
                };
                calls.push(call);
              }
            });
          }
          if (connector) {
            var connectionUrl = connector.getConnectionUrl();
            var baseUrl = connectionUrl.getCgiScript();
            var url = Url.combine(baseUrl,"/api/v1/csui/batch");
            var formData = new FormData();
            formData.append('body', JSON.stringify({
              exitOnError: true,
              calls: calls
            }));
            data = {
              url: url,
              method: "POST",
              data: formData,
              contentType: false,
              processData: false
            }
          }
          return {connector: connector, name: name, data: data, count: calls.length};
        }

        var callData = buildCallData(status);
        if (callData.count) {
          BusyIndicator.off(status);
          var confirmmsg = base.formatMessage(callData.count, self.get("confirmMessages"), callData.name);
          ModalAlert.confirmQuestion(confirmmsg, self.get("name"))
            .done(function() {
              BusyIndicator.on(status);
              callData.connector.makeAjaxCall(callData.data)
              .done(function(response) {
                // As we have set exitOnError to true we always have all succeeded here.
                var successmsg = base.formatMessage(response.calls.length, self.get("successMessages"), callData.name);
                deferred.resolve(response.calls);
                GlobalMessage.showMessage("success",successmsg);
              }).fail(function(request) {
                // As we have set exitOnError to true we always have only one error here.
                var errormsg = request.responseJSON ? request.responseJSON.error : request.statusText;
                var error = new Error(errormsg);
                error.suppressFailMessage = true;
                deferred.reject(error);
                GlobalMessage.showMessage("error",errormsg);
              });
            })
            .fail( function() {
              deferred.resolve();
            });
        } else {
          deferred.resolve();
        }
      }, deferred.reject );
      return deferred.promise();
    }

  });

  return RemoveRelationCommand;

});


csui.define('conws/utils/commands/permissions/deleterole',[
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/commands/permissions/delete.permission',
  'csui/utils/command.error',
  'csui/controls/globalmessage/globalmessage',
  'conws/utils/commands/permissions/permissions.util',
  'i18n!conws/utils/commands/nls/commands.lang',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (require, $, _, Backbone, DeletePermissionCommand, CommandError, GlobalMessage, PermissionsUtil, lang, csuilang) {
  

  var DeleteRoleCommand = DeletePermissionCommand.extend({

    defaults: {
      signature: 'DeleteRole',
      name: lang.CommandNameDeleteRole,
      scope: 'single'
    },

    enabled: function (status) {
      var permissionModel = status.model,
          isWorkspaceRole = PermissionsUtil.isWorkspaceRole(permissionModel),
          permissionType  = permissionModel && permissionModel.get('type'),
          nodeModel       = status.nodeModel || (status.originatingView && 
                                                status.originatingView.model),
          isWorkspace = PermissionsUtil.isWorkspace(nodeModel),
          isInheritedRole = PermissionsUtil.isInheritedRole(nodeModel, permissionModel),
          isLeaderRole = PermissionsUtil.isLeaderRole(nodeModel, permissionModel),
          enabled         = permissionType && permissionType === "custom" && isWorkspaceRole && !isLeaderRole &&
                            nodeModel.actions && !!nodeModel.actions.get({signature: 'editpermissions'});

      // For subitems and inherited roles we need to update the title.
      if ((!isWorkspace && isWorkspaceRole) || (isWorkspace && isInheritedRole)) {
        status.toolItem.set("name", lang.DeletePermissionCommandForSubItems);
      }
      return enabled;
    },

    execute: function (status, options) {
      var deferred = $.Deferred(),
          self     = this;
      options || (options = {});
      // avoid messages from handleExecutionResults
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

      csui.require([
        'csui/controls/globalmessage/globalmessage',
        'conws/dialogs/applyrolepermissions/apply.role.permissions.view',
        'conws/dialogs/applyrolepermissions/impl/header/apply.role.permissions.header.view',
        'csui/controls/progressblocker/blocker',
        'csui/controls/dialog/dialog.view',
        'csui/utils/permissions/permissions.precheck'
      ], function (localGlobalMessage, ApplyRolePermissionView, ApplyRolePermissionsHeaderView,
          BlockingView, DialogView, PermissionPreCheck) {
        GlobalMessage = localGlobalMessage;

        var permissionModel = status.model,
          nodeModel = status.nodeModel || (status.originatingView &&
            status.originatingView.model),
          isWorkspace = PermissionsUtil.isWorkspace(nodeModel),
          isWorkspaceRole = PermissionsUtil.isWorkspaceRole(permissionModel),
          isInheritedRole = PermissionsUtil.isInheritedRole(nodeModel, permissionModel);

        if (isWorkspace && isWorkspaceRole && !isInheritedRole) {
          permissionModel.isRoleDelete = true;
        }else{
          permissionModel.isRoleDelete = false;
        }

        if ( status.originatingView && status.originatingView.model &&
            status.originatingView.model.get("container")) {
          options.removePermission = true;
          self._executeDeletePermission(status, options, ApplyRolePermissionsHeaderView,
            ApplyRolePermissionView, BlockingView, DialogView, PermissionPreCheck)
              .then(deferred.resolve, deferred.reject);
        } else {
          self._deletePermission(status, options).then(deferred.resolve, deferred.reject);
        }
      }, deferred.reject);
      return deferred.promise();
    },

    _performActions: function (status, options) {
      var self            = this,
          deferred        = $.Deferred(),
          permissionModel = status.dialog ? status.dialog.options.view.options.permissionModel :
                            status.model,
          permissionType  = permissionModel.get('type'),
          collection      = permissionModel.collection,
          failureMsg      = this._getMessageWithUserDisplayName(
            csuilang.DeletePermissionCommandFailMessage, permissionModel),
          deleteAttr,successMsg;

      if (collection && collection.options && collection.options.node &&
          collection.options.node.actions.get({signature: 'editpermissions'})) {
        permissionModel.nodeId = collection.options && collection.options.node &&
                                 collection.options.node.get('id');
        var url, container           = collection.options && collection.options.node &&
                                  collection.options.node.get("container"),
            permissionModelType = collection.options && collection.options.node &&
                                  collection.options.node.get("permissions_model");
 
        if (status.dialog && !permissionModel.isRoleDelete) {
          permissionModel.apply_to = (container && status.dialog.options.view.ContentRegion.currentView.getValues().subitems_inherit) ? 2 : 0,
          permissionModel.include_sub_types = permissionModel.apply_to > 0  ? [204, 207, 215, 298, 3030202] : [];
        }

        url = permissionModel.url();

        if ( permissionModel.isRoleDelete ) {
          permissionModel.action = 'delete';
          url = PermissionsUtil.getUrl(permissionModel);
          failureMsg = this._getMessageWithUserDisplayName(lang.DeleteRoleCommandFailMessage, permissionModel);
        }

        if (self.originatingView && self.originatingView.blockActions) {
          self.destroyDialog(status);
          self.originatingView.blockActions();
        }
        
        var jqxhr = permissionModel.destroy({
          url: url,
          wait: true
        }).done(function (response) {
          //update the results
          permissionModel.set('results', response.results);
          self.originatingView && self.originatingView.trigger('permission:changed', self);
          if (self.originatingView && self.originatingView.unblockActions) {
            self.originatingView.unblockActions();
          }
          if( permissionModel.isRoleDelete ){
            successMsg = self._getMessageWithUserDisplayName(lang.DeleteRoleCommandSuccessMessage, permissionModel);
          }else{
            successMsg = self._getMessageWithUserDisplayName(
              permissionModel.get('results') && permissionModel.get('results').success > 0 ?
              csuilang.DeletePermissionCommandSuccessMessageWithCount :
              csuilang.DeletePermissionCommandSuccessMessage, permissionModel);
          }          
          GlobalMessage.showMessage('success', successMsg);
          if (permissionType === "owner" || permissionType === "group") {
            //Check & Process for no owner condition
            collection.processForEmptyOwner && collection.processForEmptyOwner();
          }
          //self.destroyDialog(status);
          deferred.resolve(permissionModel);

        }).fail(function (error) {
          var commandError = error ? new CommandError(error, permissionModel) :
                             error;
          self.handleFailure(commandError, failureMsg);
          deferred.reject(permissionModel, commandError);
          if (!error) {
            jqxhr.abort();
          }
        }).always(function () {
          if (self.originatingView && self.originatingView.unblockActions) {
            self.originatingView.unblockActions();
          }
        });
        return deferred.promise();
      }
      else {
        self.destroyDialog(status);
        return deferred.reject(
            new CommandError(failureMsg, {errorDetails: csuilang.undefinedCollection}));
      }
    },

    handleFailure: function (commandError, oneFileFailure) {
      var errObject = Backbone.Model.extend({
            defaults: {
              name: "",
              state: 'pending',
              commandName: 'ViewPermission'
            }
          }),
          errObjects;

      var failedPermissionsCollection = Backbone.Collection.extend({
        model: errObject
      });
      var errCollection = new failedPermissionsCollection();
      errObjects = new errObject({
        name: commandError,
        mime_type: '',
        state: 'rejected'
      });
      errCollection.add(errObjects);
      GlobalMessage.showPermissionApplyingProgress(errCollection, {oneFileFailure: oneFileFailure});
    }
  });

  return DeleteRoleCommand;
});




csui.define('conws/utils/commands/permissions/edit.role.permissions',[
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/models/command',
  'csui/utils/command.error',
  'csui/utils/commands/permissions/permission.util',
  'conws/utils/commands/permissions/permissions.util',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (require, _, $, base, CommandModel, CommandError, PermissionUtil, ConwsPermissionsUtil, lang ) {
  
  
    var EditRolePermissionCommand = CommandModel.extend({
      defaults: {
        signature: 'EditRolePermission',
        command_key: ['editpermissions', 'Edit Permissions']
      },
  
      enabled: function (status) {
        var permissionModel = status.model,
            permissionType  = permissionModel && permissionModel.get('type'),
            nodeModel       = status.nodeModel || (status.originatingView && 
                                                  status.originatingView.model),
            enabled         = permissionType && permissionType === "custom" &&
                              ConwsPermissionsUtil.isWorkspaceRole(permissionModel) &&
                              nodeModel.actions && !!nodeModel.actions.get({signature: 'editpermissions'});
  
        return enabled;
      },
  
      execute: function (status, options) {
        var self            = this,
            deferred        = $.Deferred(),
            permissionModel = status.model,
            collection      = permissionModel.collection,
            targetView      = status.targetView;
  
        self.targetView = targetView;
        // avoid messages from handleExecutionResults
        status.suppressFailMessage = true;
        status.suppressSuccessMessage = true;
  
        var failureMsg = this._getMessageWithUserDisplayName(lang.EditPermissionCommandFailMessage,
            permissionModel);
        var userHasEditPermissions = collection && collection.options && collection.options.node &&
                                     collection.options.node.actions.get(
                                         {signature: 'editpermissions'});
  
        if (collection && !!userHasEditPermissions) {
          permissionModel.nodeId = collection.options && collection.options.node &&
                                   collection.options.node.get('id');
  
          csui.require(
              ['conws/utils/commands/permissions/edit.role.permission.helper',
                'csui/utils/contexts/factories/user', 'csui/controls/globalmessage/globalmessage',
                'csui/utils/permissions/permissions.precheck'
              ],
              function (EditRolePermissionHelper, UserModelFactory, GlobalMessage, PermissionPreCheck) {
                var user = status.originatingView.context.getModel(UserModelFactory);
                self.loginUserId = user.get('id');
                self.editRolePermissionHelper = new EditRolePermissionHelper({
                  permissionModel: permissionModel,
                  popoverPlacement: "left",
                  popoverAtBodyElement: status.originatingView ?
                                        !status.originatingView.options.isExpandedView : true,
                  popoverTargetElement: status.targetView.permissions.$el,
                  readonly: false,
                  originatingView: status.originatingView,
                  applyTo: status.applyTo
                });
                self.editRolePermissionHelper._showSelectPermissionLevelPopover();
                self.editRolePermissionHelper.listenTo(self.editRolePermissionHelper,
                    "permissions:selected", function (userSelection) {
                      var url, saveAttr = {
                        "permissions": userSelection.permissions,
                        "apply_to": userSelection.apply_to,
                        "include_sub_types": userSelection.apply_to > 0 ?
                                             PermissionPreCheck.includeSubTypes() : []
                      },
                      nodeModel = ( self.targetView && self.targetView.options && self.targetView.options.nodeModel ) ||
                      ( self.targetView && self.targetView.permissions && self.targetView.permissions.options && self.targetView.permissions.options.nodeModel );

                      if (userSelection.right_id) {
                        saveAttr.right_id = userSelection.right_id;
                      }
                      if ( ConwsPermissionsUtil.isWorkspace(nodeModel) && ConwsPermissionsUtil.isWorkspaceRole(permissionModel) ) {
                        permissionModel.action = 'editperms';
                        url = ConwsPermissionsUtil.getUrl(permissionModel);
                      }
                      permissionModel.save(saveAttr, {
                        url: url,
                        patch: true,
                        wait: true,
                        silent: true
                      }).done(function (response) {
  
                        permissionModel.set(saveAttr, {silent: true});
                        status.originatingView.trigger('permission:changed', status);
                        //status.originatingView.render();
                        self.editRolePermissionHelper.destroy();
                        self.editRolePermissionHelper.unblockActions();
                        /*if (permissionModel.mustRefreshAfterPut !== false) {
                          return permissionModel.fetch();
                        }*/
                        deferred.resolve();
                        if (status.originatingView.model.get('permissions_model') !== 'simple') {
                          PermissionUtil.generateSuccessMessage(response, GlobalMessage);
                        } 
                      }).fail(function (error) {
                        var commandError = error ? new CommandError(error, permissionModel) :
                                           error;
                        GlobalMessage.showMessage('error', commandError);
                        deferred.reject(permissionModel, commandError);
                      });
                    });
  
                self.editRolePermissionHelper.listenTo(self.editRolePermissionHelper,
                    "closed:permission:level:popover", function () {
                      deferred.reject(permissionModel);
                    });
              });
        } else {
          return deferred.reject(
              new CommandError(failureMsg, {errorDetails: lang.undefinedCollection}));
        }
        return deferred.promise();
      },
  
      _getMessageWithUserDisplayName: function (unformattedMsg, permissionModel) {
        var displayName;
        if (permissionModel.get("right_id_expand")) {
          displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
        } else if (permissionModel.get("type") === "public") {
          displayName = lang.publicAccess;
        }
        var msg = _.str.sformat(unformattedMsg, displayName);
        return msg;
      }
    });
  
    return EditRolePermissionCommand;
  });
  

csui.define('conws/utils/commands/permissions/edit.role.permission.helper',[
    'csui/lib/underscore',
    'csui/controls/dialog/dialog.view',
    'csui/models/permission/nodepermission.model',
    'csui/widgets/permissions/impl/edit/edit.permission.helper',
    'conws/dialogs/applyrolepermissions/apply.role.permissions.view',
    'csui/widgets/permissions/impl/edit/apply.permission/impl/header/apply.permission.header.view',
    'csui/controls/progressblocker/blocker',
    'i18n!csui/widgets/permissions/impl/nls/lang'
  ], function (_,
      DialogView,
      NodePermissionModel,
      EditPermissionHelper,
      ApplyRolePermissionView,
      ApplyPermissionHeaderView,
      BlockingView,
      lang) {
    
  
    var EditRolePermissionHelper = EditPermissionHelper.extend({
  
      constructor: function EditRolePermissionHelper(options) {
        EditPermissionHelper.prototype.constructor.apply(this, arguments);
      },
  
      _permissionLevelSelected: function () {
        this._blockActions();
        var selectedLevel = this.permissionLevelSelectorView.selected;
        if (selectedLevel !== NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
          //Close popover without raising any close popover event
          this.showingPopover && this.closePopover(true);
          this.permissions = NodePermissionModel.getPermissionsByLevelExceptCustom(selectedLevel,
              this.options.originatingView ? this.options.originatingView.model.get('container') :
              true, this.options.originatingView &&
               this.options.originatingView.model.get('advanced_versioning'));
          //Check for the selected node is container and open apply permissions to sub-items dialog
          if (this.options.originatingView && this.options.originatingView.model &&
              this.options.originatingView.model.get("container") ) {
            this._applyDialog = this.showApplyPermissionDialog();
            this._applyDialog.show();
          } else {
            this.triggerMethod('permissions:selected', {permissions: this.permissions});
          }
        } else {
          // Bootstrap popover has a bug: removing this too early will cause issue with next showing.
          // There is no event after destroy. The hidden event is not triggered for destroy.
          this.showCustomPermissionPopover();
        }
        this.unblockActions();
      },
  
      showApplyPermissionDialog: function () {
        var headerView = new ApplyPermissionHeaderView();
        this._view = new ApplyRolePermissionView({
          context: this.options.context || this.options.originatingView.context,
          model: this.options.nodeModel || this.options.originatingView.model,
          applyTo: this.options.applyTo,
          permissionModel: this.options.permissionModel
        });
        var dialog = new DialogView({
          headerView: headerView,
          view: this._view,
          className: "csui-permissions-apply-dialog",
          midSize: true,
          buttons: [
            {
              id: 'apply',
              label: lang.applyButtonLabel,
              toolTip: lang.applyButtonLabel,
              'default': true,
              click: _.bind(this.onClickApplyButton, this)
            },
            {
              label: lang.cancelButtonLabel,
              toolTip: lang.cancelButtonLabel,
              close: true
            }
          ]
        });
        dialog.listenTo(dialog, 'hide', _.bind(this.onHideDialog, this));
        BlockingView.imbue(dialog);
        return dialog;
      },
  
      onClickApplyButton: function (event) {
        var container        = event.dialog.options.view.model.get("container"),
            right_id         = event.dialog.options.view.options.permissionModel &&
                               event.dialog.options.view.options.permissionModel.get("right_id"),
            apply_to         = (container && event.dialog.options.view.ContentRegion.currentView.getValues().subitems_inherit) ? 2 : 0,
            selectedSubItems = apply_to > 0 ? [204, 207, 215, 298, 3030202] : [];

        var deferredResp = this.triggerMethod('permissions:selected',
            {
              permissions: this.permissions,
              apply_to: apply_to,
              right_id: right_id,
              include_sub_types: selectedSubItems
            });
        this._applyDialog.destroy();
        this._blockActions();
      }      
    });
  
    return EditRolePermissionHelper;
  
  });
  
csui.define('conws/utils/dragndrop/dragndrop.subtypes',[],function () {
    
    return 848;
});

csui.define('css!conws/utils/overlay/impl/conwsoverlay',[],function(){});
/**
 * Created by stefang on 05.04.2016.
 */
csui.define('conws/utils/overlay/conwsoverlay',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'css!conws/utils/overlay/impl/conwsoverlay'
], function ($, _,
    Marionette
) {

  var ConwsOverlay = Marionette.Controller.extend({
    
    constructor: function ConwsOverlay() {
      Marionette.Controller.prototype.constructor.apply(this, arguments);
    },

    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _hidePresentationView : function() {
      if (this.options.onHidePresentationView) {
        this.options.onHidePresentationView(this.modalContent);
      }

      this.modalWrapper.detach();
      this.presentationView.$el.detach();
      this.presentationView.$el.removeClass('conws-overlay-panel');
      this.modalContent.removeClass('conws-overlay-showing');
    },

    _showOtherView: function() {
      // to show blocking circle, if blockActions was called on the other view. 
      this.modalContent.find(">:not(.conws-overlay-wrapper)").show();
      if (this.options.onShowOtherView) {
        this.options.onShowOtherView(this.modalContent);
      }
    },

    _hideOtherView: function () {
      if (this.options.onHideOtherView) {
        this.options.onHideOtherView(this.modalContent);
      }
      this.modalContent.find(">:not(.conws-overlay-wrapper)").hide();
    },

    _showPresentationView : function() {
      
      this.modalContent = $(this.options.presentationRoot);
      this.modalContent.addClass('conws-overlay-beforeshow');

      // do not delete view, just show it. it is registered on the event too and updates itself.
      if (!this.presentationView) {
        this.presentationView = this.options.presentationView;
        this.presentationView.render();
      }

      this.presentationView.$el.addClass("conws-overlay-panel");

      this.modalWrapper = $('<div class="conws-overlay-wrapper"></div>');
      this.modalContent.append(this.modalWrapper);
      this.modalWrapper.append(this.presentationView.$el);

      if (this.options.onShowPresentationView) {
        this.options.onShowPresentationView(this.modalContent);
      }

      // read a property, so browser updates DOM and element is at start position
      this.presentationView.$el.position();

      this.presentationView.triggerMethod('dom:refresh');

      var that = this;
      this.presentationView.$el.one(this._transitionEnd(), function () {
        that.modalContent.removeClass("conws-overlay-animating");
        that.modalContent.addClass('conws-overlay-showing');
        that._hideOtherView();
      });
      this.modalContent.addClass('conws-overlay-animating');
      this.modalContent.removeClass('conws-overlay-beforeshow');
    },

    show: function() {
      this._showPresentationView();
    },

    close: function() {
      this._showOtherView();
      this._hidePresentationView();
    }

  });

  return ConwsOverlay;
});

/**
 * Created by stefang on 10.07.2019.
 */
// Fetches the list of related workspaces
csui.define('conws/widgets/relatedworkspaces/impl/relatedworkspaces.searchresult.model',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/nodes',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'conws/utils/workspaces/impl/workspaces.collection.mixin'
], function (module, $, _, Backbone, Url,
    NodeCollection, BrowsableMixin, NodeResourceMixin, ExpandableMixin,
    WorkspacesCollectionMixin) {

  var config = module.config();

  function Searching(columns) {
    this.set(columns);
  }

  Searching.prototype.set = function set(columns) {
    this.sortedColumns = columns || {};
  };

  function Sorting(columns,orderby) {
    this.set(columns,orderby);
  }

  Sorting.prototype.set = function set(columns,orderby) {
    var links= {};
    var orderBy = orderby || "name asc";
    var sort_key = orderBy.replace(/( asc| desc)$/,"");
    var sort_order = orderBy.slice(sort_key.length+1);
    var sort_spec = sort_order ? sort_order + '_' + sort_key : sort_key;
    var sort_name = sort_key.charAt(0).toUpperCase() + sort_key.slice(1);
    if (columns) {
      columns.each(function(el){
        var el_key = el.get("column_key");
        var el_name = el.get("name");
        if (sort_key===el_key) {
          sort_name = el_name;
        } else if (el.get("sort")) {
          links["asc_"+el_key] = { name: el_name };
          links["desc_"+el_key] = { name: el_name };
        }
      });
    }

    if (!sort_order) {
      links[sort_key] = { name: sort_name };
    } else {
      links["asc_"+sort_key] = { name: sort_name };
      links["desc_"+sort_key] = { name: sort_name };
    }
    
    this.links = links;
    this.sort = [ sort_spec ];
  };

  var RelatedWorkspacesSearchResultCollection = NodeCollection.extend({

    constructor: function RelatedWorkspacesSearchResultCollection(models, options) {
      // Core filter values needed for rest api
      this.wherePart = ["where_workspace_type_ids", "where_rel_type"];
      NodeCollection.prototype.constructor.apply(this, arguments);
      this.options = _.pick(options,"query", "connector", "node", "search",
            "autofetch", "autoreset", "stateEnabled","workspace", "orderBy");
      this.workspace = options.workspace;

      // just to fake searchFacets for search.results.view:
      this.searchFacets = new Backbone.Collection();
      this.searchFacets.filters = [];
      this.searchFacets.ensureFetched = function(options) {
        return $.Deferred().resolve(this, {}, options).promise();
      };
      this.searchFacets.getAvailableFacets = function() { return []; };
      this.searchFacets.clearFilter = function() {};

      this.makeBrowsable(options);
      this.makeNodeResource(options);
      this.makeExpandable(options);
      this.makeWorkspacesCollection(options);

      this.completeColumns = new this.columns.constructor(options.columns.toJSON(), { dataCollectionName: this.dataCollectionName });
      this.columns.reset(_.each(options.columns.toJSON(),function(el){delete el.sort;delete el.sort_key;}));
      this.searching = new Searching(this.columns);
      this.sorting = new Sorting(this.completeColumns,this.orderBy);

    }
  });

  BrowsableMixin.mixin(RelatedWorkspacesSearchResultCollection.prototype);
  NodeResourceMixin.mixin(RelatedWorkspacesSearchResultCollection.prototype);
  ExpandableMixin.mixin(RelatedWorkspacesSearchResultCollection.prototype);
  WorkspacesCollectionMixin.mixin(RelatedWorkspacesSearchResultCollection.prototype);

  var super_parse = RelatedWorkspacesSearchResultCollection.prototype.parse;

  _.extend(RelatedWorkspacesSearchResultCollection.prototype, {

    url: function () {
      var queryParams = this.options.query || {};

      // clean up query, including any old or unsupported filters.
      this._cleanupQuery(queryParams);

      // Paging
      queryParams = this.mergeUrlPaging(config, queryParams);

      // Sorting
      queryParams = this.mergeUrlSorting(queryParams);

      // Filtering
      this.filters = _.omit(this.options.search.attributes,"query_id","forcePerspectiveChange","dummy");
      queryParams = this.mergeUrlFiltering(queryParams);

      
      // The search.results.view sets node to node with undefined id.
      // But we need to keep the scope bound to our given workspace node.
      // So we use this.options.node instead this.node
      var workspaceNodeId = this.options.node.get('id');

      // URLs like /nodes/:id/relatedworkspaces
      //var url = this.node.urlBase() + '/relatedworkspaces';
      // Alternative for URLs like /businessworkspaces/:id
      var url = Url.combine(this.getBaseUrl(),
          'businessworkspaces', workspaceNodeId, 'relateditemspicklist');
      url = url.replace('/v1', '/v2');
      queryParams = _.omit(queryParams, function (value, key) {
        return value == null || value === '';
      });
      queryParams.metadata = undefined;
      return url + '?' + this.queryParamsToString(queryParams);
    },

    parse: function(response,options) {
      this.completeColumns.resetColumns(response, this.options);
      var definitions = (response.meta_data && response.meta_data[this.dataCollectionName]) || {};
      _.each(definitions,function(el){delete el.sort;delete el.sort_key;});
      var result = super_parse.apply(this,arguments);
      this.searching.set(this.columns);
      this.sorting.set(this.completeColumns,this.orderBy);
      if (result) {
        var rel_source = this.options.node.get('id');
        var rel_type = this.options.query && this.options.query.where_rel_type;
        result.forEach(function(el){
          el.data || (el.data = {});
          el.data.properties || (el.data.properties = {});
          // set source id of relation
          el.data.properties.rel_source = rel_source;
          // set relation type that will be used in addrelateditem command.
          el.data.properties.rel_type = rel_type;
          // set OTName, so results view does not think we are in a rename operation (CWS-5809)
          el.data.properties.OTName = el.data.properties.name;
        });
      }
      return result;
    },

    setPreviousOrder: function (attributes, fetch) {
      if (!_.isEqual(this.previousOrderBy,attributes)) {
        this.previousOrderBy = attributes;
        if (fetch !== false) {
          this.fetch({skipSort: false});
        }
        return true;
      }
    },

    getResourceScope: function () {
      return {
        query:_.deepClone(this.options.query),
        node: this.node
      };
    },

    setResourceScope: function (scope) {
      scope.query && (this.options.query = scope.query);
      scope.node && (this.node = scope.node);
    },

    isFetchable: function () {
      return this.options.node.isFetchable();
    }

  });

  return RelatedWorkspacesSearchResultCollection;

});

/**
 * Created by stefang on 14.07.2019.
 */
// Fetches the search form.
csui.define('conws/widgets/relatedworkspaces/impl/relatedworkspaces.searchform.model',["csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  'conws/utils/workspaces/impl/workspaceutil'
], function ($, _, Backbone, WorkspaceUtil) {
  

  var RelatedWorkspacesSearchFormModel = Backbone.Model.extend({

        constructor: function RelatedWorkspacesSearchFormModel(attributes, options) {
          options || (options = {});

          attributes = _.extend({data:{},options:{},schema:{}},attributes);
          Backbone.Model.prototype.constructor.call(this, attributes, options);
          this.setFromColumns(options.columns,options.tableColumns);
          this.listenTo(options.columns,"reset update",function() {
              this.setFromColumns(options.columns,options.tableColumns);
          });

        },

        setFromColumns: function(columns,tableColumns) {
            var models = tableColumns && tableColumns.sortBy('sequence').reduce(function(models,column){
                return models.concat([columns.get(column.get("key"))]);
              },[]);
            models = models ? _.compact(models) : columns.models;
            var searchform = FormObject();
            // set a dummy hidden input field, so search with empty fields is allowed by search.object.view.
            SetField(searchform,"dummy","dummy",{type:"hidden"},{type:"string"});
            var data = this.get("data");
            models.forEach(function(col) {
              var col_key = col.get("column_key");
              if (!blacklist[col_key]) {
                var col_data = (data && data.search) ? data.search[col_key] : undefined /*any default value anywhere?*/;
                var fieldform = FormField(col,col_data);
                if (fieldform) {
                  SetField(searchform,col_key,fieldform.data,fieldform.options,fieldform.schema);
                }
              }
            });
            var form = FormObject();
            SetField(form,"search",searchform.data,searchform.options,searchform.schema);
            this.set(form);
        }

      });

      function SetField(form, key, data, options, schema) {
        form.data[key] = data;
        form.options.fields[key] = options;
        form.schema.properties[key] = schema;
      }

      function FormField(col,data) {
        var form;
        var template = WorkspaceUtil.getFormFieldTemplate(col.attributes);
        if (template) {
          form = _.deepClone(template);
          form.data = data;
          form.options.label = col.get("name");
          form.schema.title = col.get("name");
        }
        return form;
      }

      function FormObject(name) {
        var form = {
          data: { },
          options: { type: "object", fields: { } },
          schema: { type: "object", properties: { } }
        };
        if (name) {
          form.options.label = name;
          form.schema.title = name;
        }
        return form;
      }

      var blacklist = {
        "favorite": "true",
        "id": true,
        "modify_date": true,
        "size": true,
        "type": true
      };



  return RelatedWorkspacesSearchFormModel;

});

csui.define('conws/widgets/relatedworkspaces/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/widgets/relatedworkspaces/impl/nls/root/lang',{
  dialogTitle: 'Related workspaces',
  searchPlaceholder: '%1',
  noResultsPlaceholder: 'No related workspaces to display.',
  errorFieldFormatTagUnrecognized: 'Invalid format specification for {0}.',
  ToolbarItemAddRelation: "Add relationships",
  ToolbarItemAddRelationSubmit: "Add relationships",
  ToolbarItemRemoveRelation: "Remove relationships"
});


csui.define('conws/widgets/relatedworkspaces/addrelatedworkspaces.search',[ 'csui/lib/jquery',
    'csui/lib/marionette',
    'csui/lib/handlebars',
    'csui/controls/toolbar/toolitems.factory',
    'conws/utils/overlay/conwsoverlay',
    'csui/widgets/search.results/search.results.view',
    'conws/widgets/relatedworkspaces/impl/relatedworkspaces.searchresult.model',
    'conws/widgets/relatedworkspaces/impl/relatedworkspaces.searchform.model',
    'csui/utils/contexts/factories/search.query.factory',
    'i18n!conws/widgets/relatedworkspaces/impl/nls/lang'
], function ( $,
    Marionette,
    Handlebars,
    ToolItemsFactory,
    ConwsOverlay,
    SearchResultsView,
    RelatedWorkspacesSearchResultModel,
    RelatedWorkspacesSearchFormModel,
    SearchQueryModelFactory,
    lang
) {
    

    var AddRelatedWorkspacesSearch = Marionette.Controller.extend({
    
        constructor: function AddRelatedWorkspacesSearch() {
          Marionette.Controller.prototype.constructor.apply(this, arguments);

          var status = this.options.status;
          var query = $.extend(true, {}, status.collection.options.query);
          query.where_workspace_type_ids = encodeURIComponent("{"+query.where_workspace_type_id+"}");
          query.where_rel_type = query.where_relationtype;
          delete query.where_workspace_type_id;
          delete query.where_relationtype;

          var searchquery = (new SearchQueryModelFactory(status.context)).property;

          var searchResultCollection = new RelatedWorkspacesSearchResultModel([], {
              node: status.collection.node,
              query: query,
              search: searchquery,
              connector: status.collection.connector,
              autofetch:true,
              autoreset:true,
              stateEnabled: true,
              columns: status.collection.columns,
              workspace: status.collection.workspace,
              orderBy: status.collection.orderBy
          });

          var tableColumns = status.originatingView.tableColumns && status.originatingView.tableColumns.deepClone();
          
          var searchFormModel = new RelatedWorkspacesSearchFormModel({},{
            columns: searchResultCollection.columns,
            tableColumns: tableColumns
          });

          var toolItemsFactory = new ToolItemsFactory({
            main: [{
              signature: this.options.signature,
              commandData: { submit: true },
              name: lang.ToolbarItemAddRelationSubmit
              }]
            }, {
            maxItemsShown: 1,
            dropDownText: lang.ToolbarItemMore,
            dropDownIcon: 'icon icon-toolbar-more',
            addGroupSeparators: false
          });

          var toolbarItems = {
            otherToolbar: toolItemsFactory,
            inlineToolbar: [],
            tableHeaderToolbar: toolItemsFactory
          };

          var titleView = new Marionette.ItemView({
            tagName: 'div',
            template: Handlebars.compile('<span><h2 class="csui-custom-search-title">{{title}}</h2><span class="headerCount"/></span>')({
              title: this.options.title
            })
          });
  
          var searchView = new SearchResultsView({
            enableBackButton: true,
            enableSearchSettings: false,
            showFacetPanel: false,
            context: status.context,
            query: searchquery,
            collection: searchResultCollection,
            customSearchViewModel: searchFormModel,
            toolbarItems: toolbarItems,
            titleView: titleView,
            tableColumns: tableColumns
          });

          searchView.on("render",function() {
            searchView.$el.addClass('conws-searchview');
          });
          
          this.searchView = searchView;
        },

        show: function() {
          var overlay = new ConwsOverlay({
            presentationRoot: this.options.status.originatingView.$el.parent(),
            presentationView: this.searchView
          });
          this.searchView.on("go:back", function() {
            overlay.close();
          });
          this._overlay = overlay;
          this._overlay.show();
        },

        close: function() {
          this._overlay.close();
        }

      });
    
      return AddRelatedWorkspacesSearch;
    

});
    
csui.define('conws/utils/workspaces/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/utils/workspaces/impl/nls/root/lang',{
  errorCustomColumnConfigInvalid: "Invalid custom column configuration: {0}.",
  errorCustomColumnMissingBraces: "Missing curly braces in custom column configuration: {0}.",
  errorOrderByMustNotBeString: "Configuration 'orderBy' must be an object not a string.",
  errorOrderByMissingBraces: "Missing curly braces in 'orderBy' configuration.",
  errorFilteringFailed: 'Filtering of result list failed. Please contact your administrator.',
  noWorkspacesFound: 'No workspaces found.',
  selectedItemActionBarAria: 'Action bar of selected items',
  ToolbarItemCloseExpandedView: "Close expanded view"
});



csui.define('css!conws/utils/workspaces/workspaces',[],function(){});

/* START_TEMPLATE */
csui.define('hbs!conws/utils/workspaces/error.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-workspaces-error content-tile\">\r\n  <div class=\"conws-workspaces-error-icon-div\">\r\n    <div class=\"conws-workspaces-error-icon-parent\">\r\n      <div class=\"conws-workspaces-error-icon notification_error\"></div>\r\n    </div>\r\n  </div>\r\n  <div class=\"conws-workspaces-message\">"
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "</div>\r\n</div>";
}});
Handlebars.registerPartial('conws_utils_workspaces_error.template', t);
return t;
});
/* END_TEMPLATE */
;
/**
 * The workspaces view to show a list of workspaces of a specific type
 * Provides:
 *   - infinite scrolling
 *   - Empty view in case no workspaces to show
 *   - Title icon
 */
csui.define('conws/utils/workspaces/workspaces.view',['csui/lib/marionette', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/controls/list/list.view',
  'csui/utils/nodesprites',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/utils/contexts/factories/node',
  'csui/controls/progressblocker/blocker',
  'csui/dialogs/modal.alert/modal.alert',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'css!conws/utils/workspaces/workspaces',
  'hbs!conws/utils/workspaces/error.template'
], function (Marionette, module, _, Backbone, $, base, ListView, NodeSpriteCollection,
    LimitingBehavior, ExpandingBehavior, TabableRegionBehavior, ListViewKeyboardBehavior,
    InfiniteScrollingBehavior, NodeModelFactory, BlockingView, ModalAlert, lang, css, errorTemplate) {

  var config = module.config();

  /**
   * own behavior needed, to be able to trigger the closing
   * of the dialog from within the expanded view itself.
   * Also connect collapsed and expanded view, while expanded view is open,
   * to provide access to each other and disconnect views on close.
   */
  var WorkspacesExpandingBehavior = ExpandingBehavior.extend({

    constructor: function WorkspacesExpandingBehavior( options, view ) {
      options = _.extend({collapsedView:view},options);
      ExpandingBehavior.prototype.constructor.call(this, options,view );
      this.listenTo(view.options.context, "close:expanded", function(ev) {
        if (ev.widgetView===this.expandedView && this.dialog && this.dialog.body && this.dialog.body.currentView===ev.widgetView ) {
          this.dialog.destroy();
        }
      });
    },
    _expandOtherView: function (expand) {
      if (expand===false) {
        // this is on opening the expanded view
        this.expandedView.collapsedView = this.view;
        this.view.expandedView = this.expandedView;
      }
      var result = ExpandingBehavior.prototype._expandOtherView.apply(this, arguments);
      return result;
    },

    _enableExpandingAgain: function () {
      var result = ExpandingBehavior.prototype._enableExpandingAgain.apply(this, arguments);
      // this is on closing the expanded view
      this.expandedView.collapsedView = undefined;
      this.view.expandedView = undefined;
      return result;
    }

  });

  var WorkspacesView = ListView.extend({

    constructor: function WorkspacesView(options) {
      if (options === undefined || !options.context) {
        throw new Error('Context required to create WorkspacesView');
      }

      options.data || (options.data = {});
      ListView.prototype.constructor.apply(this, arguments);

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      this.options.data.pageSize = config.defaultPageSize || 30;

      this.configOptionsData = _.clone(options.data);

      // Prepare server side filter
      this.lastFilterValue = "";

      // Per default show expand icon if more than 0 workspaces are displayed
      this.limit = 0;

      // Render workspace icon
      this.listenTo(this.collection, "sync", this._renderWorkspaceTitleIcon);

      //Show errors
      this.listenTo(this.collection, 'error', this.handleError);

      // In case node model is changed reset data (needed in case other workspaces is opened in
      // same perspective)
      var nodeModel = this.getContext().getObject(NodeModelFactory, options.context.options);
      this.listenTo(nodeModel, 'change:id', this._reset);

      // Note on this.messageOnError
      // Set this property with an action specific error message before triggering the refetch
      // of the collection. If the fetch runs into an error this message is displayed in a modal
      // error message. In any case, error or success, after the server call this message is
      // reset to undefined.

      // Loading animation
      this.listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", function () {
            this.messageOnError = undefined;
            this.unblockActions.apply(this, arguments);
          })
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "error", function () {
            this.unblockActions.apply(this, arguments);
            if (this.messageOnError) {
              ModalAlert.showError(this.messageOnError);
              this.messageOnError = undefined;
            }
          });
      // No empty view in case of loading animation
      this.listenTo(this.collection, "request", this.destroyEmptyView);

      // to reload the collapsed view only in case, the expanded view changed something,
      // we want to check the changed flag of the expanded view.
      this.listenTo(this, "go:away", function() {
        // listen to "go:away", which is triggered on open, and then listen to the "destroy" event of the expanded view.
        // we cannot listen to "go:back" as in some scenarios (CWS-5702, CWS-5807) "hide" events are triggered multiple times.
        var expandedView = this.expandedView;
        if (expandedView) {
          this.listenTo(expandedView, "destroy", function() {
            // called, when expanded view is closed/destroyed.
            // when expanded view was just opened and closed without changing anything,
            // to avoid reloading, check for the changed flag of expanded view.
            if (expandedView && expandedView.changed) {
              this.collection.fetch();
              expandedView = undefined;
            }
          });
        }
      });

    },

    getContext: function () {
      return this.options.context;
    },

    initialize: function () {
      // Limiting behaviour needs complete collection, but other behaviours expect collection ...
      this.collection = this.completeCollection;
    },

    onRender: function () {
      // Load initially only one page
      this._resetInfiniteScrolling();
      ListView.prototype.onRender.call(this);
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    },

    _resetInfiniteScrolling: function () {
      // reset infinite scrolling in case filter is changed
      this.collection.setLimit(0, this.options.data.pageSize, false);
    },

    templateHelpers: function () {
      return {
        title: this._getTitle(),
        imageUrl: this._getTitleIcon().src,
        imageClass: 'conws-workspacestitleicon',
        searchPlaceholder: this._getSearchPlaceholder()
      };
    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    className: function () {
      // conws-relatedworkspaces conws-workspacetype-xxx cs-list
      var className       = this.viewClassName,
          workspaceType   = this.options.data.workspaceType,
          parentClassName = _.result(ListView.prototype, 'className');
      if (workspaceType) {
        className = className + ' conws-workspacetype-' + workspaceType;
      }
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    /**
     * Reset the current model/query and filter
     * Needed that it's not reused in in case widget is accessed again
     * on same perspective but with different node.
     *
     * @private
     */
    _reset: function () {
      // reset paging due to infinite scrolling
      // Page have to be reset in case wiget is accessed again
      if (this.collection) {
        this.collection.resetLimit();
      }

      // Reset filter
      if (this.ui.searchInput && this.ui.searchInput.val() !== "") {
        if (this.collection) {
          this.collection.clearFilter(false);
        }
        this.ui.searchInput.val('');
      }

      // Call search clicked if search is visible, this will cause the search box to slide out
      if (this.ui.searchInput && this.ui.searchInput.is(':visible')) {
        this.searchClicked(new CustomEvent(''));
      }
    },

    workspacesCollectionFactory: undefined,
    workspacesTableView: undefined,
    viewClassName: undefined,
    dialogClassName: undefined,
    lang: undefined,

    behaviors: {

      // Limits the rendered collection length with a More link to expand it
      LimitedList: {
        behaviorClass: LimitingBehavior,
        // Show expand if more than 0 workspaces are displayed
        limit: function () {
          return this.limit;
        },
        completeCollection: function () {
          return this.getContext().getCollection(this.workspacesCollectionFactory, {
            attributes: this._getCollectionAttributes(),
            options: this._getCollectionOptions()
          });
        }
      },

      ExpandableList: {
        behaviorClass: WorkspacesExpandingBehavior,
        expandedView: function () {
          return this.workspacesTableView;
        },
        expandedViewOptions: function () {
          return this._getExpandedViewOptions();
        },
        dialogTitle: function () {
          return this._getTitle();
        },
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: function () {
          return "conwsworkspacestable" + (this.dialogClassName ? " "+this.dialogClassName : "");
        },
        titleBarImageUrl: function () {
          return this._getTitleIcon().src;
        },
        titleBarImageClass: function () {
          return this._getTitleIcon().cssClass || 'conws-workspacestitleicon';
        }
      },

      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior,
        // selector for scrollable area
        contentParent: '.tile-content',
        fetchMoreItemsThreshold: 80
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      }
    },

    _getCollectionOptions: function() {
      return { query: this._getCollectionUrlQuery() };
    },

    _getExpandedViewOptions: function() {
      return { data: _.clone(this.configOptionsData) };
    },

    filterChanged: function (event) {
      if (event && event.type === 'keyup' && event.keyCode === 27) {
        // Hitting Esc should get rid of the filtering control; it resets
        // the filter value automatically
        this.searchClicked();
      }

      var filterValue = this.ui.searchInput.val();
      if (this.lastFilterValue !== filterValue) {
        this.lastFilterValue = filterValue;
        // Wait 1 second to execute
        if (this.filterTimeout) {
          clearTimeout(this.filterTimeout);
        }
        this.filterTimeout = setTimeout(function (self) {
          self.filterTimeout = undefined;
          // reset infinite scrolling because in case filter is changed only first page should be fetched
          self._resetInfiniteScrolling();
          // reset collection that only the returned workspaces are displayed
          // if not reset also old workspaces are displayed ...
          self.collection.reset();
          // execute server side filtering
          var propertyName;
          if (self._getFilterPropertyName) {
            propertyName = self._getFilterPropertyName();
          }
          var filterOptions = {};
          filterOptions[propertyName || "name"] = filterValue;
          if (self.collection.setFilter(filterOptions, {fetch: false})) {
            self.messageOnError = lang.errorFilteringFailed;
            self.collection.fetch();
          }
        }, 1000, this);
      }
    },

    /**
     * Get the title icon for the widget.
     * Initially an invisible icon is returned until the rest call returns.
     * In case the rest call provides an title image this is returned as src, otherwise
     * the default workspace title image is returned as css.
     */
    _getTitleIcon: function () {
      // Set transparent gif that it can be replaced later with proper image
      var icon = {
        src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        cssClass: undefined
      };
      if (this.collection && this.collection.titleIcon) {
        // For each workspace type one icon exist
        icon.src = this.collection.titleIcon;
      } else if (this.collection && this.collection.titleIcon === null) {
        // Need to return as class, because URL would not point to proper image
        icon.cssClass = 'conws-workspacestitleicondefault conws-mime_workspace';
      }
      return icon;
    },

    /**
     * Render workspace icon after rest call returns.
     * Depending on what and if rest call returns an icon,
     * set icon as class (default icon) or the configured one as src.
     * Icons are set via DOM manipulation.
     */
    _renderWorkspaceTitleIcon: function () {
      var titleDivEl = this.$el.find('.tile-type-image')[0],
          titleImgEl = titleDivEl && this.$el.find('.tile-type-image').find("img")[0];
      if (titleImgEl) {
        var icon = this._getTitleIcon();
        if ($(titleImgEl).attr('src') !== icon.src) {
          $(titleImgEl).attr('src', icon.src);
        }

        if (icon.cssClass) {
          // Set via dom proper class that shows icon
          if ($(titleImgEl).attr('class') !== icon.cssClass) {
            $(titleImgEl).attr('class', icon.cssClass);
          }
        }
      }
    },

    _getTitle: function () {
      var ret = this.lang.dialogTitle;

      if (this.options.data.title) {
        ret = base.getClosestLocalizedString(this.options.data.title, this.lang.dialogTitle);
      }

      return ret;
    },

    _getSearchPlaceholder: function () {
      return this.lang.searchPlaceholder.replace("%1", this._getTitle());
    },

    _getNoResultsPlaceholder: function () {
      var ret = this.options.data &&
                this.options.data.collapsedView &&
                this.options.data.collapsedView.noResultsPlaceholder;

      if (ret) {
        ret = base.getClosestLocalizedString(ret, this.lang.noResultsPlaceholder);
      } else {
        ret = this.lang.noResultsPlaceholder;
      }

      return ret;
    },

    // To use default empty view from ListView, the following functions are needed
    collectionEvents: {
      'reset': 'onCollectionSync'
    },

    onCollectionSync: function () {
      this.synced = true;
    },

    isEmpty: function () {
      return this.synced && (this.collection.models.length === 0);
    },

    handleError: function () {
      if (this.collection.error && this.collection.error.message) {
        var emptyEl = errorTemplate.call(this, { errorMessage: this.collection.error.message });
        this.$el.find('.tile-content').append(emptyEl);
      }
    }

  });

  return WorkspacesView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/utils/previewpane/impl/previewheader',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"conws-preview-header-typename\">"
    + this.escapeExpression(((helper = (helper = helpers.typeName || (depth0 != null ? depth0.typeName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"typeName","hash":{}}) : helper)))
    + "</span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "    <a class=\"csui-icon conws-quick_link conws-preview-header-icon\"\r\n       title=\""
    + this.escapeExpression(((helper = (helper = helpers.quickLinkTooltip || (depth0 != null ? depth0.quickLinkTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"quickLinkTooltip","hash":{}}) : helper)))
    + "\"\r\n       href=\""
    + this.escapeExpression(((helper = (helper = helpers.display_url || (depth0 != null ? depth0.display_url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"display_url","hash":{}}) : helper)))
    + "\" target=\"_blank\"></a>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "  <a class=\"conws-preview-header-title narrow\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"\r\n     href=\""
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "  <a class=\"conws-preview-header-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"\r\n     href=\""
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.typeName : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.display_url : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.display_url : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0)})) != null ? stack1 : "")
    + "\r\n";
}});
Handlebars.registerPartial('conws_utils_previewpane_impl_previewheader', t);
return t;
});
/* END_TEMPLATE */
;
// Shows a list of workspaces related to the current one
csui.define('conws/utils/previewpane/impl/previewheader.view',['csui/lib/underscore', 'csui/lib/marionette',
  'csui/lib/numeral', 'csui/lib/moment', 'csui/lib/handlebars',
  'csui/behaviors/default.action/default.action.behavior',
  'i18n', 'hbs!conws/utils/previewpane/impl/previewheader',
  'css!conws/utils/icons/icons'
], function (_, Marionette, numeral, moment, Handlebars,
    DefaultActionBehavior, i18n, headerTemplate) {
  var PreviewHeaderView = Marionette.ItemView.extend({

    constructor: function PreviewHeaderView() {
      Marionette.ItemView.apply(this, arguments);
    },

    className: 'preview-header',
    template: headerTemplate,
    templateHelpers: function () {
      return {
        defaultActionUrl: DefaultActionBehavior.getDefaultActionNodeUrl(this.model)
      }
    }
  });

  return PreviewHeaderView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/modaldialog/impl/modal.dialog.view',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "      <div class=\"conws-modal-dialog dialog-header\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "      <div class=\"conws-modal-dialog dialog-body\"></div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "      <div class=\"conws-modal-dialog dialog-footer\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"binf-modal-dialog conws-modal-dialog "
    + this.escapeExpression(((helper = (helper = helpers.modalClassName || (depth0 != null ? depth0.modalClassName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"modalClassName","hash":{}}) : helper)))
    + "\">\r\n  <div class=\"binf-modal-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.existsHeader : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.existsBody : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.existsFooter : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_modaldialog_impl_modal.dialog.view', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/dialogs/modaldialog/impl/modal.dialog.view',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'hbs!conws/widgets/team/impl/dialogs/modaldialog/impl/modal.dialog.view',
  'css!conws/widgets/team/impl/dialogs/modaldialog/impl/modal.dialog.view'
], function (_, $, Backbone, Marionette, TabablesBehavior, template) {

  var NonEmptyingRegion = Marionette.Region.extend({

    constructor: function NonEmptyingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {
      this.el.appendChild(view.el);
    }
  });

  var ModalDialogView = Marionette.LayoutView.extend({

    className: 'cs-dialog binf-modal binf-fade conws-modal-dialog-parent',

    attributes: {
      'tabindex': '-1',
      'role': 'dialog',
      'aria-hidden': 'true'
    },

    template: template,

    templateHelpers: function () {
      return {
        existsHeader: !_.isUndefined(this.options.header),
        existsBody: !_.isUndefined(this.options.body),
        existsFooter: !_.isUndefined(this.options.footer),
        modalClassName: this.options.modalClassName
      }
    },

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    ui: {
      header: '.dialog-header',
      body: '.dialog-body',
      footer: '.dialog-footer'
    },

    regions: {
      header: '.dialog-header',
      body: '.dialog-body',
      footer: '.dialog-footer'
    },

    events: {
      'keydown': 'onKeyDown',
      'hidden.binf.modal': 'onHidden',
      'shown.binf.modal': 'onShown'
    },

    // constructor for the RolesEdit dialog
    constructor: function ModalDialogView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    show: function () {
      // add region and view to region
      var container = $.fn.binf_modal.getDefaultContainer ? $.fn.binf_modal.getDefaultContainer() : document.body,
          region = new NonEmptyingRegion({el: container});
      region.show(this);
      // and return view
      return this;
    },

    destroy: function () {
      // hide the dialog
      if (this.$el.is(':visible')) {
        this.$el.binf_modal('hide');
      } else {
        ModalDialogView.__super__.destroy.apply(this, arguments);
      }
      $('body').addClass('binf-modal-open');
      return this;
    },

    kill: function () {
      ModalDialogView.__super__.destroy.apply(this, arguments);
      return true;
    },

    onRender: function () {
      if (this.options.dialogTxtAria) {
        this.$el.attr({
            'aria-label': this.options.dialogTxtAria
          });
      }
      if (this.options.body) {
        this.body.show(this.options.body);
      }
    },

    onShow: function () {
      this.$el.binf_modal({
        backdrop: 'static',
        keyboard: false
      });
    },

    onKeyDown: function (e) {
      if (e.keyCode === 27 && e.target.id !== 'filtersearch') {
          this.destroy();
      }
    },

    onHidden: function () {
      this.destroy();
    },

    onShown: function () {
      if (this.options.body) {
        this.options.body.triggerMethod('dom:refresh');
        this.options.body.triggerMethod('after:show');
      }
    }
  });

  return ModalDialogView;

});

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/rolepicker/impl/role',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span style=\"white-space:pre\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_rolepicker_impl_role', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/team/impl/controls/rolepicker/impl/role.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!conws/widgets/team/impl/controls/rolepicker/impl/role'
], function (_, $, Marionette, template) {

  var RoleView = Marionette.ItemView.extend({

    tagName: 'span',

    template: template,

    templateHelpers: function () {
      return {
        'name': this.model.get('name')
      };
    },

    constructor: function RoleView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });

  return RoleView;
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"search-input\"></div>\r\n<div class=\"search-clear\"></div>\r\n<div class=\"typeahead cs-search-icon icon-caret-down\"\r\n     title=\""
    + this.escapeExpression(((helper = (helper = helpers.showValues || (depth0 != null ? depth0.showValues : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showValues","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showValues || (depth0 != null ? depth0.showValues : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showValues","hash":{}}) : helper)))
    + "\">\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_rolepicker_impl_rolepicker', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker.clear',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"typeahead cs-search-clear csui-icon formfield_clear\" style=\"\"\r\n     title=\""
    + this.escapeExpression(((helper = (helper = helpers.clearValue || (depth0 != null ? depth0.clearValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearValue","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.clearValue || (depth0 != null ? depth0.clearValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearValue","hash":{}}) : helper)))
    + "\">\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_rolepicker_impl_rolepicker.clear', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker.input',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<input class=\"typeahead binf-form-control cs-search\" type=\"search\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholder","hash":{}}) : helper)))
    + "\">\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_rolepicker_impl_rolepicker.input', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker',[],function(){});
csui.define('conws/widgets/team/impl/controls/rolepicker/rolepicker.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/widgets/team/impl/controls/rolepicker/impl/role.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker',
  'hbs!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker.clear',
  'hbs!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker.input',
  'css!conws/widgets/team/impl/controls/rolepicker/impl/rolepicker',
  'csui/lib/bootstrap3-typeahead'
], function (_, $, Marionette, base, TabableRegionBehavior, LayoutViewEventsPropagationMixin,
    RoleView, lang, tplRolePicker, tplClear, tplInput) {

  var RolePickerSearch = Marionette.ItemView.extend({

    template: tplInput,

    templateHelpers: function () {
      return {
        placeholder: this.options.placeholder
      };
    },

    ui: {
      searchbox: '.typeahead.cs-search'
    },

    events: {
      'keydown @ui.searchbox': 'onKeyDown',
      'keyup @ui.searchbox': 'onKeyUp',
      'dragstart .typeahead.binf-dropdown-menu li > a': 'onDragRole'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    triggers: {
      'click @ui.searchbox': 'click',
      'focus @ui.searchbox': 'focus'
    },

    constructor: function RolePickerSearch(options) {
      options || (options = {});

      // initialize options
      options.delay || (options.delay = 200);
      options.minLength || (options.minLength = 0);
      options.placeholder || (options.placeholder = lang.addParticipantsRolePickerPlaceholder);
      options.roles || (options.roles = []);
      options.prettyScrolling || (options.prettyScrolling = false);
      if (options.showInherited === undefined) {
        options.showInherited = true;
      }
      // sort roles
      options.roles.comparator = function (left, right) {
        return base.localeCompareString(left.get('name'), right.get('name'));
      };
      options.roles.sort();

      this.rolePicked = true;
      // apply marionette item view
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      // listen to change of 'clearInput'
      this.listenTo(options.view, 'clearInput', this.clear);
    },

    onRender: function () {
      // initialize typeahead control
      this.$('input.typeahead').typeahead({
        items: 'all',
        afterSelect: _.bind(this._afterSelect, this),
        highlighter: _.bind(this._renderHighlighter, this),
        delay: this.options.delay,
        displayText: this._retrieveDisplayText,
        matcher: this._matcher,
        afterHide: _.bind(this._afterHide, this),
        nextHighlighter: _.bind(this._nextHighlighter, this),
        accessbility: _.bind(this._accessbility, this),
        currentHighlighter: _.bind(this._currentHighlighter, this),
        sorter: this._sorter,
        minLength: this.options.minLength,
        source: _.bind(this._source, this),
        prettyScrolling: this.options.prettyScrolling,
        appendTo: this.$el
      });
      this.ui.searchbox.append(this.options.$el);
    },

    onClick: function (e) {
      // show roles
      this.ui.searchbox.trigger('focus');
      this.ui.searchbox.typeahead('lookup', this.ui.searchbox.val());
    },

    onKeyUp: function (e) {
      var fldVal = this.ui.searchbox.val();
      if (fldVal.length === 0 && (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 46)) {
        this.rolePicked = false;
      } else {
        this.rolePicked = true;
        // update styles
        this.options.view.filterLength = this.ui.searchbox.val().length;
        this.options.view.trigger('updateStyles');
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode === 9) {
        // update styles
        this.options.view.filterLength = this.ui.searchbox.val().length;
        this.options.view.trigger('updateStyles');
        // suppress afterselect handler by hiding the typeahead dropdown
        this.ui.searchbox.typeahead('hide');
      }
    },

    // disable role dragging
    onDragRole: function (e) {
      return false;
    },

    isTabable: function () {
      // in case of error, this is called during destroy and searchbox is a selector string, not a jquery element.
      return $(this.ui.searchbox).is(':not(:disabled)') && $(this.ui.searchbox).is(':not(:hidden)') &&
             $(this.ui.searchbox).is(':visible');
    },

    clear: function () {
      this.ui.searchbox.val('');
      this.ui.searchbox.trigger('focus');
      this.ui.searchbox.typeahead('lookup', this.ui.searchbox.val());
    },

    currentlyFocusedElement: function () {
      return this.ui.searchbox;
    },

    _source: function (query) {
      // prepare collection
      var ret = [];
      if (this.rolePicked  && this.options.roles !== undefined) {
        if (this.options.showInherited) {
          ret = this.options.roles.models;
        } else {
          ret = this.options.roles.filter(function (role) {
            return !role.get('inherited_from_id');
          });
        }
      }
      return ret;
    },

    _matcher: function (item) {
      var it = item.get('name');
      return ~it.toLowerCase().indexOf(this.query.toLowerCase());
    },

    _sorter: function (items) {
      return items;
    },

    _retrieveDisplayText: function (item) {
      return item.get('name');
    },

    _afterSelect: function (item) {
      // update text and trigger change
      this.ui.searchbox.val('');
      // update styles
      this.options.view.filterLength = this.ui.searchbox.val().length;
      this.options.view.trigger('updateStyles');
      // trigger change
      this.options.view.trigger('item:change', {
        item: item
      });
    },

    _renderHighlighter: function (item) {
      var model = this.options.roles.findWhere({name: item});
      // create view ...
      var view = new RoleView({
        model: model,
        connector: this.options.roles.connector
      });
      // ... and render
      return view.render().el;
    },

    _afterHide: function() {
      return;
    },

    _currentHighlighter: function (item) {
      return;
    },

    _nextHighlighter: function (item) {
      return;
    },

    _accessbility: function(item) {
      return;
    }
  });

  var RolePickerClear = Marionette.ItemView.extend({

    template: tplClear,

    templateHelpers: function () {
      return {
        clearValue: lang.addParticipantsRolePickerClear
      };
    },

    ui: {
      searchclear: '.typeahead.cs-search-clear'
    },

    events: {
      'click @ui.searchclear': 'onClickClear',
      'keyup @ui.searchclear': 'onClearKeyUp'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function RolePickerClear(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      // listen to change of 'updateStyles'
      this.listenTo(options.view, 'updateStyles', this.updateStyles);
    },

    onClickClear: function (e) {
      // clear the search, update styles ...
      this.updateStyles();
      // and open unfiltered
      this.options.view.trigger('clearInput');
    },

    onClearKeyUp: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        // clear the search, update styles ...
        this.updateStyles();
        // and open unfiltered
        this.options.view.trigger('clearInput');
      }
    },
    // switch the clear button depending on the text value.
    updateStyles: function () {
      var clear = this.options.view.filterLength > 0;
      this.ui.searchclear.css({
        'display': clear ? '' : 'none'
      }).attr('tabindex', 0)
    },

    isTabable: function () {
      // in case of error, this is called during destroy and searchclear is a selector string, not a jquery element.
      return $(this.ui.searchclear).is(':not(:disabled)') && $(this.ui.searchclear).is(':not(:hidden)') &&
             $(this.ui.searchclear).is(':visible');
    },

    currentlyFocusedElement: function () {
      return this.ui.searchclear;
    }
  });

  var RolePickerView = Marionette.LayoutView.extend({

    tagName: 'div',

    className: 'conws-control-rolepicker',

    template: tplRolePicker,

    templateHelpers: function () {
      return {
        showValues: lang.addParticipantsRolePickerShow
      };
    },

    ui: {
      rolepicker: 'div.conws-control-rolepicker',
      searchicon: '.typeahead.cs-search-icon',
      searchbox: '.search-input',
      searchclear: '.search-clear'
    },

    regions: {
      searchRegion: '@ui.searchbox',
      clearRegion: '@ui.searchclear'
    },

    triggers: {
      'click @ui.searchicon': 'click'
    },

    constructor: function RolePickerView(options) {
      options || (options = {});

      this.filterLength = 0;
      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      // listen to change the focus
      this.listenTo(this, 'updateFocus', this.updateFocus);
      // propagate events to regions
      this.propagateEventsToRegions();
    },

    onRender: function () {
      // render the filter elements if active
      var searchView = this.searchView;
      if (searchView) {
        this.searchRegion.show(searchView);
      } else {
        searchView = this.searchView = new RolePickerSearch(
            $.extend({}, this.options, {
              view: this
            }));
        this.searchRegion.show(searchView);
      }
      // clear button
      this.clearView = new RolePickerClear(
          $.extend({}, this.options, {
            view: this
          }));
      this.clearRegion.show(this.clearView);
      // update styles
      this.clearView.updateStyles();
    },

    onClick: function (e) {
      // show roles
      this.updateFocus();
      this.searchView.$('input.typeahead').typeahead('lookup', this.ui.searchbox.val());
    },

    updateFocus: function(){
      // show roles
      this.searchView.currentlyFocusedElement().trigger('focus');
    }

  });
  // add event propagation mixin
  _.extend(RolePickerView.prototype, LayoutViewEventsPropagationMixin);
  
  return RolePickerView;
});
csui.define('conws/widgets/team/impl/behaviors/list.keyboard.behavior',[
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette'
], function (module, _, $, Marionette) {
  

  var ListKeyboardBehavior = Marionette.Behavior.extend({

    defaults: {
      'currentlyFocusedElementSelector': 'li:nth-child({0})'
    },

    constructor: function ListKeyboardBehavior(options, view) {
      // apply marionette behavior implementation
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      // extend the views
      _.extend(view, {

        // storage for the selected index
        selectedIndex: 0,

        // support up/down navigation
        onKeyDown: function (e) {
          var $preElem = this.currentlyFocusedElement();

          switch (e.keyCode) {
          case 38: // up
            this._moveTo(e, this._selectPrevious(), $preElem);
            break;
          case 40: // down
            this._moveTo(e, this._selectNext(), $preElem);
            break;
          }
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            $preElem && $preElem.prop('tabindex', '-1');
            $elem.prop('tabindex', '0');
            $elem.trigger('focus');
          }, this), 50);
        },

        _selectNext: function () {
          var collection = this.model || this.collection;
          if (this.selectedIndex < collection.length - 1) {
            this.selectedIndex++;
          }
          return this.currentlyFocusedElement();
        },

        _selectPrevious: function () {
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.currentlyFocusedElement();
        },

        currentlyFocusedElementSelector: this.options.currentlyFocusedElementSelector,

        currentlyFocusedElement: function () {
          // reset the focused list index whenever the previous index is larger than the
          // currently rendered elements
          var collection = this.model || this.collection;
          if ((this.selectedIndex !== 0) && (this.selectedIndex >= collection.length)) {
            this.selectedIndex = collection.length - 1;
          }
          // find the element at the current index and return
          var $item = this.$(_.str.sformat(this.currentlyFocusedElementSelector, this.selectedIndex + 1));
          var elementOfFocus = ($item.length !== 0) ? this.$($item[0]) : null;
          return elementOfFocus;
        }
      });
    } // constructor
  });

  return ListKeyboardBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-alert binf-alert-success binf-alert-dismissible\">\r\n  <strong title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</strong>\r\n  <div class=\"remove binf-alert-close binf-close\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"\r\n       title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeRole || (depth0 != null ? depth0.removeRole : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeRole","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.removeRole || (depth0 != null ? depth0.removeRole : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeRole","hash":{}}) : helper)))
    + "\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_addparticipants_impl_participant.roles', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/url',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles',
  'css!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles'
], function (_, $, Marionette, TabableRegionBehavior, Url, ListKeyboardBehavior, lang,
    childTemplate) {

  var ParticipantRolesItemView = Marionette.ItemView.extend({

    tagName: 'li',

    template: childTemplate,

    templateHelpers: function () {
      return {
        removeRole: lang.rolesDialogRemoveRole,
        name: this.model.get('name'),
        id: this.model.get('id')
      };
    },

    events: {
      'click .remove': 'onRemoveOnClick',
      'keydown .binf-alert': 'onRemoveOnKeyDown'
    },

    constructor: function ParticipantRoleView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRemoveOnClick: function (e) {
      // stop propagation
      e.preventDefault();
      e.stopPropagation();
      // trigger event
      this.triggerMethod('remove:role', {model: this.model});
    },

    onRemoveOnKeyDown: function (e) {
      // Enter, Space or DEL?
      if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 46) {
        // stop propagation
        e.preventDefault();
        e.stopPropagation();
        // trigger event
        this.triggerMethod('remove:role', {model: this.model});
      }
    }
  });

  var ParticipantRolesListView = Marionette.CollectionView.extend({

    tagName: 'ul',

    childView: ParticipantRolesItemView,

    // required by the list keyboard behavior
    events: {
      'keydown': 'onKeyDown'
    },

    // view behaviors
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior,
        currentlyFocusedElementSelector: 'li:nth-child({0}) .binf-alert'
      }
    },

    constructor: function ParticipantRolesListView(options) {
      // apply properties to parent
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    onAddChild: function () {
      this.triggerMethod('refresh:tabindexes');
    },

    onRemoveChild: function () {
      this.triggerMethod('refresh:tabindexes');
    }
  });

  // return view
  return ParticipantRolesListView;
});

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"participant-content binf-pull-left\"></div>\r\n<div class=\"participant-roles binf-pull-left\"></div>\r\n<div class=\"participant-delete binf-pull-right\"></div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_addparticipants_impl_participant.listitem', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.roles',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"participant-roles-list\">\r\n  <!-- role items -->\r\n</div>\r\n<div class=\"conws-participants-rolepicker\">\r\n  <!-- roles picker region -->\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_addparticipants_impl_participant.listitem.roles', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.delete',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"remove csui-icon cs-icon-delete\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"\r\n      title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeParticipant || (depth0 != null ? depth0.removeParticipant : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeParticipant","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.removeParticipant || (depth0 != null ? depth0.removeParticipant : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeParticipant","hash":{}}) : helper)))
    + "\"></span>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_addparticipants_impl_participant.listitem.delete', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/url',
  'csui/utils/contexts/factories/user',
  'esoc/widgets/userwidget/userwidget',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'conws/widgets/team/impl/controls/rolepicker/rolepicker.view',
  'conws/widgets/team/impl/dialogs/addparticipants/impl/participant.roles.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.details',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.roles',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.delete',
  'css!conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem'
], function (_, $, Marionette, TabableRegionBehavior, LayoutViewEventsPropagationMixin, Url,
    UserModelFactory, UserWidget, Avatar,
    RolePicker, ParticipantRolesListView, lang, itemTemplate, detailsTemplate, rolesTemplate,
    deleteTemplate) {

  var ParticipantPropertiesView = Marionette.ItemView.extend({

    template: detailsTemplate,

    templateHelpers: function () {
      return {
        type: this.model.getMemberType(),
        name: this.model.displayName(),
        email: this.model.displayEmail(),
        title: this.model.displayTitle(),
        department: this.model.displayDepartment(),
        office: this.model.displayOffice()
      };
    },

    ui: {
      personalizedImage: '.csui-icon-user',
      defaultImage: '.csui-icon-paceholder'
    },

    // constructor for the 'add participant' listitem
    constructor: function ParticipantPropertiesView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    initialize: function () {
      this.avatar = new Avatar({model: this.model});
    },

    onRender: function () {
      // render profile image
      if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
        var loggedUser = this.model.collection.workspaceContext.getModel(UserModelFactory),
          userProfilePicOptions = {
            connector: this.model.connector,
            model: this.model,
            userid: this.model.get('id'),
            context: this.model.collection.workspaceContext,
            showUserProfileLink: true,
            showMiniProfile: true,
            loggedUserId: loggedUser.get('id'),
            placeholder: this.$el.find('.participant-picture'),
            showUserWidgetFor: 'profilepic'
          };
        UserWidget.getUser(userProfilePicOptions);
      }
      else {
        this.$('.participant-picture').append(this.avatar.render().$el);
      }
    }
  });

  var ParticipantRolesView = Marionette.LayoutView.extend({

    regions: {
      rolesListRegion: '.participant-roles-list',
      rolePickerRegion: '.conws-participants-rolepicker'
    },

    template: rolesTemplate,

    constructor: function ParticipantRolesView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      // propagate events to regions
      this.propagateEventsToRegions();
    },

    onRender: function () {
      // participant roles list
      var roles = new ParticipantRolesListView({
        collection: this.model.roles
      });
      this.rolesListRegion.show(roles);
      this.listenTo(roles, 'childview:remove:role', this.onRoleItemRemove);

      // role picker
      var role = new RolePicker({
        placeholder: lang.addParticipantsRolePickerPlaceholderMore,
        roles: this.model.collection.roles,
        showInherited: false,
        prettyScrolling: true
      });
      this.rolePickerRegion.show(role);
      this.listenTo(role, 'item:change', this.onRoleItemChanged);
    },

    onRoleItemChanged: function (e) {
      this.model.roles.add(e.item);
    },

    onRoleItemRemove: function (view, args) {
      // remove assigned role
      this.model.roles.remove(args.model);

      // set focus to input field of search if the last role is remove
      if (this.model.roles.length === 0) {
        this.rolePickerRegion.currentView.trigger('updateFocus');
      }
    }
  });

  var ParticipantDeleteView = Marionette.ItemView.extend({

    template: deleteTemplate,

    templateHelpers: function () {
      return {
        removeParticipant: lang.addParticipantsRemove
      };
    },

    events: {
      'click .remove': 'onRemoveOnClick',
      'keydown .remove': 'onRemoveOnKeyDown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function ParticipantDeleteView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRemoveOnClick: function (e) {
      // stop propagation
      e.preventDefault();
      e.stopPropagation();
      // remove participant
      this.model.collection.remove(this.model);
    },

    onRemoveOnKeyDown: function (e) {
      // Enter, Space or DEL?
      if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 46) {
        // stop propagation
        e.preventDefault();
        e.stopPropagation();
        // remove participant
        this.model.collection.remove(this.model);
      }
    },

    // delete button is focused
    currentlyFocusedElement: function () {
      return this.$('.remove');
    }
  });

  var ParticipantListItemView = Marionette.LayoutView.extend({

    template: itemTemplate,

    tagName: 'li',

    className: 'binf-list-group-item conws-participant',

    regions: {
      content: '.participant-content',
      roles: '.participant-roles',
      delete: '.participant-delete'
    },

    // constructor for the 'add participant' listitem
    constructor: function ParticipantListItemView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      // listen to the change of the roles
      this.listenTo(this.model.roles, 'reset remove add', this.onParticipantRolesChanged);
      // listen to the change of the model
      this.listenTo(this.model, 'remove', this.onParticipantRemove);

      // propagate events to regions
      this.propagateEventsToRegions();
    },

    onRender: function () {
      // render content
      this.content.show(
          new ParticipantPropertiesView({
            model: this.model
          }));
      // render roles
      this.roles.show(
          new ParticipantRolesView({
            model: this.model
          }));
      // render remove button
      this.delete.show(
          new ParticipantDeleteView({
            model: this.model
          }));
      // styling
      this.applyRolesStyle();
      this.applyRolesHeight(true);
    },

    onParticipantRemove:function () {
      this._parent.selectedIndex = this._index;
    },

    onParticipantRolesChanged: function (model, collection, options) {
      // and trigger participant collection change
      this.model.collection.trigger('change', this.model.collection);
      // change style ...
      this.applyRolesStyle();
      // change height - in case the options index property is
      // available the event is triggered due to a remove action.
      var added = _.isUndefined(options.index);
      this.applyRolesHeight(added);
    },

    applyRolesStyle: function () {
      // depending on the roles count the
      // item is styled
      if (this.model.roles.length !== 0) {
        this.$el.addClass('has-role');
        this.$el.removeClass('no-role');
      } else {
        this.$el.addClass('no-role');
        this.$el.removeClass('has-role');
      }
    },

    applyRolesHeight: function (add) {
      // the item height has to be calculated manually
      // as it should grow with the roles count
      //
      // get the top + bottom margin height
      var space = this.$el.outerHeight() - this.$el.height();
      // get the roles picker height
      var picker = this.$('.conws-participants-rolepicker .cs-search').outerHeight();
      // calculate  the roles list height
      var roles = this.$('.participant-roles-list').outerHeight();
      var len = this.model.roles.length;
      if (len > 1) {
        roles = (roles / (add ? len - 1 : len + 1)) * len;
      } else if (len === 1) {
        roles = (roles / (add ? len : len + 1)) * len;
      }
      this.$el.height(picker + roles + (space / 2));
    }
  });

  // add mixin
  _.extend(ParticipantRolesView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(ParticipantListItemView.prototype, LayoutViewEventsPropagationMixin);

  // return view
  return ParticipantListItemView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/footer/impl/footer',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"conws-roles-edit-buttons binf-modal-footer\">\r\n  <span class=\"conws-roles-edit-reset-region\"></span>\r\n  <span class=\"conws-roles-edit-save-region\"></span>\r\n  <span class=\"conws-roles-edit-cancel-region\"></span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_footer_impl_footer', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/footer/impl/button',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "disabled";
},"3":function(depth0,helpers,partials,data) {
    return "data-binf-dismiss=\"modal\"";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<button class=\"binf-btn binf-btn-default btn-footer "
    + this.escapeExpression(((helper = (helper = helpers.css || (depth0 != null ? depth0.css : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"css","hash":{}}) : helper)))
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.close : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " >"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</button>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_footer_impl_button', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/controls/footer/impl/footer',[],function(){});
csui.define('conws/widgets/team/impl/controls/footer/footer.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'hbs!conws/widgets/team/impl/controls/footer/impl/footer',
  'hbs!conws/widgets/team/impl/controls/footer/impl/button',
  'css!conws/widgets/team/impl/controls/footer/impl/footer'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, LayoutViewEventsPropagationMixin,
    templateFooter, templateButton) {

  var ButtonView = Marionette.ItemView.extend({

    tagName: 'span',

    // template helper to prepare the model for the view
    templateHelpers: function () {
      return {
        label: this.model.get('label'),
        css: this.model.get('css'),
        disabled: this.model.get('disabled'),
        close: this.model.get('close')
      };
    },

    template: templateButton,

    ui: {
      button: '.btn-footer'
    },

    events: {
      'click @ui.button': 'onClick'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    onClick: function (e) {
      // execute the callback
      var callback = this.model.get('click');
      if (callback && _.isFunction(callback)) {
        callback(e);
      }
    },

    constructor: function ButtonView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    },

    isTabable: function () {
      // in case of error, this is called during destroy and button is a selector string, not a jquery element.
      return $(this.ui.button).is(':enabled');
    },

    currentlyFocusedElement: function () {
      return this.ui.button;
    }
  });

  var FooterView = Marionette.LayoutView.extend({

    regions: {
      resetRegion: '.conws-roles-edit-reset-region',
      submitRegion: '.conws-roles-edit-save-region',
      cancelRegion: '.conws-roles-edit-cancel-region'
    },

    template: templateFooter,

    constructor: function FooterView(options) {
      // assign button models
      this.buttons = options.collection.models;

      // apply marionette layoutview
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      //listen to set focus
      this.listenTo(this , 'updateButton', this.updateButton);

      // propagate events to regions
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var self = this;
      _.each(this.buttons, function (button) {
        if (button.id === 'reset') {
          self.resetView = new ButtonView({
            model: button,
            initialActivationWeight: button.get('initialActivationWeight')
          });
          self.resetRegion.show(self.resetView);
        } else if (button.id === 'submit') {
          self.submitView = new ButtonView({
            model: button,
            initialActivationWeight: button.get('initialActivationWeight')
          });
          self.submitRegion.show(self.submitView);
        } else if (button.id === 'cancel') {
          self.cancelView = new ButtonView({
            model: button,
            initialActivationWeight: button.get('initialActivationWeight')
          });
          self.cancelRegion.show(self.cancelView);
        }
      });
    },

    updateButton: function () {
      var self = this;
      _.each(self.collection.models, function (button) {
        if (!button.get('disabled')) {
          if (button.id === 'submit') {
            self.submitView.currentlyFocusedElement().focus();
          } else if (button.id === 'cancel') {
            self.cancelView.currentlyFocusedElement().focus();
          } else if (button.id === 'reset') {
            self.resetView.currentlyFocusedElement().focus();
          }
        }
      });
    }
  });

  // add event propagation mixin
  _.extend(FooterView.prototype, LayoutViewEventsPropagationMixin);

  // return
  return FooterView;
});

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/addparticipants',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-modal-content\">\r\n  <div class=\"binf-modal-header\">\r\n    <h4 class=\"binf-modal-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h4>\r\n    <div class=\"conws-addparticipants-search\">\r\n      <div class=\"conws-addparticipants-userpicker\">\r\n        <!-- user picker region -->\r\n      </div>\r\n      <div>\r\n        <div class=\"conws-addparticipants-rolepicker\">\r\n          <!-- roles picker region -->\r\n        </div>\r\n        <div class=\"conws-addparticipants-rolepicker-help\">"
    + this.escapeExpression(((helper = (helper = helpers['roles-help'] || (depth0 != null ? depth0['roles-help'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"roles-help","hash":{}}) : helper)))
    + "</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"binf-modal-body\">\r\n    <div class=\"conws-addparticipants-members\"></div>\r\n  </div>\r\n  <div class=\"conws-addparticipants-buttons\">\r\n    <!-- button bar region -->\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_addparticipants_impl_addparticipants', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/dialogs/addparticipants/impl/addparticipants',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/addparticipants/addparticipants.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/dialogs/modal.alert/modal.alert',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/participant.model',
  'conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.view',
  'conws/widgets/team/impl/controls/rolepicker/rolepicker.view',
  'conws/widgets/team/impl/controls/footer/footer.view',
  'csui/controls/userpicker/userpicker.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/addparticipants',
  'css!conws/widgets/team/impl/dialogs/addparticipants/impl/addparticipants'
], function (_, $, Backbone, Marionette, base, ConnectorFactory, NodeFactory,
    LayoutViewEventsPropagationMixin, ModalAlert, WorkspaceContextFactory, Participant,
    ParticipantView, RolePicker, ButtonBar, UserPicker, lang, template) {

  var ParticipantsListCollectionView = Marionette.CollectionView.extend({

    tagName: 'ul',

    className: 'binf-list-group',

    childView: ParticipantView,

    constructor: function ParticipantsListCollectionView(options) {
      Marionette.CollectionView.call(this, options);
      //listen to change the focus
      this.listenTo(this, 'moveTabIndex', this.moveTabIndex);
    },

    moveTabIndex:function(view){
      this.children.each(function (participantView) {
        if(view.children.length === view.selectedIndex){
          view.selectedIndex = view.children.length - 1;
        }
        if (participantView._index === view.selectedIndex) {
          participantView.roles.currentView.rolePickerRegion.currentView.trigger('updateFocus')
        }
      });
    }
  });

  var AddParticipantsView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      userPickerRegion: '.conws-addparticipants-userpicker',
      rolePickerRegion: '.conws-addparticipants-rolepicker',
      buttonsRegion: '.conws-addparticipants-buttons',
      participantsRegion: '.conws-addparticipants-members'
    },

    templateHelpers: {
      'title': lang.addParticipantsTitle,
      'roles-help': lang.addParticipantsRolesHelp
    },

    constructor: function AddParticipantsView(options) {
      options || (options = {});

      this.view = options.view;
      this.context = options.view.context;
      this.connector = options.view.context.getObject(ConnectorFactory, options.view);
      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.view.context.getObject(WorkspaceContextFactory);
      }
      this.workspaceContext = options.workspaceContext;

      this.teamRoles = options.view.roleCollection.clone() ;
      this.teamParticipants = options.view.participantCollection;

      // listen to team view close
      this.listenTo(this.view, 'destroy', this.close);

      // initialize button model
      this.buttonsModel = undefined;

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      // propagate events to regions
      this.propagateEventsToRegions();
    },

    onRender: function () {
      // user picker
      var user = new UserPicker({
        context: this.workspaceContext,
        limit: 20,
        clearOnSelect: true,
        placeholder: lang.addParticipantsUserPickerPlaceholder,
        disabledMessage: lang.addParticipantsDisabledMemberMessage,
        onRetrieveMembers: _.bind(this.retrieveMembersCallback, this),
        prettyScrolling: true,
        initialActivationWeight: 100
      });
      this.userPickerRegion.show(user);
      user.$(".cs-search-icon").attr("aria-label",lang.addParticipantsSearchAria);
      this.listenTo(user, 'item:change', this.onUserItemChanged);

      // role picker
      var role = new RolePicker({
        roles: this.teamRoles,
        showInherited: false,
        prettyScrolling: true
      });
      this.rolePickerRegion.show(role);
      this.listenTo(role, 'item:change', this.onRoleItemChanged);

      // participants list
       var participants = new ParticipantsListCollectionView({
         context: this.options.workspaceContext,
         collection: _.extend(new Backbone.Collection(), {
           workspaceContext: this.workspaceContext,
           node: this.workspaceContext.getModel(NodeFactory),
           roles: this.teamRoles,
           comparator: function (left, right) {
             return base.localeCompareString(left.get('display_name'), right.get('display_name'));
           }
         })
       });
      this.participantsRegion.show(participants);
      // participants collection
      this.participants = participants.collection;
      this.listenTo(this.participants, 'reset add change', this.onParticipantsChanged);
      this.listenTo(this.participants, 'remove', this.onParticipantsRemove);

      // button bar, with the model to react on the changes
      this.buttonModel = new Backbone.Collection([{
        id: 'reset',
        label: lang.addParticipantsButtonClear,
        css: 'clear binf-pull-left',
        click: _.bind(this.onClickClear, this),
        disabled: true,
        close: false
      }, {
        id: 'submit',
        label: lang.addParticipantsButtonSave,
        css: 'save',
        click: _.bind(this.onClickSave, this),
        disabled: true,
        close: true
      }, {
        id: 'cancel',
        label: lang.addParticipantsButtonCancel,
        css: 'cancel',
        disabled: false,
        close: true
      }]);
      this.buttonsRegion.show(new ButtonBar({
        collection: this.buttonModel
      }));
    },

    onUserItemChanged: function (e) {
      // if member is disabled prevent from being added
      if (e.item.get('disabled')) {
        return;
      }
      // otherwise create participant and ...
      var attributes = _.extend(e.item.attributes, {
        display_name: e.item.get('name_formatted')
      });
      var participant = new Participant(attributes, {
        connector: this.connector,
        collection: this.participants
      });
      participant.roles = new Backbone.Collection(undefined, {
        comparator: function (left, right) {
          return base.localeCompareString(left.get('name'), right.get('name'));
        }
      });
      // ... add to participants list
      this.participants.add(participant);
    },

    retrieveMembersCallback: function (args) {
      var self = this;

      // check team members and dialog members and if the
      // participant is found disable it in the results.
      args.collection.each(function (current) {
        var exists = false;
        if (self.teamParticipants.findWhere({id: current.get('id')})) {
          exists = true;
        } else {
          if (self.participants.findWhere({id: current.get('id')})) {
            exists = true;
          }
        }
        current.set('disabled', exists);
      });
    },

    onRoleItemChanged: function (e) {
      // add selected role to all participants
      this.participants.each(function (current) {
        current.roles.add(e.item);
      });
    },

    onClickSave: function () {
      var self = this;
      // save participants to the team
      var error = false;
      var count = this.participants.length;
      this.participants.each(function (current) {
        self.teamParticipants.addNewParticipant(current);
        current.save(
            {
              add: current.roles.models
            }, {
              success: function (response) {
                if ((--count) === 0) {
                  self.refreshAfterSave(error);
                }
              },
              error: function (response) {
                error = true;
                if ((--count) === 0) {
                  self.refreshAfterSave(error);
                }
              }
            });
      });
    },

    refreshAfterSave: function (error) {
      var self = this;
      // notify on error
      if (error === true) {
        ModalAlert.showError(lang.addParticipantsErrorMessageDefault);
      }
      function afterFetch() {
        // trigger save event to signal the save of the collection
        self.teamParticipants.trigger('saved', self.teamParticipants);
      }

      // refresh team participants
      self.teamParticipants.fetch({
        success: function () {
          self.teamParticipants.setNewParticipant();
        }
      }).then(afterFetch,afterFetch);
    },

    onClickClear: function () {
      // clear participants dialog
      this.participants.reset();
      // set focus to user picker
      this.userPickerRegion.currentView.currentlyFocusedElement().focus();
      // update scrollbars
      this.updateScrollbar();
    },

    onParticipantsRemove: function () {
      this.onParticipantsChanged();
      if (this.participants && this.participants.length>0) {
        //set focus on the previous item
        this.participantsRegion.currentView.trigger('moveTabIndex', this.participantsRegion.currentView);
      } else {
        // set focus to user picker
        this.userPickerRegion.currentView.currentlyFocusedElement().focus();
      }
    },

    onParticipantsChanged: function () {
      // disable clear - if no item is available
      var disableClear = (this.participants.length === 0);
      // disable save - if at least one items has no roles
      var disableSave = (this.participants.length === 0);
      this.participants.each(function (participant) {
        if ((participant.roles === undefined) || (participant.roles.length === 0)) {
          disableSave = true;
        }
      });
      // set button models
      this.buttonModel.get('reset').set('disabled', disableClear);
      this.buttonModel.get('submit').set('disabled', disableSave);
      // whenever the participants change, update the perfect scrollbar
      this.$el.find('.conws-addparticipants-members').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15
      });
    },

    // Update the scrollbars for the participant list, if the list has changed.
    updateScrollbar: function () {
      // scroll to top as the function is
      // called from within 'onShown'.
      var sc1 = this.$el.find('.conws-addparticipants-members');
      _.each(sc1, function (sc) {
        $(sc).perfectScrollbar('update');
      })
    }
  });

  // add mixin
  _.extend(AddParticipantsView.prototype, LayoutViewEventsPropagationMixin);

  // return view
  return AddParticipantsView;
})
;

csui.define('conws/utils/commands/addparticipant',[
  'csui/lib/underscore',
  'csui/models/command',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'conws/widgets/team/impl/dialogs/addparticipants/addparticipants.view',
  'i18n!conws/utils/commands/nls/commands.lang',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, CommandModel, ModalDialogView, AddParticipantsView, lang, teamlang) {

  var AddParticipantCommand = CommandModel.extend({

    defaults: {
      signature: 'AddParticipant',
      name: lang.CommandNameAddParticipant,
      scope: 'multiple'
    },

    constructor: function (options) {
      // initialize options
      options || (options = {});
      this.roles = options.roles;
      // apply arguments to parent
      CommandModel.prototype.constructor.apply(this, arguments);
    },

    enabled: function (status) {
      // initialize false
      var ret = false;
      // evaluate if at least one role has the edit permission
      if (this.roles) {
        var editable = this.roles.filter(function (role) {
          return (role.get('actions').actionEdit && _.isNull(role.get('inherited_from_id')));
        });
        ret = (editable.length !== 0)
      }
      // return
      return ret;
    },

    execute: function (status, options) {
      // show the add participants view in the modal dialog
      var dialog = new ModalDialogView({
        dialogTxtAria: teamlang.addParticipantsTitle,
        body: new AddParticipantsView({
          view: status.originatingView
        }),
        modalClassName: 'conws-addparticipants'
      });
      dialog.show();
    }
  });

  return AddParticipantCommand;
});




csui.define('conws/utils/commands/export',[
  'csui/lib/underscore',
  'csui/models/command',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (_, CommandModel, lang) {

  var ExportCommand = CommandModel.extend({

    defaults: {
      signature: 'Export',
      name: lang.CommandNameExport,
      scope: 'multiple'
    },

    constructor: function (options) {
      CommandModel.prototype.constructor.call(this, arguments);
    },

    enabled: function (status) {
      if (status && status.nodes && status.nodes.length > 0) {
        return true;
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      // invoke download
      var file = 'export.csv';
      var csv = this._export(status.nodes.models);
      this._download(csv, file);
    },

    _exportHeader: function () {
      var ret = '';
      return ret;
    },

    _exportModel: function () {
      var ret = '';
      return ret;
    },

    _export: function (models) {
      // prepare model export csv
      var self = this;
      var csv = this._exportHeader() + '\n';
      _.each(models, function (current) {
        csv += self._exportModel(current) + '\n';
      });
      return csv;
    },

    _download: function (text, file) {
      // create blob
      var blob = new Blob([text], {type: 'text/csv'});
      // try multiple options to invoke the csv download
      if (!!window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, file);
      } else {
        var link = document.createElement("a");
        link.download = file;
        link.innerHTML = "Download File";
        if ('webkitURL' in window) {
          // Chrome allows the link to be clicked without actually adding it to the DOM.
          link.href = window.webkitURL.createObjectURL(blob);
        } else {
          // Firefox requires the link to be added to the DOM before it can be clicked.
          link.href = window.URL.createObjectURL(blob);
          link.style.display = "none";
          link.onclick = function (event) {
            document.body.removeChild(event.target);
          };
          document.body.appendChild(link);
        }
        link.click();
      }
    }
  });

  return ExportCommand;
});




csui.define('conws/widgets/team/impl/commands/exportparticipants',[
  'csui/lib/underscore',
  'conws/utils/commands/export',
  'i18n!conws/utils/commands/nls/commands.lang',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, ExportCommandModel, commandsLang, teamLang) {

  var ExportParticipantsCommand = ExportCommandModel.extend({

    defaults: {
      signature: 'ExportParticipants',
      name: commandsLang.CommandNameExportParticipants,
      scope: 'multiple'
    },

    constructor: function () {
      ExportCommandModel.prototype.constructor.call(this, arguments);
    },

    _exportHeader: function () {
      var ret = '';
      ret += '"' + teamLang.participantNameColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantRolesColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantLoginColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantEmailColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantDepartmentColTitle.replace(/"/g, '""') + '";';
      return ret;
    },

    _exportModel: function (model) {
      var ret = '"';
      ret += model.get('display_name') ? model.get('display_name').replace(/"/g, '""') :
             model.get('name').replace(/"/g, '""');
      ret += '";"' + model.getLeadingRole().replace(/"/g, '""') + ' ' +
             model.getRolesIndicator().replace(/"/g, '""');
      ret += '";"';
      ret += model.get('name') ? model.get('name').replace(/"/g, '""') : '';
      ret += '";"';
      ret += model.get('business_email') ? model.get('business_email').replace(/"/g, '""') : '';
      ret += '";"';
      ret += model.get('group_name') ? model.get('group_name').replace(/"/g, '""') : '';
      ret += '";';
      return ret;
    }
  });

  return ExportParticipantsCommand;
});




csui.define('conws/utils/commands/showroles',[
    'csui/lib/underscore',
    'csui/models/command',
    'i18n!conws/utils/commands/nls/commands.lang'
], function (_, CommandModel, lang) {

    var ShowRolesCommand = CommandModel.extend({

        defaults:{
            signature: 'ShowRoles',
            name: lang.CommandNameShowRoles,
            scope: 'single'
        },

        enabled: function(status){
            if (status && status.nodes && status.nodes.length === 1){
                return true;
            } else{
                return false;
            }
        },

        execute: function (status, options) {
            throw new Error('The \'' + this.get('signature') + '\' action must be handled by the caller.');
        }
    });

    return ShowRolesCommand;
});



csui.define('conws/utils/commands/removeparticipant',[
  'csui/lib/underscore',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/models/command',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (_, ModalAlert, CommandModel, lang) {

  var RemoveParticipantCommand = CommandModel.extend({

    defaults: {
      signature: 'RemoveParticipant',
      name: lang.CommandNameRemoveParticipant,
      scope: 'multiple'
    },

    enabled: function (status) {
      if (status && status.nodes && status.nodes.length > 0) {
        var allowed = true;
        _.each(status.nodes.models, function (participant) {
          if (!participant.canRemove()) {
            allowed = false;
          }
        });
        return allowed;
      } else {
        return false;
      }
    },

    execute: function (status, options) {

      // format confirmation dialog title ...
      var title = (status.nodes.length === 1)
          ? lang.RemoveParticipantTitleSingle
          : lang.RemoveParticipantTitleMultiple;
      // ... and message
      var message = lang.RemoveParticipantMessage;

      // confirm and remove
      var self = this;
      ModalAlert.confirmQuestion(message, title)
          .always(function (answer) {
            if (answer) {
              var count = status.nodes.length;
              var error = false;
              _.each(status.nodes.models, function (participant) {
                participant.save({
                  add: [],
                  remove: participant.roles.models
                }, {
                  success: function (response) {
                    // update collections when all participants are removed
                    if ((--count) === 0) {
                      self._refresh(status, error);
                    }
                  },
                  error: function (response) {
                    // update collections when all participants are removed
                    error = true;
                    if ((--count) === 0) {
                      self._refresh(status, error);
                    }
                  }
                });
              });
            }
          });
    },

    _refresh: function (status, error) {
      // notify on error
      if (error === true) {
        ModalAlert.showError(lang.RemoveParticipantErrorMessageDefault);
      }
      // refresh both collections
      status.originatingView.roleCollection.fetch();
      status.originatingView.participantCollection.fetch({
        success: function () {
          status.originatingView.participantCollection.setNewParticipant();

          // trigger as custom event to signal the save of the collection
          status.originatingView.participantCollection.trigger('saved', status.originatingView.participantCollection);
        }
      });
    }
  });

  return RemoveParticipantCommand;
});




csui.define('conws/widgets/team/impl/commands/exportroles',[
  'csui/lib/underscore',
  'conws/utils/commands/export',
  'i18n!conws/utils/commands/nls/commands.lang',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, ExportCommandModel, commandsLang, teamLang) {

  var ExportRolesCommand = ExportCommandModel.extend({

    defaults: {
      signature: 'ExportRoles',
      name: commandsLang.CommandNameExportRoles,
      scope: 'multiple'
    },

    constructor: function () {
      ExportCommandModel.prototype.constructor.call(this, arguments);
    },

    _exportHeader: function () {
      var ret = '';
      ret += '"' + teamLang.rolesNameColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.rolesParticipantsColTitle.replace(/"/g, '""') + '";';
      return ret;
    },

    _exportModel: function (model) {
      var ret = '';
      ret += '"' + model.displayName().replace(/"/g, '""') + '";';
      ret += '"' + model.displayMembers().replace(/"/g, '""') + '";';
      return ret;
    }
  });

  return ExportRolesCommand;
});




csui.define('conws/utils/commands/showdetails',[
    'csui/lib/underscore',
    'csui/models/command',
    'i18n!conws/utils/commands/nls/commands.lang'
], function (_, CommandModel, lang) {

    var ShowDetailsCommand = CommandModel.extend({

        defaults:{
            signature: 'ShowDetails',
            name: lang.CommandNameShowDetails,
            scope: 'single'
        },

        enabled: function(status){
            if (status && status.nodes && status.nodes.length === 1){
                return true;
            } else{
                return false;
            }
        },

        execute: function (status, options) {
            throw new Error('The \'' + this.get('signature') + '\' action must be handled by the caller.');
        }
    });

    return ShowDetailsCommand;
});



csui.define('conws/utils/commands/deleterole',[
  'csui/lib/underscore',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/models/command',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (_, ModalAlert, CommandModel, lang) {

  var DeleteRoleCommand = CommandModel.extend({

    defaults: {
      signature: 'DeleteRoles',
      name: lang.CommandNameDeleteRole,
      scope: 'multiple'
    },

    enabled: function (status) {
      if (status && status.nodes && status.nodes.length > 0) {
        // if at least one role doesn't allow deletion, disable the action
        var allowed = true;
        _.each(status.nodes.models, function (role) {
          // is the user allowed to delete the role
          if (!role.canDelete()) {
            allowed = false;
          }
          // the leader role can only be deleted in case it is the one and only role
          if ((role.get('leader') === true) && (role.collection.length > 1)) {
            allowed = false;
          }
        });
        return allowed;
      } else {
        return false;
      }
    },

    execute: function (status, options) {

      // get the unique memberships that would be removed from the workspace
      // if the roles they are member of are deleted.
      var count = this._evaluateMembersRemoved(status).length;

      // format confirmation dialog title ...
      var title = (status.nodes.length === 1)
          ? lang.DeleteRoleTitleSingle
          : lang.DeleteRoleTitleMultiple;
      // ... and message
      var message = lang.DeleteRoleMessageNoParticipantsAffected;
      if (count === 1) {
        message = lang.DeleteRoleMessageParticipantsAffectedSingle;
      } else if (count > 1) {
        message = lang.DeleteRoleMessageParticipantsAffectedMultiple.replace('{0}', count);
      }

      // confirm and delete
      var self = this;
      ModalAlert.confirmQuestion(message, title)
          .always(function (answer) {
            if (answer) {
              _.each(_.clone(status.nodes.models), function (model) {
                model.destroy({
                  wait: true,
                  success: function () {
                    if (status.nodes.length === 0) {
                      self._refreshCollections(status);
                    }
                  }
                });
              });
            }
          });
    },

    _evaluateMembersRemoved: function (status) {
      // get the collections
      var participants = status.originatingView.participantCollection;
      var roles = status.originatingView.roleCollection;

      // get all participants from the roles to be deleted
      var affectedParticipants = [];
      _.each(status.nodes.models, function (role) {
        role.members.each(function (member) {
          affectedParticipants.push(member.get('id'));
        });
      });
      affectedParticipants = _.uniq(affectedParticipants);

      // get all participants from the roles not to be deleted
      var unaffectedParticipants = [];
      _.each(roles.models, function (role) {
        if (status.nodes.findWhere({id: role.get('id')}) === undefined) {
          // role isn't to be deleted, therefore get members
          role.members.each(function (member) {
            unaffectedParticipants.push(member.get('id'));
          });
        }
      });
      unaffectedParticipants = _.uniq(unaffectedParticipants);

      // get the difference. the participants that are left
      // over, are removed from the team.
      var difference = _.difference(affectedParticipants, unaffectedParticipants);
      return difference;
    },

    _refreshCollections: function (status) {
      // refresh both collections
      status.originatingView.roleCollection.fetch({
           success: function() {
             // trigger as custom event to signal the save of the collection
             status.originatingView.participantCollection.trigger('saved', status.originatingView.participantCollection);
           }
          });

    }
  });

  return DeleteRoleCommand;
});




csui.define('conws/widgets/team/impl/participants.toolbaritems',[
  'module',
  "csui/controls/toolbar/toolitem.model",
  'csui/controls/toolbar/toolitems.factory',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (module, ToolItemModel, ToolItemsFactory, lang) {

  var toolbarItems = {

    otherToolbar: new ToolItemsFactory({
          first: [
            {
              signature: "AddParticipant",
              name: lang.CommandNameAddParticipant,
              icon: "binf-glyphicon binf-glyphicon-plus"
            }
          ],
          second: [
            {
              signature: "PrintParticipants",
              name: lang.CommandNamePrintParticipants,
              icon: "binf-glyphicon binf-glyphicon-print"
            },
            {
              signature: "ExportParticipants",
              name: lang.CommandNameExportParticipants,
              icon: "binf-glyphicon binf-glyphicon-download"
            }
          ],
          third: [
            {
              signature: "ShowRoles",
              name: lang.CommandNameShowRoles
            },
            {
              signature: "RemoveParticipant",
              name: lang.CommandNameRemoveParticipant
            }
          ]
        },
        {
          maxItemsShown: 99,
          dropDownIcon: "icon icon-toolbar-more"
        })
  };

  return toolbarItems;

});

csui.define('conws/widgets/team/impl/roles.toolbaritems',[
  'module',
  "csui/controls/toolbar/toolitem.model",
  'csui/controls/toolbar/toolitems.factory',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (module, ToolItemModel, ToolItemsFactory, lang) {

  var toolbarItems = {

    otherToolbar: new ToolItemsFactory({
          first: [
            {
              signature: "AddRole",
              name: lang.CommandNameAddRole,
              icon: "binf-glyphicon binf-glyphicon-plus"
            }
          ],
          second: [
            {
              signature: "PrintRoles",
              name: lang.CommandNamePrintRoles,
              icon: "binf-glyphicon binf-glyphicon-print"
            },
            {
              signature: "ExportRoles",
              name: lang.CommandNameExportRoles,
              icon: "binf-glyphicon binf-glyphicon-download"
            }
          ],
          third: [
            {
              signature: "ShowDetails",
              name: lang.CommandNameShowDetails
            },
            {
              signature: "DeleteRoles",
              name: lang.CommandNameDeleteRole
            }
          ]
        },
        {
          maxItemsShown: 99,
          dropDownIcon: "icon icon-toolbar-more"
        })
  };

  return toolbarItems;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/filter/impl/filter',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "    <div class=\"filter-search\"></div>\r\n    <div class=\"filter-clear\"></div>\r\n    <div class=\"filter-icon\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"conws-filter-header\">\r\n  <h3 class=\"header-caption\">"
    + this.escapeExpression(((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"caption","hash":{}}) : helper)))
    + "</h3>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_filter_impl_filter', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/filter/impl/filter.search',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<input id=\"filtersearch\" class=\"search\" type=\"search\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"caption","hash":{}}) : helper)))
    + "\" style=\"display:none\"\r\n       value=\""
    + this.escapeExpression(((helper = (helper = helpers.filter || (depth0 != null ? depth0.filter : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"filter","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)))
    + "\">\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_filter_impl_filter.search', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/filter/impl/filter.clear',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"sbclearer formfield_clear\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)))
    + "\" style=\"display:none\"></span>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_filter_impl_filter.clear', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/filter/impl/filter.searchicon',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"icon icon-search\" style=\"display: inline-block\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)))
    + "\"></span>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_filter_impl_filter.searchicon', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/controls/filter/impl/filter',[],function(){});
csui.define('conws/widgets/team/impl/controls/filter/filter.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/widgets/team/impl/controls/filter/impl/filter.model',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/controls/filter/impl/filter',
  'hbs!conws/widgets/team/impl/controls/filter/impl/filter.search',
  'hbs!conws/widgets/team/impl/controls/filter/impl/filter.clear',
  'hbs!conws/widgets/team/impl/controls/filter/impl/filter.searchicon',
  'css!conws/widgets/team/impl/controls/filter/impl/filter'
], function (_, $, Marionette, TabableRegionBehavior, LayoutViewEventsPropagationMixin, FilterModel,
    lang, tplView, tplSearch, tplClear, tplIcon) {

  var FilterSearch = Marionette.ItemView.extend({

    template: tplSearch,

    templateHelpers: function () {
      return {
        caption: this.model.get('caption'),
        filter: this.model.get('filter'),
        tooltip: _.str.sformat(lang.searchPlaceholder, this.model.get('tooltip').toLowerCase())
      };
    },

    ui: {
      search: '.search'
    },

    events: {
      'keyup @ui.search': 'onSearchKeyUp'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function FilterSearch(options) {

      // initialize filter model
      if (!options.model) {
        options.model = new FilterModel();
      }

      // apply marionette item view
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      // listen to change of 'showSearch'
      this.listenTo(this.model, 'change:showSearch', this.toggleSearch);
      this.listenTo(this.model, 'change:filter', this.changeFilter);
    },

    onSearchKeyUp: function (e) {
      e.stopPropagation();
      if (e.keyCode === 27) {
        // close filter
        this.model.set('showSearch', !this.model.get('showSearch'));
        this.triggerMethod('close');
      } else {
        // update filter
        this.model.set('filter', this.ui.search.val());
      }
    },

    toggleSearch: function () {
      var self = this;

      var show = self.model.get('showSearch');
      if (show) {
        // open and focus searchbox
        self.ui.search.toggle('slide', {direction: 'right'}, 200, function () {
          self.ui.search.prop('tabindex','0');
          self.trigger('changed:focus', self);
          self.ui.search.trigger('focus');
        });
      } else {
        // clear filter and close searchbox
        self.model.set('filter', '');
        self.ui.search.prop('tabindex','-1');
        self.ui.search.toggle('slide', {direction: 'right'}, 200);
        this.triggerMethod('close');
      }
    },

    changeFilter: function () {
      // update the filter text
      this.ui.search.val(this.model.get('filter'));
    },

    isTabable: function () {
      return this.ui.search.is(':not(:disabled)') && this.ui.search.is(':not(:hidden)') &&
             this.ui.search.is(':visible');
    },

    currentlyFocusedElement: function () {
      return this.ui.search;
    }
  });

  var FilterClear = Marionette.ItemView.extend({

    template: tplClear,

    templateHelpers: function () {
      return {
        tooltip: lang.searchClearIconTooltip
      };
    },

    ui: {
      clear: '.sbclearer'
    },

    events: {
      'click @ui.clear': 'onClearClick',
      'keyup @ui.clear': 'onClearKeyUp'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function FilterClear(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      // listen to change of 'filter'
      this.listenTo(this.model, 'change:filter', this.toggleClear);
    },

    toggleClear: function () {
      var filter = this.model.get('filter');
      if (_.isString(filter) && filter.length !== 0) {
        // show the clear button
        this.ui.clear.prop('tabindex','0');
        this.ui.clear.show();

      } else {
        // hide the clear button
        this.ui.clear.prop('tabindex','-1');
        this.ui.clear.hide();
      }
    },

    onClearClick: function (e) {
      this.model.set('filter', '');
      this.triggerMethod('clear');
    },

    onClearKeyUp: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.model.set('filter', '');
        this.triggerMethod('clear');
      }
    },

    isTabable: function () {
      return this.ui.clear.is(':not(:disabled)') && this.ui.clear.is(':not(:hidden)') &&
             this.ui.clear.is(':visible');
    },

    currentlyFocusedElement: function () {
      return this.ui.clear;
    }
  });

  var FilterIcon = Marionette.ItemView.extend({

    template: tplIcon,

    templateHelpers: function () {
      return {
        tooltip: _.str.sformat(lang.searchIconTooltip, this.model.get('tooltip'))
      }
    },

    ui: {
      icon: '.icon-search'
    },

    events: {
      'click @ui.icon': 'onSearchIconClick',
      'keydown @ui.icon': 'onSearchIconKeyDown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function FilterIcon(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onSearchIconClick: function (e) {
      this.model.set('showSearch', !this.model.get('showSearch'));
    },

    onSearchIconKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.model.set('showSearch', !this.model.get('showSearch'));
      }
    },

    currentlyFocusedElement: function () {
      return this.ui.icon;
    }
  });

  var FilterView = Marionette.LayoutView.extend({

    template: tplView,

    templateHelpers: function () {
      return {
        caption: this.model.get('caption'),
        active: this.model.get('active')
      };
    },

    ui: {
      label: '.searchtext',
      search: '.filter-search',
      clear: '.filter-clear',
      icon: '.filter-icon'
    },

    regions: {
      searchRegion: '@ui.search',
      clearRegion: '@ui.clear',
      iconRegion: '@ui.icon'
    },

    constructor: function FilterView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      // propagate events to regions
      this.propagateEventsToRegions();

      // listen to change of 'active' and 'showSearch'
      this.listenTo(this.model, 'change:active', this.render);
      this.listenTo(this.model, 'change:showSearch', this.toggleLabel);
      this.listenTo(this, 'updateFocus', this.updateFocus);
    },

    onRender: function () {
      // render the filter elements if active
      var active = this.model.get('active');
      if (active) {
        // search box
        this.searchView = new FilterSearch({model: this.model});
        this.searchRegion.show(this.searchView);
        this.listenTo(this.searchView, 'close', this.focusIcon);
        // clear button
        this.clearView = new FilterClear({model: this.model});
        this.clearRegion.show(this.clearView);
        this.listenTo(this.clearView, 'clear', this.focusSearch);
        // seach button
        this.iconView = new FilterIcon({
          model: this.model,
          initialActivationWeight: this.options.initialActivationWeight
        });
        this.iconRegion.show(this.iconView);
      }
    },

    toggleLabel: function () {
      var show = this.model.get('showSearch');
      if (show) {
        // hide the label
        this.ui.label.hide();
      } else {
        // show the label
        this.ui.label.show();
      }
    },

    updateFocus: function () {
      var show = this.model.get('showSearch');
      if (show) {
        this.searchView.trigger('changed:focus', this.searchView);
        this.focusSearch();
      } else {
        this.focusIcon();
      }
    },

    focusSearch: function () {
      // focus search
      this.searchView.currentlyFocusedElement().trigger('focus');
    },

    focusIcon: function(){
      // focus icon
      this.iconView.currentlyFocusedElement().trigger('focus');
    }
  });

  // add event propagation mixin
  _.extend(FilterView.prototype, LayoutViewEventsPropagationMixin);

  // return
  return FilterView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.remove',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "    <ul>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.setRoles : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop})) != null ? stack1 : "")
    + "    </ul>\r\n";
},"2":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "        <li class=\"conws-roles-remove-item\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.inherited_from_id : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.program(5, data, 0, blockParams, depths)})) != null ? stack1 : "")
    + "        </li>\r\n";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper;

  return "            <div class=\"conws-roles-edit-canedit-setitem-inherit\">\r\n              <div class=\"conws-roles-edit-canedit-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</div>\r\n              <div class=\"conws-roles-edit-canedit-inherit\">"
    + this.escapeExpression(this.lambda(((stack1 = (depths[2] != null ? depths[2].captions : depths[2])) != null ? stack1.RoleInherited : stack1), depth0))
    + "</div>\r\n            </div>\r\n";
},"5":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper;

  return "            <div class=\"conws-roles-edit-canedit-setitem conws-roles-edit-itemaction-remove\">\r\n              <div class=\"conws-roles-edit-canedit-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</div>\r\n              <a href=\"#\" class=\"csui-icon inline-edit-icon binf-close\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"\r\n                 title=\""
    + this.escapeExpression(this.lambda((depths[2] != null ? depths[2].removeRole : depths[2]), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda((depths[2] != null ? depths[2].removeRole : depths[2]), depth0))
    + "\"></a>\r\n            </div>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.removeParticipant : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <div class=\"conws-roles-edit-canedit-empty\">\r\n        <span class=\"csui-icon csui-icon-notification-warning\"\r\n              title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.RemoveParticipantWarning : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.RemoveParticipantWarning : stack1), depth0))
    + "\">\r\n        </span>\r\n        <div class=\"conws-roles-edit-canedit-empty-text\">\r\n          <h2>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.RemoveParticipant1 : stack1), depth0))
    + "</h2>\r\n          <h4>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.RemoveParticipant2 : stack1), depth0))
    + "</h4>\r\n        </div>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.setRoles : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.program(7, data, 0, blockParams, depths)})) != null ? stack1 : "")
    + "</div>\r\n";
},"useDepths":true});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_participants_impl_roles.edit.list.remove', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.remove.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/controls/globalmessage/globalmessage' /* needed for style csui-icon-notification-warning */,
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.remove',
], function (_, $, Marionette, Handlebars, GlobalMessage, TabableRegionBehavior, ListKeyboardBehavior,
    lang, template) {

  var RolesEditRemoveList = Marionette.LayoutView.extend({

    // CSS class names
    className: 'conws-roles-edit-remove-list',

    template: template,

    // filter model
    filterModel: {},

    // constructor for the Roles remove list
    constructor: function RolesEditRemoveList(options) {
      options || (options = {});

      // the model has to be a RolesCollection with the filterList method
      this.model = options.model;
      // filterModel is the FilterModel with the filter criteria
      this.filterModel = options.filterModel;
      //used for accessibility
      this.selectedIndex = 0;
      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      item: '.conws-roles-edit-itemaction-remove a',
      focusedItem: 'li'
    },

    events: {
      'click @ui.item': 'itemRemove',
      'click @ui.focusedItem': 'itemRemove',
      'keydown': 'onKeyDownExt'
    },

    // localized captions
    captions: {
      RemoveParticipant1: lang.rolesDialogRemoveParticipant1,
      RemoveParticipant2: lang.rolesDialogRemoveParticipant2,
      RemoveParticipantWarning: lang.rolesDialogRemoveParticipantWarning,
      RoleInherited: lang.rolesNameColInherited
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior
      }
    },

    // support up/down navigation
    onKeyDownExt: function (e) {
      var $preElem = this.currentlyFocusedElement();

      switch (e.keyCode) {
      case 38: // up
        this.calculateSelectedIndex();
        this._moveTo(e, this._selectPrevious(), $preElem);
        break;
      case 40: // down
        this.calculateSelectedIndex();
        this._moveTo(e, this._selectNext(), $preElem);
        break;
      case 13:
      case 32:
      case 46:
        this.currentlyFocusedElement().trigger('click', e);
        break;
      }
    },

    initialize: function () {
      // listen on the change of the filter
      this.listenTo(this.filterModel, 'change', this.render);
      this.listenTo(this.filterModel, 'change:filter', function () {
        // when search filter changes, reset the focus element to the first item
        this.selectedIndex = 0;
      });
      // listen on the change of the focus
      this.listenTo(this, 'updateFocus', this.updateFocus);
      // listen on the model changes
      this.listenTo(this.model, 'add change reset remove', this.render);
    },

    // template helper to prepare the model for the view
    templateHelpers: function () {
      return {
        removeRole: lang.rolesDialogRemoveRole,
        setRoles: this.model.filterList(this.filterModel.get('filter')).toJSON(),
        removeParticipant: this.model.length === 0,
        captions: this.captions
      }
    },

    calculateSelectedIndex: function () {
      var keywords = this.filterModel.get('filter');
      if (keywords.length) {
        this.totalCount = this.model.filterList(keywords).models.length;
        if (this.selectedIndex !== 0 && this.selectedIndex === this.totalCount - 1) {
          this.selectedIndex = this.selectedIndex - 1;
        }
      } else {
        this.totalCount = this.model.length;
      }
    },

    updateFocus:function(){
      this.trigger('changed:focus', this);
      this.currentlyFocusedElement().trigger('focus');
    },

    // Click on the remove button
    // remove the selected item from the collection
    itemRemove: function (event) {
      var target = $(event.currentTarget);
      var id = target.data("id");

      // if the remove action is called from keyboard the current element is <div> and not <a>
      if( _.isUndefined(id) && target.find(this.ui.item)){
        id = $(event.currentTarget).find(this.ui.item).data('id')
      }

      //calculate new selected index
      this.calculateSelectedIndex();
      // remove model
      this.model.remove(id);

      // don't propagate click event into name cell, because it would cause selecting the row
      event.preventDefault();
      event.stopPropagation();
    }
  })

  return RolesEditRemoveList;
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "            <li class=\"conws-roles-edit-item\">\r\n              <div>\r\n                <a href=\"#\" class=\"conws-roles-edit-itemaction-select conws-roles-edit-canedit-selectitem\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"><span title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span></a>\r\n              </div>\r\n            </li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div>\r\n    <ul>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.allRoles : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </ul>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_participants_impl_roles.edit.list', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, ListKeyboardBehavior,
    lang, template) {

  var RolesEditList = Marionette.LayoutView.extend({

    // CSS class names
    className: 'conws-roles-edit-list',

    template: template,

    // filter model
    filterModel: {},

    // constructor for the Roles list
    constructor: function RolesEditList(options) {
      options || (options = {});

      // the model has to be a RolesCollection with the filterList method
      this.model = options.model;
      // filterModel is the FilterModel with the filter criteria
      this.filterModel = options.filterModel;
      //used for accessibility
      this.selectedIndex = 0;
      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      select: 'a.conws-roles-edit-itemaction-select'
    },

    events: {
      'click @ui.select': 'itemSelect',
      'click li': 'itemSelect',
      'dragstart @ui.select': 'itemDrag',
      'keydown': 'onKeyDownExt'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior
      }
    },

    // support up/down navigation
    onKeyDownExt: function (e) {
      var $preElem = this.currentlyFocusedElement();

      switch (e.keyCode) {
      case 38: // up
        this.calculateSelectedIndex();
        this._moveTo(e, this._selectPrevious(), $preElem);
        break;
      case 40: // down
        this.calculateSelectedIndex();
        this._moveTo(e, this._selectNext(), $preElem);
        break;
      case 13:
      case 32:
        this.currentlyFocusedElement().trigger('click', e);
        break;
      }
    },

    initialize: function () {
      // listen on the change of the filter
      this.listenTo(this.filterModel, 'change', this.render);
      this.listenTo(this.filterModel, 'change:filter', function () {
        // when search filter changes, reset the focus element to the first item
        this.selectedIndex = 0;
      });
      // listen on the model changes
      this.listenTo(this.model, 'add change reset remove', this.render);
      this.listenTo(this, 'updateFocus', this.updateFocus);
    },

    // template helper to prepare the model for the view
    templateHelpers: function () {
      return {
        allRoles: this.model.filterList(this.filterModel.get('filter')).toJSON()
      }
    },

    calculateSelectedIndex: function () {
      var keywords = this.filterModel.get('filter');
      if (keywords.length) {
        this.totalCount = this.model.filterList(keywords).models.length;
        if (this.selectedIndex !== 0 && this.selectedIndex === this.totalCount - 1) {
          this.selectedIndex = this.selectedIndex - 1;
        }
      } else {
        this.totalCount = this.model.length;
      }
    },

    updateFocus:function(){
      this.trigger('changed:focus', this);
      this.currentlyFocusedElement().trigger('focus');
    },

    // Click on an item in the available list
    // mark the item as selected and add it to the selected items list
    itemSelect: function (event) {
      var target = $(event.currentTarget);
      var id = target.data("id");

      // if the remove action is called from keyboard the current element is <div> and not <a>
      if( _.isUndefined(id) && target.find(this.ui.select).length > 0){
        id = $(event.currentTarget).find(this.ui.select).data('id')
      }

      //calculate new selected index
      this.calculateSelectedIndex();
      //remove model
      this.model.remove(id);

      // don't propagate click event into name cell, because it would cause selecting the row
      event.preventDefault();
      event.stopPropagation();

    },

    // Prevent the drag function for the link element
    itemDrag: function (event) {
      return false;
    }
  });

  return RolesEditList;
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.readonly.list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "      <li class=\"conws-roles-readonly-item\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"><span>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span></li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<div>\r\n  <ul>\r\n";
  stack1 = ((helper = (helper = helpers.roles || (depth0 != null ? depth0.roles : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"roles","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop}),(typeof helper === "function" ? helper.call(depth0,options) : helper));
  if (!helpers.roles) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </ul>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_participants_impl_roles.readonly.list', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/cells/roles/impl/roles',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/participants/impl/roles.readonly.list.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.readonly.list',
  'css!conws/widgets/team/impl/cells/roles/impl/roles'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, ListKeyboardBehavior,
    lang, template) {

  var RolesReadOnlyList = Marionette.LayoutView.extend({

    template: template,

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior
      }
    },

    // constructor for the readonly roles list
    constructor: function RolesReadOnlyList(options) {

      //used for accessibility
      this.selectedIndex = 0;

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    // template helper to prepare the model for the view
    templateHelpers: function () {
      return {
        roles: this.model.toJSON()
      }
    }
  });

  return RolesReadOnlyList;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "      <div class=\"conws-roles-edit-canedit\">\r\n        <div\r\n            class=\"conws-roles-edit-canedit-left conws-roles-edit-left conws-roles-edit-canedit-separator\">\r\n          <div class=\"conws-roles-edit-canedit-header\">\r\n            <div class=\"conws-roles-edit-canedit-setroles-region\"></div>\r\n          </div>\r\n          <div class=\"conws-roles-edit-canedit-content\">\r\n            <div class=\"conws-roles-edit-canedit-setroles-list-region\"></div>\r\n          </div>\r\n        </div>\r\n        <div class=\"conws-roles-edit-canedit-right conws-roles-edit-right\">\r\n          <div class=\"conws-roles-edit-canedit-header\">\r\n            <div class=\"conws-roles-edit-canedit-allroles-region\"></div>\r\n          </div>\r\n          <div class=\"conws-roles-edit-canedit-content\">\r\n            <div class=\"conws-roles-edit-canedit-allroles-list-region\"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "      <div class=\"conws-roles-edit-readonly\">\r\n        <div class=\"conws-roles-readonly-region\"></div>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"binf-modal-content\">\r\n  <div class=\"binf-modal-header\">\r\n    <h2 class=\"binf-modal-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n  <div class=\"binf-modal-body\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.canEdit : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "  </div>\r\n  <div class=\"conws-roles-edit-buttons-region\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_participants_impl_roles.edit', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/dialogs/participants/impl/roles.edit',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/participants/roles.edit.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/controls/filter/filter.view',
  'conws/widgets/team/impl/controls/filter/impl/filter.model',
  'conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.remove.view',
  'conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.view',
  'conws/widgets/team/impl/dialogs/participants/impl/roles.readonly.list.view',
  'conws/widgets/team/impl/controls/footer/footer.view',
  'conws/widgets/team/impl/roles.model.expanded',
  'conws/widgets/team/impl/participants.model',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit',
  'conws/widgets/team/impl/roles.model',
  'css!conws/widgets/team/impl/dialogs/participants/impl/roles.edit',
  'css!conws/widgets/team/impl/cells/roles/impl/roles'
], function (_, $, Backbone, Marionette, Handlebars, ModalAlert, LayoutViewEventsPropagationMixin,
    TabableRegionBehavior, Filter, FilterModel, RolesRemoveList, RolesEditList, RolesReadOnlyList,
    FooterView, RolesCollection, ParticipantsCollection, lang,
    template, RolesModelCollection) {

  var ButtonLabels = {
    Close: lang.rolesDialogButtonClose,
    Save: lang.rolesDialogButtonSave,
    Cancel: lang.rolesDialogButtonCancel,
    Reset: lang.rolesDialogButtonReset,
    Remove: lang.rolesDialogButtonRemove
  };

  var RolesEditView = Marionette.LayoutView.extend({

    // Roles count when filtering should be possible
    rolesCountForFilter: 15,

    // Modified flag to indicate changes
    modified: false,

    // temporary roles lists for the view
    availableRoles: new RolesModelCollection(),
    assignedRoles: new RolesModelCollection(),

    // filter models to handle the reset action
    filterModel1: undefined,
    filterModel2: undefined,

    // constructor for the RolesEdit dialog
    constructor: function RolesEditView(options) {
      options || (options = {});

      this.teamRoles = options.roleCollection;
      this.teamParticipants = options.participantCollection;

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    template: template,

    regions: {
      assignedRolesHeaderRegion: '.conws-roles-edit-canedit-setroles-region',
      assignedRolesListRegion: '.conws-roles-edit-canedit-setroles-list-region',
      availableRolesHeaderRegion: '.conws-roles-edit-canedit-allroles-region',
      availableRolesListRegion: '.conws-roles-edit-canedit-allroles-list-region',
      readonlyRolesListRegion: '.conws-roles-readonly-region',
      buttonsRegion: '.conws-roles-edit-buttons-region'
    },

    ui: {
      footer: '.conws-roles-edit-buttons-region'
    },

    // localized captions
    captions: {
      AssignedRoles: lang.rolesDialogAssignedRoles,
      TooltipAssignedRoles: lang.rolesDialogTooltipAssignedRoles,
      AvailableRoles: lang.rolesDialogAvailableRoles,
      TooltipAvailableRoles: lang.rolesDialogTooltipAvailableRoles
    },

    // initialize the view and prepare the model objects
    initialize: function () {

      if (_.isUndefined(this.model)) {
        return;
      }

      // create a new collection for the dialog
      this.assignedRoles.reset(this.model.roles.models);

      // create a new collection with all roles for the dialog
      var tmp = this.model.collection.availableRoles.clone();
      // reduce the all roles list to the not to this user assigned list
      tmp.remove(this.assignedRoles.models);

      // remove all inherited roles from the available list
      var notInheritedRoles = tmp.filter(function (m) {
        var id = m.get('inherited_from_id');
        return _.isUndefined(id) || _.isNull(id);
      });

      // reset the availableRoles list
      this.availableRoles.reset(notInheritedRoles);

      if (!_.isUndefined(this.filterModel1)) {
        this.filterModel1.set('resetFilter', true);
      }

      if (!_.isUndefined(this.filterModel2)) {
        this.filterModel2.set('resetFilter', true);
      }

      // no changes are made on the data
      this.modified = false;

      // prepare the states for the button bar
      this.setDialogState();

      // setup the listener for changing the lists
      this.listenTo(this.assignedRoles, 'remove', this.removeAssignedRole);
      this.listenTo(this.availableRoles, 'remove', this.addAvailableRole);
    },

    // remove an assigned role
    // the role is removed in the list view, now add it to the available list and update the dialog state
    removeAssignedRole: function (model) {
      var r = model;
      this.availableRoles.add(r);

      // changes are made on the data
      this.modified = true;

      this.setDialogState();

      // set automatically focus to next region
      if (this.assignedRoles.length === 0) {
        this.filterModel2.get('active') ?
        this.availableRolesHeaderRegion.currentView.trigger('updateFocus') :
        this.availableRolesListRegion.currentView.trigger('updateFocus');
      } else if (this.assignedRolesListRegion.currentView.totalCount - 1 === 0 &&
                 this.filterModel1.get('active')) {
        this.assignedRolesHeaderRegion.currentView.trigger('updateFocus');
      }
    },

    // add an available role
    // the role is removed in the list view, now add it to the assigned list and update the dialog state
    addAvailableRole: function (model) {
      var r = model;
      this.assignedRoles.add(r);

      // changes are made on the data
      this.modified = true;

      this.setDialogState();

      // set automatically focus to previous region
      if (this.availableRoles.length === 0) {
        this.filterModel1.get('active') ?
        this.assignedRolesHeaderRegion.currentView.trigger('updateFocus') :
        this.assignedRolesListRegion.currentView.trigger('updateFocus');
      } else if (this.availableRolesListRegion.currentView.totalCount - 1 === 0 &&
                 this.filterModel2.get('active')) {
        this.availableRolesHeaderRegion.currentView.trigger('updateFocus');
      }
    },

    // this method sets the state for the dialog
    setDialogState: function () {
      //enable or disable the filter if no selection functions depending on the list length
      if (!_.isUndefined(this.filterModel1) && _.isEmpty(this.filterModel1.get('filter'))) {
        this.filterModel1.set('active', this.assignedRoles.length >= this.rolesCountForFilter);
      }
      if (!_.isUndefined(this.filterModel2) && _.isEmpty(this.filterModel2.get('filter'))) {
        this.filterModel2.set('active', this.availableRoles.length >= this.rolesCountForFilter);
      }
      if (!_.isUndefined(this.editRolesButtons)) {
        this.editRolesButtons.collection.findWhere({id: 'submit'}).set({disabled: !this.modified});
        this.assignedRoles.length > 0 ?
        this.editRolesButtons.collection.findWhere({id: 'submit'}).set({label: ButtonLabels.Save}) :
        this.editRolesButtons.collection.findWhere({id: 'submit'}).set({label: ButtonLabels.Remove});
      }
    },

    // template helper to prepare the model for the view
    templateHelpers: function () {
      var self = this;
      // get roles and create a caption name out of it
      var titleTemplate = lang.userRolesDialogTitle;
      if (this.model.getMemberType() === 'group') {
        titleTemplate = lang.groupRolesDialogTitle;
      }
      var value = _.str.sformat(titleTemplate, this.model.get('display_name'));

      // return the prepared object with the necessary properties
      return {
        title: value,
        canEdit: this.model.canEdit()
      };
    },

    // Update the scrollbars for the roles list, if the list has changed.
    updateScrollbar: function () {
      // scroll to top as the function is
      // called from within 'onShown'.
      var sc1 = this.$el.find('.binf-modal-body .conws-roles-edit-readonly');
      _.each(sc1, function (sc) {
        $(sc).perfectScrollbar('update');
      })

      var sc2 = this.$el.find('.conws-roles-edit-canedit-content');
      _.each(sc2, function (sc) {
        $(sc).perfectScrollbar('update');
      })
    },

    // show the dialog
    // enable the scrollbars for the different lists, the scrollbars maintained here because of event issues with the regions
    onAfterShow: function () {
      // initialize scrollbar
      this.$el.find('.binf-modal-body .conws-roles-edit-readonly').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });
      // initialize scrollbar
      this.$el.find('.conws-roles-edit-canedit-content').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });
      // update scrollbars
      this.updateScrollbar();

    },

    // The view is rendered whenever the model changes.
    onRender: function () {
      // render widget if the dialog is opened in the edit mode
      if (this.model.canEdit()) {
        // list with all set roles
        this.filterModel1 = new FilterModel({
          caption: this.captions.AssignedRoles,
          tooltip: this.captions.TooltipAssignedRoles,
          active: (this.assignedRoles.length >= this.rolesCountForFilter)
        });
        this.assignedRolesHeaderRegion.show(new Filter({
          model: this.filterModel1,
          initialActivationWeight: this.assignedRoles.length >= this.rolesCountForFilter ? 100 : 0
        }));
        this.assignedRolesListRegion.show(new RolesRemoveList({
          model: this.assignedRoles,
          filterModel: this.filterModel1,
          initialActivationWeight: this.assignedRoles.length > 0 ? 100 : 0
        }));
        this.listenTo(this.assignedRolesListRegion.currentView, 'dom:refresh',
            this.updateScrollbar);

        // list with filter header and all available roles
        this.filterModel2 = new FilterModel({
          caption: this.captions.AvailableRoles,
          tooltip: this.captions.TooltipAvailableRoles,
          active: (this.availableRoles.length >= this.rolesCountForFilter)
        });
        this.availableRolesHeaderRegion.show(new Filter({model: this.filterModel2}));
        this.availableRolesListRegion.show(new RolesEditList({
          model: this.availableRoles,
          filterModel: this.filterModel2
        }));
        this.listenTo(this.availableRolesListRegion.currentView, 'dom:refresh',
            this.updateScrollbar);
      } else {
        this.readonlyRolesListRegion.show(new RolesReadOnlyList({
          model: this.model.roles,
          initialActivationWeight: this.model.roles.length > 0 ? 100 : 0
        }));
      }

      //render footer
      this._renderFooter();

    },

    // Click on the save button
    saveClicked: function () {
      var self = this;
      //Get the actual Participantslist of Server - then verify if the roles of this
      // User are still the same as before, only when they are the same - save will be done
      var actServerParticipants = new ParticipantsCollection(undefined, {
        connector: self.model.collection.connector,
        node: self.model.collection.node,
        context: self.model.collection.workspaceContext,
        autoreset: true
      });
      actServerParticipants.fetch({
        success: function (ParticpantsCol) {
          var actParticipant = ParticpantsCol.find(function (participantfind) {
            return (participantfind.get('id') === self.model.get('id'));
          });
          var dataChanged;
          //the participant might not be in the collection anymore at all and
          //check wether the user has still the same number of roles as before
          if ((actParticipant) && (actParticipant.roles.length === self.model.roles.length)) {
            dataChanged = false;
            actParticipant.roles.each(function (role) {
              var id = role.id;
              //every role from the server is checked against the server roles from before
              var found = self.model.roles.find(function (role2) {
                return (role2.id === id);
              });
              if (!found) {
                dataChanged = true;
              }
            })
          }
          if (dataChanged === false) {
            //save data from the dialog
            self.saveRolesForUser();
          }
          else {
            //show an alert with the message that the data was changed
            var message = lang.rolesEditDialogDataNotUptoDateUser;
            if (self.model.getMemberType() === 'group') {
              message = lang.rolesEditDialogDataNotUptoDateGroup;
            }
            ModalAlert.showError(message, self.getErrorMessageTitle()).always(
                function (result) {
                  self.refreshAfterSave();
                });
          }
        }
      });

    },

    // Collect the changes and send them to the model
    saveRolesForUser: function () {
      var self = this;
      var removed = [];
      this.model.roles.each(function (role) {
        var id = role.id;
        //the assignedRoles list is the one on the dialog and the this.model.roles is the original assigned roles
        //the original assigned roles are checked against the actual list and whatever isn't
        // found anymore will be deleted
        var found = self.assignedRoles.find(function (role2) {
          return (role2.id === id);
        });

        if (!found) {
          removed.push(role);
        }
      });

      var added = [];
      // for every item role on the dialog is now checked if they are in the original list
      // if not it will be added
      this.assignedRoles.each(function (role) {
        var id = role.id;

        var found = self.model.roles.find(function (role2) {
          return (role2.id === id);
        });

        if (!found) {
          added.push(role);
        }
      });

      this.model.save({add: added, remove: removed}, {
        success: function (response) {
          self.refreshAfterSave();
        },
        error: function (response) {

          // show an alert with the error messages
          // prepare the message
          var message = '';
          if (response.successAdd.length > 0) {
            var rolesAdded = lang.rolesEditDialogSuccessfulAdded;
            _.each(response.successAdd, function (role) {
              rolesAdded = rolesAdded + '\n' + role.role.get('name');
            });

            message = rolesAdded;
          }

          if (response.errorAdd.length > 0) {
            var rolesNotAdded = lang.rolesEditDialogNotAdded;
            _.each(response.errorAdd, function (role) {
              rolesNotAdded = rolesNotAdded + '\n' + role.role.get('name');
            });

            if (message.length > 0) {
              message += '\n';
            }

            message = message + rolesNotAdded;
          }

          if (response.successRemove.length > 0) {
            var rolesRemoved = lang.rolesEditDialogSuccessfulRemoved;
            _.each(response.successRemove, function (role) {
              rolesRemoved = rolesRemoved + '\n' + role.role.get('name');
            });

            if (message.length > 0) {
              message += '\n';
            }

            message = message + rolesRemoved;
          }

          if (response.errorRemove.length > 0) {
            var rolesNotRemoved = lang.rolesEditDialogNotRemoved;
            _.each(response.errorRemove, function (role) {
              rolesNotRemoved = rolesNotRemoved + '\n' + role.role.get('name');
            });

            if (message.length > 0) {
              message += '\n';
            }

            message = message + rolesNotRemoved;
          }

          ModalAlert.showError(message, self.getErrorMessageTitle()).always(function (result) {
            self.refreshAfterSave();
          });
        }
      });
    },

    //prepare header for message
    getErrorMessageTitle: function () {
      var titleTemplate = lang.rolesEditDialogErrorTitleUser;
      if (this.model.getMemberType() === 'group') {
        titleTemplate = lang.rolesEditDialogErrorTitleGroup;
      }
      var title = _.str.sformat(titleTemplate,
          this.model.get('display_name') ? this.model.get('display_name') :
          this.model.get('name'));
      return title;
    },

    refreshAfterSave: function () {
      var self = this;

      function afterRolesFetch() {
        // send event as late as possible, so caller can do something after dialog has been closed
        // see roles.view cell for a usage.
        self.trigger('refetched');
      }

      function afterFetch() {
        // trigger save event to signal the save of the collection
        self.teamParticipants.trigger('saved', self.teamParticipants);
        // refresh the roles collection
        self.teamRoles.fetch().then(afterRolesFetch,afterRolesFetch);
      }

      // refresh the participant collection
      this.teamParticipants.fetch({
        success: function () {
          self.teamParticipants.setNewParticipant();
        }
      }).then(afterFetch,afterFetch);
    },

    // Click on the reset button
    // Re-render the view parts via the change of the models
    resetClicked: function () {

      // reset the current changes
      this.initialize();

    },

    _renderFooter: function(){
      var editRolesButtons = this.editRolesButtons;
      //add buttons
      if (editRolesButtons) {
        this.ui.footer.removeClass('binf-hidden');
        this.buttonsRegion.show(editRolesButtons);
      } else {
        var buttons = [];
        if (this.model.canEdit()) {
          buttons = [{
            id: 'reset',
            label: ButtonLabels.Reset,
            css: 'conws-roles-edit-button binf-pull-left conws-roles-edit-button-reset',
            click: _.bind(this.resetClicked, this)
          }, {
            id: 'submit',
            label: ButtonLabels.Save,
            css:'conws-roles-edit-button conws-roles-edit-button-save',
            click: _.bind(this.saveClicked, this),
            disabled: true,
            close: true
          }, {
            id: 'cancel',
            label: ButtonLabels.Cancel,
            css:'conws-roles-edit-button conws-roles-edit-button-cancel',
            close: true
          }
          ];
        } else {
          buttons = [{
            id: 'cancel',
            label: ButtonLabels.Close,
            css:'conws-roles-edit-button binf-pull-right',
            close: true,
            initialActivationWeight: 100
          }];
        }

       editRolesButtons = this.editRolesButtons = new FooterView({
          collection: new Backbone.Collection(buttons)
        });
       this.buttonsRegion.show(editRolesButtons);
      }
    }
  });

  _.extend(RolesEditView.prototype, LayoutViewEventsPropagationMixin);

  return RolesEditView;
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/role/impl/role.details.member',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "      <span class=\"member-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"displayName","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "      <span class=\"member-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"displayName","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"displayName","hash":{}}) : helper)))
    + "</span>\r\n      <a class=\"member-email\" href=\"mailto:"
    + this.escapeExpression(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"email","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"email","hash":{}}) : helper)))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div>\r\n  <div class=\"conws-role-details-avatar\"></div>\r\n  <div class=\"member-details\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isUser : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "  </div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_role_impl_role.details.member', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/dialogs/role/impl/role.details.member',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/role/impl/role.details.member.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/utils/url',
  'csui/utils/base',
  'csui/utils/contexts/factories/user',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'esoc/widgets/userwidget/userwidget',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/role/impl/role.details.member',
  'css!conws/widgets/team/impl/dialogs/role/impl/role.details.member'
], function (_, $, Marionette, Handlebars, Url, Base, UserModelFactory, Avatar, UserWidget, lang,
    template) {

  var RoleDetailsMember = Marionette.ItemView.extend({

    template: template,

    tagName: 'li',

    className: 'conws-role-details-member',

    region: {
      avatar: '.conws-role-details-avatar'
    },

    ui: {
      userProfileName: '.member-name',
      userProfileImg: '.conws-role-details-avatar'
    },

    events: {
      'keydown': 'onKeyDown',
      'touchstart @ui.userProfileName': 'onTouchProfileName'
    },

    onKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        e.stopPropagation();
        this.$('.esoc-user-profile-link').click();
      }
    },

    onTouchProfileName: function (e) {
      this.$('.esoc-user-profile-link').click();
    },

    // constructor for the Roles list
    constructor: function RoleDetailsMember(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    initialize: function () {
      this.avatar = new Avatar({model: this.model});
    },

    onRender: function () {
      if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
        var loggedUser            = this.model.collection.context.getModel(UserModelFactory),
            defaultOptions        = {
              connector: this.model.connector,
              model: this.model,
              userid: this.model.get('id'),
              context: this.model.collection.context,
              showUserProfileLink: true,
              showMiniProfile: Base.isTouchBrowser() ? false : true,
              loggedUserId: loggedUser.get('id')
            },
            userProfilePicOptions = $.extend({
              placeholder: this.$el.find(this.ui.userProfileImg),
              showUserWidgetFor: 'profilepic'
            }, defaultOptions);
        UserWidget.getUser(userProfilePicOptions);

        var userWidgetOptions = $.extend({
          placeholder: this.$el.find(this.ui.userProfileName)
        }, defaultOptions);
        UserWidget.getUser(userWidgetOptions);
      }
      else {
        this.$('.conws-role-details-avatar').append(this.avatar.render().$el);
      }
    },

    // template helper to prepare the model for the view
    templateHelpers: function () {
      var self = this;

      // return the prepared object with the necessary properties
      return {
        displayName: this.model.displayName(),
        email: this.model.displayEmail(),
        isUser: this.model.get('type') === 0
      };
    }
  });

  return RoleDetailsMember;
});

csui.define('conws/widgets/team/impl/dialogs/role/impl/role.details.members.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'conws/widgets/team/impl/dialogs/role/impl/role.details.member.view',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, ListKeyboardBehavior, MemberView,
    lang) {

  var RoleDetailsMembersList = Marionette.CollectionView.extend({

    // CSS class names
    className: 'conws-role-details-members-list',

    // child views for the list
    childView: MemberView,

    // view tag
    tagName: 'ul',

    events: {
      'keydown': 'onKeyDown'
    },

    // view behaviors
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior
      }
    },

    // filter model
    filterModel: {},

    // constructor for the Roles list
    constructor: function RoleDetailsMembersList(options) {
      options || (options = {});

      // the model has to be a RolesCollection with the filterList method
      this.collection = options.model;
      // filterModel is the FilterModel with the filter criteria
      this.filterModel = options.filterModel;

      // apply properties to parent
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    initialize: function () {
      // listen on the change of the filter
      this.listenTo(this.filterModel, 'change', this.render);
      this.listenTo(this.filterModel, 'change:filter', function () {
        // when search filter changes, reset the focus element to the first item
        this.selectedIndex = 0;
      });
    },

    addChild: function (child, ChildView, index) {
      if (!_.isUndefined(this.filterModel)) {
        var filter = this.filterModel.get('filter');
        if (!_.isUndefined(filter) && filter.length > 0) {
          var name = child.displayName().toLowerCase();
          if (name.indexOf(filter.toLowerCase()) < 0) {
            return; // do not render this item
          }
        }
      }
      // no filter or filter does match render the item
      Marionette.CollectionView.prototype.addChild.apply(this, arguments);
    }
  });

  return RoleDetailsMembersList;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/dialogs/role/impl/role.details',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <div class=\"conws-role-details-rolename-text\">\r\n                            <div class=\"general-text\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.name : stack1), depth0))
    + "</div>\r\n                        </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <input type=\"text\" value=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" />\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <div class=\"conws-role-details-roledescription-text\">\r\n                            <div class=\"general-text\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.description : stack1), depth0))
    + "</div>\r\n                        </div>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <textarea rows=\"8\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.description : stack1), depth0))
    + "</textarea>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                    <div class=\"conws-role-details-rolepermissions\">\r\n                        <h3>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.Permissions : stack1), depth0))
    + "</h3>\r\n                        <div class=\"conws-role-details-permissions\">\r\n                            <div class=\"conws-role-details-teamlead-caption general-text\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.labelId || (depth0 != null ? depth0.labelId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"labelId","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.TeamLead : stack1), depth0))
    + "</div>\r\n                            <div class=\"conws-role-details-teamlead-switch\"></div>\r\n                        </div>\r\n                    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"binf-modal-content\">\r\n    <div class=\"binf-modal-header\">\r\n        <h2 class=\"binf-modal-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.Title : stack1), depth0))
    + "</h2>\r\n    </div>\r\n    <div class=\"binf-modal-body\">\r\n        <div class=\"conws-role-details-canedit\">\r\n            <div class=\"conws-role-details-canedit-left conws-role-details-left conws-role-details-canedit-separator\">\r\n                <div class=\"conws-role-details-rolename\">\r\n                    <h3>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.RoleName : stack1), depth0))
    + "</h3>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.readonly : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "                </div>\r\n                <div class=\"conws-role-details-roledescription\">\r\n                    <h3>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.captions : depth0)) != null ? stack1.Description : stack1), depth0))
    + "</h3>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.readonly : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0)})) != null ? stack1 : "")
    + "                </div>\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hideTeamLead : depth0),{"name":"unless","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "            </div>\r\n            <div class=\"conws-role-details-canedit-right conws-role-details-right\">\r\n                <div class=\"conws-role-details-header\">\r\n                    <div class=\"conws-role-details-participants-region\"></div>\r\n                </div>\r\n                <div class=\"conws-role-details-canedit-content\">\r\n                    <div class=\"conws-role-details-participants-list-region\"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"conws-role-details-buttons-region\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_dialogs_role_impl_role.details', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/dialogs/role/impl/role.details',[],function(){});
csui.define('conws/widgets/team/impl/dialogs/role/role.details.view',[
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/controls/form/fields/booleanfield.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/widgets/team/impl/controls/filter/filter.view',
  'conws/widgets/team/impl/controls/filter/impl/filter.model',
  'conws/widgets/team/impl/controls/footer/footer.view',
  'conws/widgets/team/impl/dialogs/role/impl/role.details.members.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/role/impl/role.details',
  'css!conws/widgets/team/impl/dialogs/role/impl/role.details'
], function (module, _, $, Backbone, Marionette, Handlebars, Checkbox, LayoutViewEventsPropagationMixin,
             Filter, FilterModel, FooterView, RoleDetailsMembers, lang, template) {

  // CWS-3063: Get module config for hide team lead setting
  var config = module.config();

  var RoleDetailsView = Marionette.LayoutView.extend({

    // Roles count when filtering should be possible
    rolesCountForFilter: 15,

    // filter models to handle the reset action
    filterModel: undefined,

    // constructor for the RolesEdit dialog
    constructor: function RoleDetailsView(options) {
      options || (options = {});

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      // propagate events to regions
      this.propagateEventsToRegions();

      $(window).on('resize', _.bind(this.onWindowResize, this));
    },

    onWindowResize: function () {
      // update scrollbar
      this.updateScrollbar();
    },

    template: template,

    // localized captions
    captions: {
      Title: lang.roleDetailsTitle,
      RoleName: lang.roleDetailsName,
      Participants: lang.rolesParticipantsColTitle,
      RolesParticipantsColTooltip: lang.rolesParticipantsColTooltip,
      Description: lang.roleDetailsDescription,
      Permissions: lang.roleDetailsPermissions,
      TeamLead: lang.rolesNameColTeamLead,
      Read: lang.roleDetailsRead,
      Write: lang.roleDetailsWrite,
      Manage: lang.roleDetailsManage,
      Advanced: lang.roleDetailsAdvanced,
    },

    regions: {
      participantsHeaderRegion: '.conws-role-details-participants-region',
      participantsListRegion: '.conws-role-details-participants-list-region',
      teamLeadSwitch: '.conws-role-details-teamlead-switch',
      buttonsRegion: '.conws-role-details-buttons-region'
    },

    // template helper to prepare the model for the view
    templateHelpers: function () {
      var self = this;

      // return the prepared object with the necessary properties
      return {
        labelId: _.uniqueId("conws-teamlead-"),
        hideTeamLead: config.hideTeamLead,
        readonly: true,
        captions: this.captions,
        model: this.model.toJSON()
      };
    },

    // the modal dialog view triggers the 'after:show' event and therefore the views
    // event callback 'onAfterShow' is executed.
    onAfterShow: function () {
      this.$el.find('.conws-role-details-canedit-content').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });

      this.$el.find('.conws-role-details-canedit-left').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 5
      });

      this.$el.find('.conws-roles-edit-canedit-content').perfectScrollbar('update');

      this.$el.find('.conws-role-details-rolename-text').perfectScrollbar({
        scrollXMarginOffset: 15, // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });

      this.$el.find('.conws-role-details-rolename-text').scrollTop(0);
      this.$el.find('.conws-role-details-rolename-text').scrollLeft(0);
      this.$el.find('.conws-role-details-rolename-text').perfectScrollbar('update');

      this.$el.find('.conws-role-details-roledescription-text').perfectScrollbar({
        scrollXMarginOffset: 15, // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });
      this.$el.find('.conws-role-details-roledescription-text').scrollTop(0);
      this.$el.find('.conws-role-details-roledescription-text').scrollLeft(0);
      this.$el.find('.conws-role-details-roledescription-text').perfectScrollbar('update');
    },

    // The view is rendered whenever the model changes.
    onRender: function () {
      // list with filter header and all participants
      this.filterModel = new FilterModel({
        caption: this.captions.Participants,
        tooltip: this.captions.RolesParticipantsColTooltip,
        active: (this.model.members.length >= this.rolesCountForFilter)
      });
      this.participantsHeaderRegion.show(new Filter({
        model: this.filterModel,
        initialActivationWeight: this.model.members.length >= this.rolesCountForFilter ? 100 : 0
      }));

      // create the members list and listen to the 'dom:refresh' event to
      // update the scrollbars.
      this.participantsListRegion.show(new RoleDetailsMembers({
        model: this.model.members,
        filterModel: this.filterModel,
        initialActivationWeight: this.model.members.length > 0 ? 100 : 0
      }));
      this.listenTo(this.participantsListRegion.currentView, 'dom:refresh', this.updateScrollbar);

      // create the checkbox

      // CWS-3063: Use module config for hide team lead setting
      if (!config.hideTeamLead) {
        this.teamLeadSwitch.show(new Checkbox({
          model: new Backbone.Model({
            data: this.model.get('leader'),
            caption: this.captions.TeamLead
          }),
          labelId: this.$(".conws-role-details-teamlead-caption").attr("id"),
          mode: 'readonly'
        }));
      }

      // button bar, with the model to react on the changes
      this.buttonsRegion.show(new FooterView({
        collection: new Backbone.Collection([{
          id: 'cancel',
          label: lang.rolesDialogButtonClose,
          css: 'conws-roles-edit-button pull-right',
          close: true
        }])
      }));
    },

    // Update the scrollbars for the roles list, if the list has changed.
    updateScrollbar: function () {
      var sc1 = this.$el.find('.conws-role-details-canedit-content');
      _.each(sc1, function (sc) {
        $(sc).scrollTop(0);
        $(sc).perfectScrollbar('update');
      })

      var roleDetailsLeftPane = this.$el.find('.conws-role-details-canedit-left');
      if(roleDetailsLeftPane && roleDetailsLeftPane.length){
        roleDetailsLeftPane.scrollTop(0);
        roleDetailsLeftPane.perfectScrollbar('update');
      }
    }
  });

  // add mixin
  _.extend(RoleDetailsView.prototype, LayoutViewEventsPropagationMixin);

  // return dialog
  return RoleDetailsView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/team.tablinks',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.tabName || (depth0 != null ? depth0.tabName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tabName","hash":{}}) : helper)))
    + "\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_team.tablinks', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/team',[],function(){});
csui.define('conws/widgets/team/impl/team.tablinks.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/team.tablinks',
  'css!conws/widgets/team/impl/team'
], function (_, $, Marionette, TabableRegionBehavior, lang, template) {

  


  var TeamTabView = Marionette.LayoutView.extend({

    tagName:'a',

    attributes: {
      'role':'tab',
      'data-binf-toggle':'tab'
    },

    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 200
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },

    onKeyDown: function (e) {
      switch (e.keyCode) {
      case 13:
      case 32:
        $(e.target).trigger('click');
        break;
      }
    },

    templateHelpers: function () {
      return {
        tabName: this.data.attributes.aria === 'participants' ? lang.rolesParticipantsColTitle : lang.participantRolesColTitle
      };
    },

    initialize: function(){
      this.listenTo(this,'dom:refresh',this.updateAttributes);
    },

    updateAttributes: function(){
      this.$el.attr({'href': this.data.attributes.href, 'aria-controls': this.data.attributes['aria-controls']});
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function TeamTabView(options, attributes) {
      this.data = attributes;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    }
  });

  return TeamTabView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/teamtables',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"conws-teamtables\">\r\n    <div class=\"teamtables-tabs\">\r\n        <!-- Nav tabs -->\r\n        <ul class=\"binf-nav binf-nav-tabs binf-pull-right\" role=\"tablist\">\r\n          <li role=\"presentation\" id=\"tabParticipants\"></li>\r\n          <li role=\"presentation\" id=\"tabRoles\"></li>\r\n        </ul>\r\n    </div>\r\n    <!-- Tab panes -->\r\n    <div class=\"teamtables-content\">\r\n        <div class=\"binf-tab-content\">\r\n            <div role=\"tabpanel\" class=\"binf-tab-pane binf-fade binf-in binf-active\" id=\"participantstab\">\r\n                <div id=\"participantstoolbar\"></div>\r\n                <div id=\"participantsview\"></div>\r\n            </div>\r\n            <div role=\"tabpanel\" class=\"binf-tab-pane binf-fade\" id=\"rolestab\">\r\n                <div id=\"rolestoolbar\"></div>\r\n                <div id=\"rolesview\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_teamtables', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/cells/avatar/impl/avatar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "<span id=\"status-indicator-inherited\" class=\"status-indicator\"></span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isNew : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span id=\"status-indicator-new\" class=\"status-indicator\"\r\n          title=\""
    + this.escapeExpression(((helper = (helper = helpers.participantStatus || (depth0 != null ? depth0.participantStatus : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"participantStatus","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.participantStatus || (depth0 != null ? depth0.participantStatus : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"participantStatus","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.inherited : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "<div class=\"conws-avatar\"></div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_cells_avatar_impl_avatar', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/cells/avatar/impl/avatar',[],function(){});
csui.define('conws/widgets/team/impl/cells/avatar/avatar.view',[
  'csui/utils/url',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/contexts/factories/user',
  'esoc/widgets/userwidget/userwidget',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/roles.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/avatar/impl/avatar',
  'css!conws/widgets/team/impl/cells/avatar/impl/avatar'
], function (Url, TemplatedCellView, cellViewRegistry, UserModelFactory, UserWidget, Avatar, ParticipantsTableColumnCollection,
    RolesTableColumnCollection, lang, template) {

  var AvatarCellView = TemplatedCellView.extend({

        template: template,

        events: {
          'keydown': 'onKeyDown'
        },

        onKeyDown: function (e) {
          if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            this.$('.esoc-user-profile-link').click();
          }
        },

        constructor: function AvatarCellView() {
          TemplatedCellView.apply(this, arguments);

          // changes of the participant model are rendered immediately
          this.listenTo(this.model, 'change', this.render);
        },

        initialize: function () {
          this.avatar = new Avatar({model: this.model});
        },

        onRender: function () {
          if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
            var loggedUser            = this.model.collection.workspaceContext.getModel(UserModelFactory),
                userProfilePicOptions = {
                  connector: this.model.connector,
                  model: this.model,
                  userid: this.model.get('id'),
                  context: this.model.collection.workspaceContext,
                  showUserProfileLink: true,
                  showMiniProfile: true,
                  loggedUserId: loggedUser.get('id'),
                  placeholder: this.$el.find('.conws-avatar'),
                  showUserWidgetFor: 'profilepic'
                };
            UserWidget.getUser(userProfilePicOptions);
          }
          else {
            this.$('.conws-avatar').append(this.avatar.render().$el);
          }
        },

        getValueData: function () {
          // return
          return {
            participantStatus: lang.participantStateNew,
            type: this.model.getMemberType(),
            inherited: this.model.get('inherited_from_id') ? true : false,
            isNew: this.model.get('isNew') ? true : false
          };
        }

      },
      {
        hasFixedWidth: true,
        columnClassName: 'team-table-cell-avatar',
        noTitleInHeader: true
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.avatar,
      AvatarCellView);
  cellViewRegistry.registerByColumnKey(RolesTableColumnCollection.columnNames.avatar,
      AvatarCellView);

  return AvatarCellView;
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/cells/name/impl/name',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"csui-name participant-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"csui-name participant-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.formattedValue || (depth0 != null ? depth0.formattedValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"formattedValue","hash":{}}) : helper)))
    + "</span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isUser : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('conws_widgets_team_impl_cells_name_impl_name', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/cells/name/impl/name',[],function(){});
csui.define('conws/widgets/team/impl/cells/name/name.view',[
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/contexts/factories/user',
  'conws/widgets/team/impl/participants.columns',
  'esoc/widgets/userwidget/userwidget',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/name/impl/name',
  'css!conws/widgets/team/impl/cells/name/impl/name'
], function (TemplatedCellView, cellViewRegistry, UserModelFactory,
    ParticipantsTableColumnCollection, UserWidget, lang, template) {

  var NameCellView = TemplatedCellView.extend({

        className: 'csui-truncate',
        template: template,

        ui: {
          userProfileName: '.csui-name'
        },

        events: {
          'dragstart @ui.userProfileName': 'onDrag',
          'keydown': 'onKeyDown'
        },

        onKeyDown: function (e) {
          if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            this.$('.esoc-user-profile-link').click();
          }
        },

        onRender: function () {
          if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
            var loggedUser        = this.options.context.getModel(UserModelFactory),
                userWidgetOptions = {
                  connector: this.model.connector,
                  userid: this.model.get('id'),
                  model: this.model,
                  context: this.options.context,
                  placeholder: this.$el.find(this.ui.userProfileName),
                  showUserProfileLink: true,
                  showMiniProfile: true,
                  loggedUserId: loggedUser.get('id')
                };
            UserWidget.getUser(userWidgetOptions);
          }
        },

        onDrag: function (e) {
          return false;
        },

        getValueData: function () {
          // get member name
          var value = this.model.get('display_name');
          return {
            value: value,
            formattedValue: value,
            isUser: this.model.get('type') === 0
          };
        }
      }
  );
  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.name,
      NameCellView);

  return NameCellView;
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/cells/roles/impl/roles',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-roles-btn-div\">\r\n  <a class=\"conws-roles-btn\" href=\"#\">\r\n    <div class=\"conws-roles-text\">\r\n      <div class=\"conws-roles-truncatebox\">\r\n        <span title=\""
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "\" class=\"conws-roles-text-truncate\">"
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "</span>&nbsp;<span class=\"conws-roles-count\">"
    + this.escapeExpression(((helper = (helper = helpers.indicator || (depth0 != null ? depth0.indicator : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"indicator","hash":{}}) : helper)))
    + "</span>\r\n      </div>\r\n      <div class=\"role-name-icon-cell\">\r\n        <span class=\"csui-icon conws-icon-roles-edit\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.toolTip || (depth0 != null ? depth0.toolTip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toolTip","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.toolTip || (depth0 != null ? depth0.toolTip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toolTip","hash":{}}) : helper)))
    + "\"></span>\r\n      </div>\r\n    </div>\r\n  </a>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_cells_roles_impl_roles', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/team/impl/cells/roles/roles.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/dialogs/participants/roles.edit.view',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/participants.model.factory',
  'conws/widgets/team/impl/roles.model.factory',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/roles/impl/roles',
  'css!conws/widgets/team/impl/cells/roles/impl/roles'
], function (_, $, TemplatedCellView, cellViewRegistry, ModalDialogView,
    ParticipantsTableColumnCollection, EditView, WorkspaceContextFactory,
    ParticipantsCollectionFactory, RolesCollectionFactory, lang, template) {

  var RolesCellView = TemplatedCellView.extend({

        className: 'csui-truncate',
        template: template,

        ui: {
          roleEdit: 'a.conws-roles-btn'
        },

        events: {
          'click @ui.roleEdit': 'roleEditClicked',
          'dragstart @ui.roleEdit': 'roleEditDrag',
          'keydown': 'onKeyDown'
        },

        onKeyDown: function (e) {
          switch (e.keyCode) {
          case 13:
          case 32:
            $(e.target).find(this.ui.roleEdit).trigger('click');
            break;
          }
        },

        getValueData: function () {
          // get roles
          var value = this.model.getLeadingRole();
          var indicator = this.model.getRolesIndicator();
          // return
          return {
            value: value,
            indicator: indicator,
            cannotEdit: !this.model.canEdit(),
            toolTip: lang.participantRrolesColTooltip
          };
        },

        roleEditClicked: function (event) {
          // get workspace context
          if (!this.options.workspaceContext) {
            this.options.workspaceContext = this.options.context.getObject(WorkspaceContextFactory);
            this.options.workspaceContext.setWorkspaceSpecific(ParticipantsCollectionFactory);
            this.options.workspaceContext.setWorkspaceSpecific(RolesCollectionFactory);
          }
          // initialize the dialog for the participants roles
          this.editor = new ModalDialogView({
            body: new EditView({
              model: this.model,
              roleCollection: this.options.workspaceContext.getCollection(RolesCollectionFactory),
              participantCollection: this.options.workspaceContext.getCollection(
                  ParticipantsCollectionFactory)
            }),
            modalClassName: 'conws-roles-edit'
          });

          this.editor.show();

          var setFocus = _.bind(function(){
            // to set the focus we must use the click() event, as focus() alone does not work here. And as there is
            // no click handler on the element, which we want to focus on, we can do so without consequences so far.
            this.options.tableView.$el.find('[conws-participant-row-id="'+this.model.get("id")+'"] .conws-team-table-cell-roles').trigger('click');
          },this);

          // in any case, when the dialog is closed, we set the focus to the cell, as the dialog has been opened
          // using this cell (by enter/space or by mouse click), which means, that the focus should be in this cell.
          this.editor.once('destroy',function() {
            setFocus();
          });

          // as the focus is set to elsewhere by the tabables.behavior during the refresh, we have to set it again
          // to this cell after everything has been fetched. see also roles.edit.view where the event is triggered.
          this.editor.options.body.once('refetched',function() {
            setFocus();
          });

          // don't propagate click event into name cell, because it would cause selecting the row
          event.preventDefault();
          event.stopPropagation();
        },

        // prevent dragging of role editor cell
        roleEditDrag: function (event) {
          return false;
        },

        onDestroy: function () {
          if (this.editor) {
            this.editor = undefined;
          }
        }
      },
      {
        columnClassName: 'conws-team-table-cell-roles'
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.roles,
      RolesCellView);

  return RolesCellView;
});


csui.define('conws/widgets/team/impl/cells/login/login.view',[
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/participants.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (TemplatedCellView, cellViewRegistry, ParticipantsTableColumnCollection, lang) {

  var LoginCellView = TemplatedCellView.extend({

        className: 'csui-truncate',

        getValueData: function () {
          // get name in case of users
          var value = this.model.displayLogin();
          // return
          return {
            value: value,
            formattedValue: value
          };
        }
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.login, LoginCellView);

  return LoginCellView;
});


csui.define('conws/widgets/team/impl/cells/email/email.view',[
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/participants.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (TemplatedCellView, cellViewRegistry, ParticipantsTableColumnCollection, lang) {

  var EmailCellView = TemplatedCellView.extend({

        className: 'csui-truncate',

        getValueData: function () {
          // get member name
          var value = this.model.displayEmail();
          return {
            value: value,
            formattedValue: value
          };
        }
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.email, EmailCellView);

  return EmailCellView;
});



csui.define('conws/widgets/team/impl/cells/department/department.view',[
  'csui/utils/url',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/participants.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (Url, TemplatedCellView, cellViewRegistry, ParticipantsTableColumnCollection, lang, template) {

  var DepartmentCellView = TemplatedCellView.extend({

        className: 'csui-truncate',

        constructor: function AvatarCellView() {
          TemplatedCellView.apply(this, arguments);

          // changes of the participant model are rendered immediately
          this.listenTo(this.model, 'change', this.render);
        },

        getValueData: function () {
          // resolve the member department
          var value = this.model.displayDepartment();
          // return
          return {
            value: value,
            formattedValue: value
          };
        }
      },
      {
        columnClassName: 'team-table-cell-department'
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.department, DepartmentCellView);

  return DepartmentCellView;
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/cells/rolename/impl/rolename',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "        <span class=\"teamlead\">"
    + this.escapeExpression(((helper = (helper = helpers.leader || (depth0 != null ? depth0.leader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"leader","hash":{}}) : helper)))
    + "</span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "        <span class=\"inherited\">"
    + this.escapeExpression(((helper = (helper = helpers.inherited || (depth0 != null ? depth0.inherited : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"inherited","hash":{}}) : helper)))
    + "</span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"role-name-cell\">\r\n  <a href=\"#\">\r\n    <div class=\"role-name-box\">\r\n      <div class=\"role-name-name-cell\">\r\n      <span class=\"name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.formattedValue || (depth0 != null ? depth0.formattedValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"formattedValue","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.formattedValue || (depth0 != null ? depth0.formattedValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"formattedValue","hash":{}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.leader : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.inherited : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n      <div class=\"role-name-icon-cell\">\r\n        <span class=\"csui-icon conws-icon-roles-details\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.toolTip || (depth0 != null ? depth0.toolTip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toolTip","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.toolTip || (depth0 != null ? depth0.toolTip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toolTip","hash":{}}) : helper)))
    + "\"></span>\r\n      </div>\r\n    </div>\r\n  </a>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_cells_rolename_impl_rolename', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/cells/rolename/impl/rolename',[],function(){});
csui.define('conws/widgets/team/impl/cells/rolename/rolename.view',[
  'csui/lib/jquery',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/roles.columns',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'conws/widgets/team/impl/dialogs/role/role.details.view',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/participants.model.factory',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/rolename/impl/rolename',
  'css!conws/widgets/team/impl/cells/rolename/impl/rolename'
], function ($, TemplatedCellView, cellViewRegistry, RolesTableColumnCollection, ModalDialogView,
    RoleDetailsView, WorkspaceContextFactory, ParticipantsCollectionFactory, lang, template) {

  var RolesNameCellView = TemplatedCellView.extend({

        className: 'csui-truncate',
        template: template,

        ui: {
          roleDetails: 'a'
        },

        events: {
          'click @ui.roleDetails': 'roleDetailsClicked',
          'dragstart @ui.roleDetails': 'roleDetailsDrag',
          'keydown': 'onKeyDown'
        },

        onKeyDown: function (e) {
          switch (e.keyCode) {
          case 13:
          case 32:
            $(e.target).find(this.ui.roleDetails).trigger('click');
            break;
          }
        },

        getValueData: function () {
          // get name
          var value = this.model.displayName();
          // return
          return {
            toolTip: lang.rolesNameColTooltip,
            formattedValue: value,
            leader: this.model.get('leader') ? lang.rolesNameColTeamLead : '',
            inherited: this.model.get('inherited_from_id') ? lang.rolesNameColInherited : ''
          }
        },

        roleDetailsClicked: function (event) {

          // get workspace context
          if (!this.options.workspaceContext) {
            this.options.workspaceContext = this.options.context.getObject(WorkspaceContextFactory);
            this.options.workspaceContext.setWorkspaceSpecific(ParticipantsCollectionFactory);
          }

          // initialize the dialog for the role
          this.editor = new ModalDialogView({
            body: new RoleDetailsView({
              model: this.model,
              parentCollection: this.options.workspaceContext.getCollection(
                  ParticipantsCollectionFactory)
            }),
            modalClassName: 'conws-role-details'
          });
          this.editor.show();

          // don't propagate click event into name cell, because it would cause selecting the row
          event.preventDefault();
          event.stopPropagation();
        },

        roleDetailsDrag: function (event) {
          return false;
        },

        onDestroy: function () {
          if (this.editor) {
            this.editor = undefined;
          }
        }
      },
      {
        hasFixedWidth: false,
        columnClassName: 'team-table-cell-rolename'
      }
  );
  cellViewRegistry.registerByColumnKey(RolesTableColumnCollection.columnNames.name,
      RolesNameCellView);

  return RolesNameCellView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/cells/participants/impl/participants',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\""
    + this.escapeExpression(((helper = (helper = helpers.valueClass || (depth0 != null ? depth0.valueClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"valueClass","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.formattedValue || (depth0 != null ? depth0.formattedValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"formattedValue","hash":{}}) : helper)))
    + "</span>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_cells_participants_impl_participants', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/cells/participants/impl/participants',[],function(){});
csui.define('conws/widgets/team/impl/cells/participants/participants.view',[
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/roles.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/participants/impl/participants',
  'css!conws/widgets/team/impl/cells/participants/impl/participants'
], function (TemplatedCellView, cellViewRegistry, RolesTableColumnCollection, lang, template) {

  var ParticipantsCellView = TemplatedCellView.extend({

        className: 'csui-truncate',
        template: template,

        getValueData: function () {
          // get participants
          var valueClass = 'name';
          var value = this.model.displayMembers();
          if (!value) {
            value = lang.rolesParticipantsColNoParticipants;
            valueClass = 'name warning';
          }

          // return
          return {
            value: value,
            formattedValue: value,
            valueClass: valueClass
          };
        }
      },
      {
        hasFixedWidth: false,
        columnClassName: 'team-table-cell-participants'
      }
  );
  cellViewRegistry.registerByColumnKey(RolesTableColumnCollection.columnNames.members,
      ParticipantsCellView);

  return ParticipantsCellView;
});


csui.define('conws/widgets/team/impl/teamtables.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/utils/commands',
  'conws/utils/commands/addparticipant',
  'conws/widgets/team/impl/commands/exportparticipants',
  'conws/utils/commands/showroles',
  'conws/utils/commands/removeparticipant',
  'conws/widgets/team/impl/commands/exportroles',
  'conws/utils/commands/showdetails',
  'conws/utils/commands/deleterole',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/table/table.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/widgets/team/impl/participants.model.factory',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/participants.toolbaritems',
  'conws/widgets/team/impl/roles.model.factory',
  'conws/widgets/team/impl/roles.columns',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/roles.toolbaritems',
  'conws/widgets/team/impl/dialogs/participants/roles.edit.view',
  'conws/widgets/team/impl/dialogs/role/role.details.view',
  'conws/widgets/team/impl/team.tablinks.view',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/teamtables',
  'css!conws/widgets/team/impl/team',
  'conws/widgets/team/impl/cells/avatar/avatar.view',
  'conws/widgets/team/impl/cells/name/name.view',
  'conws/widgets/team/impl/cells/roles/roles.view',
  'conws/widgets/team/impl/cells/login/login.view',
  'conws/widgets/team/impl/cells/email/email.view',
  'conws/widgets/team/impl/cells/department/department.view',
  'conws/widgets/team/impl/cells/rolename/rolename.view',
  'conws/widgets/team/impl/cells/participants/participants.view'
], function ($, _, Marionette, ConnectorFactory, commands, AddParticipantCommand,
    ExportParticipantsCommand, ShowRolesCommand, RemoveParticipantCommand, ExportRolesCommand,
    ShowDetailsCommand, DeleteRoleCommand, ModalAlert, TableToolbarView, TableView,
    LayoutViewEventsPropagationMixin, ParticipantsCollectionFactory,
    ParticipantsTableColumnCollection, participantToolbarItems, RolesCollectionFactory,
    RolesTableColumnCollection, WorkspaceContextFactory, roleToolbarItems, ParticipantsView,
    RolesView, TeamTabView, ModalDialogView, lang, template) {

  var TeamTablesView = Marionette.LayoutView.extend({

    template: template,

    // flag indication if the data was changed
    dirty: false,

    events: {
      'shown.binf.tab .binf-nav-tabs a': 'onShownTab'
    },

    regions: {
      tabParticipantsRegion: '#tabParticipants',
      tabRolesRegion: '#tabRoles',
      participantsToolbarRegion: '#participantstoolbar',
      participantsRegion: '#participantsview',
      rolesToolbarRegion: '#rolestoolbar',
      rolesRegion: '#rolesview'
    },

    constructor: function TeamTablesView(options) {
      if (options === undefined || !options.context) {
        throw new Error('Context is missing in the constructor options');
      }
      this.context = options.context;

      if (!_.isUndefined(options.collapsedView)) {
        this.collapsedView = options.collapsedView;
      }

      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(ParticipantsCollectionFactory);
        options.workspaceContext.setWorkspaceSpecific(RolesCollectionFactory);
      }
      this.workspaceContext = options.workspaceContext;
      this.participantCollection = options.workspaceContext.getCollection(
          ParticipantsCollectionFactory);
      this.roleCollection = options.workspaceContext.getCollection(RolesCollectionFactory);
      //clear list of newParticipants for icon status
      this.participantCollection.newParticipants = [];
      _.each(this.participantCollection.where({isNew: true}), function (part) {
        part.unset('isNew')
      });


      // set filter from collapsed view to participants and roles collection
      // or clear filter from previous selection
      if (options.filterBy && options.filterBy.name.length > 0) {
        this.participantCollection.setFilter({conws_participantname: options.filterBy.name});
        this.roleCollection.setFilter({conws_rolename: options.filterBy.name});
      } else {
        this.participantCollection.filters =  {};
        this.participantCollection.orderBy =  ParticipantsTableColumnCollection.columnNames.name + ' asc';
        this.roleCollection.filters =  {};
        this.roleCollection.orderBy =  RolesTableColumnCollection.columnNames.name + ' asc';
      }

      //listen on custom events for the collections to get the saved indication
      this.listenTo(this.participantCollection, 'saved', this.onParticipantsChanged);
      this.listenTo(this.roleCollection, 'saved', this.onChanged);

      //the data was not changed
      this.dirty = false;

      options.data || (options.data = {});
      Marionette.LayoutView.prototype.constructor.call(this, arguments);

      // propagate layout events to regions
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var self = this;
      this.tabParticipantsRegion.show(new TeamTabView(_.defaults({
        initialActivationWeight: 202
      },this.options), {
        attributes: {aria: 'participants', 'aria-controls': 'participantstab', href: '#participantstab'}
      }));
      this.tabRolesRegion.show(new TeamTabView(_.defaults({
        initialActivationWeight: 201
      },this.options), {
        attributes: {aria: 'roles', 'aria-controls': 'rolestab', href: '#rolestab'}
      }));

      if (this.participantCollection.fetched) {
        this.participantCollection.fetch({reload: true});
      }
      if (this.roleCollection.fetched) {
        this.roleCollection.fetch({reload: true});
      }

      this.participantCollection.once('sync', function () {
        // simulate click on the tab after data is there so the add participants command is enabled. The click
        // triggers onShownTab for the case '#participantstab', which then calls renderParticipantsAfterFetch.
        // Needed to have the tabs in sync with displayed list (CWS-3565) AND avoiding side effect (CWS-4190),
        // that the AddParticipants action is not displayed sometimes, which occurs, if expand button is clicked
        // very fast after initial display.
        self.tabParticipantsRegion.currentView.$el.trigger('click');
      }).fetch();
      this.roleCollection.once('sync', function () {
        self.renderRolesAfterFetch();
      }).fetch();
    },

    renderParticipantsAfterFetch: function () {

      // create participants toolbar
      if (!this.participantsToolbarView) {

        // participant commands - if one exists, all exist. therefore we only
        // query for the 'add participant' command. this is also the one we
        // have to update each time we open the team view as the roles have to
        // be updated.
        var cmd = commands.get(AddParticipantCommand.prototype.defaults.signature)
        if (cmd) {
          // update the roles for the command 'enabled' check.
          cmd.roles = this.participantCollection.availableRoles;
        } else {
          // we have to create the commands initially.
          commands.add(new AddParticipantCommand({
            roles: this.participantCollection.availableRoles
          }));
          commands.add(new ExportParticipantsCommand());
          commands.add(_.extend(new ShowRolesCommand(), {
            execute: this.onShowRoles
          }));
          commands.add(new RemoveParticipantCommand());
        }

        this.participantsToolbarView = new TableToolbarView({
          originatingView: this,
          toolbarItems: participantToolbarItems,
          collection: this.participantCollection
        });
      }

      // create participant table view
      if (!this.participantsTableView) {
        // drop avatar column
        var colsWithSearch = _.rest(ParticipantsTableColumnCollection.getColumnKeys(), 1);
        // initialize view
        this.participantsTableView = new TableView({
          context: this.workspaceContext,
          connector: this.context.getObject(ConnectorFactory),
          collection: this.participantCollection,
          columns: this.participantCollection.columns,
          filterBy: this.participantCollection.filters,
          tableColumns: ParticipantsTableColumnCollection,
          selectColumn: true,
          enableSorting: true,
          orderBy: ParticipantsTableColumnCollection.columnNames.name + ' asc',
          nameEdit: false,
          haveDetailsRowExpandCollapseColumn: true,
          columnsWithSearch: colsWithSearch,
          tableTexts: {
            zeroRecords: lang.zeroRecordsOrFilteredParticipants
          }
        });
        // handle events
        this.listenTo(this.participantsTableView, 'tableRowSelected',
            this.updateParticipantsToolItems);
        this.listenTo(this.participantsTableView, 'tableRowUnselected',
            this.updateParticipantsToolItems);
        this.listenTo(this.participantsTableView, 'tableRowRendered', function(row) {
          //set specific attribute, so we can find the row easier in the roles.view cell.
          $(row.target).attr("conws-participant-row-id",row.node.get("id"));
        });

        // Set focus to roles column
        if (!_.isUndefined(this.participantsTableView.accFocusedState.body.column)) {
          this.participantsTableView.accFocusedState.body.column = 3;
        }
      }

      // show
      this.participantsToolbarRegion.show(this.participantsToolbarView);
      this.participantsRegion.show(this.participantsTableView);
    },

    renderRolesAfterFetch: function () {

      // create roles toolbar
      if (!this.rolesToolbarView) {
        commands.add(new ExportRolesCommand());
        commands.add(_.extend(new ShowDetailsCommand(), {
          execute: this.onShowDetails
        }));
        commands.add(new DeleteRoleCommand());

        this.rolesToolbarView = new TableToolbarView({
          originatingView: this,
          toolbarItems: roleToolbarItems,
          collection: this.roleCollection
        });
      }

      // create roles table view
      if (!this.rolesTableView) {
        // drop avatar column
        var colsWithSearch = _.rest(RolesTableColumnCollection.getColumnKeys(), 1);
        // initialize view
        this.rolesTableView = new TableView({
          context: this.workspaceContext,
          connector: this.context.getObject(ConnectorFactory),
          collection: this.roleCollection,
          columns: this.roleCollection.columns,
          filterBy: this.roleCollection.filters,
          tableColumns: RolesTableColumnCollection,
          selectColumn: true,
          enableSorting: true,
          orderBy: RolesTableColumnCollection.columnNames.name + ' asc',
          nameEdit: false,
          haveDetailsRowExpandCollapseColumn: true,
          columnsWithSearch: colsWithSearch,
          tableTexts: {
            zeroRecords: lang.zeroRecordsOrFilteredRoles
          }
        });
        // handle events
        this.listenTo(this.rolesTableView, 'tableRowSelected', this.updateRolesToolItems);
        this.listenTo(this.rolesTableView, 'tableRowUnselected', this.updateRolesToolItems);

        // Set focus to Name column
        if (!_.isUndefined(this.rolesTableView.accFocusedState.body.column)) {
          this.rolesTableView.accFocusedState.body.column = 2;
        }
      }

      // show
      this.rolesToolbarRegion.show(this.rolesToolbarView);
      this.rolesRegion.show(this.rolesTableView);
    },

    onShowRoles: function (status, options) {
      // initialize the role details view. it is based in a modal dialog view
      // to create a new tabable layer
      this.editor = new ModalDialogView({
        body: new ParticipantsView({
          model: status.nodes.models[0],
          roleCollection: status.originatingView.roleCollection,
          participantCollection: status.originatingView.participantCollection
        }),
        modalClassName: 'conws-roles-edit'
      });
      this.editor.show();

      // return an empty array of promises for the caller
      return [];
    },

    onShowDetails: function (status, options) {
      // initialize the role details view. it is based in a modal dialog view
      // to achieve a new taba
      this.editor = new ModalDialogView({
        body: new RolesView({
          model: status.nodes.models[0],
          roleCollection: status.originatingView.roleCollection,
          participantCollection: status.originatingView.participantCollection
        }),
        modalClassName: 'conws-role-details'
      });
      this.editor.show();

      // return an empty array of promises for the caller
      return [];
    },

    updateParticipantsToolItems: function () {
      // update toolbar items
      this.participantsToolbarView.updateForSelectedChildren(
          this.participantsTableView.getSelectedChildren());
    },

    participantsTableDomRefresh: function () {
      // update toolbar items
      this.participantsToolbarView.updateForSelectedChildren(
          this.participantsTableView.getSelectedChildren());
      this.participantsTableView.triggerMethod(
          'dom:refresh', this.participantsTableView);
    },

    updateRolesToolItems: function () {
      // update toolbar items
      this.rolesToolbarView.updateForSelectedChildren(
          this.rolesTableView.getSelectedChildren());
    },

    rolesTableDomRefresh: function () {
      // update toolbar items
      this.rolesToolbarView.updateForSelectedChildren(
          this.rolesTableView.getSelectedChildren());
      this.rolesTableView.triggerMethod(
          'dom:refresh', this.rolesTableView);
    },

    onShownTab: function (e) {
      var hash = e.target.hash;
      switch (hash) {
      case '#participantstab':
        this.renderParticipantsAfterFetch();
        this.participantsTableDomRefresh();
        break;
      case '#rolestab':
        this.renderRolesAfterFetch();
        this.rolesTableDomRefresh();
        break;
      }
    },

    onParticipantsChanged: function () {
      var self = this;
      //mark the view as dirty
      this.dirty = true;

      self.participantCollection.fetch({
        reload: true,
        success: function () {
          self.participantCollection.setNewParticipant();
          //update the partcipant toolbar
          self.updateParticipantsToolItems();
        }
      });
      self.roleCollection.fetch({reload: true});

      //update the roles toolbar
      this.updateRolesToolItems();
    },

    // Event when the participant or roles collection was changed
    onChanged: function () {
      //mark the view as dirty
      this.dirty = true;

      //update the toolbars
      this.updateParticipantsToolItems();
      this.updateRolesToolItems();
    },

    // close the dialog / expanded view
    onDestroy: function () {
      // close open dialogs
      if (this.rolesEditor) {
        this.rolesEditor.close();
        this.rolesEditor = undefined;
      }
      if (this.detailsEditor) {
        this.detailsEditor.close();
        this.detailsEditor = undefined;
      }

      // If the view is marked as dirty and a collapsed view is available trigger a refresh for the collapsed view
      if (this.dirty && !_.isUndefined(this.collapsedView)) {
        this.collapsedView.triggerMethod('refresh:list');
      }
      return true;
    }

  });

  // attach events propagation mixin
  _.extend(TeamTablesView.prototype, LayoutViewEventsPropagationMixin);

  return TeamTablesView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/listitem/impl/listitemteammember',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "        <span class=\"cs-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "        <span class=\"cs-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"cs-stage\">\r\n            <span class=\"cs-value\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.value : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n            <span class=\"cs-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n        </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"conws-user-avatar\"></div>\r\n<div class=\"cs-left\">\r\n    <div class=\"cs-title\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isUser : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "    </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_listitem_impl_listitemteammember', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/listitem/impl/listitemteamrole',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"conws-role-avatar\">\r\n  <span class=\"cs-icon circular cs-icon-add\" aria-hidden=\"true\"></span>\r\n</div>\r\n<div class=\"cs-left\">\r\n  <div class=\"cs-title\">\r\n    <span class=\"cs-name cs-role conws-font-1em-italic-steel-grey\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.value : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_listitem_impl_listitemteamrole', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/controls/listitem/impl/listitemteammember',[],function(){});
csui.define('conws/widgets/team/impl/controls/listitem/listitemteammember.view',[
  'csui/lib/jquery',
  'csui/utils/url',
  'csui/controls/listitem/listitemstandard.view',
  'csui/utils/contexts/factories/user',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'esoc/widgets/userwidget/userwidget',
  'hbs!conws/widgets/team/impl/controls/listitem/impl/listitemteammember',
  'hbs!conws/widgets/team/impl/controls/listitem/impl/listitemteamrole',
  'css!conws/widgets/team/impl/controls/listitem/impl/listitemteammember'
], function ($, Url, StandardListItem, UserModelFactory, Avatar, UserWidget, memberTemplate,
    roleTemplate) {

  var TeamMemberListItem = StandardListItem.extend({

    tagName: 'div',

    className: 'conws-item-member ' + StandardListItem.prototype.className,

    events: {
      'keydown': 'onKeyDown'
    },

    triggers: {
      'click': 'click:item',
      'click @ui.userAvatar': 'click:profile',
      'click @ui.userProfileName': 'click:profile'
    },

    ui: {
      userProfileName: '.cs-name',
      userAvatar: '.conws-user-avatar'
    },

    constructor: function TeamMemberListItem(options) {

      // initialize options
      options || (options = {});
      options.miniProfile = (options.miniProfile === undefined) ? true : false;
      options.context || (options.context = options.model.collection.context);

      // apply properties to parent
      StandardListItem.apply(this, arguments);

      // changes of the header model are rendered immediately
      this.listenTo(this.model, 'change', this.render);
    },

    getTemplate: function () {
      if (this.model.memberType === 'member') {
        return memberTemplate;
      } else {
        return roleTemplate;
      }
    },

    initialize: function () {
      this.avatar = new Avatar({model: this.model});
    },

    onRender: function () {
      if (this.model.get('type') !== undefined && this.model.get('type') === 0) {
        var loggedUser            = this.options.context.getModel(UserModelFactory),
            defaultOptions        = {
              connector: this.model.connector,
              model: this.model,
              userid: this.model.get('id'),
              context: this.options.context,
              showUserProfileLink: true,
              showMiniProfile: this.options.miniProfile,
              loggedUserId: loggedUser.get('id')
            },
            userProfilePicOptions = $.extend({
              placeholder: this.$el.find(this.ui.userAvatar),
              showUserWidgetFor: 'profilepic'
            }, defaultOptions);
        UserWidget.getUser(userProfilePicOptions);

        var userWidgetOptions = $.extend({
          placeholder: this.$el.find(this.ui.userProfileName)
        }, defaultOptions);
        UserWidget.getUser(userWidgetOptions);
      }
      else {
        this.$el.find(this.ui.userAvatar).append(this.avatar.render().$el);
      }
    },

    onKeyDown: function (e) {
      // open the user profile on enter / space
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.$('a').click();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  return TeamMemberListItem;
});


/* START_TEMPLATE */
csui.define('hbs!conws/utils/previewpane/impl/rolemembers.empty',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-preview empty-role-members-view\">\r\n    <span>"
    + this.escapeExpression(((helper = (helper = helpers.noResultsPlaceholder || (depth0 != null ? depth0.noResultsPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"noResultsPlaceholder","hash":{}}) : helper)))
    + "</span>\r\n</div>";
}});
Handlebars.registerPartial('conws_utils_previewpane_impl_rolemembers.empty', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/utils/previewpane/impl/previewpane',[],function(){});
// Shows a list of team members
csui.define('conws/utils/previewpane/impl/rolemembers.view',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/list/emptylist.view',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/teamtables.view',
  'csui/utils/nodesprites',
  'conws/widgets/team/impl/controls/listitem/listitemteammember.view',
  'i18n!conws/utils/previewpane/impl/nls/previewpane.lang',
  'hbs!conws/utils/previewpane/impl/rolemembers.empty',
  'css!conws/utils/previewpane/impl/previewpane'
], function (_, $, Marionette, ListView, EmptyView, LimitingBehavior, ExpandingBehavior,
    HeaderModelFactory, TeamCollectionFactory,
    TeamTablesView, NodeSpriteCollection, ListItem, lang, RoleMembersEmptyTemplate) {

  // Empty team view
  var RoleMembersEmptyView = Marionette.ItemView.extend({

    constructor: function RoleMembersEmptyView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: RoleMembersEmptyTemplate
  });

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var RoleMembersView = Marionette.CollectionView.extend({

    //className: 'conws-preview binf-list-group' + ListView.prototype.className,

    constructor: function RoleMembersView(options) {
      // initialize team view
      options || (options = {});
      options.data || (options.data = {});

      // apply properties to parent
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    getEmptyView: function () {
      return EmptyView;
    },

    emptyViewOptions: function () {
      return {
        templateHelpers: {
          text: this.options.noRoleMembersMessage
        }
      }
    },

    childView: ListItem,

    childViewOptions: function () {
      return {
        templateHelpers: function () {
          return {
            name: this.model.get('display_name'),
            email: this.model.get('business_email'),
            isUser: this.model.get('type') === 0,
            stage: {
              value: this.model.getLeadingRole(),
              label: this.model.getRolesIndicator()
            }
          }
        },
        context: this.options.context,
        miniProfile: false
      }
    },

    childEvents: {
      'click:profile': 'onClickProfile'
    },

    onClickProfile: function (view, data) {
      this.triggerMethod('click:member', data);
    },

    /*
    getExpandableDialogIcon: function () {
        // initialize
        var ret = {
            icon: undefined,
            image: undefined
        };
        // calculate the images to show
        if (this.options.data.showTitleIcon) {
            // we want to show a workspace specific icon
            if (this.options.data.showWorkspaceImage) {
                if (this.headerModel.icon.location !== 'none') {
                    ret.image = this.headerModel.icon.content;
                } else {
                    ret.icon = NodeSpriteCollection.findByNode(this.headerModel).get('className');
                }
            } else {
                // default header icon style
                ret.icon = 'title-icon title-team';
            }
        }
        // return
        return ret;
    },
    */

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    }
  });

  return RoleMembersView;

})
;


/* START_TEMPLATE */
csui.define('hbs!conws/utils/previewpane/impl/previewpane',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"binf-panel-heading conws-preview-header\">\r\n</div>\r\n\r\n<div class=\"binf-panel-body\">\r\n    <div class=\"conws-preview-metadata conws-preview-perfect-scroll\">\r\n    </div>\r\n\r\n    <hr>\r\n\r\n    <div class=\"binf-list-group conws-preview-role-members conws-preview-perfect-scroll\">\r\n        User Or Role Area\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_utils_previewpane_impl_previewpane', t);
return t;
});
/* END_TEMPLATE */
;
// Business Workspace Header View
csui.define('conws/utils/previewpane/previewpane.view',[
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/utils/base',
  'csui/utils/log',
  'csui/utils/url',
  'csui/controls/list/emptylist.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/utils/previewpane/impl/previewheader.model',
  'conws/utils/previewpane/impl/previewheader.view',
  'conws/utils/previewpane/impl/attributes.model',
  'conws/utils/previewpane/impl/role.model',
  'conws/utils/previewpane/impl/rolemembers.view',
  'conws/models/selectedmetadataform/selectedmetadataform.model',
  'conws/controls/selectedmetadataform/selectedmetadataform.view',
  'i18n!conws/utils/previewpane/impl/nls/previewpane.lang',
  'hbs!conws/utils/previewpane/impl/previewpane',
  'css!conws/utils/previewpane/impl/previewpane'
], function (require, _, $, Marionette, Handlebars, WidgetContainerBehavior, base, log, Url,
    EmptyView, PerfectScrollingBehavior, LayoutViewEventsPropagationMixin,
    PreviewHeaderModel, PreviewHeaderView, PreviewAttributesModel,
    RoleMemberCollection, RoleMembersView,
    MetadataModel, MetadataView,
    lang, template) {

  // initialize the Header View
  var PreviewPaneView = Marionette.LayoutView.extend({
    // CSS class names
    className: 'conws-preview panel panel-default',

    // Template is used to render the HTML for the view
    template: template,

    // the nested region is required to place right hand child view
    regions: {
      headerRegion: '.conws-preview-header',
      metaDataRegion: '.conws-preview-metadata',
      roleMembersRegion: '.conws-preview-role-members'
    },

    // the triggers are used to add / remove the workspace icon
    triggers: {
      'change #header-ws-add-icon-file': 'add:icon',
      'click  #header-ws-remove-icon': 'remove:icon'
    },

    // find a better solution instead of a blank 1x1px png image
    blankImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=',

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.conws-preview-perfect-scroll',
        suppressScrollX: true
      }
    },

    // The constructor gives an explicit name the the object in the debugger and
    // can update the options for the parent view
    constructor: function PreviewPaneView(options) {
      // wire models and collections also to the parent view
      Marionette.LayoutView.prototype.constructor.call(this, options);

      options || (options = {});
      this.config = options.config;
      this.fetched = false;

      // Only in case role or metadata is configured, show preview
      if (this.config.roleId || this.config.metadata) {
        // the related item view to show the preview for
        this.parent = options.parent;

        this.config.noMetadataMessage = this._localize('noMetadataMessage');
        this.config.noRoleMembersMessage = this._localize('noRoleMembersMessage');
        this.config.readonly = true;

        //---------------------------------------------------------------
        // create Backbone models for PreviewPane
        //---------------------------------------------------------------
        this.headerModel = new PreviewHeaderModel(options);
        this.metaDataModel = new MetadataModel(undefined, {
          node: options.node,
          metadataConfig: this.config,
          autofetch: true,
          autoreset: true
        });

        this.roleMemberCollection = new RoleMemberCollection(null, options);

        //---------------------------------------------------------------
        // setup popover
        //---------------------------------------------------------------
        var container = $.fn.binf_modal.getDefaultContainer ?
                        $.fn.binf_modal.getDefaultContainer() : 'body';
        options.parent.$el.binf_popover({
          content: this.$el,
          parent: options.parent.$el,
          placement: function () {
            // reset element where popover is displayed, could have been changed e.g. due to
            // resize browser
            this.$element = this.options.parent;

            // See also binf.js (Bootstrap - popover placement)
            var defaultPlacement = "right";
            var placement = defaultPlacement;
            var tip = this.tip();

            // To get the correct size and check the position, it must be attached
            tip.detach()
                .css({top: 0, left: 0, display: 'block'})
                .addClass('binf-' + placement)
                .data('binf.' + this.type, this);
            this.options.container ? tip.appendTo(this.options.container) : tip.insertAfter(this.$element);

            var pos = this.getPosition();
            var $container = this.options.container ? $(this.options.container) :
                             this.$element.parent();
            var containerDim = this.getPosition($container);
            var actualWidth = tip[0].offsetWidth;

            // Check for space on the right side or on the left side of the widget
            // containerDim.width = complete window width
            if ((pos.right + actualWidth < containerDim.width) || (pos.left - actualWidth > 0)) {
              // Calculate right or left placement beside the widget
              placement = pos.right + actualWidth > containerDim.width ? 'left' :
                          pos.left - actualWidth < containerDim.left ? 'right' :
                          placement;
            }
            else {
              // In case on the left and on the right side is not enough space, place it on the
              // right side beside the title. Therefore change element beside popup is displayed
              // to preview pane default position element if exist
              var defaultPosition = $(this.$element[0]).find('.conws-previewpane-default-position');
              if (defaultPosition.length > 0) {
                this.$element.removeAttr('aria-describedby')
                this.$element = defaultPosition
                this.$element.attr('aria-describedby', tip.attr('id'))
              }
            }

            // If placement has changed, set proper class
            if( placement !== defaultPlacement ){
              tip.removeClass('binf-' + defaultPlacement).addClass('binf-' + placement);
            }

            return placement;
          },
          trigger: 'manual',
          container: container,
          html: true
        });

        var $tip = this.parent.$el.data('binf.popover');
        var $pop = $tip.tip();
        $pop.addClass('conws-previewpane-popover');

        //---------------------------------------------------------------
        // setup event handlers for popover and its associated item view
        //---------------------------------------------------------------

        $pop.on('mouseenter', this, $.proxy(function () {
              if (this.config.debug === true) {
                log.info('Preview ' + this.options.node.get('id') + ': Mouseenter popover') && console.log(log.last);
              }
              this.show();
            }, this)
        );

        $pop.on('mouseleave', this, $.proxy(function () {
              if (this.config.debug === true) {
                log.info('Preview ' + this.options.node.get('id') + ': Mouseleave popover') && console.log(log.last);
              }
              this.delayedHide();
            }, this)
        );

        this.propagateEventsToRegions();
      }
    },

    onBeforeDestroy: function (e) {
      if (this.config.roleId || this.config.metadata) {
        this.parent.$el.binf_popover('destroy');
      }
    },

    show: function () {
      // Only in case role or metadata is configured, show preview
      if (this.config.roleId || this.config.metadata) {
        var that = this;

        if (this.config.debug === true) {
          log.info('Preview ' + this.options.node.get('id') + ': Preparing show') && console.log(log.last);
        }

        // clear hide timeout if there is one
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
          if (this.config.debug === true) {
            log.info('Preview ' + this.options.node.get('id') + ': Cleared hide timeout') && console.log(log.last);
          }
          this.hideTimeout = null;
        }

        // nothing to do if already visible
        if (this.$el.is(":visible")) {
          if (this.config.debug === true) {
            log.info('Preview ' + this.options.node.get('id') + ': Already visible') && console.log(log.last);
          }
          return;
        }

        this.showCancelled = false;

        this.$el.hide();
        this.render();
        var $deferred = $.Deferred();

        if (this.headerView) {
          this.headerView.destroy();
        }

        if (this.roleView) {
          this.roleView.destroy();
        }

        if (this.metaDataView) {
          this.metaDataView.destroy();
        }

        this.headerView = new PreviewHeaderView({model: this.headerModel});
        this.roleView = new RoleMembersView({
          collection: this.roleMemberCollection,
          noRoleMembersMessage: this.config.noRoleMembersMessage,
          // Context is needed in constructor of TeamMemberListItem, so we need to pass it here
          context: this.options.context
        });
        this.listenTo(this.roleView, 'click:member', this.hide);

        this.metaDataView = new MetadataView({
          model: this.metaDataModel,
          context: this.options.context
        });
        this.metaDataView.on('render:form', function () {
          that._attachUserFieldHandlers(this);
          // Only called in case meta data configured
          $deferred.resolve();
        });

        if( !this.config.metadata ){
          // In case no meta data configured, still show role members
          $deferred.resolve();
        }

        var proms;
        if (!this.fetched) {
          proms = [
            this.headerModel.fetch(),
            this.metaDataModel.fetch(),
            this.roleMemberCollection.fetch(),
            $deferred
          ];
        }
        else if ( this.config.metadata ) {
          // Do only in case metadata is configured
          this.metaDataModel.trigger('change');
          proms = [
            $.Deferred().resolve(),
            $.Deferred().resolve(),
            $.Deferred().resolve(),
            $deferred
          ];
        }

        $.when.apply(this, proms).done(
            _.bind(function () {
              this.fetched = true;
              if (!this.showCancelled) {
                // close all other preview popovers
                $(".conws-previewpane-popover").each(function (i, el) {
                  var popoverId = $(el).attr('id');
                  $("[aria-describedby^='" + popoverId + "']").binf_popover('hide')
                });

                if (this.config.debug === true) {
                  log.info('Preview ' + this.options.node.get('id') + ': Showing') && console.log(log.last);
                }

                var renderMeta = false;
                if (_.isEmpty(this.metaDataModel.attributes.data)) {
                  this.metaDataView = new EmptyView({text: this.config.noMetadataMessage});
                  renderMeta = true;
                }

                // prepare and show popover for this item
                this.headerRegion.show(this.headerView, {render: true});
                this.metaDataRegion.show(this.metaDataView, {render: renderMeta});
                this.roleMembersRegion.show(this.roleView, {render: true});
                this.$el.show();
                this.options.parent.$el.binf_popover('show');

                if (this.config.debug === true) {
                  log.info("Viewport height: " + $(window).height()) && console.log(log.last);
                  log.info("document height: " + $(document).height()) && console.log(log.last);
                  log.info("body     height: " + $('body').height()) && console.log(log.last);
                  log.info("popover  height: " + this.$el.height()) && console.log(log.last);
                  log.info("metadata height: " +
                              this.$el.find('.conws-preview-metadata').height()) && console.log(log.last);
                  log.info("role     height: " +
                              this.$el.find('.conws-preview-role-members').height()) && console.log(log.last);
                }
                //triggering the perfect scroll behavior after updating the dom with metadata and roles data
                this.triggerMethod('dom:refresh');
              }
              else if (this.config.debug === true) {
                log.info('Preview ' + this.options.node.get('id') +
                            ': Show was cancelled -> skipped') && console.log(log.last);
              }
            }, this)
        );
      }
    },

    hide: function () {
      if (this.config.debug === true) {
        log.info('Preview ' + this.options.node.get('id') + ': Going to hide') && console.log(log.last);
      }

      if (this.config && !this.config.debugNoHide) {
        if (this.config.debug === true) {
          log.info('Preview ' + this.options.node.get('id') + ': Hidden') && console.log(log.last);
        }
        this.options.parent.$el.binf_popover('hide');
        this.hideTimeout = null;
      }
      else {
        if (this.config.debug === true) {
          log.info('Preview ' + this.options.node.get('id') + ': Leaving visible') && console.log(log.last);
        }
      }

      this.showCancelled = true;
      this.hideTimeout = null;
    },

    delayedHide: function () {
      if (this.config.debug === true) {
        log.info('Preview ' + this.options.node.get('id') + ': Setting hide timeout') && console.log(log.last);
      }
      this.hideTimeout = window.setTimeout($.proxy(this.hide, this), 200);
    },

    _localize: function (name) {
      var ret = lang[name];

      if (this.config[name]) {
        ret = base.getClosestLocalizedString(this.config[name], ret);
      }

      return ret;
    },

    // Attaches event handlers to user fields to
    //    1. prevent user fields from displaying their info popover
    //    2. close preview pane when user field is clicked to open user profile
    _attachUserFieldHandlers: function (metadataView) {
      var handler = function (event) {
        log.info("User field mouseover") && console.log(log.last);
        event.stopPropagation();
        return false;
      };

      var userFields = metadataView.$el.find(".cs-userfield .cs-field-read");
      _.each(userFields, function (field) {
        field.addEventListener('mouseover', handler, true);
      });

      handler = $.proxy(this.hide, this);
      metadataView.$el.find(".cs-userfield .cs-field-read-inner").click(handler);
    }
  });

  _.extend(PreviewPaneView.prototype, LayoutViewEventsPropagationMixin);

  // return the initialized view
  return PreviewPaneView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/relatedworkspaces/impl/relateditem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <span class=\"conws-value\">\r\n              <span class=\"conws-previewpane-default-position\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n            </span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    return "              <!-- add element to get proper distance to value -->\r\n              <div class=\"conws-spacer\"></div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <span class=\"conws-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "            <!-- add element to get proper distance to description -->\r\n            <div class=\"conws-description-spacer\"></div>\r\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"conws-right\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          </div>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"conws-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    return "                <!-- add element to get proper distance to value -->\r\n                <div class=\"conws-spacer\"></div>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"conws-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"conws-body\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.value : stack1), depth0))
    + "</div>\r\n";
},"16":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"conws-left\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          </div>\r\n";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"conws-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"19":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"conws-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n";
},"21":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"conws-right\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(24, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          </div>\r\n";
},"22":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"conws-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"24":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"conws-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n";
},"26":function(depth0,helpers,partials,data) {
    return "  <div class=\"conws-relateditem-divider\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"conws-relateditem-action-area\">\r\n  <a class=\"conws-nostyle\" href=\""
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + "\">\r\n    <div class=\"conws-relateditem-border\">\r\n      <div class=\"conws-relateditem-top\">\r\n        <div class=\"conws-title conws-left\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.topRight : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n\r\n      <div class=\"conws-relateditem-center\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n\r\n      <div class=\"conws-relateditem-bottom\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.bottomLeft : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.bottomRight : depth0),{"name":"if","hash":{},"fn":this.program(21, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n    </div>\r\n  </a>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.notLastItem : depth0),{"name":"if","hash":{},"fn":this.program(26, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('conws_widgets_relatedworkspaces_impl_relateditem', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/relatedworkspaces/impl/relateditem',[],function(){});
// Shows a list of workspaces related to the current one
csui.define('conws/widgets/relatedworkspaces/impl/relateditem.view',['module', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/lib/jquery',
  'conws/utils/previewpane/previewpane.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/base',
  'csui/lib/numeral',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/lang',
  'hbs!conws/widgets/relatedworkspaces/impl/relateditem',
  'css!conws/widgets/relatedworkspaces/impl/relateditem'
], function (module, _, Marionette, $,
    PreviewPaneView,
    DefaultActionBehavior,
    base,
    numeral,
    lang,
    itemTemplate) {

  var RelatedItemView = Marionette.ItemView.extend({

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function RelatedItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    triggers: {
      'click .conws-relateditem-border': 'click:item'
    },

    events: {
      'mouseenter': 'showPreviewPane',
      'mouseleave': 'hidePreviewPane'
    },

    onClickItem: function () {
      this.destroyPreviewPane();
      this.triggerMethod('execute:defaultAction', this.model);
    },

    onBeforeDestroy: function (e) {
      this.destroyPreviewPane();
    },

    showPreviewPane: function () {
      if (this.options && this.options.data && this.options.data.preview && (this.options.data.preview.roleId || this.options.data.preview.metadata)) {
        if (!this.previewPane) {
          this.previewPane = new PreviewPaneView({
            parent: this,
            context: this.options.context,
            config: this.options.data && this.options.data.preview,
            node: this.model
          });
        }
        this.previewPane.show();
      }
    },

    hidePreviewPane: function () {
      if (this.previewPane) {
        this.previewPane.delayedHide();
      }
    },

    destroyPreviewPane: function() {
      if (this.previewPane) {
        this.previewPane.destroy();
        delete this.previewPane;
      }
    },

    className: 'conws-relateditem-object clearfix',
    template: itemTemplate,

    serializeData: function () {

      // prepare values
      var allval = this._getObject(this.options.data || {});

      var values = {};

      // take only values we want
      allval.title && (values.title = allval.title);
      allval.description && (values.description = allval.description);
      allval.topRight && (values.topRight = allval.topRight);
      allval.bottomLeft && (values.bottomLeft = allval.bottomLeft);
      allval.bottomRight && (values.bottomRight = allval.bottomRight);

      // default values if still no value is set
      values.title || (values.title = {value: this.model.get('name')});
      values.name || (values.name = this.model.get('name'));
      values.id || (values.id = this.model.get('id'));
      values.defaultActionUrl = DefaultActionBehavior.getDefaultActionNodeUrl(this.model);

      // provide property to indicate that this is not the last item
      if (this.model.get("id") !==
          this.model.collection.models[this.model.collection.models.length - 1].get("id")) {
        values.notLastItem = true;
      }

      return values;
    },

    templateHelpers: function (data) {
      return data;
    },

    // Loop over configuration and set proper content that should be displayed
    _getObject: function (object) {
      return _.reduce(object, function (result, expression, name) {
        if (typeof expression !== 'object') {
          expression = this.self._getValue(expression);
        } else if (typeof expression === 'object') {
          if(name === 'value' || name === 'label') {
            var exp = base.getClosestLocalizedString(expression);
            expression = this.self._getValue(exp);
          }
          else {
            expression = this.self._getObject(expression);
          }
        }
        result[name] = expression;

        return result;
      }, {}, {"self": this});
    },

    _getValue: function (expression) {
      // Replace the {} parameter placeholders
      var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g,
          match, propertyName, placeholder, value, valueFormat, result = expression;
      // Go over every parameter placeholder found
      // Don't change expression while doing this, because exec remembers position of last matches
      while ((match = parameterPlaceholder.exec(expression))) {
        placeholder = match[0];
        propertyName = match[1];
        valueFormat = match[3];
        // Format the value according to his type
        if (this.model.collection.columns.models) {
          value = this._formatPlaceholder(propertyName, valueFormat, this.model.attributes,
              this.model.collection.columns.models);
        }

        // Replace the placeholder with the value found
        result = result.replace(placeholder, value);
      }
      return result;
    },

    // returns a type specifically formatted model value.
    _formatPlaceholder: function (propertyName, valueFormat, attributes, columnModels) {
      var value, column, type, suffix = "_expand", orgPropertyName = propertyName;

      column = _.find(columnModels, function (obj) {
        return obj.get("column_key") === propertyName;
      });
      type = column && column.get("type") || undefined;

      // If exist use expanded property
      propertyName = attributes[propertyName + suffix] ? propertyName + suffix : propertyName;
      value = attributes[propertyName] || "";

      switch (type) {
      case -7:
        value = base.formatDate(value);
        break;
      case 5:
        // Type 5 is a boolean and in this case format properly
        value = attributes[propertyName + "_formatted"];
        if (value === null || value === undefined) {
          value = '';
        }
        break;
      case 2, 14:
        // Type 2 and 14 can be user or group and in this case format properly
        // Check for type_name : user + expand -> user
        // Check for type_name : group + expand -> group
        if (propertyName.indexOf(suffix, this.length - suffix.length) !== -1 &&
            (attributes[propertyName].type_name === "User" || attributes[propertyName].type_name === "Group")) {
          value = base.formatMemberName(value);
        }
        // No break because it must also be checked for default!
        /* falls through */
      default:
        // Allow currency to applied for different types, e.g. also a string can be
        // formatted as currency
        if (valueFormat === 'currency') {
          // FIXME: format properly if csui provide formating currencies, for now use default
          value = numeral(value).format();
        }

        // In case the value is still expanded object (e.g. user property is undefined, ...)
        // Set value the not expanded property
        if (typeof value === 'object') {
          value = attributes[orgPropertyName] || "";
        }
      }
      return value;
    }
  });

  return RelatedItemView;

});

csui.define('conws/utils/workspaces/close.expanded.view',['require', 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  'csui/utils/commandhelper', 'csui/models/command'
], function (require, $, base, _, CommandHelper, CommandModel) {
  

  /**
   * Dummy command to make a close button visible and executable in toolbar view.
   * But do not register command in the global command list.
   * Execution is done by the view itself listening to the toolbar events
   * 'before:execute:command' and 'after:execute:command'.
   */
  var CloseExpandedViewCommand = CommandModel.extend({

    defaults: {
      signature: "CloseExpandedView",
      scope: "single"
    },

    enabled: function (status, options) {
      return true;
    },

    execute: function (status, options) {
    }

  });

  return CloseExpandedViewCommand;

});

csui.define('conws/widgets/relatedworkspaces/commands',[
  'csui/models/commands',
  'csui/utils/commands',
  'conws/utils/workspaces/close.expanded.view'
], function (
    CommandCollection,
    commands,
    CloseExpandedViewCommand) {

    /**
     * Append close command to standard commands list, to have it in the related items view only.
     */
    var relatedWorkspacesCommands = new CommandCollection([
      new CloseExpandedViewCommand()
    ].concat(commands.models));

  return relatedWorkspacesCommands;
});


csui.define('conws/widgets/relatedworkspaces/toolbaritems',[
  'csui/lib/underscore',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui/widgets/favorites/favorite.star.view',
  // Load extra tool items to be added to this collection
  'csui-ext!conws/widgets/relatedworkspaces/toolbaritems'
], function (_, wksplang, lang, ToolItemsFactory, TooItemModel, FavoriteStarView,
    extraToolItems) {
  

  // Keep the keys in sync with csui/widgets/nodestable/toolbaritems.masks
  var toolbarItems = {

    addToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "AddRelation",
              name: lang.ToolbarItemAddRelation,
              icon: "icon icon-toolbarAdd"
            }
          ]
        },
        {
          maxItemsShown: 2,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownText: "...",
          addTrailingDivider: false
        }),
    tableHeaderToolbar: new ToolItemsFactory({
        main: [
          {
            signature: "RemoveRelation",
            name: lang.ToolbarItemRemoveRelation
          }
        ]
      },
      {
        maxItemsShown: 15,
        dropDownIcon: "icon icon-toolbar-more",
        dropDownText: "...",
        addGroupSeparators: false,
        lazyActions: true
      }),
    rightToolbar: new ToolItemsFactory({
      main: [
        {
          signature: "CloseExpandedView",
          name: wksplang.ToolbarItemCloseExpandedView,
          icon: "icon icon-tileCollapse"
        }
     ]
    }, {
      hAlign: "right",
      maxItemsShown: 5,
      dropDownIcon: "icon icon-toolbar-more",
      dropDownText: "...",
      addTrailingDivider: false
    })
  };

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar && key === 'otherToolbar') {
          targetToolbar = toolbarItems['tableHeaderToolbar'];
        }
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return toolbarItems;
});

csui.define('conws/widgets/relatedworkspaces/toolbaritems.masks',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  

  // Keep the keys in sync with conws/widgets/relatedworkspaces/impl/toolbaritems
  var toolbars = ['filterToolbar', 'leftToolbar', 'tableHeaderToolbar',
                  'inlineActionbar', 'rightToolbar'];

  function ToolbarItemsMasks() {
    var config = module.config(),
        globalMask = new GlobalMenuItemsMask();
    // Create and populate masks for every toolbar
    this.toolbars = _.reduce(toolbars, function (toolbars, toolbar) {
      var mask = new ToolItemMask(globalMask, {normalize: false});
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        source = source[toolbar];
        if (source) {
          mask.extendMask(source);
        }
      });
      // Enable restoring the mask to its initial state
      mask.storeMask();
      toolbars[toolbar] = mask;
      return toolbars;
    }, {});
  }

  ToolbarItemsMasks.toolbars = toolbars;

  return ToolbarItemsMasks;

});



csui.define('conws/widgets/relatedworkspaces/headermenuitems',['csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items to be added to this collection
  'csui-ext!conws/widgets/relatedworkspaces/headermenuitems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraMenuItems) {

  var toolbarItems = {
    headerMenuToolbar: new ToolItemsFactory({
          other: [] // empty list. no menu is displayed.
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-expandArrowDown"
        }
    )
  };

  if (extraMenuItems) {
    _.each(extraMenuItems, function (moduleMenuItems) {
      _.each(moduleMenuItems, function (menuItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(menuItems, function (menuItem) {
          menuItem = new TooItemModel(menuItem);
          targetToolbar.addItem(menuItem);
        });
      });
    });
  }

  return toolbarItems;

});

csui.define('conws/widgets/relatedworkspaces/headermenuitems.masks',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  

  var HeaderMenuItemsMask = ToolItemMask.extend({

    constructor: function HeaderMenuItemsMask() {
      var config = module.config(),
          globalMask = new GlobalMenuItemsMask();
      ToolItemMask.prototype.constructor.call(this, globalMask, {normalize: false});
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        this.extendMask(source);
      }, this);
      // Enable restoring the mask to its initial state
      this.storeMask();
    }

  });

  return HeaderMenuItemsMask;

});


/* START_TEMPLATE */
csui.define('hbs!conws/utils/workspaces/workspacestable',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "<div class=\"conws-alternating-toolbars\">\r\n  <div class=\"conws-table-tabletoolbar\"></div>\r\n  <div class=\"conws-table-rowselection-toolbar\"></div>\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showAlternatingToolbar : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "<div class=\"conws-workspacestable\">\r\n  <div id=\"tableview\"></div>\r\n  <div id=\"paginationview\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_utils_workspaces_workspacestable', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/utils/workspaces/workspaces.columns',['csui/lib/backbone'], function (Backbone) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: 'key',

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: 'sequence',

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  // sequence:
  // 1-100: Fixed columns
  // 500-600: Dynamic columns (custom columns in widget configuration)
  // 900-1000: Special columns at the end (favorite, like, comment)
  // Hint: if the sequence of 'name' column is changed, the focused column in workspacestable.view
  // should be also adapted with the new id.
  // Current state is tableView.accFocusedState.body.column = 1

  var tableColumns = new TableColumnCollection([
    {
      key: 'type',
      sequence: 10
    },
    {
      key: 'name',
      sequence: 20
    },
    {
      key: 'size',
      sequence: 30
    },
    {
      key: 'modify_date',
      sequence: 40
    },
    {
      key: 'favorite',
      sequence: 910,
      noTitleInHeader: true, // don't display a column header
      permanentColumn: true // don't wrap column due to responsiveness into details row
    }
  ]);

  return tableColumns;

});


csui.define('css!conws/utils/workspaces/workspacestable',[],function(){});
csui.define('conws/utils/workspaces/workspacestable.view',['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'hbs!conws/utils/workspaces/workspacestable',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model',
  'csui/controls/table/table.view',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/utils/commands',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/pagination/nodespagination.view',
  'conws/utils/workspaces/workspaces.columns',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/accessibility',
  'csui/utils/base',
  'csui/controls/progressblocker/blocker',
  'conws/utils/workspaces/busyindicator',
  'csui/lib/jquery.redraw',
  'css!conws/utils/workspaces/workspacestable',
  'css!conws/utils/workspaces/workspaces',
  'csui/controls/toolbar/toolbar.view' /* must load this as well to have toolbar.css effective. */
], function (module, $, _, Backbone,
    Marionette, log, lang,
    template,
    DefaultActionBehavior,
    ConnectorFactory,
    NodeModel,
    TableView,
    TableToolbarView,
    TableRowSelectionToolbarView,
    commands,
    ToolbarCommandController,
    PaginationView,
    WorkspacesColumns,
    ModalAlert,
    Accessibility,
    base,
    BlockingView,
    BusyIndicator) {

  var config = module.config();
  var orderByDefault = { sortColumn: "{name}", sortOrder: "asc" };

  var accessibleTable = Accessibility.isAccessibleTable();

  var WorkspacesTableView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'conws-workspaces-table';
      if (accessibleTable) {
        className += ' csui-no-animation';
      }
      return className;
    },

    template: template,

    ui: {
      // facetTableContainer: '.csui-facet-table-container',
      // outerTableContainer: '.csui-outertablecontainer',
      // innerTableContainer: '.csui-innertablecontainer',
      // tableView: '.csui-table-tableview',
      // thumbnail: '.csui-thumbnail-wrapper',
      toolbarContainer: '.conws-alternating-toolbars'//,
      // facetView: '.csui-table-facetview',
      // paginationView: '.csui-table-paginationview'
    },

    regions: {
      tableToolbarRegion: '.conws-table-tabletoolbar',
      tableRowSelectionToolbarRegion: '.conws-table-rowselection-toolbar',
      tableRegion: '#tableview',
      paginationRegion: '#paginationview'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function WorkspacesTableView(options) {
      if (options === undefined || !options.context) {
        throw new Error('Context required to create WorkspacesTableView');
      }
      if (!options.collection) {
        throw new Error('Collection required to create WorkspacesTableView');
      }
      options.data || (options.data = {});
      this.context = options.context;
      this.collection = options.collection;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
      _.defaults(this.options.data, {
        pageSize: config.defaultPageSize || 20,
        orderBy: {}
      });
      _.defaults(this.options.data.orderBy, orderByDefault );

      if (this.options &&
          this.options.data &&
          this.options.data.expandedView &&
          this.options.data.expandedView.orderBy) {
        if (_.isString(this.options.data.expandedView.orderBy)) {
          log.error(lang.errorOrderByMustNotBeString) && console.log(log.last);
          ModalAlert.showError(lang.errorOrderByMustNotBeString);
        } else if (this.options.data.expandedView.orderBy.sortColumn) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(this.options.data.expandedView.orderBy.sortColumn);
          if (!match) {
            log.error(lang.errorOrderByMissingBraces) && console.log(log.last);
            ModalAlert.showError(lang.errorOrderByMissingBraces);
          }
        }
      }

      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).on("resize.app", this.onWinRefresh);

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      // List for the event notifying when a dialog has been shown - at which point element sizing
      // can be determined
      this.listenTo(this, 'after:show', this.windowRefresh);

      // Show error if returned from server
      this.listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", this.unblockActions)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "error", function (model,request,options) {
            this.unblockActions.apply(this, arguments);
            if (request) {
              ModalAlert.showError((new base.Error(request)).message);
            }
          })
          .listenTo(this.collection,"sync",function(){
            if (this.collection.selectActions) {
              var showSelectColumn = !!(this.options.showSelectColumn && this.collection.existsSelectable);
              if (this.tableView && this.tableView.options && this.tableView.options.selectColumn!==showSelectColumn) {
                this.tableView.options.selectColumn = showSelectColumn;
                this.collection.columns.trigger('reset',this.collection.columns);
              }
            }
          });
    },

    initialize: function() {

      Marionette.LayoutView.prototype.initialize.apply(this, arguments);

      if (this.options.hasTableRowSelection) {

        // log warning if options.toolbarItems is not set
        // log warning if options.toolbarItemsMasks is not set
        // log warning if options.headermenuItems is not set
        // log warning if options.headermenuItemsMasks is not set

        _.defaults(this.options,{
          showCondensedHeaderToggle: true,
          showSelectColumn: true,
          showSelectionCounter: true
        });

        this.commands = this.options.commands || commands;
        this.commandController = this.options.commandController || new ToolbarCommandController({commands: this.commands});

        this.listenTo(this.commandController, 'before:execute:command', this._beforeExecuteCommand);
        this.listenTo(this.commandController, 'after:execute:command', this._toolbarActionTriggered);
        this.listenTo(this, 'dom:refresh', this._refreshTableToolbar);
  
        this.initAllSelection();

        // in selectActions collect all actions, participating in the selection,
        // i.e. all command keys used in rowSelectionToolbar.
        var selcmds = this.commands;
        var sigcmds = _.compact(this.options.toolbarItems.tableHeaderToolbar.collection.map(function(toolItem){
          return (selcmds.get(toolItem.get("signature")));
        }));
        this.collection.selectActions = _.flatten(_.map(sigcmds,function(cmd){
          return cmd.get("command_key");
        }));
      }

    },

    onDestroy: function () {
      $(window).off("resize.app", this.onWinRefresh);
    },

    _refreshTableToolbar: function () {
      if (this.tableToolbarView && this.tableToolbarView.rightToolbarView) {
        this.tableToolbarView.rightToolbarView.collection.refilter();
      }
    },

    templateHelpers: function (data) {
      data = data || {};
      data.showAlternatingToolbar = !!this.options.hasTableRowSelection;
      return data;
    },

    doRender: function (collection) {

      // Due to endless scrolling and different properties displayed we have to fetch the first page again
      _.extend(collection.options.query, this._getCollectionUrlQuery());
      collection.setLimit(0, this.options.data.pageSize, false);

      // Render table after workspaces are fetched because not
      // all columns are loaded by limited view (e.g. modify_date)
      var self = this;
      collection
        .once('sync', function() {
          self.renderAfterFetch(self,collection);
        })
        .fetch();
      // Not needed to care about error here, since the error listener defined in constructor,
      // cares also bout error caused by this fetch

      if (this.options.hasTableRowSelection) {
        this._setToolBar();
        this._setTableRowSelectionToolbar({
          toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
          toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
          showCondensedHeaderToggle: this.options.showCondensedHeaderToggle,
          showSelectionCounter: this.options.showSelectionCounter
        });
        this._setTableRowSelectionToolbarEventListeners();
        
        this.tableToolbarRegion.show(this.tableToolbarView);

        if (this.tableRowSelectionToolbarRegion) {
          if (this._tableRowSelectionToolbarView) {
            this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          }
          this.tableRowSelectionToolbarRegion.$el.find('ul').attr('aria-label',
            lang.selectedItemActionBarAria);
        }
      }
      
    },

    renderAfterFetch: function (self, collection) {
      var columns   = self.collection.columns,
          connector = self.context.getObject(ConnectorFactory);

      // For all columns where sort is true, search must be possible
      var columnsWithSearch = [];
      _.each(columns.models, function (model) {
        // Enable sorting only for string types (e.g. StringField, StringMultiLine, StringPopup)
        // This is required for now, since server does not support other types
        if (model.get("sort") === true && model.get("type") === -1) {
          columnsWithSearch.push(model.get("column_key"));
        }
      });

      // Add custom columns from widget configuration to displayed columns
      // Don't change WorkspacesColumns!
      var tableColumns = WorkspacesColumns.clone();
      tableColumns.add(this._getCustomColumns(true));
      this.tableColumns = tableColumns;

      this.tableView = new TableView({
        context: this.options.context,
        connector: connector,
        collection: collection,
        columns: columns,
        // Columns (node properties) displayed in table view
        tableColumns: tableColumns,
        columnsWithSearch: columnsWithSearch,
        selectColumn: !!(this.options.showSelectColumn && this.collection.existsSelectable),
        showSelectionCounter: !!this.options.showSelectionCounter,
        allSelectedNodes: this.allSelectedNodes,
        pageSize: this.options.data.pageSize,
        orderBy: this.collection.orderBy,
        nameEdit: false,
        tableTexts: {
          zeroRecords: lang.noWorkspacesFound
        }
      });

      if (this.options.hasTableRowSelection) {
        this._setTableViewEvents();
      }
      
      // Since the table view is rendered after data is fetched, we must enable the empty view text
      // Otherwise it would stay disabled
      this.tableView.enableEmptyViewText();
      this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
        this.triggerMethod('execute:defaultAction', node);
      });
      // Set proper tab indexes (that in case of expanding the view the focus is set)
      this.listenTo(this.tableView, 'render', function () {
        this.tableView.triggerMethod('refresh:tabindexes');
      });

      // Set pagination
      self.paginationView = new PaginationView({
        collection: collection,
        pageSize: self.options.data.pageSize
      });

      // Set focus to name column
      if (!_.isUndefined(self.tableView.accFocusedState.body.column)) {
        self.tableView.accFocusedState.body.column = 1;
      }

      self.tableRegion.show(self.tableView);
      self.paginationRegion.show(self.paginationView);
    },

    _beforeExecuteCommand: function (toolbarActionContext) {

      var self = this;
      // Show the busy indicator for commands or toolbar items that request it.
      // Also provide a switch to the command in the command status, so it can hide it, if needed.
      if (toolbarActionContext.command && toolbarActionContext.command.get("showBusy") ||
          toolbarActionContext.status.toolItem && toolbarActionContext.status.toolItem.get("showBusy")) {
          toolbarActionContext.status.busyIndicator = new BusyIndicator(
          function(){ self.blockActions(); },
          function(){ self.unblockActions(); }
        );
        toolbarActionContext.status.busyIndicator.on();
      }

      switch (toolbarActionContext.commandSignature) {
        case 'CloseExpandedView':
          this.context.trigger("close:expanded", {widgetView: this});
          break;
      }

    },

    _toolbarActionTriggered: function (toolbarActionContext) {
      // switch off the busy indicator.
      if (toolbarActionContext.status.busyIndicator) {
        toolbarActionContext.status.busyIndicator.off();
      }
    },

    /**
     * this method initializes for all items selection process across pages.
     */
    initAllSelection: function () {
      this.allSelectedNodes = this.getCollectionWithSpecificModelId();

      this.listenTo(this.allSelectedNodes, 'remove', this.removeItemToAllSelectedItems)
          .listenTo(this.allSelectedNodes, 'add', this.addItemToAllSelectedItems)
          .listenTo(this.allSelectedNodes, 'reset', this.resetAllSelectedItems);
    },

    /**
     * this method return the node from collection based on modelId, if collection doesn't
     * have modelId or idAttribute then default check takes place.
     *
     * @param collection
     * @param node
     * @returns {}
     */
    findNodeFromCollection: function (collection, node) {
      return collection.get(node) || collection.findWhere({id: node.get('id')});
    },

    /**
     * This method creates a new Backbone collection and set's modelId, and if any other module
     * or in any other view which extends nodestable.view can override it if they do have unique
     * model id is other than default "id".
     *
     * @returns {*}
     */
    getCollectionWithSpecificModelId: function () {
      var MultiSelectCollection = Backbone.Collection.extend({
            modelId: function (attr) {
              return attr.id;
            }
          }),
          allSelectedCollection = new MultiSelectCollection();
          if (this.collection && this.collection.modelId) {
            allSelectedCollection.modelId = this.collection.modelId;
          }
      return allSelectedCollection;
    },

    /**
     * this method removes specific item from all selection.
     *
     * @param node
     */
    removeItemToAllSelectedItems: function (node) {
      var model = this.findNodeFromCollection(this.collection, node);   //  collection.get(node);
      if (model) {
        model.set('csuiIsSelected', false); // will be ignored if already false
      } else {
        // update the node itself when unselect the node from different page
        node.set('csuiIsSelected', false);
      }
    },

    /**
     * this method adds new item to all selected items.
     *
     * @param node
     */
    addItemToAllSelectedItems: function (node) {
      var model = this.findNodeFromCollection(this.collection, node);
      if (model) {
        model.set('csuiIsSelected', true); // will be ignored if already true
      } else {
        // update the node itself when select the node from different page
        node.set('csuiIsSelected', true);
      }
    },

    /**
     * this method resets all selected item's collection.
     */
    resetAllSelectedItems: function () {
      var allSelectedNodes = this.allSelectedNodes;
      this.collection.each(_.bind(function (node) {
        var selectedNode = allSelectedNodes.get(node);
        node.set('csuiIsSelected', selectedNode !== undefined);// setting to same value is ignored
      }, this));
    },

    _setTableViewEvents: function () {
      this.listenTo(this.tableView, 'tableRowSelected', function (args) {
        this.tableView.cancelAnyExistingInlineForm.call(this.tableView);
        if (this.options.showSelectColumn && this.allSelectedNodes) {
          var selectedNodes  = args.nodes,
              selectedModels = [];
          _.each(selectedNodes, function (selectedNode) {
            if (!this.allSelectedNodes.get(selectedNode) && selectedNode.get('id') !== undefined) {
              selectedModels.push(selectedNode);
            }
          }, this);
          this.allSelectedNodes.reset(selectedModels.concat(this.allSelectedNodes.models));
        }
      });

      this.listenTo(this.tableView, 'tableRowUnselected', function (args) {
        if (this.options.showSelectColumn && this.allSelectedNodes) {
          var unselectedNodes = args.nodes;
          _.each(unselectedNodes, function (unselectedNode) {
            this.allSelectedNodes.remove(unselectedNode,{silent:true});
          }, this);
          this.allSelectedNodes.reset(_.clone(this.allSelectedNodes.models));
        }
      });

      return true;
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      // listen for change of the selected nodes collection and if at least one is
      // selected, display the table-row-selected-toolbar and hide the table-toolbar
      this.listenTo(this.allSelectedNodes, 'reset update', function () {
        if (!this._tableRowSelectionToolbarView.isDestroyed) {
          this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        }
        this._onSelectionUpdateCssClasses(this.allSelectedNodes.length);
      });

    },

    _setToolBar: function () {
      // toolbarItems is an object with several TooItemFactories in it (for each toolbar one)
      var titleNodeModel = new NodeModel({
        "type": this.collection.node.get("type"),
        "type_name": this.collection.node.get("type_name"),
        "parent_id": this.collection.node.get("parent_id"),
        "image_url" : this.collection.titleIcon,
        "name": this.options.title
      }, {
        connector: this.collection.connector
      });
      this.tableToolbarView = new TableToolbarView({
        context: this.options.context,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        headermenuItems: this.options.headermenuItems,
        headermenuItemsMask: this.options.headermenuItemsMask,
        creationToolItemsMask: this.options.creationToolItemsMask,
        container: titleNodeModel,//this.container,//
        collection: this.collection,
        originatingView: this,
        blockingParentView: this.options.blockingParentView || this,
        addableTypes: this.addableTypes,
        toolbarCommandController: this.commandController
      });
      this.tableToolbarView.captionView.nameView.readonly = true;

      this.listenTo(this.collection,"sync", function() {
        if (this.collection.titleIcon!==titleNodeModel.get("image_url")) {
          titleNodeModel.set("image_url",this.collection.titleIcon);
        }
      });

      return true;
    },

    _setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        showSelectionCounter: options.showSelectionCounter,
        commands: this.defaultActionController.commands,
        selectedChildren: this.allSelectedNodes,
        container: this.collection.node,
        context: this.context,
        originatingView: this,
        collection: this.collection,
        scrollableParent: '.csui-table-tableview .csui-nodetable'
      });

      // hide/show the condensed header
      var toolbarView = this._tableRowSelectionToolbarView;
      this.listenTo(toolbarView, 'toggle:condensed:header', function () {
        // only show/hide the condensed header when in row selection mode
        if (this.$el && this.$el.hasClass('conws-table-rowselection-toolbar-visible')) {
          var showingBothToolbars = !this.$el.hasClass('csui-show-header');
          this.$el.addClass('csui-transitioning');
          this.tableToolbarRegion.$el.one('transitionend', function () {
            this.$el.removeClass('csui-transitioning');
            if (!showingBothToolbars) {
              this.tableToolbarRegion.$el.addClass('binf-hidden');
            }
          }.bind(this));

          if (showingBothToolbars) {
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView, 'dom:refresh');
          }

          this.$el && this.$el.toggleClass('csui-show-header');

          // let the right toolbar know to update its attributes
          toolbarView.trigger('toolbar:activity', true, showingBothToolbars);
        }
      });
    },

    _triggerToolbarActivityEvent: function (toolbarVisible, headerVisible) {
      // let the right toolbar know to update its attributes
      var toolbarView = this._tableRowSelectionToolbarView;
      toolbarView.trigger('toolbar:activity', toolbarVisible, headerVisible);
    },

    _onSelectionUpdateCssClasses: function (selectionLength) {
      var self = this;
      var $rowSelectionToolbarEl = this.tableRowSelectionToolbarRegion.$el;

      function transitionEnd(headerVisible) {
        // let the right toolbar know to update its attributes
        self.$el.removeClass('csui-transitioning');
        self._triggerToolbarActivityEvent(self._tableRowSelectionToolbarVisible, headerVisible);
        if (self._tableRowSelectionToolbarVisible) {
          if (!headerVisible) {
            // hide table toolbar completely so that screenreader does not see it
            self.tableToolbarRegion.$el.addClass('binf-hidden');
          }
        } else {
          self.tableRowSelectionToolbarRegion.$el.addClass('binf-hidden');
        }
      }

      var headerVisible;
      if (accessibleTable) {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;
            // make tableToolbar invisible
            //  and rowSelectionToolbar visible

            this.$el.addClass('csui-transitioning');
            
            // this lets the rowSelectionToolbar appear
            $rowSelectionToolbarEl.removeClass('binf-hidden');
            // and also the tableToolbar disappear
            this.$el.addClass('conws-table-rowselection-toolbar-visible');

            // it could be that both toolbars should be visible
            headerVisible = this.$el && this.$el.hasClass('csui-show-header');

            transitionEnd(headerVisible);
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            // make tableToolbar visible
            //  and rowSelectionToolbar invisible

            this.$el.addClass('csui-transitioning');
            
            // without the rowSelectionToolbar, it is not necessary to have height for both toolbars
            this.$el && this.$el.removeClass('csui-show-header');

            // this lets the tableToolbar appear
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
              'dom:refresh');

            // this lets the rowSelectionToolbar disappear and the tableToolbar appear
            this.$el.removeClass('conws-table-rowselection-toolbar-visible');

            transitionEnd(false);
          }
        }
      } else {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {

            this.$el.addClass('csui-transitioning');

            this._tableRowSelectionToolbarVisible = true;
            // make tableToolbar invisible
            //  and rowSelectionToolbar visible

            headerVisible = this.$el && this.$el.hasClass('csui-show-header');

            // this will start the transition on height of rowSelectionToolbar from 0 to full
            // height, which smoothly lets the rowSelectionToolbar appear
            $rowSelectionToolbarEl
              .removeClass('binf-hidden').redraw()
              .one('transitionend', function () {
                transitionEnd(headerVisible);
              }.bind(this));

            // this will start the transition on height of tableToolbar to 0, which finally lets
            // the tableToolbar disappear
            this.$el.addClass('conws-table-rowselection-toolbar-visible');
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            // make tableToolbar visible
            //  and rowSelectionToolbar invisible

            this.$el.addClass('csui-transitioning');
            
            // without the rowSelectionToolbar, it is not necessary to have height for both toolbars
            this.$el && this.$el.removeClass('csui-show-header');

            this.tableToolbarRegion.$el.removeClass('binf-hidden').redraw();
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');

            $rowSelectionToolbarEl
                .one('transitionend', function () {
                  transitionEnd(false);
                }.bind(this));

            // this will start the transition on height of tableToolbar from 0 to full
            // height, which smoothly lets the tableToolbar appear
            this.$el.removeClass('conws-table-rowselection-toolbar-visible');
          }
        }
      }
    },

    /**
     * Return custom columns from configuration
     */
    _getCustomColumns: function (showError) {
      var customColumns = [], errors = [];
      if (this.options &&
          this.options.data &&
          this.options.data.expandedView &&
          this.options.data.expandedView.customColumns) {
        var unknownError = false;
        var seqnr = 500;
        this.options.data.expandedView.customColumns.forEach(function (cc) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(cc.key);
          if (match) {
            customColumns.push(_.defaults({key:match[1],sequence:seqnr++},cc));
          } else {
            if (showError) {
              if (cc.key && cc.key.indexOf("{")>=0) {
                // if we have an error, but braces exist. we don't know what's wrong
                unknownError = true;
                log.error(lang.errorCustomColumnConfigInvalid, cc.key) && console.log(log.last);
              } else {
                log.error(lang.errorCustomColumnMissingBraces, cc.key) && console.log(log.last);
              }
              errors.push(cc.key)
            }
          }
        });
        if (showError && errors.length>0) {
          var errfmt = unknownError ? lang.errorCustomColumnConfigInvalid : lang.errorCustomColumnMissingBraces;
          ModalAlert.showError(_.str.sformat(errfmt, errors.join(", ")));
        }
      }
      return customColumns;
    },

    /**
     * Return the identifiers of the custom columns as array
     */
    _getCustomColumnKeys: function () {
      var columns = this._getCustomColumns();
      return columns.length > 0 ? $.map(columns, function (val, i) {
        return val.key
      }) : [];
    },

    /**
     * Return the identifiers of the core columns as array
     */
    _getCoreColumnKeys: function () {
      var columns = WorkspacesColumns.models;
      return columns.length > 0 ? $.map(columns, function (val, i) {
        return val.get("key");
      }) : [];
    },

    /**
     * Return fields that have to be fetched from server via rest call
     */
    getColumnsToFetch: function () {
      var columns         = this._getCustomColumnKeys(),
          coreColumns     = this._getCoreColumnKeys(),
          // Columns needed for ui to be fetched even in case not displayed
          requiredColumns = ["id", "type", "container"];

      // Merge columns
      _.each(coreColumns, function (coreColumn) {
        if ($.inArray(coreColumn, columns) < 0) {
          columns.push(coreColumn);
        }
      });
      _.each(requiredColumns, function (requiredColumn) {
        if ($.inArray(requiredColumn, columns) < 0) {
          columns.push(requiredColumn);
        }
      });

      return columns.toString()
    },

    //Dom refresh currently only needed for the Pagination view. When a refresh is called
    //on the tabelView, it causes the table to constantly expand its length without cause.
    windowRefresh: function () {
      // Window resizing can be triggered between the constructor and rendering;
      // sub-views of this view are not created before the min view is rendered
      if (this.paginationView) {
        this.paginationView.triggerMethod('dom:refresh');
      }
    },

    // bubble to regions
    onDomRefresh: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.trigger('dom:refresh');
        }
      });
    },

    // Needed for scroll bar to work
    onShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.trigger('show');
        }
      });
    },

    // Needed to resize for custom columns
    onAfterShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('after:show');
        }
      });
    }
  });

  return WorkspacesTableView;
});


csui.define('css!conws/widgets/relatedworkspaces/impl/relatedworkspacestable',[],function(){});
csui.define('conws/widgets/relatedworkspaces/impl/relatedworkspacestable.view',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/utils/log",
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/relatedworkspaces/commands',
  'conws/widgets/relatedworkspaces/toolbaritems',
  'conws/widgets/relatedworkspaces/toolbaritems.masks',
  'conws/widgets/relatedworkspaces/headermenuitems',
  'conws/widgets/relatedworkspaces/headermenuitems.masks',
  'conws/utils/workspaces/impl/workspaceutil',
  'conws/utils/workspaces/workspacestable.view',
  'css!conws/widgets/relatedworkspaces/impl/relatedworkspacestable'
], function (module, $, _, Backbone,
    Marionette, log,
    WorkspaceContextFactory,
    HeaderModelFactory,
    commands,
    toolbarItems,
    ToolbarItemsMasks,
    headermenuItems,
    HeaderMenuItemsMasks,
    workspaceUtil, WorkspacesTableView) {

  var RelatedWorkspacesTableView = WorkspacesTableView.extend({

    constructor: function RelatedWorkspacesTableView(options) {

      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(HeaderModelFactory);
      }

      WorkspacesTableView.prototype.constructor.apply(this, arguments);

      // get the model from the model factory
      this.collection.workspace = options.workspaceContext.getModel(HeaderModelFactory);
      // opening the expanded view is done long after navigation.
      // so we fetch header model, to have data up to date.
      this.collection.workspace.fetch();
      this.listenTo(this.collection.workspace,"sync",function() {
        // when the model containing the actions changes, refresh the add toolbar.
        if (this.tableToolbarView && this.tableToolbarView.addToolbarView) {
          this.tableToolbarView.addToolbarView.collection.refilter();
        }
      });
    },

    initialize: function() {
      this.options.commands = commands;
      this.options.hasTableRowSelection = true;
      this.options.toolbarItems = toolbarItems;
      this.options.toolbarItemsMasks = new ToolbarItemsMasks();
      this.options.headermenuItems = headermenuItems;
      this.options.headermenuItemsMasks = new HeaderMenuItemsMasks();
      WorkspacesTableView.prototype.initialize.apply(this, arguments);
    },

    onRender: function () {
      var collection = this.collection;

      // Set order if passed as configuration, otherwise use default
      if (!_.isUndefined(this.collection.options.relatedWorkspaces.attributes.sortExpanded)) {
        collection.orderBy = this.collection.options.relatedWorkspaces.attributes.sortExpanded;
      } else {
        collection.orderBy = workspaceUtil.orderByAsString(this.options.data.orderBy);
      }

      this.doRender(collection);
    },

    _getCollectionUrlQuery: function () {

      var query = {where_relationtype: this.options.data.relationType};

      // only fetch specific properties for table view
      query.fields = encodeURIComponent("properties{" + this.getColumnsToFetch() + "}");
      query.action = "properties-properties";

      // Fetch users expanded, to show name
      query.expand_users = "true";

      return query;
    },

    _beforeExecuteCommand: function (toolbarActionContext) {
      WorkspacesTableView.prototype._beforeExecuteCommand.apply(this, arguments);
    },

    _toolbarActionTriggered: function (toolbarActionContext) {
      WorkspacesTableView.prototype._toolbarActionTriggered.apply(this, arguments);
      if (!toolbarActionContext || toolbarActionContext.cancelled) {
         // command was cancelled
         return;
       }
  
      var view = this;
      var newNodes;
      
      switch (toolbarActionContext.commandSignature) {
        case 'AddRelation':

          // indicate, that view has changed data.
          view.changed = true;

          newNodes = toolbarActionContext.newNodes;
          if (newNodes && newNodes.length>0) {

            // prepare all new nodes on top of the view, marked as new (green) rows.
            newNodes.forEach(function(newNode){
              newNode.isLocallyCreated = true;
              newNode.attributes && delete newNode.attributes.csuiIsSelected;
              newNode.collection = view.collection;
              newNode.selectable = true;
            });

            // to update pagination, currently no other chance (discussed with cs.core.ui team)
            // than to set totalCount directly followed by a reset.
            this.collection.totalCount = this.collection.totalCount + newNodes.length;

            // add all new nodes on top, but not more than page size.
            if (newNodes.length>this.collection.topCount) {
              newNodes = newNodes.slice(0,this.collection.topCount);
            } else if (newNodes.length<this.collection.topCount) {
              newNodes = newNodes.concat(this.collection.slice(0,this.collection.topCount-newNodes.length));
            }
            this.collection.updateSelectableState(newNodes);
            var showSelectColumn = !!(this.options.showSelectColumn && this.collection.existsSelectable);
            if (this.tableView && this.tableView.options && this.tableView.options.selectColumn!==showSelectColumn) {
              // in this case check box column has to appear.
              this.tableView.options.selectColumn = showSelectColumn;
              this.collection.reset(newNodes,{silent:true});
              this.collection.columns.trigger('reset',this.collection.columns);
              this.tableView.resetScrollToTop();
              this.paginationView && this.paginationView.collectionChange();
            } else {
              // in this case check box column is already there.
              this.collection.reset(newNodes);
              this.tableView && this.tableView.resetScrollToTop();
            }
          }
          break;

        case 'RemoveRelation':
          // TODO: keep selected nodes as good as possible
          // after partial deletion (and error during a previous deletion).

          // indicate, that view has changed data.
          this.changed = true;
          
          this.collection.fetch().then(function(){
            if (view.collection.totalCount<=view.collection.skipCount) {
              // We are positioned beyond the last page. Thus, an empty table is displayed.
              if (view.collection.totalCount>0) {
                // But we have a non-empty collection.
                if (view.collection.totalCount<=view.collection.topCount) {
                  // And we have only one page. Thus, no paging buttons are there.
                  // We help the user to get a result by automatically fetching the first page.
                  view.collection.skipCount = 0;
                  view.collection.fetch();
                }
                // If totalCount>topCount, we have more than one page and paging buttons
                // are displayed. Thus, the user can navigate to a result accessing the buttons.
              }
            }
          });
          this.allSelectedNodes.reset([]);
          break;
      }
    }

  });

  return RelatedWorkspacesTableView;
});

// Shows a list of workspaces related to the current one
csui.define('conws/widgets/relatedworkspaces/relatedworkspaces.view',['csui/lib/marionette', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/jquery','csui/utils/log',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/utils/workspaces/workspaces.view',
  'conws/widgets/relatedworkspaces/impl/relateditem.view',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.factory',
  'conws/widgets/relatedworkspaces/impl/relatedworkspacestable.view',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/base',
  'conws/utils/workspaces/impl/workspaceutil',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/lang',
  'css!conws/utils/icons/icons',
  'hbs!conws/widgets/relatedworkspaces/impl/relateditem',
  'css!conws/widgets/relatedworkspaces/impl/relateditem'
], function (Marionette, module, _, Backbone, $, log,
    WorkspaceContextFactory,
    WorkspacesView,
    RelatedItemView,
    RelatedWorkspacesCollectionFactory,
    RelatedWorkspacesTableView,
    ModalAlert,
    BaseUtils,
    workspaceUtil,
    langWksp,
    lang) {

  var RelatedWorkspacesView = WorkspacesView.extend({

    constructor: function RelatedWorkspacesView(options) {
      this.viewClassName = 'conws-relatedworkspaces';

      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(RelatedWorkspacesCollectionFactory);
      }

      WorkspacesView.prototype.constructor.apply(this, arguments);

      // Show expand icon always
      this.limit = -1;

      if (this.options &&
          this.options.data &&
          this.options.data.collapsedView &&
          this.options.data.collapsedView.orderBy) {
        if (_.isString(this.options.data.collapsedView.orderBy)) {
          log.error(langWksp.errorOrderByMustNotBeString) && console.log(log.last);
          ModalAlert.showError(langWksp.errorOrderByMustNotBeString);
        } else if (this.options.data.collapsedView.orderBy.sortColumn) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(this.options.data.collapsedView.orderBy.sortColumn);
          if (!match) {
            log.error(langWksp.errorOrderByMissingBraces) && console.log(log.last);
            ModalAlert.showError(langWksp.errorOrderByMissingBraces);
          }
        }
      }

      if (this.options &&
          this.options.data &&
          this.options.data.collapsedView) {
        var errors = [], that = this;
        [ "title", "description", "topRight", "bottomLeft", "bottomRight"].forEach(function (n) {
          if (that.options.data.collapsedView[n] && that.options.data.collapsedView[n].format) {
            errors.push(n);
          }
        });
        if (errors.length>0) {
          ModalAlert.showError(_.str.sformat(lang.errorFieldFormatTagUnrecognized, errors.join(", ")));
        }
      }

    },

    getContext: function () {
      return this.options.workspaceContext;
    },

    childView: RelatedItemView,

    childViewOptions: function () {
      return {context: this.options.context, data: this.options.data.collapsedView};
    },

    emptyViewOptions: {
      templateHelpers: function () {
        return {
          text: this._parent._getNoResultsPlaceholder()
        };
      }
    },

    workspacesCollectionFactory: RelatedWorkspacesCollectionFactory,
    workspacesTableView: RelatedWorkspacesTableView,
    dialogClassName: 'relatedworkspaces',
    lang: lang,

    _getExpandedViewOptions: function() {
      var options = _.extend( WorkspacesView.prototype._getExpandedViewOptions.apply(this, arguments),{
        title: this._getTitle()
      });
      return options;
    },
  
    // Attributes identify collection/models for widget
    // In case two widgets has returns same attributes here, they share the collection!!
    _getCollectionAttributes: function () {
      var attributes = {
        workspaceTypeId: this.options.data.workspaceTypeId,
        relationType: this.options.data.relationType,
        sortExpanded: this.options.data.expandedView && workspaceUtil.orderByAsString(this.options.data.expandedView.orderBy) ||
                      undefined,
        sortCollapsed: this.options.data.collapsedView && workspaceUtil.orderByAsString(this.options.data.collapsedView.orderBy) ||
                       this._getDefaultSortOrder() || undefined,
        title:  BaseUtils.getClosestLocalizedString(this.options.data.title, lang.dialogTitle)
      };
      return attributes;
    },

    // Get the default sort order in case no sort order is defined
    _getDefaultSortOrder: function () {
      return this._getFilterPropertyName() ? this._getFilterPropertyName() + ' asc' : undefined;
    },

    _getCollectionUrlQuery: function () {
      var options                 = this.options,
          query                   = {},
          customPropertiesToFetch = this._getPropertiesToFetch(options.data.collapsedView),
          propertiesToFetch       = ["id", "container", "name", "type"];

      // Only fetch properties needed
      propertiesToFetch = _.union(propertiesToFetch, customPropertiesToFetch);
      query.fields = encodeURIComponent("properties{" + propertiesToFetch.join(",") + "}");
      query.action = "properties-properties";

      query.where_workspace_type_id = options.data.workspaceTypeId;
      query.where_relationtype = options.data.relationType;
      var orderByAsString;
      if (options.data.collapsedView) {
        orderByAsString = workspaceUtil.orderByAsString(options.data.collapsedView.orderBy);
      }
      if (!orderByAsString) {
        orderByAsString = this._getDefaultSortOrder();
      }
      if (orderByAsString) {
        query.sort = orderByAsString;
      }

      // Fetch users expanded, to show name
      query.expand_users = "true";

      return query;
    },

    // get first placeholder from string with mix of column references and free text.
    _getFirstPlaceholder: function (expression) {
      var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g,
          match, propertyName, placeholder, result;
      // Go over every parameter placeholder found
      // Don't change expression while doing this, because exec remembers position of last matches
      while ((match = parameterPlaceholder.exec(expression))) {
        placeholder = match[0];
        propertyName = match[1];
        if (propertyName) {
          result = match;
          break;
        }
      }
      return result;
    },

    // Get property name to use for filtering
    _getFilterPropertyName: function () {
      var propertyName;
      if (this.options && this.options.data && this.options.data.collapsedView &&
          this.options.data.collapsedView.title && this.options.data.collapsedView.title.value) {
        var placeHolder = this._getFirstPlaceholder(this.options.data.collapsedView.title.value);
        if (placeHolder) {
          propertyName = placeHolder[1];
        }
      }
      return propertyName;
    },

    // Get all properties that should be fetched from server
    _getConfiguredProperties: function (object) {
      var properties = {}, regex = /{([^:}]+)(:([^}]+))?}/g, match;
      var recurse = function (object) {
        if (typeof object !== 'object') {
          while ((match = regex.exec(object))) {
            properties[match[1]] = "";
          }
        } else {
          $.each(object, function (key, value) {
            recurse(value);
          });
        }
      };
      recurse(object);
      return properties;
    },

    // Get custom properties that should be fetched from server
    _getPropertiesToFetch: function (object) {
      var properties = this._getConfiguredProperties(object);
      return Object.keys(properties);
    },

    // return the jQuery list item element by index for keyboard navigation use
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var $item = this.$(_.str.sformat('.conws-relateditem-object:nth-child({0}) .conws-relateditem-border', index + 1));
      return this.$($item[0]);
    }

  });

  return RelatedWorkspacesView;

});

// Lists explicit locale mappings and fallbacks

csui.define('conws/widgets/header/impl/nls/header.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


// Defines localizable strings in the default language (English)

csui.define('conws/widgets/header/impl/nls/root/header.lang',{
  changeIconDialogTitle: 'Change picture',
  changeIconDialogMessage: 'For best results, use square images. Use JPEG, PNG or GIF formats not larger than %1.',
  changeIconDialogBtnReset: 'Reset',
  changeIconDialogBtnResetTitle: 'Reset to configured icon',
  changeIconDialogBtnUpload: 'Change',
  changeIconDialogBtnUploadTitle: 'Change to individual icon',
  changeIconDialogBtnCancel: 'Cancel',
  changeIconDialogBtnCancelTitle: 'Cancel',
  changeIconDialogDefaultError: 'The image cannot be changed due to a server error.',
  chooseInpFileTitle: 'Choose file',
  iconMessage: 'Business Workspace Edit Icon',
  CollapsePageOverlay: "Close"
});



/* START_TEMPLATE */
csui.define('hbs!conws/widgets/header/impl/editicon',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "        <p class=\"reset\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.resetTitle || (depth0 != null ? depth0.resetTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"resetTitle","hash":{}}) : helper)))
    + "\"><a href=\"#\">"
    + this.escapeExpression(((helper = (helper = helpers.reset || (depth0 != null ? depth0.reset : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"reset","hash":{}}) : helper)))
    + "</a></p>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "        <button type=\"button\" class=\"binf-btn binf-btn-primary upload\"\r\n                title=\""
    + this.escapeExpression(((helper = (helper = helpers.uploadTitle || (depth0 != null ? depth0.uploadTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uploadTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.upload || (depth0 != null ? depth0.upload : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"upload","hash":{}}) : helper)))
    + "</button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"conws-popover\">\r\n  <div class='title'>"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</div>\r\n  <div class='message'>"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</div>\r\n  <div class=\"buttons\">\r\n    <div class=\"buttons binf-left\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.resetButton : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"buttons binf-right\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.uploadButton : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      <button type=\"button\" class=\"binf-btn binf-btn-default cancel\"\r\n              title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelTitle || (depth0 != null ? depth0.cancelTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "</button>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_header_impl_editicon', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/header/impl/editicon',[],function(){});
csui.define('conws/widgets/header/impl/editicon.view',[
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'i18n!conws/widgets/header/impl/nls/header.lang',
  'hbs!conws/widgets/header/impl/editicon',
  'css!conws/widgets/header/impl/editicon'
], function (require, _, $, Marionette, lang, template) {

  var EditIconView = Marionette.ItemView.extend({

    classname: 'conws-popover',

    template: template,

    triggers: {
      'click .reset > a': 'click:reset',
      'click .upload': 'click:upload',
      'click .cancel': 'click:cancel'
    },

    events: {
      'keydown': 'onKeyDown'
    },

    // initializes the 'EditIcon' view.
    constructor: function EditIconView(options) {
      // initialize options
      options || (options = {});
      options.title = options.title || lang.changeIconDialogTitle;
      options.message = options.message || lang.changeIconDialogMessage;
      options.resetButton = options.resetButton !== undefined ? options.resetButton : true;
      options.uploadButton = options.uploadButton !== undefined ? options.uploadButton : true;

      // prepare tabable elements list
      this.tabableElements = [];
      if ((_.isFunction(options.resetButton) && options.resetButton()) ||
          options.resetButton === true) {
        this.tabableElements.push('.reset > a');
      }
      this.tabableElements.push('.upload', '.cancel');

      // ensure initial focus
      var self = this;
      $('.conws-header-edit').on('shown.binf.popover', function () {
        // focus first element
        self._currentlyFocusedElement = self.tabableElements[0];
        self.$el.find(self._currentlyFocusedElement).focus();
        // detach event
        $('.conws-header-edit').off('shown.binf.popover');
      });

      // apply arguments
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    templateHelpers: function () {
      return {
        title: this.options.title,
        message: this.options.message,
        resetButton: this.options.resetButton,
        reset: lang.changeIconDialogBtnReset,
        resetTitle: lang.changeIconDialogBtnResetTitle,
        uploadButton: this.options.uploadButton,
        upload: lang.changeIconDialogBtnUpload,
        uploadTitle: lang.changeIconDialogBtnUploadTitle,
        cancel: lang.changeIconDialogBtnCancel,
        cancelTitle: lang.changeIconDialogBtnCancelTitle
      };
    },

    _focusNextElement: function (backwards) {
      // state
      var success = true;

      // get actual index
      var idx = _.indexOf(this.tabableElements, this._currentlyFocusedElement);

      // get next index
      if (!backwards) {
        if (++idx === this.tabableElements.length) {
          idx = 0;
        }
      } else {
        if (--idx < 0) {
          idx = this.tabableElements.length - 1;
        }
      }

      // get next element
      var next = this.tabableElements[idx];

      // get the element and check whether it is focusable
      var elem = this.$el.find(next);
      if ((elem.length === 1) && (elem.is(':visible'))) {
        // ... and focus
        this._currentlyFocusedElement = next;
        elem.focus();
      }

      // return state
      return success;
    },

    onKeyDown: function (e) {
      switch (e.keyCode) {
      case 9:
        // focus the next/previous element
        if (this._focusNextElement(e.shiftKey)) {
          // if successful stop propagation
          e.preventDefault();
          e.stopPropagation();
        }
        break;
      case 27:
        e.preventDefault();
        e.stopPropagation();
        // execute cancel.
        $('.cancel').click();
        break;
      }
    },

    onClick: function (action) {
      if (typeof this.options.callback === 'function') {
        this.options.callback(action);
      }
    },

    onClickReset: function (e) {
      this.onClick('reset');
    },

    onClickUpload: function (e) {
      this.onClick('upload');
    },

    onClickCancel: function (e) {
      this.onClick('cancel');
    }
  });

  return EditIconView;
});


csui.define('css!conws/widgets/header/impl/favorite.icon',[],function(){});
csui.define('conws/widgets/header/impl/favorite.icon.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/favorites/favorite.star.view',
  'css!conws/widgets/header/impl/favorite.icon'
], function (_, $, Marionette, TabableRegionBehavior, FavoriteStarView) {

  

  var FavoriteIconView = FavoriteStarView.extend({

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function FavoriteIconView(options) {
      FavoriteStarView.prototype.constructor.call(this, options);
    },

    // Needed for keyboard accessibility by TabableRegionBehavior
    currentlyFocusedElement: function () {
      // get favorite icon button tag
      return this.$el.find('button');
    },

    // We must override this to avoid that e.g. in case of press enter the browser navigates
    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space or enter key
        event.preventDefault();
        event.stopPropagation();
        this.enabled() && this.toggleFavorite();
      }
    }
  });

  return FavoriteIconView;

});

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/header/impl/commenting.icon',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"conws-comment-icon\"></div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_header_impl_commenting.icon', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/header/impl/commenting.icon',[],function(){});
csui.define('conws/widgets/header/impl/commenting.icon.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'esoc/widgets/utils/commentdialog/commentdialog.view',
  'hbs!conws/widgets/header/impl/commenting.icon',
  'css!conws/widgets/header/impl/commenting.icon'
], function (_, $, Marionette, TabableRegionBehavior, CommentDialogView, template) {

  

  var CommentingIconView = Marionette.LayoutView.extend({

    className: 'conws-comment-icon',

    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },

    constructor: function CommentingIconView(options) {
      // wire models and collections also to the base view
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    enabled: function () {
      var model = this.model,
        commenting = model.actions.findWhere({ signature: "comment" });

        return Boolean(commenting);
    },

    onRender: function () {
      // rendering the commenting icon
      var self = this;
      var contentRegion = new Marionette.Region({
        el: self.el
      });
      var globalConfig = (typeof window.require !== "undefined") ?
                         window.require.s.contexts._.config :
                         window.csui.require.s.contexts._.config;

      globalConfig.roId = self.model.get('id');

      var commentDialogView = new CommentDialogView({
        connector: self.model.connector,
        nodeid: self.model.get('id'),
        CSID: self.model.get('id'),
        context: self.options.context,
        useIconsForDarkBackground: this.options.useIconsForDarkBackground
      })
      contentRegion.show(commentDialogView);

      this.commentCount = this.model.get('wnd_comments');
      if(this.commentCount && this.commentCount > 0) {
        this.$el.addClass('conws-has-comments');
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        e.stopPropagation();
        // click link
        this.currentlyFocusedElement().click();
      }
    },

    currentlyFocusedElement: function () {
      // get comment icon link tag
      return this.$el.find('a');
    }
  });

  return CommentingIconView;

});


csui.define('conws/widgets/header/impl/headertoolbaritems',['module',
  'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'conws/widgets/header/impl/favorite.icon.view',
  'conws/widgets/header/impl/commenting.icon.view',
  'csui-ext!conws/widgets/header/headertoolbaritems'
], function (module, _, ToolItemsFactory, ToolItemModel, Lang, FavoriteIconView, CommentingIconView, extraToolItems) {

  var headerToolbarItems = {

    rightToolbar: new ToolItemsFactory({
      main: [
        {
          signature: "Comment",
          name: Lang.ToolbarItemComment,
          icon: "icon icon-socialComment",
		  enabled: true,
          className: "esoc-socialactions-comment",
          customView: true,
		  viewClass: CommentingIconView,
          commandData: { useContainer: true },
          index: 4 // Leaving first three positions for extensions
        },
        {
          signature: "Favorite2",
          enabled: true,
          viewClass: FavoriteIconView,
          customView: true,
          commandData: { useContainer: true },
          index: 5
        }
      ]
    }),

    delayedActionsToolbar: new ToolItemsFactory({
      menu: [
        {
          signature: "CopyLink",
          name: Lang.ToolbarItemCopyLink
        },
        {
          signature: "Share",
          name: Lang.ToolbarItemShare
        }
      ]
    },
      {
        maxItemsShown: 0,
        dropDownIcon: "icon icon-toolbar-more",
        addGroupSeparators: false,
        dropDownText: Lang.ToolbarItemMore,
        customView: true
      })

  };

  if (!!extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = headerToolbarItems[key];
        if (!!targetToolbar) {
          _.each(toolItems, function (toolItem) {
            toolItem = new ToolItemModel(toolItem);
            targetToolbar.addItem(toolItem);
          });
        }
      });
    });
  }

  headerToolbarItems['rightToolbar'].collection.comparator = function (model) {
    return model.get('index');
  }
  headerToolbarItems['rightToolbar'].collection.sort();

  return headerToolbarItems;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/header/impl/headertoolbar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "      <div class=\"conws-rightToolbar\" ></div>   \r\n      <div class=\"conws-delayedActionsToolbar\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"conws-tabletoolbar tile-nav\" aria-label=\"Table menubar\" role=\"menu\">\r\n   \r\n   <div class=\"conws-header-status-indicators-section\">\r\n      <div class=\"conws-header-status-indicators\">        \r\n      </div>\r\n      <div class=\"conws-header-status-toolbar-divider\"></div>\r\n   </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasToolbarView : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      <div class=\"conws-header-collapse\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_header_impl_headertoolbar', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/header/impl/collapse/collapse',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-collapse "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" role=\"button\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>";
}});
Handlebars.registerPartial('conws_widgets_header_impl_collapse_collapse', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/header/impl/collapse/collapse',[],function(){});
csui.define('conws/widgets/header/impl/collapse/collapse.page.overlay',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!conws/widgets/header/impl/collapse/collapse',
  'i18n!conws/widgets/header/impl/nls/header.lang',
  'css!conws/widgets/header/impl/collapse/collapse'
], function ($, _, Marionette, template, lang) {
  

  var CollapseView = Marionette.ItemView.extend({

    className: 'conws-collapse',

    template: template,

    events: {
      'keydown': 'onKeyInView',
      'click': '_executeCollapse'
    },

    constructor: function CollapseView(options) {
      this.options = options || {};
      this.options.title = lang.CollapsePageOverlay;
      this.options.icon = "icon conws-collapse-icon";
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    //The template helpers are used to provide placeholders
    // for the widget
    templateHelpers: function () {
      var obj = {
        title: this.options.title,
        icon: this.options.icon
      };
      return obj;
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13 || event.keyCode === 32) {  // enter(13) and space(32)
        this._executeCollapse(event);
      }
    },

    _executeCollapse: function (e) {
      var parent = window.opener ? window.opener :
                   window !== window.parent ? window.parent : undefined
      if (parent) {
        //Modal dialog invoking the page that contains header widget listens for this event and closes itself
        // when full page view is opened from folderbrowse, folderbrowse's origin (integration system) need not necessarily be same as full page view's origin (CS).
        // So setting the targetOrigin to "*" as we dont have access to the parent origin
        parent.postMessage({"status": "closeDialog"}, "*");
      }
    }
  });
  return CollapseView;
});

csui.define('css!conws/widgets/header/impl/headertoolbar',[],function(){});
csui.define('conws/widgets/header/impl/headertoolbar.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!conws/widgets/header/impl/headertoolbar',
  'conws/controls/lazyactions/lazyToolbar.view',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/utils/commands',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/models/nodes',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/widgets/header/impl/collapse/collapse.page.overlay',
  'css!conws/widgets/header/impl/headertoolbar'
], function ($, _, Backbone, Marionette, template, LazyToolbarView, ToolbarView,
    FilteredToolItemsCollection, commands, ToolbarCommandController, NodeCollection,
    LayoutViewEventsPropagationMixin, CollapseView) {
  

  var HeaderToolbarView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      statusIndicatorsRegion: '.conws-header-status-indicators',
      dividerRegion: '.conws-header-status-toolbar-divider',
      toolbarRegion: '.conws-rightToolbar',
      delayedActionsToolbarRegion: '.conws-delayedActionsToolbar',
      collapseRegion: '.conws-header-collapse'
    },

    ui: {
      toolbarRegion: '.conws-rightToolbar',
      delayedActionsToolbarRegion: '.conws-delayedActionsToolbar',
      statusIndicatorsRegion: '.conws-header-status-indicators',
      dividerRegion: '.conws-header-status-toolbar-divider',
      collapseRegion: '.conws-header-collapse'
    },

    templateHelpers: function () {
      var obj = {
        hasToolbarView: !this.options.hideToolbar
      };
      return obj;
    },

    constructor: function HeaderToolbarView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    initialize: function (options) {

      if (!options.hideToolbar) {
        var toolbarItems = options.toolbarItems;
        var toolItemsMask = options.toolbarItemsMasks;
        var node = options.node;
        var selectedNodes = new NodeCollection(node);
        selectedNodes.connector = node.connector;

        this.commandController = new ToolbarCommandController({
          commands: options.commands || commands
        });

        this.commonToolbarOptions = {
          originatingView: options.originatingView,
          context: options.context,
          toolbarCommandController: this.commandController,
          container: options.container,
          useIconsForDarkBackground: options.useIconsForDarkBackground
        };

        var rightToolbarItems = toolbarItems ? toolbarItems.rightToolbar : undefined
        var rightToolbarMask = toolItemsMask ? toolItemsMask.toolbars.rightToolbar : undefined
        this._righttoolbarView = this._setToolbarView(node.clone(), rightToolbarItems,
            rightToolbarMask, false,
            toolbarItems.rightToolbar.options);

        var delayedActionsToolbarItems = toolbarItems ? toolbarItems.delayedActionsToolbar :
                                         undefined
        var delayedActionsToolbarMask = toolItemsMask ?
                                        toolItemsMask.toolbars.delayedActionsToolbar : undefined
        this._delayedActionsToolbarView = this._setToolbarView(node, delayedActionsToolbarItems,
            delayedActionsToolbarMask,
            true, toolbarItems.delayedActionsToolbar.options);
      }

      if (options.statusIndicatorsView && options.statusIndicatorsViewOptions) {
        this._statusIndicatorsView = new options.statusIndicatorsView(
            options.statusIndicatorsViewOptions);
      }

      if (options.enableCollapse) {
        this._collapseView = new CollapseView();
      }

      if (options.originatingView) {
        this.listenTo(options.originatingView, 'adjust:toolbar', this.adjustToolbar);
      }

      this.listenTo(this, 'dom:refresh', this._DomRefresh);
      this.listenTo(this, "status:indicator:available", this.showDivider);

      if (this._delayedActionsToolbarView) {
        this.listenTo(this._delayedActionsToolbarView, 'render', this._DomRefresh);
      }
    },

    onRender: function () {
      this.delegateEvents();
      if (this._statusIndicatorsView) {
        this.statusIndicatorsRegion.show(this._statusIndicatorsView);
      }
      if (this._righttoolbarView) {
        this.toolbarRegion.show(this._righttoolbarView);
      }
      if (this._delayedActionsToolbarView) {
        this.delayedActionsToolbarRegion.show(this._delayedActionsToolbarView);
      }
      if (this._collapseView) {
        this.collapseRegion.show(this._collapseView);
      }
      if (this._showDivider) {
        this.ui.dividerRegion.addClass('divider-show');
      }
    },

    _setToolbarView: function (node, toolbarItems, toolbarMask, delayed, toolOptions) {
      var nodes = new NodeCollection(node);
      nodes.connector = node.connector;

      var status = _.extend(this.commonToolbarOptions, {
        nodes: nodes
      });

      var filteredCollection = new FilteredToolItemsCollection(
          toolbarItems, {
            status: status,
            commands: this.commandController.commands,
            mask: toolbarMask
          });

      var toolbarViewClass = delayed ? LazyToolbarView : ToolbarView;

      var toolbarView = new toolbarViewClass(_.extend({
        collection: filteredCollection
      }, this.commonToolbarOptions, toolOptions));

      return toolbarView;
    },

    showDivider: function () {
      if (this._collapseView || !this.options.hideToolbar) {
        this._showDivider = true;
        this.ui.dividerRegion.addClass('divider-show');
      }
    },

    onDestroy: function () {

      if (this._statusIndicatorsView) {
        this._statusIndicatorsView.destroy();
      }
      if (this._righttoolbarView) {
        this._righttoolbarView.destroy();
      }
      if (this._delayedActionsToolbarView) {
        this._delayedActionsToolbarView.destroy();
      }
      if (this._collapseView) {
        this._collapseView.destroy();
      }
    },

    _DomRefresh: function () {

      if (this._righttoolbarView) {
        this._righttoolbarView.triggerMethod('dom:refresh');
      }
      if (this._delayedActionsToolbarView) {
        this._delayedActionsToolbarView.triggerMethod('delayed:toolbar:refresh');
      }
    },

    adjustToolbar: function () {
      var tabIndex = -1;
      if (arguments && arguments.length > 0) {
        tabIndex = arguments[0].tabIndex;
      }

      if (this.$el.find(".binf-dropdown").length === 0) {
        this._DomRefresh();
      }
    }

  });

  _.extend(HeaderToolbarView.prototype, LayoutViewEventsPropagationMixin);

  return HeaderToolbarView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/header/impl/header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "-childview";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "        <div class=\"conws-header-edit\" tabindex=\"0\" role=\"button\" data-binf-toggle=\"popover\"\r\n             aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.iconMsg || (depth0 != null ? depth0.iconMsg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconMsg","hash":{}}) : helper)))
    + "\">\r\n          <div class=\"header-image\">\r\n            <img src=\""
    + this.escapeExpression(((helper = (helper = helpers.iconData || (depth0 != null ? depth0.iconData : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconData","hash":{}}) : helper)))
    + "\" alt=\""
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{}}) : helper)))
    + "\" class=\""
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\">\r\n          </div>\r\n          <div class=\"header-editor\">\r\n            <span class=\"icon-edit\"></span>\r\n          </div>\r\n        </div>\r\n        <input class=\"conws-header-icon-file\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.chooseInpFileTitle || (depth0 != null ? depth0.chooseInpFileTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"chooseInpFileTitle","hash":{}}) : helper)))
    + "\" type=\"file\"\r\n               accept=\""
    + this.escapeExpression(((helper = (helper = helpers.iconFileTypes || (depth0 != null ? depth0.iconFileTypes : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconFileTypes","hash":{}}) : helper)))
    + "\" style=\"display:none\">\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "        <img src=\""
    + this.escapeExpression(((helper = (helper = helpers.iconData || (depth0 != null ? depth0.iconData : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconData","hash":{}}) : helper)))
    + "\" alt=\""
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{}}) : helper)))
    + "\" class=\""
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\">\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <div class=\"conws-header-metadata-container\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasWorkspaceType : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasDescription : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasMetadataExtension : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n";
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "          <div class=\"conws-header-type\">\r\n            <p title=\""
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{}}) : helper)))
    + "</p>\r\n          </div>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.isDescriptionEmpty : depth0),{"name":"unless","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"11":function(depth0,helpers,partials,data) {
    return "            <div class=\"conws-header-desc\"></div>\r\n";
},"13":function(depth0,helpers,partials,data) {
    return "          <div class=\"conws-header-metadata-extension\"></div>\r\n";
},"15":function(depth0,helpers,partials,data) {
    return "    <div class=\"conws-header-childView-container\">\r\n      <div id=\"conws-header-childview\"></div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"conws-header-wrapper\">\r\n  <div class=\"conws-header-metadata"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasChildView : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n    <div class=\"conws-header-image\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.canChange : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0)})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"conws-header-title-section\">\r\n      <div class=\"conws-header-title\">\r\n        <h1 title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h1>\r\n\r\n        <div class=\"conws-header-child-displayUrl\"></div>\r\n      </div>\r\n\r\n       <div class=\"conws-header-toolbar\"></div>\r\n      \r\n    </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasMetadata : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasChildView : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_header_impl_header', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/header/impl/header',[],function(){});
// Business Workspace Header View
csui.define('conws/widgets/header/header.view',['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/log',
  'csui/utils/url',
  'csui/utils/nodesprites',
  'csui/dialogs/modal.alert/modal.alert',
  'esoc/widgets/activityfeedwidget/activityfeedfactory',
  'esoc/widgets/activityfeedwidget/activityfeedcontent',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/header/impl/editicon.view',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/header/impl/header.icon.model',
  'conws/widgets/header/impl/headertoolbaritems',
  'conws/widgets/header/impl/headertoolbaritems.masks',
  'conws/models/favorite.model',
  'conws/controls/description/description.view',
  'conws/widgets/header/impl/headertoolbar.view',
  'i18n!conws/widgets/header/impl/nls/header.lang',
  'csui/utils/contexts/factories/node',
  'hbs!conws/widgets/header/impl/header',
  'css!conws/widgets/header/impl/header'
], function (module, require, _, $, Marionette, base, log, Url, NodeSpriteCollection,
    ModalAlert, ActivityFeedFactory, ActivityFeedContent,
    WorkspaceContextFactory, EditIconView, HeaderModelFactory,
    HeaderIconModel, HeaderToolbarItems, HeaderToolbarItemsMask, FavoriteModel, DescriptionView,
    HeaderToolbarView, lang, NodeModelFactory, template) {

  // strict javascript execution
  

  // activity feed widget
  var constants = {'activityfeedwidget': 'esoc/widgets/activityfeedwidget'};

  var moduleConfig = module.config();

  // initialize the Header View
  var HeaderView = Marionette.LayoutView.extend({

    // CSS class names
    className: 'conws-header',

    // Template is used to render the HTML for the view
    template: template,

    // The template helpers are used to provide placeholders
    // for the widget
    templateHelpers: function () {
      var obj = {
        canChange: this.model.hasAction('upload-icon') ||
                   this.model.hasAction('update-icon') ||
                   this.model.hasAction('delete-icon'),
        iconData: this.getImageInfo().iconContent,
        iconClass: this.getImageInfo().iconClass,
        iconFileTypes: this.options.data.iconFileTypes,
        chooseInpFileTitle: this.options.data.chooseInpFileTitle,
        iconMsg: lang.iconMessage,
        title: this.resolveProperty('title'),
        type: this.resolveProperty('type'),
        description: this.resolveProperty('description'),
        hasChildView: this.hasChildView(),
        hasDescription: !this.options.hideDescription,
        isDescriptionEmpty: this.hasEmptyDescription(),
        hasWorkspaceType: !this.options.hideWorkspaceType,
        hasMetadataExtension: this.options.hasMetadataExtension,
        hasMetadata: !this.options.hideDescription || !this.options.hideWorkspaceType ||
                     this.options.hasMetadataExtension
      };
      return obj;
    },

    // the header is separated in the following regions:
    // - child view region contains the configured nested view. this
    //   is currently only the activity view.
    // - Toolbar region contains the commands like comments,favorites and other extensions
    regions: {
      childViewRegion: '#conws-header-childview',
      toolBarRegion: '.conws-header-toolbar',
      descriptionRegion: '.conws-header-desc'
    },

    // the triggers are used to add / remove the workspace icon
    triggers: {
      'change .conws-header-icon-file': 'set:icon',
      'mouseleave .conws-header-wrapper': 'mouse:leave'
    },

    events: {
      'keydown': 'onKeyDown'
    },

    isTabable: function () {
      // the header icon shouldn't be tabable in collapsed mode
      return $('.cs-tabbed-perspective.cs-collapse').length === 0;
    },

    currentlyFocusedElement: function () {
      // get header icon as focusable element
      return this.$el.find('.conws-header-edit');
    },

    onKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        // open image editor in case the header isn't collapsed
        if ($(e.target).hasClass('conws-header-edit')) {
          // stall event
          e.preventDefault();
          e.stopPropagation();
          if ($('.cs-collapse').length === 0) {
            // show popover
            $(e.target).binf_popover('show');
          }
        }
      }
    },

    onMouseLeave: function () {
      $('.conws-header-edit').binf_popover('hide');
    },

    // find a better solution instead of a blank 1x1px png image
    blankImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=',

    // default icon file types
    defaultIconFileTypes: 'image/gif, image/x-png, image/jpeg, image/pjpeg, image/png, image/svg+xml',

    // default icon file size
    defaultIconFileSize: 1048576,

    // The constructor gives an explicit name the the object in the debugger and
    // can update the options for the parent view
    constructor: function HeaderView(options) {
      // context is required
      options || (options = {});
      if (!options.context) {
        throw new Error('Context is missing in the constructor options');
      }
      // define icon file types
      if (!options.data.iconFileTypes) {
        options.data.iconFileTypes = this.defaultIconFileTypes;
      }
      // define icon file size in bytes
      if (!options.data.iconFileSize) {
        options.data.iconFileSize = this.defaultIconFileSize;
      }
      // define tooltip title of "choose file"
      if (!options.data.chooseInpFileTitle) {
        options.data.chooseInpFileTitle = lang.chooseInpFileTitle;
      }
      options.hideToolbar = options.hideToolbar ? !!options.hideToolbar :
                            !!moduleConfig.hideToolbar;
      options.hideToolbarExtension = options.hideToolbarExtension ? !!options.hideToolbarExtension :
                                     !!moduleConfig.hideToolbarExtension;
      options.hideActivityFeed = options.hideActivityFeed ? !!options.hideActivityFeed :
                                 !!moduleConfig.hideActivityFeed;
      options.hideDescription = options.hideDescription ? !!options.hideDescription :
                                !!moduleConfig.hideDescription;
      options.hideWorkspaceType = options.hideWorkspaceType ? !!options.hideWorkspaceType :
                                  !!moduleConfig.hideWorkspaceType;
      options.hasMetadataExtension = options.hasMetadataExtension ? !!options.hasMetadataExtension :
                                     !!moduleConfig.hasMetadataExtension;
      options.toolbarBlacklist = options.toolbarBlacklist ? options.toolbarBlacklist :
                                 moduleConfig.toolbarBlacklist;
      options.extensionToolbarBlacklist = options.extensionToolbarBlacklist ?
                                          options.extensionToolbarBlacklist :
                                          moduleConfig.extensionToolbarBlacklist;
      options.expandDescription = true;
      options.enableCollapse = !!moduleConfig.enableCollapse;

      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(HeaderModelFactory);
        options.workspaceContext.setWorkspaceSpecific(ActivityFeedFactory);
      }
      // get the model from the model factory
      options.model = options.workspaceContext.getModel(HeaderModelFactory);

      // set child widget and options if the type is 'activityfeed'
      if (options.data.widget && options.data.widget.type &&
          options.data.widget.type === 'activityfeed') {
        options.data.widget.type = constants.activityfeedwidget;
        options.data.widget.options || (options.data.widget.options = {});
      }

      // Masking the toolbar items in the right section of header
      if ((Array.isArray(options.toolbarBlacklist) && options.toolbarBlacklist.length > 0) ||
          (Array.isArray(options.delayedToolbarBlacklist) &&
           options.delayedToolbarBlacklist.length > 0)) {
        options.headerToolbarItemsMask = new HeaderToolbarItemsMask({
          "rightToolbar": {blacklist: options.toolbarBlacklist},
          "delayedActionsToolbar": {blacklist: options.delayedToolbarBlacklist}
        });
      }

      // Masking the toolbar items in the toolbar extension area of tabbed perspective
      if ((Array.isArray(options.extensionToolbarBlacklist) &&
           options.extensionToolbarBlacklist.length > 0) ||
          (Array.isArray(options.extensionToolbarDelayedActionsBlacklist) &&
           options.extensionToolbarDelayedActionsBlacklist.length > 0)) {
        options.headerExtensionToolbarItemsMask = new HeaderToolbarItemsMask({
          "rightToolbar": {blacklist: options.extensionToolbarBlacklist},
          "delayedActionsToolbar": {blacklist: options.extensionToolbarDelayedActionsBlacklist}
        });
      }

      options.workspaceNode = options.workspaceContext.getModel(NodeModelFactory);

      // wire models and collections also to the parent view
      Marionette.LayoutView.prototype.constructor.call(this, options);

      // listen to the window resize event
      $(window).on('resize', _.bind(this.onWindowResize, this));
      this.model.fetched = false;
      // changes of the header model are rendered immediately
      this.listenTo(this.model, 'change', _.bind(function () {
        this.model.fetched = true;
        this.render();
      }, this));

      // create an icon model and listen on changes
      this.iconModel = new HeaderIconModel({},
          {connector: this.model.connector, node: this.model});
      this.listenTo(this.iconModel, 'icon:change', this.onIconChanged);

      if (this.hasChildView()) {
        var widget = this.options.data.widget;
        if (widget.type === constants.activityfeedwidget) {
          // because nodeid is part of id of activity feed factory/model in context, we must create
          // the widget every time the id changes. and we must do it before render,
          // so it is fetched together with the other nodes, to get smooth animations.
          this._makeActivityWidget();
          this.listenTo(this.model.node, 'change:id', this._makeActivityWidget);
        }
      }

      this.options.workspaceNode.nonPromotedActionCommands = this.getDelayedHeaderViewActions();
      // Render toolbar items (comments, favorites) as an extension in tab links section of tabbed perspective
      if (!this.options.hideToolbarExtension) {

        this.tabBarRightExtensionView = HeaderToolbarView;

        this.tabBarRightExtensionViewOptions = {
          context: this.options.context,
          node: this.options.workspaceNode,
          toolbarItems: this.options.headerExtensionToolbaritems || HeaderToolbarItems,
          container: this.options.workspaceNode,
          originatingView: this,
          toolbarItemsMasks: this.options.headerExtensionToolbarItemsMask,
          useIconsForDarkBackground: true,  // set to true if background is dark
          customClass: "conws-header-toolbar-extension conws-header-toolbar"
        };
        // Not showing the extension in the condensed header
        this.disableExtensionOnOtherTabs = true;
      }

      // listen to the dom:refresh event to do line clamping...
      this.listenTo(this, 'dom:refresh', this.onDomRefresh);

      this.listenTo(this, "active:tab", function () {
        this.triggerMethod("adjust:toolbar");
      });
      this.listenTo(this, "render", this.postCallbackFucntion);
    },
    postCallbackFucntion: function () {
      // Render toolbar items (comments, favorites) in the header right section
      // and additional toolbar for extension of other actions.

      this.headerToolbarView = new HeaderToolbarView(
          {
            context: this.options.context,
            node: this.options.workspaceNode,
            toolbarItems: this.options.headertoolbaritems ? this.options.headertoolbaritems :
                          HeaderToolbarItems,
            toolbarItemsMasks: this.options.headerToolbarItemsMask,
            container: this.options.workspaceNode,
            originatingView: this,
            hideToolbar: this.options.hideToolbar,
            useIconsForDarkBackground: true,  // set to true if background is dark
            statusIndicatorsView: this.options.statusIndicatorsView,
            statusIndicatorsViewOptions: this.options.statusIndicatorsViewOptions,
            enableCollapse: this.options.enableCollapse
          });

      this.toolBarRegion.show(this.headerToolbarView);
    },

    addActivityFeedClass: function () {
      if (this.$el.find('#conws-header-childview').find('.esoc-activityfeed-contentwidget').has(
              '.esoc-activityfeed-list-item').length) {
        this.$el.parent().addClass('conws-activityfeed-configured').removeClass(
            'conws-activityfeed-configured-nodata');
      } else if (this.$el.find('#conws-header-childview').has(
              '.esoc-activityfeed-contentwidget .esoc-empty-activityfeed-message').length) {
        this.$el.parent().addClass('conws-activityfeed-configured-nodata').removeClass(
            'conws-activityfeed-configured');
      } else {
        this.$el.parent().removeClass('conws-activityfeed-configured-nodata').removeClass(
            'conws-activityfeed-configured');
      }
    },

    onDomRefresh: function () {
      this.addActivityFeedClass();
      // line clamping
      this._clampTexts();
      // tab indexes are maintained in the 'dom:refresh' event. unfortunately the event isn't
      // executed on nested views. therefore we have to manually trigger them on the nested views.
      if (this.hasChildView()) {
        this.childViewRegion.currentView &&
        this.childViewRegion.currentView.triggerMethod('dom:refresh');
      }

      this.headerToolbarView.triggerMethod('dom:refresh');

      if (!!this.descriptionView && this.descriptionView.ui.readMore.is(":hidden") &&
          this.descriptionView.ui.showLess.is(":visible")) {
        this.descriptionView.ui.showLess.click();
        this.currentlyFocusedElement().trigger('focus');
      }

      this.isTabable() ? this.currentlyFocusedElement().attr("tabindex", "0") :
      this.currentlyFocusedElement().attr("tabindex", "-1");

    },

    onWindowResize: function () {
      // line clamping
      this._clampTexts();
    },

    onDestroy: function () {
      // unbind resize event
      $(window).off('resize', this.onWindowResize);
      // release the observer
      if (this._observer) {
        this._observer.disconnect();
      }

      if (this.headerToolbarView) {
        this.headerToolbarView.destroy();
      }
    },

    // Whenever the icon has changed, the model has to be re-fetched.
    onIconChanged: function () {
      this.model.fetch();
    },

    // Whenever the file input view element has changed, the selected image is either
    // set initially or updated depending on the icon state.
    onSetIcon: function (e) {
      var files = $('.conws-header-icon-file')[0].files
      if (this.getImageInfo().iconLocation === 'node') {
        this.iconModel.update(files).fail(function (resp) {
          var message = new base.RequestErrorMessage(resp).message ||
                        lang.changeIconDialogDefaultError;
          ModalAlert.showError(message);
        });
      } else {
        this.iconModel.add(files).fail(function (resp) {
          var message = new base.RequestErrorMessage(resp).message ||
                        lang.changeIconDialogDefaultError;
          ModalAlert.showError(message);
        });
      }
    },

    // Initializes the view displayed in the edit icon popover.
    renderPopover: function () {
      var imageInfo = this.getImageInfo();
      var self = this;
      var view = new EditIconView({
        message: lang.changeIconDialogMessage.replace('%1',
            base.getReadableFileSizeString(self.options.data.iconFileSize)),
        resetButton: function () {
          return imageInfo.iconLocation === 'node' && self.model.hasAction('delete-icon')
        },
        uploadButton: function () {
          return imageInfo.iconLocation !== 'type' && self.model.hasAction('upload-icon')
                 || imageInfo.iconLocation !== 'node' && self.model.hasAction('update-icon');

        },
        callback: _.bind(this.onClickPopover, this)
      });
      return view.render().el;
    },

    // Callback function that is executed from within the edit icon view buttons. Depending on the clicked
    // button either the icon is reset or the file browser is opened.
    onClickPopover: function (e) {
      // close the popover
      $('.conws-header-edit').binf_popover('hide');
      // execute edit action
      if (e === 'reset') {
        // remove the custom workspace image
        this.iconModel.remove().fail(function (resp) {
          var message = new base.RequestErrorMessage(resp).message ||
                        lang.changeIconDialogDefaultError;
          ModalAlert.showError(message);
        });
      } else if (e === 'upload') {
        // open the file browse to select a image file for upload
        this.$('.conws-header-icon-file').trigger('click');
        if (base.isTouchBrowser()) {
          // not sure why this is required but due to some wiredness we have to trigger the
          // click event twice to open the dialog on an IPAD browser.
          this.$('.conws-header-icon-file').trigger('click');
        }
      }
      // refocus header image
      this.currentlyFocusedElement().trigger('focus');
    },

    onShow: function () {
      var self = this;
      // create observer ...
      var perspective = $('.cs-perspective-panel');
      if (perspective.length === 1) {
        this._observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            var target = $(mutation.target);
            if (target.hasClass('cs-tabbed-perspective')) {
              self.titleClampLines = target.hasClass('cs-collapse') ? 1 : 2;
              self._clampTexts();
            }
          });
        });
        // ... and observe
        this._observer.observe(perspective[0],
            {attributes: true, attributeFilter: ['class'], subtree: true});
      }
    },

    // The view is rendered whenever the model changes.
    onRender: function () {
      if (this.model.fetched) {
        this.$el.parent().addClass('conws-header-widget');
        var self = this;
        // initialize popover
        var edit = this.$('.conws-header-edit');
        edit.binf_popover({
          container: '.conws-header-wrapper',
          animation: true,
          html: true,
          content: _.bind(this.renderPopover, this)
        });

        if (this.hasChildView()) {
          // Render activityfeed if necessary
          if (!self.activityFeedContent) {
            this._makeActivityWidget();
          }
          if (self.activityFeedContent) {
            var listView = self.activityFeedContent.contentView.unblockActions();
            self.childViewRegion.show(listView);
            self.activityFeedContent = undefined;
          }
        }

        // Render description
        if (!this.options.hideDescription && !this.hasEmptyDescription()) {
          var data = {
            view: this,
            complete_desc: this.resolveProperty('description'),
            expandDescription: this.options.expandDescription
          };
          this.descriptionView = new DescriptionView(data);
          this.descriptionRegion.show(this.descriptionView);
          this.$el.parent().addClass('conws-description-available');
        }
      }

    },

    hasEmptyDescription: function () {
      var description = this.resolveProperty('description');
      return (description === "");
    },

    _clampTexts: function () {
      // clear timer
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      // renew timer
      this.resizeTimer = setTimeout(_.bind(function () {
        // title
        var title = $('.conws-header-title > p');
        if (title.length !== 0) {
          title.text(title.attr('title'));
          this.clamp(title[0], title.parent().outerHeight());
        }
      }, this), 200);
    },

    // Get the header configuration property
    _makeActivityWidget: function () {
      // create activity widget if we have an id.
      // set it to undefined, if we have no id or activityfeed is not configured.
      this.activityFeedContent = undefined;
      if (this.model.node.get('id')) {
        var widget = (this.options.data && this.options.data.widget);
        if (widget && widget.type === constants.activityfeedwidget) {
          var widgetOptions = $.extend({}, widget.options, {
            feedsize: 10,
            feedtype: "all",
            feedSettings: {
              enableComments: true,
              enableFilters: false
            },
            feedsource: {
              source: 'pulsefrom',
              id: this.model.node.get('id')
            },
            hideExpandIcon: true,
            context: this.options.workspaceContext,
            headerView: true
          });
          this.activityFeedContent = new ActivityFeedContent(widgetOptions);
          this.listenTo(this.activityFeedContent.contentView.collection, 'sync', this.addActivityFeedClass);
        }
      }
    },

    // Get the header configuration property
    configProperty: function (name) {
      var props = (this.options.data && this.options.data.workspace &&
                   this.options.data.workspace.properties) || {};
      return props[name];
    },

    // Gets the widget properties from the view and resolves replacement tags if
    // available.
    resolveProperty: function (name) {
      var ret = '';
      // resolve widget property only in case the model is
      // already a business workspace
      if (this.model.isWorkspaceType()) {
        // get the property from the widget workspace configuration
        var prop = this.configProperty(name);
        //for backword compatability
        if (prop === '{business_properties.description}') {
          prop = '{description}'
        }
        if (prop && (prop.length > 0)) {
          // find placeholders in the format '{x}'
          var tags = prop.match(/{(.*?)}/g);
          if (tags) {
            var self = this;
            _.each(tags, function (tag) {
              prop = prop.replace(tag, self.format(self.resolveModelValue(tag)).formatted || '');
            });
          }
          ret = prop;
        }
      }
      return ret;
    },

    // Gets properties from the model.
    // - Supports node / category properties
    // - Multi-value fields are supported, values are comma-separated.
    // - Returns name, value and metadata information
    resolveModelValue: function (name) {
      // initialize return
      var ret = {
        name: name,
        value: name,
        metadata: undefined
      };
      // resolve the model value
      if (name.indexOf('{') === 0) {
        // set node values and split replacement tag
        var value = this.model.attributes || {};
        var metadata = this.model.metadata && this.model.metadata.properties || {};
        var names = name.substring(1, name.length - 1).split('.');
        var metadataNames = names;
        // in case of categories replacement tag switch to categories
        // object and adopt the replacement tag elements.
        var section = (names.length > 1) ? names[0] : undefined;
        if (section === 'categories') {
          // set the categories value, metadata field
          value = this.model.categories || {};
          metadata = this.model.metadata && this.model.metadata.categories || {};
          // extend array from [categories, catid_fieldid]
          // to [categories, catid, catid_fieldid]
          var parts = names[1].split('_');
          names = [parts[0], names[1]];
          //
          if (parts.length > 2) {
            parts[2] = 'x';
          }
          metadataNames = [parts[0], parts.join('_')];
        } else if (section === 'business_properties') {
          // set the business properties value, metadata field
          value = this.model.business_properties || {};
          metadata = {};
          // remove 'business_properties' tag
          names.splice(0, 1);
        }
        // find the replacement tag in the workspace
        // information.
        _.find(names, function (name) {
          value = value[name];
          if (value === undefined) {
            return true;
          }
        });
        // find the value metadata
        _.find(metadataNames, function (name) {
          metadata = metadata[name];
          if (metadata === undefined) {
            return true;
          }
        });
        // expand the category values
        if (section === 'categories') {
          if (metadata && metadata.type_name === 'Integer') {
            if (metadata.persona === 'user' || metadata.persona === 'group' ||
                metadata.persona === 'member') {
              this.model.expandMemberValue({name: names[1], value: value, metadata: metadata});
            }
          }
        }
        // return value
        ret.name = name;
        ret.value = value;
        ret.metadata = metadata;
      }
      // return
      return ret;
    },

    // returns a culture and type specifically formatted
    // model value.
    format: function (value) {
      // format depending on metadata
      var type = value.metadata && value.metadata.type_name;
      switch (type) {
      case 'Date':
        // format date value
        value.formatted = this.formatDate(value.value);
        break;
      case 'Integer':
        // in case of integer the value could also represent a user/group id
        var persona = value.metadata.persona;
        switch (persona) {
        case 'user':
        case 'group':
        case 'member':
          // users and groups must be expanded before they are formatted
          var expprop = '{' + value.name.substring(1, value.name.length - 1) + '_expand}';
          var expval = this.resolveModelValue(expprop);
          value.formatted = this.formatMember(expval.value);
          break;
        default:
          // default integer values are displayed as they are
          value.formatted = this.formatValue(value.value);
          break;
        }
        break;
      default:
        // all other types are displayed as they are
        value.formatted = this.formatValue(value.value);
        break;
      }

      // return the value
      return value;
    },

    formatDate: function (value) {
      // ensure value is array
      value = _.isArray(value) ? value : [value];
      // return formatted string
      return _.map(value, function (element) {
        return base.formatDate(element);
      }).join('; ');
    },

    formatMember: function (value) {
      // ensure value is array
      value = _.isArray(value) ? value : [value];
      // return formatted string
      var map = _.map(value, function (element) {
        if (!element) {
          return '';
        } else if (element.display_name !== undefined) {
          return element.display_name;
        } else if (element.name_formatted !== undefined) {
          return element.name_formatted;
        } else {
          return base.formatMemberName(element);
        }
      });
      var mapstr = map.join('; ');
      return mapstr;
    },

    formatValue: function (value) {
      // ensure value is array
      value = _.isArray(value) ? value : [value];
      // return formatted string
      return value.join('; ');
    },

    // Evaluates whether the header contains a child widget or not.
    hasChildView: function () {
      return !this.options.hideActivityFeed && (this.options.data && this.options.data.widget &&
             this.options.data.widget.type && this.options.data.widget.type !== "none");
    },

    // Resolves the header image
    // - either return the image data url
    // - or return the sub-type sprite
    getImageInfo: function () {
      var ret;
      var icon = this.model.icon;
      if (icon && icon.location !== 'none') {
        // workspace icon
        ret = {
          iconContent: icon.content,
          iconLocation: icon.location,
          iconClass: undefined
        };
      } else {
        // default icon
        ret = {
          iconContent: this.blankImage,
          iconLocation: 'none',
          iconClass: NodeSpriteCollection.findByNode(this.model).get('className')
        }
      }

      return ret;
    },

    clamp: function (elem, height) {

      var truncChars = '...';
      var splitChars = ['.', ',', ' '];
      var splitChar = null;

      var chunk = null;
      var chunks = null;

      function truncate(textElem) {

        // get the value
        var value = textElem.nodeValue.replace(truncChars, '');

        // if no chunks exist get them
        if (!chunks) {
          // get the next splitchar
          splitChar = splitChars.length ? splitChars.shift() : '';
          // get the chunks
          chunks = value.split(splitChar);
        }

        // chunks exist
        if (chunks.length > 1) {
          // remove last chunk
          chunk = chunks.pop();
          // assign new value
          textElem.nodeValue = chunks.join(splitChar) + truncChars;
        } else {
          // reset chunks
          chunks = null;
        }

        if (chunks) {
          // if the text fits into the element we have to check if we
          // can improve the result by splitting by the next character.
          if (elem.clientHeight <= height) {
            if (splitChars.length) {
              // assign new value and additionally the last chunk that was
              // removed. The actual chuck can split up into smaller parts.
              textElem.nodeValue = chunks.join(splitChar) + splitChar + chunk;
              // reset chunks
              chunks = null;
            } else {
              // we're finished with truncating and can return
              return;
            }
          }
        } else {
          // there are no valid chunks even when
          // splitting by letters so we stop here
          if (!truncChars.length) {
            textElem.nodeValue = truncChars;
            return;
          }
        }

        // truncate remaining text
        truncate(textElem);
      }

      // return if truncation isn't required.
      if (elem.clientHeight <= height) {
        return;
      }
      // truncate
      truncate(elem.lastChild);
    },

    adjustToolbar: function () {
      if (!this.options.hideToolbar) {
        this.headerToolbarView.triggerMethod('dom:refresh');
      }
    },

    getDelayedHeaderViewActions: function () {
      var headerToolbarDelayedActions = (this.options.headertoolbaritems &&
                                         this.options.headertoolbaritems['delayedActionsToolbar']) ?
                                        this.options.headertoolbaritems['delayedActionsToolbar'].collection :
                                        HeaderToolbarItems['delayedActionsToolbar'].collection;

      return _.chain(headerToolbarDelayedActions.pluck('signature'))
          .unique()
          .value();
    }
  });

  // return the initialized view
  return HeaderView;
});

// Expands the limited view by showing the full one in a modal dialog
csui.define('conws/utils/behaviors/expanding.behavior',['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette'
], function (require, _, Backbone, Marionette) {

  var ExpandingBehavior = Marionette.Behavior.extend({

    constructor: function ExpandingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      // The perspective begins to change with an animation before the
      // previous one is destroyed; the expanded view should be hidden
      // previous one is.
      var destroyWithAnimation = _.bind(this._destroyExpandedView, this, false),
          destroyImmediately = _.bind(this._destroyExpandedView, this, true),
          context = view.options && view.options.context;
      this.listenTo(this, 'before:destroy', destroyWithAnimation);
      if (context) {
        // The hiding animation finishes before the context is fetched
        // and the page is re-rendered.  If it becomes problem, use
        // destroyImmediately here.
        this.listenTo(context, 'request', destroyWithAnimation)
            .listenTo(context, 'request:perspective', destroyWithAnimation);
      }
    },

    onExpand: function () {
      // If the expanding event is triggered multiple times, it should be
      // handled just once by showing the expanded view; it is likely, that
      // the expanding button was clicked quickly twice
      if (this.expanded) {
        return;
      }
      // Do not use the later initialized this.dialog property; loading
      // the modules with the expanded view below may take some time.
      this.expanded = true;

      var self = this;
      // TODO: remove completeCollection and limiting behavior.  Both
      // client- and server-side browsable collections should provide
      // the same interface and use the according mixins.
      var collection = this.view.completeCollection ?
                       this.view.completeCollection.clone() :
                       this.view.collection.clone();

      // TODO: This prevents other components from reusing this object,
      // I hope that the and-conditions are enough to allow it in most cases.
      // Order and filter should be carried via the model/collection
      // and not chewed here for the expanded view.

      // capture the name filter value from the collapsed tile and pass to the expanded table
      var filterBy;
      var filterVal = this.view.completeCollection && this.view.options &&
                      this.view.options.filterValue &&
                      this.view.options.filterValue.toLowerCase();
      if (this.view.completeCollection && filterVal && filterVal.length > 0) {
        filterBy = {name: filterVal};
        collection.setFilter(filterBy, {fetch: false});
        // Our PM Franz had a good idea that the filter in the collapsed tile should be cleared
        // after we show the expanded table
        this.view.searchClicked();
      }

      var expandedViewValue = self.getOption('expandedView');
      var expandedViewClass = expandedViewValue;
      if (_.isString(expandedViewValue) !== true) {
        expandedViewClass = expandedViewValue.prototype instanceof Backbone.View ?
                            expandedViewValue :
                            expandedViewValue.call(self.view);
      }
      var requiredModules = ['csui/controls/dialog/dialog.view'];
      if (_.isString(expandedViewClass)) {
        requiredModules.push(expandedViewClass);
      }
      require(requiredModules, function (DialogView) {
        if (_.isString(expandedViewClass)) {
          expandedViewClass = arguments[1];
        }
        var expandedViewOptions = getOption(self.options, 'expandedViewOptions', self.view);
        self.expandedView = new expandedViewClass(_.extend({
          context: self.view.options.context,
          collection: collection,
          orderBy: getOption(self.options, 'orderBy', self.view),
          filterBy: filterBy,
          limited: false
        }, expandedViewOptions));
        self.dialog = new DialogView({
          iconLeft: getOption(self.options, 'titleBarIcon', self.view) ||
                    getOption(self.view.options, 'titleBarIcon', self.view),
          imageLeftUrl: getOption(self.options, 'titleBarImageUrl', self.view),
          imageLeftClass: getOption(self.options, 'titleBarImageClass', self.view),
          title: getOption(self.options, 'dialogTitle', self.view),
          iconRight: getOption(self.options, 'dialogTitleIconRight', self.view),
          className: getOption(self.options, 'dialogClassName', self.view),
          headerControl: getOption(self.options, 'headerControl', self.view),
          largeSize: true,
          view: self.expandedView
        });
        self.listenTo(self.dialog, 'before:hide', self._expandOtherView)
            .listenTo(self.dialog, 'destroy', self._enableExpandingAgain);
        self._expandOtherView(false);
        self.dialog.show();
      }, function (error) {
        // If the module from the csui base cannot be loaded, something is so
        // rotten, that it does not make sense trying to load other module to
        // show the error message.
        // There will be more information on the browser console.
        self.expanded = false;
      });
    },

    _destroyExpandedView: function (immediately) {
      if (this.dialog) {
        var method = immediately ? 'kill' : 'destroy';
        this.dialog[method]();
        this.dialog = undefined;
      }
    },

    _expandOtherView: function (expand) {
      this.options.collapsedView && this.options.collapsedView.triggerMethod(
          expand === false ? 'go:away' : 'go:back');
    },

    _enableExpandingAgain: function () {
      this.expanded = false;
      if (this.view.tabableRegionBehavior) {
        var navigationBehavior = this.view.tabableRegionBehavior,
          targetElement      = this.view.ui.tileExpand;
        navigationBehavior.currentlyFocusedElement &&
        navigationBehavior.currentlyFocusedElement.prop('tabindex', -1);
        targetElement && targetElement.prop('tabindex', 0);
        targetElement.trigger('focus');
        navigationBehavior.setInitialTabIndex();
        this.view.currentTabPosition = 2;
      }
    }

  });

  // TODO: Expose this functionality and make it generic for functiona objects too.
  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  return ExpandingBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/controls/teamheader/impl/teamheader',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-teamheader-content\">\r\n  <div class=\"title primary-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.primaryTitle || (depth0 != null ? depth0.primaryTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"primaryTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.primaryTitle || (depth0 != null ? depth0.primaryTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"primaryTitle","hash":{}}) : helper)))
    + "</div>\r\n  <div class=\"title secondary-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.secondaryTitle || (depth0 != null ? depth0.secondaryTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"secondaryTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.secondaryTitle || (depth0 != null ? depth0.secondaryTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"secondaryTitle","hash":{}}) : helper)))
    + "</div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_controls_teamheader_impl_teamheader', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/team/impl/controls/teamheader/impl/teamheader',[],function(){});
csui.define('conws/widgets/team/impl/controls/teamheader/teamheader.view',[
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/marionette',
    'i18n!conws/widgets/team/impl/nls/team.lang',
    'hbs!conws/widgets/team/impl/controls/teamheader/impl/teamheader',
    'css!conws/widgets/team/impl/controls/teamheader/impl/teamheader'
], function(_, $, Marionette, lang, template){

    var TeamHeaderView = Marionette.LayoutView.extend({

        className: 'conws-teamheader',

        template: template,

        constructor: function TeamHeaderView(options){
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);

            // initialize team header view
            options || (options = {});
        },

        templateHelpers: function(){
            return {
                primaryTitle: this.options.primaryTitle,
                secondaryTitle: this.options.secondaryTitle
            }
        }
    });

    return TeamHeaderView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/team/impl/team.empty',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-team emptyview cs-emptylist-text\">\r\n    <span>"
    + this.escapeExpression(((helper = (helper = helpers.noResultsPlaceholder || (depth0 != null ? depth0.noResultsPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"noResultsPlaceholder","hash":{}}) : helper)))
    + "</span>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_team_impl_team.empty', t);
return t;
});
/* END_TEMPLATE */
;
// Shows a list of team members
csui.define('conws/widgets/team/team.view',['csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/limiting/limiting.behavior',
  'conws/utils/behaviors/expanding.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/teamtables.view',
  'conws/widgets/team/impl/controls/teamheader/teamheader.view',
  'csui/utils/base',
  'csui/utils/nodesprites',
  'csui/utils/contexts/factories/node',
  'conws/widgets/team/impl/controls/listitem/listitemteammember.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/team.empty',
  'css!conws/widgets/team/impl/team'
], function (_, Marionette, ListView, PerfectScrollingBehavior, LimitingBehavior, ExpandingBehavior,
    TabableRegionBehavior, ListViewKeyboardBehavior, WorkspaceContextFactory, HeaderModelFactory,
    TeamCollectionFactory, TeamTablesView, TeamHeaderView, BaseUtils, NodeSpriteCollection,
    NodeModelFactory, ListItem, lang, TeamEmptyTemplate) {

  // Empty team view
  var TeamEmptyView = Marionette.ItemView.extend({

    constructor: function TeamEmptyView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: TeamEmptyTemplate
  });

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var TeamView = ListView.extend({

    className: 'conws-team ' + ListView.prototype.className,

    constructor: function TeamView(options) {
      // initialize team view
      options || (options = {});
      options.data || (options.data = {});
      if (options.data.showTitleIcon === undefined) {
        options.data.showTitleIcon = true;
      }
      if (options.data.showWorkspaceIcon === undefined) {
        options.data.showWorkspaceIcon = false;
      }
      options.data.title || (options.data.title = lang.dialogTitle);

      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(HeaderModelFactory);
        options.workspaceContext.setWorkspaceSpecific(TeamCollectionFactory);
      }

      // apply properties to parent
      ListView.prototype.constructor.apply(this, arguments);

      // TODO: In terms of reusability the CONWS model factories should be moved to a common
      // TODO: location in the CONWS source. Otherwise we have dependencies between the different
      // TODO: widgets.
      // get the header model
      this.headerModel = options.workspaceContext.getObject(HeaderModelFactory);
    },

    templateHelpers: function () {
      return {
        searchAria: lang.searchAria,
        expandAria: lang.expandAria,
        title: BaseUtils.getClosestLocalizedString(this.options.data.title, lang.dialogTitle),
        icon: this.options.data.titleBarIcon || 'title-icon title-team',
        searchPlaceholder: _.str.sformat(lang.searchIconTooltip,
            lang.rolesParticipantsColTooltip)
      };
    },

    getEmptyView: function () {
      return TeamEmptyView;
    },

    emptyViewOptions: {
      templateHelpers: function () {
        return {
          noResultsPlaceholder: lang.noResultsPlaceholder
        };
      }
    },

    childView: ListItem,

    childViewOptions: {
      templateHelpers: function () {
        return {
          name: this.model.get('display_name'),
          email: this.model.get('business_email'),
          isUser: this.model.get('type') === 0,
          stage: {
            value: this.model.getLeadingRole(),
            label: this.model.getRolesIndicator()
          }
        }
      }
    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    onClickItem: function (target) {
      return;
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.tile-content',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },

      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          return this.options.workspaceContext.getCollection(TeamCollectionFactory);
        },
        filterByProperty: 'display_name',
        limit: 0
      },

      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: TeamTablesView,
        expandedViewOptions: function () {
          return {collapsedView: this}
        },
        dialogTitle: function () {
          return this.headerModel.get('name');
        },
        headerControl: function () {
          return new TeamHeaderView({
            primaryTitle: this.headerModel.get('name'),
            secondaryTitle: this.headerModel.get('workspace_type_name')
          });
        },
        titleBarIcon: function () {
          return this.getIconData().titleBarIcon;
        },
        titleBarImageUrl: function () {
          return this.getIconData().titleBarImageUrl;
        },
        titleBarImageClass: function () {
          return this.getIconData().titleBarImageClass;
        },
        dialogTitleIconRight: 'icon-tileCollapse',
        dialogClassName: 'conws-team'
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      }
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    },

    getIconData: function () {
      var ret = {};
      // show a title icon - default to team svg
      if (this.options.data.showTitleIcon) {
        ret.titleBarIcon = this.options.data.titleBarIcon || 'title-icon mime-team';
        // show workspace icon
        if (this.options.data.showWorkspaceIcon) {
          // workspace contains icon information
          if (this.headerModel.icon && this.headerModel.icon.location !== 'none') {
            ret.titleBarIcon = undefined;
            ret.titleBarImageUrl = this.headerModel.icon.content;
          }
          else {
            ret.titleBarIcon = NodeSpriteCollection.findByNode(this.headerModel).get('className');
          }
        }
      }
      return ret;
    },

    // Event from the expanded view to refresh the displayed list
    onRefreshList: function () {
      if (!_.isUndefined(this.completeCollection)) {
        this.completeCollection.fetch();
      }
    },

    // return the jQuery list item element by index for keyboard navigation use
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var $item = this.$(_.str.sformat('.conws-item-member:nth-child({0})', index + 1));
      return this.$($item[0]);
    }
  });

  return TeamView;
});

// Shows a list of links
csui.define('conws/widgets/myworkspaces/impl/myworkspaceslistitem.view',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/listitem/listitemstandard.view',
  'conws/utils/previewpane/previewpane.view',
  'csui/behaviors/default.action/default.action.behavior'
], function (_, $,
    StandardListItem, PreviewPaneView,
    DefaultActionBehavior) {

  var MyWorkspacesListItem = StandardListItem.extend({

    constructor: function MyWorkspacesListItem(options) {
      StandardListItem.apply(this, arguments);

      if (this.options && this.options.preview) {
        this.previewPane = new PreviewPaneView({
          parent: this,
          context: this.options.context,
          config: this.options.preview,
          node: this.model
        });
      }
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    onBeforeDestroy: function(e) {
      if (this.previewPane) {
        this.previewPane.destroy();
        delete this.previewPane;
      }
    },

    onClickItem: function () {
      this.triggerMethod('execute:DefaultAction', this.model);
    }
  });

  return MyWorkspacesListItem;

});


csui.define('conws/widgets/myworkspaces/impl/myworkspacestable.view',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
    "csui/lib/marionette", "csui/utils/log",
    'conws/utils/workspaces/impl/workspaceutil',
    'conws/utils/workspaces/workspacestable.view'
], function (module, $, _, Backbone,
             Marionette, log,
             workspaceUtil, WorkspacesTableView) {

    var MyWorkspacesTableView = WorkspacesTableView.extend({

        constructor: function MyWorkspacesTableView(options) {
            WorkspacesTableView.prototype.constructor.apply(this, arguments);
        },

        onRender: function () {
            var collection = this.collection;

            // Set order if passed as configuration, otherwise use default
            if (!_.isUndefined(this.collection.options.myworkspaces.attributes.sortExpanded)) {
                collection.orderBy = this.collection.options.myworkspaces.attributes.sortExpanded;
            }else{
              collection.orderBy = workspaceUtil.orderByAsString(this.options.data.orderBy);
            }

            this.doRender(collection);
        },

        _getCollectionUrlQuery: function () {
            var query = {};

            // only fetch specific properties for table view
            query.fields = encodeURIComponent("properties{" + this.getColumnsToFetch() + "}");
            query.action = "properties-properties";

            // Fetch all workspaces
            query.expanded_view = "true";

            // Fetch users expanded to show proper name
            query.expand_users = "true";

            return query;
        }

    });

    return MyWorkspacesTableView;
});

csui.define('conws/widgets/myworkspaces/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/widgets/myworkspaces/impl/nls/root/lang',{
    dialogTitle: 'My workspaces',
    searchPlaceholder: '%1',
    noResultsPlaceholder: 'No recently accessed workspaces to display.'
});


// Shows a list of my workspaces of a specific type
csui.define('conws/widgets/myworkspaces/myworkspaces.view',['csui/lib/marionette', 'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/jquery',
    'conws/widgets/myworkspaces/impl/myworkspaceslistitem.view',
    'conws/widgets/myworkspaces/impl/myworkspaces.model.factory',
    'conws/widgets/myworkspaces/impl/myworkspacestable.view',
    'i18n!conws/widgets/myworkspaces/impl/nls/lang',
    'csui/utils/nodesprites',
	'csui/utils/base',
    'conws/utils/workspaces/impl/workspaceutil',
    'conws/utils/workspaces/workspaces.view'
], function (Marionette, module, _, Backbone, $,
             MyWorkspacesListItem,
             MyWorkspacesCollectionFactory,
             MyWorkspacesTableView,
             lang,
             NodeSpriteCollection,
			 BaseUtils,
             workspaceUtil,
             WorkspacesView) {

    var MyWorkspacesView = WorkspacesView.extend({

        constructor: function MyWorkspacesView(options) {
            this.viewClassName = 'conws-myworkspaces';

            WorkspacesView.prototype.constructor.apply(this, arguments);

            // Show expand icon always
            this.limit = -1;
        },

        childView: MyWorkspacesListItem,

        childViewOptions: function () {
            return {
                // page context needed for default action on child view
                context: this.options.context,
                preview: this.options.data                      &&
                         this.options.data.collapsedView        &&
                         this.options.data.collapsedView.preview,
                templateHelpers: function () {
                    return {
                        name: this.model.get('name'),
                        icon: NodeSpriteCollection.findClassByNode(this.model),
                        enableIcon: true
                    };
                }
            }
        },

        emptyViewOptions: {
            templateHelpers: function () {
                return {
                    text: this._parent._getNoResultsPlaceholder()
                };
            }
        },

        workspacesCollectionFactory: MyWorkspacesCollectionFactory,
        workspacesTableView: MyWorkspacesTableView,
        dialogClassName: 'myworkspaces',
        lang: lang,

        // Attributes identify collection/models for widget
        // In case two widgets has returns same attributes here, they share the collection!!
        _getCollectionAttributes: function () {
            var attributes = {
                workspaceTypeId: this.options.data.workspaceTypeId,
                sortExpanded: this.options.data.expandedView && workspaceUtil.orderByAsString(this.options.data.expandedView.orderBy),
				title:  BaseUtils.getClosestLocalizedString(this.options.data.title, lang.dialogTitle)
            };
            return attributes;
        },

        _getCollectionUrlQuery: function () {
            var options = this.options.data,
                query = {};
            if (!_.isUndefined(options.workspaceTypeId)) {
                query.where_workspace_type_id = options.workspaceTypeId;
            }

            // only fetch properties for limited view
            query.fields = encodeURIComponent("properties{id,container,name,type}");
            query.action = "properties-properties";

            // Fetch only recently accessed workspaces, which workspaces these are
            // is defined by the server. Also the order is already set by server, this must not
            // be done/passed from client to server
            query.expanded_view = "false";

            return _.isEmpty(query) ? undefined : query;
        }

    });

    return MyWorkspacesView;
});

// Lists explicit locale mappings and fallbacks

csui.define('conws/widgets/metadata/impl/nls/metadata.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


// Defines localizable strings in the default language (English)

csui.define('conws/widgets/metadata/impl/nls/root/metadata.lang',{
  defaultMetadataWidgetTitle: 'Metadata',
  noMetadataMessage: 'No data to display.'
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/metadata/impl/metadata',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "        <div class=\"tile-header\">\r\n\r\n            <div class=\"tile-type-icon\">\r\n                <div class=\"title-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n            </div>\r\n\r\n            <div class=\"tile-title\">\r\n                <h2 class=\"csui-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\r\n            </div>\r\n\r\n        </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "				<div class=\"form-metadata"
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"/>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"conws-metadata tile content-tile\">\r\n\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hideHeader : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    <div class=\"tile-content metadata-tile-content\">\r\n		<div class=\"form-metadata\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\r\n    </div>\r\n\r\n</div>\r\n";
},"useData":true});
Handlebars.registerPartial('conws_widgets_metadata_impl_metadata', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/metadata/impl/metadata',[],function(){});
// Business Workspace Metadata View
csui.define('conws/widgets/metadata/metadata.view',[
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/base',
  'csui/utils/log',
  'csui/utils/url',
  'csui/utils/base',
  'csui/utils/contexts/factories/node',
  'csui/controls/list/emptylist.view',
  'conws/controls/selectedmetadataform/selectedmetadataform.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/models/form',
  'csui/models/node/node.model',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/models/selectedmetadataform/selectedmetadataform.factory',
  'i18n!conws/widgets/metadata/impl/nls/metadata.lang',
  'hbs!conws/widgets/metadata/impl/metadata',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'css!conws/widgets/metadata/impl/metadata'
], function (require, _, $, Backbone, Marionette, Handlebars, WidgetContainerBehavior,
			 TabableRegionBehavior, base, log, Url, BaseUtils,
			 NodeModelFactory, EmptyListView, SelectedMetadataFormView, PerfectScrollingBehavior, FormModel, NodeModel,
			 WorkspaceContextFactory, SelectedMetadataFormFactory, lang, template, LayoutViewEventsPropagationMixin) {

  // initialize the Metadata View
  var MetadataView = Marionette.LayoutView.extend({

    // CSS class names
    className: 'conws-metadata',

    // Template is used to render the HTML for the view
    template: template,

    // The template helpers are used to provide placeholders for the widget
    templateHelpers: function (data) {
      return {
		items: this._items,
        hideHeader: this.hideHeader,
        title: BaseUtils.getClosestLocalizedString(this.headerTitle, lang.defaultMetadataWidgetTitle),
        icon: this.headerIcon
      }
    },

    events: {"keydown .form-metadata": "onKeyInView"},

    behaviors: {
    	PerfectScrolling: {
    		behaviorClass: PerfectScrollingBehavior,
    		contentParent: '.tile-content',
    		suppressScrollX: true,
    		scrollYMarginOffset: 15
    	},
    	TabableRegion: {
    		behaviorClass: TabableRegionBehavior
    	}
    },


    onKeyInView: function (event) {
      // current focussed element in the view
      var ActiveElementInView = document.activeElement,
          Tabable_Elements = this.currentlyFocusedElement(),
          Element_Index = 0;

      if( ActiveElementInView.children.length > 0 ){
        ActiveElementInView=ActiveElementInView.children[0];
      }

      if (event.keyCode === 9) {

        if (event.shiftKey) {

    	  for(Element_Index=0;Element_Index<Tabable_Elements.length;Element_Index++){

    	    if(ActiveElementInView === Tabable_Elements[Element_Index]){

    		  // special-case only for User attribute
    		  if(ActiveElementInView.classList.contains("esoc-user-mini-profile") || ActiveElementInView.classList.contains("reference-generate-number") || (ActiveElementInView.classList.contains("cs-field-read-content") && ActiveElementInView.classList.contains("placeholder")) || Element_Index-1 < 0){

    		    break;
    		  }
    		  else{

    		    // focus the next element in the view
    			Tabable_Elements[Element_Index-1].focus();
    			break;
    		  }
    		}
    	  }
    	} else {

    		// TAB (NO shift) -> put focus into table body view if in header   esoc-user-mini-profile   cs-field-read-content placeholder

    		for(Element_Index=0;Element_Index<Tabable_Elements.length;Element_Index++){

    		  // special-case only for User attribute
    		  if(ActiveElementInView === Tabable_Elements[Element_Index] && Element_Index+1 < Tabable_Elements.length){

    		    if(ActiveElementInView.classList.contains("esoc-user-mini-profile") || ActiveElementInView.classList.contains("reference-generate-number") || (ActiveElementInView.classList.contains("cs-field-read-content") && ActiveElementInView.classList.contains("placeholder"))){

    			  break;
    			}
    			else{

    			  // focus the next element in the view
    			  Tabable_Elements[Element_Index+1].focus();
    			  break;
    			}
    		  }				
    	    } 
    	  } 
      }
    },

    currentlyFocusedElement: function () {
    	var readonly    = !!this.$form && this.$form.find('.alpaca-readonly button'),
    	// tabable elements selector
    	tabElements = this.$('button,*[data-cstabindex],*[tabindex]');
    	tabElements=this.remove_Elements(tabElements);
    	return tabElements;
    },

    remove_Elements: function (tabElements) {
    	// removing some unwanted elements which have tabindex
    	var Class_List = ["alpaca-array-actionbar-action", "typeahead", "cs-icon", "binf-hidden", "csui-icon-edit", "csui-bulk-edit", "icon-date_picker"];

    	for( var Element_Index = 0 ; Element_Index < tabElements.length ; Element_Index++ ){

    		for( var Class_Index = 0 ; Class_Index < Class_List.length ; Class_Index++ ){

    			if(tabElements[Element_Index].classList.contains( Class_List[ Class_Index ] ) ){

    				tabElements.splice( Element_Index, 1 );
    				Class_Index = Class_List.length;
    				Element_Index = Element_Index - 1;
    			}
    		}
    	}
    	return tabElements;
    },

    // The constructor gives an explicit name the the object in the debugger and
    // can update the options for the parent view
    constructor: function MetadataView(options) {

      // context is required
      options || (options = {});
      if (!options.context) {
        throw new Error('Context is missing in the constructor options');
      }

      _.defaults(options, {
        searchTabContentForTabableElements: true
      });

      this.hideHeader = options.data && options.data.hideHeader;
      this.headerTitle = options.data && options.data.title || lang.defaultMetadataWidgetTitle; // from perspective configuration
      this.headerIcon = options.data && options.data.icon || "category1";   // from perspective configuration

      this.noMetadataMessage = lang.noMetadataMessage;
      if(options.data && options.data.noMetadataMessage) {
        this.noMetadataMessage = base.getClosestLocalizedString(
            options.data.noMetadataMessage, this.noMetadataMessage);
      }

      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(SelectedMetadataFormFactory);
      }
	  //initially there are no form views.
	  this.formViewList = [];
      // get model collection from the model factory
      options.model = options.workspaceContext.getObject(SelectedMetadataFormFactory, {
        metadataConfig: options.data,
        unique: true
      });

      // wire models and collections also to the parent view
      Marionette.LayoutView.prototype.constructor.call(this, options);

      // changes of the model are rendered immediately
      this.listenTo(options.model, 'change', this.render);

      this.propagateEventsToRegions();
	  if(typeof options.data === 'undefined'){
	    log.info("Metadata Not Set") && console.log(log.last);
	  }
	  else if(typeof options.data.metadataConfig === 'undefined'){
		this._setUpEmptyRegion();
      }
    },

	modelEvents: {
      change: 'modelChange'
    },
	
	modelChange: function () {
      this._setUpRegions();
      this._currentShortcutIndex = 0;
    },

	/*
	 *	Creating a dedicated region for every element which is configured in the metadata widget
	*/
	_setUpRegions: function () {
	  var self = this;
	  var reg;
	  self._items = [];
	  _.each(this.options.model.metadataConfig, function (config,index) {
        self._items[index] = {"index":index};
	    self.addRegion("Region" + index, ".form-metadata" + index);
		reg = "Region" + index;
		self.regions[reg] = $.extend({}, self[reg]);
	  },this);
    },
	
	/*
	 *	Creating a single region if no metadata is configured to display no metadata configured message
	*/
	_setUpEmptyRegion: function () {
	  var self = this;
	  var reg;
	  var index = 0;
	  self._items = [];
	  self._items[0] = {"index":0};
	  self.addRegion("Region" + 0, ".form-metadata" + 0);
	  reg = "Region" + 0;
	  self.regions[reg] = $.extend({}, self[reg]);
    },

    // The view is rendered whenever the model changes.
    onRender: function () {
      if (!_.isEmpty(this.model.attributes.data)) {

		var attributeList = [];
		var attributeDetails = {data:{},options:{fields:{}},schema:{properties:{}}}
		attributeDetails.data = $.extend({}, this.model.attributes.data);
		attributeDetails.options.fields = $.extend({}, this.model.attributes.options.fields);
		attributeDetails.schema.properties = $.extend({}, this.model.attributes.schema.properties);

		/*
		 *	from metadataConfig, 
		 *	if the config type is a group, adding the group details to attributeList
		 *	if the config type is a category, search for all the category attributes and add details to attributeList at same index
		 *  if the config type is a attribute, checking if it has a column and row ids and adding the details to atributeList
		 *  ( As we add all the elements even group data is added in else part, hence it is further removed when groups are added individually )
		*/

		_.each(this.options.model.metadataConfig, function (config,index) {
		  if(config.type === 'group'){
			attributeList[index]={data:{},options:{},schema:{}};
		    attributeList[index].data = $.extend({},this.model.attributes.data[config.label]);
		    attributeList[index].options = $.extend({},this.model.attributes.options.fields[config.label]);
		    attributeList[index].schema = $.extend({},this.model.attributes.schema.properties[config.label]);
		  }
		  else if(config.type === 'category'){
		    attributeList[index]={data:{},options:{fields:{}},schema:{properties:{}}};
			_.each(this.model.attributes.data, function (data,key){
			  if(key.search(config.categoryId) === 0){
			    attributeList[index].data[key] = this.model.attributes.data[key];
			    attributeList[index].options.fields[key] = this.model.attributes.options.fields[key];
			    attributeList[index].schema.properties[key] = this.model.attributes.schema.properties[key];
			  }
			},this);
		  }
		  else if(config.type === 'attribute'){
			var key = config.categoryId + "_" + config.attributeId
			if(typeof config.columnId !== 'undefined' && typeof config.rowId === 'undefined'){
			  key = key + "_1_" + config.columnId;
			}
			else if(typeof config.rowId !== 'undefined'){
			  key = key + "_x_" + config.columnId;
			}
			attributeList[index]={data:{},options:{fields:{}},schema:{properties:{}}};
			if(typeof this.model.attributes.data[key] !== 'undefined'){
		      attributeList[index].data[key] = this.model.attributes.data[key];
			  attributeList[index].options.fields[key] = this.model.attributes.options.fields[key];
			  attributeList[index].schema.properties[key] = this.model.attributes.schema.properties[key];
			}
		  }
		},this);

		/*
		 *	Creating and adding individual formViews for each region
		*/

		var i = 0;
	    _.each(this.regions, function (region,index) {
		  this.model.attributes = attributeList[i];
		  this["formView"+i] = new SelectedMetadataFormView({model: this.model, context: this.options.context, node:this.model.node});
		  /*
		   * Adding the metadataview to the created formView.
		   * this is done because every formView can be accessed from from all formViews.
		   * And a change in one formView can be used to modify in other.
           *
		   * For Example:
		   *
		   * In a scenario when single attributes are configured in metadata widgets like id, old_reference, reference.
		   * Here, reference attribute depends on id and old_reference contains previous reference value.
		   * If we configure attributes to perspective we get equal number of form views. As we have dedicated regions and formViews for each single attribute configurations.
		   * As the user has configured 3 attributes (id,old_reference,reference) we get 3 formViews.
		   * Previously a change in reference could easily modify old_reference as they are in a single formView.
		   * but, now the Metadata Widget can have multiple formViews (Based on the configuration done in PMan).
		   * So, a new object 'formViewList' is introduced in MetadataView which will store all the formViews.
		   * And a new object metadataview is added to every formView which will store the reference to MetadataView.
		   *
		   */
		  this.formViewList[i] = this["formView"+i]
		  this["formView"+i].metadataview = this;
          this[index].show(this["formView"+i]);
		  i++;
		},this);
		this.model.attributes = attributeDetails;

      } else {
		this.formView = new EmptyListView({text: this.noMetadataMessage});
		_.each(this.regions, function (region,index) {
		  this[index].show(this["formView"]);
		},this);
      }
    }
  });

  _.extend(MetadataView.prototype, LayoutViewEventsPropagationMixin);

  // return the initialized view
  return MetadataView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/wksp/impl/wksp',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"List-item\" >\r\n    <div class=\"listItemWksp wkspItem\"  id=\"wkspItem\" >\r\n        <span class=\"wksp-expand-icon\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"><div id=\"toggleIcon\" tabindex=\""
    + this.escapeExpression(((helper = (helper = helpers.tabIndex || (depth0 != null ? depth0.tabIndex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tabIndex","hash":{}}) : helper)))
    + "\" class=\""
    + this.escapeExpression(((helper = (helper = helpers.toggleStatus || (depth0 != null ? depth0.toggleStatus : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toggleStatus","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.typeName || (depth0 != null ? depth0.typeName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"typeName","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" /></span>\r\n        <span class=\"wkspItemIcon\"><div class=\""
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.typeName || (depth0 != null ? depth0.typeName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"typeName","hash":{}}) : helper)))
    + "\"></div></span>\r\n        <div class=\"listItemWkspName wkspItemName\"  tabindex=\"0\" id=\"wkspNameDiv\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + " </div>\r\n        <div class=\"wkspFolder-actiondiv binf-fade\" style=\"display:none\">\r\n            <div id=\"wkspActionBar\" class=\"wkspFolder-actionbar wkspFolder-actionbar-bubble\" >\r\n                <ul class=\"wksptile-nav wkspnav wksptile-pills\">\r\n                    <li class=\"needsclick wkspActionButton wkspActionSaveButton\" id=\"wkspSaveMenuItem\" style=\"display:none\">\r\n                        <div>\r\n                            <a href=\"#\" id=\"saveEmailButton\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" tabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.saveButtonTitle || (depth0 != null ? depth0.saveButtonTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveButtonTitle","hash":{}}) : helper)))
    + "\" >\r\n                                <div class=\"wkspIcon emailSaveIcon\" data-id=\"noToggle\" />\r\n                            </a>\r\n                        </div>\r\n                    </li>\r\n\r\n                    <li class=\"needsclick wkspActionButton\">\r\n                        <div>\r\n                            <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.linkToWS || (depth0 != null ? depth0.linkToWS : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linkToWS","hash":{}}) : helper)))
    + "\" id=\"wkspOpenButton\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.openLinkTitle || (depth0 != null ? depth0.openLinkTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"openLinkTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.openLinkTitle || (depth0 != null ? depth0.openLinkTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"openLinkTitle","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" tabindex=\"0\" target=\"_blank\">\r\n                                <div class=\"wkspIcon wkspOpenIcon\" data-id=\"noToggle\" />\r\n                            </a>\r\n                        </div>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div id=\"subFolders\"></div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_wksp_impl_wksp', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/utils/emailservice',['module',
    'csui/lib/jquery',
    'conws/widgets/outlook/impl/utils/utility',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function EmailSerivce(module, $, WkspUtil, lang) {

        return {

            constants : {
                cs_config_missing: lang.config_CS_missing,
                retrieve_email_error: lang.error_retrieve_email
            },

            getCurrentMailboxItem: getCurrentMailboxItem,
            emailItemChanged: emailItemChanged
    };

        function getCurrentMailboxItem() {
            var deferred = $.Deferred();

            try {
                var currentEmail = window.Office.cast.item.toItemRead(window.Office.context.mailbox.item);
                var currentUser = window.Office.context.mailbox.userProfile.emailAddress;

                currentEmail.archivableAttachments = [];
                for (var i = 0; i < currentEmail.attachments.length; i++) {
                    var attachment = currentEmail.attachments[i];
                    if (attachment.attachmentType === window.Office.MailboxEnums.AttachmentType.File){
                        currentEmail.archivableAttachments.push(attachment);
                    }
                }

                deferred.resolve({
                    currentEmail: currentEmail,
                    currentUser: currentUser
                });
            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise();
        }

        function emailItemChanged(eventArgs){
            if (WkspUtil.SavingSubmitted){
                WkspUtil.EmailChangedAfterSaving = true;
                return;
            } else {
                WkspUtil.EmailChangedAfterSaving = false;
            }

            var item = window.Office.context.mailbox.item,
                previousItem = window.CurrentEmailItem,
                yPosition = window.pageYOffset;

            if (previousItem.itemId === item.itemId){
                return;
            }
            
            var currentEmail = window.Office.cast.item.toItemRead(item);
            currentEmail.archivableAttachments = [];
            for (var i = 0; i < currentEmail.attachments.length; i++) {
                var attachment = currentEmail.attachments[i];
                if (attachment.attachmentType === window.Office.MailboxEnums.AttachmentType.File){
                    currentEmail.archivableAttachments.push(attachment);
                }
            }
            window.CurrentEmailItem = currentEmail;

            if (previousItem === null){
                return;
            }

            WkspUtil.writeTrace("Email has been switched. New email subject: " + item.subject);

            window.CurrentEmailItem = window.Office.cast.item.toItemRead(item);
            WkspUtil.uiShow(WkspUtil.PreSaveSection);
            if (WkspUtil.PreSaveSection === "standardSections"){
                WkspUtil.uiShow("customSearchButton");
            }
            
            WkspUtil.uiHide("savePanel");
            if (WkspUtil.ScorllPositionBeforeSaving !== -1){
                window.scrollTo(0, WkspUtil.ScorllPositionBeforeSaving);
                WkspUtil.ScorllPositionBeforeSaving = -1;
            } else {
                window.scrollTo(0, yPosition);
            }

            if (WkspUtil.SuggestedWkspsView !== null){
                WkspUtil.SuggestedWkspsView.refresh();
            }
        }

    }
);


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/folder/impl/folder',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"List-item\">\r\n    <div class=\"wkspItem listItemFolder\" id=\"wkspFolderItem\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">\r\n        <span class=\"wksp-expand-icon\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"><div id=\"toggleIcon\" class=\""
    + this.escapeExpression(((helper = (helper = helpers.toggleStatus || (depth0 != null ? depth0.toggleStatus : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toggleStatus","hash":{}}) : helper)))
    + "\" tabindex=\""
    + this.escapeExpression(((helper = (helper = helpers.tabIndex || (depth0 != null ? depth0.tabIndex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tabIndex","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.typeName || (depth0 != null ? depth0.typeName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"typeName","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" /></span>\r\n        <span class=\"wkspItemIcon\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">\r\n            <div class=\""
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"></div>\r\n        </span>\r\n        \r\n        <div data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" class=\"wkspItemName\"  tabindex=\"0\" id=\"folderNameDiv\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + " </div>\r\n        <div class=\"wkspFolder-actiondiv binf-fade\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" style=\"display:none\">\r\n            <div id=\"folderActionBar\" class=\"wkspFolder-actionbar wkspFolder-actionbar-bubble\" >\r\n                <ul class=\"wksptile-nav wkspnav wksptile-pills\">\r\n                    \r\n                    <li class=\"needsclick\">\r\n                        <div >\r\n                            <a href=\"#\" id=\"saveEmailButton\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.saveTitle || (depth0 != null ? depth0.saveTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveTitle","hash":{}}) : helper)))
    + " \" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.saveTitle || (depth0 != null ? depth0.saveTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveTitle","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" tabindex=\"0\" >\r\n                                <div class=\"wkspIcon emailSaveIcon\" data-id=\"noToggle\" />\r\n                            </a>            \r\n                        </div>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div id=\"subFolders\"></div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_folder_impl_folder', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/dialog/impl/logindialog',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"modal-dialog modal-sm load-container\">\r\n    <div class=\"binf-modal-dialog \">\r\n        <div class=\"binf-modal-content\">\r\n            <div class=\"binf-modal-header wksp-dialog-header\">\r\n                <img src=\"impl/images/headerbar_content_server.png\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.signInTitle || (depth0 != null ? depth0.signInTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"signInTitle","hash":{}}) : helper)))
    + "\" class=\"signInImage\" />\r\n            </div>\r\n\r\n            <div class=\"wksp-dialog-body\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.signInTitle || (depth0 != null ? depth0.signInTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"signInTitle","hash":{}}) : helper)))
    + "\">\r\n                <div>"
    + this.escapeExpression(((helper = (helper = helpers.signInMessage || (depth0 != null ? depth0.signInMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"signInMessage","hash":{}}) : helper)))
    + "</div>\r\n                <div class=\"errorMessage\" > </div>\r\n                <div>\r\n                    <label for=\"userName\">"
    + this.escapeExpression(((helper = (helper = helpers.usernameLabel || (depth0 != null ? depth0.usernameLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"usernameLabel","hash":{}}) : helper)))
    + "</label> <input class=\"wkspInput\" id=\"userName\" tabindex=\"0\"/>\r\n                </div>\r\n                <div>\r\n                    <label for=\"password\">"
    + this.escapeExpression(((helper = (helper = helpers.passwordLabel || (depth0 != null ? depth0.passwordLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"passwordLabel","hash":{}}) : helper)))
    + "</label> <input class=\"wkspInput\" id=\"password\" type=\"password\" tabindex=\"0\" />\r\n                </div>\r\n            </div>\r\n            \r\n            <div class=\"binf-modal-footer\">\r\n                <button type=\"button\" class=\"binf-btn binf-btn-primary csui-yes csui-default\" tabindex=\"0\" >\r\n                    "
    + this.escapeExpression(((helper = (helper = helpers.signInButtonTitle || (depth0 != null ? depth0.signInButtonTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"signInButtonTitle","hash":{}}) : helper)))
    + "\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_dialog_impl_logindialog', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/dialog/authenticator',['module',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',
    'csui/utils/url',

    'conws/widgets/outlook/impl/utils/utility',
    'hbs!conws/widgets/outlook/impl/dialog/impl/logindialog',
    'i18n!conws/widgets/outlook/impl/nls/lang',
    'csui/behaviors/keyboard.navigation/tabkey.behavior',
    'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, log, base, Url, WkspUtil, template, lang, TabKeyBehavior) {

    var Authenticator = Marionette.ItemView.extend({
        className: function() {
            var className = 'csui-alert binf-modal binf-fade';
            if (this.options.modalClass) {
                className += ' ' + this.options.modalClass;
            }
            return className;
        },

        template: template,

        ui: {
            errorMessage: '.errorMessagae',
            userName: '#userName',
            password: '#password'
        },

        triggers: {
            'click .csui-yes': 'click:yes'
        },

        events: {
            'shown.binf.modal': 'onShown',
            'hide.binf.modal': 'onHiding',
            'hidden.binf.modal': 'onHidden',
            'keyup' : 'processKey'
        },
        behaviors: {
            TabKeyBehavior: {
                behaviorClass: TabKeyBehavior,
                recursiveNavigation: true
            }
        },

        constructor: function LoginDialogView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            var connector = WkspUtil.getConnector(); 
            this.connector = connector;

            var urlObj = new Url(connector.connection.url);
            this.hostName = urlObj.getHost();
            this.ticketCookieName = 'otcsTicket' + this.hostName.replace(/;/g, "_").replace(/=/g, "_").replace(/ /g, "_").replace(/,/g, "_").replace(/-/g, "_");
            this._deferred = $.Deferred();
            this.ssoDeferred = $.Deferred();

            this.errorMessage = '';

            this.llCookie = null;
            this.isSSOMessageReceived = false;

            this.beingAuthenticated = false;
        },

        templateHelpers: function() {
            return {
                signInButtonTitle: lang.signIn_button_Title,
                usernameLabel: lang.signIn_username,
                passwordLabel: lang.signIn_password,
                signInMessage: _.str.sformat(lang.signIn_message, this.hostName),
                signInTitle: lang.signIn_title
            }
        },

        show: function () {
            var self = this,
                promise = self._deferred.promise();

            WkspUtil.stopGlobalSpinner();

            if (self.beingAuthenticated){
                WkspUtil.writeTrace("Bing authenticated, so skip.");
                self._deferred.resolve(false);
                self.beingAuthenticated = false;
            } else{
                self.beingAuthenticated = true;
                WkspUtil.modalOpen();

                this.render();
                this.$el.attr('tabindex', 0);
                if (this.errorMessage) {
                    this.$('.errorMessage').html(this.errorMessage);
                }
                if (this.options.centerVertically) {
                    this.centerVertically();
                }

                this.$el.binf_modal('show');
                this.triggerMethod('show');
    
                promise.close = function () {
                    //console.log("closing model------");
                    self.$el.binf_modal('hide');
                    return promise;
                };
            }

            return promise;
        },

        centerVertically: function() {
            var $clone;
            var top;

            // add clone of modalAlert to document
            $clone = this.$el.clone();
            $clone.css('display', 'block');
            $clone.appendTo($.fn.binf_modal.getDefaultContainer());

            // calculate top of centered position
            top = Math.round(($clone.height() - $clone.find('.binf-modal-content').height()) / 2);
            top = top > 0 ? top : 0;

            $clone.remove();

            // set top of modalAlert
            this.$el.find('.binf-modal-content').css("margin-top", top);
        },

        onShown: function() {
            this._deferred.notify({ state: 'shown' });
            this.$('#userName').focus();
        },

        onHiding: function() {
            this._deferred.notify({ state: 'hiding' });
        },

        onHidden: function (event) {
            WkspUtil.modalClose();
            this.destroy();
            // Trigger callbacks and promises when the hiding animation ended
            if (this.options.callback) {
                this.options.callback(this._result);
            }
            if (this._result) {
                this._deferred.resolve(this._result);
            } else {
                this._deferred.reject(this._result);
            }
        },

        processKey: function(e) {
            if (e.which === 13) {
                this.onClickYes();
            }
        },

        onClickYes: function() {
            var self = this,
                userName = self.$('#userName').val().trim(),
                password = self.$('#password').val().trim(),
                messageArea = self.$('.errorMessage');

            messageArea.html('  ');
            if (!userName || !password) {
                messageArea.html(lang.signIn_required);
                return;
            }

            this.connector.connection.credentials = {
                username: userName,
                password: password,
                domain: ''
            };
            this.connector.confirmingReload = false;
            var authenticator = this.connector.authenticator,
                data = {
                    type: 'POST',
                    data: this.connector.connection.credentials,
                    contentType: "application/x-www-form-urlencoded"
                };

            authenticator.login(data,
                function(connection) {
                    WkspUtil.writeTrace("Authenticated based on username & password.");

                    if (typeof self.connector.connection.session === 'undefined') {
                        self.connector.connection.session = connection.session;
                    }

                    self.options.context.csUser = data.data.username;  
                    WkspUtil.setPersistentSetting(self.ticketCookieName, connection.session.ticket, connection.session.expries);
                    self.connector.timeoutProcessed = false;
                    self._result = true;
                    self.onHidden();
                },
                function(error) {
                    self.connector.timeoutProcessed = false;
                    self.$('.errorMessage').html(WkspUtil.getErrorMessage(error));
                });

        },

        _setTabFocus: function() {
            var tabElements = this.$('*[tabindex=0]'),
                lastIndex = tabElements.length - 1,
                tabShift = event.shiftKey,
                i = this._getStartIndex(lastIndex, tabShift, tabElements);
            if (lastIndex > -1) {
                var activeIndex = (this.activeIndex !== undefined) ? this.activeIndex :
                (tabShift ? 0 : lastIndex);
                do {
                    var $tabElem = $(tabElements[i]);
                    if (base.isVisibleInWindowViewport($tabElem)) {
                        this.activeIndex = i;
                        $tabElem.focus();
                        break;
                    }
                    if (tabShift) {
                        i = (i === 0) ? lastIndex : i - 1;
                    } else {
                        i = (i === lastIndex) ? 0 : i + 1;
                    }
                } while (i !== activeIndex);
            }
            return false;
        },
        _getStartIndex: function(lastIndex, tabShift) {
            var startIndex = 0,
                activeIndex = this.activeIndex;
            if (tabShift) {
                startIndex = lastIndex;
                if (activeIndex !== undefined && activeIndex > 0) {
                    startIndex = this.activeIndex - 1;
                }
            } else {
                if (activeIndex !== undefined && activeIndex < lastIndex) {
                    startIndex = activeIndex + 1;
                }
            }
            return startIndex;
        },

        authenticate: function(options) {
            var self = this,
                authPromise = self._deferred.promise(),
                connection = self.connector.connection,
                url = connection.url;

            // fallback login function
            var login = function(self, ticket) {
                // get ticket from persistent setting if not passed in
                var savedTicket = (typeof ticket === 'undefined') ? WkspUtil.getPersistentSetting(self.ticketCookieName) : ticket;
                if (savedTicket && !self.connector.timeoutProcessed) {
                    connection.session = { ticket: savedTicket };

                    var verifyPromise = self.verifyAuthentication(self, connection);
                    verifyPromise.done(function(result) {
                        self.connector.authenticator.authenticate(options,
                            function(data) {
                                WkspUtil.setPersistentSetting(self.ticketCookieName, self.connector.authenticator.connection.session.ticket, self.connector.authenticator.connection.session.expries);
                                self.connector.timeoutProcessed = false;
                                self._result = true;
                                self._deferred.resolve(self._result);
                            },
                            function(error) {
                                return self.show();
                            });
                    });
                    verifyPromise.fail(function(error) {
                        if (WkspUtil.SSOEnabled) {
                            self.getSSOTicket(self).then(
                                function(data) {
                                    self.connector.timeoutProcessed = false;
                                    if (data) {
                                        WkspUtil.writeTrace("Using existing ticket unsuccessful, renew ticket using SSO.");
                                        connection.session = { 'ticket': data };
                                        self.traceLoginUser(self, connection);
                                        self.connector.confirmingReload = false;
                                        WkspUtil.stopGlobalSpinner();
                                        WkspUtil.setPersistentSetting(self.ticketCookieName, connection.session.ticket, connection.session.expries);
                                        self._result = true;
                                        self._deferred.resolve(self._result);
                                        return self._deferred.promise();
                                    } else {
                                        self.show();
                                    }
                                },
                                function() {
                                    self.show();
                                });
                        } else {
                            self.show();
                        }
                    });

                } else {
                    return self.show();
                }
                return self._deferred.promise();
            };

            var existingTicket, ticketSource;
            if (connection.session && connection.session.ticket) {
                existingTicket = connection.session.ticket;
                ticketSource = "existing connection session";
            } else {
                existingTicket = WkspUtil.getPersistentSetting(self.ticketCookieName);
                ticketSource = "persistent setting"
            }

            if (!self.connector.timeoutProcessed && existingTicket) {
                WkspUtil.writeTrace("Trying to authenticate based on " + ticketSource);
                return login(self, existingTicket);
            }
            else if (WkspUtil.SSOEnabled) {
                WkspUtil.writeTrace("Trying SSO authentication");
                self.getSSOTicket(self).then(
                    function (data) {
                        self.connector.timeoutProcessed = false;
                        if (data) {
                            connection.session = { 'ticket': data };
                            self.traceLoginUser(self, connection);
                            self.connector.confirmingReload = false;
                            WkspUtil.stopGlobalSpinner();
                            WkspUtil.setPersistentSetting(self.ticketCookieName, connection.session.ticket, connection.session.expries);
                            self._result = true;
                            self._deferred.resolve(self._result);
                            return self._deferred.promise();
                        } else {
                            return login(self);
                        }
                    },
                    function () {
                        return login(self);
                    }
                );
            } else {
                return login(self);
            }

            return authPromise;
        },

        getSSOTicket: function(self) {
            if (!WkspUtil.getPersistentSetting("sso_error")) {
                setTimeout(function () {
                    WkspUtil.startGlobalSpinner(true);
                }, 500);

                self.isSSOMessageReceived = false;
                var originDomain = window.ServerOrigin;
                self.messageListener = WkspUtil.registerMessageListener(function(message) { //register the listener to wait for the LLCookie from the child page
                    if (!self.isSSOMessageReceived) {
                        WkspUtil.writeTrace('Received SSO message from: ' + originDomain);
                        self.isSSOMessageReceived = true;
                        WkspUtil.detachMessageListener(self.messageListener, originDomain); //unregister the listener
                        setTimeout(function() {
                            WkspUtil.stopGlobalSpinner();
                        }, 500);
                        self.ssoDeferred.resolve(message.data);
                    }
                }, originDomain);

                var dummyPara = "&tick=" + (new Date()).getTime(); //change the url so the iframe can refresh each time to get SSO message
                var url = window.ServerCgiScript + WkspUtil.SSOLoginURL + dummyPara + "#";
                var src = url + encodeURIComponent(document.location.href); //pass in the current domain
                if (WkspUtil.isSafeURL(src)) {
                    document.getElementById("ssoFrame").src = src; //load the SSO authentication page in a hidden iFrame
                    setTimeout(function() {
                        if (self.isSSOMessageReceived === false) {
                            WkspUtil.writeTrace('SSO timed out.');
                            self.errorMessage = ""; //lang.ssoTimeout; don't show error message when SSO timed out
                            document.getElementById("ssoFrame").src = "";
                            WkspUtil.detachMessageListener(self.messageListener);
                            self.ssoDeferred.reject();
                        }
                    }, 6000);

                    WkspUtil.writeTrace('SSO enabled and token being retrieved.');
                } else {
                    WkspUtil.writeTrace('Unsafe URL found: ' + src);
                    self.ssoDeferred.reject();
                }
            } else {
                self.ssoDeferred.reject();
            }
            return self.ssoDeferred.promise();
        },

        verifyAuthentication: function (self, connection) {
            var defer = $.Deferred();

            $.ajax({
                type: "GET",
                headers: {
                    'otcsticket': connection.session.ticket
                },
                url: connection.url + "/auth",
                success: function (data) {
                    self.options.context.csUser = data.data.name;
                    WkspUtil.writeTrace("Logged in as: " + data.data.name);
                    defer.resolve({ successful: true });
                },
                error: function (error) {
                    defer.reject(error);
                }
            });

            return defer.promise();
        },

        traceLoginUser: function(self, connection) {
            if (WkspUtil.TraceEnabled) {
                $.ajax({
                    type: "GET",
                    headers: {
                        "Content-Type": undefined,
                        'otcsticket': connection.session.ticket
                    },
                    url: connection.url + "/auth",
                    success: function(data) {
                        if (data && data.data && data.data.name) {
                            self.options.context.csUser = data.data.name;
                            WkspUtil.writeTrace("Logged in as: " + data.data.name);
                        } else {
                            WkspUtil.writeTrace("Cannot get login user.");
                        }
                    }
                });
            }
        }
    }); 

    return Authenticator;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/dialog/impl/nameresolver',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"modal-dialog modal-sm load-container\">\r\n    <div class=\"binf-modal-dialog \">\r\n        <div class=\"binf-modal-content\">\r\n            <div class=\"binf-modal-header question-header\">\r\n                <h4 class=\"binf-modal-title\">\r\n                    <span class=\"icon csui-icon-notification-confirmation-white\"></span>\r\n                    <span class=\"title-text\">"
    + this.escapeExpression(((helper = (helper = helpers.titleSaveEmail || (depth0 != null ? depth0.titleSaveEmail : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleSaveEmail","hash":{}}) : helper)))
    + "</span>\r\n                </h4>\r\n            </div>\r\n\r\n            <div class=\"wksp-dialog-body\">\r\n                <div>"
    + this.escapeExpression(((helper = (helper = helpers.validationMessage || (depth0 != null ? depth0.validationMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"validationMessage","hash":{}}) : helper)))
    + "</div>\r\n                <div class=\"errorMessage\"> </div>\r\n                <div>\r\n                    <span>"
    + this.escapeExpression(((helper = (helper = helpers.uniqueNameLabel || (depth0 != null ? depth0.uniqueNameLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueNameLabel","hash":{}}) : helper)))
    + "</span> \r\n                    <textarea class=\"wkspInput wkspEmailName\" id=\"fileName\" tabindex=\"0\"/>\r\n                </div>\r\n\r\n            </div>\r\n            \r\n            <div class=\"binf-modal-footer\">\r\n                <button type=\"button\" class=\"binf-btn binf-btn-primary csui-yes csui-default\" tabindex=\"0\" >\r\n                    "
    + this.escapeExpression(((helper = (helper = helpers.titleOk || (depth0 != null ? depth0.titleOk : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleOk","hash":{}}) : helper)))
    + "\r\n                </button>\r\n                <button type=\"button\" class=\"binf-btn binf-btn-default csui-cancel\" tabindex=\"0\"\r\n                        data-binf-dismiss=\"modal\">\r\n                    "
    + this.escapeExpression(((helper = (helper = helpers.titleCancel || (depth0 != null ? depth0.titleCancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleCancel","hash":{}}) : helper)))
    + "\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_dialog_impl_nameresolver', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/dialog/nameresolver',['module',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',
    'csui/utils/url',
    'csui/utils/requestauthenticator',

    'conws/widgets/outlook/impl/utils/utility',

    'hbs!conws/widgets/outlook/impl/dialog/impl/nameresolver', 

    'i18n!conws/widgets/outlook/impl/nls/lang',
    'csui/behaviors/keyboard.navigation/tabkey.behavior',
    'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, log, base, Url, RequestAuthenticator, WkspUtil, template, lang, TabKeyBehavior) {

    var NameResolver = Marionette.ItemView.extend({
        className: function () {
            var className = 'csui-alert binf-modal binf-fade';
            if (this.options.modalClass) {
                className += ' ' + this.options.modalClass;
            }
            return className;
        },

        template: template,

        ui: {
            errorMessage: '.errorMessagae',
            fileName: '#fileName'
        },

        triggers: {
            'click .csui-yes': 'click:yes'
        },

        events: {
            'shown.binf.modal': 'onShown',
            'hide.binf.modal': 'onHiding',
            'hidden.binf.modal': 'onHidden',
            'keyup': 'processKey',
            "keyup #fileName": "emailNameTyping"
        },

        behaviors: {
            TabKeyBehavior: {
                behaviorClass: TabKeyBehavior,
                recursiveNavigation: true
            }
        },

        constructor: function NameResolver(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            options = this.options;
           
            this.connector = options.connector;
            this._deferred = $.Deferred();
            this.folderId = options.folderId;

            this.proposedName = WkspUtil.escapeNameToCreate(options.originalName);
            this.originalName = this.proposedName;
            this.folderName = options.folderName;
            // url example: https://ecmlink18dev.opentext.net/otcs/cs.exe/api/v1/validation/nodes/names?body={"parent_id":7066352,"names":["RE_ Group project review"]}
            
            this.url = Url.combine(this.connector.connection.url, 'validation/nodes/names');
            this.bodyFormat = '{"parent_id":%d,"names":["%s"]}';
        },

        templateHelpers: function () {
            return {
                validationMessage: this.originalName ? _.str.sformat(lang.validation_name_conflict, this.originalName, this.folderName) : lang.validation_no_subject,
                titleSaveEmail: lang.title_save_email,
                uniqueNameLabel: lang.save_nameNotUnique,
                titleOk: lang.title_ok,
                titleCancel: lang.title_cancel
            }
        },

        show: function () {
            WkspUtil.modalOpen();

            this.render();
            this.$el.attr('tabindex', 0);
            if (this.options.centerVertically) {
                this.centerVertically();
            }
            this.$el.binf_modal('show');
            this.triggerMethod('show');

            if (this.proposedName) {
                this.$('#fileName').val(this.proposedName);
            }
            this.templateHelpers();

            var promise = this._deferred.promise(),
                self = this;
            
            // testable without this on the public interface?
            promise.close = function () {
                self.$el.binf_modal('hide');
                return promise;
            };

            return promise;
        },

        centerVertically: function () {
            var $clone;
            var top;

            // add clone of modalAlert to document
            $clone = this.$el.clone();
            $clone.css('display', 'block');
            $clone.appendTo($.fn.binf_modal.getDefaultContainer());

            // calculate top of centered position
            top = Math.round(($clone.height() - $clone.find('.binf-modal-content').height()) / 2);
            top = top > 0 ? top : 0;

            $clone.remove();

            // set top of modalAlert
            this.$el.find('.binf-modal-content').css("margin-top", top);
        },

        onShown: function () {
            this._deferred.notify({ state: 'shown' });
            this.$('#fileName').focus();

            var nameInput = this.$('#fileName')[0];
            nameInput.style.height = "1px";
            nameInput.style.height = (nameInput.scrollHeight) + "px";
        },

        onHiding: function () {
            this._deferred.notify({ state: 'hiding' });
        },

        onHidden: function (event) {
            WkspUtil.modalClose();

            this.destroy();
            // Trigger callbacks and promises when the hiding animation ended
            if (this.options.callback) {
                this.options.callback(this._result);
            }
            if (this._result) {
                this._deferred.resolve(this._result);
            } else {
                this._deferred.reject(this._result);
            }
        },

        emailNameTyping: function(event) {
            var inputs = this.$("#fileName");
            if (inputs.length === 0) {
                return;
            }

            var nameInput = inputs[0];
            nameInput.style.height = "1px";
            nameInput.style.height = (nameInput.scrollHeight) + "px";
        },

        processKey: function (e) {
            if (e.which === 13) {
                this.onClickYes();
            }
        },

        onClickNo: function () {
            this._result = false;
        },

        onClickYes: function () {
            var self = this,
                fileName = WkspUtil.escapeNameToCreate(self.$('#fileName').val().trim()),
                messageArea = self.$('.errorMessage');

            messageArea.html('  ');

            if (!fileName) {
                messageArea.html(lang.save_enterName);
            } else {
                self.originalName = fileName;
                self.proposedName = fileName;
                self.validate()
                    .done(function (data) {
                        if (data.status) {
                            self.destroy();
                        }
                    });
            }
        },

        _setTabFocus: function () {
            var tabElements = this.$('*[tabindex=0]'),
                lastIndex = tabElements.length - 1,
                tabShift = event.shiftKey,
                i = this._getStartIndex(lastIndex, tabShift, tabElements);
            if (lastIndex > -1) {
                var activeIndex = (this.activeIndex !== undefined) ? this.activeIndex :
                    (tabShift ? 0 : lastIndex);
                do {
                    var $tabElem = $(tabElements[i]);
                    if (base.isVisibleInWindowViewport($tabElem)) {
                        this.activeIndex = i;
                        $tabElem.focus();
                        break;
                    }
                    if (tabShift) {
                        i = (i === 0) ? lastIndex : i - 1;
                    } else {
                        i = (i === lastIndex) ? 0 : i + 1;
                    }
                } while (i !== activeIndex);
            }
            return false;
        },
        _getStartIndex: function (lastIndex, tabShift) {
            var startIndex = 0,
                activeIndex = this.activeIndex;
            if (tabShift) {
                startIndex = lastIndex;
                if (activeIndex !== undefined && activeIndex > 0) {
                    startIndex = this.activeIndex - 1;
                }
            } else {
                if (activeIndex !== undefined && activeIndex < lastIndex) {
                    startIndex = activeIndex + 1;
                }
            }
            return startIndex;
        },

        validate: function(options) {
            var namePromise = this._deferred.promise(),
                self = this,
                url = self.url;

            if (self.proposedName) {
                WkspUtil.startGlobalSpinner();

                var verifyingPromise = self.verifyName(url, self.proposedName);
                verifyingPromise.done(function(data) {
                    if (data.results && data.results.length === 0) {
                        self._result = { success: true, name: self.proposedName };
                        self.onHidden();
                        //WkspUtil.stopGlobalSpinner();
                        self._deferred.resolve(self._result);
                    } else {
                        var firstNewName = self.rename(self.proposedName);
                        self.resolveName(firstNewName, function(newName) {
                            self.proposedName = newName;
                            WkspUtil.stopGlobalSpinner();
                            self.show();
                            self.onShown();
                        });
                    }

                });
                verifyingPromise.fail(function (error, errorText) {
                    WkspUtil.stopGlobalSpinner();
                    var errMsg = errorText;
                    if (error) {
                        errMsg = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error :
                            error.responseText ? error.responseText :
                            error.statusText ? error.statusText : JSON.stringify(error);
                    }
                    self.$('.errorMessage').html(errMsg);
                    self._result = { success: false , status: error.status, errorMessage: errMsg};
                    self._deferred.resolve(self._result);
                });
            } else {
                self.show();
            }

            return namePromise;
        },

        verifyName: function (url, nameToVerify) {
            var self = this,
                ticket = self.connector.connection.session.ticket;

            var body = _.str.sprintf(self.bodyFormat, self.folderId, WkspUtil.escapeNameToVerify(nameToVerify) + ".eml"); 

            return $.ajax({
                type: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'OTCSTicket': ticket
                },
                url: url,
                contentType: false,
                data: {body: body}
            });
        },

        resolveName: function(nameToResolve, callback) {
            var self = this,
                url = self.url;

            var verifyingPromise = self.verifyName(url, nameToResolve);
            verifyingPromise.done(function (data) {
                if (data.results && data.results.length === 0) {
                    callback(nameToResolve);
                } else {
                    var newName = self.rename(nameToResolve);
                    self.resolveName(newName, callback);
                }

            });

        },

        rename: function(originalName) {
            if (!originalName) {
                return null;
            }

            var toRename = originalName.trim();
            if (toRename[toRename.length - 1] === ')') {
                var lastOpenParenthesis = toRename.lastIndexOf('(');
                if (lastOpenParenthesis > 0 && lastOpenParenthesis < toRename.length-2) {
                    var sequence = toRename.substring(lastOpenParenthesis + 1, toRename.length - 1),
                        newSequence = parseInt(sequence, 10);
                    if (sequence === String(newSequence)) {
                        newSequence++;
                        return toRename.substring(0, lastOpenParenthesis + 1) + newSequence + ")";
                    } 
                } 
            } 

            return toRename + " (1)";
        }
    });

    return NameResolver;

});


csui.define('conws/widgets/outlook/impl/utils/csservice',[
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/utils/url',
    'csui/utils/contexts/page/page.context',
    'csui/utils/contexts/factories/connector',
    'csui/dialogs/modal.alert/modal.alert',
    'conws/widgets/outlook/impl/utils/emailservice',
    'conws/widgets/outlook/impl/dialog/authenticator',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/dialog/nameresolver',
    'i18n!conws/widgets/outlook/impl/nls/lang',
    'i18n!csui/utils/impl/nls/lang'
], function CsService(_, $, Url, PageContext, ConnectorFactory, ModalAlert, EmailService, Authenticator, WkspUtil, NameResolver, lang, csuiLang) {

    return {
        save: save,
        confirmSaving: confirmSaving,
        reauthenticate: reauthenticate,
        getSuggestedWksps: getSuggestedWksps,
        filterWksps: filterWksps,
        searchWksps: searchWksps,
        getWkspForEmail: getWkspForEmail,
        getSuggestedWkspConfig: getSuggestedWkspConfig,
        getSimpleSearchQueries: getSimpleSearchQueries,
        getAddinConfig: getAddinConfig,
        resolveNames: resolveNames,
        resolveName: resolveName,
        verifyName: verifyName,
        prepareNames: prepareNames,
        nameExists: nameExists
} 
  
    function save(connector, folderId, emailName, attachments, metadataValues){
        var self = this,
            emailItem = window.CurrentEmailItem,
            saveEmail = emailName ? true : false,
            attachmentNames = "",
            attachmentIds = "",
            attachmentTypes = "",
            saveAttachment = false,
            metadataValueString = metadataValues === undefined ?  "" : JSON.stringify(metadataValues),
            defer = $.Deferred();

            if (attachments != null && attachments.length > 0){
                saveAttachment = true;
                for(var i = 0; i < attachments.length; i++){
                    attachmentNames += i === 0 ? '"' + attachments[i].name + '"' : ',"' + attachments[i].name + '"';
                    attachmentIds += i === 0 ? '"' + attachments[i].id + '"' : ',"' + attachments[i].id + '"';
                    attachmentTypes += i === 0 ? '"' + attachments[i].mimeType + '"' : ',"' + attachments[i].mimeType + '"';
                }
            }
            attachmentNames = "{" + attachmentNames + "}";
            attachmentIds = "{" + attachmentIds + "}";
            attachmentTypes = "{" + attachmentTypes + "}";

      
            var saveSuccessful = "";
            if (saveEmail && saveAttachment){
                saveSuccessful = lang.save_successful_all;
            } else if (saveEmail){
                saveSuccessful = lang.save_successful_email;
            } else if (saveAttachment){
                if (attachments.length > 1){
                    saveSuccessful = lang.save_successful_attachments;
                } else {
                    saveSuccessful = lang.save_successful_attachment;
                }
            }

            WkspUtil.writeTrace("Ready to perform: saving email = " + saveEmail + ", saving attachment(s) = " + saveAttachment);

            if (typeof window.Office === "undefined" || typeof window.Office.context === "undefined" ||
                typeof window.Office.context.mailbox === "undefined"){
                    defer.reject({errorMsg: lang.warning_no_outlook_context});
                    WkspUtil.writeTrace("Could not save email because there is no Outlook context.");

                    return defer.promise();
            }

            window.Office.context.mailbox.getCallbackTokenAsync(function(tokenResult) {
                if (tokenResult.status === 'succeeded') {
                    var dummyEmailContent = "From: Demo <demo@demo.com>\nTo: Demo <demo@demo.com>\nSubject: Content placeholder email\nDate: 1 Jul 2017";
                    var dummyBlob = new Blob([dummyEmailContent], { type: 'message/rfc822' });
                    var formData = new FormData();

                    formData.append("parent_id", folderId);
                    formData.append("ewsUrl", window.Office.context.mailbox.ewsUrl);
                    formData.append("emailId", emailItem.itemId);
                    formData.append("accessToken", tokenResult.value);
                    formData.append("emailName", emailName);
                    formData.append("file", dummyBlob);
                    formData.append("body", metadataValueString);
                    if (saveAttachment){
                        formData.append("attachmentNames", attachmentNames);
                        formData.append("attachmentIds", attachmentIds);
                        formData.append("attachmentTypes", attachmentTypes);
                    }

                    WkspUtil.writeTrace("Calling CS REST to retrieve email content and attachment to save ...");
                    $.ajax({
                        type: "POST",
                        headers: {
                            "Content-Type": undefined,
                            'otcsticket': connector.connection.session.ticket
                        },
                        url: WkspUtil.v1ToV2(connector.connection.url) + "businessworkspaces/outlookaddin/email",
                        contentType: false,
                        data: formData,
                        processData: false,
                        success: function (data) {
                            var successful = false,
                                csRestMsg = "";
                            if (data.results != null && data.results.length > 0) {
                                successful = data.results[0].resultCode === "Success";
                                csRestMsg = data.results[0].message;
                            } else {
                                csRestMsg = "OutlookAddinRestFailed";
                            }

                            if (successful) {
                                defer.resolve({result: saveSuccessful});
                                WkspUtil.writeTrace("Saving the email/attachment to Content Server completed.");
                            } else {
                                defer.reject({errorMsg: _.str.sformat(lang.error_save_email, csRestMsg)});
                                WkspUtil.writeTrace("Saving the email/attachment to Content Server failed with message: " + csRestMsg);
                            }
                        },
                        error: function (error, errorText, obj) {
                            var errMsg = errorText;
                            if (error) {
                                errMsg = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error :
                                    error.responseText ? error.responseText :
                                        error.statusText ? error.statusText : JSON.stringify(error);
                            }
                            if (error.status === 401) {
                                self.reauthenticate(lang.warning_session_expired);
                            } else {
                                defer.reject({errorMsg: _.str.sformat(lang.error_save_email, errMsg)});
                                WkspUtil.writeTrace("Saving the email to Content Server failed with message: " + errMsg);
                            }
                        }
                    });
                } else {
                    // getCallbackTokenAsync unsuccessful 
                    //WkspUtil.stopGlobalSpinner();
                    defer.reject({errorMsg: lang.error_retrieve_token});
                    WkspUtil.writeTrace("Retrieving EWS access token failed.");
                }
            });
        return defer.promise();
    }

    function confirmSaving (needConfirmation, folderName) {
        if (!needConfirmation) {
            return $.Deferred().resolve(true);
        } else {
            WkspUtil.stopGlobalSpinner();
            return ModalAlert.confirmQuestion(_.str.sformat(lang.info_confirm_saving, folderName),
                lang.title_save_email, { buttons: ModalAlert.buttons.OkCancel });
        }
    }

    function reauthenticate (message) {
        var conn = WkspUtil.getConnector();
        if (!conn.timeoutProcessed){
            conn.timeoutProcessed = true;
            WkspUtil.stopGlobalSpinner();
            ModalAlert.showWarning(csuiLang.AuthenticationFailureDialogText, message, {
                buttons: ModalAlert.buttons.Ok
            })
                .always(function () {
                    var context = new PageContext(),
                        connector = conn;

                    context.connector = connector;
                    var authenticator = new Authenticator({ context: context, centerVertically: true });
                    authenticator.authenticate()
                        .done(function(result){
                            authenticator.beingAuthenticated = false;
                        });
                });
        }
    }

    function getSuggestedWksps(connector, emailItem, config) {
        var self = this,
            processes = [],
            defer = $.Deferred(),
            i = 0;

        // For testing without email context
        var dummyEmailItem = null;
        /*
        {
            subject: "Order 155 from customer 0 requrest of product 508 for equipment building 200 from for client 0", //"test email", //
            sender: { displayName: "Nathan", emailAddress: "nathan@SPDC1.com" },
            to: [
                { displayName: "Joe Doe", emailAddress: "joe@spdc1.com" },
                { displayName: "Bill Whites", emailAddress: "bill@jasonwang.onmicrosoft.com" }
            ],
            cc: [
                { displayName: "Derek Miller", emailAddress: "Derek@spdc1.com" },
                { displayName: "Fiona Smith", emailAddress: "fiona@jasonwang.onmicrosoft.com" }
            ]
        }; */
        var email = emailItem != null ? emailItem : dummyEmailItem;

        var filterConfig = WkspUtil.getSuggestedWkspFilters(email, config);
        if (filterConfig != null && filterConfig.rules.length > 0) {
            for (i = 0; i < filterConfig.rules.length; i++) {
                var rule = filterConfig.rules[i];
                var name = rule.filterName.trim();
                if (name) {
                    processes.push(self.filterWksps(connector, rule.typeId, rule.typeName.trim(), name, rule.weight));
                }
            }
        }

        var emailSearchConfig = WkspUtil.getSuggestedWkspEmailSearchConfig(email, config);
        if (emailSearchConfig != null && emailSearchConfig.searchTerm.length > 0) {
            for (i = 0; i < emailSearchConfig.searchTerm.length; i++) {
                var term = emailSearchConfig.searchTerm[i];
                if (term.region != null && term.searchTerm != null) {
                    processes.push(self.searchWksps(connector, term.region, term.searchTerm, emailSearchConfig.sort, emailSearchConfig.weight));
                }
            }
        }

        if (processes.length === 0) {
            setTimeout(function () {
                defer.resolve({ results: [] });
            });
        } else {
            //Promise.all(processes)
            $.whenAll(processes)
                .then(function (values) {
                    var collection = [];
                    var errors = [];
                    for (i = 0; i < values.length; i++) {
                        if (values[i].error != null) {
                            errors.push(values[i].error);
                        } else {
                            Array.prototype.push.apply(collection, (values[i].results));
                        }
                    }
                    // merge duplicates, then sort by suggestedWeight and last modified date
                    var wksps = [];
                    for (i = 0; i < collection.length; i++) {
                        var wkspProp = collection[i].data.properties,
                            foundDuplicate = false;
                        for (var k = 0; k < wksps.length; k++) {
                            if (wkspProp.id === wksps[k].data.properties.id) {
                                wksps[k].data.properties.suggestedWeight += wkspProp.suggestedWeight;

                                var kDate = new Date(wksps[k].data.properties.modifyDate),
                                    iDate = new Date(wkspProp.modifyDate);
                                if (iDate > kDate) {
                                    wksps[k].data.properties.modifyDate = iDate;
                                }

                                foundDuplicate = true;
                                break;
                            }
                        }
                        if (foundDuplicate) {
                            continue;
                        } else {
                            wksps.push(collection[i]);
                        }
                    }
                    var compareWeight = function(a, b) {
                        if (a.data.properties.suggestedWeight > b.data.properties.suggestedWeight) {
                            return -1;
                        }
                        if (a.data.properties.suggestedWeight < b.data.properties.suggestedWeight) {
                            return 1;
                        }
                        var aDate = new Date(a.data.properties.modifyDate),
                            bDate = new Date(b.data.properties.modifyDate);
                        if (aDate > bDate) {
                            return -1;
                        } else {
                            return 1;
                        }
                    };
                    wksps.sort(compareWeight);

                    // Only return the configured number of suggested workspaces
                    var maxNumber = config.general != null && config.general.count != null ? config.general.count : 5;
                    var suggestWksps = wksps.slice(0, maxNumber);

                    // Display error setting, default is false.
                    var displayError = false;

                    if (errors.length > 0) {
                        for (var j = 0; j < errors.length; j++) {
                            WkspUtil.writeTrace("Error reported in retrieving suggested workspace: " + errors[j]);
                        }
                    }

                    var reportedErrors = displayError ? errors : [];

                    defer.resolve({ results: suggestWksps, errors: reportedErrors });
                }, function (error) {
                    defer.reject(WkspUtil.getErrorMessage(error));
                });
        }

        return defer.promise();
    }

    function filterWksps(connector, wkspType, wkspTypeName, wkspName, weight) {
        var defer = $.Deferred(),
            queryString;

        if (wkspType !== -999){
            WkspUtil.writeTrace("Suggested Wksp: filter wksps with typeID '" + wkspType + "' and name contains '" + wkspName + "'");
            queryString = 'where_workspace_type_id=' + wkspType + '&' + 'where_name=contains_' + encodeURIComponent(wkspName);
        } else {
            WkspUtil.writeTrace("Suggested Wksp: filter wksps with type name '" + wkspTypeName + "' and name contains '" + wkspName + "'");
            queryString = 'where_workspace_type_name=' + encodeURIComponent(wkspTypeName) + '&' + 'where_name=contains_' + encodeURIComponent(wkspName);
        }
        
        var url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), 'businessworkspaces?expanded_view=true&' + queryString);
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                var wksps = [];
                if (data != null && data.results != null && data.results.length > 0) {
                    for (var i = 0; i < data.results.length; i++) {
                        var props = data.results[i].data.properties;
                        wksps.push({ data: { properties: { id: props.id, name: props.name, size: props.size, modifyDate: props.modify_date, suggestedWeight: weight, type: 848, container: true } } });
                    }
                }
                defer.resolve({ results: wksps });
            },
            error: function (error) {
                // Passing the error as a resolved result instead of rejecting it.
                defer.resolve({ error: "Filter: " + WkspUtil.getErrorMessage(error) });
            }
        });

        return defer.promise();
    }

    function searchWksps(connector, region, searchTerm, sortBy, weight) {
        var self = this,
            defer = $.Deferred();

        WkspUtil.writeTrace("Suggested Wksp: search emails with region '" + region + "' contains '" + searchTerm + "'");
        var queryString = 'search?where1=%22' + region + '%22:(*' + encodeURIComponent(searchTerm) + '*)&limit=50';
        if (sortBy !== "relevance") {
            queryString += "&sort=desc_OTObjectDate";
        }
        var url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), queryString);
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                var processes = [],
                    wksps = [],
                    i = 0;
                if (data != null && data.results != null && data.results.length > 0) {
                    for (i = 0; i < data.results.length; i++) {
                        var props = data.results[i].data.properties;
                        processes.push(self.getWkspForEmail(connector, props.id, props.modify_date,  weight));
                    }

                    ////Promise.all(processes)   // -- this is not working in IE
                    //$.when.apply($, processes)   // -- this returns only one result
                    //    .done(function (values) {
                    //        for (i = 0; i < values.length; i++) {
                    //            var value = values[i];
                    //            if (value != null) {
                    //                wksps.push(value);
                    //            }
                    //        }
                    //        defer.resolve({ results: wksps });
                    //    })
                    //    .fail(function (error) {
                    //        defer.reject(error);
                    //    });


                    $.whenAll(processes)
                        .then(function(values) {
                            for (i = 0; i < values.length; i++) {
                                var value = values[i];
                                if (value != null) {
                                    wksps.push(value);
                                }
                            }
                            defer.resolve({ results: wksps });
                        }, function(error) {
                            defer.reject(WkspUtil.getErrorMessage(error));
                        });
                } else {
                    defer.resolve({ results: wksps });
                }
            },
            error: function (error) {
                // Passing the error as a resolved result instead of rejecting it.
                defer.resolve({ error: "Search: " + WkspUtil.getErrorMessage(error) });
            }
        });

        return defer.promise();
    }

    function getWkspForEmail(connector, wkspId, modifyDate, weight) {
        var defer = $.Deferred(),
            url = Url.combine(connector.connection.url, "nodes/" + wkspId + "/ancestors");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                var wksp = null;
                if (data != null && data.ancestors != null && data.ancestors.length >= 2) {
                    for (var i = data.ancestors.length - 2; i >= 0; i--) {
                        var node = data.ancestors[i];
                        if (node.type === 848) {
                            wksp = { data: { properties: { id: node.id, name: node.name, size: 1, modifyDate: modifyDate, suggestedWeight: weight, type: 848, container: true } } }; // size > 0 meaning has children.
                            break;
                        }
                    }
                    defer.resolve(wksp);
                } else {
                    defer.resolve(null);
                }
            },
            error: function(error) {
                defer.reject(WkspUtil.getErrorMessage(error));
            }
        });

        return defer.promise();
    }

    function getSuggestedWkspConfig(connector) {
        var defer = $.Deferred(),
            url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), "businessworkspaces/outlookaddin/suggestedworkspacesconfig");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                if (data != null && data.results != null && data.results.resultCode === "Success") {
                    defer.resolve(data.results.config);
                } else if (data == null || data.results == null) {
                    defer.reject(_.str.sformat(lang.error_retrieve_suggestedConfig, "Null Configuration"));
                } else {
                    defer.reject(_.str.sformat(lang.error_retrieve_suggestedConfig, data.results.message));
                }
            },
            error: function (error) {
                defer.reject(WkspUtil.getErrorMessage(error));
            }
        });

        return defer.promise();
    }

    function getSimpleSearchQueries(connector) {
        var defer = $.Deferred(),
            url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), "businessworkspaces/outlookaddin/simplesearchqueries");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                if (data != null && data.results != null && data.results.resultCode === "Success") {
                    defer.resolve(data.results.menuEntries);
                } else if (data == null || data.results == null) {
                    defer.reject(_.str.sformat(lang.error_retrieve_searchQueries, "Null Configuration"));
                } else {
                    defer.reject(_.str.sformat(lang.error_retrieve_searchQueries, data.results.message));
                }
            },
            error: function (error) {
                defer.reject(WkspUtil.getErrorMessage(error));
            }
        });

        return defer.promise();
    }

    function getAddinConfig(connector) {
        var defer = $.Deferred(),
            url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), "businessworkspaces/outlookaddin/config");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                if (data != null && data.results != null && data.results.resultCode === "Success") {
                    defer.resolve(data.results.config);
                } else if (data == null || data.results == null) {
                    defer.reject(_.str.sformat(lang.error_retrieve_config, "Null Configuration"));
                } else {
                    defer.reject(_.str.sformat(lang.error_retrieve_config, data.results.message));
                }
            },
            error: function (error) {
                defer.reject(_.str.sformat(lang.error_retrieve_config, WkspUtil.getErrorMessage(error)));
            }
        });

        return defer.promise();
    }

    function resolveNames(connector, folderId, emailTitleInfo, attachmentInfo){
        var self = this,
            namesToResolve = [],
            resolvedNames = [],
            defer = $.Deferred();

        var url = Url.combine(connector.connection.url, 'validation/nodes/names'),
            ticket = connector.connection.session.ticket;    
        
        if (emailTitleInfo.checked){
            emailTitleInfo.isEmail = true;
            namesToResolve.push(emailTitleInfo);
        }
        if (attachmentInfo != null && attachmentInfo.length ){
            for (var i = 0; i < attachmentInfo.length; i++){
                var info = attachmentInfo[i].data;
                if (info.checked){
                    info.isEmail = false;
                    namesToResolve.push(info);
                }
            }
        }

        var looper = $.Deferred().resolve();
        $.when.apply($, $.map(namesToResolve, function(item, i){
            looper = looper.then(function(){
                var nameToResolve = typeof item.isEmail === "undefined" || ! item.isEmail ? 
                                    item.suggestedName : item.suggestedName + ".eml";

                return self.resolveName(url, ticket, folderId, nameToResolve, item, resolvedNames)
            });
            return looper
        })).then(function(){
                defer.resolve();
            },  function (error) {
                // reject happens at the first fail, then ignore the reset
                var err = Array.isArray(error) && error.length > 0 ? error[0] : error;
                defer.reject(err);
        });

        return defer.promise();
    }

    function verifyName(url, ticket, folderId, names) {
        var bodyFormat = '{"parent_id":%d,"names":[%s]}';

        var escapedNames = [];
        for(var i = 0; i < names.length; i++){
            escapedNames.push(WkspUtil.escapeNameToVerify(names[i]));
        }
        var nameString = '"' + escapedNames.join('","') + '"';
        var body = _.str.sprintf(bodyFormat, folderId, nameString); 

        return $.ajax({
            type: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'OTCSTicket': ticket
            },
            url: url,
            contentType: false,
            data: {body: body}
        });
    }

    function resolveName(url, ticket, folderId, nameToResolve, nameInfo, resolvedNames) {
        var self = this,
            defer = $.Deferred();

        var ensuredName = nameToResolve,
            nameConflicted = false,
            nameCandidates;
        if (!Array.isArray(ensuredName) && resolvedNames.length > 0){
            while (self.nameExists(resolvedNames, ensuredName)){
                nameCandidates = self.prepareNames(ensuredName, 5, resolvedNames);
                ensuredName = nameCandidates[1];
                nameConflicted = true;
            }
        }
        if (!nameConflicted){
            nameCandidates = self.prepareNames(ensuredName, 5, resolvedNames);
        }

        var verifyingPromise = self.verifyName(url, ticket, folderId, nameCandidates);
        verifyingPromise.done(function (data) {
            if (data.results && data.results.length === 0) {
                nameInfo.suggestedName = nameCandidates[0];
                nameInfo.editable = nameConflicted || Array.isArray(ensuredName);
                nameInfo.hasConflict = nameConflicted || Array.isArray(ensuredName);
                resolvedNames.push(nameCandidates[0]);
                defer.resolve();
            } else if (data.results.length === nameCandidates.length) {
                var subPromise = self.resolveName(url, ticket, folderId, nameCandidates, nameInfo, resolvedNames);
                subPromise.done(function (result){
                    defer.resolve();
                });
                subPromise.fail(function (error){
                    defer.reject(error);
                });
            } 
            else {
                for (var i = 0; i < nameCandidates.length; i++){
                    var candidate = nameCandidates[i];
                    var exist = false;
                    for (var j = 0; j < data.results.length; j++){
                        var existName = data.results[j].name;
                        if (candidate.toUpperCase() === existName.toUpperCase()){
                            exist = true;
                            break;
                        }
                    }
                    if (exist){
                        continue;
                    } else {
                        nameInfo.suggestedName = candidate;
                        nameInfo.editable = nameConflicted || i !== 0;
                        nameInfo.hasConflict = nameConflicted || i !== 0;
                        resolvedNames.push(candidate);
                        break;
                    }
                }
                defer.resolve();
            }

        });
        verifyingPromise.fail(function (error, errorDetail) {
            // test and verify session expire
            if (error.status === 401) {
                self.reauthenticate(lang.warning_session_expired);
            } else {
                // Passing the error as a resolved result instead of rejecting it.
                defer.reject(_.str.sformat(lang.error_validate_name, WkspUtil.getErrorMessage(error)));
            }
        });

        return defer.promise();
    }

    function prepareNames(name, nameCount, existingNames){
        var initialRequest = Array.isArray(name) ? false : true;
        var baseName = initialRequest ? name : name[name.length-1];

        var ext = "",
            namePart = baseName,
            lastDot = baseName.lastIndexOf(".");

        if (lastDot >= 0){
            ext = baseName.substring(lastDot).trim();
            namePart = baseName.substring(0, lastDot);
        }

        var regEx = /.*\((\d+)\)$/g;
        var match = regEx.exec(namePart);
        var sequence = 1,
            nameSeed = "",
            hasSequence = false;

        if (match !== null && match.length > 1){
            sequence = parseInt(match[1], 10);
            if (!initialRequest){
                sequence++;
            }
            hasSequence = true;
            nameSeed = namePart.substring(0, namePart.lastIndexOf("("));
        } else {
            nameSeed = namePart;
        }
        nameSeed = nameSeed.trim();
        
        // If not specified, generate 5 name candidates to reduce possible multiple calls
        var count = typeof nameCount === "undefined" || nameCount < 1 ? 5 : nameCount;
        var alreadyExistedNames = typeof existingNames === "undefined" ? [] : existingNames;

        var candidates = [],
            index = 0;
        while (index < count){
            var candidate;
            if (initialRequest && !hasSequence){
                candidate = nameSeed + ext;
                initialRequest = false;
            } else {
                candidate = nameSeed + " (" + sequence + ")" + ext;
                sequence++;
            }

            if (!this.nameExists(alreadyExistedNames, candidate)){
                candidates.push(candidate);
                index++;
            }
        }

        return candidates;
    }

    function nameExists(nameArray, name){
        if (!Array.isArray(nameArray) || nameArray.length === 0){
            return false;
        }
        for (var i = 0; i < nameArray.length; i++){
            if (name.toUpperCase() === nameArray[i].toUpperCase()){
                return true;
            }
        }
        return false;
    }
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/dialog/impl/nameControl',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<td id=\"checkboxTd\" class=\"emailSaveIconTd hiddenArea\">\r\n    <button type=\"button\" id=\"checkButton\" role=\"checkbox\" class=\"checkbox csui-control csui-checkbox\" tabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.saveLabel || (depth0 != null ? depth0.saveLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveLabel","hash":{}}) : helper)))
    + "\">\r\n        <span class=\"checkboxIcon\" id=\"checkboxIcon\"></span>\r\n    </button>\r\n</td>\r\n<td id=\"itemIconTd\" class=\"emailSaveIconTd hiddenArea\"> \r\n    <span class=\"wkspItemIcon\"><div id=\"itemIcon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.typeName || (depth0 != null ? depth0.typeName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"typeName","hash":{}}) : helper)))
    + "\"></div></span>\r\n</td>\r\n<td class=\"emailSaveNameTd\">\r\n    <div style=\"\" class=\"wkspInput nameBox textReadonly textNoWrap\" id=\"itemName\" tabindex=\"-1\"><span></span></div>\r\n</td>\r\n<td id=\"editButtonTd\" class=\"emailSaveIconTd hiddenArea\">\r\n    <span id=\"itemEditIcon\" class=\"nameEdit\" disabled tabindex=\""
    + this.escapeExpression(((helper = (helper = helpers.tabIndex || (depth0 != null ? depth0.tabIndex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tabIndex","hash":{}}) : helper)))
    + "\"></span>\r\n</td>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_dialog_impl_nameControl', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!conws/widgets/outlook/impl/conwsoutlook',[],function(){});
csui.define('conws/widgets/outlook/impl/dialog/nameControl.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette',                             
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'csui/utils/nodesprites',

    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/dialog/impl/nameControl',
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, NodeSprites, WkspUtil, CSService, lang, template) {

    var nameControlView = Marionette.CompositeView.extend({

    tagName: "tr",

    template: template,


    ui: {
        
    },

    events: {
        'click #saveSelectionBack': 'backToPreSave',
        'click #itemEditIcon': 'toggleEdit',
        'click #checkButton': 'clickCheckbox',
        'keyup #itemName': 'nameTyping',
        'blur #itemName': 'ensureName',
        'keyup #itemEditIcon': 'processKey'
    },

    templateHelpers: function () {
        return {
            iconClass: this.mimeType,
            tabIndex: this.checked ? "0" : "-1",
            saveLabel: lang.save_label
        }
    },

    initialize: function(options) {
        
    },

    constructor: function nameControlView(options) {
        Marionette.CompositeView.prototype.constructor.call(this, options);

        var self = this;

        var data = options.model != null ? options.model.get('data') : options.data;

        if (data != null){
            this.showOriginalName = data.showOriginalName != null ? data.showOriginalName : false;
            this.hasConflict = data.hasConflict != null ? data.hasConflict : false;
            var name = "";
            if (this.showOriginalName && this.hasConflict){
                name = data.name ? data.name : lang.name_untitled;
            } else {
                name = data.suggestedName ? data.suggestedName : (data.name ? data.name : lang.name_untitled);
            }
            this.name = name;

            this.showCheckbox = data.showCheckbox != null ? data.showCheckbox : true;
            this.checkboxDisabled = data.checkboxDisabled != null ? data.checkboxDisabled : false;
            this.checked = data.checked != null ? data.checked : false;
            this.showEditButton = data.showEditButton != null ? data.showEditButton : true;
            this.editable = this.showEditButton ? (data.editable != null ? data.editable : false) : false;
            this.showIcon = data.showIcon != null ? data.showIcon : true;
            this.mimeType = data.mimeType ? data.mimeType : "";
            this.wrapping = data.wrapping != null ? data.wrapping : false;
            this.focus = this.editable && (data.hasConflict != null ? data.hasConflict : false);
            this.avoidHighlight = data.avoidHighlight != null ? data.avoidHighlight : false;
        }

        self.renderForm();
    },

    processKey: function(e){
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "itemEditIcon"){
                this.toggleEdit(e);
            }
        }

        //if (e.which === 9 && e.target.id === "folderNameDiv"){
         //   this.showActionBar(e);
        //}
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#saveMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    renderForm: function (model, response, options) {
        var self = this;
        //self.render();

        setTimeout(
            function(){
                self.$("#itemName").text(self.name);
                if (self.showCheckbox){
                    self.$("#checkboxTd").removeClass("hiddenArea");
                }
                if (self.editable){
                    self.$("#editButtonTd").removeClass("hiddenArea");
                    self.switchEditMode(true, self.focus);
                }
                if (self.checked){
                    // the edit button is clickable when this item is checked, even when the checkbox is hidden
                    self.$("#checkboxIcon").addClass("checkboxSelected");
                    self.$("#itemEditIcon").removeAttr("disabled");
                }
                if (self.checkboxDisabled){
                    self.$("#checkboxIcon").removeClass("checkboxSelected");
                    self.$("#checkboxIcon").addClass("checkboxDisabled");
                } 
                if (self.showEditButton){
                    self.$("#editButtonTd").removeClass("hiddenArea");
                }
                if (self.showIcon){
                    self.$("#itemIconTd").removeClass("hiddenArea");

                    var css = "icon " + NodeSprites.findClassByNode({mime_type: self.mimeType});
                    self.$("#itemIcon").addClass(css);
                }
                if (self.wrapping){
                    var nameEditor = self.$("#itemName");
                    nameEditor.removeClass("textNoWrap");
                    //nameEditor[0].style.height = "1px";
                    nameEditor[0].style.height = (nameEditor[0].scrollHeight) + "px";
                } 
                
            }
        )
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },

    toggleEdit: function (args){
        var self = this;
        var editable = args.target.classList.contains("editCancelIcon");
        self.switchEditMode(!editable, true);
        self.avoidHighlight = false;
    },

    switchEditMode: function (editable, focus){
        var self = this;
        var nameEditor = self.$("#itemName");
        if (editable){
            self.$("#itemEditIcon").addClass("editCancelIcon");
            nameEditor.removeClass("textReadonly");
            nameEditor.prop("contenteditable", true);
            nameEditor.attr('tabindex', "0");

            //if (!self.wrapping){
                nameEditor.removeClass("textNoWrap");
                setTimeout(function(){
                    if ( nameEditor[0].scrollHeight >= 30){
                        nameEditor[0].style.height = ( nameEditor[0].scrollHeight) + "px";
                    }
                });
                
            //}

            if (focus){
                setTimeout(function(){
                    self.highlightName();
                });
                
            }
        }else{
            self.$("#itemEditIcon").removeClass("editCancelIcon");
            nameEditor.addClass("textReadonly");
            nameEditor.prop("contenteditable", false);
            nameEditor.attr('tabindex', "-1");

            if (!self.wrapping){
                nameEditor.addClass("textNoWrap");
                nameEditor[0].style.removeProperty("height");
            }
        }
    },

    clickCheckbox: function (args){
        var self = this,
            checkbox = self.$("#checkboxIcon"),
            edit = self.$("#itemEditIcon");

        if (checkbox.hasClass("checkboxDisabled")){
            return;
        }

        var checked = checkbox.hasClass("checkboxSelected");
        var tabIndex = "-1",
            nameEditor = self.$("#itemName");
        if (checked){
            checkbox.removeClass("checkboxSelected");
            edit.attr("disabled", "disabled");
            edit.removeClass("editCancelIcon");
            nameEditor.addClass("textReadonly");
            nameEditor.prop("contenteditable", false);

            if (!self.wrapping){
                nameEditor.addClass("textNoWrap");
                nameEditor[0].style.removeProperty("height");
            }
        } else{
            checkbox.addClass("checkboxSelected");
            edit.removeAttr("disabled");
            tabIndex = "0";
        }

        edit.attr('tabindex', tabIndex);
    },

    nameTyping: function(event) {
        var inputs = this.$("#itemName");
        if (inputs.length === 0) {
            return;
        }
        if (inputs.hasClass("textReadonly")){
            return;
        }
        var nameInput = inputs[0];
        if (nameInput.scrollHeight >= 30){
            nameInput.style.height = "1px";
            nameInput.style.height = (nameInput.scrollHeight) + "px";
        }
    },

    ensureName: function(event){
        var self = this;
        if (!self.$("#itemName").text().trim()){
            self.$("#itemName").text(lang.name_untitled);
        }
    },

    backToPreSave: function(args){
        WkspUtil.uiShow(WkspUtil.PreSaveSection);
        if (WkspUtil.PreSaveSection === "standardSections"){
            WkspUtil.uiShow("customSearchButton");
        }
        WkspUtil.uiHide("saveSelectionPanel");
        WkspUtil.uiHide("savePanel");
    },

    backToStandard: function(args){
        WkspUtil.uiShow("standardSections");
        WkspUtil.uiShow("customSearchButton");
        WkspUtil.uiHide("customSearchSection");
    },

    highlightName: function(){
        var self = this;
        var nameText = self.$("#itemName")[0];

        if (!self.avoidHighlight){
            nameText.focus();

            var range;
            if (document.selection) { // IE
                range = document.body.createTextRange();
                range.moveToElementText(nameText);
                range.select();
            } else if (window.getSelection) {
                range = document.createRange();
                range.selectNodeContents(nameText);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }
        }
    }

  });

  return nameControlView;

});

csui.define('conws/widgets/outlook/impl/metadata/impl/metadata.forms.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/widgets/metadata/metadata.forms',
  'csui/utils/contexts/factories/connector'
], function (module, _, Backbone, CollectionFactory, 
    CreateFormCollection, ConnectorFactory) {

  var CreateFormCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'createForm',
    widgetID: '',

    constructor: function CreateFormCollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var createForms = {};
      if (!(createForms instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        createForms = new CreateFormCollection(createForms.models, _.extend({
          connector: connector,
          action: "create",
          container: options.container,
          node: options.node,
          autoreset: true
        }, createForms.options, config.options));
      }
      this.property = createForms;
    },

    fetch: function (options) {
      return this.property.fetch(this.options);
    }

  });

  return CreateFormCollectionFactory;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/metadata/impl/form.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-panel-heading outlook-heading hiddenArea\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" id=\"propertyTitle\">\r\n    <span class=\"headerIcon sectionToggleIcon\" id=\"toggleIcon\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></span>\r\n    <span>"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n</div>\r\n<div id=\"propertyForm\" class=\"metadata-formitems\"></div>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_metadata_impl_form.item', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/metadata/form.item.view',['csui/lib/marionette',
  'csui/lib/underscore',
  'csui/lib/jquery',

  'csui/controls/form/form.view',
  'conws/widgets/outlook/impl/utils/utility',
  'hbs!conws/widgets/outlook/impl/metadata/impl/form.item'
], function (Marionette, _, $, FormView, WkspUtil, FormItemTemplate) {

  var MetadataFormItemView = Marionette.ItemView.extend({
    tag: 'div',
    className: "customsearch-attr-container",  // Rely on custom view search widget styles to render the form, with minimum overwrites. 

    events: {
      'click #toggleIcon': 'clickToggle',
      'keyup #toggleIcon': 'processKeyUp'
  },

    templateHelpers: function () {
      var roleName = this.model.get("role_name"),
          title = this.model.get("title"),
          id = this.model.get("id");

      return {
        title: roleName === "categories" ? title : id,
        toggleStatus: this.expended ? WkspUtil.ToggleStatusCollapse : WkspUtil.ToggleStatusExpand
      }
    },

    constructor: function MetadataFormItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.model.on('error', this.errorHandle, this);
      this.options.hideNotRequired = options.hideNotRequired || false;
      this.expended = true;
    },

    template: FormItemTemplate,

    onRender: function (e) {
      var formItemRegion = new Marionette.Region({
            el: this.$el.find('.metadata-formitems')
          }),
          formView = new FormView({
            context: this.options.context,
            model: this.model,
            layoutMode: 'singleCol',
            mode: 'create',
            node: this.model.node,
            templateId: this.model.attributes.data.templateId
          });
    
      formItemRegion.show(formView);
      formView.hideNotRequired(this.options.hideNotRequired); 
      if (this.options.hideNotRequired && !this.options.hasRequiredField){
        this.$("#propertyTitle").addClass("hiddenArea");
      } else {
        this.$("#propertyTitle").removeClass("hiddenArea");
      }

      if (this.options.requiredFormCount === 1){
        this.$("#toggleIcon").css("display", "none");
      }
      this.formView = formView;
    },

    onRenderForm: function () {
      this.options.objectView.triggerMethod("render:form");
      return;
    },

    switchToHide: function(hide){
      this.formView.hideNotRequired(hide);
      if (hide && !this.options.hasRequiredField){
        this.$("#propertyTitle").addClass("hiddenArea");
      } else {
        this.$("#propertyTitle").removeClass("hiddenArea");
      }
    },

    clickToggle: function(e){
      this.$("#toggleIcon").toggleClass("sectionExpended");
      if (this.expended){
        this.$("#propertyForm").addClass("hiddenArea");
        this.expended = false;
      } else {
        this.$("#propertyForm").removeClass("hiddenArea");
        this.expended = true;
      }
    },

    processKeyUp: function(e){
      if (e.which === 13) {
          if (e.target.id === "toggleIcon"){
              this.clickToggle(e);
          }
      }
    },
  });

  return MetadataFormItemView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/metadata/impl/metadata.forms',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-saved-search-form\" id=\"metadata-forms\"></div>\r\n<div class=\"header-right\">\r\n    <div class=\"required-field-switch\">\r\n        <span id=\"requiredFieldsLabelId\" class=\"only-required-fields-label\"\r\n              aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.requiredFieldsSwitchTitle || (depth0 != null ? depth0.requiredFieldsSwitchTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"requiredFieldsSwitchTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.requiredFieldsSwitchTitle || (depth0 != null ? depth0.requiredFieldsSwitchTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"requiredFieldsSwitchTitle","hash":{}}) : helper)))
    + "</span>\r\n              <div id=\"required-fields-switch\" class=\"required-fields-switch\"></div>\r\n    </div>\r\n</div>\r\n\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_metadata_impl_metadata.forms', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/metadata/metadata.forms.view',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'csui/lib/jsonpath',
  'csui/controls/tile/behaviors/blocking.behavior',
    
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/page/page.context',
  'csui/controls/form/fields/booleanfield.view',

  'conws/widgets/outlook/impl/metadata/impl/metadata.forms.factory',
  'conws/widgets/outlook/impl/metadata/form.item.view',
  'conws/widgets/outlook/impl/utils/utility',

  'i18n!conws/widgets/outlook/impl/nls/lang',
  'hbs!conws/widgets/outlook/impl/metadata/impl/metadata.forms'
], function (_, $, Marionette, Backbone, jsonPath, BlockingBehavior,
    PerfectScrollingBehavior, NodeModelFactory, PageContext, BooleanFieldView,  
    CreateFormsFactory, MetadataFormItemView, WkspUtil, lang, MetadataFormsTemplate) {

  var MetadataFormsView = Marionette.LayoutView.extend({
    className: "csui-custom-view-search", // Rely on custom view search widget styles to render the form, with minimum overwrites.

    templateHelpers: function () {
      var messages = {
        requiredFieldsTitle: lang.required_fields_title, 
        requiredFieldsSwitchTitle: lang.required_fields_switchLabel
      };
      return messages;
    },

    behaviors: {
      Blocking: {
        behaviorClass: BlockingBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: ".csui-saved-search-form",
        scrollYMarginOffset: 15
      }
    },
    regions: {
      requiredSwitchRegion: "#required-fields-switch"
    },

    constructor: function MetadataFormsView(options) {
      options = options || {};
      options.data || (options.data = {});
      this.context = options.context || (new PageContext());
      this.parentView = options.parentView;

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      
      options.container = this.context.getModel(NodeModelFactory, {attributes: {id: options.parentId }, connector: WkspUtil.getConnector()});
      options.node = this.context.getModel(NodeModelFactory, {attributes: {type: 144, docParentId: options.parentId}, connector: WkspUtil.getConnector()});
     
      this.model = this.context.getCollection(CreateFormsFactory, options);

      this.options.context = this.context;

      this.listenTo(this.model, "sync", this.renderForms);

      this.categoryChecked = false;
      this.hasRequired = false; // including all forms except the 'general' form
      this.requiredFormCount = 0;

      this.requiredFieldSwitchModel = new Backbone.Model({data: false});

      this.$el.on({
        "change input": _.bind(this._refreshDOM, this)
      });

      this.model.fetch();

    },

    _refreshDOM: function () {
      setTimeout(_.bind(function() {
        this.triggerMethod('dom:refresh');
      }, this), 500);
    },

    template: MetadataFormsTemplate,

    renderForms: function (e) {
      var self = this;
      if (self.model.length > 0){
          self.checkRequired(self.model.models);
          
          self.formViews = [];
          var formView;

          for(var i = 0; i < self.model.length; i++){
            var m = self.model.models[i];
            if (m.id === "general"){
              continue;
            } else if (m.get("role_name") === "categories"){
              if (self.hasRequired){
                // show all category forms as long as there is any required field, even it is not from a category.
                formView = new MetadataFormItemView(_.extend(self.options, {model: m, hideNotRequired: false, hasRequiredField: m.attributes.hasRequiredField, requiredFormCount: self.requiredFormCount}));
                self.formViews.push(formView);
                self.appendView("view" + i, formView);
              }
            } else {
              if (m.attributes.hasRequiredField){
                formView = new MetadataFormItemView(_.extend(self.options, {model: m, hideNotRequired: false, hasRequiredField: true, requiredFormCount: self.requiredFormCount}));
                self.formViews.push(formView);
                self.appendView("view" + i, formView);
              }
            }
          }

          if (self.hasRequired){
            self.requiredFieldSwitchView = new BooleanFieldView({
              mode: 'writeonly',
              model: self.requiredFieldSwitchModel,
              labelId: 'requiredFieldsLabelId'
            }); 
            self.getRegion("requiredSwitchRegion").show(self.requiredFieldSwitchView);
            self.listenTo(self.requiredFieldSwitchView, 'field:changed', function (event) {
              self.toggleRequiredFields(event.fieldvalue);  
            });
          }

          self.parentView.metadataFormRetrieved = true;
          self.parentView.model.set("hasRequired", self.hasRequired);

          self.parentView.processMetadata();

      }
    },

    checkRequired: function(models){
      var self = this,
          categoryFormCount = 0;

      if (!self.categoryChecked){
        self.categoryChecked = true;
        for (var i = 0; i < models.length; i++){
          var m = models[i];
          if (m.id === "general"){
            continue;
          }
          if (m.get("role_name") === "categories"){
            categoryFormCount++;
          }

          m.attributes.hasRequiredField = false;
          var reqFields = jsonPath(m.attributes.schema.properties, "$..[?(@.required===true)]");
          if (_.isArray(reqFields) && reqFields.length > 0){
            self.hasRequired = true;
            m.attributes.hasRequiredField = true;
            if (m.get("role_name") !== "categories"){
              self.requiredFormCount++;
            }
          }
        }
        if (self.hasRequired){
          self.requiredFormCount = self.requiredFormCount + categoryFormCount; // we only care of it is > 1 or not.
        }
      }
    },

    toggleRequiredFields: function(hideNotRequired){
      _.each(this.formViews, function(view){
        view.switchToHide(hideNotRequired);
      })
    },

    getValuesToParent: function(e){
      var allValid = true,
          value = {roles: {categories:{}}};

      _.each(this.formViews, function(view){
        if (!view.formView.validate()){
          allValid = false;
          return;
        }
        var roleName = view.formView.model.get("role_name");
        if (roleName === "categories"){
          value.roles.categories[view.formView.model.id] = view.formView.getValues();
        } else {
          value.roles[roleName] = view.formView.getValues();
        }
      })
      if (allValid){
        this.parentView.metadataValue = value;
      }
      return allValid;
    },

    appendView: function(viewId, newView){
      var self = this;
      self.$el.append('<div id="view' + viewId + '">');
      self.addRegion('view' + viewId, '#view' + viewId);
      self['view' + viewId].show(newView);
    },

  });
  return MetadataFormsView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/dialog/impl/saveSection',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div id=\"saveDisplayArea\" class=\"saveDisplayArea\">\r\n    <div id=\"saveSelectionPanel\" class=\"hiddenArea\">\r\n        <div class=\"binf-panel-heading outlook-heading\" >\r\n            <span class=\"headerIcon backwardIcon\" tabindex=\"0\" id=\"saveSectionBack\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.backLabel || (depth0 != null ? depth0.backLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backLabel","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.backLabel || (depth0 != null ? depth0.backLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backLabel","hash":{}}) : helper)))
    + "\"></span>\r\n            <span id=\"saveSectionTitle\"></span>\r\n        </div>\r\n        <div class=\"infoMessage\">"
    + this.escapeExpression(((helper = (helper = helpers.saveInfo || (depth0 != null ? depth0.saveInfo : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveInfo","hash":{}}) : helper)))
    + "</div>\r\n        \r\n        <div id=\"saveMessageArea\" class=\"hiddenArea warningMessage\">\r\n            <span class=\"headerIcon warningIcon\"></span>\r\n            <span id=\"saveMessage\" style=\"display: table;\"></span>\r\n        </div>\r\n        \r\n        <div id=\"saveEmailDiv\" style=\"padding: 5px 5px 5px 30px;\">\r\n            <div style=\"padding: 5px 0 5px 0\">"
    + this.escapeExpression(((helper = (helper = helpers.saveEmailText || (depth0 != null ? depth0.saveEmailText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveEmailText","hash":{}}) : helper)))
    + "</div>\r\n            <table style=\"width:100%;\">\r\n                <tr>\r\n                    <td class=\"emailSaveNameTd\" style=\"padding: 0;\">\r\n                        <table id=\"emailName\" class=\"emailSaveTable\"></table>\r\n                    </td>\r\n                </tr>\r\n            </table>\r\n            \r\n        </div>\r\n        <div id=\"saveAttachmentDiv\" style=\"padding: 10px 5px 5px 30px;\">\r\n            <div style=\"padding: 5px 0 5px 0\">"
    + this.escapeExpression(((helper = (helper = helpers.saveAttachmentText || (depth0 != null ? depth0.saveAttachmentText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveAttachmentText","hash":{}}) : helper)))
    + "</div>\r\n            <table style=\"width:100%;\">\r\n                <tr id=\"attachmentOptionTr\">\r\n                    <td class=\"emailSaveIconTd\">\r\n                        <button type=\"button\" id=\"saveAttachmentCheckbox\" role=\"checkbox\" class=\"checkbox csui-control csui-checkbox\" tabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.saveLabel || (depth0 != null ? depth0.saveLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveLabel","hash":{}}) : helper)))
    + "\">\r\n                            <span class=\"checkboxIcon\" id=\"saveAttachmentCheckboxIcon\"></span>\r\n                        </button>\r\n                    </td>\r\n                    <td class=\"emailSaveNameTd\"> \r\n                        <span style=\"padding: 0 0 0 8px;\">"
    + this.escapeExpression(((helper = (helper = helpers.saveAttachmentOption || (depth0 != null ? depth0.saveAttachmentOption : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveAttachmentOption","hash":{}}) : helper)))
    + "</span>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td colspan=\"2\" class=\"emailSaveNameTd\" style=\"padding: 10px 3px 5px 0;\">\r\n                        <table id=\"emailAttachment\" class=\"emailSaveTable\"></table>\r\n                    </td>\r\n                </tr>\r\n            </table>\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <div id=\"metadataPanel\" class=\"hiddenArea metadataForm\">\r\n        <div class=\"binf-panel-heading outlook-heading\" >\r\n            <span class=\"headerIcon backwardIcon\" tabindex=\"0\" id=\"metadataFormBack\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.backLabel || (depth0 != null ? depth0.backLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backLabel","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.backLabel || (depth0 != null ? depth0.backLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backLabel","hash":{}}) : helper)))
    + "\"></span>\r\n            <span>"
    + this.escapeExpression(((helper = (helper = helpers.requiredFieldsTitle || (depth0 != null ? depth0.requiredFieldsTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"requiredFieldsTitle","hash":{}}) : helper)))
    + "</span>\r\n        </div>\r\n        <div class=\"infoMessage\">"
    + this.escapeExpression(((helper = (helper = helpers.saveInfo || (depth0 != null ? depth0.saveInfo : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveInfo","hash":{}}) : helper)))
    + "</div>\r\n        <div id=\"metadataMessageArea\" class=\"hiddenArea warningMessage\">\r\n            <span class=\"headerIcon warningIcon\"></span>\r\n            <span id=\"metadataMessage\" style=\"display: table;\"></span>\r\n        </div>\r\n        <div id=\"metadataDiv\"></div>\r\n    </div>\r\n\r\n    <div id=\"saveResultPanel\" class=\"hiddenArea\">\r\n        <div class=\"binf-panel-heading outlook-heading\" >\r\n            <span id=\"saveResultTitle\"></span>\r\n        </div>    \r\n        <div id=\"saveResult\" style=\"position:relative; padding: 0 25px 0 25px; line-height: 150%\"></div>\r\n    </div>\r\n\r\n    <div class=\"wkspMessageArea\" id=\"saveMsgArea\"></div>\r\n</div>\r\n<div class=\"saveSectionButton outlook-heading binf-panel-heading\" id=\"saveNextButton\" tabindex=\"0\"></div>\r\n\r\n\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_dialog_impl_saveSection', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/dialog/saveSection.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette3',                             
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',
    'conws/widgets/outlook/impl/utils/emailservice',
    'conws/widgets/outlook/impl/dialog/nameControl.view',
    'conws/widgets/outlook/impl/metadata/metadata.forms.view',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/dialog/impl/saveSection',
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, WkspUtil, CSService, EmailService, NameView, MetadataFormsView, lang, template) {

    var saveSectionView = Marionette.CompositeView.extend({

    template: template,

    childView: NameView,
    childEvents:{
        'change:status': 'onStatusChange'
    },


    childViewContainer: '#emailAttachment',

    events: {
        'click #saveSectionBack': 'clickBack',
        'click #saveEmailDiv #checkButton': 'clickSaveEmail',
        'click #saveAttachmentCheckbox': 'clickSaveAttachment',
        'click #saveAttachmentDiv #checkButton': 'clickOneAttachment',
        'click #saveNextButton': 'clickNext',
        'keyup #saveSectionBack, #saveNextButton, #metadataFormBack': 'processKey',
        'click #metadataFormBack': 'clickMetadataBack'
    },

    templateContext: function () {
        return {
            saveEmailText: this.hasAttachment ? lang.save_email_text : lang.save_email_text_noAttachment,
            saveAttachmentText: lang.save_attachment_text,
            saveAttachmentOption: lang.save_attachment_option,
            saveInfo: _.str.sformat(lang.save_email_info, this.folderName),
            requiredFieldsTitle: lang.required_fields_title,
            saveLabel: lang.save_label,
            backLabel: lang.save_button_back
        }
    },

    initialize: function(options) {
        this.stageCode = {
            initial: 1,
            nameChecking: 2,
            metadata: 3,
            finished: 4
        };
        this.model = new Backbone.Model({});
        //this.listenTo(this.model, 'change', this.processMetadata);
    },

    constructor: function saveSectionView(options) {
        Marionette.CompositeView.prototype.constructor.call(this, options);

        var self = this;
        
        self.connector = options.connector;
        self.folderId = options.folderId;
        self.folderName = options.folderName;

        self.saveStage = self.stageCode.initial; // All saving stages: initial, nameChecking, metadata, finished 
        self.saveEmail = true;
        self.nothingToSave = false;
        self.hasAttachment = options.attachments != null && options.attachments.length > 0 ? true : false;
        
        self.attachments = options.attachments;
        self.emailTitleInfo = {name: options.proposedEmailName,
                        showCheckbox: self.hasAttachment,
                        checkboxDisabled: false,
                        editable: false,
                        hasConflict: false,
                        focus: false}

        self.attachmentInfo = [];
        if (self.attachments != null){
            self.attachments.forEach(function(element){
                self.attachmentInfo.push({
                    data: {
                        name: element.name, 
                        id: element.id, 
                        mimeType: element.contentType, 
                        attachmentType: element.attachmentType,
                        checked: false,
                        focus: false,
                        hasConflict: false
                    }
                });
            })
        }

        self.metadataFormView = null;
        self.metadataFormRetrieved = false;
        self.hasRequiredMetadata = false;
        self.requiredMetadataResolved = false;
        self.metadataValue = {};
        self.previousStage = self.stageCode.initial;

        self.saveFailed = false;
        self.saveMessage = "";

        if (self.hasAttachment){
            self.collection = new Backbone.Collection(self.attachmentInfo);
        }

        self.renderForm();
    },

    processKey: function(e){
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "saveSectionBack"){
                this.clickBack(e);
            } else if (e.target.id === "saveNextButton"){
                this.clickNext(e);
            } else if (e.target.id === "metadataFormBack"){
                this.clickMetadataBack(e);
            }
        }
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#saveMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    onStatusChange: function(model, value, options){
        this.render();
    },

    renderForm: function (model, response, options) {
        var self = this;

       self.renderChildren();

        if (self.saveStage === self.stageCode.initial){
            WkspUtil.ConflictHighlighted = false;
        }
        
        setTimeout(function(){ 

            $('#saveDisplayArea').css('height', 'calc(100vh - ' + (36 + WkspUtil.TraceAreaHeight) + 'px)');
            $('#saveResult').css('top', 'calc(40vh - ' + (36 + WkspUtil.TraceAreaHeight/2) + 'px)');
            
            var emailNameRegion = new Marionette.Region({
                el: '#emailName'
            });
            var emailTitle = "";
            if (self.saveStage === self.stageCode.initial){
                emailTitle = self.emailTitleInfo.name;
            } else {
                var pos = self.emailTitleInfo.suggestedName.lastIndexOf(".eml");
                if (pos > 0){
                    emailTitle = self.emailTitleInfo.suggestedName.substring(0, pos);
                } else {
                    emailTitle = self.emailTitleInfo.suggestedName;
                }
            }
            emailNameRegion.show(new NameView({ 
                data: {context: self.context,
                       name: self.emailTitleInfo.name,
                       suggestedName: emailTitle,
                       showIcon: false,
                       showCheckbox: self.hasAttachment,
                       checkboxDisabled: !self.hasAttachment,
                       checked: self.saveEmail,
                       wrapping: true,
                       showOriginalName: self.emailTitleInfo.showOriginalName,
                       hasConflict: self.emailTitleInfo.hasConflict,
                       editable: self.emailTitleInfo.editable,
                       focus: self.emailTitleInfo.focus }}));
            
            WkspUtil.uiShow("saveSelectionPanel");

            self.$("#saveNextButton").text(lang.save_button_next);
            if (self.saveStage === self.stageCode.initial){
                WkspUtil.uiHide(WkspUtil.PreSaveSection);
                if (WkspUtil.PreSaveSection === "standardSections"){
                    WkspUtil.uiHide("customSearchButton");
                }
                WkspUtil.uiShow("savePanel");
                WkspUtil.uiShow("saveSelectionPanel");
                self.$("#saveSectionTitle").text(lang.title_save_email);
                WkspUtil.uiHide("metadataPanel");
                WkspUtil.uiHide("saveMessageArea");
            } else if (self.saveStage === self.stageCode.nameChecking) {
                self.$("#saveSectionTitle").text(lang.save_selection_conflict);
                WkspUtil.uiShow("saveMessageArea");
                self.$("#saveMessage").html(lang.save_selection_conflict_msg);
            } else if (self.saveStage === self.stageCode.metadata){
                self.$("#saveSectionTitle").text(lang.required_fields_title);
                WkspUtil.uiShow("metadataPanel");
                WkspUtil.uiHide("saveSelectionPanel");
                WkspUtil.uiHide("saveResultPanel");
            } else if (self.saveStage === self.stageCode.finished){
                WkspUtil.uiHide("saveSelectionPanel");
                WkspUtil.uiHide("metadataPanel");
                WkspUtil.uiShow("saveResultPanel");
                self.$("#saveNextButton").text(lang.save_button_close);
                self.$("#saveResult").text(self.saveMessage);
                self.$("#saveResultTitle").text(self.saveTitle);
            }
            
            var attachmentOption = 0; // 0 unchecked, 1 checked, 2 mixed
            for(var i = 0; i < self.attachmentInfo.length; i++){
                var info = self.attachmentInfo[i].data;
                if (i === 0){
                    attachmentOption = info.checked ? 1 : 0;
                } else if ((info.checked && attachmentOption === 0) ||
                           (!info.checked && attachmentOption === 1)){
                        attachmentOption = 2;
                        break;
                }
            }
            self.$("#saveAttachmentCheckboxIcon").removeClass("checkboxSelected checkboxMixed");
            var attachmentClass = attachmentOption === 1 ? "checkboxSelected" : (attachmentOption === 2 ? "checkboxMixed" : "" );
            self.$("#saveAttachmentCheckboxIcon").addClass(attachmentClass);

            if (!self.hasAttachment){
                WkspUtil.uiHide("saveAttachmentDiv");
            } else if (self.attachments.length === 1){
                WkspUtil.uiHide("attachmentOptionTr");
            }

            if (self.nothingToSave){
                WkspUtil.uiShow("saveMessageArea");
                self.$("#saveNextButton").addClass("buttonDisabled");
                self.$("#saveMessage").html(lang.save_noSelection);
            }
        });
        
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },


    clickBack: function(args){
        var self = this;
        if (self.saveStage === self.stageCode.initial){
            WkspUtil.uiShow(WkspUtil.PreSaveSection);
            if (WkspUtil.PreSaveSection === "standardSections"){
                WkspUtil.uiShow("customSearchButton");
            }
            WkspUtil.uiHide("saveSelectionPanel");
            WkspUtil.uiHide("savePanel");
            window.scrollTo(0, WkspUtil.ScorllPositionBeforeSaving);
            WkspUtil.ScorllPositionBeforeSaving = -1;
        } else if (self.saveStage === self.stageCode.nameChecking){
            self.emailTitleInfo.showOriginalName = true;
            self.emailTitleInfo.editable = false;
            for (var i = 0; i < self.attachmentInfo.length; i++){
                var info = self.attachmentInfo[i].data;
                info.showOriginalName = true;
                info.editable = false;
            }
            self.saveStage = self.stageCode.initial;
            self.renderForm();
        } else if (self.saveStage === self.stageCode.metadata){
            self.saveStage = self.previousStage;
            self.renderForm();
        }
        $("#conwsoutlook-body").focus();
    },

    backToStandard: function(args){
        WkspUtil.uiShow("standardSections");
        WkspUtil.uiShow("customSearchButton");
        WkspUtil.uiHide("customSearchSection");
    },

    clickMetadataBack: function(args){
        WkspUtil.uiShow("saveSelectionPanel");
        WkspUtil.uiHide("metadataPanel");
        this.saveStage = this.previousStage;
        this.$("#saveSectionBack").focus();
    },

    clickSaveAttachment: function(args){
        var self = this,
            icon = self.$("#saveAttachmentCheckboxIcon");
        var checked = icon.hasClass("checkboxSelected");
        icon.removeClass("checkboxMixed");
        if (checked){
            icon.removeClass("checkboxSelected");
        } else{
            icon.addClass("checkboxSelected");
            if (self.$("#saveNextButton").hasClass("buttonDisabled")){
                self.$("#saveNextButton").removeClass("buttonDisabled");
                WkspUtil.uiHide("saveMessageArea");
            }
        }

        self.$("#saveAttachmentDiv #checkboxIcon").each(function(i, obj){
            if (checked){
                $(obj).removeClass("checkboxSelected");
            } else{
                $(obj).addClass("checkboxSelected");
            }
        });

        self.$("#saveAttachmentDiv #itemEditIcon").each(function(i, obj){
            if (checked){
                $(obj).attr("disabled", "disabled");
                $(obj).removeClass("editCancelIcon");
                $(obj).attr("tabindex", "-1");
            } else{
                $(obj).removeAttr("disabled");
                $(obj).attr("tabindex", "0");
            }
        });

        self.$("#saveAttachmentDiv #itemName").each(function(i, obj){
            if (checked){
                $(obj).addClass("textReadonly");
                $(obj).prop("contenteditable", false);

                $(obj).addClass("textNoWrap");
                obj.style.removeProperty("height");
            } 
        });
    },

    clickOneAttachment: function(args){
        var self = this;
        var thisCheckbox = args.target; 
        if (args.target.id === "checkButton"){
            thisCheckbox = args.target.querySelector("span");
        }
        var allBox = self.$("#saveAttachmentCheckboxIcon");
        var attachmentBoxes = self.$("#saveAttachmentDiv #checkboxIcon");


        var changeToSelected = thisCheckbox.classList.contains("checkboxSelected") ? true : false;
        var changeToMix = false;
        attachmentBoxes.each(function(i, obj){
            if (obj !== thisCheckbox){
                if (obj.classList.contains("checkboxSelected") !== changeToSelected){
                    changeToMix = true;
                    return false; // 'break' for jQuery loop
                }
            }
        });

        if (changeToMix) {
            allBox.removeClass("checkboxSelected");
            allBox.addClass("checkboxMixed");
        } else{
            allBox.removeClass("checkboxMixed");
            if (changeToSelected){
                allBox.addClass("checkboxSelected");
            } else {
                allBox.removeClass("checkboxSelected");
            }
        }

        if (changeToSelected && self.$("#saveNextButton").hasClass("buttonDisabled")){
            self.$("#saveNextButton").removeClass("buttonDisabled");
            WkspUtil.uiHide("saveMessageArea");
        }
    },

    clickSaveEmail: function(args){
        var self = this;
        if (!self.$("#saveEmailDiv #checkButton").hasClass("checkboxSelected") && 
            self.$("#saveNextButton").hasClass("buttonDisabled")){
            self.$("#saveNextButton").removeClass("buttonDisabled");
            WkspUtil.uiHide("saveMessageArea");
        }
    },

    clickNext: function(args){
        var self = this;

        if (self.$("#saveNextButton").hasClass("buttonDisabled")){
            return;
        }

        if (self.saveStage === self.stageCode.initial || self.saveStage === self.stageCode.nameChecking){
            self.previousStage = self.saveStage;
            self.collectInfo();

            if (self.nothingToSave){
                self.renderForm();
            } else {
                WkspUtil.startGlobalSpinner();
                self.saveStage = self.stageCode.nameChecking;

                var nameResolvingPromise = CSService.resolveNames(self.connector, self.folderId, self.emailTitleInfo, self.attachmentInfo);
                nameResolvingPromise.done(function(result){
                    var nameCheckingPassed = true;
                    self.savingEmailName = self.emailTitleInfo.checked ? self.emailTitleInfo.suggestedName : "";
                    self.savingAttachments = [];

                    if (self.emailTitleInfo.hasConflict){
                        nameCheckingPassed = false;
                    }
                    
                    for (var i = 0; i < self.attachmentInfo.length; i++){
                        var info = self.attachmentInfo[i].data;
                        if (!nameCheckingPassed){
                            info.avoidHighlight = true;
                        }
                        if (info.hasConflict){
                            nameCheckingPassed = false;
                        }

                        if (info.checked){
                            self.savingAttachments.push({name: info.suggestedName,
                                                    id: info.id,
                                                    mimeType: info.mimeType})
                        }
                    }

                    if (nameCheckingPassed) {
                        self.saveStage = self.stageCode.metadata;
                        var metadataRegion = new Marionette.Region({
                            el: '#metadataDiv'
                        });

                        // Verify if there are required metadata. If there is none, then the metadata form won't show up.
                        if (!self.metadataFormRetrieved){
                            self.metadataFormView = new MetadataFormsView({ 
                                parentId: self.folderId,
                                parentView: self
                            });
                            metadataRegion.show(self.metadataFormView);
                        } else if (self.hasRequiredMetadata){
                            WkspUtil.uiHide("saveSelectionPanel");
                            WkspUtil.uiShow("metadataPanel");
                            WkspUtil.stopGlobalSpinner();
                        } else {
                            self.processMetadata();
                        }

                    } else {
                        //self.collection = new Backbone.Collection(self.attachmentInfo);
                        WkspUtil.stopGlobalSpinner();
                        self.renderForm();
                    }
                });
                nameResolvingPromise.fail(function(error){
                    // Go to saving stage, set the stage to "finished", and display the name resolving error message.
                    self.saveStage = self.stageCode.finished;
                    self.saveFailed = true;
                    self.saveMessage = WkspUtil.getErrorMessage(error);
                    self.saveTitle = lang.title_save_error;
                    WkspUtil.stopGlobalSpinner();
                    self.renderForm();
                });
            }
        } else if (self.saveStage === self.stageCode.metadata) {
            var allValid = self.metadataFormView.getValuesToParent();
            if (allValid){
                WkspUtil.startGlobalSpinner();
                WkspUtil.uiHide("metadataMessageArea");
                self.processSave();
            } else {
                WkspUtil.uiShow("metadataMessageArea");
                self.$("#metadataMessage").html(lang.save_metadate_form_invalid);
            }
        } else if (self.saveStage === self.stageCode.finished){
            WkspUtil.SavingSubmitted = false;
            if (WkspUtil.EmailChangedAfterSaving){
                EmailService.emailItemChanged({});
            } else {
                WkspUtil.uiShow(WkspUtil.PreSaveSection);
                if (WkspUtil.PreSaveSection === "standardSections"){
                    WkspUtil.uiShow("customSearchButton");
                }
                WkspUtil.uiHide("savePanel");
                window.scrollTo(0, WkspUtil.ScorllPositionBeforeSaving);
                WkspUtil.ScorllPositionBeforeSaving = -1;
            }
        }
        $("#conwsoutlook-body").focus();
    },

    processMetadata: function(){
        var self = this;

        self.hasRequiredMetadata = self.model.get('hasRequired') || false;

        if (!self.metadataFormRetrieved && !self.hasRequiredMetadata){
            self.metadataFormRetrieved = true;
            return;
        }
        self.metadataFormRetrieved = true;
        if (!self.hasRequiredMetadata){
            // Go to saving stage
            self.processSave();
        } else {
            WkspUtil.stopGlobalSpinner();
            WkspUtil.uiHide("saveSelectionPanel");
            WkspUtil.uiShow("metadataPanel");
        }
    },

    processSave: function () {
        var self = this;
        self.saveStage = self.stageCode.finished;

        WkspUtil.SavingSubmitted = true;

        var savePromise = CSService.save(self.connector, self.folderId, self.savingEmailName, self.savingAttachments, self.metadataValue);
        savePromise.done(function (result) {
            self.saveFailed = false;
            self.saveMessage = result.result;
            self.saveTitle = lang.title_save_success;
            WkspUtil.stopGlobalSpinner();
            self.renderForm();
        });
        savePromise.fail(function (error) {
            self.saveFailed = true;
            self.saveMessage = error.errorMsg;
            self.saveTitle = lang.title_save_error;
            WkspUtil.stopGlobalSpinner();
            self.renderForm();
        });
    },

    collectInfo: function(){
        var self = this;
        self.nothingToSave = true;
        self.emailTitleInfo.suggestedName = WkspUtil.escapeNameToCreate(self.$("#emailName #itemName").text().trim());
        self.emailTitleInfo.showOriginalName = false;
        // When there is no attachment, the email saving check box is disabled.
        self.saveEmail = self.$("#saveEmailDiv #checkboxIcon").hasClass("checkboxSelected") ||
                        self.$("#saveEmailDiv #checkboxIcon").hasClass("checkboxDisabled");
        self.emailTitleInfo.checked = self.saveEmail;
        if (!self.saveEmail){
            self.emailTitleInfo.editable = false;
            self.emailTitleInfo.hasConflict = false;
            self.emailTitleInfo.focus = false;
            
        } else {
            self.nothingToSave = false;
        }

        var attachmentBoxes = self.$("#saveAttachmentDiv #checkboxIcon");
        var attachmentNames = self.$("#saveAttachmentDiv #itemName");

        for(var i=0; i < self.attachmentInfo.length; i++){
            var info = self.attachmentInfo[i].data;
            info.checked = attachmentBoxes.eq(i).hasClass("checkboxSelected");
            if (self.nothingToSave && info.checked){
                self.nothingToSave = false;
            }
            info.suggestedName = WkspUtil.escapeNameToCreate(attachmentNames.eq(i).text().trim());
            info.editable = !attachmentNames.eq(i).hasClass("textReadonly");
            info.showOriginalName = false;
            info.avoidHighlight = false;
            info.hasConflict = false;
            //info.focus = true;
        }
        
        //var resolvePromise = 
    }

  });

  return saveSectionView;

});

csui.define('conws/widgets/outlook/impl/folder/folder.view',[
    'csui/lib/underscore',
    "csui/lib/jquery",
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/utils/contexts/page/page.context',
    'csui/dialogs/modal.alert/modal.alert',

    'conws/widgets/outlook/impl/utils/emailservice',
    'hbs!conws/widgets/outlook/impl/folder/impl/folder',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/dialog/saveSection.view',
    'i18n!conws/widgets/outlook/impl/nls/lang', 
    'css!conws/widgets/outlook/impl/conwsoutlook' 

], function (_, $, Backbone, Marionette, PageContext, ModalAlert, EmailService, template, WkspUtil, SaveView, lang) {
    var FolderView = Marionette.LayoutView.extend({
        className: 'FolderItem',

        template: template,

        templateHelpers: function () {
            return {
                serverOrigin: window.ServerOrigin,
                supportFolder: window.ContentServerSupportPath,
                iconClass: this.iconClass,         
                id: this.id,
                name: this.name,
                typeName: this.typeName,
                toggleStatus: this.hasChild ? WkspUtil.ToggleStatusExpand : WkspUtil.ToggleStatusEmpty,
                tabIndex: this.hasChild ? "0" : "-1",
                saveTitle: lang.title_save_email
            }
        },

        regions: {
            subFolders: '#subFolders'
        },

        ui: {
            $actionBar: '.wkspFolder-actiondiv',
            $toggleIcon: '#toggleIcon'
        },

        events: {
            'click .listItemFolder': 'clickFolder',
            'mouseenter #wkspFolderItem': 'showActionBar',
            'mouseleave #wkspFolderItem': 'hideActionBar',
            'click #saveEmailButton': 'saveEmail',
            'focusin #saveEmailButton': 'buttonFocused',
            'focusout #saveEmailButton, #folderNameDiv': 'buttonFocusOut',
            'keyup #toggleIcon, #folderNameDiv, #saveEmailButton': 'processKeyUp',
            'keydown #folderNameDiv, #saveEmailButton': 'processKeyDown'
        },

        initialize: function (options) {
            this.listenTo(this.model, 'change', this.renderToggleIcon);
        },

        constructor: function FolderView(options) {
            this.model = options.model;
            this.name = options.model.get('data').properties.name;
            this.id = options.model.get('data').properties.id;
            this.type = options.model.get('data').properties.type;
            this.typeName = options.model.get('data').properties.type_name;
            this.hasChild = options.model.get('data').properties.container_size > 0;
            this.connector = WkspUtil.getConnector();

            this.folderRetrieved = false;
            this.folderExpended = false;

            this.iconClass = "wkspFolderIcon";
            if (this.type === 751){
                this.iconClass = "wkspEmailFolderIcon";
            } else if (this.type === 136){
                this.iconClass = "csui-icon compound_document listItemIcon";
            }

            Marionette.LayoutView.prototype.constructor.call(this, options);
        },

        clickFolder: function (e) {
            if (event.target.id === "saveEmailButton"){
                return;
            }

            var self = this;

            if (!self.hasChild) {
                return;
            }

            var targetId = $(e.target).data("id");

            if (targetId !== self.id || targetId === "noToggle") {
                return;
            }

            // This might cause issue in unit test. Revisit later for better solution
            var FoldersView = (window.csui) ? window.csui.require('conws/widgets/outlook/impl/folder/folders.view') :
                window.require('conws/widgets/outlook/impl/folder/folders.view');

            if (!self.folderRetrieved) {
                var foldersView = new FoldersView({
                    connector: self.connector,
                    id: self.id,
                    parentNode: self,
                    pageSize: WkspUtil.pageSize,
                    pageNo: 1
                });
                self.getRegion('subFolders').show(foldersView);
                //toggle icon and the flags are set in the FoldersView
            } else if (self.folderExpended) {
                self.getRegion('subFolders').$el.hide();
                self.folderExpended = false;
                self.toggleStatus = WkspUtil.ToggleStatusExpand;
            } else {
                self.getRegion('subFolders').$el.show();
                self.folderExpended = true;
                self.toggleStatus = WkspUtil.ToggleStatusCollapse;
            }

            var toggleIcon = this.ui.$toggleIcon;
            toggleIcon.attr('class', self.toggleStatus);
        },

        renderToggleIcon: function () {
            this.hasChild = this.model.get('hasChild');
            var toggleIcon = this.ui.$toggleIcon;
            if (!this.hasChild) {
                this.toggleStatus = WkspUtil.ToggleStatusEmpty;
            }
            toggleIcon.attr('class', this.toggleStatus);
            var tabIndex = this.toggleStatus === WkspUtil.ToggleStatusEmpty ? "-1" : "0";
            toggleIcon.attr('tabindex', tabIndex);
            if (tabIndex === "-1"){
                $("#conwsoutlook-body").focus();
            }
        },

        showActionBar: function (e) {
            var self = this;
            var targetId = $(e.currentTarget).data("id");
            if (targetId !== self.id) {
                return;
            }

            if (self.type !== 751 && WkspUtil.emailSavingConfig.onlySaveToEmailFolder) {
                return;
            }

            var bar = this.ui.$actionBar;
            bar.css("display", "block");
            setTimeout(function () {
                bar.addClass("binf-in");
            }, 300);
        },

        hideActionBar: function (e) {
            var self = this;
            if (self.type === 0 && WkspUtil.emailSavingConfig.onlySaveToEmailFolder) {
                return;
            }

            var bar = this.ui.$actionBar;
            bar.css("display", "none");
            bar.removeClass("binf-in");
        },

        processKeyUp: function(e){
            if ($(e.target).data("id") !== this.id){
                return;
            }

            if (e.which === 13 || e.which === 32) {
                if (e.target.id === "toggleIcon"){
                    this.clickFolder(e);
                } else if (e.target.id === "saveEmailButton"){
                    this.saveEmail(e);
                    this.hideActionBar(e);
                }
            }

            if (e.which === 9 && e.target.id === "folderNameDiv"){
                this.showActionBar(e);
            }
        },

        processKeyDown: function(e){
            if ($(e.target).data("id") !== this.id){
                return;
            }

            if (e.which !== 9){
                return;
            }
            if ((e.shiftKey && e.target.id === "folderNameDiv") ||
                (!e.shiftKey && e.target.id === "saveEmailButton")){
                    this.hideActionBar(e);
                }
        },

        buttonFocused: function(e){
            if (e.target.id !== "saveEmailButton"){
                return;
            }
            var div = e.target.querySelector("div");
            if (div !== null){
                $(div).css("outline", "1px dotted grey");
                $(div).css("outline-offset", "2px");
            }
        },

        buttonFocusOut: function(e){
            if (e.target.id !== "saveEmailButton" && e.target.id !== "folderNameDiv"){
                return;
            }

            var self = this;
            setTimeout(function(e){
                var focusId = document.activeElement.id;
                if (focusId !== "saveEmailButton" && focusId !== "folderNameDiv"){
                    self.hideActionBar(e);
                }
            }, 50);

            var div = e.target.querySelector("div");
            if (div !== null){
                $(div).css("outline", "");
                $(div).css("outline-offset", "");
            }
        },

        saveEmail: function(e) {
            var self = this;
            var targetId = $(e.currentTarget).data("id");
            if (targetId !== self.id) {
                return;
            }

            if (window.CurrentEmailItem == null) {
                ModalAlert.showWarning(lang.warning_no_outlook_context);
                return;
            }

            var folderId = self.id,
                folderName = self.name,
                connector = self.connector,
                emailItem = window.CurrentEmailItem;
            
            WkspUtil.ScorllPositionBeforeSaving = window.pageYOffset;

            var saveRegion = new Marionette.Region({
                el: '#savePanel'
            });
            var saveEmailView = new SaveView({
                connector: connector, 
                folderId: folderId,
                folderName: folderName,
                proposedEmailName: emailItem.subject,
                attachments: emailItem.archivableAttachments
            });
            saveRegion.show(saveEmailView);
            $("#conwsoutlook-body").focus();
        }
    });

    return FolderView;

});

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/folder/impl/folders',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div id=\"folders-list\" style=\"padding-left: 22px\"></div>\r\n<div class=\"listItemFolder\"><a href=\"javascript:;\" id=\"moreLink\" class=\"moreLink\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showMoreFoldersTitle || (depth0 != null ? depth0.showMoreFoldersTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreFoldersTitle","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"  tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.showMoreLink || (depth0 != null ? depth0.showMoreLink : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreLink","hash":{}}) : helper)))
    + "</a></div>\r\n\r\n\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_folder_impl_folders', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/folder/folders.view',[
    'csui/lib/underscore',
    "csui/lib/jquery",
    'csui/lib/marionette',
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/folder/impl/folders.model',
    'conws/widgets/outlook/impl/folder/folder.view',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',
    'hbs!conws/widgets/outlook/impl/folder/impl/folders',
    'css!conws/widgets/outlook/impl/conwsoutlook'
], function (_, $, Marionette, Backbone, FoldersModel, FolderView, WkspUtil, lang, template) {
    var foldersView = Marionette.CompositeView.extend({
        className: 'folders-conwsoutlook',

        template: template,

        childView: FolderView,
        
        childViewContainer: '#folders-list',

        templateHelpers: function () {
            return {
                id: this.id,
                showMoreLink: lang.showMore_link,
                showMoreFoldersTitle: lang.showMore_folders
            };
        },

        events: {
            'click #moreLink': 'retrieveNextPage'
        },

        initialize: function (options) {

        },

        constructor: function foldersView(options) {
            options.model = new FoldersModel({}, options);
            this.parentNode = options.parentNode;
            this.id = options.id;
            this.pageNo = options.pageNo;

            Marionette.CompositeView.prototype.constructor.call(this, options);

            this.listenTo(this.model, 'sync', this.renderFolders);
            options.model.fetch();
        },

        retrieveNextPage: function (options) {
            var targetId = $(options.currentTarget).data("id");
            if (targetId !== this.id) {
                return;
            }
            var collection = this.model.get('collection'),
                paging = collection ? collection.paging : null;
            if (paging && paging.links && paging.links.data && paging.links.data.next && paging.links.data.next.href) {
                this.model.nextPageUrl = paging.links.data.next.href;
                this.model.fetch();
            }
        },

        renderFolders: function (model, response, options) {
            var self = this,
                collection = model.get('collection'),
                paging = collection ? collection.paging : null;

            var isFirstPage = paging == null || paging.links == null || paging.links.data == null || paging.links.data.previous == null;
            var values = model.get('results');

            if (isFirstPage) {
                self.parentNode.folderRetrieved = true;
                self.parentNode.toggleStatus = WkspUtil.ToggleStatusCollapse;
                self.parentNode.folderExpended = true;
                if (values.length === 0) {
                    self.parentNode.model.set("hasChild", false);
                } else {
                    self.parentNode.model.set("hasChild", true);
                }
            }

            if (values.length !== 0 || !isFirstPage) {
                if (self.collection == null) {
                    self.collection = new Backbone.Collection(values);
                    self.render();
                } else {
                    var origLength = self.collection.length; //original length before addition
                    self.collection.add((new Backbone.Collection(values)).toJSON());
                    self._addItems(self.collection.slice(origLength), origLength); //get latest added models   
                }
            }

            self.$('.moreLink').each(function() {
                var button = $(this);
                if (button.data('id') === self.id) {
                    if (paging && paging.links && paging.links.data && paging.links.data.next && paging.links.data.next.href) {
                        button.css("display", "block");
                    } else {
                        button.css("display", "none");
                    }
                }
            });
        },

        _addItems: function (models, collIndex) {
            var self = this,
                ChildView;

            _.each(models, function (model, index) {
                ChildView = self.getChildView(model);
                self._addChild(model, ChildView, collIndex + index);
            });
        },

        _addChild: function (child, ChildView, index) {
            return Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
        }

    });

    return foldersView;

});

csui.define('conws/widgets/outlook/impl/wksp/wksp.view',[
    'csui/lib/underscore',
    "csui/lib/jquery",
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/utils/url',
    'csui/dialogs/modal.alert/modal.alert',
    'csui/utils/nodesprites',
    'hbs!conws/widgets/outlook/impl/wksp/impl/wksp',
    'conws/widgets/outlook/impl/folder/folders.view',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',
    'conws/widgets/outlook/impl/dialog/saveSection.view',
    'conws/widgets/outlook/impl/wksp/impl/wksp.model',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function (_, $, Backbone, Marionette, Url, ModalAlert, NodeSprites, template, FoldersView, WkspUtil, CSService, SaveView, WkspModel, lang) {

    var WkspView = Marionette.LayoutView.extend({

        className: 'ListItem', 

        template: template,

        templateHelpers: function() {
            return {
                id: this.id,
                name: this.name,
                iconClass: this.getIconClass(),
                typeName: this.typeName,
                toggleStatus: this.hasChild && this.expendable ? WkspUtil.ToggleStatusExpand : WkspUtil.ToggleStatusEmpty,
                openLinkTitle: lang.wksp_open_link,
                linkToWS: Url.combine((new Url(this.connector.connection.url)).getCgiScript(), 'app/nodes', this.id),
                tabIndex: this.hasChild ? "0" : "-1",
                saveButtonTitle: lang.save_action_email
            }
        },

        regions: {
            subFolders: '#subFolders'
        },

        ui: {
            $actionBar: '.wkspFolder-actiondiv',
            $toggleIcon: '#toggleIcon',
            $saveMenuItem: '#wkspSaveMenuItem',
            $saveButton: '#saveEmailButton'
        },

        events: {
            'click .listItemWksp': 'clickWksp',
            'mouseenter #wkspItem': 'showActionBar',
            'mouseleave #wkspItem': 'hideActionBar',
            'click #saveEmailButton': 'saveEmail',
            'focusin #saveEmailButton, #wkspOpenButton': 'buttonFocused',
            'focusout #saveEmailButton, #wkspOpenButton, #wkspNameDiv': 'buttonFocusOut',
            'keyup #toggleIcon, #wkspNameDiv, #saveEmailButton': 'processKeyUp',
            'keydown #wkspNameDiv, #wkspOpenButton': 'processKeyDown'
        },

        initialize: function (options) {
            this.listenTo(this.model, 'change', this.renderToggleIcon);
        },

        constructor: function WkspView(options) {
            this.model = options.model;
            var props = options.model.get('data').properties;
            this.name = props.name;
            this.id = props.id;

            this.typeName = props.type_name;
            this.type = props.type;
            // only workspaces are expendable
            this.hasChild = props.container && props.size > 0 && props.type === 848;
            this.connector = WkspUtil.getConnector(); 

            var enableEmailSaving = this.model.get('enableEmailSaving');
            //if email saving is disabled do not expand workspaces
            this.expendable = (enableEmailSaving !== undefined ? enableEmailSaving : true) && WkspUtil.emailSavingConfig.allowExpandWorkspace;            
            
            this.folderRetrieved = false;
            this.folderExpended = false;

            var self = this;

            //update pre config folder only when email saving is enabled
            if (enableEmailSaving === undefined || enableEmailSaving){
                this.updateModelForPreConfigFolder(self);
            }

            Marionette.LayoutView.prototype.constructor.call(this, options);
        },

        processKeyUp: function(e){
            if ($(e.target).data("id") !== this.id){
                return;
            }

            if (e.which === 13 || e.which === 32) {
                if (e.target.id === "toggleIcon"){
                    this.clickWksp(e);
                } 
                else if (e.target.id === "saveEmailButton"){
                    this.saveEmail(e);
                }
            } else if (e.which === 9 && e.target.id === "wkspNameDiv"){
                this.showActionBar(e);
            }
        },

        processKeyDown: function(e){
            if (e.which !== 9){
                return;
            }
            if ((!e.shiftKey && e.target.id === "wkspOpenButton") ||
                (e.shiftKey && e.target.id === "wkspNameDiv") ){
                    this.hideActionBar(e);
                }
        },

        buttonFocused: function(e){
            if (e.target.id !== "saveEmailButton" && e.target.id !== "wkspOpenButton"){
                return;
            }
            var div = e.target.querySelector("div");
            if (div !== null){
                $(div).css("outline", "1px dotted grey");
                $(div).css("outline-offset", "2px");
            }
        },

        buttonFocusOut: function(e){
            var self = this;
            if (e.target.id === "saveEmailButton" || e.target.id === "wkspOpenButton" || e.target.id === "wkspNameDiv"){
                setTimeout(function(e){
                    var focusId = document.activeElement.id;
                    if (focusId !== "saveEmailButton" && focusId !== "wkspOpenButton" && focusId !== "wkspNameDiv"){
                        self.hideActionBar(e);
                    }
                }, 50);

                if (e.target.id !== "wkspNameDiv") {
                    var div = e.target.querySelector("div");
                    if (div !== null){
                        $(div).css("outline", "");
                        $(div).css("outline-offset", "");
                    }
                }
            }
        },

        clickWksp: function(event) {
            if (event.target.id === "saveEmailButton" || event.target.id === "wkspOpenButton"){
                return;
            }

            var self = this;

            //do not expand it if it is disabled because enableEmailSaving flag is false
            if (!self.expendable){
                return;
            }

            if (!self.expendable || !self.hasChild) {
                return;
            }

            var toToggle = $(event.target).data("id");
            if (toToggle && toToggle === "noToggle") {
                return;
            }

            if (!self.folderRetrieved) {
                var foldersView = new FoldersView({
                    connector: this.connector,
                    id: self.id,
                    parentNode: self,
                    pageSize: WkspUtil.pageSize,
                    pageNo: 1
                });
                self.getRegion('subFolders').show(foldersView);
                //toggle icon and the flags are set in the FoldersView
            } else if (self.folderExpended) {
                self.getRegion('subFolders').$el.hide();
                self.folderExpended = false;
                self.toggleStatus = WkspUtil.ToggleStatusExpand;
            } else {
                self.getRegion('subFolders').$el.show();
                self.folderExpended = true;
                self.toggleStatus = WkspUtil.ToggleStatusCollapse;
            }

            var toggleIcon = this.ui.$toggleIcon;
            toggleIcon.attr('class', self.toggleStatus);
        },

        saveEmail: function(event) {
            var self = this;
            var targetId = $(event.currentTarget).data("id");
            if (targetId !== self.id) {
                return;
            }

            if (window.CurrentEmailItem == null) {
                ModalAlert.showWarning(lang.warning_no_outlook_context);
                return;
            }

            var folderId = self.saveFolderId,
                folderName = self.saveFolderName,
                connector = self.connector,
                emailItem = window.CurrentEmailItem;
            
            WkspUtil.ScorllPositionBeforeSaving = window.pageYOffset;
            
            var saveRegion = new Marionette.Region({
                    el: '#savePanel'
            });
            var saveEmailView = new SaveView({
                connector: connector, 
                folderId: folderId,
                folderName: folderName,
                proposedEmailName: emailItem.subject,
                attachments: emailItem.archivableAttachments
            });
            saveRegion.show(saveEmailView);

            $("#conwsoutlook-body").focus();
        },

        keyEnterWksp: function(event) {
            if (event.keyCode === 13 || event.keyCode === 27) {
                this.$(".listItemWkspName").click();
            }
        },

        showActionBar: function () {
            var bar = this.ui.$actionBar;
            bar.css("display", "block");
            setTimeout(function () {
                bar.addClass("binf-in");
            }, 300);
        },

        hideActionBar: function () {
            var bar = this.ui.$actionBar;
            bar.css("display", "none");
            bar.removeClass("binf-in");
        },

        renderToggleIcon: function () {
            this.hasChild = this.model.get('hasChild');
            var toggleIcon = this.ui.$toggleIcon;
            if (!this.hasChild || !this.expendable) {
                this.toggleStatus = WkspUtil.ToggleStatusEmpty;
            }

            toggleIcon.attr('class', this.toggleStatus);
            var tabIndex = this.toggleStatus === WkspUtil.ToggleStatusEmpty ? "-1" : "0";
            toggleIcon.attr('tabindex', tabIndex);
            if (tabIndex === "-1"){
                $("#conwsoutlook-body").focus();
            }
        },

        updateModelForPreConfigFolder: function (self) {
            if (!WkspUtil.emailSavingConfig.preConfigFolderToSave.enabled) {
                return;
            }

            var wkspModel = new WkspModel({ id: self.id }, {connector: self.connector});

            var fetchPromise = wkspModel.getPreConfigFolder();
            fetchPromise.done(function (result) {
                var saveMenuItem = self.ui.$saveMenuItem,
                    saveButton = self.ui.$saveButton;
                    
                if (result.hasPreConfigFolder) {
                    //self.model.set("preConfigFolder", { folderId: result.folderId, folderName: result.folderName });
                    self.saveFolderId = result.folderId;
                    self.saveFolderName = result.folderName;
                    saveMenuItem.css("display", "inline-block");
                    saveButton.attr("title", lang.title_save_email_to + result.folderName);
                } else {
                    saveMenuItem.css("display", "none");
                }
            });
        },

        getIconClass: function() {
            var self = this,
                atts = self.model.attributes,
                node = {type: self.type};
            if (atts != null && atts.data != null && atts.data.properties != null) {
                node = atts.data.properties;
            }
            return "icon " + NodeSprites.findClassByNode(node);
        }
    });

    return WkspView;

});

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/recentwksps/impl/recentwksps',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"binf-panel-heading outlook-heading\">\r\n    <span class=\"headerIcon sectionToggleIcon\" id=\"recentToggleIcon\" tabindex=\"0\"></span>\r\n    <span >"
    + this.escapeExpression(((helper = (helper = helpers.sectionTitle || (depth0 != null ? depth0.sectionTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sectionTitle","hash":{}}) : helper)))
    + "</span> <span id=\"recentCount\"></span>\r\n</div>\r\n<div id=\"recentSection\">\r\n    <div id=\"recent-list\" class=\"\"></div>\r\n    <div class=\"listItemWksp\"><a href=\"javascript:;\" id=\"moreRecentWksp\" class=\"moreLinkWksp\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showMoreWkspTitle || (depth0 != null ? depth0.showMoreWkspTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreWkspTitle","hash":{}}) : helper)))
    + "\" tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.showMoreLink || (depth0 != null ? depth0.showMoreLink : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreLink","hash":{}}) : helper)))
    + "</a></div>\r\n    <div class=\"wkspMessageArea\" id=\"recentWkspMsgArea\"></div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_recentwksps_impl_recentwksps', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/recentwksps/recentwksps.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model.factory',
    'conws/widgets/outlook/impl/wksp/wksp.view',

    'i18n!conws/widgets/outlook/impl/nls/lang',      
    'hbs!conws/widgets/outlook/impl/recentwksps/impl/recentwksps',
    'conws/widgets/outlook/impl/utils/utility',
    'css!conws/widgets/outlook/impl/conwsoutlook'
], function ($, _, Marionette, Backbone, recentwkspsModelFactory, WkspView, lang, template, WkspUtil) {
  var recentwkspsView = Marionette.CompositeView.extend({
    className: 'recentWksps-conwsoutlook panel panel-default',

    template: template,

    childView: WkspView,

    childViewContainer: '#recent-list',

    templateHelpers: function() {
        return {
            sectionTitle: lang.sectionTitle_recent,
            showMoreLink: lang.showMore_link,
            showMoreWkspTitle: lang.showMore_wksp
        }
    },

    events: {
        'click #moreRecentWksp': 'retrieveNextPage',
        'click #recentToggleIcon': 'toggleIconClicked',
        'keyup' : 'processKey'
    },

    constructor: function recentwkspsView(options) {
        options.model = options.context.getModel(recentwkspsModelFactory);

        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.listenTo(this.model, 'change', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);
    },

    renderWksps: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this,
            values = model.get('results'),
            paging = model.get('paging');

        var isFirstPage = paging == null || paging.actions == null || paging.actions.previous;

        if (values.length === 0 && isFirstPage) {
            if (paging && paging.page === 1) {
                self.renderMessage(lang.noWksp_recent);
                $("#recentToggleIcon").click();
            }
        } else {
            if (self.collection == null) {
                self.collection = new Backbone.Collection(values);
                self.render();
            } else {
                var origLength = self.collection.length; //original length before addition
                self.collection.add((new Backbone.Collection(values)).toJSON());
                self._addItems(self.collection.slice(origLength), origLength); //get latest added models
            }
        }
        $("#recentCount").html("(" + paging.total_count + ")");

        var nextButton = self.$('#moreRecentWksp');
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            nextButton.css("display", "block");
        } else {
            nextButton.css("display", "none");
        }
    },

    retrieveNextPage: function (options) {
        var paging = this.model.get("paging");
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            WkspUtil.startGlobalSpinner();
            this.model.nextPageUrl = paging.actions.next.href;
            this.model.fetch();
        }
    },

    _addItems: function (models, collIndex) {
        var self = this,
            ChildView;

        _.each(models, function (model, index) {
            ChildView = self.getChildView(model);
            self._addChild(model, ChildView, collIndex + index);
        });
    },

    _addChild: function (child, ChildView, index) {
        return Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
    },

    renderError: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(_.str.sformat(lang.error_retrieve_recent, msg));
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#recentWkspMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    processKey: function(e) {
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "recentToggleIcon"){
                this.toggleIconClicked(e);
            } 
        }
    },

    toggleIconClicked: function(args){
        WkspUtil.collapsibleClicked("recent");
    }

  });

  return recentwkspsView;
});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-panel-heading outlook-heading\">\r\n    <span class=\"headerIcon sectionToggleIcon\" id=\"favoriteToggleIcon\" tabindex=\"0\"></span>\r\n    <span >"
    + this.escapeExpression(((helper = (helper = helpers.sectionTitle || (depth0 != null ? depth0.sectionTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sectionTitle","hash":{}}) : helper)))
    + "</span> <span id=\"favoriteCount\"></span>\r\n</div>\r\n<div id=\"favoriteSection\">\r\n    <div id=\"favorite-list\" class=\"panel panel-default\"></div>\r\n    <div class=\"listItemWksp\"><a href=\"javascript:;\" id=\"moreFavoriteWksp\" class=\"moreLinkWksp\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showMoreWkspTitle || (depth0 != null ? depth0.showMoreWkspTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreWkspTitle","hash":{}}) : helper)))
    + "\" tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.showMoreLink || (depth0 != null ? depth0.showMoreLink : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreLink","hash":{}}) : helper)))
    + "</a></div>\r\n    <div class=\"wkspMessageArea\" id=\"recentWkspMsgArea\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_favoritewksps_impl_favoritewksps', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('conws/widgets/outlook/impl/favoritewksps/favoritewksps.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model.factory',
    'conws/widgets/outlook/impl/wksp/wksp.view',
    'conws/widgets/outlook/impl/wksp/impl/wksp.model',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps',
   'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, favoritewkspsModelFactory, WkspView, WkspModel, WkspUtil, lang, template) {
  var favoritewkspsView = Marionette.CompositeView.extend({

    className: 'favoriteWksps-conwsoutlook panel panel-default',

    template: template,

    childView: WkspView,

    childViewContainer: '#favorite-list',

    templateHelpers: function () {
        return {
            sectionTitle: lang.sectionTitle_favorite,
            showMoreLink: lang.showMore_link,
            showMoreWkspTitle: lang.showMore_wksp
        }
    },

    events: {
        'click #moreFavoriteWksp': 'retrieveNextPage',
        'click #favoriteToggleIcon': 'toggleIconClicked',
        'keyup' : 'processKey'
    },

    initialize: function(options) {

    },

    constructor: function favoritewkspsView(options) {
        options.model = options.context.getModel(favoritewkspsModelFactory);
        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.pageIndex = 0;
        this.pageSize = WkspUtil.pageSize;

        this.listenTo(this.model, 'change', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);
    },

    renderWksps: function (model, response, options) {
        var self = this;
        var values = model.get('results'),
            totalCount = values.length;

        if (totalCount === 0) {
            self.renderMessage(lang.noWksp_favorite);
            $("#favoriteToggleIcon").click();
        } else {
            var end;
            if (self.pageIndex === 0){
                end = totalCount > self.pageSize ? self.pageSize : totalCount;
                self.collection = new Backbone.Collection(values.slice(0, end));
                self.render();
            } else {
                var start = self.pageIndex * self.pageSize,
                    fullPageCount = (self.pageIndex + 1) * self.pageSize,
                    origLength = self.collection.length; //original length before addition;
                
                end = totalCount > fullPageCount ? fullPageCount : totalCount,

                self.collection.add((new Backbone.Collection(values.slice(start, end))).toJSON());
                self._addItems(self.collection.slice(origLength), origLength); //get latest added models    
            }
        }

        $("#favoriteCount").html("(" + totalCount + ")");
        
        var nextButton = self.$('#moreFavoriteWksp'),
            display = (self.pageIndex + 1) * self.pageSize < totalCount ? "block" : "none"; 
        nextButton.css("display", display);
    },

    retrieveNextPage: function (options) {
        var self = this;
        self.pageIndex++;
        self.renderWksps(self.model);
    },

    _addItems: function (models, collIndex) {
        var self = this,
            ChildView;

        _.each(models, function (model, index) {
            ChildView = self.getChildView(model);
            self._addChild(model, ChildView, collIndex + index);
        });
    },

    _addChild: function (child, ChildView, index) {
        return Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(_.str.sformat(lang.error_retrieve_favorite, msg));
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#recentWkspMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    processKey: function(e) {
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "favoriteToggleIcon"){
                this.toggleIconClicked(e);
            } 
        }
    },

    toggleIconClicked: function(args){
        WkspUtil.collapsibleClicked("favorite");
    }

  });

  return favoritewkspsView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/searchwksps/impl/searchresult',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div id=\"searchresult-list\" ></div>\r\n<div class=\"listItemWksp\"><a href=\"javascript:;\" id=\"moreSearchWksp\" class=\"moreLinkWksp\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showMoreWkspTitle || (depth0 != null ? depth0.showMoreWkspTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreWkspTitle","hash":{}}) : helper)))
    + "\" tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.showMoreLink || (depth0 != null ? depth0.showMoreLink : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreLink","hash":{}}) : helper)))
    + "</a></div>\r\n<div class=\"wkspMessageArea\" id=\"searchResultMsgArea\"></div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_searchwksps_impl_searchresult', t);
return t;
});
/* END_TEMPLATE */
;
// An application widget is exposed via a RequireJS module
csui.define('conws/widgets/outlook/impl/searchwksps/searchresult.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette',                             
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/searchwksps/impl/searchresult.model', 
    'conws/widgets/outlook/impl/wksp/wksp.view',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/searchresult',        
    'css!conws/widgets/outlook/impl/conwsoutlook'       
], function ($, _, Marionette, Backbone, SearchResultModel, WkspView, WkspUtil, lang, template) {

    var searchresultView = Marionette.CompositeView.extend({

    className: 'wksp-srch-results',

    template: template,

    childView: WkspView,

    childViewContainer: '#searchresult-list',

    templateHelpers: function () {
        return {
            showMoreLink: lang.showMore_link,
            showMoreWkspTitle: lang.showMore_wksp
        }
    },

    ui: {
        srchResultMessage: '#searchResultMsgArea',
        srchResultList: '#searchresult-list'
    },

    events: {
        'click #moreSearchWksp': 'retrieveNextPage'
    },

    initialize: function(options) {
        //var wksps = options.model.get('results');
        //this.collection = new Backbone.Collection(wksps);
    },

    constructor: function searchresultView(options) {
        options.model = new SearchResultModel({}, options);
        this.enableEmailSaving = options.enableEmailSaving;

        this.typeAhead = options.typeAhead;
        this.wkspName = options.wkspName;
        this.pageNo = options.pageNo;
        
        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.listenTo(this.model, 'change', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);
        options.model.fetch();    
    },

    retrieveNextPage: function (options) {
        var paging = this.model.get("paging");
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            WkspUtil.startGlobalSpinner();
            this.model.nextPageUrl = paging.actions.next.href;
            this.model.fetch();
        }
    },

    renderWksps: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this,
            paging = model.get('paging');
        var isFirstPage = paging == null || paging.actions == null || paging.actions.previous;
        var values = model.get('results');
        //append enableEmailSaving flag to the collection
        _.each(values, function (value){
            value.enableEmailSaving = self.enableEmailSaving;
        });

        if (values.length === 0 && isFirstPage) {
            if (self.pageNo === 1) {
                self.renderMessage(lang.noWksp_search);
            }
        } else {
            if (self.collection == null) {
                self.collection = new Backbone.Collection(values);
                self.render();
            } else {
                var origLength = self.collection.length; //original length before addition
                self.collection.add((new Backbone.Collection(values)).toJSON());
                self._addItems(self.collection.slice(origLength), origLength); //get latest added models
            }
            if (self.typeAhead) {
                self.highlight(self, self.wkspName);
            }
        }

        var nextButton = self.$('#moreSearchWksp');
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            nextButton.css("display", "block");
        } else {
            nextButton.css("display", "none");
        }

    },

    _addItems: function (models, collIndex) {
        var self = this,
            ChildView;

        _.each(models, function (model, index) {
            ChildView = self.getChildView(model);
            self._addChild(model, ChildView, collIndex + index);
        });
    },

    _addChild: function (child, ChildView, index) {
        return Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
    },

    highlight: function(view, name) {
        if (name){
            var regex = RegExp(name, 'gi'),
                replacement = "<u style='font-weight: bold'>$&</u>"; // need to use inline style, otherwise it will be overridden. 
            view.$('div.listItemWkspName').each(function() {
                $(this).html($(this).html().replace(regex, replacement));
            });
        }
    },

    renderError: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(_.str.sformat(lang.error_retrieve_search, msg));
    },

    renderMessage: function (msg) {
        var self = this;        

        if (msg) {
            //show message
            self.ui.srchResultMessage.text(msg);
            self.ui.srchResultMessage.css("display", "block");
            //hide search results div
            self.ui.srchResultList.css("display", "none");
        } else {
             self.ui.srchResultMessage.css("display", "none");
             //show search results div
            self.ui.srchResultList.css("display", "block");
        }
    }
  });

  return searchresultView;

});

csui.define('conws/widgets/outlook/impl/searchwksps/simplesearch.view',[
    'csui/lib/underscore',
    'csui/lib/handlebars',
    'csui/lib/marionette',
    'csui/lib/jquery',
    'csui/widgets/search.custom/search.custom.view',

    'conws/widgets/outlook/impl/utils/utility',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function(_, Handlebars, Marionette, $, CustomSearchWidgetView, WkspUtil, lang) {

    var simpleSearchView = CustomSearchWidgetView.extend({
        constructor: function simpleSearchView(options) {
            options || (options = {});

            CustomSearchWidgetView.prototype.constructor.call(this, options);

            this.context = options.context;
            this.options = options;
            this.options.parentView = this;
            this.contentViewOptions = this.options;

            WkspUtil.startGlobalSpinner();
        },
        initialize: function () {
            _.bindAll(this, 'render', 'afterRender');
            var self = this;
            this.render = _.wrap(this.render, function (render) {
                render();
                self.afterRender();
                return self;
            }); 
        },

        afterRender: function () {
            this.verifyForm();
        },

        verifyForm: function() {
            setTimeout(function checking() {
                var att = $(".customsearch-attr-container");
                if (att.length === 0) {
                    setTimeout(checking, 100);
                } else {
                    WkspUtil.stopGlobalSpinner();

                    var occupied = (WkspUtil.SearchFormBottomPadding + WkspUtil.TraceAreaHeight) + "px";
                    $(".tile-content").css("height", "calc(100vh - " + occupied +")");
                }
            }, 20);
        }


    });
    return simpleSearchView;
});

/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/searchwksps/impl/wksptype',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<option value=\""
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</option>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_searchwksps_impl_wksptype', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/searchwksps/wksptypes.view',[
    'csui/lib/underscore',
    "csui/lib/jquery",
    'csui/lib/backbone',
    'csui/lib/marionette',
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/wksptype' 
], function (_, $, Backbone, Marionette, template) {

    var WkspTypesView = Marionette.LayoutView.extend({
        tagName: 'option',

        template: template,

        templateHelpers: function () {
            return {
                value: this.id,
                name: this.name
            }
        },

        initialize: function (options) {
            var wkspTypes = options.model.get('results');
            this.collection = new Backbone.Collection(wkspTypes);
        },

        constructor: function WkspTypesView(options) {
            this.model = options.model;
            this.name = options.model.get('data').properties.wksp_type_name;
            this.id = options.model.get('data').properties.wksp_type_id;

            Marionette.LayoutView.prototype.constructor.call(this, options);
        },

        onRender: function () {
            // Get rid of that pesky wrapping-div.
            // Assumes 1 child element present in template.
            this.$el = this.$el.children();
            // Unwrap the element to prevent infinitely 
            // nesting elements during re-render.
            this.$el.unwrap();
            this.setElement(this.$el);
        }
    });

    return WkspTypesView;

});
csui.define('conws/widgets/outlook/impl/searchwksps/impl/simplesearchresult.model',[
    'csui/lib/backbone',   
    'csui/utils/url',      
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var simpleSearchresultModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function searchresultModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.context.connector) {
                options.context.connector.assignTo(this);

                this.pageSize = options.pageSize;
                this.pageNo = options.pageNo;

                this.nextPageUrl = "";
                this.query = options.query;
            }
        },

        url: function() {
            var url = WkspUtil.v1ToV2(this.connector.connection.url),
                query = this.query.toJSON(),
                cacheId = "",
                pagingString = "";

            if (this.nextPageUrl) {
                this.pageNo++;
                var regEx = /cache_id=\d+/g;
                var cacheIdEx = regEx.exec(this.nextPageUrl);
                cacheId = cacheIdEx.length > 0 ? cacheIdEx[0] : "";
            }

            pagingString = 'page=' + this.pageNo + '&limit=' + this.pageSize;
            query = Url.combineQueryString(query, pagingString, cacheId);

            return Url.combine(url, 'search?' + query);

        }

    });

    return simpleSearchresultModel;

});

csui.define('conws/widgets/outlook/impl/searchwksps/simplesearchresult.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',

    'csui/utils/contexts/factories/search.query.factory',
    'csui/utils/contexts/factories/search.results.factory',

    'conws/widgets/outlook/impl/searchwksps/impl/simplesearchresult.model', 

    'conws/widgets/outlook/impl/wksp/wksp.view',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/searchresult',
    'css!conws/widgets/outlook/impl/conwsoutlook'       
], function ($, _, Marionette, Backbone, SearchQueryModelFactory,
    SearchResultsCollectionFactory, SimpleSearchResultModel, WkspView, WkspUtil, lang, template) {

  var simpleSearchresultView = Marionette.CompositeView.extend({

    className: 'wksp-srch-results',

    template: template,

    childView: WkspView,

    childViewContainer: '#searchresult-list',

    templateHelpers: function () {
        return {
            showMoreLink: lang.showMore_link,
            showMoreWkspTitle: lang.showMore_wksp
        }
    },

    ui: {
        srchResultMessage: '#searchResultMsgArea',
        srchResultList: '#searchresult-list'
    },

    events: {
        'click #moreSearchWksp': 'retrieveNextPage'
    },

    constructor: function simpleSearchresultView(options) {

        this.enableEmailSaving = options.enableEmailSaving;
        this.pageNo = options.pageNo;
        this.pageSize = options.pageSize;
        this.context = options.context;

        if (!options.query) {
            options.query = this.context.getModel(SearchQueryModelFactory);
        }

        options.model = new SimpleSearchResultModel({}, options);
        this.model = options.model;

        Marionette.CompositeView.prototype.constructor.call(this, options);

        // Whenever properties of the model change, re-render the view
        this.listenTo(this.model, 'change', this.renderWksps);
        //this.listenTo(this.model, 'sync', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);

        this.model.fetch();
    },

    retrieveNextPage: function (options) {
        var collection = this.model.get('collection');
        var paging = collection.paging == null ? null : collection.paging;
        if (paging && paging.links && paging.links.next && paging.links.next.href) {
            WkspUtil.startGlobalSpinner();
            this.model.nextPageUrl = paging.links.next.href;
            this.model.fetch();
        }
    },

    renderWksps: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this,
            collection = model.get('collection');
        var paging = collection.paging == null ? null : collection.paging;
        var isFirstPage = paging == null || paging.actions == null || paging.actions.previous;
        var values = model.get('results');
        //append enableEmailSaving flag to the collection
        _.each(values, function (value){
            value.enableEmailSaving = self.enableEmailSaving;
        });

        if (values.length === 0 && isFirstPage) {
            if (self.pageNo === 1) {
                self.renderMessage(lang.noWksp_search);
            }
        } else {
            if (self.collection == null) {
                self.collection = new Backbone.Collection(values);
                self.render();
            } else {
                var origLength = self.collection.length; //original length before addition
                self.collection.add((new Backbone.Collection(values)).toJSON());
                self._addItems(self.collection.slice(origLength), origLength); //get latest added models
            }
        }

        var nextButton = self.$('#moreSearchWksp');
        if (paging && paging.links && paging.links.next && paging.links.next.href) {
            nextButton.css("display", "block");
        } else {
            nextButton.css("display", "none");
        }

    },

    _addItems: function (models, collIndex) {
        var self = this,
            ChildView;

        _.each(models, function (model, index) {
            ChildView = self.getChildView(model);
            self._addChild(model, ChildView, collIndex + index);
        });
    },

    _addChild: function (child, ChildView, index) {
        return Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
    },

    renderError: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(_.str.sformat(lang.error_retrieve_search, msg));
    },

    renderMessage: function (msg) {
        var self = this;        

        if (msg) {
            //show message
            self.ui.srchResultMessage.text(msg);
            self.ui.srchResultMessage.css("display", "block");
            //hide search results div
            self.ui.srchResultList.css("display", "none");
        } else {
             self.ui.srchResultMessage.css("display", "none");
             //show search results div
            self.ui.srchResultList.css("display", "block");
        }
    }
  });

  return simpleSearchresultView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/searchwksps/impl/searchwksps',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"binf-panel-heading outlook-heading\" >"
    + this.escapeExpression(((helper = (helper = helpers.sectionTitle || (depth0 != null ? depth0.sectionTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sectionTitle","hash":{}}) : helper)))
    + " \r\n    <!--<img src=\""
    + this.escapeExpression(((helper = (helper = helpers.serverOrigin || (depth0 != null ? depth0.serverOrigin : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"serverOrigin","hash":{}}) : helper)))
    + "/"
    + this.escapeExpression(((helper = (helper = helpers.supportFolder || (depth0 != null ? depth0.supportFolder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"supportFolder","hash":{}}) : helper)))
    + "/csui/themes/carbonfiber/image/icons/help_mo.svg\" class=\"wkspHelpIcon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.helpTooltip || (depth0 != null ? depth0.helpTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"helpTooltip","hash":{}}) : helper)))
    + "\" />-->\r\n</div>\r\n<div class=\"wkspSearch\">\r\n    <div class=\"wkspSearchInputName\">\r\n        <table class=\"wkspNameBox\">\r\n            <tr>\r\n                <td class=\"wkspInputWithClear\">\r\n                    <input class=\"wkspInput wkspSearchInput wkspSearchName\" id=\"wkspName\" type=\"search\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.wkspNamePlaceholder || (depth0 != null ? depth0.wkspNamePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"wkspNamePlaceholder","hash":{}}) : helper)))
    + "\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.wkspNamePlaceholder || (depth0 != null ? depth0.wkspNamePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"wkspNamePlaceholder","hash":{}}) : helper)))
    + "\" />\r\n                    <span class=\"searchClear wkspIcon\" id=\"searchClearButton\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchClearTooltip || (depth0 != null ? depth0.searchClearTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchClearTooltip","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></span>\r\n                </td>\r\n                <td class=\"wkspSearchButton\">\r\n                    <span id=\"wkspTypeButton\" class=\"wkspIcon searchTypeIcon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.selectWkspType || (depth0 != null ? depth0.selectWkspType : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectWkspType","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></span>\r\n                    <table class=\"wkspTypeDropdownTable\"><tr>\r\n                        <td>\r\n                            <div id=\"typeDropdown\" class=\"wkspTypeDropdown saveDisplayArea hiddenArea\"></div>\r\n                        </td>\r\n                    </tr></table>\r\n                </td>\r\n                <td class=\"wkspSearchButton\">\r\n                    <span id=\"searchButton\" class=\"wkspIcon searchIcon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchTooltip || (depth0 != null ? depth0.searchTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchTooltip","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></span>\r\n                </td>\r\n            </tr>\r\n            <tr>\r\n                <td colspan=\"3\">\r\n                    <div id=\"wkspTypeMsg\" class=\"wkspTypeMsg hiddenArea\"></div>\r\n                </td>\r\n            </tr>\r\n        </table>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"binf-panel-heading outlook-heading hiddenArea\" id=\"searchResultHeading\">\r\n    <span class=\"headerIcon backwardIcon\" tabindex=\"0\" id=\"searchResultBackButton\"></span>\r\n    <span >"
    + this.escapeExpression(((helper = (helper = helpers.resultTitle || (depth0 != null ? depth0.resultTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"resultTitle","hash":{}}) : helper)))
    + "</span>\r\n</div> \r\n<div id=\"search-result\"></div>\r\n\r\n<div class=\"wkspMessageArea\" id=\"searchMsgArea\"></div>\r\n\r\n\r\n\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_searchwksps_impl_searchwksps', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/searchwksps/searchwksps.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette',                             
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'csui/widgets/search.custom/search.custom.view',
    'csui/utils/contexts/factories/search.query.factory',
    'csui/utils/contexts/factories/next.node',

    'conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model.factory', 
    'conws/widgets/outlook/impl/searchwksps/searchresult.view',
    'conws/widgets/outlook/impl/searchwksps/simplesearch.view',
    'conws/widgets/outlook/impl/searchwksps/wksptypes.view',
    'conws/widgets/outlook/impl/searchwksps/simplesearchresult.view',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/searchwksps',        // Template to render the HTML
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, CustomViewSearch, SearchQueryModelFactory, NextNodeModelFactory, searchwkspsModelFactory, SearchResultView, SimpleSearchView, WkspTypesView, SimpleSearchResultView, WkspUtil, CSService, lang, template) {

    window.wkspTypeSelected = function(wkspId, wkspName){
        $("#typeDropdown").addClass("hiddenArea");
        if (wkspId === -100){
            $("#wkspTypeMsg").addClass("hiddenArea");
            $("#wkspTypeMsg").removeClass("wkspTypeMsgDisplay");
            $("#wkspTypeMsg").html("");
        } else{
            $("#wkspTypeMsg").removeClass("hiddenArea");
            $("#wkspTypeMsg").addClass("wkspTypeMsgDisplay");
            $("#wkspTypeMsg").html(lang.search_selected_wksp_type + ": <span style='font-weight: bold' title='" + wkspName + "'>" + wkspName + "</span>");
        }
        WkspUtil.SelectedWkspTypeId = wkspId;
        if (WkspUtil.WkspSearchPerformed){
            $("#searchButton").click();
        }
    }

    var searchwkspsView = Marionette.CompositeView.extend({

    className: 'searchWksps-conwsoutlook panel panel-default',

    template: template,

    ui: {
        wkspNameBox: '#wkspName',
        searchButton: '#searchButton',
        searchClearButton: '#searchClearButton',
        searchFormDropdown: '#searchFormDropdown'
    },

    events: {
        'click #searchButton': 'searchWksps',
        'keyup #wkspName': 'searchWkspsTyping',
        'click #searchClearButton': 'clearSearch',
        'click #searchResultBackButton': 'clearSearch',
        'click #wkspTypeButton': 'openWkspTypeSelection',
        'keyup' : 'processKey',
        'focusin #searchButton': 'searchButtonFocused'
    },

    templateHelpers: function () {
        return {
            serverOrigin: window.ServerOrigin,
            supportFolder: window.ContentServerSupportPath,
            sectionTitle: lang.sectionTitle_search,
            helpTooltip: lang.help_button_tooltip,
            searchTooltip: lang.search_button_tooltip,
            searchClearTooltip: lang.search_clear_button_tooltip,
            wkspNamePlaceholder: lang.search_wkspName_placeholder,
            selectWkspType: lang.search_select_wksp_type,
            resultTitle: lang.search_result_title
        }
    },

    initialize: function(options) {
        
    },

    constructor: function searchwkspsView(options) {
        options.model = options.context.getModel(searchwkspsModelFactory);
        this.pageSize = options.pageSize ? options.pageSize : WkspUtil.pageSize;
        this.enableEmailSaving = options.enableEmailSaving;
        this.showSearchForm = options.showSearchFormSelection ? options.showSearchFormSelection : false;
        this.previousFormId = -1;

        this.context = options.context;

        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.listenTo(this.model, 'change', this.renderSearchForm);
        this.listenTo(this.model, 'error', this.renderError);
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#searchMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    renderSearchForm: function (model, response, options) {
        var self = this;
        var values = model.get('results');
        self.render();

        var wkspTypeSelection = "",
            selectionFormat = "<a href=\"javascript:wkspTypeSelected({0},'{1}');\" title='{1}' style='width:80vw; white-space:nowrap; overflow-x:hidden; text-overflow:ellipsis; display:flow-root list-item;'><div style='display:inline'>{1}</div></a>";
        for (var i = 0; i < values.length; i++){
            var val = values[i];
            var name = val.data.properties.wksp_type_name,
                id = val.data.properties.wksp_type_id;
            wkspTypeSelection += _.str.sformat(selectionFormat, id, name);
        }
        self.$('#typeDropdown').html(wkspTypeSelection);
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },

    processKey: function(e) {
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "wkspTypeButton"){
                this.openWkspTypeSelection(e);
            } else if (e.target.id === "searchButton"){
                this.searchWksps(e);
            } else if (e.target.id === "searchClearButton" || e.target.id === "searchResultBackButton"){
                this.clearSearch(e);
            }

        }
    },

    searchButtonFocused: function(e){
        $("#typeDropdown").addClass("hiddenArea");
    },

    searchWksps: function(args) {
        var self = this,
            wkspName = self.$('#wkspName').val(),
            wkspTypeId = WkspUtil.SelectedWkspTypeId,
            searchClearButton = self.$('#searchClearButton'),
            msg = '';

        WkspUtil.uiShow("searchResultHeading");
        WkspUtil.uiHide("nonSearchSections");

        searchClearButton.css("display", "block");
        var resultRegion = new Marionette.Region({
            el: '#search-result'
        });

        if (wkspTypeId === -100 && wkspName === "") {
            msg = lang.search_noCondition;
            resultRegion.$el.hide();
        } else {
            msg = '';
            resultRegion.$el.show();
            var typeAhead = args.target.id === "wkspName";
            var resultView = new SearchResultView({
                connector: this.model.connector,
                wkspTypeId: wkspTypeId,
                wkspName: wkspName,
                typeAhead: typeAhead,
                pageSize: this.pageSize,
                pageNo: 1,
                enableEmailSaving: this.enableEmailSaving
            });

            WkspUtil.WkspSearchPerformed = true;
            resultRegion.show(resultView);
            // start the spinner
            WkspUtil.startGlobalSpinner();
        }
        this.renderMessage(msg);
    },

    clearSearch: function(args) {
        var self = this,
            wkspName = self.$('#wkspName'),
            searchClearButton = self.$('#searchClearButton'),
            resultRegion = new Marionette.Region({
                el: '#search-result'
            });

        wkspName.val('');
        searchClearButton.css("display", "none");
        resultRegion.$el.hide();

        WkspUtil.uiHide("searchResultHeading");
        WkspUtil.uiShow("nonSearchSections");

        WkspUtil.SelectedWkspTypeId = -100;
        WkspUtil.WkspSearchPerformed = false;
        WkspUtil.uiHide("wkspTypeMsg");
        $("#wkspTypeMsg").removeClass("wkspTypeMsgDisplay");
        $("#wkspTypeMsg").html("");

        this.renderMessage('');
        $("#conwsoutlook-body").focus();
    },

    searchWkspsTyping: function (args) {
        var view = this,
            wkspName = view.$('#wkspName').val();
        if (wkspName.length >= 2) {
            this.searchWksps(args);
        }
    },

    openWkspTypeSelection: function() {
        $("#typeDropdown").toggleClass("hiddenArea");
    }

  });

  return searchwkspsView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/suggestedwksps/impl/suggestedwksps',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"binf-panel-heading outlook-heading\">\r\n    \r\n    <span class=\"headerIcon sectionToggleIcon\" id=\"suggestedToggleIcon\" tabindex=\"0\"></span>\r\n    <span >"
    + this.escapeExpression(((helper = (helper = helpers.sectionTitle || (depth0 != null ? depth0.sectionTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sectionTitle","hash":{}}) : helper)))
    + "</span> <span id=\"suggestedCount\"></span>\r\n    \r\n    <span style=\"float: right\">\r\n    <div id=\"suggestedWkspSpinner\" class=\"load-container binf-hidden\">\r\n        <div class=\"outer-border wksp-outer-border\">\r\n            <div class=\"loader wksp-loader\"></div>\r\n        </div>\r\n    </div>\r\n    </span>    \r\n</div>\r\n<div id=\"suggestedSection\">\r\n    <div id=\"suggested-list\"></div>\r\n    <div class=\"wkspMessageArea\" id=\"suggestedWkspMsgArea\"></div>\r\n</div>";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_suggestedwksps_impl_suggestedwksps', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/suggestedwksps/suggestedwksps.view',[
  'csui/lib/jquery',  
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/backbone',

  'conws/widgets/outlook/impl/wksp/wksp.view',

  'i18n!conws/widgets/outlook/impl/nls/lang',      
   'hbs!conws/widgets/outlook/impl/suggestedwksps/impl/suggestedwksps',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',
   'css!conws/widgets/outlook/impl/conwsoutlook'
    
], function ($, _, Marionette, Backbone, WkspView, lang, template, WkspUtil, CSService) {
  var suggestedwkspsView = Marionette.CompositeView.extend({
    className: 'suggestedWksps-conwsoutlook panel panel-default',

    template: template,

    childView: WkspView,

    childViewContainer: '#suggested-list',

    templateHelpers: function() {
        return {
            sectionTitle: lang.sectionTitle_suggested
        }
    },

    events: {
        'click #suggestedToggleIcon': 'toggleIconClicked',
        'keyup' : 'processKey'
    },

    constructor: function suggestedwkspsView(options) {
        var self = this;
        Marionette.CompositeView.prototype.constructor.call(this, options);

        self.error = options.error;
        self.config = options.config;
        self.connector = options.context.connector;

        setTimeout(function() {
            WkspUtil.startLocalSpinner('suggestedWkspSpinner');
            self.renderMessage(self, lang.info_retrieving);
        });

        if (options.error) {
            setTimeout(function () {
                WkspUtil.stopLocalSpinner('suggestedWkspSpinner');
                self.renderError(options.error);
            });
        } else {
            var promise = CSService.getSuggestedWksps(options.context.connector, window.CurrentEmailItem, options.config);
            promise.done(function (data) { self.renderWksps(data) });
            promise.fail(function (error) { self.renderError(error) });        
        }
    },

    renderWksps: function (data) {
        WkspUtil.stopLocalSpinner('suggestedWkspSpinner');

        var self = this;
        self.collection = new Backbone.Collection(data.results);
        self.render();
        var msg = "";
        if (self.collection.length === 0) {
            msg = lang.noWksp_suggested;

            $("#suggestedToggleIcon").click();
        }

        $("#suggestedCount").html("(" + self.collection.length + ")");

        if (data.errors != null && data.errors.length > 0) {
            var errorMsg = data.errors.join("<br/>");
            errorMsg = _.str.sformat(lang.error_retrieve_suggested, errorMsg);
            msg = msg === "" ? errorMsg : msg + "<br/>" + errorMsg;
        }

        if (msg !== "") {
            self.renderMessage(self, msg);
        }
    },

    refresh: function(){
        var self = this;
        if (self.error){
            return;
        }

        WkspUtil.writeTrace("The suggested workspaces is being refreshed....");
        
        setTimeout(function() {
            WkspUtil.startLocalSpinner('suggestedWkspSpinner');
            self.renderMessage(self, lang.info_retrieving);
        });
        var promise = CSService.getSuggestedWksps(self.connector, window.CurrentEmailItem, self.config);
        promise.done(function (data) { self.renderWksps(data) });
        promise.fail(function (error) { self.renderError(error) });        
    },

    renderError: function (error) {
        WkspUtil.stopLocalSpinner('suggestedWkspSpinner');
        var self = this;
        var msg = error.responseJSON != null ? error.responseJSON.error : error;
        
        self.renderMessage(self, _.str.sformat(lang.error_retrieve_suggested, msg));
    },

    renderMessage: function (self, msg) {
        var msgArea = self.$('#suggestedWkspMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    processKey: function(e) {
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "suggestedToggleIcon"){
                this.toggleIconClicked(e);
            } 
        }
    },

    toggleIconClicked: function(args){
        WkspUtil.collapsibleClicked("suggested");
    }
  });

  return suggestedwkspsView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/searchwksps/impl/customsearch',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div id=\"customSearchFormArea\">\r\n    <div class=\"binf-panel-heading outlook-heading\" >\r\n        <span class=\"headerIcon backwardIcon\" tabindex=\"0\" id=\"customSearchBack\"></span>\r\n        <span >"
    + this.escapeExpression(((helper = (helper = helpers.sectionTitle || (depth0 != null ? depth0.sectionTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sectionTitle","hash":{}}) : helper)))
    + "</span>\r\n    </div>    \r\n    <div class=\"wkspSearch\">\r\n\r\n        <div class=\"wkspSearchForm\" id=\"searchFormListDiv\">\r\n            <label class=\"searchFormLabel\" for=\"searchFormDW\">"
    + this.escapeExpression(((helper = (helper = helpers.selectSearchForm || (depth0 != null ? depth0.selectSearchForm : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"selectSearchForm","hash":{}}) : helper)))
    + "</label>\r\n            <select class=\"wkspInput wkspSearchInput wkspSearchSelect\" id=\"searchFormDW\" onmousedown=\"document.getElementById('searchFormDW').focus();\"></select>\r\n        </div>\r\n\r\n        <div id=\"searchFormDiv\"></div>\r\n    </div>\r\n    <div class=\"wkspMessageArea\" id=\"searchMsgArea\"></div>\r\n</div>\r\n\r\n<div id=\"customSearchResultArea\" class=\"hiddenArea\">\r\n    <div class=\"binf-panel-heading outlook-heading\" >\r\n        <span class=\"headerIcon backwardIcon\" tabindex=\"0\" id=\"customSearchResultBack\"></span>\r\n        <span >"
    + this.escapeExpression(((helper = (helper = helpers.resultTitle || (depth0 != null ? depth0.resultTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"resultTitle","hash":{}}) : helper)))
    + "</span>\r\n    </div>    \r\n    <div id=\"customSearchResult\"></div>\r\n</div>\r\n\r\n\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_searchwksps_impl_customsearch', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/impl/searchwksps/customSearchSection.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette',                             
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'csui/widgets/search.custom/search.custom.view',
    'csui/utils/contexts/factories/search.query.factory',
    'csui/utils/contexts/factories/next.node',

    'conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model.factory', 
    'conws/widgets/outlook/impl/searchwksps/searchresult.view',
    'conws/widgets/outlook/impl/searchwksps/simplesearch.view',
    'conws/widgets/outlook/impl/searchwksps/wksptypes.view',
    'conws/widgets/outlook/impl/searchwksps/simplesearchresult.view',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/customsearch',        // Template to render the HTML
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, CustomViewSearch, SearchQueryModelFactory, NextNodeModelFactory, searchwkspsModelFactory, SearchResultView, SimpleSearchView, WkspTypesView, SimpleSearchResultView, WkspUtil, CSService, lang, template) {

    var customSearchSectionView = Marionette.CompositeView.extend({

    className: 'searchWksps-conwsoutlook panel panel-default',

    template: template,


    ui: {
        searchFormDW: '#searchFormDW'
    },

    events: {
        'change #searchFormDW': 'searchFormChange',
        'click #customSearchResultBack': 'backToSearchForm',
        'click #customSearchBack': 'backToStandard',
        'keyup #customSearchBack, #customSearchResultBack': 'processKey'
    },

    templateHelpers: function () {
        return {
            serverOrigin: window.ServerOrigin,
            supportFolder: window.ContentServerSupportPath,
            sectionTitle: lang.sectionTitle_customSearch,
            selectSearchForm: lang.search_select_form,
            resultTitle: lang.search_result_title
        }
    },

    initialize: function(options) {
        
    },

    constructor: function searchwkspsView(options) {
        this.pageSize = options.pageSize ? options.pageSize : WkspUtil.pageSize;
        this.enableEmailSaving = options.enableEmailSaving;
        this.showSearchForm = options.showSearchFormSelection ? options.showSearchFormSelection : false;
        this.previousFormId = -1;
        this.queries = options.queries;

        this.context = options.context;

        Marionette.CompositeView.prototype.constructor.call(this, options);

        var self = this;
        setTimeout(function(){self.renderSearchForm();});

    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#searchMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    renderSearchForm: function (model, response, options) {
        var self = this;
        self.render();

        if (self.queries != null && self.queries.length !== 0) {
            self.$('#searchFormListDiv').css("display", "block");
            var optionFormat = "<option value='{0}'>{1}</option>";
            var formOptions = ""; // = _.str.sformat(optionFormat, -1, lang.search_wksp_typeName);
            for (var i = 0; i < self.queries.length; i++) {
                var query = self.queries[i];
                formOptions = formOptions + _.str.sformat(optionFormat, query[1], query[0]);
            }
            self.$('#searchFormDW').html(formOptions);

            var context = new PageContext({ factories: { connector: self.options.context.connector } });
            context.connector = self.options.context.connector;

            var searchFormRegion = new Marionette.Region({
                    el: '#searchFormDiv'
            });
            WkspUtil.writeTrace("Showing custom search view for ID: ." + self.queries[0][1]);
            var queryView = new SimpleSearchView({ context: context, savedSearchQueryId: self.queries[0][1] });
            searchFormRegion.show(queryView);
            self.refreshQueryModel(context);
            context.fetch();
        }
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },

    processKey: function(e){
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "customSearchBack"){
                this.backToStandard(e);
            } else if(e.target.id === "customSearchResultBack"){
                this.backToSearchForm(e);
            }
        }
    },

    searchFormChange: function (args) {
        var self = this,
            formId = self.$('#searchFormDW').val();

        this.renderMessage('');
        var resultRegion = new Marionette.Region({ el: '#customSearchResult' });
        resultRegion.$el.empty();

        // if token expired, the search is not properly rendered. But the search button is disabled.
        var forceRender = $('#csui-custom-search-form-submit').hasClass('csui-search-form-submit-disabled');

        if (formId === "-1") {
            self.$('#searchFormWkspTypeName').css("display", "block");
            self.$('#searchFormDiv').css("display", "none");
        } else {
            self.$('#searchFormWkspTypeName').css("display", "none");
            self.$('#searchFormDiv').css("display", "block");
            if (forceRender || self.previousFormId !== formId) {
                WkspUtil.startGlobalSpinner();
                self.previousFormId = formId;

                var context = new PageContext({ factories: { connector: self.options.context.connector } });
                context.connector = self.options.context.connector;

                var searchFormRegion = new Marionette.Region({
                        el: '#searchFormDiv'
                });
                WkspUtil.writeTrace("Showing custom search view for ID: ." + formId);
                var queryView = new SimpleSearchView({ context: context, savedSearchQueryId: formId });
                searchFormRegion.show(queryView);
                self.refreshQueryModel(context);
                context.fetch();
            }
        }
    },

    refreshQueryModel: function (context) {
        var self = this;
        var queryModel = context.getModel(SearchQueryModelFactory);

        // Office.js set history.pushState to null which breaks cs.ui functionality. In Outlook add-in, we don't really need to
        // save the history state, so it's safe to set this function to empty. This won't affect cs.ui functions outside of Outlook add-in. 
        history.pushState = function() {};

        queryModel.on('change', Function.createDelegate(this,  //The search button is clicked
            function (event) {
                var searchResultsRegion = new Marionette.Region({el: '#customSearchResult'});
                var searchResultsView = new SimpleSearchResultView({
                        context: context,
                        pageSize: self.pageSize,
                        pageNo: 1,
                        enableEmailSaving: self.enableEmailSaving
                    });
                WkspUtil.startGlobalSpinner();
                WkspUtil.uiHide("customSearchFormArea");
                WkspUtil.uiShow("customSearchResultArea");
                searchResultsRegion.show(searchResultsView);
            }));

        context.fetch();
    },

    backToSearchForm: function(args){
        WkspUtil.uiShow("customSearchFormArea");
        WkspUtil.uiHide("customSearchResultArea");
        $("#conwsoutlook-body").focus();
    },

    backToStandard: function(args){
        WkspUtil.uiShow("standardSections");
        WkspUtil.uiShow("customSearchButton");
        WkspUtil.uiHide("customSearchSection");

        WkspUtil.PreSaveSection = "standardSections";
        $("#conwsoutlook-body").focus();
    }

  });

  return customSearchSectionView;

});


/* START_TEMPLATE */
csui.define('hbs!conws/widgets/outlook/impl/conwsoutlook',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"outlook-container\" >\r\n\r\n    <div class=\"mainPageContent\" id=\"standardSections\">\r\n        <div class=\"outlook-col\" id=\"searchRegion\" ></div>\r\n        <div id=\"nonSearchSections\">\r\n            <div class=\"outlook-col\" id=\"suggestedRegion\" ></div>\r\n            <div class=\"outlook-col\" id=\"favoriteRegion\" ></div>\r\n            <div class=\"outlook-col\" id=\"recentRegion\" ></div>\r\n        </div>\r\n    </div>  \r\n\r\n    <div id=\"customSearchSection\" class=\"hiddenArea\"></div>\r\n    <div id=\"savePanel\" class=\"hiddenArea\"></div>\r\n\r\n    <div class=\"customSearchButton outlook-heading binf-panel-heading hiddenArea\" id=\"customSearchButton\">\r\n        <span class=\"headerIcon forwardIcon\" id=\"customerSearchButtonIcon\" tabindex=\"0\"></span>\r\n        <span >"
    + this.escapeExpression(((helper = (helper = helpers.customSearchLabel || (depth0 != null ? depth0.customSearchLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"customSearchLabel","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n    \r\n    <div id=\"dialogRegion\"></div>\r\n\r\n</div>\r\n";
}});
Handlebars.registerPartial('conws_widgets_outlook_impl_conwsoutlook', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('conws/widgets/outlook/conwsoutlook.view',[
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'csui/utils/contexts/factories/connector',
    'csui/utils/authenticators/request.authenticator',
    'csui/utils/url',
    'csui/utils/nodesprites',
    'conws/utils/icons/icons',
    'conws/widgets/outlook/impl/recentwksps/recentwksps.view',
    'conws/widgets/outlook/impl/favoritewksps/favoritewksps.view',
    'conws/widgets/outlook/impl/searchwksps/searchwksps.view',
    'conws/widgets/outlook/impl/suggestedwksps/suggestedwksps.view',
    'conws/widgets/outlook/impl/searchwksps/customSearchSection.view',
    'conws/widgets/outlook/impl/dialog/authenticator',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',

    'conws/widgets/outlook/impl/metadata/metadata.forms.view',
    'csui/utils/contexts/factories/node',

    'i18n!conws/widgets/outlook/impl/nls/lang',
    'hbs!conws/widgets/outlook/impl/conwsoutlook',
    'css!conws/widgets/outlook/impl/conwsoutlook'
], function ($, _, Marionette, Backbone, PageContext, ConnectorFactory, RequestAuthenticator, Url, NodeSprites, ConwsIcons, RecentWkspsView, FavoriteWkspsView, SearchWkspsView, SuggestedWkspsView, CustomSearchSectionView, Authenticator, WkspUtil, CSService, MetadataFormsView, NodeModelFactory, lang, template) {

    var conwsoutlookView = Marionette.LayoutView.extend({

    className: 'conwsoutlook ',

    template: template,

    regions: {
        searchRegion: '#searchRegion',
        favoriteRegion: '#favoriteRegion',
        recentRegion: '#recentRegion',
        suggestedRegion: '#suggestedRegion',
        customSearchRegion: "#customSearchSection",
        customViewSearchResultRegion: "#customViewSearchResultRegion",
        dialogRegion: '#dialogRegion'
    },

    templateHelpers: function () {
        return {
            customSearchLabel: lang.search_custom_button_label
        }
    },

    events: {
        'click #customSearchButton': 'showCustomSearch',
        'keyup': 'processKey'
    },

    initialize: function(options) {
        this.context = this.options.context;

        var paras = {
            authenticator: new RequestAuthenticator({})
        };
        this.connector = this.context.getObject(ConnectorFactory, paras);
        WkspUtil.setConnector(this.connector);

        var self = this,
            urlObj = new Url(this.connector.connection.url);

        this.connector.timeoutProcessed = false;

        this.connector.authenticator.on("loggedOut", function (args) {
            WkspUtil.stopGlobalSpinner();
            if (!self.connector.timeoutProcessed) {
                WkspUtil.writeTrace("Session logged out.");
                WkspUtil.disableSimpleSearch();
                self.connector.timeoutProcessed = true;
                var authenticator = new Authenticator({ context: self.context, centerVertically: true });
                authenticator.authenticate()
                    .done(function(result){
                        authenticator.beingAuthenticated = false;
                    });
            }
        });

        window.ServerOrigin = urlObj.getOrigin();
        window.ServerCgiScript = urlObj.getCgiScript();

        // Register CONWS icons
        NodeSprites.add(ConwsIcons);

        // extend a whenAll method
        var rawWhen = $.when;
        $.whenAll = function (promise) {
            if ($.isArray(promise)) {
                var dfd = new $.Deferred();
                rawWhen.apply($, promise).done(function () {
                    dfd.resolve(Array.prototype.slice.call(arguments));
                }).fail(function () {
                    dfd.reject(Array.prototype.slice.call(arguments));
                });
                return dfd.promise();
            } else {
                return rawWhen.apply($, arguments);
            }
        }
    },

    onBeforeShow: function (options) {
        var self = this;

        var authenticator = new Authenticator({ context: self.context, centerVertically: true });
        WkspUtil.startGlobalSpinner();
        authenticator.authenticate()
            .done(function (result) {
                WkspUtil.stopGlobalSpinner();
                authenticator.beingAuthenticated = false;
                if (result) {
                    self.context.connector = WkspUtil.getConnector();
                    var addinConfigPromise = CSService.getAddinConfig(self.context.connector);
                    addinConfigPromise.done(function (config) {
                        WkspUtil.setConfig(config, self.context.csUser);
                        
                        self.getRegion('recentRegion').show(new RecentWkspsView({ context: self.context }));
                        self.getRegion('favoriteRegion').show(new FavoriteWkspsView({ context: self.context }));
                        self.getRegion('searchRegion').show(new SearchWkspsView({ context: self.context, enableEmailSaving: true, showSearchFormSelection: WkspUtil.ShowSearchFormSelection }));

                        var wkspConfigPromise = CSService.getSuggestedWkspConfig(self.context.connector);
                        wkspConfigPromise.done(function (wkspConfig) {
                            if (wkspConfig == null || wkspConfig.general == null) {
                                WkspUtil.SuggestedWkspsView = new SuggestedWkspsView({ error: "NoConfiguration" });
                                self.getRegion('suggestedRegion').show(WkspUtil.SuggestedWkspsView);
                            } else if (wkspConfig.general.showSection) {
                                WkspUtil.SuggestedWkspsView = new SuggestedWkspsView({ context: self.context, config: wkspConfig });
                                self.getRegion('suggestedRegion').show(WkspUtil.SuggestedWkspsView);
                            } else {
                                self.getRegion('suggestedRegion').$el.css("display", "none");
                            }
                        });
                        wkspConfigPromise.fail(function(error) {
                            WkspUtil.SuggestedWkspsView = new SuggestedWkspsView({ error: error });
                            self.getRegion('suggestedRegion').show(WkspUtil.SuggestedWkspsView);
                        });

                        // Show the custom search button and custom search region
                        if (config.searchForm.enabled){
                            var queriesPromise = CSService.getSimpleSearchQueries(self.context.connector);
                            queriesPromise.done(function (queries) {
                                if (queries != null && queries.length !== 0) {
                                    WkspUtil.uiShow('customSearchButton');
                                    var top = 'calc(100vh - ' + (WkspUtil.SearchButtonHeight + WkspUtil.TraceAreaHeight) + 'px)';
                                    $('#customSearchButton').css('top', top);
                                    self.getRegion('customSearchRegion').show(new CustomSearchSectionView({ context: self.context, queries: queries }));

                                    // override the hide method to resume the search button position and searc form height after clicking trace hide button
                                    if (WkspUtil.TraceAreaHeight > 0){
                                        var frames = document.querySelectorAll('iframe[id^="log4javascript_"]');
                                        if (frames.length > 0){
                                            var hideFunc = frames[0].contentWindow.hide;

                                            if (typeof hideFunc === "function"){
                                                frames[0].contentWindow.hide = function(){
                                                    $('#customSearchButton').css('top', 'calc(100vh - ' + WkspUtil.SearchButtonHeight + 'px)');
                                                    $(".tile-content").css('height', 'calc(100vh - ' + WkspUtil.SearchFormBottomPadding +'px)');
                                                    $('#saveDisplayArea').css('height', 'calc(100vh - 32px');
                                                    WkspUtil.TraceAreaHeight = 0;
                                                    hideFunc();
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                            queriesPromise.fail(function (error) {
                                $('#topMessage').html(WkspUtil.getErrorMessage(error));
                            });
                        }
                        
                        self.context.fetch();
                    });
                    addinConfigPromise.fail(function(errMsg) {
                        $('#topMessage').html(errMsg);
                    });
                }
            });
        $("#conwsoutlook-body").focus();
    },

    constructor: function conwsoutlookView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    processKey: function(e){
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "customerSearchButtonIcon"){
                this.showCustomSearch(e);
            } 
        }
    },

    showCustomSearch: function(){
        WkspUtil.uiHide("standardSections");
        WkspUtil.uiHide("customSearchButton");
        WkspUtil.uiShow("customSearchSection");

        WkspUtil.PreSaveSection = "customSearchSection";
        $("#conwsoutlook-body").focus();
    }

  });

  return conwsoutlookView;

});

csui.define('conws/widgets/configurationvolume/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/widgets/configurationvolume/impl/nls/root/lang',{
  emptyResultsText: 'There are no items to display.'
});



csui.define('css!conws/widgets/configurationvolume/impl/configurationvolume',[],function(){});
// Shows the Shortcuts widget of specific nodes
csui.define('conws/widgets/configurationvolume/configurationvolume.view',[
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/widgets/shortcuts/shortcuts.view",
  "csui/controls/tile/behaviors/perfect.scrolling.behavior",
  "csui/behaviors/keyboard.navigation/tabable.region.behavior",
  "conws/models/configurationvolume/configurationvolume.factory",
  "i18n!conws/widgets/configurationvolume/impl/nls/lang",
  "css!conws/widgets/configurationvolume/impl/configurationvolume"
], function (_,
    $,
    Backbone,
    Marionette,
    ShortcutsView,
    PerfectScrollingBehavior,
    TabableRegionBehavior,
    ConfigurationVolumeFactory,
    lang) {

  var EmptyVolumeView = Marionette.View.extend({
    className: "conws-empty-configurevolume-container",
    onShow: function() {
      this.$el.text(lang.emptyResultsText);
    }
  });

  var THEME_SUFFIX = ["shade1", "shade2", "shade3", "shade4"];

  var ConfigurationVolumeView = ShortcutsView.extend({

    // CSS class names
    className: 'conws-volumeshortcut-container csui-shortcut-container tile',

    attributes: {
      role: 'menu'
    },

    constructor: function ConfigurationVolumeView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.perspectiveMode = false;
      options.model = options.context.getModel(ConfigurationVolumeFactory, {});
      ShortcutsView.prototype.constructor.call(this, options);
    },

    emptyView: EmptyVolumeView,

    buildChildView: function (child, ChildViewClass, childViewOptions) {
      if (ChildViewClass === EmptyVolumeView) {
        return Marionette.CollectionView.prototype.buildChildView.call(this, child, ChildViewClass,
          childViewOptions);
      }
      return ShortcutsView.prototype.buildChildView.apply(this, arguments);
    },

    modelEvents: {
      change: 'modelChange'
    },

    childEvents: _.extend(ShortcutsView.prototype.childEvents, {
      'render': 'onChildViewRender'
    }),

    onChildViewRender: function(childView) {
      childView.$el.addClass('csui-configurationvolume-container');
    },

    currentlyFocusedElement: function () {
      var currentItem = this.children.findByIndex(this._currentShortcutIndex);
      return currentItem && currentItem.$el;
    },

    modelChange: function () {
      this.collection.set(this.model.get('shortcutItems'));
      this._currentShortcutIndex = 0;
    },

    _getShortcutTheme: function (itemIndex, numberOfItems) {
      var theme = this.options.data.shortcutTheme ? this.options.data.shortcutTheme :
                  "csui-shortcut-theme-grey";
      if (numberOfItems > 1) {
        var numOfShades = THEME_SUFFIX.length;
        //Getting the theme shades indexes from right to left
        theme += "-" + THEME_SUFFIX[(numOfShades - 1) - (itemIndex % numOfShades)];
      }

      return theme;
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    }
  })

  return ConfigurationVolumeView;

});


csui.define('json!conws/widgets/relatedworkspaces/relatedworkspaces.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "schema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "object",
        "title": "{{tileTitle}}",
        "description": "{{tileDescription}}"
      },
      "workspaceTypeId": {
        "type": "integer",
        "title": "{{workspacetypeTitle}}",
        "description": "{{workspacetypeDescription}}"
      },
      "relationType": {
        "type": "string",
        "enum": [ "child", "parent" ],
        "title": "{{relationTypeTitle}}",
        "description": "{{relationTypeDescription}}"
      },
      "collapsedView": {
        "type": "object",
        "title": "{{collapsedViewTitle}}",
        "description": "{{collapsedViewDescription}}",
        "properties": {
          "noResultsPlaceholder": {
            "type": "object",
            "title": "{{noResultsPlaceholderTitle}}",
            "description": "{{noResultsPlaceholderDescription}}"
          },
          "preview": {
            "type": "object",
            "title": "{{previewPaneTitle}}",
            "description": "{{previewPaneDescription}}",
            "properties": {
              "typeName": {
                "type": "object",
                "title": "{{previewTitle}}",
                "description": "{{previewDescription}}"
              },
              "noMetadataMessage": {
                "type": "object",
                "title": "{{noMetadataMessageTitle}}",
                "description": "{{noMetadataMessageDescription}}"
              },
              "roleId": {
                "type": "string",
                "title": "{{roleTitle}}",
                "description": "{{roleDescription}}"
              },
              "noRoleMembersMessage": {
                "type": "object",
                "title": "{{noRoleMembersMessageTitle}}",
                "description": "{{noRoleMembersMessageDesc}}"
              },
              "metadata": {
                "type": "array",
                "title": "{{metadataTitle}}",
                "description": "{{metadataDescription}}",
                "items": {
                  "type": "object",
                  "title": "{{CategoryOrAttributeTitle}}",
                  "description": "{{CategoryOrAttributeDesc}}"
                }
              }
            }
          },
          "orderBy": {
            "type": "object",
            "title": "{{orderTitle}}",
            "description": "{{orderDescription}}",
            "properties": {
              "sortColumn": {
                "type": "string",
                "title": "{{sortColumnTitle}}",
                "description": "{{sortColumnDescription}}"
              },
              "sortOrder": {
                "type": "string",
                "enum": [ "asc", "desc" ],
                "title": "{{sortOrderTitle}}",
                "description": "{{sortOrderDescription}}"
              }
            }
          },
          "title": {
            "type": "object",
            "title": "{{relatedWorkspaceTitle}}",
            "description": "{{relatedWorkspaceDesc}}",
            "properties": {
              "value": {
                "type": "string",
                "title": "{{valueTitle}}",
                "description": "{{valueDescription}}"
              }
            }
          },
          "description": {
            "type": "object",
            "title": "{{descriptionSectionTitle}}",
            "description": "{{descriptionSectionDesc}}",
            "properties": {
              "value": {
                "type": "string",
                "title": "{{descriptionValueTitle}}",
                "description": "{{descriptionFieldValue}}"
              }
            }
          },
          "topRight": {
            "type": "object",
            "title": "{{topRightSectionTitle}}",
            "description": "{{topRightSectionDescription}}",
            "properties": {
              "label": {
                "type": "object",
                "title": "{{topRightLabel}}",
                "description": "{{topRightLabelDesc}}"
              },
              "value": {
                "type": "string",
                "title": "{{topRightValue}}",
                "description": "{{topRightValueDesc}}"
              }
            }
          },
          "bottomLeft": {
            "type": "object",
            "title": "{{bottomLeftTitle}}",
            "description": "{{bottomLeftTitleDesc}}",
            "properties": {
              "label": {
                "type": "object",
                "title": "{{bottomLeftLabelTitle}}",
                "description": "{{bottomLeftLabelDesc}}"
              },
              "value": {
                "type": "string",
                "title": "{{bottomLeftValue}}",
                "description": "{{bottomLeftValueDesc}}"
              }
            }
          },
          "bottomRight": {
            "type": "object",
            "title": "{{bottomRightTitle}}",
            "description": "{{bottomRightTitleDesc}}",
            "properties": {
              "label": {
                "type": "object",
                "title": "{{bottomRightLabel}}",
                "description": "{{bottomRightLabelDesc}}"
              },
              "value": {
                "type": "string",
                "title": "{{bottomRightValue}}",
                "description": "{{bottomRightValueDesc}}"
              }
            }
          }
        }
      },
      "expandedView": {
        "type": "object",
        "title": "{{expandedViewSectionTitle}}",
        "description": "{{expandedViewSectionDesc}}",
        "properties": {
          "orderBy": {
            "type": "object",
            "title": "{{expandedViewOrderByTitle}}",
            "description": "{{expandedViewOrderByDesc}}",
            "properties": {
              "sortColumn": {
                "type": "string",
                "title": "{{expandedViewSortColumnTitle}}",
                "description": "{{expandedViewSortColumnDesc}}"
              },
              "sortOrder": {
                "type": "string",
                "enum": [ "asc", "desc" ],
                "title": "Sort order",
                "description": "{{expandedViewSortOrderDesc}}"
              }
            }
          },
          "customColumns": {
            "type": "array",
            "title": "{{customColumnsSectionTitle}}",
            "description": "{{customColumnsSectionDesc}}",
            "items": {
              "type": "object",
              "title": "{{customColumnsItemsTitle}}",
              "description": "{{customColumnsItemsDesc}}",
              "properties": {
                "key": {
                  "type": "string",
                  "title": "{{customColumnsPropertiesTitle}}",
                  "description": "{{customColumnsPropertiesDesc}}"
                }
              }
            }
          }
        }
      }
    }
  },
  "options": {
    "fields": {
      "title": {
        "type": "otcs_multilingual_string"
      },
      "workspaceTypeId": {
        "type": "otconws_workspacetype_id"
      },
      "relationType": {
        "type": "select",
        "optionLabels": [ "Child", "Parent" ]
      },
      "collapsedView": {
        "fields": {
          "noResultsPlaceholder": {
            "type": "otcs_multilingual_string"
          },
          "preview": {
            "fields": {
              "typeName": {
                "type": "otcs_multilingual_string"
              },
              "noMetadataMessage": {
                "type": "otcs_multilingual_string"
              },
              "noRoleMembersMessage": {
                "type": "otcs_multilingual_string"
              },
              "metadata": {
                "fields": {
                  "item": {
                    "type": "otconws_metadata"
                  }
                }
              }
            }
          },
          "orderBy": {
            "fields": {
              "sortColumn": {
                "type": "otconws_customcolumn"
              },
              "sortOrder": {
                "type": "select",
                "optionLabels": [ "Ascending", "Descending" ]
              }
            }
          },
          "title": {
            "fields": {
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "description": {
            "fields": {
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "topRight": {
            "fields": {
              "label": {
                "type": "otcs_multilingual_string"
              },
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "bottomLeft": {
            "fields": {
              "label": {
                "type": "otcs_multilingual_string"
              },
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "bottomRight": {
            "fields": {
              "label": {
                "type": "otcs_multilingual_string"
              },
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          }
        }
      },
      "expandedView": {
        "fields": {
          "orderBy": {
            "fields": {
              "sortColumn": {
                "type": "otconws_customcolumn"
              },
              "sortOrder": {
                "type": "select",
                "optionLabels": [ "Ascending", "Descending" ]
              }
            }
          },
          "customColumns": {
            "items": {
              "fields": {
                "key": {
                  "type": "otconws_customcolumn"
                }
              }
            }
          }
        }
      }
    }
  }
}
);


csui.define('json!conws/widgets/header/header.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{tileTitle}}",
  "description": "{{tileDescription}}",
  "schema": {
    "type": "object",
    "properties": {
      "workspace": {
        "type": "object",
        "title": "{{workspaceTitle}}",
        "description": "{{workspaceDescription}}",
        "properties": {
          "properties": {
            "type": "object",
            "title": "Properties",
            "description": "{{workspacePropertiesDesc}}",
            "properties": {
              "title": {
                "type": "string",
                "title": "{{businessworkspaceTitle}}",
                "default": "{name}",
                "description": "{{businessworkspaceDesc}}"
              },
              "type": {
                "type": "string",
                "title": "{{workspaceTypeTitle}}",
                "default": "{business_properties.workspace_type_name}",
                "description": "{{workspaceTypeDesc}}"
              },
              "description": {
                "type": "string",
                "title": "{{descriptionSectionTitle}}",
                "default": "{description}",
                "description": "{{descriptionSection}}"
              }
            }
          }
        }
      },
      "widget": {
        "type": "object",
        "title": "{{widgetTitle}}",
        "description": "{{widgetDescription}}",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "none",
              "activityfeed"
            ],
            "title": "{{embedWidgetSectionTitle}}",
            "description": "{{embedWidgetSectionDesc}}"
          }
        }
      }
    }
  },
  "options": {
    "fields": {
      "workspace": {
        "fields": {
          "properties": {
            "fields": {
              "title": {
                "type": "otconws_metadata_string"
              },
              "type": {
                "type": "otconws_metadata_string"
              },
              "description": {
                "type": "otconws_metadata_string"
              }
            }
          }
        }
      },
      "widget": {
        "fields": {
          "type": {
            "type": "select",
            "optionLabels": [
              "None",
              "Activity Feed"
            ]
          }
        }
      }
    }
  }
});


csui.define('json!conws/widgets/team/team.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "schema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "object",
        "title": "{{tileTitle}}",
        "description": "{{tileDescription}}"
      }
    }
  },
  "options": {
    "fields": {
      "title": {
        "type": "otcs_multilingual_string"
      }
    }
  }
});


csui.define('json!conws/widgets/myworkspaces/myworkspaces.manifest.json',{
	"$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
	"title": "{{tileTitle}}",
	"description": "{{tileDescription}}",
	"schema": {
		"type": "object",
		"properties": {
      "title": {
        "type": "object",
        "title": "{{titleSection}}",
        "description": "{{titleDescription}}"
      },
      "workspaceTypeId": {
        "type": "integer",
        "title": "Workspace type",
        "description": "{{WorkspaceTypeDesc}}"
      },
      "collapsedView": {
        "type": "object",
        "title": "{{collapsedViewTitle}}",
        "description": "{{collapsedViewDesc}}",
        "properties": {
          "noResultsPlaceholder": {
            "type": "object",
            "title": "Message for empty result",
            "description": "{{noResultsPlaceholderDesc}}"
          }
        }
      },
      "expandedView": {
        "type": "object",
        "title": "{{expandedViewTitle}}",
        "description": "{{expandedViewDesc}}",
        "properties": {
          "orderBy": {
            "type": "object",
            "title": "{{orderBySectionTitle}}",
            "description": "{{orderBySectionDesc}}",
            "properties": {
              "sortColumn": {
                "type": "string",
                "title": "{{sortColumnSectionTitle}}",
                "description": "{{sortColumnSectionDesc}}"
              },
              "sortOrder": {
                "type": "string",
                "enum": [ "asc", "desc" ],
                "title": "{{sortOrderSectionTitle}}",
                "description": "{{sortOrderSectionDesc}}"
              }
            }
          },
          "customColumns": {
            "type": "array",
            "title": "{{customColumnsTitle}}",
            "description": "{{customColumnsDesc}}",
            "items": {
              "type": "object",
              "title": "{{itemsSectionTitle}}",
              "description": "{{itemsSectionDesc}}",
              "properties": {
                "key": {
                  "type": "string",
                  "title": "{{keyTitle}}",
                  "description": "{{keyDescription}}"
                }
              }
            }
          }
        }
      }
    }
	},
  "options": {
    "fields": {
      "title": {
        "type": "otcs_multilingual_string"
      },
      "workspaceTypeId": {
        "type": "otconws_workspacetype_id"
      },
      "collapsedView": {
        "fields": {
          "noResultsPlaceholder": {
            "type": "otcs_multilingual_string"
          }
        }
      },
      "expandedView": {
        "fields": {
          "orderBy": {
            "fields": {
              "sortColumn": {
                "type": "otconws_customcolumn"
              },
              "sortOrder": {
                "type": "select",
                "optionLabels": [ "Ascending", "Descending" ]
              }
            }
          },
          "customColumns": {
            "items": {
              "fields": {
                "key": {
                  "type": "otconws_customcolumn"
                }
              }
            }
          }
        }
      }
    }
  }
});


csui.define('json!conws/widgets/metadata/metadata.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "schema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "object",
        "title":  "{{tileTitle}}",
        "description": "{{tiledescription}}"
      },
      "hideEmptyFields": {
        "type": "boolean",
        "enum": [true, false],
        "default": false,
        "title": "{{hideEmptyFieldsTitle}}",
        "description": "{{hideEmptyFieldsDescription}}"
      },
      "metadata": {
        "type": "array",
        "title": "{{metadataSectionTitle}}",
        "description": "{{metadataSectionDescription}}",
        "items": {
          "type": "object",
          "title": "{{categoryOrAttributeTitle}}",
          "description": "{{categoryOrAttributeDescription}}"
        }
      }
    }
  },
  "options": {
    "fields": {
      "title": {
        "type": "otcs_multilingual_string"
      },
    "metadata": {
        "fields": {
          "item": {
            "type": "otconws_metadata"
          }
        }
      }
    }
  }
});


csui.define('json!conws/widgets/configurationvolume/configurationvolume.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {
      "shortcutTheme": {
        "title": "{{shortcutThemeTitle}}",
        "description": "{{shortcutThemeDescription}}",
        "type": "string",
        "enum": [
          "csui-shortcut-theme-stone1",
          "csui-shortcut-theme-stone2",
          "csui-shortcut-theme-teal1",
          "csui-shortcut-theme-teal2",
          "csui-shortcut-theme-pink1",
          "csui-shortcut-theme-pink2",
          "csui-shortcut-theme-indigo1",
          "csui-shortcut-theme-indigo2"
        ]
      }
    }
  },
  "options": {
    "fields": {
      "shortcutTheme": {
        "type": "select",
        "optionLabels": [
          "{{shortcutThemeStone1}}",
          "{{shortcutThemeStone2}}",
          "{{shortcutThemeTeal1}}",
          "{{shortcutThemeTeal2}}",
          "{{shortcutThemePink1}}",
          "{{shortcutThemePink2}}",
          "{{shortcutThemeIndigo1}}",
          "{{shortcutThemeIndigo2}}"
        ]
      }
    }
  }
});

csui.define('conws/widgets/configurationvolume/impl/nls/configurationvolume.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('conws/widgets/configurationvolume/impl/nls/root/configurationvolume.manifest',{
  "widgetTitle": "Configuration Volume",
  "widgetDescription": "Tile representing hyperlinks to volumes; it navigates to its page when" +
                       " clicked",
  "shortcutThemeTitle": "Theme",
  "shortcutThemeDescription": "Styling of the volumes",
  "shortcutThemeStone1": "Stone Group 1",
  "shortcutThemeStone2": "Stone Group 2",
  "shortcutThemeTeal1": "Teal Group 1",
  "shortcutThemeTeal2": "Teal Group 2",
  "shortcutThemePink1": "Pink Group 1",
  "shortcutThemePink2": "Pink Group 2",
  "shortcutThemeIndigo1": "Indigo Group 1",
  "shortcutThemeIndigo2": "Indigo Group 2"
});


csui.define('conws/widgets/team/impl/nls/team.manifest',{
	// Always load the root bundle for the default locale (en-us)
	"root": true,
	// Do not load English locale bundle provided by the root bundle
	"en-us": false,
	"en": false
});

csui.define('conws/widgets/team/impl/nls/root/team.manifest',{
	"tileTitle": "Title",
	"tileDescription": "Title in collapsed view",
	"widgetTitle": "Team",
	"widgetDescription": "Shows the team members of a business workspace"
});

csui.define('conws/widgets/metadata/impl/nls/metadata.manifest',{
	// Always load the root bundle for the default locale (en-us)
	"root": true,
	// Do not load English locale bundle provided by the root bundle
	"en-us": false,
	"en": false
});

csui.define('conws/widgets/metadata/impl/nls/root/metadata.manifest',{
	"tileTitle": "Title",
	"tiledescription": "Title of the Metadata widget",
	"widgetTitle": "Metadata",
	"widgetDescription": "Shows metadata for a business workspace",
	"hideEmptyFieldsTitle": "Hide empty fields",
	"hideEmptyFieldsDescription": "Display only fields with values",
	"metadataSectionTitle" : "Metadata",
	"metadataSectionDescription": "Metadata displayed in Metadata widget",
	"categoryOrAttributeTitle": "Category or attribute",
	"categoryOrAttributeDescription": "Category or attribute with metadata"

});

csui.define('conws/widgets/relatedworkspaces/impl/nls/relatedworkspaces.manifest',{
	// Always load the root bundle for the default locale (en-us)
	"root": true,
	// Do not load English locale bundle provided by the root bundle
	"en-us": false,
	"en": false
});

csui.define('conws/widgets/relatedworkspaces/impl/nls/root/relatedworkspaces.manifest',{
	"widgetTitle": "Related Workspaces",
	"widgetDescription": "Shows the related business workspaces for a business workspace",
	"tileTitle": "Title",
	"tileDescription": "Title of the Related Workspaces widget",
	"workspacetypeTitle": "Workspace type",
	"workspacetypeDescription": "Workspace type displayed in this widget",
	"relationTypeTitle": "Relation type",
	"relationTypeDescription": "Relation type of the related workspaces",
	"collapsedViewTitle": "Collapsed view",
	"collapsedViewDescription": "Options for the collapsed view of this widget",
	"noResultsPlaceholderTitle": "Message for empty result",
	"noResultsPlaceholderDescription": "Message if there are no related business workspaces to display",
	"previewPaneTitle": "Preview pane",
	"previewPaneDescription": "Options for the preview pane",
	"previewTitle": "Preview title",
	"previewDescription": "Title of the preview pane",
	"noMetadataMessageTitle": "Message for empty metadata",
	"noMetadataMessageDescription": "Message if there is no metadata to display",
	"roleTitle": "Name of role",
	"roleDescription": "The members of the specified role are displayed in the preview",
	"noRoleMembersMessageTitle": "Message for empty role",
	"noRoleMembersMessageDesc": "Message if there are no role members assigned to the specified role",
	"metadataTitle": "Metadata in preview pane",
	"metadataDescription": "Metadata displayed in preview pane",
	"CategoryOrAttributeTitle": "Category or attribute",
	"CategoryOrAttributeDesc": "Category or attribute with metadata",
	"orderTitle": "Order by",
	"orderDescription": "Sort order of the displayed business workspaces",
	"sortColumnTitle": "Column",
	"sortColumnDescription": "Column to order by",
	"sortOrderTitle": "Sort order",
	"sortOrderDescription": "Sort order to be used",
	"relatedWorkspaceTitle": "Related workspace title",
	"relatedWorkspaceDesc": "Title of the related workspace in collapsed view",
	"valueTitle": "Title",
	"valueDescription": "Value for the Title field",
	"descriptionSectionTitle": "Related workspace description",
	"descriptionSectionDesc": "Description of the related workspace in collapsed view",
	"descriptionValueTitle": "Description",
	"descriptionFieldValue": "Value for the description field",
	"topRightSectionTitle": "Top right metadata field",
	"topRightSectionDescription": "Metadata displayed in top right  metadata field in collapsed view",
	"topRightLabel": "Label",
	"topRightLabelDesc": "Label for the metadata field",
	"topRightValue": "Value",
	"topRightValueDesc": "Value for the top right metadata field",
	"bottomLeftTitle": "Bottom left  metadata field",
	"bottomLeftTitleDesc": "Metadata displayed in bottom left  metadata field in collapsed view",
	"bottomLeftLabelTitle": "Label",
	"bottomLeftLabelDesc": "Label for the metadata field",
	"bottomLeftValue": "Value",
	"bottomLeftValueDesc": "Value for the bottom left metadata  metadata field",
	"bottomRightTitle": "Bottom right  metadata field",
	"bottomRightTitleDesc": "Metadata displayed in bottom right  metadata field in collapsed view",
	"bottomRightLabel": "Label",
	"bottomRightLabelDesc": "Label for the metadata field",
	"bottomRightValue": "Value",
	"bottomRightValueDesc": "Value for the bottom right metadata  metadata field",
	"expandedViewSectionTitle": "Expanded view",
	"expandedViewSectionDesc": "Options for the expanded view of this widget",
	"expandedViewOrderByTitle": "Order by",
	"expandedViewOrderByDesc": "Sort order of the displayed business workspaces",
	"expandedViewSortColumnTitle": "Column",
	"expandedViewSortColumnDesc": "Column to order by",
	"expandedViewSortOrderTitle": "Sort order",
	"expandedViewSortOrderDesc": "Sort order to be used",
	"customColumnsSectionTitle": "Custom columns",
	"customColumnsSectionDesc": "Columns displayed in expanded view",
	"customColumnsItemsTitle": "Column description",
	"customColumnsItemsDesc": "Column displayed in expanded view",
	"customColumnsPropertiesTitle": "Column",
	"customColumnsPropertiesDesc": "Name of the custom column"
	
});

csui.define('conws/widgets/header/impl/nls/header.manifest',{
	// Always load the root bundle for the default locale (en-us)
	"root": true,
	// Do not load English locale bundle provided by the root bundle
	"en-us": false,
	"en": false
});

csui.define('conws/widgets/header/impl/nls/root/header.manifest',{
	"tileTitle": "Header",
	"tileDescription": "Header widget for business workspaces",
	"workspaceTitle": "Workspace",
	"workspaceDescription": "Workspace specific options",
	"workspacePropertiesTitle": "Properties",
	"workspacePropertiesDesc": "Configuration properties",
	"businessworkspaceTitle": "Title",
	"businessworkspaceDesc": "Name of the business workspace",
	"workspaceTypeTitle": "Type",
	"workspaceTypeDesc": "Name of the workspace type",
	"descriptionSectionTitle": "Description",
	"descriptionSection": "Description of the business workspace",
	"widgetTitle": "Widget",
	"widgetDescription": "Additional widget that can be embedded in the header widget",
	"embedWidgetSectionTitle": "Embed widget",
	"embedWidgetSectionDesc": "Widget to be embedded in the header widget"
});

csui.define('conws/widgets/myworkspaces/impl/nls/myworkspaces.manifest',{
	// Always load the root bundle for the default locale (en-us)
	"root": true,
	// Do not load English locale bundle provided by the root bundle
	"en-us": false,
	"en": false
});

csui.define('conws/widgets/myworkspaces/impl/nls/root/myworkspaces.manifest',{
	"tileTitle": "Workspaces",
	"tileDescription": "Shows business workspaces that are relevant in this perspective and role",
	"titleSection": "Title",
	"titleDescription": "Title of the Workspaces widget",
	"WorkspaceTypeTitle": "Workspace type",
	"WorkspaceTypeDesc": "Workspace type displayed in this widget",
	"collapsedViewTitle": "Collapsed view",
	"collapsedViewDesc": "Options for the collapsed view of the widget",
	"noResultsPlaceholderTitle": "Message for empty result",
	"noResultsPlaceholderDesc": "Message if there are no business workspaces to display",
	"expandedViewTitle": "Expanded view",
	"expandedViewDesc": "Options for the expanded view of this widget",
	"orderBySectionTitle": "Order by",
	"orderBySectionDesc": "Sort order of the displayed business workspaces",
	"sortColumnSectionTitle": "Column",
	"sortColumnSectionDesc": "Column to order by",
	"sortOrderSectionTitle": "Sort order",
	"sortOrderSectionDesc": "Sort order to be used",
	"customColumnsTitle": "Custom columns",
	"customColumnsDesc": "Columns displayed in expanded view",
	"itemsSectionTitle": "Column description",
	"itemsSectionDesc": "Column displayed in expanded view",
	"keyTitle": "Column",
	"keyDescription": "Name of the custom column"
});

// Placeholder for the build target file; the name must be the same,
// include public modules from this component

csui.define('bundles/conws-app',[
  // Icons for additional subtypes
  'conws/utils/icons/icons',

  // Public controls
  'conws/controls/inlineforms/workspace/workspace.view',
  'conws/controls/inlineforms/conwstemplate/conwstemplate.view',
  'conws/controls/form/fields/alpaca/referencefield',
  'conws/controls/description/description.view',
  'conws/controls/lazyactions/lazyToolbar.view',
  'conws/controls/selectedmetadataform/selectedmetadataform.view',
  'conws/controls/table/cells/role/role.view',
  'conws/controls/table/cells/permission/role.permission.level.view',
  'conws/controls/userpicker/role.view',

  // Dialogs
  'conws/dialogs/addoreditrole/addoreditrole.wizard',
  'conws/dialogs/applyrolepermissions/apply.role.permissions.view',
  'conws/dialogs/applyrolepermissions/impl/header/apply.role.permissions.header.view',

  // Toolbar extensions
  'conws/utils/commands/tabletoolbar.extension',
  'conws/utils/commands/permissions/permissions.dropdown.menu.items.extension',
  'conws/utils/commands/permissions/permissions.list.toolbaritems.extension',  

  // Tool items mask
  'conws/widgets/header/impl/headertoolbaritems.masks',

  // Public commands
  'conws/utils/commands/addconws',
  'conws/utils/commands/addconwstemplate',
  'conws/utils/commands/delete',
  'conws/utils/commands/permissions/addoreditrole',
  'conws/utils/commands/addrelateditem',
  'conws/utils/commands/deleterelateditem',
  'conws/utils/commands/permissions/deleterole',
  'conws/utils/commands/permissions/edit.role.permissions',
  'conws/utils/commands/permissions/edit.role.permission.helper',
  'conws/utils/dragndrop/dragndrop.subtypes',

  // Classes needed public, to be dynamically loaded.
  'conws/widgets/relatedworkspaces/addrelatedworkspaces.search',

  // Public widgets
  'conws/widgets/relatedworkspaces/relatedworkspaces.view',
  'conws/widgets/header/header.view',
  'conws/widgets/team/team.view',
  'conws/widgets/myworkspaces/myworkspaces.view',
  'conws/widgets/metadata/metadata.view',
  'conws/widgets/outlook/conwsoutlook.view',
  'conws/widgets/configurationvolume/configurationvolume.view',

  // Application widgets manifests
  'json!conws/widgets/relatedworkspaces/relatedworkspaces.manifest.json',
  'json!conws/widgets/header/header.manifest.json',
  'json!conws/widgets/team/team.manifest.json',
  'json!conws/widgets/myworkspaces/myworkspaces.manifest.json',
  'json!conws/widgets/metadata/metadata.manifest.json',
  'json!conws/widgets/configurationvolume/configurationvolume.manifest.json',

  // workspace reference, moved to xecmpf

  // Public library for Outlook integration email service
  'conws/widgets/outlook/impl/utils/emailservice',
  'conws/widgets/outlook/impl/utils/utility',

  // TODO : Why we need to add these here
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'i18n!conws/utils/previewpane/impl/nls/previewpane.lang',
  'i18n!conws/widgets/outlook/impl/nls/lang',
  'i18n!conws/widgets/configurationvolume/impl/nls/lang',
  'i18n!conws/widgets/configurationvolume/impl/nls/configurationvolume.manifest',
  'i18n!conws/widgets/team/impl/nls/team.manifest',
  'i18n!conws/widgets/metadata/impl/nls/metadata.manifest',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/relatedworkspaces.manifest',
  'i18n!conws/widgets/header/impl/nls/header.manifest',
  'i18n!conws/widgets/myworkspaces/impl/nls/myworkspaces.manifest'

], {});

csui.require(['require', 'css'], function (require, css) {

    css.styleLoad(require, 'conws/bundles/conws-app', true);

});

