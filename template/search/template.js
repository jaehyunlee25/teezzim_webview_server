javascript:(() => {   
  
    ${commonScript}
 
    const dict = ${address_mapping};   

    function funcLogin() {
      log("funcLogin");
      
      const chk = LSCHK("TZ_SEARCH_LOGIN" + clubId, 5);
      if (!chk) {
        log("funcLogin Timein ERROR");
        location.href = "${searchUrl}";
        return;
      }

      ${loginScript}
    
      return;
    }
    
    ${searchCommonScript}
    
    function main() {
      log("main");

      if (!TZ_BOT_SAFETY) {
        log("stopped by Infinite Call");
        return;
      }

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

      const chk = LSCHK("TZ_SEARCH_MAIN" + clubId, 10);
      log("timeout chk", chk);
      if (!chk) {
        log("funcMain Timein ERROR");
        return;
      }

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

      const chk = LSCHK("TZ_SEARCH_OTHER" + clubId, 10);
      log("timeout chk", chk);
      if (!chk) {
        log("funcOther Timein ERROR");
        return;
      }
        
      location.href = "${searchUrl}";

      return;
    }    
    function funcReserve() {
      log("funcSearch");

      const chk = LSCHK("TZ_SEARCH_RESERVE" + clubId, 5);
      log("timeout chk", chk);
      if (!chk) {
        log("funcSearch Timein ERROR");
        return;
      }

      ${searchScript}

      return;
    }

    main();
})();
    