/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/jquery.mockjax'], function ($, mockjax) {

  var DataManager = function DataManager() {};

  DataManager.testContract = {

    mocks: [],
    enable: function () {
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/forms/businessworkspaces/create?parent_id=25980&type=848&wksp_type_id=2&template_id=29725',
        responseTime: 0,
        responseText: {
          "forms": [{
            "data": {
              "name": null,
              "description": "",
              "parent_id": 25980,
              "type": 848
            },
            "options": {
              "fields": {
                "name": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Name",
                  "readonly": false,
                  "type": "text"
                },
                "description": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Description",
                  "readonly": false,
                  "type": "textarea"
                },
                "parent_id": {
                  "hidden": true,
                  "hideInitValidationError": true,
                  "label": "Location",
                  "readonly": false,
                  "type": "number"
                },
                "type": {"hidden": true, "hideInitValidationError": true, "type": "integer"}
              },
              "form": {
                "attributes": {"action": "api\/v1\/nodes", "method": "POST"},
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "name": {
                  "maxLength": 248,
                  "minLength": 1,
                  "readonly": false,
                  "required": true,
                  "title": "Name",
                  "type": "string"
                },
                "description": {
                  "default": "",
                  "readonly": false,
                  "required": false,
                  "title": "Description",
                  "type": "string"
                },
                "parent_id": {
                  "readonly": false,
                  "required": true,
                  "title": "Location",
                  "type": "integer"
                },
                "type": {"required": true, "type": "integer"}
              }, "type": "object"
            }
          }, {
            "data": {
              "record_date": null,
              "status": null,
              "status_date": null,
              "received_date": null,
              "essential": null,
              "cycle_period": null,
              "last_review_date": null,
              "next_review_date": null,
              "official": null,
              "storage": null,
              "accession": null,
              "subject": null,
              "rsi": null,
              "originator": null,
              "addressee": null,
              "sent_to": null,
              "establishment": null,
              "rmclassification_id": null
            },
            "options": {
              "fields": {
                "record_date": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Record Date",
                  "readonly": false,
                  "type": "date"
                },
                "status": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Status",
                  "optionLabels": ["STA-001..STATUS 001", "STA-001..STATUS 001"],
                  "readonly": false,
                  "type": "radio"
                },
                "status_date": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Status Date",
                  "readonly": false,
                  "type": "date"
                },
                "received_date": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Received Date",
                  "readonly": false,
                  "type": "date"
                },
                "essential": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Essential",
                  "optionLabels": ["ESS-001..ESSENTIAL 001", "ESS-001..ESSENTIAL 001"],
                  "readonly": false,
                  "type": "radio"
                },
                "cycle_period": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Update Cycle Period",
                  "optionLabels": ["Monthly", "Semi-annual based on calend...",
                    "Quarterly based on calendar...", "Annual based on calendar year", "Daily",
                    "Weekly", "Monthly", "Semi-annual based on calend...",
                    "Quarterly based on calendar...", "Annual based on calendar year", "Daily",
                    "Weekly"],
                  "readonly": false,
                  "type": "select"
                },
                "last_review_date": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Last Review Date",
                  "readonly": false,
                  "type": "date"
                },
                "next_review_date": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Next Review Date",
                  "readonly": false,
                  "type": "date"
                },
                "official": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Official",
                  "readonly": false,
                  "type": "checkbox"
                },
                "storage": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Storage Medium",
                  "optionLabels": ["STO-001..STORAGE 001", "STO-001..STORAGE 001"],
                  "readonly": false,
                  "type": "radio"
                },
                "accession": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Accession",
                  "readonly": false,
                  "type": "text"
                },
                "subject": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Subject",
                  "readonly": false,
                  "type": "textarea"
                },
                "rsi": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "RSI",
                  "readonly": false,
                  "type": "text"
                },
                "originator": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Author or Originator",
                  "readonly": false,
                  "type": "text"
                },
                "addressee": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Addressee(s)",
                  "readonly": false,
                  "type": "textarea"
                },
                "sent_to": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Other Addressee(s)",
                  "readonly": false,
                  "type": "textarea"
                },
                "establishment": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Originating Organization",
                  "readonly": false,
                  "type": "text"
                },
                "rmclassification_id": {
                  "hidden": true,
                  "hideInitValidationError": true,
                  "label": "Classification ID",
                  "readonly": false,
                  "type": "number"
                }
              }
            },
            "role_name": "rmclassifications",
            "schema": {
              "properties": {
                "record_date": {
                  "readonly": false,
                  "required": false,
                  "title": "Record Date",
                  "type": "string"
                },
                "status": {
                  "default": "",
                  "enum": ["STA-001", "STA-001"],
                  "readonly": false,
                  "required": true,
                  "title": "Status",
                  "type": "string"
                },
                "status_date": {
                  "readonly": false,
                  "required": false,
                  "title": "Status Date",
                  "type": "string"
                },
                "received_date": {
                  "readonly": false,
                  "required": false,
                  "title": "Received Date",
                  "type": "string"
                },
                "essential": {
                  "default": "",
                  "enum": ["ESS-001", "ESS-001"],
                  "readonly": false,
                  "required": false,
                  "title": "Essential",
                  "type": "string"
                },
                "cycle_period": {
                  "default": "",
                  "enum": [1, 2, 3, 12, 365, 7, 1, 2, 3, 12, 365, 7],
                  "readonly": false,
                  "required": false,
                  "title": "Update Cycle Period",
                  "type": "integer"
                },
                "last_review_date": {
                  "readonly": false,
                  "required": false,
                  "title": "Last Review Date",
                  "type": "string"
                },
                "next_review_date": {
                  "readonly": false,
                  "required": false,
                  "title": "Next Review Date",
                  "type": "string"
                },
                "official": {
                  "default": false,
                  "readonly": false,
                  "required": false,
                  "title": "Official",
                  "type": "boolean"
                },
                "storage": {
                  "default": "",
                  "enum": ["STO-001", "STO-001"],
                  "readonly": false,
                  "required": true,
                  "title": "Storage Medium",
                  "type": "string"
                },
                "accession": {
                  "readonly": false,
                  "required": false,
                  "title": "Accession",
                  "type": "string"
                },
                "subject": {
                  "readonly": false,
                  "required": false,
                  "title": "Subject",
                  "type": "string"
                },
                "rsi": {"readonly": false, "required": false, "title": "RSI", "type": "string"},
                "originator": {
                  "readonly": false,
                  "required": false,
                  "title": "Author or Originator",
                  "type": "string"
                },
                "addressee": {
                  "readonly": false,
                  "required": false,
                  "title": "Addressee(s)",
                  "type": "string"
                },
                "sent_to": {
                  "readonly": false,
                  "required": false,
                  "title": "Other Addressee(s)",
                  "type": "string"
                },
                "establishment": {
                  "readonly": false,
                  "required": false,
                  "title": "Originating Organization",
                  "type": "string"
                },
                "rmclassification_id": {
                  "readonly": false,
                  "required": true,
                  "title": "Classification ID",
                  "type": "integer"
                }
              }, "title": "RM Metadata", "type": "object"
            }
          }, {
            "data": {"219144": {"219144_2": null, "219144_3": null}},
            "options": {
              "fields": {
                "219144": {
                  "fields": {
                    "219144_2": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Text 5",
                      "maxLength": 32,
                      "readonly": false,
                      "type": "text"
                    },
                    "219144_3": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Text 6",
                      "maxLength": 32,
                      "readonly": false,
                      "type": "text"
                    }
                  }, "hideInitValidationError": true, "label": "Target Attributes", "type": "object"
                }
              }, "role_name": "categories"
            },
            "role_name": "categories",
            "schema": {
              "properties": {
                "219144": {
                  "properties": {
                    "219144_2": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": true,
                      "title": "Text 5",
                      "type": "string"
                    },
                    "219144_3": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "title": "Text 6",
                      "type": "string"
                    }
                  }, "title": "Target Attributes", "type": "object"
                }
              }, "title": "Categories", "type": "object"
            }
          }]
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/businessworkspaces',
        type: 'post',
        responseTime: 0,
        responseText: {
          "links": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "\/api\/v2\/businessworkspaces?body={\u0022template_id\u0022:29725,\u0022name\u0022:\u0022Test Contract Workspace 001\u0022,\u0022type\u0022:848,\u0022parent_id\u0022:25980,\u0022description\u0022:\u0022\u0022,\u0022mime_type\u0022:\u0022\u0022,\u0022roles\u0022:{\u0022categories\u0022:{\u0022219144\u0022:{\u0022219144_2\u0022:\u0022Test Text 5\u0022,\u0022219144_3\u0022:\u0022\u0022}}}}",
              "method": "POST",
              "name": ""
            }
          }, "results": {"id": 349279}
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/349279?*',
        responseTime: 0,
        responseText: {
          "links": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "\/api\/v2\/nodes\/349279?expand=properties%7Bcreate_user_id%2Cowner_user_id%7D&actions&perspective",
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
                "href": "\/api\/v1\/nodes\/349279\/audit?limit=1000",
                "method": "GET",
                "name": "Audit"
              },
              "copy": {
                "body": "",
                "content_type": "",
                "form_href": "\/api\/v1\/forms\/nodes\/copy?id=349279",
                "href": "\/api\/v1\/nodes",
                "method": "POST",
                "name": "Copy"
              },
              "delete": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v1\/nodes\/349279",
                "method": "DELETE",
                "name": "Delete"
              },
              "makefavorite": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v2\/members\/favorites\/349279",
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
                "form_href": "\/api\/v1\/forms\/nodes\/move?id=349279",
                "href": "\/api\/v1\/nodes\/349279",
                "method": "PUT",
                "name": "Move"
              },
              "open": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v1\/nodes\/349279\/nodes",
                "method": "GET",
                "name": "Open"
              },
              "properties": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v1\/nodes\/349279",
                "method": "GET",
                "name": "Properties"
              },
              "rename": {
                "body": "",
                "content_type": "",
                "form_href": "\/api\/v1\/forms\/nodes\/rename?id=349279",
                "href": "\/api\/v1\/nodes\/349279",
                "method": "PUT",
                "name": "Rename"
              }
            },
            "actions_map": {"default_action": "", "more": ["properties", "audit"]},
            "actions_order": ["open", "rename", "makefavorite", "copy", "move", "delete", "more"],
            "data": {
              "columns": [{
                "data_type": 2,
                "key": "type",
                "name": "Type",
                "sort_key": "x2095"
              }, {"data_type": -1, "key": "name", "name": "Name", "sort_key": "x2092"},
                {"data_type": -1, "key": "size_formatted", "name": "Size", "sort_key": "x2093"},
                {"data_type": 401, "key": "modify_date", "name": "Modified", "sort_key": "x2091"}],
              "properties": {
                "container": true,
                "container_size": 0,
                "create_date": "2016-01-14T12:32:29",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {"en_US": ""},
                "favorite": false,
                "id": 349279,
                "mime_type": null,
                "modify_date": "2016-01-14T12:32:30",
                "modify_user_id": 1000,
                "name": "Test Contract Workspace 001",
                "name_multilingual": {"en_US": "Test Contract Workspace 001"},
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 25980,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 0,
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
                          "description": "{categories.29740_2}, {categories.29740_6}\n{categories.29740_3}, {categories.29740_4}.",
                          "title": "{name}",
                          "type": "{workspace_type_name}"
                        }
                      }
                    }, "type": "conws\/widgets\/header"
                  }
                },
                "tabs": [{
                  "columns": [{
                    "sizes": {"lg": 4, "md": 5, "sm": 6},
                    "widget": {
                      "options": {
                        "collapsedView": {
                          "bottomLeft": {
                            "label": "Postal Code",
                            "value": "{wnf_att_874z_6}"
                          },
                          "bottomRight": {"label": "City", "value": "{wnf_att_874z_5}"},
                          "description": {"value": "{wnf_att_874z_9}"},
                          "preview": {
                            "metadata": [{"categoryId": 245209, "type": "category"}],
                            "roleId": "Key Account Manager",
                            "typeName": "Customer"
                          },
                          "title": {"value": "{name}"},
                          "topRight": {"label": "Country", "value": "{wnf_att_874z_8}"}
                        }, "relationType": "parent", "title": "Customers", "workspaceTypeId": "1"
                      }, "type": "conws\/widgets\/relatedworkspaces"
                    }
                  }, {
                    "sizes": {"lg": 4, "md": 5, "sm": 6},
                    "widget": {
                      "options": {
                        "bgcolor": "rgb(247, 247, 247)",
                        "color": "rgb(85, 85, 85)",
                        "label": "Featured Documents Placehoder"
                      }, "type": "csui\/widgets\/placeholder"
                    }
                  }], "title": "Overview"
                }, {
                  "columns": [{
                    "sizes": {"lg": 12, "md": 12, "sm": 6},
                    "widget": {"type": "csui\/widgets\/nodestable"}
                  }], "title": "Documents"
                }, {
                  "columns": [{
                    "sizes": {"lg": 4, "md": 5, "sm": 6},
                    "widget": {
                      "options": {
                        "collapsedView": {
                          "bottomLeft": {
                            "label": "Postal Code",
                            "value": "{wnf_att_874z_6}"
                          },
                          "bottomRight": {"label": "City", "value": "{wnf_att_874z_5}"},
                          "description": {"value": "{wnf_att_874z_9}"},
                          "preview": {
                            "metadata": [{"categoryId": 245209, "type": "category"}],
                            "roleId": "Key Account Manager",
                            "typeName": "Customer"
                          },
                          "title": {"value": "{name}"},
                          "topRight": {"label": "Country", "value": "{wnf_att_874z_8}"}
                        }, "relationType": "child", "title": "Customers", "workspaceTypeId": "1"
                      }, "type": "conws\/widgets\/relatedworkspaces"
                    }
                  }], "title": "Related"
                }]
              }, "type": "tabbed"
            }
          }
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/25980/nodes?*&where_name=Test%20Contract%20Workspace%20001',
        responseTime: 0,
        responseText: {
          "data": [{
            "volume_id": {
              "container": true,
              "container_size": 8,
              "create_date": "2015-04-10T17:34:08",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_US": ""},
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webdoc\/icon_library.gif",
              "icon_large": "\/img\/webdoc\/icon_library_large.gif",
              "id": 2000,
              "modify_date": "2015-11-02T22:38:18",
              "modify_user_id": 1000,
              "name": "Enterprise",
              "name_multilingual": {"en_US": "Enterprise"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": -1,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 141,
              "type_name": "Enterprise Workspace",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "id": 349279,
            "parent_id": {
              "container": true,
              "container_size": 15,
              "create_date": "2015-04-15T10:53:19",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_US": ""},
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webdoc\/folder.gif",
              "icon_large": "\/img\/webdoc\/folder_large.gif",
              "id": 25980,
              "modify_date": "2016-01-14T12:32:30",
              "modify_user_id": 1000,
              "name": "Workspaces",
              "name_multilingual": {"en_US": "Workspaces"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 2000,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 0,
              "type_name": "Folder",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "name": "Test Contract Workspace 001",
            "type": 848,
            "description": "",
            "create_date": "2016-01-14T12:32:29",
            "modify_date": "2016-01-14T12:32:30",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/img\/otsapxecm\/otsapwksp_workspace_b8.png",
            "mime_type": null,
            "original_id": 0,
            "wnd_owner": 1000,
            "wnd_createdby": 1000,
            "wnd_createdate": "2016-01-14T12:32:29",
            "wnd_modifiedby": 1000,
            "wnd_version": null,
            "wnf_readydate": null,
            "wnf_wksp_type_id": 2,
            "wnf_wksp_name": null,
            "wnf_wksp_name_en_us": "Test Contract Workspace 001",
            "wnf_att_874z_2": null,
            "wnf_att_874z_8": null,
            "wnf_att_874z_5": null,
            "wnf_att_874z_6": null,
            "wnf_att_874z_9": null,
            "wnd_comments": null,
            "wnf_att_zyc_2": null,
            "wnf_att_zyc_4": null,
            "wnf_att_zyc_6": null,
            "wnf_att_zyc_5": null,
            "wnf_att_zyc_8": null,
            "wnf_att_zyc_9": null,
            "type_name": "Business Workspace",
            "container": true,
            "size": 2,
            "perm_see": true,
            "perm_see_contents": true,
            "perm_modify": true,
            "perm_modify_attributes": true,
            "perm_modify_permissions": true,
            "perm_create": true,
            "perm_delete": true,
            "perm_delete_versions": true,
            "perm_reserve": true,
            "favorite": false,
            "size_formatted": "2 Items",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/349279",
            "parent_id_url": "\/v1\/nodes\/25980",
            "commands": {
              "copy": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api\/v1\/forms\/nodes\/copy?id=349279",
                "method": "",
                "name": "Copy"
              },
              "default": {
                "body": "",
                "content_type": "",
                "href": "api\/v1\/nodes\/349279\/nodes",
                "href_form": "",
                "method": "GET",
                "name": "Open"
              },
              "delete": {
                "body": "",
                "content_type": "",
                "href": "api\/v1\/nodes\/349279",
                "href_form": "",
                "method": "DELETE",
                "name": "Delete"
              },
              "move": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api\/v1\/forms\/nodes\/move?id=349279",
                "method": "",
                "name": "Move"
              },
              "rename": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "\/api\/v1\/forms\/nodes\/rename?id=349279",
                "method": "",
                "name": "Rename"
              }
            },
            "commands_map": {},
            "commands_order": ["default", "rename", "copy", "move", "delete"]
          }],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {"align": "left", "name": "ID", "persona": "node", "type": 2, "width_weight": 0},
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {"name": ["menu"]},
          "definitions_order": ["type", "name", "size_formatted", "modify_date"],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 1,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 1,
          "where_facet": [],
          "where_name": "Test Contract Workspace 001",
          "where_type": []
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=349279',
        responseTime: 0,
        responseText: {
          "forms": [{
            "data": {
              "name": "Test Contract Workspace 001",
              "description": "",
              "create_date": "2016-01-14T12:32:29",
              "create_user_id": "Admin",
              "type": 848,
              "type_name": "Business Workspace",
              "modify_date": "2016-01-14T12:32:30",
              "owner_user_id": "Admin"
            },
            "options": {
              "fields": {
                "name": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Name",
                  "readonly": false,
                  "type": "text"
                },
                "description": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Description",
                  "readonly": false,
                  "type": "textarea"
                },
                "create_date": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Created",
                  "readonly": true,
                  "type": "datetime"
                },
                "create_user_id": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Created By",
                  "readonly": true,
                  "type": "text"
                },
                "type": {
                  "hidden": true,
                  "hideInitValidationError": true,
                  "label": "Type",
                  "readonly": true,
                  "type": "integer"
                },
                "type_name": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Type",
                  "readonly": true,
                  "type": "text"
                },
                "modify_date": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Modified",
                  "readonly": true,
                  "type": "datetime"
                },
                "owner_user_id": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Owned By",
                  "readonly": true,
                  "type": "text"
                }
              },
              "form": {
                "attributes": {"action": "api\/v1\/nodes\/349279", "method": "PUT"},
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "name": {
                  "maxLength": 248,
                  "minLength": 1,
                  "readonly": false,
                  "required": true,
                  "title": "Name",
                  "type": "string"
                },
                "description": {
                  "readonly": false,
                  "required": false,
                  "title": "Description",
                  "type": "string"
                },
                "create_date": {
                  "readonly": true,
                  "required": false,
                  "title": "Created",
                  "type": "string"
                },
                "create_user_id": {
                  "readonly": true,
                  "required": false,
                  "title": "Created By",
                  "type": "string"
                },
                "type": {"readonly": true, "required": false, "title": "Type", "type": "integer"},
                "type_name": {
                  "readonly": true,
                  "required": false,
                  "title": "Type",
                  "type": "string"
                },
                "modify_date": {
                  "readonly": true,
                  "required": false,
                  "title": "Modified",
                  "type": "string"
                },
                "owner_user_id": {
                  "readonly": true,
                  "required": false,
                  "title": "Owned By",
                  "type": "string"
                }
              }, "type": "object"
            }
          }]
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/...',
        responseTime: 0,
        responseText: {/*...*/}
      }));
    },

    disable: function () {
      var mock;
      while ((mock = this.mocks.pop())) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.testMaterial = {

    mocks: [],
    enable: function () {
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/forms/businessworkspaces/create?parent_id=511690&type=848&wksp_type_id=437&template_id=502179',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "bo_type_id": 297,
                "bo_type_name": "Material (D5G)",
                "description": "",
                "ext_system_id": "UT",
                "ext_system_name": "UT",
                "name": null,
                "parent_id": 511690,
                "type": 848
              },
              "options": {
                "fields": {
                  "bo_type_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Id",
                    "readonly": true,
                    "type": "number"
                  },
                  "bo_type_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "ext_system_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "External Sytem Id",
                    "readonly": true,
                    "type": "text"
                  },
                  "ext_system_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "External System Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "parent_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Location",
                    "readonly": false,
                    "type": "number"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "type": "integer"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes",
                    "method": "POST"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "bo_type_id": {
                    "readonly": true,
                    "required": true,
                    "title": "Business Object Type Id",
                    "type": "integer"
                  },
                  "bo_type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Business Object Type Name",
                    "type": "string"
                  },
                  "description": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "ext_system_id": {
                    "readonly": true,
                    "required": false,
                    "title": "External Sytem Id",
                    "type": "string"
                  },
                  "ext_system_name": {
                    "readonly": true,
                    "required": false,
                    "title": "External System Name",
                    "type": "string"
                  },
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": true,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "parent_id": {
                    "readonly": false,
                    "required": true,
                    "title": "Location",
                    "type": "integer"
                  },
                  "type": {
                    "required": true,
                    "type": "integer"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "record_date": null,
                "status": null,
                "status_date": null,
                "received_date": null,
                "essential": null,
                "cycle_period": null,
                "last_review_date": null,
                "next_review_date": null,
                "official": null,
                "storage": null,
                "accession": null,
                "subject": null,
                "rsi": null,
                "originator": null,
                "addressee": null,
                "sent_to": null,
                "establishment": null,
                "rmclassification_id": null
              },
              "options": {
                "fields": {
                  "record_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Record Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "status": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status",
                    "optionLabels": [
                      "STA-001..STATUS 001",
                      "STA-001..STATUS 001",
                      "STA-001..STATUS 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "status_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "received_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Received Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "essential": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Essential",
                    "optionLabels": [
                      "ESS-001..ESSENTIAL 001",
                      "ESS-001..ESSENTIAL 001",
                      "ESS-001..ESSENTIAL 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "cycle_period": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Update Cycle Period",
                    "optionLabels": [
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "last_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Last Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "next_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Next Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "official": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Official",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "storage": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Storage Medium",
                    "optionLabels": [
                      "STO-001..STORAGE 001",
                      "STO-001..STORAGE 001",
                      "STO-001..STORAGE 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "accession": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Accession",
                    "readonly": false,
                    "type": "text"
                  },
                  "subject": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Subject",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "rsi": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "RSI",
                    "readonly": false,
                    "type": "text"
                  },
                  "originator": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Author or Originator",
                    "readonly": false,
                    "type": "text"
                  },
                  "addressee": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "sent_to": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Other Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "establishment": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Originating Organization",
                    "readonly": false,
                    "type": "text"
                  },
                  "rmclassification_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "RM Classification",
                    "readonly": false,
                    "type": "number"
                  }
                }
              },
              "role_name": "rmclassifications",
              "schema": {
                "properties": {
                  "record_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Record Date",
                    "type": "string"
                  },
                  "status": {
                    "default": "",
                    "enum": [
                      "STA-001",
                      "STA-001",
                      "STA-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Status",
                    "type": "string"
                  },
                  "status_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Status Date",
                    "type": "string"
                  },
                  "received_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Received Date",
                    "type": "string"
                  },
                  "essential": {
                    "default": "",
                    "enum": [
                      "ESS-001",
                      "ESS-001",
                      "ESS-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Essential",
                    "type": "string"
                  },
                  "cycle_period": {
                    "default": "",
                    "enum": [
                      1,
                      2,
                      3,
                      12,
                      365,
                      7,
                      1,
                      2,
                      3,
                      12,
                      365,
                      7,
                      1,
                      2,
                      3,
                      12,
                      365,
                      7
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Update Cycle Period",
                    "type": "integer"
                  },
                  "last_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Last Review Date",
                    "type": "string"
                  },
                  "next_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Next Review Date",
                    "type": "string"
                  },
                  "official": {
                    "default": false,
                    "readonly": false,
                    "required": false,
                    "title": "Official",
                    "type": "boolean"
                  },
                  "storage": {
                    "default": "",
                    "enum": [
                      "STO-001",
                      "STO-001",
                      "STO-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Storage Medium",
                    "type": "string"
                  },
                  "accession": {
                    "readonly": false,
                    "required": false,
                    "title": "Accession",
                    "type": "string"
                  },
                  "subject": {
                    "readonly": false,
                    "required": false,
                    "title": "Subject",
                    "type": "string"
                  },
                  "rsi": {
                    "readonly": false,
                    "required": false,
                    "title": "RSI",
                    "type": "string"
                  },
                  "originator": {
                    "readonly": false,
                    "required": false,
                    "title": "Author or Originator",
                    "type": "string"
                  },
                  "addressee": {
                    "readonly": false,
                    "required": false,
                    "title": "Addressee(s)",
                    "type": "string"
                  },
                  "sent_to": {
                    "readonly": false,
                    "required": false,
                    "title": "Other Addressee(s)",
                    "type": "string"
                  },
                  "establishment": {
                    "readonly": false,
                    "required": false,
                    "title": "Originating Organization",
                    "type": "string"
                  },
                  "rmclassification_id": {
                    "readonly": false,
                    "required": false,
                    "title": "RM Classification",
                    "type": "integer"
                  }
                },
                "title": "RM Metadata",
                "type": "object"
              }
            },
            {
              "data": {
                "511687": {
                  "511687_2": null,
                  "511687_3": null,
                  "511687_4": null,
                  "511687_5": null,
                  "511687_6": null
                }
              },
              "options": {
                "fields": {
                  "511687": {
                    "fields": {
                      "511687_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Category",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_3": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Group",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_4": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Description",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_5": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Language",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_6": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Number",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Material Attributes",
                    "type": "object"
                  }
                },
                "role_name": "categories"
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "511687": {
                    "properties": {
                      "511687_2": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Category",
                        "type": "string"
                      },
                      "511687_3": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Group",
                        "type": "string"
                      },
                      "511687_4": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": true,
                        "title": "Description",
                        "type": "string"
                      },
                      "511687_5": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Language",
                        "type": "string"
                      },
                      "511687_6": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Number",
                        "type": "string"
                      }
                    },
                    "title": "Material Attributes",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }
            }
          ]
        }      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/forms/businessobjects/search?bo_type_id=297',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/forms/businessobjects/search?bo_type_id=297",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "bo_type_id": 297,
                "bo_type_name": "Material (D5G)",
                "bo_type": "BUS1001",
                "ext_system_id": "UT"
              },
              "options": {
                "fields": {
                  "bo_type_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Id",
                    "readonly": true,
                    "type": "number"
                  },
                  "bo_type_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "bo_type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type",
                    "readonly": true,
                    "type": "text"
                  },
                  "ext_system_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "External Sytem Id",
                    "readonly": true,
                    "type": "text"
                  }
                }
              },
              "schema": {
                "properties": {
                  "bo_type_id": {
                    "readonly": true,
                    "required": true,
                    "title": "Business Object Type Id",
                    "type": "integer"
                  },
                  "bo_type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Business Object Type Name",
                    "type": "string"
                  },
                  "bo_type": {
                    "readonly": true,
                    "required": false,
                    "title": "Business Object Type",
                    "type": "string"
                  },
                  "ext_system_id": {
                    "readonly": true,
                    "required": false,
                    "title": "External Sytem Id",
                    "type": "string"
                  }
                }
              }
            },
            {
              "data": {
                "ATTYP": "",
                "MATKL": "",
                "MAKTG": "",
                "SPRAS": "EN",
                "MATNR": ""
              },
              "options": {
                "fields": {
                  "ATTYP": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Material Category",
                    "optionLabels": [
                      "Single material (industry)",
                      "Single material",
                      "Generic material",
                      "Variant",
                      "Sales set",
                      "Prepack",
                      "Display",
                      "Material group material",
                      "Hierarchy material",
                      "Group material",
                      "Material group reference material"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "MATKL": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Material Group",
                    "readonly": false,
                    "type": "text"
                  },
                  "MAKTG": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Material description",
                    "readonly": false,
                    "type": "text"
                  },
                  "SPRAS": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Language Key",
                    "readonly": false,
                    "type": "text"
                  },
                  "MATNR": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Material",
                    "readonly": false,
                    "type": "text"
                  }
                }
              },
              "schema": {
                "properties": {
                  "ATTYP": {
                    "enum": [
                      "",
                      "00",
                      "01",
                      "02",
                      "10",
                      "11",
                      "12",
                      "20",
                      "21",
                      "22",
                      "30"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Material Category",
                    "type": "string"
                  },
                  "MATKL": {
                    "readonly": false,
                    "required": false,
                    "title": "Material Group",
                    "type": "string"
                  },
                  "MAKTG": {
                    "readonly": false,
                    "required": false,
                    "title": "Material description",
                    "type": "string"
                  },
                  "SPRAS": {
                    "readonly": false,
                    "required": false,
                    "title": "Language Key",
                    "type": "string"
                  },
                  "MATNR": {
                    "readonly": false,
                    "required": false,
                    "title": "Material",
                    "type": "string"
                  }
                },
                "title": "Material (D5G)",
                "type": "object"
              }
            }
          ]
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/businessobjects?bo_type_id=297&limit=100&page=1&where_SPRAS=EN',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/businessobjects?bo_type_id=297&limit=100&page=1&where_SPRAS=EN",
                "method": "GET",
                "name": ""
              }
            }
          },
          "paging": {
            "actions": {
              "next": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/businessobjects?bo_type_id=297&limit=100&page=2&where_SPRAS=EN",
                "method": "GET",
                "name": ""
              }
            },
            "limit": 100,
            "page": 1,
            "page_total": 2,
            "range_max": 100,
            "range_min": 1,
            "total_count": 101
          },
          "results": {
            "column_descriptions": [
              {
                "fieldLabel": "Ct",
                "fieldName": "ATTYP",
                "keyField": "",
                "length": 2,
                "position": 1
              },
              {
                "fieldLabel": "Matl Group",
                "fieldName": "MATKL",
                "keyField": "",
                "length": 9,
                "position": 2
              },
              {
                "fieldLabel": "Material description",
                "fieldName": "MAKTG",
                "keyField": "",
                "length": 40,
                "position": 3
              },
              {
                "fieldLabel": "Language",
                "fieldName": "SPRAS",
                "keyField": "",
                "length": 2,
                "position": 4
              },
              {
                "fieldLabel": "Material",
                "fieldName": "MATNR",
                "keyField": "X",
                "length": 18,
                "position": 5
              }
            ],
            "max_rows_exceeded": false,
            "result_rows": [
              {
                "businessObjectId": "000000000000000023",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "23",
                "Material description": "TEST MATERIAL",
                "Matl Group": "",
                "rowId": 1
              },
              {
                "businessObjectId": "000000000000000038",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "38",
                "Material description": "CLASSIFICATION TEST",
                "Matl Group": "00107",
                "rowId": 2
              },
              {
                "businessObjectId": "000000000000000043",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "43",
                "Material description": "ENGLISH CHECKING",
                "Matl Group": "",
                "rowId": 3
              },
              {
                "businessObjectId": "000000000000000058",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "58",
                "Material description": "VENTILATION, COMPLETE",
                "Matl Group": "",
                "rowId": 4
              },
              {
                "businessObjectId": "000000000000000059",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "59",
                "Material description": "FILTER",
                "Matl Group": "",
                "rowId": 5
              },
              {
                "businessObjectId": "000000000000000068",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "68",
                "Material description": "A PORTABLE 1 TON CRANE",
                "Matl Group": "013",
                "rowId": 6
              },
              {
                "businessObjectId": "000000000000000078",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "78",
                "Material description": "COMPONENT FULL REPAIR SERVICE",
                "Matl Group": "",
                "rowId": 7
              },
              {
                "businessObjectId": "000000000000000088",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "88",
                "Material description": "AS-100 T-SHIRT",
                "Matl Group": "02004",
                "rowId": 8
              },
              {
                "businessObjectId": "000000000000000089",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "89",
                "Material description": "AS-100 T-SHIRT",
                "Matl Group": "02004",
                "rowId": 9
              },
              {
                "businessObjectId": "000000000000000098",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "98",
                "Material description": "PCB SUBASSEMBLY",
                "Matl Group": "002",
                "rowId": 10
              },
              {
                "businessObjectId": "000000000000000170",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "170",
                "Material description": "REBATE SETTLEMENT: GLOSS PAINTS",
                "Matl Group": "004",
                "rowId": 11
              },
              {
                "businessObjectId": "000000000000000178",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "178",
                "Material description": "REBATE SETTLEMENT: PRIMINGS",
                "Matl Group": "004",
                "rowId": 12
              },
              {
                "businessObjectId": "000000000000000188",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "188",
                "Material description": "VALUE CONTRACT MATERIAL",
                "Matl Group": "",
                "rowId": 13
              },
              {
                "businessObjectId": "000000000000000288",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "288",
                "Material description": "PROTECTION SHIELD 1",
                "Matl Group": "00101",
                "rowId": 14
              },
              {
                "businessObjectId": "000000000000000358",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "358",
                "Material description": "EASY4U",
                "Matl Group": "002",
                "rowId": 15
              },
              {
                "businessObjectId": "000000000000000359",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "359",
                "Material description": "EASY4U",
                "Matl Group": "002",
                "rowId": 16
              },
              {
                "businessObjectId": "000000000000000578",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "578",
                "Material description": "SUNNY SUNNY",
                "Matl Group": "00207",
                "rowId": 17
              },
              {
                "businessObjectId": "000000000000000597",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "597",
                "Material description": "MOTORBIKE PLM130 GROUP 00",
                "Matl Group": "",
                "rowId": 18
              },
              {
                "businessObjectId": "000000000000000598",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "598",
                "Material description": "VOLVO 20 TONS",
                "Matl Group": "",
                "rowId": 19
              },
              {
                "businessObjectId": "000000000000000599",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "599",
                "Material description": "VOLVO 20 TONS",
                "Matl Group": "",
                "rowId": 20
              },
              {
                "businessObjectId": "000000000000000637",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "637",
                "Material description": "ADJUSTABLE BRACKET.IAM",
                "Matl Group": "",
                "rowId": 21
              },
              {
                "businessObjectId": "000000000000000638",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "638",
                "Material description": "CLAMP SCREW.IAM",
                "Matl Group": "",
                "rowId": 22
              },
              {
                "businessObjectId": "000000000000000640",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "640",
                "Material description": "ADJUSTING NUT.IPT",
                "Matl Group": "",
                "rowId": 23
              },
              {
                "businessObjectId": "000000000000000641",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "641",
                "Material description": "ADJUSTING SCREW.IPT",
                "Matl Group": "",
                "rowId": 24
              },
              {
                "businessObjectId": "000000000000000642",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "642",
                "Material description": "CLAMP SCREW.IPT",
                "Matl Group": "",
                "rowId": 25
              },
              {
                "businessObjectId": "000000000000000643",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "643",
                "Material description": "HOLDER BRACKET.IPT",
                "Matl Group": "",
                "rowId": 26
              },
              {
                "businessObjectId": "000000000000000644",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "644",
                "Material description": "KNOB.IPT",
                "Matl Group": "",
                "rowId": 27
              },
              {
                "businessObjectId": "000000000000000645",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "645",
                "Material description": "PILOT SCREW.IPT",
                "Matl Group": "",
                "rowId": 28
              },
              {
                "businessObjectId": "000000000000000646",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "646",
                "Material description": "PIN.IPT",
                "Matl Group": "",
                "rowId": 29
              },
              {
                "businessObjectId": "000000000000000647",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "647",
                "Material description": "HEXAGON SOCKET HEAD CAP SCREW - 1/4 - 20",
                "Matl Group": "",
                "rowId": 30
              },
              {
                "businessObjectId": "000000000000000648",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "648",
                "Material description": "HEXAGON SOCKET SET SCREW - FLAT POINT -",
                "Matl Group": "",
                "rowId": 31
              },
              {
                "businessObjectId": "000000000000000679",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "679",
                "Material description": "MAXITEC-R 375 PERSONAL COMPUTER",
                "Matl Group": "012",
                "rowId": 32
              },
              {
                "businessObjectId": "000000000000000697",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "697",
                "Material description": "NAVIGATION CPU",
                "Matl Group": "00204",
                "rowId": 33
              },
              {
                "businessObjectId": "000000000000000732",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "732",
                "Material description": "HP JORNADA 820",
                "Matl Group": "00213",
                "rowId": 34
              },
              {
                "businessObjectId": "000000000000000757",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "757",
                "Material description": "CREDIT NOTE ITEM FOR POINTS",
                "Matl Group": "002",
                "rowId": 35
              },
              {
                "businessObjectId": "000000000000000817",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "817",
                "Material description": "PAINT",
                "Matl Group": "004",
                "rowId": 36
              },
              {
                "businessObjectId": "000000000000000818",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "818",
                "Material description": "PAINT",
                "Matl Group": "004",
                "rowId": 37
              },
              {
                "businessObjectId": "000000000000000819",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "819",
                "Material description": "WALLPAPER",
                "Matl Group": "00107",
                "rowId": 38
              },
              {
                "businessObjectId": "000000000000000820",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "820",
                "Material description": "DOOR",
                "Matl Group": "00107",
                "rowId": 39
              },
              {
                "businessObjectId": "000000000000000821",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "821",
                "Material description": "CARPETING",
                "Matl Group": "00107",
                "rowId": 40
              },
              {
                "businessObjectId": "000000000000000897",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "897",
                "Material description": "HK -01",
                "Matl Group": "00107",
                "rowId": 41
              },
              {
                "businessObjectId": "000000000000000898",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "898",
                "Material description": "HK -01",
                "Matl Group": "00107",
                "rowId": 42
              },
              {
                "businessObjectId": "000000000000000938",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "938",
                "Material description": "TURBINE",
                "Matl Group": "00108",
                "rowId": 43
              },
              {
                "businessObjectId": "000000000000000939",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "939",
                "Material description": "TURBINE CASING 01",
                "Matl Group": "00101",
                "rowId": 44
              },
              {
                "businessObjectId": "000000000000000947",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "947",
                "Material description": "TURBINE CASING 02",
                "Matl Group": "00101",
                "rowId": 45
              },
              {
                "businessObjectId": "000000000000000948",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "948",
                "Material description": "TURBINE CASING 03",
                "Matl Group": "00101",
                "rowId": 46
              },
              {
                "businessObjectId": "000000000000000949",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "949",
                "Material description": "COMPRESSOR 8X13",
                "Matl Group": "00101",
                "rowId": 47
              },
              {
                "businessObjectId": "000000000000000950",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "950",
                "Material description": "GENERATOR",
                "Matl Group": "00101",
                "rowId": 48
              },
              {
                "businessObjectId": "000000000000000951",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "951",
                "Material description": "CONTROL UNIT (RACK)",
                "Matl Group": "00103",
                "rowId": 49
              },
              {
                "businessObjectId": "000000000000000952",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "952",
                "Material description": "LUBRICATION UNIT",
                "Matl Group": "00101",
                "rowId": 50
              },
              {
                "businessObjectId": "000000000000000953",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "953",
                "Material description": "BEARING (COMPLETE)",
                "Matl Group": "00101",
                "rowId": 51
              },
              {
                "businessObjectId": "000000000000000954",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "954",
                "Material description": "CABLE HIGH CURRENT 10 KA",
                "Matl Group": "00101",
                "rowId": 52
              },
              {
                "businessObjectId": "000000000000000955",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "955",
                "Material description": "COMPRESSOR HIGH PRESSURE PART 1",
                "Matl Group": "00101",
                "rowId": 53
              },
              {
                "businessObjectId": "000000000000000957",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "957",
                "Material description": "COMPRESSOR LOW PRESSURE PART",
                "Matl Group": "00101",
                "rowId": 54
              },
              {
                "businessObjectId": "000000000000000958",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "958",
                "Material description": "BEARING EASING",
                "Matl Group": "00101",
                "rowId": 55
              },
              {
                "businessObjectId": "000000000000000959",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "959",
                "Material description": "RADIAL BEARING",
                "Matl Group": "00101",
                "rowId": 56
              },
              {
                "businessObjectId": "000000000000000967",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "967",
                "Material description": "SPRING FRESH DETERGENT, 64OZ",
                "Matl Group": "R1133",
                "rowId": 57
              },
              {
                "businessObjectId": "000000000000000968",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "968",
                "Material description": "DVD: MIAMI FUN",
                "Matl Group": "002",
                "rowId": 58
              },
              {
                "businessObjectId": "000000000000001009",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1009",
                "Material description": "ACSIS DEMO PRODUCT",
                "Matl Group": "017",
                "rowId": 59
              },
              {
                "businessObjectId": "000000000000001012",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1012",
                "Material description": "ACSIS DEMO PRODUCT",
                "Matl Group": "017",
                "rowId": 60
              },
              {
                "businessObjectId": "000000000000001015",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1015",
                "Material description": "ACSIS DEMO - TABLETS",
                "Matl Group": "017",
                "rowId": 61
              },
              {
                "businessObjectId": "000000000000001016",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1016",
                "Material description": "ACSIS DEMO - TABLETS",
                "Matl Group": "017",
                "rowId": 62
              },
              {
                "businessObjectId": "000000000000001017",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1017",
                "Material description": "ACSIS DEMO - BOTTLES",
                "Matl Group": "008",
                "rowId": 63
              },
              {
                "businessObjectId": "000000000000001018",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1018",
                "Material description": "ACSIS DEMO - BOTTLES",
                "Matl Group": "008",
                "rowId": 64
              },
              {
                "businessObjectId": "000000000000001019",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1019",
                "Material description": "ACSIS DEMO - CAPS",
                "Matl Group": "008",
                "rowId": 65
              },
              {
                "businessObjectId": "000000000000001020",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1020",
                "Material description": "ACSIS DEMO - CAPS",
                "Matl Group": "008",
                "rowId": 66
              },
              {
                "businessObjectId": "000000000000001108",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1108",
                "Material description": "2222",
                "Matl Group": "001",
                "rowId": 67
              },
              {
                "businessObjectId": "000000000000001109",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1109",
                "Material description": "2223",
                "Matl Group": "001",
                "rowId": 68
              },
              {
                "businessObjectId": "000000000000001110",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1110",
                "Material description": "INDUSTRY PALETTE",
                "Matl Group": "007",
                "rowId": 69
              },
              {
                "businessObjectId": "000000000000001121",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1121",
                "Material description": "LSP SERVICE BOOKING PALLETS",
                "Matl Group": "007",
                "rowId": 70
              },
              {
                "businessObjectId": "000000000000001157",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1157",
                "Material description": "170DS55001C-184M",
                "Matl Group": "00101",
                "rowId": 71
              },
              {
                "businessObjectId": "000000000000001177",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1177",
                "Material description": "BOLT",
                "Matl Group": "",
                "rowId": 72
              },
              {
                "businessObjectId": "000000000000001257",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1257",
                "Material description": "EURO PALLET",
                "Matl Group": "007",
                "rowId": 73
              },
              {
                "businessObjectId": "000000000000001267",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1267",
                "Material description": "LAPTOP - IBM T42",
                "Matl Group": "00200",
                "rowId": 74
              },
              {
                "businessObjectId": "000000000000001268",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1268",
                "Material description": "PDA",
                "Matl Group": "00200",
                "rowId": 75
              },
              {
                "businessObjectId": "000000000000001289",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1289",
                "Material description": "CONCRETE TIE 7X9X9",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 76
              },
              {
                "businessObjectId": "000000000000001301",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1301",
                "Material description": "WOOD TIE 7X8X8'",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 77
              },
              {
                "businessObjectId": "000000000000001304",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1304",
                "Material description": "CONCRETE TIE 7X9X9'",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 78
              },
              {
                "businessObjectId": "000000000000001308",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1308",
                "Material description": "CONCRETE TIE 7X8X8'",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 79
              },
              {
                "businessObjectId": "000000000000001309",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1309",
                "Material description": "BALLAST GRAVEL ROCK",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 80
              },
              {
                "businessObjectId": "000000000000001310",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1310",
                "Material description": "WOOD SET # 20",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 81
              },
              {
                "businessObjectId": "000000000000001311",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1311",
                "Material description": "AUTOMATIC SWITCH STAND # 20",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 82
              },
              {
                "businessObjectId": "000000000000001312",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1312",
                "Material description": "MANUAL SWITCH STAND # 20",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 83
              },
              {
                "businessObjectId": "000000000000001313",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1313",
                "Material description": "SWITCH FROG # 20",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 84
              },
              {
                "businessObjectId": "000000000000001314",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1314",
                "Material description": "STEEL RAIL 136 LB/YD 60'",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 85
              },
              {
                "businessObjectId": "000000000000001315",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1315",
                "Material description": "STEEL RAIL 140 LB/YD 60'",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 86
              },
              {
                "businessObjectId": "000000000000001316",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1316",
                "Material description": "WELDING SET",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 87
              },
              {
                "businessObjectId": "000000000000001317",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1317",
                "Material description": "PANDROL CLIP",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 88
              },
              {
                "businessObjectId": "000000000000001318",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1318",
                "Material description": "RAIL SPIKES 7\"",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 89
              },
              {
                "businessObjectId": "000000000000001319",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1319",
                "Material description": "STANDARD JOINT BAR 136 LB/YD",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 90
              },
              {
                "businessObjectId": "000000000000001320",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1320",
                "Material description": "STANDARD JOINT BAR 140 LB/YD",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 91
              },
              {
                "businessObjectId": "000000000000001321",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1321",
                "Material description": "INSULATED JOINT BAR 136 LB/YD",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 92
              },
              {
                "businessObjectId": "000000000000001322",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1322",
                "Material description": "INSULATED JOINT BAR 140 LB/YD",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 93
              },
              {
                "businessObjectId": "000000000000001323",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1323",
                "Material description": "COMPROMISE JOINT BAR 136/140 LB/YD",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 94
              },
              {
                "businessObjectId": "000000000000001324",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1324",
                "Material description": "SWITCH NEEDLE STEEL 39' 136 LB LEFT",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 95
              },
              {
                "businessObjectId": "000000000000001325",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1325",
                "Material description": "ELECTRICAL CABLE",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 96
              },
              {
                "businessObjectId": "000000000000001326",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1326",
                "Material description": "LIGHT BULBS",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 97
              },
              {
                "businessObjectId": "000000000000001327",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1327",
                "Material description": "COLOURED LENDS",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 98
              },
              {
                "businessObjectId": "000000000000001328",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1328",
                "Material description": "ELECTRIC MOTOR",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 99
              },
              {
                "businessObjectId": "000000000000001333",
                "Ct": "",
                "has_workspace": false,
                "Language": "EN",
                "Material": "1333",
                "Material description": "CHANGE NEEDLE STEEL MN 39'N140 LB LEFT",
                "Matl Group": "ZRAIL_MAT",
                "rowId": 100
              }
            ]
          }
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/forms/businessworkspaces/create?parent_id=511690&type=848&wksp_type_id=437&template_id=502179&bo_type_id=297&bo_id=000000000000000679',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "bo_type_id": 297,
                "bo_type_name": "Material (D5G)",
                "description": "",
                "ext_system_id": "UT",
                "ext_system_name": "UT",
                "name": "Mat WS Type Maxitec-R 375 Personal computer",
                "parent_id": 511690,
                "type": 848
              },
              "options": {
                "fields": {
                  "bo_type_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Id",
                    "readonly": true,
                    "type": "number"
                  },
                  "bo_type_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "ext_system_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "External Sytem Id",
                    "readonly": true,
                    "type": "text"
                  },
                  "ext_system_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "External System Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "parent_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Location",
                    "readonly": false,
                    "type": "number"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "type": "integer"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes",
                    "method": "POST"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "bo_type_id": {
                    "readonly": true,
                    "required": true,
                    "title": "Business Object Type Id",
                    "type": "integer"
                  },
                  "bo_type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Business Object Type Name",
                    "type": "string"
                  },
                  "description": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "ext_system_id": {
                    "readonly": true,
                    "required": false,
                    "title": "External Sytem Id",
                    "type": "string"
                  },
                  "ext_system_name": {
                    "readonly": true,
                    "required": false,
                    "title": "External System Name",
                    "type": "string"
                  },
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": true,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "parent_id": {
                    "readonly": false,
                    "required": true,
                    "title": "Location",
                    "type": "integer"
                  },
                  "type": {
                    "required": true,
                    "type": "integer"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "record_date": null,
                "status": null,
                "status_date": null,
                "received_date": null,
                "essential": null,
                "cycle_period": null,
                "last_review_date": null,
                "next_review_date": null,
                "official": null,
                "storage": null,
                "accession": null,
                "subject": null,
                "rsi": null,
                "originator": null,
                "addressee": null,
                "sent_to": null,
                "establishment": null,
                "rmclassification_id": null
              },
              "options": {
                "fields": {
                  "record_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Record Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "status": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status",
                    "optionLabels": [
                      "STA-001..STATUS 001",
                      "STA-001..STATUS 001",
                      "STA-001..STATUS 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "status_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "received_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Received Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "essential": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Essential",
                    "optionLabels": [
                      "ESS-001..ESSENTIAL 001",
                      "ESS-001..ESSENTIAL 001",
                      "ESS-001..ESSENTIAL 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "cycle_period": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Update Cycle Period",
                    "optionLabels": [
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "last_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Last Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "next_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Next Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "official": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Official",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "storage": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Storage Medium",
                    "optionLabels": [
                      "STO-001..STORAGE 001",
                      "STO-001..STORAGE 001",
                      "STO-001..STORAGE 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "accession": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Accession",
                    "readonly": false,
                    "type": "text"
                  },
                  "subject": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Subject",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "rsi": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "RSI",
                    "readonly": false,
                    "type": "text"
                  },
                  "originator": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Author or Originator",
                    "readonly": false,
                    "type": "text"
                  },
                  "addressee": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "sent_to": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Other Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "establishment": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Originating Organization",
                    "readonly": false,
                    "type": "text"
                  },
                  "rmclassification_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "RM Classification",
                    "readonly": false,
                    "type": "number"
                  }
                }
              },
              "role_name": "rmclassifications",
              "schema": {
                "properties": {
                  "record_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Record Date",
                    "type": "string"
                  },
                  "status": {
                    "default": "",
                    "enum": [
                      "STA-001",
                      "STA-001",
                      "STA-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Status",
                    "type": "string"
                  },
                  "status_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Status Date",
                    "type": "string"
                  },
                  "received_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Received Date",
                    "type": "string"
                  },
                  "essential": {
                    "default": "",
                    "enum": [
                      "ESS-001",
                      "ESS-001",
                      "ESS-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Essential",
                    "type": "string"
                  },
                  "cycle_period": {
                    "default": "",
                    "enum": [
                      1,
                      2,
                      3,
                      12,
                      365,
                      7,
                      1,
                      2,
                      3,
                      12,
                      365,
                      7,
                      1,
                      2,
                      3,
                      12,
                      365,
                      7
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Update Cycle Period",
                    "type": "integer"
                  },
                  "last_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Last Review Date",
                    "type": "string"
                  },
                  "next_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Next Review Date",
                    "type": "string"
                  },
                  "official": {
                    "default": false,
                    "readonly": false,
                    "required": false,
                    "title": "Official",
                    "type": "boolean"
                  },
                  "storage": {
                    "default": "",
                    "enum": [
                      "STO-001",
                      "STO-001",
                      "STO-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Storage Medium",
                    "type": "string"
                  },
                  "accession": {
                    "readonly": false,
                    "required": false,
                    "title": "Accession",
                    "type": "string"
                  },
                  "subject": {
                    "readonly": false,
                    "required": false,
                    "title": "Subject",
                    "type": "string"
                  },
                  "rsi": {
                    "readonly": false,
                    "required": false,
                    "title": "RSI",
                    "type": "string"
                  },
                  "originator": {
                    "readonly": false,
                    "required": false,
                    "title": "Author or Originator",
                    "type": "string"
                  },
                  "addressee": {
                    "readonly": false,
                    "required": false,
                    "title": "Addressee(s)",
                    "type": "string"
                  },
                  "sent_to": {
                    "readonly": false,
                    "required": false,
                    "title": "Other Addressee(s)",
                    "type": "string"
                  },
                  "establishment": {
                    "readonly": false,
                    "required": false,
                    "title": "Originating Organization",
                    "type": "string"
                  },
                  "rmclassification_id": {
                    "readonly": false,
                    "required": false,
                    "title": "RM Classification",
                    "type": "integer"
                  }
                },
                "title": "RM Metadata",
                "type": "object"
              }
            },
            {
              "data": {
                "511687": {
                  "511687_2": null,
                  "511687_3": null,
                  "511687_4": "Maxitec-R 375 Personal computer",
                  "511687_5": null,
                  "511687_6": null
                }
              },
              "options": {
                "fields": {
                  "511687": {
                    "fields": {
                      "511687_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Category",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_3": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Group",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_4": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Description",
                        "maxLength": 32,
                        "readonly": true,
                        "type": "text"
                      },
                      "511687_5": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Language",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_6": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Number",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Material Attributes",
                    "type": "object"
                  }
                },
                "role_name": "categories"
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "511687": {
                    "properties": {
                      "511687_2": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Category",
                        "type": "string"
                      },
                      "511687_3": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Group",
                        "type": "string"
                      },
                      "511687_4": {
                        "maxLength": 32,
                        "readonly": true,
                        "required": true,
                        "title": "Description",
                        "type": "string"
                      },
                      "511687_5": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Language",
                        "type": "string"
                      },
                      "511687_6": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Number",
                        "type": "string"
                      }
                    },
                    "title": "Material Attributes",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }
            }
          ]
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes?expand=properties%7Bcreate_user_id%2Cowner_user_id%7D&actions',
        responseTime: 0,
        responseText: undefined
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/forms/businessworkspaces/create?parent_id=511690&type=848&wksp_type_id=437&template_id=502179&bo_type_id=297&bo_id=000000000000000288',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "bo_type_id": 297,
                "bo_type_name": "Material (D5G)",
                "description": "",
                "ext_system_id": "UT",
                "ext_system_name": "UT",
                "name": "Mat WS Type Protection shield 1",
                "parent_id": 511690,
                "type": 848
              },
              "options": {
                "fields": {
                  "bo_type_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Id",
                    "readonly": true,
                    "type": "number"
                  },
                  "bo_type_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Business Object Type Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "ext_system_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "External Sytem Id",
                    "readonly": true,
                    "type": "text"
                  },
                  "ext_system_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "External System Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "parent_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Location",
                    "readonly": false,
                    "type": "number"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "type": "integer"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes",
                    "method": "POST"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "bo_type_id": {
                    "readonly": true,
                    "required": true,
                    "title": "Business Object Type Id",
                    "type": "integer"
                  },
                  "bo_type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Business Object Type Name",
                    "type": "string"
                  },
                  "description": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "ext_system_id": {
                    "readonly": true,
                    "required": false,
                    "title": "External Sytem Id",
                    "type": "string"
                  },
                  "ext_system_name": {
                    "readonly": true,
                    "required": false,
                    "title": "External System Name",
                    "type": "string"
                  },
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": true,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "parent_id": {
                    "readonly": false,
                    "required": true,
                    "title": "Location",
                    "type": "integer"
                  },
                  "type": {
                    "required": true,
                    "type": "integer"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "record_date": null,
                "status": null,
                "status_date": null,
                "received_date": null,
                "essential": null,
                "cycle_period": null,
                "last_review_date": null,
                "next_review_date": null,
                "official": null,
                "storage": null,
                "accession": null,
                "subject": null,
                "rsi": null,
                "originator": null,
                "addressee": null,
                "sent_to": null,
                "establishment": null,
                "rmclassification_id": null
              },
              "options": {
                "fields": {
                  "record_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Record Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "status": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status",
                    "optionLabels": [
                      "STA-001..STATUS 001",
                      "STA-001..STATUS 001",
                      "STA-001..STATUS 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "status_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "received_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Received Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "essential": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Essential",
                    "optionLabels": [
                      "ESS-001..ESSENTIAL 001",
                      "ESS-001..ESSENTIAL 001",
                      "ESS-001..ESSENTIAL 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "cycle_period": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Update Cycle Period",
                    "optionLabels": [
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "Semi-annual based on calend...",
                      "Quarterly based on calendar...",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "last_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Last Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "next_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Next Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "official": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Official",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "storage": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Storage Medium",
                    "optionLabels": [
                      "STO-001..STORAGE 001",
                      "STO-001..STORAGE 001",
                      "STO-001..STORAGE 001"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "accession": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Accession",
                    "readonly": false,
                    "type": "text"
                  },
                  "subject": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Subject",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "rsi": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "RSI",
                    "readonly": false,
                    "type": "text"
                  },
                  "originator": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Author or Originator",
                    "readonly": false,
                    "type": "text"
                  },
                  "addressee": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "sent_to": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Other Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "establishment": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Originating Organization",
                    "readonly": false,
                    "type": "text"
                  },
                  "rmclassification_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "RM Classification",
                    "readonly": false,
                    "type": "number"
                  }
                }
              },
              "role_name": "rmclassifications",
              "schema": {
                "properties": {
                  "record_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Record Date",
                    "type": "string"
                  },
                  "status": {
                    "default": "",
                    "enum": [
                      "STA-001",
                      "STA-001",
                      "STA-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Status",
                    "type": "string"
                  },
                  "status_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Status Date",
                    "type": "string"
                  },
                  "received_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Received Date",
                    "type": "string"
                  },
                  "essential": {
                    "default": "",
                    "enum": [
                      "ESS-001",
                      "ESS-001",
                      "ESS-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Essential",
                    "type": "string"
                  },
                  "cycle_period": {
                    "default": "",
                    "enum": [
                      1,
                      2,
                      3,
                      12,
                      365,
                      7,
                      1,
                      2,
                      3,
                      12,
                      365,
                      7,
                      1,
                      2,
                      3,
                      12,
                      365,
                      7
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Update Cycle Period",
                    "type": "integer"
                  },
                  "last_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Last Review Date",
                    "type": "string"
                  },
                  "next_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Next Review Date",
                    "type": "string"
                  },
                  "official": {
                    "default": false,
                    "readonly": false,
                    "required": false,
                    "title": "Official",
                    "type": "boolean"
                  },
                  "storage": {
                    "default": "",
                    "enum": [
                      "STO-001",
                      "STO-001",
                      "STO-001"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Storage Medium",
                    "type": "string"
                  },
                  "accession": {
                    "readonly": false,
                    "required": false,
                    "title": "Accession",
                    "type": "string"
                  },
                  "subject": {
                    "readonly": false,
                    "required": false,
                    "title": "Subject",
                    "type": "string"
                  },
                  "rsi": {
                    "readonly": false,
                    "required": false,
                    "title": "RSI",
                    "type": "string"
                  },
                  "originator": {
                    "readonly": false,
                    "required": false,
                    "title": "Author or Originator",
                    "type": "string"
                  },
                  "addressee": {
                    "readonly": false,
                    "required": false,
                    "title": "Addressee(s)",
                    "type": "string"
                  },
                  "sent_to": {
                    "readonly": false,
                    "required": false,
                    "title": "Other Addressee(s)",
                    "type": "string"
                  },
                  "establishment": {
                    "readonly": false,
                    "required": false,
                    "title": "Originating Organization",
                    "type": "string"
                  },
                  "rmclassification_id": {
                    "readonly": false,
                    "required": false,
                    "title": "RM Classification",
                    "type": "integer"
                  }
                },
                "title": "RM Metadata",
                "type": "object"
              }
            },
            {
              "data": {
                "511687": {
                  "511687_2": null,
                  "511687_3": null,
                  "511687_4": "Protection shield 1",
                  "511687_5": null,
                  "511687_6": null
                }
              },
              "options": {
                "fields": {
                  "511687": {
                    "fields": {
                      "511687_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Category",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_3": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Group",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_4": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Description",
                        "maxLength": 32,
                        "readonly": true,
                        "type": "text"
                      },
                      "511687_5": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Language",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      },
                      "511687_6": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Number",
                        "maxLength": 32,
                        "readonly": false,
                        "type": "text"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Material Attributes",
                    "type": "object"
                  }
                },
                "role_name": "categories"
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "511687": {
                    "properties": {
                      "511687_2": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Category",
                        "type": "string"
                      },
                      "511687_3": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Group",
                        "type": "string"
                      },
                      "511687_4": {
                        "maxLength": 32,
                        "readonly": true,
                        "required": true,
                        "title": "Description",
                        "type": "string"
                      },
                      "511687_5": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Language",
                        "type": "string"
                      },
                      "511687_6": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Number",
                        "type": "string"
                      }
                    },
                    "title": "Material Attributes",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }
            }
          ]
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/businessworkspaces',
        type: 'post',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/businessworkspaces",
                "method": "POST",
                "name": ""
              }
            }
          },
          "results": {
            "id": 538888
          }
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/...',
        responseTime: 0,
        responseText: {/*...*/}
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/538888?expand=properties*',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/538888?expand=properties%7Bcreate_user_id%2Cowner_user_id%7D&actions",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/copy?id=538888",
                  "href": "/api/v2/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/members/favorites/538888",
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
                  "form_href": "/api/v2/forms/nodes/move?id=538888",
                  "href": "/api/v2/nodes/538888",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=538888",
                  "href": "/api/v2/nodes/538888",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties",
                  "audit"
                ]
              },
              "order": [
                "open",
                "rename",
                "makefavorite",
                "copy",
                "move",
                "delete",
                "more"
              ]
            },
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
                "container_size": 0,
                "create_date": "2016-08-03T08:12:29",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "de": "",
                  "en": "",
                  "en_US": "",
                  "es": "",
                  "fr": "",
                  "it": ""
                },
                "favorite": false,
                "id": 538888,
                "mime_type": null,
                "modify_date": "2016-08-03T08:12:30",
                "modify_user_id": 1000,
                "name": "Mat WS Type Protection shield 1",
                "name_multilingual": {
                  "de": "",
                  "en": "Mat WS Type Protection shield 1",
                  "en_US": "",
                  "es": "",
                  "fr": "",
                  "it": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 511690,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 0,
                "size_formatted": "0 Items",
                "type": 848,
                "type_name": "Business Workspace",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }
        }
      }));
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/538888?expand=node&expand=user&actions',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/538888?expand=node&expand=user&actions",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/copy?id=538888",
                  "href": "/api/v2/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/members/favorites/538888",
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
                  "form_href": "/api/v2/forms/nodes/move?id=538888",
                  "href": "/api/v2/nodes/538888",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/538888",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=538888",
                  "href": "/api/v2/nodes/538888",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties",
                  "audit"
                ]
              },
              "order": [
                "open",
                "rename",
                "makefavorite",
                "copy",
                "move",
                "delete",
                "more"
              ]
            },
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
                "container_size": 0,
                "create_date": "2016-08-03T08:12:29",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de": "",
                  "en": "",
                  "en_US": "",
                  "es": "",
                  "fr": "",
                  "it": ""
                },
                "favorite": false,
                "id": 538888,
                "mime_type": null,
                "modify_date": "2016-08-03T08:12:30",
                "modify_user_id": 1000,
                "name": "Mat WS Type Protection shield 1",
                "name_multilingual": {
                  "de": "",
                  "en": "Mat WS Type Protection shield 1",
                  "en_US": "",
                  "es": "",
                  "fr": "",
                  "it": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 511690,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 0,
                "size_formatted": "0 Items",
                "type": 848,
                "type_name": "Business Workspace",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = this.mocks.pop())) {
        mockjax.clear(mock);
      }
    }

  };

  return DataManager;

});


