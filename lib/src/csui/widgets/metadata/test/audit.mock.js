/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax', 'json!./audit.mock.data.json'], function (mockjax, data) {
  var mocks = [];
  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp(
          '//server/otcs/cs/api/v2/nodes/(.*)/audit\\?expand=(.*)&limit=30&page=1&sort=desc_audit_date&where_user_id=(.*)$'
          ),
        urlParams: ['nodeID', 'expand','userID'],
        response: function (settings) {
          var userData = JSON.parse(JSON.stringify(data.withSpecificUser));
          if (settings.urlParams.userID !== "18484") {
            userData.results.data.audit.length = 0;
          }
          this.responseText = userData;
        }
      }));

      mocks.push(mockjax({
        url: new RegExp(
          '//server/otcs/cs/api/v2/nodes/11111/audit\\?expand=(.*)&limit=30&page=1&sort=desc_audit_date&where_type=10$'
          ),
        response: function () {
          this.responseText = data.type;
        }
      }));

      mocks.push(mockjax({
        url: new RegExp(
          '//server/otcs/cs/api/v2/nodes/(.*)/audit\\?expand=(.*)&limit=30&page=1&sort=(.*)$'
          ),
        urlParams: ['nodeID', 'expand', 'sort'],
        response: function (settings) {
          var auditData = JSON.parse(JSON.stringify(data.asc));
          if (settings.urlParams.sort === 'desc_audit_date') {
            auditData.results.data.audit.reverse();
          }
          this.responseText = auditData;
        }

      }));

      mocks.push(mockjax({
        url: new RegExp(
          '//server/otcs/cs/api/v2/members\\?limit=10&where_type=0&query=(.*)$'),
        urlParams: ['name'],
        response: function (settings) {
          var user = JSON.parse(JSON.stringify(data.userWithAudits));
          if (settings.urlParams.name === 'vineethreddy') {
            this.responseText = user;
          } else if (settings.urlParams.name === 'kristen') {
            this.responseText = data.userWithoutAudits;
          } else { //user invalid
            user.results.length = 0;
            this.responseText = user;
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});
