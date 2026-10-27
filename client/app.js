(function () {
  function $(s){return document.querySelector(s);}
  var status=$("#status"), cs=window.CSInterface?new window.CSInterface():null;
  function setStatus(m){if(status)status.textContent=m;}
  function runHost(name,args){
    var i,encoded=[],expression;args=args||[];
    if(!cs){setStatus("ERROR: CEP bridge unavailable");return;}
    for(i=0;i<args.length;i++)encoded.push(JSON.stringify(args[i]));
    expression="(function(){try{if(typeof KT==='undefined')return 'ERROR: Ksaevelo host script is not loaded';if(typeof KT["+JSON.stringify(name)+"]!=='function')return 'ERROR: Missing host action';return KT["+JSON.stringify(name)+"]("+encoded.join(",")+");}catch(e){return 'ERROR: '+e.toString();}})()";
    setStatus("Running "+name+"…");
    cs.evalScript(expression,function(result){
      if(typeof result==="string"&&result.indexOf("__KT_BRIDGE_UNAVAILABLE__")===0)setStatus("ERROR: CEP bridge unavailable — "+result.replace(/^__KT_BRIDGE_UNAVAILABLE__:?\s*/,""));
      else if(typeof result==="string"&&result.indexOf("__KT_BRIDGE_ERROR__:")===0)setStatus("ERROR: "+result.replace(/^__KT_BRIDGE_ERROR__:?\s*/,""));
      else if(result==="EvalScript error.")setStatus("ERROR: AE could not run host script");
      else if(typeof result==="string"&&result.indexOf("ERROR:")===0)setStatus(result);
      else {
        var message=result===undefined||result===null||result===""?"No response from AE":String(result);
        setStatus(message);
        if(name==="getSystemInfo"){var match=message.match(/After Effects ([^|]+)/);if(match)$("#aeVersion").textContent=match[1].replace(/^\s+|\s+$/g,"");}
      }
    });
  }
  function storageGet(k,d){try{return localStorage.getItem(k)||d;}catch(e){return d;}}
  function storageSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
  function applyTheme(v){document.body.setAttribute("data-theme",v);storageSet("kt-theme-preset",v);}
  function applyShape(v){document.body.setAttribute("data-shape",v);storageSet("kt-shape",v);}
  var preset=$("#themePreset"), accent=$("#customAccent"), shape=$("#buttonShape");
  var savedTheme=storageGet("kt-theme-preset","midnight");
  if(preset)preset.value=savedTheme;applyTheme(savedTheme);
  var savedShape=storageGet("kt-shape","rounded");if(shape)shape.value=savedShape;applyShape(savedShape);
  var custom=storageGet("kt-custom-accent","");
  if(custom){document.documentElement.style.setProperty("--accent",custom);document.documentElement.style.setProperty("--accent-soft",hexToRgba(custom,.15));}
  if(accent&&custom)accent.value=custom;
  if(storageGet("kt-light","false")==="true")document.body.classList.add("light");
  function hexToRgba(hex,a){var h=hex.replace("#","");return "rgba("+parseInt(h.substr(0,2),16)+","+parseInt(h.substr(2,2),16)+","+parseInt(h.substr(4,2),16)+","+a+")";}
  $("#themeToggle").addEventListener("click",function(){document.body.classList.toggle("light");storageSet("kt-light",document.body.classList.contains("light")?"true":"false");setStatus("Light/dark mode changed");});
  if(preset)preset.addEventListener("change",function(){applyTheme(this.value);document.documentElement.style.removeProperty("--accent");document.documentElement.style.removeProperty("--accent-soft");if(accent)accent.value="#9d7bff";storageSet("kt-custom-accent","");setStatus("Theme: "+this.options[this.selectedIndex].text);});
  if(shape)shape.addEventListener("change",function(){applyShape(this.value);setStatus("Button shape updated");});
  if(accent)accent.addEventListener("input",function(){document.documentElement.style.setProperty("--accent",this.value);document.documentElement.style.setProperty("--accent-soft",hexToRgba(this.value,.15));storageSet("kt-custom-accent",this.value);setStatus("Custom accent updated");});
  var buttons=document.querySelectorAll("[data-action]"),i;
  for(i=0;i<buttons.length;i++)buttons[i].addEventListener("click",function(){runHost(this.getAttribute("data-action"),[]);});
  var swatches=document.querySelectorAll("[data-color]");
  for(i=0;i<swatches.length;i++)swatches[i].addEventListener("click",function(){runHost("applyFill",[this.getAttribute("data-color")]);});

  // Beat maker mode controls and sensitivity display
  var beatMode="manual", sens=$("#sensitivity"), sensValue=$("#sensitivityValue");
  $("#beatManual").addEventListener("click",function(){beatMode="manual";$("#beatManual").classList.add("active");$("#beatAuto").classList.remove("active");$("#ktBeatActionLabel").textContent="Add Beat Marker";setStatus("Beat Maker: Manual mode");});
  $("#beatAuto").addEventListener("click",function(){beatMode="auto";$("#beatAuto").classList.add("active");$("#beatManual").classList.remove("active");$("#ktBeatActionLabel").textContent="Auto Detect Bass";setStatus("Beat Maker: Auto mode");});
  sens.addEventListener("input",function(){sensValue.textContent=this.value;});
  $("#detectBeats").addEventListener("click",function(){runHost(beatMode==="auto"?"detectBeats":"addBeatMarker",[Number(sens.value),$("#beatChannel").value]);});
  $("#clearBeats").addEventListener("click",function(){runHost("clearBeats",[]);});
  // System dashboard: one clock, one stopwatch, one sticky-note autosave listener.
  function updateClock(){
    var d=new Date(),pad=function(n){return n<10?"0"+n:String(n);};
    var el=$("#systemTime");
    if(el)el.textContent=pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds());
  }
  updateClock();setInterval(updateClock,1000);
  var os=$("#osName");
  if(os)os.textContent=/Win/i.test(navigator.platform)?"Windows":(/Mac/i.test(navigator.platform)?"macOS":navigator.platform||"Unknown");
  var note=$("#stickyNote");
  if(note){
    note.value=storageGet("kt-sticky-note","");
    note.addEventListener("input",function(){storageSet("kt-sticky-note",this.value);});
  }
  var sw={running:false,started:0,elapsed:0,timer:null};
  function fmt(ms){
    var total=Math.floor(ms/1000),h=Math.floor(total/3600),m=Math.floor((total%3600)/60),sec=total%60;
    var pad=function(n){return n<10?"0"+n:String(n);};
    return pad(h)+":"+pad(m)+":"+pad(sec);
  }
  function drawWatch(){
    var display=$("#stopwatchDisplay");
    if(display)display.textContent=fmt(sw.elapsed+(sw.running?(Date.now()-sw.started):0));
  }
  var watchStart=$("#watchStart"),watchPause=$("#watchPause"),watchReset=$("#watchReset"),watchState=$("#watchState");
  if(watchStart)watchStart.addEventListener("click",function(){
    if(sw.running)return;sw.started=Date.now();sw.running=true;
    if(sw.timer)clearInterval(sw.timer);sw.timer=setInterval(drawWatch,200);
    if(watchState)watchState.textContent="RUNNING";drawWatch();
  });
  if(watchPause)watchPause.addEventListener("click",function(){
    if(!sw.running)return;sw.elapsed+=Date.now()-sw.started;sw.running=false;
    if(sw.timer)clearInterval(sw.timer);sw.timer=null;
    if(watchState)watchState.textContent="PAUSED";drawWatch();
  });
  if(watchReset)watchReset.addEventListener("click",function(){
    if(sw.timer)clearInterval(sw.timer);sw.timer=null;
    sw.running=false;sw.elapsed=0;sw.started=0;
    if(watchState)watchState.textContent="READY";drawWatch();
  });
  drawWatch();
  runHost("getSystemInfo",[]);
}());

