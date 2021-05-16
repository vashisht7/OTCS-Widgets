/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module'], function (module) {

  var constants = Object.freeze({
    MODE_EDIT_PERSPECTIVE: 'edit',
    MODE_PERSONALIZE: 'personalize',
    WIDGET_PERSPECTIVE_PLACEHOLDER: 'csui/perspective.manage/widgets/perspective.placeholder',
    WIDGET_SHORTCUTS: 'csui/widgets/shortcuts',
    KEY_WIDGET_ID: 'w_id',
    KEY_HIDDEN: 'hidden',
    WIDGET_ID_PERSPECTIVE_PREFIX: 'pman-',
    WIDGET_ID_PESONALIZATION_PREFIX: 'personal-'
  });

  var EXTRA_WIDGET_CONFIG_KEYS = [constants.KEY_WIDGET_ID, constants.KEY_HIDDEN];
  function hasRequiredFields(manifest) {
    if (!!manifest && !!manifest.schema && !!manifest.schema.required &&
        manifest.schema.required.length > 0) {
      return true;
    }
    return false;
  }

  function isEligibleForLiveWidget(manifest) {
    manifest = manifest || {};
    if (!!manifest.callback || hasRequiredFields(manifest)) {
      return false;
    }
    return true;
  }

  function getExtraWidgetKeys() {
    return EXTRA_WIDGET_CONFIG_KEYS;
  }
  function getEmptyPlaceholderWidgetType(perspectiveMode) {
    switch (perspectiveMode) {
    case constants.MODE_PERSONALIZE:
      return constants.WIDGET_SHORTCUTS;
    default:
      return constants.WIDGET_PERSPECTIVE_PLACEHOLDER;
    }
  }

  function isEmptyPlaceholder(widget, perspectiveMode) {
    if (widget.type === constants.WIDGET_PERSPECTIVE_PLACEHOLDER) {
      return true;
    }
    var emptyType = getEmptyPlaceholderWidgetType(perspectiveMode);
    return emptyType === widget.type && widget.options && widget.__isPlacehoder;
  }

  function generateWidgetId(perspectiveMode) {
    var prefix = constants.WIDGET_ID_PERSPECTIVE_PREFIX;
    if (perspectiveMode === constants.MODE_PERSONALIZE) {
      prefix = constants.WIDGET_ID_PESONALIZATION_PREFIX;
    }
    return prefix + (+new Date());
  }

  function isPersonalWidget(widget) {
    var widgetId = widget[constants.KEY_WIDGET_ID];
    if (!widgetId) {
      return false;
    }
    return isPersonalWidgetId(widgetId);
  }

  function isPersonalWidgetId(widgetId) {
    return widgetId && widgetId.substr(0, constants.WIDGET_ID_PESONALIZATION_PREFIX.length) ===
           constants.WIDGET_ID_PESONALIZATION_PREFIX;
  }

  function hasWidgetId(widget) {
    return !!widget[constants.KEY_WIDGET_ID];
  }

  function isHiddenWidget(widget) {
    return widget && (widget[constants.KEY_HIDDEN] === true);
  }

  function setWidgetHidden(widget, hide) {
    widget && (widget[constants.KEY_HIDDEN] = hide);
  }

  return {
    MODE_EDIT_PERSPECTIVE: constants.MODE_EDIT_PERSPECTIVE,
    MODE_PERSONALIZE: constants.MODE_PERSONALIZE,
    WIDGET_PERSPECTIVE_PLACEHOLDER: constants.WIDGET_PERSPECTIVE_PLACEHOLDER,
    WIDGET_SHORTCUTS: constants.WIDGET_SHORTCUTS,
    KEY_WIDGET_ID: constants.KEY_WIDGET_ID,
    WIDGET_ID_PERSPECTIVE_PREFIX: constants.WIDGET_ID_PERSPECTIVE_PREFIX,
    WIDGET_ID_PESONALIZATION_PREFIX: constants.WIDGET_ID_PESONALIZATION_PREFIX,

    isEligibleForLiveWidget: isEligibleForLiveWidget,
    hasRequiredFields: hasRequiredFields,
    isEmptyPlaceholder: isEmptyPlaceholder,
    getExtraWidgetKeys: getExtraWidgetKeys,
    getEmptyPlaceholderWidgetType: getEmptyPlaceholderWidgetType,
    generateWidgetId: generateWidgetId,
    isPersonalWidget: isPersonalWidget,
    isPersonalWidgetId: isPersonalWidgetId,
    hasWidgetId: hasWidgetId,
    isHiddenWidget: isHiddenWidget,
    setWidgetHidden: setWidgetHidden
  };

});