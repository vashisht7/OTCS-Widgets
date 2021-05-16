/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require.config({
  paths: {
    csui: '../../../../csui',
    conws: '../../../../conws',
    esoc: '../../../../esoc',
    xecmpf: '../../..'
  },

  deps: ['csui/lib/require.config!csui/csui-extensions.json',
    'csui/lib/require.config!conws/conws-extensions.json',
    'csui/lib/require.config!xecmpf/xecmpf-extensions.json'
  ],

  config: {
    'i18n': {
      locale: 'en',
      preferredLocales: 'en'
    },

    'csui/utils/contexts/factories/connector': {
      connection: {
        url: '//server/otcs/cs/api/v1',
        supportPath: '/support',
        session: {
          ticket: 'dummy'
        },
      }
    },

    'csui/utils/contexts/factories/node': {
      attributes: {
        id: 45807,
        type: 848
      }
    },

    'xecmpf/controls/savedquery.node.picker/impl/savedquery.form.view': {
      queryVolumeId: 19372
    }
  }
});

require(['csui/lib/marionette', 'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/boattachments/boattachments.view',
  'xecmpf/widgets/boattachments/test/boattachments.mock', 'xecmpf/controls/savedquery.node.picker/test/mock'
], function (Marionette, PageContext,
  BOAttachmentsView,
  BOAttachmentsMock, SavedQueryNodePickerMock) {

  var context = new PageContext();
  var contentRegion1 = new Marionette.Region({
    el: "#content1"
  });

  var boAttachmentsView1 = new BOAttachmentsView({
    context: context,
    data: {
      "collapsedView": {
        "bottomLeft": {
          "label": {
            "en": "Type"
          },
          "value": "{type_name}"
        },
        "bottomRight": {
          "label": {
            "en": "Modified"
          },
          "value": "{modify_date}"
        },
        "description": {
          "value": "{description}"
        },
        "noResultsPlaceholder": {
          "en": "No attachments to display."
        },
        "orderBy": {
          "sortColumn": "{name}",
          "sortOrder": "asc"
        },
        "title": {
          "value": "{name}"
        },
        "topRight": {
          "label": {
            "en": "Created"
          },
          "value": "{create_date}"
        }
      },
      "snapshot": {
        "folderNamePrefix": "D7K_KNA1",
        "parentFolderName": "D7K_Customer_Snapshots"
      },
      "title": {
        "en": "Customer 0000001000 attachments"
      }
    }
  });

  contentRegion1.show(boAttachmentsView1);
  var contentRegion2 = new Marionette.Region({
    el: "#content2"
  });

  var boAttachmentsView2 = new BOAttachmentsView({
    context: context,
    data: {
      "businessattachment": {
        "properties": {
          "busObjectId": "000000000010002527",
          "busObjectType": "EQUI",
          "extSystemId": "D7K"
        }
      },
      "title": {
        "en": "Equipment 000000000010002527 attachments"
      }
    }
  });

  contentRegion2.show(boAttachmentsView2);
  BOAttachmentsMock.enable();
  SavedQueryNodePickerMock.enable();

  context.fetch();
});