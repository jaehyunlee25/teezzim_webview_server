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
    "https://www.diamondcc.co.kr/Mobile/Reservation/ReservationList.aspx":
      funcList,
    "https://www.diamondcc.co.kr/Mobile/Member/LogOut.aspx": funcOut,
    "https://www.diamondcc.co.kr/Mobile/Reservation/Reservation.aspx": funcTime,
    "https://www.diamondcc.co.kr/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    North: "11",
    South: "22",
  };

  const fulldate = [year, month, date].join("-");
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    const tag = localStorage.getItem("TZ_LIST");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LIST", new Date().getTime());

    LOGOUT();
    return;
  }
  function funcOut() {
    log("funcOut");
    return;
  }
  function funcMain() {}
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
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      location.href =
        "/Mobile/Reservation/Reservation.aspx?SelectedDate=" + fulldate;
    });
  }
  function funcTime() {

    const tag = localStorage.getItem("TZ_TIME");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_TIME", new Date().getTime());

    log("funcTime");
    setTimeout(() => {
      const sign = dictCourse[course];
      const els = document.getElementsByClassName("smallBtn");
      log("els", els, els.length);
      let target;
      Array.from(els).forEach((el) => {
        const param = el.getAttribute("href").inparen();
        const elDate = param[0];
        const elTime = param[1];
        const elCourse = param[2];
        log(elDate, fulldate, elTime, time, elCourse, sign);
        log(elDate == fulldate, elTime == time, elCourse == sign);
        if (elDate == fulldate && elTime == time && elCourse == sign) target = el;
      });
      log("target", target);
      if (target) target.click();

    }, 2000);
  }
  function funcExec() {
    log("funcExec");
    setTimeout(() => {
      ctl00_contents_lbtOK.click();
      /* setTimeout(LOGOUT, 1000); */
    }, 2000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
