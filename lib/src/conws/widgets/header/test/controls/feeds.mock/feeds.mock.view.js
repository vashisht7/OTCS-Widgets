/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
    'csui/lib/backbone',
    'csui/lib/marionette',
    'hbs!conws/widgets/header/test/controls/feeds.mock/feeds.mock',
    'css!conws/widgets/header/test/controls/feeds.mock/feeds.mock'
    ], function(Backbone, Marionette, feedsTemplate ){

    var FeedsView = Marionette.ItemView.extend({

        className: 'conws-feeds',

        template: feedsTemplate,

        constructor: function FeedsView(options){
            options || (options = {});
            if (!options.model){
                options.model = new Backbone.Model({});
            }
            Marionette.ItemView.prototype.constructor.call(this, options);
        }
    });

    return FeedsView;
});
