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
  const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
  const addr = location.href.split(splitter)[0];
  const suffix = location.href.split(splitter)[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://lavieestbellegolfnresort.com/oldcourse/_mobile/index.asp": funcMain,
    "http://lavieestbellegolfnresort.com/oldcourse/_mobile/login/logout.asp": funcOut,
    "http://lavieestbellegolfnresort.com/_mobile/GolfRes/onepage/my_golfreslist.asp": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    OUT: "1",
    IN: "2",
  };
  const fulldate = [year, month, date].join("");

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

    if(doc.gcn("cm_dPdir").length > 0) {
      funcExec();
      return;
    } else if (doc.gcn("cm_dPdir").length > 0) {
      funcTime();
      return;
    } 

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    let sign = fulldate.daySign();
    if (sign != 1) sign = 2;
    timefrom_change(fulldate, sign, fulldate.dayNum(), "", "00", "T");
  }
  function funcTime() {
    log("funcTime");

    const tag = localStorage.getItem("TZ_TIME");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_TIME", new Date().getTime());
    
    const els = doc.gcn("cm_dPdir");
    log("els", els, els.length);

    let target;
    els.every((el) => {
      const param = el.children[0].attr("href").inparen();
      const [, elCourse, elTime] = param;
      const sign = dictCourse[course];

      log(elCourse, sign, elTime, time);
      log(elCourse == sign, elTime == time);
      if (elCourse == sign && elTime == time) target = el.children[0];

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
    doc.gcn("cm_ok")[0].children[0].click();
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
    location.href = "/oldcourse/_mobile/login/logout.asp";
  }
})();
