csui.define('otcss/widgets/hello/impl/hello.model',[
  // MVC component support
  'csui/lib/backbone',
  // CS REST API URL parsing and combining
  'csui/utils/url'
], function (Backbone, Url) {
  'use strict';

  var HelloModel = Backbone.Model.extend({
    // Declare model properties with default values
    defaults: {
      name: 'Unnamed'
    },

    // Constructor gives an explicit name to the object in the debugger
    constructor: function HelloModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    // Computes the REST API URL using the connection options
    url: function () {
      // /auth returns information about the authenticated user
      return Url.combine(this.connector.connection.url, '/auth');
    },

    // Massage the server response, so that it looks like object attributes
    parse: function (response) {
      // All attributes are placed below the `data` key
      return response.data;
    }
  });

  return HelloModel;
});

csui.define('otcss/widgets/hello/impl/hello.model.factory',[
  'csui/utils/contexts/factories/factory',   // Factory base to inherit from
  'csui/utils/contexts/factories/connector', // Factory for the server connector
  'otcss/widgets/hello/impl/hello.model'     // Model to create the factory for
], function (ModelFactory, ConnectorFactory, HelloModel) {
  'use strict';

  var HelloModelFactory = ModelFactory.extend({
    // Unique prefix of the default model instance, when this model is placed
    // to a context to be shared by multiple widgets
    propertyPrefix: 'hello',

    constructor: function HelloModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);

      // Expose the model instance in the `property` key on this factory
      // instance to be used by the context
      this.property = new HelloModel(undefined, {
        connector: connector
      });
    },

    fetch: function (options) {
      // Just fetch the model exposed by this factory
      return this.property.fetch(options);
    }
  });

  return HelloModelFactory;
});

// Lists explicit locale mappings and fallbacks

csui.define('otcss/widgets/hello/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('otcss/widgets/hello/impl/nls/root/lang',{
  helloMessage: 'Hello {0} {1}!',
  waitMessage: 'One moment, please...'
});



/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/hello/impl/hello',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span>"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</span>\r\n";
}});
Handlebars.registerPartial('otcss_widgets_hello_impl_hello', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!otcss/widgets/hello/impl/hello',[],function(){});
// An application widget is exposed via a RequireJS module
csui.define('otcss/widgets/hello/hello.view',[
  'csui/lib/underscore',                           // Cross-browser utility belt
  'csui/lib/marionette',                           // MVC application support
  'otcss/widgets/hello/impl/hello.model.factory',  // Factory for the data model
  'i18n!otcss/widgets/hello/impl/nls/lang',  // Use localizable texts
  'hbs!otcss/widgets/hello/impl/hello',            // Template to render the HTML
  'css!otcss/widgets/hello/impl/hello'             // Stylesheet needed for this view
], function (_, Marionette, HelloModelFactory, lang, template) {
  'use strict';

  // An application widget is a view, because it should render a HTML fragment
  var HelloView = Marionette.ItemView.extend({
    // Outermost parent element should contain a unique widget-specific class
    className: 'otcss--hello panel panel-default',

    // Template method rendering the HTML for the view
    template: template,

    // Mix additional properties in the template input data
    templateHelpers: function () {
      // Say hello to the authenticated user, if the model has been fetched,
      // otherwise show a waiting message
      var message = this.model.get('id') ?
                    _.str.sformat(lang.helloMessage,
                        this.model.get('first_name'),
                        this.model.get('last_name')) :
                    lang.waitMessage;
      return {
        message: message
      };
    },

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function HelloView(options) {
      // Obtain the model with the data shown by this view; using the model
      // factory with the context makes the model instance not only shareable
      // with other widgets through the context, but also fetched at the same
      // moment as the other models.
      options.model = options.context.getModel(HelloModelFactory);

      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.ItemView.prototype.constructor.call(this, options);

      // Whenever properties of the model change, re-render the view
      this.listenTo(this.model, 'change', this.render);
    }
  });

  return HelloView;
});


csui.define('json!otcss/widgets/hello/hello.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "Hello",
  "description": "Welcomes the current user.",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  }
}
);


