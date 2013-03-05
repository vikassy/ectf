if(!window.top.document.domain.match(/yahoo/i)){
var groupm_referrer=encodeURIComponent(document.referrer);
var groupm_url=encodeURIComponent(window.location);
(function() {
var sm = document.createElement('script'); sm.type = 'text/javascript'; sm.async = true;
sm.src = '//dm.de.mookie1.com/2/groupm/synch/1@x51?_RM_HTML_groupm_referrer_='+groupm_referrer+'&_RM_HTML_groupm_url_='+groupm_url;
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sm, s);
})();
}
