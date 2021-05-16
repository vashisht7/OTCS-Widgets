/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/jquery.mockjax',
  'csui/utils/contexts/page/page.context',
  'conws/utils/test/testutil',
  'conws/widgets/team/team.view'
], function (_, $, mockjax, PageContext, TestUtil, TeamView) {

  var TestManager = function TestManager() {
  };

  TestManager._groupTemplate = {
    deleted: null,
    id: null,
    leader_id: null,
    name: null,
    photo_id: null,
    type: 1,
    type_name: "Group"
  }

  TestManager._userTemplate = {
    "business_email": null,
    "business_fax": null,
    "business_phone": null,
    "deleted": null,
    "display_name": null,
    "first_name": null,
    "group_id": null,
    "id": null,
    "last_name": null,
    "middle_name": null,
    "name": null,
    "office_location": null,
    "photo_id": null,
    "privilege_login": null,
    "privilege_modify_groups": null,
    "privilege_modify_users": null,
    "privilege_public_access": null,
    "privilege_system_admin_rights": null,
    "privilege_user_admin_rights": null,
    "time_zone": null,
    "title": null,
    "type": 0,
    "type_name": "User"
  }

  TestManager._roleTemplate = {
    "data": {
      "members": [],
      "properties": {
        "description": null,
        "id": null,
        "inherited_from_id": null,
        "leader": null,
        "name": null,
        "perms": null
      }
    }
  }

  TestManager._actionsTemplate = {
    "actions": {}
  }
  TestManager.reset = function () {

    TestManager.context = undefined;
    TestManager.id = undefined;

    TestManager.url = '//server/otcs/cs/api/v2/businessworkspaces/{0}/roles?fields=members';

    TestManager.deleteUrlCount = 0;
    TestManager.deleteUrl = '//server/otcs/cs/api/v2/businessworkspaces/*/roles/*';

    TestManager.addUrlCount = 0;
    TestManager.addUrl = '//server/otcs/cs/api/v2/businessworkspaces/*/roles/*';

    TestManager.contentAuthUrl = '//server/otcs/cs/api/v1/contentauth?id=*';
    TestManager.contentAuthResponse = undefined;

    TestManager.workspaceUrl = '//server/otcs/cs/api/v2/businessworkspaces/*?metadata&fields=categories&include_icon=true';
    TestManager.workspaceResponse = {
      links: {},
      results: {
        "actions": {},
        "data": {
          "business_properties": {
            "has_default_display": true,
            "has_default_search": true,
            "isEarly": true,
            "workspace_type_id": 2,
            "workspace_type_name": "Equipment",
            "workspace_type_widget_icon_content": null
          },
          "properties": {
            "description": "",
            "id": TestManager.id,
            "name": "Roller Support Stand"
          },
          "categories": {}
        },
        "metadata": {
          "properties": {
            "description": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "description",
              "max_length": null,
              "min_length": null,
              "multiline": true,
              "multilingual": true,
              "multi_value": false,
              "name": "Description",
              "password": false,
              "persona": "",
              "read_only": false,
              "regex": "",
              "required": false,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            },
            "id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "ID",
              "persona": "node",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "name",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": true,
              "multi_value": false,
              "name": "Name",
              "password": false,
              "persona": "",
              "read_only": false,
              "regex": "",
              "required": false,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            }
          },
          "categories": {}
        },
        "metadata_order": {
          "properties": []
        }
      }
    };

    TestManager.photoUrl = '//server/otcs/cs/api/v1/members/*';
    TestManager.photoResponse = 'photo1234';

    TestManager.members41268Url = '//server/otcs/cs/api/v1/members/41268?*';
    TestManager.members41268Response = {
      "actions": {},
      "data": {
        "birth_date": null,
        "business_email": null,
        "cell_phone": null,
        "deleted": false,
        "display_name": "Bronson",
        "first_name": "",
        "gender": null,
        "group_id": 42144,
        "id": 41268,
        "last_name": "Bronson",
        "middle_name": null,
        "name": "cbronson",
        "office_location": "Kempten",
        "photo_url": null,
        "time_zone": null,
        "title": "System Engineer",
        "type": 0,
        "type_name": "User"
      },
      "type": 0,
      "type_name": "User"

    };

    TestManager.members41158Url = '//server/otcs/cs/api/v1/members/41158?*';
    TestManager.members41158Response = {
      "actions": {},
      "data": {
        "birth_date": null,
        "business_email": null,
        "cell_phone": null,
        "deleted": false,
        "display_name": "Bud Spencer",
        "first_name": "Bud",
        "gender": null,
        "group_id": 42144,
        "id": 41158,
        "last_name": "Spencer",
        "middle_name": null,
        "name": "bspencer",
        "office_location": "Kempten",
        "photo_url": null,
        "time_zone": null,
        "title": "System Engineer",
        "type": 0,
        "type_name": "User"
      },
      "type": 0,
      "type_name": "User"
    };

    TestManager.members39730Url = '//server/otcs/cs/api/v1/members/39730?*';
    TestManager.members39730Response = {
      "actions": {},
      "data": {
        "birth_date": null,
        "business_email": "lfunes@elink.lo",
        "cell_phone": null,
        "deleted": false,
        "display_name": "Louis De Funes",
        "first_name": "Louis",
        "gender": null,
        "group_id": 42144,
        "id": 39730,
        "last_name": "De Funes",
        "middle_name": null,
        "name": "lfunes",
        "office_location": "Kempten",
        "photo_url": null,
        "time_zone": null,
        "title": "System Engineer",
        "type": 0,
        "type_name": "User"
      },
      "type": 0,
      "type_name": "User"
    };

    TestManager._members = {};
    TestManager._roles = {};
    TestManager._roleMembers = {};
  }
  TestManager.init = function (id, options) {
    if (!TestManager.context) {
      TestManager.context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: id, type: 848}
          }
        }
      });
      TestManager.context.node = {
        attributes: {id: id, type: 848}
      };
    }
  }
  TestManager.prepare = function (id) {
    TestManager.id = id;
    TestManager.url = TestManager.url.replace('{0}', id);
    $.mockjax.clear();
    $.mockjax({
      url: TestManager.workspaceUrl,
      responseTime: 10,
      responseText: TestManager.workspaceResponse
    });
    $.mockjax({
      url: TestManager.contentAuthUrl,
      responseTime: 10,
      responseText: TestManager.contentAuthResponse
    });
    $.mockjax({
      url: TestManager.deleteUrl,
      responseTime: 10,
      type: 'delete',
      response: function (settings) {
        TestManager.deleteUrlCount = TestManager.deleteUrlCount + 1;
        this.responseText = {};
      }
    });
    $.mockjax({
      url: TestManager.addUrl,
      responseTime: 10,
      type: 'post',
      response: function (settings) {
        TestManager.addUrlCount = TestManager.addUrlCount + 1;
        this.responseText = {};
      }
    });
    $.mockjax({
      url: TestManager.url,
      responseTime: 10,
      response: function (settings) {
        this.responseText = TestManager.testBase();
      }
    });
    $.mockjax({
      url: TestManager.members41268Url,
      responseTime: 10,
      responseText: TestManager.members41268Response
    });
    $.mockjax({
      url: TestManager.members41158Url,
      responseTime: 10,
      responseText: TestManager.members41158Response
    });
    $.mockjax({
      url: TestManager.members39730Url,
      responseTime: 10,
      responseText: TestManager.members39730Response
    });
    $.mockjax({
      url: '//server/otcs/cs/api/v2/pulse/settings?fields=chatSettings',
      responseTime: 10,
      responseText: {
        "links": {
          "data": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "\/api\/v2\/pulse\/settings?fields=chatSettings",
              "method": "GET",
              "name": ""
            }
          }
        }, "results": {"chatSettings": {"chatEnabled": false, "presenceEnabled": false}}
      }
    });
  }

  TestManager.fetch = function (done, view, id) {
    this.reset();
    this.init();
    this.prepare(id);
    var dataFetched = false;
    TestUtil.run(done,function () {
      view.model.fetch({
        success: function () {
          dataFetched = true;
        }
      });
    });
    TestUtil.waitFor(done,function () {
      return dataFetched;
    }, "fetching the model timed out", 1000);

    return;
  }

  function addUserMock(member) {
    $.mockjax({
      url: '//server/otcs/cs/api/v1/members/'+member.id+'?expand=member',
      responseTime: 10,
      responseText: {
        "available_actions": [{
          "parameterless": true,
          "read_only": false,
          "type": "delete",
          "type_name": "Delete",
          "webnode_signature": null
        }, {
          "parameterless": false,
          "read_only": false,
          "type": "create",
          "type_name": "Create",
          "webnode_signature": null
        }, {
          "parameterless": false,
          "read_only": false,
          "type": "update",
          "type_name": "Update",
          "webnode_signature": null
        }],
        "data": {
          "birth_date": null,
          "business_email": member.business_email || null,
          "business_fax": null,
          "business_phone": null,
          "cell_phone": null,
          "deleted": false,
          "display_name": member.display_name,
          "first_name": null,
          "gender": null,
          "group_id": {
            "deleted": false,
            "id": 1001,
            "leader_id": null,
            "name": "DefaultGroup",
            "name_formatted": "DefaultGroup",
            "photo_url": "api\/v1\/members\/1001\/photo",
            "type": 1,
            "type_name": "Group"
          },
          "home_address_1": null,
          "home_address_2": null,
          "home_fax": null,
          "home_phone": null,
          "id": member.id,
          "last_name": "N\/A",
          "middle_name": null,
          "name": member.name,
          "office_location": null,
          "pager": null,
          "personal_email": null,
          "personal_interests": null,
          "personal_url_1": null,
          "personal_url_2": null,
          "personal_url_3": null,
          "personal_website": null,
          "photo_url": null,
          "privilege_login": true,
          "privilege_modify_groups": true,
          "privilege_modify_users": true,
          "privilege_public_access": true,
          "privilege_system_admin_rights": true,
          "privilege_user_admin_rights": true,
          "time_zone": null,
          "title": null,
          "type": member.type,
          "type_name": "User"
        },
        "definitions": {
          "birth_date": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "include_time": true,
            "key": "birth_date",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Birthday",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": -7,
            "type_name": "Date",
            "valid_values": [],
            "valid_values_name": []
          },
          "business_email": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "business_email",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Business E-mail",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "business_fax": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "business_fax",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Business Fax",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "business_phone": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "business_phone",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Business Phone",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "cell_phone": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "cell_phone",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Cell Phone",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "deleted": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "deleted",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Deleted",
            "persona": "",
            "read_only": true,
            "required": false,
            "type": 5,
            "type_name": "Boolean",
            "valid_values": [],
            "valid_values_name": []
          },
          "first_name": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "first_name",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "First Name",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "gender": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "gender",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Gender",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 2,
            "type_name": "Integer",
            "valid_values": [],
            "valid_values_name": []
          },
          "group_id": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "group_id",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Group",
            "persona": "group",
            "read_only": false,
            "required": false,
            "type": 2,
            "type_name": "Integer",
            "valid_values": [],
            "valid_values_name": []
          },
          "home_address_1": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "home_address_1",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Home Address",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "home_address_2": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "home_address_2",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Home Address",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "home_fax": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "home_fax",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Home Fax",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "home_phone": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "home_phone",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Home Phone",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "id": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "id",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "ID",
            "persona": "",
            "read_only": false,
            "required": true,
            "type": 2,
            "type_name": "Integer",
            "valid_values": [],
            "valid_values_name": []
          },
          "last_name": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "last_name",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Last Name",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "middle_name": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "middle_name",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Middle Name",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "name": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "name",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Name",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": true,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "office_location": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "office_location",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "OfficeLocation",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "pager": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "pager",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Pager",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "personal_email": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "personal_email",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Personal Email",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "personal_interests": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "personal_interests",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Interests",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "personal_url_1": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "personal_url_1",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Favorites",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "personal_url_2": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "personal_url_2",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Favorites",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "personal_url_3": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "personal_url_3",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Favorites",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "personal_website": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "personal_website",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Home Page",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "privilege_login": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "privilege_login",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Log-in",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 5,
            "type_name": "Boolean",
            "valid_values": [],
            "valid_values_name": []
          },
          "privilege_modify_groups": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "privilege_modify_groups",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Create\/Modify Groups",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 5,
            "type_name": "Boolean",
            "valid_values": [],
            "valid_values_name": []
          },
          "privilege_modify_users": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "privilege_modify_users",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Create\/Modify Users",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 5,
            "type_name": "Boolean",
            "valid_values": [],
            "valid_values_name": []
          },
          "privilege_public_access": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "privilege_public_access",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Public Access",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 5,
            "type_name": "Boolean",
            "valid_values": [],
            "valid_values_name": []
          },
          "privilege_system_admin_rights": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "privilege_system_admin_rights",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "System Administration Rights",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 5,
            "type_name": "Boolean",
            "valid_values": [],
            "valid_values_name": []
          },
          "privilege_user_admin_rights": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "privilege_user_admin_rights",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "User Administration Rights",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 5,
            "type_name": "Boolean",
            "valid_values": [],
            "valid_values_name": []
          },
          "time_zone": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": -1,
            "description": null,
            "hidden": false,
            "key": "time_zone",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "TimeZone",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": 2,
            "type_name": "Integer",
            "valid_values": [],
            "valid_values_name": []
          },
          "title": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "title",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Title",
            "password": false,
            "persona": "",
            "read_only": false,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          },
          "type": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "type",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Type",
            "persona": "",
            "read_only": true,
            "required": false,
            "type": 2,
            "type_name": "Integer",
            "valid_values": [],
            "valid_values_name": []
          },
          "type_name": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "type_name",
            "key_value_pairs": false,
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Type",
            "password": false,
            "persona": "",
            "read_only": true,
            "regex": "",
            "required": false,
            "type": -1,
            "type_name": "String",
            "valid_values": [],
            "valid_values_name": []
          }
        },
        "definitions_order": ["id", "type", "type_name", "name", "deleted", "first_name",
          "last_name", "middle_name", "group_id", "title", "business_email", "business_phone",
          "business_fax", "office_location", "time_zone", "privilege_login",
          "privilege_public_access", "privilege_modify_users", "privilege_modify_groups",
          "privilege_user_admin_rights", "privilege_system_admin_rights", "birth_date",
          "cell_phone", "personal_url_1", "personal_url_2", "personal_url_3", "gender",
          "home_address_1", "home_address_2", "home_fax", "personal_website", "home_phone",
          "personal_interests", "pager", "personal_email"],
        "type": 0,
        "type_name": "User"
      }
    });
  }

  TestManager.createMembers = function (members) {
    var member;
    _.each(members, function (current) {
      if (current.type === 0) {
        addUserMock(current);
        TestManager._members[current.name] = _.extend(_.clone(TestManager._userTemplate), current);
      } else if (current.type === 1) {
        TestManager._members[current.name] = _.extend(_.clone(TestManager._groupTemplate), current);
      }
    });
  }

  TestManager.createRoles = function (roles) {
    _.each(roles, function (current) {
      var actions = _.clone(TestManager._actionsTemplate.actions);
      var props = _.extend(_.clone(TestManager._roleTemplate.data.properties), current);
      TestManager._roles[current.name] = {
        "actions": {
          "data": actions,
          "map": {},
          "order": []
        },
        "data": {
          "members": [],
          "properties": props
        }
      };
    });
  }

  TestManager.createRolesWithActions = function (roles) {
    _.each(roles, function (current) {
      var actions = _.extend(_.clone(TestManager._actionsTemplate.actions), current.actions);
      var props = _.extend(_.clone(TestManager._roleTemplate.data.properties), current.props);
      TestManager._roles[current.props.name] = {
        "actions": {
          "data": actions,
          "map": {},
          "order": []
        },
        "data": {
          "members": [],
          "properties": props
        }
      };
    });
  }

  TestManager.addMembers = function (role, members) {
    var currentRole = TestManager._roles[role];
    if (currentRole) {
      _.each(members, function (currentMember) {
        currentRole.data.members.push(TestManager._members[currentMember]);
      });
    }
  }
  TestManager.testBase = function () {
    var ret = {
      "links": {
        "self": {
          "body": "",
          "content_type": "",
          "href": "/api/v2/businessworkspaces/*/roles?fields=members",
          "method": "GET",
          "name": ""
        }
      },
      "results": _.values(TestManager._roles)
    };
    return ret;
  }

  TestManager.waitAsync = function (done, functions, millis) {
    var dataFetched;
    TestUtil.run(done,function () {
      $.when.apply($, functions).done(
          function () {
            dataFetched = true;
          }).fail(
          function (response) {
            var status = response.status;
          }
      )
    });
    TestUtil.waitFor(done,function () {
      return dataFetched;
    }, 'TestManager.waitAsync() failed.', millis);
  }

  return TestManager;
});