package OTCSSAMPLES

/**
 *  This is a good place to put documentation about your OSpace.
 */
public object OTCSSAMPLESRoot

	public		Object	Globals = OTCSSAMPLES::OTCSSAMPLESGlobals



	/**
	 *  Content Server Startup Code
	 */
	public function Void Startup()
		
			//
			// Initialize globals object
			//
		
			Object	globals = $OTCSSAMPLES = .Globals.Initialize()
		
			//
			// Initialize objects with __Init methods
			//
		
			$Kernel.OSpaceUtils.InitObjects( globals.f__InitObjs )
		
		end

end
