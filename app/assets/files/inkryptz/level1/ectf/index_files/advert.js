(function(){bbc.fmtj.utils.createObject("bbc.fmtj.view.advert");var f={};f.namespace="bbc.fmtj.view.advert";f.version="0.0.0";var d;gloader.load(["glow","1","glow.dom"],{onLoad:function(k){d=k.dom}});var c=BBC.adverts;var g={};var b={};var i;var e;var j;var h={};a("advert-companion","companion");a("advert-button","genericAd",["button"]);a("advert-leaderboard","leaderboard",["leaderboard"]);a("advert-mpu-early","earlyAd",["mpu"]);a("advert-mpu","genericAd",["mpu"]);a("advert-mpu-high","emptySlot",["mpu_high"]);a("advert-mpu-low","genericAd",["mpu"]);a("advert-mpu-bottom","genericAd",["mpu_bottom"]);a("advert-sponsor-module","sponsorModule");a("advert-sponsor-section","sponsor",["section"]);a("advert-sponsor-subsection","sponsor",["subsection"]);a("advert-google-adsense","adSense",["mpu"]);a("advert-partner-button","partnerButtons",[2,4]);function a(n,q,m){var o=n;var p=q;var l=m;g[n]={slotType:o,renderAdvert:k,postScriptLoad:r};function k(){var t;(l!==undefined)?t=l:t=[];for(var s=0;s<arguments.length;s++){t.push(arguments[s])}b[p].apply(this,t)}function r(){var u=b[p+"-onload"];if(u!==undefined){var t;(l!==undefined)?t=l:t=[];for(var s=0;s<arguments.length;s++){t.push(arguments[s])}t.unshift(j);u.apply(this,t)}}}f.advert=function(m){if(g[m]!==undefined){var l=[];if(arguments.length>1){for(var k=1;k<arguments.length;k++){l.push(arguments[k])}}i=m;e=l;j=d.get(".bbccom_advert_placeholder");if(j.length<1){return false}if(j.length>1){j=j[j.length-1]}j.removeClass("bbccom_advert_placeholder");j.addClass("bbccom-advert");g[m].renderAdvert.apply(this,l)}};f["advert-post-script-load"]=function(){var k=e;g[i].postScriptLoad.apply(this,k);i=undefined;e=undefined;j=undefined};b.emptySlot=function(k){j.attr("id","bbccom_"+k);j.addClass("bbccom_display_none")};b.genericAd=function(k){j.attr("id","bbccom_"+k);j.addClass("bbccom_display_none");if(typeof(h[k])=="undefined"){c.write(k)}else{c.moveAd(k+"_early",k)}};b["genericAd-onload"]=function(k,l){c.show(l)};b.earlyAd=function(k){j.attr("id","bbccom_"+k+"_early");j.addClass("bbccom_display_none");c.write(k);h[k]=true};b["earlyAd-onload"]=function(k,l){};b.leaderboard=function(k){j.attr("id","bbccom_"+k);j.addClass("bbccom_display_none");c.write(k)};b["leaderboard-onload"]=function(k,l){c.show(l)};b.companion=function(k){j.attr("id","bbccom_companion_"+k);j.addClass("bbccom_visibility_hidden").addClass("bbccom_companion")};b.sponsorModule=function(l,k){var m={};if(l!==undefined&&l!==null){m.module=l}if(k!==undefined&&k!==null){m.topic=k}j.attr("id","bbccom_module_"+l);j.addClass("bbccom_display_none").addClass("bbccom_sponsor");j.prepend('<div class="bbccom_text">In association with</div>');c.write("module_"+l,false,m)};b["sponsorModule-onload"]=function(m,k,l){c.show("module_"+k)};b.sponsor=function(k){var l="In association with";j.attr("id","bbccom_sponsor_"+k);j.addClass("bbccom_display_none").addClass("bbccom_sponsor");j.prepend('<div class="bbccom_text">'+l+"</div>");c.write("sponsor_"+k,false)};b["sponsor-onload"]=function(l,k){c.show("sponsor_"+k)};b.adSense=function(k){window.bbc_adsense_slot="adsense_"+k;(bbc.fmtj.page.country=="us")?window.bbc_adsense_country=bbc.fmtj.page.country:window.bbc_adsense_country="rest";j.attr("id","bbccom_adsense_"+k);j.addClass("bbccom_display_none").addClass("bbccom_adsense");c.show("adsense_"+k);document.write('<script language="JavaScript" src="'+BBC.adverts.getScriptRoot()+'adsense_write.js"><\/script>')};b["adSense-onload"]=function(k,l){c.show("adsense_"+l)};b.partnerButtons=function(m,l){j.attr("id","bbccom_partner_button1");j.addClass("bbccom_display_none");j.prepend('<div class="bbccom_text">Advertising Partners</div>');var p,k,o=1;for(p=0;p<m;p++){for(k=0;k<l;k++){c.write("partner_button"+o++,false)}}};b["partnerButtons-onload"]=function(m,l,k){c.show("partner_button1")};bbc.fmtj.components.registerNamespace(f)})();