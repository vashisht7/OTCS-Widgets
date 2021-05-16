define([
    'csui/lib/underscore',                           // Cross-browser utility belt
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/lib/jquery',
    'csui/controls/rich.text.editor/rich.text.editor',
    'csui/controls/form/fields/textareafield.view',
    'csui/controls/form/fields/selectfield.view',
    'hbs!otcss/widgets/noteview/impl/leftRegion/notecomments',
    'css!otcss/widgets/noteview/impl/utils/headerlayout'
], function (_, Backbone, Marionette, $, RichTextEditor, TextAreaFieldView, SelectFieldView, template) {


    var NoteCommentsView = Marionette.LayoutView.extend({
        className: 'viewerTwoView',
        template: template,
        onRender: function () {
            var CKEDITOR = RichTextEditor.getRichTextEditor();
            var ckDiv = this.$el.find('.ckeditor-widget')[0];
            CKEDITOR.replace(ckDiv);
        }
    });
    return NoteCommentsView;

});