/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/noteview/impl/leftRegion/notecomments',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h2 id=\"title-header\">Note Comments</h2>\r\n<div class=\"ckeditor-widget\"><b>HI This is CKEDITOR Widget</b></div>\r\n";
}});
Handlebars.registerPartial('otcss_widgets_noteview_impl_leftRegion_notecomments', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!otcss/widgets/noteview/impl/utils/headerlayout',[],function(){});
csui.define('otcss/widgets/noteview/impl/leftRegion/notecomments.view',[
    'csui/lib/underscore',                           // Cross-browser utility belt
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/lib/jquery',
    'csui/controls/rich.text.editor/rich.text.editor',
    'csui/controls/form/fields/textareafield.view',
    'csui/controls/form/fields/selectfield.view',
    'hbs!otcss/widgets/noteview/impl/leftRegion/notecomments',
    'css!otcss/widgets/noteview/impl/utils/headerlayout'
], function (_, Backbone, Marionette, $, RichTextEditor, TextAreaFieldView, SelectFieldView, template) {


    var NoteCommentsView = Marionette.LayoutView.extend({
        className: 'viewerTwoView',
        template: template,
        onRender: function () {
            var CKEDITOR = RichTextEditor.getRichTextEditor();
            var ckDiv = this.$el.find('.ckeditor-widget')[0];
            CKEDITOR.replace(ckDiv);
        }
    });
    return NoteCommentsView;

});

/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/noteview/impl/utils/csviewer',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csviewer\"></div>";
}});
Handlebars.registerPartial('otcss_widgets_noteview_impl_utils_csviewer', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('otcss/widgets/noteview/impl/utils/Utils',[
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!otcss/widgets/noteview/impl/utils/csviewer'
], function (_, Backbone, Marionette, csviewerhbs) {
  var Utils = {
    getDropdownItems: function (namesOfDocs) {
      return {
        id: 'selectField',
        collection: new Backbone.Collection(namesOfDocs),
        model: new Backbone.Model({
          options: {
            isMultiFieldItem: false,
            selected: true,
            mode: 'read', // 'read', 'readonly', 'writeonly' ?
          },
        }),
        mode: 'read',
        alpaca: {
          schema: {
            title: 'URL',
            type: 'string',
          },
          options: {
            setRequiredFieldsEditable: false,
          },
        },
      };
    },
    getCSViewer: function (docIds, currentPageObj, pageDropDownEvent) {
      var csviewer = Marionette.ItemView.extend({
        className: 'csv',
        template: csviewerhbs,
        constructor: function (options) {
          options || (options = {});
          Marionette.ItemView.prototype.constructor.apply(
            this,
            arguments
          );
        },
        onRender: function () {
          var self = this;
          csui.require(['csv/widgets/csviewer/csviewer.view'], function (
            csv
          ) {
            this.csvRegion = new Marionette.Region({
              el: self.$el,
            });
            this.options.data = { id: docIds[pageDropDownEvent.fieldvalue] };
            this.csvView = new csv(_.extend({}, this.options));
            this.csvRegion.show(this.csvView);
          }.bind(currentPageObj));
        },
      });
      return csviewer;
    }
  };
  return Utils;
});

csui.define('otcss/widgets/noteview/impl/utils/retrievingDocs',[
  'csui/lib/jquery',
  'csui/utils/connector',
  'csui/models/node/node.model',
  "csui/models/node.children2/node.children2"
], function ($, Connector,NodeModel,NodeChildren2Collection) {
      var names,ids;
  var connection = {
    url: "http://localhost/otcs/cs.exe/api/v1",
    supportPath: "/otcssamples",
  };
  var connector = new Connector({
    connection: connection
  });
  var link = window.location.href.split("/");
  var matchs =link[link.length - 1].match(/(\d+)/);
  console.log(matchs[0]);
  var container = new NodeModel({ id: parseInt(matchs[0]) }, { connector: connector });
  var children = new NodeChildren2Collection(undefined, { node: container });
  return children;
  });

/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/noteview/impl/centerRegion/viewerone',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"center-header-toolbar\">\r\n    <button class=\"center-collapse-btn\" id=\"left\">\r\n    </button>\r\n    <i class=\"fas fa-heart\"></i>\r\n    <h2 id=\"title-header\">View Document</h2>\r\n    <button class=\"right-collapse-btn\" id=\"right\">\r\n    </button>\r\n</div>\r\n<div class=\"flex-containers\">\r\n    <div class=\"selectDocument-fieldname\">SelectDocument: </div>\r\n    <div id=\"selectDocument\"></div>\r\n</div>\r\n<div class=\"viewer-flex-container\">\r\n    <div id=\"csviewer\"></div>\r\n</div>\r\n\r\n";
}});
Handlebars.registerPartial('otcss_widgets_noteview_impl_centerRegion_viewerone', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('otcss/widgets/noteview/impl/centerRegion/viewerone.view',[
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',
    'csui/lib/jquery',
    'csui/controls/form/fields/selectfield.view',
    'otcss/widgets/noteview/impl/utils/Utils',
    'otcss/widgets/noteview/impl/utils/retrievingDocs',
    'hbs!otcss/widgets/noteview/impl/centerRegion/viewerone',
    'css!otcss/widgets/noteview/impl/utils/headerlayout'             // Stylesheet needed for this view

], function (_, Marionette, Backbone, $, SelectFieldView, Utils, RetrievingDocs,  template) {

    var ViewerOneView = Marionette.LayoutView.extend({
        className: 'ViewerOneView',
        template: template,
        regions: {
            selectDocument: '#selectDocument',
            csviewer: '#csviewer'
        },
        onRender: function () {
            var currentPageObj = this;
            var docsNames, docsIds =[];
            console.log(RetrievingDocs);
              RetrievingDocs.fetch().done(function () {
                        docsNames =RetrievingDocs.pluck('name');
                        docsIds = RetrievingDocs.pluck('id');
                        var namesOfDocs = [];
                        var docIds = [];
                        docsNames.forEach( function(value, index) {
                            namesOfDocs.push({ id: index, name: value });
                        });
                    
                        docsIds.forEach(function(value) {
                            docIds.push(value.toString());
                        });
                        
                        var docSelectField = new SelectFieldView(Utils.getDropdownItems(namesOfDocs));
                        docSelectField.on('field:changed', function (pageDropDownEvent) {
                        var csviewer = Utils.getCSViewer(docIds, currentPageObj.options.obj, pageDropDownEvent);
                        currentPageObj.showChildView('csviewer', new csviewer());
                            });
                        currentPageObj.showChildView('selectDocument', docSelectField);
                    });
          
                },
            
        }
    );
    return ViewerOneView;

});

/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/noteview/impl/rightregion/viewertwo',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h2 id=\"title-header\">View Document</h2>\r\n<div class=\"flex-containers\">\r\n    <div class=\"selectDocument-fieldname\">SelectDocument: </div>\r\n    <div id=\"selectDocument\"></div>\r\n</div>\r\n<div class=\"viewer-flex-container\">\r\n    <div id=\"csviewer\"></div>\r\n</div>";
}});
Handlebars.registerPartial('otcss_widgets_noteview_impl_rightregion_viewertwo', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('otcss/widgets/noteview/impl/rightregion/viewertwo.view',[
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',
    'csui/lib/jquery',
    'csui/controls/form/fields/selectfield.view',
    'otcss/widgets/noteview/impl/utils/Utils',
    'otcss/widgets/noteview/impl/utils/retrievingDocs',
    'hbs!otcss/widgets/noteview/impl/rightregion/viewertwo',
    'css!otcss/widgets/noteview/impl/utils/headerlayout'
], function (_, Marionette, Backbone, $, SelectFieldView, Utils, RetrievingDocs, template) {

    var ViewerTwoView = Marionette.LayoutView.extend({
        className: 'viewerTwoView',
        template: template,
        regions: {
            selectDocument: '#selectDocument',
            csviewer: '#csviewer'
        },
        onRender: function () {
            var currentPageObj = this;
            var docsNames, docsIds =[];
              RetrievingDocs
                .fetch()
                    .done(function () {
                        docsNames =RetrievingDocs.pluck('name');
                        docsIds = RetrievingDocs.pluck('id');
                        var namesOfDocs = [];
                        var docIds = [];
                        console.log('viewerone');
                        docsNames.forEach( function(value, index) {
                            namesOfDocs.push({ id: index, name: value });
                        });
                       
                        docsIds.forEach(function(value) {
                            docIds.push(value.toString());
                        });
                        
                        var docSelectField = new SelectFieldView(Utils.getDropdownItems(namesOfDocs));
                        docSelectField.on('field:changed', function (pageDropDownEvent) {
                        var csviewer = Utils.getCSViewer(docIds, currentPageObj.options.obj, pageDropDownEvent);
                        currentPageObj.showChildView('csviewer', new csviewer());
                        });
                        currentPageObj.showChildView('selectDocument', docSelectField);
                    });
          
        }
    });
    return ViewerTwoView;
});
// Lists explicit locale mappings and fallbacks

csui.define('otcss/widgets/noteview/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('otcss/widgets/noteview/impl/nls/root/lang',{
  helloMessage: 'Hello {0} {1}!',
  waitMessage: 'One moment, please...'
});



