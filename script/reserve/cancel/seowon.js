javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/cancel",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/cancel",
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
    "${reserveUrl}": funcReserve,
    "https://www.seowongolf.co.kr/member/actionLogout.do": funcOut,
    "https://www.seowongolf.co.kr/m_intro.jsp": LOGOUT,
  };
  const func = dict[addr];
  if (!func) funcOther();
  else func();

  function funcOut() {
    log("funcOut");
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {  
    log("funcLogin");  
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      setTimeout(funcCancel, 5000);
    });
  }
  function funcCancel() {
    log("funcCancel");
    const els = window["tbody-reservation"].gtn("tr");
    const dictCourse = {
      이스트: "EAST",
      웨스트: "WEST",
      사우스: "SOUTH",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.children;
      const elDate = "20" + param[0].str().rm("/");
      const elTime = param[1].str().rm(":");
      const elCourse = param[2].str().regex(/[^가-힣]/g);
      log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");
      log(elDate, fulldate, dictCourse[elCourse], course, elTime, time);
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = el.children[7].children[0];
    });
    log("target", target);
    if (target) {
      target.click();
      document.gcn("btnBox1")[0].gtn("a")[0].click();
      setTimeout(funcEnd, 1000);
    } else {
      funcEnd();
    }
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
    });
  }
  function LOGOUT() {
    actionLogout();
  }
})();
