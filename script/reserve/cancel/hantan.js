javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/cancel",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/cancel",
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
    "${reserveUrl}": funcReserve,
    "https://m.hantancc.co.kr/": funcMain,
    "https://m.hantancc.co.kr/m/logout.asp": funcOut,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  if (!func) funcOther();
  else func();

  function funcOther() {
    log("funcOther");
    return;
  }
  function funcOut() {
    log("funcOut");
    return;
    funcEnd();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {  
    log("funcLogin");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    return;
    
    const tag = localStorage.getItem("TZ_CANCEL_RESERVE");
    if (!tag) {
      localStorage.setItem("TZ_CANCEL_RESERVE", "1");
      return;
    } else if (tag == "1") {
      log("tag", tag);
      localStorage.setItem("TZ_CANCEL_RESERVE", "2");
      return;
    } else if (tag == "2") {
      log("tag", tag);
      localStorage.setItem("TZ_CANCEL_RESERVE", "3");
    } else if (tag == "3") {
      log("tag", tag);
      localStorage.setItem("TZ_CANCEL_RESERVE", "4");
      return;
    } else if (tag == "4") {
      log("tag", tag);
      localStorage.setItem("TZ_CANCEL_RESERVE", "5");
      return;
    } else {
      log("tag else", tag);
      return;
    }

    TZLOG(logParam, (data) => {});
    funcCancel();
  }
  function funcCancel() {
    log("funcCancel");
    localStorage.removeItem("TZ_CANCEL_RESERVE");
    
    const els = doc.gcn("tadiv");
    log("els", els, els.length);
    return;

    const dictCourse = {
      1: "VALLEY",
      2: "MOUNTAIN",
    };
    let target;
    Array.from(els).every((el) => {
      const param = el.children[0].attr("onclick").inparen();
      const [elDate, elCourse, elTime] = param;

      log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");

      log(elDate, fulldate, dictCourse[elCourse], course, elTime, time);
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = el;
      
      return !target;
    });
    log("target", target);
    if (target) {
      target.click();
    } else {
      LOGOUT();
    }
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
    });
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/m/logout.asp";
  }
})();
