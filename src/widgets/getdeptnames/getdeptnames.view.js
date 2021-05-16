// An application widget is exposed via a RequireJS module
define([
  'csui/lib/underscore',                           // Cross-browser utility belt
  'csui/lib/marionette',                           // MVC application support
  'csui/controls/form/fields/selectfield.view',
  'otcss/widgets/getdeptnames/impl/utils/Utils',
  'otcss/widgets/getdeptnames/impl/utils/retrievingDocs',
  'hbs!otcss/widgets/getdeptnames/impl/getdeptnames',            // Template to render the HTML
  'css!otcss/widgets/getdeptnames/impl/getdeptnames'             // Stylesheet needed for this view
], function (_, Marionette,SelectFieldView ,Utils, RetrievingDocs,template) {
  'use strict';

  // An application widget is a view, because it should render a HTML fragment
  var GetdeptnamesView = Marionette.LayoutView.extend({
    // Outermost parent element should contain a unique widget-specific class
    className: 'otcss--getdeptnames panel panel-default',

    // Template method rendering the HTML for the view
    template: template,
    regions: {
      selectDocument: '.selectDocument'
  },
  onRender: function () {
    var currentPageObj = this;
    var docsNames, docsIds =[];
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
                  
                    });
                currentPageObj.showChildView('selectDocument', docSelectField);
            });
  
        },
  
  });

  return GetdeptnamesView;
});
