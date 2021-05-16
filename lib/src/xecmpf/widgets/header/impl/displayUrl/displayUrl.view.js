/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/widgets/header/impl/previewpane/previewpane.view',
  'hbs!xecmpf/widgets/header/impl/displayUrl/impl/displayUrlItem',
  'hbs!xecmpf/widgets/header/impl/displayUrl/impl/displayUrl',
  'i18n!xecmpf/widgets/header/impl/displayUrl/impl/nls/lang',
  'css!xecmpf/widgets/header/impl/displayUrl/impl/displayUrl'
], function (_, $, Backbone, Marionette, ModalAlert, PreviewPaneView, itemTemplate,
    layoutTemplate, lang) {

  var DisplayUrlItemView = Marionette.ItemView.extend({

    className: 'xecmpf-displayUrl-item',

    constructor: function DisplayUrlItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.options.collection, 'change', this.render);

      if (this.options && this.options.preview &&
          options.collection.length > 1
      ) {
        this.previewPane = new PreviewPaneView({
          parent: this,
          config: {debug: true},
          collection: options.collection,
          headerTitle: lang.displayUrlTitle,
          headerColor: options.headerColor
        });
      }
    },

    events: {
      "click .xecmpf-displayUrl-error": 'showError'
    },

    template: itemTemplate,

    templateHelpers: function () {
      var displayUrl = (this.options.collection.length === 1) ?
                       this.options.collection.models[0].get('displayUrl') : false;

      var displayUrlError = (this.options.collection.length === 1) ?
                            this.options.collection.models[0].get('displayUrlError') : "";
      var ariaLabelBusApplText = lang.ariaLabelBusApplText + (displayUrl ?
                                 ' ' +
                                 this.options.collection.models[0].get('external_system_name') :
                                                              '');
      var displayUrlTooltip = displayUrl ? lang.displayUrlTooltip : '';

      return {
        ariaLabelBusApplText: ariaLabelBusApplText,
        displayUrlTooltip: displayUrlTooltip,
        displayUrl: displayUrl,
        displayUrlError: displayUrlError
      }
    },

    onBeforeDestroy: function () {
      if (this.previewPane) {
        this.previewPane.destroy();
        delete this.previewPane;
      }
    },

    showError: function () {
      ModalAlert.showError(this.options.collection.models[0].get('displayUrlError'));
    }

  });

  var DisplayUrlView = Marionette.LayoutView.extend({

    className: 'xecmpf-displayUrlcheck',

    constructor: function DisplayUrlView(options) {
      options || (options = {});
      this.model = options.model;
      this.options.headerColor = 'xecmpf-displayUrl-header-background';
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    template: layoutTemplate,

    templateHelpers: function () {
      var bDisplayUrl = (this.model.display_urls && (this.model.display_urls.length > 0)) ?
                        true : false;
      return {
        bDisplayUrl: bDisplayUrl
      }
    },

    regions: {
      displayUrlRegion: '#displayUrl-check'
    },

    onRender: function () {
      var collection;
      if (this.model.display_urls && this.model.display_urls.length >= 1) {
        var displayUrlArray = _.map(this.model.display_urls, function (item) {
          var name = item.business_object_type_name + ' (' + item.external_system_name +
                     ')';
          return {
            name: name,
            displayUrl: item.displayUrl,
            external_system_name: item.external_system_name,
            displayUrlError: item.errMsg
          }
        });
        collection = new Backbone.Collection();
        collection.add(displayUrlArray);

        this.displayUrlRegion.show(new DisplayUrlItemView({
          collection: collection,
          preview: {debug: true},
          headerColor: this.options.headerColor
        }));
      }
    }
  });

  return DisplayUrlView;

});
