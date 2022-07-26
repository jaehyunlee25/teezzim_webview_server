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
    "https://www.seowongolf.co.kr/member/actionLogout.do": funcOut,
    "https://www.seowongolf.co.kr/m_intro.jsp": LOGOUT,
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
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      LOGOUT();
      return;
    }
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
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      setTimeout(funcSearch, 5000);
    });
  }
  function funcSearch() {
    log("funcSearch");
    const els = window["tbody-reservation"].gtn("tr");
    log("els", els, els.length);

    const result = [];
    const dictCourse = {
      이스트: "EAST",
      웨스트: "WEST",
      사우스: "SOUTH",
    };
    Array.from(els).forEach((el) => {
      const param = el.children;
      const elDate = "20" + param[0].str().rm("/");
      const elTime = param[1].str().rm(":");
      const elCourse = param[2].str().regex(/[^가-힣]/g);
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
      funcEnd();
    });
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    actionLogout();
  }
})();
