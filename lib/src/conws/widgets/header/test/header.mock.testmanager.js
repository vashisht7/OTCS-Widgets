/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/jquery.mockjax',
  'csui/utils/contexts/page/page.context',
  'conws/utils/test/testutil',
  'conws/widgets/header/header.view',
  'csui/utils/log'
], function ($, _, mockjax, PageContext, TestUtil, HeaderView, log) {

  var TestManager = function TestManager() {
  };

  TestManager.context = undefined;

  TestManager.view = undefined;

  TestManager.url = '//server/otcs/cs/api/v2/businessworkspaces/{0}' +
                    '?metadata' +
                    '&fields=categories' +
                    '&include_icon=true' +
                    '&expand=' +
                    encodeURIComponent('properties{create_user_id,modify_user_id,owner_group_id,owner_user_id,reserved_user_id}');

  TestManager.iconUrl = '//server/otcs/cs/api/v2/businessworkspaces/{0}/icons';

  TestManager.wkspIdUrl = '//server/otcs/cs/api/v1/nodes/{0}/businessworkspace';

  TestManager.perspectiveUrl = '//server/otcs/cs/api/v2/nodes/{0}?actions';

  TestManager.memberUrl = '//server/otcs/cs/api/v1/members/*';

  TestManager.memberResponse = undefined;

  TestManager.socialUrl = '//server/otcs/cs/api/v1/objectsocialinfo?csid=*';

  TestManager.socialResponse = undefined;

  TestManager.id = undefined;

  TestManager.contentAuthUrl = '//server/otcs/cs/api/v1/contentauth?id=*';

  TestManager.contentAuthResponse = undefined;

  TestManager.reset = function () {
    TestManager.context = undefined;
    TestManager.view = undefined;
    TestManager.url = '//server/otcs/cs/api/v2/businessworkspaces/{0}' +
                      '?metadata' +
                      '&fields=categories' +
                      '&include_icon=true' +
                      '&expand=' +
                      encodeURIComponent('properties{create_user_id,modify_user_id,owner_group_id,owner_user_id,reserved_user_id}');
    TestManager.iconUrl = '//server/otcs/cs/api/v2/businessworkspaces/{0}/icons';
    TestManager.memberUrl = '//server/otcs/cs/api/v1/members/*';
    TestManager.socialUrl = '//server/otcs/cs/api/v1/objectsocialinfo?csid=*';
    TestManager.id = undefined;
    TestManager.contentAuthUrl = '//server/otcs/cs/api/v1/contentauth?id=*';
  };

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
            attributes: {
              id: id,
              type: 848
            }
          }
        }
      });
    }
    if (!TestManager.view) {
      var viewOptions = {
        context: TestManager.context,
        data: {}
      };
      if (options) {
        viewOptions.data = options;
      }
      TestManager.view = new HeaderView(viewOptions);
    }
  };

  TestManager.prepareFavorites = function (id) {
    $.mockjax({
      url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
      responseText: {
        results: []
      }
    });
    $.mockjax({
      url: "//server/otcs/cs/api/v2/members/favorites/" + id,
      type: 'POST',
      responseTime: 10,
      responseText: {
        "links": {
          "data": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "\/api\/v2\/members\/favorites\/"+id,
              "method": "POST",
              "name": ""
            }
          }
        }, "results": {}
      }
    });
    $.mockjax({
      url: "//server/otcs/cs/api/v2/members/favorites/" + id,
      type: 'GET',
      responseTime: 10,
      responseText: {
        "links": {
          "data": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "\/api\/v2\/members\/favorites\/"+id,
              "method": "GET",
              "name": ""
            }
          }
        }, "results": {}
      }
    });
    $.mockjax({
      url: "//server/otcs/cs/api/v2/members/favorites/" + id,
      type: 'DELETE',
      responseTime: 10,
      responseText: {
        "links": {
          "data": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "\/api\/v2\/members\/favorites\/"+id,
              "method": "DELETE",
              "name": ""
            }
          }
        }, "results": {}
      }
    });
  };

  TestManager.wait = function (done,millis,message) {
    var timeout = false;
    var logit = (message!==undefined);
    var prefix = millis===undefined ? 'waiting default 10msec ' : ('waiting '+millis+' msec ');
    (typeof millis === 'number') || (millis = 10);
    message = message ? (' ' + message) : '';
    TestUtil.run(done,function () {
      setTimeout(function () {
        timeout = true;
      }, millis);
    });
    TestUtil.waitFor(done,function () {
      if (timeout) {
        logit && log.info(prefix + 'finished.' + message) && console.log(log.last)
      }
      return timeout;
    }, prefix + 'failed.' + message, millis + 250);
  };

  TestManager.waitAsync = function (done,functions, millis) {
    var dataFetched;
    TestUtil.run(done,function () {
      $.when.apply($, functions).done(
          function () {
            dataFetched = true;
          })
    });
    TestUtil.waitFor(done,function () {
      return dataFetched;
    }, 'TestManager.waitAsync() failed.', millis);
  };

  TestManager.prepareWkspId = function (nodeId, wkspId) {
    var url = TestManager.wkspIdUrl.replace('{0}', nodeId);
    $.mockjax({
      url: url,
      responseTime: 10,
      responseText: {"id": wkspId, "type": 848}
    });

    url = TestManager.perspectiveUrl.replace('{0}', wkspId);
    $.mockjax({
      url: url,
      responseTime: 10,
      responseText: TestManager.perspectiveResponse(nodeId)
    });
    url = "//server/otcs/cs/api/v2/nodes/{0}?*";
    url = _.str.sformat(url, wkspId);
    var response = '{"links":{"data":{"self":{"body":"","content_type":"","href":"\/api\/v2\/nodes\/{0}?expand=properties%7Boriginal_id%7D&perspective=&fields=properties&actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment","method":"GET","name":""}}},"results":{"actions":{"data":{"addcategory":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/{0}\/categories","method":"POST","name":"Add Category"},"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id={0}","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/{0}","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id={0}","href":"\/api\/v2\/nodes\/{0}","method":"PUT","name":"Move"},"open":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/{0}\/nodes","method":"GET","name":"Open"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/{0}","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id={0}","href":"\/api\/v2\/nodes\/{0}","method":"PUT","name":"Rename"}},"map":{"default_action":"","more":["properties"]},"order":["open","addcategory","rename","copy","move","delete"]},"data":{"properties":{"container":true,"container_size":0,"create_date":"2017-01-25T09:42:52","create_user_id":1000,"description":"","description_multilingual":{"de":"","en":""},"favorite":false,"id":{0},"mime_type":null,"modify_date":"2017-02-01T04:09:24","modify_user_id":1000,"name":"Mat mdesc","name_multilingual":{"de":"Matte Rial","en":"Mat mdesc"},"owner_group_id":1001,"owner_user_id":1000,"parent_id":83519,"reserved":false,"reserved_date":null,"reserved_user_id":0,"rm_enabled":false,"size":0,"size_formatted":"0 Items","type":848,"type_name":"Business Workspace","versions_control_advanced":false,"volume_id":-2000}},"perspective":{"options":{"header":{"widget":{"options":{"widget":{"type":"activityfeed"},"workspace":{"properties":{"description":"{description}","title":"{name}","type":"{business_properties.workspace_type_name}"}}},"type":"conws\/widgets\/header"}},"tabs":[{"columns":[{"heights":{"lg":"half","md":"half","sm":"three-quarters","xs":"full"},"sizes":{"lg":4,"md":4,"sm":6,"xl":4,"xs":12},"widget":{"options":{"showTitleIcon":true,"showWorkspaceIcon":true,"title":"Team"},"type":"conws\/widgets\/team"}},{"heights":{"lg":"half","md":"half","sm":"three-quarters","xs":"full"},"sizes":{"lg":8,"md":8,"sm":12,"xl":8,"xs":12},"widget":{"options":{"metadata":[{"categoryId":142884,"type":"category"},{"attributes":[{"categoryId":89298,"type":"category"}],"label":"Material","type":"group"},{"attributes":[{"categoryId":142930,"type":"category"}],"label":"MultiCat","type":"group"}],"title":"Metadata"},"type":"conws\/widgets\/metadata"}}],"title":"Overview"},{"columns":[{"heights":{"lg":"half","md":"half","sm":"three-quarters","xs":"full"},"sizes":{"lg":12,"md":12,"sm":12,"xl":12,"xs":12},"widget":{"options":{},"type":"csui\/widgets\/nodestable"}}],"title":"Documents"}]},"type":"tabbed"}}}';
    response = response.replace(/\{0\}/g, wkspId);
    response = JSON.parse(response);
    $.mockjax({
      url: url,
      responseTime: 10,
      responseText: response
    });
  };

  TestManager.perspectiveResponse = function (nodeId) {
    var response = {
      "links": {
        "self": {
          "body": "",
          "content_type": "",
          "href": "/api/v2/nodes/" + nodeId + "?actions&perspective",
          "method": "GET",
          "name": ""
        }
      },
      "results": {
        "actions": {
          "audit": {
            "body": "",
            "content_type": "",
            "form_href": "",
            "href": "/api/v1/nodes/" + nodeId + "/audit?limit=1000",
            "method": "GET",
            "name": "Audit"
          },
          "copy": {
            "body": "",
            "content_type": "",
            "form_href": "/api/v1/forms/nodes/copy?id=" + nodeId + "",
            "href": "/api/v1/nodes",
            "method": "POST",
            "name": "Copy"
          },
          "delete": {
            "body": "",
            "content_type": "",
            "form_href": "",
            "href": "/api/v1/nodes/" + nodeId + "",
            "method": "DELETE",
            "name": "Delete"
          },
          "makefavorite": {
            "body": "",
            "content_type": "",
            "form_href": "",
            "href": "/api/v2/members/favorites/" + nodeId + "",
            "method": "POST",
            "name": "Add to Favorites"
          },
          "more": {
            "body": "",
            "content_type": "",
            "form_href": "",
            "href": "",
            "method": "",
            "name": "..."
          },
          "move": {
            "body": "",
            "content_type": "",
            "form_href": "/api/v1/forms/nodes/move?id=" + nodeId + "",
            "href": "/api/v1/nodes/" + nodeId + "",
            "method": "PUT",
            "name": "Move"
          },
          "open": {
            "body": "",
            "content_type": "",
            "form_href": "",
            "href": "/api/v1/nodes/" + nodeId + "/nodes",
            "method": "GET",
            "name": "Open"
          },
          "properties": {
            "body": "",
            "content_type": "",
            "form_href": "",
            "href": "/api/v1/nodes/" + nodeId + "",
            "method": "GET",
            "name": "Properties"
          },
          "rename": {
            "body": "",
            "content_type": "",
            "form_href": "/api/v1/forms/nodes/rename?id=" + nodeId + "",
            "href": "/api/v1/nodes/" + nodeId + "",
            "method": "PUT",
            "name": "Rename"
          }
        },
        "actions_map": {
          "default_action": "",
          "more": [
            "properties",
            "audit"
          ]
        },
        "actions_order": [
          "open",
          "rename",
          "makefavorite",
          "copy",
          "move",
          "delete",
          "more"
        ],
        "data": {
          "columns": [
            {
              "data_type": 2,
              "key": "type",
              "name": "Type",
              "sort_key": "x2095"
            },
            {
              "data_type": -1,
              "key": "name",
              "name": "Name",
              "sort_key": "x2092"
            },
            {
              "data_type": -1,
              "key": "size_formatted",
              "name": "Size",
              "sort_key": "x2093"
            },
            {
              "data_type": 401,
              "key": "modify_date",
              "name": "Modified",
              "sort_key": "x2091"
            }
          ],
          "properties": {
            "container": true,
            "container_size": 1,
            "create_date": "2015-04-15T11:16:22",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {
              "en_US": ""
            },
            "favorite": false,
            "id": nodeId,//26198,
            "mime_type": null,
            "modify_date": "2015-12-01T11:02:24",
            "modify_user_id": 1000,
            "name": "Customer Workspace 001",
            "name_multilingual": {
              "en_US": "Customer Workspace 001"
            },
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": 25980,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "size": 1,
            "size_formatted": "2 Items",
            "type": 848,
            "type_name": "Business Workspace",
            "versions_control_advanced": false,
            "volume_id": -2000
          }
        },
        "perspective": {
          "options": {
            "header": {
              "widget": {
                "options": {
                  "workspace": {
                    "properties": {
                      "description": "{categories.245209_2} {categories.245209_9},\n\t\t\t                   {categories.245209_3}, {categories.245209_4},\n\t\t\t\t\t\t\t   {categories.245209_6}, {categories.245209_5}",
                      "icon": "/img/otsapxecm/handshake.jpg",
                      "title": "{name}",
                      "type": "{workspace_type_name}"
                    }
                  }
                },
                "type": "conws/widgets/header"
              }
            },
            "tabs": [
              {
                "columns": [
                  {
                    "sizes": {
                      "lg": 4,
                      "md": 5,
                      "sm": 6
                    },
                    "widget": {
                      "options": {
                        "collapsedView": {
                          "bottomLeft": {
                            "label": "End Date",
                            "value": "{wnf_att_zyc_5} wwww {wnf_att_zyc_6} yyyy"
                          },
                          "bottomRight": {
                            "label": "Price",
                            "value": "{wnf_att_zyc_9}"
                          },
                          "description": {
                            "value": "{wnf_att_zyc_8}"
                          },
                          "title": {
                            "value": "{wnf_att_zyc_9}"
                          },
                          "topRight": {
                            "label": "Department",
                            "value": "{wnf_att_zyc_6}"
                          }
                        },
                        "relationType": "parent",
                        "title": "Customer Contracts",
                        "workspaceTypeId": 2
                      },
                      "type": "conws/widgets/relatedworkspaces"
                    }
                  },
                  {
                    "sizes": {
                      "lg": 4,
                      "md": 5,
                      "sm": 6
                    },
                    "widget": {
                      "type": "conws/widgets/team"
                    }
                  },
                  {
                    "sizes": {
                      "lg": 4,
                      "md": 5,
                      "sm": 6
                    },
                    "widget": {
                      "options": {
                        "metadata": [
                          {
                            "categoryId": 245209,
                            "type": "category"
                          }
                        ],
                        "title": "Metadata"
                      },
                      "type": "conws/widgets/metadata"
                    }
                  }
                ],
                "title": "Overview"
              },
              {
                "columns": [
                  {
                    "sizes": {
                      "lg": 12,
                      "md": 12,
                      "sm": 6
                    },
                    "widget": {
                      "type": "csui/widgets/nodestable"
                    }
                  }
                ],
                "title": "Documents"
              },
              {
                "columns": [
                  {
                    "sizes": {
                      "lg": 4,
                      "md": 5,
                      "sm": 6
                    },
                    "widget": {
                      "options": {
                        "collapsedView": {
                          "bottomLeft": {
                            "label": "End Date",
                            "value": "{wnf_att_zyc_5} wwww {wnf_att_zyc_6} yyyy"
                          },
                          "bottomRight": {
                            "label": "Price",
                            "value": "{wnf_att_zyc_9}"
                          },
                          "description": {
                            "value": "{wnf_att_zyc_8}"
                          },
                          "title": {
                            "value": "{name}"
                          },
                          "topRight": {
                            "label": "Department",
                            "value": "{wnf_att_zyc_6}"
                          }
                        },
                        "relationType": "child",
                        "title": "Contracts 1",
                        "workspaceTypeId": "2"
                      },
                      "type": "conws/widgets/relatedworkspaces"
                    }
                  },
                  {
                    "sizes": {
                      "lg": 4,
                      "md": 5,
                      "sm": 6
                    },
                    "widget": {
                      "options": {
                        "collapsedView": {
                          "bottomLeft": {
                            "label": "End Date",
                            "value": "{wnf_att_zyc_5} wwww {wnf_att_zyc_6} yyyy"
                          },
                          "bottomRight": {
                            "label": "Price",
                            "value": "{wnf_att_zyc_9}"
                          },
                          "description": {
                            "value": "{wnf_att_zyc_8}"
                          },
                          "title": {
                            "value": "{wnf_att_zyc_6}"
                          },
                          "topRight": {
                            "label": "Department",
                            "value": "{wnf_att_zyc_6}"
                          }
                        },
                        "relationType": "child",
                        "title": "Contracts 2",
                        "workspaceTypeId": "2"
                      },
                      "type": "conws/widgets/relatedworkspaces"
                    }
                  },
                  {
                    "sizes": {
                      "lg": 4,
                      "md": 5,
                      "sm": 6
                    },
                    "widget": {
                      "options": {
                        "collapsedView": {
                          "bottomLeft": {
                            "label": "End Date",
                            "value": "{wnf_att_zyc_5} wwww {wnf_att_zyc_6} yyyy"
                          },
                          "bottomRight": {
                            "label": "Price",
                            "value": "{wnf_att_zyc_9}"
                          },
                          "description": {
                            "value": "{wnf_att_zyc_8}"
                          },
                          "title": {
                            "value": "{wnf_att_zyc_9}"
                          },
                          "topRight": {
                            "label": "Department",
                            "value": "{wnf_att_zyc_6}"
                          }
                        },
                        "relationType": "child",
                        "title": "Contracts 3",
                        "workspaceTypeId": "2"
                      },
                      "type": "conws/widgets/relatedworkspaces"
                    }
                  }
                ],
                "title": "Related"
              }
            ]
          },
          "type": "tabbed"
        }
      }
    };

    return response;
  };

  TestManager.prepare = function (id) {
    TestManager.id = id;
    TestManager.url = TestManager.url.replace('{0}', this.id);
    TestManager.iconUrl = TestManager.iconUrl.replace('{0}', this.id);
    $.mockjax.clear();
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
    $.mockjax({
      url: '//server/otcs/cs/api/v1/members?*',
      responseTime: 0,
      responseText: {"available_actions":[{"parameterless":true,"read_only":false,"type":"delete","type_name":"Delete","webnode_signature":null},{"parameterless":false,"read_only":false,"type":"create","type_name":"Create","webnode_signature":null},{"parameterless":false,"read_only":false,"type":"update","type_name":"Update","webnode_signature":null}],"data":{"birth_date":null,"business_email":null,"business_fax":null,"business_phone":null,"cell_phone":null,"deleted":false,"display_name":"Admin","first_name":null,"gender":null,"group_id":{"deleted":false,"id":1001,"leader_id":null,"name":"DefaultGroup","name_formatted":"DefaultGroup","photo_url":"api\/v1\/members\/1001\/photo","type":1,"type_name":"Group"},"home_address_1":null,"home_address_2":null,"home_fax":null,"home_phone":null,"id":1000,"last_name":null,"middle_name":null,"name":"Admin","office_location":null,"pager":null,"personal_email":null,"personal_interests":null,"personal_url_1":null,"personal_url_2":null,"personal_url_3":null,"personal_website":null,"photo_url":null,"privilege_login":true,"privilege_modify_groups":true,"privilege_modify_users":true,"privilege_public_access":true,"privilege_system_admin_rights":true,"privilege_user_admin_rights":true,"time_zone":-1,"title":null,"type":0,"type_name":"User"},"definitions":{"birth_date":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"include_time":true,"key":"birth_date","key_value_pairs":false,"multi_value":false,"name":"Birthday","persona":"","read_only":false,"required":false,"type":-7,"type_name":"Date","valid_values":[],"valid_values_name":[]},"business_email":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"business_email","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Business E-mail","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"business_fax":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"business_fax","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Business Fax","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"business_phone":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"business_phone","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Business Phone","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"cell_phone":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"cell_phone","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Cell Phone","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"deleted":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"deleted","key_value_pairs":false,"multi_value":false,"name":"Deleted","persona":"","read_only":true,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"first_name":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"first_name","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"First Name","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"gender":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"gender","key_value_pairs":false,"max_value":null,"min_value":null,"multi_value":false,"name":"Gender","persona":"","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"group_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"group_id","key_value_pairs":false,"max_value":null,"min_value":null,"multi_value":false,"name":"Group","persona":"group","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"home_address_1":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"home_address_1","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Home Address","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"home_address_2":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"home_address_2","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Home Address","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"home_fax":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"home_fax","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Home Fax","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"home_phone":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"home_phone","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Home Phone","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"id","key_value_pairs":false,"max_value":null,"min_value":null,"multi_value":false,"name":"ID","persona":"","read_only":false,"required":true,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"last_name":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"last_name","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Last Name","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"middle_name":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"middle_name","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Middle Name","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"name":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"name","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Name","password":false,"persona":"","read_only":false,"regex":"","required":true,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"office_location":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"office_location","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"OfficeLocation","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"pager":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"pager","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Pager","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"personal_email":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"personal_email","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Personal Email","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"personal_interests":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"personal_interests","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Interests","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"personal_url_1":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"personal_url_1","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Favorites","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"personal_url_2":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"personal_url_2","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Favorites","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"personal_url_3":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"personal_url_3","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Favorites","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"personal_website":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"personal_website","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Home Page","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"privilege_login":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"privilege_login","key_value_pairs":false,"multi_value":false,"name":"Log-in","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"privilege_modify_groups":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"privilege_modify_groups","key_value_pairs":false,"multi_value":false,"name":"Create\/Modify Groups","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"privilege_modify_users":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"privilege_modify_users","key_value_pairs":false,"multi_value":false,"name":"Create\/Modify Users","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"privilege_public_access":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"privilege_public_access","key_value_pairs":false,"multi_value":false,"name":"Public Access","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"privilege_system_admin_rights":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"privilege_system_admin_rights","key_value_pairs":false,"multi_value":false,"name":"System Administration Rights","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"privilege_user_admin_rights":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"privilege_user_admin_rights","key_value_pairs":false,"multi_value":false,"name":"User Administration Rights","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"time_zone":{"allow_undefined":false,"bulk_shared":false,"default_value":-1,"description":null,"hidden":false,"key":"time_zone","key_value_pairs":false,"max_value":null,"min_value":null,"multi_value":false,"name":"TimeZone","persona":"","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"title":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"title","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Title","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"type":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"type","key_value_pairs":false,"max_value":null,"min_value":null,"multi_value":false,"name":"Type","persona":"","read_only":true,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"type_name":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"type_name","key_value_pairs":false,"max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Type","password":false,"persona":"","read_only":true,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]}},"definitions_order":["id","type","type_name","name","deleted","first_name","last_name","middle_name","group_id","title","business_email","business_phone","business_fax","office_location","time_zone","privilege_login","privilege_public_access","privilege_modify_users","privilege_modify_groups","privilege_user_admin_rights","privilege_system_admin_rights","birth_date","cell_phone","personal_url_1","personal_url_2","personal_url_3","gender","home_address_1","home_address_2","home_fax","personal_website","home_phone","personal_interests","pager","personal_email"],"type":0,"type_name":"User"}
    });
    TestManager.prepareFavorites(id);
    $.mockjax({
      url: TestManager.contentAuthUrl,
      responseTime: 10,
      responseText: TestManager.contentAuthResponse
    });
    $.mockjax({
      url: TestManager.url,
      responseTime: 10,
      responseText: TestManager['test' + TestManager.id]()
    });
    $.mockjax({
      url: TestManager.iconUrl,
      type: 'POST',
      responseTime: 10,
      responseText: {
        "links": {
          "self": {
            "body": "",
            "content_type": "",
            "href": "\\/api\\/v2\\/businessworkspaces\\/119705\\/icons?file_filename=workbench.png&file_filelength=33365&file_content_type=image\\/png&file_dcsMimeTypeStatus=failure&file=C:\\\\Windows\\\\TEMP\\\\otup037BC292E5A240329B5086CF5BEDFBB90",
            "method": "POST",
            "name": ""
          }
        },
        "results": {
          "icon_node_id": 146879,
          "msg": "Widget icon uploaded successfully."
        }
      }
    });
    $.mockjax({
      url: TestManager.iconUrl,
      type: 'PUT',
      responseTime: 10,
      responseText: {
        "links": {
          "self": {
            "body": "",
            "content_type": "",
            "href": "\\/api\\/v2\\/businessworkspaces\\/119705\\/icons?file_filename=workbench.png&file_filelength=33365&file_content_type=image\\/png&file_dcsMimeTypeStatus=failure&file=C:\\\\Windows\\\\TEMP\\\\otupC791E9F36152447692E931595D9C971C0",
            "method": "PUT",
            "name": ""
          }
        },
        "results": {
          "icon_node_id": 146879,
          "icon_version_id": 148081,
          "msg": "Widget icon uploaded successfully."
        }
      }
    });
    $.mockjax({
      url: TestManager.iconUrl,
      type: 'DELETE',
      responseTime: 10,
      responseText: {
        "links": {
          "self": {
            "body": "",
            "content_type": "",
            "href": "\\/api\\/v2\\/businessworkspaces\\/119705\\/icons",
            "method": "DELETE",
            "name": ""
          }
        },
        "results": {
          "icon_node_id": 147858,
          "msg": "Icon deleted successfully"
        }
      }
    });
    $.mockjax({
      url: TestManager.memberUrl,
      type: 'GET',
      responseTime: 10,
      responseText: TestManager.memberResponse()
    });
    $.mockjax({
      url: TestManager.socialUrl,
      type: 'GET',
      responseTime: 10,
      responseText: TestManager.socialResponse()
    });
  };

  TestManager.fetch = function (done,view, id) {
    this.prepare(id);
    TestUtil.run(done,function (done) {
      done.last = view.model.fetch().then(done,done.fail);
    },"fetch");

    return;
  };

  TestManager.memberResponse = function () {
    var ret = {
      "available_actions": [
        {
          "parameterless": true,
          "read_only": false,
          "type": "delete",
          "type_name": "Delete",
          "webnode_signature": null
        },
        {
          "parameterless": false,
          "read_only": false,
          "type": "create",
          "type_name": "Create",
          "webnode_signature": null
        },
        {
          "parameterless": false,
          "read_only": false,
          "type": "update",
          "type_name": "Update",
          "webnode_signature": null
        }
      ],
      "data": {
        "birth_date": null,
        "business_email": "admin@elink.loc",
        "business_fax": null,
        "business_phone": null,
        "cell_phone": null,
        "deleted": false,
        "display_name": "Mighty Administrator",
        "first_name": "Mighty",
        "gender": null,
        "group_id": 1001,
        "home_address_1": null,
        "home_address_2": null,
        "home_fax": null,
        "home_phone": null,
        "id": 1000,
        "last_name": "Administrator",
        "middle_name": null,
        "name": "Admin",
        "office_location": null,
        "pager": null,
        "personal_email": null,
        "personal_interests": null,
        "personal_url_1": null,
        "personal_url_2": null,
        "personal_url_3": null,
        "personal_website": null,
        "photo_url": "api/v1/members/1000/photo",
        "privilege_login": true,
        "privilege_modify_groups": true,
        "privilege_modify_users": true,
        "privilege_public_access": true,
        "privilege_system_admin_rights": true,
        "privilege_user_admin_rights": true,
        "time_zone": -1,
        "title": null,
        "type": 0,
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
          "multi_value": false,
          "name": "Create/Modify Groups",
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
          "multi_value": false,
          "name": "Create/Modify Users",
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
      "definitions_order": [
        "id",
        "type",
        "type_name",
        "name",
        "deleted",
        "first_name",
        "last_name",
        "middle_name",
        "group_id",
        "title",
        "business_email",
        "business_phone",
        "business_fax",
        "office_location",
        "time_zone",
        "privilege_login",
        "privilege_public_access",
        "privilege_modify_users",
        "privilege_modify_groups",
        "privilege_user_admin_rights",
        "privilege_system_admin_rights",
        "birth_date",
        "cell_phone",
        "personal_url_1",
        "personal_url_2",
        "personal_url_3",
        "gender",
        "home_address_1",
        "home_address_2",
        "home_fax",
        "personal_website",
        "home_phone",
        "personal_interests",
        "pager",
        "personal_email"
      ],
      "type": 0,
      "type_name": "User"
    };
    return ret;
  }

  TestManager.socialResponse = function () {
    var ret = {
      "available_settings": {
        "attachementsEnabled": true,
        "commentCount": 0,
        "commentingOpen": true,
        "commentsEnabled": true,
        "CSID": 16308,
        "likesEnabled": true,
        "pulseEnabled": true,
        "shortcutsEnabled": true,
        "taggingEnabled": false,
        "threadingEnabled": true
      }
    };
    return ret;
  };
  TestManager.testBase = function (id) {

    if (!id) {
      id = 19598;
    }
    var ret = {
      links: {
        "self": {
          "body": "",
          "content_type": "",
          "href": "/api/v2/businessworkspaces/" + id + "?expand_categories=true",
          "method": "GET",
          "name": ""
        }
      },
      results: {
        "actions": {
          "data": {
            "delete-icon": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "/api/v2/businessworkspaces/" + id + "/icons",
              "method": "DELETE",
              "name": "Delete Icon"
            },
            "update-icon": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "/api/v2/businessworkspaces/" + id + "/icons",
              "method": "PUT",
              "name": "Update Icon"
            },
            "upload-icon": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "/api/v2/businessworkspaces/" + id + "/icons",
              "method": "POST",
              "name": "Upload Icon"
            }
          }
        },
        "data": {
          "business_properties": {
            "has_default_display": true,
            "has_default_search": true,
            "isEarly": true,
            "workspace_type_id": 2,
            "workspace_type_name": "Equipment",
            "workspace_type_widget_icon_content": "data:image/png;base64,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"
          },
          "properties": {
            "container": true,
            "container_size": 0,
            "create_date": "2015-04-20T09:20:56",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {
              "en": ""
            },
            "guid": null,
            "icon": "/img11l/otsapxecm/otsapwksp_workspace_b8.png",
            "icon_large": "/img11l/otsapxecm/otsapwksp_workspace_b8_large.png",
            "id": id,//19598,
            "modify_date": "2015-04-21T13:09:18",
            "modify_user_id": 1000,
            "modify_user_id_expand": {
              "birth_date": null,
              "business_email": "admin@elink.loc",
              "business_fax": null,
              "business_phone": null,
              "cell_phone": null,
              "first_name": "Mighty",
              "gender": null,
              "group_id": 1001,
              "home_address_1": null,
              "home_address_2": null,
              "home_fax": null,
              "home_phone": null,
              "id": 1000,
              "last_name": "Administrator",
              "middle_name": null,
              "name": "Admin",
              "name_formatted": "Administrator, Mighty",
              "office_location": null,
              "pager": null,
              "personal_email": null,
              "personal_interests": null,
              "personal_url_1": null,
              "personal_url_2": null,
              "personal_url_3": null,
              "personal_website": null,
              "photo_url": "api/v1/members/1000/photo",
              "time_zone": -1,
              "title": null,
              "type": 0,
              "type_name": "User"
            },
            "name": "Equipment Roller Support Stand",
            "name_multilingual": {
              "en": "Equipment Roller Support Stand"
            },
            "owner_group_id": 1001,
            "owner_group_id_expand": {
              "id": 1001,
              "leader_id": null,
              "name": "DefaultGroup",
              "name_formatted": "DefaultGroup",
              "type": 1,
              "type_name": "Group"
            },
            "owner_user_id": 1000,
            "owner_user_id_expand": {
              "birth_date": null,
              "business_email": "admin@elink.loc",
              "business_fax": null,
              "business_phone": null,
              "cell_phone": null,
              "first_name": "Mighty",
              "gender": null,
              "group_id": 1001,
              "home_address_1": null,
              "home_address_2": null,
              "home_fax": null,
              "home_phone": null,
              "id": 1000,
              "last_name": "Administrator",
              "middle_name": null,
              "name": "Admin",
              "name_formatted": "Administrator, Mighty",
              "office_location": null,
              "pager": null,
              "personal_email": null,
              "personal_interests": null,
              "personal_url_1": null,
              "personal_url_2": null,
              "personal_url_3": null,
              "personal_website": null,
              "photo_url": "api/v1/members/1000/photo",
              "time_zone": -1,
              "title": null,
              "type": 0,
              "type_name": "User"
            },
            "parent_id": 15419,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 848,
            "type_name": "Business Workspace",
            "versions_control_advanced": false,
            "volume_id": -2000
          },
          "categories": {
            "20368": {
              "20368_2": "image.png",
              "20368_3": "This all-purpose assistant helps you to saw large workpieces. " +
                         "Panels, large wooden boards and floorboards are easily placed on the " +
                         "stand, aligned on it and positioned against its stop. And the PTA 1000 " +
                         "weighs only about 6 kg, so it is just as easy to transport",
              "20368_4": [
                1000,
                1000
              ],
              "20368_5_1_6": [
                1000,
                1000,
                1000
              ],
            },
            "23228": {
              "23228_18_1_19": "Bosch",
              "23228_18_1_20": "DE",
              "23228_18_1_21": "PTA 1000",
              "23228_18_1_22": "0603B05100",
              "23228_18_1_23": "3165140575775",
              "23228_18_1_24": 2015,
              "23228_18_1_25": 1,
              "23228_2_1_39": "2015-01-01T00:00:00",
              "23228_2_1_40": "2015-12-31T00:00:00",
              "23228_2_1_6": "WZG-001",
              "23228_2_1_7": "H",
              "23228_2_1_8": "The flexible PTA 1000. Perfect support when sawing large workpieces",
              "23228_2_1_9": null,
              "23228_3_1_10": "Wood",
              "23228_3_1_11": "Tools",
              "23228_3_1_12": null,
              "23228_3_1_13": "6,2",
              "23228_3_1_14": "kg",
              "23228_3_1_15": "700-1150mm",
              "23228_3_1_16": null,
              "23228_3_1_17": null,
              "23228_4_1_26": null,
              "23228_4_1_27": null,
              "23228_4_1_28": null,
              "23228_4_1_29": null,
              "23228_4_1_30": null,
              "23228_4_1_31": null,
              "23228_5_1_32": null,
              "23228_5_1_33": null,
              "23228_5_1_34": null,
              "23228_5_1_35": null,
              "23228_5_1_36": null,
              "23228_5_1_37": null,
              "23228_5_1_38": null
            }
          }
        },
        "metadata": {
          "properties": {
            "container": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "container",
              "multi_value": false,
              "name": "Container",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "container_size": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "container_size",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Container Size",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "create_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "create_date",
              "multi_value": false,
              "name": "Created",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "create_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "create_user_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Created By",
              "persona": "user",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
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
            "guid": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "guid",
              "multi_value": false,
              "name": "GUID",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": -95,
              "type_name": "GUID",
              "valid_values": [],
              "valid_values_name": []
            },
            "icon": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "icon",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": false,
              "multi_value": false,
              "name": "Icon",
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
            "icon_large": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "icon_large",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": false,
              "multi_value": false,
              "name": "Large Icon",
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
            "modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "modify_date",
              "multi_value": false,
              "name": "Modified",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "modify_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "modify_user_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Modified By",
              "persona": "user",
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
            },
            "owner_group_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "owner_group_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Owned By",
              "persona": "group",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "owner_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "owner_user_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Owned By",
              "persona": "user",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "parent_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "parent_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Parent ID",
              "persona": "node",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "reserved": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "reserved",
              "multi_value": false,
              "name": "Reserved",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "reserved_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "reserved_date",
              "multi_value": false,
              "name": "Reserved",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "reserved_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "reserved_user_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Reserved By",
              "persona": "member",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
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
            },
            "versions_control_advanced": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "versions_control_advanced",
              "multi_value": false,
              "name": "Versions Control Advanced",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "volume_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "volume_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "VolumeID",
              "persona": "node",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "workspace_type_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "workspace_type_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Workspace Type ID",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "workspace_type_name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "workspace_type_name",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": false,
              "multi_value": false,
              "name": "Workspace Type",
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
          "categories": {
            "20368": {
              "20368": {
                "key": "20368",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Equipment Information",
                "next_id": 4,
                "persona": "category",
                "read_only": true,
                "required": false,
                "type": -18,
                "valid_values": []
              },
              "20368_2": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "20368_2",
                "max_length": 240,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Image URL",
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
              "20368_3": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "20368_3",
                "max_length": null,
                "min_length": null,
                "multiline": true,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Information",
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
              "20368_4": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "20368_4",
                "max_value": null,
                "min_value": null,
                "multi_value": true,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": false,
                "multi_value_length_max": 2,
                "name": "User",
                "persona": "user",
                "read_only": false,
                "required": false,
                "type": 2,
                "type_name": "Integer",
                "valid_values": [],
                "valid_values_name": []
              },
              "20368_5_x_6": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "20368_4",
                "max_value": null,
                "min_value": null,
                "multi_value": true,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": false,
                "multi_value_length_max": 2,
                "name": "User",
                "persona": "user",
                "read_only": false,
                "required": false,
                "type": 2,
                "type_name": "Integer",
                "valid_values": [],
                "valid_values_name": []
              }
            },
            "23228": {
              "23228": {
                "key": "23228",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Equipment",
                "next_id": 41,
                "persona": "category",
                "read_only": true,
                "required": false,
                "type": -18,
                "valid_values": []
              },
              "23228_18": {
                "key": "23228_18",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Manufacturer",
                "next_id": null,
                "persona": "set",
                "read_only": true,
                "required": false,
                "type": -18,
                "valid_values": []
              },
              "23228_18_x_19": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_18_x_19",
                "max_length": 40,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
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
              },
              "23228_18_x_20": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_18_x_20",
                "max_length": 3,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Country",
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
              "23228_18_x_21": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_18_x_21",
                "max_length": 20,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Model Number",
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
              "23228_18_x_22": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_18_x_22",
                "max_length": 30,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Order Number",
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
              "23228_18_x_23": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_18_x_23",
                "max_length": 30,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Serial Number",
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
              "23228_18_x_24": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_18_x_24",
                "max_value": null,
                "min_value": null,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Construction Year",
                "persona": "",
                "read_only": false,
                "required": false,
                "type": 2,
                "type_name": "Integer",
                "valid_values": [],
                "valid_values_name": []
              },
              "23228_18_x_25": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_18_x_25",
                "max_value": null,
                "min_value": null,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Construction Month",
                "persona": "",
                "read_only": false,
                "required": false,
                "type": 2,
                "type_name": "Integer",
                "valid_values": [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12
                ],
                "valid_values_name": []
              },
              "23228_2_x_39": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "include_time": false,
                "key": "23228_2_x_39",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Valid From",
                "persona": "",
                "read_only": false,
                "required": false,
                "type": -7,
                "type_name": "Date",
                "valid_values": [],
                "valid_values_name": []
              },
              "23228_2_x_40": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "include_time": false,
                "key": "23228_2_x_40",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Valid To",
                "persona": "",
                "read_only": false,
                "required": false,
                "type": -7,
                "type_name": "Date",
                "valid_values": [],
                "valid_values_name": []
              },
              "23228_2_x_6": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_2_x_6",
                "max_length": 18,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Equipment Number",
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
              "23228_2_x_7": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_2_x_7",
                "max_length": 1,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Category",
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
              "23228_2_x_8": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_2_x_8",
                "max_length": 80,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
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
              "23228_2_x_9": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_2_x_9",
                "max_length": 40,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Status",
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
              "23228_3": {
                "key": "23228_3",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "General",
                "next_id": null,
                "persona": "set",
                "read_only": true,
                "required": false,
                "type": -18,
                "valid_values": []
              },
              "23228_3_x_10": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_3_x_10",
                "max_length": 20,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Class",
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
              "23228_3_x_11": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_3_x_11",
                "max_length": 10,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Object Type",
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
              "23228_3_x_12": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_3_x_12",
                "max_length": 4,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Authorization Group",
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
              "23228_3_x_13": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_3_x_13",
                "max_length": 14,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Weight",
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
              "23228_3_x_14": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_3_x_14",
                "max_length": 3,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Weight Unit",
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
              "23228_3_x_15": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_3_x_15",
                "max_length": 30,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Size/Dimension",
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
              "23228_3_x_16": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_3_x_16",
                "max_length": 24,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Inventory Number",
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
              "23228_3_x_17": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "include_time": false,
                "key": "23228_3_x_17",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Start-up Date",
                "persona": "",
                "read_only": false,
                "required": false,
                "type": -7,
                "type_name": "Date",
                "valid_values": [],
                "valid_values_name": []
              },
              "23228_4_x_26": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_4_x_26",
                "max_length": 4,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Maintenance Plant",
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
              "23228_4_x_27": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_4_x_27",
                "max_length": 120,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
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
              },
              "23228_4_x_28": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_4_x_28",
                "max_length": 80,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Street",
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
              "23228_4_x_29": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_4_x_29",
                "max_length": 40,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "City",
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
              "23228_4_x_30": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_4_x_30",
                "max_length": 10,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "City Postal Code",
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
              "23228_4_x_31": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_4_x_31",
                "max_length": 3,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Country Key",
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
              "23228_5": {
                "key": "23228_5",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Organization",
                "next_id": null,
                "persona": "set",
                "read_only": true,
                "required": false,
                "type": -18,
                "valid_values": []
              },
              "23228_5_x_32": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_5_x_32",
                "max_length": 4,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Company Code",
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
              "23228_5_x_33": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_5_x_33",
                "max_length": 4,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Business Area",
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
              "23228_5_x_34": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_5_x_34",
                "max_length": 16,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Asset",
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
              "23228_5_x_35": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_5_x_35",
                "max_length": 14,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Cost Center",
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
              "23228_5_x_36": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_5_x_36",
                "max_length": 4,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Planning Plant",
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
              "23228_5_x_37": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_5_x_37",
                "max_length": 3,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Planner Group",
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
              "23228_5_x_38": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "key": "23228_5_x_38",
                "max_length": 9,
                "min_length": null,
                "multiline": false,
                "multilingual": false,
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Catalog Profile",
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
            }
          }
        },
        metadata_order: {
          "properties": [
            "id",
            "type",
            "type_name",
            "name",
            "description",
            "parent_id",
            "volume_id",
            "guid",
            "create_date",
            "create_user_id",
            "modify_date",
            "modify_user_id",
            "owner_user_id",
            "owner_group_id",
            "reserved",
            "reserved_date",
            "reserved_user_id",
            "icon",
            "icon_large",
            "versions_control_advanced",
            "container",
            "container_size",
            "favorite"
          ]
        }
      }
    };
    return ret;
  };
  TestManager.testWorkspace = function () {
    return this.testBase("Workspace");
  };

  TestManager.test815 = function () {
    return this.testBase(815);
  };

  TestManager.test4711 = function () {
    return this.testBase(4711);
  };
  TestManager.testNoImage = function () {
    var ret = this.testBase("NoImage");
    ret.results.data.business_properties.workspace_type_widget_icon_content = null;
    return ret;
  };
  TestManager.testWSImage = function () {
    var ret = this.testBase("WSImage");
    ret.results.data.business_properties.workspace_widget_icon_content =
        ret.results.data.business_properties.workspace_type_widget_icon_content;
    ret.results.data.business_properties.workspace_type_widget_icon_content = null;
    return ret;
  };
  TestManager.testWorkspaceNoActions = function () {
    var ret = this.testBase("WorkspaceNoActions");
    ret.results.actions.data = {};
    return ret;
  };
  TestManager.testWorkspaceSomeActions = function () {
    var ret = this.testBase("WorkspaceSomeActions");
    ret.results.actions.data = {
      'delete-icon': ret.results.actions.data['delete-icon']
    };
    return ret;
  };
  TestManager.testMultiValueAttributes = function () {

    var ret = {
      links: {
        "self": {
          "body": "",
          "content_type": "",
          "href": "/api/v2/businessworkspaces/2?expand_categories=true",
          "method": "GET",
          "name": ""
        }
      },
      results: {
        "data": {
          "business_properties": {
            "has_default_display": true,
            "has_default_search": true,
            "isEarly": true,
            "workspace_type_id": 2,
            "workspace_type_name": "Equipment"
          },
          "properties": {
            "id": 20000
          },
          "categories": {
            "111228": {
              "111228_2": [
                "2001-01-01T00:00:00",
                "2010-01-01T00:00:00",
                "2100-01-01T00:00:00"
              ],
              "111228_3": []
            }
          }
        },
        "metadata": {
          "properties": {
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
            }
          },
          "categories": {
            "111228": {
              "111228": {
                "key": "111228",
                "multi_value": false,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": true,
                "multi_value_length_max": 1,
                "name": "Multi-Value Attributes",
                "next_id": 3,
                "persona": "category",
                "read_only": true,
                "required": false,
                "type": -18,
                "valid_values": []
              },
              "111228_2": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "include_time": true,
                "key": "111228_2",
                "multi_value": true,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": false,
                "multi_value_length_max": 3,
                "name": "Multi-Value Date Field",
                "persona": "",
                "read_only": false,
                "required": false,
                "type": -7,
                "type_name": "Date",
                "valid_values": [],
                "valid_values_name": []
              },
              "111228_3": {
                "allow_undefined": false,
                "bulk_shared": false,
                "default_value": null,
                "description": null,
                "hidden": false,
                "include_time": true,
                "key": "111228_3",
                "multi_value": true,
                "multi_value_length_default": 1,
                "multi_value_length_fixed": false,
                "multi_value_length_max": 3,
                "name": "Multi-Value Date Field - Empty",
                "persona": "",
                "read_only": false,
                "required": false,
                "type": -7,
                "type_name": "Date",
                "valid_values": [],
                "valid_values_name": []
              }
            }
          }
        }
      },
      "metadata_order": {
        "properties": [
          "id"
        ]
      }
    };
    return ret;
  };

  return TestManager;
});
