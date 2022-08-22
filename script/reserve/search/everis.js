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
  const suffix = location.href.split("?")[1];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://www.shinangolf.com/": funcMain,
    "https://www.shinangolf.com/member/logout": funcOut,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];  

  if (!func) funcOther();
  else func();

  function funcOut() {
    log("funcOut");
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
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");
    
    if(suffix == "returnMsg=M") localStorage.removeItem("TZ_LOGIN");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      setTimeout(funcSearch, 1000);
    });
  }
  function funcSearch() {
    log("funcReserve");

    const els = document
      .gcn("reservation_table list_table")[0]
      .gtn("tbody")[0]
      .gtn("tr");
    const dictCourse = {
      A: "Lake",
      B: "Saebyul",
      C: "Pine",
    };
    const result = [];
    Array.from(els).forEach((el) => {
      const param = el.attr("onclick").inparen();
      const elCompany = param[1];
      if(elCompany != "17") return;

      const date = param[2];
      const time = param[3];
      const course = param[4];
      console.log("reserve search", course, dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      device_id: "${deviceId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      log(data);
      LOGOUT();
      funcEnd();
    });
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    location.href = "/member/logout";
  }
})();
