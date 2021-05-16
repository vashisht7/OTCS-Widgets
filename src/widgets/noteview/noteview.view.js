define([
  'csui/lib/underscore',                           // Cross-browser utility belt
  'csui/lib/marionette',                           // MVC application support
  'otcss/widgets/noteview/impl/leftRegion/notecomments.view',
  'otcss/widgets/noteview/impl/centerRegion/viewerone.view',
  'otcss/widgets/noteview/impl/rightregion/viewertwo.view',
  'i18n!otcss/widgets/noteview/impl/nls/lang',
  'hbs!otcss/widgets/noteview/impl/noteview',            // Template to render the HTML
  'css!otcss/widgets/noteview/impl/noteview'             // Stylesheet needed for this view
], function (_, Marionette, NoteCommentsView, ViewerOneView,ViewerTwoView,  lang, template) {
  'use strict';

  var NoteviewView = Marionette.LayoutView.extend({
    className: 'otcss--noteview panel panel-default',

    template: template,
    regions: {
      leftRegion: '#leftRegion',
      centerRegion: '#centerRegion',
      rightRegion: '#rightRegion'
    },

    ui: {
      leftcollapsebtn: '.center-collapse-btn',
      rightcollpsebtn: '.right-collapse-btn',
    },
    events: {
      'click @ui.leftcollapsebtn': 'onLeftCollapseBtn',
      'click @ui.rightcollpsebtn': 'onRightCollapseBtn',
    },
    onLeftCollapseBtn: function () {
      this.$('.leftColumn').toggle();
    },
    onRightCollapseBtn: function () {
      this.$('.rightColumn').toggle();
    },

    constructor: function NoteviewView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);

    },
    onRender: function () {
      this.options.obj = this;
      this.showChildView('leftRegion', new NoteCommentsView());
      this.showChildView('centerRegion', new ViewerOneView(this.options));
     this.showChildView('rightRegion', new ViewerTwoView(this.options));
    }
  });

  return NoteviewView;
});
