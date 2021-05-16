/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone',
      "csui/perspective.manage/widgets/perspective.widget/perspective.widget.view"],
    function (Backbone, PerspectiveWidgetView) {

      describe("Perspective Widget Preview View", function () {
        it("without manifest", function () {
          var view = new PerspectiveWidgetView();
          view.render();
          expect(view).toBeDefined();
        });
        it("with manifest", function () {
          var widget = new Backbone.Model({
            manifest: {
              schema: {properties: {}}
            }
          });
          var view = new PerspectiveWidgetView({
            data: {widget: widget}
          });
          view.render();
          expect(view).toBeDefined();
        });
      });
    });
