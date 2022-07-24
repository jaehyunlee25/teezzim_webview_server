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
    "https://dyhills.basecc.co.kr:6443/Mobile/Reservation/ReservationTimeList.aspx":
      funcTime,
    "https://dyhills.basecc.co.kr:6443/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
    "https://dyhills.basecc.co.kr:6443/Mobile/Main/Main.aspx": funcMain,
    "https://dyhills.basecc.co.kr:6443/Mobile/Reservation/ReservationList.aspx":
      LOGOUT,
  };
  const func = dict[addr];
  const dictCourse = {
    力: "11",
    靑: "22",
    美: "33",
  };
  const fulldate = [year, month, date].join("-");
  if (!func) location.href = "${searchUrl}";
  else func();

  function funcMain() {
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      Reserve(fulldate, "1");
    });
  }
  function funcTime() {
    const fd = [year, month, date].join("");
    const sign = dictCourse[course];
    const els = document.gcn("reserv_btn");
    let target;
    els.every((el) => {
      const param = el.attr("href").inparen();
      const elDate = param[0];
      const elCourse = param[1];
      const elTime = param[2];

      log(elDate == fd, elCourse == sign, elTime == time);
      log(elDate, fd, elCourse, sign, elTime, time);
      if (elDate == fd && elCourse == sign && elTime == time) target = el;
    });
    if (target) target.click();
  }
  function funcExec() {
    ctl00_ContentPlaceHolder1_lbtOK.click();
    timer(1000, LOGOUT);
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
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
