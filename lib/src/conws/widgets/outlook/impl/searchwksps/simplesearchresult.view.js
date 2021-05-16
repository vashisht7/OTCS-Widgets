/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',

    'csui/utils/contexts/factories/search.query.factory',
    'csui/utils/contexts/factories/search.results.factory',

    'conws/widgets/outlook/impl/searchwksps/impl/simplesearchresult.model', 

    'conws/widgets/outlook/impl/wksp/wksp.view',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/searchresult',
    'css!conws/widgets/outlook/impl/conwsoutlook'       
], function ($, _, Marionette, Backbone, SearchQueryModelFactory,
    SearchResultsCollectionFactory, SimpleSearchResultModel, WkspView, WkspUtil, lang, template) {

  var simpleSearchresultView = Marionette.CompositeView.extend({

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

    constructor: function simpleSearchresultView(options) {

        this.enableEmailSaving = options.enableEmailSaving;
        this.pageNo = options.pageNo;
        this.pageSize = options.pageSize;
        this.context = options.context;

        if (!options.query) {
            options.query = this.context.getModel(SearchQueryModelFactory);
        }

        options.model = new SimpleSearchResultModel({}, options);
        this.model = options.model;

        Marionette.CompositeView.prototype.constructor.call(this, options);
        this.listenTo(this.model, 'change', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);

        this.model.fetch();
    },

    retrieveNextPage: function (options) {
        var collection = this.model.get('collection');
        var paging = collection.paging == null ? null : collection.paging;
        if (paging && paging.links && paging.links.next && paging.links.next.href) {
            WkspUtil.startGlobalSpinner();
            this.model.nextPageUrl = paging.links.next.href;
            this.model.fetch();
        }
    },

    renderWksps: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this,
            collection = model.get('collection');
        var paging = collection.paging == null ? null : collection.paging;
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
        }

        var nextButton = self.$('#moreSearchWksp');
        if (paging && paging.links && paging.links.next && paging.links.next.href) {
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

  return simpleSearchresultView;

});
