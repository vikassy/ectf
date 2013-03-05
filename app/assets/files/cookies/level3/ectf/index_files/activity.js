var luckyMe = Math.random() * 100;
if(luckyMe>150){
scrollFunction();
window.onscroll = scrollFunction;
}
function getScrollXY() {
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfY ];
}
var CounterForScroll=0;
var localCounter = 0;
var getUrl = "";
function scrollFunction() {

  var jScroll = parseInt(getScrollXY());
  var jHeight =  parseInt(document.documentElement.clientHeight);
var jTotal=jScroll + jHeight;
  var jTotalH = document.documentElement.scrollHeight;
  var jsPercent = (jTotal * 100) / jTotalH;

getUrl = "http://ibeat.indiatimes.com/iBeatActivity/scrolllog.html?"+
				"h="+_Activitypage_config.host+
				"&url="+ _Activitypage_config.url +
				"&s=" + _Activitypage_config.session + 
				"&p=" + jsPercent +
				"&author=" + _Activitypage_config.author +
				"&height=" + jTotal +
				"&cat=" + _Activitypage_config.cat;
 localCounter = localCounter + 1;
   if (CounterForScroll == 0){ 
        CounterForScroll = CounterForScroll + 1;
	var t=setTimeout("Reset()",200);
}
	  }


function Reset(){
localCounter = 0;
CounterForScroll = 0;
sendGetRequest(getUrl);
}

	  function sendGetRequest(request) {
				var img = new Image(1,1);
				img.src = request;
		}
if(luckyMe>50){
scrollFunction();
}

