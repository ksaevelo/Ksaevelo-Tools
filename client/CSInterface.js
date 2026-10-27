/* CEP bridge compatibility for AE 2020+ (CEP exposes __adobe_cep__). */
(function(){
  function CSInterface(){}
  CSInterface.prototype.evalScript=function(script,callback){
    var cep=window.__adobe_cep__||window.__adobe_cep;
    if(cep && typeof cep.evalScript==="function"){
      try { cep.evalScript(script,callback||function(){}); }
      catch(e){ if(callback) callback("__KT_BRIDGE_ERROR__:"+e.toString()); }
    } else if(callback) {
      callback("__KT_BRIDGE_UNAVAILABLE__: CEP host API was not exposed by this panel.");
    }
  };
  window.CSInterface=CSInterface;
}());