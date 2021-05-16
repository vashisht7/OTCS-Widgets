/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/application.scope.factory',
  'workflow/models/workitem/workitem.model.factory'
], function (PerspectiveRouter, ApplicationScopeModelFactory,
    WorkItemModelFactory) {
  'use strict';

  var WorkflowPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'processes/:process_id/:subprocess_id/:task_id': 'openProcess',
      'draftprocesses/:draftprocess_id': 'openDraftProcess',
      'docworkflows/:doc_id/:parent_id': 'openDocumentProcess',
      'docworkflows/:doc_id/:parent_id/draftprocesses/:draftprocess_id': 'openDocumentDraftProcess'
    },

    constructor: function WorkflowPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.workItem = this.context.getModel(WorkItemModelFactory);
      this.listenTo(this.workItem, 'change:process_id', this._updateUrl);
      this.listenTo(this.workItem, 'change:doc_id', this._updateUrl);
    },
    openProcess: function (process_id, subprocess_id, task_id) {
      this.workItem.set({
        process_id: parseInt(process_id),
        subprocess_id: parseInt(subprocess_id),
        task_id: parseInt(task_id),
        isDraft: false,
        url_org: this.validateURL(this._getUrl())
      });
    },
    openDraftProcess: function (draftprocess_id) {
      this.workItem.set({
        process_id: parseInt(draftprocess_id),
        isDraft: true,
        url_org: this.validateURL(this._getUrl())
      });
    },
    openDocumentProcess: function (doc_id, parent_id) {

      var defaults = this.workItem.defaults;
      this.workItem.reset({silent: true});
      this.workItem.set(defaults, {silent: true});
      this.workItem.set({
        parent_id: parseInt(parent_id),
        isDoc: true,
        doc_id: doc_id,
        url_org: this.validateURL(this._getUrl())
      });
    },
    openDocumentDraftProcess: function (doc_id, parent_id, draftprocess_id) {
      this.workItem.set({
        parent_id: parseInt(parent_id),
        draft_id: parseInt(draftprocess_id),
        isDocDraft: true,
        doc_id: doc_id,
        url_org: this.validateURL(this._getUrl())
      });
    },

    onOtherRoute: function () {
      this.workItem.reset({silent: true});
    },

    _getUrl: function () {
      var vars = {};
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
          function (m, key, value) {
            vars[key] = value;
          });
      var originIndex = vars["origin_index"],
          nextUrl     = vars["nexturl"],
          base_url    = this.workItem.connector.connection.url.replace("/api/v1", ""),
          strURLArray = ["func=Personal.Assignments", "func=work.Workflows&tabname=Assignments"];
      if (originIndex >= 0 && originIndex <= strURLArray.length - 1) {
        return base_url + "?" + strURLArray[originIndex];
      } else if (nextUrl) {
        return decodeURIComponent(nextUrl);
      } else if (document.referrer) {
        var referrer = document.referrer;
        if ((referrer.indexOf("/app/") >= 0) || (referrer.indexOf("?func") >= 0)) {
          return document.referrer;
        }
        else {
          return "";
        }
      }
      else {
        return "";
      }
    },
    _updateUrl: function () {
      var process_id    = this.workItem.get('process_id'),
          subprocess_id = this.workItem.get('subprocess_id'),
          task_id       = this.workItem.get('task_id'),
          isDraft       = this.workItem.get('isDraft'),
          isDocDraft    = this.workItem.get('isDocDraft'),
          isDoc         = this.workItem.get('isDoc'),
          mapsList      = this.workItem.get('mapsList'),
          doc_id        = this.workItem.get('doc_id'),
          parent_id     = this.workItem.get('parent_id'),
          draftId       = this.workItem.get('draft_id');

      if (!!process_id && !!doc_id) {
        return;
      }
      if (!(doc_id || process_id) && this.applicationScope.id !== 'workflow') {
        return;
      }

      var url = 'processes';

      if (isDraft) {
        url = 'draftprocesses';
        if (process_id) {
          url += '/' + process_id;
        }
      } else if (isDocDraft || (mapsList && mapsList.length === 1)) {
        url = 'docworkflows';
        if (doc_id && parent_id && draftId) {
          url += '/' + doc_id + '/' + parent_id + '/' + 'draftprocesses' + '/' +
                 draftId;
        }
      } else if (isDoc) {
        url = 'docworkflows';
        if (doc_id && parent_id) {
          url += '/' + doc_id + '/' + parent_id;
        }
      } else {
        url = 'processes';
        if (process_id) {
          url += '/' + process_id + '/' + subprocess_id + '/' + task_id;
        }
      }
      this._routeWithSlashes = false;
      this.navigate(url);
    },

    validateURL: function (surl) {
      var url = this.parseURL(surl);
      var urlHostname = url.hostname.trim();

      if (urlHostname === '') {
        return surl;
      }
      else {
        if (urlHostname.toUpperCase() === location.hostname.trim().toUpperCase()) {
          return surl;
        }
        else
        {
          return "";
        }
      }
    } ,

    parseURL: function(url) {

      var a =document.createElement('a');
      a.href = url;

      return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        hostname: a.hostname,
        host: a.host,
        port: a.port,
        query: a.search,
        params: (function () {
          var ret = {},
              seg = a.search.replace(/^\?/, '').split('&'),
              len = seg.length, i = 0, s;
          for (; i < len; i++) {
            if (!seg[i]) { continue; }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
          }
          return ret;
        })(),

        hash: a.hash.replace('#', ''),

        segments: a.pathname.replace(/^\//, '').split('/')
      };
    }

  });

  return WorkflowPerspectiveRouter;

});
