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
    "https://m.foresthill.kr/index.asp": funcMain,
    "https://m.foresthill.kr/logout.asp": funcOut,
    "https://m.foresthill.kr/reservation_confirm.asp": funcList,
    "https://m.foresthill.kr/reservation_02_re.asp": funcTime,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    Rock: "1",
    Hill: "2",
    Forest: "3",
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
      Date_Click(year, month, date);
    });
  }
  function funcTime() {
    log("funcTime");
    const sign = dictCourse[course];
    goSend(frmSend, fulldate, sign, 'Rock', time);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "logout.asp";
  }
})();
