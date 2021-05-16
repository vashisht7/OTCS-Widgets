/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/underscore',
  'csui/utils/url',
  'csui/models/node/node.model'
], function ($, Backbone, _, Url, NodeModel) {
  'use strict';

  var WFStatusInfoModel = Backbone.Model.extend({

    constructor: function WFStatusInfoModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {
      var baseUrl      = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl       = Url.combine(baseUrl, 'workflows/status'),
          processId    = this.get('process_id');
      getUrl += "/processes/" + processId ;
      return getUrl;
    },

    parse: function (response) {

      return response.results;

    },

    stopWorkflow: function (options) {
      var baseUrl  = this.connector.connection.url.replace('/v1', '/v2'),
          postUrl  = Url.combine(baseUrl, 'workflows', 'actions'),
          formData = new FormData(),
          content  = {
            process_id: options.process_id,
            subprocess_id: options.subprocess_id,
            action: options.action
          },
          dfd      = $.Deferred();

      formData.append('body', JSON.stringify(content));
      var ajaxOptions = {
        type: 'POST',
        url: postUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector && this.connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(function (resp) {
            dfd.resolve(resp);
          })
          .fail(function (resp) {
            var responseMsg = "";
            if (resp.responseText) {
              responseMsg = JSON.parse(resp.responseText);
            }
            dfd.reject(responseMsg);
          });
      return dfd;
    },
    deleteWorkflow: function (processId) {
      var self        = this,
          connector   = self.connector,
          baseUrl     = connector.connection.url.replace('/v1', '/v2'),
          postUrl     = Url.combine(baseUrl, 'processes', processId),
          type        = 'DELETE',
          deferred    = $.Deferred(),
          ajaxOptions = {
            type: type,
            url: postUrl,
            contentType: false,
            processData: false
          };
      connector && connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(function (resp) {
            deferred.resolve(resp);
          })
          .fail(function (resp) {
            var responseMsg = "";
            if (resp.responseText) {
              responseMsg = JSON.parse(resp.responseText);
            }
            deferred.reject(responseMsg);
          });
      return deferred;
    },

    reset: function (options) {
      this.clear(options);
      if (!_.isUndefined(this.wfStatusInfo)) {
        this.wfStatusInfo.reset();
      }
    },

    isFetchable: function () {
      return true;
    }
  });

  return WFStatusInfoModel;

});
