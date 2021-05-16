/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

(function () {
  'use strict';
  var connections = {
        server: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      },
      csui        = window.csui || (window.csui = {});

  csui.connection = connections.server;
  csui.testContainerId = 2000; //container details to show nodestable widget, targetpicker...
  csui.searchSettings = {  // search results
    enableSearchSettings: false,
    enableSorting: true,
    searchString: "*",
    savedSearchQueryId: 0  //saved search query Id
  };
  csui.onsubmitData = function onsubmitData() {
    updateConnectionDetails();
    updateNodeIdDetails();
    updatesavedSearchQueryId();
  };
  function updateConnectionDetails() {
    connections.server.url = document.querySelector(".serverUrl").value;
    connections.server.supportPath = document.querySelector(".serverUrl").value;
    csui.connection = connections.server;
    return csui.connection;
  }
  function updateNodeIdDetails() {
    csui.testContainerId = document.querySelector(".serverUrl").value;
  }
  function updatesavedSearchQueryId() {
    csui.searchSettings.savedSearchQueryId = document.querySelector(".serverUrl").value;
  }
}());