/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'workflow/controls/stepcards/stepcards.list.view',
  'hbs!workflow/widgets/wfstatus/impl/wfstatusitem.body',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'css!workflow/widgets/wfstatus/impl/wfstatus.progress'
], function (require, $, _, Marionette, StepcardsListView,
    template, lang) {
  'use strict';

  var WFStatusItemBodyView = Marionette.LayoutView.extend({

    template: template,

    className: 'wfstatusitem-content',

    constructor: function WFStatusItemBodyView(options) {
      this.options = options;
      this.model = options.model;
      this.defaults =  {
         currentStepPosition : 191
      };
      $(window).on("resize.app", this.adjustStepCardPosition);
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    ui: {
      nodeIcon: '.wfstatusitem-step-circle',
      nodeLabel: '.wfstatusitem-step-right-label',
      currentStepIcon: '.wfstatusitem-current-step-icon',
      completedStepIcon: '.wfstatusitem-completed-step-icon',
      stoppedStepIcon: '.wfstatusitem-stopped-step-icon',
      nextStepIcon: '.wfstatusitem-next-step-icon',
      currentStepLabel: '.wfstatusitem-current-step-label',
      completedStepLabel: '.wfstatusitem-completed-step-label',
      stoppedStepLabel: '.wfstatusitem-stopped-step-label',
      nextStepLabel: '.wfstatusitem-next-step-label',
      stepCard: '.wfstatus-step-info'
    },

    events: {
      'click @ui.currentStepIcon, @ui.currentStepLabel,@ui.completedStepIcon,@ui.completedStepLabel, @ui.nextStepIcon, @ui.nextStepLabel, @ui.stoppedStepLabel, @ui.stoppedStepIcon': 'onClickStep'
    },

    regions: {
      progressbar: '.wfstatusitem-progressbar',
      stepcards: '.wfstatusitem-step-cards'
    },

    templateHelpers: function () {

      var utils             = require('workflow/utils/workitem.util'),
          details           = this.model.get('details'),
          showDateHeader    = details.date_initiated && details.end_date,
          stepList          = this.model.get('step_list'),
          currentStepList   = stepList && stepList.current,
          completedStepList = stepList && stepList.completed,
          stoppedStepList   = stepList && stepList.stopped,
          currentStepDate   = (currentStepList && currentStepList.length >= 1) ?
                              utils.dateConversion(currentStepList[0].task_start_date, 'Month DD') :
                              '',
          stoppedDate       = details.stoppedDate ? utils.dateConversion(details.stoppedDate) : '',
          panelDate         = showDateHeader ?
                              this.getDateHeader(details.start_date, details.end_date) : "";

      return {
        "startLabel": lang.startLabel,
        "endLabel": lang.endLabel,
        "currentStepLabel": (currentStepList && currentStepList.length > 1) ?
                            lang.currentStepsLabel : lang.currentStepLabel,
        "nextStepLabel": lang.nextStepLabel,
        "stoppedStepLabel": lang.stoppedStepLabel,
        "completedStepLabel": (completedStepList && completedStepList.length > 1) ?
                              lang.completedStepsLabel : lang.completedStepLabel,
        "wfName": details.wf_name,
        "startDate": panelDate ? panelDate.startDate : "",
        "panelStartDate": details.date_initiated,
        "currentStepDate": currentStepDate,
        "endDate": panelDate ? panelDate.endDate : "",
        "panelEndDate": details.end_date === "" ? "" : utils.dateConversion(details.end_date, 'Month DD'),
        "dueDate": details.due_date,
        "status": details.status_key,
        "assignee": details.assignee,
        "userId": details.userId,
        "showDateHeader": showDateHeader,
        "showCompleted": (completedStepList && completedStepList.length !== 0) ? true : false,
        "showStopped": (stoppedStepList && stoppedStepList.length !== 0) ? true : false,
        "showCurrent": (currentStepList && currentStepList.length !== 0) ? true : false,
        "stoppedDate": stoppedDate,
        "stoppedLabel": lang.stopped,
        "onLabel": lang.on
      };
    },

    getDateHeader: function (startDate, endDate) {
      var startDateValue = new Date(startDate),
          endDateValue   = new Date(endDate),
          utils          = require('workflow/utils/workitem.util'),
          dateHeader     = {};
      dateHeader.endDate = utils.dateConversion(endDate);

      if (startDateValue.getFullYear() === endDateValue.getFullYear()) {
        dateHeader.startDate = utils.dateConversion(startDate, 'Month DD');
      } else {
        dateHeader.startDate = utils.dateConversion(startDate);
      }
      return dateHeader;
    },

    onClickStep: function (event) {
      var Utils = require('workflow/utils/workitem.util');
      Utils.unbindPopover();
      this.removeFocusIcons();
      var currentAction = (event && event.currentTarget) ?
                          event.currentTarget.getAttribute('type') : event,
          position, top, stepList, stepOptions, stepCardHeight;
      this.currentAction = currentAction;

      if(currentAction){
        switch(currentAction){
        case 'current':
          this.showArrow(this.ui.currentStepIcon, this.ui.currentStepLabel);
          position = this.ui.currentStepLabel.position();
          break;
        case 'completed':
          this.showArrow(this.ui.completedStepIcon, this.ui.completedStepLabel);
          position = this.ui.completedStepLabel.position();
          break;
        case 'stopped':
          this.showArrow(this.ui.stoppedStepIcon, this.ui.stoppedStepLabel);
          position = this.ui.stoppedStepLabel.position();
          break;
        case 'next':
          this.showArrow(this.ui.nextStepIcon, this.ui.nextStepLabel);
          position = this.ui.nextStepLabel.position();
          break;
        }

        stepList    = this.model.get('step_list')[currentAction];
        stepOptions = {
              "step_list": stepList,
              "context": this.options.context,
              "cellView":this.options.cellView,
              "wfStatusInfoModel": this.model,
              "stepType": currentAction
            };

        this.stepcardsListView = new StepcardsListView(stepOptions);
        this.stepcards.show(this.stepcardsListView);
        top = position.top ;
        stepCardHeight = $('.wfstatus-stepcard').height();
        if(top !== 0) {
          top = top -( stepCardHeight / 2 ) + 14;
        }else{
          top = this.defaults.currentStepPosition;
        }
        $('.wfstatusitem-step-cards').css({"top": top});
        $('.wfstatus-stepcard').addClass('progress-panel');
        var stepCardListHeight = (top / 16) + 13;
        $('.wfstatus-stepcard-list').css({"height": "calc(100vh - " + stepCardListHeight + "rem)"});
        this.stepcardsListView.makeDefaultStepCardActive();
      }
    },

    adjustStepCardPosition: function (noOfNodes) {
   
      var progressNodeHeight = $($('.wfstatusitem-body'))[0].offsetHeight;
      if(typeof(noOfNodes) === "object"){
          noOfNodes = $('.wfstatusitem-bar').length;
      }
      $('.wfstatusitem-progressbar .wfstatusitem-bar').css({"height":(progressNodeHeight - 250)/ noOfNodes});
      $('.wfstatusitem-step-cards').css({'top': $('.wfstatusitem-focus-arrow')[0].offsetTop - 38.5});
      $('.wfstatus-progress-view').css({"opacity": '1'});

      var top                = $('.wfstatusitem-focus-arrow')[0].offsetTop - 30,
          stepCardListHeight = (top / 16) + 11.85;

      $('.wfstatus-stepcard-list').css({"height": "calc(100vh - " + stepCardListHeight + "rem)"});
    },

    removeFocusIcons: function () {
      if (this.stepcardsListView) {
        this.stepcardsListView.destroy();
      }

      this.ui.nodeIcon.removeClass("wfstatusitem-focus-icon");
      this.ui.nodeLabel.removeClass("wfstatusitem-focus-arrow");
    },

    showArrow: function (stepIcon, stepLabel) {
      if (stepIcon && stepLabel) {
        stepIcon.addClass("wfstatusitem-focus-icon");
        stepLabel.addClass("wfstatusitem-focus-arrow");
      }
    }
  });

  return WFStatusItemBodyView;

});

