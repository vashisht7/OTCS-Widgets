/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'i18n!conws/utils/previewpane/impl/nls/previewpane.lang'
], function (_, Backbone, Url, base, lang) {

  var PreviewHeaderModel = Backbone.Model.extend({
    constructor: function PreviewHeaderModel(options) {
      Backbone.Model.prototype.constructor.call(this, {
            id: options.node.get('id'),
            typeName: base.getClosestLocalizedString(options.config.typeName, ""),
            name: options.node.get('name'),
            quickLinkTooltip: lang.quickLinkTooltipText
          },
          options
      );

      options || (options = {});
      if (options && options.node && options.node.connector) {
        options.node.connector.assignTo(this);
      }
    },

    isFetchable: function () {
      return true;
    },
    url: function () {
      var url = Url.combine(this.connector.connection.url, 'businessworkspaces/' + this.get('id'));
      url = url.replace('/v1/', '/v2/');
      return url;
    },
    parse: function (response) {
      var ret = response.results && response.results.data && response.results.data.business_properties;
      this.display_url = ret && ret.display_url;
      return ret;
    }
  });
  return PreviewHeaderModel;
});
