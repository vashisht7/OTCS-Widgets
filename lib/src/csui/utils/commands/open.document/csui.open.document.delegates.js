/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore',
  'csui/utils/commands/open.specific.node.perspective',
  'csui/utils/commands/open'
], function (module, _, OpenSpecificNodePerspectiveCommand,
    OpenDocumentContentCommand) {
  'use strict';

  var config = _.extend({
    allowViewContent: true,
    allowPerspective: false
  }, module.config());

  return [
    {
      sequence: 500,
      command: OpenSpecificNodePerspectiveCommand,
      decides: function () {
        return config.allowPerspective;
      }
    },
    {
      sequence: 1000,
      command: OpenDocumentContentCommand,
      decides: function () {
        return config.allowViewContent;
      }
    },
    {
      sequence: 10000,
      command: OpenSpecificNodePerspectiveCommand
    }
  ];
});
