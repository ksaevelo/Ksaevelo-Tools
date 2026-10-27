/* Ksaevelo Tools — original ExtendScript utilities. Compatible syntax for AE 2020+. */
var KT = KT || {};
/* Capture the extension location while this host file is first evaluated. */
KT.extensionRoot = (function(){ try { return new File($.fileName).parent.parent; } catch(e) { return null; } }());
KT.activeComp = function(){if(!app.project)return null;var c=app.project.activeItem;return(c&&c instanceof CompItem)?c:null;};
KT.selected = function(){var c=KT.activeComp();return c?c.selectedLayers:[];};
KT.undoStart = function(n){app.beginUndoGroup("Ksaevelo: "+n);};
KT.undoEnd = function(){app.endUndoGroup();};
KT.createText = function(){var c=KT.activeComp();if(!c)return "Open a composition first";KT.undoStart("Create Text");var l=c.layers.addText("Ksaevelo");l.property("Transform").property("Position").setValue([c.width/2,c.height/2]);KT.undoEnd();return "Text layer created";};
KT.createNull = function(){var c=KT.activeComp();if(!c)return "Open a composition first";KT.undoStart("Create Null");c.layers.addNull();KT.undoEnd();return "Null created";};
KT.createShape = function(){var c=KT.activeComp();if(!c)return "Open a composition first";KT.undoStart("Create Shape");var l=c.layers.addShape();l.name="Ksaevelo Shape";var root=l.property("Contents"),g=root.addProperty("ADBE Vector Group"),contents=g.property("Contents");var rect=contents.addProperty("ADBE Vector Shape - Rect");rect.property("Size").setValue([240,140]);contents.addProperty("ADBE Vector Graphic - Fill");l.property("Transform").property("Position").setValue([c.width/2,c.height/2]);KT.undoEnd();return "Shape layer created";};
KT.createAdjustment = function(){var c=KT.activeComp();if(!c)return "Open a composition first";KT.undoStart("Adjustment Layer");var l=c.layers.addSolid([1,1,1],"Adjustment Layer",c.width,c.height,c.pixelAspect,c.duration);l.adjustmentLayer=true;l.moveToBeginning();KT.undoEnd();return "Adjustment layer created";};
KT.createSolid = function(){var c=KT.activeComp();if(!c)return "Open a composition first";KT.undoStart("Create Solid");c.layers.addSolid([0.25,0.25,0.25],"Ksaevelo Solid",c.width,c.height,c.pixelAspect,c.duration);KT.undoEnd();return "Solid created";};
KT.duplicate = function(){var ls=KT.selected();if(!ls.length)return "Select one or more layers";KT.undoStart("Duplicate Layers");for(var i=0;i<ls.length;i++)ls[i].duplicate();KT.undoEnd();return "Duplicated "+ls.length+" layer(s)";};
KT.centerPosition = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart("Center Position");for(var i=0;i<ls.length;i++){try{ls[i].property("Transform").property("Position").setValue([c.width/2,c.height/2]);}catch(e){}}KT.undoEnd();return "Position centered";};
KT.centerAnchor = function(){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart("Center Anchor");var done=0;for(var i=0;i<ls.length;i++){try{var l=ls[i],r=l.sourceRectAtTime(l.containingComp.time,false),a=l.property("Transform").property("Anchor Point");a.setValue([r.left+r.width/2,r.top+r.height/2]);done++;}catch(e){}}KT.undoEnd();return done?"Anchor point centered on "+done+" layer(s)":"Could not center anchor on selected layers";};
KT.workArea = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select one or more layers";var s=c.workAreaStart,e=s+c.workAreaDuration;KT.undoStart("Fit to Work Area");for(var i=0;i<ls.length;i++){ls[i].inPoint=s;ls[i].outPoint=e;}KT.undoEnd();return "Layers fitted to work area";};
KT.trimStart = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart("Trim to Playhead");var t=c.time,n=0;for(var i=0;i<ls.length;i++){if(t<ls[i].outPoint){ls[i].inPoint=t;n++;}}KT.undoEnd();return "Trimmed "+n+" layer(s) to playhead";};
KT.trimEnd = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart("End at Playhead");var t=c.time,n=0;for(var i=0;i<ls.length;i++){if(t>ls[i].inPoint){ls[i].outPoint=t;n++;}}KT.undoEnd();return "Ended "+n+" layer(s) at playhead";};
KT.renameLayers = function(){var ls=KT.selected();if(!ls.length)return "Select layer(s)";var name=prompt("Base name for selected layers:","Ksaevelo");if(name===null||name==="")return "Rename cancelled";KT.undoStart("Rename Layers");for(var i=0;i<ls.length;i++)ls[i].name=ls.length===1?name:name+" "+(i+1);KT.undoEnd();return "Renamed "+ls.length+" layer(s)";};
KT.flipH = function(){return KT.flip(true);};KT.flipV = function(){return KT.flip(false);};
KT.flip = function(horizontal){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart(horizontal?"Flip Horizontal":"Flip Vertical");var changed=0;for(var i=0;i<ls.length;i++){try{var p=ls[i].property("Transform").property("Scale"),v=p.value.slice(0);v[horizontal?0:1]*=-1;p.setValue(v);changed++;}catch(e){}}KT.undoEnd();return changed?(horizontal?"Flipped horizontally":"Flipped vertically"):"Could not flip selected layers";};
KT.shyLayers = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart("Toggle Shy");for(var i=0;i<ls.length;i++)ls[i].shy=!ls[i].shy;KT.undoEnd();return "Shy state toggled";};
KT.unlockLayers = function(){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart("Unlock Layers");for(var i=0;i<ls.length;i++)ls[i].locked=false;KT.undoEnd();return "Selected layers unlocked";};
KT.animateText = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select a text layer";KT.undoStart("Text Pop-in");var count=0;for(var i=0;i<ls.length;i++){var l=ls[i];if(!(l instanceof TextLayer))continue;var p=l.property("Transform").property("Position"),o=l.property("Transform").property("Opacity"),t=l.inPoint,end=Math.min(t+0.45,l.outPoint),pos=p.value;var initial=pos.slice(0);initial[1]+=45;p.setValueAtTime(t,initial);p.setValueAtTime(end,pos);o.setValueAtTime(t,0);o.setValueAtTime(end,100);KT.easeProperty(p,70);KT.easeProperty(o,70);count++;}KT.undoEnd();return count?"Text pop-in applied":"Select a text layer";};
KT.fadeIn = function(){return KT.opacityPreset(true);};KT.fadeOut = function(){return KT.opacityPreset(false);};
KT.opacityPreset = function(inward){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart(inward?"Fade In":"Fade Out");for(var i=0;i<ls.length;i++){var l=ls[i],p=l.property("Transform").property("Opacity"),t=inward?l.inPoint:Math.max(l.inPoint,l.outPoint-0.4),e=inward?Math.min(l.inPoint+0.4,l.outPoint):l.outPoint;if(inward){p.setValueAtTime(t,0);p.setValueAtTime(e,100);}else{p.setValueAtTime(t,100);p.setValueAtTime(e,0);}KT.easeProperty(p,70);}KT.undoEnd();return inward?"Fade in applied":"Fade out applied";};
KT.slideIn = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart("Slide In");for(var i=0;i<ls.length;i++){var l=ls[i],p=l.property("Transform").property("Position"),t=l.inPoint,e=Math.min(t+0.45,l.outPoint),v=p.value;var start=v.slice(0);start[0]-=120;p.setValueAtTime(t,start);p.setValueAtTime(e,v);KT.easeProperty(p,75);}KT.undoEnd();return "Slide in applied";};
KT.scalePop = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart("Scale Pop");for(var i=0;i<ls.length;i++){var l=ls[i],p=l.property("Transform").property("Scale"),t=l.inPoint,e=Math.min(t+0.4,l.outPoint),v=p.value;var zero=v.slice(0);for(var d=0;d<zero.length;d++)zero[d]=0;p.setValueAtTime(t,zero);p.setValueAtTime(e,v);KT.easeProperty(p,75);}KT.undoEnd();return "Scale pop applied";};
KT.rotateIn = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select layer(s)";KT.undoStart("Rotate In");for(var i=0;i<ls.length;i++){var l=ls[i],p=l.property("Transform").property("Rotation"),t=l.inPoint,e=Math.min(t+0.45,l.outPoint),v=p.value;p.setValueAtTime(t,v-90);p.setValueAtTime(e,v);KT.easeProperty(p,75);}KT.undoEnd();return "Rotate in applied";};
KT.easeProperty = function(p,influence){for(var k=1;k<=p.numKeys;k++){try{var n=p.keyValue(k),dims=p.isSpatial?1:((n instanceof Array)?n.length:1),ei=[],eo=[];for(var d=0;d<dims;d++){ei.push(new KeyframeEase(0,influence));eo.push(new KeyframeEase(0,influence));}p.setTemporalEaseAtKey(k,ei,eo);}catch(e){}}};
KT.easeIn = function(){return KT.easeSelected(true);};KT.easeOut = function(){return KT.easeSelected(false);};KT.easyEase = function(){return KT.easeSelected(null);};
KT.easeSelected = function(mode){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart("Apply Easing");var changed=0;function collect(g,arr){for(var n=1;n<=g.numProperties;n++){var p=g.property(n);if(p.propertyType===PropertyType.PROPERTY){if(p.isTimeVarying&&p.numKeys>0)arr.push(p);}else collect(p,arr);}}for(var i=0;i<ls.length;i++){var props=[];collect(ls[i],props);for(var q=0;q<props.length;q++){var p=props[q];for(var k=1;k<=p.numKeys;k++){try{var val=p.keyValue(k),dims=p.isSpatial?1:((val instanceof Array)?val.length:1),ei=[],eo=[];for(var d=0;d<dims;d++){ei.push(new KeyframeEase(0,mode===true?75:mode===false?33:66));eo.push(new KeyframeEase(0,mode===true?33:mode===false?75:66));}p.setTemporalEaseAtKey(k,ei,eo);changed++;}catch(e){}}}}KT.undoEnd();return changed?"Easing applied to "+changed+" keyframe(s)":"No animated properties found";};
KT.removeKeys = function(){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart("Remove Keyframes");var count=0;function collect(g,arr){for(var n=1;n<=g.numProperties;n++){var p=g.property(n);if(p.propertyType===PropertyType.PROPERTY){if(p.numKeys>0)arr.push(p);}else collect(p,arr);}}for(var i=0;i<ls.length;i++){var ps=[];collect(ls[i],ps);for(var j=0;j<ps.length;j++){for(var k=ps[j].numKeys;k>=1;k--){ps[j].removeKey(k);count++;}}}KT.undoEnd();return count?"Removed "+count+" keyframe(s)":"No keyframes found";};
KT.applyFill = function(rgb){var ls=KT.selected();if(!ls.length)return "Select a layer";var a=rgb.split(","),color=[Number(a[0]),Number(a[1]),Number(a[2])];KT.undoStart("Apply Fill");var done=0;for(var i=0;i<ls.length;i++){try{var fx=ls[i].property("Effects").addProperty("ADBE Fill");fx.property("Color").setValue(color);done++;}catch(e){}}KT.undoEnd();return done?"Fill color applied":"Could not apply fill to selected layers";};
KT.addFill = function(){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart("Add Fill");var n=0;for(var i=0;i<ls.length;i++){try{ls[i].property("Effects").addProperty("ADBE Fill");n++;}catch(e){}}KT.undoEnd();return n?"Fill effect added":"Could not add Fill";};
KT.addGlow = function(){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart("Add Glow");var n=0;for(var i=0;i<ls.length;i++){try{ls[i].property("Effects").addProperty("ADBE Glo2");n++;}catch(e){}}KT.undoEnd();return n?"Glow effect added":"Could not add Glow";};
KT.selectAll = function(){var c=KT.activeComp();if(!c)return "Open a composition first";for(var i=1;i<=c.numLayers;i++)c.layer(i).selected=true;return "All layers selected";};
KT.deselectAll = function(){var c=KT.activeComp();if(!c)return "Open a composition first";for(var i=1;i<=c.numLayers;i++)c.layer(i).selected=false;return "Layers deselected";};
KT.fitComp = function(){var c=KT.activeComp();if(!c)return "Open a composition first";try{app.executeCommand(app.findMenuCommandId("Fit up to 100%"));return "Comp viewer fit command sent";}catch(e){return "Use the Composition viewer zoom menu";}};
KT.toggleMotionBlur = function(){var ls=KT.selected();if(!ls.length)return "Select layer(s)";KT.undoStart("Toggle Motion Blur");var state=!ls[0].motionBlur;for(var i=0;i<ls.length;i++)ls[i].motionBlur=state;KT.undoEnd();return state?"Motion blur enabled":"Motion blur disabled";};


