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
  const suffix = location.href.split("?")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const mCourse = "${course}";
  const time = "${time}";

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.bearsbestcheongnagc.com/Mobile": funcMain,
    "https://www.bearsbestcheongnagc.com/Mobile/Member/Logout": funcEnd,
    "https://www.bearsbestcheongnagc.com/Mobile/Booking/SelectTime": funcTime,
    "https://www.bearsbestcheongnagc.com/Mobile/Booking/ReservationForm": funcExec,
    "https://www.bearsbestcheongnagc.com/Mobile/Booking/ReservedList": funcList,
  };
  const func = dict[addr];
  const dictCourse = {
    Australasia: "11",
    Europe: "22",
    USA: "33",
  };
  const fulldate = [year, month, date].join("");
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    return;
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcReserve() {
    log("funcReserve");
    if(suffix == "coGubun=P")  funcDate();

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    location.href = "${searchUrl}?coGubun=P";
  }
  function funcDate() {
    log("funcDate");
    const tag = localStorage.getItem("TZ_Date");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_Date", new Date().getTime());

    TZLOG(logParam, (data) => {
      reservation(fulldate);
    });
  }
  function funcTime() {
    log("funcTime");
    const els = AjaxTime.gtn("a");
    log("els", els, els.length);

    let target;
    Array.from(els).forEach((el) => {
      const param = el.parentNode.parentNode.children;
      const elCourse = param[0].str();
      const elTime = param[2].str().rm(":");
      log(elCourse, elTime);
      log(elCourse == mCourse, elTime == time);
      if (elCourse == mCourse && elTime == time)
        target = el;
    });

    log("target", target);
    if (target) target.click();
    else LOGOUT();
  }
  function funcExec() {
    log("funcExec");
    doc.gcn("col")[0].click();
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
    location.href = "/Mobile/Member/Logout";
  }
})();
