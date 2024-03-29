javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/search",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/search",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("?")[0];

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://www.bearsbestcheongnagc.com/Mobile": funcMain,
    "https://www.bearsbestcheongnagc.com/Mobile/Member/Logout": funcOut,
  };
  const func = dict[addr];
  if (!func) funcOther();
  else func();

  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcOther() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {    
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcSearch();
    });
  }
  function funcSearch() {
    const els = doc.gcn("wrap")[0].gtn("a");
    const dictCourse = {
      11: "Australasia",
      22: "Europe",
      33: "USA",
    };
    const result = [];
    Array.from(els).forEach((el) => {
      if(el.str() != "변경") return true;

      const param = el.attr("onclick").inparen();
      const date = param[0];
      const time = param[2];
      const mCourse = param[1];
      log("reserve search", dictCourse[mCourse], date, time);
      result.push({ date, time, course: dictCourse[mCourse] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      device_id: "${deviceId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      console.log(data);
      logParam.message = "end of reserve/search";
      TZLOG(logParam, (data) => {
        log(data);
      });
      if (ac) ac.message("end of reserve/search");
    });
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/Logout";
  }
})();
