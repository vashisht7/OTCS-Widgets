/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/wizard/step/wizard.step.view',
  'conws/controls/wizard/step/impl/footer.view',
  'csui/utils/log',
  'i18n!csui/controls/wizard/impl/nls/lang'
], function (module, _, Backbone, LayoutViewEventsPropagationMixin,
  WizardStepView, ConwsWizardStepFooterView, log, lang) {

    log = log(module.id);

    var ConwsWizardStepView = WizardStepView.extend({

      constructor: function ConwsWizardStepView() {
        WizardStepView.prototype.constructor.apply(this, arguments);
        this.listenTo(this,'set:initial:focus', this.setViewInitialFocus);
      },

      setViewInitialFocus: function(){
        this.options.view.trigger('set:initial:focus');
      },
      _renderFooter: function () {
        var footerView = this.footerView = this.options.footerView;
        if (footerView) {
          this.ui.footer.removeClass('binf-hidden');
          this.footer.show(footerView);
        } else {
          var defaultButtons = [];
          if (!this.options.isFirstStep) {
            defaultButtons.push({
              id: 'previous',
              label: this.options.previousButtonLabel || lang.back,
              toolTip: this.options.previousButtonLabel || lang.back,
              'default': false,
              disabled: false,
              isButton: false,
              separate: this.options.seperatePrevious || false,
              click: _.bind(this.onClickPreviousButton, this)
            });
          }
          var nextButton = {
            id: 'next',
            label: this.options.nextButtonLabel || lang.next,
            toolTip: this.options.nextButtonLabel || lang.next,
            'default': true,
            disabled: (this.options.disableNext === undefined) ? true : this.options.disableNext,
            separate: this.options.seperateNext || false,
            isButton: false,
            click: _.bind(this.onClickNextButton, this)
          },
            doneButton = {
              id: 'done',
              label: this.options.doneButtonLabel || lang.done,
              toolTip: this.options.doneButtonLabel || lang.done,
              'default': true,
              disabled: (this.options.disableDone === undefined) ? true : this.options.disableDone,
              separate: this.options.seperateDone || true,
              click: _.bind(this.onClickDoneButton, this)
            };
          if (this.options.nextButton && this.options.doneButton) {
            defaultButtons.push(nextButton);
            defaultButtons.push(doneButton);
          }
          else if (this.options.nextButton) {
            defaultButtons.push(nextButton);
          } else if (this.options.doneButton) {
            defaultButtons.push(doneButton);
          }
          defaultButtons.push(
            {
              id: 'cancel',
              label: lang.cancel,
              toolTip: lang.cancel,
              separate: this.options.seperateCancel || true,
              close: true
            });

          var buttons = this.options.buttons || defaultButtons;

          if (buttons.length) {
            this.ui.footer.removeClass('binf-hidden');
          }
          footerView = this.footerView = new ConwsWizardStepFooterView({
            collection: new Backbone.Collection(buttons),
            wizardView: this,
            el: this.ui.footer[0]
          });
          this.listenTo(footerView, 'childview:click', this.onClickButton);
          footerView.render();
          this.footer.attachView(footerView);
        }
      }
    });

    _.extend(ConwsWizardStepView.prototype, LayoutViewEventsPropagationMixin);

    return ConwsWizardStepView;

  });
