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
    TZLOG(logParam, (data) => {
      setTimeout(funcSearch, 1000);
    });
  }
  function funcSearch() {
    const els = resHisListDiv.getElementsByTagName("li");
    const result = [];
    const dictCourse = {
      ALPS: "ALPS",
      ASIA: "ASIA",
    };
    Array.from(els).forEach((el) => {
      const param = el.getElementsByTagName("button")[2].getAttribute("onclick").inparen();
      if(param[0] != "J51") return;

      const date = param[1];
      const time = param[5];
      const course = param[3];
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
        const ac = window.AndroidController;
        if (ac) ac.message("end of reserve/search");
        location.href = "/member/logout";
      });
    });
  }
})();
