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

    const tag = localStorage.getItem("TZ_LOGOUT");
    if(tag && (new Date().getTime() - tag) < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcSearch();
    });
  }
  function funcSearch() {
    const els = document.getElementsByClassName("btn btn-danger");
    const result = [];
    const dictCourse = {};
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const date = param[2];
      const time = param[3];
      const course = param[4];
      console.log("reserve search", course, date, time);
      result.push({ date, time, course });
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
      location.href = "/login/logout.asp";
    });
  }
})();
