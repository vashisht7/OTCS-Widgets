define(['i18n!otcss/commands/NoteComment/impl/nls/lang'], function (lang) {
  'use strict';

  return {
    //This adds the command in the upper toolbar
    otherToolbar   : [
      {
        signature: 'otcss-note-comment',
        name     : lang.toolbarButtonTitle
      }
    ],
    //This will add the command in the context menu of nodes
    inlineActionbar: [
      {
        signature: 'otcss-note-comment',
        name     : lang.toolbarButtonTitle
      }
    ]
  };

});
