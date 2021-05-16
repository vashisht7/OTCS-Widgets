/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/models/nodes',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/controls/stepcards/stepcard.view',
  'workflow/controls/stepcards/stepcards.view',
  'hbs!workflow/controls/stepcards/impl/stepcards.list',
  'css!workflow/controls/stepcards/impl/stepcard'
], function (require, $, _, Backbone, Marionette,
    NodeCollection, PerfectScrollingBehavior, StepcardView, StepcardCollectionView,
    template) {
  'use strict';
  var StepcardsListView = Marionette.LayoutView.extend({

    childView: StepcardView,
    className: 'wfstatus-stepcard-layout',
    template: template,
    tagName: 'div',

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.wfstatus-stepcard-list',
        scrollXMarginOffset: 30,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    regions: {
      stepcardLayout: ".wfstatus-stepcard-list"
    },

    events: {
      'click .wfstatus-stepcard': 'makeStepCardActive',
    },

    constructor: function StepcardsListView(options) {
      options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var stepType, stepList;
      if (this.options.listViewMulCurrentSteps) {
        stepList = this.options.model.get("parallel_steps");
        stepType = "current";
      } else {
        stepList = this.options.step_list;
        stepType = this.options.stepType;
      }

      this.stepcollection = new NodeCollection(stepList, {});
      this.stepcardCollectionView = new StepcardCollectionView({
        collection: this.stepcollection,
        context: this.options.context,
        cellView: this.options.cellView,
        stepCardsListView: this,
        wfStatusInfoModel: this.options.wfStatusInfoModel,
        stepType: stepType
      });
      this.stepcardLayout.show(this.stepcardCollectionView);
    },

    makeDefaultStepCardActive: function () {
      $('.wfstatus-stepcard').eq(0).addClass('active');
      $('.wfstatus-stepcard-layout .wfstatus-title-icon').eq(0).addClass('active');
    },

    makeStepCardActive: function (event) {

      if ($('.wfstatus-stepcard.active').length > 0) {
        $('.wfstatus-stepcard-layout .wfstatus-title-icon').eq(0).removeClass('active');
        var Utils = require('workflow/utils/workitem.util');
        var options        = {
              stepCardsListView: this
            },
            popoverOptions = {
              cardViewOptions: options
            };
        Utils.unbindPopover(popoverOptions);
        var $prevActiveEle = $('.wfstatus-stepcard.active').eq(0);
        $($prevActiveEle).removeClass('active');
      }

      $(event.currentTarget).addClass('active');
    }

  });
  return StepcardsListView;
});
