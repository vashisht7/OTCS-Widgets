/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/url', 'csui/models/form',
  'csui/controls/globalmessage/globalmessage', 'csui/lib/moment',
  'csui/models/mixins/resource/resource.mixin'
], function ($, _, Url, FormModel, GlobalMessage, moment, ResourceMixin) {
  'use strict';

  var ProxyUserFormModel = FormModel.extend({
    constructor: function ProxyUserFormModel(attributes, options) {

      FormModel.prototype.constructor.apply(this, arguments);
      this.makeResource(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    url: function () {

      var baseUrl = this.options.connector.connection.url.replace('/v1', '/v2'),
        url = Url.combine(baseUrl, 'wfproxyuser', this.get('userId'));

      return url;
    },

    parse: function (response) {

      var forms = response.results.forms,
        form = !!forms && forms[0];
      this.set('isFormToDisplay', response.results.isFormToDisplay);
      return form;

    },

    saveProxyUser: function (options) {
      options.connector.makeAjaxCall(options)
        .fail(_.bind(function (resp) {
          this.trigger('reset');
          GlobalMessage.showMessage("error", resp.responseJSON.error);
        }, this));
    }

  });

  ResourceMixin.mixin(ProxyUserFormModel.prototype);

  return ProxyUserFormModel;

});