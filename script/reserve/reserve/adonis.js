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
  if (addr.indexOf("#") != -1) addr = location.href.split("#")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.adoniscc.co.kr/": funcMain,
    "https://www.adoniscc.co.kr/booking/history": funcList,
    "https://www.adoniscc.co.kr/auth/logout": funcOut,
    /* "https://www.adoniscc.co.kr/Mobile/Booking/ReservationCheck": funcExec, */
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    단일: "A",
  };

  const fulldate = [year, month, date].join("");
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    const tag = localStorage.getItem("TZ_LIST");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LIST", new Date().getTime());

    LOGOUT();
    return;
  }
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

    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_OTHER", new Date().getTime());

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
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {log(data)});

    const els = document.gcn("booking-calendar table table-bordered date-info")[0].gtn("a");
    let target;
    els.every(el => {
      const elDate = el.attr("data-date");

      log("elDate", elDate)
      if(elDate == fulldate) target = el;
      return !target;
    });

    log("target", target);
    if(target) {
      target.click();
      setTimeout(funcTime, 2000);
    } else {
      LOGOUT();
    }
  }
  function funcTime() {
    log("funcTime");

    const tag = localStorage.getItem("TZ_TIME");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_TIME", new Date().getTime());

    const sign = dictCourse[course];
    const els = document.gcn("booking-time-table table")[0].gtn("tbody")[0].gtn("tr");
    log("els", els, els.length);

    let target;
    Array.from(els).every((el) => {
      const param = el.gtn("button")[0];
      const elDate = param.attr("data-date");
      const elTime = param.attr("data-time");
      const elCourse = param.attr("data-cours");
      log(elDate, fulldate, elTime, time, elCourse, sign);
      log(elDate == fulldate, elTime == time, elCourse == sign);
      if (elDate == fulldate && elTime == time && elCourse == sign) target = param;

      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
      setTimeout(() => {
        document.gcn("buttons")[0].gcn("btn btn-primary")[0].click();
      }, 1000);
    }
  }
  function funcExec() {
    log("funcExec");
    setTimeout(() => {
      document.getElementsByClassName("colBlue")[0].click();
    }, 2000);
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
    redirect('/auth/logout');
  }
})();
