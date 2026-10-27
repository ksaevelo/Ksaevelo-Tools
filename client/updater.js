/* Ksaevelo Tools GitHub release notifier; no automatic installs. */
(function(){
  "use strict";
  var installed="0.0.1";
  var api="https://api.github.com/repos/ksaevelo/Ksaevelo-Tools/releases/latest";
  var releases="https://github.com/ksaevelo/Ksaevelo-Tools/releases";
  var latestUrl=releases, busy=false;
  function byId(id){return document.getElementById(id);}
  function storageRead(key){try{return localStorage.getItem(key)||"";}catch(e){return "";}}
  function storageWrite(key,val){try{localStorage.setItem(key,val);}catch(e){}}
  function setMessage(s){var e=byId("kt-update-result");if(e)e.textContent=s;}
  function parseVersion(s){var m=String(s||"").match(/^v?(\d+)\.(\d+)\.(\d+)(?:[-+]([\w.-]+))?$/i);return m?[+m[1],+m[2],+m[3],m[4]||""]:null;}
  function newer(a,b){var x=parseVersion(a),y=parseVersion(b);if(!x||!y)return false;for(var i=0;i<3;i++){if(x[i]!==y[i])return x[i]>y[i];}return !!y[3]&&!x[3];}
  function openRelease(){
    var target=latestUrl;
    try{if(window.cep&&window.cep.util&&window.cep.util.openURLInDefaultBrowser){window.cep.util.openURLInDefaultBrowser(target);return;}}catch(e){}
    try{window.open(target,"_blank");}catch(e){}
  }
  function hide(){var banner=byId("kt-update-banner");if(banner)banner.classList.remove("kt-show");}
  function show(tag,body,url){
    latestUrl=/^https:\/\/github\.com\/ksaevelo\/Ksaevelo-Tools\/releases\//.test(url||"")?url:releases;
    var title=byId("kt-update-title"),notes=byId("kt-update-notes"),banner=byId("kt-update-banner");
    if(title)title.textContent="Ksaevelo Tools "+tag+" is available!";
    if(notes)notes.textContent=(body||"A new update is ready.").slice(0,1000);
    if(banner)banner.classList.add("kt-show");
  }
  function check(manual){
    if(busy)return;
    busy=true;if(manual)setMessage("Checking GitHub Releases…");
    var xhr=new XMLHttpRequest();xhr.open("GET",api+"?t="+Date.now(),true);
    xhr.timeout=12000;xhr.setRequestHeader("Accept","application/vnd.github+json");
    xhr.onreadystatechange=function(){
      if(xhr.readyState!==4)return;
      busy=false;
      if(xhr.status!==200){setMessage(xhr.status===404?"No published GitHub release yet.":"Could not check updates (HTTP "+xhr.status+"). Try again later.");return;}
      try{
        var data=JSON.parse(xhr.responseText),tag=data.tag_name||"",url=data.html_url||releases;
        if(!parseVersion(tag)){setMessage("Latest release tag must be like v0.0.2.");return;}
        if(newer(tag,installed)){
          setMessage("Update available: "+tag+" (installed v"+installed+")");
          if(manual||storageRead("kt-updater-dismissed")!==tag)show(tag,data.body,url);
        }else{hide();setMessage("You're up to date (v"+installed+").");}
      }catch(e){setMessage("Could not read GitHub release information.");}
    };
    xhr.onerror=function(){busy=false;setMessage("Network unavailable. Updates will be checked later.");};
    xhr.ontimeout=function(){busy=false;setMessage("GitHub check timed out. Try again later.");};
    try{xhr.send(null);}catch(e){busy=false;setMessage("GitHub connection unavailable.");}
  }
  function init(){
    var btn=byId("kt-check-update"),dl=byId("kt-update-download"),later=byId("kt-update-later");
    if(btn)btn.addEventListener("click",function(){check(true);});
    if(dl)dl.addEventListener("click",openRelease);
    if(later)later.addEventListener("click",function(){
      var title=byId("kt-update-title"),tag=title&&title.textContent.match(/v\d+\.\d+\.\d+/);
      if(tag)storageWrite("kt-updater-dismissed",tag[0]);hide();
    });
    setTimeout(function(){check(false);},1200);
    setInterval(function(){check(false);},6*60*60*1000);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
}());
