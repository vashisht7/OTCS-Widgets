/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/url',
    'csui/models/mixins/connectable/connectable.mixin',
    'csui/models/mixins/uploadable/uploadable.mixin'
  ],
  function ($, _, Backbone, Url, ConnectableMixin, UploadableMixin) {
    "use strict";
    var UserSettingsModel = Backbone.Model.extend({

      constructor: function (options) {
        Backbone.Model.prototype.constructor.apply(this, arguments);
        this.set({id: options.userid},{silent: true}); // set some .id so the model not considered new anymore. PUT will be used for saving
        this.makeConnectable(options);
        this.makeUploadable(options);
      },

      validate: function () {
        if (!(this.get('accessibleMode') === true || this.get('accessibleMode') === false)) {
          var errMsg = "accessibleMode attribute is invalid";
          console.log(errMsg);
          return errMsg;
        }
      },

      url: function () {
        var url = Url.combine(this.connector.getConnectionUrl().getApiBase('v2'), 'members/preferences');
        url = Url.appendQuery(url, "metadata=true&config_name=SmartUI"); // query part will be trimmed for PUT calls
        return url;
      },

      parse: function(response, options) {
        if (Array.isArray(response.results)) {
          var data = response.results[0].data;
          var accessibleMode = false;
          if (data && data.config_name === 'SmartUI') {
            accessibleMode = data.preferences.accessibleMode;
          }  else {
          }
          return {'accessibleMode': accessibleMode};
        } else {
          var self = response.links.data.self;
          if (self.method !== 'PUT' || self.body.length!==0) {
          } else {
            return {};
          }
        }
      },
      prepare: function (data, options) {
        return {"SmartUI":{"accessibleMode": data.accessibleMode}};
      }

    });

    ConnectableMixin.mixin(UserSettingsModel.prototype);
    UploadableMixin.mixin(UserSettingsModel.prototype);

    return UserSettingsModel;

  });