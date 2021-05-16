/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['i18n!workflow/toolbars/impl/nls/lang',
        'css!workflow/toolbars/impl/workflow.nodestable.toolbaritems'
], function (lang) {
  'use strict';

  return {
    otherToolbar: [
       {
         signature: 'InitiateWorkflow',
         name: lang.NodesTableToolbarInitiateLabel,
         group: 'main'
       },
       {
         signature: 'InitiateDocumentWorkflow',
         name: lang.NodesTableToolbarInitiateLabel,
         group: 'main'
       }
    ],
     tableHeaderToolbar: [
       {
         signature: 'InitiateWorkflow',
         name: lang.NodesTableToolbarInitiateLabel,
         group: 'main'
       }
    ],
     inlineToolbar: [
       {
         signature: 'InitiateWorkflow',
         name: lang.NodesTableToolbarInitiateLabel,
         icon: 'icon icon-toolbar-wfinitiate',
         group: 'other'
       },
       {
         signature: 'InitiateDocumentWorkflow',
         name: lang.NodesTableToolbarInitiateLabel,
         icon: 'icon icon-toolbar-wfinitiate',
         group: 'other'
       }
    ],
     tabularInlineToolbar: [
       {
         signature: 'InitiateWorkflow',
         name: lang.NodesTableToolbarInitiateLabel,
         icon: 'icon icon-toolbar-wfinitiate',
         group: 'other'
       }
    ]

  };

});
