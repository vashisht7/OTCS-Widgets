/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/widget/search.results/facet.server.adaptor.mixin',
  'csui/models/widget/search.results/search.facets',
  'csui/models/widget/search.results/object.to.model',
  'csui/widgets/search.custom/search.custom.view',
  'csui/widgets/search.custom/impl/search.object.view',
  'csui/widgets/search.custom/impl/search.customquery.factory',
  'csui/widgets/search.results/search.results.view',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/impl/toolbaritems',
  'json!csui/widgets/search.custom/search.custom.manifest.json',
  'json!csui/widgets/search.results/search.results.manifest.json',
  'i18n!csui/widgets/search.custom/impl/nls/search.custom.manifest',
  'i18n!csui/widgets/search.results/impl/nls/search.results.manifest',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/toolbaritems.masks'
], {});

require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-search', true);
});
