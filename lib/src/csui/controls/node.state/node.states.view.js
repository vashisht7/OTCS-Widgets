/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/controls/node.state/impl/nls/lang',
  'css!csui/controls/node.state/impl/node.states'
], function (_, $, Marionette, lang) {
  'use strict';

  var NodeStateCollectionView = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'csui-node-states',

    attributes: {
      'aria-label': lang.stateListAria
    },

    getChildView: function (iconModel) {
      return iconModel.get('iconView');
    },

    childViewOptions: function (iconModel) {
      return _.extend({
        context: this.options.context,
        model: this.options.node,
        tableView: this.options.tableView
      }, iconModel.get('iconViewOptions'));
    }
  });

  return NodeStateCollectionView;

});
