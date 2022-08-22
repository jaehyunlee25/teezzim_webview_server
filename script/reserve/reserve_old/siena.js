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
    "http://www.sienacountryclub.com/index.asp": funcMain,
    "http://www.sienacountryclub.com/html/member/mem_logout.asp": funcOut,
    "http://www.sienacountryclub.com/html/reservation/reservation_02.asp": funcList,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  
  const func = dict[addr];
  const dictCourse = {
    서: "1",
    동: "2",
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

    TZLOG(logParam, (data) => {});

    const tees = doc.gcn("teeup");
    const btn = doc.gcn("btn_reserve");

    if(tees.length == 0 && btn.length == 0){
      Date_Click(year, month, date);
    } else if (tees.length > 0 && btn.length == 0) {
      funcTime();
    } else if (tees.length > 0 && btn.length > 0) {
      funcExec();
    }

  }  
  function funcTime() {
    log("funcTime");
    
    const sign = dictCourse[course];
    const els = doc.gcn("teeup")[0].gtn("button");
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
    location.href = "/html/member/mem_logout.asp";
  }
})();
