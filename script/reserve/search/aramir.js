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
    if(tag == "true") {
      localStorage.removeItem("TZ_LOGOUT");
      return;
    }
    TZLOG(logParam, (data) => {
      log(data);
      funcSearch();
    });
  }
  function funcSearch() {
    const els = document.getElementsByClassName("reser_btn4");
    const result = [];
    const dictCourse = {
      22: "In",
      11: "Out",
    };
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const date = param[0].split("-").join("");
      const time = param[1];
      const course = param[2];
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
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
      localStorage.setItem("TZ_LOGOUT", "true");
      location.href = "/Mobile/member/LogOut.aspx";
    });
  }
})();
