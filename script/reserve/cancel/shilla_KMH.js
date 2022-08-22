javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/cancel",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/cancel",
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
    /* "https://www.dongchongc.co.kr:442/Mobile": funcMain, */
    "https://shilla.kmhleisure.com/Mobile/Member/LogOut.aspx": funcOut,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  if (!func) funcOther();
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

    location.href = "${reserveUrl}";
  }
  function funcOther() {
    log("funcOther");
    if(addr.split("#")[1] == "c") {
      funcExec();
      return;
    }
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      setTimeout(funcCancel, 1000);
    });
  }
  function funcCancel() {
    log("funcCancel");

    const els = document.gcn("reserveList")[0].gtn("a");
    log("els", els, els.length);
    const dictCourse = {
      11: "서",
      22: "남",
      33: "동",
    };
    let target;
    Array.from(els).every((el) => {
      if(el.str() != "취소") return true;

      const param = el.attr("href").inparen();
      const elCompany = param[9];
      if(elCompany != "160") return true;

      const elDate = param[0];
      const elTime = param[1];
      const elCourse = param[2];  

      log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");

      log(elDate, fulldate, course, elTime, time);
      if (
        elDate == fulldate &&
        elTime == time &&
        dictCourse[elCourse] == course
      )
        target = el;

      return !target;  
    });

    log("target", target);
    if (target) {
      target.click();
      timer(500, funcExec);
    } else {
      LOGOUT()
    }
  }
  function funcExec() {
    setTimeout(() => {
      strCancelMsg.value = "cancel";
      btnResveCancel.click();
    }, 1000);
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
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
