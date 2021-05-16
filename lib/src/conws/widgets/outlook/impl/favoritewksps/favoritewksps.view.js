/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model.factory',
    'conws/widgets/outlook/impl/wksp/wksp.view',
    'conws/widgets/outlook/impl/wksp/impl/wksp.model',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps',
   'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, favoritewkspsModelFactory, WkspView, WkspModel, WkspUtil, lang, template) {
  var favoritewkspsView = Marionette.CompositeView.extend({

    className: 'favoriteWksps-conwsoutlook panel panel-default',

    template: template,

    childView: WkspView,

    childViewContainer: '#favorite-list',

    templateHelpers: function () {
        return {
            sectionTitle: lang.sectionTitle_favorite,
            showMoreLink: lang.showMore_link,
            showMoreWkspTitle: lang.showMore_wksp
        }
    },

    events: {
        'click #moreFavoriteWksp': 'retrieveNextPage',
        'click #favoriteToggleIcon': 'toggleIconClicked',
        'keyup' : 'processKey'
    },

    initialize: function(options) {

    },

    constructor: function favoritewkspsView(options) {
        options.model = options.context.getModel(favoritewkspsModelFactory);
        Marionette.CompositeView.prototype.constructor.call(this, options);

        this.pageIndex = 0;
        this.pageSize = WkspUtil.pageSize;

        this.listenTo(this.model, 'change', this.renderWksps);
        this.listenTo(this.model, 'error', this.renderError);
    },

    renderWksps: function (model, response, options) {
        var self = this;
        var values = model.get('results'),
            totalCount = values.length;

        if (totalCount === 0) {
            self.renderMessage(lang.noWksp_favorite);
            $("#favoriteToggleIcon").click();
        } else {
            var end;
            if (self.pageIndex === 0){
                end = totalCount > self.pageSize ? self.pageSize : totalCount;
                self.collection = new Backbone.Collection(values.slice(0, end));
                self.render();
            } else {
                var start = self.pageIndex * self.pageSize,
                    fullPageCount = (self.pageIndex + 1) * self.pageSize,
                    origLength = self.collection.length; //original length before addition;
                
                end = totalCount > fullPageCount ? fullPageCount : totalCount,

                self.collection.add((new Backbone.Collection(values.slice(start, end))).toJSON());
                self._addItems(self.collection.slice(origLength), origLength); //get latest added models    
            }
        }

        $("#favoriteCount").html("(" + totalCount + ")");
        
        var nextButton = self.$('#moreFavoriteWksp'),
            display = (self.pageIndex + 1) * self.pageSize < totalCount ? "block" : "none"; 
        nextButton.css("display", display);
    },

    retrieveNextPage: function (options) {
        var self = this;
        self.pageIndex++;
        self.renderWksps(self.model);
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
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(_.str.sformat(lang.error_retrieve_favorite, msg));
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
            if (e.target.id === "favoriteToggleIcon"){
                this.toggleIconClicked(e);
            } 
        }
    },

    toggleIconClicked: function(args){
        WkspUtil.collapsibleClicked("favorite");
    }

  });

  return favoritewkspsView;

});
