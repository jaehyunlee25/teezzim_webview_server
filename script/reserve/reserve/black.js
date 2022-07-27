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
    "https://www.blackcc.co.kr/Mobile/": funcMain,
    "https://www.blackcc.co.kr/Mobile/Member/LogOut.aspx": funcOut,
    "https://www.blackcc.co.kr/Mobile/Reservation/ReservationList.aspx": funcList,
    "https://www.blackcc.co.kr/Mobile/reservation/ReservationTimeList.aspx":
      funcTime,
    "https://www.blackcc.co.kr/Mobile/reservation/ReservationCheck.aspx": funcExec,
  };
  const dictCourse = {
    Black: "11",
    Valley: "22",
  };
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

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    Reserve("", fulldate);
  }
  function funcTime() {
    const els = doc.gcn("tbl02")[0].gtn("a");
    
    let target;
    Array.from(els).every((el) => {
      const param = el.attr("href").inparen();
      const elTime = param[1];
      const elCourse = param[2];
      if (dictCourse[course] == elCourse && time == elTime) target = el;

      return !target;
    });
    if (target) {
      target.click();
    } else {
      LOGOUT();
    }
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    ContentPlaceHolder1_btnOk.click();
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
