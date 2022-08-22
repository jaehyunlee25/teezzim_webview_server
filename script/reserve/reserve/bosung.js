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
  let addr = location.href.split("?")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://www.bosungcc.co.kr/mobile/reserve01_step1.asp": funcTime,
    "http://www.bosungcc.co.kr/mobile/reserve01_step2.asp": funcExec,
    "http://www.bosungcc.co.kr/mobile/index.asp": funcMain,
  };
  const func = dict[addr];
  const dictCourse = {
    Mountain: "1",
    Lake: "2",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) location.href = "${searchUrl}";
  else func();

  function funcMain() {
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());
    
    location.href = "${searchUrl}";
  }
  function funcLogin() {
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
      Date_Click(year, month, date);
    });
  }
  function funcTime() {
    log("enter", "funcTime");
    const sign = dictCourse[course];
    Book_time(fulldate, sign, time);

    /* const els = document.getElementsByClassName("reservBtn");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      log(param[0], fulldate, param[1], time, param[2], sign);
      if (param[0] == fulldate && param[1] == time && param[2] == sign)
        target = el;
    });
    log("target", target);
    if (target) target.click(); */
  }
  function funcExec() {
    log("funcExec");
    const sign = dictCourse[course];
    Book_ok(fulldate, sign, time);
    setTimeout(funcEnd, 1000);
  }
  function funcEnd() {
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
    location.href = "login_out.asp";
  }
})();
