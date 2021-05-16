/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base', 'i18n',
  'csui/controls/toolbar/toolitem.view',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.state.behavior',
  'csui/utils/commandhelper', 'csui/utils/commands',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/utils/high.contrast/detector!',
  'hbs!csui/controls/tableactionbar/impl/tableactionbar',
  'hbs!csui/controls/tableactionbar/impl/lazy.loading.template',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/themes/carbonfiber/svg_sprites/symbol/sprite',
  'css!csui/controls/tableactionbar/impl/tableactionbar'
], function (module, _, $, Backbone, Marionette, log, base, i18n,
    ToolItemView, NodeCollection,
    FilteredToolItemsCollection, ToolbarStateBehavior, CommandHelper,
    commands, DropdownMenuBehavior, highContrast, template, lazyLoadingTemplate,
    PerfectScrollingBehavior,
    carbonfiberSprite) {
  'use strict';

  log = log(module.id);

  var TableActionBarView = Marionette.CompositeView.extend({
        className: "csui-table-actionbar",

        template: template,

        childView: ToolItemView,

        childViewOptions: function (model) {
          return {
            model: model,
            command: this.commands &&
                     this.commands.findWhere({signature: model.get('signature')}),
            useIconsForDarkBackground: this._useIconsForDarkBackground
          };
        },

        childViewContainer: "ul",

        behaviors: {
          ToolbarState: {
            behaviorClass: ToolbarStateBehavior
          },
          DropdownMenuBehavior: {
            behaviorClass: DropdownMenuBehavior,
            dropdownSelector: 'li.binf-dropdown',
            refilterOnShow: false
          }
        },

        constructor: function TableActionBarView(options) {
          this.container = options.container;
          this.containerCollection = options.containerCollection;
          this.originatingView = options.originatingView;
          this.commandExecutionOptions = options.commandExecutionOptions;
          this.minimalItemsRequiredForDisplay = 1;  // not showing inline action bar if less items. do not increase this recklessly, some have only one item and want to see it.
          this._useIconsForDarkBackground = options.useIconsForDarkBackground || highContrast === 1;
          this.notOccupiedSpace = options.notOccupiedSpace === undefined ?
                                  150 : options.notOccupiedSpace;

          options.status || (options.status = {});
          var status = _.defaults(options.status, {
            nodes: new NodeCollection([options.model]),
            container: this.container,
            context: this.originatingView.context // todo get context from creating view
          });

          this.commands = options.commands || commands;
          options.collection = new FilteredToolItemsCollection(
              options.collection, {
                status: status,
                commands: this.commands,
                delayedActions: options.delayedActions,
                mask: options.toolItemsMask
              });

          Marionette.CompositeView.prototype.constructor.apply(this, arguments);

          if (this.model.nonPromotedActionCommands && this.model.nonPromotedActionCommands.length &&
              options.collection.length === 0) {		  
            this.actionState.set('state', 'loading');
          }

          if (options.el) {
            $(options.el).addClass(_.result(this, "className"));
          }
        },

        isEmpty: function (options) {
          return this.collection.length === 0;			
        },

        onBeforeDestroy: function () {
          this.originatingView = null;
          this.collection.stopListening();
        },

        onBeforeRenderCollection: function () {
          this.destroyChildren();
          if (this.$childViewContainer) {
            this.$childViewContainer.empty();
          }
        },

        onRenderCollection: function () {
          this._adjusted = false;
          if (base.isVisibleInWindowViewport(this.$el)) {
            this._layoutButtons();
          }
        },

        onRender: function () {
          if (this.options.inlineBarStyle) {
            this.$el.addClass(this.options.inlineBarStyle);
          }
          if (this._isBlocked) {
            this.$el.addClass('binf-disabled');
          }
        },

        onShow: function () {
          this._layoutButtons();
        },

        toggleDropdownMenu: function (open) {
          var dropdown = this.$el.find('li.binf-dropdown'),
              dropdownToggler = this.$el.find('li.binf-dropdown > a.binf-dropdown-toggle');
          if (open || !dropdown.hasClass('binf-open')) {
            dropdownToggler.trigger('binf.dropdown.before.show');
            dropdown.addClass('binf-open');
            dropdownToggler.attr('aria-expanded', 'true');
            dropdownToggler.trigger('binf.dropdown.after.show');
          } else {
            dropdown.removeClass('binf-open');
            dropdownToggler.attr('aria-expanded', 'false');
          }
        },

        closeDropdownMenuIfOpen: function () {
          var dropdown = this.$el.find('li.binf-dropdown');
          if (dropdown.hasClass('binf-open')) {
            dropdown.removeClass('binf-open');
            this.$el.find('li.binf-dropdown > a.binf-dropdown-toggle').attr('aria-expanded', 'false');
            return true;
          }
          return false;
        },

        _layoutButtons: function () {
          var delayedActions = this.options.delayedActions;
          if (delayedActions && (delayedActions.fetching ||
                                 delayedActions.error)) {
            return;
          }

          if (this._adjusted) {
            return true;
          }

          this._adjusting = true;

          var node = this.model,
              lazyActionsRetrieved = !!node && !!node.get('csuiLazyActionsRetrieved'),
              isLocallyCreatedNode = !!node.isLocallyCreated,
              itemViews = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop
          itemViews = itemViews.filter(function (view) {
            return view instanceof ToolItemView;
          }); //filters toolItemViews
          this.actionbarOptions = {
            toolItemCounter: 0,
            cntItemsFit: 0,
            index: 0,
            dropDownMenuEl: undefined,
            separatorView: undefined
          };
          this.enabledNonPomotedCommands = node.collection.enableNonPromotedCommands === false ?
                                           node.collection.enableNonPromotedCommands : true;

          var maxItemsShown = this.options.maxItemsShown;
          if (itemViews.length > 0) {		  
            var containerEl = this.$el.parent();
            containerEl = containerEl.offsetParent();
            if (containerEl.length > 0) {
              var availableWidth = containerEl[0].clientWidth - this.notOccupiedSpace;
              if (availableWidth < 0) {
                maxItemsShown = 0;  // not enough space to show inline action bar
              } else {
				var toolItemsParent$El = this.$el.find('>ul');
				if (toolItemsParent$El.length > 0) {
				  var fontSize = 13; // TODO also defined in table.view.js, get from common place.
				  var averageIconWidth = TableActionBarView.estimateIconWidth(fontSize);
				  maxItemsShown = Math.round(availableWidth / averageIconWidth);
				  if (maxItemsShown>itemViews.length) {
					maxItemsShown = itemViews.length;
				  }
				}
              }
            }
            if (maxItemsShown > this.options.maxItemsShown) {
              maxItemsShown = this.options.maxItemsShown;
            }
            if (maxItemsShown < this.minimalItemsRequiredForDisplay) {
              this.destroy(); // not enough items...
              return;
            }
            _.each(itemViews, _.bind(function (toolItemView, index) {
              this.actionbarOptions.index = index;
              this._wrapToolItemView(toolItemView, maxItemsShown);
            }, this));

            if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands &&
                this.enabledNonPomotedCommands &&
                node.nonPromotedActionCommands.length && !isLocallyCreatedNode) { // append loading
              if (this.$childViewContainer.find('.binf-dropdown').length) {
                this.$childViewContainer.find('.binf-dropdown ul').append(lazyLoadingTemplate);
              } else {
                if (this.actionbarOptions.toolItemCounter === maxItemsShown) {
                  if (this.$childViewContainer.find('li:last').length > 0) {
                    this.$childViewContainer.find('li:last').addClass('csui-actionbar-hide-child');
                  }
                }
                this.$childViewContainer.append(lazyLoadingTemplate);
                this._renderLazyActions(maxItemsShown).always(_.bind(function () {
                  this._checkInlineActionBarShouldAlive();
                }, this));
              }
            } else {
              this._checkInlineActionBarShouldAlive();
            }

          } else {
            if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands &&
                node.nonPromotedActionCommands.length && !isLocallyCreatedNode &&
                this.enabledNonPomotedCommands) {
              this._renderLazyActions(maxItemsShown).always(_.bind(function () {
                this._checkInlineActionBarShouldAlive();
              }, this));
            } else {
              this._checkInlineActionBarShouldAlive();

            }
          }

          this._adjusting = false;
          this._adjusted = true;
        },

        _checkInlineActionBarShouldAlive: function () {
          if (this.actionbarOptions.cntItemsFit < this.minimalItemsRequiredForDisplay &&
              this.options.maxItemsShown !== 1) {
            this.destroy();
          }
        },

        _wrapToolItemView: function (toolItemView, maxItemsShown) {
          if (!(toolItemView instanceof ToolItemView)) {
            return;
          }
          var isSeparator = toolItemView.model.isSeparator();
          if (!isSeparator) {
            this.actionbarOptions.toolItemCounter++;
          }
          if (this.actionbarOptions.dropDownMenuEl) {
            if (!(isSeparator && this.actionbarOptions.index + 1 === this.children.length)) {
              toolItemView.renderTextOnly();
              toolItemView.$el.attr('role', 'menuitem');
              this.actionbarOptions.dropDownMenuEl.append(toolItemView.$el);
              toolItemView.triggerMethod('dom:refresh');
              if (this.usePerfectScrollbar()) {
                this.actionbarOptions.dropDownMenuEl.perfectScrollbar('update');
              }
            }
          } else {
            if (isSeparator) {
              this.actionbarOptions.separatorView = toolItemView;
            } else {
              if (this.actionbarOptions.toolItemCounter > maxItemsShown) {
                if (this.actionbarOptions.prevToolItemView) {
                  this.actionbarOptions.prevToolItemView.$el.attr('role', 'menuitem');
                  this.actionbarOptions.dropDownMenuEl = this._wrapWithDropDown(
                      this.actionbarOptions.prevToolItemView, toolItemView,
                      this.actionbarOptions.separatorView);
                } else {
                  this.actionbarOptions.dropDownMenuEl = this._wrapWithDropDown(
                      toolItemView.$el, toolItemView);
                }
              } else {
                this.actionbarOptions.cntItemsFit++;
              }
              this.actionbarOptions.prevToolItemView = toolItemView;
            }
          }
        },

        _renderLazyActions: function (maxItemsShown) {
          var self = this,
              node = this.model,
              derferred = $.Deferred();
          !!node && node.setEnabledLazyActionCommands(true).done(_.bind(function () {

            var newCollection = new FilteredToolItemsCollection(
                self.options.collection.unfilteredModels, {
                  status: self.options.status,
                  commands: self.commands,
                  delayedActions: self.model.delayedActions,
                  mask: self.options.toolItemsMask
                });
            var blockingEle = self.$childViewContainer.find('.csui-loading-parent-wrapper');
            if (blockingEle.length) {
              blockingEle.animate("width: 0", 300, function () {
                self.$childViewContainer.find('.csui-actionbar-hide-child').removeClass(
                    'csui-actionbar-hide-child');
                blockingEle.addClass('binf-hidden');
                if (self.collection.models.length !== newCollection.models.length) {
                  _.filter(newCollection.models, function (model) {
                    if (self.isDestroyed === true || self._isDestroyed) {
                      self.children = undefined;
                    } else {
                      var signature = model.get("signature");
                      if (!self.collection.find({signature: signature})) {
                        self.actionbarOptions.index++;
                        var lazyToolItemView = self.addChild(model, ToolItemView,
                            self.actionbarOptions.index);
                        self._wrapToolItemView(lazyToolItemView, maxItemsShown);
                      }
                    }
                  });
                }
                derferred.resolve();
              });
            } else {
              if (self.isDestroyed === true || self._isDestroyed) {
                self.children = undefined;
              } else {
                self.collection.refilter();
              }
              derferred.resolve();
            }

          }), self).fail(function () {
            self.$childViewContainer.find('.csui-loading-parent-wrapper').remove();
            self.$childViewContainer.find('.csui-actionbar-hide-child').removeClass(
                'csui-actionbar-hide-child');
            derferred.reject();
          });
          return derferred.promise();
        },

        _wrapWithDropDown: function (prevToolItemView, toolItemView, separatorView, maxItemsShown) {
          prevToolItemView.renderTextOnly();
          prevToolItemView.$el.wrap('<li class="binf-dropdown"><ul class="binf-dropdown-menu"' +
                                    ' role="menu"></ul></li>');
          var e = this._makeDropDown();
          this.$el.find('li.binf-dropdown').prepend(e);
          var dropdownToggler = this.$el.find('li.binf-dropdown > a.binf-dropdown-toggle');
          dropdownToggler.binf_dropdown();
          dropdownToggler.on('binf.dropdown.before.show', _.bind(function () {
            $(this.nextElementSibling).addClass('binf-invisible');
            var node = this.model,
                lazyActionsRetrieved = !!node.get('csuiLazyActionsRetrieved'),
                isLocallyCreatedNode = !!node.isLocallyCreated;

            if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands &&
                node.nonPromotedActionCommands.length && !isLocallyCreatedNode &&
                this.enabledNonPomotedCommands) {
              this._renderLazyActions(maxItemsShown);
            }
            base.alignDropDownMenu({targetEl: dropdownToggler});
          }, this));

          var $inlineActionBarView = toolItemView._parent;

          $inlineActionBarView.listenTo($inlineActionBarView, 'destroy', function () {
            $(".csui-zero-zindex").removeClass("csui-zero-zindex");
          });

          var that = this;

          dropdownToggler.on('binf.dropdown.after.show', function () {
            var scrollSelector = $(this).closest('.csui-perfect-scrolling').length > 0 ?
                                 '.csui-perfect-scrolling' : '.csui-normal-scrolling'; //.csui-normal-scrolling for touch devices (MS Surface)
            var el = $(this).closest(scrollSelector);
            var $dropdown = $(this).nextAll('.binf-dropdown-menu');
            var css = {};
            if ($dropdown.is('.binf-dropdown-align-left-top, .binf-dropdown-align-right-top')) { //dropup, added by base.autoAlignDropDowns
              css.maxHeight = Math.floor(window.innerHeight -
                              (window.innerHeight -
                              $dropdown.closest('.binf-dropdown')[0].getBoundingClientRect().top)) -
                              3;
              if (!!that.model.get('csuiDelayedActionsRetrieved') &&
                  !that.model.get('csuiLazyActionsRetrieved') && that.model.nonPromotedActionCommands &&
                  that.model.nonPromotedActionCommands.length && that.enabledNonPomotedCommands) {
                var dropdownEle = $dropdown.closest('.binf-dropdown'),
                    blockingEle = $(dropdownEle).find('.csui-loading-parent-wrapper');
                blockingEle.length && blockingEle.remove(); //Remove existing loading icons from
                dropdownEle.addClass('csui-actionbar-hide-child');
                $dropdown.closest('.csui-table-actionbar .binf-nav').append(lazyLoadingTemplate);
              }
              if ($dropdown.closest('.cs-perspective-panel').length) {
                $("#breadcrumb-wrap , .csui-search-tool-container, .csui-navbar.binf-navbar.binf-navbar-default").addClass(
                    "csui-zero-zindex");
              }
            } else {
              css.maxHeight = Math.floor(
                              window.innerHeight -
                              $dropdown.closest('.binf-dropdown')[0].getBoundingClientRect().top) -
                              $dropdown.closest('.binf-dropdown').height() - 3;
              if ($dropdown.closest('.cs-perspective-panel').length) {
                $("#breadcrumb-wrap , .csui-search-tool-container, .csui-navbar.binf-navbar.binf-navbar-default").removeClass(
                    "csui-zero-zindex");
              }
            }

            $dropdown.css(css);

            var $scrollParent;
            if (that.usePerfectScrollbar()) {
              $dropdown.addClass('csui-perfect-scrolling');
              $dropdown.perfectScrollbar({
                suppressScrollX: true,
                includePadding: true
              });
              $scrollParent = $dropdown.closest('.binf-dropdown').closest(
                  '.csui-perfect-scrolling.ps-container');
            } else {
              $scrollParent = $dropdown.closest('.binf-dropdown').scrollParent();
            }
            setTimeout(function () {
              $scrollParent.on('scroll.csui.inline.actions', function (event) {
                !$dropdown.is(':hidden') && $dropdown.binf_dropdown('toggle');
                $(event.target).off('scroll.csui.inline.actions');
              });
            });
          });

          var dropDownMenuEl = this.$el.find('li.binf-dropdown>ul.binf-dropdown-menu');

          if (separatorView) {
            separatorView.renderTextOnly();
            dropDownMenuEl.append(separatorView.$el);
          }

          toolItemView.renderTextOnly();
          toolItemView.$el.attr('role', 'menuitem');
          dropDownMenuEl.append(toolItemView.$el);  // move current toolitem into dropdown
          toolItemView.triggerMethod('dom:refresh');
          this.triggerMethod('refresh:dropdown');
          return dropDownMenuEl;
        },

        _makeDropDown: function () {
          var e = '<a role="button" href="#" tabindex="-1" class="binf-dropdown-toggle" data-binf-toggle="dropdown"' +
                  ' aria-expanded="false"';
          if (this.options.dropDownText) {
            e += ' title="' + this.options.dropDownText + '" aria-label="' + this.options.dropDownText +
                 '">';
          } else {
            e += '>';
          }
          if (this.options.dropDownSvgId) {
            var svgId = this.options.dropDownSvgId;
            var spritePath = '';
            if (svgId.indexOf('#') < 0) {
              spritePath = carbonfiberSprite.getSpritePath();
            }
            var url;
            if (this._useIconsForDarkBackground) {
              url = spritePath + '#' + svgId + '.dark';
            } else {
              url = spritePath + '#' + svgId;
            }

            e += '<svg class="csui-svg-icon csui-svg-icon-normal" focusable="false"><use xlink:href="' +
                 url +
                 '"></use></svg><svg class="csui-svg-icon csui-svg-icon-hover" focusable="false"><use xlink:href="' +
                 url +
                 '.hover"></use></svg><svg class="csui-svg-icon csui-svg-icon-active" focusable="false"><use xlink:href="' +
                 url + '.active"></use></svg>';
          } else {
            if (this.options.dropDownIcon) {
              e += '<span class="' + this.options.dropDownIcon + '"></span>';
            } else {
              if (this.options.dropDownText) {
                e += this.options.dropDownText;
              }
            }
          }
          e += "</a>";
          return e;
        },

        _setBlocked: function (command, toolItemView) {
          var self = this;
          this._blockedTimer = setTimeout(function () {
            if (self._isBlocked === false) {
              self.$el.removeClass('binf-disabled');
            }
            self._blockedTimer = undefined;
          }, 500);
          this._isBlocked = true;
          command.get('selfBlockOnly') ? toolItemView.$el.find('a').addClass('binf-disabled') :
          this.$el.addClass('binf-disabled');
        },

        _setUnblocked: function (command, toolItemView) {
          this._isBlocked = false;
          if (!this._blockedTimer) {
            command.get('selfBlockOnly') ? toolItemView.$el.find('a').removeClass('binf-disabled') :
            this.$el.removeClass('binf-disabled');
          }
        },
        onChildviewToolitemAction: function (toolItemView, args) {
          var self = this;
          var toolItem = args.toolItem;
          var signature = toolItem.get("signature");
          var command = this.commands.get(signature);
          var status = _.defaults(this.options.status, {
            nodes: new NodeCollection([this.model]),
            container: this.container,
            originatingView: this.originatingView,
            context: this.originatingView.context // todo get context from creating view
          });
          status.collection = this.containerCollection;
          status = _.defaults({
            toolItem: toolItem,
            data: toolItem.get('commandData') || {}
          }, status);
          var eventArgs = {
            status: status,
            commandSignature: signature
          };

          if (toolItem.get('execute') === false || !command.execute) {
            eventArgs.execute = false;
            eventArgs.toolItem = toolItem;
            this.trigger('before:execute:command', eventArgs);
            this.trigger('click:toolitem:action', eventArgs);
            return this.trigger('after:execute:command', eventArgs);
          }

          this.trigger('before:execute:command', eventArgs);

          this._setBlocked(command, toolItemView);
          Backbone.trigger('closeToggleAction');
          var promiseFromCommand;
          try {
            if (!command) {
              throw new Error('Command "' + signature + '" not found.');
            }
            promiseFromCommand = command.execute(status, this.commandExecutionOptions);
          } catch (error) {
            self._setUnblocked(command, toolItemView);
            log.warn('Executing the command "{0}" failed.\n{1}',
                command.get('signature'), error.message) && console.warn(log.last);
            eventArgs.error = error;
            return this.trigger('after:execute:command', eventArgs);
          }
          if (!promiseFromCommand) {
            self._setUnblocked(command, toolItemView);
            return this.trigger('after:execute:command', eventArgs);
          }

          CommandHelper
              .handleExecutionResults(promiseFromCommand, {
                command: command,
                suppressSuccessMessage: status.suppressSuccessMessage,
                suppressFailMessage: status.suppressFailMessage,
                customError: this.options.customError
              }).done(function (nodes) {
            if (!!command.allowCollectionRefetch &&
                self.options.originatingView.collection.totalCount >=
                self.options.originatingView.collection.topCount) {
              var collectionData = self.options.originatingView.collection;
              if (collectionData.skipCount !== 0 && collectionData.totalCount ===
                  collectionData.skipCount) {
                collectionData.setLimit(collectionData.skipCount - collectionData.topCount,
                    collectionData.topCount, false);
              }
              self.options.originatingView.collection.fetch();
            }
          })
              .always(function () {
                self._setUnblocked(command, toolItemView);
                self.trigger('after:execute:command', eventArgs);
              });
        },

        usePerfectScrollbar: function () {
          return PerfectScrollingBehavior.usePerfectScrollbar();
        }
      },
      {
        estimateWidthForToolbarItems: function (minNumberOfToolbarItems, fontSize) {
          var leftMargin = 0.1875 * fontSize;
          var rightMargin = leftMargin;
          var leftBorder = (fontSize * 4 - 36) / 2;
          var rightBorder = leftBorder;
          var iconMargin = 2;
          var width = leftBorder + leftMargin +
            minNumberOfToolbarItems * this.estimateIconWidth(fontSize) +
            (minNumberOfToolbarItems - 1) * iconMargin +
            rightMargin + rightBorder;
          return width;
        },

        estimateIconWidth: function(fontSize) {
          var iconWidth = fontSize * 2 + 4;
          var iconPadding = fontSize * 0.1;
          return (iconWidth + iconPadding);
        }
      });

  return TableActionBarView;
});
