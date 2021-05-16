/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',  
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/backbone',

  'conws/widgets/outlook/impl/wksp/wksp.view',

  'i18n!conws/widgets/outlook/impl/nls/lang',      
   'hbs!conws/widgets/outlook/impl/suggestedwksps/impl/suggestedwksps',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',
   'css!conws/widgets/outlook/impl/conwsoutlook'
    
], function ($, _, Marionette, Backbone, WkspView, lang, template, WkspUtil, CSService) {
  var suggestedwkspsView = Marionette.CompositeView.extend({
    className: 'suggestedWksps-conwsoutlook panel panel-default',

    template: template,

    childView: WkspView,

    childViewContainer: '#suggested-list',

    templateHelpers: function() {
        return {
            sectionTitle: lang.sectionTitle_suggested
        }
    },

    events: {
        'click #suggestedToggleIcon': 'toggleIconClicked',
        'keyup' : 'processKey'
    },

    constructor: function suggestedwkspsView(options) {
        var self = this;
        Marionette.CompositeView.prototype.constructor.call(this, options);

        self.error = options.error;
        self.config = options.config;
        self.connector = options.context.connector;

        setTimeout(function() {
            WkspUtil.startLocalSpinner('suggestedWkspSpinner');
            self.renderMessage(self, lang.info_retrieving);
        });

        if (options.error) {
            setTimeout(function () {
                WkspUtil.stopLocalSpinner('suggestedWkspSpinner');
                self.renderError(options.error);
            });
        } else {
            var promise = CSService.getSuggestedWksps(options.context.connector, window.CurrentEmailItem, options.config);
            promise.done(function (data) { self.renderWksps(data) });
            promise.fail(function (error) { self.renderError(error) });        
        }
    },

    renderWksps: function (data) {
        WkspUtil.stopLocalSpinner('suggestedWkspSpinner');

        var self = this;
        self.collection = new Backbone.Collection(data.results);
        self.render();
        var msg = "";
        if (self.collection.length === 0) {
            msg = lang.noWksp_suggested;

            $("#suggestedToggleIcon").click();
        }

        $("#suggestedCount").html("(" + self.collection.length + ")");

        if (data.errors != null && data.errors.length > 0) {
            var errorMsg = data.errors.join("<br/>");
            errorMsg = _.str.sformat(lang.error_retrieve_suggested, errorMsg);
            msg = msg === "" ? errorMsg : msg + "<br/>" + errorMsg;
        }

        if (msg !== "") {
            self.renderMessage(self, msg);
        }
    },

    refresh: function(){
        var self = this;
        if (self.error){
            return;
        }

        WkspUtil.writeTrace("The suggested workspaces is being refreshed....");
        
        setTimeout(function() {
            WkspUtil.startLocalSpinner('suggestedWkspSpinner');
            self.renderMessage(self, lang.info_retrieving);
        });
        var promise = CSService.getSuggestedWksps(self.connector, window.CurrentEmailItem, self.config);
        promise.done(function (data) { self.renderWksps(data) });
        promise.fail(function (error) { self.renderError(error) });        
    },

    renderError: function (error) {
        WkspUtil.stopLocalSpinner('suggestedWkspSpinner');
        var self = this;
        var msg = error.responseJSON != null ? error.responseJSON.error : error;
        
        self.renderMessage(self, _.str.sformat(lang.error_retrieve_suggested, msg));
    },

    renderMessage: function (self, msg) {
        var msgArea = self.$('#suggestedWkspMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    processKey: function(e) {
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "suggestedToggleIcon"){
                this.toggleIconClicked(e);
            } 
        }
    },

    toggleIconClicked: function(args){
        WkspUtil.collapsibleClicked("suggested");
    }
  });

  return suggestedwkspsView;

});
