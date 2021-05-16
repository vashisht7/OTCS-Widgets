/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base', 'csui/utils/url',
  'csui/controls/form/form.view','csui/controls/globalmessage/globalmessage'
], function (_, $, base, Url, FormView, GlobalMessage) {

  function getSelectorPath(root,node) {
    var path;
    while (node.length) {
      if ($(node).is(root)) {
        return path ? '>' + path : '';
      }
      var realNode = node[0], name = realNode.localName;
      if (!name) { break; }
      name = name.toLowerCase();

      var parent = node.parent();

      var allSiblings = parent.children();
      var index = allSiblings.index(realNode) + 1;
      name += ':nth-child(' + index + ')';

      path = name + (path ? '>' + path : '');
      node = parent;
    }
    return root ? undefined : path;
  }

  function getFocusInfo(view) {
    var focusPath;
    var focused = view.$el.find(":focus");
    if (focused.length) {
      var control = focused;
      while (control && control.length && !control.attr("data-alpaca-field-id")) {
        control = control.parent();
      }
      if (control.length) {
        focusPath = getSelectorPath(view.$el,control)
      }
    }
    var scrolltop = view.$el.parent().parent().scrollTop();
    return {focused:focused,focusPath:focusPath,scrolltop:scrolltop};
  }

  function restoreFocus(view,focusInfo) {
    if (focusInfo.scrolltop>=0) {
      view.$el.parent().parent().scrollTop(focusInfo.scrolltop);
    }
    var focused = view.$el.find(":focus");
    if (!focused.is(focusInfo.focused)) {
      if (focusInfo.focusPath) {
        var control = view.$el.find(focusInfo.focusPath),
            tofocus = control.find(".alpaca-control .cs-field-read button");
        tofocus.click();
      }
    }
  }
  function CallOnCount(count,fct) {
    this.count = count;
    this.fct = fct;
    this.callback = function callback () {
      if (this.count>0) {
        this.count = this.count - 1;
        if (this.count===0) {
          this.fct.call();
        }
      }
    }
  }

  function makeCountCallback(count,fct) {
    var coc = new CallOnCount(count,function(){setTimeout(fct,0);});
    return _.bind(coc.callback,coc);
  }
  function adaptChildrenLength(el,val) {
    var ii;
    if (el.children && el.children.length) {
      if (val && val.length) {
        if (val.length>el.children.length) {
          for (ii = el.children.length; ii<val.length; ii++) {
            var data = val[ii];
            var options = _.extend({},el.children[0].options);
            var schema = _.extend({},el.children[0].schema);
            el.addItem(ii,schema,options,data,function(){});
          }
        } else if (val.length<el.children.length) {
          for (ii = el.children.length-1; ii >= val.length; ii--) {
            el.removeItem(ii,function(){});
          }
        }
      }
    }
  }
  function getRefreshFields(children,changes,path,iserror) {
    var fields = [];
    for (var ii=0; ii<children.length; ii++) {
      var el = children[ii];
      if (el.propertyId && changes.hasOwnProperty(el.propertyId)) {
        if (iserror ? el.path===path : el.path!==path) {
          fields.push(el);
        }
      } else if (el.children) {
        fields = fields.concat(getRefreshFields(el.children,changes,path,iserror));
      }
    }
    return fields;
  }
  function refreshFields(view,focus,changes,path,iserror) {
    var fields = getRefreshFields(view.form.children,changes,path,iserror);
    if (fields.length) {
      var callback = makeCountCallback(fields.length,function(){
        restoreFocus(view,focus);
      });
      fields.forEach(function(el){
        adaptChildrenLength(el,changes[el.propertyId]);
        el.setValue(changes[el.propertyId]);
        el.refresh(callback);
      });
    }
  }

  var SelectedMetadataFormView = FormView.extend({

    constructor: function SelectedMetadataFormView(options) {
      FormView.prototype.constructor.call(this, options);

      this.node = this.options.node;
      this.listenTo(this, 'change:field', function(args){
		  this._saveField(args);
	  });
    },

    _saveField: function (args) {
	  if(this._hasDependentFields(args)){
		this._saveDependentFields(args.fieldView);
	  }
	  else{
        var property = this.form.getControlByPath(args.path[0]==='/'?args.path.substring(1):args.path);
        this._saveChanges(property.propertyId,args.value,property.path,true);
	  }
    },
	_hasDependentFields: function(args){
	  if(typeof args.fieldView !== 'undefined'){
	    if(typeof args.fieldView.isTKLField !== 'undefined'){
		  if(args.fieldView.isTKLField){
			if(args.fieldView.children.length > 0){
			  return true;
			}
			else{
 			  return false;
			}
		  }
		  else{
			return false;
		  }
		}
		else{
	      return false;
		}
	  }
	  else{
		return false;
	  }
	},
	_saveDependentFields: function(fieldView){
	  this._saveChanges(fieldView.alpacaField.propertyId,fieldView.getEditValue(),fieldView.alpacaField.path,false);
	  if(fieldView.children.length>0){
	    for(var i=0;i<fieldView.children.length;i++){
		  this._saveDependentFields(fieldView.children[i])
	    }
	  }
	},
    _saveChanges: function (propertyId,value,path,isInSync) {
      var change = {},
          changes = {};
      var values = this.getValues();
      var segpath = path[0]==='/' ? path.substring(1) : path;
      var segments = segpath.split('/');
      for (var ii=0; ii<segments.length-1; ii++) {
        if (values) {
          values = values[segments[ii]];
        }
      }
      if (values) {
        _.each(values,function(val,id){
          if (id === propertyId) {
			change[id] = val;
            changes[id] = val;
          }
        },changes);
      }
	  if(propertyId.search("x") > 0){
		var temp={},
			parentPropertyId;
	    temp[propertyId] = changes[propertyId];
		delete changes[propertyId];
		delete change[propertyId];
		parentPropertyId = propertyId.substring( 0, propertyId.indexOf("x")-1 );
		changes[parentPropertyId] = [temp];
		change[parentPropertyId] = [temp];
	  }
      if (!this.node) {
        throw new Error('Missing node to save the categories to.');
      }
      if (this._validate(change)) {
        var focus = getFocusInfo(this);
        this._blockActions();
        return this.node.connector.makeAjaxCall(this.node.connector.extendAjaxOptions({
              type: 'PUT',
              url: Url.combine(this.node.urlBase(), 'categories', propertyId.split('_')[0]),
              data: changes,
			  async: isInSync
            }))
            .done(_.bind(function () {
              this.model.updateData(change);
              refreshFields(this,focus,change,path,false);
              this.trigger('forms:sync');
              var event = $.Event('tab:content:field:changed');
              this.$el.trigger(event);
            }, this))
            .fail(_.bind(function (jqxhr) {
              var restore = this.model.restoreData(change);
              refreshFields(this,focus,restore,path,true);
              var error = new base.Error(jqxhr);
              GlobalMessage.showMessage('error', error.message);
              this.trigger('forms:error');
            }, this))
            .always(_.bind(function () {
              this._unblockActions();
            }, this));
      }
      return $.Deferred().reject().promise();
    }
  });

  return SelectedMetadataFormView;
});
