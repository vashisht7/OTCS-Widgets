/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
  "xecmpf/widgets/myattachments/metadata.attachments.view"
], function (lang, MyAttachmentsView) {

  return [

    {
      title: lang.attachmentsTabTitle,
      sequence: 40,
      contentView:  MyAttachmentsView
    }

  ];

});
