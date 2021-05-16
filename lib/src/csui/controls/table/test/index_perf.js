/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require([
      "module",
      "csui/lib/jquery",
      "csui/lib/underscore",
      "csui/lib/marionette",
      "csui/utils/log",
      "csui/utils/base",
      "csui/lib/backbone",
      "csui/widgets/nodestable/nodestable.view",
      'csui/utils/contexts/page/page.context', './table_performance.mock.data.js'
    ], function (module, $, _, Marionette, log, base, Backbone, NodesTableView, PageContext, mock) {
      var config = module.config();


      var el = $("#content");

    console.stdTimeEnd = console.timeEnd.bind( console);
    var logs = _.extend(console, {});
    console.timeEnd = function () {
        var ret = console.stdTimeEnd.apply(logs, arguments);
      return ret;
    };

    mock.enable();

    var context = new PageContext({
          factories: {
              connector: {
                  connection: {
                      url: '//server/otcs/cs/api/v1',
                      session: {ticket: 'dummy'}
                  }
              },
              node: {attributes: {id: 35536261}}
          }
    });

    var options = {
          context: context,
          el: el,
          data: {pageSize: 100}
        };

    var nodesTableWidget = new NodesTableView(options);


    context.fetch().then( function() {
      nodesTableWidget.render();
      nodesTableWidget.triggerMethod('show');

    });

  console.time('all');

  }
);
