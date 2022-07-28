javascript: (() => {
  ${commonScript}
  const addr = location.href;
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.eodeungsancc.com/mobile/index.asp": funcMain,
    "https://www.eodeungsancc.com/mobile/login.asp": funcOut,
    "https://www.eodeungsancc.com/mobile/reservation_confirm.asp": funcList,
    "https://www.eodeungsancc.com/mobile/reservation_02.asp": funcTime,
    "https://www.eodeungsancc.com/mobile/reservation_03.asp": funcExec,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = { 
    어등: "1", 
    송정: "2", 
    하남: "3" 
  };

  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    lss("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = lsg("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_MAIN", new Date().getTime());

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
    
    const tag = lsg("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    lss("TZ_RESERVE", new Date().getTime());
    
    TZLOG(logParam, (data) => {});
    Date_Click(year, month, date);
  }
  function funcTime() {
    log("funcTime");

    const fulldate = [year, month, date].join("");    
    Book_Confirm(fulldate, "", dictCourse[course], course, time, "2");
  }
  function funcExec() {
    log("funcExec");

    doc.gcn("btn_reserve")[0].children[0].click();
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
    location.href = "/mobile/login.asp";
  }
})();
