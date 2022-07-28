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
    "https://www.adelscott.co.kr/_mobile/index.asp": funcMain,
    "https://www.adelscott.co.kr/_mobile/login/logout.asp": funcOut,
    "https://www.adelscott.co.kr/_mobile/GolfRes/onepage/my_golfreslist.asp": funcList,
    "http://m2.gtc.co.kr/BookingAdd.aspx": funcTime,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    In: "1",
    Out: "2",
  };
  const fulldate = [year, month, date].join("-");

  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    funcEnd();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
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
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const tag = localStorage.getItem("TZ_RESERVE") * 1;    
    if(tag && (new Date().getTime() - tag) < 1000 * 10) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());
    
    TZLOG(logParam, (data) => {});
    location.href = "/BookingAdd.aspx?Date=" + fulldate;
  }
  function funcTime() {
    log("funcTime");
    
    timer(2000, exec);
    function exec() {
      log("Booking_Detail", Booking_Detail.style.display);
      if(Booking_Detail.style.display == "none") {
        const fd = [year.ch(2), month, date].join("");
        const key = [fd, time, dictCourse[course]].join("");
        
        log("key", key);
        let target = window[key];
        log("taraget", target);
  
        if (target) {
          target.click();
        } else {
          funcEnd();
        }
      } else if(Booking_Detail.style.display == "block") {
        funcExec();
      }
    }
  }
  function funcExec() {
    log("funcExec");
    btn_Save.click();    
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
  }
})();
