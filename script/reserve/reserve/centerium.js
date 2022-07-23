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
  log("raw addr :: ", location.href);
  const addr = location.href.split("#")[0];
  const suffix = location.href.split("#")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://www.centeriumcc.com/mobile/reservation/reservation2.asp": funcTime,
    "http://www.centeriumcc.com/mobile/reservation/reservation3.asp": funcExec,
  };
  const func = dict[addr];
  const dictCourse = {
    Wales: "C",
    England: "A",
    Scotland: "B",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcMain();
  else func();

  function funcMain() {
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      goRsrv("1", fulldate, fulldate.daySign(), "");
    });
  }
  function funcTime() {
    log("timeresbtn_" + dictCourse[course] + "_" + time);
    const els = document
      .getElementsByClassName("courseTab1")[0]
      .getElementsByClassName("listBox");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const elDate = param[0];
      const elTime = param[1];
      const elCourse = param[2];
      log(
        elDate == fulldate && elTime == time && elCourse == dictCourse[course]
      );
      log(elDate, fulldate, elTime, time, elCourse, dictCourse[course]);
      if (
        elDate == fulldate &&
        elTime == time &&
        elCourse == dictCourse[course]
      )
        target = el;
    });

    log("target", target);
    if (target) {
      target.click();
      funcExec();
    } else {
      funcEnd();
    }
  }
  function funcExec() {
    log("funcExec");
    document.getElementsByClassName("darkRedBtn")[0].children[0].click();
    setTimeout(funcEnd, 1000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "/_mobile/login/logout.asp";
  }
})();
