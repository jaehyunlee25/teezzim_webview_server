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
    "https://dongwonresort.co.kr/_mobile/index.asp": funcMain,
    "https://dongwonresort.co.kr/_mobile/login/logout.asp": funcOut,
    "https://dongwonresort.co.kr/_mobile/GolfRes/onepage/my_golfreslist.asp":
      funcList,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    한려: "1",
    미륵: "2",
  };
  const fulldate = [year, month, date].join("");

  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    funcEnd();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
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
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      let sign = fulldate.daySign();
      if (sign != 1) sign = 2;
      timefrom_change(fulldate, sign, fulldate.dayNum(), "", "00", "T");
      timer(2000, funcTime);
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
    document.gcn("cm_ok")[0].children[0].click();
    setTimeout(LOGOUT, 1000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    location.href = "/_mobile/login/logout.asp";
  }
})();
