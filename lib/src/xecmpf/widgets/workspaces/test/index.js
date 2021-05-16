/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require.config({
  deps: [
    'csui/lib/require.config!csui/csui-extensions.json',
    'csui/lib/require.config!conws/conws-extensions.json',
    'csui/lib/require.config!xecmpf/xecmpf-extensions.json',
    'esoc/widgets/userwidget/userwidget'
  ],

  config: {
    'csui/utils/log': {
      console: true,
      consoleRe: false,
      level: 'WARN',
      page: false,
      performanceTimeStamp: false,
      moduleNameStamp: false,
      server: false,
      window: false,
      modules: {}
    },
    'i18n': {
      locale: 'en',
      preferredLocales: 'en',
    },
    'csui/utils/contexts/factories/connector': {
      connection: {
        url: '//server/otcs/cs/api/v1',
        supportPath: '/support',
        session: {
          ticket: 'dummy'
        }
      }
    }
  }
});

require(['module', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/workspaces/workspaces.widget', 'xecmpf/widgets/workspaces/test/workspace.mock'
], function (module, Marionette,
  PageContext,
  WorkspacesWidget, Mock) {

  var context = new PageContext();
  Mock.enable();

  var workspacesWidget = new WorkspacesWidget({
    context: context,
    data: {
      busObjectId: '0000003456',
      busObjectType: 'KNA1',
      extSystemId: 'D9A',
      folderBrowserWidgetX: {
        commands: {
          'go.to.node.history': {
            enabled: true
          },
          'open.full.page.workspace': {
            enabled: true,
            fullPageOverlay: false
          },
          'search.container': {
            enabled: true
          }
        }
      },
      viewMode: {
        mode: 'folderBrowse' // 'fullPage'
      }
    }
  });

  workspacesWidget.show({
    placeholder: '#widgetWMainWindow'
  });
  context.fetch();
});