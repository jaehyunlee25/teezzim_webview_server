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
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://parkvalley.co.kr/Mobile/": funcMain,
    "https://parkvalley.co.kr/Mobile/Member/Logout.aspx": funcOut,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  if (!func) funcOther();
  else func();

  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    lss("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcMain() {
    log("funcMain");
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    lss("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");
    const tag = lsg("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const tag = lsg("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    lss("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    funcSearch();
  }
  function funcSearch() {
    log("funcSearch");
    const els = doc.gcn("cancelBtn");
    const dictCourse = {
      11: "파크",
      22: "밸리",
    };
    const result = [];
    Array.from(els).forEach((el) => {
      const param = el.attr("onclick").inparen();
      const [elDate, elTime, elCourse] = param;

      console.log("reserve search", dictCourse[elCourse], elDate, elTime);
      result.push({ date: elDate, time: elTime, course: dictCourse[elCourse] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      device_id: "${deviceId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      console.log(data);
      LOGOUT();
    });
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
    });
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
