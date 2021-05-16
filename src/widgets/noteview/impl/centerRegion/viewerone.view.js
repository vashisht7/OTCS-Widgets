define([
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',
    'csui/lib/jquery',
    'csui/controls/form/fields/selectfield.view',
    'otcss/widgets/noteview/impl/utils/Utils',
    'otcss/widgets/noteview/impl/utils/retrievingDocs',
    'hbs!otcss/widgets/noteview/impl/centerRegion/viewerone',
    'css!otcss/widgets/noteview/impl/utils/headerlayout'             // Stylesheet needed for this view

], function (_, Marionette, Backbone, $, SelectFieldView, Utils, RetrievingDocs,  template) {

    var ViewerOneView = Marionette.LayoutView.extend({
        className: 'ViewerOneView',
        template: template,
        regions: {
            selectDocument: '#selectDocument',
            csviewer: '#csviewer'
        },
        onRender: function () {
            var currentPageObj = this;
            var docsNames, docsIds =[];
            console.log(RetrievingDocs);
              RetrievingDocs.fetch().done(function () {
                        docsNames =RetrievingDocs.pluck('name');
                        docsIds = RetrievingDocs.pluck('id');
                        var namesOfDocs = [];
                        var docIds = [];
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
          
                },
            
        }
    );
    return ViewerOneView;

});