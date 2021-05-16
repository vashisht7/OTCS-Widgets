/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/controls/list/emptylist.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/models/selectedmetadataform/selectedmetadataform.factory',
  'conws/controls/selectedmetadataform/selectedmetadataform.view',
  'i18n!xecmpf/widgets/header/impl/nls/header.lang'
], function (_, $, Marionette, Handlebars,
    EmptyListView, PerfectScrollingBehavior,
    WorkspaceContextFactory, SelectedMetadataFormFactory, SelectedMetadataFormView, lang) {

  var MetadataView = Marionette.ItemView.extend({
    className: 'xecmpf-form-metadata',

    attributes: {
      style: 'height: 100%'
    },

    template: false,

    constructor: function MetadataView(options) {
      options || (options = {});
      if (!options.context) {
        throw new Error('Context is missing in the constructor options');
      }
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
      }
      options.workspaceContext.setWorkspaceSpecific(SelectedMetadataFormFactory);
      options.model = options.workspaceContext.getObject(SelectedMetadataFormFactory, {
        metadataConfig: options.data,
        unique: true
      });

      this.noMetadataMessage = lang.noMetadataMessage;

      Marionette.ItemView.prototype.constructor.call(this, options);

      this.listenTo(options.model, 'change', this.render);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: this.$el,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    onRender: function () {
      this.formRegion = new Marionette.Region({el: this.$el});
      if (!_.isEmpty(this.model.attributes.data)) {
        this.noDataFound = false;
        var metadata = this.model.attributes.data;
        var colOptions = this.options.data.colOptions;
        var fields = this.model.attributes.options.fields;
        _.each(_.keys(metadata), function (key) {
          if (metadata[key] === "null") {
            metadata = _.omit(metadata, key);
            fields[key].hidden = true;
          }
        });
        this.model.attributes.data = metadata;
        this.model.attributes.options.fields = fields;
        if(colOptions === "doubleCol") {
          var count = _.size(_.filter(_.keys(fields), function(key){
            return fields[key].hidden !== undefined && fields[key].hidden === false;
          }));
          colOptions = count > 5 ? "doubleCol" : "singleCol";
        }

        this.formView = new SelectedMetadataFormView({
          model: this.model,
          context: this.options.context,
          layoutMode: !!colOptions && colOptions === 'singleCol' ? colOptions : 'doubleCol',
          breakFieldsAt: 5
        });
        this.formRegion.show(this.formView);
        this.triggerMethod("xecmpf:metadata:config");
      } else {
        this.noDataFound = true;
        this.formView = new EmptyListView({text: this.noMetadataMessage});
        this.formRegion.show(this.formView);
        this.triggerMethod("xecmpf:metadata:config");
      }
      this.listenTo(this.formView, 'render:form', function () {
        this.triggerMethod("dom:refresh");
      });
    }
  });

  return MetadataView;
});
