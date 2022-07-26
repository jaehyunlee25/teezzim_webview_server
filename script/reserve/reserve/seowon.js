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
    "https://www.seowongolf.co.kr/member/actionLogout.do": funcOut,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    EAST: "이스트",
    WEST: "웨스트",
    SOUTH: "사우스",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcOther();
  else func();

  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
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
    try{
      ${loginScript}      
    } catch(e) {
      location.href = "${searchUrl}";
    }
  }
  function funcReserve() {
    log("funcReserve");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    timer(1000, () => {
      onClickDay(fulldate);
      setTimeout(funcTime, 2000);
    });
  }
  function funcTime() {
    log("funcTime");
    const els = window["time-grid"].getElementsByTagName("tr");
    let target;
    Array.from(els).every((el) => {
      const strParam = el.children[0].str();
      const elTime = strParam.regex(/[^0-9]/g);
      const elCourse = strParam.regex(/[^가-힣]/g).ch(2);
      log(time == elTime, dictCourse[course] == elCourse);
      log(time, elTime, dictCourse[course], elCourse);
      if (time == elTime && dictCourse[course] == elCourse)
        target = el.children[4].children[0];
      
      return !target;
    });
    log("target", target);
    if (target) {
      target.click();
      timer(1000, funcExec);
    }
  }
  function funcExec() {
    log("funcExec");
    const tag = localStorage.getItem("TZ_EXEC");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_EXEC", new Date().getTime());

    document.gcn("btnBox4")[0].gcn("motion")[0];
    setTimeout(LOGOUT, 1000);
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
    actionLogout();
  }
})();
