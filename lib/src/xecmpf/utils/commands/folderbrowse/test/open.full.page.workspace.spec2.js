/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context', 'csui/utils/contexts/factories/connector',
  'csui/utils/commands',
  'csui/models/node/node.model',
  "xecmpf/utils/commands/folderbrowse/open.full.page.workspace"
], function (module, $, _, Marionette, PageContext, ConnectorFactory, commands, NodeModel,
    OpenFullPageWorkspaceCommand) {
  'use strict';

  describe('Open Full Page Workspace in new tab', function () {

    var openFullPageWorkspaceCommand, context, connector, status, originalWindowOpen, openedWindow, xhr;

    beforeAll(function () {
      openFullPageWorkspaceCommand = commands.get('WorkspacePage');
      context = new PageContext({
        factories: {
          connector: {
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
      connector = context.getObject(ConnectorFactory);
      status = {
        context: context,
        originatingView: {context: context},
        container: new NodeModel({id: 2000}, {connector: connector})
      };
      xhr = new XMLHttpRequest();
      originalWindowOpen = window.open;
      window.open = function (url) {
        openedWindow = {
          location: {
            href: url
          }
        };
        return openedWindow;
      };
    });

    afterAll(function () {
      window.open = originalWindowOpen;
    });

    it('is registered by default', function () {
      expect(openFullPageWorkspaceCommand).toBeDefined();
    });

    it('is not enabled by default', function () {
      expect(openFullPageWorkspaceCommand.enabled(status)).toBeFalsy();
    });

    it('is enabled based on module configuration', function () {
      require.config({
        config: {
          'xecmpf/utils/commands/folderbrowse/open.full.page.workspace': {
            enabled: true
          }
        }
      });
      expect(openFullPageWorkspaceCommand.enabled(status)).toBeTruthy();
    });

    it('has opened the perspective of the container', function (done) {
      openFullPageWorkspaceCommand
          .execute(status, {})
          .done(function () {
            expect(openedWindow.location.href).toBe(
                "//server/otcs/cs/xecm/nodes/" + status.container.get("id"));
            done();
          });
    });

  });

});
