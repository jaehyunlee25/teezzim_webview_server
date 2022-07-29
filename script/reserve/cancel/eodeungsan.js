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
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcCancel,
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

    location.href = "${reserveUrl}";
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcLogin() {
    log("funcLogin");

    const tag = lsg("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcCancel() {
    log("funcCancel");

    const tag = lsg("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      timer(1000, LOGOUT);
      return;
    }
    lss("TZ_LOGIN", new Date().getTime());

    const els = doc.gcn("btn btn-sm btn-gray");
    let target;
    Array.from(els).forEach((el) => {
      const [elDate, , elCourse, elTime] = el.attr("onclick").inparen();

      log("reserve cancel", course, date, time);
      const fulldate = [year, month, date].join("");
      if (elDate == fulldate && elCourse == course && elTime == time)
        target = el;
    });
    if (target) target.click();
    else LOGOUT();
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
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
