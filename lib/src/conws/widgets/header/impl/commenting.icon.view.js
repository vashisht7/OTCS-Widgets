/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'esoc/widgets/utils/commentdialog/commentdialog.view',
  'hbs!conws/widgets/header/impl/commenting.icon',
  'css!conws/widgets/header/impl/commenting.icon'
], function (_, $, Marionette, TabableRegionBehavior, CommentDialogView, template) {

  'use strict';

  var CommentingIconView = Marionette.LayoutView.extend({

    className: 'conws-comment-icon',

    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },

    constructor: function CommentingIconView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    enabled: function () {
      var model = this.model,
        commenting = model.actions.findWhere({ signature: "comment" });

        return Boolean(commenting);
    },

    onRender: function () {
      var self = this;
      var contentRegion = new Marionette.Region({
        el: self.el
      });
      var globalConfig = (typeof window.require !== "undefined") ?
                         window.require.s.contexts._.config :
                         window.csui.require.s.contexts._.config;

      globalConfig.roId = self.model.get('id');

      var commentDialogView = new CommentDialogView({
        connector: self.model.connector,
        nodeid: self.model.get('id'),
        CSID: self.model.get('id'),
        context: self.options.context,
        useIconsForDarkBackground: this.options.useIconsForDarkBackground
      })
      contentRegion.show(commentDialogView);

      this.commentCount = this.model.get('wnd_comments');
      if(this.commentCount && this.commentCount > 0) {
        this.$el.addClass('conws-has-comments');
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        e.stopPropagation();
        this.currentlyFocusedElement().click();
      }
    },

    currentlyFocusedElement: function () {
      return this.$el.find('a');
    }
  });

  return CommentingIconView;

});
