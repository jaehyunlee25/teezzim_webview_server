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
    "http://namchuncheon.co.kr/mobile/index.asp": funcMain,
    "http://namchuncheon.co.kr/mobile/logout.asp": funcOut,
    "http://namchuncheon.co.kr/mobile/reservation_confirm.asp": funcList,
    "http://namchuncheon.co.kr/mobile/reservation_02.asp": funcTime,
    "http://namchuncheon.co.kr/mobile/reservation_03.asp": funcExec,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    Victory: "1",
    Challenge: "2",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
  function funcOther() {
    log("funcOther");
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
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {      
      Date_Click(year, month, date);
    });
  }
  function funcTime() {
    log("funcTime");
    
    const sign = dictCourse[course];
    const els = doc.gcn("tab-pane fade in active")[0].gtn("tbody")[0].gcn("btn btn-sm book2");
    let target;
    els.every(el => {
      const param = el.attr("onclick").inparen();
      const [elDate, elCourse, elTime] = param;

      log(elDate == fulldate, elCourse == sign, elTime == time);
      log(elDate, fulldate, elCourse, sign, elTime, time);
      if(elDate == fulldate && elCourse == sign && elTime == time) target = el;

      return !target;
    });

    log("target", target);
    if(target) target.click();
    else LOGOUT();
  }
  function funcExec() {
    log("funcExec");
    const sign = dictCourse[course];
    Book_ok(fulldate, time, sign,'');
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
    location.href = "logout.asp";
  }
})();
