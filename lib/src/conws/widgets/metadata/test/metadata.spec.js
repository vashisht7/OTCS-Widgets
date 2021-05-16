/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', "csui/lib/underscore", 'csui/utils/contexts/page/page.context',
  'csui/utils/base',
  'conws/widgets/metadata/metadata.view',
  'conws/widgets/metadata/test/metadata.mock',
  'conws/utils/test/testutil',
  'json!conws/widgets/metadata/test/widget.1.options.json',
  'json!conws/widgets/metadata/test/widget.2.options.json'
], function ($, _, PageContext, BaseUtils, MetadataView, MetadataMock, TestUtil, Widget1Options, Widget2Options) {

  function _iterate(obj, properties) {
    _.each(_.keys(obj), function (element) {
      if (obj.hasOwnProperty(element)) {
        if (typeof obj[element] === "object") {
          _iterate(obj[element], properties);
        } else {
          properties.push(element);
        }
      }
    });
  }

  describe('MetadataView', function () {

    var context;
    var v1, v2;

    beforeEach(function () {

      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            },
            assignTo: function () {
            }
          },
          node: {
            attributes: {
              id: 19500,
              type: 848
            }
          }
        }
      });

      MetadataMock.enable();

    });

    afterEach(function () {

      MetadataMock.disable();

    });

    describe('given empty configuration', function () {

      beforeEach(function () {
        v1 = new MetadataView({
          context: context
        });
      });

      it('can be created', function () {
        expect(v1 instanceof MetadataView).toBeTruthy();
      });

    });

    describe('given valid configuration', function () {

      beforeEach(function () {

        v1 = new MetadataView({
          context: context,
          data: Widget1Options.content
        });
        v1.render(); // no model loaded

        v2 = new MetadataView({
          context: context,
          data: Widget2Options.content
        })

      });

      it('has valid options', function () {

        expect(v1.options && v1.options.data).toBeDefined();

      });

      describe('matches configuration', function () {

        it('has configured title', function () {
          expect(v1.options.data.title).toBeDefined();
          var title = BaseUtils.getClosestLocalizedString(v1.options.data.title, "");
          expect(
            v1.$('> .conws-metadata > .tile-header > .tile-title > .csui-heading').text()
          ).toEqual(title);

        });

        it('has no configured icon', function () {
          expect(v1.options.data.icon).toBeUndefined();
          expect(
            v1.$('> .conws-metadata > .tile-header > .tile-type-icon').length
          ).toEqual(1);

        });

          it('has configured icon', function () {

              v2.render();
              expect(v2.options.data.icon).toBeDefined();
              var iconName = v2.options.data.icon;
              expect(
                      v2.$('> .conws-metadata > .tile-header > .tile-type-icon > .' + iconName).length
              ).toEqual(1);

          });

          describe('given valid data', function () {

          beforeEach(function (done) {

            v1.model.fetch();
            TestUtil.waitFor(done,function () {
              return v1.model.get("data");
            }, 'Data fetch timed out', 5000);

            v2.model.fetch();
            TestUtil.waitFor(done,function () {
              return v2.model.get("data");
            }, 'Data fetch timed out', 5000);

          });

          describe('respects hideEmptyFields option', function () {

            it('shows non-empty field', function () {

              var catId = 12345, attId = 3, fieldName = "12345_3";
              var fieldConfigured = false;
              expect(v1.options.data.metadata).toBeDefined();
              _.each(v1.options.data.metadata, function (element) {
                if (element.attributeId === attId && element.categoryId === catId) {
                  fieldConfigured = true;
                }
              });
              expect(fieldConfigured).toBeTruthy();
              var properties = [];
              _iterate(v1.model.get('data'), properties);
              expect(properties).toContain(fieldName);

            });

            it('hides empty field', function () {

              var catId = 12345, attId = 4, fieldName = "12345_4";
              expect(v1.options.data.hideEmptyFields).toBeDefined();
              var hideEmptyFields = v1.options.data.hideEmptyFields === true;
              expect(hideEmptyFields).toBeTruthy();
              var fieldConfigured = false;
              _.each(v1.options.data.metadata, function (element) {
                if (element.attributeId === attId && element.categoryId === catId) {
                  fieldConfigured = true;
                }
              });
              expect(fieldConfigured).toBeTruthy();
              var properties = [];
              _iterate(v1.model.get('data'), properties);
              expect(properties).not.toContain(fieldName);

            });

            it('shows empty field', function () {

              var catId = 12345, fieldName = "12345_4";
              expect(v2.options.data.hideEmptyFields).toBeFalsy();
              var fieldConfigured = false;
              _.each(v2.options.data.metadata, function (element) {
                if (element.type === "category" && element.categoryId === catId) {
                  fieldConfigured = true;
                }
              });
              expect(fieldConfigured).toBeTruthy();
              var properties = [];
              _iterate(v2.model.get('data'), properties);
              expect(properties).toContain(fieldName);
              expect(v2.model.get('data')[fieldName]).toBe("");

            });

          });

          describe('respects label configuration', function () {

            it('has attribute label', function () {

              var catId = 12345, grpIdx = 4, attIdx = 0, fieldName = "12345_6", groupName = "";
			  expect(v1.options.data.metadata[grpIdx].label).toBeDefined();
			  groupName = v1.options.data.metadata[grpIdx].label;

              expect(v1.options.data.metadata[grpIdx].attributes[attIdx].label).toBeDefined();
			  var label = v1.options.data.metadata[grpIdx].attributes[attIdx].label
              expect(v1.model.get('options').fields[groupName].fields[fieldName].label).toEqual(label);

            });

            it('has localized attribute label', function () {

              var catId = 12345, grpIdx = 4, attIdx = 1, fieldName = "12345_7", groupName = "";
			  expect(v1.options.data.metadata[grpIdx].label).toBeDefined();
			  groupName = v1.options.data.metadata[grpIdx].label;

              expect(v1.options.data.metadata[grpIdx].attributes[attIdx].label).toBeDefined();
			  var label = v1.options.data.metadata[grpIdx].attributes[attIdx].label.en;
              expect(v1.model.get('options').fields[groupName].fields[fieldName].label).toEqual(label);

            });

          });

          describe('respects section configuration', function () {

            it('allows multiple sections', function () {
              var grpCnt = 0;
              $.each(v1.options.data.metadata, function (index, value) {
                if (value.type === "group") {
                  grpCnt++;
                }
              });
              expect(grpCnt).toBeGreaterThan(1);
              $.each(v1.model.get("data"), function (index, value) {
                if (typeof value === "object") {
                  grpCnt--;
                }
              });
              expect(grpCnt).toEqual(0);

            });

            it('has section title', function () {

              var grpIdx = 5, grpName = "";
			  expect(v1.options.data.metadata[grpIdx].label).toBeDefined();
			  grpName = v1.options.data.metadata[grpIdx].label;

              expect(v1.options.data.metadata[grpIdx].label).toBeDefined();
			  var label = v1.options.data.metadata[grpIdx].label;
              expect(v1.model.get("options").fields[grpName].label).toEqual(label);

            });

            xit('has localized section title', function () {

              var grpIdx = 4, grpName = "";
			  expect(v1.options.data.metadata[grpIdx].label).toBeDefined();
			  grpName = BaseUtils.getClosestLocalizedString(v1.options.data.metadata[grpIdx].label);

              expect(v1.options.data.metadata[grpIdx].label).toBeDefined();
			  var label = v1.options.data.metadata[grpIdx].label.en;
              expect(v1.model.get("options").fields[grpName].label).toEqual(label);

            });

          });

          describe('respects read-only configuration', function () {

            it('has writable item', function () {

              var attIdx = 0, fieldName = "12345_1";
              expect(v1.options.data.metadata[attIdx].readOnly).toBeFalsy();
              expect(v1.model.get('schema').properties[fieldName].readonly).toBeFalsy();
            });

            it('has read-only item', function () {

              var attIdx = 1, fieldName = "12345_2";
              expect(v1.options.data.metadata[attIdx].readOnly).toBeTruthy();
              expect(v1.model.get('schema').properties[fieldName].readonly).toBeTruthy();

            });

          });

          it('TODO: allows multiple widget instances', function () {

          });

          it('TODO: allows attributes from different categories', function () {

          });

          it('TODO: supports vertical scrolling', function () {

          });

        });

      });

    });

  });

});
