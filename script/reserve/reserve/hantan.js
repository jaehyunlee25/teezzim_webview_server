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
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://m.hantancc.co.kr/": funcMain,
    "https://m.hantancc.co.kr/m/logout.asp": funcOut,
    "https://booking.hantancc.co.kr/m/reservation_05.asp": funcList,
    "https://booking.hantancc.co.kr/m/reservation_01_2.asp": funcExec,
    "https://booking.hantancc.co.kr/m/reservation_01_3.asp": funcLast,
    "https://booking.hantancc.co.kr/m/reservation_01.asp#go_focus": funcTime,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    VALLEY: "1",
    MOUNTAIN: "2",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcOther();
  else func();

  function funcOther() {
    log("funcOther");
    return;
  }
  function funcList() {
    log("funcList");
    return;
  }
  function funcOut() {
    log("funcOut");
    return;
  }
  function funcMain() {
    log("funcMain");
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
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    Date_Click(fulldate, fulldate.ct(2));
  }
  function funcTime() {
    log("funcTime");

    const tag = localStorage.getItem("TZ_TIME");
    if (!tag) {
      localStorage.setItem("TZ_TIME", "1");
      return;
    } else if (tag == "1") {
      log("tag", tag);
      localStorage.setItem("TZ_TIME", "2");
      return;
    } else if (tag == "2") {
      log("tag", tag);
      localStorage.setItem("TZ_TIME", "3");
    } else if (tag == "3") {
      log("tag", tag);
      localStorage.setItem("TZ_TIME", "4");
      return;
    } else {
      log("tag else", tag);
      return;
    }

    const els = doc.gtn("a");
    log("els", els, els.length);

    let target;
    els.every(el => {
      const href = el.attr("href");
      if(!href || href.indexOf("JavaScript:Book_time(") == -1) return true;
      
      const param = href.inparen();
      const [elDate, elTime, elCourse] = param;
      const sign = dictCourse[course];

      log(elDate == fulldate, elTime == time, elCourse == sign);
      log(elDate, fulldate, elTime, time, elCourse, sign);
      if(elDate == fulldate && elTime == time && elCourse == sign) target = el;

      return !target;
    });

    log("target", target);
    if(target) target.click();
  }
  function funcExec() {
    log("funcExec");
    localStorage.setItem("TZ_TIME", "4");
    return;
    const tag = localStorage.getItem("TZ_EXEC");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_EXEC", new Date().getTime());
   
    return;
  }
  function funcLast() {
    log("funcLast");
    return;
  }
  function funcEnd() {
    log("funcEnd");
    return;
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    return;
    log("LOGOUT");
    location.href = "/m/logout.asp";
  }
})();
