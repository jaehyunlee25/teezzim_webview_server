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
  const suffix = location.href.split("?")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.yongincc.com/Mobile/": funcMain,
    "https://www.yongincc.com/Mobile/Member/LogOut.aspx": funcOut,
    "https://www.yongincc.com/Mobile/Reservation/ReservationList.aspx": funcList,
    "https://www.yongincc.com/Mobile/Reservation/ReservationTimeList.aspx": funcTime,
    "https://www.yongincc.com/Mobile/Reservation/ReservationCheck.aspx": funcExec,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    Out: "11",  /* 용인 */
    In: "22",   /* 석천 */
  };
  const fulldate = [year, month, date].join("-");
  
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
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

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    Reserve(fulldate);
  }
  function funcTime() {
    log("funcTime");

    const els = doc.gcn("timeTbl")[0].gtn("tbody")[0].gtn("tr");
    log("els", els, els.length);
    
    let target;
    Array.from(els).every((el) => {
      const btn = el.children[4].children[0];
      const param = btn.attr("href").inparen();
      const [elDate, elTime, elCourse] = param;

      log(dictCourse[course] == elCourse, time == elTime);
      log(dictCourse[course], elCourse, time, elTime);
      
      if (dictCourse[course] == elCourse && time == elTime) 
        target = btn;
      
      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
    } else {
      LOGOUT();
    }
  }
  function funcExec() {
    log("funcExec");
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
