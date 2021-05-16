/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/command.error', 'csui/utils/commandhelper',
  'csui/models/command', 'csui/models/nodes'
], function (module, require, _, $, Backbone, Marionette,
    CommandError, CommandHelper, CommandModel, NodeCollection, MetadataFactory) {
  'use strict';

  var PropertiesCommand = CommandModel.extend({

    defaults: {
      signature: 'Properties',
      command_key: ['properties', 'Properties'],
      openable: true,
      scope: 'multiple',
      commands: 'csui/utils/commands'
    },

    _executeWithSaveState: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/utils/contexts/factories/metadata.factory'
      ], function (MetadataFactory) {
        var context         = status.context || options && options.context,
            metadataModel = context.getModel(MetadataFactory),
            node            = CommandHelper.getJustOneNode(status) || (status.nodes && status.nodes.at(0)),
            container = status.container,
            selected = status.nodes,
            navigationView = true,
            nodes;
            
        if (selected && selected.first() === container) {
          navigationView = false;
        } else {
          nodes = this._getAtLeastOneNode(status);
        }

        metadataModel.set('metadata_info', {
              id: node.get('id'),
              model: node,
              navigator: navigationView,
              collection: nodes,
              selectedTab: status.selectedTab,
              selectedProperty: status.selectedProperty,
              isThumbnailView: status.originatingView.thumbnailView
        });

        deferred.resolve();
      }.bind(this), function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _isInMetadataPerspective: function (context) {
      var deferred = $.Deferred();
      require(['csui/utils/contexts/factories/metadata.factory'
      ], function (MetadataFactory) {
        var metadataModel = context.getModel(MetadataFactory);
        var metadataInfo = metadataModel.get('metadata_info');
        if (metadataInfo && _.keys(metadataInfo).length > 0) {
          deferred.resolve();
        } else {
          deferred.reject();
        }
      }.bind(this), function (error) {
        deferred.reject(error);
      });
      return deferred.promise();

    },

    _executeWithoutSaveState: function (status, options) {
      var context = status.context || (options && options.context),
          self = this,
          deferred = $.Deferred(),
          selected = status.nodes,
          container = status.container,
          navigationView = true,
          nodes;

      if (selected && selected.first() === container) {
        selected = container;
        navigationView = false;
      } else {
        nodes = this._getAtLeastOneNode(status);
      }
      var originatingView = status.originatingView || (options && options.originatingView);

      require(['csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
        'csui/widgets/metadata/metadata.view', 'csui/controls/dialog/dialog.view',
        'csui/models/nodeversions', this.get('commands')
      ], function (MetadataNavigationWidget, MetadataView, DialogView,
          NodeVersionCollection, commands) {

        var metadata, showInDialogView = status.data && !!status.data.dialogView;
        if (navigationView) {
          if (status.collection && status.collection.models &&
              status.collection.models.length > 0) {
            metadata = new MetadataNavigationWidget({
              container: container,
              containerCollection: status.collection,  // this is the full collection
              collection: nodes,  // as UX design, this collection can be a subset
              selected: selected,
              originatingView: originatingView,
              context: context,
              commands: commands,
              nameAttribute: options ? options.nameAttribute : undefined,
              showCloseIcon: originatingView ? false : true,
              selectedTab: status.selectedTab,
              selectedProperty: status.selectedProperty,
              showThumbnails: status.showThumbnails,
              disableViewState: true
            });
          } else {
            if (originatingView && originatingView.supportOriginatingView === undefined) {
              originatingView.supportOriginatingView = true;
            }
            metadata = new MetadataView({
              model: selected.get("id") ? selected : selected.models[0],
              originatingView: originatingView,
              targetView: originatingView,
              context: context,
              commands: commands,
              showCloseIcon: originatingView ? false : true,
              showBackIcon: originatingView ? true : false,
              selectedTab: status.selectedTab,
              selectedProperty: status.selectedProperty,
              disableViewState: true
            });
            if (originatingView) {
              originatingView.metadataView = metadata;
            }
          }
        } else {
          if (originatingView && originatingView.supportOriginatingView === undefined) {
            originatingView.supportOriginatingView = true;
          }
          metadata = new MetadataView({
            model: selected,
            originatingView: originatingView,
            targetView: originatingView,
            context: context,
            commands: commands,
            showCloseIcon: originatingView ? false : true,
            showBackIcon: originatingView ? true : false,
            selectedTab: status.selectedTab,
            selectedProperty: status.selectedProperty,
            disableViewState: true
          });
          if (originatingView) {
            originatingView.metadataView = metadata;
          }
        }

        if (originatingView instanceof MetadataNavigationWidget &&
            !(status.collection instanceof NodeVersionCollection)) {
          if (originatingView.mdv && originatingView.mdv.metadataTabView) {
            metadata = null;
            originatingView.showPermissionView = false;
            originatingView._showNode(selected.get("id") ? selected : selected.models[0]);
          }
        } // replace the originatingView with sliding left/right animation
        else if (originatingView && !showInDialogView) {
          originatingView.triggerMethod('metadata:created', metadata);
          var _showOriginatingView, $csProperties;
          var $originatingView = originatingView.$el;
          var ntWidthVal = $originatingView.width();
          var ntWidth = ntWidthVal + 'px';

          $originatingView.parent().append("<div class='cs-properties-wrapper'></div>");
          $originatingView.parent().addClass('csui-node-properties-wrapper');
          $csProperties = $($originatingView.parent().find('.cs-properties-wrapper')[0]);
          $csProperties.hide();

          metadata.render();
          Marionette.triggerMethodOn(metadata, 'before:show');
          $csProperties.append(metadata.el);

          $originatingView = $originatingView.parent().find(".cs-permissions-wrapper").length > 0 ?
                             $originatingView.parent().find(".cs-permissions-wrapper") :
                             $originatingView;

          $originatingView.hide('blind', {
            direction: 'left',
            complete: function () {
              $csProperties.show('blind',
                  {
                    direction: 'right',
                    complete: function () {
                      if (originatingView.permissionsView) {
                        $originatingView.parent().find(".cs-permissions-wrapper").remove();
                        originatingView.permissionsView &&
                        originatingView.permissionsView.destroy();
                      }
                      Marionette.triggerMethodOn(metadata, 'show');
                    }
                  },
                  100);
            }
          }, 100);

          $originatingView.promise().done(function () {
            originatingView.isDisplayed = false;
          });

          _showOriginatingView = function () {
            $csProperties.hide('blind', {
              direction: 'right',
              complete: function () {
                originatingView.$el.show('blind',
                    {
                      direction: 'left',
                      complete: function () {
                        originatingView.metadataView && originatingView.metadataView.destroy();
                        originatingView.permissionsView &&
                        originatingView.permissionsView.destroy();
                        originatingView.triggerMethod('dom:refresh');
                        originatingView.isDisplayed = true;
                        !!status.collection && (status.collection.requireSwitched = false);
                        originatingView.trigger('properties:view:destroyed');
                      }
                    },
                    100);
                $originatingView.parent().removeClass('csui-node-properties-wrapper');
                metadata.destroy();
                $csProperties.remove();
                deferred.resolve();
              }
            }, 100);
          };

          self.listenTo(metadata, 'metadata:close', _.bind(_showOriginatingView, self));
          self.listenTo(metadata, 'metadata:close:without:animation', function () {
            $originatingView.show('blind',
                {
                  direction: 'left',
                  complete: function () {
                    originatingView.triggerMethod('dom:refresh');
                    !!status.collection && (status.collection.requireSwitched = false);
                  }
                },
                100);
            metadata.destroy();
            $csProperties.remove();
            deferred.resolve();
          });

        } else {  // show Metadata View in a modal dialog

          self.dialog = new DialogView({
            className: 'cs-properties',
            largeSize: true,
            view: metadata
          });

          self.dialog.show();
          self.dialog.ui.header.hide();
          self.dialog.listenTo(metadata, 'metadata:close', function () {
            self.dialog.destroy();
          });

          self.dialog.listenTo(metadata, 'metadata:close:without:animation', function () {
            self.dialog.destroy();
          });

          self.dialog.listenTo(self.dialog, 'before:hide', function () {
            deferred.resolve();
          });

        }

      }, function (error) {
        deferred.reject(new CommandError(error));
      });

      return deferred.promise();
    },

    _isPermissionsView: function (view) {
      return view && view.permissionsView &&
             document.body.contains(view.permissionsView.el);
    },

    _isPermissionsExplorer: function(view) {
      return view.el && view.el.parentNode.classList.contains('cs-permissions-wrapper');
    },

    execute: function (status, options) {

      var context = status.context || (options && options.context);
      if (status.originatingView && context && context.viewStateModel &&
            context.viewStateModel.get('history') &&
            context.viewStateModel.get('enabled') &&
            /*!status.originatingView.thumbnailView &&*/
            !_.isUndefined(status.originatingView.enableMetadataPerspective) &&
            status.originatingView.enableMetadataPerspective &&
            !this._isPermissionsView(status.originatingView) &&
            !this._isPermissionsExplorer(status.originatingView)) {
        return this._executeWithSaveState(status, options);
      }

      return this._executeWithoutSaveState(status, options);
    },

    _getAtLeastOneNode: function (status) {
      var nodes = new NodeCollection();
      if (!status.nodes) {
        return nodes;
      }
      if (status.nodes.length === 1 && status.collection) {
        if (!status.collection.findWhere({id: status.nodes.models[0].get('id')})) {
          nodes.add(status.nodes.models[0]);
          nodes.add(status.collection.models);
          return nodes;
        } else {
          return status.collection;
        }
      } else {
        return status.nodes;
      }
    }
  });

  return PropertiesCommand;

});
