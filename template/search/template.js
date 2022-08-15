javascript:(() => {
    ${commonScript}

    ${searchCommonScript}

    const dict = ${address_mapping};
    main();
    
    function main() {
      log("main");
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
        
      location.href = "${searchUrl}";

      return;
    }
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
    function funcReserve() {
      log("funcSearch");

      ${searchScript}

      return;
    }
})();
    