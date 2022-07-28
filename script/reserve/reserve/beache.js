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
    "http://www.beachegolf.com/Mobile/Member/LogOut.aspx": funcOut,
    "http://www.beachegolf.com/Mobile/Reservation/ReservationList.aspx": funcList,
    "http://www.beachegolf.com/Mobile/Reservation/ReservationTimeList.aspx":
      funcTime,
    "http://www.beachegolf.com/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    다산: "11",
    베아채: "22",
    장보고: "33",
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

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    Reserve(fulldate);
  }
  function funcTime() {
    log("funcTime");

    const sign = dictCourse[course];
    const els = doc.gcn("timeTbl")[0].gtn("tbody")[0].gtn("tr");
    log("els", els, els.length);
    
    let target;
    Array.from(els).forEach((el) => {
      const a = el.children[3].children[0];
      const param = a.attr("href").inparen();
      const [elDate, elTime, elCourse] = param;

      log(dictCourse[course] == elCourse, time == elTime);
      log(dictCourse[course], elCourse, time, elTime);
      
      if (
        elDate == fulldate &&
        elTime == time &&
        elCourse == dictCourse[course]
      )
        target = a;
    });
    
    log("target", target);
    if (target) target.click();
    else LOGOUT();
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
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
