/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/base',
  'csui/utils/log',
  'csui/utils/url',
  'csui/utils/base',
  'csui/utils/contexts/factories/node',
  'csui/controls/list/emptylist.view',
  'conws/controls/selectedmetadataform/selectedmetadataform.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/models/form',
  'csui/models/node/node.model',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/models/selectedmetadataform/selectedmetadataform.factory',
  'i18n!conws/widgets/metadata/impl/nls/metadata.lang',
  'hbs!conws/widgets/metadata/impl/metadata',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'css!conws/widgets/metadata/impl/metadata'
], function (require, _, $, Backbone, Marionette, Handlebars, WidgetContainerBehavior,
			 TabableRegionBehavior, base, log, Url, BaseUtils,
			 NodeModelFactory, EmptyListView, SelectedMetadataFormView, PerfectScrollingBehavior, FormModel, NodeModel,
			 WorkspaceContextFactory, SelectedMetadataFormFactory, lang, template, LayoutViewEventsPropagationMixin) {
  var MetadataView = Marionette.LayoutView.extend({
    className: 'conws-metadata',
    template: template,
    templateHelpers: function (data) {
      return {
		items: this._items,
        hideHeader: this.hideHeader,
        title: BaseUtils.getClosestLocalizedString(this.headerTitle, lang.defaultMetadataWidgetTitle),
        icon: this.headerIcon
      }
    },

    events: {"keydown .form-metadata": "onKeyInView"},

    behaviors: {
    	PerfectScrolling: {
    		behaviorClass: PerfectScrollingBehavior,
    		contentParent: '.tile-content',
    		suppressScrollX: true,
    		scrollYMarginOffset: 15
    	},
    	TabableRegion: {
    		behaviorClass: TabableRegionBehavior
    	}
    },


    onKeyInView: function (event) {
      var ActiveElementInView = document.activeElement,
          Tabable_Elements = this.currentlyFocusedElement(),
          Element_Index = 0;

      if( ActiveElementInView.children.length > 0 ){
        ActiveElementInView=ActiveElementInView.children[0];
      }

      if (event.keyCode === 9) {

        if (event.shiftKey) {

    	  for(Element_Index=0;Element_Index<Tabable_Elements.length;Element_Index++){

    	    if(ActiveElementInView === Tabable_Elements[Element_Index]){
    		  if(ActiveElementInView.classList.contains("esoc-user-mini-profile") || ActiveElementInView.classList.contains("reference-generate-number") || (ActiveElementInView.classList.contains("cs-field-read-content") && ActiveElementInView.classList.contains("placeholder")) || Element_Index-1 < 0){

    		    break;
    		  }
    		  else{
    			Tabable_Elements[Element_Index-1].focus();
    			break;
    		  }
    		}
    	  }
    	} else {

    		for(Element_Index=0;Element_Index<Tabable_Elements.length;Element_Index++){
    		  if(ActiveElementInView === Tabable_Elements[Element_Index] && Element_Index+1 < Tabable_Elements.length){

    		    if(ActiveElementInView.classList.contains("esoc-user-mini-profile") || ActiveElementInView.classList.contains("reference-generate-number") || (ActiveElementInView.classList.contains("cs-field-read-content") && ActiveElementInView.classList.contains("placeholder"))){

    			  break;
    			}
    			else{
    			  Tabable_Elements[Element_Index+1].focus();
    			  break;
    			}
    		  }				
    	    } 
    	  } 
      }
    },

    currentlyFocusedElement: function () {
    	var readonly    = !!this.$form && this.$form.find('.alpaca-readonly button'),
    	tabElements = this.$('button,*[data-cstabindex],*[tabindex]');
    	tabElements=this.remove_Elements(tabElements);
    	return tabElements;
    },

    remove_Elements: function (tabElements) {
    	var Class_List = ["alpaca-array-actionbar-action", "typeahead", "cs-icon", "binf-hidden", "csui-icon-edit", "csui-bulk-edit", "icon-date_picker"];

    	for( var Element_Index = 0 ; Element_Index < tabElements.length ; Element_Index++ ){

    		for( var Class_Index = 0 ; Class_Index < Class_List.length ; Class_Index++ ){

    			if(tabElements[Element_Index].classList.contains( Class_List[ Class_Index ] ) ){

    				tabElements.splice( Element_Index, 1 );
    				Class_Index = Class_List.length;
    				Element_Index = Element_Index - 1;
    			}
    		}
    	}
    	return tabElements;
    },
    constructor: function MetadataView(options) {
      options || (options = {});
      if (!options.context) {
        throw new Error('Context is missing in the constructor options');
      }

      _.defaults(options, {
        searchTabContentForTabableElements: true
      });

      this.hideHeader = options.data && options.data.hideHeader;
      this.headerTitle = options.data && options.data.title || lang.defaultMetadataWidgetTitle; // from perspective configuration
      this.headerIcon = options.data && options.data.icon || "category1";   // from perspective configuration

      this.noMetadataMessage = lang.noMetadataMessage;
      if(options.data && options.data.noMetadataMessage) {
        this.noMetadataMessage = base.getClosestLocalizedString(
            options.data.noMetadataMessage, this.noMetadataMessage);
      }
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(SelectedMetadataFormFactory);
      }
	  this.formViewList = [];
      options.model = options.workspaceContext.getObject(SelectedMetadataFormFactory, {
        metadataConfig: options.data,
        unique: true
      });
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.listenTo(options.model, 'change', this.render);

      this.propagateEventsToRegions();
	  if(typeof options.data === 'undefined'){
	    log.info("Metadata Not Set") && console.log(log.last);
	  }
	  else if(typeof options.data.metadataConfig === 'undefined'){
		this._setUpEmptyRegion();
      }
    },

	modelEvents: {
      change: 'modelChange'
    },
	
	modelChange: function () {
      this._setUpRegions();
      this._currentShortcutIndex = 0;
    },
	_setUpRegions: function () {
	  var self = this;
	  var reg;
	  self._items = [];
	  _.each(this.options.model.metadataConfig, function (config,index) {
        self._items[index] = {"index":index};
	    self.addRegion("Region" + index, ".form-metadata" + index);
		reg = "Region" + index;
		self.regions[reg] = $.extend({}, self[reg]);
	  },this);
    },
	_setUpEmptyRegion: function () {
	  var self = this;
	  var reg;
	  var index = 0;
	  self._items = [];
	  self._items[0] = {"index":0};
	  self.addRegion("Region" + 0, ".form-metadata" + 0);
	  reg = "Region" + 0;
	  self.regions[reg] = $.extend({}, self[reg]);
    },
    onRender: function () {
      if (!_.isEmpty(this.model.attributes.data)) {

		var attributeList = [];
		var attributeDetails = {data:{},options:{fields:{}},schema:{properties:{}}}
		attributeDetails.data = $.extend({}, this.model.attributes.data);
		attributeDetails.options.fields = $.extend({}, this.model.attributes.options.fields);
		attributeDetails.schema.properties = $.extend({}, this.model.attributes.schema.properties);

		_.each(this.options.model.metadataConfig, function (config,index) {
		  if(config.type === 'group'){
			attributeList[index]={data:{},options:{},schema:{}};
		    attributeList[index].data = $.extend({},this.model.attributes.data[config.label]);
		    attributeList[index].options = $.extend({},this.model.attributes.options.fields[config.label]);
		    attributeList[index].schema = $.extend({},this.model.attributes.schema.properties[config.label]);
		  }
		  else if(config.type === 'category'){
		    attributeList[index]={data:{},options:{fields:{}},schema:{properties:{}}};
			_.each(this.model.attributes.data, function (data,key){
			  if(key.search(config.categoryId) === 0){
			    attributeList[index].data[key] = this.model.attributes.data[key];
			    attributeList[index].options.fields[key] = this.model.attributes.options.fields[key];
			    attributeList[index].schema.properties[key] = this.model.attributes.schema.properties[key];
			  }
			},this);
		  }
		  else if(config.type === 'attribute'){
			var key = config.categoryId + "_" + config.attributeId
			if(typeof config.columnId !== 'undefined' && typeof config.rowId === 'undefined'){
			  key = key + "_1_" + config.columnId;
			}
			else if(typeof config.rowId !== 'undefined'){
			  key = key + "_x_" + config.columnId;
			}
			attributeList[index]={data:{},options:{fields:{}},schema:{properties:{}}};
			if(typeof this.model.attributes.data[key] !== 'undefined'){
		      attributeList[index].data[key] = this.model.attributes.data[key];
			  attributeList[index].options.fields[key] = this.model.attributes.options.fields[key];
			  attributeList[index].schema.properties[key] = this.model.attributes.schema.properties[key];
			}
		  }
		},this);

		var i = 0;
	    _.each(this.regions, function (region,index) {
		  this.model.attributes = attributeList[i];
		  this["formView"+i] = new SelectedMetadataFormView({model: this.model, context: this.options.context, node:this.model.node});
		  this.formViewList[i] = this["formView"+i]
		  this["formView"+i].metadataview = this;
          this[index].show(this["formView"+i]);
		  i++;
		},this);
		this.model.attributes = attributeDetails;

      } else {
		this.formView = new EmptyListView({text: this.noMetadataMessage});
		_.each(this.regions, function (region,index) {
		  this[index].show(this["formView"]);
		},this);
      }
    }
  });

  _.extend(MetadataView.prototype, LayoutViewEventsPropagationMixin);
  return MetadataView;
});
