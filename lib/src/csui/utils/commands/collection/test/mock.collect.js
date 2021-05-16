/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax', '../../../../models/test/nodechildren2.mock.js'
], function (require, _, $, mockjax, nodechildren2Mock) {
  'use strict';
  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/search(?:\\?(.*))?$'),
        responseText: {
          "collection": {
            "paging": {
              "limit": 10,
              "links": {
                "next": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=2&where=*&cache_id=2002384794",
                  "method": "GET",
                  "name": "Next"
                }
              },
              "page": 1,
              "page_total": 1939,
              "range_max": 10,
              "range_min": 1,
              "result_header_string": "Results 1 to 10 of 19380 sorted by Relevance",
              "total_count": 19380
            },
            "searching": {
              "cache_id": 2002384794,
              "facets": {
                "available": [{
                  "count": 55,
                  "count_exceeded": false,
                  "display_name": "Creation Date",
                  "facet_items": [{
                    "count": 199,
                    "display_name": "Last 3 days",
                    "value": "lz3d"
                  }, {
                    "count": 376,
                    "display_name": "Last 2 weeks",
                    "value": "ly2w"
                  }, {
                    "count": 1849,
                    "display_name": "Last 2 months",
                    "value": "lx2m"
                  }, {
                    "count": 4984,
                    "display_name": "Last 6 months",
                    "value": "lw6m"
                  }, {
                    "count": 11899,
                    "display_name": "Last 12 months",
                    "value": "lv1y"
                  }, {
                    "count": 16792,
                    "display_name": "Last 3 years",
                    "value": "lu3y"
                  }, {
                    "count": 19092,
                    "display_name": "Last 5 years",
                    "value": "lt5y"
                  }, {
                    "count": 288,
                    "display_name": "Older",
                    "value": "ls5o"
                  }],
                  "name": "OTCreateDate",
                  "type": "Date"
                }, {
                  "count": 110,
                  "count_exceeded": false,
                  "display_name": "Content Type",
                  "facet_items": [{
                    "count": 11339,
                    "display_name": "Document",
                    "value": "144"
                  }, {
                    "count": 2991,
                    "display_name": "Folder",
                    "value": "0"
                  }, {
                    "count": 1163,
                    "display_name": "Wiki Page",
                    "value": "5574"
                  }, {
                    "count": 743,
                    "display_name": "MicroPost",
                    "value": "1281"
                  }, {
                    "count": 470,
                    "display_name": "Category",
                    "value": "131"
                  }, {
                    "count": 323,
                    "display_name": "ActiveView",
                    "value": "30309"
                  }, {
                    "count": 300,
                    "display_name": "Shortcut",
                    "value": "1"
                  }, {
                    "count": 263,
                    "display_name": "Wiki",
                    "value": "5573"
                  }, {
                    "count": 205,
                    "display_name": "URL",
                    "value": "140"
                  }, {
                    "count": 164,
                    "display_name": "Forum Topics & Replies",
                    "value": "123470"
                  }, {
                    "count": 150,
                    "display_name": "Asset Folder",
                    "value": "955"
                  }, {
                    "count": 124,
                    "display_name": "Collection",
                    "value": "298"
                  }, {
                    "count": 109,
                    "display_name": "Task List",
                    "value": "204"
                  }, {
                    "count": 75,
                    "display_name": "Business Workspace",
                    "value": "848"
                  }, {
                    "count": 70,
                    "display_name": "LiveReport",
                    "value": "299"
                  }, {
                    "count": 55,
                    "display_name": "RM Classification",
                    "value": "551"
                  }, {
                    "count": 54,
                    "display_name": "Email Folder",
                    "value": "751"
                  }, {
                    "count": 51,
                    "display_name": "Workflow Map",
                    "value": "128"
                  }, {
                    "count": 44,
                    "display_name": "Task",
                    "value": "206"
                  }, {
                    "count": 41,
                    "display_name": "Search Query",
                    "value": "258"
                  }],
                  "name": "OTSubType",
                  "type": "Text"
                }, {
                  "count": 56,
                  "count_exceeded": false,
                  "display_name": "File Type",
                  "facet_items": [{
                    "count": 3774,
                    "display_name": "Text",
                    "value": "Text"
                  }, {
                    "count": 3737,
                    "display_name": "Picture",
                    "value": "Picture"
                  }, {
                    "count": 3140,
                    "display_name": "Folder",
                    "value": "Folder"
                  }, {
                    "count": 2786,
                    "display_name": "Photo",
                    "value": "Photo"
                  }, {
                    "count": 1613,
                    "display_name": "Microsoft Word",
                    "value": "Microsoft Word"
                  }, {
                    "count": 1366,
                    "display_name": "Adobe PDF",
                    "value": "Adobe PDF"
                  }, {
                    "count": 1263,
                    "display_name": "UNKNOWN",
                    "value": "UNKNOWN"
                  }, {
                    "count": 1021,
                    "display_name": "Microsoft Excel",
                    "value": "Microsoft Excel"
                  }, {
                    "count": 743,
                    "display_name": "Blog",
                    "value": "Blog"
                  }, {
                    "count": 501,
                    "display_name": "Classification",
                    "value": "Classification"
                  }, {
                    "count": 318,
                    "display_name": "ActiveView",
                    "value": "ActiveView"
                  }, {
                    "count": 309,
                    "display_name": "Graphics",
                    "value": "Graphics"
                  }, {
                    "count": 296,
                    "display_name": "Microsoft PowerPoint",
                    "value": "Microsoft PowerPoint"
                  }, {
                    "count": 262,
                    "display_name": "Web Page",
                    "value": "Web Page"
                  }, {
                    "count": 161,
                    "display_name": "Task",
                    "value": "Task"
                  }, {
                    "count": 99,
                    "display_name": "JPEG",
                    "value": "JPEG"
                  }, {
                    "count": 94,
                    "display_name": "Software Report",
                    "value": "Software Report"
                  }, {
                    "count": 93,
                    "display_name": "Compressed Archive",
                    "value": "Compressed Archive"
                  }, {
                    "count": 66,
                    "display_name": "Workflow",
                    "value": "Workflow"
                  }, {
                    "count": 64,
                    "display_name": "Video ",
                    "value": "Video"
                  }],
                  "name": "OTFileType",
                  "type": "Text"
                }, {
                  "count": 39,
                  "count_exceeded": false,
                  "display_name": "Classification",
                  "facet_items": [{
                    "count": 1534,
                    "display_name": "MyClassification : Class1",
                    "value": "1707840 2067849 2067850"
                  }, {
                    "count": 1407,
                    "display_name": "MyClassification : Class 2",
                    "value": "1707840 2067849 2120757"
                  }, {
                    "count": 963,
                    "display_name": "Hyd-Classifications : Class1",
                    "value": "1707840 9442390 15741379"
                  }, {
                    "count": 646,
                    "display_name": "Classifications : Rm33",
                    "value": "1707840 15741269"
                  }, {
                    "count": 577,
                    "display_name": "Classifications : CWS classification tree",
                    "value": "1707840 18121785"
                  }, {
                    "count": 349,
                    "display_name": "CTree1 : C2",
                    "value": "1707840 6271898 6272669"
                  }, {
                    "count": 206,
                    "display_name": "RMClassification_testing_children : RM1",
                    "value": "1707840 13815265 13815485"
                  }, {
                    "count": 188,
                    "display_name": "CTree1 : C1",
                    "value": "1707840 6271898 6272668"
                  }, {
                    "count": 76,
                    "display_name": "CTree1 : C3",
                    "value": "1707840 6271898 6272670"
                  }, {
                    "count": 68,
                    "display_name": "ClassificationType : classificationSubType2",
                    "value": "1707840 8750617 8750177"
                  }, {
                    "count": 46,
                    "display_name": "Classifications : CTree1",
                    "value": "1707840 6271898"
                  }, {
                    "count": 43,
                    "display_name": "Classifications : Hyd-Classifications",
                    "value": "1707840 9442390"
                  }, {
                    "count": 41,
                    "display_name": "RMClassification_testing_children : RM3",
                    "value": "1707840 13815265 13815925"
                  }, {
                    "count": 39,
                    "display_name": "Classifications : test RM classification",
                    "value": "1707840 12605817"
                  }, {
                    "count": 25,
                    "display_name": "Hyd-Classifications : ~!@#$%^&*()_+|}{\u0022?><,.\/;\u0027[]\\==-` &lt; &gt; &nbsp; &amp; <SCRIPT> var pos=document.URL.indexOf(\u0022name=\u0022)+5; document.write(document.URL.substring(pos,document.URL.length)); <\/SCRIPT><script>alert(\u0022Hahaha\u0022);<\/script>",
                    "value": "1707840 9442390 9442391"
                  }, {
                    "count": 24,
                    "display_name": "RM Classifications : Finance",
                    "value": "1707840 17863744 17863745"
                  }, {
                    "count": 12,
                    "display_name": "test RM classification : 1",
                    "value": "1707840 12605817 13289777"
                  }],
                  "name": "OTClassificationTree",
                  "type": "Text"
                }, {
                  "count": 110,
                  "count_exceeded": false,
                  "display_name": "Container",
                  "facet_items": [{
                    "count": 895,
                    "display_name": "Enterprise Workspace : 200 Documents",
                    "value": "1275805"
                  }, {
                    "count": 401,
                    "display_name": "Enterprise Workspace : Performance",
                    "value": "191152"
                  }, {
                    "count": 289,
                    "display_name": "Perspectives",
                    "value": "388851"
                  }, {
                    "count": 245,
                    "display_name": "000000Test HTML tile creation12 : Wiki container",
                    "value": "11359205"
                  }, {
                    "count": 185,
                    "display_name": "Comments for - 00000_55715 (3675682)",
                    "value": "132097"
                  }, {
                    "count": 166,
                    "display_name": "Enterprise Workspace : 007 Hyderabad",
                    "value": "604999"
                  }, {
                    "count": 150,
                    "display_name": "Perspective Assets",
                    "value": "11019211"
                  }, {
                    "count": 150,
                    "display_name": "assets_15185970638447420062166032542 : HTMLWidgetContentWiki",
                    "value": "12231365"
                  }, {
                    "count": 147,
                    "display_name": "Admin\u0027s Home : Large Folder",
                    "value": "73279"
                  }, {
                    "count": 135,
                    "display_name": "Enterprise Workspace",
                    "value": "2000"
                  }, {
                    "count": 134,
                    "display_name": "Comments for - 00000_55715 (3675682) : profile-photos",
                    "value": "135406"
                  }, {
                    "count": 131,
                    "display_name": "A Cost Analysis : 12345",
                    "value": "293056"
                  }, {
                    "count": 127,
                    "display_name": "Enterprise Workspace : A Cost Analysis",
                    "value": "205659"
                  }, {
                    "count": 124,
                    "display_name": "Kristen Home : 12345",
                    "value": "567205"
                  }, {
                    "count": 120,
                    "display_name": "Enterprise Workspace : Thoms",
                    "value": "19835776"
                  }, {
                    "count": 110,
                    "display_name": "assets_15186032722549366004128151315 : HTMLWidgetContentWiki",
                    "value": "12234295"
                  }, {
                    "count": 106,
                    "display_name": "Admin\u0027s Home",
                    "value": "2003"
                  }, {
                    "count": 103,
                    "display_name": "00 Navya Test folder : Test nodestable widget options",
                    "value": "17879132"
                  }, {
                    "count": 101,
                    "display_name": "00 Navya Test folder : 100 folders",
                    "value": "8230344"
                  }, {
                    "count": 100,
                    "display_name": "Subfolder02 : SFolder_02",
                    "value": "12342928"
                  }],
                  "name": "OTParentID",
                  "type": "Text"
                }]
              },
              "result_title": "Search Results for: *"
            },
            "sorting": {
              "links": {
                "asc_OTObjectDate": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=asc_OTObjectDate",
                  "method": "GET",
                  "name": "Date (Ascending)"
                },
                "asc_OTObjectSize": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=asc_OTObjectSize",
                  "method": "GET",
                  "name": "Size (Ascending)"
                },
                "desc_OTObjectDate": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=desc_OTObjectDate",
                  "method": "GET",
                  "name": "Date (Descending)"
                },
                "desc_OTObjectSize": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=desc_OTObjectSize",
                  "method": "GET",
                  "name": "Size (Descending)"
                },
                "relevance": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794",
                  "method": "GET",
                  "name": "Relevance"
                }
              }
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [{
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/19785506\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 5,
                "create_date": "2018-11-07T20:34:42",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "Attempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 ).\nAttempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 ).",
                "description_multilingual": {
                  "en": "Attempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 ).\nAttempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 )."
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 19785506,
                "mime_type": null,
                "modify_date": "2018-12-10T17:40:33",
                "modify_user_id": 1000,
                "name": "bala test 0001",
                "name_multilingual": {
                  "en": "bala test 0001"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 11445223,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 5,
                "size_formatted": "5 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/11445223",
                "name": "000 Bala"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/11445223\/nodes",
                "name": "000 Bala"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/11445223",
                "name": "000 Bala"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/11445223\/nodes",
                "name": "000 Bala"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=19785506&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11123387\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 24,
                "create_date": "2017-08-02T00:15:15",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "gnhkjgk\nkjhjj\ngjhghj\nhjkh",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "gnhkjgk\nkjhjj\ngjhghj\nhjkh"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 11123387,
                "mime_type": null,
                "modify_date": "2018-12-09T22:52:36",
                "modify_user_id": 1000,
                "name": "234-12",
                "name_multilingual": {
                  "de_DE": "Empty",
                  "en": "234-12"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 10879731,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 24,
                "size_formatted": "24 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=11123387&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/6774268\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-04-19T23:45:39",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "mfkhgk",
                "description_multilingual": {
                  "en": "mfkhgk"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 14091915,
                "mime_type": null,
                "modify_date": "2018-12-05T20:28:00",
                "modify_user_id": 1000,
                "name": "shortcut to Ravi folder 111222",
                "name_multilingual": {
                  "en": "shortcut to Ravi folder 111222"
                },
                "original_id": 6774268,
                "original_id_expand": {
                  "container": true,
                  "container_size": 33,
                  "create_date": "2017-08-06T22:21:40",
                  "create_user_id": 1000,
                  "description": "dfdfdfdfdf",
                  "description_multilingual": {
                    "de_DE": "sds dsds dsd",
                    "en": "dfdfdfdfdf",
                    "ja": ""
                  },
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": false,
                  "id": 6774268,
                  "mime_type": null,
                  "modify_date": "2018-12-03T18:22:06",
                  "modify_user_id": 1000,
                  "name": "006 Bhaskar Bonthala",
                  "name_multilingual": {
                    "de_DE": "006 Bhaskar Bonthala",
                    "en": "006 Bhaskar Bonthala",
                    "ja": "006 Bhaskar Bonthala"
                  },
                  "owner": "istrator, Admin",
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "parent_id": 604999,
                  "permissions_model": "advanced",
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_shared_collaboration": false,
                  "reserved_user_id": 0,
                  "size": 33,
                  "size_formatted": "33 Items",
                  "type": 0,
                  "type_name": "Folder",
                  "versions_control_advanced": true,
                  "volume_id": -2000,
                  "wnd_att_7bgpv_5": null,
                  "wnd_comments": null
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 10879731,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": null,
                "size_formatted": "",
                "summary": [""],
                "type": 1,
                "type_name": "Shortcut",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=14091915&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "download": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/13962996\/content?download",
                  "method": "GET",
                  "name": "Download"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/13962996\/content",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open", "download"]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-04-17T10:03:45",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "a",
                "description_multilingual": {
                  "en": "a"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 13962996,
                "mime_type": "image\/gif",
                "modify_date": "2018-12-05T20:28:01",
                "modify_user_id": 1000,
                "name": "2018-03-19_New Labels.gif_renme",
                "name_multilingual": {
                  "en": "2018-03-19_New Labels.gif_renme"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 12729103,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 13364,
                "size_formatted": "14 KB",
                "summary": [""],
                "type": 144,
                "type_name": "Document",
                "versions_control_advanced": true,
                "volume_id": -2000
              },
              "versions": {
                "create_date": "2018-04-17T10:03:45",
                "description": null,
                "file_create_date": "2018-04-17T10:03:45",
                "file_modify_date": "2018-04-17T10:03:45",
                "file_name": "2018-03-19_New Labels.gif",
                "file_size": 13364,
                "file_type": "gif",
                "id": 13962996,
                "locked": false,
                "locked_date": null,
                "locked_user_id": null,
                "mime_type": "image\/gif",
                "modify_date": "2018-04-17T10:03:45",
                "name": "2018-03-19_New Labels.gif",
                "owner_id": 1000,
                "provider_id": 13962996,
                "version_id": 13962996,
                "version_number": 1,
                "version_number_major": 0,
                "version_number_minor": 1,
                "version_number_name": "1"
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/749454",
                "name": "00_Aihua\u0027s Folder"
              }, {
                "href": "api\/v1\/nodes\/12729103",
                "name": "000_subfolder"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/749454\/nodes",
                "name": "00_Aihua\u0027s Folder"
              }, {
                "href": "api\/v1\/nodes\/12729103\/nodes",
                "name": "000_subfolder"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/12729103",
                "name": "000_subfolder"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/12729103\/nodes",
                "name": "000_subfolder"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=13962996&Version=1",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {},
              "map": {
                "default_action": ""
              },
              "order": []
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-03-12T01:34:43",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "DSD",
                "description_multilingual": {
                  "en": "DSD"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 18890205,
                "mime_type": null,
                "modify_date": "2018-10-16T19:43:30",
                "modify_user_id": 1000,
                "name": "Req_TKL_MV",
                "name_multilingual": {
                  "en": "Req_TKL_MV"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 616849,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 673,
                "size_formatted": "",
                "summary": [""],
                "type": 131,
                "type_name": "Category",
                "versions_control_advanced": true,
                "volume_id": -2004
              },
              "versions": {
                "create_date": "2018-03-12T01:35:46",
                "description": null,
                "file_create_date": null,
                "file_modify_date": null,
                "file_name": "Req_TKL_MV",
                "file_size": 673,
                "file_type": null,
                "id": 18890205,
                "locked": false,
                "locked_date": null,
                "locked_user_id": null,
                "mime_type": null,
                "modify_date": "2018-03-12T01:35:46",
                "name": "Req_TKL_MV",
                "owner_id": 1000,
                "provider_id": 12863085,
                "version_id": 18890206,
                "version_number": 1,
                "version_number_major": 0,
                "version_number_minor": 1,
                "version_number_name": "1"
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2004",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849",
                "name": "000 Hyderabad"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2004\/nodes",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849\/nodes",
                "name": "000 Hyderabad"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/616849",
                "name": "000 Hyderabad"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/616849\/nodes",
                "name": "000 Hyderabad"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=18890205&Version=1",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {},
              "map": {
                "default_action": ""
              },
              "order": []
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-03-12T01:34:43",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "DSD",
                "description_multilingual": {
                  "en": "DSD",
                  "ja": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 12863085,
                "mime_type": null,
                "modify_date": "2018-10-08T20:29:22",
                "modify_user_id": 1000,
                "name": "Req_TKL_MV",
                "name_multilingual": {
                  "en": "",
                  "ja": "Req_TKL_MV"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 7247375,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 673,
                "size_formatted": "",
                "summary": [""],
                "type": 131,
                "type_name": "Category",
                "versions_control_advanced": true,
                "volume_id": -2004
              },
              "versions": {
                "create_date": "2018-03-12T01:35:46",
                "description": null,
                "file_create_date": null,
                "file_modify_date": null,
                "file_name": "Req_TKL_MV",
                "file_size": 673,
                "file_type": null,
                "id": 12863085,
                "locked": false,
                "locked_date": null,
                "locked_user_id": null,
                "mime_type": null,
                "modify_date": "2018-03-12T01:35:46",
                "name": "Req_TKL_MV",
                "owner_id": 1000,
                "provider_id": 12863085,
                "version_id": 12863085,
                "version_number": 1,
                "version_number_major": 0,
                "version_number_minor": 1,
                "version_number_name": "1"
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2004",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849",
                "name": "000 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/7247375",
                "name": "00 MultiValueAttributes"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2004\/nodes",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849\/nodes",
                "name": "000 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/7247375\/nodes",
                "name": "00 MultiValueAttributes"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/7247375",
                "name": "00 MultiValueAttributes"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/7247375\/nodes",
                "name": "00 MultiValueAttributes"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=12863085&Version=1",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/7459895\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 0,
                "create_date": "2017-08-29T07:57:27",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "uk",
                "description_multilingual": {
                  "de_DE": "uk"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 7459895,
                "mime_type": null,
                "modify_date": "2018-12-05T20:41:11",
                "modify_user_id": 1000,
                "name": "f12",
                "name_multilingual": {
                  "de_DE": "f12"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 526340,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 0,
                "size_formatted": "0 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2003
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              }, {
                "href": "api\/v1\/nodes\/526340",
                "name": "aFolder"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }, {
                "href": "api\/v1\/nodes\/526340\/nodes",
                "name": "aFolder"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/526340",
                "name": "aFolder"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/526340\/nodes",
                "name": "aFolder"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=7459895&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1501259\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 14,
                "create_date": "2016-07-28T10:18:01",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "1st 2nd 4th\nlinehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "1st 2nd 4th\nlinehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 1501259,
                "mime_type": null,
                "modify_date": "2018-12-05T20:37:39",
                "modify_user_id": 1000,
                "name": "00 Navya test folder2",
                "name_multilingual": {
                  "de_DE": "Navya\u0027s folder",
                  "en": "00 Navya test folder2"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2003,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 14,
                "size_formatted": "14 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2003
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=1501259&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1389036\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 2,
                "create_date": "2016-07-19T15:44:48",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "eded",
                "description_multilingual": {
                  "de_DE": "eded",
                  "en": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 1389036,
                "mime_type": null,
                "modify_date": "2018-12-05T20:37:39",
                "modify_user_id": 1000,
                "name": "Dropdown test",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "Dropdown test"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2003,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 2,
                "size_formatted": "2 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2003
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=1389036&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11848235\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": ""
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 14,
                "create_date": "2018-02-01T01:11:06",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 11848235,
                "mime_type": null,
                "modify_date": "2018-12-09T20:36:28",
                "modify_user_id": 1000,
                "name": "Collect-Test",
                "name_multilingual": {
                  "en": "Collect-Test"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 10879731,
                "permissions_model": "simple",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 14,
                "size_formatted": "14 Items",
                "summary": [""],
                "type": 298,
                "type_name": "Collection",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=11848235&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }]
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/volumes/141",
        responseText: {
          "addable_types": [
            {
              "icon": "/alphasupport/webdoc/folder.gif",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "icon": "/alphasupport/tinyali.gif",
              "type": 1,
              "type_name": "Shortcut"
            },
            {
              "icon": "/alphasupport/tinygen.gif",
              "type": 2,
              "type_name": "Generation"
            },
            {
              "icon": "/alphasupport/webattribute/16category.gif",
              "type": 131,
              "type_name": "Category"
            },
            {
              "icon": "/alphasupport/webdoc/cd.gif",
              "type": 136,
              "type_name": "Compound Document"
            },
            {
              "icon": "/alphasupport/webdoc/url.gif",
              "type": 140,
              "type_name": "URL"
            },
            {
              "icon": "/alphasupport/webdoc/doc.gif",
              "type": 144,
              "type_name": "Document"
            },
            {
              "icon": "/alphasupport/project/16project.gif",
              "type": 202,
              "type_name": "Project"
            },
            {
              "icon": "/alphasupport/task/16tasklist.gif",
              "type": 204,
              "type_name": "Task List"
            },
            {
              "icon": "/alphasupport/channel/16channel.gif",
              "type": 207,
              "type_name": "Channel"
            },
            {
              "icon": "/alphasupport/collections/collection.gif",
              "type": 298,
              "type_name": "Collection"
            },
            {
              "icon": "/alphasupport/physicalobjects/media_type.gif",
              "type": 410,
              "type_name": "Physical Item Type"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 411,
              "type_name": "Physical Item"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 412,
              "type_name": "Physical Item Container"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 424,
              "type_name": "Physical Item Box"
            },
            {
              "icon": "/alphasupport/recman/rims_disposition.gif",
              "type": 555,
              "type_name": "Disposition Search"
            },
            {
              "icon": "/alphasupport/otemail/emailcontainer.gif",
              "type": 557,
              "type_name": "Compound Email"
            },
            {
              "icon": "/alphasupport/otemail/email.gif",
              "type": 749,
              "type_name": "Email"
            },
            {
              "icon": "/alphasupport/otemail/emailfolder.gif",
              "type": 751,
              "type_name": "Email Folder"
            },
            {
              "icon": "/alphasupport/otsapxecm/otsapwksp_workspace_b8.png",
              "type": 848,
              "type_name": "Business Workspace"
            },
            {
              "icon": "/alphasupport/webdoc/virtual_folder.png",
              "type": 899,
              "type_name": "Virtual Folder"
            },
            {
              "icon": "/alphasupport/supportasset/support_asset_document.png",
              "type": 1307,
              "type_name": "Support Asset"
            },
            {
              "icon": "/alphasupport/wiki/wiki.gif",
              "type": 5573,
              "type_name": "Wiki"
            },
            {
              "icon": "/alphasupport/webreports/webreports.gif",
              "type": 30303,
              "type_name": "WebReport"
            },
            {
              "icon": "/alphasupport/activeview/activeview.gif",
              "type": 30309,
              "type_name": "ActiveView"
            },
            {
              "icon": "/alphasupport/cmbase/folder.gif",
              "type": 31109,
              "type_name": "Hierarchical Storage Folder"
            },
            {
              "icon": "/alphasupport/forums/forum.gif",
              "type": 123469,
              "type_name": "Forums"
            },
            {
              "icon": "/alphasupport/spdcommittee/16committee.gif",
              "type": 3030202,
              "type_name": "Community"
            }
          ],
          "available_actions": [
            {
              "parameterless": false,
              "read_only": true,
              "type": "browse",
              "type_name": "Browse",
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
          "available_roles": [
            {
              "type": "permissions",
              "type_name": "Permissions"
            },
            {
              "type": "audit",
              "type_name": "Audit"
            },
            {
              "type": "categories",
              "type_name": "Categories"
            },
            {
              "type": "doctemplates",
              "type_name": "Create Instance From Template"
            },
            {
              "type": "followups",
              "type_name": "Reminder"
            },
            {
              "type": "nicknames",
              "type_name": "Nicknames"
            },
            {
              "type": "systemattributes",
              "type_name": "System Attributes"
            }
          ],
          "data": {
            "advanced_versioning": null,
            "container": true,
            "container_size": 7,
            "create_date": "2003-10-01T13:30:55",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {
              "de_DE": "",
              "en": "",
              "en_IN": "",
              "ja": "",
              "ko_KR": ""
            },
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": true,
            "guid": null,
            "icon": "/alphasupport/webdoc/icon_library.gif",
            "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
            "id": 2000,
            "modify_date": "2019-06-02T20:22:32",
            "modify_user_id": 1000,
            "name": "Enterprise Workspace",
            "name_multilingual": {
              "de_DE": "Enterprise",
              "en": "Enterprise Workspace",
              "en_IN": "",
              "ja": "",
              "ko_KR": ""
            },
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 141,
            "type_name": "Enterprise Workspace",
            "versionable": false,
            "versions_control_advanced": false,
            "volume_id": -2000
          },
          "definitions": {
            "advanced_versioning": {
              "allow_undefined": true,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "advanced_versioning",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Advanced Versioning",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "container": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "container",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": true,
              "multilingual": true,
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
            "external_create_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_create_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Create Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_identity": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity",
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
            "external_identity_type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity_type",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity Type",
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
            "external_modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_modify_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Modify Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_source": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_source",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Source",
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
            "favorite": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "favorite",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Favorite",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": true,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
            "versionable": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "versionable",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Versionable",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "versions_control_advanced": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": false,
              "description": null,
              "hidden": false,
              "key": "versions_control_advanced",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
            }
          },
          "definitions_base": [
            "advanced_versioning",
            "container",
            "container_size",
            "create_date",
            "create_user_id",
            "description",
            "external_create_date",
            "external_identity",
            "external_identity_type",
            "external_modify_date",
            "external_source",
            "favorite",
            "guid",
            "icon",
            "icon_large",
            "id",
            "modify_date",
            "modify_user_id",
            "name",
            "owner_group_id",
            "owner_user_id",
            "parent_id",
            "reserved",
            "reserved_date",
            "reserved_user_id",
            "type",
            "type_name",
            "versionable",
            "versions_control_advanced",
            "volume_id"
          ],
          "definitions_order": [
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
            "versionable",
            "advanced_versioning",
            "versions_control_advanced",
            "container",
            "container_size",
            "favorite",
            "external_create_date",
            "external_modify_date",
            "external_source",
            "external_identity",
            "external_identity_type"
          ],
          "type": 141,
          "type_info": {
            "advanced_versioning": false,
            "container": true
          },
          "type_name": "Enterprise Workspace"
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/volumes/142",
        responseText: {
          "addable_types": [
            {
              "icon": "/alphasupport/webdoc/folder.gif",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "icon": "/alphasupport/tinyali.gif",
              "type": 1,
              "type_name": "Shortcut"
            },
            {
              "icon": "/alphasupport/tinygen.gif",
              "type": 2,
              "type_name": "Generation"
            },
            {
              "icon": "/alphasupport/webattribute/16category.gif",
              "type": 131,
              "type_name": "Category"
            },
            {
              "icon": "/alphasupport/webdoc/cd.gif",
              "type": 136,
              "type_name": "Compound Document"
            },
            {
              "icon": "/alphasupport/webdoc/url.gif",
              "type": 140,
              "type_name": "URL"
            },
            {
              "icon": "/alphasupport/webdoc/doc.gif",
              "type": 144,
              "type_name": "Document"
            },
            {
              "icon": "/alphasupport/project/16project.gif",
              "type": 202,
              "type_name": "Project"
            },
            {
              "icon": "/alphasupport/task/16tasklist.gif",
              "type": 204,
              "type_name": "Task List"
            },
            {
              "icon": "/alphasupport/channel/16channel.gif",
              "type": 207,
              "type_name": "Channel"
            },
            {
              "icon": "/alphasupport/collections/collection.gif",
              "type": 298,
              "type_name": "Collection"
            },
            {
              "icon": "/alphasupport/physicalobjects/media_type.gif",
              "type": 410,
              "type_name": "Physical Item Type"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 411,
              "type_name": "Physical Item"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 412,
              "type_name": "Physical Item Container"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 424,
              "type_name": "Physical Item Box"
            },
            {
              "icon": "/alphasupport/recman/rims_disposition.gif",
              "type": 555,
              "type_name": "Disposition Search"
            },
            {
              "icon": "/alphasupport/otemail/emailcontainer.gif",
              "type": 557,
              "type_name": "Compound Email"
            },
            {
              "icon": "/alphasupport/otemail/email.gif",
              "type": 749,
              "type_name": "Email"
            },
            {
              "icon": "/alphasupport/otemail/emailfolder.gif",
              "type": 751,
              "type_name": "Email Folder"
            },
            {
              "icon": "/alphasupport/otsapxecm/otsapwksp_workspace_b8.png",
              "type": 848,
              "type_name": "Business Workspace"
            },
            {
              "icon": "/alphasupport/webdoc/virtual_folder.png",
              "type": 899,
              "type_name": "Virtual Folder"
            },
            {
              "icon": "/alphasupport/supportasset/support_asset_document.png",
              "type": 1307,
              "type_name": "Support Asset"
            },
            {
              "icon": "/alphasupport/wiki/wiki.gif",
              "type": 5573,
              "type_name": "Wiki"
            },
            {
              "icon": "/alphasupport/webreports/webreports.gif",
              "type": 30303,
              "type_name": "WebReport"
            },
            {
              "icon": "/alphasupport/activeview/activeview.gif",
              "type": 30309,
              "type_name": "ActiveView"
            },
            {
              "icon": "/alphasupport/cmbase/folder.gif",
              "type": 31109,
              "type_name": "Hierarchical Storage Folder"
            },
            {
              "icon": "/alphasupport/forums/forum.gif",
              "type": 123469,
              "type_name": "Forums"
            },
            {
              "icon": "/alphasupport/spdcommittee/16committee.gif",
              "type": 3030202,
              "type_name": "Community"
            }
          ],
          "available_actions": [
            {
              "parameterless": false,
              "read_only": true,
              "type": "browse",
              "type_name": "Browse",
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
          "available_roles": [
            {
              "type": "permissions",
              "type_name": "Permissions"
            },
            {
              "type": "audit",
              "type_name": "Audit"
            },
            {
              "type": "categories",
              "type_name": "Categories"
            },
            {
              "type": "doctemplates",
              "type_name": "Create Instance From Template"
            },
            {
              "type": "followups",
              "type_name": "Reminder"
            },
            {
              "type": "nicknames",
              "type_name": "Nicknames"
            },
            {
              "type": "systemattributes",
              "type_name": "System Attributes"
            }
          ],
          "data": {
            "advanced_versioning": null,
            "container": true,
            "container_size": 9,
            "create_date": "2003-10-01T13:30:55",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {
              "de_DE": "",
              "en": "",
              "en_IN": "",
              "ja": "",
              "ko_KR": ""
            },
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": true,
            "guid": null,
            "icon": "/alphasupport/webdoc/icon_mystuff.gif",
            "icon_large": "/alphasupport/webdoc/icon_mystuff_large.gif",
            "id": 2003,
            "modify_date": "2019-06-03T22:16:25",
            "modify_user_id": 1000,
            "name": "Admin's Home",
            "name_multilingual": {
              "de_DE": "Germany",
              "en": "Admin's Home",
              "en_IN": "",
              "ja": "",
              "ko_KR": ""
            },
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 142,
            "type_name": "My Workspace",
            "versionable": false,
            "versions_control_advanced": false,
            "volume_id": -2003
          },
          "definitions": {
            "advanced_versioning": {
              "allow_undefined": true,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "advanced_versioning",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Advanced Versioning",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "container": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "container",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": true,
              "multilingual": true,
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
            "external_create_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_create_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Create Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_identity": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity",
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
            "external_identity_type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity_type",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity Type",
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
            "external_modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_modify_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Modify Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_source": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_source",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Source",
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
            "favorite": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "favorite",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Favorite",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": true,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
            "versionable": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "versionable",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Versionable",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "versions_control_advanced": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": false,
              "description": null,
              "hidden": false,
              "key": "versions_control_advanced",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
            }
          },
          "definitions_base": [
            "advanced_versioning",
            "container",
            "container_size",
            "create_date",
            "create_user_id",
            "description",
            "external_create_date",
            "external_identity",
            "external_identity_type",
            "external_modify_date",
            "external_source",
            "favorite",
            "guid",
            "icon",
            "icon_large",
            "id",
            "modify_date",
            "modify_user_id",
            "name",
            "owner_group_id",
            "owner_user_id",
            "parent_id",
            "reserved",
            "reserved_date",
            "reserved_user_id",
            "type",
            "type_name",
            "versionable",
            "versions_control_advanced",
            "volume_id"
          ],
          "definitions_order": [
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
            "versionable",
            "advanced_versioning",
            "versions_control_advanced",
            "container",
            "container_size",
            "favorite",
            "external_create_date",
            "external_modify_date",
            "external_source",
            "external_identity",
            "external_identity_type"
          ],
          "type": 142,
          "type_info": {
            "advanced_versioning": false,
            "container": true
          },
          "type_name": "My Workspace"
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members/targets?fields=properties&fields=versions.element(0)&expand=properties%7Boriginal_id%7D&orderBy=asc_type&actions=",
        responseText: {
          "collection": {
            "paging": {
              "limit": 10,
              "links": {
                "next": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=2&where=*&cache_id=2002384794",
                  "method": "GET",
                  "name": "Next"
                }
              },
              "page": 1,
              "page_total": 1939,
              "range_max": 10,
              "range_min": 1,
              "result_header_string": "Results 1 to 10 of 19380 sorted by Relevance",
              "total_count": 19380
            },
            "searching": {
              "cache_id": 2002384794,
              "facets": {
                "available": [{
                  "count": 55,
                  "count_exceeded": false,
                  "display_name": "Creation Date",
                  "facet_items": [{
                    "count": 199,
                    "display_name": "Last 3 days",
                    "value": "lz3d"
                  }, {
                    "count": 376,
                    "display_name": "Last 2 weeks",
                    "value": "ly2w"
                  }, {
                    "count": 1849,
                    "display_name": "Last 2 months",
                    "value": "lx2m"
                  }, {
                    "count": 4984,
                    "display_name": "Last 6 months",
                    "value": "lw6m"
                  }, {
                    "count": 11899,
                    "display_name": "Last 12 months",
                    "value": "lv1y"
                  }, {
                    "count": 16792,
                    "display_name": "Last 3 years",
                    "value": "lu3y"
                  }, {
                    "count": 19092,
                    "display_name": "Last 5 years",
                    "value": "lt5y"
                  }, {
                    "count": 288,
                    "display_name": "Older",
                    "value": "ls5o"
                  }],
                  "name": "OTCreateDate",
                  "type": "Date"
                }, {
                  "count": 110,
                  "count_exceeded": false,
                  "display_name": "Content Type",
                  "facet_items": [{
                    "count": 11339,
                    "display_name": "Document",
                    "value": "144"
                  }, {
                    "count": 2991,
                    "display_name": "Folder",
                    "value": "0"
                  }, {
                    "count": 1163,
                    "display_name": "Wiki Page",
                    "value": "5574"
                  }, {
                    "count": 743,
                    "display_name": "MicroPost",
                    "value": "1281"
                  }, {
                    "count": 470,
                    "display_name": "Category",
                    "value": "131"
                  }, {
                    "count": 323,
                    "display_name": "ActiveView",
                    "value": "30309"
                  }, {
                    "count": 300,
                    "display_name": "Shortcut",
                    "value": "1"
                  }, {
                    "count": 263,
                    "display_name": "Wiki",
                    "value": "5573"
                  }, {
                    "count": 205,
                    "display_name": "URL",
                    "value": "140"
                  }, {
                    "count": 164,
                    "display_name": "Forum Topics & Replies",
                    "value": "123470"
                  }, {
                    "count": 150,
                    "display_name": "Asset Folder",
                    "value": "955"
                  }, {
                    "count": 124,
                    "display_name": "Collection",
                    "value": "298"
                  }, {
                    "count": 109,
                    "display_name": "Task List",
                    "value": "204"
                  }, {
                    "count": 75,
                    "display_name": "Business Workspace",
                    "value": "848"
                  }, {
                    "count": 70,
                    "display_name": "LiveReport",
                    "value": "299"
                  }, {
                    "count": 55,
                    "display_name": "RM Classification",
                    "value": "551"
                  }, {
                    "count": 54,
                    "display_name": "Email Folder",
                    "value": "751"
                  }, {
                    "count": 51,
                    "display_name": "Workflow Map",
                    "value": "128"
                  }, {
                    "count": 44,
                    "display_name": "Task",
                    "value": "206"
                  }, {
                    "count": 41,
                    "display_name": "Search Query",
                    "value": "258"
                  }],
                  "name": "OTSubType",
                  "type": "Text"
                }, {
                  "count": 56,
                  "count_exceeded": false,
                  "display_name": "File Type",
                  "facet_items": [{
                    "count": 3774,
                    "display_name": "Text",
                    "value": "Text"
                  }, {
                    "count": 3737,
                    "display_name": "Picture",
                    "value": "Picture"
                  }, {
                    "count": 3140,
                    "display_name": "Folder",
                    "value": "Folder"
                  }, {
                    "count": 2786,
                    "display_name": "Photo",
                    "value": "Photo"
                  }, {
                    "count": 1613,
                    "display_name": "Microsoft Word",
                    "value": "Microsoft Word"
                  }, {
                    "count": 1366,
                    "display_name": "Adobe PDF",
                    "value": "Adobe PDF"
                  }, {
                    "count": 1263,
                    "display_name": "UNKNOWN",
                    "value": "UNKNOWN"
                  }, {
                    "count": 1021,
                    "display_name": "Microsoft Excel",
                    "value": "Microsoft Excel"
                  }, {
                    "count": 743,
                    "display_name": "Blog",
                    "value": "Blog"
                  }, {
                    "count": 501,
                    "display_name": "Classification",
                    "value": "Classification"
                  }, {
                    "count": 318,
                    "display_name": "ActiveView",
                    "value": "ActiveView"
                  }, {
                    "count": 309,
                    "display_name": "Graphics",
                    "value": "Graphics"
                  }, {
                    "count": 296,
                    "display_name": "Microsoft PowerPoint",
                    "value": "Microsoft PowerPoint"
                  }, {
                    "count": 262,
                    "display_name": "Web Page",
                    "value": "Web Page"
                  }, {
                    "count": 161,
                    "display_name": "Task",
                    "value": "Task"
                  }, {
                    "count": 99,
                    "display_name": "JPEG",
                    "value": "JPEG"
                  }, {
                    "count": 94,
                    "display_name": "Software Report",
                    "value": "Software Report"
                  }, {
                    "count": 93,
                    "display_name": "Compressed Archive",
                    "value": "Compressed Archive"
                  }, {
                    "count": 66,
                    "display_name": "Workflow",
                    "value": "Workflow"
                  }, {
                    "count": 64,
                    "display_name": "Video ",
                    "value": "Video"
                  }],
                  "name": "OTFileType",
                  "type": "Text"
                }, {
                  "count": 39,
                  "count_exceeded": false,
                  "display_name": "Classification",
                  "facet_items": [{
                    "count": 1534,
                    "display_name": "MyClassification : Class1",
                    "value": "1707840 2067849 2067850"
                  }, {
                    "count": 1407,
                    "display_name": "MyClassification : Class 2",
                    "value": "1707840 2067849 2120757"
                  }, {
                    "count": 963,
                    "display_name": "Hyd-Classifications : Class1",
                    "value": "1707840 9442390 15741379"
                  }, {
                    "count": 646,
                    "display_name": "Classifications : Rm33",
                    "value": "1707840 15741269"
                  }, {
                    "count": 577,
                    "display_name": "Classifications : CWS classification tree",
                    "value": "1707840 18121785"
                  }, {
                    "count": 349,
                    "display_name": "CTree1 : C2",
                    "value": "1707840 6271898 6272669"
                  }, {
                    "count": 206,
                    "display_name": "RMClassification_testing_children : RM1",
                    "value": "1707840 13815265 13815485"
                  }, {
                    "count": 188,
                    "display_name": "CTree1 : C1",
                    "value": "1707840 6271898 6272668"
                  }, {
                    "count": 76,
                    "display_name": "CTree1 : C3",
                    "value": "1707840 6271898 6272670"
                  }, {
                    "count": 68,
                    "display_name": "ClassificationType : classificationSubType2",
                    "value": "1707840 8750617 8750177"
                  }, {
                    "count": 46,
                    "display_name": "Classifications : CTree1",
                    "value": "1707840 6271898"
                  }, {
                    "count": 43,
                    "display_name": "Classifications : Hyd-Classifications",
                    "value": "1707840 9442390"
                  }, {
                    "count": 41,
                    "display_name": "RMClassification_testing_children : RM3",
                    "value": "1707840 13815265 13815925"
                  }, {
                    "count": 39,
                    "display_name": "Classifications : test RM classification",
                    "value": "1707840 12605817"
                  }, {
                    "count": 25,
                    "display_name": "Hyd-Classifications : ~!@#$%^&*()_+|}{\u0022?><,.\/;\u0027[]\\==-` &lt; &gt; &nbsp; &amp; <SCRIPT> var pos=document.URL.indexOf(\u0022name=\u0022)+5; document.write(document.URL.substring(pos,document.URL.length)); <\/SCRIPT><script>alert(\u0022Hahaha\u0022);<\/script>",
                    "value": "1707840 9442390 9442391"
                  }, {
                    "count": 24,
                    "display_name": "RM Classifications : Finance",
                    "value": "1707840 17863744 17863745"
                  }, {
                    "count": 12,
                    "display_name": "test RM classification : 1",
                    "value": "1707840 12605817 13289777"
                  }],
                  "name": "OTClassificationTree",
                  "type": "Text"
                }, {
                  "count": 110,
                  "count_exceeded": false,
                  "display_name": "Container",
                  "facet_items": [{
                    "count": 895,
                    "display_name": "Enterprise Workspace : 200 Documents",
                    "value": "1275805"
                  }, {
                    "count": 401,
                    "display_name": "Enterprise Workspace : Performance",
                    "value": "191152"
                  }, {
                    "count": 289,
                    "display_name": "Perspectives",
                    "value": "388851"
                  }, {
                    "count": 245,
                    "display_name": "000000Test HTML tile creation12 : Wiki container",
                    "value": "11359205"
                  }, {
                    "count": 185,
                    "display_name": "Comments for - 00000_55715 (3675682)",
                    "value": "132097"
                  }, {
                    "count": 166,
                    "display_name": "Enterprise Workspace : 007 Hyderabad",
                    "value": "604999"
                  }, {
                    "count": 150,
                    "display_name": "Perspective Assets",
                    "value": "11019211"
                  }, {
                    "count": 150,
                    "display_name": "assets_15185970638447420062166032542 : HTMLWidgetContentWiki",
                    "value": "12231365"
                  }, {
                    "count": 147,
                    "display_name": "Admin\u0027s Home : Large Folder",
                    "value": "73279"
                  }, {
                    "count": 135,
                    "display_name": "Enterprise Workspace",
                    "value": "2000"
                  }, {
                    "count": 134,
                    "display_name": "Comments for - 00000_55715 (3675682) : profile-photos",
                    "value": "135406"
                  }, {
                    "count": 131,
                    "display_name": "A Cost Analysis : 12345",
                    "value": "293056"
                  }, {
                    "count": 127,
                    "display_name": "Enterprise Workspace : A Cost Analysis",
                    "value": "205659"
                  }, {
                    "count": 124,
                    "display_name": "Kristen Home : 12345",
                    "value": "567205"
                  }, {
                    "count": 120,
                    "display_name": "Enterprise Workspace : Thoms",
                    "value": "19835776"
                  }, {
                    "count": 110,
                    "display_name": "assets_15186032722549366004128151315 : HTMLWidgetContentWiki",
                    "value": "12234295"
                  }, {
                    "count": 106,
                    "display_name": "Admin\u0027s Home",
                    "value": "2003"
                  }, {
                    "count": 103,
                    "display_name": "00 Navya Test folder : Test nodestable widget options",
                    "value": "17879132"
                  }, {
                    "count": 101,
                    "display_name": "00 Navya Test folder : 100 folders",
                    "value": "8230344"
                  }, {
                    "count": 100,
                    "display_name": "Subfolder02 : SFolder_02",
                    "value": "12342928"
                  }],
                  "name": "OTParentID",
                  "type": "Text"
                }]
              },
              "result_title": "Search Results for: *"
            },
            "sorting": {
              "links": {
                "asc_OTObjectDate": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=asc_OTObjectDate",
                  "method": "GET",
                  "name": "Date (Ascending)"
                },
                "asc_OTObjectSize": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=asc_OTObjectSize",
                  "method": "GET",
                  "name": "Size (Ascending)"
                },
                "desc_OTObjectDate": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=desc_OTObjectDate",
                  "method": "GET",
                  "name": "Date (Descending)"
                },
                "desc_OTObjectSize": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794&sort=desc_OTObjectSize",
                  "method": "GET",
                  "name": "Size (Descending)"
                },
                "relevance": {
                  "body": "",
                  "content_type": "",
                  "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794",
                  "method": "GET",
                  "name": "Relevance"
                }
              }
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/search?actions=open&actions=download&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&where=*&cache_id=2002384794",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [{
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/19785506\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 5,
                "create_date": "2018-11-07T20:34:42",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "Attempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 ).\nAttempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 ).",
                "description_multilingual": {
                  "en": "Attempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 ).\nAttempting to set focus to a hidden element causes an error in Internet Explorer. Take care to only use .trigger( \u0022focus\u0022 ) on elements that are visible. To run an element\u0027s focus event handlers without setting focus to the element, use .triggerHandler( \u0022focus\u0022 ) instead of .trigger( \u0022focus\u0022 )."
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 19785506,
                "mime_type": null,
                "modify_date": "2018-12-10T17:40:33",
                "modify_user_id": 1000,
                "name": "bala test 0001",
                "name_multilingual": {
                  "en": "bala test 0001"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 11445223,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 5,
                "size_formatted": "5 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/11445223",
                "name": "000 Bala"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/11445223\/nodes",
                "name": "000 Bala"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/11445223",
                "name": "000 Bala"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/11445223\/nodes",
                "name": "000 Bala"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=19785506&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11123387\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 24,
                "create_date": "2017-08-02T00:15:15",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "gnhkjgk\nkjhjj\ngjhghj\nhjkh",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "gnhkjgk\nkjhjj\ngjhghj\nhjkh"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 11123387,
                "mime_type": null,
                "modify_date": "2018-12-09T22:52:36",
                "modify_user_id": 1000,
                "name": "234-12",
                "name_multilingual": {
                  "de_DE": "Empty",
                  "en": "234-12"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 10879731,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 24,
                "size_formatted": "24 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=11123387&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/6774268\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-04-19T23:45:39",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "mfkhgk",
                "description_multilingual": {
                  "en": "mfkhgk"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 14091915,
                "mime_type": null,
                "modify_date": "2018-12-05T20:28:00",
                "modify_user_id": 1000,
                "name": "shortcut to Ravi folder 111222",
                "name_multilingual": {
                  "en": "shortcut to Ravi folder 111222"
                },
                "original_id": 6774268,
                "original_id_expand": {
                  "container": true,
                  "container_size": 33,
                  "create_date": "2017-08-06T22:21:40",
                  "create_user_id": 1000,
                  "description": "dfdfdfdfdf",
                  "description_multilingual": {
                    "de_DE": "sds dsds dsd",
                    "en": "dfdfdfdfdf",
                    "ja": ""
                  },
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": false,
                  "id": 6774268,
                  "mime_type": null,
                  "modify_date": "2018-12-03T18:22:06",
                  "modify_user_id": 1000,
                  "name": "006 Bhaskar Bonthala",
                  "name_multilingual": {
                    "de_DE": "006 Bhaskar Bonthala",
                    "en": "006 Bhaskar Bonthala",
                    "ja": "006 Bhaskar Bonthala"
                  },
                  "owner": "istrator, Admin",
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "parent_id": 604999,
                  "permissions_model": "advanced",
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_shared_collaboration": false,
                  "reserved_user_id": 0,
                  "size": 33,
                  "size_formatted": "33 Items",
                  "type": 0,
                  "type_name": "Folder",
                  "versions_control_advanced": true,
                  "volume_id": -2000,
                  "wnd_att_7bgpv_5": null,
                  "wnd_comments": null
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 10879731,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": null,
                "size_formatted": "",
                "summary": [""],
                "type": 1,
                "type_name": "Shortcut",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=14091915&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "download": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/13962996\/content?download",
                  "method": "GET",
                  "name": "Download"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/13962996\/content",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open", "download"]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-04-17T10:03:45",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "a",
                "description_multilingual": {
                  "en": "a"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 13962996,
                "mime_type": "image\/gif",
                "modify_date": "2018-12-05T20:28:01",
                "modify_user_id": 1000,
                "name": "2018-03-19_New Labels.gif_renme",
                "name_multilingual": {
                  "en": "2018-03-19_New Labels.gif_renme"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 12729103,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 13364,
                "size_formatted": "14 KB",
                "summary": [""],
                "type": 144,
                "type_name": "Document",
                "versions_control_advanced": true,
                "volume_id": -2000
              },
              "versions": {
                "create_date": "2018-04-17T10:03:45",
                "description": null,
                "file_create_date": "2018-04-17T10:03:45",
                "file_modify_date": "2018-04-17T10:03:45",
                "file_name": "2018-03-19_New Labels.gif",
                "file_size": 13364,
                "file_type": "gif",
                "id": 13962996,
                "locked": false,
                "locked_date": null,
                "locked_user_id": null,
                "mime_type": "image\/gif",
                "modify_date": "2018-04-17T10:03:45",
                "name": "2018-03-19_New Labels.gif",
                "owner_id": 1000,
                "provider_id": 13962996,
                "version_id": 13962996,
                "version_number": 1,
                "version_number_major": 0,
                "version_number_minor": 1,
                "version_number_name": "1"
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/749454",
                "name": "00_Aihua\u0027s Folder"
              }, {
                "href": "api\/v1\/nodes\/12729103",
                "name": "000_subfolder"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/749454\/nodes",
                "name": "00_Aihua\u0027s Folder"
              }, {
                "href": "api\/v1\/nodes\/12729103\/nodes",
                "name": "000_subfolder"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/12729103",
                "name": "000_subfolder"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/12729103\/nodes",
                "name": "000_subfolder"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=13962996&Version=1",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {},
              "map": {
                "default_action": ""
              },
              "order": []
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-03-12T01:34:43",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "DSD",
                "description_multilingual": {
                  "en": "DSD"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 18890205,
                "mime_type": null,
                "modify_date": "2018-10-16T19:43:30",
                "modify_user_id": 1000,
                "name": "Req_TKL_MV",
                "name_multilingual": {
                  "en": "Req_TKL_MV"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 616849,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 673,
                "size_formatted": "",
                "summary": [""],
                "type": 131,
                "type_name": "Category",
                "versions_control_advanced": true,
                "volume_id": -2004
              },
              "versions": {
                "create_date": "2018-03-12T01:35:46",
                "description": null,
                "file_create_date": null,
                "file_modify_date": null,
                "file_name": "Req_TKL_MV",
                "file_size": 673,
                "file_type": null,
                "id": 18890205,
                "locked": false,
                "locked_date": null,
                "locked_user_id": null,
                "mime_type": null,
                "modify_date": "2018-03-12T01:35:46",
                "name": "Req_TKL_MV",
                "owner_id": 1000,
                "provider_id": 12863085,
                "version_id": 18890206,
                "version_number": 1,
                "version_number_major": 0,
                "version_number_minor": 1,
                "version_number_name": "1"
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2004",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849",
                "name": "000 Hyderabad"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2004\/nodes",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849\/nodes",
                "name": "000 Hyderabad"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/616849",
                "name": "000 Hyderabad"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/616849\/nodes",
                "name": "000 Hyderabad"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=18890205&Version=1",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {},
              "map": {
                "default_action": ""
              },
              "order": []
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-03-12T01:34:43",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "DSD",
                "description_multilingual": {
                  "en": "DSD",
                  "ja": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 12863085,
                "mime_type": null,
                "modify_date": "2018-10-08T20:29:22",
                "modify_user_id": 1000,
                "name": "Req_TKL_MV",
                "name_multilingual": {
                  "en": "",
                  "ja": "Req_TKL_MV"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 7247375,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 673,
                "size_formatted": "",
                "summary": [""],
                "type": 131,
                "type_name": "Category",
                "versions_control_advanced": true,
                "volume_id": -2004
              },
              "versions": {
                "create_date": "2018-03-12T01:35:46",
                "description": null,
                "file_create_date": null,
                "file_modify_date": null,
                "file_name": "Req_TKL_MV",
                "file_size": 673,
                "file_type": null,
                "id": 12863085,
                "locked": false,
                "locked_date": null,
                "locked_user_id": null,
                "mime_type": null,
                "modify_date": "2018-03-12T01:35:46",
                "name": "Req_TKL_MV",
                "owner_id": 1000,
                "provider_id": 12863085,
                "version_id": 12863085,
                "version_number": 1,
                "version_number_major": 0,
                "version_number_minor": 1,
                "version_number_name": "1"
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2004",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849",
                "name": "000 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/7247375",
                "name": "00 MultiValueAttributes"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2004\/nodes",
                "name": "Categories Volume"
              }, {
                "href": "api\/v1\/nodes\/616849\/nodes",
                "name": "000 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/7247375\/nodes",
                "name": "00 MultiValueAttributes"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/7247375",
                "name": "00 MultiValueAttributes"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/7247375\/nodes",
                "name": "00 MultiValueAttributes"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=12863085&Version=1",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/7459895\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 0,
                "create_date": "2017-08-29T07:57:27",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "uk",
                "description_multilingual": {
                  "de_DE": "uk"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 7459895,
                "mime_type": null,
                "modify_date": "2018-12-05T20:41:11",
                "modify_user_id": 1000,
                "name": "f12",
                "name_multilingual": {
                  "de_DE": "f12"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 526340,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 0,
                "size_formatted": "0 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2003
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              }, {
                "href": "api\/v1\/nodes\/526340",
                "name": "aFolder"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }, {
                "href": "api\/v1\/nodes\/526340\/nodes",
                "name": "aFolder"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/526340",
                "name": "aFolder"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/526340\/nodes",
                "name": "aFolder"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=7459895&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1501259\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 14,
                "create_date": "2016-07-28T10:18:01",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "1st 2nd 4th\nlinehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "1st 2nd 4th\nlinehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/20031st linehttp:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003http:\/\/murdock.opentext.com\/alpha\/cs.exe\/app\/nodes\/2003"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 1501259,
                "mime_type": null,
                "modify_date": "2018-12-05T20:37:39",
                "modify_user_id": 1000,
                "name": "00 Navya test folder2",
                "name_multilingual": {
                  "de_DE": "Navya\u0027s folder",
                  "en": "00 Navya test folder2"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2003,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 14,
                "size_formatted": "14 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2003
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=1501259&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1389036\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 2,
                "create_date": "2016-07-19T15:44:48",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "eded",
                "description_multilingual": {
                  "de_DE": "eded",
                  "en": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 1389036,
                "mime_type": null,
                "modify_date": "2018-12-05T20:37:39",
                "modify_user_id": 1000,
                "name": "Dropdown test",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "Dropdown test"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2003,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 2,
                "size_formatted": "2 Items",
                "summary": [""],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2003
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/2003",
                "name": "Admin\u0027s Home"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/2003\/nodes",
                "name": "Admin\u0027s Home"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=1389036&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }, {
            "actions": {
              "data": {
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11848235\/nodes",
                  "method": "GET",
                  "name": "Open"
                }
              },
              "map": {
                "default_action": ""
              },
              "order": ["open"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 14,
                "create_date": "2018-02-01T01:11:06",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 11848235,
                "mime_type": null,
                "modify_date": "2018-12-09T20:36:28",
                "modify_user_id": 1000,
                "name": "Collect-Test",
                "name_multilingual": {
                  "en": "Collect-Test"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": "1900-10-31T00:00:00",
                  "business_email": "nkuchana@opentext.com",
                  "business_fax": "67352895",
                  "business_phone": "+78-5847684656500",
                  "cell_phone": "+49-987654321",
                  "deleted": false,
                  "first_name": "Admin",
                  "gender": null,
                  "group_id": 2426,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "initials": "A",
                  "last_name": "istrator",
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": "Hyderabad",
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": 0,
                  "photo_url": null,
                  "time_zone": 6,
                  "title": "Murdock Administrator ",
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 10879731,
                "permissions_model": "simple",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "short_summary": [""],
                "size": 14,
                "size_formatted": "14 Items",
                "summary": [""],
                "type": 298,
                "type_name": "Collection",
                "versions_control_advanced": true,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [{
                "href": "api\/v1\/nodes\/2000",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              }],
              "ancestors_nodes": [{
                "href": "api\/v1\/nodes\/2000\/nodes",
                "name": "Enterprise Workspace"
              }, {
                "href": "api\/v1\/nodes\/604999\/nodes",
                "name": "007 Hyderabad"
              }, {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }],
              "parent": {
                "href": "api\/v1\/nodes\/10879731",
                "name": "000 yamini"
              },
              "parent_nodes": {
                "href": "api\/v1\/nodes\/10879731\/nodes",
                "name": "000 yamini"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=11848235&Version=0",
              "result_type": "264",
              "source_id": "20945700",
              "version_type": null
            }
          }]
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/6774268?fields=properties",
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/6774268?fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "container": true,
                "container_size": 33,
                "create_date": "2017-08-06T22:21:40",
                "create_user_id": 1000,
                "description": "dfdfdfdfdf",
                "description_multilingual": {
                  "de_DE": "sds dsds dsd",
                  "en": "dfdfdfdfdf",
                  "ja": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 6774268,
                "mime_type": null,
                "modify_date": "2018-12-03T18:22:06",
                "modify_user_id": 1000,
                "name": "006 Bhaskar Bonthala",
                "name_multilingual": {
                  "de_DE": "006 Bhaskar Bonthala",
                  "en": "006 Bhaskar Bonthala",
                  "ja": "006 Bhaskar Bonthala"
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 604999,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 33,
                "size_formatted": "33 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": true,
                "volume_id": -2000,
                "wnd_att_7bgpv_5": null,
                "wnd_comments": null
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/11848235?fields=properties",
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/11848235?fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "container": true,
                "container_size": 14,
                "create_date": "2018-02-01T01:11:06",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "ja": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 11848235,
                "mime_type": null,
                "modify_date": "2018-12-10T22:42:01",
                "modify_user_id": 1000,
                "name": "Collect-Test",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "Collect-Test",
                  "ja": ""
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 10879731,
                "permissions_model": "simple",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 14,
                "size_formatted": "14 Items",
                "type": 298,
                "type_name": "Collection",
                "versions_control_advanced": true,
                "volume_id": -2000,
                "wnd_att_1d5mb_2": null,
                "wnd_comments": null
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/nodes/11848235/nodes?extra=false&actions=false&expand=node&commands=addcategory&commands=addversion&commands=default&commands=open&commands=browse&commands=copy&commands=delete&commands=download&commands=ZipAndDownload&commands=edit&commands=editactivex&commands=editofficeonline&commands=editwebdav&commands=favorite&commands=nonfavorite&commands=rename&commands=move&commands=permissions&commands=favorite_rename&commands=reserve&commands=unreserve&commands=description&commands=thumbnail&commands=savefilter&commands=editpermissions&commands=collectionCanCollect&commands=removefromcollection&limit=30&page=1&sort=asc_type",
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/16087849?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=ZipAndDownload&actions=edit&actions=editactivex&actions=editofficeonline&actions=rename&actions=move&actions=permissions&actions=properties&actions=reserve&actions=unreserve&actions=collectioncancollect&actions=removefromcollection&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&expand=properties{original_id}&fields=columns&fields=properties&fields=versions{mime_type,owner_id}.element(0)&metadata",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "collectionCanCollect": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "GET",
                  "name": "Collection can collect"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=16087849",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=16087849",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=16087849",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {
                "default_action": "",
                "more": ["properties"]
              },
              "order": ["open", "collectionCanCollect", "addcategory", "rename", "copy", "move",
                "permissions", "delete"]
            },
            "data": {
              "columns": [{
                "data_type": 906,
                "key": "type",
                "name": "Type",
                "sort_key": "x61031"
              }, {
                "data_type": 906,
                "key": "name",
                "name": "Name",
                "sort_key": "x61028"
              }, {
                "data_type": 906,
                "key": "size_formatted",
                "name": "Size",
                "sort_key": "x61029"
              }, {
                "data_type": 906,
                "key": "modify_date",
                "name": "Modified",
                "sort_key": "x61027"
              }, {
                "data_type": 2,
                "key": "wnd_comments",
                "name": "Comments"
              }],
              "properties": {
                "container": true,
                "container_size": 0,
                "create_date": "2018-07-18T19:38:25",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "ja": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 16087849,
                "mime_type": null,
                "modify_date": "2018-12-03T18:22:19",
                "modify_user_id": 1000,
                "name": "collection",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "collection",
                  "ja": ""
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 11445223,
                "permissions_model": "simple",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 0,
                "size_formatted": "0 Items",
                "type": 298,
                "type_name": "Collection",
                "versions_control_advanced": true,
                "volume_id": -2000,
                "wnd_comments": null
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": true,
                  "multilingual": true,
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
                "external_create_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "external_create_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "External Create Date",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_identity": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_identity",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Identity",
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
                "external_identity_type": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_identity_type",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Identity Type",
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
                "external_modify_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "external_modify_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "External Modify Date",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_source": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_source",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Source",
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
                "favorite": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "favorite",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Favorite",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": true,
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
                "owner": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "owner",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "Owner",
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
                "owner_group_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "owner_group_id",
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                }
              }
            },
            "metadata_map": {},
            "metadata_order": {
              "properties": ["id", "type", "type_name", "name", "description", "parent_id",
                "volume_id", "create_date", "create_user_id", "modify_date", "modify_user_id",
                "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id",
                "versions_control_advanced", "container", "container_size", "favorite",
                "external_create_date", "external_modify_date", "external_source",
                "external_identity", "external_identity_type", "owner"]
            },
            "perspective": {
              "canEditPerspective": true,
              "options": {
                "rows": [{
                  "columns": [{
                    "heights": {
                      "xs": "full"
                    },
                    "sizes": {
                      "md": 12
                    },
                    "widget": {
                      "options": {},
                      "type": "nodestable"
                    }
                  }]
                }]
              },
              "type": "grid"
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/nodes/11848235/nodes?extra=false&actions=false&expand=node&commands=addcategory&commands=addversion&commands=default&commands=open&commands=browse&commands=copy&commands=delete&commands=download&commands=ZipAndDownload&commands=edit&commands=editactivex&commands=editofficeonline&commands=editwebdav&commands=favorite&commands=nonfavorite&commands=rename&commands=move&commands=permissions&commands=properties&commands=favorite_rename&commands=reserve&commands=unreserve&commands=description&commands=thumbnail&commands=savefilter&commands=editpermissions&commands=collectionCanCollect&commands=removefromcollection&limit=30&page=1&sort=asc_type",
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/16087849?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=ZipAndDownload&actions=edit&actions=editactivex&actions=editofficeonline&actions=rename&actions=move&actions=permissions&actions=properties&actions=reserve&actions=unreserve&actions=collectioncancollect&actions=removefromcollection&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&expand=properties{original_id}&fields=columns&fields=properties&fields=versions{mime_type,owner_id}.element(0)&metadata",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "collectionCanCollect": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "GET",
                  "name": "Collection can collect"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=16087849",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=16087849",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=16087849",
                  "href": "\/api\/v2\/nodes\/16087849",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {
                "default_action": "",
                "more": ["properties"]
              },
              "order": ["open", "collectionCanCollect", "addcategory", "rename", "copy", "move",
                "permissions", "delete"]
            },
            "data": {
              "columns": [{
                "data_type": 906,
                "key": "type",
                "name": "Type",
                "sort_key": "x61031"
              }, {
                "data_type": 906,
                "key": "name",
                "name": "Name",
                "sort_key": "x61028"
              }, {
                "data_type": 906,
                "key": "size_formatted",
                "name": "Size",
                "sort_key": "x61029"
              }, {
                "data_type": 906,
                "key": "modify_date",
                "name": "Modified",
                "sort_key": "x61027"
              }, {
                "data_type": 2,
                "key": "wnd_comments",
                "name": "Comments"
              }],
              "properties": {
                "container": true,
                "container_size": 0,
                "create_date": "2018-07-18T19:38:25",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "ja": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 16087849,
                "mime_type": null,
                "modify_date": "2018-12-03T18:22:19",
                "modify_user_id": 1000,
                "name": "collection",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "collection",
                  "ja": ""
                },
                "owner": "istrator, Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 11445223,
                "permissions_model": "simple",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 0,
                "size_formatted": "0 Items",
                "type": 298,
                "type_name": "Collection",
                "versions_control_advanced": true,
                "volume_id": -2000,
                "wnd_comments": null
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": true,
                  "multilingual": true,
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
                "external_create_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "external_create_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "External Create Date",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_identity": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_identity",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Identity",
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
                "external_identity_type": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_identity_type",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Identity Type",
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
                "external_modify_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "external_modify_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "External Modify Date",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_source": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_source",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Source",
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
                "favorite": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "favorite",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Favorite",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": true,
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
                "owner": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "owner",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "Owner",
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
                "owner_group_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "owner_group_id",
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
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
                  "key_value_pairs": false,
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
                  "key_value_pairs": false,
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
                }
              }
            },
            "metadata_map": {},
            "metadata_order": {
              "properties": ["id", "type", "type_name", "name", "description", "parent_id",
                "volume_id", "create_date", "create_user_id", "modify_date", "modify_user_id",
                "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id",
                "versions_control_advanced", "container", "container_size", "favorite",
                "external_create_date", "external_modify_date", "external_source",
                "external_identity", "external_identity_type", "owner"]
            },
            "perspective": {
              "canEditPerspective": true,
              "options": {
                "rows": [{
                  "columns": [{
                    "heights": {
                      "xs": "full"
                    },
                    "sizes": {
                      "md": 12
                    },
                    "widget": {
                      "options": {},
                      "type": "nodestable"
                    }
                  }]
                }]
              },
              "type": "grid"
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/nodes/11848235/ancestors",
        responseText: {
          "ancestors": [{
            "name": "Enterprise Workspace",
            "volume_id": -2000,
            "parent_id": -1,
            "type": 141,
            "id": 2000,
            "type_name": "Enterprise Workspace"
          },
            {
              "name": "007 Hyderabad",
              "volume_id": -2000,
              "parent_id": 2000,
              "type": 0,
              "id": 604999,
              "type_name": "Folder"
            },
            {
              "name": "000 yamini",
              "volume_id": -2000,
              "parent_id": 604999,
              "type": 0,
              "id": 10879731,
              "type_name": "Folder"
            },
            {
              "name": "Collect-Test",
              "volume_id": -2000,
              "parent_id": 10879731,
              "type": 298,
              "id": 11848235,
              "type_name": "Collection"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/1389036?fields=properties',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/1389036?fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 2,
                "create_date": "2016-07-19T15:44:48",
                "create_user_id": 1000,
                "description": "OpenText Corporation (also written opentext) is a Canadian company that develops and sells enterprise information management (EIM) software.[2]\n\nOpenText, headquartered in Waterloo, Ontario, Canada,[3] is Canada's largest software company as of 2014[4] and recognized as one of Canada's top 100 employers 2016 by Mediacorp Canada Inc.[5]\n\nOpenText software applications manage content or unstructured data for large companies, government agencies, and professional service firms.[citation needed] OpenText aims its products at addressing information management requirements, including management of large volumes of content, compliance with regulatory requirements, and mobile and online experience management.[citation needed]\n\nOpenText employs over 10,000 people worldwide[6] and is a publicly traded company, listed on the NASDAQ (OTEX) and the Toronto Stock Exchange (OTEX).",
                "description_multilingual": {
                  "de_DE": "eded",
                  "en": "OpenText Corporation (also written opentext) is a Canadian company that develops and sells enterprise information management (EIM) software.[2]\n\nOpenText, headquartered in Waterloo, Ontario, Canada,[3] is Canada's largest software company as of 2014[4] and recognized as one of Canada's top 100 employers 2016 by Mediacorp Canada Inc.[5]\n\nOpenText software applications manage content or unstructured data for large companies, government agencies, and professional service firms.[citation needed] OpenText aims its products at addressing information management requirements, including management of large volumes of content, compliance with regulatory requirements, and mobile and online experience management.[citation needed]\n\nOpenText employs over 10,000 people worldwide[6] and is a publicly traded company, listed on the NASDAQ (OTEX) and the Toronto Stock Exchange (OTEX).",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 1389036,
                "mime_type": null,
                "modify_date": "2019-04-29T00:27:39",
                "modify_user_id": 1000,
                "name": "Dropdown test",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "Dropdown test",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 24910829,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 2,
                "size_formatted": "2 Items",
                "type": 0,
                "type_name": "Folder",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2003
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1389036/nodes?extra=false&actions=false&expand=node&commands=addcategory&commands=addversion&commands=default&commands=open&commands=browse&commands=copy&commands=delete&commands=download&commands=ZipAndDownload&commands=edit&commands=editactivex&commands=editofficeonline&commands=editwebdav&commands=favorite&commands=nonfavorite&commands=rename&commands=move&commands=permissions&commands=properties&commands=favorite_rename&commands=reserve&commands=unreserve&commands=description&commands=thumbnail&commands=savefilter&commands=editpermissions&commands=collectionCanCollect&commands=removefromcollection&limit=30&page=1&sort=asc_type',
        responseText: {
          "data": [
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 8,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_mystuff.gif",
                "icon_large": "/alphasupport/webdoc/icon_mystuff_large.gif",
                "id": 2003,
                "modify_date": "2019-05-21T08:37:24",
                "modify_user_id": 1000,
                "name": "Admin's Home",
                "name_multilingual": {
                  "de_DE": "Germany",
                  "en": "Admin's Home",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 142,
                "type_name": "My Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2003
              },
              "id": 1389037,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 2,
                "create_date": "2016-07-19T15:44:48",
                "create_user_id": 1000,
                "description": "OpenText Corporation (also written opentext) is a Canadian company that develops and sells enterprise information management (EIM) software.[2]\n\nOpenText, headquartered in Waterloo, Ontario, Canada,[3] is Canada's largest software company as of 2014[4] and recognized as one of Canada's top 100 employers 2016 by Mediacorp Canada Inc.[5]\n\nOpenText software applications manage content or unstructured data for large companies, government agencies, and professional service firms.[citation needed] OpenText aims its products at addressing information management requirements, including management of large volumes of content, compliance with regulatory requirements, and mobile and online experience management.[citation needed]\n\nOpenText employs over 10,000 people worldwide[6] and is a publicly traded company, listed on the NASDAQ (OTEX) and the Toronto Stock Exchange (OTEX).",
                "description_multilingual": {
                  "de_DE": "eded",
                  "en": "OpenText Corporation (also written opentext) is a Canadian company that develops and sells enterprise information management (EIM) software.[2]\n\nOpenText, headquartered in Waterloo, Ontario, Canada,[3] is Canada's largest software company as of 2014[4] and recognized as one of Canada's top 100 employers 2016 by Mediacorp Canada Inc.[5]\n\nOpenText software applications manage content or unstructured data for large companies, government agencies, and professional service firms.[citation needed] OpenText aims its products at addressing information management requirements, including management of large volumes of content, compliance with regulatory requirements, and mobile and online experience management.[citation needed]\n\nOpenText employs over 10,000 people worldwide[6] and is a publicly traded company, listed on the NASDAQ (OTEX) and the Toronto Stock Exchange (OTEX).",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "guid": null,
                "icon": "/alphasupport/webdoc/folder.gif",
                "icon_large": "/alphasupport/webdoc/folder_large.gif",
                "id": 1389036,
                "modify_date": "2019-04-29T00:27:39",
                "modify_user_id": 1000,
                "name": "Dropdown test",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "Dropdown test",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 24910829,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 0,
                "type_name": "Folder",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2003
              },
              "user_id": 1000,
              "name": "dropdown_test",
              "type": 131,
              "description": null,
              "create_date": "2016-07-19T15:45:15",
              "create_user_id": 1000,
              "modify_date": "2016-07-19T16:02:08",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webattribute/16category.gif",
              "mime_type": null,
              "original_id": 0,
              "type_name": "Category",
              "container": false,
              "size": 3475,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2016-07-19T15:45:15",
              "wnd_modifiedby": 1000,
              "size_formatted": "",
              "reserved_user_login": null,
              "action_url": "/v1/actions/1389037",
              "parent_id_url": "/v1/nodes/1389036",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=1389037",
                  "method": "",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/1389037",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=1389037",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/1389037/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Categories"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=1389037",
                  "method": "",
                  "name": "General"
                },
                "properties_versions": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/1389037/versions",
                  "href_form": "",
                  "method": "GET",
                  "name": "Versions"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=1389037",
                  "method": "",
                  "name": "Rename"
                },
                "reserve": {
                  "body": "reserved_user_id=1000",
                  "content_type": "application/x-www-form-urlencoded",
                  "href": "api/v1/nodes/1389037",
                  "href_form": "",
                  "method": "PUT",
                  "name": "Reserve"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_versions"
                ]
              },
              "commands_order": [
                "rename",
                "copy",
                "move",
                "reserve",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 8,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_mystuff.gif",
                "icon_large": "/alphasupport/webdoc/icon_mystuff_large.gif",
                "id": 2003,
                "modify_date": "2019-05-21T08:37:24",
                "modify_user_id": 1000,
                "name": "Admin's Home",
                "name_multilingual": {
                  "de_DE": "Germany",
                  "en": "Admin's Home",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 142,
                "type_name": "My Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2003
              },
              "id": 1641165,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 2,
                "create_date": "2016-07-19T15:44:48",
                "create_user_id": 1000,
                "description": "OpenText Corporation (also written opentext) is a Canadian company that develops and sells enterprise information management (EIM) software.[2]\n\nOpenText, headquartered in Waterloo, Ontario, Canada,[3] is Canada's largest software company as of 2014[4] and recognized as one of Canada's top 100 employers 2016 by Mediacorp Canada Inc.[5]\n\nOpenText software applications manage content or unstructured data for large companies, government agencies, and professional service firms.[citation needed] OpenText aims its products at addressing information management requirements, including management of large volumes of content, compliance with regulatory requirements, and mobile and online experience management.[citation needed]\n\nOpenText employs over 10,000 people worldwide[6] and is a publicly traded company, listed on the NASDAQ (OTEX) and the Toronto Stock Exchange (OTEX).",
                "description_multilingual": {
                  "de_DE": "eded",
                  "en": "OpenText Corporation (also written opentext) is a Canadian company that develops and sells enterprise information management (EIM) software.[2]\n\nOpenText, headquartered in Waterloo, Ontario, Canada,[3] is Canada's largest software company as of 2014[4] and recognized as one of Canada's top 100 employers 2016 by Mediacorp Canada Inc.[5]\n\nOpenText software applications manage content or unstructured data for large companies, government agencies, and professional service firms.[citation needed] OpenText aims its products at addressing information management requirements, including management of large volumes of content, compliance with regulatory requirements, and mobile and online experience management.[citation needed]\n\nOpenText employs over 10,000 people worldwide[6] and is a publicly traded company, listed on the NASDAQ (OTEX) and the Toronto Stock Exchange (OTEX).",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "guid": null,
                "icon": "/alphasupport/webdoc/folder.gif",
                "icon_large": "/alphasupport/webdoc/folder_large.gif",
                "id": 1389036,
                "modify_date": "2019-04-29T00:27:39",
                "modify_user_id": 1000,
                "name": "Dropdown test",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "Dropdown test",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 24910829,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 0,
                "type_name": "Folder",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2003
              },
              "user_id": 1000,
              "name": "dropdown_test_2",
              "type": 131,
              "description": null,
              "create_date": "2016-08-11T11:14:55",
              "create_user_id": 1000,
              "modify_date": "2016-08-11T11:16:35",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webattribute/16category.gif",
              "mime_type": null,
              "original_id": 0,
              "type_name": "Category",
              "container": false,
              "size": 684,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2016-08-11T11:14:55",
              "wnd_modifiedby": 1000,
              "size_formatted": "",
              "reserved_user_login": null,
              "action_url": "/v1/actions/1641165",
              "parent_id_url": "/v1/nodes/1389036",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=1641165",
                  "method": "",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/1641165",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=1641165",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/1641165/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=1641165&category_id=1389037",
                  "method": "",
                  "name": "Categories"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=1641165",
                  "method": "",
                  "name": "General"
                },
                "properties_versions": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/1641165/versions",
                  "href_form": "",
                  "method": "GET",
                  "name": "Versions"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=1641165",
                  "method": "",
                  "name": "Rename"
                },
                "reserve": {
                  "body": "reserved_user_id=1000",
                  "content_type": "application/x-www-form-urlencoded",
                  "href": "api/v1/nodes/1641165",
                  "href_form": "",
                  "method": "PUT",
                  "name": "Reserve"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_versions"
                ]
              },
              "commands_order": [
                "rename",
                "copy",
                "move",
                "reserve",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "create_user_id": {
              "align": "left",
              "name": "Created By",
              "persona": "user",
              "type": 2,
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
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
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
            "modify_user_id": {
              "align": "center",
              "name": "Modified By",
              "persona": "user",
              "sort": true,
              "type": 2,
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
            "owner": {
              "align": "center",
              "name": "Owner",
              "sort": true,
              "type": 14,
              "width_weight": 1
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
            "reservedby": {
              "align": "center",
              "name": "Reserved By",
              "sort": true,
              "type": 14,
              "width_weight": 1
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
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date",
            "owner",
            "reservedby"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_type",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1389036/addablenodetypes',
        responseText: {
          "data": {
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]": "api/v1/forms/nodes/create?type=848&parent_id=1389036",
            "Collection": "api/v1/forms/nodes/create?type=298&parent_id=1389036",
            "compound_document": "api/v1/forms/nodes/create?type=136&parent_id=1389036",
            "document": "api/v1/forms/nodes/create?type=144&parent_id=1389036",
            "email_folder": "api/v1/forms/nodes/create?type=751&parent_id=1389036",
            "folder": "api/v1/forms/nodes/create?type=0&parent_id=1389036",
            "Forum": "api/v1/forms/nodes/create?type=123469&parent_id=1389036",
            "physical_item": "api/v1/forms/nodes/create?type=411&parent_id=1389036",
            "shortcut": "api/v1/forms/nodes/create?type=1&parent_id=1389036",
            "tasklist": "api/v1/forms/nodes/create?type=204&parent_id=1389036",
            "url": "api/v1/forms/nodes/create?type=140&parent_id=1389036",
            "Wiki": "api/v1/forms/nodes/create?type=5573&parent_id=1389036"
          },
          "definitions": {
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/otsapxecm/otsapwksp_workspace_b8.png",
              "method": "GET",
              "name": "Business Workspace",
              "parameters": {},
              "tab_href": "",
              "type": 848
            },
            "Collection": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/collections/collection.gif",
              "method": "GET",
              "name": "Collection",
              "parameters": {},
              "tab_href": "",
              "type": 298
            },
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            },
            "email_folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/otemail/emailfolder.gif",
              "method": "GET",
              "name": "Email Folder",
              "parameters": {},
              "tab_href": "",
              "type": 751
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "Forum": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/forums/forum.gif",
              "method": "GET",
              "name": "Forums",
              "parameters": {},
              "tab_href": "",
              "type": 123469
            },
            "physical_item": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/physicalobjects/physical_item.gif",
              "method": "GET",
              "name": "Physical Item",
              "parameters": {},
              "tab_href": "",
              "type": 411
            },
            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            },
            "tasklist": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/task/16tasklist.gif",
              "method": "GET",
              "name": "Task List",
              "parameters": {},
              "tab_href": "",
              "type": 204
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            },
            "Wiki": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/wiki/wiki.gif",
              "method": "GET",
              "name": "Wiki",
              "parameters": {},
              "tab_href": "",
              "type": 5573
            }
          },
          "definitions_map": {},
          "definitions_order": [
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]",
            "Collection",
            "compound_document",
            "document",
            "email_folder",
            "folder",
            "Forum",
            "physical_item",
            "shortcut",
            "tasklist",
            "url",
            "Wiki"
          ]
        }

      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1389036/ancestors',
        responseText: {
          "ancestors": [
            {
              "name": "Admin's Home",
              "volume_id": -2003,
              "parent_id": -1,
              "type": 142,
              "id": 2003,
              "type_name": "My Workspace"
            },
            {
              "name": "0 Content to be removed",
              "volume_id": -2003,
              "parent_id": 2003,
              "type": 0,
              "id": 24910829,
              "type_name": "Folder"
            },
            {
              "name": "Dropdown test",
              "volume_id": -2003,
              "parent_id": 24910829,
              "type": 0,
              "id": 1389036,
              "type_name": "Folder"
            }
          ]
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/ancestors',
        responseText: {
          "ancestors": [
            {
              "name": "Enterprise Workspace",
              "volume_id": -2000,
              "parent_id": -1,
              "type": 141,
              "id": 2000,
              "type_name": "Enterprise Workspace"
            }
          ]
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2000?fields=properties',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/2000?fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "id": 2000,
                "mime_type": null,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 7,
                "size_formatted": "7 Items",
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000,
                "wnd_comments": null
              }
            }
          }
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/nodes(?:\\?(.*))?$',
        responseText: {
          "data": [
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 69544,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Alberi - Demo Content",
              "type": 0,
              "description": "This is a short description",
              "create_date": "2015-03-09T10:49:00",
              "create_user_id": 1000,
              "modify_date": "2019-06-02T20:56:50",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": 1,
              "type_name": "Folder",
              "container": true,
              "size": 5,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": true,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2015-03-09T10:49:00",
              "wnd_modifiedby": 1000,
              "size_formatted": "5 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/69544",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=69544",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/69544/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/69544",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=69544",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/69544/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/69544/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=69544",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=69544",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=69544",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": "1"
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24838339,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Content to be removed",
              "type": 0,
              "description": null,
              "create_date": "2019-03-10T23:27:40",
              "create_user_id": 1000,
              "modify_date": "2019-06-03T22:57:04",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 55,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-10T23:27:40",
              "wnd_modifiedby": 1000,
              "size_formatted": "55 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24838339",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24838339",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24838339/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24838339",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24838339",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24838339/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24838339&category_id=511081",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24838339/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24838339",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24838339",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24838339",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24788095,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Development",
              "type": 0,
              "description": "test",
              "create_date": "2019-03-07T03:42:29",
              "create_user_id": 1000,
              "modify_date": "2019-06-03T23:31:25",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": 5,
              "type_name": "Folder",
              "container": true,
              "size": 14,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-07T03:42:29",
              "wnd_modifiedby": 1000,
              "size_formatted": "14 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24788095",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24788095",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788095/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788095",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24788095",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788095/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24788095&category_id=17525044",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788095/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24788095",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24788095",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24788095",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": "5"
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 526301,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 64039,
              "name": "Innovate Company Main",
              "type": 0,
              "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
              "create_date": "2016-03-07T10:49:01",
              "create_user_id": 64039,
              "modify_date": "2019-05-01T19:19:01",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 10,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 64039,
              "wnd_createdby": 64039,
              "wnd_createdate": "2016-03-07T10:49:01",
              "wnd_modifiedby": 1000,
              "size_formatted": "10 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/526301",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=526301",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/526301/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/526301",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=526301",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/526301/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=526301&category_id=520012",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/526301/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=526301",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=526301",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=526301",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 28121796,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Product Information",
              "type": 0,
              "description": null,
              "create_date": "2019-05-21T07:37:17",
              "create_user_id": 1000,
              "modify_date": "2019-05-21T07:38:10",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 4,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-05-21T07:37:17",
              "wnd_modifiedby": 1000,
              "size_formatted": "4 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/28121796",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=28121796",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/28121796/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/28121796",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=28121796",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/28121796/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=28121796&category_id=17525044",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/28121796/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=28121796",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=28121796",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=28121796",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24787987,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Product Management",
              "type": 0,
              "description": null,
              "create_date": "2019-03-07T03:46:04",
              "create_user_id": 1000,
              "modify_date": "2019-05-27T22:21:25",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 7,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-07T03:46:04",
              "wnd_modifiedby": 1000,
              "size_formatted": "7 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24787987",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24787987",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24787987/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24787987",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24787987",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24787987/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24787987&category_id=10483401",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24787987/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24787987",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24787987",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24787987",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24788645,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "User Experience",
              "type": 0,
              "description": null,
              "create_date": "2019-03-07T03:45:38",
              "create_user_id": 1000,
              "modify_date": "2019-05-29T00:12:37",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 16,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-07T03:45:38",
              "wnd_modifiedby": 1000,
              "size_formatted": "16 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24788645",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24788645",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788645/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788645",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24788645",
                  "method": "",
                  "name": "Move"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                },
                "properties_audit": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788645/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24788645&category_id=17525044",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788645/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24788645",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24788645",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24788645",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "create_user_id": {
              "align": "left",
              "name": "Created By",
              "persona": "user",
              "type": 2,
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
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
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
            "modify_user_id": {
              "align": "left",
              "name": "Modified By",
              "persona": "user",
              "type": 2,
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
            "owner": {
              "align": "center",
              "name": "Owner",
              "sort": true,
              "type": 14,
              "width_weight": 1
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
            "reservedby": {
              "align": "center",
              "name": "Reserved By",
              "sort": true,
              "type": 14,
              "width_weight": 1
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
            },
            "wnd_comments": {
              "align": "center",
              "name": "Comments",
              "sort": false,
              "type": 2,
              "width_weight": 1
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date",
            "owner",
            "wnd_comments",
            "reservedby"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 7,
          "range_min": 1,
          "sort": "asc_type",
          "total_count": 7,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/addablenodetypes',
        responseText: {
          "data": {
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]": "api/v1/forms/nodes/create?type=848&parent_id=2000",
            "Collection": "api/v1/forms/nodes/create?type=298&parent_id=2000",
            "compound_document": "api/v1/forms/nodes/create?type=136&parent_id=2000",
            "document": "api/v1/forms/nodes/create?type=144&parent_id=2000",
            "email_folder": "api/v1/forms/nodes/create?type=751&parent_id=2000",
            "folder": "api/v1/forms/nodes/create?type=0&parent_id=2000",
            "Forum": "api/v1/forms/nodes/create?type=123469&parent_id=2000",
            "physical_item": "api/v1/forms/nodes/create?type=411&parent_id=2000",
            "shortcut": "api/v1/forms/nodes/create?type=1&parent_id=2000",
            "tasklist": "api/v1/forms/nodes/create?type=204&parent_id=2000",
            "url": "api/v1/forms/nodes/create?type=140&parent_id=2000",
            "Wiki": "api/v1/forms/nodes/create?type=5573&parent_id=2000"
          },
          "definitions": {
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/otsapxecm/otsapwksp_workspace_b8.png",
              "method": "GET",
              "name": "Business Workspace",
              "parameters": {},
              "tab_href": "",
              "type": 848
            },
            "Collection": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/collections/collection.gif",
              "method": "GET",
              "name": "Collection",
              "parameters": {},
              "tab_href": "",
              "type": 298
            },
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            },
            "email_folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/otemail/emailfolder.gif",
              "method": "GET",
              "name": "Email Folder",
              "parameters": {},
              "tab_href": "",
              "type": 751
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "Forum": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/forums/forum.gif",
              "method": "GET",
              "name": "Forums",
              "parameters": {},
              "tab_href": "",
              "type": 123469
            },
            "physical_item": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/physicalobjects/physical_item.gif",
              "method": "GET",
              "name": "Physical Item",
              "parameters": {},
              "tab_href": "",
              "type": 411
            },
            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            },
            "tasklist": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/task/16tasklist.gif",
              "method": "GET",
              "name": "Task List",
              "parameters": {},
              "tab_href": "",
              "type": 204
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            },
            "Wiki": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/wiki/wiki.gif",
              "method": "GET",
              "name": "Wiki",
              "parameters": {},
              "tab_href": "",
              "type": 5573
            }
          },
          "definitions_map": {},
          "definitions_order": [
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]",
            "Collection",
            "compound_document",
            "document",
            "email_folder",
            "folder",
            "Forum",
            "physical_item",
            "shortcut",
            "tasklist",
            "url",
            "Wiki"
          ]
        }

      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/19785506",
        responseText: {}
      }));

      mocks.push(nodechildren2Mock.mockV2NodeChildren());
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});