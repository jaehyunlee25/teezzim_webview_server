javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/reserve",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/search",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcSearch();
    });
  }
  function funcSearch() {
    const els = document.getElementsByClassName("cm_qusrud");
    const result = [];
    const dictCourse = {
      66: "Buona",
      77: "Hopark",
      33: "Lago",
      22: "Bella",
      11: "Monti",
    };
    Array.from(els).forEach((el) => {
      const param = el.children[0].getAttribute("onclick").inparen();
      const date = param[0];
      const time = param[2];
      const mCourse = param[1];
      console.log("reserve search", dictCourse[mCourse], date, time);
      result.push({ date, time, course: dictCourse[mCourse] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      console.log(data);
      logParam.message = "end of reserve/search";
      TZLOG(logParam, (data) => {
        log(data);
      });
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/search");
      location.href = "/Mobile/Member/LogOut";
    });
  }
})();