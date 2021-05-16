/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/models/command',
  'csui/utils/commandhelper',
  'i18n!xecmpf/utils/commands/nls/localized.strings'
], function ($, _, CommandModel, CommandHelper, lang) {

  var SnapshotCommand = CommandModel.extend({

    defaults: {
      signature: 'Snapshot',
      name: lang.CommandSnapshot,
      scope: 'multiple',
      doneVerb: lang.CommandDoneVerbCreated
    },

    enabled: function (status) {
      return status && status.container && status.nodes && status.nodes.length > 0;
    },

    execute: function (status, options) {
      status.suppressSuccessMessage = true;
      status.suppressFailMessage = true;

      var deferred  = $.Deferred(),
          container = status.container;

      require(['csui/utils/url',
        'csui/utils/base',
        'csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/children',
        'csui/utils/contexts/factories/children2',
        'csui/controls/globalmessage/globalmessage',
        'csui/widgets/nodestable/nodestable.view',
        'csui/utils/contexts/factories/next.node',
        'csui/behaviors/default.action/default.action.behavior'
      ], function (Url, base, NodeModelFactory,
          ChildrenCollectionFactory, Children2CollectionFactory,
          GlobalMessage, NodesTableView, NextNodeModelFactory,
          DefaultActionBehavior) {
        var formData       = new FormData(),
            ids            = JSON.stringify(
                status.nodes.map(function (node) {
                  return node.get('id');
                })
            ).replace('[', '{').replace(']', '}'),
            isoDate        = base.formatISODateTime(new Date(new Date().getTime())),
            snapshotConfig = status.collection.options.data.snapshot || {},
            snapshotName   = status.collection.options.data.foldername || // for backwards-compatibility
                             snapshotConfig.folderNamePrefix || '';

        snapshotName = snapshotName.trim() + ' ' +
                       isoDate.substring(0, isoDate.indexOf('.')).replace(/T/g, ' ')
                           .replace(/:/g, '.');
        snapshotName = snapshotName.trim();

        formData.append('body', JSON.stringify(_.extend({}, { // not adding undefined properties
          snapshot_parent_name: snapshotConfig.parentFolderName,
          snapshot_name: snapshotName,
          bus_attach_ids: ids
        })));

        var createSnapshotUrl = Url.combine(
            container.connector.connection.url.replace('/v1', '/v2'),
            'nodes', container.get('id'), 'snapshots'),
            ajaxOptions = {
              type: 'POST',
              url: createSnapshotUrl,
              data: formData,
              contentType: false,
              processData: false
            };

        var context = status.context || options.context;
        var snapshotNode;

        container.connector.makeAjaxCall(ajaxOptions)
            .done(function (response, statusText, jqxhr) {
              if (NodesTableView.useV2RestApi) {
                ChildrenCollectionFactory = Children2CollectionFactory;
              }
              var currentNode = context.getModel(NodeModelFactory);
              var children = context.getCollection(ChildrenCollectionFactory);
              var snapshotParentId = Math.abs(response.results.data.parent_id);
              snapshotNode = context.getModel(NodeModelFactory, {
                connector: container.connector,
                attributes: { id: response.results.data.id }
              });
              var snapshotParentFolder;
              if ( response.results.parent ) {
                snapshotParentFolder = context.getModel(NodeModelFactory, {
                  connector: container.connector,
                  attributes: response.results.parent
                });
              }
              if (currentNode.get('id') === snapshotParentId) {
                updateChildrenCollection(children, snapshotNode);
              } else if ( snapshotParentFolder && currentNode.get('id') === Math.abs(snapshotParentFolder.get('parent_id')) ) {
                updateChildrenCollection(children, snapshotParentFolder);
              } else {
                currentNode = children.findWhere({id: snapshotParentId});
                if (currentNode) {
                  currentNode.fetch().always(function() {
                    showSuccessMessageWithLink();
                    deferred.resolve();
                  });
                } else {
                  showSuccessMessageWithLink();
                  deferred.resolve();
                }
              }
            })
            .fail(function (jqXHR, statusText, error) {
              var errmsg = jqXHR.responseJSON && (new base.Error(jqXHR.responseJSON)).error;
              GlobalMessage.showMessage('error', lang.snapshotFailed, errmsg);
              deferred.reject();
            });

        function updateChildrenCollection ( children, node ) {
          node.isLocallyCreated = true;
          node.fetch().always(function() {
            children.add(node, {at: 0});
            showSuccessMessageWithLink();
            deferred.resolve();
          });
        }

        function showSuccessMessageWithLink () {
          var msgOptions = {
            context: status.context,
            nextNodeModelFactory: NextNodeModelFactory,
            link_url: DefaultActionBehavior.getDefaultActionNodeUrl(snapshotNode),
            targetFolder: snapshotNode
          };
          var message = _.str.sformat(lang.snapshotCreatedWithName, snapshotName);
          GlobalMessage.showMessage('success_with_link', message, undefined, msgOptions);
        }
      });
      return deferred.promise();
    }
  });

  return SnapshotCommand;
});
