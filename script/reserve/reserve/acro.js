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
    "http://www.acrogolf.co.kr/mobile/index.asp": funcMain,
    "http://www.acrogolf.co.kr/mobile/logout.asp": funcOut,
    "http://www.acrogolf.co.kr/mobile/reserveConfirm.asp": funcList,
    "http://www.acrogolf.co.kr/mobile/reserve_step1.asp": funcTime,
    "http://www.acrogolf.co.kr/mobile/reserve_step2.asp": funcExec,
    "http://www.acrogolf.co.kr/mobile/reserveConfirm.asp": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = { 
    챌린지: "1", 
    스카이: "3", 
    마스터: "2" 
  };

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
    const param = {
      type: "command",
      sub_type: "reserve/reserve",
      device_id: "${deviceId}",
      device_token: "${deviceToken}",
      golf_club_id: "${golfClubId}",
      message: "start reserve/reserve",
      parameter: JSON.stringify({}),
    };
    TZLOG(param, (data) => {
      log(data);
    });
    Date_Click(year, month, date);
  }
  function funcTime() {
    const fulldate = [year, month, date].join("");
    const strCourse = { 챌린지: "C코스", 스카이: "S코스", 마스터: "M코스" };
    
    Book_time(fulldate, dictCourse[course], strCourse[course], time, "", "");
  }
  function funcExec() {
    /* const fulldate = [year, month, date].join("");
    const signCourse = { 챌린지: "1", 스카이: "3", 마스터: "2" }; */
    document.getElementsByClassName("btn book mt10")[0].click();
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
    location.href = "/mobile/logout.asp";
  }
})();
