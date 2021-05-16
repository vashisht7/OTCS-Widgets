/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/log',
  'csui/controls/form/form.view',
  'csui/utils/contexts/factories/connector',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/controls/bosearch/searchform/impl/footer.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',
  'xecmpf/controls/bosearch/searchform/bosearchform.model',
  'i18n!xecmpf/controls/bosearch/impl/nls/lang',
  'hbs!xecmpf/controls/bosearch/searchform/impl/bosearchform'
], function (require, $, _, Backbone, Marionette, base, log,
    FormView,
    ConnectorFactory,
    ModalAlert,
    DialogFooterView,
    PerfectScrollingBehavior,
    LayoutViewEventsPropagationMixin,
    TabableRegionBehavior,
    TabContentKeyboardBehavior,
    BoSearchFormModel,
    lang,
    template
) {

  var BoSearchFieldsFormView = FormView.extend({

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      },
      TabContentKeyboardBehavior: {
        behaviorClass: TabContentKeyboardBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true
      }
    },

    defaults: {
      tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                              ' select:not([disabled]), textarea:not([disabled]),' +
                              ' button:not([disabled]), iframe, object, embed,' +
                              ' *[tabindex], *[cstabindex], *[contenteditable]'
    },

    onKeyDown: function (event) {
      if (event.keyCode === 9 || event.keyCode === 32 || event.keyCode === 13) {
        var elem = this.onKeyInView(event);
        if (elem) {
          event.preventDefault();
          event.stopPropagation();
          elem.prop("tabindex", "0");
          elem.trigger("focus");
        }
      }
    },

    onDomRefresh: function(){
      this.trigger("refresh:tabable:elements");
    },
    constructor: function BoSearchFieldsFormView(options) {
      _.defaults(options, this.defaults);
      options.searchTabContentForTabableElements = true;
      FormView.prototype.constructor.apply(this, arguments);
    }

  });

  var BusinessObjectSearchFormView = Marionette.LayoutView.extend({

    events: {
      'keydown': 'onKeyDown'
    },

    className: 'conws-bosearchform',
    template: template,

    triggers: {
      "click .binf-btn.search" : "bosearchform:search",
      "click .binf-btn.cancel": "bosearchform:cancel"
    },

    regions: {
      searchFields: '.conws-bosearchfields',
      footer: '.binf-modal-footer'
    },

    ui: {
      footer: '.binf-modal-footer'
    },

    constructor: function BusinessObjectSearchForm(options) {
      _.defaults(options, this.defaults);
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions();
      this.listenTo(this, "bosearchform:search", this._triggerSearch);
      this.listenTo(this, "bosearchform:cancel", this._triggerCancel);
      this.listenTo(this.model, "change:bo_type_name", this._updateTitle);
      this.searchFormModel = new BoSearchFormModel(
          {
            id: this.model.get("bo_type_id"),
            name: this.model.get("bo_type_name")
          },
          {connector: this.options.context.getObject(ConnectorFactory)}
      );
      this.listenTo(this.searchFormModel, "change:name", function() {
        this.model.set("bo_type_name",this.searchFormModel.get("name"));
      });
      this.listenTo(this.searchFormModel, "change", function() {
        this.model.set("bus_att_metadata_mapping",this.searchFormModel.get("bus_att_metadata_mapping"));
      });
      this.listenTo(this.searchFormModel, "error", function(model, response, options) {
        var errmsg = response && (new base.Error(response)).message || lang.errorGettingSearchForm;
        log.error("Fetching the search forms failed: {0}",errmsg) && console.error(log.last);
        ModalAlert.showError(errmsg);
      });
      this.listenTo(this.searchFormModel, "sync", function() {
        var data = this.searchFormModel.get("data");
        if ( $.isEmptyObject(data) ) {
          this._updateFormFieldsZero(true);
          this.focusOnSearchButton();

        }
        else {
          this._updateFormFieldsZero(false);
          this.listenToOnce(this.searchForm, "render", function() {
            this.focusOnFirstFormField();
          });

        }
      });
    },

    templateHelpers: function () {
      return {
        search_form_title: this._getTitle(),
        search_button_text: lang.boSearchFormButtonSearch,
        cancel_button_text: lang.boSearchFormButtonCancel,
        zero_fields_title: lang.zeroSearchFields
      };
    },

    onKeyDown: function (event) {
      if (event.keyCode === 13 && event.ctrlKey) { //ctrl-enter
       if( this.searchForm.$el.has(event.originalEvent.srcElement).length > 0 ){
             this.focusOnSearchButton();
        }
      }
    },

    _getTitle: function () {
      return _.str.sformat(lang.boSearchFormTitle,this.model.get("bo_type_name"));
    },

    _updateTitle: function () {
      var titleEl = this.$el.find(".conws-bosearchheader-title"),
          title = this._getTitle();
      titleEl.text(title);
      titleEl.attr({title:title});
    },

    _updateFormFieldsZero: function (zero) {
      var elem_fields      = this.$el.find(".conws-bosearchfields");
      var elem_fields_zero = this.$el.find(".conws-bosearchfields-zero");

      if (zero) {
        elem_fields.css({"display": "none"});
        elem_fields_zero.css({"display": ""});
      }
      else {
        elem_fields.css({"display": ""});
        elem_fields_zero.css({"display": "none"});
      }
    },
    focusOnSearchButton: function() {
      var btnviews = this.footerView.getButtons();
      btnviews && btnviews[0] && btnviews[0].$el.trigger("focus");
    },
    focusOnFirstFormField:function() {
      var firstField = this.searchFields.$el.find('.alpaca-container-item-first input');
      if ( firstField ) {
        firstField.trigger("focus");
      }
    },

    onRender: function () {
      this.searchForm = new BoSearchFieldsFormView({model: this.searchFormModel,mode:"create",layoutMode:"singleCol"});
      this.searchForm.model.fetch();

      var buttons = [
        {
          default: true,
          label: lang.boSearchFormButtonSearch,
          click: _.bind(this._triggerSearch, this)
        },
        {
          label: lang.boSearchFormButtonCancel,
          click: _.bind(this._triggerCancel, this)
        }
      ];
      this.footerView = new DialogFooterView({
        collection: new Backbone.Collection(buttons)
      });

      this.listenTo(this.footerView, 'childview:click', this.onClickButton);

      this.searchFields.show(this.searchForm);
      this.footer.show(this.footerView);

      var btnviews = this.footerView.getButtons();
      btnviews && btnviews[0] && btnviews[0].$el.addClass("search");
      btnviews && btnviews[1] && btnviews[1].$el.addClass("cancel");

    },


    
    onClickButton: function (view) {
      var attributes = view.model.attributes;
      if (attributes.click) {
        attributes.click();
      }
    },

    _triggerSearch: function() {
      log.debug("trigger bosearch:search") && console.log(log.last);
      var formData = this.searchForm.getValues(),
          formSchema = {
            data: this.searchFormModel.get("data"),
            options: this.searchFormModel.get("options"),
            schema: this.searchFormModel.get("schema")
          };
      this.model.trigger("bosearch:search",{searchParams:formData,searchForms:formSchema});
    },

    _triggerCancel: function() {
      log.debug("trigger bosearch:cancel") && console.log(log.last);
      this.model.trigger("bosearch:cancel");
    }

  });

  _.extend(BusinessObjectSearchFormView.prototype, LayoutViewEventsPropagationMixin);

  return BusinessObjectSearchFormView;
});