/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/noteview/impl/noteview',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"row\">\r\n    <div class=\"flex-container\">\r\n        <div class=\"leftColumn\" id=\"leftRegion\"></div>\r\n        <div class=\"centerColumn\" id=\"centerRegion\"></div>\r\n        <div class=\"rightColumn\" id=\"rightRegion\"></div>\r\n    </div>\r\n</div>";
}});
Handlebars.registerPartial('otcss_widgets_noteview_impl_noteview', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!otcss/widgets/noteview/impl/noteview',[],function(){});
csui.define('otcss/widgets/noteview/noteview.view',[
  'csui/lib/underscore',                           // Cross-browser utility belt
  'csui/lib/marionette',                           // MVC application support
  'otcss/widgets/noteview/impl/leftRegion/notecomments.view',
  'otcss/widgets/noteview/impl/centerRegion/viewerone.view',
  'otcss/widgets/noteview/impl/rightregion/viewertwo.view',
  'i18n!otcss/widgets/noteview/impl/nls/lang',
  'hbs!otcss/widgets/noteview/impl/noteview',            // Template to render the HTML
  'css!otcss/widgets/noteview/impl/noteview'             // Stylesheet needed for this view
], function (_, Marionette, NoteCommentsView, ViewerOneView,ViewerTwoView,  lang, template) {
  'use strict';

  var NoteviewView = Marionette.LayoutView.extend({
    className: 'otcss--noteview panel panel-default',

    template: template,
    regions: {
      leftRegion: '#leftRegion',
      centerRegion: '#centerRegion',
      rightRegion: '#rightRegion'
    },

    ui: {
      leftcollapsebtn: '.center-collapse-btn',
      rightcollpsebtn: '.right-collapse-btn',
    },
    events: {
      'click @ui.leftcollapsebtn': 'onLeftCollapseBtn',
      'click @ui.rightcollpsebtn': 'onRightCollapseBtn',
    },
    onLeftCollapseBtn: function () {
      this.$('.leftColumn').toggle();
    },
    onRightCollapseBtn: function () {
      this.$('.rightColumn').toggle();
    },

    constructor: function NoteviewView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);

    },
    onRender: function () {
      this.options.obj = this;
      this.showChildView('leftRegion', new NoteCommentsView());
      this.showChildView('centerRegion', new ViewerOneView(this.options));
     this.showChildView('rightRegion', new ViewerTwoView(this.options));
    }
  });

  return NoteviewView;
});


