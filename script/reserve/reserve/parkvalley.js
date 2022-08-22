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
    "https://parkvalley.co.kr/Mobile/": funcMain,
    "https://parkvalley.co.kr/Mobile/Member/Logout.aspx": funcOut,
    "https://parkvalley.co.kr/Mobile/Booking/ReservedList.aspx": funcList,
    "https://parkvalley.co.kr/Mobile/Booking/ReservationProgress.aspx": funcExec,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    파크: "11",
    밸리: "22",
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
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    lss("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcMain() {
    log("funcMain");
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    lss("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = lsg("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    lss("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const tag = lsg("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    lss("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    const els = doc.gcn("calenda mt50")[0].gcn("reserve");
    log("els", els, els.length);

    let target;
    els.every(el => {
      const param = el.attr("href").inparen()[0].split("|");
      const [ , , elDate] = param;

      log(elDate);
      log(elDate == fulldate);

      if(elDate == fulldate) target = el;
      return !target;
    });

    log("target", target);
    if(target) {
      target.click();
      setTimeout(funcTime, 1000);
    } else {
      LOGOUT();
    }
  }
  function funcTime() {
    log("enter", "funcTime");
    const els = doc.gcn("reservBtn");
    let target;
    Array.from(els).every((el) => {
      const param = el.attr("onclick").inparen();
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
    log("funcExec");
    ctl00_contents_lnkBtnReserveOk.click();    
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
    location.href = "/Mobile/Member/Logout.aspx";
  }
})();
