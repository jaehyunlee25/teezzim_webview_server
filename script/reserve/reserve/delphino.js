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
  if (addr.indexOf("#") != -1) addr = location.href.split("#")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.sonofelicecc.com/m.rsv.newInfoList.dp/dmparse.dm": funcList,
    "https://www.sonofelicecc.com/m.logout.dp/dmparse.dm": funcOut,
    "https://www.sonofelicecc.com/m.rsv.selectMobileRsvStepOne.dp/dmparse.dm":
      funcTime,
    "https://www.sonofelicecc.com/m.rsv.selectMobileRsvStepTwo.dp/dmparse.dm":
      funcExec,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    OUT: "A",
    IN: "B",
  };

  const fulldate = [year, month, date].join("");
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    const tag = localStorage.getItem("TZ_LIST");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LIST", new Date().getTime());

    LOGOUT();
    return;
  }
  function funcOut() {
    log("funcOut");
    return;
  }
  function funcMain() {}
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_OTHER", new Date().getTime());

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

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      let sign = fulldate.daySign();
      if (sign != "1") sign = "2";
      selectMobileRsvStepOne(fulldate, "2110", "8", sign, null);
    });
  }
  function funcTime() {
    log("funcTime");

    const sign = dictCourse[course];
    const els = document.getElementsByClassName("reserve");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const elDate = param[0];
      const elTime = param[2];
      const elCourse = param[1];
      log(elDate, fulldate, elTime, time, elCourse, sign);
      log(elDate == fulldate, elTime == time, elCourse == sign);
      if (elDate == fulldate && elTime == time && elCourse == sign) target = el;
    });
    log("target", target);
    if (target) target.click();
  }
  function funcExec() {
    log("funcExec");
    /* 사용자 입력구간 */
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
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