csui.define('json!otcss/widgets/noteview/noteview.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "noteview",
  "description": "Welcomes the current user.",
  "kind": "fullpage",
  "schema": {
    "type": "object",
    "properties": {}
  }
}
);

csui.define('otcss/perspective.context.plugin/lp.perspective.context.plugin',['csui/lib/underscore', 'csui/lib/backbone',
'csui/lib/jquery',
'csui/utils/contexts/factories/application.scope.factory',
'csui/utils/contexts/perspective/perspective.context.plugin'], function(_, Backbone,$, ApplicationScopeModelFactory,
     PerspectiveContextPlugin) {

        var LPPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

            constructor: function LPPerspectiveContextPlugin(options) {
                PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

                this.applicationScope = this.context
                    .getModel(ApplicationScopeModelFactory)
                    .on('change', this._fetchLPPerspective, this);
            },
            _fetchLPPerspective: function() {
                if(this.applicationScope.id !== 'lp'){
                    return;
                }
                if (this.loadPerspective){
                    return;
                }
                this.applicationScope.set('id', 'lp');
                this.context.loadPerspective('json!otcss/pages/lp.json');
                $('.otcss--noteview panel panel-default').height(100);
            }
        });

        return LPPerspectiveContextPlugin;
});
csui.define('otcss/perspective.routers/lp.perspective.router',[
  "csui/pages/start/perspective.router",
  "csui/utils/contexts/factories/application.scope.factory",
], function (PerspectiveRouter, ApplicationScopeModelFactory) {
  var LPPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      lp: "openLP",
    },

    constructor: function LPPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(
        ApplicationScopeModelFactory
      );
      this.listenTo(this.applicationScope, "change", this._updateUrl);
    },
    openLP: function () {
      this.applicationScope.set("id", "lp");
    },
    // onOtherRoute: function () {
    //   this.applicationScope.clear({silent: true});
    // },
    _updateUrl: function () {
      if (this.applicationScope.id !== 'lp') {
        return;
      }
      this.navigate("lp");
    },
  });
  return LPPerspectiveRouter;
});


csui.define('json!otcss/pages/lp.json',{
    "type": "grid",
    "kind": "fullpage",
    "options": {
      "rows": [
        {
          "columns": [
            {
              "sizes": {
                "xs": 12
              },
              "heights": {
                "xs": "full"
              },
              "widget": {
                "type": "otcss/widgets/noteview",
                "options": {
                }
              }
            }
          ]
        }
      ]
    }
  }
  );

