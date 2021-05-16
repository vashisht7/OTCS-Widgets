define(['i18n!otcss/commands/ViewNote/impl/nls/lang'], function (lang) {
    'use strict';
  
    return {
      //This adds the command in the upper toolbar
      otherToolbar   : [
        {
          signature: 'otcss-view-note',
          name     : lang.toolbarButtonTitle
        }
      ],
      //This will add the command in the context menu of nodes
      inlineActionbar: [
        {
          signature: 'otcss-view-note',
          name     : lang.toolbarButtonTitle
        }
      ]
    };
  
  });
  