/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/perspective.panel/perspective.factory',
  'csui/controls/perspective.panel/impl/perspective.with.breadcrumb.view'
], function (require, _, $, PerspectiveFactory, PerspectiveWithBreadcrumbView) {

  var PerspectiveWithBreadcrumbFactory = PerspectiveFactory.extend({

    constructor: function PerspectiveWithBreadcrumbFactory(options) {
      PerspectiveWithBreadcrumbFactory.__super__.constructor.apply(this, arguments);
      this.options = options || {};
    },

    createPerspective: function (model) {
      var self = this;
      return PerspectiveFactory.prototype.createPerspective.call(this, model)
          .then(function (perspectiveView) {

            return new PerspectiveWithBreadcrumbView({
              context: self.options.context,
              perspectiveView: perspectiveView,
              supportMaximizeWidget: perspectiveView._supportMaximizeWidget
            });
          });
    }

  });

  return PerspectiveWithBreadcrumbFactory;
});
