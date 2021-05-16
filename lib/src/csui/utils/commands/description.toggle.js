/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  "i18n!csui/utils/commands/nls/localized.strings",
  "csui/utils/commandhelper", "csui/utils/commands/node",
  "csui/utils/command.error", "csui/utils/accessibility"
], function (require, $, base, _, lang, CommandHelper, NodeCommand, CommandError, Accessibility) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var DescriptionToggleCommand = NodeCommand.extend({

    defaults: {
      signature: "ToggleDescription",
      command_key: ['description', 'description'],
      scope: "single",
      name: lang.CommandDescriptionToggle
    },
    enabled: function (status, options) {
      if (!accessibleTable && status.collection && !status.thumbnailViewState) {
        if (status.originatingView && status.originatingView.options.showDescriptions) {
          status.toolItem.attributes.name = lang.CommandHideDescription;
        }
        var nodeWithDescription = status.collection.find(function (node) {
          var descr = node.get('description');
          return !!descr;
        });
        return nodeWithDescription !== undefined;
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      var originatingView = status.originatingView;
      var langStr;

      var toolbarListItem = originatingView.$el.find('li[data-csui-command="toggledescription"]');
      var toolbarListItemAnchor = toolbarListItem.find('a');

      if (originatingView.options.showDescriptions) {
        originatingView.options.showDescriptions = false;
        langStr = lang.CommandShowDescription;
        toolbarListItemAnchor.attr('title', langStr).attr('aria-label', langStr);
      } else {
        originatingView.options.showDescriptions = true;
        langStr = lang.CommandHideDescription;
        toolbarListItemAnchor.attr('title', langStr).attr('aria-label', langStr);
      }

      originatingView.trigger('csui.description.toggled',
          {showDescriptions: originatingView.options.showDescriptions});
    }
  });

  return DescriptionToggleCommand;

});
