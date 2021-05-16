/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/jquery', './zip.download.mock.js',
'csui/utils/contexts/page/page.context','csui/widgets/nodestable/nodestable.view',
'../../../../testutils/async.test.utils.js'
], function (Marionette, $, mock, PageContext, NodesTableView, TestUtils) {
  'use strict';
  describe ("Zip and Download test cases", function() {
    var pageSize = 30;
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

    var options = {
      context: context,
      data: {
        pageSize: pageSize
      }
    };

    beforeAll(function () {
      $(document.body).empty();
      mock.enable();
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });
    
    describe("zip and download", function() {
      var nodesTableView, regionEl;
      beforeAll(function (done) {
        nodesTableView = new NodesTableView(options);
        regionEl = $('<div></div>').appendTo(document.body);
        
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
      });

      it('To verify download option', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, ".csui-table-cell-name-value").done(
          function () {
            var checkbox = $(".csui-checkbox-view").get(1);
            checkbox.click();
            var download = $($("li[data-csui-command='zipanddownload']").get(1));
            expect(download.length).toBeGreaterThan(0);
            TestUtils.asyncElement(nodesTableView.$el, download).done(
              function() {
                expect(download.length).toBeGreaterThan(0);
                done();
            });
        });
      });

      it ('After clicking on download option new dialog should open', function(done){
        var checkbox = $(".csui-checkbox-view").get(2);
            checkbox.click();
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='zipanddownload']", 2000).done(
          function () {
            var download = $($("li[data-csui-command='zipanddownload']").get(1)).find("a");
            download.trigger('click');
            done();
        });
      });

      it('After opening the dialog there should be two optins download and cancel', function(done){
        TestUtils.asyncElement(".binf-widgets", ".binf-modal-dialog").done(
          function() {
            expect($(".binf-modal-dialog").length).toBeGreaterThan(0);
            var buttons = $(".binf-modal-footer").find(".binf-btn");
            expect(buttons.length).toEqual(2);
            expect(buttons[0].innerText).toBe("Download");
            expect(buttons[1].innerText).toBe("Cancel");
            done();
        });
      });
    });
  });
});
