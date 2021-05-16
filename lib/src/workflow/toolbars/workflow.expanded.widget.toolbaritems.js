/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['i18n!workflow/toolbars/impl/nls/lang',
        'css!workflow/toolbars/impl/workflow.nodestable.toolbaritems'
], function (lang) {
  'use strict';

  return {
    tableHeaderToolbar: [
      
      {
        signature: 'InitiateDocumentWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        group: 'main'
      }
    ],
    inlineActionbar: [
      
      {
        signature: 'InitiateDocumentWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        icon: 'icon icon-toolbar-wfinitiate',
        group: 'other'
      }
    ]
  };

});
