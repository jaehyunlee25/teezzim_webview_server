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
    "${reserveUrl}": funcReserve,
    "http://www.acrogolf.co.kr/mobile/index.asp": funcMain,
    "http://www.acrogolf.co.kr/mobile/logout.asp": funcOut,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
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

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const els = document
    .getElementsByClassName("typeA text-center")[0]
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("a");
    
    const result = [];
    const dictCourse = {
      챌린지: 1,
      마스터: 2,
      스카이: 3,
    };
    let target;
    Array.from(els).forEach((el) => {
      const [btnDate, , btnCourse, btnTime] = el
      .getAttribute("onclick")
      .inparen();
      console.log("reserve search", course, date, time);
      const fulldate = [year, month, date].join("");
      if (
        btnDate == fulldate &&
        btnCourse == dictCourse[course] &&
        btnTime == time
        )
        target = el;
      });
      
      log("target", target);
      if (target) target.click();    
      else LOGOUT();
      
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
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
