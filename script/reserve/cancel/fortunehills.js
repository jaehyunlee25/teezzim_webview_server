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
    "https://www.fortunehills.co.kr/Mobile/": funcMain,
    "https://www.fortunehills.co.kr/Mobile/Member/LogOut.aspx": funcOut,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();

  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcMain() {
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcCancel();
    });
  }
  function funcCancel() {
    const els = document.gcn("bt_reserved_off");
    const dictCourse = {
      11: "가든",
      22: "팰리스",
      33: "캐슬",
    };
    let target;
    Array.from(els).forEach((el) => {
      if(el.children[0].str() == "동반자") return;
      const param = el.children[0].attr("href").inparen();
      const elDate = param[0];
      const elTime = param[1];
      const elCourse = param[2];
      console.log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = el.children[0];
    });
    if (target) {
      target.click();
    } else {
      funcEnd();
    }
  }
  function funcEnd() {
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      if (ac) ac.message(strEnd);      
    });
  }
  function LOGOUT() {
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();
