/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require.config({
  config: {
    'csui/utils/contexts/factories/connector': {
      connection: {
        url: '//server/otcs/cs/api/v2',
        supportPath: '/support',
        session: {
          ticket: 'dummy'
        }
      }
    },
    'csui/utils/contexts/factories/node': {
      attributes: {
        id: 120,
        type: 848
      }
    }
  }
});

var connection1 = {
  url: '//server/otcs/cs/api/v1',
  supportPath: '/support',
  session: {
    ticket: 'dummy'
  }
};

var attributes1 = {
  id: 120
};

var connection2 = {
  url: '//vmstg-dev4/OTCS/cs.exe/api/v1',
  supportPath: '/img'
};

var attributes2 = {
  id: 26198
};

require(['csui/lib/marionette', 'csui/utils/contexts/page/page.context',
  '../relatedworkspaces.view', 'csui/utils/contexts/factories/node',
  './relatedworkspaces.mock.manager'
], function (Marionette, PageContext, RelatedWorkspacesView, NodeModelFactory, DataManager) {

  var context = new PageContext({
    factories: {
      connector: {
        connection: connection1
      },
      assignTo: function (model) {
        if (model.connector) {
          if (model.connector === this) {
            return;
          }
        }
        model.connector = this;
      }
    }
  });

  var contentRegion1 = new Marionette.Region({ el: "#content1" });
  var contentRegion2 = new Marionette.Region({ el: "#content2" });
  var contentRegion3 = new Marionette.Region({ el: "#content3" });
  var contentRegion4 = new Marionette.Region({ el: "#content4" });

  var relatedWorkspacesView1 = new RelatedWorkspacesView({
    context: context,
    data: {
      "title": {
        "en":"Sales Opportunities", 
        "de":"Geschäftsmöglichkeiten"
      },
      "workspaceTypeId": "3",
      "pageSize": 10,
      "relationType": "child",
      "collapsedView": {
        "title": {
          "value": "{name}"
        },
        "description" : {
          value : "This is a long text that finally comes to the end and describes: {custom_123_1}"
        },
        "bottomLeft" : {
          "label" : "Bottom Left:",
          "value" : "{custom_123_2}"
        },
        "topRight" : {
          "label": "Tax",
          "value": "{id}"
        },
        "bottomRight" : {
          "label": "Level",
          "value": "{custom_124_1}"
        }
      },
      "expandedView": {
        "orderBy": {
          "sortColumn": "{name}",
          "sortOrder": "desc"
        },
        "customColumns": [
          {
            "key": "{custom_124_1}"
          },
          {
            "key": "{custom_123_2}"
          },
          {
            "key": "{custom_123_1}"
          }
        ]
      }
    }
  });
  var relatedWorkspacesView2 = new RelatedWorkspacesView({
    context: context,
    data: {
      "title": {
        "en" : "Customer Contracts",
        "de" : "Kundenkontakte"
      },
      "workspaceTypeId": "2",
      "relationType": "child",
      "collapsedView": {
        "orderBy": {
          "sortColumn": "{name}",
          "sortOrder": "desc"
        },
        "description" : {
          value: "It's '{name}': {custom_123_1}"
        },
        "topRight" : {
          "label": "Price:",
          "value": "{custom_123_2:currency} {custom_123_2:currency} $"
        },
        "bottomLeft" : {
          "label": "Modified by",
          "value": "{wnd_modifiedby}"
        },
        "bottomRight": {
          "label" : "Date",
          "value": "{modify_date}"
        }
      }
    }
  });

  var relatedWorkspacesView3 = new RelatedWorkspacesView({
    context: context
  });

  var relatedWorkspacesView4 = new RelatedWorkspacesView({
    context: context,
    data: {
      "workspaceTypeId" : "0",
      "relationType": "child"
    }
  });

  contentRegion1.show(relatedWorkspacesView1);
  contentRegion2.show(relatedWorkspacesView2);
  contentRegion3.show(relatedWorkspacesView3);
  contentRegion4.show(relatedWorkspacesView4);

  DataManager.test(257, "Sales Opportunity ", relatedWorkspacesView1.options.data.workspaceTypeId, true);
  DataManager.test(100, "Customer Contract ", relatedWorkspacesView2.options.data.workspaceTypeId, true);
  DataManager.test(2, "No Type ", undefined, false);
  DataManager.test(0, "Empty", relatedWorkspacesView4.options.data.workspaceTypeId, true);

  context.fetch();

});
