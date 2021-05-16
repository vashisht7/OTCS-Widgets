/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
      'csui/controls/tile/tile.view',
      'xecmpf/widgets/scan/scan.content.view',
      'i18n!xecmpf/widgets/scan/impl/nls/lang'],
    function (_, TileView, ScanContentView, Lang) {
      var ScanView = TileView.extend({
        constructor: function ScanView(options) {
          TileView.prototype.constructor.call(this, options);
        },
        contentView: ScanContentView,
        icon: 'title-recentlyaccessed',// TODO : change the icon
        title: Lang.title
      });
      return ScanView;
    });
 

