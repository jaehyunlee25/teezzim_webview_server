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
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://m.sky72.com/index.jsp": funcMain,
    "https://m.sky72.com/login/action/logout.jsp": funcOut,
    "https://m.sky72.com/reservation/real_step02.jsp": funcTime,
    "https://m.sky72.com/reservation/real_step03.jsp": funcExec,
    "https://m.sky72.com/reservation/my_reservation.jsp": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    하늘: "0",
    레이크: "1",
    클래식: "2",
    오션: "3",
  };
  const fulldate = [year, month, date].join("-");
  
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
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
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

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    timer(1000, exec);
    function exec() {
      TZLOG(logParam, (data) => {});
      const els = doc.gtn("td").filter(td => (
          td.str() != '마감' 
          && td.attr("onclick") 
          && td.attr('onclick').inparen()[1] * 1 < 4
        ));
      log("els", els, els.length);
  
      let target;
      Array.from(els).every(el => {
        if(!el.attr("href")) return true;
  
        const param = el.attr("href").inparen();
        const [elDate, elCourse] = param;
        const sign = dictCourse[course];
  
        log(elDate, date, elCourse, sign);
        log(fulldate == elDate, elCourse == sign);
        if(fulldate == elDate && elCourse == sign) target = el;
  
        return !target;
      });
  
      log("target", target);
      if(target) target.click();
    };

  }
  function funcTime() {
    log("funcTime");

    timer(1000, exec);

    function exec() {
      const els = doc.gcn("timeListCls");
      log("els", els, els.length);
      
      let target;
      Array.from(els).every((el) => {
        const param = el.attr("onclick").inparen();
        const [, , elTime] = param;
  
        log(time == elTime);
        log(time, elTime);
        
        if (time == elTime) target = el;
  
        return !target;
      });
  
      log("target", target);
      if (target) {
        target.click();
      } else {
        LOGOUT();
      }
    }
  }
  function funcExec() {
    log("funcExec");
    goNext();
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
    location.href = "/_mobile/login/logout.asp";
  }
})();
