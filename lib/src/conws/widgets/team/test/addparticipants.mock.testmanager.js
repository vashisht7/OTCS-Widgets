/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/jquery.mockjax',
  'conws/utils/test/testutil',
  'csui/utils/contexts/page/page.context'
], function (_, $, mockjax, TestUtil, PageContext) {

  var TestManager = function TestManager() {
  };

  TestManager._groupTemplate = {
    "birth_date": null,
    "business_email": null,
    "business_fax": null,
    "business_phone": null,
    "cell_phone": null,
    "deleted": 0,
    "first_name": null,
    "gender": null,
    "group_id": null,
    "home_address_1": null,
    "home_address_2": null,
    "home_fax": null,
    "home_phone": null,
    "id": 10800,
    "last_name": null,
    "middle_name": null,
    "name": "",
    "office_location": null,
    "pager": null,
    "personal_email": null,
    "personal_interests": null,
    "personal_url_1": null,
    "personal_url_2": null,
    "personal_url_3": null,
    "personal_website": null,
    "photo_url": null,
    "privilege_login": false,
    "privilege_modify_groups": false,
    "privilege_modify_users": false,
    "privilege_public_access": false,
    "privilege_system_admin_rights": false,
    "privilege_user_admin_rights": false,
    "time_zone": null,
    "title": null,
    "type": 1,
    "type_name": "Group",
    "name_formatted": "",
    "leader_id": null
  };

  TestManager._groupLeaderTemplate = {
    "birth_date": null,
    "business_email": "",
    "business_fax": null,
    "business_phone": null,
    "cell_phone": "",
    "deleted": false,
    "first_name": "",
    "gender": null,
    "group_id": 10800,
    "home_address_1": "",
    "home_address_2": "",
    "home_fax": "",
    "home_phone": "",
    "id": 10587,
    "last_name": "",
    "middle_name": null,
    "name": "",
    "office_location": "",
    "pager": "",
    "personal_email": "",
    "personal_interests": "",
    "personal_url_1": "",
    "personal_url_2": "",
    "personal_url_3": "",
    "personal_website": "",
    "photo_url": "",
    "privilege_login": true,
    "privilege_modify_groups": false,
    "privilege_modify_users": false,
    "privilege_public_access": true,
    "privilege_system_admin_rights": false,
    "privilege_user_admin_rights": false,
    "time_zone": -1,
    "title": "",
    "type": 0,
    "type_name": ""
  }

  TestManager._userTemplate = {
    "birth_date": null,
    "business_email": null,
    "business_fax": null,
    "business_phone": null,
    "cell_phone": null,
    "deleted": 0,
    "first_name": "",
    "gender": null,
    "group_id": null,
    "home_address_1": null,
    "home_address_2": null,
    "home_fax": null,
    "home_phone": null,
    "id": 18279,
    "last_name": null,
    "middle_name": null,
    "name": "",
    "office_location": null,
    "pager": null,
    "personal_email": null,
    "personal_interests": null,
    "personal_url_1": null,
    "personal_url_2": null,
    "personal_url_3": null,
    "personal_website": null,
    "photo_url": "",
    "privilege_login": true,
    "privilege_modify_groups": false,
    "privilege_modify_users": false,
    "privilege_public_access": true,
    "privilege_system_admin_rights": false,
    "privilege_user_admin_rights": false,
    "time_zone": null,
    "title": null,
    "type": 0,
    "type_name": "User",
    "name_formatted": "",
    "leader_id": null
  };

  TestManager._userGroupTemplate = {
    "deleted": false,
    "id": null,
    "leader_id": null,
    "name": "",
    "photo_url": "",
    "type": 1,
    "type_name": "Group"
  };

  TestManager._roleTemplate = {
    "actions": {
      "data": {},
      "map": {},
      "order": []
    },
    "data": {
      "members": [],
      "properties": {
        "description": null,
        "id": null,
        "leader": null,
        "name": null,
        "perms": null
      }
    }
  };

  TestManager.clearMocks = function(){
    $.mockjax.clear();
  };
  TestManager.reset = function () {

    TestManager.context = undefined;
    TestManager.membersUrl = '//server/otcs/cs/api/v1/members*';

    TestManager.workspaceRolesUrl = '//server/otcs/cs/api/v2/businessworkspaces/*/roles*';
    TestManager.workspaceRolesUrlGetCount = 0;
    TestManager.workspaceRolesUrlPostCount = 0;

    TestManager._members = {};
    TestManager._leaders = {};
    TestManager._groups = {};
    TestManager._roles = {};
  }
  TestManager.init = function () {
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
            attributes: {id: 13, type: 848}
          }
        }
      });
      TestManager.context.node = {
        attributes: {id: 13, type: 848}
      };
    }
  }
  TestManager.prepare = function () {
    $.mockjax.clear();
    $.mockjax({
      url: TestManager.membersUrl,
      responseTime: 10,
      type: 'get',
      response: function (settings) {
        this.responseText = TestManager.membersResult();
      }
    });
    $.mockjax({
      url: TestManager.workspaceRolesUrl,
      responseTime: 10,
      type: 'get',
      response: function (settings) {
        TestManager.workspaceRolesUrlGetCount = TestManager.workspaceRolesUrlGetCount + 1;
        this.responseText = TestManager.workspaceRolesResult();
      }
    });
    $.mockjax({
      url: TestManager.workspaceRolesUrl,
      responseTime: 10,
      type: 'post',
      response: function (settings) {
        TestManager.workspaceRolesUrlPostCount = TestManager.workspaceRolesUrlPostCount + 1;
        this.responseText = {};
      }
    });
  }

  TestManager.prepareDefaultData = function () {

    TestManager.createRoles([
      {
        id: 1,
        name: 'Staff'
      },
      {
        id: 2,
        name: 'Support',
        inherited_from_id: 13
      },
      {
        id: 3,
        name: 'Staff Council'
      },
      {
        id: 4,
        name: 'Sales',
        inherited_from_id: 42
      },
      {
        id: 5,
        name: 'Manager'
      }
    ]);
    TestManager.createUserGroup([
      {
        id: 101,
        type: 1,
        name: 'Famous Actors',
        display_name: 'Famous Actors',
        name_formatted: 'Famous Actors'
      }
    ]);
    TestManager.createGroupLeader([
      {
        id: 1001,
        type: 0,
        name: 'bwillis',
        display_name: 'Bruce Willis',
        name_formatted: 'Bruce Willis'
      }
    ]);
    TestManager.createMembers([
      {
        id: 1002,
        type: 0,
        name: 'bspencer',
        display_name: 'Bud Spencer',
        name_formatted: 'Bud Spencer'
      },
      {
        id: 1003,
        type: 0,
        name: 'lfunes',
        display_name: 'Louis De Funes',
        name_formatted: 'Louis De Funes',
        group_id: 101
      },
      {
        id: 1004,
        type: 0,
        name: 'herhardt',
        display_name: 'Heinz Erhardt',
        name_formatted: 'Heinz Erhardt',
        group_id: 101
      },
      {
        id: 1005,
        type: 0,
        name: 'bwillis',
        business_email: 'bwillis@elink.loc',
        office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
        title: 'New York Police Officer (Retired)',
        display_name: 'Bruce Willis',
        name_formatted: 'Bruce Willis',
        group_id: 101
      },
      {
        id: 102,
        type: 1,
        name: 'Super Heroes',
        display_name: 'Super Heroes',
        name_formatted: 'Super Heroes',
        leader_id: 1001
      }
    ]);
  }

  TestManager.createGroupLeader = function (leaders) {
    _.each(leaders, function (current) {
      TestManager._leaders[current.name] = _.extend(_.clone(TestManager._groupLeaderTemplate),
          current);
    });
  }

  TestManager.createUserGroup = function (groups) {
    _.each(groups, function (current) {
      TestManager._groups[current.name] = _.extend(_.clone(TestManager._userGroupTemplate),
          current);
    });
  }

  TestManager.createMembers = function (members) {
    var member;
    _.each(members, function (current) {
      if (current.type === 0) {
        if (current.group_id !== null) {
          var group = _.findWhere(TestManager._groups, {id: current.group_id});
          if (!_.isUndefined(group)) {
            current.group_id = group;
          }
        }
        TestManager._members[current.name] = _.extend(_.clone(TestManager._userTemplate), current);
      } else if (current.type === 1) {
        if (current.leader_id !== null) {
          var leader = _.findWhere(TestManager._leaders, {id: current.leader_id});
          if (!_.isUndefined(leader)) {
            current.leader_id = leader;
          }
        }
        TestManager._members[current.name] = _.extend(_.clone(TestManager._groupTemplate), current);
      }
    });
  }

  TestManager.createRoles = function (roles) {
    _.each(roles, function (current) {
      var props = _.extend(_.clone(TestManager._roleTemplate.data.properties), current);
      TestManager._roles[current.name] = {
        "actions": {
          "data": {},
          "map": {},
          "order": {}
        },
        "data": {
          "members": [],
          "properties": props
        }
      };
    });
  }

  TestManager.addMembersToRole = function (role, members) {
    var currentRole = TestManager._roles[role];
    if (currentRole) {
      _.each(members, function (currentMember) {
        currentRole.data.members.push(TestManager._members[currentMember]);
      });
    }
  }

  TestManager.membersResult = function () {
    var ret = {
      "links": {
        "self": {
          "body": "",
          "content_type": "",
          "href": TestManager.membersUrl,
          "method": "GET",
          "name": ""
        }
      },
      "data": _.values(TestManager._members)
    };
    return ret;
  }

  TestManager.workspaceRolesResult = function () {
    var ret = {
      "links": {
        "self": {
          "body": "",
          "content_type": "",
          "href": TestManager.workspaceRolesUrl,
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
