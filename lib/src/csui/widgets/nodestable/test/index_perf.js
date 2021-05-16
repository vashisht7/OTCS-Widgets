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
      'csui/utils/contexts/page/page.context', './nodestable.mock.js'
    ], function (module, $, _, Marionette, log, base, Backbone, NodesTableView, PageContext, mock) {
      var config = module.config();


      var el = $("#content");

    console.stdTimeEnd = console.timeEnd.bind( console);
    var logs = _.extend(console, {});
    console.timeEnd = function () {
        var ret = console.stdTimeEnd.apply(logs, arguments);
      return ret;
    };

      var nodeIdCustomColumns = 184910;
      var pageSize = 20;

      var context = new PageContext({
          factories: {
              connector: {
                  connection: {
                      url: '//server/otcs/cs/api/v1',
                      supportPath: '/support',
                      session: {
                          ticket: 'dummy'
                      }
                  }
              },
              node: {
                  attributes: {id: 2000}
              }
          }
    });

    mock.enable();


    var deferred = $.Deferred();
    var region = new Marionette.Region({el: el});

    function show( ) {
        var options = {
            context: context,
            data: { pageSize: 30 }
        };
        region.empty();
        var nodesTableWidget = new NodesTableView(options);
        region.show(nodesTableWidget);
        return context.fetch();
    }


    console.time('all');
   show()
       .then( show)
       .then( function() {
           console.timeEnd( 'all');
           region.$el.append('100');
       })
   ;

  }
);
