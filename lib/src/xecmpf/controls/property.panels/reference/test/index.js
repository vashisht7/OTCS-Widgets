/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require([
  'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  "csui/widgets/nodestable/nodestable.view",
  'xecmpf/controls/property.panels/reference/test/reference.panel.mock',
  'csui/lib/require.config!csui/csui-extensions.json',
  'csui/lib/require.config!conws/conws-extensions.json',
  'csui/lib/require.config!xecmpf/xecmpf-extensions.json'
], function ($, Backbone, Marionette,
    PageContext,
    NodesTableView,
    DataManager) {


  var connection1 = {
    url: '//server/otcs/cs/api/v1',
    supportPath: '/support',
    session: {
      ticket: 'dummy'
    }
  };


  require.config({
    config: {
      'csui/utils/contexts/factories/connector': {
        connection: connection1
      },
      'csui/utils/contexts/factories/node': {
        attributes: {
          id: 511690
        }
      },
      paths: {
        xecmpf: '../../../..',
        conws: '../../../../../conws',
        csui: '../../../../../csui',
        greet: '../../..',

        hbs: '../../../../../csui/lib/hbs',
        css: '../../../../../csui/lib/css',
        i18n: '../../../../../csui/lib/i18n',
        json: '../../../../../csui/lib/json',
        txt: '../../../../../csui/lib/text',
        'csui-ext': '../../../../../csui/utils/load-extensions/load-extensions'
      },
      deps: ['csui/lib/require.config!csui/csui-extensions.json']
    }
  });

  var context = new PageContext();
  var contentRegion1 = new Marionette.Region({ el: "#content1" });
  var options = {
    context: context,
    data: {
      pageSize: 20
    }
  };

  var nodesTableView = new NodesTableView(options);
  contentRegion1.show(nodesTableView);
  DataManager.testMaterialSearch1_Common.enable();
  DataManager.testMaterialSearch1_Init.enable();
  DataManager.testMaterialEdit1_Init.enable();
  DataManager.testMaterialSearch1_Select.enable();
  
  context.fetch().then(function () {
    require([
          'xecmpf/controls/property.panels/reference/test/reference.panel.utils'
        ],
        function(
            TestUtils
        ) {
        });
  });

});
