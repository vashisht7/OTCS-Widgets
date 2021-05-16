define([
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
