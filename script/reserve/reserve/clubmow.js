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
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://www.clubmow.com/_mobile/login/logout.asp": funcOut,
    "http://www.clubmow.com/_mobile/GolfRes/onepage/my_golfreslist.asp": funcList,
  };
  const func = dict[addr];
  const dictCourse = {
    마운틴: "1",
    오아시스: "2",
    와일드: "3",
  };
  const fulldate = [year, month, date].join("");
  
  if (!func) funcOther();
  else func();
  
  function funcList() {
    log("funcList");
    funcEnd();
    return;
  }
  function funcOut() {
    log("funcOut");
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
      let sign = fulldate.daySign();
      if(sign == "0" || sign == "6") sign = "2";
      else sign = "1";
      timefrom_change(fulldate, sign, fulldate.dayNum(), '', '00', 'T');
      setTimeout(funcTime, 2000);
    });
  }

  function funcTime() {
    log("funcTime");
    log("timeresbtn_" + dictCourse[course] + "_" + time);
    const target = window["timeresbtn_" + dictCourse[course] + "_" + time];
    log("target", target);
    if (target) {
      target.click();
      funcExec();
    } else {
      funcEnd();
    }
  }
  function funcExec() {
    log("funcExec");
    document.getElementsByClassName("cm_ok")[0].children[0].click();
    setTimeout(funcEnd, 1000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "/_mobile/login/logout.asp";
  }
})();
