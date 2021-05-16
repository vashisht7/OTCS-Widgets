csui.define(['csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/testutils/async.test.utils',
  'esoc/widgets/activityfeedwidget/activityfeedwidget.view', './activityfeed.mock.js'
], function (Marionette, _, $, PageContext, asyncTestUtils, ActivityFeedWidget, ActivityMock) {

  describe('Activity Feed Widget', function () {
    // Declare objects used in the checks
    var context, activityFeedWidget, activityRegion;

    // Initialize the objects first here to enable describe and iit
    // tricks; wait until the model gets fetched by the CS REST API
    // mock before any spec is executed
    beforeAll(function () {
      ActivityMock.enable();
      if (!context) {
        context = new PageContext({
          factories: {
            connector: {
              connection: {
                url: '//server/otcs/cs/api/v1',
                supportPath: '/support',
                session: {
                  ticket: 'dummy'
                }
              }
            }
          }
        });
      }
      var options = {
        context: context,
        data: {
          "title": "Activity Feed - All",
          "feedsize": 10,
          "feedtype": "all",
          "feedSettings": {
            "enableComments": true,
            "enableFilters": true
          },
          "honorfeedsource": false,
          "headerView": false,
          "feedsource": {"source": "all"},
          "updatesfrom": {"from": "all"},
          "config_settings": {
            'feedsAutoRefreshWait': 60000,
            'maxMessageLength': 1000
          }
        }

      };

      activityFeedWidget = new ActivityFeedWidget(options);

      activityRegion = new Marionette.Region({
        el: $('<div></div>').appendTo(document.body)
      });
      activityRegion.show(activityFeedWidget);
      context.fetch();
    });

    afterAll(function () {
      ActivityMock.disable();
      activityRegion.destroy();
      $('body').empty();
    });

    it('Render Activity Feed widget', function () {
      expect(activityFeedWidget.isRendered).toBeTruthy();
    });

    it('check whether collection is visible', function (done) {
      asyncTestUtils.asyncElement(activityFeedWidget.$el, '.esoc-social-comment-data:visible')
          .done(function (el) {
            expect(el.length).toBeGreaterThan(0);
            done();
          });
    });

    it('Check expand Icon and click', function (done) {
      activityFeedWidget._behaviors[0].expanded = false;
      asyncTestUtils.asyncElement(activityFeedWidget.$el, '.cs-more.tile-expand')
          .done(function (el) {
            expect(el.length).toBe(1);
            el.trigger('click');
            done();
          });
    });

    it('Check for expanded view', function (done) {
      asyncTestUtils.asyncElement('body',
          '.binf-widgets .activityfeed-expand.cs-dialog .binf-modal-content:visible')
          .done(function (el) {
            expect(el.length).toBe(1);
            done();
          });
    });

    it('Hover over username for mini profile view', function (done) {
      $('.activityfeed-list .esoc-activityfeed-list-item:first').find(
          '.esoc-user-widget .esoc-user-mini-profile').trigger('mouseover');
      asyncTestUtils.asyncElement('body', '.esoc-mini-profile-actions:visible').done(function (el) {
        expect(el.length).toBe(1);
        done();
      });
    });

    it('Mouse leave on username for hiding mini profile view', function (done) {
      $('.activityfeed-list .esoc-activityfeed-list-item:first').find(
          '.esoc-user-widget .esoc-user-mini-profile').trigger('mouseleave');
      asyncTestUtils.asyncElement('body', '.esoc-mini-profile-actions:visible', true).done(
          function (el) {
            expect(el.length).toBe(0);
            done();
          });
    });

    it('Hover over user profile image for mini profile view', function (done) {
      $('.activityfeed-list .esoc-activityfeed-list-item:first').find(
          '.esoc-profileimg-block .esoc-user-mini-profile').trigger('mouseover');
      asyncTestUtils.asyncElement('body', '.esoc-mini-profile-actions:visible').done(function (el) {
        expect(el.length).toBe(1);
        done();
      });
    });

    it('Mouse leave on user profile image for hiding mini profile view', function (done) {
      $('.activityfeed-list .esoc-activityfeed-list-item:first').find(
          '.esoc-profileimg-block .esoc-user-mini-profile').trigger('mouseleave');
      asyncTestUtils.asyncElement('body', '.esoc-mini-profile-actions:visible', true).done(
          function (el) {
            expect(el.length).toBe(0);
            done();
          });
    });

    it('Click on username for user profile view', function (done) {
      $('.activityfeed-list .esoc-activityfeed-list-item:first').find(
          '.esoc-user-widget .esoc-user-mini-profile').trigger('click');
      asyncTestUtils.asyncElement('body',
          '.esoc-user-widget-dialog.binf-in .esoc-userprofile-widget .esoc-general-tab-content:visible').done(
          function (el) {
            expect(el.length).toBe(1);
            done();
          });
    });

    it('Close user profile view', function (done) {
      $('.esoc-user-widget-dialog-close').trigger('click');
      asyncTestUtils.asyncElement('body',
          '.esoc-user-widget-dialog.binf-in .esoc-userprofile-widget:visible', true).done(
          function (el) {
            expect(el.length).toBe(0);
            done();
          });
    });

    it('Check expand Icon and click', function (done) {
      activityFeedWidget._behaviors[0].expanded = false;
      asyncTestUtils.asyncElement(activityFeedWidget.$el, '.cs-more.tile-expand')
          .done(function (el) {
            expect(el.length).toBe(1);
            el.trigger('click');
            done();
          });
    });

    it('Check for expanded view', function (done) {
      asyncTestUtils.asyncElement('body',
          '.binf-widgets .activityfeed-expand.cs-dialog .binf-modal-content:visible')
          .done(function (el) {
            expect(el.length).toBe(1);
            done();
          });
    });

    it('Click on user profile image for user profile view', function (done) {
      $('.activityfeed-list .esoc-activityfeed-list-item:first').find(
          '.esoc-profileimg-block .esoc-user-mini-profile').trigger('click');
      asyncTestUtils.asyncElement('body',
          '.esoc-user-widget-dialog.binf-in .esoc-userprofile-widget .esoc-general-tab-content:visible').done(
          function (el) {
            expect(el.length).toBe(1);
            done();
          });
    });

    it('Close user profile view', function (done) {
      $('.esoc-user-widget-dialog-close').trigger('click');
      asyncTestUtils.asyncElement('body',
          '.esoc-user-widget-dialog.binf-in .esoc-userprofile-widget:visible', true).done(
          function (el) {
            expect(el.length).toBe(0);
            done();
          });
    });

    it('Check expand Icon and click', function (done) {
      activityFeedWidget._behaviors[0].expanded = false;
      asyncTestUtils.asyncElement(activityFeedWidget.$el, '.cs-more.tile-expand')
          .done(function (el) {
            expect(el.length).toBe(1);
            el.trigger('click');
            done();
          });
    });

    it('Check for expanded view', function (done) {
      asyncTestUtils.asyncElement('body',
          '.binf-widgets .activityfeed-expand.cs-dialog .binf-modal-content .esoc-activityfeed-filters.ps-container:visible')
          .done(function (el) {
            expect(el.length).toBe(1);
            done();
          });
    });

    it('Display the status updates when we select only status update check box in activity feed expand view',
        function (done) {
          asyncTestUtils.asyncElement('body',
              '.binf-widgets .activityfeed-expand.cs-dialog .binf-modal-content .esoc-activityfeed-filters.ps-container:visible')
              .done(function (el) {
                $('#esoc_activityfeed_filter_status').trigger('click');
                asyncTestUtils.asyncElement('body', '.binf-widgets .esoc-activityfeed-with-filter' +
                                                    ' .load-container.binf-hidden')
                    .done(function (el) {
                      expect(el.length).toBe(1);
                      done();
                    });
              });

        });

    it('Display the content updates when we select only content update check box in activity feed expand view',
        function (done) {
          asyncTestUtils.asyncElement('body',
              '.binf-widgets .activityfeed-expand.cs-dialog .binf-modal-content .esoc-activityfeed-filters.ps-container:visible')
              .done(function (el) {
                $('#esoc_activityfeed_filter_content').trigger('click');
                asyncTestUtils.asyncElement('body', '.binf-widgets .esoc-activityfeed-with-filter' +
                                                    ' .load-container.binf-hidden')
                    .done(function (el) {
                      expect(el.length).toBe(1);
                      done();
                    });
              });
        });

    it('Display the attribute updates when we select only attribute update check box in activity feed expand view',
        function (done) {
          asyncTestUtils.asyncElement('body',
              '.binf-widgets .activityfeed-expand.cs-dialog .binf-modal-content .esoc-activityfeed-filters.ps-container:visible')
              .done(function (el) {
                $('#esoc_activityfeed_filter_attribute').trigger('click');
                asyncTestUtils.asyncElement('body', '.binf-widgets .esoc-activityfeed-with-filter' +
                                                    ' .load-container.binf-hidden')
                    .done(function (el) {
                      expect(el.length).toBe(1);
                      done();
                    });
              });
        });

  });

});
