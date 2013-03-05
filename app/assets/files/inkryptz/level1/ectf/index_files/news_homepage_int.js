document.write('<!-- Copyright 2008 DoubleClick, a division of Google Inc. All rights reserved. -->\r\n<!-- Code auto-generated on Wed Feb 06 05:53:25 EST 2013 -->\r\n<script src=\"http://s0.2mdn.net/879366/flashwrite_1_2.js\"><\/script>');document.write('\r\n');

function DCFlash(id,pVM){
var swf = "http://s0.2mdn.net/1016719/1300201_TAM1_728x90_V01.swf";
var gif = "http://s0.2mdn.net/1016719/1300201_TAM1_TAM1_728x90.jpg";
var minV = 8;
var FWH = ' width="728" height="90" ';
var url = escape("http://ad.doubleclick.net/click%3Bh%3Dv8/3d82/3/0/%2a/j%3B268380473%3B0-0%3B0%3B94205266%3B3454-728/90%3B52725344/52678332/1%3B%3B%7Efdr%3D268409715%3B0-0%3B0%3B19196818%3B3454-728/90%3B52744652/52697625/1%3B%3B%7Eokv%3D%3Bslot%3Dleaderboard%3Bsz%3D728x90%2C970x66%2C970x90%2C970x250%3Bsectn%3Dnews%3Bctype%3Dindex%3Bnews%3Dhomepage_int%3Breferrer%3Dnonbbc%3Bdomain%3Dwww.bbc.com%3Breferrer_domain%3Dwww.google.co.in%3Brsi%3D%3Bheadline%3Dindex%3B%7Esscs%3D%3fhttp://www.lufthansa.com/in/en/Homepage?&WT.mc_id=IN_onlad");
var fscUrl = url;
var fscUrlClickTagFound = false;
var wmode = "opaque";
var bg = "";
var dcallowscriptaccess = "never";

var openWindow = "false";
var winW = 0;
var winH = 0;
var winL = 0;
var winT = 0;

var moviePath=swf.substring(0,swf.lastIndexOf("/"));
var sm=new Array();


var defaultCtVal = escape("http://ad.doubleclick.net/click%3Bh%3Dv8/3d82/3/0/%2a/j%3B268380473%3B0-0%3B0%3B94205266%3B3454-728/90%3B52725344/52678332/1%3B%3B%7Efdr%3D268409715%3B0-0%3B0%3B19196818%3B3454-728/90%3B52744652/52697625/1%3B%3B%7Eokv%3D%3Bslot%3Dleaderboard%3Bsz%3D728x90%2C970x66%2C970x90%2C970x250%3Bsectn%3Dnews%3Bctype%3Dindex%3Bnews%3Dhomepage_int%3Breferrer%3Dnonbbc%3Bdomain%3Dwww.bbc.com%3Breferrer_domain%3Dwww.google.co.in%3Brsi%3D%3Bheadline%3Dindex%3B%7Esscs%3D%3fhttp://www.lufthansa.com/in/en/Homepage?&WT.mc_id=IN_onlad");
var ctp=new Array();
var ctv=new Array();
ctp[0] = "clickTag";
ctv[0] = "";


var fv='"moviePath='+moviePath+'/'+'&moviepath='+moviePath+'/';
for(i=1;i<sm.length;i++){if(sm[i]!=""){fv+="&submovie"+i+"="+escape(sm[i]);}}
for(var ctIndex = 0; ctIndex < ctp.length; ctIndex++) {
  var ctParam = ctp[ctIndex];
  var ctVal = ctv[ctIndex];
  if(ctVal != null && typeof(ctVal) == 'string') {
    if(ctVal == "") {
      ctVal = defaultCtVal;
    }
    else {
      ctVal = escape("http://ad.doubleclick.net/click%3Bh%3Dv8/3d82/3/0/%2a/j%3B268380473%3B0-0%3B0%3B94205266%3B3454-728/90%3B52725344/52678332/1%3B%3B%7Efdr%3D268409715%3B0-0%3B0%3B19196818%3B3454-728/90%3B52744652/52697625/1%3B%3B%7Eokv%3D%3Bslot%3Dleaderboard%3Bsz%3D728x90%2C970x66%2C970x90%2C970x250%3Bsectn%3Dnews%3Bctype%3Dindex%3Bnews%3Dhomepage_int%3Breferrer%3Dnonbbc%3Bdomain%3Dwww.bbc.com%3Breferrer_domain%3Dwww.google.co.in%3Brsi%3D%3Bheadline%3Dindex%3B%7Esscs%3D%3f" + ctVal);
    }
    if(ctParam.toLowerCase() == "clicktag") {
      fscUrl = ctVal;
      fscUrlClickTagFound = true;
    }
    else if(!fscUrlClickTagFound) {
      fscUrl = ctVal;
    }
    fv += "&" + ctParam + "=" + ctVal;
  }
}
fv+='"';
var bgo=(bg=="")?"":'<param name="bgcolor" value="#'+bg+'">';
var bge=(bg=="")?"":' bgcolor="#'+bg+'"';
function FSWin(){if((openWindow=="false")&&(id=="DCF0"))alert('openWindow is wrong.');
var dcw = 800;
var dch = 600;
// IE
if(!window.innerWidth)
{
  // strict mode
  if(!(document.documentElement.clientWidth == 0))
  {
    dcw = document.documentElement.clientWidth;
    dch = document.documentElement.clientHeight;
  }
  // quirks mode
  else if(document.body)
  {
    dcw = document.body.clientWidth;
    dch = document.body.clientHeight;
  }
}
// w3c
else
{
  dcw = window.innerWidth;
  dch = window.innerHeight;
}
if(openWindow=="center"){winL=Math.floor((dcw-winW)/2);winT=Math.floor((dch-winH)/2);}window.open(unescape(fscUrl),id,"width="+winW+",height="+winH+",top="+winT+",left="+winL+",status=no,toolbar=no,menubar=no,location=no");}this.FSWin = FSWin;
ua=navigator.userAgent;
if(minV<=pVM&&(openWindow=="false"||(ua.indexOf("Mac")<0&&ua.indexOf("Opera")<0))){
	var adcode='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="'+id+'"'+FWH+'>'+
		'<param name="movie" value="'+swf+'"><param name="flashvars" value='+fv+'><param name="quality" value="high"><param name="wmode" value="'+wmode+'"><param name="base" value="'+swf.substring(0,swf.lastIndexOf("/"))+'"><PARAM NAME="AllowScriptAccess" VALUE="'+dcallowscriptaccess+'">'+bgo+
		'<embed src="'+swf+'" flashvars='+fv+bge+FWH+' type="application/x-shockwave-flash" quality="high" swliveconnect="true" wmode="'+wmode+'" name="'+id+'" base="'+swf.substring(0,swf.lastIndexOf("/"))+'" AllowScriptAccess="'+dcallowscriptaccess+'"></embed></object>';
  if(('j'!="j")&&(typeof dclkFlashWrite!="undefined")){dclkFlashWrite(adcode);}else{document.write(adcode);}
}else{
	document.write('<a target="_blank" href="'+unescape(url)+'"><img src="'+gif+'"'+FWH+'border="0" alt="Advertisement" galleryimg="no"></a>');
}}
function getFlashVersion(){
// code derived from SWFObject (http://code.google.com/p/swfobject/)
 var vfv = "0,0,0";
 try {
 try {
   var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
     try {axo.AllowScriptAccess = "always"; }catch(e) {return "6";}
 }catch(e) {}
 vfv = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");}
 catch(e) {
   try {if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){vfv= navigator.plugins["Shockwave Flash"].description;}}
   catch(e) {}
 }
 return vfv.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1].split(',').shift();
}
var DCid=(isNaN("268380473"))?"DCF2":"DCF268380473";
var pVM=getFlashVersion();
eval("function "+DCid+"_DoFSCommand(c,a){if(c=='openWindow')o"+DCid+".FSWin();}o"+DCid+"=new DCFlash('"+DCid+"',pVM);");
//-->

document.write('\r\n<noscript><a target=\"_blank\" href=\"http://ad.doubleclick.net/click%3Bh%3Dv8/3d82/3/0/%2a/j%3B268380473%3B0-0%3B0%3B94205266%3B3454-728/90%3B52725344/52678332/1%3B%3B%7Efdr%3D268409715%3B0-0%3B0%3B19196818%3B3454-728/90%3B52744652/52697625/1%3B%3B%7Eokv%3D%3Bslot%3Dleaderboard%3Bsz%3D728x90%2C970x66%2C970x90%2C970x250%3Bsectn%3Dnews%3Bctype%3Dindex%3Bnews%3Dhomepage_int%3Breferrer%3Dnonbbc%3Bdomain%3Dwww.bbc.com%3Breferrer_domain%3Dwww.google.co.in%3Brsi%3D%3Bheadline%3Dindex%3B%7Esscs%3D%3fhttp://www.lufthansa.com/in/en/Homepage?&WT.mc_id=IN_onlad\"><img src=\"http://s0.2mdn.net/1016719/1300201_TAM1_TAM1_728x90.jpg\" width=\"728\" height=\"90\" border=\"0\" alt=\"Advertisement\" galleryimg=\"no\"></a></noscript>\r\n');
