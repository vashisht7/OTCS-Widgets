/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'csui/lib/jquery', 'csui/lib/underscore',
  "csui/lib/backbone", 'csui/lib/marionette',
  'csui/utils/base', 'csui/utils/log',
  'csui/utils/contexts/factories/connector',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/controls/bosearch/resultlist/botable.view',
  'xecmpf/controls/bosearch/resultlist/boresult.collection',
  'hbs!xecmpf/controls/bosearch/resultlist/impl/boresultlist',
  'i18n!xecmpf/controls/bosearch/impl/nls/lang'
], function (require, $, _,
    Backbone, Marionette,
    base, log,
    ConnectorFactory,
    ModalAlert,
    InfiniteScrollingTableView,
    BoResultCollection,
    template, lang
) {

  var BusinessObjectResultListView = Marionette.LayoutView.extend({

    className: 'conws-boresultlist',
    template: template,

    regions: {
      tableRegion: '.conws-boresulttable'
    },

    triggers: {
      "click .binf-btn.attach": "attach:clicked"
    },

    constructor: function BusinessObjectResultListView(options) {

      options || (options = {});

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.listenTo(this.model, "change:bo_type_name", this._updateBanner);
      this.listenTo(this.model, "bosearch:search", this._triggerSearch);
      this.listenTo(this, "attach:clicked", this._triggerAttach);
    },

    _triggerSearch : function(searchEventInfo) {
      if (!this.collection) {
        this.collection = new BoResultCollection(undefined,
            {
              connector: this.options.context.getObject(ConnectorFactory),
              boSearchModel: this.options.model,
              autoreset: true
            });
        this.render();
        this.listenTo(this.collection,"sync",this._updateFooter);
        this.listenTo(this.collection,"sync",this._showSyncError);
        this.listenTo(this.collection,"error",this._showSearchError);
      }
      this.collection.searchParams = searchEventInfo ? searchEventInfo.searchParams : undefined;
      this.collection.searchForms = searchEventInfo ? searchEventInfo.searchForms : undefined;
      var that = this;
      this.collection.fetch({reset: true}).then(function(){
        var curFocus = that.resultTable.currentlyFocusedElement();
        if (curFocus) {
          curFocus.trigger("focus");
        }
      });
      var bus_att_metadata_mapping = this.model.get("bus_att_metadata_mapping");
      if (this.options.multipleSelect && !bus_att_metadata_mapping ){
        var elem = this.$el.find(".conws-boresultfooter>.conws-boresultfooter-attach-container");
        if (elem) {
          elem.css({"display": "block"});
          var attBtn = elem.children();
          if ( attBtn ) {
            attBtn[0].disabled = true;
          }
        }
        this.$el.addClass('conws-with-attachbtn');
      }
    },

    _selectedRow: function(selectedRow) {
      log.debug("trigger reference:clicked") && console.log(log.last);
      this.listenToOnce(this.model,"reference:selected",function() {
        $(selectedRow.target).trigger("mouseleave"); // remove hover style at end of selection process
      });
      this.model.trigger("boresult:select",{selectedItems:[selectedRow.model]});
    },

    _enableAttachBtn: function(selectedRow){
      if ( selectedRow.nodes.length > 0 ){
        var selChilds = this.resultTable.getSelectedChildren();
        if ( selChilds.length > 0 ) {
          var elem = this.$el.find(".conws-boresultfooter .binf-btn.binf-btn-default.attach");
          if (elem) {
            elem[0].disabled = false;
          }
        }
      }
    },

    _disableAttachBtn: function(selectedRow){
      if ( selectedRow.nodes.length > 0 ){
        var selChilds = this.resultTable.getSelectedChildren();
        if ( selChilds.length === 0 ) {
          var elem = this.$el.find(".conws-boresultfooter .binf-btn.binf-btn-default.attach");
          if (elem) {
            elem[0].disabled = true;
          }
        }
      }
    },

    templateHelpers: function () {
      return {
        banner_message: this._getBannerMessage(),
        footer_message: this._getFooterMessage(),
        attach_button_text: lang.boResultListButtonAttach,
      };
    },

    _updateBanner: function () {
      var msg = this._getBannerMessage();
      if (msg) {
        this.$el.find(".conws-boresultbanner").text(this._getBannerMessage());
      }
    },

    _getBannerMessage: function () {
      return this.collection ? undefined : _.str.sformat(lang.resultListBannerMessage,this.model.get("bo_type_name"));
    },

    _updateFooter: function() {
      var msg = this._getFooterMessage();
      if (msg) {
        this.$el.find(".conws-boresultfooter-message").text(msg);
        this.$el.addClass("conws-with-footer");
      } else {
        this.$el.removeClass("conws-with-footer");
      }
    },

    _getFooterMessage: function () {
      return (this.collection && this.collection.maxRowsExceeded) ? lang.resultListRefineMessage : undefined;
    },

    _showSyncError: function () {
      if (this.collection.errorMessage && this.collection.errorMessage===BoResultCollection.ERR_COLUMNS_CHANGED) {
        ModalAlert.showError(lang[this.collection.errorMessage]||this.collection.errorMessage);
      }
    },

    _showSearchError: function (model, response, options) {
      var errmsg = response && (new base.Error(response)).message || lang.errorSearchingBusinessObjects;
      log.error("Searching for business objects failed: {0}",errmsg) && console.error(log.last);
      ModalAlert.showError(errmsg);
    },

    _triggerAttach : function() {
      log.debug("trigger boresult:select") && console.log(log.last);
      this.model.trigger("boresult:select",{selectedItems:this.resultTable.getSelectedChildren()});
    },

    onRender: function() {
      this._updateFooter();

      if (this.collection) {
        var selectRows = "single";
        var selectColumn = false;
        var bus_att_metadata_mapping = this.model.get("bus_att_metadata_mapping");
        if ( this.options.multipleSelect && ! bus_att_metadata_mapping ) {
          selectRows = "multiple";
          selectColumn = true;
        }
        var enableSorting = true;
		
        if (this.options.enableSorting !== undefined){
          enableSorting = this.options.enableSorting;
        }
        
        this.resultTable = new InfiniteScrollingTableView({
          context: this.options.context,
          connector: this.options.context.getObject(ConnectorFactory),
          collection: this.collection,
          columns: this.collection.columns,
          tableColumns: this.collection.tableColumns,
          selectRows: selectRows,
          selectColumn: selectColumn,
          enableSorting: enableSorting,
          nameEdit: false,
          haveDetailsRowExpandCollapseColumn: true,
          disableItemsWithWorkspace: this.options.disableItemsWithWorkspace,
          tableTexts: {
            zeroRecords: lang.noBusinessObjectsFound
          }
        });
        if (!this.options.multipleSelect || bus_att_metadata_mapping) {
          this.listenTo(this.resultTable,"row:selected", this._selectedRow);
        }
        else {
          this.listenTo(this.resultTable,"tableRowSelected", this._enableAttachBtn);
          this.listenTo(this.resultTable,"tableRowUnselected", this._disableAttachBtn);
        }
        this.tableRegion.show(this.resultTable);
      } else if (this.resultTable) {
        this.stopListening(this.resultTable);
        delete this.resultTable;
      }
    }

  });

  return BusinessObjectResultListView;
});
