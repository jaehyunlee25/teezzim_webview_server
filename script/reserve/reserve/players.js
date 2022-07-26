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
    "https://m.playersgc.com/_mobile/index.asp": funcMain,
    "https://m.playersgc.com/_mobile/reservation/list.asp": funcList,
    "https://m.playersgc.com/_mobile/login/logout.asp": funcOut,
    "https://m.playersgc.com/_mobile/reservation/real_timelist.asp": funcTime,
    "https://m.playersgc.com/_mobile/reservation/real_request.asp": funcExec,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    VALLEY: "VALLEY",
    LAKE: "LAKE",
    MOUNTAIN: "MOUNTAIN",
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
    const suffix = location.href.split("#")[1];
    if(!suffix) {
      location.href = addr + "#layout=3&membership=&year=" + year + "&month=" + (month * 1) + "&timezone=&course=&date=";
      return;
    }    

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
    });

    const els = document.gcn("reservation_request_button");
    log("els", els, els.length);

    let target;
    els.every((el) => {
      const elDate = el.attr("date");

      log("elDate", elDate);
      if (elDate == fulldate) target = el;
      return !target;
    });

    log("target", target);
    if (target) {
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

    const els = document.gcn("timelist_reservation_button");
    log("els", els, els.length);
    
    let target;
    Array.from(els).every((el) => {
      const param = el.parentNode.parentNode.children[0];
      const elTime = param.children[2].str();
      const elCourse = param.children[0].str();
      const sign = dictCourse[course];

      log(elTime, time, elCourse, sign);
      log(elTime == time, elCourse == sign);
      if (elTime == time && elCourse == sign) target = el;

      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
    } else {
      LOGOUT();
    }
  }
  function funcExec() {
    log("funcExec");
    reservation_request_ok_button.click();
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
    location.href = "/auth/logout";
  }
})();
