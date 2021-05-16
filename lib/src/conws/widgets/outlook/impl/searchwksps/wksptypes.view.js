/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    "csui/lib/jquery",
    'csui/lib/backbone',
    'csui/lib/marionette',
    'hbs!conws/widgets/outlook/impl/searchwksps/impl/wksptype' 
], function (_, $, Backbone, Marionette, template) {

    var WkspTypesView = Marionette.LayoutView.extend({
        tagName: 'option',

        template: template,

        templateHelpers: function () {
            return {
                value: this.id,
                name: this.name
            }
        },

        initialize: function (options) {
            var wkspTypes = options.model.get('results');
            this.collection = new Backbone.Collection(wkspTypes);
        },

        constructor: function WkspTypesView(options) {
            this.model = options.model;
            this.name = options.model.get('data').properties.wksp_type_name;
            this.id = options.model.get('data').properties.wksp_type_id;

            Marionette.LayoutView.prototype.constructor.call(this, options);
        },

        onRender: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        }
    });

    return WkspTypesView;

});