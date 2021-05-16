define([
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',
    'csui/lib/jquery',
    'csui/controls/form/fields/selectfield.view',
    'otcss/widgets/noteview/impl/utils/Utils',
    'otcss/widgets/noteview/impl/utils/retrievingDocs',
    'hbs!otcss/widgets/noteview/impl/rightregion/viewertwo',
    'css!otcss/widgets/noteview/impl/utils/headerlayout'
], function (_, Marionette, Backbone, $, SelectFieldView, Utils, RetrievingDocs, template) {

    var ViewerTwoView = Marionette.LayoutView.extend({
        className: 'viewerTwoView',
        template: template,
        regions: {
            selectDocument: '#selectDocument',
            csviewer: '#csviewer'
        },
        onRender: function () {
            var currentPageObj = this;
            var docsNames, docsIds =[];
              RetrievingDocs
                .fetch()
                    .done(function () {
                        docsNames =RetrievingDocs.pluck('name');
                        docsIds = RetrievingDocs.pluck('id');
                        var namesOfDocs = [];
                        var docIds = [];
                        console.log('viewerone');
                        docsNames.forEach( function(value, index) {
                            namesOfDocs.push({ id: index, name: value });
                        });
                       
                        docsIds.forEach(function(value) {
                            docIds.push(value.toString());
                        });
                        
                        var docSelectField = new SelectFieldView(Utils.getDropdownItems(namesOfDocs));
                        docSelectField.on('field:changed', function (pageDropDownEvent) {
                        var csviewer = Utils.getCSViewer(docIds, currentPageObj.options.obj, pageDropDownEvent);
                        currentPageObj.showChildView('csviewer', new csviewer());
                        });
                        currentPageObj.showChildView('selectDocument', docSelectField);
                    });
          
        }
    });
    return ViewerTwoView;
});