# ConfigurationVolume Widgets (widgets/configurationvolume)

The configuration volume widget view provides easily access to the configured volumes which are permitted for the given user.

# Example
	  
    var contentRegion = new Marionette.Region({el: "body"}),
        pageContext = new PageContext(),
        configurationVolumeView = new ConfigurationView({
            context: pageContext
        });

    contentRegion.show(configurationVolumeView);
    pageContext.fetch();

# Parameters

## options

context
: The page context

shortcutTheme
: The styling css class for configuration volume short cut
    List of Themes available:
        csui-shortcut-theme-stone1
        csui-shortcut-theme-stone2
        csui-shortcut-theme-teal1
        csui-shortcut-theme-teal2
        csui-shortcut-theme-pink1
        csui-shortcut-theme-pink2
        csui-shortcut-theme-indigo1
        csui-shortcut-theme-indigo2

