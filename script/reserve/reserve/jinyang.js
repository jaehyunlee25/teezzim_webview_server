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
  if(addr.indexOf("#") != -1) addr = addr.split("#")[0];

  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://m.chinyangvalley.co.kr/index.asp": funcMain,
    "http://m.chinyangvalley.co.kr/info/reservation.asp": funcExec,
    "http://m.chinyangvalley.co.kr/info/reserCheck.asp": funcList,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    Hill: "힐",
    Creek: "크리크",
    Valley: "밸리",
  };
  const fulldate = [year, month, date].join("");

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
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcOther() {
    log("funcOther");
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
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      onClickDay(fulldate);
      timer(2000, funcTime);
    });
  }
  function funcTime() {
    log("funcTime");
    const els = document.gcn("blueBtn");
    let target;
    els.every((el) => {
      const param = el.parentNode.parentNode.children;
      const elTime = param[1].innerText.rm(":");
      const elCourse = param[0].innerText;
      log(elTime, time, elCourse, dictCourse[course]);
      log(elTime == time, elCourse == dictCourse[course]);
      if (elTime == time && elCourse == dictCourse[course]) target = el;

      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
      /* timer(1000, funcExec); */
    } else {
      LOGOUT();
    }
  }
  function funcExec() {
    log("funcExec");
    const el = document.gcn("blueBtn")[0].children[0];
    el.click();
    /* document.gcn("cm_btn default")[0].click();
    setTimeout(LOGOUT, 1000); */
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
    doLogout();
  }
})();
