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
    "https://www.evendale.co.kr/Mobile/": funcMain,
    "https://www.evendale.co.kr/Mobile/Reservation/ReservationList.aspx": funcList,
    "https://www.evendale.co.kr/Mobile/Member/LogOut.aspx": funcOut,
    "https://www.evendale.co.kr/Mobile/Reservation/ReservationTimeList.aspx": funcTime,
    "https://www.evendale.co.kr/Mobile/Reservation/ReservationCheck.aspx": funcExec,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    Even: "11",
    Dale: "22",
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
      Reserve('',fulldate);
    });
  }
  function funcTime() {
    log("funcTime");

    const els = document.gcn("tbl02")[0].gtn("a");

    let target;
    Array.from(els).every((el) => {
      const param = el.getAttribute("href").inparen();
      const elCourse = param[1];
      const elTime = param[2];
      log(elCourse == dictCourse[course], elTime == time);
      log(elCourse, dictCourse[course], elTime, time);
      if (dictCourse[course] == elCourse && time == elTime) target = el;

      return !target;
    });

    log("target", target);
    if (target)  target.click();
    else LOGOUT();
  }
  function funcExec() {
    ctl00_ContentPlaceHolder1_btnOk.click();
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
