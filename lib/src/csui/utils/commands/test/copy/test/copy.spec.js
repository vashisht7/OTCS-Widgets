/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/widgets/nodestable/nodestable.view',
  'csui/controls/globalmessage/globalmessage',
  '../../../../../utils/testutils/async.test.utils.js',
  './copy.mock.js',
  'csui/lib/binf/js/binf'
], function (Backbone, Marionette, $, PageContext, ConnectorFactory, NodesTableView, GlobalMessage,
    TestUtils, mock) {
  'use strict';

  var context, originalTimeout;
  describe("Copy command", function () {
    var nodesTableView, regionEl;
    beforeAll(function (done) {

      $(document.body).empty();
      mock.enable();
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
          },
          node: {
            attributes: {id: 2000}
          }
        }
      });
      nodesTableView = new NodesTableView({
        context: context,
        enableViewState: false,
        data: {
          pageSize: 30
        }
      });
      regionEl = $('<div class"binf-widgets"></div>').appendTo(document.body);

      var modalContainer = $.fn.binf_modal.getDefaultContainer();
      GlobalMessage.setMessageRegionView(
          new Backbone.View({el: $('<div>').appendTo(modalContainer)}));

      var children = nodesTableView.collection;
      context.once('sync', function () {
        expect(children.length).toBeGreaterThan(0);
      });      
      context.fetch().then(function () {
        new Marionette.Region({
          el: regionEl
        }).show(nodesTableView);
        done();
      });
    });

    afterAll(function () {
      nodesTableView.destroy();
      regionEl.remove();
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });

    it('Copy command should be available at toolbar on selecting a record', function (done) {
      TestUtils.asyncElement(nodesTableView.$el, ".csui-table-cell-name-value").done(
          function (el) {
            expect(el.length).toBeGreaterThan(0);
            var checkbox = $("tr td .csui-checkbox-view").get(1);
            checkbox.click();
            TestUtils.asyncElement(nodesTableView.$el,
                ".csui-table-rowselection-toolbar li[data-csui-command='copy']").done(
                function (copyEl) {
                  expect(copyEl.length).toBeGreaterThan(0);
                  done();
                });
          });
    });

    it('Target picker should open on clicking on copy command', function (done) {
      var checkbox = $("tr td .csui-checkbox-view").get(2);
      checkbox.click();
      TestUtils.asyncElement(nodesTableView.$el,
          ".csui-table-rowselection-toolbar li[data-csui-command='copy']").done(
          function (copyEl) {
            var copy = $(copyEl).find("a");
            copy.trigger('click');
            TestUtils.asyncElement(document.body, ".binf-modal-dialog").done(
                function (el) {
                  expect(el.length).toBeGreaterThan(0);
                  done();
                });
          });
    });

    it('Target picker: should have two buttons copy and cancel', function (done) {
      var footerEl = $(".binf-widgets .binf-modal-dialog .binf-modal-footer");
      expect(footerEl.length).toBeGreaterThan(0);
      var buttons = footerEl.find(".binf-btn");
      expect(buttons.length).toEqual(2);
      expect(buttons.get(0) && buttons.get(0).innerText).toBe("Copy");
      expect(buttons.get(0) && buttons.get(1).innerText).toBe("Cancel");
      done();
    });

    it('Target picker: should have `add` at toolbar to add folders inline', function (done) {
      TestUtils.asyncElement(".binf-widgets",
          ".binf-modal-dialog .csui-header-tools .csui-toolitem").done(
          function (el) {
            expect(el.length).toEqual(1);
            done();
          });
    });

    it('Target picker: Inline add, submitting form should add item and select it.',
        function (done) {
          TestUtils.asyncElement(document.body,
              ".binf-modal-dialog .csui-header-tools .csui-toolitem").done(
              function (addFolderEl) {
                addFolderEl.trigger('click');
                TestUtils.asyncElement(document.body,
                    ".csui-node-picker .csui-inlineform form").done(
                    function (formEl) {
                      expect(formEl.length).toEqual(1);
                      var inputEl = formEl.find('input');
                      inputEl.val('Folder created from target picker');
                      formEl.trigger('submit');
                      done();
                    });
              });
        });

    it('Target picker: Nodes should be marked as selected upon adding from inline form.',
        function (done) {
          TestUtils.asyncElement(document.body,
              ".csui-node-picker .csui-select-lists .csui-np-content li.select").done(
              function (selectedEl) {
                expect(selectedEl.length).toBeGreaterThan(0);
                var newItem = $(selectedEl.get(0));
                expect(newItem.find('.csui-list-item-title').text().trim()).toBe(
                    'Folder created from target picker');
                expect(newItem.find('input[type="checkbox"]').val()).toBeTruthy();
                $(".binf-widgets .binf-modal-dialog .binf-modal-footer .cs-add-button").trigger('click');
                TestUtils.asyncElement(document.body, ".binf-modal-dialog", true).done(
                    function (dialogEl) {
                      expect(dialogEl.length).toEqual(0);
                      done();
                    });
              });
        });

    it("Global messages should be displayed on successful copy", function (done) {
      TestUtils.asyncElement(document.body, ".csui-global-message.csui-global-success").done(
          function (msgEl) {
            expect(msgEl.length).toBeGreaterThan(0);
            done();
          });
    });
  });

});