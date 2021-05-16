/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/collection/collect.items',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage',
  "../../../testutils/async.test.utils.js",
  './mock.collect.items.js',
  'csui/lib/binf/js/binf'
], function (Marionette, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, CollectItemsCommand, commands, GlobalMessage, TestUtils, mock) {
  'use strict';

  describe('Collect Command', function () {

    var collectItemsCommand, context, connector;

    beforeAll(function () {

      mock.enable();

      collectItemsCommand = commands.get('CollectionCanCollect');
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
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });

    it('can be constructed', function () {
      var helloCommand = new CollectItemsCommand();
      expect(helloCommand instanceof CollectItemsCommand).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(CollectItemsCommand).toBeDefined();
    });

    it('signature is "CollectionCanCollect"', function () {
      expect(collectItemsCommand.get('signature')).toEqual('CollectionCanCollect');
    });
    describe('gets enabled for a collection container', function () {
      it('gets enabled for permitted action \'collectionCanCollect\'', function (done) {
        var node = new NodeModel({
          id: 2006,
          container: true,
          type: 298
        }, {connector: connector});
        node
            .fetch()
            .done(function () {
              var status = {
                context: context,
                container: node,
              };
              expect(node.actions.first().get('signature')).toEqual('collectionCanCollect');
              expect(collectItemsCommand.enabled(status)).toBeTruthy();
            })
            .done(done);
      }, 5000);

      it('does not get enabled for other containers like folder',
          function () {
            var node = new NodeModel({id: 2003, type: 0, container: true},
                {connector: connector}),
                status = {
                  context: context,
                  nodes: new NodeCollection([node]),
                  container: node,
                };
            expect(collectItemsCommand.enabled(status)).toBeFalsy();
          });
    });

    describe('when executed with a node', function () {

      var messageLocation, node, status, container, collectTargetBrowse,
          defaultContainer = $.fn.binf_modal.getDefaultContainer(),
          targetBrowse = $(defaultContainer).empty();

      beforeAll(function () {
        messageLocation = new Marionette.View();
        messageLocation.render();
        messageLocation.$el.height("62px");
        messageLocation.trigger('before:show');
        messageLocation.$el.appendTo(document.body);
        messageLocation.trigger('show');
        GlobalMessage.setMessageRegionView(messageLocation);
      });

      afterAll(function () {
        messageLocation.destroy();
      });

      beforeEach(function () {
        container = new NodeModel({id: 5001, container: true, type: 298}, {connector: connector});
        status = {
          context: context,
          nodes: new NodeCollection([container]),
          file: {name: 'test.txt', size: 456, type: 'text/plain'},
          container: container
        };
      });

      it('executes collect items command and shows node picker', function (done) {
        collectItemsCommand.execute(status, {});
        TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
            '.target-browse.cs-dialog.binf-modal:visible').done(function (el) {
          expect(el.length).toEqual(1);
          done();
        });
      });

      it('add button disabled when there is no selection', function (done) {
        TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
            '.target-browse.cs-dialog.binf-modal:visible').done(function (el) {
          expect(el.length).toEqual(1);
          collectTargetBrowse = el;
          expect(collectTargetBrowse.find(
              '.binf-modal-footer' +
              ' .binf-btn-primary:disabled').length).toEqual(
              1);
          done();
        });
      });

      it('enables and disables add button on clicking items', function (done) {
        var dialog = $('.binf-modal-content'),
            selectableItem = dialog.find(
                '.cs-left-item-9804402 .csui-browsable, .cs-left-item-3162416 .csui-browsable');
        expect(dialog.find('.binf-btn-primary:disabled').length).toEqual(1);
        expect(selectableItem.length).toBeGreaterThan(0);
        selectableItem.trigger('click');
        TestUtils.asyncElement(dialog,
            '.binf-btn.binf-btn-primary.cs-add-button:disabled',
            true).done(
            function () {
              expect(dialog.find('.binf-btn-primary:disabled').length).toEqual(0);
              expect(dialog.find(
                  '.icon-checkbox.csui-selectable.icon-checkbox-selected').length).toBeGreaterThan(
                  1);
              dialog.find(
                  '.cs-left-item-9804402 .csui-selectable, .cs-left-item-3162416 .csui-selectable').trigger(
                  'click');
              expect(dialog.find('.binf-btn-primary:disabled').length).toEqual(1);
              expect(dialog.find(
                  '.icon-checkbox.csui-selectable.icon-checkbox-selected').length).toEqual(0);
              done();
            });
      });

      it('click on cancel button target browse dialog will close', function (done) {
        var dialog = $('.binf-modal-content');
        dialog.find('.binf-modal-footer button:last-child').trigger('click');
        TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
            '.target-browse.cs-dialog.binf-modal', true).done(function (el) {
          expect(el.length).toEqual(0);
          done();
        });
      });

    });

  });

});
