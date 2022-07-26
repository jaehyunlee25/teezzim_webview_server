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
  const mCourse = "${course}";
  const time = "${time}";
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://www.bearsbestcheongnagc.com/Mobile": funcMain,
    "https://www.bearsbestcheongnagc.com/Mobile/Member/Logout": funcOut,
  };
  const func = dict[addr];

  if (!func) funcOther();
  else func();

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

    location.href = "${reserveUrl}";
  }
  function funcOther() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcCancel();
    });
  }
  function funcCancel() {
    const els = doc.gcn("wrap")[0].gtn("a");
    const dictCourse = {
      11: "Australasia",
      22: "Europe",
      33: "USA",
    };
    let target;
    Array.from(els).every((el) => {
      if(el.str() != "변경") return true;

      const param = el.attr("onclick").inparen();
      const elDate = param[0];
      const elTime = param[2];
      const elCourse = param[1];
      log("reserve cancel", dictCourse[elCourse], elDate, elTime);

      const fulldate = [year, month, date].join("");
      log(elDate == fulldate, dictCourse[elCourse] == mCourse, elTime == time);
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == mCourse &&
        elTime == time
      )
        target = el.parentNode.children[1];
      
      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
    } else {
      funcEnd();
    }
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/Logout";
  }
})();
