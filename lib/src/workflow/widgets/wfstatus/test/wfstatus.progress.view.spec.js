/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  'csui/utils/contexts/page/page.context',
  'workflow/testutils/base.test.utils',
  'workflow/models/wfstatus/wfstatus.collection.factory',
  'workflow/widgets/wfstatus/impl/wfstatus.extended.view',
  'workflow/widgets/wfstatus/impl/wfstatus.progress.view',
  'workflow/models/wfstatus/wfstatusinfo.model.factory'
], function (Backbone, $, _, Marionette, PageContext,
    BaseTestUtils, WFStatusCollectionFactory, WFStatusExtendedView,
    WFStatusProgressView, WFStatusInfoModelFactory) {
  "use strict";

  describe("The Workflow Status Widget Progress view", function () {

    var progressView, progressRegion;

    beforeEach(function (done) {
      $('body').append($('<div/>', {
        "class" : "wfstatus-progress-test-view"
      }));

      progressRegion = new Marionette.Region({el: ".wfstatus-progress-test-view"});

      var context = BaseTestUtils.getContext();
      var options = {
        retention: 30,        
        filterWorkflowtype:"Both", 
        selectionType:100,       
        status: "ontime",
        "chatSettings" : {"chatEnabled": true, "presenceEnabled": false}
      };
      BaseTestUtils.workItemMock.enable();
      var statusCollection = context.getCollection(WFStatusCollectionFactory, options);
      statusCollection.fetch({reload: true})
          .then(function () {
            delete options["chatSettings"];
            options.model = statusCollection.allModels[0];
            options.context = context;
            progressView = new WFStatusProgressView(options);
            progressRegion.show(progressView);
          });

      BaseTestUtils.waitUntil(function () {
        if (progressView.$('.wfstatusitem-progress-panel').length > 0 &&
        progressView.$(".wfstatus-stepcard").length === 1 && 
        $(".workitem-attachments-item").length > 0) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });
    });

    it('Basic progress view layout', function (done) {
      expect($(".wfstatusitem-body").length).toEqual(1);
      expect($(".wfstatusitem-tabpanel").length).toEqual(1);
      expect($(".cs-tablink-text").length).toEqual(3);
      expect($(".cs-tablink-text")[1].textContent).toBe("Attachments");
      expect($(".workitem-attachments-item").length).toEqual(2);
      expect($(".workitem-attachment-name")[0].textContent).toBe("Desert.jpg");
      expect($(".cs-tablink-text")[0].textContent).toBe("Details");
      expect($(".wfstatusitem-details-value")[0].textContent).toBe("Testing Workflow Status");
      expect($(".wfstatusitem-details-value")[1].textContent).toBe("November 1, 2028");
      expect($(".wfstatusitem-details-value")[2].textContent).toBe("on time");
      expect($(".wfstatusitem-details-value")[3].textContent.trim()).toBe("Admin Admin");
      expect($(".wfstatusitem-details-value")[4].textContent).toBe("November 1, 2017");
      expect($(".wfstatusitem-step").length).toEqual(5);
      expect($(".wfstatus-stepcard").length).toEqual(1);
      expect($(".wfstatus-step-name").text().trim()).toBe("Current step");
      expect($(".wfstatus-step-status").text()).toBe("on time");
      expect($(".wfstatus-step-assignee").text().trim()).toBe("alex dan");
      expect($(".wfstatus-open-workflow-button button").text().trim()).toBe("Open Workflow");

      $("div.wfstatus-progress-test-view").addClass("binf-modal-content");

      $(".wfstatus-step-assignee").trigger('click');
      BaseTestUtils.waitUntil(function () {
        if ($(".wfstatus-usercard").length === 1) {
          expect($(".wfstatus-usercard").length).toEqual(1);
          expect($(".wfstatus-reassignButton:visible").length).toEqual(1);
          expect($(".wfstatus-chatButton:visible").length).toEqual(1);
          expect($(".wfstatus-mini-profile-user-email").text().trim()).toBe("alex@ot.com");
          expect($(".wfstatus-mini-profile-user-name").text().trim()).toBe("Alex Chaudry");
          expect($(".wfstatus-mini-profile-user-phone").text().trim()).toBe("Phone: 546346326272");
          $(".wfstatusitem-completed-step-icon").trigger("click");

          return true;
        }
        return false;
      }, 500);

       BaseTestUtils.waitUntil(function (done) {
        if ($(".wfstatusitem-completed-step-icon.wfstatusitem-focus-icon").length === 1 &&
            $(".wfstatus-completed-step-icon").length > 0) {
          expect($(".wfstatus-step-name")[0].textContent).toBe("Start Step");
          expect($(".wfstatus-step-duedate")[0].textContent).toBe("completed");
          expect($(".wfstatus-step-assignee")[0].textContent.trim()).toBe("alex dan");
          expect($(".wfstatus-open-workflow-button button")[0].textContent).toBe("Open Workflow");

          expect($(".wfstatus-step-name")[1].textContent).toBe("E-Mail");
          expect($(".wfstatus-step-duedate")[1].textContent).toBe("completed");
          expect($(".wfstatus-step-assignee")[1].textContent.trim()).toBe("Dan Brown");
          expect($(".wfstatus-open-workflow-button button")[1].textContent).toBe("Open Workflow");

          $(".wfstatus-step-assignee").trigger("click");

          return true;
        }
        return false;
      }, 1000);
      BaseTestUtils.waitUntil(function (done) {
        if ( $(".wfstatusitem-completed-step-icon.wfstatusitem-focus-icon").length === 1 &&
          $(".wfstatus-completed-step-icon").length > 0 && 
          $(".wfstatus-usercard").length === 1) {
          expect($(".wfstatus-usercard").length).toEqual(1);
          expect($(".wfstatus-reassignButton:visible").length).toEqual(1);
          expect($(".wfstatus-chatButton:visible").length).toEqual(1);
          expect($(".wfstatus-mini-profile-user-email").text().trim()).toBe("alex@ot.com");
          expect($(".wfstatus-mini-profile-user-name").text().trim()).toBe("Alex Chaudry");
          expect($(".wfstatus-mini-profile-user-phone").text().trim()).toBe("Phone: 546346326272");

          return true;
        }
        return false;
      }, 1500).always(function() {
        done();
      });


    });

    it("Stop worklfow action", function() {

      expect($(".wfstatusitem-stop-btn")[0]).toBeDefined();
      expect($(".wfstatusitem-stop-btn").length).toBe(1);

      expect($(".wfstatusitem-date")[0]).toBeDefined();
      expect($(".wfstatusitem-date").find(".wfstatusitem-date").text()).toBe("November 1, 2017 - November 1, 2028");

    });

    afterEach(function () {
      progressView.destroy();
      progressRegion.destroy();
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });

  });

  describe("Workflow progress view - ", function() {

    var progressView, progressRegion;

    beforeEach(function (done) {
      $('body').append($('<div/>', {
        "class" : "wfstatus-progress-test-view"
      }));

      progressRegion = new Marionette.Region({el: ".wfstatus-progress-test-view"});

      var context = BaseTestUtils.getContext(),
      options = { process_id: 7412, subprocess_id: 7412 },
      infoModel = context.getModel(WFStatusInfoModelFactory, options);
      
      BaseTestUtils.workItemMock.enable();
      infoModel.fetch().then(function () {
            options.model = infoModel;
            options.context = context;
            progressView = new WFStatusProgressView(options);
            progressRegion.show(progressView);
          });

      BaseTestUtils.waitUntil(function () {
        if (progressView.$('.wfstatusitem-progress-panel').length > 0 &&
        progressView.$(".wfstatus-stepcard").length === 1) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });

    });

    it("Stopped workflow", function() {

      expect($(".wfstatusitem-stop-btn").length).toBe(0);
      expect($(".wfstatusitem-delete-btn")[0]).toBeDefined();
      expect($(".wfstatusitem-delete-btn").length).toBe(1);

      expect($(".wfstatusitem-date")[0]).toBeDefined();
      expect($(".wfstatusitem-date").find(".wfstatusitem-stopped-label").text().trim()).toBe("Stopped");
      expect($(".wfstatusitem-date").find(".wfstatusitem-stoppeddate").text()).toBe("April 25, 2019");

      expect($(".wfstatus-step-info").find(".wfstatus-step-status").text()).toBe("stopped");
      expect($(".wfstatus-step-info").find(".wfstatus-step-name").text()).toBe("<Initiator> Stopped Workflow");

    });

    afterEach(function () {
      progressView.destroy();
      progressRegion.destroy();
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });

  });

});
