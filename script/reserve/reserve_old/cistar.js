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
    "https://www.cistar.co.kr/view/golfRsvnStep2.do": funcTime,
    "https://www.cistar.co.kr/view/golfRsvnStep3.do": funcExec,
    "https://www.cistar.co.kr/view/logout.asp": funcOut,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    "단일": "시스타18홀",
  };
  const fulldate = [year, month, date].join("-");
  log(addr);
  if (!func) funcMain();
  else func();

  function funcOut() {
    log("funcOut");
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
      const span = document.createElement("span");
      span.className = "rsvn btnRsvn";
      span.setAttribute("resv", "Y");
      span.setAttribute("val", fulldate);
      span.setAttribute("dateval", "2");
      span.setAttribute("opendiv", "Y");
      span.setAttribute("href", "#");
      document.body.appendChild(span);
      span.click();
    });
  }
  function funcTime() {
    log("funcTime");
    const span = document.createElement("span");
    span.className = "default btnTimeSelect";
    span.setAttribute("data-hour", time.gh(2));
    span.setAttribute("data-val", time.gt(2));
    span.setAttribute("data-stat", "R");
    span.setAttribute("data-holediv", "1");
    span.setAttribute("href", "#");
    document.body.appendChild(span);
    span.click();
  }
  function funcExec() {
    log("funcExec");
    const tag = localStorage.getItem("TZ_EXEC");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_EXEC", new Date().getTime());

    $('#f_player_cnt').val('4');
    btnSubmit.click();
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
