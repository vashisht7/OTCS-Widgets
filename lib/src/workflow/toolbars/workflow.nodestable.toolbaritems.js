/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['i18n!workflow/toolbars/impl/nls/lang',
        'css!workflow/toolbars/impl/workflow.nodestable.toolbaritems'
], function (lang) {
  'use strict';

  return {
    tableHeaderToolbar: [
      {
        signature: 'InitiateWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        group: 'main'
      },
      {
        signature: 'InitiateDocumentWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        group: 'main'
      },
      {
        signature: 'EditWorkflowMap',
        name: lang.NodesTableToolbarEditLabel,
        group: 'main'
      }
    ],
    inlineActionbar: [
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
      },
      {
        signature: 'EditWorkflowMap',
        name: lang.NodesTableToolbarEditLabel,
        icon: 'icon icon-toolbar-edit',
        group: 'other'
      }
    ]
  };

});
