/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery.mockjax', 'csui/models/mixins/uploadable/uploadable.mixin'
], function (mockjax, UploadableMixin) {
  'use strict';

  var mocks = [];
  var uploadableMock;

  return {
    enable: function () {
      uploadableMock = UploadableMixin.mock;
      UploadableMixin.mock = true;

      var enterpriseVolume = {
        "id": 2000,
        "name": "Enterprise",
        "type": 141
      };
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',

        response: function (settings) {

          this.status = 400;
          this.responseText = { error: 'Authentication failed' };

          if (settings.data.username === 'Admin'
            && settings.data.password === 'livelink') {

            this.status = 200;
            this.responseText = {
              ticket: '1234567890'
            };
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        type: 'GET',
        response: function (settings) {
          if (settings.headers.OTDSTicket === 'dummy') {
            this.status = 200;
            this.headers = { otcsticket: 'dummy' };
            this.responseText = { data: {} };
          } else {
            this.status = 401;
            this.responseText = { error: 'Authentication required' };
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2000(\\?(.*))?$'),
        responseText: enterpriseVolume
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth/photo',
        type: 'POST',
        response: function (settings) {
          this.status = 200;
          this.responseText = {
            contentType: settings.contentType,
            processData: settings.processData
          };
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }

      UploadableMixin.mock = uploadableMock;
    }
  };
});

