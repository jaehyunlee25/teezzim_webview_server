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
  if(addr.indexOf("#") != -1) addr = location.href.split("#")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.jayurocc.com/Mobile/Member/Login": funcLogin,
    "https://www.jayurocc.com/Mobile/Reservation/ReservationCheck": funcExec,
    "https://www.jayurocc.com/Mobile/Member/Logout": funcOut,
    "https://www.jayurocc.com/Mobile/": funcMain,
    "https://www.jayurocc.com/Mobile/Reservation/ReservationList": funcList,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    대한: "11",
    민국: "22",
    통일: "33",
  };
  const fulldate = [year, month, date].join("-");
  log(addr);
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  };
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  };
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
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
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
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
      Update("LIST|" + first + "|" + fulldate + "|Y|1||");
      setTimeout(funcTime, 1000);
    });
  }
  function funcTime() {
    log("enter", "funcTime");
    const els = doc.gcn("smallBtn");
    let target;
    Array.from(els).every((el) => {
      const param = el.getAttribute("href").inparen();
      const [elDate, elTime, elCourse] = param;
      const sign = dictCourse[course];
      log(elDate, fulldate, elTime, time, elCourse, sign);
      log(elDate == fulldate, elTime == time, elCourse == sign);
      if (elDate == fulldate && elTime == time && elCourse == sign)
        target = el;

      return !target;  
    });

    log("target", target);
    if (target) target.click();
    else LOGOUT();
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    log("funcExec");
    ctl00_Content_lbtOK.click();    
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
