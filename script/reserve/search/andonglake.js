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
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_RESERVE") * 1;    
    if(tag && (new Date().getTime() - tag) < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());
    TZLOG(logParam, (data) => {
      funcSearch();
    });
  }
  function funcSearch() {
    const els = document.getElementsByClassName("ui-btn ui-btn-up-c ui-btn-corner-all ui-btn-icon-left");
    const result = [];
    const dictCourse = {
      1: "In",
      2: "Out",
    };
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("for");
      if(!param) return;
      const date = "20" + param.gh(6);
      const time = param.ch(6).gh(4);
      const course = param.gt(1);
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      device_id: "${deviceId}",
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
    });
  }
})();
