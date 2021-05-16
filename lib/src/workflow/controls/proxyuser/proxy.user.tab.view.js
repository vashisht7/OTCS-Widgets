/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/models/proxyuser/proxy.user.form.model',
  'workflow/controls/proxyuser/proxy.user.form.view',
  'workflow/controls/proxyuser/proxy.user.empty.view',
  'hbs!workflow/controls/proxyuser/impl/proxy.user.tab',
  'css!workflow/controls/proxyuser/impl/proxyuser'
], function ($, _, Backbone, Handlebars, Marionette, PerfectScrollingBehavior, ProxyUserFormModel,
    ProxyUserFormView, EmptyProxyUser, Template) {
  'use strict';
  var ProxyUserView = Marionette.LayoutView.extend({
    className: 'wf-proxy-user-tab-view',
    template: Template,
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        contentParent: ".wf-proxy-user-form-view",
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      }
    },

    regions: {
      wfProxyUserContent: ".wf-proxy-user-content"
    },

    constructor: function ProxyUserView(options) {
      options = options || {};

      Marionette.LayoutView.prototype.constructor.call(this, options);
      var form = new ProxyUserFormModel({
            userId: this.options.userwidgetmodel.attributes.id
          }, {
            connector: this.options.connector,
            parentView: this
          }),
          that = this;
      form.fetch().done(function () {
        that.formView = new ProxyUserFormView({
          context: that.options.context,
          orginatingView: that,
          model: form
        });
        that.render();
      });
    },
    onRender: function () {
      if (this.formView) {

        var viewToDisplay = (this.formView && this.formView.model.get('isFormToDisplay')) ?
                            this.formView : new EmptyProxyUser();
        this.wfProxyUserContent.show(viewToDisplay);

      }
    }

  });
  return ProxyUserView;
});