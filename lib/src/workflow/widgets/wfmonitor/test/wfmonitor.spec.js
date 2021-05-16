/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  'csui/utils/contexts/page/page.context', 'csui/utils/url',
   'workflow/testutils/base.test.utils',
  'workflow/widgets/wfmonitor/wfmonitor.view',
  'workflow/controls/visualdata/visual.data.donut.view',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (Backbone, $, _, Marionette, PageContext, Url,
    BaseTestUtils, WFMonitorView, VisualDataDonutContentView, lang) {
    "use strict";

    describe("Workflow monitoring widget - All Workflows", function () {

        var widget, title = "All Workflows";

        beforeEach(function (done) {

           var modelOptions = {
                selectionType:100,
                wfstatusfilter:5323,
                widgetTitle: title
            }
            var context  = BaseTestUtils.getContext(),
                options  = {context: context, data: modelOptions};

            BaseTestUtils.workItemMock.enable();
            context = BaseTestUtils.getContext();

            widget = new WFMonitorView(options);
            widget.model.fetch().then(function () {
            widget.collection = new Backbone.Collection(widget.model.get('data'));
            widget.render();
            widget.$el.find('div.wfstatus-donut-chart').append("<div class='wf-status-donut-piechart'></div");

            buildDonutChart(widget);
          });

          BaseTestUtils.waitUntil(function () {
            if (widget.$el.find('div.wf-status-donut-piechart').length > 0) {
                return true;
            }
            return false;
          }, 5000).always(function () {
            done();
          });
        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it ("Widget title", function() {
            expect(widget.$el.find(".tile-title").length).toBe(1);
            expect(widget.$el.find(".tile-title").find(".csui-heading").text()).toBe(title);
        });

        it("Donut chart - Pie & total count", function() {
            expect(widget.$el.find(".wf-status-visual-data-container").length).toBe(1);
            expect(widget.$el.find('svg').length).toBe(1);

            var pie = widget.$el.find('.pie-chart');
            expect(pie.length).toBe(1);
            expect(pie.find('.arc').length).toBe(4);
            expect(pie.find('.pie-total-container').length).toBe(1);
            expect(pie.find('.total-count').text()).toBe(widget.model.get("count")+"");
            expect(pie.find('.total-text').text()).toBe("Total");
        });

        it("Donut chart - status counts", function() {
            var pieLegendContainer = widget.$el.find('.pie-legend-container');
            var counts = widget.model.get('data');
            var pieLegend = pieLegendContainer.find('.pie-legend:eq(0)');

            expect(pieLegendContainer.length).toBe(1);
            expect(pieLegendContainer.find('.pie-legend').length).toBe(4);

            expect(pieLegend.find('.wf-legend-text').text()).toBe(lang.late);
            expect(pieLegend.find('.wf-legend-count').text()).toBe(counts[0].count+'');

            pieLegend = pieLegendContainer.find('.pie-legend:eq(1)');
            expect(pieLegend.find('.wf-legend-text').text()).toBe(lang.onTime);
            expect(pieLegend.find('.wf-legend-count').text()).toBe(counts[1].count+'');

            pieLegend = pieLegendContainer.find('.pie-legend:eq(2)');
            expect(pieLegend.find('.wf-legend-text').text()).toBe(lang.stopped);
            expect(pieLegend.find('.wf-legend-count').text()).toBe(counts[2].count+'');

            pieLegend = pieLegendContainer.find('.pie-legend:eq(3)');
            expect(pieLegend.find('.wf-legend-text').text()).toBe(lang.completed);
            expect(pieLegend.find('.wf-legend-count').text()).toBe(counts[3].count+'');
        });

    });

    describe("Workflow monitoring widget - ontime single workflow", function () {

        var widget, title = "Ontime single workflow";

        beforeEach(function (done) {

           var modelOptions = {
                selectionType:100,
                wfstatusfilter:5324,
                widgetTitle: title
            }
            var context  = BaseTestUtils.getContext(),
                options  = {context: context, data: modelOptions};

            BaseTestUtils.workItemMock.enable();
            context = BaseTestUtils.getContext();

            widget = new WFMonitorView(options);
            widget.model.fetch().then(function () {
            widget.render();

          });

          BaseTestUtils.waitUntil(function () {

            if (widget.$el.find('div.wfstatus-single').length > 0) {
                return true;
            }
            return false;
          }, 5000).always(function () {
            done();
          });
        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it("Widget title", function() {
            expect(widget.$el.find(".tile-title").length).toBe(1);
            expect(widget.$el.find(".tile-title").find(".csui-heading").text()).toBe(title);
        });

        it ("Single ontime workflow", function() {

            var statusInfo = widget.$el.find("div.wfstatus-single-details");

            expect(statusInfo.find('.wfstatus-duedate').length).toBe(1);

            expect(statusInfo.find('.wfstatus-info').text()).toBe(lang.onTime);

            expect(statusInfo.find('.wfstatus-wfname-details').length).toBe(1);
            expect(statusInfo.find('.wfstatus-wfname-details').find('.wfstatus-workflow-name').text()).toBe(widget.model.get('data').wfname);

            expect(statusInfo.find('.wfstatus-currentstep-details').length).toBe(1);
            expect(statusInfo.find('.wfstatus-currentstep-details').find('.wfstatus-step-name').text()).toBe(widget.model.get('data').stepname);

            expect(statusInfo.find('.wfstatus-assignee-details').length).toBe(1);
            expect(statusInfo.find('.wfstatus-assignee-details').find('.wfstatus-assignee').text()).toBe(widget.model.get('data').currentAssignee);

        });
    });

    describe("Workflow monitoring widget - Ontime Workflows", function () {

        var widget, title = "Ontime Workflows";

        beforeEach(function (done) {

           var modelOptions = {
                selectionType:100,
                wfstatusfilter:5325,
                widgetTitle: title
            }
            var context  = BaseTestUtils.getContext(),
                options  = {context: context, data: modelOptions};

            BaseTestUtils.workItemMock.enable();
            context = BaseTestUtils.getContext();

            widget = new WFMonitorView(options);
            widget.model.fetch().then(function () {
            widget.collection = new Backbone.Collection(widget.model.get('data'));
            widget.render();
            widget.$el.find('div.wfstatus-donut-chart').append("<div class='wf-status-donut-piechart'></div");

            buildDonutChart(widget);
          });

          BaseTestUtils.waitUntil(function () {
            if (widget.$el.find('.wf-status-donut-piechart').length > 0) {
                return true;
            }
            return false;
          }, 5000).always(function () {
            done();
          });
        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it ("Widget title", function() {
            expect(widget.$el.find(".tile-title").length).toBe(1);
            expect(widget.$el.find(".tile-title").find(".csui-heading").text()).toBe(title);
        });

        it("Donut chart - Pie & total count", function() {
            var pie = widget.$el.find('.pie-chart');
            expect(pie.length).toBe(1);
            expect(pie.find('.total-count').text()).toBe(widget.model.get("count")+"");
            expect(pie.find('.total-text').text()).toBe("Total");
        });

        it("Donut chart - status counts", function() {
            var pieLegend = widget.$el.find('.pie-legend-container').find('.pie-legend:eq(0)');
            expect(pieLegend.find('.wf-legend-text').text()).toBe(lang.onTime);
            expect(pieLegend.find('.wf-legend-count').text()).toBe(widget.model.get('data')[0].count+'');
        });

    });

    describe("Workflow monitoring widget - late workflows", function () {

        var widget, title = "Late workflows";

        beforeEach(function (done) {

           var modelOptions = {
                selectionType:100,
                wfstatusfilter:5326,
                widgetTitle: title
            }
            var context  = BaseTestUtils.getContext(),
                options  = {context: context, data: modelOptions};

            BaseTestUtils.workItemMock.enable();
            context = BaseTestUtils.getContext();

            widget = new WFMonitorView(options);
            widget.model.fetch().then(function () {
            widget.render();

          });

          BaseTestUtils.waitUntil(function () {

            if (widget.$el.find('div.wfstatus-single').length > 0) {
                return true;
            }
            return false;
          }, 5000).always(function () {
            done();
          });
        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it("Widget title", function() {
             expect(widget.$el.find(".tile-title").find(".csui-heading").text()).toBe(title);
         });

         it ("Single late workflow", function() {

            var statusInfo = widget.$el.find("div.wfstatus-single-details");

            expect(statusInfo.find('.wfstatus-duedate').length).toBe(1);

            expect(statusInfo.find('.wfstatus-info').text()).toBe(lang.late);

            expect(statusInfo.find('.wfstatus-wfname-details').length).toBe(1);
            expect(statusInfo.find('.wfstatus-wfname-details').find('.wfstatus-workflow-name').text()).toBe(widget.model.get('data').wfname);

            expect(statusInfo.find('.wfstatus-currentstep-details').length).toBe(1);
            expect(statusInfo.find('.wfstatus-currentstep-details').find('.wfstatus-step-name').text()).toBe(widget.model.get('data').stepname);

            expect(statusInfo.find('.wfstatus-assignee-details').length).toBe(1);
            expect(statusInfo.find('.wfstatus-assignee-details').find('.wfstatus-assignee').text()).toBe(widget.model.get('data').currentAssignee);

         });
    });

    describe("Workflow monitoring widget - Completed workflows", function () {

        var widget, title = "Completed workflows";

        beforeEach(function (done) {

           var modelOptions = {
                selectionType:100,
                wfstatusfilter:5327,
                widgetTitle: title
            }
            var context  = BaseTestUtils.getContext(),
                options  = {context: context, data: modelOptions};

            BaseTestUtils.workItemMock.enable();
            context = BaseTestUtils.getContext();

            widget = new WFMonitorView(options);
            widget.model.fetch().then(function () {
            widget.render();

          });

          BaseTestUtils.waitUntil(function () {

            if (widget.$el.find('div.wfstatus-single').length > 0) {
                return true;
            }
            return false;
          }, 5000).always(function () {
            done();
          });
        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it("Widget title", function() {
             expect(widget.$el.find(".tile-title").find(".csui-heading").text()).toBe(title);
         });

         it ("Single completed workflow", function() {

            var statusInfo = widget.$el.find("div.wfstatus-single-details");

            expect(statusInfo.find('.wfstatus-duedate').length).toBe(0);

            expect(statusInfo.find('.wfstatus-info').text()).toBe(lang.completed);
            expect(statusInfo.find('.wfstatus-wfname-details').length).toBe(1);
            expect(statusInfo.find('.wfstatus-wfname-details').find('.wfstatus-workflow-name').text()).toBe(widget.model.get('data').wfname);

            expect(statusInfo.find('.wfstatus-currentstep-details').length).toBe(0);
            expect(statusInfo.find('.wfstatus-assignee-details').length).toBe(0);

          });
    });

    describe("Workflow monitoring widget - Single Stopped workflow", function () {

      var widget, title = "Single Stopped workflow";

      beforeEach(function (done) {

         var modelOptions = {
              selectionType:100,
              wfstatusfilter:5328,
              widgetTitle: title
          }
          var context  = BaseTestUtils.getContext(),
              options  = {context: context, data: modelOptions};

          BaseTestUtils.workItemMock.enable();
          context = BaseTestUtils.getContext();

          widget = new WFMonitorView(options);
          widget.model.fetch().then(function () {
            widget.render();
          });

        BaseTestUtils.waitUntil(function () {

          if (widget.$el.find('div.wfstatus-single').length > 0) {
              return true;
          }
          return false;
        }, 5000).always(function () {
          done();
        });
      });

      afterEach(function () {
        widget.destroy();
        $('body').empty();
        BaseTestUtils.workItemMock.disable();
      });

      it("Widget title", function() {
           expect(widget.$el.find(".tile-title").find(".csui-heading").text()).toBe(title);
       });

       it ("Single stoppped workflow", function() {

          var statusInfo = widget.$el.find("div.wfstatus-single-details");

          expect(statusInfo.find('.wfstatus-count.stopped').text()).toBe("1");
          expect(statusInfo.find('.wfstatus-info').text()).toBe(lang.stopped);

          expect(statusInfo.find('.wfstatus-wfname-details').length).toBe(1);
          expect(statusInfo.find('.wfstatus-wfname-details').find('.wfstatus-workflow-name').text()).toBe(widget.model.get('data').wfname);

          expect(statusInfo.find('.wfstatus-assignee-startdate').length).toBe(1);

       });
    });

    describe("Workflow monitoring widget - Stopped Workflows", function () {

      var widget, title = "Stopped Workflows";

      beforeEach(function (done) {

         var modelOptions = {
              selectionType:100,
              wfstatusfilter:5329,
              widgetTitle: title
          }
          var context  = BaseTestUtils.getContext(),
              options  = {context: context, data: modelOptions};

          BaseTestUtils.workItemMock.enable();
          context = BaseTestUtils.getContext();

          widget = new WFMonitorView(options);
          widget.model.fetch().then(function () {
          widget.collection = new Backbone.Collection(widget.model.get('data'));
          widget.render();
          widget.$el.find('div.wfstatus-donut-chart').append("<div class='wf-status-donut-piechart'></div");

          buildDonutChart(widget);
        });

        BaseTestUtils.waitUntil(function () {
          if (widget.$el.find('.wf-status-donut-piechart').length > 0) {
              return true;
          }
          return false;
        }, 5000).always(function () {
          done();
        });
      });

      afterEach(function () {
        widget.destroy();
        $('body').empty();
        BaseTestUtils.workItemMock.disable();
      });

      it ("Widget title", function() {
          expect(widget.$el.find(".tile-title").length).toBe(1);
          expect(widget.$el.find(".tile-title").find(".csui-heading").text()).toBe(title);
      });

      it("Donut chart - Pie & total count", function() {
          var pie = widget.$el.find('.pie-chart');
          expect(pie.length).toBe(1);
          expect(pie.find('.total-count').text()).toBe(widget.model.get("count")+"");
          expect(pie.find('.total-text').text()).toBe("Total");
      });

      it("Donut chart - status counts", function() {
          var pieLegend = widget.$el.find('.pie-legend-container').find('.pie-legend:eq(2)');
          expect(pieLegend.find('.wf-legend-text').text()).toBe(lang.stopped);
          expect(pieLegend.find('.wf-legend-count').text()).toBe(widget.model.get('data')[2].count+'');
      });

  });


    function buildDonutChart(widget) {
        var donutOptions = {};

        donutOptions.dataset = widget.model.get('data');
        var statusArray = {
          ontime: lang.onTime,
          late: lang.late,
          completed: lang.completed,
          stopped: lang.stopped
        };

        donutOptions.statusArray = statusArray;
        donutOptions.totalLabel = lang.totalMsg;
        donutOptions.parent = widget;
        var donutView = new VisualDataDonutContentView(donutOptions);
        widget.donut.show(donutView);
    }

});