package OTCSSAMPLES

public object OTCSSAMPLESWebModule inherits WEBDSP::WebModule

	override	List	fDependencies = { { 'kernel', 16, 0 }, { 'restapi', 16, 0 } }
	override	Boolean	fEnabled = TRUE
	override	String	fModuleName = 'otcssamples'
	override	String	fName = 'OTCSSAMPLES'
	override	List	fOSpaces = { 'otcssamples' }
	override	String	fSetUpQueryString = 'func=otcssamples.configure&module=otcssamples&nextUrl=%1'
	override	List	fVersion = { '1', '0', 'r', '0' }

end
