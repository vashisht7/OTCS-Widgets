/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/team.tablinks',
  'css!conws/widgets/team/impl/team'
], function (_, $, Marionette, TabableRegionBehavior, lang, template) {

  'use strict';


  var TeamTabView = Marionette.LayoutView.extend({

    tagName:'a',

    attributes: {
      'role':'tab',
      'data-binf-toggle':'tab'
    },

    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 200
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },

    onKeyDown: function (e) {
      switch (e.keyCode) {
      case 13:
      case 32:
        $(e.target).trigger('click');
        break;
      }
    },

    templateHelpers: function () {
      return {
        tabName: this.data.attributes.aria === 'participants' ? lang.rolesParticipantsColTitle : lang.participantRolesColTitle
      };
    },

    initialize: function(){
      this.listenTo(this,'dom:refresh',this.updateAttributes);
    },

    updateAttributes: function(){
      this.$el.attr({'href': this.data.attributes.href, 'aria-controls': this.data.attributes['aria-controls']});
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function TeamTabView(options, attributes) {
      this.data = attributes;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    }
  });

  return TeamTabView;

});
