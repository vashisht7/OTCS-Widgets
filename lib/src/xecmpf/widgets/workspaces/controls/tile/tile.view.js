/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette', 'csui/utils/log',
    'csui/utils/base',
    'csui/controls/tile/tile.view',
    'css!xecmpf/widgets/workspaces/controls/tile/impl/tile'

], function (module, $, _, Backbone, Marionette, log, base,
             TileView_
) {

    var TileView = TileView_.extend({
        constructor: function TileView(options) {
            TileView_.prototype.constructor.apply(this, arguments);
        }
    });
    return TileView;
});
