/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'i18n!workflow/toolbars/impl/nls/lang',
], function (lang) {
  'use strict';

  var headerToolbarItems = {
    delayedActionsToolbar: [
      {
        signature: 'InitiateDocumentWorkflow',
        name: lang.NodesTableToolbarInitiateLabel
      }
    ]
  };
  return headerToolbarItems;
});
