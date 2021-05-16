/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jsonpath',
  'csui/lib/alpaca/js/alpaca', 'i18n!csui/controls/form/impl/nls/lang', 'csui/utils/base',
  'i18n'
], function (module, _, $, jsonpath, Alpaca, lang, base, i18n) {

  Alpaca.Fields.CsuiObjectField = Alpaca.Fields.ObjectField.extend({

    constructor: function CsuiObjectField(container, data, options, schema, view, connector,
        onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    postRender: function (callback) {
      this.base(callback);
      if (this.options && this.options.descriptionId) {
        var content = this.container.find('.cs-field-write-inner button:not(:disabled), ' +
                                          '.cs-field-write-inner input, ' +
                                          '.cs-field-write-inner textarea');
        content.attr('aria-describedby', this.options.descriptionId);
      }
      this.field.on('field:changed', _.bind(this._onFieldChanged, this));
    },
    _onFieldChanged: function (event) {
      if (!this.containerItemEl) {
        return;
      }
      var el = this.containerItemEl.parent();

      event.stopPropagation();

      var fieldId = event.fieldpath.split('/').pop();
      this.data[fieldId] = event.fieldvalue;
      var data = {
        fieldvalue: this.data,
        fieldid: this.name,
        fieldpath: this.path,
        targetfieldvalue: event.targetfieldvalue !== undefined ?
                          event.targetfieldvalue : event.fieldvalue,
        targetfieldid: event.targetfieldid ?
                       event.targetfieldid : event.fieldid,
        targetfieldpath: event.targetfieldpath ?
                         event.targetfieldpath : event.fieldpath
      };
      var newEvent = $.Event('field:changed');
      _.extend(newEvent, data);
      el.trigger(newEvent);
    },

    bindData: function () {
      return;
    },

    getFieldType: function () {
      return 'object';
    },

    showColout: function (e) {
      var popover = $(e.target).data('binf.popover');
      if (!!popover) {
        var targetElParent      = $(e.target).parents('.cs-form-set-container'),
            scrollableContainer = (targetElParent.closest('.ps-container').length > 0 ?
                                   targetElParent.closest('.ps-container') :
                                   targetElParent.closest('.csui-normal-scrolling'));
        e.preventDefault();
        $(e.target).binf_popover('destroy');
        if (base.isTouchBrowser()) {
          scrollableContainer.css({'-webkit-overflow-scrolling': 'touch'});
        }
      } else {
        var dataId     = e.target.getAttribute("data-csui-name"),
            rowIndex   = $(e.target).closest('.cs-array.alpaca-container-item').attr(
                'data-alpaca-container-item-index'),
            selectedId = e.data.data[dataId] ? dataId :
                         dataId.substr(0, dataId.lastIndexOf("_")),
            data       = $.extend(true, [], e.data.data[selectedId][rowIndex]),
            options    = $.extend(true, [], e.data.options.fields[selectedId].fields.item),
            schema     = $.extend(true, [], e.data.schema.properties[selectedId].items);
        e.target.setAttribute("data-csui-row-index", rowIndex);

        _.each(options.fields, function (item) {
          if (!item.readonly) {
            item.readonly = true;
          }
          if (item.isMultiFieldItem) {
            delete item['isMultiFieldItem'];
          }
        });
        _.each(schema.properties, function (item) {
          if (!item.readonly) {
            item.readonly = true;
          }
        });

        var coloutOptions = {
          targetEl: $(e.target),
          coloutContainer: $(e.target).parents(".cs-form-set-container"),
          formdata: data,
          formoptions: {"fields": options.fields},
          formschema: {"properties": schema.properties}
        };

        var coloutEve = $.Event('show:colout');
        _.extend(coloutEve, coloutOptions);
        e.data.domEl.trigger(coloutEve);
        return false;
      }

    },

    keyDown: function (e) {
      var self = e.data;
      if (e.keyCode === 13) {
        self.showColout(e);
        e.stopPropagation();
      }
      if (e.keyCode === 9) { // tab key
        e.preventDefault();
        $(e.target).binf_popover('destroy');
      }
    },

    restructureAllSetContainer: function (event) {
      var self  = event.data.self,
          that  = this,
          isSet = self.field.find('.csui-form-set-array-wrapper.cs-form-set').length >
                  0 ||
                  self.field.hasClass('csui-form-set-array-wrapper cs-form-set');
      self.eventType = event.type;
      if (isSet) {
        var domEl;
        if (self.field.hasClass('cs-form-set-container')) {
          domEl = self.field;
        } else if (self.field.find('.cs-form-set-container:not(.csui-multivalue-block )').length >
                   0) {
          domEl = self.field.find('.cs-form-set-container:not(.csui-multivalue-block )');
        }

        if (domEl && domEl.length === 1) {
          self.restructureSetContainer(domEl, self);
        }
        else if (domEl && domEl.length > 1) {
          domEl.each(function (setIndex, setEl) {
            self.restructureSetContainer(setEl, self);
          });
        }
      }
    },

    restructureSetContainer: function (setEl, self, addItemIndex) {
      var showScrollBar = false, setOptions;

      function checkPadding(setElement) {
        if (!paddingCheckInterval) {
          scrollDivPadding = isUpdateMode ?
                             $(setElement).find('.csui-lockedcols').width() :
                             $(setElement).find('.csui-lockedcols:first').width();
        }
        if (scrollDivPadding > 0) {
          if ($(setElement).parents(".csui-perfect-scrolling").length > 0) {
            addScrollBar();
          } else {
            $(setElement).addClass("csui-native-scrollbar");
          }
          if (!!paddingCheckInterval) {
            clearInterval(paddingCheckInterval);
          }
        } else {
          scrollDivPadding = isUpdateMode ?
                             $(setElement).find('.csui-lockedcols').width() :
                             $(setElement).find('.csui-lockedcols:first').width();
        }
      }

      function addScrollBar() {
        if (scrollDivPadding > 0) {
          metadataPropertiesPage && metadataPropertiesPage.find(
              '.csui-set-scroll-container-parent').each(function (index, el) {
            el = el instanceof $ ? el : $(el);
            if (el.css(paddingRTL) === '0px') {
              el.css(paddingRTL, el.parent().find('.csui-show-colout').css('display') === 'block' ?
                                 scrollDivPadding : scrollDivPadding - coloutWidth);

              var scrollablecolWidth,
                  scrollablecols = $(el.parent('.cs-form-set-container').find(
                      '.csui-scrollablecols')[0]).children();
              scrollChildDivWidth = 0;
              for (var i = 0; i < scrollablecols.length; i++) {
                scrollablecolWidth = $($(el.parent('.cs-form-set-container').find(
                    '.csui-scrollablecols')[0]).children()[i]).width();
                scrollChildDivWidth += scrollablecolWidth;
              }
              el.find(
                  '.csui-scrollable-content').css('width', scrollChildDivWidth);
              if (!el.find('.csui-set-scroll-container-child').hasClass('ps-container')) {
                el.find(
                    '.csui-set-scroll-container-child').perfectScrollbar(
                    {suppressScrollY: true});
                el.find(
                    '.csui-set-scroll-container-child').perfectScrollbar('update');
              }

              el.closest('.cs-form-set-container').find('.csui-scrollablecols').prop('scrollLeft',
                  el.find('.ps-container').scrollLeft());
              el.find('.csui-set-scroll-container-child').on('scroll', function () {
                $(this).parents('.cs-form-set-container').children().find(
                    ".csui-scrollablecols").prop(
                    "scrollLeft", ($(this).scrollLeft())
                );
                var scrollEl = $(this).parents(".cs-form-set-container").find
                (".ps-container.ps-active-x");
                var newEvent = $.Event('set:scrolled');
                scrollEl.trigger(newEvent);
              });
            }
          });
        }
      }

      function hidePopover() {
        $('.csui-colout-icon').each(function () {
          if ($(this).data('binf.popover')) {
            $(this).binf_popover('destroy');
          }
        });
      }

      function getSetOptions(fields, uniqueId) {
        _.each(fields, function (value, id) {
          if (!setOptions) {
            if (id === uniqueId) {
              setOptions = value;
            } else if (value instanceof Object) {
              if (value.fields && value.fields.item && value.fields.item.fields) {
                getSetOptions(value.fields.item.fields, uniqueId);
              } else {
                getSetOptions(value, uniqueId);
              }
            }
          }
        });
      }

      $(setEl).find('.alpaca-container-item-last .csui-scrollablecols').perfectScrollbar("update");

      var extraWidth = 0;
      var setElForm = $(setEl).closest('.binf-tab-content .cs-form').length > 0 ?
                      $(setEl).closest('.binf-tab-content .cs-form') :
                      ($(setEl).closest('.cs-form.cs-form-update') !== undefined) &&
                      ($(setEl).closest('.cs-form.cs-form-update').length > 0) ?
                      $(setEl).closest('.cs-form.cs-form-update') :
                      $(setEl).closest('.cs-form.cs-form-create');
      if ((setElForm !== undefined) && (setElForm.length > 0)) {
        var setElFormParent = setElForm.parent();
        if ((setElFormParent !== undefined) && (setElFormParent.length > 0)) {
          var rightPadding = setElFormParent.css('padding-right');
          var rightPaddingWidth = parseInt(rightPadding !== undefined ? rightPadding : 0);
          var leftPadding = setElFormParent.css('padding-left');
          var leftPaddingWidth = parseInt(leftPadding !== undefined ? leftPadding : 0);
          extraWidth = rightPaddingWidth + leftPaddingWidth + 30;
        }
      }

      var shadowRightContainer = $('<div/>', {
        class: 'csui-shadowright-container'
      });
      var shadowLeftContainer = $('<div/>', {
        class: 'csui-shadowleft-container'
      });
      var setUniqueId = $(setEl).attr("data-alpaca-container-item-name");
      getSetOptions(self.options.fields, setUniqueId);
      var rows_to_display  = setOptions && setOptions.rows_to_display,
          showExpanded     = setOptions && setOptions.showExpanded,
          isSetInWriteMode = false;
      $(setEl).children(":not('.binf-popover'):not('.csui-set-scroll-container-parent')").each(
          function (index, rowEl) {
            $(this).find('.csui-current-focused').trigger('focus');
            var lockedColumns               = [],
                scrollableColumns           = [],
                allChild                    = $(rowEl).find(
                    '.alpaca-container-item:not(.cs-form-multi-action-container)'),
                uniqueId                    = $(rowEl).closest(
                    '.cs-form-set>.alpaca-container-item').attr(
                    "data-alpaca-container-item-name"),
                isWriteOnlyMode             = $(rowEl).find('.cs-field-read').hasClass(
                    'binf-hidden'),
                writemodeClass              = !isWriteOnlyMode ? '' : ' binf-hidden',
                actualContainerWidth,
                showScrollbarForElements    = false,
                popoutParent                = $('<div/>', {
                  class: 'csui-show-colout' + writemodeClass
                }),
                popoutIconContainerFirstRow = $('<div/>', {
                  class: 'csui-icon-container'
                }),
                popoutIconContainer         = $('<div/>', {
                  class: 'csui-icon-container'
                }),
                popoutIcon                  = $('<span/>', {
                  tabindex: 0,
                  'data-csui-name': uniqueId,
                  'data-csui-row-index': index,
                  'data-toggle': 'popover',
                  'role': 'link',
                  'aria-label': lang.titleColoutView,
                  class: 'csui-button-icon icon-toolbar-more csui-colout-icon' +
                         ' csui-show-colout-' + uniqueId + "_" + index
                });
            isSetInWriteMode = isWriteOnlyMode;
            var elementsWidth    = 0,
                numberOfChildren = allChild.length,
                tabcontentWidth  = $(rowEl).width() === 0 ?
                                   ($(rowEl).closest('.cs-metadata-properties').length > 0 ?
                                    ($(rowEl).closest('.cs-metadata-properties').width() <= 100 ?
                                     $(rowEl).closest('.cs-metadata-properties').parents(
                                         ".cs-dialog").width() :
                                     $(rowEl).closest('.cs-metadata-properties').width()) :
                                    $(rowEl).closest('.form-metadata').width()) :
                                   ($(rowEl).width() <= 100 ?
                                    ($(rowEl).parents('.metadata-inner-wrapper').length > 0 ?
                                     $(rowEl).parents('.metadata-inner-wrapper').width() :
                                     $(rowEl).parents(".cs-dialog").width()) : $(rowEl).width());

            if (numberOfChildren < 3) {
              $(rowEl).closest(".alpaca-field-array").addClass('cs-single-field');
            }
            if (numberOfChildren === $(rowEl).find('.csui-field-checkbox').length) {
              $(rowEl).closest(".alpaca-field-array").addClass('cs-adjust-Checkbox-width');
            }

            for (var i = 0; i < allChild.length; i++) {
              var elementWidth = parseInt(
                  $($(rowEl).find(".alpaca-container-item")[i]).css("min-width"));
              elementsWidth += elementWidth;
            }

            if (elementsWidth < tabcontentWidth / 2 &&
                !$(rowEl).closest(".alpaca-field-array").hasClass("cs-adjust-width")) {
              $(rowEl).closest(".alpaca-field-array").addClass('cs-adjust-width');
            }

            self.uniqueId = uniqueId;
            if (!!allChild && allChild.length > 0) {
              if (!!$(rowEl).closest('.cs-formview-wrapper').length) {
                var setbacks = 5;
                actualContainerWidth = Math.floor($(rowEl).closest('.cs-formview-wrapper').width() -
                                                  extraWidth + setbacks);
              } else {
                actualContainerWidth = Math.floor(
                    (($(rowEl).closest('.cs-metadata-properties').length > 0 ?
                      ($(rowEl).closest('.cs-metadata-properties').width() <= 100 ?
                       $(rowEl).closest('.cs-metadata-properties').parents(".cs-dialog").width() :
                       $(rowEl).closest('.cs-metadata-properties').width()) :
                      $(rowEl).closest('.form-metadata').width()) - extraWidth));
              }

              if (actualContainerWidth < elementsWidth) {
                showScrollbarForElements = true;
              }

              if (!isWriteOnlyMode && rows_to_display && index > (rows_to_display - 1)) {
                $(rowEl).addClass("set-row-hidden");
                showExpanded ? $(rowEl).addClass("set-row-show") : "";
              }
              if (showScrollbarForElements) {
                if (allChild.parent().find('.csui-show-colout').length === 0 &&
                    allChild.length >= 2) {

                  if (index === 0) {
                    $(popoutParent).append(popoutIconContainerFirstRow);
                    $(popoutIconContainerFirstRow).append(popoutIcon);
                  } else {
                    $(popoutParent).append(popoutIconContainer);
                    $(popoutIconContainer).append(popoutIcon);
                  }

                  showScrollBar = true;
                  if (isWriteOnlyMode) {
                    popoutParent.addClass('binf-hidden');
                  }

                  if (allChild.parent('.csui-lockedcols').length === 0) {
                    allChild.parent().prepend(popoutParent);
                  }

                  $(rowEl).find(".csui-show-colout-" + uniqueId + "_" + index)
                      .off('click keydown').on({
                    'click': _.bind(self.showColout, self),
                    'keydown': _.bind(self.keyDown, self)
                  }, self);

                  var allChildwithCalout    = allChild.parent().children(),
                      allChildwithoutCalout = allChild;
                  lockedColumns = isWriteOnlyMode ?
                                  allChildwithoutCalout.splice(0, 1) :
                                  allChildwithCalout.splice(0, 2);
                  scrollableColumns = isWriteOnlyMode ? allChildwithoutCalout :
                                      allChildwithCalout;
                  if (allChild.parent('.csui-lockedcols').length === 0) {
                    var lockedColumnsParent = $('<div/>', {
                      id: _.uniqueId('lockedcols'),
                      class: 'csui-lockedcols csui-colout-visible'
                    });

                    if ($(lockedColumns).parent('.csui-lockedcols').length === 0) {
                      $(lockedColumns).wrapAll(lockedColumnsParent);
                    }
                    $(this).parent().parent('.alpaca-field-array').addClass(
                        'csui-set-locked-container');
                    var scrollableColumnsParent = $('<div/>', {
                      id: _.uniqueId('scrollablecols'),
                      class: 'csui-scrollablecols csui-scrollable-' + uniqueId
                    });
                    if (scrollableColumns.parent('.csui-scrollablecols').length === 0) {
                      $(scrollableColumns).wrapAll(scrollableColumnsParent);
                    }
                    $(this).parents('.alpaca-field-array').addClass(
                        'csui-container-lockedcols');
                    if (index > 0) {
                      if (!(i18n && i18n.settings.rtl)) {
                        $(setEl).find('.csui-scrollablecols').scrollLeft(0);
                        $(setEl).find('.csui-set-scroll-container-child').scrollLeft(0);
                      }
                    }
                    if (isWriteOnlyMode) {
                      $(setEl).find('.csui-scrollablecols').addClass('csui-scrollable-writemode');
                      $(setEl).find('.csui-lockedcols').addClass('csui-lockedWriteMode');
                      $(this).parents('.cs-form-set-container').children().find(
                          ".csui-scrollablecols").prop("scrollLeft", 0);
                    }
                  }
                  var lockedColumnFieldClass;
                  if (isWriteOnlyMode) {
                    lockedColumnFieldClass = lockedColumns[0].classList[0];
                  } else {
                    lockedColumnFieldClass = lockedColumns[1].classList[0];
                  }
                  $(setEl).find('.csui-lockedcols').addClass(
                      lockedColumnFieldClass + '-lockedcolumn');

                }
                else if (allChild.parent().find('.csui-show-colout.binf-hidden').length > 0) {
                  showScrollBar = true;
                }
              }
              else {
                (isWriteOnlyMode ? allChild.parent().parent() : allChild.parent()).find(
                    '.csui-show-colout').remove();
                allChild.closest('.cs-form-set-container').find('.binf-popover').remove();
                $(this).parent().parent('.alpaca-field-array').removeClass(
                    'csui-set-locked-container');
                $(this).parents('.alpaca-field-array').removeClass('csui-container-lockedcols');
                if ($(this).find('.csui-lockedcols').length > 0) {
                  $(setEl).find('.csui-set-scroll-container-parent').remove();
                  $(this).find('.csui-lockedcols').children().unwrap();
                  $(this).find('.csui-scrollablecols').children().unwrap();
                  $(this).find('.csui-shadowright-container').remove();
                  $(this).find('.csui-shadowleft-container').remove();
                }
                return;
              }
            }
            if (i18n && i18n.settings.rtl) {
              var scrollChild = $(setEl).find('.csui-set-scroll-container-child');
              scrollChild.scrollLeft(scrollChild.scrollLeft() - 1);
              scrollChild.scrollLeft(scrollChild.scrollLeft() + 1);
            }

            $(setEl).find('.csui-set-scroll-container-child').perfectScrollbar('update');
            $(setEl).on({
              "mouseenter": function () {
                if (!$(this).hasClass('csui-hoveredScrollable')) {
                  $(this).find('.csui-set-scroll-container-child').perfectScrollbar('update');
                  $(this).addClass('csui-hoveredScrollable');
                }
              },
              "mouseleave": function () {
                if ($(this).hasClass('csui-hoveredScrollable')) {
                  $(this).removeClass('csui-hoveredScrollable');
                }
              }
            });

            if (index === addItemIndex && $($(setEl).find('.csui-lockedcols')[addItemIndex]).find(
                    '.csui-shadowleft-container').length === 0) {
              $($(setEl).find('.csui-lockedcols')[addItemIndex]).append(shadowLeftContainer);
            }
            if (index === addItemIndex &&
                $($(setEl).find('.csui-scrollablecols')[addItemIndex]).closest(".cs-array").find(
                    '.csui-shadowright-container').length === 0) {
              $($(setEl).find('.csui-scrollablecols')[addItemIndex]).closest(".cs-array").append(
                  shadowRightContainer);
            }
          }, self, $);

      if (showScrollBar) {
        if (base.isTouchBrowser()) {
          $(setEl).addClass("is-touch");
          var els = $(setEl).find('.alpaca-container-item .csui-scrollable-' + self.uniqueId);
          $(setEl).find('.csui-scrollable-' + self.uniqueId).scroll(function () {
            if ($(".csui-colout-formitems").is(":visible")) {
              hidePopover();
            }
            $(this).parents('.cs-form-set-container').children().find(".csui-scrollablecols").prop(
                "scrollLeft", ($(this).scrollLeft()));
            if ($(this).parents('.cs-form-set-container').children().find(
                    ".csui-scrollablecols").hasClass('csui-dropdown-open')) {
              $(this).parents('.cs-form-set-container').children().find(
                  ".csui-scrollablecols").removeClass('csui-dropdown-open');
            }
          });
        }
        $(setEl).children(":not('.binf-popover')").each(
            function (index, rowEl) {
              $(this).find('.csui-current-focused').trigger('focus');
              var uniqueId = $(rowEl).closest(
                  '.cs-form-set>.alpaca-container-item').attr(
                  "data-alpaca-container-item-name");
              $(setEl).find('.csui-scrollable-' + uniqueId).on('scroll', function () {
                if ($(".csui-colout-formitems").is(":visible")) {
                  hidePopover();
                }
                if (!(i18n && i18n.settings.rtl)) {
                  $(this).parents('.cs-form-set-container').children().find(
                      ".csui-scrollablecols").prop("scrollLeft",
                      ($(this).scrollLeft()));
                  $(this).parents('.cs-form-set-container').find(
                      ".csui-set-scroll-container-child").prop("scrollLeft",
                      ($(this).scrollLeft()));
                }
              });
            });

        var paddingRTL = (self.domEl.css('direction') === 'rtl' ? 'padding-right' :
                          'padding-left');
        var shadowLength    = $(setEl).find('.csui-scrollablecols').closest(".cs-array").find(
            '.csui-shadowright-container').length,
            isScrollPresent = $(setEl).find('.csui-set-scroll-container-parent').length !== 0;
        if (shadowLength === 0) {
          if ($(setEl).find('.csui-scrollablecols').closest(".cs-array").find(
                  '.csui-shadowright-container').length === 0) {
            $(setEl).find('.csui-scrollablecols').closest(".cs-array").append(
                shadowRightContainer);
          }
          if ($(setEl).find('.csui-lockedcols').find('.csui-shadowleft-container').length === 0) {
            $(setEl).find('.csui-lockedcols').append(shadowLeftContainer);

          }

          if (!isScrollPresent) {
            var scrollDiv              = $('<div/>', {
                  class: 'csui-set-scroll-container-parent'
                }),
                childScrollDiv         = $('<div/>', {
                  class: 'csui-set-scroll-container-child'
                }),
                scrollableContent      = $('<div/>', {
                  class: 'csui-scrollable-content .csui-scrollable-' + self.uniqueId
                }),
                isUpdateMode           = this.connector.config.formView.mode === "update",
                metadataPropertiesPage = $(setEl).closest('.binf-tab-content .cs-form').length > 0 ?
                                         $(setEl).closest('.binf-tab-content .cs-form') :
                                         ($(setEl).closest('.cs-form.cs-form-update') !==
                                          undefined) &&
                                         ($(setEl).closest('.cs-form.cs-form-update').length > 0) ?
                                         $(setEl).closest('.cs-form.cs-form-update') :
                                         $(setEl).closest('.cs-form.cs-form-create'),
                coloutWidth            = parseInt(
                    $(setEl).find('.csui-colout-icon:first').parent().parent().css('width').match(
                        /\d/g).join("")),
                scrollChildDivWidth,
                scrollDivPadding;

            $(childScrollDiv).append(scrollableContent);
            $(scrollDiv).append(childScrollDiv);
            $(setEl).append(scrollDiv);
            $(setEl).find(".csui-scrollablecols").prop("scrollLeft", 0);
            $(setEl).find('.csui-set-scroll-container-child').prop("scrollLeft", 0);

            var that = this;
            that.setEl = setEl;

            if (self.eventType === "resize") {
              checkPadding(setEl);
            }
            else {
              var paddingCheckInterval = setInterval(function () {checkPadding(setEl)}, 100);
            }
            $(setEl).find('.csui-set-scroll-container-child').perfectScrollbar('update');
          }
          else {
            $(setEl).find('.csui-set-scroll-container-child').perfectScrollbar(
                {suppressScrollY: true});
            $(setEl).find('.csui-set-scroll-container-child').perfectScrollbar('update');
          }
        }
      }
      else {
        if ($(setEl).find('.csui-set-scroll-container-child').hasClass('ps-container')) {
          $(setEl).find('.csui-set-scroll-container-child').perfectScrollbar('update');
        }
      }
      var rowList   = $(setEl).closest('.cs-form-set.cs-form-set-container').find(
          ">.cs-array.alpaca-container-item"),
          fieldMode = _.find(self.options.fields,
              function (val, key) { return val.mode !== "";}).mode;
      if ((fieldMode !== 'create') && rows_to_display && rows_to_display > 0 &&
          rowList.length > rows_to_display) {
        if ($(setEl).closest('.cs-form-set.cs-form-set-container').parent().find(
                ".csui-show-more").length === 0) {
          var showMoreOrLess = $('<div/>', {
            "class": 'csui-show-more',
            "aria-label": lang.showMoreAria,
            "tabindex": 0,
            "id": self.uniqueId
          }), showMoreOrLessLabel, showMoreOrLessButton;

          if (showExpanded) {
            $(setEl).closest('.cs-form-set.cs-form-set-container').addClass("set-row-show");
            showMoreOrLessLabel = $('<label/>', {
              "class": 'csui-set-show-more-label'
            }).text(lang.showLess);
            showMoreOrLessButton = $('<button/>', {
              "class": 'csui-set-show-more-icon icon-expandArrowUp',
              "aria-label": lang.showLessAria
            });
          } else {
            $(setEl).closest('.cs-form-set.cs-form-set-container').removeClass("set-row-show");
            showMoreOrLessLabel = $('<label/>', {
              "class": 'csui-set-show-more-label',
              "title": lang.showMore
            }).text(lang.showMore);
            showMoreOrLessButton = $('<button/>', {
              "class": 'csui-set-show-more-icon icon-expandArrowDown',
              "aria-label": lang.showMoreAria,
              "title": lang.showMore
            });
          }
          $(showMoreOrLessLabel).appendTo(showMoreOrLess);
          $(showMoreOrLessButton).appendTo(showMoreOrLess);
          $(setEl).closest('.cs-form-set.cs-form-set-container').parent().append(showMoreOrLess);
          if (showExpanded) {
            $(setEl).closest('.cs-form-set.cs-form-set-container').addClass("set-row-show");
          }
          $(showMoreOrLess).off("click").on("click", self, self.showMoreOrLessColumns);
          $(showMoreOrLess).off("keydown").on("keydown", self, function (event) {
            if (event.keyCode === 13 || event.keyCode === 32) {
              self.showMoreOrLessColumns(event);
            }
          });
        }
      }
    },

    showMoreOrLessColumns: function (e) {
      if (e.data && !e.data.checkForFieldErrors(e)) {
        var setContainer      = $(e.target).parents(".alpaca-field-array").find(
            '.cs-form-set.cs-form-set-container'),
            showMoreContainer = $(e.target).parent();
        if ($(setContainer).find(".set-row-show").length) {
          $(setContainer).find(".set-row-hidden").removeClass("set-row-show");
          $(showMoreContainer).find(".csui-set-show-more-icon").removeClass(
              "icon-expandArrowUp").addClass(
              "icon-expandArrowDown");
          $(showMoreContainer).find(".csui-set-show-more-icon").attr({
            "aria-label": lang.showMoreAria,
            "title": lang.showMore
          });
          $(showMoreContainer).find(".csui-set-show-more-label").html(lang.showMore);
          $(showMoreContainer).find(".csui-set-show-more-label").attr({
            "aria-label": lang.showMoreAria,
            "title": lang.showMore
          });
        } else {
          $(setContainer).find(".set-row-hidden").addClass("set-row-show");
          $(showMoreContainer).find(".csui-set-show-more-icon").removeClass(
              "icon-expandArrowDown").addClass(
              "icon-expandArrowUp");
          $(showMoreContainer).find(".csui-set-show-more-icon").attr({
            "aria-label": lang.showLessAria,
            "title": lang.showLess
          });
          $(showMoreContainer).find(".csui-set-show-more-label").html(lang.showLess);
          $(showMoreContainer).find(".csui-set-show-more-label").attr({
            "aria-label": lang.showLessAria,
            "title": lang.showLess
          });
        }
      }
      e.preventDefault();
      e.stopPropagation();
    },

    checkForFieldErrors: function (event) {
      var errEle           = $('.cs-form .cs-formfield-invalid'),
          errorFieldExists = false;
      if (errEle.length > 0) {
        errEle.find(":input")[0].focus();
        errorFieldExists = true;
      }
      return errorFieldExists;
    },

    applyCreatedItems: function (model, callback) {
      var metadataPage = this.domEl.closest('.cs-metadata, .cs-formview-wrapper'),
          that         = this,
          ev           = {
            data: {
              model: model,
              elements: model.items,
              self: this
            }
          };
      this.base(model, callback);
      this.restructureAllSetContainer(ev);
      $(window).on('resize', {
        model: model,
        elements: model.items,
        self: this
      }, this.restructureAllSetContainer);
      metadataPage.on('toggled:navigationbar refresh:setcontainer', function () {
        that.restructureAllSetContainer(ev);
      });
    },

    getValue: function () {
      if (this.children.length === 0 && !this.isRequired()) {
        return {};
      }
      var o = {};

      for (var i = 0; i < this.children.length; i++) {
        var propertyId = this.children[i].propertyId;
        var fieldValue = this.children[i].getValue();

        if (typeof(fieldValue) !== "undefined") {
          if (this.determineAllDependenciesValid(propertyId)) {
            var assignedValue = undefined;

            if (typeof(fieldValue) === "boolean") {
              assignedValue = fieldValue ? true : false;
            }
            else if (Alpaca.isArray(fieldValue) || Alpaca.isObject(fieldValue) ||
                     Alpaca.isNumber(fieldValue)) {
              assignedValue = fieldValue;
            }
            else {
              assignedValue = fieldValue;
            }
            if (assignedValue !== undefined) {
              o[propertyId] = assignedValue;
            }
          }
        }
      }

      return o;
    }

  });

  Alpaca.registerFieldClass('object', Alpaca.Fields.CsuiObjectField, 'bootstrap-csui');
  Alpaca.registerFieldClass('object', Alpaca.Fields.CsuiObjectField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiObjectField;
})
;
