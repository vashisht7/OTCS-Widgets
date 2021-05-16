/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette',                             
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'csui/widgets/search.custom/search.custom.view',
    'csui/utils/contexts/factories/search.query.factory',
    'csui/utils/contexts/factories/next.node',

    'conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model.factory', 
    'conws/widgets/outlook/impl/searchwksps/searchresult.view',
    'conws/widgets/outlook/impl/searchwksps/simplesearch.view',
    'conws/widgets/outlook/impl/searchwksps/wksptypes.view',
    'conws/widgets/outlook/impl/searchwksps/simplesearchresult.view',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/searchwksps',        // Template to render the HTML
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, CustomViewSearch, SearchQueryModelFactory, NextNodeModelFactory, searchwkspsModelFactory, SearchResultView, SimpleSearchView, WkspTypesView, SimpleSearchResultView, WkspUtil, CSService, lang, template) {

    window.wkspTypeSelected = function(wkspId, wkspName){
        $("#typeDropdown").addClass("hiddenArea");
        if (wkspId === -100){
            $("#wkspTypeMsg").addClass("hiddenArea");
            $("#wkspTypeMsg").removeClass("wkspTypeMsgDisplay");
            $("#wkspTypeMsg").html("");
        } else{
            $("#wkspTypeMsg").removeClass("hiddenArea");
            $("#wkspTypeMsg").addClass("wkspTypeMsgDisplay");
            $("#wkspTypeMsg").html(lang.search_selected_wksp_type + ": <span style='font-weight: bold' title='" + wkspName + "'>" + wkspName + "</span>");
        }
        WkspUtil.SelectedWkspTypeId = wkspId;
        if (WkspUtil.WkspSearchPerformed){
            $("#searchButton").click();
        }
    }

    var searchwkspsView = Marionette.CompositeView.extend({

    className: 'searchWksps-conwsoutlook panel panel-default',

    template: template,

    ui: {
        wkspNameBox: '#wkspName',
        searchButton: '#searchButton',
        searchClearButton: '#searchClearButton',
        searchFormDropdown: '#searchFormDropdown'
    },

    events: {
        'click #searchButton': 'searchWksps',
        'keyup #wkspName': 'searchWkspsTyping',
        'click #searchClearButton': 'clearSearch',
        'click #searchResultBackButton': 'clearSearch',
        'click #wkspTypeButton': 'openWkspTypeSelection',
        'keyup' : 'processKey',
        'focusin #searchButton': 'searchButtonFocused'
    },

    templateHelpers: function () {
        return {
            serverOrigin: window.ServerOrigin,
            supportFolder: window.ContentServerSupportPath,
            sectionTitle: lang.sectionTitle_search,
            helpTooltip: lang.help_button_tooltip,
            searchTooltip: lang.search_button_tooltip,
            searchClearTooltip: lang.search_clear_button_tooltip,
            wkspNamePlaceholder: lang.search_wkspName_placeholder,
            selectWkspType: lang.search_select_wksp_type,
            resultTitle: lang.search_result_title
        }
    },

    initialize: function(options) {
        
    },

    constructor: function searchwkspsView(options) {
        options.model = options.context.getModel(searchwkspsModelFactory);
        this.pageSize = options.pageSize ? options.pageSize : WkspUtil.pageSize;
        this.enableEmailSaving = options.enableEmailSaving;
        this.showSearchForm = options.showSearchFormSelection ? options.showSearchFormSelection : false;
        this.previousFormId = -1;

        this.context = options.context;

        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.listenTo(this.model, 'change', this.renderSearchForm);
        this.listenTo(this.model, 'error', this.renderError);
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#searchMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    renderSearchForm: function (model, response, options) {
        var self = this;
        var values = model.get('results');
        self.render();

        var wkspTypeSelection = "",
            selectionFormat = "<a href=\"javascript:wkspTypeSelected({0},'{1}');\" title='{1}' style='width:80vw; white-space:nowrap; overflow-x:hidden; text-overflow:ellipsis; display:flow-root list-item;'><div style='display:inline'>{1}</div></a>";
        for (var i = 0; i < values.length; i++){
            var val = values[i];
            var name = val.data.properties.wksp_type_name,
                id = val.data.properties.wksp_type_id;
            wkspTypeSelection += _.str.sformat(selectionFormat, id, name);
        }
        self.$('#typeDropdown').html(wkspTypeSelection);
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },

    processKey: function(e) {
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "wkspTypeButton"){
                this.openWkspTypeSelection(e);
            } else if (e.target.id === "searchButton"){
                this.searchWksps(e);
            } else if (e.target.id === "searchClearButton" || e.target.id === "searchResultBackButton"){
                this.clearSearch(e);
            }

        }
    },

    searchButtonFocused: function(e){
        $("#typeDropdown").addClass("hiddenArea");
    },

    searchWksps: function(args) {
        var self = this,
            wkspName = self.$('#wkspName').val(),
            wkspTypeId = WkspUtil.SelectedWkspTypeId,
            searchClearButton = self.$('#searchClearButton'),
            msg = '';

        WkspUtil.uiShow("searchResultHeading");
        WkspUtil.uiHide("nonSearchSections");

        searchClearButton.css("display", "block");
        var resultRegion = new Marionette.Region({
            el: '#search-result'
        });

        if (wkspTypeId === -100 && wkspName === "") {
            msg = lang.search_noCondition;
            resultRegion.$el.hide();
        } else {
            msg = '';
            resultRegion.$el.show();
            var typeAhead = args.target.id === "wkspName";
            var resultView = new SearchResultView({
                connector: this.model.connector,
                wkspTypeId: wkspTypeId,
                wkspName: wkspName,
                typeAhead: typeAhead,
                pageSize: this.pageSize,
                pageNo: 1,
                enableEmailSaving: this.enableEmailSaving
            });

            WkspUtil.WkspSearchPerformed = true;
            resultRegion.show(resultView);
            WkspUtil.startGlobalSpinner();
        }
        this.renderMessage(msg);
    },

    clearSearch: function(args) {
        var self = this,
            wkspName = self.$('#wkspName'),
            searchClearButton = self.$('#searchClearButton'),
            resultRegion = new Marionette.Region({
                el: '#search-result'
            });

        wkspName.val('');
        searchClearButton.css("display", "none");
        resultRegion.$el.hide();

        WkspUtil.uiHide("searchResultHeading");
        WkspUtil.uiShow("nonSearchSections");

        WkspUtil.SelectedWkspTypeId = -100;
        WkspUtil.WkspSearchPerformed = false;
        WkspUtil.uiHide("wkspTypeMsg");
        $("#wkspTypeMsg").removeClass("wkspTypeMsgDisplay");
        $("#wkspTypeMsg").html("");

        this.renderMessage('');
        $("#conwsoutlook-body").focus();
    },

    searchWkspsTyping: function (args) {
        var view = this,
            wkspName = view.$('#wkspName').val();
        if (wkspName.length >= 2) {
            this.searchWksps(args);
        }
    },

    openWkspTypeSelection: function() {
        $("#typeDropdown").toggleClass("hiddenArea");
    }

  });

  return searchwkspsView;

});
