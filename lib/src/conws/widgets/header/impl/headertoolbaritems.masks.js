/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';
  var toolbars = ['rightToolbar','delayedActionsToolbar'];

  function ToolbarItemsMasks(options) {
    var globalMask;    
    this.toolbars = _.reduce(toolbars, function (toolbars, toolbar) {
      globalMask = toolbars[toolbar];

      if (!globalMask) {
        globalMask = new GlobalMenuItemsMask();			
      }

      var mask = new ToolItemMask(globalMask, { normalize: false }),
        source = options[toolbar];
      if (source) {
        mask.extendMask(source);
      }
      mask.storeMask();
      toolbars[toolbar] = mask;
      return toolbars;
    }, {});
  }

  ToolbarItemsMasks.toolbars = toolbars;

  return ToolbarItemsMasks;

});
