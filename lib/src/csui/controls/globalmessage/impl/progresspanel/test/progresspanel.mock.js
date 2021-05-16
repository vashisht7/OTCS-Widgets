/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery.mockjax', 'json!./server.results.json',
  "csui/lib/marionette", 'csui/models/mixins/uploadable/uploadable.mixin'
], function (_, mockjax, serverResults, Marionette, UploadableMixin) {
  'use strict';

  var View = Marionette.ItemView.extend({
    template: false
  });

  var uploadableMock;

  return {
    enable: function () {
      uploadableMock = UploadableMixin.mock;
      UploadableMixin.mock = true;

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/validation/nodes'),
        responseText: serverResults.validate.success
      });

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/forms/nodes/create(\\?.*)?$'),
        responseText: serverResults.create
      });

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/1234/nodes(\?:\\?(.*))?$'),
        status: 200,
        responseText: serverResults.nodesCollection
      });

     mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/1234/ancestors(?:\\?(.*))?$'),
        status: 200,
        responseText: serverResults.ancestors
      });

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/1234(?:\\?(.*))?$'),
        status: 200,
        response: function () {
          return serverResults.node;
        }
      });

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/1234(?:\\?(.*))?$'),
        status: 200,
        responseText: serverResults.node
      });

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes'),
        status: 400,
        response: function () {
          return serverResults.failed.alreadyExist;
        }
      });

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/141(\\?.*)?$'),
        status: 200,
        responseText: serverResults.volume
      });

      mockjax({
        name: 'controls/progresspanel/test/progresspanel.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/142(\\?.*)?$'),
        status: 200,
        responseText: serverResults.volume
      });
    },

    disable: function () {
      UploadableMixin.mock = uploadableMock;

      mockjax.clear();
    },

    newView: function () {
      return new View();
    },

    fileList: [
      {
        name: 'file1',
        size: 10,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    ],
    multipleUploadFileList: [
      {
        name: 'file01',
        size:  10,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      {
        name: 'file02',
        size:  10,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      {
        name: 'file03',
        size: 10,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    ]
  };

});
