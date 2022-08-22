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
    "${reserveUrl}": funcCancel,
    "http://www.360cc.co.kr/mobile/main/mainPage.do": funcMain,
    "http://www.360cc.co.kr/mobile/user/sign/Logout.do": funcOut,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];

  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcMain");
    
    funcEnd();
    return;
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = lsg("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = lsg("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    funcCancel();
  }
  function funcCancel() {
    log("funcSearch");

    const els = doc.gcn("cm_time_list_tbl")[0].gtn("tbody")[0].gtn("tr");
    const dictCourse = {
      1: "Out",
      2: "IN",
    };
    let target;
    Array.from(els).every((el) => {
      const btn = el.children[3].children[0];
      const [elTime, elCourse, elDate] = btn.attr("onclick").inparen();

      log("reserve cancel", elCourse, elDate, elTime);
      const fulldate = [year, month, date].join("");
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = btn;

      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
      reservation_cancel_ok();
    } else {
      LOGOUT();
    }
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/mobile/user/sign/Logout.do";
  }
})();
