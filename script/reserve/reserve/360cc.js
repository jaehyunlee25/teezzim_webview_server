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
    "http://www.360cc.co.kr/mobile/main/mainPage.do": funcMain,
    "http://www.360cc.co.kr/mobile/user/sign/Logout.do": funcOut,
    "http://www.360cc.co.kr/mobile/reservation/my_golfreslist.do": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = { 
    Out: "1", 
    In: "2" 
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

    location.href = "${searchUrl}";
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

    const signCourse = { Out: "1", In: "2" };
    TZLOG(logParam, (data) => {});
    timefrom_change(fulldate, "2", "1", "", "00", "T");
    timer(2000, funcTime);
  }
  function funcTime() {
    log("funcTime");

    const els = doc.gcn("cm_time_list_tbl")[0].gtn("tbody")[0].gtn("tr");
    log("els", els, els.length);
    
    let target;
    Array.from(els).every((el) => {
      const param = el.attr("onclick").inparen();
      const [ , elCourse, elTime] = param;

      log(dictCourse[course] == elCourse, time == elTime);
      log(dictCourse[course], elCourse, time, elTime);
      
      if (dictCourse[course] == elCourse && time == elTime) 
        target = el;
      
      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
      timer(500, funcExec);
    } else {
      LOGOUT();
    }
  }
  function funcExec() {
    log("funcExec");

    agree_chk.checked = true;
    golfsubcmd("R");
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
    location.href = "/mobile/user/sign/Logout.do";
  }
})();
