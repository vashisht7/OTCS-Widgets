/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'hbs!workflow/controls/popover/impl/popover',
  'css!workflow/controls/popover/impl/popover'
], function (require, $, _, Backbone, Marionette, PerfectScrollingBehavior,
    template) {
  'use strict';

  var PopOverView = Marionette.LayoutView.extend({

    className: 'wfstatus-popover-class',
    template: template,
    tagName: 'div',

    constructor: function PopOverView(options) {

      options = options || {};
      this.cardListView = options.popoverCardsListView;
      Marionette.LayoutView.prototype.constructor.call(this, options);

    },

    regions: {
      popover: ".wfstatus-popover-content"
    },

    events: {
      'click .wfstatus-user-search-icon': 'toggleSearchInput',
      'keyup .wfstatus-user-input': 'searchUser'
    },

    ui: {
      wfstatusUserInput: '.wfstatus-user-input'
    },

    behaviors: {

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.wfstatus-popover-scrolling',
        scrollXMarginOffset: 30,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    templateHelpers: function () {
      var utils           = require('workflow/utils/workitem.util'),
          groupDetails    = this.model.get('assignedto') ? this.model.get('assignedto') :
                            this.model.get('task_assignees') ?
                            this.model.get('task_assignees').assignedto : undefined,
          isGroup         = groupDetails !== undefined ? true : false,
          dueDate         = this.model.get('task_due_date') === null ? "" :
                            this.model.get('task_due_date'),
          status          = this.model.get('task_status') === null ? "" :
                            this.model.get('task_status'),
          statusOptions   = {
            dueDate: dueDate,
            status: status
          },
          formattedStatus = utils.formatStatus(statusOptions);

      return {
        groupName: isGroup === true ? groupDetails.groupName : '',
        isGroup: isGroup,
        status: formattedStatus.status,
        listViewMulCurrentSteps: !( this.cardListView &&
                                    this.cardListView.options.listViewMulCurrentSteps )
      };
    },

    onRender: function () {
      this.popover.show(this.cardListView);
    },

    searchUser: function (e) {
      var searchVal      = e.currentTarget.value,
          userCollection = this.cardListView.completeCollection,
          models;

      if (searchVal && searchVal.length > 0) {
        var keywords = searchVal.toLowerCase().split(' ');
        models = userCollection.filter(function (item) {
          var name      = item.get("name"),
              firstname = item.get("first_name"),
              lastname  = item.get("last_name");

          name = name ? name.trim().toLowerCase() : "";
          firstname = firstname ? firstname.trim().toLowerCase() : "";
          lastname = lastname ? lastname.trim().toLowerCase() : "";

          var isMatch = _.reduce(keywords, function (result, keyword) {
            return result && (name.indexOf(keyword) >= 0 || firstname.indexOf(keyword) >= 0 ||
                              lastname.indexOf(keyword) >= 0);
          }, true);
          return isMatch;
        });
      } else {
        models = this.cardListView.completeCollection.models;
      }
      this.cardListView.Usercollection.reset(models);
    },

    toggleSearchInput: function () {
      if (this.ui.wfstatusUserInput.hasClass('binf-active')) {
        $('.wfstatus-user-input').hide();
        $('.wfstatus-usercard-popover-header-labels').show();
        this.ui.wfstatusUserInput.removeClass('binf-active');
      } else {
        $('.wfstatus-user-input').show();
        $('.wfstatus-usercard-popover-header-labels').hide();
        this.ui.wfstatusUserInput.addClass('binf-active');
      }
    },

    setPopoverSize: function (options) {

      var userPopoverOptions = {},
          PopOverContentEle  = this.$el.find(".wfstatus-popover-content.popover"),
          widgetDialog       = $(options.widgetDialog);
      if (this.cardListView && this.cardListView.options.listViewMulCurrentSteps) {
        switch (this.model.get('parallel_steps').length) {
        case 1 :
          PopOverContentEle.addClass("wfstatus-list-step-card-size-single");
          break;
        case 2:
          PopOverContentEle.addClass("wfstatus-list-step-card-size-double");
          break;
        case 3:
          PopOverContentEle.addClass("wfstatus-list-step-card-size-triple");
          break;
        default:
          PopOverContentEle.addClass("wfstatus-list-step-card-size-large");
          break;
        }
      } else {
        var isGroup        = (this.model.get('task_assignees') &&
                              this.model.get('task_assignees').assignedto) ? true :
                             this.model.get('assignedto') ? true : false,
            that           = this,
            popoverOptions = {};
        if (isGroup) {
          var model     = this.model,
              assignees = (model.get('assignedto') &&
                           model.get('assignedto').assignees) ?
                          model.get('assignedto').assignees :
                          model.get('task_assignees').assignees;
          if (assignees.length < 3) {
            popoverOptions.popoverContentEle = PopOverContentEle;
            popoverOptions.popoverView = that;
            popoverOptions.assignees = assignees;
            popoverOptions = that.getGroupPopoverHeightOptions(popoverOptions);
          }

        } else {
          PopOverContentEle.addClass("small");
          popoverOptions.model = this.model;
          popoverOptions.popoverView = that;
          popoverOptions = that.getSingleUserPopoverHeightFactor(popoverOptions);
        }
        var factor = popoverOptions && popoverOptions.factor ? popoverOptions.factor : 1;
        userPopoverOptions.assigneesLength = popoverOptions && popoverOptions.assigneesLength ?  popoverOptions.assigneesLength : 0;
        userPopoverOptions.userPopoverSize = widgetDialog.height() / factor;
      }

      return userPopoverOptions;
    },

    getUsercardDeatilsCount: function (assignee) {
      var phoneCount = 0, emailCount = 0, usercardDeatilsCount = {};
      if (assignee.emailAddress && assignee.emailAddress !== "") {
        emailCount += 1;
      }
      if (assignee.phone && assignee.phone !== "") {
        phoneCount += 1;
      }
      usercardDeatilsCount.phoneCount = phoneCount;
      usercardDeatilsCount.emailCount = emailCount;
      return usercardDeatilsCount;
    },

    getGroupPopoverHeightOptions: function (options) {

      var phoneCount                                   = 0,
          emailCount                                   = 0,
          factor, usercardDeatilsCount, assignee, data = {},
          popOverContentEle                            = options.popoverContentEle,
          popoverView                                  = options.popoverView,
          assignees                                    = options.assignees;

      if (assignees) {

        switch (assignees.length) {
        case 1:
          assignee = assignees[0];
          usercardDeatilsCount = popoverView.getUsercardDeatilsCount(assignee);
          phoneCount = usercardDeatilsCount.phoneCount;
          emailCount = usercardDeatilsCount.emailCount;
          popOverContentEle.addClass("small");
          if (phoneCount === 1 && emailCount === 1) {
            factor = 1.0226524280919911;
          } else if (phoneCount === 1) {
            factor = 1.130653266331658;
          } else if (emailCount === 1) {
            factor = 1.142063636363636;
          } else {
            factor = 1.286165534883721;
          }
          data.assigneesLength = 1;
          break;
        case 2:
          _.each(assignees, function (assignee) {
            usercardDeatilsCount = popoverView.getUsercardDeatilsCount(assignee);
            phoneCount += usercardDeatilsCount.phoneCount;
            emailCount += usercardDeatilsCount.emailCount;
          });

          if (emailCount === 2 && phoneCount === 2) {
            factor = 1.050982178217822;
          } else if (emailCount === 1 && phoneCount === 2) {
            factor = 1.109999058047493;
          } else if (emailCount === 2 && phoneCount === 1) {
            factor = 1.115023871721592;
          } else if (emailCount === 1 && phoneCount === 1) {
            factor = 1.185727272727273;
          } else if (emailCount === 2) {
            factor = 1.192028571428571;
          } else if (emailCount === 1) {
            factor = 1.272123846153846;
          } else if (phoneCount === 2) {
            factor = 1.178691694915254;
          } else if (phoneCount === 1) {
            factor = 1.266257668711656;
          } else {
            factor = 1.362422006688963;
          }
          data.assigneesLength = assignees.length;
          break;
        }
      }
      data.factor = factor;
      return data;
    },

    getSingleUserPopoverHeightFactor: function (options) {
      var factor, model        = options.model,
          popoverView          = options.popoverView,
          taskAssignees        = model.get("task_assignees") ? model.get("task_assignees") :
                                 model.get('parallel_steps')[0].task_assignees,
          assignee             = taskAssignees.assignee[0],
          usercardDeatilsCount = popoverView.getUsercardDeatilsCount(assignee),
          phoneCount           = usercardDeatilsCount.phoneCount,
          emailCount           = usercardDeatilsCount.emailCount;

      if (phoneCount === 1 && emailCount === 1) {
        factor = 1.031887005649718;
      } else if (phoneCount === 1) {
        factor = 1.175157894736842;
      } else if (emailCount === 1) {
        factor = 1.19411666666667;
      } else {
        factor = 1.3965;
      }
      return {factor: factor, assigneesLength : 1};
    }
  });

  function ShowPopOver(options) {

    var Utils = require('workflow/utils/workitem.util');
    Utils.unbindPopover(options);
    var popoverConfig = initializePopover(options);
    bindEvents(options);
    if (options.cardViewOptions.listViewMulCurrentSteps) {
      var cardViewOptions = options.cardViewOptions;
      popoverConfig.listViewMulCurrentSteps = cardViewOptions.listViewMulCurrentSteps;
      cardViewOptions.popoverCardsListView.makeDefaultStepCardActive();
      $('.wfstatus-stepcard').addClass('wfstatus-list-current-step');
    }
    popoverConfig.popoverView.userPopoverOptions = popoverConfig.popoverView.setPopoverSize(
        popoverConfig);
    setPopoverPointer(popoverConfig);

  }

  function UnbindPopoverEvents() {
    $(window).off('resize.onPopOver');
    $(window).off('popstate.onPopOver');
    $(window).off('hashchange.onPopOver');
    $(".wfstatus-table tbody").off('scroll');
    $(".binf-modal-backdrop").off('keydown click');
    $(".binf-modal-header").off('keydown click');
  }
  function initializePopover(options) {

    var cardsDialog,
        cardsDialogPointer,
        cardsDialogMask,
        parentNodeId,
        popoverConfig     = {},
        uniqueID         = _.uniqueId(3),
        defaultContainer = $.fn.binf_modal.getDefaultContainer();

    cardsDialog = document.createElement('div');
    cardsDialog.id = 'wfstatus-popover_' + uniqueID;
    parentNodeId = "#wfstatus-popover_" + uniqueID;
    cardsDialog.setAttribute("class", "wfstatus-popover");

    cardsDialogPointer = document.createElement('div');
    cardsDialogPointer.className = 'wfstatus-popover-arrow';
    cardsDialogPointer.id = 'wfstatus-popover-pointer_' + uniqueID;

    cardsDialogMask = document.createElement('div');
    cardsDialogMask.id = 'wfstatus-popover-mask_' + uniqueID;

    $(options.delegateTarget).css("overflow", "hidden");
    popoverConfig.widgetDialog = cardsDialog;
    popoverConfig.widgetDialogPointer = cardsDialogPointer;
    popoverConfig.widgetDialogMask = cardsDialogMask;
    popoverConfig.placeholder = options.delegateTarget;
    popoverConfig.widgetBaseElement = options.delegateTarget;
    popoverConfig.container = $(defaultContainer).find('.wfstatus-model-content').length === 1 ?
                              $(defaultContainer).find('.wfstatus-model-content') :
                              $('.binf-modal-content').last();

    $(defaultContainer).append(cardsDialogMask).append(cardsDialog).append(
        cardsDialogPointer);

    var PopoverRegion = new Marionette.Region({
      el: parentNodeId
    });
    var popoverView = new PopOverView(options.cardViewOptions);
    PopoverRegion.show(popoverView);

    popoverConfig.userPopoverOptions = popoverView.userPopoverOptions;
    popoverConfig.popoverView = popoverView;
    $(parentNodeId).css({display: "block"}).animate({opacity: 1.0});

    return popoverConfig;
  }

  function bindEvents(options) {
    var Utils = require('workflow/utils/workitem.util');
    $(".binf-modal-header").on('keydown click',
        {callbackFun: Utils.unbindPopover, popoverOptions: options}, handlePopoverDialog);
    $(".binf-modal-backdrop").on('keydown click',
        {callbackFun: Utils.unbindPopover, popoverOptions: options}, handlePopoverDialog);
    $(window).on('resize.onPopOver', function () {
      Utils.unbindPopover(options);
    });
    $(window).on('popstate.onPopOver', function () {
      Utils.unbindPopover(options);
    });
    $(window).on('hashchange.onPopOver', function () {
      Utils.unbindPopover(options);
    });

    $(".wfstatus-table tbody").on('scroll', function () {
      Utils.unbindPopover(options);
    });
    $(document).off('focusin.binf.modal');
  }
  function handlePopoverDialog(event) {

    var unbindWidgetFromBody = false,
        _e                   = event || window.event,
        options              = _e.data.popoverOptions;

    if (_e.type === 'popstate' || _e.type === 'hashchange') {
      unbindWidgetFromBody = true;
    }
    else if ((_e.type === 'keyup' || _e.type === 'keydown')) {

      if ((_e.keyCode === 27 || _e.which === 27)) {
        if ($('.wfstatus-popover').is(':visible') && $('.cs-dialog').is(':visible')) {
          unbindWidgetFromBody = true;
        }
        setFocusOnTargetEle();
      }
    }
    else if (_e.type === "resize") {
      if ($('.wfstatus-popover').is(':visible') && $('.cs-dialog').is(':visible')) {
        unbindWidgetFromBody = true;
      }
      setFocusOnTargetEle();
    } else {
      if (!$(_e.target).closest('.wfstatus-popover').length && _e.type === 'click') {
        if (!($(_e.target).closest('[id*=wfstatus-popover]').length &&
            !$(_e.target).closest('[id*=wfstatus-popover-mask_]').length) &&
            !$(_e.target).closest('[class*=ui-autocomplete]').length) {
          unbindWidgetFromBody = true;
        }
      }

    }

    if (options.cardViewOptions.stepCardsListView) {
      options.cardViewOptions.stepCardsListView.options.listViewMulCurrentSteps = false;
    }

    unbindWidgetFromBody ? _e.data.callbackFun(options) : "";

    function setFocusOnTargetEle() {
      if (options) {
        var element = options.popoverOptions;
        if (_e.type === 'keydown') {
          $(element).on('keyup', function (e) {
            if ($(element).is(':focus')) {
              $(element).off('keyup');
              e.stopPropagation();
            }
          });
        }
        if (element) {
          element.trigger("focus");
          setTimeout(function () {
            element.trigger("focus");
          }, 1);
        }
      }
    }
  }
  function setPopoverPointer(popoverConfig) {

    var widgetDialog        = $(popoverConfig.widgetDialog),
        widgetDialogPointer = $(popoverConfig.widgetDialogPointer),
        widgetBaseElement   = $(popoverConfig.widgetBaseElement),
        setDialogCenter     = false,
        container           = popoverConfig.container,
        popoverContentEle = $('.wfstatus-popover-content'),
        widgetDialogPositionMy, widgetDialogPositionAt, widgetDialogLeftPos,
        widgetDialogTopPos, widgetDialogRightPos, targetElementLeftPos, targetElementTopPos,
        baseWrapsParent, widgetDialogBottomPos, targetElementBottomPos;

    popoverConfig.widgetBaseElement = $(popoverConfig.widgetBaseElement).width() === 0 ?
                                      $("[data-value=" +
                                        $(popoverConfig.widgetBaseElement).attr("data-value") +
                                        "]") : popoverConfig.widgetBaseElement;

    widgetDialog.css({
      "position": "absolute",
      "left": "0",
      "top": "0"
    });
    widgetDialogPointer.css({
      "position": "absolute",
      "left": "0",
      "top": "0"
    }).addClass("wfstatus-popover-arrow-left");

    if (popoverConfig.listViewMulCurrentSteps) {
      widgetDialogPositionMy = "center top";
      widgetDialogPositionAt = "center bottom";
    } else {
      widgetDialogPositionMy = "left top";
      var leftPos = parseInt(widgetBaseElement.outerWidth() + 10, 10);
      widgetDialogPositionAt = "left+" + leftPos + " top -" +
                               (widgetBaseElement.parent().height() / 2);
    }

    widgetDialog.position({
      my: widgetDialogPositionMy,
      at: widgetDialogPositionAt,
      of: popoverConfig.widgetBaseElement,
      collision: "flipfit flipfit"
    });
    widgetDialogLeftPos = widgetDialog.offset().left;
    widgetDialogTopPos = widgetDialog.offset().top;
    widgetDialogBottomPos = widgetDialogTopPos + widgetDialog.height();
    widgetDialogRightPos = widgetDialogLeftPos + widgetDialog.width();
    targetElementLeftPos = widgetBaseElement.offset().left;
    targetElementTopPos = widgetBaseElement.offset().top;
    targetElementBottomPos = targetElementTopPos + widgetBaseElement.height();

    var containerTopPos = container.offset().top;
    var containerBottomPos = container.offset().top + container.height();

    baseWrapsParent = widgetBaseElement.parent().height() ===
                      widgetBaseElement.height();
    if (baseWrapsParent) {
      targetElementTopPos = widgetBaseElement.offset().top +
                            Math.ceil(widgetBaseElement.height() / 4) + 2;
    }

    if (popoverConfig.listViewMulCurrentSteps) {

      var left = targetElementLeftPos + widgetBaseElement.width() / 2;

      if (widgetDialogTopPos > targetElementTopPos) {

        widgetDialog.css("top", targetElementBottomPos);
        targetElementBottomPos = widgetBaseElement.offset().top + widgetBaseElement.height();
        popoverContentEle.css("max-height", containerBottomPos - targetElementBottomPos);
        widgetDialogPointer.css({
          "position": "absolute",
          "left": left,
          "top": targetElementBottomPos - 10
        });

        widgetDialogPointer.removeClass("wfstatus-popover-arrow-left").addClass(
            "wfstatus-popover-arrow-up");

        setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                          1 > widgetBaseElement.offset().left;

      } else {

        var adjustPointer = false;
        if (widgetDialogTopPos < containerTopPos) {
          widgetDialog.css("top", containerTopPos);
          popoverContentEle.css("max-height", (widgetBaseElement.offset().top) - containerTopPos);

        } else if ((widgetDialogTopPos + widgetDialog.height()) > containerBottomPos) {
          widgetDialog.css("top", targetElementBottomPos);
          targetElementBottomPos = widgetBaseElement.offset().top + widgetBaseElement.height();
          popoverContentEle.css("max-height", containerBottomPos - targetElementBottomPos);
          widgetDialogPointer.css({
            "position": "absolute",
            "left": left,
            "top": (targetElementBottomPos / 2) - 1
          });
          widgetDialogPointer.removeClass("wfstatus-popover-arrow-right").addClass(
              "wfstatus-popover-arrow-up");
          adjustPointer = true;
        }

        if (!adjustPointer) {
          widgetDialogPointer.css({
            "position": "absolute",
            "left": left,
            "top": widgetBaseElement.offset().top - 1
          });
          widgetDialogPointer.removeClass("wfstatus-popover-arrow-right").addClass(
              "wfstatus-popover-arrow-down");
        }
      }

    } else {

      if (widgetDialogLeftPos < targetElementLeftPos) {
        widgetDialogPointer.css({
          "position": "absolute",
          "left": widgetDialogRightPos,
          "top": targetElementTopPos + 10
        });

        widgetDialogPointer.removeClass("wfstatus-popover-arrow-left").addClass(
            "wfstatus-popover-arrow-right");

        setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                          1 > widgetBaseElement.offset().left;
      } else {
        widgetDialogPointer.css({
          "position": "absolute",
          "left": widgetDialogLeftPos - 10,
          "top": targetElementTopPos + 10
        });
        widgetDialogPointer.removeClass("wfstatus-popover-arrow-right").addClass(
            "wfstatus-popover-arrow-left");

        setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                          1 < (widgetBaseElement.offset().left + widgetBaseElement.width());

      }

      var userPopoverOptions = popoverConfig.popoverView.userPopoverOptions,
          userPopoverSize    = userPopoverOptions.userPopoverSize;
      if (container.height() > userPopoverSize) {
        widgetDialog.css("max-height", userPopoverSize);
      } else {
        widgetDialog.css("max-height", container.height());
      }

      widgetDialogBottomPos = widgetDialogTopPos + widgetDialog.height();
      if (userPopoverOptions.assigneesLength === 2) {
        if (widgetDialogTopPos < targetElementTopPos || widgetDialogTopPos > containerTopPos) {
          widgetDialog.css("top", targetElementBottomPos - userPopoverSize);
        }
      } else if (userPopoverOptions.assigneesLength === 1) {
        if (widgetDialogBottomPos < targetElementBottomPos) {
          widgetDialog.css("top",
              widgetDialogTopPos + (targetElementBottomPos - widgetDialogBottomPos));
        }
      }

      widgetDialogTopPos = widgetDialog.offset().top;
      if (widgetDialogTopPos < containerTopPos) {
        widgetDialog.css("top", widgetDialogTopPos + (containerTopPos - widgetDialogTopPos));
      }

      widgetDialogTopPos = widgetDialog.offset().top;
      widgetDialogBottomPos = widgetDialogTopPos + widgetDialog.height();
      if (widgetDialogBottomPos > containerBottomPos) {
        widgetDialog.css("top", widgetDialogTopPos - (widgetDialogBottomPos - containerBottomPos));
        var widgetDialogPointerTopPos = widgetDialogPointer.offset().top;
        if ((widgetDialogPointerTopPos + 22) > containerBottomPos) {
          widgetDialogPointer.css("top",
              widgetDialogPointerTopPos - ((widgetDialogPointerTopPos + 22) - containerBottomPos));
        }
      }

      if (!popoverConfig.listViewMulCurrentSteps) {
        if (setDialogCenter) {
          widgetDialog.css({
            "left": $(window).width() / 2 - widgetDialog.width() / 2
          });
          widgetDialogPointer.css({
            "opacity": "0"
          });
        } else {
          widgetDialogPointer.css({
            "opacity": "1"
          });
        }
      }
    }
  }

  return {
    ShowPopOver: ShowPopOver,
    UnbindPopoverEvents : UnbindPopoverEvents
  };
});
