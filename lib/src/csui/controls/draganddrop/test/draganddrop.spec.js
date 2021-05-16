/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/widgets/nodestable/nodestable.view',
  'csui/utils/contexts/page/page.context', './draganddrop.mock.js',
  '../../../utils/testutils/async.test.utils.js', 'csui/controls/globalmessage/globalmessage'
], function (Marionette, _, $, NodesTableView, PageContext, dragAndDropMock, TestUtils,
    GlobalMessage) {
  'use strict';

  describe('DragAndDropView', function () {
    var context, contextWithDescriptionNodes, files, dataTransfer, dragEventData,
        factories = {
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
        };

    beforeAll(function () {

      window.csui.require.config({
        config: {
          'csui/widgets/nodestable/nodestable.view': {
            useAppContainer: false
          },
        }
      });

      dragAndDropMock.enable();
      if (!context) {
        context = new PageContext({
          factories: factories
        });
      }
      if (!contextWithDescriptionNodes) {
        var factoriesWithDescriptions = _.deepClone(factories);
        factoriesWithDescriptions.node.attributes.id = 5000;  //5000 have description nodes
        contextWithDescriptionNodes = new PageContext({
          factories: factoriesWithDescriptions
        });
      }
    var viewStateModel = contextWithDescriptionNodes &&
                         contextWithDescriptionNodes.viewStateModel;
    if (viewStateModel) {
      contextWithDescriptionNodes.viewStateModel.setSessionViewState('selected_nodes', []);
      contextWithDescriptionNodes.viewStateModel.set(contextWithDescriptionNodes.viewStateModel.CONSTANTS.STATE,
          {order_by: 'name_asc', page: '30_0'}, {silent: true});
      contextWithDescriptionNodes.viewStateModel.set(contextWithDescriptionNodes.viewStateModel.CONSTANTS.DEFAULT_STATE,
          {}, {silent: true});
    }
  });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      TestUtils.restoreEnvironment();
      dragAndDropMock.disable();
      TestUtils.restoreEnvironment();
    });

    describe('folder with description', function () {
      var nodesTableView, regionEl, dataTransfer, dragEventData;
      beforeAll(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: contextWithDescriptionNodes
          });

          var file1        = new File(['Hello', 'World'], 'file1.txt', {type: 'text/plain'}),
              dataTransfer = new window.DataTransfer();
          dataTransfer.setData('Files', file1);
          dragEventData = new window.DragEvent('dragover', {dataTransfer: dataTransfer});
          contextWithDescriptionNodes.fetch().then(function () {
            regionEl = $('<div></div>').appendTo(document.body);
            new Marionette.Region({
              el: regionEl
            }).show(nodesTableView);
            done();
          });
        } else {
          done();
        }
      });

      afterAll(function () {
        regionEl && regionEl.remove();
      });

      it('Nodestable View gets rendered with its table rows',
          function () {
            expect(nodesTableView.$el.find('tr.csui-saved-item')).toBeTruthy();
          });
      it('Nodestable View gets registred with dragNDrop View',
          function () {
            expect(nodesTableView.$el.find('.csui-dropMessage')).toBeTruthy();
          });

      it('test dragover on sub folder adds border to' +
         ' table row', function (done) {

        var e = $.Event({type: 'dragover'});
        e.originalEvent = dragEventData;
        var row = nodesTableView.$el.find('tr.csui-saved-item:first');
        $(row).trigger(e);

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
            function () {
              expect($(row).attr('class')).toContain('drag-over');
              done();
            });
      });

      it('test dragleave on sub folder removes border to' +
         ' table row', function (done) {
        var row = nodesTableView.$el.find('tr.csui-saved-item:first');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect($(row).attr('class')).not.toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragover on non supported subtype adds border to' +
         ' parent container', function (done) {
        var e = $.Event({type: 'dragover'});
        e.originalEvent = dragEventData;
        var row = nodesTableView.$el.find('tr.csui-saved-item:last');
        $(row).trigger(e);

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
            function () {
              expect($(row).attr('class')).not.toContain('drag-over');
              expect(nodesTableView.$el.find('.csui-innertablecontainer').attr('class')).toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragleave on non supported subtype removes border to' +
         ' parent container', function (done) {
        var row = nodesTableView.$el.find('tr.csui-saved-item:last');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect($(row).attr('class')).not.toContain('drag-over');
              expect(
                  nodesTableView.$el.find('.csui-innertablecontainer').attr('class')).not.toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragover over parent container adds border to' +
         ' parent container', function (done) {

        var e = $.Event({type: 'dragover'});
        e.originalEvent = dragEventData;
        var row = nodesTableView.$el.find('div.csui-innertablecontainer');
        $(row).trigger(e);

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
            function () {
              expect(
                  nodesTableView.$el.find('div.csui-innertablecontainer').attr('class')).toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragleave parent container  removes border to' +
         ' parent container', function (done) {

        var row = nodesTableView.$el.find('div.csui-innertablecontainer');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect(nodesTableView.$el.find('div.csui-innertablecontainer').attr(
                  'class')).not.toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragover over toolbar adds border to' +
         ' parent container', function (done) {

        var e = $.Event({type: 'dragover'});
        e.originalEvent = dragEventData;
        var row = nodesTableView.$el.find('div.csui-alternating-toolbars');
        $(row).trigger(e);

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
            function () {
              expect(
                  nodesTableView.$el.find('div.csui-innertablecontainer').attr('class')).toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragleave toolbar  removes border to' +
         ' parent container', function (done) {

        var row = nodesTableView.$el.find('div.csui-alternating-toolbars');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect(nodesTableView.$el.find('div.csui-innertablecontainer').attr(
                  'class')).not.toContain(
                  'drag-over');
              done();
            });
      });

      it('test drop table gets registered', function () {
        var e = $.Event({type: 'dragover'});
        e.originalEvent = dragEventData;
        $('.csui-table-tableview').trigger(e);
        nodesTableView.$el.find('.csui-table-tableview').trigger('drop', files);
        expect(nodesTableView.$el.find('.csui-table-tableview').attr('class')).not.toContain(
            'drag-over');
      });

      xit('On drop a file over document, confirmation alert should appear',
          function (done) {
            var file1        = new File(['Hello',
                  'World'], 'file1.txt', {type: 'text/plain'}),
                dataTransfer = new window.DataTransfer(),
                row          = nodesTableView.$el.find(
                    'tr.csui-saved-item:nth-child(3)');
            dataTransfer.items.add(file1);
            var dragEventData1 = new window.DragEvent('drag', {dataTransfer: dataTransfer}),
                eve            = $.Event({type: 'drop'});
            eve.originalEvent = dragEventData1;
            $(row).trigger(eve);
            TestUtils.asyncElement(document.body,
                '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  var cancel = el.find('button[title="No"]');
                  var addVersion = el.find('button[title="Yes"]');
                  expect(cancel.length).toEqual(1);
                  expect(addVersion.length).toEqual(1);
                  cancel.trigger('click');
                  done();
                });
          });

      xit('droping file as version to the document, choose option from dialog', function (done) {
        var file1        = new File(['Hello',
              'World'], 'file1.txt', {type: 'text/plain'}),
            dataTransfer = new window.DataTransfer(),
            row          = nodesTableView.$el.find(
                'tr.csui-saved-item:nth-child(3)');
        dataTransfer.items.add(file1);
        var dragEventData1 = new window.DragEvent('drop', {dataTransfer: dataTransfer}),
            eve            = $.Event({type: 'drop'});
        eve.originalEvent = dragEventData1;
        $(row).trigger(eve);
        TestUtils.asyncElement(document.body,
            '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
            function (el) {
              expect(el.length).toEqual(1);
              var addVersion = el.find('button[title="Yes"]');
              addVersion.trigger('click');
              done();
            });
      });
    });

    describe('folder with description for thumbnail view', function () {
      var nodesTableView, regionEl, dataTransfer, dragEventData;
      beforeAll(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: contextWithDescriptionNodes
          });
          var file1        = new File(['Hello', 'World'], 'file1.txt', {type: 'text/plain'}),
              dataTransfer = new window.DataTransfer();
          dataTransfer.setData('Files', file1);
          dragEventData = new window.DragEvent('dragover', {dataTransfer: dataTransfer});
          contextWithDescriptionNodes.fetch().then(function () {
            regionEl = $('<div></div>').appendTo(document.body);
            new Marionette.Region({
              el: regionEl
            }).show(nodesTableView);
            done();
          });
        } else {
          done();
        }

      });

      afterAll(function () {
        regionEl && regionEl.remove();

      });

      it('Open thumbnail view', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              expect($("li[data-csui-command='thumbnail']").length).toEqual(1);
              var configurationMenu = nodesTableView.$el.find(
                  '.csui-configuration-view .binf-dropdown');
              configurationMenu.find('.binf-dropdown-toggle').trigger('click');
              var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
              clickMenuItem.trigger('click');
              TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-container").done(
                  function () {
                    expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
                    done();
                  });
            });
      });

      it('test dragover on sub folder adds border to' +
         'thumbnail view', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-item-container").done(
                  function () {
                    var e = $.Event({type: 'dragover'});
                    e.originalEvent = dragEventData;
                    var row = nodesTableView.$el.find('div.csui-thumbnail-item:first');
                    $(row).trigger(e);

                    TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
                        function () {
                          expect($(row).attr('class')).toContain('drag-over');
                          done();
                        });
                  });
            });
      });

      it('test dragleave on sub folder removes border to' +
         'thumbnail view', function (done) {
        var row = nodesTableView.$el.find('div.csui-thumbnail-item:first');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect($(row).attr('class')).not.toContain('drag-over');
              done();
            });
      });

      it('Nodestable View gets rendered with its thumbnail items',
          function () {
            expect(nodesTableView.$el.find('div.csui-thumbnail-item')).toBeTruthy();
          });

      it('Nodestable View gets registred with dragNDrop View',
          function () {
            expect(nodesTableView.$el.find('.csui-dropMessage')).toBeTruthy();
          });

      it('test dragover on thumbnailview adds border to' +
         ' parent container', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              var e = $.Event({type: 'dragover'});
              e.originalEvent = dragEventData;
              var row = nodesTableView.$el.find('div.csui-innertablecontainer');
              $(row).trigger(e);

              TestUtils.asyncElement(nodesTableView.$el, ".drag-over").done(
                  function () {

                    expect($(row).attr('class')).toContain('drag-over');
                    done();
                  });
            });
      });

      it('test dragleave from thumbnailview removes border to' +
         ' parent container', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              var row = nodesTableView.$el.find('div.csui-innertablecontainer');
              $(row).trigger('dragleave');
              TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
                  function () {
                    expect($(row).attr('class')).not.toContain('drag-over');
                    done();
                  });
            });
      });

      it('test dragover over toolbar adds border to' +
         ' parent container', function (done) {

        var e = $.Event({type: 'dragover'});
        e.originalEvent = dragEventData;
        var row = nodesTableView.$el.find('div.csui-alternating-toolbars');
        $(row).trigger(e);

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
            function () {
              expect(
                  nodesTableView.$el.find('div.csui-innertablecontainer').attr('class')).toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragleave toolbar  removes border to' +
         ' parent container', function (done) {

        var row = nodesTableView.$el.find('div.csui-alternating-toolbars');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect(nodesTableView.$el.find('div.csui-innertablecontainer').attr(
                  'class')).not.toContain(
                  'drag-over');
              done();
            });
      });

      it('test dragover on non supported subtype adds border to' +
         ' thumbnail view', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {

              TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-item-container").done(
                  function () {
                    var e = $.Event({type: 'dragover'});
                    e.originalEvent = dragEventData;
                    var row = nodesTableView.$el.find('div.csui-thumbnail-item:last');
                    $(row).trigger(e);

                    TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
                        function () {
                          expect($(row).attr('class')).not.toContain('drag-over');
                          expect(nodesTableView.$el.find('.csui-innertablecontainer').attr(
                              'class')).toContain(
                              'drag-over');
                          done();
                        });
                  });
            });
      });

      it('test dragleave on non supported subtype removes border to' +
         ' thumbnail view', function (done) {

        var row = nodesTableView.$el.find('div.csui-thumbnail-item:last');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect($(row).attr('class')).not.toContain('drag-over');
              expect(nodesTableView.$el.find('.csui-innertablecontainer').attr(
                  'class')).not.toContain(
                  'drag-over');
              done();
            });
      });

      it('test drop thumbnail container gets registered', function () {
        var e = $.Event({type: 'dragover'});
        e.originalEvent = dragEventData;
        $('.csui-thumbnail-wrapper').trigger(e);
        nodesTableView.$el.find('.csui-thumbnail-wrapper').trigger('drop', files);
        expect(nodesTableView.$el.find('.csui-thumbnail-wrapper').attr('class')).not.toContain(
            'drag-over');
      });

      it('test dragover on document type to thumbnail view', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-item-container").done(
                  function () {
                    var e = $.Event({type: 'dragover'});
                    e.originalEvent = dragEventData;
                    var row = nodesTableView.$el.find('div.csui-thumbnail-item:nth-child(3)');
                    $(row).trigger(e);

                    TestUtils.asyncElement(nodesTableView.$el, '.drag-over').done(
                        function () {
                          expect($(row).attr('class')).toContain('drag-over');
                          done();
                        });
                  });
            });
      });

      it('test dragleave on document type to thumbnail view', function (done) {
        var row = nodesTableView.$el.find('div.csui-thumbnail-item:nth-child(3)');
        $(row).trigger('dragleave');

        TestUtils.asyncElement(nodesTableView.$el, '.drag-over', true).done(
            function () {
              expect($(row).attr('class')).not.toContain('drag-over');
              done();
            });
      });

      it('test on dragover, on document type shows drag dialog to ' +
         'thumbnail view', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-item-container").done(
                  function () {
                    var e = $.Event({type: 'dragover'});
                    e.originalEvent = dragEventData;
                    var row     = nodesTableView.$el.find('div.csui-thumbnail-item:nth-child(3)'),
                        message = "Drop file to upload it to " + $(row).text().trim();
                    $(row).trigger(e);
                    TestUtils.asyncElement(nodesTableView.$el, ".csui-dropMessage").done(
                        function (el) {
                          expect(el.length).toEqual(1);
                          expect(el.find('p:first').text()+" "+el.find('p:last').text()).toEqual(message);
                          done();
                        });
                  });
            });
      });
    });
  });
});
