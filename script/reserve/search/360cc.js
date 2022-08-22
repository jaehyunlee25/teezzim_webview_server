javascript: (() => {
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
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "http://www.360cc.co.kr/mobile/main/mainPage.do": funcMain,
    "http://www.360cc.co.kr/mobile/user/sign/Logout.do": funcOut,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];

  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcMain");
    
    funcEnd();
    return;
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = lsg("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = lsg("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }  
  function funcReserve() {
    log("funcReserve");
    
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    funcSearch();
  }
  function funcSearch() {
    log("funcSearch");

    const els = doc.gcn("cm_time_list_tbl")[0].gtn("tbody")[0].gtn("tr");
    const dictCourse = {
      OUT: "Out",
      IN: "IN",
    };
    const result = [];
    Array.from(els).forEach((el) => {
      const param = el.children[3].children[0].attr("onclick").inparen();
      const [time, , date, , , course] = param;

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
    log("funcEnd");
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/mobile/user/sign/Logout.do";
  }
})();
