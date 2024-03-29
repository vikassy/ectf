// create the av namespace
bbc.fmtj.utils.createObject('bbc.fmtj.av');
bbc.fmtj.av.emp = {
    
    /**
     * Have the emps been loaded?
     */
    loaded: false,
	
	/**
	 * The version of the code
	 */	
	version: '2_0_55',
		
	/**
	 * Array of optional configs to use, e.g. 'fomrula_one', 'panorama'
	 */
	configs: [],
		
	/**
	 * Turn logging on
	 */
	logging: false,
	
	/**
	 * So backwards compatibility doesn't break
	 */
	load: function(callback)
	{
		callback.apply(window);
	},
	
	loadEmp: function(empId)
	{
		var emp = new bbc.fmtj.av.emp.Player(empId);
		emp.setMediator('href', '{protocol}://{host}/mediaselector/5/select/version/2.0/mediaset/{mediaset}/vpid/{id}');
		emp.write();

	},

    playerInstances: {},

	/**
	 * Factory method to create an EMP player with pre-defined settings
	 */
	Player: function(empId)
	{
		// reference to this obejct
		var self = bbc.fmtj.av.emp,
		    // create a new emp player
		    emp = new embeddedMedia.Player(empId),
		    // get the config for this emp
		    config = self.getConfig(empId),
		    mainConfigName,
		    methodName,
		    settingsConfigName;
		
		// set mediator href - enables HDS as does NOT contain /transferformat/plain/
		emp.setMediator('href', '{protocol}://{host}/mediaselector/5/select/version/2.0/mediaset/{mediaset}/vpid/{id}');
		 				
		// enable playback over 3G connections in EMP Clear
		emp.set('enable3G', true);
		
		// set the main player configuration
		for(mainConfigName in config.main){
			// call appropriate emp method name (concat 'set' with capitalised config name)
			methodName = 'set' + mainConfigName.charAt(0).toUpperCase() + mainConfigName.slice(1);
			emp[methodName](config.main[mainConfigName]); 
		}
		
		// set the optional settings
		for(settingsConfigName in config.settings){
			emp.set(settingsConfigName, config.settings[settingsConfigName]); 
		}
		
		// attach logging to initialised event
		emp.onMediaPlayerInitialised = function(){
			self.log('onMediaPlayerInitialised');
		};
		
		// store, and return the player
		return self.playerInstances[empId] = emp;
	},
	
	/**
	 * Logging method
	 * 
	 * @param string message Message to log
	 */
	log: function(message)
	{
		if(bbc.fmtj.av.emp.logging){
		    alert(message);
	    }
	},
	
	/**
	 * Extract the <param> values associated with empId
	 * 
	 * @param string empId The dom id of the emp
	 * @return object Key/value pairs of the params
	 */
	getParams: function(empId)
	{
		var embedParams = glow.dom.get('#' + empId + ' param'),
		    params = {};
		
		embedParams.each(function(){
			params[this.name] = this.value;
		});
		
		return params;		
	},
	
	/**
	 * Get the configration for this emp
	 * 
	 * @param string empId The id of the emp
	 * @return object Width main property (that holds playlist, config, eidth, etc) and settings (holds settings and plugins)
	 */
	getConfig: function(empId)
	{
		var defaultConfig = bbc.fmtj.page.empConfig.base,
		    i,
		    params,
		    config,
		    holdingImage,
		    dim;
		
		// first merge added specific config with base, if it exists
		for(i in this.configs){
			if(bbc.fmtj.page.empConfig[this.configs[i]]){
				defaultConfig = this.mergeObjects(defaultConfig, bbc.fmtj.page.empConfig[this.configs[i]]);
			}
		}
		
		// now get the params
		params = this.getParams(empId);
		
		// get the dimensions
		dim = this.getDim(params, defaultConfig);
		
		config = {
			main: {
				'id'	   : params.id || empId,
				'playlist' : params.playlist,
				'config'   : location.protocol + '//' + location.hostname + defaultConfig.configUrl,
				'width'	   : dim.width,
				'height'   : dim.height,
				'message'  : this.getNoFlashMessage(params, defaultConfig, dim)
			},
			settings: this.getSettings(params, defaultConfig)
        };
		
		if(defaultConfig.player.wmode){
		    config.main.wmode = defaultConfig.player.wmode;
	    }

		// add boiler plate functionality, if there's a holding image
		holdingImage = params.holding || params.holdingImage; 
		if(holdingImage){
            config.main.boilerPlateUrl = holdingImage;
            // use by external pop-ups (e.g. share icons) to change the emp to an image
            config.settings.holdingImage = holdingImage;
	    }
		
		return config;
	},
	
	getSettings: function(params, defaultConfig)
	{
		var settings = {
                fmtjDocURI        : params.fmtjDocURI,
                uxHighlightColour : defaultConfig.player.uxHighlightColour
		    },
		    settingName,
		    plugin,
		    pluginName,
		    paramName;
		
		// add default settings and plugins
		for(settingName in defaultConfig.settings){
		    settings['config_settings_' + settingName] = defaultConfig.settings[settingName];
		}
		for(plugin in defaultConfig.plugins){
			for(pluginName in defaultConfig.plugins[plugin]){
				settings['config_plugin_' + plugin + '_' + pluginName] = defaultConfig.plugins[plugin][pluginName];
			}
		}
		
		// also add specific ones, possibly overriding above default ones
		for(paramName in params){
			if(paramName.substring(0, 14) === 'config_plugin_'){
				settings[paramName] = params[paramName]; 
			}
			else if(paramName.substring(0, 16) === 'config_settings_'){
				settings[paramName] = params[paramName]; 
			}
		}
		
		return settings;
	},
	
	getNoFlashMessage: function(params, defaultConfig, dim)
	{
		// construct the no flash message
		var noFlashMessage = defaultConfig.noFlashMessage,
		    // if no holding image, assume it's audio
		    holdingImage = params.holding || params.holdingImage,
		    mediaType;
		
		if(holdingImage){
			noFlashMessage.holding = holdingImage;
			noFlashMessage.width   = dim.width + 'px';
			noFlashMessage.height  = dim.height + 'px';
			mediaType = 'video';
		}
		else{
			mediaType = 'audio';
		}
		
		// interpolate the flash message into the appropriate template
		return glow.lang.interpolate(defaultConfig.noFlashTemplate[mediaType], noFlashMessage);
	},
	
	/**
	 * Get the dimensions for the media player from the default config and embedded params
	 * 
	 * @param object params
	 * @param object config
	 * @return object With width and height properties
	 */
	getDim: function(params, defaultConfig)
	{
		var width, 
		    height;
		
        // NOTE: interim solution as cps is setting small audio players with height 71; should be 115
        if(params.size && params.size.toLowerCase() === 'small' && parseInt(params.width, 10) === 304 && parseInt(params.height, 10) === 71){
            width  = 304;
            height = defaultConfig.audio.small.height;
        }
		// if values supplied in params, use them
		else if(params.width && params.height){
			width  = params.width;
			height = params.height;
		}
		// if just size given, assume audio
		else if(params.size){
			width  = defaultConfig.audio[params.size.toLowerCase()].width;
		    height = defaultConfig.audio[params.size.toLowerCase()].height;
		}
		// otherwise use standard video
		else{
			width  = defaultConfig.video.standard.width;
			height = defaultConfig.video.standard.height;
		}
		
		return {
			'width':  parseInt(width, 10),
			'height': parseInt(height, 10)
		};
	},

	/**
	 * Merges the properties of two object and returns the result (latter overrides former) 
	 * 
	 * @param Object objOne 
	 * @param Object objTwo
	 * @returns Object An object containing the combiniation of the two parameter objects
	 */
	mergeObjects: function(objOne, objTwo)
	{
	    var valueObjOne,
	        valueObjTwo,
	        prop;
	    
		// for each property in the second object
		for(prop in objTwo){
		    valueObjOne = objOne[prop];
		    valueObjTwo = objTwo[prop];
		    
		    // is this another object
            if(valueObjOne && valueObjOne.constructor === Object) {
                // recurse into this object
                objOne[prop] = bbc.fmtj.av.emp.mergeObjects(valueObjOne, valueObjTwo);
            }
            // else it's a simple property, so override
            else{
                objOne[prop] = objTwo[prop];
            }
        }
                
        return objOne;
    },
    
    /**
     * Creates the live stats url for a page's popout
     *
     * @param String liveStatsUrl The live stats url used on the parent page
     * @param String randomNo A random no to use (optional, only should be used in testing)
     * @returns String The live stats url for the popout
     */
    liveStatsForPopout: function(liveStatsUrl, randomNo){
        // get a random 2 digit number (between 10 & 99)
        // NOTE: for testing allow the random no to be passed in
        randomNo = randomNo || Math.floor((Math.random() * 90) + 10);
                           // matches ~t~RS~HighWeb_AV, appends _D
        return liveStatsUrl.replace(/(~t~RS~[^~]*)/, '$1_D')
                           // matches the random id for liveStats e.g ~z~RS~07
                           .replace(/(~z~RS~)[^~]*/, '$1' + randomNo);
    }
	
};

