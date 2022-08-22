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
    "https://www.blueone.com/member/login.jsp": funcLogin,
    "https://market.blueone.com/shop/golf/step1.jsp": funcReserve,
    "https://market.blueone.com/shop/golf/list_reserve.jsp":
      funcList,
    "https://market.blueone.com/shop/common/file/logout.jsp": funcOut,
    "https://market.blueone.com/shop/golf/step2.jsp": funcExec,
    "https://market.blueone.com/shop/golf/step3.jsp": funcNext,
    "https://market.blueone.com/shop/golf/step4.jsp": funcLast,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    East: "동코스",
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

    timer(1000, exec);
    function exec() {
      const els = document.gcn("jsClickDay jsTipOn");
      let target;
      els.every(el => {
        const elDate = el.attr("data-date");
  
        log(elDate, fulldate);
        if(elDate == fulldate) target = el;
        return !target;
      });
  
      log("target", target);
      if(target) {
        target.click();
        setTimeout(funcTime, 2000);
      }
    }
  }
  function funcTime() {
    log("funcTime");

    const tag = localStorage.getItem("TZ_TIME");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_TIME", new Date().getTime());

    const sign = dictCourse[course];
    const els = document.gcn("golf_time")[0].gtn("a");
    log("els", els, els.length);

    let target;
    Array.from(els).every((el) => {
      const elTime = el.attr("data-time").rm(":");
      const elCourse = el.attr("data-cose");

      log(elTime, time, elCourse, sign);
      log(elTime == time, elCourse == sign);
      if (elTime == time && elCourse == sign) target = el;

      return !target;
    });
    log("target", target);
    if (target) {
      target.click();
      setTimeout(() => {
        jsBtmNext.click();
      }, 500);
    }
  }
  function funcExec() {
    log("funcExec");
    setTimeout(() => {
      document.getElementsByClassName("btn_w")[0].children[1].click();
    }, 1000);
  }
  function funcNext() {
    log("funcNext");
    setTimeout(() => {
      document.getElementsByName("agreeAll")[0].click();
      sendit();
    }, 1000);
  }
  function funcLast() {
    log("funcLast");
    LOGOUT();
    return;
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
