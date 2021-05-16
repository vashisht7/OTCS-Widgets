csui.define({
  title: "Activity Feed",
  description: "Shows activity feeds for the given option parameters.",
  wrapperClassTitle: "Wrapper class",
  wrapperClassDescription: "Wrapper class to be apply on top of activity feed list",
  feedSizeTitle: "Feed size",
  feedSizeDescription: "Number of feed items to be fetched per page",
  feedTypeTitle: "Feed type",
  feedTypeDescription: "Type of the feeds that should be consider",
  feedSettingsTitle: "Feed settings",
  feedSettingsDescription: "Feed settings to be considered",
  enableCommentsTitle: "Enable comments",
  enableCommentsDescription: "Whether to show comment button or not respective to each feed",
  enableFiltersTitle: "Enable filters",
  enableFiltersDescription: "Whether to show filter panel at left side or not in expanded view",
  honorfeedsourceTitle: "Honor feed source",
  honorfeedsourceDescription: "Whether to consider pulsefrom or consider widget options as feed" +
                              " source",
  headerViewTitle: "Header View",
  headerViewDescription: "Show feeds in horizontal view with dark theme",
  feedsourceTitle: "Feed source",
  feedsourceDescription: "Source for the feed to be considered",
  sourceTitle: "Source",
  sourceDescription: "Consider feed source as all or node or pulsefrom",
  feedsourceIdTitle: "id",
  feedsourceIdDescription: "Object id to be consider as feed source and applicable only when" +
                 " feedsource.source is either node or pulsefrom",
  updatesfromTitle: "Updates from",
  updatesfromDescription: "Feed updates from" +
                          " all/iamfollowing/myfollowers/following/followers/myupdates/mentions/myfavorites/user/group",

  fromTitle: "From",
  fromDescription: "Consider feed updates from different available sources",
  updatesfromIdTitle: "id",
  updatesfromIdDescription: "User id or group id and applicable only if updatesfrom.from is" +
                            " following/followers/user/group",
  configSettingsTitle: "Config settings",
  configSettingsDescription: "Widget instance level config settings",
  feedsAutoRefreshWaitTitle: "Activity feed auto refresh wait",
  feedsAutoRefreshWaitDescription: "Auto feed refresh interval time",
  maxMessageLengthTitle: "Maximum message length",
  maxMessageLengthDescription: "Maximum text length should be allowed while posting a comment or reply"
});
