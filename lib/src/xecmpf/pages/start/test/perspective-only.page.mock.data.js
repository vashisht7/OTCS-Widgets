/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.mockjax', "csui/lib/underscore",
  "json!xecmpf/pages/start/test/result.json"
], function ($, mockjax, _, result) {
  var mocks = [];
  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(\\?.*)?$'),
        responseText: {
          "data": {
            "id": 1000,
            "name": "Admin"
          },
          "perspective": result.perspective

        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/addablenodetypes',
        responseTime: 0,
        responseText: result.addableNodeTypes
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/objectsocialinfo(?:\\?(.*))?$'),
        responseText: result.socialActionsResponse

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pulse/settings?fields=chatSettings',
        responseText: result.socialActionsResponse
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/businessworkspace(\\?.*)?$'),
        responseText: result.businessWorkpsaceResponse
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/]+)/?actions'),
        urlParams: ['nodeId', 'query'],
        responseText: result.actionsResponse

      }));

      mockjax({
        url: '//server/otcs/cs/api/v2/businessworkspaces/153423?metadata&fields=categories&include_icon=true&expand=properties%7Bcreate_user_id%2Cmodify_user_id%2Cowner_group_id%2Cowner_user_id%2Creserved_user_id%7D',
        responseText: result.businessWorkspaceMetadataResponse
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/businessworkspaces/153423/roles?fields=members',
        responseText: result.rolesResponse
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/members/6325586?expand=member',
        responseText: result.rolesResponse
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/members/6326139?expand=member',
        responseText: result.rolesResponse
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/members/6326140?expand=member',
        responseText: result.rolesResponse
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/members/6420739?expand=member',
        responseText: result.rolesResponse
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/members/6421069?expand=member',
        responseText: result.rolesResponse
      });



      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/businessworkspacetypes',
        responseText: result.businessworkspacetypes
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
        responseText: result.members_favorites
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites?fields=properties&fields=favorites*',
        responseText: result.members_favorites
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/facets',
        responseText: result.facets
      });

    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop())) {
        mockjax.clear(mock);
      }
    }

  };

});