csui.define('otcss/commands/NoteComment/impl/nls/lang',{
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('otcss/commands/NoteComment/impl/nls/root/lang',{

  toolbarButtonTitle: 'Note Comment',
  dialogTitle       : 'Note Comment',
  message           : 'This is for Testing'

});


csui.define('otcss/commands/NoteComment/note.comment.command',['require', 'csui/lib/underscore', 'csui/lib/jquery',
'csui/models/command', 'csui/utils/commandhelper',
'i18n!otcss/commands/NoteComment/impl/nls/lang'
],function(require, _, $, CommandModel, CommandHelper,lang) {
    var ModalAlert;

  var NoteCommentCommand = CommandModel.extend({

    defaults: {
      signature: 'otcss-note-comment',
      name     : lang.toolbarButtonTitle,
      scope    : 'single'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 848;
    },

    execute: function (status, options) {
      var self     = this,
          deferred = $.Deferred();
      csui.require(['csui/lib/backbone'
      ], function (Backbone) {
        var Router = Backbone.Router.extend({});
           
        var routerobj = new Router();
        routerobj.navigate("/lp",{trigger : true,replace : true});
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  return NoteCommentCommand;

});
csui.define('otcss/commands/NoteComment/note.comment.nodestable.toolitems',['i18n!otcss/commands/NoteComment/impl/nls/lang'], function (lang) {
  'use strict';

  return {
    //This adds the command in the upper toolbar
    otherToolbar   : [
      {
        signature: 'otcss-note-comment',
        name     : lang.toolbarButtonTitle
      }
    ],
    //This will add the command in the context menu of nodes
    inlineActionbar: [
      {
        signature: 'otcss-note-comment',
        name     : lang.toolbarButtonTitle
      }
    ]
  };

});

csui.define('otcss/commands/ViewNote/impl/nls/lang',{
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('otcss/commands/ViewNote/impl/nls/root/lang',{

  toolbarButtonTitle: 'Add Note Comment',
  dialogTitle       : 'Add Note Comment',
  message           : 'This is for Testing'

});


csui.define('otcss/commands/ViewNote/view.note.command',[
  "require",
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/models/command",
  "csui/utils/commandhelper",
  "i18n!otcss/commands/ViewNote/impl/nls/lang",
], function (require, _, $, CommandModel, CommandHelper, lang) {
  var ModalAlert;

  var ViewNoteCommand = CommandModel.extend({
    defaults: {
      signature: "otcss-view-note",
      name: lang.toolbarButtonTitle,
      scope: "single",
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get("type") === 144;
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      csui.require([
        "csui/lib/marionette",
        "csui/lib/jquery",
        "csui/utils/connector",
        "csui/controls/rich.text.editor/rich.text.editor",
        "csui/controls/dialog/dialog.view",
        "csui/models/node/node.model",
        "csui/models/node.children2/node.children2",
      ], function (
        Marionette,
        $,
        Connector,
        RichTextEditor,
        DialogView,
        NodeModel,
        NodeChildren2Collection
      ) {
        var CKEDITOR = RichTextEditor.getRichTextEditor();
        if (status.originatingView === undefined) {
        } else {
          var $originatingView = status.originatingView.$el;
          $originatingView.append("<div class='dialogbox'></div>");
          //$originatingView.append('<input type="button" value="new button"/>');
          var dialog = $originatingView.parent().find(".dialogbox")[0];
          var contentRegion = new Marionette.Region({
            el: dialog,
          });
          var options = { title: "View Note", Size: "largeSize" };
          var control = new DialogView(options);
          control.render();
          contentRegion.show(control);

          var csProperties = $originatingView
            .parent()
            .find(".binf-modal-body")[0];
          CKEDITOR.stylesSet.add("my_styles", [
            // Block-level styles
            {
              name: "Blue Title",
              element: "div",
              styles: { "background-color": "Blue" },
            },
          ]);
          CKEDITOR.replace(csProperties, {
            height: "20em",
            uiColor: "#008000",
            width: "48em",
            stylesSet: "my_styles",
            contentsCss: "style.css",
          });
          $(".binf-modal-content").width("50em");
          $(".binf-modal-content").height("30em");
          var footer = $originatingView.parent().find(".binf-modal-content")[0];
          var r = $('<input type="button" value="SAVE"/>');
          $(footer).append(r);
          $("input").on("click", function () {
            var connection = {
              url: "http://localhost/otcs/cs.exe/api/v1",
              supportPath: "/otcssamples",
            };
            var connector = new Connector({
              connection: connection,
            });
            var ckeditordata = CKEDITOR.instances.editor1.getData();
            console.log(ckeditordata.replace(/<[^>]+>/g, ""));
            var link = window.location.href.split("/");
            var matchs =link[link.length - 1].match(/(\d+)/);
            console.log(matchs[0]);
            var container = new NodeModel(
              { id: parseInt(matchs[0]) },
              { connector: connector }
            );
            var children = new NodeChildren2Collection(undefined, {
              node: container,
            });
            var docsIds = [];
            var docIds = [];

            children.fetch().done(function () {
              docsIds = children.pluck("id");
              docsIds.forEach(function (value) {
                docIds.push(value.toString());
              });
              $.ajax({
                type: "POST",
                url: "http://localhost/otcs/cs.exe/api/v1/ckeditordata",
                dataType: "json",
                headers: {
                  Authorization: "Basic " + btoa("Admin" + ":" + "Sedin@123"),
                },
                data: {
                  data: ckeditordata.replace(/<[^>]+>/g, ""),
                  nodeid: docIds[0],
                },
              }).done(function (data) {
                console.log(data);
              });
              // var data = ckeditordata.replace(/<[^>]+>/g, "");
              // connector.makeAjaxCall({
              //   type: "POST",
              //   dataType: 'json',
              //   contentType: "application/x-www-form-urlencoded",
              //  data:{'data':data,'nodeid': docsIds[0]},
              //   url:
              //     "api/v1/ckeditordata",
              // }).then(
              //   function (response) {
              //     console.log(response);
              //   },
              //   function (jqxhr) {
              //     console.log("not authenticated");
              //   }
              // );
            });

           
          });
        }
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    },
  });

  return ViewNoteCommand;
});

csui.define('otcss/commands/ViewNote/view.note.nodestable.toolitems',['i18n!otcss/commands/ViewNote/impl/nls/lang'], function (lang) {
    'use strict';
  
    return {
      //This adds the command in the upper toolbar
      otherToolbar   : [
        {
          signature: 'otcss-view-note',
          name     : lang.toolbarButtonTitle
        }
      ],
      //This will add the command in the context menu of nodes
      inlineActionbar: [
        {
          signature: 'otcss-view-note',
          name     : lang.toolbarButtonTitle
        }
      ]
    };
  
  });
  
csui.define('otcss/widgets/getdeptnames/impl/utils/Utils',[
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!otcss/widgets/noteview/impl/utils/csviewer'
], function (_, Backbone, Marionette, csviewerhbs) {
  var Utils = {
    getDropdownItems: function (namesOfDocs) {
      return {
        id: 'selectField',
        collection: new Backbone.Collection(namesOfDocs),
        model: new Backbone.Model({
          options: {
            isMultiFieldItem: false,
            selected: true,
            mode: 'read', // 'read', 'readonly', 'writeonly' ?
          },
        }),
        mode: 'read',
        alpaca: {
          schema: {
            title: 'URL',
            type: 'string',
          },
          options: {
            setRequiredFieldsEditable: false,
          },
        },
      };
    },
    getCSViewer: function (docIds, currentPageObj, pageDropDownEvent) {
      var csviewer = Marionette.ItemView.extend({
        className: 'csv',
        template: csviewerhbs,
        constructor: function (options) {
          options || (options = {});
          Marionette.ItemView.prototype.constructor.apply(
            this,
            arguments
          );
        },
        onRender: function () {
          var self = this;
          csui.require(['csv/widgets/csviewer/csviewer.view'], function (
            csv
          ) {
            this.csvRegion = new Marionette.Region({
              el: self.$el,
            });
            this.options.data = { id: docIds[pageDropDownEvent.fieldvalue] };
            this.csvView = new csv(_.extend({}, this.options));
            this.csvRegion.show(this.csvView);
          }.bind(currentPageObj));
        },
      });
      return csviewer;
    }
  };
  return Utils;
});

csui.define('otcss/widgets/getdeptnames/impl/utils/retrievingDocs',[
  'csui/lib/jquery',
  'csui/utils/connector',
  'csui/models/node/node.model',
  "csui/models/node.children2/node.children2"
], function ($, Connector,NodeModel,NodeChildren2Collection) {
      var names,ids;
  var connection = {
    url: "http://localhost/otcs/cs.exe/api/v1",
    supportPath: "/otcssamples",
  };
  var connector = new Connector({
    connection: connection
  });
  var container = new NodeModel({ id: 306006 }, { connector: connector });
  var children = new NodeChildren2Collection(undefined, { node: container });
  return children;
  });

/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/getdeptnames/impl/getdeptnames',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"selectDocument\"></div>\r\n";
}});
Handlebars.registerPartial('otcss_widgets_getdeptnames_impl_getdeptnames', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!otcss/widgets/getdeptnames/impl/getdeptnames',[],function(){});
// An application widget is exposed via a RequireJS module
csui.define('otcss/widgets/getdeptnames/getdeptnames.view',[
  'csui/lib/underscore',                           // Cross-browser utility belt
  'csui/lib/marionette',                           // MVC application support
  'csui/controls/form/fields/selectfield.view',
  'otcss/widgets/getdeptnames/impl/utils/Utils',
  'otcss/widgets/getdeptnames/impl/utils/retrievingDocs',
  'hbs!otcss/widgets/getdeptnames/impl/getdeptnames',            // Template to render the HTML
  'css!otcss/widgets/getdeptnames/impl/getdeptnames'             // Stylesheet needed for this view
], function (_, Marionette,SelectFieldView ,Utils, RetrievingDocs,template) {
  'use strict';

  // An application widget is a view, because it should render a HTML fragment
  var GetdeptnamesView = Marionette.LayoutView.extend({
    // Outermost parent element should contain a unique widget-specific class
    className: 'otcss--getdeptnames panel panel-default',

    // Template method rendering the HTML for the view
    template: template,
    regions: {
      selectDocument: '.selectDocument'
  },
  onRender: function () {
    var currentPageObj = this;
    var docsNames, docsIds =[];
      RetrievingDocs.fetch().done(function () {
                docsNames =RetrievingDocs.pluck('name');
                docsIds = RetrievingDocs.pluck('id');
                var namesOfDocs = [];
                var docIds = [];
                docsNames.forEach( function(value, index) {
                    namesOfDocs.push({ id: index, name: value });
                });
               
                docsIds.forEach(function(value) {
                    docIds.push(value.toString());
                });
                
                var docSelectField = new SelectFieldView(Utils.getDropdownItems(namesOfDocs));
                docSelectField.on('field:changed', function (pageDropDownEvent) {
                  
                    });
                currentPageObj.showChildView('selectDocument', docSelectField);
            });
  
        },
  
  });

  return GetdeptnamesView;
});


csui.define('json!otcss/widgets/getdeptnames/getdeptnames.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "getdeptnames",
  "description": "Welcomes the current user.",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  }
}
);

csui.define('otcss/widgets/dps/impl/dps.model',[
  // MVC component support
  'csui/lib/backbone',
  // CS REST API URL parsing and combining
  'csui/utils/url'
], function (Backbone, Url) {
  'use strict';

  var DpsModel = Backbone.Model.extend({
    // Declare model properties with default values
    defaults: {
      name: 'Unnamed'
    },

    // Constructor gives an explicit name to the object in the debugger
    constructor: function DpsModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    // Computes the REST API URL using the connection options
    url: function () {
      // /auth returns information about the authenticated user
      return Url.combine(this.connector.connection.url, '/auth');
    },

    // Massage the server response, so that it looks like object attributes
    parse: function (response) {
      // All attributes are placed below the `data` key
      return response.data;
    }
  });

  return DpsModel;
});

csui.define('otcss/widgets/dps/impl/dps.model.factory',[
  'csui/utils/contexts/factories/factory',   // Factory base to inherit from
  'csui/utils/contexts/factories/connector', // Factory for the server connector
  'otcss/widgets/dps/impl/dps.model'     // Model to create the factory for
], function (ModelFactory, ConnectorFactory, DpsModel) {
  'use strict';

  var DpsModelFactory = ModelFactory.extend({
    // Unique prefix of the default model instance, when this model is placed
    // to a context to be shared by multiple widgets
    propertyPrefix: 'dps',

    constructor: function DpsModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);

      // Expose the model instance in the `property` key on this factory
      // instance to be used by the context
      this.property = new DpsModel(undefined, {
        connector: connector
      });
    },

    fetch: function (options) {
      // Just fetch the model exposed by this factory
      return this.property.fetch(options);
    }
  });

  return DpsModelFactory;
});

// Lists explicit locale mappings and fallbacks

csui.define('otcss/widgets/dps/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('otcss/widgets/dps/impl/nls/root/lang',{
  helloMessage: 'Hello {0} {1}!',
  waitMessage: 'One moment, please...'
});



/* START_TEMPLATE */
csui.define('hbs!otcss/widgets/dps/impl/dps',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"dps\"></div>\r\n";
}});
Handlebars.registerPartial('otcss_widgets_dps_impl_dps', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!otcss/widgets/dps/impl/dps',[],function(){});
csui.define('otcss/widgets/dps/dps.view',[
  "csui/lib/underscore", 
  "csui/lib/marionette",
  "csui/lib/jquery",
  "csui/utils/connector", 
  "otcss/widgets/dps/impl/dps.model.factory", 
  "i18n!otcss/widgets/dps/impl/nls/lang",
  "csui/utils/contexts/page/page.context",
  "csui/perspectives/tabbed/tabbed.perspective.view",
  //"otcss/widgets/testing/testing.view", 
  "hbs!otcss/widgets/dps/impl/dps",
  "css!otcss/widgets/dps/impl/dps", 
], function (
  _,
  Marionette,
  $,
  Connector,
  DpsModelFactory,
  lang,
  PageContext,
  TabbedPerspectiveView,
  template
) {
  "use strict";
  var DpsView = Marionette.ItemView.extend({
    className: "otcss--dps panel panel-default",
    template: template,
    constructor: function DpsView(options) {
      options.model = options.context.getModel(DpsModelFactory);
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.listenTo(this.model, "change", this.render);
    },
    onRender: function () {
      var contentRegion = new Marionette.Region({
        el: ".cs-header",
      });
      var connection = {
        url: "http://localhost/otcs/cs.exe/api/v1",
        supportPath: "/otcssamples",
      };
      var connector = new Connector({
        connection: connection,
      });
      connector
        .makeAjaxCall({
          type: "GET",
          url: "http://localhost/otcs/cs.exe/api/v1/auth",
          dataType: "json",
        })
        .then(function (response) {
          var id = response.data.id;
          console.log(id);
          connector
            .makeAjaxCall({
              type: "GET",
              url:
                "http://localhost/otcs/cs.exe/api/v1/groupname/" +
                id.toString(),
              dataType: "json",
            })
            .then(function (response) {
              var caseid = window.location.href.split("/");
              var pageContext = new PageContext({
                factories: {
                  connector: connector,
                  node: {
                    attributes: { id: parseInt(caseid[caseid.length - 1]) },
                  },
                },
              });

              var perspectiveConfig = {
                header: {
                  widget: {
                    type: "conws/widgets/header",
                    options: {
                      workspace: {
                        properties: {
                          title: "{name}",
                          type: "{business_properties.workspace_type_name}",
                          description: response.message,
                          info:
                            "{categories.20368_3}.\n\nValid from: {categories.23228_2_1_39}\nValid to: {categories.23228_2_1_40}",
                        },
                      },
                      widget: { type: "activityfeed" },
                    },
                  },
                },
              };

              var perspectiveView = new TabbedPerspectiveView(
                _.defaults({ context: pageContext }, perspectiveConfig)
              );
              perspectiveView.widgetsResolved.always(function () {
                contentRegion.show(perspectiveView);
                pageContext.fetch();
              });
              
              
             // document.getElementsByClassName('cs-header').style.height="126px";
            });
        });
    
        $(".cs-header").height("126px");
      },
  });

  return DpsView;
});


csui.define('json!otcss/widgets/dps/dps.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "dps",
  "description": "Welcomes the current user.",
  "kind": "header",
  "schema": {
    "type": "object",
    "properties": {}
  }
});

// Placeholder for the build target file; the name must be the same,
// include public modules from this component

csui.define('bundles/otcss-all',[
  'otcss/widgets/hello/hello.view',
  'json!otcss/widgets/hello/hello.manifest.json',
  'otcss/widgets/noteview/noteview.view',
  'json!otcss/widgets/noteview/noteview.manifest.json',
  'otcss/perspective.context.plugin/lp.perspective.context.plugin',
  'otcss/perspective.routers/lp.perspective.router',
  'json!otcss/pages/lp.json',
  'otcss/commands/NoteComment/note.comment.command',
  'otcss/commands/NoteComment/note.comment.nodestable.toolitems',
  'otcss/commands/ViewNote/view.note.command',
  'otcss/commands/ViewNote/view.note.nodestable.toolitems',
  'otcss/widgets/getdeptnames/getdeptnames.view',
  'json!otcss/widgets/getdeptnames/getdeptnames.manifest.json',
  'otcss/widgets/dps/dps.view',
  'json!otcss/widgets/dps/dps.manifest.json'
], {});

csui.require([
  'require',
  'css'
], function (require, css) {

  // Load the bundle-specific stylesheet
  css.styleLoad(require, 'otcss/bundles/otcss-all');
});