KT.getSystemInfo = function(){var v="unknown";try{v=app.version;}catch(e){}return "After Effects "+v+" | "+$.os;};
KT.addBeatMarker = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var mp=c.markerProperty;if(!mp)return "Composition markers are unavailable";KT.undoStart("Add Beat Marker");var marker=new MarkerValue("KT Beat");mp.setValueAtTime(c.time,marker);KT.undoEnd();return "Beat marker added at playhead";};
KT.clearBeats = function(){var c=KT.activeComp();if(!c)return "Open a composition first";var mp=c.markerProperty;if(!mp)return "Composition markers are unavailable";var removed=0;KT.undoStart("Clear Ksaevelo Beat Markers");for(var k=mp.numKeys;k>=1;k--){try{if(mp.keyValue(k).comment==="KT Beat"){mp.removeKey(k);removed++;}}catch(e){}}KT.undoEnd();return removed?"Cleared "+removed+" Ksaevelo beat marker(s)":"No Ksaevelo beat markers to clear";};
KT.detectBeats = function(sensitivity,channel){var c=KT.activeComp();if(!c)return "Open a composition first";var ls=c.selectedLayers;if(!ls.length)return "Select an audio layer first";var audio=null;for(var i=0;i<ls.length;i++){try{if(ls[i].hasAudio){audio=ls[i];break;}}catch(e){}}if(!audio)return "Select a layer that contains audio";var cmd=app.findMenuCommandId("Convert Audio to Keyframes");if(!cmd)return "Could not find AE's Convert Audio to Keyframes command";KT.undoStart("Detect Beats");try{audio.selected=true;app.executeCommand(cmd);}catch(e){KT.undoEnd();return "Audio conversion failed: "+e.toString();}var amp=null;for(var j=1;j<=c.numLayers;j++){if(c.layer(j).name==="Audio Amplitude"){amp=c.layer(j);break;}}if(!amp){KT.undoEnd();return "Audio keyframes created. Select Audio Amplitude and try again if needed";}var prop=null;try{var effects=amp.property("Effects");var target=channel==="left"?"Left Channel":(channel==="right"?"Right Channel":"Both Channels");for(var e=1;e<=effects.numProperties;e++){var fx=effects.property(e);if(fx.name===target){prop=fx.property(1);break;}}if(!prop&&effects.numProperties)prop=effects.property(1).property(1);}catch(e2){}if(!prop||prop.numKeys<2){KT.undoEnd();return "Audio Amplitude created, but no usable amplitude keyframes were found";}var vals=[],max=0;for(var k=1;k<=prop.numKeys;k++){var val=prop.keyValue(k);vals.push({t:prop.keyTime(k),v:val});if(val>max)max=val;}var threshold=max*(Math.max(1,Math.min(100,Number(sensitivity)||10))/100),added=0,mp=c.markerProperty;for(var n=2;n<vals.length-1;n++){if(vals[n].v>=threshold&&vals[n].v>=vals[n-1].v&&vals[n].v>vals[n+1].v){var mk=new MarkerValue("KT Beat");mp.setValueAtTime(vals[n].t,mk);added++;}}KT.undoEnd();return "Beat detection complete: "+added+" marker(s) added. Review threshold/sensitivity if needed";};

