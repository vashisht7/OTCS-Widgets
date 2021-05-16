/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/header/header.view',
  'xecmpf/widgets/header/test/header.mock', 'csui/perspectives/tabbed/tabbed.perspective.view',
], function ($, _, Marionette,
  PageContext, HeaderWidget, Mock, TabbedPerspectiveView) {
  describe('Platform Header Widget', function () {
    var context, contentRegion1, contentRegion2, perspectiveView1, perspectiveView2, header;

    beforeAll(function () {
      Mock.enable();

      var $head = $('head');
      $head.append('<link rel="stylesheet" href="/base/csui/themes/carbonfiber/theme.css">');

      var $body = $('body');
      $body.addClass('binf-widgets');
      $body.css({
        'margin': 0,
        'height': '100%',
        'overflow-y': 'hidden',
        'overflow-x': 'hidden',
        'padding-right': '0px !important'
      });
      $body.append('<div id="widgetWMainWindow" style="height:100vh"></div>');
      $body.append('<div id="widgetWMainWindow2" style="height:100vh"></div>');
    });

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
        },
        node: {
          attributes: {id: 51209, type: 848 }
        }
      }
    });

    var perspectiveConfig = {
      "header": {
        "widget": {
          "type": "xecmpf/widgets/header",
          "options": {
            "workspace": {
              "properties": {
                "title": "{name}",
                "type": "{business_properties.workspace_type_name}",
                "description": "line 1\nLine2\nLine3"
              }
            },
            "completenessCheckSettings": {
              "hideMissingDocsCheck": false,
              "hideOutdatedDocsCheck":false,
              "hideInProcessDocsCheck":false
            },
            "favoriteSettings": {
              "hideFavorite": false
            },
            "headerwidget": {
              "type": "metadata"
            },
            "metadataSettings": {
              "hideEmptyFields": false,
              "hideMetadata": false,
              "metadata": [
                {
                  "type": "group",
                  "label": "Vendor",
                  "attributes": [
                    {
                      "attributeId": 4,
                      "categoryId": 92523,
                      "label": "Name",
                      "type": "attribute"
                    },
                    {
                      "attributeId": 3,
                      "categoryId": 92523,
                      "label": "Object Key",
                      "type": "attribute"
                    }
                  ]
                },
                {
                  "type": "group",
                  "label": "Notification",
                  "attributes": [
                    {
                      "attributeId": 3,
                      "categoryId": 92523,
                      "label": "Object Key",
                      "type": "attribute"
                    }
                  ]
                }
              ],
              "metadataInColumns": "doubleCol"
            }
          }
        }
      },
      "tabs": []
    };

    describe('Header View with completeness check', function () {
      it('can be instantiated and rendered', function (done) {
        contentRegion1 = new Marionette.Region({
          el: '#widgetWMainWindow'
        });
        perspectiveView1 = new TabbedPerspectiveView(_.defaults({context: context},
            perspectiveConfig));

        perspectiveView1.widgetsResolved.always(function () {
          contentRegion1.show(perspectiveView1);
          context.fetch();
        });

        expect(perspectiveView1).toBeDefined();
        expect(perspectiveView1.$el.length).toBe(1);
        done();
      });

      describe('Description', function () {
        it('Description, show/hide are shown', function (done) {
            setTimeout(function(){
              header = $('#widgetWMainWindow #xecmpf-header');
              var description = header.find('.conws-header-desc .conws-description');
              expect(description).toBeDefined();
              expect(description.hasClass('description-height-oneline')).toBe(true);
              expect(description.height() === 16).toBe(true);

              var descShowMore = description.find('.description-caret-div .description-readmore');
              var descShowLess = description.find('.description-caret-div .description-showless');
              expect(descShowMore.is(':visible')).toBe(true);
              expect(descShowLess.is(':hidden')).toBe(true);

              descShowMore.trigger("click");
              expect(descShowMore.is(':hidden')).toBe(true);
              expect(descShowLess.is(':visible')).toBe(true);
              expect(description.height() > 16).toBe(true);
              descShowLess.trigger("click");
              done();
            }, 500);
        });
      });

      describe('Completeness checks', function () {
        it('The missing document completeness check is available', function (done) {
            setTimeout(function(){
              var missingDocsCheck = $('#widgetWMainWindow #xecmpf-header .conws-header-metadata-container .xecmpf-completenesscheck .missing-docs-check');
              var missingDocsIcon = missingDocsCheck.find('span.csui-icon.missing-icon');
              var missingDocsButton = missingDocsCheck.find('button.xecmpf-docscount-with-text');

              expect(missingDocsIcon).toBeDefined();
              expect(missingDocsButton).toBeDefined();
              expect(missingDocsIcon.is(':visible')).toBe(true);
              expect(missingDocsButton.is(':visible')).toBe(true);
              done();
            }, 500);
        });
      });
    });

    describe('Header View without completeness check', function () {
      it('can be instantiated and rendered', function (done) {

        perspectiveConfig.header.widget.options.completenessCheckSettings.hideMissingDocsCheck = true;
        perspectiveConfig.header.widget.options.completenessCheckSettings.hideOutdatedDocsCheck = true;
        perspectiveConfig.header.widget.options.completenessCheckSettings.hideInProcessDocsCheck = true;

        contentRegion2 = new Marionette.Region({
          el: '#widgetWMainWindow2'
        });
        perspectiveView2 = new TabbedPerspectiveView(_.defaults({context: context},
            perspectiveConfig));

        perspectiveView2.widgetsResolved.always(function () {
          contentRegion2.show(perspectiveView2);
          context.fetch();
        });

        expect(perspectiveView2).toBeDefined();
        expect(perspectiveView2.$el.length).toBe(1);
        done();
      });

      describe('Description', function () {
        it('Description takes full length when no completeness checks', function (done) {
          setTimeout(function(){
            header = $('#widgetWMainWindow2 #xecmpf-header');
            var description = header.find('.conws-header-desc .conws-description');
            expect(description).toBeDefined();
            expect(description.hasClass('description-height-threeline')).toBe(true);
            expect(description.height() === 48).toBe(true);

            expect(description.find('.description-caret-div').length).toBe(0);
            done();
          }, 500);
        });
      });
    });

    afterAll(function () {
      perspectiveView1.destroy();
      perspectiveView2.destroy();
      $('#widgetWMainWindow').remove();
      $('#widgetWMainWindow2').remove();
      $('link[href="/base/csui/themes/carbonfiber/theme.css"]').remove();
      Mock.disable();
    });
  })
});