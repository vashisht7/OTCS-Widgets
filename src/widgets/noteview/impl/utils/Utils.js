define([
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!otcss/widgets/noteview/impl/utils/csviewer'
], function (_, Backbone, Marionette, csviewerhbs) {
  var Utils = {
    getDropdownItems: function (namesOfDocs) {
      return {
        id: 'selectField',
        collection: new Backbone.Collection(namesOfDocs),
        model: new Backbone.Model({
          options: {
            isMultiFieldItem: false,
            selected: true,
            mode: 'read', // 'read', 'readonly', 'writeonly' ?
          },
        }),
        mode: 'read',
        alpaca: {
          schema: {
            title: 'URL',
            type: 'string',
          },
          options: {
            setRequiredFieldsEditable: false,
          },
        },
      };
    },
    getCSViewer: function (docIds, currentPageObj, pageDropDownEvent) {
      var csviewer = Marionette.ItemView.extend({
        className: 'csv',
        template: csviewerhbs,
        constructor: function (options) {
          options || (options = {});
          Marionette.ItemView.prototype.constructor.apply(
            this,
            arguments
          );
        },
        onRender: function () {
          var self = this;
          require(['csv/widgets/csviewer/csviewer.view'], function (
            csv
          ) {
            this.csvRegion = new Marionette.Region({
              el: self.$el,
            });
            this.options.data = { id: docIds[pageDropDownEvent.fieldvalue] };
            this.csvView = new csv(_.extend({}, this.options));
            this.csvRegion.show(this.csvView);
          }.bind(currentPageObj));
        },
      });
      return csviewer;
    }
  };
  return Utils;
});
