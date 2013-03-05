/*******************Extension Check for Chrome****************************/
setTimeout('checkExtension()',5500);

function checkExtension()
{
	if((navigator.userAgent.toLowerCase().indexOf('chrome') > -1)) {
		if(document.getElementsByClassName("notifier_active").length<=0)
		{
			//$('body').append('<div id="ext_toolbar"></div>');
			document.getElementById('ext_toolbar').style.display='block';
			loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js",showToolbar);
		}
	}
}


function showToolbar() {
 $('#ext_toolbar').append("<div id=\"ext_toolbar_text\"><table width='100%' border='0' style= 'width:100%;height:33px;background:url(http://im.sify.com/home2012/images/bg-new.jpg) repeat-x center;' align='center'><tr><td width='1000' align='center'><table width='940' border='0' align='left' ><tr><td align='center'><div style='width:540px;height:auto;float:left;font: normal 14px  Arial, Helvetica, sans-serif;color:#FFFFFF;text-align:right;padding:5px 0 0 220px;text-shadow:.5px .5px #68a100;'><a href='javascript:openExtension();' style='font: normal 14px  Arial, Helvetica, sans-serif;color:#FFFFFF;text-shadow:.5px .5px #68a100;text-decoration:none;'> Get instant notifications on the latest news with the Sify Notifier Chrome extension</a></div><div style='width:100px;height:auto;float:left;padding:0 0 0 30px;'><img onclick='openExtension()' src='http://im.sify.com/home2012/images/but.gif' width='126' height='25' /></div>   </td></tr></table></td><td  width='60'  valign='top' style='padding:5px 0 0 0;'><img onclick='closeToolbar()' src='http://im.sify.com/home2012/images/chromtension.gif' width='44' height='15' /></td></tr></table></div>");
 $('#ext_toolbar_text').css({ whiteSpace:"nowrap", "-webkit-user-select":"none", cursor: "default", zindex:"100000"});
        
        //if(toolbarConfig.slide) {
                $('#ext_toolbar').hide().slideDown('fast');
        //}
//      $('#ext_toolbar_close').click(closeToolbar);
//      $('#ext_toolbar_install').click(installExtension); // currently set to open directory not direct download
//      $('#ext_toolbar_link').click(openExtension); // currently set to open directory not direct download
        
        $("embed").attr("wmode", "opaque");
       $(window).resize(flow); 
        //$(window).scroll(move);
        //move();

}

function closeToolbar() {
	$('#ext_toolbar').slideUp('fast'); 
	//localStorage[toolbarConfig.hide] = true;
}

function openExtension() {
	closeToolbar();
	window.open("https://chrome.google.com/webstore/detail/defcclddohmcolbjeojblocoebckhaam");
}
function installExtension() {
	closeToolbar();
	window.open("https://clients2.google.com/service/update2/crx?response=redirect&x=id%3Ddefcclddohmcolbjeojblocoebckhaam%26uc");
}
function flow() {
	//$('#ext_toolbar_text').width($(window).width() - 170);
	$("#ext_toolbar").css({width:$(window).width()});
}

function move() {
 closeToolbar();

/*	if($(window).scrollTop() <= 1) {
		$("#ext_toolbar").css({position:"relative", top: 0});
	}
	else {
		$("#ext_toolbar").css({position:"absolute", top: $(window).scrollTop()+"px", width:$(window).width(), zIndex:"9900000"});
	}
	flow();*/

}

function loadScript(url, callback){
	// include remote list
    var script = document.createElement("script")
    script.type = "text/javascript";
	script.onload = function(){
		loaded = true;
		callback();
	};
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
/*******************End Of Extension Check****************************/
