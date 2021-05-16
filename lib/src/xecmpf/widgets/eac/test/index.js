/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require([
  'csui/lib/marionette',
  'xecmpf/widgets/eac/eac.view',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/test/mock',
  'css!csui/widgets/nodestable/impl/nodestable'
], function (Marionette, EACView, PageContext, mock) {

  var context = new PageContext({
    factories: {
      connector: {
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/img',
          session: {
            ticket: 'dummy'
          }
        }
      }
    }
  });

  var options = {
    context: context,
    data: {}
  };
  var eacWidget = new EACView(options);
  var region = new Marionette.Region({
    el: "#content"
  });

  region.show(eacWidget);
  mock.enable();
  context.fetch();
});