/* External creator links and bundled preset actions. Delegated for CEP reliability. */
(function () {
  "use strict";
  function status(message) { var el=document.getElementById("status"); if(el) el.textContent=message; }
  function host(){ return window.CSInterface ? new window.CSInterface() : null; }
  function closestAttr(node, attr) {
    while(node && node !== document) {
      if(node.getAttribute && node.hasAttribute(attr)) return node;
      node=node.parentNode;
    }
    return null;
  }
  document.addEventListener("click", function(event) {
    var link=closestAttr(event.target,"href");
    if(link && link.closest && link.closest(".creator-links")) {
      event.preventDefault(); var url=link.getAttribute("href");
      try {
        if(window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) window.cep.util.openURLInDefaultBrowser(url);
        else if(window.open) window.open(url,"_blank");
        else status("Open this link in your browser: "+url);
      } catch(e) { status("Could not open link: "+url); }
      return;
    }
    var button=closestAttr(event.target,"data-preset-category");
    if(!button) return;
    event.preventDefault(); event.stopPropagation();
    var category=button.getAttribute("data-preset-category"), filename=button.getAttribute("data-preset-file"), cs=host();
    status("Preset button detected: "+category+" / "+filename);
    if(!cs || typeof cs.evalScript!=="function") { status("ERROR: CEP bridge unavailable. Make sure this is running inside After Effects."); return; }
    var expression="(function(){try{if(typeof KT==='undefined')return 'ERROR: Host script KT is not loaded';if(typeof KT.applyBundledPreset!=='function')return 'ERROR: Preset action is not loaded';return KT.applyBundledPreset("+JSON.stringify(category)+","+JSON.stringify(filename)+");}catch(e){return 'ERROR: '+e.toString();}})()";
    status("Applying preset: "+filename.replace(/\.ffx$/i,"")+"…");
    try { cs.evalScript(expression,function(result){status(result && result!=="EvalScript error." ? String(result) : "ERROR: No valid response from After Effects. Check CEP host script loading.");}); }
    catch(e) { status("ERROR: Could not call After Effects: "+e.toString()); }
  }, true);
}());

