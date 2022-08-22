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
    "https://www.fortunehills.co.kr/Mobile/Reservation/ReservationTimeList.aspx":
      funcTime,
    "https://www.fortunehills.co.kr/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
    "https://www.fortunehills.co.kr/Mobile/": funcMain,
    "https://www.fortunehills.co.kr/Mobile/Member/LogOut.aspx": funcOut,
    "https://www.fortunehills.co.kr/Mobile/Reservation/ReservationList.aspx":
      funcList,
  };
  const func = dict[addr];
  const dictCourse = {
    가든: "11",
    팰리스: "22",
    캐슬: "33",
  };
  const fulldate = [year, month, date].join("-");
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
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
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    Reserve('',fulldate, '1');
    /* let target;
    document.gcn("Tablersv")[0].gtn("a").every(el => {
      const href = el.attr("href");
      if(href == "#") return true;
      const param = href.inparen();
      log(param[1], fulldate);
      if(param[1] == fulldate) target = el;

      return !target;
    });

    log("target", target);
    if(target) target.click(); */
  }
  function funcTime() {
    log("funcTime");
    const fd = [year, month, date].join("");
    const sign = dictCourse[course];
    const els = document.gcn("bt_reserved");
    let target;
    els.every((el) => {
      const param = el.children[0].attr("href").inparen();
      const elDate = param[0];
      const elCourse = param[1];
      const elTime = param[2];

      log(elDate == fd, elCourse == sign, elTime == time);
      log(elDate, fd, elCourse, sign, elTime, time);
      if (elDate == fd && elCourse == sign && elTime == time) target = el.children[0];

      return !target;
    });

    log("target", target);
    if (target) target.click();
  }
  function funcExec() {
    log("funcExec");
    ctl00_ContentPlaceHolder1_rdoInwon4.click();
    ctl00_ContentPlaceHolder1_lbtOK.click();
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
