/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/perspective.manage/impl/pman.panel.view',
  'csui/utils/perspective/perspective.util',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/user',
  'csui/models/perspective/personalization.model',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'hbs!csui/perspective.manage/impl/pman',
  'css!csui/perspective.manage/impl/pman',
  'csui/perspective.manage/behaviours/pman.widget.config.behaviour'
], function (_, $, Backbone, Marionette, base, NonEmptyingRegion, PManPanelView, PerspectiveUtil,
    ApplicationScopeModelFactory,
    NodeModelFactory, UserModelFactory, PersonalizationModel, lang, template) {

  var pmanContainer;

  var PManView = Marionette.ItemView.extend({
    className: function () {
      var classNames = ['pman', 'pman-container'];
      classNames.push('pman-mode-' + this.options.mode);
      return _.unique(classNames).join(' ');
    },

    template: template,

    templateHelpers: function () {
      return {
        addWidget: lang.addWidget,
        save: lang.save,
        cancel: lang.cancel,
        reset: lang.reset,
        personalizeMode: this.mode === PerspectiveUtil.MODE_PERSONALIZE &&
                         (this.options.perspective.has('perspective_id') ||
                          this.options.perspective.has('id'))
      };
    },

    ui: {
      "pmanPanel": ".pman-header .pman-pannel-wrapper",
      'cancelEdit': '.pman-header .cancel-edit',
      'addIcon': '.pman-header .icon-toolbarAdd',
      'saveBtn': '.pman-header .icon-save',
      'trashArea': '.pman-header .pman-trash-area',
      'resetBtn': '.pman-header .icon-reset'
    },

    events: {
      'click @ui.cancelEdit': "onClickClose",
      'click @ui.addIcon': "togglePannel",
      'click @ui.saveBtn': "onClickSave",
      'click @ui.resetBtn': "onClickReset"
    },

    constructor: function PManView(options) {
      options || (options = {});
      _.defaults(options, {
        applyMasking: this.applyMasking.bind(this),
        container: document.body,
        mode: PerspectiveUtil.MODE_EDIT_PERSPECTIVE
      });
      options.container = $(options.container);
      this.context = options.context;
      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.mode = options.mode;
      this._prepareForEdit(options.perspective);
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._registerEventHandler();
    },

    _registerEventHandler: function () {
      this.listenTo(this, 'change:layout', function (newLayoutType) {
        this.perspective.setPerspective({
          type: newLayoutType,
          options: {perspectiveMode: this.mode}
        }, {silent: true});
        this._triggerEditMode();
        this.togglePannel();
      });
      this.listenTo(this.context, 'save:perspective', this._savePerspective);
      this.listenTo(this.context, 'change:perspective', this._onChangePerspective);
      this.listenTo(this.context, 'retain:perspective', this._doExitPerspective);
      this.listenTo(this.context, 'finish:exit:edit:perspective', this._doCleanup);
    },

    _prepareForEdit: function (originalPerspective) {
      if (!originalPerspective) {
        throw new Error("Missing perspective");
      }
      this.perspective = this._clonePrespective(originalPerspective);
      if (this.perspective.isNew() && this.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        this.perspective.setPerspective(this._getDefaultPerspectiveConfig());
      }
    },

    _clonePrespective: function (original) {
      var perspectiveConfig = original.getPerspective();
      var config = JSON.parse(JSON.stringify(perspectiveConfig));
      original.setPerspective(config);
      return original;
    },

    show: function () {
      var container = this.getContainer(),
          region    = new NonEmptyingRegion({
            el: container
          });
      region.show(this);
      return this;
    },

    getContainer: function () {
      if (!pmanContainer || !$.contains(this.options.container, pmanContainer)) {
        pmanContainer = $('<div>', {'class': 'binf-widgets'}).appendTo(this.options.container)[0]
      }
      return pmanContainer;
    },
    _getDefaultPerspectiveConfig: function () {
      return {
        "type": "left-center-right",
        "options": {
          "center": {
            "type": "csui/widgets/nodestable"
          }
        }
      };
    },
    _savePerspective: function (perspectiveChanges) {
      if (!!perspectiveChanges && !!perspectiveChanges.error) {
        this.ui.saveBtn.prop('disabled', false);
        return;
      }
      this.perspective.update(perspectiveChanges);
      this.perspective.save().then(_.bind(this._onSaveSuccess, this),
          _.bind(this._onSaveError, this));
    },

    _onSaveSuccess: function () {
      var self = this;
      if (self.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        this._showMessage("success", lang.perspectiveSaveSuccess);
      } else {
        this._showMessage("success", lang.personalizationSaveSuccess);
      }
      var contextPerspectiveMode = self.context.perspective.get('perspectiveMode') ||
                                   PerspectiveUtil.MODE_EDIT_PERSPECTIVE,
          sourceModel            = self._getSourceModel();

      var updatePerspective = self.perspective.getPerspective();
      updatePerspective.id = self.perspective.getPerspectiveId();
      if (self.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        var originalPerspective = sourceModel.get('perspective');
        sourceModel.set('perspective', _.defaults(updatePerspective, originalPerspective));
      } else {
        var originalPerspective = sourceModel.get('perspective');
        sourceModel.set('perspective',
            _.defaults({personalizations: self.perspective.toJSON()}, originalPerspective));
      }

      if (contextPerspectiveMode === self.mode) {
        self.context.perspective.set(updatePerspective);
      } else if (self.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        var personalization = new PersonalizationModel({}, {perspective: updatePerspective});
        personalization.setPerspective(self.context.perspective.toJSON());
        updatePerspective = personalization.getPerspective();
        self.context.perspective.set(updatePerspective);

      } else if (self.mode === PerspectiveUtil.MODE_PERSONALIZE) {
        var personalization = new PersonalizationModel({},
            {perspective: sourceModel.get('perspective')});
        personalization.setPerspective(updatePerspective);
        updatePerspective = personalization.getPerspective();
        self.context.perspective.set(updatePerspective);
      }
      self._doExitPerspective();
    },

    _onSaveError: function (error) {
      this.ui.saveBtn.prop('disabled', false);
      var errorMessage;
      if (error && error.responseJSON && error.responseJSON.error) {
        errorMessage = error.responseJSON.error;
      } else {
        var errorHtml = base.MessageHelper.toHtml();
        base.MessageHelper.reset();
        errorMessage = $(errorHtml).text();
      }
      this._showMessage("error", errorMessage);
    },

    _showMessage: function (type, message) {
      require([
        'csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        GlobalMessage.showMessage(type, message);
      });
    },

    onClickSave: function () {
      this.ui.saveBtn.prop('disabled', true);
      var popoverTarget = this.options.container.find(".binf-popover");
      if (popoverTarget.length) {
        popoverTarget.binf_popover('hide');
      }
      this.context.triggerMethod('serialize:perspective', this.perspective);
    },

    onClickReset: function () {
      var self = this;
      require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmQuestion(lang.resetConfirmMsg,
            lang.reset,
            {
              buttons: {
                showYes: true,
                labelYes: lang.reset,
                showNo: true,
                labelNo: lang.cancel
              }
            })
            .done(function (yes) {
              if (yes) {
                self._doReset();
              }
            });
      });
    },

    _doReset: function () {
      var sourceModel = this._getSourceModel();
      originalPerspective = JSON.parse(JSON.stringify(sourceModel.get('perspective')));
      originalPerspective.options = originalPerspective.options || {};
      originalPerspective.options.perspectiveMode = this.mode;
      var originalConfig = new Backbone.Model(originalPerspective);
      this.context.triggerMethod('enter:edit:perspective', originalConfig);
      this.listenToOnce(this.context, 'finish:enter:edit:perspective', function () {
        this._showMessage("success", lang.resetSuccessful);
      });
    },

    _getSourceModel: function (params) {
      var sourceModel;
      if (this.applicationScope.get('id') === 'node') {
        sourceModel = this.context.getModel(NodeModelFactory);
      } else if (!this.applicationScope.get('id')) {
        sourceModel = this.context.getModel(UserModelFactory);
      }
      return sourceModel;
    },

    onClickClose: function () {
      this._doExitPerspective();
    },

    togglePannel: function () {
      if (!this.ui.pmanPanel.hasClass('binf-active')) {
        this._openToolsPanel();
      } else {
        this._closeToolsPanel();
      }
    },

    _openToolsPanel: function () {
      this.pmanPanelView.trigger('reset:items');
      this.ui.addIcon.addClass('binf-active');
      this.ui.addIcon.attr("title", lang.close);
      this.ui.pmanPanel.addClass('binf-active');
      this.pmanPanelView.triggerMethod("panel:open");
    },

    _closeToolsPanel: function () {
      this.ui.pmanPanel.removeClass('binf-active');
      this.ui.addIcon.attr("title", lang.addWidget);
      this.ui.addIcon.removeClass('binf-active');
    },

    applyMasking: function () {

    },

    _initializeWidgets: function () {
      if (this.mode === PerspectiveUtil.MODE_PERSONALIZE) {
        return;
      }
      this.pmanPanelRegion = new Marionette.Region({
        el: this.ui.pmanPanel
      });
      this.pmanPanelView = new PManPanelView({
        pmanView: this
      });
      this.pmanPanelRegion.show(this.pmanPanelView);
      _.isFunction(this.ui.trashArea.droppable) && this.ui.trashArea.droppable({
        tolerance: 'pointer',
        hoverClass: "pman-trash-hover",
        accept: function () {
          return false;
        }
      });
    },

    _triggerEditMode: function () {
      var perspectiveConfig = this.perspective.getPerspective();
      perspectiveConfig.options = perspectiveConfig.options || {};
      perspectiveConfig.options.perspectiveMode = this.mode;
      var perspective = new Backbone.Model(perspectiveConfig);
      this.context.triggerMethod('enter:edit:perspective', perspective);
    },

    _beforeTransition: function () {
      var perspectiveContainer = this.options.container.find('.cs-perspective');
      this.options.container.addClass('perspective-editing-transition');
      base.onTransitionEnd(perspectiveContainer, function () {
        this.options.container.removeClass('perspective-editing-transition');
      }, this);
    },

    onRender: function () {
      var self = this;
      this._beforeTransition();
      this.options.container.addClass('perspective-editing');
      this.options.applyMasking();
      this._initializeWidgets();
      this._triggerEditMode();
      $(document).on('click.' + this.cid, {view: this}, this._documentClick);
    },

    _documentClick: function (event) {
      var self = event.data.view;
      if (self.ui.addIcon.is(event.target) || !!self.ui.addIcon.has(event.target).length) {
        return;
      }
      if (self.ui.pmanPanel.is(event.target) || !!self.ui.pmanPanel.has(event.target).length) {
        return;
      }
      self._closeToolsPanel();
    },

    _onChangePerspective: function () {
      this._doCleanup();
    },

    _doCleanup: function () {
      var popoverTarget = this.options.container.find(".binf-popover");
      this._beforeTransition();
      if (popoverTarget.length) {
        popoverTarget.binf_popover('destroy');
      }
      this.options.container.removeClass('perspective-editing');
      $(document).off('click.' + this.cid, this._documentClick);
      this.trigger('destroy');
    },
    _doExitPerspective: function () {
      this.context.triggerMethod('exit:edit:perspective', this.perspective);
    },

  });

  return PManView;
});
