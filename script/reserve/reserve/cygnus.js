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
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://www.cygnuscc.com/main.asp": funcMain,
    "http://www.cygnuscc.com/booking/logout.asp": funcOut,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    실크: "SILK",
    라미: "RAMIE",
    코튼: "COTTON",
  };
  const fulldate = [year, month, date].join("-");
  log(addr);
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

    location.href = "${searchUrl}";
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");
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
      log(data);
      btn_Search(fulldate, '0', fulldate.daySign());
      setTimeout(funcTime, 1000);
    });
  }
  function funcTime() {
    log("funcTime");
    const els = res_table.getElementsByTagName("button");
    let target;
    Array.from(els).forEach((el) => {
      const elCourse = el.getAttribute("course");
      const elTime = el.getAttribute("time").rm(":");

      log(elCourse == dictCourse[course], elTime == time);
      log(elCourse, dictCourse[course], elTime, time);
      if (
        elCourse == dictCourse[course] &&
        elTime == time
      )
        target = el;
    });
    log("target", target);
    if (target) {
      target.click();
      setTimeout(funcExec, 500);
    }
  }
  function funcExec() {
    log("funcExec");
    const tag = localStorage.getItem("TZ_EXEC");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_EXEC", new Date().getTime());

    document.getElementsByClassName("res_btn_ok")[0].click();
    setTimeout(funcEnd, 500);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "logout.asp";
  }
})();
