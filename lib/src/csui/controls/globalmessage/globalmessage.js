/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/messagehelper', 'csui/utils/accessibility',
  'csui/controls/globalmessage/impl/progresspanel/progresspanel.view',
  'csui/controls/globalmessage/impl/messagedialog.view',
  'csui/controls/globalmessage/impl/custom.wrapper.view',
  'csui/controls/globalmessage/impl/loaderpanel/loaderpanel.view',
  'csui/dialogs/modal.alert/modal.alert'
], function (module, _, $, Backbone, MessageHelper, Accessibility, ProgressPanelView,
   MessageView, CustomWrapperView, LoaderPanelView, ModalAlert) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    enablePermanentHeaderMessages: false
  });

  if (Accessibility.isAccessibleMode()) {
    config.enablePermanentHeaderMessages = true;
  }

  var messageHelper = new MessageHelper(),
      globals       = {},
      hasDefaultRegion;

  var GlobalMessage = {

    setMessageRegionView: function (messageRegionView, options) {
      this._cleanupPreviousMessageRegion();
      options = _.defaults({}, options, {
        useClass: true,
        sizeToParentContainer: true
      });
      options.classes && (globals.classNames = options.classes);
      options.enableMinimiseButtonOnProgressPanel && (globals.enableMinimiseButtonOnProgressPanel = options.enableMinimiseButtonOnProgressPanel);
      globals.relatedView = options.useClass ? undefined : messageRegionView;
      globals.sizeToParentContainer = options.sizeToParentContainer;
      globals.messageRegionView = messageRegionView;
      if (globals.messageRegionView && globals.fileUploadCollection &&
          globals.progressPanel) {
        globals.progressPanel = this._makeProgressPanel();
      }
    },

    setFileUploadCollection: function (fileUploadCollection) {
      globals.fileUploadCollection = fileUploadCollection;
      if (globals.progressPanel) {
        if (globals.fileUploadCollection) {
          globals.progressPanel = this._makeProgressPanel();
        } else {
          this.hideFileUploadProgress();
        }
      }
    },

    hideFileUploadProgress: function () {
      if (globals.progressPanel) {
        globals.progressPanel.doClose();
        globals.progressPanel.destroy();
        globals.progressPanel = undefined;
      }
    },

    showFileUploadProgress: function (fileUploadCollection, options) {
      console.warn('this method has been deprecated! please use showProgressPanel.');
      this.showProgressPanel(fileUploadCollection, options);
    },

    showProgressPanel: function (fileUploadCollection, options) {
      if (fileUploadCollection) {
        if (!globals.fileUploadCollection) {
          globals.fileUploadCollection = fileUploadCollection;
        }

        if (globals.progressPanel && 
          globals.progressPanel.options.actionType === options.actionType &&
          !globals.progressPanel.isProgressCompleted()) {
          globals.fileUploadCollection.add(fileUploadCollection.models);
        } else {
          this.hideFileUploadProgress();
          globals.fileUploadCollection = fileUploadCollection;
        }

        globals.progressPanel = this._makeProgressPanel(_.extend(options, {
          enableMinimiseButton : globals.enableMinimiseButtonOnProgressPanel
        }));
        globals.progressPanel.doShow(globals.relativeView, globals.messageRegionView);
      }
    },

    isActionInProgress : function (actionType, message, title) {
      var inProgress = false, status;
      if (globals.progressPanel &&
        !globals.progressPanel.isProgressCompleted() &&
        globals.progressPanel.options.actionType !== actionType) {
          inProgress = true;
          ModalAlert.showError(message, title);
      }
      return inProgress;
    },

    showPermissionApplyingProgress: function (permissionAppliedCollection, options) {
      if (permissionAppliedCollection) {
        globals.permissionAppliedCollection = permissionAppliedCollection;
        globals.progressPanel = this.__makePermissionProgressPanel(options);
      }

      if (!globals.progressPanel || permissionAppliedCollection) {
        globals.progressPanel = this._makeProgressPanel(options);
      }
      if (globals.progressPanel) {
        globals.progressPanel.doShow(globals.relativeView, globals.messageRegionView);
      }
    },

    showLoader: function (xhr, options) {
      this.hideFileUploadProgress();
      if (!globals.loaderPanel) {
        globals.loaderPanel = this._makeLoaderPanel(_.extend({xhr: xhr}, options));
      } else {
        globals.loaderPanel.doShow(globals.relativeView, globals.messageRegionView, xhr);
      }
      globals.loaderPanel.listenTo(globals.loaderPanel, 'destroy', function (args) {
        options.onDestroy && options.onDestroy(args);
        globals.loaderPanel = undefined;
      });
      xhr && xhr.always(function (resp) {
        globals.loaderPanel && globals.loaderPanel.destroy();
        options.onDestroy && options.onDestroy(resp);
        globals.loaderPanel = undefined;
      });
    },

    changeLoaderMessage: function (message, xhr) {
      if (globals.loaderPanel) {
        globals.loaderPanel.$el.find("#csui-zipanddownload-stage").text(message);
        globals.loaderPanel.updateXHRReference(xhr);
      }
    },
    showMessage: function (info, text, details, options) {
      return this._showMessageView(MessageView,
          _.extend({
            info: info,
            message: text,
            details: details,
            messageHelper: messageHelper,
            sizeToParentContainer: globals.sizeToParentContainer,
            enablePermanentHeaderMessages: config.enablePermanentHeaderMessages
          }, options)
      );
    },

    showCustomView: function (customView) {
      return this._showMessageView(CustomWrapperView, {
        contentView: customView,
        messageHelper: messageHelper
      });
    },

    _showMessageView: function (View, options) {
      this._ensureMessageRegion();
      var messageView = messageHelper.activatePanel(
          messageHelper.createPanel(globals, View, options),
          globals.relatedView, globals.messageRegionView);
      this._addEventHandlers(messageView);
      return messageView;
    },

    _makeProgressPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        collection: globals.fileUploadCollection,
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var progressPanel = messageHelper.activatePanel(
        messageHelper.createPanel(globals, ProgressPanelView, options,
            globals.progressPanel),
        globals.relatedView, globals.messageRegionView, globals.progressPanel);
      this._addEventHandlers(progressPanel);
      return progressPanel;
    },

    __makePermissionProgressPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        collection: globals.permissionAppliedCollection,
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var progressPanel = messageHelper.activatePanel(
        messageHelper.createPanel(globals, ProgressPanelView, options,
            globals.progressPanel),
        globals.relatedView, globals.messageRegionView, globals.progressPanel);
      this._addEventHandlers(progressPanel);
      return progressPanel;
    },

    _makeLoaderPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var loaderPanel = messageHelper.activatePanel(
          messageHelper.createPanel(globals, LoaderPanelView, options, globals.progressPanel),
          globals.relatedView, globals.messageRegionView, globals.progressPanel
      );
      this._addEventHandlers(loaderPanel);
      return loaderPanel;
    },

    _addEventHandlers: function (view) {
      var resizeHandler = function () {
        messageHelper.resizePanel(view, globals.relatedView);
      };
      $(window).on('resize', resizeHandler);
      view.listenTo(globals.messageRegionView, 'resize', resizeHandler);
      view.once('before:destroy', function () {
        $(window).off('resize', resizeHandler);
        view.stopListening(globals.messageRegionView, 'resize', resizeHandler);
      });
    },

    _ensureMessageRegion: function () {
      if (globals.messageRegionView) {
        return;
      }
      var modalContainer   = $.fn.binf_modal.getDefaultContainer(),
          messageContainer = $('<div>', {
            'style': 'position:absolute; top: 0; left: 0; width: 0; height: 100vh;'
          }).appendTo(modalContainer);
      globals.messageRegionView = new Backbone.View({el: messageContainer});
      hasDefaultRegion = true;
    },

    _cleanupPreviousMessageRegion: function () {
      if (hasDefaultRegion) {
        globals.messageRegionView.remove();
        hasDefaultRegion = false;
      }
      if (globals.progressPanel) {
        globals.progressPanel.destroy();
      }
      globals = {};
    }

  };

  return GlobalMessage;

});
