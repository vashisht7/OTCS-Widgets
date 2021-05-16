/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/base",
  "csui/utils/log",
  "csui/models/mixins/resource/resource.mixin",
  "csui/models/browsable/browsable.mixin",
  "i18n!xecmpf/controls/bosearch/impl/nls/lang"
], function ($, _, Backbone, base, log,
    ResourceMixin, BrowsableMixin, lang) {

  function mapobj(obj,iteratee,context) {
    return _.object(_.map(_.pairs(obj),function(keyval) {
      return _.iteratee(iteratee, context)(keyval);
    }));
  }

  var BoResultTableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    },

    constructor: function BoResultTableColumnModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultTableColumnCollection = Backbone.Collection.extend({

    model: BoResultTableColumnModel,
    comparator: "sequence",

    constructor: function BoResultTableColumnCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultColumn = Backbone.Model.extend({

    idAttribute: "column_key",

    constructor: function BoResultColumn(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultColumnCollection = Backbone.Collection.extend({

    model: BoResultColumn,

    constructor: function BoResultColumnCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultModel = Backbone.Model.extend({
    constructor: function BoResultModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    get: function() {
      return Backbone.Model.prototype.get.apply(this, arguments);
    }
  });

  var csui_width = 120, csui_px = 14, csui_pad = 32, max_abbrev = 4;
  function getLeveledLength(fieldLength,headerText,labelLength) {
    var length = Math.max(fieldLength||0,(headerText&&headerText.length)||0,labelLength||0,max_abbrev);
    length = Math.min(length,60);
    return length;
  }

  function getMinFactor(smallestLength,averageLength,longestLength) {
    var avg_width = smallestLength>max_abbrev ? 0.53 : 0.6;
    var csui_average = (csui_width - csui_pad) / (csui_px * avg_width);
    var factor = smallestLength / csui_average;
    log.debug("csui_average {0}",csui_average) && console.log(log.last)
    return Math.min(factor,0.8);
  }

  var BoResultCollection = Backbone.Collection.extend({

    model: BoResultModel,

    constructor: function BusinesObjectResultCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.makeResource(options);
      this.makeBrowsable(options);
      this.boSearchModel = options.boSearchModel;
      this.searchParams = options.searchParams;
      this.labelToKey = {},
      this.nameToKey = {},
      this.columns = new BoResultColumnCollection();
      this.tableColumns = new BoResultTableColumnCollection();
      this.totalCount = 0;
      this.skipCount = 0;
      this.topCount = options.pageSize || 100;
      this.maxCount = options.maxRowCount;
      this.options = options;
    }
  },
  {
    ERR_COLUMNS_CHANGED: "ERR_COLUMNS_CHANGED"
  });

  ResourceMixin.mixin(BoResultCollection.prototype);
  BrowsableMixin.mixin(BoResultCollection.prototype);

  var defaults = _.defaults({},BoResultCollection.prototype);

  _.extend(BoResultCollection.prototype, {

    fetch: function (options) {
      var reset = options && options.reset;
      if (this.searchParams && (reset || this.maxCount===undefined || this.length < this.maxCount)) {
        reset && (options.url = this.url(options));
        return defaults.fetch.apply(this, arguments);
      } else {
        return $.Deferred().resolve().promise();
      }
    },

    url: function (options) {
      var path = 'businessobjects',
          skipCount = (options && options.reset) ? 0 : (this.skipCount || 0),
          params = _.omit(
              _.defaults(
                  {
                    bo_type_id: this.boSearchModel.get("bo_type_id"),
                    limit: this.topCount,
                    page: this.topCount ? Math.floor(skipCount / this.topCount) + 1 : undefined
                  },
                  mapobj(this.searchParams, function (keyval) {
                    return ["where_" + keyval[0], keyval[1]];
                  }, this)), function (value) {
                return value === null || value === '';
              }),
          resource = path + '?' + $.param(params),
          baseurl  = this.connector.connection.url;
      var url = base.Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, resource);
      return url;
    },

    parse: function (response,options) {
      function parcmp(pnew,cnew) {
        var result;
        if (cnew) {
          var pcount = 0;
          for (var ii = 0; ii<cnew.length; ii++) {
            var celnew = cnew[ii];
            pcount += (pnew[celnew.fieldName]!==undefined) ? 1 : 0;
          }
          if (pcount===0) {
            result = "incompatible";
          }
        }
        return result;
      }
      function colcmp(cold,cnew) {
        var result;
        if (cnew) {
          for (var ii = 0; ii<cnew.length; ii++) {
            var celnew = cnew[ii], celold = cold[ii];
            if (!celold || celold.fieldName!==celnew.fieldName) {
              return "incompatible";
            } else if (celold.fieldLabel!==celnew.fieldLabel
                       || celold.position!==celnew.position
                       || celold.length!==celnew.length) {
              result = "significant";
            }
          }
        }
        return result;
      }
      delete this.errorMessage;
      var rows = [];
      if (this.searchParams && response && response.results) {
        var columnDescriptions = response.results.column_descriptions,
            pardiff = ( $.isEmptyObject(this.searchParams)|| $.isEmptyObject(columnDescriptions) ) ? "significant" : parcmp(this.searchParams,columnDescriptions),
            coldiff,
            ok = (pardiff!=="incompatible");
        if (ok && !options.reset && this.columnDescriptions) {
          coldiff = colcmp(this.columnDescriptions, columnDescriptions);
          ok = (coldiff!=="incompatible");
        }
        if (!ok) {
          this.errorMessage = BoResultCollection.ERR_COLUMNS_CHANGED;
        } else {
          if (!columnDescriptions || !columnDescriptions.length) {
            columnDescriptions = [{
                  fieldLabel: "Business Object ID",
                  fieldName: "businessObjectId",
                  keyField: "",
                  length: 15,
                  position: 1
                }];
          }
          var searchedParams = _.extend({}, this.searchParams);
          var searchedForms = _.extend({}, this.searchForms);
          var mappedValues = {};
          if (options.reset || !this.columnDescriptions || pardiff==="significant" || coldiff==="significant") {
            var normDescrs  = [],
                labelToKey  = {},
                nameToKey   = {},
                totalLength = 0,
                columnCount = 0,
                smallestLength,
                longestLength;
            _.each(columnDescriptions, function (attributes, index) {
              var column_key = "conws_col_" + index,
                  labelLength = 0;
              if (searchedForms
                  && searchedForms.options
                  && searchedForms.options.fields
                  && searchedForms.options.fields[attributes.fieldName]
                  && searchedForms.options.fields[attributes.fieldName].optionLabels
                  && searchedForms.schema
                  && searchedForms.schema.properties
                  && searchedForms.schema.properties[attributes.fieldName]
                  && searchedForms.schema.properties[attributes.fieldName].enum
                  && searchedForms.options.fields[attributes.fieldName].optionLabels.length
                     === searchedForms.schema.properties[attributes.fieldName].enum.length) {
                var labels = searchedForms.options.fields[attributes.fieldName].optionLabels,
                    values = searchedForms.schema.properties[attributes.fieldName].enum,
                    map = mappedValues[column_key] = {};
                _.each(labels, function (label, mapidx) {
                  map[values[mapidx]] = label;
                  if (label.length>labelLength) {
                    labelLength = label.length
                  }
                }, this);
              }
              var normalized = _.extend({
                align: "left",
                name: attributes.fieldLabel,
                persona: "",
                sort: true,
                type: -1 /* for string*/,
                width_weight: 0
              }, attributes, {
                correctedLength: getLeveledLength(attributes.length,attributes.fieldLabel,labelLength),
                column_key: column_key
              });
              if (normalized.correctedLength) {
                totalLength += normalized.correctedLength;
                columnCount += 1;
                if (smallestLength===undefined || normalized.correctedLength<smallestLength) {
                  smallestLength = normalized.correctedLength;
                }
                if (longestLength===undefined || normalized.correctedLength>longestLength) {
                  longestLength = normalized.correctedLength;
                }
              }
              normDescrs.push(normalized);
              labelToKey[normalized.fieldLabel] = normalized.column_key;
              nameToKey[normalized.fieldName] = normalized.column_key;
            }, this);
            var defaultKey, lowestSequence,
                tableColumns = _.map(normDescrs,function (column) {
                  var key      = column.column_key,
                      sequence = column.position + 1;
                  if (sequence !== undefined) {
                    if (lowestSequence === undefined || sequence < lowestSequence) {
                      lowestSequence = sequence;
                      defaultKey = key;
                    }
                  }
                  defaultKey || (defaultKey = key);
                  return {key: key, sequence: sequence};
                });

            if (columnCount>1
                && smallestLength && smallestLength>0
                && longestLength && longestLength>smallestLength) {
              var averageLength = totalLength/columnCount,
                  minFactor = getMinFactor(smallestLength,averageLength,longestLength),
                  minLength = averageLength * minFactor,
                  correctionLength = smallestLength<minLength ? (minFactor*averageLength-smallestLength)/(1-minFactor) : 0,
                  widthFactorSum = 0,
                  maxWidthFactor = 0,
                  maxWidthFactorIndex = 0;
              log.debug("minFactor {0}",minFactor) && console.log(log.last)
              averageLength += correctionLength;
              _.each(normDescrs,function(normalized,index){
                normalized.correctedLength = normalized.correctedLength ? normalized.correctedLength+correctionLength : averageLength;
                var widthFactor = normalized.correctedLength / averageLength;
                log.debug("widthFactor {0}",widthFactor) && console.log(log.last)
                tableColumns[index].widthFactor =  widthFactor;
                widthFactorSum += widthFactor;
                if (widthFactor>=maxWidthFactor) {
                  maxWidthFactor = widthFactor;
                  maxWidthFactorIndex = index;
                }
              }, this);
              log.debug("widthFactorSum {0}",widthFactorSum) && console.log(log.last)
              var widthFactorRest = columnCount - widthFactorSum;
              log.debug("widthFactorRest {0}",widthFactorRest) && console.log(log.last)
              if (widthFactorRest!==0) {
                maxWidthFactor += widthFactorRest;
                widthFactorSum += widthFactorRest;
                tableColumns[maxWidthFactorIndex].widthFactor = maxWidthFactor;
                log.debug("widthFactorSum {0}",widthFactorSum) && console.log(log.last)
              }
            }

            this.orderByDefaultKey = defaultKey;
            this.mappedValues = mappedValues;
            this.labelToKey = labelToKey;
            this.nameToKey = nameToKey;
            this.columns.reset(normDescrs, {silent: true});
            this.tableColumns.reset(tableColumns);
            this.columnDescriptions = response.results.column_descriptions;
          }

          this.searchedParams = searchedParams;
          this.searchedForms = searchedForms;

          if (response.results.result_rows) {
            var needCount = this.maxCount===undefined ? this.topCount : Math.min(this.topCount, this.maxCount - this.length);
            for (var rowindex = 0; rowindex < needCount; rowindex++) {
              if (rowindex >= response.results.result_rows.length) {
                break;
              }
              var attributes = response.results.result_rows[rowindex];
              var row = _.extend(mapobj(attributes, function (keyval) {
                var key = this.labelToKey[keyval[0]] || this.nameToKey[keyval[0]] || keyval[0],
                    map = this.mappedValues[key],
                    val = (map && map[keyval[1]]) || keyval[1];
                return [key, val];
              }, this), {
                id: attributes.rowId
              });
              rows.push(row);
            }
          }

          this.totalCount = response && response.paging && response.paging.total_count;
          if (options.reset) {
            this.skipCount = 0;
          }
          this.maxRowsExceeded = response && response.results && response.results.max_rows_exceeded;

        }
      }
      return rows;
    }

  });

  return BoResultCollection;

});
