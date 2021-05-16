/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
  [
    'csui/lib/jquery.mockjax',
    'conws/widgets/relatedworkspaces/test/relatedworkspaces.mock.manager'
  ],
  function (mockjax) {
    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/*/icons',
      type: 'DELETE',
      responseTime: 50,
      responseText: {
        "links": {
          "self": {
            "body": "",
            "content_type": "",
            "href": "/api/v2/businessworkspaces/*/icons",
            "method": "DELETE",
            "name": ""
          }
        },
        "results": {
          "icon_node_id": 19598,
          "msg": "Icon deleted successfully"
        }
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/*/icons',
      type: 'POST',
      responseTime: 50,
      responseText: {
        "links": {
          "self": {
            "body": "",
            "content_type": "",
            "href": "/api/v2/businessworkspaces/*/icons?file_filename=roller_support_stand.jpg&file_filelength=5455&file_content_type=image/jpeg&file_dcsMimeTypeStatus=failure&file=C:\\Windows\\TEMP\\otup77F09B2A479949EB95B4DE6E8769C42B0",
            "method": "POST",
            "name": ""
          }
        },
        "results": {
          "icon_node_id": 120362,
          "msg": "Widget icon uploaded successfully."
        }
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/forms/info?id=1',
      responseTime: 50,
      responseText: {
        "forms": [{
          "data": {
            "id": 1,
            "type": 848,
            "type_name": "Business Workspace",
            "name": "Sales Opportunity 1 filter",
            "description": "",
            "parent_id": 2000,
            "volume_id": -2000,
            "guid": null,
            "create_date": "2015-04-22T13:31:45",
            "create_user_id": "Admin",
            "modify_date": "2015-07-15T11:20:18",
            "modify_user_id": "Admin",
            "owner_user_id": "Admin",
            "owner_group_id": "DefaultGroup",
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": "<Unknown>",
            "icon": "\/alphasupport\/webdoc\/appword.gif",
            "icon_large": "\/alphasupport\/webdoc\/appword_large.gif",
            "versions_control_advanced": false,
            "container": false,
            "container_size": 0,
            "favorite": true
          },
          "options": {
            "fields": {
              "id": {
                "hidden": false,
                "label": "ID",
                "readonly": true,
                "type": "number"
              },
              "type": {
                "hidden": true,
                "label": "Type",
                "readonly": true,
                "type": "number"
              },
              "type_name": {
                "hidden": false,
                "label": "Type",
                "readonly": true,
                "type": "text"
              },
              "name": {
                "hidden": false,
                "label": "Name",
                "readonly": true,
                "type": "text"
              },
              "description": {
                "hidden": false,
                "label": "Description",
                "readonly": true,
                "type": "textarea"
              },
              "parent_id": {
                "hidden": false,
                "label": "Parent ID",
                "readonly": true,
                "type": "number"
              },
              "volume_id": {
                "hidden": false,
                "label": "VolumeID",
                "readonly": true,
                "type": "number"
              },
              "guid": {
                "hidden": false,
                "label": "GUID",
                "readonly": true
              },
              "create_date": {
                "hidden": false,
                "label": "Created",
                "readonly": true,
                "type": "datetime"
              },
              "create_user_id": {
                "hidden": false,
                "label": "Created By",
                "readonly": true,
                "type": "text"
              },
              "modify_date": {
                "hidden": false,
                "label": "Modified",
                "readonly": true,
                "type": "datetime"
              },
              "modify_user_id": {
                "hidden": false,
                "label": "Modified By",
                "readonly": true,
                "type": "text"
              },
              "owner_user_id": {
                "hidden": false,
                "label": "Owned By",
                "readonly": true,
                "type": "text"
              },
              "owner_group_id": {
                "hidden": false,
                "label": "Owned By",
                "readonly": true,
                "type": "text"
              },
              "reserved": {
                "hidden": false,
                "label": "Reserved",
                "readonly": true,
                "type": "checkbox"
              },
              "reserved_date": {
                "hidden": false,
                "label": "Reserved",
                "readonly": true,
                "type": "datetime"
              },
              "reserved_user_id": {
                "hidden": false,
                "label": "Reserved By",
                "readonly": true,
                "type": "text"
              },
              "icon": {
                "hidden": false,
                "label": "Icon",
                "readonly": true,
                "type": "text"
              },
              "icon_large": {
                "hidden": false,
                "label": "Large Icon",
                "readonly": true,
                "type": "text"
              },
              "versions_control_advanced": {
                "hidden": false,
                "label": "Versions Control Advanced",
                "readonly": true,
                "type": "checkbox"
              },
              "container": {
                "hidden": false,
                "label": "Container",
                "readonly": true,
                "type": "checkbox"
              },
              "container_size": {
                "hidden": false,
                "label": "Container Size",
                "readonly": true,
                "type": "number"
              },
              "favorite": {
                "hidden": false,
                "label": "Favorite",
                "readonly": true,
                "type": "checkbox"
              }
            }
          },
          "schema": {
            "properties": {
              "id": {
                "readonly": true,
                "required": false,
                "title": "ID",
                "type": "integer"
              },
              "type": {
                "readonly": true,
                "required": false,
                "title": "Type",
                "type": "integer"
              },
              "type_name": {
                "readonly": true,
                "required": false,
                "title": "Type",
                "type": "string"
              },
              "name": {
                "readonly": true,
                "required": false,
                "title": "Name",
                "type": "string"
              },
              "description": {
                "readonly": true,
                "required": false,
                "title": "Description",
                "type": "string"
              },
              "parent_id": {
                "readonly": true,
                "required": false,
                "title": "Parent ID",
                "type": "integer"
              },
              "volume_id": {
                "readonly": true,
                "required": false,
                "title": "VolumeID",
                "type": "integer"
              },
              "guid": {
                "readonly": true,
                "required": false,
                "title": "GUID"
              },
              "create_date": {
                "format": "datetime",
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
              "modify_date": {
                "format": "datetime",
                "readonly": true,
                "required": false,
                "title": "Modified",
                "type": "string"
              },
              "modify_user_id": {
                "readonly": true,
                "required": false,
                "title": "Modified By",
                "type": "string"
              },
              "owner_user_id": {
                "readonly": true,
                "required": false,
                "title": "Owned By",
                "type": "string"
              },
              "owner_group_id": {
                "readonly": true,
                "required": false,
                "title": "Owned By",
                "type": "string"
              },
              "reserved": {
                "readonly": true,
                "required": false,
                "title": "Reserved",
                "type": "boolean"
              },
              "reserved_date": {
                "format": "datetime",
                "readonly": true,
                "required": false,
                "title": "Reserved",
                "type": "string"
              },
              "reserved_user_id": {
                "readonly": true,
                "required": false,
                "title": "Reserved By",
                "type": "string"
              },
              "icon": {
                "readonly": true,
                "required": false,
                "title": "Icon",
                "type": "string"
              },
              "icon_large": {
                "readonly": true,
                "required": false,
                "title": "Large Icon",
                "type": "string"
              },
              "versions_control_advanced": {
                "readonly": true,
                "required": false,
                "title": "Versions Control Advanced",
                "type": "boolean"
              },
              "container": {
                "readonly": true,
                "required": false,
                "title": "Container",
                "type": "boolean"
              },
              "container_size": {
                "readonly": true,
                "required": false,
                "title": "Container Size",
                "type": "integer"
              },
              "favorite": {
                "readonly": true,
                "required": false,
                "title": "Favorite",
                "type": "boolean"
              }
            },
            "title": null,
            "type": "object"
          }
        },
          {
            "data": {
              "186356": {
                "186356_2": "2015-07-15T00:00:00"
              },
              "186455": {
                "186455_2": "TextValue",
                "186455_3": ["TextValue1",
                  "TextValue1",
                  "TextValue3",
                  "TextValue4"],
                "186455_5": ["TextValue1",
                  "TextValue2",
                  "TextValue3"],
                "186455_4": ["TextValue1",
                  "TextValue2",
                  "TextValue3"],
                "186455_6": "two",
                "186455_7": ["one",
                  "two"],
                "186455_8": ["one",
                  "two",
                  null],
                "186455_9": ["one",
                  "two",
                  "three"],
                "186455_10": "2015-07-16T00:00:00",
                "186455_11": ["2015-07-17T00:00:00",
                  "2015-07-18T00:00:00"],
                "186455_12": ["2015-07-19T00:00:00",
                  "2015-07-20T00:00:00",
                  "2015-07-21T00:00:00"],
                "186455_13": ["2015-07-22T00:00:00",
                  "2015-07-23T00:00:00",
                  null],
                "186455_14": {
                  "186455_14_1": {
                    "186455_14_1_15": "Set1.TextValue",
                    "186455_14_1_26": "2015-07-24T00:00:00"
                  }
                },
                "186455_17": {
                  "186455_17_1": {
                    "186455_17_1_18": "Set2.TextValue1",
                    "186455_17_1_19": "2015-07-25T00:00:00"
                  },
                  "186455_17_2": {
                    "186455_17_2_18": "Set2.TextValue2",
                    "186455_17_2_19": "2015-07-26T00:00:00"
                  }
                },
                "186455_20": {
                  "186455_20_1": {
                    "186455_20_1_21": "Set3.TextValue1",
                    "186455_20_1_22": "2015-07-27T00:00:00"
                  },
                  "186455_20_2": {
                    "186455_20_2_21": "Set3.TextValue2",
                    "186455_20_2_22": "2015-07-28T00:00:00"
                  },
                  "186455_20_3": {
                    "186455_20_3_21": null,
                    "186455_20_3_22": null
                  }
                },
                "186455_23": {
                  "186455_23_1": {
                    "186455_23_1_24": "Set4.TextValue1",
                    "186455_23_1_25": "2015-07-29T00:00:00"
                  },
                  "186455_23_2": {
                    "186455_23_2_24": "Set4.TextValue2",
                    "186455_23_2_25": "2015-07-30T00:00:00"
                  },
                  "186455_23_3": {
                    "186455_23_3_24": null,
                    "186455_23_3_25": null
                  }
                }
              },
              "187420": {
                "187420_2": "Lorem Ipsum",
                "187420_3": "HH",
                "187420_8": {
                  "187420_8_1": {
                    "187420_8_1_9": "O20.2",
                    "187420_8_1_10": "Roma"
                  }
                },
                "187420_4": "Programming",
                "187420_5": "Draft",
                "187420_11": {
                  "187420_11_1": {
                    "187420_11_1_12": "alpha",
                    "187420_11_1_13": "2015-07-30T00:00:00",
                    "187420_11_1_14": "Comment",
                    "187420_11_1_15": false
                  }
                },
                "187420_6": "Windmill Publishing",
                "187420_7": false
              }
            },
            "options": {
              "fields": {
                "186356": {
                  "fields": {
                    "186356_2": {
                      "hidden": false,
                      "label": "Description",
                      "readonly": true,
                      "type": "datetime"
                    }
                  }
                },
                "186455": {
                  "fields": {
                    "186455_2": {
                      "hidden": false,
                      "label": "Text, single row, locked",
                      "readonly": true,
                      "type": "text"
                    },
                    "186455_3": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "text"
                      },
                      "label": "Text, single row, max 5, unlocked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_5": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "text"
                      },
                      "label": "Text, 3 rows, locked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_4": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "text"
                      },
                      "label": "Text, 3 rows, max 5, unlocked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_6": {
                      "hidden": false,
                      "label": "Text Popup, single row, locked",
                      "readonly": true,
                      "type": "radio"
                    },
                    "186455_7": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "radio"
                      },
                      "label": "Text Popup, single row, max 5, unlocked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_8": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "radio"
                      },
                      "label": "Text Popup, 3 rows, locked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_9": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "radio"
                      },
                      "label": "Text Popup, 3 rows, 5 max, unlocked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_10": {
                      "hidden": false,
                      "label": "Date, single row, locked",
                      "readonly": true,
                      "type": "datetime"
                    },
                    "186455_11": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "datetime"
                      },
                      "label": "Date, single row, max5, unlocked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_12": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "datetime"
                      },
                      "label": "Date, 3 rows, locked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_13": {
                      "hidden": false,
                      "items": {
                        "showMoveDownItemButton": false,
                        "showMoveUpItemButton": false,
                        "type": "datetime"
                      },
                      "label": "Date, 3 rows, max5, unlocked",
                      "readonly": true,
                      "toolbarSticky": true,
                      "type": "array"
                    },
                    "186455_14": {
                      "fields": {
                        "186455_14_1": {
                          "fields": {
                            "186455_14_1_15": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_14_1_26": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, single row, locked [1]",
                          "type": "object"
                        }
                      },
                      "label": "Set, single row, locked",
                      "readonly": true,
                      "type": "object"
                    },
                    "186455_17": {
                      "fields": {
                        "186455_17_1": {
                          "fields": {
                            "186455_17_1_18": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_17_1_19": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, single row, max 5, unlocked [1]",
                          "type": "object"
                        },
                        "186455_17_2": {
                          "fields": {
                            "186455_17_2_18": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_17_2_19": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, single row, max 5, unlocked [2]",
                          "type": "object"
                        }
                      },
                      "label": "Set, single row, max 5, unlocked",
                      "readonly": true,
                      "type": "object"
                    },
                    "186455_20": {
                      "fields": {
                        "186455_20_1": {
                          "fields": {
                            "186455_20_1_21": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_20_1_22": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, 3 rows, locked [1]",
                          "type": "object"
                        },
                        "186455_20_2": {
                          "fields": {
                            "186455_20_2_21": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_20_2_22": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, 3 rows, locked [2]",
                          "type": "object"
                        },
                        "186455_20_3": {
                          "fields": {
                            "186455_20_3_21": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_20_3_22": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, 3 rows, locked [3]",
                          "type": "object"
                        }
                      },
                      "label": "Set, 3 rows, locked",
                      "readonly": true,
                      "type": "object"
                    },
                    "186455_23": {
                      "fields": {
                        "186455_23_1": {
                          "fields": {
                            "186455_23_1_24": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_23_1_25": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, 3 rows, max 5, unlocked [1]",
                          "type": "object"
                        },
                        "186455_23_2": {
                          "fields": {
                            "186455_23_2_24": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_23_2_25": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, 3 rows, max 5, unlocked [2]",
                          "type": "object"
                        },
                        "186455_23_3": {
                          "fields": {
                            "186455_23_3_24": {
                              "hidden": false,
                              "label": "Text",
                              "readonly": true,
                              "type": "text"
                            },
                            "186455_23_3_25": {
                              "hidden": false,
                              "label": "Date",
                              "readonly": true,
                              "type": "datetime"
                            }
                          },
                          "label": "Set, 3 rows, max 5, unlocked [3]",
                          "type": "object"
                        }
                      },
                      "label": "Set, 3 rows, max 5, unlocked",
                      "readonly": true,
                      "type": "object"
                    }
                  }
                },
                "187420": {
                  "fields": {
                    "187420_2": {
                      "hidden": false,
                      "label": "Title",
                      "readonly": true,
                      "type": "text"
                    },
                    "187420_3": {
                      "hidden": false,
                      "label": "Oranization",
                      "readonly": true,
                      "type": "text"
                    },
                    "187420_8": {
                      "fields": {
                        "187420_8_1": {
                          "fields": {
                            "187420_8_1_9": {
                              "hidden": false,
                              "label": "Building",
                              "readonly": true,
                              "type": "text"
                            },
                            "187420_8_1_10": {
                              "hidden": false,
                              "label": "Room",
                              "readonly": true,
                              "type": "text"
                            }
                          },
                          "label": "Storage Location [1]",
                          "type": "object"
                        }
                      },
                      "label": "Storage Location",
                      "readonly": true,
                      "type": "object"
                    },
                    "187420_4": {
                      "hidden": false,
                      "label": "Subject",
                      "readonly": true,
                      "type": "text"
                    },
                    "187420_5": {
                      "hidden": false,
                      "label": "Status",
                      "readonly": true,
                      "type": "select"
                    },
                    "187420_11": {
                      "fields": {
                        "187420_11_1": {
                          "fields": {
                            "187420_11_1_12": {
                              "hidden": false,
                              "label": "Reviewer",
                              "readonly": true,
                              "type": "text"
                            },
                            "187420_11_1_13": {
                              "hidden": false,
                              "label": "reviewed at",
                              "readonly": true,
                              "type": "datetime"
                            },
                            "187420_11_1_14": {
                              "hidden": false,
                              "label": "Comment",
                              "readonly": true,
                              "type": "text"
                            },
                            "187420_11_1_15": {
                              "hidden": false,
                              "label": "Major change",
                              "readonly": true,
                              "type": "checkbox"
                            }
                          },
                          "label": "Review History [1]",
                          "type": "object"
                        }
                      },
                      "label": "Review History",
                      "readonly": true,
                      "type": "object"
                    },
                    "187420_6": {
                      "hidden": false,
                      "label": "Publisher",
                      "readonly": true,
                      "type": "text"
                    },
                    "187420_7": {
                      "hidden": false,
                      "label": "Rights Management",
                      "readonly": true,
                      "type": "checkbox"
                    }
                  }
                }
              }
            },
            "schema": {
              "properties": {
                "186356": {
                  "description": null,
                  "properties": {
                    "186356_2": {
                      "format": "datetime",
                      "readonly": true,
                      "required": false,
                      "title": "Description",
                      "type": "string"
                    }
                  },
                  "title": "Anton",
                  "type": "object"
                },
                "186455": {
                  "description": null,
                  "properties": {
                    "186455_2": {
                      "maxLength": 32,
                      "readonly": true,
                      "required": false,
                      "title": "Text, single row, locked",
                      "type": "string"
                    },
                    "186455_3": {
                      "items": {
                        "maxItems": 5,
                        "maxLength": 32,
                        "minItems": 1,
                        "minLength": null,
                        "type": "string"
                      },
                      "maxLength": 32,
                      "readonly": true,
                      "required": false,
                      "title": "Text, single row, max 5, unlocked",
                      "type": "array"
                    },
                    "186455_5": {
                      "items": {
                        "maxItems": 3,
                        "maxLength": 32,
                        "minItems": 3,
                        "minLength": null,
                        "type": "string"
                      },
                      "maxLength": 32,
                      "readonly": true,
                      "required": false,
                      "title": "Text, 3 rows, locked",
                      "type": "array"
                    },
                    "186455_4": {
                      "items": {
                        "maxItems": 5,
                        "maxLength": 32,
                        "minItems": 1,
                        "minLength": null,
                        "type": "string"
                      },
                      "maxLength": 32,
                      "readonly": true,
                      "required": false,
                      "title": "Text, 3 rows, max 5, unlocked",
                      "type": "array"
                    },
                    "186455_6": {
                      "enum": ["one",
                        "two",
                        "three"],
                      "readonly": true,
                      "required": false,
                      "title": "Text Popup, single row, locked",
                      "type": "string"
                    },
                    "186455_7": {
                      "enum": ["one",
                        "two",
                        "three"],
                      "items": {
                        "maxItems": 5,
                        "maxLength": null,
                        "minItems": 1,
                        "minLength": null,
                        "type": "string"
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Text Popup, single row, max 5, unlocked",
                      "type": "array"
                    },
                    "186455_8": {
                      "enum": ["one",
                        "two",
                        "three"],
                      "items": {
                        "maxItems": 3,
                        "maxLength": null,
                        "minItems": 3,
                        "minLength": null,
                        "type": "string"
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Text Popup, 3 rows, locked",
                      "type": "array"
                    },
                    "186455_9": {
                      "enum": ["one",
                        "two",
                        "three"],
                      "items": {
                        "maxItems": 5,
                        "maxLength": null,
                        "minItems": 1,
                        "minLength": null,
                        "type": "string"
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Text Popup, 3 rows, 5 max, unlocked",
                      "type": "array"
                    },
                    "186455_10": {
                      "format": "datetime",
                      "readonly": true,
                      "required": false,
                      "title": "Date, single row, locked",
                      "type": "string"
                    },
                    "186455_11": {
                      "format": "datetime",
                      "items": {
                        "maxItems": 5,
                        "maxLength": null,
                        "minItems": 1,
                        "minLength": null,
                        "type": "string"
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Date, single row, max5, unlocked",
                      "type": "array"
                    },
                    "186455_12": {
                      "format": "datetime",
                      "items": {
                        "maxItems": 3,
                        "maxLength": null,
                        "minItems": 3,
                        "minLength": null,
                        "type": "string"
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Date, 3 rows, locked",
                      "type": "array"
                    },
                    "186455_13": {
                      "format": "datetime",
                      "items": {
                        "maxItems": 5,
                        "maxLength": null,
                        "minItems": 1,
                        "minLength": null,
                        "type": "string"
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Date, 3 rows, max5, unlocked",
                      "type": "array"
                    },
                    "186455_14": {
                      "properties": {
                        "186455_14_1": {
                          "properties": {
                            "186455_14_1_15": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_14_1_26": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, single row, locked [1]",
                          "type": "object"
                        }
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Set, single row, locked",
                      "type": "object"
                    },
                    "186455_17": {
                      "properties": {
                        "186455_17_1": {
                          "properties": {
                            "186455_17_1_18": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_17_1_19": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, single row, max 5, unlocked [1]",
                          "type": "object"
                        },
                        "186455_17_2": {
                          "properties": {
                            "186455_17_2_18": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_17_2_19": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, single row, max 5, unlocked [2]",
                          "type": "object"
                        }
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Set, single row, max 5, unlocked",
                      "type": "object"
                    },
                    "186455_20": {
                      "properties": {
                        "186455_20_1": {
                          "properties": {
                            "186455_20_1_21": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_20_1_22": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, 3 rows, locked [1]",
                          "type": "object"
                        },
                        "186455_20_2": {
                          "properties": {
                            "186455_20_2_21": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_20_2_22": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, 3 rows, locked [2]",
                          "type": "object"
                        },
                        "186455_20_3": {
                          "properties": {
                            "186455_20_3_21": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_20_3_22": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, 3 rows, locked [3]",
                          "type": "object"
                        }
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Set, 3 rows, locked",
                      "type": "object"
                    },
                    "186455_23": {
                      "properties": {
                        "186455_23_1": {
                          "properties": {
                            "186455_23_1_24": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_23_1_25": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, 3 rows, max 5, unlocked [1]",
                          "type": "object"
                        },
                        "186455_23_2": {
                          "properties": {
                            "186455_23_2_24": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_23_2_25": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, 3 rows, max 5, unlocked [2]",
                          "type": "object"
                        },
                        "186455_23_3": {
                          "properties": {
                            "186455_23_3_24": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Text",
                              "type": "string"
                            },
                            "186455_23_3_25": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "Date",
                              "type": "string"
                            }
                          },
                          "title": "Set, 3 rows, max 5, unlocked [3]",
                          "type": "object"
                        }
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Set, 3 rows, max 5, unlocked",
                      "type": "object"
                    }
                  },
                  "title": "Leo",
                  "type": "object"
                },
                "187420": {
                  "description": null,
                  "properties": {
                    "187420_2": {
                      "maxLength": 32,
                      "readonly": true,
                      "required": false,
                      "title": "Title",
                      "type": "string"
                    },
                    "187420_3": {
                      "readonly": true,
                      "required": false,
                      "title": "Oranization",
                      "type": "string"
                    },
                    "187420_8": {
                      "properties": {
                        "187420_8_1": {
                          "properties": {
                            "187420_8_1_9": {
                              "maxLength": 20,
                              "readonly": true,
                              "required": false,
                              "title": "Building",
                              "type": "string"
                            },
                            "187420_8_1_10": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Room",
                              "type": "string"
                            }
                          },
                          "title": "Storage Location [1]",
                          "type": "object"
                        }
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Storage Location",
                      "type": "object"
                    },
                    "187420_4": {
                      "maxLength": 32,
                      "readonly": true,
                      "required": false,
                      "title": "Subject",
                      "type": "string"
                    },
                    "187420_5": {
                      "enum": ["Draft",
                        "Review",
                        "Released",
                        "Public"],
                      "readonly": true,
                      "required": false,
                      "title": "Status",
                      "type": "string"
                    },
                    "187420_11": {
                      "properties": {
                        "187420_11_1": {
                          "properties": {
                            "187420_11_1_12": {
                              "readonly": true,
                              "required": false,
                              "title": "Reviewer",
                              "type": "string"
                            },
                            "187420_11_1_13": {
                              "format": "datetime",
                              "readonly": true,
                              "required": false,
                              "title": "reviewed at",
                              "type": "string"
                            },
                            "187420_11_1_14": {
                              "maxLength": 32,
                              "readonly": true,
                              "required": false,
                              "title": "Comment",
                              "type": "string"
                            },
                            "187420_11_1_15": {
                              "readonly": true,
                              "required": false,
                              "title": "Major change",
                              "type": "boolean"
                            }
                          },
                          "title": "Review History [1]",
                          "type": "object"
                        }
                      },
                      "readonly": true,
                      "required": false,
                      "title": "Review History",
                      "type": "object"
                    },
                    "187420_6": {
                      "maxLength": 40,
                      "readonly": true,
                      "required": false,
                      "title": "Publisher",
                      "type": "string"
                    },
                    "187420_7": {
                      "readonly": true,
                      "required": false,
                      "title": "Rights Management",
                      "type": "boolean"
                    }
                  },
                  "title": "Library Classification",
                  "type": "object"
                }
              },
              "title": "categories",
              "type": "object"
            }
          }]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=1&category_id=186455',
      responseTime: 50,
      responseText: {
        "forms": [
          {
            "data": {
              "186455_2": "TextValue",
              "186455_3": [
                "TextValue1",
                "TextValue1",
                "TextValue3",
                "TextValue4"
              ],
              "186455_5": [
                "TextValue1",
                "TextValue2",
                "TextValue3"
              ],
              "186455_4": [
                "TextValue1",
                "TextValue2",
                "TextValue3"
              ],
              "186455_6": "two",
              "186455_7": [
                "one",
                "two"
              ],
              "186455_8": [
                "one",
                "two",
                ""
              ],
              "186455_9": [
                "one",
                "two",
                "three"
              ],
              "186455_10": "2015-07-16T00:00:00",
              "186455_11": [
                "2015-07-17T00:00:00",
                "2015-07-18T00:00:00"
              ],
              "186455_12": [
                "2015-07-19T00:00:00",
                "2015-07-20T00:00:00",
                "2015-07-21T00:00:00"
              ],
              "186455_13": [
                "2015-07-22T00:00:00",
                "2015-07-23T00:00:00",
                null
              ],
              "186455_14": {
                "186455_14_1_15": "Set1.TextValue",
                "186455_14_1_26": "2015-07-24T00:00:00"
              },
              "186455_17": [
                {
                  "186455_17_x_18": "Set2.TextValue1",
                  "186455_17_x_19": "2015-07-25T00:00:00"
                },
                {
                  "186455_17_x_18": "Set2.TextValue2",
                  "186455_17_x_19": "2015-07-26T00:00:00"
                }
              ],
              "186455_20": [
                {
                  "186455_20_x_21": "Set3.TextValue1",
                  "186455_20_x_22": "2015-07-27T00:00:00"
                },
                {
                  "186455_20_x_21": "Set3.TextValue2",
                  "186455_20_x_22": "2015-07-28T00:00:00"
                },
                {
                  "186455_20_x_21": null,
                  "186455_20_x_22": null
                }
              ],
              "186455_23": [
                {
                  "186455_23_x_24": "Set4.TextValue1",
                  "186455_23_x_25": "2015-07-29T00:00:00"
                },
                {
                  "186455_23_x_24": "Set4.TextValue2",
                  "186455_23_x_25": "2015-07-30T00:00:00"
                },
                {
                  "186455_23_x_24": null,
                  "186455_23_x_25": null
                }
              ],
              "186455_17_1": null,
              "186455_17_2": null,
              "186455_20_1": null,
              "186455_20_2": null,
              "186455_20_3": null,
              "186455_23_1": null,
              "186455_23_2": null,
              "186455_23_3": null
            },
            "options": {
              "fields": {
                "186455_2": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Text, single row, locked",
                  "readonly": false,
                  "type": "text"
                },
                "186455_3": {
                  "fields": {
                    "item": {
                      "type": "text"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Text, single row, max 5, unlocked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_5": {
                  "fields": {
                    "item": {
                      "type": "text"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Text, 3 rows, locked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_4": {
                  "fields": {
                    "item": {
                      "type": "text"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Text, 3 rows, max 5, unlocked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Text Popup, single row, locked",
                  "readonly": false,
                  "type": "radio"
                },
                "186455_7": {
                  "fields": {
                    "item": {
                      "type": "select"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Text Popup, single row, max 5, unlocked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_8": {
                  "fields": {
                    "item": {
                      "type": "select"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Text Popup, 3 rows, locked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_9": {
                  "fields": {
                    "item": {
                      "type": "select"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Text Popup, 3 rows, 5 max, unlocked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_10": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Date, single row, locked",
                  "readonly": false,
                  "type": "date"
                },
                "186455_11": {
                  "fields": {
                    "item": {
                      "type": "date"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Date, single row, max5, unlocked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_12": {
                  "fields": {
                    "item": {
                      "type": "date"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Date, 3 rows, locked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_13": {
                  "fields": {
                    "item": {
                      "type": "date"
                    }
                  },
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Date, 3 rows, max5, unlocked",
                  "readonly": false,
                  "toolbarSticky": true
                },
                "186455_14": {
                  "fields": {
                    "186455_14_1_15": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Text",
                      "readonly": false,
                      "type": "text"
                    },
                    "186455_14_1_26": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Date",
                      "readonly": false,
                      "type": "date"
                    }
                  },
                  "hideInitValidationError": true,
                  "label": "Set, single row, locked",
                  "type": "object"
                },
                "186455_17": {
                  "fields": {
                    "item": {
                      "fields": {
                        "186455_17_x_18": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Text",
                          "readonly": false,
                          "type": "text"
                        },
                        "186455_17_x_19": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Date",
                          "readonly": false,
                          "type": "date"
                        }
                      },
                      "type": "object"
                    }
                  },
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Set, single row, max 5, unlocked",
                  "toolbarSticky": true
                },
                "186455_20": {
                  "fields": {
                    "item": {
                      "fields": {
                        "186455_20_x_21": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Text",
                          "readonly": false,
                          "type": "text"
                        },
                        "186455_20_x_22": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Date",
                          "readonly": false,
                          "type": "date"
                        }
                      },
                      "type": "object"
                    }
                  },
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Set, 3 rows, locked",
                  "toolbarSticky": true
                },
                "186455_23": {
                  "fields": {
                    "item": {
                      "fields": {
                        "186455_23_x_24": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Text",
                          "readonly": false,
                          "type": "text"
                        },
                        "186455_23_x_25": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Date",
                          "readonly": false,
                          "type": "date"
                        }
                      },
                      "type": "object"
                    }
                  },
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Set, 3 rows, max 5, unlocked",
                  "toolbarSticky": true
                },
                "186455_17_1": {
                  "hidden": true
                },
                "186455_17_2": {
                  "hidden": true
                },
                "186455_20_1": {
                  "hidden": true
                },
                "186455_20_2": {
                  "hidden": true
                },
                "186455_20_3": {
                  "hidden": true
                },
                "186455_23_1": {
                  "hidden": true
                },
                "186455_23_2": {
                  "hidden": true
                },
                "186455_23_3": {
                  "hidden": true
                }
              },
              "form": {
                "attributes": {
                  "action": "api\\/v1\\/nodes\\/109221\\/categories\\/186455",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "186455_2": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Text, single row, locked",
                  "type": "string"
                },
                "186455_3": {
                  "items": {
                    "maxItems": 5,
                    "maxLength": 32,
                    "minItems": 1,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Text, single row, max 5, unlocked",
                  "type": "array"
                },
                "186455_5": {
                  "items": {
                    "maxItems": 3,
                    "maxLength": 32,
                    "minItems": 3,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Text, 3 rows, locked",
                  "type": "array"
                },
                "186455_4": {
                  "items": {
                    "maxItems": 5,
                    "maxLength": 32,
                    "minItems": 1,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Text, 3 rows, max 5, unlocked",
                  "type": "array"
                },
                "186455_6": {
                  "enum": [
                    "one",
                    "two",
                    "three"
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "Text Popup, single row, locked",
                  "type": "string"
                },
                "186455_7": {
                  "items": {
                    "enum": [
                      "one",
                      "two",
                      "three"
                    ],
                    "maxItems": 5,
                    "minItems": 1,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Text Popup, single row, max 5, unlocked",
                  "type": "array"
                },
                "186455_8": {
                  "items": {
                    "enum": [
                      "one",
                      "two",
                      "three"
                    ],
                    "maxItems": 3,
                    "minItems": 3,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Text Popup, 3 rows, locked",
                  "type": "array"
                },
                "186455_9": {
                  "items": {
                    "enum": [
                      "one",
                      "two",
                      "three"
                    ],
                    "maxItems": 5,
                    "minItems": 1,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Text Popup, 3 rows, 5 max, unlocked",
                  "type": "array"
                },
                "186455_10": {
                  "readonly": false,
                  "required": false,
                  "title": "Date, single row, locked",
                  "type": "string"
                },
                "186455_11": {
                  "items": {
                    "maxItems": 5,
                    "minItems": 1,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Date, single row, max5, unlocked",
                  "type": "array"
                },
                "186455_12": {
                  "items": {
                    "maxItems": 3,
                    "minItems": 3,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Date, 3 rows, locked",
                  "type": "array"
                },
                "186455_13": {
                  "items": {
                    "maxItems": 5,
                    "minItems": 1,
                    "type": "string"
                  },
                  "readonly": false,
                  "required": false,
                  "title": "Date, 3 rows, max5, unlocked",
                  "type": "array"
                },
                "186455_14": {
                  "properties": {
                    "186455_14_1_15": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "title": "Text",
                      "type": "string"
                    },
                    "186455_14_1_26": {
                      "readonly": false,
                      "required": false,
                      "title": "Date",
                      "type": "string"
                    }
                  },
                  "title": "Set, single row, locked",
                  "type": "object"
                },
                "186455_17": {
                  "items": {
                    "maxItems": 5,
                    "minItems": 1,
                    "properties": {
                      "186455_17_x_18": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Text",
                        "type": "string"
                      },
                      "186455_17_x_19": {
                        "readonly": false,
                        "required": false,
                        "title": "Date",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  },
                  "title": "Set, single row, max 5, unlocked",
                  "type": "array"
                },
                "186455_20": {
                  "items": {
                    "maxItems": 3,
                    "minItems": 3,
                    "properties": {
                      "186455_20_x_21": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Text",
                        "type": "string"
                      },
                      "186455_20_x_22": {
                        "readonly": false,
                        "required": false,
                        "title": "Date",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  },
                  "title": "Set, 3 rows, locked",
                  "type": "array"
                },
                "186455_23": {
                  "items": {
                    "maxItems": 5,
                    "minItems": 1,
                    "properties": {
                      "186455_23_x_24": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Text",
                        "type": "string"
                      },
                      "186455_23_x_25": {
                        "readonly": false,
                        "required": false,
                        "title": "Date",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  },
                  "title": "Set, 3 rows, max 5, unlocked",
                  "type": "array"
                },
                "186455_17_1": {
                  "type": "string"
                },
                "186455_17_2": {
                  "type": "string"
                },
                "186455_20_1": {
                  "type": "string"
                },
                "186455_20_2": {
                  "type": "string"
                },
                "186455_20_3": {
                  "type": "string"
                },
                "186455_23_1": {
                  "type": "string"
                },
                "186455_23_2": {
                  "type": "string"
                },
                "186455_23_3": {
                  "type": "string"
                }
              },
              "type": "object"
            }
          }
        ]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=1&category_id=187420',
      responseTime: 50,
      responseText: {
        "forms": [
          {
            "data": {
              "187420_2": "Lorem Ipsum",
              "187420_3": 13231,
              "187420_8": {
                "187420_8_1_9": "O20.2",
                "187420_8_1_10": "Roma"
              },
              "187420_4": "Programming",
              "187420_5": "Draft",
              "187420_11": [
                {
                  "187420_11_x_12": 192463,
                  "187420_11_x_13": "2015-07-30T00:00:00",
                  "187420_11_x_14": "Comment",
                  "187420_11_x_15": false
                }
              ],
              "187420_6": "Windmill Publishing",
              "187420_7": true,
              "187420_11_1": null
            },
            "options": {
              "fields": {
                "187420_2": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Title",
                  "readonly": false,
                  "type": "text"
                },
                "187420_3": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Oranization",
                  "readonly": false,
                  "type": "otcs_user_picker",
                  "type_control": {
                    "action": "api\\/v1\\/members",
                    "method": "GET",
                    "name": "HH",
                    "parameters": {
                      "filter_types": [
                        0
                      ],
                      "select_types": [
                        0
                      ]
                    }
                  }
                },
                "187420_8": {
                  "fields": {
                    "187420_8_1_9": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Building",
                      "readonly": false,
                      "type": "text"
                    },
                    "187420_8_1_10": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Room",
                      "readonly": false,
                      "type": "text"
                    }
                  },
                  "hideInitValidationError": true,
                  "label": "Storage Location",
                  "type": "object"
                },
                "187420_4": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Subject",
                  "readonly": false,
                  "type": "text"
                },
                "187420_5": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Status",
                  "readonly": false,
                  "type": "select"
                },
                "187420_11": {
                  "fields": {
                    "item": {
                      "fields": {
                        "187420_11_x_12": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Reviewer",
                          "readonly": false,
                          "type": "otcs_user_picker",
                          "type_control": {
                            "action": "api\\/v1\\/members",
                            "method": "GET",
                            "name": "",
                            "parameters": {
                              "filter_types": [
                                0
                              ],
                              "select_types": [
                                0
                              ]
                            }
                          }
                        },
                        "187420_11_x_13": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "reviewed at",
                          "readonly": false,
                          "type": "date"
                        },
                        "187420_11_x_14": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Comment",
                          "readonly": false,
                          "type": "text"
                        },
                        "187420_11_x_15": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Major change",
                          "readonly": false,
                          "type": "checkbox"
                        }
                      },
                      "type": "object"
                    }
                  },
                  "hideInitValidationError": true,
                  "items": {
                    "showMoveDownItemButton": false,
                    "showMoveUpItemButton": false
                  },
                  "label": "Review History",
                  "toolbarSticky": true
                },
                "187420_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Publisher",
                  "readonly": false,
                  "type": "text"
                },
                "187420_7": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Rights Management",
                  "readonly": false,
                  "type": "checkbox"
                },
                "187420_11_1": {
                  "hidden": true
                }
              },
              "form": {
                "attributes": {
                  "action": "api\\/v1\\/nodes\\/109221\\/categories\\/187420",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "187420_2": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Title",
                  "type": "string"
                },
                "187420_3": {
                  "readonly": false,
                  "required": false,
                  "title": "Oranization",
                  "type": "integer"
                },
                "187420_8": {
                  "properties": {
                    "187420_8_1_9": {
                      "maxLength": 20,
                      "readonly": false,
                      "required": false,
                      "title": "Building",
                      "type": "string"
                    },
                    "187420_8_1_10": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "title": "Room",
                      "type": "string"
                    }
                  },
                  "title": "Storage Location",
                  "type": "object"
                },
                "187420_4": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Subject",
                  "type": "string"
                },
                "187420_5": {
                  "enum": [
                    "Draft",
                    "Review",
                    "Released",
                    "Public"
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "Status",
                  "type": "string"
                },
                "187420_11": {
                  "items": {
                    "maxItems": 5,
                    "minItems": 1,
                    "properties": {
                      "187420_11_x_12": {
                        "readonly": false,
                        "required": false,
                        "title": "Reviewer",
                        "type": "integer"
                      },
                      "187420_11_x_13": {
                        "readonly": false,
                        "required": false,
                        "title": "reviewed at",
                        "type": "string"
                      },
                      "187420_11_x_14": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Comment",
                        "type": "string"
                      },
                      "187420_11_x_15": {
                        "readonly": false,
                        "required": false,
                        "title": "Major change",
                        "type": "boolean"
                      }
                    },
                    "type": "object"
                  },
                  "title": "Review History",
                  "type": "array"
                },
                "187420_6": {
                  "maxLength": 40,
                  "readonly": false,
                  "required": false,
                  "title": "Publisher",
                  "type": "string"
                },
                "187420_7": {
                  "readonly": false,
                  "required": false,
                  "title": "Rights Management",
                  "type": "boolean"
                },
                "187420_11_1": {
                  "type": "string"
                }
              },
              "type": "object"
            }
          }
        ]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=1&category_id=401978',
      responseTime: 50,
      responseText: {
        "forms": [
          {
            "data": {
              "401978_2": "12345",
              "401978_3": "Demo",
              "401978_4": 10,
              "401978_5": 500,
              "401978_6": "LOI",
              "401978_7": null
            },
            "options": {
              "fields": {
                "401978_2": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "ID",
                  "readonly": false,
                  "type": "text"
                },
                "401978_3": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Description",
                  "readonly": false,
                  "type": "text"
                },
                "401978_4": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Quantity",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_5": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Total Price",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Stage",
                  "readonly": false,
                  "type": "text"
                },
                "401978_7": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Close Date",
                  "readonly": false,
                  "type": "date"
                }
              },
              "form": {
                "attributes": {
                  "action": "api\\/v1\\/nodes\\/207755\\/categories\\/401978",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "401978_2": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "ID",
                  "type": "string"
                },
                "401978_3": {
                  "maxLength": 64,
                  "readonly": false,
                  "required": false,
                  "title": "Description",
                  "type": "string"
                },
                "401978_4": {
                  "readonly": false,
                  "required": false,
                  "title": "Quantity",
                  "type": "integer"
                },
                "401978_5": {
                  "readonly": false,
                  "required": false,
                  "title": "Total Price",
                  "type": "integer"
                },
                "401978_6": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Stage",
                  "type": "string"
                },
                "401978_7": {
                  "readonly": false,
                  "required": false,
                  "title": "Close Date",
                  "type": "string"
                }
              },
              "type": "object"
            }
          }
        ]
      }
    });
    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/1/roles?fields=members',
      responseTime: 50,
      responseText: {
        "links" : {
          "self" : {
            "body" : "",
            "content_type" : "",
            "href" : "/api/v2/businessworkspaces/1/roles?fields=members",
            "method" : "GET",
            "name" : ""
          }
        },
        "results" : [{
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/1/roles/6424618",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/1/roles/6424618",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : "pbond@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Peter",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6325586,
              "last_name" : "Bond",
              "middle_name" : null,
              "name" : "pbond",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/bond-peter.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "larmstrong@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Liz",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6326140,
              "last_name" : "Armstrong",
              "middle_name" : null,
              "name" : "larmstrong",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/armstrong-liz.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "ngalleos@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Nick",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6420739,
              "last_name" : "Galleos",
              "middle_name" : null,
              "name" : "ngalleos",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/galleos-nick.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6424618,
              "inherited_from_id" : null,
              "leader" : true,
              "name" : "Key Account Manager",
              "perms" : 258207
            }
          }
        }, {
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/1/roles/6423832",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/1/roles/6423832",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : null,
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Steve",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6326139,
              "last_name" : "Maxwell",
              "middle_name" : null,
              "name" : "smaxwell",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/steve-maxwell.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "ngalleos@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Nick",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6420739,
              "last_name" : "Galleos",
              "middle_name" : null,
              "name" : "ngalleos",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/galleos-nick.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "nlang@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Neil",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6421069,
              "last_name" : "Lang",
              "middle_name" : null,
              "name" : "nlang",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/lang-neil.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6423832,
              "inherited_from_id" : null,
              "leader" : false,
              "name" : "Sales",
              "perms" : 258207
            }
          }
        }
        ]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=2&category_id=401978',
      responseTime: 50,
      responseText: {
        "forms": [
          {
            "data": {
              "401978_2": "98765",
              "401978_3": "Demo",
              "401978_4": 900,
              "401978_5": 500.000,
              "401978_6": "CLOSED",
              "401978_7": '2015-07-15',
              "401978_8": ['value1', 'value2', 'value3']
            },
            "options": {
              "fields": {
                "401978_2": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "ID",
                  "readonly": false,
                  "type": "text"
                },
                "401978_3": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Description",
                  "readonly": false,
                  "type": "text"
                },
                "401978_4": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Quantity",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_5": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Total Price",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Stage",
                  "readonly": false,
                  "type": "text"
                },
                "401978_7": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Close Date",
                  "readonly": false,
                  "type": "date"
                },
              "401978_8" : {
                "fields" : {
                  "item" : {
                    "type" : "text"
                  }
                },
                "hidden" : false,
                "hideInitValidationError" : true,
                "items" : {
                  "showMoveDownItemButton" : false,
                  "showMoveUpItemButton" : false
                },
                "label" : "Multi",
                "readonly" : false,
                "toolbarSticky" : true
              }

            },
              "form": {
                "attributes": {
                  "action": "api\\/v1\\/nodes\\/207755\\/categories\\/401978",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "401978_2": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "ID",
                  "type": "string"
                },
                "401978_3": {
                  "maxLength": 64,
                  "readonly": false,
                  "required": false,
                  "title": "Description",
                  "type": "string"
                },
                "401978_4": {
                  "readonly": false,
                  "required": false,
                  "title": "Quantity",
                  "type": "integer"
                },
                "401978_5": {
                  "readonly": false,
                  "required": false,
                  "title": "Total Price",
                  "type": "integer"
                },
                "401978_6": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Stage",
                  "type": "string"
                },
                "401978_7": {
                  "readonly": false,
                  "required": false,
                  "title": "Close Date",
                  "type": "string"
                },
                "401978_8" : {
                  "items" : {
                    "maxItems" : 50,
                    "maxLength" : 32,
                    "minItems" : 1,
                    "type" : "string"
                  },
                  "readonly" : false,
                  "required" : false,
                  "title" : "Multi",
                  "type" : "array"
                }
              },
              "type": "object"
            }
          }
        ]
      }
    });
    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/2/roles?fields=members',
      responseTime: 50,
      responseText: {
        "links" : {
          "self" : {
            "body" : "",
            "content_type" : "",
            "href" : "/api/v2/businessworkspaces/2/roles?fields=members",
            "method" : "GET",
            "name" : ""
          }
        },
        "results" : [{
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6424618",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6424618",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : "pbond@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Peter",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6325586,
              "last_name" : "Bond",
              "middle_name" : null,
              "name" : "pbond",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/bond-peter.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "larmstrong@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Liz",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6326140,
              "last_name" : "Armstrong",
              "middle_name" : null,
              "name" : "larmstrong",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/armstrong-liz.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "ngalleos@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Nick",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6420739,
              "last_name" : "Galleos",
              "middle_name" : null,
              "name" : "ngalleos",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/galleos-nick.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6424618,
              "inherited_from_id" : null,
              "leader" : true,
              "name" : "Key Account Manager",
              "perms" : 258207
            }
          }
        }, {
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6423832",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6423832",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : "nlang@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Neil",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6421069,
              "last_name" : "Lang",
              "middle_name" : null,
              "name" : "nlang",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/lang-neil.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6423832,
              "inherited_from_id" : null,
              "leader" : false,
              "name" : "Sales",
              "perms" : 258207
            }
          }
        }
        ]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=3&category_id=401978',
      responseTime: 50,
      responseText: {
        "forms": [
          {
            "data": {
              "401978_2": "777777",
              "401978_3": "Demo",
              "401978_4": 50,
              "401978_5": '5.000.000',
              "401978_6": "LOI",
              "401978_7": ''
            },
            "options": {
              "fields": {
                "401978_2": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "ID",
                  "readonly": false,
                  "type": "text"
                },
                "401978_3": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Description",
                  "readonly": false,
                  "type": "text"
                },
                "401978_4": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Quantity",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_5": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Total Price",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Stage",
                  "readonly": false,
                  "type": "text"
                },
                "401978_7": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Close Date",
                  "readonly": false,
                  "type": "date"
                }
              },
              "form": {
                "attributes": {
                  "action": "api\\/v1\\/nodes\\/207755\\/categories\\/401978",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "401978_2": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "ID",
                  "type": "string"
                },
                "401978_3": {
                  "maxLength": 64,
                  "readonly": false,
                  "required": false,
                  "title": "Description",
                  "type": "string"
                },
                "401978_4": {
                  "readonly": false,
                  "required": false,
                  "title": "Quantity",
                  "type": "integer"
                },
                "401978_5": {
                  "readonly": false,
                  "required": false,
                  "title": "Total Price",
                  "type": "integer"
                },
                "401978_6": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Stage",
                  "type": "string"
                },
                "401978_7": {
                  "readonly": false,
                  "required": false,
                  "title": "Close Date",
                  "type": "string"
                }
              },
              "type": "object"
            }
          }
        ]
      }
    });
    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/3/roles?fields=members',
      responseTime: 50,
      responseText: {
        "links" : {
          "self" : {
            "body" : "",
            "content_type" : "",
            "href" : "/api/v2/businessworkspaces/399446/roles?fields=members",
            "method" : "GET",
            "name" : ""
          }
        },
        "results" : [{
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/399446/roles/6424618",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/399446/roles/6424618",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : "pbond@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Peter",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6325586,
              "last_name" : "Bond",
              "middle_name" : null,
              "name" : "pbond",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/bond-peter.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "larmstrong@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Liz",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6326140,
              "last_name" : "Armstrong",
              "middle_name" : null,
              "name" : "larmstrong",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/armstrong-liz.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "ngalleos@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Nick",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6420739,
              "last_name" : "Galleos",
              "middle_name" : null,
              "name" : "ngalleos",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/galleos-nick.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6424618,
              "inherited_from_id" : null,
              "leader" : true,
              "name" : "Key Account Manager",
              "perms" : 258207
            }
          }
        }, {
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/399446/roles/6423832",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/399446/roles/6423832",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [],
            "properties" : {
              "description" : "",
              "id" : 6423832,
              "inherited_from_id" : null,
              "leader" : false,
              "name" : "Sales",
              "perms" : 258207
            }
          }
        }
        ]
      }
    });
    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/4/roles?fields=members',
      responseTime: 50,
      responseText: {
        "links" : {
          "self" : {
            "body" : "",
            "content_type" : "",
            "href" : "/api/v2/businessworkspaces/4/roles?fields=members",
            "method" : "GET",
            "name" : ""
          }
        },
        "results" : [{
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/4/roles/6424618",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/4/roles/6424618",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : "pbond@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Peter",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6325586,
              "last_name" : "Bond",
              "middle_name" : null,
              "name" : "pbond",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/bond-peter.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "larmstrong@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Liz",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6326140,
              "last_name" : "Armstrong",
              "middle_name" : null,
              "name" : "larmstrong",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/armstrong-liz.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "ngalleos@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Nick",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6420739,
              "last_name" : "Galleos",
              "middle_name" : null,
              "name" : "ngalleos",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/galleos-nick.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6424618,
              "inherited_from_id" : null,
              "leader" : true,
              "name" : "Key Account Manager",
              "perms" : 258207
            }
          }
        }
        ]
      }
    });
    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/5/roles?fields=members',
      responseTime: 50,
      responseText: {
        "links" : {
          "self" : {
            "body" : "",
            "content_type" : "",
            "href" : "/api/v2/businessworkspaces/5/roles?fields=members",
            "method" : "GET",
            "name" : ""
          }
        },
        "results" : []
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=*&category_id=401978',
      responseTime: 50,
      responseText: {
        "forms": [
          {
            "data": {
              "401978_2": "777777",
              "401978_3": "Demo",
              "401978_4": 50,
              "401978_5": '5.000.000',
              "401978_6": "LOI",
              "401978_7": ''
            },
            "options": {
              "fields": {
                "401978_2": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "ID",
                  "readonly": false,
                  "type": "text"
                },
                "401978_3": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Description",
                  "readonly": false,
                  "type": "text"
                },
                "401978_4": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Quantity",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_5": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Total Price",
                  "readonly": false,
                  "type": "integer"
                },
                "401978_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Stage",
                  "readonly": false,
                  "type": "text"
                },
                "401978_7": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Close Date",
                  "readonly": false,
                  "type": "date"
                }
              },
              "form": {
                "attributes": {
                  "action": "api\\/v1\\/nodes\\/207755\\/categories\\/401978",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "401978_2": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "ID",
                  "type": "string"
                },
                "401978_3": {
                  "maxLength": 64,
                  "readonly": false,
                  "required": false,
                  "title": "Description",
                  "type": "string"
                },
                "401978_4": {
                  "readonly": false,
                  "required": false,
                  "title": "Quantity",
                  "type": "integer"
                },
                "401978_5": {
                  "readonly": false,
                  "required": false,
                  "title": "Total Price",
                  "type": "integer"
                },
                "401978_6": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Stage",
                  "type": "string"
                },
                "401978_7": {
                  "readonly": false,
                  "required": false,
                  "title": "Close Date",
                  "type": "string"
                }
              },
              "type": "object"
            }
          }
        ]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v2/businessworkspaces/*/roles?fields=members',
      responseTime: 50,
      responseText: {
        "links" : {
          "self" : {
            "body" : "",
            "content_type" : "",
            "href" : "/api/v2/businessworkspaces/2/roles?fields=members",
            "method" : "GET",
            "name" : ""
          }
        },
        "results" : [{
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6424618",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6424618",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : "pbond@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Peter",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6325586,
              "last_name" : "Bond",
              "middle_name" : null,
              "name" : "pbond",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/bond-peter.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "larmstrong@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Liz",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6326140,
              "last_name" : "Armstrong",
              "middle_name" : null,
              "name" : "larmstrong",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/armstrong-liz.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }, {
              "business_email" : "ngalleos@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Nick",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6420739,
              "last_name" : "Galleos",
              "middle_name" : null,
              "name" : "ngalleos",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/galleos-nick.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6424618,
              "inherited_from_id" : null,
              "leader" : true,
              "name" : "Key Account Manager",
              "perms" : 258207
            }
          }
        }, {
          "actions" : {
            "delete-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6423832",
              "method" : "DELETE",
              "name" : "Delete Role"
            },
            "edit-role" : {
              "body" : "",
              "content_type" : "",
              "form_href" : "",
              "href" : "/api/v2/businessworkspaces/2/roles/6423832",
              "method" : "PUT",
              "name" : "Edit Role"
            }
          },
          "data" : {
            "members" : [{
              "business_email" : "nlang@elink.loc",
              "business_fax" : null,
              "business_phone" : null,
              "deleted" : false,
              "first_name" : "Neil",
              "group_id" : 1001,
              "group_name" : "DefaultGroup",
              "id" : 6421069,
              "last_name" : "Lang",
              "middle_name" : null,
              "name" : "nlang",
              "office_location" : null,
              "photo_id" : '../../../utils/previewpane/test/images/lang-neil.png',
              "privilege_login" : true,
              "privilege_modify_groups" : false,
              "privilege_modify_users" : false,
              "privilege_public_access" : true,
              "privilege_system_admin_rights" : false,
              "privilege_user_admin_rights" : false,
              "time_zone" : -1,
              "title" : null,
              "type" : 0,
              "type_name" : "User"
            }
            ],
            "properties" : {
              "description" : "",
              "id" : 6423832,
              "inherited_from_id" : null,
              "leader" : false,
              "name" : "Sales",
              "perms" : 258207
            }
          }
        }
        ]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/nodes/*/categories',
      responseTime: 50,
      responseText: {
        "data": [
          {
            "id": 401978,
            "name": "Sales Opportunity",
            "cell_metadata": {
              "data": {
                "menu": "api/v1/nodes/1/categories/401978/actions"
              },
              "definitions": {
                "menu": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "menu",
                  "display_href": "",
                  "handler": "menu",
                  "image": "",
                  "method": "GET",
                  "name": "",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null
          }
        ],
        "definitions": {
          "id": {
            "key": "id",
            "name": "ID",
            "persona": "node",
            "type": 2,
            "width_weight": 0
          },
          "name": {
            "key": "name",
            "name": "Name",
            "persona": "",
            "type": -1,
            "width_weight": 100
          }
        },
        "definitions_map": {
          "name": [
            "menu"
          ]
        },
        "definitions_order": [
          "name"
        ]
      }
    });

    mockjax({
      url: '//server/otcs/cs/api/v1/nodes/*/categories/actions',
      responseTime: 50,
      responseText: {
        "data": {
          "categories_add": "api/v1/forms/nodes/categories/create?id=408356"
        },
        "definitions": {
          "categories_add": {
            "body": "",
            "content_type": "",
            "display_hint": "",
            "display_href": "",
            "handler": "node_picker_form",
            "image": "",
            "method": "GET",
            "name": "Add Categories",
            "parameters": {},
            "tab_href": ""
          }
        },
        "definitions_map": {},
        "definitions_order": [
          "categories_add"
        ]
      }
    });

    mockjax({
      url: /.*\/api\/v2\/businessworkspaces\/\d+\s*$/,
      responseTime: 50,
      responseText: {
        "links": {
          "self": {
            "body": "",
            "content_type": "",
            "href": "/api/v2/businessworkspaces/1662686",
            "method": "GET",
            "name": ""
          }
        },
        "results": {
          "actions": {
            "add-role": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "/api/v2/businessworkspaces/1662686/roles",
              "method": "POST",
              "name": "Add Role"
            },
            "delete-icon": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "/api/v2/businessworkspaces/1662686/icons",
              "method": "DELETE",
              "name": "Delete Icon"
            },
            "update-icon": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "/api/v2/businessworkspaces/1662686/icons",
              "method": "PUT",
              "name": "Update Icon"
            },
            "upload-icon": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "/api/v2/businessworkspaces/1662686/icons",
              "method": "POST",
              "name": "Upload Icon"
            }
          },
          "data": {
            "business_properties": {
              "has_default_display": true,
              "has_default_search": false,
              "isEarly": true,
              "workspace_type_id": 29,
              "workspace_type_name": "Product",
              "workspace_type_name_multilingual": {
                "de": "",
                "en": "",
                "es": "",
                "fr": "",
                "it": "",
                "ja": "",
                "pt": "",
                "ru": "",
                "zh": ""
              }
            },
            "properties": {
              "container": true,
              "container_size": 0,
              "create_date": "2015-05-04T10:12:04",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {
                "de": "",
                "en": "",
                "es": "",
                "fr": "",
                "it": "",
                "ja": "",
                "pt": "",
                "ru": "",
                "zh": ""
              },
              "favorite": false,
              "guid": null,
              "icon": "/img/otsapxecm/wksp_equipment.png",
              "icon_large": "/img/otsapxecm/wksp_equipment_large.png",
              "id": 1662686,
              "modify_date": "2015-10-06T14:48:21",
              "modify_user_id": 1000,
              "name": "Complete Sprinkler System (2720-30)",
              "name_multilingual": {
                "de": "",
                "en": "Complete Sprinkler System (2720-30)",
                "es": "",
                "fr": "",
                "it": "",
                "ja": "",
                "pt": "",
                "ru": "",
                "zh": ""
              },
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 393946,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 848,
              "type_name": "Business Workspace",
              "versions_control_advanced": false,
              "volume_id": -2000
            }
          }
        }
      }
    });
  }
);

