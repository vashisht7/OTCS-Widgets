package OTCSSAMPLES

public object OTCSSAMPLESGlobals inherits KERNEL::Globals

	override	List	f__InitObjs = { \
											OTCSSAMPLES::OTCSSAMPLESWebModule, \
											OTCSSAMPLES::CSUIExtension, \
											OTCSSAMPLES::OTCSSAMPLESRequestHandlerGroup \
										}

end
