/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "module",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/utils/contexts/factories/factory",
  "csui/utils/taskqueue"
], function(module, _, Backbone, ModelFactory, TaskQueue) {
  var TaskQueueFactory = ModelFactory.extend({
    propertyPrefix: "taskQueue",

    constructor: function TaskQueueFactory(options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var taskQueue = this.options.taskQueue || {};
      if (!(taskQueue instanceof TaskQueue)) {
        var config = module.config();
        taskQueue = new TaskQueue(
          _.extend({}, taskQueue.options, config.options)
        );
      }
      this.property = taskQueue;
    }
  });
  return TaskQueueFactory;
});
