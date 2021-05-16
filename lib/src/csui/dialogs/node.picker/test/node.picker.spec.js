/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/dialogs/node.picker/node.picker',
  './node.picker.mock.js',
  'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model', "csui/models/nodechildren",
  "csui/utils/contexts/factories/node",
  'csui/dialogs/node.picker/start.locations/favorites/impl/favorite.collection',
  'csui/dialogs/node.picker/start.locations/start.location.collection',
  'csui/lib/jquery.mockjax',
  "../../../utils/testutils/async.test.utils.js",
  "csui/lib/jquery.simulate"

], function (_, $, Marionette, PageContext, NodePicker, NodePickerMock, ConnectorFactory,
    NodeModel, NodeChildrenCollection, NodeFactory, FavoriteCollection,
    StartLocationCollection, mockjax, TestUtils) {
  "use strict";
  describe('NodePicker -', function () {


    afterAll(function () {
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    xdescribe('General - ', function () {

      var context, connector, initialContainer,
          v1Collection = null, v2Collection = null,
          favoriteCollection                = null;

      beforeAll(function () {

        window.csui.require.config({
          config: {
            'csui/widgets/nodestable/nodestable.view': {
              useAppContainer: false
            }
          }
        });

        mockjax.publishHandlers();
        NodePickerMock.test1.enable();

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
        initialContainer = context.getObject(NodeFactory);
        initialContainer.set('id', 1);

        v1Collection = [new NodeModel({id: 2}, {connector: connector}),
          new NodeModel({id: 3}, {connector: connector})];

        favoriteCollection = new FavoriteCollection(undefined, {
          connector: connector,
          autoreset: true
        });

      });

      afterAll(function () {
        NodePickerMock.test1.disable();
      });

      describe('testing construct parameter options', function () {

        it('testing context only', function () {
          var nodePicker        = new NodePicker({
                initialSelection: null,
                initialContainer: null,
                context: context,
                dialogTitle: "Test 1",
                connector: null
              }),
              nodePickerOptions = nodePicker.options;

          expect(nodePicker instanceof NodePicker).toBeTruthy();
          expect(nodePickerOptions.connector).not.toBe(null);
        });

        it('testing connector only', function () {
          var nodePicker        = new NodePicker({
                initialSelection: null,
                initialContainer: null,
                context: null,
                dialogTitle: "Test 2",
                connector: connector
              }),
              nodePickerOptions = nodePicker.options;

          expect(nodePicker instanceof NodePicker).toBeTruthy();
          expect(nodePickerOptions.connector).not.toBe(null);
        });

        it('testing initialContainer only', function () {
          var nodePicker        = new NodePicker({
                initialSelection: null,
                initialContainer: initialContainer,
                context: null,
                dialogTitle: "Test 3",
                connector: null
              }),
              nodePickerOptions = nodePicker.options;

          expect(nodePicker instanceof NodePicker).toBeTruthy();
          expect(nodePickerOptions.connector).not.toBe(null);
        });

        it('node picker constructed with v1Collection only', function () {
          var nodePicker        = new NodePicker({
                initialSelection: v1Collection,
                initialContainer: null,
                context: null,
                dialogTitle: "Test 4",
                connector: null
              }),
              nodePickerOptions = nodePicker.options;

          expect(nodePicker instanceof NodePicker).toBeTruthy();
          expect(nodePickerOptions.connector).not.toBe(null);
          expect(nodePickerOptions.initialContainer).toBe(null);
        });

        it('node picker constructed with v2Collection only', function (done) {
          favoriteCollection.fetch({reset: false, merge: false, remove: false})
              .done(function () {
                v2Collection = [favoriteCollection.models[0], favoriteCollection.models[2]];
                var nodePicker        = new NodePicker({
                      initialSelection: v2Collection,
                      initialContainer: null,
                      context: null,
                      dialogTitle: "Test 5",
                      connector: null
                    }),
                    nodePickerOptions = nodePicker.options;

                expect(nodePicker instanceof NodePicker).toBeTruthy();
                expect(nodePickerOptions.connector).not.toBe(null);
                expect(nodePickerOptions.initialContainer).toBe(null);
                done();
              });
        });

      });

      describe('testing viewer slide panels and button enable status', function () {

        describe('start from favorites', function () {

          it('initiate node picker with v2 selection and Add Category command',
              function (done) {
                favoriteCollection.fetch({reset: false, merge: false, remove: false})
                    .done(function () {
                      v2Collection = [favoriteCollection.models[0],
                        favoriteCollection.models[2]];

                      var nodePicker = new NodePicker({
                        initialSelection: v2Collection,
                        initialContainer: null,
                        context: null,
                        connector: connector,
                        startLocation: 'category.volume',
                        selectableTypes: [131],
                        dialogTitle: "Test 6",
                        selectMultiple: false
                      });
                      var nodePickerOptions = nodePicker.options;

                      nodePicker._locations = new StartLocationCollection(nodePickerOptions);

                      nodePicker._locations
                          .fetch({
                            connector: nodePickerOptions.connector,
                            container: nodePickerOptions.initialContainer,
                            removeInvalid: false
                          })
                          .done(function () {
                            nodePicker._showDialog();
                            expect(nodePicker instanceof NodePicker).toBeTruthy();
                            expect(nodePickerOptions.initialContainer).toBe(null);
                            nodePicker._dialog.once('destroy', done);
                            nodePicker._dialog.destroy();
                          });
                    });

              });
        });

      });

      describe(
          'testing none selectable folder types, folders without open permissions, and breadcrumbs',
          function () {

            describe('start from container with id = 1', function () {

              var nodePicker     = null,
                  nodePickerView = null;

              describe('running command Copy', function () {

                it('initiate node picker with v1 selection and Copy command', function () {
                  initialContainer.set('id', 1);
                  nodePicker = new NodePicker({
                    initialSelection: v1Collection,
                    startLocation: 'current.location',
                    command: 'copy',
                    initialContainer: initialContainer,
                    context: null,
                    connector: connector,
                    selectableTypes: [-1],
                    showAllTypes: true,
                    orderBy: 'type asc',
                    dialogTitle: "Test 8",
                    includeCombineProperties: false,
                    propertiesSeletor: true,
                    startLocations: ['enterprise.volume', 'current.location',
                      'personal.volume',
                      'favorites', 'recent.containers']
                  });
                });

                it('confirm selection button is enabled', function (done) {
                  var nodePickerOptions = nodePicker.options;

                  nodePicker._locations = new StartLocationCollection(nodePickerOptions);
                  nodePicker._locations
                      .fetch({
                        connector: nodePickerOptions.connector,
                        container: nodePickerOptions.initialContainer,
                        removeInvalid: false
                      })
                      .then(function () {
                        nodePicker._showDialog();
                        nodePickerView = nodePicker._view;
                        nodePickerView.listenToOnce(nodePickerView, 'change:complete',
                            function () {
                              var selectBtn = nodePicker._dialog.$el.find('.binf-btn-primary');
                              expect(selectBtn.prop('disabled')).toBe(false);
                              done();
                            });
                      });
                });

                it('confirm that left panel only exists', function () {
                  var list = nodePickerView.$el.find('.cs-start-locations .binf-list-group a');
                  expect(list.length).toBe(4);
                  expect(nodePickerView.$el.find('.cs-start-locations.left-only').length).toBe(1);
                });

                xdescribe('testing breadcrumbs', function () {

                  it('click valid breadcrumb', function (done) {
                    var breadcrumbs = $('.binf-breadcrumb a');
                    $(breadcrumbs[0]).trigger('click');

                    var listView = nodePickerView.selectViews.leftView.listView;
                    listView.listenToOnce(listView, 'dom:refresh', done);
                  });

                  it('selection button is enabled', function () {
                    var selectBtn = nodePicker._dialog.$el.find('.binf-btn-primary');
                    expect(selectBtn.prop('disabled')).toBe(false);
                  });

                  it('destroying Node Picker - End', function (done) {
                    nodePicker._dialog.once('destroy', done);
                    nodePicker._dialog.destroy();
                  });

                });

              });

            });

          });

      describe('test header view (LPAD-50654)', function () {

        describe('for copy/move', function () {

          var nodePicker        = null,
              nodePickerOptions = null,
              nodePickerView    = null;

          it('property options should appear', function (done) {
            initialContainer.set('id', 1);

            nodePicker = new NodePicker({
              command: 'copy',
              selectableTypes: [-1],
              showAllTypes: true,
              orderBy: 'type asc',
              dialogTitle: "Test 9",
              context: context,
              globalSearch: true,
              initialContainer: initialContainer,
              initialSelection: v1Collection,
              propertiesSeletor: true
            });
            nodePickerOptions = nodePicker.options;

            nodePicker._locations = new StartLocationCollection(nodePickerOptions);
            nodePicker._locations
                .fetch({
                  connector: nodePickerOptions.connector,
                  container: nodePickerOptions.initialContainer,
                  removeInvalid: false
                })
                .done(function () {
                  nodePicker._showDialog();
                  nodePickerView = nodePicker._view;
                  var headerView = nodePicker._headerControl;
                  headerView.listenToOnce(headerView, 'dom:refresh', function () {
                    var properties = headerView.$el.find('.cs-apply-properties-selector');
                    expect(properties.length).toBe(1);
                    nodePicker._dialog.once('destroy', done);
                    nodePicker._dialog.destroy();
                  });
                })
                .fail(function () {
                  expect(true).toBe(false, 'Fetch in NodePicker timed out.');
                  if (nodePicker._dialog) {
                    nodePicker._dialog.once('destroy', done);
                    nodePicker._dialog.destroy();
                  } else {
                    done();
                  }
                });

          });

        });

        describe('for add category', function () {

          var nodePicker        = null,
              nodePickerOptions = null,
              nodePickerView    = null;

          it('property options should not appear', function (done) {
            initialContainer.set('id', 1);

            nodePicker = new NodePicker({
              startLocation: 'category.volume',
              context: context,
              selectableTypes: [131],
              selectMultiple: false,
              dialogTitle: 'Test 10',
              selectButtonLabel: 'Add'
            });
            nodePickerOptions = nodePicker.options;

            nodePicker._locations = new StartLocationCollection(nodePickerOptions);

            nodePicker._locations
                .fetch({
                  connector: nodePickerOptions.connector,
                  container: nodePickerOptions.initialContainer,
                  removeInvalid: false
                })
                .done(function () {
                  nodePicker._showDialog();
                  nodePickerView = nodePicker._view;
                  var headerView = nodePicker._headerControl;
                  headerView.listenToOnce(headerView, 'dom:refresh', function () {
                    var properties = headerView.$el.find('.cs-apply-properties-selector');
                    expect(properties.length).toBe(0);
                    nodePicker._dialog.once('destroy', done);
                    nodePicker._dialog.destroy();
                  });
                });

          });

        });

      });

      xdescribe('Hide start location on folder selection (LPAD-49788)', function () {
        var nodePicker        = null,
            nodePickerOptions = null,
            nodePickerView    = null;

        describe('hide after selected breadcrumb', function () {

          it('Initialize node picker', function (done) {
            initialContainer.set('id', 7);

            nodePicker = new NodePicker({
              initialContainer: initialContainer,
              context: context,
              selectableTypes: [131],
              selectMultiple: false,
              dialogTitle: 'Test 11',
              selectButtonLabel: 'Add'
            });
            nodePickerOptions = nodePicker.options;

            nodePicker._locations = new StartLocationCollection(nodePickerOptions);

            nodePicker._locations
                .fetch({
                  connector: nodePickerOptions.connector,
                  container: nodePickerOptions.initialContainer,
                  removeInvalid: false
                })
                .done(function () {
                  nodePicker._showDialog();
                  nodePickerView = nodePicker._view;
                  initialContainer.listenToOnce(initialContainer, 'sync', done);
                });
          });

          it('select breadcrumb not equal to start location', function (done) {
            var hidenLabel = $('.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
            expect(hidenLabel.length).toBe(0);

            var breadcrumbs = $('a.csui-breadcrumb');
            var numBreadCrumbs = nodePickerView.breadcrumbs.collection.length;
            var nextNode = numBreadCrumbs > 4 ? $(breadcrumbs[2]) : $(breadcrumbs[1]);

            nodePickerView.listenToOnce(nodePickerView, 'change:complete', function () {
              nodePickerView.listenToOnce(nodePickerView, 'change:complete',
                  function (node) {

                    if (node.get('id') === "1" && node.get('container')) {
                      hidenLabel = $('.dropdown-locations > button >' +
                                     ' span:not(.icon-caret-down).binf-hide');
                      expect(hidenLabel.length).not.toBe(2);
                      nodePicker._dialog.once('destroy', done);
                      nodePicker._dialog.destroy();
                    }
                    else {
                      nodePickerView.listenToOnce(nodePickerView, 'change:complete',
                          function (node) {
                            hidenLabel = $(
                                '.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
                            expect(hidenLabel.length).not.toBe(2);
                            nodePicker._dialog.once('destroy', done);
                            nodePicker._dialog.destroy();
                          });
                    }
                  });
            });

            nextNode.trigger('click');

          });

        });

        describe('hide after left panel selection', function () {

          describe('starting with category volume', function () {

            it('Initialize node picker for add category', function (done) {
              initialContainer.set('id', 1);

              nodePicker = new NodePicker({
                startLocation: 'category.volume',
                context: context,
                selectableTypes: [131, -1],
                selectMultiple: false,
                dialogTitle: 'Test 11',
                selectButtonLabel: 'Add'
              });
              nodePickerOptions = nodePicker.options;

              nodePicker._locations = new StartLocationCollection(nodePickerOptions);

              nodePicker._locations
                  .fetch({
                    connector: nodePickerOptions.connector,
                    container: nodePickerOptions.initialContainer,
                    removeInvalid: false
                  })
                  .done(function () {
                    nodePicker._showDialog();
                    nodePickerView = nodePicker._view;
                    var headerView = nodePicker._headerControl;
                    headerView.listenToOnce(headerView, 'dom:refresh', function () {
                      var properties = headerView.$el.find('.cs-apply-properties-selector');
                      expect(properties.length).toBe(0);
                      done();
                    });
                  });
            });

            it('category selection', function (done) {
              var hidenLabel = $(
                  '.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
              expect(hidenLabel.length).toBe(1);    // 'Select start location' has binf-hide

              nodePickerView.listenToOnce(nodePickerView, 'change:complete', function () {
                hidenLabel = $(
                    '.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
                expect(hidenLabel.length).toBe(1);
                nodePickerView.selectViews.leftView.trigger('browse:complete');
                done();
              });

              $('.csui-item-standard.binf-list-group-item').eq(3).trigger('click');
            });

            it('category folder selection', function (done) {
              var hidenLabel = $(
                  '.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
              expect(hidenLabel.length).toBe(1);

              nodePickerView.listenToOnce(nodePickerView, 'change:complete', function () {
                hidenLabel = $('.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
                expect(hidenLabel.length).toBeGreaterThan(1);

                var selectBtn = nodePicker._dialog.$el.find('.binf-btn-primary');
                expect(selectBtn.prop('disabled')).toBe(false);

                nodePicker._dialog.once('destroy', done);
                nodePicker._dialog.destroy();
              });
              $('.csui-item-standard.binf-list-group-item').first().trigger('click');
            });

          });

          describe('starting from current location', function () {

            it('server error on folder selection', function (done) {
              initialContainer.set('id', 1);

              nodePicker = new NodePicker({
                startLocation: 'current.location',
                command: 'copy',
                selectableTypes: [-1],
                showAllTypes: true,
                orderBy: 'type asc',
                context: context,
                dialogTitle: "Test 12",
                initialContainer: initialContainer,
                initialSelection: v1Collection
              });
              nodePickerOptions = nodePicker.options;

              nodePicker._locations = new StartLocationCollection(nodePickerOptions);
              nodePicker._locations
                  .fetch({
                    connector: nodePickerOptions.connector,
                    container: nodePickerOptions.initialContainer,
                    removeInvalid: false
                  })
                  .done(function () {
                    nodePicker._showDialog();
                    nodePickerView = nodePicker._view;
                    nodePickerView.listenToOnce(nodePickerView, 'change:complete',
                        function () {
                          var hidenLabel = $(
                              '.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
                          expect(hidenLabel.length).toBe(1);        // 'Select start location' has binf-hide
                          nodePickerView.listenToOnce(nodePickerView, 'change:complete',
                              function () {
                                hidenLabel = $(
                                    '.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
                                expect(hidenLabel.length).toBe(1);

                                var selectBtn = nodePicker._dialog.$el.find('.binf-btn-primary');
                                expect(selectBtn.prop('disabled')).toBe(true);
                                nodePickerView.selectViews.leftView.trigger('browse:complete');
                                done();
                              });

                          var listGroupItem = $('.csui-item-standard.binf-list-group-item');
                          var clickLocation = listGroupItem.first();
                          clickLocation.trigger('click');     // => produces an error message
                          setTimeout(function () {
                            var modalDlgs = $(
                                '.binf-modal-dialog > .binf-modal-content > .binf-modal-header > .binf-modal-title > span.csui-icon-notification-information-white');
                            if (modalDlgs.length > 0) {
                              var modalDlg = modalDlgs[modalDlgs.length - 1].offsetParent();    // get
                              var closeButton = modalDlg.$(
                                  '.binf-modal-dialog > .binf-modal-content > .binf-modal-footer > button.csui-cancel');
                              closeButton.trigger('click');
                              if (nodePicker && nodePicker._dialog) {
                                nodePicker._dialog.once('destroy', done);
                                nodePicker._dialog.destroy();
                              }
                            }
                          }, 1500);
                        });
                  })
                  .fail(function () {
                    expect(true).toBe(false, 'Fetch of locations timed out');
                    done();
                  });
            });

            it('left panel VF selection', function (done) {
              nodePickerView.listenToOnce(nodePickerView, 'change:complete', function () {
                var hidenLabel = $(
                    '.dropdown-locations > button > span:not(.icon-caret-down).binf-hide');
                expect(hidenLabel.length).not.toBe(0);
                nodePicker._dialog.once('destroy', done);
                nodePicker._dialog.destroy();
              });

              var listGroupItem = $('.csui-item-standard.binf-list-group-item');
              var clickLocation = $(listGroupItem[2]);    // 'Empty VF'
              setTimeout(function () {
                if (nodePicker && nodePicker._dialog) {
                  nodePicker._dialog.once('destroy', done);
                  nodePicker._dialog.destroy();
                }
              }, 1500);
              clickLocation.trigger('click');        // the icon of 'Empty VF' has a forbidden
            });

          });
        });
      });

    });
    describe('shortcut selectable and browsable', function () {
      var nodePicker, collection, context, container, connector, node, $el;
      beforeAll(function () {
        NodePickerMock.test2.enable();
        context = new PageContext();
        connector = context.getObject(ConnectorFactory);
        container = context.getObject(NodeFactory);
        node = new NodeModel({id: 37474}, {connector: connector});

        container.set({id: 2000});

        collection = new NodeChildrenCollection(undefined, {
          node: container,
          autofetch: false,
          expand: ['node']
        });

      });

      it("initialize nodepicker with shortcuts", function (done) {
        collection.fetch({reset: false, merge: false, remove: false});
        collection.on('sync', function (models) {
          var nodes = [collection.models[0], collection.models[1], collection.models[2]];
          nodePicker = new NodePicker({
            initialSelection: null,
            initialContainer: container,
            command: 'copy',
            selectMultiple: false,
            dialogTitle: 'Copy',
            context: context,
            resolveShortcuts: true
          });
          nodePicker.show();
          TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
              '.target-browse.cs-dialog:visible').done(function (el) {
            $el = el;
            expect(nodePicker).toBeDefined();
            done();
          });
        });
      });

      it('shortcut folder should be selectable and browsable', function (done) {
        var shortCutChecked = $el.find('.binf-list-group li:first-child  span.csui-selectable');
        shortCutChecked.trigger('click');
        TestUtils.asyncElement($el, 'span.icon-checkbox-selected').done(function (el) {
          expect(el.length).toBe(1);
          $el.find('.binf-list-group li:first-child  span.csui-browsable').trigger('click');
          TestUtils.asyncElement($el, '.csui-panel.cs-pane-view.csui-slideMidLeft').done(
              function (el) {
                expect(el.length).toBe(1);
                done();
              });
        });
      });

      afterAll(function () {
        $('body').empty();
        NodePickerMock.test2.disable();
      });

    });

    describe('Multiselect functionality in target browse', function () {
      var nodePicker, collection, context, container, connector, node, $el;

      beforeAll(function () {
        NodePickerMock.test3.enable();
        context = new PageContext();
        connector = context.getObject(ConnectorFactory);
        container = context.getObject(NodeFactory);

        container.set({id: 2000});
      });

      it('initialize Node picker with muliselect', function (done) {
        nodePicker = new NodePicker({
          initialSelection: null,
          initialContainer: container,
          context: context,
          dialogTitle: "Add items",
          selectButtonLabel: "Add",
          selectMultiple: true,
          resolveShortcuts: true
        });

        nodePicker.show();

        TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
            '.target-browse.cs-dialog:visible').done(function (el) {
          $el = el;
          expect(nodePicker).toBeDefined();
          done();
        });
      });

      it('Clicking on a folder', function (done) {
        var nodeSelect = $el.find('.binf-list-group li:first-child  span.csui-selectable');
        nodeSelect.trigger('click');
        TestUtils.asyncElement($el,
            '.csui-selected-counter-region .csui-selected-counter-value:visible').done(function (el) {
          expect(el.text()).toBe("1");
          $el.find('.binf-list-group li:first-child  span.csui-browsable').trigger('click');
          TestUtils.asyncElement($el,
              '.csui-panel.cs-pane-view.csui-slideMidLeft .list-content li:last-child > span.csui-list-group-item:visible').done(
              function (el) {
                expect(el.length).toBe(1);
                done();
              });
        });
      });

      it('Clicking on a document in left view', function (done) {
        var nodeSelect = $el.find(
            '.csui-panel:not(.csui-slideMidLeft) .binf-list-group li:last-child span.csui-selectable');
        nodeSelect.trigger('click');
        TestUtils.asyncElement($el,
            '.csui-selected-counter-region .csui-selected-counter-value:visible').done(function (el) {
          expect(el.text()).toBe("2");
          done();
        });
      });

      it('Clicking on a document in right view', function (done) {
        var nodeSelect = $el.find(
            '.csui-panel.csui-slideMidLeft .binf-list-group li:last-child  span.csui-selectable');
        nodeSelect.trigger('click');
        TestUtils.asyncElement($el,
            '.csui-selected-counter-region .csui-selected-counter-value:visible').done(function (el) {
          expect($el.find('.csui-select-lists li.select:visible').length).toBe(3); // checking if left view is not cleared when a node from right view  is selected
          expect(el.text()).toBe("3");
          done();
        });
      });

      it('Removing a selected node from select list dropdown', function () {
        var selectCountEl = $el.find('.csui-selected-counter-region button:visible');
        selectCountEl.trigger('click');
        var listItemToBeRemoved = $el.find('.csui-selected-items-dropdown .csui-selected-item:last');
        expect(listItemToBeRemoved.is(":visible")).toBeTruthy();
        listItemToBeRemoved.find('.csui-deselcted-icon').trigger('click');
        expect($el.find(
            '.csui-selected-counter-region .csui-selected-counter-value:visible').text()).toBe("2");
        expect($el.find('.csui-select-lists li.select:visible').length).toBe(2);
      });

      it('Clicking on a folder in right view', function (done) {
        var nodeSelect = $el.find(
            '.csui-panel.csui-slideMidLeft .binf-list-group li:first-child  span.csui-selectable');

        nodeSelect.trigger('click');
        TestUtils.asyncElement($el,
            '.csui-selected-counter-region .csui-selected-counter-value:visible').done(function (el) {
          expect(el.length).toBe(1);
          expect(el.text()).toBe("3");
          $el.find(
              '.csui-panel.csui-slideMidLeft .binf-list-group li:first-child  span.csui-browsable').trigger(
              'click');
          TestUtils.asyncElement($el,
              '.csui-panel.cs-pane-view.csui-slideMidLeft .list-content li:last-child > span.csui-list-group-item:visible').done(
              function (el) {
                expect($el.find('.csui-select-lists li.select:visible').length).toBe(1);
                done();
              });
        });
      });

      it('Selecting more than 4 nodes for Clear All option to appear', function () {
        $el.find(
            '.csui-panel:not(.csui-slideMidLeft) .binf-list-group li:last-child' +
            ' span.csui-selectable').trigger('click');
        $el.find(
            '.csui-panel.csui-slideMidLeft .binf-list-group li:last-child span.csui-selectable').trigger('click');
        var selectCountEl = $el.find(
            '.csui-selected-counter-region .csui-selected-counter-value:visible');
        expect(selectCountEl.html()).toBe('5');
        var selectCountButton = $el.find('.csui-selected-counter-region button:visible');
        if ($el.find('.csui-dropmenu-container:visible')) {
          selectCountButton.trigger('click');
        }
        selectCountButton.trigger('click');
        expect($el.find('.csui-dropmenu-container .csui-selected-item').length).toBe(5);
        var clearAllEl = $el.find('.csui-dropmenu-container .csui-selected-count-clearall:visible');
      });

      it('Deselecting a node to check if it reflects in the counter', function () {
        $el.find(
            '.csui-panel:not(.csui-slideMidLeft) .binf-list-group li:last-child span.csui-selectable').trigger(
            'click');
        var selectCountEl = $el.find(
            '.csui-selected-counter-region .csui-selected-counter-value:visible');
        expect(selectCountEl.text()).toBe('4');
        var selectCountButton = $el.find('.csui-selected-counter-region button:visible');
        if ($el.find('.csui-dropmenu-container:visible')) {
          selectCountButton.trigger('click');
        }
        selectCountButton.trigger('click');
        var clearAllEl = $el.find('.csui-dropmenu-container .csui-selected-count-clearall:visible');
        expect(clearAllEl.length).toBe(0);
        $el.find(
            '.csui-panel:not(.csui-slideMidLeft) .binf-list-group li:last-child' +
            ' span.csui-selectable').trigger('click'); // select again for testing clear all in' +
      });

      it('Clicking on back button to check if the selected state is persisited', function (done) {
        $el.find('.csui-targetbrowse-arrow-back:visible').trigger('click');
        TestUtils.asyncElement($el,
            '.cs-start-locations .list-content li:last-child span.csui-browsable:visible').done(
            function (el) {
              TestUtils.asyncElement($el,
                '.csui-panel.cs-pane-view.csui-slideMidLeft .list-content li:last-child > span.csui-list-group-item:visible').done(
                function (el) {
              expect($el.find('.csui-select-lists li.select:visible').length).toBe(4);
              expect($el.find(
                  '.csui-selected-counter-region .csui-selected-counter-value:visible').text()).toBe(
                  "5");
              done();
            });
          });
      });

      it('Click on Clear all Button, shows confirmation dialog, click on cancel should remain dropdown',
          function (done) {
            var selectCountButton = $el.find('.csui-selected-counter-region button:visible');
            if ($el.find('.csui-dropmenu-container:visible').length === 0) {
              selectCountButton.trigger('click');
            }
            $el.find('.csui-dropmenu-container .csui-selected-count-clearall-label:visible').trigger('click');
            TestUtils.asyncElement(document.body,
                '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  var cancel = el.find('button[title="No"]'),
                      yes    = el.find('button[title="Yes"]');
                  expect(cancel.length).toEqual(1);
                  expect(yes.length).toEqual(1);
                  cancel.trigger('click');
                  done();
                });
          });

      it('Click on Clear all Button, shows confirmation dialog, click on yes should clear all selection',
          function (done) {
            var selectCountButton = $el.find('.csui-selected-counter-region button:visible');
            if ($el.find('.csui-dropmenu-container:visible').length === 0) {
              selectCountButton.trigger('click');
            }
            $el.find('.csui-dropmenu-container .csui-selected-count-clearall:visible').trigger('click');
            TestUtils.asyncElement(document.body,
                '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  var yes = el.find('button[title="Yes"]');
                  expect(yes.length).toEqual(1);
                  expect($el.find('.csui-dropmenu-container:visible').length).toBe(1);
                  yes.trigger('click');
                  TestUtils.asyncElement(document.body,
                      '.csui-selected-counter-value:visible', true).done(function (el) {
                    expect($el.find('.csui-select-lists li.select:visible').length).toBe(0);
                    expect($el.find(
                        '.csui-selected-counter-region .csui-selected-counter-value:visible').length).toBe(
                        0);

                    done();
                  });

                });
          });
      it("For containers click on browse area, should only browsed to the left view and footer button should be disabled as it won't select",
          function (done) {
            $el.find(
                '.csui-panel.cs-start-locations .binf-list-group li:first-child  span.csui-browsable').trigger(
                'click');
            TestUtils.asyncElement($el,
                '.csui-panel.cs-pane-view.csui-slideMidLeft .list-content li:last-child > span.csui-list-group-item:visible').done(
                function () {
                  expect($el.find('.binf-modal-footer button#select:disabled').length).toBe(1);
                  done();
                });
          });

      it("For containers click on select area, should only select the item and enable footer button",
          function (done) {
            $el.find(
                '.csui-panel.cs-start-locations .binf-list-group li:first-child  span.csui-selectable').trigger(
                'click');
            TestUtils.asyncElement($el, '.binf-modal-footer button#select:disabled', true).done(
                function (el) {
                  expect($el.find(
                      '.csui-panel.cs-start-locations .binf-list-group li:first-child  span.icon-checkbox-selected').length).toBe(
                      1);
                  expect(el.length).toBe(0);
                  done();
                });
          });

      it("show checkbox for current list, if any item is selected", function () {
        var listItems = $el.find(
            '.csui-panel.cs-pane-view.csui-slideMidLeft .binf-list-group li:not(disabled)');
        $el.find(
            '.csui-panel.cs-pane-view.csui-slideMidLeft .binf-list-group li:first-child  span.csui-selectable').trigger(
            'click');
        expect($el.find(
            '.csui-panel.cs-pane-view.csui-slideMidLeft .binf-list-group li:not(disabled).select').length).toBe(
            1);
        var checkbox = $el.find(
            '.csui-panel.cs-pane-view.csui-slideMidLeft .binf-list-group li  span.csui-selectable').css(
            "opacity", "1");
        expect(checkbox.length).toEqual(listItems.length);
      });
      it("click on browse area for non-containers, should select the item", function (done) {
        $el.find(
            '.csui-panel.cs-pane-view.csui-slideMidLeft .binf-list-group li:last-child  span.csui-browsable').trigger(
            'click');
        TestUtils.asyncElement($el,
            '.csui-panel.cs-pane-view.csui-slideMidLeft .binf-list-group li:last-child  span.icon-checkbox-selected').done(
            function (el) {
              expect(el.length).toBe(1);
              done();
            });
      });

      afterAll(function () {
        $('body').empty();
        NodePickerMock.test3.disable();
      });

    });

  });


});
