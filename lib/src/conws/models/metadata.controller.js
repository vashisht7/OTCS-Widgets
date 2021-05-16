/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/utils/url",
  "csui/utils/base"
], function (_, $, Backbone, Url, base) {
  function MetadataController(status, options, attributes) {
    this.status = status || {};
    this.options = options || {};
    this.attributes = attributes || {};
  }

  _.extend(MetadataController.prototype, Backbone.Events, {

    save: function (model, data) {

      return model.save(data, {
        wait: true,
        patch: true
      });
    },

    createItem: function (model, formsValues) {
      if (!model.connector) {
        return $.Deferred().reject();
      }

      if(!!model && !!model.attributes && !!model.attributes.parent_id){
        formsValues.source_parent_id = model.attributes.parent_id;
      }
      var formData = new FormData();
      formData.append('body', JSON.stringify(_.extend({
        template_id: this.options.template ? this.options.template.id : undefined
      },formsValues)));

      var url = model.connector.connection.url;
      var options = {
        type: 'POST',
        url: Url.combine(url&&url.replace('/v1', '/v2')||url, "businessworkspaces"),
        data: formData,
        contentType: false,
        processData: false
      };

      model.connector.extendAjaxOptions(options);

      var collection = this.options.collection;
      return model.connector.makeAjaxCall(options)
        .then(function (response) {
          model.set(response.results, { silent: true });
          model.collection = collection;
          model.attributes.sub_folder_id = response.results.sub_folder_id;
          return model.fetch({ collection: collection });
        });
    }

  });

  MetadataController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataController, {version: "1.0"});

  return MetadataController;
});