/* Interactive custom Bezier graph (AE 2020+ CEP compatible). */
(function(){
  "use strict";
  function byId(id){return document.getElementById(id);}
  var svg=byId("ktGraph"), h1=byId("ktHandle1"), h2=byId("ktHandle2");
  if(!svg||!h1||!h2)return;
  var pts=[{x:90,y:115},{x:210,y:45}], active=-1;
  function setRange(id,v){var el=byId(id);if(el)el.value=String(Math.round(v));}
  function draw(sync){
    h1.setAttribute("cx",pts[0].x);h1.setAttribute("cy",pts[0].y);
    h2.setAttribute("cx",pts[1].x);h2.setAttribute("cy",pts[1].y);
    byId("ktHandleLine1").setAttribute("x2",pts[0].x);byId("ktHandleLine1").setAttribute("y2",pts[0].y);
    byId("ktHandleLine2").setAttribute("x1",pts[1].x);byId("ktHandleLine2").setAttribute("y1",pts[1].y);
    byId("ktCurve").setAttribute("d","M20 150 C"+pts[0].x+" "+pts[0].y+" "+pts[1].x+" "+pts[1].y+" 280 10");
    if(sync){setRange("ktX1",(pts[0].x-20)/2.6);setRange("ktY1",(150-pts[0].y)/1.4);setRange("ktX2",(pts[1].x-20)/2.6);setRange("ktY2",(150-pts[1].y)/1.4);}
  }
  function pointFromEvent(e){var r=svg.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*300,y:(e.clientY-r.top)/r.height*180};}
  function move(e){if(active<0)return;var p=pointFromEvent(e);pts[active].x=Math.max(20,Math.min(280,p.x));pts[active].y=Math.max(10,Math.min(150,p.y));draw(true);}
  function start(n,e){active=n;e.preventDefault();try{svg.setPointerCapture(e.pointerId);}catch(ex){}}
  h1.addEventListener("pointerdown",function(e){start(0,e);});
  h2.addEventListener("pointerdown",function(e){start(1,e);});
  svg.addEventListener("pointermove",move);
  svg.addEventListener("pointerup",function(){active=-1;});
  svg.addEventListener("pointercancel",function(){active=-1;});
  /* Mouse fallback for older embedded Chromium versions in AE 2020. */
  h1.addEventListener("mousedown",function(e){start(0,e);});
  h2.addEventListener("mousedown",function(e){start(1,e);});
  document.addEventListener("mousemove",function(e){if(active>=0)move(e);});
  document.addEventListener("mouseup",function(){active=-1;});
  [["ktX1",0,"x"],["ktY1",0,"y"],["ktX2",1,"x"],["ktY2",1,"y"]].forEach(function(a){
    var el=byId(a[0]);if(!el)return;el.addEventListener("input",function(){var v=Number(this.value);if(a[2]==="x")pts[a[1]].x=20+v*2.6;else pts[a[1]].y=150-v*1.4;draw(false);});
  });
  byId("ktGraphReset").addEventListener("click",function(){pts=[{x:90,y:115},{x:210,y:45}];draw(true);});
  byId("ktGraphApply").addEventListener("click",function(){
    var cs=window.CSInterface?new window.CSInterface():null,st=byId("status");
    if(!cs){if(st)st.textContent="CEP bridge unavailable";return;}
    var vals=[(pts[0].x-20)/260,(150-pts[0].y)/140,(pts[1].x-20)/260,(150-pts[1].y)/140];
    var expr="(function(){try{if(typeof KT==='undefined'||typeof KT.applyCustomEase!=='function')return 'ERROR: Custom graph host action is not loaded';return KT.applyCustomEase("+vals.join(",")+");}catch(e){return 'ERROR: '+e.toString();}})()";
    if(st)st.textContent="Applying custom graph…";
    cs.evalScript(expr,function(r){if(st)st.textContent=(r&&r!=="EvalScript error.")?String(r):"Could not apply graph. Restart After Effects and try again.";});
  });
  draw(true);
}());

/* Spatial Studio: separate click handling; existing tools remain unchanged. */
(function(){
  function initSpatial(){
    document.addEventListener("click",function(ev){
      var node=ev.target;
      while(node && node!==document && !(node.getAttribute && node.getAttribute("data-spatial")))node=node.parentNode;
      if(!node || node===document)return;
      ev.preventDefault();
      var key=node.getAttribute("data-spatial"), status=document.getElementById("status");
      if(status)status.textContent="Building "+key+" 3D rig…";
      if(!window.CSInterface){if(status)status.textContent="CEP bridge unavailable";return;}
      var cs=new CSInterface();
      cs.evalScript("(function(){try{if(typeof KT==='undefined'||typeof KT.makeSpatialRig!=='function')return 'ERROR: 3D host action is unavailable';return KT.makeSpatialRig("+JSON.stringify(key)+");}catch(e){return 'ERROR: '+e.toString();}})()",function(result){
        if(status)status.textContent=(result && result!=="EvalScript error.")?result:"3D host action failed. Restart After Effects.";
      });
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initSpatial);
  else initSpatial();
}());
