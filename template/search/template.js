javascript:(() => {   
  
    ${commonScript}
 
    const dict = ${address_mapping};   

    function funcLogin() {
      log("funcLogin");
      
      const chk = LSCHK("TZ_SEARCH_LOGIN", 5);
      if(!chk) {
        location.href = "${searchUrl}";
        return;
      }

      ${loginScript}
    
      return;
    }
    
    ${searchCommonScript}
    
    function main() {
      log("main");

      if (!TZ_BOT_SAFETY) return;

      const func = dict[addr];
      if (!func) funcOther();
      else func();
    }

    function funcList() {
      log("funcList");
      location.href = "${searchUrl}";
      return;
    }
    function funcMain() {
      log("funcMain");
      location.href = "${searchUrl}";
      return;
    }
    function funcOut() {
      log("funcOut");

      funcEnd();

      return;
    }
    function funcOther() {
      log("funcOther");

      const chk = LSCHK("TZ_SEARCH_OTHER", 5);
      if(!chk) return;
        
      location.href = "${searchUrl}";

      return;
    }    
    function funcReserve() {
      log("funcSearch");

      const chk = LSCHK("TZ_SEARCH_RESERVE", 5);
      if(!chk) return;

      ${searchScript}

      return;
    }

    main();
})();
    