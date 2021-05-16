/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/url", "csui/models/resource"
], function (module, $, _, Backbone, log, Url, ResourceModel) {
  "use strict";

  var BusinessObjectSearchFormModel = Backbone.Model.extend(
      _.defaults({

        constructor: function BusinessObjectSearchFormModel(attributes, options) {
          options || (options = {});

          attributes = _.extend({data:{},options:{},schema:{}},attributes);
          Backbone.Model.prototype.constructor.call(this, attributes, options);

          this.makeResource(options);

        },

        url: function () {
          var path = 'forms/businessobjects/search',
              bo_type_id = this.get("id"),
              params = { bo_type_id: bo_type_id },
              resource = path + '?' + $.param(params),
              baseurl = this.connector.connection.url,
              url = Url.combine(baseurl&&baseurl.replace('/v1', '/v2')||baseurl, resource);
          return url;
        },

        parse: function (response) {
          var form;
          if (response && response.results) {
            form = response.results[1];
            form.id = this.get("id");
            form.name = response.results[0].data.bo_type_name;
            form.bus_att_metadata_mapping = response.results["0"].data.business_attachments && response.results["0"].data.business_attachments.metadata_mapping;
            if (form.schema) {
              delete form.schema.title; // avoid title being displayed by the FormView
            }
          }
          return form;
        }

      }, ResourceModel(Backbone.Model)));
  
  return BusinessObjectSearchFormModel;

});
