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
    "http://www.gochangcc.co.kr/mobile/index.asp": funcMain,
    "http://www.gochangcc.co.kr/mobile/logout.asp": funcOut,
    "http://www.gochangcc.co.kr/mobile/reserve02.asp": funcList,
    "http://www.gochangcc.co.kr/mobile/reserve01_step1.asp": funcTime,
    "http://www.gochangcc.co.kr/mobile/reserve01_step2.asp": funcExec,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    바다: "1",
    푸른: "2",
    하늘: "3",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcMain();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
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
      Date_Click(year, month, date);
    });
  }
  function funcTime() {
    log("funcTime");
    const sign = dictCourse[course];
    Book_time(fulldate, fulldate.dayKor(), sign, course, time);
  }
  function funcExec() {
    log("funcExec");
    const sign = dictCourse[course];
    Book_ok(fulldate, '', sign, course, time);
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
    location.href = "logout.asp";
  }
})();
