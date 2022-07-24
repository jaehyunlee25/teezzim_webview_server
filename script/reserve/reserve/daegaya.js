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
  let addr = location.href.split("?")[0];
  if (addr.indexOf("#") != -1) addr = location.href.split("#")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.daegayacc.com/Mobile/Default.aspx": funcMain,
    "https://www.daegayacc.com/Mobile/Reservation/ReservationList.aspx":
      funcList,
    "https://www.cypress.co.kr/Mobile/Member/LogOut.aspx": funcOut,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    단일: "11",
  };

  const fulldate = [year, month, date].join("-");
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcOut");
    return;
  }
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
      const first = [year, month, "01"].join("-");
      const day = new Date([year, month, date].join("/")).getDay();
      const sign = day < 5 ? 1 : day == 5 ? 2 : 3;
      Update(
        "LIST|" +
          (fulldate.ct(2) + "01") +
          "|" +
          fulldate +
          "|Y|" +
          fulldate.daySign() +
          "||"
      );
      setTimeout(funcTime, 500);
    });
  }
  function funcTime() {
    log("funcTime");

    const sign = dictCourse[course];
    const els = document.getElementsByClassName("btn_reserve");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen()[0].split("|");
      const elDate = param[1];
      const elTime = param[2];
      const elCourse = param[3];
      log(elDate, fulldate, elTime, time, elCourse, sign);
      log(elDate == fulldate, elTime == time, elCourse == sign);
      if (elDate == fulldate && elTime == time && elCourse == sign) target = el;
    });
    log("target", target);
    if (target) {
      target.click();
      setTimeout(funcExec, 500);
    }
  }
  function funcExec() {
    log("funcExec");
    contents_lbtOK.click();
    setTimeout(LOGOUT, 1000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
