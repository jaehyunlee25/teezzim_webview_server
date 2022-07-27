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
    "https://incheongrand.cc/_mobile/index.asp": funcMain,
    "https://incheongrand.cc/_mobile/login/logout.asp": funcOut,
    "https://m.ara-mir.com/Mobile/Reservation/ReservationTimeList.aspx": funcTime,
    "https://m.ara-mir.com/Mobile/Reservation/ReservationCheck.aspx": funcExec,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    Sun: "11",
    Sea: "22",
    Moon: "33",
  };
  const fulldate = [year, month, date].join("-");
  
  if (!func) funcOther();
  else func();

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
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

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
    if(tag == "true") {
      localStorage.removeItem("TZ_LOGOUT");
      return;
    }
    if(!suffix) location.href = location.href + "?ThisDate=" + fulldate;

    TZLOG(logParam, (data) => {});
    const els = doc.gcn("calendar")[0].gcn("reserved");
    log("els", els, els.length);

    let target;
    Array.from(els).every(el => {
      if(!el.attr("href")) return true;

      const param = el.attr("href").inparen();
      const elDate = param[1];

      log("elDate", elDate);
      log(fulldate == elDate);
      if(fulldate == elDate) target = el;

      return !target;
    });

    log("target", target);
    if(target) target.click();
  }
  function funcTime() {
    log("funcTime");

    const els = doc.gcn("timeTbl")[0].gtn("a");
    
    let target;
    Array.from(els).forEach((el) => {
      const param = el.attr("href").inparen();
      const [elDate, elTime, elCourse] = param;

      log(dictCourse[course] == elCourse, time == elTime);
      log(dictCourse[course], elCourse, time, elTime);
      
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });

    log("target", target);
    if (target) {
      target.click();
    } else {
      localStorage.setItem("TZ_LOGOUT", "true");
      LOGOUT();
    }
  }
  function funcExec() {
    log("funcExec");

    ctl00_ContentPlaceHolder1_lbtOK.clic();
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
    location.href = "/_mobile/login/logout.asp";
  }
})();
