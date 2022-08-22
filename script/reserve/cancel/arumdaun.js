javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/cancel",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/cancel",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("?")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "http://m2.arumdaunresort.com/main.asp": funcMain,
    "http://m2.arumdaunresort.com/include/menu.asp": funcMenu,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcMenu() {
    log("funcMenu");

    checkLogOut();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    funcCancel();
  }
  function funcCancel() {
    log("funcCancel");
    
    const els = doc.gcn("open_pop btn_type01 marL_5");
    const dictCourse = {
      1: "Hill",
      2: "Lake",
      3: "Rock",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.attr("href").inparen();

      const elDate = param[0];
      const elTime = param[3];
      const elCourse = param[1];

      log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");
      log(elDate == fulldate, dictCourse[elCourse] == course, elTime == time);
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = el;
    });

    log("target", target);
    if (target) {
      target.click();
      setTimeout(funcEnd, 1000);
    } else {
      LOGOUT();
    }
  }
  function funcEnd() {
    log("funcEnd");

    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      if (ac) ac.message(strEnd);
      checkLogOut();
    });
  }
  function LOGOUT() {
    log("LOGOUT");

    location.href = "/include/menu.asp";
  }
})();
