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
    "https://www.hanmircc.com/MyPage/ReservedList": funcList,
    "https://www.hanmircc.com/Member/Logout": funcOut,
    "https://www.hanmircc.com/Reservation/ReservCheck": funcExec,
    "https://www.hanmircc.com/": funcMain,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    단일: "11",
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
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());


    TZLOG(logParam, (data) => {log(data)});
    timer(1000, () => {
      change_calendar(fulldate, 'today');
      timer(1000, funcTime);
    });
  }
  function funcTime() {
    log("funcTime");

    const tag = localStorage.getItem("TZ_TIME");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_TIME", new Date().getTime());

    const sign = dictCourse[course];
    const els = document.gcn("btn");
    log("els", els, els.length);

    let target;
    Array.from(els).every((el) => {
      const tds = el.parentNode.parentNode.children;
      const elTime = tds[1].str().rm(":");

      log(elTime, time);
      log(elTime == time);
      if (elTime == time) target = el;

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
    setTimeout(() => {
      document.gcn("colBlue")[0].click();
    }, 1000);
  }
  function funcNext() {
    log("funcNext");
    setTimeout(() => {
      document.getElementsByName("agreeAll")[0].click();
      sendit();
    }, 1000);
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
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
