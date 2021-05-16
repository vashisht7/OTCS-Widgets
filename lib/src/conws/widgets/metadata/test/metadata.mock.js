/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery.mockjax'],
  function (mockjax) {

    var mocks = [];

    return {

      enable: function () {

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v2/nodes/19500*',
          type: 'GET',
          responseTime: 50,
          responseText: {
            data: {
              id: 19500,
              name: 'MetadataTest'
            }
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/nodes/19500/categories',
          responseTime: 0,
          responseText: {
            data: [
              {
                id: 12345,
                name: "Manufacturer"
              },
              {
                id: 12346,
                name: "General"
              },
              {
                id: 12347,
                name: "Organization"
              }
            ]
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/nodes/19500/categories/actions',
          type: 'GET',
          responseTime: 0,
          responseText: {
            data: {
              categories_add: "api/v1/forms/nodes/categories/create?id=19500"
            }
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=19500&category_id=12345',
          type: 'GET',
          responseTime: 50,
          responseText: {
            "forms": [
              {
                "data": {
                  "12345_1": "Microsoft",
                  "12345_2": "US",
                  "12345_3": "Surface3",
                  "12345_4": "",
                  "12345_5": "",
                  "12345_6": "2014",
                  "12345_7": "8"
                },
                "options": {
                  "fields": {
                    "12345_1": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Name",
                      "readonly": false,
                      "type": "text"
                    },
                    "12345_2": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Country",
                      "readonly": false,
                      "type": "text"
                    },
                    "12345_3": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Model Number",
                      "readonly": false,
                      "type": "text"
                    },
                    "12345_4": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Part Number",
                      "readonly": false,
                      "type": "text"
                    },
                    "12345_5": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Serial Number",
                      "readonly": false,
                      "type": "text"
                    },
                    "12345_6": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Construction Year",
                      "readonly": false,
                      "type": "integer"
                    },
                    "12345_7": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Construction Month",
                      "readonly": false,
                      "type": "integer"
                    }
                  },
                  "form": {
                    "attributes": {
                      "action": "api\/v1\/nodes\/182623\/categories\/186455",
                      "method": "PUT"
                    },
                    "renderForm": true
                  }
                },
                "schema": {
                  "properties": {
                    "12345_1": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12345_2": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12345_3": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12345_4": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12345_5": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12345_6": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "integer"
                    },
                    "12345_7": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "integer"
                    }
                  },
                  "type": "object"
                }
              }
            ]
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=19500&category_id=12346',
          type: 'GET',
          responseTime: 50,
          responseText: {
            "forms": [
              {
                "data": {
                  "12346_1": "10002345",
                  "12346_2": "Computer",
                  "12346_3": "Personal Tablet Computer",
                  "12346_4": ""
                },
                "options": {
                  "fields": {
                    "12346_1": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Equipment Number",
                      "readonly": false,
                      "type": "text"
                    },
                    "12346_2": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Category",
                      "readonly": false,
                      "type": "text"
                    },
                    "12346_3": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Description",
                      "readonly": false,
                      "type": "text"
                    },
                    "12346_4": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Status",
                      "readonly": false,
                      "type": "text"
                    }
                  },
                  "form": {
                    "attributes": {
                      "action": "api\/v1\/nodes\/182623\/categories\/186455",
                      "method": "PUT"
                    },
                    "renderForm": true
                  }
                },
                "schema": {
                  "properties": {
                    "12346_1": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12346_2": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12346_3": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12346_4": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    }
                  },
                  "type": "object"
                }
              }
            ]
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=19500&category_id=12347',
          type: 'GET',
          responseTime: 50,
          responseText: {
            "forms": [
              {
                "data": {
                  "12347_1": "MS",
                  "12347_2": "Hardware",
                  "12347_3": {
                    "12347_3_1_5": "Waldstrasse",
                    "12347_3_1_6": "Munich",
                    "12347_3_1_7": "81234"
                  }
                },
                "options": {
                  "fields": {
                    "12347_1": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Company Code",
                      "readonly": false,
                      "type": "text"
                    },
                    "12347_2": {
                      "hidden": false,
                      "hideInitValidationError": true,
                      "label": "Business Area",
                      "readonly": false,
                      "type": "text"
                    },
                    "12347_3": {
                      "type": "object",
                      "label": "Location",
                      "fields": {
                        "12347_3_1_5": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Street",
                          "readonly": false,
                          "type": "text"
                        },
                        "12347_3_1_6": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "City",
                          "readonly": false,
                          "type": "text"
                        },
                        "12347_3_1_7": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "Postal Code",
                          "readonly": false,
                          "type": "text"
                        }
                      }
                    }
                  },
                  "form": {
                    "attributes": {
                      "action": "api\/v1\/nodes\/182623\/categories\/186455",
                      "method": "PUT"
                    },
                    "renderForm": true
                  }
                },
                "schema": {
                  "properties": {
                    "12347_1": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12347_2": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12347_3": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "type": "string"
                    },
                    "12347_4": {
                      "type": "object",
                      "properties": {
                        "12347_4_1_5": {
                          "maxLength": 32,
                          "readonly": false,
                          "required": false,
                          "type": "string"
                        },
                        "12347_4_1_6": {
                          "maxLength": 32,
                          "readonly": false,
                          "required": false,
                          "type": "string"
                        }
                      }
                    }
                  },
                  "type": "object"
                }
              }
            ]
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/nodes/19500/categories/12345',
          type: 'PUT',
          responseTime: 50,
          responseText: {
            "forms": 'Attribute change successfully saved!'
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/nodes/19500/categories/12346',
          type: 'PUT',
          responseTime: 50,
          responseText: {
            "forms": 'Attribute change successfully saved!'
          }
        }));

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/nodes/19500/categories/12347',
          type: 'PUT',
          responseTime: 50,
          responseText: {
            "forms": 'Attribute change successfully saved!'
          }
        }));
      },

      disable: function () {
        var mock;
        while ((mock = mocks.pop())) {
          mockjax.clear(mock);
        }
      }
    }
  });


