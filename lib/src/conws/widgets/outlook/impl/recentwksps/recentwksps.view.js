/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model.factory',
    'conws/widgets/outlook/impl/wksp/wksp.view',

    'i18n!conws/widgets/outlook/impl/nls/lang',      
    'hbs!conws/widgets/outlook/impl/recentwksps/impl/recentwksps',
    'conws/widgets/outlook/impl/utils/utility',
    'css!conws/widgets/outlook/impl/conwsoutlook'
], function ($, _, Marionette, Backbone, recentwkspsModelFactory, WkspView, lang, template, WkspUtil) {
  var recentwkspsView = Marionette.CompositeView.extend({
    className: 'recentWksps-conwsoutlook panel panel-default',

    template: template,

    childView: WkspView,

    childViewContainer: '#recent-list',

    templateHelpers: function() {
        return {
            sectionTitle: lang.sectionTitle_recent,
            showMoreLink: lang.showMore_link,
            showMoreWkspTitle: lang.showMore_wksp
        }
    },

    events: {
        'click #moreRecentWksp': 'retrieveNextPage',
        'click #recentToggleIcon': 'toggleIconClicked',
        'keyup' : 'processKey'
    },

    constructor: function recentwkspsView(options) {
        options.model = options.context.getModel(recentwkspsModelFactory);

        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.listenTo(this.model, 'change', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);
    },

    renderWksps: function (model, response, options) {
        WkspUtil.stopGlobalSpinner();

        var self = this,
            values = model.get('results'),
            paging = model.get('paging');

        var isFirstPage = paging == null || paging.actions == null || paging.actions.previous;

        if (values.length === 0 && isFirstPage) {
            if (paging && paging.page === 1) {
                self.renderMessage(lang.noWksp_recent);
                $("#recentToggleIcon").click();
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
        $("#recentCount").html("(" + paging.total_count + ")");

        var nextButton = self.$('#moreRecentWksp');
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            nextButton.css("display", "block");
        } else {
            nextButton.css("display", "none");
        }
    },

    retrieveNextPage: function (options) {
        var paging = this.model.get("paging");
        if (paging && paging.actions && paging.actions.next && paging.actions.next.href) {
            WkspUtil.startGlobalSpinner();
            this.model.nextPageUrl = paging.actions.next.href;
            this.model.fetch();
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

        self.renderMessage(_.str.sformat(lang.error_retrieve_recent, msg));
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#recentWkspMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    processKey: function(e) {
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "recentToggleIcon"){
                this.toggleIconClicked(e);
            } 
        }
    },

    toggleIconClicked: function(args){
        WkspUtil.collapsibleClicked("recent");
    }

  });

  return recentwkspsView;
});
