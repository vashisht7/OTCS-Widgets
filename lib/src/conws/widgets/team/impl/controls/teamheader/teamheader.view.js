/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/marionette',
    'i18n!conws/widgets/team/impl/nls/team.lang',
    'hbs!conws/widgets/team/impl/controls/teamheader/impl/teamheader',
    'css!conws/widgets/team/impl/controls/teamheader/impl/teamheader'
], function(_, $, Marionette, lang, template){

    var TeamHeaderView = Marionette.LayoutView.extend({

        className: 'conws-teamheader',

        template: template,

        constructor: function TeamHeaderView(options){
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            options || (options = {});
        },

        templateHelpers: function(){
            return {
                primaryTitle: this.options.primaryTitle,
                secondaryTitle: this.options.secondaryTitle
            }
        }
    });

    return TeamHeaderView;
});
