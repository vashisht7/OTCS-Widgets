/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette',                             
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/searchwksps/impl/searchresult.model', 
    'conws/widgets/outlook/impl/wksp/wksp.view',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/searchresult',        
    'css!conws/widgets/outlook/impl/conwsoutlook'       
], function ($, _, Marionette, Backbone, SearchResultModel, WkspView, WkspUtil, lang, template) {

    var searchresultView = Marionette.CompositeView.extend({

    className: 'wksp-srch-results',

    template: template,

    childView: WkspView,

    childViewContainer: '#searchresult-list',

    templateHelpers: function () {
        return {
            showMoreLink: lang.showMore_link,
            showMoreWkspTitle: lang.showMore_wksp
        }
    },

    ui: {
        srchResultMessage: '#searchResultMsgArea',
        srchResultList: '#searchresult-list'
    },

    events: {
        'click #moreSearchWksp': 'retrieveNextPage'
    },

    initialize: function(options) {
    },

    constructor: function searchresultView(options) {
        options.model = new SearchResultModel({}, options);
        this.enableEmailSaving = options.enableEmailSaving;

        this.typeAhead = options.typeAhead;
        this.wkspName = options.wkspName;
        this.pageNo = options.pageNo;
        
        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.listenTo(this.model, 'change', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);
        options.model.fetch();    
    },

    retrieveNextPage: function (options) {
        var paging = this.model.get("paging");
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            WkspUtil.startGlobalSpinner();
            this.model.nextPageUrl = paging.actions.next.href;
            this.model.fetch();
        }
    },

    renderWksps: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this,
            paging = model.get('paging');
        var isFirstPage = paging == null || paging.actions == null || paging.actions.previous;
        var values = model.get('results');
        _.each(values, function (value){
            value.enableEmailSaving = self.enableEmailSaving;
        });

        if (values.length === 0 && isFirstPage) {
            if (self.pageNo === 1) {
                self.renderMessage(lang.noWksp_search);
            }
        } else {
            if (self.collection == null) {
                self.collection = new Backbone.Collection(values);
                self.render();
            } else {
                var origLength = self.collection.length; //original length before addition
                self.collection.add((new Backbone.Collection(values)).toJSON());
                self._addItems(self.collection.slice(origLength), origLength); //get latest added models
            }
            if (self.typeAhead) {
                self.highlight(self, self.wkspName);
            }
        }

        var nextButton = self.$('#moreSearchWksp');
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            nextButton.css("display", "block");
        } else {
            nextButton.css("display", "none");
        }

    },

    _addItems: function (models, collIndex) {
        var self = this,
            ChildView;

        _.each(models, function (model, index) {
            ChildView = self.getChildView(model);
            self._addChild(model, ChildView, collIndex + index);
        });
    },

    _addChild: function (child, ChildView, index) {
        return Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
    },

    highlight: function(view, name) {
        if (name){
            var regex = RegExp(name, 'gi'),
                replacement = "<u style='font-weight: bold'>$&</u>"; // need to use inline style, otherwise it will be overridden. 
            view.$('div.listItemWkspName').each(function() {
                $(this).html($(this).html().replace(regex, replacement));
            });
        }
    },

    renderError: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(_.str.sformat(lang.error_retrieve_search, msg));
    },

    renderMessage: function (msg) {
        var self = this;        

        if (msg) {
            self.ui.srchResultMessage.text(msg);
            self.ui.srchResultMessage.css("display", "block");
            self.ui.srchResultList.css("display", "none");
        } else {
             self.ui.srchResultMessage.css("display", "none");
            self.ui.srchResultList.css("display", "block");
        }
    }
  });

  return searchresultView;

});
