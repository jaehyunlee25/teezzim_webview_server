javascript:(() => {
    ${commonScript}
    const logParam = {
      type: "command",
      sub_type: "reserve/reserve",
      device_id: "${deviceId}",
      device_token: "${deviceToken}",
      golf_club_id: "${golfClubId}",
      message: "start reserve/reserve",
      parameter: JSON.stringify({}),
    };
    const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
    const aDDr = location.href.split(splitter)[0];
    const suffix = location.href.split(splitter)[1];
    const dictSplitter = {"#": "?", "?": "#"};
    let addr = aDDr;
    if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
        addr = aDDr.split(dictSplitter[splitter])[0];
    
    log("raw addr :: ", location.href);
    log("aDDr :: ", aDDr);
    log("addr :: ", addr);
        
    const dict = ${address_mapping};
    
    const func = dict[addr];
    if (!func) funcOther();
    else func();    

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
    