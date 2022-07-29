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
    "https://www.beaconhills.co.kr/Mobile/Member/LogOut.aspx": funcOut,
    "https://www.beaconhills.co.kr/Mobile/Reservation/Reservation.aspx": funcTime,
    "https://www.beaconhills.co.kr/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    누리: "11",
    하늘: "22",
  };
  const fulldate = [year, month, date].join("-");
  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
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
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    location.href = "/Mobile/Reservation/Reservation.aspx?SelDate=" + fulldate;
  }
  function funcTime() {
    log("funcTime");
    const sign = dictCourse[course];
    const els = document.getElementsByClassName("revBtn");
    log("els", els, els.length);

    let target;
    Array.from(els).every((el) => {
      const param = el.getAttribute("href").inparen();
      const [elDate, elTime, elCourse] = param;

      log(elDate == fulldate, elTime == time, elCourse == sign);
      log(elDate, fulldate, elTime,  time, elCourse, sign);
      if (elDate == fulldate && elTime == time && elCourse == sign) target = el;

      return !target;
    });

    log("target", target);
    if (target) target.click();
    else LOGOUT();
  }
  function funcExec() {
    log("funcExec");
    const strEnd = "end of reserve/reserve";
    ctl00_ContentPlaceHolder1_lbtOK.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      ctl00_ContentPlaceHolder1_lbtOK.click();
    }, 1000);
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
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