bbc.fmtj.utils.createObject('bbc.fmtj.page.empConfig');
bbc.fmtj.page.empConfig.base = {
	configUrl: '/player/emp/2_0_55/config/default.xml'
};
bbc.fmtj.page.empConfig.base.audio = {};
bbc.fmtj.page.empConfig.base.audio.full = {
	width: 512, 
	height: 115
};
bbc.fmtj.page.empConfig.base.audio.small = {
	width: 226, 
	height: 115
};
bbc.fmtj.page.empConfig.base.noFlashMessage = {
    heading:  'Cannot play media.',
    bodyText: 'You do not have the correct version of the flash player.',
    linkText: 'Download the correct version',
    linkUrl:  'http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash'
};
bbc.fmtj.page.empConfig.base.noFlashTemplate = {
    audio: '<div class="audioImage"></div><div class="warning"><p><strong>{heading}</strong> {bodyText} <a href="{linkUrl}">{linkText}</a></p></div>',
    video: '<img class="holding" src="{holding}" width="{width}" height="{height}"><div class="warning"><p><strong>{heading}</strong> {bodyText} <a href="{linkUrl}">{linkText}</a></p></div>'
};
bbc.fmtj.page.empConfig.base.player = {
	uxHighlightColour: '0xff0000',
	toolbarPadding: 0
};
bbc.fmtj.page.empConfig.base.plugins = {};
bbc.fmtj.page.empConfig.base.plugins.fmtjLiveStats = {};
bbc.fmtj.page.empConfig.base.settings = {
    showShareButton: 'true'
};
bbc.fmtj.page.empConfig.base.video = {};
bbc.fmtj.page.empConfig.base.video.standard = {
	width: 448,
	height: 252
};
bbc.fmtj.page.empConfig.democracylive_cymru = {
	configUrl: '/player/emp/2_0_55/config/cy.xml'
};
bbc.fmtj.page.empConfig.democracylive_cymru.noFlashMessage = {
      heading:  'Ni ellir chwarae\'r deunydd.',
      bodyText: 'Nid yw\'r fersiwn Flash Player priodol gennych.',
      linkText: 'Lawrlwythwch y fersiwn cywir'
};
bbc.fmtj.page.empConfig.democracylive_cymru.settings = {
	language: 'cy'
};
bbc.fmtj.page.empConfig.newyddion = {
	configUrl: '/player/emp/2_0_55/config/cy.xml'
};
bbc.fmtj.page.empConfig.newyddion.noFlashMessage = {
	heading:  'Ni ellir chwarae\'r deunydd.',
	bodyText: 'Nid yw\'r fersiwn Flash Player priodol gennych.',
	linkText: 'Lawrlwythwch y fersiwn cywir'
};
bbc.fmtj.page.empConfig.newyddion.settings = {
	language: 'cy'
};
bbc.fmtj.page.empConfig.sport = {};
bbc.fmtj.page.empConfig.sport.player = {
    uxHighlightColour: '0xEED71C',
    wmode: 'transparent'
};
bbc.fmtj.page.empConfig.weather = {};
bbc.fmtj.page.empConfig.weather.player = {
	wmode: 'opaque',
	uxHighlightColour: '0x6699CC'
};
