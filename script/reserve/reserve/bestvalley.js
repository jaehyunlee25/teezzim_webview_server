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
    "https://www.bestvalleygc.com/Mobile/Reservation/ReservationTimeList.aspx":
      funcTime,
    "https://www.bestvalleygc.com/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
    "https://www.bestvalleygc.com/Mobile/": funcMain,
    "https://www.bestvalleygc.com/Mobile/Member/LogOut.aspx": funcOut,
    "https://www.bestvalleygc.com/Mobile/Reservation/ReservationList.aspx": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    단일: "11",
  };
  const fulldate = [year, month, date].join("-");
  
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
    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      Reserve('',fulldate, '2');
    });
  }
  function funcTime() {
    const sign = dictCourse[course];
    const els = document
      .getElementsByClassName("timeTbl")[1]
      .getElementsByTagName("a");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      if (param[0] == fulldate && param[1] == time && param[2] == sign)
        target = el;
    });
    if (target) target.click();
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    ctl00_ContentPlaceHolder1_lbtOK.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "/Mobile/Member/LogOut.aspx";
    }, 1000);
  }
})();
