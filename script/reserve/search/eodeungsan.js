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
  const addr = location.href;
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://www.eodeungsancc.com/mobile/index.asp": funcMain,
    "https://www.eodeungsancc.com/mobile/logout.asp": funcOut,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];

  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcMain");
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    lss("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
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
    
    const tag = lsg("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_RESERVE", new Date().getTime());
    
    const els = doc.gcn("btn btn-sm btn-gray");
    const result = [];
    Array.from(els).forEach((el) => {
      const [date, , course, time] = el.attr("onclick").inparen();

      log("reserve search", course, date, time);
      result.push({ date, time, course });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      log(data);
      LOGOUT();
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
    log("LOGOUT");
    location.href = "/mobile/logout.asp";
  }
})();
