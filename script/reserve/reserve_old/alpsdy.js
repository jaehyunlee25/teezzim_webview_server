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
    "https://www.alpsdy.com/Mobile/": funcMain,
    "https://www.alpsdy.com/Mobile/member/LogOut.aspx": funcOut,
    "https://www.alpsdy.com/Mobile/Reservation/ReservationList.aspx": funcList,
    "https://www.alpsdy.com/Mobile/reservation/ReservationTimeList.aspx":
      funcTime,
    "https://www.alpsdy.com/Mobile/reservation/ReservationCheck.aspx": funcExec,
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

    const tag = localStorage.getItem("TZ_LOGOUT");
    if(tag == "true") {
      localStorage.removeItem("TZ_LOGOUT");
      return;
    }
    TZLOG(logParam, (data) => {});
    Reserve("", fulldate);
  }
  function funcTime() {
    log("funcTime");

    const els = doc.gcn("reser_btn2");
    const dictCourse = {
      In: "22",
      Out: "11",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const elCourse = param[2];
      const elTime = param[1];
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });

    log("target", target);
    if (target) {
      target.click();
    } else {
      LOGOUT
    }
  }
  function funcExec() {
    ctl00_ContentPlaceHolder1_btnOk.click();
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
