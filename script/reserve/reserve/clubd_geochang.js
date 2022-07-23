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
    "https://www.clubd.com/m_clubd/index.do": funcMain,
    "https://www.clubd.com/clubd/member/actionLogout.do": funcOut,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    East: "EAST",
    West: "WEST",
  };
  const fulldate = [year, month, date].join("");
  
  if (!func) funcOther();
  else func();

  function funcOut() {
    return;
  }
  function funcMain() {
    if(suffix == "iCoDiv=03") funcReserve();
    else funcOther();
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

    ${loginScript}
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
      onClickDay(fulldate);
      setTimeout(funcTime, 2000);
    });
  }
  function funcTime() {
    log("funcTime");
    const els = window["time-grid"].getElementsByTagName("tr");
    let target;
    Array.from(els).forEach(el => {
      const strParam = el.children[0].innerText;
      const elTime = strParam.replace(/[^0-9]/g, "");
      const elCourse = strParam.replace(/[^A-Z]/g, "");
      log(time == elTime, dictCourse[course] == elCourse);
      log(time, elTime, dictCourse[course], elCourse);
      if(time == elTime && dictCourse[course] == elCourse) target = el.children[0];
    });
    log("target", target);
    if(target) {
      target.click();
      funcExec();
    }
  }
  function funcExec() {
    log("funcExec");
    const tag = localStorage.getItem("TZ_EXEC");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_EXEC", new Date().getTime());

    document.getElementsByClassName("btnBox4")[0].getElementsByClassName("motion")[0].click();
    setTimeout(funcEnd, 1000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "/clubd/member/actionLogout.do";
  }
})();
