/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define({

  DetachPageLeavingWarning: "If you leave the page now, pending items will not be detached.",
  DetachBusAtts: 'Detaching {0} business objects',
  DetachingOneBusAtt: 'Detaching business object',

  DetachBusAttsNoneMessage: "No business objects detached.",
  DetachOneBusAttSuccessMessage: "1 business object succeeded to detach.",
  DetachSomeBusAttsSuccessMessage: "{0} business objects succeeded to detach.",
  DetachManyBusAttsSuccessMessage: "{0} business objects succeeded to detach.",
  DetachOneBusAttFailMessage: "1 business object failed to detach.",
  DetachSomeBusAttsFailMessage: "{0} business objects failed to detach.",
  DetachManyBusAttsFailMessage2: "{2} business objects failed to detach.", // {2} !!
  DetachSomeBusAttsFailMessage2: "{2} business objects failed to detach.", // {2} !!
  DetachingSomeBusAtts: 'Detaching {0} business objets',

  DetachBusAttsCommandConfirmDialogTitle: "Detach",
  DetachBusAttsCommandConfirmDialogSingleMessage: "Do you want to detach {0}?",
  DetachBusAttsCommandConfirmDialogMultipleMessage: "Do you want to detach {0} items?",
  CommandDoneVerbDetached: 'detached',
  CommandNameDetach: 'Detach Business Attachment',

  AttachPageLeavingWarning: "If you leave the page now, pending items will not be detached.",
  AttachBusAtts: 'Attaching {0} business objects',
  AttachingOneBusAtt: 'Attaching business object',

  AttachBusAttsNoneMessage: "No business objects attached.",
  AttachOneBusAttSuccessMessage: "1 business object succeeded to attach.",
  AttachSomeBusAttsSuccessMessage: "{0} business objects succeeded to attach.",
  AttachManyBusAttsSuccessMessage: "{0} business objects succeeded to attach.",
  AttachOneBusAttFailMessage: "1 business object failed to attach.",
  AttachSomeBusAttsFailMessage: "{0} business objects failed to attach.",
  AttachManyBusAttsFailMessage: "{0} business objects failed to attach.",
  AttachManyBusAttsFailMessage2: "{2} business objects failed to attach.", // {2} !!
  AttachSomeBusAttsFailMessage2: "{2} business objects failed to attach.", // {2} !!
  AttachingSomeBusAtts: 'attaching {0} business objets',

  AttachBusAttsCommandConfirmDialogTitle: "Attach",
  AttachBusAttsCommandConfirmDialogSingleMessage: "Do you want to attach {0}?",
  AttachBusAttsCommandConfirmDialogMultipleMessage: "Do you want to attach {0} items?",
  AttachBusAttsCommandConfirmDialogHtml: "<span class='msgIcon WarningIcon'>" +
    "<%- message %>" +
    "</span>",
  CommandDoneVerbAttached: 'attached',
  CommandNameAttach: 'Attach Business Attachment',

  CommandNameOpenSapObject: 'Open Sap Object',

  CommandNameGoToWorkspace: 'Go To Workspace',

  GoToWorkpsaceHistory: "Go To Workspace History",
  OpenFullPageWorkpsace: "Open Full Page Wokspace",
  SearchWorkspace: "Search From Here",
  SearchBackTooltip: "Go Back to '{0}'",  
  BOAttachmentCreate: {
    name: 'Add business attachment',
    verb: 'attach',
    doneVerb: 'attached',
    addButtonLabel: 'Attach',
    pageLeavingWarning: 'If you leave the page now, pending items will not be attached.',
    successMessages: {
      formatForNone: 'No business attachments attached.',
      formatForOne: '1 business attachment succeeded to attach.',
      formatForMultiple: '{0} business attachments succeeded to attach.'
    },
    errorMessages: {
      formatForOne: '1 business attachment failed to attach.',
      formatForMultiple: '{0} business attachments failed to attach.'
    },
    progressBarMessages: {
      oneFileTitle: 'Attaching business attachment',
      multiFilePending: 'Attaching {0} business attachments',
      multiFileFailure: '{2} business attachments failed to attach.', // {2} !!
    }
  },

  backButtonToolTip: 'Go back',
  CommandSnapshot: 'Snapshot',
  snapshotCreated: 'Snapshot created',
  snapshotCreatedWithName: "Snapshot '{0}' created",
  snapshotFailed: 'Snapshot creation failed',
  CommandDoneVerbCreated: 'created',
  Refresh: 'Events refreshed.',
  RefreshError: 'Error while refreshing.',
  AuthenticationError: 'Authentication failed'
});