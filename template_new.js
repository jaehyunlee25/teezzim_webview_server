javascript:(() => {
    ${commonScript}
            
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
      
      const tag = localStorage.getItem("TZ_LOGIN");
      if (tag && new Date().getTime() - tag < 1000 * 5) {
        location.href = "${searchUrl}";
        return;
      }
      localStorage.setItem("TZ_LOGIN", new Date().getTime());
    
      ${loginScript}
    
      return;
    }
    function funcReserve() {
      log("funcSearch");

      ${searchScript}

      return;
    }
    ${endoutScript}

})();
    