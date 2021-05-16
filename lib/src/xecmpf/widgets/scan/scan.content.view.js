/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette','i18n!xecmpf/widgets/scan/impl/nls/lang'],function(Marionette,Lang){
  var ContentView = Marionette.ItemView.extend({
    constructor: function ContentView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
    },
    render: function () {
      this.$el.text(Lang.defaultTextForDesktop);
      return this;
    }
  });
  return ContentView;
});