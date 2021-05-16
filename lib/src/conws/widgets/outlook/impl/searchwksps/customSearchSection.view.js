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
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/customsearch',        // Template to render the HTML
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, CustomViewSearch, SearchQueryModelFactory, NextNodeModelFactory, searchwkspsModelFactory, SearchResultView, SimpleSearchView, WkspTypesView, SimpleSearchResultView, WkspUtil, CSService, lang, template) {

    var customSearchSectionView = Marionette.CompositeView.extend({

    className: 'searchWksps-conwsoutlook panel panel-default',

    template: template,


    ui: {
        searchFormDW: '#searchFormDW'
    },

    events: {
        'change #searchFormDW': 'searchFormChange',
        'click #customSearchResultBack': 'backToSearchForm',
        'click #customSearchBack': 'backToStandard',
        'keyup #customSearchBack, #customSearchResultBack': 'processKey'
    },

    templateHelpers: function () {
        return {
            serverOrigin: window.ServerOrigin,
            supportFolder: window.ContentServerSupportPath,
            sectionTitle: lang.sectionTitle_customSearch,
            selectSearchForm: lang.search_select_form,
            resultTitle: lang.search_result_title
        }
    },

    initialize: function(options) {
        
    },

    constructor: function searchwkspsView(options) {
        this.pageSize = options.pageSize ? options.pageSize : WkspUtil.pageSize;
        this.enableEmailSaving = options.enableEmailSaving;
        this.showSearchForm = options.showSearchFormSelection ? options.showSearchFormSelection : false;
        this.previousFormId = -1;
        this.queries = options.queries;

        this.context = options.context;

        Marionette.CompositeView.prototype.constructor.call(this, options);

        var self = this;
        setTimeout(function(){self.renderSearchForm();});

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
        self.render();

        if (self.queries != null && self.queries.length !== 0) {
            self.$('#searchFormListDiv').css("display", "block");
            var optionFormat = "<option value='{0}'>{1}</option>";
            var formOptions = ""; // = _.str.sformat(optionFormat, -1, lang.search_wksp_typeName);
            for (var i = 0; i < self.queries.length; i++) {
                var query = self.queries[i];
                formOptions = formOptions + _.str.sformat(optionFormat, query[1], query[0]);
            }
            self.$('#searchFormDW').html(formOptions);

            var context = new PageContext({ factories: { connector: self.options.context.connector } });
            context.connector = self.options.context.connector;

            var searchFormRegion = new Marionette.Region({
                    el: '#searchFormDiv'
            });
            WkspUtil.writeTrace("Showing custom search view for ID: ." + self.queries[0][1]);
            var queryView = new SimpleSearchView({ context: context, savedSearchQueryId: self.queries[0][1] });
            searchFormRegion.show(queryView);
            self.refreshQueryModel(context);
            context.fetch();
        }
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },

    processKey: function(e){
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "customSearchBack"){
                this.backToStandard(e);
            } else if(e.target.id === "customSearchResultBack"){
                this.backToSearchForm(e);
            }
        }
    },

    searchFormChange: function (args) {
        var self = this,
            formId = self.$('#searchFormDW').val();

        this.renderMessage('');
        var resultRegion = new Marionette.Region({ el: '#customSearchResult' });
        resultRegion.$el.empty();
        var forceRender = $('#csui-custom-search-form-submit').hasClass('csui-search-form-submit-disabled');

        if (formId === "-1") {
            self.$('#searchFormWkspTypeName').css("display", "block");
            self.$('#searchFormDiv').css("display", "none");
        } else {
            self.$('#searchFormWkspTypeName').css("display", "none");
            self.$('#searchFormDiv').css("display", "block");
            if (forceRender || self.previousFormId !== formId) {
                WkspUtil.startGlobalSpinner();
                self.previousFormId = formId;

                var context = new PageContext({ factories: { connector: self.options.context.connector } });
                context.connector = self.options.context.connector;

                var searchFormRegion = new Marionette.Region({
                        el: '#searchFormDiv'
                });
                WkspUtil.writeTrace("Showing custom search view for ID: ." + formId);
                var queryView = new SimpleSearchView({ context: context, savedSearchQueryId: formId });
                searchFormRegion.show(queryView);
                self.refreshQueryModel(context);
                context.fetch();
            }
        }
    },

    refreshQueryModel: function (context) {
        var self = this;
        var queryModel = context.getModel(SearchQueryModelFactory);
        history.pushState = function() {};

        queryModel.on('change', Function.createDelegate(this,  //The search button is clicked
            function (event) {
                var searchResultsRegion = new Marionette.Region({el: '#customSearchResult'});
                var searchResultsView = new SimpleSearchResultView({
                        context: context,
                        pageSize: self.pageSize,
                        pageNo: 1,
                        enableEmailSaving: self.enableEmailSaving
                    });
                WkspUtil.startGlobalSpinner();
                WkspUtil.uiHide("customSearchFormArea");
                WkspUtil.uiShow("customSearchResultArea");
                searchResultsRegion.show(searchResultsView);
            }));

        context.fetch();
    },

    backToSearchForm: function(args){
        WkspUtil.uiShow("customSearchFormArea");
        WkspUtil.uiHide("customSearchResultArea");
        $("#conwsoutlook-body").focus();
    },

    backToStandard: function(args){
        WkspUtil.uiShow("standardSections");
        WkspUtil.uiShow("customSearchButton");
        WkspUtil.uiHide("customSearchSection");

        WkspUtil.PreSaveSection = "standardSections";
        $("#conwsoutlook-body").focus();
    }

  });

  return customSearchSectionView;

});
