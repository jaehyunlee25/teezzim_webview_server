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
    "http://www.sienacountryclub.com/index.asp": funcMain,
    "http://www.sienacountryclub.com/html/member/mem_logout.asp": funcOut,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();

  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcSearch();
    });
  }
  function funcSearch() {
    const els = doc.gcn("reser_cancel");
    const dictCourse = {
      1: "서",
      2: "동",
    };
    const result = [];
    Array.from(els).forEach((el) => {
      const param = el.attr("onclick").inparen();
      const [date, course, time] = param;

      log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
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
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    location.href = "logout.asp";
  }
})();
