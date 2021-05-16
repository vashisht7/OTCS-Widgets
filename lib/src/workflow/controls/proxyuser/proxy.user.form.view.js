/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/controls/form/form.view',
  'csui/utils/url',
  'csui/utils/contexts/factories/user',
  'hbs!workflow/controls/proxyuser/impl/proxy.user.form'
], function (_, FormView, Url, UserModelFactory, Template) {
  'use strict';

  var ProxyUserFormView = FormView.extend({

    className: 'cs-form wf-proxy-user-view-form',
    formTemplate: Template,

    constructor: function ProxyUserFormView(options) {
      FormView.prototype.constructor.call(this, options);
      this.listenTo(this, 'change:field', this._saveField);
    },

    _getLayout: function () {
      var template = this.getOption('formTemplate'),
          html = template.call(this, {
            data: this.alpaca.data,
            mode: this.mode
          }),
          bindings = this._getBindings(),
          view = {
            parent: 'bootstrap-csui',
            layout: {
              template: html,
              bindings: bindings
            }
          };
      return view;
    },
    _getBindings: function () {
      var bindings = {
        id: 'wf-proxy-user',
      };
      return bindings;
    },
    _saveField: function (args) {
      var formData = new FormData(),
          newValue = args.value ? args.value : 0,
          newUserDisplayName = args.fieldView.curVal.display_name,
          connector = this.model.connector,
          user = this.options.context.getModel(UserModelFactory);
      if (args.name === 'id') {
        formData.append('body', JSON.stringify({
          "proxy_id": newValue,
          "proxy_name": newUserDisplayName,
          "user_id": user.get('id')
        }));
        var baseUrl = connector.connection.url.replace('/v1', '/v2'),
            url = Url.combine(baseUrl, 'wfproxyuser'),
            ajaxParams = {
              "itemview": this,
              "url": url,
              "type": "POST",
              "data": formData,
              "connector": connector
            };
      }
      this.model.saveProxyUser(ajaxParams);
    },

  });

  return ProxyUserFormView;

});