javascript: (() => {
  //${commonScript}
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
    "https://www.curocc.com/mobile/reservation_02.asp": funcTime,
    "http://www.curocc.com/mobile/reservation_03.asp": funcExec,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    파인힐: "1",
    오크힐: "2",
    로키힐: "3",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcMain();
  else func();

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
  function funcLogin() {
    log("funcLogin");
    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    //${loginScript}
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
      log(data);
      Date_Click("B", fulldate);
    });
  }
  function funcTime() {
    log("funcTime");
    const sign = dictCourse[course];
    const week = ["", "일", "월", "화", "수", "목", "금", "토"];
    const weekSign = week[fulldate.dayNum()];
    const els = document.getElementsByClassName("btn btn-sm book2");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const elDate = param[0];
      const elCourse = param[2];
      const elTime = param[4];

      log(elDate == fulldate, elCourse == dictCourse[course], elTime == time);
      log(elDate, fulldate, elCourse, dictCourse[course], elTime, time);
      if (
        elDate == fulldate &&
        elCourse == dictCourse[course] &&
        elTime == time
      )
        target = el;
    });
    log("target", target);
    if (target) target.click();
  }
  function funcExec() {
    log("funcExec");
    const tag = localStorage.getItem("TZ_EXEC");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_EXEC", new Date().getTime());

    document.getElementsByClassName("btn_reserve")[0].children[0].click();
    setTimeout(funcEnd, 1000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "logout.asp";
  }
})();
