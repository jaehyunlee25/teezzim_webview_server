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
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://m.ara-mir.com/Mobile/": funcMain,
    "https://m.ara-mir.com/Mobile/Member/LogOut.aspx": funcOut,
    "https://m.ara-mir.com/Mobile/Reservation/ReservationTimeList.aspx": funcTime,
    "https://m.ara-mir.com/Mobile/Reservation/ReservationCheck.aspx": funcExec,
    "https://m.ara-mir.com/Mobile/Reservation/ReservationList.aspx": funcList,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
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
    if (tag && new Date().getTime() - tag < 1000 * 5) {
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

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    if(!suffix) location.href = location.href + "?ThisDate=" + fulldate;
    TZLOG(logParam, (data) => {
      const els = doc.gcn("tbl02")[0].gcn("r_choice");
      let target;
      Array.from(els).forEach(el => {
        const param = el.getAttribute("data-date");
        if(fulldate == param) target = el;
      });
      if(target) target.click();
    });
  }
  function funcTime() {
    log("funcTime");

    const els = doc.gcn("reser_btn0");
    const dictCourse = {
      ara_out: "11",
      ara_in: "22",
      mir_out: "33",
      mir_in: "44",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const elCourse = param[1];
      const elTime = param[2];
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });
    if (target) {
      target.click();
    } else {
      LOGOUT();
    }
  }
  function funcExec() {
    log("funcExec");    
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
