csui.define(['csui/lib/jquery.mockjax', 'json!./userwidget.data.json'], function (mockjax, mocked) {
  'use strict';

  var mocks = [];

  return {
    chatSettings: false,
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        type: 'GET',
        responseTime: 0,
        responseText: mocked.auth
      }));

      if (this.chatSettings) {
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/pulse/members/(.*)\\?(.*)$'),
          responseTime: 0,
          type: "GET",
          responseText: mocked.pulsemembersWithChatSettings
        }));
      } else {
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/pulse/members/(.*)\\?(.*)$'),
          responseTime: 0,
          type: "GET",
          responseText: mocked.pulsemembersWithOutChatSettings
        }));
      }

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pulse/settings?fields=chatSettings',
        responseTime: 0,
        responseText: mocked.settings
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/members/1000?expand=member',
        responseText: mocked.users
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/members/1020',
        responseText: mocked.manager
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/members?expand=member',
        responseText: mocked.members
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/pulse/statuses/public_timeline\\?(.*)$'),
        urlParams: ['query'],
        responseText: mocked.statuses_publictimeline
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/users/1000/view',
        responseTime: 0,
        responseText: mocked.formData
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/users/1020/view',
        responseTime: 0,
        responseText: mocked.managerFormData
      }));

      mocks.push(mockjax({
        url: new RegExp(
            '//server/otcs/cs/api/v2/members\\?limit=20&where_type=0&expand%3Dproperties%7Bgroup_id%2Cleader_id%7D&query=[aA]'),
        responseText: mocked.members_match
      }));

      mocks.push(mockjax({
        url: new RegExp(
            '//server/otcs/cs/api/v2/members\\?limit=20&where_type=0&expand%3Dproperties%7Bgroup_id%2Cleader_id%7D&query=[^aA]'),
        responseText: mocked.members_notmatch
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/1000',
        type: 'PUT',
        responseText: mocked.input_info
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pulse/upload_profile_photo',
        type: 'POST',
        responseText: mocked.upload_profile_photo
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pulse/members/photo',
        type: 'DELETE',
        responseText: mocked.del_photo
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/members/1000/photo?v=3871.1',
        responseText: mocked.photo
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pulse/members/1000',
        type: 'PUT',
        responseText: mocked.pulse_member_input
      }));

    },
    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  }
});