/* Preset application: files bundled with the extension. */
KT.applyBundledPreset = function(category, filename) {
  var c = KT.activeComp(), folderMap = {cc:"x01", text:"x02", twixtor:"x03", zooms:"x04"};
  if (!c) return "Open a composition first";
  if (!c.selectedLayers || c.selectedLayers.length < 1) return "Select one or more layers first";
  if (!folderMap[category]) return "Unknown preset category: " + category;
  if (!/^[A-Za-z0-9 _\-\[\]'.+()]+\.ffx$/i.test(filename || "")) return "Invalid preset filename";

  var roots = [], seen = {}, i, j, f, candidate, presetFile = null;
  function addRoot(folder) {
    try {
      if (!folder || !folder.exists) return;
      var key = folder.fsName.toLowerCase();
      if (!seen[key]) { seen[key] = true; roots.push(folder); }
    } catch (e) {}
  }
  function addAncestors(folder, count) {
    var q = folder;
    for (var n=0; n<count && q; n++) { addRoot(q); try { q=q.parent; } catch(e) { q=null; } }
  }

  /* $.fileName may resolve to the AE installation folder in some CEP/ExtendScript
     contexts. Search standard CEP install locations as well as the script location. */
  try { addAncestors(KT.extensionRoot, 2); } catch(e0) {}
  try { addAncestors(new File($.fileName).parent, 5); } catch(e1) {}
  try { addAncestors(Folder.current, 3); } catch(e2) {}
  try { addAncestors(Folder.userData, 1); } catch(e3) {}
  try { addAncestors(Folder.commonFiles, 1); } catch(e4) {}
  try { addRoot(new Folder(Folder.userData.fsName + "/Adobe/CEP/extensions/Ksaevelo Tools")); } catch(e5) {}
  try { addRoot(new Folder(Folder.userData.fsName + "/Adobe/CEP/extensions/Ksaevelo_Tools")); } catch(e6) {}
  try { addRoot(new Folder(Folder.commonFiles.fsName + "/Adobe/CEP/extensions/Ksaevelo Tools")); } catch(e7) {}
  try { addRoot(new Folder(Folder.commonFiles.fsName + "/Adobe/CEP/extensions/Ksaevelo_Tools")); } catch(e8) {}
  try { addRoot(new Folder(Folder.commonFiles.fsName + "/Adobe/CEP/extensions")); } catch(e9) {}

  for (i=0; i<roots.length; i++) {
    try {
      /* Test the candidate as the extension root, then common nested-folder layouts. */
      var layouts = [roots[i].fsName,
        roots[i].fsName + "/Ksaevelo Tools",
        roots[i].fsName + "/Ksaevelo_Tools",
        roots[i].fsName + "/extensions/Ksaevelo Tools",
        roots[i].fsName + "/extensions/Ksaevelo_Tools"];
      for (j=0; j<layouts.length; j++) {
        candidate = new File(layouts[j] + "/core/lib/" + folderMap[category] + "/" + filename);
        if (candidate.exists) { presetFile = candidate; break; }
      }
      if (presetFile) break;
    } catch(e10) {}
  }
  if (!presetFile) {
    var rootText = "";
    try { rootText = KT.extensionRoot ? KT.extensionRoot.fsName : "(extension root unavailable)"; } catch(e11) {}
    return "Preset file missing: " + filename + " | checked " + roots.length + " locations | initial root: " + rootText;
  }
  try {
    app.beginUndoGroup("Ksaevelo Tools: Apply " + filename);
    c.selectedLayers[0].applyPreset(presetFile); /* AE Layer.applyPreset applies to the selected layers */
    app.endUndoGroup();
    return "Applied preset: " + filename.replace(/\.ffx$/i, "");
  } catch(e12) {
    try { app.endUndoGroup(); } catch(e13) {}
    return "Could not apply preset: " + e12.toString();
  }
};

KT.applyCustomEase = function(x1,y1,x2,y2) {
  var ls=KT.selected();
  if(!ls.length) return "Select layers with animated keyframes first";
  x1=Number(x1);y1=Number(y1);x2=Number(x2);y2=Number(y2);
  if(!isFinite(x1)||!isFinite(y1)||!isFinite(x2)||!isFinite(y2)) return "Invalid graph control points";
  x1=Math.max(0,Math.min(1,x1));y1=Math.max(0,Math.min(1,y1));
  x2=Math.max(0,Math.min(1,x2));y2=Math.max(0,Math.min(1,y2));
  var changed=0;
  function visit(group) {
    for(var n=1;n<=group.numProperties;n++) {
      var p=group.property(n);
      if(p.propertyType!==PropertyType.PROPERTY){try{visit(p);}catch(e0){}continue;}
      if(!p.isTimeVarying||p.numKeys<2)continue;
      try {
        var first=p.keyValue(1), dims=(first instanceof Array && !p.isSpatial)?first.length:1;
        // Time influence is the horizontal Bezier handle distance in percent.
        var outInfluence=Math.max(0.1,Math.min(100,x1*100));
        var inInfluence=Math.max(0.1,Math.min(100,(1-x2)*100));
        var incoming=[],outgoing=[];
        for(var k=1;k<=p.numKeys;k++){incoming[k]=[];outgoing[k]=[];}
        for(var seg=1;seg<p.numKeys;seg++){
          var a=p.keyValue(seg),b=p.keyValue(seg+1),dt=p.keyTime(seg+1)-p.keyTime(seg);
          if(dt<=0)continue;
          for(var d=0;d<dims;d++){
            var average;
            if(p.isSpatial && a instanceof Array && b instanceof Array){
              var distance=0;for(var q=0;q<a.length;q++)distance+=Math.pow(b[q]-a[q],2);
              average=Math.sqrt(distance)/dt;
            } else {
              var av=a instanceof Array?a[d]:a,bv=b instanceof Array?b[d]:b;
              if(typeof av!=="number"||typeof bv!=="number")continue;
              average=(bv-av)/dt;
            }
            var outSpeed=average*(x1<0.0001?(y1>0?100:0):y1/x1);
            var inSpeed=average*((1-x2)<0.0001?((1-y2)>0?100:0):(1-y2)/(1-x2));
            outgoing[seg][d]=new KeyframeEase(outSpeed,outInfluence);
            incoming[seg+1][d]=new KeyframeEase(inSpeed,inInfluence);
          }
        }
        for(var k2=1;k2<=p.numKeys;k2++){
          var inc=incoming[k2],out=outgoing[k2];
          if(!inc.length)inc=out;
          if(!out.length)out=inc;
          if(inc.length!==dims||out.length!==dims)continue;
          try{
            if(typeof p.setInterpolationTypeAtKey==="function")p.setInterpolationTypeAtKey(k2,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);
            p.setTemporalEaseAtKey(k2,inc,out);changed++;
          }catch(e1){}
        }
      } catch(e2){}
    }
  }
  try{app.beginUndoGroup("Ksaevelo: Custom Graph Ease");for(var i=0;i<ls.length;i++)visit(ls[i]);}
  finally{try{app.endUndoGroup();}catch(e3){}}
  return changed?"Custom graph applied to "+changed+" keyframe(s)":"No compatible animated keyframes found";
};

/* Ksaevelo original parametric 3D rig builder. AE Classic 3D planar layers. */
KT.makeSpatialRig = function(kind) {
  var comp=KT.activeComp();
  if(!comp) return "Open a composition first";
  var options={
    "box": [4,400,400,400,0],"portrait":[4,270,480,270,0],
    "slab":[4,560,280,240,0],
    "tri":[3,320,520,320,0],"penta":[5,320,520,320,0],
    "hexa":[6,320,520,320,0],"hepta":[7,320,520,320,0],
    "octa":[8,320,520,320,0],"nona":[9,320,520,320,0],
    "cylinder":[20,320,520,320,0],"cone":[20,320,520,320,1],
    "tetra":[3,340,340,340,2],"diamond":[4,340,340,340,3],
    "icosa":[5,340,340,340,4],
    "strip":[3,380,480,250,5],"duo":[2,380,480,250,5],
    "trio":[3,380,480,250,5],
    "quad":[4,300,300,300,6],"octsplit":[8,260,260,260,6],
    "ring4":[4,260,260,260,7],"ring6":[6,240,240,240,7],
    "ring8":[8,220,220,220,7]
  };
  var o=options[kind];
  if(!o)return "Unknown spatial rig";
  var count=o[0], w=o[1], h=o[2], depth=o[3], mode=o[4];
  var source=comp.selectedLayers.length?comp.selectedLayers[0]:null;
  var controller=null, created=0;
  function makePanel(name,sw,sh) {
    var lay;
    if(source && source.source && source.source.width && source.source.height) {
      lay=comp.layers.add(source.source);
    } else {
      lay=comp.layers.addSolid([0.31+((created%3)*0.12),0.22,0.65],name,
        Math.max(4,Math.round(sw)),Math.max(4,Math.round(sh)),1,comp.duration);
    }
    lay.name="KT "+name;
    lay.threeDLayer=true; // Scale and Position are now three-dimensional.
    if(source && source.source && source.source.width && source.source.height){
      lay.property("ADBE Transform Group").property("ADBE Scale").setValue([
        sw/source.source.width*100, sh/source.source.height*100, 100
      ]);
    }
    lay.parent=controller;
    created++;
    return lay;
  }
  function place(lay,x,y,z,rx,ry,rz) {
    var tr=lay.property("ADBE Transform Group");
    tr.property("ADBE Position").setValue([x,y,z]);
    tr.property("ADBE Rotate X").setValue(rx||0);
    tr.property("ADBE Rotate Y").setValue(ry||0);
    tr.property("ADBE Rotate Z").setValue(rz||0);
  }
  try {
    app.beginUndoGroup("Ksaevelo Spatial Studio: "+kind);
    controller=comp.layers.addNull();
    controller.name="KT Spatial • "+kind;
    controller.threeDLayer=true;
    controller.property("ADBE Transform Group").property("ADBE Position")
      .setValue([comp.width/2,comp.height/2,0]);
    if(mode===0 || mode===1) {
      var radius=depth/2, faceWidth=2*radius*Math.tan(Math.PI/count);
      for(var i=0;i<count;i++){
        var a=i*2*Math.PI/count, side=makePanel("Surface "+(i+1),faceWidth,h);
        place(side,Math.sin(a)*radius,0,Math.cos(a)*radius,0,i*360/count,0);
        if(mode===1)side.property("ADBE Transform Group").property("ADBE Rotate X").setValue(-18);
      }
      if(count===4 && mode===0){
        var cap1=makePanel("Top",w,depth),cap2=makePanel("Bottom",w,depth);
        place(cap1,0,-h/2,0,90,0,0);place(cap2,0,h/2,0,-90,0,0);
      }
    } else if(mode===2 || mode===3 || mode===4) {
      /* Faceted radial sculptures: deliberately stylized, not exact Platonic solids. */
      var bands=mode===2?1:(mode===3?2:3), facets=mode===2?4:(mode===3?8:20);
      for(var f=0;f<facets;f++){
        var ring=f%bands, angle=2*Math.PI*f/(facets/bands);
        var p=makePanel("Facet "+(f+1),w*0.72,h*0.78);
        place(p,Math.sin(angle)*(depth*0.45), (ring-(bands-1)/2)*h*0.35,
          Math.cos(angle)*(depth*0.45), ring%2?35:-35,angle*180/Math.PI,ring%2?20:-20);
      }
    } else if(mode===5) {
      for(var k=0;k<count;k++){
        var panel=makePanel("Fold "+(k+1),w/count,h);
        place(panel,(k-(count-1)/2)*w/count,0,0,0,(k%2?25:-25),0);
      }
    } else if(mode===6) {
      for(var q=0;q<count;q++){
        var columns=count===8?2:2, rows=count/columns;
        var xx=q%columns, yy=Math.floor(q/columns);
        var part=makePanel("Tile "+(q+1),w,h);
        place(part,(xx-(columns-1)/2)*w,(yy-(rows-1)/2)*h,
          (q%2?depth/2:-depth/2),0,(q%2?15:-15),0);
      }
    } else {
      for(var r=0;r<count;r++){
        var t=r*2*Math.PI/count, tile=makePanel("Orbit "+(r+1),w,h);
        place(tile,Math.sin(t)*depth*1.9,0,Math.cos(t)*depth*1.9,0,
          t*180/Math.PI,0);
      }
    }
    return "Created "+kind+" spatial rig ("+created+" 3D surfaces). Animate its KT Spatial controller.";
  } catch(e) {
    return "3D rig error: "+e.toString();
  } finally {
    try{app.endUndoGroup();}catch(ignore){}
  }
};
