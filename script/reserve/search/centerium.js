javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/search",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/search",
    parameter: JSON.stringify({}),
  };
  log("raw addr :: ", location.href);
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
  };
  log("addr", addr);
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {
    log("funcLogin");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      location.href = "${reserveUrl}";
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());
    
    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      setTimeout(funcSearch, 1000);
    });
  }
  function funcSearch() {
    log("funcSearch");
    const els = tab1DataContainer.getElementsByClassName("courseTime");
    const result = [];
    const dictCourse = {
      A: "England",
      B: "Scotland",
      C: "Wales",
    };
    Array.from(els).forEach((el) => {
      const param = el.innerText;
      const elDate = "20" + /[0-9]{2}\/[0-9]{2}/.exec(param)[0].split("/").join("");
      const elTime = /[0-9]{2}\:[0-9]{2}/.exec(param)[0].split(":").join("");
      const elCourse = /[A-Za-z]+/.exec(param)[0];
      console.log("reserve search", elCourse, elDate, elTime);
      result.push({ date: elDate, time: elTime, course: elCourse });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      console.log(data);
      funcEnd();
    });
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "/_mobile/login/logout.asp";
  }
})();
