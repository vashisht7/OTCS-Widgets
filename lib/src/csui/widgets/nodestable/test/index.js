/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

window.csuiDemo(function () {
  require([
      "module",
      "csui/lib/jquery",
      "csui/lib/underscore",
      "csui/lib/marionette",
      "csui/utils/log",
      "csui/utils/base",
      "csui/lib/backbone",
      "csui/widgets/nodestable/nodestable.view",
      'csui/utils/contexts/page/page.context',
      'csui/dialogs/modal.alert/modal.alert',
      'csui/test/sdk-demo-config-parameters'
    ], function (module, $, _, Marionette, log, base, Backbone, NodesTableView, PageContext, ModalAlert) {
      var config = module.config();

      var el = $("#content");

      var nodeIdEW = 2000;
      var nodeId1 = 65909;
      var nodeIdCaseManagement = 122336;
      var nodeIdCasePersons = 734591;
      var nodeIdCustomColumns = 184910;
      var pageSize = 20;

      var context = new PageContext({
        factories: {
          connector: {
            connection: csui.connection
          },
          node: {
            attributes: {id: nodeIdCustomColumns}
          }
        }
      });

      var options = {
        context: context,
        data: {
          pageSize: pageSize
        }
      };

      var nodesTableWidget = new NodesTableView(options);
      nodesTableWidget.render(); // must call for context.fetch because render requests the models in context

      context.fetch().then(function () {
        el.append(nodesTableWidget.el);
        nodesTableWidget.triggerMethod('show'); // triggers the marionette show event

      }).fail(function(error) {
        ModalAlert
        .showError(error.message);
      });
  });
    }
);
