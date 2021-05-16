/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'xecmpf/controls/bosearch/bosearch.view'
], function (require, $, _,
    Marionette,
    BoSearchView
) {

  var BoSearchDialogController = Marionette.Controller.extend({
    
    constructor: function BoSearchDialogController(options) {
      Marionette.Controller.prototype.constructor.apply(this, arguments);

      this.listenTo(this.options.boSearchModel,"reference:search",this._referenceSearchOpen);
      this.listenTo(this.options.boSearchModel, "boresult:select", this._boresultSelect);
      this.listenTo(this.options.boSearchModel,"reference:selected",this._referenceSelected);
      this.listenTo(this.options.boSearchModel,"reference:rejected",this._referenceRejected);
      this.listenTo(this.options.boSearchModel,"bosearch:cancel",this._referenceSearchCanceled);
    },

    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _referenceSearchOpen: function () {
      this._showSearchView();
    },

    _boresultSelect: function () {
      this._showModalContent(); // also shows blocking circle
    },

    _referenceSelected: function () {
      this._hideSearchView();
    },

    _referenceRejected: function () {
      this._hideModalContent();
    },

    _referenceSearchCanceled: function () {
      this._showModalContent();
      this._hideSearchView();
    },

    _hideSearchView : function() {
      if (this.options.mode==="workspace_reference_edit") {
        this.bosearchview.$el.parent().removeClass('cs-item-action-metadata');
      }
      if (this.options.mode==="business_attachment_add") {
        this.bosearchview.$el.parent().removeClass('cs-item-action-metadata');
      }
      this.modalcontent.removeClass('conws-bosearch-showing');
      this.bosearchview.$el.detach();
    },

    _showModalContent: function() {
      if (this.options.mode==="workspace_reference_create") {
        this.modalcontent.find(">.binf-modal-header .cs-close").show();
        this.modalcontent.find(">.binf-modal-body").show();
        this.modalcontent.find(">.binf-modal-footer").show();
      }
      if (this.options.mode==="workspace_reference_edit") {
        this.modalcontent.find(">.metadata-content-wrapper").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").show();
      }
      if (this.options.mode==="business_attachment_add" ) {
        this.modalcontent.find(">.metadata-content-wrapper").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").show();
      }
    },

    _hideModalContent: function () {
      if (this.options.mode==="workspace_reference_create") {
        this.modalcontent.find(">.binf-modal-header .cs-close").hide();
        this.modalcontent.find(">.binf-modal-body").hide();
        this.modalcontent.find(">.binf-modal-footer").hide();
      }
      if (this.options.mode==="workspace_reference_edit") {
        this.modalcontent.find(">.metadata-content-wrapper").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").hide();
      }
      if (this.options.mode==="business_attachment_add" ) {
        this.modalcontent.find(">.metadata-content-wrapper").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").hide();
      }
    },

    _showSearchView : function() {
      
      var options = this.options || {};
      
      this.modalcontent = $(this.options.htmlPlace);
      this.modalcontent.addClass('conws-bosearch-beforeshow');
      if (!this.bosearchview) {
        this.bosearchview = new BoSearchView({
          model: this.options.boSearchModel,
          context: this.options.context,
          multipleSelect: this.options.multipleSelect,
          disableItemsWithWorkspace: this.options.disableItemsWithWorkspace,
          title: this.options.title
        });
        this.bosearchview.render();
        this.bosearchview.$el.addClass(this.options.mode);
        if (this.options.mode==="workspace_reference_create") {
          this.bosearchview.$el.addClass('csui-content-without-header');
        }
        if (this.options.mode==="workspace_reference_edit") {
          this.bosearchview.$el.addClass('csui-content-without-header');
          this.bosearchview.$el.find('>*').addClass('binf-modal-content');
        }
        if (this.options.mode==="business_attachment_add") {
          this.bosearchview.$el.addClass('csui-content-without-header');
          this.bosearchview.$el.find('>*').addClass('binf-modal-content');
        }
      }

      this.modalcontent.append(this.bosearchview.$el);
      if (this.options.mode==="workspace_reference_edit") {
        this.bosearchview.$el.parent().addClass('cs-item-action-metadata');
      }
      if (this.options.mode==="business_attachment_add") {
        this.bosearchview.$el.parent().addClass('cs-item-action-metadata');
      }
      this.bosearchview.$el.position();

      this.bosearchview.triggerMethod('dom:refresh');

      var that = this;
      this.bosearchview.$el.one(this._transitionEnd(), function () {
        that.modalcontent.removeClass("conws-bosearch-animating");
        that.modalcontent.addClass('conws-bosearch-showing');
        that._hideModalContent();
      });
      this.modalcontent.addClass('conws-bosearch-animating');
      this.modalcontent.removeClass('conws-bosearch-beforeshow');
    }

  });

  return BoSearchDialogController;
});



