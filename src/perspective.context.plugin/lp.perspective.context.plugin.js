define(['csui/lib/underscore', 'csui/lib/backbone',
'csui/lib/jquery',
'csui/utils/contexts/factories/application.scope.factory',
'csui/utils/contexts/perspective/perspective.context.plugin'], function(_, Backbone,$, ApplicationScopeModelFactory,
     PerspectiveContextPlugin) {

        var LPPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

            constructor: function LPPerspectiveContextPlugin(options) {
                PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

                this.applicationScope = this.context
                    .getModel(ApplicationScopeModelFactory)
                    .on('change', this._fetchLPPerspective, this);
            },
            _fetchLPPerspective: function() {
                if(this.applicationScope.id !== 'lp'){
                    return;
                }
                if (this.loadPerspective){
                    return;
                }
                this.applicationScope.set('id', 'lp');
                this.context.loadPerspective('json!otcss/pages/lp.json');
                $('.otcss--noteview panel panel-default').height(100);
            }
        });

        return LPPerspectiveContextPlugin;
});