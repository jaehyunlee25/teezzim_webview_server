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
    "http://m.century21cc.co.kr/mobile/reserve_step1.asp": funcTime,
    "http://m.century21cc.co.kr/mobile/reserve_step2.asp": funcExec,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    Pine: "1",
    Lake: "2",
    Field: "3",
    Valley: "4",
    Mountain: "5",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcMain();
  else func();

  function funcMain() {
    log("funcMain");
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
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {      
      Date_Click(year, month, date, [year, month].join(""));
    });
  }
  function funcTime() {
    log("funcTime");
    const sign = dictCourse[course];
    Date_time(fulldate, time, sign, '1', '2', '', '');
  }
  function funcExec() {
    log("funcExec");
    document.getElementsByClassName("cm_ok")[0].children[0].click();
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
