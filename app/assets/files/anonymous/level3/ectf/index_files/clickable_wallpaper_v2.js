var ebScriptFileName = "clickable_wallpaper_v2.js";
var ebDU;
var ebDU_id;
var ebRightDiv;
var ebLeftDiv; 
var mmWPisOpen;
var ebScriptQuery = function(scriptPath) {
  this.scriptPath = scriptPath;
}
ebScriptQuery.prototype = {
  get: function() {
	var srcRegex = new RegExp(this.scriptPath.replace('.', '\\.') + '(\\?.*)?$');
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      if (script.src && script.src.match(srcRegex)) {
        var query = script.src.match(/\?([^#]*)(#.*)?/);
        return !query ? '' : query[1];
      }
    }
    return '';
  },
  parse: function() {
    var result = {};
    var query = this.get();
    var components = query.split('&');
 
    for (var i = 0; i < components.length; i++) {
      var pair = components[i].split('=');
      var name = pair[0], value = pair[1];
 
      if (!result[name]) result[name] = [];
      // decode
      if (!value) {
        value = 'true';
      } else {
        try {
          value = decodeURIComponent(value);
        } catch (e) {
          value = unescape(value);
        }
      }
 
      // MacIE way
      var values = result[name];
      values[values.length] = value;
    }
    return result;
  },
  flatten: function() {
    var queries = this.parse();
    for (var name in queries) {
      queries[name] = queries[name][0];
    }
    return queries;
  },
  toString: function() {
    return 'ebScriptQuery [path=' + this.scriptPath + ']';
  }
}

//verify by Ad ID or Flight ID
try{
	var gEbQueries = new ebScriptQuery(ebScriptFileName).flatten();	
	if(gEbQueries["type"] == 'oob'){ // out-of-banner/floating ad
		if(typeof(gEbEyes) != "undefined") {			
			// check is the same as the ad is defined in the script
			if(gEbQueries["adid"]){
				for(i = gEbEyes.length-1; i>-1; i--){
					if(gEbEyes[i].adData.nAdID == gEbQueries["adid"]){
						gEbEyes[i].adData.customEventHandler = new ebCCustomEventHandlers();
						break;
					}
				}
			}
			if(gEbQueries["flightid"]){
				for(i = gEbEyes.length-1; i>-1; i--){					
					if(gEbEyes[i].adData.nFlightID == gEbQueries["flightid"]){
						gEbEyes[i].adData.customEventHandler = new ebCCustomEventHandlers();
						break;
					}
				}			
			}
		}
	} else{ //rich banner / default
		if(typeof(gEbBanners) != "undefined"){			
			if(gEbQueries["adid"]){	
				for(i = gEbBanners.length-1; i>-1; i--){
					if(gEbBanners[i].adData.nAdID == gEbQueries["adid"]){
						gEbBanners[i].adData.customEventHandler = new ebCCustomEventHandlers();
						ebDU_id = i;
						break;
					}
				}
			}
			if(gEbQueries["flightid"]){
				for(i = gEbBanners.length-1; i>-1; i--){			
					if(gEbBanners[i].adData.nFlightID == gEbQueries["flightid"]){
						gEbBanners[i].adData.customEventHandler = new ebCCustomEventHandlers();
						ebDU_id = i;
						break;
					}
				}	
			}
			
		}
	}

}
catch(e){}

function CustomScriptClass()
{
	this.DU					= null;
	this.refElementName			= null;
	this.refElement				= null;
	this.refElementLeft			= null;
	this.refElementTop			= null;
	this.panelLeftOffset			= null;
	this.panelTopOffset			= null;
	this.panelName				= null;
	this.repositionOnScroll			= false;
	this.clientArea				= null;
	this.initialized			= false;
	this.isStrictDocType			= false;
	this.contentWidth 			= null;
	this.wpHeight				= 0;
	this.ebLinkLeft				= null;
	this.ebLinkRight 			= null;
}

var csParams = new CustomScriptClass();

function ebCCustomEventHandlers()
{
	this.onAfterDefaultBannerShow = function(objName)
	{
		ebDU = eval(objName);
		try { 
			gEbDbg.always("on afetr defaulbannershow");
			init(objName);

		}
		catch(err){
			gEbDbg.error("on afetr defaulbannershow exception: " + e.description);
		}
		
		
	}
	


	this.onClientScriptsLoaded = function(objName) {}
	this.onBeforeAddRes = function(objName) {}
	this.onHandleInteraction = function(objName, intName, strObjID)	{}
	this.onBeforeDefaultBannerShow = function(objName) {}
	//this.onAfterDefaultBannerShow = function(objName) {}
	this.onBeforeRichFlashShow = function(objName) {}
	this.onAfterRichFlashShow = function(objName) {}
	this.onBeforePanelShow = function(objName, panelName) {}
	this.onAfterPanelShow = function(objName, panelName) {
		
		try
		{
			if(!csParams.initialized) {
				gEbDbg.error("onAfterPanelShow - params are not initialized - initializing again");
				init(objName);
			}
			if(csParams.initialized)
			{
				gEbDbg.error("on after panelShow --- csParams initialized");
				panelName = panelName.toLowerCase();
				if(csParams.panelName && (panelName == csParams.panelName.toLowerCase()))
				{
					if(csParams.panelLeftOffset != null) {
						csParams.DU.ad.panels[csParams.panelName].panelDiv.style.left = (csParams.refElementLeft + csParams.panelLeftOffset ) + "px";
					}
					if(csParams.panelTopOffset != null) {
						csParams.DU.ad.panels[csParams.panelName].panelDiv.style.top = (csParams.refElementTop + csParams.panelTopOffset ) + "px";
					}

				}
				if(panelName.indexOf("fixed") > - 1 && isFixedSupported()) {
					gEbDbg.error("fixing panel");
					csParams.DU.ad.panels[panelName].panelDiv.style.position = "fixed";
					csParams.DU.ad.panels[panelName].panelDiv.style.zIndex = gEbDisplayPage.TI.getDoc().getElementById("eyeDiv").style.zIndex + 10;
					gEbDbg.error("fixed panel " + panelName);
				}
			}
			
		}
		catch(e) {
			gEbDbg.error("Error in " + ebScriptFileName + ":onAfterPanelShow(): " + e.description);
		}
	}
	this.onBeforePanelHide = function(objName, panelName) {}
	this.onAfterPanelHide = function(objName, panelName) {}
	this.onBeforeAdClose = function(objName) {}
	this.onAfterAdClose = function(objName)	{}
	this.onBeforeIntroShow = function(objName) {}
	this.onAfterIntroShow = function(objName) {}
	this.onBeforeIntroHide = function(objName) {}
	this.onAfterIntroHide = function(objName) {}
	this.onBeforeRemShow = function(objName) {}
	this.onAfterRemShow = function(objName) {}
	this.onBeforeRemHide = function(objName) {}
	this.onAfterRemHide = function(objName) {}
	this.onBeforeMiniSiteShow = function(objName) {}
	this.onAfterMiniSiteShow = function(objName) {}
	this.onBeforeMiniSiteHide = function(objName) {}
	this.onAfterMiniSiteHide = function(objName) {}



}


var ebOldBackground;
var ebOldbackgroundPosition;
var ebOldbackgroundColor;
var ebOldbackgroundRepeat;
var ebOldbackgroundAttachment;


try{
	showBack();
	if(screen.width  >= 1024 && screen.width < 1280) {
		hideHorizontalScrollbar();

	}
}
catch(err){}

function showBack(){
	try {
		var wp_url = null;
		if(gEbQueries["wp_url"]) {
			wp_url = gEbQueries["wp_url"];
		}
		else if (gEbQueries["asset_id"]){
			if (ebDU == null) {
				ebDU = gEbBanners[ebDU_id].displayUnit;
				top.ebDU = ebDU;
			}
			wp_url = "http://ds.serving-sys.com/BurstingRes/"+ebDU.ad.nonVideoAssets["ebMovie"+gEbQueries["asset_id"]].url; 
		}
		if(wp_url) {
			var win = top.document;
			ebOldBackground = win.body.style.backgroundImage;
			ebOldbackgroundPosition =  win.body.style.backgroundPosition;
			ebebOldbackgroundColor = win.body.style.backgroundColor;
			ebOldbackgroundRepeat = win.body.style.backgroundRepeat;
			ebOldbackgroundAttachment = win.body.style.backgroundAttachment;


			win.body.style.backgroundPosition ="50% 0%";
			win.body.style.backgroundImage="url(" + wp_url + ")";
			//my_win.body.style.backgroundColor="#fff";
			win.body.style.backgroundRepeat = "no-repeat";
			win.body.style.backgroundAttachment = "fixed";
		}
	}
	catch(e) {
		gEbDbg.error("exception at showBack() " + e.description);
	}


}

function closeBack() {
	try {
		var win = top.document;
		win.body.style.backgroundAttachment = ebOldbackgroundAttachment;
		win.body.style.backgroundPosition = ebOldbackgroundPosition;
		win.body.style.backgroundColor = ebebOldbackgroundColor;
		win.body.style.backgroundImage = ebOldBackground;
		win.body.style.backgroundRepeat = ebOldbackgroundRepeat;
		mmWPisOpen = false;
		removeClickFromWP();

	}
	catch(e) {
		gEbDbg.error("exception at closeBack() " + e.description);
	}
	

}

function hideHorizontalScrollbar(){
	try{
		var d = top.document;
		if(! gEbBC.isIE()) {
			d.body.style.overflowX = "hidden";
		}
		else {
			var ds = d.styleSheets;
			ds[0].addRule("html", "overflow-x: hidden");
		}

		
	}
	catch(e){
		gEbDbg.error("on afetr hideHorizontalScrollbar exception: " + e.description);
	}
}

function init(objName)
{
	try
	{
		csParams.DU = eval(objName);
		csParams.clientArea = new ebCClientArea(gEbDisplayPage.TI);
		csParams.clientArea.calc();
		csParams.wpHeight = gEbQueries["wpHeight"]? gEbQueries["wpHeight"] : getWindowDim().height;
		csParams.refElementName = gEbQueries["refElement"];
		gEbDbg.error("refElement name is: " + csParams.refElementName);		
		if(csParams.refElementName) {
			csParams.refElement = gEbDisplayPage.TI.getDoc().getElementById(csParams.refElementName);
		}
		if(csParams.refElement) {
			csParams.refElementLeft = ebGetRealLeft(csParams.refElement);
			csParams.refElementTop = ebGetRealTop(csParams.refElement);
			gEbDbg.error("ref element: " + csParams.refElement);
		}
		gEbDbg.error("refElement name is: " + csParams.refElementName);
		
		// Save all query params
		if(gEbQueries["panelLeftOffset"]) {
			csParams.panelLeftOffset = parseInt(gEbQueries["panelLeftOffset"]);
		}
		if(gEbQueries["panelTopOffset"]) {
			csParams.panelTopOffset = parseInt(gEbQueries["panelTopOffset"]);
		}
		if(gEbQueries["panelName"]) {
			csParams.panelName = gEbQueries["panelName"].toLowerCase();
		}
		
		csParams.DU.doOnResizeOld = csParams.DU.doOnResize;
		csParams.DU.doOnResize = doOnResizeNew;
		csParams.DU.doOnScrollNew  = doOnScrollNew;
		
		csParams.contentWidth = gEbQueries["contentWidth"]? parseFloat(gEbQueries["contentWidth"]) : csParams.refElement.offsetWidth;
		
		csParams.initialized = true;
		setClickableWp();

		gEbDbg.error("finished init()");
		//window.c = 0;

	}
	catch(e) {
		gEbDbg.error("Error in " + ebScriptFileName + ":init(): " + e.description);
	}
}

function doOnResizeNew() {
	try {
		csParams.DU.doOnResizeOld();
		var w = (getWindowDim().width - csParams.contentWidth)/2;
		w = Math.floor(w);
		if(mmWPisOpen) {
			csParams.ebLinkLeft.style.width = w + "px";
			csParams.ebLinkRight.style.width = w + "px";
			ebRightDiv.style.left = w + csParams.contentWidth +"px";
		}
	}
	catch(e) {
		gEbDbg.error("Error in " + ebScriptFileName + ":doOnResizeNew((): " + e.description);
	}
}
function doOnScrollNew() {}


function isFixedSupported() {
	var ret = true;
	var doc = gEbDisplayPage.TI.getDoc();	
	if(gEbBC.isIE() && gEbBC.getVersion()< 7) {
		ret = false;
	}
	else if( gEbBC.isIE()) {
		if (doc.documentMode)
                {
                    if (doc.documentMode < 7)
                        ret = false;
                }
		else if (doc.compatMode)
                {
                    if (doc.compatMode != "CSS1Compat")
                        ret = false;
                }
	}
	return ret;
}

function getWindowDim() {
	var w = new Object();
	if(gEbBC.isIE()) {
		csParams.clientArea.calc();
		w.width = csParams.clientArea.nWidth;
		w.height = csParams.clientArea.nHeight - 2;
	}
	else {
		if (gEbDisplayPage.TI.getDoc().body && gEbDisplayPage.TI.getDoc().body.offsetWidth) {
 			w.width = gEbDisplayPage.TI.getDoc().body.offsetWidth;
			w.height = gEbDisplayPage.TI.getDoc().body.offsetHeight;
		}
		if (gEbDisplayPage.TI.getDoc().compatMode=='CSS1Compat' &&
   			gEbDisplayPage.TI.getDoc().documentElement &&
			gEbDisplayPage.TI.getDoc().documentElement.offsetWidth ) {
			w.width = gEbDisplayPage.TI.getDoc().documentElement.offsetWidth;
			w.height = gEbDisplayPage.TI.getDoc().documentElement.offsetHeight;

		}
		if (gEbDisplayPage.TI.innerWidth && gEbDisplayPage.TI.innerHeight) {
			w.width = gEbDisplayPage.TI.innerWidth;
			w.height = gEbDisplayPage.TI.innerHeight;
		}
	}
	
	return w;

}

function setClickableWp() {
	try {
	        gEbDbg.error("setClickableWp() - start");
		csParams.ebLinkLeft = gEbDisplayPage.TI.getDoc().createElement('a');
		csParams.ebLinkRight = gEbDisplayPage.TI.getDoc().createElement('a');
		ebLeftDiv = gEbDisplayPage.TI.getDoc().createElement('DIV');
		ebRightDiv = gEbDisplayPage.TI.getDoc().createElement('DIV');
		var parent = gEbDisplayPage.TI.getDoc().getElementById("eyeDiv");
		if (parent == null) 
			parent = gEbDisplayPage.TI.getDoc().body;

		//gEbDisplayPage.TI.getDoc().write("222222 ");

		parent.appendChild(ebLeftDiv)
		parent.appendChild(ebRightDiv);
		//parent.insertBefore(ebLeftDiv, parent.fistChild);
		//parent.insertBefore(ebRightDiv, parent.fistChild);
		ebLeftDiv.appendChild(csParams.ebLinkLeft);
		ebRightDiv.appendChild(csParams.ebLinkRight);
		var w = (getWindowDim().width - csParams.contentWidth)/2;
		if(w < 0) {
			w = 0;
		}
		w = Math.floor(w);

		csParams.ebLinkLeft.style.width = w + "px";
		csParams.ebLinkRight.style.width = w + "px";
		csParams.ebLinkLeft.style.height = csParams.wpHeight + "px";
		csParams.ebLinkRight.style.height = csParams.wpHeight + "px";
	
		if(isFixedSupported()) {
			ebLeftDiv.style.position = ebRightDiv.style.position = csParams.ebLinkLeft.style.position = csParams.ebLinkRight.style.position = "fixed" ;
		}
		else {
			ebLeftDiv.style.position = ebRightDiv.style.position = csParams.ebLinkLeft.style.position = csParams.ebLinkRight.style.position = "absolute" ;
		}
	
		ebLeftDiv.style.left = "0px";
		ebLeftDiv.style.top = "0px";
		csParams.ebLinkLeft.style.zIndex = 1;
		ebRightDiv.style.left = w + csParams.contentWidth +"px";
		gEbDbg.error("w=" + w + " csParams.contentWidth=" + csParams.contentWidth);
		ebRightDiv.style.top = "0px";
		csParams.ebLinkRight.style.zIndex = 1;

		ebLeftDiv.id = "eb_wp_left_layer";
		ebRightDiv.id = "eb_wp_right_layer";

		csParams.ebLinkLeft.onclick = openTarget;
		csParams.ebLinkLeft.href= "javascript:void(0)";
		csParams.ebLinkRight.onclick = openTarget;
		csParams.ebLinkRight.href= "javascript:void(0)";
		mmWPisOpen = true;
		gEbDbg.error("setClickableWp() - end");
	}
	catch(e) {
		document.write(e);
		gEbDbg.error("Error in " + ebScriptFileName + ":setClickableWp(): " + e.description);
	}
}


function removeClickFromWP() {
	try{
		mmWPisOpen = false;
		ebLeftDiv.style.width = "0px";
		ebRightDiv.style.width = "0px";
		csParams.ebLinkLeft.style.width = "0px";
		csParams.ebLinkRight.style.width = "0px";

	}
	catch(err){
		gEbDbg.error("Error in " + ebScriptFileName + ":removeClickFromWP(): " + e.description);
	}
}

function openTarget() {
try{
	removeClickFromWP();
	csParams.DU.interactions['_eyeblaster'].fCloseFlag = 0;
	csParams.DU.ebinteractionHandler('_eyeblaster');
	setClickableWp();

}
catch(err){}

}