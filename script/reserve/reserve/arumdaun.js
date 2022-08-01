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
  const suffix = location.href.split("?")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const day = week[new Date([year, month, date].join("/")).getDay()];
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://m2.arumdaunresort.com/main.asp": funcMain,
    "http://m2.arumdaunresort.com/reserve_confirm1.asp": funcList,
    "http://m2.arumdaunresort.com/reserve_02_Book.asp": funcTime,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    Hill: "1",
    Lake: "2",
    Rock: "3",
  };
  const fulldate = [year, month, date].join("");

  if (!func) funcOther();
  else func();
  
  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcMain() {
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    Date_Click("B", fulldate);
  }
  function funcTime() {
    log("funcTime");

    if (!suffix) {
      const els = doc.gcn("btn02");
      
      let target;
      Array.from(els).every((el) => {
        const param = el.attr("href").inparen();
        const elCourse = param[2];
        const elTime = param[4];

        log(dictCourse[course] == elCourse, time == elTime);
        log(dictCourse[course], elCourse, time, elTime);
        if (dictCourse[course] == elCourse && time == elTime) target = el;

        return !target;
      });

      log("target", target);
      if (target) {
        target.click();
      } else {
        LOGOUT()
      }
      
    } else {
      funcExec();
    }   
  }
  function funcExec() {
    log("funcExec");

    const strEnd = "end of reserve/reserve";
    const cfrmNo = document.getElementsByName("apply_no")[0].value;
    document.getElementsByName("apply_no_re")[0].value = cfrmNo;
    document.getElementsByClassName("btn002")[0].click();
    
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

    checkLogOut();
  }
})();
