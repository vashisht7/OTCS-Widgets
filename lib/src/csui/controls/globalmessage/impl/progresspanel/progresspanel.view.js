/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',                             // Cross-browser utility belt
  'csui/lib/jquery',
  'csui/lib/marionette',                             // MVC application support
  'csui/utils/nodesprites',
  'i18n',
  'module',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/controls/globalmessage/impl/progresspanel/impl/nls/progresspanel.lang',  // Use localizable texts
  'hbs!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',     // Template to render the HTML
  'hbs!csui/controls/globalmessage/impl/progresspanel/impl/progressbar',       // Template to render the HTML
  'css!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',            // Stylesheet needed for this view
  'css!csui/controls/globalmessage/globalmessage_icons'
],  function (_, $, Marionette, NodeSprites, i18n, module, Base, PerfectScrollingBehavior, TabableRegionBehavior,
   lang, panelTemplate, barTemplate) {
  'use strict';

  var config = _.defaults({
    panelRefreshThrottle : 400 // This delay is calculated considering slide-in animation delay of progress panel list view
  }, module.config().csui);

  var BarStateValues = ["pending", "processing", "rejected", "resolved", "aborted", "stopped", "stopping", "finalizing"];
  
  var updateProgressArea = function (elem, info) {
    var errorElem = elem.find(".csui-progress-static-rejected");
    if (info.dynamic === undefined ? info.state === "processing" : info.dynamic) {
      var progressBar = elem.find(".binf-progress-bar");
      this.options.messageHelper.switchField(elem, ".csui-progress", "dynamic",
          ["static", "dynamic"]);
      var bytesOfSize = _.str.sformat(lang.BytesOfSize,
          Base.getReadableFileSizeString(info.count),
          Base.getReadableFileSizeString(info.total));
      elem.find(".csui-progress-text").text(bytesOfSize);
      progressBar.attr("aria-valuenow", info.percentage);
      progressBar.css("width", _.str.sformat("{0}%", info.percentage));
      elem.find(".csui-progress-dynamic .csui-percent").text(
          _.str.sformat("{0}%", info.percentage));
      elem.find('.csui-title').attr('aria-label',
          _.str.sformat("{0} {1}%", info.label, info.percentage));

    } else {
      this.options.messageHelper.switchField(elem, ".csui-progress", "static",
          ["static", "dynamic"]);
      this.options.messageHelper.switchField(elem, ".csui-progress-static", info.state,
          BarStateValues);
      var stateAriaLabel = _.str.sformat("{0} {1}", info.label,
          lang["State_" + info.state]);
      elem.find('.csui-title')
          .attr('aria-label', stateAriaLabel);
    }
    
    errorElem.text(info.errorMessage);
    errorElem.attr("title", info.errorMessage);
    if (info.errorMessage) {
      elem.addClass('csui-error');
    }
    this.options.messageHelper.switchField(elem, ".csui-stateaction", info.state,
        BarStateValues);

  };

  var getContainerName = function (model) {
    var container = model.uploadContainer || model.container;
    return container && container.get('name');
  };
  var isMultiContainer = function (models) {
    var firstFolder = getContainerName(models[0]),
    lastFolder = getContainerName(models.reduce(function(currentModel, nextmodel) {
      return (getContainerName(currentModel) === getContainerName(nextmodel)) ? currentModel : !nextmodel;
    }));
    return firstFolder !== lastFolder;
  };

  var ProgressBarView = Marionette.ItemView.extend({
    constructor: function ProgressBarView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
      var model = this.model;
      if (!!model.node && model.node.get('mime_type') === undefined) {
        model.node.set({
          container: false,
          type: model.node.get('type') || 144,
          mime_type: model.get('mime_type') || model.get('type')
        }, {silent: true});
      }
      this.listenTo(this.model, 'change',  _.throttle(this._updateItem, config.panelRefreshThrottle));
      this.listenTo(this.model, 'change:state', this._updateItem); //Update immediatly when state is changed
    },

    _updateItem: function () {
      var info = this._computeProgress(),
          elem = this.$el;
      updateProgressArea.call(this, elem, info);
    },

    _computeProgress: function () {
      var count      = this.model.get('count'),
          total      = this.model.get('total'),
          state      = this.model.get("state"),
          percentage = (total > 0 && count >= 0) ? Math.floor(count / total * 100) : 0;
      if (percentage === 100 && state === 'processing') {
        state = 'finalizing';
        this.model.set({state : state});
        if (this.$el.find('.csui-name-status button').not(".binf-hidden").is(':focus')) {
          this.ui.itemRow.trigger('focus');
        }
        this.$el.find(".csui-stateaction-processing").addClass('binf-hidden');
      }
      return {
        count: count,
        total: total,
        percentage: percentage,
        state: state,
        errorMessage: this.model.get("errorMessage"),
        label: _.str.sformat("{0} {1}", this.options.oneFilePending, this.getItemLabel())
      };
    },

    className: "csui-progressbar csui-progressrow",

    template : barTemplate,
    
    getItemLabel: function () {
      return this.model.get('newName') || this.model.get('name');
    },

    templateHelpers: function () {
      var info        = this._computeProgress(),
          model       = this.model,
          singleItem  = this.collection.length === 1,
          name        = this.getItemLabel(),
          cancelAria  = _.str.sformat(lang.CancelAria, name),
          commandName = !!model.get('commandName') || model.get('commandName'),
          targetLocation = !this.options.hideGotoLocationMultiSet && 
                            !!model.get('location') ? model.get('targetLocation') : undefined;
      info.name = name;
      info.enableCancel = this.options.enableCancel;
      info.type_icon_class = this.model.node ? NodeSprites.findClassByNode(this.model.node) : "";
      BarStateValues.forEach(function (value) {
        info["state_" + value] = lang["State_" + value];
      });
      info.cancel = lang.Cancel;
      info.cancelAria = cancelAria;
      info.expand = lang.Expand;
      info.collapse = lang.Collapse;
      info.close = lang.Close;
      info.singleItem = singleItem;
      info.minimize = lang.minimize;
      info.minimizeAria = lang.minimizeAria;
      info.retry = lang.Retry;
      info.gotoLocation = lang.GotoLocationLinkLabel;
      info.targetLocationUrl = targetLocation ? targetLocation.url : undefined;
      info.enableRetry = config.enableRetry;
      return info;
    },

    onRender: function () {
      this._updateItem();
    },

    ui: {
      pendingAction: '.csui-stateaction-pending',
      processingAction: '.csui-stateaction-processing',
      error: '.csui-error',
      retryContainer: '.csui-show-retry',
      retryButton: '.csui-showRetry',
      gotoLocationElem: '.csui-gotolocation-url',
      cancelButton : '.csui-name-status button',
      itemRow : '.csui-name-status'
    },

    events: {
      'click @ui.pendingAction': 'doCancel',
      'click @ui.processingAction': 'doCancel',
      'keydown @ui.pendingAction': 'handleKeydownOnCancel',
      'keydown @ui.processingAction': 'handleKeydownOnCancel',
      'click @ui.retryButton': 'processRetry',
      'keydown @ui.retryButton': 'processRetry',
      'click @ui.gotoLocationElem' : 'hanldleClickGotoLocation',
      'keydown' : 'handleKeydownEvent'
    },

    setFocus: function () {
      this.$el.addClass('focused-row');
      var button = this.$el.find('button').not(".binf-hidden");
      if (button.length !== 0) {
        button.trigger('focus');
        return button;
      } else {
        this.ui.itemRow.trigger('focus');
        return this.ui.itemRow;
      }
    },

    removeFocus: function () {
      this.$el.removeClass('focused-row');
    },

    doCancel: function () {
      this.model.abort();
    },

    handleKeydownOnCancel: function (event) {
      if ((event.keyCode === 32 || event.keyCode === 13) && this.ui.cancelButton.not(".binf-hidden").is(':focus')) {
        this.ui.itemRow.trigger('focus');
        this.doCancel();
      }
    },

    processRetry: function (event) {
      if ((event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) || (event.type === 'click')) {
       this.model.trigger("try:again");
      }
    },

    showGotoLocationElem: function () {
      this.ui.gotoLocationElem && this.ui.gotoLocationElem.removeClass("binf-hidden");
    },

    showRetryElem: function () {
      if (config.enableRetry && !!this.model.get('serverFailure')) {
        this.ui.retryContainer.removeClass("binf-hidden");
      }
    },

    handleKeydownEvent: function (event) {
      if (event.keyCode === 38 || event.keyCode === 40) {
        this.trigger("keydown:item", event);
      }
    },

    hanldleClickGotoLocation: function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.trigger("click:gotolocation");
    },

    handleProgressComplete : function () {
      this.showGotoLocationElem();
      this.showRetryElem();
    }

  });

  var ProgressPanelView = Marionette.CompositeView.extend({
    constructor: function ProgressPanelView(options) {
      options || (options = {});
      this.focusChildIndex = -1;
      this.currentFocusIndex = 0;
      this.loadingCount = 0;
      _.defaults(options, {
        oneFileSuccess: lang.UploadOneItemSuccessMessage,
        multiFileSuccess: lang.UploadManyItemsSuccessMessage,
        oneFilePending: lang.UploadingSingleItem,
        oneFileFinalizing: lang.FinalizingSingleItem,
        multiFilePending: lang.UploadingItems,
        oneFileFailure: lang.UploadOneItemFailMessage,
        multiFileFailure: lang.UploadManyItemsFailMessage,
        someFileSuccess: lang.UploadSomeItemsSuccessMessage,
        someFilePending: lang.UploadingSomeItems,
        someFileFailure: lang.UploadSomeItemsFailMessage2,
        oneItemStopped: lang.UploadingOneItemStopped,
        allItemsStopped: lang.UploadingAllItemsStopped,
        someItemsStopped: lang.UploadSomeItemsStopped,
        locationLabelPending : lang.UploadingLocation,
        locationLabelCompleted: lang.UploadedLocation,
        enableCancel: true,
        isLoadTimeAvailable: false,
        stoppingLabel : lang.State_stopping
      });
      if (options.enableCancel) {
        this.panelStateValues = ["resolved", "rejected", "aborted", "processing"];
      }
      else {
        this.panelStateValues = ["resolved", "rejected", "aborted"];
      }
      Marionette.CompositeView.prototype.constructor.call(this, options);

      if (options.context && options.nextNodeModelFactory) {
        this._nextNode = options.context.getModel(options.nextNodeModelFactory);
      }
      this.listenTo(this.collection, 'change',  this._updateHeader);
      this.listenTo(this.collection, 'sort', this.setLocationName);
      this.originatingView = options.originatingView;
      if (!!this.originatingView) {
        this.originatingView.trigger('global.alert.inprogress');
      }
      this.isMultiContainer = isMultiContainer(this.collection.models);
      this.setLocationName();
    },

    onDestroy: function () {
      this.handleProgressComplete();
      this.focusChildIndex = -1;
      this.focusingOnList = false;
      this.currentFocusIndex = 0;
      this.trigger('tabable:not');
    },

    handleProgressComplete: function (allFailures) {
      this.originatingView && this.originatingView.trigger('global.alert.completed');
      this.parentView && this.parentView.trigger('processing:completed');
      if (!allFailures) {
        this.ui.gotoLocationElem && this.ui.gotoLocationElem.removeClass('binf-hidden');
        this.children.invoke('showGotoLocationElem');
      }
      this.children.invoke('handleProgressComplete');
      setTimeout(_.bind(function () {
         $(this.$el).trigger('focus');
      }, this), 10);
      
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '> .csui-items-wrapper',
        suppressScrollX: true
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    isProgressFailed: function () {
      return $.inArray(this.state, ['rejected']) !== -1;
    },

    isProgressCompleted: function () {
      return $.inArray(this.state, ['resolved', 'rejected', 'aborted', 'stopped', 'stopping']) !== -1;
    },

    isProgressFinalizing: function () {
      return $.inArray(this.state, ['stopping']) !== -1;
    },

    getLocalizedLocation: function(model) {
      var langForStatus = this.isProgressCompleted() ? this.options.locationLabelCompleted : this.options.locationLabelPending;
      return _.str.sformat(langForStatus, getContainerName(model));
    },

    setLocationName: function() {
      var bundleNumber, location, currentLocation,
      self = this;
      this.collection.forEach(function(model) {
        if (model.get('bundleNumber') === bundleNumber) {
          model.unset('location');
          model.unset('bundleDivider');
        } else {
          model.set({bundleDivider : true},{silent: true}); // Show seperation between every bundle
          bundleNumber = model.get('bundleNumber');
          currentLocation = getContainerName(model);
          if (currentLocation === location) {
            model.unset('location');
          } else {
            self.isMultiContainer && model.set({location : self.getLocalizedLocation(model)}, {silent: true}); //Location is shown only when upload is happening from multiple folder
            location = currentLocation;
          }
        }
      });
      this.collection.reset(this.collection.models);
    },

    updateProgressPanel: function (failedCount) {
      var notificationIcon, allFailures;      
      if (this.isProgressFailed()) {
        this.parentView && this.parentView.trigger('processing:error');
        notificationIcon = 'csui-global-error';
        allFailures = failedCount === this.collection.length;
      } else {
        notificationIcon = 'csui-global-success';
      }
      this.$el.addClass(notificationIcon);
      this.ui.processingAction.addClass('binf-hidden');
      this.ui.closeAction.parent('.csui-close').removeClass('binf-hidden');
      this.ui.header.find('.csui-minimize').addClass('binf-hidden');
      this.ui.header.find('.csui-progress').addClass('binf-hidden');
      this._isRendered && this.collection.sort();
      this.handleProgressComplete(allFailures);
      this.showretryAll();
      this.currentlyFocusedElement().trigger('focus');
    },

    showretryAll: function () {
      if (config.enableRetry && this.showretryAllElem) {
        this.ui.retryAll.removeClass('binf-hidden');
      }
    },

    showProgressBar: function (show) {
      if(show) {
        this.ui.progressBar.removeClass('binf-hidden');
        this.ui.loadingDots.addClass('binf-hidden');
      } else {
        this.ui.progressBar.addClass('binf-hidden');
        this.ui.loadingDots.removeClass('binf-hidden');
      }
    },

    _updateHeader: function () {
      var info = this._computeProgress(),
      options = this.options;
      this.state = info.state;
      this.showProgressBar(info.isLoadTimeAvailable);
      switch (info.state) {
        case 'pending': 
        case 'processing':
          info.label = this._getFormatString(options.oneFilePending, options.multiFilePending, this.collection.length);
          break;
        case 'resolved':
          info.label = this._getFormatString(options.oneFileSuccess, options.multiFileSuccess, this.collection.length);
          break;
        case 'stopping':
          info.label = options.stoppingLabel;
          break;
        case 'stopped':
          info.label = this._getFormatString(options.oneItemStopped, options.someItemsStopped);
          break;
        case 'aborted':
          info.label = this._getFormatString(options.oneItemStopped, options.allItemsStopped, this.collection.length);
          break;
        case 'finalizing':
          info.label = this._getFormatString(options.oneFileFinalizing, options.multiFilePending, this.collection.length);
          break;
        default:
          info.label = this._getFormatString(options.oneFileFailure, options.multiFileFailure, info.failed);
      }
      if (info.dynamic === undefined ? info.state === "processing" : info.dynamic) {
        if (info.state === "processing") {
         this.$el.attr('aria-label', _.str.sformat("{0} {1}%", info.label, info.percentage));
        } else {
          this.$el.attr('aria-label', info.label);
        }
      } else {
        var stateAriaLabel = _.str.sformat("{0} {1}", info.label,
        lang["State_" + info.state]);
        this.$el.attr('aria-label', stateAriaLabel);
      }
      this.ui.header.find(".csui-title").text(info.label);
      !this.isProgressFinalizing() && this.isProgressCompleted() && this.updateProgressPanel(info.failed); // Apply styles for progressPanel progress completion
      updateProgressArea.call(this, this.ui.header, info);
      
      if(this.collection.length === 1 && info.state === "rejected") {
        this.ui.expandIcon.removeClass('binf-hidden');
      } else {
        this.$el.find(".csui-items-wrapper .csui-names-progress").removeClass('binf-hidden');
      }
    
      if (!this.options.allowMultipleInstances) {
        this.ui.minimizeButton.parent(".csui-minimize").addClass('binf-hidden');
      } else {
        if(this.parentView) {
          this.parentView.trigger('processbar:update', info.percentage);
        }
        if (info.state === 'processing') {
          this.ui.minimizeButton.parent(".csui-minimize").removeClass('binf-hidden');
        }
      }
      if (!this.stateExpandCollapse) {
        var arrow = this.ui.header.find(".csui-expand").find(":not(.binf-hidden)");
        if (arrow.hasClass("csui-expand-up")) {
          this.doExpand(false);
        } else if (arrow.hasClass("csui-expand-down")) {
          this.doCollapse(false);
        }
      }
      var isempty = !this.collection || this.collection.length === 0;
      if (this.$el.hasClass("csui-empty")) {
        if (!isempty) {
          this.$el.removeClass("csui-empty");
        }
      } else {
        if (isempty) {
          this.$el.addClass("csui-empty");
        }
      }
    },

    _getFormatString: function (str1, str2, count) {
      var formattedString, fileName;
      if (this.collection.length === 1) {
        fileName = this.collection.models[0].get('newName') || this.collection.models[0].get('name');
        formattedString = _.str.sformat(str1, fileName);
      } else {
        formattedString = _.str.sformat(str2, count);
      }
      return formattedString;
    },

    _computeProgress: function () {
      var allDone    = true,
          processing = false,
          allAborted = true,
          stopped    = false,
          finalizing = false,
          failed     = 0,
          aborted    = 0,
          count      = 0,
          total      = 0;
      var self = this;
      this.collection.forEach(function (item) {
        count += item.get('count');
        total += item.get('total');
        
        if (item.get("state") === "stopped") {
          stopped = true;
        }
        if (item.get("state") === "aborted") {
          ++aborted;
        }
        if (item.get("state") === "processing") {
          self.loadingCount += item.get('count');
        }
        if (item.get("state") === "pending" || item.get("state") === "processing" || item.get("state") === "finalizing") {
          allDone = false;
        }
        if (item.get("state") !== "pending") {
          processing = true;
        }
        if (item.get("state") === "rejected") {
          ++failed;
          item.set({sequence : 2}, {silent: true});
          self.showretryAllElem = !!item.get('serverFailure'); 
        }
        if (item.get("state") === "resolved" || item.get("state") === "rejected") {
          allAborted = false;
        }
      });
      
      var percentage = (total > 0) ? Math.floor(count / total * 100) : 0;
      if (percentage === 100 && !allDone) {
        percentage = 99;
        finalizing = true;
      }
      var state   = allDone ? failed ? "rejected" : stopped || aborted ? allAborted ? "aborted" : "stopped" : "resolved" :
                    stopped ? "stopping" : finalizing ? "finalizing" : processing ? "processing" : "pending",
          dynamic = state !== "pending";
      return {
        count: count,
        total: total,
        failed: failed,
        percentage: percentage,
        state: state,
        dynamic: dynamic,
        isLoadTimeAvailable : this.loadingCount > 0
      };
    },
    className: 'csui-progresspanel',

    childView: ProgressBarView,
    childViewContainer: ".csui-items",
    childEvents: {
      'click:gotolocation': 'navigateToLocation',
      'keydown:item': 'onChildViewKeydown'
    },
    childViewOptions: function () {
      return _.extend(this.options, {
        enableCancel: this.options.enableCancel,
        messageHelper: this.options.messageHelper,
        reorderOnSort : true,
        parentView: this
      });
    },
    template: panelTemplate,

    templateHelpers: function () {
      var targetLocation, 
      targetLocationUrl,
      info = this._computeProgress(),
      singleItem = this.collection.length === 1;
      if (!this.options.hideGotoLocationSingleSet && !this.isMultiContainer) {
        targetLocation = this.collection.models[0].get('targetLocation');
        targetLocationUrl = targetLocation && targetLocation.url;
      }
      BarStateValues.forEach(function (value) {
        info["state_" + value] = lang["State_" + value];
      });
      this.panelStateValues.forEach(function (value) {
        info["stateaction_" + value] = lang["StateAction_" + value];
        info["stateaction_all_" + value] = lang["StateAction_all_" + value];
      });
      info.cancel = lang.Cancel;
      info.enableCancel = this.options.enableCancel,
      info.expand = lang.Expand;
      info.collapse = lang.Collapse;
      info.close = lang.Close;
      info.closeAria = lang.CloseAria;
      info.processing = (info.state === "processing") ? true : false;
      info.progressTitleId = _.uniqueId("progressTitle");
      info.singleItem = singleItem;
      info.enableMinimiseButton = this.options.enableMinimiseButton;
      info.minimize = lang.minimize;
      info.minimizeAria = lang.minimizeAria;
      info.gotoLocation = lang.GotoLocationLinkLabel;
      info.retryAll = lang.RetryAll;
      info.enableRetry = config.enableRetry;
      return _.extend(info, {
        targetLocationUrl: targetLocationUrl
      });
    },

    onRender: function () {
      this.$el.attr('tabindex','0');
      this.$el.attr('role', 'dialog');
      this.currentlyFocusedElement();
      this._updateHeader();
      this.collection.comparator = function (currentModel , nextModel) {
        if(currentModel.get('bundleNumber') === nextModel.get('bundleNumber')) {
          return nextModel.get('sequence') - currentModel.get('sequence');
        }
      };
    },

    ui: {
      header: '.csui-header',
      progressBar : '.csui-header .binf-progress',
      loadingDots : '.csui-header .loading-dots',
      pendingAction: '.csui-header .csui-stateaction-pending',
      processingAction: '.csui-header .csui-stateaction-processing',
      closeAction: '.csui-header .csui-close button',
      collapseAction: '.csui-header .csui-expand-up',
      expandAction: '.csui-header .csui-expand-down',
      minimizeButton: '.csui-header .csui-minimize .icon-progresspanel-minimize',
      expandIcon: '.csui-header .csui-expand',
      gotoLocationElem : '.csui-gotolocation-url',
      retryAll: '.csui-show-retryAll',
      childContainer: '.csui-items'
    },

    events: {
      'click @ui.pendingAction': 'doCancel',
      'click @ui.processingAction': 'doCancel',
      'click @ui.closeAction': 'doClose',
      'keydown @ui.closeAction': 'handleKeydownOnClose',
      'click @ui.collapseAction': 'doCollapse',
      'click @ui.expandAction': 'doExpand',
      'keydown @ui.expandAction': 'handleKeydownOnExpand',
      'click @ui.minimizeButton': '_doProcessbarMinimize',
      'keydown @ui.minimizeButton': 'onKeyInViewMinimize',  
      'click @ui.gotoLocationElem': 'handleGotoLocationClick',
      'keydown @ui.gotoLocationElem': 'handleGotoLocationClick',
      'click @ui.retryAll': 'processRetryAll',
      'keydown @ui.retryAll': 'processRetryAll',
      'keydown': 'onKeyInParentView'
    },

    doCancel: function () {
      this.collection.abort('stopped');
      this.ui.processingAction.addClass('binf-hidden');
    },

    doCollapse: function (animated) {
      this.$el.removeClass('csui-expanded');
      animated = (animated === false) ? false : true;
      var items = this.$el.find(".csui-items");
      items.find('.focused-row').removeClass('focused-row');
      this.options.messageHelper.switchField(this.$el.find(".csui-header"),
        ".csui-expand", "down",
        ["up", "down"]);
      this.options.messageHelper.collapsePanel(this, items, items, animated);
      this.stateExpandCollapse = "collapsed";
      this.$el.find('.csui-expand-down').trigger('focus');
      this.focusChildIndex = -1;
      this.focusingOnList = false;
    },

    doExpand: function (animated) {
      var items = this.$el.find(".csui-items"),
        event = animated,
        self = this;
      animated = (animated === false) ? false : true;
      this.options.messageHelper.switchField(this.$el.find(".csui-header"),
        ".csui-expand", "up",
        ["up", "down"]);
      this.options.messageHelper.expandPanel(this, items, items, animated);
      this.stateExpandCollapse = "expanded";
      this.$el.one(this.options.messageHelper.transitionEnd(), function () {
        self.trigger('ensure:scrollbar');
        self.$el.addClass('csui-expanded');
      });
      if (event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) {
        items.find('.focused-row').removeClass('focused-row');
        setTimeout(function() {
          self.children.findByIndex(0).setFocus();
        });
        this.focusChildIndex = 0;
        this.focusingOnList = true;
      } else {
        this.ui.collapseAction.trigger('focus');
      }
    },

    handleKeydownOnExpand: function (event) {
      if(event.type === "keydown" && (event.keyCode === 13 || event.keyCode === 32)) {
        this.doExpand(event);
      }
    },

    handleKeydownOnCollapse: function (event) {
      if(event.type === "keydown" && (event.keyCode === 13 || event.keyCode === 32)) {
        this.doCollapse(event);
      }
    },

    onKeyInViewMinimize: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        this._doProcessbarMinimize();
      }
    },

    onKeyInParentView: function(event) {
      var focusChanged = false;
      switch(event.keyCode) {
        case 9: // TAB
        var allFocusableElements = this._getAllFocusableElements(),
        activeElement = this.currentlyFocusedElem.length > 0 ? this.currentlyFocusedElem : document.activeElement;
        if(activeElement === allFocusableElements[0][0]) {
          this.currentFocusIndex = 0;
        }
        if (this.ui.childContainer.has(event.target).length) {
          if (event.shiftKey) {
            this.currentFocusIndex = allFocusableElements.length - 1;
            this.focusingOnList = false;
            focusChanged = true;
          }
        } else {
          var nextFocus = this.currentFocusIndex;
          if (event.shiftKey) {
            nextFocus -- ;
          } else {
            nextFocus ++ ;
          }
          if (nextFocus >= 0 && nextFocus < allFocusableElements.length) {
            this.currentFocusIndex = nextFocus;
            focusChanged = true;
          } else if (nextFocus === allFocusableElements.length && this.focusChildIndex >= 0) {
            focusChanged = true;
            this.focusingOnList = true;
          }
        }
        break;
      }

      if (focusChanged) {
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement();
        $(this.currentlyFocusedElem).trigger('focus');
        this.$el.find('.focused-row') && this.$el.find('.focused-row').removeClass('focused-row');
        return false;
      }
    },

    onChildViewKeydown: function (childview, event) {
      var nextFocusIndex = this.focusChildIndex;
      switch (event.keyCode) {
        case 40: //arrow down
        nextFocusIndex < (this.children.length - 1) && ++nextFocusIndex;
          break;
        case 38: //arrow up
          nextFocusIndex > 0 && --nextFocusIndex;          
          break;
      }
      if (nextFocusIndex < 0 || nextFocusIndex >= this.children.length) {
        return;
      }
      if (this.focusChildIndex >= 0 ){
        this.children.findByIndex(this.focusChildIndex).removeFocus();
      }
      this.focusChildIndex = nextFocusIndex;
      this.children.findByIndex(this.focusChildIndex).setFocus();
      this.trigger('changed:focus', this);
      return false;
    },

    _doProcessbarMinimize: function () {
      this.$el.addClass('binf-hidden');
      this.parentView.trigger('processbar:minimize');
    },

    doShow: function (relatedView, parentView) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
      this.parentView = parentView;
      this.parentView.trigger('processbar:finished');
      this.listenTo(this.parentView, 'processbar:maximize', function () {
        if (!this.isDestroyed) {
          this.$el.removeClass('binf-hidden');
          this.ui.minimizeButton.trigger("focus");
        }
      });
      this.doResize();
      this.$el.trigger('globalmessage.shown', this);
      this.trigger('dom:refresh');
      this.$el.trigger('focus');
    },

    currentlyFocusedElement: function () {
        if(this.isDestroyed){
          return $();
        }
        if (this.focusingOnList && this.focusChildIndex >= 0) {
          this.currentlyFocusedElem = this.children.findByIndex(this.focusChildIndex).setFocus();
        } else  {
          var allFocusableElements = this._getAllFocusableElements();
          this.currentlyFocusedElem = $(allFocusableElements[this.currentFocusIndex]);
        } 
        return this.currentlyFocusedElem;
      },

    _getAllFocusableElements: function() {
      var allFocusableElements = this.ui.header.find("*[tabindex]:visible").toArray();
       allFocusableElements.unshift(this.$el);
       return allFocusableElements;
    },

    doClose: function () {
      var self = this, panel = _.extend({
        csuiAfterHide: function () {
          self.destroy();
          if (self.isProgressFailed()) {
            self.trigger('escaped:focus');
          }
          this.parentView.trigger('processbar:finished');
        }
      }, this);
      this.options.messageHelper.fadeoutPanel(panel);
    },

    handleKeydownOnClose: function () {
      if(event.type === "keydown" && (event.keyCode === 13 || event.keyCode === 32)) {
        this.doClose(event);
      }
    },

    doResize: function () {
      if (this.options.sizeToParentContainer) {
        var minWidth = parseInt(this.$el.css('min-width'), 10);
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        this.uncompressedMinWidth || (this.uncompressedMinWidth = minWidth);
        if (this.uncompressedMinWidth > parentWidth) {
          this.$el.addClass('compressed');
        }
        else {
          this.$el.removeClass('compressed');
        }
        var newWidth = this.$el.width();
        var translateX = (parentWidth - newWidth) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    },

    handleGotoLocationClick: function(event) {
      if ((event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) || (event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();
        this.navigateToLocation();
      }
    },

    navigateToLocation: function (chidlView) {
      var model = chidlView ? chidlView.model : this.collection.models[0];
      var targetLocation = model.get('targetLocation');
      if (targetLocation && this._nextNode) {
        this._nextNode.set('id', targetLocation.id);
      }
      this.doCollapse();
    },
    processRetryAll: function (event) {
      if ((event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13)) || (event.type === 'click')) {
        this.trigger('retry:all');
      }
    }
  });
  return ProgressPanelView;

});
