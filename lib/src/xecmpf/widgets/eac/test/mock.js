/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax'], function (_, mockjax) {

  var mocks = [];
  return {
    enable: function () {
      mocks.push(mockjax({
        type: 'GET',
        url: '//server/otcs/cs/api/v2/eventactioncenter/systemnames',
        responseTime: 0,
        responseText: {
          "results": {
            systems: [{
              namespace: "Extended ECM"
            }, {
              namespace: "SalesForce"
            }, {
              namespace: "SuccessFactors"
            }]
          }
        }
      }));

      mocks.push(mockjax({
        type: 'GET',
        url: '//server/otcs/cs/api/v2/eventactioncenter/eventsummary',
        responseTime: 0,
        responseText: {
          "results": {
            "data": [{
              event_name: "Change in Employee Location", //Name of the event
              event_id: "Change.in.Employee.Location",
              process_mode: "Asynchronously",
              run_as: "Admin",
            }]
          }
        }
      }))
      mocks.push(mockjax({
        type: 'GET',
        url: '//server/otcs/cs/api/v2/eventactioncenter/actionplan',
        responseTime: 0,
        responseText: {
          "results": {
            "data": [
              {
                event_name: "Change in Employee Location", //Name of the event
                event_id: "Change.in.Employee.Location", //Name of the event 
                namespace: "SuccessFactors",// Logical System Name
                action_plan_count: 1, // Number of action plan count
                action_plans: [ //action plan details
                  {
                    run_as: "Business administrator",
                    process_mode: "Synchronously",
                    rules: [
                      {
                        position: 1,
                        operand: "userid",
                        operator: "equals to",
                        value: "LinV",
                        conjunction: "Or"
                      }
                    ],
                    actions: [
                      {
                        position: 1,
                        action_key: "DocGenEventAction.Document Generation Event Action",
                        attribute_mappings: [
                          {
                            action_attr_id: 1,
                            position: 1,
                            mapping_method: "Content Server Object",
                            mapping_data: "44268",
                            action_attr_name: "Document Type"
                          }
                        ]
                      }
                    ],
                    plan_id: 1,
                    rule_id: 1
                  }
                ]
              }, {
                event_name: "Generate document",
                event_id: "Generate.document",
                namespace: "Extended ECM",
                action_plan_count: 0,
                action_plans: []
              }, {
                event_name: "Change in Employee Marial Status",
                event_id: "Change.in.Employee.Marial.Status",
                namespace: "Salesforce",
                action_plan_count: 0,
                action_plans: []
              }, {
                event_name: "Change in Employee Current Location",
                event_id: "Change.in.Employee.Current.Location",
                namespace: "SuccessFactors",
                action_plan_count: 0,
                action_plans: []
              }
            ],
            ok: true,
            statusCode: 200
          }
        }
      }));

      mocks.push(mockjax({
        type: 'GET',
        url: '//server/otcs/cs/api/v2/eventactioncenter/eventproperties*',
        responseTime: 0,
        responseText: {
          "results": {
            "data": [
              {
                name: "Eligible For Benefits"
              }, {
                name: "Location Name"
              }, {
                name: "Employee Name"
              }, {
                name: "Department Name"
              }
            ]
          }
        }
      }));
      mocks.push(mockjax({
        type: 'GET',
        url: '//server/otcs/cs/api/v2/eventactioncenter/actions',
        responseTime: 0,
        responseText: {
          "results": {
            actions: [
              {
                action_key: "GENDOC.Generate document",
                action_name: "Generate document",
                actions_attribute_count: 4,
                actions_attributes: [
                  {
                    name: "Document template",
                    key: "document_template",
                    required : true
                  }, {
                    name: "Generate document for",
                    key: "generate_document_for",
                    required : false
                  }, {
                    name: "Workflow map",
                    key: "workflow_map",
                    required : true
                  }, {
                    name: "Workflow attachment",
                    key: "workflow_attachment",
                    required : false
                  }
                ]
              },
              {
                action_key: "INIWF.Initiate Workflow",
                action_name: "Initiate Workflow",
                actions_attribute_count: 3,
                actions_attributes: [
                  {
                    name: "Approver User Name",
                    key: "approver_user_name"
                  }, {
                    name: "Initiator User Name",
                    key: "initiator_user_name"
                  }, {
                    name: "Number of Approvers",
                    key: "number_of_approvers"
                  }
                ]
              }
            ]
          }
        }
      }));
      mocks.push(mockjax({
        type: 'GET',
        url: '//server/otcs/cs/api/v2/eventactioncenter/facets',
        responseTime: 0,
        responseText: {
          "facets": {
            "available_values": [
              {
                "namespace": [
                  {
                    "name": "Extended ECM", //Logical System Name Value
                    "percentage": 25,
                    "total": 1,
                    "value": "Extended ECM"//Logical System Name Value
                  },
                  {
                    "name": "Salesforce",//Logical System Name Value
                    "percentage": 25,
                    "total": 1,
                    "value": "Salesforce"//Logical System Name Value
                  },
                  {
                    "name": "SuccessFactors",//Logical System Name Value
                    "percentage": 50,
                    "total": 2,
                    "value": "SuccessFactors"//Logical System Name Value
                  }
                ]
              },
              {
                "has_action_plan": [
                  {
                    "name": "Event without action plan",
                    "percentage": 75,
                    "total": 3,
                    "value": false
                  },
                  {
                    "name": "Event with action plan",
                    "percentage": 25,
                    "total": 1,
                    "value": true
                  }
                ]
              }
            ],
            "properties": {
              "namespace": {
                "id": "namespace",
                "items_to_show": 5,
                "name": "Namespace",
                "name_multilingual": {
                  "en": "Namespace"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
              },
              "has_action_plan": {
                "id": "action_plans",
                "name": "Action plans",
                "name_multilingual": {
                  "en": "Action plans"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        type: 'PUT',
        url: '//server/otcs/cs/api/v2/eventactioncenter/actionplan*',
        responseTime: 0,
        responseText: {
          "results": {
            msg: 'Action Plan created successfully'
          }
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