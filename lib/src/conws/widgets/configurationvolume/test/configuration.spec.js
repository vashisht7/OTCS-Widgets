/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define([
  'csui/lib/jquery',
  "csui/lib/underscore",
  "csui/utils/contexts/page/page.context",
  "csui/utils/contexts/factories/node",
  "conws/widgets/configurationvolume/test/configuration.mock.data",
  'conws/utils/test/testutil',
  "conws/widgets/configurationvolume/configurationvolume.view"
], function ($, _,
    PageContext,
    NodeModelFactory,
    ConfigurationMock,
    TestUtil,
    ConfigurationView) {

  function getContext() {
    return new PageContext({
      factories: {
        connector: {
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/support',
            session: {
              ticket: 'dummy'
            }
          },
          assignTo: function assignTo(model) {
            model.connector = this;
          }
        }
      }
    });
  }

  describe('Configuration volume view', function () {

    var context, widget;
    beforeEach(function (done) {

      context = new getContext();
      ConfigurationMock.enable();

      var options = {context: context, data: {}};
      widget = new ConfigurationView(options);
      widget.model.fetch();

      TestUtil.waitFor(done, function () {
        widget.render();
        return widget.model.fetched === true;
      }, 'Widget render time out', 5000);

    });
    afterEach(function () {
      widget.destroy();
      $('body').empty();
      ConfigurationMock.disable();
    });

    it("can be instantiated and rendered", function () {

      expect(widget).toBeDefined();
      expect(widget.$el.length > 0).toBeTruthy();
      expect(widget.el.childNodes.length > 0).toBeTruthy();

    });

    it("has 9 configured volumes", function () {
      expect(
          widget.$el.find(".csui-configurationvolume-container").length).toBe(
          9);
    });

    it("has correct configured volume name", function () {
      var volume1 = widget.$el.find(".csui-configurationvolume-container")[0];
      expect($(volume1).find(".tile-title > span").text()).toBe("Water Management");
    });

  });
});
