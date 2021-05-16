/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/jquery',
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/perspective.panel/perspective.with.breadcrumb.factory',
  'csui/controls/progressblocker/blocker',
  'csui/utils/commandhelper',
  'csui/controls/perspective.panel/perspective.animator',
  'css!csui/controls/perspective.panel/impl/perspective.panel',
  'csui/lib/jquery.redraw', 'csui/lib/jquery.scrollbarwidth'
], function (require, module, $, _, Marionette, base, PerspectiveWithBreadcrumbFactory,
    BlockingView, CommandHelper, PerspectiveAnimator) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    progressWheel: true,
    waitForData: true,
    perspectiveShowDelay: 0,
    limitTimeToWaitForData: true,
    maximumTimeToWaitForData: 1000,
    detachableBlockingView: true
  });

  if (!config.waitForData) {
    config.perspectiveShowDelay = 0;
  }

  var pageUnloading = false;
  $(window).on('beforeunload.' + module.id, function (event) {
    pageUnloading = true;
  });

  var PerspectivePanelView = Marionette.ItemView.extend({
    className: 'cs-perspective-panel',

    template: false,

    constructor: function PerspectivePanelView() {
      Marionette.View.prototype.constructor.apply(this, arguments);
      _.defaults(this.options, {
        progressWheel: config.progressWheel,
        waitForData: config.waitForData,
        perspectiveShowDelay: config.perspectiveShowDelay,
        limitTimeToWaitForData: config.limitTimeToWaitForData,
        maximumTimeToWaitForData: config.maximumTimeToWaitForData,
        detachableBlockingView: config.detachableBlockingView
      });
      var context = this.options.context;
      this.perspectiveFactory = this.options.perspectiveFactory ||
                                new PerspectiveWithBreadcrumbFactory({
                                  context: context
                                });
      this.perspectiveAnimator = new PerspectiveAnimator(this);
      BlockingView.imbue(this);
      this.blockingView.makeGlobal(this.options.detachableBlockingView);

      this.listenTo(context, "maximize:widget", this._addMaximizedWidget);
      this.listenTo(context, "restore:widget:size", this._removeMaximizedWidget);

      this.listenTo(context, 'change:perspective', this.onChangePerspective);

      this.listenTo(context, 'enter:edit:perspective', this.onEnterEditPerspective);
      this.listenTo(context, 'exit:edit:perspective', this.onExitEditPerspective);
      this.listenTo(context, 'serialize:perspective', this.onSerializePerspective);
      if (this.options.progressWheel) {
        var fetchTimeout;
        this
            .listenTo(context, 'request:perspective', this._startPerspectiveLoading)
            .listenTo(context, 'error:perspective', this._finishPerspectiveLoading)
            .listenTo(context, 'request', function () {
              if (this.options.waitForData) {
                this._startPerspectiveLoading();
              }
              if (this.options.limitTimeToWaitForData) {
                fetchTimeout = setTimeout(function () {
                  fetchTimeout = undefined;
                  this._finishPerspectiveLoading();
                }.bind(this), this.options.maximumTimeToWaitForData);
              }
            })
            .listenTo(context, 'sync error', function () {
              if (fetchTimeout) {
                clearTimeout(fetchTimeout);
                fetchTimeout = undefined;
              }
              this._finishPerspectiveLoading();
            });
      }
      this.listenTo(this, 'render', this.onRendered);

      this._maximizedWidgets = {};
      this._currentPespectiveStack = [];
      this._currentPerspectiveSignature = undefined;
    },

    _startPerspectiveLoading: function () {
      if (!this.actionsBlocked) {
        this.actionsBlocked = true;
        this.blockActions();
      }
    },

    _finishPerspectiveLoading: function () {
      if (this.actionsBlocked) {
        this.actionsBlocked = false;
        this.unblockActions();
      }
    },

    onEnterEditPerspective: function (perspectiveToEdit) {
      this.blockActions();
      this.isSwitchingEditMode = true; // To bypass animation
      this.doChangePerspective(perspectiveToEdit)
          .always(function () {
            this.isSwitchingEditMode = false;
            this.unblockActions();
            this.options.context.trigger('finish:enter:edit:perspective');
          }.bind(this));
    },
    onSerializePerspective: function (perspectiveModel) {
      this.blockActions();
      if (_.isFunction(this.currentPerspectiveView.serializePerspective)) {
        var self = this;
        this.currentPerspectiveView.serializePerspective(perspectiveModel)
            .done(function (perspective) {
              self.options.context.trigger('save:perspective', perspective);
            })
            .fail(function (error) {
              self.options.context.trigger('save:perspective', {error: error});
              self._showModalError({message: error});
            })
            .always(function () {
              self.unblockActions();
            });
      }
    },

    onExitEditPerspective: function (perspectiveToEdit) {
      this.blockActions();
      this.isSwitchingEditMode = true; // To bypass animation
      this.doChangePerspective(this.options.context.perspective)
          .always(function () {
            this.isSwitchingEditMode = false;
            this.unblockActions();
            this.options.context.trigger('finish:exit:edit:perspective');
          }.bind(this));
    },

    onRendered: function () {
      if (this.options.context.perspective.get('type')) {
        this.onChangePerspective();
      }
    },

    onChangePerspective: function (targetPerspective, sourceModel) {
      this.doChangePerspective(targetPerspective, sourceModel);
    },

    doChangePerspective: function (targetPerspective, sourceModel) {
      if (this._isRendered) {
        var context     = this.options.context,
            self        = this,
            perspective = targetPerspective || this.options.context.perspective,
            deferred    = $.Deferred();
        pageUnloading = false;
        if (this.options.progressWheel) {
          this.blockActions();
        }
        this.triggerMethod('before:create:perspective', this, {
          perspective: perspective
        });
        this.perspectiveFactory.createPerspective(perspective)
            .done(function (perspectiveView) {
              self.triggerMethod('create:perspective', this, {
                perspective: perspective,
                perspectiveView: perspectiveView
              });
              self._currentPespectiveStack.push(perspectiveView);
              perspectiveView.widgetsResolved.always(function (res) {
                self.triggerMethod('resolve:widgets', this, {
                  perspective: perspective,
                  perspectiveView: perspectiveView
                });
                context.clear();
                if (!pageUnloading) {
                  var enableMaximizeButton = res.length > 1;
                  self._setSupportMaximizeWidget(perspectiveView, perspective,
                      enableMaximizeButton);
                  self._swapPerspective(perspectiveView, perspective, sourceModel)
                      .always(function () {
                        deferred.resolve(perspectiveView);
                      });
                } else {
                  deferred.resolve(perspectiveView);
                }
                self._currentPespectiveStack.splice(0,
                    self._currentPespectiveStack.indexOf(perspectiveView));
              });
              self._currentPespectiveStack.splice(0,
                  self._currentPespectiveStack.indexOf(perspectiveView));
            })
            .fail(function (error) {
              if (self.options.progressWheel) {
                self.unblockActions();
              }
              if (!pageUnloading) {
                self._showError(error);
              }
              deferred.reject(error);
            });
        return deferred.promise();
      }
      return $.Deferred().resolve().promise();
    },

    _isInPerspectiveEditMode: function (perspective) {
      var perspectiveOptions = perspective && perspective.get('options') ?
                               perspective.get('options') : {};
      return perspectiveOptions.perspectiveMode === 'edit';
    },

    _setSupportMaximizeWidget: function (perspectiveView, perspective, enableMaximizeButton) {
      if (this._isInPerspectiveEditMode(perspective) ||  // Maximize not allowed in Edit Perspective
          perspectiveView._supportMaximizeWidget !== true || !enableMaximizeButton) {
        $("body").removeClass("csui-support-maximize-widget");
      } else {
        $("body").addClass("csui-support-maximize-widget");
      }
    },

    _triggerDomRefreshOnCurrentPerspective: function () {
      if (this.currentPerspectiveView) {
        this.currentPerspectiveView.triggerMethod('dom:refresh');
      }
    },

    _setShowingMaximizedWidget: function (showingMaximizedWidget) {
      if (showingMaximizedWidget) {
        $("body").addClass("csui-maximized-widget-mode");
      } else {
        $("body").removeClass("csui-maximized-widget-mode");
      }
    },

    _addMaximizedWidget: function (ev) {
      if (this._isInPerspectiveEditMode(this.currentPerspective)) {
        return;
      }
      if (this._maximizedWidgets[this._getCurrentPerspectiveSignature()] === undefined) {
        var maximizedWidgetInfo = {
          perspectiveSignature: this._getCurrentPerspectiveSignature(),
          cellAddress: this.getCellAddress(ev)
        };
        this._maximizedWidgets[maximizedWidgetInfo.perspectiveSignature] = maximizedWidgetInfo;
        this._maximizeWidgetView(maximizedWidgetInfo.cellAddress);
      }
      this._triggerDomRefreshOnCurrentPerspective();
    },

    getCellAddress: function (ev) {
      return (ev.widgetView ? ev.widgetView.$el.parent().attr("data-csui-cell_address") :
              ev.currentPerspectiveView.$el.find(".binf-row").children().attr(
                  "data-csui-cell_address"));
    },

    _removeMaximizedWidget: function (ev) {
      delete this._maximizedWidgets[this._getCurrentPerspectiveSignature()];
      this._restoreWidgetViewSize(ev.widgetView);
    },

    _getPerspectiveViewEl: function () {
      var perspectiveViewEl;
      if (this.currentPerspectiveView.$el.hasClass('csui-perspective-view')) {
        perspectiveViewEl = this.currentPerspectiveView.$el;
      } else {
        perspectiveViewEl = this.currentPerspectiveView.$el.find('.csui-perspective-view');
      }
      return perspectiveViewEl;
    },

    _maximizeWidgetView: function (cellAddress) {
      var perspectiveViewEl = this._getPerspectiveViewEl();
      perspectiveViewEl.find(".binf-row > div").each(function () {
        $(this).attr("data-csui-mwv-old-class", $(this).attr("class"));
        if ($(this).attr("data-csui-cell_address") === cellAddress) {
          $(this).parent().addClass("csui-maximized-row");
          $(this).attr("class", "binf-col-xs-12 csui-maximized-column");
        } else {
          $(this).attr("class", "binf-hidden-xs binf-hidden-sm binf-hidden-md binf-hidden-lg");
        }
      });

      this._setShowingMaximizedWidget(true);
    },

    _restoreWidgetViewSize: function (widgetView) {
      var $widgetRow = widgetView.$el.parent().parent();

      $widgetRow.removeClass("csui-maximized-row");
      var perspectiveViewEl = this._getPerspectiveViewEl();
      perspectiveViewEl.find(".binf-row > div").each(function () {
        $(this).attr("class", $(this).attr("data-csui-mwv-old-class"));
      });

      this._setShowingMaximizedWidget(false);
      this._triggerDomRefreshOnCurrentPerspective();
    },

    _getCurrentPerspectiveSignature: function () {
      if (this._currentPerspectiveSignature === undefined) {
        var cellSignatures = [];
        !!this.currentPerspectiveView &&
        this.currentPerspectiveView.$el.find(".binf-row > div").each(function () {
          var address = $(this).attr("data-csui-cell_address");
          var widgetType = $(this).attr("data-csui-widget_type");
          var classNames = $(this).attr("class");

          if (address === undefined) {
            address = "";
          }

          cellSignatures.push([address, widgetType, classNames].join(","));
        });

        this._currentPerspectiveSignature = cellSignatures.join("|");
      }

      return this._currentPerspectiveSignature;
    },

    _resetWidgetMaximization: function () {
      this._setShowingMaximizedWidget(false);
      this._maximizedWidgets = {};
    },

    _swapPerspective: function (perspectiveView, perspective, sourceModel) {
      var deferred = $.Deferred();
      var self = this;
      var showTimeout;
      var perspectiveShown;

      var scopeId = window.location.href;
      scopeId = scopeId.substr(scopeId.indexOf('#'));

      function showPerspective() {
        if (showTimeout) {
          clearTimeout(showTimeout);
        }
        if (perspectiveShown) {
          return;
        }
        perspectiveShown = true;
        _.delay(function () {
          if (!pageUnloading) {
            self._showPerspective(perspectiveView, perspective, deferred);
          }
        }, self.options.perspectiveShowDelay);
      }

      function fetchData() {
        self.options.context
            .fetch()
            .fail(function (error) {
              if (!pageUnloading) {
                if (window.csui && window.csui.mobile) {
                  if (error.statusCode === 500 && (window.location.href.indexOf('#') === -1 ||
                                                   window.location.href.indexOf('#home') !== -1)) {
                    showPerspective();
                    return;
                  } else if (error.statusCode === 0) {
                    CommandHelper.showOfflineMessage(error);
                  } else {
                    self._showModalError(error);
                    self.options.context.trigger('reject:perspective', error);
                  }

                  perspectiveView.destroy();
                } else {
                  showPerspective();
                }
              }
            })
            .done(showPerspective);
      }

      this._resetWidgetMaximization();
      setTimeout(function () {
        perspectiveView.render();
        if (this.options.progressWheel) {
          this.unblockActions();
        }
        if (this.options.waitForData) {
          fetchData();
          if (this.options.limitTimeToWaitForData) {
            showTimeout = setTimeout(showPerspective, this.options.maximumTimeToWaitForData);
          }
        } else {
          var eventName = this.currentPerspectiveView ?
                          'swap:perspective' : 'show:perspective';
          this.once(eventName, fetchData);
          showPerspective();
        }
      }.bind(this));

      return deferred;
    },
    _showPerspectiveForEditMode: function (perspectiveView, perspective) {
      this.currentPerspectiveView.destroy();

      this.currentPerspectiveView = perspectiveView;
      this.currentPerspective = perspective;
      this._currentPerspectiveSignature = undefined;

      perspectiveView.triggerMethod('before:show');
      this.$el.append(perspectiveView.el);
      perspectiveView.triggerMethod('show');
    },

    _showPerspective: function (perspectiveView, perspective, deferred) {
      var body = $(document.body),
          self = this;
      var perViewIndex = this._currentPespectiveStack.indexOf(perspectiveView);
      if (perViewIndex === -1) {
        return;
      }
      this._currentPespectiveStack.splice(0, perViewIndex);

      function finishShowingPerspective(perspectiveView) {
        body.scrollTop(0);
        self.perspectiveAnimator.finishAnimation();
        self.currentPerspectiveView = perspectiveView;
        self.currentPerspectiveView.triggerMethod('dom:refresh');
        self.currentPerspective = perspective;
        deferred.resolve(perspectiveView);
      }

      if (!!this.isSwitchingEditMode) {
        this._showPerspectiveForEditMode(perspectiveView, perspective);
        deferred.resolve(perspectiveView);
        return;
      }
      this.perspectiveAnimator.startAnimation(perspectiveView);

      if (this.currentPerspectiveView) {
        this.triggerMethod('before:swap:perspective', this, {
          oldPerspectiveView: this.currentPerspectiveView,
          newPerspectiveView: perspectiveView
        });
        this.perspectiveAnimator.swapPerspective(this.currentPerspectiveView, perspectiveView)
            .done(function () {
              var oldPerspectiveView = self.currentPerspectiveView;
              self.currentPerspectiveView.destroy();
              finishShowingPerspective(perspectiveView);
              self.triggerMethod('swap:perspective', self, {
                oldPerspectiveView: oldPerspectiveView,
                newPerspectiveView: perspectiveView
              });
            });
      } else {
        this.triggerMethod('before:show:perspective', this, {
          newPerspectiveView: perspectiveView
        });
        this.perspectiveAnimator.showPerspective(perspectiveView)
            .done(function () {
              finishShowingPerspective(perspectiveView);
              self.triggerMethod('show:perspective', self, {
                newPerspectiveView: perspectiveView
              });
            });

      }
    },

    _showError: function (error) {
      require(['csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        GlobalMessage.showMessage('error', error.message);
      });
    },

    _showModalError: function (error, options) {
      require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.message, options);
      });
    }
  });

  return PerspectivePanelView;
});
