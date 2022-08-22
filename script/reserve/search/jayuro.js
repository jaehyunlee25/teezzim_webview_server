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
    "https://www.jayurocc.com/Mobile/Member/Login": funcLogin,
    "https://www.jayurocc.com/Mobile/Member/Logout": funcOut,
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
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    funcSearch();
  }
  function funcSearch() {
    log("funcSearch");
    const els = doc.gcn("table_reserv02")[0].gcn("smallBtn");
    const dictCourse = {
      11: "대한",
      22: "민국",
      33: "통일",
    };
    const result = [];
    Array.from(els).forEach((el) => {
      if(el.str() != "취소") return true;

      const param = el.attr("href").inparen();
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
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      if (ac) ac.message(strEnd);
    });
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
