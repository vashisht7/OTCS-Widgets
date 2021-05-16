/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'i18n', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/base', 'csui/lib/backbone', 'csui/utils/log',
  'csui/models/widget/widget.model',
  'csui/perspective.manage/impl/options.form.view',
  'i18n!csui/perspective.manage/behaviours/impl/nls/lang',
  'hbs!csui/perspective.manage/behaviours/impl/widget.masking',
  'csui/utils/perspective/perspective.util',
  'css!csui/perspective.manage/behaviours/impl/widget.masking',
], function (require, i18n, _, $, Marionette, base, Backbone, log, WidgetModel,
    WidgetOptionsFormView, lang, maskingTemplate, PerspectiveUtil) {
  'use strict';

  var DEFAULTS = {
    removeConfirmMsg: lang.deleteConfirmMsg,
    removeConfirmTitle: lang.deleteConfirmTitle,
    configNeededMessage: lang.configNeeded,
    confirmOnRemove: true,
    allowReplace: true,
    notifyUpdatesImmediatly: false,
    perspectiveMode: 'edit'
  };
  var WidgetMaskingView = Marionette.ItemView.extend({
    template: maskingTemplate,
    className: function () {
      var classNames  = [WidgetMaskingView.className],
          isHidden    = PerspectiveUtil.isHiddenWidget(this.options.widgetConfig),
          widgetState = isHidden ? 'hidden' : 'shown';
      classNames.push('csui-pman-widget-mode-' + this.options.perspectiveMode);
      classNames.push('csui-pman-widget-state-' + widgetState);
      return _.unique(classNames).join(' ');
    },

    templateHelpers: function () {
      return {
        removeWidget: this.options.removeConfirmTitle,
        widgetTitle: this.manifest && this.manifest.title,
        configNeeded: this.options.configNeededMessage,
        isEditMode: this.isEditPage(),
        hideWidget: lang.hideWidget,
        showWidget: lang.showWidget
      }
    },

    ui: {
      delete: '.csui-pman-widget-close',
      masking: '.csui-pman-widget-masking',
      widgetTitle: '.csui-pman-widget-error-heading',
      hideWidgetBtn: '.csui-pman-hide-widget',
      showWidgetBtn: '.csui-pman-show-widget',
    },

    configureEvents: {
      'click @ui.masking': '_showCallout',
      'click @ui.delete': 'onDeleteClick',
    },

    events: function () {
      var evts = {};
      switch (this.options.perspectiveMode) {
      case 'edit':
        evts = _.extend(evts, this.configureEvents);
        if (!!this.options.allowReplace) {
          evts = _.extend(evts, {
            'drop': 'onDrop',
            'dragover': 'onDragOver',
            'dragenter': 'onDragEnter',
            'dragleave': 'onDragLeave'
          });
        }
        break;
      case 'personalize':
        evts = _.extend(evts, {
          'click @ui.hideWidgetBtn': '_onHideWidget',
          'click @ui.showWidgetBtn': '_onShowWidget',
        });
        if (this.options.personalizable) {
          evts = _.extend(evts, this.configureEvents);
        }
        break;
      }
      return evts;
    },

    constructor: function WidgetMaskingView(options) {
      options = _.defaults(options, DEFAULTS);
      Marionette.ItemView.apply(this, arguments);
      this.dropCounter = 0;
      this.manifest = options.manifest;
      this.perspectiveView = options.perspectiveView;
      this.widgetView = options.widgetView;
      this.widgetConfig = options.widgetConfig;
      this.perspectiveMode = options.perspectiveMode;
      this.listenTo(this.widgetView, 'refresh:mask', this._doRefreshMask);
      this.listenTo(this.widgetView, 'reposition:flyout', function () {
        if (!!this.$popoverEl && this.$popoverEl.data('binf.popover')) {
          this.$popoverEl.binf_popover('show');
        }
      });
    },

    _isConfigurable: function () {
      return !!this.widgetConfig && !_.isEmpty(this.widgetConfig) &&
             this.widgetConfig.type !== WidgetMaskingView.placeholderWidget &&
             this.widgetConfig.type !== 'csui/widgets/error';
    },

    isEditPage: function () {
      return this.perspectiveMode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE;
    },

    onRender: function () {
      if (!this._isConfigurable()) {
        return;
      }
      var self = this;
      this._loadManifest().done(function (manifest) {
        self.ui.widgetTitle.text(manifest.title);
        if (self.manifest.selfConfigurable) {
          self._adoptToSelfConfigurableWidget();
        } else if (self.isEditPage() || self.options.personalizable) {
          self._createOptionsForm(function () {
            if (this.isDestroyed) {
              return;
            }
            var openCallout = !!self.widgetConfig.options &&
                              (self.widgetConfig.options.___pman_isdropped ||
                               self.widgetConfig.options.___pman_opencallout);
            var isWidgetReplaced = self._updateWidgetOptions(false, true);
            self.optionsFormView.refresh(function () {
              self.$el.addClass('cs-pman-callout-ready');
              self.$el.addClass('cs-pman-config-ready');
              if (openCallout && !isWidgetReplaced) {
                self._showOptionsCallout(manifest, true);
              }
            });
          });
        } else {
          self.$el.addClass('cs-pman-config-ready');
        }
      });
    },

    onDestroy: function () {
      this.optionsFormView && this.optionsFormView.destroy();
    },

    _adoptToSelfConfigurableWidget: function () {
      if (!PerspectiveUtil.isEmptyPlaceholder(this.widgetConfig, this.perspectiveMode)
          && this.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE &&
          !PerspectiveUtil.isPersonalWidget(this.widgetConfig)) {
        return;
      }
      this.$el.addClass('csui-has-editing-capability');
      delete this.widgetConfig.options.___pman_isdropped;
      this.listenTo(this.widgetView, 'update:widget:options', function (options) {
        delete this.widgetConfig.options.___pman_isdropped;
        this._notifyConfigChanges(options, options.isValid, false);
      });
      this.listenTo(this.widgetView, 'remove:widget', this._doDeleteWidget);
      this.listenTo(this.widgetView, 'replace:widget', this.onDrop);
    },
    _doRefreshMask: function (options) {
      this.options = _.extend({}, this.options, DEFAULTS, options);
      this.ui.delete.attr("title", this.options.removeConfirmTitle);
    },

    _showCallout: function (event) {
      if (this.isDestroyed) {
        return;
      }
      if (!this._isConfigurable()) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (!!this.ui.delete.is(event.target)) {
        return;
      }
      this._loadManifest().done(function (manifest) {
        this._showOptionsCallout(manifest);
      }.bind(this));
    },

    _showOptionsCallout: function (manifest, forceShow) {
      if (this.isDestroyed) {
        return;
      }
      if (base.isIE11() && !!document.activeElement) {
        document.activeElement.blur();
      }
      if (!!this.$popoverEl && this.$popoverEl.data('binf.popover')) {
        this.$popoverEl.binf_popover('destroy');
        return;
      }
      if (this.$el.closest(".cs-perspective").find(".binf-popover").length) {
        this._closePopover();
        if (!forceShow) {
          return;
        }
      }
      this._calculatePopoverPlacement();

      if (!!this.optionsFormView) {
        this._showPopover();
      } else {
        this._createOptionsForm();
      }
    },

    _closePopover: function () {
      this.$el.closest(".cs-perspective").find('.' + WidgetMaskingView.className +
                                               ' .csui-pman-popover-holder').binf_popover(
          'destroy');
    },

    _createOptionsForm: function (afterRenderCallback) {
      this.optionsFormView = new WidgetOptionsFormView(_.defaults({
        context: this.perspectiveView.options.context,
        manifest: this.manifest
      }, this.options));
      if (!!afterRenderCallback) {
        this.optionsFormView.listenToOnce(this.optionsFormView, 'render:form', afterRenderCallback);
      }
      this.optionsFormView.render();
      this.optionsFormView.listenTo(this.optionsFormView, 'change:field',
          this._onChangeField.bind(this));
    },

    _calculatePopoverPlacement: function () {
      var adjust = this._determineCalloutPlacement();
      this.$popoverEl = this.$el.find('.csui-pman-popover-' + adjust.placement);
      if (adjust.mirror) {
        adjust.placement = adjust.placement == 'right' ? 'left' : 'right';
      }
      this.placement = adjust.placement;
      this.$popoverContainer = $(
          '<div class="binf-popover pman-widget-popover pman-ms-popover" role="tooltip"><div class="binf-arrow"></div><h3 class="binf-popover-title"></h3><div class="binf-popover-content"></div></div>');
      this.$popoverContainer.css("max-width", adjust.availableSpace + "px");
    },
    _showPopover: function () {
      var popoverOptions = {
        html: true,
        content: this.optionsFormView.el,
        trigger: 'manual',
        viewport: { // Limit popover placement to perspective panel only
          selector: this.options.perspectiveSelector,
          padding: 15
        },
        placement: this.placement,
        template: this.$popoverContainer,
        animation: false
      };
      this.$popoverEl.binf_popover(popoverOptions);
      this.$popoverEl.off('hidden.binf.popover')
          .on('hidden.binf.popover', this._handleCalloutHide.bind(this));
      this.$popoverEl.binf_popover('show');
      this.optionsFormView.onPopoverShow(this.$popoverContainer);
      this.optionsFormView.$el.find('.cs-formview-wrapper').trigger('refresh:setcontainer');
      var popover   = this.$popoverEl.next(".binf-popover"),
          itemFirst = popover.find(".alpaca-container-item-first");
      if (itemFirst.length) {
        itemFirst = itemFirst.first();
        var ele = itemFirst.find(
            'input:visible, textarea:visible, button.binf-dropdown-toggle:visible');
        if (ele.length) {
          ele.trigger('focus');
        }
      }
      this._registerPopoverEvents();
      this.optionsFormView.trigger('ensure:scrollbar');
      var popoverLabelElemId = _.uniqueId('popoverLabelId'),
          popoverHeader      = popover.find('>.binf-popover-title');
      if (popoverHeader) {
        popoverHeader.attr('id', popoverLabelElemId);
        popoverHeader.html(this.manifest.title);
        popover.attr('aria-labelledby', popoverLabelElemId);
      }
    },

    _hideCallout: function () {
      this.$popoverEl && this.$popoverEl.binf_popover('destroy');
    },

    _registerPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').off('click.' + this.cid).on(
          'click.' + this.cid, {
            view: this
          },
          this._documentClickHandler);
      $('.pman-container').off('click.' + this.cid).on('click.' + this.cid, {
        view: this
      }, this._documentClickHandler);
      $(window).off('click.' + this.cid).on('resize.' + this.cid, {
        view: this
      }, this._windowResizeHandler);
    },

    _windowResizeHandler: function (event) {
      var self = event.data.view;
      self._hideCallout();
    },

    _unregisterPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').off('click.' + this.cid,
          this._documentClickHandler);
      $('.pman-container').off('click.' + this.cid, this._documentClickHandler);
      $(window).off('resize.' + this.cid, this._windowResizeHandler);
    },
    _handleCalloutHide: function () {
      this._validateWidgetConfig();
      this._unregisterPopoverEvents();
      delete this.widgetConfig.options.___pman_opencallout;
      this._updateWidgetOptions(true);
      this._enableorDisableSaveButton();
    },

    _validateWidgetConfig: function () {
      var options = this.optionsFormView.getValues(),
          isValid = this.optionsFormView.validate();
      if (_.isFunction(this.widgetView.validateConfiguration)) {
        isValid = isValid && this.widgetView.validateConfiguration(options);
      }
      var action = !isValid ? 'addClass' : 'removeClass';
      this.$el[action]('binf-perspective-has-error');
    },

    _enableorDisableSaveButton: function () {
      var saveBtn  = $('.perspective-editing .pman-header .icon-save'),
          hasError = $('.perspective-editing').find(".binf-perspective-has-error").length > 0;
      saveBtn.prop('disabled', hasError);
    },
    _updateWidgetOptions: function (reloadForLiveData, softUpdate) {
      var isValid = this.optionsFormView.validate(),
          options = this.optionsFormView.getValues();
      softUpdate = _.isUndefined(softUpdate) ? !reloadForLiveData : softUpdate
      var isWidgetReplaced = this._notifyConfigChanges(options, isValid, reloadForLiveData,
          softUpdate);
      this._enableorDisableSaveButton();
      return isWidgetReplaced;
    },

    _notifyConfigChanges: function (options, isValid, reloadForLiveData, softUpdate) {
      options = options || {};
      var oldOptions = this.widgetConfig.options || {};
      var isOptionsSame = _.isEqual(oldOptions, options);
      this.perspectiveView.trigger("update:widget:options", {
        widgetView: this.widgetView,
        isValid: isValid,
        options: options,
        softUpdate: softUpdate
      });

      if (isOptionsSame) {
        return;
      }

      if (!!isValid) {
        if (!this.manifest.callback && (reloadForLiveData || oldOptions.___pman_isdropped)) {
          var widgetType = this.widgetConfig.type;
          if (this._isPreviewWidget()) {
            var originalWidget = this.widgetConfig.options.widget;
            widgetType = originalWidget.id;
          }
          if (!!oldOptions.___pman_isdropped) {
            options = _.extend({___pman_opencallout: oldOptions.___pman_isdropped}, options);
          }
          var widgetToReplace = {
            type: widgetType,
            kind: this.widgetConfig.kind,
            options: options
          };
          this.perspectiveView.trigger('replace:widget', this.widgetView, widgetToReplace);
          return true;
        }
      }
    },
    _documentClickHandler: function (event) {
      var self = event.data.view;
      if (!!$(event.target).closest('.binf-popover').length) {
        return;
      }
      if (!Marionette.isNodeAttached(event.target)) {
        self.widgetView.trigger('reposition:flyout');
        return;
      }
      if (self.$el.is(event.target) ||
          (!!self.$el.has(event.target).length && !self.ui.delete.is(event.target)) ||
          self.widgetView.$el.is(event.target) || self.widgetView.$el.has(event.target).length) {
        return;
      }
      self._unregisterPopoverEvents();
      self._hideCallout();
    },

    _onChangeField: function (field) {
      if (field.name === WidgetOptionsFormView.widgetSizeProperty) {
        this.perspectiveView.trigger("update:widget:size", this.options.widgetView, field.value);
        this.$popoverEl.binf_popover('destroy');
      } else if (this.options.notifyUpdatesImmediatly) {
        this._updateWidgetOptions(false, false);
        this.widgetView.trigger('reposition:flyout');
      }
    },

    _evalRequiredFormWidth: function () {

      this.optionsFormView.$el.addClass('pman-prerender-form');
      this.optionsFormView.$el.addClass('pman-widget-popover');
      this.optionsFormView.$el.appendTo(document.body);
      this.optionsFormView.$el.find('.cs-formview-wrapper').trigger('refresh:setcontainer');
      var formWidth = this.optionsFormView.$el.width();
      if (this.optionsFormView.$el.find('.csui-scrollablecols').length > 0) {
        formWidth += this.optionsFormView.$el.find('.csui-scrollablecols')[0].scrollWidth -
                     this.optionsFormView.$el.find('.csui-scrollablecols')[0].offsetWidth;
      }
      this.optionsFormView.$el.removeClass('pman-widget-popover');
      return formWidth;
    },

    _calculateSpaceAroundWidget: function () {
      var elWidth       = this.$el.width(),
          elWidth       = (elWidth / 2),
          documentWidth = $(document).width(),
          leftOffset    = this.$el.find('.csui-pman-popover-left').offset().left,
          rightOffset   = documentWidth - this.$el.find('.csui-pman-popover-right').offset().left;

      var aroundSpaces = {
        right: {
          placement: 'right',
          mirror: false,
          availableSpace: rightOffset
        },
        rightFlip: {
          placement: 'right',
          mirror: true,
          availableSpace: (documentWidth - rightOffset)
        },
        left: {
          placement: 'left',
          mirror: false,
          availableSpace: leftOffset
        },
        leftFlip: {
          placement: 'left',
          mirror: true,
          availableSpace: (documentWidth - leftOffset)
        }
      };
      return aroundSpaces;
    },

    _determineCalloutPlacement: function () {
      var isRtl     = i18n && i18n.settings.rtl,
          formWidth = this._evalRequiredFormWidth() + 20, // For additional spacing around Form
          allSpaces = this._calculateSpaceAroundWidget(),
          i, perfectSpace, highSpace;

      var spacings = !isRtl ?
          [allSpaces.right, allSpaces.left, allSpaces.leftFlip, allSpaces.rightFlip] :
          [allSpaces.rightFlip, allSpaces.leftFlip, allSpaces.left, allSpaces.right];

      for (i = 0; i < spacings.length; i++) {
        var current = spacings[i];
        if (formWidth < current.availableSpace) {
          perfectSpace = current;
          break;
        }
        if (!highSpace || current.availableSpace > highSpace.availableSpace) {
          highSpace = current;
        }
      }
      if (!perfectSpace) {
        perfectSpace = highSpace;
      }
      perfectSpace.availableSpace -= 20; // For additional spacing around popover.

      return perfectSpace;
    },

    _isPreviewWidget: function () {
      return this.widgetConfig.type === WidgetMaskingView.perspectiveWidget;
    },

    _loadManifest: function () {
      if (this.manifest !== undefined) {
        return $.Deferred().resolve(this.manifest);
      }
      if (this._isPreviewWidget()) {
        this.manifest = this.widgetConfig.options.widget.get('manifest');
        return this._loadManifest();
      }
      var deferred = $.Deferred();
      var self        = this,
          widgetModel = new WidgetModel({
            id: this.widgetConfig.type
          });
      widgetModel.fetch().then(function () {
        self.manifest = widgetModel.get('manifest');
        deferred.resolve(self.manifest);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    onDeleteClick: function (event) {
      this._closePopover();
      event.preventDefault();
      if (!this.options.confirmOnRemove) {
        this._doDeleteWidget();
      } else {
        var self = this;
        require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.confirmQuestion(self.options.removeConfirmMsg,
              self.options.removeConfirmTitle,
              {
                buttons: {
                  showYes: true,
                  labelYes: lang.remove,
                  showNo: true,
                  labelNo: lang.cancel
                }
              })
              .done(function (yes) {
                if (yes) {
                  self._doDeleteWidget();
                }
              });
        });
      }
    },

    _doDeleteWidget: function () {
      this.perspectiveView.trigger("delete:widget", this.widgetView);
      this._enableorDisableSaveButton();
    },

    _doReplaceWidget: function (widgetToReplace) {
      var manifest  = (widgetToReplace.get('manifest') || {}),
          newWidget = { // Widget is able to intialize with default (empty) options.
            type: widgetToReplace.id,
            kind: manifest.kind
          };
      if (!PerspectiveUtil.isEligibleForLiveWidget(manifest)) {
        newWidget = {
          type: WidgetMaskingView.perspectiveWidget,
          kind: manifest.kind,
          options: {
            options: {}, // To be used and filled by callout form
            widget: widgetToReplace
          }
        };
      }
      newWidget.options = _.extend({___pman_isdropped: true}, newWidget.options);
      this.perspectiveView.trigger('replace:widget', this.widgetView, newWidget);
    },

    onDragOver: function (event) {
      event.preventDefault();
    },

    onDragEnter: function (event) {
      event.preventDefault();
      this.dropCounter++;
      this.$el.siblings(".csui-perspective-placeholder").addClass('csui-widget-drop');
    },

    onDragLeave: function () {
      this.dropCounter--;
      if (this.dropCounter === 0) {
        this.$el.siblings(".csui-perspective-placeholder").removeClass('csui-widget-drop');
      }
    },

    _extractWidgetToDrop: function (event) {
      var dragData = event.originalEvent.dataTransfer.getData("text");
      if (!dragData) {
        return undefined;
      }
      try { // TODO get rid of try catch and handle like non-droppable object
        var widgetToReplace = new WidgetModel(JSON.parse(dragData));
        return widgetToReplace;
      } catch (e) {
        return false;
      }
    },

    onDrop: function (event) {
      event.preventDefault();
      this.onDragLeave();
      var widgetToReplace = this._extractWidgetToDrop(event);
      if (!widgetToReplace) {
        return;
      }
      if (this.widgetConfig.type === WidgetMaskingView.placeholderWidget) {
        this._doReplaceWidget(widgetToReplace);
      } else {
        var self = this;
        require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.confirmQuestion(lang.replaceConfirmMsg, lang.replaceConfirmTitle, {
            buttons: {
              showYes: true,
              labelYes: lang.replace,
              showNo: true,
              labelNo: lang.cancel
            }
          })
              .done(function (userConfirmed) {
                if (userConfirmed) {
                  self._doReplaceWidget(widgetToReplace);
                }
              });
        });
      }
    },

    _updateStyles: function () {
      var className = _.result(this, 'className');
      this.$el.attr('class', className);
    },

    _onHideWidget: function () {
      this.perspectiveView.trigger('before:hide:widget', this.widgetView);
      PerspectiveUtil.setWidgetHidden(this.widgetConfig, true);
      this._notifyConfigChanges(this.widgetConfig.options, true, false);
      this._updateStyles();
      this.perspectiveView.trigger('hide:widget', this.widgetView);
    },

    _onShowWidget: function () {
      this.perspectiveView.trigger('before:show:widget', this.widgetView);
      PerspectiveUtil.setWidgetHidden(this.widgetConfig, false);
      this._notifyConfigChanges(this.widgetConfig.options, true, false);
      this._updateStyles();
      this.perspectiveView.trigger('show:widget', this.widgetView);
    },

  }, {
    className: 'csui-configure-perspective-widget',
    perspectiveWidget: 'csui/perspective.manage/widgets/perspective.widget',
    placeholderWidget: 'csui/perspective.manage/widgets/perspective.placeholder',
    widgetSizeProperty: '__widgetSize'
  });

  var PerspectiveWidgetConfigurationBehaviour = Marionette.Behavior.extend({

    defaults: {
      perspectiveSelector: '.perspective-editing .cs-perspective > div'
    },

    constructor: function PerspectiveWidgetConfigurationBehaviour(options, view) {
      options || (options = {});
      options.perspectiveView = options.perspectiveView || view;
      this.perspectiveView = options.perspectiveView;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      _.extend(this.perspectiveView, {
        getPManPlaceholderWidget: function () {
          return {
            type: WidgetMaskingView.placeholderWidget,
            options: {}
          };
        }
      })
    },

    _ensureWidgetElement: function () {
      if (!_.isObject(this.$widgetEl)) {
        this.$widgetEl = this.options.el ? $(this.options.el) : this.view.$el;
      }
      if (!this.$widgetEl || this.$widgetEl.length === 0) {
        throw new Marionette.Error('An "el" ' + this.$widgetEl.selector + ' must exist in DOM');
      }
      return true;
    },

    _checkAndApplyMask: function () {
      this._ensureWidgetElement();
      if (this.$widgetEl.children('.' + WidgetMaskingView.className).length > 0) {
        return;
      }
      var widgetConfig = this._resolveWidgetConfiguration();
      if (!widgetConfig) {
        throw new Marionette.Error({
          name: 'NoWidgetConfigurationError',
          message: 'A "widgetConfig" must be specified'
        });
      }
      if (this.maskingView && this.$widgetEl.has(this.maskingView.$el).length &&
          _.isEqual(widgetConfig, this.options.widgetConfig)) {
        return;
      }
      this.maskingView && this.maskingView.destroy();
      this.maskingView = new WidgetMaskingView(
          _.extend(this.options, {
            widgetView: this.view,
            widgetConfig: widgetConfig
          }));
      this.maskingView.render();
      this.$widgetEl.append(this.maskingView.el);
      this.$widgetEl.addClass('csui-pman-editable-widget')
      this.$widgetEl.data('pman.widget', {
        attributes: {
          manifest: widgetConfig
        }
      });
      if (widgetConfig.type === WidgetMaskingView.placeholderWidget) {
        this.$widgetEl.removeClass('csui-draggable-item');
      }
    },

    _resolveWidgetConfiguration: function () {
      if (!!this.view.model && !!this.view.model.get('widget')) {
        return this.view.model.get('widget');
      }
      if (!!this.view.getPManWidgetConfig && _.isFunction(this.view.getPManWidgetConfig)) {
        return this.view.getPManWidgetConfig();
      }
      if (!!this.options.widgetConfig) {
        return _.result(this.options, 'widgetConfig');
      }
    },

    onRender: function () {
      if (this.options.notifyUpdatesImmediatly && this.view.isUpdating) {
        return;
      }
      this._checkAndApplyMask();
      this.maskingView && this.maskingView._enableorDisableSaveButton();
    },

    onDestroy: function () {
      this.maskingView && this.maskingView.destroy();
      this.maskingView = undefined;
    }

  });

  return PerspectiveWidgetConfigurationBehaviour;

})
